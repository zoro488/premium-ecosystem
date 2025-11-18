/**
 * ═══════════════════════════════════════════════════════════════════
 * PREMIUM ANIMATIONS LIBRARY - ULTRA BLACK THEME
 * ═══════════════════════════════════════════════════════════════════
 * Comprehensive animation system with Framer Motion variants
 * All colors optimized for ultra-premium black zinc theme
 */

// ═══════════════════════════════════════════════════════════════════
// TRANSITION PRESETS
// ═══════════════════════════════════════════════════════════════════

export const transitions = {
  // Ultra smooth cubic bezier transitions
  smooth: {
    type: 'spring',
    stiffness: 300,
    damping: 30,
  },

  // Quick responsive transitions for UI elements
  quick: {
    type: 'spring',
    stiffness: 400,
    damping: 25,
  },

  // Slow elegant transitions for large elements
  elegant: {
    type: 'spring',
    stiffness: 200,
    damping: 35,
  },

  // Bounce effect for fun interactions
  bounce: {
    type: 'spring',
    stiffness: 600,
    damping: 20,
  },

  // Standard ease transition
  ease: {
    duration: 0.3,
    ease: [0.25, 0.1, 0.25, 1],
  },
};

// ═══════════════════════════════════════════════════════════════════
// ANIMATION VARIANTS
// ═══════════════════════════════════════════════════════════════════

export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: transitions.smooth,
};

export const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: transitions.smooth,
};

export const fadeInDown = {
  initial: { opacity: 0, y: -20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 20 },
  transition: transitions.smooth,
};

export const fadeInLeft = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 },
  transition: transitions.smooth,
};

export const fadeInRight = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
  transition: transitions.smooth,
};

export const scaleIn = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.9 },
  transition: transitions.smooth,
};

export const scaleInBounce = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.8 },
  transition: transitions.bounce,
};

export const slideInUp = {
  initial: { y: '100%', opacity: 0 },
  animate: { y: 0, opacity: 1 },
  exit: { y: '100%', opacity: 0 },
  transition: transitions.smooth,
};

export const slideInDown = {
  initial: { y: '-100%', opacity: 0 },
  animate: { y: 0, opacity: 1 },
  exit: { y: '-100%', opacity: 0 },
  transition: transitions.smooth,
};

export const slideInLeft = {
  initial: { x: '-100%', opacity: 0 },
  animate: { x: 0, opacity: 1 },
  exit: { x: '-100%', opacity: 0 },
  transition: transitions.smooth,
};

export const slideInRight = {
  initial: { x: '100%', opacity: 0 },
  animate: { x: 0, opacity: 1 },
  exit: { x: '100%', opacity: 0 },
  transition: transitions.smooth,
};

// ═══════════════════════════════════════════════════════════════════
// HOVER ANIMATIONS
// ═══════════════════════════════════════════════════════════════════

export const hoverScale = {
  whileHover: { scale: 1.05 },
  whileTap: { scale: 0.95 },
  transition: transitions.quick,
};

export const hoverLift = {
  whileHover: { y: -4, scale: 1.02 },
  whileTap: { y: 0, scale: 0.98 },
  transition: transitions.quick,
};

export const hoverRotate = {
  whileHover: { rotate: 5, scale: 1.05 },
  whileTap: { rotate: 0, scale: 0.95 },
  transition: transitions.quick,
};

export const hoverGlow = {
  whileHover: {
    boxShadow: '0 0 20px rgba(161, 161, 170, 0.3)', // zinc-400
  },
  transition: transitions.quick,
};

// ═══════════════════════════════════════════════════════════════════
// CARD ANIMATIONS
// ═══════════════════════════════════════════════════════════════════

export const cardVariants = {
  initial: { opacity: 0, y: 20, scale: 0.95 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: transitions.smooth,
  },
  hover: {
    y: -8,
    scale: 1.02,
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
    transition: transitions.quick,
  },
  tap: {
    scale: 0.98,
    transition: transitions.quick,
  },
  exit: {
    opacity: 0,
    y: -20,
    scale: 0.95,
    transition: transitions.smooth,
  },
};

export const cardFlip = {
  initial: { rotateY: 0 },
  hover: { rotateY: 180 },
  transition: { duration: 0.6, type: 'spring' },
};

// ═══════════════════════════════════════════════════════════════════
// BUTTON ANIMATIONS
// ═══════════════════════════════════════════════════════════════════

export const buttonVariants = {
  initial: { scale: 1 },
  hover: {
    scale: 1.05,
    boxShadow: '0 10px 20px rgba(0, 0, 0, 0.2)',
    transition: transitions.quick,
  },
  tap: {
    scale: 0.95,
    transition: transitions.quick,
  },
};

export const buttonPulse = {
  animate: {
    scale: [1, 1.05, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

// ═══════════════════════════════════════════════════════════════════
// MODAL/DIALOG ANIMATIONS
// ═══════════════════════════════════════════════════════════════════

export const modalVariants = {
  initial: { opacity: 0, scale: 0.9, y: 20 },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: transitions.smooth,
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    y: 20,
    transition: transitions.smooth,
  },
};

export const modalBackdrop = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.2 },
};

// ═══════════════════════════════════════════════════════════════════
// SIDEBAR ANIMATIONS
// ═══════════════════════════════════════════════════════════════════

export const sidebarExpand = {
  collapsed: { width: 72 },
  expanded: { width: 280 },
  transition: transitions.smooth,
};

export const sidebarItemHover = {
  initial: { x: 0, backgroundColor: 'transparent' },
  hover: {
    x: 4,
    backgroundColor: 'rgba(39, 39, 42, 0.5)', // zinc-800/50
    transition: transitions.quick,
  },
};

// ═══════════════════════════════════════════════════════════════════
// LIST/STAGGER ANIMATIONS
// ═══════════════════════════════════════════════════════════════════

export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export const staggerItem = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: transitions.smooth,
  },
};

// ═══════════════════════════════════════════════════════════════════
// LOADING ANIMATIONS
// ═══════════════════════════════════════════════════════════════════

export const spinnerVariants = {
  animate: {
    rotate: 360,
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: 'linear',
    },
  },
};

export const pulseVariants = {
  animate: {
    scale: [1, 1.1, 1],
    opacity: [1, 0.8, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

// ═══════════════════════════════════════════════════════════════════
// PAGE TRANSITION ANIMATIONS
// ═══════════════════════════════════════════════════════════════════

export const pageTransition = {
  initial: { opacity: 0, x: -20 },
  animate: {
    opacity: 1,
    x: 0,
    transition: transitions.elegant,
  },
  exit: {
    opacity: 0,
    x: 20,
    transition: transitions.elegant,
  },
};

// ═══════════════════════════════════════════════════════════════════
// NOTIFICATION ANIMATIONS
// ═══════════════════════════════════════════════════════════════════

export const notificationSlide = {
  initial: { x: 400, opacity: 0 },
  animate: {
    x: 0,
    opacity: 1,
    transition: transitions.smooth,
  },
  exit: {
    x: 400,
    opacity: 0,
    transition: transitions.smooth,
  },
};

// ═══════════════════════════════════════════════════════════════════
// GRADIENT ANIMATION (for backgrounds)
// ═══════════════════════════════════════════════════════════════════

export const gradientShift = {
  animate: {
    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
    transition: {
      duration: 10,
      repeat: Infinity,
      ease: 'linear',
    },
  },
};

// ═══════════════════════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════════════

/**
 * Create a custom stagger animation with configurable delay
 */
export const createStaggerAnimation = (delayPerItem = 0.1) => ({
  container: {
    animate: {
      transition: {
        staggerChildren: delayPerItem,
      },
    },
  },
  item: staggerItem,
});

/**
 * Create a custom slide animation from any direction
 */
export const createSlideAnimation = (direction = 'up', distance = 100) => {
  const directions = {
    up: { y: distance },
    down: { y: -distance },
    left: { x: distance },
    right: { x: -distance },
  };

  return {
    initial: { ...directions[direction], opacity: 0 },
    animate: { x: 0, y: 0, opacity: 1 },
    exit: { ...directions[direction], opacity: 0 },
    transition: transitions.smooth,
  };
};

/**
 * Combine multiple animation variants
 */
export const combineVariants = (...variants) => {
  return variants.reduce(
    (acc, variant) => ({
      ...acc,
      ...variant,
    }),
    {}
  );
};

export default {
  transitions,
  fadeIn,
  fadeInUp,
  fadeInDown,
  fadeInLeft,
  fadeInRight,
  scaleIn,
  scaleInBounce,
  slideInUp,
  slideInDown,
  slideInLeft,
  slideInRight,
  hoverScale,
  hoverLift,
  hoverRotate,
  hoverGlow,
  cardVariants,
  cardFlip,
  buttonVariants,
  buttonPulse,
  modalVariants,
  modalBackdrop,
  sidebarExpand,
  sidebarItemHover,
  staggerContainer,
  staggerItem,
  spinnerVariants,
  pulseVariants,
  pageTransition,
  notificationSlide,
  gradientShift,
  createStaggerAnimation,
  createSlideAnimation,
  combineVariants,
};
