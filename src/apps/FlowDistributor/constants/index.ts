/**
 * 🎯 CONSTANTS - FlowDistributor Supreme 2025
 * Constantes del sistema de 8 Bóvedas
 */

import type { BankCode } from '../types';

// ==================== 8 BÓVEDAS CONFIGURATION ====================

export const BANKS = {
  BM: {
    code: 'BM' as BankCode,
    name: 'Bóveda Monte',
    description: 'Reserva empresarial principal - Recibe 30% de cada venta',
    color: 'from-amber-400 to-yellow-600',
    icon: 'Landmark',
    distributionPercentage: 30,
    order: 1,
  },
  BS: {
    code: 'BS' as BankCode,
    name: 'Bóveda Sur',
    description: 'Reserva internacional secundaria',
    color: 'from-sky-400 to-zinc-900',
    icon: 'Building2',
    distributionPercentage: 10,
    order: 2,
  },
  AZ: {
    code: 'AZ' as BankCode,
    name: 'Azteca',
    description: 'Cuenta bancaria Banco Azteca',
    color: 'from-red-400 to-zinc-700',
    icon: 'Wallet',
    distributionPercentage: 15,
    order: 3,
  },
  UT: {
    code: 'UT' as BankCode,
    name: 'Utilidades',
    description: 'Ganancias y utilidades operativas',
    color: 'from-emerald-400 to-green-600',
    icon: 'TrendingUp',
    distributionPercentage: 15,
    order: 4,
  },
  FL: {
    code: 'FL' as BankCode,
    name: 'Flete Sur',
    description: 'Gastos de transporte y logística',
    color: 'from-zinc-700 to-indigo-600',
    icon: 'Truck',
    distributionPercentage: 10,
    order: 5,
  },
  LF: {
    code: 'LF' as BankCode,
    name: 'Leftie',
    description: 'Reserva secundaria y contingencias',
    color: 'from-zinc-800 to-zinc-800',
    icon: 'Coins',
    distributionPercentage: 10,
    order: 6,
  },
  PR: {
    code: 'PR' as BankCode,
    name: 'Profit',
    description: 'Casa de cambio USD ↔ MXN',
    color: 'from-orange-400 to-amber-600',
    icon: 'DollarSign',
    distributionPercentage: 10,
    order: 7,
    specialFeature: 'EXCHANGE_HOUSE',
  },
  CL: {
    code: 'CL' as BankCode,
    name: 'Clientes',
    description: 'Cuenta por cobrar de clientes',
    color: 'from-teal-400 to-zinc-900',
    icon: 'Users',
    distributionPercentage: 0,
    order: 8,
    specialFeature: 'ACCOUNTS_RECEIVABLE',
  },
} as const;

export const BANK_CODES = Object.keys(BANKS) as BankCode[];

// Distribution percentages (70% after 30% to Bóveda Monte)
export const DISTRIBUTION_RULES = {
  BOVEDA_MONTE_PERCENTAGE: 30, // 30% de la ganancia va a Bóveda Monte
  REMAINING_PERCENTAGE: 70, // 70% se distribuye entre las demás

  // Del 70% restante:
  DISTRIBUTION_MAP: {
    BS: 10 / 70, // ~14.3% del 70%
    AZ: 15 / 70, // ~21.4% del 70%
    UT: 15 / 70, // ~21.4% del 70%
    FL: 10 / 70, // ~14.3% del 70%
    LF: 10 / 70, // ~14.3% del 70%
    PR: 10 / 70, // ~14.3% del 70%
  },
} as const;

// ==================== EXCHANGE RATE ====================

export const EXCHANGE_RATE_CONFIG = {
  DEFAULT_RATE: 18.5,
  UPDATE_INTERVAL: 5 * 60 * 1000, // 5 minutos
  API_SOURCES: [
    {
      name: 'ExchangeRate-API',
      url: 'https://api.exchangerate-api.com/v4/latest/USD',
      parser: (data: any) => data.rates.MXN,
    },
    {
      name: 'Fixer',
      url: 'https://api.fixer.io/latest?base=USD&symbols=MXN',
      parser: (data: any) => data.rates.MXN,
    },
  ],

  // Profit opportunity thresholds
  OPPORTUNITY_THRESHOLDS: {
    BUY_USD: -0.5, // Si está 0.5% abajo del promedio
    SELL_USD: 0.5, // Si está 0.5% arriba del promedio
  },
} as const;

// ==================== CUT FREQUENCIES ====================

export const CUT_FREQUENCIES = {
  DAILY: {
    label: 'Diario',
    value: 'DAILY',
    cronPattern: '0 23 59 * * *',
    description: 'Todos los días a las 23:59',
  },
  WEEKLY: {
    label: 'Semanal',
    value: 'WEEKLY',
    cronPattern: '0 23 59 * * 0', // Domingos
    description: 'Cada domingo a las 23:59',
  },
  BIWEEKLY: {
    label: 'Quincenal',
    value: 'BIWEEKLY',
    description: 'Cada 15 días',
  },
  MONTHLY: {
    label: 'Mensual',
    value: 'MONTHLY',
    description: 'Cada primer día del mes',
  },
  QUARTERLY: {
    label: 'Trimestral',
    value: 'QUARTERLY',
    description: 'Cada 3 meses',
  },
  YEARLY: {
    label: 'Anual',
    value: 'YEARLY',
    description: 'Cada año',
  },
  MANUAL: {
    label: 'Manual',
    value: 'MANUAL',
    description: 'Solo cuando se ejecute manualmente',
  },
} as const;

// ==================== TRANSACTION TYPES ====================

export const TRANSACTION_TYPES = {
  INCOME: {
    label: 'Ingreso',
    value: 'INCOME',
    color: 'green',
    icon: 'ArrowUpCircle',
  },
  EXPENSE: {
    label: 'Gasto',
    value: 'EXPENSE',
    color: 'red',
    icon: 'ArrowDownCircle',
  },
  TRANSFER: {
    label: 'Transferencia',
    value: 'TRANSFER',
    color: 'blue',
    icon: 'ArrowRight',
  },
  DISTRIBUTION: {
    label: 'Distribución',
    value: 'DISTRIBUTION',
    color: 'purple',
    icon: 'Sparkles',
  },
  CUT: {
    label: 'Corte',
    value: 'CUT',
    color: 'orange',
    icon: 'Calendar',
  },
} as const;

// ==================== STATUS ====================

export const TRANSACTION_STATUS = {
  PENDING: {
    label: 'Pendiente',
    value: 'PENDING',
    color: 'yellow',
    icon: 'Clock',
  },
  COMPLETED: {
    label: 'Completada',
    value: 'COMPLETED',
    color: 'green',
    icon: 'CheckCircle2',
  },
  CANCELLED: {
    label: 'Cancelada',
    value: 'CANCELLED',
    color: 'red',
    icon: 'X',
  },
  FAILED: {
    label: 'Fallida',
    value: 'FAILED',
    color: 'red',
    icon: 'AlertCircle',
  },
} as const;

export const SALE_STATUS = {
  DRAFT: {
    label: 'Borrador',
    value: 'DRAFT',
    color: 'gray',
  },
  CONFIRMED: {
    label: 'Confirmada',
    value: 'CONFIRMED',
    color: 'blue',
  },
  PAID: {
    label: 'Pagada',
    value: 'PAID',
    color: 'green',
  },
  PARTIALLY_PAID: {
    label: 'Pago Parcial',
    value: 'PARTIALLY_PAID',
    color: 'yellow',
  },
  CANCELLED: {
    label: 'Cancelada',
    value: 'CANCELLED',
    color: 'red',
  },
} as const;

// ==================== PAYMENT METHODS ====================

export const PAYMENT_METHODS = {
  CASH: {
    label: 'Efectivo',
    value: 'CASH',
    icon: 'DollarSign',
  },
  TRANSFER: {
    label: 'Transferencia',
    value: 'TRANSFER',
    icon: 'Send',
  },
  CHECK: {
    label: 'Cheque',
    value: 'CHECK',
    icon: 'FileText',
  },
  CARD: {
    label: 'Tarjeta',
    value: 'CARD',
    icon: 'Wallet',
  },
  OTHER: {
    label: 'Otro',
    value: 'OTHER',
    icon: 'Info',
  },
} as const;

// ==================== INVENTORY ====================

export const INVENTORY_MOVEMENT_TYPES = {
  ENTRY: {
    label: 'Entrada',
    value: 'ENTRY',
    color: 'green',
    icon: 'ArrowDownCircle',
  },
  EXIT: {
    label: 'Salida',
    value: 'EXIT',
    color: 'red',
    icon: 'ArrowUpCircle',
  },
  ADJUSTMENT: {
    label: 'Ajuste',
    value: 'ADJUSTMENT',
    color: 'yellow',
    icon: 'Settings',
  },
  TRANSFER: {
    label: 'Traspaso',
    value: 'TRANSFER',
    color: 'blue',
    icon: 'ArrowRight',
  },
} as const;

// ==================== UI CONSTANTS ====================

export const DESIGN_SYSTEM = {
  // Glassmorphism
  glass: {
    ultra: 'glass-ultra',
    elevated: 'glass-elevated',
    supreme: 'glass-supreme',
    border: 'border border-white/10',
    shadow: 'shadow-premium-lg',
    hover: 'hover:shadow-premium-xl transition-all duration-500',
  },

  // Colors
  colors: {
    primary: '#0EA5E9',
    secondary: '#8B5CF6',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',
  },

  // Animations
  animations: {
    spring: {
      type: 'spring',
      stiffness: 400,
      damping: 17,
    },
    smooth: {
      type: 'tween',
      duration: 0.3,
      ease: 'easeInOut',
    },
  },
} as const;

// ==================== PAGINATION ====================

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 25,
  PAGE_SIZE_OPTIONS: [10, 25, 50, 100],
} as const;

// ==================== CHART COLORS ====================

export const CHART_COLORS = {
  BM: '#FFD700', // Gold - Bóveda Monte
  BS: '#00D4FF', // Cyan - Bóveda Sur
  AZ: '#EF4444', // Red - Azteca
  UT: '#10B981', // Green - Utilidades
  FL: '#3B82F6', // Blue - Flete
  LF: '#A855F7', // Purple - Leftie
  PR: '#F97316', // Orange - Profit
  CL: '#06B6D4', // Teal - Clientes
} as const;

// ==================== DATE FORMATS ====================

export const DATE_FORMATS = {
  DISPLAY: 'DD/MM/YYYY',
  DISPLAY_TIME: 'DD/MM/YYYY HH:mm',
  ISO: 'YYYY-MM-DD',
  ISO_TIME: 'YYYY-MM-DDTHH:mm:ss',
} as const;

// ==================== VALIDATION ====================

export const VALIDATION = {
  MIN_AMOUNT: 0.01,
  MAX_AMOUNT: 999999999.99,
  MIN_QUANTITY: 1,
  MAX_QUANTITY: 999999,
  MAX_CONCEPT_LENGTH: 200,
  MAX_NOTES_LENGTH: 1000,
} as const;

// ==================== FIREBASE COLLECTIONS ====================

export const FIREBASE_COLLECTIONS = {
  BANKS: 'banks',
  TRANSACTIONS: 'transactions',
  TRANSFERS: 'transfers',
  CUTS: 'cuts',
  CUT_CONFIGS: 'cutConfigurations',
  SALES: 'sales',
  CLIENTS: 'clients',
  PURCHASE_ORDERS: 'purchaseOrders',
  INVENTORY: 'inventory',
  INVENTORY_MOVEMENTS: 'inventoryMovements',
  PAYMENTS: 'payments',
  SETTINGS: 'settings',
} as const;

// ==================== ERROR MESSAGES ====================

export const ERROR_MESSAGES = {
  INSUFFICIENT_BALANCE: 'Saldo insuficiente',
  INVALID_AMOUNT: 'Monto inválido',
  INVALID_BANK: 'Bóveda no encontrada',
  SAME_BANK_TRANSFER: 'Origen y destino deben ser diferentes',
  REQUIRED_FIELD: 'Este campo es obligatorio',
  NETWORK_ERROR: 'Error de conexión. Intenta nuevamente.',
  UNKNOWN_ERROR: 'Ocurrió un error inesperado',
} as const;
