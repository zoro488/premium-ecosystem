/**
 * 📈 GRÁFICOS 3D INTERACTIVOS AAA
 * =================================
 * Gráficos de alta calidad con animaciones fluidas
 * Usando Recharts con efectos 3D personalizados
 */
import { memo, useMemo } from 'react';

import { motion } from 'framer-motion';
import { Activity, DollarSign, Package, TrendingDown, TrendingUp } from 'lucide-react';
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
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

// Colores gradientes premium
const COLORS = {
  primary: ['#06b6d4', '#3b82f6', '#8b5cf6'],
  success: ['#10b981', '#059669', '#047857'],
  warning: ['#f59e0b', '#d97706', '#b45309'],
  danger: ['#ef4444', '#dc2626', '#b91c1c'],
  purple: ['#a855f7', '#9333ea', '#7e22ce'],
  gradient: ['#06b6d4', '#3b82f6', '#8b5cf6', '#a855f7'],
};

/**
 * Tooltip personalizado premium
 */
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload || payload.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-gray-900/95 backdrop-blur-xl border border-gray-700 rounded-lg p-4 shadow-2xl"
    >
      <p className="text-sm font-semibold text-white mb-2">{label}</p>
      {payload.map((entry, index) => (
        <div key={index} className="flex items-center gap-2 text-sm">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
          <span className="text-gray-300">{entry.name}:</span>
          <span className="font-bold text-white">
            {typeof entry.value === 'number'
              ? entry.value.toLocaleString('es-MX', {
                  style: 'currency',
                  currency: 'MXN',
                })
              : entry.value}
          </span>
        </div>
      ))}
    </motion.div>
  );
};

/**
 * KPI Card 3D Animado
 */
export const KPICard3D = memo(
  ({ title, value, icon: Icon, trend = 0, color = 'cyan', subtitle = '' }) => {
    const isPositive = trend >= 0;

    return (
      <motion.div
        className="relative group"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -5, scale: 1.02 }}
        transition={{ duration: 0.3 }}
      >
        {/* Glow effect */}
        <div
          className={`absolute inset-0 bg-gradient-to-r from-${color}-500/20 to-${color}-600/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl`}
        />

        <div className="relative bg-gray-900/50 backdrop-blur-md border border-gray-800 rounded-2xl p-6 overflow-hidden">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0 bg-gradient-to-br from-white to-transparent" />
          </div>

          {/* Content */}
          <div className="relative z-10">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <p className="text-sm text-gray-400 mb-1">{title}</p>
                <motion.p
                  className={`text-3xl font-bold bg-gradient-to-r from-${color}-400 to-${color}-600 bg-clip-text text-transparent`}
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  {value}
                </motion.p>
                {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
              </div>

              <motion.div
                className={`p-3 bg-gradient-to-br from-${color}-500/20 to-${color}-600/20 rounded-xl`}
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <Icon className={`text-${color}-400`} size={24} />
              </motion.div>
            </div>

            {/* Trend */}
            {trend !== undefined && (
              <div className="flex items-center gap-2">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className={`flex items-center gap-1 px-2 py-1 rounded-lg ${
                    isPositive ? 'bg-zinc-9000/20 text-zinc-200' : 'bg-zinc-9000/20 text-zinc-200'
                  }`}
                >
                  {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                  <span className="text-xs font-semibold">{Math.abs(trend)}%</span>
                </motion.div>
                <span className="text-xs text-gray-500">vs mes anterior</span>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    );
  }
);

KPICard3D.displayName = 'KPICard3D';

/**
 * Gráfico de Líneas 3D Animado
 */
export const LineChart3D = memo(({ data, dataKeys = [], title = '', height = 300 }) => {
  return (
    <motion.div
      className="bg-gray-900/30 backdrop-blur-md border border-gray-800 rounded-xl p-6"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      {title && (
        <h3 className="text-lg font-semibold text-white mb-4 bg-gradient-to-r from-zinc-700 to-zinc-900 bg-clip-text text-transparent">
          {title}
        </h3>
      )}
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data}>
          <defs>
            {dataKeys.map((key, idx) => (
              <linearGradient key={key.key} id={`gradient-${key.key}`} x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor={COLORS.gradient[idx % COLORS.gradient.length]}
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor={COLORS.gradient[idx % COLORS.gradient.length]}
                  stopOpacity={0.1}
                />
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
          <XAxis dataKey="name" stroke="#9ca3af" style={{ fontSize: '12px' }} />
          <YAxis stroke="#9ca3af" style={{ fontSize: '12px' }} />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ fontSize: '12px', color: '#9ca3af' }} />
          {dataKeys.map((key, idx) => (
            <Line
              key={key.key}
              type="monotone"
              dataKey={key.key}
              name={key.name}
              stroke={`url(#gradient-${key.key})`}
              strokeWidth={3}
              dot={{ fill: COLORS.gradient[idx % COLORS.gradient.length], r: 4 }}
              activeDot={{ r: 6, fill: COLORS.gradient[idx % COLORS.gradient.length] }}
              animationDuration={1500}
              animationEasing="ease-in-out"
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </motion.div>
  );
});

LineChart3D.displayName = 'LineChart3D';

/**
 * Gráfico de Barras 3D
 */
export const BarChart3D = memo(({ data, dataKeys = [], title = '', height = 300 }) => {
  return (
    <motion.div
      className="bg-gray-900/30 backdrop-blur-md border border-gray-800 rounded-xl p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {title && (
        <h3 className="text-lg font-semibold text-white mb-4 bg-gradient-to-r from-zinc-800 to-zinc-700 bg-clip-text text-transparent">
          {title}
        </h3>
      )}
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data}>
          <defs>
            {dataKeys.map((key, idx) => (
              <linearGradient
                key={key.key}
                id={`bar-gradient-${key.key}`}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="5%"
                  stopColor={COLORS.gradient[idx % COLORS.gradient.length]}
                  stopOpacity={0.9}
                />
                <stop
                  offset="95%"
                  stopColor={COLORS.gradient[idx % COLORS.gradient.length]}
                  stopOpacity={0.3}
                />
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
          <XAxis dataKey="name" stroke="#9ca3af" style={{ fontSize: '12px' }} />
          <YAxis stroke="#9ca3af" style={{ fontSize: '12px' }} />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ fontSize: '12px', color: '#9ca3af' }} />
          {dataKeys.map((key, idx) => (
            <Bar
              key={key.key}
              dataKey={key.key}
              name={key.name}
              fill={`url(#bar-gradient-${key.key})`}
              radius={[8, 8, 0, 0]}
              animationDuration={1000}
              animationBegin={idx * 100}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
});

BarChart3D.displayName = 'BarChart3D';

/**
 * Gráfico de Área 3D
 */
export const AreaChart3D = memo(({ data, dataKeys = [], title = '', height = 300 }) => {
  return (
    <motion.div
      className="bg-gray-900/30 backdrop-blur-md border border-gray-800 rounded-xl p-6"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
    >
      {title && (
        <h3 className="text-lg font-semibold text-white mb-4 bg-gradient-to-r from-emerald-400 to-teal-600 bg-clip-text text-transparent">
          {title}
        </h3>
      )}
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart data={data}>
          <defs>
            {dataKeys.map((key, idx) => (
              <linearGradient
                key={key.key}
                id={`area-gradient-${key.key}`}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="5%"
                  stopColor={COLORS.gradient[idx % COLORS.gradient.length]}
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor={COLORS.gradient[idx % COLORS.gradient.length]}
                  stopOpacity={0.1}
                />
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
          <XAxis dataKey="name" stroke="#9ca3af" style={{ fontSize: '12px' }} />
          <YAxis stroke="#9ca3af" style={{ fontSize: '12px' }} />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ fontSize: '12px', color: '#9ca3af' }} />
          {dataKeys.map((key, idx) => (
            <Area
              key={key.key}
              type="monotone"
              dataKey={key.key}
              name={key.name}
              stroke={COLORS.gradient[idx % COLORS.gradient.length]}
              strokeWidth={2}
              fill={`url(#area-gradient-${key.key})`}
              animationDuration={1500}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </motion.div>
  );
});

AreaChart3D.displayName = 'AreaChart3D';

/**
 * Gráfico de Pastel 3D
 */
export const PieChart3D = memo(({ data, title = '', height = 300 }) => {
  const renderLabel = (entry) => {
    return `${entry.name}: ${entry.value.toLocaleString()}`;
  };

  return (
    <motion.div
      className="bg-gray-900/30 backdrop-blur-md border border-gray-800 rounded-xl p-6"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      {title && (
        <h3 className="text-lg font-semibold text-white mb-4 bg-gradient-to-r from-orange-400 to-zinc-800 bg-clip-text text-transparent">
          {title}
        </h3>
      )}
      <ResponsiveContainer width="100%" height={height}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderLabel}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
            animationBegin={0}
            animationDuration={800}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS.gradient[index % COLORS.gradient.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ fontSize: '12px', color: '#9ca3af' }} />
        </PieChart>
      </ResponsiveContainer>
    </motion.div>
  );
});

PieChart3D.displayName = 'PieChart3D';

// Eliminado export default para evitar problemas de inicialización durante minificación
// Usar solo named exports
