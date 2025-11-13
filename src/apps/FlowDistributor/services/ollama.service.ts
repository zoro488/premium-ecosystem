/**
 * 🤖 OLLAMA SERVICE - IA Local
 * Integración con Ollama para modelos locales
 * - llama2, llama3.1
 * - mistral
 * - codellama
 * Sin costos, privacidad total
 */

// ============================================================================
// CONFIGURACIÓN
// ============================================================================

const OLLAMA_CONFIG = {
  baseURL: import.meta.env.VITE_OLLAMA_URL || 'http://localhost:11434',
  defaultModel: 'llama2',
  timeout: 30000, // 30 segundos
};

// ============================================================================
// TIPOS
// ============================================================================

export interface OllamaMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface OllamaResponse {
  model: string;
  created_at: string;
  message: {
    role: string;
    content: string;
  };
  done: boolean;
  total_duration?: number;
  load_duration?: number;
  prompt_eval_count?: number;
  eval_count?: number;
}

export interface OllamaModel {
  name: string;
  modified_at: string;
  size: number;
  digest: string;
}

// ============================================================================
// FUNCIONES PRINCIPALES
// ============================================================================

/**
 * Enviar mensaje a Ollama
 */
export async function sendToOllama(
  messages: OllamaMessage[],
  options: {
    model?: string;
    temperature?: number;
    maxTokens?: number;
  } = {}
): Promise<string> {

  const {
    model = OLLAMA_CONFIG.defaultModel,
    temperature = 0.7,
    maxTokens = 2048
  } = options;

  try {
    const response = await fetch(`${OLLAMA_CONFIG.baseURL}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages,
        options: {
          temperature,
          num_predict: maxTokens,
        },
        stream: false
      }),
      signal: AbortSignal.timeout(OLLAMA_CONFIG.timeout)
    });

    if (!response.ok) {
      throw new Error(`Ollama error: ${response.status} ${response.statusText}`);
    }

    const data: OllamaResponse = await response.json();

    return data.message.content;

  } catch (error) {
    console.error('Error en Ollama:', error);
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    throw new Error(`Error al comunicarse con Ollama: ${errorMessage}`);
  }
}

/**
 * Streaming de respuestas de Ollama
 */
export async function* streamOllama(
  messages: OllamaMessage[],
  options: {
    model?: string;
    temperature?: number;
    maxTokens?: number;
  } = {}
): AsyncGenerator<string, void, unknown> {

  const {
    model = OLLAMA_CONFIG.defaultModel,
    temperature = 0.7,
    maxTokens = 2048
  } = options;

  try {
    const response = await fetch(`${OLLAMA_CONFIG.baseURL}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages,
        options: {
          temperature,
          num_predict: maxTokens,
        },
        stream: true
      })
    });

    if (!response.ok) {
      throw new Error(`Ollama streaming error: ${response.status}`);
    }

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();

    if (!reader) {
      throw new Error('No se pudo obtener el reader de la respuesta');
    }

    while (true) {
      const { done, value } = await reader.read();

      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split('\n').filter(line => line.trim());

      for (const line of lines) {
        try {
          const data: OllamaResponse = JSON.parse(line);

          if (data.message?.content) {
            yield data.message.content;
          }

          if (data.done) {
            return;
          }
        } catch (e) {
          console.error('Error parseando chunk de Ollama:', e);
        }
      }
    }

  } catch (error) {
    console.error('Error en Ollama streaming:', error);
    throw error;
  }
}

/**
 * Generar respuesta simple (sin historial)
 */
export async function generateOllama(
  prompt: string,
  options: {
    model?: string;
    temperature?: number;
    maxTokens?: number;
  } = {}
): Promise<string> {

  const {
    model = OLLAMA_CONFIG.defaultModel,
    temperature = 0.7,
    maxTokens = 2048
  } = options;

  try {
    const response = await fetch(`${OLLAMA_CONFIG.baseURL}/api/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        prompt,
        options: {
          temperature,
          num_predict: maxTokens,
        },
        stream: false
      }),
      signal: AbortSignal.timeout(OLLAMA_CONFIG.timeout)
    });

    if (!response.ok) {
      throw new Error(`Ollama generate error: ${response.status}`);
    }

    const data = await response.json();

    return data.response;

  } catch (error) {
    console.error('Error en Ollama generate:', error);
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    throw new Error(`Error al generar con Ollama: ${errorMessage}`);
  }
}

// ============================================================================
// GESTIÓN DE MODELOS
// ============================================================================

/**
 * Listar modelos disponibles
 */
export async function listOllamaModels(): Promise<OllamaModel[]> {
  try {
    const response = await fetch(`${OLLAMA_CONFIG.baseURL}/api/tags`);

    if (!response.ok) {
      throw new Error(`Error al listar modelos: ${response.status}`);
    }

    const data = await response.json();

    return data.models || [];

  } catch (error) {
    console.error('Error listando modelos de Ollama:', error);
    return [];
  }
}

/**
 * Descargar un modelo
 */
export async function pullOllamaModel(
  modelName: string,
  onProgress?: (progress: { status: string; completed?: number; total?: number }) => void
): Promise<void> {
  try {
    const response = await fetch(`${OLLAMA_CONFIG.baseURL}/api/pull`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: modelName,
        stream: true
      })
    });

    if (!response.ok) {
      throw new Error(`Error al descargar modelo: ${response.status}`);
    }

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();

    if (!reader) {
      throw new Error('No se pudo obtener el reader');
    }

    while (true) {
      const { done, value } = await reader.read();

      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split('\n').filter(line => line.trim());

      for (const line of lines) {
        try {
          const data = JSON.parse(line);

          if (onProgress) {
            onProgress({
              status: data.status,
              completed: data.completed,
              total: data.total
            });
          }
        } catch (e) {
          console.error('Error parseando progreso:', e);
        }
      }
    }

  } catch (error) {
    console.error('Error descargando modelo:', error);
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    throw new Error(`Error al descargar modelo: ${errorMessage}`);
  }
}

/**
 * Eliminar un modelo
 */
export async function deleteOllamaModel(modelName: string): Promise<void> {
  try {
    const response = await fetch(`${OLLAMA_CONFIG.baseURL}/api/delete`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: modelName
      })
    });

    if (!response.ok) {
      throw new Error(`Error al eliminar modelo: ${response.status}`);
    }

  } catch (error) {
    console.error('Error eliminando modelo:', error);
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    throw new Error(`Error al eliminar modelo: ${errorMessage}`);
  }
}

// ============================================================================
// UTILIDADES
// ============================================================================

/**
 * Verificar si Ollama está disponible
 */
export async function checkOllamaHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${OLLAMA_CONFIG.baseURL}/api/tags`, {
      signal: AbortSignal.timeout(5000)
    });

    return response.ok;

  } catch (error) {
    console.warn('Ollama no está disponible:', error);
    return false;
  }
}

/**
 * Obtener información del servidor Ollama
 */
export async function getOllamaInfo(): Promise<{
  available: boolean;
  models: string[];
  baseURL: string;
}> {
  const available = await checkOllamaHealth();

  let models: string[] = [];

  if (available) {
    const modelList = await listOllamaModels();
    models = modelList.map(m => m.name);
  }

  return {
    available,
    models,
    baseURL: OLLAMA_CONFIG.baseURL
  };
}

/**
 * Configurar URL de Ollama
 */
export function setOllamaURL(url: string): void {
  OLLAMA_CONFIG.baseURL = url;
}

/**
 * Obtener configuración actual
 */
export function getOllamaConfig() {
  return { ...OLLAMA_CONFIG };
}

// ============================================================================
// FUNCIONES ESPECÍFICAS PARA FLOWDISTRIBUTOR
// ============================================================================

/**
 * Analizar datos de ventas con IA local
 */
export async function analyzeVentasWithOllama(
  ventasData: any[]
): Promise<string> {
  const prompt = `Analiza estos datos de ventas y proporciona insights clave:

${JSON.stringify(ventasData, null, 2)}

Proporciona:
1. Tendencias principales
2. Productos más vendidos
3. Recomendaciones para mejorar ventas
4. Alertas o problemas detectados`;

  return await generateOllama(prompt, {
    model: 'llama2',
    temperature: 0.3,
    maxTokens: 1000
  });
}

/**
 * Generar reporte con IA local
 */
export async function generateReportWithOllama(
  title: string,
  data: any
): Promise<string> {
  const prompt = `Genera un reporte profesional con el siguiente título: "${title}"

Datos:
${JSON.stringify(data, null, 2)}

El reporte debe incluir:
1. Resumen ejecutivo
2. Análisis detallado
3. Conclusiones
4. Recomendaciones`;

  return await generateOllama(prompt, {
    model: 'llama2',
    temperature: 0.5,
    maxTokens: 2000
  });
}

/**
 * Predecir tendencias con IA local
 */
export async function predictTrendsWithOllama(
  historicalData: any[]
): Promise<string> {
  const prompt = `Basándote en estos datos históricos, predice tendencias futuras:

${JSON.stringify(historicalData, null, 2)}

Proporciona:
1. Predicción para próximos 30 días
2. Factores clave que influyen
3. Nivel de confianza
4. Recomendaciones de acción`;

  return await generateOllama(prompt, {
    model: 'llama2',
    temperature: 0.4,
    maxTokens: 1500
  });
}
