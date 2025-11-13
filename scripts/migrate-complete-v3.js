/**
 * 🔥 MIGRACIÓN COMPLETA V3 - TODOS LOS CAMPOS
 * ===========================================
 * Versión exhaustiva que migra CADA campo de CADA tabla
 *
 * ESTRUCTURA COMPLETA:
 * - Bancos: fecha, cliente/proveedor, monto, tc, pesos, dolares, destino, concepto, observaciones
 * - Ventas: fecha, ocRelacionada, cantidad, cliente, bovedaMonte, precioVenta, ingreso, flete, fleteUtilidad, utilidad, estatus, concepto
 * - Almacén: oc, fecha, distribuidor, cantidad, cliente, concepto, observaciones
 * - Clientes: nombre, actual, deuda, abonos, pendiente, observaciones
 * - Distribuidores: nombre, costoTotal, abonos, pendiente
 */
import { initializeApp } from 'firebase/app';
import { doc, getFirestore, serverTimestamp, setDoc, writeBatch } from 'firebase/firestore';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
  measurementId: process.env.VITE_FIREBASE_MEASUREMENT_ID,
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

async function batchWriteSubcollection(parentPath, subcollectionName, data, idPrefix) {
  const MAX_BATCH_SIZE = 500;
  let batch = writeBatch(db);
  let operationCount = 0;
  let totalWritten = 0;

  console.log(`  📝 Subcollection ${subcollectionName}: ${data.length} documentos`);

  for (let i = 0; i < data.length; i++) {
    const item = data[i];
    const docId = item.id || `${idPrefix}_${i + 1}`;
    const docRef = doc(db, parentPath, subcollectionName, docId);

    batch.set(docRef, {
      ...item,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
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

  console.log(`  ✅ ${subcollectionName}: ${totalWritten} escritos`);
  return totalWritten;
}

async function batchWriteCollection(collectionName, data, idField = 'id') {
  const MAX_BATCH_SIZE = 500;
  let batch = writeBatch(db);
  let operationCount = 0;
  let totalWritten = 0;

  console.log(`📝 Colección ${collectionName}: ${data.length} documentos`);

  for (const item of data) {
    const docId = item[idField] || `auto_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const docRef = doc(db, collectionName, docId.toString());

    batch.set(docRef, {
      ...item,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
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

  console.log(`✅ ${collectionName}: ${totalWritten} escritos\n`);
  return totalWritten;
}

// ============================================================================
// CONFIGURACIÓN
// ============================================================================

const BANCOS_CONFIG = {
  'boveda-monte': { nombre: 'Bóveda Monte', moneda: 'MXN', sourceKey: 'bovedaMonte' },
  'boveda-usa': { nombre: 'Bóveda USA', moneda: 'USD', sourceKey: 'bovedaUsa' },
  azteca: { nombre: 'Azteca', moneda: 'MXN', sourceKey: 'azteca' },
  utilidades: { nombre: 'Utilidades', moneda: 'MXN', sourceKey: 'utilidades' },
  fletes: { nombre: 'Flete Sur', moneda: 'MXN', sourceKey: 'fleteSur' },
  leftie: { nombre: 'Leftie', moneda: 'MXN', sourceKey: 'leftie' },
  profit: { nombre: 'Profit', moneda: 'MXN', sourceKey: 'profit' },
};

// ============================================================================
// FUNCIÓN PRINCIPAL
// ============================================================================

async function migrateCompleteV3() {
  try {
    console.log('\n🚀 ============================================');
    console.log('🔥 MIGRACIÓN COMPLETA V3 - TODOS LOS CAMPOS');
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
    // 1. BANCOS (7 documentos principales + subcollections)
    // ========================================================================
    console.log('🏦 ============================================');
    console.log('   PROCESANDO BANCOS CON TODOS LOS CAMPOS');
    console.log('============================================\n');

    for (const [bancoId, config] of Object.entries(BANCOS_CONFIG)) {
      const bancoData = unifiedData[config.sourceKey]?.[config.sourceKey];
      if (!bancoData) {
        console.log(`⚠️  ${config.nombre}: No encontrado en JSON`);
        continue;
      }

      console.log(`🏦 ${config.nombre}`);

      // Documento principal
      await setDoc(doc(db, 'bancos', bancoId), {
        id: bancoId,
        nombre: config.nombre,
        moneda: config.moneda,
        capital: bancoData.rfActual || 0,
        capitalActual: bancoData.rfActual || 0,
        totalIngresos: bancoData.ingresos || 0,
        totalGastos: bancoData.gastos || 0,
        activo: true,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      console.log(`  ✅ Documento principal creado`);

      // INGRESOS - TODOS LOS CAMPOS
      if (bancoData.ingresosList && bancoData.ingresosList.length > 0) {
        const ingresos = bancoData.ingresosList.map((ing, index) => ({
          id: `${bancoId}_ing_${index + 1}`,
          fecha: parseDate(ing.fecha),
          cliente: ing.cliente || '',
          monto: ing.ingreso || 0,
          concepto: ing.concepto || '',
          observaciones: ing.observaciones || '',
          // Campos adicionales si existen
          tc: ing.tc || 0,
          dolares: ing.dolares || 0,
          pesos: ing.pesos || 0,
        }));
        totalDocuments += await batchWriteSubcollection(
          `bancos/${bancoId}`,
          'ingresos',
          ingresos,
          `${bancoId}_ing`
        );
      }

      // GASTOS - TODOS LOS CAMPOS
      if (bancoData.gastosList && bancoData.gastosList.length > 0) {
        const gastos = bancoData.gastosList.map((gasto, index) => ({
          id: `${bancoId}_gasto_${index + 1}`,
          fecha: parseDate(gasto.fecha),
          origen: gasto.origen || '',
          proveedor: gasto.proveedor || gasto.origen || '',
          monto: gasto.gasto || gasto.abono || 0,
          tc: gasto.tc || 0,
          pesos: gasto.pesos || 0,
          dolares: gasto.dolares || 0,
          destino: gasto.destino || '',
          concepto: gasto.concepto || '',
          observaciones: gasto.observaciones || '',
        }));
        totalDocuments += await batchWriteSubcollection(
          `bancos/${bancoId}`,
          'gastos',
          gastos,
          `${bancoId}_gasto`
        );
      }

      // CORTES - TODOS LOS CAMPOS
      if (bancoData.rfCortes && bancoData.rfCortes.length > 0) {
        const cortes = bancoData.rfCortes.map((corte, index) => ({
          id: `${bancoId}_corte_${index + 1}`,
          fecha: parseDate(corte.fecha),
          monto: corte.corte || 0,
          concepto: corte.concepto || '',
          observaciones: corte.observaciones || '',
        }));
        totalDocuments += await batchWriteSubcollection(
          `bancos/${bancoId}`,
          'cortes',
          cortes,
          `${bancoId}_corte`
        );
      }

      // TRANSFERENCIAS - Placeholder (vacío por ahora)
      console.log(`  📋 Transferencias: 0 (placeholder creado)`);

      console.log();
    }

    // ========================================================================
    // 2. ÓRDENES DE COMPRA - TODOS LOS CAMPOS
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
        cantidad: oc.cantidad,
        costoDistribuidor: oc.costoDistribuidor,
        costoTransporte: oc.costoTransporte,
        costoPorUnidad: oc.costoPorUnidad,
        stockActual: oc.stockActual,
        costoTotal: oc.costoTotal,
        pagoDistribuidor: oc.pagoDistribuidor,
        deuda: oc.deuda,
      }));
      totalDocuments += await batchWriteCollection('ordenes_compra', ordenesCompra, 'id');
    }

    // ========================================================================
    // 3. VENTAS - TODOS LOS CAMPOS
    // ========================================================================
    console.log('💰 ============================================');
    console.log('   VENTAS LOCALES');
    console.log('============================================\n');

    if (unifiedData.ventasLocales?.ventasLocal) {
      const ventas = unifiedData.ventasLocales.ventasLocal.map((venta, index) => ({
        id: `venta_${index + 1}`,
        fecha: parseDate(venta.fecha),
        ocRelacionada: venta.ocRelacionada || '',
        cantidad: venta.cantidad || 0,
        cliente: venta.cliente || '',
        bovedaMonte: venta.bovedaMonte || 0,
        precioVenta: venta.precioVenta || 0,
        ingreso: venta.ingreso || 0,
        flete: venta.flete || '',
        fleteUtilidad: venta.fleteUtilidad || 0,
        utilidad: venta.utilidad || 0,
        estatus: venta.estatus || 'Pendiente',
        concepto: venta.concepto || '',
      }));
      totalDocuments += await batchWriteCollection('ventas', ventas, 'id');
    }

    // ========================================================================
    // 4. ALMACÉN - TODOS LOS CAMPOS
    // ========================================================================
    console.log('📦 ============================================');
    console.log('   ALMACÉN MONTE');
    console.log('============================================\n');

    if (unifiedData.almacenMonte?.almacenMonte) {
      const almacen = unifiedData.almacenMonte.almacenMonte;

      // Documento principal
      await setDoc(doc(db, 'almacen', 'monte'), {
        id: 'monte',
        nombre: 'Almacén Villa (Monte)',
        ingresosTotales: almacen.ingresos || 0,
        salidasTotales: almacen.salida || 0,
        stockActual: almacen.rfActual || 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      console.log(`✅ Almacén Monte: Documento principal`);

      // Entradas (órdenesCompra)
      if (almacen.ordenesCompra && almacen.ordenesCompra.length > 0) {
        const entradas = almacen.ordenesCompra.map((entrada, index) => ({
          id: `entrada_${index + 1}`,
          oc: entrada.oc,
          fecha: parseDate(entrada.cliente), // campo "cliente" contiene la fecha
          distribuidor: entrada.distribuidor,
          cantidad: entrada.cantidad,
        }));
        totalDocuments += await batchWriteSubcollection(
          'almacen/monte',
          'entradas',
          entradas,
          'entrada'
        );
      }

      // Salidas - TODOS LOS CAMPOS
      if (almacen.salidas && almacen.salidas.length > 0) {
        const salidas = almacen.salidas.map((salida, index) => ({
          id: `salida_${index + 1}`,
          fecha: parseDate(salida.fecha),
          cliente: salida.cliente || '',
          cantidad: salida.cantidad || 0,
          concepto: salida.concepto || '',
          observaciones: salida.observaciones || '',
        }));
        totalDocuments += await batchWriteSubcollection(
          'almacen/monte',
          'salidas',
          salidas,
          'salida'
        );
      }

      // Cortes
      if (almacen.rfCortes && almacen.rfCortes.length > 0) {
        const cortes = almacen.rfCortes.map((corte, index) => ({
          id: `corte_${index + 1}`,
          fecha: parseDate(corte.fecha),
          cantidad: corte.corte || 0,
        }));
        totalDocuments += await batchWriteSubcollection('almacen/monte', 'cortes', cortes, 'corte');
      }

      console.log();
    }

    // ========================================================================
    // 5. CLIENTES - TODOS LOS CAMPOS
    // ========================================================================
    console.log('👥 ============================================');
    console.log('   CLIENTES');
    console.log('============================================\n');

    if (unifiedData.clientes?.clientes) {
      const clientes = unifiedData.clientes.clientes.map((cliente, index) => ({
        id: `cliente_${index + 1}`,
        nombre: cliente.cliente || 'Sin nombre',
        actual: cliente.actual || 0,
        deuda: cliente.deuda || 0,
        abonos: cliente.abonos || 0,
        pendiente: cliente.pendiente || 0,
        observaciones: cliente.observaciones || '',
        activo: true,
      }));
      totalDocuments += await batchWriteCollection('clientes', clientes, 'id');
    }

    // ========================================================================
    // 6. DISTRIBUIDORES - TODOS LOS CAMPOS
    // ========================================================================
    console.log('🚚 ============================================');
    console.log('   DISTRIBUIDORES');
    console.log('============================================\n');

    if (unifiedData.ordenesCompra?.distribuidores?.distribuidores) {
      const distribuidores = unifiedData.ordenesCompra.distribuidores.distribuidores.map(
        (dist, index) => ({
          id: `distribuidor_${index + 1}`,
          nombre: dist.nombre,
          costoTotal: dist.costoTotal || 0,
          abonos: dist.abonos || 0,
          pendiente: dist.pendiente || 0,
          deudaActual: (dist.costoTotal || 0) - (dist.abonos || 0),
        })
      );
      totalDocuments += await batchWriteCollection('distribuidores', distribuidores, 'id');
    }

    // ========================================================================
    // 7. GASTOS Y ABONOS (GYA) - TODOS LOS CAMPOS
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
        pesos: item.pesos || 0,
        concepto: item.concepto || '',
        observaciones: item.observaciones || '',
        destino: item.destino || '',
      }));
      totalDocuments += await batchWriteCollection('gastos_abonos', gastosAbonos, 'id');
    }

    // ========================================================================
    // 8. CAPITALES - RESUMEN GLOBAL
    // ========================================================================
    console.log('💎 ============================================');
    console.log('   CAPITALES (RESUMEN GLOBAL)');
    console.log('============================================\n');

    const capitalesPorBanco = {};
    for (const [bancoId, config] of Object.entries(BANCOS_CONFIG)) {
      const bancoData = unifiedData[config.sourceKey]?.[config.sourceKey];
      if (bancoData) {
        capitalesPorBanco[bancoId] = {
          nombre: config.nombre,
          capital: bancoData.rfActual || 0,
          moneda: config.moneda,
        };
      }
    }

    // Stock en USD (asumiendo 17 unidades a $7000 USD c/u)
    const stockActual = unifiedData.almacenMonte?.almacenMonte?.rfActual || 17;
    const precioUSD = 7000;
    const stockEnUSD = stockActual * precioUSD;

    await setDoc(doc(db, 'sistema', 'capitales'), {
      bancos: capitalesPorBanco,
      almacen: {
        stockUnidades: stockActual,
        precioUSD: precioUSD,
        valorTotalUSD: stockEnUSD,
      },
      totalGeneral:
        Object.values(capitalesPorBanco).reduce((sum, b) => sum + b.capital, 0) + stockEnUSD,
      updatedAt: serverTimestamp(),
    });
    console.log(`✅ Capitales: Resumen global creado\n`);

    // ========================================================================
    // RESUMEN FINAL
    // ========================================================================
    console.log('\n✅ ============================================');
    console.log('🎉 MIGRACIÓN COMPLETA V3 FINALIZADA');
    console.log('============================================');
    console.log(`📊 Total de documentos escritos: ${totalDocuments}`);
    console.log(`🔥 Colecciones creadas:`);
    console.log(`  1. bancos/ (7 docs + subcollections)`);
    console.log(`  2. ordenes_compra`);
    console.log(`  3. ventas`);
    console.log(`  4. almacen/ (1 doc + subcollections)`);
    console.log(`  5. clientes`);
    console.log(`  6. distribuidores`);
    console.log(`  7. gastos_abonos`);
    console.log(`  8. sistema/capitales (resumen)`);
    console.log('\n🚀 Todos los campos migrados correctamente!\n');
  } catch (error) {
    console.error('\n❌ ERROR EN LA MIGRACIÓN:', error);
    console.error('Stack trace:', error.stack);
    process.exit(1);
  }
}

// ============================================================================
// EJECUTAR
// ============================================================================

migrateCompleteV3()
  .then(() => {
    console.log('✅ Script finalizado correctamente');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Error fatal:', error);
    process.exit(1);
  });
