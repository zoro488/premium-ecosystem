import fs from 'fs';
import { execSync } from 'child_process';

function diagnosticar() {
  console.log('🔍 Diagnosticando tests...');
  
  try {
    // Ejecutar tests y capturar salida
    execSync('npm run test:run', { stdio: 'pipe' });
    console.log('✅ Tests pasaron');
    return { success: true };
  } catch (error) {
    const output = error.stdout?.toString() || '';
    const errorOutput = error.stderr?.toString() || '';
    
    // Analizar tipo de error
    if (output.includes('ECONNREFUSED') || errorOutput.includes('ECONNREFUSED')) {
      console.log('❌ Error de conexión detectado');
      return { success: false, type: 'connection', fix: 'restart-emulator' };
    }
    
    if (output.includes('TypeError')) {
      console.log('❌ TypeError detectado');
      return { success: false, type: 'type', fix: 'update-deps' };
    }
    
    console.log('❌ Error desconocido detectado');
    return { success: false, type: 'unknown', fix: 'manual' };
  }
}

const resultado = diagnosticar();
fs.writeFileSync('./diagnostic-result.json', JSON.stringify(resultado, null, 2));
console.log('📊 Resultado guardado en diagnostic-result.json');
console.log(JSON.stringify(resultado, null, 2));
