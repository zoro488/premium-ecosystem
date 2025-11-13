// ============================================================================
// CHRONOS DATA HOOK - Central Data Management
// Hook principal para manejo de datos con Firestore en tiempo real
// ============================================================================

import { db } from '@/lib/firebase';
import type {
    Banco,
    BancoId,
    Cliente,
    Distribuidor,
    Gasto,
    Movimiento,
    OrdenCompra,
    Producto,
    Venta,
} from '@/types';
import {
    collection,
    getDocs,
    onSnapshot,
    orderBy,
    query,
    Timestamp,
    where,
} from 'firebase/firestore';
import { useEffect, useState } from 'react';

export interface ChronosData {
  ventas: Venta[];
  clientes: Cliente[];
  bancos: Banco[];
  productos: Producto[];
  ordenesCompra: OrdenCompra[];
  distribuidores: Distribuidor[];
  gastos: Gasto[];
  movimientos: Movimiento[];
  loading: boolean;
  error: Error | null;
}

// ============================================================================
// BUSINESS LOGIC FUNCTIONS - FL/BM/UT System
// ============================================================================

/**
 * Calcula el Flete (FL) basado en unidades de caja
 * Fórmula: FL = unidadesCaja * 500
 */
export function computeFL(unidadesCaja: number, costoPorUnidad = 500): number {
  return unidadesCaja * costoPorUnidad;
}

/**
 * Calcula Bóveda Monte (BM) sumando costos de productos
 * Fórmula: BM = Σ(cpUnit * quantity)
 */
export function computeBM(productos: { cpUnit: number; cantidad: number }[]): number {
  return productos.reduce((sum, p) => sum + p.cpUnit * p.cantidad, 0);
}

/**
 * Calcula Utilidades (UT) como residuo
 * Fórmula: UT = PV - FL - BM (mínimo 0)
 */
export function computeUT(precioVenta: number, fl: number, bm: number): number {
  const ut = precioVenta - fl - bm;
  return Math.max(0, ut); // No puede ser negativo
}

/**
 * Calcula el adeudo de un cliente
 * Fórmula: Adeudo = Σ(ventas pendientes) - Σ(abonos realizados)
 */
export async function calcularAdeudoCliente(clienteId: string): Promise<number> {
  // Ventas pendientes del cliente
  const ventasQuery = query(
    collection(db, 'ventas'),
    where('clienteId', '==', clienteId),
    where('estatus', '==', 'Pendiente')
  );

  const ventasSnapshot = await getDocs(ventasQuery);
  const totalVentasPendientes = ventasSnapshot.docs.reduce(
    (sum, doc) => sum + (doc.data().precioVenta || 0),
    0
  );

  // Abonos realizados
  const abonosQuery = query(
    collection(db, 'gastos'),
    where('clienteId', '==', clienteId),
    where('tipo', '==', 'abono')
  );

  const abonosSnapshot = await getDocs(abonosQuery);
  const totalAbonos = abonosSnapshot.docs.reduce(
    (sum, doc) => sum + (doc.data().monto || 0),
    0
  );

  return Math.max(0, totalVentasPendientes - totalAbonos);
}

/**
 * Calcula el capital total disponible (suma de 7 bancos)
 */
export function calcularCapitalTotal(bancos: Banco[]): number {
  return bancos.reduce((sum, banco) => sum + (banco.capitalActual || 0), 0);
}

/**
 * Calcula distribución de buckets (FL/BM/UT)
 */
export function calcularDistribucionBuckets(bancos: Banco[]) {
  const fl = bancos.find(b => b.id === 'FL')?.capitalActual || 0;
  const bm = bancos.find(b => b.id === 'BM')?.capitalActual || 0;
  const ut = bancos.find(b => b.id === 'UT')?.capitalActual || 0;
  const total = fl + bm + ut;

  return {
    fl: {
      monto: fl,
      porcentaje: total > 0 ? (fl / total) * 100 : 0,
    },
    bm: {
      monto: bm,
      porcentaje: total > 0 ? (bm / total) * 100 : 0,
    },
    ut: {
      monto: ut,
      porcentaje: total > 0 ? (ut / total) * 100 : 0,
    },
    total,
  };
}

// ============================================================================
// MAIN HOOK
// ============================================================================

export function useChronosData(): ChronosData {
  const [ventas, setVentas] = useState<Venta[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [bancos, setBancos] = useState<Banco[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [ordenesCompra, setOrdenesCompra] = useState<OrdenCompra[]>([]);
  const [distribuidores, setDistribuidores] = useState<Distribuidor[]>([]);
  const [gastos, setGastos] = useState<Gasto[]>([]);
  const [movimientos, setMovimientos] = useState<Movimiento[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const unsubscribers: (() => void)[] = [];

    try {
      // 1. VENTAS - Real-time listener
      const ventasQuery = query(
        collection(db, 'ventas'),
        orderBy('fecha', 'desc')
      );
      const unsubVentas = onSnapshot(
        ventasQuery,
        (snapshot) => {
          const data = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            fecha: doc.data().fecha instanceof Timestamp
              ? doc.data().fecha.toDate()
              : doc.data().fecha,
          })) as Venta[];
          setVentas(data);
        },
        (err) => setError(err as Error)
      );
      unsubscribers.push(unsubVentas);

      // 2. CLIENTES
      const clientesQuery = query(
        collection(db, 'clientes'),
        orderBy('nombre', 'asc')
      );
      const unsubClientes = onSnapshot(
        clientesQuery,
        (snapshot) => {
          const data = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          })) as Cliente[];
          setClientes(data);
        },
        (err) => setError(err as Error)
      );
      unsubscribers.push(unsubClientes);

      // 3. BANCOS
      const bancosQuery = collection(db, 'bancos');
      const unsubBancos = onSnapshot(
        bancosQuery,
        (snapshot) => {
          const data = snapshot.docs.map(doc => ({
            id: doc.id as BancoId,
            ...doc.data(),
          })) as Banco[];
          setBancos(data);
        },
        (err) => setError(err as Error)
      );
      unsubscribers.push(unsubBancos);

      // 4. PRODUCTOS (Almacén)
      const productosQuery = query(
        collection(db, 'almacen'),
        orderBy('nombre', 'asc')
      );
      const unsubProductos = onSnapshot(
        productosQuery,
        (snapshot) => {
          const data = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          })) as Producto[];
          setProductos(data);
        },
        (err) => setError(err as Error)
      );
      unsubscribers.push(unsubProductos);

      // 5. ÓRDENES DE COMPRA
      const ordenesQuery = query(
        collection(db, 'ordenesCompra'),
        orderBy('fecha', 'desc')
      );
      const unsubOrdenes = onSnapshot(
        ordenesQuery,
        (snapshot) => {
          const data = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            fecha: doc.data().fecha instanceof Timestamp
              ? doc.data().fecha.toDate()
              : doc.data().fecha,
          })) as OrdenCompra[];
          setOrdenesCompra(data);
        },
        (err) => setError(err as Error)
      );
      unsubscribers.push(unsubOrdenes);

      // 6. DISTRIBUIDORES
      const distribuidoresQuery = query(
        collection(db, 'distribuidores'),
        orderBy('nombre', 'asc')
      );
      const unsubDistribuidores = onSnapshot(
        distribuidoresQuery,
        (snapshot) => {
          const data = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          })) as Distribuidor[];
          setDistribuidores(data);
        },
        (err) => setError(err as Error)
      );
      unsubscribers.push(unsubDistribuidores);

      // 7. GASTOS Y ABONOS
      const gastosQuery = query(
        collection(db, 'gastos'),
        orderBy('fecha', 'desc')
      );
      const unsubGastos = onSnapshot(
        gastosQuery,
        (snapshot) => {
          const data = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            fecha: doc.data().fecha instanceof Timestamp
              ? doc.data().fecha.toDate()
              : doc.data().fecha,
          })) as Gasto[];
          setGastos(data);
        },
        (err) => setError(err as Error)
      );
      unsubscribers.push(unsubGastos);

      // 8. MOVIMIENTOS BANCARIOS
      const movimientosQuery = query(
        collection(db, 'movimientos'),
        orderBy('fecha', 'desc')
      );
      const unsubMovimientos = onSnapshot(
        movimientosQuery,
        (snapshot) => {
          const data = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            fecha: doc.data().fecha instanceof Timestamp
              ? doc.data().fecha.toDate()
              : doc.data().fecha,
          })) as Movimiento[];
          setMovimientos(data);
        },
        (err) => setError(err as Error)
      );
      unsubscribers.push(unsubMovimientos);

      setLoading(false);
    } catch (err) {
      setError(err as Error);
      setLoading(false);
    }

    // Cleanup: unsubscribe from all listeners
    return () => {
      unsubscribers.forEach(unsub => unsub());
    };
  }, []);

  return {
    ventas,
    clientes,
    bancos,
    productos,
    ordenesCompra,
    distribuidores,
    gastos,
    movimientos,
    loading,
    error,
  };
}

// ============================================================================
// FILTERED QUERIES (Custom hooks para vistas específicas)
// ============================================================================

/**
 * Hook para obtener ventas de hoy
 */
export function useVentasHoy() {
  const { ventas, loading } = useChronosData();

  const ventasHoy = ventas.filter(v => {
    const fecha = v.fecha instanceof Date ? v.fecha : new Date(v.fecha);
    const hoy = new Date();
    return fecha.toDateString() === hoy.toDateString();
  });

  const totalHoy = ventasHoy.reduce((sum, v) => sum + v.precioVenta, 0);

  return { ventasHoy, totalHoy, loading };
}

/**
 * Hook para obtener movimientos de un banco específico
 */
export function useMovimientosBanco(bancoId: BancoId) {
  const { movimientos, loading } = useChronosData();

  const movimientosBanco = movimientos.filter(m => m.banco === bancoId);

  return { movimientos: movimientosBanco, loading };
}
