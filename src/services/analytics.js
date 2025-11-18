/**
 * ====================================
 * ANALYTICS SERVICE - TRACKING IA
 * ====================================
 * Servicio para trackear el uso de IA (Gemini)
 * Integrado con Firebase Analytics y Google Analytics 4
 */
import { logEvent } from 'firebase/analytics';

import { analytics } from '@/lib/firebase';

/**
 * Trackea request de IA (Gemini, OpenAI, etc)
 */
export const trackAIRequest = (
  provider, // 'gemini', 'openai', 'claude'
  model, // 'pro', 'creative', 'precise'
  latency, // tiempo en ms
  success = true
) => {
  try {
    // Firebase Analytics
    if (analytics) {
      logEvent(analytics, 'ai_request', {
        provider,
        model,
        latency,
        success,
        timestamp: new Date().toISOString(),
      });
    }

    // Google Analytics (window.gtag)
    if (window.gtag) {
      window.gtag('event', 'ai_request', {
        event_category: 'AI',
        event_label: `${provider}-${model}`,
        value: latency,
        success,
      });
    }

    // Console log en desarrollo
    if (import.meta.env.DEV) {
      console.log('📊 AI Request:', {
        provider,
        model,
        latency: `${latency}ms`,
        success: success ? '✅' : '❌',
      });
    }
  } catch (error) {
    console.error('Error tracking AI request:', error);
  }
};

/**
 * Trackea uso de features de IA por aplicación
 */
export const trackAIFeature = (app, feature, metadata = {}) => {
  try {
    if (analytics) {
      logEvent(analytics, 'ai_feature_used', {
        app,
        feature,
        ...metadata,
        timestamp: new Date().toISOString(),
      });
    }

    if (window.gtag) {
      window.gtag('event', 'ai_feature', {
        event_category: 'AI Features',
        event_label: `${app}-${feature}`,
      });
    }
  } catch (error) {
    console.error('Error tracking AI feature:', error);
  }
};

/**
 * Trackea tokens/costos de IA
 */
export const trackAICost = (provider, tokens, estimatedCost = 0) => {
  try {
    if (analytics) {
      logEvent(analytics, 'ai_cost', {
        provider,
        tokens,
        estimated_cost: estimatedCost,
        timestamp: new Date().toISOString(),
      });
    }

    if (import.meta.env.DEV) {
      console.log('💰 AI Cost:', {
        provider,
        tokens,
        cost: `$${estimatedCost.toFixed(4)}`,
      });
    }
  } catch (error) {
    console.error('Error tracking AI cost:', error);
  }
};

/**
 * Trackea errores de IA
 */
export const trackAIError = (provider, errorCode, errorMessage) => {
  try {
    if (analytics) {
      logEvent(analytics, 'ai_error', {
        provider,
        error_code: errorCode,
        error_message: errorMessage,
        timestamp: new Date().toISOString(),
      });
    }

    console.error('❌ AI Error:', {
      provider,
      code: errorCode,
      message: errorMessage,
    });
  } catch (error) {
    console.error('Error tracking AI error:', error);
  }
};

/**
 * Trackea satisfacción del usuario con respuestas de IA
 */
export const trackAIFeedback = (provider, model, rating, feedback = '') => {
  try {
    if (analytics) {
      logEvent(analytics, 'ai_feedback', {
        provider,
        model,
        rating,
        feedback,
        timestamp: new Date().toISOString(),
      });
    }

    console.log('⭐ AI Feedback:', {
      provider,
      model,
      rating: `${rating}/5`,
    });
  } catch (error) {
    console.error('Error tracking AI feedback:', error);
  }
};

/**
 * Trackea tiempos de respuesta de IA
 */
export const trackAIPerformance = (provider, operation, duration) => {
  try {
    if (analytics) {
      logEvent(analytics, 'ai_performance', {
        provider,
        operation,
        duration,
        timestamp: new Date().toISOString(),
      });
    }

    if (import.meta.env.DEV) {
      console.log('⚡ AI Performance:', {
        provider,
        operation,
        duration: `${duration}ms`,
      });
    }
  } catch (error) {
    console.error('Error tracking AI performance:', error);
  }
};

export default {
  trackAIRequest,
  trackAIFeature,
  trackAICost,
  trackAIError,
  trackAIFeedback,
  trackAIPerformance,
};
