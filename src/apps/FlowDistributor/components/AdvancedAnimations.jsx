/**
 * 🎨 ADVANCED ANIMATIONS ORCHESTRATOR
 * Sistema de orquestación de animaciones complejas con Framer Motion
 *
 * CARACTERÍSTICAS:
 * - Animaciones coordinadas con stagger
 * - Gestos avanzados (swipe, drag, pinch)
 * - Morphing shapes y transiciones fluidas
 * - Micro-interacciones sofisticadas
 * - Performance optimizado
 *
 * @version 1.0.0
 */
import { useEffect, useState } from 'react';

import { AnimatePresence, motion, useAnimation, useMotionValue, useTransform } from 'framer-motion';

/**
 * 🎭 VARIANTES DE ANIMACIÓN PREMIUM
 */
const animationVariants = {
  // Fade con scale
  fadeScale: {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5, ease: [0.6, -0.05, 0.01, 0.99] },
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      transition: { duration: 0.3 },
    },
  },

  // Slide desde abajo con bounce
  slideUpBounce: {
    hidden: { y: 100, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 20,
        mass: 0.8,
      },
    },
  },

  // Morphing card
  morphingCard: {
    collapsed: {
      scale: 0.95,
      borderRadius: '24px',
      transition: { duration: 0.4, ease: 'easeInOut' },
    },
    expanded: {
      scale: 1,
      borderRadius: '16px',
      transition: { duration: 0.4, ease: 'easeInOut' },
    },
  },

  // Stagger children
  staggerContainer: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  },

  staggerItem: {
    hidden: { opacity: 0, y: 20, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 400,
        damping: 25,
      },
    },
  },

  // Flip card 3D
  flipCard: {
    front: {
      rotateY: 0,
      transition: { duration: 0.6, ease: [0.43, 0.13, 0.23, 0.96] },
    },
    back: {
      rotateY: 180,
      transition: { duration: 0.6, ease: [0.43, 0.13, 0.23, 0.96] },
    },
  },

  // Glow pulse
  glowPulse: {
    initial: { filter: 'brightness(1) blur(0px)' },
    animate: {
      filter: ['brightness(1) blur(0px)', 'brightness(1.2) blur(4px)', 'brightness(1) blur(0px)'],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  },
};

/**
 * 🎨 COMPONENTE: Card con Morphing
 */
export const MorphingCard = ({ children, isExpanded, className = '' }) => {
  return (
    <motion.div
      variants={animationVariants.morphingCard}
      animate={isExpanded ? 'expanded' : 'collapsed'}
      className={className}
    >
      {children}
    </motion.div>
  );
};

/**
 * 🎨 COMPONENTE: Container con Stagger
 */
export const StaggerContainer = ({ children, className = '' }) => {
  return (
    <motion.div
      variants={animationVariants.staggerContainer}
      initial="hidden"
      animate="visible"
      className={className}
    >
      {children}
    </motion.div>
  );
};

/**
 * 🎨 COMPONENTE: Item con Stagger
 */
export const StaggerItem = ({ children, className = '', delay = 0 }) => {
  return (
    <motion.div variants={animationVariants.staggerItem} custom={delay} className={className}>
      {children}
    </motion.div>
  );
};

/**
 * 🎨 COMPONENTE: Flip Card 3D
 */
export const FlipCard3D = ({ front, back, isFlipped }) => {
  return (
    <div className="relative w-full h-full perspective-1000">
      <AnimatePresence mode="wait">
        {!isFlipped ? (
          <motion.div
            key="front"
            variants={animationVariants.flipCard}
            initial="front"
            animate="front"
            exit="back"
            className="absolute inset-0 backface-hidden"
            style={{ transformStyle: 'preserve-3d' }}
          >
            {front}
          </motion.div>
        ) : (
          <motion.div
            key="back"
            variants={animationVariants.flipCard}
            initial="front"
            animate="back"
            exit="front"
            className="absolute inset-0 backface-hidden"
            style={{ transformStyle: 'preserve-3d', transform: 'rotateY(180deg)' }}
          >
            {back}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/**
 * 🎨 COMPONENTE: Cursor Follow Element
 */
export const CursorFollowElement = ({ children, className = '' }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useTransform(y, [-100, 100], [10, -10]);
  const rotateY = useTransform(x, [-100, 100], [-10, 10]);

  const handleMouse = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set(event.clientX - centerX);
    y.set(event.clientY - centerY);
  };

  return (
    <motion.div
      onMouseMove={handleMouse}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

/**
 * 🎨 COMPONENTE: Magnetic Button
 */
export const MagneticButton = ({ children, className = '', onClick }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    if (!isHovered) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setPosition({ x: x * 0.3, y: y * 0.3 });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.button
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      animate={{
        x: position.x,
        y: position.y,
      }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      className={className}
    >
      {children}
    </motion.button>
  );
};

/**
 * 🎨 COMPONENTE: Parallax Layer
 */
export const ParallaxLayer = ({ children, speed = 0.5, className = '' }) => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.div
      style={{
        y: scrollY * speed,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

/**
 * 🎨 COMPONENTE: Morphing Shape
 */
const MORPHING_SHAPES = {
  circle: { borderRadius: '50%' },
  square: { borderRadius: '0%' },
  rounded: { borderRadius: '24px' },
  blob: { borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%' },
};

export const MorphingShape = ({ _variant = 'circle', className = '' }) => {
  const [currentShape, setCurrentShape] = useState('circle');

  useEffect(() => {
    const shapeKeys = Object.keys(MORPHING_SHAPES);
    let index = 0;
    const interval = setInterval(() => {
      index = (index + 1) % shapeKeys.length;
      setCurrentShape(shapeKeys[index]);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      animate={MORPHING_SHAPES[currentShape]}
      transition={{ duration: 1, ease: 'easeInOut' }}
      className={className}
    />
  );
};

/**
 * 🎨 HOOK: Gesture Controls
 */
const useGestureControls = () => {
  const controls = useAnimation();

  const handleSwipeLeft = () => {
    controls.start({
      x: -100,
      opacity: 0,
      transition: { duration: 0.3 },
    });
  };

  const handleSwipeRight = () => {
    controls.start({
      x: 100,
      opacity: 0,
      transition: { duration: 0.3 },
    });
  };

  const handleDragEnd = (event, info) => {
    if (Math.abs(info.offset.x) > 100) {
      if (info.offset.x > 0) {
        handleSwipeRight();
      } else {
        handleSwipeLeft();
      }
    } else {
      controls.start({ x: 0, opacity: 1 });
    }
  };

  return {
    controls,
    handleDragEnd,
    dragProps: {
      drag: 'x',
      dragConstraints: { left: 0, right: 0 },
      onDragEnd: handleDragEnd,
    },
  };
};

/**
 * 🎨 EXPORTACIONES
 */
export default {
  animationVariants,
  MorphingCard,
  StaggerContainer,
  StaggerItem,
  FlipCard3D,
  CursorFollowElement,
  MagneticButton,
  ParallaxLayer,
  MorphingShape,
  useGestureControls,
};
