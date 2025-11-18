/**
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║                        CHRONOS STATUS BADGE                                ║
 * ║                   Badge Interactivo con Animaciones                        ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 * Badge premium con:
 * - Estados predefinidos (success, error, warning, info, pending)
 * - Animaciones opcionales (pulse, glow)
 * - Tamaños configurables
 * - Iconos animados
 * - Tooltip opcional
 *
 * @module StatusBadge
 * @author CHRONOS System
 * @version 1.0.0
 */
import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle, Clock, Info, XCircle } from 'lucide-react';
import PropTypes from 'prop-types';

// ============================================================================
// CONFIGURACIÓN DE ESTADOS
// ============================================================================

const statusConfig = {
  success: {
    icon: CheckCircle,
    colors: {
      bg: 'bg-green-500/20',
      text: 'text-green-400',
      border: 'border-green-500/30',
      glow: 'shadow-green-500/50',
    },
    label: 'Éxito',
  },
  error: {
    icon: XCircle,
    colors: {
      bg: 'bg-red-500/20',
      text: 'text-red-400',
      border: 'border-red-500/30',
      glow: 'shadow-red-500/50',
    },
    label: 'Error',
  },
  warning: {
    icon: AlertTriangle,
    colors: {
      bg: 'bg-yellow-500/20',
      text: 'text-yellow-400',
      border: 'border-yellow-500/30',
      glow: 'shadow-yellow-500/50',
    },
    label: 'Advertencia',
  },
  info: {
    icon: Info,
    colors: {
      bg: 'bg-blue-500/20',
      text: 'text-blue-400',
      border: 'border-blue-500/30',
      glow: 'shadow-blue-500/50',
    },
    label: 'Información',
  },
  pending: {
    icon: Clock,
    colors: {
      bg: 'bg-gray-500/20',
      text: 'text-gray-400',
      border: 'border-gray-500/30',
      glow: 'shadow-gray-500/50',
    },
    label: 'Pendiente',
  },
  active: {
    icon: CheckCircle,
    colors: {
      bg: 'bg-emerald-500/20',
      text: 'text-emerald-400',
      border: 'border-emerald-500/30',
      glow: 'shadow-emerald-500/50',
    },
    label: 'Activo',
  },
  inactive: {
    icon: XCircle,
    colors: {
      bg: 'bg-slate-500/20',
      text: 'text-slate-400',
      border: 'border-slate-500/30',
      glow: 'shadow-slate-500/50',
    },
    label: 'Inactivo',
  },
};

const sizes = {
  sm: {
    padding: 'px-2 py-0.5',
    text: 'text-xs',
    icon: 'w-3 h-3',
  },
  md: {
    padding: 'px-3 py-1',
    text: 'text-sm',
    icon: 'w-4 h-4',
  },
  lg: {
    padding: 'px-4 py-1.5',
    text: 'text-base',
    icon: 'w-5 h-5',
  },
};

// ============================================================================
// STATUS BADGE COMPONENT
// ============================================================================

/**
 * StatusBadge - Badge de estado con animaciones
 */
export const StatusBadge = ({
  status = 'info',
  label,
  size = 'md',
  pulse = false,
  glow = false,
  animated = true,
  showIcon = true,
  className = '',
  onClick,
  tooltip,
}) => {
  const config = statusConfig[status] || statusConfig.info;
  const sizeConfig = sizes[size];
  const Icon = config.icon;
  const displayLabel = label || config.label;

  const badgeContent = (
    <motion.div
      initial={animated ? { opacity: 0, scale: 0.8 } : false}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={onClick ? { scale: 1.05 } : {}}
      whileTap={onClick ? { scale: 0.95 } : {}}
      className={`
        inline-flex items-center gap-1.5
        ${sizeConfig.padding} ${sizeConfig.text}
        ${config.colors.bg} ${config.colors.text}
        border ${config.colors.border}
        rounded-full font-medium
        backdrop-blur-sm
        transition-all duration-300
        ${glow ? `${config.colors.glow} shadow-lg` : ''}
        ${onClick ? 'cursor-pointer hover:shadow-xl' : ''}
        ${className}
      `}
      onClick={onClick}
      role={onClick ? 'button' : 'status'}
      aria-label={displayLabel}
    >
      {/* Icon */}
      {showIcon && Icon && (
        <motion.div
          animate={
            pulse
              ? {
                  scale: [1, 1.2, 1],
                  opacity: [1, 0.8, 1],
                }
              : {}
          }
          transition={
            pulse
              ? {
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }
              : {}
          }
        >
          <Icon className={sizeConfig.icon} />
        </motion.div>
      )}

      {/* Label */}
      <span>{displayLabel}</span>

      {/* Pulse Effect */}
      {pulse && (
        <motion.span
          className={`absolute inset-0 rounded-full ${config.colors.bg} border ${config.colors.border}`}
          animate={{
            scale: [1, 1.4, 1.4],
            opacity: [0.5, 0, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeOut',
          }}
        />
      )}
    </motion.div>
  );

  // Con tooltip
  if (tooltip) {
    return (
      <div className="relative inline-block group">
        {badgeContent}
        <div
          className="
            absolute bottom-full left-1/2 -translate-x-1/2 mb-2
            px-2 py-1 text-xs text-white bg-gray-900 rounded-lg
            opacity-0 group-hover:opacity-100 transition-opacity
            pointer-events-none whitespace-nowrap
            z-50
          "
        >
          {tooltip}
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-900" />
        </div>
      </div>
    );
  }

  return badgeContent;
};

StatusBadge.propTypes = {
  status: PropTypes.oneOf(['success', 'error', 'warning', 'info', 'pending', 'active', 'inactive']),
  label: PropTypes.string,
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  pulse: PropTypes.bool,
  glow: PropTypes.bool,
  animated: PropTypes.bool,
  showIcon: PropTypes.bool,
  className: PropTypes.string,
  onClick: PropTypes.func,
  tooltip: PropTypes.string,
};

// ============================================================================
// GRUPO DE BADGES
// ============================================================================

/**
 * StatusBadgeGroup - Grupo de badges con espaciado
 */
export const StatusBadgeGroup = ({ children, className = '' }) => {
  return <div className={`flex flex-wrap items-center gap-2 ${className}`}>{children}</div>;
};

StatusBadgeGroup.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

// ============================================================================
// BADGE DE CONTEO
// ============================================================================

/**
 * CountBadge - Badge numérico pequeño (como notificaciones)
 */
export const CountBadge = ({
  count,
  max = 99,
  color = 'red',
  size = 'sm',
  pulse = false,
  className = '',
}) => {
  const displayCount = count > max ? `${max}+` : count;

  const colors = {
    red: 'bg-red-500 text-white',
    blue: 'bg-blue-500 text-white',
    green: 'bg-green-500 text-white',
    yellow: 'bg-yellow-500 text-white',
    purple: 'bg-zinc-800 text-white',
  };

  const sizeClasses = {
    sm: 'min-w-[16px] h-4 text-[10px] px-1',
    md: 'min-w-[20px] h-5 text-xs px-1.5',
    lg: 'min-w-[24px] h-6 text-sm px-2',
  };

  return (
    <motion.span
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      className={`
        inline-flex items-center justify-center
        rounded-full font-bold
        ${colors[color]}
        ${sizeClasses[size]}
        ${pulse ? 'animate-pulse' : ''}
        ${className}
      `}
    >
      {displayCount}
    </motion.span>
  );
};

CountBadge.propTypes = {
  count: PropTypes.number.isRequired,
  max: PropTypes.number,
  color: PropTypes.oneOf(['red', 'blue', 'green', 'yellow', 'purple']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  pulse: PropTypes.bool,
  className: PropTypes.string,
};

// ============================================================================
// BADGE DE PROGRESO
// ============================================================================

/**
 * ProgressBadge - Badge con barra de progreso
 */
export const ProgressBadge = ({
  label,
  progress,
  color = 'blue',
  showPercentage = true,
  className = '',
}) => {
  const colors = {
    blue: {
      bg: 'bg-blue-500/20',
      bar: 'bg-blue-500',
      text: 'text-blue-400',
    },
    green: {
      bg: 'bg-green-500/20',
      bar: 'bg-green-500',
      text: 'text-green-400',
    },
    purple: {
      bg: 'bg-zinc-800/20',
      bar: 'bg-zinc-800',
      text: 'text-zinc-200',
    },
  };

  const scheme = colors[color];

  return (
    <div
      className={`
      inline-flex flex-col gap-1 px-3 py-2
      ${scheme.bg} ${scheme.text}
      border border-white/10 rounded-lg
      backdrop-blur-sm
      ${className}
    `}
    >
      <div className="flex items-center justify-between gap-2 text-xs font-medium">
        <span>{label}</span>
        {showPercentage && <span>{progress}%</span>}
      </div>
      <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
        <motion.div
          className={`h-full ${scheme.bar}`}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
};

ProgressBadge.propTypes = {
  label: PropTypes.string.isRequired,
  progress: PropTypes.number.isRequired,
  color: PropTypes.oneOf(['blue', 'green', 'purple']),
  showPercentage: PropTypes.bool,
  className: PropTypes.string,
};

export default StatusBadge;
