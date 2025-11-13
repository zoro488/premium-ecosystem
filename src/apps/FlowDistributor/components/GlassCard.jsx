import { motion } from 'framer-motion';

/**
 * 💎 GLASS CARD - Tarjeta con efecto glassmorphism premium
 */
export const GlassCard = ({
  children,
  className = '',
  variant = 'default',
  hover = true,
  glow = false,
  gradient = false,
  onClick,
  ...props
}) => {
  const variants = {
    default: 'bg-gray-800/40 border-gray-700/50',
    primary: 'bg-blue-500/10 border-blue-500/30',
    success: 'bg-green-500/10 border-green-500/30',
    warning: 'bg-yellow-500/10 border-yellow-500/30',
    danger: 'bg-red-500/10 border-red-500/30',
    purple: 'bg-purple-500/10 border-purple-500/30',
  };

  const glowColors = {
    default: 'rgba(59, 130, 246, 0.2)',
    primary: 'rgba(59, 130, 246, 0.3)',
    success: 'rgba(34, 197, 94, 0.3)',
    warning: 'rgba(245, 158, 11, 0.3)',
    danger: 'rgba(239, 68, 68, 0.3)',
    purple: 'rgba(139, 92, 246, 0.3)',
  };

  return (
    <motion.div
      className={`
        backdrop-blur-xl rounded-2xl border
        ${variants[variant]}
        ${hover ? 'transition-all duration-300' : ''}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={
        hover
          ? {
              y: -4,
              boxShadow: glow
                ? `0 20px 60px ${glowColors[variant]}`
                : '0 20px 60px rgba(0, 0, 0, 0.3)',
              scale: 1.02,
            }
          : undefined
      }
      whileTap={onClick ? { scale: 0.98 } : undefined}
      onClick={onClick}
      style={
        gradient
          ? {
              background: `linear-gradient(135deg,
                ${variant === 'primary' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(139, 92, 246, 0.1)'} 0%,
                rgba(31, 41, 55, 0.4) 100%)`,
            }
          : undefined
      }
      {...props}
    >
      {children}
    </motion.div>
  );
};

/**
 * 📊 STAT CARD - Tarjeta de estadística con animaciones
 */
export const StatCard = ({
  title,
  value,
  icon: Icon,
  trend,
  trendValue,
  color = 'blue',
  loading = false,
}) => {
  const colorClasses = {
    blue: {
      bg: 'from-blue-500/10 to-blue-600/10',
      border: 'border-blue-500/20',
      icon: 'bg-blue-500/20 text-blue-400',
      text: 'text-blue-400',
    },
    green: {
      bg: 'from-green-500/10 to-green-600/10',
      border: 'border-green-500/20',
      icon: 'bg-green-500/20 text-green-400',
      text: 'text-green-400',
    },
    purple: {
      bg: 'from-purple-500/10 to-purple-600/10',
      border: 'border-purple-500/20',
      icon: 'bg-purple-500/20 text-purple-400',
      text: 'text-purple-400',
    },
    red: {
      bg: 'from-red-500/10 to-red-600/10',
      border: 'border-red-500/20',
      icon: 'bg-red-500/20 text-red-400',
      text: 'text-red-400',
    },
    yellow: {
      bg: 'from-yellow-500/10 to-yellow-600/10',
      border: 'border-yellow-500/20',
      icon: 'bg-yellow-500/20 text-yellow-400',
      text: 'text-yellow-400',
    },
  };

  const colors = colorClasses[color] || colorClasses.blue;

  return (
    <GlassCard className={`p-6 bg-gradient-to-br ${colors.bg} border ${colors.border}`} hover glow>
      <div className="flex items-center justify-between mb-4">
        <motion.div
          className={`p-3 rounded-xl ${colors.icon}`}
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.95 }}
        >
          {Icon && <Icon className="w-6 h-6" />}
        </motion.div>
        {trend && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            {trend === 'up' ? (
              <div className="flex items-center gap-1 text-green-400">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 10l7-7m0 0l7 7m-7-7v18"
                  />
                </svg>
                <span className="text-xs font-medium">{trendValue}</span>
              </div>
            ) : (
              <div className="flex items-center gap-1 text-red-400">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 14l-7 7m0 0l-7-7m7 7V3"
                  />
                </svg>
                <span className="text-xs font-medium">{trendValue}</span>
              </div>
            )}
          </motion.div>
        )}
      </div>

      <div className="space-y-1">
        <p className="text-sm text-gray-400">{title}</p>
        {loading ? (
          <div className="h-8 bg-gray-700/50 rounded animate-pulse" />
        ) : (
          <motion.p
            className="text-2xl font-bold text-white"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', bounce: 0.5 }}
          >
            {value}
          </motion.p>
        )}
      </div>
    </GlassCard>
  );
};

/**
 * 🎯 METRIC CARD - Tarjeta de métrica con barra de progreso
 */
export const MetricCard = ({
  label,
  value,
  maxValue,
  percentage,
  icon: Icon,
  color = 'blue',
  showProgress = true,
}) => {
  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    purple: 'bg-purple-500',
    red: 'bg-red-500',
    yellow: 'bg-yellow-500',
  };

  const barColor = colorClasses[color] || colorClasses.blue;

  return (
    <GlassCard className="p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {Icon && <Icon className="w-4 h-4 text-gray-400" />}
          <span className="text-sm text-gray-400">{label}</span>
        </div>
        <span className="text-sm font-medium text-white">{value}</span>
      </div>

      {showProgress && (
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-gray-500">0</span>
            <span className="text-gray-500">{maxValue}</span>
          </div>
          <div className="w-full bg-gray-700/50 rounded-full h-2 overflow-hidden">
            <motion.div
              className={`h-2 rounded-full ${barColor}`}
              initial={{ width: 0 }}
              animate={{ width: `${percentage}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
          </div>
        </div>
      )}
    </GlassCard>
  );
};

export default GlassCard;
