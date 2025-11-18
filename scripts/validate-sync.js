#!/usr/bin/env node
/**
 * Validate Sync - Excel ↔ Firestore
 * Valida la sincronización entre Excel y Firestore
 */
import { cert, initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import fs from 'fs';
import xlsx from 'xlsx';

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT || '{}');

initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore();

async function validateSync(excelPath, collectionName) {
  const results = {
    file: excelPath,
    collection: collectionName,
    timestamp: new Date().toISOString(),
    excel: { count: 0 },
    firestore: { count: 0 },
    differences: [],
    status: 'synced',
  };

  try {
    // Leer Excel
    const workbook = xlsx.readFile(excelPath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const excelData = xlsx.utils.sheet_to_json(sheet);

    results.excel.count = excelData.length;

    // Leer Firestore
    const snapshot = await db.collection(collectionName).get();
    results.firestore.count = snapshot.size;

    // Comparar conteos
    const diff = results.excel.count - results.firestore.count;

    if (diff !== 0) {
      results.status = 'out-of-sync';
      results.differences.push({
        type: 'count',
        message: `Excel tiene ${Math.abs(diff)} ${diff > 0 ? 'más' : 'menos'} registros que Firestore`,
      });
    }

    // Validar IDs (muestra)
    const excelIds = new Set(excelData.map((row) => row.id || row.ID).filter(Boolean));
    const firestoreIds = new Set();
    snapshot.forEach((doc) => firestoreIds.add(doc.id));

    const missingInFirestore = [...excelIds].filter((id) => !firestoreIds.has(String(id)));
    const missingInExcel = [...firestoreIds].filter((id) => !excelIds.has(id));

    if (missingInFirestore.length > 0) {
      results.differences.push({
        type: 'missing_in_firestore',
        count: missingInFirestore.length,
        sample: missingInFirestore.slice(0, 5),
      });
      results.status = 'out-of-sync';
    }

    if (missingInExcel.length > 0) {
      results.differences.push({
        type: 'missing_in_excel',
        count: missingInExcel.length,
        sample: missingInExcel.slice(0, 5),
      });
      results.status = 'out-of-sync';
    }

    // Resumen
    const icon = results.status === 'synced' ? '✅' : '⚠️';
    console.log(`${icon} Sincronización: ${results.status.toUpperCase()}`);
    console.log(`  Excel: ${results.excel.count} registros`);
    console.log(`  Firestore: ${results.firestore.count} documentos`);

    if (results.differences.length > 0) {
      console.log(`\n⚠️ Diferencias encontradas:`);
      results.differences.forEach((diff) => {
        console.log(`  - ${diff.type}: ${diff.message || diff.count + ' registros'}`);
      });
    }
  } catch (error) {
    console.error('❌ Error en validación:', error.message);
    results.status = 'error';
    results.error = error.message;
    throw error;
  }

  console.log('\n--- SYNC VALIDATION RESULTS ---');
  console.log(JSON.stringify(results, null, 2));

  return results;
}

async function main() {
  const excelPath = process.argv[2];
  const collectionName = process.argv[3];

  if (!excelPath || !collectionName) {
    console.error('❌ Uso: node validate-sync.js <excel-path> <collection-name>');
    process.exit(1);
  }

  if (!fs.existsSync(excelPath)) {
    console.error(`❌ Archivo no encontrado: ${excelPath}`);
    process.exit(1);
  }

  try {
    const results = await validateSync(excelPath, collectionName);
    process.exit(results.status === 'synced' ? 0 : 1);
  } catch (error) {
    process.exit(1);
  }
}

main();
