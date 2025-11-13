#!/usr/bin/env node
/**
 * 🔍 VALIDACIÓN COMPLETA FLOWDISTRIBUTOR
 * Valida datos JSON unificado y estructura de código
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('\n🚀 INICIANDO VALIDACIÓN COMPLETA FLOWDISTRIBUTOR\n');

// ============================================================================
// 1. VALIDAR JSON UNIFICADO
// ============================================================================
console.log('📊 1. Validando JSON Unificado...');

const jsonPath = path.join(
  __dirname,
  '../src/apps/FlowDistributor/data/BASE_DATOS_FLOWDISTRIBUTOR_UNIFICADO.json'
);

if (!fs.existsSync(jsonPath)) {
  console.error('❌ ERROR: No existe BASE_DATOS_FLOWDISTRIBUTOR_UNIFICADO.json');
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));

// Validar estructura
const checks = {
  ordenesCompra: data.ordenesCompra?.distribuidores?.ordenesCompra?.length || 0,
  distribuidores: data.ordenesCompra?.distribuidores?.distribuidores?.length || 0,
  ventasLocales: data.ventasLocales?.ventasLocal?.length || 0,
  gastosAbonos: data.gastosAbonos?.gastosAbonos?.length || 0,
  clientes: data.clientes?.clientes?.length || 0,
  almacenMonte: data.almacenMonte?.almacenMonte?.salidas?.length || 0,
};

console.log('✅ Registros encontrados:');
console.log(`   - Órdenes de Compra: ${checks.ordenesCompra} (esperado: 9)`);
console.log(`   - Distribuidores: ${checks.distribuidores} (esperado: 2)`);
console.log(`   - Ventas Locales: ${checks.ventasLocales} (esperado: 96)`);
console.log(`   - Gastos y Abonos: ${checks.gastosAbonos} (esperado: 306)`);
console.log(`   - Clientes: ${checks.clientes} (esperado: 31)`);
console.log(`   - Almacén Salidas: ${checks.almacenMonte} (esperado: 96)`);

// ============================================================================
// 2. CALCULAR TOTALES
// ============================================================================
console.log('\n💰 2. Calculando totales...');

const ventas = data.ventasLocales?.ventasLocal || [];
let totalVentas = 0;
let totalFletes = 0;
let totalBovedaMonte = 0;
let totalUtilidades = 0;

ventas.forEach((venta) => {
  const tv = parseFloat(venta.totalVenta || 0);
  const tf = parseFloat(venta.totalFletes || 0);
  const bm = parseFloat(venta.bovedaMonte || 0);
  const tu = parseFloat(venta.totalUtilidades || 0);

  totalVentas += tv;
  totalFletes += tf;
  totalBovedaMonte += bm;
  totalUtilidades += tu;
});

console.log(`✅ Total Ventas: $${totalVentas.toLocaleString('es-MX')}`);
console.log(`✅ Total Fletes: $${totalFletes.toLocaleString('es-MX')}`);
console.log(`✅ Total Bóveda Monte: $${totalBovedaMonte.toLocaleString('es-MX')}`);
console.log(`✅ Total Utilidades: $${totalUtilidades.toLocaleString('es-MX')}`);

// ============================================================================
// 3. VALIDAR FÓRMULA PV = FL + BM + UT
// ============================================================================
console.log('\n🔍 3. Validando fórmula PV = FL + BM + UT...');

let erroresFormula = 0;
ventas.forEach((venta, idx) => {
  const pv = parseFloat(venta.totalVenta || 0);
  const fl = parseFloat(venta.totalFletes || 0);
  const bm = parseFloat(venta.bovedaMonte || 0);
  const ut = parseFloat(venta.totalUtilidades || 0);

  const suma = fl + bm + ut;
  const diff = Math.abs(pv - suma);

  if (diff > 0.01) {
    erroresFormula++;
    if (erroresFormula <= 5) {
      console.log(
        `   ⚠️  Venta ${idx + 1}: PV=$${pv} ≠ FL($${fl}) + BM($${bm}) + UT($${ut}) = $${suma}`
      );
    }
  }
});

if (erroresFormula === 0) {
  console.log(`✅ TODAS las ${ventas.length} ventas cumplen la fórmula`);
} else {
  console.log(`❌ ${erroresFormula} ventas NO cumplen la fórmula (de ${ventas.length})`);
}

// ============================================================================
// 4. VALIDAR ÓRDENES DE COMPRA
// ============================================================================
console.log('\n📦 4. Validando Órdenes de Compra...');

const ordenesCompra = data.ordenesCompra?.distribuidores?.ordenesCompra || [];
let totalCompras = 0;

ordenesCompra.forEach((orden) => {
  totalCompras += parseFloat(orden.Total || 0);
});

console.log(`✅ Total Compras: $${totalCompras.toLocaleString('es-MX')}`);
console.log(`   Esperado: $14,478,800`);

// ============================================================================
// 5. VALIDAR DISTRIBUIDORES
// ============================================================================
console.log('\n🏢 5. Validando Distribuidores...');

const distribuidores = data.ordenesCompra?.distribuidores?.distribuidores || [];
let totalAdeudos = 0;

distribuidores.forEach((dist) => {
  const adeudo = parseFloat(dist.adeudo || 0);
  totalAdeudos += adeudo;
  console.log(
    `   - ${dist.nombre}: Comprado=$${parseFloat(dist.comprado || 0).toLocaleString('es-MX')} | Adeudo=$${adeudo.toLocaleString('es-MX')}`
  );
});

console.log(`✅ Total Adeudos: $${totalAdeudos.toLocaleString('es-MX')}`);

// ============================================================================
// 6. VALIDAR INVENTARIO
// ============================================================================
console.log('\n📊 6. Validando Inventario...');

const almacen = data.almacenMonte?.almacenMonte || {};
const ingresos = parseFloat(almacen.ingresos || 0);
const salidas = parseFloat(almacen.salida || 0);
const rfActual = parseFloat(almacen.rfActual || 0);

console.log(`   - Ingresos: ${ingresos} unidades`);
console.log(`   - Salidas: ${salidas} unidades`);
console.log(`   - RF Actual: ${rfActual} unidades`);
console.log(`   - Balance: ${ingresos - salidas} unidades (esperado: 17)`);

if (Math.abs(ingresos - salidas - 17) < 1) {
  console.log('✅ Balance de inventario CORRECTO');
} else {
  console.log('❌ Balance de inventario INCORRECTO');
}

// ============================================================================
// 7. REPORTE FINAL
// ============================================================================
console.log('\n' + '='.repeat(60));
console.log('📋 REPORTE FINAL DE VALIDACIÓN');
console.log('='.repeat(60));

const resultados = {
  estructuraJSON:
    checks.ordenesCompra === 9 && checks.ventasLocales === 96 && checks.gastosAbonos >= 302,
  formulaVentas: erroresFormula === 0,
  inventario: Math.abs(ingresos - salidas - 17) < 1,
};

const todosCorrecto = Object.values(resultados).every((r) => r === true);

if (todosCorrecto) {
  console.log('✅✅✅ TODOS LOS TESTS PASARON ✅✅✅');
  process.exit(0);
} else {
  console.log('❌ ALGUNOS TESTS FALLARON:');
  console.log(`   - Estructura JSON: ${resultados.estructuraJSON ? '✅' : '❌'}`);
  console.log(`   - Fórmula Ventas: ${resultados.formulaVentas ? '✅' : '❌'}`);
  console.log(`   - Inventario: ${resultados.inventario ? '✅' : '❌'}`);
  process.exit(1);
}
