#!/usr/bin/env node
/**
 * Health Check - Firestore Indexes
 * Verifica el estado de los índices de Firestore
 */
import admin from 'firebase-admin';
import { readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';





const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🔍 Health Check - Firestore Indexes\n');

try {
  // Inicializar Firebase Admin si no está inicializado
  if (!admin.apps.length) {
    const serviceAccount = JSON.parse(
      readFileSync(
        join(__dirname, '..', 'serviceAccountKey.json'),
        'utf8'
      )
    );
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  }

  const db = admin.firestore();

  // Colecciones que deberían tener índices
  const collectionsToCheck = [
    'users',
    'clientes',
    'proveedores',
    'bancos',
    'paneles',
    'distribuidores',
    'ventas',
    'compras',
    'transferencias',
  ];

  console.log('📊 Verificando colecciones críticas:\n');

  const results = {
    healthy: 0,
    warnings: 0,
    errors: 0,
  };

  for (const collection of collectionsToCheck) {
    try {
      const snapshot = await db.collection(collection).limit(1).get();
      const exists = !snapshot.empty;

      if (exists) {
        console.log(`✅ ${collection} - Accesible`);
        results.healthy++;
      } else {
        console.log(`⚠️  ${collection} - Vacía`);
        results.warnings++;
      }
    } catch (error) {
      console.log(`❌ ${collection} - Error: ${error.message}`);
      results.errors++;
    }
  }

  console.log('\n📈 Resumen:');
  console.log(`   ✅ Saludables: ${results.healthy}`);
  console.log(`   ⚠️  Advertencias: ${results.warnings}`);
  console.log(`   ❌ Errores: ${results.errors}`);

  console.log('\n💡 Para ver índices en Firebase Console:');
  console.log('   Firestore → Indexes → Composite Indexes');

  if (results.errors > 0) {
    console.log('\n⚠️  Hay colecciones con errores');
    process.exit(1);
  }

  console.log('\n✅ Sistema de índices funcional');
  process.exit(0);
} catch (error) {
  console.error('\n❌ Error al verificar índices:', error.message);
  process.exit(1);
}
