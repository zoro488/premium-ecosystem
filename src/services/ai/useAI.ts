/**
 * 🎣 CUSTOM HOOKS - AI INTEGRATION
 *
 * Hooks de React para integración fácil del servicio AI en componentes:
 * - useAIChat: Chat conversacional con historial
 * - useFinancialAnalysis: Análisis financiero automático
 * - useAnomalyDetection: Detección de anomalías en tiempo real
 * - useAIInsights: Generación de insights inteligentes
 */
import { useCallback, useEffect, useRef, useState } from 'react';

import type { AIModel, AnomalyDetection, ChatMessage, FinancialAnalysis } from './aiService';
import { aiService } from './aiService';

// ============================================================================
// HOOK: useAIChat
// ============================================================================

interface UseAIChatOptions {
  model?: AIModel;
  autoSave?: boolean;
  maxHistoryLength?: number;
}

interface UseAIChatReturn {
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
  sendMessage: (message: string, financialContext?: Record<string, any>) => Promise<void>;
  clearHistory: () => void;
  retry: () => Promise<void>;
}

/**
 * Hook para chat AI conversacional
 */
export function useAIChat(options: UseAIChatOptions = {}): UseAIChatReturn {
  const { model, autoSave = true, maxHistoryLength = 50 } = options;

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const lastMessageRef = useRef<string>('');
  const lastContextRef = useRef<Record<string, any> | undefined>();

  // Cargar historial del localStorage al montar
  useEffect(() => {
    if (autoSave) {
      const saved = localStorage.getItem('ai-chat-history');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setMessages(parsed);
        } catch (err) {
          console.error('Error cargando historial:', err);
        }
      }
    }
  }, [autoSave]);

  // Guardar historial en localStorage cuando cambie
  useEffect(() => {
    if (autoSave && messages.length > 0) {
      localStorage.setItem('ai-chat-history', JSON.stringify(messages.slice(-maxHistoryLength)));
    }
  }, [messages, autoSave, maxHistoryLength]);

  const sendMessage = useCallback(
    async (message: string, financialContext?: Record<string, any>) => {
      if (!message.trim()) return;

      setIsLoading(true);
      setError(null);
      lastMessageRef.current = message;
      lastContextRef.current = financialContext;

      // Agregar mensaje del usuario
      const userMessage: ChatMessage = {
        role: 'user',
        content: message,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, userMessage]);

      try {
        const response = await aiService.chat(message, {
          model,
          includeHistory: true,
          financialContext,
        });

        const assistantMessage: ChatMessage = {
          role: 'assistant',
          content: response,
          timestamp: new Date().toISOString(),
        };

        setMessages((prev) => [...prev, assistantMessage]);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
        setError(errorMessage);

        // Agregar mensaje de error
        const errorMsg: ChatMessage = {
          role: 'assistant',
          content: `❌ Error: ${errorMessage}`,
          timestamp: new Date().toISOString(),
          metadata: { isError: true },
        };

        setMessages((prev) => [...prev, errorMsg]);
      } finally {
        setIsLoading(false);
      }
    },
    [model]
  );

  const clearHistory = useCallback(() => {
    setMessages([]);
    aiService.clearHistory();
    if (autoSave) {
      localStorage.removeItem('ai-chat-history');
    }
  }, [autoSave]);

  const retry = useCallback(async () => {
    if (lastMessageRef.current) {
      await sendMessage(lastMessageRef.current, lastContextRef.current);
    }
  }, [sendMessage]);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearHistory,
    retry,
  };
}

// ============================================================================
// HOOK: useFinancialAnalysis
// ============================================================================

interface UseFinancialAnalysisOptions {
  autoAnalyze?: boolean;
  refreshInterval?: number; // ms
}

interface UseFinancialAnalysisReturn {
  analysis: FinancialAnalysis | null;
  isAnalyzing: boolean;
  error: string | null;
  analyze: (data: {
    ingresos: Array<{ monto: number; fecha: string; categoria: string }>;
    gastos: Array<{ monto: number; fecha: string; categoria: string }>;
    periodo: string;
  }) => Promise<void>;
  refresh: () => Promise<void>;
}

/**
 * Hook para análisis financiero con AI
 */
export function useFinancialAnalysis(
  options: UseFinancialAnalysisOptions = {}
): UseFinancialAnalysisReturn {
  const { autoAnalyze = false, refreshInterval } = options;

  const [analysis, setAnalysis] = useState<FinancialAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const lastDataRef = useRef<any>(null);

  const analyze = useCallback(
    async (data: {
      ingresos: Array<{ monto: number; fecha: string; categoria: string }>;
      gastos: Array<{ monto: number; fecha: string; categoria: string }>;
      periodo: string;
    }) => {
      setIsAnalyzing(true);
      setError(null);
      lastDataRef.current = data;

      try {
        const result = await aiService.analyzeFinancials(data);
        setAnalysis(result);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Error en análisis';
        setError(errorMessage);
        console.error('Error en análisis financiero:', err);
      } finally {
        setIsAnalyzing(false);
      }
    },
    []
  );

  const refresh = useCallback(async () => {
    if (lastDataRef.current) {
      await analyze(lastDataRef.current);
    }
  }, [analyze]);

  // Auto-refresh si está configurado
  useEffect(() => {
    if (autoAnalyze && refreshInterval && lastDataRef.current) {
      const interval = setInterval(refresh, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [autoAnalyze, refreshInterval, refresh]);

  return {
    analysis,
    isAnalyzing,
    error,
    analyze,
    refresh,
  };
}

// ============================================================================
// HOOK: useAnomalyDetection
// ============================================================================

interface UseAnomalyDetectionOptions {
  autoDetect?: boolean;
  threshold?: number; // 0-1, mínima puntuación para considerar anomalía
}

interface UseAnomalyDetectionReturn {
  anomalies: AnomalyDetection[];
  isDetecting: boolean;
  error: string | null;
  criticalCount: number;
  highCount: number;
  detect: (
    transacciones: Array<{
      id: string;
      tipo: string;
      monto: number;
      fecha: string;
      banco: string;
      categoria?: string;
    }>
  ) => Promise<void>;
  clearAnomalies: () => void;
}

/**
 * Hook para detección de anomalías
 */
export function useAnomalyDetection(
  options: UseAnomalyDetectionOptions = {}
): UseAnomalyDetectionReturn {
  const { threshold = 0.6 } = options;

  const [anomalies, setAnomalies] = useState<AnomalyDetection[]>([]);
  const [isDetecting, setIsDetecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const detect = useCallback(
    async (
      transacciones: Array<{
        id: string;
        tipo: string;
        monto: number;
        fecha: string;
        banco: string;
        categoria?: string;
      }>
    ) => {
      if (transacciones.length === 0) return;

      setIsDetecting(true);
      setError(null);

      try {
        const detected = await aiService.detectAnomalies(transacciones);

        // Filtrar por threshold
        const filtered = detected.filter((a) => a.esAnomalia && a.puntuacionAnomalia >= threshold);

        setAnomalies(filtered);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Error en detección';
        setError(errorMessage);
        console.error('Error en detección de anomalías:', err);
      } finally {
        setIsDetecting(false);
      }
    },
    [threshold]
  );

  const clearAnomalies = useCallback(() => {
    setAnomalies([]);
    setError(null);
  }, []);

  const criticalCount = anomalies.filter((a) => a.severidad === 'critica').length;
  const highCount = anomalies.filter((a) => a.severidad === 'alta').length;

  return {
    anomalies,
    isDetecting,
    error,
    criticalCount,
    highCount,
    detect,
    clearAnomalies,
  };
}

// ============================================================================
// HOOK: useAIInsights
// ============================================================================

interface UseAIInsightsOptions {
  category?: 'ventas' | 'gastos' | 'general' | 'clientes' | 'distribuidores';
  refreshOnMount?: boolean;
}

interface Insight {
  id: string;
  tipo: 'positivo' | 'negativo' | 'neutral' | 'alerta';
  titulo: string;
  descripcion: string;
  accion?: string;
  prioridad: 'baja' | 'media' | 'alta' | 'urgente';
  timestamp: string;
}

interface UseAIInsightsReturn {
  insights: Insight[];
  isGenerating: boolean;
  error: string | null;
  generateInsights: (prompt: string) => Promise<void>;
  clearInsights: () => void;
}

/**
 * Hook para generar insights inteligentes
 */
export function useAIInsights(options: UseAIInsightsOptions = {}): UseAIInsightsReturn {
  const { category = 'general', refreshOnMount = false } = options;

  const [insights, setInsights] = useState<Insight[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateInsights = useCallback(
    async (prompt: string) => {
      setIsGenerating(true);
      setError(null);

      const fullPrompt = `Genera 3-5 insights ${category !== 'general' ? `sobre ${category}` : 'financieros'} basados en:

${prompt}

Responde en JSON con este formato:
[
  {
    "tipo": "positivo|negativo|neutral|alerta",
    "titulo": "Título corto",
    "descripcion": "Descripción detallada",
    "accion": "Acción recomendada (opcional)",
    "prioridad": "baja|media|alta|urgente"
  }
]`;

      try {
        const response = await aiService.chat(fullPrompt, { includeHistory: false });

        const jsonMatch = response.match(/\[[\s\S]*\]/);
        if (!jsonMatch) {
          throw new Error('No se pudo parsear insights');
        }

        const parsed = JSON.parse(jsonMatch[0]);

        const newInsights: Insight[] = parsed.map((insight: any, index: number) => ({
          id: `insight-${Date.now()}-${index}`,
          tipo: insight.tipo || 'neutral',
          titulo: insight.titulo,
          descripcion: insight.descripcion,
          accion: insight.accion,
          prioridad: insight.prioridad || 'media',
          timestamp: new Date().toISOString(),
        }));

        setInsights(newInsights);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Error generando insights';
        setError(errorMessage);
        console.error('Error generando insights:', err);
      } finally {
        setIsGenerating(false);
      }
    },
    [category]
  );

  const clearInsights = useCallback(() => {
    setInsights([]);
    setError(null);
  }, []);

  // Auto-generate en mount si está configurado
  useEffect(() => {
    if (refreshOnMount) {
      generateInsights('Genera insights generales del sistema financiero actual.');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshOnMount]);

  return {
    insights,
    isGenerating,
    error,
    generateInsights,
    clearInsights,
  };
}

// ============================================================================
// EXPORTS
// ============================================================================

export type {
  Insight,
  UseAIChatReturn,
  UseAIInsightsReturn,
  UseAnomalyDetectionReturn,
  UseFinancialAnalysisReturn,
};
