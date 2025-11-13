#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');

console.log('🔍 Diagnosticando fallos de tests...\n');

const diagnostics = {
  timestamp: new Date().toISOString(),
  errors: [],
  suggestions: [],
};

try {
  // Ejecutar tests y capturar output
  const output = execSync('npm test -- --run', { 
    encoding: 'utf-8',
    stdio: 'pipe'
  });
  
  console.log('✅ Todos los tests pasaron');
  diagnostics.status = 'success';
  
} catch (error) {
  console.log('❌ Tests fallaron. Analizando...\n');
  
  const output = error.stdout + error.stderr;
  
  // Detectar errores de conexión
  if (/ECONNREFUSED|ETIMEDOUT|ENOTFOUND/.test(output)) {
    diagnostics.errors.push('connection');
    diagnostics.suggestions.push('Reiniciar servicios (Firebase Emulator, etc.)');
    console.log('🔌 Error de CONEXIÓN detectado');
  }
  
  // Detectar errores de tipos
  if (/TypeError|ReferenceError/.test(output)) {
    diagnostics.errors.push('types');
    diagnostics.suggestions.push('Actualizar @types/node y @types/react');
    console.log('📝 Error de TIPOS detectado');
  }
  
  // Detectar timeouts
  if (/timeout|TIMEOUT/.test(output)) {
    diagnostics.errors.push('timeout');
    diagnostics.suggestions.push('Aumentar testTimeout en vitest.config.js');
    console.log('⏱️ Error de TIMEOUT detectado');
  }
  
  // Error desconocido
  if (diagnostics.errors.length === 0) {
    diagnostics.errors.push('unknown');
    diagnostics.suggestions.push('Limpiar cache: npm cache clean --force');
    console.log('❓ Error DESCONOCIDO');
  }
  
  diagnostics.status = 'failure';
}

// Guardar diagnóstico
fs.writeFileSync(
  'test-diagnostics.json',
  JSON.stringify(diagnostics, null, 2)
);

console.log('\n📊 Diagnóstico guardado en: test-diagnostics.json');
console.log('\n💡 Sugerencias:');
diagnostics.suggestions.forEach((s, i) => {
  console.log(`   ${i + 1}. ${s}`);
});

process.exit(diagnostics.status === 'success' ? 0 : 1);
