/**
 * 🎛️ WidgetManager - Gestor central de widgets flotantes
 * Características:
 * - Control de visibilidad de widgets
 * - Gestión de z-index (stacking)
 * - Catálogo de widgets disponibles
 * - Persistencia de configuración
 * - Widget launcher con menú
 */
import React, { useCallback, useEffect, useState } from 'react';

import { AnimatePresence, motion } from 'framer-motion';
import {
  Activity,
  BarChart3,
  Bell,
  Brain,
  Layout,
  PieChart,
  Plus,
  Sparkles,
  TrendingUp,
  Zap,
} from 'lucide-react';

export interface WidgetConfig {
  id: string;
  type: string;
  title: string;
  icon: React.ReactNode;
  component: React.ComponentType<any>;
  defaultPosition: { x: number; y: number };
  defaultSize: { width: number; height: number };
  category: 'analytics' | 'charts' | 'monitoring' | 'ai';
}

export interface ActiveWidget extends WidgetConfig {
  zIndex: number;
  visible: boolean;
}

interface WidgetManagerProps {
  availableWidgets: WidgetConfig[];
  children: (
    activeWidgets: ActiveWidget[],
    openWidget: (widgetId: string) => void,
    closeWidget: (widgetId: string) => void,
    focusWidget: (widgetId: string) => void
  ) => React.ReactNode;
}

export const WidgetManager: React.FC<WidgetManagerProps> = ({ availableWidgets, children }) => {
  const [activeWidgets, setActiveWidgets] = useState<ActiveWidget[]>([]);
  const [maxZIndex, setMaxZIndex] = useState(100);
  const [isLauncherOpen, setIsLauncherOpen] = useState(false);

  // 💾 Cargar widgets activos del localStorage
  useEffect(() => {
    const savedWidgets = localStorage.getItem('active-widgets');
    if (savedWidgets) {
      try {
        const widgetIds = JSON.parse(savedWidgets);
        const widgets = widgetIds
          .map((id: string) => {
            const config = availableWidgets.find((w) => w.id === id);
            if (config) {
              return {
                ...config,
                zIndex: 100,
                visible: true,
              };
            }
            return null;
          })
          .filter(Boolean);
        setActiveWidgets(widgets);
      } catch (error) {
        console.error('Error loading active widgets:', error);
      }
    }
  }, [availableWidgets]);

  // 💾 Guardar widgets activos en localStorage
  useEffect(() => {
    const widgetIds = activeWidgets.map((w) => w.id);
    localStorage.setItem('active-widgets', JSON.stringify(widgetIds));
  }, [activeWidgets]);

  // ➕ Abrir widget
  const openWidget = useCallback(
    (widgetId: string) => {
      const existingWidget = activeWidgets.find((w) => w.id === widgetId);

      if (existingWidget) {
        // Si ya existe, traerlo al frente y hacerlo visible
        setActiveWidgets((prev) =>
          prev.map((w) => (w.id === widgetId ? { ...w, visible: true, zIndex: maxZIndex + 1 } : w))
        );
        setMaxZIndex((prev) => prev + 1);
      } else {
        // Si no existe, crearlo
        const widgetConfig = availableWidgets.find((w) => w.id === widgetId);
        if (widgetConfig) {
          const newWidget: ActiveWidget = {
            ...widgetConfig,
            zIndex: maxZIndex + 1,
            visible: true,
          };
          setActiveWidgets((prev) => [...prev, newWidget]);
          setMaxZIndex((prev) => prev + 1);
        }
      }

      setIsLauncherOpen(false);
    },
    [activeWidgets, availableWidgets, maxZIndex]
  );

  // ❌ Cerrar widget
  const closeWidget = useCallback((widgetId: string) => {
    setActiveWidgets((prev) => prev.filter((w) => w.id !== widgetId));
  }, []);

  // 🎯 Traer widget al frente
  const focusWidget = useCallback(
    (widgetId: string) => {
      setActiveWidgets((prev) =>
        prev.map((w) => (w.id === widgetId ? { ...w, zIndex: maxZIndex + 1 } : w))
      );
      setMaxZIndex((prev) => prev + 1);
    },
    [maxZIndex]
  );

  // 📊 Agrupar widgets por categoría
  const widgetsByCategory = availableWidgets.reduce(
    (acc, widget) => {
      if (!acc[widget.category]) {
        acc[widget.category] = [];
      }
      acc[widget.category].push(widget);
      return acc;
    },
    {} as Record<string, WidgetConfig[]>
  );

  const categoryIcons: Record<string, React.ReactNode> = {
    analytics: <Activity className="w-5 h-5" />,
    charts: <BarChart3 className="w-5 h-5" />,
    monitoring: <Bell className="w-5 h-5" />,
    ai: <Brain className="w-5 h-5" />,
  };

  const categoryLabels: Record<string, string> = {
    analytics: 'Análisis',
    charts: 'Gráficos',
    monitoring: 'Monitoreo',
    ai: 'Inteligencia Artificial',
  };

  return (
    <>
      {/* 🚀 LAUNCHER BUTTON - Botón flotante para abrir el catálogo */}
      <motion.button
        className="fixed bottom-6 right-6 z-[1000] p-4 rounded-full shadow-2xl"
        style={{
          background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
          backdropFilter: 'blur(20px)',
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsLauncherOpen(!isLauncherOpen)}
        title="Abrir catálogo de widgets"
      >
        <motion.div animate={{ rotate: isLauncherOpen ? 45 : 0 }} transition={{ duration: 0.2 }}>
          <Plus className="w-6 h-6 text-white" />
        </motion.div>
      </motion.button>

      {/* 📦 WIDGET LAUNCHER - Catálogo de widgets disponibles */}
      <AnimatePresence>
        {isLauncherOpen && (
          <>
            {/* Overlay */}
            <motion.div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[999]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsLauncherOpen(false)}
            />

            {/* Panel del catálogo */}
            <motion.div
              className="fixed bottom-24 right-6 z-[1001] w-96 max-h-[600px] overflow-y-auto rounded-2xl shadow-2xl"
              style={{
                background: 'rgba(15, 23, 42, 0.95)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(148, 163, 184, 0.2)',
              }}
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              transition={{ duration: 0.2 }}
            >
              {/* Header */}
              <div className="p-6 border-b border-white/10">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-indigo-500/20 to-zinc-800/20">
                    <Layout className="w-6 h-6 text-zinc-200" />
                  </div>
                  <h2 className="text-xl font-bold text-white">Widgets Disponibles</h2>
                </div>
                <p className="text-sm text-slate-400">
                  Selecciona widgets para añadir a tu dashboard
                </p>
              </div>

              {/* Lista de widgets por categoría */}
              <div className="p-4 space-y-6">
                {Object.entries(widgetsByCategory).map(([category, widgets]) => (
                  <div key={category}>
                    {/* Título de categoría */}
                    <div className="flex items-center gap-2 mb-3 px-2">
                      <div className="text-zinc-200">{categoryIcons[category]}</div>
                      <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">
                        {categoryLabels[category]}
                      </h3>
                    </div>

                    {/* Widgets de la categoría */}
                    <div className="grid grid-cols-1 gap-2">
                      {widgets.map((widget) => {
                        const isActive = activeWidgets.some((w) => w.id === widget.id);

                        return (
                          <motion.button
                            key={widget.id}
                            className="flex items-center gap-3 p-3 rounded-lg text-left transition-all"
                            style={{
                              background: isActive
                                ? 'rgba(99, 102, 241, 0.1)'
                                : 'rgba(255, 255, 255, 0.05)',
                              border: '1px solid',
                              borderColor: isActive
                                ? 'rgba(99, 102, 241, 0.3)'
                                : 'rgba(148, 163, 184, 0.1)',
                            }}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => openWidget(widget.id)}
                            disabled={isActive}
                          >
                            <div className="text-zinc-200">{widget.icon}</div>
                            <div className="flex-1">
                              <h4 className="text-sm font-medium text-white">{widget.title}</h4>
                            </div>
                            {isActive && (
                              <div className="flex items-center gap-1 text-xs text-zinc-200">
                                <Zap className="w-3 h-3" />
                                Activo
                              </div>
                            )}
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer con contador */}
              <div className="p-4 border-t border-white/10 bg-white/5">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">
                    {activeWidgets.length} widget{activeWidgets.length !== 1 ? 's' : ''} activo
                    {activeWidgets.length !== 1 ? 's' : ''}
                  </span>
                  <span className="text-zinc-200 font-medium">
                    {availableWidgets.length} disponibles
                  </span>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* 🎨 Renderizar widgets activos */}
      {children(activeWidgets, openWidget, closeWidget, focusWidget)}
    </>
  );
};

export default WidgetManager;
