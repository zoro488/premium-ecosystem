/**
 * Servicio para Clientes (Firestore)
 * Optimizado con batch operations, caching y límites
 */
import {
    addDoc,
    collection,
    deleteDoc,
    doc,
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

const COLLECTION = 'clientes';

// Cache simple
const cache: { all?: { data: Cliente[]; timestamp: number } } = {};
const CACHE_TTL = 5 * 60 * 1000;
const MAX_QUERY_LIMIT = 500; // Más alto para clientes (menos datos)

interface Cliente {
  id?: string;
  nombre: string;
  telefono?: string;
  email?: string;
  direccion?: {
    calle?: string;
    ciudad?: string;
    estado?: string;
    cp?: string;
  };
  creditoAutorizado?: number;
  creditoDisponible?: number;
  diasCredito?: number;
  activo?: boolean;
  bloqueado?: boolean;
  motivoBloqueo?: string;
  createdAt?: any;
  updatedAt?: any;
}

const handleError = (err: unknown) => {
  throw err;
};

export const clientesService = {
  async getAll(maxLimit = MAX_QUERY_LIMIT): Promise<Cliente[]> {
    // Verificar cache
    if (cache.all && Date.now() - cache.all.timestamp < CACHE_TTL) {
      return cache.all.data;
    }

    try {
      const q = query(
        collection(db, COLLECTION),
        orderBy('nombre', 'asc'),
        limit(maxLimit)
      );
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() })) as Cliente[];

      cache.all = { data, timestamp: Date.now() };
      return data;
    } catch (err) {
      handleError(err);
      return [];
    }
  },

  async getById(id: string): Promise<Cliente | null> {
    try {
      const ref = doc(db, COLLECTION, id);
      const snap = await getDoc(ref);
      if (!snap.exists()) return null;
      return { id: snap.id, ...snap.data() } as Cliente;
    } catch (err) {
      handleError(err);
      return null;
    }
  },

  async create(data: Omit<Cliente, 'id'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, COLLECTION), {
        ...data,
        activo: data.activo !== false,
        bloqueado: data.bloqueado || false,
        creditoDisponible: data.creditoAutorizado || 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      // Invalidar cache
      cache.all = undefined;

      return docRef.id;
    } catch (err) {
      handleError(err);
      throw err;
    }
  },

  async update(id: string, data: Partial<Cliente>): Promise<void> {
    try {
      const ref = doc(db, COLLECTION, id);
      await updateDoc(ref, { ...data, updatedAt: serverTimestamp() });

      // Invalidar cache
      cache.all = undefined;
    } catch (err) {
      handleError(err);
      throw err;
    }
  },

  async delete(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, COLLECTION, id));

      // Invalidar cache
      cache.all = undefined;
    } catch (err) {
      handleError(err);
      throw err;
    }
  },

  /**
   * Batch: Crear múltiples clientes
   */
  async createBatch(clientes: Omit<Cliente, 'id'>[]): Promise<string[]> {
    try {
      const batch = writeBatch(db);
      const ids: string[] = [];

      clientes.forEach((cliente) => {
        const ref = doc(collection(db, COLLECTION));
        batch.set(ref, {
          ...cliente,
          activo: cliente.activo !== false,
          bloqueado: cliente.bloqueado || false,
          creditoDisponible: cliente.creditoAutorizado || 0,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
        ids.push(ref.id);
      });

      await batch.commit();
      cache.all = undefined;

      console.log(`✅ Batch creado: ${clientes.length} clientes`);
      return ids;
    } catch (err) {
      handleError(err);
      throw err;
    }
  },

  /**
   * Batch: Actualizar múltiples clientes
   */
  async updateBatch(updates: { id: string; data: Partial<Cliente> }[]): Promise<void> {
    try {
      const batch = writeBatch(db);

      updates.forEach(({ id, data }) => {
        const ref = doc(db, COLLECTION, id);
        batch.update(ref, { ...data, updatedAt: serverTimestamp() });
      });

      await batch.commit();
      cache.all = undefined;

      console.log(`✅ Batch actualizado: ${updates.length} clientes`);
    } catch (err) {
      handleError(err);
      throw err;
    }
  },

  clearCache(): void {
    cache.all = undefined;
  },

  async bloquearCliente(id: string, motivo: string): Promise<void> {
    try {
      await this.update(id, { bloqueado: true, motivoBloqueo: motivo });
    } catch (err) {
      handleError(err);
      throw err;
    }
  },

  async desbloquearCliente(id: string): Promise<void> {
    try {
      await this.update(id, { bloqueado: false, motivoBloqueo: undefined });
    } catch (err) {
      handleError(err);
      throw err;
    }
  },

  async actualizarCredito(id: string, monto: number, esAbono: boolean = false): Promise<void> {
    try {
      const cliente = await this.getById(id);
      if (!cliente) throw new Error('Cliente no encontrado');

      const creditoDisponible = (cliente.creditoDisponible || 0) + (esAbono ? monto : -monto);

      if (creditoDisponible < 0) {
        throw new Error('El crédito disponible no puede ser negativo');
      }

      await this.update(id, { creditoDisponible });
    } catch (err) {
      handleError(err);
      throw err;
    }
  },

  async getClientesBloqueados(): Promise<Cliente[]> {
    try {
      const q = query(collection(db, COLLECTION), where('bloqueado', '==', true));
      const snapshot = await getDocs(q);
      return snapshot.docs.map((d) => ({ id: d.id, ...d.data() })) as Cliente[];
    } catch (err) {
      handleError(err);
      return [];
    }
  },

  async getClientesConDeuda(): Promise<Cliente[]> {
    try {
      const clientes = await this.getAll();
      return clientes.filter((c) => {
        const disponible = c.creditoDisponible || 0;
        const autorizado = c.creditoAutorizado || 0;
        return disponible < autorizado;
      });
    } catch (err) {
      handleError(err);
      return [];
    }
  },
};
