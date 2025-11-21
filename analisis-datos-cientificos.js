// 🔬 ANÁLISIS CIENTÍFICO COMPLETO DE DATOS EXCEL
// Filtra registros con valores 0, null, '' y analiza estructuras complejas
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Leer archivo JSON
const dataPath = path.join(
  __dirname,
  'src/apps/FlowDistributor/chronos-system/gg/datos_excel_reales_completos_Version2.json'
);
const rawData = fs.readFileSync(dataPath, 'utf-8');
const data = JSON.parse(rawData);

console.log('╔══════════════════════════════════════════════════════════════╗');
console.log('║  🔬 ANÁLISIS CIENTÍFICO COMPLETO - DATOS EXCEL REALES       ║');
console.log('╚══════════════════════════════════════════════════════════════╝\n');

// ========================================
// 1. RF ACTUAL - STOCK/SALDO DE CADA BANCO
// ========================================
console.log('┌─────────────────────────────────────────────────────────────┐');
console.log('│ 1️⃣  RF ACTUAL (Stock/Saldo de cada Banco)                  │');
console.log('└─────────────────────────────────────────────────────────────┘');

const rfActual = data.rfActual;
console.log(
  `\n✅ TOTAL SISTEMA: $${rfActual.totalSistema.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`
);
console.log('\n📊 RF por Banco:');
Object.entries(rfActual.bovedas).forEach(([banco, valor]) => {
  const emoji = valor > 0 ? '✅' : valor < 0 ? '❌' : '⚠️';
  const signo = valor >= 0 ? '+' : '';
  console.log(
    `  ${emoji} ${banco.padEnd(20)}: ${signo}$${valor.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`
  );
});

// ========================================
// 2. CONTROL MAESTRO - VENTAS VÁLIDAS
// ========================================
console.log('\n\n┌─────────────────────────────────────────────────────────────┐');
console.log('│ 2️⃣  CONTROL MAESTRO - VENTAS (Filtro Científico)           │');
console.log('└─────────────────────────────────────────────────────────────┘');

const ventasTotal = data.controlMaestro.length;
const ventasValidas = data.controlMaestro.filter((v) => {
  return (
    v.fecha && v.cliente && v.cliente !== '' && v.cliente !== '0' && v.cantidad > 0 && v.ingreso > 0
  );
});

console.log(`\n📈 Total registros en JSON: ${ventasTotal}`);
console.log(`✅ Ventas VÁLIDAS (con datos reales): ${ventasValidas.length}`);
console.log(`❌ Ventas INVÁLIDAS (0, null, vacías): ${ventasTotal - ventasValidas.length}`);

// Estadísticas de ventas válidas
const totalIngresos = ventasValidas.reduce((sum, v) => sum + (v.ingreso || 0), 0);
const totalUtilidad = ventasValidas.reduce((sum, v) => sum + (v.utilidad || 0), 0);
const totalFlete = ventasValidas.reduce((sum, v) => sum + (v.fleteUtilidad || 0), 0);

console.log(`\n💰 Total Ingresos: $${totalIngresos.toLocaleString('es-MX')}`);
console.log(`📊 Total Utilidad: $${totalUtilidad.toLocaleString('es-MX')}`);
console.log(`🚚 Total Flete: $${totalFlete.toLocaleString('es-MX')}`);

// Distribución por panel
const ventasPorPanel = {};
ventasValidas.forEach((v) => {
  if (v.panel) {
    ventasPorPanel[v.panel] = (ventasPorPanel[v.panel] || 0) + 1;
  }
});

console.log('\n📍 Distribución por Panel:');
Object.entries(ventasPorPanel)
  .sort((a, b) => b[1] - a[1])
  .forEach(([panel, count]) => {
    console.log(`  • ${panel.padEnd(20)}: ${count} ventas`);
  });

// ========================================
// 3. TABLA GYA - GASTOS Y ABONOS
// ========================================
console.log('\n\n┌─────────────────────────────────────────────────────────────┐');
console.log('│ 3️⃣  TABLA GYA - GASTOS Y ABONOS (Filtro Científico)        │');
console.log('└─────────────────────────────────────────────────────────────┘');

const gyaTotal = data.tablaGYA.length;
const gyaValidos = data.tablaGYA.filter((g) => {
  return g.fecha && g.valor > 0 && g.destino && g.destino !== '' && g.destino !== '0';
});

const abonos = gyaValidos.filter((g) => g.tipo === 'abono');
const gastos = gyaValidos.filter((g) => g.tipo === 'gasto');

console.log(`\n📊 Total registros en JSON: ${gyaTotal}`);
console.log(`✅ Movimientos VÁLIDOS: ${gyaValidos.length}`);
console.log(`❌ Movimientos INVÁLIDOS: ${gyaTotal - gyaValidos.length}`);
console.log(`\n  💵 Abonos válidos: ${abonos.length}`);
console.log(`  💸 Gastos válidos: ${gastos.length}`);

// Total valores
const totalAbonos = abonos.reduce((sum, a) => sum + (a.valor || 0), 0);
const totalGastos = gastos.reduce((sum, g) => sum + (g.valor || 0), 0);

console.log(`\n💰 Total Abonos: $${totalAbonos.toLocaleString('es-MX')}`);
console.log(`💸 Total Gastos: $${totalGastos.toLocaleString('es-MX')}`);
console.log(`📊 Balance GYA: $${(totalAbonos - totalGastos).toLocaleString('es-MX')}`);

// Distribución por destino
const gyaPorDestino = {};
gyaValidos.forEach((g) => {
  if (g.destino) {
    gyaPorDestino[g.destino] = (gyaPorDestino[g.destino] || 0) + 1;
  }
});

console.log('\n📍 Distribución por Destino:');
Object.entries(gyaPorDestino)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 10)
  .forEach(([destino, count]) => {
    console.log(`  • ${destino.padEnd(20)}: ${count} movimientos`);
  });

// ========================================
// 4. DISTRIBUIDORES - ÓRDENES DE COMPRA
// ========================================
console.log('\n\n┌─────────────────────────────────────────────────────────────┐');
console.log('│ 4️⃣  DISTRIBUIDORES - ÓRDENES DE COMPRA (Filtro Científico) │');
console.log('└─────────────────────────────────────────────────────────────┘');

const distribTotal = data.distribuidores.length;
const distribValidos = data.distribuidores.filter((d) => {
  return d.Cantidad > 0 && d['Costo Total'] > 0 && d.Origen && d.Origen !== '' && d.Origen !== '0';
});

console.log(`\n📦 Total registros en JSON: ${distribTotal}`);
console.log(`✅ Órdenes VÁLIDAS: ${distribValidos.length}`);
console.log(`❌ Órdenes INVÁLIDAS: ${distribTotal - distribValidos.length}`);

// Distribuidores únicos
const distribUnicos = [...new Set(distribValidos.map((d) => d.Origen))];
console.log(`\n👤 Distribuidores únicos: ${distribUnicos.length}`);
distribUnicos.forEach((dist) => {
  const ordenes = distribValidos.filter((d) => d.Origen === dist);
  const totalCompra = ordenes.reduce((sum, o) => sum + (o['Costo Total'] || 0), 0);
  console.log(
    `  • ${dist.padEnd(20)}: ${ordenes.length} OC - $${totalCompra.toLocaleString('es-MX')}`
  );
});

// ========================================
// 5. CLIENTES - DEUDA/ABONOS
// ========================================
console.log('\n\n┌─────────────────────────────────────────────────────────────┐');
console.log('│ 5️⃣  CLIENTES - DEUDA Y ABONOS (Filtro Científico)          │');
console.log('└─────────────────────────────────────────────────────────────┘');

const clientesTotal = data.clientes.length;
const clientesValidos = data.clientes.filter((c) => {
  return (
    c.Cliente &&
    c.Cliente !== '' &&
    c.Cliente !== '0' &&
    (c.Deuda > 0 || c.Abonos > 0 || c.Pendiente !== 0)
  );
});

console.log(`\n👥 Total registros en JSON: ${clientesTotal}`);
console.log(`✅ Clientes VÁLIDOS (con movimientos): ${clientesValidos.length}`);
console.log(`❌ Clientes INVÁLIDOS/VACÍOS: ${clientesTotal - clientesValidos.length}`);

// Estadísticas de clientes
const totalDeuda = clientesValidos.reduce((sum, c) => sum + (c.Deuda || 0), 0);
const totalAbonosClientes = clientesValidos.reduce((sum, c) => sum + (c.Abonos || 0), 0);
const totalPendiente = clientesValidos.reduce((sum, c) => sum + (c.Pendiente || 0), 0);

console.log(`\n💰 Deuda Total: $${totalDeuda.toLocaleString('es-MX')}`);
console.log(`💵 Abonos Total: $${totalAbonosClientes.toLocaleString('es-MX')}`);
console.log(`📊 Saldo Pendiente: $${totalPendiente.toLocaleString('es-MX')}`);

// Clasificación
const deudores = clientesValidos.filter((c) => c.Pendiente > 0);
const alDia = clientesValidos.filter((c) => c.Pendiente === 0);
const saldoFavor = clientesValidos.filter((c) => c.Pendiente < 0);

console.log(`\n📊 Clasificación:`);
console.log(`  ❌ Deudores: ${deudores.length} clientes`);
console.log(`  ✅ Al día: ${alDia.length} clientes`);
console.log(`  💚 Saldo a favor: ${saldoFavor.length} clientes`);

// ========================================
// 6. RESUMEN EJECUTIVO
// ========================================
console.log('\n\n╔══════════════════════════════════════════════════════════════╗');
console.log('║  📋 RESUMEN EJECUTIVO - VALIDACIÓN DE EXPECTATIVAS         ║');
console.log('╚══════════════════════════════════════════════════════════════╝\n');

console.log('┌────────────────────────────┬──────────┬──────────┬──────────┐');
console.log('│ Concepto                   │ Esperado │ Real     │ Match    │');
console.log('├────────────────────────────┼──────────┼──────────┼──────────┤');
console.log(
  `│ Clientes válidos           │   31     │  ${clientesValidos.length.toString().padStart(3)}     │ ${clientesValidos.length === 31 ? '✅' : '⚠️'}       │`
);
console.log(
  `│ Órdenes de Compra          │    9     │  ${distribValidos.length.toString().padStart(3)}     │ ${distribValidos.length === 9 ? '✅' : '⚠️'}       │`
);
console.log(
  `│ Distribuidores únicos      │  2-6     │  ${distribUnicos.length.toString().padStart(3)}     │ ${distribUnicos.length >= 2 && distribUnicos.length <= 6 ? '✅' : '⚠️'}       │`
);
console.log(
  `│ Gastos y Abonos            │  ~306    │  ${gyaValidos.length.toString().padStart(3)}     │ ${Math.abs(gyaValidos.length - 306) <= 20 ? '✅' : '⚠️'}       │`
);
console.log(
  `│ Ventas                     │   96     │  ${ventasValidas.length.toString().padStart(3)}     │ ${ventasValidas.length === 96 ? '✅' : '⚠️'}       │`
);
console.log('└────────────────────────────┴──────────┴──────────┴──────────┘');

console.log('\n📌 NOTAS IMPORTANTES:');
console.log('  • RF Actual = Stock/Saldo actual de cada banco (USD) y Almacén (unidades)');
console.log('  • Registros con valor 0, null o vacíos NO se cuentan como válidos');
console.log('  • Cada banco debe tener 3 tablas: Ingresos, Gastos, RF Actual + Cortes');
console.log('  • Los datos de panel-*-manual_Version2.json son la FUENTE DE VERDAD');

console.log('\n✅ Análisis científico completado.\n');
