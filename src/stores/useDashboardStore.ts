/**
 * 📊 ZUSTAND STORE - DASHBOARD MAESTRO
 * =====================================
 * Store que integra todas las métricas y análisis del sistema
 */
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

import { GenkitAIService } from '@/services/genkit-ai.service';
import type {
  DashboardData,
  MetricaAlmacen,
  MetricaBanco,
  MetricaVentas,
} from '@/types/flowdistributor.types';

import { useAlmacenStore } from './useAlmacenStore';
import { useBancosStore } from './useBancosStore';
import { useOrdenesCompraStore } from './useOrdenesCompraStore';
import { useVentasStore } from './useVentasStore';

// ============================================================================
// TYPES
// ============================================================================

interface DashboardState {
  // Data
  dashboardData: DashboardData | null;

  // AI Analysis
  aiAnalysisVentas: any | null;
  aiAnalysisBancos: any | null;
  aiAnalysisInventario: any | null;
  aiDashboardExecutivo: any | null;

  // Loading states
  loading: boolean;
  loadingAI: boolean;

  // Error states
  error: string | null;

  // Actions
  calculateDashboardData: () => void;

  // AI Actions
  runAIAnalysisVentas: (period?: 'dia' | 'semana' | 'mes' | 'trimestre' | 'año') => Promise<void>;
  runAIAnalysisBancos: () => Promise<void>;
  runAIAnalysisInventario: () => Promise<void>;
  runAIDashboardExecutivo: () => Promise<void>;
  runAllAIAnalysis: () => Promise<void>;

  // Selectors
  getSaludFinanciera: () => number;
  getFlujoCajaNeto: () => number;
  getROI: () => number;
  getMargenUtilidad: () => number;

  // Reset
  reset: () => void;
}

// ============================================================================
// STORE
// ============================================================================

export const useDashboardStore = create<DashboardState>()(
  devtools(
    (set, get) => ({
      // Initial state
      dashboardData: null,
      aiAnalysisVentas: null,
      aiAnalysisBancos: null,
      aiAnalysisInventario: null,
      aiDashboardExecutivo: null,
      loading: false,
      loadingAI: false,
      error: null,

      // Calcular datos del dashboard
      calculateDashboardData: () => {
        try {
          const bancosStore = useBancosStore.getState();
          const ventasStore = useVentasStore.getState();
          const ordenesStore = useOrdenesCompraStore.getState();
          const almacenStore = useAlmacenStore.getState();

          // Métricas de bancos
          const bancos = bancosStore.bancos;
          const totalCapital = bancos.reduce((sum, b) => sum + b.capital, 0);

          const metricasBancos: MetricaBanco[] = bancos.map((banco) => ({
            bancoId: banco.id,
            bancoNombre: banco.nombre,
            capital: banco.capital,
            capitalHistorico: banco.capitalHistorico,
            totalGastos: banco.totalGastos,
            totalTransferencias:
              banco.totalTransferenciasEnviadas + banco.totalTransferenciasRecibidas,
            porcentajeCapitalTotal: totalCapital > 0 ? (banco.capital / totalCapital) * 100 : 0,
            tendencia: 'estable', // TODO: Calcular tendencia
          }));

          // Métricas de ventas
          const ventas = ventasStore.ventas;
          const totalVentas = ventas.length;
          const montoTotalVendido = ventas.reduce((sum, v) => sum + v.total, 0);
          const ventasCompletas = ventas.filter((v) => v.montoRestante === 0).length;
          const ventasParciales = ventas.filter(
            (v) => v.montoRestante > 0 && v.montoPagado > 0
          ).length;
          const ventasPendientes = ventas.filter((v) => v.montoPagado === 0).length;
          const promedioVenta = totalVentas > 0 ? montoTotalVendido / totalVentas : 0;

          // Top productos vendidos
          const productosVendidos: Record<
            string,
            { nombre: string; cantidad: number; monto: number }
          > = {};
          ventas.forEach((venta) => {
            venta.productos.forEach((prod) => {
              if (!productosVendidos[prod.productoId]) {
                productosVendidos[prod.productoId] = {
                  nombre: prod.productoNombre,
                  cantidad: 0,
                  monto: 0,
                };
              }
              productosVendidos[prod.productoId].cantidad += prod.cantidad;
              productosVendidos[prod.productoId].monto += prod.subtotal;
            });
          });

          const topProductos = Object.entries(productosVendidos)
            .map(([id, data]) => ({
              productoNombre: data.nombre,
              cantidad: data.cantidad,
              monto: data.monto,
            }))
            .sort((a, b) => b.monto - a.monto)
            .slice(0, 10);

          // Top clientes
          const clientesData: Record<
            string,
            { nombre: string; totalCompras: number; monto: number }
          > = {};
          ventas.forEach((venta) => {
            if (!clientesData[venta.clienteId]) {
              clientesData[venta.clienteId] = {
                nombre: venta.clienteNombre,
                totalCompras: 0,
                monto: 0,
              };
            }
            clientesData[venta.clienteId].totalCompras += 1;
            clientesData[venta.clienteId].monto += venta.total;
          });

          const topClientes = Object.entries(clientesData)
            .map(([id, data]) => ({
              clienteNombre: data.nombre,
              totalCompras: data.totalCompras,
              monto: data.monto,
            }))
            .sort((a, b) => b.monto - a.monto)
            .slice(0, 10);

          const metricasVentas: MetricaVentas = {
            totalVentas,
            montoTotalVendido,
            ventasCompletas,
            ventasParciales,
            ventasPendientes,
            promedioVenta,
            topProductos,
            topClientes,
          };

          // Métricas de almacén
          const productos = almacenStore.productos;
          const movimientos = almacenStore.movimientos;

          const metricasAlmacen: MetricaAlmacen = {
            totalProductos: productos.length,
            stockTotal: productos.reduce((sum, p) => sum + p.stockActual, 0),
            productosbajoStock: productos.filter((p) => p.stockActual < 10).length,
            totalEntradas: movimientos
              .filter((m) => m.tipo === 'entrada')
              .reduce((sum, m) => sum + m.cantidad, 0),
            totalSalidas: movimientos
              .filter((m) => m.tipo === 'salida')
              .reduce((sum, m) => sum + m.cantidad, 0),
            valorInventario: productos.reduce((sum, p) => sum + p.stockActual * p.precioCompra, 0),
          };

          // Adeudos
          const adeudosClientes = ventasStore.clientes.reduce(
            (sum, c) => sum + c.adeudoPendiente,
            0
          );
          const adeudosDistribuidores = ordenesStore.distribuidores.reduce(
            (sum, d) => sum + d.adeudoPendiente,
            0
          );

          // Flujo de efectivo neto
          const flujoEfectivoNeto = totalCapital - adeudosDistribuidores;

          // Salud financiera (0-100)
          const factorCapital = Math.min((totalCapital / 100000) * 40, 40); // Max 40 puntos
          const factorAdeudosClientes = Math.max(20 - (adeudosClientes / 10000) * 10, 0); // Max 20 puntos
          const factorAdeudosDistribuidores = Math.max(
            20 - (adeudosDistribuidores / 10000) * 10,
            0
          ); // Max 20 puntos
          const factorVentas = Math.min((montoTotalVendido / 50000) * 20, 20); // Max 20 puntos

          const saludFinanciera = Math.round(
            factorCapital + factorAdeudosClientes + factorAdeudosDistribuidores + factorVentas
          );

          const dashboardData: DashboardData = {
            bancos: metricasBancos,
            ventas: metricasVentas,
            almacen: metricasAlmacen,
            adeudosClientes,
            adeudosDistribuidores,
            flujoEfectivoNeto,
            saludFinanciera,
          };

          set({ dashboardData });
        } catch (error: any) {
          set({ error: error.message });
          console.error('Error calculating dashboard data:', error);
        }
      },

      // AI Analysis - Ventas
      runAIAnalysisVentas: async (period = 'mes') => {
        set({ loadingAI: true });
        try {
          const ventasStore = useVentasStore.getState();
          const analysis = await GenkitAIService.analyzeVentas({
            type: 'ventas',
            data: ventasStore.ventas,
            period,
          });
          set({ aiAnalysisVentas: analysis, loadingAI: false });
        } catch (error: any) {
          set({ error: error.message, loadingAI: false });
          console.error('Error AI analysis ventas:', error);
        }
      },

      // AI Analysis - Bancos
      runAIAnalysisBancos: async () => {
        set({ loadingAI: true });
        try {
          const bancosStore = useBancosStore.getState();
          const analysis = await GenkitAIService.analyzeBancos({
            type: 'bancos',
            data: bancosStore.bancos,
          });
          set({ aiAnalysisBancos: analysis, loadingAI: false });
        } catch (error: any) {
          set({ error: error.message, loadingAI: false });
          console.error('Error AI analysis bancos:', error);
        }
      },

      // AI Analysis - Inventario
      runAIAnalysisInventario: async () => {
        set({ loadingAI: true });
        try {
          const almacenStore = useAlmacenStore.getState();
          const analysis = await GenkitAIService.analyzeInventario(almacenStore.productos);
          set({ aiAnalysisInventario: analysis, loadingAI: false });
        } catch (error: any) {
          set({ error: error.message, loadingAI: false });
          console.error('Error AI analysis inventario:', error);
        }
      },

      // AI Dashboard Ejecutivo
      runAIDashboardExecutivo: async () => {
        set({ loadingAI: true });
        try {
          const dashboardData = get().dashboardData;
          const analysis = await GenkitAIService.getDashboardExecutivo(dashboardData);
          set({ aiDashboardExecutivo: analysis, loadingAI: false });
        } catch (error: any) {
          set({ error: error.message, loadingAI: false });
          console.error('Error AI dashboard ejecutivo:', error);
        }
      },

      // Ejecutar todos los análisis AI
      runAllAIAnalysis: async () => {
        await Promise.all([
          get().runAIAnalysisVentas(),
          get().runAIAnalysisBancos(),
          get().runAIAnalysisInventario(),
          get().runAIDashboardExecutivo(),
        ]);
      },

      // Selectors
      getSaludFinanciera: () => {
        return get().dashboardData?.saludFinanciera || 0;
      },

      getFlujoCajaNeto: () => {
        return get().dashboardData?.flujoEfectivoNeto || 0;
      },

      getROI: () => {
        const data = get().dashboardData;
        if (!data) return 0;

        const totalCapital = data.bancos.reduce((sum, b) => sum + b.capital, 0);
        const totalGastos = data.bancos.reduce((sum, b) => sum + b.totalGastos, 0);
        const totalVendido = data.ventas.montoTotalVendido;

        if (totalGastos === 0) return 0;

        return ((totalVendido - totalGastos) / totalGastos) * 100;
      },

      getMargenUtilidad: () => {
        const data = get().dashboardData;
        if (!data || data.ventas.montoTotalVendido === 0) return 0;

        const bancoUtilidades = data.bancos.find((b) => b.bancoNombre === 'Utilidades');
        if (!bancoUtilidades) return 0;

        return (bancoUtilidades.capitalHistorico / data.ventas.montoTotalVendido) * 100;
      },

      // Reset
      reset: () => {
        set({
          dashboardData: null,
          aiAnalysisVentas: null,
          aiAnalysisBancos: null,
          aiAnalysisInventario: null,
          aiDashboardExecutivo: null,
          loading: false,
          loadingAI: false,
          error: null,
        });
      },
    }),
    { name: 'DashboardStore' }
  )
);
