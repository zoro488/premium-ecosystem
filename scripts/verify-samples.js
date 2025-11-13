/**
 * Verificación detallada de muestras de datos Excel vs Firestore
 */
import { initializeApp } from 'firebase/app';
import { collection, getDocs, getFirestore, limit, query } from 'firebase/firestore';
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

console.log('\n🔍 VERIFICACIÓN DETALLADA DE MUESTRAS\n');
console.log('═'.repeat(80));

async function verificarClientes() {
  console.log('\n👥 CLIENTES - Primeros 5\n');
  console.log('─'.repeat(80));

  // Excel
  const wb = XLSX.readFile(EXCEL_PATH);
  const sheet = wb.Sheets['Clientes'];
  const data = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: null });

  console.log('📊 EXCEL (filas 3-7):');
  for (let i = 3; i < 8; i++) {
    const row = data[i];
    if (row && row[0]) {
      console.log(`  ${i - 2}. ${row[0]} | Deuda: ${row[2] || 0} | Abonos: ${row[3] || 0}`);
    }
  }

  // Firestore
  const q = query(collection(db, 'clientes'), limit(5));
  const snapshot = await getDocs(q);

  console.log('\n🔥 FIRESTORE:');
  let index = 1;
  snapshot.forEach((doc) => {
    const data = doc.data();
    console.log(
      `  ${index}. ${data.nombre} | Deuda: ${data.deuda || 0} | Abonos: ${data.abonos || 0}`
    );
    index++;
  });
}

async function verificarVentas() {
  console.log('\n\n🛒 VENTAS - Primeras 5\n');
  console.log('─'.repeat(80));

  // Excel
  const wb = XLSX.readFile(EXCEL_PATH);
  const sheet = wb.Sheets['Control_Maestro'];
  const data = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: null });

  console.log('📊 EXCEL (Control_Maestro cols 0-11):');
  let count = 0;
  for (let i = 3; i < 100 && count < 5; i++) {
    const row = data[i];
    if (row && row[0] && row[1]) {
      const fecha =
        typeof row[0] === 'number'
          ? new Date((row[0] - 25569) * 86400 * 1000).toISOString().split('T')[0]
          : row[0];
      console.log(
        `  ${count + 1}. ${fecha} | OC: ${row[1]} | Cliente: ${row[3]} | Cantidad: ${row[2]}`
      );
      count++;
    }
  }

  // Firestore
  const q = query(collection(db, 'ventas'), limit(5));
  const snapshot = await getDocs(q);

  console.log('\n🔥 FIRESTORE:');
  let index = 1;
  snapshot.forEach((doc) => {
    const data = doc.data();
    console.log(
      `  ${index}. ${data.fecha} | OC: ${data.ocRelacionada} | Cliente: ${data.cliente} | Cantidad: ${data.cantidad}`
    );
    index++;
  });
}

async function verificarDistribuidores() {
  console.log('\n\n🏭 DISTRIBUIDORES\n');
  console.log('─'.repeat(80));

  // Excel - columna "Distribuidores" (col 12)
  const wb = XLSX.readFile(EXCEL_PATH);
  const sheet = wb.Sheets['Distribuidores'];
  const data = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: null });

  const distribuidoresExcel = new Set();
  for (let i = 3; i < 100; i++) {
    const row = data[i];
    if (row && row[12]) {
      distribuidoresExcel.add(row[12]);
    }
  }

  console.log('📊 EXCEL (col "Distribuidores"):');
  Array.from(distribuidoresExcel).forEach((d, i) => {
    console.log(`  ${i + 1}. ${d}`);
  });

  // Firestore
  const snapshot = await getDocs(collection(db, 'distribuidores'));

  console.log('\n🔥 FIRESTORE:');
  let index = 1;
  snapshot.forEach((doc) => {
    const data = doc.data();
    console.log(
      `  ${index}. ${data.nombre} | Costo Total: $${data.costoTotal?.toLocaleString() || 0}`
    );
    index++;
  });
}

async function verificarBalance() {
  console.log('\n\n💰 BALANCE TOTAL\n');
  console.log('─'.repeat(80));

  // Excel
  const wb = XLSX.readFile(EXCEL_PATH);
  const sheet = wb.Sheets['Control_Maestro'];
  const cell = sheet['M2']; // Col 13, Row 1
  const balanceExcel = cell ? parseFloat(cell.v) : 0;

  console.log(
    `📊 EXCEL (Control_Maestro M2): $${balanceExcel.toLocaleString('en-US', { minimumFractionDigits: 2 })}`
  );

  // Firestore
  const snapshot = await getDocs(collection(db, 'capitales'));
  if (!snapshot.empty) {
    const data = snapshot.docs[0].data();
    const balanceFirestore = data.balanceTotal || 0;
    console.log(
      `🔥 FIRESTORE: $${balanceFirestore.toLocaleString('en-US', { minimumFractionDigits: 2 })}`
    );

    if (Math.abs(balanceExcel - balanceFirestore) < 0.01) {
      console.log('✅ COINCIDEN PERFECTAMENTE');
    } else {
      console.log(
        `❌ DIFERENCIA: $${Math.abs(balanceExcel - balanceFirestore).toLocaleString('en-US', { minimumFractionDigits: 2 })}`
      );
    }
  } else {
    console.log('❌ No se encontró documento de capitales en Firestore');
  }
}

async function main() {
  await verificarClientes();
  await verificarVentas();
  await verificarDistribuidores();
  await verificarBalance();

  console.log('\n' + '═'.repeat(80));
  console.log('✅ Verificación de muestras completada\n');
}

main().catch(console.error);
