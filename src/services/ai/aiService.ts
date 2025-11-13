/**
 * 🤖 SERVICIO AI - INTEGRACIÓN OPENAI + OLLAMA
 *
 * Sistema completo de inteligencia artificial para FlowDistributor:
 * - Chat conversacional con contexto financiero
 * - Análisis predictivo de ventas y gastos
 * - Detección de anomalías en transacciones
 * - Generación de insights automáticos
 * - Recomendaciones inteligentes
 * - Soporte multi-modelo (OpenAI GPT-4, Ollama local)
 */
import { z } from 'zod';

// ============================================================================
// TIPOS Y SCHEMAS
// ============================================================================

/**
 * Configuración de modelos AI disponibles
 */
export const AI_MODELS = {
  // OpenAI Models
  GPT4_TURBO: 'gpt-4-turbo-preview',
  GPT4: 'gpt-4',
  GPT35_TURBO: 'gpt-3.5-turbo',

  // Ollama Local Models
  LLAMA3: 'llama3',
  MISTRAL: 'mistral',
  CODELLAMA: 'codellama',
} as const;

export type AIModel = (typeof AI_MODELS)[keyof typeof AI_MODELS];

/**
 * Schema de mensaje de chat
 */
export const chatMessageSchema = z.object({
  role: z.enum(['system', 'user', 'assistant']),
  content: z.string(),
  timestamp: z.string().optional(),
  metadata: z.record(z.any()).optional(),
});

export type ChatMessage = z.infer<typeof chatMessageSchema>;

/**
 * Schema de análisis financiero
 */
export const financialAnalysisSchema = z.object({
  periodo: z.string(),
  ingresosTotales: z.number(),
  gastosTotales: z.number(),
  utilidadNeta: z.number(),
  margenUtilidad: z.number(),
  tendencia: z.enum(['alcista', 'bajista', 'estable']),
  prediccion: z.object({
    ingresosSiguienteMes: z.number(),
    gastosSiguienteMes: z.number(),
    confianza: z.number().min(0).max(1),
  }),
  insights: z.array(z.string()),
  recomendaciones: z.array(z.string()),
  alertas: z.array(
    z.object({
      tipo: z.enum(['critica', 'advertencia', 'info']),
      mensaje: z.string(),
      accion: z.string().optional(),
    })
  ),
});

export type FinancialAnalysis = z.infer<typeof financialAnalysisSchema>;

/**
 * Schema de detección de anomalías
 */
export const anomalyDetectionSchema = z.object({
  transaccionId: z.string(),
  tipo: z.string(),
  monto: z.number(),
  fecha: z.string(),
  esAnomalia: z.boolean(),
  puntuacionAnomalia: z.number().min(0).max(1),
  razon: z.string(),
  severidad: z.enum(['baja', 'media', 'alta', 'critica']),
  accionRecomendada: z.string(),
});

export type AnomalyDetection = z.infer<typeof anomalyDetectionSchema>;

// ============================================================================
// CONFIGURACIÓN
// ============================================================================

interface AIServiceConfig {
  openaiApiKey?: string;
  ollamaBaseUrl?: string;
  defaultModel: AIModel;
  temperature: number;
  maxTokens: number;
  enableLocalFallback: boolean;
}

const DEFAULT_CONFIG: AIServiceConfig = {
  openaiApiKey: import.meta.env.VITE_OPENAI_API_KEY || '',
  ollamaBaseUrl: import.meta.env.VITE_OLLAMA_BASE_URL || 'http://localhost:11434',
  defaultModel: AI_MODELS.GPT4_TURBO,
  temperature: 0.7,
  maxTokens: 2000,
  enableLocalFallback: true,
};

// ============================================================================
// CLASE PRINCIPAL DEL SERVICIO AI
// ============================================================================

class AIService {
  private config: AIServiceConfig;
  private conversationHistory: ChatMessage[] = [];
  private systemPrompt: string;

  constructor(config: Partial<AIServiceConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.systemPrompt = this.buildSystemPrompt();
  }

  /**
   * Construye el prompt del sistema con contexto de FlowDistributor
   */
  private buildSystemPrompt(): string {
    return `Eres un asistente financiero experto especializado en FlowDistributor, un sistema de gestión empresarial.

CONTEXTO DEL SISTEMA:
- FlowDistributor gestiona 7 bancos: Bóveda Monte, Bóveda USA, Azteca, Banorte, Utilidades, Guardadito, Miel
- Tipos de transacciones: Ventas, Compras, Gastos, Ingresos, Transferencias
- El sistema maneja distribuidores, clientes, órdenes de compra, cortes de caja y conciliaciones

TUS CAPACIDADES:
1. Análisis financiero profundo (ingresos, gastos, utilidades, márgenes)
2. Predicciones de flujo de caja basadas en patrones históricos
3. Detección de anomalías en transacciones (montos inusuales, patrones sospechosos)
4. Generación de insights accionables y recomendaciones estratégicas
5. Respuestas en lenguaje natural claro y profesional en español

DIRECTRICES:
- Siempre responde en español mexicano profesional
- Usa formato estructurado con bullet points para claridad
- Incluye números y métricas cuando sea relevante
- Sé proactivo sugiriendo acciones específicas
- Si detectas algo crítico, márcalo claramente como ⚠️ ALERTA
- Para predicciones, siempre indica el nivel de confianza

FORMATO DE RESPUESTA PREFERIDO:
📊 **Análisis:** [tu análisis aquí]
💡 **Insights:** [puntos clave]
🎯 **Recomendaciones:** [acciones sugeridas]
⚠️ **Alertas:** [si hay algo crítico]

Responde siempre de manera profesional, precisa y útil.`;
  }

  /**
   * Envía mensaje al modelo de chat (OpenAI o Ollama)
   */
  async chat(
    userMessage: string,
    options?: {
      model?: AIModel;
      includeHistory?: boolean;
      financialContext?: Record<string, any>;
    }
  ): Promise<string> {
    const model = options?.model || this.config.defaultModel;
    const includeHistory = options?.includeHistory ?? true;

    // Agregar mensaje del usuario al historial
    const userMsg: ChatMessage = {
      role: 'user',
      content: userMessage,
      timestamp: new Date().toISOString(),
    };

    if (includeHistory) {
      this.conversationHistory.push(userMsg);
    }

    // Construir mensajes para la API
    const messages: ChatMessage[] = [
      { role: 'system', content: this.systemPrompt },
      ...(includeHistory ? this.conversationHistory : [userMsg]),
    ];

    // Agregar contexto financiero si está disponible
    if (options?.financialContext) {
      messages.push({
        role: 'system',
        content: `Contexto financiero actual:\n${JSON.stringify(options.financialContext, null, 2)}`,
      });
    }

    try {
      let response: string;

      if (model.startsWith('gpt-')) {
        // Usar OpenAI
        response = await this.callOpenAI(messages, model);
      } else {
        // Usar Ollama local
        response = await this.callOllama(messages, model);
      }

      // Agregar respuesta al historial
      const assistantMsg: ChatMessage = {
        role: 'assistant',
        content: response,
        timestamp: new Date().toISOString(),
      };

      if (includeHistory) {
        this.conversationHistory.push(assistantMsg);
      }

      return response;
    } catch (error) {
      console.error('Error en chat AI:', error);

      // Fallback a Ollama si OpenAI falla y está habilitado
      if (this.config.enableLocalFallback && model.startsWith('gpt-')) {
        console.log('Fallback a Ollama local...');
        return this.callOllama(messages, AI_MODELS.LLAMA3);
      }

      throw new Error(
        `Error en servicio AI: ${error instanceof Error ? error.message : 'Error desconocido'}`
      );
    }
  }

  /**
   * Llama a la API de OpenAI
   */
  private async callOpenAI(messages: ChatMessage[], model: AIModel): Promise<string> {
    if (!this.config.openaiApiKey) {
      throw new Error('OpenAI API key no configurada');
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.config.openaiApiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: messages.map(({ role, content }) => ({ role, content })),
        temperature: this.config.temperature,
        max_tokens: this.config.maxTokens,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`OpenAI API error: ${error.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || '';
  }

  /**
   * Llama a Ollama local
   */
  private async callOllama(messages: ChatMessage[], model: AIModel): Promise<string> {
    const response = await fetch(`${this.config.ollamaBaseUrl}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages: messages.map(({ role, content }) => ({ role, content })),
        stream: false,
      }),
    });

    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.message?.content || '';
  }

  /**
   * Analiza datos financieros y genera insights con AI
   */
  async analyzeFinancials(data: {
    ingresos: Array<{ monto: number; fecha: string; categoria: string }>;
    gastos: Array<{ monto: number; fecha: string; categoria: string }>;
    periodo: string;
  }): Promise<FinancialAnalysis> {
    const ingresosTotales = data.ingresos.reduce((sum, i) => sum + i.monto, 0);
    const gastosTotales = data.gastos.reduce((sum, g) => sum + g.monto, 0);
    const utilidadNeta = ingresosTotales - gastosTotales;
    const margenUtilidad = ingresosTotales > 0 ? (utilidadNeta / ingresosTotales) * 100 : 0;

    const prompt = `Analiza los siguientes datos financieros del periodo ${data.periodo}:

RESUMEN:
- Ingresos totales: $${ingresosTotales.toLocaleString('es-MX')}
- Gastos totales: $${gastosTotales.toLocaleString('es-MX')}
- Utilidad neta: $${utilidadNeta.toLocaleString('es-MX')}
- Margen de utilidad: ${margenUtilidad.toFixed(2)}%

INGRESOS POR CATEGORÍA:
${this.groupByCategory(data.ingresos)}

GASTOS POR CATEGORÍA:
${this.groupByCategory(data.gastos)}

TENDENCIA TEMPORAL:
${this.analyzeTrend(data.ingresos, data.gastos)}

Proporciona:
1. Predicción de ingresos y gastos para el siguiente mes (con nivel de confianza 0-1)
2. 3-5 insights clave sobre el desempeño financiero
3. 3-5 recomendaciones accionables
4. Alertas críticas si las hay (formato: tipo|mensaje|acción)

Formato tu respuesta como JSON válido con esta estructura:
{
  "prediccionIngresosSiguienteMes": number,
  "prediccionGastosSiguienteMes": number,
  "confianza": number,
  "tendencia": "alcista" | "bajista" | "estable",
  "insights": ["insight1", "insight2", ...],
  "recomendaciones": ["rec1", "rec2", ...],
  "alertas": [{"tipo": "critica|advertencia|info", "mensaje": "...", "accion": "..."}]
}`;

    const response = await this.chat(prompt, {
      includeHistory: false,
      model: this.config.defaultModel,
    });

    // Parsear respuesta JSON
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No se encontró JSON en la respuesta');
      }

      const parsed = JSON.parse(jsonMatch[0]);

      return {
        periodo: data.periodo,
        ingresosTotales,
        gastosTotales,
        utilidadNeta,
        margenUtilidad,
        tendencia: parsed.tendencia || 'estable',
        prediccion: {
          ingresosSiguienteMes: parsed.prediccionIngresosSiguienteMes || ingresosTotales,
          gastosSiguienteMes: parsed.prediccionGastosSiguienteMes || gastosTotales,
          confianza: parsed.confianza || 0.7,
        },
        insights: parsed.insights || [],
        recomendaciones: parsed.recomendaciones || [],
        alertas: parsed.alertas || [],
      };
    } catch (error) {
      console.error('Error parseando respuesta AI:', error);
      // Retornar análisis básico si el parsing falla
      return {
        periodo: data.periodo,
        ingresosTotales,
        gastosTotales,
        utilidadNeta,
        margenUtilidad,
        tendencia: 'estable',
        prediccion: {
          ingresosSiguienteMes: ingresosTotales,
          gastosSiguienteMes: gastosTotales,
          confianza: 0.5,
        },
        insights: ['Análisis básico generado sin AI detallado'],
        recomendaciones: ['Revisar datos y reintentar análisis'],
        alertas: [],
      };
    }
  }

  /**
   * Detecta anomalías en transacciones usando AI
   */
  async detectAnomalies(
    transacciones: Array<{
      id: string;
      tipo: string;
      monto: number;
      fecha: string;
      banco: string;
      categoria?: string;
    }>
  ): Promise<AnomalyDetection[]> {
    const prompt = `Analiza las siguientes transacciones y detecta anomalías:

${transacciones.map((t, i) => `${i + 1}. ${t.tipo} - $${t.monto} - ${t.fecha} - ${t.banco} - ${t.categoria || 'N/A'}`).join('\n')}

Detecta:
1. Montos inusuales (muy altos o bajos comparados con el patrón)
2. Transacciones duplicadas o sospechosas
3. Patrones de fraude potencial
4. Inconsistencias en categorías

Para cada anomalía detectada, responde en JSON:
[
  {
    "transaccionId": "id",
    "esAnomalia": boolean,
    "puntuacionAnomalia": 0-1,
    "razon": "explicación",
    "severidad": "baja|media|alta|critica",
    "accionRecomendada": "acción"
  }
]`;

    const response = await this.chat(prompt, {
      includeHistory: false,
      model: this.config.defaultModel,
    });

    try {
      const jsonMatch = response.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        return [];
      }

      const anomalies = JSON.parse(jsonMatch[0]);

      return anomalies.map((a: any) => ({
        transaccionId: a.transaccionId,
        tipo: transacciones.find((t) => t.id === a.transaccionId)?.tipo || 'desconocido',
        monto: transacciones.find((t) => t.id === a.transaccionId)?.monto || 0,
        fecha: transacciones.find((t) => t.id === a.transaccionId)?.fecha || '',
        esAnomalia: a.esAnomalia,
        puntuacionAnomalia: a.puntuacionAnomalia,
        razon: a.razon,
        severidad: a.severidad,
        accionRecomendada: a.accionRecomendada,
      }));
    } catch (error) {
      console.error('Error parseando anomalías:', error);
      return [];
    }
  }

  /**
   * Limpia el historial de conversación
   */
  clearHistory(): void {
    this.conversationHistory = [];
  }

  /**
   * Obtiene el historial de conversación
   */
  getHistory(): ChatMessage[] {
    return [...this.conversationHistory];
  }

  /**
   * Agrupa datos por categoría
   */
  private groupByCategory(items: Array<{ monto: number; categoria: string }>): string {
    const grouped = items.reduce(
      (acc, item) => {
        const cat = item.categoria || 'Sin categoría';
        acc[cat] = (acc[cat] || 0) + item.monto;
        return acc;
      },
      {} as Record<string, number>
    );

    return Object.entries(grouped)
      .map(([cat, total]) => `  - ${cat}: $${total.toLocaleString('es-MX')}`)
      .join('\n');
  }

  /**
   * Analiza tendencia temporal básica
   */
  private analyzeTrend(
    ingresos: Array<{ fecha: string; monto: number }>,
    gastos: Array<{ fecha: string; monto: number }>
  ): string {
    const sortedIngresos = [...ingresos].sort(
      (a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime()
    );
    const sortedGastos = [...gastos].sort(
      (a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime()
    );

    const firstHalf = Math.floor(sortedIngresos.length / 2);
    const ingresosFirstHalf = sortedIngresos
      .slice(0, firstHalf)
      .reduce((sum, i) => sum + i.monto, 0);
    const ingresosSecondHalf = sortedIngresos.slice(firstHalf).reduce((sum, i) => sum + i.monto, 0);

    const gastosFirstHalf = sortedGastos.slice(0, firstHalf).reduce((sum, g) => sum + g.monto, 0);
    const gastosSecondHalf = sortedGastos.slice(firstHalf).reduce((sum, g) => sum + g.monto, 0);

    return `Primera mitad: Ingresos $${ingresosFirstHalf.toLocaleString('es-MX')}, Gastos $${gastosFirstHalf.toLocaleString('es-MX')}
Segunda mitad: Ingresos $${ingresosSecondHalf.toLocaleString('es-MX')}, Gastos $${gastosSecondHalf.toLocaleString('es-MX')}`;
  }
}

// ============================================================================
// INSTANCIA SINGLETON
// ============================================================================

export const aiService = new AIService();

// ============================================================================
// EXPORTS
// ============================================================================

export { AIService };
export type { AIModel, AIServiceConfig, AnomalyDetection, ChatMessage, FinancialAnalysis };
