/**
 * 🎬 ADVANCED ANIMATIONS & MICROINTERACTIONS
 * Sistema de animaciones premium y microinteracciones
 */

// Framer Motion Variants
export const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
};

export const fadeInDown = {
  initial: { opacity: 0, y: -20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 20 },
  transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
};

export const fadeInLeft = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 },
  transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
};

export const fadeInRight = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
  transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
};

export const scaleIn = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
  transition: { duration: 0.25, ease: [0.4, 0, 0.2, 1] },
};

export const scaleInBounce = {
  initial: { opacity: 0, scale: 0.8 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 260,
      damping: 20,
    },
  },
  exit: { opacity: 0, scale: 0.8 },
};

export const slideInFromBottom = {
  initial: { y: '100%' },
  animate: { y: 0 },
  exit: { y: '100%' },
  transition: { duration: 0.35, ease: [0.4, 0, 0.2, 1] },
};

export const slideInFromTop = {
  initial: { y: '-100%' },
  animate: { y: 0 },
  exit: { y: '-100%' },
  transition: { duration: 0.35, ease: [0.4, 0, 0.2, 1] },
};

export const slideInFromLeft = {
  initial: { x: '-100%' },
  animate: { x: 0 },
  exit: { x: '-100%' },
  transition: { duration: 0.35, ease: [0.4, 0, 0.2, 1] },
};

export const slideInFromRight = {
  initial: { x: '100%' },
  animate: { x: 0 },
  exit: { x: '100%' },
  transition: { duration: 0.35, ease: [0.4, 0, 0.2, 1] },
};

// Stagger Animations
export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
};

export const staggerItem = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.3 },
};

// Card Hover Effects
export const cardHover = {
  rest: {
    scale: 1,
    y: 0,
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.9)',
    transition: { duration: 0.25, ease: [0.4, 0, 0.2, 1] },
  },
  hover: {
    scale: 1.02,
    y: -4,
    boxShadow: '0 16px 32px rgba(0, 0, 0, 0.94)',
    transition: { duration: 0.25, ease: [0.4, 0, 0.2, 1] },
  },
  tap: {
    scale: 0.98,
  },
};

export const buttonHover = {
  rest: {
    scale: 1,
    transition: { duration: 0.15, ease: [0.4, 0, 0.2, 1] },
  },
  hover: {
    scale: 1.05,
    transition: { duration: 0.15, ease: [0.4, 0, 0.2, 1] },
  },
  tap: {
    scale: 0.95,
  },
};

// Sidebar Animations
export const sidebarVariants = {
  collapsed: {
    width: 72,
    transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
  },
  expanded: {
    width: 280,
    transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
  },
};

export const sidebarItemVariants = {
  collapsed: {
    opacity: 0,
    x: -10,
    transition: { duration: 0.2 },
  },
  expanded: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.3, delay: 0.1 },
  },
};

// Modal/Dialog Animations
export const modalBackdrop = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.2 },
};

export const modalContent = {
  initial: { opacity: 0, scale: 0.95, y: 20 },
  animate: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.95, y: 20 },
  transition: { duration: 0.25, ease: [0.4, 0, 0.2, 1] },
};

// Dropdown/Menu Animations
export const dropdownContainer = {
  initial: { opacity: 0, scale: 0.95, y: -10 },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.2,
      ease: [0.4, 0, 0.2, 1],
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: -10,
    transition: {
      duration: 0.15,
    },
  },
};

export const dropdownItem = {
  initial: { opacity: 0, x: -10 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -10 },
};

// Toast Notifications
export const toastVariants = {
  initial: { opacity: 0, y: 50, scale: 0.3 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: 20, scale: 0.5 },
  transition: {
    duration: 0.3,
    ease: [0.4, 0, 0.2, 1],
  },
};

// Number Counter Animation
export const counterAnimation = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] },
};

// Progress Bar
export const progressBar = {
  initial: { scaleX: 0, originX: 0 },
  animate: { scaleX: 1 },
  transition: { duration: 0.8, ease: [0.4, 0, 0.2, 1] },
};

// Shimmer/Skeleton Loading
export const shimmerAnimation = {
  animate: {
    backgroundPosition: ['200% 0', '-200% 0'],
    transition: {
      duration: 2,
      ease: 'linear',
      repeat: Infinity,
    },
  },
};

// Page Transitions
export const pageTransition = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
};

// Tab Switching
export const tabContent = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 },
  transition: { duration: 0.2 },
};

// Accordion
export const accordionContent = {
  initial: { height: 0, opacity: 0 },
  animate: {
    height: 'auto',
    opacity: 1,
    transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
  },
  exit: {
    height: 0,
    opacity: 0,
    transition: { duration: 0.2 },
  },
};

// Floating Action Button
export const fabVariants = {
  initial: { scale: 0, rotate: -180 },
  animate: { scale: 1, rotate: 0 },
  exit: { scale: 0, rotate: 180 },
  hover: { scale: 1.1, rotate: 90 },
  tap: { scale: 0.9 },
};

// Ripple Effect (for buttons)
export const rippleVariants = {
  initial: { scale: 0, opacity: 0.5 },
  animate: {
    scale: 4,
    opacity: 0,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
};

// Microinteraction: Success Check
export const successCheck = {
  initial: { pathLength: 0, opacity: 0 },
  animate: {
    pathLength: 1,
    opacity: 1,
    transition: { duration: 0.5, ease: 'easeInOut' },
  },
};

// Microinteraction: Loading Spinner
export const spinnerVariants = {
  animate: {
    rotate: 360,
    transition: {
      duration: 1,
      ease: 'linear',
      repeat: Infinity,
    },
  },
};

// Pulse Animation
export const pulseVariants = {
  animate: {
    scale: [1, 1.05, 1],
    opacity: [1, 0.8, 1],
    transition: {
      duration: 2,
      ease: 'easeInOut',
      repeat: Infinity,
    },
  },
};

// Bounce Animation
export const bounceVariants = {
  animate: {
    y: [0, -10, 0],
    transition: {
      duration: 0.6,
      ease: 'easeInOut',
      repeat: Infinity,
      repeatDelay: 0.5,
    },
  },
};

// Smooth Spring Configs
export const springConfigs = {
  gentle: { type: 'spring', stiffness: 100, damping: 15 },
  smooth: { type: 'spring', stiffness: 200, damping: 20 },
  snappy: { type: 'spring', stiffness: 300, damping: 25 },
  bouncy: { type: 'spring', stiffness: 260, damping: 12 },
};

// Easing Functions
export const easings = {
  smooth: [0.4, 0, 0.2, 1],
  expo: [0.87, 0, 0.13, 1],
  circ: [0.85, 0, 0.15, 1],
  back: [0.68, -0.55, 0.265, 1.55],
};

// Utility: Create stagger animation
export const createStagger = (staggerDelay = 0.05, delayChildren = 0) => ({
  animate: {
    transition: {
      staggerChildren: staggerDelay,
      delayChildren: delayChildren,
    },
  },
});

// Utility: Create fade with direction
export const createFade = (direction = 'up', distance = 20) => {
  const axis = ['up', 'down'].includes(direction) ? 'y' : 'x';
  const value = ['up', 'left'].includes(direction) ? distance : -distance;

  return {
    initial: { opacity: 0, [axis]: value },
    animate: { opacity: 1, [axis]: 0 },
    exit: { opacity: 0, [axis]: -value },
    transition: { duration: 0.3, ease: easings.smooth },
  };
};

export default {
  fadeInUp,
  fadeInDown,
  fadeInLeft,
  fadeInRight,
  scaleIn,
  scaleInBounce,
  slideInFromBottom,
  slideInFromTop,
  slideInFromLeft,
  slideInFromRight,
  staggerContainer,
  staggerItem,
  cardHover,
  buttonHover,
  sidebarVariants,
  sidebarItemVariants,
  modalBackdrop,
  modalContent,
  dropdownContainer,
  dropdownItem,
  toastVariants,
  counterAnimation,
  progressBar,
  shimmerAnimation,
  pageTransition,
  tabContent,
  accordionContent,
  fabVariants,
  rippleVariants,
  successCheck,
  spinnerVariants,
  pulseVariants,
  bounceVariants,
  springConfigs,
  easings,
  createStagger,
  createFade,
};
