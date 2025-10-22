/**
 * 💾 INDEXEDDB STORAGE
 * Nivel: ADVANCED PERSISTENCE
 * Pattern: Client-Side Database
 */
import { useCallback, useEffect, useState } from 'react';

import { clear, del, get, keys, set } from 'idb-keyval';

export const db = {
  // Guardar datos
  async save(key, data) {
    try {
      await set(key, data);
      return { success: true };
    } catch (error) {
      // console.error('Error saving to IndexedDB:', error);
      return { success: false, error };
    }
  },

  // Obtener datos
  async get(key) {
    try {
      const data = await get(key);
      return { success: true, data };
    } catch (error) {
      // console.error('Error reading from IndexedDB:', error);
      return { success: false, error, data: null };
    }
  },

  // Eliminar
  async delete(key) {
    try {
      await del(key);
      return { success: true };
    } catch (error) {
      // console.error('Error deleting from IndexedDB:', error);
      return { success: false, error };
    }
  },

  // Obtener todas las keys
  async getAllKeys() {
    try {
      const allKeys = await keys();
      return { success: true, keys: allKeys };
    } catch (error) {
      // console.error('Error getting keys from IndexedDB:', error);
      return { success: false, error, keys: [] };
    }
  },

  // Limpiar todo
  async clear() {
    try {
      await clear();
      return { success: true };
    } catch (error) {
      // console.error('Error clearing IndexedDB:', error);
      return { success: false, error };
    }
  },

  // Guardar múltiples
  async saveMultiple(entries) {
    try {
      await Promise.all(entries.map(([key, value]) => set(key, value)));
      return { success: true };
    } catch (error) {
      // console.error('Error saving multiple to IndexedDB:', error);
      return { success: false, error };
    }
  },

  // Backup completo
  async backup() {
    try {
      const allKeys = await keys();
      const backup = {};

      for (const key of allKeys) {
        backup[key] = await get(key);
      }

      return { success: true, data: backup };
    } catch (error) {
      // console.error('Error creating backup:', error);
      return { success: false, error, data: null };
    }
  },

  // Restaurar desde backup
  async restore(backupData) {
    try {
      await clear();

      const entries = Object.entries(backupData);
      await Promise.all(entries.map(([key, value]) => set(key, value)));

      return { success: true };
    } catch (error) {
      // console.error('Error restoring backup:', error);
      return { success: false, error };
    }
  },
};

// Hook para usar IndexedDB reactivamente
export function useIndexedDB(key, initialValue) {
  const [value, setValue] = useState(initialValue);
  const [isLoading, setIsLoading] = useState(true);

  // Cargar al montar
  useEffect(() => {
    db.get(key).then(({ data }) => {
      if (data !== undefined) {
        setValue(data);
      }
      setIsLoading(false);
    });
  }, [key]);

  // Guardar cuando cambie
  const updateValue = useCallback(
    (newValue) => {
      setValue(newValue);
      db.save(key, newValue);
    },
    [key]
  );

  return [value, updateValue, isLoading];
}
