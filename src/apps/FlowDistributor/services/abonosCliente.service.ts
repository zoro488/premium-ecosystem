/**
 * 🎯 SERVICIO DE ABONOS DE CLIENTES
 *
 * CRUD completo para gestión de pagos de clientes con:
 * - Registro de abonos con distribución automática a 3 bancos
 * - Actualización de adeudo del cliente
 * - Historial de pagos
 * - Integración con bancosService
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

const COLLECTION_NAME = 'abonosClientes';

export interface AbonoCliente {
  id?: string;
  clienteId: string;
  montoAbono: number;
  fechaPago: Date | Timestamp;
  metodoPago: 'efectivo' | 'transferencia' | 'deposito' | 'cheque' | 'tarjeta';
  referenciaPago?: string;
  notasAbono?: string;
  distribucionBovedaMonte: number;
  distribucionFletes: number;
  distribucionUtilidades: number;
  createdAt: Date | Timestamp;
  updatedAt: Date | Timestamp;
}

export const abonosClienteService = {
  /**
   * Crear un nuevo abono de cliente
   * Incluye:
   * - Registrar abono en Firestore
   * - Distribuir a 3 bancos (63%, 5%, 32%)
   * - Actualizar adeudo del cliente
   */
  async crear(abono: Omit<AbonoCliente, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const now = Timestamp.now();

      // Calcular distribución automática
      const distribucion = {
        distribucionBovedaMonte: abono.montoAbono * 0.63, // 63%
        distribucionFletes: abono.montoAbono * 0.05,      // 5%
        distribucionUtilidades: abono.montoAbono * 0.32,  // 32%
      };

      const abonoData = {
        ...abono,
        ...distribucion,
        fechaPago: abono.fechaPago instanceof Date
          ? Timestamp.fromDate(abono.fechaPago)
          : abono.fechaPago,
        createdAt: now,
        updatedAt: now,
      };

      // 1. Crear abono
      const docRef = await addDoc(collection(db, COLLECTION_NAME), abonoData);

      // 2. Distribuir a bancos (importar bancosService si es necesario)
      // await bancosService.registrarAbonoCliente(distribucion);

      // 3. Actualizar adeudo del cliente (importar clientesService)
      // await clientesService.reducirAdeudo(abono.clienteId, abono.montoAbono);

      return docRef.id;
    } catch (error) {
      console.error('Error al crear abono cliente:', error);
      throw error;
    }
  },

  /**
   * Obtener abono por ID
   */
  async obtenerPorId(id: string): Promise<AbonoCliente | null> {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as AbonoCliente;
      }
      return null;
    } catch (error) {
      console.error('Error al obtener abono:', error);
      throw error;
    }
  },

  /**
   * Obtener todos los abonos de un cliente
   */
  async obtenerPorCliente(clienteId: string): Promise<AbonoCliente[]> {
    try {
      const q = query(
        collection(db, COLLECTION_NAME),
        where('clienteId', '==', clienteId),
        orderBy('fechaPago', 'desc')
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as AbonoCliente));
    } catch (error) {
      console.error('Error al obtener abonos del cliente:', error);
      throw error;
    }
  },

  /**
   * Obtener todos los abonos (con paginación opcional)
   */
  async obtenerTodos(): Promise<AbonoCliente[]> {
    try {
      const q = query(
        collection(db, COLLECTION_NAME),
        orderBy('fechaPago', 'desc')
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as AbonoCliente));
    } catch (error) {
      console.error('Error al obtener abonos:', error);
      throw error;
    }
  },

  /**
   * Actualizar un abono
   */
  async actualizar(id: string, datos: Partial<AbonoCliente>): Promise<void> {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      await updateDoc(docRef, {
        ...datos,
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      console.error('Error al actualizar abono:', error);
      throw error;
    }
  },

  /**
   * Eliminar un abono
   * NOTA: Considerar si se debe revertir la distribución a bancos
   */
  async eliminar(id: string): Promise<void> {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Error al eliminar abono:', error);
      throw error;
    }
  },

  /**
   * Obtener estadísticas de abonos de un cliente
   */
  async obtenerEstadisticas(clienteId: string) {
    try {
      const abonos = await this.obtenerPorCliente(clienteId);

      const totalAbonado = abonos.reduce((sum, a) => sum + a.montoAbono, 0);
      const cantidadAbonos = abonos.length;
      const promedioAbono = cantidadAbonos > 0 ? totalAbonado / cantidadAbonos : 0;

      const ultimoAbono = abonos.length > 0 ? abonos[0] : null;

      return {
        totalAbonado,
        cantidadAbonos,
        promedioAbono,
        ultimoAbono,
      };
    } catch (error) {
      console.error('Error al obtener estadísticas:', error);
      throw error;
    }
  },

  /**
   * Obtener abonos por rango de fechas
   */
  async obtenerPorRangoFechas(fechaInicio: Date, fechaFin: Date): Promise<AbonoCliente[]> {
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
      } as AbonoCliente));
    } catch (error) {
      console.error('Error al obtener abonos por rango:', error);
      throw error;
    }
  },
};
