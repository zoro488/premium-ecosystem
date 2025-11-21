/**
 * 🔥 FIRESTORE SERVICE - FLOWDISTRIBUTOR (PARTE 2)
 * =================================================
 * Funciones de Abonos, Gastos, Transferencias e Ingresos
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
  AbonoClienteFormData,
  AbonoDistribuidorFormData,
  Banco,
  Cliente,
  Distribuidor,
  Gasto,
  GastoFormData,
  Ingreso,
  IngresoFormData,
  MovimientoStock,
  Pago,
  Producto,
  Transferencia,
  TransferenciaFormData,
  Venta,
} from '@/types/flowdistributor.types';
import { TipoBanco } from '@/types/flowdistributor.types';

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

const timestampNow = () => Timestamp.now();

const generateId = (prefix: string): string => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return `${prefix}-${timestamp}-${random}`;
};

// ============================================================================
// ABONOS CLIENTES
// ============================================================================

/**
 * Registrar abono de cliente
 * - Reduce adeudo del cliente
 * - Incrementa capital de bancos proporcionalmente
 */
export const registrarAbonoCliente = async (data: AbonoClienteFormData): Promise<string> => {
  return await runTransaction(db, async (transaction) => {
    // 1. Obtener cliente
    const cliRef = doc(db, COLLECTIONS.CLIENTES, data.clienteId);
    const cliSnap = await transaction.get(cliRef);

    if (!cliSnap.exists()) {
      throw new Error('Cliente no encontrado');
    }

    const cliente = cliSnap.data() as Cliente;

    if (data.monto > cliente.adeudoPendiente) {
      throw new Error('El monto del abono no puede ser mayor al adeudo pendiente');
    }

    // 2. Obtener ventas pendientes del cliente
    const ventasRef = collection(db, COLLECTIONS.VENTAS);
    const qVentas = query(
      ventasRef,
      where('clienteId', '==', data.clienteId),
      where('montoRestante', '>', 0),
      orderBy('fechaVenta', 'asc')
    );
    const ventasSnapshot = await getDocs(qVentas);
    const ventasPendientes = ventasSnapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() }) as Venta
    );

    // 3. Distribuir el abono proporcionalmente en los bancos
    let montoRestante = data.monto;

    for (const venta of ventasPendientes) {
      if (montoRestante <= 0) break;

      const montoAplicar = Math.min(montoRestante, venta.montoRestante);
      const proporcion = montoAplicar / venta.total;

      // Calcular distribución proporcional
      const abonoBovedaMonte = venta.montoBOVedaMonte * proporcion;
      const abonoUtilidades = venta.montoUtilidades * proporcion;
      const abonoFletes = venta.montoFletes * proporcion;

      // Actualizar bancos
      const bancoBM = await getBancoByTipo(TipoBanco.BOVEDA_MONTE);
      if (bancoBM) {
        const refBM = doc(db, COLLECTIONS.BANCOS, bancoBM.id);
        transaction.update(refBM, {
          capital: bancoBM.capital + abonoBovedaMonte,
          fechaActualizacion: timestampNow(),
        });
      }

      const bancoU = await getBancoByTipo(TipoBanco.UTILIDADES);
      if (bancoU) {
        const refU = doc(db, COLLECTIONS.BANCOS, bancoU.id);
        transaction.update(refU, {
          capital: bancoU.capital + abonoUtilidades,
          fechaActualizacion: timestampNow(),
        });
      }

      const bancoF = await getBancoByTipo(TipoBanco.FLETES);
      if (bancoF) {
        const refF = doc(db, COLLECTIONS.BANCOS, bancoF.id);
        transaction.update(refF, {
          capital: bancoF.capital + abonoFletes,
          fechaActualizacion: timestampNow(),
        });
      }

      // Actualizar venta
      const ventaRef = doc(db, COLLECTIONS.VENTAS, venta.id);
      transaction.update(ventaRef, {
        montoPagado: venta.montoPagado + montoAplicar,
        montoRestante: venta.montoRestante - montoAplicar,
        fechaActualizacion: timestampNow(),
      });

      montoRestante -= montoAplicar;
    }

    // 4. Crear registro de pago
    const pago: Omit<Pago, 'id'> = {
      tipo: 'abono_cliente',
      clienteId: data.clienteId,
      monto: data.monto,
      concepto: data.concepto,
      descripcion: data.descripcion,
      adeudoAnterior: cliente.adeudoPendiente,
      adeudoNuevo: cliente.adeudoPendiente - data.monto,
      fechaPago: timestampNow(),
      fechaCreacion: timestampNow(),
    };

    const pagoRef = await addDoc(collection(db, COLLECTIONS.PAGOS), pago);

    // 5. Actualizar cliente
    transaction.update(cliRef, {
      adeudoPendiente: cliente.adeudoPendiente - data.monto,
      historialPagos: [...cliente.historialPagos, pago],
      fechaActualizacion: timestampNow(),
    });

    return pagoRef.id;
  });
};

// ============================================================================
// ABONOS DISTRIBUIDORES
// ============================================================================

/**
 * Registrar abono a distribuidor
 * - Reduce adeudo del distribuidor
 * - Reduce capital del banco origen
 * - Registra como gasto en el banco
 */
export const registrarAbonoDistribuidor = async (
  data: AbonoDistribuidorFormData
): Promise<string> => {
  return await runTransaction(db, async (transaction) => {
    // 1. Obtener distribuidor
    const distRef = doc(db, COLLECTIONS.DISTRIBUIDORES, data.distribuidorId);
    const distSnap = await transaction.get(distRef);

    if (!distSnap.exists()) {
      throw new Error('Distribuidor no encontrado');
    }

    const distribuidor = distSnap.data() as Distribuidor;

    if (data.monto > distribuidor.adeudoPendiente) {
      throw new Error('El monto del abono no puede ser mayor al adeudo pendiente');
    }

    // 2. Obtener banco origen
    const bancoRef = doc(db, COLLECTIONS.BANCOS, data.bancoOrigenId);
    const bancoSnap = await transaction.get(bancoRef);

    if (!bancoSnap.exists()) {
      throw new Error('Banco no encontrado');
    }

    const banco = bancoSnap.data() as Banco;

    if (data.monto > banco.capital) {
      throw new Error('El banco no tiene suficiente capital disponible');
    }

    // 3. Crear registro de pago
    const pago: Omit<Pago, 'id'> = {
      tipo: 'abono_distribuidor',
      distribuidorId: data.distribuidorId,
      monto: data.monto,
      bancoOrigenId: data.bancoOrigenId,
      bancoOrigenNombre: banco.nombre,
      concepto: data.concepto,
      descripcion: data.descripcion,
      adeudoAnterior: distribuidor.adeudoPendiente,
      adeudoNuevo: distribuidor.adeudoPendiente - data.monto,
      fechaPago: timestampNow(),
      fechaCreacion: timestampNow(),
    };

    const pagoRef = await addDoc(collection(db, COLLECTIONS.PAGOS), pago);

    // 4. Crear gasto en el banco
    const gasto: Omit<Gasto, 'id'> = {
      bancoId: data.bancoOrigenId,
      bancoNombre: banco.nombre,
      concepto: `Pago a distribuidor: ${data.concepto}`,
      descripcion: data.descripcion,
      monto: data.monto,
      categoria: 'pago_distribuidor',
      fechaGasto: timestampNow(),
      fechaCreacion: timestampNow(),
    };

    await addDoc(collection(db, COLLECTIONS.GASTOS), gasto);

    // 5. Actualizar banco (reducir capital y sumar gasto)
    transaction.update(bancoRef, {
      capital: banco.capital - data.monto,
      totalGastos: banco.totalGastos + data.monto,
      fechaActualizacion: timestampNow(),
    });

    // 6. Actualizar distribuidor
    transaction.update(distRef, {
      adeudoPendiente: distribuidor.adeudoPendiente - data.monto,
      historialPagos: [...distribuidor.historialPagos, pago],
      fechaActualizacion: timestampNow(),
    });

    return pagoRef.id;
  });
};

// ============================================================================
// GASTOS
// ============================================================================

/**
 * Registrar gasto
 * - Reduce capital del banco
 * - Incrementa total de gastos del banco
 */
export const registrarGasto = async (data: GastoFormData): Promise<string> => {
  return await runTransaction(db, async (transaction) => {
    // 1. Obtener banco
    const bancoRef = doc(db, COLLECTIONS.BANCOS, data.bancoId);
    const bancoSnap = await transaction.get(bancoRef);

    if (!bancoSnap.exists()) {
      throw new Error('Banco no encontrado');
    }

    const banco = bancoSnap.data() as Banco;

    if (data.monto > banco.capital) {
      throw new Error('El banco no tiene suficiente capital disponible');
    }

    // 2. Crear gasto
    const gasto: Omit<Gasto, 'id'> = {
      bancoId: data.bancoId,
      bancoNombre: banco.nombre,
      concepto: data.concepto,
      descripcion: data.descripcion,
      monto: data.monto,
      categoria: data.categoria,
      fechaGasto: data.fechaGasto ? Timestamp.fromDate(data.fechaGasto) : timestampNow(),
      fechaCreacion: timestampNow(),
    };

    const gastoRef = await addDoc(collection(db, COLLECTIONS.GASTOS), gasto);

    // 3. Actualizar banco
    transaction.update(bancoRef, {
      capital: banco.capital - data.monto,
      totalGastos: banco.totalGastos + data.monto,
      fechaActualizacion: timestampNow(),
    });

    return gastoRef.id;
  });
};

/**
 * Obtener gastos de un banco
 */
export const getGastos = async (bancoId?: string): Promise<Gasto[]> => {
  const gastosRef = collection(db, COLLECTIONS.GASTOS);
  const constraints: QueryConstraint[] = [orderBy('fechaGasto', 'desc')];

  if (bancoId) {
    constraints.unshift(where('bancoId', '==', bancoId));
  }

  const q = query(gastosRef, ...constraints);
  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Gasto);
};

/**
 * Listener en tiempo real para gastos
 */
export const subscribeToGastos = (callback: (gastos: Gasto[]) => void, bancoId?: string) => {
  const gastosRef = collection(db, COLLECTIONS.GASTOS);
  const constraints: QueryConstraint[] = [orderBy('fechaGasto', 'desc')];

  if (bancoId) {
    constraints.unshift(where('bancoId', '==', bancoId));
  }

  const q = query(gastosRef, ...constraints);

  return onSnapshot(q, (snapshot) => {
    const gastos = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Gasto);
    callback(gastos);
  });
};

// ============================================================================
// TRANSFERENCIAS
// ============================================================================

/**
 * Registrar transferencia entre bancos
 * - Reduce capital del banco origen
 * - Incrementa capital del banco destino
 */
export const registrarTransferencia = async (data: TransferenciaFormData): Promise<string> => {
  return await runTransaction(db, async (transaction) => {
    if (data.bancoOrigenId === data.bancoDestinoId) {
      throw new Error('No se puede transferir al mismo banco');
    }

    // 1. Obtener banco origen
    const bancoOrigenRef = doc(db, COLLECTIONS.BANCOS, data.bancoOrigenId);
    const bancoOrigenSnap = await transaction.get(bancoOrigenRef);

    if (!bancoOrigenSnap.exists()) {
      throw new Error('Banco origen no encontrado');
    }

    const bancoOrigen = bancoOrigenSnap.data() as Banco;

    if (data.monto > bancoOrigen.capital) {
      throw new Error('El banco origen no tiene suficiente capital disponible');
    }

    // 2. Obtener banco destino
    const bancoDestinoRef = doc(db, COLLECTIONS.BANCOS, data.bancoDestinoId);
    const bancoDestinoSnap = await transaction.get(bancoDestinoRef);

    if (!bancoDestinoSnap.exists()) {
      throw new Error('Banco destino no encontrado');
    }

    const bancoDestino = bancoDestinoSnap.data() as Banco;

    // 3. Crear transferencia
    const transferencia: Omit<Transferencia, 'id'> = {
      bancoOrigenId: data.bancoOrigenId,
      bancoOrigenNombre: bancoOrigen.nombre,
      bancoDestinoId: data.bancoDestinoId,
      bancoDestinoNombre: bancoDestino.nombre,
      monto: data.monto,
      concepto: data.concepto,
      descripcion: data.descripcion,
      fechaTransferencia: timestampNow(),
      fechaCreacion: timestampNow(),
    };

    const transRef = await addDoc(collection(db, COLLECTIONS.TRANSFERENCIAS), transferencia);

    // 4. Actualizar bancos
    transaction.update(bancoOrigenRef, {
      capital: bancoOrigen.capital - data.monto,
      totalTransferenciasEnviadas: bancoOrigen.totalTransferenciasEnviadas + data.monto,
      fechaActualizacion: timestampNow(),
    });

    transaction.update(bancoDestinoRef, {
      capital: bancoDestino.capital + data.monto,
      capitalHistorico: bancoDestino.capitalHistorico + data.monto,
      totalTransferenciasRecibidas: bancoDestino.totalTransferenciasRecibidas + data.monto,
      fechaActualizacion: timestampNow(),
    });

    return transRef.id;
  });
};

/**
 * Obtener transferencias
 */
export const getTransferencias = async (bancoId?: string): Promise<Transferencia[]> => {
  const transRef = collection(db, COLLECTIONS.TRANSFERENCIAS);
  const constraints: QueryConstraint[] = [orderBy('fechaTransferencia', 'desc')];

  if (bancoId) {
    // Buscar donde el banco sea origen o destino
    // Nota: Firestore no permite OR en queries simples, se deben hacer 2 queries
  }

  const q = query(transRef, ...constraints);
  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Transferencia);
};

/**
 * Listener en tiempo real para transferencias
 */
export const subscribeToTransferencias = (callback: (transferencias: Transferencia[]) => void) => {
  const transRef = collection(db, COLLECTIONS.TRANSFERENCIAS);
  const q = query(transRef, orderBy('fechaTransferencia', 'desc'));

  return onSnapshot(q, (snapshot) => {
    const transferencias = snapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() }) as Transferencia
    );
    callback(transferencias);
  });
};

// ============================================================================
// INGRESOS (para Azteca, Leftie, Profit)
// ============================================================================

/**
 * Registrar ingreso directo a banco
 * - Incrementa capital del banco
 * - Incrementa capitalHistorico del banco
 */
export const registrarIngreso = async (data: IngresoFormData): Promise<string> => {
  return await runTransaction(db, async (transaction) => {
    // 1. Obtener banco
    const bancoRef = doc(db, COLLECTIONS.BANCOS, data.bancoId);
    const bancoSnap = await transaction.get(bancoRef);

    if (!bancoSnap.exists()) {
      throw new Error('Banco no encontrado');
    }

    const banco = bancoSnap.data() as Banco;

    // 2. Crear ingreso
    const ingreso: Omit<Ingreso, 'id'> = {
      bancoId: data.bancoId,
      bancoNombre: banco.nombre,
      concepto: data.concepto,
      descripcion: data.descripcion,
      monto: data.monto,
      fuente: data.fuente,
      fechaIngreso: data.fechaIngreso ? Timestamp.fromDate(data.fechaIngreso) : timestampNow(),
      fechaCreacion: timestampNow(),
    };

    const ingresoRef = await addDoc(collection(db, COLLECTIONS.INGRESOS), ingreso);

    // 3. Actualizar banco
    transaction.update(bancoRef, {
      capital: banco.capital + data.monto,
      capitalHistorico: banco.capitalHistorico + data.monto,
      fechaActualizacion: timestampNow(),
    });

    return ingresoRef.id;
  });
};

/**
 * Obtener ingresos de un banco
 */
export const getIngresos = async (bancoId?: string): Promise<Ingreso[]> => {
  const ingresosRef = collection(db, COLLECTIONS.INGRESOS);
  const constraints: QueryConstraint[] = [orderBy('fechaIngreso', 'desc')];

  if (bancoId) {
    constraints.unshift(where('bancoId', '==', bancoId));
  }

  const q = query(ingresosRef, ...constraints);
  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Ingreso);
};

/**
 * Listener en tiempo real para ingresos
 */
export const subscribeToIngresos = (callback: (ingresos: Ingreso[]) => void, bancoId?: string) => {
  const ingresosRef = collection(db, COLLECTIONS.INGRESOS);
  const constraints: QueryConstraint[] = [orderBy('fechaIngreso', 'desc')];

  if (bancoId) {
    constraints.unshift(where('bancoId', '==', bancoId));
  }

  const q = query(ingresosRef, ...constraints);

  return onSnapshot(q, (snapshot) => {
    const ingresos = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Ingreso);
    callback(ingresos);
  });
};

// ============================================================================
// HELPER: Obtener banco por tipo
// ============================================================================

const getBancoByTipo = async (tipo: TipoBanco): Promise<Banco | null> => {
  const bancosRef = collection(db, COLLECTIONS.BANCOS);
  const q = query(bancosRef, where('tipo', '==', tipo));
  const snapshot = await getDocs(q);

  if (snapshot.empty) return null;

  const doc = snapshot.docs[0];
  return { id: doc.id, ...doc.data() } as Banco;
};

// ============================================================================
// CLIENTES Y DISTRIBUIDORES
// ============================================================================

/**
 * Obtener todos los clientes
 */
export const getClientes = async (): Promise<Cliente[]> => {
  const clientesRef = collection(db, COLLECTIONS.CLIENTES);
  const q = query(clientesRef, orderBy('fechaCreacion', 'desc'));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Cliente);
};

/**
 * Listener en tiempo real para clientes
 */
export const subscribeToClientes = (callback: (clientes: Cliente[]) => void) => {
  const clientesRef = collection(db, COLLECTIONS.CLIENTES);
  const q = query(clientesRef, orderBy('fechaCreacion', 'desc'));

  return onSnapshot(q, (snapshot) => {
    const clientes = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Cliente);
    callback(clientes);
  });
};

/**
 * Obtener todos los distribuidores
 */
export const getDistribuidores = async (): Promise<Distribuidor[]> => {
  const distribuidoresRef = collection(db, COLLECTIONS.DISTRIBUIDORES);
  const q = query(distribuidoresRef, orderBy('fechaCreacion', 'desc'));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Distribuidor);
};

/**
 * Listener en tiempo real para distribuidores
 */
export const subscribeToDistribuidores = (callback: (distribuidores: Distribuidor[]) => void) => {
  const distribuidoresRef = collection(db, COLLECTIONS.DISTRIBUIDORES);
  const q = query(distribuidoresRef, orderBy('fechaCreacion', 'desc'));

  return onSnapshot(q, (snapshot) => {
    const distribuidores = snapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() }) as Distribuidor
    );
    callback(distribuidores);
  });
};

/**
 * Obtener ventas
 */
export const getVentas = async (clienteId?: string): Promise<Venta[]> => {
  const ventasRef = collection(db, COLLECTIONS.VENTAS);
  const constraints: QueryConstraint[] = [orderBy('fechaVenta', 'desc')];

  if (clienteId) {
    constraints.unshift(where('clienteId', '==', clienteId));
  }

  const q = query(ventasRef, ...constraints);
  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Venta);
};

/**
 * Listener en tiempo real para ventas
 */
export const subscribeToVentas = (callback: (ventas: Venta[]) => void, clienteId?: string) => {
  const ventasRef = collection(db, COLLECTIONS.VENTAS);
  const constraints: QueryConstraint[] = [orderBy('fechaVenta', 'desc')];

  if (clienteId) {
    constraints.unshift(where('clienteId', '==', clienteId));
  }

  const q = query(ventasRef, ...constraints);

  return onSnapshot(q, (snapshot) => {
    const ventas = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Venta);
    callback(ventas);
  });
};

/**
 * Obtener productos
 */
export const getProductos = async (): Promise<Producto[]> => {
  const productosRef = collection(db, COLLECTIONS.PRODUCTOS);
  const q = query(productosRef, orderBy('nombre', 'asc'));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Producto);
};

/**
 * Listener en tiempo real para productos
 */
export const subscribeToProductos = (callback: (productos: Producto[]) => void) => {
  const productosRef = collection(db, COLLECTIONS.PRODUCTOS);
  const q = query(productosRef, orderBy('nombre', 'asc'));

  return onSnapshot(q, (snapshot) => {
    const productos = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Producto);
    callback(productos);
  });
};

/**
 * Obtener movimientos de stock
 */
export const getMovimientosStock = async (productoId?: string): Promise<MovimientoStock[]> => {
  const movimientosRef = collection(db, COLLECTIONS.MOVIMIENTOS_STOCK);
  const constraints: QueryConstraint[] = [orderBy('fechaMovimiento', 'desc')];

  if (productoId) {
    constraints.unshift(where('productoId', '==', productoId));
  }

  const q = query(movimientosRef, ...constraints);
  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as MovimientoStock);
};

/**
 * Listener en tiempo real para movimientos de stock
 */
export const subscribeToMovimientosStock = (
  callback: (movimientos: MovimientoStock[]) => void,
  productoId?: string
) => {
  const movimientosRef = collection(db, COLLECTIONS.MOVIMIENTOS_STOCK);
  const constraints: QueryConstraint[] = [orderBy('fechaMovimiento', 'desc')];

  if (productoId) {
    constraints.unshift(where('productoId', '==', productoId));
  }

  const q = query(movimientosRef, ...constraints);

  return onSnapshot(q, (snapshot) => {
    const movimientos = snapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() }) as MovimientoStock
    );
    callback(movimientos);
  });
};
