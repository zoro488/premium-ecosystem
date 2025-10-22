/**
 * ============================================
 * FIREBASE HOOKS - ULTRA PREMIUM
 * Hooks de React para integración completa con Firebase
 * ============================================
 */
import { useCallback, useEffect, useRef, useState } from 'react';

import {
  analyticsManager,
  authManager,
  firestoreManager,
  limit,
  orderBy,
  performanceManager,
  serverTimestamp,
  storageManager,
  where,
} from '../config/firebase';

/**
 * ==================================================
 * Hook para autenticación
 * ==================================================
 */
export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = authManager.onAuthStateChanged((authUser) => {
      setUser(authUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signUp = useCallback(async (email, password, displayName) => {
    try {
      setLoading(true);
      setError(null);
      const user = await authManager.signUp(email, password, displayName);
      analyticsManager.logEvent('sign_up', { method: 'email' });
      return user;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const signIn = useCallback(async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      const user = await authManager.signIn(email, password);
      analyticsManager.logEvent('login', { method: 'email' });
      return user;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const signInWithGoogle = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const user = await authManager.signInWithGoogle();
      analyticsManager.logEvent('login', { method: 'google' });
      return user;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      await authManager.signOut();
      analyticsManager.logEvent('logout');
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const resetPassword = useCallback(async (email) => {
    try {
      setLoading(true);
      setError(null);
      await authManager.resetPassword(email);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    user,
    loading,
    error,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    resetPassword,
    isAuthenticated: !!user,
  };
}

/**
 * ==================================================
 * Hook para colección de Firestore
 * ==================================================
 */
export function useFirestoreCollection(collectionName, queryConstraints = []) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const manager = firestoreManager[collectionName];

  useEffect(() => {
    if (!manager) {
      setError(`Collection ${collectionName} not found`);
      setLoading(false);
      return;
    }

    setLoading(true);

    const unsubscribe = manager.onSnapshot((docs) => {
      setData(docs);
      setLoading(false);
      setError(null);
    }, queryConstraints);

    return () => unsubscribe();
  }, [collectionName, queryConstraints.length]);

  const create = useCallback(
    async (data) => {
      try {
        const id = await manager.create(data);
        analyticsManager.logEvent(`create_${collectionName}`, { id });
        return id;
      } catch (err) {
        setError(err.message);
        throw err;
      }
    },
    [manager, collectionName]
  );

  const update = useCallback(
    async (id, data) => {
      try {
        await manager.update(id, data);
        analyticsManager.logEvent(`update_${collectionName}`, { id });
      } catch (err) {
        setError(err.message);
        throw err;
      }
    },
    [manager, collectionName]
  );

  const remove = useCallback(
    async (id) => {
      try {
        await manager.delete(id);
        analyticsManager.logEvent(`delete_${collectionName}`, { id });
      } catch (err) {
        setError(err.message);
        throw err;
      }
    },
    [manager, collectionName]
  );

  return {
    data,
    loading,
    error,
    create,
    update,
    remove,
    refresh: () => setLoading(true),
  };
}

/**
 * ==================================================
 * Hook para documento específico de Firestore
 * ==================================================
 */
export function useFirestoreDocument(collectionName, documentId) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const manager = firestoreManager[collectionName];

  useEffect(() => {
    if (!manager || !documentId) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        const doc = await manager.get(documentId);
        setData(doc);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [collectionName, documentId]);

  const update = useCallback(
    async (updates) => {
      try {
        await manager.update(documentId, updates);
        setData((prev) => ({ ...prev, ...updates }));
        analyticsManager.logEvent(`update_${collectionName}`, { id: documentId });
      } catch (err) {
        setError(err.message);
        throw err;
      }
    },
    [manager, collectionName, documentId]
  );

  return {
    data,
    loading,
    error,
    update,
  };
}

/**
 * ==================================================
 * Hook para Storage (subida de archivos)
 * ==================================================
 */
export function useStorage(basePath = '') {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);
  const [downloadURL, setDownloadURL] = useState(null);

  const storage = useRef(new storageManager.constructor(basePath)).current;

  const upload = useCallback(
    async (file, path) => {
      try {
        setUploading(true);
        setError(null);
        setUploadProgress(0);

        const url = await storage.upload(file, path, (progress) => {
          setUploadProgress(progress);
        });

        setDownloadURL(url);
        analyticsManager.logEvent('file_upload', { path, size: file.size });
        return url;
      } catch (err) {
        setError(err.message);
        throw err;
      } finally {
        setUploading(false);
        setUploadProgress(0);
      }
    },
    [storage]
  );

  const deleteFile = useCallback(
    async (path) => {
      try {
        await storage.delete(path);
        analyticsManager.logEvent('file_delete', { path });
      } catch (err) {
        setError(err.message);
        throw err;
      }
    },
    [storage]
  );

  return {
    upload,
    deleteFile,
    uploading,
    uploadProgress,
    downloadURL,
    error,
  };
}

/**
 * ==================================================
 * Hook para Analytics
 * ==================================================
 */
export function useAnalytics() {
  const logEvent = useCallback((eventName, params) => {
    analyticsManager.logEvent(eventName, params);
  }, []);

  const logPageView = useCallback((pageName) => {
    analyticsManager.logPageView(pageName);
  }, []);

  const logPurchase = useCallback((value, currency, transactionId) => {
    analyticsManager.logPurchase(value, currency, transactionId);
  }, []);

  const logSearch = useCallback((searchTerm) => {
    analyticsManager.logSearch(searchTerm);
  }, []);

  return {
    logEvent,
    logPageView,
    logPurchase,
    logSearch,
  };
}

/**
 * ==================================================
 * Hook para Performance Monitoring
 * ==================================================
 */
export function usePerformance() {
  const measurePerformance = useCallback(async (traceName, fn) => {
    return performanceManager.measurePerformance(traceName, fn);
  }, []);

  const startTrace = useCallback((traceName) => {
    return performanceManager.startTrace(traceName);
  }, []);

  const stopTrace = useCallback((traceInstance) => {
    performanceManager.stopTrace(traceInstance);
  }, []);

  return {
    measurePerformance,
    startTrace,
    stopTrace,
  };
}

/**
 * ==================================================
 * Hook para Paginación
 * ==================================================
 */
export function usePagination(collectionName, pageSize = 10, queryConstraints = []) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [lastVisible, setLastVisible] = useState(null);

  const manager = firestoreManager[collectionName];

  const loadMore = useCallback(async () => {
    if (!manager || loading || !hasMore) return;

    try {
      setLoading(true);
      const result = await manager.paginate(pageSize, lastVisible, queryConstraints);

      setData((prev) => [...prev, ...result.docs]);
      setLastVisible(result.lastVisible);
      setHasMore(result.docs.length === pageSize);
    } catch (err) {
      // console.error('Error loading more:', err);
    } finally {
      setLoading(false);
    }
  }, [manager, pageSize, lastVisible, loading, hasMore, queryConstraints.length]);

  const reset = useCallback(() => {
    setData([]);
    setLastVisible(null);
    setHasMore(true);
  }, []);

  useEffect(() => {
    loadMore();
  }, []);

  return {
    data,
    loading,
    hasMore,
    loadMore,
    reset,
  };
}

/**
 * ==================================================
 * Hook para sincronización offline
 * ==================================================
 */
export function useOfflineSync(collectionName) {
  const [syncing, setSyncing] = useState(false);
  const [lastSync, setLastSync] = useState(null);

  const sync = useCallback(async () => {
    setSyncing(true);
    try {
      // Aquí iría la lógica de sincronización
      // Por ahora es un placeholder
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setLastSync(new Date());
    } catch (err) {
      // console.error('Sync error:', err);
    } finally {
      setSyncing(false);
    }
  }, [collectionName]);

  return {
    syncing,
    lastSync,
    sync,
  };
}

/**
 * ==================================================
 * Hook combinado para FlowDistributor
 * ==================================================
 */
export function useFlowDistributor() {
  const ventas = useFirestoreCollection('ventas', [orderBy('fecha', 'desc')]);
  const compras = useFirestoreCollection('compras', [orderBy('fecha', 'desc')]);
  const distribuidores = useFirestoreCollection('distribuidores');
  const clientes = useFirestoreCollection('clientes');
  const bancos = useFirestoreCollection('bancos');
  const almacen = useFirestoreCollection('almacen');

  const loading =
    ventas.loading ||
    compras.loading ||
    distribuidores.loading ||
    clientes.loading ||
    bancos.loading ||
    almacen.loading;

  return {
    ventas,
    compras,
    distribuidores,
    clientes,
    bancos,
    almacen,
    loading,
  };
}
