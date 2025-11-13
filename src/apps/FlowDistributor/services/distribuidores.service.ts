/**
 * FlowDistributor - Servicio de Distribuidores
 * Creación automática desde Purchase Orders + tracking de deuda
 * @module FlowDistributor/services/distribuidores
 */
import {
  type DocumentData,
  type QueryDocumentSnapshot,
  Timestamp,
  type Unsubscribe,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  runTransaction,
  serverTimestamp,
  updateDoc,
  where,
} from 'firebase/firestore';

import { db } from '@/lib/firebase';

// ============================================================================
// TIPOS
// ============================================================================

export enum DistribuidorEstado {
  ACTIVO = 'activo',
  INACTIVO = 'inactivo',
  SUSPENDIDO = 'suspendido',
}

export interface Distribuidor {
  id?: string;
  nombre: string;
  empresa?: string;
  rfc?: string;
  email?: string;
  telefono?: string;
  direccion?: string;
  ciudad?: string;
  estado?: string;
  pais?: string;
  cp?: string;

  // Financiero
  totalCompras: number; // Total de compras históricas
  deudaActual: number; // Deuda pendiente
  limiteCredito: number; // Límite de crédito
  pagosRealizados: number; // Total pagado
  diasCredito: number; // Días de crédito otorgados

  // Estado
  estadoDistribuidor: DistribuidorEstado;
  activo: boolean;

  // Relaciones
  ordenesCompraIds: string[]; // IDs de órdenes de compra relacionadas
  pagosIds: string[]; // IDs de pagos realizados

  // Metadata
  notas?: string;
  createdAt?: Date;
  updatedAt?: Date;
  creadoPorOCId?: string; // ID de la orden de compra que lo creó
}

export interface PagoDistribuidor {
  id?: string;
  distribuidorId: string;
  ordenCompraId?: string;
  fecha: Date;
  monto: number;
  metodoPago: string; // Efectivo, Transferencia, Cheque, etc.
  referencia?: string;
  bancoId?: string; // Si el pago se registra en un banco
  notas?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// ============================================================================
// UTILIDADES
// ============================================================================

const docToData = <T>(doc: QueryDocumentSnapshot<DocumentData>): T => {
  const data = doc.data();
  const result: any = { id: doc.id, ...data };

  // Convertir timestamps
  for (const key in result) {
    if (result[key] instanceof Timestamp) {
      result[key] = result[key].toDate();
    }
  }

  return result as T;
};

// ============================================================================
// SERVICIO DE DISTRIBUIDORES
// ============================================================================

export const distribuidoresService = {
  /**
   * Obtiene todos los distribuidores
   */
  async getAll(estado?: DistribuidorEstado): Promise<Distribuidor[]> {
    try {
      let q = query(collection(db, 'distribuidores'), orderBy('nombre'));

      if (estado) {
        q = query(
          collection(db, 'distribuidores'),
          where('estadoDistribuidor', '==', estado),
          orderBy('nombre')
        );
      }

      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc) => docToData<Distribuidor>(doc));
    } catch (error) {
      console.error('❌ Error obteniendo distribuidores:', error);
      throw error;
    }
  },

  /**
   * Obtiene un distribuidor por ID
   */
  async getById(distribuidorId: string): Promise<Distribuidor | null> {
    try {
      const docRef = doc(db, 'distribuidores', distribuidorId);
      const docSnap = await getDoc(docRef);
      return docSnap.exists() ? docToData<Distribuidor>(docSnap) : null;
    } catch (error) {
      console.error('❌ Error obteniendo distribuidor:', error);
      throw error;
    }
  },

  /**
   * Busca distribuidor por nombre (case insensitive)
   */
  async buscarPorNombre(nombre: string): Promise<Distribuidor[]> {
    try {
      const q = query(collection(db, 'distribuidores'), orderBy('nombre'));
      const snapshot = await getDocs(q);

      const distribuidores = snapshot.docs.map((doc) => docToData<Distribuidor>(doc));

      return distribuidores.filter((d) => d.nombre.toLowerCase().includes(nombre.toLowerCase()));
    } catch (error) {
      console.error('❌ Error buscando distribuidor:', error);
      throw error;
    }
  },

  /**
   * Crea un distribuidor (generalmente desde una Orden de Compra)
   */
  async crear(distribuidor: Omit<Distribuidor, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      // Verificar si ya existe por nombre
      const existentes = await this.buscarPorNombre(distribuidor.nombre);
      if (existentes.length > 0) {
        throw new Error(`Ya existe un distribuidor con el nombre "${distribuidor.nombre}"`);
      }

      const docRef = await addDoc(collection(db, 'distribuidores'), {
        ...distribuidor,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      return docRef.id;
    } catch (error) {
      console.error('❌ Error creando distribuidor:', error);
      throw error;
    }
  },

  /**
   * Actualiza un distribuidor
   */
  async actualizar(
    distribuidorId: string,
    data: Partial<Omit<Distribuidor, 'id' | 'createdAt' | 'updatedAt'>>
  ): Promise<void> {
    try {
      const docRef = doc(db, 'distribuidores', distribuidorId);
      await updateDoc(docRef, {
        ...data,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('❌ Error actualizando distribuidor:', error);
      throw error;
    }
  },

  /**
   * Elimina un distribuidor (soft delete - marca como inactivo)
   */
  async eliminar(distribuidorId: string): Promise<void> {
    try {
      await this.actualizar(distribuidorId, {
        activo: false,
        estadoDistribuidor: DistribuidorEstado.INACTIVO,
      });
    } catch (error) {
      console.error('❌ Error eliminando distribuidor:', error);
      throw error;
    }
  },

  /**
   * Elimina permanentemente un distribuidor
   */
  async eliminarPermanente(distribuidorId: string): Promise<void> {
    try {
      const docRef = doc(db, 'distribuidores', distribuidorId);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('❌ Error eliminando permanentemente distribuidor:', error);
      throw error;
    }
  },

  /**
   * Crea distribuidor desde Orden de Compra
   * Este es el flujo principal: PO → Distribuidor Profile
   */
  async crearDesdeOrdenCompra(
    ordenCompraId: string,
    datosDistribuidor: {
      nombre: string;
      empresa?: string;
      email?: string;
      telefono?: string;
      rfc?: string;
      direccion?: string;
      limiteCredito?: number;
      diasCredito?: number;
    },
    montoOrden: number
  ): Promise<string> {
    try {
      return await runTransaction(db, async (transaction) => {
        // 1. Verificar que la OC existe
        const ocRef = doc(db, 'ordenesCompra', ordenCompraId);
        const ocDoc = await transaction.get(ocRef);

        if (!ocDoc.exists()) {
          throw new Error('Orden de compra no encontrada');
        }

        // 2. Verificar si ya existe distribuidor con ese nombre
        const existentes = await this.buscarPorNombre(datosDistribuidor.nombre);

        let distribuidorId: string;

        if (existentes.length > 0) {
          // Ya existe - actualizar datos
          const distribuidorExistente = existentes[0];
          distribuidorId = distribuidorExistente.id!;

          const distRef = doc(db, 'distribuidores', distribuidorId);
          transaction.update(distRef, {
            totalCompras: (distribuidorExistente.totalCompras || 0) + montoOrden,
            deudaActual: (distribuidorExistente.deudaActual || 0) + montoOrden,
            ordenesCompraIds: [...(distribuidorExistente.ordenesCompraIds || []), ordenCompraId],
            updatedAt: serverTimestamp(),
          });
        } else {
          // No existe - crear nuevo
          const nuevoDistRef = doc(collection(db, 'distribuidores'));
          distribuidorId = nuevoDistRef.id;

          transaction.set(nuevoDistRef, {
            nombre: datosDistribuidor.nombre,
            empresa: datosDistribuidor.empresa || '',
            email: datosDistribuidor.email || '',
            telefono: datosDistribuidor.telefono || '',
            rfc: datosDistribuidor.rfc || '',
            direccion: datosDistribuidor.direccion || '',
            ciudad: '',
            estado: '',
            pais: 'México',
            cp: '',
            totalCompras: montoOrden,
            deudaActual: montoOrden,
            limiteCredito: datosDistribuidor.limiteCredito || 100000,
            pagosRealizados: 0,
            diasCredito: datosDistribuidor.diasCredito || 30,
            estadoDistribuidor: DistribuidorEstado.ACTIVO,
            activo: true,
            ordenesCompraIds: [ordenCompraId],
            pagosIds: [],
            creadoPorOCId: ordenCompraId,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          });
        }

        // 3. Actualizar OC con distribuidorId
        transaction.update(ocRef, {
          distribuidorId,
          updatedAt: serverTimestamp(),
        });

        return distribuidorId;
      });
    } catch (error) {
      console.error('❌ Error creando distribuidor desde OC:', error);
      throw error;
    }
  },

  /**
   * Registra un pago de distribuidor
   */
  async registrarPago(
    pago: Omit<PagoDistribuidor, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<string> {
    try {
      return await runTransaction(db, async (transaction) => {
        // 1. Obtener distribuidor
        const distRef = doc(db, 'distribuidores', pago.distribuidorId);
        const distDoc = await transaction.get(distRef);

        if (!distDoc.exists()) {
          throw new Error('Distribuidor no encontrado');
        }

        const distribuidor = docToData<Distribuidor>(distDoc);

        if (distribuidor.deudaActual < pago.monto) {
          throw new Error('El monto del pago excede la deuda actual');
        }

        // 2. Crear pago
        const pagoRef = doc(collection(db, 'pagosDistribuidores'));
        transaction.set(pagoRef, {
          ...pago,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });

        // 3. Actualizar distribuidor
        transaction.update(distRef, {
          deudaActual: distribuidor.deudaActual - pago.monto,
          pagosRealizados: (distribuidor.pagosRealizados || 0) + pago.monto,
          pagosIds: [...(distribuidor.pagosIds || []), pagoRef.id],
          updatedAt: serverTimestamp(),
        });

        // 4. Si tiene bancoId, crear ingreso en ese banco
        if (pago.bancoId) {
          const ingresoRef = doc(collection(db, 'ingresos'));
          transaction.set(ingresoRef, {
            bancoId: pago.bancoId,
            fecha: pago.fecha,
            monto: pago.monto,
            concepto: `Pago de distribuidor: ${distribuidor.nombre}`,
            cliente: distribuidor.nombre,
            notas: pago.notas,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          });

          // Actualizar capital del banco
          const bancoRef = doc(db, 'bancos', pago.bancoId);
          const bancoDoc = await transaction.get(bancoRef);

          if (bancoDoc.exists()) {
            const banco = bancoDoc.data();
            transaction.update(bancoRef, {
              capitalActual: (banco.capitalActual || 0) + pago.monto,
              capitalHistorico: (banco.capitalHistorico || 0) + pago.monto,
              updatedAt: serverTimestamp(),
            });
          }
        }

        return pagoRef.id;
      });
    } catch (error) {
      console.error('❌ Error registrando pago:', error);
      throw error;
    }
  },

  /**
   * Obtiene historial de pagos de un distribuidor
   */
  async getPagos(distribuidorId: string): Promise<PagoDistribuidor[]> {
    try {
      const q = query(
        collection(db, 'pagosDistribuidores'),
        where('distribuidorId', '==', distribuidorId),
        orderBy('fecha', 'desc'),
        limit(100)
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc) => docToData<PagoDistribuidor>(doc));
    } catch (error) {
      console.error('❌ Error obteniendo pagos:', error);
      throw error;
    }
  },

  /**
   * Obtiene distribuidores con deuda
   */
  async getConDeuda(): Promise<Distribuidor[]> {
    try {
      const q = query(
        collection(db, 'distribuidores'),
        where('deudaActual', '>', 0),
        orderBy('deudaActual', 'desc')
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc) => docToData<Distribuidor>(doc));
    } catch (error) {
      console.error('❌ Error obteniendo distribuidores con deuda:', error);
      throw error;
    }
  },

  /**
   * Obtiene distribuidores que exceden su límite de crédito
   */
  async getExcedidosCredito(): Promise<Distribuidor[]> {
    try {
      const todos = await this.getAll(DistribuidorEstado.ACTIVO);
      return todos.filter((d) => d.deudaActual > d.limiteCredito);
    } catch (error) {
      console.error('❌ Error obteniendo distribuidores excedidos:', error);
      throw error;
    }
  },

  /**
   * Suscripción en tiempo real a todos los distribuidores
   */
  onDistribuidoresChange(callback: (distribuidores: Distribuidor[]) => void): Unsubscribe {
    const q = query(collection(db, 'distribuidores'), orderBy('nombre'));
    return onSnapshot(q, (snapshot) => {
      const distribuidores = snapshot.docs.map((doc) => docToData<Distribuidor>(doc));
      callback(distribuidores);
    });
  },

  /**
   * Suscripción en tiempo real a pagos de un distribuidor
   */
  onPagosChange(
    distribuidorId: string,
    callback: (pagos: PagoDistribuidor[]) => void
  ): Unsubscribe {
    const q = query(
      collection(db, 'pagosDistribuidores'),
      where('distribuidorId', '==', distribuidorId),
      orderBy('fecha', 'desc'),
      limit(100)
    );
    return onSnapshot(q, (snapshot) => {
      const pagos = snapshot.docs.map((doc) => docToData<PagoDistribuidor>(doc));
      callback(pagos);
    });
  },
};

export default distribuidoresService;
