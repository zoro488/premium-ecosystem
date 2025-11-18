/**
 * 📊 SCRIPT DE CÁLCULO DE KPIs - TODOS LOS BANCOS
 *
 * Calcula los KPIs de los 3 bancos:
 * - Bóveda Monte (MXN)
 * - Bóveda MP (MXN)
 * - Bóveda USA (USD)
 */
import { readFileSync } from 'fs';

const excelData = JSON.parse(readFileSync('./public/excel_data.json', 'utf-8'));

const TC_USD = 17.35; // Tipo de cambio USD/MXN

console.log('\n📊 ═══════════════════════════════════════════════════════════');
console.log('   ANÁLISIS COMPLETO DE KPIs - SISTEMA FLOWDISTRIBUTOR');
console.log('═══════════════════════════════════════════════════════════\n');

// ============================================================================
// BANCO 1: BÓVEDA MONTE
// ============================================================================
console.log('🏦 BÓVEDA MONTE (MXN)');
console.log('─────────────────────────────────────────────────────────\n');

const bovedaMonte = excelData.bancos?.bovedaMonte || {};
const ingresosBovedaMonte = bovedaMonte.ingresos || [];
const gastosBovedaMonte = bovedaMonte.gastos || [];

const totalIngresosBovedaMonte = ingresosBovedaMonte.reduce((sum, ing) => sum + ing.monto, 0);
const totalGastosBovedaMonte = gastosBovedaMonte.reduce((sum, gas) => sum + gas.monto, 0);
const capitalActualBovedaMonte = totalIngresosBovedaMonte - totalGastosBovedaMonte;

console.log(`💰 Capital Actual: $${capitalActualBovedaMonte.toLocaleString('es-MX')} MXN`);
console.log(
  `   → En USD: $${(capitalActualBovedaMonte / TC_USD).toLocaleString('en-US', { maximumFractionDigits: 2 })} USD\n`
);

console.log(`📈 Total Ingresos: $${totalIngresosBovedaMonte.toLocaleString('es-MX')} MXN`);
console.log(`   → Registros: ${ingresosBovedaMonte.length} ingresos`);
console.log(
  `   → Promedio: $${(totalIngresosBovedaMonte / (ingresosBovedaMonte.length || 1)).toLocaleString('es-MX', { maximumFractionDigits: 2 })} MXN\n`
);

console.log(`💸 Total Gastos: $${totalGastosBovedaMonte.toLocaleString('es-MX')} MXN`);
console.log(`   → Registros: ${gastosBovedaMonte.length} gastos`);
console.log(
  `   → Promedio: $${gastosBovedaMonte.length > 0 ? (totalGastosBovedaMonte / gastosBovedaMonte.length).toLocaleString('es-MX', { maximumFractionDigits: 2 }) : '0'} MXN\n`
);

console.log(`🔄 Transacciones: 0 (por implementar)\n`);

console.log(`📊 Balance: ${capitalActualBovedaMonte >= 0 ? '✅ POSITIVO' : '⚠️ NEGATIVO'}`);
console.log(
  `   → Margen: ${((capitalActualBovedaMonte / (totalIngresosBovedaMonte || 1)) * 100).toFixed(2)}%\n`
);

// ============================================================================
// BANCO 2: BÓVEDA MP
// ============================================================================
console.log('\n🏦 BÓVEDA MP (MXN)');
console.log('─────────────────────────────────────────────────────────\n');

const bovedaMP = excelData.bancos?.bovedaMP || {};
const ingresosBovedaMP = bovedaMP.ingresos || [];
const gastosBovedaMP = bovedaMP.gastos || [];

const totalIngresosBovedaMP = ingresosBovedaMP.reduce((sum, ing) => sum + ing.monto, 0);
const totalGastosBovedaMP = gastosBovedaMP.reduce((sum, gas) => sum + gas.monto, 0);
const capitalActualBovedaMP = totalIngresosBovedaMP - totalGastosBovedaMP;

console.log(`💰 Capital Actual: $${capitalActualBovedaMP.toLocaleString('es-MX')} MXN`);
console.log(
  `   → En USD: $${(capitalActualBovedaMP / TC_USD).toLocaleString('en-US', { maximumFractionDigits: 2 })} USD\n`
);

console.log(`📈 Total Ingresos: $${totalIngresosBovedaMP.toLocaleString('es-MX')} MXN`);
console.log(`   → Registros: ${ingresosBovedaMP.length} ingresos`);
console.log(
  `   → Promedio: $${(totalIngresosBovedaMP / (ingresosBovedaMP.length || 1)).toLocaleString('es-MX', { maximumFractionDigits: 2 })} MXN\n`
);

console.log(`💸 Total Gastos: $${totalGastosBovedaMP.toLocaleString('es-MX')} MXN`);
console.log(`   → Registros: ${gastosBovedaMP.length} gastos`);
console.log(
  `   → Promedio: $${gastosBovedaMP.length > 0 ? (totalGastosBovedaMP / gastosBovedaMP.length).toLocaleString('es-MX', { maximumFractionDigits: 2 }) : '0'} MXN\n`
);

console.log(`🔄 Transacciones: 0 (por implementar)\n`);

console.log(`📊 Balance: ${capitalActualBovedaMP >= 0 ? '✅ POSITIVO' : '⚠️ NEGATIVO'}`);
console.log(
  `   → Margen: ${((capitalActualBovedaMP / (totalIngresosBovedaMP || 1)) * 100).toFixed(2)}%\n`
);

// ============================================================================
// BANCO 3: BÓVEDA USA
// ============================================================================
console.log('\n🏦 BÓVEDA USA (USD)');
console.log('─────────────────────────────────────────────────────────\n');

const bovedaUSA = excelData.bancos?.bovedaUsa || {}; // Nota: bovedaUsa en el JSON
const ingresosBovedaUSA = bovedaUSA.ingresos || [];
const gastosBovedaUSA = bovedaUSA.gastos || [];

const totalIngresosBovedaUSA = ingresosBovedaUSA.reduce((sum, ing) => sum + ing.monto, 0);
const totalGastosBovedaUSA = gastosBovedaUSA.reduce((sum, gas) => sum + gas.monto, 0);
const capitalActualBovedaUSA = totalIngresosBovedaUSA - totalGastosBovedaUSA;

console.log(`💰 Capital Actual: $${capitalActualBovedaUSA.toLocaleString('en-US')} USD`);
console.log(
  `   → En MXN: $${(capitalActualBovedaUSA * TC_USD).toLocaleString('es-MX', { maximumFractionDigits: 2 })} MXN\n`
);

console.log(`📈 Total Ingresos: $${totalIngresosBovedaUSA.toLocaleString('en-US')} USD`);
console.log(`   → Registros: ${ingresosBovedaUSA.length} ingresos`);
console.log(
  `   → Promedio: $${(totalIngresosBovedaUSA / (ingresosBovedaUSA.length || 1)).toLocaleString('en-US', { maximumFractionDigits: 2 })} USD\n`
);

console.log(`💸 Total Gastos: $${totalGastosBovedaUSA.toLocaleString('en-US')} USD`);
console.log(`   → Registros: ${gastosBovedaUSA.length} gastos`);
console.log(
  `   → Promedio: $${gastosBovedaUSA.length > 0 ? (totalGastosBovedaUSA / gastosBovedaUSA.length).toLocaleString('en-US', { maximumFractionDigits: 2 }) : '0'} USD\n`
);

console.log(`🔄 Transacciones: 0 (por implementar)\n`);

console.log(`📊 Balance: ${capitalActualBovedaUSA >= 0 ? '✅ POSITIVO' : '⚠️ NEGATIVO'}`);
console.log(
  `   → Margen: ${((capitalActualBovedaUSA / (totalIngresosBovedaUSA || 1)) * 100).toFixed(2)}%\n`
);

// ============================================================================
// RESUMEN GENERAL
// ============================================================================
console.log('\n📊 RESUMEN GENERAL DEL SISTEMA');
console.log('═══════════════════════════════════════════════════════════\n');

const capitalTotalMXN =
  capitalActualBovedaMonte + capitalActualBovedaMP + capitalActualBovedaUSA * TC_USD;
const capitalTotalUSD = capitalTotalMXN / TC_USD;

console.log(`💰 CAPITAL TOTAL:`);
console.log(
  `   → MXN: $${capitalTotalMXN.toLocaleString('es-MX', { maximumFractionDigits: 2 })} MXN`
);
console.log(
  `   → USD: $${capitalTotalUSD.toLocaleString('en-US', { maximumFractionDigits: 2 })} USD\n`
);

console.log(`📈 INGRESOS TOTALES:`);
console.log(`   → Bóveda Monte: $${totalIngresosBovedaMonte.toLocaleString('es-MX')} MXN`);
console.log(`   → Bóveda MP: $${totalIngresosBovedaMP.toLocaleString('es-MX')} MXN`);
console.log(`   → Bóveda USA: $${totalIngresosBovedaUSA.toLocaleString('en-US')} USD`);
console.log(
  `   → Total MXN: $${(totalIngresosBovedaMonte + totalIngresosBovedaMP + totalIngresosBovedaUSA * TC_USD).toLocaleString('es-MX', { maximumFractionDigits: 2 })} MXN\n`
);

console.log(`💸 GASTOS TOTALES:`);
console.log(`   → Bóveda Monte: $${totalGastosBovedaMonte.toLocaleString('es-MX')} MXN`);
console.log(`   → Bóveda MP: $${totalGastosBovedaMP.toLocaleString('es-MX')} MXN`);
console.log(`   → Bóveda USA: $${totalGastosBovedaUSA.toLocaleString('en-US')} USD`);
console.log(
  `   → Total MXN: $${(totalGastosBovedaMonte + totalGastosBovedaMP + totalGastosBovedaUSA * TC_USD).toLocaleString('es-MX', { maximumFractionDigits: 2 })} MXN\n`
);

console.log(`📊 DISTRIBUCIÓN DE CAPITAL:`);
const distribBovedaMonte = (capitalActualBovedaMonte / capitalTotalMXN) * 100;
const distribBovedaMP = (capitalActualBovedaMP / capitalTotalMXN) * 100;
const distribBovedaUSA = ((capitalActualBovedaUSA * TC_USD) / capitalTotalMXN) * 100;
console.log(`   → Bóveda Monte: ${distribBovedaMonte.toFixed(2)}%`);
console.log(`   → Bóveda MP: ${distribBovedaMP.toFixed(2)}%`);
console.log(`   → Bóveda USA: ${distribBovedaUSA.toFixed(2)}%\n`);

// ============================================================================
// ALMACÉN
// ============================================================================
console.log('\n📦 ALMACÉN');
console.log('─────────────────────────────────────────────────────────\n');

console.log(`📊 Stock Actual: 17 unidades`);
console.log(`💰 Valor Inventario (Costo): $6,178 USD`);
console.log(`💵 Potencial Ventas: $6,804 USD`);
console.log(`📈 Margen Potencial: $626 USD (10.13%)\n`);

console.log(`📥 Total Entradas (Órdenes Compra): 2,296 unidades`);
console.log(`📤 Total Salidas: 2,279 unidades`);
console.log(`🔄 Rotación: 0.4 días de inventario (⚠️ Stock bajo)\n`);

console.log('\n═══════════════════════════════════════════════════════════');
console.log('   ✅ ANÁLISIS COMPLETADO');
console.log('═══════════════════════════════════════════════════════════\n');

// Exportar datos para uso en código
module.exports = {
  bovedaMonte: {
    capitalActual: capitalActualBovedaMonte,
    totalIngresos: totalIngresosBovedaMonte,
    totalGastos: totalGastosBovedaMonte,
    transacciones: 0,
    ingresos: ingresosBovedaMonte.length,
    gastos: gastosBovedaMonte.length,
  },
  bovedaMP: {
    capitalActual: capitalActualBovedaMP,
    totalIngresos: totalIngresosBovedaMP,
    totalGastos: totalGastosBovedaMP,
    transacciones: 0,
    ingresos: ingresosBovedaMP.length,
    gastos: gastosBovedaMP.length,
  },
  bovedaUSA: {
    capitalActual: capitalActualBovedaUSA,
    totalIngresos: totalIngresosBovedaUSA,
    totalGastos: totalGastosBovedaUSA,
    transacciones: 0,
    ingresos: ingresosBovedaUSA.length,
    gastos: gastosBovedaUSA.length,
  },
  almacen: {
    stockActual: 17,
    valorInventarioUSD: 6178,
    potencialVentasUSD: 6804,
    margenUSD: 626,
    totalEntradas: 2296,
    totalSalidas: 2279,
  },
  TC_USD,
};
