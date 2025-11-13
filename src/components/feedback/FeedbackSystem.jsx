/**
 * 🎉 SISTEMA DE FEEDBACK VISUAL PREMIUM
 * Toasts, confetti, notificaciones y estados de carga mejorados
 */
import { useEffect, useState } from 'react';
import Confetti from 'react-confetti';

import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, AlertTriangle, CheckCircle, Info, X } from 'lucide-react';

/**
 * 🍞 TOAST PREMIUM - Notificaciones toast con physics
 */
export const Toast = ({
  message,
  type = 'info',
  duration = 3000,
  onClose,
  position = 'top-right',
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => onClose?.(), 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const types = {
    success: {
      bg: 'bg-gradient-to-r from-green-500/90 to-emerald-500/90',
      icon: CheckCircle,
      color: 'text-white',
      shadow: 'shadow-green-500/30',
    },
    error: {
      bg: 'bg-gradient-to-r from-red-500/90 to-rose-500/90',
      icon: AlertCircle,
      color: 'text-white',
      shadow: 'shadow-red-500/30',
    },
    warning: {
      bg: 'bg-gradient-to-r from-yellow-500/90 to-orange-500/90',
      icon: AlertTriangle,
      color: 'text-white',
      shadow: 'shadow-yellow-500/30',
    },
    info: {
      bg: 'bg-gradient-to-r from-blue-500/90 to-cyan-500/90',
      icon: Info,
      color: 'text-white',
      shadow: 'shadow-blue-500/30',
    },
  };

  const config = types[type] || types.info;
  const Icon = config.icon;

  const positions = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-center': 'top-4 left-1/2 -translate-x-1/2',
    'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2',
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className={`fixed ${positions[position]} z-50`}
          initial={{ opacity: 0, y: -50, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.8 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        >
          <motion.div
            className={`
              ${config.bg} ${config.shadow}
              backdrop-blur-xl rounded-2xl shadow-2xl
              px-6 py-4 min-w-[300px] max-w-md
              flex items-center gap-4
            `}
            whileHover={{ scale: 1.02 }}
            drag
            dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
            dragElastic={0.1}
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
            >
              <Icon className={config.color} size={24} />
            </motion.div>

            <p className={`flex-1 font-medium ${config.color}`}>{message}</p>

            <motion.button
              onClick={() => {
                setIsVisible(false);
                setTimeout(() => onClose?.(), 300);
              }}
              className={`${config.color} hover:opacity-70 transition-opacity`}
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
            >
              <X size={20} />
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

/**
 * 🎊 CONFETTI CELEBRATION - Confetti para celebraciones
 */
export const ConfettiCelebration = ({ trigger = false, duration = 3000, recycle = false }) => {
  const [isActive, setIsActive] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    setDimensions({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  }, []);

  useEffect(() => {
    if (trigger) {
      setIsActive(true);
      if (!recycle) {
        setTimeout(() => setIsActive(false), duration);
      }
    }
  }, [trigger, duration, recycle]);

  if (!isActive) return null;

  return (
    <Confetti
      width={dimensions.width}
      height={dimensions.height}
      recycle={recycle}
      numberOfPieces={200}
      gravity={0.3}
      colors={['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#ec4899']}
    />
  );
};

/**
 * ⭕ CIRCULAR PROGRESS - Indicador circular de progreso
 */
export const CircularProgress = ({
  value = 0,
  max = 100,
  size = 120,
  strokeWidth = 8,
  color = '#3b82f6',
  showValue = true,
  label = '',
}) => {
  const percentage = (value / max) * 100;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(107, 114, 128, 0.2)"
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {showValue && (
          <motion.span
            className="text-2xl font-bold"
            style={{ color }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, type: 'spring' }}
          >
            {Math.round(percentage)}%
          </motion.span>
        )}
        {label && <span className="text-xs text-gray-400 mt-1">{label}</span>}
      </div>
    </div>
  );
};

/**
 * 🌈 SKELETON SHIMMER - Skeleton con efecto shimmer mejorado
 */
export const SkeletonShimmer = ({
  width = '100%',
  height = '20px',
  borderRadius = '8px',
  className = '',
}) => {
  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{
        width,
        height,
        borderRadius,
        backgroundColor: 'rgba(107, 114, 128, 0.1)',
      }}
    >
      <motion.div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%)',
        }}
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
 * 📊 PROGRESS STEPS - Indicador de pasos con progreso
 */
export const ProgressSteps = ({ steps = [], currentStep = 0 }) => {
  return (
    <div className="flex items-center justify-between w-full">
      {steps.map((step, index) => {
        const isCompleted = index < currentStep;
        const isCurrent = index === currentStep;
        const _isUpcoming = index > currentStep;

        return (
          <div key={index} className="flex items-center flex-1">
            {/* Step Circle */}
            <div className="relative flex flex-col items-center">
              <motion.div
                className={`
                  w-10 h-10 rounded-full flex items-center justify-center
                  font-semibold border-2 transition-all
                  ${
                    isCompleted
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500 border-green-500 text-white'
                      : isCurrent
                        ? 'bg-gradient-to-r from-blue-500 to-cyan-500 border-blue-500 text-white'
                        : 'bg-gray-800/50 border-gray-600 text-gray-500'
                  }
                `}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.1, type: 'spring', stiffness: 200 }}
                whileHover={{ scale: 1.1 }}
              >
                {isCompleted ? (
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                  >
                    <CheckCircle size={20} />
                  </motion.div>
                ) : (
                  index + 1
                )}
              </motion.div>

              <motion.p
                className={`
                  absolute -bottom-6 text-xs whitespace-nowrap
                  ${isCurrent ? 'text-blue-400 font-semibold' : 'text-gray-500'}
                `}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.2 }}
              >
                {step}
              </motion.p>
            </div>

            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div className="flex-1 h-0.5 mx-2 bg-gray-700 relative overflow-hidden">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: isCompleted ? 1 : 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  style={{ transformOrigin: 'left' }}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

/**
 * 🔄 LOADING SPINNER - Spinner personalizado premium
 */
export const LoadingSpinner = ({ size = 40, color = '#3b82f6', variant = 'circle' }) => {
  if (variant === 'circle') {
    return (
      <motion.div
        className="border-4 border-gray-700 border-t-transparent rounded-full"
        style={{ width: size, height: size, borderTopColor: color }}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      />
    );
  }

  if (variant === 'dots') {
    return (
      <div className="flex gap-2">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="rounded-full"
            style={{
              width: size / 4,
              height: size / 4,
              backgroundColor: color,
            }}
            animate={{
              y: [0, -size / 3, 0],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              delay: i * 0.15,
            }}
          />
        ))}
      </div>
    );
  }

  if (variant === 'pulse') {
    return (
      <motion.div
        className="rounded-full"
        style={{
          width: size,
          height: size,
          backgroundColor: color,
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
        }}
      />
    );
  }

  return null;
};

/**
 * 📢 NOTIFICATION BADGE - Badge de notificación animado
 */
export const NotificationBadge = ({ count = 0, max = 99, pulse = true }) => {
  const displayCount = count > max ? `${max}+` : count;

  if (count === 0) return null;

  return (
    <motion.div
      className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-rose-500 text-white text-xs font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1.5 shadow-lg"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
    >
      {pulse && (
        <motion.div
          className="absolute inset-0 bg-red-500 rounded-full"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.7, 0, 0.7],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
        />
      )}
      <span className="relative z-10">{displayCount}</span>
    </motion.div>
  );
};

export default {
  Toast,
  ConfettiCelebration,
  CircularProgress,
  SkeletonShimmer,
  ProgressSteps,
  LoadingSpinner,
  NotificationBadge,
};
