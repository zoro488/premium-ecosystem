#!/usr/bin/env node
/**
 * Script para verificar datos en Firestore
 * Usa las credenciales del cliente (no requiere serviceAccountKey)
 */
import dotenv from 'dotenv';
import { initializeApp } from 'firebase/app';
import { collection, getDocs, getFirestore, limit, query } from 'firebase/firestore';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cargar variables de entorno
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
  measurementId: process.env.VITE_FIREBASE_MEASUREMENT_ID
};

console.log('\n🔍 VERIFICANDO DATOS EN FIRESTORE...\n');
console.log('📊 Proyecto:', firebaseConfig.projectId);
console.log('━'.repeat(60));

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const collections = [
  'ventas',
  'clientes',
  'distribuidores',
  'almacen',
  'ordenes_compra',
  'bancos',
  'gastos',
  'boveda_monte',
  'boveda_usa',
  'flete_sur',
  'utilidades',
  'bancos_azteca',
  'bancos_leftie',
  'bancos_profit'
];

async function checkCollection(collectionName) {
  try {
    const q = query(collection(db, collectionName), limit(1));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      console.log(`❌ ${collectionName.padEnd(20)} - VACÍA`);
      return { name: collectionName, count: 0, status: 'empty' };
    } else {
      // Contar total (puede ser lento)
      const fullSnapshot = await getDocs(collection(db, collectionName));
      const count = fullSnapshot.size;
      console.log(`✅ ${collectionName.padEnd(20)} - ${count} documentos`);
      return { name: collectionName, count, status: 'ok' };
    }
  } catch (error) {
    console.log(`⚠️  ${collectionName.padEnd(20)} - Error: ${error.message}`);
    return { name: collectionName, count: 0, status: 'error', error: error.message };
  }
}

async function main() {
  const results = [];

  for (const collectionName of collections) {
    const result = await checkCollection(collectionName);
    results.push(result);
  }

  console.log('━'.repeat(60));

  const withData = results.filter(r => r.count > 0);
  const empty = results.filter(r => r.status === 'empty');
  const errors = results.filter(r => r.status === 'error');

  console.log('\n📊 RESUMEN:');
  console.log(`   ✅ Con datos: ${withData.length} colecciones`);
  console.log(`   ❌ Vacías: ${empty.length} colecciones`);
  console.log(`   ⚠️  Errores: ${errors.length} colecciones`);

  if (withData.length > 0) {
    console.log('\n📦 COLECCIONES CON DATOS:');
    withData.forEach(r => {
      console.log(`   • ${r.name}: ${r.count} docs`);
    });
  }

  if (empty.length > 0) {
    console.log('\n❌ COLECCIONES VACÍAS:');
    empty.forEach(r => {
      console.log(`   • ${r.name}`);
    });
  }

  console.log('\n');

  if (withData.length === 0) {
    console.log('🚨 NO HAY DATOS EN FIRESTORE');
    console.log('💡 Necesitas ejecutar: npm run import:csv');
    console.log('📝 Pero primero necesitas serviceAccountKey.json');
    process.exit(1);
  } else {
    console.log('✨ Firestore tiene datos!');
    process.exit(0);
  }
}

main().catch(console.error);
