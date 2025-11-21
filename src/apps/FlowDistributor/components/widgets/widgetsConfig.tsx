/**
 * 🎨 widgetsConfig.tsx - Configuración central de todos los widgets disponibles
 * Define los widgets, sus propiedades y categorías
 */
import { Activity, BarChart3, Bell, Brain, PieChart, TrendingUp } from 'lucide-react';

import WidgetAlertasInteligentes from './WidgetAlertasInteligentes';
import WidgetDistribucionBancos from './WidgetDistribucionBancos';
import WidgetKPIRealTime from './WidgetKPIRealTime';
import { WidgetConfig } from './WidgetManager';
import WidgetVentasChart from './WidgetVentasChart';

/**
 * 📋 Catálogo completo de widgets disponibles
 * Cada widget tiene:
 * - ID único
 * - Tipo/categoría
 * - Título e icono
 * - Componente React
 * - Posición y tamaño por defecto
 */
export const availableWidgets: WidgetConfig[] = [
  // 📊 ANALYTICS - Widgets de análisis
  {
    id: 'kpi-realtime',
    type: 'kpi',
    title: 'KPIs en Tiempo Real',
    icon: <Activity className="w-5 h-5" />,
    component: WidgetKPIRealTime,
    category: 'analytics',
    defaultPosition: { x: 50, y: 50 },
    defaultSize: { width: 400, height: 600 },
  },

  // 📈 CHARTS - Widgets de gráficos
  {
    id: 'ventas-chart',
    type: 'chart',
    title: 'Evolución de Ventas',
    icon: <TrendingUp className="w-5 h-5" />,
    component: WidgetVentasChart,
    category: 'charts',
    defaultPosition: { x: 500, y: 50 },
    defaultSize: { width: 600, height: 400 },
  },
  {
    id: 'distribucion-bancos',
    type: 'chart',
    title: 'Distribución de Capital',
    icon: <PieChart className="w-5 h-5" />,
    component: WidgetDistribucionBancos,
    category: 'charts',
    defaultPosition: { x: 100, y: 500 },
    defaultSize: { width: 450, height: 500 },
  },

  // 🔔 MONITORING - Widgets de monitoreo
  {
    id: 'alertas-inteligentes',
    type: 'alerts',
    title: 'Alertas Inteligentes',
    icon: <Bell className="w-5 h-5" />,
    component: WidgetAlertasInteligentes,
    category: 'monitoring',
    defaultPosition: { x: 1150, y: 50 },
    defaultSize: { width: 400, height: 600 },
  },
];

/**
 * 🎯 Helper: Obtener widget por ID
 */
export const getWidgetById = (id: string): WidgetConfig | undefined => {
  return availableWidgets.find((w) => w.id === id);
};

/**
 * 🎯 Helper: Obtener widgets por categoría
 */
export const getWidgetsByCategory = (category: WidgetConfig['category']): WidgetConfig[] => {
  return availableWidgets.filter((w) => w.category === category);
};

/**
 * 🎯 Helper: IDs de widgets por defecto que se mostrarán al inicio
 */
export const defaultWidgetIds = [
  'kpi-realtime',
  'ventas-chart',
  'distribucion-bancos',
  'alertas-inteligentes',
];
