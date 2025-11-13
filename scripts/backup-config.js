#!/usr/bin/env node
/**
 * Backup Configuration Files
 * Respalda archivos de configuración del proyecto
 */
import fs from 'fs';
import path from 'path';

const CONFIG_FILES = [
  '.env',
  '.env.local',
  '.env.production',
  'firebase.json',
  'firestore.rules',
  'storage.rules',
  'firestore.indexes.json',
  'package.json',
  'package-lock.json',
  'vite.config.js',
  'tailwind.config.js',
  'postcss.config.js',
  '.github/workflows/*.yml',
];

async function backupConfig() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupDir = path.join(process.cwd(), 'backups', `config_${timestamp}`);

  console.log('⚙️ Iniciando backup de configuraciones...\n');
  console.log(`📁 Directorio: ${backupDir}\n`);

  fs.mkdirSync(backupDir, { recursive: true });

  const results = {
    timestamp: new Date().toISOString(),
    directory: backupDir,
    totalFiles: 0,
    files: [],
    missing: [],
  };

  try {
    for (const configPath of CONFIG_FILES) {
      // Manejar wildcards
      if (configPath.includes('*')) {
        const dir = path.dirname(configPath);
        const pattern = path.basename(configPath).replace('*', '');

        if (fs.existsSync(dir)) {
          const files = fs.readdirSync(dir).filter((f) => f.endsWith(pattern));

          for (const file of files) {
            const srcPath = path.join(dir, file);
            const destPath = path.join(backupDir, dir, file);
            const destDir = path.dirname(destPath);

            if (!fs.existsSync(destDir)) {
              fs.mkdirSync(destDir, { recursive: true });
            }

            fs.copyFileSync(srcPath, destPath);
            const stats = fs.statSync(srcPath);

            results.files.push({
              path: srcPath,
              size: stats.size,
            });
            results.totalFiles++;

            console.log(`  ✅ ${srcPath} (${(stats.size / 1024).toFixed(2)} KB)`);
          }
        }
      } else {
        // Archivo simple
        if (fs.existsSync(configPath)) {
          const destPath = path.join(backupDir, configPath);
          const destDir = path.dirname(destPath);

          if (!fs.existsSync(destDir)) {
            fs.mkdirSync(destDir, { recursive: true });
          }

          fs.copyFileSync(configPath, destPath);
          const stats = fs.statSync(configPath);

          results.files.push({
            path: configPath,
            size: stats.size,
          });
          results.totalFiles++;

          console.log(`  ✅ ${configPath} (${(stats.size / 1024).toFixed(2)} KB)`);
        } else {
          results.missing.push(configPath);
          console.log(`  ⚠ ${configPath} (no existe)`);
        }
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
          missing: results.missing,
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

    if (results.missing.length > 0) {
      console.log(`⚠️ Faltantes: ${results.missing.length}`);
    }
  } catch (error) {
    console.error('\n❌ Error en backup de configuración:', error);
    throw error;
  }

  console.log('\n--- CONFIG BACKUP RESULTS ---');
  console.log(
    JSON.stringify(
      {
        timestamp: results.timestamp,
        totalFiles: results.totalFiles,
        missing: results.missing.length,
      },
      null,
      2
    )
  );

  return results;
}

backupConfig()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
