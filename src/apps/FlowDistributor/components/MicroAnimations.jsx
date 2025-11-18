/**
 * 🎨 MICRO ANIMATIONS SYSTEM
 * Sistema global de microanimaciones, hover effects y transitions
 */
import { motion } from 'framer-motion';

/**
 * Button Premium con animaciones avanzadas
 */
export const AnimatedButton = ({
  children,
  variant = 'primary',
  onClick,
  className = '',
  ...props
}) => {
  const variants = {
    primary: 'bg-gradient-to-r from-zinc-800 to-zinc-900 hover:from-zinc-700 hover:to-zinc-800',
    secondary: 'bg-gradient-to-r from-zinc-800 to-zinc-700 hover:from-zinc-800 hover:to-zinc-700',
    success:
      'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700',
    danger: 'bg-gradient-to-r from-zinc-700 to-zinc-700 hover:from-zinc-700 hover:to-zinc-700',
    ghost: 'bg-white/5 hover:bg-white/10 border border-white/20',
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`
        px-6 py-3 rounded-xl font-medium text-white
        shadow-lg transition-all duration-300
        ${variants[variant]}
        ${className}
      `}
      {...props}
    >
      <motion.span
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-center gap-2"
      >
        {children}
      </motion.span>

      {/* Shine effect */}
      <motion.div
        className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/20 to-transparent"
        initial={{ x: '-100%' }}
        whileHover={{ x: '200%' }}
        transition={{ duration: 0.6 }}
      />
    </motion.button>
  );
};

/**
 * Card Premium con efectos 3D
 */
export const AnimatedCard = ({
  children,
  className = '',
  gradient = 'from-zinc-800/10 to-zinc-800/10',
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{
        scale: 1.02,
        y: -5,
        rotateX: 5,
        rotateY: 5,
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className={`
        relative overflow-hidden rounded-2xl
        backdrop-blur-xl bg-white/5 border border-white/10
        shadow-2xl
        ${className}
      `}
      style={{ transformStyle: 'preserve-3d' }}
    >
      {/* Gradient overlay */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-500`}
      />

      {/* Content */}
      <div className="relative z-10">{children}</div>

      {/* Glow effect */}
      <motion.div
        className={`absolute inset-0 bg-gradient-to-br ${gradient} blur-2xl opacity-0`}
        whileHover={{ opacity: 0.3 }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  );
};

/**
 * Badge animado con pulse
 */
export const AnimatedBadge = ({ children, color = 'blue', pulse = false }) => {
  const colors = {
    blue: 'from-zinc-800 to-zinc-900',
    green: 'from-green-500 to-emerald-600',
    purple: 'from-zinc-800 to-zinc-700',
    red: 'from-zinc-700 to-zinc-700',
    orange: 'from-orange-500 to-amber-600',
  };

  return (
    <motion.span
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.1 }}
      className={`
        inline-flex items-center gap-2 px-3 py-1 rounded-full
        bg-gradient-to-r ${colors[color]}
        text-white text-xs font-bold shadow-lg
      `}
    >
      {pulse && (
        <motion.span
          className="w-2 h-2 rounded-full bg-white"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [1, 0.5, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      )}
      {children}
    </motion.span>
  );
};

/**
 * Input Premium con animaciones
 */
export const AnimatedInput = ({ placeholder, value, onChange, icon: Icon, ...props }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="relative"
    >
      {Icon && (
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
          <Icon className="w-5 h-5 text-white/40" />
        </div>
      )}

      <motion.input
        whileFocus={{ scale: 1.02 }}
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`
          w-full px-4 py-3 rounded-xl
          bg-white/5 border border-white/10
          text-white placeholder-white/40
          focus:outline-none focus:ring-2 focus:ring-cyan-500/50
          focus:border-zinc-500/50
          transition-all duration-300
          ${Icon ? 'pl-12' : ''}
        `}
        {...props}
      />

      {/* Underline effect */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-zinc-800 to-zinc-900"
        initial={{ scaleX: 0 }}
        whileHover={{ scaleX: 1 }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  );
};

/**
 * Skeleton Loader animado
 */
export const AnimatedSkeleton = ({ width = '100%', height = '20px', className = '' }) => {
  return (
    <motion.div
      className={`relative overflow-hidden rounded-lg bg-white/5 ${className}`}
      style={{ width, height }}
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
        animate={{
          x: ['-100%', '200%'],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
    </motion.div>
  );
};

/**
 * Progress Bar animado
 */
export const AnimatedProgressBar = ({
  progress = 0,
  color = 'blue',
  label,
  showPercentage = true,
}) => {
  const colors = {
    blue: 'from-zinc-800 to-zinc-900',
    green: 'from-green-500 to-emerald-600',
    purple: 'from-zinc-800 to-zinc-700',
    orange: 'from-orange-500 to-amber-600',
  };

  return (
    <div className="space-y-2">
      {(label || showPercentage) && (
        <div className="flex items-center justify-between text-sm">
          {label && <span className="text-white/80">{label}</span>}
          {showPercentage && (
            <motion.span
              className="text-white/60 font-bold"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {Math.round(progress)}%
            </motion.span>
          )}
        </div>
      )}

      <div className="relative h-3 bg-white/5 rounded-full overflow-hidden">
        <motion.div
          className={`h-full bg-gradient-to-r ${colors[color]} rounded-full relative overflow-hidden`}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
        >
          {/* Shine effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            animate={{
              x: ['-100%', '200%'],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        </motion.div>
      </div>
    </div>
  );
};

/**
 * Toggle Switch Premium
 */
export const AnimatedToggle = ({ checked, onChange, label }) => {
  return (
    <div className="flex items-center gap-3">
      {label && <span className="text-white/80 text-sm">{label}</span>}

      <motion.button
        onClick={() => onChange(!checked)}
        className={`
          relative w-14 h-7 rounded-full
          transition-colors duration-300
          ${checked ? 'bg-gradient-to-r from-green-500 to-emerald-600' : 'bg-white/10'}
        `}
        whileTap={{ scale: 0.95 }}
      >
        <motion.div
          className="absolute top-1 w-5 h-5 bg-white rounded-full shadow-lg"
          animate={{
            x: checked ? 32 : 4,
          }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
      </motion.button>
    </div>
  );
};

/**
 * Notification Toast Premium
 */
export const AnimatedToast = ({ message, type = 'info', onClose }) => {
  const types = {
    success: { gradient: 'from-green-500 to-emerald-600', icon: '✓' },
    error: { gradient: 'from-zinc-700 to-zinc-700', icon: '✕' },
    warning: { gradient: 'from-orange-500 to-amber-600', icon: '⚠' },
    info: { gradient: 'from-zinc-800 to-zinc-900', icon: 'ℹ' },
  };

  const config = types[type];

  return (
    <motion.div
      initial={{ opacity: 0, y: -50, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -50, scale: 0.8 }}
      className={`
        relative overflow-hidden rounded-xl
        backdrop-blur-xl bg-gradient-to-r ${config.gradient}
        shadow-2xl px-6 py-4
        max-w-md
      `}
    >
      <div className="flex items-center gap-4">
        <motion.div
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{ duration: 0.5 }}
          className="text-2xl"
        >
          {config.icon}
        </motion.div>

        <p className="text-white font-medium flex-1">{message}</p>

        {onClose && (
          <motion.button
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="text-white/80 hover:text-white"
          >
            ✕
          </motion.button>
        )}
      </div>

      {/* Progress bar */}
      <motion.div
        className="absolute bottom-0 left-0 h-1 bg-white/30"
        initial={{ width: '100%' }}
        animate={{ width: 0 }}
        transition={{ duration: 5, ease: 'linear' }}
      />
    </motion.div>
  );
};

/**
 * Floating Action Button
 */
export const FloatingActionButton = ({
  icon: Icon,
  onClick,
  position = 'bottom-right',
  color = 'blue',
}) => {
  const positions = {
    'bottom-right': 'bottom-6 right-6',
    'bottom-left': 'bottom-6 left-6',
    'top-right': 'top-6 right-6',
    'top-left': 'top-6 left-6',
  };

  const colors = {
    blue: 'from-zinc-800 to-zinc-900',
    purple: 'from-zinc-800 to-zinc-700',
    green: 'from-green-500 to-emerald-600',
  };

  return (
    <motion.button
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.1, rotate: 90 }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      className={`
        fixed ${positions[position]} z-50
        w-16 h-16 rounded-full
        bg-gradient-to-r ${colors[color]}
        shadow-2xl flex items-center justify-center
        text-white
      `}
    >
      <Icon className="w-6 h-6" />

      {/* Ripple effect */}
      <motion.div
        className={`absolute inset-0 rounded-full bg-gradient-to-r ${colors[color]} opacity-50`}
        animate={{
          scale: [1, 1.5, 1],
          opacity: [0.5, 0, 0.5],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeOut',
        }}
      />
    </motion.button>
  );
};

export default {
  AnimatedButton,
  AnimatedCard,
  AnimatedBadge,
  AnimatedInput,
  AnimatedSkeleton,
  AnimatedProgressBar,
  AnimatedToggle,
  AnimatedToast,
  FloatingActionButton,
};
