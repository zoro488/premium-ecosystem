/**
 * 🔥 SCRIPT DE MIGRACIÓN: Excel → Firestore
 *
 * Este script carga TODOS los datos del archivo excel_data.json
 * a las colecciones de Firestore con la estructura correcta.
 *
 * Autor: GitHub Copilot
 * Fecha: 2025-11-11
 * Version: 1.0.0
 */

import { initializeApp } from 'firebase/app';
import {
    doc,
    getFirestore,
    serverTimestamp,
    setDoc,
    Timestamp,
    writeBatch
} from 'firebase/firestore';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ==========================================
// CONFIGURACIÓN FIREBASE
// ==========================================

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

// ==========================================
// UTILIDADES
// ==========================================

/**
 * Convierte string de fecha a Timestamp de Firestore
 */
function parseDate(dateString) {
  if (!dateString) return serverTimestamp();

  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return serverTimestamp();
    return Timestamp.fromDate(date);
  } catch (error) {
    console.warn(`⚠️  Error al parsear fecha: ${dateString}`, error);
    return serverTimestamp();
  }
}

/**
 * Normaliza nombre de cliente para usar como ID
 */
function normalizeClienteName(name) {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * Genera ID único para documento
 */
function generateId(prefix = 'DOC') {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// ==========================================
// FUNCIONES DE MIGRACIÓN
// ==========================================

/**
 * 1. Migrar CLIENTES
 */
async function migrateClientes(excelData) {
  console.log('\n📦 Migrando CLIENTES...');

  const clientesSet = new Set();
  const clientesMap = new Map();

  // Extraer clientes únicos de las ventas
  excelData.ventas.forEach((venta) => {
    if (venta.cliente && !clientesSet.has(venta.cliente)) {
      clientesSet.add(venta.cliente);

      // Calcular adeudo total del cliente
      const ventasCliente = excelData.ventas.filter(v => v.cliente === venta.cliente);
      const adeudo = ventasCliente
        .filter(v => v.estatus === 'Pendiente')
        .reduce((sum, v) => sum + (v.totalVenta || 0), 0);

      const totalVentas = ventasCliente.reduce((sum, v) => sum + (v.totalVenta || 0), 0);

      clientesMap.set(venta.cliente, {
        nombre: venta.cliente,
        razonSocial: venta.cliente,
        rfc: '',
        telefono: '',
        email: '',
        direccion: '',
        ciudad: '',
        estado: '',
        codigoPostal: '',
        limiteCredito: totalVentas * 1.5, // 150% del total de ventas
        diasCredito: 30,
        adeudo: adeudo,
        activo: true,
        totalVentas: totalVentas,
        cantidadVentas: ventasCliente.length,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    }
  });

  // Escribir a Firestore en lotes
  let batch = writeBatch(db);
  let count = 0;
  let batchCount = 0;

  for (const [clienteName, clienteData] of clientesMap) {
    const clienteId = normalizeClienteName(clienteName);
    const clienteRef = doc(db, 'clientes', clienteId);

    batch.set(clienteRef, clienteData);
    count++;
    batchCount++;

    // Firestore permite máximo 500 operaciones por batch
    if (batchCount === 500) {
      await batch.commit();
      console.log(`  ✅ Batch de ${batchCount} clientes guardado`);
      batch = writeBatch(db);
      batchCount = 0;
    }
  }

  // Commit del último batch
  if (batchCount > 0) {
    await batch.commit();
    console.log(`  ✅ Batch final de ${batchCount} clientes guardado`);
  }

  console.log(`✅ ${count} clientes migrados correctamente`);
  return count;
}

/**
 * 2. Migrar VENTAS
 */
async function migrateVentas(excelData) {
  console.log('\n💰 Migrando VENTAS...');

  let batch = writeBatch(db);
  let count = 0;
  let batchCount = 0;

  for (const venta of excelData.ventas) {
    const ventaId = venta.id || generateId('VENTA');
    const ventaRef = doc(db, 'ventas', ventaId);

    const ventaData = {
      // Información básica
      tipo: venta.tipo || 'venta',
      fecha: parseDate(venta.fecha),
      ocRelacionada: venta.ocRelacionada || '',

      // Cliente
      clienteId: normalizeClienteName(venta.cliente),
      clienteNombre: venta.cliente,

      // Productos
      productos: venta.productos.map(p => ({
        nombre: p.nombre || 'Producto',
        cantidad: p.cantidad || 0,
        precio: p.precio || 0,
        subtotal: p.subtotal || 0,
      })),

      // Cantidades
      cantidad: venta.cantidad || 0,

      // Montos
      totalVenta: venta.totalVenta || 0,
      totalFletes: venta.totalFletes || 0,
      totalUtilidades: venta.totalUtilidades || 0,
      subtotal: venta.totalVenta - venta.totalFletes,
      precioVenta: venta.totalVenta || 0,

      // Estado
      estatus: venta.estatus || 'Pendiente',
      estadoPago: venta.estadoPago || 'pendiente',
      adeudo: venta.adeudo || 0,
      montoPagado: venta.montoPagado || 0,

      // Destino y concepto
      destino: venta.destino || 'bovedaMonte',
      bancoId: venta.destino || 'bovedaMonte',
      concepto: venta.concepto || 'Venta de producto',

      // Flete
      aplicaFlete: venta.aplicaFlete !== undefined ? venta.aplicaFlete : true,

      // Montos por banco (legacy)
      bovedaMonte: venta.bovedaMonte || 0,

      // Metadata
      createdAt: parseDate(venta.fecha),
      updatedAt: serverTimestamp(),
    };

    batch.set(ventaRef, ventaData);
    count++;
    batchCount++;

    if (batchCount === 500) {
      await batch.commit();
      console.log(`  ✅ Batch de ${batchCount} ventas guardado`);
      batch = writeBatch(db);
      batchCount = 0;
    }
  }

  if (batchCount > 0) {
    await batch.commit();
    console.log(`  ✅ Batch final de ${batchCount} ventas guardado`);
  }

  console.log(`✅ ${count} ventas migradas correctamente`);
  return count;
}

/**
 * 3. Migrar ÓRDENES DE COMPRA
 */
async function migrateOrdenesCompra(excelData) {
  console.log('\n📋 Migrando ÓRDENES DE COMPRA...');

  if (!excelData.ordenesCompra || excelData.ordenesCompra.length === 0) {
    console.log('⚠️  No hay órdenes de compra para migrar');
    return 0;
  }

  let batch = writeBatch(db);
  let count = 0;
  let batchCount = 0;

  for (const orden of excelData.ordenesCompra) {
    const ordenId = orden.id || generateId('OC');
    const ordenRef = doc(db, 'ordenesCompra', ordenId);

    const ordenData = {
      numeroOrden: orden.numeroOrden || orden.id,
      fecha: parseDate(orden.fecha),
      proveedor: orden.proveedor || 'Proveedor desconocido',
      proveedorId: normalizeClienteName(orden.proveedor || 'proveedor'),

      // Productos
      productos: (orden.productos || []).map(p => ({
        nombre: p.nombre || 'Producto',
        cantidad: p.cantidad || 0,
        precioUnitario: p.precioUnitario || 0,
        subtotal: p.subtotal || 0,
      })),

      // Montos
      subtotal: orden.subtotal || 0,
      iva: orden.iva || 0,
      total: orden.total || 0,
      adeudo: orden.adeudo || 0,
      montoPagado: orden.montoPagado || 0,

      // Estado
      estatus: orden.estatus || 'Pendiente',
      estadoPago: orden.estadoPago || 'pendiente',

      // Banco
      bancoOrigen: orden.bancoOrigen || 'bovedaMonte',

      // Metadata
      notas: orden.notas || '',
      createdAt: parseDate(orden.fecha),
      updatedAt: serverTimestamp(),
    };

    batch.set(ordenRef, ordenData);
    count++;
    batchCount++;

    if (batchCount === 500) {
      await batch.commit();
      console.log(`  ✅ Batch de ${batchCount} órdenes guardado`);
      batch = writeBatch(db);
      batchCount = 0;
    }
  }

  if (batchCount > 0) {
    await batch.commit();
    console.log(`  ✅ Batch final de ${batchCount} órdenes guardado`);
  }

  console.log(`✅ ${count} órdenes de compra migradas correctamente`);
  return count;
}

/**
 * 4. Migrar DISTRIBUIDORES (Proveedores)
 */
async function migrateDistribuidores(excelData) {
  console.log('\n🚚 Migrando DISTRIBUIDORES...');

  const distribuidoresSet = new Set();
  const distribuidoresMap = new Map();

  // Extraer distribuidores de órdenes de compra
  if (excelData.ordenesCompra) {
    excelData.ordenesCompra.forEach((orden) => {
      if (orden.proveedor && !distribuidoresSet.has(orden.proveedor)) {
        distribuidoresSet.add(orden.proveedor);

        const ordenesProveedor = excelData.ordenesCompra.filter(
          o => o.proveedor === orden.proveedor
        );

        const adeudo = ordenesProveedor
          .filter(o => o.estatus === 'Pendiente')
          .reduce((sum, o) => sum + (o.total || 0), 0);

        const totalCompras = ordenesProveedor.reduce((sum, o) => sum + (o.total || 0), 0);

        distribuidoresMap.set(orden.proveedor, {
          nombre: orden.proveedor,
          razonSocial: orden.proveedor,
          rfc: '',
          telefono: '',
          email: '',
          direccion: '',
          ciudad: '',
          estado: '',
          codigoPostal: '',
          adeudo: adeudo,
          activo: true,
          totalCompras: totalCompras,
          cantidadOrdenes: ordenesProveedor.length,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }
    });
  }

  let batch = writeBatch(db);
  let count = 0;
  let batchCount = 0;

  for (const [proveedorName, proveedorData] of distribuidoresMap) {
    const proveedorId = normalizeClienteName(proveedorName);
    const proveedorRef = doc(db, 'distribuidores', proveedorId);

    batch.set(proveedorRef, proveedorData);
    count++;
    batchCount++;

    if (batchCount === 500) {
      await batch.commit();
      console.log(`  ✅ Batch de ${batchCount} distribuidores guardado`);
      batch = writeBatch(db);
      batchCount = 0;
    }
  }

  if (batchCount > 0) {
    await batch.commit();
    console.log(`  ✅ Batch final de ${batchCount} distribuidores guardado`);
  }

  console.log(`✅ ${count} distribuidores migrados correctamente`);
  return count;
}

/**
 * 5. Migrar BANCOS
 */
async function migrateBancos(excelData) {
  console.log('\n🏦 Migrando BANCOS...');

  // Bancos predefinidos del sistema
  const bancosDefault = [
    {
      id: 'bovedaMonte',
      nombre: 'Bóveda Monte',
      tipo: 'principal',
      capitalInicial: 40000,
      capitalActual: 202200,
      saldo: 202200,
      numeroTarjeta: '****1234',
      activo: true,
      color: '#00d9ff',
    },
    {
      id: 'leftie',
      nombre: 'Banco Leftie',
      tipo: 'secundario',
      capitalInicial: 35000,
      capitalActual: 150000,
      saldo: 150000,
      numeroTarjeta: '****5678',
      activo: true,
      color: '#8b5cf6',
    },
    {
      id: 'banorte',
      nombre: 'Banorte',
      tipo: 'secundario',
      capitalInicial: 30000,
      capitalActual: 120000,
      saldo: 120000,
      numeroTarjeta: '****9012',
      activo: true,
      color: '#10b981',
    },
    {
      id: 'bbva',
      nombre: 'BBVA',
      tipo: 'terciario',
      capitalInicial: 25000,
      capitalActual: 95000,
      saldo: 95000,
      numeroTarjeta: '****3456',
      activo: true,
      color: '#f59e0b',
    },
    {
      id: 'santander',
      nombre: 'Santander',
      tipo: 'terciario',
      capitalInicial: 20000,
      capitalActual: 80000,
      saldo: 80000,
      numeroTarjeta: '****7890',
      activo: true,
      color: '#ef4444',
    },
    {
      id: 'hsbc',
      nombre: 'HSBC',
      tipo: 'terciario',
      capitalInicial: 15000,
      capitalActual: 65000,
      saldo: 65000,
      numeroTarjeta: '****2345',
      activo: true,
      color: '#ec4899',
    },
    {
      id: 'scotiabank',
      nombre: 'Scotiabank',
      tipo: 'terciario',
      capitalInicial: 10000,
      capitalActual: 50000,
      saldo: 50000,
      numeroTarjeta: '****6789',
      activo: true,
      color: '#06b6d4',
    },
  ];

  const batch = writeBatch(db);
  let count = 0;

  for (const banco of bancosDefault) {
    const bancoRef = doc(db, 'bancos', banco.id);

    const bancoData = {
      ...banco,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    batch.set(bancoRef, bancoData);
    count++;
  }

  await batch.commit();
  console.log(`✅ ${count} bancos migrados correctamente`);
  return count;
}

/**
 * 6. Migrar PRODUCTOS
 */
async function migrateProductos(excelData) {
  console.log('\n📦 Migrando PRODUCTOS...');

  const productosSet = new Set();
  const productosMap = new Map();

  // Extraer productos únicos de ventas
  excelData.ventas.forEach((venta) => {
    venta.productos.forEach((producto) => {
      const nombreProducto = producto.nombre || 'Producto';
      if (!productosSet.has(nombreProducto)) {
        productosSet.add(nombreProducto);

        // Calcular stock y precio promedio
        let totalCantidad = 0;
        let totalPrecio = 0;
        let count = 0;

        excelData.ventas.forEach((v) => {
          v.productos.forEach((p) => {
            if (p.nombre === nombreProducto) {
              totalCantidad += p.cantidad || 0;
              totalPrecio += p.precio || 0;
              count++;
            }
          });
        });

        const precioPromedio = count > 0 ? totalPrecio / count : 0;

        productosMap.set(nombreProducto, {
          nombre: nombreProducto,
          descripcion: `Producto ${nombreProducto}`,
          sku: `SKU-${nombreProducto.toUpperCase().replace(/\s+/g, '-')}`,
          categoria: 'General',
          precioCompra: precioPromedio * 0.6, // Estimado 60% del precio de venta
          precioVenta: precioPromedio,
          stock: 100, // Stock inicial
          stockMinimo: 10,
          unidadMedida: 'unidad',
          activo: true,
          proveedor: 'Proveedor Principal',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }
    });
  });

  let batch = writeBatch(db);
  let count = 0;
  let batchCount = 0;

  for (const [productoName, productoData] of productosMap) {
    const productoId = generateId('PROD');
    const productoRef = doc(db, 'productos', productoId);

    batch.set(productoRef, productoData);
    count++;
    batchCount++;

    if (batchCount === 500) {
      await batch.commit();
      console.log(`  ✅ Batch de ${batchCount} productos guardado`);
      batch = writeBatch(db);
      batchCount = 0;
    }
  }

  if (batchCount > 0) {
    await batch.commit();
    console.log(`  ✅ Batch final de ${batchCount} productos guardado`);
  }

  console.log(`✅ ${count} productos migrados correctamente`);
  return count;
}

/**
 * 7. Migrar INVENTARIO (Entradas y Salidas)
 */
async function migrateInventario(excelData) {
  console.log('\n📊 Migrando INVENTARIO...');

  if (!excelData.almacen) {
    console.log('⚠️  No hay datos de inventario para migrar');
    return 0;
  }

  let batch = writeBatch(db);
  let count = 0;
  let batchCount = 0;

  // Migrar entradas
  if (excelData.almacen.entradas) {
    for (const entrada of excelData.almacen.entradas) {
      const entradaId = generateId('ENT');
      const entradaRef = doc(db, 'inventario', entradaId);

      const entradaData = {
        tipo: 'entrada',
        fecha: parseDate(entrada.fecha),
        cantidad: entrada.cantidad || 0,
        origen: entrada.origen || 'Proveedor',
        notas: `Entrada desde ${entrada.origen || 'origen desconocido'}`,
        createdAt: parseDate(entrada.fecha),
        updatedAt: serverTimestamp(),
      };

      batch.set(entradaRef, entradaData);
      count++;
      batchCount++;

      if (batchCount === 500) {
        await batch.commit();
        console.log(`  ✅ Batch de ${batchCount} movimientos guardado`);
        batch = writeBatch(db);
        batchCount = 0;
      }
    }
  }

  // Migrar salidas
  if (excelData.almacen.salidas) {
    for (const salida of excelData.almacen.salidas) {
      const salidaId = generateId('SAL');
      const salidaRef = doc(db, 'inventario', salidaId);

      const salidaData = {
        tipo: 'salida',
        fecha: parseDate(salida.fecha),
        cantidad: salida.cantidad || 0,
        destino: salida.destino || 'Cliente',
        notas: `Salida hacia ${salida.destino || 'destino desconocido'}`,
        createdAt: parseDate(salida.fecha),
        updatedAt: serverTimestamp(),
      };

      batch.set(salidaRef, salidaData);
      count++;
      batchCount++;

      if (batchCount === 500) {
        await batch.commit();
        console.log(`  ✅ Batch de ${batchCount} movimientos guardado`);
        batch = writeBatch(db);
        batchCount = 0;
      }
    }
  }

  if (batchCount > 0) {
    await batch.commit();
    console.log(`  ✅ Batch final de ${batchCount} movimientos guardado`);
  }

  console.log(`✅ ${count} movimientos de inventario migrados correctamente`);
  return count;
}

/**
 * 8. Migrar MOVIMIENTOS (Gastos, Abonos, etc.)
 */
async function migrateMovimientos(excelData) {
  console.log('\n💸 Migrando MOVIMIENTOS...');

  if (!excelData.movimientos || excelData.movimientos.length === 0) {
    console.log('⚠️  No hay movimientos para migrar');
    return 0;
  }

  let batch = writeBatch(db);
  let count = 0;
  let batchCount = 0;

  for (const movimiento of excelData.movimientos) {
    const movimientoId = movimiento.id || generateId('MOV');
    const movimientoRef = doc(db, 'movimientos', movimientoId);

    const movimientoData = {
      tipo: movimiento.tipo || 'gasto',
      monto: movimiento.monto || 0,
      fecha: parseDate(movimiento.fecha),
      concepto: movimiento.concepto || 'Sin concepto',
      bancoId: normalizeClienteName(movimiento.banco || 'leftie'),
      bancoNombre: movimiento.banco || 'Banco Leftie',
      notas: movimiento.notas || '',
      createdAt: parseDate(movimiento.fecha),
      updatedAt: serverTimestamp(),
    };

    batch.set(movimientoRef, movimientoData);
    count++;
    batchCount++;

    if (batchCount === 500) {
      await batch.commit();
      console.log(`  ✅ Batch de ${batchCount} movimientos guardado`);
      batch = writeBatch(db);
      batchCount = 0;
    }
  }

  if (batchCount > 0) {
    await batch.commit();
    console.log(`  ✅ Batch final de ${batchCount} movimientos guardado`);
  }

  console.log(`✅ ${count} movimientos bancarios migrados correctamente`);
  return count;
}

/**
 * 9. Crear documento de METADATA
 */
async function createMetadata(excelData, stats) {
  console.log('\n📊 Creando METADATA...');

  const metadataRef = doc(db, 'system', 'metadata');

  const metadataData = {
    version: excelData.version || '3.0-excel-completo',
    estado: 'sincronizado-excel',
    ultimaActualizacion: serverTimestamp(),
    ultimaMigracion: serverTimestamp(),

    // Estadísticas de migración
    migracion: {
      fecha: new Date().toISOString(),
      origen: 'excel_data.json',
      registros: stats,
    },

    // Resumen del Excel
    resumen: excelData.resumen || {},

    // Métricas financieras
    metricasFinancieras: excelData.metricasFinancieras || {},

    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  await setDoc(metadataRef, metadataData);
  console.log('✅ Metadata creada correctamente');
}

// ==========================================
// FUNCIÓN PRINCIPAL
// ==========================================

async function main() {
  console.log('\n');
  console.log('╔════════════════════════════════════════════╗');
  console.log('║   🔥 MIGRACIÓN EXCEL → FIRESTORE 🔥       ║');
  console.log('║   Premium Ecosystem - FlowDistributor      ║');
  console.log('╚════════════════════════════════════════════╝');
  console.log('\n');

  try {
    // Leer archivo Excel
    console.log('📂 Leyendo excel_data.json...');
    const excelPath = path.join(__dirname, '../public/excel_data.json');
    const excelContent = fs.readFileSync(excelPath, 'utf-8');
    const excelData = JSON.parse(excelContent);
    console.log('✅ Archivo leído correctamente');

    // Mostrar resumen
    console.log('\n📊 RESUMEN DEL ARCHIVO:');
    console.log(`  - Ventas: ${excelData.ventas?.length || 0}`);
    console.log(`  - Órdenes de Compra: ${excelData.ordenesCompra?.length || 0}`);
    console.log(`  - Entradas Almacén: ${excelData.almacen?.entradas?.length || 0}`);
    console.log(`  - Salidas Almacén: ${excelData.almacen?.salidas?.length || 0}`);
    console.log(`  - Movimientos: ${excelData.movimientos?.length || 0}`);

    // Confirmar migración
    console.log('\n⚠️  ADVERTENCIA: Esta operación sobrescribirá datos existentes en Firestore');
    console.log('🚀 Iniciando migración en 3 segundos...');
    await new Promise(resolve => setTimeout(resolve, 3000));

    const startTime = Date.now();
    const stats = {};

    // Ejecutar migraciones
    stats.bancos = await migrateBancos(excelData);
    stats.clientes = await migrateClientes(excelData);
    stats.distribuidores = await migrateDistribuidores(excelData);
    stats.productos = await migrateProductos(excelData);
    stats.ventas = await migrateVentas(excelData);
    stats.ordenesCompra = await migrateOrdenesCompra(excelData);
    stats.inventario = await migrateInventario(excelData);
    stats.movimientos = await migrateMovimientos(excelData);

    // Crear metadata
    await createMetadata(excelData, stats);

    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);

    // Resumen final
    console.log('\n');
    console.log('╔════════════════════════════════════════════╗');
    console.log('║          ✅ MIGRACIÓN COMPLETADA ✅         ║');
    console.log('╚════════════════════════════════════════════╝');
    console.log('\n📊 ESTADÍSTICAS:');
    console.log(`  ✅ Bancos:            ${stats.bancos} registros`);
    console.log(`  ✅ Clientes:          ${stats.clientes} registros`);
    console.log(`  ✅ Distribuidores:    ${stats.distribuidores} registros`);
    console.log(`  ✅ Productos:         ${stats.productos} registros`);
    console.log(`  ✅ Ventas:            ${stats.ventas} registros`);
    console.log(`  ✅ Órdenes Compra:    ${stats.ordenesCompra} registros`);
    console.log(`  ✅ Inventario:        ${stats.inventario} movimientos`);
    console.log(`  ✅ Movimientos:       ${stats.movimientos} registros`);
    console.log('\n');
    console.log(`⏱️  Tiempo total: ${duration} segundos`);
    console.log('\n🎉 Todos los datos han sido migrados exitosamente a Firestore!');
    console.log('\n');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ ERROR EN LA MIGRACIÓN:', error);
    console.error(error.stack);
    process.exit(1);
  }
}

// Ejecutar migración
main();
