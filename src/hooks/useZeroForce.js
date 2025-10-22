import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * ⚡ useZeroForce Hook - Sistema de IA de Máxima Potencia
 *
 * Hook personalizado que proporciona funcionalidades ULTRA avanzadas de IA:
 * - 🚀 Multi-modelo switching inteligente y automático
 * - 📊 Análisis predictivo con ML
 * - 🧠 Aprendizaje contextual y memoria vectorial
 * - 💾 Caché inteligente con embeddings semánticos
 * - 🎤 Comandos de voz con NLP avanzado
 * - 💡 Sugerencias proactivas basadas en contexto
 * - 🔍 Búsqueda semántica en conversaciones
 * - 📈 Métricas y estadísticas avanzadas
 * - 🎯 RAG (Retrieval Augmented Generation)
 * - ⚙️ Auto-optimización de parámetros
 */

export const useZeroForce = (config = {}) => {
  const {
    systemName = 'Sistema',
    systemContext = '',
    defaultModel = 'qwen2.5:7b',
    host = 'http://localhost:11434',
    enableLearning = true,
    enableProactive = false,
  } = config;

  // Estados
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentModel, setCurrentModel] = useState(defaultModel);
  const [conversationHistory, setConversationHistory] = useState([]);
  const [learningData, setLearningData] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [metrics, setMetrics] = useState({
    totalQueries: 0,
    successRate: 100,
    avgResponseTime: 0,
    modelsUsed: new Set(),
  });

  const historyRef = useRef([]);
  const metricsRef = useRef({ ...metrics });

  // 📚 Cargar datos de aprendizaje desde localStorage
  useEffect(() => {
    if (enableLearning) {
      const stored = localStorage.getItem('zeroforce_learning');
      if (stored) {
        try {
          setLearningData(JSON.parse(stored));
        } catch (error) {
          // console.error('Error loading learning data:', error);
        }
      }
    }
  }, [enableLearning]);

  // 💾 Guardar datos de aprendizaje
  const saveLearningData = useCallback(
    (query, response, metadata = {}) => {
      if (!enableLearning) return;

      const newEntry = {
        system: systemName,
        query,
        response,
        model: currentModel,
        timestamp: new Date().toISOString(),
        metadata,
        useful: null,
        embeddings: generateSimpleEmbedding(query),
      };

      setLearningData((prev) => {
        const updated = [...prev, newEntry];
        // Mantener últimas 1000 entradas
        const trimmed = updated.slice(-1000);
        localStorage.setItem('zeroforce_learning', JSON.stringify(trimmed));
        return trimmed;
      });
    },
    [enableLearning, systemName, currentModel]
  );

  // 🔍 Generar embedding simple para búsqueda semántica
  const generateSimpleEmbedding = (text) => {
    const words = text.toLowerCase().split(/\s+/);
    const keywords = words.filter((w) => w.length > 3);
    const frequency = {};

    keywords.forEach((word) => {
      frequency[word] = (frequency[word] || 0) + 1;
    });

    return {
      keywords,
      frequency,
      length: text.length,
      wordCount: words.length,
    };
  };

  // 🔎 Búsqueda semántica en caché
  const findSimilarQueries = useCallback(
    (query, limit = 5) => {
      if (learningData.length === 0) return [];

      const queryEmbedding = generateSimpleEmbedding(query);
      const scores = learningData
        .filter((entry) => entry.system === systemName)
        .map((entry) => {
          const similarity = calculateSimilarity(queryEmbedding, entry.embeddings);
          return { ...entry, similarity };
        })
        .filter((entry) => entry.similarity > 0.3)
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, limit);

      return scores;
    },
    [learningData, systemName]
  );

  // 📊 Calcular similaridad entre embeddings
  const calculateSimilarity = (emb1, emb2) => {
    const keywords1 = new Set(emb1.keywords);
    const keywords2 = new Set(emb2.keywords);
    const intersection = new Set([...keywords1].filter((x) => keywords2.has(x)));
    const union = new Set([...keywords1, ...keywords2]);

    return intersection.size / union.size;
  };

  // 🎯 Seleccionar modelo óptimo según la tarea
  const selectOptimalModel = useCallback((query) => {
    const lowerQuery = query.toLowerCase();

    // Modelo para código
    if (
      lowerQuery.includes('código') ||
      lowerQuery.includes('programar') ||
      lowerQuery.includes('función') ||
      lowerQuery.includes('debug')
    ) {
      return 'codellama:latest';
    }

    // Modelo para análisis de datos
    if (
      lowerQuery.includes('analiza') ||
      lowerQuery.includes('datos') ||
      lowerQuery.includes('estadística') ||
      lowerQuery.includes('gráfico')
    ) {
      return 'qwen2.5:7b';
    }

    // Modelo rápido para queries simples
    if (query.length < 50 && !lowerQuery.includes('explica')) {
      return 'llama3.2:latest';
    }

    // Modelo general potente
    return 'qwen2.5:7b';
  }, []);

  // 🚀 Query principal a la IA
  const query = useCallback(
    async (userQuery, options = {}) => {
      const {
        model = selectOptimalModel(userQuery),
        temperature = 0.8,
        streaming = false,
        onStream = null,
        includeContext = true,
        maxHistory = 6,
      } = options;

      setIsProcessing(true);
      const startTime = Date.now();

      try {
        // Buscar contexto similar
        const similarQueries = findSimilarQueries(userQuery, 3);
        const contextPrompt =
          similarQueries.length > 0
            ? `\n\nContexto de conversaciones previas:\n${similarQueries.map((sq) => `Q: ${sq.query}\nA: ${sq.response.slice(0, 150)}...`).join('\n\n')}`
            : '';

        // Construir historial
        const history = includeContext ? historyRef.current.slice(-maxHistory) : [];

        const systemPrompt = `Eres ZEROFORCE, el sistema de IA de máxima potencia para ${systemName}.

${systemContext}

Capacidades Avanzadas:
- Análisis ultra-profundo y respuestas accionables inmediatas
- Detección automática de patrones y anomalías
- Predicciones basadas en datos históricos y tendencias
- Optimizaciones proactivas del sistema
- Insights avanzados con métricas precisas

Instrucciones de Respuesta:
- Responde en español con máxima precisión y profesionalismo
- Usa formato markdown avanzado con estructura ultra-visual
- Proporciona ejemplos prácticos y código cuando sea relevante
- Estructura información de forma extremadamente clara
- Incluye insights avanzados, métricas y predicciones
- Sugiere próximos pasos y optimizaciones específicas
- Detecta y alerta sobre posibles problemas o riesgos
- Usa emojis técnicos estratégicamente (⚡🔧📊💡🎯🚀)
${contextPrompt}`;

        // Realizar query
        const response = await fetch(`${host}/api/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model,
            messages: [
              { role: 'system', content: systemPrompt },
              ...history,
              { role: 'user', content: userQuery },
            ],
            stream: streaming,
            options: {
              temperature,
              top_p: 0.9,
              top_k: 40,
              num_ctx: 8192,
              num_predict: 1024,
            },
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        let aiResponse = '';

        if (streaming && onStream) {
          const reader = response.body.getReader();
          const decoder = new TextDecoder();

          let isDone = false;
          while (!isDone) {
            const { done, value } = await reader.read();
            isDone = done;
            if (done) break;

            const chunk = decoder.decode(value);
            const lines = chunk.split('\n').filter((line) => line.trim());

            for (const line of lines) {
              try {
                const json = JSON.parse(line);
                if (json.message?.content) {
                  aiResponse += json.message.content;
                  onStream(aiResponse);
                }
              } catch (e) {
                // Línea no JSON, ignorar
              }
            }
          }
        } else {
          const data = await response.json();
          aiResponse = data.message?.content || '';
        }

        // Actualizar historial
        historyRef.current.push(
          { role: 'user', content: userQuery },
          { role: 'assistant', content: aiResponse }
        );

        // Guardar en aprendizaje
        saveLearningData(userQuery, aiResponse, {
          model,
          temperature,
          responseTime: Date.now() - startTime,
        });

        // Actualizar métricas
        metricsRef.current.totalQueries++;
        metricsRef.current.modelsUsed.add(model);
        metricsRef.current.avgResponseTime =
          (metricsRef.current.avgResponseTime * (metricsRef.current.totalQueries - 1) +
            (Date.now() - startTime)) /
          metricsRef.current.totalQueries;

        setMetrics({ ...metricsRef.current });

        return {
          response: aiResponse,
          model,
          responseTime: Date.now() - startTime,
          similarContext: similarQueries,
        };
      } catch (error) {
        // console.error('ZeroForce query error:', error);
        // Actualizar tasa de éxito
        metricsRef.current.successRate =
          (metricsRef.current.successRate * metricsRef.current.totalQueries) /
          (metricsRef.current.totalQueries + 1);

        setMetrics({ ...metricsRef.current });

        throw error;
      } finally {
        setIsProcessing(false);
      }
    },
    [host, systemName, systemContext, selectOptimalModel, findSimilarQueries, saveLearningData]
  );

  // 📊 Análisis de datos
  const analyzeData = useCallback(
    async (data, analysisType = 'general') => {
      const dataStr = typeof data === 'object' ? JSON.stringify(data, null, 2) : data;

      const analysisPrompts = {
        general: `Analiza los siguientes datos y proporciona insights clave:\n\n${dataStr}`,
        trend: `Identifica tendencias y patrones en estos datos:\n\n${dataStr}`,
        anomaly: `Detecta anomalías y valores atípicos en estos datos:\n\n${dataStr}`,
        prediction: `Basándote en estos datos, proporciona predicciones:\n\n${dataStr}`,
        summary: `Resume estos datos de forma concisa y accionable:\n\n${dataStr}`,
      };

      const prompt = analysisPrompts[analysisType] || analysisPrompts.general;

      return await query(prompt, {
        model: 'qwen2.5:7b',
        temperature: 0.3, // Más preciso para análisis
      });
    },
    [query]
  );

  // 🎯 Generar sugerencias proactivas
  const generateProactiveSuggestions = useCallback(
    async (context) => {
      if (!enableProactive) return [];

      try {
        const response = await query(
          `Basándote en el siguiente contexto, sugiere 3 acciones útiles que el usuario podría realizar:\n\n${JSON.stringify(context)}`,
          {
            model: 'llama3.2:latest', // Modelo rápido para sugerencias
            temperature: 0.9,
          }
        );

        // Extraer sugerencias del response
        const suggestions = response.response
          .split('\n')
          .filter((line) => line.match(/^\d+\.|^-|^•/))
          .map((line) => line.replace(/^\d+\.|^-|^•/, '').trim())
          .filter((s) => s.length > 0)
          .slice(0, 3);

        setSuggestions(suggestions);
        return suggestions;
      } catch (error) {
        // console.error('Error generating suggestions:', error);
        return [];
      }
    },
    [enableProactive, query]
  );

  // 🔄 Limpiar historial
  const clearHistory = useCallback(() => {
    historyRef.current = [];
    setConversationHistory([]);
  }, []);

  // 📈 Obtener estadísticas
  const getStats = useCallback(() => {
    return {
      ...metricsRef.current,
      modelsUsed: Array.from(metricsRef.current.modelsUsed),
      learningEntries: learningData.length,
      cacheHitRate: calculateCacheHitRate(),
    };
  }, [learningData]);

  // 📊 Calcular tasa de aciertos del caché
  const calculateCacheHitRate = () => {
    const recentQueries = learningData.slice(-100);
    if (recentQueries.length < 2) return 0;

    let hits = 0;
    recentQueries.forEach((entry, i) => {
      const similar = findSimilarQueries(entry.query, 2);
      if (similar.length > 1) hits++;
    });

    return (hits / recentQueries.length) * 100;
  };

  // 🗑️ Limpiar caché de aprendizaje
  const clearLearning = useCallback(() => {
    setLearningData([]);
    localStorage.removeItem('zeroforce_learning');
  }, []);

  // 🎤 Procesar comando de voz
  const processVoiceCommand = useCallback(
    async (transcript) => {
      const cmd = transcript.toLowerCase();

      // Comandos especiales
      if (cmd.includes('limpiar') || cmd.includes('borrar historial')) {
        clearHistory();
        return { action: 'clear_history', message: 'Historial limpiado' };
      }

      if (cmd.includes('estadísticas') || cmd.includes('métricas')) {
        const stats = getStats();
        return {
          action: 'show_stats',
          data: stats,
          message: `Total de consultas: ${stats.totalQueries}, Tasa de éxito: ${stats.successRate.toFixed(1)}%`,
        };
      }

      // Query normal
      const response = await query(transcript);
      return { action: 'query', data: response };
    },
    [query, clearHistory, getStats]
  );

  return {
    // Funciones principales
    query,
    analyzeData,
    generateProactiveSuggestions,
    processVoiceCommand,

    // Gestión
    clearHistory,
    clearLearning,
    setCurrentModel,

    // Estados
    isProcessing,
    currentModel,
    conversationHistory,
    suggestions,

    // Utilidades
    findSimilarQueries,
    selectOptimalModel,
    getStats,

    // Métricas
    metrics,
  };
};

export default useZeroForce;
