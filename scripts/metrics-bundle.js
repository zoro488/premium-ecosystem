#!/usr/bin/env node
/**
 * Bundle Size Metrics
 * Analiza el tamaño de los bundles de producción
 */
import fs from 'fs';
import path from 'path';

const DIST_DIR = path.join(process.cwd(), 'dist');
const MAX_JS_SIZE = 500 * 1024; // 500 KB
const MAX_CSS_SIZE = 100 * 1024; // 100 KB

function getFileSize(filePath) {
  const stats = fs.statSync(filePath);
  return stats.size;
}

function analyzeDirectory(dir, extensions = []) {
  const results = [];

  if (!fs.existsSync(dir)) {
    return results;
  }

  const files = fs.readdirSync(dir, { recursive: true });

  for (const file of files) {
    const filePath = path.join(dir, file);

    if (fs.statSync(filePath).isFile()) {
      const ext = path.extname(file);

      if (extensions.length === 0 || extensions.includes(ext)) {
        results.push({
          file,
          path: filePath,
          size: getFileSize(filePath),
          ext,
        });
      }
    }
  }

  return results;
}

function analyzeBundleSize() {
  console.log('📦 Analizando tamaño de bundles...\n');

  const results = {
    timestamp: new Date().toISOString(),
    distDirectory: DIST_DIR,
    totals: {},
    files: {},
    warnings: [],
    passed: true,
  };

  try {
    if (!fs.existsSync(DIST_DIR)) {
      throw new Error(
        `Directorio dist no encontrado: ${DIST_DIR}. Ejecuta 'npm run build' primero.`
      );
    }

    // Analizar archivos JS
    const jsFiles = analyzeDirectory(DIST_DIR, ['.js']);
    let totalJsSize = 0;

    jsFiles.forEach((file) => {
      totalJsSize += file.size;

      if (file.size > MAX_JS_SIZE) {
        results.warnings.push({
          type: 'large_js',
          file: file.file,
          size: file.size,
          limit: MAX_JS_SIZE,
        });
        results.passed = false;
      }
    });

    results.files.js = jsFiles.map((f) => ({
      file: f.file,
      size: f.size,
      sizeKB: (f.size / 1024).toFixed(2),
    }));
    results.totals.js = {
      count: jsFiles.length,
      size: totalJsSize,
      sizeKB: (totalJsSize / 1024).toFixed(2),
      sizeMB: (totalJsSize / 1024 / 1024).toFixed(2),
    };

    // Analizar archivos CSS
    const cssFiles = analyzeDirectory(DIST_DIR, ['.css']);
    let totalCssSize = 0;

    cssFiles.forEach((file) => {
      totalCssSize += file.size;

      if (file.size > MAX_CSS_SIZE) {
        results.warnings.push({
          type: 'large_css',
          file: file.file,
          size: file.size,
          limit: MAX_CSS_SIZE,
        });
        results.passed = false;
      }
    });

    results.files.css = cssFiles.map((f) => ({
      file: f.file,
      size: f.size,
      sizeKB: (f.size / 1024).toFixed(2),
    }));
    results.totals.css = {
      count: cssFiles.length,
      size: totalCssSize,
      sizeKB: (totalCssSize / 1024).toFixed(2),
    };

    // Analizar assets totales
    const allFiles = analyzeDirectory(DIST_DIR);
    const totalSize = allFiles.reduce((sum, f) => sum + f.size, 0);

    results.totals.all = {
      count: allFiles.length,
      size: totalSize,
      sizeKB: (totalSize / 1024).toFixed(2),
      sizeMB: (totalSize / 1024 / 1024).toFixed(2),
    };

    // Mostrar resultados
    console.log('📊 MÉTRICAS DE BUNDLES');
    console.log('═══════════════════════════════════════');
    console.log(`JavaScript: ${results.totals.js.sizeKB} KB (${results.totals.js.count} archivos)`);
    console.log(`CSS: ${results.totals.css.sizeKB} KB (${results.totals.css.count} archivos)`);
    console.log(`Total: ${results.totals.all.sizeMB} MB (${results.totals.all.count} archivos)`);

    if (results.warnings.length > 0) {
      console.log('\n⚠️ ADVERTENCIAS:');
      results.warnings.forEach((w) => {
        console.log(
          `  - ${w.file}: ${(w.size / 1024).toFixed(2)} KB (límite: ${(w.limit / 1024).toFixed(2)} KB)`
        );
      });
    }

    // Top 5 archivos más grandes
    const topFiles = allFiles.sort((a, b) => b.size - a.size).slice(0, 5);

    console.log('\n📈 TOP 5 ARCHIVOS MÁS GRANDES:');
    topFiles.forEach((f, i) => {
      console.log(`  ${i + 1}. ${f.file}: ${(f.size / 1024).toFixed(2)} KB`);
    });
  } catch (error) {
    console.error('\n❌ Error en análisis:', error.message);
    results.error = error.message;
    results.passed = false;
  }

  console.log('\n--- BUNDLE METRICS RESULTS ---');
  console.log(JSON.stringify(results, null, 2));

  process.exit(results.passed ? 0 : 1);
}

analyzeBundleSize();
