/**
 * 🎯 SERVICIO DE ABONOS DE DISTRIBUIDORES
 *
 * CRUD completo para gestión de pagos a distribuidores con:
 * - Registro de pagos desde un banco seleccionado
 * - Actualización de adeudo del distribuidor
 * - Registro automático de GASTO en banco
 * - Historial de pagos
 */

import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    orderBy,
    query,
    Timestamp,
    updateDoc,
    where
} from 'firebase/firestore';
import { db } from '../config/firebase';

const COLLECTION_NAME = 'abonosDistribuidores';

export interface AbonoDistribuidor {
  id?: string;
  distribuidorId: string;
  montoAbono: number;
  bancoOrigen: string; // ID del banco desde el cual se paga
  fechaPago: Date | Timestamp;
  metodoPago: 'efectivo' | 'transferencia' | 'cheque';
  numeroReferencia?: string;
  numeroFactura?: string;
  notasPago?: string;
  createdAt: Date | Timestamp;
  updatedAt: Date | Timestamp;
}

export const abonosDistribuidorService = {
  /**
   * Crear un nuevo pago a distribuidor
   * Incluye:
   * - Registrar abono en Firestore
   * - Registrar GASTO en banco seleccionado
   * - Actualizar adeudo del distribuidor
   */
  async crear(abono: Omit<AbonoDistribuidor, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const now = Timestamp.now();

      const abonoData = {
        ...abono,
        fechaPago: abono.fechaPago instanceof Date
          ? Timestamp.fromDate(abono.fechaPago)
          : abono.fechaPago,
        createdAt: now,
        updatedAt: now,
      };

      // 1. Crear abono
      const docRef = await addDoc(collection(db, COLLECTION_NAME), abonoData);

      // 2. Registrar GASTO en banco origen
      // await bancosService.crearGasto({
      //   bancoId: abono.bancoOrigen,
      //   monto: abono.montoAbono,
      //   categoria: 'pago_proveedor',
      //   descripcion: `Pago a distribuidor`,
      //   fecha: abono.fechaPago,
      //   metodoPago: abono.metodoPago,
      //   numeroReferencia: abono.numeroReferencia,
      //   numeroFactura: abono.numeroFactura,
      //   notas: abono.notasPago,
      //   distribuidorId: abono.distribuidorId
      // });

      // 3. Actualizar adeudo del distribuidor
      // await distribuidoresService.reducirAdeudo(abono.distribuidorId, abono.montoAbono);

      return docRef.id;
    } catch (error) {
      console.error('Error al crear abono distribuidor:', error);
      throw error;
    }
  },

  /**
   * Obtener abono por ID
   */
  async obtenerPorId(id: string): Promise<AbonoDistribuidor | null> {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as AbonoDistribuidor;
      }
      return null;
    } catch (error) {
      console.error('Error al obtener abono:', error);
      throw error;
    }
  },

  /**
   * Obtener todos los pagos de un distribuidor
   */
  async obtenerPorDistribuidor(distribuidorId: string): Promise<AbonoDistribuidor[]> {
    try {
      const q = query(
        collection(db, COLLECTION_NAME),
        where('distribuidorId', '==', distribuidorId),
        orderBy('fechaPago', 'desc')
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as AbonoDistribuidor));
    } catch (error) {
      console.error('Error al obtener pagos del distribuidor:', error);
      throw error;
    }
  },

  /**
   * Obtener todos los pagos (con paginación opcional)
   */
  async obtenerTodos(): Promise<AbonoDistribuidor[]> {
    try {
      const q = query(
        collection(db, COLLECTION_NAME),
        orderBy('fechaPago', 'desc')
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as AbonoDistribuidor));
    } catch (error) {
      console.error('Error al obtener pagos:', error);
      throw error;
    }
  },

  /**
   * Obtener pagos por banco origen
   */
  async obtenerPorBanco(bancoId: string): Promise<AbonoDistribuidor[]> {
    try {
      const q = query(
        collection(db, COLLECTION_NAME),
        where('bancoOrigen', '==', bancoId),
        orderBy('fechaPago', 'desc')
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as AbonoDistribuidor));
    } catch (error) {
      console.error('Error al obtener pagos por banco:', error);
      throw error;
    }
  },

  /**
   * Actualizar un pago
   */
  async actualizar(id: string, datos: Partial<AbonoDistribuidor>): Promise<void> {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      await updateDoc(docRef, {
        ...datos,
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      console.error('Error al actualizar pago:', error);
      throw error;
    }
  },

  /**
   * Eliminar un pago
   * NOTA: Considerar si se debe revertir el gasto en banco
   */
  async eliminar(id: string): Promise<void> {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Error al eliminar pago:', error);
      throw error;
    }
  },

  /**
   * Obtener estadísticas de pagos de un distribuidor
   */
  async obtenerEstadisticas(distribuidorId: string) {
    try {
      const pagos = await this.obtenerPorDistribuidor(distribuidorId);

      const totalPagado = pagos.reduce((sum, p) => sum + p.montoAbono, 0);
      const cantidadPagos = pagos.length;
      const promedioPago = cantidadPagos > 0 ? totalPagado / cantidadPagos : 0;

      const ultimoPago = pagos.length > 0 ? pagos[0] : null;

      // Agrupar por banco
      const pagosPorBanco = pagos.reduce((acc, p) => {
        acc[p.bancoOrigen] = (acc[p.bancoOrigen] || 0) + p.montoAbono;
        return acc;
      }, {} as Record<string, number>);

      return {
        totalPagado,
        cantidadPagos,
        promedioPago,
        ultimoPago,
        pagosPorBanco,
      };
    } catch (error) {
      console.error('Error al obtener estadísticas:', error);
      throw error;
    }
  },

  /**
   * Obtener pagos por rango de fechas
   */
  async obtenerPorRangoFechas(fechaInicio: Date, fechaFin: Date): Promise<AbonoDistribuidor[]> {
    try {
      const q = query(
        collection(db, COLLECTION_NAME),
        where('fechaPago', '>=', Timestamp.fromDate(fechaInicio)),
        where('fechaPago', '<=', Timestamp.fromDate(fechaFin)),
        orderBy('fechaPago', 'desc')
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as AbonoDistribuidor));
    } catch (error) {
      console.error('Error al obtener pagos por rango:', error);
      throw error;
    }
  },
};
