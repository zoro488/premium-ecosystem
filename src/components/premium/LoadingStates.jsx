/**
 * 🎬 CINEMATIC LOADING SCREEN - NIVEL AWWWARDS
 * ==============================================
 * Sistema de loading states premium con múltiples variantes
 * Incluye: partículas 3D, skeleton loaders, progress rings, y transiciones suaves
 */
import { useEffect, useState } from 'react';

import { AnimatePresence, motion } from 'framer-motion';
import PropTypes from 'prop-types';

// ============================================
// 1. LOADING SCREEN PRINCIPAL (FULL PAGE)
// ============================================

/**
 * Pantalla de carga cinematográfica con logo animado
 * @param {boolean} isLoading - Estado de carga
 * @param {string} message - Mensaje opcional de carga
 * @param {number} progress - Progreso 0-100 (opcional)
 */
export const CinematicLoadingScreen = ({ isLoading, message = 'Cargando...', progress = null }) => {
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? '' : prev + '.'));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center"
        >
          {/* Partículas de fondo */}
          <div className="absolute inset-0 overflow-hidden">
            {Array.from({ length: 50 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-cyan-400 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [0, -30, 0],
                  opacity: [0.2, 0.8, 0.2],
                  scale: [1, 1.5, 1],
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </div>

          {/* Contenido principal */}
          <div className="relative z-10 flex flex-col items-center gap-8">
            {/* Logo animado con efecto de pulso */}
            <motion.div
              animate={{
                scale: [1, 1.05, 1],
                rotate: [0, 5, 0, -5, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              <div className="relative">
                {/* Glow effect */}
                <motion.div
                  className="absolute inset-0 bg-cyan-500 rounded-full blur-3xl"
                  animate={{ opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />

                {/* Logo */}
                <div className="relative w-24 h-24 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-2xl flex items-center justify-center shadow-2xl">
                  <span className="text-4xl font-bold text-white">FD</span>
                </div>
              </div>
            </motion.div>

            {/* Mensaje de carga */}
            <div className="text-center">
              <motion.h2
                className="text-2xl font-bold text-white mb-2"
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {message}
                {dots}
              </motion.h2>

              {/* Barra de progreso (si se proporciona) */}
              {progress !== null && (
                <div className="w-64 h-2 bg-white/10 rounded-full overflow-hidden mt-4">
                  <motion.div
                    className="h-full bg-gradient-to-r from-cyan-400 to-blue-600"
                    initial={{ width: '0%' }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              )}

              {/* Spinner circular */}
              {progress === null && (
                <motion.div
                  className="w-12 h-12 border-4 border-cyan-400/20 border-t-cyan-400 rounded-full mx-auto mt-4"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                />
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

CinematicLoadingScreen.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  message: PropTypes.string,
  progress: PropTypes.number,
};

// ============================================
// 2. SKELETON LOADER PREMIUM
// ============================================

/**
 * Skeleton loader con efecto shimmer premium
 * @param {string} variant - Variante: 'card', 'table', 'text', 'avatar'
 * @param {number} count - Número de elementos a mostrar
 */
export const SkeletonLoader = ({ variant = 'card', count = 1, className = '' }) => {
  const variants = {
    card: (
      <div className={`rounded-xl bg-white/5 p-6 ${className}`}>
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-slate-700 to-slate-600 animate-pulse" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gradient-to-r from-slate-700 to-slate-600 rounded animate-pulse w-3/4" />
            <div className="h-3 bg-gradient-to-r from-slate-700 to-slate-600 rounded animate-pulse w-1/2" />
          </div>
        </div>
        <div className="space-y-3">
          <div className="h-3 bg-gradient-to-r from-slate-700 to-slate-600 rounded animate-pulse" />
          <div className="h-3 bg-gradient-to-r from-slate-700 to-slate-600 rounded animate-pulse w-5/6" />
          <div className="h-3 bg-gradient-to-r from-slate-700 to-slate-600 rounded animate-pulse w-4/6" />
        </div>
      </div>
    ),

    table: (
      <div className={`rounded-xl bg-white/5 overflow-hidden ${className}`}>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 p-4 border-b border-white/5">
            <div className="w-8 h-8 rounded bg-gradient-to-r from-slate-700 to-slate-600 animate-pulse" />
            <div className="flex-1 h-4 bg-gradient-to-r from-slate-700 to-slate-600 rounded animate-pulse" />
            <div className="w-24 h-4 bg-gradient-to-r from-slate-700 to-slate-600 rounded animate-pulse" />
            <div className="w-16 h-4 bg-gradient-to-r from-slate-700 to-slate-600 rounded animate-pulse" />
          </div>
        ))}
      </div>
    ),

    text: (
      <div className={`space-y-3 ${className}`}>
        <div className="h-4 bg-gradient-to-r from-slate-700 to-slate-600 rounded animate-pulse" />
        <div className="h-4 bg-gradient-to-r from-slate-700 to-slate-600 rounded animate-pulse w-5/6" />
        <div className="h-4 bg-gradient-to-r from-slate-700 to-slate-600 rounded animate-pulse w-4/6" />
      </div>
    ),

    avatar: (
      <div className={`flex items-center gap-4 ${className}`}>
        <div className="w-16 h-16 rounded-full bg-gradient-to-r from-slate-700 to-slate-600 animate-pulse" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gradient-to-r from-slate-700 to-slate-600 rounded animate-pulse w-3/4" />
          <div className="h-3 bg-gradient-to-r from-slate-700 to-slate-600 rounded animate-pulse w-1/2" />
        </div>
      </div>
    ),
  };

  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
        >
          {variants[variant]}
        </motion.div>
      ))}
    </div>
  );
};

SkeletonLoader.propTypes = {
  variant: PropTypes.oneOf(['card', 'table', 'text', 'avatar']),
  count: PropTypes.number,
  className: PropTypes.string,
};

// ============================================
// 3. SPINNER PREMIUM
// ============================================

/**
 * Spinner con múltiples variantes premium
 * @param {string} variant - Variante del spinner
 * @param {string} size - Tamaño: 'sm', 'md', 'lg'
 */
export const PremiumSpinner = ({ variant = 'dots', size = 'md', className = '' }) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  const variants = {
    dots: (
      <div className={`flex gap-2 ${className}`}>
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className={`${sizes[size]} bg-cyan-400 rounded-full`}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [1, 0.5, 1],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: i * 0.2,
            }}
          />
        ))}
      </div>
    ),

    ring: (
      <motion.div
        className={`${sizes[size]} border-4 border-cyan-400/20 border-t-cyan-400 rounded-full ${className}`}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      />
    ),

    pulse: (
      <motion.div
        className={`${sizes[size]} bg-gradient-to-r from-cyan-400 to-blue-600 rounded-full ${className}`}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [1, 0.5, 1],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
        }}
      />
    ),

    bars: (
      <div className={`flex gap-1 items-end ${className}`}>
        {[0, 1, 2, 3].map((i) => (
          <motion.div
            key={i}
            className={`w-2 bg-cyan-400 rounded-full`}
            animate={{
              height: ['20%', '100%', '20%'],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: i * 0.1,
            }}
          />
        ))}
      </div>
    ),
  };

  return variants[variant];
};

PremiumSpinner.propTypes = {
  variant: PropTypes.oneOf(['dots', 'ring', 'pulse', 'bars']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  className: PropTypes.string,
};

// ============================================
// 4. PROGRESS INDICATOR CIRCULAR
// ============================================

/**
 * Indicador de progreso circular premium
 * @param {number} progress - Progreso 0-100
 * @param {string} size - Tamaño en pixeles
 * @param {string} label - Etiqueta opcional
 */
export const CircularProgress = ({ progress = 0, size = 120, label = '', className = '' }) => {
  const circumference = 2 * Math.PI * 45; // radio = 45
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r="45"
          stroke="rgba(255, 255, 255, 0.1)"
          strokeWidth="8"
          fill="none"
        />

        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r="45"
          stroke="url(#gradient)"
          strokeWidth="8"
          fill="none"
          strokeLinecap="round"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          style={{
            strokeDasharray: circumference,
          }}
        />

        {/* Gradient definition */}
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#22d3ee" />
            <stop offset="100%" stopColor="#3b82f6" />
          </linearGradient>
        </defs>
      </svg>

      {/* Center text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-white">{Math.round(progress)}%</span>
        {label && <span className="text-xs text-slate-400 mt-1">{label}</span>}
      </div>
    </div>
  );
};

CircularProgress.propTypes = {
  progress: PropTypes.number.isRequired,
  size: PropTypes.number,
  label: PropTypes.string,
  className: PropTypes.string,
};

// ============================================
// 5. TRANSITION WRAPPER
// ============================================

/**
 * Wrapper para transiciones entre componentes
 * @param {ReactNode} children - Componentes hijos
 * @param {string} transitionKey - Key única para AnimatePresence
 */
export const TransitionWrapper = ({ children, transitionKey, className = '' }) => {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={transitionKey}
        initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        exit={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
        transition={{
          duration: 0.4,
          ease: [0.43, 0.13, 0.23, 0.96],
        }}
        className={className}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

TransitionWrapper.propTypes = {
  children: PropTypes.node.isRequired,
  transitionKey: PropTypes.string.isRequired,
  className: PropTypes.string,
};

// ============================================
// EXPORT ALL
// ============================================

export default {
  CinematicLoadingScreen,
  SkeletonLoader,
  PremiumSpinner,
  CircularProgress,
  TransitionWrapper,
};
