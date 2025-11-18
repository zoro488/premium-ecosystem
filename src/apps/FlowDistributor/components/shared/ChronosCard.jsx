import React from 'react';
import { motion } from 'framer-motion';

/**
 * 🎯 CHRONOS CARD - Card premium con efectos y microanimaciones
 */
const ChronosCard = ({
  children,
  title,
  subtitle,
  icon: Icon,
  className = '',
  onClick,
  hoverable = true,
  glowOnHover = true,
  index = 0,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={
        hoverable
          ? {
              scale: 1.02,
              y: -4,
              transition: { duration: 0.2 },
            }
          : {}
      }
      onClick={onClick}
      className={`
        relative backdrop-blur-xl bg-white/5 border border-white/10
        rounded-sm overflow-hidden
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
      style={{
        boxShadow: '0 4px 24px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.1)',
      }}
    >
      {/* Glow effect on hover */}
      {glowOnHover && (
        <motion.div
          className="absolute inset-0 opacity-0 pointer-events-none"
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          style={{
            background:
              'radial-gradient(circle at center, rgba(255,255,255,0.05), transparent 70%)',
          }}
        />
      )}

      {/* Shine effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
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
          style={{ transform: 'skewX(-20deg)' }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Header con icono y título */}
        {(title || Icon) && (
          <div className="flex items-center gap-3 p-6 pb-4 border-b border-white/10">
            {Icon && (
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
                className="p-2 bg-white/5 rounded-sm"
              >
                <Icon className="w-5 h-5 text-white/70" />
              </motion.div>
            )}
            <div className="flex-1">
              {title && <h3 className="text-lg font-light text-white tracking-wider">{title}</h3>}
              {subtitle && <p className="text-xs text-white/40 mt-1">{subtitle}</p>}
            </div>
          </div>
        )}

        {/* Body */}
        <div className="p-6">{children}</div>
      </div>

      {/* Border glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          borderRadius: 'inherit',
          background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%)',
        }}
      />
    </motion.div>
  );
};

/**
 * 🎯 CHRONOS STAT CARD - Card para estadísticas con animaciones
 */
export const ChronosStatCard = ({
  title,
  value,
  icon: Icon,
  trend,
  trendLabel,
  color = 'rgba(255,255,255,0.9)',
  index = 0,
}) => {
  const isPositive = trend > 0;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ scale: 1.05, y: -8 }}
      className="relative backdrop-blur-xl bg-white/5 border border-white/10 rounded-sm p-6 overflow-hidden"
    >
      {/* Background gradient */}
      <div
        className="absolute top-0 right-0 w-32 h-32 blur-3xl opacity-20"
        style={{
          background: `radial-gradient(circle, ${color}, transparent)`,
        }}
      />

      {/* Icon */}
      {Icon && (
        <motion.div
          whileHover={{ rotate: 360, scale: 1.1 }}
          transition={{ duration: 0.6 }}
          className="inline-flex p-3 bg-white/5 rounded-sm mb-4"
        >
          <Icon className="w-6 h-6" style={{ color }} />
        </motion.div>
      )}

      {/* Title */}
      <p className="text-sm text-white/60 mb-2 tracking-wide">{title}</p>

      {/* Value animado */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 + index * 0.1 }}
        className="text-3xl font-light text-white mb-3 tracking-wide"
      >
        {value}
      </motion.div>

      {/* Trend */}
      {trend !== undefined && (
        <div className="flex items-center gap-2">
          <motion.div
            animate={{ y: isPositive ? [-2, 2, -2] : [2, -2, 2] }}
            transition={{ duration: 2, repeat: Infinity }}
            className={`text-sm font-medium ${isPositive ? 'text-zinc-200' : 'text-zinc-200'}`}
          >
            {isPositive ? '↑' : '↓'} {Math.abs(trend)}%
          </motion.div>
          {trendLabel && <span className="text-xs text-white/40">{trendLabel}</span>}
        </div>
      )}

      {/* Shine effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none"
        animate={{
          x: ['-100%', '200%'],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatDelay: 3,
          ease: 'linear',
        }}
      />
    </motion.div>
  );
};

export default ChronosCard;
