/**
 * 📊 CONTADOR DE REGISTROS - FlowDistributorData.js
 * =================================================
 * Cuenta TODOS los registros en cada export para verificar integridad de datos
 */

import {
  ORDENES_COMPRA,
  DISTRIBUIDORES,
  VENTAS_LOCAL,
  CLIENTES,
  ALMACEN_MONTE,
  BOVEDA_MONTE,
  BOVEDA_USA,
  FLETE_SUR,
  AZTECA,
  UTILIDADES,
  LEFTIE,
  PROFIT,
  GASTOS_Y_ABONOS,
} from '../src/apps/FlowDistributor/data/FlowDistributorData.js';

function contarBanco(banco, nombre) {
  if (!banco) return { total: 0 };

  const ingresos = banco.ingresos?.length || 0;
  const gastos = banco.gastos?.length || 0;
  const cortes = banco.cortes?.length || 0;
  const transferencias = banco.transferencias?.length || 0;
  const total = ingresos + gastos + cortes + transferencias;

  return { ingresos, gastos, cortes, transferencias, total };
}

console.log('='.repeat(80));
console.log('📊 CONTEO COMPLETO DE REGISTROS - FlowDistributorData.js');
console.log('='.repeat(80));
console.log();

// Arrays simples
const arrays = {
  'ORDENES_COMPRA': ORDENES_COMPRA,
  'DISTRIBUIDORES': DISTRIBUIDORES,
  'VENTAS_LOCAL': VENTAS_LOCAL,
  'CLIENTES': CLIENTES,
  'GASTOS_Y_ABONOS': GASTOS_Y_ABONOS,
};

console.log('📋 EXPORTS TIPO ARRAY:');
console.log('-'.repeat(80));
let totalArrays = 0;
for (const [nombre, data] of Object.entries(arrays)) {
  const count = Array.isArray(data) ? data.length : 0;
  totalArrays += count;
  console.log(`  ${nombre}: ${count} registros`);
}
console.log();

// Bancos (objetos con ingresos/gastos/cortes)
const bancos = {
  'ALMACEN_MONTE': ALMACEN_MONTE,
  'BOVEDA_MONTE': BOVEDA_MONTE,
  'BOVEDA_USA': BOVEDA_USA,
  'FLETE_SUR': FLETE_SUR,
  'AZTECA': AZTECA,
  'UTILIDADES': UTILIDADES,
  'LEFTIE': LEFTIE,
  'PROFIT': PROFIT,
};

console.log('🏦 EXPORTS TIPO BANCO:');
console.log('-'.repeat(80));
let totalBancos = 0;
for (const [nombre, banco] of Object.entries(bancos)) {
  const counts = contarBanco(banco, nombre);
  totalBancos += counts.total;
  console.log(`  ${nombre}: ${counts.total} registros totales`);
  if (counts.ingresos > 0) console.log(`    - Ingresos: ${counts.ingresos}`);
  if (counts.gastos > 0) console.log(`    - Gastos: ${counts.gastos}`);
  if (counts.cortes > 0) console.log(`    - Cortes: ${counts.cortes}`);
  if (counts.transferencias > 0) console.log(`    - Transferencias: ${counts.transferencias}`);
}
console.log();

// Total general
const totalGeneral = totalArrays + totalBancos;
console.log('='.repeat(80));
console.log(`📈 TOTAL GENERAL: ${totalGeneral} registros`);
console.log('='.repeat(80));
console.log();

// Comparación con análisis Excel
console.log('📊 COMPARACIÓN CON ANÁLISIS EXCEL:');
console.log('-'.repeat(80));
console.log(`  Registros en Excel: 2,617`);
console.log(`  Registros en Data.js: ${totalGeneral}`);
console.log(`  Diferencia: ${2617 - totalGeneral}`);
console.log();

if (totalGeneral >= 2617) {
  console.log('✅ ÉXITO: Todos los datos del Excel están capturados!');
} else if (totalGeneral > 2000) {
  console.log('⚠️  ADVERTENCIA: La mayoría de datos están capturados');
} else {
  console.log('❌ ERROR: Faltan muchos datos por capturar');
}

console.log('='.repeat(80));
