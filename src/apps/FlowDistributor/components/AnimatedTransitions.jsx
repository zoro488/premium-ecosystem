import React from 'react';

import { AnimatePresence, motion } from 'framer-motion';

/**
 * 🎬 PAGE TRANSITION - Transiciones suaves entre páginas/paneles
 */
export const PageTransition = ({ children, className = '' }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{
        type: 'spring',
        stiffness: 260,
        damping: 20,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

/**
 * 🌊 FADE SLIDE - Efecto de desvanecimiento con deslizamiento
 */
export const FadeSlide = ({
  children,
  direction = 'up',
  delay = 0,
  duration = 0.5,
  className = '',
}) => {
  const directions = {
    up: { y: 40 },
    down: { y: -40 },
    left: { x: 40 },
    right: { x: -40 },
  };

  return (
    <motion.div
      initial={{ opacity: 0, ...directions[direction] }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ delay, duration, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

/**
 * ⚡ STAGGER CONTAINER - Contenedor con animación escalonada
 */
export const StaggerContainer = ({ children, staggerDelay = 0.1, className = '' }) => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
      },
    },
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className={className}>
      {children}
    </motion.div>
  );
};

/**
 * 🎯 STAGGER ITEM - Item individual con animación escalonada
 */
export const StaggerItem = ({ children, className = '' }) => {
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <motion.div variants={item} className={className}>
      {children}
    </motion.div>
  );
};

/**
 * 💫 SCALE FADE - Escala con desvanecimiento
 */
export const ScaleFade = ({ children, delay = 0, className = '' }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{
        delay,
        type: 'spring',
        stiffness: 200,
        damping: 20,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

/**
 * 🌀 ROTATE FADE - Rotación con desvanecimiento
 */
export const RotateFade = ({ children, delay = 0, className = '' }) => {
  return (
    <motion.div
      initial={{ opacity: 0, rotate: -10, scale: 0.9 }}
      animate={{ opacity: 1, rotate: 0, scale: 1 }}
      exit={{ opacity: 0, rotate: 10, scale: 0.9 }}
      transition={{
        delay,
        type: 'spring',
        stiffness: 200,
        damping: 15,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

/**
 * 🎪 FLIP CARD - Tarjeta con efecto de volteo
 */
export const FlipCard = ({ front, back, className = '' }) => {
  const [isFlipped, setIsFlipped] = React.useState(false);

  return (
    <motion.div
      className={`relative ${className}`}
      style={{ transformStyle: 'preserve-3d', perspective: 1000 }}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <motion.div
        className="w-full h-full"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Front */}
        <div className="absolute inset-0" style={{ backfaceVisibility: 'hidden' }}>
          {front}
        </div>

        {/* Back */}
        <div
          className="absolute inset-0"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
        >
          {back}
        </div>
      </motion.div>
    </motion.div>
  );
};

/**
 * 🎨 HOVER LIFT - Efecto de elevación al pasar el cursor
 */
export const HoverLift = ({ children, lift = 8, scale = 1.02, className = '' }) => {
  return (
    <motion.div
      className={className}
      whileHover={{
        y: -lift,
        scale,
        transition: { type: 'spring', stiffness: 300, damping: 20 },
      }}
      whileTap={{ scale: 0.98 }}
    >
      {children}
    </motion.div>
  );
};

/**
 * ✨ PULSE GLOW - Efecto de pulso con brillo
 */
export const PulseGlow = ({ children, color = 'blue', className = '' }) => {
  const colors = {
    blue: 'rgba(59, 130, 246, 0.4)',
    green: 'rgba(34, 197, 94, 0.4)',
    purple: 'rgba(139, 92, 246, 0.4)',
    red: 'rgba(239, 68, 68, 0.4)',
    yellow: 'rgba(245, 158, 11, 0.4)',
  };

  return (
    <motion.div
      className={`relative ${className}`}
      animate={{
        boxShadow: [
          `0 0 20px ${colors[color]}`,
          `0 0 40px ${colors[color]}`,
          `0 0 20px ${colors[color]}`,
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
};

/**
 * 🌊 WAVE EFFECT - Efecto de onda al hacer clic
 */
export const WaveEffect = ({ children, className = '' }) => {
  const [ripples, setRipples] = React.useState([]);

  const handleClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newRipple = {
      x,
      y,
      id: Date.now(),
    };

    setRipples([...ripples, newRipple]);

    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
    }, 600);
  };

  return (
    <div className={`relative overflow-hidden ${className}`} onClick={handleClick}>
      {children}
      <AnimatePresence>
        {ripples.map((ripple) => (
          <motion.span
            key={ripple.id}
            className="absolute bg-white rounded-full opacity-30 pointer-events-none"
            style={{
              left: ripple.x,
              top: ripple.y,
            }}
            initial={{ width: 0, height: 0, marginLeft: 0, marginTop: 0 }}
            animate={{
              width: 200,
              height: 200,
              marginLeft: -100,
              marginTop: -100,
              opacity: 0,
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

/**
 * 🎭 MORPH SHAPE - Transformación de formas
 */
export const MorphShape = ({ children, morphed = false, className = '' }) => {
  return (
    <motion.div
      className={className}
      animate={{
        borderRadius: morphed ? '50%' : '1rem',
        rotate: morphed ? 180 : 0,
      }}
      transition={{
        type: 'spring',
        stiffness: 200,
        damping: 20,
      }}
    >
      {children}
    </motion.div>
  );
};

/**
 * 🎪 SLIDE REVEAL - Revelación con deslizamiento
 */
export const SlideReveal = ({ children, direction = 'left', delay = 0, className = '' }) => {
  const variants = {
    hidden: {
      left: { x: '-100%' },
      right: { x: '100%' },
      top: { y: '-100%' },
      bottom: { y: '100%' },
    },
    visible: {
      x: 0,
      y: 0,
    },
  };

  return (
    <div className={`overflow-hidden ${className}`}>
      <motion.div
        initial={variants.hidden[direction]}
        animate={variants.visible}
        transition={{
          delay,
          type: 'spring',
          stiffness: 100,
          damping: 20,
        }}
      >
        {children}
      </motion.div>
    </div>
  );
};

export default {
  PageTransition,
  FadeSlide,
  StaggerContainer,
  StaggerItem,
  ScaleFade,
  RotateFade,
  FlipCard,
  HoverLift,
  PulseGlow,
  WaveEffect,
  MorphShape,
  SlideReveal,
};
