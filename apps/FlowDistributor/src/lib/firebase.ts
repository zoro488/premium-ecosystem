// ============================================================================
// FIREBASE CONFIGURATION - Chronos OS
// Configuración completa de Firebase v12 (modular)
// ============================================================================

import { getAnalytics } from 'firebase/analytics';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import {
    connectFirestoreEmulator,
    enableIndexedDbPersistence,
    getFirestore,
} from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Configuración desde variables de entorno
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Inicializar Firebase
export const app = initializeApp(firebaseConfig);

// Servicios
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Analytics (solo en producción)
export const analytics = import.meta.env.PROD ? getAnalytics(app) : null;

// Habilitar persistencia offline
if (typeof window !== 'undefined') {
  enableIndexedDbPersistence(db).catch((err) => {
    if (err.code === 'failed-precondition') {
      console.warn('Persistencia offline: múltiples pestañas abiertas');
    } else if (err.code === 'unimplemented') {
      console.warn('Persistencia offline: navegador no compatible');
    }
  });
}

// Emulator en desarrollo (opcional)
if (import.meta.env.DEV && import.meta.env.VITE_USE_EMULATOR === 'true') {
  connectFirestoreEmulator(db, 'localhost', 8080);
  console.log('🔧 Conectado a Firestore Emulator');
}

export default app;
