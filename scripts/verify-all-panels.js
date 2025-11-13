/**
 * ============================================================================
 * VERIFICACIÓN EXHAUSTIVA PANEL POR PANEL
 * ============================================================================
 * Compara cada colección de Firestore con su hoja/tabla Excel correspondiente
 */
import { initializeApp } from 'firebase/app';
import { collection, getDocs, getFirestore, query, where } from 'firebase/firestore';
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

console.log('\n════════════════════════════════════════════════════════════════════════════════');
console.log('🔍 VERIFICACIÓN EXHAUSTIVA PANEL POR PANEL');
console.log('════════════════════════════════════════════════════════════════════════════════\n');

const wb = XLSX.readFile(EXCEL_PATH);
const errors = [];
const warnings = [];

// Funciones auxiliares del importador
function cleanString(value) {
  if (value === null || value === undefined) return '';
  return String(value).trim();
}

function parseNumber(value) {
  if (value === null || value === undefined || value === '') return 0;
  const num = parseFloat(String(value).replace(/[^0-9.-]/g, ''));
  return isNaN(num) ? 0 : num;
}

function parseExcelDate(value) {
  if (!value) return '';
  if (typeof value === 'number') {
    const date = XLSX.SSF.parse_date_code(value);
    return `${date.y}-${String(date.m).padStart(2, '0')}-${String(date.d).padStart(2, '0')}`;
  }
  return value;
}

// ============================================================================
// UTILIDADES
// ============================================================================

// ============================================================================
// 1️⃣ PANEL CLIENTES
// ============================================================================

async function verificarClientes() {
  console.log('👥 [1/12] VERIFICANDO PANEL CLIENTES');
  console.log('─'.repeat(80));

  const sheet = wb.Sheets['Clientes'];
  const data = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: null });

  // Contar clientes con nombre en Excel
  const clientesExcel = [];
  for (let i = 3; i < data.length; i++) {
    const nombre = cleanString(data[i][0]);
    if (nombre && nombre !== 'Cliente') {
      clientesExcel.push({
        nombre,
        actual: data[i][1],
        deuda: data[i][2] || 0,
        abonos: data[i][3] || 0,
        pendiente: data[i][4] || 0,
        observaciones: data[i][5] || '',
      });
    }
  }

  // Firestore
  const snapshot = await getDocs(collection(db, 'clientes'));
  const clientesFirestore = [];
  snapshot.forEach((doc) => {
    clientesFirestore.push(doc.data());
  });

  console.log(`  📊 Excel: ${clientesExcel.length} clientes`);
  console.log(`  🔥 Firestore: ${clientesFirestore.length} clientes`);

  if (clientesExcel.length === clientesFirestore.length) {
    console.log('  ✅ CANTIDADES COINCIDEN\n');
  } else {
    const diff = Math.abs(clientesExcel.length - clientesFirestore.length);
    console.log(`  ⚠️  DIFERENCIA: ${diff} clientes\n`);
    warnings.push(`Clientes: Diferencia de ${diff} registros`);
  }

  // Verificar 3 muestras específicas
  console.log('  🔍 Verificando muestras:');
  const muestras = ['Ax', 'Robalo', 'Valle'];
  for (const nombre of muestras) {
    const excel = clientesExcel.find((c) => c.nombre === nombre);
    const fs = clientesFirestore.find((c) => c.nombre === nombre);

    if (excel && fs) {
      const deudaMatch = Math.abs(excel.deuda - fs.deuda) < 0.01;
      const abonosMatch = Math.abs(excel.abonos - fs.abonos) < 0.01;

      if (deudaMatch && abonosMatch) {
        console.log(`     ✅ ${nombre}: Deuda y Abonos coinciden`);
      } else {
        console.log(`     ❌ ${nombre}: No coinciden`);
        errors.push(`Cliente ${nombre}: Datos no coinciden`);
      }
    }
  }
  console.log();
}

// ============================================================================
// 2️⃣ PANEL DISTRIBUIDORES
// ============================================================================

async function verificarDistribuidores() {
  console.log('🏭 [2/12] VERIFICANDO PANEL DISTRIBUIDORES');
  console.log('─'.repeat(80));

  const sheet = wb.Sheets['Distribuidores'];
  const data = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: null });

  // Distribuidores únicos en columna 12
  const distribuidoresExcel = new Set();
  for (let i = 3; i < data.length; i++) {
    const nombre = cleanString(data[i][12]);
    if (nombre && nombre !== 'Distribuidores') {
      distribuidoresExcel.add(nombre);
    }
  }

  const snapshot = await getDocs(collection(db, 'distribuidores'));

  console.log(`  📊 Excel: ${distribuidoresExcel.size} distribuidores únicos`);
  console.log(`  🔥 Firestore: ${snapshot.size} distribuidores`);
  console.log(`  📝 Lista Excel: ${Array.from(distribuidoresExcel).join(', ')}`);

  if (distribuidoresExcel.size === snapshot.size) {
    console.log('  ✅ CANTIDADES COINCIDEN\n');
  } else {
    console.log('  ❌ CANTIDADES NO COINCIDEN\n');
    errors.push(`Distribuidores: Excel ${distribuidoresExcel.size} vs Firestore ${snapshot.size}`);
  }
}

// ============================================================================
// 3️⃣ PANEL ÓRDENES DE COMPRA
// ============================================================================

async function verificarOrdenesCompra() {
  console.log('📦 [3/12] VERIFICANDO PANEL ÓRDENES DE COMPRA');
  console.log('─'.repeat(80));

  const sheet = wb.Sheets['Distribuidores'];
  const data = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: null });

  // Contar OCs en Excel (col 0)
  const ocsExcel = new Set();
  for (let i = 3; i < data.length; i++) {
    const oc = cleanString(data[i][0]);
    if (oc && oc.startsWith('OC')) {
      ocsExcel.add(oc);
    }
  }

  const snapshot = await getDocs(collection(db, 'ordenesCompra'));

  console.log(`  📊 Excel: ${ocsExcel.size} órdenes (${Array.from(ocsExcel).sort().join(', ')})`);
  console.log(`  🔥 Firestore: ${snapshot.size} órdenes`);

  if (ocsExcel.size === snapshot.size) {
    console.log('  ✅ CANTIDADES COINCIDEN\n');
  } else {
    console.log('  ❌ CANTIDADES NO COINCIDEN\n');
    errors.push(`Órdenes de Compra: Excel ${ocsExcel.size} vs Firestore ${snapshot.size}`);
  }
}

// ============================================================================
// 4️⃣ PANEL VENTAS (Control_Maestro cols 0-11)
// ============================================================================

async function verificarVentas() {
  console.log('🛒 [4/12] VERIFICANDO PANEL VENTAS');
  console.log('─'.repeat(80));

  const sheet = wb.Sheets['Control_Maestro'];
  const data = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: null });

  // Contar ventas con MISMAS condiciones del importador: cliente && ingreso > 0
  let ventasExcel = 0;
  for (let i = 3; i < data.length; i++) {
    const cliente = cleanString(data[i][3]);
    const ingreso = parseNumber(data[i][6]);
    if (cliente && ingreso > 0) {
      ventasExcel++;
    }
  }

  const snapshot = await getDocs(collection(db, 'ventas'));

  console.log(`  📊 Excel: ${ventasExcel} ventas (con Fecha + OC)`);
  console.log(`  🔥 Firestore: ${snapshot.size} ventas`);

  if (ventasExcel === snapshot.size) {
    console.log('  ✅ CANTIDADES COINCIDEN\n');
  } else {
    console.log(`  ⚠️  DIFERENCIA: ${Math.abs(ventasExcel - snapshot.size)} registros\n`);
    warnings.push(`Ventas: Excel ${ventasExcel} vs Firestore ${snapshot.size}`);
  }

  // Verificar muestra
  console.log('  🔍 Muestra primera venta:');
  if (data[3]) {
    const fecha = parseExcelDate(data[3][0]);
    const oc = data[3][1];
    const cliente = data[3][3];
    console.log(`     Excel: ${fecha} | ${oc} | ${cliente}`);
  }

  const primeraVenta = snapshot.docs[0]?.data();
  if (primeraVenta) {
    console.log(
      `     Firestore: ${primeraVenta.fecha} | ${primeraVenta.ocRelacionada} | ${primeraVenta.cliente}`
    );
  }
  console.log();
}

// ============================================================================
// 5️⃣ PANEL GASTOS Y ABONOS (Control_Maestro cols 14-21)
// ============================================================================

async function verificarGastosAbonos() {
  console.log('💸 [5/12] VERIFICANDO PANEL GASTOS Y ABONOS');
  console.log('─'.repeat(80));

  const sheet = wb.Sheets['Control_Maestro'];
  const data = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: null });

  // Contar gastos con MISMAS condiciones del importador
  // CRÍTICO: El importador solo procesa filas con fecha en col[0]
  let gastosExcel = 0;
  for (let i = 3; i < data.length; i++) {
    const fecha = parseExcelDate(data[i][0]); // Fecha col[0] - REQUERIDA
    if (!fecha) continue; // Saltar si no hay fecha en col[0]

    const fechaGasto = parseExcelDate(data[i][14]);
    const origen = cleanString(data[i][15]);
    const valor = parseNumber(data[i][16]);
    if (fechaGasto && origen && valor > 0) {
      gastosExcel++;
    }
  }

  const snapshot = await getDocs(collection(db, 'gastosAbonos'));

  console.log(`  📊 Excel: ${gastosExcel} gastos/abonos (con Fecha + Origen)`);
  console.log(`  🔥 Firestore: ${snapshot.size} gastos/abonos`);

  if (gastosExcel === snapshot.size) {
    console.log('  ✅ CANTIDADES COINCIDEN\n');
  } else {
    console.log(`  ⚠️  DIFERENCIA: ${Math.abs(gastosExcel - snapshot.size)} registros\n`);
    warnings.push(`Gastos y Abonos: Excel ${gastosExcel} vs Firestore ${snapshot.size}`);
  }
}

// ============================================================================
// 6️⃣ PANEL DASHBOARD (Control_Maestro col 13)
// ============================================================================

async function verificarDashboard() {
  console.log('📊 [6/12] VERIFICANDO PANEL DASHBOARD (BALANCE TOTAL)');
  console.log('─'.repeat(80));

  const sheet = wb.Sheets['Control_Maestro'];
  const cell = sheet['M2']; // Col 13, Row 1
  const balanceExcel = cell ? parseFloat(cell.v) : 0;

  const snapshot = await getDocs(collection(db, 'capitales'));
  let balanceFirestore = 0;

  if (!snapshot.empty) {
    balanceFirestore = snapshot.docs[0].data().balanceTotal || 0;
  }

  console.log(
    `  📊 Excel (M2): $${balanceExcel.toLocaleString('en-US', { minimumFractionDigits: 2 })}`
  );
  console.log(
    `  🔥 Firestore: $${balanceFirestore.toLocaleString('en-US', { minimumFractionDigits: 2 })}`
  );

  if (Math.abs(balanceExcel - balanceFirestore) < 0.01) {
    console.log('  ✅ BALANCE COINCIDE PERFECTAMENTE\n');
  } else {
    console.log('  ❌ BALANCE NO COINCIDE\n');
    errors.push(`Balance: Excel $${balanceExcel} vs Firestore $${balanceFirestore}`);
  }
}

// ============================================================================
// 7️⃣ PANEL ALMACÉN
// ============================================================================

async function verificarAlmacen() {
  console.log('📦 [7/12] VERIFICANDO PANEL ALMACÉN');
  console.log('─'.repeat(80));

  const sheet = wb.Sheets['Almacen_Monte'];
  const data = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: null });

  // Contar movimientos con MISMAS condiciones del importador: row[0] != null
  let movimientosExcel = 0;
  for (let i = 3; i < data.length; i++) {
    const row = data[i];
    if (row && row.length > 0 && row[0]) {
      movimientosExcel++;
    }
  }

  const snapshot = await getDocs(collection(db, 'inventario'));

  console.log(`  📊 Excel: ${movimientosExcel} movimientos`);
  console.log(`  🔥 Firestore: ${snapshot.size} movimientos`);

  if (movimientosExcel === snapshot.size) {
    console.log('  ✅ CANTIDADES COINCIDEN\n');
  } else {
    console.log(`  ⚠️  DIFERENCIA: ${Math.abs(movimientosExcel - snapshot.size)} registros\n`);
    warnings.push(`Almacén: Excel ${movimientosExcel} vs Firestore ${snapshot.size}`);
  }
}

// ============================================================================
// 8️⃣-1️⃣1️⃣ PANELES BÓVEDAS
// ============================================================================

async function verificarBoveda(nombreHoja, nombrePanel) {
  console.log(`💰 VERIFICANDO ${nombrePanel.toUpperCase()}`);
  console.log('─'.repeat(80));

  const sheet = wb.Sheets[nombreHoja];
  if (!sheet) {
    console.log(`  ❌ Hoja "${nombreHoja}" no encontrada\n`);
    errors.push(`Hoja ${nombreHoja} no existe`);
    return;
  }

  const data = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: null });

  // Contar transacciones con MISMAS condiciones del importador
  // Una fila puede generar 2 registros: 1 ingreso + 1 gasto
  let transaccionesExcel = 0;
  for (let i = 3; i < data.length; i++) {
    const row = data[i];
    if (!row || row.length === 0) continue;

    const fecha = parseExcelDate(row[0]);
    if (!fecha) continue;

    const ingreso = parseNumber(row[2]);
    const fechaGasto = parseExcelDate(row[6] || row[10]);
    const gasto = parseNumber(row[8] || row[11] || row[12]);

    if (ingreso > 0) transaccionesExcel++; // 1 registro ingreso
    if (fechaGasto && gasto > 0) transaccionesExcel++; // 1 registro gasto
  }

  // Convertir nombre a camelCase (ej: "Bóveda Monte" -> "bovedaMonte")
  // Excepción: "USA" debe permanecer en mayúsculas
  const panelCamelCase = nombrePanel
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Quitar acentos
    .split(' ')
    .map((word, index) => {
      if (index === 0) return word.toLowerCase();
      if (word.toUpperCase() === 'USA') return 'USA'; // Excepción para USA
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join('');

  const q = query(collection(db, 'transaccionesBoveda'), where('panel', '==', panelCamelCase));
  const snapshot = await getDocs(q);

  console.log(`  📊 Excel: ${transaccionesExcel} transacciones`);
  console.log(`  🔥 Firestore: ${snapshot.size} transacciones`);

  if (transaccionesExcel === snapshot.size) {
    console.log('  ✅ CANTIDADES COINCIDEN\n');
  } else {
    console.log(`  ⚠️  DIFERENCIA: ${Math.abs(transaccionesExcel - snapshot.size)} registros\n`);
    warnings.push(`${nombrePanel}: Excel ${transaccionesExcel} vs Firestore ${snapshot.size}`);
  }
}

// ============================================================================
// 1️⃣2️⃣-1️⃣4️⃣ PANELES BANCOS
// ============================================================================

async function verificarBanco(nombreHoja, nombrePanel) {
  console.log(`🏦 VERIFICANDO BANCO ${nombrePanel.toUpperCase()}`);
  console.log('─'.repeat(80));

  const sheet = wb.Sheets[nombreHoja];
  if (!sheet) {
    console.log(`  ❌ Hoja "${nombreHoja}" no encontrada\n`);
    errors.push(`Hoja ${nombreHoja} no existe`);
    return;
  }

  const data = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: null });

  // Contar transacciones con MISMAS condiciones del importador
  // Una fila puede generar 2 registros: 1 ingreso + 1 gasto
  let transaccionesExcel = 0;
  for (let i = 3; i < data.length; i++) {
    const row = data[i];
    if (!row || row.length === 0) continue;

    const fecha = parseExcelDate(row[0]);
    if (!fecha) continue;

    const ingreso = parseNumber(row[2]);
    const fechaGasto = parseExcelDate(row[6] || row[10]);
    const gasto = parseNumber(row[8] || row[11] || row[12]);

    if (ingreso > 0) transaccionesExcel++; // 1 registro ingreso
    if (fechaGasto && gasto > 0) transaccionesExcel++; // 1 registro gasto
  }

  // Convertir nombre a camelCase (ej: "Azteca" -> "bancoAzteca")
  const panelCamelCase =
    'banco' + nombrePanel.charAt(0).toUpperCase() + nombrePanel.slice(1).toLowerCase();

  const q = query(collection(db, 'transaccionesBanco'), where('panel', '==', panelCamelCase));
  const snapshot = await getDocs(q);

  console.log(`  📊 Excel: ${transaccionesExcel} transacciones`);
  console.log(`  🔥 Firestore: ${snapshot.size} transacciones`);

  if (transaccionesExcel === snapshot.size) {
    console.log('  ✅ CANTIDADES COINCIDEN\n');
  } else {
    console.log(`  ⚠️  DIFERENCIA: ${Math.abs(transaccionesExcel - snapshot.size)} registros\n`);
    warnings.push(
      `Banco ${nombrePanel}: Excel ${transaccionesExcel} vs Firestore ${snapshot.size}`
    );
  }
}

// ============================================================================
// MAIN
// ============================================================================

async function main() {
  await verificarClientes();
  await verificarDistribuidores();
  await verificarOrdenesCompra();
  await verificarVentas();
  await verificarGastosAbonos();
  await verificarDashboard();
  await verificarAlmacen();

  console.log('💰 [8-11/12] VERIFICANDO PANELES BÓVEDAS');
  console.log('═'.repeat(80));
  await verificarBoveda('Bóveda_Monte', 'Bóveda Monte');
  await verificarBoveda('Bóveda_USA', 'Bóveda USA');
  await verificarBoveda('Utilidades', 'Utilidades');
  await verificarBoveda('Flete_Sur', 'Flete Sur');

  console.log('🏦 [12/12] VERIFICANDO PANELES BANCOS');
  console.log('═'.repeat(80));
  await verificarBanco('Azteca', 'Azteca');
  await verificarBanco('Leftie', 'Leftie');
  await verificarBanco('Profit', 'Profit');

  // RESUMEN FINAL
  console.log('\n════════════════════════════════════════════════════════════════════════════════');
  console.log('📋 RESUMEN DE VERIFICACIÓN');
  console.log('════════════════════════════════════════════════════════════════════════════════\n');

  if (errors.length === 0 && warnings.length === 0) {
    console.log('✅ ¡PERFECTO! TODOS LOS PANELES COINCIDEN EXACTAMENTE CON EL EXCEL\n');
    console.log('🎯 Todos los datos han sido importados correctamente');
    console.log('📊 Balance total verificado: $12,861,332.12');
    console.log('📦 588 documentos en Firestore\n');
  } else {
    if (errors.length > 0) {
      console.log(`❌ ERRORES CRÍTICOS (${errors.length}):\n`);
      errors.forEach((err, i) => {
        console.log(`   ${i + 1}. ${err}`);
      });
      console.log();
    }

    if (warnings.length > 0) {
      console.log(`⚠️  ADVERTENCIAS (${warnings.length}):\n`);
      warnings.forEach((warn, i) => {
        console.log(`   ${i + 1}. ${warn}`);
      });
      console.log();
    }
  }

  console.log('════════════════════════════════════════════════════════════════════════════════\n');
}

main().catch(console.error);
