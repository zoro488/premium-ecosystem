import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react';

/* eslint-disable react/prop-types */

/**
 * 🎨 WIDGETS PREMIUM MODERNOS - FlowDistributor 2025
 * Componentes widget con glassmorphism, efectos 3D y animaciones fluidas
 */

// ============================================
// METRIC CARD PREMIUM con Glassmorphism
// ============================================
export const MetricCardPremium = ({
  title,
  value,
  change,
  icon: Icon,
  trend = 'up',
  color = 'primary',
  delay = 0
}) => {
  const colorClasses = {
    primary: {
      bg: 'from-zinc-800/20 to-zinc-800/20',
      glow: 'shadow-glow',
      icon: 'text-zinc-300',
      trend: trend === 'up' ? 'text-zinc-200' : 'text-zinc-200'
    },
    success: {
      bg: 'from-green-500/20 to-emerald-500/20',
      glow: 'shadow-glow-success',
      icon: 'text-zinc-200',
      trend: trend === 'up' ? 'text-zinc-200' : 'text-zinc-200'
    },
    warning: {
      bg: 'from-yellow-500/20 to-orange-500/20',
      glow: 'shadow-glow-warning',
      icon: 'text-zinc-200',
      trend: trend === 'up' ? 'text-zinc-200' : 'text-zinc-200'
    },
    purple: {
      bg: 'from-zinc-800/20 to-zinc-700/20',
      glow: 'shadow-glow-purple',
      icon: 'text-zinc-800',
      trend: trend === 'up' ? 'text-zinc-200' : 'text-zinc-200'
    }
  };

  const colors = colorClasses[color] || colorClasses.primary;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ scale: 1.02, y: -4 }}
      className={`
        relative overflow-hidden rounded-2xl p-6
        bg-gradient-to-br ${colors.bg}
        backdrop-blur-xl border border-white/10
        ${colors.glow} hover:shadow-premium
        transition-all duration-300 cursor-pointer
        group
      `}
    >
      {/* Animated Background Gradient */}
      <div className="absolute inset-0 bg-gradient-mesh opacity-30 animate-gradient-shift" />

      {/* Shimmer Effect */}
      <div className="absolute inset-0 bg-shimmer animate-shimmer opacity-0 group-hover:opacity-100 transition-opacity" />

      <div className="relative z-10">
        {/* Header with Icon */}
        <div className="flex items-center justify-between mb-4">
          <div className={`
            p-3 rounded-xl bg-white/5 backdrop-blur-sm
            ${colors.icon} group-hover:scale-110 transition-transform
          `}>
            <Icon className="w-6 h-6" />
          </div>
          <div className={`flex items-center gap-1 text-sm font-semibold ${colors.trend}`}>
            {trend === 'up' ? (
              <ArrowUpRight className="w-4 h-4 animate-bounce" />
            ) : (
              <ArrowDownRight className="w-4 h-4 animate-bounce" />
            )}
            <span>{change}</span>
          </div>
        </div>

        {/* Value */}
        <div className="mb-2">
          <h3 className="text-3xl font-bold text-white group-hover:text-gradient transition-all">
            {value}
          </h3>
        </div>

        {/* Title */}
        <p className="text-sm text-gray-300 font-medium">
          {title}
        </p>

        {/* Progress Bar */}
        <div className="mt-4 h-1 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: '70%' }}
            transition={{ duration: 1, delay: delay + 0.3 }}
            className={`h-full bg-gradient-to-r ${colors.bg.replace('/20', '/60')} animate-pulse-glow`}
          />
        </div>
      </div>
    </motion.div>
  );
};

// ============================================
// GLASS CARD con efectos 3D
// ============================================
export const GlassCard3D = ({ children, className = '', hover3D = true }) => {
  return (
    <motion.div
      whileHover={hover3D ? {
        scale: 1.02,
        rotateX: 5,
        rotateY: 5,
        transition: { duration: 0.3 }
      } : {}}
      style={{ transformStyle: 'preserve-3d' }}
      className={`
        relative overflow-hidden rounded-2xl p-6
        bg-white/5 backdrop-blur-2xl border border-white/10
        shadow-glass hover:shadow-glass-lg
        transition-all duration-300
        ${className}
      `}
    >
      {/* Floating particles effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-2 h-2 bg-zinc-700/30 rounded-full blur-sm animate-float"
             style={{ top: '20%', left: '10%', animationDelay: '0s' }} />
        <div className="absolute w-3 h-3 bg-zinc-800/30 rounded-full blur-sm animate-float"
             style={{ top: '60%', right: '15%', animationDelay: '1s' }} />
        <div className="absolute w-2 h-2 bg-zinc-700/30 rounded-full blur-sm animate-float"
             style={{ bottom: '30%', left: '20%', animationDelay: '2s' }} />
      </div>

      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
};

// ============================================
// STAT WIDGET con animación de conteo
// ============================================
export const StatWidget = ({
  icon: Icon,
  label,
  value,
  suffix = '',
  color = 'blue',
  animated = true
}) => {
  const [count, setCount] = React.useState(0);
  const numericValue = typeof value === 'number' ? value : Number.parseFloat(value) || 0;

  React.useEffect(() => {
    if (!animated) {
      setCount(numericValue);
      return;
    }

    let start = 0;
    const end = numericValue;
    const duration = 1500;
    const increment = end / (duration / 16);

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [numericValue, animated]);

  const colorClasses = {
    blue: 'from-zinc-800 to-zinc-800',
    green: 'from-green-500 to-emerald-500',
    purple: 'from-zinc-800 to-zinc-700',
    orange: 'from-orange-500 to-yellow-500',
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05 }}
      className="relative group cursor-pointer"
    >
      <div className={`
        relative overflow-hidden rounded-xl p-4
        bg-gradient-to-br ${colorClasses[color]}/10
        backdrop-blur-lg border border-white/10
        hover:shadow-glow-lg transition-all duration-300
      `}>
        {/* Icon */}
        <div className="flex items-center gap-3 mb-3">
          <div className={`
            p-2 rounded-lg bg-gradient-to-br ${colorClasses[color]}/20
            group-hover:scale-110 transition-transform
          `}>
            <Icon className="w-5 h-5 text-white" />
          </div>
          <span className="text-sm text-gray-300 font-medium">{label}</span>
        </div>

        {/* Value */}
        <div className="flex items-baseline gap-1">
          <span className={`
            text-2xl font-bold bg-gradient-to-r ${colorClasses[color]}
            bg-clip-text text-transparent
          `}>
            {animated ? count.toLocaleString() : numericValue.toLocaleString()}
          </span>
          <span className="text-sm text-gray-400">{suffix}</span>
        </div>

        {/* Animated border */}
        <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity">
          <div className={`
            absolute inset-0 rounded-xl
            bg-gradient-to-r ${colorClasses[color]}
            blur-xl opacity-50 animate-pulse-glow
          `} />
        </div>
      </div>
    </motion.div>
  );
};

// ============================================
// MINI CHART WIDGET
// ============================================
export const MiniChartWidget = ({
  title,
  value,
  data = [],
  color = 'blue',
  sparkline = true
}) => {
  const colorMap = {
    blue: { stroke: '#60a5fa', fill: 'rgba(96, 165, 250, 0.1)' },
    green: { stroke: '#34d399', fill: 'rgba(52, 211, 153, 0.1)' },
    purple: { stroke: '#a78bfa', fill: 'rgba(167, 139, 250, 0.1)' },
    red: { stroke: '#f87171', fill: 'rgba(248, 113, 113, 0.1)' },
  };

  const colors = colorMap[color] || colorMap.blue;

  // Generate SVG path for sparkline
  const generatePath = () => {
    if (!data.length) return '';

    const width = 100;
    const height = 40;
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;

    const points = data.map((value, index) => {
      const x = (index / (data.length - 1)) * width;
      const y = height - ((value - min) / range) * height;
      return `${x},${y}`;
    });

    return `M ${points.join(' L ')}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      whileHover={{ scale: 1.03 }}
      className={`
        relative overflow-hidden rounded-xl p-4
        bg-white/5 backdrop-blur-xl border border-white/10
        hover:shadow-glow transition-all duration-300
        group cursor-pointer
      `}
    >
      {/* Content */}
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-3">
          <div>
            <p className="text-sm text-gray-400 mb-1">{title}</p>
            <h3 className="text-2xl font-bold text-white">{value}</h3>
          </div>

          {sparkline && data.length > 0 && (
            <svg width="100" height="40" className="opacity-70 group-hover:opacity-100 transition-opacity">
              <defs>
                <linearGradient id={`gradient-${color}`} x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" style={{ stopColor: colors.stroke, stopOpacity: 0.3 }} />
                  <stop offset="100%" style={{ stopColor: colors.stroke, stopOpacity: 0 }} />
                </linearGradient>
              </defs>
              <path
                d={`${generatePath()} L 100,40 L 0,40 Z`}
                fill={`url(#gradient-${color})`}
              />
              <path
                d={generatePath()}
                fill="none"
                stroke={colors.stroke}
                strokeWidth="2"
                className="animate-fade-in"
              />
            </svg>
          )}
        </div>

        {/* Trend indicator */}
        <div className="flex items-center gap-2 text-xs">
          <TrendingUp className={`w-3 h-3 ${color === 'red' ? 'rotate-90' : ''}`} style={{ color: colors.stroke }} />
          <span style={{ color: colors.stroke }}>vs mes anterior</span>
        </div>
      </div>

      {/* Glow effect */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity blur-2xl"
        style={{ background: colors.fill }}
      />
    </motion.div>
  );
};

// ============================================
// QUICK ACTION BUTTON
// ============================================
export const QuickActionButton = ({
  icon: Icon,
  label,
  onClick,
  color = 'primary',
  badge = null
}) => {
  const colorClasses = {
    primary: 'from-zinc-800 to-zinc-800 hover:from-zinc-900 hover:to-zinc-800',
    success: 'from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600',
    danger: 'from-zinc-700 to-zinc-700 hover:from-zinc-700 hover:to-zinc-700',
    warning: 'from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600',
  };

  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.95 }}
      className={`
        relative group overflow-hidden
        px-6 py-3 rounded-xl
        bg-gradient-to-r ${colorClasses[color]}
        text-white font-medium
        shadow-lg hover:shadow-premium
        transition-all duration-300
        flex items-center gap-2
      `}
    >
      {/* Shimmer effect */}
      <div className="absolute inset-0 bg-shimmer animate-shimmer opacity-0 group-hover:opacity-100" />

      <Icon className="w-5 h-5 relative z-10 group-hover:rotate-12 transition-transform" />
      <span className="relative z-10">{label}</span>

      {badge && (
        <span className="
          absolute -top-1 -right-1
          w-5 h-5 rounded-full
          bg-zinc-9000 text-white text-xs
          flex items-center justify-center
          animate-pulse
        ">
          {badge}
        </span>
      )}
    </motion.button>
  );
};

// ============================================
// NOTIFICATION BADGE
// ============================================
export const NotificationBadge = ({ count, color = 'red', pulse = true }) => {
  const colorClasses = {
    red: 'bg-zinc-9000',
    blue: 'bg-zinc-800',
    green: 'bg-zinc-9000',
    yellow: 'bg-zinc-9000',
  };

  if (count === 0) return null;

  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      className={`
        absolute -top-1 -right-1
        min-w-[20px] h-5 px-1.5
        ${colorClasses[color]}
        text-white text-xs font-bold
        rounded-full
        flex items-center justify-center
        ${pulse ? 'animate-pulse' : ''}
        shadow-lg
      `}
    >
      {count > 99 ? '99+' : count}
    </motion.div>
  );
};

// ============================================
// PROGRESS RING
// ============================================
export const ProgressRing = ({
  percentage,
  size = 120,
  strokeWidth = 8,
  color = 'blue',
  label = ''
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  const colorMap = {
    blue: '#60a5fa',
    green: '#34d399',
    purple: '#a78bfa',
    orange: '#fb923c',
  };

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(255, 255, 255, 0.1)"
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={colorMap[color] || colorMap.blue}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: 'easeOut' }}
          style={{
            strokeDasharray: circumference,
            filter: `drop-shadow(0 0 8px ${colorMap[color] || colorMap.blue})`,
          }}
        />
      </svg>

      {/* Center text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-white">{percentage}%</span>
        {label && <span className="text-xs text-gray-400">{label}</span>}
      </div>
    </div>
  );
};

export default {
  MetricCardPremium,
  GlassCard3D,
  StatWidget,
  MiniChartWidget,
  QuickActionButton,
  NotificationBadge,
  ProgressRing,
};
