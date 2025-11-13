#!/usr/bin/env node
/**
 * Backup Firebase Storage
 * Descarga archivos de Firebase Storage
 */
import { cert, initializeApp } from 'firebase-admin/app';
import { getStorage } from 'firebase-admin/storage';
import fs from 'fs';
import path from 'path';

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT || '{}');

initializeApp({
  credential: cert(serviceAccount),
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
});

const bucket = getStorage().bucket();

async function downloadFile(file, destPath) {
  try {
    await file.download({ destination: destPath });
    const stats = fs.statSync(destPath);
    return {
      success: true,
      size: stats.size,
      path: file.name,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      path: file.name,
    };
  }
}

async function backupStorage() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupDir = path.join(process.cwd(), 'backups', `storage_${timestamp}`);

  console.log('☁️ Iniciando backup de Firebase Storage...\n');
  console.log(`📁 Directorio: ${backupDir}\n`);

  fs.mkdirSync(backupDir, { recursive: true });

  const results = {
    timestamp: new Date().toISOString(),
    directory: backupDir,
    totalFiles: 0,
    totalSize: 0,
    files: [],
    errors: [],
  };

  try {
    const [files] = await bucket.getFiles();

    if (files.length === 0) {
      console.log('⚠ No se encontraron archivos en Storage');
      return results;
    }

    console.log(`📊 Archivos encontrados: ${files.length}\n`);

    for (const file of files) {
      const destPath = path.join(backupDir, file.name);
      const destDir = path.dirname(destPath);

      // Crear directorio si no existe
      if (!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir, { recursive: true });
      }

      console.log(`  📥 Descargando: ${file.name}`);
      const result = await downloadFile(file, destPath);

      if (result.success) {
        results.files.push(result);
        results.totalFiles++;
        results.totalSize += result.size;
        console.log(`    ✅ ${(result.size / 1024).toFixed(2)} KB`);
      } else {
        results.errors.push(result);
        console.error(`    ❌ Error: ${result.error}`);
      }
    }

    // Guardar metadata
    const metadataPath = path.join(backupDir, '_metadata.json');
    fs.writeFileSync(
      metadataPath,
      JSON.stringify(
        {
          timestamp: results.timestamp,
          totalFiles: results.totalFiles,
          totalSize: results.totalSize,
          errors: results.errors.length,
        },
        null,
        2
      )
    );

    console.log('\n═══════════════════════════════════════');
    console.log('✅ BACKUP COMPLETADO');
    console.log('═══════════════════════════════════════');
    console.log(`📁 Directorio: ${backupDir}`);
    console.log(`📄 Archivos: ${results.totalFiles}`);
    console.log(`💾 Tamaño: ${(results.totalSize / 1024 / 1024).toFixed(2)} MB`);

    if (results.errors.length > 0) {
      console.log(`⚠️ Errores: ${results.errors.length}`);
    }
  } catch (error) {
    console.error('\n❌ Error en backup de Storage:', error);
    throw error;
  }

  console.log('\n--- STORAGE BACKUP RESULTS ---');
  console.log(
    JSON.stringify(
      {
        timestamp: results.timestamp,
        totalFiles: results.totalFiles,
        totalSize: results.totalSize,
        errors: results.errors.length,
      },
      null,
      2
    )
  );

  return results;
}

backupStorage()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
