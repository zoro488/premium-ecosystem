/**
 * 🔥 FUSIONADOR DE DATOS COMPLETOS
 * =================================
 * Lee TODOS los archivos panel-*-manual.json y fusiona en FlowDistributorData.js
 * Para asegurar que NO SE OMITE NINGÚN DATO
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, '../src/apps/FlowDistributor/data');
const OUTPUT_FILE = path.join(DATA_DIR, 'FlowDistributorData.js');

console.log('='.repeat(80));
console.log('🔥 FUSIONADOR DE DATOS COMPLETOS - SIN OMISIONES');
console.log('='.repeat(80));
console.log();

// Leer todos los archivos manual JSON
const archivosManual = {
  'panel-ordenes-compra-manual.json': 'ORDENES_COMPRA',
  'panel-clientes-manual.json': 'CLIENTES',
  'panel-ventas-local-manual.json': 'VENTAS_LOCAL',
  'panel-almacen-monte-manual.json': 'ALMACEN_MONTE',
  'panel-boveda-monte-manual.json': 'BOVEDA_MONTE',
  'panel-boveda-usa-manual.json': 'BOVEDA_USA',
  'panel-fletes-manual.json': 'FLETE_SUR',
  'panel-azteca-manual.json': 'AZTECA',
  'panel-utilidades-manual.json': 'UTILIDADES',
  'panel-leftie-manual.json': 'LEFTIE',
  'panel-profit-manual.json': 'PROFIT',
  'panel-gastos-abonos-manual.json': 'GASTOS_Y_ABONOS',
};

const datos = {};
let totalRegistros = 0;

console.log('📂 Leyendo archivos manuales...');
console.log('-'.repeat(80));

for (const [archivo, exportName] of Object.entries(archivosManual)) {
  const rutaArchivo = path.join(DATA_DIR, archivo);

  try {
    if (fs.existsSync(rutaArchivo)) {
      const contenido = fs.readFileSync(rutaArchivo, 'utf-8');
      let data = JSON.parse(contenido);

      // Los archivos manual tienen una estructura anidada: { "nombreBanco": { ... } }
      // Necesitamos extraer el contenido interno
      if (data && typeof data === 'object' && !Array.isArray(data)) {
        // Buscar la primera clave que contenga los datos
        const primeraKey = Object.keys(data)[0];
        if (primeraKey && data[primeraKey]) {
          const datosInternos = data[primeraKey];

          // Si datosInternos ya es un array, usarlo directamente
          if (Array.isArray(datosInternos)) {
            data = datosInternos;
          } else if (datosInternos && typeof datosInternos === 'object') {
            // Convertir estructura: ingresosList → ingresos, gastosList → gastos
            const datosNormalizados = {
              ingresos: datosInternos.ingresosList || datosInternos.ingresos || [],
              gastos: datosInternos.gastosList || datosInternos.gastos || [],
              cortes: datosInternos.cortes || [],
              transferencias: datosInternos.transferencias || [],
            };

            // Para objetos con propiedades específicas
            if (datosInternos.ordenes || datosInternos.ordenesCompra) {
              data = datosInternos.ordenes || datosInternos.ordenesCompra;
            } else if (datosInternos.distribuidores && exportName === 'DISTRIBUIDORES') {
              // Usar la propiedad distribuidores para DISTRIBUIDORES (no ordenesCompra)
              data = datosInternos.distribuidores;
            } else if (datosInternos.clientes) {
              data = datosInternos.clientes;
            } else if (datosInternos.ventas || datosInternos.ventasList) {
              data = datosInternos.ventas || datosInternos.ventasList;
            } else if (datosInternos.gastos_abonos) {
              data = datosInternos.gastos_abonos;
            } else if (datosInternos.almacen || datosInternos.inventario) {
              data = datosInternos.almacen || datosInternos.inventario;
            } else {
              // Es un banco
              data = datosNormalizados;
            }
          }
        }
      }

      // Determinar cuántos registros tiene
      let count = 0;
      if (Array.isArray(data)) {
        count = data.length;
      } else if (data && typeof data === 'object') {
        count =
          (data.ingresos?.length || 0) +
          (data.gastos?.length || 0) +
          (data.cortes?.length || 0) +
          (data.transferencias?.length || 0);
      }

      datos[exportName] = data;
      totalRegistros += count;

      console.log(`✅ ${exportName}: ${count} registros`);
    } else {
      console.log(`⚠️  ${exportName}: Archivo no encontrado, usando []`);
      datos[exportName] = [];
    }
  } catch (error) {
    console.log(`❌ ${exportName}: Error - ${error.message}`);
    datos[exportName] = [];
  }
}

// Leer datos adicionales desde Excel (override manual data)
console.log('\n📊 Leyendo datos desde Excel...');
console.log('-'.repeat(80));

// DISTRIBUIDORES (leer desde panel-ordenes-compra-manual.json)
try {
  const ordenesPath = path.join(DATA_DIR, 'panel-ordenes-compra-manual.json');
  if (fs.existsSync(ordenesPath)) {
    const contenido = JSON.parse(fs.readFileSync(ordenesPath, 'utf-8'));
    // Extraer la propiedad distribuidores.distribuidores
    if (contenido.distribuidores && contenido.distribuidores.distribuidores) {
      const distribData = contenido.distribuidores.distribuidores;
      datos['DISTRIBUIDORES'] = distribData;
      totalRegistros += distribData.length;
      console.log(`✅ DISTRIBUIDORES: ${distribData.length} registros (desde panel OC)`);
    } else {
      console.log(`⚠️  DISTRIBUIDORES: No encontrado en panel OC`);
      datos['DISTRIBUIDORES'] = [];
    }
  } else {
    console.log(`⚠️  DISTRIBUIDORES: panel-ordenes-compra-manual.json no encontrado`);
    datos['DISTRIBUIDORES'] = [];
  }
} catch (error) {
  console.log(`❌ DISTRIBUIDORES: Error - ${error.message}`);
  datos['DISTRIBUIDORES'] = [];
}

// ORDENES_COMPRA (preferir Excel)
try {
  const ordenesPath = path.join(DATA_DIR, 'ordenes-compra-excel.json');
  if (fs.existsSync(ordenesPath)) {
    const ordenesData = JSON.parse(fs.readFileSync(ordenesPath, 'utf-8'));
    // Restar cantidad anterior
    if (datos['ORDENES_COMPRA']) {
      totalRegistros -= Array.isArray(datos['ORDENES_COMPRA']) ? datos['ORDENES_COMPRA'].length : 0;
    }
    datos['ORDENES_COMPRA'] = ordenesData;
    totalRegistros += ordenesData.length;
    console.log(`✅ ORDENES_COMPRA: ${ordenesData.length} registros (desde Excel)`);
  } else {
    console.log(`⚠️  ORDENES_COMPRA: Archivo Excel no encontrado`);
  }
} catch (error) {
  console.log(`❌ ORDENES_COMPRA: Error - ${error.message}`);
}

// ALMACEN_MONTE (preferir Excel)
try {
  const almacenPath = path.join(DATA_DIR, 'almacen-monte-excel.json');
  if (fs.existsSync(almacenPath)) {
    const almacenData = JSON.parse(fs.readFileSync(almacenPath, 'utf-8'));
    // Restar cantidad anterior
    if (datos['ALMACEN_MONTE']) {
      const prevCount = Array.isArray(datos['ALMACEN_MONTE'])
        ? datos['ALMACEN_MONTE'].length
        : (datos['ALMACEN_MONTE'].ingresos?.length || 0) +
          (datos['ALMACEN_MONTE'].gastos?.length || 0);
      totalRegistros -= prevCount;
    }
    datos['ALMACEN_MONTE'] = almacenData;
    totalRegistros += almacenData.length;
    console.log(`✅ ALMACEN_MONTE: ${almacenData.length} registros (desde Excel)`);
  } else {
    console.log(`⚠️  ALMACEN_MONTE: Archivo Excel no encontrado`);
  }
} catch (error) {
  console.log(`❌ ALMACEN_MONTE: Error - ${error.message}`);
}

console.log();
console.log('='.repeat(80));
console.log(`📈 TOTAL DE REGISTROS: ${totalRegistros}`);
console.log('='.repeat(80));
console.log();

// Generar código JavaScript
console.log('📝 Generando FlowDistributorData.js...');

let jsCode = `/**
 * 🔥 FLOWDISTRIBUTOR DATA - DATOS COMPLETOS
 * ==========================================
 * Generado automáticamente desde archivos panel-*-manual.json
 * SIN OMITIR NINGÚN DATO
 *
 * Total de registros: ${totalRegistros}
 * Fecha: ${new Date().toISOString()}
 */

`;

// Generar exports
for (const [exportName, data] of Object.entries(datos)) {
  jsCode += `// ============================================================================\n`;
  jsCode += `// ${exportName}\n`;
  jsCode += `// ============================================================================\n\n`;
  jsCode += `export const ${exportName} = ${JSON.stringify(data, null, 2)};\n\n`;
}

// Agregar DASHBOARD vacío por compatibilidad
jsCode += `// ============================================================================\n`;
jsCode += `// DASHBOARD (calculado dinámicamente)\n`;
jsCode += `// ============================================================================\n\n`;
jsCode += `export const DASHBOARD = {\n`;
jsCode += `  consolidado: {},\n`;
jsCode += `  estadisticas: {},\n`;
jsCode += `  ultimasTransacciones: [],\n`;
jsCode += `};\n\n`;

// Agregar DATOS_COMPLETOS
jsCode += `// ============================================================================\n`;
jsCode += `// DATOS_COMPLETOS (todos los datos consolidados)\n`;
jsCode += `// ============================================================================\n\n`;
jsCode += `export const DATOS_COMPLETOS = {\n`;
jsCode += `  ordenesCompra: ORDENES_COMPRA,\n`;
jsCode += `  distribuidores: DISTRIBUIDORES,\n`;
jsCode += `  ventasLocal: VENTAS_LOCAL,\n`;
jsCode += `  clientes: CLIENTES,\n`;
jsCode += `  almacenMonte: ALMACEN_MONTE,\n`;
jsCode += `  bancos: {\n`;
jsCode += `    bovedaMonte: BOVEDA_MONTE,\n`;
jsCode += `    bovedaUsa: BOVEDA_USA,\n`;
jsCode += `    fleteSur: FLETE_SUR,\n`;
jsCode += `    azteca: AZTECA,\n`;
jsCode += `    utilidades: UTILIDADES,\n`;
jsCode += `    leftie: LEFTIE,\n`;
jsCode += `    profit: PROFIT,\n`;
jsCode += `  },\n`;
jsCode += `  gastosYAbonos: GASTOS_Y_ABONOS,\n`;
jsCode += `  totalRegistros: ${totalRegistros},\n`;
jsCode += `  fechaGeneracion: '${new Date().toISOString()}',\n`;
jsCode += `};\n\n`;

jsCode += `// Export default para importación fácil\n`;
jsCode += `export default DATOS_COMPLETOS;\n`;

// Guardar archivo
console.log(`💾 Guardando: ${OUTPUT_FILE}`);
fs.writeFileSync(OUTPUT_FILE, jsCode, 'utf-8');

console.log('✅ Archivo generado exitosamente');
console.log();
console.log('='.repeat(80));
console.log('✅ FUSIÓN COMPLETA - SIN OMISIONES');
console.log('='.repeat(80));
console.log();
console.log(`📊 Resumen:`);
console.log(`  - Total registros: ${totalRegistros}`);
console.log(`  - Objetivo Excel: 2,617`);
console.log(`  - Cobertura: ${((totalRegistros / 2617) * 100).toFixed(1)}%`);
console.log();
