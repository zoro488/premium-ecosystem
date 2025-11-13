/**
 * 🤖 Multi-Provider AI Service
 * Soporte para Ollama, Gemini, OpenAI, Anthropic, etc.
 */

// Configuración de proveedores
export const AI_PROVIDERS = {
  OLLAMA: 'ollama',
  GEMINI: 'gemini',
  OPENAI: 'openai',
  ANTHROPIC: 'anthropic',
};

// Modelos disponibles por proveedor
export const MODELS = {
  ollama: [
    {
      id: 'llama3.2:3b',
      name: 'Llama 3.2 3B',
      description: '⚡ Ultra rápido, ideal para tareas simples',
    },
    { id: 'codellama:7b', name: 'Code Llama 7B', description: '💻 Especializado en código' },
    { id: 'qwen2.5:32b', name: 'Qwen 2.5 32B', description: '🌍 Excelente para español ⭐' },
    { id: 'llama3.1:70b', name: 'Llama 3.1 70B', description: '💎 Máxima calidad' },
    { id: 'gpt-oss:120b', name: 'GPT OSS 120B', description: '🚀 Ultra premium' },
  ],
  gemini: [
    {
      id: 'gemini-2.0-flash-exp',
      name: 'Gemini 2.0 Flash',
      description: '⚡ Más rápido y reciente',
    },
    { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash', description: '⚡ Rápido y eficiente' },
    { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro', description: '💎 Máxima capacidad' },
    { id: 'gemini-pro', name: 'Gemini Pro', description: '🎯 Equilibrado' },
  ],
  openai: [
    { id: 'gpt-4-turbo', name: 'GPT-4 Turbo', description: '🚀 Más rápido que GPT-4' },
    { id: 'gpt-4', name: 'GPT-4', description: '💎 Máxima calidad' },
    { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', description: '⚡ Rápido y económico' },
  ],
  anthropic: [
    { id: 'claude-3-opus', name: 'Claude 3 Opus', description: '💎 Máxima capacidad' },
    { id: 'claude-3-sonnet', name: 'Claude 3 Sonnet', description: '🎯 Equilibrado' },
    { id: 'claude-3-haiku', name: 'Claude 3 Haiku', description: '⚡ Más rápido' },
  ],
};

// Configuración por defecto
const DEFAULT_CONFIG = {
  provider: AI_PROVIDERS.OLLAMA,
  model: 'qwen2.5:32b',
  temperature: 0.7,
  maxTokens: 2048,
  streaming: true,
  systemPrompt: 'Eres un asistente de IA útil y profesional.',
};

/**
 * Clase principal del servicio multi-proveedor
 */
export class MultiProviderAI {
  constructor(config = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.apiKeys = this.loadAPIKeys();
  }

  /**
   * Cargar API keys desde localStorage o variables de entorno
   */
  loadAPIKeys() {
    return {
      gemini:
        localStorage.getItem('ai_api_key_gemini') || import.meta.env.VITE_GEMINI_API_KEY || '',
      openai:
        localStorage.getItem('ai_api_key_openai') || import.meta.env.VITE_OPENAI_API_KEY || '',
      anthropic:
        localStorage.getItem('ai_api_key_anthropic') ||
        import.meta.env.VITE_ANTHROPIC_API_KEY ||
        '',
    };
  }

  /**
   * Guardar API key
   */
  setAPIKey(provider, apiKey) {
    this.apiKeys[provider] = apiKey;
    localStorage.setItem(`ai_api_key_${provider}`, apiKey);
  }

  /**
   * Cambiar proveedor
   */
  setProvider(provider, model = null) {
    if (!Object.values(AI_PROVIDERS).includes(provider)) {
      throw new Error(`Proveedor inválido: ${provider}`);
    }

    this.config.provider = provider;

    // Si se especifica modelo, usarlo; si no, usar el primero disponible
    if (model) {
      this.config.model = model;
    } else if (MODELS[provider] && MODELS[provider].length > 0) {
      this.config.model = MODELS[provider][0].id;
    }
  }

  /**
   * Generar respuesta con el proveedor configurado
   */
  async generate(prompt, options = {}) {
    const config = { ...this.config, ...options };

    switch (config.provider) {
      case AI_PROVIDERS.OLLAMA:
        return this.generateOllama(prompt, config);

      case AI_PROVIDERS.GEMINI:
        return this.generateGemini(prompt, config);

      case AI_PROVIDERS.OPENAI:
        return this.generateOpenAI(prompt, config);

      case AI_PROVIDERS.ANTHROPIC:
        return this.generateAnthropic(prompt, config);

      default:
        throw new Error(`Proveedor no soportado: ${config.provider}`);
    }
  }

  /**
   * Ollama - Generación local
   */
  async generateOllama(prompt, config) {
    try {
      const response = await fetch('/api/ollama/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: config.model,
          prompt: config.systemPrompt ? `${config.systemPrompt}\n\n${prompt}` : prompt,
          stream: config.streaming,
          options: {
            temperature: config.temperature,
            num_predict: config.maxTokens,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`Ollama error: ${response.status}`);
      }

      if (config.streaming) {
        return this.handleOllamaStream(response);
      }

      const data = await response.json();
      return {
        success: true,
        response: data.response,
        provider: AI_PROVIDERS.OLLAMA,
        model: config.model,
      };
    } catch (error) {
      console.error('Error en Ollama:', error);
      return {
        success: false,
        error: error.message,
        provider: AI_PROVIDERS.OLLAMA,
      };
    }
  }

  /**
   * Gemini - Google AI
   */
  async generateGemini(prompt, config) {
    if (!this.apiKeys.gemini) {
      throw new Error('Gemini API key no configurada. Usa setAPIKey("gemini", "tu-api-key")');
    }

    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${config.model}:generateContent?key=${this.apiKeys.gemini}`;

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: config.systemPrompt ? `${config.systemPrompt}\n\n${prompt}` : prompt,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: config.temperature,
            maxOutputTokens: config.maxTokens,
          },
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`Gemini error: ${error.error?.message || response.status}`);
      }

      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

      return {
        success: true,
        response: text,
        provider: AI_PROVIDERS.GEMINI,
        model: config.model,
        usage: data.usageMetadata,
      };
    } catch (error) {
      console.error('Error en Gemini:', error);
      return {
        success: false,
        error: error.message,
        provider: AI_PROVIDERS.GEMINI,
      };
    }
  }

  /**
   * OpenAI - ChatGPT
   */
  async generateOpenAI(prompt, config) {
    if (!this.apiKeys.openai) {
      throw new Error('OpenAI API key no configurada. Usa setAPIKey("openai", "tu-api-key")');
    }

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.apiKeys.openai}`,
        },
        body: JSON.stringify({
          model: config.model,
          messages: [
            { role: 'system', content: config.systemPrompt },
            { role: 'user', content: prompt },
          ],
          temperature: config.temperature,
          max_tokens: config.maxTokens,
          stream: config.streaming,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`OpenAI error: ${error.error?.message || response.status}`);
      }

      if (config.streaming) {
        return this.handleOpenAIStream(response);
      }

      const data = await response.json();
      const text = data.choices?.[0]?.message?.content || '';

      return {
        success: true,
        response: text,
        provider: AI_PROVIDERS.OPENAI,
        model: config.model,
        usage: data.usage,
      };
    } catch (error) {
      console.error('Error en OpenAI:', error);
      return {
        success: false,
        error: error.message,
        provider: AI_PROVIDERS.OPENAI,
      };
    }
  }

  /**
   * Anthropic - Claude
   */
  async generateAnthropic(prompt, config) {
    if (!this.apiKeys.anthropic) {
      throw new Error('Anthropic API key no configurada. Usa setAPIKey("anthropic", "tu-api-key")');
    }

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKeys.anthropic,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: config.model,
          messages: [{ role: 'user', content: prompt }],
          system: config.systemPrompt,
          temperature: config.temperature,
          max_tokens: config.maxTokens,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`Anthropic error: ${error.error?.message || response.status}`);
      }

      const data = await response.json();
      const text = data.content?.[0]?.text || '';

      return {
        success: true,
        response: text,
        provider: AI_PROVIDERS.ANTHROPIC,
        model: config.model,
        usage: data.usage,
      };
    } catch (error) {
      console.error('Error en Anthropic:', error);
      return {
        success: false,
        error: error.message,
        provider: AI_PROVIDERS.ANTHROPIC,
      };
    }
  }

  /**
   * Stream handler para Ollama
   */
  async handleOllamaStream(response) {
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let fullResponse = '';

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n').filter((line) => line.trim());

        for (const line of lines) {
          try {
            const data = JSON.parse(line);
            if (data.response) {
              fullResponse += data.response;
              // Emitir evento para UI reactiva
              this.emit('stream', { text: data.response, done: data.done });
            }
          } catch (e) {
            // Ignorar líneas mal formateadas
          }
        }
      }

      return {
        success: true,
        response: fullResponse,
        provider: AI_PROVIDERS.OLLAMA,
      };
    } catch (error) {
      console.error('Error en stream de Ollama:', error);
      return {
        success: false,
        error: error.message,
        provider: AI_PROVIDERS.OLLAMA,
      };
    }
  }

  /**
   * Stream handler para OpenAI
   */
  async handleOpenAIStream(response) {
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let fullResponse = '';

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n').filter((line) => line.startsWith('data: '));

        for (const line of lines) {
          const data = line.replace('data: ', '');
          if (data === '[DONE]') break;

          try {
            const parsed = JSON.parse(data);
            const text = parsed.choices?.[0]?.delta?.content || '';
            if (text) {
              fullResponse += text;
              this.emit('stream', { text, done: false });
            }
          } catch (e) {
            // Ignorar líneas mal formateadas
          }
        }
      }

      return {
        success: true,
        response: fullResponse,
        provider: AI_PROVIDERS.OPENAI,
      };
    } catch (error) {
      console.error('Error en stream de OpenAI:', error);
      return {
        success: false,
        error: error.message,
        provider: AI_PROVIDERS.OPENAI,
      };
    }
  }

  /**
   * Sistema de eventos simple
   */
  emit(event, data) {
    if (this.listeners && this.listeners[event]) {
      this.listeners[event].forEach((callback) => callback(data));
    }
  }

  on(event, callback) {
    if (!this.listeners) this.listeners = {};
    if (!this.listeners[event]) this.listeners[event] = [];
    this.listeners[event].push(callback);
  }

  /**
   * Verificar disponibilidad de proveedores
   */
  async checkProviderAvailability(provider) {
    switch (provider) {
      case AI_PROVIDERS.OLLAMA:
        try {
          const response = await fetch('/api/ollama/api/tags');
          return response.ok;
        } catch {
          return false;
        }

      case AI_PROVIDERS.GEMINI:
        return !!this.apiKeys.gemini;

      case AI_PROVIDERS.OPENAI:
        return !!this.apiKeys.openai;

      case AI_PROVIDERS.ANTHROPIC:
        return !!this.apiKeys.anthropic;

      default:
        return false;
    }
  }

  /**
   * Obtener lista de modelos disponibles para Ollama
   */
  async getOllamaModels() {
    try {
      const response = await fetch('/api/ollama/api/tags');
      if (!response.ok) return [];

      const data = await response.json();
      return data.models || [];
    } catch (error) {
      console.error('Error obteniendo modelos de Ollama:', error);
      return [];
    }
  }

  /**
   * Auto-detectar mejor proveedor disponible
   */
  async autoSelectProvider() {
    // Prioridad: Ollama (gratis) > Gemini > OpenAI > Anthropic
    const priorities = [
      AI_PROVIDERS.OLLAMA,
      AI_PROVIDERS.GEMINI,
      AI_PROVIDERS.OPENAI,
      AI_PROVIDERS.ANTHROPIC,
    ];

    for (const provider of priorities) {
      const available = await this.checkProviderAvailability(provider);
      if (available) {
        this.setProvider(provider);
        console.log(`✅ Proveedor seleccionado automáticamente: ${provider}`);
        return provider;
      }
    }

    console.warn('⚠️  No hay proveedores disponibles');
    return null;
  }
}

// Instancia singleton
let aiInstance = null;

/**
 * Obtener instancia del servicio AI
 */
export function getAIService(config = {}) {
  if (!aiInstance) {
    aiInstance = new MultiProviderAI(config);
  }
  return aiInstance;
}

/**
 * Hook de React para usar el servicio AI
 */
export function useAI() {
  const ai = getAIService();
  return {
    ai,
    providers: AI_PROVIDERS,
    models: MODELS,
    setProvider: (provider, model) => ai.setProvider(provider, model),
    setAPIKey: (provider, key) => ai.setAPIKey(provider, key),
    generate: (prompt, options) => ai.generate(prompt, options),
    checkAvailability: (provider) => ai.checkProviderAvailability(provider),
    autoSelect: () => ai.autoSelectProvider(),
  };
}

export default MultiProviderAI;
