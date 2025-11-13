/**
 * 💰 ZUSTAND STORE - VENTAS
 * ==========================
 * Store con real-time listeners para ventas y clientes
 */
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

import {
  crearVenta,
  getClientes,
  getVentas,
  registrarAbonoCliente,
  subscribeToClientes,
  subscribeToVentas,
} from '@/services/flowdistributor.service';
import type {
  AbonoClienteFormData,
  Cliente,
  Venta,
  VentaFormData,
} from '@/types/flowdistributor.types';

// ============================================================================
// TYPES
// ============================================================================

interface VentasState {
  // Data
  ventas: Venta[];
  clientes: Cliente[];

  // Loading states
  loading: boolean;
  loadingClientes: boolean;

  // Error states
  error: string | null;

  // Actions
  fetchVentas: (clienteId?: string) => Promise<void>;
  fetchClientes: () => Promise<void>;

  // Real-time subscriptions
  subscribeToVentasRealtime: (clienteId?: string) => () => void;
  subscribeToClientesRealtime: () => () => void;

  // Operations
  crearVenta: (data: VentaFormData) => Promise<string>;
  registrarAbono: (data: AbonoClienteFormData) => Promise<string>;

  // Selectors
  getVentaById: (id: string) => Venta | undefined;
  getClienteById: (id: string) => Cliente | undefined;
  getVentasByCliente: (clienteId: string) => Venta[];
  getVentasPendientes: () => Venta[];
  getTotalVentas: () => number;
  getTotalVendido: () => number;
  getTotalAdeudos: () => number;
  getClientesConAdeudo: () => Cliente[];

  // Reset
  reset: () => void;
}

// ============================================================================
// STORE
// ============================================================================

export const useVentasStore = create<VentasState>()(
  devtools(
    (set, get) => ({
      // Initial state
      ventas: [],
      clientes: [],
      loading: false,
      loadingClientes: false,
      error: null,

      // Fetch ventas
      fetchVentas: async (clienteId?: string) => {
        set({ loading: true, error: null });
        try {
          const ventas = await getVentas(clienteId);
          set({ ventas, loading: false });
        } catch (error: any) {
          set({ error: error.message, loading: false });
          console.error('Error fetching ventas:', error);
        }
      },

      // Fetch clientes
      fetchClientes: async () => {
        set({ loadingClientes: true, error: null });
        try {
          const clientes = await getClientes();
          set({ clientes, loadingClientes: false });
        } catch (error: any) {
          set({ error: error.message, loadingClientes: false });
          console.error('Error fetching clientes:', error);
        }
      },

      // Real-time subscription para ventas
      subscribeToVentasRealtime: (clienteId?: string) => {
        const unsubscribe = subscribeToVentas((ventas) => {
          set({ ventas, loading: false });
        }, clienteId);
        return unsubscribe;
      },

      // Real-time subscription para clientes
      subscribeToClientesRealtime: () => {
        const unsubscribe = subscribeToClientes((clientes) => {
          set({ clientes, loadingClientes: false });
        });
        return unsubscribe;
      },

      // Crear venta
      crearVenta: async (data: VentaFormData) => {
        try {
          const id = await crearVenta(data);
          return id;
        } catch (error: any) {
          set({ error: error.message });
          throw error;
        }
      },

      // Registrar abono de cliente
      registrarAbono: async (data: AbonoClienteFormData) => {
        try {
          const id = await registrarAbonoCliente(data);
          return id;
        } catch (error: any) {
          set({ error: error.message });
          throw error;
        }
      },

      // Selectors
      getVentaById: (id: string) => {
        return get().ventas.find((v) => v.id === id);
      },

      getClienteById: (id: string) => {
        return get().clientes.find((c) => c.id === id);
      },

      getVentasByCliente: (clienteId: string) => {
        return get().ventas.filter((v) => v.clienteId === clienteId);
      },

      getVentasPendientes: () => {
        return get().ventas.filter((v) => v.montoRestante > 0);
      },

      getTotalVentas: () => {
        return get().ventas.length;
      },

      getTotalVendido: () => {
        return get().ventas.reduce((sum, v) => sum + v.total, 0);
      },

      getTotalAdeudos: () => {
        return get().clientes.reduce((sum, c) => sum + c.adeudoPendiente, 0);
      },

      getClientesConAdeudo: () => {
        return get().clientes.filter((c) => c.adeudoPendiente > 0);
      },

      // Reset
      reset: () => {
        set({
          ventas: [],
          clientes: [],
          loading: false,
          loadingClientes: false,
          error: null,
        });
      },
    }),
    { name: 'VentasStore' }
  )
);
