/**
 * 🎭 ULTRA PREMIUM MODAL - Sistema de modales con glassmorphism y efectos 3D
 * Incluye: Dialog, Confirmation, Alert, Drawer
 */
import { useEffect } from 'react';

import { AnimatePresence, motion } from 'framer-motion';
import { AlertTriangle, CheckCircle, Info, X, XCircle } from 'lucide-react';

/**
 * Backdrop con glassmorphism y blur
 */
const ModalBackdrop = ({ onClick, children }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClick}
      className="fixed inset-0 z-[9998] flex items-center justify-center p-4 bg-black/70 backdrop-blur-xl"
      style={{ perspective: '1000px' }}
    >
      {children}
    </motion.div>
  );
};

/**
 * Ultra Premium Modal Base
 */
export const UltraPremiumModal = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  showClose = true,
}) => {
  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl',
    full: 'max-w-[95vw]',
  };

  // Evitar scroll del body cuando el modal está abierto
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

  return (
    <AnimatePresence>
      {isOpen && (
        <ModalBackdrop onClick={onClose}>
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotateX: -15, y: 50 }}
            animate={{ opacity: 1, scale: 1, rotateX: 0, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, rotateX: 15, y: -50 }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 25,
            }}
            onClick={(e) => e.stopPropagation()}
            className={`relative w-full ${sizeClasses[size]} bg-gradient-to-br from-zinc-900 via-zinc-900 to-black border border-zinc-700/50 rounded-3xl shadow-2xl overflow-hidden`}
            style={{ transformStyle: 'preserve-3d' }}
          >
            {/* Particles background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {Array.from({ length: 20 }).map((_, i) => (
                <motion.div
                  key={`particle-${i}`}
                  className="absolute w-1 h-1 bg-cyan-400/30 rounded-full"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                  animate={{
                    y: [0, -30, 0],
                    opacity: [0.3, 1, 0.3],
                  }}
                  transition={{
                    duration: 2 + Math.random() * 2,
                    repeat: Infinity,
                    delay: Math.random() * 2,
                  }}
                />
              ))}
            </div>

            {/* Gradient border glow */}
            <motion.div
              className="absolute inset-0 rounded-3xl"
              animate={{
                background: [
                  'linear-gradient(0deg, rgba(6,182,212,0.2), rgba(168,85,247,0.2))',
                  'linear-gradient(90deg, rgba(168,85,247,0.2), rgba(236,72,153,0.2))',
                  'linear-gradient(180deg, rgba(236,72,153,0.2), rgba(6,182,212,0.2))',
                  'linear-gradient(270deg, rgba(6,182,212,0.2), rgba(168,85,247,0.2))',
                  'linear-gradient(360deg, rgba(168,85,247,0.2), rgba(6,182,212,0.2))',
                ],
              }}
              transition={{ duration: 5, repeat: Infinity }}
            />

            {/* Header */}
            {title && (
              <div className="relative z-10 px-8 py-6 border-b border-zinc-800/50 backdrop-blur-xl">
                <div className="flex items-center justify-between">
                  <motion.h2
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-2xl font-bold text-white"
                  >
                    {title}
                  </motion.h2>

                  {showClose && (
                    <motion.button
                      onClick={onClose}
                      whileHover={{ scale: 1.1, rotate: 90 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-2 rounded-xl bg-zinc-800/50 hover:bg-zinc-700/50 text-zinc-400 hover:text-white transition-colors"
                    >
                      <X className="w-6 h-6" />
                    </motion.button>
                  )}
                </div>
              </div>
            )}

            {/* Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="relative z-10 p-8 max-h-[70vh] overflow-y-auto custom-scrollbar"
            >
              {children}
            </motion.div>

            {/* Bottom glow */}
            <motion.div
              className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-cyan-500/10 to-transparent blur-2xl"
              animate={{
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{ duration: 3, repeat: Infinity }}
            />
          </motion.div>
        </ModalBackdrop>
      )}
    </AnimatePresence>
  );
};

/**
 * Confirmation Dialog con variantes
 */
export const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  variant = 'info',
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  isLoading = false,
}) => {
  const variantConfig = {
    info: {
      icon: Info,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/20',
      borderColor: 'border-blue-500/30',
      buttonBg: 'bg-blue-600 hover:bg-blue-700',
    },
    success: {
      icon: CheckCircle,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/20',
      borderColor: 'border-emerald-500/30',
      buttonBg: 'bg-emerald-600 hover:bg-emerald-700',
    },
    warning: {
      icon: AlertTriangle,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/20',
      borderColor: 'border-yellow-500/30',
      buttonBg: 'bg-yellow-600 hover:bg-yellow-700',
    },
    danger: {
      icon: XCircle,
      color: 'text-red-400',
      bgColor: 'bg-red-500/20',
      borderColor: 'border-red-500/30',
      buttonBg: 'bg-red-600 hover:bg-red-700',
    },
  };

  const config = variantConfig[variant];
  const Icon = config.icon;

  return (
    <AnimatePresence>
      {isOpen && (
        <ModalBackdrop onClick={onClose}>
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotateY: -90 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            exit={{ opacity: 0, scale: 0.8, rotateY: 90 }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 25,
            }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md bg-gradient-to-br from-zinc-900 to-black border border-zinc-700/50 rounded-3xl shadow-2xl p-8"
          >
            {/* Icon */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
              className={`mx-auto mb-6 w-20 h-20 rounded-full ${config.bgColor} ${config.borderColor} border-2 flex items-center justify-center`}
            >
              <Icon className={`w-10 h-10 ${config.color}`} />
            </motion.div>

            {/* Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center space-y-4"
            >
              <h3 className="text-2xl font-bold text-white">{title}</h3>
              <p className="text-zinc-400 text-lg">{message}</p>
            </motion.div>

            {/* Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-8 flex items-center gap-4"
            >
              <motion.button
                onClick={onClose}
                disabled={isLoading}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex-1 px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl font-semibold transition-colors disabled:opacity-50"
              >
                {cancelText}
              </motion.button>

              <motion.button
                onClick={onConfirm}
                disabled={isLoading}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`flex-1 px-6 py-3 ${config.buttonBg} text-white rounded-xl font-semibold transition-colors disabled:opacity-50 flex items-center justify-center gap-2`}
              >
                {isLoading ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                    />
                    <span>Procesando...</span>
                  </>
                ) : (
                  confirmText
                )}
              </motion.button>
            </motion.div>

            {/* Particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-3xl">
              {Array.from({ length: 15 }).map((_, i) => (
                <motion.div
                  key={`conf-particle-${i}`}
                  className={`absolute w-1 h-1 rounded-full ${config.color.replace('text', 'bg')}/30`}
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                  animate={{
                    y: [0, -20, 0],
                    opacity: [0.3, 1, 0.3],
                  }}
                  transition={{
                    duration: 2 + Math.random(),
                    repeat: Infinity,
                    delay: Math.random() * 2,
                  }}
                />
              ))}
            </div>
          </motion.div>
        </ModalBackdrop>
      )}
    </AnimatePresence>
  );
};

/**
 * Side Drawer con animación desde el lateral
 */
export const SideDrawer = ({
  isOpen,
  onClose,
  title,
  children,
  position = 'right',
  size = 'md',
}) => {
  const positionClasses = {
    left: 'left-0 top-0 bottom-0',
    right: 'right-0 top-0 bottom-0',
    top: 'top-0 left-0 right-0',
    bottom: 'bottom-0 left-0 right-0',
  };

  const sizeClasses = {
    sm: position === 'left' || position === 'right' ? 'w-96' : 'h-96',
    md: position === 'left' || position === 'right' ? 'w-[32rem]' : 'h-[32rem]',
    lg: position === 'left' || position === 'right' ? 'w-[48rem]' : 'h-[48rem]',
  };

  const slideVariants = {
    left: { x: [-400, 0], opacity: [0, 1] },
    right: { x: [400, 0], opacity: [0, 1] },
    top: { y: [-400, 0], opacity: [0, 1] },
    bottom: { y: [400, 0], opacity: [0, 1] },
  };

  const exitVariants = {
    left: { x: -400, opacity: 0 },
    right: { x: 400, opacity: 0 },
    top: { y: -400, opacity: 0 },
    bottom: { y: 400, opacity: 0 },
  };

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

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <ModalBackdrop onClick={onClose}>
            <motion.div
              initial={{
                x: slideVariants[position].x[0],
                y: slideVariants[position].y?.[0] || 0,
                opacity: 0,
              }}
              animate={{ x: 0, y: 0, opacity: 1 }}
              exit={exitVariants[position]}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
              className={`fixed ${positionClasses[position]} ${sizeClasses[size]} bg-gradient-to-br from-zinc-900 to-black border-l border-zinc-700/50 shadow-2xl overflow-hidden flex flex-col`}
            >
              {/* Header */}
              <div className="px-8 py-6 border-b border-zinc-800/50 backdrop-blur-xl flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">{title}</h2>
                <motion.button
                  onClick={onClose}
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 rounded-xl bg-zinc-800/50 hover:bg-zinc-700/50 text-zinc-400 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </motion.button>
              </div>

              {/* Content */}
              <div className="flex-1 p-8 overflow-y-auto custom-scrollbar">{children}</div>

              {/* Glow effect */}
              <motion.div
                className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500"
                animate={{
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.div>
          </ModalBackdrop>
        </>
      )}
    </AnimatePresence>
  );
};

export default {
  UltraPremiumModal,
  ConfirmationModal,
  SideDrawer,
};
