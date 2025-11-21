#!/usr/bin/env node
/**
 * Database Statistics
 * Genera estadísticas completas de la base de datos
 */
import admin from 'firebase-admin';
import { readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';





const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('📊 Estadísticas de Base de Datos\n');

try {
  // Inicializar Firebase Admin
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

  const collections = [
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

  console.log('📈 Recopilando estadísticas...\n');

  const stats = {
    totalDocuments: 0,
    collections: {},
    timestamp: new Date().toISOString(),
  };

  for (const collection of collections) {
    try {
      const snapshot = await db.collection(collection).count().get();
      const count = snapshot.data().count;

      stats.collections[collection] = {
        count,
        status: count > 0 ? 'active' : 'empty',
      };

      stats.totalDocuments += count;

      const status = count > 0 ? '✅' : '⚠️ ';
      console.log(`${status} ${collection.padEnd(20)} ${count} documentos`);
    } catch (error) {
      stats.collections[collection] = {
        count: 0,
        status: 'error',
        error: error.message,
      };
      console.log(`❌ ${collection.padEnd(20)} Error`);
    }
  }

  console.log('\n' + '='.repeat(50));
  console.log(`📊 Total de documentos: ${stats.totalDocuments}`);
  console.log(`📅 Fecha: ${new Date().toLocaleString()}`);
  console.log('='.repeat(50));

  // Guardar estadísticas en JSON
  const outputPath = join(__dirname, '..', 'database-stats.json');
  await import('fs/promises').then((fs) =>
    fs.writeFile(outputPath, JSON.stringify(stats, null, 2))
  );

  console.log(`\n💾 Estadísticas guardadas en: database-stats.json`);

  process.exit(0);
} catch (error) {
  console.error('\n❌ Error al recopilar estadísticas:', error.message);
  process.exit(1);
}
