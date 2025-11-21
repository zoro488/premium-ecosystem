/**
 * 🎭 MICRO ANIMATIONS SYSTEM - Sistema global de microinteracciones
 * Animaciones sutiles y elegantes para mejorar la UX en toda la aplicación
 */
import React from 'react';

import { motion } from 'framer-motion';

// ==================== BUTTON ANIMATIONS ====================

export const ButtonPulse = ({ children, className = '', ...props }) => (
  <motion.button
    className={className}
    whileHover={{
      scale: 1.05,
      boxShadow: '0 10px 40px rgba(113, 113, 122, 0.3)',
    }}
    whileTap={{ scale: 0.95 }}
    transition={{ type: 'spring', stiffness: 400, damping: 17 }}
    {...props}
  >
    {children}
  </motion.button>
);

export const ButtonGlow = ({
  children,
  className = '',
  glowColor = 'rgba(113, 113, 122, 0.5)',
  ...props
}) => (
  <motion.button
    className={`relative ${className}`}
    whileHover="hover"
    whileTap="tap"
    variants={{
      hover: { scale: 1.05 },
      tap: { scale: 0.98 },
    }}
    {...props}
  >
    <motion.div
      className="absolute inset-0 rounded-lg blur-md -z-10"
      variants={{
        hover: {
          boxShadow: `0 0 20px ${glowColor}, 0 0 40px ${glowColor}`,
          opacity: 1,
        },
      }}
      initial={{ opacity: 0 }}
    />
    {children}
  </motion.button>
);

// ==================== CARD ANIMATIONS ====================

export const CardHoverLift = ({ children, className = '', ...props }) => (
  <motion.div
    className={className}
    initial={{ y: 0 }}
    whileHover={{
      y: -8,
      boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
    }}
    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    {...props}
  >
    {children}
  </motion.div>
);

export const CardShine = ({ children, className = '' }) => (
  <div className={`relative overflow-hidden ${className}`}>
    <motion.div
      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
      initial={{ x: '-100%' }}
      whileHover={{ x: '100%' }}
      transition={{ duration: 0.6, ease: 'easeInOut' }}
    />
    {children}
  </div>
);

// ==================== TEXT ANIMATIONS ====================

export const TextGradientShift = ({ children, className = '' }) => (
  <motion.div
    className={`bg-gradient-to-r from-zinc-200 via-zinc-100 to-zinc-300 bg-clip-text text-transparent bg-[length:200%_auto] ${className}`}
    animate={{
      backgroundPosition: ['0% center', '200% center'],
    }}
    transition={{
      duration: 3,
      repeat: Infinity,
      ease: 'linear',
    }}
  >
    {children}
  </motion.div>
);

export const TextReveal = ({ children, className = '', delay = 0 }) => (
  <motion.div
    className={`overflow-hidden ${className}`}
    initial={{ height: 0, opacity: 0 }}
    animate={{ height: 'auto', opacity: 1 }}
    transition={{ duration: 0.5, delay, ease: [0.6, 0.01, 0.05, 0.95] }}
  >
    {children}
  </motion.div>
);

// ==================== ICON ANIMATIONS ====================

export const IconSpin = ({ children, className = '', duration = 0.6 }) => (
  <motion.div
    className={className}
    whileHover={{ rotate: 360 }}
    transition={{ duration, ease: 'easeInOut' }}
  >
    {children}
  </motion.div>
);

export const IconBounce = ({ children, className = '' }) => (
  <motion.div
    className={className}
    whileHover={{
      y: [0, -5, 0],
      transition: {
        duration: 0.4,
        repeat: Infinity,
        repeatType: 'loop',
      },
    }}
  >
    {children}
  </motion.div>
);

export const IconPulseGlow = ({ children, className = '', color = '#71717a' }) => (
  <motion.div
    className={`relative ${className}`}
    animate={{
      filter: [
        `drop-shadow(0 0 0px ${color})`,
        `drop-shadow(0 0 10px ${color})`,
        `drop-shadow(0 0 0px ${color})`,
      ],
    }}
    transition={{
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut',
    }}
  >
    {children}
  </motion.div>
);

// ==================== LOADING ANIMATIONS ====================

export const SkeletonPulse = ({ className = '', width = 'w-full', height = 'h-4' }) => (
  <motion.div
    className={`${width} ${height} rounded-lg bg-zinc-800 ${className}`}
    animate={{
      opacity: [0.5, 0.8, 0.5],
    }}
    transition={{
      duration: 1.5,
      repeat: Infinity,
      ease: 'easeInOut',
    }}
  />
);

export const Spinner = ({ size = 'w-8 h-8', className = '' }) => (
  <motion.div
    className={`${size} border-4 border-zinc-700 border-t-white rounded-full ${className}`}
    animate={{ rotate: 360 }}
    transition={{
      duration: 1,
      repeat: Infinity,
      ease: 'linear',
    }}
  />
);

// ==================== BACKGROUND ANIMATIONS ====================

export const ParallaxBackground = ({ children, speed = 0.5 }) => {
  return (
    <motion.div
      style={{ y: 0 }}
      animate={{ y: [0, -20, 0] }}
      transition={{
        duration: 8 / speed,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      {children}
    </motion.div>
  );
};

export const FloatingElement = ({ children, className = '', duration = 3 }) => (
  <motion.div
    className={className}
    animate={{
      y: [0, -15, 0],
      x: [0, 10, 0],
    }}
    transition={{
      duration,
      repeat: Infinity,
      ease: 'easeInOut',
    }}
  >
    {children}
  </motion.div>
);

// ==================== PAGE TRANSITIONS ====================

export const PageFadeIn = ({ children }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.3 }}
  >
    {children}
  </motion.div>
);

export const PageSlideUp = ({ children }) => (
  <motion.div
    initial={{ y: 20, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    exit={{ y: -20, opacity: 0 }}
    transition={{ duration: 0.4, ease: [0.6, 0.01, 0.05, 0.95] }}
  >
    {children}
  </motion.div>
);

// ==================== NOTIFICATION ANIMATIONS ====================

export const NotificationSlide = ({ children, position = 'top-right' }) => {
  const positionVariants = {
    'top-right': { x: 300 },
    'top-left': { x: -300 },
    'bottom-right': { x: 300 },
    'bottom-left': { x: -300 },
  };

  return (
    <motion.div
      initial={{ x: positionVariants[position].x, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: positionVariants[position].x, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      {children}
    </motion.div>
  );
};

// ==================== INTERACTIVE ANIMATIONS ====================

export const MagneticButton = ({ children, strength = 0.3, className = '', ...props }) => {
  const [position, setPosition] = React.useState({ x: 0, y: 0 });
  const buttonRef = React.useRef(null);

  const handleMouseMove = (e) => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) * strength;
    const y = (e.clientY - rect.top - rect.height / 2) * strength;
    setPosition({ x, y });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.button
      ref={buttonRef}
      className={`relative ${className}`}
      animate={{ x: position.x, y: position.y }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      transition={{ type: 'spring', stiffness: 150, damping: 15 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      {...props}
    >
      <motion.div
        className="absolute inset-0 rounded-lg opacity-0 hover:opacity-100 blur-xl bg-gradient-to-r from-zinc-500/20 via-zinc-400/20 to-zinc-500/20"
        animate={{
          backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
        }}
        transition={{ duration: 3, repeat: Infinity }}
        style={{ backgroundSize: '200% 200%' }}
      />
      {children}
    </motion.button>
  );
};

export default {
  ButtonPulse,
  ButtonGlow,
  CardHoverLift,
  CardShine,
  TextGradientShift,
  TextReveal,
  IconSpin,
  IconBounce,
  IconPulseGlow,
  SkeletonPulse,
  Spinner,
  ParallaxBackground,
  FloatingElement,
  PageFadeIn,
  PageSlideUp,
  NotificationSlide,
  MagneticButton,
};
