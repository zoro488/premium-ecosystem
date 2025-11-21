const fs = require('fs');
const path = require('path');

console.log('\n' + '='.repeat(100));
console.log('🔍 ANÁLISIS DETALLADO: CAMPOS EXCEL VS CAMPOS USADOS EN PANELES');
console.log('='.repeat(100) + '\n');

// CARGAR DATOS EXCEL
const datosExcel = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../scripts/analisis_excel_completo.json'), 'utf8')
);

// DEFINIR MAPPING PANEL → HOJA EXCEL
const mapping = {
  PanelDistribuidores: {
    hoja: 'distribuidores_oc',
    descripcion: 'Gestión de distribuidores y órdenes de compra'
  },
  PanelOrdenesCompra: {
    hoja: 'distribuidores_oc',
    descripcion: 'Panel de órdenes de compra'
  },
  PanelVentas: {
    hoja: 'control_maestro_ventas',
    descripcion: 'Registro de ventas'
  }
};

// CAMPOS A BUSCAR POR PANEL (basados en las hojas Excel)
const camposPorHoja = {
  distribuidores_oc: [
    'oc', 'OC',
    'fecha', 'Fecha',
    'origen', 'Origen',
    'cantidad', 'Cantidad',
    'costoDistribuidor', 'Costo Distribuidor',
    'costoTransporte', 'Costo Transporte',
    'costoPorUnidad', 'Costo Por Unidad',
    'stockActual', 'Stock Actual',
    'costoTotal', 'Costo Total',
    'pagoDistribuidor', 'Pago a Distribuidor',
    'deuda', 'Deuda'
  ],
  control_maestro_ventas: [
    'fecha', 'Fecha',
    'ocRelacionada', 'OC Relacionada',
    'cantidad', 'Cantidad',
    'cliente', 'Cliente',
    'bovedaMonte', 'Bóveda Monte',
    'precioVenta', 'Precio De Venta',
    'ingreso', 'Ingreso',
    'flete', 'Flete',
    'fleteUtilidad', 'Flete Utilidad',
    'utilidad', 'Utilidad',
    'estatus', 'Estatus',
    'concepto', 'Concepto'
  ]
};

console.log('📂 ANALIZANDO PANELES...\n');

const resultados = {};

Object.entries(mapping).forEach(([nombrePanel, config]) => {
  const rutaPanel = path.join(__dirname, '../src/apps/FlowDistributor/components', `${nombrePanel}.jsx`);

  if (!fs.existsSync(rutaPanel)) {
    console.log(`❌ ${nombrePanel}: Archivo no encontrado`);
    return;
  }

  const contenido = fs.readFileSync(rutaPanel, 'utf8');
  const hojaExcel = datosExcel[config.hoja];

  if (!hojaExcel) {
    console.log(`❌ ${nombrePanel}: Hoja Excel "${config.hoja}" no encontrada`);
    return;
  }

  console.log(`📊 ${nombrePanel}`);
  console.log('-'.repeat(100));
  console.log(`   Descripción: ${config.descripcion}`);
  console.log(`   Hoja Excel: ${config.hoja}`);
  console.log(`   Columnas en Excel: ${hojaExcel.headers.join(', ')}`);

  // Analizar qué campos están siendo usados
  const camposBuscar = camposPorHoja[config.hoja] || [];
  const camposEncontrados = [];
  const camposFaltantes = [];

  hojaExcel.headers.forEach(header => {
    // Convertir el header a formato camelCase para buscar en el código
    const camelCase = header
      .split(' ')
      .map((word, idx) => {
        if (idx === 0) return word.toLowerCase();
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      })
      .join('');

    // Buscar patrones de uso en el código
    const patterns = [
      new RegExp(`\\.${camelCase}\\b`, 'g'),          // .campoNombre
      new RegExp(`\\b${camelCase}\\s*:`, 'g'),         // campoNombre:
      new RegExp(`\\.${header}\\b`, 'g'),              // .Header Original
      new RegExp(`'${header}'`, 'g'),                  // 'Header Original'
      new RegExp(`"${header}"`, 'g'),                  // "Header Original"
    ];

    let encontrado = false;
    let ocurrencias = 0;

    patterns.forEach(pattern => {
      const matches = contenido.match(pattern);
      if (matches && matches.length > 0) {
        encontrado = true;
        ocurrencias += matches.length;
      }
    });

    if (encontrado) {
      camposEncontrados.push({ campo: header, camelCase, ocurrencias });
    } else {
      camposFaltantes.push({ campo: header, camelCase });
    }
  });

  console.log(`\n   ✅ CAMPOS USADOS (${camposEncontrados.length}/${hojaExcel.headers.length}):`);
  camposEncontrados.forEach(({ campo, camelCase, ocurrencias }) => {
    console.log(`      ✓ ${campo} (.${camelCase}) - ${ocurrencias} usos`);
  });

  if (camposFaltantes.length > 0) {
    console.log(`\n   ❌ CAMPOS NO USADOS (${camposFaltantes.length}):`);
    camposFaltantes.forEach(({ campo, camelCase }) => {
      console.log(`      ✗ ${campo} (.${camelCase})`);
    });
  }

  // Análisis de visualización
  const tieneTabla = contenido.includes('Table') || contenido.includes('DataGrid') || contenido.includes('createColumnHelper');
  const tieneCards = contenido.includes('Card') || contenido.includes('motion.div');
  const tieneGraficos = contenido.includes('Chart') || contenido.includes('Grafico');
  const tieneFormulario = contenido.includes('Form') || contenido.includes('Input');

  console.log(`\n   📊 TIPO DE VISUALIZACIÓN:`);
  console.log(`      ${tieneTabla ? '✓' : '✗'} Tabla de datos`);
  console.log(`      ${tieneCards ? '✓' : '✗'} Cards/Tarjetas`);
  console.log(`      ${tieneGraficos ? '✓' : '✗'} Gráficos`);
  console.log(`      ${tieneFormulario ? '✓' : '✗'} Formularios`);

  resultados[nombrePanel] = {
    hoja: config.hoja,
    totalCampos: hojaExcel.headers.length,
    camposUsados: camposEncontrados.length,
    camposNoUsados: camposFaltantes.length,
    porcentajeUso: Math.round((camposEncontrados.length / hojaExcel.headers.length) * 100),
    visualizacion: {
      tabla: tieneTabla,
      cards: tieneCards,
      graficos: tieneGraficos,
      formularios: tieneFormulario
    },
    camposEncontrados,
    camposFaltantes
  };

  console.log('\n');
});

// RESUMEN GLOBAL
console.log('\n' + '='.repeat(100));
console.log('📈 RESUMEN GLOBAL');
console.log('='.repeat(100) + '\n');

Object.entries(resultados).forEach(([panel, datos]) => {
  const estado = datos.porcentajeUso === 100 ? '✅' : datos.porcentajeUso >= 70 ? '⚠️' : '❌';
  console.log(`${estado} ${panel}: ${datos.porcentajeUso}% de campos implementados (${datos.camposUsados}/${datos.totalCampos})`);
});

console.log('\n📊 ESTADÍSTICAS:');
const totalPaneles = Object.keys(resultados).length;
const panelesCompletos = Object.values(resultados).filter(r => r.porcentajeUso === 100).length;
const panelesParciales = Object.values(resultados).filter(r => r.porcentajeUso >= 70 && r.porcentajeUso < 100).length;
const panelesIncompletos = Object.values(resultados).filter(r => r.porcentajeUso < 70).length;

console.log(`   Total paneles analizados: ${totalPaneles}`);
console.log(`   Completos (100%): ${panelesCompletos}`);
console.log(`   Parciales (70-99%): ${panelesParciales}`);
console.log(`   Incompletos (<70%): ${panelesIncompletos}`);

// Guardar reporte
fs.writeFileSync(
  path.join(__dirname, 'reporte-campos-usados.json'),
  JSON.stringify(resultados, null, 2)
);

console.log('\n💾 Reporte guardado en: scripts/reporte-campos-usados.json');
console.log('\n' + '='.repeat(100) + '\n');
