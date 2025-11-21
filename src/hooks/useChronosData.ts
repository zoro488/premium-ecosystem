import { collection, limit, onSnapshot, orderBy, query } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { db } from '../config/firebase';

/**
 * Hook genérico para escuchar colecciones de Firestore en tiempo real
 */
export const useFirestoreCollection = <T>(
  collectionName: string,
  orderByField?: string,
  limitCount?: number
) => {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    try {
      let q = collection(db, collectionName);

      if (orderByField) {
        q = query(q as any, orderBy(orderByField, 'desc')) as any;
      }

      if (limitCount) {
        q = query(q as any, limit(limitCount)) as any;
      }

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
          console.error(`Error escuchando ${collectionName}:`, err);
          setError(err as Error);
          setLoading(false);
        }
      );

      return () => unsubscribe();
    } catch (err) {
      console.error(`Error configurando listener para ${collectionName}:`, err);
      setError(err as Error);
      setLoading(false);
    }
  }, [collectionName, orderByField, limitCount]);

  return { data, loading, error };
};

/**
 * Hook para datos de bancos (gastos + ingresos + estadísticas)
 */
export const useBancoData = (bancoId: string) => {
  const { data: gastos, loading: loadingGastos } = useFirestoreCollection<any>(
    `${bancoId}_gastos`,
    'fecha'
  );

  const { data: ingresos, loading: loadingIngresos } = useFirestoreCollection<any>(
    `${bancoId}_ingresos`,
    'fecha'
  );

  const { data: cortes, loading: loadingCortes } = useFirestoreCollection<any>(
    `${bancoId}_cortes`,
    'fecha'
  );

  const { data: transferencias, loading: loadingTransferencias } = useFirestoreCollection<any>(
    `${bancoId}_transferencias`,
    'fecha'
  );

  // Calcular estadísticas
  const stats = {
    totalGastos: gastos.reduce((sum, g) => sum + (g.valor || 0), 0),
    totalIngresos: ingresos.reduce((sum, i) => sum + (i.valor || 0), 0),
    capitalActual: 0, // Se calculará con lógica de negocio
  };

  stats.capitalActual = stats.totalIngresos - stats.totalGastos;

  return {
    gastos,
    ingresos,
    cortes,
    transferencias,
    loading: loadingGastos || loadingIngresos || loadingCortes || loadingTransferencias,
    stats,
  };
};

/**
 * Hook para datos de dashboard (todos los bancos + totales)
 */
export const useDashboardData = () => {
  const { data: bancos, loading: loadingBancos } = useFirestoreCollection<any>('bancos');
  const { data: dashboard, loading: loadingDashboard } = useFirestoreCollection<any>('dashboard');

  const totales = dashboard[0] || {
    capitalTotal: 0,
    inventarioFisico: 0,
    totalActivos: 0,
  };

  return {
    bancos,
    totales,
    loading: loadingBancos || loadingDashboard,
  };
};

/**
 * Hook para almacén (ingresos + salidas + stock)
 */
export const useAlmacenData = () => {
  const { data: ingresos, loading: loadingIngresos } = useFirestoreCollection<any>(
    'almacen_ingresos',
    'fecha'
  );

  const { data: salidas, loading: loadingSalidas } = useFirestoreCollection<any>(
    'almacen_salidas',
    'fecha'
  );

  const stockActual = ingresos.reduce((sum, i) => sum + (i.cantidad || 0), 0) -
                      salidas.reduce((sum, s) => sum + (s.cantidad || 0), 0);

  return {
    ingresos,
    salidas,
    stockActual,
    loading: loadingIngresos || loadingSalidas,
  };
};

/**
 * Hook para ventas
 */
export const useVentasData = () => {
  return useFirestoreCollection<any>('ventas', 'fecha', 100);
};

/**
 * Hook para clientes
 */
export const useClientesData = () => {
  return useFirestoreCollection<any>('clientes');
};

/**
 * Hook para distribuidores
 */
export const useDistribuidoresData = () => {
  return useFirestoreCollection<any>('distribuidores');
};

/**
 * Hook para órdenes de compra
 */
export const useOrdenesCompraData = () => {
  return useFirestoreCollection<any>('ordenes_compra', 'fecha', 100);
};
