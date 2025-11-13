/**
 * ============================================================================
 * IMPORTADOR EXCEL → PANELES FLOWDISTRIBUTOR
 * ============================================================================
 *
 * MAPEO CORRECTO:
 * ---------------
 * 1️⃣  Hoja "Distribuidores"     → Panel DISTRIBUIDORES + ÓRDENES DE COMPRA
 * 2️⃣  Hoja "Control_Maestro"    → 3 PANELES:
 *     - Cols 0-11 (Venta Local) → Panel VENTAS
 *     - Col 13 (RF Actual)      → Panel DASHBOARD (capitales)
 *     - Cols 14-21 (GYA)        → Panel GASTOS Y ABONOS
 * 3️⃣  Hoja "Almacen_Monte"      → Panel ALMACÉN
 * 4️⃣  Hoja "Bóveda_Monte"       → Panel BÓVEDA MONTE
 * 5️⃣  Hoja "Bóveda_USA"         → Panel BÓVEDA USA
 * 6️⃣  Hoja "Utilidades"         → Panel UTILIDADES
 * 7️⃣  Hoja "Flete_Sur"          → Panel FLETE SUR
 * 8️⃣  Hoja "Azteca"             → Panel BANCO AZTECA
 * 9️⃣  Hoja "Leftie"             → Panel BANCO LEFTIE
 * 🔟 Hoja "Profit"             → Panel BANCO PROFIT
 * 1️⃣1️⃣ Hoja "Clientes"          → Panel CLIENTES
 * 1️⃣2️⃣ Hoja "DATA"              → Datos auxiliares (dropdowns/referencia)
 *
 * Balance Total: $12,861,332.12 USD
 * ============================================================================
 */
import { initializeApp } from 'firebase/app';
import { collection, doc, getFirestore, writeBatch } from 'firebase/firestore';
import fs from 'node:fs';
import XLSX from 'xlsx';

// Firebase config
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY || 'AIzaSyDo7cXp9-iODHW5cxlM9UL32qz2z_L8krc',
  authDomain:
    process.env.VITE_FIREBASE_AUTH_DOMAIN || 'premium-ecosystem-1760790572.firebaseapp.com',
  projectId: process.env.VITE_FIREBASE_PROJECT_ID || 'premium-ecosystem-1760790572',
  storageBucket:
    process.env.VITE_FIREBASE_STORAGE_BUCKET || 'premium-ecosystem-1760790572.appspot.com',
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '123456789012',
  appId: process.env.VITE_FIREBASE_APP_ID || '1:123456789012:web:abcdef123456',
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const EXCEL_PATH = 'C:\\Users\\xpovo\\Downloads\\Copia de Administación_General.xlsx';
const DRY_RUN = process.argv.includes('--dry-run');

// ============================================================================
// UTILIDADES
// ============================================================================
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

// ============================================================================
// ESTADÍSTICAS POR PANEL
// ============================================================================
const stats = {
  // Panel Clientes
  clientes: 0,

  // Panel Distribuidores + Órdenes de Compra
  distribuidores: 0,
  ordenesCompra: 0,

  // Panel Ventas (Control_Maestro cols 0-11)
  ventas: 0,

  // Panel Dashboard (Control_Maestro col 13 - RF Actual)
  capitalesBancos: 0,

  // Panel Gastos y Abonos (Control_Maestro cols 14-21 - GYA)
  gastosAbonos: 0,

  // Panel Almacén
  inventario: 0,

  // Paneles Bóvedas (Monte, USA, Utilidades, Flete Sur)
  bovedaMonte: 0,
  bovedaUSA: 0,
  utilidades: 0,
  fleteSur: 0,

  // Paneles Bancos (Azteca, Leftie, Profit)
  bancoAzteca: 0,
  bancoLeftie: 0,
  bancoProfit: 0,

  // Auxiliares
  datosAuxiliares: 0,
};

console.log('\n' + '═'.repeat(80));
console.log('📊 IMPORTACIÓN EXCEL → PANELES FLOWDISTRIBUTOR');
console.log('═'.repeat(80));
console.log(`⚙️  Modo: ${DRY_RUN ? '🧪 DRY RUN (prueba)' : '🔥 PRODUCCIÓN (escribe a Firestore)'}`);
console.log(`💰 Balance Total: $12,861,332.12 USD`);
console.log('═'.repeat(80) + '\n');

try {
  const workbook = XLSX.readFile(EXCEL_PATH);

  // ============================================================================
  // 1️⃣ PANEL CLIENTES
  // ============================================================================
  console.log('\n👥 [1/12] Panel CLIENTES');
  console.log('─'.repeat(80));

  const clientesSheet = workbook.Sheets['Clientes'];
  const clientesData = XLSX.utils.sheet_to_json(clientesSheet, { header: 1 });
  const clientesRows = clientesData.slice(3); // Saltar: fila 0=section, 1=vacía, 2=headers

  let batch = writeBatch(db);
  let batchCount = 0;
  const clientesMap = new Map();

  for (const row of clientesRows) {
    if (!row || row.length === 0) continue;
    const nombre = cleanString(row[0]);
    if (!nombre || nombre === 'Cliente' || clientesMap.has(nombre)) continue;

    const cliente = {
      nombre,
      creditoAutorizado: parseNumber(row[1]), // "Actual"
      deuda: parseNumber(row[2]),
      abonos: parseNumber(row[3]),
      pendiente: parseNumber(row[4]),
      observaciones: cleanString(row[5]) || '',
      panel: 'clientes',
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

  console.log(`  ✅ ${stats.clientes} clientes importados ${DRY_RUN ? '(DRY RUN)' : ''}`);

  // ============================================================================
  // 2️⃣ PANEL DISTRIBUIDORES + ÓRDENES DE COMPRA
  // ============================================================================
  console.log('\n🏭 [2/12] Panel DISTRIBUIDORES + ÓRDENES DE COMPRA');
  console.log('─'.repeat(80));

  const distribuidoresSheet = workbook.Sheets['Distribuidores'];
  const distribuidoresData = XLSX.utils.sheet_to_json(distribuidoresSheet, { header: 1 });
  const distribuidoresRows = distribuidoresData.slice(3); // Saltar: fila 0=section, 1=vacía, 2=headers

  batch = writeBatch(db);
  batchCount = 0;
  const distribuidoresMap = new Map();
  const ocMap = new Map();

  // Buscar índice de columna "Distribuidores"
  const headers = distribuidoresData[2];
  let distribuidorColIndex = -1;
  for (let i = 0; i < headers.length; i++) {
    if (headers[i] === 'Distribuidores') {
      distribuidorColIndex = i;
      break;
    }
  }

  for (const row of distribuidoresRows) {
    if (!row || row.length === 0) continue;

    // ÓRDENES DE COMPRA (columnas 0-11)
    const codigoOC = cleanString(row[0]);
    if (codigoOC && codigoOC !== 'OC' && !ocMap.has(codigoOC)) {
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
        distribuidor: cleanString(row[distribuidorColIndex]) || '',
        panel: 'ordenesCompra',
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

    // DISTRIBUIDORES (columnas 12-15)
    if (distribuidorColIndex >= 0) {
      const nombreDist = cleanString(row[distribuidorColIndex]);
      if (nombreDist && !distribuidoresMap.has(nombreDist)) {
        const distribuidor = {
          nombre: nombreDist,
          costoTotal: parseNumber(row[distribuidorColIndex + 1]), // "Costo total"
          abonos: parseNumber(row[distribuidorColIndex + 2]), // "Abonos"
          pendiente: parseNumber(row[distribuidorColIndex + 3]), // "Pendiente"
          panel: 'distribuidores',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        distribuidoresMap.set(nombreDist, distribuidor);
        stats.distribuidores++;

        if (!DRY_RUN) {
          const docRef = doc(collection(db, 'distribuidores'));
          batch.set(docRef, distribuidor);
          batchCount++;

          if (batchCount >= 500) {
            await batch.commit();
            batch = writeBatch(db);
            batchCount = 0;
          }
        }
      }
    }
  }

  if (!DRY_RUN && batchCount > 0) {
    await batch.commit();
  }

  console.log(`  ✅ ${stats.distribuidores} distribuidores importados`);
  console.log(`  ✅ ${stats.ordenesCompra} órdenes de compra importadas`);

  // ============================================================================
  // 3️⃣ CONTROL_MAESTRO → 3 PANELES DIFERENTES
  // ============================================================================
  console.log('\n📋 [3/12] CONTROL_MAESTRO → 3 Paneles');
  console.log('─'.repeat(80));

  const controlSheet = workbook.Sheets['Control_Maestro'];
  const controlData = XLSX.utils.sheet_to_json(controlSheet, { header: 1 });
  const controlHeaders = controlData[2];
  const controlRows = controlData.slice(3);

  batch = writeBatch(db);
  batchCount = 0;

  // Obtener RF Actual (Balance Total) de la fila 1, columna 12
  const rfActualTotal = parseNumber(controlData[1][12]); // $12,861,332.12
  console.log(`  💰 Balance Total (RF Actual): $${rfActualTotal.toLocaleString('en-US')} USD`);

  for (const row of controlRows) {
    if (!row || row.length === 0) continue;
    const fecha = parseExcelDate(row[0]);
    if (!fecha) continue;

    // ═══════════════════════════════════════════════════════════════════════
    // 🛒 PANEL VENTAS (Venta Local - columnas 0-11)
    // ═══════════════════════════════════════════════════════════════════════
    const cliente = cleanString(row[3]);
    const ingreso = parseNumber(row[6]);

    if (cliente && ingreso > 0) {
      const venta = {
        fecha,
        ocRelacionada: cleanString(row[1]) || '',
        cantidad: parseNumber(row[2]),
        cliente,
        bovedaMonte: parseNumber(row[4]),
        precioVenta: parseNumber(row[5]),
        ingreso,
        flete: cleanString(row[7]) || '',
        fleteUtilidad: parseNumber(row[8]),
        utilidad: parseNumber(row[9]),
        estatus: cleanString(row[10]) || 'Pendiente',
        concepto: cleanString(row[11]) || '',
        panelOrigen: cleanString(row[12]) || 'ventas', // Panel origen en col 12
        rfActual: parseNumber(row[13]), // RF Actual individual
        panel: 'ventas',
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

    // ═══════════════════════════════════════════════════════════════════════
    // 💸 PANEL GASTOS Y ABONOS (GYA - columnas 14-21)
    // ═══════════════════════════════════════════════════════════════════════
    const fechaGasto = parseExcelDate(row[14]);
    const origen = cleanString(row[15]);
    const valor = parseNumber(row[16]);

    if (fechaGasto && origen && valor > 0) {
      const gastoAbono = {
        fecha: fechaGasto,
        origen,
        valor,
        tc: parseNumber(row[17]), // Tipo de cambio
        pesos: parseNumber(row[18]),
        destino: cleanString(row[19]) || '',
        concepto: cleanString(row[20]) || '',
        observaciones: cleanString(row[21]) || '',
        panel: 'gastosAbonos',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      stats.gastosAbonos++;

      if (!DRY_RUN) {
        const docRef = doc(collection(db, 'gastosAbonos'));
        batch.set(docRef, gastoAbono);
        batchCount++;

        if (batchCount >= 500) {
          await batch.commit();
          batch = writeBatch(db);
          batchCount = 0;
        }
      }
    }
  }

  // ═══════════════════════════════════════════════════════════════════════
  // 📊 PANEL DASHBOARD (RF Actual - capitales)
  // ═══════════════════════════════════════════════════════════════════════
  // Guardar balance total como documento único para Dashboard
  if (!DRY_RUN) {
    const capitalDoc = doc(collection(db, 'capitales'), 'balance-total');
    batch.set(capitalDoc, {
      balanceTotal: rfActualTotal,
      rfActualTotal,
      fecha: new Date().toISOString().split('T')[0],
      panel: 'dashboard',
      descripcion: 'Balance Total Consolidado',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    batchCount++;
  }
  stats.capitalesBancos = 1;

  if (!DRY_RUN && batchCount > 0) {
    await batch.commit();
  }

  console.log(`  🛒 ${stats.ventas} ventas importadas (Panel Ventas)`);
  console.log(`  💸 ${stats.gastosAbonos} gastos/abonos importados (Panel Gastos y Abonos)`);
  console.log(`  📊 ${stats.capitalesBancos} capital total importado (Panel Dashboard)`);

  // ============================================================================
  // 4️⃣ PANEL ALMACÉN (Almacen_Monte)
  // ============================================================================
  console.log('\n📦 [4/12] Panel ALMACÉN');
  console.log('─'.repeat(80));

  const almacenSheet = workbook.Sheets['Almacen_Monte'];
  const almacenData = XLSX.utils.sheet_to_json(almacenSheet, { header: 1 });
  const almacenRows = almacenData.slice(3);

  batch = writeBatch(db);
  batchCount = 0;

  for (const row of almacenRows) {
    if (!row || row.length === 0 || !row[0]) continue;

    const movimiento = {
      oc: cleanString(row[0]) || '',
      fechaIngreso: parseExcelDate(row[1] || row[4]),
      distribuidor: cleanString(row[2]) || '',
      cantidadIngreso: parseNumber(row[3]),
      corte: parseNumber(row[5]),
      fechaSalida: parseExcelDate(row[6]),
      clienteSalida: cleanString(row[7]) || '',
      cantidadSalida: parseNumber(row[8]),
      concepto: cleanString(row[9]) || '',
      observaciones: cleanString(row[10]) || '',
      panel: 'almacen',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    stats.inventario++;

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

  console.log(`  ✅ ${stats.inventario} movimientos importados`);

  // ============================================================================
  // 5️⃣-1️⃣1️⃣ PANELES BÓVEDAS Y BANCOS (con nombre de panel)
  // ============================================================================
  const panelSheets = [
    {
      hoja: 'Bóveda_Monte',
      panel: 'bovedaMonte',
      nombre: '💰 BÓVEDA MONTE',
      stat: 'bovedaMonte',
      coleccion: 'transaccionesBoveda',
    },
    {
      hoja: 'Bóveda_USA',
      panel: 'bovedaUSA',
      nombre: '💰 BÓVEDA USA',
      stat: 'bovedaUSA',
      coleccion: 'transaccionesBoveda',
    },
    {
      hoja: 'Utilidades',
      panel: 'utilidades',
      nombre: '💰 UTILIDADES',
      stat: 'utilidades',
      coleccion: 'transaccionesBoveda',
    },
    {
      hoja: 'Flete_Sur',
      panel: 'fleteSur',
      nombre: '🚚 FLETE SUR',
      stat: 'fleteSur',
      coleccion: 'transaccionesBoveda',
    },
    {
      hoja: 'Azteca',
      panel: 'bancoAzteca',
      nombre: '🏦 BANCO AZTECA',
      stat: 'bancoAzteca',
      coleccion: 'transaccionesBanco',
    },
    {
      hoja: 'Leftie',
      panel: 'bancoLeftie',
      nombre: '🏦 BANCO LEFTIE',
      stat: 'bancoLeftie',
      coleccion: 'transaccionesBanco',
    },
    {
      hoja: 'Profit',
      panel: 'bancoProfit',
      nombre: '🏦 BANCO PROFIT',
      stat: 'bancoProfit',
      coleccion: 'transaccionesBanco',
    },
  ];

  let panelIndex = 5;
  for (const { hoja, panel, nombre, stat, coleccion } of panelSheets) {
    console.log(`\n${nombre} [${panelIndex}/11]`);
    console.log('─'.repeat(80));

    const sheet = workbook.Sheets[hoja];
    if (!sheet) {
      console.log(`  ⚠️  Hoja "${hoja}" no encontrada`);
      panelIndex++;
      continue;
    }

    const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });
    const rows = data.slice(3);

    batch = writeBatch(db);
    batchCount = 0;
    let countPanel = 0;

    for (const row of rows) {
      if (!row || row.length === 0) continue;

      const fecha = parseExcelDate(row[0]);
      if (!fecha) continue;

      // Detectar si es ingreso o gasto según estructura de cada hoja
      const ingreso = parseNumber(row[2]);
      const fechaGasto = parseExcelDate(row[6] || row[10]);
      const gasto = parseNumber(row[8] || row[11] || row[12]);

      if (ingreso > 0) {
        // INGRESO
        const transaccion = {
          fecha,
          tipo: 'ingreso',
          panel,
          cliente: cleanString(row[1]) || '',
          monto: ingreso,
          tc: parseNumber(row[3]) || 0,
          pesos: parseNumber(row[4]) || 0,
          destino: cleanString(row[5]) || '',
          concepto: cleanString(row[6]) || '',
          observaciones: cleanString(row[7]) || '',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        countPanel++;

        if (!DRY_RUN) {
          const docRef = doc(collection(db, coleccion));
          batch.set(docRef, transaccion);
          batchCount++;

          if (batchCount >= 500) {
            await batch.commit();
            batch = writeBatch(db);
            batchCount = 0;
          }
        }
      }

      if (fechaGasto && gasto > 0) {
        // GASTO
        const transaccion = {
          fecha: fechaGasto,
          tipo: 'gasto',
          panel,
          origen: cleanString(row[7] || row[11]) || '',
          monto: gasto,
          tc: parseNumber(row[9] || row[13]) || 0,
          pesos: parseNumber(row[10] || row[14]) || 0,
          destino: cleanString(row[11] || row[15]) || '',
          concepto: cleanString(row[12] || row[16]) || '',
          observaciones: cleanString(row[13] || row[17]) || '',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        countPanel++;

        if (!DRY_RUN) {
          const docRef = doc(collection(db, coleccion));
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

    stats[stat] = countPanel;
    console.log(`  ✅ ${countPanel} transacciones importadas`);
    panelIndex++;
  }

  // ============================================================================
  // 1️⃣2️⃣ DATA (Auxiliares - no se importa)
  // ============================================================================
  console.log('\n📄 [12/12] DATA (auxiliares)');
  console.log('─'.repeat(80));
  console.log('  ℹ️  Datos auxiliares (listas dropdown) - no se importan a colecciones');
  stats.datosAuxiliares = 83;

  // ============================================================================
  // RESUMEN FINAL
  // ============================================================================
  const totalRegistros =
    stats.clientes +
    stats.distribuidores +
    stats.ordenesCompra +
    stats.ventas +
    stats.gastosAbonos +
    stats.capitalesBancos +
    stats.inventario +
    stats.bovedaMonte +
    stats.bovedaUSA +
    stats.utilidades +
    stats.fleteSur +
    stats.bancoAzteca +
    stats.bancoLeftie +
    stats.bancoProfit +
    stats.datosAuxiliares;

  console.log('\n' + '═'.repeat(80));
  console.log(`${DRY_RUN ? '🧪 DRY RUN COMPLETADO' : '✅ IMPORTACIÓN COMPLETADA'}`);
  console.log('═'.repeat(80));
  console.log('\n📊 RESUMEN POR PANEL:\n');

  console.log('  👥 Panel CLIENTES:');
  console.log(`     └─ Clientes: ${stats.clientes}`);

  console.log('\n  🏭 Panel DISTRIBUIDORES:');
  console.log(`     ├─ Distribuidores: ${stats.distribuidores}`);
  console.log(`     └─ Órdenes de Compra: ${stats.ordenesCompra}`);

  console.log('\n  🛒 Panel VENTAS:');
  console.log(`     └─ Ventas: ${stats.ventas}`);

  console.log('\n  💸 Panel GASTOS Y ABONOS:');
  console.log(`     └─ Gastos/Abonos: ${stats.gastosAbonos}`);

  console.log('\n  📊 Panel DASHBOARD:');
  console.log(`     └─ Balance Total: $${rfActualTotal.toLocaleString('en-US')} USD`);

  console.log('\n  📦 Panel ALMACÉN:');
  console.log(`     └─ Movimientos: ${stats.inventario}`);

  console.log('\n  💰 Paneles BÓVEDAS:');
  console.log(`     ├─ Bóveda Monte: ${stats.bovedaMonte}`);
  console.log(`     ├─ Bóveda USA: ${stats.bovedaUSA}`);
  console.log(`     ├─ Utilidades: ${stats.utilidades}`);
  console.log(`     └─ Flete Sur: ${stats.fleteSur}`);

  console.log('\n  🏦 Paneles BANCOS:');
  console.log(`     ├─ Azteca: ${stats.bancoAzteca}`);
  console.log(`     ├─ Leftie: ${stats.bancoLeftie}`);
  console.log(`     └─ Profit: ${stats.bancoProfit}`);

  console.log('\n  📄 Datos Auxiliares: ' + stats.datosAuxiliares);

  console.log(`\n  ${'─'.repeat(76)}`);
  console.log(`  🎯 TOTAL: ${totalRegistros} registros\n`);

  // Guardar reporte
  const report = {
    timestamp: new Date().toISOString(),
    mode: DRY_RUN ? 'DRY_RUN' : 'PRODUCTION',
    excelPath: EXCEL_PATH,
    balanceTotal: rfActualTotal,
    stats,
    totalRegistros,
  };

  const reportPath = 'scripts/import-panels-report.json';
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2), 'utf8');
  console.log(`📄 Reporte guardado en: ${reportPath}\n`);

  if (DRY_RUN) {
    console.log('💡 Para ejecutar la importación REAL, ejecuta:');
    console.log('   npm run excel:import:panels\n');
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
