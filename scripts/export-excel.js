#!/usr/bin/env node
/**
 * Export Firestore to Excel
 * Exporta datos de Firestore a Excel
 */
import { cert, initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import xlsx from 'xlsx';

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT || '{}');

initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore();

async function exportFirestoreToExcel(outputPath, collections = []) {
  const results = {
    file: outputPath,
    timestamp: new Date().toISOString(),
    exported: {},
    errors: [],
  };

  try {
    console.log(`📤 Exportando a: ${outputPath}\n`);

    const workbook = xlsx.utils.book_new();

    // Si no se especifican colecciones, obtener todas
    if (collections.length === 0) {
      const collectionsSnapshot = await db.listCollections();
      collections = collectionsSnapshot.map((col) => col.id);
    }

    for (const collectionName of collections) {
      console.log(`  📄 Exportando colección: ${collectionName}`);

      try {
        const snapshot = await db.collection(collectionName).get();

        if (snapshot.empty) {
          console.log(`    ⚠ Colección vacía, omitiendo`);
          continue;
        }

        const data = [];
        snapshot.forEach((doc) => {
          data.push({
            id: doc.id,
            ...doc.data(),
          });
        });

        // Crear hoja de Excel
        const worksheet = xlsx.utils.json_to_sheet(data);

        // Nombre de hoja válido (max 31 chars, sin caracteres especiales)
        const sheetName = collectionName.substring(0, 31).replace(/[:\\/?*\[\]]/g, '_');

        xlsx.utils.book_append_sheet(workbook, worksheet, sheetName);

        results.exported[collectionName] = data.length;
        console.log(`    ✅ ${data.length} documentos exportados`);
      } catch (error) {
        console.error(`    ❌ Error en colección ${collectionName}:`, error.message);
        results.errors.push({
          collection: collectionName,
          error: error.message,
        });
      }
    }

    // Guardar archivo
    xlsx.writeFile(workbook, outputPath);

    console.log(`\n✅ Exportación completada`);
    console.log(`Archivo: ${outputPath}`);
    console.log(`Total de colecciones: ${Object.keys(results.exported).length}`);
    console.log(
      `Total de documentos: ${Object.values(results.exported).reduce((a, b) => a + b, 0)}`
    );
  } catch (error) {
    console.error(`\n❌ Error en exportación:`, error);
    results.errors.push(error.message);
    throw error;
  }

  return results;
}

async function main() {
  const outputPath = process.argv[2] || `export_${Date.now()}.xlsx`;
  const collections = process.argv.slice(3);

  if (collections.length > 0) {
    console.log(`🎯 Colecciones a exportar: ${collections.join(', ')}`);
  } else {
    console.log(`🎯 Exportando todas las colecciones`);
  }

  try {
    const results = await exportFirestoreToExcel(outputPath, collections);
    console.log('\n--- EXPORT RESULTS ---');
    console.log(JSON.stringify(results, null, 2));
    process.exit(0);
  } catch (error) {
    console.error('❌ Exportación fallida');
    process.exit(1);
  }
}

main();
