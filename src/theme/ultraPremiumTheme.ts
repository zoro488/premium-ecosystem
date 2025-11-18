/**
 * Ultra Premium Black Theme
 * Colores negros con acentos plateados/dorados para máximo lujo
 */

export const ultraPremiumTheme = {
  // Colores primarios - Negro absoluto con gradientes metálicos
  primary: {
    bg: 'from-black via-zinc-950 to-black',
    bgSolid: 'bg-black',
    bgGlass: 'bg-black/80',
    border: 'border-zinc-800',
    text: 'text-white',
  },

  // Acentos metálicos premium
  accent: {
    platinum: 'from-zinc-300 via-zinc-100 to-zinc-300', // Platino
    gold: 'from-amber-300 via-yellow-200 to-amber-300', // Oro
    silver: 'from-slate-300 via-gray-100 to-slate-300', // Plata
    diamond: 'from-cyan-200 via-blue-100 to-cyan-200', // Diamante
  },

  // Gradientes de fondo
  backgrounds: {
    main: 'bg-gradient-to-br from-black via-zinc-950 to-black',
    card: 'bg-gradient-to-br from-zinc-950 via-zinc-900 to-black',
    glass: 'backdrop-blur-2xl bg-black/90 border border-zinc-800/50',
    hover: 'hover:bg-zinc-900/50',
  },

  // Bordes y efectos
  effects: {
    border: 'border-zinc-800/50',
    borderHover: 'hover:border-zinc-600',
    shadow: 'shadow-2xl shadow-black/50',
    shadowGold: 'shadow-2xl shadow-amber-500/20',
    shadowPlatinum: 'shadow-2xl shadow-zinc-400/20',
    glow: 'ring-1 ring-zinc-700/50',
    glowHover: 'hover:ring-2 hover:ring-zinc-500',
  },

  // Texto
  text: {
    primary: 'text-white',
    secondary: 'text-zinc-400',
    muted: 'text-zinc-600',
    accent: 'text-zinc-200',
    gradient:
      'bg-gradient-to-r from-zinc-200 via-zinc-100 to-zinc-200 bg-clip-text text-transparent',
    gradientGold:
      'bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-200 bg-clip-text text-transparent',
    gradientDiamond:
      'bg-gradient-to-r from-cyan-200 via-blue-100 to-cyan-200 bg-clip-text text-transparent',
  },

  // Botones
  buttons: {
    primary:
      'bg-gradient-to-r from-zinc-800 via-zinc-700 to-zinc-800 hover:from-zinc-700 hover:via-zinc-600 hover:to-zinc-700 text-white border border-zinc-600',
    secondary:
      'bg-transparent border border-zinc-700 text-zinc-300 hover:bg-zinc-900 hover:border-zinc-500',
    accent:
      'bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 hover:from-amber-500 hover:via-yellow-400 hover:to-amber-500 text-black font-bold',
    ghost: 'bg-transparent text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50',
  },

  // Estados
  states: {
    success: 'from-emerald-600 to-green-700',
    warning: 'from-amber-600 to-orange-700',
    error: 'from-red-600 to-rose-700',
    info: 'from-blue-600 to-cyan-700',
  },

  // KPIs y métricas
  kpi: {
    positive: 'text-emerald-400',
    negative: 'text-red-400',
    neutral: 'text-zinc-400',
  },

  // Navegación
  nav: {
    active: 'bg-zinc-900 border-l-2 border-zinc-500 text-white',
    inactive: 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/50',
    divider: 'border-zinc-800',
  },

  // Inputs
  inputs: {
    base: 'bg-zinc-950 border border-zinc-800 text-white placeholder-zinc-600 focus:border-zinc-600 focus:ring-2 focus:ring-zinc-700/50',
    disabled: 'bg-zinc-900 border-zinc-800 text-zinc-600 cursor-not-allowed',
  },

  // Tablas
  tables: {
    header: 'bg-zinc-950 border-b border-zinc-800 text-zinc-400 font-semibold',
    row: 'border-b border-zinc-900 hover:bg-zinc-950/50',
    rowAlt: 'bg-zinc-950/30',
  },

  // Charts
  charts: {
    primary: '#71717a', // zinc-500
    secondary: '#52525b', // zinc-600
    tertiary: '#3f3f46', // zinc-700
    success: '#10b981', // emerald-500
    danger: '#ef4444', // red-500
    warning: '#f59e0b', // amber-500
  },
};

// Helper para crear clases con el tema
export const tw = {
  card: `${ultraPremiumTheme.backgrounds.card} ${ultraPremiumTheme.effects.border} ${ultraPremiumTheme.effects.shadow} rounded-2xl p-6`,
  glassCard: `${ultraPremiumTheme.backgrounds.glass} ${ultraPremiumTheme.effects.border} ${ultraPremiumTheme.effects.shadow} rounded-2xl p-6`,
  button: `${ultraPremiumTheme.buttons.primary} px-6 py-3 rounded-xl font-semibold transition-all duration-200`,
  input: `${ultraPremiumTheme.inputs.base} px-4 py-3 rounded-xl transition-all duration-200`,
  heading: `${ultraPremiumTheme.text.gradient} text-3xl font-bold`,
};

export default ultraPremiumTheme;
