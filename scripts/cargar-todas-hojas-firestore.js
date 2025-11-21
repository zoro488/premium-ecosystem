#!/usr/bin/env node
/**
 * 🔥 CARGA COMPLETA DE TODAS LAS HOJAS A FIRESTORE
 * Lee: datos_excel_completos.json (nueva estructura con 12 hojas)
 * Carga TODAS las hojas con su estructura horizontal correcta
 */
import { initializeApp } from 'firebase/app';
import { collection, doc, getDocs, getFirestore, writeBatch } from 'firebase/firestore';
import { readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Firebase config (lee de .env)
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
};

console.log('🔧 Firebase Config:', {
  projectId: firebaseConfig.projectId,
  authDomain: firebaseConfig.authDomain,
});

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Leer datos
const dataPath = join(__dirname, '../datos_excel_completos.json');
const data = JSON.parse(readFileSync(dataPath, 'utf-8'));

console.log('\n' + '='.repeat(80));
console.log('🚀 CARGA COMPLETA DE TODAS LAS HOJAS A FIRESTORE');
console.log('='.repeat(80));
console.log(
  `📂 Archivo: datos_excel_completos.json (${(readFileSync(dataPath).length / 1024).toFixed(2)} KB)`
);
console.log(`📊 Versión: ${data.metadata.version}`);
console.log(`🗓️  Extracción: ${data.metadata.fechaExtraccion}`);
console.log(`📄 Total Hojas: ${data.metadata.totalHojas}`);
console.log('='.repeat(80) + '\n');

/**
 * Limpia una colección completa
 */
async function limpiarColeccion(nombre) {
  console.log(`🧹 Limpiando colección: ${nombre}...`);
  try {
    const snapshot = await getDocs(collection(db, nombre));
    if (!snapshot.empty) {
      const batches = [];
      let currentBatch = writeBatch(db);
      let opsInBatch = 0;

      snapshot.docs.forEach((d, idx) => {
        currentBatch.delete(d.ref);
        opsInBatch++;

        if (opsInBatch === 500 || idx === snapshot.docs.length - 1) {
          batches.push(currentBatch);
          currentBatch = writeBatch(db);
          opsInBatch = 0;
        }
      });

      for (const batch of batches) {
        await batch.commit();
      }

      console.log(`   ✅ ${snapshot.size} docs eliminados\n`);
    } else {
      console.log(`   ℹ️  Colección vacía\n`);
    }
  } catch (error) {
    console.error(`   ❌ Error limpiando ${nombre}:`, error.message);
  }
}

/**
 * Sube array de docs en batches de 500
 */
async function subirArray(coleccion, items, generarId = null) {
  if (!items || items.length === 0) {
    console.log(`   ⚠️  No hay datos para ${coleccion}`);
    return;
  }

  console.log(`📤 Subiendo ${items.length} docs a: ${coleccion}`);

  const BATCH_SIZE = 500;
  let totalSubidos = 0;

  for (let i = 0; i < items.length; i += BATCH_SIZE) {
    const batch = writeBatch(db);
    const chunk = items.slice(i, i + BATCH_SIZE);

    chunk.forEach((item, idx) => {
      const docId = generarId
        ? generarId(item, i + idx)
        : item.id || `${coleccion}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      const { id: _, ...dataWithoutId } = item;
      const docRef = doc(db, coleccion, docId);

      batch.set(docRef, {
        ...dataWithoutId,
        _metadata: {
          origen: 'excel',
          hoja: coleccion,
          cargadoEn: new Date().toISOString(),
        },
      });
      totalSubidos++;
    });

    await batch.commit();
    console.log(`   ⏳ Progreso: ${totalSubidos}/${items.length}`);
  }

  console.log(`   ✅ ${totalSubidos} docs subidos exitosamente\n`);
}

/**
 * Sube un doc con estructura compleja (resumen + transacciones)
 */
async function subirPanel(coleccion, panelData, panelId) {
  if (!panelData) {
    console.log(`   ⚠️  No hay datos para ${coleccion}`);
    return;
  }

  console.log(`📤 Subiendo panel: ${coleccion}`);

  const batch = writeBatch(db);
  const docRef = doc(db, 'paneles', panelId);

  batch.set(docRef, {
    nombre: coleccion,
    resumen: panelData.resumen || {},
    transacciones: panelData.transacciones || [],
    _metadata: {
      origen: 'excel',
      panel: coleccion,
      cargadoEn: new Date().toISOString(),
      totalTransacciones: (panelData.transacciones || []).length,
    },
  });

  await batch.commit();
  console.log(`   ✅ Panel subido con ${(panelData.transacciones || []).length} transacciones\n`);
}

async function main() {
  try {
    console.log('🔄 Iniciando carga...\n');

    // ==============================================
    // 1. DISTRIBUIDORES (OCs + Distribuidores)
    // ==============================================
    console.log('📦 DISTRIBUIDORES');
    console.log('─'.repeat(80));

    // OCs
    await limpiarColeccion('ordenesCompra');
    await subirArray('ordenesCompra', data.distribuidores?.ordenesCompra || [], (oc) => oc.id);

    // Distribuidores
    await limpiarColeccion('distribuidores');
    await subirArray(
      'distribuidores',
      data.distribuidores?.distribuidores || [],
      (dist, idx) => dist.nombre || `dist_${idx}`
    );

    // ==============================================
    // 2. CONTROL MAESTRO (Ventas + GYA + RF)
    // ==============================================
    console.log('📊 CONTROL MAESTRO');
    console.log('─'.repeat(80));

    // Ventas
    await limpiarColeccion('ventas');
    await subirArray(
      'ventas',
      data.controlMaestro?.ventas || [],
      (venta, idx) => `venta_${venta.fecha}_${idx}`
    );

    // GYA (Gastos y Abonos)
    await limpiarColeccion('gya');
    await subirArray(
      'gya',
      data.controlMaestro?.gya || [],
      (gasto, idx) => `gya_${gasto.fecha}_${idx}`
    );

    // RF Actual (como doc singleton)
    const batchRF = writeBatch(db);
    const rfRef = doc(db, 'configuracion', 'rfActual');
    batchRF.set(rfRef, {
      valor: data.controlMaestro?.rfActual || 0,
      ultimaActualizacion: new Date().toISOString(),
    });
    await batchRF.commit();
    console.log(`   ✅ RF Actual: $${(data.controlMaestro?.rfActual || 0).toLocaleString()}\n`);

    // ==============================================
    // 3-10. PANELES FINANCIEROS
    // ==============================================
    console.log('💰 PANELES FINANCIEROS');
    console.log('─'.repeat(80));

    await limpiarColeccion('paneles');

    const paneles = [
      { key: 'almacenmonte', data: data.almacenmonte, nombre: 'Almacén Monte' },
      { key: 'bovedamonte', data: data.bovedamonte, nombre: 'Bóveda Monte' },
      { key: 'bovedausa', data: data.bovedausa, nombre: 'Bóveda USA' },
      { key: 'fletesur', data: data.fletesur, nombre: 'Flete Sur' },
      { key: 'utilidades', data: data.utilidades, nombre: 'Utilidades' },
      { key: 'azteca', data: data.azteca, nombre: 'Azteca' },
      { key: 'leftie', data: data.leftie, nombre: 'Leftie' },
      { key: 'profit', data: data.profit, nombre: 'Profit' },
    ];

    for (const panel of paneles) {
      await subirPanel(panel.nombre, panel.data, panel.key);
    }

    // ==============================================
    // 11. CLIENTES
    // ==============================================
    console.log('👥 CLIENTES');
    console.log('─'.repeat(80));

    await limpiarColeccion('clientes');
    await subirArray('clientes', data.clientes || [], (cliente) =>
      cliente.nombre.replace(/\s+/g, '_').toLowerCase()
    );

    // ==============================================
    // 12. DATA (Listas de referencia)
    // ==============================================
    console.log('📋 DATA (Referencias)');
    console.log('─'.repeat(80));

    const batchData = writeBatch(db);
    const dataRef = doc(db, 'configuracion', 'listas');
    batchData.set(dataRef, {
      odgya: data.data?.odgya || [],
      destinos: data.data?.destinos || [],
      clientesReferencia: data.data?.clientesReferencia || [],
      _metadata: {
        origen: 'excel',
        cargadoEn: new Date().toISOString(),
      },
    });
    await batchData.commit();
    console.log(`   ✅ Listas de referencia cargadas\n`);

    // ==============================================
    // RESUMEN FINAL
    // ==============================================
    console.log('\n' + '='.repeat(80));
    console.log('🎉 ¡CARGA COMPLETADA EXITOSAMENTE!');
    console.log('='.repeat(80));
    console.log('\n📊 RESUMEN DE DATOS CARGADOS:');
    console.log(`   ✅ Órdenes de Compra: ${data.distribuidores?.ordenesCompra?.length || 0}`);
    console.log(`   ✅ Distribuidores: ${data.distribuidores?.distribuidores?.length || 0}`);
    console.log(`   ✅ Ventas: ${data.controlMaestro?.ventas?.length || 0}`);
    console.log(`   ✅ GYA: ${data.controlMaestro?.gya?.length || 0}`);
    console.log(`   ✅ RF Actual: $${(data.controlMaestro?.rfActual || 0).toLocaleString()}`);
    console.log(`   ✅ Paneles: 8 paneles con transacciones`);
    console.log(`   ✅ Clientes: ${data.clientes?.length || 0}`);
    console.log(`   ✅ Listas Referencia: 3 listas`);

    console.log('\n💡 PRÓXIMOS PASOS:');
    console.log('   1. Verificar datos en Firebase Console');
    console.log('   2. Ejecutar: npm run dev');
    console.log('   3. Abrir: http://localhost:3004/flowdistributor');
    console.log('   4. Verificar que TODOS los datos aparezcan en la UI\n');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ ERROR FATAL:', error);
    console.error('\nStack trace:', error.stack);
    process.exit(1);
  }
}

// Ejecutar
main();
