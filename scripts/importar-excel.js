// 🚀 SCRIPT DE IMPORTACIÓN MASIVA - EXCEL → FIRESTORE
// Importa: 96 ventas, 31 clientes, 9 OCs, 7 bancos
// Tiempo estimado: 5-10 minutos
import { collection, doc, serverTimestamp, writeBatch } from 'firebase/firestore';
import XLSX from 'xlsx';

import { db } from '../src/chronos-system/config/firebase';

// ============================================================================
// CONFIGURACIÓN
// ============================================================================

const EXCEL_PATH = 'C:/Users/xpovo/Downloads/Copia de Administación_General.xlsx';
const BATCH_SIZE = 500; // Firestore limit

// ============================================================================
// UTILIDADES
// ============================================================================

const cleanValue = (value) => {
  if (value === null || value === undefined || value === '') return null;
  if (typeof value === 'string') return value.trim();
  return value;
};

const parseDate = (excelDate) => {
  if (!excelDate) return null;
  if (typeof excelDate === 'number') {
    // Excel serial date
    const date = new Date((excelDate - 25569) * 86400 * 1000);
    return date.toISOString().split('T')[0];
  }
  return excelDate;
};

const generateId = (prefix, ...parts) => {
  return `${prefix}-${parts.filter((p) => p).join('-')}`;
};

// ============================================================================
// IMPORTAR DISTRIBUIDORES (HOJA: Distribuidores)
// ============================================================================

async function importarDistribuidores(sheet) {
  console.log('\n📦 Importando Distribuidores...');

  const data = XLSX.utils.sheet_to_json(sheet, { range: 3 }); // Desde fila 4
  const batch = writeBatch(db);
  let count = 0;

  for (const row of data) {
    const id = cleanValue(row['OC']);
    if (!id) continue;

    const distribuidor = {
      id,
      fecha: parseDate(row['Fecha']),
      origen: cleanValue(row['Origen']),
      cantidad: Number(row['Cantidad']) || 0,
      costoDistribuidor: Number(row['Costo Distribuidor']) || 0,
      costoTransporte: Number(row['Costo Transporte']) || 0,
      costoPorUnidad: Number(row['Costo Por Unidad']) || 0,
      stockActual: Number(row['Stock Actual']) || 0,
      costoTotal: Number(row['Costo Total']) || 0,
      pagoDistribuidor: Number(row['Pago a Distribuidor']) || 0,
      deuda: Number(row['Deuda']) || 0,
      estado: (Number(row['Deuda']) || 0) === 0 ? 'pagado' : 'pendiente',
      createdAt: serverTimestamp(),
    };

    const docRef = doc(collection(db, 'distribuidores'), id);
    batch.set(docRef, distribuidor);
    count++;

    if (count % BATCH_SIZE === 0) {
      await batch.commit();
      console.log(`  ✅ ${count} distribuidores importados...`);
    }
  }

  if (count % BATCH_SIZE !== 0) await batch.commit();
  console.log(`✅ Total: ${count} distribuidores importados`);
  return count;
}

// ============================================================================
// IMPORTAR VENTAS (HOJA: Control_Maestro)
// ============================================================================

async function importarVentas(sheet) {
  console.log('\n💰 Importando Ventas...');

  const data = XLSX.utils.sheet_to_json(sheet, { range: 3 }); // Desde fila 4
  const batch = writeBatch(db);
  let count = 0;

  for (let i = 0; i < data.length; i++) {
    const row = data[i];

    const fecha = parseDate(row['Fecha']);
    const cliente = cleanValue(row['Cliente']);
    const estatus = cleanValue(row['Estatus']);

    if (!fecha || !cliente) continue;

    const id = generateId('VENTA', fecha, cliente, i + 4);

    const venta = {
      id,
      fecha,
      ocRelacionada: cleanValue(row['OC Relacionada']),
      cantidad: Number(row['Cantidad']) || 0,
      cliente,
      bovedaMonte: Number(row['Bóveda Monte']) || 0,
      precioDeVenta: Number(row['Precio De Venta']) || 0,
      ingreso: Number(row['Ingreso']) || 0,
      flete: cleanValue(row['Flete']),
      fleteUtilidad: Number(row['Flete Utilidad']) || 0,
      utilidad: Number(row['Utilidad']) || 0,
      estatus: estatus || 'Pendiente',
      concepto: cleanValue(row['Concepto']),
      aplicaFlete: cleanValue(row['Flete']) === 'Aplica',
      createdAt: serverTimestamp(),
    };

    const docRef = doc(collection(db, 'ventas'), id);
    batch.set(docRef, venta);
    count++;

    if (count % BATCH_SIZE === 0) {
      await batch.commit();
      console.log(`  ✅ ${count} ventas importadas...`);
    }
  }

  if (count % BATCH_SIZE !== 0) await batch.commit();
  console.log(`✅ Total: ${count} ventas importadas`);
  return count;
}

// ============================================================================
// IMPORTAR CLIENTES (HOJA: Clientes)
// ============================================================================

async function importarClientes(sheet) {
  console.log('\n👥 Importando Clientes...');

  const data = XLSX.utils.sheet_to_json(sheet, { range: 3 });
  const batch = writeBatch(db);
  let count = 0;

  for (const row of data) {
    const nombre = cleanValue(row['Cliente'] || row['Nombre']);
    if (!nombre) continue;

    const id = nombre.toLowerCase().replace(/\s+/g, '-');

    const cliente = {
      id,
      nombre,
      totalVentas: Number(row['Total Ventas']) || 0,
      abonos: Number(row['Abonos']) || 0,
      pendiente: Number(row['Pendiente']) || 0,
      estado: (Number(row['Pendiente']) || 0) === 0 ? 'al-corriente' : 'con-deuda',
      createdAt: serverTimestamp(),
    };

    const docRef = doc(collection(db, 'clientes'), id);
    batch.set(docRef, cliente);
    count++;

    if (count % BATCH_SIZE === 0) {
      await batch.commit();
      console.log(`  ✅ ${count} clientes importados...`);
    }
  }

  if (count % BATCH_SIZE !== 0) await batch.commit();
  console.log(`✅ Total: ${count} clientes importados`);
  return count;
}

// ============================================================================
// IMPORTAR ALMACÉN (HOJA: Almacen_Monte)
// ============================================================================

async function importarAlmacen(sheet) {
  console.log('\n📦 Importando Almacén...');

  const data = XLSX.utils.sheet_to_json(sheet, { range: 3 });
  const batch = writeBatch(db);
  let entradas = 0;
  let salidas = 0;

  // ENTRADAS (Columnas 1-6)
  for (const row of data) {
    const oc = cleanValue(row['OC']);
    if (!oc) continue;

    const id = generateId('ENTRADA', oc);

    const entrada = {
      id,
      tipo: 'entrada',
      oc,
      fecha: parseDate(row['Fecha']),
      distribuidor: cleanValue(row['Distribuidor']),
      cantidad: Number(row['Cantidad']) || 0,
      corte: cleanValue(row['Corte']),
      concepto: 'Ingreso de mercancía',
      createdAt: serverTimestamp(),
    };

    const docRef = doc(collection(db, 'almacen'), id);
    batch.set(docRef, entrada);
    entradas++;

    if (entradas % BATCH_SIZE === 0) {
      await batch.commit();
      console.log(`  ✅ ${entradas} entradas importadas...`);
    }
  }

  // SALIDAS (Columnas 7-11)
  for (let i = 0; i < data.length; i++) {
    const row = data[i];
    const fecha = parseDate(row['Fecha '] || row['Fecha.1']);
    const cliente = cleanValue(row['Cliente '] || row['Cliente.1']);

    if (!fecha || !cliente) continue;

    const id = generateId('SALIDA', fecha, cliente);

    const salida = {
      id,
      tipo: 'salida',
      fecha,
      cliente,
      cantidad: Number(row['Cantidad '] || row['Cantidad.1']) || 0,
      concepto: cleanValue(row['Concepto']) || 'Venta a cliente',
      observaciones: cleanValue(row['Observaciones']),
      createdAt: serverTimestamp(),
    };

    const docRef = doc(collection(db, 'almacen'), id);
    batch.set(docRef, salida);
    salidas++;

    if (salidas % BATCH_SIZE === 0) {
      await batch.commit();
      console.log(`  ✅ ${salidas} salidas importadas...`);
    }
  }

  if ((entradas + salidas) % BATCH_SIZE !== 0) await batch.commit();
  console.log(`✅ Total: ${entradas} entradas, ${salidas} salidas importadas`);
  return { entradas, salidas };
}

// ============================================================================
// IMPORTAR BANCOS
// ============================================================================

async function importarBancos(workbook) {
  console.log('\n🏦 Importando Bancos...');

  const bancos = [
    { nombre: 'Bóveda Monte', hoja: 'Bóveda_Monte' },
    { nombre: 'Bóveda USA', hoja: 'Bóveda_USA' },
    { nombre: 'Fletes', hoja: 'Flete_Sur' },
    { nombre: 'Azteca', hoja: 'Azteca' },
    { nombre: 'Leftie', hoja: 'Leftie' },
    { nombre: 'Profit', hoja: 'Profit' },
    { nombre: 'Utilidades', hoja: 'Utilidades' },
  ];

  let totalMovimientos = 0;

  for (const banco of bancos) {
    const sheet = workbook.Sheets[banco.hoja];
    if (!sheet) {
      console.warn(`⚠️  Hoja ${banco.hoja} no encontrada`);
      continue;
    }

    const data = XLSX.utils.sheet_to_json(sheet, { range: 3 });
    const batch = writeBatch(db);
    let count = 0;

    // Importar movimientos
    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      const fecha = parseDate(row['Fecha']);
      if (!fecha) continue;

      // Detectar tipo de movimiento
      const ingreso = Number(row['Ingreso']) || 0;
      const gasto = Number(row['Gasto']) || 0;

      const id = generateId('MOV', banco.nombre.toLowerCase().replace(/\s+/g, ''), fecha, i);

      const movimiento = {
        id,
        banco: banco.nombre,
        fecha,
        tipo: ingreso > 0 ? 'ingreso' : 'gasto',
        monto: ingreso > 0 ? ingreso : gasto,
        cliente: cleanValue(row['Cliente'] || row['Origen del Gastos o Abono']),
        concepto: cleanValue(row['Concepto']),
        observaciones: cleanValue(row['Observaciones']),
        tc: Number(row['TC']) || null,
        pesos: Number(row['Pesos']) || null,
        destino: cleanValue(row['Destino']),
        createdAt: serverTimestamp(),
      };

      const docRef = doc(collection(db, 'movimientosBancarios'), id);
      batch.set(docRef, movimiento);
      count++;

      if (count % BATCH_SIZE === 0) {
        await batch.commit();
        console.log(`  ✅ ${banco.nombre}: ${count} movimientos...`);
      }
    }

    if (count % BATCH_SIZE !== 0) await batch.commit();
    console.log(`✅ ${banco.nombre}: ${count} movimientos importados`);
    totalMovimientos += count;
  }

  console.log(`✅ Total: ${totalMovimientos} movimientos bancarios importados`);
  return totalMovimientos;
}

// ============================================================================
// FUNCIÓN PRINCIPAL
// ============================================================================

async function main() {
  console.log('🚀 INICIANDO IMPORTACIÓN MASIVA EXCEL → FIRESTORE');
  console.log('='.repeat(60));
  console.log(`📁 Archivo: ${EXCEL_PATH}`);
  console.log(`⏰ Inicio: ${new Date().toLocaleTimeString()}`);
  console.log('='.repeat(60));

  try {
    // Leer Excel
    console.log('\n📖 Leyendo archivo Excel...');
    const workbook = XLSX.readFile(EXCEL_PATH);
    console.log(`✅ Hojas encontradas: ${workbook.SheetNames.join(', ')}`);

    // Importar datos
    const stats = {
      distribuidores: await importarDistribuidores(workbook.Sheets['Distribuidores']),
      ventas: await importarVentas(workbook.Sheets['Control_Maestro']),
      clientes: await importarClientes(workbook.Sheets['Clientes']),
      almacen: await importarAlmacen(workbook.Sheets['Almacen_Monte']),
      bancos: await importarBancos(workbook),
    };

    // Resumen final
    console.log('\n' + '='.repeat(60));
    console.log('✅ IMPORTACIÓN COMPLETADA');
    console.log('='.repeat(60));
    console.log(`📦 Distribuidores: ${stats.distribuidores}`);
    console.log(`💰 Ventas: ${stats.ventas}`);
    console.log(`👥 Clientes: ${stats.clientes}`);
    console.log(`📦 Almacén: ${stats.almacen.entradas} entradas, ${stats.almacen.salidas} salidas`);
    console.log(`🏦 Movimientos bancarios: ${stats.bancos}`);
    console.log(`⏰ Fin: ${new Date().toLocaleTimeString()}`);
    console.log('='.repeat(60));
  } catch (error) {
    console.error('❌ ERROR EN IMPORTACIÓN:', error);
    process.exit(1);
  }
}

// Ejecutar
main();
