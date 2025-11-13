/**
 * 🔥 FIRESTORE SERVICE - FLOWDISTRIBUTOR
 * =======================================
 * Servicio centralizado para todas las operaciones de Firestore
 * Incluye lógica de negocio completa del sistema
 */
import {
  type QueryConstraint,
  Timestamp,
  addDoc,
  collection,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  runTransaction,
  where,
} from 'firebase/firestore';

import { db } from '@/lib/firebase';
import type {
  Banco,
  Cliente,
  Distribuidor,
  MovimientoStock,
  OrdenCompra,
  OrdenCompraFormData,
  Producto,
  Venta,
  VentaFormData,
} from '@/types/flowdistributor.types';
import { EstadoOrdenCompra, EstadoPago, TipoBanco } from '@/types/flowdistributor.types';

// ============================================================================
// COLECCIONES
// ============================================================================

const COLLECTIONS = {
  BANCOS: 'bancos',
  PRODUCTOS: 'productos',
  DISTRIBUIDORES: 'distribuidores',
  CLIENTES: 'clientes',
  ORDENES_COMPRA: 'ordenes_compra',
  VENTAS: 'ventas',
  PAGOS: 'pagos',
  GASTOS: 'gastos',
  TRANSFERENCIAS: 'transferencias',
  INGRESOS: 'ingresos',
  MOVIMIENTOS_STOCK: 'movimientos_stock',
  HISTORIAL: 'historial_operaciones',
} as const;

// ============================================================================
// UTILIDADES
// ============================================================================

const generateId = (prefix: string): string => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return `${prefix}-${timestamp}-${random}`;
};

const timestampNow = () => Timestamp.now();

// ============================================================================
// BANCOS
// ============================================================================

/**
 * Inicializar los 7 bancos del sistema
 */
export const initializeBancos = async (): Promise<void> => {
  const bancosRef = collection(db, COLLECTIONS.BANCOS);

  const bancos: Omit<Banco, 'id'>[] = [
    {
      tipo: TipoBanco.BOVEDA_MONTE,
      nombre: 'Bóveda Monte',
      capital: 0,
      capitalHistorico: 0,
      totalGastos: 0,
      totalTransferenciasEnviadas: 0,
      totalTransferenciasRecibidas: 0,
      fechaCreacion: timestampNow(),
      fechaActualizacion: timestampNow(),
    },
    {
      tipo: TipoBanco.UTILIDADES,
      nombre: 'Utilidades',
      capital: 0,
      capitalHistorico: 0,
      totalGastos: 0,
      totalTransferenciasEnviadas: 0,
      totalTransferenciasRecibidas: 0,
      fechaCreacion: timestampNow(),
      fechaActualizacion: timestampNow(),
    },
    {
      tipo: TipoBanco.FLETES,
      nombre: 'Fletes',
      capital: 0,
      capitalHistorico: 0,
      totalGastos: 0,
      totalTransferenciasEnviadas: 0,
      totalTransferenciasRecibidas: 0,
      fechaCreacion: timestampNow(),
      fechaActualizacion: timestampNow(),
    },
    {
      tipo: TipoBanco.AZTECA,
      nombre: 'Azteca',
      capital: 0,
      capitalHistorico: 0,
      totalGastos: 0,
      totalTransferenciasEnviadas: 0,
      totalTransferenciasRecibidas: 0,
      fechaCreacion: timestampNow(),
      fechaActualizacion: timestampNow(),
    },
    {
      tipo: TipoBanco.LEFTIE,
      nombre: 'Leftie',
      capital: 0,
      capitalHistorico: 0,
      totalGastos: 0,
      totalTransferenciasEnviadas: 0,
      totalTransferenciasRecibidas: 0,
      fechaCreacion: timestampNow(),
      fechaActualizacion: timestampNow(),
    },
    {
      tipo: TipoBanco.PROFIT,
      nombre: 'Profit',
      capital: 0,
      capitalHistorico: 0,
      totalGastos: 0,
      totalTransferenciasEnviadas: 0,
      totalTransferenciasRecibidas: 0,
      fechaCreacion: timestampNow(),
      fechaActualizacion: timestampNow(),
    },
    {
      tipo: TipoBanco.BOVEDA_USA,
      nombre: 'Bóveda USA',
      capital: 0,
      capitalHistorico: 0,
      totalGastos: 0,
      totalTransferenciasEnviadas: 0,
      totalTransferenciasRecibidas: 0,
      fechaCreacion: timestampNow(),
      fechaActualizacion: timestampNow(),
    },
  ];

  for (const banco of bancos) {
    await addDoc(bancosRef, banco);
  }
};

/**
 * Obtener todos los bancos
 */
export const getBancos = async (): Promise<Banco[]> => {
  const bancosRef = collection(db, COLLECTIONS.BANCOS);
  const snapshot = await getDocs(bancosRef);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Banco);
};

/**
 * Obtener un banco por tipo
 */
export const getBancoByTipo = async (tipo: TipoBanco): Promise<Banco | null> => {
  const bancosRef = collection(db, COLLECTIONS.BANCOS);
  const q = query(bancosRef, where('tipo', '==', tipo));
  const snapshot = await getDocs(q);

  if (snapshot.empty) return null;

  const doc = snapshot.docs[0];
  return { id: doc.id, ...doc.data() } as Banco;
};

/**
 * Listener en tiempo real para bancos
 */
export const subscribeToBancos = (callback: (bancos: Banco[]) => void) => {
  const bancosRef = collection(db, COLLECTIONS.BANCOS);

  return onSnapshot(bancosRef, (snapshot) => {
    const bancos = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Banco);
    callback(bancos);
  });
};

// ============================================================================
// ORDEN DE COMPRA - Lógica Completa
// ============================================================================

/**
 * Crear Orden de Compra
 * - Crea/actualiza distribuidor
 * - Genera adeudo al distribuidor
 * - Crea entradas de stock automáticamente
 */
export const crearOrdenCompra = async (data: OrdenCompraFormData): Promise<string> => {
  return await runTransaction(db, async (transaction) => {
    // 1. Crear o buscar distribuidor
    const distribuidoresRef = collection(db, COLLECTIONS.DISTRIBUIDORES);
    const qDist = query(distribuidoresRef, where('nombre', '==', data.distribuidorNombre));
    const distSnapshot = await getDocs(qDist);

    let distribuidorId: string;
    let distribuidor: Distribuidor;

    if (distSnapshot.empty) {
      // Crear nuevo distribuidor
      const nuevoDistribuidor: Omit<Distribuidor, 'id'> = {
        nombre: data.distribuidorNombre,
        contacto: data.distribuidorContacto,
        telefono: data.distribuidorTelefono,
        email: data.distribuidorEmail,
        totalOrdenesCompra: 0,
        montoTotalComprado: 0,
        adeudoPendiente: 0,
        historialPagos: [],
        fechaCreacion: timestampNow(),
        fechaActualizacion: timestampNow(),
      };

      const distRef = await addDoc(distribuidoresRef, nuevoDistribuidor);
      distribuidorId = distRef.id;
      distribuidor = { id: distribuidorId, ...nuevoDistribuidor };
    } else {
      distribuidorId = distSnapshot.docs[0].id;
      distribuidor = { id: distribuidorId, ...distSnapshot.docs[0].data() } as Distribuidor;
    }

    // 2. Calcular totales
    const subtotal = data.productos.reduce((sum, p) => sum + p.cantidad * p.precioUnitario, 0);
    const total = subtotal;

    // 3. Crear orden de compra
    const ordenCompra: Omit<OrdenCompra, 'id'> = {
      numeroOrden: generateId('OC'),
      distribuidorId,
      distribuidorNombre: data.distribuidorNombre,
      productos: data.productos.map((p) => ({
        productoId: p.productoId,
        productoNombre: p.productoNombre,
        cantidad: p.cantidad,
        precioUnitario: p.precioUnitario,
        subtotal: p.cantidad * p.precioUnitario,
      })),
      subtotal,
      total,
      estadoPago: EstadoOrdenCompra.PENDIENTE,
      montoPagado: 0,
      montoRestante: total,
      fechaOrden: timestampNow(),
      fechaEntregaEstimada: data.fechaEntregaEstimada
        ? Timestamp.fromDate(data.fechaEntregaEstimada)
        : undefined,
      fechaCreacion: timestampNow(),
      fechaActualizacion: timestampNow(),
      notas: data.notas,
    };

    const ocRef = await addDoc(collection(db, COLLECTIONS.ORDENES_COMPRA), ordenCompra);

    // 4. Actualizar distribuidor (incrementar adeudo)
    const distRef = doc(db, COLLECTIONS.DISTRIBUIDORES, distribuidorId);
    transaction.update(distRef, {
      totalOrdenesCompra: distribuidor.totalOrdenesCompra + 1,
      montoTotalComprado: distribuidor.montoTotalComprado + total,
      adeudoPendiente: distribuidor.adeudoPendiente + total,
      fechaActualizacion: timestampNow(),
    });

    // 5. Crear movimientos de stock (entradas)
    for (const producto of data.productos) {
      const prodRef = doc(db, COLLECTIONS.PRODUCTOS, producto.productoId);
      const prodSnap = await transaction.get(prodRef);

      if (prodSnap.exists()) {
        const prodData = prodSnap.data() as Producto;
        const nuevoStock = prodData.stockActual + producto.cantidad;

        // Actualizar stock del producto
        transaction.update(prodRef, {
          stockActual: nuevoStock,
          fechaActualizacion: timestampNow(),
        });

        // Crear movimiento de stock
        const movimiento: Omit<MovimientoStock, 'id'> = {
          tipo: 'entrada',
          productoId: producto.productoId,
          productoNombre: producto.productoNombre,
          cantidad: producto.cantidad,
          stockAnterior: prodData.stockActual,
          stockNuevo: nuevoStock,
          origenTipo: 'orden_compra',
          origenId: ocRef.id,
          concepto: `Entrada por OC ${ordenCompra.numeroOrden}`,
          fechaMovimiento: timestampNow(),
          fechaCreacion: timestampNow(),
        };

        await addDoc(collection(db, COLLECTIONS.MOVIMIENTOS_STOCK), movimiento);
      }
    }

    return ocRef.id;
  });
};

/**
 * Obtener órdenes de compra
 */
export const getOrdenesCompra = async (distribuidorId?: string): Promise<OrdenCompra[]> => {
  const ocRef = collection(db, COLLECTIONS.ORDENES_COMPRA);
  const constraints: QueryConstraint[] = [orderBy('fechaOrden', 'desc')];

  if (distribuidorId) {
    constraints.unshift(where('distribuidorId', '==', distribuidorId));
  }

  const q = query(ocRef, ...constraints);
  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as OrdenCompra);
};

/**
 * Listener en tiempo real para órdenes de compra
 */
export const subscribeToOrdenesCompra = (
  callback: (ordenes: OrdenCompra[]) => void,
  distribuidorId?: string
) => {
  const ocRef = collection(db, COLLECTIONS.ORDENES_COMPRA);
  const constraints: QueryConstraint[] = [orderBy('fechaOrden', 'desc')];

  if (distribuidorId) {
    constraints.unshift(where('distribuidorId', '==', distribuidorId));
  }

  const q = query(ocRef, ...constraints);

  return onSnapshot(q, (snapshot) => {
    const ordenes = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as OrdenCompra);
    callback(ordenes);
  });
};

// ============================================================================
// VENTA - Lógica Completa con Distribución Automática
// ============================================================================

/**
 * Crear Venta
 * - Crea/actualiza cliente
 * - Distribuye automáticamente en: Bóveda Monte, Utilidades, Fletes
 * - Crea salidas de stock automáticamente
 * - Maneja estados de pago (completo/parcial/pendiente)
 */
export const crearVenta = async (data: VentaFormData): Promise<string> => {
  return await runTransaction(db, async (transaction) => {
    // 1. Crear o buscar cliente
    const clientesRef = collection(db, COLLECTIONS.CLIENTES);
    const qCli = query(clientesRef, where('nombre', '==', data.clienteNombre));
    const cliSnapshot = await getDocs(qCli);

    let clienteId: string;
    let cliente: Cliente;

    if (cliSnapshot.empty) {
      // Crear nuevo cliente
      const nuevoCliente: Omit<Cliente, 'id'> = {
        nombre: data.clienteNombre,
        contacto: data.clienteContacto,
        telefono: data.clienteTelefono,
        email: data.clienteEmail,
        totalVentas: 0,
        montoTotalVendido: 0,
        adeudoPendiente: 0,
        historialPagos: [],
        fechaCreacion: timestampNow(),
        fechaActualizacion: timestampNow(),
      };

      const cliRef = await addDoc(clientesRef, nuevoCliente);
      clienteId = cliRef.id;
      cliente = { id: clienteId, ...nuevoCliente };
    } else {
      clienteId = cliSnapshot.docs[0].id;
      cliente = { id: clienteId, ...cliSnapshot.docs[0].data() } as Cliente;
    }

    // 2. Calcular totales y distribución
    let montoBOVedaMonte = 0;
    let montoUtilidades = 0;
    let montoFletes = 0;

    const productosVenta = await Promise.all(
      data.productos.map(async (p) => {
        const prodRef = doc(db, COLLECTIONS.PRODUCTOS, p.productoId);
        const prodSnap = await transaction.get(prodRef);
        const prodData = prodSnap.data() as Producto;

        const precioCompra = prodData.precioCompra;
        const precioVenta = p.precioVenta;
        const precioFlete = p.precioFlete;
        const precioTotalUnitario = precioVenta + precioFlete;
        const utilidadUnitaria = precioVenta - precioCompra;
        const subtotal = precioTotalUnitario * p.cantidad;

        // Acumular distribución
        montoBOVedaMonte += precioVenta * p.cantidad;
        montoUtilidades += utilidadUnitaria * p.cantidad;
        montoFletes += precioFlete * p.cantidad;

        return {
          productoId: p.productoId,
          productoNombre: p.productoNombre,
          cantidad: p.cantidad,
          precioCompra,
          precioVenta,
          precioFlete,
          precioTotalUnitario,
          utilidadUnitaria,
          subtotal,
        };
      })
    );

    const subtotalProductos = productosVenta.reduce((sum, p) => sum + p.subtotal, 0);
    const totalFletes = montoFletes;
    const subtotal = subtotalProductos;
    const total = subtotal;

    // 3. Determinar monto pagado y restante
    let montoPagado = 0;
    let montoRestante = total;

    if (data.estadoPago === EstadoPago.COMPLETO) {
      montoPagado = total;
      montoRestante = 0;
    } else if (data.estadoPago === EstadoPago.PARCIAL && data.montoPagado) {
      montoPagado = data.montoPagado;
      montoRestante = total - montoPagado;
    }

    // 4. Crear venta
    const venta: Omit<Venta, 'id'> = {
      numeroVenta: generateId('V'),
      clienteId,
      clienteNombre: data.clienteNombre,
      productos: productosVenta,
      subtotalProductos,
      totalFletes,
      subtotal,
      total,
      estadoPago: data.estadoPago,
      montoPagado,
      montoRestante,
      montoBOVedaMonte,
      montoUtilidades,
      montoFletes,
      fechaVenta: timestampNow(),
      fechaCreacion: timestampNow(),
      fechaActualizacion: timestampNow(),
      notas: data.notas,
    };

    const ventaRef = await addDoc(collection(db, COLLECTIONS.VENTAS), venta);

    // 5. Actualizar cliente
    const cliRef = doc(db, COLLECTIONS.CLIENTES, clienteId);
    transaction.update(cliRef, {
      totalVentas: cliente.totalVentas + 1,
      montoTotalVendido: cliente.montoTotalVendido + total,
      adeudoPendiente: cliente.adeudoPendiente + montoRestante,
      fechaActualizacion: timestampNow(),
    });

    // 6. Actualizar bancos (solo capital disponible si pagó)
    if (montoPagado > 0) {
      // Bóveda Monte
      const bancoBovedaMonte = await getBancoByTipo(TipoBanco.BOVEDA_MONTE);
      if (bancoBovedaMonte) {
        const refBM = doc(db, COLLECTIONS.BANCOS, bancoBovedaMonte.id);
        const incrementoCapitalBM = (montoBOVedaMonte / total) * montoPagado;
        transaction.update(refBM, {
          capital: bancoBovedaMonte.capital + incrementoCapitalBM,
          capitalHistorico: bancoBovedaMonte.capitalHistorico + montoBOVedaMonte,
          fechaActualizacion: timestampNow(),
        });
      }

      // Utilidades
      const bancoUtilidades = await getBancoByTipo(TipoBanco.UTILIDADES);
      if (bancoUtilidades) {
        const refU = doc(db, COLLECTIONS.BANCOS, bancoUtilidades.id);
        const incrementoCapitalU = (montoUtilidades / total) * montoPagado;
        transaction.update(refU, {
          capital: bancoUtilidades.capital + incrementoCapitalU,
          capitalHistorico: bancoUtilidades.capitalHistorico + montoUtilidades,
          fechaActualizacion: timestampNow(),
        });
      }

      // Fletes
      const bancoFletes = await getBancoByTipo(TipoBanco.FLETES);
      if (bancoFletes) {
        const refF = doc(db, COLLECTIONS.BANCOS, bancoFletes.id);
        const incrementoCapitalF = (montoFletes / total) * montoPagado;
        transaction.update(refF, {
          capital: bancoFletes.capital + incrementoCapitalF,
          capitalHistorico: bancoFletes.capitalHistorico + montoFletes,
          fechaActualizacion: timestampNow(),
        });
      }
    } else {
      // Solo actualizar histórico
      const bancoBovedaMonte = await getBancoByTipo(TipoBanco.BOVEDA_MONTE);
      if (bancoBovedaMonte) {
        const refBM = doc(db, COLLECTIONS.BANCOS, bancoBovedaMonte.id);
        transaction.update(refBM, {
          capitalHistorico: bancoBovedaMonte.capitalHistorico + montoBOVedaMonte,
          fechaActualizacion: timestampNow(),
        });
      }

      const bancoUtilidades = await getBancoByTipo(TipoBanco.UTILIDADES);
      if (bancoUtilidades) {
        const refU = doc(db, COLLECTIONS.BANCOS, bancoUtilidades.id);
        transaction.update(refU, {
          capitalHistorico: bancoUtilidades.capitalHistorico + montoUtilidades,
          fechaActualizacion: timestampNow(),
        });
      }

      const bancoFletes = await getBancoByTipo(TipoBanco.FLETES);
      if (bancoFletes) {
        const refF = doc(db, COLLECTIONS.BANCOS, bancoFletes.id);
        transaction.update(refF, {
          capitalHistorico: bancoFletes.capitalHistorico + montoFletes,
          fechaActualizacion: timestampNow(),
        });
      }
    }

    // 7. Crear movimientos de stock (salidas)
    for (const producto of productosVenta) {
      const prodRef = doc(db, COLLECTIONS.PRODUCTOS, producto.productoId);
      const prodSnap = await transaction.get(prodRef);

      if (prodSnap.exists()) {
        const prodData = prodSnap.data() as Producto;
        const nuevoStock = prodData.stockActual - producto.cantidad;

        // Actualizar stock del producto
        transaction.update(prodRef, {
          stockActual: nuevoStock,
          fechaActualizacion: timestampNow(),
        });

        // Crear movimiento de stock
        const movimiento: Omit<MovimientoStock, 'id'> = {
          tipo: 'salida',
          productoId: producto.productoId,
          productoNombre: producto.productoNombre,
          cantidad: producto.cantidad,
          stockAnterior: prodData.stockActual,
          stockNuevo: nuevoStock,
          origenTipo: 'venta',
          origenId: ventaRef.id,
          concepto: `Salida por venta ${venta.numeroOrden}`,
          fechaMovimiento: timestampNow(),
          fechaCreacion: timestampNow(),
        };

        await addDoc(collection(db, COLLECTIONS.MOVIMIENTOS_STOCK), movimiento);
      }
    }

    return ventaRef.id;
  });
};

// ============================================================================
// EXPORTACIONES
// ============================================================================

// Re-exportar funciones de flowdistributor-operations.service.ts
export {
  getClientes,
  getDistribuidores,
  getGastos,
  getIngresos,
  getMovimientosStock,
  getProductos,
  getTransferencias,
  getVentas,
  registrarAbonoCliente,
  registrarAbonoDistribuidor,
  registrarGasto,
  registrarIngreso,
  registrarTransferencia,
  subscribeToClientes,
  subscribeToDistribuidores,
  subscribeToGastos,
  subscribeToIngresos,
  subscribeToMovimientosStock,
  subscribeToProductos,
  subscribeToTransferencias,
  subscribeToVentas,
} from './flowdistributor-operations.service';
