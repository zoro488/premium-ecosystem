/**
 * Verificar si las filas con gastos también tienen fecha en col[0]
 */
import XLSX from 'xlsx';

const EXCEL_PATH = 'C:\\Users\\xpovo\\Downloads\\Copia de Administación_General.xlsx';

function cleanString(value) {
  if (value === null || value === undefined) return '';
  return String(value).trim();
}

function parseNumber(value) {
  if (value === null || value === undefined || value === '') return 0;
  const num = Number.parseFloat(String(value).replace(/[^0-9.-]/g, ''));
  return Number.isNaN(num) ? 0 : num;
}

function parseExcelDate(value) {
  if (!value) return '';
  if (typeof value === 'number') {
    const date = XLSX.SSF.parse_date_code(value);
    return `${date.y}-${String(date.m).padStart(2, '0')}-${String(date.d).padStart(2, '0')}`;
  }
  return value;
}

const wb = XLSX.readFile(EXCEL_PATH);
const sheet = wb.Sheets['Control_Maestro'];
const data = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: null });

console.log('🔍 Analizando correlación entre col[0] (fecha) y gastos (cols 14-16)');
console.log('─'.repeat(80));

let gastosConFechaCol0 = 0;
let gastosSinFechaCol0 = 0;
const muestras = [];

for (let i = 3; i < data.length; i++) {
  const fechaCol0 = parseExcelDate(data[i][0]); // Fecha en col 0
  const fechaGasto = parseExcelDate(data[i][14]); // Fecha de gasto col 14
  const origen = cleanString(data[i][15]);
  const valor = parseNumber(data[i][16]);

  // Verificar si cumple condiciones de gasto
  if (fechaGasto && origen && valor > 0) {
    if (fechaCol0) {
      gastosConFechaCol0++;
    } else {
      gastosSinFechaCol0++;
      if (muestras.length < 10) {
        muestras.push({
          fila: i + 1,
          fechaGasto,
          origen,
          valor,
          fechaCol0: fechaCol0 || 'VACÍO',
        });
      }
    }
  }
}

console.log(`📊 Resultados:`);
console.log(`   Gastos con fecha en COL[0]: ${gastosConFechaCol0} ← Se importan`);
console.log(`   Gastos SIN fecha en COL[0]: ${gastosSinFechaCol0} ← Se saltan por línea 300`);
console.log(`   Total gastos válidos: ${gastosConFechaCol0 + gastosSinFechaCol0}`);

if (muestras.length > 0) {
  console.log(`\n🔍 Primeras 10 muestras de gastos sin fecha en col[0]:\n`);
  muestras.forEach((m) => {
    console.log(
      `   Fila ${m.fila}: Fecha Gasto=${m.fechaGasto} | Origen=${m.origen} | Valor=${m.valor} | Col[0]=${m.fechaCol0}`
    );
  });
}

console.log(`\n✅ CONCLUSIÓN:`);
console.log(
  `   El importador procesa solo filas con fecha en col[0]: ${gastosConFechaCol0} registros`
);
console.log(`   Se saltan ${gastosSinFechaCol0} gastos porque su fila no tiene fecha en col[0]`);
