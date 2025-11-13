/**
 * Script de Inicialización de FlowDistributor
 * Crea datos iniciales y configuración básica en Firestore
 *
 * Uso: node scripts/init-flowdistributor.js
 */
import { initializeApp } from 'firebase/app';
import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth';
import { addDoc, collection, doc, getFirestore, setDoc } from 'firebase/firestore';

// Configuración de Firebase (usar variables de entorno en producción)
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
const auth = getAuth(app);

// ============================================
// DATOS INICIALES
// ============================================

const datosIniciales = {
  // Configuración del sistema
  configuracion: {
    moneda: 'USD',
    locale: 'es-MX',
    timezone: 'America/Mexico_City',
    stockMinimo: 10,
    diasCreditoPorDefecto: 30,
    tasaIVA: 16,
    version: '1.0.0',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },

  // Proveedores de ejemplo
  proveedores: [
    {
      nombre: 'Proveedor Internacional SA',
      pais: 'USA',
      contacto: 'John Doe',
      email: 'john@proveedor.com',
      telefono: '+1-555-0100',
      creditoDias: 30,
      moneda: 'USD',
      estado: 'ACTIVO',
      createdAt: new Date().toISOString(),
    },
    {
      nombre: 'Distribuidora Nacional',
      pais: 'México',
      contacto: 'María García',
      email: 'maria@distribuidora.mx',
      telefono: '+52-555-0200',
      creditoDias: 45,
      moneda: 'USD',
      estado: 'ACTIVO',
      createdAt: new Date().toISOString(),
    },
  ],

  // Clientes de ejemplo
  clientes: [
    {
      nombre: 'Cliente Corporativo SA',
      rfc: 'CCS010101ABC',
      empresa: 'Cliente Corporativo SA de CV',
      contacto: 'Juan Pérez',
      email: 'juan@cliente.com',
      telefono: '+52-555-0300',
      direccion: 'Av. Principal 123, CDMX',
      creditoAutorizado: 50000,
      creditoDisponible: 50000,
      bloqueado: false,
      estado: 'ACTIVO',
      createdAt: new Date().toISOString(),
    },
    {
      nombre: 'Comercial Ejemplo',
      rfc: 'CEJ020202DEF',
      empresa: 'Comercial Ejemplo SC',
      contacto: 'Ana López',
      email: 'ana@comercial.com',
      telefono: '+52-555-0400',
      direccion: 'Calle Secundaria 456, Monterrey',
      creditoAutorizado: 30000,
      creditoDisponible: 30000,
      bloqueado: false,
      estado: 'ACTIVO',
      createdAt: new Date().toISOString(),
    },
  ],

  // Productos de inventario de ejemplo
  inventario: [
    {
      producto: 'Producto A Premium',
      categoria: 'Electrónica',
      sku: 'PROD-A-001',
      stock: 100,
      stockMinimo: 20,
      costoPromedio: 50.0,
      precioVenta: 80.0,
      moneda: 'USD',
      unidad: 'PZA',
      ubicacion: 'Almacén Principal - A1',
      estado: 'ACTIVO',
      createdAt: new Date().toISOString(),
    },
    {
      producto: 'Producto B Estándar',
      categoria: 'Herramientas',
      sku: 'PROD-B-002',
      stock: 250,
      stockMinimo: 50,
      costoPromedio: 25.0,
      precioVenta: 40.0,
      moneda: 'USD',
      unidad: 'PZA',
      ubicacion: 'Almacén Principal - B2',
      estado: 'ACTIVO',
      createdAt: new Date().toISOString(),
    },
    {
      producto: 'Producto C Básico',
      categoria: 'Consumibles',
      sku: 'PROD-C-003',
      stock: 500,
      stockMinimo: 100,
      costoPromedio: 10.0,
      precioVenta: 15.0,
      moneda: 'USD',
      unidad: 'PZA',
      ubicacion: 'Almacén Principal - C3',
      estado: 'ACTIVO',
      createdAt: new Date().toISOString(),
    },
  ],

  // Categorías de gastos
  categoriasGastos: [
    { nombre: 'Nómina', descripcion: 'Pagos de sueldos y salarios', color: '#3B82F6' },
    { nombre: 'Renta', descripcion: 'Renta de local y almacén', color: '#10B981' },
    { nombre: 'Servicios', descripcion: 'Luz, agua, internet, teléfono', color: '#F59E0B' },
    { nombre: 'Transporte', descripcion: 'Fletes y envíos', color: '#EF4444' },
    { nombre: 'Mantenimiento', descripcion: 'Reparaciones y mantenimiento', color: '#8B5CF6' },
    { nombre: 'Marketing', descripcion: 'Publicidad y promociones', color: '#EC4899' },
    { nombre: 'Otros', descripcion: 'Gastos diversos', color: '#6B7280' },
  ],
};

// ============================================
// FUNCIONES DE INICIALIZACIÓN
// ============================================

async function crearUsuarioAdmin() {
  console.log('📝 Creando usuario administrador...');

  try {
    const email = 'admin@flowdistributor.com';
    const password = 'Admin123!'; // CAMBIAR EN PRODUCCIÓN

    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Crear documento de usuario en Firestore
    await setDoc(doc(db, 'usuarios', user.uid), {
      email: email,
      nombre: 'Administrador',
      rol: 'admin',
      activo: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    console.log('✅ Usuario admin creado:', email);
    console.log('⚠️  IMPORTANTE: Cambiar contraseña en producción');

    return user.uid;
  } catch (error) {
    if (error.code === 'auth/email-already-in-use') {
      console.log('ℹ️  Usuario admin ya existe');
    } else {
      console.error('❌ Error creando usuario admin:', error);
    }
    return null;
  }
}

async function crearConfiguracion() {
  console.log('⚙️  Creando configuración del sistema...');

  try {
    await setDoc(doc(db, 'configuracion', 'general'), datosIniciales.configuracion);
    console.log('✅ Configuración creada');
  } catch (error) {
    console.error('❌ Error creando configuración:', error);
  }
}

async function crearProveedores() {
  console.log('🏭 Creando proveedores de ejemplo...');

  for (const proveedor of datosIniciales.proveedores) {
    try {
      await addDoc(collection(db, 'proveedores'), proveedor);
      console.log(`✅ Proveedor creado: ${proveedor.nombre}`);
    } catch (error) {
      console.error(`❌ Error creando proveedor ${proveedor.nombre}:`, error);
    }
  }
}

async function crearClientes() {
  console.log('👥 Creando clientes de ejemplo...');

  for (const cliente of datosIniciales.clientes) {
    try {
      await addDoc(collection(db, 'clientes'), cliente);
      console.log(`✅ Cliente creado: ${cliente.nombre}`);
    } catch (error) {
      console.error(`❌ Error creando cliente ${cliente.nombre}:`, error);
    }
  }
}

async function crearInventario() {
  console.log('📦 Creando productos de inventario...');

  for (const producto of datosIniciales.inventario) {
    try {
      await addDoc(collection(db, 'inventario'), producto);
      console.log(`✅ Producto creado: ${producto.producto}`);
    } catch (error) {
      console.error(`❌ Error creando producto ${producto.producto}:`, error);
    }
  }
}

async function crearCategoriasGastos() {
  console.log('🏷️  Creando categorías de gastos...');

  for (const categoria of datosIniciales.categoriasGastos) {
    try {
      await addDoc(collection(db, 'categoriasGastos'), categoria);
      console.log(`✅ Categoría creada: ${categoria.nombre}`);
    } catch (error) {
      console.error(`❌ Error creando categoría ${categoria.nombre}:`, error);
    }
  }
}

// ============================================
// FUNCIÓN PRINCIPAL
// ============================================

async function inicializar() {
  console.log('\n==============================================');
  console.log('🚀 INICIALIZANDO FLOWDISTRIBUTOR');
  console.log('==============================================\n');

  console.log('💵 Moneda del Sistema: USD (Dólares)\n');

  try {
    // 1. Crear usuario administrador
    await crearUsuarioAdmin();

    // 2. Crear configuración
    await crearConfiguracion();

    // 3. Crear proveedores
    await crearProveedores();

    // 4. Crear clientes
    await crearClientes();

    // 5. Crear inventario
    await crearInventario();

    // 6. Crear categorías de gastos
    await crearCategoriasGastos();

    console.log('\n==============================================');
    console.log('✅ INICIALIZACIÓN COMPLETADA');
    console.log('==============================================\n');

    console.log('📋 CREDENCIALES DE ACCESO:');
    console.log('   Email: admin@flowdistributor.com');
    console.log('   Password: Admin123!');
    console.log('   ⚠️  CAMBIAR CONTRASEÑA EN PRODUCCIÓN\n');

    console.log('🎯 PRÓXIMOS PASOS:');
    console.log('   1. Iniciar sesión en la aplicación');
    console.log('   2. Cambiar contraseña del admin');
    console.log('   3. Crear usuarios adicionales');
    console.log('   4. Personalizar configuración\n');
  } catch (error) {
    console.error('\n❌ Error durante la inicialización:', error);
    process.exit(1);
  }

  process.exit(0);
}

// Ejecutar inicialización
inicializar();
