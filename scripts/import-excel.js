#!/usr/bin/env node
/**
 * Import Excel to Firestore
 * Importa datos de Excel a Firestore
 */
import { cert, initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import fs from 'fs';
import path from 'path';
import xlsx from 'xlsx';

// Inicializar Firebase Admin
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT || '{}');

initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore();

async function importExcelToFirestore(excelPath, options = {}) {
  const results = {
    file: path.basename(excelPath),
    timestamp: new Date().toISOString(),
    imported: {},
    errors: [],
  };

  try {
    console.log(`📥 Importando: ${excelPath}\n`);

    const workbook = xlsx.readFile(excelPath);
    const batch = db.batch();
    let batchCount = 0;

    for (const sheetName of workbook.SheetNames) {
      console.log(`  📄 Procesando hoja: ${sheetName}`);

      const sheet = workbook.Sheets[sheetName];
      const data = xlsx.utils.sheet_to_json(sheet);

      if (data.length === 0) {
        console.log(`    ⚠ Hoja vacía, omitiendo`);
        continue;
      }

      const collectionName = sheetName
        .toLowerCase()
        .replace(/\s+/g, '_')
        .replace(/[^a-z0-9_]/g, '');

      let imported = 0;

      for (const row of data) {
        // Generar ID único o usar uno existente
        const docId = row.id || row.ID || db.collection(collectionName).doc().id;
        const docRef = db.collection(collectionName).doc(String(docId));

        // Limpiar datos (remover valores undefined/null)
        const cleanData = Object.entries(row).reduce((acc, [key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            acc[key] = value;
          }
          return acc;
        }, {});

        // Agregar metadata
        cleanData._importedAt = new Date().toISOString();
        cleanData._source = 'excel';

        batch.set(docRef, cleanData, { merge: true });
        batchCount++;
        imported++;

        // Commit cada 500 documentos
        if (batchCount >= 500) {
          await batch.commit();
          console.log(`    💾 Guardados ${imported} documentos...`);
          batchCount = 0;
        }
      }

      // Commit final
      if (batchCount > 0) {
        await batch.commit();
      }

      results.imported[collectionName] = imported;
      console.log(`    ✅ ${imported} documentos importados a "${collectionName}"`);
    }

    console.log(`\n✅ Importación completada`);
    console.log(`Total de colecciones: ${Object.keys(results.imported).length}`);
    console.log(
      `Total de documentos: ${Object.values(results.imported).reduce((a, b) => a + b, 0)}`
    );
  } catch (error) {
    console.error(`\n❌ Error en importación:`, error);
    results.errors.push(error.message);
    throw error;
  }

  return results;
}

async function main() {
  const excelPath = process.argv[2];

  if (!excelPath) {
    console.error('❌ Uso: node import-excel.js <ruta-al-excel>');
    process.exit(1);
  }

  if (!fs.existsSync(excelPath)) {
    console.error(`❌ Archivo no encontrado: ${excelPath}`);
    process.exit(1);
  }

  try {
    const results = await importExcelToFirestore(excelPath);
    console.log('\n--- IMPORT RESULTS ---');
    console.log(JSON.stringify(results, null, 2));
    process.exit(0);
  } catch (error) {
    console.error('❌ Importación fallida');
    process.exit(1);
  }
}

main();
