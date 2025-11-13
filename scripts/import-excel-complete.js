#!/usr/bin/env node
/**
 * Script de Importación Completa de Excel a Firestore
 * Moneda: USD (Dólares)
 *
 * Importa datos desde: Copia de Administación_General.xlsx
 *
 * Hojas procesadas:
 * - Órdenes de Compra (OC)
 * - Distribuidores
 * - Ventas Locales
 * - Gastos y Abonos
 * - Movimientos Almacén
 * - Movimientos Bancarios (6 bancos)
 * - Clientes
 */
import { initializeApp } from 'firebase/app';
import { collection, doc, getFirestore, writeBatch } from 'firebase/firestore';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import XLSX from 'xlsx';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ===================================
// CONFIGURACIÓN FIREBASE
// ===================================
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ===================================
// CONFIGURACIÓN
// ===================================
const EXCEL_PATH =
  process.env.EXCEL_PATH || join(__dirname, '..', 'Copia de Administación_General.xlsx');
const BATCH_SIZE = 500;
const DRY_RUN = process.argv.includes('--dry-run');

// ===================================
// UTILIDADES
// ===================================
function parseExcelDate(excelDate) {
  if (!excelDate) return null;

  if (typeof excelDate === 'number') {
    const date = new Date((excelDate - 25569) * 86400 * 1000);
    return date.toISOString();
  }

  if (typeof excelDate === 'string') {
    const date = new Date(excelDate);
    return isNaN(date.getTime()) ? null : date.toISOString();
  }

  return null;
}

function parseNumber(value, defaultValue = 0) {
  if (value === null || value === undefined || value === '') return defaultValue;
  const num = typeof value === 'string' ? parseFloat(value.replace(/[,$]/g, '')) : Number(value);
  return isNaN(num) ? defaultValue : num;
}

function cleanString(str) {
  if (!str) return '';
  return String(str).trim().replace(/\s+/g, ' ');
}

// ===================================
// IMPORTADORES POR HOJA
// ===================================

/**
 * Importar Órdenes de Compra
 */
async function importOrdenesCompra(sheet) {
  console.log('📦 Importando Órdenes de Compra...');

  const data = XLSX.utils.sheet_to_json(sheet);
  const ordenes = [];

  for (const row of data) {
    if (!row['N° OC'] && !row['Número OC']) continue;

    const orden = {
      numeroOrden: cleanString(row['N° OC'] || row['Número OC'] || ''),
      fecha: parseExcelDate(row['Fecha'] || row['Fecha OC']),
      proveedor: cleanString(row['Proveedor'] || row['Distribuidor'] || ''),
      producto: cleanString(row['Producto'] || row['Descripción'] || ''),
      cantidad: parseNumber(row['Cantidad']),
      precioUnitario: parseNumber(row['Precio Unitario'] || row['Costo Unitario']),
      costoTotal: parseNumber(row['Total'] || row['Costo Total']),
      moneda: 'USD',
      estado: row['Estado'] || 'PENDIENTE',
      origen: cleanString(row['Origen'] || ''),
      observaciones: cleanString(row['Observaciones'] || row['Notas'] || ''),
      fechaEstimadaEntrega: parseExcelDate(row['Fecha Entrega'] || row['ETA']),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Calcular total si no existe
    if (!orden.costoTotal && orden.cantidad && orden.precioUnitario) {
      orden.costoTotal = orden.cantidad * orden.precioUnitario;
    }

    ordenes.push(orden);
  }

  if (DRY_RUN) {
    console.log(`  ✅ ${ordenes.length} órdenes procesadas (DRY RUN)`);
    return { count: ordenes.length, sample: ordenes[0] };
  }

  // Importar por lotes
  let imported = 0;
  for (let i = 0; i < ordenes.length; i += BATCH_SIZE) {
    const batch = writeBatch(db);
    const chunk = ordenes.slice(i, i + BATCH_SIZE);

    for (const orden of chunk) {
      const docRef = doc(collection(db, 'ordenesCompra'));
      batch.set(docRef, orden);
    }

    await batch.commit();
    imported += chunk.length;
    console.log(`  📝 Importadas ${imported}/${ordenes.length} órdenes`);
  }

  console.log(`  ✅ ${imported} órdenes importadas exitosamente`);
  return { count: imported };
}

/**
 * Importar Ventas
 */
async function importVentas(sheet) {
  console.log('💰 Importando Ventas...');

  const data = XLSX.utils.sheet_to_json(sheet);
  const ventas = [];

  for (const row of data) {
    if (!row['N° Venta'] && !row['Folio']) continue;

    const venta = {
      numeroVenta: cleanString(row['N° Venta'] || row['Folio'] || ''),
      fecha: parseExcelDate(row['Fecha']),
      clienteId: cleanString(row['Cliente ID'] || ''),
      clienteNombre: cleanString(row['Cliente'] || row['Razón Social'] || ''),
      producto: cleanString(row['Producto'] || row['Descripción'] || ''),
      cantidad: parseNumber(row['Cantidad']),
      precioUnitario: parseNumber(row['Precio Unitario'] || row['Precio Venta']),
      precioVenta: parseNumber(row['Total'] || row['Monto Total']),
      costoUnitario: parseNumber(row['Costo Unitario']),
      costoTotal: parseNumber(row['Costo Total']),
      moneda: 'USD',
      estado: row['Estado'] || 'PENDIENTE',
      tipoPago: cleanString(row['Tipo Pago'] || row['Forma Pago'] || ''),
      observaciones: cleanString(row['Observaciones'] || ''),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Calcular utilidad
    if (venta.precioVenta && venta.costoTotal) {
      venta.utilidad = venta.precioVenta - venta.costoTotal;
      venta.margen = ((venta.utilidad / venta.precioVenta) * 100).toFixed(2);
    }

    ventas.push(venta);
  }

  if (DRY_RUN) {
    console.log(`  ✅ ${ventas.length} ventas procesadas (DRY RUN)`);
    return { count: ventas.length, sample: ventas[0] };
  }

  let imported = 0;
  for (let i = 0; i < ventas.length; i += BATCH_SIZE) {
    const batch = writeBatch(db);
    const chunk = ventas.slice(i, i + BATCH_SIZE);

    for (const venta of chunk) {
      const docRef = doc(collection(db, 'ventas'));
      batch.set(docRef, venta);
    }

    await batch.commit();
    imported += chunk.length;
    console.log(`  📝 Importadas ${imported}/${ventas.length} ventas`);
  }

  console.log(`  ✅ ${imported} ventas importadas exitosamente`);
  return { count: imported };
}

/**
 * Importar Clientes
 */
async function importClientes(sheet) {
  console.log('👥 Importando Clientes...');

  // Leer con encabezados de la primera fila
  const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });

  // La primera fila son los encabezados
  if (data.length < 2) {
    console.log('  ⚠️  No hay datos en la hoja Clientes');
    return { count: 0 };
  }

  const headers = data[0]; // ["Cliente", "Actual", "Deuda", "Abonos", "Pendiente", "Observaciones"]
  const rows = data.slice(1); // Datos desde la segunda fila

  console.log(`  📋 Encabezados encontrados: ${headers.join(', ')}`);
  console.log(`  📊 Filas de datos: ${rows.length}`);

  const clientes = [];
  const clientesMap = new Map();

  for (const row of rows) {
    // Saltar filas vacías
    if (!row || row.length === 0 || !row[0]) continue;

    const nombre = cleanString(row[0]); // Primera columna: Cliente
    if (!nombre || nombre === 'Cliente') continue; // Saltar encabezado duplicado

    // Evitar duplicados
    if (clientesMap.has(nombre)) continue;

    const cliente = {
      nombre,
      rfc: cleanString(row[6] || ''), // Si hay columna RFC
      empresa: nombre,
      telefono: cleanString(row[7] || ''),
      email: cleanString(row[8] || ''),
      direccion: cleanString(row[9] || ''),
      ciudad: cleanString(row[10] || ''),
      estado: cleanString(row[11] || ''),
      codigoPostal: cleanString(row[12] || ''),
      creditoAutorizado: parseNumber(row[1]), // "Actual"
      creditoDisponible: parseNumber(row[1]), // "Actual" como disponible inicial
      deuda: parseNumber(row[2]), // "Deuda"
      abonos: parseNumber(row[3]), // "Abonos"
      pendiente: parseNumber(row[4]), // "Pendiente"
      bloqueado: parseNumber(row[4]) > 0 && parseNumber(row[2]) > parseNumber(row[1]), // Si deuda > crédito
      motivoBloqueo: cleanString(row[5] || ''), // "Observaciones"
      observaciones: cleanString(row[5] || ''),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    clientes.push(cliente);
    clientesMap.set(nombre, cliente);
  }

  if (DRY_RUN) {
    console.log(`  ✅ ${clientes.length} clientes procesados (DRY RUN)`);
    return { count: clientes.length, sample: clientes[0] };
  }

  let imported = 0;
  for (let i = 0; i < clientes.length; i += BATCH_SIZE) {
    const batch = writeBatch(db);
    const chunk = clientes.slice(i, i + BATCH_SIZE);

    for (const cliente of chunk) {
      const docRef = doc(collection(db, 'clientes'));
      batch.set(docRef, cliente);
    }

    await batch.commit();
    imported += chunk.length;
    console.log(`  📝 Importados ${imported}/${clientes.length} clientes`);
  }

  console.log(`  ✅ ${imported} clientes importados exitosamente`);
  return { count: imported };
}

/**
 * Importar Distribuidores
 */
async function importDistribuidores(sheet) {
  console.log('🏭 Importando Distribuidores...');

  // Leer TODAS las filas como arrays
  const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });

  if (data.length < 4) {
    console.log('  ⚠️  No hay suficientes datos en la hoja Distribuidores');
    return { count: 0 };
  }

  // Fila 0: ["Ordenes de compra"] - Sección
  // Fila 1: [] - VACÍA
  // Fila 2: ["OC", "Fecha", ..., "Distribuidores", "Costo total", "Abonos", "Pendiente"] - ENCABEZADOS
  // Fila 3+: DATOS
  const columnHeaders = data[2]; // Encabezados reales en fila 2 (índice 2)
  const rows = data.slice(3); // Datos desde fila 4 (índice 3+)

  console.log(
    `  📋 Columnas: ${columnHeaders.slice(0, 5).join(', ')}...${columnHeaders.slice(-4).join(', ')}`
  );
  console.log(`  📊 Filas de datos: ${rows.length}`);

  const distribuidores = [];
  const distribuidoresMap = new Map();

  // Encontrar el índice de la columna "Distribuidores"
  let distribuidorColumnIndex = -1;
  for (let i = 0; i < columnHeaders.length; i++) {
    if (columnHeaders[i] === 'Distribuidores') {
      distribuidorColumnIndex = i;
      break;
    }
  }

  console.log(`  🔍 Columna Distribuidores en índice: ${distribuidorColumnIndex}`);

  if (distribuidorColumnIndex === -1) {
    console.log('  ⚠️  No se encontró columna "Distribuidores"');
    return { count: 0 };
  }

  for (const row of rows) {
    if (!row || row.length === 0) continue;

    const nombre = cleanString(row[distribuidorColumnIndex]);
    if (!nombre || nombre === 'Distribuidores' || distribuidoresMap.has(nombre)) continue;

    const distribuidor = {
      nombre,
      contacto: cleanString(row[0] || ''), // OC o contacto
      telefono: '',
      email: '',
      pais: cleanString(row[2] || ''), // Origen
      productos: '',
      costoTotal: parseNumber(row[12]), // Costo total (__EMPTY_12)
      abonos: parseNumber(row[13]), // Abonos (__EMPTY_13)
      pendiente: parseNumber(row[14]), // Pendiente (__EMPTY_14)
      activo: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    distribuidores.push(distribuidor);
    distribuidoresMap.set(nombre, distribuidor);
  }

  if (DRY_RUN) {
    console.log(`  ✅ ${distribuidores.length} distribuidores procesados (DRY RUN)`);
    return { count: distribuidores.length, sample: distribuidores[0] };
  }

  let imported = 0;
  const batch = writeBatch(db);

  for (const distribuidor of distribuidores) {
    const docRef = doc(collection(db, 'distribuidores'));
    batch.set(docRef, distribuidor);
    imported++;
  }

  await batch.commit();
  console.log(`  ✅ ${imported} distribuidores importados exitosamente`);
  return { count: imported };
}

/**
 * Importar Gastos
 */
async function importGastos(sheet) {
  console.log('💸 Importando Gastos...');

  const data = XLSX.utils.sheet_to_json(sheet);
  const gastos = [];

  for (const row of data) {
    if (!row['Fecha'] && !row['Concepto']) continue;

    const gasto = {
      fecha: parseExcelDate(row['Fecha']),
      concepto: cleanString(row['Concepto'] || row['Descripción'] || ''),
      categoria: cleanString(row['Categoría'] || row['Tipo'] || 'General'),
      monto: parseNumber(row['Monto'] || row['Importe']),
      moneda: 'USD',
      metodoPago: cleanString(row['Método Pago'] || row['Forma Pago'] || ''),
      proveedor: cleanString(row['Proveedor'] || ''),
      referencia: cleanString(row['Referencia'] || row['Folio'] || ''),
      observaciones: cleanString(row['Observaciones'] || ''),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    gastos.push(gasto);
  }

  if (DRY_RUN) {
    console.log(`  ✅ ${gastos.length} gastos procesados (DRY RUN)`);
    return { count: gastos.length, sample: gastos[0] };
  }

  let imported = 0;
  for (let i = 0; i < gastos.length; i += BATCH_SIZE) {
    const batch = writeBatch(db);
    const chunk = gastos.slice(i, i + BATCH_SIZE);

    for (const gasto of chunk) {
      const docRef = doc(collection(db, 'gastos'));
      batch.set(docRef, gasto);
    }

    await batch.commit();
    imported += chunk.length;
    console.log(`  📝 Importados ${imported}/${gastos.length} gastos`);
  }

  console.log(`  ✅ ${imported} gastos importados exitosamente`);
  return { count: imported };
}

// ===================================
// FUNCIÓN PRINCIPAL
// ===================================
async function main() {
  console.log('\n========================================');
  console.log('📊 IMPORTACIÓN COMPLETA DE EXCEL');
  console.log('========================================\n');

  if (DRY_RUN) {
    console.log('🔍 MODO DRY RUN - No se escribirá en Firestore\n');
  }

  console.log(`📁 Archivo: ${EXCEL_PATH}`);
  console.log(`💵 Moneda: USD\n`);

  try {
    // Leer archivo Excel
    console.log('📖 Leyendo archivo Excel...');
    const workbook = XLSX.readFile(EXCEL_PATH);
    console.log(`✅ Hojas encontradas: ${workbook.SheetNames.join(', ')}\n`);

    const results = {};

    // Importar cada hoja
    if (workbook.SheetNames.includes('OC') || workbook.SheetNames.includes('Órdenes de Compra')) {
      const sheetName = workbook.SheetNames.find(
        (name) => name.includes('OC') || name.includes('Órdenes')
      );
      results.ordenesCompra = await importOrdenesCompra(workbook.Sheets[sheetName]);
    }

    if (workbook.SheetNames.includes('Ventas') || workbook.SheetNames.includes('Ventas Locales')) {
      const sheetName = workbook.SheetNames.find((name) => name.includes('Ventas'));
      results.ventas = await importVentas(workbook.Sheets[sheetName]);
    }

    if (workbook.SheetNames.includes('Clientes')) {
      results.clientes = await importClientes(workbook.Sheets['Clientes']);
    }

    if (
      workbook.SheetNames.includes('Distribuidores') ||
      workbook.SheetNames.includes('Proveedores')
    ) {
      const sheetName = workbook.SheetNames.find(
        (name) => name.includes('Distribuidor') || name.includes('Proveedor')
      );
      results.distribuidores = await importDistribuidores(workbook.Sheets[sheetName]);
    }

    if (workbook.SheetNames.includes('Gastos') || workbook.SheetNames.includes('Gastos y Abonos')) {
      const sheetName = workbook.SheetNames.find((name) => name.includes('Gastos'));
      results.gastos = await importGastos(workbook.Sheets[sheetName]);
    }

    // Resumen final
    console.log('\n========================================');
    console.log('✅ IMPORTACIÓN COMPLETADA');
    console.log('========================================\n');

    console.log('📊 Resumen de registros importados:\n');
    Object.entries(results).forEach(([key, value]) => {
      console.log(`  ${key.padEnd(20)}: ${value.count} registros`);
    });

    const total = Object.values(results).reduce((sum, r) => sum + r.count, 0);
    console.log(`\n  ${'TOTAL'.padEnd(20)}: ${total} registros\n`);

    // Guardar reporte
    const report = {
      timestamp: new Date().toISOString(),
      excelFile: EXCEL_PATH,
      mode: DRY_RUN ? 'DRY_RUN' : 'PRODUCTION',
      results,
      total,
    };

    const reportPath = join(__dirname, 'import-report.json');
    await import('fs/promises').then((fs) =>
      fs.writeFile(reportPath, JSON.stringify(report, null, 2))
    );
    console.log(`📄 Reporte guardado en: ${reportPath}\n`);
  } catch (error) {
    console.error('\n❌ ERROR EN IMPORTACIÓN:', error);
    console.error(error.stack);
    process.exit(1);
  }
}

// Ejecutar
main()
  .then(() => {
    console.log('✅ Proceso completado exitosamente');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Error fatal:', error);
    process.exit(1);
  });
