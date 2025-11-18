/**
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║                CHRONOS PERFORMANCE OPTIMIZATIONS                           ║
 * ║          Custom Hooks Avanzados para Optimización de Performance           ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 * Incluye:
 * - useDebounce: Debounce de valores
 * - useThrottle: Throttle de funciones
 * - useIntersectionObserver: Lazy loading con intersection observer
 * - useLocalStorage: State persistente en localStorage
 * - useMediaQuery: Responsive breakpoints
 * - usePrevious: Obtener valor anterior
 * - useOnClickOutside: Detectar clicks fuera de elemento
 * - useWindowSize: Dimensiones de ventana
 * - useNetworkStatus: Estado de conexión
 * - useMemoCompare: Memo con comparación custom
 *
 * @module PerformanceOptimizations
 * @author CHRONOS System
 * @version 2.0.0
 */
import { useCallback, useEffect, useRef, useState } from 'react';

// ============================================================================
// USE DEBOUNCE
// ============================================================================

/**
 * Debounce de un valor
 * @param {*} value - Valor a debounce
 * @param {number} delay - Delay en ms
 * @returns {*} Valor debounced
 */
export const useDebounce = (value, delay = 500) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// ============================================================================
// USE THROTTLE
// ============================================================================

/**
 * Throttle de una función
 * @param {Function} callback - Función a throttle
 * @param {number} delay - Delay en ms
 * @returns {Function} Función throttled
 */
export const useThrottle = (callback, delay = 500) => {
  const lastRun = useRef(Date.now());

  return useCallback(
    (...args) => {
      const now = Date.now();

      if (now - lastRun.current >= delay) {
        callback(...args);
        lastRun.current = now;
      }
    },
    [callback, delay]
  );
};

// ============================================================================
// USE INTERSECTION OBSERVER
// ============================================================================

/**
 * Intersection Observer para lazy loading
 * @param {Object} options - Opciones del observer
 * @returns {Array} [ref, isIntersecting, entry]
 */
export const useIntersectionObserver = (options = {}) => {
  const [entry, setEntry] = useState(null);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const elementRef = useRef(null);

  const { threshold = 0, root = null, rootMargin = '0%', freezeOnceVisible = false } = options;

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const hasIOSupport = !!window.IntersectionObserver;
    if (!hasIOSupport) {
      setIsIntersecting(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isIntersecting = entry?.isIntersecting;

        setEntry(entry);
        setIsIntersecting(isIntersecting);

        if (isIntersecting && freezeOnceVisible) {
          observer.unobserve(element);
        }
      },
      { threshold, root, rootMargin }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [threshold, root, rootMargin, freezeOnceVisible]);

  return [elementRef, isIntersecting, entry];
};

// ============================================================================
// USE LOCAL STORAGE
// ============================================================================

/**
 * State persistente en localStorage
 * @param {string} key - Key del localStorage
 * @param {*} initialValue - Valor inicial
 * @returns {Array} [value, setValue]
 */
export const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value) => {
      try {
        const valueToStore = value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);

        if (typeof window !== 'undefined') {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
        }
      } catch (error) {
        // Silent fail
      }
    },
    [key, storedValue]
  );

  return [storedValue, setValue];
};

// ============================================================================
// USE MEDIA QUERY
// ============================================================================

/**
 * Hook para responsive breakpoints
 * @param {string} query - Media query
 * @returns {boolean} Matches
 */
export const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }

    const listener = () => setMatches(media.matches);
    media.addEventListener('change', listener);

    return () => media.removeEventListener('change', listener);
  }, [matches, query]);

  return matches;
};

// ============================================================================
// USE PREVIOUS
// ============================================================================

/**
 * Obtener valor anterior de una variable
 * @param {*} value - Valor actual
 * @returns {*} Valor anterior
 */
export const usePrevious = (value) => {
  const ref = useRef();

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
};

// ============================================================================
// USE ON CLICK OUTSIDE
// ============================================================================

/**
 * Detectar clicks fuera de un elemento
 * @param {Function} handler - Callback cuando se hace click fuera
 * @returns {Object} Ref del elemento
 */
export const useOnClickOutside = (handler) => {
  const ref = useRef(null);

  useEffect(() => {
    const listener = (event) => {
      const el = ref.current;
      if (!el || el.contains(event.target)) {
        return;
      }

      handler(event);
    };

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [handler]);

  return ref;
};

// ============================================================================
// USE WINDOW SIZE
// ============================================================================

/**
 * Obtener dimensiones de la ventana
 * @returns {Object} { width, height }
 */
export const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
};

// ============================================================================
// USE NETWORK STATUS
// ============================================================================

/**
 * Obtener estado de la conexión
 * @returns {Object} { online, downlink, effectiveType }
 */
export const useNetworkStatus = () => {
  const [status, setStatus] = useState({
    online: typeof navigator !== 'undefined' ? navigator.onLine : true,
    downlink: null,
    effectiveType: null,
  });

  useEffect(() => {
    const handleOnline = () => {
      setStatus((prev) => ({ ...prev, online: true }));
    };

    const handleOffline = () => {
      setStatus((prev) => ({ ...prev, online: false }));
    };

    const handleConnectionChange = () => {
      const connection = navigator.connection;
      if (connection) {
        setStatus((prev) => ({
          ...prev,
          downlink: connection.downlink,
          effectiveType: connection.effectiveType,
        }));
      }
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    const connection = navigator.connection;
    if (connection) {
      connection.addEventListener('change', handleConnectionChange);
      handleConnectionChange();
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      if (connection) {
        connection.removeEventListener('change', handleConnectionChange);
      }
    };
  }, []);

  return status;
};

// ============================================================================
// USE MEMO COMPARE
// ============================================================================

/**
 * useMemo con función de comparación custom
 * @param {Function} factory - Factory function
 * @param {Array} deps - Dependencies
 * @param {Function} compare - Función de comparación
 * @returns {*} Memoized value
 */
export const useMemoCompare = (factory, deps, compare) => {
  const ref = useRef();

  if (!ref.current || !compare(deps, ref.current.deps)) {
    ref.current = {
      value: factory(),
      deps,
    };
  }

  return ref.current.value;
};

// ============================================================================
// USE INTERVAL
// ============================================================================

/**
 * setInterval con hook
 * @param {Function} callback - Callback
 * @param {number} delay - Delay en ms
 */
export const useInterval = (callback, delay) => {
  const savedCallback = useRef();

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delay !== null) {
      const id = setInterval(() => savedCallback.current(), delay);
      return () => clearInterval(id);
    }
  }, [delay]);
};

// ============================================================================
// USE TIMEOUT
// ============================================================================

/**
 * setTimeout con hook
 * @param {Function} callback - Callback
 * @param {number} delay - Delay en ms
 */
export const useTimeout = (callback, delay) => {
  const savedCallback = useRef();

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delay !== null) {
      const id = setTimeout(() => savedCallback.current(), delay);
      return () => clearTimeout(id);
    }
  }, [delay]);
};

// ============================================================================
// USE ASYNC
// ============================================================================

/**
 * Hook para manejar operaciones async
 * @param {Function} asyncFunction - Función async
 * @param {boolean} immediate - Ejecutar inmediatamente
 * @returns {Object} { execute, loading, error, data }
 */
export const useAsync = (asyncFunction, immediate = true) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const execute = useCallback(
    async (...args) => {
      setLoading(true);
      setData(null);
      setError(null);

      try {
        const response = await asyncFunction(...args);
        setData(response);
        return response;
      } catch (err) {
        setError(err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [asyncFunction]
  );

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);

  return { execute, loading, error, data };
};

// ============================================================================
// USE COPY TO CLIPBOARD
// ============================================================================

/**
 * Copiar texto al clipboard
 * @returns {Array} [copiedText, copy]
 */
export const useCopyToClipboard = () => {
  const [copiedText, setCopiedText] = useState(null);

  const copy = useCallback(async (text) => {
    if (!navigator?.clipboard) {
      return false;
    }

    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(text);
      return true;
    } catch (error) {
      setCopiedText(null);
      return false;
    }
  }, []);

  return [copiedText, copy];
};

// ============================================================================
// USE TOGGLE
// ============================================================================

/**
 * Hook para toggle boolean
 * @param {boolean} initialValue - Valor inicial
 * @returns {Array} [value, toggle, setValue]
 */
export const useToggle = (initialValue = false) => {
  const [value, setValue] = useState(initialValue);

  const toggle = useCallback(() => {
    setValue((v) => !v);
  }, []);

  return [value, toggle, setValue];
};

// ============================================================================
// EXPORT ALL
// ============================================================================

export default {
  useDebounce,
  useThrottle,
  useIntersectionObserver,
  useLocalStorage,
  useMediaQuery,
  usePrevious,
  useOnClickOutside,
  useWindowSize,
  useNetworkStatus,
  useMemoCompare,
  useInterval,
  useTimeout,
  useAsync,
  useCopyToClipboard,
  useToggle,
};
