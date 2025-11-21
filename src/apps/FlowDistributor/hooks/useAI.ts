/**
 * 🪝 CUSTOM HOOKS - AI INTEGRATION
 *
 * Hooks para integrar IA en toda la aplicación
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { aiService, type AIAnalysisResult, type AICommandResult, type AIConfig, type ChatMessage } from '../services/ai/AIService';

// ============================================================================
// useAIChat - Chat conversacional
// ============================================================================

export interface UseAIChatReturn {
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
  sendMessage: (message: string, config?: AIConfig) => Promise<void>;
  clearChat: () => void;
  exportChat: (format?: 'json' | 'text') => string;
}

export function useAIChat(): UseAIChatReturn {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(async (message: string, config?: AIConfig) => {
    if (!message.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await aiService.chat(message, config);
      setMessages(aiService.getHistory());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al enviar mensaje');
      console.error('Chat error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearChat = useCallback(() => {
    aiService.clearHistory();
    setMessages([]);
    setError(null);
  }, []);

  const exportChat = useCallback((format: 'json' | 'text' = 'json') => {
    return aiService.exportConversation(format);
  }, []);

  // Sincronizar con el servicio al montar
  useEffect(() => {
    setMessages(aiService.getHistory());
  }, []);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearChat,
    exportChat,
  };
}

// ============================================================================
// useAIAnalysis - Análisis de datos
// ============================================================================

export interface UseAIAnalysisReturn {
  analysis: AIAnalysisResult | null;
  isAnalyzing: boolean;
  error: string | null;
  analyze: (data: any, analysisType: string) => Promise<void>;
  reset: () => void;
}

export function useAIAnalysis(): UseAIAnalysisReturn {
  const [analysis, setAnalysis] = useState<AIAnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyze = useCallback(async (data: any, analysisType: string) => {
    setIsAnalyzing(true);
    setError(null);

    try {
      const result = await aiService.analyzeFinancialData(data, analysisType);
      setAnalysis(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error en el análisis');
      console.error('Analysis error:', err);
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  const reset = useCallback(() => {
    setAnalysis(null);
    setError(null);
  }, []);

  return {
    analysis,
    isAnalyzing,
    error,
    analyze,
    reset,
  };
}

// ============================================================================
// useAIPredictions - Predicciones
// ============================================================================

export interface UseAIPredictionsReturn {
  prediction: any | null;
  isPredicting: boolean;
  error: string | null;
  predictSales: (historicalData: any[], horizon?: number) => Promise<void>;
  reset: () => void;
}

export function useAIPredictions(): UseAIPredictionsReturn {
  const [prediction, setPrediction] = useState<any | null>(null);
  const [isPredicting, setIsPredicting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const predictSales = useCallback(async (historicalData: any[], horizon: number = 30) => {
    setIsPredicting(true);
    setError(null);

    try {
      const result = await aiService.predictSales(historicalData, horizon);
      setPrediction(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error en la predicción');
      console.error('Prediction error:', err);
    } finally {
      setIsPredicting(false);
    }
  }, []);

  const reset = useCallback(() => {
    setPrediction(null);
    setError(null);
  }, []);

  return {
    prediction,
    isPredicting,
    error,
    predictSales,
    reset,
  };
}

// ============================================================================
// useAICommands - Ejecutar comandos
// ============================================================================

export interface UseAICommandsReturn {
  result: AICommandResult | null;
  isExecuting: boolean;
  error: string | null;
  executeCommand: (command: string) => Promise<void>;
  reset: () => void;
}

export function useAICommands(): UseAICommandsReturn {
  const [result, setResult] = useState<AICommandResult | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const executeCommand = useCallback(async (command: string) => {
    if (!command.trim()) return;

    setIsExecuting(true);
    setError(null);

    try {
      const cmdResult = await aiService.executeCommand(command);
      setResult(cmdResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al ejecutar comando');
      console.error('Command error:', err);
    } finally {
      setIsExecuting(false);
    }
  }, []);

  const reset = useCallback(() => {
    setResult(null);
    setError(null);
  }, []);

  return {
    result,
    isExecuting,
    error,
    executeCommand,
    reset,
  };
}

// ============================================================================
// useAIReports - Generación de reportes
// ============================================================================

export interface UseAIReportsReturn {
  report: string | null;
  isGenerating: boolean;
  error: string | null;
  generateReport: (type: string, data: any, format?: 'text' | 'markdown' | 'json') => Promise<void>;
  downloadReport: (filename: string) => void;
  reset: () => void;
}

export function useAIReports(): UseAIReportsReturn {
  const [report, setReport] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateReport = useCallback(async (type: string, data: any, format: 'text' | 'markdown' | 'json' = 'text') => {
    setIsGenerating(true);
    setError(null);

    try {
      const reportContent = await aiService.generateReport(type, data, format);
      setReport(reportContent);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al generar reporte');
      console.error('Report generation error:', err);
    } finally {
      setIsGenerating(false);
    }
  }, []);

  const downloadReport = useCallback((filename: string) => {
    if (!report) return;

    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [report]);

  const reset = useCallback(() => {
    setReport(null);
    setError(null);
  }, []);

  return {
    report,
    isGenerating,
    error,
    generateReport,
    downloadReport,
    reset,
  };
}

// ============================================================================
// useAIAnomalyDetection - Detección de anomalías
// ============================================================================

export interface UseAIAnomalyDetectionReturn {
  anomalies: any[];
  isDetecting: boolean;
  error: string | null;
  detectAnomalies: (transactions: any[]) => Promise<void>;
  reset: () => void;
}

export function useAIAnomalyDetection(): UseAIAnomalyDetectionReturn {
  const [anomalies, setAnomalies] = useState<any[]>([]);
  const [isDetecting, setIsDetecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const detectAnomalies = useCallback(async (transactions: any[]) => {
    setIsDetecting(true);
    setError(null);

    try {
      const detected = await aiService.detectAnomalies(transactions);
      setAnomalies(detected);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al detectar anomalías');
      console.error('Anomaly detection error:', err);
    } finally {
      setIsDetecting(false);
    }
  }, []);

  const reset = useCallback(() => {
    setAnomalies([]);
    setError(null);
  }, []);

  return {
    anomalies,
    isDetecting,
    error,
    detectAnomalies,
    reset,
  };
}

// ============================================================================
// useAIVoiceCommands - Comandos por voz
// ============================================================================

export interface UseAIVoiceCommandsReturn {
  isListening: boolean;
  transcript: string;
  error: string | null;
  startListening: () => void;
  stopListening: () => void;
  supported: boolean;
}

export function useAIVoiceCommands(): UseAIVoiceCommandsReturn {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);

  const supported = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;

  useEffect(() => {
    if (!supported) return;

    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'es-ES';

    recognition.onresult = (event: any) => {
      const transcriptText = event.results[0][0].transcript;
      setTranscript(transcriptText);
      setIsListening(false);
    };

    recognition.onerror = (event: any) => {
      setError(`Error en reconocimiento de voz: ${event.error}`);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [supported]);

  const startListening = useCallback(() => {
    if (!supported || !recognitionRef.current) {
      setError('Reconocimiento de voz no soportado en este navegador');
      return;
    }

    setError(null);
    setTranscript('');
    setIsListening(true);
    recognitionRef.current.start();
  }, [supported]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  }, [isListening]);

  return {
    isListening,
    transcript,
    error,
    startListening,
    stopListening,
    supported,
  };
}

// ============================================================================
// EXPORT ALL
// ============================================================================

export {
    useAIAnalysis, useAIAnomalyDetection, useAIChat, useAICommands, useAIPredictions, useAIReports, useAIVoiceCommands
};
