/**
 * Debug script para entender discrepancia en Gastos y Abonos
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

console.log('🔍 Analizando Gastos y Abonos en Control_Maestro');
console.log('─'.repeat(80));

let conFecha = 0;
let conOrigen = 0;
let conValor = 0;
let conTodos = 0;
let valorCero = 0;
let valorNegativo = 0;

const muestras = [];

for (let i = 3; i < data.length; i++) {
  const fechaGasto = parseExcelDate(data[i][14]);
  const origen = cleanString(data[i][15]);
  const valor = parseNumber(data[i][16]);

  const tieneFecha = !!fechaGasto;
  const tieneOrigen = !!origen;
  const tieneValor = valor > 0;

  if (tieneFecha) conFecha++;
  if (tieneOrigen) conOrigen++;
  if (tieneValor) conValor++;

  if (tieneFecha && tieneOrigen && tieneValor) {
    conTodos++;
  }

  if (valor === 0 && (tieneFecha || tieneOrigen)) valorCero++;
  if (valor < 0) valorNegativo++;

  // Capturar primeras 5 muestras que tienen fecha+origen pero NO valor>0
  if (tieneFecha && tieneOrigen && !tieneValor && muestras.length < 5) {
    muestras.push({
      fila: i + 1,
      fecha: fechaGasto,
      origen,
      valor,
      raw: data[i][16],
    });
  }
}

console.log(`📊 Estadísticas:`);
console.log(`   Filas con Fecha (col 14): ${conFecha}`);
console.log(`   Filas con Origen (col 15): ${conOrigen}`);
console.log(`   Filas con Valor > 0 (col 16): ${conValor}`);
console.log(`   Filas con FECHA + ORIGEN + VALOR > 0: ${conTodos} ← Importadas`);
console.log(`   Filas con Fecha/Origen pero Valor = 0: ${valorCero}`);
console.log(`   Filas con Valor negativo: ${valorNegativo}`);

console.log(`\n📋 Primeras 5 muestras con Fecha+Origen pero SIN valor>0:\n`);
muestras.forEach((m) => {
  console.log(`   Fila ${m.fila}: ${m.fecha} | ${m.origen} | Valor: ${m.valor} (raw: ${m.raw})`);
});

console.log(`\n✅ CONCLUSIÓN:`);
console.log(
  `   El importador usa condición: fechaGasto && origen && valor > 0 = ${conTodos} registros`
);
console.log(
  `   Excel tiene ${conFecha} filas con fecha, pero solo ${conTodos} cumplen todas las condiciones`
);
console.log(`   Diferencia: ${conFecha - conTodos} filas no tienen origen o valor>0`);
