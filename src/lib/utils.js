/**
 * 🛠️ UTILIDADES AVANZADAS PREMIUM
 * Funciones utilitarias optimizadas para FlowDistributor
 */

// ============================================================================
// UTILIDADES DE FORMATO
// ============================================================================

/**
 * Formatea números como moneda con configuración avanzada
 */
export function formatCurrency(value, options = {}) {
  const {
    currency = 'USD',
    locale = 'es-MX',
    minimumFractionDigits = 2,
    maximumFractionDigits = 2,
    compact = false,
  } = options;

  const formatter = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits,
    maximumFractionDigits,
    notation: compact ? 'compact' : 'standard',
  });

  return formatter.format(value);
}

/**
 * Formatea números con separadores de miles
 */
export function formatNumber(value, options = {}) {
  const {
    locale = 'es-MX',
    minimumFractionDigits = 0,
    maximumFractionDigits = 2,
    compact = false,
  } = options;

  const formatter = new Intl.NumberFormat(locale, {
    minimumFractionDigits,
    maximumFractionDigits,
    notation: compact ? 'compact' : 'standard',
  });

  return formatter.format(value);
}

/**
 * Formatea porcentajes
 */
export function formatPercentage(value, options = {}) {
  const { locale = 'es-MX', minimumFractionDigits = 1, maximumFractionDigits = 2 } = options;

  const formatter = new Intl.NumberFormat(locale, {
    style: 'percent',
    minimumFractionDigits,
    maximumFractionDigits,
  });

  return formatter.format(value / 100);
}

/**
 * Formatea fechas de manera inteligente
 */
export function formatDate(date, options = {}) {
  const { locale = 'es-MX', style = 'medium', relative = false } = options;

  const dateObj = typeof date === 'string' ? new Date(date) : date;

  if (relative) {
    const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });
    const diffMs = dateObj.getTime() - Date.now();
    const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

    if (Math.abs(diffDays) < 7) {
      return rtf.format(diffDays, 'day');
    }
  }

  if (options.dateStyle || options.timeStyle) {
    return new Intl.DateTimeFormat(locale, {
      dateStyle: options.dateStyle,
      timeStyle: options.timeStyle,
    }).format(dateObj);
  }

  const formatter = new Intl.DateTimeFormat(locale, {
    dateStyle: style,
  });

  return formatter.format(dateObj);
}

// ============================================================================
// UTILIDADES DE ARRAYS Y OBJETOS
// ============================================================================

/**
 * Agrupa un array por una propiedad específica
 */
export function groupBy(array, key) {
  return array.reduce((groups, item) => {
    const groupKey = String(item[key]);
    if (!groups[groupKey]) {
      groups[groupKey] = [];
    }
    groups[groupKey].push(item);
    return groups;
  }, {});
}

/**
 * Calcula la suma de una propiedad numérica en un array
 */
export function sumBy(array, key) {
  return array.reduce((sum, item) => {
    const value = item[key];
    return sum + (typeof value === 'number' ? value : 0);
  }, 0);
}

/**
 * Calcula el promedio de una propiedad numérica en un array
 */
export function averageBy(array, key) {
  if (array.length === 0) return 0;
  return sumBy(array, key) / array.length;
}

/**
 * Encuentra el valor máximo de una propiedad numérica
 */
export function maxBy(array, key) {
  return Math.max(
    ...array.map((item) => {
      const value = item[key];
      return typeof value === 'number' ? value : -Infinity;
    })
  );
}

/**
 * Encuentra el valor mínimo de una propiedad numérica
 */
export function minBy(array, key) {
  return Math.min(
    ...array.map((item) => {
      const value = item[key];
      return typeof value === 'number' ? value : Infinity;
    })
  );
}

// ============================================================================
// UTILIDADES DE PERFORMANCE
// ============================================================================

/**
 * Debounce function optimizada
 */
export function debounce(func, wait) {
  let timeout;

  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Throttle function optimizada
 */
export function throttle(func, limit) {
  let inThrottle;

  return (...args) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// ============================================================================
// UTILIDADES DE ANIMACIÓN
// ============================================================================

/**
 * Configuraciones de animación predefinidas para Framer Motion
 */
export const animations = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.3 },
  },
  slideUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.4, ease: 'easeOut' },
  },
  scale: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9 },
    transition: { duration: 0.3, ease: 'easeOut' },
  },
};

/**
 * Genera un ID único
 */
export function generateId(prefix = 'id') {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Sleep function para delays
 */
export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
