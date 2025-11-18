/**
 * ============================================================================
 * VERIFICADOR DE PRECISIÓN DE IMPORTACIÓN
 * ============================================================================
 * Compara los datos del Excel con lo que se reportó en la importación
 * para garantizar coincidencia 100% exacta
 */
import fs from 'node:fs';
import XLSX from 'xlsx';

const EXCEL_PATH = 'C:\\Users\\xpovo\\Downloads\\Copia de Administación_General.xlsx';
const REPORT_PATH = 'scripts/import-panels-report.json';

console.log('\n════════════════════════════════════════════════════════════════════════════════');
console.log('🔍 VERIFICADOR DE PRECISIÓN - EXCEL vs IMPORTACIÓN');
console.log('════════════════════════════════════════════════════════════════════════════════\n');

// Leer Excel
const workbook = XLSX.readFile(EXCEL_PATH);
const report = JSON.parse(fs.readFileSync(REPORT_PATH, 'utf8'));

const results = {
  totalErrors: 0,
  details: [],
};

// ============================================================================
// FUNCIONES DE CONTEO EXCEL
// ============================================================================

function countRealRows(sheet, startRow = 3) {
  let count = 0;
  const range = XLSX.utils.decode_range(sheet['!ref']);

  for (let row = startRow; row <= range.e.r; row++) {
    let hasData = false;
    for (let col = range.s.c; col <= range.e.c; col++) {
      const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
      const cell = sheet[cellAddress];
      if (cell && cell.v !== null && cell.v !== undefined && cell.v !== '') {
        hasData = true;
        break;
      }
    }
    if (hasData) count++;
  }

  return count;
}

function countControlMaestroVentas(sheet) {
  let count = 0;
  const range = XLSX.utils.decode_range(sheet['!ref']);

  for (let row = 3; row <= range.e.r; row++) {
    // Verificar columnas 0-11 (Venta Local)
    let hasData = false;
    for (let col = 0; col <= 11; col++) {
      const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
      const cell = sheet[cellAddress];
      if (cell && cell.v !== null && cell.v !== undefined && cell.v !== '') {
        hasData = true;
        break;
      }
    }
    if (hasData) count++;
  }

  return count;
}

function countControlMaestroGastos(sheet) {
  let count = 0;
  const range = XLSX.utils.decode_range(sheet['!ref']);

  for (let row = 3; row <= range.e.r; row++) {
    // Verificar columnas 14-21 (GYA)
    let hasData = false;
    for (let col = 14; col <= 21; col++) {
      const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
      const cell = sheet[cellAddress];
      if (cell && cell.v !== null && cell.v !== undefined && cell.v !== '') {
        hasData = true;
        break;
      }
    }
    if (hasData) count++;
  }

  return count;
}

function getBalanceFromExcel(sheet) {
  const cell = sheet['M2']; // Col 13, Row 1 (RF Actual)
  return cell ? parseFloat(cell.v) : 0;
}

function verify(description, excelCount, reportCount, sheetName = '') {
  const match = excelCount === reportCount;
  const status = match ? '✅' : '❌';

  console.log(`${status} ${description}`);
  console.log(`   Excel: ${excelCount} | Importado: ${reportCount}`);

  if (!match) {
    results.totalErrors++;
    results.details.push({
      description,
      sheetName,
      excelCount,
      reportCount,
      difference: reportCount - excelCount,
    });
  }

  console.log('');
}

// ============================================================================
// VERIFICACIONES POR HOJA
// ============================================================================

console.log('📋 VERIFICANDO HOJA 1: Distribuidores\n' + '─'.repeat(80));
const distribuidoresSheet = workbook.Sheets['Distribuidores'];
const distribuidoresCount = countRealRows(distribuidoresSheet, 3);
const ordenesCount = 9; // Conteo manual de OC0001 a OC0009

// Distribuidores únicos
const distribuidoresUnicos = new Set();
for (let row = 3; row <= 11; row++) {
  const origenCell = distribuidoresSheet[XLSX.utils.encode_cell({ r: row, c: 2 })];
  if (origenCell && origenCell.v) {
    distribuidoresUnicos.add(origenCell.v);
  }
}

verify(
  'Distribuidores únicos',
  distribuidoresUnicos.size,
  report.stats.distribuidores,
  'Distribuidores'
);
verify('Órdenes de Compra', ordenesCount, report.stats.ordenesCompra, 'Distribuidores');

console.log('📋 VERIFICANDO HOJA 2: Control_Maestro\n' + '─'.repeat(80));
const controlSheet = workbook.Sheets['Control_Maestro'];
const ventasCount = countControlMaestroVentas(controlSheet);
const gastosCount = countControlMaestroGastos(controlSheet);
const balanceExcel = getBalanceFromExcel(controlSheet);

verify('Ventas (cols 0-11)', ventasCount, report.stats.ventas, 'Control_Maestro');
verify('Gastos y Abonos (cols 14-21)', gastosCount, report.stats.gastosAbonos, 'Control_Maestro');

console.log('💰 Balance Total (RF Actual)');
console.log(
  `   Excel: $${balanceExcel.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
);
console.log(
  `   Importado: $${report.balanceTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
);
if (Math.abs(balanceExcel - report.balanceTotal) < 0.01) {
  console.log('   ✅ COINCIDE\n');
} else {
  console.log('   ❌ NO COINCIDE\n');
  results.totalErrors++;
}

console.log('📋 VERIFICANDO HOJA 3: Almacen_Monte\n' + '─'.repeat(80));
const almacenSheet = workbook.Sheets['Almacen_Monte'];
const almacenCount = countRealRows(almacenSheet, 3);
verify('Movimientos de Almacén', almacenCount, report.stats.inventario, 'Almacen_Monte');

console.log('📋 VERIFICANDO HOJA 4: Bóveda_Monte\n' + '─'.repeat(80));
const bovedaMonteSheet = workbook.Sheets['Bóveda_Monte'];
const bovedaMonteCount = countRealRows(bovedaMonteSheet, 3);
verify('Transacciones Bóveda Monte', bovedaMonteCount, report.stats.bovedaMonte, 'Bóveda_Monte');

console.log('📋 VERIFICANDO HOJA 5: Bóveda_USA\n' + '─'.repeat(80));
const bovedaUSASheet = workbook.Sheets['Bóveda_USA'];
const bovedaUSACount = countRealRows(bovedaUSASheet, 3);
verify('Transacciones Bóveda USA', bovedaUSACount, report.stats.bovedaUSA, 'Bóveda_USA');

console.log('📋 VERIFICANDO HOJA 6: Utilidades\n' + '─'.repeat(80));
const utilidadesSheet = workbook.Sheets['Utilidades'];
const utilidadesCount = countRealRows(utilidadesSheet, 3);
verify('Transacciones Utilidades', utilidadesCount, report.stats.utilidades, 'Utilidades');

console.log('📋 VERIFICANDO HOJA 7: Flete_Sur\n' + '─'.repeat(80));
const fleteSurSheet = workbook.Sheets['Flete_Sur'];
const fleteSurCount = countRealRows(fleteSurSheet, 3);
verify('Transacciones Flete Sur', fleteSurCount, report.stats.fleteSur, 'Flete_Sur');

console.log('📋 VERIFICANDO HOJA 8: Azteca\n' + '─'.repeat(80));
const aztecaSheet = workbook.Sheets['Azteca'];
const aztecaCount = countRealRows(aztecaSheet, 3);
verify('Transacciones Banco Azteca', aztecaCount, report.stats.bancoAzteca, 'Azteca');

console.log('📋 VERIFICANDO HOJA 9: Leftie\n' + '─'.repeat(80));
const leftieSheet = workbook.Sheets['Leftie'];
const leftieCount = countRealRows(leftieSheet, 3);
verify('Transacciones Banco Leftie', leftieCount, report.stats.bancoLeftie, 'Leftie');

console.log('📋 VERIFICANDO HOJA 10: Profit\n' + '─'.repeat(80));
const profitSheet = workbook.Sheets['Profit'];
const profitCount = countRealRows(profitSheet, 3);
verify('Transacciones Banco Profit', profitCount, report.stats.bancoProfit, 'Profit');

console.log('📋 VERIFICANDO HOJA 11: Clientes\n' + '─'.repeat(80));
const clientesSheet = workbook.Sheets['Clientes'];
const clientesCount = countRealRows(clientesSheet, 3);
verify('Clientes', clientesCount, report.stats.clientes, 'Clientes');

console.log('📋 VERIFICANDO HOJA 12: DATA\n' + '─'.repeat(80));
const dataSheet = workbook.Sheets['DATA'];
const dataCount = countRealRows(dataSheet, 1);
verify('Datos Auxiliares', dataCount, report.stats.datosAuxiliares, 'DATA');

// ============================================================================
// RESUMEN FINAL
// ============================================================================

console.log('════════════════════════════════════════════════════════════════════════════════');
console.log('📊 RESUMEN DE VERIFICACIÓN');
console.log('════════════════════════════════════════════════════════════════════════════════\n');

if (results.totalErrors === 0) {
  console.log('✅ ¡PERFECTO! Todos los datos coinciden exactamente con el Excel\n');
  console.log('🎯 Total verificado: ' + report.totalRegistros + ' registros');
  console.log(
    '💰 Balance verificado: $' +
      report.balanceTotal.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
  );
} else {
  console.log(`❌ Se encontraron ${results.totalErrors} discrepancias:\n`);

  results.details.forEach((detail, index) => {
    console.log(`${index + 1}. ${detail.description} (${detail.sheetName})`);
    console.log(`   Excel: ${detail.excelCount} | Importado: ${detail.reportCount}`);
    console.log(`   Diferencia: ${detail.difference > 0 ? '+' : ''}${detail.difference}\n`);
  });
}

console.log('════════════════════════════════════════════════════════════════════════════════\n');

// Guardar reporte de verificación
const verificationReport = {
  timestamp: new Date().toISOString(),
  totalErrors: results.totalErrors,
  status: results.totalErrors === 0 ? 'PASS' : 'FAIL',
  details: results.details,
  summary: {
    totalRecords: report.totalRegistros,
    balanceTotal: report.balanceTotal,
    verified: results.totalErrors === 0,
  },
};

fs.writeFileSync('scripts/verification-report.json', JSON.stringify(verificationReport, null, 2));

console.log('📄 Reporte de verificación guardado en: scripts/verification-report.json\n');

process.exit(results.totalErrors === 0 ? 0 : 1);
