/**
 * 🔔 ULTRA PREMIUM NOTIFICATIONS - Sistema de notificaciones con efectos 3D
 * Toasts animados con glassmorphism, particles y efectos holográficos
 */
import { useEffect, useState } from 'react';

import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, CheckCircle, Info, X, XCircle, Zap } from 'lucide-react';

const iconMap = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertCircle,
  info: Info,
};

const colorMap = {
  success: {
    bg: 'from-emerald-500/20 to-green-500/10',
    border: 'border-emerald-500/30',
    icon: 'text-emerald-400',
    glow: 'shadow-emerald-500/50',
  },
  error: {
    bg: 'from-red-500/20 to-rose-500/10',
    border: 'border-red-500/30',
    icon: 'text-red-400',
    glow: 'shadow-red-500/50',
  },
  warning: {
    bg: 'from-yellow-500/20 to-orange-500/10',
    border: 'border-yellow-500/30',
    icon: 'text-yellow-400',
    glow: 'shadow-yellow-500/50',
  },
  info: {
    bg: 'from-blue-500/20 to-cyan-500/10',
    border: 'border-blue-500/30',
    icon: 'text-blue-400',
    glow: 'shadow-blue-500/50',
  },
};

export const UltraPremiumToast = ({ type = 'info', title, message, onClose, duration = 5000 }) => {
  const [particles, setParticles] = useState([]);
  const [progress, setProgress] = useState(100);
  const Icon = iconMap[type];
  const colors = colorMap[type];

  useEffect(() => {
    // Generar partículas
    const newParticles = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      duration: Math.random() * 2 + 1,
    }));
    setParticles(newParticles);

    // Progress bar animation
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev <= 0) {
          clearInterval(interval);
          onClose?.();
          return 0;
        }
        return prev - 100 / (duration / 100);
      });
    }, 100);

    return () => clearInterval(interval);
  }, [duration, onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 300, scale: 0.8, rotateY: -90 }}
      animate={{ opacity: 1, x: 0, scale: 1, rotateY: 0 }}
      exit={{ opacity: 0, x: 300, scale: 0.8, rotateY: 90 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      className={`relative overflow-hidden w-96 bg-gradient-to-br ${colors.bg} backdrop-blur-2xl border ${colors.border} rounded-2xl shadow-2xl ${colors.glow} group`}
      style={{ transformStyle: 'preserve-3d' }}
    >
      {/* Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className={`absolute w-1 h-1 rounded-full ${colors.icon.replace('text', 'bg')}`}
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: particle.size,
              height: particle.size,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 0.8, 0.3],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      {/* Holographic shine */}
      <motion.div
        className="absolute inset-0 opacity-0 group-hover:opacity-100"
        animate={{
          background: [
            'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%)',
            'linear-gradient(225deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%)',
          ],
        }}
        transition={{ duration: 2, repeat: Infinity }}
      />

      {/* Content */}
      <div className="relative z-10 p-6">
        <div className="flex items-start gap-4">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 15, delay: 0.1 }}
            className={`p-3 bg-black/30 rounded-xl ${colors.icon}`}
          >
            <Icon className="w-6 h-6" />
          </motion.div>

          <div className="flex-1">
            <motion.h4
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-white font-bold text-lg mb-1"
            >
              {title}
            </motion.h4>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-zinc-300 text-sm"
            >
              {message}
            </motion.p>
          </div>

          <motion.button
            onClick={onClose}
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            className="text-zinc-400 hover:text-white transition-colors p-1"
          >
            <X className="w-5 h-5" />
          </motion.button>
        </div>

        {/* Progress bar */}
        <motion.div
          className="mt-4 h-1 bg-white/10 rounded-full overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <motion.div
            className={`h-full ${colors.icon.replace('text', 'bg')}`}
            style={{ width: `${progress}%` }}
            animate={{
              boxShadow: [
                `0 0 10px ${colors.icon.replace('text-', '')}`,
                `0 0 20px ${colors.icon.replace('text-', '')}`,
                `0 0 10px ${colors.icon.replace('text-', '')}`,
              ],
            }}
            transition={{ duration: 1, repeat: Infinity }}
          />
        </motion.div>

        {/* Energy pulse */}
        <motion.div
          className="absolute top-2 right-2"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Zap className={`w-4 h-4 ${colors.icon}`} />
        </motion.div>
      </div>
    </motion.div>
  );
};

/**
 * Notification Container
 */
export const NotificationContainer = ({ notifications, onClose }) => {
  return (
    <div className="fixed top-6 right-6 z-[9999] flex flex-col gap-4 pointer-events-none">
      <AnimatePresence mode="popLayout">
        {notifications.map((notification) => (
          <div key={notification.id} className="pointer-events-auto">
            <UltraPremiumToast
              type={notification.type}
              title={notification.title}
              message={notification.message}
              onClose={() => onClose(notification.id)}
              duration={notification.duration}
            />
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
};

/**
 * Hook para usar notificaciones
 */
export const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = ({ type = 'info', title, message, duration = 5000 }) => {
    const id = Math.random().toString(36).substr(2, 9);
    setNotifications((prev) => [...prev, { id, type, title, message, duration }]);
  };

  const removeNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return {
    notifications,
    addNotification,
    removeNotification,
    success: (title, message) => addNotification({ type: 'success', title, message }),
    error: (title, message) => addNotification({ type: 'error', title, message }),
    warning: (title, message) => addNotification({ type: 'warning', title, message }),
    info: (title, message) => addNotification({ type: 'info', title, message }),
  };
};

export default {
  UltraPremiumToast,
  NotificationContainer,
  useNotifications,
};
