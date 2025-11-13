/**
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║                   CHRONOS DATA MIGRATION SCRIPT                            ║
 * ║              Migración de datos JSON a Firestore                           ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 * Script para migrar datos desde BASE_DATOS_FLOWDISTRIBUTOR_UNIFICADO.json
 * a Firestore con operaciones batch para optimizar rendimiento.
 *
 * @usage node scripts/migrate-data.js
 */
import { initializeApp } from 'firebase/app';
import { Timestamp, collection, doc, getFirestore, writeBatch } from 'firebase/firestore';
import { readFile } from 'fs/promises';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

// Configuración de rutas
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuración de Firebase
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Límite de operaciones por batch (máximo 500)
const BATCH_SIZE = 500;

/**
 * Convierte fechas string a Timestamp de Firestore
 */
function convertDates(obj) {
  const converted = { ...obj };
  for (const key in converted) {
    if (typeof converted[key] === 'string' && key.includes('fecha')) {
      converted[key] = Timestamp.fromDate(new Date(converted[key]));
    } else if (typeof converted[key] === 'object' && converted[key] !== null) {
      converted[key] = convertDates(converted[key]);
    }
  }
  return converted;
}

/**
 * Migra una colección usando batch writes
 */
async function migrateCollection(collectionName, data) {
  if (!data || data.length === 0) {
    console.log(`⚠️  No hay datos para migrar en ${collectionName}`);
    return 0;
  }

  console.log(`📦 Migrando ${data.length} documentos a ${collectionName}...`);

  let totalMigrated = 0;
  let batch = writeBatch(db);
  let operationCount = 0;

  for (const item of data) {
    const docRef = doc(collection(db, collectionName), item.id);
    const convertedItem = convertDates(item);
    batch.set(docRef, convertedItem);

    operationCount++;
    totalMigrated++;

    // Si alcanzamos el límite del batch, ejecutarlo y crear uno nuevo
    if (operationCount >= BATCH_SIZE) {
      await batch.commit();
      console.log(`  ✓ Batch de ${operationCount} documentos completado`);
      batch = writeBatch(db);
      operationCount = 0;
    }
  }

  // Ejecutar batch restante si hay operaciones pendientes
  if (operationCount > 0) {
    await batch.commit();
    console.log(`  ✓ Batch final de ${operationCount} documentos completado`);
  }

  console.log(`✅ ${totalMigrated} documentos migrados a ${collectionName}\n`);
  return totalMigrated;
}

/**
 * Función principal de migración
 */
async function migrate() {
  try {
    console.log('╔════════════════════════════════════════════════════════╗');
    console.log('║     CHRONOS DATA MIGRATION - Iniciando proceso...     ║');
    console.log('╚════════════════════════════════════════════════════════╝\n');

    // Leer archivo JSON
    const dataPath = join(
      __dirname,
      '../src/apps/FlowDistributor/chronos-system/data/BASE_DATOS_FLOWDISTRIBUTOR_UNIFICADO.json'
    );

    console.log(`📖 Leyendo datos desde: ${dataPath}\n`);
    const jsonData = await readFile(dataPath, 'utf-8');
    const data = JSON.parse(jsonData);

    // Migrar cada colección
    const collections = [
      { name: 'bancos', data: data.bancos },
      { name: 'clientes', data: data.clientes },
      { name: 'distribuidores', data: data.distribuidores },
      { name: 'productos', data: data.productos },
      { name: 'ventas', data: data.ventas || [] },
      { name: 'compras', data: data.compras || [] },
    ];

    let totalDocuments = 0;
    const startTime = Date.now();

    for (const { name, data: collectionData } of collections) {
      const migrated = await migrateCollection(name, collectionData);
      totalDocuments += migrated;
    }

    const duration = ((Date.now() - startTime) / 1000).toFixed(2);

    console.log('╔════════════════════════════════════════════════════════╗');
    console.log('║              MIGRACIÓN COMPLETADA CON ÉXITO           ║');
    console.log('╚════════════════════════════════════════════════════════╝');
    console.log(`✅ Total de documentos migrados: ${totalDocuments}`);
    console.log(`⏱️  Tiempo total: ${duration}s`);
    console.log(`📊 Promedio: ${(totalDocuments / duration).toFixed(2)} docs/s\n`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error durante la migración:', error);
    console.error('Stack trace:', error.stack);
    process.exit(1);
  }
}

// Ejecutar migración
migrate();
