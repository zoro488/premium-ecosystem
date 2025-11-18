/**
 * Debug detallado de Bóveda USA - Comparación Excel vs Firestore
 */
import { initializeApp } from 'firebase/app';
import { collection, getDocs, getFirestore, query, where } from 'firebase/firestore';
import XLSX from 'xlsx';

const firebaseConfig = {
  projectId: 'premium-ecosystem-1760790572',
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const EXCEL_PATH = 'C:\\Users\\xpovo\\Downloads\\Copia de Administación_General.xlsx';

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

console.log('🔍 ANÁLISIS DETALLADO: BÓVEDA USA');
console.log('═'.repeat(80));

// Leer Excel
const wb = XLSX.readFile(EXCEL_PATH);
const sheet = wb.Sheets['Bóveda_USA'];
const data = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: null });

console.log('\n📊 ANÁLISIS EXCEL (Bóveda_USA):\n');

const transaccionesExcel = [];
for (let i = 3; i < data.length; i++) {
  const row = data[i];
  if (!row || row.length === 0) continue;

  const fecha = parseExcelDate(row[0]);
  if (!fecha) continue;

  const ingreso = parseNumber(row[2]);
  const fechaGasto = parseExcelDate(row[6] || row[10]);
  const gasto = parseNumber(row[8] || row[11] || row[12]);

  if (ingreso > 0) {
    transaccionesExcel.push({
      fila: i + 1,
      tipo: 'ingreso',
      fecha,
      monto: ingreso,
      cliente: row[1],
    });
  }

  if (fechaGasto && gasto > 0) {
    transaccionesExcel.push({
      fila: i + 1,
      tipo: 'gasto',
      fecha: fechaGasto,
      monto: gasto,
      origen: row[7] || row[11],
    });
  }
}

console.log(`Total transacciones según lógica importador: ${transaccionesExcel.length}`);
console.log(`  Ingresos: ${transaccionesExcel.filter((t) => t.tipo === 'ingreso').length}`);
console.log(`  Gastos: ${transaccionesExcel.filter((t) => t.tipo === 'gasto').length}`);

// Leer Firestore
const q = query(collection(db, 'transaccionesBoveda'), where('panel', '==', 'bovedaUSA'));
const snapshot = await getDocs(q);

console.log(`\n🔥 FIRESTORE (transaccionesBoveda donde panel=bovedaUSA):\n`);
console.log(`Total documentos: ${snapshot.size}`);

const transaccionesFirestore = [];
snapshot.forEach((doc) => {
  const d = doc.data();
  transaccionesFirestore.push({
    tipo: d.tipo,
    fecha: d.fecha,
    monto: d.monto,
  });
});

console.log(`  Ingresos: ${transaccionesFirestore.filter((t) => t.tipo === 'ingreso').length}`);
console.log(`  Gastos: ${transaccionesFirestore.filter((t) => t.tipo === 'gasto').length}`);

console.log('\n📋 COMPARACIÓN:\n');
console.log(`Excel: ${transaccionesExcel.length} transacciones`);
console.log(`Firestore: ${snapshot.size} transacciones`);
console.log(`Diferencia: ${transaccionesExcel.length - snapshot.size}`);

if (transaccionesExcel.length !== snapshot.size) {
  console.log('\n🔍 PRIMERAS 5 TRANSACCIONES EXCEL:\n');
  transaccionesExcel.slice(0, 5).forEach((t) => {
    console.log(`   Fila ${t.fila}: ${t.tipo} | ${t.fecha} | $${t.monto}`);
  });

  console.log('\n🔍 PRIMERAS 5 TRANSACCIONES FIRESTORE:\n');
  transaccionesFirestore.slice(0, 5).forEach((t) => {
    console.log(`   ${t.tipo} | ${t.fecha} | $${t.monto}`);
  });
}

console.log('\n' + '═'.repeat(80));
