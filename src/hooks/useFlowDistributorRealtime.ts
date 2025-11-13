/**
 * 🎣 CUSTOM HOOK - USE FLOWDISTRIBUTOR REALTIME
 * ==============================================
 * Hook que inicializa todos los listeners en tiempo real
 */
import { useEffect } from 'react';

import { useAlmacenStore } from '@/stores/useAlmacenStore';
import { useBancosStore } from '@/stores/useBancosStore';
import { useDashboardStore } from '@/stores/useDashboardStore';
import { useOrdenesCompraStore } from '@/stores/useOrdenesCompraStore';
import { useVentasStore } from '@/stores/useVentasStore';

/**
 * Hook para inicializar todos los listeners en tiempo real de FlowDistributor
 * Usar en el componente raíz de la aplicación o en el layout principal
 */
export const useFlowDistributorRealtime = () => {
  const bancosStore = useBancosStore();
  const ventasStore = useVentasStore();
  const ordenesStore = useOrdenesCompraStore();
  const almacenStore = useAlmacenStore();
  const dashboardStore = useDashboardStore();

  useEffect(() => {
    console.log('🔄 Iniciando listeners en tiempo real de FlowDistributor...');

    // Suscribirse a bancos
    const unsubscribeBancos = bancosStore.subscribeToBancosRealtime();
    const unsubscribeGastos = bancosStore.subscribeToGastosRealtime();
    const unsubscribeIngresos = bancosStore.subscribeToIngresosRealtime();
    const unsubscribeTransferencias = bancosStore.subscribeToTransferenciasRealtime();

    // Suscribirse a ventas y clientes
    const unsubscribeVentas = ventasStore.subscribeToVentasRealtime();
    const unsubscribeClientes = ventasStore.subscribeToClientesRealtime();

    // Suscribirse a órdenes de compra y distribuidores
    const unsubscribeOrdenes = ordenesStore.subscribeToOrdenesCompraRealtime();
    const unsubscribeDistribuidores = ordenesStore.subscribeToDistribuidoresRealtime();

    // Suscribirse a productos y movimientos de stock
    const unsubscribeProductos = almacenStore.subscribeToProductosRealtime();
    const unsubscribeMovimientos = almacenStore.subscribeToMovimientosRealtime();

    console.log('✅ Listeners en tiempo real activados');

    // Calcular dashboard inicial
    setTimeout(() => {
      dashboardStore.calculateDashboardData();
    }, 1000);

    // Cleanup: desuscribirse cuando el componente se desmonta
    return () => {
      console.log('🔌 Desconectando listeners en tiempo real...');
      unsubscribeBancos();
      unsubscribeGastos();
      unsubscribeIngresos();
      unsubscribeTransferencias();
      unsubscribeVentas();
      unsubscribeClientes();
      unsubscribeOrdenes();
      unsubscribeDistribuidores();
      unsubscribeProductos();
      unsubscribeMovimientos();
    };
  }, []);

  // Recalcular dashboard cuando cambien los datos
  useEffect(() => {
    dashboardStore.calculateDashboardData();
  }, [
    bancosStore.bancos,
    ventasStore.ventas,
    ventasStore.clientes,
    ordenesStore.ordenesCompra,
    ordenesStore.distribuidores,
    almacenStore.productos,
    almacenStore.movimientos,
  ]);

  return {
    bancos: bancosStore.bancos,
    ventas: ventasStore.ventas,
    clientes: ventasStore.clientes,
    ordenesCompra: ordenesStore.ordenesCompra,
    distribuidores: ordenesStore.distribuidores,
    productos: almacenStore.productos,
    movimientos: almacenStore.movimientos,
    dashboardData: dashboardStore.dashboardData,
    loading:
      bancosStore.loading ||
      ventasStore.loading ||
      ordenesStore.loading ||
      almacenStore.loading ||
      dashboardStore.loading,
  };
};

/**
 * Hook simplificado para usar los stores individuales
 */
export const useFlowDistributor = () => {
  return {
    bancos: useBancosStore(),
    ventas: useVentasStore(),
    ordenes: useOrdenesCompraStore(),
    almacen: useAlmacenStore(),
    dashboard: useDashboardStore(),
  };
};
