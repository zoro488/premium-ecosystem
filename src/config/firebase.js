/**
 * ============================================
 * FIREBASE CONFIGURATION - ULTRA PREMIUM
 * Configuración completa de todos los servicios Firebase
 * ============================================
 */
import { getAnalytics, logEvent, setUserProperties } from 'firebase/analytics';
import { initializeApp } from 'firebase/app';
import { GoogleAuthProvider, createUserWithEmailAndPassword, getAuth, onAuthStateChanged, sendPasswordResetEmail, signInWithEmailAndPassword, signInWithPopup, signOut, updateProfile } from 'firebase/auth';
import { Timestamp, arrayRemove, arrayUnion, collection, deleteDoc, doc, enableMultiTabIndexedDbPersistence, getDoc, getDocs, getFirestore, increment, limit, onSnapshot, orderBy, query, runTransaction, serverTimestamp, setDoc, startAfter, updateDoc, where, writeBatch } from 'firebase/firestore';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { getPerformance, trace } from 'firebase/performance';
import { fetchAndActivate, getAll, getRemoteConfig, getValue } from 'firebase/remote-config';
import { deleteObject, getDownloadURL, getMetadata, getStorage, listAll, ref, updateMetadata, uploadBytes, uploadBytesResumable } from 'firebase/storage';





// ============================================
// CONFIGURACIÓN DE FIREBASE
// ============================================
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyDEyOQHEU7b3L2XYMlk_demo_key',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'premium-ecosystem.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'premium-ecosystem',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'premium-ecosystem.appspot.com',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '123456789012',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:123456789012:web:abcdef123456',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || 'G-XXXXXXXXXX',
};

// ============================================
// INICIALIZACIÓN
// ============================================
const app = initializeApp(firebaseConfig);

// Servicios principales
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Functions es opcional (requiere plan Blaze)
let functions = null;
try {
  functions = getFunctions(app);
} catch (error) {
  console.warn('Firebase Functions no disponible (requiere plan Blaze):', error.message);
}
export { functions };

export const remoteConfig = getRemoteConfig(app);

// Analytics y Performance (solo en producción)
let analytics = null;
let performance = null;

if (typeof window !== 'undefined' && import.meta.env.PROD) {
  try {
    analytics = getAnalytics(app);
    performance = getPerformance(app);
  } catch (error) {
    // console.warn('Analytics/Performance no disponible:', error);
  }
}

export { analytics, performance };

// ============================================
// CONFIGURACIÓN AVANZADA DE FIRESTORE
// ============================================

// Habilitar persistencia offline con multi-tab
if (typeof window !== 'undefined') {
  enableMultiTabIndexedDbPersistence(db).catch((err) => {
    if (err.code === 'failed-precondition') {
      // console.warn('Persistencia: Múltiples tabs abiertas');
    } else if (err.code === 'unimplemented') {
      // console.warn('Persistencia: No soportada por el navegador');
    }
  });
}

// ============================================
// UTILIDADES DE FIRESTORE
// ============================================

/**
 * Clase para gestión avanzada de Firestore
 */
export class FirestoreManager {
  constructor(collectionName) {
    this.collectionName = collectionName;
    this.collectionRef = collection(db, collectionName);
  }

  // Crear documento con ID automático
  async create(data) {
    const docRef = doc(this.collectionRef);
    await setDoc(docRef, {
      ...data,
      id: docRef.id,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  }

  // Crear o actualizar documento con ID específico
  async set(id, data, merge = true) {
    const docRef = doc(this.collectionRef, id);
    await setDoc(
      docRef,
      {
        ...data,
        updatedAt: serverTimestamp(),
      },
      { merge }
    );
    return id;
  }

  // Obtener documento por ID
  async get(id) {
    const docRef = doc(this.collectionRef, id);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
  }

  // Obtener todos los documentos
  async getAll(queryConstraints = []) {
    const q = query(this.collectionRef, ...queryConstraints);
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  }

  // Actualizar documento
  async update(id, data) {
    const docRef = doc(this.collectionRef, id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp(),
    });
  }

  // Eliminar documento
  async delete(id) {
    const docRef = doc(this.collectionRef, id);
    await deleteDoc(docRef);
  }

  // Escuchar cambios en tiempo real
  onSnapshot(callback, queryConstraints = []) {
    const q = query(this.collectionRef, ...queryConstraints);
    return onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      callback(docs);
    });
  }

  // Batch write (escritura por lotes)
  async batchWrite(operations) {
    const batch = writeBatch(db);

    operations.forEach(({ type, id, data }) => {
      const docRef = doc(this.collectionRef, id);

      switch (type) {
        case 'set':
          batch.set(docRef, { ...data, updatedAt: serverTimestamp() });
          break;
        case 'update':
          batch.update(docRef, { ...data, updatedAt: serverTimestamp() });
          break;
        case 'delete':
          batch.delete(docRef);
          break;
      }
    });

    await batch.commit();
  }

  // Transacción
  async transaction(updateFunction) {
    return runTransaction(db, updateFunction);
  }

  // Paginación
  async paginate(pageSize = 10, lastVisible = null, queryConstraints = []) {
    const constraints = [...queryConstraints, limit(pageSize)];

    if (lastVisible) {
      constraints.push(startAfter(lastVisible));
    }

    const q = query(this.collectionRef, ...constraints);
    const querySnapshot = await getDocs(q);

    const docs = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    const lastDoc = querySnapshot.docs[querySnapshot.docs.length - 1];

    return { docs, lastVisible: lastDoc };
  }
}

// ============================================
// UTILIDADES DE AUTHENTICATION
// ============================================

export class AuthManager {
  constructor() {
    this.googleProvider = new GoogleAuthProvider();
  }

  // Registro con email y password
  async signUp(email, password, displayName) {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);

    if (displayName) {
      await updateProfile(userCredential.user, { displayName });
    }

    return userCredential.user;
  }

  // Login con email y password
  async signIn(email, password) {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  }

  // Login con Google
  async signInWithGoogle() {
    const result = await signInWithPopup(auth, this.googleProvider);
    return result.user;
  }

  // Logout
  async signOut() {
    await signOut(auth);
  }

  // Resetear password
  async resetPassword(email) {
    await sendPasswordResetEmail(auth, email);
  }

  // Observar estado de autenticación
  onAuthStateChanged(callback) {
    return onAuthStateChanged(auth, callback);
  }

  // Obtener usuario actual
  getCurrentUser() {
    return auth.currentUser;
  }

  // Actualizar perfil
  async updateUserProfile(updates) {
    if (auth.currentUser) {
      await updateProfile(auth.currentUser, updates);
    }
  }
}

// ============================================
// UTILIDADES DE STORAGE
// ============================================

export class StorageManager {
  constructor(basePath = '') {
    this.basePath = basePath;
  }

  // Subir archivo
  async upload(file, path, onProgress) {
    const fullPath = this.basePath ? `${this.basePath}/${path}` : path;
    const storageRef = ref(storage, fullPath);

    if (onProgress) {
      const uploadTask = uploadBytesResumable(storageRef, file);

      return new Promise((resolve, reject) => {
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            onProgress(progress);
          },
          (error) => reject(error),
          async () => {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(downloadURL);
          }
        );
      });
    } else {
      await uploadBytes(storageRef, file);
      return getDownloadURL(storageRef);
    }
  }

  // Obtener URL de descarga
  async getDownloadURL(path) {
    const fullPath = this.basePath ? `${this.basePath}/${path}` : path;
    const storageRef = ref(storage, fullPath);
    return getDownloadURL(storageRef);
  }

  // Eliminar archivo
  async delete(path) {
    const fullPath = this.basePath ? `${this.basePath}/${path}` : path;
    const storageRef = ref(storage, fullPath);
    await deleteObject(storageRef);
  }

  // Listar archivos
  async list(path = '') {
    const fullPath = this.basePath ? `${this.basePath}/${path}` : path;
    const storageRef = ref(storage, fullPath);
    const result = await listAll(storageRef);
    return result.items;
  }

  // Obtener metadata
  async getMetadata(path) {
    const fullPath = this.basePath ? `${this.basePath}/${path}` : path;
    const storageRef = ref(storage, fullPath);
    return getMetadata(storageRef);
  }

  // Actualizar metadata
  async updateMetadata(path, metadata) {
    const fullPath = this.basePath ? `${this.basePath}/${path}` : path;
    const storageRef = ref(storage, fullPath);
    return updateMetadata(storageRef, metadata);
  }
}

// ============================================
// UTILIDADES DE ANALYTICS
// ============================================

export class AnalyticsManager {
  // Log evento
  logEvent(eventName, eventParams = {}) {
    if (analytics) {
      logEvent(analytics, eventName, eventParams);
    }
  }

  // Establecer propiedades de usuario
  setUserProperties(properties) {
    if (analytics) {
      setUserProperties(analytics, properties);
    }
  }

  // Eventos predefinidos
  logPageView(pageName) {
    this.logEvent('page_view', { page_title: pageName });
  }

  logPurchase(value, currency = 'MXN', transactionId) {
    this.logEvent('purchase', { value, currency, transaction_id: transactionId });
  }

  logSearch(searchTerm) {
    this.logEvent('search', { search_term: searchTerm });
  }

  logShare(contentType, itemId) {
    this.logEvent('share', { content_type: contentType, item_id: itemId });
  }
}

// ============================================
// UTILIDADES DE PERFORMANCE
// ============================================

export class PerformanceManager {
  // Crear trace personalizado
  async measurePerformance(traceName, fn) {
    if (!performance) return fn();

    const t = trace(performance, traceName);
    t.start();

    try {
      const result = await fn();
      t.stop();
      return result;
    } catch (error) {
      t.stop();
      throw error;
    }
  }

  // Medir carga de página
  startTrace(traceName) {
    if (!performance) return null;
    const t = trace(performance, traceName);
    t.start();
    return t;
  }

  stopTrace(traceInstance) {
    if (traceInstance) {
      traceInstance.stop();
    }
  }
}

// ============================================
// UTILIDADES DE CLOUD FUNCTIONS
// ============================================

export class FunctionsManager {
  // Llamar función
  async call(functionName, data = {}) {
    if (!functions) {
      console.warn('Firebase Functions no está disponible. Esta funcionalidad requiere plan Blaze.');
      return { success: false, error: 'Functions not available' };
    }
    const callable = httpsCallable(functions, functionName);
    const result = await callable(data);
    return result.data;
  }

  // Funciones específicas del negocio
  async processExcelImport(data) {
    return this.call('processExcelImport', data);
  }

  async calculateMetrics(data) {
    return this.call('calculateMetrics', data);
  }

  async generateReport(reportType, params) {
    return this.call('generateReport', { reportType, params });
  }

  async sendNotification(userId, notification) {
    return this.call('sendNotification', { userId, notification });
  }
}

// ============================================
// UTILIDADES DE REMOTE CONFIG
// ============================================

export class RemoteConfigManager {
  constructor() {
    remoteConfig.settings.minimumFetchIntervalMillis = 3600000; // 1 hora
    remoteConfig.defaultConfig = {
      theme: 'dark',
      features_enabled: true,
      max_upload_size: 5242880, // 5MB
      maintenance_mode: false,
    };
  }

  async fetchConfig() {
    try {
      await fetchAndActivate(remoteConfig);
      return true;
    } catch (error) {
      // console.error('Error fetching remote config:', error);
      return false;
    }
  }

  getValue(key) {
    return getValue(remoteConfig, key);
  }

  getAll() {
    return getAll(remoteConfig);
  }

  getBoolean(key) {
    return getValue(remoteConfig, key).asBoolean();
  }

  getNumber(key) {
    return getValue(remoteConfig, key).asNumber();
  }

  getString(key) {
    return getValue(remoteConfig, key).asString();
  }
}

// ============================================
// INSTANCIAS GLOBALES
// ============================================

export const firestoreManager = {
  ventas: new FirestoreManager('ventas'),
  compras: new FirestoreManager('compras'),
  distribuidores: new FirestoreManager('distribuidores'),
  clientes: new FirestoreManager('clientes'),
  bancos: new FirestoreManager('bancos'),
  almacen: new FirestoreManager('almacen'),
  movimientos: new FirestoreManager('movimientos'),
  usuarios: new FirestoreManager('usuarios'),
};

export const authManager = new AuthManager();
export const storageManager = new StorageManager('premium-ecosystem');
export const analyticsManager = new AnalyticsManager();
export const performanceManager = new PerformanceManager();
export const functionsManager = new FunctionsManager();
export const remoteConfigManager = new RemoteConfigManager();

// ============================================
// EXPORTS
// ============================================

export {
    GoogleAuthProvider, Timestamp,
    // App
    app, arrayRemove, arrayUnion,
    // Firestore utilities
    collection, createUserWithEmailAndPassword, deleteDoc, deleteObject, doc, signOut as firebaseSignOut, getDoc,
    getDocs, getDownloadURL,
    // Functions utilities
    httpsCallable, increment, limit, onAuthStateChanged, onSnapshot, orderBy, query, runTransaction, serverTimestamp, setDoc,
    // Auth utilities
    signInWithEmailAndPassword, signInWithPopup, startAfter,
    // Storage utilities
    ref as storageRef, updateDoc, uploadBytes,
    uploadBytesResumable, where, writeBatch
};

export default app;
