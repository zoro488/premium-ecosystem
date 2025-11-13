/**
 * ════════════════════════════════════════════════════════════════════════════
 * 🚀 MIGRACIÓN COMPLETA A FIRESTORE - CHRONOS SYSTEM
 * ════════════════════════════════════════════════════════════════════════════
 * Archivo fuente: sistema_completo_todos_datos.json (8000 líneas)
 * 7 BANCOS con TODAS las tablas: ingresos, gastos, cortes
 * ════════════════════════════════════════════════════════════════════════════
 */
import { initializeApp } from 'firebase/app';
import { collection, doc, getFirestore, serverTimestamp, writeBatch } from 'firebase/firestore';
import { readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY || 'AIzaSyDcWc-5t8OwCkqJPq0-MPNH7dZWBLgJpuE',
  authDomain:
    process.env.VITE_FIREBASE_AUTH_DOMAIN || 'premium-ecosystem-1760790572.firebaseapp.com',
  projectId: process.env.VITE_FIREBASE_PROJECT_ID || 'premium-ecosystem-1760790572',
  storageBucket:
    process.env.VITE_FIREBASE_STORAGE_BUCKET || 'premium-ecosystem-1760790572.firebasestorage.app',
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '100411784487',
  appId: process.env.VITE_FIREBASE_APP_ID || '1:100411784487:web:a1b2c3d4e5f6g7h8',
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const log = (banco, tabla, mensaje) => {
  const timestamp = new Date().toISOString().split('T')[1].split('.')[0];
  console.log(`[${timestamp}] [${banco}] [${tabla}] ${mensaje}`);
};

const cleanData = (obj) => {
  const cleaned = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value !== null && value !== undefined && value !== '') {
      cleaned[key] = value;
    }
  }
  return cleaned;
};

const parseNumber = (value) => {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    const parsed = parseFloat(value.replace(/,/g, ''));
    return isNaN(parsed) ? 0 : parsed;
  }
  return 0;
};

async function migratePanel(panelData) {
  const panelName = panelData.panel.toLowerCase().replace(/[^a-z0-9]/g, '_');
  let totalMigrados = 0;

  try {
    // 1. MIGRAR INGRESOS
    if (panelData.ingresos?.registros?.length > 0) {
      const collectionName = `${panelName}_ingresos`;
      log(
        panelName.toUpperCase(),
        'ingresos',
        `Migrando ${panelData.ingresos.registros.length} registros...`
      );

      const batch = writeBatch(db);
      let count = 0;

      for (const registro of panelData.ingresos.registros) {
        const docRef = doc(collection(db, collectionName));
        batch.set(
          docRef,
          cleanData({
            ...registro,
            createdAt: serverTimestamp(),
          })
        );
        count++;
        totalMigrados++;

        if (count >= 500) {
          await batch.commit();
          count = 0;
        }
      }

      if (count > 0) await batch.commit();
      console.log(
        `✅ [${panelName.toUpperCase()}] [ingresos] ${panelData.ingresos.registros.length} registros`
      );
    }

    // 2. MIGRAR GASTOS
    if (panelData.gastos?.registros?.length > 0) {
      const collectionName = `${panelName}_gastos`;
      log(
        panelName.toUpperCase(),
        'gastos',
        `Migrando ${panelData.gastos.registros.length} registros...`
      );

      const batch = writeBatch(db);
      let count = 0;

      for (const registro of panelData.gastos.registros) {
        const docRef = doc(collection(db, collectionName));
        batch.set(
          docRef,
          cleanData({
            ...registro,
            createdAt: serverTimestamp(),
          })
        );
        count++;
        totalMigrados++;

        if (count >= 500) {
          await batch.commit();
          count = 0;
        }
      }

      if (count > 0) await batch.commit();
      console.log(
        `✅ [${panelName.toUpperCase()}] [gastos] ${panelData.gastos.registros.length} registros`
      );
    }

    // 3. MIGRAR CORTES (rfActual.cortes)
    if (panelData.rfActual?.cortes?.length > 0) {
      const collectionName = `${panelName}_cortes`;
      log(
        panelName.toUpperCase(),
        'cortes',
        `Migrando ${panelData.rfActual.cortes.length} registros...`
      );

      const batch = writeBatch(db);
      let count = 0;

      for (const registro of panelData.rfActual.cortes) {
        const docRef = doc(collection(db, collectionName));
        batch.set(
          docRef,
          cleanData({
            ...registro,
            createdAt: serverTimestamp(),
          })
        );
        count++;
        totalMigrados++;

        if (count >= 500) {
          await batch.commit();
          count = 0;
        }
      }

      if (count > 0) await batch.commit();
      console.log(
        `✅ [${panelName.toUpperCase()}] [cortes] ${panelData.rfActual.cortes.length} registros`
      );
    }

    console.log(
      `\n🎉 ${panelName.toUpperCase()} COMPLETADO: ${totalMigrados} registros migrados\n`
    );
    return totalMigrados;
  } catch (error) {
    console.error(`❌ [${panelName.toUpperCase()}] ERROR:`, error);
    throw error;
  }
}

async function migrateAllData() {
  console.log('\n╔════════════════════════════════════════════════════════════════╗');
  console.log('║   MIGRACIÓN COMPLETA A FIRESTORE - CHRONOS FLOWDISTRIBUTOR   ║');
  console.log('╚════════════════════════════════════════════════════════════════╝\n');

  const startTime = Date.now();
  let totalRegistros = 0;

  try {
    const jsonPath = join(__dirname, '..', 'sistema_completo_todos_datos.json');
    console.log(`📂 Leyendo archivo: ${jsonPath}\n`);

    const rawData = readFileSync(jsonPath, 'utf-8');
    const data = JSON.parse(rawData);

    console.log(`✅ JSON cargado exitosamente`);
    console.log(`📊 Total de paneles encontrados: ${data.paneles.length}\n`);
    console.log('━'.repeat(70));
    console.log('\n🚀 INICIANDO MIGRACIÓN...\n');

    // Filtrar Profit (ya existe)
    const panelesToMigrate = data.paneles.filter((p) => p.panel !== 'Profit');

    for (const panel of panelesToMigrate) {
      console.log(`\n${'═'.repeat(70)}`);
      console.log(`⚡ MIGRANDO: ${panel.panel}`);
      console.log('═'.repeat(70));

      const registrosMigrados = await migratePanel(panel);
      totalRegistros += registrosMigrados;

      console.log(`✨ ${panel.panel} finalizado exitosamente\n`);
    }

    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);

    console.log('\n' + '╔' + '═'.repeat(68) + '╗');
    console.log('║' + ' '.repeat(25) + '🎉 MIGRACIÓN COMPLETADA' + ' '.repeat(21) + '║');
    console.log('╚' + '═'.repeat(68) + '╝\n');
    console.log(`📊 ESTADÍSTICAS FINALES:`);
    console.log(`   ├─ Total de bancos migrados: ${panelesToMigrate.length}`);
    console.log(`   ├─ Total de registros: ${totalRegistros}`);
    console.log(`   └─ Tiempo de ejecución: ${duration}s\n`);
    console.log(`✅ Todos los datos han sido migrados exitosamente a Firestore`);
    console.log(`📦 Las colecciones están listas para usarse con listeners en tiempo real\n`);
  } catch (error) {
    console.error('\n❌ ERROR FATAL EN LA MIGRACIÓN:\n');
    console.error(error);
    process.exit(1);
  }
}

migrateAllData()
  .then(() => {
    console.log('\n✅ Script finalizado correctamente\n');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ El script falló con error:\n');
    console.error(error);
    process.exit(1);
  });
