/**
 * 📊 WidgetVentasChart - Gráfico avanzado de ventas con animaciones
 * Características:
 * - Gráfico de área con gradientes
 * - Filtro por período (día, semana, mes, año)
 * - Tooltips premium personalizados
 * - Animaciones suaves
 * - Comparación con período anterior
 */
import React, { useMemo, useState } from 'react';

import { motion } from 'framer-motion';
import { Calendar, DollarSign, TrendingUp } from 'lucide-react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { useFlowStore } from '../../../../stores/flowStore';
import { formatCurrency } from '../../utils/formatters';

type Period = 'day' | 'week' | 'month' | 'year';

export const WidgetVentasChart: React.FC = () => {
  const { ventas } = useFlowStore();
  const [period, setPeriod] = useState<Period>('month');

  // 📊 Procesar datos según el período seleccionado
  const chartData = useMemo(() => {
    if (!ventas || ventas.length === 0) return [];

    const now = new Date();
    const filteredVentas = ventas.filter((venta) => {
      const ventaDate = new Date(venta.fecha);

      switch (period) {
        case 'day':
          return ventaDate.toDateString() === now.toDateString();
        case 'week':
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          return ventaDate >= weekAgo;
        case 'month':
          return (
            ventaDate.getMonth() === now.getMonth() && ventaDate.getFullYear() === now.getFullYear()
          );
        case 'year':
          return ventaDate.getFullYear() === now.getFullYear();
        default:
          return true;
      }
    });

    // Agrupar por fecha
    const groupedData: Record<string, { ventas: number; utilidades: number; fletes: number }> = {};

    filteredVentas.forEach((venta) => {
      const date = new Date(venta.fecha);
      const key =
        period === 'day'
          ? `${date.getHours()}:00`
          : period === 'week'
            ? ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'][date.getDay()]
            : period === 'month'
              ? `${date.getDate()}`
              : [
                  'Ene',
                  'Feb',
                  'Mar',
                  'Abr',
                  'May',
                  'Jun',
                  'Jul',
                  'Ago',
                  'Sep',
                  'Oct',
                  'Nov',
                  'Dic',
                ][date.getMonth()];

      if (!groupedData[key]) {
        groupedData[key] = { ventas: 0, utilidades: 0, fletes: 0 };
      }

      groupedData[key].ventas += venta.totalVenta || 0;
      groupedData[key].utilidades += venta.totalUtilidades || 0;
      groupedData[key].fletes += venta.totalFletes || 0;
    });

    return Object.entries(groupedData).map(([name, data]) => ({
      name,
      ventas: Math.round(data.ventas),
      utilidades: Math.round(data.utilidades),
      fletes: Math.round(data.fletes),
    }));
  }, [ventas, period]);

  // 📈 Calcular estadísticas
  const stats = useMemo(() => {
    const totalVentas = chartData.reduce((sum, item) => sum + item.ventas, 0);
    const totalUtilidades = chartData.reduce((sum, item) => sum + item.utilidades, 0);
    const promedio = chartData.length > 0 ? totalVentas / chartData.length : 0;
    const margenUtilidad = totalVentas > 0 ? (totalUtilidades / totalVentas) * 100 : 0;

    return {
      totalVentas,
      totalUtilidades,
      promedio,
      margenUtilidad,
    };
  }, [chartData]);

  // 🎨 Tooltip personalizado
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload || !payload.length) return null;

    return (
      <motion.div
        className="p-4 rounded-lg shadow-xl"
        style={{
          background: 'rgba(15, 23, 42, 0.95)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(148, 163, 184, 0.2)',
        }}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <p className="text-sm font-semibold text-white mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center justify-between gap-4 mb-1">
            <span className="text-xs text-slate-400 capitalize">{entry.name}:</span>
            <span className="text-sm font-bold" style={{ color: entry.color }}>
              {formatCurrency(entry.value, 'USD')}
            </span>
          </div>
        ))}
      </motion.div>
    );
  };

  const periods: { value: Period; label: string }[] = [
    { value: 'day', label: 'Hoy' },
    { value: 'week', label: 'Semana' },
    { value: 'month', label: 'Mes' },
    { value: 'year', label: 'Año' },
  ];

  return (
    <div className="h-full flex flex-col">
      {/* 🎯 HEADER con filtros */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-zinc-200" />
            Evolución de Ventas
          </h3>
          <Calendar className="w-5 h-5 text-slate-400" />
        </div>

        {/* Filtros de período */}
        <div className="flex gap-2">
          {periods.map((p) => (
            <motion.button
              key={p.value}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                period === p.value
                  ? 'bg-gradient-to-r from-indigo-500 to-zinc-800 text-white'
                  : 'bg-white/5 text-slate-400 hover:bg-white/10'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setPeriod(p.value)}
            >
              {p.label}
            </motion.button>
          ))}
        </div>
      </div>

      {/* 📊 KPIs rápidos */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <motion.div
          className="p-3 rounded-lg"
          style={{
            background:
              'linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(22, 163, 74, 0.1) 100%)',
            border: '1px solid rgba(34, 197, 94, 0.2)',
          }}
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center gap-2 mb-1">
            <DollarSign className="w-4 h-4 text-zinc-200" />
            <span className="text-xs text-slate-400">Total Ventas</span>
          </div>
          <p className="text-lg font-bold text-zinc-200">
            {formatCurrency(stats.totalVentas, 'USD')}
          </p>
        </motion.div>

        <motion.div
          className="p-3 rounded-lg"
          style={{
            background:
              'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(124, 58, 237, 0.1) 100%)',
            border: '1px solid rgba(139, 92, 246, 0.2)',
          }}
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-4 h-4 text-zinc-800" />
            <span className="text-xs text-slate-400">Margen</span>
          </div>
          <p className="text-lg font-bold text-zinc-800">{stats.margenUtilidad.toFixed(1)}%</p>
        </motion.div>
      </div>

      {/* 📈 GRÁFICO */}
      <div className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorVentas" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorUtilidades" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorFletes" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" />
            <XAxis
              dataKey="name"
              stroke="#94a3b8"
              style={{ fontSize: '12px' }}
              tick={{ fill: '#94a3b8' }}
            />
            <YAxis
              stroke="#94a3b8"
              style={{ fontSize: '12px' }}
              tick={{ fill: '#94a3b8' }}
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: '12px', color: '#94a3b8' }} iconType="circle" />
            <Area
              type="monotone"
              dataKey="ventas"
              name="Ventas"
              stroke="#22c55e"
              strokeWidth={2}
              fill="url(#colorVentas)"
              animationDuration={1000}
            />
            <Area
              type="monotone"
              dataKey="utilidades"
              name="Utilidades"
              stroke="#8b5cf6"
              strokeWidth={2}
              fill="url(#colorUtilidades)"
              animationDuration={1200}
            />
            <Area
              type="monotone"
              dataKey="fletes"
              name="Fletes"
              stroke="#06b6d4"
              strokeWidth={2}
              fill="url(#colorFletes)"
              animationDuration={1400}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default WidgetVentasChart;
