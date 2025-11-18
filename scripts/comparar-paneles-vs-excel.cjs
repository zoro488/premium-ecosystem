const fs = require('fs');
const path = require('path');

console.log('\n' + '='.repeat(120));
console.log('🔍 COMPARACIÓN DETALLADA: PANELES vs EXCEL');
console.log('='.repeat(120) + '\n');

// Cargar análisis de Control_Maestro
const controlMaestro = JSON.parse(fs.readFileSync('scripts/analisis-control-maestro-detallado.json', 'utf8'));

// Campos del Excel para VENTAS
const camposExcelVentas = controlMaestro.ventas.columnas.map(c => c.nombre);

console.log('📊 CAMPOS EN EXCEL (VENTAS):');
camposExcelVentas.forEach((campo, idx) => {
  console.log(`   ${idx + 1}. ${campo}`);
});

// Leer PanelVentas
const panelVentas = fs.readFileSync('src/apps/FlowDistributor/components/PanelVentas.jsx', 'utf8');

// Campos del panel (buscar en formulario)
const camposPanelVentas = [];
const formMatch = panelVentas.match(/setFormulario\({([^}]+)}\)/);
if (formMatch) {
  const formFields = formMatch[1].match(/(\w+):/g);
  if (formFields) {
    formFields.forEach(field => {
      const fieldName = field.replace(':', '').trim();
      if (!camposPanelVentas.includes(fieldName)) {
        camposPanelVentas.push(fieldName);
      }
    });
  }
}

console.log('\n📱 CAMPOS EN PANEL (VENTAS):');
console.log(`   Total encontrados: ${camposPanelVentas.length}`);
camposPanelVentas.forEach((campo, idx) => {
  console.log(`   ${idx + 1}. ${campo}`);
});

// Comparar
console.log('\n' + '='.repeat(120));
console.log('⚠️  CAMPOS FALTANTES EN PANEL');
console.log('='.repeat(120) + '\n');

// Mapping de nombres Excel a camelCase
const mapping = {
  'Fecha': 'fecha',
  'OC Relacionada': 'ocRelacionada',
  'Cantidad': 'cantidad',
  'Cliente': 'cliente',
  'Bóveda Monte': 'bovedaMonte',
  'Precio De Venta': 'precioDeVenta',
  'Ingreso': 'ingreso',
  'Flete': 'flete',
  'Flete Utilidad': 'fleteUtilidad',
  'Utilidad': 'utilidad',
  'Estatus': 'estatus',
  'Concepto': 'concepto'
};

const faltantes = [];
const implementados = [];

Object.entries(mapping).forEach(([campoExcel, campoCamelCase]) => {
  const estaEnPanel = panelVentas.includes(campoCamelCase);

  if (!estaEnPanel) {
    faltantes.push({ excel: campoExcel, camelCase: campoCamelCase });
  } else {
    implementados.push({ excel: campoExcel, camelCase: campoCamelCase });
  }
});

console.log('✅ CAMPOS IMPLEMENTADOS:');
implementados.forEach(campo => {
  console.log(`   ✓ ${campo.excel} (${campo.camelCase})`);
});

console.log(`\n❌ CAMPOS FALTANTES (${faltantes.length}):`);
faltantes.forEach(campo => {
  console.log(`   ✗ ${campo.excel} (${campo.camelCase})`);
});

// Guardar reporte
const reporte = {
  panelVentas: {
    camposExcel: camposExcelVentas,
    camposPanelVentas,
    faltantes,
    implementados,
    porcentaje: Math.round((implementados.length / Object.keys(mapping).length) * 100)
  }
};

fs.writeFileSync('scripts/reporte-campos-faltantes-paneles.json', JSON.stringify(reporte, null, 2));

console.log(`\n📊 COMPLETITUD: ${reporte.panelVentas.porcentaje}%`);
console.log(`\n💾 Reporte guardado en: scripts/reporte-campos-faltantes-paneles.json`);
console.log('\n' + '='.repeat(120) + '\n');
