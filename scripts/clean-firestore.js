/**
 * 🧹 LIMPIAR FIRESTORE - Eliminar colecciones antiguas
 * ====================================================
 * Script para eliminar colecciones mal estructuradas antes de la migración V2
 *
 * EJECUCIÓN:
 * node scripts/clean-firestore.js
 */
import { initializeApp } from 'firebase/app';
import { collection, getDocs, getFirestore, writeBatch } from 'firebase/firestore';

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

async function deleteCollection(collectionName) {
  const colRef = collection(db, collectionName);
  const snapshot = await getDocs(colRef);

  if (snapshot.empty) {
    console.log(`  ⚠️  ${collectionName}: Ya está vacía`);
    return 0;
  }

  const batchSize = 500;
  let deletedCount = 0;
  let batch = writeBatch(db);
  let count = 0;

  for (const docSnapshot of snapshot.docs) {
    batch.delete(docSnapshot.ref);
    count++;
    deletedCount++;

    if (count === batchSize) {
      await batch.commit();
      batch = writeBatch(db);
      count = 0;
    }
  }

  if (count > 0) {
    await batch.commit();
  }

  console.log(`  ✅ ${collectionName}: ${deletedCount} documentos eliminados`);
  return deletedCount;
}

async function cleanFirestore() {
  try {
    console.log('\n🧹 ============================================');
    console.log('   LIMPIANDO FIRESTORE');
    console.log('============================================\n');

    const collectionsToDelete = ['ingresos', 'gastos', 'cortes', 'almacen_salidas', 'sistema'];

    let totalDeleted = 0;

    for (const collectionName of collectionsToDelete) {
      const deleted = await deleteCollection(collectionName);
      totalDeleted += deleted;
    }

    console.log('\n✅ ============================================');
    console.log(`   LIMPIEZA COMPLETADA`);
    console.log(`   ${totalDeleted} documentos eliminados`);
    console.log('============================================\n');
    console.log('🔥 Firestore listo para migración V2\n');
  } catch (error) {
    console.error('\n❌ ERROR:', error);
    process.exit(1);
  }
}

cleanFirestore()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error fatal:', error);
    process.exit(1);
  });
