#!/usr/bin/env node
/**
 * Validate Excel Data
 * Valida la estructura y contenido de archivos Excel
 */
import fs from 'fs';
import path from 'path';
import xlsx from 'xlsx';

const EXCEL_FILES = [
  'Bancos_Libro.xlsx',
  'CONTROL MAESTRO DE INVENTARIOS.xlsx',
  'Gastos_completos.xlsx',
];

const REQUIRED_SHEETS = {
  'Bancos_Libro.xlsx': ['Bancos', 'Transacciones', 'Resumen'],
  'CONTROL MAESTRO DE INVENTARIOS.xlsx': ['Distribuidores', 'Paneles', 'Inventario'],
  'Gastos_completos.xlsx': ['Gastos', 'Categorias', 'Proveedores'],
};

function validateExcelFile(filePath) {
  const results = {
    file: path.basename(filePath),
    valid: true,
    errors: [],
    warnings: [],
    sheets: {},
  };

  try {
    // Verificar que el archivo existe
    if (!fs.existsSync(filePath)) {
      results.valid = false;
      results.errors.push(`Archivo no encontrado: ${filePath}`);
      return results;
    }

    // Leer el archivo
    const workbook = xlsx.readFile(filePath);
    const fileName = path.basename(filePath);

    console.log(`\n📊 Validando: ${fileName}`);
    console.log(`  Hojas encontradas: ${workbook.SheetNames.length}`);

    // Verificar hojas requeridas
    const requiredSheets = REQUIRED_SHEETS[fileName] || [];
    for (const requiredSheet of requiredSheets) {
      if (!workbook.SheetNames.includes(requiredSheet)) {
        results.valid = false;
        results.errors.push(`Hoja requerida faltante: ${requiredSheet}`);
      }
    }

    // Validar cada hoja
    for (const sheetName of workbook.SheetNames) {
      const sheet = workbook.Sheets[sheetName];
      const data = xlsx.utils.sheet_to_json(sheet, { defval: '' });

      results.sheets[sheetName] = {
        rows: data.length,
        columns: data.length > 0 ? Object.keys(data[0]).length : 0,
        empty: data.length === 0,
      };

      console.log(
        `  ✓ ${sheetName}: ${data.length} filas, ${results.sheets[sheetName].columns} columnas`
      );

      if (data.length === 0) {
        results.warnings.push(`Hoja "${sheetName}" está vacía`);
      }

      // Validar estructura de datos
      if (data.length > 0) {
        const firstRow = data[0];
        const emptyColumns = Object.entries(firstRow)
          .filter(([key, value]) => !value && value !== 0)
          .map(([key]) => key);

        if (emptyColumns.length > 0) {
          results.warnings.push(
            `Hoja "${sheetName}" tiene ${emptyColumns.length} columnas vacías en la primera fila`
          );
        }
      }
    }

    // Validaciones específicas por archivo
    if (fileName === 'Bancos_Libro.xlsx') {
      const bancosSheet = workbook.Sheets['Bancos'];
      if (bancosSheet) {
        const bancosData = xlsx.utils.sheet_to_json(bancosSheet);
        if (bancosData.length < 1) {
          results.warnings.push('Sin datos de bancos');
        }
      }
    }

    if (results.errors.length === 0) {
      console.log(`  ✅ Validación exitosa`);
    } else {
      console.log(`  ❌ Errores encontrados: ${results.errors.length}`);
    }

    if (results.warnings.length > 0) {
      console.log(`  ⚠ Advertencias: ${results.warnings.length}`);
    }
  } catch (error) {
    results.valid = false;
    results.errors.push(`Error al leer archivo: ${error.message}`);
    console.error(`  ❌ Error: ${error.message}`);
  }

  return results;
}

async function validateAllExcelFiles() {
  console.log('🔍 Iniciando validación de archivos Excel...\n');

  const allResults = {
    timestamp: new Date().toISOString(),
    totalFiles: 0,
    validFiles: 0,
    invalidFiles: 0,
    files: [],
  };

  // Buscar archivos Excel en el directorio actual y subdirectorios comunes
  const searchPaths = [
    process.cwd(),
    path.join(process.cwd(), 'data'),
    path.join(process.cwd(), 'excel'),
    path.join(process.cwd(), 'uploads'),
  ];

  const foundFiles = [];

  for (const searchPath of searchPaths) {
    if (fs.existsSync(searchPath)) {
      const files = fs
        .readdirSync(searchPath)
        .filter((f) => f.endsWith('.xlsx') || f.endsWith('.xls'))
        .map((f) => path.join(searchPath, f));
      foundFiles.push(...files);
    }
  }

  if (foundFiles.length === 0) {
    console.log('⚠ No se encontraron archivos Excel');
    console.log('Búsqueda en:', searchPaths);
    process.exit(1);
  }

  console.log(`📁 Archivos Excel encontrados: ${foundFiles.length}\n`);

  // Validar cada archivo
  for (const filePath of foundFiles) {
    const result = validateExcelFile(filePath);
    allResults.files.push(result);
    allResults.totalFiles++;

    if (result.valid) {
      allResults.validFiles++;
    } else {
      allResults.invalidFiles++;
    }
  }

  // Resumen final
  console.log('\n═══════════════════════════════════════');
  console.log('📊 RESUMEN DE VALIDACIÓN');
  console.log('═══════════════════════════════════════');
  console.log(`Total de archivos: ${allResults.totalFiles}`);
  console.log(`✅ Válidos: ${allResults.validFiles}`);
  console.log(`❌ Inválidos: ${allResults.invalidFiles}`);

  // Mostrar errores
  const filesWithErrors = allResults.files.filter((f) => f.errors.length > 0);
  if (filesWithErrors.length > 0) {
    console.log('\n❌ ERRORES ENCONTRADOS:');
    filesWithErrors.forEach((file) => {
      console.log(`\n  ${file.file}:`);
      file.errors.forEach((err) => console.log(`    - ${err}`));
    });
  }

  // Mostrar advertencias
  const filesWithWarnings = allResults.files.filter((f) => f.warnings.length > 0);
  if (filesWithWarnings.length > 0) {
    console.log('\n⚠ ADVERTENCIAS:');
    filesWithWarnings.forEach((file) => {
      console.log(`\n  ${file.file}:`);
      file.warnings.forEach((warn) => console.log(`    - ${warn}`));
    });
  }

  console.log('\n--- VALIDATION RESULTS ---');
  console.log(JSON.stringify(allResults, null, 2));

  process.exit(allResults.invalidFiles > 0 ? 1 : 0);
}

validateAllExcelFiles();
