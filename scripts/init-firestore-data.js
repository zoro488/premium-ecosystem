/**
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║           SCRIPT DE INICIALIZACIÓN DE DATOS EN FIRESTORE                  ║
 * ║  Carga datos iniciales en Firebase Firestore para el sistema Chronos      ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */
import { initializeApp } from 'firebase/app';
import { collection, doc, getDocs, getFirestore, setDoc } from 'firebase/firestore';

// Configuración de Firebase
const firebaseConfig = {
  apiKey: 'AIzaSyDEyOQHEU7b3L2XYMlk_demo_key',
  authDomain: 'premium-ecosystem-1760790572.firebaseapp.com',
  projectId: 'premium-ecosystem-1760790572',
  storageBucket: 'premium-ecosystem-1760790572.appspot.com',
  messagingSenderId: '123456789012',
  appId: '1:123456789012:web:abcdef123456',
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ============================================
// DATOS INICIALES
// ============================================

const BANCOS_INICIALES = [
  {
    id: 'boveda-monte',
    nombre: 'Bóveda Monte',
    tipo: 'operativo',
    capitalActual: 500000,
    historicoIngresos: 0,
    historicoEgresos: 0,
    activo: true,
  },
  {
    id: 'boveda-usa',
    nombre: 'Bóveda USA',
    tipo: 'operativo',
    capitalActual: 250000,
    historicoIngresos: 0,
    historicoEgresos: 0,
    activo: true,
  },
  {
    id: 'fletes',
    nombre: 'Fletes',
    tipo: 'operativo',
    capitalActual: 100000,
    historicoIngresos: 0,
    historicoEgresos: 0,
    activo: true,
  },
  {
    id: 'utilidades',
    nombre: 'Utilidades',
    tipo: 'reserva',
    capitalActual: 750000,
    historicoIngresos: 0,
    historicoEgresos: 0,
    activo: true,
  },
  {
    id: 'azteca',
    nombre: 'Banco Azteca',
    tipo: 'bancario',
    capitalActual: 300000,
    historicoIngresos: 0,
    historicoEgresos: 0,
    activo: true,
  },
  {
    id: 'leftie',
    nombre: 'Banco Leftie',
    tipo: 'bancario',
    capitalActual: 200000,
    historicoIngresos: 0,
    historicoEgresos: 0,
    activo: true,
  },
  {
    id: 'profit',
    nombre: 'Banco Profit',
    tipo: 'reserva',
    capitalActual: 450000,
    historicoIngresos: 0,
    historicoEgresos: 0,
    activo: true,
  },
];

const CLIENTES_DEMO = [
  {
    id: 'CLI-001',
    nombre: 'Bódega M-P',
    tipo: 'mayorista',
    contacto: 'Juan Pérez',
    telefono: '+52 612 123 4567',
    email: 'bodega.mp@example.com',
    zona: 'La Paz Centro',
    deudaTotal: 0,
    abonosTotal: 0,
    saldoPendiente: 0,
    activo: true,
    pedidos: 0,
    totalVentas: 0,
  },
  {
    id: 'CLI-002',
    nombre: 'Valle Comercial',
    tipo: 'mayorista',
    contacto: 'María González',
    telefono: '+52 612 987 6543',
    email: 'valle.comercial@example.com',
    zona: 'La Paz Norte',
    deudaTotal: 0,
    abonosTotal: 0,
    saldoPendiente: 0,
    activo: true,
    pedidos: 0,
    totalVentas: 0,
  },
  {
    id: 'CLI-003',
    nombre: 'Tienda El Centro',
    tipo: 'minorista',
    contacto: 'Carlos Ramírez',
    telefono: '+52 612 555 1234',
    email: 'el.centro@example.com',
    zona: 'Centro Histórico',
    deudaTotal: 0,
    abonosTotal: 0,
    saldoPendiente: 0,
    activo: true,
    pedidos: 0,
    totalVentas: 0,
  },
];

const DISTRIBUIDORES_DEMO = [
  {
    id: 'DIST-001',
    nombre: 'Distribuidora Del Norte',
    contacto: 'Roberto Silva',
    telefono: '+52 612 777 8888',
    email: 'del.norte@example.com',
    zona: 'Zona Norte',
    activo: true,
    pedidos: 0,
    totalVentas: 0,
  },
  {
    id: 'DIST-002',
    nombre: 'Express Logistics',
    contacto: 'Ana Martínez',
    telefono: '+52 612 666 5555',
    email: 'express.log@example.com',
    zona: 'Zona Industrial',
    activo: true,
    pedidos: 0,
    totalVentas: 0,
  },
];

// ============================================
// FUNCIONES DE INICIALIZACIÓN
// ============================================

async function initBancos() {
  console.log('📊 Inicializando bancos...');
  for (const banco of BANCOS_INICIALES) {
    const docRef = doc(db, 'bancos', banco.id);
    await setDoc(docRef, {
      ...banco,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    console.log(`  ✅ Banco creado: ${banco.nombre}`);
  }
}

async function initClientes() {
  console.log('👥 Inicializando clientes...');
  for (const cliente of CLIENTES_DEMO) {
    const docRef = doc(db, 'clientes', cliente.id);
    await setDoc(docRef, {
      ...cliente,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    console.log(`  ✅ Cliente creado: ${cliente.nombre}`);
  }
}

async function initDistribuidores() {
  console.log('🚚 Inicializando distribuidores...');
  for (const distribuidor of DISTRIBUIDORES_DEMO) {
    const docRef = doc(db, 'distribuidores', distribuidor.id);
    await setDoc(docRef, {
      ...distribuidor,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    console.log(`  ✅ Distribuidor creado: ${distribuidor.nombre}`);
  }
}

async function verificarDatos() {
  console.log('\n🔍 Verificando datos...');

  const bancosSnapshot = await getDocs(collection(db, 'bancos'));
  console.log(`  📊 Bancos: ${bancosSnapshot.size}`);

  const clientesSnapshot = await getDocs(collection(db, 'clientes'));
  console.log(`  👥 Clientes: ${clientesSnapshot.size}`);

  const distribuidoresSnapshot = await getDocs(collection(db, 'distribuidores'));
  console.log(`  🚚 Distribuidores: ${distribuidoresSnapshot.size}`);

  const ventasSnapshot = await getDocs(collection(db, 'ventas'));
  console.log(`  💰 Ventas: ${ventasSnapshot.size}`);
}

// ============================================
// EJECUCIÓN PRINCIPAL
// ============================================

async function main() {
  console.log('╔════════════════════════════════════════════════════════════╗');
  console.log('║     INICIALIZACIÓN DE FIRESTORE - CHRONOS SYSTEM          ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');

  try {
    await initBancos();
    await initClientes();
    await initDistribuidores();
    await verificarDatos();

    console.log('\n✅ ¡Inicialización completada exitosamente!');
    console.log('\n📌 Próximos pasos:');
    console.log('   1. Abre http://localhost:5173 en tu navegador');
    console.log('   2. Navega a cada sección para verificar los datos');
    console.log('   3. Crea una venta de prueba');
    console.log('   4. Verifica que los saldos bancarios se actualicen\n');
  } catch (error) {
    console.error('❌ Error en la inicialización:', error);
    process.exit(1);
  }

  process.exit(0);
}

// Ejecutar
main();
