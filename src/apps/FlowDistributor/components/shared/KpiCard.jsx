/**
 * 💎 KpiCard - Premium Animated KPI Card Component
 *
 * Componente de tarjeta KPI con:
 * - Animaciones fluidas y suaves (Framer Motion)
 * - Efectos liquid/glass morphism
 * - Gradientes elegantes
 * - Counters animados
 * - Iconos interactivos
 * - Micro-interacciones
 */
import React from 'react';

import { motion } from 'framer-motion';

import { counterVariants, kpiCardVariants } from '../animations/premiumAnimations';
import { useAnimatedCurrency, useAnimatedNumber } from '../hooks/useAnimatedCounter';

/**
 * KpiCard Component
 *
 * @param {Object} props
 * @param {string} props.title - Título del KPI
 * @param {number} props.value - Valor numérico
 * @param {string} props.format - 'currency' | 'number' | 'percentage' | 'custom'
 * @param {string} props.currency - Código de moneda (USD, MXN)
 * @param {number} props.decimals - Decimales a mostrar
 * @param {string} props.subtitle - Subtítulo/descripción
 * @param {string} props.trend - 'up' | 'down' | 'neutral'
 * @param {number} props.trendValue - Valor del cambio
 * @param {React.Component} props.icon - Icono
 * @param {string} props.gradient - Clases de gradiente
 * @param {string} props.glowColor - Color del glow effect
 * @param {boolean} props.animated - Habilitar animación (default: true)
 * @param {Function} props.onClick - Handler de click
 */
export const KpiCard = ({
  title,
  value,
  format = 'number',
  currency = 'USD',
  decimals = 2,
  subtitle,
  trend,
  trendValue,
  icon: Icon,
  gradient = 'from-zinc-800 to-indigo-600',
  glowColor = 'shadow-blue-500/50',
  animated = true,
  onClick,
}) => {
  // Llamar todos los hooks incondicionalmente
  const animatedCurrency = useAnimatedCurrency(value, {
    currency,
    decimals,
    duration: 2000,
    easing: 'easeOutCubic',
  });

  const animatedNumber = useAnimatedNumber(value, {
    decimals,
    duration: 2000,
  });

  // Formatear valor según tipo
  let displayValue;
  if (format === 'currency') {
    displayValue = animatedCurrency;
  } else if (format === 'percentage') {
    displayValue = `${animatedNumber}%`;
  } else {
    displayValue = animatedNumber;
  }

  // Determinar icono y color de trend
  const getTrendIcon = () => {
    if (trend === 'up')
      return (
        <motion.svg
          className="w-5 h-5 text-zinc-100"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          initial={{ y: 2, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, type: 'spring' }}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
          />
        </motion.svg>
      );
    if (trend === 'down')
      return (
        <motion.svg
          className="w-5 h-5 text-zinc-100"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          initial={{ y: -2, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, type: 'spring' }}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 17h8m0 0v-8m0 8l-8-8-4 4-6-6"
          />
        </motion.svg>
      );
    return null;
  };

  return (
    <motion.div
      variants={animated ? kpiCardVariants : {}}
      initial="hidden"
      animate="show"
      whileHover="hover"
      whileTap="tap"
      className={`
        relative overflow-hidden rounded-2xl p-6
        bg-gradient-to-br ${gradient}
        shadow-xl ${glowColor}
        backdrop-blur-xl
        border border-white/10
        ${onClick ? 'cursor-pointer' : ''}
      `}
      onClick={onClick}
      style={{
        transformStyle: 'preserve-3d',
      }}
    >
      {/* Efecto de brillo animado */}
      <motion.div
        className="absolute inset-0 opacity-20"
        initial={{ x: '-100%', y: '-100%' }}
        animate={{
          x: '100%',
          y: '100%',
        }}
        transition={{
          repeat: Infinity,
          duration: 3,
          ease: 'linear',
          repeatDelay: 2,
        }}
        style={{
          background:
            'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.3) 50%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* Header con icono */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <motion.h3
            className="text-white/90 text-sm font-medium uppercase tracking-wide"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            {title}
          </motion.h3>
        </div>
        {Icon && (
          <motion.div
            className="p-3 bg-white/10 rounded-xl backdrop-blur-sm"
            whileHover={{
              scale: 1.1,
              rotate: 5,
              backgroundColor: 'rgba(255,255,255,0.2)',
            }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 15 }}
          >
            <Icon className="w-6 h-6 text-white" />
          </motion.div>
        )}
      </div>

      {/* Valor principal animado */}
      <motion.div className="mb-2" variants={counterVariants} initial="hidden" animate="show">
        <div className="text-4xl font-bold text-white tracking-tight">{displayValue}</div>
      </motion.div>

      {/* Subtítulo */}
      {subtitle && (
        <motion.p
          className="text-white/70 text-sm mb-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {subtitle}
        </motion.p>
      )}

      {/* Trend indicator */}
      {trend && (
        <motion.div
          className="flex items-center gap-2"
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          {getTrendIcon()}
          {trendValue !== undefined && (
            <span
              className={`text-sm font-medium ${
                trend === 'up'
                  ? 'text-zinc-100'
                  : trend === 'down'
                    ? 'text-zinc-100'
                    : 'text-gray-300'
              }`}
            >
              {trend === 'up' ? '+' : ''}
              {trendValue}
              {format === 'percentage' ? '%' : ''}
            </span>
          )}
        </motion.div>
      )}

      {/* Decorative corner accent */}
      <motion.div
        className="absolute -bottom-6 -right-6 w-32 h-32 rounded-full bg-white/5"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.6, type: 'spring' }}
      />
    </motion.div>
  );
};

/**
 * KpiCardMini - Versión compacta del KPI Card
 */
export const KpiCardMini = ({ label, value, format = 'number', icon: Icon, color = 'blue' }) => {
  const colorVariants = {
    blue: 'from-zinc-800/20 to-indigo-500/20 border-zinc-700/30',
    green: 'from-green-500/20 to-emerald-500/20 border-zinc-500/30',
    purple: 'from-zinc-800/20 to-zinc-800/20 border-zinc-800/30',
    amber: 'from-amber-500/20 to-orange-500/20 border-zinc-500/30',
    red: 'from-zinc-700/20 to-zinc-700/20 border-zinc-500/30',
  };

  return (
    <motion.div
      className={`
        flex items-center gap-3 p-4 rounded-xl
        bg-gradient-to-r ${colorVariants[color]}
        border backdrop-blur-sm
      `}
      whileHover={{ scale: 1.02, y: -2 }}
      transition={{ type: 'spring', stiffness: 400 }}
    >
      {Icon && (
        <div className="p-2 bg-white/10 rounded-lg">
          <Icon className="w-5 h-5 text-white" />
        </div>
      )}
      <div>
        <div className="text-white/70 text-xs font-medium uppercase">{label}</div>
        <div className="text-white text-xl font-bold">{value}</div>
      </div>
    </motion.div>
  );
};

/**
 * KpiCardSkeleton - Loading state
 */
export const KpiCardSkeleton = () => {
  return (
    <div className="rounded-2xl p-6 bg-gray-800/50 animate-pulse">
      <div className="flex items-start justify-between mb-4">
        <div className="h-4 w-24 bg-gray-700 rounded" />
        <div className="w-12 h-12 bg-gray-700 rounded-xl" />
      </div>
      <div className="h-10 w-32 bg-gray-700 rounded mb-2" />
      <div className="h-4 w-40 bg-gray-700 rounded" />
    </div>
  );
};

export default KpiCard;
