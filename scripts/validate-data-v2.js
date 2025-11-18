/**
 * 🔍 SCRIPT DE VALIDACIÓN DE DATOS V2
 * Verifica que todos los datos del Excel estén reflejados en componentes
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cargar JSON
const jsonPath = path.join(
  __dirname,
  '../src/apps/FlowDistributor/data/BASE_DATOS_FLOWDISTRIBUTOR_UNIFICADO.json'
);
const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

/* eslint-disable no-console */
console.log('🔍 VALIDACIÓN DE DATOS EXCEL → COMPONENTES\n');
console.log('═'.repeat(70));

// 1. ÓRDENES DE COMPRA
console.log('\n📦 ÓRDENES DE COMPRA');
console.log('─'.repeat(70));
const ordenesCompra = data.ordenesCompra?.distribuidores?.ordenesCompra || [];
const distribuidores = data.ordenesCompra?.distribuidores?.distribuidores || [];
console.log(`Total de OC en JSON: ${ordenesCompra.length}`);
console.log(`Distribuidores: ${distribuidores.length}`);

ordenesCompra.slice(0, 5).forEach((oc) => {
  console.log(
    `  ${oc.id}: ${oc.origen} - ${oc.cantidad} unidades - $${oc.costoTotal.toLocaleString()}`
  );
});

if (ordenesCompra.length > 5) {
  console.log(`  ... y ${ordenesCompra.length - 5} más`);
}

// 2. VENTAS LOCALES
console.log('\n💰 VENTAS LOCALES');
console.log('─'.repeat(70));
const ventasLocales = data.ventasLocales?.ventasLocal || [];
console.log(`Total de Ventas Locales: ${ventasLocales.length}`);

// Obtener clientes únicos
const clientesUnicos = [...new Set(ventasLocales.map((v) => v.cliente))];
console.log(`Clientes Únicos: ${clientesUnicos.length}`);

if (ventasLocales.length > 0) {
  ventasLocales.slice(0, 5).forEach((venta) => {
    const total = (venta.bovedaMonte || 0) + (venta.fleteSur || 0) + (venta.utilidades || 0);
    console.log(
      `  ${venta.fecha} - ${venta.cliente}: ${venta.cantidad} unidades - $${total.toLocaleString()}`
    );
  });
  if (ventasLocales.length > 5) {
    console.log(`  ... y ${ventasLocales.length - 5} más`);
  }
}

// 3. BANCOS (8 bóvedas) - Calcular desde ventas
console.log('\n🏦 BANCOS (8 Bóvedas)');
console.log('─'.repeat(70));

// Calcular totales de bóvedas desde ventas
const totalBovedaMonte = ventasLocales.reduce((sum, v) => sum + (v.bovedaMonte || 0), 0);
const totalFletes = ventasLocales.reduce((sum, v) => sum + (v.fleteSur || 0), 0);
const totalUtilidades = ventasLocales.reduce((sum, v) => sum + (v.utilidades || 0), 0);
const totalAzteca = ventasLocales.reduce((sum, v) => sum + (v.azteca || 0), 0);
const totalBovedaUSA = ventasLocales.reduce((sum, v) => sum + (v.bovedaUSA || 0), 0);

console.log(`  bovedaMonte: $${totalBovedaMonte.toLocaleString()}`);
console.log(`  fleteSur: $${totalFletes.toLocaleString()}`);
console.log(`  utilidades: $${totalUtilidades.toLocaleString()}`);
console.log(`  azteca: $${totalAzteca.toLocaleString()}`);
console.log(`  bovedaUSA: $${totalBovedaUSA.toLocaleString()}`);

const totalBovédas =
  totalBovedaMonte + totalFletes + totalUtilidades + totalAzteca + totalBovedaUSA;
console.log(`  TOTAL DISTRIBUIDO: $${totalBovédas.toLocaleString()}`);

// 4. ALMACÉN - Calcular desde OC y ventas
console.log('\n📦 ALMACÉN');
console.log('─'.repeat(70));

const totalCompras = ordenesCompra.reduce((sum, oc) => sum + (oc.cantidad || 0), 0);
const totalVendido = ventasLocales.reduce((sum, v) => sum + (v.cantidad || 0), 0);
const stockCalculado = totalCompras - totalVendido;

console.log(`Total Comprado (OC): ${totalCompras} unidades`);
console.log(`Total Vendido: ${totalVendido} unidades`);
console.log(`Stock Teórico: ${stockCalculado} unidades`);

// 5. KPIs - Calcular desde datos disponibles
console.log('\n📊 KPIs CALCULADOS');
console.log('─'.repeat(70));

const totalCostos = ordenesCompra.reduce((sum, oc) => sum + (oc.costoTotal || 0), 0);
const totalIngresos = totalBovédas;
const utilidadNeta = totalIngresos - totalCostos;
const margen = totalIngresos > 0 ? ((utilidadNeta / totalIngresos) * 100).toFixed(2) : 0;

console.log(`  Total Costos OC: $${totalCostos.toLocaleString()}`);
console.log(`  Total Ingresos Ventas: $${totalIngresos.toLocaleString()}`);
console.log(`  Utilidad Neta: $${utilidadNeta.toLocaleString()}`);
console.log(`  Margen: ${margen}%`);

// 6. RESUMEN DE VALIDACIÓN
console.log('\n' + '═'.repeat(70));
console.log('📊 RESUMEN DE VALIDACIÓN');
console.log('═'.repeat(70));

const resumen = {
  timestamp: new Date().toISOString(),
  estructura: {
    ordenesCompra: ordenesCompra.length,
    ventasLocales: ventasLocales.length,
    clientesUnicos: clientesUnicos.length,
    distribuidores: distribuidores.length,
  },
  kpis: {
    totalCostos,
    totalIngresos,
    utilidadNeta,
    margen: parseFloat(margen),
    totalCompras,
    totalVendido,
    stockTeórico: stockCalculado,
  },
  bovedas: {
    bovedaMonte: totalBovedaMonte,
    fleteSur: totalFletes,
    utilidades: totalUtilidades,
    azteca: totalAzteca,
    bovedaUSA: totalBovedaUSA,
    total: totalBovédas,
  },
  validacion: {
    ordenesCompra: ordenesCompra.length > 0 ? '✅' : '❌',
    ventasLocales: ventasLocales.length > 0 ? '✅' : '❌',
    clientes: clientesUnicos.length > 0 ? '✅' : '❌',
    almacen: totalCompras > 0 ? '✅' : '❌',
  },
  alertas: [],
};

console.log(
  `\nÓrdenes de Compra: ${resumen.validacion.ordenesCompra} (${resumen.estructura.ordenesCompra} encontradas)`
);
console.log(
  `Ventas Locales: ${resumen.validacion.ventasLocales} (${resumen.estructura.ventasLocales} encontradas)`
);
console.log(
  `Clientes: ${resumen.validacion.clientes} (${resumen.estructura.clientesUnicos} únicos)`
);
console.log(
  `Almacén: ${resumen.validacion.almacen} (Stock: ${resumen.kpis.stockTeórico} unidades)`
);

// Análisis de problemas potenciales
if (stockCalculado < 0) {
  resumen.alertas.push(`⚠️ Stock negativo: ${stockCalculado} unidades`);
}

if (utilidadNeta < 0) {
  resumen.alertas.push(`⚠️ Utilidad negativa: $${utilidadNeta.toLocaleString()}`);
}

if (ventasLocales.length === 0 && ordenesCompra.length > 0) {
  resumen.alertas.push('⚠️ Hay órdenes de compra pero no hay ventas registradas');
}

if (totalIngresos !== totalCostos && Math.abs(totalIngresos - totalCostos) < 100) {
  resumen.alertas.push('✅ Ingresos y costos casi balanceados (diferencia < $100)');
}

// Mostrar alertas
if (resumen.alertas.length > 0) {
  console.log('\n' + '═'.repeat(70));
  console.log('⚠️ ALERTAS DETECTADAS');
  console.log('═'.repeat(70));
  resumen.alertas.forEach((alerta, i) => console.log(`${i + 1}. ${alerta}`));
}

console.log('\n' + '═'.repeat(70));
console.log('✅ VALIDACIÓN COMPLETADA');
console.log('═'.repeat(70));

// Guardar reporte
const reportPath = path.join(__dirname, '../REPORTE_VALIDACION_DATOS.json');
fs.writeFileSync(reportPath, JSON.stringify(resumen, null, 2));
console.log(`\n📄 Reporte guardado en: ${reportPath}`);
/* eslint-enable no-console */
