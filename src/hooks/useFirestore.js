import { useEffect, useState } from 'react';

import { isFirebaseConfigured } from '../lib/firebase';
import {
  createDocument,
  deleteDocument,
  getDocuments,
  subscribeToCollection,
  updateDocument,
} from '../services/firebaseService';
import { useLocalStorage } from '../utils/storage';

/**
 * Hook que automáticamente usa Firebase o localStorage según disponibilidad
 *
 * @param {string} collectionName - Nombre de la colección en Firestore
 * @param {Array} defaultValue - Valor por defecto si no hay datos
 * @param {Object} options - Opciones: { realtime: boolean, filters: object }
 *
 * @returns {Object} - { data, loading, error, create, update, remove, refresh }
 *
 * Ejemplo de uso:
 * const { data: bancos, loading, create, update, remove } = useFirestore('bancos', []);
 *
 * // Crear
 * await create({ nombre: 'Boveda Monte', capital: 850000 });
 *
 * // Actualizar
 * await update(id, { capital: 900000 });
 *
 * // Eliminar
 * await remove(id);
 */
export const useFirestore = (collectionName, defaultValue = [], options = {}) => {
  const { realtime = false, filters = {} } = options;

  // Fallback a localStorage si Firebase no está configurado
  const [localData, setLocalData] = useLocalStorage(collectionName, defaultValue);

  const [data, setData] = useState(defaultValue);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const useFirebase = isFirebaseConfigured();

  // Cargar datos iniciales
  useEffect(() => {
    if (!useFirebase) {
      // Usar localStorage
      setData(localData);
      setLoading(false);
      return;
    }

    // Usar Firebase
    const loadData = async () => {
      try {
        setLoading(true);
        const documents = await getDocuments(collectionName, filters);
        setData(documents);
        setError(null);
      } catch (err) {
        // console.error(`Error cargando ${collectionName}:`, err);
        setError(err.message);
        // Fallback a localStorage en caso de error
        setData(localData);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [collectionName, useFirebase]);

  // Suscripción en tiempo real (solo si está habilitado)
  useEffect(() => {
    if (!useFirebase || !realtime) return;

    const unsubscribe = subscribeToCollection(
      collectionName,
      (documents) => {
        setData(documents);
        setError(null);
      },
      filters
    );

    return () => unsubscribe();
  }, [collectionName, realtime, useFirebase]);

  // CREATE
  const create = async (newData) => {
    try {
      if (useFirebase) {
        const created = await createDocument(collectionName, newData);
        if (!realtime) {
          setData((prev) => [...prev, created]);
        }
        return created;
      } else {
        // localStorage
        const created = {
          id: Date.now().toString(),
          ...newData,
          createdAt: new Date().toISOString(),
        };
        const updated = [...localData, created];
        setLocalData(updated);
        setData(updated);
        return created;
      }
    } catch (err) {
      // console.error(`Error creando en ${collectionName}:`, err);
      setError(err.message);
      throw err;
    }
  };

  // UPDATE
  const update = async (id, updates) => {
    try {
      if (useFirebase) {
        const updated = await updateDocument(collectionName, id, updates);
        if (!realtime) {
          setData((prev) => prev.map((item) => (item.id === id ? { ...item, ...updates } : item)));
        }
        return updated;
      } else {
        // localStorage
        const updated = localData.map((item) =>
          item.id === id ? { ...item, ...updates, updatedAt: new Date().toISOString() } : item
        );
        setLocalData(updated);
        setData(updated);
        return { id, ...updates };
      }
    } catch (err) {
      // console.error(`Error actualizando en ${collectionName}:`, err);
      setError(err.message);
      throw err;
    }
  };

  // DELETE
  const remove = async (id) => {
    try {
      if (useFirebase) {
        await deleteDocument(collectionName, id);
        if (!realtime) {
          setData((prev) => prev.filter((item) => item.id !== id));
        }
        return id;
      } else {
        // localStorage
        const updated = localData.filter((item) => item.id !== id);
        setLocalData(updated);
        setData(updated);
        return id;
      }
    } catch (err) {
      // console.error(`Error eliminando en ${collectionName}:`, err);
      setError(err.message);
      throw err;
    }
  };

  // REFRESH - Recargar datos manualmente
  const refresh = async () => {
    if (!useFirebase) {
      setData(localData);
      return;
    }

    try {
      setLoading(true);
      const documents = await getDocuments(collectionName, filters);
      setData(documents);
      setError(null);
    } catch (err) {
      // console.error(`Error refrescando ${collectionName}:`, err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    data,
    loading,
    error,
    create,
    update,
    remove,
    refresh,
    isUsingFirebase: useFirebase,
  };
};

export default useFirestore;
