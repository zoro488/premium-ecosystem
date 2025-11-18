/**
 * 🎬 COUNTING ANIMATIONS
 * Componentes de animación para conteo y crecimiento de métricas
 */
import { useEffect, useState } from 'react';

import { animate, motion, useMotionValue } from 'framer-motion';

/**
 * Componente de animación de conteo con efectos cinematográficos
 */
export const CountUpAnimation = ({
  from = 0,
  to,
  duration = 2,
  delay = 0,
  decimals = 0,
  prefix = '',
  suffix = '',
  className = '',
  onComplete = null,
}) => {
  const [displayValue, setDisplayValue] = useState(from);
  const motionValue = useMotionValue(from);

  useEffect(() => {
    const controls = animate(motionValue, to, {
      duration,
      delay,
      ease: 'easeOut',
      onUpdate: (value) => {
        setDisplayValue(value);
      },
      onComplete: () => {
        if (onComplete) onComplete();
      },
    });

    return controls.stop;
  }, [motionValue, to, duration, delay, onComplete]);

  const formatValue = (value) => {
    const formatted = decimals > 0 ? value.toFixed(decimals) : Math.round(value).toLocaleString();
    return `${prefix}${formatted}${suffix}`;
  };

  return (
    <motion.span
      className={`font-bold ${className}`}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay }}
    >
      {formatValue(displayValue)}
    </motion.span>
  );
};

/**
 * Componente de animación de crecimiento con indicadores visuales
 */
export const GrowthAnimation = ({
  value,
  previousValue = 0,
  duration = 1.5,
  showPercentage = true,
  showIcon = true,
  className = '',
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const difference = value - previousValue;
  const percentage = previousValue !== 0 ? (difference / previousValue) * 100 : 0;
  const isPositive = difference >= 0;

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const getIcon = () => {
    if (!showIcon) return null;
    return isPositive ? '📈' : '📉';
  };

  const getColor = () => {
    return isPositive ? 'text-green-400' : 'text-red-400';
  };

  const formatPercentage = () => {
    const sign = isPositive ? '+' : '';
    return `${sign}${percentage.toFixed(1)}%`;
  };

  return (
    <motion.div
      className={`flex items-center space-x-2 ${className}`}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: isVisible ? 1 : 0, x: isVisible ? 0 : -20 }}
      transition={{ duration: 0.5 }}
    >
      {/* Valor principal */}
      <CountUpAnimation
        from={previousValue}
        to={value}
        duration={duration}
        className={`text-white ${className}`}
      />

      {/* Indicador de crecimiento */}
      <motion.div
        className={`flex items-center space-x-1 ${getColor()}`}
        initial={{ scale: 0 }}
        animate={{ scale: isVisible ? 1 : 0 }}
        transition={{ duration: 0.3, delay: 0.5 }}
      >
        {getIcon() && <span className="text-sm">{getIcon()}</span>}
        {showPercentage && <span className="text-sm font-semibold">{formatPercentage()}</span>}
      </motion.div>

      {/* Barra de progreso animada */}
      <div className="w-12 h-1 bg-white/10 rounded-full overflow-hidden">
        <motion.div
          className={`h-full ${isPositive ? 'bg-green-400' : 'bg-red-400'}`}
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(Math.abs(percentage), 100)}%` }}
          transition={{ duration: duration, delay: 0.5 }}
        />
      </div>
    </motion.div>
  );
};

/**
 * Componente de métricas animadas para dashboards
 */
export const MetricCard = ({
  title,
  value,
  previousValue = 0,
  prefix = '',
  suffix = '',
  decimals = 0,
  icon = '📊',
  color = 'blue',
  showGrowth = true,
  className = '',
}) => {
  const colorMap = {
    blue: 'border-blue-500/30 bg-blue-900/20',
    green: 'border-green-500/30 bg-green-900/20',
    red: 'border-red-500/30 bg-red-900/20',
    yellow: 'border-yellow-500/30 bg-yellow-900/20',
    purple: 'border-purple-500/30 bg-purple-900/20',
    orange: 'border-orange-500/30 bg-orange-900/20',
  };

  const textColorMap = {
    blue: 'text-blue-400',
    green: 'text-green-400',
    red: 'text-red-400',
    yellow: 'text-yellow-400',
    purple: 'text-purple-400',
    orange: 'text-orange-400',
  };

  return (
    <motion.div
      className={`border rounded-lg p-4 ${colorMap[color]} ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.02, boxShadow: '0 0 20px rgba(59, 130, 246, 0.2)' }}
    >
      {/* Header */}
      <div className={`flex items-center justify-between mb-3 ${textColorMap[color]}`}>
        <h3 className="font-semibold text-sm">{title}</h3>
        <span className="text-xl">{icon}</span>
      </div>

      {/* Valor principal */}
      <div className="space-y-2">
        <CountUpAnimation
          from={previousValue}
          to={value}
          duration={2}
          decimals={decimals}
          prefix={prefix}
          suffix={suffix}
          className="text-2xl text-white"
        />

        {/* Indicador de crecimiento */}
        {showGrowth && (
          <GrowthAnimation
            value={value}
            previousValue={previousValue}
            showIcon={true}
            showPercentage={true}
            className="text-sm"
          />
        )}
      </div>
    </motion.div>
  );
};

/**
 * Componente de progreso circular animado
 */
export const CircularProgress = ({
  value,
  maxValue = 100,
  size = 100,
  strokeWidth = 8,
  color = '#3b82f6',
  backgroundColor = '#1f2937',
  duration = 2,
  showValue = true,
  suffix = '%',
  className = '',
}) => {
  const [progress, setProgress] = useState(0);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progressValue = (progress / maxValue) * 100;
  const strokeDashoffset = circumference - (progressValue / 100) * circumference;

  useEffect(() => {
    const timer = setTimeout(() => {
      setProgress(value);
    }, 100);
    return () => clearTimeout(timer);
  }, [value]);

  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Círculo de fondo */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={backgroundColor}
          strokeWidth={strokeWidth}
          fill="transparent"
        />

        {/* Círculo de progreso */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeLinecap="round"
          initial={{ strokeDasharray: circumference, strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration, ease: 'easeInOut' }}
          style={{ strokeDasharray: circumference }}
        />
      </svg>

      {/* Valor central */}
      {showValue && (
        <div className="absolute inset-0 flex items-center justify-center">
          <CountUpAnimation
            from={0}
            to={value}
            duration={duration}
            decimals={0}
            suffix={suffix}
            className="text-white font-bold"
          />
        </div>
      )}
    </div>
  );
};

/**
 * Componente de barra de progreso animada
 */
export const ProgressBar = ({
  value,
  maxValue = 100,
  height = 8,
  color = 'bg-blue-400',
  backgroundColor = 'bg-gray-700',
  duration = 2,
  showValue = true,
  label = '',
  className = '',
}) => {
  const [progress, setProgress] = useState(0);
  const percentage = (progress / maxValue) * 100;

  useEffect(() => {
    const timer = setTimeout(() => {
      setProgress(value);
    }, 100);
    return () => clearTimeout(timer);
  }, [value]);

  return (
    <div className={`w-full ${className}`}>
      {/* Label y valor */}
      {(label || showValue) && (
        <div className="flex justify-between items-center mb-2">
          {label && <span className="text-sm text-gray-400">{label}</span>}
          {showValue && (
            <CountUpAnimation
              from={0}
              to={value}
              duration={duration}
              suffix={`/${maxValue}`}
              className="text-sm text-white"
            />
          )}
        </div>
      )}

      {/* Barra de progreso */}
      <div className={`w-full ${backgroundColor} rounded-full overflow-hidden`} style={{ height }}>
        <motion.div
          className={`h-full ${color} rounded-full`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
};

export default {
  CountUpAnimation,
  GrowthAnimation,
  MetricCard,
  CircularProgress,
  ProgressBar,
};
