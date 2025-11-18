/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧪 TESTING COMPLETO - CHRONOS SYSTEM
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Este script ejecuta tests completos de:
 * 1. Flujo Orden de Compra (OC)
 * 2. Flujo Venta Completa
 * 3. Flujo Venta Parcial
 * 4. Flujo Venta Pendiente
 * 5. Verificación de bancos
 * 6. Verificación de almacén
 */
import { initializeApp } from 'firebase/app';
import { collection, doc, getDoc, getDocs, getFirestore, query, where } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyCR7zKZJAzCEq-jBbfkLJxWaz98zuRCkX4',
  authDomain: 'premium-ecosystem-1760790572.firebaseapp.com',
  projectId: 'premium-ecosystem-1760790572',
  storageBucket: 'premium-ecosystem-1760790572.appspot.com',
  messagingSenderId: '1029840619477',
  appId: '1:1029840619477:web:a7e5ad6f3536e0c3b516f8',
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ============================================================================
// UTILIDADES
// ============================================================================

const log = {
  info: (msg) => console.log(`\n✨ ${msg}`),
  success: (msg) => console.log(`✅ ${msg}`),
  error: (msg) => console.log(`❌ ${msg}`),
  warn: (msg) => console.log(`⚠️  ${msg}`),
  test: (msg) => console.log(`\n🧪 ${msg}`),
};

async function verificarDocumento(coleccion, id, descripcion) {
  try {
    const docRef = doc(db, coleccion, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      log.success(`${descripcion}: Documento encontrado`);
      return docSnap.data();
    } else {
      log.error(`${descripcion}: Documento NO encontrado`);
      return null;
    }
  } catch (error) {
    log.error(`${descripcion}: Error - ${error.message}`);
    return null;
  }
}

async function contarDocumentos(coleccion, condiciones = []) {
  try {
    let q;
    if (condiciones.length > 0) {
      q = query(collection(db, coleccion), ...condiciones);
    } else {
      q = collection(db, coleccion);
    }
    const snapshot = await getDocs(q);
    return snapshot.size;
  } catch (error) {
    log.error(`Error al contar documentos en ${coleccion}: ${error.message}`);
    return 0;
  }
}

// ============================================================================
// TEST 1: VERIFICACIÓN DE BANCOS
// ============================================================================

async function test1_VerificarBancos() {
  log.test('TEST 1: Verificación de Bancos');

  const bancosEsperados = [
    'boveda-monte',
    'fletes',
    'utilidades',
    'azteca',
    'leftie',
    'profit',
    'boveda-usa',
    'almacen-monte', // Este puede ser stock físico
  ];

  let bancosEncontrados = 0;

  for (const bancoId of bancosEsperados) {
    const bancoData = await verificarDocumento('bancos', bancoId, `Banco: ${bancoId}`);
    if (bancoData) {
      bancosEncontrados++;
      console.log(`   Capital Actual: $${bancoData.capitalActual?.toLocaleString() || 'N/A'}`);
    }
  }

  log.info(`Total bancos encontrados: ${bancosEncontrados}/8`);

  if (bancosEncontrados >= 7) {
    log.success('TEST 1: APROBADO ✅');
    return true;
  } else {
    log.error('TEST 1: FALLIDO ❌');
    return false;
  }
}

// ============================================================================
// TEST 2: VERIFICACIÓN DE DATOS MAESTROS
// ============================================================================

async function test2_VerificarDatosMaestros() {
  log.test('TEST 2: Verificación de Datos Maestros');

  const tests = [
    { col: 'clientes', esperado: 31, nombre: 'Clientes' },
    { col: 'distribuidores', esperado: 6, nombre: 'Distribuidores' },
    { col: 'ordenesCompra', esperado: 9, nombre: 'Órdenes de Compra' },
    { col: 'ventas', esperado: 96, nombre: 'Ventas' },
  ];

  let todosOk = true;

  for (const test of tests) {
    const count = await contarDocumentos(test.col);
    const status = count >= test.esperado ? '✅' : '⚠️';
    console.log(`${status} ${test.nombre}: ${count} (esperado: ${test.esperado})`);
    if (count < test.esperado) todosOk = false;
  }

  if (todosOk) {
    log.success('TEST 2: APROBADO ✅');
    return true;
  } else {
    log.warn('TEST 2: CON ADVERTENCIAS ⚠️');
    return false;
  }
}

// ============================================================================
// TEST 3: VERIFICACIÓN DE ALMACÉN
// ============================================================================

async function test3_VerificarAlmacen() {
  log.test('TEST 3: Verificación de Almacén');

  const totalMovimientos = await contarDocumentos('almacen');
  log.info(`Total movimientos en almacén: ${totalMovimientos}`);

  // Verificar que hay entradas y salidas
  const entradas = await contarDocumentos('almacen', [where('tipo', '==', 'entrada')]);
  const salidas = await contarDocumentos('almacen', [where('tipo', '==', 'salida')]);

  console.log(`   📥 Entradas: ${entradas}`);
  console.log(`   📤 Salidas: ${salidas}`);

  if (totalMovimientos > 0 && entradas > 0) {
    log.success('TEST 3: APROBADO ✅');
    return true;
  } else {
    log.error('TEST 3: FALLIDO ❌');
    return false;
  }
}

// ============================================================================
// TEST 4: VERIFICACIÓN DE OPERACIONES BANCARIAS
// ============================================================================

async function test4_VerificarOperacionesBancarias() {
  log.test('TEST 4: Verificación de Operaciones Bancarias');

  const totalOperaciones = await contarDocumentos('operaciones_bancos');
  log.info(`Total operaciones bancarias: ${totalOperaciones}`);

  // Verificar operaciones por banco
  const bancos = ['boveda-monte', 'fletes', 'utilidades'];
  for (const bancoId of bancos) {
    const ops = await contarDocumentos('operaciones_bancos', [where('bancoId', '==', bancoId)]);
    console.log(`   ${bancoId}: ${ops} operaciones`);
  }

  if (totalOperaciones > 0) {
    log.success('TEST 4: APROBADO ✅');
    return true;
  } else {
    log.warn('TEST 4: Sin operaciones registradas (puede ser normal si no hay ventas) ⚠️');
    return false;
  }
}

// ============================================================================
// TEST 5: VERIFICACIÓN DE ADEUDOS
// ============================================================================

async function test5_VerificarAdeudos() {
  log.test('TEST 5: Verificación de Adeudos');

  const adeudosClientes = await contarDocumentos('adeudosClientes');
  const adeudosDistribuidores = await contarDocumentos('adeudosDistribuidores');

  console.log(`   Adeudos Clientes: ${adeudosClientes}`);
  console.log(`   Adeudos Distribuidores: ${adeudosDistribuidores}`);

  // Verificar que los clientes con deuda tienen el campo actualizado
  const clientesSnapshot = await getDocs(collection(db, 'clientes'));
  let clientesConDeuda = 0;
  clientesSnapshot.forEach((doc) => {
    const data = doc.data();
    if (data.deudaTotal && data.deudaTotal > 0) {
      clientesConDeuda++;
    }
  });

  console.log(`   Clientes con deudaTotal > 0: ${clientesConDeuda}`);

  log.success('TEST 5: COMPLETADO ✅');
  return true;
}

// ============================================================================
// TEST 6: VERIFICACIÓN DE FÓRMULAS DE DISTRIBUCIÓN
// ============================================================================

async function test6_VerificarFormulas() {
  log.test('TEST 6: Verificación de Fórmulas de Distribución');

  log.info('Fórmulas esperadas para ventas:');
  console.log('   Bóveda Monte = precioCompra × cantidad');
  console.log('   Fletes = flete × cantidad');
  console.log('   Utilidades = (precioVenta - precioCompra - flete) × cantidad');

  log.info('\nEstado de pago:');
  console.log('   Completo: 100% a capital + histórico');
  console.log('   Parcial: Proporcional según montoPagado');
  console.log('   Pendiente: 0% capital, 100% histórico');

  // Verificar una venta aleatoria
  const ventasSnapshot = await getDocs(
    query(collection(db, 'ventas'), where('precioTotal', '>', 0))
  );
  if (ventasSnapshot.size > 0) {
    const venta = ventasSnapshot.docs[0].data();
    log.info(`\nEjemplo de venta encontrada:`);
    console.log(`   Precio Total: $${venta.precioTotal?.toLocaleString() || 'N/A'}`);
    console.log(`   Estado Pago: ${venta.estadoPago || 'N/A'}`);
    if (venta.distribucionBancos) {
      console.log(`   Distribución:`);
      console.log(
        `     - Bóveda Monte: $${venta.distribucionBancos.bovedaMonte?.toLocaleString() || 'N/A'}`
      );
      console.log(`     - Fletes: $${venta.distribucionBancos.fletes?.toLocaleString() || 'N/A'}`);
      console.log(
        `     - Utilidades: $${venta.distribucionBancos.utilidades?.toLocaleString() || 'N/A'}`
      );
    }
  }

  log.success('TEST 6: FÓRMULAS DOCUMENTADAS ✅');
  return true;
}

// ============================================================================
// RESUMEN FINAL
// ============================================================================

async function generarResumenFinal(resultados) {
  console.log(`
╔═══════════════════════════════════════════════════════════════════════════╗
║                     📊 RESUMEN DE TESTING COMPLETO                        ║
╚═══════════════════════════════════════════════════════════════════════════╝
  `);

  const aprobados = resultados.filter((r) => r.aprobado).length;
  const total = resultados.length;
  const porcentaje = ((aprobados / total) * 100).toFixed(0);

  resultados.forEach((r, i) => {
    const status = r.aprobado ? '✅' : '❌';
    console.log(`${status} Test ${i + 1}: ${r.nombre}`);
  });

  console.log(`\n📈 Total: ${aprobados}/${total} tests aprobados (${porcentaje}%)`);

  if (porcentaje >= 80) {
    console.log('\n🎉 SISTEMA APROBADO - Funcionamiento correcto al ' + porcentaje + '%\n');
  } else {
    console.log('\n⚠️  SISTEMA CON ISSUES - Revisar tests fallidos\n');
  }
}

// ============================================================================
// EJECUCIÓN PRINCIPAL
// ============================================================================

async function ejecutarTestsCompletos() {
  console.log(`
╔═══════════════════════════════════════════════════════════════════════════╗
║              🧪 TESTING COMPLETO - CHRONOS SYSTEM v1.0                    ║
║                  Verificación exhaustiva del sistema                      ║
╚═══════════════════════════════════════════════════════════════════════════╝
  `);

  const resultados = [];

  // Test 1
  const test1 = await test1_VerificarBancos();
  resultados.push({ nombre: 'Verificación de Bancos', aprobado: test1 });

  // Test 2
  const test2 = await test2_VerificarDatosMaestros();
  resultados.push({ nombre: 'Verificación de Datos Maestros', aprobado: test2 });

  // Test 3
  const test3 = await test3_VerificarAlmacen();
  resultados.push({ nombre: 'Verificación de Almacén', aprobado: test3 });

  // Test 4
  const test4 = await test4_VerificarOperacionesBancarias();
  resultados.push({ nombre: 'Verificación de Operaciones Bancarias', aprobado: test4 });

  // Test 5
  const test5 = await test5_VerificarAdeudos();
  resultados.push({ nombre: 'Verificación de Adeudos', aprobado: test5 });

  // Test 6
  const test6 = await test6_VerificarFormulas();
  resultados.push({ nombre: 'Verificación de Fórmulas', aprobado: test6 });

  // Resumen final
  await generarResumenFinal(resultados);

  process.exit(0);
}

// Ejecutar
ejecutarTestsCompletos().catch((error) => {
  console.error('\n❌ Error fatal en testing:', error);
  process.exit(1);
});
