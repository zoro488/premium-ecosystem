import { useEffect } from 'react';

import { clsx } from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';

const Modal = ({
  isOpen,
  onClose,
  children,
  title,
  description,
  size = 'md',
  showCloseButton = true,
  closableOverlay = true,
  className,
  ...props
}) => {
  // Bloquear scroll del body cuando el modal está abierto
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

  // Manejar tecla Escape
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    '2xl': 'max-w-6xl',
    full: 'max-w-[95vw]',
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closableOverlay ? onClose : undefined}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 30,
            }}
            className={clsx(
              // Estilos base
              'relative w-full modal-premium',
              'rounded-2xl p-6',

              // Tamaños
              sizes[size],

              // Altura máxima
              'max-h-[90vh] overflow-y-auto',

              // Clases adicionales
              className
            )}
            onClick={(e) => e.stopPropagation()}
            {...props}
          >
            {/* Header */}
            {(title || showCloseButton) && (
              <div className="flex items-start justify-between mb-6">
                <div>
                  {title && <h2 className="text-xl font-bold text-white mb-1">{title}</h2>}
                  {description && <p className="text-slate-400 text-sm">{description}</p>}
                </div>

                {showCloseButton && (
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={onClose}
                    className={clsx(
                      'p-2 rounded-lg transition-colors',
                      'hover:bg-white/10 text-slate-400 hover:text-white',
                      'focus:outline-none focus:ring-2 focus:ring-blue-400/50'
                    )}
                  >
                    <X className="w-5 h-5" />
                  </motion.button>
                )}
              </div>
            )}

            {/* Content */}
            <div>{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

const ModalHeader = ({ children, className, ...props }) => (
  <div className={clsx('mb-6', className)} {...props}>
    {children}
  </div>
);

const ModalTitle = ({ children, className, ...props }) => (
  <h2 className={clsx('text-xl font-bold text-white mb-1', className)} {...props}>
    {children}
  </h2>
);

const ModalDescription = ({ children, className, ...props }) => (
  <p className={clsx('text-slate-400 text-sm', className)} {...props}>
    {children}
  </p>
);

const ModalContent = ({ children, className, ...props }) => (
  <div className={clsx('', className)} {...props}>
    {children}
  </div>
);

const ModalFooter = ({ children, className, ...props }) => (
  <div
    className={clsx(
      'mt-6 pt-4 border-t border-white/10 flex items-center gap-3 justify-end',
      className
    )}
    {...props}
  >
    {children}
  </div>
);

// Exportar componentes
Modal.Header = ModalHeader;
Modal.Title = ModalTitle;
Modal.Description = ModalDescription;
Modal.Content = ModalContent;
Modal.Footer = ModalFooter;

export default Modal;
export { ModalHeader, ModalTitle, ModalDescription, ModalContent, ModalFooter };
