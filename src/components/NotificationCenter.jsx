/**
 * 🔔 CENTRO DE NOTIFICACIONES COMPLETO
 * Sistema avanzado con prioridades, categorías, historial y acciones
 */
import { useEffect, useState } from 'react';

import { AnimatePresence, motion } from 'framer-motion';
import {
  AlertCircle,
  AlertTriangle,
  Archive,
  Bell,
  Check,
  CheckCircle2,
  Info,
  Settings,
  Trash2,
  X,
} from 'lucide-react';

/**
 * Prioridades de notificaciones
 */
export const NOTIFICATION_PRIORITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical',
};

/**
 * Categorías de notificaciones
 */
export const NOTIFICATION_CATEGORY = {
  SYSTEM: 'system',
  SALES: 'sales',
  INVENTORY: 'inventory',
  FINANCE: 'finance',
  ALERT: 'alert',
  INFO: 'info',
};

/**
 * Hook para gestionar notificaciones
 */
export const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Cargar notificaciones del localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('flowdistributor_notifications');
      if (stored) {
        const parsed = JSON.parse(stored);
        setNotifications(parsed);
        setUnreadCount(parsed.filter((n) => !n.read).length);
      }
    } catch (error) {
      // console.error('Error loading notifications:', error);
    }
  }, []);

  // Guardar notificaciones en localStorage
  useEffect(() => {
    try {
      localStorage.setItem('flowdistributor_notifications', JSON.stringify(notifications));
      setUnreadCount(notifications.filter((n) => !n.read).length);
    } catch (error) {
      // console.error('Error saving notifications:', error);
    }
  }, [notifications]);

  const addNotification = (notification) => {
    const newNotification = {
      id: Date.now() + Math.random(),
      timestamp: new Date().toISOString(),
      read: false,
      ...notification,
    };

    setNotifications((prev) => [newNotification, ...prev]);

    // Reproducir sonido si está habilitado
    if (soundEnabled && notification.priority !== NOTIFICATION_PRIORITY.LOW) {
      playNotificationSound(notification.priority);
    }

    // Notificación del navegador si es crítica
    if (notification.priority === NOTIFICATION_PRIORITY.CRITICAL) {
      sendBrowserNotification(notification);
    }

    return newNotification.id;
  };

  const markAsRead = (id) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const deleteNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const clearRead = () => {
    setNotifications((prev) => prev.filter((n) => !n.read));
  };

  return {
    notifications,
    unreadCount,
    soundEnabled,
    setSoundEnabled,
    addNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAll,
    clearRead,
  };
};

/**
 * Reproducir sonido de notificación
 */
const playNotificationSound = (priority) => {
  try {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    // Frecuencias según prioridad
    const frequencies = {
      [NOTIFICATION_PRIORITY.LOW]: 400,
      [NOTIFICATION_PRIORITY.MEDIUM]: 600,
      [NOTIFICATION_PRIORITY.HIGH]: 800,
      [NOTIFICATION_PRIORITY.CRITICAL]: 1000,
    };

    oscillator.frequency.value = frequencies[priority] || 600;
    gainNode.gain.value = 0.1;

    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.1);
  } catch (error) {
    // console.error('Error playing sound:', error);
  }
};

/**
 * Enviar notificación del navegador
 */
const sendBrowserNotification = (notification) => {
  if (!('Notification' in window)) return;

  if (Notification.permission === 'granted') {
    new Notification('FlowDistributor', {
      body: notification.message,
      icon: '/favicon.ico',
      tag: notification.id,
      requireInteraction: true,
    });
  } else if (Notification.permission !== 'denied') {
    Notification.requestPermission().then((permission) => {
      if (permission === 'granted') {
        sendBrowserNotification(notification);
      }
    });
  }
};

/**
 * Componente principal del Centro de Notificaciones
 */
const NotificationCenter = ({ isOpen, onClose, notifications, onAction }) => {
  const [filter, setFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const filteredNotifications = notifications.filter((n) => {
    if (filter === 'unread' && n.read) return false;
    if (filter === 'read' && !n.read) return false;
    if (categoryFilter !== 'all' && n.category !== categoryFilter) return false;
    return true;
  });

  const getPriorityColor = (priority) => {
    const colors = {
      [NOTIFICATION_PRIORITY.LOW]: 'text-blue-400 bg-blue-500/20',
      [NOTIFICATION_PRIORITY.MEDIUM]: 'text-yellow-400 bg-yellow-500/20',
      [NOTIFICATION_PRIORITY.HIGH]: 'text-orange-400 bg-orange-500/20',
      [NOTIFICATION_PRIORITY.CRITICAL]: 'text-red-400 bg-red-500/20',
    };
    return colors[priority] || colors[NOTIFICATION_PRIORITY.MEDIUM];
  };

  const getPriorityIcon = (priority) => {
    const icons = {
      [NOTIFICATION_PRIORITY.LOW]: Info,
      [NOTIFICATION_PRIORITY.MEDIUM]: Bell,
      [NOTIFICATION_PRIORITY.HIGH]: AlertTriangle,
      [NOTIFICATION_PRIORITY.CRITICAL]: AlertCircle,
    };
    const Icon = icons[priority] || Bell;
    return <Icon className="w-5 h-5" />;
  };

  const getCategoryIcon = (category) => {
    const icons = {
      [NOTIFICATION_CATEGORY.SYSTEM]: Settings,
      [NOTIFICATION_CATEGORY.SALES]: CheckCircle2,
      [NOTIFICATION_CATEGORY.INVENTORY]: Archive,
      [NOTIFICATION_CATEGORY.FINANCE]: Bell,
      [NOTIFICATION_CATEGORY.ALERT]: AlertTriangle,
      [NOTIFICATION_CATEGORY.INFO]: Info,
    };
    const Icon = icons[category] || Bell;
    return <Icon className="w-4 h-4" />;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Panel */}
          <motion.div
            initial={{ x: 400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 400, opacity: 0 }}
            transition={{ type: 'spring', damping: 25 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-slate-900 shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-white/10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-black/80 to-black/90 border border-blue-500/30 flex items-center justify-center">
                    <Bell className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Notificaciones</h2>
                    <p className="text-sm text-slate-400">
                      {notifications.filter((n) => !n.read).length} sin leer
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Filtros */}
              <div className="flex gap-2">
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                >
                  <option value="all">Todas</option>
                  <option value="unread">Sin leer</option>
                  <option value="read">Leídas</option>
                </select>

                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                >
                  <option value="all">Categorías</option>
                  <option value={NOTIFICATION_CATEGORY.SALES}>Ventas</option>
                  <option value={NOTIFICATION_CATEGORY.INVENTORY}>Inventario</option>
                  <option value={NOTIFICATION_CATEGORY.FINANCE}>Finanzas</option>
                  <option value={NOTIFICATION_CATEGORY.ALERT}>Alertas</option>
                  <option value={NOTIFICATION_CATEGORY.SYSTEM}>Sistema</option>
                </select>
              </div>

              {/* Acciones rápidas */}
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => onAction('markAllRead')}
                  className="flex-1 px-3 py-2 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <Check className="w-3 h-3" />
                  Marcar todas
                </button>
                <button
                  onClick={() => onAction('clearRead')}
                  className="flex-1 px-3 py-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <Trash2 className="w-3 h-3" />
                  Limpiar leídas
                </button>
              </div>
            </div>

            {/* Lista de notificaciones */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              <AnimatePresence mode="popLayout">
                {filteredNotifications.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center h-full text-center text-slate-400"
                  >
                    <Bell className="w-16 h-16 mb-4 opacity-20" />
                    <p className="text-lg font-medium">No hay notificaciones</p>
                    <p className="text-sm">Estás al día con todo</p>
                  </motion.div>
                ) : (
                  filteredNotifications.map((notification) => (
                    <motion.div
                      key={notification.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      className={`p-4 rounded-xl border transition-all ${
                        notification.read
                          ? 'bg-white/5 border-white/10'
                          : 'bg-blue-500/10 border-blue-500/30'
                      } hover:bg-white/10`}
                    >
                      <div className="flex gap-3">
                        <div
                          className={`w-10 h-10 rounded-lg ${getPriorityColor(notification.priority)} flex items-center justify-center flex-shrink-0`}
                        >
                          {getPriorityIcon(notification.priority)}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <h4
                              className={`font-medium ${notification.read ? 'text-slate-300' : 'text-white'}`}
                            >
                              {notification.title || 'Notificación'}
                            </h4>
                            <button
                              onClick={() => onAction('delete', notification.id)}
                              className="p-1 hover:bg-white/10 rounded transition-colors flex-shrink-0"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>

                          <p className="text-sm text-slate-400 mb-2">{notification.message}</p>

                          <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2 text-slate-500">
                              {getCategoryIcon(notification.category)}
                              <span>
                                {new Date(notification.timestamp).toLocaleString('es-MX', {
                                  day: '2-digit',
                                  month: 'short',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </span>
                            </div>

                            {!notification.read && (
                              <button
                                onClick={() => onAction('markRead', notification.id)}
                                className="text-blue-400 hover:text-blue-300 font-medium"
                              >
                                Marcar leída
                              </button>
                            )}
                          </div>

                          {notification.action && (
                            <button
                              onClick={() => notification.action.callback()}
                              className="mt-2 w-full px-3 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg text-sm font-medium hover:shadow-lg hover:shadow-blue-500/25 transition-all"
                            >
                              {notification.action.label}
                            </button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default NotificationCenter;
