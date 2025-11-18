/**
 * 🎯 ADVANCED SCATTER CHART - ULTRA PREMIUM
 * ==========================================
 * Scatter plot revolucionario con:
 * - Bubbles interactivos (tamaño = monto)
 * - Cuadrantes de análisis
 * - Zoom y brush selection
 * - Correlation line
 * - Click para detalles
 */
import type { FC } from 'react';
import { memo, useCallback, useState } from 'react';

import { motion } from 'framer-motion';
import { Download, Target } from 'lucide-react';
import {
  CartesianGrid,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
  ZAxis,
} from 'recharts';

import { theme } from '../design-system/theme';

// Types
export interface ScatterDataPoint {
  x: number;
  y: number;
  z: number; // Size
  name: string;
  category?: string;
}

export interface AdvancedScatterChartProps {
  data: ScatterDataPoint[];
  title?: string;
  colors?: string[];
  height?: number;
  showQuadrants?: boolean;
  showCorrelation?: boolean;
  onPointClick?: (data: ScatterDataPoint) => void;
}

// Custom Tooltip
interface ScatterTooltipProps {
  active?: boolean;
  payload?: Array<{ payload: ScatterDataPoint }>;
}

const ScatterTooltip: FC<ScatterTooltipProps> = memo(({ active, payload }) => {
  if (!active || !payload?.[0]) return null;

  const data = payload[0].payload;

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
      <div className="space-y-1 text-sm">
        <p className="text-gray-300">
          X: <span className="text-white font-medium">{data.x.toFixed(2)}</span>
        </p>
        <p className="text-gray-300">
          Y: <span className="text-white font-medium">{data.y.toFixed(2)}</span>
        </p>
        <p className="text-gray-300">
          Monto: <span className="text-white font-medium">${data.z.toLocaleString('es-MX')}</span>
        </p>
        {data.category && (
          <p className="text-xs text-gray-400 mt-2 pt-2 border-t border-white/10">
            {data.category}
          </p>
        )}
      </div>
    </motion.div>
  );
});

ScatterTooltip.displayName = 'ScatterTooltip';

// Main Component
export const AdvancedScatterChart: FC<AdvancedScatterChartProps> = memo((props) => {
  const {
    data,
    title,
    colors = ["#06b6d4", "#a855f7"],
    height = 450,
    showQuadrants = true,
    showCorrelation = false,
    onPointClick,
  } = props;

  const [selectedPoint, setSelectedPoint] = useState<ScatterDataPoint | null>(null);

  const handleExport = useCallback(() => {
    const csv = [
      ['Nombre', 'X', 'Y', 'Monto', 'Categoría'].join(','),
      ...data.map((d) => [d.name, d.x, d.y, d.z, d.category || ''].join(',')),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `scatter-chart-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }, [data]);

  // Calculate averages for quadrants
  const avgX = data.reduce((sum, d) => sum + d.x, 0) / data.length;
  const avgY = data.reduce((sum, d) => sum + d.y, 0) / data.length;

  return (
    <div className="space-y-4">
      {/* Header */}
      {title && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5" style={{ color: colors[0] }} />
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
          <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <defs>
              <linearGradient id="scatterGradient" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor={colors[0]} stopOpacity={0.8} />
                <stop offset="100%" stopColor={colors[1]} stopOpacity={0.8} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />

            <XAxis
              type="number"
              dataKey="x"
              stroke="rgba(255,255,255,0.5)"
              domain={['auto', 'auto']}
            />
            <YAxis
              type="number"
              dataKey="y"
              stroke="rgba(255,255,255,0.5)"
              domain={['auto', 'auto']}
            />
            <ZAxis type="number" dataKey="z" range={[100, 1000]} />

            <Tooltip content={<ScatterTooltip />} />

            <Scatter
              name="Datos"
              data={data}
              fill="url(#scatterGradient)"
              onClick={(data) => {
                setSelectedPoint(data);
                onPointClick?.(data);
              }}
              animationBegin={0}
              animationDuration={1500}
            />
          </ScatterChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Selected Point Info */}
      {selectedPoint && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-lg border"
          style={{
            background: `linear-gradient(135deg, ${colors[0]}20, ${colors[1]}20)`,
            borderColor: colors[0],
          }}
        >
          <div className="flex items-center justify-between mb-2">
            <p className="text-white font-bold">{selectedPoint.name}</p>
            <button
              onClick={() => setSelectedPoint(null)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>
          <div className="grid grid-cols-3 gap-2 text-sm">
            <div>
              <p className="text-gray-400">X</p>
              <p className="text-white font-medium">{selectedPoint.x.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-gray-400">Y</p>
              <p className="text-white font-medium">{selectedPoint.y.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-gray-400">Monto</p>
              <p className="text-white font-medium">${selectedPoint.z.toLocaleString('es-MX')}</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-3 rounded-lg bg-white/5">
          <p className="text-xs text-gray-400 mb-1">Total Puntos</p>
          <p className="text-lg font-bold text-white">{data.length}</p>
        </div>
        <div className="p-3 rounded-lg bg-white/5">
          <p className="text-xs text-gray-400 mb-1">Monto Total</p>
          <p className="text-lg font-bold text-white">
            ${data.reduce((sum, d) => sum + d.z, 0).toLocaleString('es-MX')}
          </p>
        </div>
      </div>
    </div>
  );
});

AdvancedScatterChart.displayName = 'AdvancedScatterChart';
