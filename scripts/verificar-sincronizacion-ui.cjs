/**
 * Script de Verificación de Sincronización UI-Excel
 *
 * Verifica que todos los componentes UI muestren correctamente
 * los datos del Excel según la estructura de excel_data.json
 */

const fs = require('fs');
const path = require('path');

// Colores para terminal
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

const log = {
  success: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
  warning: (msg) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
  info: (msg) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
  section: (msg) => console.log(`\n${colors.bright}${colors.cyan}${'='.repeat(80)}${colors.reset}`),
  title: (msg) => console.log(`${colors.bright}${colors.magenta}${msg}${colors.reset}`),
};

// Cargar datos del Excel
const excelDataPath = path.join(__dirname, '..', 'public', 'excel_data.json');
const excelData = JSON.parse(fs.readFileSync(excelDataPath, 'utf-8'));

// Cargar FlowDistributorData.js
const flowDataPath = path.join(__dirname, '..', 'src', 'apps', 'FlowDistributor', 'data', 'FlowDistributorData.js');
const flowDataContent = fs.readFileSync(flowDataPath, 'utf-8');

// Resultados
const results = {
  total: 0,
  passed: 0,
  failed: 0,
  warnings: 0,
  issues: [],
};

function addIssue(component, severity, description, fix = null) {
  results.total++;
  if (severity === 'error') results.failed++;
  else if (severity === 'warning') results.warnings++;
  else results.passed++;

  results.issues.push({
    component,
    severity,
    description,
    fix,
  });
}

log.section();
log.title('VERIFICACIÓN DE SINCRONIZACIÓN DATOS EXCEL → UI COMPONENTES');
log.section();

// ============================================================================
// 1. VERIFICAR VENTAS
// ============================================================================
log.section();
log.title('1. VERIFICACIÓN PANEL VENTAS');
console.log('');

const ventas = excelData.ventas || [];
log.info(`Total ventas en Excel: ${ventas.length}`);

// Verificar estructura de ventas
const ventasSample = ventas[0] || {};
const ventasFields = Object.keys(ventasSample);
log.info(`Campos disponibles: ${ventasFields.join(', ')}`);

// Campos esperados según el Excel
const camposEsperadosVentas = [
  'fecha', 'ocRelacionada', 'cantidad', 'cliente', 'productos',
  'totalVenta', 'totalFletes', 'totalUtilidades', 'estatus',
  'estadoPago', 'destino', 'concepto', 'aplicaFlete'
];

const camposFaltantesVentas = camposEsperadosVentas.filter(campo => !ventasFields.includes(campo));
if (camposFaltantesVentas.length > 0) {
  addIssue('PanelVentas', 'warning', `Campos faltantes: ${camposFaltantesVentas.join(', ')}`);
  log.warning(`Campos faltantes: ${camposFaltantesVentas.join(', ')}`);
} else {
  addIssue('PanelVentas', 'success', 'Todos los campos esperados están presentes');
  log.success('Todos los campos esperados están presentes');
}

// Verificar en FlowDistributorData.js
if (flowDataContent.includes('export const VENTAS_LOCALES')) {
  log.success('VENTAS_LOCALES exportado en FlowDistributorData.js');
  addIssue('PanelVentas', 'success', 'VENTAS_LOCALES correctamente exportado');
} else {
  log.error('VENTAS_LOCALES NO encontrado en FlowDistributorData.js');
  addIssue('PanelVentas', 'error', 'VENTAS_LOCALES no está exportado', 'Agregar export en FlowDistributorData.js');
}

// ============================================================================
// 2. VERIFICAR DISTRIBUIDORES/ORDENES COMPRA
// ============================================================================
log.section();
log.title('2. VERIFICACIÓN PANEL DISTRIBUIDORES');
console.log('');

const compras = excelData.compras || [];
const distribuidores = excelData.distribuidores || [];

log.info(`Total compras en Excel: ${compras.length}`);
log.info(`Total distribuidores en Excel: ${distribuidores.length}`);

const comprasSample = compras[0] || {};
const comprasFields = Object.keys(comprasSample);
log.info(`Campos OC: ${comprasFields.join(', ')}`);

const camposEsperadosOC = [
  'id', 'fecha', 'origen', 'cantidad', 'costoDistribuidor',
  'costoTransporte', 'costoPorUnidad', 'stockActual',
  'costoTotal', 'pagoDistribuidor', 'deuda'
];

const camposFaltantesOC = camposEsperadosOC.filter(campo => !comprasFields.includes(campo));
if (camposFaltantesOC.length > 0) {
  addIssue('PanelDistribuidores', 'warning', `Campos faltantes en OC: ${camposFaltantesOC.join(', ')}`);
  log.warning(`Campos faltantes: ${camposFaltantesOC.join(', ')}`);
} else {
  addIssue('PanelDistribuidores', 'success', 'Todos los campos OC presentes');
  log.success('Todos los campos OC presentes');
}

// ============================================================================
// 3. VERIFICAR CLIENTES
// ============================================================================
log.section();
log.title('3. VERIFICACIÓN PANEL CLIENTES');
console.log('');

const clientes = excelData.clientes || [];
log.info(`Total clientes en Excel: ${clientes.length}`);

const clientesSample = clientes[0] || {};
const clientesFields = Object.keys(clientesSample);
log.info(`Campos disponibles: ${clientesFields.join(', ')}`);

const camposEsperadosClientes = [
  'nombre', 'adeudo', 'totalComprado', 'totalAbonado',
  'estado', 'observaciones', 'ventas'
];

const camposFaltantesClientes = camposEsperadosClientes.filter(campo => !clientesFields.includes(campo));
if (camposFaltantesClientes.length > 0) {
  addIssue('PanelClientes', 'warning', `Campos faltantes: ${camposFaltantesClientes.join(', ')}`);
  log.warning(`Campos faltantes: ${camposFaltantesClientes.join(', ')}`);
} else {
  addIssue('PanelClientes', 'success', 'Todos los campos presentes');
  log.success('Todos los campos presentes');
}

// ============================================================================
// 4. VERIFICAR ALMACÉN
// ============================================================================
log.section();
log.title('4. VERIFICACIÓN PANEL ALMACÉN');
console.log('');

// Verificar si existe estructura almacen en excel_data.json
const almacenData = excelData.almacen || {};
log.info(`Estructura almacén en Excel: ${JSON.stringify(Object.keys(almacenData))}`);

// Verificar ALMACEN_MONTE en FlowDistributorData.js
if (flowDataContent.includes('export const ALMACEN_MONTE')) {
  log.success('ALMACEN_MONTE exportado');

  // Verificar estructura incorrecta de ingresos
  const almacenMatch = flowDataContent.match(/export const ALMACEN_MONTE = \{[\s\S]*?"ingresos": \[[\s\S]*?\{[\s\S]*?"oc":/);
  if (almacenMatch) {
    const ingresosStructure = flowDataContent.match(/"ingresos": \[\s*\{[^}]*"oc":[^}]*"cliente":[^}]*"distribuidor":/);
    if (ingresosStructure) {
      addIssue('PanelAlmacen', 'error',
        'ALMACEN_MONTE.ingresos tiene mapeo INCORRECTO de columnas',
        'Corregir mapeo: debe ser {oc, fecha, distribuidor, cantidad} pero actualmente cliente contiene fecha'
      );
      log.error('PROBLEMA DETECTADO: Mapeo incorrecto de columnas en ALMACEN_MONTE.ingresos');
      log.error('  - Campo "cliente" contiene fechas');
      log.error('  - Debe corregirse a: oc, fecha, distribuidor, cantidad');
    }
  }
} else {
  addIssue('PanelAlmacen', 'error', 'ALMACEN_MONTE no encontrado', 'Agregar export en FlowDistributorData.js');
  log.error('ALMACEN_MONTE NO encontrado');
}

// ============================================================================
// 5. VERIFICAR BANCOS
// ============================================================================
log.section();
log.title('5. VERIFICACIÓN PANELES BANCOS');
console.log('');

const bancos = excelData.bancos || {};
const bancosNames = Object.keys(bancos);
log.info(`Bancos en Excel: ${bancosNames.join(', ')}`);

// Nota: bovedaUSA en el JSON se llama bovedaUsa (minúscula), GYA no existe en Excel actual
const bancosEsperados = ['bovedaMonte', 'azteca', 'leftie', 'profit', 'bovedaUsa'];
const bancosEncontrados = {};

bancosEsperados.forEach(banco => {
  if (bancos[banco]) {
    const bancoData = bancos[banco];
    const ingresos = (bancoData.ingresos || []).filter(i => i.fecha !== "Fecha");
    const gastos = (bancoData.gastos || []).filter(g => g.fecha !== "Fecha");

    bancosEncontrados[banco] = {
      ingresos: ingresos.length,
      gastos: gastos.length,
      estructura: Object.keys(bancoData)
    };

    log.success(`${banco}: ${ingresos.length} ingresos, ${gastos.length} gastos`);
    addIssue(`Panel${banco}`, 'success', `Datos encontrados: ${ingresos.length} ingresos, ${gastos.length} gastos`);
  } else {
    log.error(`${banco}: NO ENCONTRADO en excel_data.json`);
    addIssue(`Panel${banco}`, 'error', 'Datos no encontrados en Excel', 'Verificar importación desde Excel');
  }
});

// Verificar archivos datosEjemplo*
log.info('\nVerificando archivos datosEjemplo...');
const datosEjemploDir = path.join(__dirname, '..', 'src', 'apps', 'FlowDistributor', 'data');
const datosEjemploFiles = [
  'datosEjemploAzteca.js',
  'datosEjemploLeftie.js',
  'datosEjemploGYA.js',
  'datosEjemploProfit.js',
  'datosEjemploBoveda.js',
  'datosEjemploBovedaUSA.js'
];

datosEjemploFiles.forEach(file => {
  const filePath = path.join(datosEjemploDir, file);
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf-8');

    // Verificar si usa datos hardcodeados
    if (content.includes('id: \'ING-') || content.includes('id: \'GAS-')) {
      log.warning(`${file}: USA DATOS HARDCODEADOS (no sincronizado con Excel)`);
      addIssue(file, 'warning',
        'Usa datos hardcodeados, no sincronizado con excel_data.json',
        'Actualizar para usar datos directos de excel_data.json'
      );
    } else {
      log.success(`${file}: OK`);
    }
  } else {
    log.error(`${file}: NO EXISTE`);
    addIssue(file, 'error', 'Archivo no encontrado');
  }
});

// ============================================================================
// 6. VERIFICAR FLETES
// ============================================================================
log.section();
log.title('6. VERIFICACIÓN PANEL FLETES');
console.log('');

const fletes = excelData.fletes || {};
log.info(`Estructura fletes: ${JSON.stringify(Object.keys(fletes))}`);

if (flowDataContent.includes('export const FLETE_SUR')) {
  log.success('FLETE_SUR exportado');
  addIssue('PanelFletes', 'success', 'FLETE_SUR correctamente exportado');
} else {
  log.error('FLETE_SUR NO encontrado');
  addIssue('PanelFletes', 'error', 'FLETE_SUR no encontrado', 'Agregar export en FlowDistributorData.js');
}

// ============================================================================
// 7. VERIFICAR HEADERS EN DATOS
// ============================================================================
log.section();
log.title('7. VERIFICACIÓN HEADERS EN DATOS');
console.log('');

// Verificar si hay headers (fecha: "Fecha") en los datos
let headersEncontrados = 0;

if (ventas.some(v => v.fecha === "Fecha")) {
  log.warning('Ventas contiene fila de header (fecha: "Fecha")');
  headersEncontrados++;
}

if (compras.some(c => c.fecha === "Fecha" || c.id === "OC")) {
  log.warning('Compras contiene fila de header');
  headersEncontrados++;
}

Object.keys(bancos).forEach(banco => {
  const bancoData = bancos[banco];
  if ((bancoData.ingresos || []).some(i => i.fecha === "Fecha")) {
    log.warning(`${banco}.ingresos contiene header`);
    headersEncontrados++;
  }
  if ((bancoData.gastos || []).some(g => g.fecha === "Fecha")) {
    log.warning(`${banco}.gastos contiene header`);
    headersEncontrados++;
  }
});

if (headersEncontrados > 0) {
  addIssue('Excel Import', 'warning',
    `${headersEncontrados} conjuntos de datos contienen headers`,
    'Eliminar headers durante importación desde Excel'
  );
} else {
  log.success('No se encontraron headers en los datos');
  addIssue('Excel Import', 'success', 'Datos sin headers');
}

// ============================================================================
// RESUMEN FINAL
// ============================================================================
log.section();
log.title('RESUMEN DE VERIFICACIÓN');
log.section();

console.log(`\n${colors.bright}Estadísticas:${colors.reset}`);
console.log(`  Total verificaciones: ${results.total}`);
console.log(`  ${colors.green}✓ Exitosas: ${results.passed}${colors.reset}`);
console.log(`  ${colors.yellow}⚠ Advertencias: ${results.warnings}${colors.reset}`);
console.log(`  ${colors.red}✗ Errores: ${results.failed}${colors.reset}`);

if (results.issues.length > 0) {
  console.log(`\n${colors.bright}Problemas Detallados:${colors.reset}\n`);

  results.issues
    .filter(issue => issue.severity === 'error')
    .forEach((issue, idx) => {
      console.log(`${colors.red}${idx + 1}. ERROR - ${issue.component}${colors.reset}`);
      console.log(`   ${issue.description}`);
      if (issue.fix) {
        console.log(`   ${colors.cyan}Fix: ${issue.fix}${colors.reset}`);
      }
      console.log('');
    });

  results.issues
    .filter(issue => issue.severity === 'warning')
    .forEach((issue, idx) => {
      console.log(`${colors.yellow}${idx + 1}. WARNING - ${issue.component}${colors.reset}`);
      console.log(`   ${issue.description}`);
      if (issue.fix) {
        console.log(`   ${colors.cyan}Fix: ${issue.fix}${colors.reset}`);
      }
      console.log('');
    });
}

// Guardar reporte
const reportPath = path.join(__dirname, 'verificacion-sincronizacion-ui-report.json');
fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));
log.success(`Reporte guardado en: ${reportPath}`);

log.section();

// Exit code basado en errores
process.exit(results.failed > 0 ? 1 : 0);
