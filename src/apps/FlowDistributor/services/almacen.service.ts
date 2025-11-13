/**
 * FlowDistributor - Servicio de Almacén/Inventario
 * Entry (from Purchase Orders) + Exit (from Sales) = Stock calculation
 * @module FlowDistributor/services/almacen
 */
import type {
  DocumentData,
  Firestore,
  QueryDocumentSnapshot,
  Unsubscribe,
} from 'firebase/firestore';
import {
  Timestamp,
  addDoc,
  collection,
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
// FIREBASE HELPER - Null Safety
// ============================================================================

/**
 * Helper para obtener instancia de Firestore con null check
 * @throws Error si Firebase no está inicializado
 */
function getFirestore(): Firestore {
  if (!db) {
    throw new Error('Firebase no inicializado. Verifica la configuración en src/lib/firebase.ts');
  }
  return db;
}

// ============================================================================
// TIPOS
// ============================================================================

export enum TipoMovimiento {
  ENTRADA = 'entrada',
  SALIDA = 'salida',
  AJUSTE = 'ajuste',
}

export enum EstadoProducto {
  DISPONIBLE = 'disponible',
  AGOTADO = 'agotado',
  BAJO_STOCK = 'bajo-stock',
  DESCONTINUADO = 'descontinuado',
}

export interface Producto {
  id?: string;
  sku: string;
  nombre: string;
  descripcion?: string;
  categoria?: string;
  unidad: string; // pz, kg, lt, etc.

  // Inventario
  stockActual: number;
  stockMinimo: number;
  stockMaximo: number;
  puntoReorden: number;

  // Precios
  costoUnitario: number;
  precioVenta: number;
  margen: number; // %

  // Estado
  estado: EstadoProducto;
  activo: boolean;

  // Ubicación
  almacen?: string;
  pasillo?: string;
  estante?: string;

  // Metadata
  notas?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface MovimientoInventario {
  id?: string;
  productoId: string;
  productoSku?: string;
  productoNombre?: string;

  tipo: TipoMovimiento;
  cantidad: number;
  costoUnitario?: number;
  costoTotal?: number;

  // Stock antes y después
  stockAnterior: number;
  stockNuevo: number;

  // Relaciones
  ordenCompraId?: string; // Si es entrada desde PO
  ventaId?: string; // Si es salida desde venta

  // Detalles
  fecha: Date;
  concepto: string;
  responsable?: string;
  notas?: string;

  createdAt?: Date;
  updatedAt?: Date;
}

export interface AlertaInventario {
  id?: string;
  productoId: string;
  productoNombre: string;
  tipo: 'stock-bajo' | 'agotado' | 'reorden';
  mensaje: string;
  stockActual: number;
  stockMinimo?: number;
  puntoReorden?: number;
  fecha: Date;
  leida: boolean;
  createdAt?: Date;
}

// ============================================================================
// UTILIDADES
// ============================================================================

const docToData = <T>(doc: QueryDocumentSnapshot<DocumentData>): T => {
  const data = doc.data();
  const result: any = { id: doc.id, ...data };

  for (const key in result) {
    if (result[key] instanceof Timestamp) {
      result[key] = result[key].toDate();
    }
  }

  return result as T;
};

const calcularEstado = (producto: Producto): EstadoProducto => {
  if (producto.stockActual === 0) return EstadoProducto.AGOTADO;
  if (producto.stockActual <= producto.stockMinimo) return EstadoProducto.BAJO_STOCK;
  if (!producto.activo) return EstadoProducto.DESCONTINUADO;
  return EstadoProducto.DISPONIBLE;
};

// ============================================================================
// SERVICIO DE ALMACÉN
// ============================================================================

export const almacenService = {
  // ==========================================================================
  // PRODUCTOS
  // ==========================================================================

  /**
   * Obtiene todos los productos
   */
  async getProductos(soloActivos = false): Promise<Producto[]> {
    try {
      const firestore = getFirestore();
      let q = query(collection(firestore, 'productos'), orderBy('nombre'));

      if (soloActivos) {
        q = query(
          collection(firestore, 'productos'),
          where('activo', '==', true),
          orderBy('nombre')
        );
      }

      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc) => docToData<Producto>(doc));
    } catch (error) {
      console.error('❌ Error obteniendo productos:', error);
      throw error;
    }
  },

  /**
   * Obtiene un producto por ID
   */
  async getProductoById(productoId: string): Promise<Producto | null> {
    try {
      const firestore = getFirestore();
      const docRef = doc(firestore, 'productos', productoId);
      const docSnap = await getDoc(docRef);
      return docSnap.exists() ? docToData<Producto>(docSnap) : null;
    } catch (error) {
      console.error('❌ Error obteniendo producto:', error);
      throw error;
    }
  },

  /**
   * Busca producto por SKU
   */
  async getProductoBySku(sku: string): Promise<Producto | null> {
    try {
      const firestore = getFirestore();
      const q = query(collection(firestore, 'productos'), where('sku', '==', sku), limit(1));
      const snapshot = await getDocs(q);
      return snapshot.empty ? null : (docToData<Producto>(snapshot.docs[0]!) ?? null);
    } catch (error) {
      console.error('❌ Error buscando producto por SKU:', error);
      throw error;
    }
  },

  /**
   * Crea un producto
   */
  async crearProducto(producto: Omit<Producto, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      // Verificar que el SKU no exista
      const existente = await this.getProductoBySku(producto.sku);
      if (existente) {
        throw new Error(`Ya existe un producto con SKU "${producto.sku}"`);
      }

      const estado = calcularEstado({ ...producto } as Producto);

      const firestore = getFirestore();
      const docRef = await addDoc(collection(firestore, 'productos'), {
        ...producto,
        estado,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      return docRef.id;
    } catch (error) {
      console.error('❌ Error creando producto:', error);
      throw error;
    }
  },

  /**
   * Actualiza un producto
   */
  async actualizarProducto(
    productoId: string,
    data: Partial<Omit<Producto, 'id' | 'createdAt' | 'updatedAt'>>
  ): Promise<void> {
    try {
      const firestore = getFirestore();
      const docRef = doc(firestore, 'productos', productoId);
      const producto = await this.getProductoById(productoId);

      if (!producto) {
        throw new Error('Producto no encontrado');
      }

      const productoActualizado = { ...producto, ...data };
      const nuevoEstado = calcularEstado(productoActualizado);

      await updateDoc(docRef, {
        ...data,
        estado: nuevoEstado,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('❌ Error actualizando producto:', error);
      throw error;
    }
  },

  /**
   * Elimina un producto (soft delete)
   */
  async eliminarProducto(productoId: string): Promise<void> {
    try {
      await this.actualizarProducto(productoId, { activo: false });
    } catch (error) {
      console.error('❌ Error eliminando producto:', error);
      throw error;
    }
  },

  /**
   * Obtiene productos con stock bajo
   */
  async getProductosStockBajo(): Promise<Producto[]> {
    try {
      const todos = await this.getProductos(true);
      return todos.filter((p) => p.stockActual <= p.stockMinimo && p.stockActual > 0);
    } catch (error) {
      console.error('❌ Error obteniendo productos con stock bajo:', error);
      throw error;
    }
  },

  /**
   * Obtiene productos agotados
   */
  async getProductosAgotados(): Promise<Producto[]> {
    try {
      const todos = await this.getProductos(true);
      return todos.filter((p) => p.stockActual === 0);
    } catch (error) {
      console.error('❌ Error obteniendo productos agotados:', error);
      throw error;
    }
  },

  // ==========================================================================
  // MOVIMIENTOS DE INVENTARIO
  // ==========================================================================

  /**
   * Obtiene movimientos de un producto
   */
  async getMovimientos(productoId?: string, limite = 100): Promise<MovimientoInventario[]> {
    try {
      const firestore = getFirestore();
      let q = query(
        collection(firestore, 'movimientosInventario'),
        orderBy('fecha', 'desc'),
        limit(limite)
      );

      if (productoId) {
        q = query(
          collection(firestore, 'movimientosInventario'),
          where('productoId', '==', productoId),
          orderBy('fecha', 'desc'),
          limit(limite)
        );
      }

      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc) => docToData<MovimientoInventario>(doc));
    } catch (error) {
      console.error('❌ Error obteniendo movimientos:', error);
      throw error;
    }
  },

  /**
   * Registra entrada de inventario (desde Purchase Order)
   */
  async registrarEntrada(
    productoId: string,
    cantidad: number,
    costoUnitario: number,
    ordenCompraId?: string,
    concepto?: string
  ): Promise<string> {
    try {
      const firestore = getFirestore();
      return await runTransaction(firestore, async (transaction) => {
        const productoRef = doc(firestore, 'productos', productoId);
        const productoDoc = await transaction.get(productoRef);

        if (!productoDoc.exists()) {
          throw new Error('Producto no encontrado');
        }

        const producto = docToData<Producto>(productoDoc);
        const nuevoStock = producto.stockActual + cantidad;
        const nuevoEstado = calcularEstado({ ...producto, stockActual: nuevoStock });

        // Crear movimiento
        const movimientoRef = doc(collection(firestore, 'movimientosInventario'));
        transaction.set(movimientoRef, {
          productoId,
          productoSku: producto.sku,
          productoNombre: producto.nombre,
          tipo: TipoMovimiento.ENTRADA,
          cantidad,
          costoUnitario,
          costoTotal: cantidad * costoUnitario,
          stockAnterior: producto.stockActual,
          stockNuevo: nuevoStock,
          ordenCompraId,
          fecha: new Date(),
          concepto:
            concepto ||
            (ordenCompraId
              ? `Entrada de inventario - OC: ${ordenCompraId}`
              : 'Entrada de inventario'),
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });

        // Actualizar producto
        transaction.update(productoRef, {
          stockActual: nuevoStock,
          costoUnitario, // Actualizar costo
          estado: nuevoEstado,
          updatedAt: serverTimestamp(),
        });

        return movimientoRef.id;
      });
    } catch (error) {
      console.error('❌ Error registrando entrada:', error);
      throw error;
    }
  },

  /**
   * Registra salida de inventario (desde Venta)
   */
  async registrarSalida(
    productoId: string,
    cantidad: number,
    ventaId?: string,
    concepto?: string
  ): Promise<string> {
    try {
      const firestore = getFirestore();
      return await runTransaction(firestore, async (transaction) => {
        const productoRef = doc(firestore, 'productos', productoId);
        const productoDoc = await transaction.get(productoRef);

        if (!productoDoc.exists()) {
          throw new Error('Producto no encontrado');
        }

        const producto = docToData<Producto>(productoDoc);

        if (producto.stockActual < cantidad) {
          throw new Error(
            `Stock insuficiente. Disponible: ${producto.stockActual}, Solicitado: ${cantidad}`
          );
        }

        const nuevoStock = producto.stockActual - cantidad;
        const nuevoEstado = calcularEstado({ ...producto, stockActual: nuevoStock });

        // Crear movimiento
        const movimientoRef = doc(collection(firestore, 'movimientosInventario'));
        transaction.set(movimientoRef, {
          productoId,
          productoSku: producto.sku,
          productoNombre: producto.nombre,
          tipo: TipoMovimiento.SALIDA,
          cantidad,
          costoUnitario: producto.costoUnitario,
          costoTotal: cantidad * producto.costoUnitario,
          stockAnterior: producto.stockActual,
          stockNuevo: nuevoStock,
          ventaId,
          fecha: new Date(),
          concepto:
            concepto ||
            (ventaId ? `Salida de inventario - Venta: ${ventaId}` : 'Salida de inventario'),
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });

        // Actualizar producto
        transaction.update(productoRef, {
          stockActual: nuevoStock,
          estado: nuevoEstado,
          updatedAt: serverTimestamp(),
        });

        // Crear alerta si es necesario
        if (nuevoStock === 0) {
          const alertaRef = doc(collection(firestore, 'alertasInventario'));
          transaction.set(alertaRef, {
            productoId,
            productoNombre: producto.nombre,
            tipo: 'agotado',
            mensaje: `Producto agotado: ${producto.nombre} (SKU: ${producto.sku})`,
            stockActual: 0,
            fecha: new Date(),
            leida: false,
            createdAt: serverTimestamp(),
          });
        } else if (nuevoStock <= producto.stockMinimo) {
          const alertaRef = doc(collection(firestore, 'alertasInventario'));
          transaction.set(alertaRef, {
            productoId,
            productoNombre: producto.nombre,
            tipo: 'stock-bajo',
            mensaje: `Stock bajo: ${producto.nombre} (${nuevoStock} ${producto.unidad})`,
            stockActual: nuevoStock,
            stockMinimo: producto.stockMinimo,
            fecha: new Date(),
            leida: false,
            createdAt: serverTimestamp(),
          });
        } else if (nuevoStock <= producto.puntoReorden) {
          const alertaRef = doc(collection(firestore, 'alertasInventario'));
          transaction.set(alertaRef, {
            productoId,
            productoNombre: producto.nombre,
            tipo: 'reorden',
            mensaje: `Punto de reorden alcanzado: ${producto.nombre}`,
            stockActual: nuevoStock,
            puntoReorden: producto.puntoReorden,
            fecha: new Date(),
            leida: false,
            createdAt: serverTimestamp(),
          });
        }

        return movimientoRef.id;
      });
    } catch (error) {
      console.error('❌ Error registrando salida:', error);
      throw error;
    }
  },

  /**
   * Registra ajuste de inventario (corrección manual)
   */
  async registrarAjuste(
    productoId: string,
    nuevoStock: number,
    concepto: string,
    responsable?: string
  ): Promise<string> {
    try {
      const firestore = getFirestore();
      return await runTransaction(firestore, async (transaction) => {
        const productoRef = doc(firestore, 'productos', productoId);
        const productoDoc = await transaction.get(productoRef);

        if (!productoDoc.exists()) {
          throw new Error('Producto no encontrado');
        }

        const producto = docToData<Producto>(productoDoc);
        const diferencia = nuevoStock - producto.stockActual;
        const nuevoEstado = calcularEstado({ ...producto, stockActual: nuevoStock });

        // Crear movimiento
        const movimientoRef = doc(collection(firestore, 'movimientosInventario'));
        transaction.set(movimientoRef, {
          productoId,
          productoSku: producto.sku,
          productoNombre: producto.nombre,
          tipo: TipoMovimiento.AJUSTE,
          cantidad: Math.abs(diferencia),
          stockAnterior: producto.stockActual,
          stockNuevo: nuevoStock,
          fecha: new Date(),
          concepto: `Ajuste de inventario: ${concepto}`,
          responsable,
          notas: `Diferencia: ${diferencia > 0 ? '+' : ''}${diferencia}`,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });

        // Actualizar producto
        transaction.update(productoRef, {
          stockActual: nuevoStock,
          estado: nuevoEstado,
          updatedAt: serverTimestamp(),
        });

        return movimientoRef.id;
      });
    } catch (error) {
      console.error('❌ Error registrando ajuste:', error);
      throw error;
    }
  },

  // ==========================================================================
  // ALERTAS
  // ==========================================================================

  /**
   * Obtiene alertas no leídas
   */
  async getAlertas(soloNoLeidas = true): Promise<AlertaInventario[]> {
    try {
      const firestore = getFirestore();
      let q = query(
        collection(firestore, 'alertasInventario'),
        orderBy('fecha', 'desc'),
        limit(50)
      );

      if (soloNoLeidas) {
        q = query(
          collection(firestore, 'alertasInventario'),
          where('leida', '==', false),
          orderBy('fecha', 'desc'),
          limit(50)
        );
      }

      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc) => docToData<AlertaInventario>(doc));
    } catch (error) {
      console.error('❌ Error obteniendo alertas:', error);
      throw error;
    }
  },

  /**
   * Marca alerta como leída
   */
  async marcarAlertaLeida(alertaId: string): Promise<void> {
    try {
      const firestore = getFirestore();
      const docRef = doc(firestore, 'alertasInventario', alertaId);
      await updateDoc(docRef, { leida: true });
    } catch (error) {
      console.error('❌ Error marcando alerta:', error);
      throw error;
    }
  },

  // ==========================================================================
  // REAL-TIME SUBSCRIPTIONS
  // ==========================================================================

  onProductosChange(callback: (productos: Producto[]) => void): Unsubscribe {
    const firestore = getFirestore();
    const q = query(collection(firestore, 'productos'), orderBy('nombre'));
    return onSnapshot(q, (snapshot) => {
      const productos = snapshot.docs.map((doc) => docToData<Producto>(doc));
      callback(productos);
    });
  },

  onMovimientosChange(
    productoId: string,
    callback: (movimientos: MovimientoInventario[]) => void
  ): Unsubscribe {
    const firestore = getFirestore();
    const q = query(
      collection(firestore, 'movimientosInventario'),
      where('productoId', '==', productoId),
      orderBy('fecha', 'desc'),
      limit(100)
    );
    return onSnapshot(q, (snapshot) => {
      const movimientos = snapshot.docs.map((doc) => docToData<MovimientoInventario>(doc));
      callback(movimientos);
    });
  },

  onAlertasChange(callback: (alertas: AlertaInventario[]) => void): Unsubscribe {
    const firestore = getFirestore();
    const q = query(
      collection(firestore, 'alertasInventario'),
      where('leida', '==', false),
      orderBy('fecha', 'desc'),
      limit(50)
    );
    return onSnapshot(q, (snapshot) => {
      const alertas = snapshot.docs.map((doc) => docToData<AlertaInventario>(doc));
      callback(alertas);
    });
  },
};

export default almacenService;
