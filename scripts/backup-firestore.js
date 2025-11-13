#!/usr/bin/env node
/**
 * Backup Firestore Database
 * Crea un backup completo de todas las colecciones de Firestore
 */
import { cert, initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import fs from 'fs';
import path from 'path';

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT || '{}');

initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore();

async function backupCollection(collectionName, outputDir) {
  const snapshot = await db.collection(collectionName).get();

  if (snapshot.empty) {
    return { count: 0, size: 0 };
  }

  const data = {};
  snapshot.forEach((doc) => {
    data[doc.id] = doc.data();
  });

  const filePath = path.join(outputDir, `${collectionName}.json`);
  const jsonData = JSON.stringify(data, null, 2);
  fs.writeFileSync(filePath, jsonData);

  return {
    count: snapshot.size,
    size: Buffer.byteLength(jsonData, 'utf8'),
  };
}

async function backupFirestore() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupDir = path.join(process.cwd(), 'backups', `backup_${timestamp}`);

  console.log('💾 Iniciando backup de Firestore...\n');
  console.log(`📁 Directorio: ${backupDir}\n`);

  // Crear directorio de backup
  fs.mkdirSync(backupDir, { recursive: true });

  const results = {
    timestamp: new Date().toISOString(),
    directory: backupDir,
    collections: {},
    totals: {
      collections: 0,
      documents: 0,
      size: 0,
    },
  };

  try {
    // Obtener todas las colecciones
    const collections = await db.listCollections();
    console.log(`📊 Colecciones encontradas: ${collections.length}\n`);

    // Backup de cada colección
    for (const collection of collections) {
      const collectionName = collection.id;
      console.log(`  📄 Respaldando: ${collectionName}`);

      try {
        const stats = await backupCollection(collectionName, backupDir);

        results.collections[collectionName] = {
          documents: stats.count,
          size: stats.size,
          file: `${collectionName}.json`,
        };

        results.totals.collections++;
        results.totals.documents += stats.count;
        results.totals.size += stats.size;

        console.log(`    ✅ ${stats.count} documentos (${(stats.size / 1024).toFixed(2)} KB)`);
      } catch (error) {
        console.error(`    ❌ Error: ${error.message}`);
        results.collections[collectionName] = {
          error: error.message,
        };
      }
    }

    // Guardar metadata
    const metadataPath = path.join(backupDir, '_metadata.json');
    fs.writeFileSync(metadataPath, JSON.stringify(results, null, 2));

    console.log('\n═══════════════════════════════════════');
    console.log('✅ BACKUP COMPLETADO');
    console.log('═══════════════════════════════════════');
    console.log(`📁 Directorio: ${backupDir}`);
    console.log(`📊 Colecciones: ${results.totals.collections}`);
    console.log(`📄 Documentos: ${results.totals.documents}`);
    console.log(`💾 Tamaño: ${(results.totals.size / 1024 / 1024).toFixed(2)} MB`);
  } catch (error) {
    console.error('\n❌ Error en backup:', error);
    throw error;
  }

  console.log('\n--- BACKUP RESULTS ---');
  console.log(JSON.stringify(results, null, 2));

  return results;
}

backupFirestore()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
