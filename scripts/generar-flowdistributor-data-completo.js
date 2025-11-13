/**
 * Script para Generar FlowDistributorData.js Completo
 * Lee todos los archivos JSON manuales y genera un archivo JS unificado
 * Fecha: 2025-10-24
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuración
const DATA_DIR = path.join(__dirname, '../src/apps/FlowDistributor/data');
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

// Leer archivo JSON
function leerJSON(archivo) {
  try {
    const rutaCompleta = path.join(DATA_DIR, archivo);
    if (!fs.existsSync(rutaCompleta)) {
      return { error: `Archivo no encontrado: ${archivo}`, datos: null };
    }
    const contenido = fs.readFileSync(rutaCompleta, 'utf8');
    const datos = JSON.parse(contenido);
    return { error: null, datos };
  } catch (error) {
    return { error: `Error al leer ${archivo}: ${error.message}`, datos: null };
  }
}

// Convertir objeto a formato JS export
function objetoAJS(obj, nivel = 0) {
  const indent = '  '.repeat(nivel);
  const indent2 = '  '.repeat(nivel + 1);

  if (obj === null) return 'null';
  if (obj === undefined) return 'undefined';
  if (typeof obj === 'string') return `'${obj.replace(/'/g, "\\'")}'`;
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
      // Usar nombre de propiedad válido (sin comillas si es posible)
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
  log('📝 GENERANDO FLOWDISTRIBUTORDATA.JS COMPLETO', 'cyan');
  separador();
  log(`📅 Fecha: ${new Date().toLocaleString()}`, 'magenta');
  log('');

  // Hacer backup del archivo existente
  if (fs.existsSync(OUTPUT_FILE)) {
    fs.copyFileSync(OUTPUT_FILE, BACKUP_FILE);
    log(`💾 Backup creado: ${BACKUP_FILE}`, 'verde');
  }

  // Leer todos los archivos
  log('\n📚 Leyendo archivos manuales...', 'cyan');

  const fleteSur = leerJSON('panel-fletes-manual.json').datos?.fleteSur || {};
  const ordenesCompra = leerJSON('panel-ordenes-compra-manual.json').datos?.distribuidores || {};
  const ventasLocal = leerJSON('panel-ventas-local-manual.json').datos?.ventasLocal || [];
  const dashboard = leerJSON('panel-dashboard-manual.json').datos?.dashboard || {};
  const gastosAbonos = leerJSON('panel-gastos-abonos-manual.json').datos || {};
  const almacenMonte = leerJSON('panel-almacen-monte-manual.json').datos?.almacenMonte || {};
  const bovedaMonte = leerJSON('panel-boveda-monte-manual.json').datos?.bovedaMonte || {};
  const bovedaUsa = leerJSON('panel-boveda-usa-manual.json').datos?.bovedaUsa || {};
  const azteca = leerJSON('panel-azteca-manual.json').datos?.azteca || {};
  const utilidades = leerJSON('panel-utilidades-manual.json').datos?.utilidades || {};
  const leftie = leerJSON('panel-leftie-manual.json').datos?.leftie || {};
  const profit = leerJSON('panel-profit-manual.json').datos?.profit || {};
  const clientes = leerJSON('panel-clientes-manual.json').datos?.clientes || [];

  log('✅ Todos los archivos leídos exitosamente', 'verde');

  // Generar contenido del archivo JS
  log('\n📝 Generando contenido de archivo...', 'cyan');

  const fecha = new Date().toISOString();
  let contenido = `/**
 * FlowDistributor - Datos del Sistema Completo
 * Generado automáticamente a partir de archivos manuales
 * Fecha de generación: ${fecha}
 *
 * IMPORTANTE: Este archivo fue generado automáticamente.
 * Para actualizar datos, modificar los archivos *-manual.json y regenerar.
 */

// ============================================================================
// ORDENES DE COMPRA
// ============================================================================

export const ORDENES_COMPRA = ${objetoAJS(ordenesCompra.ordenesCompra || [], 0)};

export const DISTRIBUIDORES = ${objetoAJS(ordenesCompra.distribuidores || [], 0)};

// ============================================================================
// VENTAS LOCAL
// ============================================================================

export const VENTAS_LOCAL = ${objetoAJS(ventasLocal, 0)};

// ============================================================================
// CLIENTES
// ============================================================================

export const CLIENTES = ${objetoAJS(clientes, 0)};

// ============================================================================
// FLETE SUR
// ============================================================================

export const FLETE_SUR = {
  ingresos: ${objetoAJS(fleteSur.ingresos || [], 1)},
  gastos: ${objetoAJS(fleteSur.gastos || [], 1)},
  rfActual: ${fleteSur.rfActual || 0},
  rfCortes: ${objetoAJS(fleteSur.rfCortes || [], 1)}
};

// ============================================================================
// ALMACEN MONTE
// ============================================================================

export const ALMACEN_MONTE = {
  ingresos: ${almacenMonte.ingresos || 0},
  ordenesCompra: ${objetoAJS(almacenMonte.ordenesCompra || [], 1)},
  rfActual: ${almacenMonte.rfActual || 0},
  rfCortes: ${objetoAJS(almacenMonte.rfCortes || [], 1)},
  salida: ${almacenMonte.salida || 0},
  salidas: ${objetoAJS(almacenMonte.salidas || [], 1)}
};

// ============================================================================
// BOVEDA MONTE
// ============================================================================

export const BOVEDA_MONTE = {
  ingresos: ${bovedaMonte.ingresos || 0},
  ingresosList: ${objetoAJS(bovedaMonte.ingresosList || [], 1)},
  gastos: ${bovedaMonte.gastos || 0},
  gastosList: ${objetoAJS(bovedaMonte.gastosList || [], 1)},
  rfActual: ${bovedaMonte.rfActual || 0},
  rfCortes: ${objetoAJS(bovedaMonte.rfCortes || [], 1)}
};

// ============================================================================
// BOVEDA USA
// ============================================================================

export const BOVEDA_USA = {
  ingresos: ${bovedaUsa.ingresos || 0},
  ingresosList: ${objetoAJS(bovedaUsa.ingresosList || [], 1)},
  gastos: ${bovedaUsa.gastos || 0},
  gastosList: ${objetoAJS(bovedaUsa.gastosList || [], 1)},
  rfActual: ${bovedaUsa.rfActual || 0},
  rfCortes: ${objetoAJS(bovedaUsa.rfCortes || [], 1)}
};

// ============================================================================
// AZTECA
// ============================================================================

export const AZTECA = {
  ingresos: ${azteca.ingresos || 0},
  ingresosList: ${objetoAJS(azteca.ingresosList || [], 1)},
  gastos: ${azteca.gastos || 0},
  gastosList: ${objetoAJS(azteca.gastosList || [], 1)},
  rfActual: ${azteca.rfActual || 0},
  rfCortes: ${objetoAJS(azteca.rfCortes || [], 1)}
};

// ============================================================================
// UTILIDADES
// ============================================================================

export const UTILIDADES = {
  ingresos: ${utilidades.ingresos || 0},
  ingresosList: ${objetoAJS(utilidades.ingresosList || [], 1)},
  gastos: ${utilidades.gastos || 0},
  gastosList: ${objetoAJS(utilidades.gastosList || [], 1)},
  rfActual: ${utilidades.rfActual || 0},
  rfCortes: ${objetoAJS(utilidades.rfCortes || [], 1)}
};

// ============================================================================
// LEFTIE
// ============================================================================

export const LEFTIE = {
  ingresos: ${leftie.ingresos || 0},
  ingresosList: ${objetoAJS(leftie.ingresosList || [], 1)},
  gastos: ${leftie.gastos || 0},
  gastosList: ${objetoAJS(leftie.gastosList || [], 1)},
  rfActual: ${leftie.rfActual || 0},
  rfCortes: ${objetoAJS(leftie.rfCortes || [], 1)}
};

// ============================================================================
// PROFIT
// ============================================================================

export const PROFIT = {
  ingresos: ${profit.ingresos || 0},
  ingresosList: ${objetoAJS(profit.ingresosList || [], 1)},
  gastos: ${profit.gastos || 0},
  gastosList: ${objetoAJS(profit.gastosList || [], 1)},
  rfActual: ${profit.rfActual || 0},
  rfCortes: ${objetoAJS(profit.rfCortes || [], 1)}
};

// ============================================================================
// DASHBOARD
// ============================================================================

export const DASHBOARD = ${objetoAJS(dashboard, 0)};

// ============================================================================
// DATOS CONSOLIDADOS
// ============================================================================

export const DATOS_COMPLETOS = {
  ordenesCompra: ORDENES_COMPRA,
  distribuidores: DISTRIBUIDORES,
  ventasLocal: VENTAS_LOCAL,
  clientes: CLIENTES,
  fleteSur: FLETE_SUR,
  almacenMonte: ALMACEN_MONTE,
  bovedaMonte: BOVEDA_MONTE,
  bovedaUsa: BOVEDA_USA,
  azteca: AZTECA,
  utilidades: UTILIDADES,
  leftie: LEFTIE,
  profit: PROFIT,
  dashboard: DASHBOARD,
  metadata: {
    generadoEn: '${fecha}',
    version: '2.0.0',
    fuenteDatos: 'Archivos manuales JSON'
  }
};

// Export default para compatibilidad
export default DATOS_COMPLETOS;
`;

  // Guardar archivo
  fs.writeFileSync(OUTPUT_FILE, contenido, 'utf8');

  separador();
  log('\n✅ ARCHIVO GENERADO EXITOSAMENTE', 'verde');
  separador();
  log(`📄 Archivo: ${OUTPUT_FILE}`, 'verde');
  log(`📊 Tamaño: ${(fs.statSync(OUTPUT_FILE).size / 1024).toFixed(2)} KB`, 'verde');
  log(`📅 Fecha: ${new Date().toLocaleString()}`, 'verde');
  separador();

  // Estadísticas
  log('\n📊 ESTADÍSTICAS DE DATOS:', 'cyan');
  log(`   • Órdenes de Compra: ${ordenesCompra.ordenesCompra?.length || 0}`, 'magenta');
  log(`   • Distribuidores: ${ordenesCompra.distribuidores?.length || 0}`, 'magenta');
  log(`   • Ventas Local: ${ventasLocal.length || 0}`, 'magenta');
  log(`   • Clientes: ${clientes.length || 0}`, 'magenta');
  log(`   • Flete Sur Ingresos: ${fleteSur.ingresos?.length || 0}`, 'magenta');
  log(`   • Almacén Monte Salidas: ${almacenMonte.salidas?.length || 0}`, 'magenta');
  log(`   • Bóveda Monte Ingresos: ${bovedaMonte.ingresosList?.length || 0}`, 'magenta');
  log(`   • Bóveda USA Ingresos: ${bovedaUsa.ingresosList?.length || 0}`, 'magenta');
  log(`   • Azteca Ingresos: ${azteca.ingresosList?.length || 0}`, 'magenta');
  log(`   • Utilidades Ingresos: ${utilidades.ingresosList?.length || 0}`, 'magenta');
  log(`   • Leftie Ingresos: ${leftie.ingresosList?.length || 0}`, 'magenta');
  log(`   • Profit Ingresos: ${profit.ingresosList?.length || 0}`, 'magenta');

  separador();
}

// Ejecutar
generarFlowDistributorData()
  .then(() => {
    log('\n✅ Proceso completado exitosamente!', 'verde');
    process.exit(0);
  })
  .catch(error => {
    log(`\n❌ Error fatal: ${error.message}`, 'rojo');
    console.error(error);
    process.exit(1);
  });
