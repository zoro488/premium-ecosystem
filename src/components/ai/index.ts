/**
 * 🤖 AI COMPONENTS - Exports
 *
 * Exportación centralizada de todos los componentes AI
 */

export { AnomaliesAlert, FloatingAnomalyCounter } from './AnomaliesAlert';
export { ChatWidget } from './ChatWidget';
export { InsightsPanel } from './InsightsPanel';

// Re-export hooks para fácil acceso
export {
  useAIChat,
  useAIInsights,
  useAnomalyDetection,
  useFinancialAnalysis,
} from '../../services/ai/useAI';

// Re-export types
export type {
  AIModel,
  AnomalyDetection,
  ChatMessage,
  FinancialAnalysis,
} from '../../services/ai/aiService';

export type { Insight } from '../../services/ai/useAI';
