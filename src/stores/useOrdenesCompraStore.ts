/**
 * 📦 ZUSTAND STORE - ÓRDENES DE COMPRA Y DISTRIBUIDORES
 * ======================================================
 * Store con real-time listeners para OC y distribuidores
 */
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

import {
  crearOrdenCompra,
  getDistribuidores,
  getOrdenesCompra,
  registrarAbonoDistribuidor,
  subscribeToDistribuidores,
  subscribeToOrdenesCompra,
} from '@/services/flowdistributor.service';
import type {
  AbonoDistribuidorFormData,
  Distribuidor,
  OrdenCompra,
  OrdenCompraFormData,
} from '@/types/flowdistributor.types';

// ============================================================================
// TYPES
// ============================================================================

interface OrdenesCompraState {
  // Data
  ordenesCompra: OrdenCompra[];
  distribuidores: Distribuidor[];

  // Loading states
  loading: boolean;
  loadingDistribuidores: boolean;

  // Error states
  error: string | null;

  // Actions
  fetchOrdenesCompra: (distribuidorId?: string) => Promise<void>;
  fetchDistribuidores: () => Promise<void>;

  // Real-time subscriptions
  subscribeToOrdenesCompraRealtime: (distribuidorId?: string) => () => void;
  subscribeToDistribuidoresRealtime: () => () => void;

  // Operations
  crearOrdenCompra: (data: OrdenCompraFormData) => Promise<string>;
  registrarAbonoDistribuidor: (data: AbonoDistribuidorFormData) => Promise<string>;

  // Selectors
  getOrdenCompraById: (id: string) => OrdenCompra | undefined;
  getDistribuidorById: (id: string) => Distribuidor | undefined;
  getOrdenesByDistribuidor: (distribuidorId: string) => OrdenCompra[];
  getOrdenesPendientes: () => OrdenCompra[];
  getTotalOrdenesCompra: () => number;
  getTotalComprado: () => number;
  getTotalAdeudosDistribuidores: () => number;
  getDistribuidoresConAdeudo: () => Distribuidor[];

  // Reset
  reset: () => void;
}

// ============================================================================
// STORE
// ============================================================================

export const useOrdenesCompraStore = create<OrdenesCompraState>()(
  devtools(
    (set, get) => ({
      // Initial state
      ordenesCompra: [],
      distribuidores: [],
      loading: false,
      loadingDistribuidores: false,
      error: null,

      // Fetch órdenes de compra
      fetchOrdenesCompra: async (distribuidorId?: string) => {
        set({ loading: true, error: null });
        try {
          const ordenesCompra = await getOrdenesCompra(distribuidorId);
          set({ ordenesCompra, loading: false });
        } catch (error: any) {
          set({ error: error.message, loading: false });
          console.error('Error fetching órdenes de compra:', error);
        }
      },

      // Fetch distribuidores
      fetchDistribuidores: async () => {
        set({ loadingDistribuidores: true, error: null });
        try {
          const distribuidores = await getDistribuidores();
          set({ distribuidores, loadingDistribuidores: false });
        } catch (error: any) {
          set({ error: error.message, loadingDistribuidores: false });
          console.error('Error fetching distribuidores:', error);
        }
      },

      // Real-time subscription para órdenes de compra
      subscribeToOrdenesCompraRealtime: (distribuidorId?: string) => {
        const unsubscribe = subscribeToOrdenesCompra((ordenesCompra) => {
          set({ ordenesCompra, loading: false });
        }, distribuidorId);
        return unsubscribe;
      },

      // Real-time subscription para distribuidores
      subscribeToDistribuidoresRealtime: () => {
        const unsubscribe = subscribeToDistribuidores((distribuidores) => {
          set({ distribuidores, loadingDistribuidores: false });
        });
        return unsubscribe;
      },

      // Crear orden de compra
      crearOrdenCompra: async (data: OrdenCompraFormData) => {
        try {
          const id = await crearOrdenCompra(data);
          return id;
        } catch (error: any) {
          set({ error: error.message });
          throw error;
        }
      },

      // Registrar abono a distribuidor
      registrarAbonoDistribuidor: async (data: AbonoDistribuidorFormData) => {
        try {
          const id = await registrarAbonoDistribuidor(data);
          return id;
        } catch (error: any) {
          set({ error: error.message });
          throw error;
        }
      },

      // Selectors
      getOrdenCompraById: (id: string) => {
        return get().ordenesCompra.find((oc) => oc.id === id);
      },

      getDistribuidorById: (id: string) => {
        return get().distribuidores.find((d) => d.id === id);
      },

      getOrdenesByDistribuidor: (distribuidorId: string) => {
        return get().ordenesCompra.filter((oc) => oc.distribuidorId === distribuidorId);
      },

      getOrdenesPendientes: () => {
        return get().ordenesCompra.filter((oc) => oc.montoRestante > 0);
      },

      getTotalOrdenesCompra: () => {
        return get().ordenesCompra.length;
      },

      getTotalComprado: () => {
        return get().ordenesCompra.reduce((sum, oc) => sum + oc.total, 0);
      },

      getTotalAdeudosDistribuidores: () => {
        return get().distribuidores.reduce((sum, d) => sum + d.adeudoPendiente, 0);
      },

      getDistribuidoresConAdeudo: () => {
        return get().distribuidores.filter((d) => d.adeudoPendiente > 0);
      },

      // Reset
      reset: () => {
        set({
          ordenesCompra: [],
          distribuidores: [],
          loading: false,
          loadingDistribuidores: false,
          error: null,
        });
      },
    }),
    { name: 'OrdenesCompraStore' }
  )
);
