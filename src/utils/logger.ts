/**
 * Logger Utility - Solo activo en desarrollo
 * @module utils/logger
 */

const isDev = import.meta.env.DEV;

type LogLevel = 'log' | 'info' | 'warn' | 'error' | 'debug';

interface LoggerOptions {
  enabled?: boolean;
  prefix?: string;
}

class Logger {
  private enabled: boolean;
  private prefix: string;

  constructor(options: LoggerOptions = {}) {
    this.enabled = options.enabled ?? isDev;
    this.prefix = options.prefix ?? '';
  }

  log(..._args: any[]): void {
    if (this.enabled) {
    }
  }

  info(..._args: any[]): void {
    if (this.enabled) {
    }
  }

  warn(..._args: any[]): void {
    if (this.enabled) {
    }
  }

  error(..._args: any[]): void {}

  debug(..._args: any[]): void {
    if (this.enabled) {
    }
  }

  group(_label: string): void {
    if (this.enabled) {
    }
  }

  groupEnd(): void {
    if (this.enabled) {
    }
  }

  table(_data: any): void {
    if (this.enabled) {
    }
  }
}

// Logger por defecto
export const logger = new Logger();

// Logger específico para FlowDistributor
export const flowLogger = new Logger({ prefix: 'FlowDistributor' });

// Logger específico para servicios
export const serviceLogger = new Logger({ prefix: 'Service' });

// Función helper para crear loggers personalizados
export const createLogger = (prefix: string, enabled?: boolean): Logger => {
  return new Logger({ prefix, enabled });
};

export default logger;
