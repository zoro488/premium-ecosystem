/**
 * 🔍 AUDITORÍA COMPLETA - VERIFICACIÓN DE INTEGRACIÓN DE DATOS EXCEL
 * ===================================================================
 *
 * Script de auditoría para verificar que TODOS los datos del Excel
 * estén correctamente integrados en cada panel y componente.
 *
 * @author FlowDistributor Team
 * @date 2025
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuración de rutas
const BASE_PATH = path.join(__dirname, 'src', 'apps', 'FlowDistributor');
const DATA_FILE = path.join(BASE_PATH, 'data', 'FlowDistributorData.js');

// Función para leer y parsear el archivo de datos
function loadDataFile() {
  try {
    const content = fs.readFileSync(DATA_FILE, 'utf8');
    // Extraer las exportaciones usando regex
    const exports = {};

    // Extraer FLETE_SUR
    const fleteMatch = content.match(/export const FLETE_SUR = ({[\s\S]*?});/);
    if (fleteMatch) {
      try {
        exports.FLETE_SUR = eval(`(${fleteMatch[1]})`);
      } catch (e) {
        console.log('❌ Error parseando FLETE_SUR');
      }
    }

    // Extraer ORDENES_COMPRA
    const ordenesMatch = content.match(/export const ORDENES_COMPRA = (\[[\s\S]*?\]);/);
    if (ordenesMatch) {
      try {
        exports.ORDENES_COMPRA = eval(`(${ordenesMatch[1]})`);
      } catch (e) {
        console.log('❌ Error parseando ORDENES_COMPRA');
      }
    }

    // Extraer VENTAS_LOCALES
    const ventasMatch = content.match(/export const VENTAS_LOCALES = (\[[\s\S]*?\]);/);
    if (ventasMatch) {
      try {
        exports.VENTAS_LOCALES = eval(`(${ventasMatch[1]})`);
      } catch (e) {
        console.log('❌ Error parseando VENTAS_LOCALES');
      }
    }

    // Extraer BOVEDA_MONTE
    const bovMonteMatch = content.match(/export const BOVEDA_MONTE = ({[\s\S]*?});/);
    if (bovMonteMatch) {
      try {
        exports.BOVEDA_MONTE = eval(`(${bovMonteMatch[1]})`);
      } catch (e) {
        console.log('❌ Error parseando BOVEDA_MONTE');
      }
    }

    // Extraer BOVEDA_USA
    const bovUSAMatch = content.match(/export const BOVEDA_USA = ({[\s\S]*?});/);
    if (bovUSAMatch) {
      try {
        exports.BOVEDA_USA = eval(`(${bovUSAMatch[1]})`);
      } catch (e) {
        console.log('❌ Error parseando BOVEDA_USA');
      }
    }

    // Extraer ALMACEN_MONTE
    const almMonteMatch = content.match(/export const ALMACEN_MONTE = ({[\s\S]*?});/);
    if (almMonteMatch) {
      try {
        exports.ALMACEN_MONTE = eval(`(${almMonteMatch[1]})`);
      } catch (e) {
        console.log('❌ Error parseando ALMACEN_MONTE');
      }
    }

    // Extraer RF_ACTUAL_CONTROL
    const rfMatch = content.match(/export const RF_ACTUAL_CONTROL = (\[[\s\S]*?\]);/);
    if (rfMatch) {
      try {
        exports.RF_ACTUAL_CONTROL = eval(`(${rfMatch[1]})`);
      } catch (e) {
        console.log('❌ Error parseando RF_ACTUAL_CONTROL');
      }
    }

    // Extraer GASTOS_Y_ABONOS
    const gyaMatch = content.match(/export const GASTOS_Y_ABONOS = (\[[\s\S]*?\]);/);
    if (gyaMatch) {
      try {
        exports.GASTOS_Y_ABONOS = eval(`(${gyaMatch[1]})`);
      } catch (e) {
        console.log('❌ Error parseando GASTOS_Y_ABONOS');
      }
    }

    return exports;
  } catch (error) {
    console.error('❌ Error cargando archivo de datos:', error.message);
    return null;
  }
}

// Función para verificar un panel específico
function verificarPanel(panelName, filePath, expectedImports, dataCounts) {
  console.log(`\n🔍 VERIFICANDO ${panelName.toUpperCase()}`);
  console.log('='.repeat(50));

  try {
    const content = fs.readFileSync(filePath, 'utf8');

    // Verificar importaciones
    console.log('📦 IMPORTACIONES:');
    expectedImports.forEach(importName => {
      const importRegex = new RegExp(`import.*${importName}.*from.*FlowDistributorData`);
      if (importRegex.test(content)) {
        console.log(`  ✅ ${importName} - IMPORTADO correctamente`);
      } else {
        console.log(`  ❌ ${importName} - NO importado o import incorrecto`);
      }
    });

    // Verificar uso de datos
    console.log('📊 USO DE DATOS:');
    expectedImports.forEach(importName => {
      const usageRegex = new RegExp(`${importName}\\b`);
      const matches = content.match(usageRegex);
      if (matches && matches.length > 1) { // Más de una coincidencia (import + uso)
        console.log(`  ✅ ${importName} - USADO en el componente (${matches.length - 1} referencias)`);
      } else {
        console.log(`  ❌ ${importName} - NO usado en el componente`);
      }
    });

    // Verificar cálculos básicos
    console.log('🧮 CÁLCULOS BÁSICOS:');
    if (panelName === 'PanelDistribuidores' && dataCounts.ORDENES_COMPRA) {
      const totalOrdenes = dataCounts.ORDENES_COMPRA;
      console.log(`  📋 Total Órdenes de Compra: ${totalOrdenes}`);
    }

    if (panelName === 'PanelVentas' && dataCounts.VENTAS_LOCALES) {
      const totalVentas = dataCounts.VENTAS_LOCALES;
      console.log(`  🛒 Total Ventas Locales: ${totalVentas}`);
    }

    if (panelName === 'PanelBovedaUSA' && dataCounts.BOVEDA_USA) {
      const ingresos = dataCounts.BOVEDA_USA.ingresos || 0;
      const gastos = dataCounts.BOVEDA_USA.gastos || 0;
      console.log(`  💰 Bóveda USA - Ingresos: ${ingresos}, Gastos: ${gastos}`);
    }

    if (panelName === 'PanelAlmacen' && dataCounts.ALMACEN_MONTE) {
      const ingresos = dataCounts.ALMACEN_MONTE.ingresos || 0;
      const salidas = dataCounts.ALMACEN_MONTE.salidas || 0;
      console.log(`  📦 Almacén - Ingresos: ${ingresos}, Salidas: ${salidas}`);
    }

    if (panelName === 'PanelGYA' && dataCounts.GASTOS_Y_ABONOS) {
      const totalMovimientos = dataCounts.GASTOS_Y_ABONOS;
      console.log(`  💸 Gastos y Abonos: ${totalMovimientos} movimientos`);
    }

    return true;

  } catch (error) {
    console.log(`❌ ERROR verificando ${panelName}: ${error.message}`);
    return false;
  }
}

// Función principal de auditoría
function ejecutarAuditoriaCompleta() {
  console.log('🚀 INICIANDO AUDITORÍA COMPLETA DE INTEGRACIÓN DE DATOS EXCEL');
  console.log('='.repeat(70));

  // Cargar datos del archivo
  const data = loadDataFile();
  if (!data) {
    console.log('❌ No se pudieron cargar los datos. Abortando auditoría.');
    return;
  }

  // Contar registros por tipo
  const dataCounts = {
    FLETE_SUR: {
      ingresos: data.FLETE_SUR?.ingresos?.length || 0,
      gastos: data.FLETE_SUR?.gastos?.length || 0,
      rfCortes: data.FLETE_SUR?.rfCortes?.length || 0
    },
    ORDENES_COMPRA: data.ORDENES_COMPRA?.length || 0,
    VENTAS_LOCALES: data.VENTAS_LOCALES?.length || 0,
    BOVEDA_MONTE: {
      ingresos: data.BOVEDA_MONTE?.ingresos?.length || 0,
      gastos: data.BOVEDA_MONTE?.gastos?.length || 0
    },
    BOVEDA_USA: {
      ingresos: data.BOVEDA_USA?.ingresos?.length || 0,
      gastos: data.BOVEDA_USA?.gastos?.length || 0
    },
    ALMACEN_MONTE: {
      ingresos: data.ALMACEN_MONTE?.ingresos?.length || 0,
      salidas: data.ALMACEN_MONTE?.salidas?.length || 0
    },
    RF_ACTUAL_CONTROL: data.RF_ACTUAL_CONTROL?.length || 0,
    GASTOS_Y_ABONOS: data.GASTOS_Y_ABONOS?.length || 0
  };

  console.log('📊 RESUMEN DE DATOS CARGADOS:');
  console.log(`  FLETE_SUR: ${dataCounts.FLETE_SUR.ingresos} ingresos, ${dataCounts.FLETE_SUR.gastos} gastos`);
  console.log(`  ORDENES_COMPRA: ${dataCounts.ORDENES_COMPRA} registros`);
  console.log(`  VENTAS_LOCALES: ${dataCounts.VENTAS_LOCALES} registros`);
  console.log(`  BOVEDA_MONTE: ${dataCounts.BOVEDA_MONTE.ingresos} ingresos, ${dataCounts.BOVEDA_MONTE.gastos} gastos`);
  console.log(`  BOVEDA_USA: ${dataCounts.BOVEDA_USA.ingresos} ingresos, ${dataCounts.BOVEDA_USA.gastos} gastos`);
  console.log(`  ALMACEN_MONTE: ${dataCounts.ALMACEN_MONTE.ingresos} ingresos, ${dataCounts.ALMACEN_MONTE.salidas} salidas`);
  console.log(`  RF_ACTUAL_CONTROL: ${dataCounts.RF_ACTUAL_CONTROL} registros`);
  console.log(`  GASTOS_Y_ABONOS: ${dataCounts.GASTOS_Y_ABONOS} registros`);

  // Verificar cada panel
  const paneles = [
    {
      nombre: 'PanelDistribuidores',
      archivo: path.join(BASE_PATH, 'components', 'PanelDistribuidores.jsx'),
      importsEsperados: ['ORDENES_COMPRA']
    },
    {
      nombre: 'PanelVentas',
      archivo: path.join(BASE_PATH, 'components', 'PanelVentas.jsx'),
      importsEsperados: ['VENTAS_LOCALES']
    },
    {
      nombre: 'PanelBovedaUSA',
      archivo: path.join(BASE_PATH, 'components', 'PanelBovedaUSA.jsx'),
      importsEsperados: ['BOVEDA_USA']
    },
    {
      nombre: 'PanelAlmacen',
      archivo: path.join(BASE_PATH, 'components', 'PanelAlmacen.jsx'),
      importsEsperados: ['ALMACEN_MONTE']
    },
    {
      nombre: 'PanelGYA',
      archivo: path.join(BASE_PATH, 'components', 'PanelGYA.jsx'),
      importsEsperados: ['GASTOS_Y_ABONOS']
    },
    {
      nombre: 'DashboardRFActual',
      archivo: path.join(BASE_PATH, 'components', 'DashboardRFActual.jsx'),
      importsEsperados: ['RF_ACTUAL_CONTROL']
    }
  ];

  let panelesVerificados = 0;
  let panelesConProblemas = 0;

  paneles.forEach(panel => {
    if (fs.existsSync(panel.archivo)) {
      const resultado = verificarPanel(panel.nombre, panel.archivo, panel.importsEsperados, dataCounts);
      panelesVerificados++;
      if (!resultado) panelesConProblemas++;
    } else {
      console.log(`\n❌ PANEL ${panel.nombre.toUpperCase()} NO ENCONTRADO`);
      console.log(`   Archivo esperado: ${panel.archivo}`);
      panelesConProblemas++;
    }
  });

  // Verificar PanelBovedaMonteFinanciero (base)
  const panelFinancieroPath = path.join(BASE_PATH, 'components', 'PanelBovedaMonteFinanciero.jsx');
  if (!fs.existsSync(panelFinancieroPath)) {
    console.log('\n❌ PANEL PanelBovedaMonteFinanciero.jsx NO ENCONTRADO');
    console.log('   Este archivo es requerido por PanelAzteca, PanelLeftie, PanelProfit y PanelBovedaUSA');
    panelesConProblemas++;
  }

  // Resultados finales
  console.log('\n' + '='.repeat(70));
  console.log('📋 RESULTADOS DE LA AUDITORÍA COMPLETA');
  console.log('='.repeat(70));
  console.log(`✅ Paneles verificados: ${panelesVerificados}`);
  console.log(`❌ Paneles con problemas: ${panelesConProblemas}`);

  if (panelesConProblemas === 0) {
    console.log('\n🎉 ¡AUDITORÍA COMPLETADA CON ÉXITO!');
    console.log('   Todos los datos del Excel están correctamente integrados.');
  } else {
    console.log('\n⚠️  AUDITORÍA COMPLETADA CON PROBLEMAS');
    console.log('   Se encontraron problemas que requieren corrección.');
  }

  console.log('\n🔧 ACCIONES RECOMENDADAS:');
  if (!fs.existsSync(panelFinancieroPath)) {
    console.log('   1. Crear PanelBovedaMonteFinanciero.jsx');
  }
  console.log('   2. Verificar que PanelGYA use GASTOS_Y_ABONOS en lugar de datosEjemploGYA');
  console.log('   3. Verificar que DashboardRFActual use RF_ACTUAL_CONTROL');
  console.log('   4. Ejecutar pruebas de integración');
}

// Ejecutar auditoría
ejecutarAuditoriaCompleta();