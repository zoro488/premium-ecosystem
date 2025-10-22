/**
 * KPICard - Componente reutilizable para mostrar métricas
 * Componente modular extraído de FlowDistributor para mejor mantenibilidad
 */
import React from 'react';

import { motion } from 'framer-motion';

/**
 * @typedef {Object} KPICardProps
 * @property {string} title - Título del KPI
 * @property {string|number} value - Valor principal del KPI
 * @property {React.ComponentType} icon - Icono de Lucide React
 * @property {string} color - Color theme: 'blue' | 'green' | 'red' | 'purple' | 'emerald'
 * @property {string} gradient - Clases de gradiente de Tailwind
 * @property {string} bgGradient - Gradiente de fondo
 * @property {string} change - Indicador de cambio (ej: "+12.5%")
 * @property {string} description - Descripción adicional
 * @property {Function} [onClick] - Callback opcional al hacer clic
 * @property {string} [ariaLabel] - Label accesible para ARIA
 */

const borderClasses = {
  green: 'border-green-500/20',
  blue: 'border-blue-500/20',
  red: 'border-red-500/20',
  purple: 'border-purple-500/20',
  emerald: 'border-emerald-500/20',
  yellow: 'border-yellow-500/20',
};

const textClasses = {
  green: 'text-green-400',
  blue: 'text-blue-400',
  red: 'text-red-400',
  purple: 'text-purple-400',
  emerald: 'text-emerald-400',
  yellow: 'text-yellow-400',
};

const badgeClasses = {
  green: 'text-green-400 bg-green-400/20',
  blue: 'text-blue-400 bg-blue-400/20',
  red: 'text-red-400 bg-red-400/20',
  purple: 'text-purple-400 bg-purple-400/20',
  emerald: 'text-emerald-400 bg-emerald-400/20',
  yellow: 'text-yellow-400 bg-yellow-400/20',
};

/**
 * Componente KPICard
 */
export const KPICard = ({
  title,
  value,
  icon: Icon,
  color = 'blue',
  gradient,
  bgGradient,
  change,
  description,
  onClick,
  ariaLabel,
}) => {
  const isClickable = typeof onClick === 'function';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={isClickable ? { scale: 1.03, y: -5 } : {}}
      onClick={onClick}
      role={isClickable ? 'button' : 'article'}
      aria-label={ariaLabel || `${title}: ${value}`}
      tabIndex={isClickable ? 0 : undefined}
      onKeyDown={(e) => {
        if (isClickable && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onClick();
        }
      }}
      className={`
        glass rounded-2xl p-6 border ${borderClasses[color]}
        bg-gradient-to-br ${bgGradient}
        hover:shadow-2xl hover:shadow-${color}-500/10
        transition-all duration-300
        ${isClickable ? 'cursor-pointer' : ''}
      `}
    >
      {/* Header con icono */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-semibold text-slate-300 uppercase tracking-wide">{title}</p>
        <motion.div
          whileHover={{ rotate: 360, scale: 1.2 }}
          transition={{ duration: 0.6 }}
          className={`p-3 rounded-xl bg-gradient-to-br ${gradient} shadow-lg`}
        >
          <Icon className="w-6 h-6 text-white" aria-hidden="true" />
        </motion.div>
      </div>

      {/* Valor principal */}
      <div className="mb-3">
        <motion.p
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className={`text-4xl font-black ${textClasses[color]} tracking-tight`}
        >
          {value}
        </motion.p>
      </div>

      {/* Indicador de cambio y descripción */}
      <div className="flex items-center justify-between">
        {change && (
          <motion.span
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className={`
              px-3 py-1 rounded-full text-xs font-bold
              ${badgeClasses[color]}
            `}
          >
            {change}
          </motion.span>
        )}
        {description && <span className="text-xs text-slate-400 ml-2">{description}</span>}
      </div>
    </motion.div>
  );
};

/**
 * Hook personalizado para gestionar KPIs
 */
export const useKPIData = (data) => {
  return React.useMemo(() => {
    // Ejemplo de cálculo de KPIs desde datos
    return {
      totalItems: data?.length || 0,
      totalValue: data?.reduce((sum, item) => sum + (item.valor || 0), 0) || 0,
      average: data?.length
        ? data.reduce((sum, item) => sum + (item.valor || 0), 0) / data.length
        : 0,
    };
  }, [data]);
};

export default KPICard;
