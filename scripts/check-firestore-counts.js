/**
 * Consultar Firestore y contar registros reales
 */
import { initializeApp } from 'firebase/app';
import { collection, getDocs, getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyDo7cXp9-iODHW5cxlM9UL32qz2z_L8krc',
  authDomain: 'premium-ecosystem-1760790572.firebaseapp.com',
  projectId: 'premium-ecosystem-1760790572',
  storageBucket: 'premium-ecosystem-1760790572.appspot.com',
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

console.log('\n🔥 VERIFICANDO DATOS EN FIRESTORE\n');
console.log('═'.repeat(80));

const collections = [
  'clientes',
  'distribuidores',
  'ordenesCompra',
  'ventas',
  'capitales',
  'gastosAbonos',
  'inventario',
  'transaccionesBoveda',
  'transaccionesBanco',
];

async function countCollection(collectionName) {
  try {
    const snapshot = await getDocs(collection(db, collectionName));
    return snapshot.size;
  } catch (error) {
    console.error(`❌ Error en ${collectionName}:`, error.message);
    return 0;
  }
}

async function main() {
  let total = 0;

  for (const collName of collections) {
    const count = await countCollection(collName);
    total += count;
    console.log(`${collName.padEnd(25)} → ${count.toString().padStart(4)} documentos`);
  }

  console.log('═'.repeat(80));
  console.log(`${'TOTAL'.padEnd(25)} → ${total.toString().padStart(4)} documentos`);
  console.log();
}

main().catch(console.error);
