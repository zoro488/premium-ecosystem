#!/usr/bin/env node
/**
 * ============================================
 * LIMPIADOR DE FIRESTORE
 * ============================================
 * Elimina todas las colecciones para empezar limpio
 */
import dotenv from 'dotenv';
import admin from 'firebase-admin';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '..', '.env') });

let db;

async function initializeFirebase() {
  const projectId = process.env.FIREBASE_PROJECT_ID || 'premium-ecosystem-1760790572';

  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    projectId: projectId,
  });

  db = admin.firestore();
  console.log(`✓ Conectado a: ${projectId}\n`);
}

async function eliminarColeccion(coleccionNombre) {
  const batchSize = 500;
  let deleted = 0;

  const query = db.collection(coleccionNombre);

  return new Promise((resolve, reject) => {
    eliminarQueryBatch(query, batchSize, resolve, reject);
  });

  async function eliminarQueryBatch(query, batchSize, resolve, reject) {
    try {
      const snapshot = await query.limit(batchSize).get();

      if (snapshot.size === 0) {
        resolve(deleted);
        return;
      }

      const batch = db.batch();
      snapshot.docs.forEach((doc) => {
        batch.delete(doc.ref);
      });

      await batch.commit();
      deleted += snapshot.size;

      process.stdout.write(`\r   Eliminando ${coleccionNombre}... ${deleted} docs`);

      // Recursión para el siguiente batch
      process.nextTick(() => {
        eliminarQueryBatch(query, batchSize, resolve, reject);
      });
    } catch (error) {
      reject(error);
    }
  }
}

async function main() {
  console.log('═'.repeat(80));
  console.log('  🗑️  LIMPIADOR DE FIRESTORE');
  console.log('═'.repeat(80));
  console.log();

  try {
    await initializeFirebase();

    const colecciones = [
      'bancos',
      'bancosRfActual',
      'gastos',
      'clientes',
      'distribuidores',
      'ordenesCompra',
      'ventas',
      'almacenIngresos',
      'almacenRfActual',
      'almacenSalidas',
      'almacenStockDisponible',
      'estadoGlobal',
    ];

    console.log('⚠️  ADVERTENCIA: Esto eliminará TODAS las colecciones');
    console.log('   Presiona Ctrl+C para cancelar...\n');

    // Esperar 3 segundos
    await new Promise((resolve) => setTimeout(resolve, 3000));

    for (const col of colecciones) {
      try {
        const count = await eliminarColeccion(col);
        console.log(`\r✅ ${col.padEnd(30)} - ${count} documentos eliminados`);
      } catch (error) {
        console.log(`\r❌ ${col.padEnd(30)} - Error: ${error.message}`);
      }
    }

    console.log();
    console.log('═'.repeat(80));
    console.log('✅ Limpieza completada');
    console.log('═'.repeat(80));
    console.log();
    console.log('💡 Ahora ejecuta: npm run import:json');
    console.log();

    process.exit(0);
  } catch (error) {
    console.error('❌ Error fatal:', error.message);
    process.exit(1);
  }
}

main();
