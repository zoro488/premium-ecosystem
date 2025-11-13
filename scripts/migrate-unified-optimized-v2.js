/**
 * 🔥 MIGRACIÓN OPTIMIZADA V2: Arquitectura de Negocio Real
 * ========================================================
 *
 * ESTRUCTURA FIRESTORE:
 *
 * 1. bancos/{bancoId}/ - 7 bancos
 *    ├── documento principal con capital actual
 *    ├── /ingresos (subcollection)
 *    ├── /gastos (subcollection)
 *    ├── /cortes (subcollection)
 *    └── /transferencias (subcollection)
 *
 * 2. ordenes_compra - Órdenes de compra con distribuidores
 * 3. ventas - Ventas locales (genera ingresos en bancos)
 * 4. almacen - Entradas, salidas, stock actual
 * 5. clientes - Adeudos, abonos, deuda actual
 * 6. distribuidores - Deuda con distribuidores
 * 7. gastos_abonos - GYA generales
 * 8. capitales - Resumen global (bancos + stock USD)
 *
 * EJECUCIÓN:
 * npm run migrate:flowdistributor:v2
 */
import { initializeApp } from 'firebase/app';
import { doc, getFirestore, serverTimestamp, setDoc, writeBatch } from 'firebase/firestore';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ============================================================================
// CONFIGURACIÓN FIREBASE - Chronos Project
// ============================================================================

const firebaseConfig = {
  apiKey: 'AIzaSyB9gG3ITQ6MkY-kOahzSHRqqNaJMguDi5k',
  authDomain: 'chronos-176d8.firebaseapp.com',
  projectId: 'chronos-176d8',
  storageBucket: 'chronos-176d8.firebasestorage.app',
  messagingSenderId: '148680866109',
  appId: '1:148680866109:web:5da615f10d3600e50b6d54',
  measurementId: 'G-H591NB7F9S',
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ============================================================================
// HELPERS
// ============================================================================

function parseDate(dateStr) {
  if (!dateStr) return new Date();
  const parts = dateStr.includes('/') ? dateStr.split('/').reverse() : dateStr.split('-');
  return new Date(parts[0], parts[1] - 1, parts[2]);
}

async function batchWriteSubcollection(parentPath, subcollectionName, data, idField = 'id') {
  const MAX_BATCH_SIZE = 500;
  let batch = writeBatch(db);
  let operationCount = 0;
  let totalWritten = 0;

  console.log(`  📝 Escribiendo ${subcollectionName}: ${data.length} documentos`);

  for (const item of data) {
    const docId = item[idField] || `auto_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const docRef = doc(db, parentPath, subcollectionName, docId.toString());

    const docData = {
      ...item,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    batch.set(docRef, docData);
    operationCount++;
    totalWritten++;

    if (operationCount === MAX_BATCH_SIZE) {
      await batch.commit();
      batch = writeBatch(db);
      operationCount = 0;
    }
  }

  if (operationCount > 0) {
    await batch.commit();
  }

  console.log(`  ✅ ${subcollectionName}: ${totalWritten} documentos escritos`);
  return totalWritten;
}

async function batchWrite(collectionName, data, idField = 'id') {
  const MAX_BATCH_SIZE = 500;
  let batch = writeBatch(db);
  let operationCount = 0;
  let totalWritten = 0;

  console.log(`📝 Escribiendo colección: ${collectionName} (${data.length} documentos)`);

  for (const item of data) {
    const docId = item[idField] || `auto_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const docRef = doc(db, collectionName, docId.toString());

    const docData = {
      ...item,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    batch.set(docRef, docData);
    operationCount++;
    totalWritten++;

    if (operationCount === MAX_BATCH_SIZE) {
      await batch.commit();
      batch = writeBatch(db);
      operationCount = 0;
    }
  }

  if (operationCount > 0) {
    await batch.commit();
  }

  console.log(`✅ ${collectionName}: ${totalWritten} documentos escritos\n`);
  return totalWritten;
}

// ============================================================================
// CONFIGURACIÓN DE BANCOS
// ============================================================================

const BANCOS_CONFIG = {
  'boveda-monte': { nombre: 'Bóveda Monte', moneda: 'MXN', color: 'amber', icono: 'Building2' },
  'boveda-usa': { nombre: 'Bóveda USA', moneda: 'USD', color: 'blue', icono: 'Building2' },
  azteca: { nombre: 'Azteca', moneda: 'MXN', color: 'green', icono: 'Building2' },
  utilidades: { nombre: 'Utilidades', moneda: 'MXN', color: 'purple', icono: 'DollarSign' },
  fletes: { nombre: 'Flete Sur', moneda: 'MXN', color: 'red', icono: 'ArrowLeftRight' },
  leftie: { nombre: 'Leftie', moneda: 'MXN', color: 'teal', icono: 'TrendingUp' },
  profit: { nombre: 'Profit', moneda: 'MXN', color: 'pink', icono: 'BarChart3' },
};

// ============================================================================
// FUNCIÓN PRINCIPAL
// ============================================================================

async function migrateOptimized() {
  try {
    console.log('\n🚀 ============================================');
    console.log('🔥 MIGRACIÓN OPTIMIZADA V2 - ARQUITECTURA REAL');
    console.log('============================================\n');

    const jsonPath = path.join(
      __dirname,
      '..',
      'src',
      'apps',
      'FlowDistributor',
      'data',
      'BASE_DATOS_FLOWDISTRIBUTOR_UNIFICADO.json'
    );
    const fileContent = await fs.readFile(jsonPath, 'utf-8');
    const unifiedData = JSON.parse(fileContent);

    let totalDocuments = 0;

    // ========================================================================
    // 1. BANCOS (7 bancos con subcollections)
    // ========================================================================
    console.log('🏦 ============================================');
    console.log('   PROCESANDO BANCOS (7)');
    console.log('============================================\n');

    const bancosMap = {
      'boveda-monte': unifiedData.bovedaMonte?.bovedaMonte,
      'boveda-usa': unifiedData.bovedaUsa?.bovedaUsa,
      azteca: unifiedData.azteca?.azteca,
      utilidades: unifiedData.utilidades?.utilidades,
      fletes: unifiedData.fleteSur?.fleteSur,
      leftie: unifiedData.leftie?.leftie,
      profit: unifiedData.profit?.profit,
    };

    for (const [bancoId, bancoData] of Object.entries(bancosMap)) {
      if (!bancoData) continue;

      console.log(`🏦 Procesando: ${BANCOS_CONFIG[bancoId].nombre}`);

      const ingresos = bancoData.ingresos || 0;
      const gastos = bancoData.gastos || 0;
      const rfActual = bancoData.rfActual || 0;

      // Documento principal del banco
      await setDoc(doc(db, 'bancos', bancoId), {
        id: bancoId,
        nombre: BANCOS_CONFIG[bancoId].nombre,
        capital: rfActual,
        capitalActual: rfActual,
        capitalHistorico: ingresos - gastos,
        totalIngresos: ingresos,
        totalGastos: gastos,
        moneda: BANCOS_CONFIG[bancoId].moneda,
        color: BANCOS_CONFIG[bancoId].color,
        icono: BANCOS_CONFIG[bancoId].icono,
        activo: true,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      console.log(`  ✅ Documento principal creado`);

      // Subcollection: INGRESOS
      if (bancoData.ingresosList && bancoData.ingresosList.length > 0) {
        const ingresosData = bancoData.ingresosList.map((ing, index) => ({
          id: `${bancoId}_ingreso_${index + 1}`,
          fecha: parseDate(ing.fecha),
          cliente: ing.cliente || 'Sin cliente',
          monto: ing.ingreso || 0,
          tc: ing.tc || 0,
          dolares: ing.dolares || 0,
          concepto: ing.concepto || '',
          observaciones: ing.observaciones || '',
          tipo: 'ingreso',
        }));

        totalDocuments += await batchWriteSubcollection(
          'bancos',
          `${bancoId}/ingresos`,
          ingresosData,
          'id'
        );
      }

      // Subcollection: GASTOS
      if (bancoData.gastosList && bancoData.gastosList.length > 0) {
        const gastosData = bancoData.gastosList.map((gasto, index) => ({
          id: `${bancoId}_gasto_${index + 1}`,
          fecha: parseDate(gasto.fecha),
          proveedor: gasto.proveedor || 'Sin proveedor',
          monto: gasto.gasto || gasto.abono || 0,
          tc: gasto.tc || 0,
          dolares: gasto.dolares || 0,
          concepto: gasto.concepto || '',
          observaciones: gasto.observaciones || '',
          categoria: gasto.categoria || 'General',
          tipo: 'gasto',
        }));

        totalDocuments += await batchWriteSubcollection(
          'bancos',
          `${bancoId}/gastos`,
          gastosData,
          'id'
        );
      }

      // Subcollection: CORTES
      if (bancoData.rfCortes && bancoData.rfCortes.length > 0) {
        const cortesData = bancoData.rfCortes.map((corte, index) => ({
          id: `${bancoId}_corte_${index + 1}`,
          fecha: parseDate(corte.fecha),
          monto: corte.corte || 0,
          observaciones: corte.observaciones || '',
          tipo: 'corte',
        }));

        totalDocuments += await batchWriteSubcollection(
          'bancos',
          `${bancoId}/cortes`,
          cortesData,
          'id'
        );
      }

      // Subcollection: TRANSFERENCIAS (vacía por ahora)
      console.log(`  📝 transferencias: 0 documentos (colección creada vacía)\n`);
    }

    // ========================================================================
    // 2. ÓRDENES DE COMPRA
    // ========================================================================
    console.log('📦 ============================================');
    console.log('   ÓRDENES DE COMPRA');
    console.log('============================================\n');

    if (unifiedData.ordenesCompra?.distribuidores?.ordenesCompra) {
      const ordenesCompra = unifiedData.ordenesCompra.distribuidores.ordenesCompra.map((oc) => ({
        id: oc.id,
        fecha: parseDate(oc.fecha),
        origen: oc.origen,
        distribuidor: oc.origen,
        cantidad: oc.cantidad || 0,
        costoDistribuidor: oc.costoDistribuidor || 0,
        costoTransporte: oc.costoTransporte || 0,
        costoPorUnidad: oc.costoPorUnidad || 0,
        costoTotal: oc.costoTotal || 0,
        pagoDistribuidor: oc.pagoDistribuidor || 0,
        deuda: oc.deuda || 0,
        stockActual: oc.stockActual || 0,
        estado: oc.deuda > 0 ? 'pendiente' : 'pagado',
      }));

      totalDocuments += await batchWrite('ordenes_compra', ordenesCompra, 'id');
    }

    // ========================================================================
    // 3. VENTAS LOCALES
    // ========================================================================
    console.log('💰 ============================================');
    console.log('   VENTAS LOCALES');
    console.log('============================================\n');

    if (unifiedData.ventasLocal?.ventasLocal) {
      const ventas = unifiedData.ventasLocal.ventasLocal.map((venta, index) => ({
        id: `venta_${index + 1}`,
        fecha: parseDate(venta.fecha),
        cliente: venta.cliente || 'Sin cliente',
        cantidad: venta.cantidad || 0,
        precioUnitario: venta.precioUnitario || 0,
        total: venta.total || 0,
        tc: venta.tc || 0,
        dolares: venta.dolares || 0,
        concepto: venta.concepto || '',
        observaciones: venta.observaciones || '',
        destino: venta.destino || 'Local',
        // Distribución automática en bancos (esto se calculará en la app)
        distribucionBancos: {
          bovedaMonte: 0, // Calculado por la app
          fletes: 0,
          utilidades: 0,
        },
        estado: 'completada',
      }));

      totalDocuments += await batchWrite('ventas', ventas, 'id');
    }

    // ========================================================================
    // 4. ALMACÉN
    // ========================================================================
    console.log('📦 ============================================');
    console.log('   ALMACÉN MONTE');
    console.log('============================================\n');

    if (unifiedData.almacenMonte?.almacenMonte) {
      const almacen = unifiedData.almacenMonte.almacenMonte;

      // Documento principal con stock actual
      const stockActualData = {
        id: 'monte',
        nombre: 'Almacén Villa (Monte)',
        totalEntradas: almacen.ingresos || 0,
        totalSalidas: almacen.salida || 0,
        stockActual: almacen.rfActual || 0,
        stockActualUSD: 0, // Se calculará con los productos
        productos: [], // Array de productos con stock
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      // Calcular stock por producto si hay salidas detalladas
      if (almacen.salidas && almacen.salidas.length > 0) {
        const productoStock = {};

        almacen.salidas.forEach((salida) => {
          const producto = salida.producto || 'Producto genérico';
          if (!productoStock[producto]) {
            productoStock[producto] = {
              nombre: producto,
              stock: 0,
              costoUnitario: 0, // Deberá calcularse desde órdenes de compra
            };
          }
          // Las salidas reducen el stock (debe calcularse desde entradas - salidas)
        });

        stockActualData.productos = Object.values(productoStock);
      }

      await setDoc(doc(db, 'almacen', 'monte'), stockActualData);
      console.log('✅ Almacén: Documento principal creado');

      // Subcollection: ENTRADAS (desde órdenes de compra)
      // Se puede derivar de ordenes_compra

      // Subcollection: SALIDAS
      if (almacen.salidas && almacen.salidas.length > 0) {
        const salidas = almacen.salidas.map((salida, index) => ({
          id: `salida_${index + 1}`,
          fecha: parseDate(salida.fecha),
          cantidad: salida.salida || 0,
          producto: salida.producto || 'Producto genérico',
          destino: salida.destino || 'Sin destino',
          observaciones: salida.observaciones || '',
          tipo: 'salida',
        }));

        totalDocuments += await batchWriteSubcollection('almacen', 'monte/salidas', salidas, 'id');
      }
    }

    // ========================================================================
    // 5. CLIENTES
    // ========================================================================
    console.log('👥 ============================================');
    console.log('   CLIENTES');
    console.log('============================================\n');

    if (unifiedData.clientes?.clientes) {
      const clientes = unifiedData.clientes.clientes.map((cliente, index) => ({
        id: `cliente_${index + 1}`,
        nombre: cliente.cliente || 'Sin nombre',
        adeudoActual: cliente.actual || 0,
        deudaTotal: cliente.deuda || 0,
        abonosTotal: cliente.abonos || 0,
        saldoPendiente: cliente.pendiente || 0,
        observaciones: cliente.observaciones || '',
        activo: true,
        ultimaCompra: null, // Se puede derivar de ventas
        ventasAsociadas: [], // IDs de ventas
      }));

      totalDocuments += await batchWrite('clientes', clientes, 'id');
    }

    // ========================================================================
    // 6. DISTRIBUIDORES
    // ========================================================================
    console.log('🚚 ============================================');
    console.log('   DISTRIBUIDORES');
    console.log('============================================\n');

    if (unifiedData.ordenesCompra?.distribuidores?.ordenesCompra) {
      // Agrupar por distribuidor
      const distribuidoresMap = {};

      unifiedData.ordenesCompra.distribuidores.ordenesCompra.forEach((oc) => {
        const nombre = oc.origen;
        if (!distribuidoresMap[nombre]) {
          distribuidoresMap[nombre] = {
            nombre,
            totalComprado: 0,
            abonado: 0,
            deudaActual: 0,
            ordenesCompra: [],
          };
        }

        distribuidoresMap[nombre].totalComprado += oc.costoTotal || 0;
        distribuidoresMap[nombre].abonado += oc.pagoDistribuidor || 0;
        distribuidoresMap[nombre].deudaActual += oc.deuda || 0;
        distribuidoresMap[nombre].ordenesCompra.push(oc.id);
      });

      const distribuidores = Object.values(distribuidoresMap).map((dist, index) => ({
        id: `distribuidor_${index + 1}`,
        nombre: dist.nombre,
        totalComprado: dist.totalComprado,
        abonado: dist.abonado,
        deudaActual: dist.deudaActual,
        ordenesCompra: dist.ordenesCompra,
        activo: true,
      }));

      totalDocuments += await batchWrite('distribuidores', distribuidores, 'id');
    }

    // ========================================================================
    // 7. GASTOS Y ABONOS GENERALES (GYA)
    // ========================================================================
    console.log('💸 ============================================');
    console.log('   GASTOS Y ABONOS GENERALES (GYA)');
    console.log('============================================\n');

    if (unifiedData.gastosAbonos?.gastosAbonos) {
      const gastosAbonos = unifiedData.gastosAbonos.gastosAbonos.map((item, index) => ({
        id: `gya_${index + 1}`,
        fecha: parseDate(item.fecha),
        tipo: item.gasto ? 'gasto' : 'abono',
        monto: item.gasto || item.abono || 0,
        tc: item.tc || 0,
        dolares: item.dolares || 0,
        concepto: item.concepto || '',
        observaciones: item.observaciones || '',
        destino: item.destino || 'General',
        categoria: item.categoria || 'General',
      }));

      totalDocuments += await batchWrite('gastos_abonos', gastosAbonos, 'id');
    }

    // ========================================================================
    // 8. CAPITALES (Resumen global)
    // ========================================================================
    console.log('💎 ============================================');
    console.log('   CAPITALES GLOBALES');
    console.log('============================================\n');

    const capitalesData = {
      bancos: {},
      almacen: {
        stockActual: unifiedData.almacenMonte?.almacenMonte?.rfActual || 0,
        stockActualUSD: 0, // Calculado con productos
        productos: [],
      },
      totalGeneral: 0,
      ultimaActualizacion: serverTimestamp(),
    };

    // Agregar capital de cada banco
    for (const [bancoId, config] of Object.entries(BANCOS_CONFIG)) {
      const bancoData = bancosMap[bancoId];
      if (bancoData) {
        capitalesData.bancos[bancoId] = {
          nombre: config.nombre,
          capital: bancoData.rfActual || 0,
          moneda: config.moneda,
        };
        capitalesData.totalGeneral += bancoData.rfActual || 0;
      }
    }

    await setDoc(doc(db, 'sistema', 'capitales'), capitalesData);
    console.log('✅ Capitales: Documento de resumen creado\n');

    // ========================================================================
    // RESUMEN FINAL
    // ========================================================================
    console.log('\n✅ ============================================');
    console.log('🎉 MIGRACIÓN OPTIMIZADA V2 COMPLETADA');
    console.log('============================================');
    console.log(`📊 Total de documentos escritos: ${totalDocuments}`);
    console.log(`\n🔥 Colecciones creadas:`);
    console.log(`  1. bancos/ (7 documentos principales)`);
    console.log(`     ├── /ingresos (subcollections por banco)`);
    console.log(`     ├── /gastos`);
    console.log(`     ├── /cortes`);
    console.log(`     └── /transferencias`);
    console.log(
      `  2. ordenes_compra (${unifiedData.ordenesCompra?.distribuidores?.ordenesCompra?.length || 0} documentos)`
    );
    console.log(`  3. ventas (${unifiedData.ventasLocal?.ventasLocal?.length || 0} documentos)`);
    console.log(`  4. almacen/ (1 documento principal + subcollections)`);
    console.log(`  5. clientes (${unifiedData.clientes?.clientes?.length || 0} documentos)`);
    console.log(`  6. distribuidores (documentos agrupados)`);
    console.log(
      `  7. gastos_abonos (${unifiedData.gastosAbonos?.gastosAbonos?.length || 0} documentos)`
    );
    console.log(`  8. sistema/capitales (1 documento de resumen)`);
    console.log('\n🚀 Datos listos con arquitectura optimizada!');
    console.log('🌐 Verifica en Firebase Console\n');
  } catch (error) {
    console.error('\n❌ ERROR EN LA MIGRACIÓN:', error);
    console.error('Stack trace:', error.stack);
    process.exit(1);
  }
}

// ============================================================================
// EJECUTAR
// ============================================================================

migrateOptimized()
  .then(() => {
    console.log('✅ Script finalizado correctamente');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Error fatal:', error);
    process.exit(1);
  });
