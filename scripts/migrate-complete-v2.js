import { initializeApp } from 'firebase/app';
import { collection, doc, getFirestore, serverTimestamp, writeBatch } from 'firebase/firestore';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuración Firebase
const firebaseConfig = {
  apiKey: 'AIzaSyDN82KFpPJGfzUDgU4wB7rLVJHLCn6DKM8',
  authDomain: 'premium-ecosystem-1760790572.firebaseapp.com',
  projectId: 'premium-ecosystem-1760790572',
  storageBucket: 'premium-ecosystem-1760790572.firebasestorage.app',
  messagingSenderId: '1025668867803',
  appId: '1:1025668867803:web:f8eef72d2ff2b52bd8f394',
  measurementId: 'G-FDH6XLGQR4',
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Leer JSON CORRECTO
const jsonPath = path.join(__dirname, '../src/data/datos_excel_reales_completos.json');
const rawData = fs.readFileSync(jsonPath, 'utf8');
const data = JSON.parse(rawData);

console.log('🚀 MIGRACIÓN COMPLETA A FIRESTORE');
console.log('='.repeat(80));
console.log(`📁 Fuente: ${data.metadata.fuente}`);
console.log(`📅 Extracción: ${data.metadata.fechaExtraccion}`);
console.log(`📊 Total hojas: ${data.metadata.totalHojas}`);
console.log('='.repeat(80) + '\n');

// Estadísticas
const stats = {
  totalCollections: 0,
  totalDocuments: 0,
  collections: {},
  errors: [],
};

// Helper para batch writes (máximo 500 operaciones por batch)
async function batchWrite(collectionName, documents, idField = 'id') {
  if (!documents || documents.length === 0) {
    console.log(`   📭 ${collectionName}: Sin datos, omitiendo...`);
    return 0;
  }

  console.log(`\n📦 Migrando ${collectionName}...`);
  console.log(`   └─ ${documents.length} documentos`);

  const collectionRef = collection(db, collectionName);
  let batch = writeBatch(db);
  let count = 0;
  let batchCount = 0;

  for (const document of documents) {
    // Generar ID único
    const docId = document[idField] || `${collectionName}_${count}`;
    const docRef = doc(collectionRef, docId.toString());

    // Limpiar datos (eliminar campos vacíos y undefined)
    const cleanedDoc = Object.entries(document).reduce((acc, [key, value]) => {
      if (key !== '' && value !== undefined && value !== null && value !== '') {
        acc[key] = value;
      }
      return acc;
    }, {});

    // Agregar timestamp
    const docData = {
      ...cleanedDoc,
      createdAt: serverTimestamp(),
      migratedAt: serverTimestamp(),
      source: 'excel_migration_v2',
    };

    batch.set(docRef, docData);
    count++;
    batchCount++;

    // Commit cada 500 operaciones
    if (batchCount >= 500) {
      await batch.commit();
      batch = writeBatch(db);
      batchCount = 0;
      console.log(`   ├─ ${count}/${documents.length} documentos migrados...`);
    }
  }

  // Commit final
  if (batchCount > 0) {
    await batch.commit();
  }

  console.log(`   ✅ ${count} documentos migrados exitosamente`);

  stats.collections[collectionName] = count;
  stats.totalDocuments += count;
  stats.totalCollections++;

  return count;
}

async function migrateAll() {
  try {
    const startTime = Date.now();

    // 1. CONTROL MAESTRO (Ventas Completas)
    await batchWrite('control_maestro', data.controlMaestro);

    // 2. TABLA GYA (Gastos y Abonos)
    await batchWrite('tabla_gya', data.tablaGYA);

    // 3. DISTRIBUIDORES (Órdenes de Compra)
    await batchWrite('distribuidores', data.distribuidores);

    // 4. ALMACÉN MONTE
    if (data.almacenmonte && Array.isArray(data.almacenmonte)) {
      await batchWrite('almacen_monte', data.almacenmonte);
    }

    // 5. BÓVEDA MONTE
    if (data.bovedamonte && Array.isArray(data.bovedamonte)) {
      // Separar ingresos y gastos si es necesario
      const ingresos = data.bovedamonte.filter(
        (item) => item.Ingreso || item.ingreso || item.Cliente || item.cliente
      );
      const gastos = data.bovedamonte.filter(
        (item) => item.Gasto || item.gasto || item['Origen del Gastos o Abono']
      );

      if (ingresos.length > 0) {
        await batchWrite('boveda_monte_ingresos', ingresos);
      }
      if (gastos.length > 0) {
        await batchWrite('boveda_monte_gastos', gastos);
      }
    }

    // 6. BÓVEDA USA
    if (data.bovedausa && Array.isArray(data.bovedausa)) {
      const ingresos = data.bovedausa.filter((item) => item.Ingreso || item.ingreso);
      const gastos = data.bovedausa.filter((item) => item.Gasto || item.gasto);

      if (ingresos.length > 0) {
        await batchWrite('boveda_usa_ingresos', ingresos);
      }
      if (gastos.length > 0) {
        await batchWrite('boveda_usa_gastos', gastos);
      }
    }

    // 7. AZTECA
    if (data.azteca && Array.isArray(data.azteca)) {
      const ingresos = data.azteca.filter((item) => item.Ingreso || item.ingreso);
      const gastos = data.azteca.filter((item) => item.Gasto || item.gasto);

      if (ingresos.length > 0) {
        await batchWrite('azteca_ingresos', ingresos);
      }
      if (gastos.length > 0) {
        await batchWrite('azteca_gastos', gastos);
      }
    }

    // 8. UTILIDADES
    if (data.utilidades && Array.isArray(data.utilidades)) {
      const ingresos = data.utilidades.filter((item) => item.Ingreso || item.ingreso);
      const gastos = data.utilidades.filter((item) => item.Gasto || item.gasto);

      if (ingresos.length > 0) {
        await batchWrite('utilidades_ingresos', ingresos);
      }
      if (gastos.length > 0) {
        await batchWrite('utilidades_gastos', gastos);
      }
    }

    // 9. FLETE SUR
    if (data.fletesur && Array.isArray(data.fletesur)) {
      const ingresos = data.fletesur.filter((item) => item.Ingreso || item.ingreso);
      const gastos = data.fletesur.filter((item) => item.Gasto || item.gasto);

      if (ingresos.length > 0) {
        await batchWrite('flete_sur_ingresos', ingresos);
      }
      if (gastos.length > 0) {
        await batchWrite('flete_sur_gastos', gastos);
      }
    }

    // 10. LEFTIE
    if (data.leftie && Array.isArray(data.leftie)) {
      const ingresos = data.leftie.filter((item) => item.Ingreso || item.ingreso);
      const gastos = data.leftie.filter((item) => item.Gasto || item.gasto);

      if (ingresos.length > 0) {
        await batchWrite('leftie_ingresos', ingresos);
      }
      if (gastos.length > 0) {
        await batchWrite('leftie_gastos', gastos);
      }
    }

    // 11. PROFIT
    if (data.profit && Array.isArray(data.profit)) {
      await batchWrite('profit_ingresos', data.profit);
    }

    // 12. CLIENTES
    await batchWrite('clientes', data.clientes, 'Cliente');

    // 13. DATA (tabla adicional)
    if (data.data && Array.isArray(data.data)) {
      await batchWrite('data_adicional', data.data);
    }

    // 14. RF ACTUAL (Estado actual del sistema)
    const rfActualData = [
      {
        id: 'rf_actual',
        ...data.rfActual,
        lastUpdate: serverTimestamp(),
      },
    ];
    await batchWrite('rf_actual', rfActualData);

    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);

    // RESUMEN FINAL
    console.log('\n' + '='.repeat(80));
    console.log('✅ MIGRACIÓN COMPLETADA EXITOSAMENTE');
    console.log('='.repeat(80));
    console.log(`⏱️  Tiempo total: ${duration}s`);
    console.log(`📚 Total colecciones: ${stats.totalCollections}`);
    console.log(`📄 Total documentos: ${stats.totalDocuments}`);
    console.log('\n📊 Detalle por colección:');

    Object.entries(stats.collections)
      .sort((a, b) => b[1] - a[1])
      .forEach(([name, count]) => {
        console.log(`   • ${name.padEnd(30)} ${count.toString().padStart(5)} docs`);
      });

    if (stats.errors.length > 0) {
      console.log('\n⚠️  Errores encontrados:');
      stats.errors.forEach((error) => console.log(`   • ${error}`));
    }

    console.log('='.repeat(80));

    // Guardar reporte
    const report = {
      timestamp: new Date().toISOString(),
      duration: `${duration}s`,
      statistics: stats,
      source: data.metadata,
    };

    fs.writeFileSync(
      path.join(__dirname, 'migration-report.json'),
      JSON.stringify(report, null, 2)
    );

    console.log('\n📝 Reporte guardado: scripts/migration-report.json\n');
  } catch (error) {
    console.error('\n❌ ERROR FATAL:', error);
    stats.errors.push(error.message);
    throw error;
  } finally {
    process.exit(0);
  }
}

// EJECUTAR
migrateAll().catch((error) => {
  console.error('Error en migración:', error);
  process.exit(1);
});
