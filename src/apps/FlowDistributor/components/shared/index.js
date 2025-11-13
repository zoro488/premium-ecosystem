/**
 * 🎯 CHRONOS DESIGN SYSTEM - Barrel Export
 * Sistema de diseño unificado para FlowDistributor
 */

// Core Components
export { default as ChronosLogo } from '../ChronosLogo';
export { default as ChronosHeader } from './ChronosHeader';
export { default as ChronosPanelContainer } from './ChronosPanelContainer';
export { default as ChronosCard, ChronosStatCard } from './ChronosCard';
export { default as ChronosTable, ChronosTableCard } from './ChronosTable';
export { default as ChronosErrorBoundary } from './ChronosErrorBoundary';

// UI Components
export {
  ChronosButton,
  ChronosInput,
  ChronosModal
} from './ChronosUI';

export {
  ChronosBadge,
  ChronosTabs,
  ChronosProgress,
  ChronosTooltip
} from './ChronosComponents';

// PropTypes
export * from './ChronosPropTypes';

/**
 * 🎨 CHRONOS THEME
 * Colores y estilos del sistema
 */
export const ChronosTheme = {
  colors: {
    background: '#000000',
    foreground: '#FFFFFF',
    primary: 'rgba(255, 255, 255, 0.9)',
    secondary: 'rgba(255, 255, 255, 0.6)',
    accent: 'rgba(255, 255, 255, 0.1)',
    border: 'rgba(255, 255, 255, 0.1)',
    hover: 'rgba(255, 255, 255, 0.05)',
    success: '#10B981',
    warning: '#F59E0B',
    danger: '#EF4444',
    info: '#3B82F6'
  },

  fonts: {
    primary: '"Helvetica Neue", Arial, sans-serif',
    mono: '"Courier New", monospace'
  },

  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem'
  },

  borderRadius: {
    sm: '0.125rem',
    md: '0.25rem',
    lg: '0.5rem',
    full: '9999px'
  },

  shadows: {
    sm: '0 2px 8px rgba(0,0,0,0.1)',
    md: '0 4px 16px rgba(0,0,0,0.15)',
    lg: '0 8px 32px rgba(0,0,0,0.2)',
    glow: '0 0 20px rgba(255,255,255,0.1)'
  }
};

/**
 * 🎨 CHRONOS ANIMATIONS
 * Presets de animaciones comunes
 */
export const ChronosAnimations = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 }
  },

  slideUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  },

  scaleIn: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9 }
  },

  slideInFromRight: {
    initial: { opacity: 0, x: 100 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 100 }
  },

  slideInFromLeft: {
    initial: { opacity: 0, x: -100 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -100 }
  }
};

/**
 * 🎨 CHRONOS UTILS
 * Utilidades comunes
 */
export const ChronosUtils = {
  // Format currency
  formatCurrency: (value, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency
    }).format(value);
  },

  // Format number
  formatNumber: (value, decimals = 0) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(value);
  },

  // Format date
  formatDate: (date, format = 'short') => {
    const d = new Date(date);
    if (format === 'short') {
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    }
    if (format === 'long') {
      return d.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
    return d.toLocaleDateString();
  },

  // Calculate percentage
  calculatePercentage: (value, total) => {
    if (!total || total === 0) return 0;
    return ((value / total) * 100).toFixed(1);
  },

  // Truncate text
  truncate: (text, length = 50) => {
    if (!text || text.length <= length) return text;
    return text.substring(0, length) + '...';
  }
};
