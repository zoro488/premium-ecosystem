/**
 * 📊 ADVANCED CHART - Sistema de gráficos premium con animaciones
 *
 * OPTIMIZADO con React.memo para performance
 */
import { memo } from 'react';

import { motion } from 'framer-motion';
import { Activity, TrendingDown, TrendingUp } from 'lucide-react';
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

const CustomTooltip = memo(({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 10 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className="relative bg-gradient-to-br from-black via-zinc-950 to-black backdrop-blur-2xl border border-zinc-800/50 rounded-xl p-4 shadow-2xl"
    >
      {/* Animated border glow */}
      <motion.div
        animate={{
          boxShadow: [
            '0 0 20px rgba(113, 113, 122, 0.3)',
            '0 0 40px rgba(113, 113, 122, 0.5)',
            '0 0 20px rgba(113, 113, 122, 0.3)',
          ],
        }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute inset-0 rounded-xl -z-10"
      />
      <p className="text-zinc-400 text-sm mb-2 font-semibold">{label}</p>
      <div className="space-y-1">
        {payload.map((entry, index) => (
          <motion.div
            key={`${entry.name}-${index}`}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="flex items-center gap-3"
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: index * 0.2 }}
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color, boxShadow: `0 0 10px ${entry.color}` }}
            />
            <span className="text-white font-bold text-lg">
              {entry.name}: ${entry.value?.toLocaleString()}
            </span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
});

CustomTooltip.displayName = 'CustomTooltip';

const AdvancedChart = memo(
  ({
    data = [],
    type = 'area',
    dataKey = 'value',
    xKey = 'name',
    title,
    subtitle,
    height = 300,
    showGrid = true,
    showLegend = false,
    gradient = true,
    color = '#71717a',
  }) => {
    const chartComponents = {
      area: AreaChart,
      bar: BarChart,
      line: LineChart,
    };

    const ChartComponent = chartComponents[type] || AreaChart;

    const gradientId = `gradient-${dataKey}-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className="w-full">
        {title && (
          <div className="mb-4">
            <motion.h3
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-xl font-bold text-white flex items-center gap-2"
            >
              <Activity className="w-5 h-5 text-zinc-400" />
              {title}
            </motion.h3>
            {subtitle && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="text-sm text-zinc-400 mt-1"
              >
                {subtitle}
              </motion.p>
            )}
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <ResponsiveContainer width="100%" height={height}>
            <ChartComponent data={data}>
              {gradient && (
                <defs>
                  <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={color} stopOpacity={0.8} />
                    <stop offset="95%" stopColor={color} stopOpacity={0.1} />
                  </linearGradient>
                </defs>
              )}
              {showGrid && (
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
              )}
              <XAxis
                dataKey={xKey}
                stroke="#71717a"
                tick={{ fill: '#a1a1aa', fontSize: 12 }}
                tickLine={false}
                axisLine={{ stroke: '#27272a' }}
              />
              <YAxis
                stroke="#71717a"
                tick={{ fill: '#a1a1aa', fontSize: 12 }}
                tickLine={false}
                axisLine={{ stroke: '#27272a' }}
                tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(113, 113, 122, 0.1)' }} />

              {type === 'area' && (
                <Area
                  type="monotone"
                  dataKey={dataKey}
                  stroke={color}
                  strokeWidth={2}
                  fill={gradient ? `url(#${gradientId})` : color}
                  animationDuration={1000}
                  animationEasing="ease-out"
                />
              )}

              {type === 'bar' && (
                <Bar
                  dataKey={dataKey}
                  fill={color}
                  radius={[8, 8, 0, 0]}
                  animationDuration={1000}
                  animationEasing="ease-out"
                />
              )}

              {type === 'line' && (
                <Line
                  type="monotone"
                  dataKey={dataKey}
                  stroke={color}
                  strokeWidth={3}
                  dot={{ fill: color, strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, strokeWidth: 2 }}
                  animationDuration={1000}
                  animationEasing="ease-out"
                />
              )}
            </ChartComponent>
          </ResponsiveContainer>
        </motion.div>
      </div>
    );
  }
);

AdvancedChart.displayName = 'AdvancedChart';

export const StatCard = memo(({ title, value, change, icon: Icon, trend = 'up' }) => {
  const isPositive = trend?.includes('+') || trend === 'up';
  const TrendIcon = isPositive ? TrendingUp : TrendingDown;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8, scale: 1.03 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className="relative overflow-hidden bg-gradient-to-br from-zinc-900/95 via-zinc-800/85 to-black/90 backdrop-blur-2xl border border-zinc-800/50 rounded-2xl p-6 group shadow-2xl"
    >
      {/* Animated gradient background */}
      <motion.div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
        animate={{
          background: [
            'radial-gradient(circle at 0% 0%, rgba(113, 113, 122, 0.15) 0%, transparent 50%)',
            'radial-gradient(circle at 100% 100%, rgba(113, 113, 122, 0.15) 0%, transparent 50%)',
            'radial-gradient(circle at 0% 0%, rgba(113, 113, 122, 0.15) 0%, transparent 50%)',
          ],
        }}
        transition={{ duration: 5, repeat: Infinity }}
      />

      {/* Shine effect on hover */}
      <motion.div
        className="absolute inset-0 opacity-0 group-hover:opacity-100"
        initial={{ x: '-100%' }}
        whileHover={{ x: '100%' }}
        transition={{ duration: 0.8, ease: 'easeInOut' }}
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
        }}
      />

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            className="p-3 bg-zinc-800/60 rounded-xl border border-zinc-700/50 shadow-lg"
          >
            {Icon && <Icon className="w-6 h-6 text-zinc-300" />}
          </motion.div>
          {trend && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.1 }}
              className={`flex items-center gap-1 px-3 py-1 rounded-lg backdrop-blur-sm ${
                isPositive
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  : 'bg-red-500/10 text-red-400 border border-red-500/20'
              }`}
            >
              <TrendIcon className="w-4 h-4" />
              <span className="text-xs font-bold">{trend}</span>
            </motion.div>
          )}
        </div>

        <h4 className="text-zinc-400 text-sm mb-2 uppercase tracking-wider">{title}</h4>
        <motion.p
          initial={{ scale: 0.5 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
          className="text-3xl font-bold text-white"
        >
          {value}
        </motion.p>
      </div>

      {/* Shine effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full"
        animate={{ translateX: ['100%', '200%'] }}
        transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
      />
    </motion.div>
  );
});

StatCard.displayName = 'StatCard';

export { AdvancedChart, StatCard };
export default AdvancedChart;
