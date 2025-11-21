/**
 * 🍞 TOAST MANAGER GLOBAL - SISTEMA DE NOTIFICACIONES PREMIUM
 * Gestor centralizado de notificaciones con queue y auto-dismiss
 */
import { createContext, useCallback, useContext, useState } from 'react';

import { AnimatePresence } from 'framer-motion';

import { Toast } from '../feedback/FeedbackSystem';

const ToastContext = createContext(null);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const addToast = useCallback(
    ({ message, type = 'info', duration = 3000, position = 'top-right' }) => {
      const id = Date.now() + Math.random();
      const newToast = { id, message, type, duration, position };

      setToasts((prev) => [...prev, newToast]);

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }

      return id;
    },
    [removeToast]
  );

  const success = useCallback(
    (message, options = {}) => {
      return addToast({ message, type: 'success', ...options });
    },
    [addToast]
  );

  const error = useCallback(
    (message, options = {}) => {
      return addToast({ message, type: 'error', ...options });
    },
    [addToast]
  );

  const warning = useCallback(
    (message, options = {}) => {
      return addToast({ message, type: 'warning', ...options });
    },
    [addToast]
  );

  const info = useCallback(
    (message, options = {}) => {
      return addToast({ message, type: 'info', ...options });
    },
    [addToast]
  );

  const clearAll = useCallback(() => {
    setToasts([]);
  }, []);

  const value = {
    addToast,
    removeToast,
    success,
    error,
    warning,
    info,
    clearAll,
  };

  // Group toasts by position
  const toastsByPosition = toasts.reduce((acc, toast) => {
    const pos = toast.position || 'top-right';
    if (!acc[pos]) acc[pos] = [];
    acc[pos].push(toast);
    return acc;
  }, {});

  return (
    <ToastContext.Provider value={value}>
      {children}

      {/* Render toasts grouped by position */}
      {Object.entries(toastsByPosition).map(([position, positionToasts]) => (
        <div key={position} className="toast-container" style={{ position: 'fixed', zIndex: 9999 }}>
          <AnimatePresence mode="popLayout">
            {positionToasts.map((toast) => (
              <Toast
                key={toast.id}
                message={toast.message}
                type={toast.type}
                duration={0} // Manager handles duration
                position={position}
                onClose={() => removeToast(toast.id)}
              />
            ))}
          </AnimatePresence>
        </div>
      ))}
    </ToastContext.Provider>
  );
};

export default ToastProvider;
