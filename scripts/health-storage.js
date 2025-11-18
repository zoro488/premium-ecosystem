#!/usr/bin/env node
/**
 * Health Check - Firebase Storage
 * Verifica el estado del servicio de almacenamiento
 */
import { initializeApp } from 'firebase/app';
import { getStorage, listAll, ref } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
};

async function checkStorageHealth() {
  const startTime = Date.now();
  const results = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    checks: [],
    metrics: {},
  };

  try {
    console.log('🔍 Iniciando health check de Firebase Storage...\n');

    const app = initializeApp(firebaseConfig);
    const storage = getStorage(app);

    console.log('✓ Firebase Storage inicializado');
    results.checks.push({ name: 'storage_init', status: 'pass' });

    // Check 1: Acceso al bucket
    const storageRef = ref(storage);
    const listStart = Date.now();

    try {
      const result = await listAll(storageRef);
      const listTime = Date.now() - listStart;

      console.log(`✓ Acceso al bucket exitoso (${listTime}ms)`);
      console.log(`  Carpetas encontradas: ${result.prefixes.length}`);
      console.log(`  Archivos en raíz: ${result.items.length}`);

      results.checks.push({
        name: 'bucket_access',
        status: 'pass',
        latency: listTime,
      });
      results.metrics.listLatency = listTime;
      results.metrics.foldersCount = result.prefixes.length;
      results.metrics.filesCount = result.items.length;
    } catch (error) {
      if (error.code === 'storage/unauthorized') {
        console.log('⚠ Sin archivos o permisos limitados (normal en nuevo proyecto)');
        results.checks.push({
          name: 'bucket_access',
          status: 'warn',
          message: 'No files or limited permissions',
        });
      } else {
        throw error;
      }
    }

    // Resumen
    const totalTime = Date.now() - startTime;
    results.metrics.totalCheckTime = totalTime;

    console.log(`\n✅ Health check completado en ${totalTime}ms`);
    console.log(`Estado: ${results.status.toUpperCase()}`);
  } catch (error) {
    console.error('\n❌ Error en health check de Storage:', error);
    results.status = 'unhealthy';
    results.error = error.message;
    results.checks.push({
      name: 'storage_check',
      status: 'fail',
      error: error.message,
    });
    process.exit(1);
  }

  console.log('\n--- HEALTH CHECK RESULTS ---');
  console.log(JSON.stringify(results, null, 2));

  process.exit(results.status === 'healthy' ? 0 : 1);
}

checkStorageHealth();
