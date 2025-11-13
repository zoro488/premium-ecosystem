import { initializeApp } from 'firebase/app';
import { collection, deleteDoc, doc, getDocs, getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyDN82KFpPJGfzUDgU4wB7rLVJHLCn6DKM8',
  authDomain: 'premium-ecosystem-1760790572.firebaseapp.com',
  projectId: 'premium-ecosystem-1760790572',
  storageBucket: 'premium-ecosystem-1760790572.firebasestorage.app',
  messagingSenderId: '1025668867803',
  appId: '1:1025668867803:web:f8eef72d2ff2b52bd8f394',
  measurementId: 'G-FDH6XLGQR4',
};

// Initialize
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Lista de colecciones incorrectas a eliminar
const COLLECTIONS_TO_DELETE = [
  'almacen_monte_ordenes',
  'almacen_monte_salidas',
  'boveda_monte_ingresos',
  'boveda_monte_gastos',
  'boveda_usa_ingresos',
  'boveda_usa_gastos',
  'azteca_ingresos',
  'azteca_gastos',
  'utilidades_ingresos',
  'utilidades_gastos',
  'flete_sur_ingresos',
  'flete_sur_gastos',
  'leftie_ingresos',
  'leftie_gastos',
  'profit_ingresos', // Si existe
  'profit_gastos', // Si existe
];

async function deleteAllCollections() {
  console.log('🔥 ELIMINANDO DATOS INCORRECTOS DE FIRESTORE\n' + '='.repeat(70));

  let totalDeleted = 0;

  for (const collectionName of COLLECTIONS_TO_DELETE) {
    try {
      const collectionRef = collection(db, collectionName);
      const snapshot = await getDocs(collectionRef);

      if (snapshot.empty) {
        console.log(`📭 ${collectionName}: vacía, omitiendo...`);
        continue;
      }

      console.log(`\n🗑️  Eliminando ${collectionName} (${snapshot.size} documentos)...`);

      const deletePromises = snapshot.docs.map((document) =>
        deleteDoc(doc(db, collectionName, document.id))
      );

      await Promise.all(deletePromises);
      totalDeleted += snapshot.size;

      console.log(`   ✅ ${snapshot.size} documentos eliminados`);
    } catch (error) {
      console.error(`   ❌ Error en ${collectionName}:`, error.message);
    }
  }

  console.log('\n' + '='.repeat(70));
  console.log(`✅ LIMPIEZA COMPLETADA: ${totalDeleted} documentos eliminados`);
  console.log('='.repeat(70) + '\n');

  process.exit(0);
}

// Ejecutar
deleteAllCollections().catch(console.error);
