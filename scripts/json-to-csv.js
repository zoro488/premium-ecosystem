import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('\n╔═══════════════════════════════════════════════════════╗');
console.log('║                                                       ║');
console.log('║     📊 CONVERSIÓN JSON → CSV (Desde FlowDistributor) ║');
console.log('║                                                       ║');
console.log('╚═══════════════════════════════════════════════════════╝\n');

const sourceDir = path.join(__dirname, '..', 'src', 'apps', 'FlowDistributor', 'data');
const outputDir = path.join(__dirname, '..', 'data', 'csv');

// Crear directorio de salida
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Función para convertir objeto a CSV
function jsonToCsv(data, filename) {
  if (!Array.isArray(data) || data.length === 0) {
    console.log(`⚠️  ${filename}: No hay datos para convertir`);
    return null;
  }

  // Obtener todas las claves únicas
  const keys = [...new Set(data.flatMap((obj) => Object.keys(obj)))];

  // Crear encabezados
  const headers = keys.join(',');

  // Crear filas
  const rows = data.map((obj) => {
    return keys
      .map((key) => {
        const value = obj[key];

        // Manejar diferentes tipos de valores
        if (value === null || value === undefined) {
          return '';
        }

        if (typeof value === 'object') {
          return `"${JSON.stringify(value).replace(/"/g, '""')}"`;
        }

        const stringValue = String(value);

        // Escapar comillas y comas
        if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
          return `"${stringValue.replace(/"/g, '""')}"`;
        }

        return stringValue;
      })
      .join(',');
  });

  return headers + '\n' + rows.join('\n');
}

// Mapeo de archivos JSON a nombres de CSV
const fileMapping = {
  'panel-clientes-manual.json': 'clientes.csv',
  'panel-ordenes-compra-manual.json': 'ordenes_compra.csv',
  'panel-ventas-local-manual.json': 'ventas.csv',
  'panel-almacen-monte-manual.json': 'almacen.csv',
  'panel-azteca-manual.json': 'bancos_azteca.csv',
  'panel-leftie-manual.json': 'bancos_leftie.csv',
  'panel-profit-manual.json': 'bancos_profit.csv',
  'panel-boveda-monte-manual.json': 'boveda_monte.csv',
  'panel-boveda-usa-manual.json': 'boveda_usa.csv',
  'panel-fletes-manual.json': 'flete_sur.csv',
  'panel-utilidades-manual.json': 'utilidades.csv',
  'panel-gastos-abonos-manual.json': 'gastos_abonos.csv',
};

let totalRecords = 0;
let totalFiles = 0;

console.log('📁 Procesando archivos JSON...\n');

for (const [jsonFile, csvFile] of Object.entries(fileMapping)) {
  const jsonPath = path.join(sourceDir, jsonFile);
  const csvPath = path.join(outputDir, csvFile);

  if (!fs.existsSync(jsonPath)) {
    console.log(`⚠️  ${jsonFile}: No encontrado`);
    continue;
  }

  try {
    // Leer JSON
    const jsonContent = fs.readFileSync(jsonPath, 'utf-8');
    let data = JSON.parse(jsonContent);

    // Si el JSON tiene una estructura anidada, extraer el array principal
    if (!Array.isArray(data)) {
      // Buscar el primer array en el objeto, incluyendo objetos anidados
      const findArrayInObject = (obj) => {
        if (Array.isArray(obj)) return obj;

        if (typeof obj === 'object' && obj !== null) {
          for (const value of Object.values(obj)) {
            if (Array.isArray(value)) return value;

            if (typeof value === 'object') {
              const found = findArrayInObject(value);
              if (found) return found;
            }
          }
        }
        return null;
      };

      const foundArray = findArrayInObject(data);

      if (foundArray) {
        data = foundArray;
      } else {
        console.log(`⚠️  ${jsonFile}: No se encontró un array de datos`);
        continue;
      }
    }

    // Convertir a CSV
    const csv = jsonToCsv(data, jsonFile);

    if (csv) {
      fs.writeFileSync(csvPath, csv, 'utf-8');
      const recordCount = data.length;
      totalRecords += recordCount;
      totalFiles++;

      console.log(`✓ ${csvFile.padEnd(25)} → ${recordCount} registros`);
    }
  } catch (error) {
    console.log(`❌ ${jsonFile}: Error - ${error.message}`);
  }
}

console.log('\n╔═══════════════════════════════════════════════════════╗');
console.log('║                                                       ║');
console.log('║     ✅ CONVERSIÓN COMPLETADA                         ║');
console.log('║                                                       ║');
console.log('╚═══════════════════════════════════════════════════════╝\n');

console.log(`📊 Resumen:`);
console.log(`  • Archivos procesados: ${totalFiles}`);
console.log(`  • Total de registros: ${totalRecords}`);
console.log(`  • Ubicación: ${outputDir}\n`);

console.log('🎯 Próximos pasos:');
console.log('  1. Verifica los CSV generados en data/csv/');
console.log('  2. Ejecuta: npm run import:csv:dry-run');
console.log('  3. Ejecuta: npm run import:csv\n');
