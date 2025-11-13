/**
 * 🎨 ADVANCED PIE CHART - ULTRA PREMIUM
 * ======================================
 * Pie chart revolucionario con:
 * - Efecto 3D con sombras
 * - Animación de explosión al hover
 * - Labels interactivos
 * - Donut mode opcional
 * - Legends dinámicos
 */
import type { FC } from 'react';
import { memo, useCallback, useState } from 'react';

import { motion } from 'framer-motion';
import { Download, PieChart as PieIcon } from 'lucide-react';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

import { theme } from '../design-system/theme';

// Types
export interface PieChartDataPoint {
  name: string;
  value: number;
  color?: string;
}

export interface AdvancedPieChartProps {
  data: PieChartDataPoint[];
  title?: string;
  colors?: string[];
  height?: number;
  donut?: boolean;
  innerRadius?: number;
  outerRadius?: number;
  onSliceClick?: (data: PieChartDataPoint) => void;
}

// Custom Tooltip
interface PieTooltipProps {
  active?: boolean;
  payload?: Array<{ name: string; value: number; payload: PieChartDataPoint }>;
}

const PieTooltip: FC<PieTooltipProps> = memo(({ active, payload }) => {
  if (!active || !payload?.[0]) return null;

  const data = payload[0];
  const total = payload.reduce((sum, entry) => sum + entry.value, 0);
  const percentage = ((data.value / total) * 100).toFixed(1);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="rounded-xl p-4 shadow-2xl backdrop-blur-xl border border-white/20"
      style={{
        background: 'linear-gradient(135deg, rgba(30,30,50,0.98), rgba(20,20,40,0.98))',
      }}
    >
      <p className="text-white font-bold mb-2">{data.name}</p>
      <p className="text-2xl font-bold text-white mb-1">${data.value.toLocaleString('es-MX')}</p>
      <p className="text-sm text-gray-400">{percentage}% del total</p>
    </motion.div>
  );
});

PieTooltip.displayName = 'PieTooltip';

// Custom Label
const renderCustomLabel = (entry: {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  percent: number;
  name: string;
}) => {
  const RADIAN = Math.PI / 180;
  const radius = entry.innerRadius + (entry.outerRadius - entry.innerRadius) * 0.5;
  const x = entry.cx + radius * Math.cos(-entry.midAngle * RADIAN);
  const y = entry.cy + radius * Math.sin(-entry.midAngle * RADIAN);

  if (entry.percent < 0.05) return null; // Hide labels for small slices

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > entry.cx ? 'start' : 'end'}
      dominantBaseline="central"
      className="text-sm font-medium"
    >
      {`${(entry.percent * 100).toFixed(0)}%`}
    </text>
  );
};

// Main Component
export const AdvancedPieChart: FC<AdvancedPieChartProps> = memo((props) => {
  const {
    data,
    title,
    colors = [
      "#3b82f6",
      "#06b6d4",
      "#a855f7",
      "#ec4899",
      "#10b981",
      "#f59e0b",
    ],
    height = 400,
    donut = false,
    innerRadius = 0,
    outerRadius = 140,
    onSliceClick,
  } = props;

  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const handleExport = useCallback(() => {
    const total = data.reduce((sum, d) => sum + d.value, 0);
    const csv = [
      ['Nombre', 'Valor', 'Porcentaje'].join(','),
      ...data.map((d) => [d.name, d.value, ((d.value / total) * 100).toFixed(2)].join(',')),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pie-chart-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }, [data]);

  const total = data.reduce((sum, d) => sum + d.value, 0);

  return (
    <div className="space-y-4">
      {/* Header */}
      {title && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PieIcon className="w-5 h-5" style={{ color: colors[0] }} />
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
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        <ResponsiveContainer width="100%" height={height}>
          <PieChart>
            <defs>
              {colors.map((color, idx) => (
                <linearGradient
                  key={`pie-grad-${idx}`}
                  id={`pieGradient${idx}`}
                  x1="0"
                  y1="0"
                  x2="1"
                  y2="1"
                >
                  <stop offset="0%" stopColor={color} stopOpacity={0.9} />
                  <stop offset="100%" stopColor={color} stopOpacity={0.6} />
                </linearGradient>
              ))}
            </defs>

            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomLabel}
              outerRadius={outerRadius}
              innerRadius={donut ? innerRadius || outerRadius * 0.6 : 0}
              fill="#8884d8"
              dataKey="value"
              animationBegin={0}
              animationDuration={1500}
              onMouseEnter={(_, index) => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(null)}
              onClick={(data) => onSliceClick?.(data)}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`pie-cell-${entry.name}-${index}`}
                  fill={entry.color || `url(#pieGradient${index % colors.length})`}
                  stroke="rgba(255,255,255,0.2)"
                  strokeWidth={2}
                  style={{
                    filter:
                      activeIndex === index
                        ? 'brightness(1.2) drop-shadow(0 0 10px currentColor)'
                        : 'none',
                    cursor: 'pointer',
                    transformOrigin: 'center',
                    transform: activeIndex === index ? 'scale(1.05)' : 'scale(1)',
                    transition: 'all 0.3s ease',
                  }}
                />
              ))}
            </Pie>

            <Tooltip content={<PieTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Legend */}
      <div className="grid grid-cols-2 gap-2">
        {data.map((entry, index) => {
          const percentage = ((entry.value / total) * 100).toFixed(1);
          const isActive = activeIndex === index;

          return (
            <motion.button
              key={`legend-${entry.name}-${index}`}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.02 }}
              onMouseEnter={() => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(null)}
              className="p-3 rounded-lg transition-all text-left"
              style={{
                background: isActive ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.05)',
                border: `1px solid ${isActive ? entry.color || colors[index % colors.length] : 'transparent'}`,
              }}
            >
              <div className="flex items-center gap-2 mb-1">
                <div
                  className="w-3 h-3 rounded"
                  style={{
                    backgroundColor: entry.color || colors[index % colors.length],
                    boxShadow: isActive
                      ? `0 0 10px ${entry.color || colors[index % colors.length]}`
                      : 'none',
                  }}
                />
                <span className="text-sm text-white font-medium">{entry.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">{percentage}%</span>
                <span className="text-sm text-white font-bold">
                  ${entry.value.toLocaleString('es-MX', { notation: 'compact' })}
                </span>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Total */}
      {donut && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center p-4 rounded-lg bg-white/5"
        >
          <p className="text-sm text-gray-400 mb-1">Total</p>
          <p className="text-2xl font-bold text-white">${total.toLocaleString('es-MX')}</p>
        </motion.div>
      )}
    </div>
  );
});

AdvancedPieChart.displayName = 'AdvancedPieChart';
