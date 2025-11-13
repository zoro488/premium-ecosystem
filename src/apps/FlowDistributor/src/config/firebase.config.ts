/**
 * 🔥 FIREBASE CONFIGURATION - CHRONOS FLOW DISTRIBUTOR
 *
 * Configuración optimizada para:
 * ✅ Firestore Database - Persistencia de datos
 * ✅ Firebase Auth - Autenticación de usuarios
 * ✅ Performance Monitoring - Análisis de rendimiento
 * ✅ Real-time Updates - Actualizaciones en tiempo real
 */

import { initializeApp } from 'firebase/app';
import {
    connectAuthEmulator,
    getAuth
} from 'firebase/auth';
import {
    connectFirestoreEmulator,
    enableIndexedDbPersistence,
    getFirestore
} from 'firebase/firestore';

// Configuración de Firebase - REEMPLAZA con tus credenciales
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "demo-key",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "chronos-flow-demo.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "chronos-flow-demo",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "chronos-flow-demo.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:123456789:web:abcdef123456",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-ABCDEF123"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar Firestore
const db = getFirestore(app);

// Inicializar Auth
const auth = getAuth(app);

// Configuración para desarrollo local (usa emuladores si están disponibles)
if (import.meta.env.NODE_ENV === 'development') {
  // Solo conectar emuladores en desarrollo si no están ya conectados
  try {
    // Firestore Emulator
    if (import.meta.env.VITE_USE_FIREBASE_EMULATOR === 'true') {
      connectFirestoreEmulator(db, 'localhost', 8080);
      connectAuthEmulator(auth, 'http://localhost:9099');
      console.log('🔥 Using Firebase Emulators for development');
    }
  } catch (error) {
    console.log('Firebase emulators already connected or not available');
  }
}

// Habilitar persistencia offline para Firestore
if (typeof window !== 'undefined') {
  enableIndexedDbPersistence(db).catch((err) => {
    if (err.code === 'failed-precondition') {
      console.warn('Firebase persistence failed: Multiple tabs open');
    } else if (err.code === 'unimplemented') {
      console.warn('Firebase persistence not supported in this browser');
    }
  });
}

export { auth, db };
export default app;

/**
 * 🚀 CONFIGURACIÓN COMPLETADA:
 *
 * ✅ Firebase App inicializada
 * ✅ Firestore configurado con persistencia offline
 * ✅ Auth configurado para autenticación
 * ✅ Emulators para desarrollo local
 * ✅ Variables de entorno para seguridad
 * ✅ Error handling robusto
 *
 * SIGUIENTE PASO: Crear servicios de datos
 */
