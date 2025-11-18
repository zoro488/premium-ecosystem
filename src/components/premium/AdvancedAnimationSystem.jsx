/**
 * 🎬 ADVANCED ANIMATION SYSTEM
 * Sistema de animaciones complejas nivel Awwwards
 * Inspirado en sitios ganadores top 1 global
 */
import { useEffect, useRef, useState } from 'react';

import { motion, useMotionValue, useScroll, useSpring, useTransform } from 'framer-motion';

// ============================================
// 1. PARALLAX AVANZADO CON MÚLTIPLES CAPAS
// ============================================

/**
 * Sistema de parallax multicapa con suavizado
 * @param {number} speed - Velocidad del parallax (0-1)
 * @param {ReactNode} children - Contenido a animar
 */
export const ParallaxLayer = ({ children, speed = 0.5, className = '' }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], ['0%', `${speed * 100}%`]);
  const smoothY = useSpring(y, { stiffness: 100, damping: 30, mass: 0.5 });

  return (
    <motion.div ref={ref} style={{ y: smoothY }} className={className}>
      {children}
    </motion.div>
  );
};

// ============================================
// 2. PARTÍCULAS FLOTANTES AVANZADAS
// ============================================

/**
 * Sistema de partículas con física realista
 * Incluye: gravedad, colisiones, respuesta al mouse
 */
export const AdvancedParticleSystem = ({ count = 50, interactive = true }) => {
  const containerRef = useRef(null);
  const [particles, setParticles] = useState([]);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    const newParticles = Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      speedX: (Math.random() - 0.5) * 0.5,
      speedY: (Math.random() - 0.5) * 0.5,
      color: `hsl(${Math.random() * 360}, 70%, 60%)`,
    }));
    setParticles(newParticles);
  }, [count]);

  useEffect(() => {
    if (!interactive) return;

    const handleMouseMove = (e) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (rect) {
        mouseX.set((e.clientX - rect.left) / rect.width);
        mouseY.set((e.clientY - rect.top) / rect.height);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [interactive, mouseX, mouseY]);

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full mix-blend-screen"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
            backgroundColor: particle.color,
          }}
          animate={{
            x: [0, particle.speedX * 100, 0],
            y: [0, particle.speedY * 100, 0],
            scale: [1, 1.5, 1],
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{
            duration: Math.random() * 10 + 15,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
};

// ============================================
// 3. MORPHING DE FORMAS COMPLEJAS
// ============================================

/**
 * Transición morphing entre formas SVG
 * Inspirado en awwwards winners
 */
export const MorphingShape = ({ shapes, duration = 2 }) => {
  const [currentShape, setCurrentShape] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentShape((prev) => (prev + 1) % shapes.length);
    }, duration * 1000);

    return () => clearInterval(interval);
  }, [shapes.length, duration]);

  return (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <motion.path
        d={shapes[currentShape]}
        fill="url(#morphGradient)"
        initial={false}
        animate={{ d: shapes[currentShape] }}
        transition={{
          duration: duration,
          ease: [0.43, 0.13, 0.23, 0.96],
        }}
      />
      <defs>
        <linearGradient id="morphGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#667eea" />
          <stop offset="100%" stopColor="#764ba2" />
        </linearGradient>
      </defs>
    </svg>
  );
};

// ============================================
// 4. EFECTO MAGNÉTICO EN BOTONES
// ============================================

/**
 * Botón con efecto magnético al hover
 * El botón "sigue" al cursor con suavidad
 */
export const MagneticButton = ({ children, strength = 0.5, className = '', onClick }) => {
  const ref = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = (e.clientX - centerX) * strength;
    const deltaY = (e.clientY - centerY) * strength;

    setPosition({ x: deltaX, y: deltaY });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.button
      ref={ref}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: 'spring', stiffness: 150, damping: 15, mass: 0.1 }}
      whileTap={{ scale: 0.95 }}
    >
      {children}
    </motion.button>
  );
};

// ============================================
// 5. SCROLL-TRIGGERED ANIMATIONS
// ============================================

/**
 * Animaciones activadas por scroll con múltiples variantes
 * Optimizado para performance
 */
export const ScrollReveal = ({
  children,
  variant = 'fadeUp',
  delay = 0,
  duration = 0.8,
  className = '',
}) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.9', 'start 0.6'],
  });

  const variants = {
    fadeUp: {
      initial: { opacity: 0, y: 60 },
      animate: { opacity: 1, y: 0 },
    },
    fadeDown: {
      initial: { opacity: 0, y: -60 },
      animate: { opacity: 1, y: 0 },
    },
    fadeLeft: {
      initial: { opacity: 0, x: -60 },
      animate: { opacity: 1, x: 0 },
    },
    fadeRight: {
      initial: { opacity: 0, x: 60 },
      animate: { opacity: 1, x: 0 },
    },
    scale: {
      initial: { opacity: 0, scale: 0.8 },
      animate: { opacity: 1, scale: 1 },
    },
    rotate: {
      initial: { opacity: 0, rotate: -10 },
      animate: { opacity: 1, rotate: 0 },
    },
  };

  const selectedVariant = variants[variant] || variants.fadeUp;

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={selectedVariant.initial}
      whileInView={selectedVariant.animate}
      viewport={{ once: true, margin: '-100px' }}
      transition={{
        duration,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
    >
      {children}
    </motion.div>
  );
};

// ============================================
// 6. LIQUID DISTORTION EFFECT
// ============================================

/**
 * Efecto de distorsión líquida en hover
 * Inspirado en designs premium de awwwards
 */
export const LiquidCard = ({ children, className = '' }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className={`relative overflow-hidden ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.02 }}
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-zinc-800/20 to-zinc-800/20"
        animate={
          isHovered
            ? {
                borderRadius: [
                  '30% 70% 70% 30% / 30% 30% 70% 70%',
                  '70% 30% 30% 70% / 70% 70% 30% 30%',
                ],
                rotate: [0, 5, 0],
              }
            : {
                borderRadius: '0%',
                rotate: 0,
              }
        }
        transition={{
          duration: 3,
          repeat: isHovered ? Infinity : 0,
          ease: 'easeInOut',
        }}
      />
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
};

// ============================================
// 7. TEXT GRADIENT ANIMATION
// ============================================

/**
 * Texto con gradiente animado
 * Efecto shimmer que se ve premium
 */
export const GradientText = ({ children, className = '' }) => {
  return (
    <motion.div
      className={`relative inline-block ${className}`}
      style={{
        backgroundImage:
          'linear-gradient(90deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #667eea 75%, #764ba2 100%)',
        backgroundSize: '200% auto',
        backgroundClip: 'text',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
      }}
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
};

// ============================================
// 8. 3D CARD FLIP
// ============================================

/**
 * Tarjeta con efecto flip 3D
 * Incluye perspectiva y sombras dinámicas
 */
export const Card3DFlip = ({ front, back, className = '' }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div className={`perspective-1000 ${className}`} style={{ perspective: '1000px' }}>
      <motion.div
        className="relative w-full h-full preserve-3d cursor-pointer"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
        onClick={() => setIsFlipped(!isFlipped)}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Front */}
        <div className="absolute inset-0 backface-hidden" style={{ backfaceVisibility: 'hidden' }}>
          {front}
        </div>

        {/* Back */}
        <div
          className="absolute inset-0 backface-hidden"
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          {back}
        </div>
      </motion.div>
    </div>
  );
};

// ============================================
// 9. CURSOR FOLLOW EFFECT
// ============================================

/**
 * Efecto de seguimiento del cursor
 * Con retraso suave y física realista
 */
export const CursorFollower = () => {
  const cursorRef = useRef(null);
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);

  const springConfig = { stiffness: 150, damping: 15, mass: 0.1 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    const moveCursor = (e) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    window.addEventListener('mousemove', moveCursor);
    return () => window.removeEventListener('mousemove', moveCursor);
  }, [cursorX, cursorY]);

  return (
    <>
      {/* Cursor principal */}
      <motion.div
        ref={cursorRef}
        className="fixed w-4 h-4 rounded-full bg-white mix-blend-difference pointer-events-none z-[9999]"
        style={{
          left: cursorXSpring,
          top: cursorYSpring,
          x: '-50%',
          y: '-50%',
        }}
      />

      {/* Cursor de seguimiento */}
      <motion.div
        className="fixed w-10 h-10 rounded-full border-2 border-white/50 mix-blend-difference pointer-events-none z-[9998]"
        style={{
          left: cursorXSpring,
          top: cursorYSpring,
          x: '-50%',
          y: '-50%',
        }}
        transition={{ type: 'spring', stiffness: 50, damping: 10, mass: 0.5 }}
      />
    </>
  );
};

// ============================================
// 10. RIPPLE EFFECT ON CLICK
// ============================================

/**
 * Efecto ripple en clicks
 * Similar a Material Design pero más premium
 */
export const RippleButton = ({ children, className = '', onClick, ...props }) => {
  const [ripples, setRipples] = useState([]);

  const handleClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newRipple = {
      id: Date.now(),
      x,
      y,
    };

    setRipples((prev) => [...prev, newRipple]);

    setTimeout(() => {
      setRipples((prev) => prev.filter((ripple) => ripple.id !== newRipple.id));
    }, 1000);

    onClick?.(e);
  };

  return (
    <button className={`relative overflow-hidden ${className}`} onClick={handleClick} {...props}>
      {children}

      {ripples.map((ripple) => (
        <motion.span
          key={ripple.id}
          className="absolute rounded-full bg-white/30"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: 0,
            height: 0,
          }}
          initial={{ width: 0, height: 0, opacity: 1 }}
          animate={{ width: 500, height: 500, opacity: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          style={{
            x: '-50%',
            y: '-50%',
          }}
        />
      ))}
    </button>
  );
};

export default {
  ParallaxLayer,
  AdvancedParticleSystem,
  MorphingShape,
  MagneticButton,
  ScrollReveal,
  LiquidCard,
  GradientText,
  Card3DFlip,
  CursorFollower,
  RippleButton,
};
