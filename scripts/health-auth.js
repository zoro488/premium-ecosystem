#!/usr/bin/env node
/**
 * Health Check - Firebase Authentication
 * Verifica el estado del servicio de autenticación
 */
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signOut } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
};

async function checkAuthHealth() {
  const startTime = Date.now();
  const results = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    checks: [],
    metrics: {},
  };

  try {
    console.log('🔍 Iniciando health check de Firebase Auth...\n');

    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);

    console.log('✓ Servicio de autenticación inicializado');
    results.checks.push({ name: 'auth_init', status: 'pass' });

    // Check 1: Autenticación anónima
    console.log('🔐 Probando autenticación anónima...');
    const authStart = Date.now();
    const userCredential = await signInAnonymously(auth);
    const authTime = Date.now() - authStart;

    console.log(`✓ Autenticación exitosa (${authTime}ms)`);
    console.log(`  User ID: ${userCredential.user.uid}`);

    results.checks.push({
      name: 'anonymous_signin',
      status: 'pass',
      latency: authTime,
    });
    results.metrics.authLatency = authTime;

    // Check 2: Sign out
    await signOut(auth);
    console.log('✓ Sign out exitoso');
    results.checks.push({ name: 'signout', status: 'pass' });

    // Resumen
    const totalTime = Date.now() - startTime;
    results.metrics.totalCheckTime = totalTime;

    console.log(`\n✅ Health check completado en ${totalTime}ms`);
    console.log(`Estado: ${results.status.toUpperCase()}`);
  } catch (error) {
    console.error('\n❌ Error en health check de Auth:', error);
    results.status = 'unhealthy';
    results.error = error.message;
    results.checks.push({
      name: 'auth_check',
      status: 'fail',
      error: error.message,
    });
    process.exit(1);
  }

  console.log('\n--- HEALTH CHECK RESULTS ---');
  console.log(JSON.stringify(results, null, 2));

  process.exit(results.status === 'healthy' ? 0 : 1);
}

checkAuthHealth();
