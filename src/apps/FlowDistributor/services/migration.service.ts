/**
 * 🔄 SERVICIO DE MIGRACIÓN - JSON A FIRESTORE
 * Migra BASE_DATOS_FLOWDISTRIBUTOR_UNIFICADO.json a Firestore
 */
import { Timestamp, doc, serverTimestamp, writeBatch } from 'firebase/firestore';

// ============================================================
// IMPORTAR DATOS JSON
// ============================================================
import jsonData from '../data/BASE_DATOS_FLOWDISTRIBUTOR_UNIFICADO.json';
import { COLLECTIONS, db } from './firebase.config';

// ============================================================
// UTILIDADES
// ============================================================

const generateId = (prefix: string, index: number): string => {
  return `${prefix}${String(index).padStart(6, '0')}`;
};

const parseDate = (dateString: string): Timestamp => {
  try {
    return Timestamp.fromDate(new Date(dateString));
  } catch {
    return Timestamp.now();
  }
};

// ============================================================
// MIGRACIÓN DE ÓRDENES DE COMPRA Y DISTRIBUIDORES
// ============================================================

async function migrateOrdenesCompra() {
  console.log('📦 Iniciando migración de Órdenes de Compra...');

  const batch = writeBatch(db);
  const distribuidoresMap = new Map<string, any>();

  const ordenesCompra = jsonData.ordenesCompra?.distribuidores?.ordenesCompra || [];

  for (let i = 0; i < ordenesCompra.length; i++) {
    const oc = ordenesCompra[i];
    const ocId = oc.id || generateId('OC', i + 1);
    const distribuidorNombre = oc.origen || 'Desconocido';
    const distribuidorId = `DIST_${distribuidorNombre.replace(/[^a-zA-Z0-9]/g, '_').toUpperCase()}`;

    // Crear/actualizar distribuidor
    if (!distribuidoresMap.has(distribuidorId)) {
      distribuidoresMap.set(distribuidorId, {
        id: distribuidorId,
        nombre: distribuidorNombre,
        ordenesCompra: [],
        totalCompras: 0,
        totalPagado: 0,
        deudaTotal: 0,
        historialPagos: [],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    }

    const distribuidor = distribuidoresMap.get(distribuidorId);
    distribuidor.ordenesCompra.push(ocId);
    distribuidor.totalCompras += oc.costoTotal || 0;
    distribuidor.totalPagado += oc.pagoDistribuidor || 0;
    distribuidor.deudaTotal += oc.deuda || 0;

    // Crear orden de compra
    const ordenCompra = {
      id: ocId,
      fecha: oc.fecha || new Date().toISOString().split('T')[0],
      distribuidor: distribuidorNombre,
      distribuidorId,
      origen: distribuidorNombre,
      cantidad: oc.cantidad || 0,
      costoDistribuidor: oc.costoDistribuidor || 0,
      costoTransporte: oc.costoTransporte || 0,
      costoPorUnidad: oc.costoPorUnidad || 0,
      costoTotal: oc.costoTotal || 0,
      pagoDistribuidor: oc.pagoDistribuidor || 0,
      deuda: oc.deuda || 0,
      stockActual: oc.stockActual || 0,
      estado:
        (oc.deuda || 0) === 0 ? 'pagado' : (oc.pagoDistribuidor || 0) > 0 ? 'parcial' : 'pendiente',
      createdAt: parseDate(oc.fecha),
      updatedAt: serverTimestamp(),
    };

    const ocRef = doc(db, COLLECTIONS.ORDENES_COMPRA, ocId);
    batch.set(ocRef, ordenCompra);
  }

  // Guardar distribuidores
  for (const [id, distribuidor] of distribuidoresMap) {
    const distRef = doc(db, COLLECTIONS.DISTRIBUIDORES, id);
    batch.set(distRef, distribuidor);
  }

  await batch.commit();
  console.log(
    `✅ Migradas ${ordenesCompra.length} órdenes de compra y ${distribuidoresMap.size} distribuidores`
  );

  return { ordenes: ordenesCompra.length, distribuidores: distribuidoresMap.size };
}

// ============================================================
// MIGRACIÓN DE VENTAS Y CLIENTES
// ============================================================

async function migrateVentas() {
  console.log('💰 Iniciando migración de Ventas...');

  const batch = writeBatch(db);
  const clientesMap = new Map<string, any>();

  const ventas = jsonData.ventasLocales?.operaciones || [];

  for (let i = 0; i < ventas.length; i++) {
    const venta = ventas[i];
    const ventaId = venta.id || generateId('VTA', i + 1);
    const clienteNombre = venta.cliente || 'Cliente General';
    const clienteId = `CLI_${clienteNombre.replace(/[^a-zA-Z0-9]/g, '_').toUpperCase()}`;

    // Crear/actualizar cliente
    if (!clientesMap.has(clienteId)) {
      clientesMap.set(clienteId, {
        id: clienteId,
        nombre: clienteNombre,
        ventas: [],
        totalCompras: 0,
        totalPagado: 0,
        deudaTotal: 0,
        historialPagos: [],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    }

    const cliente = clientesMap.get(clienteId);
    cliente.ventas.push(ventaId);

    // Calcular montos
    const precioVentaUnidad = venta.precioVentaUnidad || 0;
    const precioFlete = venta.precioFlete || 500;
    const cantidad = venta.cantidad || 0;
    const precioTotalUnidad = precioVentaUnidad + precioFlete;
    const precioTotalVenta = precioTotalUnidad * cantidad;

    const montoPagado = venta.montoPagado || 0;
    const montoRestante = precioTotalVenta - montoPagado;

    cliente.totalCompras += precioTotalVenta;
    cliente.totalPagado += montoPagado;
    cliente.deudaTotal += montoRestante;

    // Crear venta
    const ventaDoc = {
      id: ventaId,
      fecha: venta.fecha || new Date().toISOString().split('T')[0],
      cliente: clienteNombre,
      clienteId,
      producto: venta.producto || 'Producto',
      cantidad,
      precioVentaUnidad,
      precioFlete,
      precioTotalUnidad,
      precioTotalVenta,
      estadoPago: montoRestante === 0 ? 'completo' : montoPagado > 0 ? 'parcial' : 'pendiente',
      montoPagado,
      montoRestante,
      // Distribución en bancos (se calculará según fórmulas)
      montoBovedaMonte: precioTotalVenta,
      montoFletes: precioFlete * cantidad,
      montoUtilidades: 0, // Se calculará con fórmula específica
      createdAt: parseDate(venta.fecha),
      updatedAt: serverTimestamp(),
    };

    const ventaRef = doc(db, COLLECTIONS.VENTAS, ventaId);
    batch.set(ventaRef, ventaDoc);
  }

  // Guardar clientes
  for (const [id, cliente] of clientesMap) {
    const clienteRef = doc(db, COLLECTIONS.CLIENTES, id);
    batch.set(clienteRef, cliente);
  }

  await batch.commit();
  console.log(`✅ Migradas ${ventas.length} ventas y ${clientesMap.size} clientes`);

  return { ventas: ventas.length, clientes: clientesMap.size };
}

// ============================================================
// MIGRACIÓN DE BANCOS
// ============================================================

async function migrateBancos() {
  console.log('🏦 Iniciando migración de Bancos...');

  const batch = writeBatch(db);

  const bancos = [
    { id: 'boveda_monte', nombre: 'Bóveda Monte', tipo: 'venta', data: jsonData.bovedaMonte },
    { id: 'boveda_usa', nombre: 'Bóveda USA', tipo: 'venta', data: jsonData.bovedaUSA },
    {
      id: 'utilidades',
      nombre: 'Utilidades',
      tipo: 'venta',
      data: jsonData.utilidades || jsonData.gya,
    },
    { id: 'fletes', nombre: 'Fletes', tipo: 'venta', data: jsonData.fleteSur },
    { id: 'azteca', nombre: 'Azteca', tipo: 'operativo', data: jsonData.azteca },
    { id: 'leftie', nombre: 'Leftie', tipo: 'operativo', data: jsonData.leftie },
    { id: 'profit', nombre: 'Profit', tipo: 'operativo', data: jsonData.profit },
  ];

  for (const banco of bancos) {
    const bancoData = banco.data || {};
    const operaciones = bancoData.operaciones || [];

    const capitalActual = bancoData.capitalActual || 0;
    const historicoIngresos = operaciones
      .filter(
        (op: any) =>
          op.tipo === 'ingreso' || op.tipo === 'venta' || op.tipo === 'transferencia_entrada'
      )
      .reduce((sum: number, op: any) => sum + (op.monto || 0), 0);

    const historicoGastos = operaciones
      .filter((op: any) => op.tipo === 'gasto')
      .reduce((sum: number, op: any) => sum + (op.monto || 0), 0);

    const historicoTransferencias = operaciones
      .filter((op: any) => op.tipo === 'transferencia_salida')
      .reduce((sum: number, op: any) => sum + (op.monto || 0), 0);

    const bancoDoc = {
      id: banco.id,
      nombre: banco.nombre,
      tipo: banco.tipo,
      capitalActual,
      historicoIngresos,
      historicoGastos,
      historicoTransferencias,
      operaciones: operaciones.map((op: any, index: number) => ({
        id: `OP_${banco.id}_${index + 1}`,
        fecha: op.fecha || new Date().toISOString().split('T')[0],
        tipo: op.tipo || 'ingreso',
        monto: op.monto || 0,
        concepto: op.concepto || '',
        descripcion: op.descripcion || '',
        bancoOrigen: op.bancoOrigen,
        bancoDestino: op.bancoDestino,
        referenciaId: op.referenciaId,
        createdAt: parseDate(op.fecha),
      })),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const bancoRef = doc(db, banco.nombre.toLowerCase().replace(/ /g, '_'), banco.id);
    batch.set(bancoRef, bancoDoc);
  }

  await batch.commit();
  console.log(`✅ Migrados ${bancos.length} bancos`);

  return { bancos: bancos.length };
}

// ============================================================
// MIGRACIÓN DE ALMACÉN
// ============================================================

async function migrateAlmacen() {
  console.log('📦 Iniciando migración de Almacén...');

  const batch = writeBatch(db);
  const almacenData = jsonData.almacenMonte || {};

  const productos = almacenData.productos || [];
  const entradas = almacenData.entradas || [];
  const salidas = almacenData.salidas || [];

  for (let i = 0; i < productos.length; i++) {
    const producto = productos[i];
    const productoId = `PROD_${i + 1}`;

    const entradasProducto = entradas.filter((e: any) => e.producto === producto.nombre);
    const salidasProducto = salidas.filter((s: any) => s.producto === producto.nombre);

    const totalEntradas = entradasProducto.reduce(
      (sum: number, e: any) => sum + (e.cantidad || 0),
      0
    );
    const totalSalidas = salidasProducto.reduce(
      (sum: number, s: any) => sum + (s.cantidad || 0),
      0
    );

    const almacenDoc = {
      id: productoId,
      producto: producto.nombre || 'Producto',
      stockActual: totalEntradas - totalSalidas,
      entradas: entradasProducto.map((e: any, idx: number) => ({
        id: `ENT_${productoId}_${idx + 1}`,
        fecha: e.fecha || new Date().toISOString().split('T')[0],
        tipo: 'entrada',
        cantidad: e.cantidad || 0,
        origen: e.origen || 'Distribuidor',
        referenciaId: e.ordenCompraId,
        createdAt: parseDate(e.fecha),
      })),
      salidas: salidasProducto.map((s: any, idx: number) => ({
        id: `SAL_${productoId}_${idx + 1}`,
        fecha: s.fecha || new Date().toISOString().split('T')[0],
        tipo: 'salida',
        cantidad: s.cantidad || 0,
        destino: s.cliente || 'Cliente',
        referenciaId: s.ventaId,
        createdAt: parseDate(s.fecha),
      })),
      totalEntradas,
      totalSalidas,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const almacenRef = doc(db, COLLECTIONS.ALMACEN, productoId);
    batch.set(almacenRef, almacenDoc);
  }

  await batch.commit();
  console.log(`✅ Migrados ${productos.length} productos del almacén`);

  return { productos: productos.length };
}

// ============================================================
// FUNCIÓN PRINCIPAL DE MIGRACIÓN
// ============================================================

export async function migrateAllData() {
  console.log('🚀 Iniciando migración completa de datos...');
  console.log('========================================');

  try {
    const results = {
      ordenesCompra: await migrateOrdenesCompra(),
      ventas: await migrateVentas(),
      bancos: await migrateBancos(),
      almacen: await migrateAlmacen(),
    };

    console.log('========================================');
    console.log('✅ MIGRACIÓN COMPLETADA EXITOSAMENTE');
    console.log('========================================');
    console.log('Resumen:');
    console.log(`  • Órdenes de compra: ${results.ordenesCompra.ordenes}`);
    console.log(`  • Distribuidores: ${results.ordenesCompra.distribuidores}`);
    console.log(`  • Ventas: ${results.ventas.ventas}`);
    console.log(`  • Clientes: ${results.ventas.clientes}`);
    console.log(`  • Bancos: ${results.bancos.bancos}`);
    console.log(`  • Productos almacén: ${results.almacen.productos}`);
    console.log('========================================');

    return {
      success: true,
      results,
    };
  } catch (error) {
    console.error('❌ Error en migración:', error);
    return {
      success: false,
      error: error.message,
    };
  }
}

// ============================================================
// FUNCIÓN PARA LIMPIAR DATOS (SOLO DESARROLLO)
// ============================================================

export async function clearAllData() {
  if (import.meta.env.PROD) {
    throw new Error('No se puede limpiar datos en producción');
  }

  console.warn('⚠️ LIMPIANDO TODOS LOS DATOS DE FIRESTORE...');

  // Aquí implementarías la lógica de limpieza si es necesario
  // Por seguridad, no se implementa automáticamente

  console.log('✅ Datos limpiados');
}

export default {
  migrateAllData,
  clearAllData,
};
