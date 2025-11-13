/**
 * 🛠️ UTILIDADES AVANZADAS PREMIUM
 * Funciones utilitarias optimizadas para FlowDistributor
 */

// ============================================================================
// UTILIDADES DE ESTILOS
// ============================================================================

/**
 * Combina clases CSS de manera inteligente
 */
export function cn(...inputs) {
  return inputs.filter(Boolean).join(' ');
}

// ============================================================================
// UTILIDADES DE FORMATO
// ============================================================================

/**
 * Formatea números como moneda con configuración avanzada
 */
export function formatCurrency(value, options = {}) {
  const {
    currency = 'USD',
    locale = 'es-MX',
    minimumFractionDigits = 2,
    maximumFractionDigits = 2,
    compact = false,
  } = options;

  const formatter = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits,
    maximumFractionDigits,
    notation: compact ? 'compact' : 'standard',
  });

  return formatter.format(value);
}

/**
 * Formatea números con separadores de miles
 */
export function formatNumber(value, options = {}) {
  const {
    locale = 'es-MX',
    minimumFractionDigits = 0,
    maximumFractionDigits = 2,
    compact = false,
  } = options;

  const formatter = new Intl.NumberFormat(locale, {
    minimumFractionDigits,
    maximumFractionDigits,
    notation: compact ? 'compact' : 'standard',
  });

  return formatter.format(value);
}

/**
 * Formatea porcentajes
 */
export function formatPercentage(value, options = {}) {
  const {
    locale = 'es-MX',
    minimumFractionDigits = 1,
    maximumFractionDigits = 2,
  } = options;

  const formatter = new Intl.NumberFormat(locale, {
    style: 'percent',
    minimumFractionDigits,
    maximumFractionDigits,
  });

  return formatter.format(value / 100);
}

/**
 * Formatea fechas de manera inteligente
 */
export function formatDate(date, options = {}) {
  const {
    locale = 'es-MX',
    style = 'medium',
    relative = false,
  } = options;

  const dateObj = typeof date === 'string' ? new Date(date) : date;

  if (relative) {
    const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });
    const diffMs = dateObj.getTime() - Date.now();
    const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

    if (Math.abs(diffDays) < 7) {
      return rtf.format(diffDays, 'day');
    }
  }

  if (options.dateStyle || options.timeStyle) {
    return new Intl.DateTimeFormat(locale, {
      dateStyle: options.dateStyle,
      timeStyle: options.timeStyle,
    }).format(dateObj);
  }

  const formatter = new Intl.DateTimeFormat(locale, {
    dateStyle: style,
  });

  return formatter.format(dateObj);
}

// ============================================================================
// UTILIDADES DE VALIDACIÓN
// ============================================================================

/**
 * Valida si un valor es un número válido
 */
export function isValidNumber(value) {
  return typeof value === 'number' && !isNaN(value) && isFinite(value);
}

/**
 * Valida si una fecha es válida
 */
export function isValidDate(value) {
  return value instanceof Date && !isNaN(value.getTime());
}

/**
 * Valida si un string no está vacío
 */
export function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

// ============================================================================
// UTILIDADES DE ARRAYS Y OBJETOS
// ============================================================================

/**
 * Agrupa un array por una propiedad específica
 */
export function groupBy(array, key) {
  return array.reduce((groups, item) => {
    const groupKey = String(item[key]);
    if (!groups[groupKey]) {
      groups[groupKey] = [];
    }
    groups[groupKey].push(item);
    return groups;
  }, {});
}

/**
 * Calcula la suma de una propiedad numérica en un array
 */
export function sumBy(array, key) {
  return array.reduce((sum, item) => {
    const value = item[key];
    return sum + (typeof value === 'number' ? value : 0);
  }, 0);
}

/**
 * Calcula el promedio de una propiedad numérica en un array
 */
export function averageBy(array, key) {
  if (array.length === 0) return 0;
  return sumBy(array, key) / array.length;
}

/**
 * Encuentra el valor máximo de una propiedad numérica
 */
export function maxBy(array, key) {
  return Math.max(...array.map(item => {
    const value = item[key];
    return typeof value === 'number' ? value : -Infinity;
  }));
}

/**
 * Encuentra el valor mínimo de una propiedad numérica
 */
export function minBy(array, key) {
  return Math.min(...array.map(item => {
    const value = item[key];
    return typeof value === 'number' ? value : Infinity;
  }));
}

// ============================================================================
// UTILIDADES DE PERFORMANCE
// ============================================================================

/**
 * Debounce function optimizada
 */
export function debounce(func, wait) {
  let timeout;

  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Throttle function optimizada
 */
export function throttle(func, limit) {
  let inThrottle;

  return (...args) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// ============================================================================
// UTILIDADES DE COLOR
// ============================================================================

/**
 * Genera un color basado en un hash string
 */
export function generateColorFromString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  const hue = hash % 360;
  return `hsl(${hue}, 70%, 50%)`;
}

/**
 * Convierte HEX a RGB
 */
export function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

// ============================================================================
// UTILIDADES DE ANIMACIÓN
// ============================================================================

/**
 * Configuraciones de animación predefinidas para Framer Motion
 */
export const animations = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.3 }
  },
  slideUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.4, ease: "easeOut" }
  },
  slideDown: {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 },
    transition: { duration: 0.4, ease: "easeOut" }
  },
  slideLeft: {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
    transition: { duration: 0.4, ease: "easeOut" }
  },
  slideRight: {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
    transition: { duration: 0.4, ease: "easeOut" }
  },
  scale: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9 },
    transition: { duration: 0.3, ease: "easeOut" }
  },
  bounce: {
    initial: { opacity: 0, scale: 0.3 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.3 },
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94],
      scale: { type: "spring", damping: 8, stiffness: 100 }
    }
  }
};

// ============================================================================
// UTILIDADES DE ESTADO
// ============================================================================

/**
 * Genera un ID único
 */
export function generateId(prefix = 'id') {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Sleep function para delays
 */
export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ============================================================================
// UTILIDADES DE LOCAL STORAGE
// ============================================================================

/**
 * Safe localStorage con manejo de errores
 */
export const storage = {
  get(key, defaultValue) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch {
      return defaultValue;
    }
  },

  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch {
      return false;
    }
  },

  remove(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch {
      return false;
    }
  }
};

// ============================================================================
// UTILIDADES DE ERROR HANDLING
// ============================================================================

/**
 * Wrapper para manejo seguro de errores
 */
export async function safeAsync(promise) {
  try {
    const data = await promise;
    return [data, null];
  } catch (error) {
    return [null, error instanceof Error ? error : new Error(String(error))];
  }
}

/**
 * Retry function con backoff exponencial
 */
export async function retry(fn, options = {}) {
  const { retries = 3, delay = 1000, backoff = 2 } = options;

  let lastError;

  for (let i = 0; i <= retries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      if (i === retries) {
        throw lastError;
      }

      await sleep(delay * Math.pow(backoff, i));
    }
  }

  throw lastError;
}

// ============================================================================
// UTILIDADES DE FORMATO
// ============================================================================

/**
 * Formatea números como moneda con configuración avanzada
 */
export function formatCurrency(
  value: number,
  options: {
    currency?: string;
    locale?: string;
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
    compact?: boolean;
  } = {}
): string {
  const {
    currency = 'USD',
    locale = 'es-MX',
    minimumFractionDigits = 2,
    maximumFractionDigits = 2,
    compact = false,
  } = options;

  const formatter = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits,
    maximumFractionDigits,
    notation: compact ? 'compact' : 'standard',
  });

  return formatter.format(value);
}

/**
 * Formatea números con separadores de miles
 */
export function formatNumber(
  value: number,
  options: {
    locale?: string;
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
    compact?: boolean;
  } = {}
): string {
  const {
    locale = 'es-MX',
    minimumFractionDigits = 0,
    maximumFractionDigits = 2,
    compact = false,
  } = options;

  const formatter = new Intl.NumberFormat(locale, {
    minimumFractionDigits,
    maximumFractionDigits,
    notation: compact ? 'compact' : 'standard',
  });

  return formatter.format(value);
}

/**
 * Formatea porcentajes
 */
export function formatPercentage(
  value: number,
  options: {
    locale?: string;
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
  } = {}
): string {
  const {
    locale = 'es-MX',
    minimumFractionDigits = 1,
    maximumFractionDigits = 2,
  } = options;

  const formatter = new Intl.NumberFormat(locale, {
    style: 'percent',
    minimumFractionDigits,
    maximumFractionDigits,
  });

  return formatter.format(value / 100);
}

/**
 * Formatea fechas de manera inteligente
 */
export function formatDate(
  date: Date | string,
  options: {
    locale?: string;
    style?: 'full' | 'long' | 'medium' | 'short';
    dateStyle?: 'full' | 'long' | 'medium' | 'short';
    timeStyle?: 'full' | 'long' | 'medium' | 'short';
    relative?: boolean;
  } = {}
): string {
  const {
    locale = 'es-MX',
    style = 'medium',
    relative = false,
  } = options;

  const dateObj = typeof date === 'string' ? new Date(date) : date;

  if (relative) {
    const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });
    const diffMs = dateObj.getTime() - Date.now();
    const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

    if (Math.abs(diffDays) < 7) {
      return rtf.format(diffDays, 'day');
    }
  }

  if (options.dateStyle || options.timeStyle) {
    return new Intl.DateTimeFormat(locale, {
      dateStyle: options.dateStyle,
      timeStyle: options.timeStyle,
    }).format(dateObj);
  }

  const formatter = new Intl.DateTimeFormat(locale, {
    dateStyle: style,
  });

  return formatter.format(dateObj);
}

// ============================================================================
// UTILIDADES DE VALIDACIÓN
// ============================================================================

/**
 * Valida si un valor es un número válido
 */
export function isValidNumber(value: unknown): value is number {
  return typeof value === 'number' && !isNaN(value) && isFinite(value);
}

/**
 * Valida si una fecha es válida
 */
export function isValidDate(value: unknown): value is Date {
  return value instanceof Date && !isNaN(value.getTime());
}

/**
 * Valida si un string no está vacío
 */
export function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

// ============================================================================
// UTILIDADES DE ARRAYS Y OBJETOS
// ============================================================================

/**
 * Agrupa un array por una propiedad específica
 */
export function groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
  return array.reduce((groups, item) => {
    const groupKey = String(item[key]);
    if (!groups[groupKey]) {
      groups[groupKey] = [];
    }
    groups[groupKey].push(item);
    return groups;
  }, {} as Record<string, T[]>);
}

/**
 * Calcula la suma de una propiedad numérica en un array
 */
export function sumBy<T>(array: T[], key: keyof T): number {
  return array.reduce((sum, item) => {
    const value = item[key];
    return sum + (typeof value === 'number' ? value : 0);
  }, 0);
}

/**
 * Calcula el promedio de una propiedad numérica en un array
 */
export function averageBy<T>(array: T[], key: keyof T): number {
  if (array.length === 0) return 0;
  return sumBy(array, key) / array.length;
}

/**
 * Encuentra el valor máximo de una propiedad numérica
 */
export function maxBy<T>(array: T[], key: keyof T): number {
  return Math.max(...array.map(item => {
    const value = item[key];
    return typeof value === 'number' ? value : -Infinity;
  }));
}

/**
 * Encuentra el valor mínimo de una propiedad numérica
 */
export function minBy<T>(array: T[], key: keyof T): number {
  return Math.min(...array.map(item => {
    const value = item[key];
    return typeof value === 'number' ? value : Infinity;
  }));
}

// ============================================================================
// UTILIDADES DE PERFORMANCE
// ============================================================================

/**
 * Debounce function optimizada
 */
export function debounce<T extends (...args: unknown[]) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Throttle function optimizada
 */
export function throttle<T extends (...args: unknown[]) => void>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// ============================================================================
// UTILIDADES DE COLOR
// ============================================================================

/**
 * Genera un color basado en un hash string
 */
export function generateColorFromString(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  const hue = hash % 360;
  return `hsl(${hue}, 70%, 50%)`;
}

/**
 * Convierte HEX a RGB
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

// ============================================================================
// UTILIDADES DE ANIMACIÓN
// ============================================================================

/**
 * Configuraciones de animación predefinidas para Framer Motion
 */
export const animations = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.3 }
  },
  slideUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.4, ease: "easeOut" }
  },
  slideDown: {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 },
    transition: { duration: 0.4, ease: "easeOut" }
  },
  slideLeft: {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
    transition: { duration: 0.4, ease: "easeOut" }
  },
  slideRight: {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
    transition: { duration: 0.4, ease: "easeOut" }
  },
  scale: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9 },
    transition: { duration: 0.3, ease: "easeOut" }
  },
  bounce: {
    initial: { opacity: 0, scale: 0.3 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.3 },
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94],
      scale: { type: "spring", damping: 8, stiffness: 100 }
    }
  }
} as const;

// ============================================================================
// UTILIDADES DE ESTADO
// ============================================================================

/**
 * Genera un ID único
 */
export function generateId(prefix = 'id'): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Sleep function para delays
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ============================================================================
// UTILIDADES DE LOCAL STORAGE
// ============================================================================

/**
 * Safe localStorage con manejo de errores
 */
export const storage = {
  get<T>(key: string, defaultValue: T): T {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch {
      return defaultValue;
    }
  },

  set<T>(key: string, value: T): boolean {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch {
      return false;
    }
  },

  remove(key: string): boolean {
    try {
      localStorage.removeItem(key);
      return true;
    } catch {
      return false;
    }
  }
};

// ============================================================================
// UTILIDADES DE ERROR HANDLING
// ============================================================================

/**
 * Wrapper para manejo seguro de errores
 */
export async function safeAsync<T>(
  promise: Promise<T>
): Promise<[T | null, Error | null]> {
  try {
    const data = await promise;
    return [data, null];
  } catch (error) {
    return [null, error instanceof Error ? error : new Error(String(error))];
  }
}

/**
 * Retry function con backoff exponencial
 */
export async function retry<T>(
  fn: () => Promise<T>,
  options: {
    retries?: number;
    delay?: number;
    backoff?: number;
  } = {}
): Promise<T> {
  const { retries = 3, delay = 1000, backoff = 2 } = options;

  let lastError: Error;

  for (let i = 0; i <= retries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      if (i === retries) {
        throw lastError;
      }

      await sleep(delay * Math.pow(backoff, i));
    }
  }

  throw lastError!;
}
