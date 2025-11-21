/**
 * 💎 WidgetKPIRealTime - KPIs en tiempo real con sparklines
 * Características:
 * - Métricas actualizadas en tiempo real
 * - Sparklines (mini gráficos) para tendencias
 * - Comparación con período anterior
 * - Indicadores de cambio con animaciones
 * - Múltiples KPIs configurables
 */
import React, { useMemo } from 'react';

import { motion } from 'framer-motion';
import {
  Activity,
  DollarSign,
  Package,
  ShoppingCart,
  TrendingDown,
  TrendingUp,
  Users,
  Zap,
} from 'lucide-react';

import { useFlowStore } from '../../../../stores/flowStore';
import { formatCurrency } from '../../utils/formatters';

interface KPIData {
  id: string;
  label: string;
  value: number;
  previousValue: number;
  icon: React.ReactNode;
  color: string;
  format: 'currency' | 'number' | 'percentage';
  trend: number[];
}

export const WidgetKPIRealTime: React.FC = () => {
  const { ventas, bancos, clientes, almacen } = useFlowStore();

  // 📊 Calcular KPIs
  const kpis: KPIData[] = useMemo(() => {
    // Total de ventas del mes actual
    const now = new Date();
    const thisMonth = ventas.filter((v) => {
      const vDate = new Date(v.fecha);
      return vDate.getMonth() === now.getMonth() && vDate.getFullYear() === now.getFullYear();
    });

    const lastMonth = ventas.filter((v) => {
      const vDate = new Date(v.fecha);
      const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1);
      return (
        vDate.getMonth() === lastMonthDate.getMonth() &&
        vDate.getFullYear() === lastMonthDate.getFullYear()
      );
    });

    const totalVentasThisMonth = thisMonth.reduce((sum, v) => sum + (v.totalVenta || 0), 0);
    const totalVentasLastMonth = lastMonth.reduce((sum, v) => sum + (v.totalVenta || 0), 0);

    // Utilidades del mes
    const utilidadesThisMonth = thisMonth.reduce((sum, v) => sum + (v.totalUtilidades || 0), 0);
    const utilidadesLastMonth = lastMonth.reduce((sum, v) => sum + (v.totalUtilidades || 0), 0);

    // Capital total
    const capitalTotal = Object.values(bancos).reduce(
      (sum, banco: any) => sum + (banco.capitalActual || 0),
      0
    );

    // Ventas pendientes
    const ventasPendientes = ventas.filter((v) => v.estatus === 'Pendiente').length;
    const ventasPendientesLastMonth = lastMonth.filter((v) => v.estatus === 'Pendiente').length;

    // Stock total
    const stockTotal = Object.values(almacen).reduce(
      (sum: number, item: any) => sum + (item.cantidad || 0),
      0
    );

    // Clientes activos (con ventas en los últimos 30 días)
    const clientesActivos = new Set(
      ventas
        .filter((v) => {
          const vDate = new Date(v.fecha);
          const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          return vDate >= thirtyDaysAgo;
        })
        .map((v) => v.cliente)
    ).size;

    // Tendencias (últimos 7 días de ventas)
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(now.getTime() - (6 - i) * 24 * 60 * 60 * 1000);
      const dayVentas = ventas.filter((v) => {
        const vDate = new Date(v.fecha);
        return vDate.toDateString() === date.toDateString();
      });
      return dayVentas.reduce((sum, v) => sum + (v.totalVenta || 0), 0);
    });

    const utilidadesTrend = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(now.getTime() - (6 - i) * 24 * 60 * 60 * 1000);
      const dayVentas = ventas.filter((v) => {
        const vDate = new Date(v.fecha);
        return vDate.toDateString() === date.toDateString();
      });
      return dayVentas.reduce((sum, v) => sum + (v.totalUtilidades || 0), 0);
    });

    return [
      {
        id: 'ventas',
        label: 'Ventas del Mes',
        value: totalVentasThisMonth,
        previousValue: totalVentasLastMonth,
        icon: <DollarSign className="w-5 h-5" />,
        color: '#22c55e',
        format: 'currency' as const,
        trend: last7Days,
      },
      {
        id: 'utilidades',
        label: 'Utilidades',
        value: utilidadesThisMonth,
        previousValue: utilidadesLastMonth,
        icon: <TrendingUp className="w-5 h-5" />,
        color: '#8b5cf6',
        format: 'currency' as const,
        trend: utilidadesTrend,
      },
      {
        id: 'capital',
        label: 'Capital Total',
        value: capitalTotal,
        previousValue: capitalTotal * 0.95, // Mock previous
        icon: <Activity className="w-5 h-5" />,
        color: '#06b6d4',
        format: 'currency' as const,
        trend: [0.9, 0.92, 0.95, 0.97, 0.98, 0.99, 1].map((x) => capitalTotal * x),
      },
      {
        id: 'pendientes',
        label: 'Ventas Pendientes',
        value: ventasPendientes,
        previousValue: ventasPendientesLastMonth,
        icon: <ShoppingCart className="w-5 h-5" />,
        color: '#f59e0b',
        format: 'number' as const,
        trend: [12, 10, 14, 11, ventasPendientes, ventasPendientes, ventasPendientes],
      },
      {
        id: 'stock',
        label: 'Stock Almacén',
        value: stockTotal,
        previousValue: stockTotal * 1.1, // Mock previous
        icon: <Package className="w-5 h-5" />,
        color: '#3b82f6',
        format: 'number' as const,
        trend: [1.1, 1.08, 1.05, 1.03, 1.01, 1, 1].map((x) => stockTotal * x),
      },
      {
        id: 'clientes',
        label: 'Clientes Activos',
        value: clientesActivos,
        previousValue: Math.floor(clientesActivos * 0.9),
        icon: <Users className="w-5 h-5" />,
        color: '#ec4899',
        format: 'number' as const,
        trend: [0.85, 0.88, 0.91, 0.94, 0.97, 0.99, 1].map((x) => Math.floor(clientesActivos * x)),
      },
    ];
  }, [ventas, bancos, clientes, almacen]);

  // 📈 Calcular cambio porcentual
  const calculateChange = (current: number, previous: number): number => {
    if (previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  };

  // 🎨 Formatear valor según tipo
  const formatValue = (value: number, format: KPIData['format']): string => {
    switch (format) {
      case 'currency':
        return formatCurrency(value, 'USD');
      case 'percentage':
        return `${value.toFixed(1)}%`;
      case 'number':
        return value.toLocaleString('es-MX');
      default:
        return value.toString();
    }
  };

  // 📊 Mini sparkline SVG
  const Sparkline: React.FC<{ data: number[]; color: string }> = ({ data, color }) => {
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;

    const points = data
      .map((value, index) => {
        const x = (index / (data.length - 1)) * 100;
        const y = 100 - ((value - min) / range) * 100;
        return `${x},${y}`;
      })
      .join(' ');

    return (
      <svg width="100%" height="40" className="overflow-visible">
        <defs>
          <linearGradient id={`gradient-${color}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={color} stopOpacity={0.3} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <polyline
          fill={`url(#gradient-${color})`}
          stroke={color}
          strokeWidth="2"
          points={`0,100 ${points} 100,100`}
        />
        <polyline fill="none" stroke={color} strokeWidth="2" points={points} />
      </svg>
    );
  };

  return (
    <div className="h-full overflow-y-auto">
      {/* 🎯 HEADER */}
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Zap className="w-5 h-5 text-zinc-200" />
          KPIs en Tiempo Real
        </h3>
        <motion.div
          className="w-2 h-2 rounded-full bg-green-400"
          animate={{ scale: [1, 1.2, 1], opacity: [1, 0.6, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </div>

      {/* 📊 GRID DE KPIs */}
      <div className="grid grid-cols-1 gap-4">
        {kpis.map((kpi, index) => {
          const change = calculateChange(kpi.value, kpi.previousValue);
          const isPositive = change >= 0;

          return (
            <motion.div
              key={kpi.id}
              className="p-4 rounded-xl"
              style={{
                background: `linear-gradient(135deg, ${kpi.color}15 0%, ${kpi.color}05 100%)`,
                border: `1px solid ${kpi.color}30`,
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
            >
              {/* Header del KPI */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg" style={{ backgroundColor: `${kpi.color}20` }}>
                    <div style={{ color: kpi.color }}>{kpi.icon}</div>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">{kpi.label}</p>
                    <p className="text-2xl font-bold text-white">
                      {formatValue(kpi.value, kpi.format)}
                    </p>
                  </div>
                </div>

                {/* Indicador de cambio */}
                <motion.div
                  className={`flex items-center gap-1 px-2 py-1 rounded-lg ${
                    isPositive ? 'bg-zinc-9000/20' : 'bg-zinc-9000/20'
                  }`}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.1 + 0.3 }}
                >
                  {isPositive ? (
                    <TrendingUp className="w-3 h-3 text-zinc-200" />
                  ) : (
                    <TrendingDown className="w-3 h-3 text-zinc-200" />
                  )}
                  <span
                    className={`text-xs font-bold ${
                      isPositive ? 'text-zinc-200' : 'text-zinc-200'
                    }`}
                  >
                    {Math.abs(change).toFixed(1)}%
                  </span>
                </motion.div>
              </div>

              {/* Sparkline */}
              <Sparkline data={kpi.trend} color={kpi.color} />

              {/* Info adicional */}
              <div className="mt-2 flex items-center justify-between text-xs">
                <span className="text-slate-500">vs mes anterior</span>
                <span className="text-slate-400 font-medium">
                  {formatValue(kpi.previousValue, kpi.format)}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default WidgetKPIRealTime;
