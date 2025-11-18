/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 🏦 COMPLETAR BANCOS FALTANTES EN FIRESTORE
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

const bancosFaltantes = [
  {
    id: 'boveda-monte',
    nombre: 'Bóveda Monte',
    tipo: 'variable',
    capitalActual: 0,
    historicoIngresos: 0,
    historicoEgresos: 0,
    historicoTransferencias: 0,
    descripcion: 'Banco principal de bóveda Monte para gestión de compras',
    activo: true,
  },
  {
    id: 'boveda-usa',
    nombre: 'Bóveda USA',
    tipo: 'variable',
    capitalActual: 128005,
    historicoIngresos: 0,
    historicoEgresos: 0,
    historicoTransferencias: 0,
    descripcion: 'Bóveda USA para operaciones internacionales',
    activo: true,
  },
  {
    id: 'almacen-monte',
    nombre: 'Almacén Monte',
    tipo: 'stock',
    capitalActual: 17, // unidades físicas
    historicoIngresos: 0,
    historicoEgresos: 0,
    historicoTransferencias: 0,
    descripcion: 'Stock físico en almacén Monte (conteo en unidades)',
    activo: true,
  },
];

async function completarBancos() {
  console.log('\n🏦 Completando bancos faltantes en Firestore...\n');

  for (const bancoData of bancosFaltantes) {
    try {
      await setDoc(doc(db, 'bancos', bancoData.id), {
        ...bancoData,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
      console.log(`✅ ${bancoData.nombre} (${bancoData.id}) - Capital: ${bancoData.capitalActual}`);
    } catch (error) {
      console.error(`❌ Error al crear ${bancoData.id}:`, error.message);
    }
  }

  console.log('\n✅ Bancos completados. Ahora hay 8 bancos totales\n');
  process.exit(0);
}

completarBancos();
