/**
 * 📦 ZUSTAND STORE - ALMACÉN (INVENTARIO Y STOCK)
 * ================================================
 * Store con real-time listeners para productos y movimientos de stock
 */
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

import {
  getMovimientosStock,
  getProductos,
  subscribeToMovimientosStock,
  subscribeToProductos,
} from '@/services/flowdistributor-operations.service';
import type { MovimientoStock, Producto } from '@/types/flowdistributor.types';

// ============================================================================
// TYPES
// ============================================================================

interface AlmacenState {
  // Data
  productos: Producto[];
  movimientos: MovimientoStock[];

  // Loading states
  loading: boolean;
  loadingMovimientos: boolean;

  // Error states
  error: string | null;

  // Actions
  fetchProductos: () => Promise<void>;
  fetchMovimientos: (productoId?: string) => Promise<void>;

  // Real-time subscriptions
  subscribeToProductosRealtime: () => () => void;
  subscribeToMovimientosRealtime: (productoId?: string) => () => void;

  // Selectors
  getProductoById: (id: string) => Producto | undefined;
  getProductosBajoStock: (minimo?: number) => Producto[];
  getMovimientosByProducto: (productoId: string) => MovimientoStock[];
  getMovimientosEntradas: () => MovimientoStock[];
  getMovimientosSalidas: () => MovimientoStock[];
  getTotalStock: () => number;
  getValorInventario: () => number;
  getTotalEntradas: () => number;
  getTotalSalidas: () => number;

  // Reset
  reset: () => void;
}

// ============================================================================
// STORE
// ============================================================================

export const useAlmacenStore = create<AlmacenState>()(
  devtools(
    (set, get) => ({
      // Initial state
      productos: [],
      movimientos: [],
      loading: false,
      loadingMovimientos: false,
      error: null,

      // Fetch productos
      fetchProductos: async () => {
        set({ loading: true, error: null });
        try {
          const productos = await getProductos();
          set({ productos, loading: false });
        } catch (error: any) {
          set({ error: error.message, loading: false });
          console.error('Error fetching productos:', error);
        }
      },

      // Fetch movimientos
      fetchMovimientos: async (productoId?: string) => {
        set({ loadingMovimientos: true, error: null });
        try {
          const movimientos = await getMovimientosStock(productoId);
          set({ movimientos, loadingMovimientos: false });
        } catch (error: any) {
          set({ error: error.message, loadingMovimientos: false });
          console.error('Error fetching movimientos:', error);
        }
      },

      // Real-time subscription para productos
      subscribeToProductosRealtime: () => {
        const unsubscribe = subscribeToProductos((productos) => {
          set({ productos, loading: false });
        });
        return unsubscribe;
      },

      // Real-time subscription para movimientos
      subscribeToMovimientosRealtime: (productoId?: string) => {
        const unsubscribe = subscribeToMovimientosStock((movimientos) => {
          set({ movimientos, loadingMovimientos: false });
        }, productoId);
        return unsubscribe;
      },

      // Selectors
      getProductoById: (id: string) => {
        return get().productos.find((p) => p.id === id);
      },

      getProductosBajoStock: (minimo: number = 10) => {
        return get().productos.filter((p) => p.stockActual < minimo);
      },

      getMovimientosByProducto: (productoId: string) => {
        return get().movimientos.filter((m) => m.productoId === productoId);
      },

      getMovimientosEntradas: () => {
        return get().movimientos.filter((m) => m.tipo === 'entrada');
      },

      getMovimientosSalidas: () => {
        return get().movimientos.filter((m) => m.tipo === 'salida');
      },

      getTotalStock: () => {
        return get().productos.reduce((sum, p) => sum + p.stockActual, 0);
      },

      getValorInventario: () => {
        return get().productos.reduce((sum, p) => sum + p.stockActual * p.precioCompra, 0);
      },

      getTotalEntradas: () => {
        return get()
          .movimientos.filter((m) => m.tipo === 'entrada')
          .reduce((sum, m) => sum + m.cantidad, 0);
      },

      getTotalSalidas: () => {
        return get()
          .movimientos.filter((m) => m.tipo === 'salida')
          .reduce((sum, m) => sum + m.cantidad, 0);
      },

      // Reset
      reset: () => {
        set({
          productos: [],
          movimientos: [],
          loading: false,
          loadingMovimientos: false,
          error: null,
        });
      },
    }),
    { name: 'AlmacenStore' }
  )
);
