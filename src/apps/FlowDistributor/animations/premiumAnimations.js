/**
 * 🎨 ANIMATION SYSTEM - Premium Framer Motion Variants
 *
 * Sistema completo de animaciones fluidas, suaves y complejas para
 * todos los componentes del sistema FlowDistributor/Chronos
 */

// ============================================================================
// CONTAINER ANIMATIONS
// ============================================================================

export const containerVariants = {
  hidden: {
    opacity: 0,
  },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
      when: 'beforeChildren',
    },
  },
  exit: {
    opacity: 0,
    transition: {
      staggerChildren: 0.05,
      staggerDirection: -1,
      when: 'afterChildren',
    },
  },
};

export const gridContainerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.15,
    },
  },
};

// ============================================================================
// CARD ANIMATIONS
// ============================================================================

export const cardVariants = {
  hidden: {
    opacity: 0,
    y: 20,
    scale: 0.95,
  },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 25,
      mass: 0.8,
    },
  },
  exit: {
    opacity: 0,
    y: -10,
    scale: 0.98,
    transition: {
      duration: 0.2,
    },
  },
};

export const kpiCardVariants = {
  hidden: {
    opacity: 0,
    y: 30,
    scale: 0.9,
    rotateX: -15,
  },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    rotateX: 0,
    transition: {
      type: 'spring',
      stiffness: 260,
      damping: 20,
    },
  },
};

// ============================================================================
// HOVER EFFECTS
// ============================================================================

export const hoverLift = {
  hover: {
    scale: 1.02,
    y: -4,
    boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 15,
    },
  },
  tap: {
    scale: 0.98,
  },
};

export const hoverGlow = {
  hover: {
    scale: 1.05,
    boxShadow: '0 0 40px rgba(59, 130, 246, 0.6), 0 0 80px rgba(59, 130, 246, 0.3)',
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 10,
    },
  },
};

export const hoverShine = {
  hover: {
    scale: 1.03,
    filter: 'brightness(1.15)',
    transition: {
      type: 'spring',
      stiffness: 500,
      damping: 20,
    },
  },
};

// ============================================================================
// TABLE ANIMATIONS
// ============================================================================

export const tableContainerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.03,
      delayChildren: 0.1,
    },
  },
};

export const tableRowVariants = {
  hidden: {
    opacity: 0,
    x: -20,
  },
  show: {
    opacity: 1,
    x: 0,
    transition: {
      type: 'spring',
      stiffness: 350,
      damping: 30,
    },
  },
};

export const tableRowHover = {
  hover: {
    x: 4,
    backgroundColor: 'rgba(59, 130, 246, 0.08)',
    scale: 1.005,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 15,
    },
  },
};

// ============================================================================
// BUTTON ANIMATIONS
// ============================================================================

export const buttonVariants = {
  initial: {
    scale: 1,
  },
  hover: {
    scale: 1.05,
    boxShadow: '0 10px 30px rgba(0,0,0,0.25)',
    transition: {
      type: 'spring',
      stiffness: 500,
      damping: 15,
    },
  },
  tap: {
    scale: 0.95,
    transition: {
      type: 'spring',
      stiffness: 600,
      damping: 20,
    },
  },
};

export const iconButtonVariants = {
  initial: {
    scale: 1,
    rotate: 0,
  },
  hover: {
    scale: 1.15,
    rotate: 5,
    transition: {
      type: 'spring',
      stiffness: 500,
      damping: 10,
    },
  },
  tap: {
    scale: 0.9,
    rotate: -5,
  },
};

// ============================================================================
// TEXT ANIMATIONS
// ============================================================================

export const fadeInUp = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
};

export const slideInRight = {
  hidden: {
    opacity: 0,
    x: 50,
  },
  show: {
    opacity: 1,
    x: 0,
    transition: {
      type: 'spring',
      stiffness: 200,
      damping: 20,
    },
  },
};

// ============================================================================
// NUMBER COUNTER ANIMATIONS
// ============================================================================

export const counterVariants = {
  hidden: {
    opacity: 0,
    scale: 0.5,
  },
  show: {
    opacity: 1,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 200,
      damping: 15,
    },
  },
};

// ============================================================================
// LIQUID/GLASS MORPHISM EFFECTS
// ============================================================================

export const liquidCardVariants = {
  hidden: {
    opacity: 0,
    scale: 0.8,
    borderRadius: '50%',
  },
  show: {
    opacity: 1,
    scale: 1,
    borderRadius: '1.5rem',
    transition: {
      type: 'spring',
      stiffness: 200,
      damping: 20,
      duration: 0.8,
    },
  },
};

export const glassVariants = {
  initial: {
    backdropFilter: 'blur(0px)',
  },
  animate: {
    backdropFilter: 'blur(16px)',
    transition: {
      duration: 0.6,
      ease: 'easeInOut',
    },
  },
};

// ============================================================================
// MODAL/OVERLAY ANIMATIONS
// ============================================================================

export const modalVariants = {
  hidden: {
    opacity: 0,
    scale: 0.9,
    y: 50,
  },
  show: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 25,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 20,
    transition: {
      duration: 0.2,
    },
  },
};

export const overlayVariants = {
  hidden: {
    opacity: 0,
  },
  show: {
    opacity: 1,
    transition: {
      duration: 0.3,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.2,
    },
  },
};

// ============================================================================
// BADGE/PILL ANIMATIONS
// ============================================================================

export const badgeVariants = {
  hidden: {
    opacity: 0,
    scale: 0,
  },
  show: {
    opacity: 1,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 500,
      damping: 15,
    },
  },
};

export const badgePulse = {
  initial: {
    scale: 1,
  },
  animate: {
    scale: [1, 1.1, 1],
    transition: {
      repeat: Infinity,
      duration: 2,
      ease: 'easeInOut',
    },
  },
};

// ============================================================================
// CHART/GRAPH ANIMATIONS
// ============================================================================

export const chartVariants = {
  hidden: {
    pathLength: 0,
    opacity: 0,
  },
  show: {
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: {
        type: 'spring',
        stiffness: 100,
        damping: 20,
        duration: 1.5,
      },
      opacity: {
        duration: 0.5,
      },
    },
  },
};

export const barChartVariants = {
  hidden: {
    scaleY: 0,
    originY: 1,
  },
  show: (i) => ({
    scaleY: 1,
    transition: {
      delay: i * 0.1,
      type: 'spring',
      stiffness: 200,
      damping: 15,
    },
  }),
};

// ============================================================================
// LOADING/SKELETON ANIMATIONS
// ============================================================================

export const skeletonVariants = {
  initial: {
    backgroundPosition: '-200px 0',
  },
  animate: {
    backgroundPosition: 'calc(200px + 100%) 0',
    transition: {
      repeat: Infinity,
      duration: 1.5,
      ease: 'linear',
    },
  },
};

export const spinnerVariants = {
  animate: {
    rotate: 360,
    transition: {
      repeat: Infinity,
      duration: 1,
      ease: 'linear',
    },
  },
};

// ============================================================================
// PAGE TRANSITIONS
// ============================================================================

export const pageVariants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.3,
    },
  },
};

// ============================================================================
// SCROLL ANIMATIONS
// ============================================================================

export const scrollFadeIn = {
  hidden: {
    opacity: 0,
    y: 50,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: 'easeOut',
    },
  },
};

// ============================================================================
// MICRO-INTERACTIONS
// ============================================================================

export const rippleEffect = {
  initial: {
    scale: 0,
    opacity: 0.5,
  },
  animate: {
    scale: 2,
    opacity: 0,
    transition: {
      duration: 0.6,
      ease: 'easeOut',
    },
  },
};

export const heartbeat = {
  animate: {
    scale: [1, 1.05, 1],
    transition: {
      repeat: Infinity,
      duration: 1.5,
      ease: 'easeInOut',
    },
  },
};

// ============================================================================
// SPRING PRESETS
// ============================================================================

export const springPresets = {
  gentle: {
    type: 'spring',
    stiffness: 200,
    damping: 20,
  },
  bouncy: {
    type: 'spring',
    stiffness: 400,
    damping: 15,
  },
  snappy: {
    type: 'spring',
    stiffness: 500,
    damping: 25,
  },
  smooth: {
    type: 'spring',
    stiffness: 300,
    damping: 30,
  },
};

export default {
  containerVariants,
  gridContainerVariants,
  cardVariants,
  kpiCardVariants,
  hoverLift,
  hoverGlow,
  hoverShine,
  tableContainerVariants,
  tableRowVariants,
  tableRowHover,
  buttonVariants,
  iconButtonVariants,
  fadeInUp,
  slideInRight,
  counterVariants,
  liquidCardVariants,
  glassVariants,
  modalVariants,
  overlayVariants,
  badgeVariants,
  badgePulse,
  chartVariants,
  barChartVariants,
  skeletonVariants,
  spinnerVariants,
  pageVariants,
  scrollFadeIn,
  rippleEffect,
  heartbeat,
  springPresets,
};
