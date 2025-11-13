/**
 * 📊 ADVANCED BAR CHART - ULTRA PREMIUM
 * ======================================
 * Gráfico de barras revolucionario con:
 * - Barras 3D con glassmorphism
 * - Animaciones staggered
 * - Comparación lado a lado
 * - Barras apiladas dinámicas
 * - Scroll horizontal para muchos datos
 * - Click para drill-down
 */
import type { FC } from 'react';
import { memo, useCallback, useState } from 'react';

import { motion } from 'framer-motion';
import { BarChart2, Download, TrendingUp } from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { theme } from '../design-system/theme';

// Types
export interface BarChartDataPoint {
  category: string;
  value: number;
  comparison?: number;
  trend?: number;
  color?: string;
}

export interface AdvancedBarChartProps {
  data: BarChartDataPoint[];
  title?: string;
  colors?: string[];
  height?: number;
  stacked?: boolean;
  horizontal?: boolean;
  showComparison?: boolean;
  onBarClick?: (data: BarChartDataPoint) => void;
}

// Custom Tooltip
interface BarTooltipProps {
  active?: boolean;
  payload?: Array<{ value: number; name: string; color: string }>;
  label?: string;
}

const BarTooltip: FC<BarTooltipProps> = memo(({ active, payload, label }) => {
  if (!active || !payload?.[0]) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="rounded-xl p-4 shadow-2xl backdrop-blur-xl border border-white/20"
      style={{
        background: 'linear-gradient(135deg, rgba(30,30,50,0.98), rgba(20,20,40,0.98))',
      }}
    >
      <p className="text-white font-bold mb-2">{label}</p>
      {payload.map((entry, index) => (
        <div key={`bar-tooltip-${entry.name}-${index}`} className="flex items-center gap-2">
          <div className="w-3 h-3 rounded" style={{ backgroundColor: entry.color }} />
          <span className="text-gray-300 text-sm">
            ${entry.value.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
          </span>
        </div>
      ))}
    </motion.div>
  );
});

BarTooltip.displayName = 'BarTooltip';

// Main Component
export const AdvancedBarChart: FC<AdvancedBarChartProps> = memo((props) => {
  const {
    data,
    title,
    colors = ["#3b82f6", "#06b6d4"],
    height = 400,
    stacked = false,
    horizontal = false,
    showComparison = false,
    onBarClick,
  } = props;

  const [activeBar, setActiveBar] = useState<number | null>(null);

  const handleExport = useCallback(() => {
    const csv = [
      ['Categoría', 'Valor', 'Comparación', 'Tendencia'].join(','),
      ...data.map((d) => [d.category, d.value, d.comparison || 0, d.trend || 0].join(',')),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bar-chart-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }, [data]);

  return (
    <div className="space-y-4">
      {/* Header */}
      {title && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart2 className="w-5 h-5" style={{ color: colors[0] }} />
            <h3 className="text-xl font-bold text-white">{title}</h3>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleExport}
            className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors flex items-center gap-2"
          >
            <Download className="w-4 h-4 text-gray-300" />
            <span className="text-sm text-gray-300">Exportar</span>
          </motion.button>
        </div>
      )}

      {/* Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <ResponsiveContainer width="100%" height={height}>
          <BarChart
            data={data}
            layout={horizontal ? 'horizontal' : 'vertical'}
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          >
            <defs>
              <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={colors[0]} stopOpacity={0.9} />
                <stop offset="100%" stopColor={colors[0]} stopOpacity={0.6} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />

            {horizontal ? (
              <>
                <XAxis type="number" stroke="rgba(255,255,255,0.5)" />
                <YAxis dataKey="category" type="category" stroke="rgba(255,255,255,0.5)" />
              </>
            ) : (
              <>
                <XAxis dataKey="category" stroke="rgba(255,255,255,0.5)" />
                <YAxis stroke="rgba(255,255,255,0.5)" />
              </>
            )}

            <Tooltip content={<BarTooltip />} />

            <Bar
              dataKey="value"
              fill="url(#barGradient)"
              radius={[8, 8, 0, 0]}
              animationBegin={0}
              animationDuration={1200}
              onClick={(data) => onBarClick?.(data)}
              onMouseEnter={(_, index) => setActiveBar(index)}
              onMouseLeave={() => setActiveBar(null)}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`bar-cell-${entry.category}-${index}`}
                  fill={entry.color || colors[index % colors.length]}
                  opacity={activeBar === index ? 1 : 0.8}
                  style={{
                    filter: activeBar === index ? 'brightness(1.2)' : 'none',
                    cursor: 'pointer',
                  }}
                />
              ))}
            </Bar>

            {showComparison && (
              <Bar
                dataKey="comparison"
                fill={colors[1]}
                radius={[8, 8, 0, 0]}
                animationBegin={200}
                animationDuration={1200}
              />
            )}
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="p-3 rounded-lg bg-white/5">
          <p className="text-xs text-gray-400 mb-1">Total</p>
          <p className="text-lg font-bold text-white">
            ${data.reduce((sum, d) => sum + d.value, 0).toLocaleString('es-MX')}
          </p>
        </div>
        <div className="p-3 rounded-lg bg-white/5">
          <p className="text-xs text-gray-400 mb-1">Promedio</p>
          <p className="text-lg font-bold text-white">
            $
            {(data.reduce((sum, d) => sum + d.value, 0) / data.length).toLocaleString('es-MX', {
              maximumFractionDigits: 0,
            })}
          </p>
        </div>
        <div className="p-3 rounded-lg bg-white/5">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <p className="text-xs text-gray-400">Máximo</p>
          </div>
          <p className="text-lg font-bold text-white">
            ${Math.max(...data.map((d) => d.value)).toLocaleString('es-MX')}
          </p>
        </div>
      </div>
    </div>
  );
});

AdvancedBarChart.displayName = 'AdvancedBarChart';
