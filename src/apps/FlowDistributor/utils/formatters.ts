/**
 * 🎨 FORMATTERS - FlowDistributor Supreme 2025
 * Funciones de formateo para números, fechas, monedas, etc.
 */

import type { BankCode, Currency } from '../types';
import { BANKS, CHART_COLORS } from '../constants';

// ==================== FORMATEO DE MONEDA ====================

/**
 * Formatea un número como USD
 */
export const formatUSD = (amount: number, options?: {
  decimals?: number;
  showSymbol?: boolean;
  compact?: boolean;
}): string => {
  const { decimals = 2, showSymbol = true, compact = false } = options || {};

  if (compact && Math.abs(amount) >= 1000) {
    return formatCompactNumber(amount, 'USD');
  }

  const formatted = new Intl.NumberFormat('en-US', {
    style: showSymbol ? 'currency' : 'decimal',
    currency: 'USD',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(amount);

  return formatted;
};

/**
 * Formatea un número como MXN
 */
export const formatMXN = (amount: number, options?: {
  decimals?: number;
  showSymbol?: boolean;
  compact?: boolean;
}): string => {
  const { decimals = 2, showSymbol = true, compact = false } = options || {};

  if (compact && Math.abs(amount) >= 1000) {
    return formatCompactNumber(amount, 'MXN');
  }

  const formatted = new Intl.NumberFormat('es-MX', {
    style: showSymbol ? 'currency' : 'decimal',
    currency: 'MXN',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(amount);

  return formatted;
};

/**
 * Formatea moneda según el tipo
 */
export const formatCurrency = (
  amount: number,
  currency: Currency,
  options?: {
    decimals?: number;
    showSymbol?: boolean;
    compact?: boolean;
  }
): string => {
  return currency === 'USD' ? formatUSD(amount, options) : formatMXN(amount, options);
};

/**
 * Formatea números grandes en formato compacto (1.5M, 10.2K, etc.)
 */
export const formatCompactNumber = (num: number, currency?: Currency): string => {
  const absNum = Math.abs(num);
  const sign = num < 0 ? '-' : '';
  const symbol = currency === 'USD' ? '$' : currency === 'MXN' ? '$' : '';

  if (absNum >= 1_000_000_000) {
    return `${sign}${symbol}${(absNum / 1_000_000_000).toFixed(1)}B`;
  }
  if (absNum >= 1_000_000) {
    return `${sign}${symbol}${(absNum / 1_000_000).toFixed(1)}M`;
  }
  if (absNum >= 1_000) {
    return `${sign}${symbol}${(absNum / 1_000).toFixed(1)}K`;
  }
  return `${sign}${symbol}${absNum.toFixed(0)}`;
};

// ==================== FORMATEO DE NÚMEROS ====================

/**
 * Formatea un número con separadores de miles
 */
export const formatNumber = (num: number, decimals: number = 0): string => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num);
};

/**
 * Formatea un porcentaje
 */
export const formatPercent = (value: number, decimals: number = 2): string => {
  return `${value.toFixed(decimals)}%`;
};

/**
 * Formatea un número con signo (+/-) para cambios
 */
export const formatChange = (value: number, decimals: number = 2): string => {
  const sign = value > 0 ? '+' : '';
  return `${sign}${value.toFixed(decimals)}`;
};

/**
 * Formatea un porcentaje de cambio con color
 */
export const formatPercentChange = (value: number): {
  text: string;
  color: string;
  icon: 'up' | 'down' | 'neutral';
} => {
  const absValue = Math.abs(value);
  const sign = value > 0 ? '+' : value < 0 ? '-' : '';

  return {
    text: `${sign}${absValue.toFixed(2)}%`,
    color: value > 0 ? 'text-green-500' : value < 0 ? 'text-red-500' : 'text-gray-500',
    icon: value > 0 ? 'up' : value < 0 ? 'down' : 'neutral',
  };
};

// ==================== FORMATEO DE FECHAS ====================

/**
 * Formatea una fecha en formato DD/MM/YYYY
 */
export const formatDate = (date: string | Date): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};

/**
 * Formatea una fecha con hora DD/MM/YYYY HH:mm
 */
export const formatDateTime = (date: string | Date): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  const dateStr = formatDate(d);
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  return `${dateStr} ${hours}:${minutes}`;
};

/**
 * Formatea una fecha de forma relativa (hace 2 horas, ayer, etc.)
 */
export const formatRelativeTime = (date: string | Date): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 60) return 'Ahora mismo';
  if (diffMin < 60) return `Hace ${diffMin} min`;
  if (diffHour < 24) return `Hace ${diffHour}h`;
  if (diffDay === 1) return 'Ayer';
  if (diffDay < 7) return `Hace ${diffDay} días`;
  if (diffDay < 30) return `Hace ${Math.floor(diffDay / 7)} semanas`;
  if (diffDay < 365) return `Hace ${Math.floor(diffDay / 30)} meses`;
  return `Hace ${Math.floor(diffDay / 365)} años`;
};

/**
 * Obtiene el nombre del mes en español
 */
export const getMonthName = (monthIndex: number, short: boolean = false): string => {
  const months = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];
  const shortMonths = [
    'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
    'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'
  ];
  return short ? shortMonths[monthIndex] : months[monthIndex];
};

// ==================== FORMATEO DE BÓVEDAS ====================

/**
 * Obtiene el nombre de una bóveda por su código
 */
export const getBankName = (code: BankCode): string => {
  return BANKS[code]?.name || code;
};

/**
 * Obtiene el color de una bóveda por su código
 */
export const getBankColor = (code: BankCode): string => {
  return BANKS[code]?.color || 'from-gray-400 to-gray-600';
};

/**
 * Obtiene el color del gráfico para una bóveda
 */
export const getBankChartColor = (code: BankCode): string => {
  return CHART_COLORS[code] || '#6B7280';
};

// ==================== FORMATEO DE CÓDIGOS ====================

/**
 * Genera ID para Orden de Compra (OC0001, OC0002, etc.)
 */
export const generatePurchaseOrderId = (sequence: number): string => {
  return `OC${String(sequence).padStart(4, '0')}`;
};

/**
 * Genera ID para Venta (V0001, V0002, etc.)
 */
export const generateSaleId = (sequence: number): string => {
  return `V${String(sequence).padStart(4, '0')}`;
};

/**
 * Genera ID para Transferencia (T0001, T0002, etc.)
 */
export const generateTransferId = (sequence: number): string => {
  return `T${String(sequence).padStart(4, '0')}`;
};

/**
 * Genera ID para Corte (C0001, C0002, etc.)
 */
export const generateCutId = (sequence: number): string => {
  return `C${String(sequence).padStart(4, '0')}`;
};

// ==================== VALIDACIÓN ====================

/**
 * Valida si un string es un número válido
 */
export const isValidNumber = (value: string): boolean => {
  const num = parseFloat(value);
  return !isNaN(num) && isFinite(num);
};

/**
 * Valida si un monto es válido (positivo y con máximo 2 decimales)
 */
export const isValidAmount = (value: number): boolean => {
  return value > 0 && Number.isFinite(value);
};

/**
 * Limita decimales a un número máximo
 */
export const limitDecimals = (value: number, decimals: number = 2): number => {
  return Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals);
};

// ==================== PARSEO ====================

/**
 * Parsea un string de moneda a número
 * Ejemplo: "$1,234.56" -> 1234.56
 */
export const parseCurrency = (value: string): number => {
  const cleaned = value.replace(/[^0-9.-]/g, '');
  return parseFloat(cleaned) || 0;
};

/**
 * Parsea un string de porcentaje a número
 * Ejemplo: "15.5%" -> 15.5
 */
export const parsePercent = (value: string): number => {
  const cleaned = value.replace(/[^0-9.-]/g, '');
  return parseFloat(cleaned) || 0;
};

// ==================== TRUNCADO DE TEXTO ====================

/**
 * Trunca un texto largo con puntos suspensivos
 */
export const truncate = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength - 3)}...`;
};

/**
 * Capitaliza la primera letra de una cadena
 */
export const capitalize = (text: string): string => {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

/**
 * Convierte un texto a Title Case
 */
export const toTitleCase = (text: string): string => {
  return text
    .toLowerCase()
    .split(' ')
    .map(word => capitalize(word))
    .join(' ');
};

// ==================== HELPERS DE UI ====================

/**
 * Genera clases CSS para estados (success, warning, error, info)
 */
export const getStatusClasses = (status: 'success' | 'warning' | 'error' | 'info'): {
  bg: string;
  text: string;
  border: string;
} => {
  const classes = {
    success: {
      bg: 'bg-green-500/10',
      text: 'text-green-500',
      border: 'border-green-500/20',
    },
    warning: {
      bg: 'bg-yellow-500/10',
      text: 'text-yellow-500',
      border: 'border-yellow-500/20',
    },
    error: {
      bg: 'bg-red-500/10',
      text: 'text-red-500',
      border: 'border-red-500/20',
    },
    info: {
      bg: 'bg-blue-500/10',
      text: 'text-blue-500',
      border: 'border-blue-500/20',
    },
  };

  return classes[status];
};

/**
 * Genera gradiente de color para badges/chips
 */
export const getBadgeGradient = (variant: 'primary' | 'success' | 'warning' | 'error' | 'info'): string => {
  const gradients = {
    primary: 'bg-gradient-to-r from-blue-500 to-cyan-500',
    success: 'bg-gradient-to-r from-green-500 to-emerald-500',
    warning: 'bg-gradient-to-r from-yellow-500 to-orange-500',
    error: 'bg-gradient-to-r from-red-500 to-rose-500',
    info: 'bg-gradient-to-r from-sky-500 to-blue-500',
  };

  return gradients[variant];
};

// ==================== EXPORTACIONES POR DEFECTO ====================

export default {
  formatUSD,
  formatMXN,
  formatCurrency,
  formatCompactNumber,
  formatNumber,
  formatPercent,
  formatChange,
  formatPercentChange,
  formatDate,
  formatDateTime,
  formatRelativeTime,
  getMonthName,
  getBankName,
  getBankColor,
  getBankChartColor,
  generatePurchaseOrderId,
  generateSaleId,
  generateTransferId,
  generateCutId,
  isValidNumber,
  isValidAmount,
  limitDecimals,
  parseCurrency,
  parsePercent,
  truncate,
  capitalize,
  toTitleCase,
  getStatusClasses,
  getBadgeGradient,
};
