import { useEffect } from 'react';

import { clsx } from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';

// Dialog es un alias de Modal para compatibilidad
export const Dialog = ({ isOpen, onClose, children, className, ...props }) => {
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

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Dialog Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, type: 'spring' }}
            className={clsx(
              'relative z-50 w-full max-w-lg rounded-xl bg-gray-900/95 p-6 shadow-2xl',
              'border border-cyan-500/20',
              className
            )}
            {...props}
          >
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export const DialogContent = ({ children, className, ...props }) => (
  <div className={clsx('space-y-4', className)} {...props}>
    {children}
  </div>
);

export const DialogHeader = ({ children, className, ...props }) => (
  <div className={clsx('space-y-2', className)} {...props}>
    {children}
  </div>
);

export const DialogTitle = ({ children, className, ...props }) => (
  <h2
    className={clsx(
      'text-2xl font-bold text-white',
      'bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent',
      className
    )}
    {...props}
  >
    {children}
  </h2>
);

export const DialogDescription = ({ children, className, ...props }) => (
  <p className={clsx('text-gray-400 text-sm', className)} {...props}>
    {children}
  </p>
);

export const DialogFooter = ({ children, className, ...props }) => (
  <div className={clsx('flex justify-end gap-3 mt-6', className)} {...props}>
    {children}
  </div>
);

export default Dialog;
