/**
 * Sistema de Persistencia Premium
 * Maneja localStorage, sessionStorage e IndexedDB
 */
import { useState } from 'react';

// ============================================
// LOCALSTORAGE HELPERS
// ============================================

export const storage = {
  /**
   * Guarda datos en localStorage con manejo de errores
   */
  set: (key, value) => {
    try {
      const serialized = JSON.stringify(value);
      localStorage.setItem(key, serialized);
      return true;
    } catch (error) {
      console.error(`Error saving to localStorage (${key}):`, error);
      return false;
    }
  },

  /**
   * Obtiene datos de localStorage
   */
  get: (key, defaultValue = null) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`Error reading from localStorage (${key}):`, error);
      return defaultValue;
    }
  },

  /**
   * Elimina un item de localStorage
   */
  remove: (key) => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Error removing from localStorage (${key}):`, error);
      return false;
    }
  },

  /**
   * Limpia todo el localStorage
   */
  clear: () => {
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      // console.error('Error clearing localStorage:', error);
      return false;
    }
  },

  /**
   * Verifica si una key existe
   */
  has: (key) => {
    return localStorage.getItem(key) !== null;
  },
};

// ============================================
// SESSION STORAGE HELPERS
// ============================================

export const sessionStorage = {
  set: (key, value) => {
    try {
      const serialized = JSON.stringify(value);
      window.sessionStorage.setItem(key, serialized);
      return true;
    } catch (error) {
      console.error(`Error saving to sessionStorage (${key}):`, error);
      return false;
    }
  },

  get: (key, defaultValue = null) => {
    try {
      const item = window.sessionStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`Error reading from sessionStorage (${key}):`, error);
      return defaultValue;
    }
  },

  remove: (key) => {
    try {
      window.sessionStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Error removing from sessionStorage (${key}):`, error);
      return false;
    }
  },

  clear: () => {
    try {
      window.sessionStorage.clear();
      return true;
    } catch (error) {
      // console.error('Error clearing sessionStorage:', error);
      return false;
    }
  },
};

// ============================================
// INDEXEDDB MANAGER
// ============================================

class IndexedDBManager {
  constructor(dbName = 'PremiumEcosystemDB', version = 1) {
    this.dbName = dbName;
    this.version = version;
    this.db = null;
  }

  /**
   * Inicializa la base de datos
   */
  async init(stores = []) {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve(this.db);
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;

        // Crear stores si no existen
        stores.forEach((storeName) => {
          if (!db.objectStoreNames.contains(storeName)) {
            db.createObjectStore(storeName, { keyPath: 'id', autoIncrement: true });
          }
        });
      };
    });
  }

  /**
   * Agrega un registro
   */
  async add(storeName, data) {
    if (!this.db) await this.init([storeName]);

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.add(data);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Obtiene un registro por ID
   */
  async get(storeName, id) {
    if (!this.db) await this.init([storeName]);

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.get(id);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Obtiene todos los registros
   */
  async getAll(storeName) {
    if (!this.db) await this.init([storeName]);

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Actualiza un registro
   */
  async update(storeName, data) {
    if (!this.db) await this.init([storeName]);

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.put(data);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Elimina un registro
   */
  async delete(storeName, id) {
    if (!this.db) await this.init([storeName]);

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.delete(id);

      request.onsuccess = () => resolve(true);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Limpia un store completo
   */
  async clear(storeName) {
    if (!this.db) await this.init([storeName]);

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.clear();

      request.onsuccess = () => resolve(true);
      request.onerror = () => reject(request.error);
    });
  }
}

// Instancia global de IndexedDB
export const db = new IndexedDBManager();

// ============================================
// REACT HOOKS PARA PERSISTENCIA
// ============================================

/**
 * Hook personalizado para localStorage con React
 */
export const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    return storage.get(key, initialValue);
  });

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      storage.set(key, valueToStore);
    } catch (error) {
      console.error(`Error in useLocalStorage (${key}):`, error);
    }
  };

  return [storedValue, setValue];
};

/**
 * Hook personalizado para sessionStorage con React
 */
export const useSessionStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    return sessionStorage.get(key, initialValue);
  });

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      sessionStorage.set(key, valueToStore);
    } catch (error) {
      console.error(`Error in useSessionStorage (${key}):`, error);
    }
  };

  return [storedValue, setValue];
};

// ============================================
// KEYS PREDEFINIDAS POR APP
// ============================================

export const STORAGE_KEYS = {
  // FlowDistributor
  FLOW_BANCOS: 'flow_bancos',
  FLOW_ORDENES: 'flow_ordenes_compra',
  FLOW_DISTRIBUIDORES: 'flow_distribuidores',
  FLOW_VENTAS: 'flow_ventas',
  FLOW_CLIENTES: 'flow_clientes',
  FLOW_ALMACEN: 'flow_almacen',
  FLOW_SETTINGS: 'flow_settings',
  FLOW_GASTOS_ABONOS: 'flow_gastos_abonos', // ⭐ NUEVO - Lógica del Excel

  // ShadowPrime
  SHADOW_WALLETS: 'shadow_wallets',
  SHADOW_TRANSACTIONS: 'shadow_transactions',
  SHADOW_SETTINGS: 'shadow_settings',

  // Apollo
  APOLLO_VEHICLES: 'apollo_vehicles',
  APOLLO_DRONES: 'apollo_drones',
  APOLLO_DETECTIONS: 'apollo_detections',
  APOLLO_SETTINGS: 'apollo_settings',

  // Synapse
  SYNAPSE_CONVERSATIONS: 'synapse_conversations',
  SYNAPSE_MESSAGES: 'synapse_messages',
  SYNAPSE_SETTINGS: 'synapse_settings',

  // Nexus
  NEXUS_APPS_STATUS: 'nexus_apps_status',
  NEXUS_ACTIVITY: 'nexus_activity',
  NEXUS_SETTINGS: 'nexus_settings',

  // Global
  THEME: 'app_theme',
  USER_PREFERENCES: 'user_preferences',
  SIDEBAR_STATE: 'sidebar_state',
};

// ============================================
// FUNCIONES DE MIGRACIÓN DE DATOS
// ============================================

/**
 * Migra datos de localStorage a IndexedDB
 */
export const migrateToIndexedDB = async (localStorageKey, storeName) => {
  try {
    const data = storage.get(localStorageKey);
    if (data) {
      await db.init([storeName]);

      if (Array.isArray(data)) {
        for (const item of data) {
          await db.add(storeName, item);
        }
      } else {
        await db.add(storeName, data);
      }

      console.log(`✅ Migrated ${localStorageKey} to IndexedDB (${storeName})`);
      return true;
    }
  } catch (error) {
    // console.error('Migration error:', error);
    return false;
  }
};

/**
 * Exporta todos los datos a JSON
 */
export const exportAllData = () => {
  const allData = {};

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    allData[key] = storage.get(key);
  }

  const dataStr = JSON.stringify(allData, null, 2);
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = `ecosystem-backup-${new Date().toISOString()}.json`;
  link.click();

  URL.revokeObjectURL(url);
};

/**
 * Importa datos desde JSON
 */
export const importData = (jsonString) => {
  try {
    const data = JSON.parse(jsonString);
    Object.entries(data).forEach(([key, value]) => {
      storage.set(key, value);
    });
    return true;
  } catch (error) {
    // console.error('Import error:', error);
    return false;
  }
};
