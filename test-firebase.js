// Script de prueba para verificar Firebase
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCR7zKZJAzCEq-jBbfkLJxWaz98zuRCkX4",
  authDomain: "premium-ecosystem-1760790572.firebaseapp.com",
  projectId: "premium-ecosystem-1760790572",
  storageBucket: "premium-ecosystem-1760790572.firebasestorage.app",
  messagingSenderId: "100411784487",
  appId: "1:100411784487:web:ac2713291717869bc83d02"
};

console.log('🔥 Inicializando Firebase...');
const app = initializeApp(firebaseConfig);

console.log('✅ Firebase inicializado correctamente');

const db = getFirestore(app);
console.log('✅ Firestore inicializado');

const auth = getAuth(app);
console.log('✅ Authentication inicializado');

// Intentar crear un documento de prueba
try {
  console.log('\n📝 Intentando crear documento de prueba en Firestore...');

  const docRef = await addDoc(collection(db, 'test'), {
    message: 'Prueba de Firebase',
    timestamp: new Date().toISOString(),
    source: 'test-firebase.js'
  });

  console.log('✅ Documento creado con ID:', docRef.id);
  console.log('\n🎉 FIREBASE ESTÁ FUNCIONANDO CORRECTAMENTE!');

} catch (error) {
  console.error('\n❌ Error al crear documento:', error.code);
  console.error('Mensaje:', error.message);

  if (error.code === 'permission-denied') {
    console.log('\n⚠️ Necesitas activar Firestore en modo de prueba:');
    console.log('1. Ve a: https://console.firebase.google.com/project/premium-ecosystem-1760790572/firestore');
    console.log('2. Click en "Crear base de datos"');
    console.log('3. Selecciona "Iniciar en modo de prueba"');
    console.log('4. Ubicación: us-central1');
    console.log('5. Click en "Habilitar"');
  }
}

process.exit(0);
