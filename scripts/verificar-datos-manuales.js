/**
 * Script de Verificación de Datos Manuales - FlowDistributor
 * Analiza todos los archivos JSON manuales y genera reporte completo
 * Fecha: 2025-10-24
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuración
const DATA_DIR = path.join(__dirname, '../src/apps/FlowDistributor/data');
const OUTPUT_FILE = path.join(__dirname, 'verificacion-datos-manuales-report.json');
const OUTPUT_MD = path.join(__dirname, 'VERIFICACION_DATOS_MANUALES.md');

// Archivos a verificar
const ARCHIVOS_MANUALES = [
  'panel-fletes-manual.json',
  'panel-ordenes-compra-manual.json',
  'panel-ventas-local-manual.json',
  'panel-dashboard-manual.json',
  'panel-gastos-abonos-manual.json',
  'panel-almacen-monte-manual.json',
  'panel-boveda-monte-manual.json',
  'panel-boveda-usa-manual.json',
  'panel-azteca-manual.json',
  'panel-utilidades-manual.json',
  'panel-leftie-manual.json',
  'panel-profit-manual.json',
  'panel-clientes-manual.json'
];

// Colores para consola
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

// Función para leer archivo JSON de forma segura
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

// Función para validar estructura de panel financiero
function validarPanelFinanciero(datos, nombrePanel) {
  const advertencias = [];
  const estadisticas = {};

  // Verificar estructura básica
  const keys = Object.keys(datos);
  if (keys.length === 0) {
    advertencias.push('Panel vacío');
    return { advertencias, estadisticas };
  }

  const panelKey = keys[0]; // Primer key (ej: "fleteSur", "bovedaMonte")
  const panel = datos[panelKey];

  if (!panel) {
    advertencias.push(`Panel ${nombrePanel} no tiene datos`);
    return { advertencias, estadisticas };
  }

  // Estadísticas básicas
  estadisticas.ingresos = panel.ingresos || panel.ingresosList?.length || 0;
  estadisticas.gastos = panel.gastos || panel.gastosList?.length || 0;
  estadisticas.rfActual = panel.rfActual || 0;

  // Validar listas de ingresos
  if (panel.ingresosList && Array.isArray(panel.ingresosList)) {
    estadisticas.totalIngresosList = panel.ingresosList.length;

    // Calcular suma de ingresos
    const sumaIngresos = panel.ingresosList.reduce((sum, item) => {
      return sum + (parseFloat(item.ingreso) || 0);
    }, 0);
    estadisticas.sumaIngresosCalculada = sumaIngresos;

    // Verificar coherencia
    if (typeof panel.ingresos === 'number') {
      const diferencia = Math.abs(panel.ingresos - sumaIngresos);
      if (diferencia > 1) {
        advertencias.push(
          `Ingresos declarados (${panel.ingresos}) vs calculados (${sumaIngresos}): diferencia de ${diferencia.toFixed(2)}`
        );
      }
    }
  }

  // Validar listas de gastos
  if (panel.gastosList && Array.isArray(panel.gastosList)) {
    estadisticas.totalGastosList = panel.gastosList.length;

    // Calcular suma de gastos
    const sumaGastos = panel.gastosList.reduce((sum, item) => {
      return sum + (parseFloat(item.gasto) || 0);
    }, 0);
    estadisticas.sumaGastosCalculada = sumaGastos;

    // Verificar coherencia
    if (typeof panel.gastos === 'number') {
      const diferencia = Math.abs(panel.gastos - sumaGastos);
      if (diferencia > 1) {
        advertencias.push(
          `Gastos declarados (${panel.gastos}) vs calculados (${sumaGastos}): diferencia de ${diferencia.toFixed(2)}`
        );
      }
    }
  }

  // Validar RF Actual
  if (typeof panel.ingresos === 'number' && typeof panel.gastos === 'number') {
    const rfCalculado = panel.ingresos - panel.gastos;
    estadisticas.rfCalculado = rfCalculado;

    if (typeof panel.rfActual === 'number') {
      const diferenciaRF = Math.abs(panel.rfActual - rfCalculado);
      if (diferenciaRF > 1) {
        advertencias.push(
          `RF Actual declarado (${panel.rfActual}) vs calculado (${rfCalculado}): diferencia de ${diferenciaRF.toFixed(2)}`
        );
      }
    }
  }

  // Validar RF Cortes
  if (panel.rfCortes && Array.isArray(panel.rfCortes)) {
    estadisticas.totalRFCortes = panel.rfCortes.length;

    if (panel.rfCortes.length > 0) {
      const ultimoCorte = panel.rfCortes[panel.rfCortes.length - 1];
      estadisticas.ultimoRFCorte = ultimoCorte.corte || 0;
      estadisticas.fechaUltimoCorte = ultimoCorte.fecha;
    }
  }

  return { advertencias, estadisticas };
}

// Función principal de análisis
async function analizarDatos() {
  separador();
  log('🔍 VERIFICACIÓN DE DATOS MANUALES - FLOWDISTRIBUTOR', 'cyan');
  separador();
  log(`📅 Fecha: ${new Date().toLocaleString()}`, 'magenta');
  log(`📂 Directorio: ${DATA_DIR}`, 'magenta');
  log('');

  const reporte = {
    fecha: new Date().toISOString(),
    archivosAnalizados: 0,
    archivosConErrores: 0,
    archivosExitosos: 0,
    advertenciasTotales: 0,
    paneles: {}
  };

  // Analizar cada archivo
  for (const archivo of ARCHIVOS_MANUALES) {
    log(`\n📄 Analizando: ${archivo}`, 'cyan');

    const { error, datos } = leerJSON(archivo);

    if (error) {
      log(`   ❌ ${error}`, 'rojo');
      reporte.archivosConErrores++;
      reporte.paneles[archivo] = {
        estado: 'error',
        error: error,
        advertencias: [],
        estadisticas: {}
      };
      continue;
    }

    reporte.archivosAnalizados++;

    // Determinar tipo de panel
    const nombrePanel = archivo.replace('panel-', '').replace('-manual.json', '');

    // Analizar según tipo
    let resultado = { advertencias: [], estadisticas: {} };

    if (archivo.includes('clientes')) {
      // Panel de clientes
      if (datos.clientes && Array.isArray(datos.clientes)) {
        resultado.estadisticas.totalClientes = datos.clientes.length;
        resultado.estadisticas.clientesConDeuda = datos.clientes.filter(c => c.pendiente > 0).length;
        resultado.estadisticas.totalPendiente = datos.clientes.reduce((sum, c) => sum + (c.pendiente || 0), 0);
      }
    } else if (archivo.includes('ordenes-compra')) {
      // Panel de ordenes de compra
      if (datos.distribuidores) {
        resultado.estadisticas.totalOrdenes = datos.distribuidores.ordenesCompra?.length || 0;
        resultado.estadisticas.totalDistribuidores = datos.distribuidores.distribuidores?.length || 0;
      }
    } else if (archivo.includes('ventas-local')) {
      // Panel de ventas
      if (datos.ventasLocal && Array.isArray(datos.ventasLocal)) {
        resultado.estadisticas.totalVentas = datos.ventasLocal.length;
        resultado.estadisticas.totalIngresosVentas = datos.ventasLocal.reduce(
          (sum, v) => sum + (v.ingreso || 0), 0
        );
      }
    } else if (archivo.includes('dashboard')) {
      // Dashboard
      if (datos.dashboard) {
        resultado.estadisticas.totalRfActual = datos.dashboard.totalRfActual || 0;
        resultado.estadisticas.totalPaneles = datos.dashboard.paneles?.length || 0;
      }
    } else if (archivo.includes('almacen')) {
      // Almacén
      const almacenKey = Object.keys(datos)[0];
      if (datos[almacenKey]) {
        resultado.estadisticas.totalIngresos = datos[almacenKey].ingresos || 0;
        resultado.estadisticas.totalSalidas = datos[almacenKey].salida || 0;
        resultado.estadisticas.rfActual = datos[almacenKey].rfActual || 0;
      }
    } else {
      // Panel financiero estándar
      resultado = validarPanelFinanciero(datos, nombrePanel);
    }

    // Registrar resultado
    const tieneAdvertencias = resultado.advertencias.length > 0;

    if (tieneAdvertencias) {
      log(`   ⚠️  ${resultado.advertencias.length} advertencia(s)`, 'amarillo');
      resultado.advertencias.forEach(adv => {
        log(`      • ${adv}`, 'amarillo');
      });
      reporte.advertenciasTotales += resultado.advertencias.length;
    } else {
      log(`   ✅ Sin advertencias`, 'verde');
    }

    // Mostrar estadísticas
    log(`   📊 Estadísticas:`, 'magenta');
    Object.entries(resultado.estadisticas).forEach(([key, value]) => {
      const valorFormateado = typeof value === 'number'
        ? value.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
        : value;
      log(`      • ${key}: ${valorFormateado}`, 'magenta');
    });

    reporte.archivosExitosos++;
    reporte.paneles[archivo] = {
      estado: 'exitoso',
      advertencias: resultado.advertencias,
      estadisticas: resultado.estadisticas
    };
  }

  // Resumen final
  separador();
  log('\n📊 RESUMEN FINAL', 'cyan');
  separador();
  log(`✅ Archivos analizados: ${reporte.archivosAnalizados}`, 'verde');
  log(`✅ Archivos exitosos: ${reporte.archivosExitosos}`, 'verde');
  log(`❌ Archivos con errores: ${reporte.archivosConErrores}`, reporte.archivosConErrores > 0 ? 'rojo' : 'verde');
  log(`⚠️  Total advertencias: ${reporte.advertenciasTotales}`, reporte.advertenciasTotales > 0 ? 'amarillo' : 'verde');

  // Guardar reporte JSON
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(reporte, null, 2), 'utf8');
  log(`\n💾 Reporte JSON guardado en: ${OUTPUT_FILE}`, 'verde');

  // Generar reporte Markdown
  generarReporteMarkdown(reporte);
  log(`💾 Reporte Markdown guardado en: ${OUTPUT_MD}`, 'verde');

  separador();
}

// Función para generar reporte Markdown
function generarReporteMarkdown(reporte) {
  let md = `# 🔍 VERIFICACIÓN DE DATOS MANUALES - FLOWDISTRIBUTOR\n\n`;
  md += `**Fecha:** ${new Date(reporte.fecha).toLocaleString()}\n\n`;

  md += `## 📊 Resumen Ejecutivo\n\n`;
  md += `| Métrica | Valor |\n`;
  md += `|---------|-------|\n`;
  md += `| Archivos Analizados | ${reporte.archivosAnalizados} |\n`;
  md += `| Archivos Exitosos | ${reporte.archivosExitosos} |\n`;
  md += `| Archivos con Errores | ${reporte.archivosConErrores} |\n`;
  md += `| Total Advertencias | ${reporte.advertenciasTotales} |\n\n`;

  md += `## 📁 Análisis por Panel\n\n`;

  Object.entries(reporte.paneles).forEach(([archivo, resultado]) => {
    const nombrePanel = archivo.replace('panel-', '').replace('-manual.json', '');
    const icono = resultado.estado === 'exitoso'
      ? (resultado.advertencias.length > 0 ? '⚠️' : '✅')
      : '❌';

    md += `### ${icono} ${nombrePanel.toUpperCase()}\n\n`;
    md += `**Archivo:** \`${archivo}\`\n\n`;
    md += `**Estado:** ${resultado.estado}\n\n`;

    if (resultado.error) {
      md += `**Error:** ${resultado.error}\n\n`;
    }

    if (resultado.advertencias && resultado.advertencias.length > 0) {
      md += `**Advertencias:**\n\n`;
      resultado.advertencias.forEach(adv => {
        md += `- ${adv}\n`;
      });
      md += `\n`;
    }

    if (resultado.estadisticas && Object.keys(resultado.estadisticas).length > 0) {
      md += `**Estadísticas:**\n\n`;
      md += `| Concepto | Valor |\n`;
      md += `|----------|-------|\n`;
      Object.entries(resultado.estadisticas).forEach(([key, value]) => {
        const valorFormateado = typeof value === 'number'
          ? value.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
          : value;
        md += `| ${key} | ${valorFormateado} |\n`;
      });
      md += `\n`;
    }
  });

  md += `## 🎯 Conclusiones\n\n`;

  if (reporte.advertenciasTotales === 0 && reporte.archivosConErrores === 0) {
    md += `✅ **EXCELENTE:** Todos los archivos manuales están correctos y no se detectaron inconsistencias.\n\n`;
  } else if (reporte.archivosConErrores > 0) {
    md += `❌ **CRÍTICO:** Se encontraron ${reporte.archivosConErrores} archivo(s) con errores que requieren atención inmediata.\n\n`;
  } else if (reporte.advertenciasTotales > 0) {
    md += `⚠️ **ATENCIÓN:** Se encontraron ${reporte.advertenciasTotales} advertencia(s) que deben revisarse.\n\n`;
  }

  md += `## 📋 Próximos Pasos\n\n`;
  md += `1. Revisar advertencias y corregir inconsistencias\n`;
  md += `2. Validar datos con fuentes originales (Excel)\n`;
  md += `3. Actualizar FlowDistributorData.js con datos validados\n`;
  md += `4. Ejecutar pruebas de integración en React\n`;

  fs.writeFileSync(OUTPUT_MD, md, 'utf8');
}

// Ejecutar análisis
analizarDatos().catch(error => {
  log(`\n❌ Error fatal: ${error.message}`, 'rojo');
  console.error(error);
  process.exit(1);
});
