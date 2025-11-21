#!/usr/bin/env node
/**
 * ============================================
 * SCRIPT DE IMPORTACIÓN JSON → FIRESTORE
 * ============================================
 *
 * Lee directamente desde los archivos JSON manuales en
 * src/apps/FlowDistributor/data y los importa a Firestore
 *
 * USO:
 *   npm run import:json                    # Importación normal
 *   npm run import:json -- --dry-run       # Solo validar sin importar
 *   npm run import:json -- --force         # Sobrescribir datos existentes
 */
import dotenv from 'dotenv';
import admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '..', '.env') });

// ============================================
// CONFIGURACIÓN
// ============================================
const CONFIG = {
  jsonDir: path.join(__dirname, '..', 'src', 'apps', 'FlowDistributor', 'data'),
  batchLimit: 499,
  dryRun: process.argv.includes('--dry-run'),
  force: process.argv.includes('--force'),
  verbose: process.argv.includes('--verbose') || process.argv.includes('-v'),
};

const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
};

const log = {
  info: (msg) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
  success: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  warning: (msg) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
  error: (msg) => console.error(`${colors.red}✗${colors.reset} ${msg}`),
  step: (msg) => console.log(`\n${colors.cyan}${colors.bright}▶${colors.reset} ${msg}`),
};

// ============================================
// INICIALIZACIÓN DE FIREBASE
// ============================================
let db;

async function initializeFirebase() {
  try {
    const serviceAccountPath = path.join(__dirname, '..', 'serviceAccountKey.json');
    let usingADC = false;

    if (!fs.existsSync(serviceAccountPath)) {
      log.info('No se encontró serviceAccountKey.json');
      log.info('Intentando usar Application Default Credentials (ADC)...');

      const adcPath = path.join(
        process.env.APPDATA || process.env.HOME,
        'gcloud',
        'application_default_credentials.json'
      );

      if (fs.existsSync(adcPath)) {
        log.success('ADC encontrado, usando credenciales de gcloud');
        usingADC = true;
      } else {
        throw new Error('No se encontraron credenciales. Ejecuta: npm run setup:adc');
      }
    }

    const projectId = process.env.FIREBASE_PROJECT_ID || 'premium-ecosystem-1760790572';

    if (usingADC) {
      admin.initializeApp({
        credential: admin.credential.applicationDefault(),
        projectId: projectId,
      });
    } else {
      const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: `https://${serviceAccount.project_id}.firebaseio.com`,
      });
    }

    db = admin.firestore();
    log.success(`Firebase inicializado correctamente (Proyecto: ${projectId})`);
  } catch (error) {
    log.error(`Error al inicializar Firebase: ${error.message}`);
    throw error;
  }
}

// ============================================
// FUNCIONES DE LECTURA DE JSON
// ============================================
function readJSON(filename) {
  const filePath = path.join(CONFIG.jsonDir, filename);

  if (!fs.existsSync(filePath)) {
    log.warning(`Archivo no encontrado: ${filename}`);
    return null;
  }

  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    log.error(`Error al leer ${filename}: ${error.message}`);
    return null;
  }
}

function extractArrayFromJSON(data, filename) {
  if (Array.isArray(data)) return data;

  const findArray = (obj) => {
    if (Array.isArray(obj)) return obj;

    if (typeof obj === 'object' && obj !== null) {
      for (const value of Object.values(obj)) {
        if (Array.isArray(value)) return value;

        if (typeof value === 'object') {
          const found = findArray(value);
          if (found) return found;
        }
      }
    }
    return null;
  };

  return findArray(data);
}

// ============================================
// PROCESAMIENTO DE DATOS
// ============================================
async function procesarDatos() {
  const data = {
    bancos: [],
    bancosRfActual: [],
    gastos: [],
    clientes: [],
    distribuidores: [],
    ordenesCompra: [],
    ventas: [],
    almacenIngresos: [],
    almacenRfActual: [],
    almacenSalidas: [],
    almacenStockDisponible: [],
    almacen: null,
  };

  log.step('Procesando datos de JSON...');

  // 1. Clientes
  const clientesData = readJSON('panel-clientes-manual.json');
  if (clientesData) {
    const clientesArray = extractArrayFromJSON(clientesData);
    if (clientesArray) {
      data.clientes = clientesArray.map((c, idx) => ({
        id: c.id || c.nombre || `cliente-${idx + 1}`,
        nombre: c.nombre || c.cliente || '',
        saldoPendiente: parseFloat(c.deuda || c.saldoPendiente || 0),
        totalPagado: parseFloat(c.abonos || c.totalPagado || 0),
        ultimaCompra: c.ultimaCompra || c.fecha || new Date().toISOString().split('T')[0],
        activo: c.activo !== false,
        telefono: c.telefono || '',
        email: c.email || '',
      }));
      log.success(`Clientes: ${data.clientes.length} registros`);
    }
  }

  // 2. Órdenes de Compra y Distribuidores
  const ordenesData = readJSON('panel-ordenes-compra-manual.json');
  if (ordenesData) {
    const ordenesArray = extractArrayFromJSON(ordenesData);
    if (ordenesArray) {
      data.ordenesCompra = ordenesArray.map((o) => ({
        id: o.id || `OC-${Date.now()}`,
        fecha: o.fecha || new Date().toISOString().split('T')[0],
        origen: o.origen || o.distribuidor || '',
        cantidad: parseInt(o.cantidad || 0),
        costoDistribuidor: parseFloat(o.costoDistribuidor || 0),
        costoTransporte: parseFloat(o.costoTransporte || 0),
        costoPorUnidad: parseFloat(o.costoPorUnidad || 0),
        stockActual: parseInt(o.stockActual || 0),
        costoTotal: parseFloat(o.costoTotal || 0),
        pagoDistribuidor: parseFloat(o.pagoDistribuidor || 0),
        deuda: parseFloat(o.deuda || 0),
      }));

      // Extraer distribuidores únicos
      const distribuidoresUnicos = [
        ...new Set(ordenesArray.map((o) => o.origen || o.distribuidor).filter(Boolean)),
      ];
      data.distribuidores = distribuidoresUnicos.map((nombre, idx) => ({
        id: `dist-${idx + 1}`,
        nombre: nombre,
        activo: true,
        telefono: '',
        email: '',
      }));

      log.success(`Órdenes de Compra: ${data.ordenesCompra.length} registros`);
      log.success(`Distribuidores: ${data.distribuidores.length} registros`);
    }
  }

  // 3. Ventas
  const ventasData = readJSON('panel-ventas-local-manual.json');
  if (ventasData) {
    const ventasArray = extractArrayFromJSON(ventasData);
    if (ventasArray) {
      data.ventas = ventasArray.map((v, idx) => ({
        id: v.id || `venta-${idx + 1}`,
        fecha: v.fecha || new Date().toISOString().split('T')[0],
        cliente: v.cliente || v.nombre || '',
        monto: parseFloat(v.monto || v.total || 0),
        cantidad: parseInt(v.cantidad || 1),
        precioUnitario: parseFloat(v.precioUnitario || v.precio || 0),
        metodo: v.metodo || v.metodoPago || 'efectivo',
        status: v.status || 'completada',
      }));
      log.success(`Ventas: ${data.ventas.length} registros`);
    }
  }

  // 4. Bancos y Transferencias
  const bancosFiles = {
    azteca: 'panel-azteca-manual.json',
    leftie: 'panel-leftie-manual.json',
    profit: 'panel-profit-manual.json',
    bovedaMonte: 'panel-boveda-monte-manual.json',
    bovedaUsa: 'panel-boveda-usa-manual.json',
    fleteSur: 'panel-fletes-manual.json',
    utilidades: 'panel-utilidades-manual.json',
  };

  for (const [banco, filename] of Object.entries(bancosFiles)) {
    const bancoData = readJSON(filename);
    if (bancoData) {
      // Obtener el objeto del banco (primer nivel)
      const bancoObj = bancoData[banco] || Object.values(bancoData)[0];

      if (bancoObj) {
        // Calcular saldo del banco
        const totalIngresos = parseFloat(bancoObj.ingresos || 0);
        const totalGastos = parseFloat(bancoObj.gastos || 0);
        const saldo = totalIngresos - totalGastos;

        // Agregar banco a la colección
        data.bancos.push({
          id: banco,
          nombre: banco.replace(/([A-Z])/g, ' $1').trim(),
          tipo: banco,
          saldo: saldo,
          totalIngresos: totalIngresos,
          totalGastos: totalGastos,
          rfActual: parseFloat(bancoObj.rfActual || 0),
          activo: true,
        });

        // Procesar INGRESOS del banco
        const ingresosList = bancoObj.ingresosList || [];
        ingresosList.forEach((ingreso, idx) => {
          if (ingreso.fecha || ingreso.ingreso) {
            data.gastos.push({
              id: `${banco}-ingreso-${idx + 1}`,
              fecha: ingreso.fecha || new Date().toISOString().split('T')[0],
              banco: banco,
              cliente: ingreso.cliente || '',
              concepto: ingreso.concepto || '',
              monto: parseFloat(ingreso.ingreso || 0),
              tc: parseFloat(ingreso.tc || 0),
              dolares: parseFloat(ingreso.dolares || 0),
              observaciones: ingreso.observaciones || '',
              tipo: 'ingreso',
              categoria: 'ingresos',
            });
          }
        });

        // Procesar RF ACTUAL del banco (tabla entre ingresos y gastos)
        const rfCortes = bancoObj.rfCortes || [];
        rfCortes.forEach((corte, idx) => {
          data.bancosRfActual.push({
            id: `${banco}-rf-${idx + 1}`,
            fecha: corte.fecha || new Date().toISOString().split('T')[0],
            banco: banco,
            corte: parseFloat(corte.corte || 0),
            tipo: 'corte',
          });
        });

        // Procesar GASTOS del banco
        const gastosList = bancoObj.gastosList || [];
        gastosList.forEach((gasto, idx) => {
          if (gasto.fecha || gasto.gasto) {
            data.gastos.push({
              id: `${banco}-gasto-${idx + 1}`,
              fecha: gasto.fecha || new Date().toISOString().split('T')[0],
              banco: banco,
              origen: gasto.origen || '',
              destino: gasto.destino || gasto.a || '',
              concepto: gasto.concepto || '',
              monto: parseFloat(gasto.gasto || 0),
              observaciones: gasto.observaciones || '',
              tipo: 'egreso',
              categoria: 'gastos',
            });
          }
        });

        log.info(
          `  ${banco}: ${ingresosList.length} ingresos + RF (${rfCortes.length} cortes) + ${gastosList.length} gastos`
        );
      }
    }
  }

  log.success(`Bancos: ${data.bancos.length} registros`);
  log.success(`Bancos RF Actual: ${data.bancosRfActual.length} registros`);
  log.success(`Gastos: ${data.gastos.length} registros`);

  // 5. Almacén con sus 4 tablas: ingresos, RF Actual (stock actual + cortes), salidas, stock disponible
  const almacenData = readJSON('panel-almacen-monte-manual.json');
  if (almacenData) {
    const almacenObj = almacenData.almacenMonte || Object.values(almacenData)[0];

    if (almacenObj) {
      const totalIngresos = parseInt(almacenObj.ingresos || 0);
      const totalSalidas = parseInt(almacenObj.salida || 0);
      const rfActual = parseInt(almacenObj.rfActual || 0);

      // Documento principal de almacén
      data.almacen = {
        id: 'almacen-monte',
        nombre: 'Almacén Monte',
        totalIngresos: totalIngresos,
        totalSalidas: totalSalidas,
        rfActual: rfActual,
        stockActual: rfActual,
        ultimaActualizacion: new Date().toISOString(),
      };

      // 1. INGRESOS del almacén (ordenesCompra)
      const ordenesCompra = almacenObj.ordenesCompra || [];
      ordenesCompra.forEach((orden, idx) => {
        data.almacenIngresos.push({
          id: orden.oc || `almacen-ingreso-${idx + 1}`,
          fecha: orden.cliente || new Date().toISOString().split('T')[0], // "cliente" es la fecha
          oc: orden.oc || '',
          distribuidor: orden.distribuidor || '',
          cantidad: parseInt(orden.cantidad || 0),
          tipo: 'ingreso',
        });
      });

      // 2. RF ACTUAL del almacén (stock actual + cortes)
      const rfCortes = almacenObj.rfCortes || [];
      rfCortes.forEach((corte, idx) => {
        data.almacenRfActual.push({
          id: `almacen-rf-${idx + 1}`,
          fecha: corte.fecha || new Date().toISOString().split('T')[0],
          corte: parseInt(corte.corte || 0),
          tipo: 'corte',
        });
      });

      // 3. SALIDAS del almacén
      const salidas = almacenObj.salidas || [];
      salidas.forEach((salida, idx) => {
        data.almacenSalidas.push({
          id: `almacen-salida-${idx + 1}`,
          fecha: salida.fecha || new Date().toISOString().split('T')[0],
          cliente: salida.cliente || '',
          cantidad: parseInt(salida.cantidad || 0),
          concepto: salida.concepto || '',
          observaciones: salida.observaciones || '',
          tipo: 'salida',
        });
      });

      // 4. STOCK DISPONIBLE - Productos que no se han vendido
      // Calculamos el stock disponible basado en ingresos - salidas por distribuidor
      const stockPorDistribuidor = {};

      // Sumar ingresos
      ordenesCompra.forEach((orden) => {
        const dist = orden.distribuidor || 'Sin distribuidor';
        if (!stockPorDistribuidor[dist]) {
          stockPorDistribuidor[dist] = { ingresos: 0, salidas: 0 };
        }
        stockPorDistribuidor[dist].ingresos += parseInt(orden.cantidad || 0);
      });

      // Restar salidas (distribuimos proporcionalmente)
      const totalIngresosCalc = Object.values(stockPorDistribuidor).reduce(
        (sum, d) => sum + d.ingresos,
        0
      );
      salidas.forEach((salida) => {
        const cantidadSalida = parseInt(salida.cantidad || 0);
        Object.keys(stockPorDistribuidor).forEach((dist) => {
          const proporcion = stockPorDistribuidor[dist].ingresos / totalIngresosCalc;
          stockPorDistribuidor[dist].salidas += Math.floor(cantidadSalida * proporcion);
        });
      });

      // Crear registros de stock disponible
      Object.entries(stockPorDistribuidor).forEach(([distribuidor, stock], idx) => {
        const disponible = stock.ingresos - stock.salidas;
        if (disponible > 0) {
          data.almacenStockDisponible.push({
            id: `stock-${idx + 1}`,
            distribuidor: distribuidor,
            cantidadIngresada: stock.ingresos,
            cantidadVendida: stock.salidas,
            disponible: disponible,
            ultimaActualizacion: new Date().toISOString(),
          });
        }
      });

      log.success(
        `Almacén: ${ordenesCompra.length} ingresos + RF (${rfCortes.length} cortes) + ${salidas.length} salidas + ${data.almacenStockDisponible.length} stocks`
      );
    }
  }

  return data;
}

// ============================================
// IMPORTACIÓN A FIRESTORE
// ============================================
async function importarAFirestore(data) {
  log.step('Importando a Firestore...');

  const collections = [
    { name: 'bancos', data: data.bancos },
    { name: 'bancosRfActual', data: data.bancosRfActual },
    { name: 'gastos', data: data.gastos },
    { name: 'clientes', data: data.clientes },
    { name: 'distribuidores', data: data.distribuidores },
    { name: 'ordenesCompra', data: data.ordenesCompra },
    { name: 'ventas', data: data.ventas },
    { name: 'almacenIngresos', data: data.almacenIngresos },
    { name: 'almacenRfActual', data: data.almacenRfActual },
    { name: 'almacenSalidas', data: data.almacenSalidas },
    { name: 'almacenStockDisponible', data: data.almacenStockDisponible },
  ];

  for (const { name, data: items } of collections) {
    if (!items || items.length === 0) {
      log.warning(`Colección ${name} está vacía, omitiendo...`);
      continue;
    }

    log.info(`Importando ${name} (${items.length} docs)...`);

    if (CONFIG.dryRun) {
      log.info(`[DRY-RUN] Se importarían ${items.length} documentos a '${name}'`);
      continue;
    }

    try {
      const batch = db.batch();

      for (const item of items) {
        const docRef = db.collection(name).doc(item.id || db.collection(name).doc().id);
        batch.set(docRef, item, { merge: !CONFIG.force });
      }

      await batch.commit();
      log.success(`${name}: ${items.length} documentos importados`);
    } catch (error) {
      log.error(`Error al importar ${name}: ${error.message}`);
      throw error;
    }
  }

  // Importar almacén como documento único
  if (data.almacen) {
    log.info('Importando documento estadoGlobal/almacen...');

    if (CONFIG.dryRun) {
      log.info("[DRY-RUN] Se importaría el documento 'estadoGlobal/almacen'");
    } else {
      await db
        .collection('estadoGlobal')
        .doc('almacen')
        .set(data.almacen, { merge: !CONFIG.force });
      log.success('Documento estadoGlobal/almacen importado');
    }
  }
}

// ============================================
// MAIN
// ============================================
async function main() {
  console.log('\n╔═══════════════════════════════════════════════════════════╗');
  console.log('║                                                           ║');
  console.log('║    📊 IMPORTADOR JSON → FIRESTORE                        ║');
  console.log('║    Premium Ecosystem - FlowDistributor                   ║');
  console.log('║                                                           ║');
  console.log('╚═══════════════════════════════════════════════════════════╝\n');

  if (CONFIG.dryRun) {
    log.info('🔍 Modo DRY-RUN activado (no se escribirá en Firestore)');
  }

  try {
    await initializeFirebase();
    const data = await procesarDatos();
    await importarAFirestore(data);

    console.log('\n╔═══════════════════════════════════════════════════════════╗');
    console.log('║                                                           ║');
    console.log('║    ✅ IMPORTACIÓN COMPLETADA EXITOSAMENTE                ║');
    console.log('║                                                           ║');
    console.log('╚═══════════════════════════════════════════════════════════╝\n');

    console.log('📊 Resumen de Importación:');
    console.log(`  • Bancos:                  ${data.bancos.length} documentos`);
    console.log(`  • Bancos RF Actual:        ${data.bancosRfActual.length} documentos`);
    console.log(`  • Gastos:                  ${data.gastos.length} documentos`);
    console.log(`  • Clientes:                ${data.clientes.length} documentos`);
    console.log(`  • Distribuidores:          ${data.distribuidores.length} documentos`);
    console.log(`  • Órdenes de Compra:       ${data.ordenesCompra.length} documentos`);
    console.log(`  • Ventas:                  ${data.ventas.length} documentos`);
    console.log(`  • Almacén:                 ${data.almacen ? '1 documento' : '0 documentos'}`);
    console.log(`  • Almacén Ingresos:        ${data.almacenIngresos.length} documentos`);
    console.log(`  • Almacén RF Actual:       ${data.almacenRfActual.length} documentos`);
    console.log(`  • Almacén Salidas:         ${data.almacenSalidas.length} documentos`);
    console.log(`  • Almacén Stock Disponible: ${data.almacenStockDisponible.length} documentos\n`);

    process.exit(0);
  } catch (error) {
    log.error(`Error fatal: ${error.message}`);
    console.error(error);
    process.exit(1);
  }
}

main();
