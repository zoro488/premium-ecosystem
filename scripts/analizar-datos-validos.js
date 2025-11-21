/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 🔍 ANÁLISIS PROFUNDO Y CIENCIA DE DATOS - DATOS EXCEL
 * ═══════════════════════════════════════════════════════════════════════════
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const jsonPath = path.join(
  __dirname,
  '../src/apps/FlowDistributor/chronos-system/gg/datos_excel_reales_completos_Version2.json'
);
const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

console.log(`
╔═══════════════════════════════════════════════════════════════════════════╗
║                    🔬 ANÁLISIS CIENTÍFICO DE DATOS                        ║
╚═══════════════════════════════════════════════════════════════════════════╝
`);

// ═══════════════════════════════════════════════════════════════════════════
// 1. ANÁLISIS DE CLIENTES
// ═══════════════════════════════════════════════════════════════════════════

console.log('\n📊 === CLIENTES ===\n');

const clientesValidos = data.clientes.filter((c) => {
  return (
    c.nombre &&
    c.nombre !== '' &&
    c.nombre !== '0' &&
    c.nombre !== 0 &&
    c.nombre.toString().trim() !== ''
  );
});

console.log(`Total registros en JSON: ${data.clientes.length}`);
console.log(`Clientes VÁLIDOS: ${clientesValidos.length}`);
console.log(`Clientes VACÍOS/CEROS: ${data.clientes.length - clientesValidos.length}`);

console.log('\n✅ Clientes válidos encontrados:');
clientesValidos.forEach((c, i) => {
  const deuda = c.deudaTotal || c.adeudo || 0;
  console.log(`  ${i + 1}. ${c.nombre} - Deuda: $${deuda.toLocaleString()}`);
});

// ═══════════════════════════════════════════════════════════════════════════
// 2. ANÁLISIS DE DISTRIBUIDORES
// ═══════════════════════════════════════════════════════════════════════════

console.log('\n\n📦 === DISTRIBUIDORES ===\n');

const distribuidoresValidos = data.distribuidores.filter((d) => {
  return (
    d.nombre &&
    d.nombre !== '' &&
    d.nombre !== '0' &&
    d.nombre !== 0 &&
    d.nombre.toString().trim() !== ''
  );
});

console.log(`Total registros en JSON: ${data.distribuidores.length}`);
console.log(`Distribuidores VÁLIDOS: ${distribuidoresValidos.length}`);

const distribuidoresConAdeudo = distribuidoresValidos.filter((d) => {
  const adeudo = d.adeudo || d.deudaTotal || 0;
  return adeudo > 0;
});

const distribuidoresSinAdeudo = distribuidoresValidos.filter((d) => {
  const adeudo = d.adeudo || d.deudaTotal || 0;
  return adeudo === 0;
});

console.log(`Distribuidores CON adeudo: ${distribuidoresConAdeudo.length}`);
console.log(`Distribuidores SIN adeudo: ${distribuidoresSinAdeudo.length}`);

console.log('\n✅ Distribuidores con adeudo:');
distribuidoresConAdeudo.forEach((d, i) => {
  const adeudo = d.adeudo || d.deudaTotal || 0;
  console.log(`  ${i + 1}. ${d.nombre} - Adeudo: $${adeudo.toLocaleString()}`);
});

console.log('\n✅ Distribuidores sin adeudo:');
distribuidoresSinAdeudo.forEach((d, i) => {
  console.log(`  ${i + 1}. ${d.nombre}`);
});

// ═══════════════════════════════════════════════════════════════════════════
// 3. ANÁLISIS DE ÓRDENES DE COMPRA
// ═══════════════════════════════════════════════════════════════════════════

console.log('\n\n🛒 === ÓRDENES DE COMPRA ===\n');

// Buscar órdenes de compra en el control maestro
const ordenesCompra = new Set();
data.controlMaestro.forEach((registro) => {
  if (registro.oc) {
    ordenesCompra.add(registro.oc);
  }
});

const ordenesArray = Array.from(ordenesCompra).sort();
console.log(`Total ÓRDENES DE COMPRA únicas: ${ordenesArray.length}`);
console.log('\n✅ Órdenes de compra:');
ordenesArray.forEach((oc, i) => {
  const registros = data.controlMaestro.filter((r) => r.oc === oc);
  const totalCantidad = registros.reduce((sum, r) => sum + (r.cantidad || 0), 0);
  const totalMonto = registros.reduce((sum, r) => sum + (r.costoBovedaMonte || 0), 0);
  console.log(
    `  ${i + 1}. ${oc} - ${registros.length} ventas - ${totalCantidad} unidades - $${totalMonto.toLocaleString()}`
  );
});

// ═══════════════════════════════════════════════════════════════════════════
// 4. ANÁLISIS DE VENTAS
// ═══════════════════════════════════════════════════════════════════════════

console.log('\n\n💰 === VENTAS (Control Maestro) ===\n');

const ventasValidas = data.controlMaestro.filter((v) => {
  return v.cliente && v.cliente !== '' && v.cliente !== '0';
});

console.log(`Total registros de ventas: ${data.controlMaestro.length}`);
console.log(`Ventas VÁLIDAS: ${ventasValidas.length}`);

const ventasPagadas = ventasValidas.filter((v) => v.estatus === 'Pagado');
const ventasPendientes = ventasValidas.filter((v) => v.estatus === 'Pendiente');

console.log(`Ventas PAGADAS: ${ventasPagadas.length}`);
console.log(`Ventas PENDIENTES: ${ventasPendientes.length}`);

const totalVendido = ventasValidas.reduce((sum, v) => sum + (v.ingreso || 0), 0);
const totalUnidades = ventasValidas.reduce((sum, v) => sum + (v.cantidad || 0), 0);

console.log(`\nTotal vendido: $${totalVendido.toLocaleString()}`);
console.log(`Total unidades vendidas: ${totalUnidades}`);

// ═══════════════════════════════════════════════════════════════════════════
// 5. ANÁLISIS DE GASTOS Y ABONOS
// ═══════════════════════════════════════════════════════════════════════════

console.log('\n\n💳 === GASTOS Y ABONOS ===\n');

const gastosAbonos = data.tablaGYA || [];
const gastosAbonosValidos = gastosAbonos.filter((g) => {
  return g.concepto && g.concepto !== '' && g.concepto !== '0';
});

console.log(`Total registros: ${gastosAbonos.length}`);
console.log(`Registros VÁLIDOS: ${gastosAbonosValidos.length}`);

const gastos = gastosAbonosValidos.filter((g) => {
  const tipo = (g.tipo || '').toLowerCase();
  return tipo.includes('gasto') || (g.monto && g.monto < 0);
});

const abonos = gastosAbonosValidos.filter((g) => {
  const tipo = (g.tipo || '').toLowerCase();
  return tipo.includes('abono') || tipo.includes('ingreso') || (g.monto && g.monto > 0);
});

console.log(`GASTOS: ${gastos.length}`);
console.log(`ABONOS: ${abonos.length}`);

// ═══════════════════════════════════════════════════════════════════════════
// 6. ANÁLISIS DE STOCK ACTUAL (RF ACTUAL)
// ═══════════════════════════════════════════════════════════════════════════

console.log('\n\n📦 === STOCK/SALDO ACTUAL DE BANCOS (RF Actual) ===\n');

console.log('🏦 Saldos actuales en USD:');
console.log(`  Total Sistema: $${data.rfActual.totalSistema.toLocaleString()}`);
console.log('\n  Desglose por banco:');
console.log(`    • Almacén Monte: ${data.rfActual.bovedas.almacenMonte} unidades`);
console.log(`    • Bóveda Monte: $${data.rfActual.bovedas.bovedaMonte.toLocaleString()}`);
console.log(`    • Flete Sur: $${data.rfActual.bovedas.fleteSur.toLocaleString()}`);
console.log(`    • Utilidades: $${data.rfActual.bovedas.utilidades.toLocaleString()}`);
console.log(`    • Azteca: $${data.rfActual.bovedas.azteca.toLocaleString()}`);
console.log(`    • Leftie: $${data.rfActual.bovedas.leftie.toLocaleString()}`);
console.log(`    • Profit: $${data.rfActual.bovedas.profit.toLocaleString()}`);
console.log(`    • Bóveda USA: $${data.rfActual.bovedas.bovedaUsa.toLocaleString()}`);

// ═══════════════════════════════════════════════════════════════════════════
// 7. ANÁLISIS DE TABLAS DE BANCOS
// ═══════════════════════════════════════════════════════════════════════════

console.log('\n\n🏦 === TABLAS DE BANCOS (Movimientos Históricos) ===\n');

const bancos = {
  'Almacén Monte': data.almacenmonte || [],
  'Bóveda Monte': data.bovedamonte || [],
  'Bóveda USA': data.bovedausa || [],
  Azteca: data.azteca || [],
  Utilidades: data.utilidades || [],
  'Flete Sur': data.fletesur || [],
  Leftie: data.leftie || [],
  Profit: data.profit || [],
};

Object.entries(bancos).forEach(([nombre, registros]) => {
  console.log(`  ${nombre}: ${registros.length} registros`);
});

// ═══════════════════════════════════════════════════════════════════════════
// 8. RESUMEN EJECUTIVO PARA MIGRACIÓN
// ═══════════════════════════════════════════════════════════════════════════

console.log(`\n
╔═══════════════════════════════════════════════════════════════════════════╗
║                        📋 RESUMEN PARA MIGRACIÓN                          ║
╠═══════════════════════════════════════════════════════════════════════════╣
║ ✅ Clientes válidos: ${String(clientesValidos.length).padStart(3)} (se deben migrar)            ║
║ ✅ Distribuidores válidos: ${String(distribuidoresValidos.length).padStart(1)} (${distribuidoresConAdeudo.length} con adeudo, ${distribuidoresSinAdeudo.length} sin adeudo)    ║
║ ✅ Órdenes de compra: ${String(ordenesArray.length).padStart(2)} únicas                           ║
║ ✅ Ventas (Control Maestro): ${String(ventasValidas.length).padStart(2)}                          ║
║ ✅ Gastos y Abonos: ~${String(gastosAbonosValidos.length).padStart(3)}                             ║
║ ✅ RF Actual (Saldos): 8 bancos con saldos actuales            ║
║ ✅ Tablas Bancos: Movimientos históricos de cada banco         ║
╚═══════════════════════════════════════════════════════════════════════════╝
`);

// Guardar resultado del análisis
const resultado = {
  fecha: new Date().toISOString(),
  datosValidos: {
    clientes: {
      total: clientesValidos.length,
      datos: clientesValidos,
    },
    distribuidores: {
      total: distribuidoresValidos.length,
      conAdeudo: distribuidoresConAdeudo.length,
      sinAdeudo: distribuidoresSinAdeudo.length,
      datos: distribuidoresValidos,
    },
    ordenesCompra: {
      total: ordenesArray.length,
      ordenes: ordenesArray,
    },
    ventas: {
      total: ventasValidas.length,
      pagadas: ventasPagadas.length,
      pendientes: ventasPendientes.length,
      datos: ventasValidas,
    },
    gastosAbonos: {
      total: gastosAbonosValidos.length,
      gastos: gastos.length,
      abonos: abonos.length,
      datos: gastosAbonosValidos,
    },
    rfActual: data.rfActual,
    bancos: Object.entries(bancos).map(([nombre, registros]) => ({
      nombre,
      totalRegistros: registros.length,
    })),
  },
};

const outputPath = path.join(__dirname, '../ANALISIS_DATOS_VALIDOS.json');
fs.writeFileSync(outputPath, JSON.stringify(resultado, null, 2));

console.log(`\n✅ Análisis completo guardado en: ANALISIS_DATOS_VALIDOS.json\n`);

// Verificar datos en Firestore
console.log(`
╔═══════════════════════════════════════════════════════════════════════════╗
║               🔥 SIGUIENTE PASO: VERIFICAR FIRESTORE                      ║
╠═══════════════════════════════════════════════════════════════════════════╣
║ Ejecutar: node scripts/verificar-firestore-datos.js                      ║
║                                                                            ║
║ Esto comparará los datos válidos con lo que existe en Firestore          ║
║ e identificará exactamente qué falta migrar                               ║
╚═══════════════════════════════════════════════════════════════════════════╝
`);
