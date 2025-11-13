/**
 * 🎨 FRAMER MOTION ANIMATION VARIANTS - ULTRA PREMIUM
 * Sistema completo de animaciones reutilizables
 */

import type { Transition, Variants } from 'framer-motion';

// ═══════════════════════════════════════════════════════════════════
// TRANSITIONS
// ═══════════════════════════════════════════════════════════════════

export const transitions = {
  smooth: {
    type: 'spring',
    stiffness: 400,
    damping: 30,
  } as Transition,

  bouncy: {
    type: 'spring',
    stiffness: 300,
    damping: 20,
  } as Transition,

  slow: {
    type: 'tween',
    duration: 0.5,
    ease: [0.4, 0, 0.2, 1],
  } as Transition,

  fast: {
    type: 'tween',
    duration: 0.2,
    ease: [0.4, 0, 0.2, 1],
  } as Transition,
};

// ═══════════════════════════════════════════════════════════════════
// CONTAINER ANIMATIONS (Stagger Children)
// ═══════════════════════════════════════════════════════════════════

export const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05,
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

export const containerStaggerFast: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0,
    },
  },
};

// ═══════════════════════════════════════════════════════════════════
// ITEM ANIMATIONS
// ═══════════════════════════════════════════════════════════════════

export const itemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: transitions.smooth,
  },
  exit: {
    opacity: 0,
    y: -10,
    scale: 0.95,
    transition: transitions.fast,
  },
};

export const itemSlideRight: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: transitions.smooth,
  },
};

export const itemSlideLeft: Variants = {
  hidden: { opacity: 0, x: 20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: transitions.smooth,
  },
};

// ═══════════════════════════════════════════════════════════════════
// CARD ANIMATIONS (Hover, Tap, Focus)
// ═══════════════════════════════════════════════════════════════════

export const cardVariants: Variants = {
  initial: {
    scale: 1,
    boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
  },
  hover: {
    scale: 1.02,
    boxShadow: '0 12px 32px rgba(24, 144, 255, 0.2)',
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 25,
    },
  },
  tap: {
    scale: 0.98,
    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
  },
};

export const cardGlassVariants: Variants = {
  initial: {
    scale: 1,
    background: 'rgba(255, 255, 255, 0.03)',
  },
  hover: {
    scale: 1.01,
    background: 'rgba(255, 255, 255, 0.05)',
    boxShadow: '0 8px 32px rgba(24, 144, 255, 0.15)',
    transition: transitions.smooth,
  },
};

// ═══════════════════════════════════════════════════════════════════
// BUTTON ANIMATIONS
// ═══════════════════════════════════════════════════════════════════

export const buttonVariants: Variants = {
  initial: {
    scale: 1,
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  hover: {
    scale: 1.05,
    boxShadow: '0 8px 24px rgba(24, 144, 255, 0.3)',
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 20,
    },
  },
  tap: {
    scale: 0.95,
    boxShadow: '0 1px 4px rgba(0,0,0,0.15)',
  },
};

export const buttonPulse: Variants = {
  initial: { scale: 1 },
  pulse: {
    scale: [1, 1.05, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      repeatType: 'loop',
    },
  },
};

// ═══════════════════════════════════════════════════════════════════
// MODAL ANIMATIONS
// ═══════════════════════════════════════════════════════════════════

export const modalOverlayVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.3 },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.2 },
  },
};

export const modalContentVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.8,
    y: -50,
  },
  visible: {
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
    scale: 0.8,
    y: 50,
    transition: { duration: 0.2 },
  },
};

// ═══════════════════════════════════════════════════════════════════
// SIDEBAR ANIMATIONS
// ═══════════════════════════════════════════════════════════════════

export const sidebarVariants: Variants = {
  collapsed: {
    width: '80px',
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 40,
    },
  },
  expanded: {
    width: '280px',
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 40,
    },
  },
};

export const sidebarTextVariants: Variants = {
  collapsed: {
    opacity: 0,
    x: -10,
    transition: { duration: 0.2 },
  },
  expanded: {
    opacity: 1,
    x: 0,
    transition: { delay: 0.1, duration: 0.3 },
  },
};

export const sidebarItemVariants: Variants = {
  collapsed: {
    justifyContent: 'center',
    padding: '12px',
  },
  expanded: {
    justifyContent: 'flex-start',
    padding: '12px 16px',
  },
};

// ═══════════════════════════════════════════════════════════════════
// DROPDOWN ANIMATIONS
// ═══════════════════════════════════════════════════════════════════

export const dropdownVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
    y: -10,
    transition: { duration: 0.2 },
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 30,
    },
  },
};

// ═══════════════════════════════════════════════════════════════════
// TABLE ROW ANIMATIONS
// ═══════════════════════════════════════════════════════════════════

export const tableRowVariants: Variants = {
  initial: {
    backgroundColor: 'transparent',
  },
  hover: {
    backgroundColor: 'rgba(102,126,234,0.08)',
    x: 4,
    transition: { duration: 0.2 },
  },
};

export const tableRowStagger: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.02,
    },
  },
};

// ═══════════════════════════════════════════════════════════════════
// BADGE ANIMATIONS
// ═══════════════════════════════════════════════════════════════════

export const badgeVariants: Variants = {
  idle: {
    scale: 1,
    boxShadow: '0 0 0 0 currentColor',
  },
  pulse: {
    scale: [1, 1.05, 1],
    boxShadow: [
      '0 0 0 0 currentColor',
      '0 0 0 4px rgba(255, 255, 255, 0.2)',
      '0 0 0 0 currentColor',
    ],
    transition: {
      duration: 2,
      repeat: Infinity,
    },
  },
};

// ═══════════════════════════════════════════════════════════════════
// CHART ANIMATIONS
// ═══════════════════════════════════════════════════════════════════

export const chartVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.9,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },
};

// ═══════════════════════════════════════════════════════════════════
// NOTIFICATION ANIMATIONS
// ═══════════════════════════════════════════════════════════════════

export const notificationVariants: Variants = {
  hidden: {
    opacity: 0,
    x: 100,
    scale: 0.8,
  },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 500,
      damping: 30,
    },
  },
  exit: {
    opacity: 0,
    x: 100,
    scale: 0.8,
    transition: {
      duration: 0.2,
    },
  },
};

// ═══════════════════════════════════════════════════════════════════
// PAGE TRANSITIONS
// ═══════════════════════════════════════════════════════════════════

export const pageVariants: Variants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: 'easeOut',
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.2,
    },
  },
};

export const pageSlideVariants: Variants = {
  initial: {
    opacity: 0,
    x: -100,
  },
  animate: {
    opacity: 1,
    x: 0,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 40,
    },
  },
  exit: {
    opacity: 0,
    x: 100,
    transition: {
      duration: 0.2,
    },
  },
};

// ═══════════════════════════════════════════════════════════════════
// LOADING ANIMATIONS
// ═══════════════════════════════════════════════════════════════════

export const spinnerVariants: Variants = {
  animate: {
    rotate: 360,
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: 'linear',
    },
  },
};

export const pulseVariants: Variants = {
  animate: {
    scale: [1, 1.2, 1],
    opacity: [1, 0.5, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

// ═══════════════════════════════════════════════════════════════════
// SCROLL ANIMATIONS
// ═══════════════════════════════════════════════════════════════════

export const scrollFadeIn: Variants = {
  hidden: {
    opacity: 0,
    y: 50,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },
};

// ═══════════════════════════════════════════════════════════════════
// EXPORT ALL
// ═══════════════════════════════════════════════════════════════════

export const animations = {
  // Containers
  container: containerVariants,
  containerStaggerFast,

  // Items
  item: itemVariants,
  itemSlideRight,
  itemSlideLeft,

  // Cards
  card: cardVariants,
  cardGlass: cardGlassVariants,

  // Buttons
  button: buttonVariants,
  buttonPulse,

  // Modals
  modalOverlay: modalOverlayVariants,
  modalContent: modalContentVariants,

  // Sidebar
  sidebar: sidebarVariants,
  sidebarText: sidebarTextVariants,
  sidebarItem: sidebarItemVariants,

  // Dropdowns
  dropdown: dropdownVariants,

  // Tables
  tableRow: tableRowVariants,
  tableRowStagger,

  // Badges
  badge: badgeVariants,

  // Charts
  chart: chartVariants,

  // Notifications
  notification: notificationVariants,

  // Pages
  page: pageVariants,
  pageSlide: pageSlideVariants,

  // Loading
  spinner: spinnerVariants,
  pulse: pulseVariants,

  // Scroll
  scrollFadeIn,
};

export default animations;
