/**
 * 🔥 HOOK REUTILIZABLE: useBancoData
 *
 * Hook personalizado para obtener datos de cualquier banco desde Firestore
 * con React Query para caching, refetch automático y manejo de estados
 *
 * @example
 * const { banco, ingresos, gastos, cortes, isLoading } = useBancoData('boveda-monte');
 */
import { useQuery } from '@tanstack/react-query';
import { collection, doc, getDoc, getDocs, orderBy, query, where } from 'firebase/firestore';

import { db } from '@/lib/firebase';

/**
 * Obtiene datos completos de un banco específico desde Firestore
 * @param {string} bancoId - ID del banco (boveda-monte, azteca, profit, etc.)
 * @param {object} options - Opciones de configuración para React Query
 * @returns {object} - { banco, ingresos, gastos, cortes, isLoading, error, refetch }
 */
export function useBancoData(bancoId, options = {}) {
  const {
    enabled = true,
    refetchInterval = false,
    staleTime = 5 * 60 * 1000, // 5 minutos
  } = options;

  // ============================================================================
  // QUERY 1: Documento principal del banco
  // ============================================================================
  const bancoQuery = useQuery({
    queryKey: ['banco', bancoId],
    queryFn: async () => {
      if (!db) throw new Error('Firebase no inicializado');

      const bancoRef = doc(db, 'bancos', bancoId);
      const bancoSnap = await getDoc(bancoRef);

      if (!bancoSnap.exists()) {
        throw new Error(`Banco ${bancoId} no encontrado`);
      }

      return {
        id: bancoSnap.id,
        ...bancoSnap.data(),
      };
    },
    enabled,
    staleTime,
    refetchInterval,
  });

  // ============================================================================
  // QUERY 2: Ingresos del banco
  // ============================================================================
  const ingresosQuery = useQuery({
    queryKey: ['ingresos', bancoId],
    queryFn: async () => {
      if (!db) throw new Error('Firebase no inicializado');

      const ingresosRef = collection(db, 'ingresos');
      const q = query(ingresosRef, where('bancoId', '==', bancoId), orderBy('fecha', 'desc'));

      const snapshot = await getDocs(q);
      const ingresos = [];

      snapshot.forEach((doc) => {
        ingresos.push({
          id: doc.id,
          ...doc.data(),
          // Convertir Timestamp a Date
          fecha: doc.data().fecha?.toDate?.() || new Date(doc.data().fecha),
        });
      });

      return ingresos;
    },
    enabled: enabled && !!bancoId,
    staleTime,
    refetchInterval,
  });

  // ============================================================================
  // QUERY 3: Gastos del banco
  // ============================================================================
  const gastosQuery = useQuery({
    queryKey: ['gastos', bancoId],
    queryFn: async () => {
      if (!db) throw new Error('Firebase no inicializado');

      const gastosRef = collection(db, 'gastos');
      const q = query(gastosRef, where('bancoId', '==', bancoId), orderBy('fecha', 'desc'));

      const snapshot = await getDocs(q);
      const gastos = [];

      snapshot.forEach((doc) => {
        gastos.push({
          id: doc.id,
          ...doc.data(),
          fecha: doc.data().fecha?.toDate?.() || new Date(doc.data().fecha),
        });
      });

      return gastos;
    },
    enabled: enabled && !!bancoId,
    staleTime,
    refetchInterval,
  });

  // ============================================================================
  // QUERY 4: Cortes del banco
  // ============================================================================
  const cortesQuery = useQuery({
    queryKey: ['cortes', bancoId],
    queryFn: async () => {
      if (!db) throw new Error('Firebase no inicializado');

      const cortesRef = collection(db, 'cortes');
      const q = query(cortesRef, where('bancoId', '==', bancoId), orderBy('fecha', 'desc'));

      const snapshot = await getDocs(q);
      const cortes = [];

      snapshot.forEach((doc) => {
        cortes.push({
          id: doc.id,
          ...doc.data(),
          fecha: doc.data().fecha?.toDate?.() || new Date(doc.data().fecha),
        });
      });

      return cortes;
    },
    enabled: enabled && !!bancoId,
    staleTime,
    refetchInterval,
  });

  // ============================================================================
  // ESTADO AGREGADO
  // ============================================================================
  const isLoading =
    bancoQuery.isLoading ||
    ingresosQuery.isLoading ||
    gastosQuery.isLoading ||
    cortesQuery.isLoading;

  const isError =
    bancoQuery.isError || ingresosQuery.isError || gastosQuery.isError || cortesQuery.isError;

  const error = bancoQuery.error || ingresosQuery.error || gastosQuery.error || cortesQuery.error;

  // ============================================================================
  // REFETCH FUNCTION (útil para refresh manual)
  // ============================================================================
  const refetch = async () => {
    await Promise.all([
      bancoQuery.refetch(),
      ingresosQuery.refetch(),
      gastosQuery.refetch(),
      cortesQuery.refetch(),
    ]);
  };

  // ============================================================================
  // CÁLCULOS DERIVADOS
  // ============================================================================
  const banco = bancoQuery.data;
  const ingresos = ingresosQuery.data || [];
  const gastos = gastosQuery.data || [];
  const cortes = cortesQuery.data || [];

  // Totales calculados
  const totalIngresos = ingresos.reduce((sum, ing) => sum + (ing.monto || 0), 0);
  const totalGastos = gastos.reduce((sum, gasto) => sum + (gasto.monto || 0), 0);
  const totalCortes = cortes.reduce((sum, corte) => sum + (corte.monto || 0), 0);
  const rfActualCalculado = totalIngresos - totalGastos - totalCortes;

  // Últimas transacciones (5 más recientes combinadas)
  const ultimasTransacciones = [
    ...ingresos.slice(0, 3).map((ing) => ({ ...ing, tipo: 'ingreso' })),
    ...gastos.slice(0, 3).map((gasto) => ({ ...gasto, tipo: 'gasto' })),
  ]
    .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
    .slice(0, 5);

  return {
    // Datos principales
    banco,
    ingresos,
    gastos,
    cortes,

    // Estados
    isLoading,
    isError,
    error,

    // Funciones
    refetch,

    // Datos calculados
    totales: {
      ingresos: totalIngresos,
      gastos: totalGastos,
      cortes: totalCortes,
      rfActual: rfActualCalculado,
    },

    // Estadísticas adicionales
    stats: {
      countIngresos: ingresos.length,
      countGastos: gastos.length,
      countCortes: cortes.length,
      promedioIngreso: ingresos.length > 0 ? totalIngresos / ingresos.length : 0,
      promedioGasto: gastos.length > 0 ? totalGastos / gastos.length : 0,
    },

    // Últimas transacciones
    ultimasTransacciones,
  };
}

/**
 * Hook para obtener todos los bancos (sin detalles de transacciones)
 * Útil para el dashboard principal
 */
export function useBancosResumen(options = {}) {
  const { enabled = true, refetchInterval = false, staleTime = 5 * 60 * 1000 } = options;

  return useQuery({
    queryKey: ['bancos-resumen'],
    queryFn: async () => {
      if (!db) throw new Error('Firebase no inicializado');

      const bancosRef = collection(db, 'bancos');
      const snapshot = await getDocs(bancosRef);

      const bancos = [];
      snapshot.forEach((doc) => {
        bancos.push({
          id: doc.id,
          ...doc.data(),
        });
      });

      // Ordenar por capital descendente
      return bancos.sort((a, b) => (b.capitalActual || 0) - (a.capitalActual || 0));
    },
    enabled,
    staleTime,
    refetchInterval,
  });
}

/**
 * Hook para obtener el dashboard completo con todas las métricas
 */
export function useDashboardData(options = {}) {
  const { enabled = true, refetchInterval = false, staleTime = 5 * 60 * 1000 } = options;

  return useQuery({
    queryKey: ['dashboard-data'],
    queryFn: async () => {
      if (!db) throw new Error('Firebase no inicializado');

      const dashboardRef = doc(db, 'sistema', 'dashboard');
      const dashboardSnap = await getDoc(dashboardRef);

      if (!dashboardSnap.exists()) {
        // Si no existe, calcular desde los bancos
        const bancosRef = collection(db, 'bancos');
        const snapshot = await getDocs(bancosRef);

        let capitalEfectivo = 0;
        const paneles = [];

        snapshot.forEach((doc) => {
          const data = doc.data();
          capitalEfectivo += data.capitalActual || 0;
          paneles.push({
            panel: data.nombre,
            rfActual: data.capitalActual || 0,
            tipo: 'efectivo',
          });
        });

        return {
          capitalEfectivo,
          inventarioFisico: 0,
          totalRfActual: capitalEfectivo,
          paneles,
        };
      }

      return dashboardSnap.data();
    },
    enabled,
    staleTime,
    refetchInterval,
  });
}
