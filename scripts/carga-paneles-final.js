#!/usr/bin/env node
/**
 * 🔥 CARGA CORRECTA DE PANELES A FIRESTORE
 * Estructura correcta: distribuidores, dashboard, almacen, bovedaMonte, bovedaUsa, azteca, etc.
 */
import { initializeApp } from 'firebase/app';
import { doc, getFirestore, setDoc } from 'firebase/firestore';
import { readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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

const dataPath = join(__dirname, '../datos_paneles_limpios.json');
const data = JSON.parse(readFileSync(dataPath, 'utf-8'));

console.log('\n🔥 CARGA CORRECTA DE PANELES');
console.log('='.repeat(80));
console.log('📊 Estructura del JSON:');
console.log(`   - Órdenes de Compra: ${data.distribuidores?.ordenesCompra?.length || 0}`);
console.log(`   - Distribuidores: ${data.distribuidores?.resumen?.length || 0}`);
console.log(`   - Dashboard: ${data.dashboard ? '✅' : '❌'}`);
console.log(`   - Almacén: ${data.almacen ? '✅' : '❌'}`);
console.log(`   - Bóveda Monte: ${data.bovedaMonte ? '✅' : '❌'}`);
console.log(`   - Bóveda USA: ${data.bovedaUsa ? '✅' : '❌'}`);
console.log(`   - Azteca: ${data.azteca ? '✅' : '❌'}`);
console.log(`   - Utilidades: ${data.utilidades ? '✅' : '❌'}`);
console.log(`   - Flete Sur: ${data.fleteSur ? '✅' : '❌'}`);
console.log(`   - Leftie: ${data.leftie ? '✅' : '❌'}`);
console.log(`   - Profit: ${data.profit ? '✅' : '❌'}`);
console.log(`   - Clientes: ${data.clientes?.length || 0}`);
console.log('='.repeat(80) + '\n');

let exitos = 0;
let errores = 0;

async function subir(coleccion, id, datos, descripcion) {
  try {
    await setDoc(doc(db, coleccion, id), {
      ...datos,
      _timestamp: new Date().toISOString(),
    });
    console.log(`✅ ${descripcion}`);
    exitos++;
  } catch (error) {
    console.error(`❌ ${descripcion}: ${error.code || error.message}`);
    errores++;
  }
}

async function main() {
  // 1. ÓRDENES DE COMPRA
  console.log('📦 Órdenes de Compra:');
  for (const oc of data.distribuidores.ordenesCompra) {
    await subir('ordenes_compra', oc.id, oc, `  ${oc.id} - ${oc.origen}`);
  }

  // 2. DISTRIBUIDORES
  console.log('\n👥 Distribuidores:');
  for (const dist of data.distribuidores.resumen) {
    const id = dist.distribuidor.replace(/[^\w-]/g, '_').toLowerCase();
    await subir('distribuidores', id, dist, `  ${dist.distribuidor}`);
  }

  // 3. DASHBOARD
  console.log('\n📊 Dashboard:');
  await subir('dashboard', 'global', data.dashboard, '  Dashboard Global');

  // 4. ALMACÉN
  console.log('\n📦 Almacén:');
  await subir('almacen_monte', 'inventario', data.almacen, '  Almacén Monte');

  // 5. BÓVEDA MONTE
  console.log('\n🏦 Bóveda Monte:');
  await subir('boveda_monte', 'cuenta', data.bovedaMonte, '  Bóveda Monte');

  // 6. BÓVEDA USA
  console.log('\n🏦 Bóveda USA:');
  await subir('boveda_usa', 'cuenta', data.bovedaUsa, '  Bóveda USA');

  // 7. AZTECA
  console.log('\n🏦 Azteca:');
  await subir('azteca', 'cuenta', data.azteca, '  Azteca');

  // 8. UTILIDADES
  console.log('\n🏦 Utilidades:');
  await subir('utilidades', 'cuenta', data.utilidades, '  Utilidades');

  // 9. FLETE SUR
  console.log('\n🏦 Flete Sur:');
  await subir('fleteSur', 'cuenta', data.fleteSur, '  Flete Sur');

  // 10. LEFTIE
  console.log('\n🏦 Leftie:');
  await subir('leftie', 'cuenta', data.leftie, '  Leftie');

  // 11. PROFIT
  console.log('\n🏦 Profit:');
  await subir('profit', 'cuenta', data.profit, '  Profit');

  // 12. CLIENTES
  console.log('\n👥 Clientes:');
  for (const cliente of data.clientes) {
    await subir('clientes', cliente.id, cliente, `  ${cliente.nombre}`);
  }

  // RESUMEN
  console.log('\n' + '='.repeat(80));
  console.log('📊 RESUMEN FINAL');
  console.log('='.repeat(80));
  console.log(`✅ Exitosos: ${exitos}`);
  console.log(`❌ Fallidos: ${errores}`);
  console.log(`📊 Total: ${exitos + errores}`);
  console.log(`📈 Éxito: ${((exitos / (exitos + errores)) * 100).toFixed(1)}%`);
  console.log('='.repeat(80));

  if (errores === 0) {
    console.log('\n🎉 ¡TODOS LOS PANELES CARGADOS EXITOSAMENTE!\n');
  } else {
    console.log(`\n⚠️  ${errores} errores encontrados\n`);
  }

  process.exit(errores > 0 ? 1 : 0);
}

main().catch((error) => {
  console.error('\n❌ ERROR FATAL:', error);
  process.exit(1);
});
