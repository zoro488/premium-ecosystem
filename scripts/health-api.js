#!/usr/bin/env node
/**
 * Health Check - API Endpoints
 * Verifica la disponibilidad de endpoints críticos
 */
import http from 'http';
import https from 'https';

const endpoints = [
  {
    name: 'Firebase Auth',
    url: `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${process.env.VITE_FIREBASE_API_KEY}`,
    method: 'POST',
    critical: true,
  },
  {
    name: 'Firestore API',
    url: `https://firestore.googleapis.com/v1/projects/${process.env.VITE_FIREBASE_PROJECT_ID}/databases/(default)/documents`,
    method: 'GET',
    critical: true,
  },
  {
    name: 'Firebase Storage',
    url: `https://firebasestorage.googleapis.com/v0/b/${process.env.VITE_FIREBASE_STORAGE_BUCKET}/o`,
    method: 'GET',
    critical: true,
  },
];

async function checkEndpoint(endpoint) {
  return new Promise((resolve) => {
    const startTime = Date.now();
    const url = new URL(endpoint.url);
    const client = url.protocol === 'https:' ? https : http;

    const options = {
      hostname: url.hostname,
      path: url.pathname + url.search,
      method: endpoint.method,
      timeout: 5000,
      headers: {
        'User-Agent': 'PremiumEcosystem-HealthCheck/1.0',
      },
    };

    const req = client.request(options, (res) => {
      const latency = Date.now() - startTime;
      const status = res.statusCode;

      // Consumir la respuesta
      res.on('data', () => {});
      res.on('end', () => {
        const isHealthy = status >= 200 && status < 500; // 4xx es esperado sin auth

        resolve({
          name: endpoint.name,
          status: isHealthy ? 'pass' : 'fail',
          statusCode: status,
          latency,
          critical: endpoint.critical,
        });
      });
    });

    req.on('error', (error) => {
      resolve({
        name: endpoint.name,
        status: 'fail',
        error: error.message,
        critical: endpoint.critical,
      });
    });

    req.on('timeout', () => {
      req.destroy();
      resolve({
        name: endpoint.name,
        status: 'fail',
        error: 'Timeout',
        critical: endpoint.critical,
      });
    });

    req.end();
  });
}

async function checkAPIHealth() {
  const startTime = Date.now();
  const results = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    checks: [],
    metrics: {},
  };

  try {
    console.log('🔍 Iniciando health check de API endpoints...\n');

    // Verificar todas las APIs
    const checks = await Promise.all(endpoints.map((endpoint) => checkEndpoint(endpoint)));

    let totalLatency = 0;
    let failedCritical = 0;

    for (const check of checks) {
      const icon = check.status === 'pass' ? '✓' : '✗';
      const statusText = check.statusCode ? `(${check.statusCode})` : '';
      const latencyText = check.latency ? `${check.latency}ms` : '';

      console.log(`${icon} ${check.name} ${statusText} ${latencyText}`);

      if (check.error) {
        console.log(`  Error: ${check.error}`);
      }

      results.checks.push(check);

      if (check.latency) {
        totalLatency += check.latency;
      }

      if (check.status === 'fail' && check.critical) {
        failedCritical++;
      }
    }

    // Calcular métricas
    results.metrics.averageLatency = Math.round(totalLatency / checks.length);
    results.metrics.totalEndpoints = checks.length;
    results.metrics.passedChecks = checks.filter((c) => c.status === 'pass').length;
    results.metrics.failedChecks = checks.filter((c) => c.status === 'fail').length;

    if (failedCritical > 0) {
      results.status = 'unhealthy';
      console.log(`\n⚠ ${failedCritical} endpoint(s) crítico(s) fallaron`);
    }

    const totalTime = Date.now() - startTime;
    results.metrics.totalCheckTime = totalTime;

    console.log(`\n✅ Health check completado en ${totalTime}ms`);
    console.log(`Estado: ${results.status.toUpperCase()}`);
    console.log(`Promedio de latencia: ${results.metrics.averageLatency}ms`);
  } catch (error) {
    console.error('\n❌ Error en health check de API:', error);
    results.status = 'unhealthy';
    results.error = error.message;
    process.exit(1);
  }

  console.log('\n--- HEALTH CHECK RESULTS ---');
  console.log(JSON.stringify(results, null, 2));

  process.exit(results.status === 'healthy' ? 0 : 1);
}

checkAPIHealth();
