#!/usr/bin/env node
/**
 * 🔥 CARGA MASIVA DE PANELES A FIRESTORE
 * Versión con inicialización completa de Firebase
 */
import { initializeApp } from 'firebase/app';
import { collection, doc, getDocs, getFirestore, setDoc } from 'firebase/firestore';
import { readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Firebase config desde .env
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
};

console.log('\n🔥 INICIALIZANDO FIREBASE...');
console.log(`📦 Proyecto: ${firebaseConfig.projectId}`);

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Verificar conexión a Firestore
async function verificarConexion() {
  try {
    console.log('🔍 Verificando conexión a Firestore...');
    const testCol = collection(db, 'dashboard');
    await getDocs(testCol);
    console.log('✅ Conexión exitosa a Firestore\n');
    return true;
  } catch (error) {
    console.error('❌ Error de conexión:', error.message);
    return false;
  }
}

// Leer datos (versión limpia sin emojis)
const dataPath = join(__dirname, '../datos_paneles_limpios.json');
const panelData = JSON.parse(readFileSync(dataPath, 'utf-8'));

console.log('='.repeat(80));
console.log('🚀 CARGA MASIVA DE PANELES');
console.log('='.repeat(80));

/**
 * Función para subir un documento con manejo robusto de errores
 */
async function subirDoc(col, id, data, descripcion) {
  try {
    const docRef = doc(db, col, id);
    await setDoc(docRef, {
      ...data,
      _cargado: new Date().toISOString(),
      _version: '1.0',
    });
    console.log(`   ✅ ${descripcion}`);
    return true;
  } catch (error) {
    console.error(`   ❌ ${descripcion}: ${error.code || error.message}`);
    return false;
  }
}

async function main() {
  // Verificar conexión primero
  const conectado = await verificarConexion();
  if (!conectado) {
    console.error('\n❌ No se pudo conectar a Firestore. Verifica tu configuración.');
    process.exit(1);
  }

  let exitos = 0;
  let errores = 0;

  // ========================================
  // 1. DISTRIBUIDORES
  // ========================================
  console.log('\n📦 1. DISTRIBUIDORES');
  console.log('-'.repeat(80));

  // Órdenes de Compra
  console.log('  📋 Órdenes de Compra:');
  for (const oc of panelData.distribuidores.ordenesCompra) {
    const ok = await subirDoc('ordenesCompra', oc.id, oc, `OC-${oc.id}`);
    ok ? exitos++ : errores++;
  }

  // Resumen Distribuidores
  console.log('\n  👥 Distribuidores:');
  for (const dist of panelData.distribuidores.resumen) {
    const id = dist.distribuidor.replace(/[^\w-]/g, '_');
    const ok = await subirDoc('distribuidores', id, dist, dist.distribuidor);
    ok ? exitos++ : errores++;
  }

  // ========================================
  // 2. DASHBOARD
  // ========================================
  console.log('\n📊 2. DASHBOARD');
  console.log('-'.repeat(80));
  const okDash = await subirDoc('dashboard', 'global', panelData.dashboard, 'Dashboard Global');
  okDash ? exitos++ : errores++;

  // ========================================
  // 3. ALMACÉN
  // ========================================
  console.log('\n📦 3. ALMACÉN');
  console.log('-'.repeat(80));
  const okAlm = await subirDoc('almacen', 'inventario', panelData.almacen, 'Almacén Monte');
  okAlm ? exitos++ : errores++;

  // ========================================
  // 4-11. BANCOS
  // ========================================
  console.log('\n🏦 4-11. BANCOS');
  console.log('-'.repeat(80));

  const bancos = [
    { key: 'bovedaMonte', nombre: 'Bóveda Monte', id: 'boveda_monte' },
    { key: 'bovedaUsa', nombre: 'Bóveda USA', id: 'boveda_usa' },
    { key: 'azteca', nombre: 'Azteca', id: 'azteca' },
    { key: 'utilidades', nombre: 'Utilidades', id: 'utilidades' },
    { key: 'fleteSur', nombre: 'Flete Sur', id: 'flete_sur' },
    { key: 'leftie', nombre: 'Leftie', id: 'leftie' },
    { key: 'profit', nombre: 'Profit', id: 'profit' },
  ];

  for (const banco of bancos) {
    if (panelData[banco.key]) {
      const ok = await subirDoc('bancos', banco.id, {
        ...panelData[banco.key],
        nombre: banco.nombre,
      }, banco.nombre);
      ok ? exitos++ : errores++;
    }
  }

  // ========================================
  // 12. CLIENTES
  // ========================================
  console.log('\n👥 12. CLIENTES');
  console.log('-'.repeat(80));

  for (const cliente of panelData.clientes) {
    const ok = await subirDoc('clientes', cliente.id, cliente, `Cliente ${cliente.nombre}`);
    ok ? exitos++ : errores++;
  }

  // ========================================
  // RESUMEN FINAL
  // ========================================
  console.log('\n' + '='.repeat(80));
  console.log('📊 RESUMEN DE CARGA');
  console.log('='.repeat(80));
  console.log(`✅ Documentos exitosos: ${exitos}`);
  console.log(`❌ Documentos fallidos: ${errores}`);
  console.log(`📊 Total procesados: ${exitos + errores}`);
  console.log(`📈 Tasa de éxito: ${((exitos / (exitos + errores)) * 100).toFixed(1)}%`);
  console.log('='.repeat(80));

  if (errores === 0) {
    console.log('\n🎉 ¡CARGA COMPLETADA EXITOSAMENTE!');
    console.log('✨ Todos los paneles fueron cargados a Firestore\n');
  } else {
    console.log(`\n⚠️  Carga completada con ${errores} errores`);
    console.log('🔍 Revisa los mensajes de error arriba\n');
  }

  process.exit(errores > 0 ? 1 : 0);
}

// Ejecutar
main().catch((error) => {
  console.error('\n❌ ERROR FATAL:', error);
  console.error(error.stack);
  process.exit(1);
});
