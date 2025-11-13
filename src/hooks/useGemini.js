/**
 * ====================================
 * GEMINI AI - HOOK PERSONALIZADO
 * ====================================
 * Hook React para interactuar con Gemini API
 * con manejo de estado, errores y streaming
 */
import { useCallback, useRef, useState } from 'react';

import { trackAIRequest } from '@/services/analytics';

import { geminiModels, handleGeminiError, logGeminiUsage } from './config';

/**
 * Hook principal para usar Gemini en componentes React
 * @param {Object} options - Opciones de configuración
 * @param {string} options.modelType - Tipo de modelo: 'creative', 'precise', 'balanced', 'code', 'summary'
 * @param {boolean} options.stream - Activar streaming de respuestas
 * @param {boolean} options.autoRetry - Reintentar automáticamente en errores
 */
export const useGemini = (options = {}) => {
  const { modelType = 'balanced', stream = false, autoRetry = true } = options;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [response, setResponse] = useState(null);
  const [streamingText, setStreamingText] = useState('');

  const abortControllerRef = useRef(null);
  const retryCountRef = useRef(0);

  /**
   * Genera contenido con Gemini
   */
  const generateContent = useCallback(
    async (prompt, customConfig = {}) => {
      // Reset estado
      setLoading(true);
      setError(null);
      setResponse(null);
      setStreamingText('');
      retryCountRef.current = 0;

      // Crear abort controller para cancelar requests
      abortControllerRef.current = new AbortController();

      const startTime = Date.now();

      try {
        const model = geminiModels[modelType] || geminiModels.balanced;

        // Streaming mode
        if (stream) {
          const result = await model.generateContentStream(prompt);
          let fullText = '';

          for await (const chunk of result.stream) {
            const chunkText = chunk.text();
            fullText += chunkText;
            setStreamingText(fullText);
          }

          setResponse(fullText);

          // Log analytics
          const latency = Date.now() - startTime;
          logGeminiUsage(modelType, fullText.length / 4, latency);
          trackAIRequest('gemini', modelType, latency, true);

          return fullText;
        }

        // Normal mode
        const result = await model.generateContent(prompt);
        const text = result.response.text();

        setResponse(text);

        // Log analytics
        const latency = Date.now() - startTime;
        logGeminiUsage(modelType, text.length / 4, latency);
        trackAIRequest('gemini', modelType, latency, true);

        return text;
      } catch (err) {
        console.error('Error en generateContent:', err);

        const errorInfo = handleGeminiError(err);
        setError(errorInfo);

        // Log error
        const latency = Date.now() - startTime;
        trackAIRequest('gemini', modelType, latency, false);

        // Auto retry
        if (autoRetry && retryCountRef.current < 3 && errorInfo.code === 'RATE_LIMIT') {
          retryCountRef.current++;
          await new Promise((resolve) => setTimeout(resolve, 2000 * retryCountRef.current));
          return generateContent(prompt, customConfig);
        }

        throw errorInfo;
      } finally {
        setLoading(false);
        abortControllerRef.current = null;
      }
    },
    [modelType, stream, autoRetry]
  );

  /**
   * Genera contenido con imágenes (Gemini Vision)
   */
  const generateContentWithImage = useCallback(async (prompt, imageData) => {
    setLoading(true);
    setError(null);
    setResponse(null);

    const startTime = Date.now();

    try {
      const model = geminiModels.vision;

      // Preparar datos de imagen
      const imagePart = {
        inlineData: {
          data: imageData.split(',')[1], // Remover data:image/...;base64,
          mimeType: 'image/jpeg',
        },
      };

      const result = await model.generateContent([prompt, imagePart]);
      const text = result.response.text();

      setResponse(text);

      // Log analytics
      const latency = Date.now() - startTime;
      logGeminiUsage('vision', text.length / 4, latency);
      trackAIRequest('gemini-vision', 'vision', latency, true);

      return text;
    } catch (err) {
      console.error('Error en generateContentWithImage:', err);

      const errorInfo = handleGeminiError(err);
      setError(errorInfo);

      const latency = Date.now() - startTime;
      trackAIRequest('gemini-vision', 'vision', latency, false);

      throw errorInfo;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Chat conversacional (mantiene historial)
   */
  const [chatHistory, setChatHistory] = useState([]);

  const chat = useCallback(
    async (message) => {
      setLoading(true);
      setError(null);

      const startTime = Date.now();

      try {
        const model = geminiModels[modelType] || geminiModels.balanced;

        // Crear contexto del chat
        const history = chatHistory.map((msg) => ({
          role: msg.role,
          parts: [{ text: msg.content }],
        }));

        const chatSession = model.startChat({
          history,
        });

        const result = await chatSession.sendMessage(message);
        const text = result.response.text();

        // Actualizar historial
        setChatHistory((prev) => [
          ...prev,
          { role: 'user', content: message },
          { role: 'model', content: text },
        ]);

        setResponse(text);

        // Log analytics
        const latency = Date.now() - startTime;
        logGeminiUsage(`${modelType}-chat`, text.length / 4, latency);
        trackAIRequest('gemini-chat', modelType, latency, true);

        return text;
      } catch (err) {
        console.error('Error en chat:', err);

        const errorInfo = handleGeminiError(err);
        setError(errorInfo);

        const latency = Date.now() - startTime;
        trackAIRequest('gemini-chat', modelType, latency, false);

        throw errorInfo;
      } finally {
        setLoading(false);
      }
    },
    [modelType, chatHistory]
  );

  /**
   * Cancelar request en progreso
   */
  const cancel = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setLoading(false);
      setError({ success: false, error: 'Request cancelado', code: 'CANCELLED' });
    }
  }, []);

  /**
   * Reset completo
   */
  const reset = useCallback(() => {
    setLoading(false);
    setError(null);
    setResponse(null);
    setStreamingText('');
    setChatHistory([]);
    retryCountRef.current = 0;
  }, []);

  return {
    // Estado
    loading,
    error,
    response,
    streamingText,
    chatHistory,

    // Métodos
    generateContent,
    generateContentWithImage,
    chat,
    cancel,
    reset,

    // Helpers
    isStreaming: stream && loading,
    hasError: !!error,
  };
};

/**
 * Hook simplificado para uso rápido
 */
export const useGeminiQuick = () => {
  return useGemini({ modelType: 'balanced', stream: false });
};

/**
 * Hook para chat conversacional
 */
export const useGeminiChat = () => {
  return useGemini({ modelType: 'balanced' });
};

/**
 * Hook para análisis de imágenes
 */
export const useGeminiVision = () => {
  const hook = useGemini({ modelType: 'balanced' });

  return {
    ...hook,
    analyzeImage: hook.generateContentWithImage,
  };
};

export default useGemini;
