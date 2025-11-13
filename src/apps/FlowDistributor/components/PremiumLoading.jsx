import { motion } from 'framer-motion';

/**
 * ⏳ PREMIUM LOADER - Loader animado premium
 */
export const PremiumLoader = ({ size = 'md', variant = 'spinner' }) => {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24',
  };

  if (variant === 'spinner') {
    return (
      <div className="flex items-center justify-center">
        <motion.div
          className={`${sizes[size]} border-4 border-gray-700 border-t-blue-500 rounded-full`}
          animate={{ rotate: 360 }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      </div>
    );
  }

  if (variant === 'dots') {
    return (
      <div className="flex gap-2">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={`item-${i}`}
            className="w-3 h-3 bg-blue-500 rounded-full"
            animate={{
              y: [0, -10, 0],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              delay: i * 0.2,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>
    );
  }

  if (variant === 'pulse') {
    return (
      <motion.div
        className={`${sizes[size]} bg-blue-500 rounded-full`}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    );
  }

  if (variant === 'bars') {
    return (
      <div className="flex gap-1 items-end">
        {[0, 1, 2, 3, 4].map((i) => (
          <motion.div
            key={`item-${i}`}
            className="w-2 bg-blue-500 rounded-full"
            animate={{
              height: [20, 40, 20],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: i * 0.1,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>
    );
  }

  return null;
};

/**
 * 💀 SKELETON - Skeleton screen animado
 */
export const Skeleton = ({
  width = '100%',
  height = '20px',
  className = '',
  variant = 'default',
}) => {
  const variants = {
    default: 'bg-gray-700/50',
    card: 'bg-gray-800/50',
    text: 'bg-gray-700/30',
  };

  return (
    <div
      className={`${variants[variant]} rounded-lg overflow-hidden ${className}`}
      style={{ width, height }}
    >
      <motion.div
        className="w-full h-full bg-gradient-to-r from-transparent via-white/5 to-transparent"
        animate={{
          x: ['-100%', '100%'],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
    </div>
  );
};

/**
 * 📊 SKELETON CARD - Card skeleton completo
 */
export const SkeletonCard = ({ showImage = false, lines = 3 }) => {
  return (
    <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/50">
      {showImage && <Skeleton width="100%" height="200px" className="mb-4" variant="card" />}

      <Skeleton width="60%" height="24px" className="mb-4" variant="text" />

      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={`item-${i}`}
          width={i === lines - 1 ? '80%' : '100%'}
          height="16px"
          className="mb-2"
          variant="text"
        />
      ))}
    </div>
  );
};

/**
 * 📋 SKELETON TABLE - Tabla skeleton
 */
export const SkeletonTable = ({ rows = 5, columns = 4 }) => {
  return (
    <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/50">
      {/* Header */}
      <div className="grid gap-4 mb-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={`item-${i}`} width="100%" height="20px" variant="text" />
        ))}
      </div>

      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div
          key={rowIndex}
          className="grid gap-4 mb-3"
          style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
        >
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton key={colIndex} width="100%" height="16px" variant="text" />
          ))}
        </div>
      ))}
    </div>
  );
};

/**
 * 📈 SKELETON CHART - Gráfico skeleton
 */
export const SkeletonChart = ({ type = 'line' }) => {
  if (type === 'line') {
    return (
      <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/50 h-64 flex items-end gap-2">
        {Array.from({ length: 12 }).map((_, i) => (
          <motion.div
            key={`item-${i}`}
            className="flex-1 bg-blue-500/20 rounded-t"
            style={{ height: `${Math.random() * 100}%` }}
            animate={{
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: i * 0.1,
            }}
          />
        ))}
      </div>
    );
  }

  if (type === 'pie') {
    return (
      <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/50 h-64 flex items-center justify-center">
        <motion.div
          className="w-40 h-40 rounded-full border-8 border-gray-700/50 border-t-blue-500/50"
          animate={{ rotate: 360 }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      </div>
    );
  }

  return null;
};

/**
 * 🎯 LOADING OVERLAY - Overlay de carga
 */
export const LoadingOverlay = ({ message = 'Cargando...', fullScreen = false }) => {
  return (
    <motion.div
      className={`
        ${fullScreen ? 'fixed' : 'absolute'}
        inset-0
        bg-black/60 backdrop-blur-sm
        flex items-center justify-center
        z-50
      `}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-gray-800/95 backdrop-blur-xl rounded-2xl p-8 border border-gray-700/50"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      >
        <div className="flex flex-col items-center gap-4">
          <PremiumLoader size="lg" variant="spinner" />
          <motion.p
            className="text-white text-lg font-medium"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            {message}
          </motion.p>
        </div>
      </motion.div>
    </motion.div>
  );
};

/**
 * 🌀 PROGRESS BAR - Barra de progreso animada
 */
export const ProgressBar = ({ progress = 0, showPercentage = true, variant = 'default' }) => {
  const variants = {
    default: 'bg-blue-500',
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    danger: 'bg-red-500',
  };

  return (
    <div className="w-full">
      <div className="w-full bg-gray-700/50 rounded-full h-2 overflow-hidden">
        <motion.div
          className={`h-2 ${variants[variant]} rounded-full`}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>
      {showPercentage && (
        <motion.p
          className="text-sm text-gray-400 mt-2 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {progress}%
        </motion.p>
      )}
    </div>
  );
};

/**
 * 🎪 SHIMMER EFFECT - Efecto shimmer en contenido
 */
export const ShimmerEffect = ({ children, className = '' }) => {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      {children}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
        animate={{
          x: ['-100%', '100%'],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
    </div>
  );
};

export default {
  PremiumLoader,
  Skeleton,
  SkeletonCard,
  SkeletonTable,
  SkeletonChart,
  LoadingOverlay,
  ProgressBar,
  ShimmerEffect,
};
