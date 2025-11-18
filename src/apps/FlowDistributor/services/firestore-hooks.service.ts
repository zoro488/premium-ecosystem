/**
 * 🔥 FIRESTORE HOOKS SERVICE
 *
 * Hooks personalizados para conectar componentes con Firestore en tiempo real
 * @version 1.0.0
 */

import { collection, onSnapshot, query, QueryConstraint, type Firestore } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { db } from './firebase.config';

// Type-safe db
const firestoreDb = db as Firestore;

/**
 * 🪝 Hook genérico para cargar una colección de Firestore
 * @param collectionName - Nombre de la colección
 * @param constraints - Constraints opcionales (orderBy, limit, where, etc.)
 * @returns { data, loading, error }
 */
export const useFirestoreCollection = <T = any>(
  collectionName: string,
  constraints: QueryConstraint[] = []
) => {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!collectionName) {
      setLoading(false);
      return () => {};
    }

    setLoading(true);
    setError(null);

    try {
      const collectionRef = collection(firestoreDb, collectionName);
      const q = constraints.length > 0 ? query(collectionRef, ...constraints) : collectionRef;

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const items = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as T[];
          setData(items);
          setLoading(false);
        },
        (err) => {
          console.error(`❌ Error loading collection '${collectionName}':`, err);
          setError(err.message);
          setLoading(false);
        }
      );

      return () => unsubscribe();
    } catch (err: any) {
      console.error(`❌ Error setting up listener for '${collectionName}':`, err);
      setError(err.message);
      setLoading(false);
      return () => {};
    }
  }, [collectionName, JSON.stringify(constraints)]);

  return { data, loading, error };
};

/**
 * 🪝 Hook especializado para cargar datos de un BANCO (gastos + ingresos)
 * @param bancoName - Nombre del banco (azteca, boveda_monte, etc.)
 * @returns { gastos, ingresos, loading, error, stats }
 */
export const useBancoData = (bancoName: string) => {
  const { data: gastos, loading: loadingGastos, error: errorGastos } = useFirestoreCollection(
    `${bancoName}_gastos`
  );

  const { data: ingresos, loading: loadingIngresos, error: errorIngresos } = useFirestoreCollection(
    `${bancoName}_ingresos`
  );

  const loading = loadingGastos || loadingIngresos;
  const error = errorGastos || errorIngresos;

  // Calcular estadísticas
  const stats = {
    totalGastos: gastos.reduce((sum, g: any) => sum + (g.mxnTotal || g.valor || 0), 0),
    totalIngresos: ingresos.reduce((sum, i: any) => sum + (i.mxnTotal || i.valor || 0), 0),
    cantidadGastos: gastos.length,
    cantidadIngresos: ingresos.length,
    saldoNeto: 0,
  };
  stats.saldoNeto = stats.totalIngresos - stats.totalGastos;

  return {
    gastos,
    ingresos,
    loading,
    error,
    stats
  };
};

/**
 * 🪝 Hook especializado para cargar datos del ALMACÉN
 * @returns { ingresos, salidas, ordenes, loading, error }
 */
export const useAlmacenData = () => {
  const { data: ingresos, loading: loadingIngresos } = useFirestoreCollection('almacen_ingresos');
  const { data: salidas, loading: loadingSalidas } = useFirestoreCollection('almacen_salidas');
  const { data: ordenes, loading: loadingOrdenes } = useFirestoreCollection('almacen_ordenes_compra');

  const loading = loadingIngresos || loadingSalidas || loadingOrdenes;

  return {
    ingresos,
    salidas,
    ordenes,
    loading,
  };
};

/**
 * 🪝 Hook para cargar DASHBOARD con todos los saldos
 * @returns { paneles, totales, loading, error }
 */
export const useDashboardData = () => {
  const { data: saldos, loading: loadingSaldos } = useFirestoreCollection('dashboard_saldos');
  const { data: totales, loading: loadingTotales } = useFirestoreCollection('dashboard_totales');

  const loading = loadingSaldos || loadingTotales;

  return {
    paneles: saldos,
    totales: totales[0] || {},
    loading,
  };
};

/**
 * 🪝 Hook para cargar transacciones GYA (Gastos y Abonos)
 * @returns { transacciones, loading, error }
 */
export const useGYAData = () => {
  const { data: transacciones, loading, error } = useFirestoreCollection('gya_transacciones');

  return {
    transacciones,
    loading,
    error,
  };
};

/**
 * 🪝 Hook para cargar CLIENTES
 * @returns { clientes, loading, error }
 */
export const useClientesData = () => {
  return useFirestoreCollection('clientes');
};

/**
 * 🪝 Hook para cargar DISTRIBUIDORES
 * @returns { distribuidores, loading, error }
 */
export const useDistribuidoresData = () => {
  return useFirestoreCollection('distribuidores');
};

/**
 * 🪝 Hook para cargar VENTAS
 * @returns { ventas, loading, error }
 */
export const useVentasData = () => {
  return useFirestoreCollection('ventas');
};

/**
 * 🪝 Hook para cargar ÓRDENES DE COMPRA
 * @returns { ordenes, loading, error }
 */
export const useOrdenesCompraData = () => {
  return useFirestoreCollection('ordenes_compra');
};
