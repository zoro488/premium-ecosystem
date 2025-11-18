import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import XLSX from 'xlsx';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const EXCEL_FILE = path.join(__dirname, '..', 'Administación_General.xlsx');

console.log('\n╔═══════════════════════════════════════════════════════╗');
console.log('║                                                       ║');
console.log('║     🔍 ANÁLISIS DETALLADO DEL EXCEL                  ║');
console.log('║                                                       ║');
console.log('╚═══════════════════════════════════════════════════════╝\n');

if (!fs.existsSync(EXCEL_FILE)) {
  console.error('❌ No se encontró el archivo Excel:', EXCEL_FILE);
  process.exit(1);
}

const workbook = XLSX.readFile(EXCEL_FILE);

console.log(`📁 Archivo: ${path.basename(EXCEL_FILE)}\n`);

workbook.SheetNames.forEach((sheetName, index) => {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`📄 HOJA ${index + 1}: "${sheetName}"`);
  console.log(`${'='.repeat(60)}\n`);

  const sheet = workbook.Sheets[sheetName];
  const range = XLSX.utils.decode_range(sheet['!ref'] || 'A1');

  console.log(`📐 Rango completo: ${sheet['!ref']}`);
  console.log(`   Columnas: ${range.s.c} a ${range.e.c} (${range.e.c - range.s.c + 1} columnas)`);
  console.log(`   Filas: ${range.s.r} a ${range.e.r} (${range.e.r - range.s.r + 1} filas)\n`);

  // Analizar filas con datos reales
  let filasConDatos = 0;
  let primeraFilaConDatos = -1;
  let ultimaFilaConDatos = -1;
  let columnasConDatos = new Set();

  for (let row = range.s.r; row <= range.e.r; row++) {
    let tieneDatos = false;

    for (let col = range.s.c; col <= range.e.c; col++) {
      const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
      const cell = sheet[cellAddress];

      if (cell && cell.v !== undefined && cell.v !== null && cell.v !== '') {
        tieneDatos = true;
        columnasConDatos.add(col);
      }
    }

    if (tieneDatos) {
      filasConDatos++;
      if (primeraFilaConDatos === -1) primeraFilaConDatos = row;
      ultimaFilaConDatos = row;
    }
  }

  console.log(`📊 ANÁLISIS DE DATOS REALES:`);
  console.log(`   ✓ Filas con datos: ${filasConDatos}`);
  console.log(`   ✓ Primera fila con datos: ${primeraFilaConDatos + 1}`);
  console.log(`   ✓ Última fila con datos: ${ultimaFilaConDatos + 1}`);
  console.log(`   ✓ Columnas con datos: ${columnasConDatos.size}\n`);

  // Mostrar las primeras 5 filas con datos
  console.log(`📋 PRIMERAS 5 FILAS CON DATOS:\n`);

  let filasMostradas = 0;
  for (let row = primeraFilaConDatos; row <= ultimaFilaConDatos && filasMostradas < 5; row++) {
    const rowData = [];
    let hayDatos = false;

    for (let col = range.s.c; col <= range.e.c; col++) {
      const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
      const cell = sheet[cellAddress];

      if (cell && cell.v !== undefined && cell.v !== null && cell.v !== '') {
        hayDatos = true;
      }

      rowData.push(cell ? cell.v : '');
    }

    if (hayDatos) {
      console.log(`   Fila ${row + 1}:`);
      rowData.forEach((val, idx) => {
        if (val !== '') {
          const colLetter = XLSX.utils.encode_col(idx);
          console.log(
            `      ${colLetter}: ${String(val).substring(0, 50)}${String(val).length > 50 ? '...' : ''}`
          );
        }
      });
      console.log('');
      filasMostradas++;
    }
  }

  // Analizar encabezados
  console.log(`📑 ANÁLISIS DE ENCABEZADOS (primera fila con datos):\n`);
  if (primeraFilaConDatos !== -1) {
    const headers = [];
    for (let col = range.s.c; col <= range.e.c; col++) {
      const cellAddress = XLSX.utils.encode_cell({ r: primeraFilaConDatos, c: col });
      const cell = sheet[cellAddress];

      if (cell && cell.v) {
        const colLetter = XLSX.utils.encode_col(col);
        console.log(`      ${colLetter}: "${cell.v}"`);
        headers.push(cell.v);
      }
    }

    if (headers.length > 0) {
      console.log(`\n   ✓ Total encabezados: ${headers.length}`);
    }
  }

  // Detectar si los datos están en horizontal
  const datosHorizontales = range.e.c - range.s.c > ultimaFilaConDatos - primeraFilaConDatos;
  console.log(
    `\n🔄 ORIENTACIÓN: ${datosHorizontales ? '➡️  HORIZONTAL (más columnas que filas)' : '⬇️  VERTICAL (más filas que columnas)'}`
  );

  if (datosHorizontales) {
    console.log(`   ⚠️  Esta hoja parece tener datos organizados horizontalmente`);
    console.log(`   💡 Puede requerir transposición para convertir a CSV correctamente`);
  }

  console.log(`\n💾 RESUMEN PARA EXPORTACIÓN:`);
  console.log(`   • Registros útiles: ${filasConDatos - 1} (sin contar encabezado)`);
  console.log(
    `   • Rango a exportar: ${XLSX.utils.encode_cell({ r: primeraFilaConDatos, c: range.s.c })}:${XLSX.utils.encode_cell({ r: ultimaFilaConDatos, c: range.e.c })}`
  );
});

console.log(`\n${'='.repeat(60)}`);
console.log('✅ Análisis completado\n');
