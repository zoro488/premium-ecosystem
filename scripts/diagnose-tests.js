import { execSync } from 'child_process';

function diagnoseTestFailures() {
  try {
    console.log('🔍 Diagnosticando fallos de tests...');
    
    let output = '';
    try {
      // Ejecutar tests y capturar output
      output = execSync('npm test -- --run', { encoding: 'utf-8', stdio: 'pipe' });
    } catch (error) {
      // Capturar output incluso si los tests fallan
      output = error.stdout + error.stderr;
    }
    
    // Analizar output
    const errors = {
      connection: output.includes('ECONNREFUSED'),
      types: output.includes('TypeError'),
      timeout: output.includes('TIMEOUT'),
      unknown: true
    };
    
    console.log('📊 Análisis de errores:');
    console.log(JSON.stringify(errors, null, 2));
    
    // Sugerir corrección
    if (errors.connection) {
      console.log('💡 Sugerencia: Reiniciar Firebase Emulator');
    } else if (errors.types) {
      console.log('💡 Sugerencia: Actualizar dependencias de tipos');
    } else {
      console.log('💡 Sugerencia: Limpiar cache y reinstalar');
    }
    
    return errors;
  } catch (error) {
    console.error('❌ Error en diagnóstico:', error.message);
    return null;
  }
}

diagnoseTestFailures();
