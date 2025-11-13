#!/usr/bin/env node
/**
 * API Performance Metrics
 * Mide el rendimiento de endpoints de la API
 */
import http from 'http';
import https from 'https';

const API_ENDPOINTS = [
  {
    name: 'Firebase Firestore API',
    url: `https://firestore.googleapis.com/v1/projects/${process.env.VITE_FIREBASE_PROJECT_ID}/databases/(default)/documents`,
    method: 'GET',
    timeout: 5000,
  },
  {
    name: 'Firebase Auth API',
    url: `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${process.env.VITE_FIREBASE_API_KEY}`,
    method: 'POST',
    timeout: 5000,
  },
  {
    name: 'Firebase Storage API',
    url: `https://firebasestorage.googleapis.com/v0/b/${process.env.VITE_FIREBASE_STORAGE_BUCKET}/o`,
    method: 'GET',
    timeout: 5000,
  },
];

async function measureEndpoint(endpoint) {
  return new Promise((resolve) => {
    const startTime = Date.now();
    const url = new URL(endpoint.url);
    const client = url.protocol === 'https:' ? https : http;

    const options = {
      hostname: url.hostname,
      path: url.pathname + url.search,
      method: endpoint.method,
      timeout: endpoint.timeout,
      headers: {
        'User-Agent': 'PremiumEcosystem-Metrics/1.0',
      },
    };

    const req = client.request(options, (res) => {
      const duration = Date.now() - startTime;

      res.on('data', () => {});
      res.on('end', () => {
        resolve({
          name: endpoint.name,
          success: true,
          statusCode: res.statusCode,
          duration,
          timestamp: new Date().toISOString(),
        });
      });
    });

    req.on('error', (error) => {
      resolve({
        name: endpoint.name,
        success: false,
        duration: Date.now() - startTime,
        error: error.message,
        timestamp: new Date().toISOString(),
      });
    });

    req.on('timeout', () => {
      req.destroy();
      resolve({
        name: endpoint.name,
        success: false,
        duration: endpoint.timeout,
        error: 'Timeout',
        timestamp: new Date().toISOString(),
      });
    });

    req.end();
  });
}

async function measureAPIPerformance() {
  console.log('⚡ Iniciando medición de performance de API...\n');

  const results = {
    timestamp: new Date().toISOString(),
    endpoints: [],
    metrics: {
      totalRequests: 0,
      successfulRequests: 0,
      failedRequests: 0,
      avgDuration: 0,
      minDuration: Infinity,
      maxDuration: 0,
      slowEndpoints: [],
    },
  };

  try {
    // Medir cada endpoint
    for (const endpoint of API_ENDPOINTS) {
      console.log(`📡 Midiendo: ${endpoint.name}`);

      const measurement = await measureEndpoint(endpoint);
      results.endpoints.push(measurement);
      results.metrics.totalRequests++;

      if (measurement.success) {
        results.metrics.successfulRequests++;
        const icon = measurement.duration < 1000 ? '✅' : '⚠️';
        console.log(`  ${icon} ${measurement.statusCode} - ${measurement.duration}ms`);
      } else {
        results.metrics.failedRequests++;
        console.log(`  ❌ Error: ${measurement.error}`);
      }
    }

    // Calcular métricas
    const successfulMeasurements = results.endpoints.filter((e) => e.success);

    if (successfulMeasurements.length > 0) {
      const durations = successfulMeasurements.map((e) => e.duration);
      results.metrics.avgDuration = Math.round(
        durations.reduce((a, b) => a + b, 0) / durations.length
      );
      results.metrics.minDuration = Math.min(...durations);
      results.metrics.maxDuration = Math.max(...durations);

      results.metrics.slowEndpoints = successfulMeasurements
        .filter((e) => e.duration > 1000)
        .sort((a, b) => b.duration - a.duration)
        .map((e) => ({
          name: e.name,
          duration: e.duration,
        }));
    }

    // Resumen
    console.log('\n═══════════════════════════════════════');
    console.log('📊 MÉTRICAS DE API');
    console.log('═══════════════════════════════════════');
    console.log(`Total: ${results.metrics.totalRequests}`);
    console.log(`✅ Exitosas: ${results.metrics.successfulRequests}`);
    console.log(`❌ Fallidas: ${results.metrics.failedRequests}`);
    console.log(`⚡ Promedio: ${results.metrics.avgDuration}ms`);
    console.log(`🐢 Máximo: ${results.metrics.maxDuration}ms`);
    console.log(`🚀 Mínimo: ${results.metrics.minDuration}ms`);

    if (results.metrics.slowEndpoints.length > 0) {
      console.log('\n⚠️ ENDPOINTS LENTOS (>1s):');
      results.metrics.slowEndpoints.forEach((e) => {
        console.log(`  - ${e.name}: ${e.duration}ms`);
      });
    }
  } catch (error) {
    console.error('\n❌ Error en medición:', error);
    results.error = error.message;
  }

  console.log('\n--- API METRICS RESULTS ---');
  console.log(JSON.stringify(results, null, 2));

  // Exit code: 1 si hay endpoints fallidos o muy lentos
  const hasFailures = results.metrics.failedRequests > 0;
  const hasCriticalSlow = results.metrics.slowEndpoints.some((e) => e.duration > 3000);

  process.exit(hasFailures || hasCriticalSlow ? 1 : 0);
}

measureAPIPerformance();
