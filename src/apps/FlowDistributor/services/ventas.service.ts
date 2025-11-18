/**
 * Servicio para Ventas (Firestore)
 * Optimizado con batch operations, caching y límites de consulta
 */
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  enableIndexedDbPersistence,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
  writeBatch,
} from 'firebase/firestore';

import { db } from '@/lib/firebase';

import { distribuirUtilidad } from '../utils/calculations';
import { almacenService } from './almacen.service';
import { bancosService } from './bancos.service';

const COLLECTION = 'ventas';

// Cache simple en memoria
const cache: {
  all?: { data: Venta[]; timestamp: number };
  byCliente: Map<string, { data: Venta[]; timestamp: number }>;
} = {
  byCliente: new Map(),
};

const CACHE_TTL = 5 * 60 * 1000; // 5 minutos
const MAX_QUERY_LIMIT = 100; // Límite de consultas para optimización

// Habilitar persistencia offline (solo una vez)
let persistenceEnabled = false;
const enablePersistence = async () => {
  if (!persistenceEnabled) {
    try {
      await enableIndexedDbPersistence(db);
      persistenceEnabled = true;
      console.log('✅ Persistencia offline habilitada');
    } catch (err: any) {
      if (err.code === 'failed-precondition') {
        console.warn('⚠️ Persistencia offline no disponible (múltiples pestañas abiertas)');
      } else if (err.code === 'unimplemented') {
        console.warn('⚠️ Persistencia offline no soportada en este navegador');
      }
    }
  }
};

interface Venta {
  id?: string;
  fecha: string;
  ocRelacionada?: string;
  productoId?: string; // Para integración con almacén
  cantidad: number;
  clienteId?: string;
  cliente?: string;
  precioVenta: number;
  costoUnidad?: number; // Costo unitario para cálculo de distribución
  ingreso: number;
  flete?: number;
  utilidad?: number;
  estatus?: string; // PENDIENTE, PAGADO, CANCELADO
  moneda?: string;
  createdAt?: any;
  updatedAt?: any;
}

const handleError = (err: unknown) => {
  throw err;
};

export const ventasService = {
  /**
   * Obtener todas las ventas con caching y límite
   */
  async getAll(maxLimit = MAX_QUERY_LIMIT): Promise<Venta[]> {
    await enablePersistence();

    // Verificar cache
    if (cache.all && Date.now() - cache.all.timestamp < CACHE_TTL) {
      console.log('✅ Usando cache para ventas');
      return cache.all.data;
    }

    try {
      const q = query(collection(db, COLLECTION), orderBy('fecha', 'desc'), limit(maxLimit));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() })) as Venta[];

      // Actualizar cache
      cache.all = { data, timestamp: Date.now() };

      return data;
    } catch (err) {
      handleError(err);
      return [];
    }
  },

  async getById(id: string): Promise<Venta | null> {
    try {
      const ref = doc(db, COLLECTION, id);
      const snap = await getDoc(ref);
      if (!snap.exists()) return null;
      return { id: snap.id, ...snap.data() } as Venta;
    } catch (err) {
      handleError(err);
      return null;
    }
  },

  /**
   * Crear venta e invalidar cache
   * @description Crea venta y automáticamente:
   * - Registra salida en almacén (si hay productoId)
   * - Distribuye ingreso a bancos según fórmulas configuradas
   */
  async create(data: Omit<Venta, 'id'>): Promise<string> {
    await enablePersistence();

    try {
      const docRef = await addDoc(collection(db, COLLECTION), {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      const ventaId = docRef.id;

      // PASO 1: Registrar salida en almacén si hay productoId
      try {
        if (data.productoId && data.cantidad > 0) {
          await almacenService.registrarSalida(
            data.productoId,
            data.cantidad,
            ventaId,
            `Venta a ${data.cliente || data.clienteId || 'Sin cliente'}`
          );
          console.log('✅ Salida registrada en almacén para venta:', ventaId);
        }
      } catch (almacenError) {
        console.warn('⚠️ Error al registrar salida en almacén:', almacenError);
        // No lanzar error, la venta ya fue creada
      }

      // PASO 2: Distribuir ingreso a bancos automáticamente cuando estatus = PAGADO
      try {
        if (data.estatus === 'PAGADO' && data.cantidad && data.precioVenta) {
          await this.distribuirABancos({
            ventaId,
            cantidad: data.cantidad,
            precioVenta: data.precioVenta,
            costoUnidad: (data as any).costoUnidad || 0,
            aplicaFlete: !!data.flete,
            montoFlete: data.flete,
            cliente: data.cliente || 'Sin cliente',
          });
          console.log('✅ Ingreso distribuido a bancos para venta:', ventaId);
        }
      } catch (bancosError) {
        console.warn('⚠️ Error al distribuir ingreso a bancos:', bancosError);
        // No lanzar error, la venta ya fue creada
      }

      // Invalidar cache
      cache.all = undefined;
      if (data.clienteId) {
        cache.byCliente.delete(data.clienteId);
      }

      return ventaId;
    } catch (err) {
      handleError(err);
      throw err;
    }
  },

  async createWithStockUpdate(venta: Omit<Venta, 'id'>): Promise<string> {
    try {
      // Verificar stock disponible usando almacén service si hay productoId
      if (venta.productoId && venta.cantidad) {
        const producto = await almacenService.getProductoById(venta.productoId);
        if (!producto) throw new Error('Producto no encontrado');
        if (producto.stockActual < venta.cantidad) {
          throw new Error(
            `Stock insuficiente. Disponible: ${producto.stockActual} ${producto.unidad}, Requerido: ${venta.cantidad}`
          );
        }
      }

      // Crear venta (automáticamente registra salida en almacén)
      const ventaId = await this.create(venta);
      return ventaId;
    } catch (err) {
      handleError(err);
      throw err;
    }
  },

  /**
   * Actualizar venta e invalidar cache
   */
  async update(id: string, data: Partial<Venta>): Promise<void> {
    await enablePersistence();

    try {
      const ref = doc(db, COLLECTION, id);
      await updateDoc(ref, { ...data, updatedAt: serverTimestamp() });

      // Invalidar cache
      cache.all = undefined;
      if (data.clienteId) {
        cache.byCliente.delete(data.clienteId);
      }
    } catch (err) {
      handleError(err);
      throw err;
    }
  },

  /**
   * Eliminar venta e invalidar cache
   */
  async delete(id: string): Promise<void> {
    await enablePersistence();

    try {
      await deleteDoc(doc(db, COLLECTION, id));

      // Invalidar todo el cache
      cache.all = undefined;
      cache.byCliente.clear();
    } catch (err) {
      handleError(err);
      throw err;
    }
  },

  /**
   * Operación batch: Crear múltiples ventas de forma eficiente
   */
  async createBatch(ventas: Omit<Venta, 'id'>[]): Promise<string[]> {
    await enablePersistence();

    try {
      const batch = writeBatch(db);
      const ids: string[] = [];

      ventas.forEach((venta) => {
        const ref = doc(collection(db, COLLECTION));
        batch.set(ref, {
          ...venta,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
        ids.push(ref.id);
      });

      await batch.commit();

      // Invalidar cache
      cache.all = undefined;
      ventas.forEach((v) => {
        if (v.clienteId) cache.byCliente.delete(v.clienteId);
      });

      console.log(`✅ Batch creado: ${ventas.length} ventas`);
      return ids;
    } catch (err) {
      handleError(err);
      throw err;
    }
  },

  /**
   * Operación batch: Actualizar múltiples ventas
   */
  async updateBatch(updates: { id: string; data: Partial<Venta> }[]): Promise<void> {
    await enablePersistence();

    try {
      const batch = writeBatch(db);

      updates.forEach(({ id, data }) => {
        const ref = doc(db, COLLECTION, id);
        batch.update(ref, { ...data, updatedAt: serverTimestamp() });
      });

      await batch.commit();

      // Invalidar cache
      cache.all = undefined;
      updates.forEach(({ data }) => {
        if (data.clienteId) cache.byCliente.delete(data.clienteId);
      });

      console.log(`✅ Batch actualizado: ${updates.length} ventas`);
    } catch (err) {
      handleError(err);
      throw err;
    }
  },

  /**
   * Operación batch: Eliminar múltiples ventas
   */
  async deleteBatch(ids: string[]): Promise<void> {
    await enablePersistence();

    try {
      const batch = writeBatch(db);

      ids.forEach((id) => {
        const ref = doc(db, COLLECTION, id);
        batch.delete(ref);
      });

      await batch.commit();

      // Invalidar todo el cache
      cache.all = undefined;
      cache.byCliente.clear();

      console.log(`✅ Batch eliminado: ${ids.length} ventas`);
    } catch (err) {
      handleError(err);
      throw err;
    }
  },

  /**
   * Limpiar cache manualmente
   */
  clearCache(): void {
    cache.all = undefined;
    cache.byCliente.clear();
    console.log('🗑️ Cache limpiado');
  },

  /**
   * Obtener ventas por cliente con caching
   */
  async getByCliente(clienteId: string, maxLimit = MAX_QUERY_LIMIT): Promise<Venta[]> {
    await enablePersistence();

    // Verificar cache por cliente
    const cached = cache.byCliente.get(clienteId);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      console.log(`✅ Usando cache para cliente ${clienteId}`);
      return cached.data;
    }

    try {
      const q = query(
        collection(db, COLLECTION),
        where('clienteId', '==', clienteId),
        orderBy('fecha', 'desc'),
        limit(maxLimit)
      );
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() })) as Venta[];

      // Actualizar cache
      cache.byCliente.set(clienteId, { data, timestamp: Date.now() });

      return data;
    } catch (err) {
      handleError(err);
      return [];
    }
  },

  async getTotalIngresos(fechaInicio?: string, fechaFin?: string): Promise<number> {
    try {
      let q = query(collection(db, COLLECTION));

      if (fechaInicio) {
        q = query(q, where('fecha', '>=', fechaInicio));
      }
      if (fechaFin) {
        q = query(q, where('fecha', '<=', fechaFin));
      }

      const snapshot = await getDocs(q);
      return snapshot.docs.reduce((sum, doc) => {
        const data = doc.data();
        return sum + (data.ingreso || 0);
      }, 0);
    } catch (err) {
      handleError(err);
      return 0;
    }
  },

  /**
   * Distribuye el ingreso de una venta a los bancos correspondientes
   * Sigue la lógica del negocio: Bóveda Monte (costo), Flete Sur (flete), Utilidades (utilidad)
   */
  async distribuirABancos(params: {
    ventaId: string;
    cantidad: number;
    precioVenta: number;
    costoUnidad: number;
    aplicaFlete: boolean;
    montoFlete?: number;
    cliente: string;
  }): Promise<void> {
    try {
      const { ventaId, cantidad, precioVenta, costoUnidad, aplicaFlete, montoFlete, cliente } =
        params;

      // Calcular distribución según lógica del negocio
      const distribucion = distribuirUtilidad(
        {
          cantidad,
          precioVenta,
          costoUnidad,
          aplicaFlete,
          montoFlete,
        },
        18.5 // Tipo de cambio por defecto, se puede obtener del store
      );

      const fecha = new Date();
      const concepto = `Venta a ${cliente}`;

      // 1. Ingreso en Bóveda Monte (recuperar costo de mercancía)
      if (distribucion.distribucion.bovedaMonte > 0) {
        await bancosService.crearIngreso({
          bancoId: 'boveda-monte',
          monto: distribucion.distribucion.bovedaMonte,
          fecha,
          concepto: `${concepto} - Costo recuperado`,
          ventaId,
          cliente,
          notas: `${cantidad} unidades @ $${costoUnidad} USD`,
        });
      }

      // 2. Ingreso en Flete Sur (si aplica flete)
      if (distribucion.distribucion.fleteSur > 0) {
        await bancosService.crearIngreso({
          bancoId: 'fletes',
          monto: distribucion.distribucion.fleteSur,
          fecha,
          concepto: `${concepto} - Flete`,
          ventaId,
          cliente,
          notas: `Flete para ${cantidad} unidades`,
        });
      }

      // 3. Ingreso en Utilidades (utilidad neta)
      if (distribucion.distribucion.utilidades > 0) {
        await bancosService.crearIngreso({
          bancoId: 'utilidades',
          monto: distribucion.distribucion.utilidades,
          fecha,
          concepto: `${concepto} - Utilidad neta`,
          ventaId,
          cliente,
          notas: `Margen: ${distribucion.margen.toFixed(2)}% | Venta: $${distribucion.ingresoVenta.toFixed(2)} USD`,
        });
      }

      console.log('✅ Distribución completada:', {
        bovedaMonte: distribucion.distribucion.bovedaMonte,
        fleteSur: distribucion.distribucion.fleteSur,
        utilidades: distribucion.distribucion.utilidades,
        margen: `${distribucion.margen.toFixed(2)}%`,
      });
    } catch (error) {
      console.error('❌ Error distribuyendo ingreso a bancos:', error);
      throw error;
    }
  },
};
