/**
 * 📊 PREMIUM CHART - Componente de Gráficos Premium
 *
 * Wrapper para Recharts con animaciones fluidas, interactividad
 * avanzada y drill-down capabilities
 *
 * Features:
 * - Múltiples tipos de gráfico (bar, line, area)
 * - Animaciones entrance suaves
 * - Hover effects premium
 * - Drill-down interactivo
 * - Filtros de tiempo
 * - Export data
 *
 * @version 1.0.0
 */
import { memo, useMemo } from 'react';

import { motion } from 'framer-motion';
import { BarChart3, Download, LineChart as LineChartIcon, TrendingUp } from 'lucide-react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

// Design System
import animations from '../../design-system/animations';
import { theme } from '../../design-system/theme';
// Utils
import { formatCurrency } from '../../utils/formatters';

interface PremiumChartProps {
  title: string;
  type: 'bar' | 'line' | 'area';
  data: any[];
  timeRange: '7d' | '30d' | '90d' | '1y';
  onTypeChange: (type: 'bar' | 'line' | 'area') => void;
  onTimeRangeChange: (range: '7d' | '30d' | '90d' | '1y') => void;
}

export const PremiumChart = memo<PremiumChartProps>(
  ({ title, type, data, timeRange, onTypeChange, onTimeRangeChange }) => {
    // Procesar datos por rango de tiempo
    const chartData = useMemo(() => {
      const now = new Date();
      let startDate: Date;

      switch (timeRange) {
        case '7d':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case '30d':
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        case '90d':
          startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
          break;
        case '1y':
          startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
          break;
        default:
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      }

      // Filtrar ventas por fecha
      const filtered = data.filter((item) => {
        const itemDate = new Date(item.fecha);
        return itemDate >= startDate && itemDate <= now;
      });

      // Agrupar por día/semana/mes según el rango
      const grouped: Record<string, number> = {};

      filtered.forEach((item) => {
        const date = new Date(item.fecha);
        let key: string;

        if (timeRange === '7d' || timeRange === '30d') {
          // Agrupar por día
          key = date.toLocaleDateString('es-MX', {
            month: 'short',
            day: 'numeric',
          });
        } else if (timeRange === '90d') {
          // Agrupar por semana
          const weekNumber = Math.floor(
            (date.getTime() - startDate.getTime()) / (7 * 24 * 60 * 60 * 1000)
          );
          key = `Sem ${weekNumber + 1}`;
        } else {
          // Agrupar por mes
          key = date.toLocaleDateString('es-MX', {
            month: 'short',
            year: '2-digit',
          });
        }

        grouped[key] = (grouped[key] || 0) + (item.totalVenta || 0);
      });

      // Convertir a array para Recharts
      return Object.entries(grouped)
        .map(([date, value]) => ({
          fecha: date,
          ventas: value,
        }))
        .slice(-20); // Últimos 20 puntos
    }, [data, timeRange]);

    // Custom Tooltip
    const CustomTooltip = ({ active, payload }: any) => {
      if (!active || !payload || !payload.length) return null;

      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-4 rounded-xl backdrop-blur-xl bg-slate-900/90 border border-white/20 shadow-2xl"
        >
          <p className="text-sm text-white/60 mb-1">{payload[0].payload.fecha}</p>
          <p className="text-xl font-bold text-white">{formatCurrency(payload[0].value)}</p>
        </motion.div>
      );
    };

    // Export data as JSON
    const handleExport = () => {
      const dataStr = JSON.stringify(chartData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `ventas-${timeRange}-${Date.now()}.json`;
      link.click();
      URL.revokeObjectURL(url);
    };

    return (
      <motion.div
        variants={animations.card.glassCard}
        initial="initial"
        animate="animate"
        className="p-6 rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-zinc-300" />
            {title}
          </h3>

          {/* Controls */}
          <div className="flex items-center gap-3">
            {/* Type Selector */}
            <div className="flex items-center gap-1 p-1 rounded-lg bg-white/5">
              <button
                onClick={() => onTypeChange('bar')}
                className={`p-2 rounded transition-colors ${
                  type === 'bar' ? 'bg-zinc-800 text-white' : 'text-white/50 hover:text-white'
                }`}
              >
                <BarChart3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => onTypeChange('line')}
                className={`p-2 rounded transition-colors ${
                  type === 'line' ? 'bg-zinc-800 text-white' : 'text-white/50 hover:text-white'
                }`}
              >
                <LineChartIcon className="w-4 h-4" />
              </button>
              <button
                onClick={() => onTypeChange('area')}
                className={`p-2 rounded transition-colors ${
                  type === 'area' ? 'bg-zinc-800 text-white' : 'text-white/50 hover:text-white'
                }`}
              >
                <TrendingUp className="w-4 h-4" />
              </button>
            </div>

            {/* Time Range Selector */}
            <div className="flex items-center gap-1 p-1 rounded-lg bg-white/5">
              {['7d', '30d', '90d', '1y'].map((range) => (
                <button
                  key={range}
                  onClick={() => onTimeRangeChange(range as any)}
                  className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                    timeRange === range
                      ? 'bg-zinc-800 text-white'
                      : 'text-white/50 hover:text-white'
                  }`}
                >
                  {range.toUpperCase()}
                </button>
              ))}
            </div>

            {/* Export Button */}
            <button
              onClick={handleExport}
              className="p-2 rounded-lg bg-white/5 text-white/50 hover:text-white hover:bg-white/10 transition-colors"
              title="Exportar datos"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Chart */}
        <motion.div
          variants={animations.chart.barGrow}
          initial="initial"
          animate="animate"
          className="h-80"
        >
          <ResponsiveContainer width="100%" height="100%">
            {type === 'bar' ? (
              <BarChart data={chartData}>
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={theme.colors.primary[400]} stopOpacity={0.8} />
                    <stop offset="100%" stopColor={theme.colors.primary[600]} stopOpacity={0.3} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis
                  dataKey="fecha"
                  stroke="rgba(255,255,255,0.5)"
                  style={{ fontSize: '12px' }}
                />
                <YAxis
                  stroke="rgba(255,255,255,0.5)"
                  style={{ fontSize: '12px' }}
                  tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar
                  dataKey="ventas"
                  fill="url(#barGradient)"
                  radius={[8, 8, 0, 0]}
                  animationDuration={800}
                  animationEasing="ease-out"
                />
              </BarChart>
            ) : type === 'line' ? (
              <LineChart data={chartData}>
                <defs>
                  <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor={theme.colors.secondary[400]} />
                    <stop offset="100%" stopColor={theme.colors.tertiary[400]} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis
                  dataKey="fecha"
                  stroke="rgba(255,255,255,0.5)"
                  style={{ fontSize: '12px' }}
                />
                <YAxis
                  stroke="rgba(255,255,255,0.5)"
                  style={{ fontSize: '12px' }}
                  tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="ventas"
                  stroke="url(#lineGradient)"
                  strokeWidth={3}
                  dot={{ fill: theme.colors.primary[400], r: 4 }}
                  activeDot={{ r: 6, fill: theme.colors.primary[300] }}
                  animationDuration={1000}
                  animationEasing="ease-in-out"
                />
              </LineChart>
            ) : (
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={theme.colors.tertiary[400]} stopOpacity={0.8} />
                    <stop offset="100%" stopColor={theme.colors.tertiary[600]} stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis
                  dataKey="fecha"
                  stroke="rgba(255,255,255,0.5)"
                  style={{ fontSize: '12px' }}
                />
                <YAxis
                  stroke="rgba(255,255,255,0.5)"
                  style={{ fontSize: '12px' }}
                  tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="ventas"
                  stroke={theme.colors.tertiary[400]}
                  strokeWidth={2}
                  fill="url(#areaGradient)"
                  animationDuration={1200}
                  animationEasing="ease-out"
                />
              </AreaChart>
            )}
          </ResponsiveContainer>
        </motion.div>

        {/* Stats Footer */}
        <div className="mt-6 pt-6 border-t border-white/10 grid grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-xs text-white/50 mb-1">Total</p>
            <p className="text-lg font-bold text-white">
              {formatCurrency(
                chartData.reduce((acc, d) => acc + d.ventas, 0),
                'MXN'
              )}
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-white/50 mb-1">Promedio</p>
            <p className="text-lg font-bold text-white">
              {formatCurrency(
                chartData.length > 0
                  ? chartData.reduce((acc, d) => acc + d.ventas, 0) / chartData.length
                  : 0,
                'MXN'
              )}
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-white/50 mb-1">Máximo</p>
            <p className="text-lg font-bold text-white">
              {formatCurrency(Math.max(...chartData.map((d) => d.ventas)), 'MXN')}
            </p>
          </div>
        </div>
      </motion.div>
    );
  }
);

PremiumChart.displayName = 'PremiumChart';

export default PremiumChart;
