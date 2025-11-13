#!/usr/bin/env node
/**
 * 🚀 CARGA RÁPIDA DE DATOS A FIRESTORE
 * Carga datos de demostración para testing inmediato
 */
import { initializeApp } from 'firebase/app';
import { doc, getFirestore, setDoc } from 'firebase/firestore';

// Configuración Firebase Chronos
const firebaseConfig = {
  apiKey: 'AIzaSyB9gG3ITQ6MkY-kOahzSHRqqNaJMguDi5k',
  authDomain: 'chronos-176d8.firebaseapp.com',
  projectId: 'chronos-176d8',
  storageBucket: 'chronos-176d8.firebasestorage.app',
  messagingSenderId: '148680866109',
  appId: '1:148680866109:web:5da615f10d3600e50b6d54',
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

console.log('🚀 Iniciando carga de datos de demostración...\n');

// Datos de demostración
const datosDemo = {
  clientes: [
    {
      id: 'CLI001',
      nombre: 'Juan Pérez',
      empresa: 'Comercial del Norte',
      telefono: '8121234567',
      email: 'juan@comercial.com',
      ciudad: 'Monterrey',
      estado: 'Nuevo León',
      saldoActual: 25000,
      credito: 50000,
      status: 'activo',
      fechaRegistro: new Date('2024-01-15'),
    },
    {
      id: 'CLI002',
      nombre: 'María González',
      empresa: 'Distribuidora del Sur',
      telefono: '8187654321',
      email: 'maria@distribuidora.com',
      ciudad: 'Guadalajara',
      estado: 'Jalisco',
      saldoActual: 15000,
      credito: 30000,
      status: 'activo',
      fechaRegistro: new Date('2024-02-20'),
    },
    {
      id: 'CLI003',
      nombre: 'Carlos Rodríguez',
      empresa: 'Abarrotes La Esperanza',
      telefono: '8199876543',
      email: 'carlos@esperanza.com',
      ciudad: 'Ciudad de México',
      estado: 'CDMX',
      saldoActual: 8500,
      credito: 20000,
      status: 'activo',
      fechaRegistro: new Date('2024-03-10'),
    },
  ],

  ventas: [
    {
      id: 'VEN001',
      clienteId: 'CLI001',
      clienteNombre: 'Juan Pérez',
      fecha: new Date('2024-11-01'),
      total: 15000,
      subtotal: 13043.48,
      iva: 1956.52,
      status: 'pagada',
      metodoPago: 'transferencia',
      productos: [
        {
          id: 'PROD001',
          nombre: 'Producto A',
          cantidad: 50,
          precioUnitario: 200,
          subtotal: 10000,
        },
      ],
    },
    {
      id: 'VEN002',
      clienteId: 'CLI002',
      clienteNombre: 'María González',
      fecha: new Date('2024-11-05'),
      total: 8500,
      subtotal: 7391.3,
      iva: 1108.7,
      status: 'pendiente',
      metodoPago: 'credito',
      productos: [
        {
          id: 'PROD002',
          nombre: 'Producto B',
          cantidad: 30,
          precioUnitario: 250,
          subtotal: 7500,
        },
      ],
    },
    {
      id: 'VEN003',
      clienteId: 'CLI003',
      clienteNombre: 'Carlos Rodríguez',
      fecha: new Date('2024-11-10'),
      total: 12000,
      subtotal: 10434.78,
      iva: 1565.22,
      status: 'pagada',
      metodoPago: 'efectivo',
      productos: [
        {
          id: 'PROD003',
          nombre: 'Producto C',
          cantidad: 40,
          precioUnitario: 300,
          subtotal: 12000,
        },
      ],
    },
  ],

  productos: [
    {
      id: 'PROD001',
      nombre: 'Producto A',
      descripcion: 'Descripción del producto A',
      precio: 200,
      costo: 150,
      stock: 500,
      categoria: 'Categoría 1',
      proveedor: 'Proveedor A',
      status: 'activo',
    },
    {
      id: 'PROD002',
      nombre: 'Producto B',
      descripcion: 'Descripción del producto B',
      precio: 250,
      costo: 180,
      stock: 350,
      categoria: 'Categoría 2',
      proveedor: 'Proveedor B',
      status: 'activo',
    },
    {
      id: 'PROD003',
      nombre: 'Producto C',
      descripcion: 'Descripción del producto C',
      precio: 300,
      costo: 220,
      stock: 450,
      categoria: 'Categoría 1',
      proveedor: 'Proveedor A',
      status: 'activo',
    },
  ],

  bancos: [
    {
      id: 'BANCO_BANORTE',
      nombre: 'Banorte',
      numeroCuenta: '****5678',
      saldo: 150000,
      tipo: 'corriente',
      status: 'activo',
      color: '#E41E26',
      ultimaActualizacion: new Date(),
    },
    {
      id: 'BANCO_AZTECA',
      nombre: 'Banco Azteca',
      numeroCuenta: '****1234',
      saldo: 85000,
      tipo: 'corriente',
      status: 'activo',
      color: '#00A94F',
      ultimaActualizacion: new Date(),
    },
    {
      id: 'BANCO_LEFTIE',
      nombre: 'Leftie',
      numeroCuenta: '****9876',
      saldo: 45000,
      tipo: 'ahorro',
      status: 'activo',
      color: '#FF6B35',
      ultimaActualizacion: new Date(),
    },
  ],

  gastos: [
    {
      id: 'GASTO001',
      descripcion: 'Renta de local',
      monto: 25000,
      fecha: new Date('2024-11-01'),
      categoria: 'Operación',
      metodoPago: 'transferencia',
      bancoId: 'BANCO_BANORTE',
      status: 'pagado',
    },
    {
      id: 'GASTO002',
      descripcion: 'Servicios (luz, agua, internet)',
      monto: 8500,
      fecha: new Date('2024-11-05'),
      categoria: 'Servicios',
      metodoPago: 'transferencia',
      bancoId: 'BANCO_AZTECA',
      status: 'pagado',
    },
    {
      id: 'GASTO003',
      descripcion: 'Nómina empleados',
      monto: 45000,
      fecha: new Date('2024-11-15'),
      categoria: 'Recursos Humanos',
      metodoPago: 'transferencia',
      bancoId: 'BANCO_BANORTE',
      status: 'pagado',
    },
  ],

  distribuidores: [
    {
      id: 'DIST001',
      nombre: 'Distribuidora Principal',
      contacto: 'Roberto Sánchez',
      telefono: '8123456789',
      email: 'roberto@distribuidora.com',
      ciudad: 'Monterrey',
      comision: 5,
      status: 'activo',
      fechaRegistro: new Date('2024-01-01'),
    },
    {
      id: 'DIST002',
      nombre: 'Mayorista del Centro',
      contacto: 'Ana Martínez',
      telefono: '5512345678',
      email: 'ana@mayorista.com',
      ciudad: 'Ciudad de México',
      comision: 4.5,
      status: 'activo',
      fechaRegistro: new Date('2024-02-15'),
    },
  ],
};

// Función para cargar datos
async function cargarDatos() {
  let totalCargados = 0;

  for (const [collectionName, items] of Object.entries(datosDemo)) {
    console.log(`\n📦 Cargando ${collectionName}...`);

    for (const item of items) {
      try {
        await setDoc(doc(db, collectionName, item.id), item);
        console.log(`  ✅ ${item.id} - ${item.nombre || item.descripcion}`);
        totalCargados++;
      } catch (error) {
        console.log(`  ❌ Error en ${item.id}: ${error.message}`);
      }
    }
  }

  console.log(`\n✨ ¡Carga completada! ${totalCargados} documentos cargados\n`);
  console.log('🎉 El sistema ahora tiene datos para operar');
  console.log('🌐 Abre http://localhost:3001 para ver los datos en la UI\n');

  process.exit(0);
}

// Ejecutar
cargarDatos().catch((error) => {
  console.error('❌ Error fatal:', error);
  process.exit(1);
});
