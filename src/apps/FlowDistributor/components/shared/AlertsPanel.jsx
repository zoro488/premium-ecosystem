/**
 * 🚨 ALERTS PANEL
 * Panel de alertas inteligentes con animaciones
 */
import { memo, useState } from 'react';

import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, AlertTriangle, CheckCircle, Clock, Eye, Info, X, Zap } from 'lucide-react';

/**
 * 🎯 Componente de panel de alertas
 */
export const AlertsPanel = memo(({ alertas = [] }) => {
  const [dismissedAlerts, setDismissedAlerts] = useState(new Set());
  const [expandedAlert, setExpandedAlert] = useState(null);

  const alertIcons = {
    error: AlertTriangle,
    warning: AlertCircle,
    success: CheckCircle,
    info: Info,
  };

  const alertColors = {
    error: {
      bg: 'from-zinc-700/20 to-zinc-800/20',
      border: 'border-zinc-500/30',
      icon: 'text-zinc-200',
      glow: 'shadow-[0_0_20px_rgba(239,68,68,0.3)]',
    },
    warning: {
      bg: 'from-amber-500/20 to-orange-600/20',
      border: 'border-zinc-500/30',
      icon: 'text-zinc-200',
      glow: 'shadow-[0_0_20px_rgba(245,158,11,0.3)]',
    },
    success: {
      bg: 'from-emerald-500/20 to-green-600/20',
      border: 'border-zinc-500/30',
      icon: 'text-zinc-200',
      glow: 'shadow-[0_0_20px_rgba(16,185,129,0.3)]',
    },
    info: {
      bg: 'from-zinc-800/20 to-zinc-900/20',
      border: 'border-zinc-700/30',
      icon: 'text-zinc-300',
      glow: 'shadow-[0_0_20px_rgba(59,130,246,0.3)]',
    },
  };

  const priorityLabels = {
    crítica: { label: 'CRÍTICA', color: 'text-zinc-200 bg-zinc-9000/20' },
    alta: { label: 'ALTA', color: 'text-zinc-200 bg-zinc-9000/20' },
    media: { label: 'MEDIA', color: 'text-zinc-200 bg-zinc-9000/20' },
    info: { label: 'INFO', color: 'text-zinc-300 bg-zinc-800/20' },
  };

  const filteredAlerts = alertas.filter((alert) => !dismissedAlerts.has(alert.id));

  const dismissAlert = (alertId) => {
    setDismissedAlerts((prev) => new Set([...prev, alertId]));
  };

  const toggleExpanded = (alertId) => {
    setExpandedAlert(expandedAlert === alertId ? null : alertId);
  };

  if (filteredAlerts.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10"
      >
        <div className="text-center">
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-emerald-500/20 to-green-600/20 border border-zinc-500/30 flex items-center justify-center"
          >
            <CheckCircle className="w-8 h-8 text-zinc-200" />
          </motion.div>
          <h3 className="text-lg font-semibold text-white mb-2">Todo en Orden</h3>
          <p className="text-white/60 text-sm">No hay alertas activas en el sistema</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <motion.div
            animate={{
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="p-2 rounded-lg bg-gradient-to-br from-zinc-700/20 to-orange-600/20 border border-zinc-500/30"
          >
            <AlertTriangle className="w-5 h-5 text-zinc-200" />
          </motion.div>
          <div>
            <h3 className="text-lg font-semibold text-white">Alertas Activas</h3>
            <p className="text-white/60 text-sm">
              {filteredAlerts.length} alertas requerieren atención
            </p>
          </div>
        </div>

        {/* Contador animado */}
        <motion.div
          key={filteredAlerts.length}
          initial={{ scale: 1.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="px-3 py-1 rounded-full bg-zinc-9000/20 border border-zinc-500/30"
        >
          <span className="text-zinc-200 font-bold text-sm">{filteredAlerts.length}</span>
        </motion.div>
      </div>

      {/* Lista de alertas */}
      <div className="space-y-3 max-h-80 overflow-y-auto scrollbar-hide">
        <AnimatePresence>
          {filteredAlerts.map((alert, index) => {
            const Icon = alertIcons[alert.tipo] || AlertCircle;
            const colors = alertColors[alert.tipo] || alertColors.info;
            const priority = priorityLabels[alert.prioridad] || priorityLabels.info;
            const isExpanded = expandedAlert === alert.id;

            return (
              <motion.div
                key={alert.id}
                layout
                initial={{ opacity: 0, x: -20, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 20, scale: 0.9, height: 0 }}
                transition={{
                  delay: index * 0.1,
                  type: 'spring',
                  stiffness: 300,
                  damping: 30,
                }}
                className={`group relative p-4 rounded-xl bg-gradient-to-r ${colors.bg} border ${colors.border} hover:${colors.glow} transition-all duration-300 cursor-pointer`}
                onClick={() => toggleExpanded(alert.id)}
                whileHover={{ scale: 1.02 }}
              >
                {/* Pulse effect for critical alerts */}
                {alert.prioridad === 'crítica' && (
                  <motion.div
                    className="absolute inset-0 rounded-xl bg-zinc-9000/10"
                    animate={{
                      opacity: [0, 0.3, 0],
                      scale: [1, 1.02, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  />
                )}

                <div className="relative z-10 flex items-start gap-3">
                  {/* Icono animado */}
                  <motion.div
                    animate={
                      alert.prioridad === 'crítica'
                        ? {
                            rotate: [0, 5, -5, 0],
                            scale: [1, 1.1, 1],
                          }
                        : {}
                    }
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                    className={`p-2 rounded-lg ${colors.icon} bg-white/10`}
                  >
                    <Icon className="w-5 h-5" />
                  </motion.div>

                  {/* Contenido */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-white font-medium text-sm truncate">
                            {alert.titulo}
                          </h4>
                          <span
                            className={`px-2 py-0.5 rounded-full text-xs font-medium ${priority.color}`}
                          >
                            {priority.label}
                          </span>
                        </div>

                        <p className="text-white/70 text-sm leading-relaxed">
                          {isExpanded
                            ? alert.mensaje
                            : alert.mensaje.slice(0, 60) + (alert.mensaje.length > 60 ? '...' : '')}
                        </p>

                        {/* Información adicional expandida */}
                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="mt-3 pt-3 border-t border-white/10"
                            >
                              <div className="flex items-center gap-4 text-xs text-white/50">
                                <div className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  <span>Hace 5 min</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Eye className="w-3 h-3" />
                                  <span>Sin revisar</span>
                                </div>
                              </div>

                              {/* Acciones */}
                              <div className="flex gap-2 mt-3">
                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  className="px-3 py-1 rounded-lg bg-zinc-800/20 text-zinc-300 text-xs font-medium hover:bg-zinc-800/30 transition-colors"
                                >
                                  Ver Detalles
                                </motion.button>
                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    dismissAlert(alert.id);
                                  }}
                                  className="px-3 py-1 rounded-lg bg-zinc-9000/20 text-zinc-200 text-xs font-medium hover:bg-zinc-9000/30 transition-colors"
                                >
                                  Descartar
                                </motion.button>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* Botón cerrar */}
                      <motion.button
                        onClick={(e) => {
                          e.stopPropagation();
                          dismissAlert(alert.id);
                        }}
                        className="p-1 rounded-lg hover:bg-white/10 text-white/40 hover:text-white/80 transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <X className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </div>
                </div>

                {/* Indicador de prioridad en el borde */}
                {alert.prioridad === 'crítica' && (
                  <motion.div
                    className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-zinc-700 to-zinc-800 rounded-l-xl"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Footer con estadísticas */}
      {filteredAlerts.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-4 pt-4 border-t border-white/10"
        >
          <div className="flex items-center justify-between text-xs text-white/50">
            <span>Última actualización: hace 2 min</span>
            <div className="flex items-center gap-2">
              <Zap className="w-3 h-3" />
              <span>Tiempo real</span>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
});

AlertsPanel.displayName = 'AlertsPanel';

export default AlertsPanel;
