/**
 * 📊 GRÁFICOS INTERACTIVOS PREMIUM (2D)
 * Visualizaciones modernas sin 3D, optimizadas para performance
 */
import { useMemo, useState } from 'react';

import { motion } from 'framer-motion';
import { TrendingDown, TrendingUp } from 'lucide-react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

/**
 * ⚡ SPARKLINE - Gráfico minimalista para tendencias rápidas
 */
export const Sparkline = ({
  data = [],
  color = '#3b82f6',
  height = 40,
  showDots = false,
  animated = true,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const trend = useMemo(() => {
    if (data.length < 2) return 'neutral';
    const first = data[0].value;
    const last = data[data.length - 1].value;
    return last > first ? 'up' : last < first ? 'down' : 'neutral';
  }, [data]);

  return (
    <motion.div
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      animate={{ scale: isHovered ? 1.02 : 1 }}
      transition={{ duration: 0.2 }}
    >
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data}>
          {animated && (
            <defs>
              <linearGradient id={`sparkGradient-${color}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                <stop offset="95%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
          )}
          <Line
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={2}
            dot={showDots}
            fill={`url(#sparkGradient-${color})`}
            animationDuration={animated ? 1000 : 0}
          />
        </LineChart>
      </ResponsiveContainer>

      {trend !== 'neutral' && (
        <motion.div
          className={`absolute top-0 right-0 ${trend === 'up' ? 'text-green-400' : 'text-red-400'}`}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
        >
          {trend === 'up' ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
        </motion.div>
      )}
    </motion.div>
  );
};

/**
 * 🔥 HEATMAP - Mapa de calor interactivo
 */
export const Heatmap = ({
  data = [],
  maxValue,
  cellSize = 40,
  gap = 4,
  colorRange = ['#1e3a8a', '#3b82f6', '#60a5fa', '#93c5fd'],
}) => {
  const [hoveredCell, setHoveredCell] = useState(null);
  const max = maxValue || Math.max(...data.flat().map((d) => d.value));

  const getColor = (value) => {
    const ratio = value / max;
    const index = Math.min(Math.floor(ratio * colorRange.length), colorRange.length - 1);
    return colorRange[index];
  };

  return (
    <div className="relative">
      <div className="space-y-1" style={{ gap: `${gap}px` }}>
        {data.map((row, rowIndex) => (
          <div key={rowIndex} className="flex gap-1" style={{ gap: `${gap}px` }}>
            {row.map((cell, colIndex) => (
              <motion.div
                key={`${rowIndex}-${colIndex}`}
                className="relative rounded cursor-pointer"
                style={{
                  width: cellSize,
                  height: cellSize,
                  backgroundColor: getColor(cell.value),
                }}
                whileHover={{
                  scale: 1.1,
                  zIndex: 10,
                  boxShadow: '0 0 20px rgba(59, 130, 246, 0.5)',
                }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  delay: (rowIndex * row.length + colIndex) * 0.01,
                  duration: 0.3,
                }}
                onMouseEnter={() => setHoveredCell(cell)}
                onMouseLeave={() => setHoveredCell(null)}
              />
            ))}
          </div>
        ))}
      </div>

      {hoveredCell && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-0 right-0 bg-gray-800/95 backdrop-blur-xl border border-gray-700/50 rounded-lg px-4 py-2 shadow-xl"
        >
          <p className="text-sm text-gray-400">{hoveredCell.label}</p>
          <p className="text-lg font-bold text-white">{hoveredCell.value}</p>
        </motion.div>
      )}
    </div>
  );
};

/**
 * 🎯 GAUGE CHART - Medidor circular animado
 */
export const GaugeChart = ({
  value = 0,
  max = 100,
  label = '',
  color = '#3b82f6',
  size = 200,
  showValue = true,
  thresholds = [
    { value: 33, color: '#ef4444' },
    { value: 66, color: '#f59e0b' },
    { value: 100, color: '#10b981' },
  ],
}) => {
  const percentage = (value / max) * 100;
  const _angle = (percentage / 100) * 180;

  const gaugeColor = useMemo(() => {
    const threshold = thresholds.find((t) => percentage <= (t.value / max) * 100);
    return threshold?.color || color;
  }, [percentage, thresholds, max, color]);

  const data = [
    {
      name: label,
      value: value,
      fill: gaugeColor,
    },
    {
      name: 'remaining',
      value: max - value,
      fill: 'rgba(107, 114, 128, 0.2)',
    },
  ];

  return (
    <div className="relative flex flex-col items-center">
      <ResponsiveContainer width={size} height={size}>
        <RadialBarChart
          cx="50%"
          cy="50%"
          innerRadius="70%"
          outerRadius="90%"
          data={data}
          startAngle={180}
          endAngle={0}
        >
          <RadialBar background dataKey="value" cornerRadius={10} animationDuration={1500} />
        </RadialBarChart>
      </ResponsiveContainer>

      {showValue && (
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/4 text-center"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
        >
          <motion.p
            className="text-4xl font-bold"
            style={{ color: gaugeColor }}
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {Math.round(percentage)}%
          </motion.p>
          {label && <p className="text-sm text-gray-400 mt-1">{label}</p>}
        </motion.div>
      )}
    </div>
  );
};

/**
 * 📈 TREND PREDICTION - Gráfico con predicción de tendencia
 */
export const TrendPrediction = ({
  historicalData = [],
  predictionData = [],
  xKey = 'date',
  yKey = 'value',
  height = 300,
}) => {
  const [showPrediction, setShowPrediction] = useState(true);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Tendencia y Predicción</h3>
        <motion.button
          onClick={() => setShowPrediction(!showPrediction)}
          className="px-4 py-2 rounded-lg bg-gray-800/60 border border-gray-700/50 text-sm text-gray-300"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {showPrediction ? 'Ocultar' : 'Mostrar'} Predicción
        </motion.button>
      </div>

      <ResponsiveContainer width="100%" height={height}>
        <AreaChart data={[...historicalData, ...predictionData]}>
          <defs>
            <linearGradient id="colorHistorical" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
            </linearGradient>
            <linearGradient id="colorPrediction" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.6} />
              <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis dataKey={xKey} stroke="#94a3b8" />
          <YAxis stroke="#94a3b8" />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(15, 23, 42, 0.9)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              color: '#fff',
            }}
          />
          <Area
            type="monotone"
            dataKey={yKey}
            stroke="#3b82f6"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorHistorical)"
            animationDuration={1000}
          />
          {showPrediction && (
            <Area
              type="monotone"
              dataKey="prediction"
              stroke="#8b5cf6"
              strokeWidth={2}
              strokeDasharray="5 5"
              fillOpacity={1}
              fill="url(#colorPrediction)"
              animationDuration={1000}
            />
          )}
        </AreaChart>
      </ResponsiveContainer>

      <div className="flex gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-500" />
          <span className="text-gray-400">Histórico</span>
        </div>
        {showPrediction && (
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-zinc-800" />
            <span className="text-gray-400">Predicción</span>
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * 🍩 ANIMATED DONUT - Gráfico de dona animado
 */
export const AnimatedDonut = ({
  data = [],
  innerRadius = 60,
  outerRadius = 100,
  height = 250,
  showLabels = true,
}) => {
  const [activeIndex, setActiveIndex] = useState(null);

  const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#ec4899'];

  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        className="text-xs font-semibold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={showLabels ? renderCustomLabel : false}
          outerRadius={outerRadius}
          innerRadius={innerRadius}
          dataKey="value"
          animationDuration={1000}
          animationBegin={0}
          onMouseEnter={(_, index) => setActiveIndex(index)}
          onMouseLeave={() => setActiveIndex(null)}
        >
          {data.map((_entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={COLORS[index % COLORS.length]}
              opacity={activeIndex === null || activeIndex === index ? 1 : 0.5}
              style={{
                filter: activeIndex === index ? 'drop-shadow(0 0 10px currentColor)' : 'none',
                transition: 'all 0.3s ease',
              }}
            />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            backgroundColor: 'rgba(15, 23, 42, 0.95)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '12px',
            color: '#fff',
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};

/**
 * 📊 COMPARISON BAR - Barras comparativas animadas
 */
export const ComparisonBar = ({
  current = 0,
  previous = 0,
  label = '',
  max = 100,
  animated = true,
}) => {
  const currentPercent = (current / max) * 100;
  const previousPercent = (previous / max) * 100;
  const change = ((current - previous) / previous) * 100;
  const isPositive = change >= 0;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-400">{label}</span>
        <motion.div
          className={`flex items-center gap-1 text-sm font-semibold ${
            isPositive ? 'text-green-400' : 'text-red-400'
          }`}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          {isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
          {Math.abs(change).toFixed(1)}%
        </motion.div>
      </div>

      <div className="space-y-2">
        <div className="relative h-8 bg-gray-800/50 rounded-lg overflow-hidden">
          <motion.div
            className="absolute left-0 top-0 h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg"
            initial={{ width: 0 }}
            animate={{ width: animated ? `${currentPercent}%` : `${currentPercent}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />
          <div className="absolute inset-0 flex items-center justify-end pr-3">
            <span className="text-sm font-semibold text-white">{current.toLocaleString()}</span>
          </div>
        </div>

        <div className="relative h-6 bg-gray-800/30 rounded-lg overflow-hidden">
          <motion.div
            className="absolute left-0 top-0 h-full bg-gray-600/50 rounded-lg"
            initial={{ width: 0 }}
            animate={{ width: animated ? `${previousPercent}%` : `${previousPercent}%` }}
            transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
          />
          <div className="absolute inset-0 flex items-center justify-end pr-3">
            <span className="text-xs font-medium text-gray-400">{previous.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * 🌡️ GRADIENT PROGRESS - Barra de progreso con gradiente
 */
export const GradientProgress = ({
  value = 0,
  max = 100,
  height = 8,
  gradient = 'linear-gradient(90deg, #3b82f6 0%, #8b5cf6 50%, #ec4899 100%)',
  showPercentage = true,
  animated = true,
}) => {
  const percentage = (value / max) * 100;

  return (
    <div className="space-y-2">
      <div
        className="relative bg-gray-800/50 rounded-full overflow-hidden"
        style={{ height: `${height}px` }}
      >
        <motion.div
          className="h-full rounded-full"
          style={{ background: gradient }}
          initial={{ width: 0 }}
          animate={{ width: animated ? `${percentage}%` : `${percentage}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
      </div>

      {showPercentage && (
        <div className="flex justify-between text-xs">
          <span className="text-gray-500">{value.toLocaleString()}</span>
          <motion.span
            className="font-semibold text-blue-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {percentage.toFixed(1)}%
          </motion.span>
          <span className="text-gray-500">{max.toLocaleString()}</span>
        </div>
      )}
    </div>
  );
};

export default {
  Sparkline,
  Heatmap,
  GaugeChart,
  TrendPrediction,
  AnimatedDonut,
  ComparisonBar,
  GradientProgress,
};
