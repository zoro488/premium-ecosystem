const fs = require('fs');
const path = require('path');

console.log('\n' + '='.repeat(120));
console.log('📊 RESUMEN ANÁLISIS COMPLETO: TODAS LAS HOJAS');
console.log('='.repeat(120) + '\n');

const data = JSON.parse(fs.readFileSync('scripts/analisis-completo-todas-hojas.json', 'utf8'));

Object.keys(data).forEach(hoja => {
  const h = data[hoja];
  console.log(`\n📄 ${hoja}`);
  console.log(`   Paneles: ${h.paneles_asociados.join(', ')}`);
  console.log(`   Descripción: ${h.descripcion}`);
  console.log(`   Tablas esperadas: ${h.tablas_esperadas}, Encontradas: ${h.tablas_encontradas}`);

  h.tablas.forEach((t, i) => {
    console.log(`   • Tabla ${i+1} (Fila ${t.fila_inicio}): ${t.headers.length} columnas, ${t.total_registros} registros`);
    console.log(`     Columnas: ${t.headers.slice(0, 8).join(', ')}${t.headers.length > 8 ? '...' : ''}`);
  });
});

console.log('\n' + '='.repeat(120));
