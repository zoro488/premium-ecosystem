/**
 * Script rápido para verificar datos en Firestore
 */
import { initializeApp } from 'firebase/app';
import { collection, getDocs, getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyCR7zKZJAzCEq-jBbfkLJxWaz98zuRCkX4',
  authDomain: 'premium-ecosystem-1760790572.firebaseapp.com',
  projectId: 'premium-ecosystem-1760790572',
  storageBucket: 'premium-ecosystem-1760790572.appspot.com',
  messagingSenderId: '1029840619477',
  appId: '1:1029840619477:web:a7e5ad6f3536e0c3b516f8',
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function verifyData() {
  console.log('🔍 Verificando datos en Firestore...\n');

  const collections = [
    'clientes',
    'ventas',
    'productos',
    'distribuidores',
    'bancos',
    'gastos',
    'compras',
    'almacen',
  ];

  for (const collectionName of collections) {
    try {
      const snapshot = await getDocs(collection(db, collectionName));
      const count = snapshot.size;
      console.log(`✅ ${collectionName.padEnd(20)} → ${count} documentos`);

      if (count > 0 && count <= 3) {
        // Mostrar algunos IDs de ejemplo
        const ids = snapshot.docs.slice(0, 3).map((doc) => doc.id);
        console.log(`   📄 Ejemplos: ${ids.join(', ')}`);
      }
    } catch (error) {
      console.log(`❌ ${collectionName.padEnd(20)} → Error: ${error.message}`);
    }
  }

  console.log('\n✨ Verificación completada');
  process.exit(0);
}

verifyData().catch((error) => {
  console.error('❌ Error en la verificación:', error);
  process.exit(1);
});
