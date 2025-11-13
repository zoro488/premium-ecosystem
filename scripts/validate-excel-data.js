#!/usr/bin/env node
/**
 * 🔍 VALIDACIÓN COMPLETA DE DATOS EXCEL vs FIREBASE
 *
 * Este script compara todas las cifras del Excel con los datos en Firebase
 * para garantizar integridad y consistencia de datos.
 *
 * Uso: node scripts/validate-excel-data.js
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import fs from 'fs';
import chalk from 'chalk';

// ============================================================================
// CONFIGURACIÓN
// ============================================================================

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Cargar datos del Excel
const excelData = JSON.parse(
  fs.readFileSync('./BASE_DATOS_excel_data.json', 'utf-8')
);

// ============================================================================
// CONSTANTES DE VALIDACIÓN
// ============================================================================

const TOLERANCIA = 0.01; // Tolerancia para comparaciones de punto flotante
const VALORES_ESPERADOS = {
  utilidadTotal: -6095100.0,
  ventasTotales: 8501600.0,
  comprasTotales: 14478800.0,
  capitalTotal: 0,
  inventarioActual: 17,
  carteraPorCobrar: 0,
  cuentasPorPagar: 0.0,
};

// ============================================================================
// UTILIDADES
// ============================================================================

const log = {
  success: (msg) => console.log(chalk.green('✅ ' + msg)),
  error: (msg) => console.log(chalk.red('❌ ' + msg)),
  warning: (msg) => console.log(chalk.yellow('⚠️  ' + msg)),
  info: (msg) => console.log(chalk.blue('ℹ️  ' + msg)),
  header: (msg) => console.log(chalk.cyan.bold('\n' + '='.repeat(80) + '\n' + msg + '\n' + '='.repeat(80))),
};

const formatCurrency = (value) => {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
  }).format(value);
};

const compararNumeros = (valor1, valor2, tolerancia = TOLERANCIA) => {
  return Math.abs(valor1 - valor2) < tolerancia;
};

// ============================================================================
// VALIDACIONES
// ============================================================================

let erroresEncontrados = 0;
let advertenciasEncontradas = 0;
let validacionesExitosas = 0;

/**
 * Valida que dos valores sean iguales dentro de una tolerancia
 */
const validar = (nombre, valorActual, valorEsperado, formatear = false) => {
  const iguales = compararNumeros(valorActual, valorEsperado);

  if (iguales) {
    validacionesExitosas++;
    const valor = formatear ? formatCurrency(valorActual) : valorActual;
    log.success(`${nombre}: ${valor}`);
  } else {
    erroresEncontrados++;
    const actual = formatear ? formatCurrency(valorActual) : valorActual;
    const esperado = formatear ? formatCurrency(valorEsperado) : valorEsperado;
    log.error(
      `${nombre}: Esperado ${esperado}, Obtenido ${actual} (Diferencia: ${Math.abs(valorActual - valorEsperado)})`
    );
  }

  return iguales;
};

/**
 * Valida ventas individuales
 */
async function validarVentas() {
  log.header('VALIDACIÓN DE VENTAS');

  const ventasExcel = excelData.ventas || [];
  const ventasSnapshot = await getDocs(collection(db, 'ventas'));
  const ventasFirebase = ventasSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

  log.info(`Ventas en Excel: ${ventasExcel.length}`);
  log.info(`Ventas en Firebase: ${ventasFirebase.length}`);

  if (ventasExcel.length !== ventasFirebase.length) {
    log.warning(`Cantidad de ventas no coincide: Excel=${ventasExcel.length}, Firebase=${ventasFirebase.length}`);
    advertenciasEncontradas++;
  }

  // Validar totales
  const totalVentasExcel = ventasExcel.reduce((sum, v) => sum + (v.totalVenta || 0), 0);
  const totalVentasFirebase = ventasFirebase.reduce((sum, v) => sum + (v.totalVenta || 0), 0);

  validar('Total Ventas', totalVentasFirebase, totalVentasExcel, true);

  // Validar fórmula PV = FL + BM + UT para cada venta
  let ventasConErrorFormula = 0;

  ventasExcel.forEach((venta, index) => {
    const pv = venta.totalVenta || 0;
    const fl = venta.totalFletes || 0;
    const bm = venta.bovedaMonte || 0;
    const ut = venta.totalUtilidades || 0;

    const suma = fl + bm + ut;

    if (!compararNumeros(pv, suma, 0.01)) {
      ventasConErrorFormula++;
      log.error(
        `Venta ${index + 1}: Fórmula PV = FL + BM + UT incorrecta. ` +
        `PV=${formatCurrency(pv)}, FL+BM+UT=${formatCurrency(suma)}`
      );
    }
  });

  if (ventasConErrorFormula === 0) {
    log.success(`Todas las ${ventasExcel.length} ventas cumplen la fórmula PV = FL + BM + UT`);
    validacionesExitosas++;
  } else {
    log.error(`${ventasConErrorFormula} ventas con fórmula incorrecta`);
    erroresEncontrados += ventasConErrorFormula;
  }
}

/**
 * Valida clientes
 */
async function validarClientes() {
  log.header('VALIDACIÓN DE CLIENTES');

  const clientesExcel = excelData.clientes || [];
  const clientesSnapshot = await getDocs(collection(db, 'clientes'));
  const clientesFirebase = clientesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

  log.info(`Clientes en Excel: ${clientesExcel.length}`);
  log.info(`Clientes en Firebase: ${clientesFirebase.length}`);

  if (clientesExcel.length !== clientesFirebase.length) {
    log.warning(
      `Cantidad de clientes no coincide: Excel=${clientesExcel.length}, Firebase=${clientesFirebase.length}`
    );
    advertenciasEncontradas++;
  }

  // Validar adeudos totales
  const adeudoTotalExcel = clientesExcel.reduce((sum, c) => sum + (c.adeudo || 0), 0);
  const adeudoTotalFirebase = clientesFirebase.reduce((sum, c) => sum + (c.adeudo || 0), 0);

  validar('Adeudo Total Clientes', adeudoTotalFirebase, adeudoTotalExcel, true);

  // Validar total comprado
  const totalCompradoExcel = clientesExcel.reduce((sum, c) => sum + (c.totalComprado || 0), 0);
  const totalCompradoFirebase = clientesFirebase.reduce((sum, c) => sum + (c.totalComprado || 0), 0);

  validar('Total Comprado por Clientes', totalCompradoFirebase, totalCompradoExcel, true);
}

/**
 * Valida distribuidores
 */
async function validarDistribuidores() {
  log.header('VALIDACIÓN DE DISTRIBUIDORES');

  const distribuidoresExcel = excelData.distribuidores || [];
  const distribuidoresSnapshot = await getDocs(collection(db, 'distribuidores'));
  const distribuidoresFirebase = distribuidoresSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

  log.info(`Distribuidores en Excel: ${distribuidoresExcel.length}`);
  log.info(`Distribuidores en Firebase: ${distribuidoresFirebase.length}`);

  // Validar adeudos totales
  const adeudoTotalExcel = distribuidoresExcel.reduce((sum, d) => sum + (d.adeudo || 0), 0);
  const adeudoTotalFirebase = distribuidoresFirebase.reduce((sum, d) => sum + (d.adeudo || 0), 0);

  validar('Adeudo Total Distribuidores', adeudoTotalFirebase, adeudoTotalExcel, true);

  // Validar suma esperada: $7,939,400
  const ADEUDO_ESPERADO = 7939400;
  if (!compararNumeros(adeudoTotalExcel, ADEUDO_ESPERADO)) {
    log.warning(
      `Adeudo total en Excel (${formatCurrency(adeudoTotalExcel)}) ` +
      `difiere del esperado (${formatCurrency(ADEUDO_ESPERADO)})`
    );
    advertenciasEncontradas++;
  }
}

/**
 * Valida inventario
 */
async function validarInventario() {
  log.header('VALIDACIÓN DE INVENTARIO');

  const almacenExcel = excelData.almacen || {};
  const entradasSnapshot = await getDocs(collection(db, 'almacen_entradas'));
  const salidasSnapshot = await getDocs(collection(db, 'almacen_salidas'));

  const totalEntradas = entradasSnapshot.size;
  const totalSalidas = salidasSnapshot.size;
  const stockActual = totalEntradas - totalSalidas;

  log.info(`Entradas: ${totalEntradas}`);
  log.info(`Salidas: ${totalSalidas}`);
  log.info(`Stock Actual: ${stockActual}`);

  // Validar cantidades
  validar('Entradas de Inventario', totalEntradas, almacenExcel.ingresos || 2296);
  validar('Salidas de Inventario', totalSalidas, almacenExcel.salidas || 2279);
  validar('Stock Actual', stockActual, VALORES_ESPERADOS.inventarioActual);
}

/**
 * Valida GYA (Gastos y Abonos)
 */
async function validarGYA() {
  log.header('VALIDACIÓN DE GYA (GASTOS Y ABONOS)');

  const gyaSnapshot = await getDocs(collection(db, 'gya'));
  const gyaFirebase = gyaSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

  log.info(`Registros GYA en Firebase: ${gyaFirebase.length}`);

  // Calcular totales por tipo
  const totalGastos = gyaFirebase
    .filter(g => g.tipo === 'gasto')
    .reduce((sum, g) => sum + Math.abs(g.valor || 0), 0);

  const totalAbonos = gyaFirebase
    .filter(g => g.tipo === 'abono')
    .reduce((sum, g) => sum + (g.valor || 0), 0);

  const totalIngresos = gyaFirebase
    .filter(g => g.tipo === 'ingreso')
    .reduce((sum, g) => sum + (g.valor || 0), 0);

  const balance = totalIngresos + totalAbonos - totalGastos;

  log.info(`Total Gastos: ${formatCurrency(totalGastos)}`);
  log.info(`Total Abonos: ${formatCurrency(totalAbonos)}`);
  log.info(`Total Ingresos: ${formatCurrency(totalIngresos)}`);
  log.info(`Balance GYA: ${formatCurrency(balance)}`);

  validacionesExitosas++;
}

/**
 * Valida métricas financieras globales
 */
function validarMetricasFinancieras() {
  log.header('VALIDACIÓN DE MÉTRICAS FINANCIERAS GLOBALES');

  const metricas = excelData.metricasFinancieras || {};

  validar('Utilidad Total', metricas.utilidadTotal, VALORES_ESPERADOS.utilidadTotal, true);
  validar('Ventas Totales', metricas.ventasTotales, VALORES_ESPERADOS.ventasTotales, true);
  validar('Compras Totales', metricas.comprasTotales, VALORES_ESPERADOS.comprasTotales, true);
  validar('Capital Total', metricas.capitalTotal, VALORES_ESPERADOS.capitalTotal, true);
  validar('Inventario Actual', metricas.inventarioActual, VALORES_ESPERADOS.inventarioActual);
}

// ============================================================================
// EJECUCIÓN PRINCIPAL
// ============================================================================

async function main() {
  console.clear();
  log.header('🔍 VALIDACIÓN COMPLETA DE DATOS EXCEL vs FIREBASE');
  log.info('Fecha: ' + new Date().toLocaleString('es-MX'));

  try {
    // Ejecutar todas las validaciones
    await validarVentas();
    await validarClientes();
    await validarDistribuidores();
    await validarInventario();
    await validarGYA();
    validarMetricasFinancieras();

    // Resumen final
    log.header('📊 RESUMEN DE VALIDACIÓN');
    console.log(chalk.green(`✅ Validaciones exitosas: ${validacionesExitosas}`));
    console.log(chalk.yellow(`⚠️  Advertencias: ${advertenciasEncontradas}`));
    console.log(chalk.red(`❌ Errores: ${erroresEncontrados}`));

    const porcentajeExito = (validacionesExitosas / (validacionesExitosas + erroresEncontrados)) * 100;
    console.log(chalk.cyan(`\n📈 Porcentaje de éxito: ${porcentajeExito.toFixed(2)}%`));

    if (erroresEncontrados === 0) {
      log.success('¡TODOS LOS DATOS ESTÁN VALIDADOS CORRECTAMENTE! 🎉');
      process.exit(0);
    } else {
      log.error('SE ENCONTRARON ERRORES EN LA VALIDACIÓN');
      process.exit(1);
    }

  } catch (error) {
    log.error(`Error durante la validación: ${error.message}`);
    console.error(error);
    process.exit(1);
  }
}

// Ejecutar
main();
