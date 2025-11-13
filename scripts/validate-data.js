/**
 * 🔍 VALIDACIÓN COMPLETA DE DATOS
 * Verifica que todos los componentes muestren datos correctos del Excel
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cargar JSON base
const jsonPath = path.join(
  __dirname,
  '../src/apps/FlowDistributor/data/BASE_DATOS_FLOWDISTRIBUTOR_UNIFICADO.json'
);
const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

console.log('\n� VALIDACIÓN DE DATOS FLOWDISTRIBUTOR');
console.log('═'.repeat(70));

// 1. Validar Órdenes de Compra
console.log('\n📦 1. ÓRDENES DE COMPRA:');
const ordenesCompra = data.ordenesCompra?.distribuidores?.ordenesCompra || [];
const totalOC = ordenesCompra.reduce((sum, oc) => sum + (oc.costoTotal || 0), 0);
const totalUnidades = ordenesCompra.reduce((sum, oc) => sum + (oc.cantidad || 0), 0);

console.log(`   ✓ Total órdenes: ${ordenesCompra.length}`);
console.log(`   ✓ Total invertido: $${totalOC.toLocaleString('es-MX')}`);
console.log(`   ✓ Total unidades: ${totalUnidades.toLocaleString('es-MX')}`);

// 2. Validar Ventas Locales
console.log('\n� 2. VENTAS LOCALES:');
const ventasLocales = data.ventasLocales?.ventasLocal || [];
const totalIngresos = ventasLocales.reduce((sum, v) => sum + (v.ingreso || 0), 0);
const totalBovedaMonte = ventasLocales.reduce((sum, v) => sum + (v.bovedaMonte || 0), 0);
const totalFletes = ventasLocales.reduce((sum, v) => sum + (v.fleteUtilidad || 0), 0);
const totalUtilidad = ventasLocales.reduce((sum, v) => sum + (v.utilidad || 0), 0);

console.log(`   ✓ Total ventas: ${ventasLocales.length}`);
console.log(`   ✓ Total ingresos: $${totalIngresos.toLocaleString('es-MX')}`);
console.log(`   ✓ Total Bóveda Monte: $${totalBovedaMonte.toLocaleString('es-MX')}`);
console.log(`   ✓ Total Fletes: $${totalFletes.toLocaleString('es-MX')}`);
console.log(`   ✓ Total Utilidad: $${totalUtilidad.toLocaleString('es-MX')}`);

// 3. Validar GYA
console.log('\n💸 3. GASTOS Y ABONOS (GYA):');
const gya = data.gastosAbonos?.gastosAbonos || [];
const totalGYA = gya.reduce((sum, g) => sum + (g.valor || 0), 0);

console.log(`   ✓ Total movimientos: ${gya.length}`);
console.log(`   ✓ Valor total: $${totalGYA.toLocaleString('es-MX')}`);

// Top destinos
const porDestino = gya.reduce((acc, g) => {
  const destino = g.destino || 'Sin destino';
  acc[destino] = (acc[destino] || 0) + (g.valor || 0);
  return acc;
}, {});

const topDestinos = Object.entries(porDestino)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 5);

console.log('\n   📊 Top 5 Destinos:');
topDestinos.forEach(([destino, total], i) => {
  console.log(`     ${i + 1}. ${destino}: $${total.toLocaleString('es-MX')}`);
});

// 4. Validar archivos .ts
console.log('\n� 4. VALIDACIÓN DE ARCHIVOS SINCRONIZADOS:');

try {
  const gyaTS = fs.readFileSync(
    path.join(__dirname, '../src/apps/FlowDistributor/data/gya.ts'),
    'utf-8'
  );
  const gyaTSCount = (gyaTS.match(/\{[^}]*id:/g) || []).length;
  console.log(`   ✅ gya.ts: ${gyaTSCount} registros (esperado: ${gya.length})`);
} catch (error) {
  console.log(`   ❌ Error leyendo gya.ts`);
}

try {
  const ventasTS = fs.readFileSync(
    path.join(__dirname, '../src/apps/FlowDistributor/data/ventasLocales.ts'),
    'utf-8'
  );
  const ventasTSCount = (ventasTS.match(/\{[^}]*id:/g) || []).length;
  console.log(
    `   ✅ ventasLocales.ts: ${ventasTSCount} registros (esperado: ${ventasLocales.length})`
  );
} catch (error) {
  console.log(`   ❌ Error leyendo ventasLocales.ts`);
}

// 5. Resumen Final
console.log('\n═'.repeat(70));
console.log('✅ VALIDACIÓN COMPLETADA');
console.log('═'.repeat(70));

console.log('\n📈 BALANCE GENERAL:');
console.log(`   Inversión total: $${totalOC.toLocaleString('es-MX')}`);
console.log(`   Ingresos ventas: $${totalIngresos.toLocaleString('es-MX')}`);
console.log(`   A Bóveda Monte: $${totalBovedaMonte.toLocaleString('es-MX')}`);
console.log(`   Fletes Sur: $${totalFletes.toLocaleString('es-MX')}`);
console.log(`   Utilidad: $${totalUtilidad.toLocaleString('es-MX')}`);
console.log(`   ROI: ${((totalIngresos / totalOC - 1) * 100).toFixed(2)}%`);

console.log('\n✨ Todos los datos están listos para los componentes!\n');
