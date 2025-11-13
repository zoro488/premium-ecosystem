const fs = require('fs');
const path = require('path');

console.log('\n' + '='.repeat(100));
console.log('🔍 ANÁLISIS AVANZADO Y DETALLADO: EXCEL vs PANELES FLOWDISTRIBUTOR');
console.log('='.repeat(100) + '\n');

// PASO 1: CARGAR TODOS LOS ARCHIVOS DE DATOS
console.log('📂 PASO 1: CARGANDO ARCHIVOS DE DATOS...\n');

const archivoExcelCompleto = path.join(__dirname, '../scripts/analisis_excel_completo.json');
const archivoBaseDatos = path.join(__dirname, '../BASE_DATOS_excel_data.json');

let datosExcelCompleto = {};
let baseDatos = {};

if (fs.existsSync(archivoExcelCompleto)) {
  datosExcelCompleto = JSON.parse(fs.readFileSync(archivoExcelCompleto, 'utf8'));
  console.log('✓ Cargado: analisis_excel_completo.json');
}

if (fs.existsSync(archivoBaseDatos)) {
  baseDatos = JSON.parse(fs.readFileSync(archivoBaseDatos, 'utf8'));
  console.log('✓ Cargado: BASE_DATOS_excel_data.json');
}

// PASO 2: MAPEAR HOJAS DEL EXCEL
console.log('\n📊 PASO 2: ANALIZANDO HOJAS DEL EXCEL ORIGINAL...\n');

const hojasExcel = Object.keys(datosExcelCompleto).filter(k => k !== 'metadata');

console.log(`Total de hojas encontradas: ${hojasExcel.length}\n`);

const estructuraExcel = {};

hojasExcel.forEach(hoja => {
  const datos = datosExcelCompleto[hoja];

  if (datos && datos.headers && datos.registros) {
    estructuraExcel[hoja] = {
      headers: datos.headers,
      totalRegistros: datos.registros.length,
      ejemplo: datos.registros[0] || {}
    };

    console.log(`📄 ${hoja}`);
    console.log(`   ├─ Columnas (${datos.headers.length}): ${datos.headers.join(', ')}`);
    console.log(`   └─ Registros: ${datos.registros.length}`);
    console.log('');
  }
});

// PASO 3: ANALIZAR PANELES
console.log('\n🎨 PASO 3: ANALIZANDO PANELES IMPLEMENTADOS...\n');

const rutaPaneles = path.join(__dirname, '../src/apps/FlowDistributor/components');

const paneles = [
  'PanelAlmacen',
  'PanelAzteca',
  'PanelBovedaMonte',
  'PanelBovedaUSA',
  'PanelBovedaUSASupremo',
  'PanelDistribuidores',
  'PanelFleteSur',
  'PanelGYA',
  'PanelLeftie',
  'PanelOrdenesCompra',
  'PanelProfit',
  'PanelUtilidades',
  'PanelVentaLocal',
  'PanelVentas'
];

const analisisPaneles = {};

paneles.forEach(nombrePanel => {
  const rutaArchivo = path.join(rutaPaneles, `${nombrePanel}.jsx`);

  if (fs.existsSync(rutaArchivo)) {
    const contenido = fs.readFileSync(rutaArchivo, 'utf8');

    // Extraer columnas de TanStack Table
    const columnas = [];
    const columnasRegex = /{\s*header:\s*['"]([^'"]+)['"]/g;
    let match;

    while ((match = columnasRegex.exec(contenido)) !== null) {
      columnas.push(match[1]);
    }

    // Detectar fuente de datos
    let fuenteDatos = 'No detectada';

    if (contenido.includes('useOrdenesCompra')) fuenteDatos = 'useOrdenesCompra hook';
    else if (contenido.includes('useClientes')) fuenteDatos = 'useClientes hook';
    else if (contenido.includes('useVentas')) fuenteDatos = 'useVentas hook';
    else if (contenido.includes('baseDatos.ventas')) fuenteDatos = 'baseDatos.ventas';
    else if (contenido.includes('baseDatos.compras')) fuenteDatos = 'baseDatos.compras';
    else if (contenido.includes('baseDatos.distribuidores')) fuenteDatos = 'baseDatos.distribuidores';
    else if (contenido.includes('baseDatos.almacen')) fuenteDatos = 'baseDatos.almacen';
    else if (contenido.includes('baseDatos.gastosAbonos')) fuenteDatos = 'baseDatos.gastosAbonos';

    // Detectar si tiene gráficos
    const tieneGraficos = contenido.includes('Chart') || contenido.includes('LineChart') || contenido.includes('BarChart');

    // Detectar si tiene formularios
    const tieneFormularios = contenido.includes('Form') || contenido.includes('Input') || contenido.includes('onSubmit');

    analisisPaneles[nombrePanel] = {
      columnas,
      totalColumnas: columnas.length,
      fuenteDatos,
      tieneGraficos,
      tieneFormularios,
      lineasCodigo: contenido.split('\n').length
    };

    console.log(`✓ ${nombrePanel}`);
    console.log(`   ├─ Columnas: ${columnas.length}`);
    if (columnas.length > 0) {
      console.log(`   ├─ ${columnas.join(', ')}`);
    }
    console.log(`   ├─ Fuente de datos: ${fuenteDatos}`);
    console.log(`   ├─ Gráficos: ${tieneGraficos ? 'Sí' : 'No'}`);
    console.log(`   ├─ Formularios: ${tieneFormularios ? 'Sí' : 'No'}`);
    console.log(`   └─ Líneas de código: ${contenido.split('\n').length}`);
    console.log('');
  }
});

// PASO 4: MAPEO Y COMPARACIÓN
console.log('\n🔗 PASO 4: MAPEO Y COMPARACIÓN DETALLADA...\n');
console.log('='.repeat(100) + '\n');

const mappingEsperado = {
  'PanelDistribuidores': {
    hojaExcel: 'distribuidores_oc',
    descripcion: 'Gestión de órdenes de compra a distribuidores',
    columnasEsperadas: ['OC', 'Fecha', 'Origen', 'Cantidad', 'Costo Distribuidor', 'Costo Transporte', 'Costo Por Unidad', 'Stock Actual', 'Costo Total', 'Pago a Distribuidor', 'Deuda']
  },
  'PanelOrdenesCompra': {
    hojaExcel: 'distribuidores_oc',
    descripcion: 'Panel de órdenes de compra',
    columnasEsperadas: ['OC', 'Fecha', 'Origen', 'Cantidad', 'Costo Distribuidor', 'Costo Transporte', 'Costo Por Unidad', 'Costo Total']
  },
  'PanelVentas': {
    hojaExcel: 'ventas',
    descripcion: 'Registro de ventas realizadas',
    columnasEsperadas: ['Fecha', 'OC Relacionada', 'Cantidad', 'Cliente', 'Boveda Monte', 'Precio Venta', 'Ingreso', 'Flete', 'Flete Utilidad', 'Utilidad', 'Estatus']
  },
  'PanelBovedaMonte': {
    hojaExcel: 'boveda_monte',
    descripcion: 'Control de stock en Boveda Monte',
    columnasEsperadas: ['Fecha', 'Concepto', 'Entrada', 'Salida', 'Saldo', 'Notas']
  },
  'PanelBovedaUSA': {
    hojaExcel: 'boveda_usa',
    descripcion: 'Control de stock en Boveda USA',
    columnasEsperadas: ['Fecha', 'Concepto', 'Entrada', 'Salida', 'Saldo', 'Notas']
  },
  'PanelBovedaUSASupremo': {
    hojaExcel: 'boveda_usa_supremo',
    descripcion: 'Control de stock en Boveda USA Supremo',
    columnasEsperadas: ['Fecha', 'Concepto', 'Entrada', 'Salida', 'Saldo', 'Notas']
  },
  'PanelAlmacen': {
    hojaExcel: 'almacen',
    descripcion: 'Inventario general del almacén',
    columnasEsperadas: ['Producto', 'Ubicación', 'Stock Actual', 'Stock Mínimo', 'Última Actualización']
  },
  'PanelAzteca': {
    hojaExcel: 'banco_azteca',
    descripcion: 'Movimientos bancarios Azteca',
    columnasEsperadas: ['Fecha', 'Concepto', 'Ingreso', 'Egreso', 'Saldo', 'Notas']
  },
  'PanelLeftie': {
    hojaExcel: 'banco_leftie',
    descripcion: 'Movimientos bancarios Leftie',
    columnasEsperadas: ['Fecha', 'Concepto', 'Ingreso', 'Egreso', 'Saldo', 'Notas']
  },
  'PanelFleteSur': {
    hojaExcel: 'flete_sur',
    descripcion: 'Control de gastos de flete',
    columnasEsperadas: ['Fecha', 'OC', 'Destino', 'Costo', 'Estado', 'Notas']
  },
  'PanelGYA': {
    hojaExcel: 'gastos_abonos',
    descripcion: 'Gastos y abonos generales',
    columnasEsperadas: ['Fecha', 'Concepto', 'Tipo', 'Monto', 'Categoría', 'Notas']
  },
  'PanelUtilidades': {
    hojaExcel: 'ventas',
    descripcion: 'Cálculo de utilidades por venta',
    columnasEsperadas: ['Fecha', 'Cliente', 'Ingreso', 'Costo', 'Utilidad', 'Margen %']
  },
  'PanelProfit': {
    hojaExcel: 'ventas',
    descripcion: 'Análisis de rentabilidad global',
    columnasEsperadas: ['Periodo', 'Ingresos Totales', 'Costos Totales', 'Utilidad Neta', 'Margen']
  },
  'PanelVentaLocal': {
    hojaExcel: 'venta_local',
    descripcion: 'Ventas realizadas localmente',
    columnasEsperadas: ['Fecha', 'Cliente', 'Cantidad', 'Precio', 'Total', 'Estatus']
  }
};

const reporteCompleto = [];

Object.entries(mappingEsperado).forEach(([nombrePanel, config]) => {
  console.log(`📊 ${nombrePanel}`);
  console.log('-'.repeat(100));
  console.log(`   Descripción: ${config.descripcion}`);
  console.log(`   Hoja Excel esperada: ${config.hojaExcel}`);

  const panelInfo = analisisPaneles[nombrePanel];
  const excelInfo = estructuraExcel[config.hojaExcel];

  const problemas = [];

  // Verificar si existe la hoja en Excel
  if (!excelInfo) {
    problemas.push({
      tipo: 'CRÍTICO',
      mensaje: `La hoja "${config.hojaExcel}" no existe en el Excel`
    });
    console.log(`   ❌ CRÍTICO: Hoja "${config.hojaExcel}" no encontrada en Excel`);
  }

  // Verificar si el panel existe
  if (!panelInfo) {
    problemas.push({
      tipo: 'CRÍTICO',
      mensaje: 'El panel no tiene columnas implementadas'
    });
    console.log(`   ❌ CRÍTICO: Panel sin columnas implementadas`);
  }

  // Comparar columnas
  if (panelInfo && excelInfo) {
    const columnasExcel = excelInfo.headers;
    const columnasPanel = panelInfo.columnas;

    console.log(`\n   📋 Columnas esperadas (${config.columnasEsperadas.length}): ${config.columnasEsperadas.join(', ')}`);
    console.log(`   📄 Columnas en Excel (${columnasExcel.length}): ${columnasExcel.join(', ')}`);
    console.log(`   🎨 Columnas en Panel (${columnasPanel.length}): ${columnasPanel.length > 0 ? columnasPanel.join(', ') : 'NINGUNA'}`);

    // Columnas faltantes
    const faltantes = config.columnasEsperadas.filter(col => {
      const normalizada = col.toLowerCase().trim();
      return !columnasPanel.some(pc => pc.toLowerCase().includes(normalizada) || normalizada.includes(pc.toLowerCase()));
    });

    if (faltantes.length > 0) {
      problemas.push({
        tipo: 'ALTA',
        mensaje: `Faltan ${faltantes.length} columnas esperadas`,
        columnas: faltantes
      });
      console.log(`\n   ⚠️  COLUMNAS FALTANTES (${faltantes.length}):`);
      faltantes.forEach(col => console.log(`      - ${col}`));
    } else if (columnasPanel.length > 0) {
      console.log(`\n   ✅ Todas las columnas esperadas están implementadas`);
    }

    // Datos en Excel vs Panel
    console.log(`\n   📊 Registros en Excel: ${excelInfo.totalRegistros}`);
    console.log(`   💾 Fuente de datos del panel: ${panelInfo.fuenteDatos}`);
    console.log(`   📈 Tiene gráficos: ${panelInfo.tieneGraficos ? '✓' : '✗'}`);
    console.log(`   📝 Tiene formularios: ${panelInfo.tieneFormularios ? '✓' : '✗'}`);
  }

  if (problemas.length > 0) {
    reporteCompleto.push({
      panel: nombrePanel,
      problemas,
      gravedad: problemas.some(p => p.tipo === 'CRÍTICO') ? 'CRÍTICA' : 'ALTA'
    });
  }

  console.log('\n');
});

// PASO 5: RESUMEN EJECUTIVO
console.log('\n' + '='.repeat(100));
console.log('📈 RESUMEN EJECUTIVO');
console.log('='.repeat(100) + '\n');

const totalPaneles = Object.keys(mappingEsperado).length;
const panelesConProblemas = reporteCompleto.length;
const panelesCompletos = totalPaneles - panelesConProblemas;

console.log(`📊 ESTADÍSTICAS GENERALES:`);
console.log(`   ├─ Total de paneles analizados: ${totalPaneles}`);
console.log(`   ├─ Paneles completos: ${panelesCompletos} (${Math.round(panelesCompletos/totalPaneles*100)}%)`);
console.log(`   ├─ Paneles con problemas: ${panelesConProblemas} (${Math.round(panelesConProblemas/totalPaneles*100)}%)`);
console.log(`   └─ Hojas en Excel: ${hojasExcel.length}`);

console.log(`\n🚨 PROBLEMAS POR GRAVEDAD:`);
const criticos = reporteCompleto.filter(r => r.gravedad === 'CRÍTICA').length;
const altos = reporteCompleto.filter(r => r.gravedad === 'ALTA').length;
console.log(`   ├─ Críticos: ${criticos}`);
console.log(`   └─ Altos: ${altos}`);

if (reporteCompleto.length > 0) {
  console.log(`\n❌ PANELES CON PROBLEMAS:\n`);
  reporteCompleto.forEach((r, idx) => {
    console.log(`${idx + 1}. ${r.panel} [${r.gravedad}]`);
    r.problemas.forEach(p => {
      console.log(`   ├─ ${p.tipo}: ${p.mensaje}`);
      if (p.columnas) {
        p.columnas.forEach((col, i) => {
          const prefix = i === p.columnas.length - 1 ? '└─' : '├─';
          console.log(`   │  ${prefix} ${col}`);
        });
      }
    });
    console.log('');
  });
}

// PASO 6: RECOMENDACIONES
console.log('\n' + '='.repeat(100));
console.log('💡 RECOMENDACIONES');
console.log('='.repeat(100) + '\n');

console.log('1. PRIORIDAD ALTA: Completar paneles sin implementación de columnas');
console.log('   Paneles afectados:', reporteCompleto.filter(r => r.gravedad === 'CRÍTICA').map(r => r.panel).join(', '));

console.log('\n2. Verificar mapping entre hojas Excel y paneles');
console.log('   Algunas hojas esperadas no existen en el Excel actual');

console.log('\n3. Implementar columnas faltantes en paneles existentes');
console.log('   Total de columnas faltantes:', reporteCompleto.reduce((sum, r) => {
  const cols = r.problemas.find(p => p.columnas);
  return sum + (cols ? cols.columnas.length : 0);
}, 0));

console.log('\n4. Agregar funcionalidades complementarias:');
console.log('   - Gráficos para mejor visualización');
console.log('   - Formularios para edición de datos');
console.log('   - Exportación a Excel/PDF');

// Guardar reporte
const reporteFinal = {
  timestamp: new Date().toISOString(),
  resumen: {
    totalPaneles,
    panelesCompletos,
    panelesConProblemas,
    porcentajeCompletitud: Math.round(panelesCompletos/totalPaneles*100)
  },
  estructuraExcel,
  analisisPaneles,
  reporteCompleto
};

fs.writeFileSync(
  path.join(__dirname, 'reporte-detallado-completo.json'),
  JSON.stringify(reporteFinal, null, 2)
);

console.log('\n💾 Reporte JSON guardado en: scripts/reporte-detallado-completo.json');
console.log('\n' + '='.repeat(100) + '\n');
