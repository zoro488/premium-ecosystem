/**
 * Verificar cómo se guardaron los paneles en Firestore
 */
import { initializeApp } from 'firebase/app';
import { collection, getDocs, getFirestore, limit, query } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyDo7cXp9-iODHW5cxlM9UL32qz2z_L8krc',
  authDomain: 'premium-ecosystem-1760790572.firebaseapp.com',
  projectId: 'premium-ecosystem-1760790572',
  storageBucket: 'premium-ecosystem-1760790572.appspot.com',
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function checkPanels() {
  console.log('\n🔍 REVISANDO CAMPO "panel" EN FIRESTORE\n');
  console.log('═'.repeat(80));

  // Bóvedas
  console.log('\n💰 TRANSACCIONES BÓVEDA (primeras 10):');
  const bovedaQ = query(collection(db, 'transaccionesBoveda'), limit(10));
  const bovedaSnap = await getDocs(bovedaQ);

  const panelesBoveda = new Set();
  bovedaSnap.forEach((doc, index) => {
    const data = doc.data();
    panelesBoveda.add(data.panel);
    if (index < 3) {
      console.log(
        `  ${index + 1}. panel: "${data.panel}" | fecha: ${data.fecha} | tipo: ${data.tipo}`
      );
    }
  });

  console.log(`\n  📊 Paneles únicos encontrados: ${Array.from(panelesBoveda).join(', ')}`);
  console.log(`  📊 Total transacciones bóveda: ${bovedaSnap.size}`);

  // Contar por cada panel
  const allBoveda = await getDocs(collection(db, 'transaccionesBoveda'));
  const conteo = {};
  allBoveda.forEach((doc) => {
    const panel = doc.data().panel;
    conteo[panel] = (conteo[panel] || 0) + 1;
  });

  console.log('\n  📊 Distribución por panel:');
  Object.entries(conteo).forEach(([panel, count]) => {
    console.log(`     • ${panel}: ${count}`);
  });

  // Bancos
  console.log('\n\n🏦 TRANSACCIONES BANCO (primeras 10):');
  const bancoQ = query(collection(db, 'transaccionesBanco'), limit(10));
  const bancoSnap = await getDocs(bancoQ);

  const panelesBanco = new Set();
  bancoSnap.forEach((doc, index) => {
    const data = doc.data();
    panelesBanco.add(data.panel);
    if (index < 3) {
      console.log(
        `  ${index + 1}. panel: "${data.panel}" | fecha: ${data.fecha} | tipo: ${data.tipo}`
      );
    }
  });

  console.log(`\n  📊 Paneles únicos encontrados: ${Array.from(panelesBanco).join(', ')}`);
  console.log(`  📊 Total transacciones banco: ${bancoSnap.size}`);

  // Contar por cada panel
  const allBanco = await getDocs(collection(db, 'transaccionesBanco'));
  const conteoBanco = {};
  allBanco.forEach((doc) => {
    const panel = doc.data().panel;
    conteoBanco[panel] = (conteoBanco[panel] || 0) + 1;
  });

  console.log('\n  📊 Distribución por panel:');
  Object.entries(conteoBanco).forEach(([panel, count]) => {
    console.log(`     • ${panel}: ${count}`);
  });

  console.log('\n' + '═'.repeat(80) + '\n');
}

checkPanels().catch(console.error);
