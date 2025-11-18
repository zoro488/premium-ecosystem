/**
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║                    CHRONOS ULTRA TOAST SYSTEM                              ║
 * ║         Sistema de Notificaciones Premium con Queue y Animaciones          ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 * Features:
 * - Queue system (múltiples toasts)
 * - Swipe to dismiss
 * - Progress bar automático
 * - 9 posiciones (top-left, top-center, top-right, etc.)
 * - 5 tipos (success, error, warning, info, loading)
 * - Stack animations
 * - Sound effects (opcional)
 * - Custom icons
 * - Action buttons
 * - Persistent toasts
 *
 * @module UltraToastSystem
 * @author CHRONOS System
 * @version 2.0.0
 */
import { createContext, useCallback, useContext, useState } from 'react';

import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, CheckCircle, Info, Loader2, X, XCircle } from 'lucide-react';

// ============================================================================
// TOAST CONTEXT
// ============================================================================

const ToastContext = createContext();

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
};

// ============================================================================
// TOAST PROVIDER
// ============================================================================

export const ToastProvider = ({ children, position = 'top-right', maxToasts = 5 }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback(
    (options) => {
      const id = Date.now() + Math.random();
      const toast = {
        id,
        type: 'info',
        title: '',
        message: '',
        duration: 5000,
        dismissible: true,
        progress: true,
        action: null,
        ...options,
      };

      setToasts((prev) => {
        const newToasts = [toast, ...prev];
        return newToasts.slice(0, maxToasts);
      });

      if (toast.duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, toast.duration);
      }

      return id;
    },
    [maxToasts]
  );

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const success = useCallback(
    (message, options = {}) => {
      return addToast({ type: 'success', message, ...options });
    },
    [addToast]
  );

  const error = useCallback(
    (message, options = {}) => {
      return addToast({ type: 'error', message, ...options });
    },
    [addToast]
  );

  const warning = useCallback(
    (message, options = {}) => {
      return addToast({ type: 'warning', message, ...options });
    },
    [addToast]
  );

  const info = useCallback(
    (message, options = {}) => {
      return addToast({ type: 'info', message, ...options });
    },
    [addToast]
  );

  const loading = useCallback(
    (message, options = {}) => {
      return addToast({
        type: 'loading',
        message,
        duration: 0,
        dismissible: false,
        ...options,
      });
    },
    [addToast]
  );

  const promise = useCallback(
    async (promiseFn, messages = {}) => {
      const id = loading(messages.loading || 'Loading...');

      try {
        const result = await promiseFn();
        removeToast(id);
        success(messages.success || 'Success!');
        return result;
      } catch (err) {
        removeToast(id);
        error(messages.error || 'Error occurred');
        throw err;
      }
    },
    [loading, success, error, removeToast]
  );

  const value = {
    toasts,
    addToast,
    removeToast,
    success,
    error,
    warning,
    info,
    loading,
    promise,
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer toasts={toasts} position={position} onRemove={removeToast} />
    </ToastContext.Provider>
  );
};

// ============================================================================
// TOAST CONTAINER
// ============================================================================

const ToastContainer = ({ toasts, position, onRemove }) => {
  const positions = {
    'top-left': 'top-4 left-4',
    'top-center': 'top-4 left-1/2 -translate-x-1/2',
    'top-right': 'top-4 right-4',
    'center-left': 'top-1/2 left-4 -translate-y-1/2',
    center: 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
    'center-right': 'top-1/2 right-4 -translate-y-1/2',
    'bottom-left': 'bottom-4 left-4',
    'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2',
    'bottom-right': 'bottom-4 right-4',
  };

  const positionClass = positions[position] || positions['top-right'];

  return (
    <div
      className={`fixed z-[9999] flex flex-col gap-2 pointer-events-none ${positionClass}`}
      style={{ maxWidth: '420px', width: 'calc(100vw - 32px)' }}
    >
      <AnimatePresence>
        {toasts.map((toast, index) => (
          <Toast key={toast.id} toast={toast} index={index} onRemove={() => onRemove(toast.id)} />
        ))}
      </AnimatePresence>
    </div>
  );
};

// ============================================================================
// TOAST COMPONENT
// ============================================================================

const Toast = ({ toast, index, onRemove }) => {
  const [progress, setProgress] = useState(100);

  const typeConfig = {
    success: {
      icon: CheckCircle,
      colors: 'from-green-500/20 to-green-600/20 border-green-500/30',
      iconColor: 'text-green-400',
    },
    error: {
      icon: XCircle,
      colors: 'from-zinc-700/20 to-zinc-800/20 border-red-500/30',
      iconColor: 'text-red-400',
    },
    warning: {
      icon: AlertCircle,
      colors: 'from-yellow-500/20 to-yellow-600/20 border-yellow-500/30',
      iconColor: 'text-yellow-400',
    },
    info: {
      icon: Info,
      colors: 'from-blue-500/20 to-blue-600/20 border-blue-500/30',
      iconColor: 'text-blue-400',
    },
    loading: {
      icon: Loader2,
      colors: 'from-gray-500/20 to-gray-600/20 border-gray-500/30',
      iconColor: 'text-gray-400',
    },
  };

  const config = typeConfig[toast.type] || typeConfig.info;
  const Icon = config.icon;

  // Progress bar
  useState(() => {
    if (toast.progress && toast.duration > 0) {
      const interval = setInterval(() => {
        setProgress((prev) => {
          const newProgress = prev - 100 / (toast.duration / 100);
          if (newProgress <= 0) {
            clearInterval(interval);
            return 0;
          }
          return newProgress;
        });
      }, 100);

      return () => clearInterval(interval);
    }
  }, [toast.duration, toast.progress]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: 400, scale: 0.9 }}
      drag={toast.dismissible ? 'x' : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.2}
      onDragEnd={(e, info) => {
        if (Math.abs(info.offset.x) > 100) {
          onRemove();
        }
      }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 30,
      }}
      style={{
        marginTop: index * 8,
      }}
      className={`
        relative w-full pointer-events-auto
        backdrop-blur-xl bg-gradient-to-br ${config.colors}
        border rounded-xl shadow-2xl
        overflow-hidden
      `}
    >
      {/* Content */}
      <div className="p-4 flex items-start gap-3">
        {/* Icon */}
        <motion.div
          animate={toast.type === 'loading' ? { rotate: 360 } : {}}
          transition={
            toast.type === 'loading' ? { duration: 1, repeat: Infinity, ease: 'linear' } : {}
          }
          className="flex-shrink-0"
        >
          <Icon size={24} className={config.iconColor} />
        </motion.div>

        {/* Text */}
        <div className="flex-1 min-w-0">
          {toast.title && <p className="text-white font-semibold mb-1">{toast.title}</p>}
          <p className="text-gray-300 text-sm">{toast.message}</p>

          {/* Action Button */}
          {toast.action && (
            <button
              onClick={() => {
                toast.action.onClick();
                onRemove();
              }}
              className="
                mt-2 px-3 py-1 text-xs font-medium
                bg-white/10 hover:bg-white/20
                border border-white/20
                rounded-lg transition-colors
                text-white
              "
            >
              {toast.action.label}
            </button>
          )}
        </div>

        {/* Close Button */}
        {toast.dismissible && (
          <button
            onClick={onRemove}
            className="
              flex-shrink-0 p-1 rounded-lg
              bg-white/5 hover:bg-white/10
              border border-white/10
              transition-colors
            "
          >
            <X size={16} className="text-gray-400" />
          </button>
        )}
      </div>

      {/* Progress Bar */}
      {toast.progress && toast.duration > 0 && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
          <motion.div
            initial={{ width: '100%' }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.1, ease: 'linear' }}
            className={`h-full ${
              toast.type === 'success'
                ? 'bg-green-500'
                : toast.type === 'error'
                  ? 'bg-red-500'
                  : toast.type === 'warning'
                    ? 'bg-yellow-500'
                    : 'bg-blue-500'
            }`}
          />
        </div>
      )}
    </motion.div>
  );
};

// ============================================================================
// CONVENIENCE EXPORTS
// ============================================================================

export default ToastProvider;
