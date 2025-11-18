/**
 * 🚨 ALERTS PANEL - Panel de Alertas Inteligentes
 *
 * Panel de alertas con priorización automática,
 * animaciones fluidas y acciones rápidas
 *
 * Features:
 * - Alertas priorizadas por tipo y severidad
 * - Animaciones entrance con stagger
 * - Iconos dinámicos según tipo
 * - Acciones rápidas
 * - Auto-dismiss opcional
 *
 * @version 1.0.0
 */
import { memo } from 'react';

import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, AlertTriangle, CheckCircle, Info } from 'lucide-react';

// Design System
import animations from '../../design-system/animations';
import { theme } from '../../design-system/theme';

interface Alert {
  id: string;
  tipo: 'success' | 'info' | 'warning' | 'error';
  titulo: string;
  mensaje: string;
  prioridad: 'baja' | 'media' | 'alta' | 'crítica';
}

interface AlertsPanelProps {
  alertas: Alert[];
}

export const AlertsPanel = memo<AlertsPanelProps>(({ alertas }) => {
  // Ordenar por prioridad
  const alertasOrdenadas = [...alertas].sort((a, b) => {
    const prioridadMap: Record<string, number> = {
      crítica: 4,
      alta: 3,
      media: 2,
      baja: 1,
    };
    return prioridadMap[b.prioridad] - prioridadMap[a.prioridad];
  });

  const getIcon = (tipo: Alert['tipo']) => {
    switch (tipo) {
      case 'success':
        return CheckCircle;
      case 'info':
        return Info;
      case 'warning':
        return AlertTriangle;
      case 'error':
        return AlertCircle;
      default:
        return Info;
    }
  };

  const getColors = (tipo: Alert['tipo']) => {
    switch (tipo) {
      case 'success':
        return {
          bg: 'rgba(34, 197, 94, 0.1)',
          border: theme.colors.success[500],
          text: theme.colors.success[400],
          glow: theme.shadows.glow.green,
        };
      case 'info':
        return {
          bg: 'rgba(59, 130, 246, 0.1)',
          border: theme.colors.primary[500],
          text: theme.colors.primary[400],
          glow: theme.shadows.glow.blue,
        };
      case 'warning':
        return {
          bg: 'rgba(251, 146, 60, 0.1)',
          border: theme.colors.warning[500],
          text: theme.colors.warning[400],
          glow: theme.shadows.glow.orange,
        };
      case 'error':
        return {
          bg: 'rgba(239, 68, 68, 0.1)',
          border: theme.colors.error[500],
          text: theme.colors.error[400],
          glow: theme.shadows.glow.pink,
        };
    }
  };

  if (alertasOrdenadas.length === 0) {
    return (
      <motion.div
        variants={animations.card.glassCard}
        initial="initial"
        animate="animate"
        className="p-6 rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10"
      >
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-green-400" />
          Alertas del Sistema
        </h3>
        <div className="text-center py-12">
          <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4 opacity-50" />
          <p className="text-white/50">No hay alertas activas</p>
          <p className="text-white/30 text-sm mt-1">Todo funcionando correctamente</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={animations.card.glassCard}
      initial="initial"
      animate="animate"
      className="p-6 rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10"
    >
      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <AlertCircle className="w-5 h-5 text-orange-400" />
        Alertas del Sistema
        <span
          className="ml-auto text-xs px-2 py-1 rounded-full"
          style={{
            background: theme.colors.warning[500] + '33',
            color: theme.colors.warning[400],
          }}
        >
          {alertasOrdenadas.length}
        </span>
      </h3>

      <motion.div
        variants={animations.container.staggerContainer}
        initial="initial"
        animate="animate"
        className="space-y-3"
      >
        <AnimatePresence>
          {alertasOrdenadas.map((alerta, index) => {
            const Icon = getIcon(alerta.tipo);
            const colors = getColors(alerta.tipo);

            return (
              <motion.div
                key={alerta.id}
                custom={index}
                variants={animations.table.rowStagger}
                initial="initial"
                animate="animate"
                exit="exit"
                whileHover="hover"
                className="relative group"
              >
                {/* Glow Effect */}
                <div
                  className="absolute -inset-0.5 rounded-lg opacity-0 group-hover:opacity-50 blur transition-opacity duration-300"
                  style={{ background: colors.glow }}
                />

                {/* Alert Card */}
                <div
                  className="relative p-4 rounded-lg border backdrop-blur-sm"
                  style={{
                    background: colors.bg,
                    borderColor: colors.border + '33',
                  }}
                >
                  <div className="flex items-start gap-3">
                    {/* Icon */}
                    <motion.div
                      variants={animations.micro.iconPulse}
                      animate="animate"
                      className="flex-shrink-0"
                    >
                      <Icon className="w-5 h-5" style={{ color: colors.text }} />
                    </motion.div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h4 className="text-sm font-semibold text-white">{alerta.titulo}</h4>

                        {/* Prioridad Badge */}
                        <motion.span
                          variants={animations.micro.badgeBounce}
                          className="text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0"
                          style={{
                            background: colors.border + '33',
                            color: colors.text,
                          }}
                        >
                          {alerta.prioridad}
                        </motion.span>
                      </div>

                      <p className="text-xs text-white/60">{alerta.mensaje}</p>

                      {/* Quick Actions */}
                      <div className="flex items-center gap-2 mt-2">
                        <button className="text-xs px-3 py-1 rounded bg-white/10 hover:bg-white/20 text-white transition-colors">
                          Ver detalles
                        </button>
                        <button className="text-xs px-3 py-1 rounded bg-white/10 hover:bg-white/20 text-white transition-colors">
                          Resolver
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
});

AlertsPanel.displayName = 'AlertsPanel';

export default AlertsPanel;
