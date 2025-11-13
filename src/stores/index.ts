/**
 * 🏪 STORES INDEX - FLOWDISTRIBUTOR
 * ==================================
 * Exportaciones centralizadas de todos los stores
 */

export { useAlmacenStore } from './useAlmacenStore';
export { useBancosStore } from './useBancosStore';
export { useDashboardStore } from './useDashboardStore';
export { useOrdenesCompraStore } from './useOrdenesCompraStore';
export { useVentasStore } from './useVentasStore';

// Re-exportar tipos
export type {
  Banco,
  Cliente,
  DashboardData,
  Distribuidor,
  Gasto,
  Ingreso,
  MovimientoStock,
  OrdenCompra,
  Producto,
  Transferencia,
  Venta,
} from '@/types/flowdistributor.types';
