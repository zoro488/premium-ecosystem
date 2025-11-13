/**
 * = FIRESTORE SYNC SERVICE - Sincronizaci�n Bidireccional en Tiempo Real
 * Sincroniza Zustand Store � Firestore autom�ticamente
 */
import {
  arrayUnion,
  collection,
  deleteDoc,
  disableNetwork,
  doc,
  enableNetwork,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  writeBatch,
} from 'firebase/firestore';

import { db } from '../config/firebase.js';

// Collections names

// Collections names
const COLLECTIONS = {
  FLOWS: 'flows',
  USERS: 'users',
  ANALYTICS: 'analytics',
  SETTINGS: 'settings',
};

/**
 * Estado de sincronizaci�n
 */
const syncState = {
  isOnline: navigator.onLine,
  isSyncing: false,
  lastSyncTime: null,
  pendingChanges: 0,
  listeners: [],
  error: null,
};

/**
 * Listeners para cambios de estado
 */
const stateListeners = new Set();

const notifyStateChange = () => {
  stateListeners.forEach((listener) => listener(syncState));
};

export const subscribeSyncState = (listener) => {
  stateListeners.add(listener);
  listener(syncState); // Llamada inicial
  return () => stateListeners.delete(listener);
};

/**
 * Monitorear conectividad
 */
window.addEventListener('online', () => {
  syncState.isOnline = true;
  notifyStateChange();
  enableNetwork(db).catch(console.error);
});

window.addEventListener('offline', () => {
  syncState.isOnline = false;
  notifyStateChange();
  disableNetwork(db).catch(console.error);
});

/**
 * =� SINCRONIZACI�N DE BANCOS
 */
export const syncBancos = {
  /**
   * Subir banco a Firestore
   */
  async upload(bancoKey, bancoData) {
    try {
      // db already imported
      const docRef = doc(db, COLLECTIONS.BOVEDAS, bancoKey);

      await setDoc(
        docRef,
        {
          ...bancoData,
          updatedAt: serverTimestamp(),
          syncedAt: new Date().toISOString(),
        },
        { merge: true }
      );

      syncState.lastSyncTime = Date.now();
      notifyStateChange();
      return true;
    } catch (error) {
      console.error('Error uploading banco:', error);
      syncState.error = error.message;
      notifyStateChange();
      return false;
    }
  },

  /**
   * Descargar todos los bancos desde Firestore
   */
  async downloadAll() {
    try {
      // db already imported
      const querySnapshot = await getDocs(collection(db, COLLECTIONS.BOVEDAS));
      const bancos = {};
      querySnapshot.forEach((doc) => {
        bancos[doc.id] = doc.data();
      });
      return bancos;
    } catch (error) {
      console.error('Error downloading all bancos:', error);
      return {};
    }
  },

  /**
   * Descargar banco desde Firestore
   */
  async download(bancoKey) {
    try {
      // db already imported
      const docRef = doc(db, COLLECTIONS.BOVEDAS, bancoKey);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return docSnap.data();
      }
      return null;
    } catch (error) {
      console.error('Error downloading banco:', error);
      return null;
    }
  },

  /**
   * Listener en tiempo real
   */
  listen(bancoKey, callback) {
    try {
      // db already imported
      const docRef = doc(db, COLLECTIONS.BOVEDAS, bancoKey);

      const unsubscribe = onSnapshot(
        docRef,
        (doc) => {
          if (doc.exists()) {
            callback(doc.data());
          }
        },
        (error) => {
          console.error('Error listening banco:', error);
          syncState.error = error.message;
          notifyStateChange();
        }
      );

      syncState.listeners.push(unsubscribe);
      return unsubscribe;
    } catch (error) {
      console.error('Error setting up banco listener:', error);
      return () => {};
    }
  },

  /**
   * Listener en tiempo real para toda la colección de bancos
   */
  listenAll(callback) {
    try {
      // db already imported
      const q = query(collection(db, COLLECTIONS.BOVEDAS));

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const bancos = {};
          snapshot.forEach((doc) => {
            bancos[doc.id] = doc.data();
          });
          callback(bancos);
        },
        (error) => {
          console.error('Error listening all bancos:', error);
        }
      );

      syncState.listeners.push(unsubscribe);
      return unsubscribe;
    } catch (error) {
      console.error('Error setting up all bancos listener:', error);
      return () => {};
    }
  },

  /**
   * Agrega un ingreso a un banco
   */
  async addIngreso(bancoId, ingresoData) {
    try {
      // db already imported
      const docRef = doc(db, COLLECTIONS.BOVEDAS, bancoId);
      await updateDoc(docRef, {
        ingresos: arrayUnion(ingresoData),
        updatedAt: serverTimestamp(),
      });
      return true;
    } catch (error) {
      console.error('Error adding ingreso:', error);
      return false;
    }
  },

  /**
   * Agrega un gasto a un banco
   */
  async addGasto(bancoId, gastoData) {
    try {
      // db already imported
      const docRef = doc(db, COLLECTIONS.BOVEDAS, bancoId);
      await updateDoc(docRef, {
        gastos: arrayUnion(gastoData),
        updatedAt: serverTimestamp(),
      });
      return true;
    } catch (error) {
      console.error('Error adding gasto:', error);
      return false;
    }
  },
};

/**
 * =� SINCRONIZACI�N DE VENTAS
 */
export const syncVentas = {
  async uploadAll(ventas) {
    try {
      syncState.isSyncing = true;
      notifyStateChange();

      // db already imported
      const batch = writeBatch(db);

      ventas.forEach((venta) => {
        const docRef = doc(
          db,
          COLLECTIONS.VENTAS,
          venta.id || `venta_${Date.now()}_${Math.random()}`
        );
        batch.set(
          docRef,
          {
            ...venta,
            updatedAt: serverTimestamp(),
          },
          { merge: true }
        );
      });

      await batch.commit();
      syncState.lastSyncTime = Date.now();
      syncState.isSyncing = false;
      notifyStateChange();
      return true;
    } catch (error) {
      console.error('Error uploading ventas:', error);
      syncState.isSyncing = false;
      syncState.error = error.message;
      notifyStateChange();
      return false;
    }
  },

  async downloadAll() {
    try {
      // db already imported
      const q = query(collection(db, COLLECTIONS.VENTAS), orderBy('fecha', 'desc'));
      const querySnapshot = await getDocs(q);

      return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error downloading ventas:', error);
      return [];
    }
  },

  listen(callback) {
    try {
      // db already imported
      const q = query(collection(db, COLLECTIONS.VENTAS), orderBy('fecha', 'desc'));

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const ventas = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
          callback(ventas);
        },
        (error) => {
          console.error('Error listening ventas:', error);
        }
      );

      syncState.listeners.push(unsubscribe);
      return unsubscribe;
    } catch (error) {
      console.error('Error setting up ventas listener:', error);
      return () => {};
    }
  },

  async add(ventaData) {
    try {
      // db already imported
      const docRef = doc(collection(db, COLLECTIONS.VENTAS));
      await setDoc(docRef, {
        ...ventaData,
        id: docRef.id,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return docRef.id;
    } catch (error) {
      console.error('Error adding venta:', error);
      throw error;
    }
  },

  async update(ventaId, updates) {
    try {
      // db already imported
      const docRef = doc(db, COLLECTIONS.VENTAS, ventaId);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: serverTimestamp(),
      });
      return true;
    } catch (error) {
      console.error('Error updating venta:', error);
      throw error;
    }
  },

  async remove(ventaId) {
    try {
      // db already imported
      await deleteDoc(doc(db, COLLECTIONS.VENTAS, ventaId));
      return true;
    } catch (error) {
      console.error('Error removing venta:', error);
      throw error;
    }
  },
};

/**
 * =e SINCRONIZACI�N DE CLIENTES
 */
export const syncClientes = {
  async uploadAll(clientes) {
    try {
      syncState.isSyncing = true;
      notifyStateChange();

      // db already imported
      const batch = writeBatch(db);

      clientes.forEach((cliente) => {
        const docRef = doc(
          db,
          COLLECTIONS.CLIENTES,
          cliente.id || `cliente_${Date.now()}_${Math.random()}`
        );
        batch.set(
          docRef,
          {
            ...cliente,
            updatedAt: serverTimestamp(),
          },
          { merge: true }
        );
      });

      await batch.commit();
      syncState.lastSyncTime = Date.now();
      syncState.isSyncing = false;
      notifyStateChange();
      return true;
    } catch (error) {
      console.error('Error uploading clientes:', error);
      syncState.isSyncing = false;
      syncState.error = error.message;
      notifyStateChange();
      return false;
    }
  },

  async downloadAll() {
    try {
      // db already imported
      const querySnapshot = await getDocs(collection(db, COLLECTIONS.CLIENTES));
      return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error downloading clientes:', error);
      return [];
    }
  },

  listen(callback) {
    try {
      // db already imported
      const unsubscribe = onSnapshot(collection(db, COLLECTIONS.CLIENTES), (snapshot) => {
        const clientes = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        callback(clientes);
      });

      syncState.listeners.push(unsubscribe);
      return unsubscribe;
    } catch (error) {
      console.error('Error setting up clientes listener:', error);
      return () => {};
    }
  },

  async add(clienteData) {
    try {
      // db already imported
      const docRef = doc(collection(db, COLLECTIONS.CLIENTES));
      await setDoc(docRef, {
        ...clienteData,
        id: docRef.id,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return docRef.id;
    } catch (error) {
      console.error('Error adding cliente:', error);
      throw error;
    }
  },

  async update(clienteId, updates) {
    try {
      // db already imported
      const docRef = doc(db, COLLECTIONS.CLIENTES, clienteId);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: serverTimestamp(),
      });
      return true;
    } catch (error) {
      console.error('Error updating cliente:', error);
      throw error;
    }
  },

  async remove(clienteId) {
    try {
      // db already imported
      await deleteDoc(doc(db, COLLECTIONS.CLIENTES, clienteId));
      return true;
    } catch (error) {
      console.error('Error removing cliente:', error);
      throw error;
    }
  },
};

/**
 * =� SINCRONIZACI�N DE ALMAC�N
 */
export const syncAlmacen = {
  async upload(almacenData) {
    try {
      // db already imported
      const docRef = doc(db, COLLECTIONS.INVENTARIO, 'main');

      await setDoc(
        docRef,
        {
          ...almacenData,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );

      return true;
    } catch (error) {
      console.error('Error uploading almacen:', error);
      return false;
    }
  },

  async download() {
    try {
      // db already imported
      const docRef = doc(db, COLLECTIONS.INVENTARIO, 'main');
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return docSnap.data();
      }
      return { stockActual: 0, productos: [] };
    } catch (error) {
      console.error('Error downloading almacen:', error);
      return { stockActual: 0, productos: [] };
    }
  },

  listen(callback) {
    try {
      // db already imported
      const docRef = doc(db, COLLECTIONS.INVENTARIO, 'main');

      const unsubscribe = onSnapshot(docRef, (doc) => {
        if (doc.exists()) {
          callback(doc.data());
        }
      });

      syncState.listeners.push(unsubscribe);
      return unsubscribe;
    } catch (error) {
      console.error('Error setting up almacen listener:', error);
      return () => {};
    }
  },
};

/**
 * =� SINCRONIZACI�N DE �RDENES DE COMPRA
 */
export const syncOrdenesCompra = {
  async uploadAll(ordenes) {
    try {
      syncState.isSyncing = true;
      notifyStateChange();

      // db already imported
      const batch = writeBatch(db);

      ordenes.forEach((orden) => {
        const docRef = doc(
          db,
          COLLECTIONS.ORDENES_COMPRA,
          orden.id || `oc_${Date.now()}_${Math.random()}`
        );
        batch.set(
          docRef,
          {
            ...orden,
            updatedAt: serverTimestamp(),
          },
          { merge: true }
        );
      });

      await batch.commit();
      syncState.lastSyncTime = Date.now();
      syncState.isSyncing = false;
      notifyStateChange();
      return true;
    } catch (error) {
      console.error('Error uploading ordenes:', error);
      syncState.isSyncing = false;
      return false;
    }
  },

  async downloadAll() {
    try {
      // db already imported
      const querySnapshot = await getDocs(collection(db, COLLECTIONS.ORDENES_COMPRA));
      return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error downloading ordenes:', error);
      return [];
    }
  },

  listen(callback) {
    try {
      // db already imported
      const unsubscribe = onSnapshot(collection(db, COLLECTIONS.ORDENES_COMPRA), (snapshot) => {
        const ordenes = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        callback(ordenes);
      });

      syncState.listeners.push(unsubscribe);
      return unsubscribe;
    } catch (error) {
      console.error('Error setting up ordenes listener:', error);
      return () => {};
    }
  },

  async add(ordenData) {
    try {
      // db already imported
      const docRef = doc(collection(db, COLLECTIONS.ORDENES_COMPRA));
      await setDoc(docRef, {
        ...ordenData,
        id: docRef.id,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return docRef.id;
    } catch (error) {
      console.error('Error adding orden de compra:', error);
      throw error;
    }
  },

  async update(ordenId, updates) {
    try {
      // db already imported
      const docRef = doc(db, COLLECTIONS.ORDENES_COMPRA, ordenId);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: serverTimestamp(),
      });
      return true;
    } catch (error) {
      console.error('Error updating orden de compra:', error);
      throw error;
    }
  },

  async remove(ordenId) {
    try {
      // db already imported
      await deleteDoc(doc(db, COLLECTIONS.ORDENES_COMPRA, ordenId));
      return true;
    } catch (error) {
      console.error('Error removing orden de compra:', error);
      throw error;
    }
  },
};

/**
 * = SINCRONIZACI�N COMPLETA
 */
export const syncAll = async (storeData) => {
  try {
    syncState.isSyncing = true;
    syncState.pendingChanges = 0;
    notifyStateChange();

    const promises = [];

    // Sincronizar bancos
    Object.entries(storeData.bancos || {}).forEach(([key, data]) => {
      promises.push(syncBancos.upload(key, data));
      syncState.pendingChanges++;
    });

    // Sincronizar ventas
    if (storeData.ventas && storeData.ventas.length > 0) {
      promises.push(syncVentas.uploadAll(storeData.ventas));
      syncState.pendingChanges++;
    }

    // Sincronizar clientes
    if (storeData.clientes && storeData.clientes.length > 0) {
      promises.push(syncClientes.uploadAll(storeData.clientes));
      syncState.pendingChanges++;
    }

    // Sincronizar almac�n
    if (storeData.almacen) {
      promises.push(syncAlmacen.upload(storeData.almacen));
      syncState.pendingChanges++;
    }

    // Sincronizar �rdenes
    if (storeData.ordenesCompra && storeData.ordenesCompra.length > 0) {
      promises.push(syncOrdenesCompra.uploadAll(storeData.ordenesCompra));
      syncState.pendingChanges++;
    }

    notifyStateChange();
    await Promise.all(promises);

    syncState.isSyncing = false;
    syncState.pendingChanges = 0;
    syncState.lastSyncTime = Date.now();
    syncState.error = null;
    notifyStateChange();

    return true;
  } catch (error) {
    console.error('Error in syncAll:', error);
    syncState.isSyncing = false;
    syncState.error = error.message;
    notifyStateChange();
    return false;
  }
};

/**
 * <� Iniciar listeners en tiempo real para todo
 */
export const startRealtimeSync = (callbacks) => {
  const unsubscribers = [];

  // Listener para ventas
  if (callbacks.onVentasChange) {
    unsubscribers.push(syncVentas.listen(callbacks.onVentasChange));
  }

  // Listener para clientes
  if (callbacks.onClientesChange) {
    unsubscribers.push(syncClientes.listen(callbacks.onClientesChange));
  }

  // Listener para almac�n
  if (callbacks.onAlmacenChange) {
    unsubscribers.push(syncAlmacen.listen(callbacks.onAlmacenChange));
  }

  // Listener para �rdenes
  if (callbacks.onOrdenesChange) {
    unsubscribers.push(syncOrdenesCompra.listen(callbacks.onOrdenesChange));
  }

  // Listeners para bancos
  if (callbacks.onBancosChange) {
    const bancoKeys = [
      'bovedaMonte',
      'bovedaUsa',
      'azteca',
      'leftie',
      'fleteSur',
      'profit',
      'utilidades',
    ];
    bancoKeys.forEach((key) => {
      unsubscribers.push(
        syncBancos.listen(key, (data) => {
          callbacks.onBancosChange(key, data);
        })
      );
    });
  }

  // Retornar funci�n para cancelar todos los listeners
  return () => {
    unsubscribers.forEach((unsub) => unsub());
    syncState.listeners = [];
  };
};

/**
 * =� Detener todos los listeners
 */
export const stopRealtimeSync = () => {
  syncState.listeners.forEach((unsubscribe) => {
    try {
      unsubscribe();
    } catch (error) {
      console.error('Error unsubscribing:', error);
    }
  });
  syncState.listeners = [];
};

/**
 * =� Obtener estado de sincronizaci�n
 */
export const getSyncState = () => ({ ...syncState });

/**
 * � Sincronizaci�n manual
 */
export const manualSync = async (storeData) => {
  return await syncAll(storeData);
};

export default {
  syncBancos,
  syncVentas,
  syncClientes,
  syncAlmacen,
  syncOrdenesCompra,
  syncAll,
  startRealtimeSync,
  stopRealtimeSync,
  getSyncState,
  subscribeSyncState,
  manualSync,
};
