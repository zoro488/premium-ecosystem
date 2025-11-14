import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import XLSX from 'xlsx';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const EXCEL_FILE = path.join(__dirname, '..', 'Administación_General.xlsx');
const OUTPUT_DIR = path.join(__dirname, '..', 'data', 'csv');

console.log('\n╔═══════════════════════════════════════════════════════╗');
console.log('║                                                       ║');
console.log('║     📊 CONVERSIÓN EXCEL → CSV (CORREGIDA)           ║');
console.log('║                                                       ║');
console.log('╚═══════════════════════════════════════════════════════╝\n');

// Asegurar que existe el directorio de salida
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  console.log(`✓ Directorio creado: ${OUTPUT_DIR}\n`);
}

// Configuración específica para cada hoja
const SHEET_CONFIG = {
  Distribuidores: {
    outputFile: 'distribuidores.csv',
    headerRow: 2, // Fila 3 (índice 2)
    dataStartRow: 3, // Fila 4 (índice 3)
    columns: 'A:P',
    description: 'Distribuidores y Órdenes de Compra',
  },
  Control_Maestro: {
    outputFile: 'ventas.csv',
    headerRow: 2,
    dataStartRow: 3,
    columns: 'A:V',
    description: 'Ventas y Gastos/Abonos',
  },
  Almacen_Monte: {
    outputFile: 'almacen.csv',
    headerRow: 2,
    dataStartRow: 3,
    columns: 'A:K',
    maxRows: 83,
    description: 'Almacén Monte',
  },
  Bóveda_Monte: {
    outputFile: 'boveda_monte.csv',
    headerRow: 2,
    dataStartRow: 3,
    columns: 'A:N',
    maxRows: 54,
    description: 'Bóveda Monte',
  },
  Bóveda_USA: {
    outputFile: 'boveda_usa.csv',
    headerRow: 2,
    dataStartRow: 3,
    columns: 'A:R',
    maxRows: 41,
    description: 'Bóveda USA',
  },
  Flete_Sur: {
    outputFile: 'flete_sur.csv',
    headerRow: 2,
    dataStartRow: 3,
    columns: 'A:N',
    maxRows: 86,
    description: 'Flete Sur',
  },
  Utilidades: {
    outputFile: 'utilidades.csv',
    headerRow: 2,
    dataStartRow: 3,
    columns: 'A:M',
    maxRows: 42,
    description: 'Utilidades',
  },
  Azteca: {
    outputFile: 'bancos_azteca.csv',
    headerRow: 2,
    dataStartRow: 3,
    columns: 'A:P',
    maxRows: 20,
    description: 'Banco Azteca',
  },
  Leftie: {
    outputFile: 'bancos_leftie.csv',
    headerRow: 2,
    dataStartRow: 3,
    columns: 'A:R',
    maxRows: 10,
    description: 'Banco Leftie',
  },
  Profit: {
    outputFile: 'bancos_profit.csv',
    headerRow: 2,
    dataStartRow: 3,
    columns: 'A:R',
    maxRows: 40,
    description: 'Banco Profit',
  },
  Clientes: {
    outputFile: 'clientes.csv',
    headerRow: 2,
    dataStartRow: 3,
    columns: 'A:F',
    maxRows: 200,
    description: 'Clientes',
  },
  DATA: {
    outputFile: 'ordenes_compra.csv',
    headerRow: 0,
    dataStartRow: 1,
    columns: 'A:O',
    maxRows: 76,
    description: 'Data / Órdenes',
  },
};

if (!fs.existsSync(EXCEL_FILE)) {
  console.error('❌ No se encontró el archivo Excel:', EXCEL_FILE);
  process.exit(1);
}

const workbook = XLSX.readFile(EXCEL_FILE);

let totalRegistros = 0;
let archivosGenerados = 0;

for (const [sheetName, config] of Object.entries(SHEET_CONFIG)) {
  if (!workbook.SheetNames.includes(sheetName)) {
    console.log(`⚠️  Hoja "${sheetName}" no encontrada, saltando...`);
    continue;
  }

  console.log(`\n📄 Procesando: ${sheetName} → ${config.outputFile}`);
  console.log(`   ${config.description}`);

  const sheet = workbook.Sheets[sheetName];
  const range = XLSX.utils.decode_range(sheet['!ref'] || 'A1');

  // Leer encabezados desde la fila especificada
  const headers = [];
  const [startCol, endCol] = config.columns.split(':').map((c) => XLSX.utils.decode_col(c));

  for (let col = startCol; col <= endCol; col++) {
    const cellAddress = XLSX.utils.encode_cell({ r: config.headerRow, c: col });
    const cell = sheet[cellAddress];

    if (cell && cell.v) {
      headers.push(String(cell.v).trim());
    } else {
      headers.push(`Column_${XLSX.utils.encode_col(col)}`);
    }
  }

  console.log(`   ✓ Encabezados: ${headers.length} columnas`);

  // Leer datos
  const rows = [];
  const endRow = config.maxRows ? config.dataStartRow + config.maxRows - 1 : range.e.r;

  for (let row = config.dataStartRow; row <= endRow; row++) {
    const rowData = {};
    let hasData = false;

    for (let col = startCol; col <= endCol; col++) {
      const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
      const cell = sheet[cellAddress];
      const header = headers[col - startCol];

      if (cell && cell.v !== undefined && cell.v !== null && cell.v !== '') {
        rowData[header] = cell.v;
        hasData = true;
      } else {
        rowData[header] = '';
      }
    }

    // Solo agregar filas que tengan al menos un dato
    if (hasData) {
      rows.push(rowData);
    }
  }

  console.log(`   ✓ Registros encontrados: ${rows.length}`);

  if (rows.length === 0) {
    console.log(`   ⚠️  No hay datos para exportar`);
    continue;
  }

  // Convertir a CSV
  const outputPath = path.join(OUTPUT_DIR, config.outputFile);

  // Generar CSV manualmente para mejor control
  const csvLines = [];

  // Línea de encabezados
  csvLines.push(headers.map((h) => `"${h}"`).join(','));

  // Líneas de datos
  for (const row of rows) {
    const values = headers.map((h) => {
      const value = row[h];
      if (value === undefined || value === null || value === '') {
        return '';
      }
      // Escapar comillas y envolver en comillas
      const strValue = String(value).replace(/"/g, '""');
      return `"${strValue}"`;
    });
    csvLines.push(values.join(','));
  }

  fs.writeFileSync(outputPath, csvLines.join('\n'), 'utf8');

  console.log(`   ✅ Guardado: ${config.outputFile}`);

  totalRegistros += rows.length;
  archivosGenerados++;
}

console.log(`\n${'='.repeat(60)}`);
console.log(`✅ CONVERSIÓN COMPLETADA\n`);
console.log(`📊 Resumen:`);
console.log(`   • Archivos generados: ${archivosGenerados}`);
console.log(`   • Total registros: ${totalRegistros}`);
console.log(`   • Ubicación: ${OUTPUT_DIR}\n`);

console.log(`🎯 Próximos pasos:`);
console.log(`   1. Verificar datos: ls data/csv/`);
console.log(`   2. Importar a Firestore: npm run import:csv\n`);
