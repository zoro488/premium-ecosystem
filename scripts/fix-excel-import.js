#!/usr/bin/env node
/**
 * 🔧 CORRECTOR Y COMPLETADOR DE IMPORTACIÓN EXCEL → FIRESTORE
 *
 * Este script:
 * 1. Verifica datos actuales en Firestore
 * 2. Lee el Excel correctamente
 * 3. Compara y detecta faltantes/errores
 * 4. Corrige e importa datos faltantes
 */
import { initializeApp } from 'firebase/app';
import { collection, getDocs, getFirestore, serverTimestamp, writeBatch } from 'firebase/firestore';
import { readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import XLSX from 'xlsx';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuración Firebase
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY || 'AIzaSyCR7zKZJAzCEq-jBbfkLJxWaz98zuRCkX4',
  authDomain:
    process.env.VITE_FIREBASE_AUTH_DOMAIN || 'premium-ecosystem-1760790572.firebaseapp.com',
  projectId: process.env.VITE_FIREBASE_PROJECT_ID || 'premium-ecosystem-1760790572',
  storageBucket:
    process.env.VITE_FIREBASE_STORAGE_BUCKET || 'premium-ecosystem-1760790572.appspot.com',
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '1029840619477',
  appId: process.env.VITE_FIREBASE_APP_ID || '1:1029840619477:web:a7e5ad6f3536e0c3b516f8',
};

// Colores para terminal
const c = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  red: '\x1b[31m',
  magenta: '\x1b[35m',
};

const log = {
  title: (msg) => console.log(`\n${c.bright}${c.magenta}━━━ ${msg} ━━━${c.reset}\n`),
  section: (msg) => console.log(`\n${c.cyan}▸ ${msg}${c.reset}`),
  info: (msg) => console.log(`  ${c.blue}ℹ${c.reset} ${msg}`),
  success: (msg) => console.log(`  ${c.green}✓${c.reset} ${msg}`),
  warning: (msg) => console.log(`  ${c.yellow}⚠${c.reset} ${msg}`),
  error: (msg) => console.log(`  ${c.red}✗${c.reset} ${msg}`),
  data: (label, value) =>
    console.log(`    ${c.cyan}${label}:${c.reset} ${c.bright}${value}${c.reset}`),
};

// Inicializar Firebase
log.title('🔧 CORRECTOR DE IMPORTACIÓN EXCEL → FIRESTORE');
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
log.success('Firebase conectado');

// Ruta del Excel
const excelPath = join(dirname(__dirname), 'Administación_General.xlsx');

/**
 * PASO 1: Leer Excel correctamente
 */
async function leerExcel() {
  log.section('📖 PASO 1: Leyendo Excel');

  try {
    const buffer = readFileSync(excelPath);
    const workbook = XLSX.read(buffer, { type: 'buffer', cellDates: true });

    log.success(`Excel cargado: ${excelPath}`);
    log.data('Hojas encontradas', workbook.SheetNames.length);
    workbook.SheetNames.forEach((name) => log.info(`  • ${name}`));

    return workbook;
  } catch (error) {
    log.error(`Error leyendo Excel: ${error.message}`);
    throw error;
  }
}

/**
 * PASO 2: Verificar datos en Firestore
 */
async function verificarFirestore() {
  log.section('🔍 PASO 2: Verificando Firestore');

  const colecciones = [
    'clientes',
    'proveedores',
    'bancos',
    'compras',
    'ventas',
    'distribuidores',
    'paneles',
    'gastosAbonos',
    'almacenMovimientos',
    'movimientosBancarios',
  ];

  const stats = {};

  for (const col of colecciones) {
    try {
      const snapshot = await getDocs(collection(db, col));
      stats[col] = snapshot.size;
      log.data(col, `${snapshot.size} documentos`);
    } catch (error) {
      log.error(`Error en ${col}: ${error.message}`);
      stats[col] = 0;
    }
  }

  return stats;
}

/**
 * PASO 3: Mapear hojas del Excel a colecciones
 */
const MAPEO_HOJAS = {
  CLIENTES: { coleccion: 'clientes', procesador: procesarClientes },
  PROVEEDORES: { coleccion: 'proveedores', procesador: procesarProveedores },
  BANCOS: { coleccion: 'bancos', procesador: procesarBancos },
  'ORDENES DE COMPRA': { coleccion: 'compras', procesador: procesarCompras },
  'VENTAS LOCALES': { coleccion: 'ventas', procesador: procesarVentas },
  DISTRIBUIDORES: { coleccion: 'distribuidores', procesador: procesarDistribuidores },
  PANELES: { coleccion: 'paneles', procesador: procesarPaneles },
  'GASTOS Y ABONOS': { coleccion: 'gastosAbonos', procesador: procesarGastosAbonos },
  'MOVIMIENTOS ALMACEN': {
    coleccion: 'almacenMovimientos',
    procesador: procesarMovimientosAlmacen,
  },
  'MOVIMIENTOS BANCARIOS': {
    coleccion: 'movimientosBancarios',
    procesador: procesarMovimientosBancarios,
  },
};

/**
 * Procesadores de datos por tipo
 */
function procesarClientes(rows) {
  return rows
    .filter((row) => row.NOMBRE)
    .map((row, index) => ({
      id: `cliente_${Date.now()}_${index}`,
      nombre: row.NOMBRE || '',
      rfc: row.RFC || '',
      telefono: row.TELEFONO || row.TELÉFONO || '',
      email: row.EMAIL || row.CORREO || '',
      direccion: row.DIRECCIÓN || row.DIRECCION || '',
      ciudad: row.CIUDAD || '',
      estado: row.ESTADO || '',
      codigoPostal: row['CÓDIGO POSTAL'] || row.CP || '',
      activo: true,
      fechaCreacion: serverTimestamp(),
      fuente: 'excel_import',
    }));
}

function procesarProveedores(rows) {
  return rows
    .filter((row) => row.NOMBRE)
    .map((row, index) => ({
      id: `proveedor_${Date.now()}_${index}`,
      nombre: row.NOMBRE || '',
      rfc: row.RFC || '',
      contacto: row.CONTACTO || '',
      telefono: row.TELEFONO || row.TELÉFONO || '',
      email: row.EMAIL || row.CORREO || '',
      direccion: row.DIRECCIÓN || row.DIRECCION || '',
      ciudad: row.CIUDAD || '',
      estado: row.ESTADO || '',
      activo: true,
      fechaCreacion: serverTimestamp(),
      fuente: 'excel_import',
    }));
}

function procesarBancos(rows) {
  return rows
    .filter((row) => row.BANCO)
    .map((row, index) => ({
      id: `banco_${Date.now()}_${index}`,
      nombre: row.BANCO || '',
      numeroCuenta: row['NÚMERO DE CUENTA'] || row.CUENTA || '',
      tipo: row.TIPO || 'Corriente',
      saldo: parseFloat(row.SALDO || 0),
      moneda: row.MONEDA || 'MXN',
      activo: true,
      fechaCreacion: serverTimestamp(),
      fuente: 'excel_import',
    }));
}

function procesarCompras(rows) {
  return rows
    .filter((row) => row.FOLIO || row['ORDEN DE COMPRA'])
    .map((row, index) => ({
      id: `compra_${Date.now()}_${index}`,
      folio: row.FOLIO || row['ORDEN DE COMPRA'] || '',
      proveedorId: row.PROVEEDOR || '',
      fecha: parsearFecha(row.FECHA),
      subtotal: parseFloat(row.SUBTOTAL || 0),
      iva: parseFloat(row.IVA || 0),
      total: parseFloat(row.TOTAL || 0),
      estado: row.ESTADO || 'Pendiente',
      productos: [],
      fechaCreacion: serverTimestamp(),
      fuente: 'excel_import',
    }));
}

function procesarVentas(rows) {
  return rows
    .filter((row) => row.FOLIO)
    .map((row, index) => ({
      id: `venta_${Date.now()}_${index}`,
      folio: row.FOLIO || '',
      clienteId: row.CLIENTE || '',
      fecha: parsearFecha(row.FECHA),
      subtotal: parseFloat(row.SUBTOTAL || 0),
      iva: parseFloat(row.IVA || 0),
      total: parseFloat(row.TOTAL || 0),
      estado: row.ESTADO || 'Completada',
      productos: [],
      fechaCreacion: serverTimestamp(),
      fuente: 'excel_import',
    }));
}

function procesarDistribuidores(rows) {
  return rows
    .filter((row) => row.NOMBRE)
    .map((row, index) => ({
      id: `distribuidor_${Date.now()}_${index}`,
      nombre: row.NOMBRE || '',
      rfc: row.RFC || '',
      contacto: row.CONTACTO || '',
      telefono: row.TELEFONO || row.TELÉFONO || '',
      email: row.EMAIL || row.CORREO || '',
      zona: row.ZONA || '',
      activo: true,
      fechaCreacion: serverTimestamp(),
      fuente: 'excel_import',
    }));
}

function procesarPaneles(rows) {
  return rows
    .filter((row) => row.MODELO || row.PANEL)
    .map((row, index) => ({
      id: `panel_${Date.now()}_${index}`,
      modelo: row.MODELO || row.PANEL || '',
      marca: row.MARCA || '',
      potencia: parseFloat(row.POTENCIA || row.WATTS || 0),
      voltaje: parseFloat(row.VOLTAJE || row.VOLTAGE || 0),
      precio: parseFloat(row.PRECIO || 0),
      stock: parseInt(row.STOCK || row.EXISTENCIA || 0),
      activo: true,
      fechaCreacion: serverTimestamp(),
      fuente: 'excel_import',
    }));
}

function procesarGastosAbonos(rows) {
  return rows
    .filter((row) => row.CONCEPTO)
    .map((row, index) => ({
      id: `gya_${Date.now()}_${index}`,
      concepto: row.CONCEPTO || '',
      tipo: row.TIPO || 'Gasto',
      monto: parseFloat(row.MONTO || row.CANTIDAD || 0),
      fecha: parsearFecha(row.FECHA),
      bancoId: row.BANCO || '',
      categoria: row.CATEGORÍA || row.CATEGORIA || 'Operativo',
      fechaCreacion: serverTimestamp(),
      fuente: 'excel_import',
    }));
}

function procesarMovimientosAlmacen(rows) {
  return rows
    .filter((row) => row.PRODUCTO)
    .map((row, index) => ({
      id: `almacen_${Date.now()}_${index}`,
      producto: row.PRODUCTO || '',
      tipo: row.TIPO || 'Entrada',
      cantidad: parseInt(row.CANTIDAD || 0),
      fecha: parsearFecha(row.FECHA),
      origen: row.ORIGEN || '',
      destino: row.DESTINO || '',
      fechaCreacion: serverTimestamp(),
      fuente: 'excel_import',
    }));
}

function procesarMovimientosBancarios(rows) {
  return rows
    .filter((row) => row.CONCEPTO && row.BANCO)
    .map((row, index) => ({
      id: `mov_bancario_${Date.now()}_${index}`,
      bancoId: row.BANCO || '',
      tipo: row.TIPO || 'Ingreso',
      concepto: row.CONCEPTO || '',
      monto: parseFloat(row.MONTO || row.CANTIDAD || 0),
      fecha: parsearFecha(row.FECHA),
      referencia: row.REFERENCIA || '',
      fechaCreacion: serverTimestamp(),
      fuente: 'excel_import',
    }));
}

/**
 * Utilidad para parsear fechas
 */
function parsearFecha(valor) {
  if (!valor) return new Date();

  if (valor instanceof Date) return valor;

  if (typeof valor === 'number') {
    // Excel usa números para fechas (días desde 1900-01-01)
    const excelEpoch = new Date(1900, 0, 1);
    const days = valor - 2; // Ajuste por el bug del año 1900 en Excel
    return new Date(excelEpoch.getTime() + days * 24 * 60 * 60 * 1000);
  }

  if (typeof valor === 'string') {
    const fecha = new Date(valor);
    return isNaN(fecha.getTime()) ? new Date() : fecha;
  }

  return new Date();
}

/**
 * PASO 4: Importar datos a Firestore
 */
async function importarHoja(nombreHoja, workbook) {
  const config = MAPEO_HOJAS[nombreHoja];
  if (!config) {
    log.warning(`Hoja "${nombreHoja}" no tiene procesador configurado`);
    return { hoja: nombreHoja, importados: 0, errores: 0 };
  }

  log.section(`📥 Importando: ${nombreHoja} → ${config.coleccion}`);

  try {
    const sheet = workbook.Sheets[nombreHoja];
    if (!sheet) {
      log.error(`Hoja "${nombreHoja}" no encontrada en el Excel`);
      return { hoja: nombreHoja, importados: 0, errores: 0 };
    }

    const rawData = XLSX.utils.sheet_to_json(sheet);
    log.data('Filas encontradas', rawData.length);

    const documentos = config.procesador(rawData);
    log.data('Documentos procesados', documentos.length);

    // Importar por lotes
    let importados = 0;
    let errores = 0;
    const batchSize = 500;

    for (let i = 0; i < documentos.length; i += batchSize) {
      const batch = writeBatch(db);
      const lote = documentos.slice(i, i + batchSize);

      for (const doc of lote) {
        const docRef = doc(collection(db, config.coleccion), doc.id);
        batch.set(docRef, doc);
      }

      try {
        await batch.commit();
        importados += lote.length;
        log.success(`Lote ${Math.floor(i / batchSize) + 1}: ${lote.length} documentos`);
      } catch (error) {
        errores += lote.length;
        log.error(`Error en lote: ${error.message}`);
      }
    }

    return { hoja: nombreHoja, importados, errores, total: documentos.length };
  } catch (error) {
    log.error(`Error procesando ${nombreHoja}: ${error.message}`);
    return { hoja: nombreHoja, importados: 0, errores: 1 };
  }
}

/**
 * FUNCIÓN PRINCIPAL
 */
async function main() {
  try {
    // PASO 1: Leer Excel
    const workbook = await leerExcel();

    // PASO 2: Verificar Firestore actual
    const statsActuales = await verificarFirestore();

    // PASO 3: Importar cada hoja
    log.section('🚀 Iniciando importación');
    const resultados = [];

    for (const nombreHoja of Object.keys(MAPEO_HOJAS)) {
      const resultado = await importarHoja(nombreHoja, workbook);
      resultados.push(resultado);
    }

    // PASO 4: Reporte final
    log.title('📊 REPORTE FINAL');

    let totalImportados = 0;
    let totalErrores = 0;

    resultados.forEach((r) => {
      log.data(r.hoja, `${r.importados} importados, ${r.errores} errores`);
      totalImportados += r.importados;
      totalErrores += r.errores;
    });

    console.log(`\n${'━'.repeat(80)}\n`);
    log.success(`Total importados: ${totalImportados}`);
    if (totalErrores > 0) {
      log.warning(`Total errores: ${totalErrores}`);
    }

    // Verificar Firestore después
    log.section('✅ Verificando resultado final');
    await verificarFirestore();
  } catch (error) {
    log.error(`Error fatal: ${error.message}`);
    console.error(error);
    process.exit(1);
  }
}

// Ejecutar
main();
