/**
 * 🧠 HYBRID AI SERVICE
 * Orquestador inteligente que decide qué servicio usar
 */
import bedrockService from './BedrockService.js';
import sagemakerService from './SageMakerService.js';

class HybridAIService {
  constructor() {
    this.ollamaHost = import.meta.env.VITE_OLLAMA_HOST;
    this.preferOllama = import.meta.env.VITE_PREFER_OLLAMA === 'true';
  }

  /**
   * Chat inteligente con routing automático
   */
  async chat(messages, context = 'general', options = {}) {
    const { model = 'claude-3.5', stream = false } = options;

    // Si Ollama está disponible y es preferido para contextos simples
    if (this.shouldUseOllama(context)) {
      try {
        return await this.ollamaChat(messages, stream);
      } catch (error) {
        console.warn('Ollama no disponible, usando Bedrock');
      }
    }

    // Usar Bedrock
    return bedrockService.chat(messages, model, { stream });
  }

  /**
   * Análisis predictivo (SageMaker o Bedrock)
   */
  async predict(type, data) {
    switch (type) {
      case 'sales':
        return sagemakerService.predictSales(data);

      case 'churn':
        return sagemakerService.predictChurn(data);

      case 'pricing':
        return sagemakerService.optimizePrice(data);

      default:
        // Usar Bedrock para predicciones generales
        return this.bedrockPredict(type, data);
    }
  }

  /**
   * Análisis de imágenes
   */
  async analyzeImage(imageBase64, task = 'general') {
    const prompts = {
      'drone-inspection':
        'Analiza esta imagen de drone. Identifica: vehículos, personas, anomalías, placas.',
      'damage-detection': 'Detecta daños visibles, grietas, deterioro, problemas estructurales.',
      'object-detection': 'Identifica y lista todos los objetos visibles con sus ubicaciones.',
      general: 'Describe esta imagen en detalle.',
    };

    return bedrockService.analyzeImage(imageBase64, prompts[task] || prompts.general);
  }

  /**
   * Genera embeddings para búsqueda semántica
   */
  async generateEmbeddings(text) {
    return bedrockService.generateEmbeddings(text);
  }

  /**
   * Decide si usar Ollama
   */
  shouldUseOllama(context) {
    const ollamaContexts = ['chat', 'autocomplete', 'suggestions'];
    return this.preferOllama && ollamaContexts.includes(context) && this.ollamaAvailable;
  }

  /**
   * Chat con Ollama local
   */
  async ollamaChat(messages, stream = false) {
    const response = await fetch(`${this.ollamaHost}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'llama3.1:70b',
        messages,
        stream,
      }),
    });

    if (stream) {
      return response.body;
    }

    const data = await response.json();
    return {
      text: data.message.content,
      model: 'llama3.1:70b',
    };
  }

  /**
   * Predicción con Bedrock
   */
  async bedrockPredict(type, data) {
    const prompt = this.buildPredictionPrompt(type, data);
    const response = await bedrockService.chat([{ role: 'user', content: prompt }], 'claude-3.5');

    return JSON.parse(response.text);
  }

  /**
   * Construye prompt para predicción
   */
  buildPredictionPrompt(type, data) {
    return `
Analiza estos datos y genera una predicción para: ${type}

Datos: ${JSON.stringify(data, null, 2)}

Responde SOLO con JSON válido en este formato:
{
  "prediction": <valor numérico>,
  "confidence": <0-1>,
  "factors": ["factor1", "factor2"],
  "recommendations": ["recomendación1", "recomendación2"]
}
    `.trim();
  }

  /**
   * Verifica disponibilidad de Ollama
   */
  async checkOllamaAvailability() {
    if (!this.ollamaHost) return false;

    try {
      const response = await fetch(`${this.ollamaHost}/api/tags`, {
        method: 'GET',
        signal: AbortSignal.timeout(2000),
      });
      this.ollamaAvailable = response.ok;
      return response.ok;
    } catch {
      this.ollamaAvailable = false;
      return false;
    }
  }
}

export default new HybridAIService();
