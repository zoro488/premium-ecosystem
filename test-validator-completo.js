#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { ExcelImportValidator } from './src/utils/excel-import-validator.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 TEST ENTERPRISE: ExcelImportValidator Completo\n');
console.log('='.repeat(60));

(async () => {
  try {
    // 1. Cargar datos
    console.log('📂 Cargando excel_data.json...');
    const excelDataPath = path.join(__dirname, 'public', 'excel_data.json');
    const excelData = JSON.parse(fs.readFileSync(excelDataPath, 'utf-8'));
    console.log('✅ Datos cargados');
    console.log('   Ventas:', excelData.ventas?.length || 0);
    console.log('   Clientes:', excelData.clientes?.length || 0);
    console.log('   OCs:', excelData.ordenesCompra?.length || 0);
    console.log();

    // 2. Crear instancia y validar
    console.log('🔬 INICIANDO VALIDACIÓN EN 3 CAPAS...\n');
    const validator = new ExcelImportValidator();

    console.time('⏱️  Tiempo total de validación');
    const result = await validator.validateAll(excelData);
    console.timeEnd('⏱️  Tiempo total de validación');

    console.log('\n' + '='.repeat(60));
    console.log('📊 RESULTADOS DE VALIDACIÓN ENTERPRISE:\n');

    // 3. Mostrar éxito/fallo
    console.log('🎯 ESTADO GENERAL:');
    console.log('   Validación exitosa:', result.success ? '✅ SÍ' : '❌ NO');
    console.log('   Errores críticos:', result.errors.length);
    console.log('   Advertencias:', result.warnings.length);
    console.log();

    // 4. Estadísticas detalladas
    console.log('📈 ESTADÍSTICAS:');
    Object.entries(result.stats).forEach(([key, value]) => {
      const emoji = key.includes('Validado') || key.includes('Validadas') ? '✅' : '📊';
      const label = key.padEnd(25);
      console.log(`   ${emoji} ${label}: ${value}`);
    });
    console.log();

    // 5. Advertencias (primeras 10)
    if (result.warnings.length > 0) {
      console.log(`⚠️  ADVERTENCIAS (${result.warnings.length} total):`);
      result.warnings.slice(0, 10).forEach((warning, idx) => {
        console.log(`   ${idx + 1}. [${warning.type}] ${warning.message}`);
        if (warning.details) {
          const detailStr = JSON.stringify(warning.details);
          console.log(`      Detalles: ${detailStr.substring(0, 100)}${detailStr.length > 100 ? '...' : ''}`);
        }
      });
      if (result.warnings.length > 10) {
        console.log(`   ... y ${result.warnings.length - 10} advertencias más`);
      }
      console.log();
    }

    // 6. Errores (si existen)
    if (result.errors.length > 0) {
      console.log(`❌ ERRORES CRÍTICOS (${result.errors.length} total):`);
      result.errors.slice(0, 5).forEach((error, idx) => {
        console.log(`   ${idx + 1}. [${error.type}] ${error.message}`);
        if (error.details) {
          const detailStr = JSON.stringify(error.details);
          console.log(`      Detalles: ${detailStr.substring(0, 100)}${detailStr.length > 100 ? '...' : ''}`);
        }
      });
      if (result.errors.length > 5) {
        console.log(`   ... y ${result.errors.length - 5} errores más`);
      }
      console.log();
    }

    // 7. Análisis de transformaciones aplicadas
    console.log('🔄 TRANSFORMACIONES APLICADAS:');
    let clientesTransformados = 0;
    let estatusNormalizados = 0;
    let saldosFavorDetectados = 0;

    if (result.data && result.data.ventas) {
      result.data.ventas.forEach(venta => {
        if (venta.cliente && venta.cliente.toString().startsWith('Cliente ')) {
          clientesTransformados++;
        }
        if (venta.estadoPago === 'completo' || venta.estadoPago === 'pendiente') {
          estatusNormalizados++;
        }
      });
    }

    if (result.data && result.data.clientes) {
      result.data.clientes.forEach(cliente => {
        if (cliente.saldoFavor && cliente.saldoFavor > 0) {
          saldosFavorDetectados++;
        }
      });
    }

    console.log('   ✅ Clientes numéricos → strings:', clientesTransformados);
    console.log('   ✅ Estatus normalizados:', estatusNormalizados);
    console.log('   ✅ Adeudos negativos → saldoFavor:', saldosFavorDetectados);
    console.log();

    // 8. Validación de integridad referencial
    console.log('🔗 INTEGRIDAD REFERENCIAL:');
    const integridadWarnings = result.warnings.filter(w =>
      w.type === 'MISSING_OC_REFERENCE' ||
      w.type === 'MISSING_CLIENTE_REFERENCE' ||
      w.type === 'ADEUDO_MISMATCH'
    );
    console.log('   Referencias OC faltantes:', integridadWarnings.filter(w => w.type === 'MISSING_OC_REFERENCE').length);
    console.log('   Clientes no encontrados:', integridadWarnings.filter(w => w.type === 'MISSING_CLIENTE_REFERENCE').length);
    console.log('   Diferencias en adeudos:', integridadWarnings.filter(w => w.type === 'ADEUDO_MISMATCH').length);
    console.log();

    // 9. Generar reporte completo
    console.log('💾 Generando reporte completo...');
    const report = validator.generateReport();

    const reportPath = path.join(__dirname, 'validation_report_enterprise.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    console.log('✅ Reporte guardado:', reportPath);

    // Generar reporte resumido en texto
    const resumenPath = path.join(__dirname, 'validation_summary.txt');
    const resumen = `
REPORTE DE VALIDACIÓN ENTERPRISE
=================================
Fecha: ${new Date().toISOString()}
Archivo: excel_data.json

ESTADO GENERAL:
- Validación: ${result.success ? 'EXITOSA ✅' : 'FALLIDA ❌'}
- Errores críticos: ${result.errors.length}
- Advertencias: ${result.warnings.length}

ESTADÍSTICAS:
${Object.entries(result.stats).map(([k, v]) => `- ${k}: ${v}`).join('\n')}

TRANSFORMACIONES:
- Clientes numéricos transformados: ${clientesTransformados}
- Estatus normalizados: ${estatusNormalizados}
- Adeudos negativos convertidos: ${saldosFavorDetectados}

INTEGRIDAD:
- OCs faltantes: ${integridadWarnings.filter(w => w.type === 'MISSING_OC_REFERENCE').length}
- Clientes no encontrados: ${integridadWarnings.filter(w => w.type === 'MISSING_CLIENTE_REFERENCE').length}
- Diferencias en adeudos: ${integridadWarnings.filter(w => w.type === 'ADEUDO_MISMATCH').length}

CONCLUSIÓN:
${result.success ?
  '✅ Los datos están listos para importar.' :
  '❌ Corrija los errores críticos antes de importar.'}
${result.warnings.length > 0 ?
  `⚠️  ${result.warnings.length} advertencias detectadas (no bloquean importación).` :
  ''}

Reporte completo: validation_report_enterprise.json
`;

    fs.writeFileSync(resumenPath, resumen);
    console.log('✅ Resumen guardado:', resumenPath);
    console.log();

    console.log('='.repeat(60));
    console.log('🎉 CONCLUSIÓN:');
    if (result.success) {
      console.log('   ✅ VALIDACIÓN EXITOSA');
      console.log('   ✅ Datos listos para importar');
      console.log('   ✅ Transformaciones aplicadas correctamente');
      if (result.warnings.length > 0) {
        console.log(`   ⚠️  ${result.warnings.length} advertencias (no bloquean importación)`);
      }
    } else {
      console.log('   ❌ VALIDACIÓN FALLIDA');
      console.log(`   ❌ ${result.errors.length} errores críticos detectados`);
      console.log('   ⚠️  Revisar y corregir antes de importar');
    }
    console.log('='.repeat(60));

  } catch (error) {
    console.error('\n❌ ERROR EN VALIDACIÓN:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
})();
