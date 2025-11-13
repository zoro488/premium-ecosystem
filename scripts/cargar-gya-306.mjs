#!/usr/bin/env node
/**
 * 🔥 Cargar 306 registros GYA a Firebase
 * Script para cargar gastos y abonos completos
 */
import { initializeApp } from 'firebase/app';
import { collection, doc, getFirestore, writeBatch } from 'firebase/firestore';
import { readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Firebase config
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
};

console.log('\n🔥 Inicializando Firebase...');
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Leer datos
const dataPath = join(__dirname, '../datos_gya_completos_306.json');
const data = JSON.parse(readFileSync(dataPath, 'utf-8'));

console.log(`\n📊 Datos cargados: ${data.gastos_abonos.length} registros`);

/**
 * Convertir fecha DD/MM/YYYY a timestamp
 */
function parseDate(dateStr) {
  const [day, month, year] = dateStr.split('/');
  return new Date(year, month - 1, day);
}

/**
 * Determinar tipo de registro
 */
function getTipoRegistro(origen) {
  const gastosKeywords = ['Gasto', 'gasto'];
  return gastosKeywords.some((keyword) => origen.includes(keyword)) ? 'gasto' : 'abono';
}

/**
 * Cargar registros en batches de 500
 */
async function cargarRegistros() {
  const BATCH_SIZE = 500;
  const registros = data.gastos_abonos;

  console.log(`\n⚡ Iniciando carga de ${registros.length} registros...`);
  console.log('='.repeat(80));

  for (let i = 0; i < registros.length; i += BATCH_SIZE) {
    const batch = writeBatch(db);
    const chunk = registros.slice(i, i + BATCH_SIZE);

    chunk.forEach((registro) => {
      const docRef = doc(collection(db, 'gastosAbonos'));

      const data = {
        ...registro,
        fecha: parseDate(registro.fecha),
        tipo: getTipoRegistro(registro.origen),
        valor: Number(registro.valor) || 0,
        tc: Number(registro.tc) || 0,
        pesos: Number(registro.pesos) || 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      batch.set(docRef, data);
    });

    await batch.commit();
    console.log(`✅ Batch ${Math.floor(i / BATCH_SIZE) + 1}: ${chunk.length} registros cargados`);
  }

  console.log('='.repeat(80));
  console.log(`\n🎉 ¡Completado! ${registros.length} registros cargados exitosamente\n`);
}

// Ejecutar
cargarRegistros()
  .then(() => {
    console.log('✨ Proceso finalizado correctamente');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Error:', error);
    process.exit(1);
  });
