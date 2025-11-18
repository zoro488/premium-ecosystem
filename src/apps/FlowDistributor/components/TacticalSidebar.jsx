/**
 * 🎯 TACTICAL SIDEBAR
 * Navegación táctica con paneles CHRONOS
 */
import { useEffect, useState } from 'react';

import { AnimatePresence, motion } from 'framer-motion';

import { useCursorEffects } from '../hooks/useCursorEffects';
import { useTacticalSounds } from '../hooks/useTacticalSounds';

const TacticalSidebar = ({
  activePanel = 'dashboard',
  onPanelChange,
  isCollapsed = false,
  onToggleCollapse,
}) => {
  const [hoveredPanel, setHoveredPanel] = useState(null);
  const [systemStatus] = useState('ONLINE');
  const { playUISound, playTacticalSound } = useTacticalSounds();
  const { addHoverEffect, triggerTacticalMode } = useCursorEffects();

  // Paneles disponibles basados en Excel
  const panels = [
    {
      id: 'dashboard',
      name: 'Dashboard Control',
      icon: '📊',
      description: 'Panel maestro que integra ventas, gastos y abonos',
      status: 'ACTIVO',
      priority: 'HIGH',
      color: 'from-zinc-800 to-zinc-800',
    },
    {
      id: 'distribuidores',
      name: 'Distribuidores',
      icon: '🚛',
      description: 'Panel distribuidores con órdenes de compra',
      status: 'ACTIVO',
      priority: 'HIGH',
      color: 'from-zinc-800 to-indigo-500',
    },
    {
      id: 'clientes',
      name: 'Clientes',
      icon: '👥',
      description: 'Gestión completa de clientes',
      status: 'ACTIVO',
      priority: 'MEDIUM',
      color: 'from-zinc-700 to-zinc-700',
    },
    {
      id: 'analisis',
      name: 'Análisis y Reportes',
      icon: '📈',
      description: 'Centro de análisis y generación de reportes',
      status: 'ACTIVO',
      priority: 'MEDIUM',
      color: 'from-green-500 to-emerald-500',
    },
    {
      id: 'sicar',
      name: 'SICAR IA 1500',
      icon: '🤖',
      description: 'Asistente de inteligencia artificial',
      status: 'ACTIVO',
      priority: 'LOW',
      color: 'from-zinc-800 to-zinc-800',
    },
  ];

  // Manejar cambio de panel
  const handlePanelSelect = (panelId) => {
    if (panelId === activePanel) return;

    playTacticalSound('commandReceived');
    triggerTacticalMode(1500);

    if (onPanelChange) {
      onPanelChange(panelId);
    }
  };

  // Configurar efectos de cursor para elementos interactivos
  useEffect(() => {
    const sidebarElements = document.querySelectorAll('.tactical-panel-item');
    const cleanupFunctions = [];

    for (const element of sidebarElements) {
      const cleanup = addHoverEffect(element, 'tactical');
      cleanupFunctions.push(cleanup);
    }

    return () => {
      for (const cleanup of cleanupFunctions) {
        if (cleanup) cleanup();
      }
    };
  }, [addHoverEffect]);

  // Estados del sistema
  const getSystemStatusColor = () => {
    switch (systemStatus) {
      case 'ONLINE':
        return 'text-zinc-200';
      case 'SCANNING':
        return 'text-zinc-200';
      case 'ALERT':
        return 'text-zinc-200';
      default:
        return 'text-gray-400';
    }
  };

  // Variantes de animación
  const sidebarVariants = {
    expanded: {
      width: '280px',
      transition: { duration: 0.3, ease: 'easeOut' },
    },
    collapsed: {
      width: '70px',
      transition: { duration: 0.3, ease: 'easeOut' },
    },
  };

  const panelItemVariants = {
    inactive: {
      scale: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.3)',
      border: '1px solid rgba(255, 102, 0, 0.2)',
    },
    active: {
      scale: 1.02,
      backgroundColor: 'rgba(255, 102, 0, 0.1)',
      border: '1px solid rgba(255, 102, 0, 0.8)',
    },
    hover: {
      scale: 1.05,
      backgroundColor: 'rgba(255, 102, 0, 0.15)',
      border: '1px solid rgba(255, 102, 0, 1)',
    },
  };

  return (
    <motion.div
      className="fixed left-0 top-0 h-full bg-black bg-opacity-90 backdrop-blur-lg border-r border-zinc-500/30 z-50"
      variants={sidebarVariants}
      animate={isCollapsed ? 'collapsed' : 'expanded'}
      style={{
        background: 'linear-gradient(180deg, rgba(0,0,0,0.95) 0%, rgba(10,10,10,0.9) 100%)',
        boxShadow: '4px 0 20px rgba(255, 102, 0, 0.1)',
      }}
    >
      {/* Header táctico */}
      <div className="p-4 border-b border-zinc-500/30">
        <motion.div className="flex items-center justify-between" layout>
          <AnimatePresence>
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex flex-col"
              >
                <h2 className="text-zinc-200 font-bold text-sm tracking-wider">CHRONOS TACTICAL</h2>
                <p className={`text-xs ${getSystemStatusColor()}`}>STATUS: {systemStatus}</p>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button
            onClick={onToggleCollapse}
            className="p-2 rounded bg-zinc-9000/20 hover:bg-zinc-9000/30 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onMouseEnter={() => playUISound('hover')}
            onMouseDown={() => playUISound('click')}
          >
            <motion.div animate={{ rotate: isCollapsed ? 0 : 180 }} transition={{ duration: 0.3 }}>
              <span className="text-zinc-200 text-lg">⮞</span>
            </motion.div>
          </motion.button>
        </motion.div>
      </div>

      {/* Paneles tácticos */}
      <div className="flex-1 p-2 space-y-2">
        {panels.map((panel) => (
          <motion.div
            key={panel.id}
            className={`tactical-panel-item relative cursor-pointer rounded-lg overflow-hidden transition-all duration-300 ${
              activePanel === panel.id ? 'ring-2 ring-orange-400' : ''
            }`}
            variants={panelItemVariants}
            initial="inactive"
            animate={activePanel === panel.id ? 'active' : 'inactive'}
            whileHover="hover"
            onClick={() => handlePanelSelect(panel.id)}
            onMouseEnter={() => {
              setHoveredPanel(panel.id);
              playUISound('hover');
            }}
            onMouseLeave={() => setHoveredPanel(null)}
            style={{
              background:
                hoveredPanel === panel.id
                  ? `linear-gradient(135deg, ${panel.glowColor}, rgba(0,0,0,0.7))`
                  : 'rgba(0, 0, 0, 0.3)',
            }}
          >
            {/* Efecto de glow animado */}
            <AnimatePresence>
              {(activePanel === panel.id || hoveredPanel === panel.id) && (
                <motion.div
                  className="absolute inset-0 opacity-20"
                  style={{
                    background: panel.color
                      ? `linear-gradient(45deg, ${panel.color.replace('from-', 'rgba(').replace(' to-', ', 0.3), rgba(').replace('-500', ', 0.8)')})`
                      : 'linear-gradient(45deg, rgba(59, 130, 246, 0.3), rgba(99, 102, 241, 0.8))',
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.2 }}
                  exit={{ opacity: 0 }}
                />
              )}
            </AnimatePresence>

            <div className="relative z-10 p-3">
              <div className="flex items-center space-x-3">
                {/* Icono del panel */}
                <motion.div
                  className="text-2xl"
                  animate={activePanel === panel.id ? { rotate: [0, 5, -5, 0] } : {}}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {panel.icon}
                </motion.div>

                {/* Información del panel */}
                <AnimatePresence>
                  {!isCollapsed && (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="flex-1"
                    >
                      <div className="flex items-center justify-between">
                        <h3 className="text-white font-semibold text-sm">{panel.name}</h3>
                        <span
                          className={`text-xs px-2 py-1 rounded ${
                            panel.priority === 'CRITICAL'
                              ? 'bg-zinc-9000/20 text-zinc-200'
                              : panel.priority === 'HIGH'
                                ? 'bg-zinc-9000/20 text-zinc-200'
                                : panel.priority === 'STRATEGIC'
                                  ? 'bg-zinc-9000/20 text-zinc-200'
                                  : 'bg-gray-500/20 text-gray-400'
                          }`}
                        >
                          {panel.priority}
                        </span>
                      </div>

                      <p className="text-gray-400 text-xs mt-1">{panel.description}</p>

                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-orange-300">📊 {panel.dataSource}</span>
                        <kbd className="text-xs bg-black/50 px-2 py-1 rounded">
                          {panel.shortcut}
                        </kbd>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Indicador de actividad */}
              {activePanel === panel.id && (
                <motion.div
                  className="absolute right-2 top-2 w-2 h-2 bg-orange-400 rounded-full"
                  animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Footer con estado del sistema */}
      <AnimatePresence>
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="p-4 border-t border-zinc-500/30"
          >
            <div className="text-xs text-gray-400 space-y-1">
              <div className="flex justify-between">
                <span>Panels Active:</span>
                <span className="text-zinc-200">{panels.length}</span>
              </div>
              <div className="flex justify-between">
                <span>AI Status:</span>
                <span className="text-zinc-200">READY</span>
              </div>
              <div className="flex justify-between">
                <span>Data Sync:</span>
                <motion.span
                  className="text-zinc-300"
                  animate={{ opacity: [1, 0.5, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  LIVE
                </motion.span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Efecto de scanlines */}
      <div
        className="absolute inset-0 pointer-events-none opacity-10"
        style={{
          background: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(255, 102, 0, 0.1) 2px,
            rgba(255, 102, 0, 0.1) 4px
          )`,
        }}
      />
    </motion.div>
  );
};

export default TacticalSidebar;
