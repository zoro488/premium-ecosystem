import { motion } from 'framer-motion';
import { TrendingDown, TrendingUp } from 'lucide-react';

/**
 * 🎯 STAT CARD PREMIUM
 * Card estadística con:
 * - Animación de contador
 * - Microinteracciones en hover
 * - Indicador de tendencia animado
 * - Gradientes personalizados
 * - Efectos de glassmorphism
 */

const StatCard = ({
  title,
  value,
  icon: Icon,
  trend,
  trendValue,
  color = 'purple',
  gradient = 'from-purple-500 to-pink-500',
  bgGradient = 'from-purple-500/10 to-pink-500/5',
  onClick,
  delay = 0,
}) => {
  const isPositiveTrend = trend === 'up' || (trendValue && trendValue > 0);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay,
        type: 'spring',
        stiffness: 100,
      }}
      whileHover={{
        scale: 1.05,
        y: -8,
        transition: { duration: 0.2 },
      }}
      onClick={onClick}
      className={`
        relative overflow-hidden
        bg-white/5 backdrop-blur-xl
        border border-white/10
        rounded-2xl p-6
        cursor-pointer
        bg-gradient-to-br ${bgGradient}
        group
      `}
    >
      {/* Efecto de brillo animado */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
        animate={{
          x: ['-200%', '200%'],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          repeatDelay: 5,
          ease: 'linear',
        }}
      />

      {/* Contenido */}
      <div className="relative z-10">
        {/* Header con icono */}
        <div className="flex items-center justify-between mb-4">
          <motion.div
            whileHover={{ rotate: 360, scale: 1.1 }}
            transition={{ duration: 0.6 }}
            className={`p-3 rounded-xl bg-gradient-to-r ${gradient} shadow-lg`}
          >
            <Icon className="w-6 h-6 text-white" />
          </motion.div>

          {/* Badge de tendencia */}
          {(trend || trendValue) && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: delay + 0.3, type: 'spring' }}
              className={`
                flex items-center gap-1 px-3 py-1 rounded-full
                text-xs font-bold
                ${isPositiveTrend ? 'bg-green-400/20 text-green-400' : 'bg-red-400/20 text-red-400'}
              `}
            >
              {isPositiveTrend ? (
                <TrendingUp className="w-3 h-3" />
              ) : (
                <TrendingDown className="w-3 h-3" />
              )}
              {trendValue ? `${Math.abs(trendValue)}%` : ''}
            </motion.div>
          )}
        </div>

        {/* Título */}
        <h3 className="text-sm font-semibold text-slate-400 mb-2">{title}</h3>

        {/* Valor con animación de contador */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: delay + 0.2 }}
          className={`text-4xl font-bold bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}
        >
          {value}
        </motion.p>

        {/* Barra de progreso animada */}
        <div className="mt-4 h-1 bg-white/5 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{
              duration: 1.5,
              delay: delay + 0.5,
              ease: 'easeOut',
            }}
            className={`h-full bg-gradient-to-r ${gradient} rounded-full`}
          />
        </div>
      </div>

      {/* Efecto de resplandor en hover */}
      <motion.div
        className={`absolute -inset-1 bg-gradient-to-r ${gradient} opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500 -z-10`}
      />
    </motion.div>
  );
};

export default StatCard;
