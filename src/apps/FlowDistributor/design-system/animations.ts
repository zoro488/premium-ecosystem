/**
 * ✨ FLOWDISTRIBUTOR ANIMATIONS - SISTEMA PREMIUM DEFINITIVO
 * Biblioteca completa de animaciones fluidas, suaves y elegantes
 * @version 5.0.0 - ULTRA PREMIUM
 */
import { Variants } from 'framer-motion';

/**
 * 🎭 CONTAINER ANIMATIONS
 * Animaciones para contenedores y layouts
 */
export const containerAnimations = {
  /**
   * Entrada con fade + slide desde abajo
   */
  fadeSlideUp: {
    initial: { opacity: 0, y: 40 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 15,
      mass: 1,
    },
  } as Variants,

  /**
   * Entrada con fade + scale
   */
  fadeScale: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
    transition: {
      type: 'spring',
      stiffness: 200,
      damping: 20,
    },
  } as Variants,

  /**
   * Stagger children (para listas)
   */
  staggerContainer: {
    initial: {},
    animate: {
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1,
      },
    },
    exit: {
      transition: {
        staggerChildren: 0.03,
        staggerDirection: -1,
      },
    },
  } as Variants,

  /**
   * Blur fade (glassmorphism)
   */
  blurFade: {
    initial: { opacity: 0, filter: 'blur(20px)' },
    animate: { opacity: 1, filter: 'blur(0px)' },
    exit: { opacity: 0, filter: 'blur(10px)' },
    transition: {
      duration: 0.6,
      ease: [0.25, 0.1, 0.25, 1],
    },
  } as Variants,

  /**
   * 3D Rotation entrance
   */
  rotate3D: {
    initial: { opacity: 0, rotateX: -15, rotateY: 15 },
    animate: { opacity: 1, rotateX: 0, rotateY: 0 },
    exit: { opacity: 0, rotateX: 15, rotateY: -15 },
    transition: {
      type: 'spring',
      stiffness: 80,
      damping: 12,
    },
  } as Variants,
};

/**
 * 🃏 CARD ANIMATIONS
 * Animaciones para tarjetas y paneles
 */
export const cardAnimations = {
  /**
   * Hover con lift + glow
   */
  hoverLift: {
    rest: { y: 0, scale: 1 },
    hover: {
      y: -8,
      scale: 1.02,
      boxShadow: '0 20px 40px -12px rgba(0, 0, 0, 0.3)',
      transition: {
        type: 'spring',
        stiffness: 400,
        damping: 17,
      },
    },
    tap: { scale: 0.98 },
  } as Variants,

  /**
   * Glassmorphism card
   */
  glassCard: {
    initial: {
      opacity: 0,
      backdropFilter: 'blur(0px)',
      scale: 0.95,
    },
    animate: {
      opacity: 1,
      backdropFilter: 'blur(24px)',
      scale: 1,
    },
    hover: {
      backdropFilter: 'blur(32px)',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
    },
    transition: {
      type: 'spring',
      stiffness: 260,
      damping: 20,
    },
  } as Variants,

  /**
   * Tilt 3D effect
   */
  tilt3D: {
    hover: {
      rotateX: 5,
      rotateY: 5,
      scale: 1.05,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 15,
      },
    },
  } as Variants,

  /**
   * Glow pulse (para KPI cards)
   */
  glowPulse: {
    initial: { boxShadow: '0 0 0 0 rgba(59, 130, 246, 0)' },
    animate: {
      boxShadow: ['0 0 0 0 rgba(59, 130, 246, 0.4)', '0 0 20px 10px rgba(59, 130, 246, 0)'],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  } as Variants,

  /**
   * Shimmer effect
   */
  shimmer: {
    animate: {
      backgroundPosition: ['200% 0', '-200% 0'],
      transition: {
        duration: 8,
        repeat: Infinity,
        ease: 'linear',
      },
    },
  } as Variants,
};

/**
 * 📊 TABLE & LIST ANIMATIONS
 */
export const tableAnimations = {
  /**
   * Row stagger (para filas de tabla)
   */
  rowStagger: {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 24,
    },
  } as Variants,

  /**
   * Hover row highlight
   */
  rowHover: {
    rest: { backgroundColor: 'rgba(255, 255, 255, 0.05)' },
    hover: {
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      scale: 1.01,
      transition: { duration: 0.2 },
    },
  } as Variants,

  /**
   * Sort animation
   */
  sortTransition: {
    layout: true,
    transition: {
      type: 'spring',
      stiffness: 350,
      damping: 25,
    },
  } as Variants,

  /**
   * Empty state
   */
  emptyState: {
    initial: { opacity: 0, scale: 0.8 },
    animate: {
      opacity: 1,
      scale: 1,
      transition: {
        delay: 0.5,
        type: 'spring',
        stiffness: 200,
        damping: 15,
      },
    },
  } as Variants,
};

/**
 * 🔘 BUTTON & INTERACTIVE ANIMATIONS
 */
export const buttonAnimations = {
  /**
   * Primary button
   */
  primary: {
    rest: { scale: 1 },
    hover: {
      scale: 1.05,
      boxShadow: '0 8px 16px rgba(59, 130, 246, 0.3)',
      transition: {
        type: 'spring',
        stiffness: 400,
        damping: 10,
      },
    },
    tap: { scale: 0.95 },
  } as Variants,

  /**
   * Icon button rotation
   */
  iconRotate: {
    rest: { rotate: 0 },
    hover: {
      rotate: 360,
      transition: {
        duration: 0.5,
        ease: 'easeInOut',
      },
    },
  } as Variants,

  /**
   * Ripple effect
   */
  ripple: {
    initial: { scale: 0, opacity: 0.5 },
    animate: { scale: 2, opacity: 0 },
    transition: { duration: 0.6, ease: 'easeOut' },
  } as Variants,

  /**
   * Loading pulse
   */
  loadingPulse: {
    animate: {
      scale: [1, 1.05, 1],
      opacity: [1, 0.8, 1],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  } as Variants,

  /**
   * Success check
   */
  successCheck: {
    initial: { pathLength: 0, opacity: 0 },
    animate: {
      pathLength: 1,
      opacity: 1,
      transition: {
        pathLength: {
          type: 'spring',
          duration: 0.6,
          bounce: 0,
        },
        opacity: { duration: 0.2 },
      },
    },
  } as Variants,
};

/**
 * 📈 CHART & DATA VIZ ANIMATIONS
 */
export const chartAnimations = {
  /**
   * Bar grow from bottom
   */
  barGrow: {
    initial: { scaleY: 0, originY: 1 },
    animate: { scaleY: 1 },
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 15,
      delay: 0.1,
    },
  } as Variants,

  /**
   * Line draw
   */
  lineDraw: {
    initial: { pathLength: 0, opacity: 0 },
    animate: { pathLength: 1, opacity: 1 },
    transition: {
      pathLength: {
        duration: 1.5,
        ease: 'easeInOut',
      },
      opacity: { duration: 0.5 },
    },
  } as Variants,

  /**
   * Pie slice entrance
   */
  pieSlice: {
    initial: { scale: 0, rotate: -180 },
    animate: { scale: 1, rotate: 0 },
    transition: {
      type: 'spring',
      stiffness: 120,
      damping: 12,
    },
  } as Variants,

  /**
   * Counter animation (numbers)
   */
  counter: (from: number, to: number, duration: number = 1) => ({
    initial: { value: from },
    animate: { value: to },
    transition: {
      duration,
      ease: 'easeOut',
    },
  }),
};

/**
 * 🪟 MODAL & OVERLAY ANIMATIONS
 */
export const modalAnimations = {
  /**
   * Modal fade + scale
   */
  modal: {
    initial: { opacity: 0, scale: 0.75, y: 40 },
    animate: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.9, y: 20 },
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 25,
    },
  } as Variants,

  /**
   * Backdrop blur
   */
  backdrop: {
    initial: { opacity: 0, backdropFilter: 'blur(0px)' },
    animate: { opacity: 1, backdropFilter: 'blur(8px)' },
    exit: { opacity: 0, backdropFilter: 'blur(0px)' },
    transition: { duration: 0.3 },
  } as Variants,

  /**
   * Slide from right (sidebar)
   */
  slideRight: {
    initial: { x: '100%' },
    animate: { x: 0 },
    exit: { x: '100%' },
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 30,
    },
  } as Variants,

  /**
   * Slide from bottom (drawer)
   */
  slideUp: {
    initial: { y: '100%' },
    animate: { y: 0 },
    exit: { y: '100%' },
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 30,
    },
  } as Variants,
};

/**
 * ⚡ MICRO-INTERACTIONS
 * Interacciones sutiles y deliciosas
 */
export const microInteractions = {
  /**
   * Badge bounce (notificaciones)
   */
  badgeBounce: {
    initial: { scale: 0 },
    animate: {
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 500,
        damping: 15,
      },
    },
    exit: {
      scale: 0,
      transition: { duration: 0.2 },
    },
  } as Variants,

  /**
   * Tooltip fade
   */
  tooltip: {
    initial: { opacity: 0, y: 10, scale: 0.95 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: 5, scale: 0.98 },
    transition: { duration: 0.15 },
  } as Variants,

  /**
   * Icon pulse (attention grabber)
   */
  iconPulse: {
    animate: {
      scale: [1, 1.2, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  } as Variants,

  /**
   * Shake (error)
   */
  shake: {
    animate: {
      x: [0, -10, 10, -10, 10, 0],
      transition: { duration: 0.5 },
    },
  } as Variants,

  /**
   * Wiggle (attention)
   */
  wiggle: {
    animate: {
      rotate: [0, -5, 5, -5, 5, 0],
      transition: { duration: 0.5 },
    },
  } as Variants,

  /**
   * Heartbeat
   */
  heartbeat: {
    animate: {
      scale: [1, 1.1, 1, 1.1, 1],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  } as Variants,
};

/**
 * 🎨 GRADIENT ANIMATIONS
 */
export const gradientAnimations = {
  /**
   * Moving gradient
   */
  movingGradient: {
    animate: {
      backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
      transition: {
        duration: 5,
        repeat: Infinity,
        ease: 'linear',
      },
    },
  } as Variants,

  /**
   * Pulsing glow
   */
  pulsingGlow: (color: string) => ({
    animate: {
      boxShadow: [`0 0 20px ${color}40`, `0 0 40px ${color}60`, `0 0 20px ${color}40`],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  }),
};

/**
 * 🌊 LIQUID ANIMATIONS
 * Efectos líquidos y orgánicos
 */
export const liquidAnimations = {
  /**
   * Blob morph
   */
  blobMorph: {
    animate: {
      borderRadius: [
        '60% 40% 30% 70%/60% 30% 70% 40%',
        '30% 60% 70% 40%/50% 60% 30% 60%',
        '60% 40% 30% 70%/60% 30% 70% 40%',
      ],
      transition: {
        duration: 8,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  } as Variants,

  /**
   * Wave (loading)
   */
  wave: {
    animate: {
      y: [0, -10, 0],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  } as Variants,
};

/**
 * 🎯 SPRING PRESETS
 * Configuraciones de spring predefinidas
 */
export const springPresets = {
  // Suave y fluido
  gentle: {
    type: 'spring' as const,
    stiffness: 120,
    damping: 14,
  },

  // Rápido y preciso
  snappy: {
    type: 'spring' as const,
    stiffness: 400,
    damping: 25,
  },

  // Rebote juguetón
  bouncy: {
    type: 'spring' as const,
    stiffness: 260,
    damping: 12,
  },

  // Lento y dramático
  slow: {
    type: 'spring' as const,
    stiffness: 100,
    damping: 20,
  },

  // Muy rápido
  instant: {
    type: 'spring' as const,
    stiffness: 500,
    damping: 30,
  },
};

/**
 * 🎪 EASING FUNCTIONS CUSTOM
 */
export const customEasing = {
  // Salida elástica
  elasticOut: [0.175, 0.885, 0.32, 1.275],

  // Entrada/salida suave
  smooth: [0.25, 0.1, 0.25, 1],

  // Anticipación
  anticipate: [0.36, 0, 0.66, -0.56],

  // Rebasa y vuelve
  backOut: [0.34, 1.56, 0.64, 1],

  // Más suave que ease-in-out
  softInOut: [0.42, 0, 0.58, 1],
};

export default {
  container: containerAnimations,
  card: cardAnimations,
  table: tableAnimations,
  button: buttonAnimations,
  chart: chartAnimations,
  modal: modalAnimations,
  micro: microInteractions,
  gradient: gradientAnimations,
  liquid: liquidAnimations,
  spring: springPresets,
  easing: customEasing,
};
