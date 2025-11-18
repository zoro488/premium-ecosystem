/**
 * 🎯 CHRONOS LOGGER - Sistema de logging unificado
 * Centraliza todos los console.log/error/warn del sistema
 * Con niveles, timestamps, categorías y posibilidad de enviar a Sentry/Cloud
 */

// Niveles de log
export const LOG_LEVEL = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
  NONE: 4,
};

// Categorías de log
export const LOG_CATEGORY = {
  AI: 'AI',
  AUTH: 'AUTH',
  DATA: 'DATA',
  UI: 'UI',
  PERFORMANCE: 'PERFORMANCE',
  NETWORK: 'NETWORK',
  VALIDATION: 'VALIDATION',
  SYSTEM: 'SYSTEM',
};

// Configuración (cambiar según ambiente)
const CONFIG = {
  minLevel: import.meta.env.DEV ? LOG_LEVEL.DEBUG : LOG_LEVEL.WARN,
  enableTimestamp: true,
  enableCategory: true,
  enableColor: true,
  sendToRemote: false, // Activar para enviar a Sentry/CloudWatch
  remoteEndpoint: null,
};

// Colores ANSI para consola
const COLORS = {
  DEBUG: '\x1b[36m', // Cyan
  INFO: '\x1b[32m', // Green
  WARN: '\x1b[33m', // Yellow
  ERROR: '\x1b[31m', // Red
  RESET: '\x1b[0m',
};

// Emojis por categoría
const CATEGORY_EMOJI = {
  [LOG_CATEGORY.AI]: '🤖',
  [LOG_CATEGORY.AUTH]: '🔐',
  [LOG_CATEGORY.DATA]: '📊',
  [LOG_CATEGORY.UI]: '🎨',
  [LOG_CATEGORY.PERFORMANCE]: '⚡',
  [LOG_CATEGORY.NETWORK]: '🌐',
  [LOG_CATEGORY.VALIDATION]: '✅',
  [LOG_CATEGORY.SYSTEM]: '⚙️',
};

/**
 * Formatea el mensaje de log con metadata
 */
function formatMessage(level, category, message, data) {
  const parts = [];

  // Timestamp
  if (CONFIG.enableTimestamp) {
    const time = new Date().toISOString().split('T')[1].slice(0, -1); // HH:MM:SS.mmm
    parts.push(`[${time}]`);
  }

  // Categoría con emoji
  if (CONFIG.enableCategory && category) {
    const emoji = CATEGORY_EMOJI[category] || '📝';
    parts.push(`${emoji} [${category}]`);
  }

  // Nivel
  parts.push(`[${level}]`, message);

  const formatted = parts.join(' ');

  return {
    formatted,
    data,
    meta: {
      timestamp: Date.now(),
      level,
      category,
    },
  };
}

/**
 * Envía log a servicio remoto (Sentry, CloudWatch, etc.)
 */
async function sendToRemote(level, category, message, data) {
  if (!CONFIG.sendToRemote || !CONFIG.remoteEndpoint) return;

  try {
    await fetch(CONFIG.remoteEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        level,
        category,
        message,
        data,
        timestamp: Date.now(),
        userAgent: navigator.userAgent,
        url: globalThis.location?.href,
      }),
    });
  } catch (error) {
    // Evitar loop infinito de errores
    console.error('Failed to send log to remote:', error);
  }
}

/**
 * Función base de logging
 */
function log(level, levelName, category, message, data = null) {
  // Filtrar por nivel mínimo
  if (level < CONFIG.minLevel) return;

  const { formatted, data: logData } = formatMessage(levelName, category, message, data);

  // Color si está habilitado
  const color = CONFIG.enableColor ? COLORS[levelName] : '';
  const reset = CONFIG.enableColor ? COLORS.RESET : '';

  // Log a consola
  let consoleMethod = 'log';
  if (level >= LOG_LEVEL.ERROR) {
    consoleMethod = 'error';
  } else if (level >= LOG_LEVEL.WARN) {
    consoleMethod = 'warn';
  }

  if (logData) {
    console[consoleMethod](`${color}${formatted}${reset}`, logData);
  } else {
    console[consoleMethod](`${color}${formatted}${reset}`);
  }

  // Enviar a remoto si es ERROR o WARN
  if (level >= LOG_LEVEL.WARN) {
    sendToRemote(levelName, category, message, logData);
  }
}

// API pública
const logger = {
  /**
   * Log de debugging - Solo en desarrollo
   */
  debug: (message, data = null, category = LOG_CATEGORY.SYSTEM) => {
    log(LOG_LEVEL.DEBUG, 'DEBUG', category, message, data);
  },

  /**
   * Log informativo
   */
  info: (message, data = null, category = LOG_CATEGORY.SYSTEM) => {
    log(LOG_LEVEL.INFO, 'INFO', category, message, data);
  },

  /**
   * Log de advertencia
   */
  warn: (message, data = null, category = LOG_CATEGORY.SYSTEM) => {
    log(LOG_LEVEL.WARN, 'WARN', category, message, data);
  },

  /**
   * Log de error
   */
  error: (message, error = null, category = LOG_CATEGORY.SYSTEM) => {
    const errorData =
      error instanceof Error
        ? {
            message: error.message,
            stack: error.stack,
            name: error.name,
          }
        : error;

    log(LOG_LEVEL.ERROR, 'ERROR', category, message, errorData);
  },

  /**
   * Performance timing
   */
  time: (label) => {
    if (CONFIG.minLevel <= LOG_LEVEL.DEBUG) {
      console.time(`⏱️ ${label}`);
    }
  },

  /**
   * Performance timing end
   */
  timeEnd: (label) => {
    if (CONFIG.minLevel <= LOG_LEVEL.DEBUG) {
      console.timeEnd(`⏱️ ${label}`);
    }
  },

  /**
   * Configuración del logger
   */
  configure: (options) => {
    Object.assign(CONFIG, options);
  },

  /**
   * Obtener configuración actual
   */
  getConfig: () => ({ ...CONFIG }),
};

// Export default y named
export default logger;
export { logger };
