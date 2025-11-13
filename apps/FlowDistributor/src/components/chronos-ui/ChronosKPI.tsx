// ============================================================================
// CHRONOS KPI - Key Performance Indicator Component
// Componente para mostrar métricas con formato y tendencias
// ============================================================================

import { motion } from 'framer-motion';
import { LucideIcon, Minus, TrendingDown, TrendingUp } from 'lucide-react';

interface ChronosKPIProps {
  label: string;
  value: number;
  format?: 'currency' | 'number' | 'percentage';
  trend?: number; // Porcentaje de cambio
  color?: 'cyan' | 'purple' | 'green' | 'yellow' | 'red' | 'blue';
  icon?: LucideIcon;
  pulse?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const colorMap = {
  cyan: 'text-neon-cyan',
  purple: 'text-neon-purple',
  green: 'text-neon-green',
  yellow: 'text-neon-yellow',
  red: 'text-neon-red',
  blue: 'text-neon-blue',
};

const sizeMap = {
  sm: { value: 'text-2xl', label: 'text-xs' },
  md: { value: 'text-3xl', label: 'text-sm' },
  lg: { value: 'text-4xl', label: 'text-base' },
};

export function ChronosKPI({
  label,
  value,
  format = 'number',
  trend,
  color = 'cyan',
  icon: Icon,
  pulse = false,
  size = 'md',
}: ChronosKPIProps) {
  // Formateo de valor
  const formatValue = () => {
    switch (format) {
      case 'currency':
        return new Intl.NumberFormat('es-MX', {
          style: 'currency',
          currency: 'MXN',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(value);

      case 'percentage':
        return `${value.toFixed(1)}%`;

      case 'number':
      default:
        return new Intl.NumberFormat('es-MX').format(value);
    }
  };

  // Icono de tendencia
  const TrendIcon = trend
    ? trend > 0
      ? TrendingUp
      : trend < 0
      ? TrendingDown
      : Minus
    : null;

  const trendColor = trend
    ? trend > 0
      ? 'text-status-success'
      : trend < 0
      ? 'text-status-error'
      : 'text-chronos-silver'
    : '';

  return (
    <motion.div
      className="flex flex-col gap-2"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Label */}
      <div className="flex items-center gap-2">
        {Icon && <Icon className={`w-4 h-4 ${colorMap[color]}`} />}
        <span className={`${sizeMap[size].label} text-chronos-silver uppercase tracking-wider font-medium`}>
          {label}
        </span>
      </div>

      {/* Value */}
      <div className="flex items-baseline gap-3">
        <motion.span
          className={`${sizeMap[size].value} font-bold ${colorMap[color]} ${
            pulse ? 'animate-glow-pulse' : ''
          }`}
        >
          {formatValue()}
        </motion.span>

        {/* Trend Indicator */}
        {trend !== undefined && TrendIcon && (
          <div className={`flex items-center gap-1 ${trendColor} text-sm font-medium`}>
            <TrendIcon className="w-4 h-4" />
            <span>{Math.abs(trend).toFixed(1)}%</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default ChronosKPI;
