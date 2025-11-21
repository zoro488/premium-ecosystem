/**
 * 🧠 AI ENGINE - Motor de Inteligencia Artificial
 * ==============================================
 *
 * Integración con:
 * - Ollama (local, privado, rápido)
 * - OpenAI GPT-4 (fallback)
 * - Anthropic Claude (opcional)
 */

export class AIEngine {
  constructor(config) {
    this.config = {
      model: config.model || 'llama3.1',
      fallbackModel: config.fallbackModel || 'gpt-4-turbo',
      temperature: config.temperature || 0.7,
      maxTokens: config.maxTokens || 2000,
      context: config.context || {},
      ollamaUrl: config.ollamaUrl || 'http://localhost:11434',
      openaiKey: config.openaiKey || import.meta.env.VITE_OPENAI_API_KEY,
    };
  }

  /**
   * Generar respuesta usando LLM
   */
  async generateResponse(userMessage, context) {
    try {
      // Intentar con Ollama primero (local)
      const response = await this.queryOllama(userMessage, context);
      return response;
    } catch (error) {
      console.warn('⚠️ Ollama failed, falling back to OpenAI:', error.message);

      try {
        // Fallback a OpenAI
        const response = await this.queryOpenAI(userMessage, context);
        return response;
      } catch (fallbackError) {
        console.error('❌ Both AI engines failed:', fallbackError);
        return {
          text: 'Lo siento, no pude procesar tu solicitud en este momento. Los servicios de IA no están disponibles.',
          type: 'error',
        };
      }
    }
  }

  /**
   * Query Ollama (local LLM)
   */
  async queryOllama(userMessage, context) {
    const prompt = this.buildPrompt(userMessage, context);

    const response = await fetch(`${this.config.ollamaUrl}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: this.config.model,
        prompt,
        stream: false,
        options: {
          temperature: this.config.temperature,
          num_predict: this.config.maxTokens,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Ollama error: ${response.statusText}`);
    }

    const data = await response.json();

    return {
      text: data.response.trim(),
      type: 'success',
      model: this.config.model,
      tokens: data.eval_count,
    };
  }

  /**
   * Query OpenAI GPT-4 (fallback)
   */
  async queryOpenAI(userMessage, context) {
    if (!this.config.openaiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const messages = [
      {
        role: 'system',
        content: this.buildSystemPrompt(context),
      },
      {
        role: 'user',
        content: userMessage,
      },
    ];

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.config.openaiKey}`,
      },
      body: JSON.stringify({
        model: this.config.fallbackModel,
        messages,
        temperature: this.config.temperature,
        max_tokens: this.config.maxTokens,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI error: ${response.statusText}`);
    }

    const data = await response.json();

    return {
      text: data.choices[0].message.content.trim(),
      type: 'success',
      model: this.config.fallbackModel,
      tokens: data.usage.total_tokens,
    };
  }

  /**
   * Análisis inteligente de datos
   */
  async analyze({ query, data, stats }) {
    const prompt = `
Eres un analista financiero experto en retail. Analiza los siguientes datos y responde la pregunta del usuario.

CONTEXTO:
- Aplicación: FlowDistributor (sistema de gestión)
- Registros GYA: ${stats.totalGYA}
- Ventas: ${stats.totalVentas}
- Clientes: ${stats.totalClientes}
- Distribuidores: ${stats.totalDistribuidores}

DATOS RECIENTES:
${JSON.stringify(data, null, 2)}

PREGUNTA DEL USUARIO:
${query}

INSTRUCCIONES:
1. Analiza los datos proporcionados
2. Identifica patrones, tendencias o anomalías
3. Proporciona insights accionables
4. Si aplica, da recomendaciones específicas
5. Usa lenguaje claro y profesional
6. Incluye números y porcentajes cuando sea relevante

FORMATO DE RESPUESTA:
[Tu análisis aquí, en español, con bullet points y formato claro]

RECOMENDACIONES (si aplica):
[Sugerencias accionables]
`;

    try {
      const response = await this.queryOllama(prompt, {});

      // Parsear la respuesta para extraer insights y recomendaciones
      const text = response.text;
      const parts = text.split('RECOMENDACIONES');

      return {
        insights: parts[0].trim(),
        recommendations: parts[1]?.trim() || null,
        raw: text,
      };
    } catch (error) {
      // Fallback a OpenAI
      const response = await this.queryOpenAI(prompt, {});
      const text = response.text;
      const parts = text.split('RECOMENDACIONES');

      return {
        insights: parts[0].trim(),
        recommendations: parts[1]?.trim() || null,
        raw: text,
      };
    }
  }

  /**
   * Construir prompt con contexto
   */
  buildPrompt(userMessage, context) {
    return `
Eres un asistente inteligente para FlowDistributor, un sistema de gestión empresarial.

CONTEXTO:
- Panel actual: ${context.currentPanel || 'Dashboard'}
- Usuario: ${this.config.context.user || 'Admin'}
- Datos disponibles: GYA (${context.stats?.totalGYA || 0}), Ventas (${context.stats?.totalVentas || 0}), Clientes (${context.stats?.totalClientes || 0})

CAPACIDADES:
- Navegar entre paneles
- Crear registros (gastos, ventas, etc.)
- Consultar datos y estadísticas
- Generar reportes y visualizaciones
- Análisis y predicciones

MENSAJE DEL USUARIO:
${userMessage}

Responde de manera clara, concisa y útil. Si necesitas más información, pregúntala. Si puedes ejecutar una acción, indícalo claramente.
`;
  }

  /**
   * System prompt para OpenAI
   */
  buildSystemPrompt(context) {
    return `Eres un asistente inteligente para FlowDistributor, especializado en gestión empresarial, análisis financiero y retail.

CONTEXTO:
- Panel: ${context.currentPanel}
- App: ${this.config.context.appName}
- Datos: ${JSON.stringify(context.stats)}

CAPACIDADES:
• Navegar entre paneles
• Crear/editar registros
• Análisis de datos
• Reportes y visualizaciones
• Predicciones y recomendaciones

Responde en español, de forma clara y profesional.`;
  }
}
