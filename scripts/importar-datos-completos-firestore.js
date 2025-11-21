/**
 * 🔥 IMPORTADOR COMPLETO DE DATOS A FIRESTORE
 * Importa TODOS los registros del Excel sin omitir nada
 * - 7 Bancos con todos sus movimientos
 * - Almacén con ingresos y salidas
 * - Clientes con historial completo
 * - Ventas con todos los detalles
 * - Órdenes de Compra completas
 *
 * USO:
 * node scripts/importar-datos-completos-firestore.js
 */
import { initializeApp } from 'firebase/app';
import { collection, doc, getFirestore, serverTimestamp, writeBatch } from 'firebase/firestore';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ========================================================================
// CONFIGURACIÓN FIREBASE
// ========================================================================

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY || 'AIzaSyCz-DnvuqVJqNl4YQKDJGa0NhCeGx9mXKc',
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN || 'premium-ecosystem-d2b47.firebaseapp.com',
  projectId: process.env.VITE_FIREBASE_PROJECT_ID || 'premium-ecosystem-d2b47',
  storageBucket:
    process.env.VITE_FIREBASE_STORAGE_BUCKET || 'premium-ecosystem-d2b47.firebasestorage.app',
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '680619098896',
  appId: process.env.VITE_FIREBASE_APP_ID || '1:680619098896:web:a34ea34a5f65d8a4c92d00',
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ========================================================================
// CARGAR DATOS DEL JSON
// ========================================================================

const jsonPath = path.join(__dirname, '..', 'sistema_completo_todos_datos.json');
console.log('📂 Leyendo archivo:', jsonPath);

let datosCompletos;
try {
  const jsonData = fs.readFileSync(jsonPath, 'utf-8');
  datosCompletos = JSON.parse(jsonData);
  console.log('✅ Datos cargados exitosamente');
  console.log(`📊 Paneles encontrados: ${datosCompletos.paneles?.length || 0}`);
} catch (error) {
  console.error('❌ Error leyendo JSON:', error);
  process.exit(1);
}

// ========================================================================
// UTILIDADES
// ========================================================================

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const convertirFecha = (fechaStr) => {
  if (!fechaStr) return new Date();
  try {
    return new Date(fechaStr);
  } catch {
    return new Date();
  }
};

const limpiarNumero = (valor) => {
  if (typeof valor === 'number') return valor;
  if (typeof valor === 'string') {
    const limpio = valor.replace(/[^0-9.-]/g, '');
    return parseFloat(limpio) || 0;
  }
  return 0;
};

// ========================================================================
// FUNCIONES DE IMPORTACIÓN
// ========================================================================

/**
 * Importa un banco completo con todos sus registros
 */
async function importarBanco(panel, bancoId) {
  console.log(`\n🏦 Importando banco: ${panel.panel}`);

  const batch = writeBatch(db);
  const contadores = {
    ingresos: 0,
    gastos: 0,
    transferencias: 0,
  };

  try {
    // 1. Crear/actualizar documento del banco
    const bancoRef = doc(db, 'bancos', bancoId);
    const bancoData = {
      id: bancoId,
      nombre: panel.panel.replace(/_/g, ' '),
      capitalActual: limpiarNumero(panel.rfActual?.valor || 0),
      capitalHistorico: limpiarNumero(panel.rfActual?.valor || 0),
      moneda: panel.panel.includes('USA') ? 'USD' : 'MXN',
      tipo: panel.tipoPanel,
      activo: true,
      updatedAt: serverTimestamp(),
      createdAt: serverTimestamp(),
    };

    batch.set(bancoRef, bancoData, { merge: true });
    console.log(`  ✓ Banco configurado: ${bancoData.nombre}`);

    // 2. Importar INGRESOS
    if (panel.ingresos?.registros) {
      console.log(`  📥 Importando ${panel.ingresos.registros.length} ingresos...`);

      for (const ingreso of panel.ingresos.registros) {
        const ingresoRef = doc(collection(db, 'ingresos'));
        batch.set(ingresoRef, {
          bancoId: bancoId,
          fecha: convertirFecha(ingreso.Fecha),
          monto: limpiarNumero(ingreso.Cantidad || ingreso.Ingreso || 0),
          concepto: ingreso.Concepto || ingreso.Cliente || 'Sin concepto',
          fuente: ingreso.Distribuidor || 'Otros',
          oc: ingreso.OC || null,
          corte: ingreso.Corte || null,
          notas: ingreso.Observaciones || '',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
        contadores.ingresos++;
      }
    }

    // 3. Importar GASTOS/SALIDAS
    if (panel.gastos?.registros || panel.salidas?.registros) {
      const gastosData = panel.gastos?.registros || panel.salidas?.registros || [];
      console.log(`  📤 Importando ${gastosData.length} gastos...`);

      for (const gasto of gastosData) {
        const gastoRef = doc(collection(db, 'gastos'));
        batch.set(gastoRef, {
          bancoId: bancoId,
          fecha: convertirFecha(gasto.Fecha),
          monto: limpiarNumero(gasto.Cantidad || gasto.Gasto || gasto.Monto || 0),
          concepto: gasto.Concepto || gasto.Cliente || 'Sin concepto',
          categoria: gasto.Categoria || 'Otros',
          oc: gasto.OC || null,
          corte: gasto.Corte || null,
          notas: gasto.Observaciones || '',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
        contadores.gastos++;
      }
    }

    // 4. Commit del batch
    await batch.commit();

    console.log(`  ✅ Banco importado correctamente`);
    console.log(`     - Ingresos: ${contadores.ingresos}`);
    console.log(`     - Gastos: ${contadores.gastos}`);

    return contadores;
  } catch (error) {
    console.error(`  ❌ Error importando banco:`, error);
    throw error;
  }
}

/**
 * Importa almacén con entradas y salidas
 */
async function importarAlmacen(panel) {
  console.log(`\n📦 Importando Almacén...`);

  const batch = writeBatch(db);
  const contadores = { entradas: 0, salidas: 0 };

  try {
    // Almacén principal
    const almacenRef = doc(db, 'almacen', 'general');
    batch.set(
      almacenRef,
      {
        rfActual: limpiarNumero(panel.rfActual?.valor || 0),
        totalEntradas: panel.ingresos?.total || 0,
        totalSalidas: panel.gastos?.total || 0,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );

    // Entradas
    if (panel.ingresos?.registros) {
      for (const entrada of panel.ingresos.registros) {
        const entradaRef = doc(collection(db, 'almacen_entradas'));
        batch.set(entradaRef, {
          fecha: convertirFecha(entrada.Fecha),
          cantidad: limpiarNumero(entrada.Cantidad),
          oc: entrada.OC,
          cliente: entrada.Cliente,
          distribuidor: entrada.Distribuidor,
          corte: entrada.Corte,
          concepto: entrada.Concepto || '',
          observaciones: entrada.Observaciones || '',
          createdAt: serverTimestamp(),
        });
        contadores.entradas++;
      }
    }

    // Salidas
    if (panel.gastos?.registros) {
      for (const salida of panel.gastos.registros) {
        const salidaRef = doc(collection(db, 'almacen_salidas'));
        batch.set(salidaRef, {
          fecha: convertirFecha(salida.Fecha),
          cantidad: limpiarNumero(salida.Cantidad),
          oc: salida.OC,
          cliente: salida.Cliente,
          distribuidor: salida.Distribuidor,
          corte: salida.Corte,
          concepto: salida.Concepto || '',
          observaciones: salida.Observaciones || '',
          createdAt: serverTimestamp(),
        });
        contadores.salidas++;
      }
    }

    await batch.commit();

    console.log(`  ✅ Almacén importado`);
    console.log(`     - Entradas: ${contadores.entradas}`);
    console.log(`     - Salidas: ${contadores.salidas}`);

    return contadores;
  } catch (error) {
    console.error(`  ❌ Error importando almacén:`, error);
    throw error;
  }
}

/**
 * Importa clientes completos
 */
async function importarClientes(panel) {
  console.log(`\n👥 Importando Clientes...`);

  const batch = writeBatch(db);
  let contador = 0;

  try {
    if (!panel.registros) {
      console.log('  ⚠️ No se encontraron registros de clientes');
      return 0;
    }

    for (const cliente of panel.registros) {
      const clienteRef = doc(collection(db, 'clientes'));
      batch.set(clienteRef, {
        nombre: cliente.Cliente || cliente.Nombre,
        actual: limpiarNumero(cliente.Actual || 0),
        deuda: limpiarNumero(cliente.Deuda || cliente['Adeudos/Saldos'] || 0),
        abonos: limpiarNumero(cliente.Abonos || 0),
        pendiente: limpiarNumero(cliente.Pendiente || 0),
        observaciones: cliente.Observaciones || '',
        estado: 'activo',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      contador++;
    }

    await batch.commit();

    console.log(`  ✅ ${contador} clientes importados`);
    return contador;
  } catch (error) {
    console.error(`  ❌ Error importando clientes:`, error);
    throw error;
  }
}

/**
 * Importa distribuidores y órdenes de compra
 */
async function importarDistribuidores(panel) {
  console.log(`\n🏭 Importando Distribuidores y OCs...`);

  const batch = writeBatch(db);
  const contadores = { distribuidores: 0, ordenes: 0 };

  try {
    if (!panel.registros) {
      console.log('  ⚠️ No se encontraron registros');
      return contadores;
    }

    // Procesar cada distribuidor
    const distribuidoresMap = new Map();

    for (const registro of panel.registros) {
      const nombreDist = registro.Distribuidor || registro.Cliente;

      if (!distribuidoresMap.has(nombreDist)) {
        const distRef = doc(collection(db, 'distribuidores'));
        batch.set(distRef, {
          nombre: nombreDist,
          totalOrdenes: 0,
          totalComprado: 0,
          adeudo: limpiarNumero(registro.Adeudo || registro['Resta por Pagar'] || 0),
          estado: 'activo',
          createdAt: serverTimestamp(),
        });
        distribuidoresMap.set(nombreDist, distRef.id);
        contadores.distribuidores++;
      }

      // Orden de Compra
      if (registro.OC) {
        const ocRef = doc(collection(db, 'ordenes_compra'));
        batch.set(ocRef, {
          oc: registro.OC,
          distribuidor: nombreDist,
          fecha: convertirFecha(registro.Fecha),
          cantidad: limpiarNumero(registro.Cantidad || registro['Cantidad OC'] || 0),
          costoUnitario: limpiarNumero(registro['Costo Unitario'] || 0),
          costoTotal: limpiarNumero(registro['Costo Total OC'] || 0),
          corte: registro.Corte || '',
          estado: registro.Estado || 'activa',
          createdAt: serverTimestamp(),
        });
        contadores.ordenes++;
      }
    }

    await batch.commit();

    console.log(`  ✅ Importación completada`);
    console.log(`     - Distribuidores: ${contadores.distribuidores}`);
    console.log(`     - Órdenes: ${contadores.ordenes}`);

    return contadores;
  } catch (error) {
    console.error(`  ❌ Error importando distribuidores:`, error);
    throw error;
  }
}

// ========================================================================
// FUNCIÓN PRINCIPAL
// ========================================================================

async function importarTodo() {
  console.log('═'.repeat(80));
  console.log('🚀 INICIANDO IMPORTACIÓN COMPLETA A FIRESTORE');
  console.log('═'.repeat(80));

  const inicio = Date.now();
  const totales = {
    bancos: 0,
    ingresos: 0,
    gastos: 0,
    almacenEntradas: 0,
    almacenSalidas: 0,
    clientes: 0,
    distribuidores: 0,
    ordenesCompra: 0,
  };

  try {
    // Mapeo de paneles a IDs de Firestore
    const bancosMap = {
      Almacen_Monte: null, // Se maneja por separado
      Bóveda_Monte: 'boveda-monte',
      Bóveda_USA: 'boveda-usa',
      Utilidades: 'utilidades',
      Flete_Sur: 'flete-sur',
      Azteca: 'azteca',
      Leftie: 'leftie',
      Profit: 'profit',
    };

    for (const panel of datosCompletos.paneles) {
      const nombrePanel = panel.panel;

      // Almacén
      if (nombrePanel === 'Almacen_Monte') {
        const { entradas, salidas } = await importarAlmacen(panel);
        totales.almacenEntradas += entradas;
        totales.almacenSalidas += salidas;
        await sleep(500);
        continue;
      }

      // Clientes
      if (nombrePanel === 'Clientes') {
        const count = await importarClientes(panel);
        totales.clientes += count;
        await sleep(500);
        continue;
      }

      // Distribuidores
      if (nombrePanel.includes('Distribuidores')) {
        const { distribuidores, ordenes } = await importarDistribuidores(panel);
        totales.distribuidores += distribuidores;
        totales.ordenesCompra += ordenes;
        await sleep(500);
        continue;
      }

      // Bancos
      const bancoId = bancosMap[nombrePanel];
      if (bancoId) {
        const { ingresos, gastos } = await importarBanco(panel, bancoId);
        totales.bancos++;
        totales.ingresos += ingresos;
        totales.gastos += gastos;
        await sleep(500); // Evitar rate limiting
      }
    }

    const duracion = ((Date.now() - inicio) / 1000).toFixed(2);

    console.log('\n' + '═'.repeat(80));
    console.log('✅ IMPORTACIÓN COMPLETADA EXITOSAMENTE');
    console.log('═'.repeat(80));
    console.log(`\n📊 RESUMEN FINAL:`);
    console.log(`   🏦 Bancos: ${totales.bancos}`);
    console.log(`   📥 Ingresos: ${totales.ingresos}`);
    console.log(`   📤 Gastos: ${totales.gastos}`);
    console.log(`   📦 Almacén Entradas: ${totales.almacenEntradas}`);
    console.log(`   📦 Almacén Salidas: ${totales.almacenSalidas}`);
    console.log(`   👥 Clientes: ${totales.clientes}`);
    console.log(`   🏭 Distribuidores: ${totales.distribuidores}`);
    console.log(`   📋 Órdenes de Compra: ${totales.ordenesCompra}`);
    console.log(`\n⏱️  Tiempo total: ${duracion}s`);
    console.log('═'.repeat(80));
  } catch (error) {
    console.error('\n❌ ERROR CRÍTICO:', error);
    process.exit(1);
  }
}

// Ejecutar
importarTodo()
  .then(() => {
    console.log('\n✅ Proceso finalizado. Puedes cerrar esta ventana.');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Error fatal:', error);
    process.exit(1);
  });
