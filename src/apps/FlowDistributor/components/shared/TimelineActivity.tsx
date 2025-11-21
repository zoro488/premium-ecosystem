/**
 * ⏱️ TIMELINE ACTIVITY - Timeline de Actividad Reciente
 *
 * Timeline animado de las últimas actividades del sistema
 * con iconos dinámicos y detalles expandibles
 *
 * Features:
 * - Timeline visual con línea conectora
 * - Iconos según tipo de actividad
 * - Colores según estado
 * - Animaciones stagger entrance
 * - Detalles expandibles
 *
 * @version 1.0.0
 */
import { memo } from 'react';

import { motion } from 'framer-motion';
import { Clock, Package, ShoppingCart } from 'lucide-react';

// Design System
import animations from '../../design-system/animations';
import { theme } from '../../design-system/theme';
// Utils
import { formatCurrency } from '../../utils/formatters';

interface TimelineActivityProps {
  ventas: any[];
  ordenes: any[];
}

export const TimelineActivity = memo<TimelineActivityProps>(({ ventas, ordenes }) => {
  // Combinar y ordenar actividades por fecha
  const activities = [
    ...ventas.map((v) => ({
      id: `venta-${v.id}`,
      tipo: 'venta',
      fecha: new Date(v.fecha),
      titulo: `Venta a ${v.cliente}`,
      descripcion: formatCurrency(v.totalVenta),
      estatus: v.estatus,
      icon: ShoppingCart,
    })),
    ...ordenes.map((o) => ({
      id: `orden-${o.id}`,
      tipo: 'orden',
      fecha: new Date(o.fecha),
      titulo: `Orden de Compra #${o.id}`,
      descripcion: formatCurrency(o.total || 0),
      estatus: o.estatus,
      icon: Package,
    })),
  ]
    .sort((a, b) => b.fecha.getTime() - a.fecha.getTime())
    .slice(0, 10);

  const getColorsByStatus = (estatus: string) => {
    switch (estatus?.toLowerCase()) {
      case 'pagado':
      case 'completada':
        return {
          bg: theme.colors.success[500] + '22',
          border: theme.colors.success[500],
          text: theme.colors.success[400],
        };
      case 'pendiente':
      case 'en proceso':
        return {
          bg: theme.colors.warning[500] + '22',
          border: theme.colors.warning[500],
          text: theme.colors.warning[400],
        };
      case 'cancelado':
        return {
          bg: theme.colors.error[500] + '22',
          border: theme.colors.error[500],
          text: theme.colors.error[400],
        };
      default:
        return {
          bg: theme.colors.primary[500] + '22',
          border: theme.colors.primary[500],
          text: theme.colors.primary[400],
        };
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `Hace ${minutes} min`;
    if (hours < 24) return `Hace ${hours} hrs`;
    return `Hace ${days} días`;
  };

  return (
    <motion.div
      variants={animations.card.glassCard}
      initial="initial"
      animate="animate"
      className="p-6 rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 h-full overflow-hidden flex flex-col"
    >
      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <Clock className="w-5 h-5 text-zinc-300" />
        Actividad Reciente
      </h3>

      <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
        {activities.map((activity, index) => {
          const Icon = activity.icon;
          const colors = getColorsByStatus(activity.estatus);

          return (
            <motion.div
              key={activity.id}
              custom={index}
              variants={animations.table.rowStagger}
              initial="initial"
              animate="animate"
              className="relative flex gap-3"
            >
              {/* Timeline Line */}
              {index < activities.length - 1 && (
                <div
                  className="absolute left-5 top-12 w-0.5 h-full -z-10"
                  style={{
                    background: `linear-gradient(to bottom, ${colors.border}66, transparent)`,
                  }}
                />
              )}

              {/* Icon Circle */}
              <motion.div
                className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center border-2 backdrop-blur-sm"
                style={{
                  background: colors.bg,
                  borderColor: colors.border,
                }}
                variants={animations.micro.iconPulse}
                animate="animate"
              >
                <Icon className="w-5 h-5" style={{ color: colors.text }} />
              </motion.div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-white truncate">{activity.titulo}</h4>
                    <p className="text-xs text-white/60 mt-0.5">{activity.descripcion}</p>
                  </div>

                  {/* Status Badge */}
                  <motion.span
                    variants={animations.micro.badgeBounce}
                    className="text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0"
                    style={{
                      background: colors.bg,
                      color: colors.text,
                      borderWidth: '1px',
                      borderStyle: 'solid',
                      borderColor: colors.border + '66',
                    }}
                  >
                    {activity.estatus}
                  </motion.span>
                </div>

                {/* Time */}
                <div className="flex items-center gap-1 mt-2 text-xs text-white/40">
                  <Clock className="w-3 h-3" />
                  <span>{formatTimeAgo(activity.fecha)}</span>
                </div>
              </div>
            </motion.div>
          );
        })}

        {activities.length === 0 && (
          <div className="text-center py-12">
            <Clock className="w-12 h-12 text-white/20 mx-auto mb-3" />
            <p className="text-white/40 text-sm">No hay actividad reciente</p>
          </div>
        )}
      </div>

      {/* View All Button */}
      {activities.length > 0 && (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="mt-4 w-full py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white text-sm font-medium transition-colors"
        >
          Ver toda la actividad
        </motion.button>
      )}
    </motion.div>
  );
});

TimelineActivity.displayName = 'TimelineActivity';

export default TimelineActivity;
