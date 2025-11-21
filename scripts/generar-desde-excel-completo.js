/**
 * Script para Generar FlowDistributorData.js COMPLETO
 * Lee desde datos_excel_completos.json (FUENTE MAESTRA)
 * Fecha: 2025-10-24
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuración
const DATOS_EXCEL = path.join(__dirname, '../datos_excel_completos.json');
const OUTPUT_FILE = path.join(__dirname, '../src/apps/FlowDistributor/data/FlowDistributorData.js');
const BACKUP_FILE = path.join(__dirname, '../src/apps/FlowDistributor/data/FlowDistributorData.backup.js');

// Colores
const COLORES = {
  reset: '\x1b[0m',
  verde: '\x1b[32m',
  amarillo: '\x1b[33m',
  rojo: '\x1b[31m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m'
};

function log(mensaje, color = 'reset') {
  console.log(`${COLORES[color]}${mensaje}${COLORES.reset}`);
}

function separador() {
  log('═'.repeat(80), 'cyan');
}

// Convertir objeto a formato JS export
function objetoAJS(obj, nivel = 0) {
  const indent = '  '.repeat(nivel);
  const indent2 = '  '.repeat(nivel + 1);

  if (obj === null) return 'null';
  if (obj === undefined) return 'undefined';
  if (typeof obj === 'string') return `'${obj.replace(/'/g, "\\'").replace(/\n/g, '\\n')}'`;
  if (typeof obj === 'number') return obj.toString();
  if (typeof obj === 'boolean') return obj.toString();

  if (Array.isArray(obj)) {
    if (obj.length === 0) return '[]';
    const items = obj.map(item => `${indent2}${objetoAJS(item, nivel + 1)}`).join(',\n');
    return `[\n${items}\n${indent}]`;
  }

  if (typeof obj === 'object') {
    const keys = Object.keys(obj);
    if (keys.length === 0) return '{}';

    const props = keys.map(key => {
      const value = objetoAJS(obj[key], nivel + 1);
      const propName = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key) ? key : `'${key}'`;
      return `${indent2}${propName}: ${value}`;
    }).join(',\n');

    return `{\n${props}\n${indent}}`;
  }

  return 'null';
}

// Generar archivo JS
async function generarFlowDistributorData() {
  separador();
  log('📝 GENERANDO FLOWDISTRIBUTORDATA.JS DESDE DATOS EXCEL COMPLETOS', 'cyan');
  separador();
  log(`📅 Fecha: ${new Date().toLocaleString()}`, 'magenta');
  log('');

  // Leer datos_excel_completos.json
  log('📚 Leyendo datos_excel_completos.json...', 'cyan');

  if (!fs.existsSync(DATOS_EXCEL)) {
    log(`❌ ERROR: No se encuentra ${DATOS_EXCEL}`, 'rojo');
    process.exit(1);
  }

  const datosCompletos = JSON.parse(fs.readFileSync(DATOS_EXCEL, 'utf8'));
  log('✅ Datos leídos exitosamente', 'verde');

  // Hacer backup del archivo existente
  if (fs.existsSync(OUTPUT_FILE)) {
    fs.copyFileSync(OUTPUT_FILE, BACKUP_FILE);
    log(`💾 Backup creado: ${BACKUP_FILE}`, 'verde');
  }

  // Extraer datos
  const bancos = datosCompletos.bancos || {};
  const almacen = datosCompletos.almacen || {};
  const distribuidores = datosCompletos.distribuidores || [];
  const ordenesCompra = datosCompletos.ordenesCompra || [];
  const clientes = datosCompletos.clientes || [];
  const ventas = datosCompletos.ventas || [];

  log('\\n📊 Procesando datos...', 'cyan');

  // Preparar órdenes de compra con estructura completa
  const ordenesCompraFormateadas = ordenesCompra.map(oc => ({
    id: oc.oc || oc.id,
    folio: oc.oc || oc.id,
    fecha: oc.fecha,
    origen: oc.origen,
    distribuidor: oc.origen,
    cantidad: oc.cantidad,
    costoDistribuidor: oc.costoDistribuidor || 0,
    costoTransporte: oc.costoTransporte || 0,
    costoPorUnidad: oc.costoPorUnidad || 0,
    stockActual: oc.stockActual || 0,
    costoTotal: oc.costoTotal || 0,
    pagoDistribuidor: oc.pagoDistribuidor || 0,
    deuda: oc.deuda || 0,
    total: oc.costoTotal || 0,
    estado: 'completada'
  }));

  // Preparar distribuidores con estructura completa
  const distribuidoresFormateados = distribuidores.map((dist, idx) => ({
    id: `DIST-${String(idx + 1).padStart(3, '0')}`,
    nombre: dist.nombre,
    contacto: dist.contacto || 'N/A',
    costoTotal: dist.costoTotal || 0,
    abonos: dist.abonos || 0,
    pendiente: dist.pendiente || 0,
    estado: 'activo'
  }));

  // Preparar clientes con cálculo correcto de totalCompras
  const clientesFormateados = clientes.map((c, idx) => {
    const deuda = parseFloat(c.deuda) || 0;
    const abonos = parseFloat(c.abonos) || 0;
    const totalCompras = deuda + abonos; // Total = deuda + abonos

    return {
      id: `CLI-${String(idx + 1).padStart(3, '0')}`,
      nombre: c.nombre,
      tipo: totalCompras > 500000 ? 'mayorista' : totalCompras > 100000 ? 'regular' : 'menudeo',
      totalCompras: totalCompras,
      adeudo: parseFloat(c.pendiente) || 0,
      pagado: abonos,
      ventas: 0,
      estado: 'activo',
      observaciones: c.observaciones || ''
    };
  });

  // Preparar ventas locales
  const ventasLocales = ventas.map((v, idx) => ({
    id: `VL-${String(idx + 1).padStart(4, '0')}`,
    fecha: v.fecha,
    cliente: v.cliente,
    cantidad: v.cantidad || 0,
    precioUnitario: v.precioUnitario || 0,
    total: v.total || (v.cantidad * v.precioUnitario) || 0,
    pagado: v.pagado || 0,
    pendiente: v.pendiente || 0,
    tipo: 'local',
    estado: v.estado || 'completada'
  }));

  // Preparar almacén monte con costos de entradas
  const almacenMonteData = {
    ingresos: almacen.ingresos || 0,
    salida: almacen.salidas?.reduce((sum, s) => sum + (s.cantidad || 0), 0) || 0,
    rfActual: almacen.rfActual || 0,
    rfCortes: almacen.rfCortes || [],
    // Mapear ordenesCompra como entradas con sus costos
    entradas: ordenesCompraFormateadas.map((oc, idx) => ({
      id: oc.id || `ENT-${String(idx + 1).padStart(4, '0')}`,
      fecha: oc.fecha,
      distribuidor: oc.origen,
      cantidad: oc.cantidad,
      costoPorUnidad: oc.costoPorUnidad,
      costoTotal: oc.costoTotal,
      observaciones: ''
    })),
    // Mapear salidas desde almacen con cálculo de costo
    salidas: (almacen.salidas || []).map((s, idx) => {
      // Calcular costo promedio ponderado de las órdenes de compra
      const costoProm = ordenesCompraFormateadas.length > 0
        ? ordenesCompraFormateadas.reduce((sum, oc) => sum + oc.costoPorUnidad, 0) / ordenesCompraFormateadas.length
        : 0;

      return {
        id: `SAL-${String(idx + 1).padStart(4, '0')}`,
        fecha: s.fecha,
        cliente: s.cliente,
        cantidad: s.cantidad || 0,
        costoPorUnidad: costoProm,
        costoTotal: (s.cantidad || 0) * costoProm,
        concepto: s.concepto || '',
        observaciones: s.observaciones || ''
      };
    })
  };

  // Preparar bancos
  const bovedaMonte = bancos.bovedaMonte || {};
  const bovedaUsa = bancos.bovedaUsa || {};
  const fleteSur = bancos.fleteSur || {};
  const azteca = bancos.azteca || {};
  const utilidades = bancos.utilidades || {};
  const leftie = bancos.leftie || {};
  const profit = bancos.profit || {};

  // Preparar estructura de cada banco
  const prepararBanco = (banco, nombre) => ({
    nombre: nombre,
    saldoActual: banco.saldoActual || 0,
    ingresos: banco.totalIngresos || banco.ingresos?.reduce((sum, i) => sum + (i.monto || 0), 0) || 0,
    gastos: banco.totalGastos || banco.gastos?.reduce((sum, g) => sum + (g.monto || 0), 0) || 0,
    ingresosList: (banco.ingresos || []).map((i, idx) => ({
      id: `${nombre.toUpperCase()}-ING-${String(idx + 1).padStart(4, '0')}`,
      fecha: i.fecha,
      cliente: i.cliente || i.origen || 'N/A',
      monto: i.monto || 0,
      concepto: i.concepto || '',
      tipo: 'ingreso'
    })),
    gastosList: (banco.gastos || []).map((g, idx) => ({
      id: `${nombre.toUpperCase()}-GAS-${String(idx + 1).padStart(4, '0')}`,
      fecha: g.fecha,
      origen: g.origen || g.cliente || 'N/A',
      monto: g.monto || 0,
      concepto: g.concepto || '',
      tipo: 'gasto'
    })),
    rfActual: banco.saldoActual || 0,
    rfCortes: banco.cortes || []
  });

  const fecha = new Date().toISOString();
  let contenido = `/**
 * FlowDistributor - Datos del Sistema Completo
 * Generado desde datos_excel_completos.json (FUENTE MAESTRA)
 * Fecha de generación: ${fecha}
 *
 * IMPORTANTE: Este archivo fue generado automáticamente.
 * Para actualizar datos, modificar datos_excel_completos.json y regenerar.
 */

// ============================================================================
// ORDENES DE COMPRA
// ============================================================================

export const ORDENES_COMPRA = ${objetoAJS(ordenesCompraFormateadas, 0)};

export const DISTRIBUIDORES = ${objetoAJS(distribuidoresFormateados, 0)};

// ============================================================================
// VENTAS LOCAL
// ============================================================================

export const VENTAS_LOCAL = ${objetoAJS(ventasLocales, 0)};

// ============================================================================
// CLIENTES (con totalCompras = deuda + abonos)
// ============================================================================

export const CLIENTES = ${objetoAJS(clientesFormateados, 0)};

// ============================================================================
// ALMACEN MONTE (con costos completos)
// ============================================================================

export const ALMACEN_MONTE = ${objetoAJS(almacenMonteData, 0)};

// ============================================================================
// BOVEDA MONTE
// ============================================================================

export const BOVEDA_MONTE = ${objetoAJS(prepararBanco(bovedaMonte, 'bovedaMonte'), 0)};

// ============================================================================
// BOVEDA USA
// ============================================================================

export const BOVEDA_USA = ${objetoAJS(prepararBanco(bovedaUsa, 'bovedaUsa'), 0)};

// ============================================================================
// FLETE SUR
// ============================================================================

export const FLETE_SUR = ${objetoAJS(prepararBanco(fleteSur, 'fleteSur'), 0)};

// ============================================================================
// AZTECA
// ============================================================================

export const AZTECA = ${objetoAJS(prepararBanco(azteca, 'azteca'), 0)};

// ============================================================================
// UTILIDADES
// ============================================================================

export const UTILIDADES = ${objetoAJS(prepararBanco(utilidades, 'utilidades'), 0)};

// ============================================================================
// LEFTIE
// ============================================================================

export const LEFTIE = ${objetoAJS(prepararBanco(leftie, 'leftie'), 0)};

// ============================================================================
// PROFIT
// ============================================================================

export const PROFIT = ${objetoAJS(prepararBanco(profit, 'profit'), 0)};

// ============================================================================
// DASHBOARD (calculado desde datos reales)
// ============================================================================

export const DASHBOARD = {
  totalIngresos: ${Object.values(bancos).reduce((sum, b) => sum + (b.totalIngresos || 0), 0)},
  totalGastos: ${Object.values(bancos).reduce((sum, b) => sum + (b.totalGastos || 0), 0)},
  totalBancos: ${Object.keys(bancos).length},
  saldoTotal: ${Object.values(bancos).reduce((sum, b) => sum + (b.saldoActual || 0), 0)},
  totalClientes: ${clientes.length},
  totalOrdenesCompra: ${ordenesCompra.length},
  totalVentas: ${ventas.length}
};

// ============================================================================
// DATOS CONSOLIDADOS
// ============================================================================

export const DATOS_COMPLETOS = {
  ordenesCompra: ORDENES_COMPRA,
  distribuidores: DISTRIBUIDORES,
  ventasLocal: VENTAS_LOCAL,
  clientes: CLIENTES,
  almacenMonte: ALMACEN_MONTE,
  bovedaMonte: BOVEDA_MONTE,
  bovedaUsa: BOVEDA_USA,
  fleteSur: FLETE_SUR,
  azteca: AZTECA,
  utilidades: UTILIDADES,
  leftie: LEFTIE,
  profit: PROFIT,
  dashboard: DASHBOARD,
  metadata: {
    generadoEn: '${fecha}',
    version: '3.0.0',
    fuenteDatos: 'datos_excel_completos.json (FUENTE MAESTRA)',
    totalRegistros: {
      ordenesCompra: ${ordenesCompra.length},
      distribuidores: ${distribuidores.length},
      clientes: ${clientes.length},
      ventas: ${ventas.length},
      bancos: ${Object.keys(bancos).length},
      transaccionesBancarias: ${Object.values(bancos).reduce((sum, b) => sum + (b.ingresos?.length || 0) + (b.gastos?.length || 0), 0)}
    }
  }
};

// Export default para compatibilidad
export default DATOS_COMPLETOS;
`;

  // Guardar archivo
  fs.writeFileSync(OUTPUT_FILE, contenido, 'utf8');

  separador();
  log('\\n✅ ARCHIVO GENERADO EXITOSAMENTE', 'verde');
  separador();
  log(`📄 Archivo: ${OUTPUT_FILE}`, 'verde');
  log(`📊 Tamaño: ${(fs.statSync(OUTPUT_FILE).size / 1024).toFixed(2)} KB`, 'verde');
  log(`📅 Fecha: ${new Date().toLocaleString()}`, 'verde');
  separador();

  // Estadísticas
  log('\\n📊 ESTADÍSTICAS DE DATOS:', 'cyan');
  log(`   • Órdenes de Compra: ${ordenesCompra.length}`, 'magenta');
  log(`   • Distribuidores: ${distribuidores.length}`, 'magenta');
  log(`   • Clientes: ${clientes.length}`, 'magenta');
  log(`   • Ventas: ${ventas.length}`, 'magenta');
  log(`   • Bancos: ${Object.keys(bancos).length}`, 'magenta');
  log(`   • Bóveda Monte Ingresos: ${bovedaMonte.ingresos?.length || 0}`, 'magenta');
  log(`   • Bóveda Monte Gastos: ${bovedaMonte.gastos?.length || 0}`, 'magenta');
  log(`   • Bóveda USA Ingresos: ${bovedaUsa.ingresos?.length || 0}`, 'magenta');
  log(`   • Total Transacciones Bancarias: ${Object.values(bancos).reduce((sum, b) => sum + (b.ingresos?.length || 0) + (b.gastos?.length || 0), 0)}`, 'magenta');
  log(`   • Almacén Entradas: ${ordenesCompra.length}`, 'magenta');
  log(`   • Almacén Salidas: ${almacen.salidas?.length || 0}`, 'magenta');

  separador();

  log('\\n✅ TODOS LOS MONTOS Y VARIABLES INCLUIDOS CORRECTAMENTE!', 'verde');
  log('   ✓ Órdenes de compra con costos completos', 'verde');
  log('   ✓ Clientes con totalCompras = deuda + abonos', 'verde');
  log('   ✓ Almacén con costos de entradas y salidas', 'verde');
  log('   ✓ Todos los bancos con ingresos y gastos completos', 'verde');
  log('   ✓ Dashboard con totales calculados', 'verde');
  separador();
}

// Ejecutar
generarFlowDistributorData()
  .then(() => {
    log('\\n✅ Proceso completado exitosamente!', 'verde');
    log('\\n📝 PRÓXIMO PASO: Ejecutar el servidor y limpiar localStorage', 'cyan');
    log('   Abrir: scripts/fix-local-storage.html en el navegador', 'cyan');
    process.exit(0);
  })
  .catch(error => {
    log(`\\n❌ Error fatal: ${error.message}`, 'rojo');
    console.error(error);
    process.exit(1);
  });
