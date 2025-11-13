// ============================================================================
// 📈 CHRONOS CHART - Premium Interactive Charts Component
// Gráficos avanzados con animaciones, tooltips interactivos y exportación
// ============================================================================

import { motion } from 'framer-motion';
import { BarChart3, Download, LineChart, PieChart, TrendingUp } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import {
    Area,
    AreaChart,
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Legend,
    Line,
    Pie,
    LineChart as RechartsLineChart,
    PieChart as RechartsPieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';

export type ChartType = 'line' | 'bar' | 'area' | 'pie';

interface ChronosChartProps {
  data: Record<string, unknown>[];
  type?: ChartType;
  xKey: string;
  yKeys: string[];
  colors?: string[];
  title?: string;
  subtitle?: string;
  height?: number;
  loading?: boolean;
  className?: string;
  animated?: boolean;
  showLegend?: boolean;
  showGrid?: boolean;
  onExport?: () => void;
}

const DEFAULT_COLORS = [
  '#00d9ff', // neon-cyan
  '#8b5cf6', // neon-purple
  '#10b981', // neon-green
  '#f59e0b', // neon-amber
  '#ef4444', // neon-red
  '#6366f1', // neon-blue
  '#ec4899', // neon-pink
];

const GRADIENTS = [
  { id: 'cyan', color: 'url(#gradientCyan)' },
  { id: 'purple', color: 'url(#gradientPurple)' },
  { id: 'green', color: 'url(#gradientGreen)' },
  { id: 'amber', color: 'url(#gradientAmber)' },
];

// Custom Tooltip
interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number | string;
    color: string;
  }>;
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
  if (!active || !payload) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-dark p-4 rounded-xl border border-white/10 shadow-2xl"
    >
      <p className="text-chronos-pearl font-semibold mb-2">{label}</p>
      {payload.map((entry, index: number) => (
        <div key={index} className="flex items-center justify-between gap-4 mb-1">
          <span className="text-chronos-silver text-sm flex items-center gap-2">
            <span
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            {entry.name}:
          </span>
          <span className="text-chronos-white font-mono font-bold">
            {typeof entry.value === 'number'
              ? new Intl.NumberFormat('es-MX', {
                  style: 'currency',
                  currency: 'MXN',
                  maximumFractionDigits: 0,
                }).format(entry.value)
              : entry.value
            }
          </span>
        </div>
      ))}
    </motion.div>
  );
};

export function ChronosChart({
  data,
  type = 'line',
  xKey,
  yKeys,
  colors = DEFAULT_COLORS,
  title,
  subtitle,
  height = 400,
  loading = false,
  className = '',
  animated = true,
  showLegend = true,
  showGrid = true,
  onExport,
}: ChronosChartProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  // Intersection Observer para animación de entrada
  useEffect(() => {
    if (!animated || !chartRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(chartRef.current);

    return () => observer.disconnect();
  }, [animated]);

  // Chart Type Icons
  const ChartIcon = {
    line: LineChart,
    bar: BarChart3,
    area: TrendingUp,
    pie: PieChart,
  }[type];

  // Export función
  const handleExport = () => {
    if (onExport) {
      onExport();
    } else {
      // Exportar como JSON por defecto
      const dataStr = JSON.stringify(data, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `chart-data-${Date.now()}.json`;
      link.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <motion.div
      ref={chartRef}
      className={`card-glass ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      {(title || subtitle) && (
        <div className="flex items-start justify-between mb-6 pb-4 border-b border-chronos-smoke">
          <div className="flex-1">
            {title && (
              <h3 className="text-xl font-bold text-chronos-white flex items-center gap-3">
                <ChartIcon className="w-6 h-6 text-neon-cyan" />
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-sm text-chronos-silver mt-1">{subtitle}</p>
            )}
          </div>

          {/* Botón de exportar */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleExport}
            className="glass px-4 py-2 rounded-lg text-chronos-silver hover:text-chronos-white transition-colors flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span className="text-sm font-medium">Exportar</span>
          </motion.button>
        </div>
      )}

      {/* Chart Container */}
      <div style={{ height: `${height}px` }} className="relative">
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-4 border-neon-cyan border-t-transparent rounded-full animate-spin" />
              <span className="text-chronos-silver font-mono text-sm">Cargando gráfico...</span>
            </div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            {type === 'line' && (
              <RechartsLineChart data={data}>
                <defs>
                  {GRADIENTS.map((grad, idx) => (
                    <linearGradient key={grad.id} id={`gradient${grad.id.charAt(0).toUpperCase() + grad.id.slice(1)}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={colors[idx]} stopOpacity={0.8} />
                      <stop offset="100%" stopColor={colors[idx]} stopOpacity={0.1} />
                    </linearGradient>
                  ))}
                </defs>
                {showGrid && (
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(255,255,255,0.05)"
                    vertical={false}
                  />
                )}
                <XAxis
                  dataKey={xKey}
                  stroke="#71717a"
                  style={{ fontSize: '12px', fontFamily: 'JetBrains Mono' }}
                />
                <YAxis
                  stroke="#71717a"
                  style={{ fontSize: '12px', fontFamily: 'JetBrains Mono' }}
                  tickFormatter={(value) =>
                    new Intl.NumberFormat('es-MX', {
                      notation: 'compact',
                      compactDisplay: 'short'
                    }).format(value)
                  }
                />
                <Tooltip content={<CustomTooltip />} />
                {showLegend && (
                  <Legend
                    wrapperStyle={{ paddingTop: '20px' }}
                    iconType="circle"
                  />
                )}
                {yKeys.map((key, idx) => (
                  <Line
                    key={key}
                    type="monotone"
                    dataKey={key}
                    stroke={colors[idx % colors.length]}
                    strokeWidth={3}
                    dot={{ r: 4, strokeWidth: 2 }}
                    activeDot={{ r: 6, strokeWidth: 2 }}
                    animationDuration={animated && isVisible ? 1500 : 0}
                    animationBegin={0}
                  />
                ))}
              </RechartsLineChart>
            )}

            {type === 'bar' && (
              <BarChart data={data}>
                {showGrid && (
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(255,255,255,0.05)"
                    vertical={false}
                  />
                )}
                <XAxis
                  dataKey={xKey}
                  stroke="#71717a"
                  style={{ fontSize: '12px', fontFamily: 'JetBrains Mono' }}
                />
                <YAxis
                  stroke="#71717a"
                  style={{ fontSize: '12px', fontFamily: 'JetBrains Mono' }}
                  tickFormatter={(value) =>
                    new Intl.NumberFormat('es-MX', {
                      notation: 'compact',
                      compactDisplay: 'short'
                    }).format(value)
                  }
                />
                <Tooltip content={<CustomTooltip />} />
                {showLegend && (
                  <Legend
                    wrapperStyle={{ paddingTop: '20px' }}
                    iconType="circle"
                  />
                )}
                {yKeys.map((key, idx) => (
                  <Bar
                    key={key}
                    dataKey={key}
                    fill={colors[idx % colors.length]}
                    radius={[8, 8, 0, 0]}
                    animationDuration={animated && isVisible ? 1500 : 0}
                    animationBegin={idx * 100}
                  />
                ))}
              </BarChart>
            )}

            {type === 'area' && (
              <AreaChart data={data}>
                <defs>
                  {yKeys.map((_, idx) => (
                    <linearGradient key={`area-${idx}`} id={`areaGradient${idx}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={colors[idx % colors.length]} stopOpacity={0.8} />
                      <stop offset="100%" stopColor={colors[idx % colors.length]} stopOpacity={0} />
                    </linearGradient>
                  ))}
                </defs>
                {showGrid && (
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(255,255,255,0.05)"
                    vertical={false}
                  />
                )}
                <XAxis
                  dataKey={xKey}
                  stroke="#71717a"
                  style={{ fontSize: '12px', fontFamily: 'JetBrains Mono' }}
                />
                <YAxis
                  stroke="#71717a"
                  style={{ fontSize: '12px', fontFamily: 'JetBrains Mono' }}
                  tickFormatter={(value) =>
                    new Intl.NumberFormat('es-MX', {
                      notation: 'compact',
                      compactDisplay: 'short'
                    }).format(value)
                  }
                />
                <Tooltip content={<CustomTooltip />} />
                {showLegend && (
                  <Legend
                    wrapperStyle={{ paddingTop: '20px' }}
                    iconType="circle"
                  />
                )}
                {yKeys.map((key, idx) => (
                  <Area
                    key={key}
                    type="monotone"
                    dataKey={key}
                    stroke={colors[idx % colors.length]}
                    strokeWidth={2}
                    fill={`url(#areaGradient${idx})`}
                    animationDuration={animated && isVisible ? 1500 : 0}
                    animationBegin={idx * 100}
                  />
                ))}
              </AreaChart>
            )}

            {type === 'pie' && (
              <RechartsPieChart>
                <Pie
                  data={data}
                  dataKey={yKeys[0]}
                  nameKey={xKey}
                  cx="50%"
                  cy="50%"
                  outerRadius={120}
                  label
                  labelLine={{ stroke: '#71717a' }}
                  animationDuration={animated && isVisible ? 1500 : 0}
                  animationBegin={0}
                >
                  {data.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={colors[index % colors.length]}
                      stroke="rgba(0,0,0,0.5)"
                      strokeWidth={2}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                {showLegend && (
                  <Legend
                    verticalAlign="bottom"
                    height={36}
                    iconType="circle"
                  />
                )}
              </RechartsPieChart>
            )}
          </ResponsiveContainer>
        )}
      </div>
    </motion.div>
  );
}

export default ChronosChart;
