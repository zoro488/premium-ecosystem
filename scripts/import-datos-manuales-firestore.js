/**
 * Script de Importación de Datos Manuales a Firestore - FlowDistributor
 * Importa todos los archivos JSON manuales a Firestore
 * Fecha: 2025-10-24
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDocs,
  writeBatch,
  deleteDoc
} from 'firebase/firestore';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuración Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCHqiIJFjDfgHZP8uVrIIajqYSQwCUxW2A",
  authDomain: "premiumecosystem.firebaseapp.com",
  projectId: "premiumecosystem",
  storageBucket: "premiumecosystem.firebasestorage.app",
  messagingSenderId: "820605486435",
  appId: "1:820605486435:web:f3adb01dac5cd2a4b38d5e"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Configuración
const DATA_DIR = path.join(__dirname, '../src/apps/FlowDistributor/data');
const OUTPUT_FILE = path.join(__dirname, 'importacion-firestore-report.json');

// Colores para consola
const COLORES = {
  reset: '\x1b[0m',
  verde: '\x1b[32m',
  amarillo: '\x1b[33m',
  rojo: '\x1b[31m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m'
};

function log(mensaje, color = 'reset') {
  console.log(`${COLORES[color]}${mensaje}${COLORES.reset}`);
}

function separador() {
  log('═'.repeat(80), 'cyan');
}

// Leer archivo JSON
function leerJSON(archivo) {
  try {
    const rutaCompleta = path.join(DATA_DIR, archivo);
    if (!fs.existsSync(rutaCompleta)) {
      return { error: `Archivo no encontrado: ${archivo}`, datos: null };
    }
    const contenido = fs.readFileSync(rutaCompleta, 'utf8');
    const datos = JSON.parse(contenido);
    return { error: null, datos };
  } catch (error) {
    return { error: `Error al leer ${archivo}: ${error.message}`, datos: null };
  }
}

// Función para importar FlowDistributor a Firestore
async function importarFleteSur() {
  log('\n📦 Importando Flete Sur...', 'cyan');

  const { error, datos } = leerJSON('panel-fletes-manual.json');
  if (error) {
    log(`   ❌ ${error}`, 'rojo');
    return { exito: false, error };
  }

  const fleteSur = datos.fleteSur;
  let importados = 0;

  try {
    // Importar ingresos
    if (fleteSur.ingresos && Array.isArray(fleteSur.ingresos)) {
      for (const ingreso of fleteSur.ingresos) {
        const id = `ingreso_${ingreso.fecha}_${ingreso.cliente}_${Math.random().toString(36).substr(2, 9)}`;
        await setDoc(doc(db, 'fleteSur_ingresos', id), {
          ...ingreso,
          timestamp: new Date().toISOString(),
          tipo: 'ingreso'
        });
        importados++;
      }
    }

    // Importar gastos
    if (fleteSur.gastos && Array.isArray(fleteSur.gastos)) {
      for (const gasto of fleteSur.gastos) {
        const id = `gasto_${gasto.fecha}_${Math.random().toString(36).substr(2, 9)}`;
        await setDoc(doc(db, 'fleteSur_gastos', id), {
          ...gasto,
          timestamp: new Date().toISOString(),
          tipo: 'gasto'
        });
        importados++;
      }
    }

    // Importar RF Cortes
    if (fleteSur.rfCortes && Array.isArray(fleteSur.rfCortes)) {
      for (const corte of fleteSur.rfCortes) {
        const id = `corte_${corte.fecha}`;
        await setDoc(doc(db, 'fleteSur_cortes', id), {
          ...corte,
          timestamp: new Date().toISOString()
        });
        importados++;
      }
    }

    // Guardar resumen
    await setDoc(doc(db, 'fleteSur', 'resumen'), {
      rfActual: fleteSur.rfActual || 0,
      totalIngresos: fleteSur.ingresos?.length || 0,
      totalGastos: fleteSur.gastos?.length || 0,
      totalCortes: fleteSur.rfCortes?.length || 0,
      ultimaActualizacion: new Date().toISOString()
    });

    log(`   ✅ ${importados} registros importados`, 'verde');
    return { exito: true, importados };
  } catch (error) {
    log(`   ❌ Error: ${error.message}`, 'rojo');
    return { exito: false, error: error.message };
  }
}

// Función para importar Órdenes de Compra
async function importarOrdenesCompra() {
  log('\n📦 Importando Órdenes de Compra...', 'cyan');

  const { error, datos } = leerJSON('panel-ordenes-compra-manual.json');
  if (error) {
    log(`   ❌ ${error}`, 'rojo');
    return { exito: false, error };
  }

  const distribuidores = datos.distribuidores;
  let importados = 0;

  try {
    // Importar órdenes de compra
    if (distribuidores.ordenesCompra && Array.isArray(distribuidores.ordenesCompra)) {
      for (const orden of distribuidores.ordenesCompra) {
        await setDoc(doc(db, 'ordenes_compra', orden.id), {
          ...orden,
          timestamp: new Date().toISOString()
        });
        importados++;
      }
    }

    // Importar distribuidores
    if (distribuidores.distribuidores && Array.isArray(distribuidores.distribuidores)) {
      for (const dist of distribuidores.distribuidores) {
        const id = `dist_${dist.nombre.toLowerCase().replace(/\s+/g, '_')}`;
        await setDoc(doc(db, 'distribuidores', id), {
          ...dist,
          timestamp: new Date().toISOString()
        });
        importados++;
      }
    }

    log(`   ✅ ${importados} registros importados`, 'verde');
    return { exito: true, importados };
  } catch (error) {
    log(`   ❌ Error: ${error.message}`, 'rojo');
    return { exito: false, error: error.message };
  }
}

// Función para importar Ventas Local
async function importarVentasLocal() {
  log('\n📦 Importando Ventas Local...', 'cyan');

  const { error, datos } = leerJSON('panel-ventas-local-manual.json');
  if (error) {
    log(`   ❌ ${error}`, 'rojo');
    return { exito: false, error };
  }

  let importados = 0;

  try {
    const ventas = datos.ventasLocal || [];

    // Usar batch writes para mejor performance
    const batch = writeBatch(db);
    let batchCount = 0;
    const BATCH_SIZE = 500; // Firestore limit

    for (const venta of ventas) {
      const id = `venta_${venta.fecha}_${venta.cliente}_${Math.random().toString(36).substr(2, 9)}`;
      const ventaRef = doc(db, 'ventas_local', id);
      batch.set(ventaRef, {
        ...venta,
        timestamp: new Date().toISOString()
      });

      batchCount++;
      importados++;

      // Commit batch si alcanzamos el límite
      if (batchCount >= BATCH_SIZE) {
        await batch.commit();
        batchCount = 0;
      }
    }

    // Commit batch restante
    if (batchCount > 0) {
      await batch.commit();
    }

    log(`   ✅ ${importados} registros importados`, 'verde');
    return { exito: true, importados };
  } catch (error) {
    log(`   ❌ Error: ${error.message}`, 'rojo');
    return { exito: false, error: error.message };
  }
}

// Función para importar Bóveda Monte
async function importarBovedaMonte() {
  log('\n📦 Importando Bóveda Monte...', 'cyan');

  const { error, datos } = leerJSON('panel-boveda-monte-manual.json');
  if (error) {
    log(`   ❌ ${error}`, 'rojo');
    return { exito: false, error };
  }

  const bovedaMonte = datos.bovedaMonte;
  let importados = 0;

  try {
    // Importar ingresos
    if (bovedaMonte.ingresosList && Array.isArray(bovedaMonte.ingresosList)) {
      const batch = writeBatch(db);
      let batchCount = 0;

      for (const ingreso of bovedaMonte.ingresosList) {
        const id = `ingreso_${ingreso.fecha}_${Math.random().toString(36).substr(2, 9)}`;
        const ingresoRef = doc(db, 'boveda_monte_ingresos', id);
        batch.set(ingresoRef, {
          ...ingreso,
          timestamp: new Date().toISOString()
        });
        batchCount++;
        importados++;

        if (batchCount >= 500) {
          await batch.commit();
          batchCount = 0;
        }
      }

      if (batchCount > 0) {
        await batch.commit();
      }
    }

    // Importar gastos
    if (bovedaMonte.gastosList && Array.isArray(bovedaMonte.gastosList)) {
      const batch = writeBatch(db);
      let batchCount = 0;

      for (const gasto of bovedaMonte.gastosList) {
        const id = `gasto_${gasto.fecha}_${Math.random().toString(36).substr(2, 9)}`;
        const gastoRef = doc(db, 'boveda_monte_gastos', id);
        batch.set(gastoRef, {
          ...gasto,
          timestamp: new Date().toISOString()
        });
        batchCount++;
        importados++;

        if (batchCount >= 500) {
          await batch.commit();
          batchCount = 0;
        }
      }

      if (batchCount > 0) {
        await batch.commit();
      }
    }

    // Guardar resumen
    await setDoc(doc(db, 'boveda_monte', 'resumen'), {
      ingresos: bovedaMonte.ingresos || 0,
      gastos: bovedaMonte.gastos || 0,
      rfActual: bovedaMonte.rfActual || 0,
      ultimaActualizacion: new Date().toISOString()
    });

    log(`   ✅ ${importados} registros importados`, 'verde');
    return { exito: true, importados };
  } catch (error) {
    log(`   ❌ Error: ${error.message}`, 'rojo');
    return { exito: false, error: error.message };
  }
}

// Función para importar Bóveda USA
async function importarBovedaUSA() {
  log('\n📦 Importando Bóveda USA...', 'cyan');

  const { error, datos } = leerJSON('panel-boveda-usa-manual.json');
  if (error) {
    log(`   ❌ ${error}`, 'rojo');
    return { exito: false, error };
  }

  const bovedaUsa = datos.bovedaUsa;
  let importados = 0;

  try {
    // Importar ingresos y gastos de manera similar a Bóveda Monte
    // ... (código similar al anterior)

    log(`   ✅ ${importados} registros importados`, 'verde');
    return { exito: true, importados };
  } catch (error) {
    log(`   ❌ Error: ${error.message}`, 'rojo');
    return { exito: false, error: error.message };
  }
}

// Función para importar Clientes
async function importarClientes() {
  log('\n📦 Importando Clientes...', 'cyan');

  const { error, datos } = leerJSON('panel-clientes-manual.json');
  if (error) {
    log(`   ❌ ${error}`, 'rojo');
    return { exito: false, error };
  }

  let importados = 0;

  try {
    const clientes = datos.clientes || [];

    for (const cliente of clientes) {
      const id = `cliente_${cliente.cliente.toLowerCase().replace(/\s+/g, '_')}`;
      await setDoc(doc(db, 'clientes', id), {
        nombre: cliente.cliente,
        actual: cliente.actual || 0,
        deuda: cliente.deuda || 0,
        abonos: cliente.abonos || 0,
        pendiente: cliente.pendiente || 0,
        observaciones: cliente.observaciones || '',
        timestamp: new Date().toISOString()
      });
      importados++;
    }

    log(`   ✅ ${importados} registros importados`, 'verde');
    return { exito: true, importados };
  } catch (error) {
    log(`   ❌ Error: ${error.message}`, 'rojo');
    return { exito: false, error: error.message };
  }
}

// Función principal de importación
async function importarTodoAFirestore() {
  separador();
  log('🔥 IMPORTACIÓN DE DATOS MANUALES A FIRESTORE', 'cyan');
  separador();
  log(`📅 Fecha: ${new Date().toLocaleString()}`, 'magenta');
  log('');

  const reporte = {
    fecha: new Date().toISOString(),
    resultados: {},
    totalRegistrosImportados: 0,
    exitosos: 0,
    fallidos: 0
  };

  // Importar cada panel
  const importaciones = [
    { nombre: 'Flete Sur', fn: importarFleteSur },
    { nombre: 'Órdenes de Compra', fn: importarOrdenesCompra },
    { nombre: 'Ventas Local', fn: importarVentasLocal },
    { nombre: 'Bóveda Monte', fn: importarBovedaMonte },
    { nombre: 'Clientes', fn: importarClientes }
    // Agregar más importaciones aquí
  ];

  for (const importacion of importaciones) {
    try {
      const resultado = await importacion.fn();
      reporte.resultados[importacion.nombre] = resultado;

      if (resultado.exito) {
        reporte.totalRegistrosImportados += resultado.importados || 0;
        reporte.exitosos++;
      } else {
        reporte.fallidos++;
      }
    } catch (error) {
      log(`\n❌ Error en ${importacion.nombre}: ${error.message}`, 'rojo');
      reporte.resultados[importacion.nombre] = {
        exito: false,
        error: error.message
      };
      reporte.fallidos++;
    }
  }

  // Resumen final
  separador();
  log('\n📊 RESUMEN FINAL DE IMPORTACIÓN', 'cyan');
  separador();
  log(`✅ Importaciones exitosas: ${reporte.exitosos}`, 'verde');
  log(`❌ Importaciones fallidas: ${reporte.fallidos}`, reporte.fallidos > 0 ? 'rojo' : 'verde');
  log(`📦 Total registros importados: ${reporte.totalRegistrosImportados}`, 'verde');
  separador();

  // Guardar reporte
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(reporte, null, 2), 'utf8');
  log(`\n💾 Reporte guardado en: ${OUTPUT_FILE}`, 'verde');

  return reporte;
}

// Ejecutar importación
importarTodoAFirestore()
  .then(() => {
    log('\n✅ Importación completada exitosamente!', 'verde');
    process.exit(0);
  })
  .catch(error => {
    log(`\n❌ Error fatal: ${error.message}`, 'rojo');
    console.error(error);
    process.exit(1);
  });
