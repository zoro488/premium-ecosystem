/**
 * 🔥 MIGRACIÓN AUTOMÁTICA: BASE_DATOS_FLOWDISTRIBUTOR_UNIFICADO.json → Firestore
 *
 * Este script carga TODOS los datos del JSON unificado a Firestore de forma optimizada
 * Estructura: ordenesCompra, clientes, bancos (7), ventas, almacen, gastos/abonos
 *
 * EJECUCIÓN:
 * node scripts/migrate-unified-json-to-firestore.js
 */
import { initializeApp } from 'firebase/app';
import { doc, getFirestore, serverTimestamp, setDoc, writeBatch } from 'firebase/firestore';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ============================================================================
// CONFIGURACIÓN FIREBASE (usar variables de entorno en producción)
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

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ============================================================================
// CONSTANTES Y CONFIGURACIÓN CENTRALIZADA
// ============================================================================

const COLLECTIONS = {
  ORDENES_COMPRA: 'ordenes_compra',
  CLIENTES: 'clientes',
  ALMACEN: 'almacen',
  ALMACEN_SALIDAS: 'almacen_salidas',
  BANCOS: 'bancos',
  INGRESOS: 'ingresos',
  GASTOS: 'gastos',
  CORTES: 'cortes',
  VENTAS: 'ventas',
  GASTOS_ABONOS: 'gastos_abonos',
  SISTEMA: 'sistema',
};

const BANCOS_CONFIG = {
  'boveda-monte': { nombre: 'Bóveda Monte', moneda: 'MXN', color: 'amber', icono: 'Building2' },
  'boveda-usa': { nombre: 'Bóveda USA', moneda: 'USD', color: 'blue', icono: 'Building2' },
  // ... Mover toda la configuración de bancos aquí
  profit: { nombre: 'Profit', moneda: 'MXN', color: 'pink', icono: 'BarChart3' },
};

// ============================================================================
// HELPERS
// ============================================================================

/**
 * Convierte fecha string a Date objeto
 */
function parseDate(dateStr) {
  if (!dateStr || typeof dateStr !== 'string') {
    console.warn(`[Alerta] Se encontró una fecha vacía o inválida. Usando fecha actual.`);
    return new Date();
  }

  // Intenta formato ISO YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}/.test(dateStr)) {
    const date = new Date(dateStr);
    if (!isNaN(date.getTime())) return date;
  }

  // Intenta formato DD/MM/YYYY
  const slashParts = dateStr.split('/');
  if (slashParts.length === 3) {
    const [day, month, year] = slashParts.map(p => parseInt(p, 10));
    if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
      const date = new Date(year, month - 1, day);
      if (!isNaN(date.getTime())) return date;
    }
  }

  console.warn(`[Alerta] Formato de fecha no reconocido: "${dateStr}". Usando fecha actual.`);
  return new Date();
}

/**
 * Carga datos en batch de forma segura (max 500 ops por batch)
 */
async function batchWrite(collectionName, data, idField = 'id') {
  const MAX_BATCH_SIZE = 500;
  let batch = writeBatch(db);
  let operationCount = 0;
  let totalWritten = 0;

  console.log(`📝 Iniciando escritura en colección: ${collectionName} (${data.length} documentos)`);

  for (const item of data) {
    const docId = item[idField] || `auto_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const docRef = doc(db, collectionName, docId.toString());

    // Agregar timestamps
    const docData = {
      ...item,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      importedFrom: 'BASE_DATOS_FLOWDISTRIBUTOR_UNIFICADO.json',
      importedAt: new Date().toISOString(),
    };

    batch.set(docRef, docData);
    operationCount++;
    totalWritten++;

    // Commit cada 500 operaciones
    if (operationCount === MAX_BATCH_SIZE) {
      await batch.commit();
      console.log(`  ✅ Batch commit: ${totalWritten}/${data.length}`);
      batch = writeBatch(db);
      operationCount = 0;
    }
  }

  // Commit operaciones restantes
  if (operationCount > 0) {
    await batch.commit();
    console.log(`  ✅ Batch final commit: ${totalWritten}/${data.length}`);
  }

  console.log(`✅ Colección ${collectionName} completada: ${totalWritten} documentos escritos\n`);
  return totalWritten;
}

/**
 * Crear documento de banco con estructura correcta
 */
function createBancoDocument(bancoId, bancoData) {
  const bancoConfig = BANCOS_CONFIG[bancoId];
  if (!bancoConfig) throw new Error(`Configuración no encontrada para el banco: ${bancoId}`);

  const ingresos = bancoData.ingresos || 0;
  const gastos = bancoData.gastos || 0;
  const rfActual = bancoData.rfActual || 0;

  return {
    id: bancoId,
    nombre: bancoConfig.nombre,
    capital: rfActual, // Alias
    capitalActual: rfActual,
    capitalHistorico: ingresos - gastos,
    totalIngresos: ingresos,
    totalGastos: gastos,
    moneda: bancoConfig.moneda,
    color: bancoConfig.color,
    icono: bancoConfig.icono,
    activo: true,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
}

// ============================================================================
// TRANSFORMERS (Aplicando Single Responsibility Principle)
// ============================================================================

function transformClientes(clientesData) {
  return clientesData.map((cliente) => ({
    nombre: cliente.cliente || 'Sin nombre',
    adeudoActual: Number(cliente.actual) || 0,
    deudaTotal: Number(cliente.deuda) || 0,
    abonosTotal: Number(cliente.abonos) || 0,
    saldoPendiente: Number(cliente.pendiente) || 0,
    observaciones: cliente.observaciones || '',
    activo: true,
  }));
}

// ============================================================================
// FUNCIÓN PRINCIPAL DE MIGRACIÓN
// ============================================================================

async function migrateUnifiedDataToFirestore() {
  try {
    console.log('\n🚀 ============================================');
    console.log('🔥 MIGRACIÓN AUTOMÁTICA JSON → FIRESTORE');
    console.log('============================================\n');

    // Leer JSON unificado
    const jsonPath = path.join(
      __dirname,
      '..',
      'src',
      'apps',
      'FlowDistributor',
      'data',
      'BASE_DATOS_FLOWDISTRIBUTOR_UNIFICADO.json'
    );
    console.log(`📂 Leyendo archivo: ${jsonPath}\n`);

    const fileContent = await fs.readFile(jsonPath, 'utf-8');
    const unifiedData = JSON.parse(fileContent);

    console.log('📊 Datos cargados desde JSON:');
    console.log(`  - Metadata: ${unifiedData.metadata?.version || 'N/A'}`);
    console.log(`  - Fecha: ${unifiedData.metadata?.fecha || 'N/A'}\n`);

    let totalDocuments = 0;

    // ========================================================================
    // 1. ÓRDENES DE COMPRA
    // ========================================================================
    if (unifiedData.ordenesCompra?.distribuidores?.ordenesCompra) {
      const ordenesCompra = unifiedData.ordenesCompra.distribuidores.ordenesCompra.map((oc) => ({
        ...oc,
        fecha: parseDate(oc.fecha),
      }));

      totalDocuments += await batchWrite(COLLECTIONS.ORDENES_COMPRA, ordenesCompra, 'id');
    }

    // ========================================================================
    // 2. CLIENTES
    // ========================================================================
    if (unifiedData.clientes?.clientes) {
      const clientes = transformClientes(unifiedData.clientes.clientes);
      totalDocuments += await batchWrite(COLLECTIONS.CLIENTES, clientes); // ID autogenerado
    }

    // ========================================================================
    // 3. ALMACÉN MONTE
    // ========================================================================
    if (unifiedData.almacenMonte?.almacenMonte) {
      const almacen = unifiedData.almacenMonte.almacenMonte;

      // Documento principal del almacén
      await setDoc(doc(db, 'almacen', 'monte'), {
        id: 'monte',
        nombre: 'Almacén Villa (Monte)',
        ingresosTotales: almacen.ingresos || 0,
        salidasTotales: almacen.salida || 0,
        stockActual: almacen.rfActual || 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      console.log('✅ Almacén Monte: Documento principal creado\n');

      // Salidas del almacén
      if (almacen.salidas && almacen.salidas.length > 0) {
        const salidas = almacen.salidas.map((salida, index) => ({
          id: `salida_${index + 1}`,
          fecha: parseDate(salida.fecha),
          cantidad: salida.salida || 0,
          producto: salida.producto || 'Producto genérico',
          destino: salida.destino || 'Sin destino',
          observaciones: salida.observaciones || '',
        }));

        totalDocuments += await batchWrite('almacen_salidas', salidas, 'id');
      }
    }

    // ========================================================================
    // 4. BANCOS (7 bancos con ingresos, gastos, cortes)
    // ========================================================================
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

      console.log(`🏦 Procesando banco: ${bancoId}`);

      // Documento principal del banco
      const bancoDoc = createBancoDocument(bancoId, bancoData);
      await setDoc(doc(db, 'bancos', bancoId), bancoDoc);
      console.log(`  ✅ Banco ${bancoId}: Documento principal creado`);

      // Ingresos del banco
      if (bancoData.ingresosList && bancoData.ingresosList.length > 0) {
        const ingresos = bancoData.ingresosList.map((ingreso, index) => ({
          id: `${bancoId}_ingreso_${index + 1}`,
          bancoId,
          fecha: parseDate(ingreso.fecha),
          cliente: ingreso.cliente || 'Sin cliente',
          monto: ingreso.ingreso || 0,
          tc: ingreso.tc || 0,
          dolares: ingreso.dolares || 0,
          concepto: ingreso.concepto || '',
          observaciones: ingreso.observaciones || '',
        }));

        totalDocuments += await batchWrite('ingresos', ingresos, 'id');
      }

      // Gastos del banco
      if (bancoData.gastosList && bancoData.gastosList.length > 0) {
        const gastos = bancoData.gastosList.map((gasto, index) => ({
          id: `${bancoId}_gasto_${index + 1}`,
          bancoId,
          fecha: parseDate(gasto.fecha),
          proveedor: gasto.proveedor || 'Sin proveedor',
          monto: gasto.gasto || gasto.abono || 0,
          tc: gasto.tc || 0,
          dolares: gasto.dolares || 0,
          concepto: gasto.concepto || '',
          observaciones: gasto.observaciones || '',
          categoria: gasto.categoria || 'General',
        }));

        totalDocuments += await batchWrite('gastos', gastos, 'id');
      }

      // Cortes del banco
      if (bancoData.rfCortes && bancoData.rfCortes.length > 0) {
        const cortes = bancoData.rfCortes.map((corte, index) => ({
          id: `${bancoId}_corte_${index + 1}`,
          bancoId,
          fecha: parseDate(corte.fecha),
          monto: corte.corte || 0,
          observaciones: corte.observaciones || '',
        }));

        totalDocuments += await batchWrite('cortes', cortes, 'id');
      }

      console.log(`  ✅ Banco ${bancoId} completado\n`);
    }

    // ========================================================================
    // 5. VENTAS LOCALES
    // ========================================================================
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
      }));

      totalDocuments += await batchWrite('ventas', ventas, 'id');
    }

    // ========================================================================
    // 6. GASTOS Y ABONOS GENERALES
    // ========================================================================
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
      }));

      totalDocuments += await batchWrite('gastos_abonos', gastosAbonos, 'id');
    }

    // ========================================================================
    // 7. DASHBOARD (documento único con métricas)
    // ========================================================================
    if (unifiedData.dashboard?.dashboard) {
      const dashboard = unifiedData.dashboard.dashboard;

      await setDoc(doc(db, 'sistema', 'dashboard'), {
        capitalEfectivo: dashboard.capitalEfectivo || 0,
        inventarioFisico: dashboard.inventarioFisico || 0,
        totalRfActual: dashboard.totalRfActual || 0,
        paneles: dashboard.paneles || [],
        updatedAt: serverTimestamp(),
      });

      console.log('✅ Dashboard: Métricas generales creadas\n');
    }

    // ========================================================================
    // RESUMEN FINAL
    // ========================================================================
    console.log('\n✅ ============================================');
    console.log('🎉 MIGRACIÓN COMPLETADA EXITOSAMENTE');
    console.log('============================================');
    console.log(`📊 Total de documentos escritos: ${totalDocuments}`);
    console.log(`🔥 Colecciones creadas:`);
    console.log(`  - bancos (7 documentos)`);
    console.log(`  - clientes`);
    console.log(`  - ordenes_compra`);
    console.log(`  - ingresos`);
    console.log(`  - gastos`);
    console.log(`  - cortes`);
    console.log(`  - ventas`);
    console.log(`  - almacen`);
    console.log(`  - almacen_salidas`);
    console.log(`  - gastos_abonos`);
    console.log(`  - sistema (dashboard)`);
    console.log('\n🚀 Los datos están listos en Firestore!');
    console.log('🎨 Ahora puedes actualizar los componentes para usar estos datos.\n');
  } catch (error) {
    console.error('\n❌ ERROR EN LA MIGRACIÓN:', error);
    console.error('Stack trace:', error.stack);
    process.exit(1);
  }
}

// ============================================================================
// EJECUTAR MIGRACIÓN
// ============================================================================

migrateUnifiedDataToFirestore()
  .then(() => {
    console.log('✅ Script finalizado correctamente');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Error fatal:', error);
    process.exit(1);
  });
