import { initializeApp } from 'firebase/app';
import { collection, doc, getFirestore, writeBatch } from 'firebase/firestore';
import { readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const firebaseConfig = {
  apiKey: 'AIzaSyCR7zKZJAzCEq-jBbfkLJxWaz98zuRCkX4',
  authDomain: 'premium-ecosystem-1760790572.firebaseapp.com',
  projectId: 'premium-ecosystem-1760790572',
  storageBucket: 'premium-ecosystem-1760790572.firebasestorage.app',
  messagingSenderId: '100411784487',
  appId: '1:100411784487:web:ac2713291717869bc83d02',
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function cargarLote2() {
  console.log('🔄 Cargando lote 2 (GYA051-GYA100)...');

  const jsonPath = join(__dirname, '..', 'datos_gya_lote2.json');
  const data = JSON.parse(readFileSync(jsonPath, 'utf-8'));

  const batch = writeBatch(db);
  const gyaCollection = collection(db, 'gya');

  data.gastos_abonos.forEach((item) => {
    const docRef = doc(gyaCollection, item.id);
    batch.set(docRef, item);
  });

  await batch.commit();

  console.log(`✅ Lote 2 completado: ${data.gastos_abonos.length} registros cargados`);
  console.log(`📊 Progreso: 100/306 (32.7%)`);
}

cargarLote2()
  .then(() => {
    console.log('✨ Proceso completado exitosamente');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
