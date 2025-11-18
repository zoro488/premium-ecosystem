/**
 * 🎨 FLOWDISTRIBUTOR DESIGN SYSTEM - THEME DEFINITIVO
 * Sistema de diseño premium unificado para todos los componentes
 * @version 5.0.0 - ULTRA PREMIUM
 */

export const theme = {
  /**
   * 🌈 PALETA DE COLORES ARM��NICA
   * Colores cuidadosamente seleccionados para máxima armonía visual
   */
  colors: {
    // Colores Primarios (Identidad FlowDistributor)
    primary: {
      50: '#eff6ff',
      100: '#dbeafe',
      200: '#bfdbfe',
      300: '#93c5fd',
      400: '#60a5fa',
      500: '#3b82f6', // Azul principal
      600: '#2563eb',
      700: '#1d4ed8',
      800: '#1e40af',
      900: '#1e3a8a',
      950: '#172554',
    },

    // Colores Secundarios (Acentos premium)
    secondary: {
      50: '#faf5ff',
      100: '#f3e8ff',
      200: '#e9d5ff',
      300: '#d8b4fe',
      400: '#c084fc',
      500: '#a855f7', // Púrpura
      600: '#9333ea',
      700: '#7e22ce',
      800: '#6b21a8',
      900: '#581c87',
      950: '#3b0764',
    },

    // Colores Terciarios (Complementos)
    tertiary: {
      50: '#ecfeff',
      100: '#cffafe',
      200: '#a5f3fc',
      300: '#67e8f9',
      400: '#22d3ee',
      500: '#06b6d4', // Cyan
      600: '#0891b2',
      700: '#0e7490',
      800: '#155e75',
      900: '#164e63',
      950: '#083344',
    },

    // Estados de Negocio
    success: {
      50: '#f0fdf4',
      100: '#dcfce7',
      200: '#bbf7d0',
      300: '#86efac',
      400: '#4ade80',
      500: '#22c55e', // Verde
      600: '#16a34a',
      700: '#15803d',
      800: '#166534',
      900: '#14532d',
    },

    warning: {
      50: '#fffbeb',
      100: '#fef3c7',
      200: '#fde68a',
      300: '#fcd34d',
      400: '#fbbf24',
      500: '#f59e0b', // Ámbar
      600: '#d97706',
      700: '#b45309',
      800: '#92400e',
      900: '#78350f',
    },

    error: {
      50: '#fef2f2',
      100: '#fee2e2',
      200: '#fecaca',
      300: '#fca5a5',
      400: '#f87171',
      500: '#ef4444', // Rojo
      600: '#dc2626',
      700: '#b91c1c',
      800: '#991b1b',
      900: '#7f1d1d',
    },

    // Neutrales (Base del sistema)
    gray: {
      50: '#f9fafb',
      100: '#f3f4f6',
      200: '#e5e7eb',
      300: '#d1d5db',
      400: '#9ca3af',
      500: '#6b7280',
      600: '#4b5563',
      700: '#374151',
      800: '#1f2937',
      900: '#111827',
      950: '#030712',
    },

    // Colores por Panel (Identidad única)
    panels: {
      bovedaMonte: {
        primary: '#f59e0b', // Ámbar/Gold
        secondary: '#fbbf24',
        gradient: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)',
        glow: 'rgba(245, 158, 11, 0.4)',
      },
      bovedaUSA: {
        primary: '#3b82f6', // Azul
        secondary: '#6366f1', // Indigo
        gradient: 'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)',
        glow: 'rgba(59, 130, 246, 0.4)',
      },
      azteca: {
        primary: '#06b6d4', // Cyan
        secondary: '#3b82f6',
        gradient: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
        glow: 'rgba(6, 182, 212, 0.4)',
      },
      utilidades: {
        primary: '#10b981', // Green/Emerald
        secondary: '#059669',
        gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        glow: 'rgba(16, 185, 129, 0.4)',
      },
      fleteSur: {
        primary: '#f97316', // Orange
        secondary: '#fb923c',
        gradient: 'linear-gradient(135deg, #f97316 0%, #fb923c 100%)',
        glow: 'rgba(249, 115, 22, 0.4)',
      },
      leftie: {
        primary: '#6366f1', // Indigo
        secondary: '#8b5cf6', // Violet
        gradient: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
        glow: 'rgba(99, 102, 241, 0.4)',
      },
      profit: {
        primary: '#a855f7', // Purple
        secondary: '#ec4899', // Pink
        gradient: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
        glow: 'rgba(168, 85, 247, 0.4)',
      },
      ventas: {
        primary: '#6366f1', // Indigo
        secondary: '#ec4899', // Pink
        gradient: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)',
        glow: 'rgba(99, 102, 241, 0.4)',
      },
      clientes: {
        primary: '#ec4899', // Pink
        secondary: '#f43f5e', // Rose
        gradient: 'linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)',
        glow: 'rgba(236, 72, 153, 0.4)',
      },
      ordenes: {
        primary: '#f97316', // Orange
        secondary: '#ef4444', // Red
        gradient: 'linear-gradient(135deg, #f97316 0%, #ef4444 100%)',
        glow: 'rgba(249, 115, 22, 0.4)',
      },
      almacen: {
        primary: '#a855f7', // Purple
        secondary: '#ec4899', // Pink
        gradient: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
        glow: 'rgba(168, 85, 247, 0.4)',
      },
      distribuidores: {
        primary: '#6366f1', // Indigo
        secondary: '#a855f7', // Purple
        gradient: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
        glow: 'rgba(99, 102, 241, 0.4)',
      },
      dashboard: {
        primary: '#3b82f6', // Blue
        secondary: '#06b6d4', // Cyan
        gradient: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)',
        glow: 'rgba(59, 130, 246, 0.4)',
      },
    },
  },

  /**
   * 📐 ESPACIADO CONSISTENTE
   * Sistema de espaciado basado en múltiplos de 4px
   */
  spacing: {
    0: '0px',
    1: '0.25rem', // 4px
    2: '0.5rem', // 8px
    3: '0.75rem', // 12px
    4: '1rem', // 16px
    5: '1.25rem', // 20px
    6: '1.5rem', // 24px
    8: '2rem', // 32px
    10: '2.5rem', // 40px
    12: '3rem', // 48px
    16: '4rem', // 64px
    20: '5rem', // 80px
    24: '6rem', // 96px
    32: '8rem', // 128px
  },

  /**
   * 🔤 TIPOGRAFÍA PREMIUM
   * Jerarquía clara y legible
   */
  typography: {
    fontFamily: {
      sans: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      mono: '"Fira Code", "SF Mono", Monaco, "Cascadia Code", monospace',
      display: '"Cal Sans", "Inter", sans-serif',
    },
    fontSize: {
      xs: '0.75rem', // 12px
      sm: '0.875rem', // 14px
      base: '1rem', // 16px
      lg: '1.125rem', // 18px
      xl: '1.25rem', // 20px
      '2xl': '1.5rem', // 24px
      '3xl': '1.875rem', // 30px
      '4xl': '2.25rem', // 36px
      '5xl': '3rem', // 48px
      '6xl': '3.75rem', // 60px
      '7xl': '4.5rem', // 72px
    },
    fontWeight: {
      thin: '100',
      extralight: '200',
      light: '300',
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
      extrabold: '800',
      black: '900',
    },
    lineHeight: {
      none: '1',
      tight: '1.25',
      snug: '1.375',
      normal: '1.5',
      relaxed: '1.625',
      loose: '2',
    },
  },

  /**
   * 🎭 SHADOWS PREMIUM
   * Elevación y profundidad
   */
  shadows: {
    none: 'none',
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)',

    // Glows para efectos premium
    glow: {
      blue: '0 0 20px rgba(59, 130, 246, 0.5), 0 0 40px rgba(59, 130, 246, 0.3)',
      purple: '0 0 20px rgba(168, 85, 247, 0.5), 0 0 40px rgba(168, 85, 247, 0.3)',
      cyan: '0 0 20px rgba(6, 182, 212, 0.5), 0 0 40px rgba(6, 182, 212, 0.3)',
      green: '0 0 20px rgba(16, 185, 129, 0.5), 0 0 40px rgba(16, 185, 129, 0.3)',
      orange: '0 0 20px rgba(249, 115, 22, 0.5), 0 0 40px rgba(249, 115, 22, 0.3)',
      pink: '0 0 20px rgba(236, 72, 153, 0.5), 0 0 40px rgba(236, 72, 153, 0.3)',
    },
  },

  /**
   * 🔄 BORDER RADIUS
   * Consistencia en bordes redondeados
   */
  borderRadius: {
    none: '0px',
    sm: '0.25rem', // 4px
    base: '0.5rem', // 8px
    md: '0.75rem', // 12px
    lg: '1rem', // 16px
    xl: '1.5rem', // 24px
    '2xl': '2rem', // 32px
    full: '9999px',
  },

  /**
   * ⏱️ TIMING FUNCTIONS
   * Curvas de animación premium
   */
  easing: {
    // Estándar
    linear: 'linear',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',

    // Premium
    snappy: 'cubic-bezier(0.4, 0, 0.1, 1)', // Rápido y preciso
    smooth: 'cubic-bezier(0.25, 0.1, 0.25, 1)', // Suave y fluido
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)', // Rebote sutil
    elastic: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)', // Elástico

    // Especializadas
    anticipate: 'cubic-bezier(0.36, 0, 0.66, -0.56)', // Anticipa el movimiento
    backOut: 'cubic-bezier(0.34, 1.56, 0.64, 1)', // Rebasa y vuelve
  },

  /**
   * ⏰ DURACIONES DE ANIMACIÓN
   * Tiempos consistentes
   */
  duration: {
    instant: 0,
    fastest: 100,
    faster: 150,
    fast: 200,
    normal: 300,
    slow: 400,
    slower: 600,
    slowest: 800,
  },

  /**
   * 🎬 EFECTOS GLASSMORPHISM
   * Configuraciones pre-definidas
   */
  glassmorphism: {
    light: {
      background: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(10px) saturate(180%)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
    },
    medium: {
      background: 'rgba(255, 255, 255, 0.15)',
      backdropFilter: 'blur(16px) saturate(180%)',
      border: '1px solid rgba(255, 255, 255, 0.25)',
    },
    heavy: {
      background: 'rgba(255, 255, 255, 0.2)',
      backdropFilter: 'blur(24px) saturate(200%)',
      border: '1px solid rgba(255, 255, 255, 0.3)',
    },
    dark: {
      background: 'rgba(0, 0, 0, 0.3)',
      backdropFilter: 'blur(20px) saturate(180%)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
    },
  },

  /**
   * 📱 BREAKPOINTS RESPONSIVE
   * Mobile-first approach
   */
  breakpoints: {
    xs: '320px',
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },

  /**
   * 🎯 Z-INDEX SCALE
   * Jerarquía de capas
   */
  zIndex: {
    base: 0,
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    modalBackdrop: 1040,
    modal: 1050,
    popover: 1060,
    tooltip: 1070,
    notification: 1080,
    sidebar: 900,
    header: 950,
  },
} as const;

export type Theme = typeof theme;

// Tipos útiles
export type ColorShades = keyof typeof theme.colors.primary;
export type PanelId = keyof typeof theme.colors.panels;
export type SpacingSize = keyof typeof theme.spacing;
export type FontSize = keyof typeof theme.typography.fontSize;
