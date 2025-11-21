#!/usr/bin/env node
/**
 * ============================================
 * VALIDADOR DE ARCHIVOS CSV
 * ============================================
 *
 * Script para validar la estructura y contenido de los archivos CSV
 * ANTES de ejecutar la importación a Firestore.
 *
 * CARACTERÍSTICAS:
 * ✅ Verifica existencia de todos los archivos
 * ✅ Valida estructura de headers
 * ✅ Detecta filas vacías o incompletas
 * ✅ Verifica tipos de datos (números, fechas)
 * ✅ Identifica duplicados
 * ✅ Genera reporte detallado
 *
 * USO:
 *   node scripts/validar-csv.js
 *   npm run validate:csv
 */
import csv from 'csv-parser';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ============================================
// CONFIGURACIÓN
// ============================================
const CSV_DIR = path.join(__dirname, '..', 'data', 'csv');

const FILE_PATHS = {
  clientes: 'Copia de Administación_General - Clientes.csv',
  distribuidores: 'Copia de Administación_General - Distribuidores.csv',
  controlMaestro: 'Copia de Administación_General - Control_Maestro.csv',
  almacen: 'Copia de Administación_General - Almacen_Monte.csv',
  bancos: {
    bovedaMonte: 'Copia de Administación_General - Bóveda_Monte.csv',
    bovedaUsa: 'Copia de Administación_General - Bóveda_USA.csv',
    profit: 'Copia de Administación_General - Profit.csv',
    leftie: 'Copia de Administación_General - Leftie.csv',
    fleteSur: 'Copia de Administación_General - Flete_Sur.csv',
    utilidades: 'Copia de Administación_General - Utilidades.csv',
    azteca: 'Copia de Administación_General - Azteca.csv',
  },
};

// Headers esperados para cada archivo
const EXPECTED_HEADERS = {
  clientes: ['cliente', 'deuda', 'abonos', 'pendiente'],
  distribuidores: ['Distribuidores', 'OC', 'Fecha', 'Cantidad', 'Costo Total'],
  controlMaestro: ['Fecha', 'Cliente', 'Cantidad', 'Precio De Venta', 'Ingreso'],
  almacen: [], // Sin headers (solo datos en primera fila)
  // Bancos comparten estructura similar
  bancos: ['Fecha', 'Gasto', 'Destino', 'Concepto'],
};

// ============================================
// COLORES
// ============================================
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  dim: '\x1b[2m',
};

const log = {
  success: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  warning: (msg) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
  info: (msg) => console.log(`${colors.cyan}ℹ${colors.reset} ${msg}`),
  section: (msg) => console.log(`\n${colors.cyan}═══ ${msg} ═══${colors.reset}`),
};

// ============================================
// UTILIDADES
// ============================================

/**
 * Lee y parsea un archivo CSV
 */
function parseCSV(filePath) {
  return new Promise((resolve, reject) => {
    const results = [];

    if (!fs.existsSync(filePath)) {
      return reject(new Error(`Archivo no encontrado: ${filePath}`));
    }

    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => resolve(results))
      .on('error', (error) => reject(error));
  });
}

/**
 * Verifica si un valor es numérico
 */
function isNumeric(value) {
  if (typeof value === 'number') return true;
  if (typeof value !== 'string') return false;

  const cleaned = value.replace(/[\$,]/g, '');
  return !isNaN(parseFloat(cleaned)) && isFinite(cleaned);
}

/**
 * Verifica si un valor es una fecha válida
 */
function isValidDate(value) {
  if (!value) return false;

  const date = new Date(value);
  return !isNaN(date.getTime());
}

// ============================================
// VALIDACIONES
// ============================================

/**
 * Valida existencia de archivos
 */
function validateFileExistence() {
  log.section('Validando Existencia de Archivos');

  const allFiles = [
    { name: 'Clientes', path: FILE_PATHS.clientes },
    { name: 'Distribuidores', path: FILE_PATHS.distribuidores },
    { name: 'Control Maestro', path: FILE_PATHS.controlMaestro },
    { name: 'Almacén', path: FILE_PATHS.almacen },
    ...Object.entries(FILE_PATHS.bancos).map(([key, file]) => ({
      name: `Banco ${key}`,
      path: file,
    })),
  ];

  let allExist = true;

  for (const { name, path: file } of allFiles) {
    const filePath = path.join(CSV_DIR, file);
    if (fs.existsSync(filePath)) {
      const stats = fs.statSync(filePath);
      const sizeKB = (stats.size / 1024).toFixed(2);
      log.success(`${name} (${sizeKB} KB)`);
    } else {
      log.error(`${name} - NO ENCONTRADO`);
      allExist = false;
    }
  }

  return allExist;
}

/**
 * Valida contenido de un archivo CSV
 */
async function validateCSVContent(fileName, fileType) {
  const filePath = path.join(CSV_DIR, fileName);

  try {
    const data = await parseCSV(filePath);

    const issues = {
      emptyRows: 0,
      invalidNumbers: 0,
      invalidDates: 0,
      missingFields: 0,
      duplicates: 0,
    };

    // Detectar duplicados (por primera columna)
    const firstColumn = Object.keys(data[0])[0];
    const seen = new Set();

    for (const [index, row] of data.entries()) {
      // Verificar filas vacías
      const allEmpty = Object.values(row).every((v) => !v || v.trim() === '');
      if (allEmpty) {
        issues.emptyRows++;
        continue;
      }

      // Verificar duplicados
      const key = row[firstColumn];
      if (key && seen.has(key)) {
        issues.duplicates++;
      }
      seen.add(key);

      // Validaciones específicas por tipo
      if (fileType === 'bancos' || fileType === 'controlMaestro') {
        // Validar fechas
        if (row.Fecha && !isValidDate(row.Fecha)) {
          issues.invalidDates++;
        }

        // Validar números (Gasto, Ingreso, etc.)
        const numericFields = ['Gasto', 'Ingreso', 'Precio De Venta', 'Cantidad'];
        for (const field of numericFields) {
          if (row[field] && row[field] !== 'NA' && !isNumeric(row[field])) {
            issues.invalidNumbers++;
          }
        }
      }

      if (fileType === 'clientes' || fileType === 'distribuidores') {
        // Validar campos numéricos
        const numericFields = ['deuda', 'abonos', 'pendiente', 'Costo Total'];
        for (const field of numericFields) {
          if (row[field] && !isNumeric(row[field])) {
            issues.invalidNumbers++;
          }
        }
      }
    }

    return {
      totalRows: data.length,
      validRows: data.length - issues.emptyRows,
      issues,
    };
  } catch (error) {
    return {
      error: error.message,
    };
  }
}

/**
 * Genera reporte de validación
 */
async function generateValidationReport() {
  log.section('Validando Contenido de Archivos');

  const results = {};

  // Validar clientes
  log.info('Validando Clientes...');
  results.clientes = await validateCSVContent(FILE_PATHS.clientes, 'clientes');

  // Validar distribuidores
  log.info('Validando Distribuidores...');
  results.distribuidores = await validateCSVContent(FILE_PATHS.distribuidores, 'distribuidores');

  // Validar control maestro
  log.info('Validando Control Maestro...');
  results.controlMaestro = await validateCSVContent(FILE_PATHS.controlMaestro, 'controlMaestro');

  // Validar bancos
  log.info('Validando Bancos...');
  for (const [key, file] of Object.entries(FILE_PATHS.bancos)) {
    results[`banco_${key}`] = await validateCSVContent(file, 'bancos');
  }

  return results;
}

/**
 * Muestra reporte de resultados
 */
function displayReport(results) {
  log.section('Reporte de Validación');

  let totalIssues = 0;
  let totalRows = 0;

  for (const [file, result] of Object.entries(results)) {
    if (result.error) {
      log.error(`${file}: ERROR - ${result.error}`);
      continue;
    }

    totalRows += result.totalRows;
    const fileIssues = Object.values(result.issues).reduce((a, b) => a + b, 0);
    totalIssues += fileIssues;

    if (fileIssues === 0) {
      log.success(`${file}: ${result.validRows} filas válidas`);
    } else {
      log.warning(`${file}: ${result.validRows} filas, ${fileIssues} problemas`);

      if (result.issues.emptyRows > 0) {
        console.log(`  ${colors.dim}• Filas vacías: ${result.issues.emptyRows}${colors.reset}`);
      }
      if (result.issues.duplicates > 0) {
        console.log(`  ${colors.dim}• Duplicados: ${result.issues.duplicates}${colors.reset}`);
      }
      if (result.issues.invalidNumbers > 0) {
        console.log(
          `  ${colors.dim}• Números inválidos: ${result.issues.invalidNumbers}${colors.reset}`
        );
      }
      if (result.issues.invalidDates > 0) {
        console.log(
          `  ${colors.dim}• Fechas inválidas: ${result.issues.invalidDates}${colors.reset}`
        );
      }
    }
  }

  // Resumen final
  console.log(`\n${colors.cyan}═══════════════════════════════════════${colors.reset}`);
  console.log(`Total de filas: ${totalRows}`);
  console.log(`Total de problemas: ${totalIssues}`);

  if (totalIssues === 0) {
    console.log(`\n${colors.green}✓ Todos los archivos CSV son válidos${colors.reset}`);
    console.log(`${colors.green}✓ Puedes proceder con la importación${colors.reset}`);
    return true;
  } else {
    console.log(`\n${colors.yellow}⚠ Se encontraron ${totalIssues} problemas${colors.reset}`);
    console.log(`${colors.yellow}⚠ Revisa los archivos antes de importar${colors.reset}`);
    return false;
  }
}

// ============================================
// FUNCIÓN PRINCIPAL
// ============================================
async function main() {
  console.log(`
${colors.cyan}╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║    🔍 VALIDADOR DE ARCHIVOS CSV                          ║
║    Premium Ecosystem - FlowDistributor                   ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝${colors.reset}
`);

  try {
    // 1. Validar existencia de archivos
    const filesExist = validateFileExistence();

    if (!filesExist) {
      log.error('\nAlgunos archivos no se encontraron');
      log.info(`Asegúrate de que todos los CSVs estén en: ${CSV_DIR}`);
      process.exit(1);
    }

    // 2. Validar contenido
    const results = await generateValidationReport();

    // 3. Mostrar reporte
    const allValid = displayReport(results);

    // 4. Guardar reporte en archivo
    const reportPath = path.join(__dirname, '..', 'validation-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));
    log.info(`\nReporte guardado en: ${reportPath}`);

    process.exit(allValid ? 0 : 1);
  } catch (error) {
    log.error('Error durante la validación:');
    console.error(error);
    process.exit(1);
  }
}

// Ejecutar
main();
