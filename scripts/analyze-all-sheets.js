/**
 * Análisis Profundo de TODAS las Hojas del Excel
 * Muestra estructura real de cada tabla
 */
import fs from 'node:fs';
import XLSX from 'xlsx';

const EXCEL_PATH = 'C:\\Users\\xpovo\\Downloads\\Copia de Administación_General.xlsx';

console.log('📊 ANÁLISIS COMPLETO DE TODAS LAS HOJAS DEL EXCEL\n');
console.log('='.repeat(80));

try {
  const workbook = XLSX.readFile(EXCEL_PATH);
  const analysis = {};

  workbook.SheetNames.forEach((sheetName, index) => {
    console.log(`\n🔍 HOJA ${index + 1}: "${sheetName}"`);
    console.log('-'.repeat(80));

    const sheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    // Información básica
    console.log(`📋 Total de filas: ${data.length}`);

    // Mostrar primeras 5 filas para ver estructura
    console.log('\n📌 Primeras 5 filas:');
    for (let i = 0; i < Math.min(5, data.length); i++) {
      const row = data[i];
      console.log(`\nFila ${i}:`);
      if (Array.isArray(row)) {
        row.forEach((cell, colIndex) => {
          if (cell !== null && cell !== undefined && cell !== '') {
            console.log(`  Col ${colIndex}: ${JSON.stringify(cell).substring(0, 50)}`);
          }
        });
      } else {
        console.log(`  ${JSON.stringify(row).substring(0, 200)}`);
      }
    }

    // Detectar fila de encabezados (buscar fila con más strings)
    let headerRowIndex = -1;
    let maxStrings = 0;
    for (let i = 0; i < Math.min(10, data.length); i++) {
      const row = data[i];
      if (Array.isArray(row)) {
        const stringCount = row.filter(
          (cell) => typeof cell === 'string' && cell.trim() !== ''
        ).length;
        if (stringCount > maxStrings) {
          maxStrings = stringCount;
          headerRowIndex = i;
        }
      }
    }

    if (headerRowIndex >= 0) {
      console.log(`\n✅ Encabezados detectados en Fila ${headerRowIndex}:`);
      const headers = data[headerRowIndex];
      headers.forEach((header, index) => {
        if (header !== null && header !== undefined && header !== '') {
          console.log(`  [${index}] ${header}`);
        }
      });
    }

    // Contar filas con datos reales (no vacías)
    let nonEmptyRows = 0;
    for (let i = headerRowIndex + 1; i < data.length; i++) {
      const row = data[i];
      const hasData =
        Array.isArray(row) &&
        row.some((cell) => cell !== null && cell !== undefined && cell !== '' && cell !== 0);
      if (hasData) nonEmptyRows++;
    }

    console.log(`\n📊 Filas con datos: ${nonEmptyRows} de ${data.length}`);

    // Mostrar última fila con datos
    for (let i = data.length - 1; i >= 0; i--) {
      const row = data[i];
      const hasData =
        Array.isArray(row) &&
        row.some((cell) => cell !== null && cell !== undefined && cell !== '' && cell !== 0);
      if (hasData) {
        console.log(`\n🔸 Última fila con datos (Fila ${i}):`);
        row.forEach((cell, colIndex) => {
          if (cell !== null && cell !== undefined && cell !== '' && cell !== 0) {
            console.log(`  Col ${colIndex}: ${JSON.stringify(cell).substring(0, 50)}`);
          }
        });
        break;
      }
    }

    // Guardar análisis
    analysis[sheetName] = {
      totalRows: data.length,
      headerRow: headerRowIndex,
      headers: headerRowIndex >= 0 ? data[headerRowIndex] : [],
      nonEmptyRows: nonEmptyRows,
      firstDataRow: headerRowIndex + 1,
      sampleRows: data.slice(0, Math.min(5, data.length)),
    };

    console.log('\n' + '='.repeat(80));
  });

  // Guardar análisis completo
  const outputPath = 'scripts/excel-complete-analysis.json';
  fs.writeFileSync(outputPath, JSON.stringify(analysis, null, 2), 'utf8');
  console.log(`\n✅ Análisis completo guardado en: ${outputPath}`);
} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}
