/**
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║                   CHRONOS OPENTELEMETRY TRACING                            ║
 * ║              Configuración de tracing para observabilidad                  ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 * Sistema de tracing distribuido usando OpenTelemetry para:
 * - Monitoreo de operaciones de Firebase
 * - Tracking de transacciones bancarias
 * - Performance de componentes React
 * - Detección de errores y cuellos de botella
 *
 * @module Tracing
 * @requires @opentelemetry/api
 * @requires @opentelemetry/sdk-trace-web
 */
import { trace } from '@opentelemetry/api';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { FetchInstrumentation } from '@opentelemetry/instrumentation-fetch';
import { XMLHttpRequestInstrumentation } from '@opentelemetry/instrumentation-xml-http-request';
import { BatchSpanProcessor, WebTracerProvider } from '@opentelemetry/sdk-trace-web';
import { ATTR_SERVICE_NAME, ATTR_SERVICE_VERSION } from '@opentelemetry/semantic-conventions';

// ============================================================================
// CONFIGURATION
// ============================================================================

const OTLP_ENDPOINT = import.meta.env.VITE_OTLP_ENDPOINT || 'http://localhost:4318/v1/traces';
const SERVICE_NAME = 'chronos-premium-ecosystem';
const SERVICE_VERSION = '3.0.0';
const ENVIRONMENT = import.meta.env.MODE || 'development';

// ============================================================================
// TRACER PROVIDER SETUP
// ============================================================================

let provider = null;
let isInitialized = false;

/**
 * Inicializa el sistema de tracing con OpenTelemetry
 */
export function initializeTracing() {
  if (isInitialized) {
    console.warn('[Tracing] Ya inicializado, omitiendo...');
    return;
  }

  try {
    console.log('[Tracing] Inicializando OpenTelemetry...');

    // Crear recurso con metadata del servicio
    const resource = new Resource({
      [ATTR_SERVICE_NAME]: SERVICE_NAME,
      [ATTR_SERVICE_VERSION]: SERVICE_VERSION,
      environment: ENVIRONMENT,
      'app.name': 'CHRONOS System',
      'app.type': 'web',
    });

    // Crear provider
    provider = new WebTracerProvider({
      resource,
    });

    // Configurar exporter OTLP
    const exporter = new OTLPTraceExporter({
      url: OTLP_ENDPOINT,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Agregar span processor con batch para optimizar
    provider.addSpanProcessor(
      new BatchSpanProcessor(exporter, {
        maxQueueSize: 100,
        maxExportBatchSize: 10,
        scheduledDelayMillis: 500,
      })
    );

    // Registrar provider globalmente
    provider.register();

    // Instrumentación automática de Fetch API
    new FetchInstrumentation({
      propagateTraceHeaderCorsUrls: [
        /^https:\/\/.*\.firebaseio\.com/,
        /^https:\/\/.*\.googleapis\.com/,
        /^https:\/\/firestore\.googleapis\.com/,
      ],
      clearTimingResources: true,
      applyCustomAttributesOnSpan: (span, request) => {
        span.setAttribute('http.url', request.url);
        span.setAttribute('http.method', request.method);
      },
    }).enable();

    // Instrumentación automática de XMLHttpRequest
    new XMLHttpRequestInstrumentation({
      propagateTraceHeaderCorsUrls: [
        /^https:\/\/.*\.firebaseio\.com/,
        /^https:\/\/.*\.googleapis\.com/,
      ],
    }).enable();

    isInitialized = true;
    console.log('[Tracing] ✅ OpenTelemetry inicializado correctamente');
    console.log(`[Tracing] 📡 OTLP Endpoint: ${OTLP_ENDPOINT}`);
    console.log(`[Tracing] 🏷️  Service: ${SERVICE_NAME}@${SERVICE_VERSION}`);
  } catch (error) {
    console.error('[Tracing] ❌ Error al inicializar:', error);
  }
}

/**
 * Detiene el sistema de tracing y libera recursos
 */
export async function shutdownTracing() {
  if (provider) {
    try {
      await provider.shutdown();
      isInitialized = false;
      console.log('[Tracing] 🛑 Sistema de tracing detenido');
    } catch (error) {
      console.error('[Tracing] Error al detener tracing:', error);
    }
  }
}

// ============================================================================
// TRACER UTILITIES
// ============================================================================

/**
 * Obtiene el tracer para un componente específico
 */
export function getTracer(name = 'default') {
  return trace.getTracer(name, SERVICE_VERSION);
}

/**
 * Crea un span manualmente para operaciones personalizadas
 *
 * @param {string} name - Nombre del span
 * @param {Function} fn - Función a ejecutar dentro del span
 * @param {Object} attributes - Atributos adicionales del span
 */
export async function withSpan(name, fn, attributes = {}) {
  const tracer = getTracer('chronos.custom');
  return tracer.startActiveSpan(name, async (span) => {
    try {
      // Agregar atributos personalizados
      Object.entries(attributes).forEach(([key, value]) => {
        span.setAttribute(key, value);
      });

      // Ejecutar función
      const result = await fn(span);

      // Marcar como exitoso
      span.setStatus({ code: 1 }); // OK
      return result;
    } catch (error) {
      // Registrar error en el span
      span.recordException(error);
      span.setStatus({ code: 2, message: error.message }); // ERROR
      throw error;
    } finally {
      span.end();
    }
  });
}

/**
 * Decorator para trazar funciones automáticamente
 */
export function traced(operationName, attributes = {}) {
  return function (target, propertyKey, descriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args) {
      return withSpan(
        operationName || `${target.constructor.name}.${propertyKey}`,
        async (span) => {
          span.setAttribute('function.name', propertyKey);
          span.setAttribute('function.args', JSON.stringify(args));
          Object.entries(attributes).forEach(([key, value]) => {
            span.setAttribute(key, value);
          });

          return originalMethod.apply(this, args);
        }
      );
    };

    return descriptor;
  };
}

// ============================================================================
// FIREBASE TRACING HELPERS
// ============================================================================

/**
 * Traza operaciones de Firestore
 */
export async function traceFirestoreOperation(operationName, collectionName, fn) {
  return withSpan(
    `firestore.${operationName}`,
    async (span) => {
      span.setAttribute('db.system', 'firestore');
      span.setAttribute('db.operation', operationName);
      span.setAttribute('db.collection', collectionName);
      span.setAttribute('db.provider', 'firebase');

      const startTime = performance.now();
      const result = await fn(span);
      const duration = performance.now() - startTime;

      span.setAttribute('db.duration_ms', duration);
      span.addEvent('operation_completed', {
        duration_ms: duration,
        result_count: Array.isArray(result) ? result.length : 1,
      });

      return result;
    },
    {
      'service.type': 'database',
    }
  );
}

/**
 * Traza operaciones de autenticación
 */
export async function traceAuthOperation(operationName, fn) {
  return withSpan(
    `auth.${operationName}`,
    async (span) => {
      span.setAttribute('auth.operation', operationName);
      span.setAttribute('auth.provider', 'firebase');

      return fn(span);
    },
    {
      'service.type': 'auth',
    }
  );
}

/**
 * Traza operaciones de Storage
 */
export async function traceStorageOperation(operationName, path, fn) {
  return withSpan(
    `storage.${operationName}`,
    async (span) => {
      span.setAttribute('storage.operation', operationName);
      span.setAttribute('storage.path', path);
      span.setAttribute('storage.provider', 'firebase');

      return fn(span);
    },
    {
      'service.type': 'storage',
    }
  );
}

// ============================================================================
// TRANSACTION TRACING
// ============================================================================

/**
 * Traza transacciones bancarias
 */
export async function traceTransaction(transactionType, data, fn) {
  return withSpan(
    `transaction.${transactionType}`,
    async (span) => {
      span.setAttribute('transaction.type', transactionType);
      span.setAttribute('transaction.amount', data.monto || 0);
      span.setAttribute('transaction.from', data.bancoOrigen || 'N/A');
      span.setAttribute('transaction.to', data.bancoDestino || 'N/A');
      span.setAttribute('transaction.concept', data.concepto || 'N/A');

      const result = await fn(span);

      span.addEvent('transaction_completed', {
        status: 'success',
        transaction_id: result?.id || 'unknown',
      });

      return result;
    },
    {
      'service.type': 'banking',
      'transaction.service': 'chronos',
    }
  );
}

// ============================================================================
// REACT COMPONENT TRACING
// ============================================================================

/**
 * Hook para trazar renders de componentes React
 */
export function useTracing(componentName) {
  const tracer = getTracer('chronos.react');

  return {
    traceRender: (props = {}) => {
      const span = tracer.startSpan(`render.${componentName}`);
      span.setAttribute('component.name', componentName);
      span.setAttribute('component.type', 'react');
      Object.entries(props).forEach(([key, value]) => {
        span.setAttribute(`prop.${key}`, String(value));
      });
      span.end();
    },

    traceEvent: (eventName, data = {}) => {
      const span = tracer.startSpan(`event.${componentName}.${eventName}`);
      span.setAttribute('event.name', eventName);
      span.setAttribute('component.name', componentName);
      Object.entries(data).forEach(([key, value]) => {
        span.setAttribute(`event.${key}`, String(value));
      });
      span.end();
    },
  };
}

// ============================================================================
// PERFORMANCE MONITORING
// ============================================================================

/**
 * Mide y traza el tiempo de carga de recursos
 */
export function traceResourceLoading() {
  if (!window.performance) return;

  const tracer = getTracer('chronos.performance');

  // Navigation Timing
  const navTiming = performance.getEntriesByType('navigation')[0];
  if (navTiming) {
    const span = tracer.startSpan('page.load');
    span.setAttribute('load.dns', navTiming.domainLookupEnd - navTiming.domainLookupStart);
    span.setAttribute('load.tcp', navTiming.connectEnd - navTiming.connectStart);
    span.setAttribute('load.request', navTiming.responseStart - navTiming.requestStart);
    span.setAttribute('load.response', navTiming.responseEnd - navTiming.responseStart);
    span.setAttribute('load.dom', navTiming.domComplete - navTiming.domLoading);
    span.setAttribute('load.total', navTiming.loadEventEnd - navTiming.fetchStart);
    span.end();
  }

  // Resource Timing
  const resources = performance.getEntriesByType('resource');
  resources.slice(0, 50).forEach((resource) => {
    const span = tracer.startSpan(`resource.${resource.initiatorType}`);
    span.setAttribute('resource.name', resource.name);
    span.setAttribute('resource.duration', resource.duration);
    span.setAttribute('resource.size', resource.transferSize);
    span.setAttribute('resource.type', resource.initiatorType);
    span.end();
  });
}

// ============================================================================
// ERROR TRACKING
// ============================================================================

/**
 * Captura y traza errores no manejados
 */
export function setupErrorTracking() {
  const tracer = getTracer('chronos.errors');

  window.addEventListener('error', (event) => {
    const span = tracer.startSpan('error.unhandled');
    span.setAttribute('error.message', event.message);
    span.setAttribute('error.filename', event.filename);
    span.setAttribute('error.lineno', event.lineno);
    span.setAttribute('error.colno', event.colno);
    span.recordException(event.error);
    span.setStatus({ code: 2, message: event.message });
    span.end();
  });

  window.addEventListener('unhandledrejection', (event) => {
    const span = tracer.startSpan('error.unhandled_promise');
    span.setAttribute('error.reason', String(event.reason));
    span.recordException(event.reason);
    span.setStatus({ code: 2, message: String(event.reason) });
    span.end();
  });
}

// ============================================================================
// AUTO INITIALIZATION
// ============================================================================

// Inicializar automáticamente en desarrollo
if (import.meta.env.DEV || import.meta.env.VITE_ENABLE_TRACING === 'true') {
  initializeTracing();
  setupErrorTracking();

  // Trazar carga de recursos después de que la página cargue
  window.addEventListener('load', () => {
    setTimeout(traceResourceLoading, 1000);
  });
}

// Cleanup al cerrar la aplicación
window.addEventListener('beforeunload', () => {
  shutdownTracing();
});

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  initializeTracing,
  shutdownTracing,
  getTracer,
  withSpan,
  traced,
  traceFirestoreOperation,
  traceAuthOperation,
  traceStorageOperation,
  traceTransaction,
  useTracing,
  traceResourceLoading,
  setupErrorTracking,
};
