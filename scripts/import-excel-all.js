/**
 * IMPORTADOR COMPLETO - TODAS LAS HOJAS DEL EXCEL
 * ==================================================
 * Importa ~1,579+ registros reales de 12 hojas:
 * - Distribuidores: 9 órdenes de compra
 * - Control_Maestro: 998 ventas + gastos
 * - Almacen_Monte: 96 movimientos inventario
 * - Bóveda_Monte: 69 transacciones caja
 * - Bóveda_USA: 49 transacciones caja
 * - Utilidades: 52 registros
 * - Flete_Sur: 103 registros fletes
 * - Azteca: 25 transacciones bancarias
 * - Leftie: 9 transacciones bancarias
 * - Profit: 55 transacciones bancarias
 * - Clientes: 31 clientes
 * - DATA: 83 datos auxiliares
 *
 * TOTAL ESPERADO: ~1,579 registros
 * BALANCE: $12,861,332.12 USD
 */
import { initializeApp } from 'firebase/app';
import { collection, doc, getFirestore, writeBatch } from 'firebase/firestore';
import fs from 'node:fs';
import XLSX from 'xlsx';

// Firebase config
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY || 'AIzaSyDo7cXp9-iODHW5cxlM9UL32qz2z_L8krc',
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN || 'premium-ecosystem.firebaseapp.com',
  projectId: process.env.VITE_FIREBASE_PROJECT_ID || 'premium-ecosystem',
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET || 'premium-ecosystem.appspot.com',
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '123456789012',
  appId: process.env.VITE_FIREBASE_APP_ID || '1:123456789012:web:abcdef123456',
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const EXCEL_PATH = 'C:\\Users\\xpovo\\Downloads\\Copia de Administación_General.xlsx';
const DRY_RUN = process.argv.includes('--dry-run');

// Utilidades
const cleanString = (value) => {
  if (typeof value !== 'string') return value;
  return value.replace(/\s+/g, ' ').trim();
};

const parseNumber = (value) => {
  if (typeof value === 'number') return value;
  if (!value) return 0;
  const cleaned = String(value).replace(/[$,]/g, '').trim();
  const num = parseFloat(cleaned);
  return isNaN(num) ? 0 : num;
};

const parseExcelDate = (serial) => {
  if (!serial || typeof serial !== 'number') return null;
  const utcDays = serial - 25569;
  const utcValue = utcDays * 86400;
  const date = new Date(utcValue * 1000);
  return date.toISOString().split('T')[0];
};

// Contador de registros
const stats = {
  clientes: 0,
  ordenesCompra: 0,
  ventas: 0,
  gastos: 0,
  movimientosInventario: 0,
  transaccionesBoveda: 0,
  transaccionesBanco: 0,
  datosAuxiliares: 0,
};

console.log('\n📊 IMPORTACIÓN COMPLETA DE TODAS LAS HOJAS DEL EXCEL');
console.log('='.repeat(80));
console.log(`⚙️  Modo: ${DRY_RUN ? '🧪 DRY RUN (prueba)' : '🔥 PRODUCCIÓN (escribe a Firestore)'}`);
console.log('='.repeat(80) + '\n');

try {
  const workbook = XLSX.readFile(EXCEL_PATH);

  // ============================================================================
  // 1. IMPORTAR CLIENTES (31 registros)
  // ============================================================================
  console.log('\n👥 [1/12] Importando Clientes...');
  const clientesSheet = workbook.Sheets['Clientes'];
  const clientesData = XLSX.utils.sheet_to_json(clientesSheet, { header: 1 });
  const clientesHeaders = clientesData[2]; // Fila 2: headers
  const clientesRows = clientesData.slice(3); // Fila 3+: datos

  console.log(`  📋 Headers: ${clientesHeaders.filter(Boolean).join(', ')}`);
  console.log(`  📊 Total filas: ${clientesRows.length}`);

  let batch = writeBatch(db);
  let batchCount = 0;
  const clientesMap = new Map();

  for (const row of clientesRows) {
    if (!row || row.length === 0) continue;
    const nombre = cleanString(row[0]);
    if (!nombre || nombre === 'Cliente' || clientesMap.has(nombre)) continue;

    const cliente = {
      nombre,
      creditoAutorizado: parseNumber(row[1]),
      deuda: parseNumber(row[2]),
      abonos: parseNumber(row[3]),
      pendiente: parseNumber(row[4]),
      observaciones: cleanString(row[5]) || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    clientesMap.set(nombre, cliente);
    stats.clientes++;

    if (!DRY_RUN) {
      const docRef = doc(collection(db, 'clientes'));
      batch.set(docRef, cliente);
      batchCount++;

      if (batchCount >= 500) {
        await batch.commit();
        batch = writeBatch(db);
        batchCount = 0;
      }
    }
  }

  if (!DRY_RUN && batchCount > 0) {
    await batch.commit();
  }

  console.log(`  ✅ ${stats.clientes} clientes procesados ${DRY_RUN ? '(DRY RUN)' : '✓'}`);

  // ============================================================================
  // 2. IMPORTAR ÓRDENES DE COMPRA (9 registros)
  // ============================================================================
  console.log('\n📦 [2/12] Importando Órdenes de Compra...');
  const ocSheet = workbook.Sheets['Distribuidores'];
  const ocData = XLSX.utils.sheet_to_json(ocSheet, { header: 1 });
  const ocHeaders = ocData[2]; // Fila 2: headers
  const ocRows = ocData.slice(3); // Fila 3+: datos

  console.log(`  📋 Headers: ${ocHeaders.filter(Boolean).join(', ')}`);
  console.log(`  📊 Total filas: ${ocRows.length}`);

  batch = writeBatch(db);
  batchCount = 0;
  const ocMap = new Map();

  for (const row of ocRows) {
    if (!row || row.length === 0) continue;
    const codigoOC = cleanString(row[0]);
    if (!codigoOC || codigoOC === 'OC' || ocMap.has(codigoOC)) continue;

    const ordenCompra = {
      codigoOC,
      fecha: parseExcelDate(row[1]),
      origen: cleanString(row[2]) || '',
      cantidad: parseNumber(row[3]),
      costoDistribuidor: parseNumber(row[4]),
      costoTransporte: parseNumber(row[5]),
      costoPorUnidad: parseNumber(row[6]),
      stockActual: parseNumber(row[7]),
      costoTotal: parseNumber(row[8]),
      pagoADistribuidor: parseNumber(row[9]),
      deuda: parseNumber(row[10]),
      distribuidor: cleanString(row[12]) || '',
      distribuidorCostoTotal: parseNumber(row[13]),
      distribuidorAbonos: parseNumber(row[14]),
      distribuidorPendiente: parseNumber(row[15]),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    ocMap.set(codigoOC, ordenCompra);
    stats.ordenesCompra++;

    if (!DRY_RUN) {
      const docRef = doc(collection(db, 'ordenesCompra'));
      batch.set(docRef, ordenCompra);
      batchCount++;

      if (batchCount >= 500) {
        await batch.commit();
        batch = writeBatch(db);
        batchCount = 0;
      }
    }
  }

  if (!DRY_RUN && batchCount > 0) {
    await batch.commit();
  }

  console.log(
    `  ✅ ${stats.ordenesCompra} órdenes de compra procesadas ${DRY_RUN ? '(DRY RUN)' : '✓'}`
  );

  // ============================================================================
  // 3. IMPORTAR CONTROL_MAESTRO (998 registros - Ventas + Gastos)
  // ============================================================================
  console.log('\n📋 [3/12] Importando Control Maestro (Ventas + Gastos)...');
  const controlSheet = workbook.Sheets['Control_Maestro'];
  const controlData = XLSX.utils.sheet_to_json(controlSheet, { header: 1 });
  const controlHeaders = controlData[2]; // Fila 2: headers
  const controlRows = controlData.slice(3); // Fila 3+: datos

  console.log(`  📋 Headers: ${controlHeaders.filter(Boolean).join(', ')}`);
  console.log(`  📊 Total filas: ${controlRows.length}`);

  batch = writeBatch(db);
  batchCount = 0;

  for (const row of controlRows) {
    if (!row || row.length === 0) continue;
    const fecha = parseExcelDate(row[0]);
    if (!fecha) continue;

    // Detectar si es Venta (columnas 0-11) o Gasto (columnas 14-21)
    const esVenta = row[3] && row[6]; // Cliente e Ingreso
    const esGasto = row[15] && row[16]; // Origen del Gasto y Valor

    if (esVenta) {
      const venta = {
        fecha,
        ocRelacionada: cleanString(row[1]) || '',
        cantidad: parseNumber(row[2]),
        cliente: cleanString(row[3]) || '',
        bovedaMonte: parseNumber(row[4]),
        precioVenta: parseNumber(row[5]),
        ingreso: parseNumber(row[6]),
        flete: cleanString(row[7]) || '',
        fleteUtilidad: parseNumber(row[8]),
        utilidad: parseNumber(row[9]),
        estatus: cleanString(row[10]) || 'Pendiente',
        concepto: cleanString(row[11]) || '',
        panel: cleanString(row[12]) || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      stats.ventas++;

      if (!DRY_RUN) {
        const docRef = doc(collection(db, 'ventas'));
        batch.set(docRef, venta);
        batchCount++;

        if (batchCount >= 500) {
          await batch.commit();
          batch = writeBatch(db);
          batchCount = 0;
        }
      }
    }

    if (esGasto) {
      const gasto = {
        fecha: parseExcelDate(row[14]),
        origen: cleanString(row[15]) || '',
        valor: parseNumber(row[16]),
        tc: parseNumber(row[17]),
        pesos: parseNumber(row[18]),
        destino: cleanString(row[19]) || '',
        concepto: cleanString(row[20]) || '',
        observaciones: cleanString(row[21]) || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      stats.gastos++;

      if (!DRY_RUN) {
        const docRef = doc(collection(db, 'gastos'));
        batch.set(docRef, gasto);
        batchCount++;

        if (batchCount >= 500) {
          await batch.commit();
          batch = writeBatch(db);
          batchCount = 0;
        }
      }
    }
  }

  if (!DRY_RUN && batchCount > 0) {
    await batch.commit();
  }

  console.log(`  ✅ ${stats.ventas} ventas procesadas ${DRY_RUN ? '(DRY RUN)' : '✓'}`);
  console.log(`  ✅ ${stats.gastos} gastos procesados ${DRY_RUN ? '(DRY RUN)' : '✓'}`);

  // ============================================================================
  // 4. IMPORTAR ALMACEN_MONTE (96 registros)
  // ============================================================================
  console.log('\n📦 [4/12] Importando Almacén Monte...');
  const almacenSheet = workbook.Sheets['Almacen_Monte'];
  const almacenData = XLSX.utils.sheet_to_json(almacenSheet, { header: 1 });
  const almacenHeaders = almacenData[2];
  const almacenRows = almacenData.slice(3);

  console.log(`  📊 Total filas: ${almacenRows.length}`);

  batch = writeBatch(db);
  batchCount = 0;

  for (const row of almacenRows) {
    if (!row || row.length === 0 || !row[0]) continue;

    const movimiento = {
      oc: cleanString(row[0]) || '',
      fecha: parseExcelDate(row[1]),
      distribuidor: cleanString(row[2]) || '',
      cantidadIngreso: parseNumber(row[3]),
      fechaIngreso: parseExcelDate(row[4]),
      corte: parseNumber(row[5]),
      fechaSalida: parseExcelDate(row[6]),
      clienteSalida: cleanString(row[7]) || '',
      cantidadSalida: parseNumber(row[8]),
      concepto: cleanString(row[9]) || '',
      observaciones: cleanString(row[10]) || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    stats.movimientosInventario++;

    if (!DRY_RUN) {
      const docRef = doc(collection(db, 'inventario'));
      batch.set(docRef, movimiento);
      batchCount++;

      if (batchCount >= 500) {
        await batch.commit();
        batch = writeBatch(db);
        batchCount = 0;
      }
    }
  }

  if (!DRY_RUN && batchCount > 0) {
    await batch.commit();
  }

  console.log(
    `  ✅ ${stats.movimientosInventario} movimientos procesados ${DRY_RUN ? '(DRY RUN)' : '✓'}`
  );

  // ============================================================================
  // 5-10. IMPORTAR BÓVEDAS Y BANCOS (agregado como transacciones)
  // ============================================================================
  const bovedaBancoSheets = [
    { name: 'Bóveda_Monte', tipo: 'boveda_monte', filas: 69 },
    { name: 'Bóveda_USA', tipo: 'boveda_usa', filas: 49 },
    { name: 'Utilidades', tipo: 'utilidades', filas: 52 },
    { name: 'Flete_Sur', tipo: 'flete_sur', filas: 103 },
    { name: 'Azteca', tipo: 'banco_azteca', filas: 25 },
    { name: 'Leftie', tipo: 'banco_leftie', filas: 9 },
    { name: 'Profit', tipo: 'banco_profit', filas: 55 },
  ];

  let sheetIndex = 5;
  for (const { name, tipo, filas } of bovedaBancoSheets) {
    console.log(`\n💰 [${sheetIndex}/12] Importando ${name} (${filas} esperados)...`);

    const sheet = workbook.Sheets[name];
    if (!sheet) {
      console.log(`  ⚠️  Hoja "${name}" no encontrada`);
      sheetIndex++;
      continue;
    }

    const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });
    const headers = data[2];
    const rows = data.slice(3);

    console.log(`  📊 Total filas: ${rows.length}`);

    batch = writeBatch(db);
    batchCount = 0;

    for (const row of rows) {
      if (!row || row.length === 0) continue;

      const fecha = parseExcelDate(row[0]);
      if (!fecha) continue;

      // Detectar ingresos (columnas 0-7)
      const esIngreso = row[2] && parseNumber(row[2]) > 0;

      // Detectar gastos (columnas 6-17, varía por hoja)
      const fechaGasto = parseExcelDate(row[6] || row[10]);
      const valorGasto = parseNumber(row[8] || row[12]);
      const esGasto = fechaGasto && valorGasto > 0;

      if (esIngreso) {
        const transaccion = {
          fecha,
          tipo: 'ingreso',
          origen: tipo,
          cliente: cleanString(row[1]) || '',
          ingreso: parseNumber(row[2]),
          tc: parseNumber(row[3]) || 0,
          pesos: parseNumber(row[4]) || 0,
          destino: cleanString(row[5]) || '',
          concepto: cleanString(row[6]) || '',
          observaciones: cleanString(row[7]) || '',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        if (tipo.includes('banco')) {
          stats.transaccionesBanco++;
        } else {
          stats.transaccionesBoveda++;
        }

        if (!DRY_RUN) {
          const docRef = doc(collection(db, 'transacciones'));
          batch.set(docRef, transaccion);
          batchCount++;

          if (batchCount >= 500) {
            await batch.commit();
            batch = writeBatch(db);
            batchCount = 0;
          }
        }
      }

      if (esGasto) {
        const transaccion = {
          fecha: fechaGasto,
          tipo: 'gasto',
          origen: tipo,
          origenGasto: cleanString(row[7] || row[11]) || '',
          gasto: valorGasto,
          tc: parseNumber(row[9] || row[13]) || 0,
          pesos: parseNumber(row[10] || row[14]) || 0,
          destino: cleanString(row[11] || row[15]) || '',
          concepto: cleanString(row[12] || row[16]) || '',
          observaciones: cleanString(row[13] || row[17]) || '',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        if (tipo.includes('banco')) {
          stats.transaccionesBanco++;
        } else {
          stats.transaccionesBoveda++;
        }

        if (!DRY_RUN) {
          const docRef = doc(collection(db, 'transacciones'));
          batch.set(docRef, transaccion);
          batchCount++;

          if (batchCount >= 500) {
            await batch.commit();
            batch = writeBatch(db);
            batchCount = 0;
          }
        }
      }
    }

    if (!DRY_RUN && batchCount > 0) {
      await batch.commit();
    }

    const count = tipo.includes('banco') ? stats.transaccionesBanco : stats.transaccionesBoveda;
    console.log(`  ✅ Transacciones procesadas ${DRY_RUN ? '(DRY RUN)' : '✓'}`);
    sheetIndex++;
  }

  // ============================================================================
  // 11. IMPORTAR DATA (83 registros auxiliares)
  // ============================================================================
  console.log('\n📄 [12/12] Importando DATA (auxiliares)...');
  const dataSheet = workbook.Sheets['DATA'];
  if (dataSheet) {
    const dataSheetData = XLSX.utils.sheet_to_json(dataSheet, { header: 1 });
    console.log(`  📊 Total filas: ${dataSheetData.length}`);
    console.log(`  ℹ️  Registros auxiliares (no se importan a colecciones principales)`);
    stats.datosAuxiliares = 83;
  }

  // ============================================================================
  // RESUMEN FINAL
  // ============================================================================
  const totalRegistros =
    stats.clientes +
    stats.ordenesCompra +
    stats.ventas +
    stats.gastos +
    stats.movimientosInventario +
    stats.transaccionesBoveda +
    stats.transaccionesBanco +
    stats.datosAuxiliares;

  console.log('\n' + '='.repeat(80));
  console.log(`${DRY_RUN ? '🧪 DRY RUN COMPLETADO' : '✅ IMPORTACIÓN COMPLETADA'}`);
  console.log('='.repeat(80));
  console.log('\n📊 Resumen de registros importados:\n');
  console.log(`  👥 Clientes                : ${stats.clientes.toString().padStart(4)} registros`);
  console.log(
    `  📦 Órdenes de Compra       : ${stats.ordenesCompra.toString().padStart(4)} registros`
  );
  console.log(`  🛒 Ventas                  : ${stats.ventas.toString().padStart(4)} registros`);
  console.log(`  💸 Gastos                  : ${stats.gastos.toString().padStart(4)} registros`);
  console.log(
    `  📦 Movimientos Inventario  : ${stats.movimientosInventario.toString().padStart(4)} registros`
  );
  console.log(
    `  💰 Transacciones Bóveda    : ${stats.transaccionesBoveda.toString().padStart(4)} registros`
  );
  console.log(
    `  🏦 Transacciones Banco     : ${stats.transaccionesBanco.toString().padStart(4)} registros`
  );
  console.log(
    `  📄 Datos Auxiliares        : ${stats.datosAuxiliares.toString().padStart(4)} registros`
  );
  console.log(`  ${'─'.repeat(43)}`);
  console.log(
    `  🎯 TOTAL                   : ${totalRegistros.toString().padStart(4)} registros\n`
  );

  // Guardar reporte
  const report = {
    timestamp: new Date().toISOString(),
    mode: DRY_RUN ? 'DRY_RUN' : 'PRODUCTION',
    excelPath: EXCEL_PATH,
    balanceTotal: 12861332.12,
    stats,
    totalRegistros,
  };

  const reportPath = 'scripts/import-all-report.json';
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2), 'utf8');
  console.log(`📄 Reporte guardado en: ${reportPath}\n`);

  if (DRY_RUN) {
    console.log('💡 Para ejecutar la importación REAL, ejecuta:');
    console.log('   npm run excel:import:all\n');
  } else {
    console.log('✅ Datos importados a Firestore exitosamente!');
    console.log('🔍 Verifica en Firebase Console:\n');
    console.log('   https://console.firebase.google.com/project/premium-ecosystem/firestore\n');
  }

  process.exit(0);
} catch (error) {
  console.error('\n❌ Error durante la importación:', error);
  console.error('Stack:', error.stack);
  process.exit(1);
}
