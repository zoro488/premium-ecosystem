/**
 * 🏦 ZUSTAND STORE - BANCOS
 * =========================
 * Store con real-time listeners para los 7 bancos del sistema
 */
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

import {
  getBancos,
  getGastos,
  getIngresos,
  getTransferencias,
  registrarGasto,
  registrarIngreso,
  registrarTransferencia,
  subscribeToBancos,
  subscribeToGastos,
  subscribeToIngresos,
  subscribeToTransferencias,
} from '@/services/flowdistributor-operations.service';
import type {
  Banco,
  Gasto,
  GastoFormData,
  Ingreso,
  IngresoFormData,
  Transferencia,
  TransferenciaFormData,
} from '@/types/flowdistributor.types';

// ============================================================================
// TYPES
// ============================================================================

interface BancosState {
  // Data
  bancos: Banco[];
  gastos: Gasto[];
  ingresos: Ingreso[];
  transferencias: Transferencia[];

  // Loading states
  loading: boolean;
  loadingGastos: boolean;
  loadingIngresos: boolean;
  loadingTransferencias: boolean;

  // Error states
  error: string | null;

  // Actions
  fetchBancos: () => Promise<void>;
  fetchGastos: (bancoId?: string) => Promise<void>;
  fetchIngresos: (bancoId?: string) => Promise<void>;
  fetchTransferencias: () => Promise<void>;

  // Real-time subscriptions
  subscribeToBancosRealtime: () => () => void;
  subscribeToGastosRealtime: (bancoId?: string) => () => void;
  subscribeToIngresosRealtime: (bancoId?: string) => () => void;
  subscribeToTransferenciasRealtime: () => () => void;

  // Operations
  crearGasto: (data: GastoFormData) => Promise<string>;
  crearIngreso: (data: IngresoFormData) => Promise<string>;
  crearTransferencia: (data: TransferenciaFormData) => Promise<string>;

  // Selectors
  getBancoById: (id: string) => Banco | undefined;
  getTotalCapital: () => number;
  getTotalCapitalHistorico: () => number;
  getTotalGastos: () => number;
  getGastosByBanco: (bancoId: string) => Gasto[];
  getIngresosByBanco: (bancoId: string) => Ingreso[];

  // Reset
  reset: () => void;
}

// ============================================================================
// STORE
// ============================================================================

export const useBancosStore = create<BancosState>()(
  devtools(
    (set, get) => ({
      // Initial state
      bancos: [],
      gastos: [],
      ingresos: [],
      transferencias: [],
      loading: false,
      loadingGastos: false,
      loadingIngresos: false,
      loadingTransferencias: false,
      error: null,

      // Fetch bancos
      fetchBancos: async () => {
        set({ loading: true, error: null });
        try {
          const bancos = await getBancos();
          set({ bancos, loading: false });
        } catch (error: any) {
          set({ error: error.message, loading: false });
          console.error('Error fetching bancos:', error);
        }
      },

      // Fetch gastos
      fetchGastos: async (bancoId?: string) => {
        set({ loadingGastos: true, error: null });
        try {
          const gastos = await getGastos(bancoId);
          set({ gastos, loadingGastos: false });
        } catch (error: any) {
          set({ error: error.message, loadingGastos: false });
          console.error('Error fetching gastos:', error);
        }
      },

      // Fetch ingresos
      fetchIngresos: async (bancoId?: string) => {
        set({ loadingIngresos: true, error: null });
        try {
          const ingresos = await getIngresos(bancoId);
          set({ ingresos, loadingIngresos: false });
        } catch (error: any) {
          set({ error: error.message, loadingIngresos: false });
          console.error('Error fetching ingresos:', error);
        }
      },

      // Fetch transferencias
      fetchTransferencias: async () => {
        set({ loadingTransferencias: true, error: null });
        try {
          const transferencias = await getTransferencias();
          set({ transferencias, loadingTransferencias: false });
        } catch (error: any) {
          set({ error: error.message, loadingTransferencias: false });
          console.error('Error fetching transferencias:', error);
        }
      },

      // Real-time subscription para bancos
      subscribeToBancosRealtime: () => {
        const unsubscribe = subscribeToBancos((bancos) => {
          set({ bancos, loading: false });
        });
        return unsubscribe;
      },

      // Real-time subscription para gastos
      subscribeToGastosRealtime: (bancoId?: string) => {
        const unsubscribe = subscribeToGastos((gastos) => {
          set({ gastos, loadingGastos: false });
        }, bancoId);
        return unsubscribe;
      },

      // Real-time subscription para ingresos
      subscribeToIngresosRealtime: (bancoId?: string) => {
        const unsubscribe = subscribeToIngresos((ingresos) => {
          set({ ingresos, loadingIngresos: false });
        }, bancoId);
        return unsubscribe;
      },

      // Real-time subscription para transferencias
      subscribeToTransferenciasRealtime: () => {
        const unsubscribe = subscribeToTransferencias((transferencias) => {
          set({ transferencias, loadingTransferencias: false });
        });
        return unsubscribe;
      },

      // Crear gasto
      crearGasto: async (data: GastoFormData) => {
        try {
          const id = await registrarGasto(data);
          return id;
        } catch (error: any) {
          set({ error: error.message });
          throw error;
        }
      },

      // Crear ingreso
      crearIngreso: async (data: IngresoFormData) => {
        try {
          const id = await registrarIngreso(data);
          return id;
        } catch (error: any) {
          set({ error: error.message });
          throw error;
        }
      },

      // Crear transferencia
      crearTransferencia: async (data: TransferenciaFormData) => {
        try {
          const id = await registrarTransferencia(data);
          return id;
        } catch (error: any) {
          set({ error: error.message });
          throw error;
        }
      },

      // Selectors
      getBancoById: (id: string) => {
        return get().bancos.find((b) => b.id === id);
      },

      getTotalCapital: () => {
        return get().bancos.reduce((sum, b) => sum + b.capital, 0);
      },

      getTotalCapitalHistorico: () => {
        return get().bancos.reduce((sum, b) => sum + b.capitalHistorico, 0);
      },

      getTotalGastos: () => {
        return get().bancos.reduce((sum, b) => sum + b.totalGastos, 0);
      },

      getGastosByBanco: (bancoId: string) => {
        return get().gastos.filter((g) => g.bancoId === bancoId);
      },

      getIngresosByBanco: (bancoId: string) => {
        return get().ingresos.filter((i) => i.bancoId === bancoId);
      },

      // Reset
      reset: () => {
        set({
          bancos: [],
          gastos: [],
          ingresos: [],
          transferencias: [],
          loading: false,
          loadingGastos: false,
          loadingIngresos: false,
          loadingTransferencias: false,
          error: null,
        });
      },
    }),
    { name: 'BancosStore' }
  )
);
