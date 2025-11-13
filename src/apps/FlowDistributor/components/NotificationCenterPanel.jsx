/**
 * 🔔 NOTIFICATION CENTER PANEL - Sistema de notificaciones premium
 * Panel lateral con notificaciones en tiempo real, filtros y acciones
 *
 * CARACTERÍSTICAS:
 * - Notificaciones categorizadas (info, warning, error, success)
 * - Prioridades (baja, media, alta, crítica)
 * - Filtros por categoría y prioridad
 * - Acciones rápidas desde notificaciones
 * - Animaciones fluidas con Framer Motion
 * - Mark as read/unread
 * - Batch operations
 *
 * @version 1.0.0
 */
import { useState } from 'react';

import { AnimatePresence, motion } from 'framer-motion';
import {
  AlertTriangle,
  Bell,
  CheckCircle,
  Filter,
  Info,
  Package,
  ShoppingCart,
  Trash2,
  TrendingUp,
  X,
  XCircle,
} from 'lucide-react';

import { MagneticButton, StaggerContainer, StaggerItem } from './AdvancedAnimations';

const CATEGORY_CONFIG = {
  SALES: { icon: ShoppingCart, color: 'purple', label: 'Ventas' },
  INVENTORY: { icon: Package, color: 'green', label: 'Inventario' },
  FINANCE: { icon: TrendingUp, color: 'blue', label: 'Finanzas' },
  SYSTEM: { icon: Info, color: 'gray', label: 'Sistema' },
};

const PRIORITY_CONFIG = {
  LOW: { color: 'gray', label: 'Baja' },
  MEDIUM: { color: 'yellow', label: 'Media' },
  HIGH: { color: 'orange', label: 'Alta' },
  CRITICAL: { color: 'red', label: 'Crítica' },
};

const TYPE_ICONS = {
  info: Info,
  warning: AlertTriangle,
  error: XCircle,
  success: CheckCircle,
};

/**
 * Componente principal NotificationCenterPanel
 */
export const NotificationCenterPanel = ({ isOpen, onClose, notifications = [], onAction }) => {
  const [filter, setFilter] = useState('all');
  const [selectedIds, setSelectedIds] = useState(new Set());

  const filteredNotifications = notifications.filter((notif) => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !notif.read;
    return notif.category === filter;
  });

  const handleSelectAll = () => {
    if (selectedIds.size === filteredNotifications.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredNotifications.map((n) => n.id)));
    }
  };

  const handleBulkDelete = () => {
    selectedIds.forEach((id) => onAction?.('delete', id));
    setSelectedIds(new Set());
  };

  const handleBulkMarkRead = () => {
    selectedIds.forEach((id) => onAction?.('markRead', id));
    setSelectedIds(new Set());
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
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md backdrop-blur-2xl bg-gradient-to-br from-gray-900/98 via-gray-800/98 to-gray-900/98 border-l border-white/10 shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-white/10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500">
                    <Bell className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Notificaciones</h2>
                    <p className="text-white/60 text-sm">
                      {notifications.length} total, {notifications.filter((n) => !n.read).length}{' '}
                      sin leer
                    </p>
                  </div>
                </div>
                <MagneticButton
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </MagneticButton>
              </div>

              {/* Filtros */}
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    filter === 'all'
                      ? 'bg-primary text-white'
                      : 'bg-white/5 text-white/60 hover:bg-white/10'
                  }`}
                >
                  Todas
                </button>
                <button
                  onClick={() => setFilter('unread')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    filter === 'unread'
                      ? 'bg-primary text-white'
                      : 'bg-white/5 text-white/60 hover:bg-white/10'
                  }`}
                >
                  Sin leer
                </button>
                {Object.entries(CATEGORY_CONFIG).map(([key, config]) => (
                  <button
                    key={key}
                    onClick={() => setFilter(key)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1 ${
                      filter === key
                        ? 'bg-primary text-white'
                        : 'bg-white/5 text-white/60 hover:bg-white/10'
                    }`}
                  >
                    <config.icon className="w-3 h-3" />
                    {config.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Bulk Actions Bar */}
            {selectedIds.size > 0 && (
              <motion.div
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="p-4 bg-primary/10 border-b border-primary/20 flex items-center justify-between"
              >
                <span className="text-white text-sm font-medium">
                  {selectedIds.size} seleccionadas
                </span>
                <div className="flex gap-2">
                  <MagneticButton
                    onClick={handleBulkMarkRead}
                    className="px-3 py-1.5 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 text-xs font-medium transition-all"
                  >
                    Marcar leídas
                  </MagneticButton>
                  <MagneticButton
                    onClick={handleBulkDelete}
                    className="px-3 py-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-300 text-xs font-medium transition-all"
                  >
                    Eliminar
                  </MagneticButton>
                  <MagneticButton
                    onClick={handleSelectAll}
                    className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 text-xs font-medium transition-all"
                  >
                    Deseleccionar
                  </MagneticButton>
                </div>
              </motion.div>
            )}

            {/* Lista de Notificaciones */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-4">
              {filteredNotifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <Filter className="w-16 h-16 text-white/20 mb-4" />
                  <p className="text-white/60">No hay notificaciones</p>
                  <p className="text-white/40 text-sm">Todo está al día 🎉</p>
                </div>
              ) : (
                <StaggerContainer className="space-y-3">
                  {filteredNotifications.map((notification) => {
                    const TypeIcon = TYPE_ICONS[notification.type] || Info;
                    const CategoryConfig = CATEGORY_CONFIG[notification.category] || {};
                    const PriorityConfig = PRIORITY_CONFIG[notification.priority] || {};
                    const isSelected = selectedIds.has(notification.id);

                    return (
                      <StaggerItem key={notification.id}>
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          className={`p-4 rounded-xl backdrop-blur-md border transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-primary/20 border-primary/40'
                              : notification.read
                                ? 'bg-white/5 border-white/10'
                                : 'bg-white/10 border-white/20'
                          }`}
                          onClick={() => {
                            const newSet = new Set(selectedIds);
                            if (isSelected) {
                              newSet.delete(notification.id);
                            } else {
                              newSet.add(notification.id);
                            }
                            setSelectedIds(newSet);
                          }}
                        >
                          <div className="flex items-start gap-3">
                            <div
                              className={`p-2 rounded-lg bg-${CategoryConfig.color || 'gray'}-500/20`}
                            >
                              <TypeIcon
                                className={`w-4 h-4 text-${CategoryConfig.color || 'gray'}-400`}
                              />
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2 mb-1">
                                <h3 className="text-white font-semibold text-sm">
                                  {notification.title}
                                </h3>
                                {!notification.read && (
                                  <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-1" />
                                )}
                              </div>
                              <p className="text-white/70 text-xs mb-2">{notification.message}</p>
                              <div className="flex items-center gap-2 text-xs text-white/50">
                                <span>{new Date(notification.timestamp).toLocaleTimeString()}</span>
                                <span>•</span>
                                <span
                                  className={`px-2 py-0.5 rounded-full bg-${PriorityConfig.color}-500/20 text-${PriorityConfig.color}-400`}
                                >
                                  {PriorityConfig.label}
                                </span>
                              </div>

                              {notification.action && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    notification.action.callback();
                                  }}
                                  className="mt-2 px-3 py-1 rounded-lg bg-primary/20 hover:bg-primary/30 text-primary text-xs font-medium transition-all"
                                >
                                  {notification.action.label}
                                </button>
                              )}
                            </div>

                            <MagneticButton
                              onClick={(e) => {
                                e.stopPropagation();
                                onAction?.('delete', notification.id);
                              }}
                              className="p-1.5 rounded-lg hover:bg-red-500/20 text-white/40 hover:text-red-400 transition-all"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </MagneticButton>
                          </div>
                        </motion.div>
                      </StaggerItem>
                    );
                  })}
                </StaggerContainer>
              )}
            </div>

            {/* Footer con acciones */}
            <div className="p-4 border-t border-white/10">
              <div className="flex gap-2">
                <MagneticButton
                  onClick={handleSelectAll}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white text-sm font-medium transition-all"
                >
                  {selectedIds.size === filteredNotifications.length
                    ? 'Deseleccionar todas'
                    : 'Seleccionar todas'}
                </MagneticButton>
                <MagneticButton
                  onClick={() => onAction?.('clearAll')}
                  className="px-4 py-2.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-300 text-sm font-medium transition-all"
                >
                  Limpiar todo
                </MagneticButton>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default NotificationCenterPanel;
