/**
 * 🎯 OPTIMIZACIÓN Y HELPERS - FLOWDISTRIBUTOR
 *
 * Funciones de utilidad y optimizaciones para performance
 */

import { useCallback, useEffect, useRef } from 'react';

/**
 * Hook personalizado para animaciones optimizadas
 * Previene renders innecesarios
 */
export const useOptimizedAnimation = (callback: () => void, deps: any[]) => {
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useCallback(() => {
    callbackRef.current();
  }, deps);
};

/**
 * Configuración optimizada de Framer Motion
 * Reduce cálculos y mejora performance
 */
export const optimizedSpring = {
  type: 'spring',
  stiffness: 300,
  damping: 30,
  mass: 0.5,
};

export const optimizedTween = {
  type: 'tween',
  duration: 0.3,
  ease: 'easeOut',
};

/**
 * Variantes de animación reutilizables
 */
export const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: optimizedTween,
};

export const scaleIn = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.8 },
  transition: optimizedSpring,
};

export const slideInRight = {
  initial: { x: 100, opacity: 0 },
  animate: { x: 0, opacity: 1 },
  exit: { x: -100, opacity: 0 },
  transition: optimizedTween,
};

/**
 * Debounce optimizado para inputs
 */
export const useDebounce = <T,>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = React.useState<T>(value);

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

/**
 * Validación de credenciales (ejemplo)
 */
export const validateCredentials = (username: string, password: string): boolean => {
  return username.length >= 3 && password.length >= 4;
};

/**
 * Formatear números a moneda
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: 2,
  }).format(amount);
};

/**
 * Formatear fechas
 */
export const formatDate = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('es-MX', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(d);
};

/**
 * Generar ID único
 */
export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Calcular distribución bancaria (63%, 5%, 32%)
 */
export const calcularDistribucionBancaria = (monto: number) => {
  return {
    bovedaMonte: Number((monto * 0.63).toFixed(2)),
    fletes: Number((monto * 0.05).toFixed(2)),
    utilidades: Number((monto * 0.32).toFixed(2)),
  };
};

/**
 * Validar rango de monto
 */
export const validarMonto = (monto: number, minimo: number, maximo: number): boolean => {
  return monto >= minimo && monto <= maximo && !isNaN(monto);
};

/**
 * Configuración de localStorage con expiración
 */
export const storage = {
  set: (key: string, value: any, expirationHours = 24) => {
    const item = {
      value,
      expiry: Date.now() + expirationHours * 60 * 60 * 1000,
    };
    localStorage.setItem(key, JSON.stringify(item));
  },

  get: (key: string) => {
    const itemStr = localStorage.getItem(key);
    if (!itemStr) return null;

    try {
      const item = JSON.parse(itemStr);
      if (Date.now() > item.expiry) {
        localStorage.removeItem(key);
        return null;
      }
      return item.value;
    } catch {
      return null;
    }
  },

  remove: (key: string) => {
    localStorage.removeItem(key);
  },
};

/**
 * Tema de colores consistente
 */
export const colors = {
  primary: {
    purple: '#9333EA',
    pink: '#EC4899',
    blue: '#3B82F6',
    cyan: '#06B6D4',
  },
  banks: {
    bovedaMonte: '#F59E0B', // Amber
    fletes: '#3B82F6',      // Blue
    utilidades: '#10B981',  // Green
    azteca: '#8B5CF6',      // Purple
    banorte: '#EF4444',     // Red
  },
  status: {
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',
  },
};

/**
 * Configuración de animaciones globales
 */
export const animationConfig = {
  // Duraciones en ms
  fast: 150,
  normal: 300,
  slow: 500,

  // Easings
  easeOut: [0.16, 1, 0.3, 1],
  easeIn: [0.7, 0, 0.84, 0],
  easeInOut: [0.65, 0, 0.35, 1],

  // Spring configs
  springBouncy: { type: 'spring', stiffness: 400, damping: 15 },
  springGentle: { type: 'spring', stiffness: 300, damping: 30 },
  springSmooth: { type: 'spring', stiffness: 200, damping: 40 },
};

/**
 * Prevenir scroll cuando modal está abierto
 */
export const usePreventScroll = (isOpen: boolean) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);
};

/**
 * Hook para detectar click fuera de elemento
 */
export const useClickOutside = (
  ref: React.RefObject<HTMLElement>,
  handler: () => void
) => {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return;
      }
      handler();
    };

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]);
};

/**
 * Notificaciones toast simples
 */
export const toast = {
  success: (message: string) => {
    // Implementar con tu sistema de notificaciones
    console.log('✅', message);
  },
  error: (message: string) => {
    console.error('❌', message);
  },
  info: (message: string) => {
    console.log('ℹ️', message);
  },
  warning: (message: string) => {
    console.warn('⚠️', message);
  },
};

// Importar React para useDebounce
import React from 'react';
