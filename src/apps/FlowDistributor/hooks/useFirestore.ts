/**
 * 🚀 HOOK PERSONALIZADO - FIRESTORE REAL-TIME
 * Suscripciones en tiempo real para TODO el sistema
 */
import { useEffect, useState } from 'react';

import {
  QueryConstraint,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  where,
} from 'firebase/firestore';

import { COLLECTIONS, db } from '../services/firebase.config';

// ============================================================
// 🎯 HOOK PRINCIPAL
// ============================================================

/**
 * Hook genérico para escuchar cambios en tiempo real
 */
export function useRealtimeCollection<T>(
  collectionName: string,
  constraints: QueryConstraint[] = []
) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const q = query(collection(db, collectionName), ...constraints);

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const items = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as T[];

        setData(items);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error(`Error en ${collectionName}:`, err);
        setError(err as Error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [collectionName, JSON.stringify(constraints)]);

  return { data, loading, error };
}

/**
 * Hook para escuchar un documento específico
 */
export function useRealtimeDocument<T>(collectionName: string, documentId: string | null) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!documentId) {
      setData(null);
      setLoading(false);
      return;
    }

    const docRef = doc(db, collectionName, documentId);

    const unsubscribe = onSnapshot(
      docRef,
      (snapshot) => {
        if (snapshot.exists()) {
          setData({ id: snapshot.id, ...snapshot.data() } as T);
        } else {
          setData(null);
        }
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error(`Error en documento ${documentId}:`, err);
        setError(err as Error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [collectionName, documentId]);

  return { data, loading, error };
}

// ============================================================
// 📦 HOOKS ESPECÍFICOS - ÓRDENES DE COMPRA
// ============================================================

export function useOrdenesCompra() {
  return useRealtimeCollection(COLLECTIONS.ORDENES_COMPRA, [orderBy('createdAt', 'desc')]);
}

export function useOrdenCompra(ordenId: string | null) {
  return useRealtimeDocument(COLLECTIONS.ORDENES_COMPRA, ordenId);
}

export function useOrdenesCompraPendientes() {
  return useRealtimeCollection(COLLECTIONS.ORDENES_COMPRA, [
    where('estado', '!=', 'pagado'),
    orderBy('estado'),
    orderBy('createdAt', 'desc'),
  ]);
}

export function useOrdenesCompraDistribuidor(distribuidorId: string) {
  return useRealtimeCollection(COLLECTIONS.ORDENES_COMPRA, [
    where('distribuidorId', '==', distribuidorId),
    orderBy('createdAt', 'desc'),
  ]);
}

// ============================================================
// 👥 HOOKS ESPECÍFICOS - DISTRIBUIDORES
// ============================================================

export function useDistribuidores() {
  return useRealtimeCollection(COLLECTIONS.DISTRIBUIDORES, [orderBy('createdAt', 'desc')]);
}

export function useDistribuidor(distribuidorId: string | null) {
  return useRealtimeDocument(COLLECTIONS.DISTRIBUIDORES, distribuidorId);
}

export function useDistribuidoresConDeuda() {
  return useRealtimeCollection(COLLECTIONS.DISTRIBUIDORES, [
    where('deudaTotal', '>', 0),
    orderBy('deudaTotal', 'desc'),
  ]);
}

// ============================================================
// 💰 HOOKS ESPECÍFICOS - VENTAS
// ============================================================

export function useVentas() {
  return useRealtimeCollection(COLLECTIONS.VENTAS, [orderBy('createdAt', 'desc')]);
}

export function useVenta(ventaId: string | null) {
  return useRealtimeDocument(COLLECTIONS.VENTAS, ventaId);
}

export function useVentasPendientes() {
  return useRealtimeCollection(COLLECTIONS.VENTAS, [
    where('estadoPago', '!=', 'completo'),
    orderBy('estadoPago'),
    orderBy('createdAt', 'desc'),
  ]);
}

export function useVentasCliente(clienteId: string) {
  return useRealtimeCollection(COLLECTIONS.VENTAS, [
    where('clienteId', '==', clienteId),
    orderBy('createdAt', 'desc'),
  ]);
}

// ============================================================
// 👤 HOOKS ESPECÍFICOS - CLIENTES
// ============================================================

export function useClientes() {
  return useRealtimeCollection(COLLECTIONS.CLIENTES, [orderBy('createdAt', 'desc')]);
}

export function useCliente(clienteId: string | null) {
  return useRealtimeDocument(COLLECTIONS.CLIENTES, clienteId);
}

export function useClientesConDeuda() {
  return useRealtimeCollection(COLLECTIONS.CLIENTES, [
    where('deudaTotal', '>', 0),
    orderBy('deudaTotal', 'desc'),
  ]);
}

// ============================================================
// 🏦 HOOKS ESPECÍFICOS - BANCOS
// ============================================================

export function useBanco(bancoId: string) {
  return useRealtimeDocument(bancoId, bancoId);
}

export function useBovedaMonte() {
  return useBanco(COLLECTIONS.BOVEDA_MONTE);
}

export function useBovedaUSA() {
  return useBanco(COLLECTIONS.BOVEDA_USA);
}

export function useUtilidades() {
  return useBanco(COLLECTIONS.UTILIDADES);
}

export function useFletes() {
  return useBanco(COLLECTIONS.FLETES);
}

export function useAzteca() {
  return useBanco(COLLECTIONS.AZTECA);
}

export function useLeftie() {
  return useBanco(COLLECTIONS.LEFTIE);
}

export function useProfit() {
  return useBanco(COLLECTIONS.PROFIT);
}

/**
 * Hook para obtener TODOS los bancos simultáneamente (7 bancos)
 */
export function useTodosBancos() {
  const bovedaMonte = useBovedaMonte();
  const bovedaUSA = useBovedaUSA();
  const utilidades = useUtilidades();
  const fletes = useFletes();
  const azteca = useAzteca();
  const leftie = useLeftie();
  const profit = useProfit();

  return {
    bancos: {
      bovedaMonte: bovedaMonte.data,
      bovedaUSA: bovedaUSA.data,
      utilidades: utilidades.data,
      fletes: fletes.data,
      azteca: azteca.data,
      leftie: leftie.data,
      profit: profit.data,
    },
    loading:
      bovedaMonte.loading ||
      bovedaUSA.loading ||
      utilidades.loading ||
      fletes.loading ||
      azteca.loading ||
      leftie.loading ||
      profit.loading,
    error:
      bovedaMonte.error ||
      bovedaUSA.error ||
      utilidades.error ||
      fletes.error ||
      azteca.error ||
      leftie.error ||
      profit.error,
  };
}

/**
 * Hook para calcular capital total de todos los bancos
 */
export function useCapitalTotal() {
  const { bancos, loading, error } = useTodosBancos();
  const [capitalTotal, setCapitalTotal] = useState(0);

  useEffect(() => {
    if (!loading && !error) {
      const total = Object.values(bancos).reduce((sum, banco) => {
        return sum + (banco?.capitalActual || 0);
      }, 0);
      setCapitalTotal(total);
    }
  }, [bancos, loading, error]);

  return { capitalTotal, loading, error };
}

// ============================================================
// 📦 HOOKS ESPECÍFICOS - ALMACÉN
// ============================================================

export function useAlmacen() {
  return useRealtimeCollection(COLLECTIONS.ALMACEN, [orderBy('producto')]);
}

export function useProductoAlmacen(productoId: string | null) {
  return useRealtimeDocument(COLLECTIONS.ALMACEN, productoId);
}

export function useStockBajo(umbral: number = 10) {
  return useRealtimeCollection(COLLECTIONS.ALMACEN, [
    where('stockActual', '<', umbral),
    orderBy('stockActual'),
  ]);
}

// ============================================================
// 📊 HOOKS PARA DASHBOARDS Y REPORTES
// ============================================================

/**
 * Hook para estadísticas completas del sistema
 */
export function useEstadisticasGenerales() {
  const ordenes = useOrdenesCompra();
  const ventas = useVentas();
  const clientes = useClientes();
  const distribuidores = useDistribuidores();
  const { capitalTotal } = useCapitalTotal();

  const [stats, setStats] = useState({
    totalVentas: 0,
    totalCompras: 0,
    gananciaBruta: 0,
    deudaPorCobrar: 0,
    deudaPorPagar: 0,
    capitalTotal: 0,
    totalClientes: 0,
    totalDistribuidores: 0,
    ventasPendientes: 0,
    ordenesCompraPendientes: 0,
  });

  useEffect(() => {
    const totalVentas = ventas.data?.reduce((sum, v) => sum + v.precioTotalVenta, 0) || 0;
    const totalCompras = ordenes.data?.reduce((sum, o) => sum + o.costoTotal, 0) || 0;
    const deudaPorCobrar = clientes.data?.reduce((sum, c) => sum + c.deudaTotal, 0) || 0;
    const deudaPorPagar = distribuidores.data?.reduce((sum, d) => sum + d.deudaTotal, 0) || 0;
    const ventasPendientes = ventas.data?.filter((v) => v.estadoPago !== 'completo').length || 0;
    const ordenesCompraPendientes = ordenes.data?.filter((o) => o.estado !== 'pagado').length || 0;

    setStats({
      totalVentas,
      totalCompras,
      gananciaBruta: totalVentas - totalCompras,
      deudaPorCobrar,
      deudaPorPagar,
      capitalTotal,
      totalClientes: clientes.data?.length || 0,
      totalDistribuidores: distribuidores.data?.length || 0,
      ventasPendientes,
      ordenesCompraPendientes,
    });
  }, [ventas.data, ordenes.data, clientes.data, distribuidores.data, capitalTotal]);

  return {
    stats,
    loading: ordenes.loading || ventas.loading || clientes.loading || distribuidores.loading,
    error: ordenes.error || ventas.error || clientes.error || distribuidores.error,
  };
}

// ============================================================
// EXPORTS
// ============================================================

export default {
  // Genéricos
  useRealtimeCollection,
  useRealtimeDocument,

  // Órdenes de Compra
  useOrdenesCompra,
  useOrdenCompra,
  useOrdenesCompraPendientes,
  useOrdenesCompraDistribuidor,

  // Distribuidores
  useDistribuidores,
  useDistribuidor,
  useDistribuidoresConDeuda,

  // Ventas
  useVentas,
  useVenta,
  useVentasPendientes,
  useVentasCliente,

  // Clientes
  useClientes,
  useCliente,
  useClientesConDeuda,

  // Bancos (7 bancos)
  useBanco,
  useBovedaMonte,
  useBovedaUSA,
  useUtilidades,
  useFletes,
  useAzteca,
  useLeftie,
  useProfit,
  useTodosBancos,
  useCapitalTotal,

  // Almacén
  useAlmacen,
  useProductoAlmacen,
  useStockBajo,

  // Estadísticas
  useEstadisticasGenerales,
};
