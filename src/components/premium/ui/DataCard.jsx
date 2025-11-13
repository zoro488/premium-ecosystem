/**
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║                         CHRONOS DATA CARD                                  ║
 * ║                 Tarjeta Premium con Microanimaciones                       ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 * Tarjeta de datos premium con:
 * - Glassmorphism avanzado
 * - Microanimaciones en hover
 * - Iconos animados
 * - Trends con indicadores
 * - Gradientes dinámicos
 * - Glow effects
 *
 * @module DataCard
 * @author CHRONOS System
 * @version 1.0.0
 */
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';

// ============================================================================
// CONFIGURACIÓN DE COLORES
// ============================================================================

const colorSchemes = {
  blue: {
    gradient: 'from-blue-500/20 to-cyan-500/20',
    border: 'border-blue-500/30',
    icon: 'text-blue-400',
    glow: 'shadow-blue-500/20',
    darkGradient: 'from-blue-600/10 to-cyan-600/10',
  },
  green: {
    gradient: 'from-green-500/20 to-emerald-500/20',
    border: 'border-green-500/30',
    icon: 'text-green-400',
    glow: 'shadow-green-500/20',
    darkGradient: 'from-green-600/10 to-emerald-600/10',
  },
  purple: {
    gradient: 'from-purple-500/20 to-pink-500/20',
    border: 'border-purple-500/30',
    icon: 'text-purple-400',
    glow: 'shadow-purple-500/20',
    darkGradient: 'from-purple-600/10 to-pink-600/10',
  },
  orange: {
    gradient: 'from-orange-500/20 to-yellow-500/20',
    border: 'border-orange-500/30',
    icon: 'text-orange-400',
    glow: 'shadow-orange-500/20',
    darkGradient: 'from-orange-600/10 to-yellow-600/10',
  },
  red: {
    gradient: 'from-red-500/20 to-rose-500/20',
    border: 'border-red-500/30',
    icon: 'text-red-400',
    glow: 'shadow-red-500/20',
    darkGradient: 'from-red-600/10 to-rose-600/10',
  },
  indigo: {
    gradient: 'from-indigo-500/20 to-blue-500/20',
    border: 'border-indigo-500/30',
    icon: 'text-indigo-400',
    glow: 'shadow-indigo-500/20',
    darkGradient: 'from-indigo-600/10 to-blue-600/10',
  },
};

// ============================================================================
// DATA CARD COMPONENT
// ============================================================================

/**
 * DataCard - Tarjeta de datos premium con animaciones
 */
export const DataCard = ({
  title,
  value,
  icon: Icon,
  trend,
  color = 'blue',
  className = '',
  subtitle,
  loading = false,
  onClick,
  badge,
}) => {
  const scheme = colorSchemes[color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02, y: -5 }}
      whileTap={onClick ? { scale: 0.98 } : {}}
      transition={{
        duration: 0.3,
        ease: [0.4, 0, 0.2, 1],
      }}
      onClick={onClick}
      className={`
        relative overflow-hidden rounded-2xl
        backdrop-blur-xl bg-gradient-to-br ${scheme.gradient}
        border ${scheme.border}
        p-6 shadow-2xl ${scheme.glow}
        hover:shadow-3xl transition-all duration-300
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
      role="article"
      aria-label={`${title}: ${value}`}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 1px)`,
            backgroundSize: '20px 20px',
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          {/* Icon Container */}
          <motion.div
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
            className={`
              p-3 rounded-xl bg-gradient-to-br ${scheme.darkGradient}
              border ${scheme.border} backdrop-blur-sm
            `}
          >
            {Icon && <Icon className={`w-6 h-6 ${scheme.icon}`} />}
          </motion.div>

          {/* Trend Badge */}
          {trend && (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className={`
                flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium
                backdrop-blur-sm border
                ${
                  trend.isPositive
                    ? 'bg-green-500/20 text-green-400 border-green-500/30'
                    : 'bg-red-500/20 text-red-400 border-red-500/30'
                }
              `}
            >
              <span>{trend.isPositive ? '↑' : '↓'}</span>
              <span>{Math.abs(trend.value)}%</span>
            </motion.div>
          )}

          {/* Custom Badge */}
          {badge && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`
                px-2 py-1 rounded-lg text-xs font-medium
                backdrop-blur-sm border ${badge.className || 'bg-blue-500/20 text-blue-400 border-blue-500/30'}
              `}
            >
              {badge.label}
            </motion.div>
          )}
        </div>

        {/* Title */}
        <h3 className="text-sm font-medium text-gray-400 mb-2">{title}</h3>

        {/* Value */}
        {loading ? (
          <div className="h-10 w-32 bg-white/10 rounded-lg animate-pulse" />
        ) : (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-3xl font-bold text-white mb-1"
          >
            {value}
          </motion.p>
        )}

        {/* Subtitle */}
        {subtitle && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="text-xs text-gray-500"
          >
            {subtitle}
          </motion.p>
        )}
      </div>

      {/* Glow Effect on Hover */}
      <motion.div
        className={`
          absolute -inset-1 bg-gradient-to-r ${scheme.gradient}
          rounded-2xl opacity-0 blur-xl transition-opacity duration-500
        `}
        whileHover={{ opacity: 0.2 }}
      />

      {/* Animated Border Glow */}
      <motion.div
        className={`
          absolute inset-0 rounded-2xl
          bg-gradient-to-r ${scheme.gradient}
          opacity-0
        `}
        whileHover={{ opacity: 0.1 }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  );
};

DataCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  icon: PropTypes.elementType,
  trend: PropTypes.shape({
    value: PropTypes.number.isRequired,
    isPositive: PropTypes.bool.isRequired,
  }),
  color: PropTypes.oneOf(['blue', 'green', 'purple', 'orange', 'red', 'indigo']),
  className: PropTypes.string,
  subtitle: PropTypes.string,
  loading: PropTypes.bool,
  onClick: PropTypes.func,
  badge: PropTypes.shape({
    label: PropTypes.string.isRequired,
    className: PropTypes.string,
  }),
};

// ============================================================================
// GRID DE DATA CARDS
// ============================================================================

/**
 * DataCardGrid - Contenedor con animación staggered
 */
export const DataCardGrid = ({ children, className = '' }) => {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2,
          },
        },
      }}
      className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ${className}`}
    >
      {children}
    </motion.div>
  );
};

DataCardGrid.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

// ============================================================================
// SKELETON LOADER
// ============================================================================

/**
 * DataCardSkeleton - Skeleton para loading state
 */
export const DataCardSkeleton = ({ count = 4 }) => {
  return (
    <DataCardGrid>
      {[...Array(count)].map((_, i) => (
        <div
          key={`skeleton-${i}`}
          className="
            relative overflow-hidden rounded-2xl
            backdrop-blur-xl bg-gradient-to-br from-gray-500/10 to-gray-600/10
            border border-gray-500/20
            p-6 shadow-2xl
          "
        >
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div className="w-12 h-12 bg-white/10 rounded-xl animate-pulse" />
              <div className="w-16 h-6 bg-white/10 rounded-lg animate-pulse" />
            </div>
            <div className="space-y-2">
              <div className="h-4 w-24 bg-white/10 rounded animate-pulse" />
              <div className="h-8 w-32 bg-white/10 rounded animate-pulse" />
            </div>
          </div>

          {/* Shimmer effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
            animate={{ x: ['-100%', '100%'] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
          />
        </div>
      ))}
    </DataCardGrid>
  );
};

DataCardSkeleton.propTypes = {
  count: PropTypes.number,
};

export default DataCard;
