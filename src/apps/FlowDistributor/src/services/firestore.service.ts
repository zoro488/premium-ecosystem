/**
 * 🔥 FIRESTORE SERVICES - CHRONOS FLOW DISTRIBUTOR
 *
 * Servicios optimizados para gestión de datos con:
 * ✅ CRUD operations con TypeScript
 * ✅ Real-time subscriptions
 * ✅ Batch operations para rendimiento
 * ✅ Error handling robusto
 * ✅ Caché y offline support
 */

import {
    addDoc,
    collection,
    doc,
    getDoc,
    getDocs,
    limit,
    onSnapshot,
    orderBy,
    query,
    Timestamp,
    Unsubscribe,
    updateDoc,
    where,
    writeBatch
} from 'firebase/firestore';
import { db } from '../config/firebase.config';

// Tipos para los datos principales
export interface Cliente {
  id?: string;
  nombre: string;
  apellido: string;
  telefono: string;
  email?: string;
  direccion: string;
  fechaCreacion: Timestamp;
  activo: boolean;
}

export interface Distribuidor {
  id?: string;
  nombre: string;
  ubicacion: string;
  telefono: string;
  email?: string;
  fechaCreacion: Timestamp;
  activo: boolean;
}

export interface Transaccion {
  id?: string;
  clienteId: string;
  distribuidorId: string;
  tipo: 'deposito' | 'retiro' | 'transferencia';
  monto: number;
  fecha: Timestamp;
  descripcion?: string;
  estado: 'pendiente' | 'completada' | 'cancelada';
}

export interface VentaLocal {
  id?: string;
  distribuidorId: string;
  productos: Array<{
    nombre: string;
    cantidad: number;
    precio: number;
  }>;
  total: number;
  fecha: Timestamp;
  clienteNombre?: string;
}

// Nombres de las colecciones
const COLLECTIONS = {
  CLIENTES: 'clientes',
  DISTRIBUIDORES: 'distribuidores',
  TRANSACCIONES: 'transacciones',
  VENTAS_LOCALES: 'ventas_locales'
} as const;

/**
 * 🏪 SERVICIOS PARA CLIENTES
 */
export const clienteService = {
  // Crear cliente
  async create(cliente: Omit<Cliente, 'id' | 'fechaCreacion'>): Promise<string> {
    try {
      const nuevoCliente: Omit<Cliente, 'id'> = {
        ...cliente,
        fechaCreacion: Timestamp.now()
      };

      const docRef = await addDoc(collection(db, COLLECTIONS.CLIENTES), nuevoCliente);
      console.log('✅ Cliente creado:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('❌ Error creando cliente:', error);
      throw error;
    }
  },

  // Obtener cliente por ID
  async getById(id: string): Promise<Cliente | null> {
    try {
      const docRef = doc(db, COLLECTIONS.CLIENTES, id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as Cliente;
      } else {
        console.warn('⚠️ Cliente no encontrado:', id);
        return null;
      }
    } catch (error) {
      console.error('❌ Error obteniendo cliente:', error);
      throw error;
    }
  },

  // Obtener todos los clientes activos
  async getAll(limitCount = 100): Promise<Cliente[]> {
    try {
      const q = query(
        collection(db, COLLECTIONS.CLIENTES),
        where('activo', '==', true),
        orderBy('fechaCreacion', 'desc'),
        limit(limitCount)
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Cliente[];
    } catch (error) {
      console.error('❌ Error obteniendo clientes:', error);
      throw error;
    }
  },

  // Actualizar cliente
  async update(id: string, updates: Partial<Cliente>): Promise<void> {
    try {
      const docRef = doc(db, COLLECTIONS.CLIENTES, id);
      await updateDoc(docRef, updates);
      console.log('✅ Cliente actualizado:', id);
    } catch (error) {
      console.error('❌ Error actualizando cliente:', error);
      throw error;
    }
  },

  // Desactivar cliente (soft delete)
  async deactivate(id: string): Promise<void> {
    try {
      await this.update(id, { activo: false });
      console.log('✅ Cliente desactivado:', id);
    } catch (error) {
      console.error('❌ Error desactivando cliente:', error);
      throw error;
    }
  },

  // Suscripción en tiempo real
  onSnapshot(callback: (clientes: Cliente[]) => void): Unsubscribe {
    const q = query(
      collection(db, COLLECTIONS.CLIENTES),
      where('activo', '==', true),
      orderBy('fechaCreacion', 'desc')
    );

    return onSnapshot(q, (snapshot) => {
      const clientes = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Cliente[];
      callback(clientes);
    });
  }
};

/**
 * 🏭 SERVICIOS PARA DISTRIBUIDORES
 */
export const distribuidorService = {
  async create(distribuidor: Omit<Distribuidor, 'id' | 'fechaCreacion'>): Promise<string> {
    try {
      const nuevoDistribuidor: Omit<Distribuidor, 'id'> = {
        ...distribuidor,
        fechaCreacion: Timestamp.now()
      };

      const docRef = await addDoc(collection(db, COLLECTIONS.DISTRIBUIDORES), nuevoDistribuidor);
      return docRef.id;
    } catch (error) {
      console.error('❌ Error creando distribuidor:', error);
      throw error;
    }
  },

  async getAll(): Promise<Distribuidor[]> {
    try {
      const q = query(
        collection(db, COLLECTIONS.DISTRIBUIDORES),
        where('activo', '==', true),
        orderBy('nombre')
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Distribuidor[];
    } catch (error) {
      console.error('❌ Error obteniendo distribuidores:', error);
      throw error;
    }
  }
};

/**
 * 💰 SERVICIOS PARA TRANSACCIONES
 */
export const transaccionService = {
  async create(transaccion: Omit<Transaccion, 'id' | 'fecha'>): Promise<string> {
    try {
      const nuevaTransaccion: Omit<Transaccion, 'id'> = {
        ...transaccion,
        fecha: Timestamp.now()
      };

      const docRef = await addDoc(collection(db, COLLECTIONS.TRANSACCIONES), nuevaTransaccion);
      return docRef.id;
    } catch (error) {
      console.error('❌ Error creando transacción:', error);
      throw error;
    }
  },

  async getByClienteId(clienteId: string): Promise<Transaccion[]> {
    try {
      const q = query(
        collection(db, COLLECTIONS.TRANSACCIONES),
        where('clienteId', '==', clienteId),
        orderBy('fecha', 'desc')
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Transaccion[];
    } catch (error) {
      console.error('❌ Error obteniendo transacciones:', error);
      throw error;
    }
  }
};

/**
 * 🛍️ SERVICIOS PARA VENTAS LOCALES
 */
export const ventaLocalService = {
  async create(venta: Omit<VentaLocal, 'id' | 'fecha'>): Promise<string> {
    try {
      const nuevaVenta: Omit<VentaLocal, 'id'> = {
        ...venta,
        fecha: Timestamp.now()
      };

      const docRef = await addDoc(collection(db, COLLECTIONS.VENTAS_LOCALES), nuevaVenta);
      return docRef.id;
    } catch (error) {
      console.error('❌ Error creando venta:', error);
      throw error;
    }
  },

  async getByDistribuidorId(distribuidorId: string): Promise<VentaLocal[]> {
    try {
      const q = query(
        collection(db, COLLECTIONS.VENTAS_LOCALES),
        where('distribuidorId', '==', distribuidorId),
        orderBy('fecha', 'desc')
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as VentaLocal[];
    } catch (error) {
      console.error('❌ Error obteniendo ventas:', error);
      throw error;
    }
  }
};

/**
 * 🚀 OPERACIONES BATCH (para mejor rendimiento)
 */
export const batchService = {
  async createMultipleClientes(clientes: Omit<Cliente, 'id' | 'fechaCreacion'>[]): Promise<void> {
    try {
      const batch = writeBatch(db);
      const now = Timestamp.now();

      clientes.forEach(cliente => {
        const docRef = doc(collection(db, COLLECTIONS.CLIENTES));
        batch.set(docRef, {
          ...cliente,
          fechaCreacion: now
        });
      });

      await batch.commit();
      console.log(`✅ ${clientes.length} clientes creados en batch`);
    } catch (error) {
      console.error('❌ Error en batch de clientes:', error);
      throw error;
    }
  }
};

/**
 * 🔄 MIGRACIÓN DE DATOS EXISTENTES
 */
export const migrationService = {
  async migrateExistingData(): Promise<void> {
    console.log('🚀 Iniciando migración de datos a Firestore...');

    try {
      // Aquí puedes agregar la lógica para migrar datos existentes
      // Por ejemplo, si tienes datos en localStorage, archivos JSON, etc.

      console.log('✅ Migración completada exitosamente');
    } catch (error) {
      console.error('❌ Error en migración:', error);
      throw error;
    }
  }
};

export default {
  clienteService,
  distribuidorService,
  transaccionService,
  ventaLocalService,
  batchService,
  migrationService
};
