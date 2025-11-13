import { readFileSync } from 'fs';

const data = JSON.parse(readFileSync('datos_excel_completos.json', 'utf-8'));

console.log('\n📊 VERIFICACIÓN DE DATOS EN datos_excel_completos.json');
console.log('='.repeat(80));

// BANCOS
console.log('\n1️⃣ BANCOS:');
const bancos = data.bancos || {};
Object.keys(bancos).forEach(key => {
  const banco = bancos[key];
  console.log(`   ✅ ${key}:`);
  console.log(`      - Saldo Actual: $${banco.saldoActual?.toLocaleString() || 0}`);
  console.log(`      - Ingresos: ${banco.ingresos?.length || 0} registros`);
  console.log(`      - Gastos: ${banco.gastos?.length || 0} registros`);
});

// VENTAS
const ventas = data.ventas || [];
console.log(`\n2️⃣ VENTAS: ${ventas.length} registros`);
if (ventas.length > 0) {
  console.log(`   Primera: ${ventas[0].fecha} - ${ventas[0].cliente}`);
  console.log(`   Última: ${ventas[ventas.length-1].fecha} - ${ventas[ventas.length-1].cliente}`);
}

// CLIENTES
const clientes = data.clientes || [];
console.log(`\n3️⃣ CLIENTES: ${clientes.length} registros`);

// DISTRIBUIDORES
const distribuidores = data.distribuidores || [];
console.log(`\n4️⃣ DISTRIBUIDORES: ${distribuidores.length} registros`);

// ORDENES COMPRA
const ordenesCompra = data.ordenesCompra || [];
console.log(`\n5️⃣ ÓRDENES DE COMPRA: ${ordenesCompra.length} registros`);
if (ordenesCompra.length > 0) {
  console.log('   IDs encontradas:');
  ordenesCompra.slice(0, 10).forEach(oc => console.log(`      - ${oc.id}: ${oc.cantidad} unidades`));
}

// ALMACEN
const almacen = data.almacen || {};
console.log(`\n6️⃣ ALMACÉN:`);
console.log(`   - Stock Actual: ${almacen.stockActual || 0} unidades`);
console.log(`   - Entradas: ${almacen.entradas?.length || 0} registros`);
console.log(`   - Salidas: ${almacen.salidas?.length || 0} registros`);

// COMPARACIÓN CON LOS DATOS ESPERADOS
console.log('\n' + '='.repeat(80));
console.log('📋 COMPARACIÓN CON DATOS ESPERADOS:');
console.log('='.repeat(80));

const esperado = {
  ordenesCompra: 9, // OC0001 - OC0009
  ventas: 96, // Según tabla enviada
  clientes: 31, // Según panel-clientes-manual.json
  rfActual: {
    almacenVilla: 17,
    bovedaMonte: 0,
    fleteSur: 185792,
    utilidades: 102658,
    azteca: -178714.88,
    leftie: 45844,
    profit: 12577748,
    bovedaUsa: 128005
  }
};

console.log(`\n✅ Órdenes Compra: ${ordenesCompra.length} (esperadas: ${esperado.ordenesCompra})`);
console.log(`${ordenesCompra.length === esperado.ordenesCompra ? '✅' : '⚠️'} ${ordenesCompra.length >= esperado.ordenesCompra ? 'OK' : 'FALTAN ' + (esperado.ordenesCompra - ordenesCompra.length)}`);

console.log(`\n✅ Ventas: ${ventas.length} (esperadas: ~${esperado.ventas})`);
console.log(`${Math.abs(ventas.length - esperado.ventas) < 10 ? '✅' : '⚠️'} ${Math.abs(ventas.length - esperado.ventas) < 10 ? 'OK' : 'Diferencia: ' + (ventas.length - esperado.ventas)}`);

console.log(`\n✅ Clientes: ${clientes.length} (esperados: ${esperado.clientes})`);
console.log(`${clientes.length >= esperado.clientes ? '✅' : '⚠️'} ${clientes.length >= esperado.clientes ? 'OK' : 'FALTAN ' + (esperado.clientes - clientes.length)}`);

console.log('\n' + '='.repeat(80));
console.log('💡 CONCLUSIÓN:');
if (ordenesCompra.length >= esperado.ordenesCompra && clientes.length >= esperado.clientes) {
  console.log('✅ El archivo datos_excel_completos.json TIENE todos los datos necesarios');
  console.log('✅ LISTO para cargar a Firestore');
} else {
  console.log('⚠️ Faltan algunos datos, revisar archivos en src/apps/FlowDistributor/data/');
}
console.log('='.repeat(80) + '\n');
