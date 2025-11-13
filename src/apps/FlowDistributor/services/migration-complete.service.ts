/**
 * 🚀 SERVICIO DE MIGRACIÓN COMPLETO - FLOWDISTRIBUTOR
 * Migra TODAS las tablas de TODOS los paneles a Firestore
 * - 7 Bancos: Azteca, Bóveda Monte, Bóveda USA, Fletes, Leftie, Profit, Utilidades
 *   Cada uno: gastos, ingresos, rfCortes, rfActual (saldo actual), transferencias
 * - GYA: Tabla de transacciones (gastos y abonos del sistema)
 * - Almacén: ingresos, salidas, ordenesCompra, rfActual (stock actual)
 * - Otros: ventas, clientes, distribuidores, órdenes de compra
 */

import { collection, doc, getDocs, setDoc, writeBatch } from 'firebase/firestore';
import { db } from './firebase.config';

// Importar datos
import datosUnificados from '../data/BASE_DATOS_FLOWDISTRIBUTOR_UNIFICADO.json';
import almacenManual from '../data/panel-almacen-monte-manual.json';
import aztecaManual from '../data/panel-azteca-manual.json';
import bovedaMonteManual from '../data/panel-boveda-monte-manual.json';
import bovedaUSAManual from '../data/panel-boveda-usa-manual.json';
import clientesManual from '../data/panel-clientes-manual.json';
import dashboardManual from '../data/panel-dashboard-manual.json';
import fletesManual from '../data/panel-fletes-manual.json';
import gyaManual from '../data/panel-gastos-abonos-manual.json';
import leftieManual from '../data/panel-leftie-manual.json';
import ordenesManual from '../data/panel-ordenes-compra-manual.json';
import profitManual from '../data/panel-profit-manual.json';
import utilidadesManual from '../data/panel-utilidades-manual.json';
import ventasManual from '../data/panel-ventas-local-manual.json';

// ============================================================================
// TIPOS
// ============================================================================

export interface MigrationProgress {
  stage: string;
  progress: number;
  total: number;
  message: string;
}

export type ProgressCallback = (progress: MigrationProgress) => void;

export interface MigrationResult {
  success: boolean;
  message: string;
  collections: {
    [key: string]: number; // nombre colección -> cantidad de documentos
  };
  errors: string[];
}

// ============================================================================
// FUNCIÓN PRINCIPAL DE MIGRACIÓN
// ============================================================================

export async function migrateAllData(
  onProgress?: ProgressCallback
): Promise<MigrationResult> {
  const collections: { [key: string]: number } = {};
  const errors: string[] = [];

  try {
    // 0. DASHBOARD - RF ACTUAL (Saldo actual de todos los bancos y almacén)
    onProgress?.({ stage: 'dashboard', progress: 0, total: 100, message: 'Migrando Dashboard (saldos actuales)...' });
    const dashboardData = dashboardManual.dashboard?.paneles || [];
    const dashboardCount = await migrateCollection('dashboard_saldos', dashboardData);
    collections['dashboard_saldos'] = dashboardCount;

    // También guardar el total consolidado
    if (dashboardManual.dashboard) {
      const dashboardTotalRef = collection(db, 'dashboard_totales');
      const totalDocRef = doc(dashboardTotalRef, 'actual');
      await setDoc(totalDocRef, {
        capitalEfectivo: dashboardManual.dashboard.capitalEfectivo || 0,
        inventarioFisico: dashboardManual.dashboard.inventarioFisico || 0,
        totalRfActual: dashboardManual.dashboard.totalRfActual || 0,
        ultimaActualizacion: new Date().toISOString()
      });
      collections['dashboard_totales'] = 1;
    }

    // 1. ÓRDENES DE COMPRA
    onProgress?.({ stage: 'ordenes', progress: 5, total: 100, message: 'Migrando órdenes de compra...' });
    const ordenesData = (datosUnificados as any).ordenesCompra?.distribuidores?.ordenesCompra || ordenesManual.ordenesCompra || [];
    const ordenesCount = await migrateCollection('ordenesCompra', ordenesData);
    collections['ordenesCompra'] = ordenesCount;

    // 2. VENTAS
    onProgress?.({ stage: 'ventas', progress: 10, total: 100, message: 'Migrando ventas...' });
    const ventasCount = await migrateCollection(
      'ventas',
      (datosUnificados as any).ventas || ventasManual.ventasLocal || []
    );
    collections['ventas'] = ventasCount;

    // 3. DISTRIBUIDORES
    onProgress?.({ stage: 'distribuidores', progress: 15, total: 100, message: 'Migrando distribuidores...' });
    const distribuidoresCount = await migrateCollection(
      'distribuidores',
      (datosUnificados as any).distribuidores || []
    );
    collections['distribuidores'] = distribuidoresCount;

    // 4. CLIENTES
    onProgress?.({ stage: 'clientes', progress: 30, total: 100, message: 'Migrando clientes...' });
    const clientesCount = await migrateCollection(
      'clientes',
      (datosUnificados as any).clientes || clientesManual.clientes || []
    );
    collections['clientes'] = clientesCount;

    // 5. BANCO AZTECA (3 tablas + transferencias)
    onProgress?.({ stage: 'azteca', progress: 40, total: 100, message: 'Migrando Banco Azteca...' });
    await migrateBanco('azteca', aztecaManual.azteca, collections);

    // 6. BÓVEDA MONTE (3 tablas + transferencias)
    onProgress?.({ stage: 'bovedaMonte', progress: 50, total: 100, message: 'Migrando Bóveda Monte...' });
    await migrateBanco('bovedaMonte', bovedaMonteManual.bovedaMonte, collections);

    // 7. BÓVEDA USA (3 tablas + transferencias)
    onProgress?.({ stage: 'bovedaUSA', progress: 55, total: 100, message: 'Migrando Bóveda USA...' });
    await migrateBanco('bovedaUSA', bovedaUSAManual.bovedaUsa, collections);

    // 8. BANCO FLETES (3 tablas + transferencias)
    onProgress?.({ stage: 'fletes', progress: 60, total: 100, message: 'Migrando Fletes...' });
    await migrateBanco('fletes', fletesManual.fleteSur, collections);

    // 9. BANCO LEFTIE (3 tablas + transferencias)
    onProgress?.({ stage: 'leftie', progress: 65, total: 100, message: 'Migrando Leftie...' });
    await migrateBanco('leftie', leftieManual.leftie, collections);

    // 10. BANCO PROFIT (3 tablas + transferencias)
    onProgress?.({ stage: 'profit', progress: 70, total: 100, message: 'Migrando Profit...' });
    await migrateBanco('profit', profitManual.profit, collections);

    // 11. BANCO UTILIDADES (3 tablas + transferencias)
    onProgress?.({ stage: 'utilidades', progress: 75, total: 100, message: 'Migrando Utilidades...' });
    await migrateBanco('utilidades', utilidadesManual.utilidades, collections);

    // 12. BANCO GYA - GASTOS Y ABONOS (solo 1 tabla de transacciones)
    onProgress?.({ stage: 'gya', progress: 80, total: 100, message: 'Migrando GYA (Gastos y Abonos)...' });
    const gyaCount = await migrateCollection('gya_transacciones', gyaManual.gastosAbonos || []);
    collections['gya_transacciones'] = gyaCount;

    // 13. ALMACÉN (3 tablas + stock)
    onProgress?.({ stage: 'almacen', progress: 85, total: 100, message: 'Migrando Almacén...' });
    await migrateAlmacen(almacenManual.almacenMonte, collections);

    // FIN
    onProgress?.({ stage: 'done', progress: 100, total: 100, message: '✅ Migración completada' });

    return {
      success: true,
      message: '✅ Todos los datos migrados exitosamente',
      collections,
      errors
    };

  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Error desconocido';
    errors.push(errorMsg);

    return {
      success: false,
      message: `❌ Error en migración: ${errorMsg}`,
      collections,
      errors
    };
  }
}

// ============================================================================
// FUNCIONES AUXILIARES
// ============================================================================

/**
 * Migra una colección genérica
 */
async function migrateCollection(
  collectionName: string,
  data: any[]
): Promise<number> {
  if (!data || data.length === 0) return 0;

  const batch = writeBatch(db);
  const collectionRef = collection(db, collectionName);

  data.forEach((item, index) => {
    const docRef = doc(collectionRef, `${collectionName}_${index + 1}`);
    batch.set(docRef, {
      ...item,
      migratedAt: new Date().toISOString(),
      id: `${collectionName}_${index + 1}`
    });
  });

  await batch.commit();
  return data.length;
}

/**
 * Migra las 3 tablas de un banco + tabla de transferencias vacía
 */
async function migrateBanco(
  bancoName: string,
  bancoData: any,
  collections: { [key: string]: number }
): Promise<void> {
  // 1. GASTOS
  const gastosData = bancoData.gastosList || bancoData.gastos || [];
  const gastosCount = await migrateCollection(`${bancoName}_gastos`, gastosData);
  collections[`${bancoName}_gastos`] = gastosCount;

  // 2. INGRESOS
  const ingresosData = bancoData.ingresosList || bancoData.ingresos || [];
  const ingresosCount = await migrateCollection(`${bancoName}_ingresos`, ingresosData);
  collections[`${bancoName}_ingresos`] = ingresosCount;

  // 3. RF CORTES (historial)
  const rfCortesData = bancoData.rfCortes || [];
  const rfCortesCount = await migrateCollection(`${bancoName}_rfCortes`, rfCortesData);
  collections[`${bancoName}_rfCortes`] = rfCortesCount;

  // 4. TRANSFERENCIAS (vacía inicialmente)
  const transferenciasRef = collection(db, `${bancoName}_transferencias`);
  const placeholderDocRef = doc(transferenciasRef, 'placeholder');
  await setDoc(placeholderDocRef, {
    created: new Date().toISOString(),
    message: 'Colección creada. Agregar transferencias desde UI.'
  });
  collections[`${bancoName}_transferencias`] = 0;
}

/**
 * Migra las 3 tablas del almacén + stock actual
 */
async function migrateAlmacen(
  almacenData: any,
  collections: { [key: string]: number }
): Promise<void> {
  // 1. INGRESOS AL ALMACÉN
  const ingresosData = almacenData.ingresos || [];
  const ingresosCount = await migrateCollection('almacen_ingresos', ingresosData);
  collections['almacen_ingresos'] = ingresosCount;

  // 2. SALIDAS DEL ALMACÉN
  const salidasData = almacenData.salidas || almacenData.salida || [];
  const salidasCount = await migrateCollection('almacen_salidas', salidasData);
  collections['almacen_salidas'] = salidasCount;

  // 3. ÓRDENES DE COMPRA DEL ALMACÉN
  const ordenesData = almacenData.ordenesCompra || [];
  const ordenesCount = await migrateCollection('almacen_ordenes', ordenesData);
  collections['almacen_ordenes'] = ordenesCount;

  // 4. STOCK ACTUAL (calculado o desde rfActual)
  const stockData = almacenData.rfActual ? [almacenData.rfActual] : [];
  const stockCount = await migrateCollection('almacen_stock', stockData);
  collections['almacen_stock'] = stockCount;
}

// ============================================================================
// VERIFICACIÓN Y LIMPIEZA
// ============================================================================

/**
 * Verifica el estado de la migración
 */
export async function checkMigrationStatus(): Promise<{
  collections: { [key: string]: number };
  total: number;
}> {
  const collections: { [key: string]: number } = {};
  let total = 0;

  const collectionNames = [
    'dashboard_saldos', 'dashboard_totales',
    'ordenesCompra', 'ventas', 'distribuidores', 'clientes',
    'azteca_gastos', 'azteca_ingresos', 'azteca_rfCortes', 'azteca_transferencias',
    'bovedaMonte_gastos', 'bovedaMonte_ingresos', 'bovedaMonte_rfCortes', 'bovedaMonte_transferencias',
    'bovedaUSA_gastos', 'bovedaUSA_ingresos', 'bovedaUSA_rfCortes', 'bovedaUSA_transferencias',
    'fletes_gastos', 'fletes_ingresos', 'fletes_rfCortes', 'fletes_transferencias',
    'leftie_gastos', 'leftie_ingresos', 'leftie_rfCortes', 'leftie_transferencias',
    'profit_gastos', 'profit_ingresos', 'profit_rfCortes', 'profit_transferencias',
    'utilidades_gastos', 'utilidades_ingresos', 'utilidades_rfCortes', 'utilidades_transferencias',
    'gya_transacciones',
    'almacen_ingresos', 'almacen_salidas', 'almacen_ordenes', 'almacen_stock'
  ];

  for (const collectionName of collectionNames) {
    try {
      const snapshot = await getDocs(collection(db, collectionName));
      const count = snapshot.size;
      collections[collectionName] = count;
      total += count;
    } catch (error) {
      collections[collectionName] = 0;
    }
  }

  return { collections, total };
}

/**
 * Limpia todas las colecciones
 */
export async function clearAllData(): Promise<void> {
  const collectionNames = [
    'dashboard_saldos', 'dashboard_totales',
    'ordenesCompra', 'ventas', 'distribuidores', 'clientes',
    'azteca_gastos', 'azteca_ingresos', 'azteca_rfCortes', 'azteca_transferencias',
    'bovedaMonte_gastos', 'bovedaMonte_ingresos', 'bovedaMonte_rfCortes', 'bovedaMonte_transferencias',
    'bovedaUSA_gastos', 'bovedaUSA_ingresos', 'bovedaUSA_rfCortes', 'bovedaUSA_transferencias',
    'fletes_gastos', 'fletes_ingresos', 'fletes_rfCortes', 'fletes_transferencias',
    'leftie_gastos', 'leftie_ingresos', 'leftie_rfCortes', 'leftie_transferencias',
    'profit_gastos', 'profit_ingresos', 'profit_rfCortes', 'profit_transferencias',
    'utilidades_gastos', 'utilidades_ingresos', 'utilidades_rfCortes', 'utilidades_transferencias',
    'gya_transacciones',
    'almacen_ingresos', 'almacen_salidas', 'almacen_ordenes', 'almacen_stock'
  ];

  for (const collectionName of collectionNames) {
    const snapshot = await getDocs(collection(db, collectionName));
    const batch = writeBatch(db);

    snapshot.docs.forEach((document) => {
      batch.delete(document.ref);
    });

    if (snapshot.docs.length > 0) {
      await batch.commit();
    }
  }
}
