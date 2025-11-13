/**
 * ====================================
 * GEMINI AI - TIPOS TYPESCRIPT
 * ====================================
 * Definiciones de tipos para toda la integración
 */

/**
 * Modelos disponibles de Gemini
 */
export type GeminiModelType = 'creative' | 'precise' | 'balanced' | 'code' | 'summary' | 'vision';

/**
 * Opciones del hook useGemini
 */
export interface UseGeminiOptions {
  modelType?: GeminiModelType;
  stream?: boolean;
  autoRetry?: boolean;
}

/**
 * Respuesta exitosa de Gemini
 */
export interface GeminiSuccessResponse {
  success: true;
  data: string;
  timestamp?: string;
}

/**
 * Respuesta con error de Gemini
 */
export interface GeminiErrorResponse {
  success: false;
  error: string;
  code: 'INVALID_API_KEY' | 'QUOTA_EXCEEDED' | 'RATE_LIMIT' | 'UNKNOWN_ERROR';
}

/**
 * Respuesta genérica de Gemini
 */
export type GeminiResponse = GeminiSuccessResponse | GeminiErrorResponse;

/**
 * Mensaje de chat
 */
export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
  timestamp?: string;
}

/**
 * Historial de chat
 */
export type ChatHistory = ChatMessage[];

/**
 * Resultado del hook useGemini
 */
export interface UseGeminiResult {
  loading: boolean;
  error: GeminiErrorResponse | null;
  response: string | null;
  streamingText: string;
  chatHistory: ChatHistory;
  generateContent: (prompt: string, customConfig?: any) => Promise<string>;
  generateContentWithImage: (prompt: string, imageData: string) => Promise<string>;
  chat: (message: string) => Promise<string>;
  cancel: () => void;
  reset: () => void;
  isStreaming: boolean;
  hasError: boolean;
}

/**
 * Análisis de sentimiento
 */
export interface SentimentAnalysis {
  sentiment: 'positivo' | 'neutral' | 'negativo';
  score: number;
  confidence: number;
  emotions: string[];
  reasoning: string;
}

/**
 * Análisis de texto
 */
export interface TextAnalysis {
  success: boolean;
  analysis: string;
  timestamp: string;
}

/**
 * Predicción de tendencias
 */
export interface TrendPrediction {
  success: boolean;
  prediction: string;
}

/**
 * Tracking de request de IA
 */
export interface AIRequestTracking {
  provider: 'gemini' | 'openai' | 'claude';
  model: string;
  latency: number;
  success: boolean;
  timestamp: string;
}

/**
 * Metadata de feature de IA
 */
export interface AIFeatureMetadata {
  [key: string]: any;
}

/**
 * Props del componente GeminiAssistant
 */
export interface GeminiAssistantProps {
  modelType?: GeminiModelType;
  placeholder?: string;
  onResponse?: (response: string) => void;
  className?: string;
}

/**
 * Props del componente GeminiChat
 */
export interface GeminiChatProps {
  className?: string;
}

/**
 * Props del componente GeminiQuickAction
 */
export interface GeminiQuickActionProps {
  action: string;
  icon?: React.ComponentType<{ className?: string }>;
  label: string;
  onComplete?: (result: string) => void;
}

/**
 * Configuración de generación de Gemini
 */
export interface GenerationConfig {
  temperature: number;
  topK: number;
  topP: number;
  maxOutputTokens: number;
}

/**
 * Configuración de seguridad de Gemini
 */
export interface SafetySetting {
  category: string;
  threshold: string;
}

/**
 * Límites de Gemini
 */
export interface GeminiLimits {
  MAX_TOKENS_PER_REQUEST: number;
  MAX_REQUESTS_PER_MINUTE: number;
  RATE_LIMIT_DELAY: number;
}

/**
 * Configuración de retry
 */
export interface RetryConfig {
  maxRetries: number;
  retryDelay: number;
  backoffMultiplier: number;
}

/**
 * Producto para descripción
 */
export interface ProductInfo {
  name: string;
  category?: string;
  features?: string[];
  price?: number;
  description?: string;
}

/**
 * Review de cliente
 */
export interface CustomerReview {
  comment: string;
  rating: number;
  author?: string;
  date?: string;
}

/**
 * Datos de ventas
 */
export interface SalesData {
  date: string;
  amount: number;
  units?: number;
  product?: string;
}

/**
 * Lead de ventas
 */
export interface SalesLead {
  name: string;
  company: string;
  email?: string;
  phone?: string;
  interest?: string;
}

export default {};
