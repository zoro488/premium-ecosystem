const fs = require('fs');
const path = require('path');

console.log('='.repeat(80));
console.log('ANÁLISIS COMPLETO: DATOS EXCEL VS PANELES FLOWDISTRIBUTOR');
console.log('='.repeat(80));

// 1. ANALIZAR DATOS EXCEL COMPLETOS
console.log('\n📊 PASO 1: ANALIZANDO ESTRUCTURA DE DATOS EXCEL...\n');

const datosExcel = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../datos_excel_completos.json'), 'utf8')
);

const hojasExcel = Object.keys(datosExcel).filter(k => k !== 'metadata');

console.log(`Total de hojas en Excel: ${hojasExcel.length}\n`);

const estructuraExcel = {};
hojasExcel.forEach(hoja => {
  if (Array.isArray(datosExcel[hoja]) && datosExcel[hoja].length > 0) {
    estructuraExcel[hoja] = {
      totalFilas: datosExcel[hoja].length,
      columnas: Object.keys(datosExcel[hoja][0]),
      primeraFila: datosExcel[hoja][0]
    };
    console.log(`📄 ${hoja}:`);
    console.log(`   Filas: ${estructuraExcel[hoja].totalFilas}`);
    console.log(`   Columnas: ${estructuraExcel[hoja].columnas.join(', ')}`);
    console.log('');
  }
});

// 2. ANALIZAR PANELES IMPLEMENTADOS
console.log('\n🎨 PASO 2: ANALIZANDO PANELES IMPLEMENTADOS...\n');

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

paneles.forEach(panel => {
  const rutaPanel = path.join(__dirname, '../src/apps/FlowDistributor/components', `${panel}.jsx`);

  if (fs.existsSync(rutaPanel)) {
    const contenido = fs.readFileSync(rutaPanel, 'utf8');

    // Extraer columnas definidas en el panel
    const columnasMatch = contenido.match(/const columns = \[([\s\S]*?)\];/);
    const columnas = [];

    if (columnasMatch) {
      const columnasStr = columnasMatch[1];
      const headersMatch = columnasStr.matchAll(/header:\s*['"]([^'"]+)['"]/g);
      for (const match of headersMatch) {
        columnas.push(match[1]);
      }
    }

    // Buscar qué hook o datos usa
    const hookMatch = contenido.match(/use(\w+)\(/);
    const dataMatch = contenido.match(/datos\s*=\s*([^;]+)/);

    analisisPaneles[panel] = {
      columnas,
      totalColumnas: columnas.length,
      usaHook: hookMatch ? hookMatch[1] : 'No detectado',
      fuenteDatos: dataMatch ? dataMatch[1].substring(0, 50) : 'No detectado'
    };

    console.log(`✓ ${panel}:`);
    console.log(`   Columnas implementadas: ${columnas.length}`);
    if (columnas.length > 0) {
      console.log(`   ${columnas.join(', ')}`);
    }
    console.log('');
  }
});

// 3. COMPARACIÓN Y DETECCIÓN DE FALTANTES
console.log('\n⚠️  PASO 3: COMPARACIÓN Y DETECCIÓN DE DATOS FALTANTES...\n');
console.log('='.repeat(80));

const mappingExcelPanel = {
  'Banco Azteca': 'PanelAzteca',
  'Banco LeftieÉ': 'PanelLeftie',
  'ALMACEN': 'PanelAlmacen',
  'Boveda USA': 'PanelBovedaUSA',
  'Boveda Monte': 'PanelBovedaMonte',
  'Boveda USA Supremo': 'PanelBovedaUSASupremo',
  'Distribuidores': 'PanelDistribuidores',
  'Flete Sur': 'PanelFleteSur',
  'Ganancia y Ahorro': 'PanelGYA',
  'Profit': 'PanelProfit',
  'Utilidades': 'PanelUtilidades',
  'Ordenes de compra': 'PanelOrdenesCompra',
  'Ventas': 'PanelVentas',
  'Venta Local': 'PanelVentaLocal'
};

const reporteFaltantes = [];

Object.entries(mappingExcelPanel).forEach(([hojaExcel, nombrePanel]) => {
  console.log(`\n📋 ${nombrePanel} ← ${hojaExcel}`);
  console.log('-'.repeat(80));

  const datosExcelHoja = estructuraExcel[hojaExcel];
  const datosPanel = analisisPaneles[nombrePanel];

  if (!datosExcelHoja) {
    console.log(`   ❌ ERROR: No se encontró la hoja "${hojaExcel}" en Excel`);
    reporteFaltantes.push({
      panel: nombrePanel,
      error: `Hoja "${hojaExcel}" no existe en Excel`,
      gravedad: 'CRÍTICA'
    });
    return;
  }

  if (!datosPanel) {
    console.log(`   ❌ ERROR: Panel "${nombrePanel}" no encontrado`);
    reporteFaltantes.push({
      panel: nombrePanel,
      error: 'Panel no existe en el sistema',
      gravedad: 'CRÍTICA'
    });
    return;
  }

  const columnasExcel = datosExcelHoja.columnas;
  const columnasPanel = datosPanel.columnas;

  console.log(`   Excel tiene: ${columnasExcel.length} columnas`);
  console.log(`   Panel tiene: ${columnasPanel.length} columnas`);

  // Detectar columnas faltantes en el panel
  const columnasFaltantes = columnasExcel.filter(col => {
    // Normalizar nombres para comparación
    const normalizada = col.toLowerCase().trim();
    return !columnasPanel.some(panelCol =>
      panelCol.toLowerCase().includes(normalizada) ||
      normalizada.includes(panelCol.toLowerCase())
    );
  });

  if (columnasFaltantes.length > 0) {
    console.log(`\n   ⚠️  COLUMNAS FALTANTES EN PANEL (${columnasFaltantes.length}):`);
    columnasFaltantes.forEach(col => {
      console.log(`      - ${col}`);
    });

    reporteFaltantes.push({
      panel: nombrePanel,
      hojaExcel,
      columnasFaltantes,
      totalFaltantes: columnasFaltantes.length,
      gravedad: columnasFaltantes.length > 3 ? 'ALTA' : 'MEDIA'
    });
  } else {
    console.log(`   ✅ Todas las columnas de Excel están implementadas`);
  }

  // Detectar columnas extra en el panel
  const columnasExtra = columnasPanel.filter(col => {
    const normalizada = col.toLowerCase().trim();
    return !columnasExcel.some(excelCol =>
      excelCol.toLowerCase().includes(normalizada) ||
      normalizada.includes(excelCol.toLowerCase())
    );
  });

  if (columnasExtra.length > 0) {
    console.log(`\n   ℹ️  COLUMNAS EXTRA EN PANEL (no en Excel):`);
    columnasExtra.forEach(col => {
      console.log(`      + ${col}`);
    });
  }

  console.log(`\n   📊 Datos en Excel: ${datosExcelHoja.totalFilas} filas`);
});

// 4. REPORTE FINAL
console.log('\n\n');
console.log('='.repeat(80));
console.log('📊 REPORTE FINAL DE INCONSISTENCIAS');
console.log('='.repeat(80));

if (reporteFaltantes.length === 0) {
  console.log('\n✅ ¡PERFECTO! No se detectaron inconsistencias.');
} else {
  console.log(`\n❌ Se detectaron ${reporteFaltantes.length} paneles con problemas:\n`);

  reporteFaltantes.forEach((reporte, idx) => {
    console.log(`${idx + 1}. ${reporte.panel} [${reporte.gravedad}]`);
    if (reporte.error) {
      console.log(`   Error: ${reporte.error}`);
    }
    if (reporte.columnasFaltantes) {
      console.log(`   Faltan ${reporte.totalFaltantes} columnas:`);
      reporte.columnasFaltantes.forEach(col => {
        console.log(`      - ${col}`);
      });
    }
    console.log('');
  });
}

// 5. GUARDAR REPORTE EN JSON
const reporteJSON = {
  timestamp: new Date().toISOString(),
  estructuraExcel,
  analisisPaneles,
  reporteFaltantes,
  resumen: {
    totalHojasExcel: hojasExcel.length,
    totalPanelesImplementados: Object.keys(analisisPaneles).length,
    panelesConProblemas: reporteFaltantes.length,
    panelesCompletos: Object.keys(analisisPaneles).length - reporteFaltantes.length
  }
};

fs.writeFileSync(
  path.join(__dirname, 'reporte-analisis-completo.json'),
  JSON.stringify(reporteJSON, null, 2)
);

console.log('💾 Reporte detallado guardado en: scripts/reporte-analisis-completo.json');
console.log('\n' + '='.repeat(80));
