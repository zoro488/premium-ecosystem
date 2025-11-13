/**
 * 🔥 MIGRACIÓN OPTIMIZADA V2: Lógica de Negocio Correcta
 * ========================================================
 *
 * ESTRUCTURA DE COLECCIONES OPTIMIZADA:
 *
 * 1. bancos/{bancoId} - Documento principal de cada banco
 * 2. ordenes_compra/{ordenId} - Órdenes de compra
 * 3. almacen_movimientos/{movimientoId} - UNIFICADO (entradas + salidas)
 * 4. ventas/{ventaId} - Ventas con estado de pago
 * 5. clientes/{clienteId} - Clientes
 * 6. transacciones/{transaccionId} - TODAS las transacciones (ingresos/gastos/cortes)
 * 7. sistema/dashboard - Métricas globales
 *
 * LÓGICA DE NEGOCIO:
 *
 * A) Orden Compra → Crea movimiento almacén (tipo: entrada)
 * B) Venta → Crea movimiento almacén (tipo: salida)
 * C) Venta → Crea 3 transacciones:
 *    - Ingreso en Bóveda Monte (precio venta)
 *    - Ingreso en Fletes (flete por pieza)
 *    - Ingreso en Utilidades (utilidad por pieza)
 * D) Pago Cliente → Actualiza estado venta + capital bancos
 *
 * EJECUCIÓN:
 * npm run migrate:flowdistributor:v2
 */

import { initializeApp } from 'firebase/app';
import {
  collection,
  doc,
  getFirestore,
  serverTimestamp,
  setDoc,
  writeBatch,
  deleteDoc,
  getDocs,
} from 'firebase/firestore';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ============================================================================
// CONFIGURACIÓN FIREBASE
// ============================================================================

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
// CONSTANTES DE NEGOCIO
// ============================================================================

const PRECIO_VENTA_POR_PIEZA = 18.5; // MXN
const FLETE_POR_PIEZA = 1.5; // MXN
const UTILIDAD_POR_PIEZA = 3.0; // MXN

const BANCOS_CONFIG = {
  'boveda-monte': { nombre: 'Bóveda Monte', moneda: 'MXN', color: 'amber' },
  'boveda-usa': { nombre: 'Bóveda USA', moneda: 'USD', color: 'blue' },
  azteca: { nombre: 'Azteca', moneda: 'MXN', color: 'green' },
  utilidades: { nombre: 'Utilidades', moneda: 'MXN', color: 'purple' },
  fletes: { nombre: 'Flete Sur', moneda: 'MXN', color: 'red' },
  leftie: { nombre: 'Leftie', moneda: 'MXN', color: 'teal' },
  profit: { nombre: 'Profit', moneda: 'MXN', color: 'pink' },
};

// ============================================================================
// HELPERS
// ============================================================================

function parseDate(dateStr) {
  if (!dateStr) return new Date();
  const parts = dateStr.includes('/') ? dateStr.split('/').reverse() : dateStr.split('-');
  return new Date(parts[0], parts[1] - 1, parts[2]);
}

async function limpiarColecciones() {
  console.log('\n🧹 Limpiando colecciones antiguas...\n');

  const colecciones = [
    'bancos',
    'ordenes_compra',
    'almacen_movimientos',
    'ventas',
    'clientes',
    'transacciones',
    'ingresos',
    'gastos',
    'cortes',
    'almacen',
    'almacen_salidas',
    'gastos_abonos',
  ];

  for (const coleccion of colecciones) {
    try {
      const snapshot = await getDocs(collection(db, coleccion));
      const batch = writeBatch(db);
      let count = 0;

      snapshot.forEach((docSnap) => {
        batch.delete(docSnap.ref);
        count++;
      });

      if (count > 0) {
        await batch.commit();
        console.log(`  ✅ Eliminados ${count} documentos de ${coleccion}`);
      }
    } catch (error) {
      // Colección no existe, continuar
    }
  }

  console.log('\n✅ Limpieza completada\n');
}

async function batchWrite(collectionName, data, idField = 'id') {
  const MAX_BATCH_SIZE = 500;
  let batch = writeBatch(db);
  let operationCount = 0;
  let totalWritten = 0;

  console.log(`📝 Escribiendo en ${collectionName}: ${data.length} documentos`);

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
      console.log(`  ✅ Batch commit: ${totalWritten}/${data.length}`);
      batch = writeBatch(db);
      operationCount = 0;
    }
  }

  if (operationCount > 0) {
    await batch.commit();
    console.log(`  ✅ Final commit: ${totalWritten}/${data.length}`);
  }

  return totalWritten;
}

// ============================================================================
// FUNCIÓN PRINCIPAL
// ============================================================================

async function migrateWithBusinessLogic() {
  try {
    console.log('\n🚀 ============================================');
    console.log('🔥 MIGRACIÓN V2 - LÓGICA DE NEGOCIO OPTIMIZADA');
    console.log('============================================\n');

    // Leer JSON unificado
    const jsonPath = path.join(
      __dirname,
      '..',
      'src',
      'apps',
      'FlowDistributor',
      'data',
      'BASE_DATOS_FLOWDISTRIBUTOR_UNIFICADO.json',
    );
    console.log(`📂 Leyendo: ${jsonPath}\n`);

    const fileContent = await fs.readFile(jsonPath, 'utf-8');
    const unifiedData = JSON.parse(fileContent);

    console.log(`📊 Metadata: ${unifiedData.metadata?.version} (${unifiedData.metadata?.fecha})\n`);

    // Limpiar datos antiguos
    await limpiarColecciones();

    let totalDocuments = 0;
    const transaccionesGlobales = [];

    // ========================================================================
    // 1. BANCOS (7 documentos principales)
    // ========================================================================
    console.log('🏦 Paso 1/7: Creando bancos...');

    for (const [bancoId, config] of Object.entries(BANCOS_CONFIG)) {
      await setDoc(doc(db, 'bancos', bancoId), {
        id: bancoId,
        nombre: config.nombre,
        capital: 0,
        capitalActual: 0,
        totalIngresos: 0,
        totalGastos: 0,
        totalCortes: 0,
        moneda: config.moneda,
        color: config.color,
        activo: true,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    }
    console.log(`  ✅ 7 bancos creados\n`);

    // ========================================================================
    // 2. CLIENTES
    // ========================================================================
    console.log('👥 Paso 2/7: Creando clientes...');

    if (unifiedData.clientes?.clientes) {
      const clientes = unifiedData.clientes.clientes.map((cliente, index) => ({
        id: `cliente_${String(index + 1).padStart(3, '0')}`,
        nombre: cliente.cliente || 'Sin nombre',
        adeudoActual: cliente.actual || 0,
        deudaTotal: cliente.deuda || 0,
        abonosTotal: cliente.abonos || 0,
        saldoPendiente: cliente.pendiente || 0,
        observaciones: cliente.observaciones || '',
        activo: true,
      }));

      totalDocuments += await batchWrite('clientes', clientes, 'id');
      console.log();
    }

    // ========================================================================
    // 3. ÓRDENES DE COMPRA → MOVIMIENTOS DE ALMACÉN (ENTRADAS)
    // ========================================================================
    console.log('📦 Paso 3/7: Creando órdenes de compra y entradas de almacén...');

    const movimientosAlmacen = [];
    let stockActual = 0;

    if (unifiedData.ordenesCompra?.distribuidores?.ordenesCompra) {
      const ordenesCompra = unifiedData.ordenesCompra.distribuidores.ordenesCompra.map((oc) => ({
        id: oc.id,
        fecha: parseDate(oc.fecha),
        origen: oc.origen,
        cantidad: oc.cantidad,
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

      // Crear movimientos de almacén (ENTRADAS)
      ordenesCompra.forEach((oc) => {
        stockActual += oc.cantidad;

        movimientosAlmacen.push({
          id: `entrada_${oc.id}`,
          tipo: 'entrada',
          fecha: oc.fecha,
          cantidad: oc.cantidad,
          origen: oc.origen,
          destino: 'Almacén Monte',
          ordenCompraId: oc.id,
          stockAnterior: stockActual - oc.cantidad,
          stockNuevo: stockActual,
          costoUnitario: oc.costoPorUnidad,
          costoTotal: oc.costoTotal,
          observaciones: `Entrada por orden de compra ${oc.id}`,
        });
      });

      console.log(`  ✅ ${ordenesCompra.length} órdenes de compra creadas`);
      console.log(`  ✅ ${movimientosAlmacen.length} entradas de almacén generadas\n`);
    }

    // ========================================================================
    // 4. VENTAS → SALIDAS DE ALMACÉN + TRANSACCIONES
    // ========================================================================
    console.log('💰 Paso 4/7: Creando ventas, salidas de almacén y transacciones...');

    if (unifiedData.ventasLocal?.ventasLocal) {
      const ventas = unifiedData.ventasLocal.ventasLocal.map((venta, index) => {
        const ventaId = `venta_${String(index + 1).padStart(4, '0')}`;
        const cantidad = venta.cantidad || 0;
        const precioTotal = cantidad * PRECIO_VENTA_POR_PIEZA;
        const fleteTotal = cantidad * FLETE_POR_PIEZA;
        const utilidadTotal = cantidad * UTILIDAD_POR_PIEZA;

        stockActual -= cantidad;

        // SALIDA DE ALMACÉN
        movimientosAlmacen.push({
          id: `salida_${ventaId}`,
          tipo: 'salida',
          fecha: parseDate(venta.fecha),
          cantidad,
          origen: 'Almacén Monte',
          destino: venta.cliente || 'Cliente desconocido',
          ventaId,
          stockAnterior: stockActual + cantidad,
          stockNuevo: stockActual,
          precioUnitario: PRECIO_VENTA_POR_PIEZA,
          precioTotal,
          observaciones: `Salida por venta ${ventaId}`,
        });

        // TRANSACCIÓN 1: Ingreso en Bóveda Monte
        transaccionesGlobales.push({
          id: `trans_boveda_${ventaId}`,
          tipo: 'ingreso',
          bancoId: 'boveda-monte',
          fecha: parseDate(venta.fecha),
          monto: precioTotal,
          concepto: `Venta ${ventaId}`,
          cliente: venta.cliente || 'Cliente desconocido',
          ventaId,
          cantidad,
          precioUnitario: PRECIO_VENTA_POR_PIEZA,
        });

        // TRANSACCIÓN 2: Ingreso en Fletes
        transaccionesGlobales.push({
          id: `trans_fletes_${ventaId}`,
          tipo: 'ingreso',
          bancoId: 'fletes',
          fecha: parseDate(venta.fecha),
          monto: fleteTotal,
          concepto: `Flete venta ${ventaId}`,
          cliente: venta.cliente || 'Cliente desconocido',
          ventaId,
          cantidad,
          precioUnitario: FLETE_POR_PIEZA,
        });

        // TRANSACCIÓN 3: Ingreso en Utilidades
        transaccionesGlobales.push({
          id: `trans_utilidad_${ventaId}`,
          tipo: 'ingreso',
          bancoId: 'utilidades',
          fecha: parseDate(venta.fecha),
          monto: utilidadTotal,
          concepto: `Utilidad venta ${ventaId}`,
          cliente: venta.cliente || 'Cliente desconocido',
          ventaId,
          cantidad,
          precioUnitario: UTILIDAD_POR_PIEZA,
        });

        return {
          id: ventaId,
          fecha: parseDate(venta.fecha),
          cliente: venta.cliente || 'Cliente desconocido',
          cantidad,
          precioUnitario: PRECIO_VENTA_POR_PIEZA,
          precioTotal,
          fleteTotal,
          utilidadTotal,
          montoTotal: precioTotal + fleteTotal + utilidadTotal,
          tc: venta.tc || 0,
          dolares: venta.dolares || 0,
          estadoPago: 'pendiente',
          montoPagado: 0,
          montoPendiente: precioTotal + fleteTotal + utilidadTotal,
          observaciones: venta.observaciones || '',
        };
      });

      totalDocuments += await batchWrite('ventas', ventas, 'id');
      console.log(`  ✅ ${ventas.length} ventas creadas`);
      console.log(`  ✅ ${ventas.length} salidas de almacén generadas`);
      console.log(`  ✅ ${ventas.length * 3} transacciones generadas\n`);
    }

    // ========================================================================
    // 5. MOVIMIENTOS DE ALMACÉN (ENTRADAS + SALIDAS)
    // ========================================================================
    console.log('📊 Paso 5/7: Consolidando movimientos de almacén...');

    totalDocuments += await batchWrite('almacen_movimientos', movimientosAlmacen, 'id');
    console.log(`  ✅ Stock actual: ${stockActual} unidades\n`);

    // Documento resumen de almacén
    await setDoc(doc(db, 'sistema', 'almacen_resumen'), {
      stockActual,
      totalEntradas: movimientosAlmacen.filter((m) => m.tipo === 'entrada').length,
      totalSalidas: movimientosAlmacen.filter((m) => m.tipo === 'salida').length,
      ultimaActualizacion: serverTimestamp(),
    });

    // ========================================================================
    // 6. PROCESAR DATOS ORIGINALES DE BANCOS (ingresos/gastos/cortes)
    // ========================================================================
    console.log('💳 Paso 6/7: Procesando transacciones de bancos...');

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

      // Ingresos
      if (bancoData.ingresosList) {
        bancoData.ingresosList.forEach((ingreso, index) => {
          transaccionesGlobales.push({
            id: `${bancoId}_ingreso_${index + 1}`,
            tipo: 'ingreso',
            bancoId,
            fecha: parseDate(ingreso.fecha),
            monto: ingreso.ingreso || 0,
            cliente: ingreso.cliente || 'Sin cliente',
            concepto: ingreso.concepto || '',
            tc: ingreso.tc || 0,
            dolares: ingreso.dolares || 0,
          });
        });
      }

      // Gastos
      if (bancoData.gastosList) {
        bancoData.gastosList.forEach((gasto, index) => {
          transaccionesGlobales.push({
            id: `${bancoId}_gasto_${index + 1}`,
            tipo: 'gasto',
            bancoId,
            fecha: parseDate(gasto.fecha),
            monto: gasto.gasto || gasto.abono || 0,
            proveedor: gasto.proveedor || 'Sin proveedor',
            concepto: gasto.concepto || '',
            tc: gasto.tc || 0,
            dolares: gasto.dolares || 0,
            categoria: gasto.categoria || 'General',
          });
        });
      }

      // Cortes
      if (bancoData.rfCortes) {
        bancoData.rfCortes.forEach((corte, index) => {
          transaccionesGlobales.push({
            id: `${bancoId}_corte_${index + 1}`,
            tipo: 'corte',
            bancoId,
            fecha: parseDate(corte.fecha),
            monto: corte.corte || 0,
            concepto: corte.observaciones || 'Corte RF',
          });
        });
      }
    }

    totalDocuments += await batchWrite('transacciones', transaccionesGlobales, 'id');
    console.log();

    // ========================================================================
    // 7. ACTUALIZAR CAPITALES DE BANCOS
    // ========================================================================
    console.log('💰 Paso 7/7: Actualizando capitales de bancos...');

    const capitalesPorBanco = {};

    transaccionesGlobales.forEach((trans) => {
      if (!capitalesPorBanco[trans.bancoId]) {
        capitalesPorBanco[trans.bancoId] = { ingresos: 0, gastos: 0, cortes: 0 };
      }

      if (trans.tipo === 'ingreso') {
        capitalesPorBanco[trans.bancoId].ingresos += trans.monto;
      } else if (trans.tipo === 'gasto') {
        capitalesPorBanco[trans.bancoId].gastos += trans.monto;
      } else if (trans.tipo === 'corte') {
        capitalesPorBanco[trans.bancoId].cortes += trans.monto;
      }
    });

    for (const [bancoId, totales] of Object.entries(capitalesPorBanco)) {
      const capitalActual = totales.ingresos - totales.gastos - totales.cortes;

      await setDoc(
        doc(db, 'bancos', bancoId),
        {
          capital: capitalActual,
          capitalActual,
          totalIngresos: totales.ingresos,
          totalGastos: totales.gastos,
          totalCortes: totales.cortes,
          updatedAt: serverTimestamp(),
        },
        { merge: true },
      );

      console.log(
        `  ✅ ${bancoId}: $${capitalActual.toFixed(2)} (I:$${totales.ingresos.toFixed(2)} - G:$${totales.gastos.toFixed(2)} - C:$${totales.cortes.toFixed(2)})`,
      );
    }

    console.log();

    // ========================================================================
    // DASHBOARD GLOBAL
    // ========================================================================
    const totalCapitalEfectivo = Object.values(capitalesPorBanco).reduce(
      (sum, t) => sum + (t.ingresos - t.gastos - t.cortes),
      0,
    );

    await setDoc(doc(db, 'sistema', 'dashboard'), {
      capitalEfectivo: totalCapitalEfectivo,
      inventarioFisico: stockActual,
      totalRfActual: totalCapitalEfectivo + stockActual * PRECIO_VENTA_POR_PIEZA,
      ultimaActualizacion: serverTimestamp(),
    });

    // ========================================================================
    // RESUMEN FINAL
    // ========================================================================
    console.log('\n✅ ============================================');
    console.log('🎉 MIGRACIÓN V2 COMPLETADA');
    console.log('============================================');
    console.log(`📊 Total documentos: ${totalDocuments}`);
    console.log(`🏦 Bancos: 7`);
    console.log(`👥 Clientes: ${unifiedData.clientes?.clientes?.length || 0}`);
    console.log(`📦 Órdenes de compra: ${unifiedData.ordenesCompra?.distribuidores?.ordenesCompra?.length || 0}`);
    console.log(`💰 Ventas: ${unifiedData.ventasLocal?.ventasLocal?.length || 0}`);
    console.log(`📊 Movimientos almacén: ${movimientosAlmacen.length}`);
    console.log(`💳 Transacciones: ${transaccionesGlobales.length}`);
    console.log(`📦 Stock actual: ${stockActual} unidades`);
    console.log(`💵 Capital total: $${totalCapitalEfectivo.toFixed(2)} MXN`);
    console.log('\n🚀 Estructura optimizada lista!\n');
  } catch (error) {
    console.error('\n❌ ERROR:', error);
    console.error('Stack:', error.stack);
    process.exit(1);
  }
}

// ============================================================================
// EJECUTAR
// ============================================================================

migrateWithBusinessLogic()
  .then(() => {
    console.log('✅ Script finalizado');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Error fatal:', error);
    process.exit(1);
  });
