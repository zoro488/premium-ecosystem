/**
 * 📊 ADVANCED INTERACTIVE CHARTS - ULTRA PREMIUM
 * ================================================
 * Sistema de gráficos revolucionario con:
 * - Animaciones complejas y fluidas
 * - Interactividad avanzada (hover, click, drag)
 * - Filtros en tiempo real
 * - Análisis predictivo visual
 * - Modo comparación histórica
 * - Zoom y pan interactivo
 * - Exportación de datos
 * - Tooltips contextuales avanzados
 */
import { memo, useCallback, useEffect, useState } from 'react';

import { AnimatePresence, motion } from 'framer-motion';
import {
  Download,
  Maximize2,
  Minimize2,
  RefreshCw,
  TrendingUp,
  X,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

import { theme } from '../design-system/theme';

// ============================================
// TYPES
// ============================================
interface ChartData {
  category: string;
  value: number;
  trend?: number;
  metadata?: any;
}

interface AdvancedChartProps {
  data: ChartData[];
  type: 'radar' | 'line' | 'bar' | 'area' | 'pie' | 'scatter' | 'composed';
  title?: string;
  colors?: string[];
  height?: number;
  showControls?: boolean;
  historicalData?: ChartData[][];
  onDataPointClick?: (data: ChartData) => void;
  exportable?: boolean;
}

// ============================================
// ADVANCED TOOLTIP COMPONENT
// ============================================
interface AdvancedTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
  colors: string[];
}

const AdvancedTooltip = memo(({ active, payload, label, colors }: AdvancedTooltipProps) => {
  if (!active || !payload?.[0]) return null;

  const data = payload[0].payload;
  const total = payload.reduce((sum: number, entry: any) => sum + (entry.value || 0), 0);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: -10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8, y: -10 }}
      className="rounded-xl p-4 shadow-2xl backdrop-blur-xl min-w-[200px]"
      style={{
        background:
          'linear-gradient(135deg, rgba(30, 30, 50, 0.95) 0%, rgba(20, 20, 40, 0.95) 100%)',
        border: `2px solid ${colors[0]}40`,
      }}
    >
      {label && (
        <p className="text-white font-bold text-base mb-3 pb-2 border-b border-white/20">{label}</p>
      )}

      <div className="space-y-2">
        {payload.map((entry: any, index: number) => {
          const percentage = total > 0 ? ((entry.value / total) * 100).toFixed(1) : '0';

          return (
            <motion.div
              key={`tooltip-${index}`}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: entry.color || colors[index % colors.length] }}
                />
                <span className="text-gray-300 text-sm">{entry.name || entry.dataKey}</span>
              </div>
              <div className="text-right">
                <p className="text-white font-bold text-sm">
                  ${(entry.value || 0).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                </p>
                <p className="text-gray-400 text-xs">{percentage}%</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {data.trend !== undefined && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-3 pt-3 border-t border-white/20"
        >
          <div className="flex items-center gap-2">
            <TrendingUp
              className={`w-4 h-4 ${data.trend >= 0 ? 'text-emerald-400' : 'text-red-400'} ${data.trend < 0 ? 'rotate-180' : ''}`}
            />
            <span
              className={`text-sm font-medium ${data.trend >= 0 ? 'text-emerald-400' : 'text-red-400'}`}
            >
              {data.trend >= 0 ? '+' : ''}
              {data.trend.toFixed(1)}%
            </span>
            <span className="text-gray-400 text-xs">vs anterior</span>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
});

AdvancedTooltip.displayName = 'AdvancedTooltip';

// ============================================
// CHART CONTROLS COMPONENT
// ============================================
interface ChartControlsProps {
  chartMode: string;
  setChartMode: (mode: string) => void;
  showLabels: boolean;
  setShowLabels: (show: boolean) => void;
  zoomLevel: number;
  setZoomLevel: (level: number) => void;
  onRefresh?: () => void;
  onExport?: () => void;
  isFullscreen: boolean;
  toggleFullscreen: () => void;
  filters?: {
    dateRange?: [Date, Date];
    categories?: string[];
  };
  onFilterChange?: (filters: any) => void;
}

const ChartControls = memo((props: ChartControlsProps) => {
  const {
    chartMode,
    setChartMode,
    showLabels,
    setShowLabels,
    zoomLevel,
    setZoomLevel,
    onRefresh,
    onExport,
    isFullscreen,
    toggleFullscreen,
  } = props;

  return (
    <div className="flex items-center justify-between flex-wrap gap-4 mb-4">
      {/* Mode Selection */}
      <div className="flex gap-2">
        {['current', 'historical', 'comparison', 'predictive'].map((mode) => (
          <motion.button
            key={mode}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setChartMode(mode)}
            className="px-4 py-2 rounded-lg font-medium transition-all text-sm capitalize"
            style={{
              background:
                chartMode === mode
                  ? `linear-gradient(135deg, ${"#3b82f6"} 0%, ${"#8b5cf6"} 100%)`
                  : 'rgba(255,255,255,0.1)',
              color: chartMode === mode ? 'white' : "#cbd5e1",
              border: `1px solid ${chartMode === mode ? "#3b82f6" : 'transparent'}`,
            }}
          >
            {mode}
          </motion.button>
        ))}
      </div>

      {/* Tools */}
      <div className="flex items-center gap-2">
        {/* Zoom Controls */}
        <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-white/5">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setZoomLevel(Math.max(50, zoomLevel - 10))}
            className="p-1 rounded hover:bg-white/10 transition-colors"
            style={{ color: "#cbd5e1" }}
          >
            <ZoomOut className="w-4 h-4" />
          </motion.button>
          <span className="text-xs text-white px-2">{zoomLevel}%</span>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setZoomLevel(Math.min(200, zoomLevel + 10))}
            className="p-1 rounded hover:bg-white/10 transition-colors"
            style={{ color: "#cbd5e1" }}
          >
            <ZoomIn className="w-4 h-4" />
          </motion.button>
        </div>

        {/* Show Labels Toggle */}
        <label className="flex items-center gap-2 cursor-pointer px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
          <input
            type="checkbox"
            checked={showLabels}
            onChange={(e) => setShowLabels(e.target.checked)}
            className="w-4 h-4 rounded"
          />
          <span style={{ color: "#cbd5e1", fontSize: "0.875rem" }}>
            Etiquetas
          </span>
        </label>

        {/* Refresh */}
        {onRefresh && (
          <motion.button
            whileHover={{ scale: 1.1, rotate: 180 }}
            whileTap={{ scale: 0.9 }}
            onClick={onRefresh}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
            style={{ color: "#cbd5e1" }}
          >
            <RefreshCw className="w-4 h-4" />
          </motion.button>
        )}

        {/* Export */}
        {onExport && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onExport}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
            style={{ color: "#cbd5e1" }}
          >
            <Download className="w-4 h-4" />
          </motion.button>
        )}

        {/* Fullscreen */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={toggleFullscreen}
          className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
          style={{ color: "#cbd5e1" }}
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </motion.button>
      </div>
    </div>
  );
});

ChartControls.displayName = 'ChartControls';

// ============================================
// ADVANCED RADAR CHART
// ============================================
export const AdvancedRadarChart = memo((props: AdvancedChartProps) => {
  const {
    data,
    title,
    colors = ["#3b82f6", "#8b5cf6"],
    height = 450,
    showControls = true,
    historicalData,
    onDataPointClick,
    exportable = true,
  } = props;

  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [chartMode, setChartMode] = useState('current');
  const [showLabels, setShowLabels] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [animationPhase, setAnimationPhase] = useState(0);

  // Pulse animation
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationPhase((prev) => (prev + 1) % 360);
    }, 30);
    return () => clearInterval(interval);
  }, []);

  // Export function
  const handleExport = useCallback(() => {
    const csv = [
      ['Categoría', 'Valor', 'Tendencia'],
      ...data.map((d) => [d.category, d.value, d.trend || 0]),
    ]
      .map((row) => row.join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chart-data-${Date.now()}.csv`;
    a.click();
  }, [data]);

  // Custom Dot Component
  const CustomDot = useCallback(
    (dotProps: any) => {
      const { cx, cy, payload, index } = dotProps;
      const isActive = activeIndex === index || selectedMetric === payload.category;
      const pulseSize = 1 + Math.sin(animationPhase * (Math.PI / 180)) * 0.15;

      return (
        <g
          onMouseEnter={() => setActiveIndex(index)}
          onMouseLeave={() => setActiveIndex(null)}
          onClick={() => {
            setSelectedMetric(payload.category);
            onDataPointClick?.(payload);
          }}
          style={{ cursor: 'pointer' }}
        >
          {/* Outer glow */}
          <motion.circle
            cx={cx}
            cy={cy}
            r={isActive ? 15 * pulseSize : 0}
            fill={colors[0]}
            opacity={isActive ? 0.2 : 0}
            animate={{ r: isActive ? [12, 16, 12] : 0 }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          {/* Main dot */}
          <circle
            cx={cx}
            cy={cy}
            r={isActive ? 7 : 5}
            fill={colors[0]}
            stroke="white"
            strokeWidth={2}
            style={{ transition: 'all 0.3s' }}
          />
          {/* Inner pulse */}
          <circle
            cx={cx}
            cy={cy}
            r={isActive ? 3.5 : 0}
            fill="white"
            opacity={isActive ? 0.9 : 0}
            style={{ transition: 'all 0.3s' }}
          />
        </g>
      );
    },
    [activeIndex, selectedMetric, colors, animationPhase, onDataPointClick]
  );

  const containerClasses = isFullscreen
    ? 'fixed inset-0 z-50 bg-black/95 backdrop-blur-xl p-8'
    : '';

  return (
    <div className={containerClasses}>
      <div className="space-y-4">
        {/* Title */}
        {title && (
          <h3 className="text-xl font-bold" style={{ color: "#f8fafc" }}>
            {title}
          </h3>
        )}

        {/* Controls */}
        {showControls && (
          <ChartControls
            chartMode={chartMode}
            setChartMode={setChartMode}
            showLabels={showLabels}
            setShowLabels={setShowLabels}
            zoomLevel={zoomLevel}
            setZoomLevel={setZoomLevel}
            onRefresh={() => setAnimationPhase(0)}
            onExport={exportable ? handleExport : undefined}
            isFullscreen={isFullscreen}
            toggleFullscreen={() => setIsFullscreen(!isFullscreen)}
          />
        )}

        {/* Chart */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="relative"
        >
          <ResponsiveContainer width="100%" height={height * (zoomLevel / 100)}>
            <RadarChart data={data}>
              <defs>
                <linearGradient id="radarGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={colors[0]} stopOpacity={0.8} />
                  <stop offset="100%" stopColor={colors[1]} stopOpacity={0.2} />
                </linearGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <filter id="shadow">
                  <feDropShadow dx="0" dy="4" stdDeviation="8" floodOpacity="0.4" />
                </filter>
              </defs>

              <PolarGrid stroke={colors[0]} strokeWidth={1.5} opacity={0.2} strokeDasharray="3 3" />
              <PolarAngleAxis
                dataKey="category"
                stroke={colors[0]}
                tick={(tickProps) => {
                  const { x, y, payload, index } = tickProps;
                  const isActive = activeIndex === index;
                  return (
                    <g transform={`translate(${x},${y})`}>
                      <text
                        x={0}
                        y={0}
                        dy={16}
                        textAnchor="middle"
                        fill={isActive ? colors[0] : 'white'}
                        fontSize={isActive ? 15 : 13}
                        fontWeight={isActive ? 'bold' : 'normal'}
                        style={{ transition: 'all 0.3s' }}
                      >
                        {showLabels ? payload.value : ''}
                      </text>
                    </g>
                  );
                }}
              />
              <PolarRadiusAxis stroke="rgba(255,255,255,0.3)" />

              {/* Historical layers */}
              {chartMode === 'historical' &&
                historicalData?.map((dataset, idx) => (
                  <Radar
                    key={`hist-${idx}`}
                    data={dataset}
                    dataKey="value"
                    stroke={colors[1]}
                    fill={colors[1]}
                    fillOpacity={0.05 + idx * 0.05}
                    strokeWidth={1}
                    strokeDasharray="5 5"
                  />
                ))}

              {/* Main radar */}
              <Radar
                name="Valor Actual"
                dataKey="value"
                stroke={colors[0]}
                fill="url(#radarGradient)"
                fillOpacity={0.7}
                strokeWidth={3}
                dot={CustomDot}
                filter="url(#glow)"
                animationBegin={0}
                animationDuration={1800}
                animationEasing="ease-out"
              />

              <Tooltip content={<AdvancedTooltip colors={colors} />} />
            </RadarChart>
          </ResponsiveContainer>

          {/* Selected Metric Indicator */}
          <AnimatePresence>
            {selectedMetric && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="absolute top-4 right-4 rounded-xl p-4 backdrop-blur-xl min-w-[200px]"
                style={{
                  background: `linear-gradient(135deg, ${colors[0]}30 0%, ${colors[1]}30 100%)`,
                  border: `2px solid ${colors[0]}`,
                  boxShadow: `0 0 20px ${colors[0]}40`,
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-white font-bold text-sm">Métrica Seleccionada</h4>
                  <button
                    onClick={() => setSelectedMetric(null)}
                    className="text-white/60 hover:text-white transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-white/90 font-medium">{selectedMetric}</p>
                <p className="text-white/60 text-xs mt-2">Click en el gráfico para cambiar</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Metric Pills */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
          {data.map((item, idx) => (
            <motion.button
              key={item.category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08 }}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedMetric(item.category)}
              className="p-3 rounded-lg transition-all group"
              style={{
                background:
                  selectedMetric === item.category
                    ? `linear-gradient(135deg, ${colors[0]}50 0%, ${colors[1]}50 100%)`
                    : 'rgba(255,255,255,0.03)',
                border: `1px solid ${selectedMetric === item.category ? colors[0] : 'rgba(255,255,255,0.1)'}`,
              }}
            >
              <p className="text-xs text-gray-400 mb-1 truncate">{item.category}</p>
              <p className="text-white font-bold text-sm group-hover:scale-110 transition-transform">
                $
                {(item.value * 1000).toLocaleString('es-MX', {
                  notation: 'compact',
                  maximumFractionDigits: 1,
                })}
              </p>
              {item.trend !== undefined && (
                <p
                  className={`text-xs mt-1 ${item.trend >= 0 ? 'text-emerald-400' : 'text-red-400'}`}
                >
                  {item.trend >= 0 ? '↗' : '↘'} {Math.abs(item.trend)}%
                </p>
              )}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
});

AdvancedRadarChart.displayName = 'AdvancedRadarChart';

// Export all advanced chart components
export { AdvancedBarChart } from './AdvancedBarChart';
export { AdvancedLineChart } from './AdvancedLineChart';
export { AdvancedPieChart } from './AdvancedPieChart';
export { AdvancedScatterChart } from './AdvancedScatterChart';
export { AdvancedTreemapChart } from './AdvancedTreemapChart';

// Export types
export type { AdvancedBarChartProps, BarChartDataPoint } from './AdvancedBarChart';
export type { AdvancedLineChartProps, LineChartDataPoint } from './AdvancedLineChart';
export type { AdvancedPieChartProps, PieChartDataPoint } from './AdvancedPieChart';
export type { AdvancedScatterChartProps, ScatterDataPoint } from './AdvancedScatterChart';
export type { AdvancedTreemapProps, TreemapDataPoint } from './AdvancedTreemapChart';
