/**
 * 🎯 SERVICIO FIRESTORE - LÓGICA COMPLETA DEL NEGOCIO
 * Implementa TODAS las operaciones del sistema FlowDistributor
 */
import {
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  increment,
  onSnapshot,
  orderBy,
  query,
  runTransaction,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';

import type {
  Almacen,
  Banco,
  Cliente,
  Distribuidor,
  Movimiento,
  Operacion,
  OrdenCompra,
  PagoCliente,
  PagoDistribuidor,
  Venta,
} from './firebase.config';
import { COLLECTIONS, db } from './firebase.config';

// ============================================================
// 📦 ÓRDENES DE COMPRA
// ============================================================

/**
 * Crear nueva Orden de Compra
 * - Crea/actualiza perfil del distribuidor
 * - Registra la deuda
 * - Actualiza almacén (entrada de productos)
 */
export async function crearOrdenCompra(data: Partial<OrdenCompra>) {
  return runTransaction(db, async (transaction) => {
    // 1. Generar IDs
    const ocId = `OC${Date.now()}`;
    const distribuidorId = `DIST_${data.origen?.replace(/[^a-zA-Z0-9]/g, '_').toUpperCase()}`;

    // 2. Calcular costos
    const cantidad = data.cantidad || 0;
    const costoDistribuidor = data.costoDistribuidor || 0;
    const costoTransporte = data.costoTransporte || 0;
    const costoPorUnidad = costoDistribuidor + costoTransporte;
    const costoTotal = costoPorUnidad * cantidad;

    // 3. Crear Orden de Compra
    const ordenCompra: OrdenCompra = {
      id: ocId,
      fecha: new Date().toISOString().split('T')[0],
      distribuidor: data.origen || '',
      distribuidorId,
      origen: data.origen || '',
      cantidad,
      costoDistribuidor,
      costoTransporte,
      costoPorUnidad,
      costoTotal,
      pagoDistribuidor: 0,
      deuda: costoTotal,
      stockActual: cantidad,
      estado: 'pendiente',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const ocRef = doc(db, COLLECTIONS.ORDENES_COMPRA, ocId);
    transaction.set(ocRef, ordenCompra);

    // 4. Crear o Actualizar Distribuidor
    const distRef = doc(db, COLLECTIONS.DISTRIBUIDORES, distribuidorId);
    const distSnap = await transaction.get(distRef);

    if (distSnap.exists()) {
      // Actualizar distribuidor existente
      transaction.update(distRef, {
        ordenesCompra: arrayUnion(ocId),
        totalCompras: increment(costoTotal),
        deudaTotal: increment(costoTotal),
        updatedAt: serverTimestamp(),
      });
    } else {
      // Crear nuevo distribuidor
      const nuevoDistribuidor: Distribuidor = {
        id: distribuidorId,
        nombre: data.origen || '',
        ordenesCompra: [ocId],
        totalCompras: costoTotal,
        totalPagado: 0,
        deudaTotal: costoTotal,
        historialPagos: [],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };
      transaction.set(distRef, nuevoDistribuidor);
    }

    // 5. Actualizar Almacén (Entrada de productos)
    const productoId = `PROD_${data.origen || 'DEFAULT'}`;
    const almacenRef = doc(db, COLLECTIONS.ALMACEN, productoId);
    const almacenSnap = await transaction.get(almacenRef);

    const movimiento: Movimiento = {
      id: `ENT_${ocId}`,
      fecha: new Date().toISOString().split('T')[0],
      tipo: 'entrada',
      cantidad,
      origen: data.origen,
      referenciaId: ocId,
      createdAt: serverTimestamp(),
    };

    if (almacenSnap.exists()) {
      transaction.update(almacenRef, {
        stockActual: increment(cantidad),
        entradas: arrayUnion(movimiento),
        totalEntradas: increment(cantidad),
        updatedAt: serverTimestamp(),
      });
    } else {
      const nuevoAlmacen: Almacen = {
        id: productoId,
        producto: data.origen || 'Producto',
        stockActual: cantidad,
        entradas: [movimiento],
        salidas: [],
        totalEntradas: cantidad,
        totalSalidas: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };
      transaction.set(almacenRef, nuevoAlmacen);
    }

    return {
      success: true,
      ordenCompraId: ocId,
      distribuidorId,
      message: 'Orden de compra creada exitosamente',
    };
  });
}

/**
 * Abonar o saldar deuda con distribuidor
 * - Actualiza el pago en la orden de compra
 * - Registra el pago en historial del distribuidor
 * - Resta capital del banco seleccionado
 * - Registra gasto en el banco
 */
export async function pagarDistribuidor(
  ordenCompraId: string,
  distribuidorId: string,
  monto: number,
  bancoOrigen: string,
  tipo: 'abono' | 'saldo_completo'
) {
  // ✅ VALIDACIONES CRÍTICAS
  if (!ordenCompraId || ordenCompraId.trim() === '') {
    throw new Error('ID de orden de compra es obligatorio');
  }

  if (!distribuidorId || distribuidorId.trim() === '') {
    throw new Error('ID de distribuidor es obligatorio');
  }

  if (monto <= 0) {
    throw new Error('El monto debe ser mayor a 0');
  }

  if (!bancoOrigen || bancoOrigen.trim() === '') {
    throw new Error('Debe especificar el banco de origen');
  }

  return runTransaction(db, async (transaction) => {
    // 1. Obtener orden de compra
    const ocRef = doc(db, COLLECTIONS.ORDENES_COMPRA, ordenCompraId);
    const ocSnap = await transaction.get(ocRef);

    if (!ocSnap.exists()) {
      throw new Error('Orden de compra no encontrada');
    }

    const oc = ocSnap.data() as OrdenCompra;

    // 2. Validar monto
    if (monto > oc.deuda) {
      throw new Error(`El monto ($${monto}) no puede ser mayor a la deuda ($${oc.deuda})`);
    }

    // ✅ VALIDACIÓN CRÍTICA: Verificar capital suficiente en el banco
    const bancoRef = doc(db, bancoOrigen, bancoOrigen);
    const bancoSnap = await transaction.get(bancoRef);

    if (!bancoSnap.exists()) {
      throw new Error(`El banco "${bancoOrigen}" no existe`);
    }

    const bancoData = bancoSnap.data() as Banco;
    const capitalActual = bancoData.capitalActual || 0;

    if (capitalActual < monto) {
      throw new Error(
        `Capital insuficiente en ${bancoOrigen}. Disponible: $${capitalActual.toFixed(2)}, Requerido: $${monto.toFixed(2)}`
      );
    }

    // 3. Actualizar orden de compra
    const nuevoPago = oc.pagoDistribuidor + monto;
    const nuevaDeuda = oc.deuda - monto;
    const nuevoEstado = nuevaDeuda === 0 ? 'pagado' : 'parcial';

    transaction.update(ocRef, {
      pagoDistribuidor: nuevoPago,
      deuda: nuevaDeuda,
      estado: nuevoEstado,
      updatedAt: serverTimestamp(),
    });

    // 4. Actualizar distribuidor
    const distRef = doc(db, COLLECTIONS.DISTRIBUIDORES, distribuidorId);
    const pago: PagoDistribuidor = {
      id: `PAGO_${Date.now()}`,
      fecha: new Date().toISOString().split('T')[0],
      monto,
      bancoOrigen,
      ordenCompraId,
      tipo,
      createdAt: serverTimestamp(),
    };

    transaction.update(distRef, {
      totalPagado: increment(monto),
      deudaTotal: increment(-monto),
      historialPagos: arrayUnion(pago),
      updatedAt: serverTimestamp(),
    });

    // 5. Actualizar banco origen (restar capital y registrar gasto)
    const bancoRef = doc(db, bancoOrigen, bancoOrigen);
    const operacion: Operacion = {
      id: `OP_${Date.now()}`,
      fecha: new Date().toISOString().split('T')[0],
      tipo: 'pago_distribuidor',
      monto,
      concepto: `Pago a distribuidor ${distribuidorId}`,
      descripcion: `Pago OC: ${ordenCompraId}`,
      referenciaId: ordenCompraId,
      createdAt: serverTimestamp(),
    };

    transaction.update(bancoRef, {
      capitalActual: increment(-monto),
      historicoGastos: increment(monto),
      operaciones: arrayUnion(operacion),
      updatedAt: serverTimestamp(),
    });

    return {
      success: true,
      message: 'Pago registrado exitosamente',
      nuevaDeuda,
      nuevoEstado,
    };
  });
}

// ============================================================
// 💰 VENTAS
// ============================================================

/**
 * Registrar nueva Venta
 * - Crea/actualiza perfil del cliente
 * - Actualiza 3 bancos: Bóveda Monte, Fletes, Utilidades
 * - Actualiza almacén (salida de productos)
 * - Todo según estado de pago
 *
 * LÓGICA CORRECTA DE DISTRIBUCIÓN:
 * - Bóveda Monte = Precio Venta por Unidad × Cantidad
 * - Fletes = Flete por Unidad × Cantidad
 * - Utilidades = (Precio Venta - Precio Compra - Flete) × Cantidad
 */
export async function registrarVenta(data: {
  cliente: string;
  producto: string;
  cantidad: number;
  precioVentaUnidad: number; // Precio al que VENDEMOS
  precioCompraUnidad: number; // Precio al que COMPRAMOS (costo distribuidor)
  precioFlete?: number;
  estadoPago: 'completo' | 'parcial' | 'pendiente';
  montoPagado?: number;
}) {
  // ✅ VALIDACIONES CRÍTICAS ANTES DE PROCESAR
  if (!data.cliente || data.cliente.trim() === '') {
    throw new Error('El nombre del cliente es obligatorio');
  }

  if (!data.producto || data.producto.trim() === '') {
    throw new Error('El nombre del producto es obligatorio');
  }

  if (data.cantidad <= 0) {
    throw new Error('La cantidad debe ser mayor a 0');
  }

  if (data.precioVentaUnidad <= 0) {
    throw new Error('El precio de venta debe ser mayor a 0');
  }

  if (data.precioCompraUnidad < 0) {
    throw new Error('El precio de compra no puede ser negativo');
  }

  if (!data.precioCompraUnidad) {
    throw new Error('El producto debe tener un precio de compra registrado');
  }

  if (data.estadoPago === 'parcial' && (!data.montoPagado || data.montoPagado <= 0)) {
    throw new Error('Para pago parcial debe especificar un monto pagado válido');
  }

  return runTransaction(db, async (transaction) => {
    // 1. Generar IDs
    const ventaId = `VTA${Date.now()}`;
    const clienteId = `CLI_${data.cliente.replace(/[^a-zA-Z0-9]/g, '_').toUpperCase()}`;

    // ✅ VALIDACIÓN CRÍTICA: Verificar stock disponible en almacén
    const almacenRef = doc(db, COLLECTIONS.ALMACEN, 'almacen');
    const almacenSnap = await transaction.get(almacenRef);

    if (almacenSnap.exists()) {
      const almacenData = almacenSnap.data() as Almacen;
      const productoAlmacen = almacenData.productos?.find(
        (p) => p.nombre.toLowerCase() === data.producto.toLowerCase()
      );

      if (!productoAlmacen) {
        throw new Error(`El producto "${data.producto}" no existe en el almacén`);
      }

      if (productoAlmacen.stockActual < data.cantidad) {
        throw new Error(
          `Stock insuficiente. Disponible: ${productoAlmacen.stockActual}, Solicitado: ${data.cantidad}`
        );
      }
    } else {
      throw new Error('No se pudo acceder al almacén para verificar stock');
    }

    // 2. Calcular montos
    const cantidad = data.cantidad;
    const precioVentaUnidad = data.precioVentaUnidad;
    const precioCompraUnidad = data.precioCompraUnidad;
    const precioFlete = data.precioFlete || 500;
    const precioTotalUnidad = precioVentaUnidad + precioFlete;
    const precioTotalVenta = precioTotalUnidad * cantidad;

    const montoPagado =
      data.estadoPago === 'completo'
        ? precioTotalVenta
        : data.estadoPago === 'parcial'
          ? data.montoPagado || 0
          : 0;
    const montoRestante = precioTotalVenta - montoPagado;

    // ✅ DISTRIBUCIÓN EN BANCOS - LÓGICA CORRECTA
    // Bóveda Monte = Precio de Venta por Unidad × Cantidad
    const montoBovedaMonte = precioVentaUnidad * cantidad;

    // Fletes = Flete por Unidad × Cantidad
    const montoFletes = precioFlete * cantidad;

    // Utilidades = (Precio Venta - Precio Compra - Flete) × Cantidad
    const montoUtilidades = (precioVentaUnidad - precioCompraUnidad - precioFlete) * cantidad;

    // 3. Crear Venta
    const venta: Venta = {
      id: ventaId,
      fecha: new Date().toISOString().split('T')[0],
      cliente: data.cliente,
      clienteId,
      producto: data.producto,
      cantidad,
      precioVentaUnidad,
      precioCompraUnidad, // ✅ NUEVO CAMPO
      precioFlete,
      precioTotalUnidad,
      precioTotalVenta,
      estadoPago: data.estadoPago,
      montoPagado,
      montoRestante,
      montoBovedaMonte,
      montoFletes,
      montoUtilidades,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const ventaRef = doc(db, COLLECTIONS.VENTAS, ventaId);
    transaction.set(ventaRef, venta);

    // 4. Crear o Actualizar Cliente
    const clienteRef = doc(db, COLLECTIONS.CLIENTES, clienteId);
    const clienteSnap = await transaction.get(clienteRef);

    if (clienteSnap.exists()) {
      transaction.update(clienteRef, {
        ventas: arrayUnion(ventaId),
        totalCompras: increment(precioTotalVenta),
        totalPagado: increment(montoPagado),
        deudaTotal: increment(montoRestante),
        updatedAt: serverTimestamp(),
      });
    } else {
      const nuevoCliente: Cliente = {
        id: clienteId,
        nombre: data.cliente,
        ventas: [ventaId],
        totalCompras: precioTotalVenta,
        totalPagado: montoPagado,
        deudaTotal: montoRestante,
        historialPagos: [],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };
      transaction.set(clienteRef, nuevoCliente);
    }

    // 5. Actualizar Bóveda Monte
    const bovedaMonteRef = doc(db, COLLECTIONS.BOVEDA_MONTE, 'boveda_monte');
    const opBovedaMonte: Operacion = {
      id: `OP_${Date.now()}_BM`,
      fecha: new Date().toISOString().split('T')[0],
      tipo: 'venta',
      monto: data.estadoPago === 'completo' ? montoBovedaMonte : montoPagado,
      concepto: `Venta a ${data.cliente}`,
      descripcion: `Estado: ${data.estadoPago}`,
      referenciaId: ventaId,
      createdAt: serverTimestamp(),
    };

    transaction.update(bovedaMonteRef, {
      historicoIngresos: increment(montoBovedaMonte),
      capitalActual: increment(data.estadoPago === 'completo' ? montoBovedaMonte : montoPagado),
      operaciones: arrayUnion(opBovedaMonte),
      updatedAt: serverTimestamp(),
    });

    // 6. Actualizar Fletes
    const fletesRef = doc(db, COLLECTIONS.FLETES, 'fletes');
    const opFletes: Operacion = {
      id: `OP_${Date.now()}_FL`,
      fecha: new Date().toISOString().split('T')[0],
      tipo: 'venta',
      monto:
        data.estadoPago === 'completo'
          ? montoFletes
          : (montoPagado * montoFletes) / precioTotalVenta,
      concepto: `Flete venta ${data.cliente}`,
      descripcion: `Estado: ${data.estadoPago}`,
      referenciaId: ventaId,
      createdAt: serverTimestamp(),
    };

    transaction.update(fletesRef, {
      historicoIngresos: increment(montoFletes),
      capitalActual: increment(
        data.estadoPago === 'completo'
          ? montoFletes
          : (montoPagado * montoFletes) / precioTotalVenta
      ),
      operaciones: arrayUnion(opFletes),
      updatedAt: serverTimestamp(),
    });

    // 7. Actualizar Utilidades
    const utilidadesRef = doc(db, COLLECTIONS.UTILIDADES, 'utilidades');
    const opUtilidades: Operacion = {
      id: `OP_${Date.now()}_UT`,
      fecha: new Date().toISOString().split('T')[0],
      tipo: 'venta',
      monto:
        data.estadoPago === 'completo'
          ? montoUtilidades
          : (montoPagado * montoUtilidades) / precioTotalVenta,
      concepto: `Utilidad venta ${data.cliente}`,
      descripcion: `Estado: ${data.estadoPago}`,
      referenciaId: ventaId,
      createdAt: serverTimestamp(),
    };

    transaction.update(utilidadesRef, {
      historicoIngresos: increment(montoUtilidades),
      capitalActual: increment(
        data.estadoPago === 'completo'
          ? montoUtilidades
          : (montoPagado * montoUtilidades) / precioTotalVenta
      ),
      operaciones: arrayUnion(opUtilidades),
      updatedAt: serverTimestamp(),
    });

    // 8. Actualizar Almacén (Salida de productos)
    const productoId = `PROD_${data.producto}`;
    const almacenRef = doc(db, COLLECTIONS.ALMACEN, productoId);
    const movimiento: Movimiento = {
      id: `SAL_${ventaId}`,
      fecha: new Date().toISOString().split('T')[0],
      tipo: 'salida',
      cantidad,
      destino: data.cliente,
      referenciaId: ventaId,
      createdAt: serverTimestamp(),
    };

    transaction.update(almacenRef, {
      stockActual: increment(-cantidad),
      salidas: arrayUnion(movimiento),
      totalSalidas: increment(cantidad),
      updatedAt: serverTimestamp(),
    });

    return {
      success: true,
      ventaId,
      clienteId,
      message: 'Venta registrada exitosamente',
    };
  });
}

/**
 * Abonar o saldar deuda del cliente
 */
export async function pagarCliente(
  ventaId: string,
  clienteId: string,
  monto: number,
  tipo: 'abono' | 'saldo_completo'
) {
  // ✅ VALIDACIONES CRÍTICAS
  if (!ventaId || ventaId.trim() === '') {
    throw new Error('ID de venta es obligatorio');
  }

  if (!clienteId || clienteId.trim() === '') {
    throw new Error('ID de cliente es obligatorio');
  }

  if (monto <= 0) {
    throw new Error('El monto del pago debe ser mayor a 0');
  }

  if (!tipo || (tipo !== 'abono' && tipo !== 'saldo_completo')) {
    throw new Error('Tipo de pago inválido. Debe ser "abono" o "saldo_completo"');
  }

  return runTransaction(db, async (transaction) => {
    // 1. Obtener venta
    const ventaRef = doc(db, COLLECTIONS.VENTAS, ventaId);
    const ventaSnap = await transaction.get(ventaRef);

    if (!ventaSnap.exists()) {
      throw new Error(`La venta "${ventaId}" no existe`);
    }

    const venta = ventaSnap.data() as Venta;

    // 2. Validar monto con mensaje detallado
    if (monto > venta.montoRestante) {
      throw new Error(
        `El monto ($${monto}) no puede ser mayor a la deuda pendiente ($${venta.montoRestante})`
      );
    }

    // 3. Actualizar venta
    const nuevoMontoPagado = venta.montoPagado + monto;
    const nuevoMontoRestante = venta.montoRestante - monto;
    const nuevoEstado = nuevoMontoRestante === 0 ? 'completo' : 'parcial';

    transaction.update(ventaRef, {
      montoPagado: nuevoMontoPagado,
      montoRestante: nuevoMontoRestante,
      estadoPago: nuevoEstado,
      updatedAt: serverTimestamp(),
    });

    // 4. Actualizar cliente
    const clienteRef = doc(db, COLLECTIONS.CLIENTES, clienteId);
    const pago: PagoCliente = {
      id: `PAGO_${Date.now()}`,
      fecha: new Date().toISOString().split('T')[0],
      monto,
      ventaId,
      tipo,
      createdAt: serverTimestamp(),
    };

    transaction.update(clienteRef, {
      totalPagado: increment(monto),
      deudaTotal: increment(-monto),
      historialPagos: arrayUnion(pago),
      updatedAt: serverTimestamp(),
    });

    // 5. Actualizar los 3 bancos proporcionalmente
    const proporcionPago = monto / venta.precioTotalVenta;

    // Bóveda Monte
    const montoBovedaMonte = venta.montoBovedaMonte * proporcionPago;
    const bovedaMonteRef = doc(db, COLLECTIONS.BOVEDA_MONTE, 'boveda_monte');
    transaction.update(bovedaMonteRef, {
      capitalActual: increment(montoBovedaMonte),
      updatedAt: serverTimestamp(),
    });

    // Fletes
    const montoFletes = venta.montoFletes * proporcionPago;
    const fletesRef = doc(db, COLLECTIONS.FLETES, 'fletes');
    transaction.update(fletesRef, {
      capitalActual: increment(montoFletes),
      updatedAt: serverTimestamp(),
    });

    // Utilidades
    const montoUtilidades = venta.montoUtilidades * proporcionPago;
    const utilidadesRef = doc(db, COLLECTIONS.UTILIDADES, 'utilidades');
    transaction.update(utilidadesRef, {
      capitalActual: increment(montoUtilidades),
      updatedAt: serverTimestamp(),
    });

    return {
      success: true,
      message: 'Pago de cliente registrado exitosamente',
      nuevoMontoRestante,
      nuevoEstado,
    };
  });
}

// ============================================================
// 🏦 OPERACIONES BANCARIAS
// ============================================================

/**
 * Registrar transferencia entre bancos
 */
export async function transferirEntreBancos(
  bancoOrigenId: string,
  bancoDestinoId: string,
  monto: number,
  concepto: string,
  descripcion?: string
) {
  // ✅ VALIDACIONES CRÍTICAS
  if (!bancoOrigenId || bancoOrigenId.trim() === '') {
    throw new Error('Debe especificar el banco de origen');
  }

  if (!bancoDestinoId || bancoDestinoId.trim() === '') {
    throw new Error('Debe especificar el banco de destino');
  }

  if (bancoOrigenId === bancoDestinoId) {
    throw new Error('El banco de origen y destino no pueden ser el mismo');
  }

  if (monto <= 0) {
    throw new Error('El monto debe ser mayor a 0');
  }

  if (!concepto || concepto.trim() === '') {
    throw new Error('El concepto de la transferencia es obligatorio');
  }

  return runTransaction(db, async (transaction) => {
    // 1. Validar bancos
    const bancoOrigenRef = doc(db, bancoOrigenId, bancoOrigenId);
    const bancoDestinoRef = doc(db, bancoDestinoId, bancoDestinoId);

    const origenSnap = await transaction.get(bancoOrigenRef);
    const destinoSnap = await transaction.get(bancoDestinoRef);

    if (!origenSnap.exists()) {
      throw new Error(`El banco de origen "${bancoOrigenId}" no existe`);
    }

    if (!destinoSnap.exists()) {
      throw new Error(`El banco de destino "${bancoDestinoId}" no existe`);
    }

    const bancoOrigen = origenSnap.data() as Banco;

    // 2. Validar capital suficiente
    if (bancoOrigen.capitalActual < monto) {
      throw new Error(
        `Capital insuficiente en ${bancoOrigenId}. Disponible: $${bancoOrigen.capitalActual.toFixed(2)}, Requerido: $${monto.toFixed(2)}`
      );
    }

    // 3. Registrar salida en banco origen
    const opSalida: Operacion = {
      id: `TRANS_${Date.now()}_OUT`,
      fecha: new Date().toISOString().split('T')[0],
      tipo: 'transferencia_salida',
      monto,
      concepto,
      descripcion,
      bancoDestino: bancoDestinoId,
      createdAt: serverTimestamp(),
    };

    transaction.update(bancoOrigenRef, {
      capitalActual: increment(-monto),
      historicoTransferencias: increment(monto),
      operaciones: arrayUnion(opSalida),
      updatedAt: serverTimestamp(),
    });

    // 4. Registrar entrada en banco destino
    const opEntrada: Operacion = {
      id: `TRANS_${Date.now()}_IN`,
      fecha: new Date().toISOString().split('T')[0],
      tipo: 'transferencia_entrada',
      monto,
      concepto,
      descripcion,
      bancoOrigen: bancoOrigenId,
      createdAt: serverTimestamp(),
    };

    transaction.update(bancoDestinoRef, {
      capitalActual: increment(monto),
      historicoIngresos: increment(monto),
      operaciones: arrayUnion(opEntrada),
      updatedAt: serverTimestamp(),
    });

    return {
      success: true,
      message: 'Transferencia realizada exitosamente',
    };
  });
}

/**
 * Registrar gasto de un banco
 */
export async function registrarGasto(
  bancoId: string,
  monto: number,
  concepto: string,
  descripcion?: string
) {
  // ✅ VALIDACIONES CRÍTICAS
  if (!bancoId || bancoId.trim() === '') {
    throw new Error('Debe especificar el banco');
  }

  if (monto <= 0) {
    throw new Error('El monto del gasto debe ser mayor a 0');
  }

  if (!concepto || concepto.trim() === '') {
    throw new Error('El concepto del gasto es obligatorio');
  }

  return runTransaction(db, async (transaction) => {
    const bancoRef = doc(db, bancoId, bancoId);
    const bancoSnap = await transaction.get(bancoRef);

    if (!bancoSnap.exists()) {
      throw new Error(`El banco "${bancoId}" no existe`);
    }

    const banco = bancoSnap.data() as Banco;

    // ✅ VALIDACIÓN: Capital suficiente con mensaje detallado
    if (banco.capitalActual < monto) {
      throw new Error(
        `Capital insuficiente en ${bancoId}. Disponible: $${banco.capitalActual.toFixed(2)}, Requerido: $${monto.toFixed(2)}`
      );
    }

    const operacion: Operacion = {
      id: `GASTO_${Date.now()}`,
      fecha: new Date().toISOString().split('T')[0],
      tipo: 'gasto',
      monto,
      concepto,
      descripcion,
      createdAt: serverTimestamp(),
    };

    transaction.update(bancoRef, {
      capitalActual: increment(-monto),
      historicoGastos: increment(monto),
      operaciones: arrayUnion(operacion),
      updatedAt: serverTimestamp(),
    });

    return {
      success: true,
      message: 'Gasto registrado exitosamente',
    };
  });
}

/**
 * Registrar ingreso en un banco (para Azteca, Leftie, Profit)
 */
export async function registrarIngreso(
  bancoId: string,
  monto: number,
  concepto: string,
  descripcion?: string
) {
  // ✅ VALIDACIONES CRÍTICAS
  if (!bancoId || bancoId.trim() === '') {
    throw new Error('Debe especificar el banco');
  }

  if (monto <= 0) {
    throw new Error('El monto del ingreso debe ser mayor a 0');
  }

  if (!concepto || concepto.trim() === '') {
    throw new Error('El concepto del ingreso es obligatorio');
  }
  const bancoRef = doc(db, bancoId, bancoId);

  const operacion: Operacion = {
    id: `ING_${Date.now()}`,
    fecha: new Date().toISOString().split('T')[0],
    tipo: 'ingreso',
    monto,
    concepto,
    descripcion,
    createdAt: serverTimestamp(),
  };

  await updateDoc(bancoRef, {
    capitalActual: increment(monto),
    historicoIngresos: increment(monto),
    operaciones: arrayUnion(operacion),
    updatedAt: serverTimestamp(),
  });

  return {
    success: true,
    message: 'Ingreso registrado exitosamente',
  };
}

// ============================================================
// 📊 CONSULTAS Y LISTENERS
// ============================================================

/**
 * Obtener datos en tiempo real con listener
 */
export function subscribeToCollection(
  collectionName: string,
  callback: (data: any[]) => void,
  errorCallback?: (error: Error) => void
) {
  const q = query(collection(db, collectionName), orderBy('createdAt', 'desc'));

  return onSnapshot(
    q,
    (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      callback(data);
    },
    (error) => {
      console.error(`Error en listener de ${collectionName}:`, error);
      errorCallback?.(error);
    }
  );
}

/**
 * Obtener documento específico
 */
export async function getDocument(collectionName: string, docId: string) {
  const docRef = doc(db, collectionName, docId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() };
  }

  return null;
}

/**
 * Obtener todos los documentos de una colección
 */
export async function getAllDocuments(collectionName: string) {
  const q = query(collection(db, collectionName));
  const querySnapshot = await getDocs(q);

  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

// ============================================================
// EXPORTS
// ============================================================

export default {
  // Órdenes de Compra
  crearOrdenCompra,
  pagarDistribuidor,

  // Ventas
  registrarVenta,
  pagarCliente,

  // Bancos
  transferirEntreBancos,
  registrarGasto,
  registrarIngreso,

  // Consultas
  subscribeToCollection,
  getDocument,
  getAllDocuments,
};
