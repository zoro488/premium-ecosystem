import React, { useState } from 'react';

import { AnimatePresence, motion } from 'framer-motion';
import {
  Activity,
  BarChart3,
  PieChart as PieChartIcon,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

/**
 * 🎨 ANIMATED CHART PREMIUM
 * Componente de gráficos con:
 * - Múltiples tipos de visualización
 * - Animaciones fluidas en entrada
 * - Tooltips personalizados
 * - Microinteracciones
 * - Cambio de tipo dinámico
 */

const AnimatedChart = ({
  data = [],
  type = 'line', // 'line' | 'bar' | 'area' | 'pie'
  title,
  description,
  dataKeys = [],
  colors = ['#8b5cf6', '#ec4899', '#06b6d4', '#10b981'],
  showLegend = true,
  showGrid = true,
  height = 300,
  enableTypeSwitch = false,
  className = '',
}) => {
  const [chartType, setChartType] = useState(type);
  const [hoveredBar, setHoveredBar] = useState(null);

  // Tooltip personalizado con animaciones
  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload || !payload.length) return null;

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: 10 }}
        className="bg-slate-900/95 backdrop-blur-xl border border-white/20 rounded-xl p-4 shadow-2xl"
      >
        <p className="text-sm font-semibold text-white mb-2">{label}</p>
        {payload.map((entry, index) => (
          <motion.div
            key={`item-${index}`}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="flex items-center justify-between gap-4 text-sm"
          >
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
              <span className="text-slate-300">{entry.name}:</span>
            </div>
            <span className="font-bold text-white">{entry.value.toLocaleString()}</span>
          </motion.div>
        ))}
      </motion.div>
    );
  };

  // Calcular estadísticas
  const stats = React.useMemo(() => {
    if (!data.length || !dataKeys.length) return null;

    const key = dataKeys[0];
    const values = data.map((d) => d[key] || 0);
    const total = values.reduce((a, b) => a + b, 0);
    const avg = total / values.length;
    const max = Math.max(...values);
    const min = Math.min(...values);
    const trend = values[values.length - 1] > values[0] ? 'up' : 'down';

    return { total, avg, max, min, trend };
  }, [data, dataKeys]);

  const renderChart = () => {
    const commonProps = {
      data,
      margin: { top: 10, right: 30, left: 0, bottom: 0 },
    };

    switch (chartType) {
      case 'bar':
        return (
          <BarChart {...commonProps}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />}
            <XAxis dataKey="name" stroke="#9CA3AF" fontSize={12} />
            <YAxis stroke="#9CA3AF" fontSize={12} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(139, 92, 246, 0.1)' }} />
            {showLegend && <Legend />}
            {dataKeys.map((key, index) => (
              <Bar
                key={key}
                dataKey={key}
                fill={colors[index % colors.length]}
                radius={[8, 8, 0, 0]}
                onMouseEnter={(data, index) => setHoveredBar(index)}
                onMouseLeave={() => setHoveredBar(null)}
                animationDuration={800}
                animationBegin={index * 100}
              />
            ))}
          </BarChart>
        );

      case 'area':
        return (
          <AreaChart {...commonProps}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />}
            <XAxis dataKey="name" stroke="#9CA3AF" fontSize={12} />
            <YAxis stroke="#9CA3AF" fontSize={12} />
            <Tooltip content={<CustomTooltip />} />
            {showLegend && <Legend />}
            {dataKeys.map((key, index) => (
              <Area
                key={key}
                type="monotone"
                dataKey={key}
                stroke={colors[index % colors.length]}
                fill={`url(#gradient${index})`}
                strokeWidth={3}
                animationDuration={1000}
                animationBegin={index * 150}
              />
            ))}
            <defs>
              {dataKeys.map((key, index) => (
                <linearGradient key={key} id={`gradient${index}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={colors[index % colors.length]} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={colors[index % colors.length]} stopOpacity={0} />
                </linearGradient>
              ))}
            </defs>
          </AreaChart>
        );

      case 'pie':
        return (
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              outerRadius={100}
              fill="#8884d8"
              dataKey={dataKeys[0]}
              animationDuration={1000}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        );

      case 'line':
      default:
        return (
          <LineChart {...commonProps}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />}
            <XAxis dataKey="name" stroke="#9CA3AF" fontSize={12} />
            <YAxis stroke="#9CA3AF" fontSize={12} />
            <Tooltip content={<CustomTooltip />} />
            {showLegend && <Legend />}
            {dataKeys.map((key, index) => (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                stroke={colors[index % colors.length]}
                strokeWidth={3}
                dot={{ fill: colors[index % colors.length], r: 6 }}
                activeDot={{ r: 8, strokeWidth: 2, stroke: '#fff' }}
                animationDuration={1000}
                animationBegin={index * 150}
              />
            ))}
          </LineChart>
        );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 ${className}`}
    >
      {/* Header con estadísticas */}
      <div className="flex items-start justify-between mb-6">
        <div>
          {title && <h3 className="text-xl font-bold text-white mb-1">{title}</h3>}
          {description && <p className="text-sm text-slate-400">{description}</p>}
        </div>

        {/* Selector de tipo de gráfico */}
        {enableTypeSwitch && (
          <div className="flex gap-2 bg-white/5 p-1 rounded-lg">
            {[
              { type: 'line', icon: Activity },
              { type: 'bar', icon: BarChart3 },
              { type: 'pie', icon: PieChartIcon },
            ].map(({ type: t, icon: Icon }) => (
              <motion.button
                key={t}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setChartType(t)}
                className={`p-2 rounded transition-all ${
                  chartType === t
                    ? 'bg-purple-500 text-white'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="w-4 h-4" />
              </motion.button>
            ))}
          </div>
        )}
      </div>

      {/* Mini estadísticas */}
      {stats && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6"
        >
          <div className="bg-white/5 rounded-xl p-3">
            <p className="text-xs text-slate-400 mb-1">Total</p>
            <p className="text-lg font-bold text-white">{stats.total.toLocaleString()}</p>
          </div>
          <div className="bg-white/5 rounded-xl p-3">
            <p className="text-xs text-slate-400 mb-1">Promedio</p>
            <p className="text-lg font-bold text-white">{Math.round(stats.avg).toLocaleString()}</p>
          </div>
          <div className="bg-white/5 rounded-xl p-3">
            <p className="text-xs text-slate-400 mb-1">Máximo</p>
            <p className="text-lg font-bold text-green-400">{stats.max.toLocaleString()}</p>
          </div>
          <div className="bg-white/5 rounded-xl p-3">
            <p className="text-xs text-slate-400 mb-1 flex items-center gap-1">
              Tendencia
              {stats.trend === 'up' ? (
                <TrendingUp className="w-3 h-3 text-green-400" />
              ) : (
                <TrendingDown className="w-3 h-3 text-red-400" />
              )}
            </p>
            <p
              className={`text-lg font-bold ${
                stats.trend === 'up' ? 'text-green-400' : 'text-red-400'
              }`}
            >
              {stats.trend === 'up' ? '+' : '-'}
              {Math.abs(
                ((data[data.length - 1][dataKeys[0]] - data[0][dataKeys[0]]) /
                  data[0][dataKeys[0]]) *
                  100
              ).toFixed(1)}
              %
            </p>
          </div>
        </motion.div>
      )}

      {/* Gráfico con animación */}
      <AnimatePresence mode="wait">
        <motion.div
          key={chartType}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.3 }}
        >
          <ResponsiveContainer width="100%" height={height}>
            {renderChart()}
          </ResponsiveContainer>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
};

export default AnimatedChart;
