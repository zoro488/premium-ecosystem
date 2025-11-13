import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus, LucideIcon } from 'lucide-react';
import ChronosCard from './ChronosCard';

interface ChronosKPIProps {
  title: string;
  value: string | number;
  trend?: {
    direction: 'up' | 'down' | 'neutral';
    percentage: number;
    label?: string;
  };
  Icon?: LucideIcon;
  glowColor?: 'blue' | 'cyan' | 'purple' | 'green' | 'pink';
  format?: 'currency' | 'number' | 'percentage';
  delay?: number;
}

const ChronosKPI: React.FC<ChronosKPIProps> = ({
  title,
  value,
  trend,
  Icon,
  glowColor = 'blue',
  format = 'currency',
  delay = 0,
}) => {
  const formatValue = (val: string | number) => {
    const num = typeof val === 'string' ? parseFloat(val) : val;

    if (format === 'currency') {
      return new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'MXN',
        minimumFractionDigits: 2,
      }).format(num);
    }

    if (format === 'percentage') {
      return `${num.toFixed(2)}%`;
    }

    return new Intl.NumberFormat('es-MX').format(num);
  };

  const TrendIcon = trend?.direction === 'up' ? TrendingUp :
                    trend?.direction === 'down' ? TrendingDown : Minus;

  const trendColor = trend?.direction === 'up' ? 'text-neon-green' :
                     trend?.direction === 'down' ? 'text-neon-pink' : 'text-gray-400';

  return (
    <ChronosCard
      title={title}
      Icon={Icon}
      glowColor={glowColor}
      delay={delay}
      className="hover:scale-105"
    >
      {/* Valor Principal */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, delay: delay + 0.2 }}
        className="mb-4"
      >
        <div className={`text-4xl font-bold text-neon-${glowColor} font-mono`}>
          {formatValue(value)}
        </div>
      </motion.div>

      {/* Tendencia */}
      {trend && (
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.4, delay: delay + 0.4 }}
          className="flex items-center space-x-2"
        >
          <div className={`flex items-center space-x-1 ${trendColor}`}>
            <TrendIcon size={16} />
            <span className="text-sm font-semibold">{trend.percentage.toFixed(2)}%</span>
          </div>
          {trend.label && (
            <span className="text-xs text-gray-400">{trend.label}</span>
          )}
        </motion.div>
      )}
    </ChronosCard>
  );
};

export default ChronosKPI;
