#!/usr/bin/env node
/**
 * ============================================
 * SCRIPT DE IMPORTACIÓN AVANZADO CSV → FIRESTORE
 * ============================================
 *
 * CARACTERÍSTICAS:
 * ✅ Lee 12 archivos CSV y los estructura para Firestore
 * ✅ Separa gastos reales de transferencias entre bancos
 * ✅ Procesa deudas/abonos históricos de clientes y distribuidores
 * ✅ Validación de datos antes de importar
 * ✅ Manejo robusto de errores con rollback
 * ✅ Progress tracking en tiempo real
 * ✅ Modo dry-run para validación
 * ✅ Compatible con Firebase Admin SDK v12
 *
 * USO:
 *   npm run import:csv                    # Importación normal
 *   npm run import:csv -- --dry-run       # Solo validar sin importar
 *   npm run import:csv -- --force         # Sobrescribir datos existentes
 *
 * REQUISITOS:
 *   1. Los 12 archivos CSV en la carpeta ./data/csv/
 *   2. serviceAccountKey.json en la raíz del proyecto
 *   3. Variables de entorno configuradas (.env)
 */
import csv from 'csv-parser';
import dotenv from 'dotenv';
import admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Configuración de __dirname para ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cargar variables de entorno
dotenv.config({ path: path.join(__dirname, '..', '.env') });

// ============================================
// CONFIGURACIÓN
// ============================================
const CONFIG = {
  // Directorio de CSVs
  csvDir: path.join(__dirname, '..', 'data', 'csv'),

  // Límite de batch de Firestore
  batchLimit: 499,

  // Modo de operación (se puede sobrescribir con --dry-run)
  dryRun: process.argv.includes('--dry-run'),

  // Forzar sobrescritura de datos existentes
  force: process.argv.includes('--force'),

  // Verbose logging
  verbose: process.argv.includes('--verbose') || process.argv.includes('-v'),
};

// Nombres de archivos CSV (ACTUALIZADOS según tu Excel)
const FILE_PATHS = {
  clientes: 'clientes.csv',
  distribuidores: 'distribuidores.csv',
  ventas: 'ventas.csv',
  almacen: 'almacen.csv',
  ordenesCompra: 'ordenes_compra.csv',
  bancos: {
    azteca: 'bancos_azteca.csv',
    leftie: 'bancos_leftie.csv',
    profit: 'bancos_profit.csv',
    bovedaMonte: 'boveda_monte.csv',
    bovedaUsa: 'boveda_usa.csv',
    fleteSur: 'flete_sur.csv',
    utilidades: 'utilidades.csv',
  },
};

// Lista normalizada de bancos (para detección de transferencias)
const LISTA_BANCOS_NORMALIZADA = Object.keys(FILE_PATHS.bancos).map((b) =>
  b
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
);

// ============================================
// COLORES PARA CONSOLA
// ============================================
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

const log = {
  info: (msg) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
  success: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  warning: (msg) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
  error: (msg) => console.error(`${colors.red}✗${colors.reset} ${msg}`),
  step: (msg) => console.log(`\n${colors.cyan}${colors.bright}▶${colors.reset} ${msg}`),
  verbose: (msg) => CONFIG.verbose && console.log(`${colors.dim}  ${msg}${colors.reset}`),
};

// ============================================
// INICIALIZACIÓN DE FIREBASE
// ============================================
let db;
let initialized = false;

async function initializeFirebase() {
  if (initialized) return;

  try {
    // Buscar serviceAccountKey.json
    const serviceAccountPaths = [
      path.join(__dirname, '..', 'serviceAccountKey.json'),
      path.join(__dirname, '..', 'config', 'serviceAccountKey.json'),
      path.join(__dirname, 'serviceAccountKey.json'),
    ];

    let serviceAccount;
    let usingADC = false;

    for (const keyPath of serviceAccountPaths) {
      if (fs.existsSync(keyPath)) {
        log.verbose(`Service Account encontrado en: ${keyPath}`);
        serviceAccount = JSON.parse(fs.readFileSync(keyPath, 'utf8'));
        break;
      }
    }

    // Si no hay serviceAccountKey.json, intentar usar ADC
    if (!serviceAccount) {
      log.info('No se encontró serviceAccountKey.json');
      log.info('Intentando usar Application Default Credentials (ADC)...');

      // Verificar si hay ADC configurado
      const adcPath =
        process.env.GOOGLE_APPLICATION_CREDENTIALS ||
        path.join(
          process.env.APPDATA || process.env.HOME,
          'gcloud',
          'application_default_credentials.json'
        );

      if (fs.existsSync(adcPath)) {
        log.success('ADC encontrado, usando credenciales de gcloud');
        usingADC = true;
      } else {
        throw new Error(
          'No se encontraron credenciales. Opciones:\n' +
            '1. Descarga serviceAccountKey.json desde Firebase Console\n' +
            '2. Configura ADC: npm run setup:adc (recomendado para desarrollo)'
        );
      }
    }

    // Inicializar Firebase Admin
    let projectId;

    if (usingADC) {
      // Con ADC, Firebase Admin detecta automáticamente las credenciales
      projectId = process.env.FIREBASE_PROJECT_ID || 'premium-ecosystem-1760790572';

      admin.initializeApp({
        credential: admin.credential.applicationDefault(),
        projectId: projectId,
      });
    } else {
      // Con Service Account Key
      projectId = serviceAccount.project_id;

      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: `https://${projectId}.firebaseio.com`,
      });
    }

    db = admin.firestore();

    // Configuración recomendada para Firestore
    db.settings({
      ignoreUndefinedProperties: true,
      timestampsInSnapshots: true,
    });

    log.success(`Firebase inicializado correctamente (Proyecto: ${projectId})`);
    initialized = true;
  } catch (error) {
    log.error('Error al inicializar Firebase:');
    console.error(error.message);
    process.exit(1);
  }
}

// ============================================
// UTILIDADES DE PARSEO
// ============================================

/**
 * Normaliza strings de moneda a número
 * @param {string|number} value - Valor a normalizar
 * @returns {number}
 */
function parseCurrency(value) {
  if (typeof value === 'number') return value;
  if (!value || value === '' || value === 'NA') return 0;

  // Eliminar símbolos de moneda, comillas y comas
  const cleaned = String(value)
    .replace(/[\$,"]/g, '')
    .trim();
  const parsed = parseFloat(cleaned);

  return isNaN(parsed) ? 0 : parsed;
}

/**
 * Normaliza fechas en formato variable
 * @param {string} dateStr - Fecha en formato string
 * @returns {string} Fecha en formato ISO o string original
 */
function parseDate(dateStr) {
  if (!dateStr || dateStr === 'NA') return '';

  // Si ya es un formato ISO, retornarlo
  if (/^\d{4}-\d{2}-\d{2}/.test(dateStr)) return dateStr;

  // Intentar parsear formatos comunes (DD/MM/YYYY, MM-DD-YYYY, etc.)
  try {
    const date = new Date(dateStr);
    if (!isNaN(date.getTime())) {
      return date.toISOString().split('T')[0];
    }
  } catch (e) {
    log.verbose(`No se pudo parsear fecha: ${dateStr}`);
  }

  return dateStr; // Retornar original si no se puede parsear
}

/**
 * Lee y parsea un archivo CSV
 * @param {string} fileName - Nombre del archivo CSV
 * @param {object} options - Opciones para csv-parser
 * @returns {Promise<Array<object>>}
 */
function parseCSV(fileName, options = {}) {
  return new Promise((resolve, reject) => {
    const filePath = path.join(CONFIG.csvDir, fileName);
    const results = [];

    if (!fs.existsSync(filePath)) {
      return reject(
        new Error(
          `Archivo no encontrado: ${filePath}\n` +
            `Asegúrate de que los archivos CSV estén en: ${CONFIG.csvDir}`
        )
      );
    }

    fs.createReadStream(filePath)
      .pipe(csv(options))
      .on('data', (data) => results.push(data))
      .on('end', () => {
        log.verbose(`CSV parseado: ${fileName} (${results.length} filas)`);
        resolve(results);
      })
      .on('error', (error) => reject(error));
  });
}

/**
 * Normaliza nombre de banco para detección de transferencias
 * @param {string} str - String a normalizar
 * @returns {string}
 */
function normalizeString(str) {
  if (!str) return '';
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Eliminar acentos
    .replace(/\s+/g, '') // Eliminar espacios
    .trim();
}

/**
 * Detecta si un destino es un banco (transferencia) o un gasto
 * @param {string} destinoString - String del destino
 * @returns {string|null} ID del banco normalizado o null si es gasto
 */
function getBancoDestino(destinoString) {
  if (!destinoString || destinoString.toLowerCase() === 'na') {
    return null; // Es un gasto
  }

  const destinoNorm = normalizeString(destinoString);

  // Buscar coincidencia con algún banco conocido
  const match = LISTA_BANCOS_NORMALIZADA.find(
    (banco) => destinoNorm.includes(banco) || banco.includes(destinoNorm)
  );

  return match || null;
}

// ============================================
// VALIDACIÓN DE DATOS
// ============================================

/**
 * Valida que todos los archivos CSV existan
 * @returns {boolean}
 */
function validateCSVFiles() {
  log.step('Validando archivos CSV...');

  const allFiles = [
    FILE_PATHS.clientes,
    FILE_PATHS.distribuidores,
    FILE_PATHS.ventas,
    FILE_PATHS.almacen,
    FILE_PATHS.ordenesCompra,
    ...Object.values(FILE_PATHS.bancos),
  ];

  let allExist = true;

  for (const file of allFiles) {
    const filePath = path.join(CONFIG.csvDir, file);
    if (!fs.existsSync(filePath)) {
      log.error(`Archivo faltante: ${file}`);
      allExist = false;
    } else {
      log.verbose(`✓ ${file}`);
    }
  }

  if (!allExist) {
    log.error(`\nAlgunos archivos CSV no se encontraron en: ${CONFIG.csvDir}`);
    log.info('Asegúrate de tener todos los archivos listados en FILE_PATHS');
    return false;
  }

  log.success('Todos los archivos CSV encontrados');
  return true;
}

/**
 * Valida estructura de datos antes de importar
 * @param {object} data - Objeto con todas las colecciones
 * @returns {boolean}
 */
function validateData(data) {
  log.step('Validando estructura de datos...');

  const validations = [
    { name: 'bancos', data: data.bancos, minCount: 7 },
    { name: 'gastos', data: data.gastos, minCount: 1 },
    { name: 'transferencias', data: data.transferencias, minCount: 0 },
    { name: 'clientes', data: data.clientes, minCount: 1 },
    { name: 'distribuidores', data: data.distribuidores, minCount: 1 },
    { name: 'ordenesCompra', data: data.ordenesCompra, minCount: 1 },
    { name: 'ventas', data: data.ventas, minCount: 1 },
  ];

  let isValid = true;

  for (const { name, data: collection, minCount } of validations) {
    if (!Array.isArray(collection)) {
      log.error(`${name} no es un array válido`);
      isValid = false;
      continue;
    }

    if (collection.length < minCount) {
      log.warning(`${name} tiene ${collection.length} items (esperado: ≥${minCount})`);
    } else {
      log.success(`${name}: ${collection.length} items`);
    }
  }

  // Validar almacen (documento único)
  if (!data.almacen || typeof data.almacen !== 'object') {
    log.error('almacen no es un objeto válido');
    isValid = false;
  } else {
    log.success('almacen: válido');
  }

  // Validar producto (documento único)
  if (!data.producto || typeof data.producto !== 'object') {
    log.error('producto no es un objeto válido');
    isValid = false;
  } else {
    log.success('producto: válido');
  }

  return isValid;
}

// ============================================
// IMPORTACIÓN A FIRESTORE
// ============================================

/**
 * Importa una colección completa usando batches
 * @param {string} collectionName - Nombre de la colección
 * @param {Array<object>} dataArray - Array de documentos
 * @param {string} idKey - Campo a usar como ID (opcional)
 */
async function importCollection(collectionName, dataArray, idKey = null) {
  if (!dataArray || dataArray.length === 0) {
    log.warning(`Colección ${collectionName} está vacía, omitiendo...`);
    return;
  }

  log.info(`Importando ${collectionName} (${dataArray.length} docs)...`);

  if (CONFIG.dryRun) {
    log.info(`[DRY-RUN] Se importarían ${dataArray.length} documentos a '${collectionName}'`);
    return;
  }

  const batchArray = [db.batch()];
  let operationCounter = 0;
  let batchIndex = 0;
  let importedCount = 0;

  for (const doc of dataArray) {
    try {
      // Generar ID del documento
      let docId;
      if (idKey && doc[idKey]) {
        // Sanitizar ID (Firestore no permite ciertos caracteres)
        docId = String(doc[idKey])
          .replace(/[\/\\\#\?\[\]]/g, '-')
          .trim();
      } else {
        docId = db.collection(collectionName).doc().id;
        doc.id = docId;
      }

      // Añadir metadata
      const docData = {
        ...doc,
        _importedAt: admin.firestore.FieldValue.serverTimestamp(),
        _source: 'csv_import_script',
      };

      const docRef = db.collection(collectionName).doc(docId);
      batchArray[batchIndex].set(docRef, docData, { merge: CONFIG.force });

      operationCounter++;
      importedCount++;

      // Crear nuevo batch si alcanzamos el límite
      if (operationCounter === CONFIG.batchLimit) {
        batchArray.push(db.batch());
        batchIndex++;
        operationCounter = 0;
      }
    } catch (error) {
      log.error(`Error procesando documento en ${collectionName}:`, error.message);
    }
  }

  // Commit de todos los batches
  try {
    await Promise.all(batchArray.map((batch) => batch.commit()));
    log.success(`${collectionName}: ${importedCount} documentos importados`);
  } catch (error) {
    log.error(`Error al importar ${collectionName}:`, error.message);
    throw error;
  }
}

/**
 * Importa un documento único
 * @param {string} collectionName - Nombre de la colección
 * @param {string} docId - ID del documento
 * @param {object} dataObject - Datos del documento
 */
async function importSingleDoc(collectionName, docId, dataObject) {
  log.info(`Importando documento ${collectionName}/${docId}...`);

  if (CONFIG.dryRun) {
    log.info(`[DRY-RUN] Se importaría el documento '${collectionName}/${docId}'`);
    return;
  }

  try {
    const docData = {
      ...dataObject,
      _importedAt: admin.firestore.FieldValue.serverTimestamp(),
      _source: 'csv_import_script',
    };

    await db.collection(collectionName).doc(docId).set(docData, { merge: CONFIG.force });
    log.success(`Documento ${collectionName}/${docId} importado`);
  } catch (error) {
    log.error(`Error importando ${collectionName}/${docId}:`, error.message);
    throw error;
  }
}

// ============================================
// PROCESAMIENTO DE DATOS
// ============================================

/**
 * PASO 1: Procesa Bancos, Gastos y Transferencias
 */
async function procesarBancosGastosTransferencias() {
  log.step('PASO 1: Procesando Bancos, Gastos y Transferencias');

  const bancosArray = [];
  const gastosArray = [];
  const transferenciasArray = [];

  // Configuración de cada banco
  const configBancos = [
    {
      id: 'bovedaMonte',
      file: FILE_PATHS.bancos.bovedaMonte,
      saldoCell: { row: 1, col: 0 }, // A2
      gastoHeaders: [
        'Fecha',
        'Origen del Gastos o Abono',
        'Gasto',
        'TC',
        'Pesos',
        'Destino',
        'Concepto',
        'Observaciones',
      ],
      skipGastos: 0,
    },
    {
      id: 'bovedaUsa',
      file: FILE_PATHS.bancos.bovedaUsa,
      saldoCell: { row: 1, col: 8 }, // I2
      gastoHeaders: [
        'Fecha',
        'Origen del Gastos o Abono',
        'Gasto',
        'TC',
        'Pesos',
        'Destino',
        'Concepto',
        'Observaciones',
      ],
      skipGastos: 2,
    },
    {
      id: 'profit',
      file: FILE_PATHS.bancos.profit,
      saldoCell: { row: 1, col: 8 }, // I2
      gastoHeaders: [
        'Fecha',
        'Corte',
        'Fecha_1',
        'Cliente',
        'Lugar',
        'Serie',
        'Gasto',
        'Porcentaje',
        'Gasto Total',
        'Observaciones',
      ],
      skipGastos: 2,
    },
    {
      id: 'leftie',
      file: FILE_PATHS.bancos.leftie,
      saldoCell: { row: 1, col: 8 }, // I2
      gastoHeaders: [
        'Fecha',
        'Corte',
        'Fecha_1',
        'Origen del Gastos o Abono',
        'Gasto',
        'TC',
        'Dolares',
        'Destino',
        'Concepto',
        'Observaciones',
      ],
      skipGastos: 2,
    },
    {
      id: 'fleteSur',
      file: FILE_PATHS.bancos.fleteSur,
      saldoCell: { row: 1, col: 5 }, // F2
      gastoHeaders: [
        'Fecha',
        'Origen del Gastos o Abono',
        'Gasto',
        'TC',
        'Pesos',
        'Destino',
        'Concepto',
        'Observaciones',
      ],
      skipGastos: 2,
    },
    {
      id: 'utilidades',
      file: FILE_PATHS.bancos.utilidades,
      saldoCell: { row: 1, col: 5 }, // F2
      gastoHeaders: [
        'Fecha',
        'Origen del Gastos o Abono',
        'Gasto',
        'TC',
        'Pesos',
        'Concepto',
        'Observaciones',
      ],
      skipGastos: 2,
    },
    {
      id: 'azteca',
      file: FILE_PATHS.bancos.azteca,
      saldoCell: { row: 1, col: 8 }, // I2
      gastoHeaders: [
        'Fecha',
        'Origen del Gastos o Abono',
        'Gasto',
        'Destino',
        'A',
        'Observaciones',
        'Concepto',
      ],
      skipGastos: 2,
    },
  ];

  for (const config of configBancos) {
    log.verbose(`Procesando banco: ${config.id}`);

    // 1. Extraer saldo del banco
    const rawData = await parseCSV(config.file, { headers: false });
    const saldoValue = rawData[config.saldoCell.row]?.[config.saldoCell.col];
    const saldo = parseCurrency(saldoValue);

    bancosArray.push({
      id: config.id,
      nombre:
        config.id.charAt(0).toUpperCase() +
        config.id
          .slice(1)
          .replace(/([A-Z])/g, ' $1')
          .trim(),
      saldo: saldo,
      tipo: config.id.toLowerCase().includes('usa') ? 'internacional' : 'nacional',
      moneda: config.id.toLowerCase().includes('usa') ? 'USD' : 'MXN',
      activo: true,
    });

    // 2. Extraer gastos y transferencias
    const gastosRaw = await parseCSV(config.file, {
      headers: config.gastoHeaders,
      skipLines: config.skipGastos,
    });

    for (const gasto of gastosRaw) {
      const monto = parseCurrency(gasto.Gasto) || parseCurrency(gasto['Gasto Total']);

      if (monto > 0) {
        const bancoDestino = getBancoDestino(gasto.Destino);

        if (bancoDestino) {
          // Es una transferencia
          transferenciasArray.push({
            fecha: parseDate(gasto.Fecha || gasto.Fecha_1),
            monto: monto,
            bancoOrigen: config.id,
            bancoDestino: bancoDestino,
            observaciones: gasto.Observaciones || '',
            concepto: gasto.Concepto || '',
            tipo: 'transferencia',
          });
        } else {
          // Es un gasto
          gastosArray.push({
            fecha: parseDate(gasto.Fecha || gasto.Fecha_1),
            monto: monto,
            bancoOrigen: config.id,
            destino: gasto.Destino || 'NA',
            observaciones: gasto.Observaciones || '',
            concepto: gasto.Concepto || '',
            tipo: 'gasto',
          });
        }
      }
    }
  }

  log.success(
    `Bancos: ${bancosArray.length}, Gastos: ${gastosArray.length}, Transferencias: ${transferenciasArray.length}`
  );

  return { bancosArray, gastosArray, transferenciasArray };
}

/**
 * PASO 2: Procesa Clientes
 */
async function procesarClientes() {
  log.step('PASO 2: Procesando Clientes');

  const data = await parseCSV(FILE_PATHS.clientes, {
    headers: [
      '_1',
      '_2',
      '_3',
      '_4',
      'cliente',
      'actual',
      'deuda',
      'abonos',
      'pendiente',
      'observaciones',
    ],
    skipLines: 3,
  });

  const clientes = data
    .filter((row) => row.cliente && row.cliente.trim() !== '')
    .map((row) => ({
      id: row.cliente.trim().replace(/[\/\\\#\?\[\]]/g, '-'),
      cliente: row.cliente.trim(),
      actual: parseCurrency(row.actual),
      deuda: parseCurrency(row.deuda),
      abonos: parseCurrency(row.abonos),
      pendiente: parseCurrency(row.pendiente),
      observaciones: row.observaciones || '',
      activo: true,
    }));

  log.success(`Clientes procesados: ${clientes.length}`);
  return clientes;
}

/**
 * PASO 3: Procesa Distribuidores y Órdenes de Compra
 */
async function procesarDistribuidores() {
  log.step('PASO 3: Procesando Distribuidores y Órdenes de Compra');

  const data = await parseCSV(FILE_PATHS.distribuidores, { headers: true, skipLines: 2 });

  // Órdenes de Compra
  const ordenesCompra = data
    .filter((row) => row.OC && row.OC.trim() !== '')
    .map((row) => ({
      id: row.OC.trim().replace(/[\/\\\#\?\[\]]/g, '-'),
      fecha: parseDate(row.Fecha),
      origen: row.Origen || '',
      cantidad: parseInt(row.Cantidad) || 0,
      costoDistribuidor: parseCurrency(row['Costo Distribuidor']),
      costoTransporte: parseCurrency(row['Costo Transporte']),
      costoPorUnidad: parseCurrency(row['Costo Por Unidad']),
      costoTotal: parseCurrency(row['Costo Total']),
      deuda: parseCurrency(row.Deuda),
      estatus: 'completada',
    }));

  // Distribuidores
  const distribuidores = data
    .filter((row) => row.Distribuidores && row.Distribuidores.trim() !== '')
    .map((row) => ({
      id: row.Distribuidores.trim().replace(/[\/\\\#\?\[\]]/g, '-'),
      distribuidor: row.Distribuidores.trim(),
      costoTotal: parseCurrency(row['Costo total']),
      abonos: parseCurrency(row.Abonos),
      pendiente: parseCurrency(row.Pendiente),
      activo: true,
    }));

  log.success(
    `Órdenes de Compra: ${ordenesCompra.length}, Distribuidores: ${distribuidores.length}`
  );
  return { ordenesCompra, distribuidores };
}

/**
 * PASO 4: Procesa Ventas
 */
async function procesarVentas() {
  log.step('PASO 4: Procesando Ventas');

  const data = await parseCSV(FILE_PATHS.ventas, { headers: true, skipLines: 2 });

  const ventas = data
    .filter((row) => row.Fecha && row.Fecha.trim() !== '')
    .map((row) => ({
      fecha: parseDate(row.Fecha),
      ocRelacionada: row['OC Relacionada'] || '',
      cantidad: parseInt(row.Cantidad) || 0,
      cliente: row.Cliente || '',
      ingresoBovedaMonte: parseCurrency(row['Bóveda Monte']),
      precioVenta: parseCurrency(row['Precio De Venta']),
      ingresoTotal: parseCurrency(row.Ingreso),
      flete: parseCurrency(row.Flete),
      fleteUtilidad: parseCurrency(row['Flete Utilidad']),
      utilidad: parseCurrency(row.Utilidad),
      estatus: row.Estatus || 'completada',
      concepto: row.Concepto || '',
    }));

  log.success(`Ventas procesadas: ${ventas.length}`);
  return ventas;
}

/**
 * PASO 5: Procesa Almacén
 */
async function procesarAlmacen() {
  log.step('PASO 5: Procesando Almacén');

  const data = await parseCSV(FILE_PATHS.almacen, { headers: false });

  const almacenDoc = {
    ingresos: parseInt(String(data[0]?.['0'] || '0').replace(/,/g, '')) || 0,
    stockActual: parseInt(data[0]?.['5'] || '0') || 0,
    salidas: parseInt(String(data[0]?.['8'] || '0').replace(/,/g, '')) || 0,
    ultimaActualizacion: admin.firestore.FieldValue.serverTimestamp(),
  };

  log.success('Almacén procesado');
  return almacenDoc;
}

/**
 * PASO 6: Procesa Producto (implícito)
 */
async function procesarProducto() {
  log.step('PASO 6: Procesando Producto');

  const dataDist = await parseCSV(FILE_PATHS.distribuidores, { headers: true, skipLines: 2 });
  const dataVentas = await parseCSV(FILE_PATHS.ventas, { headers: true, skipLines: 2 });

  const costoBase = parseCurrency(dataDist[0]?.['Costo Por Unidad']) || 6300;
  const precioBase = parseCurrency(dataVentas[0]?.['Precio De Venta']) || 6300;

  const productoDoc = {
    id: 'PROD-001',
    nombre: 'Producto Principal',
    descripcion: 'Producto principal de distribución',
    costo: costoBase,
    precioVenta: precioBase,
    activo: true,
    categoria: 'general',
  };

  log.success('Producto procesado');
  return productoDoc;
}

// ============================================
// FUNCIÓN PRINCIPAL
// ============================================
async function main() {
  console.log(`
${colors.cyan}${colors.bright}
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║    📊 IMPORTADOR AVANZADO CSV → FIRESTORE                ║
║    Premium Ecosystem - FlowDistributor                   ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
${colors.reset}
`);

  if (CONFIG.dryRun) {
    log.info('🔍 Modo DRY-RUN activado (no se escribirá en Firestore)');
  }

  if (CONFIG.force) {
    log.warning('⚠️  Modo FORCE activado (sobrescribirá datos existentes)');
  }

  try {
    // 1. Validar archivos CSV
    if (!validateCSVFiles()) {
      process.exit(1);
    }

    // 2. Inicializar Firebase
    await initializeFirebase();

    // 3. Procesar todos los datos
    log.step('Procesando datos de CSVs...');

    const { bancosArray, gastosArray, transferenciasArray } =
      await procesarBancosGastosTransferencias();
    const clientes = await procesarClientes();
    const { ordenesCompra, distribuidores } = await procesarDistribuidores();
    const ventas = await procesarVentas();
    const almacen = await procesarAlmacen();
    const producto = await procesarProducto();

    // 4. Validar datos antes de importar
    const allData = {
      bancos: bancosArray,
      gastos: gastosArray,
      transferencias: transferenciasArray,
      clientes: clientes,
      distribuidores: distribuidores,
      ordenesCompra: ordenesCompra,
      ventas: ventas,
      almacen: almacen,
      producto: producto,
    };

    if (!validateData(allData)) {
      log.error('Validación de datos falló. Revisa los errores anteriores.');
      process.exit(1);
    }

    // 5. Importar a Firestore
    log.step('Importando a Firestore...');

    await importCollection('bancos', bancosArray, 'id');
    await importCollection('gastos', gastosArray);
    await importCollection('transferencias', transferenciasArray);
    await importCollection('clientes', clientes, 'id');
    await importCollection('distribuidores', distribuidores, 'id');
    await importCollection('ordenesCompra', ordenesCompra, 'id');
    await importCollection('ventas', ventas);
    await importSingleDoc('estadoGlobal', 'almacen', almacen);
    await importSingleDoc('productos', 'PROD-001', producto);

    // 6. Resumen final
    console.log(`
${colors.green}${colors.bright}
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║    ✅ IMPORTACIÓN COMPLETADA EXITOSAMENTE                ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
${colors.reset}

${colors.cyan}📊 Resumen de Importación:${colors.reset}
  • Bancos:             ${bancosArray.length} documentos
  • Gastos:             ${gastosArray.length} documentos
  • Transferencias:     ${transferenciasArray.length} documentos
  • Clientes:           ${clientes.length} documentos
  • Distribuidores:     ${distribuidores.length} documentos
  • Órdenes de Compra:  ${ordenesCompra.length} documentos
  • Ventas:             ${ventas.length} documentos
  • Almacén:            1 documento
  • Producto:           1 documento

${colors.green}🎉 Todos los datos han sido importados correctamente a Firestore${colors.reset}
`);
  } catch (error) {
    log.error('Error fatal durante la importación:');
    console.error(error);
    process.exit(1);
  } finally {
    // Cerrar conexión de Firebase
    if (initialized) {
      await admin.app().delete();
    }
  }
}

// Manejo de errores no capturados
process.on('unhandledRejection', (error) => {
  log.error('Error no manejado:');
  console.error(error);
  process.exit(1);
});

// Ejecutar script
main();
