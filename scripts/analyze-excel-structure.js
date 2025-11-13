#!/usr/bin/env node
/**
 * Script para Analizar Estructura del Excel
 * Inspecciona las hojas y columnas disponibles
 */
import { writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import XLSX from 'xlsx';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const EXCEL_PATH =
  process.env.EXCEL_PATH || join(__dirname, '..', 'Copia de Administación_General.xlsx');

console.log('\n========================================');
console.log('🔍 ANÁLISIS DE ESTRUCTURA DE EXCEL');
console.log('========================================\n');
console.log(`📁 Archivo: ${EXCEL_PATH}\n`);

try {
  const workbook = XLSX.readFile(EXCEL_PATH);

  console.log(`📊 Hojas encontradas: ${workbook.SheetNames.length}\n`);

  const analysis = {};

  workbook.SheetNames.forEach((sheetName, index) => {
    console.log(`\n${index + 1}. 📋 HOJA: "${sheetName}"`);
    console.log('='.repeat(60));

    const sheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(sheet, { defval: '' });

    console.log(`   Registros: ${data.length}`);

    if (data.length > 0) {
      const columns = Object.keys(data[0]);
      console.log(`   Columnas: ${columns.length}`);
      console.log(`\n   📋 Nombres de columnas:`);
      columns.forEach((col, i) => {
        console.log(`      ${i + 1}. ${col}`);
      });

      // Muestra primera fila como ejemplo
      console.log(`\n   🔍 Primera fila (ejemplo):`);
      const firstRow = data[0];
      Object.entries(firstRow).forEach(([key, value]) => {
        const displayValue =
          String(value).length > 50 ? String(value).substring(0, 50) + '...' : value;
        console.log(`      ${key}: ${displayValue}`);
      });

      // Guardar análisis
      analysis[sheetName] = {
        records: data.length,
        columns: columns,
        sampleRow: firstRow,
      };
    } else {
      console.log('   ⚠️  Hoja vacía');
      analysis[sheetName] = {
        records: 0,
        columns: [],
        sampleRow: null,
      };
    }
  });

  // Guardar análisis completo en JSON
  const outputPath = join(__dirname, 'excel-analysis.json');
  writeFileSync(outputPath, JSON.stringify(analysis, null, 2));

  console.log('\n\n========================================');
  console.log('✅ ANÁLISIS COMPLETADO');
  console.log('========================================');
  console.log(`\n📄 Análisis completo guardado en: ${outputPath}\n`);
} catch (error) {
  console.error('\n❌ ERROR:', error.message);
  console.error(error.stack);
  process.exit(1);
}
