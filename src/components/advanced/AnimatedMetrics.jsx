/**
 * 🎯 ANIMATED METRICS DISPLAY - Sistema de métricas con animaciones extremas
 * Displays avanzados para métricas con efectos 3D, particles y gradientes dinámicos
 */
import { useEffect, useState } from 'react';

import { motion, useSpring } from 'framer-motion';
import { ArrowDown, ArrowUp, Zap } from 'lucide-react';

/**
 * Animated Number Counter con efecto de odómetro
 */
export const AnimatedCounter = ({
  value,
  duration = 2,
  decimals = 0,
  prefix = '',
  suffix = '',
}) => {
  const [displayValue, setDisplayValue] = useState(0);
  const springValue = useSpring(0, { stiffness: 75, damping: 15 });

  useEffect(() => {
    springValue.set(value);
    const unsubscribe = springValue.onChange((latest) => {
      setDisplayValue(latest);
    });
    return unsubscribe;
  }, [value, springValue]);

  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-200 to-white"
    >
      {prefix}
      {displayValue.toFixed(decimals).toLocaleString()}
      {suffix}
    </motion.span>
  );
};

/**
 * Metric Card Holográfico con partículas flotantes
 */
export const HolographicMetricCard = ({
  title,
  value,
  change,
  icon: Icon,
  color = '#71717a',
  particles = 15,
}) => {
  const [particlesArray, setParticlesArray] = useState([]);
  const isPositive = parseFloat(change) > 0;

  useEffect(() => {
    const newParticles = Array.from({ length: particles }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 1,
      duration: Math.random() * 4 + 3,
      delay: Math.random() * 2,
    }));
    setParticlesArray(newParticles);
  }, [particles]);

  return (
    <motion.div
      initial={{ opacity: 0, rotateY: -90 }}
      animate={{ opacity: 1, rotateY: 0 }}
      whileHover={{ scale: 1.05, rotateY: 5, rotateX: 5 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      className="relative overflow-hidden rounded-3xl p-8 group perspective-1000"
      style={{
        background: `linear-gradient(135deg, ${color}15 0%, ${color}05 100%)`,
        boxShadow: `0 10px 40px ${color}20`,
        transformStyle: 'preserve-3d',
      }}
    >
      {/* Particles Background */}
      <div className="absolute inset-0 overflow-hidden">
        {particlesArray.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full"
            style={{
              width: particle.size,
              height: particle.size,
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              backgroundColor: color,
              opacity: 0.3,
            }}
            animate={{
              y: [-20, 20],
              x: [-10, 10],
              scale: [1, 1.5, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: particle.duration,
              delay: particle.delay,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      {/* Holographic Border */}
      <motion.div
        className="absolute inset-0 rounded-3xl"
        animate={{
          background: [
            `linear-gradient(0deg, ${color}00, ${color}80, ${color}00)`,
            `linear-gradient(360deg, ${color}00, ${color}80, ${color}00)`,
          ],
        }}
        transition={{ duration: 3, repeat: Infinity }}
        style={{ transform: 'translateZ(-1px)' }}
      />

      {/* Content */}
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <motion.div
            whileHover={{ rotate: 360, scale: 1.2 }}
            transition={{ duration: 0.6 }}
            className="p-4 rounded-2xl backdrop-blur-xl"
            style={{ backgroundColor: `${color}20`, boxShadow: `0 0 20px ${color}30` }}
          >
            {Icon && <Icon className="w-8 h-8" style={{ color }} />}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className={`flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-xl ${
              isPositive ? 'bg-emerald-500/20' : 'bg-red-500/20'
            }`}
          >
            {isPositive ? (
              <ArrowUp className="w-5 h-5 text-emerald-400" />
            ) : (
              <ArrowDown className="w-5 h-5 text-red-400" />
            )}
            <span className={`font-bold ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
              {change}
            </span>
          </motion.div>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-zinc-400 text-sm uppercase tracking-widest mb-3"
        >
          {title}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, type: 'spring' }}
          className="text-5xl font-black"
        >
          <AnimatedCounter value={value} prefix="$" />
        </motion.div>

        {/* Glow effect on hover */}
        <motion.div
          className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 blur-2xl -z-10"
          animate={{
            background: [
              `radial-gradient(circle at 20% 50%, ${color}40 0%, transparent 50%)`,
              `radial-gradient(circle at 80% 50%, ${color}40 0%, transparent 50%)`,
              `radial-gradient(circle at 20% 50%, ${color}40 0%, transparent 50%)`,
            ],
          }}
          transition={{ duration: 4, repeat: Infinity }}
        />
      </div>
    </motion.div>
  );
};

/**
 * Progress Ring con animación circular
 */
export const CircularProgress = ({
  value,
  max = 100,
  size = 120,
  strokeWidth = 8,
  color = '#71717a',
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const progress = (value / max) * 100;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(255,255,255,0.1)"
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
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: 'easeInOut' }}
          style={{
            strokeDasharray: circumference,
            filter: `drop-shadow(0 0 10px ${color})`,
          }}
        />
      </svg>

      {/* Center text */}
      <div className="absolute inset-0 flex items-center justify-center flex-col">
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, type: 'spring' }}
          className="text-3xl font-bold text-white"
        >
          {Math.round(progress)}%
        </motion.span>
        <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity }}>
          <Zap className="w-5 h-5 text-zinc-400 mt-2" />
        </motion.div>
      </div>
    </div>
  );
};

/**
 * Gradient Text con animación de color
 */
export const AnimatedGradientText = ({ children, className = '' }) => {
  return (
    <motion.span
      className={`font-black text-transparent bg-clip-text ${className}`}
      animate={{
        backgroundImage: [
          'linear-gradient(45deg, #71717a 0%, #a1a1aa 50%, #71717a 100%)',
          'linear-gradient(45deg, #a1a1aa 0%, #d4d4d8 50%, #a1a1aa 100%)',
          'linear-gradient(45deg, #71717a 0%, #a1a1aa 50%, #71717a 100%)',
        ],
        backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
      }}
      transition={{ duration: 5, repeat: Infinity }}
      style={{ backgroundSize: '200% 200%' }}
    >
      {children}
    </motion.span>
  );
};

export default {
  AnimatedCounter,
  HolographicMetricCard,
  CircularProgress,
  AnimatedGradientText,
};
