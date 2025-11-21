/**
 * Firebase Configuration
 * @module lib/firebase
 */
import { type Analytics, getAnalytics, isSupported } from 'firebase/analytics';
import { type FirebaseApp, getApps, initializeApp } from 'firebase/app';
import { type Auth, connectAuthEmulator, getAuth } from 'firebase/auth';
import { type Firestore, connectFirestoreEmulator, getFirestore } from 'firebase/firestore';
import { type FirebaseStorage, connectStorageEmulator, getStorage } from 'firebase/storage';

import { validateAndWarnEnv } from '@/utils/validateEnv';

/**
 * Validar variables de entorno antes de inicializar
 */
const isEnvValid = validateAndWarnEnv();

/**
 * Configuración de Firebase (modular) - Chronos Project
 * Updated: 2025-11-06
 * Project: chronos-176d8
 */
const firebaseConfig = {
  apiKey: 'AIzaSyB9gG3ITQ6MkY-kOahzSHRqqNaJMguDi5k',
  authDomain: 'chronos-176d8.firebaseapp.com',
  projectId: 'chronos-176d8',
  storageBucket: 'chronos-176d8.firebasestorage.app',
  messagingSenderId: '148680866109',
  appId: '1:148680866109:web:5da615f10d3600e50b6d54',
  measurementId: 'G-H591NB7F9S',
};

// ============================================================================
// CONFIGURACIÓN
// ============================================================================

let firebaseApp: FirebaseApp | null = null;
let firebaseDb: Firestore | null = null;
let firebaseAuth: Auth | null = null;
let firebaseStorage: FirebaseStorage | null = null;
let firebaseAnalytics: Analytics | null = null;

/**
 * Inicializa Firebase con manejo de errores robusto
 */
export const initializeFirebase = (): void => {
  try {
    // Verificar configuración válida
    if (!firebaseConfig.apiKey || firebaseConfig.apiKey === 'dummy') {
      console.warn('⚠️ Firebase configurado en modo dummy - Funcionalidad limitada');
      return;
    }

    // Verificar si ya está inicializado
    if (getApps().length > 0) {
      firebaseApp = getApps()[0];
    } else {
      firebaseApp = initializeApp(firebaseConfig);
    }

    // Inicializar servicios
    firebaseDb = getFirestore(firebaseApp);
    firebaseAuth = getAuth(firebaseApp);
    firebaseStorage = getStorage(firebaseApp);

    // Analytics (solo en producción con configuración válida)
    if (import.meta.env.PROD && isEnvValid && firebaseConfig.measurementId) {
      isSupported()
        .then((supported) => {
          if (supported && firebaseApp) {
            try {
              // Configuración con opciones de cookies para Vercel
              firebaseAnalytics = getAnalytics(firebaseApp);
              console.log('✅ Firebase Analytics inicializado');
            } catch (analyticsError) {
              console.warn('⚠️ Error al inicializar Analytics:', analyticsError);
            }
          }
        })
        .catch((error) => {
          console.warn('⚠️ Analytics no soportado:', error.message);
        });
    } else if (import.meta.env.PROD) {
      console.warn('⚠️ Firebase Analytics no configurado: measurementId faltante');
    }
  } catch (error) {
    console.error('❌ Error al inicializar Firebase:', error);
    // No lanzar error para evitar crash de la app
  }

  // Emuladores en desarrollo
  if (import.meta.env.DEV && import.meta.env.VITE_USE_EMULATORS === 'true') {
    try {
      if (firebaseDb && firebaseAuth && firebaseStorage) {
        connectFirestoreEmulator(firebaseDb, 'localhost', 8080);
        connectAuthEmulator(firebaseAuth, 'http://localhost:9099');
        connectStorageEmulator(firebaseStorage, 'localhost', 9199);
      }
    } catch (_error) {}
  }
};

// Inicializar automáticamente
initializeFirebase();

// ============================================================================
// GETTERS SEGUROS
// ============================================================================

/**
 * Obtiene la instancia de Firebase App
 * @throws {Error} Si Firebase no está inicializado
 */
export const getApp = (): FirebaseApp => {
  if (!firebaseApp) {
    throw new Error('Firebase App not initialized');
  }
  return firebaseApp;
};

/**
 * Obtiene la instancia de Firestore
 * @throws {Error} Si Firestore no está inicializado
 */
export const getDb = (): Firestore => {
  if (!firebaseDb) {
    throw new Error('Firestore not initialized');
  }
  return firebaseDb;
};

/**
 * Obtiene la instancia de Auth
 * @throws {Error} Si Auth no está inicializado
 */
export const getAuthInstance = (): Auth => {
  if (!firebaseAuth) {
    throw new Error('Firebase Auth not initialized');
  }
  return firebaseAuth;
};

/**
 * Obtiene la instancia de Storage
 * @throws {Error} Si Storage no está inicializado
 */
export const getStorageInstance = (): FirebaseStorage => {
  if (!firebaseStorage) {
    throw new Error('Firebase Storage not initialized');
  }
  return firebaseStorage;
};

/**
 * Obtiene la instancia de Analytics (puede ser null)
 */
export const getAnalyticsInstance = (): Analytics | null => {
  return firebaseAnalytics;
};

/**
 * Verifica si Firebase está configurado correctamente
 */
export const isFirebaseConfigured = (): boolean => {
  return firebaseApp !== null && firebaseDb !== null;
};

// ============================================================================
// EXPORTACIONES
// ============================================================================

// Exportar instancias directas (ya inicializadas)
export const app = firebaseApp;
export const db = firebaseDb;
export const auth = firebaseAuth;
export const storage = firebaseStorage;
export const analytics = firebaseAnalytics;

/**
 * Constantes de colecciones
 */
export const COLLECTIONS = {
  // FlowDistributor
  ORDENES_COMPRA: 'ordenesCompra',
  DISTRIBUIDORES: 'distribuidores',
  VENTAS: 'ventas',
  CLIENTES: 'clientes',
  GASTOS: 'gastos',
  ABONOS: 'abonos',
  BOVEDAS: 'bovedas',
  MOVIMIENTOS_BOVEDA: 'movimientosBoveda',
  INVENTARIO: 'inventario',
  MOVIMIENTOS_INVENTARIO: 'movimientosInventario',
  ENVIOS: 'envios',
  CUENTAS_POR_COBRAR: 'cuentasPorCobrar',
  CONTEOS_FISICOS: 'conteosFisicos',

  // Sistema
  USUARIOS: 'usuarios',
  CONFIGURACION: 'configuracion',
  AUDITORIA: 'auditoria',
  NOTIFICACIONES: 'notificaciones',

  // SmartSales
  PRODUCTOS: 'productos',
  CATEGORIAS: 'categorias',
  PEDIDOS: 'pedidos',

  // ClientHub
  CONTACTOS: 'contactos',
  OPORTUNIDADES: 'oportunidades',
  ACTIVIDADES: 'actividades',

  // AnalyticsPro
  METRICAS: 'metricas',
  REPORTES: 'reportes',

  // TeamSync
  PROYECTOS: 'proyectos',
  TAREAS: 'tareas',
  EQUIPOS: 'equipos',
} as const;

/**
 * Índices recomendados para Firestore
 */
export const FIRESTORE_INDEXES = {
  ordenesCompra: [
    { fields: ['estado', 'fecha'], desc: true },
    { fields: ['distribuidorId', 'fecha'], desc: true },
    { fields: ['numeroOC'] },
  ],
  ventas: [
    { fields: ['estado', 'fecha'], desc: true },
    { fields: ['clienteId', 'fecha'], desc: true },
    { fields: ['estadoPago', 'fechaVencimiento'] },
    { fields: ['numeroVenta'] },
  ],
  clientes: [
    { fields: ['categoria', 'totalCompras'], desc: true },
    { fields: ['activo', 'ultimaCompra'], desc: true },
    { fields: ['bloqueado'] },
  ],
  gastos: [
    { fields: ['categoria', 'fecha'], desc: true },
    { fields: ['estado', 'fecha'], desc: true },
    { fields: ['requiereAprobacion', 'estado'] },
  ],
  movimientosInventario: [
    { fields: ['sku', 'fecha'], desc: true },
    { fields: ['tipo', 'fecha'], desc: true },
    { fields: ['almacenOrigen', 'fecha'], desc: true },
  ],
};

export default {
  app: firebaseApp,
  db: firebaseDb,
  auth: firebaseAuth,
  storage: firebaseStorage,
  analytics: firebaseAnalytics,
  COLLECTIONS,
};
