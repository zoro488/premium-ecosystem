/**
 * Script para eliminar console statements de producción
 * Reemplaza console.log/warn con logger en archivos de FlowDistributor
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const FLOW_DIR = path.join(__dirname, '../src/apps/FlowDistributor');

// Archivos a procesar
const filesToProcess = [
  path.join(FLOW_DIR, 'FlowDistributor.jsx'),
  path.join(FLOW_DIR, 'services/ordenesCompra.service.ts'),
  path.join(FLOW_DIR, 'services/ventas.service.ts'),
  path.join(FLOW_DIR, 'services/clientes.service.ts'),
];

function processFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    const originalContent = content;
    let modified = false;

    // 1. Agregar import del logger si no existe
    if (!content.includes('import') && !content.includes('flowLogger')) {
      const firstImport = content.indexOf('import');
      if (firstImport !== -1) {
        const endOfImports = content.lastIndexOf(';', content.indexOf('\n\n', firstImport));
        content =
          content.slice(0, endOfImports + 1) +
          "\nimport { flowLogger } from '../../utils/logger';" +
          content.slice(endOfImports + 1);
        modified = true;
      }
    }

    // 2. Reemplazar console.log con flowLogger.info
    if (content.includes('console.log(')) {
      content = content.replace(/console\.log\(/g, 'flowLogger.info(');
      modified = true;
    }

    // 3. Reemplazar console.warn con flowLogger.warn
    if (content.includes('console.warn(')) {
      content = content.replace(/console\.warn\(/g, 'flowLogger.warn(');
      modified = true;
    }

    // 4. Reemplazar console.group con flowLogger.group
    if (content.includes('console.group(')) {
      content = content.replace(/console\.group\(/g, 'flowLogger.group(');
      modified = true;
    }

    // 5. Reemplazar console.groupEnd con flowLogger.groupEnd
    if (content.includes('console.groupEnd()')) {
      content = content.replace(/console\.groupEnd\(\)/g, 'flowLogger.groupEnd()');
      modified = true;
    }

    // 6. Mantener console.error (solo logging de errores)
    // No hacemos nada con console.error

    // 7. Descomentar y reemplazar console comentados
    content = content.replace(/\/\/ console\.log\(/g, '// flowLogger.debug(');
    content = content.replace(/\/\/ console\.warn\(/g, '// flowLogger.warn(');

    if (modified || content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Procesado: ${path.basename(filePath)}`);
      return true;
    } else {
      console.log(`⏭️  Sin cambios: ${path.basename(filePath)}`);
      return false;
    }
  } catch (error) {
    console.error(`❌ Error procesando ${filePath}:`, error.message);
    return false;
  }
}

// Procesar todos los archivos
console.log('🚀 Iniciando eliminación de console statements...\n');

let processed = 0;
filesToProcess.forEach((file) => {
  if (fs.existsSync(file)) {
    if (processFile(file)) {
      processed++;
    }
  } else {
    console.warn(`⚠️  Archivo no encontrado: ${path.basename(file)}`);
  }
});

console.log(`\n✅ Completado: ${processed} archivos modificados`);
