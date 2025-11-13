/**
 * 🦙 OLLAMA SERVICE
 * Servicio para interactuar con Ollama (modelos locales LLM)
 *
 * Modelos soportados:
 * - llama3.2 (recomendado para código)
 * - codellama (especializado en código)
 * - mistral (rápido y eficiente)
 * - phi3 (pequeño pero potente)
 *
 * @requires Ollama instalado y corriendo en localhost:11434
 * @version 1.0.0
 */
import axios from 'axios';

class OllamaService {
  constructor() {
    this.baseURL = 'http://localhost:11434/api';
    this.defaultModel = 'llama3.2'; // Modelo por defecto
    this.timeout = 120000; // 2 minutos timeout para generaciones largas
  }

  /**
   * Verifica si Ollama está disponible
   */
  async isAvailable() {
    try {
      const response = await axios.get(`${this.baseURL}/tags`, { timeout: 5000 });
      return response.status === 200;
    } catch (_error) {
      return false;
    }
  }

  /**
   * Lista modelos instalados en Ollama
   */
  async listModels() {
    try {
      const response = await axios.get(`${this.baseURL}/tags`);
      return response.data.models || [];
    } catch (_error) {
      return [];
    }
  }

  /**
   * Genera texto usando Ollama
   * @param {string} prompt - Prompt para el modelo
   * @param {Object} options - Opciones de generación
   */
  async generate(prompt, options = {}) {
    try {
      const {
        model = this.defaultModel,
        temperature = 0.7,
        stream = false,
        system = null,
      } = options;

      const payload = {
        model,
        prompt,
        stream,
        options: {
          temperature,
          num_predict: 4000, // Tokens máximos
        },
      };

      if (system) {
        payload.system = system;
      }

      const response = await axios.post(`${this.baseURL}/generate`, payload, {
        timeout: this.timeout,
      });

      return {
        success: true,
        text: response.data.response,
        model: response.data.model,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        text: null,
      };
    }
  }

  /**
   * Chat con contexto (conversación)
   * @param {Array} messages - Array de mensajes [{ role: 'user', content: '...' }]
   * @param {Object} options - Opciones
   */
  async chat(messages, options = {}) {
    try {
      const { model = this.defaultModel, temperature = 0.7 } = options;

      const response = await axios.post(
        `${this.baseURL}/chat`,
        {
          model,
          messages,
          stream: false,
          options: {
            temperature,
            num_predict: 4000,
          },
        },
        { timeout: this.timeout }
      );

      return {
        success: true,
        message: response.data.message,
        text: response.data.message.content,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        text: null,
      };
    }
  }

  /**
   * Genera código React usando CodeLlama o Llama3.2
   */
  async generateReactCode(description, structure = {}) {
    const prompt = `Eres un desarrollador React senior especializado en componentes premium con animaciones fluidas.

Genera un componente React PREMIUM con esta estructura:
${JSON.stringify(structure, null, 2)}

Descripción: ${description}

Requisitos:
- TypeScript con tipos estrictos
- Framer Motion para animaciones
- TailwindCSS para estilos
- Hooks modernos (useState, useEffect, useMemo, useCallback)
- Comentarios JSDoc
- Manejo de errores
- Accesibilidad completa (ARIA)
- Performance optimizado (React.memo si necesario)
- Diseño glassmorphism futurista
- Microinteracciones premium

Genera SOLO el código del componente, sin explicaciones.`;

    return this.generate(prompt, {
      model: 'codellama', // Preferir CodeLlama para código
      temperature: 0.7,
      system: 'Eres un experto en React y TypeScript. Genera código limpio y production-ready.',
    });
  }

  /**
   * Genera estructura de componente
   */
  async generateComponentStructure(name, description, type = 'component') {
    const prompt = `Eres un arquitecto senior de React. Genera la estructura JSON completa para este componente:

Nombre: ${name}
Tipo: ${type}
Descripción: ${description}

Genera un JSON con esta estructura:
{
  "props": [
    { "name": "propName", "type": "string", "required": true, "default": null, "description": "..." }
  ],
  "state": [
    { "name": "stateName", "type": "boolean", "initial": false, "description": "..." }
  ],
  "hooks": ["useState", "useEffect", "useMemo"],
  "dependencies": ["react", "framer-motion"],
  "children": [
    { "name": "Header", "type": "div", "props": {} },
    { "name": "Content", "type": "div", "props": {} }
  ],
  "events": [
    { "name": "onClick", "handler": "handleClick", "description": "..." }
  ],
  "animations": [
    { "trigger": "mount", "type": "fadeIn", "duration": 300 }
  ]
}

Solo responde con el JSON, sin explicaciones.`;

    const result = await this.generate(prompt, {
      model: this.defaultModel,
      temperature: 0.5,
    });

    if (result.success) {
      try {
        // Extraer JSON del texto (por si viene con markdown)
        const jsonMatch = result.text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0]);
        }
        return JSON.parse(result.text);
      } catch (_error) {
        return null;
      }
    }

    return null;
  }

  /**
   * Genera tests usando Vitest
   */
  async generateTests(componentCode) {
    const prompt = `Genera tests completos con Vitest + React Testing Library para este componente:

${componentCode}

Incluye tests para:
- Renderizado correcto
- Props requeridas
- Estados y interacciones
- Eventos
- Accesibilidad
- Casos edge

Solo responde con el código de tests.`;

    return this.generate(prompt, {
      model: 'codellama',
      temperature: 0.3,
      system: 'Eres un experto en testing de React con Vitest.',
    });
  }
}

// Exportar instancia singleton
export const ollamaService = new OllamaService();
export default OllamaService;
