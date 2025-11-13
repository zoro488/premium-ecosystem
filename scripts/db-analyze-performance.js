#!/usr/bin/env node
/**
 * Database Performance Analysis
 * Analiza el rendimiento de consultas a Firestore
 */
import { cert, initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT || '{}');

initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore();

async function measureQueryPerformance(collectionName, queryFn, label) {
  const start = Date.now();

  try {
    const result = await queryFn(db.collection(collectionName));
    const duration = Date.now() - start;

    return {
      label,
      collection: collectionName,
      success: true,
      duration,
      count: result.size || result.length,
    };
  } catch (error) {
    return {
      label,
      collection: collectionName,
      success: false,
      duration: Date.now() - start,
      error: error.message,
    };
  }
}

async function analyzePerformance() {
  console.log('⚡ Iniciando análisis de rendimiento de base de datos...\n');

  const results = {
    timestamp: new Date().toISOString(),
    queries: [],
    metrics: {
      avgDuration: 0,
      slowQueries: [],
      fastQueries: [],
    },
  };

  const testCollections = ['users', 'clientes', 'proveedores', 'bancos', 'paneles'];

  // Test 1: Query completa (limit 100)
  for (const collection of testCollections) {
    const result = await measureQueryPerformance(
      collection,
      async (col) => await col.limit(100).get(),
      `${collection} - Get 100 docs`
    );

    results.queries.push(result);

    const icon = result.success ? '✓' : '✗';
    const duration = result.duration;
    const warning = duration > 1000 ? ' ⚠️ SLOW' : '';

    console.log(`  ${icon} ${result.label}: ${duration}ms${warning}`);
  }

  // Test 2: Count query
  for (const collection of testCollections) {
    const result = await measureQueryPerformance(
      collection,
      async (col) => {
        const snapshot = await col.count().get();
        return { size: snapshot.data().count };
      },
      `${collection} - Count`
    );

    results.queries.push(result);

    const icon = result.success ? '✓' : '✗';
    console.log(`  ${icon} ${result.label}: ${result.duration}ms (${result.count} docs)`);
  }

  // Test 3: Single document read
  for (const collection of testCollections) {
    const result = await measureQueryPerformance(
      collection,
      async (col) => {
        const snapshot = await col.limit(1).get();
        return snapshot;
      },
      `${collection} - Single doc`
    );

    results.queries.push(result);
  }

  // Calcular métricas
  const durations = results.queries.filter((q) => q.success).map((q) => q.duration);

  results.metrics.avgDuration = Math.round(durations.reduce((a, b) => a + b, 0) / durations.length);

  results.metrics.slowQueries = results.queries
    .filter((q) => q.success && q.duration > 1000)
    .sort((a, b) => b.duration - a.duration);

  results.metrics.fastQueries = results.queries
    .filter((q) => q.success && q.duration < 100)
    .sort((a, b) => a.duration - b.duration);

  console.log('\n═══════════════════════════════════════');
  console.log('📊 MÉTRICAS DE RENDIMIENTO');
  console.log('═══════════════════════════════════════');
  console.log(`Promedio: ${results.metrics.avgDuration}ms`);
  console.log(`Queries lentas: ${results.metrics.slowQueries.length}`);
  console.log(`Queries rápidas: ${results.metrics.fastQueries.length}`);

  if (results.metrics.slowQueries.length > 0) {
    console.log('\n⚠️ QUERIES LENTAS:');
    results.metrics.slowQueries.slice(0, 5).forEach((q) => {
      console.log(`  - ${q.label}: ${q.duration}ms`);
    });
  }

  console.log('\n--- PERFORMANCE ANALYSIS RESULTS ---');
  console.log(JSON.stringify(results, null, 2));

  // Exit code: 1 si hay queries muy lentas (>2s)
  const criticalSlow = results.metrics.slowQueries.filter((q) => q.duration > 2000);
  process.exit(criticalSlow.length > 0 ? 1 : 0);
}

analyzePerformance();
