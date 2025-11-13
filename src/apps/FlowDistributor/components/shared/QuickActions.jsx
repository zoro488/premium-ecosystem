/**
 * 🚀 QUICK ACTIONS
 * Acciones rápidas para el dashboard
 */
import { memo, useState } from 'react';

import { AnimatePresence, motion } from 'framer-motion';
import { Bell, Calendar, Download, FileText, Filter, Plus, Search, Settings } from 'lucide-react';

/**
 * 🎯 Componente de acciones rápidas
 */
export const QuickActions = memo(() => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeAction, setActiveAction] = useState(null);

  const quickActions = [
    {
      id: 'nueva-venta',
      label: 'Nueva Venta',
      icon: Plus,
      color: 'from-emerald-500 to-green-600',
      glow: 'shadow-[0_0_20px_rgba(16,185,129,0.3)]',
      action: () => console.log('Nueva venta'),
    },
    {
      id: 'buscar',
      label: 'Buscar',
      icon: Search,
      color: 'from-blue-500 to-cyan-600',
      glow: 'shadow-[0_0_20px_rgba(59,130,246,0.3)]',
      action: () => console.log('Buscar'),
    },
    {
      id: 'reportes',
      label: 'Reportes',
      icon: FileText,
      color: 'from-purple-500 to-pink-600',
      glow: 'shadow-[0_0_20px_rgba(168,85,247,0.3)]',
      action: () => console.log('Reportes'),
    },
    {
      id: 'calendario',
      label: 'Calendario',
      icon: Calendar,
      color: 'from-orange-500 to-red-600',
      glow: 'shadow-[0_0_20px_rgba(245,158,11,0.3)]',
      action: () => console.log('Calendario'),
    },
    {
      id: 'filtros',
      label: 'Filtros',
      icon: Filter,
      color: 'from-indigo-500 to-purple-600',
      glow: 'shadow-[0_0_20px_rgba(99,102,241,0.3)]',
      action: () => console.log('Filtros'),
    },
    {
      id: 'exportar',
      label: 'Exportar',
      icon: Download,
      color: 'from-teal-500 to-cyan-600',
      glow: 'shadow-[0_0_20px_rgba(20,184,166,0.3)]',
      action: () => console.log('Exportar'),
    },
  ];

  const handleActionClick = (action) => {
    setActiveAction(action.id);
    action.action();

    // Reset después de un momento
    setTimeout(() => setActiveAction(null), 300);
  };

  return (
    <div className="relative">
      {/* Botón principal */}
      <motion.button
        onClick={() => setIsExpanded(!isExpanded)}
        className="group relative p-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <motion.div animate={{ rotate: isExpanded ? 45 : 0 }} transition={{ duration: 0.3 }}>
          <Plus className="w-5 h-5 text-white" />
        </motion.div>

        {/* Glow effect */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl" />

        {/* Badge de notificación */}
        <motion.div
          className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
        />
      </motion.button>

      {/* Panel expandido */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="absolute top-full right-0 mt-2 z-50"
          >
            <div className="bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl min-w-[280px]">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-semibold">Acciones Rápidas</h3>
                <button
                  onClick={() => setIsExpanded(false)}
                  className="p-1 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <motion.div animate={{ rotate: 45 }} transition={{ duration: 0.2 }}>
                    <Plus className="w-4 h-4 text-white/60" />
                  </motion.div>
                </button>
              </div>

              {/* Grid de acciones */}
              <div className="grid grid-cols-2 gap-3">
                {quickActions.map((action, index) => {
                  const Icon = action.icon;
                  const isActive = activeAction === action.id;

                  return (
                    <motion.button
                      key={action.id}
                      onClick={() => handleActionClick(action)}
                      className="group relative p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all duration-300"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {/* Efecto de activación */}
                      {isActive && (
                        <motion.div
                          className={`absolute inset-0 rounded-xl bg-gradient-to-r ${action.color} opacity-20`}
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 0.2 }}
                          exit={{ scale: 1.2, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                        />
                      )}

                      {/* Contenido */}
                      <div className="relative z-10 text-center">
                        <motion.div
                          className={`w-10 h-10 mx-auto mb-2 rounded-lg bg-gradient-to-r ${action.color} flex items-center justify-center ${action.glow} group-hover:${action.glow}`}
                          animate={{
                            scale: isActive ? [1, 1.2, 1] : 1,
                          }}
                          transition={{ duration: 0.3 }}
                        >
                          <Icon className="w-5 h-5 text-white" />
                        </motion.div>

                        <span className="text-white/80 text-sm font-medium group-hover:text-white transition-colors">
                          {action.label}
                        </span>
                      </div>

                      {/* Hover glow */}
                      <div
                        className={`absolute inset-0 rounded-xl bg-gradient-to-r ${action.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300 blur-xl`}
                      />
                    </motion.button>
                  );
                })}
              </div>

              {/* Separator */}
              <div className="my-4 h-px bg-white/10" />

              {/* Additional options */}
              <div className="space-y-2">
                <motion.button
                  className="w-full flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-all"
                  whileHover={{ x: 4 }}
                >
                  <Settings className="w-4 h-4" />
                  <span className="text-sm">Configuración</span>
                </motion.button>

                <motion.button
                  className="w-full flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-all"
                  whileHover={{ x: 4 }}
                >
                  <Bell className="w-4 h-4" />
                  <span className="text-sm">Notificaciones</span>
                  <div className="ml-auto w-2 h-2 bg-red-500 rounded-full" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overlay para cerrar */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40"
            onClick={() => setIsExpanded(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
});

QuickActions.displayName = 'QuickActions';

export default QuickActions;
