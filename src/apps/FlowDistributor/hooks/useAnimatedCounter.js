/**
 * 🔢 useAnimatedCounter - Premium Animated Number Counter
 *
 * Hook personalizado para animar números con easing suave y soporte
 * para formatos de moneda, decimales, y animaciones complejas
 */
import { useEffect, useRef, useState } from 'react';

/**
 * Easing functions para animaciones suaves
 */
const easingFunctions = {
  linear: (t) => t,
  easeInQuad: (t) => t * t,
  easeOutQuad: (t) => t * (2 - t),
  easeInOutQuad: (t) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
  easeInCubic: (t) => t * t * t,
  easeOutCubic: (t) => --t * t * t + 1,
  easeInOutCubic: (t) => (t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1),
  easeInQuart: (t) => t * t * t * t,
  easeOutQuart: (t) => 1 - --t * t * t * t,
  easeInOutQuart: (t) => (t < 0.5 ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t),
  easeOutElastic: (t) => {
    const p = 0.3;
    return Math.pow(2, -10 * t) * Math.sin(((t - p / 4) * (2 * Math.PI)) / p) + 1;
  },
};

/**
 * Hook para animar números con configuración avanzada
 *
 * @param {number} targetValue - Valor objetivo a animar
 * @param {Object} options - Opciones de configuración
 * @param {number} options.duration - Duración en ms (default: 2000)
 * @param {string} options.easing - Función easing (default: 'easeOutCubic')
 * @param {number} options.decimals - Número de decimales (default: 0)
 * @param {boolean} options.autoStart - Iniciar automáticamente (default: true)
 * @param {Function} options.onComplete - Callback al completar
 *
 * @returns {Object} - { value, isAnimating, restart }
 */
export function useAnimatedCounter(targetValue, options = {}) {
  const {
    duration = 2000,
    easing = 'easeOutCubic',
    decimals = 0,
    autoStart = true,
    onComplete,
  } = options;

  const [value, setValue] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const rafRef = useRef(null);
  const startTimeRef = useRef(null);
  const startValueRef = useRef(0);

  const animate = (currentTime) => {
    if (!startTimeRef.current) {
      startTimeRef.current = currentTime;
    }

    const elapsed = currentTime - startTimeRef.current;
    const progress = Math.min(elapsed / duration, 1);

    const easingFunction = easingFunctions[easing] || easingFunctions.easeOutCubic;
    const easedProgress = easingFunction(progress);

    const currentValue =
      startValueRef.current + (targetValue - startValueRef.current) * easedProgress;

    setValue(Number(currentValue.toFixed(decimals)));

    if (progress < 1) {
      rafRef.current = requestAnimationFrame(animate);
    } else {
      setIsAnimating(false);
      onComplete?.();
    }
  };

  const restart = (newStartValue = 0) => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }
    startTimeRef.current = null;
    startValueRef.current = newStartValue;
    setIsAnimating(true);
    rafRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    if (autoStart && targetValue !== value) {
      restart(value);
    }

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [targetValue]);

  return { value, isAnimating, restart };
}

/**
 * Hook para contador con formato de moneda
 *
 * @param {number} targetValue - Valor objetivo
 * @param {Object} options - Opciones de configuración
 * @param {string} options.currency - Código de moneda (default: 'USD')
 * @param {string} options.locale - Locale para formateo (default: 'es-MX')
 * @param {number} options.duration - Duración en ms
 *
 * @returns {string} - Valor formateado como moneda
 */
export function useAnimatedCurrency(targetValue, options = {}) {
  const {
    currency = 'USD',
    locale = 'es-MX',
    duration = 2000,
    easing = 'easeOutCubic',
    decimals = 2,
  } = options;

  const { value } = useAnimatedCounter(targetValue, {
    duration,
    easing,
    decimals,
  });

  const formatter = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return formatter.format(value);
}

/**
 * Hook para contador con formato personalizado
 *
 * @param {number} targetValue - Valor objetivo
 * @param {Object} options - Opciones
 * @param {Function} options.formatter - Función de formateo custom
 *
 * @returns {string} - Valor formateado
 */
export function useAnimatedNumber(targetValue, options = {}) {
  const { formatter, duration = 2000, easing = 'easeOutCubic', decimals = 0 } = options;

  const { value } = useAnimatedCounter(targetValue, {
    duration,
    easing,
    decimals,
  });

  if (formatter) {
    return formatter(value);
  }

  return value.toLocaleString('es-MX', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

/**
 * Hook para porcentaje animado
 *
 * @param {number} targetValue - Valor objetivo (0-100)
 * @param {Object} options - Opciones
 *
 * @returns {string} - Valor con símbolo %
 */
export function useAnimatedPercentage(targetValue, options = {}) {
  const { duration = 2000, easing = 'easeOutCubic', decimals = 2 } = options;

  const { value } = useAnimatedCounter(targetValue, {
    duration,
    easing,
    decimals,
  });

  return `${value.toFixed(decimals)}%`;
}

/**
 * Hook para contador con múltiples valores (stats)
 *
 * @param {Object} targetValues - Objeto con valores objetivo
 * @param {Object} options - Opciones compartidas
 *
 * @returns {Object} - Objeto con valores animados
 */
export function useAnimatedStats(targetValues, options = {}) {
  const [stats, setStats] = useState({});

  useEffect(() => {
    const keys = Object.keys(targetValues);
    keys.forEach((key) => {
      const { value } = useAnimatedCounter(targetValues[key], options);
      setStats((prev) => ({ ...prev, [key]: value }));
    });
  }, [targetValues, options]);

  return stats;
}

/**
 * Hook para contar hacia atrás (countdown)
 *
 * @param {number} startValue - Valor inicial
 * @param {Object} options - Opciones
 *
 * @returns {Object} - { value, isRunning, pause, resume, reset }
 */
export function useCountdown(startValue, options = {}) {
  const { duration = 1000, onComplete } = options;

  const [value, setValue] = useState(startValue);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef(null);

  const pause = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      setIsRunning(false);
    }
  };

  const resume = () => {
    if (!isRunning && value > 0) {
      setIsRunning(true);
      intervalRef.current = setInterval(() => {
        setValue((prev) => {
          if (prev <= 1) {
            pause();
            onComplete?.();
            return 0;
          }
          return prev - 1;
        });
      }, duration / startValue);
    }
  };

  const reset = () => {
    pause();
    setValue(startValue);
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return { value, isRunning, pause, resume, reset };
}

export default {
  useAnimatedCounter,
  useAnimatedCurrency,
  useAnimatedNumber,
  useAnimatedPercentage,
  useAnimatedStats,
  useCountdown,
};
