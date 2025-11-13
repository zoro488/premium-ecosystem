/**
 * ⚡ QUICK ACTIONS - Acciones Rápidas
 *
 * Panel flotante con acciones rápidas del sistema
 *
 * Features:
 * - Botones con iconos animados
 * - Hover effects premium
 * - Tooltips descriptivos
 * - Atajos de teclado
 *
 * @version 1.0.0
 */
import { memo } from 'react';

import { motion } from 'framer-motion';
import { BarChart3, Download, FileText, Plus, Settings } from 'lucide-react';

// Design System
import animations from '../../design-system/animations';
import { theme } from '../../design-system/theme';

export const QuickActions = memo(() => {
  const actions = [
    {
      id: 'nueva-venta',
      label: 'Nueva Venta',
      icon: Plus,
      color: theme.colors.success[500],
      gradient: `linear-gradient(135deg, ${theme.colors.success[500]}, ${theme.colors.success[600]})`,
      shortcut: 'Ctrl+N',
    },
    {
      id: 'nuevo-reporte',
      label: 'Nuevo Reporte',
      icon: FileText,
      color: theme.colors.primary[500],
      gradient: `linear-gradient(135deg, ${theme.colors.primary[500]}, ${theme.colors.primary[600]})`,
      shortcut: 'Ctrl+R',
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: BarChart3,
      color: theme.colors.tertiary[500],
      gradient: `linear-gradient(135deg, ${theme.colors.tertiary[500]}, ${theme.colors.tertiary[600]})`,
      shortcut: 'Ctrl+A',
    },
    {
      id: 'exportar',
      label: 'Exportar',
      icon: Download,
      color: theme.colors.secondary[500],
      gradient: `linear-gradient(135deg, ${theme.colors.secondary[500]}, ${theme.colors.secondary[600]})`,
      shortcut: 'Ctrl+E',
    },
  ];

  return (
    <div className="flex items-center gap-2">
      {actions.map((action, index) => {
        const Icon = action.icon;

        return (
          <motion.button
            key={action.id}
            custom={index}
            variants={animations.button.primary}
            initial="initial"
            animate="animate"
            whileHover="hover"
            whileTap="tap"
            className="group relative p-3 rounded-xl backdrop-blur-xl border border-white/10 overflow-hidden"
            style={{
              background: theme.glassmorphism.medium.background,
            }}
            title={`${action.label} (${action.shortcut})`}
          >
            {/* Gradient Background on Hover */}
            <motion.div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{
                background: action.gradient,
              }}
            />

            {/* Icon */}
            <motion.div
              variants={animations.micro.iconPulse}
              animate="animate"
              className="relative z-10"
            >
              <Icon className="w-5 h-5 text-white transition-transform group-hover:scale-110" />
            </motion.div>

            {/* Tooltip */}
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.8 }}
              whileHover={{ opacity: 1, y: 0, scale: 1 }}
              className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 rounded-lg bg-slate-900 border border-white/20 shadow-xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap"
            >
              <p className="text-xs text-white font-medium">{action.label}</p>
              <p className="text-xs text-white/50">{action.shortcut}</p>
            </motion.div>
          </motion.button>
        );
      })}

      {/* Settings Button */}
      <motion.button
        variants={animations.button.primary}
        initial="initial"
        animate="animate"
        whileHover="hover"
        whileTap="tap"
        className="group relative p-3 rounded-xl backdrop-blur-xl border border-white/10"
        style={{
          background: theme.glassmorphism.medium.background,
        }}
      >
        <motion.div variants={animations.button.iconRotate} animate="animate" whileHover="hover">
          <Settings className="w-5 h-5 text-white" />
        </motion.div>
      </motion.button>
    </div>
  );
});

QuickActions.displayName = 'QuickActions';

export default QuickActions;
