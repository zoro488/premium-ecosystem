/**
 * 🥧 WidgetDistribucionBancos - Distribución de capital por bóveda
 * Características:
 * - Gráfico de pastel/donut animado
 * - Tooltips interactivos
 * - Leyenda con colores distintivos
 * - Transiciones suaves
 * - Porcentajes de distribución
 */
import React, { useMemo } from 'react';

import { motion } from 'framer-motion';
import { PieChart as PieChartIcon, TrendingUp, Wallet } from 'lucide-react';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

import { useFlowStore } from '../../../../stores/flowStore';
import { formatCurrency } from '../../utils/formatters';

export const WidgetDistribucionBancos: React.FC = () => {
  const { bancos } = useFlowStore();

  // 🎨 Colores distintivos para cada bóveda
  const COLORS = [
    '#6366f1', // indigo
    '#8b5cf6', // purple
    '#ec4899', // pink
    '#f59e0b', // amber
    '#10b981', // emerald
    '#06b6d4', // cyan
    '#3b82f6', // blue
    '#14b8a6', // teal
  ];

  // 📊 Preparar datos para el gráfico
  const chartData = useMemo(() => {
    if (!bancos || Object.keys(bancos).length === 0) return [];

    return Object.entries(bancos)
      .map(([key, banco]: [string, any], index) => ({
        name: formatBovedaName(key),
        value: banco.capitalActual || 0,
        key,
        color: COLORS[index % COLORS.length],
        percentage: 0, // Se calculará después
      }))
      .filter((item) => item.value > 0)
      .sort((a, b) => b.value - a.value); // Ordenar de mayor a menor
  }, [bancos]);

  // 📊 Calcular porcentajes
  const dataWithPercentages = useMemo(() => {
    const total = chartData.reduce((sum, item) => sum + item.value, 0);
    return chartData.map((item) => ({
      ...item,
      percentage: total > 0 ? (item.value / total) * 100 : 0,
    }));
  }, [chartData]);

  // 📈 Estadísticas generales
  const stats = useMemo(() => {
    const total = dataWithPercentages.reduce((sum, item) => sum + item.value, 0);
    const highest = dataWithPercentages[0]; // Ya está ordenado
    const lowest = dataWithPercentages[dataWithPercentages.length - 1];
    const average = dataWithPercentages.length > 0 ? total / dataWithPercentages.length : 0;

    return { total, highest, lowest, average };
  }, [dataWithPercentages]);

  // 🎨 Tooltip personalizado
  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload || !payload.length) return null;

    const data = payload[0].payload;

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
        <p className="text-sm font-semibold text-white mb-2">{data.name}</p>
        <div className="space-y-1">
          <div className="flex items-center justify-between gap-4">
            <span className="text-xs text-slate-400">Capital:</span>
            <span className="text-sm font-bold text-white">
              {formatCurrency(data.value, 'USD')}
            </span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-xs text-slate-400">Distribución:</span>
            <span className="text-sm font-bold" style={{ color: data.color }}>
              {data.percentage.toFixed(1)}%
            </span>
          </div>
        </div>
      </motion.div>
    );
  };

  // 🎨 Renderizar etiqueta personalizada en el gráfico
  const renderLabel = (entry: any) => {
    return `${entry.percentage.toFixed(0)}%`;
  };

  if (dataWithPercentages.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <Wallet className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <p className="text-slate-400">No hay datos de bóvedas disponibles</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* 🎯 HEADER */}
      <div className="mb-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-2">
          <PieChartIcon className="w-5 h-5 text-zinc-200" />
          Distribución de Capital
        </h3>

        {/* KPI Total */}
        <motion.div
          className="p-3 rounded-lg"
          style={{
            background:
              'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
            border: '1px solid rgba(99, 102, 241, 0.2)',
          }}
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400 mb-1">Capital Total</p>
              <p className="text-xl font-bold text-white">{formatCurrency(stats.total, 'USD')}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-zinc-200" />
          </div>
        </motion.div>
      </div>

      {/* 📊 GRÁFICO DE PASTEL */}
      <div className="flex-1 min-h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={dataWithPercentages}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderLabel}
              outerRadius={80}
              innerRadius={40}
              fill="#8884d8"
              dataKey="value"
              animationBegin={0}
              animationDuration={800}
            >
              {dataWithPercentages.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* 📋 LEYENDA PERSONALIZADA */}
      <div className="mt-4 space-y-2">
        {dataWithPercentages.map((item, index) => (
          <motion.div
            key={item.key}
            className="flex items-center justify-between p-2 rounded-lg hover:bg-white/5 transition-colors"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <div className="flex items-center gap-2 flex-1">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="text-sm text-slate-300">{item.name}</span>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-white">{formatCurrency(item.value, 'USD')}</p>
              <p className="text-xs text-slate-500">{item.percentage.toFixed(1)}%</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* 📊 ESTADÍSTICAS ADICIONALES */}
      <div className="mt-4 pt-4 border-t border-white/10 grid grid-cols-2 gap-3">
        <div>
          <p className="text-xs text-slate-500 mb-1">Mayor</p>
          <p className="text-sm font-bold text-zinc-200">{stats.highest?.name}</p>
          <p className="text-xs text-slate-400">
            {formatCurrency(stats.highest?.value || 0, 'USD')}
          </p>
        </div>
        <div>
          <p className="text-xs text-slate-500 mb-1">Promedio</p>
          <p className="text-sm font-bold text-zinc-300">{formatCurrency(stats.average, 'USD')}</p>
          <p className="text-xs text-slate-400">{dataWithPercentages.length} bóvedas</p>
        </div>
      </div>
    </div>
  );
};

export default WidgetDistribucionBancos;
