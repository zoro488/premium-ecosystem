/**
 * ====================================
 * GEMINI AI - CONFIGURACIÓN CENTRAL
 * ====================================
 * Configuración completa de Google Gemini API
 * para todo el ecosistema premium
 */
import { GoogleGenerativeAI } from '@google/generative-ai';

// Validar API Key
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  console.error('⚠️ VITE_GEMINI_API_KEY no está configurada');
  throw new Error('API Key de Gemini es requerida');
}

// Inicializar Gemini
export const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

/**
 * Modelos disponibles de Gemini (actualizados Noviembre 2025)
 */
export const GEMINI_MODELS = {
  FLASH: 'gemini-2.0-flash-exp', // Modelo experimental más reciente
  PRO: 'gemini-2.0-flash-exp', // Mismo modelo para consistencia
  PRO_VISION: 'gemini-2.0-flash-exp', // Soporta visión y multimodal
};

/**
 * Configuración de generación por defecto
 */
export const defaultGenerationConfig = {
  temperature: 0.9,
  topK: 40,
  topP: 0.95,
  maxOutputTokens: 8192,
};

/**
 * Configuraciones predefinidas para diferentes casos de uso
 */
export const generationConfigs = {
  // Respuestas creativas (ventas, marketing)
  creative: {
    temperature: 1.0,
    topK: 50,
    topP: 0.98,
    maxOutputTokens: 8192,
  },

  // Respuestas precisas (análisis, datos)
  precise: {
    temperature: 0.3,
    topK: 20,
    topP: 0.85,
    maxOutputTokens: 8192,
  },

  // Respuestas balanceadas (uso general)
  balanced: {
    temperature: 0.7,
    topK: 35,
    topP: 0.9,
    maxOutputTokens: 8192,
  },

  // Código y programación
  code: {
    temperature: 0.2,
    topK: 10,
    topP: 0.8,
    maxOutputTokens: 8192,
  },

  // Resúmenes cortos
  summary: {
    temperature: 0.5,
    topK: 25,
    topP: 0.85,
    maxOutputTokens: 2048,
  },
};

/**
 * Configuración de seguridad
 */
export const safetySettings = [
  {
    category: 'HARM_CATEGORY_HARASSMENT',
    threshold: 'BLOCK_MEDIUM_AND_ABOVE',
  },
  {
    category: 'HARM_CATEGORY_HATE_SPEECH',
    threshold: 'BLOCK_MEDIUM_AND_ABOVE',
  },
  {
    category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
    threshold: 'BLOCK_MEDIUM_AND_ABOVE',
  },
  {
    category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
    threshold: 'BLOCK_MEDIUM_AND_ABOVE',
  },
];

/**
 * Inicializar modelo con configuración personalizada
 */
export const getGeminiModel = (modelName = GEMINI_MODELS.FLASH, configType = 'balanced') => {
  return genAI.getGenerativeModel({
    model: modelName,
    generationConfig: generationConfigs[configType] || defaultGenerationConfig,
    safetySettings,
  });
};

/**
 * Modelo por defecto (Gemini Flash con configuración balanceada)
 */
export const gemini = getGeminiModel();

/**
 * Modelos especializados pre-configurados
 */
export const geminiModels = {
  creative: getGeminiModel(GEMINI_MODELS.FLASH, 'creative'),
  precise: getGeminiModel(GEMINI_MODELS.FLASH, 'precise'),
  balanced: getGeminiModel(GEMINI_MODELS.FLASH, 'balanced'),
  code: getGeminiModel(GEMINI_MODELS.FLASH, 'code'),
  summary: getGeminiModel(GEMINI_MODELS.FLASH, 'summary'),
  vision: genAI.getGenerativeModel({
    model: GEMINI_MODELS.PRO_VISION,
    generationConfig: defaultGenerationConfig,
    safetySettings,
  }),
};

/**
 * Límites y quotas
 */
export const GEMINI_LIMITS = {
  MAX_TOKENS_PER_REQUEST: 8192,
  MAX_REQUESTS_PER_MINUTE: 60,
  RATE_LIMIT_DELAY: 1000, // ms entre requests
};

/**
 * Configuración de retry
 */
export const retryConfig = {
  maxRetries: 3,
  retryDelay: 1000, // ms
  backoffMultiplier: 2,
};

/**
 * Helper para manejar errores de Gemini
 */
export const handleGeminiError = (error) => {
  console.error('❌ Error de Gemini:', error);

  if (error.message?.includes('API key')) {
    return {
      success: false,
      error: 'API Key inválida o no configurada',
      code: 'INVALID_API_KEY',
    };
  }

  if (error.message?.includes('quota')) {
    return {
      success: false,
      error: 'Límite de uso excedido',
      code: 'QUOTA_EXCEEDED',
    };
  }

  if (error.message?.includes('rate limit')) {
    return {
      success: false,
      error: 'Demasiadas solicitudes',
      code: 'RATE_LIMIT',
    };
  }

  return {
    success: false,
    error: error.message || 'Error desconocido',
    code: 'UNKNOWN_ERROR',
  };
};

/**
 * Helper para logging de uso
 */
export const logGeminiUsage = (model, tokensUsed, latency) => {
  const timestamp = new Date().toISOString();
  console.log('📊 Gemini Usage:', {
    timestamp,
    model,
    tokensUsed,
    latency: `${latency}ms`,
  });

  // Aquí puedes integrar con Firebase Analytics
  if (window.gtag) {
    window.gtag('event', 'gemini_request', {
      model,
      tokens: tokensUsed,
      latency,
    });
  }
};

export default {
  genAI,
  gemini,
  geminiModels,
  getGeminiModel,
  GEMINI_MODELS,
  generationConfigs,
  safetySettings,
  handleGeminiError,
  logGeminiUsage,
};
