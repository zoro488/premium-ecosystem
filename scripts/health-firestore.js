#!/usr/bin/env node
/**
 * Health Check - Firestore Database
 * Verifica el estado y disponibilidad de Firestore
 */
import { initializeApp } from 'firebase/app';
import { collection, getDocs, getFirestore, limit, query } from 'firebase/firestore';

// Configuración de Firebase desde variables de entorno
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
};

async function checkFirestoreHealth() {
  const startTime = Date.now();
  const results = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    checks: [],
    metrics: {},
  };

  try {
    console.log('🔍 Iniciando health check de Firestore...\n');

    // Inicializar Firebase
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);

    // Check 1: Conectividad básica
    console.log('✓ Conexión a Firebase establecida');
    results.checks.push({ name: 'connection', status: 'pass' });

    // Check 2: Verificar colecciones críticas
    const criticalCollections = [
      'users',
      'clientes',
      'proveedores',
      'bancos',
      'paneles',
      'distribuidores',
    ];

    for (const collectionName of criticalCollections) {
      try {
        const collRef = collection(db, collectionName);
        const q = query(collRef, limit(1));
        const snapshot = await getDocs(q);

        const exists = !snapshot.empty;
        console.log(
          `${exists ? '✓' : '⚠'} Colección "${collectionName}": ${exists ? 'OK' : 'Vacía'}`
        );

        results.checks.push({
          name: `collection_${collectionName}`,
          status: exists ? 'pass' : 'warn',
          message: exists ? 'Collection accessible' : 'Collection empty',
        });
      } catch (error) {
        console.error(`✗ Error en colección "${collectionName}":`, error.message);
        results.checks.push({
          name: `collection_${collectionName}`,
          status: 'fail',
          error: error.message,
        });
        results.status = 'unhealthy';
      }
    }

    // Check 3: Latencia de lectura
    const latencyStart = Date.now();
    const testQuery = query(collection(db, 'users'), limit(1));
    await getDocs(testQuery);
    const latency = Date.now() - latencyStart;

    console.log(`\n📊 Latencia de lectura: ${latency}ms`);
    results.metrics.readLatency = latency;

    if (latency > 1000) {
      console.warn('⚠ Latencia alta detectada');
      results.checks.push({
        name: 'latency',
        status: 'warn',
        message: `High latency: ${latency}ms`,
      });
    } else {
      results.checks.push({
        name: 'latency',
        status: 'pass',
        message: `Latency OK: ${latency}ms`,
      });
    }

    // Resumen
    const totalTime = Date.now() - startTime;
    results.metrics.totalCheckTime = totalTime;

    console.log(`\n✅ Health check completado en ${totalTime}ms`);
    console.log(`Estado: ${results.status.toUpperCase()}`);
  } catch (error) {
    console.error('\n❌ Error crítico en health check:', error);
    results.status = 'unhealthy';
    results.error = error.message;
    process.exit(1);
  }

  // Output JSON para parsing
  console.log('\n--- HEALTH CHECK RESULTS ---');
  console.log(JSON.stringify(results, null, 2));

  // Exit code basado en el estado
  process.exit(results.status === 'healthy' ? 0 : 1);
}

checkFirestoreHealth();
