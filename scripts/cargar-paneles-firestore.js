#!/usr/bin/env node
/**
 * 🔥 CARGA DE PANELES A FIRESTORE
 * Sube todos los paneles del sistema FlowDistributor
 */
import { initializeApp } from 'firebase/app';
import { doc, getFirestore, setDoc, writeBatch } from 'firebase/firestore';
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

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Leer datos
const dataPath = join(__dirname, '../datos_paneles_completos.json');
const panelData = JSON.parse(readFileSync(dataPath, 'utf-8'));

console.log('\n🚀 CARGA DE PANELES A FIRESTORE');
console.log('='.repeat(80));

async function subirPanelDistribuidores() {
  console.log('\n📦 PANEL: DISTRIBUIDORES');

  // Órdenes de Compra
  const ocBatch = writeBatch(db);
  panelData.distribuidores.ordenesCompra.forEach((oc) => {
    const docRef = doc(db, 'ordenesCompra', oc.id);
    ocBatch.set(docRef, {
      ...oc,
      panel: 'distribuidores',
      metadata: { cargadoEn: new Date().toISOString() },
    });
  });
  await ocBatch.commit();
  console.log(`   ✅ ${panelData.distribuidores.ordenesCompra.length} órdenes de compra`);

  // Resumen Distribuidores
  const distBatch = writeBatch(db);
  panelData.distribuidores.resumen.forEach((dist) => {
    const docRef = doc(db, 'distribuidores', `dist_${dist.nombre}`);
    distBatch.set(docRef, {
      nombre: dist.nombre,
      costoTotal: dist.costoTotal,
      abonos: dist.abonos,
      pendiente: dist.pendiente,
      panel: 'distribuidores',
      metadata: { cargadoEn: new Date().toISOString() },
    });
  });
  await distBatch.commit();
  console.log(`   ✅ ${panelData.distribuidores.resumen.length} distribuidores`);
}

async function subirPanelDashboard() {
  console.log('\n📊 PANEL: DASHBOARD');

  const docRef = doc(db, 'dashboard', 'rf-actual');
  await setDoc(docRef, {
    rfTotal: panelData.dashboard.rfActual,
    paneles: panelData.dashboard.paneles,
    ultimaActualizacion: new Date().toISOString(),
    metadata: { cargadoEn: new Date().toISOString() },
  });
  console.log(`   ✅ Dashboard con RF: $${panelData.dashboard.rfActual.toLocaleString()}`);
}

async function subirPanelAlmacen() {
  console.log('\n🏪 PANEL: ALMACÉN');

  const docRef = doc(db, 'almacen', 'almacen-monte');
  await setDoc(docRef, {
    ...panelData.almacen,
    panel: 'almacen',
    metadata: { cargadoEn: new Date().toISOString() },
  });
  console.log(
    `   ✅ Almacén - Stock: ${panelData.almacen.stockActual} - RF: $${panelData.almacen.rfActual}`
  );
}

async function subirPanelBovedaMonte() {
  console.log('\n🏦 PANEL: BÓVEDA MONTE');

  const docRef = doc(db, 'bancos', 'boveda-monte');
  await setDoc(docRef, {
    nombre: 'Bóveda Monte',
    ...panelData.bovedaMonte,
    panel: 'bovedaMonte',
    tipo: 'banco',
    metadata: { cargadoEn: new Date().toISOString() },
  });
  console.log(`   ✅ Bóveda Monte - RF: $${panelData.bovedaMonte.rfActual.toLocaleString()}`);
}

async function subirPanelBovedaUsa() {
  console.log('\n🏦 PANEL: BÓVEDA USA');

  const docRef = doc(db, 'bancos', 'boveda-usa');
  await setDoc(docRef, {
    nombre: 'Bóveda USA',
    ...panelData.bovedaUsa,
    panel: 'bovedaUsa',
    tipo: 'banco',
    metadata: { cargadoEn: new Date().toISOString() },
  });
  console.log(`   ✅ Bóveda USA - RF: $${panelData.bovedaUsa.rfActual.toLocaleString()}`);
}

async function subirPanelAzteca() {
  console.log('\n🏦 PANEL: AZTECA');

  const docRef = doc(db, 'bancos', 'azteca');
  await setDoc(docRef, {
    nombre: 'Azteca',
    ...panelData.azteca,
    panel: 'azteca',
    tipo: 'banco',
    metadata: { cargadoEn: new Date().toISOString() },
  });
  console.log(`   ✅ Azteca - RF: $${panelData.azteca.rfActual.toLocaleString()}`);
}

async function subirPanelUtilidades() {
  console.log('\n💰 PANEL: UTILIDADES');

  const docRef = doc(db, 'bancos', 'utilidades');
  await setDoc(docRef, {
    nombre: 'Utilidades',
    ...panelData.utilidades,
    panel: 'utilidades',
    tipo: 'banco',
    metadata: { cargadoEn: new Date().toISOString() },
  });
  console.log(`   ✅ Utilidades - RF: $${panelData.utilidades.rfActual.toLocaleString()}`);
}

async function subirPanelFleteSur() {
  console.log('\n🚚 PANEL: FLETE SUR');

  const docRef = doc(db, 'bancos', 'flete-sur');
  await setDoc(docRef, {
    nombre: 'Flete Sur',
    ...panelData.fleteSur,
    panel: 'fleteSur',
    tipo: 'banco',
    metadata: { cargadoEn: new Date().toISOString() },
  });
  console.log(`   ✅ Flete Sur - RF: $${panelData.fleteSur.rfActual.toLocaleString()}`);
}

async function subirPanelLeftie() {
  console.log('\n🏦 PANEL: LEFTIE');

  const docRef = doc(db, 'bancos', 'leftie');
  await setDoc(docRef, {
    nombre: 'Leftie',
    ...panelData.leftie,
    panel: 'leftie',
    tipo: 'banco',
    metadata: { cargadoEn: new Date().toISOString() },
  });
  console.log(`   ✅ Leftie - RF: $${panelData.leftie.rfActual.toLocaleString()}`);
}

async function subirPanelProfit() {
  console.log('\n💎 PANEL: PROFIT');

  const docRef = doc(db, 'bancos', 'profit');
  await setDoc(docRef, {
    nombre: 'Profit',
    ...panelData.profit,
    panel: 'profit',
    tipo: 'banco',
    metadata: { cargadoEn: new Date().toISOString() },
  });
  console.log(`   ✅ Profit - RF: $${panelData.profit.rfActual.toLocaleString()}`);
}

async function subirPanelClientes() {
  console.log('\n👥 PANEL: CLIENTES');

  const batch = writeBatch(db);
  panelData.clientes.forEach((cliente) => {
    const docRef = doc(db, 'clientes', cliente.id);
    batch.set(docRef, {
      ...cliente,
      panel: 'clientes',
      metadata: { cargadoEn: new Date().toISOString() },
    });
  });
  await batch.commit();
  console.log(`   ✅ ${panelData.clientes.length} clientes`);
}

async function main() {
  try {
    await subirPanelDistribuidores();
    await subirPanelDashboard();
    await subirPanelAlmacen();
    await subirPanelBovedaMonte();
    await subirPanelBovedaUsa();
    await subirPanelAzteca();
    await subirPanelUtilidades();
    await subirPanelFleteSur();
    await subirPanelLeftie();
    await subirPanelProfit();
    await subirPanelClientes();

    console.log('\n' + '='.repeat(80));
    console.log('🎉 ¡TODOS LOS PANELES SUBIDOS EXITOSAMENTE!');
    console.log('='.repeat(80));
    console.log('\n📊 RESUMEN:');
    console.log(`   ✅ Órdenes de Compra: ${panelData.distribuidores.ordenesCompra.length}`);
    console.log(`   ✅ Distribuidores: ${panelData.distribuidores.resumen.length}`);
    console.log(`   ✅ Clientes: ${panelData.clientes.length}`);
    console.log(`   ✅ Paneles (Bancos): 8`);
    console.log(`   ✅ Dashboard: 1`);
    console.log(`   ✅ Almacén: 1`);
    console.log(`\n   💰 RF TOTAL SISTEMA: $${panelData.dashboard.rfActual.toLocaleString()}`);
    console.log(
      '\n💡 Ahora puedes abrir FlowDistributor y ver todos los paneles con datos reales\n'
    );

    process.exit(0);
  } catch (error) {
    console.error('\n❌ ERROR:', error);
    process.exit(1);
  }
}

main();
