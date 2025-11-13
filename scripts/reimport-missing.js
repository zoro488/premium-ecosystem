/**
 * Script para REIMPORTAR registros faltantes en paneles con discrepancias
 */
import { initializeApp } from 'firebase/app';
import {
  collection,
  doc,
  getDocs,
  getFirestore,
  query,
  where,
  writeBatch,
} from 'firebase/firestore';
import XLSX from 'xlsx';

const firebaseConfig = {
  apiKey: 'AIzaSyDo7cXp9-iODHW5cxlM9UL32qz2z_L8krc',
  authDomain: 'premium-ecosystem-1760790572.firebaseapp.com',
  projectId: 'premium-ecosystem-1760790572',
  storageBucket: 'premium-ecosystem-1760790572.appspot.com',
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

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

console.log('🔄 REIMPORTANDO REGISTROS FALTANTES');
console.log('═'.repeat(80));

const wb = XLSX.readFile(EXCEL_PATH);

// ============================================================================
// PANEL: BÓVEDA USA
// ============================================================================
async function reimportarBovedaUSA() {
  console.log('\n💰 BÓVEDA USA');
  console.log('─'.repeat(80));

  const sheet = wb.Sheets['Bóveda_USA'];
  const data = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: null });

  // Obtener transacciones actuales
  const q = query(collection(db, 'transaccionesBoveda'), where('panel', '==', 'bovedaUSA'));
  const snapshot = await getDocs(q);

  const existentes = new Set();
  snapshot.forEach((docSnap) => {
    const d = docSnap.data();
    const key = `${d.tipo}|${d.fecha}|${d.monto}`;
    existentes.add(key);
  });

  console.log(`  📊 Transacciones actuales: ${snapshot.size}`);

  // Procesar Excel y encontrar faltantes
  const faltantes = [];
  for (let i = 3; i < data.length; i++) {
    const row = data[i];
    if (!row || row.length === 0) continue;

    const fecha = parseExcelDate(row[0]);
    if (!fecha) continue;

    const ingreso = parseNumber(row[2]);
    const fechaGasto = parseExcelDate(row[6] || row[10]);
    const gasto = parseNumber(row[8] || row[11] || row[12]);

    if (ingreso > 0) {
      const key = `ingreso|${fecha}|${ingreso}`;
      if (!existentes.has(key)) {
        faltantes.push({
          fecha,
          tipo: 'ingreso',
          panel: 'bovedaUSA',
          cliente: cleanString(row[1]) || '',
          monto: ingreso,
          tc: parseNumber(row[3]) || 0,
          pesos: parseNumber(row[4]) || 0,
          destino: cleanString(row[5]) || '',
          concepto: cleanString(row[6]) || '',
          observaciones: cleanString(row[7]) || '',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      }
    }

    if (fechaGasto && gasto > 0) {
      const key = `gasto|${fechaGasto}|${gasto}`;
      if (!existentes.has(key)) {
        faltantes.push({
          fecha: fechaGasto,
          tipo: 'gasto',
          panel: 'bovedaUSA',
          origen: cleanString(row[7] || row[11]) || '',
          monto: gasto,
          tc: parseNumber(row[9] || row[13]) || 0,
          pesos: parseNumber(row[10] || row[14]) || 0,
          destino: cleanString(row[11] || row[15]) || '',
          concepto: cleanString(row[12] || row[16]) || '',
          observaciones: cleanString(row[13] || row[17]) || '',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      }
    }
  }

  console.log(`  ➕ Registros faltantes: ${faltantes.length}`);

  if (faltantes.length > 0) {
    const batch = writeBatch(db);
    faltantes.forEach((transaccion) => {
      const docRef = doc(collection(db, 'transaccionesBoveda'));
      batch.set(docRef, transaccion);
      console.log(`     • ${transaccion.tipo} | ${transaccion.fecha} | $${transaccion.monto}`);
    });

    await batch.commit();
    console.log(`  ✅ Importados ${faltantes.length} registros\n`);
  } else {
    console.log(`  ℹ️  No hay registros faltantes\n`);
  }
}

// ============================================================================
// PANEL: BANCO AZTECA
// ============================================================================
async function reimportarBancoAzteca() {
  console.log('\n🏦 BANCO AZTECA');
  console.log('─'.repeat(80));

  const sheet = wb.Sheets['Azteca'];
  const data = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: null });

  const q = query(collection(db, 'transaccionesBanco'), where('panel', '==', 'bancoAzteca'));
  const snapshot = await getDocs(q);

  const existentes = new Set();
  snapshot.forEach((docSnap) => {
    const d = docSnap.data();
    const key = `${d.tipo}|${d.fecha}|${d.monto}`;
    existentes.add(key);
  });

  console.log(`  📊 Transacciones actuales: ${snapshot.size}`);

  const faltantes = [];
  for (let i = 3; i < data.length; i++) {
    const row = data[i];
    if (!row || row.length === 0) continue;

    const fecha = parseExcelDate(row[0]);
    if (!fecha) continue;

    const ingreso = parseNumber(row[2]);
    const fechaGasto = parseExcelDate(row[6] || row[10]);
    const gasto = parseNumber(row[8] || row[11] || row[12]);

    if (ingreso > 0) {
      const key = `ingreso|${fecha}|${ingreso}`;
      if (!existentes.has(key)) {
        faltantes.push({
          fecha,
          tipo: 'ingreso',
          panel: 'bancoAzteca',
          cliente: cleanString(row[1]) || '',
          monto: ingreso,
          tc: parseNumber(row[3]) || 0,
          pesos: parseNumber(row[4]) || 0,
          destino: cleanString(row[5]) || '',
          concepto: cleanString(row[6]) || '',
          observaciones: cleanString(row[7]) || '',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      }
    }

    if (fechaGasto && gasto > 0) {
      const key = `gasto|${fechaGasto}|${gasto}`;
      if (!existentes.has(key)) {
        faltantes.push({
          fecha: fechaGasto,
          tipo: 'gasto',
          panel: 'bancoAzteca',
          origen: cleanString(row[7] || row[11]) || '',
          monto: gasto,
          tc: parseNumber(row[9] || row[13]) || 0,
          pesos: parseNumber(row[10] || row[14]) || 0,
          destino: cleanString(row[11] || row[15]) || '',
          concepto: cleanString(row[12] || row[16]) || '',
          observaciones: cleanString(row[13] || row[17]) || '',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      }
    }
  }

  console.log(`  ➕ Registros faltantes: ${faltantes.length}`);

  if (faltantes.length > 0) {
    const batch = writeBatch(db);
    faltantes.forEach((transaccion) => {
      const docRef = doc(collection(db, 'transaccionesBanco'));
      batch.set(docRef, transaccion);
      console.log(`     • ${transaccion.tipo} | ${transaccion.fecha} | $${transaccion.monto}`);
    });

    await batch.commit();
    console.log(`  ✅ Importados ${faltantes.length} registros\n`);
  } else {
    console.log(`  ℹ️  No hay registros faltantes\n`);
  }
}

// ============================================================================
// PANEL: BANCO LEFTIE
// ============================================================================
async function reimportarBancoLeftie() {
  console.log('\n🏦 BANCO LEFTIE');
  console.log('─'.repeat(80));

  const sheet = wb.Sheets['Leftie'];
  const data = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: null });

  const q = query(collection(db, 'transaccionesBanco'), where('panel', '==', 'bancoLeftie'));
  const snapshot = await getDocs(q);

  const existentes = new Set();
  snapshot.forEach((docSnap) => {
    const d = docSnap.data();
    const key = `${d.tipo}|${d.fecha}|${d.monto}`;
    existentes.add(key);
  });

  console.log(`  📊 Transacciones actuales: ${snapshot.size}`);

  const faltantes = [];
  for (let i = 3; i < data.length; i++) {
    const row = data[i];
    if (!row || row.length === 0) continue;

    const fecha = parseExcelDate(row[0]);
    if (!fecha) continue;

    const ingreso = parseNumber(row[2]);
    const fechaGasto = parseExcelDate(row[6] || row[10]);
    const gasto = parseNumber(row[8] || row[11] || row[12]);

    if (ingreso > 0) {
      const key = `ingreso|${fecha}|${ingreso}`;
      if (!existentes.has(key)) {
        faltantes.push({
          fecha,
          tipo: 'ingreso',
          panel: 'bancoLeftie',
          cliente: cleanString(row[1]) || '',
          monto: ingreso,
          tc: parseNumber(row[3]) || 0,
          pesos: parseNumber(row[4]) || 0,
          destino: cleanString(row[5]) || '',
          concepto: cleanString(row[6]) || '',
          observaciones: cleanString(row[7]) || '',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      }
    }

    if (fechaGasto && gasto > 0) {
      const key = `gasto|${fechaGasto}|${gasto}`;
      if (!existentes.has(key)) {
        faltantes.push({
          fecha: fechaGasto,
          tipo: 'gasto',
          panel: 'bancoLeftie',
          origen: cleanString(row[7] || row[11]) || '',
          monto: gasto,
          tc: parseNumber(row[9] || row[13]) || 0,
          pesos: parseNumber(row[10] || row[14]) || 0,
          destino: cleanString(row[11] || row[15]) || '',
          concepto: cleanString(row[12] || row[16]) || '',
          observaciones: cleanString(row[13] || row[17]) || '',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      }
    }
  }

  console.log(`  ➕ Registros faltantes: ${faltantes.length}`);

  if (faltantes.length > 0) {
    const batch = writeBatch(db);
    faltantes.forEach((transaccion) => {
      const docRef = doc(collection(db, 'transaccionesBanco'));
      batch.set(docRef, transaccion);
      console.log(`     • ${transaccion.tipo} | ${transaccion.fecha} | $${transaccion.monto}`);
    });

    await batch.commit();
    console.log(`  ✅ Importados ${faltantes.length} registros\n`);
  } else {
    console.log(`  ℹ️  No hay registros faltantes\n`);
  }
}

// ============================================================================
// MAIN
// ============================================================================
async function main() {
  await reimportarBovedaUSA();
  await reimportarBancoAzteca();
  await reimportarBancoLeftie();

  console.log('═'.repeat(80));
  console.log('✅ REIMPORTACIÓN COMPLETADA');
  console.log('═'.repeat(80));
  console.log('\n💡 Ejecuta verify-all-panels.js para verificar el resultado\n');
}

main().catch(console.error);
