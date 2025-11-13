/**
 * 🔥 SCRIPT DE CARGA DE DATOS DEL EXCEL A FIRESTORE
 * Carga todos los datos del excel_data.json a Firestore
 * Ejecutar: node scripts/cargar-datos-excel.js
 */
import { initializeApp } from 'firebase/app';
import { collection, doc, getFirestore, serverTimestamp, writeBatch } from 'firebase/firestore';
import { readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuración de Firebase
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Leer datos REALES del JSON extraído del Excel
const excelData = JSON.parse(readFileSync(join(__dirname, '../src/data/datos_excel_reales_completos.json'), 'utf-8'));

console.log('📊 Datos REALES del Excel cargados:');
console.log(`  - Fuente: ${excelData.metadata.fuente}`);
console.log(`  - Fecha extracción: ${excelData.metadata.fechaExtraccion}`);
console.log(`  - Ventas (controlMaestro): ${excelData.controlMaestro?.length || 0}`);
console.log(`  - Clientes: ${excelData.clientes?.length || 0}`);
console.log(`  - Distribuidores: ${excelData.distribuidores?.length || 0}`);
console.log(`  - GYA (Gastos/Abonos): ${excelData.tablaGYA?.length || 0}`);
console.log(`  - Total Sistema: $${excelData.rfActual?.totalSistema?.toLocaleString() || 0}`);
console.log('');

/**
 * Función para subir datos en batch (máximo 500 por batch en Firestore)
 */
async function subirEnBatch(collectionName, datos, transformFn) {
  if (!datos || datos.length === 0) {
    console.log(`⏭️  Omitiendo ${collectionName} (sin datos)`);
    return;
  }

  console.log(`📤 Subiendo ${datos.length} registros a ${collectionName}...`);

  const BATCH_SIZE = 500;
  let totalSubidos = 0;

  for (let i = 0; i < datos.length; i += BATCH_SIZE) {
    const batch = writeBatch(db);
    const chunk = datos.slice(i, i + BATCH_SIZE);

    for (const item of chunk) {
      const docData = transformFn ? transformFn(item) : item;
      const docRef = doc(collection(db, collectionName));

      batch.set(docRef, {
        ...docData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    }

    await batch.commit();
    totalSubidos += chunk.length;
    console.log(`  ✅ Subidos ${totalSubidos}/${datos.length}`);
  }

  console.log(`✅ ${collectionName}: ${totalSubidos} registros completados\n`);
}

/**
 * Transformadores de datos
 */

function transformarVenta(venta) {
  // Cálculos correctos según el Excel
  const cantidad = Number(venta.cantidad) || 0;
  const costoTotal = Number(venta.costoBovedaMonte) || 0;
  const costoUnidad = cantidad > 0 ? costoTotal / cantidad : 0;
  const precioVenta = Number(venta.precioVenta) || 0;
  const totalVenta = Number(venta.ingreso) || 0;
  const totalFletes = Number(venta.fleteUtilidad) || 0;
  const utilidadNeta = Number(venta.utilidad) || 0;
  const aplicaFlete = venta.fleteAplica === 'Aplica' || venta.fleteAplica === 'Sí';

  return {
    // ID único
    id: venta.id,

    // Datos básicos
    fecha: venta.fecha,
    ocRelacionada: venta.oc || '',
    cantidad: cantidad,
    cliente: venta.cliente || '',
    estatus: venta.estatus || 'Pendiente',

    // Precios y costos
    costoUnidad: costoUnidad,
    precioVenta: precioVenta,
    costoTotal: costoTotal,

    // Totales financieros
    totalVenta: totalVenta,
    totalFletes: totalFletes,
    utilidadNeta: utilidadNeta,

    // Flete
    aplicaFlete: aplicaFlete,
    fleteVenta: aplicaFlete ? 'Aplica' : 'No Aplica',

    // Distribución a bancos
    distribucionBancos: {
      bovedaMonte: totalVenta - totalFletes - utilidadNeta,
      fletes: totalFletes,
      utilidades: utilidadNeta,
    },

    // Panel asignado
    panelAsignado: venta.panel || '',

    // Conceptos adicionales
    concepto: venta.concepto || '',

    // Metadata
    metadata: {
      origen: 'excel_real',
      creadoEn: new Date().toISOString(),
      actualizadoEn: new Date().toISOString(),
    },
  };
}

function transformarCliente(cliente) {
  return {
    // ID único
    id: cliente.id,

    // Datos básicos del Excel
    nombre: cliente.CLIENTES || cliente.nombre || '',
    rfc: cliente.RFC || cliente.rfc || '',
    direccion: cliente['DIRECCIÓN'] || cliente.direccion || '',
    telefono: cliente['TELÉFONO'] || cliente.telefono || '',
    email: cliente.EMAIL || cliente.email || '',

    // Adeudo
    adeudo: Number(cliente['ADEUDO (Dólares)']) || Number(cliente.adeudo) || 0,
    notas: cliente.NOTAS || cliente.notas || '',

    // Metadata
    activo: true,
    metadata: {
      origen: 'excel_real',
      creadoEn: new Date().toISOString(),
    },
  };
}

function transformarDistribuidor(distribuidor) {
  return {
    // ID único
    id: distribuidor.id,

    // Datos básicos del Excel
    nombre: distribuidor.DISTRIBUIDORES || distribuidor.nombre || '',
    rfc: distribuidor.RFC || distribuidor.rfc || '',
    direccion: distribuidor['DIRECCIÓN'] || distribuidor.direccion || '',
    telefono: distribuidor['TELÉFONO'] || distribuidor.telefono || '',
    email: distribuidor.EMAIL || distribuidor.email || '',

    // Adeudo
    adeudo: Number(distribuidor['ADEUDO (Dólares)']) || Number(distribuidor.adeudo) || 0,
    notas: distribuidor.NOTAS || distribuidor.notas || '',

    // Metadata
    activo: true,
    metadata: {
      origen: 'excel_real',
      creadoEn: new Date().toISOString(),
    },
  };
}

function transformarOrdenCompra(orden) {
  return {
    // ID original
    excelId: orden.id,

    // Datos básicos
    fecha: new Date(orden.fecha),
    numeroOrden: orden.numeroOrden || orden.id,
    estatus: orden.estatus === 'RECIBIDO' ? 'RECIBIDO' : 'PENDIENTE',

    // Producto
    producto: orden.producto || 'Producto',
    productoId: orden.productoId || null,
    cantidad: orden.cantidad || 0,
    precioUnitario: orden.precioUnitario || 0,

    // Distribuidor
    distribuidor: orden.distribuidor || '',
    distribuidorId: orden.distribuidorId || null,

    // Financiero
    total: (orden.cantidad || 0) * (orden.precioUnitario || 0),
    moneda: 'MXN',

    // Fechas
    fechaEntregaEstimada: orden.fechaEntregaEstimada ? new Date(orden.fechaEntregaEstimada) : null,
    fechaRecepcion: orden.fechaRecepcion ? new Date(orden.fechaRecepcion) : null,

    // Notas
    notas: orden.notas || '',

    // Metadata
    origen: 'excel_import',
  };
}

function transformarProducto(producto) {
  return {
    // ID original
    excelId: producto.id,

    // Datos básicos
    nombre: producto.nombre,
    codigo: producto.codigo || producto.id,
    descripcion: producto.descripcion || '',

    // Inventario
    stock: producto.stock || 0,
    stockMinimo: producto.stockMinimo || 10,
    stockMaximo: producto.stockMaximo || 1000,
    unidadMedida: producto.unidadMedida || 'pieza',

    // Precios
    precioCompra: producto.precioCompra || 0,
    precioVenta: producto.precioVenta || 0,
    costoPromedio: producto.costoPromedio || producto.precioCompra || 0,

    // Categoría
    categoria: producto.categoria || 'General',

    // Metadata
    activo: true,
    fechaRegistro: producto.fechaRegistro ? new Date(producto.fechaRegistro) : new Date(),
    origen: 'excel_import',
  };
}

/**
 * Función principal
 */
async function cargarDatos() {
  try {
    console.log('🚀 Iniciando carga de datos a Firestore...\n');

    // 1. Cargar clientes
    await subirEnBatch('clientes', excelData.clientes, transformarCliente);

    // 2. Cargar distribuidores
    await subirEnBatch('distribuidores', excelData.distribuidores, transformarDistribuidor);

    // 3. Cargar productos
    await subirEnBatch('productos', excelData.productos, transformarProducto);

    // 4. Cargar órdenes de compra
    await subirEnBatch('ordenes-compra', excelData.ordenesCompra, transformarOrdenCompra);

    // 5. Cargar ventas
    await subirEnBatch('ventas', excelData.ventas, transformarVenta);

    console.log('');
    console.log('🎉 ¡CARGA COMPLETADA EXITOSAMENTE!');
    console.log('');
    console.log('📊 Resumen:');
    console.log(`  ✅ Clientes: ${excelData.clientes?.length || 0}`);
    console.log(`  ✅ Distribuidores: ${excelData.distribuidores?.length || 0}`);
    console.log(`  ✅ Productos: ${excelData.productos?.length || 0}`);
    console.log(`  ✅ Órdenes de Compra: ${excelData.ordenesCompra?.length || 0}`);
    console.log(`  ✅ Ventas: ${excelData.ventas?.length || 0}`);
    console.log('');
    console.log('🔥 Los datos están ahora en Firestore y la UI los mostrará automáticamente');
    console.log('');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error al cargar datos:', error);
    process.exit(1);
  }
}

// Ejecutar
cargarDatos();
