import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, AlertTriangle, CheckCircle, Info, X } from 'lucide-react';
import PropTypes from 'prop-types';

/**
 * ToastContainer - Sistema de notificaciones tipo toast
 * Muestra mensajes temporales con animaciones suaves
 */
export const ToastContainer = ({ toasts, onRemove }) => {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      <AnimatePresence>
        {toasts.map((toast) => {
          const icons = {
            success: <CheckCircle className="w-5 h-5" />,
            error: <AlertCircle className="w-5 h-5" />,
            warning: <AlertTriangle className="w-5 h-5" />,
            info: <Info className="w-5 h-5" />,
          };

          const colors = {
            success: 'from-green-500 to-emerald-500 border-zinc-500/50',
            error: 'from-zinc-700 to-zinc-700 border-zinc-500/50',
            warning: 'from-yellow-500 to-orange-500 border-zinc-500/50',
            info: 'from-zinc-800 to-zinc-800 border-zinc-700/50',
          };

          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 300, scale: 0.3 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 300, scale: 0.5, transition: { duration: 0.2 } }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              className={`glass rounded-xl p-4 border-2 shadow-2xl backdrop-blur-xl min-w-[300px] max-w-md bg-gradient-to-r ${
                colors[toast.type]
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="text-white mt-0.5">{icons[toast.type]}</div>
                <div className="flex-1">
                  <p className="text-white font-semibold">{toast.message}</p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => onRemove(toast.id)}
                  className="text-white/80 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-lg"
                >
                  <X className="w-4 h-4" />
                </motion.button>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

ToastContainer.propTypes = {
  toasts: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      message: PropTypes.string.isRequired,
      type: PropTypes.oneOf(['success', 'error', 'warning', 'info']).isRequired,
    })
  ).isRequired,
  onRemove: PropTypes.func.isRequired,
};

export default ToastContainer;
