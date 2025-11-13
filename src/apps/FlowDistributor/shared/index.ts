/**
 * 📦 SHARED COMPONENTS INDEX
 * ==========================
 * Exportaciones centralizadas de componentes compartidos
 */

// Design System - Export default animations as named export
export * from '../design-system/animations'; // Export all individual animation exports too
export { default as animations } from '../design-system/animations';
export * from '../design-system/theme';

// Components from components/shared/
export { CreativeParticles } from '../components/shared/CreativeParticles';
export { KpiCard3D } from '../components/shared/KpiCard3D';

// Components from components/ (root level)
export { PremiumLoadingScreen } from '../components/PremiumLoadingScreen';

// Advanced Charts (re-export from this folder)
export { AdvancedBarChart } from './AdvancedBarChart';
export { AdvancedRadarChart } from './AdvancedCharts';
export { AdvancedLineChart } from './AdvancedLineChart';
export { AdvancedPieChart } from './AdvancedPieChart';
export { AdvancedScatterChart } from './AdvancedScatterChart';
export { AdvancedTreemapChart } from './AdvancedTreemapChart';

// Types (re-export from AdvancedCharts)
export type {
  AdvancedBarChartProps,
  AdvancedLineChartProps,
  AdvancedPieChartProps,
  AdvancedScatterChartProps,
  AdvancedTreemapProps,
  BarChartDataPoint,
  LineChartDataPoint,
  PieChartDataPoint,
  ScatterDataPoint,
  TreemapDataPoint,
} from './AdvancedCharts';
