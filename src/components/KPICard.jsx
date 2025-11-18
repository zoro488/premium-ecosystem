import { motion } from 'framer-motion';
import { ArrowDownRight, ArrowUpRight, Minus } from 'lucide-react';





/**
 * 📊 KPI CARD PREMIUM
 * Tarjeta de KPI con:
 * - Comparación de períodos
 * - Indicadores visuales de rendimiento
 * - Sparkline mini gráfico
 * - Animaciones fluidas
 */

const KPICard = ({
  label,
  value,
  previousValue,
  unit = '',
  format = 'number', // 'number' | 'currency' | 'percent'
  sparklineData = [],
  target,
  status, // 'success' | 'warning' | 'danger' | 'neutral'
  onClick,
  className = '',
}) => {
  // Calcular cambio porcentual
  const change =
    previousValue && previousValue !== 0 ? ((value - previousValue) / previousValue) * 100 : 0;

  const changeDirection = change > 0 ? 'up' : change < 0 ? 'down' : 'neutral';

  // Formatear valor
  const formatValue = (val) => {
    switch (format) {
      case 'currency':
        return `$${val.toLocaleString()}`;
      case 'percent':
        return `${val}%`;
      default:
        return val.toLocaleString();
    }
  };

  // Colores según status
  const statusColors = {
    success: {
      bg: 'from-black/80 to-black/90',
      border: 'border-green-500/20',
      text: 'text-green-400',
      glow: 'shadow-green-500/20',
    },
    warning: {
      bg: 'from-black/80 to-black/90',
      border: 'border-yellow-500/20',
      text: 'text-yellow-400',
      glow: 'shadow-yellow-500/20',
    },
    danger: {
      bg: 'from-black/80 to-black/90',
      border: 'border-red-500/20',
      text: 'text-red-400',
      glow: 'shadow-red-500/20',
    },
    neutral: {
      bg: 'from-black/80 to-black/90',
      border: 'border-slate-500/20',
      text: 'text-slate-400',
      glow: 'shadow-slate-500/20',
    },
  };

  const colors = statusColors[status] || statusColors.neutral;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.03, y: -5 }}
      onClick={onClick}
      className={`
        relative overflow-hidden
        bg-white/5 backdrop-blur-xl
        border ${colors.border}
        rounded-2xl p-6
        cursor-pointer
        bg-gradient-to-br ${colors.bg}
        group
        ${className}
      `}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <p className="text-sm font-medium text-slate-400 mb-1">{label}</p>

          {/* Valor principal con animación */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, type: 'spring' }}
            className="flex items-baseline gap-2"
          >
            <span className={`text-3xl font-bold ${colors.text}`}>{formatValue(value)}</span>
            {unit && <span className="text-sm text-slate-500">{unit}</span>}
          </motion.div>
        </div>

        {/* Indicador de cambio */}
        {previousValue !== undefined && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className={`
              flex items-center gap-1 px-3 py-1.5 rounded-full
              text-xs font-bold
              ${
                changeDirection === 'up'
                  ? 'bg-green-500/20 text-green-400'
                  : changeDirection === 'down'
                    ? 'bg-red-500/20 text-red-400'
                    : 'bg-slate-500/20 text-slate-400'
              }
            `}
          >
            {changeDirection === 'up' ? (
              <ArrowUpRight className="w-3 h-3" />
            ) : changeDirection === 'down' ? (
              <ArrowDownRight className="w-3 h-3" />
            ) : (
              <Minus className="w-3 h-3" />
            )}
            <span>{Math.abs(change).toFixed(1)}%</span>
          </motion.div>
        )}
      </div>

      {/* Sparkline mini gráfico */}
      {sparklineData.length > 0 && (
        <div className="mb-4">
          <svg width="100%" height="40" className="overflow-visible">
            <motion.polyline
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 1, delay: 0.3 }}
              fill="none"
              stroke={colors.text}
              strokeWidth="2"
              points={sparklineData
                .map((val, i) => {
                  const x = (i / (sparklineData.length - 1)) * 100;
                  const max = Math.max(...sparklineData);
                  const min = Math.min(...sparklineData);
                  const y = 40 - ((val - min) / (max - min)) * 30;
                  return `${x}%,${y}`;
                })
                .join(' ')}
            />
          </svg>
        </div>
      )}

      {/* Progress hacia target */}
      {target && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">Meta: {formatValue(target)}</span>
            <span className={colors.text}>{((value / target) * 100).toFixed(0)}%</span>
          </div>
          <div className="h-2 bg-white/5 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min((value / target) * 100, 100)}%` }}
              transition={{ duration: 1, delay: 0.4 }}
              className={`h-full bg-gradient-to-r ${colors.text} rounded-full`}
            />
          </div>
        </div>
      )}

      {/* Comparación con período anterior */}
      {previousValue !== undefined && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-4 pt-4 border-t border-white/10"
        >
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500">Período anterior:</span>
            <span className="text-slate-400 font-medium">{formatValue(previousValue)}</span>
          </div>
        </motion.div>
      )}

      {/* Efecto de glow en hover */}
      <div
        className={`absolute -inset-1 bg-gradient-to-r ${colors.text} opacity-0 group-hover:opacity-10 blur-xl transition-opacity duration-500 -z-10`}
      />
    </motion.div>
  );
};

export default KPICard;
