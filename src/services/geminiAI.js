/**
 * ====================================
 * GEMINI AI - SERVICIO CENTRALIZADO
 * ====================================
 * Métodos de alto nivel para usar Gemini
 * en todo el ecosistema premium
 */
import { geminiModels, handleGeminiError, logGeminiUsage } from '@/lib/gemini/config';

import { trackAIRequest } from './analytics';

/**
 * Servicio centralizado de IA con Gemini
 */
class GeminiAIService {
  /**
   * ==========================================
   * ANÁLISIS DE TEXTO
   * ==========================================
   */

  /**
   * Analiza texto y proporciona insights
   */
  static async analyzeText(text, context = '') {
    const startTime = Date.now();

    try {
      const prompt = `Analiza el siguiente texto y proporciona insights clave, sentimiento y resumen:

${context ? `Contexto: ${context}\n` : ''}
Texto a analizar:
${text}

Proporciona:
1. Sentimiento general (positivo/neutral/negativo)
2. Temas principales
3. Insights clave
4. Resumen breve`;

      const model = geminiModels.precise;
      const result = await model.generateContent(prompt);
      const response = result.response.text();

      const latency = Date.now() - startTime;
      logGeminiUsage('analyze-text', response.length / 4, latency);
      trackAIRequest('gemini-analyze', 'precise', latency, true);

      return {
        success: true,
        analysis: response,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      const latency = Date.now() - startTime;
      trackAIRequest('gemini-analyze', 'precise', latency, false);
      return handleGeminiError(error);
    }
  }

  /**
   * Análisis de sentimiento avanzado
   */
  static async analyzeSentiment(text) {
    const startTime = Date.now();

    try {
      const prompt = `Analiza el sentimiento del siguiente texto y dame un resultado estructurado:

Texto: ${text}

Responde en formato JSON:
{
  "sentiment": "positivo/neutral/negativo",
  "score": 0-100,
  "confidence": 0-100,
  "emotions": ["emoción1", "emoción2"],
  "reasoning": "explicación breve"
}`;

      const model = geminiModels.precise;
      const result = await model.generateContent(prompt);
      const response = result.response.text();

      // Intentar parsear JSON
      let sentimentData;
      try {
        const jsonMatch = response.match(/\{[\s\S]*\}/);
        sentimentData = JSON.parse(jsonMatch[0]);
      } catch {
        sentimentData = { raw: response };
      }

      const latency = Date.now() - startTime;
      logGeminiUsage('sentiment', response.length / 4, latency);

      return {
        success: true,
        sentiment: sentimentData,
      };
    } catch (error) {
      return handleGeminiError(error);
    }
  }

  /**
   * ==========================================
   * GENERACIÓN DE CONTENIDO
   * ==========================================
   */

  /**
   * Genera descripción de producto para ventas
   */
  static async generateProductDescription(productInfo) {
    const startTime = Date.now();

    try {
      const prompt = `Genera una descripción de venta persuasiva y profesional para el siguiente producto:

${productInfo}

La descripción debe:
- Ser atractiva y persuasiva
- Destacar beneficios clave
- Incluir call-to-action
- Ser optimizada para SEO
- Longitud: 150-200 palabras`;

      const model = geminiModels.creative;
      const result = await model.generateContent(prompt);
      const response = result.response.text();

      const latency = Date.now() - startTime;
      logGeminiUsage('product-description', response.length / 4, latency);

      return {
        success: true,
        description: response,
      };
    } catch (error) {
      return handleGeminiError(error);
    }
  }

  /**
   * Genera email personalizado
   */
  static async generateEmail(type, recipientInfo, context) {
    const startTime = Date.now();

    try {
      const prompt = `Genera un email profesional de tipo "${type}".

Información del destinatario:
${recipientInfo}

Contexto adicional:
${context}

El email debe ser:
- Profesional y cordial
- Personalizado
- Claro y conciso
- Con saludo y despedida apropiados`;

      const model = geminiModels.creative;
      const result = await model.generateContent(prompt);
      const response = result.response.text();

      const latency = Date.now() - startTime;
      logGeminiUsage('email-generation', response.length / 4, latency);

      return {
        success: true,
        email: response,
      };
    } catch (error) {
      return handleGeminiError(error);
    }
  }

  /**
   * ==========================================
   * CRM Y VENTAS
   * ==========================================
   */

  /**
   * Resume conversación de cliente
   */
  static async summarizeConversation(messages, maxLength = 200) {
    const startTime = Date.now();

    try {
      const conversationText = messages.map((msg) => `${msg.sender}: ${msg.text}`).join('\n');

      const prompt = `Resume la siguiente conversación en máximo ${maxLength} palabras:

${conversationText}

Incluye:
- Puntos clave discutidos
- Acciones acordadas
- Próximos pasos
- Tono de la conversación`;

      const model = geminiModels.summary;
      const result = await model.generateContent(prompt);
      const response = result.response.text();

      const latency = Date.now() - startTime;
      logGeminiUsage('conversation-summary', response.length / 4, latency);

      return {
        success: true,
        summary: response,
      };
    } catch (error) {
      return handleGeminiError(error);
    }
  }

  /**
   * Genera sugerencias de respuesta para cliente
   */
  static async suggestResponses(customerMessage, context) {
    const startTime = Date.now();

    try {
      const prompt = `El cliente escribió: "${customerMessage}"

Contexto: ${context}

Genera 3 respuestas profesionales diferentes:
1. Respuesta formal
2. Respuesta amigable
3. Respuesta breve

Cada respuesta debe ser útil y profesional.`;

      const model = geminiModels.creative;
      const result = await model.generateContent(prompt);
      const response = result.response.text();

      const latency = Date.now() - startTime;
      logGeminiUsage('response-suggestions', response.length / 4, latency);

      return {
        success: true,
        suggestions: response,
      };
    } catch (error) {
      return handleGeminiError(error);
    }
  }

  /**
   * ==========================================
   * ANÁLISIS Y PREDICCIONES
   * ==========================================
   */

  /**
   * Analiza datos y predice tendencias
   */
  static async predictTrends(data, dataType = 'ventas') {
    const startTime = Date.now();

    try {
      const prompt = `Analiza los siguientes datos de ${dataType} y predice tendencias:

Datos:
${JSON.stringify(data, null, 2)}

Proporciona:
1. Tendencias identificadas
2. Predicciones para los próximos 3 meses
3. Factores clave que influyen
4. Recomendaciones estratégicas`;

      const model = geminiModels.precise;
      const result = await model.generateContent(prompt);
      const response = result.response.text();

      const latency = Date.now() - startTime;
      logGeminiUsage('trend-prediction', response.length / 4, latency);

      return {
        success: true,
        prediction: response,
      };
    } catch (error) {
      return handleGeminiError(error);
    }
  }

  /**
   * Genera insights de datos analíticos
   */
  static async generateInsights(analyticsData) {
    const startTime = Date.now();

    try {
      const prompt = `Analiza estos datos analíticos y genera insights accionables:

${JSON.stringify(analyticsData, null, 2)}

Proporciona:
1. Insights clave (top 5)
2. Oportunidades de mejora
3. Métricas que requieren atención
4. Recomendaciones específicas`;

      const model = geminiModels.precise;
      const result = await model.generateContent(prompt);
      const response = result.response.text();

      const latency = Date.now() - startTime;
      logGeminiUsage('analytics-insights', response.length / 4, latency);

      return {
        success: true,
        insights: response,
      };
    } catch (error) {
      return handleGeminiError(error);
    }
  }

  /**
   * ==========================================
   * CÓDIGO Y DESARROLLO
   * ==========================================
   */

  /**
   * Genera código basado en descripción
   */
  static async generateCode(description, language = 'javascript') {
    const startTime = Date.now();

    try {
      const prompt = `Genera código en ${language} para:

${description}

Requisitos:
- Código limpio y bien documentado
- Buenas prácticas
- Manejo de errores
- Comentarios explicativos`;

      const model = geminiModels.code;
      const result = await model.generateContent(prompt);
      const response = result.response.text();

      const latency = Date.now() - startTime;
      logGeminiUsage('code-generation', response.length / 4, latency);

      return {
        success: true,
        code: response,
      };
    } catch (error) {
      return handleGeminiError(error);
    }
  }

  /**
   * Explica código existente
   */
  static async explainCode(code) {
    const startTime = Date.now();

    try {
      const prompt = `Explica el siguiente código de manera clara y detallada:

\`\`\`
${code}
\`\`\`

Incluye:
1. Qué hace el código
2. Cómo funciona
3. Posibles mejoras
4. Casos de uso`;

      const model = geminiModels.code;
      const result = await model.generateContent(prompt);
      const response = result.response.text();

      const latency = Date.now() - startTime;
      logGeminiUsage('code-explanation', response.length / 4, latency);

      return {
        success: true,
        explanation: response,
      };
    } catch (error) {
      return handleGeminiError(error);
    }
  }

  /**
   * ==========================================
   * UTILIDADES
   * ==========================================
   */

  /**
   * Traduce texto
   */
  static async translate(text, targetLanguage = 'español') {
    const startTime = Date.now();

    try {
      const prompt = `Traduce el siguiente texto a ${targetLanguage} de manera natural y profesional:

${text}`;

      const model = geminiModels.balanced;
      const result = await model.generateContent(prompt);
      const response = result.response.text();

      const latency = Date.now() - startTime;
      logGeminiUsage('translation', response.length / 4, latency);

      return {
        success: true,
        translation: response,
      };
    } catch (error) {
      return handleGeminiError(error);
    }
  }

  /**
   * Genera resumen de texto largo
   */
  static async summarize(text, maxLength = 100) {
    const startTime = Date.now();

    try {
      const prompt = `Resume el siguiente texto en máximo ${maxLength} palabras:

${text}`;

      const model = geminiModels.summary;
      const result = await model.generateContent(prompt);
      const response = result.response.text();

      const latency = Date.now() - startTime;
      logGeminiUsage('summarization', response.length / 4, latency);

      return {
        success: true,
        summary: response,
      };
    } catch (error) {
      return handleGeminiError(error);
    }
  }

  /**
   * Mejora texto (corrección y estilo)
   */
  static async improveText(text, style = 'profesional') {
    const startTime = Date.now();

    try {
      const prompt = `Mejora el siguiente texto para que sea más ${style}:

${text}

Mantén el significado original pero mejora:
- Gramática
- Claridad
- Tono
- Estructura`;

      const model = geminiModels.creative;
      const result = await model.generateContent(prompt);
      const response = result.response.text();

      const latency = Date.now() - startTime;
      logGeminiUsage('text-improvement', response.length / 4, latency);

      return {
        success: true,
        improvedText: response,
      };
    } catch (error) {
      return handleGeminiError(error);
    }
  }
}

export default GeminiAIService;
