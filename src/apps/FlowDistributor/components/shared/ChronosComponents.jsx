import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';

/**
 * 🎯 CHRONOS BADGE - Badge con variantes y animaciones
 */
export const ChronosBadge = ({
  children,
  variant = 'default', // default, success, warning, danger, info
  size = 'md',
  pulse = false,
  className = ''
}) => {
  const variants = {
    default: 'bg-white/10 text-white border-white/20',
    success: 'bg-green-500/20 text-green-400 border-green-500/30',
    warning: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    danger: 'bg-red-500/20 text-red-400 border-red-500/30',
    info: 'bg-blue-500/20 text-blue-400 border-blue-500/30'
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-[10px]',
    md: 'px-2.5 py-1 text-xs',
    lg: 'px-3 py-1.5 text-sm'
  };

  return (
    <motion.span
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      className={`
        inline-flex items-center gap-1 border rounded-full
        font-light tracking-wide
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
    >
      {pulse && (
        <motion.span
          animate={{ scale: [1, 1.2, 1], opacity: [1, 0.5, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-1.5 h-1.5 rounded-full bg-current"
        />
      )}
      {children}
    </motion.span>
  );
};

/**
 * 🎯 CHRONOS TABS - Tabs premium con animaciones
 */
export const ChronosTabs = ({ tabs, activeTab, onChange, className = '' }) => {
  return (
    <div className={`flex items-center gap-2 border-b border-white/10 ${className}`}>
      {tabs.map((tab, index) => {
        const isActive = activeTab === tab.id;
        return (
          <motion.button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="relative px-6 py-3 text-sm font-light tracking-wide transition-colors"
            style={{
              color: isActive ? 'white' : 'rgba(255,255,255,0.5)'
            }}
          >
            {tab.label}

            {/* Active indicator */}
            {isActive && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-white"
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            )}

            {/* Badge */}
            {tab.badge && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-[10px] font-bold"
              >
                {tab.badge}
              </motion.span>
            )}
          </motion.button>
        );
      })}
    </div>
  );
};

/**
 * 🎯 CHRONOS PROGRESS - Barra de progreso premium
 */
export const ChronosProgress = ({
  value,
  max = 100,
  label,
  showValue = true,
  color = 'rgba(255,255,255,0.9)',
  height = 8
}) => {
  const percentage = Math.min((value / max) * 100, 100);

  return (
    <div>
      {/* Label y Value */}
      {(label || showValue) && (
        <div className="flex items-center justify-between mb-2">
          {label && (
            <span className="text-xs text-white/60">
              {label}
            </span>
          )}
          {showValue && (
            <span className="text-xs text-white font-light">
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      )}

      {/* Progress bar */}
      <div
        className="relative w-full bg-white/10 rounded-full overflow-hidden"
        style={{ height }}
      >
        {/* Fill */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="h-full rounded-full relative"
          style={{
            background: `linear-gradient(90deg, ${color}, ${color}DD)`
          }}
        >
          {/* Shine effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            animate={{
              x: ['-100%', '200%']
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              repeatDelay: 1,
              ease: 'linear'
            }}
          />
        </motion.div>
      </div>
    </div>
  );
};

ChronosProgress.propTypes = {
  value: PropTypes.number.isRequired,
  max: PropTypes.number,
  label: PropTypes.string,
  showValue: PropTypes.bool,
  color: PropTypes.string,
  height: PropTypes.number
};

/**
 * 🎯 CHRONOS TOOLTIP - Tooltip premium con animaciones
 */
export const ChronosTooltip = ({ children, content, position = 'top' }) => {
  const [show, setShow] = React.useState(false);

  // Helper para calcular la posición del arrow
  const getArrowPosition = (position) => {
    const positionMap = {
      top: 'bottom',
      bottom: 'top',
      left: 'right',
      right: 'left'
    };
    return positionMap[position] || 'left';
  };

  // Helper para el border del arrow
  const getArrowBorder = (position) => {
    const borderMap = {
      top: '0 1px 1px 0',
      bottom: '1px 0 0 1px',
      left: '1px 1px 0 0',
      right: '0 0 1px 1px'
    };
    return borderMap[position] || '0 0 1px 1px';
  };

  const positions = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2'
  };

  return (
    <div
      className="relative inline-block"
      role="tooltip"
      aria-label={typeof content === 'string' ? content : 'tooltip'}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
      onFocus={() => setShow(true)}
      onBlur={() => setShow(false)}
    >
      {children}

      {show && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className={`
            absolute z-50 px-3 py-2 text-xs text-white
            bg-black/90 backdrop-blur-xl border border-white/20
            rounded-sm whitespace-nowrap
            ${positions[position]}
          `}
          style={{
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
          }}
        >
          {content}

          {/* Arrow */}
          <div
            className="absolute w-2 h-2 bg-black/90 border-white/20 rotate-45"
            style={{
              [getArrowPosition(position)]: '-4px',
              left: position === 'top' || position === 'bottom' ? '50%' : undefined,
              top: position === 'left' || position === 'right' ? '50%' : undefined,
              transform: position === 'top' || position === 'bottom'
                ? 'translateX(-50%)'
                : 'translateY(-50%)',
              borderWidth: getArrowBorder(position)
            }}
          />
        </motion.div>
      )}
    </div>
  );
};

// PropTypes
ChronosBadge.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['default', 'success', 'warning', 'danger', 'info']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  pulse: PropTypes.bool,
  className: PropTypes.string
};

ChronosTabs.propTypes = {
  tabs: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    icon: PropTypes.elementType
  })).isRequired,
  activeTab: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  className: PropTypes.string
};

ChronosProgressBar.propTypes = {
  value: PropTypes.number.isRequired,
  max: PropTypes.number,
  label: PropTypes.string,
  showValue: PropTypes.bool,
  color: PropTypes.string,
  height: PropTypes.number
};

ChronosTooltip.propTypes = {
  children: PropTypes.node.isRequired,
  content: PropTypes.node.isRequired,
  position: PropTypes.oneOf(['top', 'bottom', 'left', 'right'])
};

export default ChronosBadge;
