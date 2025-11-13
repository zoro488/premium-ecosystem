/**
 * 🔐 SERVICIO DE AUDITORÍA Y SEGURIDAD
 * Implementa logging, rate limiting y tracking de operaciones críticas
 */
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase.config';

// ============================================================
// 📝 TIPOS
// ============================================================

export interface AuditLog {
  id?: string;
  timestamp: any;
  userId: string;
  userEmail: string;
  action: string;
  resource: string;
  resourceId: string;
  details: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  status: 'success' | 'error' | 'warning';
  errorMessage?: string;
}

export interface RateLimitEntry {
  userId: string;
  action: string;
  timestamp: number;
  count: number;
}

// ============================================================
// 🔒 RATE LIMITING
// ============================================================

const rateLimitStore = new Map<string, RateLimitEntry>();

/**
 * Configuración de límites por acción (operaciones por minuto)
 */
const RATE_LIMITS: Record<string, number> = {
  crearOrdenCompra: 10,
  registrarVenta: 20,
  pagarDistribuidor: 15,
  pagarCliente: 20,
  transferirEntreBancos: 10,
  registrarGasto: 15,
  registrarIngreso: 15,
  default: 30, // Límite general para otras operaciones
};

/**
 * Verificar si un usuario excede el rate limit para una acción
 * @param userId ID del usuario
 * @param action Nombre de la acción
 * @returns true si está dentro del límite, false si excede
 */
export function checkRateLimit(userId: string, action: string): boolean {
  const key = `${userId}:${action}`;
  const now = Date.now();
  const limit = RATE_LIMITS[action] || RATE_LIMITS.default;
  const windowMs = 60 * 1000; // 1 minuto

  const entry = rateLimitStore.get(key);

  if (!entry) {
    // Primera petición
    rateLimitStore.set(key, {
      userId,
      action,
      timestamp: now,
      count: 1,
    });
    return true;
  }

  // Verificar si estamos en la misma ventana de tiempo
  if (now - entry.timestamp < windowMs) {
    if (entry.count >= limit) {
      return false; // Excede el límite
    }
    entry.count++;
    return true;
  }

  // Nueva ventana de tiempo
  entry.timestamp = now;
  entry.count = 1;
  return true;
}

/**
 * Obtener información del rate limit para un usuario y acción
 */
export function getRateLimitInfo(userId: string, action: string): {
  remaining: number;
  resetAt: Date;
} {
  const key = `${userId}:${action}`;
  const limit = RATE_LIMITS[action] || RATE_LIMITS.default;
  const entry = rateLimitStore.get(key);

  if (!entry) {
    return {
      remaining: limit,
      resetAt: new Date(Date.now() + 60 * 1000),
    };
  }

  const remaining = Math.max(0, limit - entry.count);
  const resetAt = new Date(entry.timestamp + 60 * 1000);

  return { remaining, resetAt };
}

// ============================================================
// 📝 AUDIT LOGGING
// ============================================================

/**
 * Registrar una operación en el log de auditoría
 */
export async function logAudit(log: Omit<AuditLog, 'id' | 'timestamp'>): Promise<void> {
  try {
    const auditLog: Omit<AuditLog, 'id'> = {
      ...log,
      timestamp: serverTimestamp(),
      ipAddress: log.ipAddress || 'unknown',
      userAgent: log.userAgent || navigator.userAgent || 'unknown',
    };

    await addDoc(collection(db, 'audit_logs'), auditLog);

    // También log a consola en desarrollo
    if (import.meta.env.DEV) {
      console.log('[AUDIT]', {
        action: log.action,
        resource: log.resource,
        status: log.status,
        user: log.userEmail,
      });
    }
  } catch (error) {
    // No fallar la operación principal si el logging falla
    console.error('[AUDIT ERROR]', error);
  }
}

/**
 * Helper para crear logs de éxito
 */
export async function logSuccess(
  userId: string,
  userEmail: string,
  action: string,
  resource: string,
  resourceId: string,
  details: Record<string, any> = {}
): Promise<void> {
  await logAudit({
    userId,
    userEmail,
    action,
    resource,
    resourceId,
    details,
    status: 'success',
  });
}

/**
 * Helper para crear logs de error
 */
export async function logError(
  userId: string,
  userEmail: string,
  action: string,
  resource: string,
  resourceId: string,
  error: Error | string,
  details: Record<string, any> = {}
): Promise<void> {
  await logAudit({
    userId,
    userEmail,
    action,
    resource,
    resourceId,
    details,
    status: 'error',
    errorMessage: error instanceof Error ? error.message : error,
  });
}

/**
 * Helper para crear logs de advertencia
 */
export async function logWarning(
  userId: string,
  userEmail: string,
  action: string,
  resource: string,
  resourceId: string,
  message: string,
  details: Record<string, any> = {}
): Promise<void> {
  await logAudit({
    userId,
    userEmail,
    action,
    resource,
    resourceId,
    details: { ...details, warning: message },
    status: 'warning',
  });
}

// ============================================================
// 🛡️ DECORADORES DE VALIDACIÓN
// ============================================================

/**
 * Wrapper para validar rate limit antes de ejecutar una función
 */
export function withRateLimit<T extends (...args: any[]) => Promise<any>>(
  action: string,
  fn: T
): T {
  return (async (...args: Parameters<T>): Promise<ReturnType<T>> => {
    // Aquí deberías obtener el userId del contexto de autenticación
    // Por ahora usamos un placeholder
    const userId = 'current_user_id'; // TODO: Obtener del contexto de auth

    if (!checkRateLimit(userId, action)) {
      const info = getRateLimitInfo(userId, action);
      throw new Error(
        `Rate limit excedido para ${action}. Intenta de nuevo en ${Math.ceil((info.resetAt.getTime() - Date.now()) / 1000)} segundos.`
      );
    }

    return fn(...args);
  }) as T;
}

/**
 * Wrapper para añadir audit logging automático a funciones
 */
export function withAuditLog<T extends (...args: any[]) => Promise<any>>(
  action: string,
  resource: string,
  fn: T
): T {
  return (async (...args: Parameters<T>): Promise<ReturnType<T>> => {
    const userId = 'current_user_id'; // TODO: Obtener del contexto de auth
    const userEmail = 'current_user@email.com'; // TODO: Obtener del contexto de auth

    try {
      const result = await fn(...args);

      // Log de éxito
      await logSuccess(userId, userEmail, action, resource, result?.id || 'unknown', {
        args: args.map((arg) => (typeof arg === 'object' ? '...' : arg)),
      });

      return result;
    } catch (error) {
      // Log de error
      await logError(
        userId,
        userEmail,
        action,
        resource,
        'unknown',
        error as Error,
        {
          args: args.map((arg) => (typeof arg === 'object' ? '...' : arg)),
        }
      );

      throw error;
    }
  }) as T;
}

// ============================================================
// 📊 ESTADÍSTICAS
// ============================================================

/**
 * Obtener estadísticas de uso del rate limiter
 */
export function getRateLimitStats(): {
  totalUsers: number;
  activeActions: string[];
  entries: Array<{ key: string; count: number; remaining: number }>;
} {
  const entries: Array<{ key: string; count: number; remaining: number }> = [];
  const users = new Set<string>();
  const actions = new Set<string>();

  rateLimitStore.forEach((entry, key) => {
    users.add(entry.userId);
    actions.add(entry.action);

    const limit = RATE_LIMITS[entry.action] || RATE_LIMITS.default;
    entries.push({
      key,
      count: entry.count,
      remaining: Math.max(0, limit - entry.count),
    });
  });

  return {
    totalUsers: users.size,
    activeActions: Array.from(actions),
    entries,
  };
}

/**
 * Limpiar entradas expiradas del rate limiter
 */
export function cleanupRateLimitStore(): number {
  const now = Date.now();
  const windowMs = 60 * 1000;
  let cleaned = 0;

  rateLimitStore.forEach((entry, key) => {
    if (now - entry.timestamp > windowMs) {
      rateLimitStore.delete(key);
      cleaned++;
    }
  });

  return cleaned;
}

// Ejecutar limpieza cada 5 minutos
if (typeof window !== 'undefined') {
  setInterval(cleanupRateLimitStore, 5 * 60 * 1000);
}
