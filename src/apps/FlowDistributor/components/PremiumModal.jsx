import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

/**
 * 🎭 PREMIUM MODAL - Modal con efectos 3D y glassmorphism
 */
export const PremiumModal = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  variant = 'default',
  showCloseButton = true,
  closeOnBackdrop = true,
}) => {
  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-full mx-4',
  };

  const variants = {
    default: 'bg-gray-800/95',
    glass: 'bg-gray-800/40 backdrop-blur-2xl',
    gradient: 'bg-gradient-to-br from-gray-800/95 to-gray-900/95',
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeOnBackdrop ? onClose : undefined}
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              className={`
                ${sizes[size]}
                w-full
                ${variants[variant]}
                rounded-2xl
                border border-gray-700/50
                shadow-2xl
                relative
                overflow-hidden
              `}
              initial={{
                opacity: 0,
                scale: 0.9,
                y: 50,
                rotateX: -15,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
                rotateX: 0,
              }}
              exit={{
                opacity: 0,
                scale: 0.9,
                y: 50,
                rotateX: 15,
              }}
              transition={{
                type: 'spring',
                stiffness: 300,
                damping: 30,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-purple-500/10 pointer-events-none" />

              {/* Header */}
              {title && (
                <div className="px-6 py-4 border-b border-gray-700/50 flex items-center justify-between">
                  <motion.h3
                    className="text-xl font-semibold text-white"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    {title}
                  </motion.h3>
                  {showCloseButton && (
                    <motion.button
                      onClick={onClose}
                      className="p-2 hover:bg-gray-700/50 rounded-lg transition-colors"
                      whileHover={{ scale: 1.1, rotate: 90 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <X className="w-5 h-5 text-gray-400" />
                    </motion.button>
                  )}
                </div>
              )}

              {/* Content */}
              <motion.div
                className="p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                {children}
              </motion.div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

/**
 * 🎨 DRAWER - Panel lateral deslizante
 */
export const Drawer = ({
  isOpen,
  onClose,
  title,
  children,
  position = 'right',
  width = '400px',
}) => {
  const positions = {
    left: { initial: { x: '-100%' }, animate: { x: 0 } },
    right: { initial: { x: '100%' }, animate: { x: 0 } },
    top: { initial: { y: '-100%' }, animate: { y: 0 } },
    bottom: { initial: { y: '100%' }, animate: { y: 0 } },
  };

  const isHorizontal = position === 'left' || position === 'right';

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            className={`
              fixed z-50 bg-gray-900/95 backdrop-blur-xl border-gray-700/50
              ${position === 'left' ? 'left-0 top-0 bottom-0 border-r' : ''}
              ${position === 'right' ? 'right-0 top-0 bottom-0 border-l' : ''}
              ${position === 'top' ? 'top-0 left-0 right-0 border-b' : ''}
              ${position === 'bottom' ? 'bottom-0 left-0 right-0 border-t' : ''}
            `}
            style={
              isHorizontal
                ? { width }
                : { height: width }
            }
            initial={positions[position].initial}
            animate={positions[position].animate}
            exit={positions[position].initial}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 30,
            }}
          >
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-700/50 flex items-center justify-between">
              <h3 className="text-xl font-semibold text-white">{title}</h3>
              <motion.button
                onClick={onClose}
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X className="w-5 h-5 text-gray-400" />
              </motion.button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto h-full">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

/**
 * 💬 TOOLTIP - Tooltip animado premium
 */
export const Tooltip = ({
  children,
  content,
  position = 'top',
  delay = 0,
}) => {
  const [isVisible, setIsVisible] = React.useState(false);

  const positions = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            className={`
              absolute ${positions[position]}
              px-3 py-2
              bg-gray-900/95 backdrop-blur-xl
              border border-gray-700/50
              rounded-lg
              text-sm text-white
              whitespace-nowrap
              pointer-events-none
              z-50
            `}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ delay }}
          >
            {content}

            {/* Arrow */}
            <div
              className={`
                absolute w-2 h-2 bg-gray-900/95 border-gray-700/50
                transform rotate-45
                ${position === 'top' ? 'bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 border-r border-b' : ''}
                ${position === 'bottom' ? 'top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 border-l border-t' : ''}
                ${position === 'left' ? 'right-0 top-1/2 -translate-y-1/2 translate-x-1/2 border-t border-r' : ''}
                ${position === 'right' ? 'left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 border-b border-l' : ''}
              `}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/**
 * 🎪 POPOVER - Ventana emergente contextual
 */
export const Popover = ({
  trigger,
  content,
  position = 'bottom',
  closeOnClick = true,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const positions = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  return (
    <div className="relative inline-block">
      <div onClick={() => setIsOpen(!isOpen)}>
        {trigger}
      </div>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop invisible para cerrar */}
            {closeOnClick && (
              <div
                className="fixed inset-0 z-40"
                onClick={() => setIsOpen(false)}
              />
            )}

            <motion.div
              className={`
                absolute ${positions[position]}
                min-w-[200px]
                bg-gray-800/95 backdrop-blur-xl
                border border-gray-700/50
                rounded-xl
                shadow-2xl
                z-50
                overflow-hidden
              `}
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 10 }}
              transition={{
                type: 'spring',
                stiffness: 300,
                damping: 25,
              }}
            >
              {content}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default {
  PremiumModal,
  Drawer,
  Tooltip,
  Popover,
};
