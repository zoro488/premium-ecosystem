/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 🏦 AGREGAR BANCO "FLETES" FALTANTE
 * ═══════════════════════════════════════════════════════════════════════════
 */
import { initializeApp } from 'firebase/app';
import { Timestamp, doc, getFirestore, setDoc } from 'firebase/firestore';

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

async function agregarBancoFletes() {
  console.log('\n🏦 Agregando banco "fletes" a Firestore...\n');

  const bancoData = {
    id: 'fletes',
    nombre: 'Fletes Sur',
    tipo: 'variable', // Capital variable
    capitalActual: 185792, // Del RF Actual
    historicoIngresos: 0,
    historicoEgresos: 0,
    historicoTransferencias: 0,
    descripcion: 'Banco para gestión de costos de flete',
    activo: true,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };

  try {
    await setDoc(doc(db, 'bancos', 'fletes'), bancoData);
    console.log('✅ Banco "fletes" agregado exitosamente');
    console.log(`   Capital Actual: $${bancoData.capitalActual.toLocaleString()}`);
    console.log('\n✅ Ahora hay 8 bancos en total');
  } catch (error) {
    console.error('❌ Error:', error);
  }

  process.exit(0);
}

agregarBancoFletes();
