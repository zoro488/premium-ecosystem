/**
 * FlowDistributor - Servicio de Órdenes de Compra
 * @module FlowDistributor/services/ordenesCompra
 */
import {
  type DocumentData,
  type QueryDocumentSnapshot,
  Timestamp,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  runTransaction,
  serverTimestamp,
  updateDoc,
  where,
} from 'firebase/firestore';
import { ZodError } from 'zod';

import { db } from '@/lib/firebase';
import { flowLogger } from '@/utils/logger';

import { OrdenCompraSchema } from '../schemas';
import type {
  CreateDTO,
  OCEstado,
  OrdenCompra,
  PaginatedResult,
  SearchFilters,
  UpdateDTO,
} from '../types';
import { almacenService } from './almacen.service';
import { distribuidoresService } from './distribuidores.service';

// ============================================================================
// TIPOS
// ============================================================================

interface OrdenesCompraFilters extends SearchFilters {
  estado?: OCEstado;
  distribuidorId?: string;
  origen?: string;
  stockBajo?: boolean;
}

// ============================================================================
// UTILIDADES
// ============================================================================

/**
 * Convierte documento de Firestore a OrdenCompra
 */
const docToOrdenCompra = (doc: QueryDocumentSnapshot<DocumentData>): OrdenCompra => {
  const data = doc.data();
  return {
    id: doc.id,
    ...data,
    fecha: data.fecha?.toDate() || new Date(),
    fechaEstimadaEntrega: data.fechaEstimadaEntrega?.toDate(),
    fechaRecepcion: data.fechaRecepcion?.toDate(),
    createdAt: data.createdAt?.toDate() || new Date(),
    updatedAt: data.updatedAt?.toDate() || new Date(),
  } as OrdenCompra;
};

/**
 * Genera número de OC automático
 */
const generarNumeroOC = async (): Promise<string> => {
  const year = new Date().getFullYear();
  const q = query(
    collection(db, 'ordenes_compra'),
    where('numeroOC', '>=', `OC-${year}-`),
    where('numeroOC', '<', `OC-${year + 1}-`),
    orderBy('numeroOC', 'desc'),
    limit(1)
  );

  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    return `OC-${year}-0001`;
  }

  const ultimoNumero = snapshot.docs[0].data().numeroOC as string;
  const numero = parseInt(ultimoNumero.split('-')[2], 10) + 1;
  return `OC-${year}-${numero.toString().padStart(4, '0')}`;
};

// ============================================================================
// SERVICIO
// ============================================================================

/**
 * Servicio para Ordenes de Compra (Firestore)
 */
export const ordenesCompraService = {
  /**
   * Obtiene todas las órdenes de compra con filtros y paginación
   */
  async getAll(
    filters?: OrdenesCompraFilters,
    page = 1,
    pageSize = 50
  ): Promise<PaginatedResult<OrdenCompra>> {
    try {
      const q = query(collection(db, 'ordenes_compra'), orderBy('fecha', 'desc'));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((d) => ({ id: d.id, ...(d.data() as any) })) as OrdenCompra[];

      // Filtro adicional para stock bajo (se hace en cliente)
      const filteredData = filters?.stockBajo
        ? data.filter((oc) => oc.stockActual < oc.stockMinimo)
        : data;

      return {
        data: filteredData,
        total: data.length,
        page,
        pageSize,
        totalPages: Math.ceil(data.length / pageSize),
        hasNext: page < Math.ceil(data.length / pageSize),
        hasPrev: page > 1,
      };
    } catch (_error) {
      throw new Error('No se pudieron obtener las órdenes de compra');
    }
  },

  /**
   * Obtiene una orden de compra por ID
   */
  async getById(id: string): Promise<OrdenCompra | null> {
    const ref = doc(db, 'ordenes_compra', id);
    const snap = await getDoc(ref);
    if (!snap.exists()) return null;
    return { id: snap.id, ...(snap.data() as any) } as OrdenCompra;
  },

  /**
   * Obtiene orden de compra por número
   */
  async getByNumero(numeroOC: string): Promise<OrdenCompra | null> {
    try {
      const q = query(
        collection(db, 'ordenes_compra'),
        where('numeroOC', '==', numeroOC),
        limit(1)
      );

      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        return null;
      }

      return docToOrdenCompra(snapshot.docs[0]);
    } catch (_error) {
      throw new Error('No se pudo obtener la orden de compra');
    }
  },

  /**
   * Crea una nueva orden de compra
   * @description Crea OC y automáticamente:
   * - Crea/actualiza distribuidor
   * - Registra entrada en almacén (si hay productoId)
   */
  async create(data: CreateDTO<OrdenCompra>): Promise<string> {
    try {
      // Validar datos
      const validated = OrdenCompraSchema.parse(data);

      // Verificar si ya existe el número de OC
      if (data.numeroOC) {
        const existing = await this.getByNumero(data.numeroOC);
        if (existing) {
          throw new Error(`Ya existe una OC con el número ${data.numeroOC}`);
        }
      }

      // Generar número de OC si no se proporciona
      const numeroOC = data.numeroOC || (await generarNumeroOC());

      // Crear documento OC
      const docRef = await addDoc(collection(db, 'ordenes_compra'), {
        ...validated,
        numeroOC,
        fecha: Timestamp.fromDate(validated.fecha as Date),
        fechaEstimadaEntrega: validated.fechaEstimadaEntrega
          ? Timestamp.fromDate(validated.fechaEstimadaEntrega as Date)
          : null,
        fechaRecepcion: validated.fechaRecepcion
          ? Timestamp.fromDate(validated.fechaRecepcion as Date)
          : null,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      const ocId = docRef.id;

      // PASO 1: Crear/actualizar distribuidor automáticamente
      try {
        if (data.distribuidor && data.distribuidorId) {
          await distribuidoresService.crearDesdeOrdenCompra({
            ordenCompraId: ocId,
            nombreDistribuidor: data.distribuidor,
            montoCompra: data.costoTotal,
            diasCredito: data.diasCredito || 30,
            limiteCredito: data.limiteCredito,
            telefono: data.telefonoDistribuidor,
            email: data.emailDistribuidor,
          });

          flowLogger.info('✅ Distribuidor creado/actualizado desde OC:', data.distribuidor);
        }
      } catch (distribError) {
        flowLogger.warn('⚠️ Error al crear distribuidor:', distribError);
        // No lanzar error, continuar con OC
      }

      // PASO 2: Registrar entrada en almacén (si hay productoId)
      try {
        if (data.productoId && data.cantidadTotal > 0) {
          await almacenService.registrarEntrada(
            data.productoId,
            data.cantidadTotal,
            data.costoUnitario || data.costoTotal / data.cantidadTotal,
            ocId,
            `Entrada desde OC ${numeroOC} - ${data.distribuidor || 'Sin distribuidor'}`
          );

          flowLogger.info('✅ Entrada registrada en almacén para producto:', data.productoId);
        }
      } catch (almacenError) {
        flowLogger.warn('⚠️ Error al registrar entrada en almacén:', almacenError);
        // No lanzar error, la OC ya fue creada
      }

      flowLogger.info('✅ Orden de compra creada con integraciones:', ocId);
      return ocId;
    } catch (error) {
      if (error instanceof ZodError) {
        const messages = error.errors.map((e) => e.message).join(', ');
        throw new Error(`Error de validación: ${messages}`);
      }
      throw error instanceof Error ? error : new Error('No se pudo crear la orden de compra');
    }
  },

  /**
   * Actualiza una orden de compra
   */
  async update(id: string, data: UpdateDTO<OrdenCompra>): Promise<void> {
    const ref = doc(db, 'ordenes_compra', id);
    await updateDoc(ref, { ...data, updatedAt: serverTimestamp() });
  },

  /**
   * Elimina una orden de compra
   */
  async delete(id: string): Promise<void> {
    await deleteDoc(doc(db, 'ordenes_compra', id));
  },

  /**
   * Registra la recepción de una orden de compra
   * @description Actualiza OC y registra entrada adicional en almacén si aplica
   */
  async registrarRecepcion(
    id: string,
    cantidadRecibida: number,
    notasRecepcion?: string
  ): Promise<void> {
    try {
      await runTransaction(db, async (transaction) => {
        const docRef = doc(db, 'ordenes_compra', id);
        const docSnap = await transaction.get(docRef);

        if (!docSnap.exists()) {
          throw new Error('Orden de compra no encontrada');
        }

        const oc = docToOrdenCompra(docSnap as QueryDocumentSnapshot<DocumentData>);

        // Validar cantidad
        if (cantidadRecibida > oc.cantidadTotal) {
          throw new Error('La cantidad recibida no puede exceder la cantidad total');
        }

        // Calcular nuevo estado
        let nuevoEstado: OCEstado = oc.estado;
        if (cantidadRecibida === oc.cantidadTotal) {
          nuevoEstado = OCEstado.RECIBIDA;
        } else if (cantidadRecibida > 0) {
          nuevoEstado = OCEstado.PARCIAL;
        }

        // Actualizar
        transaction.update(docRef, {
          cantidadRecibida,
          stockActual: oc.stockActual + cantidadRecibida,
          fechaRecepcion: serverTimestamp(),
          estado: nuevoEstado,
          notasRecepcion,
          updatedAt: serverTimestamp(),
        });

        flowLogger.info('✅ Recepción registrada para OC:', id);
      });

      // PASO 2: Registrar entrada adicional en almacén si hay diferencia
      try {
        const oc = await this.getById(id);
        if (oc && oc.productoId) {
          const cantidadYaRegistrada = oc.cantidadTotal; // Primera entrada
          const diferencia = cantidadRecibida - cantidadYaRegistrada;

          if (diferencia > 0) {
            await almacenService.registrarEntrada(
              oc.productoId,
              diferencia,
              oc.costoUnitario || oc.costoTotal / cantidadRecibida,
              id,
              `Recepción parcial OC ${oc.numeroOC} - ${notasRecepcion || 'Sin notas'}`
            );

            flowLogger.info('✅ Entrada adicional registrada en almacén:', diferencia);
          }
        }
      } catch (almacenError) {
        flowLogger.warn('⚠️ Error al registrar recepción en almacén:', almacenError);
      }
    } catch (error) {
      throw error instanceof Error ? error : new Error('No se pudo registrar la recepción');
    }
  },

  /**
   * Registra un pago a distribuidor
   * @description Actualiza OC y registra pago en distribuidores.service
   */
  async registrarPago(id: string, montoPago: number, bancoOrigenId?: string): Promise<void> {
    try {
      await runTransaction(db, async (transaction) => {
        const docRef = doc(db, 'ordenes_compra', id);
        const docSnap = await transaction.get(docRef);

        if (!docSnap.exists()) {
          throw new Error('Orden de compra no encontrada');
        }

        const oc = docToOrdenCompra(docSnap as QueryDocumentSnapshot<DocumentData>);

        // Validar monto
        if (montoPago <= 0) {
          throw new Error('El monto del pago debe ser positivo');
        }

        if (montoPago > oc.saldoPendiente) {
          throw new Error('El monto del pago no puede exceder el saldo pendiente');
        }

        const nuevoPagoTotal = oc.pagoDistribuidor + montoPago;
        const nuevoSaldo = oc.costoTotal - nuevoPagoTotal;

        // Determinar nuevo estado
        let nuevoEstado: OCEstado = oc.estado;
        if (nuevoSaldo === 0 && oc.estado === OCEstado.RECIBIDA) {
          nuevoEstado = OCEstado.PAGADA;
        }

        // Actualizar
        transaction.update(docRef, {
          pagoDistribuidor: nuevoPagoTotal,
          saldoPendiente: nuevoSaldo,
          estado: nuevoEstado,
          updatedAt: serverTimestamp(),
        });

        flowLogger.info('✅ Pago registrado para OC:', id);
      });

      // PASO 2: Registrar pago en distribuidor (crea gasto en banco)
      try {
        const oc = await this.getById(id);
        if (oc && oc.distribuidorId && bancoOrigenId) {
          await distribuidoresService.registrarPago(
            oc.distribuidorId,
            montoPago,
            bancoOrigenId,
            `Pago OC ${oc.numeroOC}`,
            id
          );

          flowLogger.info('✅ Pago registrado en distribuidor y banco:', oc.distribuidorId);
        }
      } catch (distribError) {
        flowLogger.warn('⚠️ Error al registrar pago en distribuidor:', distribError);
      }
    } catch (error) {
      throw error instanceof Error ? error : new Error('No se pudo registrar el pago');
    }
  },

  /**
   * Actualiza el stock después de una venta
   */
  async actualizarStock(id: string, cantidadVendida: number): Promise<void> {
    try {
      await runTransaction(db, async (transaction) => {
        const docRef = doc(db, 'ordenes_compra', id);
        const docSnap = await transaction.get(docRef);

        if (!docSnap.exists()) {
          throw new Error('Orden de compra no encontrada');
        }

        const oc = docToOrdenCompra(docSnap as QueryDocumentSnapshot<DocumentData>);

        // Validar stock disponible
        if (cantidadVendida > oc.stockActual) {
          throw new Error('Stock insuficiente');
        }

        const nuevoStock = oc.stockActual - cantidadVendida;

        transaction.update(docRef, {
          stockActual: nuevoStock,
          updatedAt: serverTimestamp(),
        });

        flowLogger.info('✅ Stock actualizado para OC:', id);
      });
    } catch (error) {
      throw error instanceof Error ? error : new Error('No se pudo actualizar el stock');
    }
  },

  /**
   * Obtiene estadísticas de órdenes de compra
   */
  async getEstadisticas(): Promise<{
    total: number;
    porEstado: Record<OCEstado, number>;
    montoTotal: number;
    montoPendiente: number;
    stockBajo: number;
  }> {
    try {
      const snapshot = await getDocs(collection(db, 'ordenes_compra'));
      const ordenes = snapshot.docs.map(docToOrdenCompra);

      const stats = {
        total: ordenes.length,
        porEstado: {
          [OCEstado.PENDIENTE]: 0,
          [OCEstado.EN_TRANSITO]: 0,
          [OCEstado.RECIBIDA]: 0,
          [OCEstado.PARCIAL]: 0,
          [OCEstado.PAGADA]: 0,
          [OCEstado.CANCELADA]: 0,
        },
        montoTotal: 0,
        montoPendiente: 0,
        stockBajo: 0,
      };

      ordenes.forEach((oc) => {
        stats.porEstado[oc.estado]++;
        stats.montoTotal += oc.costoTotal;
        stats.montoPendiente += oc.saldoPendiente;
        if (oc.stockActual < oc.stockMinimo) {
          stats.stockBajo++;
        }
      });

      return stats;
    } catch (_error) {
      throw new Error('No se pudieron obtener las estadísticas');
    }
  },

  /**
   * Obtiene alertas de stock bajo
   */
  async getAlertasStockBajo(): Promise<OrdenCompra[]> {
    try {
      const snapshot = await getDocs(collection(db, 'ordenes_compra'));
      const ordenes = snapshot.docs.map(docToOrdenCompra);

      return ordenes.filter(
        (oc) => oc.stockActual < oc.stockMinimo && oc.estado !== OCEstado.CANCELADA
      );
    } catch (_error) {
      throw new Error('No se pudieron obtener las alertas');
    }
  },
};

export default ordenesCompraService;
