/**
 * FlowDistributor - Servicio de Bancos
 * Maneja 7 bancos con 4 tablas cada uno: Ingresos, Gastos, Cortes, Transferencias
 * @module FlowDistributor/services/bancos
 */
import type { Firestore } from 'firebase/firestore';
import {
  type DocumentData,
  type QueryDocumentSnapshot,
  Timestamp,
  type Unsubscribe,
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
  writeBatch,
} from 'firebase/firestore';

import { db } from '@/lib/firebase';

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Helper para obtener la instancia de Firestore con null check
 * @throws Error si Firebase no está inicializado
 */
function getFirestore(): Firestore {
  if (!db) throw new Error('Firebase no inicializado');
  return db;
}

// ============================================================================
// TIPOS
// ============================================================================

export type BancoId =
  | 'boveda-monte'
  | 'boveda-usa'
  | 'azteca'
  | 'utilidades'
  | 'fletes'
  | 'leftie'
  | 'profit';

export interface Banco {
  id: string;
  nombre: string;
  capital: number; // Alias para capitalActual (compatibilidad)
  capitalActual: number;
  capitalHistorico: number; // Acumulado fijo
  moneda: 'MXN' | 'USD';
  color: string;
  icono: string;
  activo: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Ingreso {
  id?: string;
  bancoId: BancoId;
  fecha: Date;
  monto: number;
  concepto: string;
  cliente?: string;
  ventaId?: string; // Relación con venta
  notas?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Gasto {
  id?: string;
  bancoId: BancoId;
  fecha: Date;
  monto: number;
  concepto: string;
  categoria?: string;
  proveedor?: string;
  compraId?: string; // Relación con orden de compra
  notas?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Corte {
  id?: string;
  bancoId: BancoId;
  fecha: Date;
  montoInicial: number;
  ingresos: number;
  gastos: number;
  montoFinal: number;
  diferencia: number; // montoFinal - (montoInicial + ingresos - gastos)
  notas?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Transferencia {
  id?: string;
  fecha: Date;
  bancoOrigenId: BancoId;
  bancoDestinoId: BancoId;
  monto: number;
  concepto: string;
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
// CONFIGURACIÓN DE BANCOS
// ============================================================================

// Mapeo de IDs internos a nombres de colecciones en Firestore
const BANCO_TO_COLLECTION: Record<BancoId, string> = {
  'boveda-monte': 'boveda_monte',
  'boveda-usa': 'boveda_usa',
  azteca: 'azteca',
  utilidades: 'utilidades',
  fletes: 'fleteSur',
  leftie: 'leftie',
  profit: 'profit',
};

export const BANCOS_CONFIG: Record<BancoId, Omit<Banco, 'id' | 'createdAt' | 'updatedAt'>> = {
  'boveda-monte': {
    nombre: 'Bóveda Monte',
    capital: 0,
    capitalActual: 0,
    capitalHistorico: 0,
    moneda: 'MXN',
    color: 'amber',
    icono: 'Building2',
    activo: true,
  },
  'boveda-usa': {
    nombre: 'Bóveda USA',
    capital: 0,
    capitalActual: 0,
    capitalHistorico: 0,
    moneda: 'USD',
    color: 'blue',
    icono: 'Building2',
    activo: true,
  },
  azteca: {
    nombre: 'Azteca',
    capital: 0,
    capitalActual: 0,
    capitalHistorico: 0,
    moneda: 'MXN',
    color: 'green',
    icono: 'Building2',
    activo: true,
  },
  utilidades: {
    nombre: 'Utilidades',
    capital: 0,
    capitalActual: 0,
    capitalHistorico: 0,
    moneda: 'MXN',
    color: 'purple',
    icono: 'DollarSign',
    activo: true,
  },
  fletes: {
    nombre: 'Flete Sur',
    capital: 0,
    capitalActual: 0,
    capitalHistorico: 0,
    moneda: 'MXN',
    color: 'red',
    icono: 'ArrowLeftRight',
    activo: true,
  },
  leftie: {
    nombre: 'Leftie',
    capital: 0,
    capitalActual: 0,
    capitalHistorico: 0,
    moneda: 'MXN',
    color: 'teal',
    icono: 'TrendingUp',
    activo: true,
  },
  profit: {
    nombre: 'Profit',
    capital: 0,
    capitalActual: 0,
    capitalHistorico: 0,
    moneda: 'MXN',
    color: 'pink',
    icono: 'BarChart3',
    activo: true,
  },
};

// ============================================================================
// SERVICIO DE BANCOS
// ============================================================================

export const bancosService = {
  /**
   * Inicializa los 7 bancos en Firestore (solo se ejecuta una vez)
   */
  async inicializarBancos(): Promise<void> {
    try {
      const firestore = getFirestore();
      const batch = writeBatch(firestore);

      for (const [id, config] of Object.entries(BANCOS_CONFIG)) {
        const bancoRef = doc(firestore, 'bancos', id);
        const bancoDoc = await getDoc(bancoRef);

        if (!bancoDoc.exists()) {
          batch.set(bancoRef, {
            ...config,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          });
        }
      }

      await batch.commit();
      console.log('✅ Bancos inicializados correctamente');
    } catch (error) {
      console.error('❌ Error inicializando bancos:', error);
      throw error;
    }
  },

  /**
   * Obtiene todos los bancos desde sus colecciones específicas
   */
  async getAll(): Promise<Banco[]> {
    try {
      const bancos: Banco[] = [];
      const bancoIds: BancoId[] = [
        'boveda-monte',
        'boveda-usa',
        'azteca',
        'utilidades',
        'fletes',
        'leftie',
        'profit',
      ];

      for (const bancoId of bancoIds) {
        const banco = await this.getById(bancoId);
        if (banco) {
          bancos.push(banco);
        }
      }

      return bancos;
    } catch (error) {
      console.error('❌ Error obteniendo bancos:', error);
      throw error;
    }
  },

  /**
   * Obtiene un banco por ID desde su colección específica
   */
  async getById(bancoId: BancoId): Promise<Banco | null> {
    try {
      const firestore = getFirestore();
      const collectionName = BANCO_TO_COLLECTION[bancoId];
      const docRef = doc(firestore, collectionName, 'cuenta');
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        // Convertir estructura de Firestore a Banco
        const capitalActual = data.rfActual || 0;
        return {
          id: bancoId,
          nombre: BANCOS_CONFIG[bancoId].nombre,
          capital: capitalActual, // Alias
          capitalActual,
          capitalHistorico: data.totalIngresos - data.totalGastos || 0,
          moneda: BANCOS_CONFIG[bancoId].moneda,
          color: BANCOS_CONFIG[bancoId].color,
          icono: BANCOS_CONFIG[bancoId].icono,
          activo: true,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        };
      }
      return null;
    } catch (error) {
      console.error('❌ Error obteniendo banco:', error);
      throw error;
    }
  },

  /**
   * Actualiza el capital de un banco
   */
  async actualizarCapital(bancoId: BancoId, nuevoCapital: number): Promise<void> {
    try {
      const firestore = getFirestore();
      const bancoRef = doc(firestore, 'bancos', bancoId);
      await updateDoc(bancoRef, {
        capitalActual: nuevoCapital,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('❌ Error actualizando capital:', error);
      throw error;
    }
  },

  /**
   * Suscripción en tiempo real a todos los bancos
   */
  onBancosChange(callback: (bancos: Banco[]) => void): Unsubscribe {
    const firestore = getFirestore();
    const q = query(collection(firestore, 'bancos'), orderBy('nombre'));
    return onSnapshot(q, (snapshot) => {
      const bancos = snapshot.docs.map((doc) => docToData<Banco>(doc));
      callback(bancos);
    });
  },

  // ========================================================================
  // INGRESOS
  // ========================================================================

  /**
   * Obtiene todos los ingresos de un banco desde su colección específica
   */
  async getIngresos(bancoId: BancoId, limite = 100): Promise<Ingreso[]> {
    try {
      const firestore = getFirestore();
      const collectionName = BANCO_TO_COLLECTION[bancoId];
      const docRef = doc(firestore, collectionName, 'cuenta');
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) return [];

      const data = docSnap.data();
      const cortes = data.cortes || [];

      // Extraer ingresos de los cortes
      const ingresos: Ingreso[] = [];
      cortes.forEach((corte: any, index: number) => {
        if (corte.ingreso && corte.ingreso > 0) {
          ingresos.push({
            id: `${bancoId}-ingreso-${index}`,
            bancoId,
            fecha: new Date(corte.fecha || Date.now()),
            monto: corte.ingreso,
            concepto: corte.concepto || 'Ingreso',
            notas: corte.observaciones || '',
            createdAt: new Date(),
            updatedAt: new Date(),
          });
        }
      });

      return ingresos.slice(0, limite);
    } catch (error) {
      console.error('❌ Error obteniendo ingresos:', error);
      throw error;
    }
  },

  /**
   * Crea un ingreso y actualiza el capital del banco
   */
  async crearIngreso(ingreso: Omit<Ingreso, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const firestore = getFirestore();
      return await runTransaction(firestore, async (transaction) => {
        // 1. Obtener banco actual
        const bancoRef = doc(firestore, 'bancos', ingreso.bancoId);
        const bancoDoc = await transaction.get(bancoRef);

        if (!bancoDoc.exists()) {
          throw new Error('Banco no encontrado');
        }

        const banco = docToData<Banco>(bancoDoc);

        // 2. Crear ingreso
        const ingresoRef = doc(collection(firestore, 'ingresos'));
        transaction.set(ingresoRef, {
          ...ingreso,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });

        // 3. Actualizar capital del banco
        transaction.update(bancoRef, {
          capitalActual: banco.capitalActual + ingreso.monto,
          capitalHistorico: banco.capitalHistorico + ingreso.monto,
          updatedAt: serverTimestamp(),
        });

        return ingresoRef.id;
      });
    } catch (error) {
      console.error('❌ Error creando ingreso:', error);
      throw error;
    }
  },

  /**
   * Elimina un ingreso y ajusta el capital
   */
  async eliminarIngreso(ingresoId: string, bancoId: BancoId, monto: number): Promise<void> {
    try {
      const firestore = getFirestore();
      await runTransaction(firestore, async (transaction) => {
        const bancoRef = doc(firestore, 'bancos', bancoId);
        const bancoDoc = await transaction.get(bancoRef);

        if (!bancoDoc.exists()) {
          throw new Error('Banco no encontrado');
        }

        const banco = docToData<Banco>(bancoDoc);

        // Eliminar ingreso
        const ingresoRef = doc(firestore, 'ingresos', ingresoId);
        transaction.delete(ingresoRef);

        // Ajustar capital
        transaction.update(bancoRef, {
          capitalActual: banco.capitalActual - monto,
          updatedAt: serverTimestamp(),
        });
      });
    } catch (error) {
      console.error('❌ Error eliminando ingreso:', error);
      throw error;
    }
  },

  /**
   * Suscripción en tiempo real a ingresos de un banco
   */
  onIngresosChange(bancoId: BancoId, callback: (ingresos: Ingreso[]) => void): Unsubscribe {
    const firestore = getFirestore();
    const q = query(
      collection(firestore, 'ingresos'),
      where('bancoId', '==', bancoId),
      orderBy('fecha', 'desc'),
      limit(100)
    );
    return onSnapshot(q, (snapshot) => {
      const ingresos = snapshot.docs.map((doc) => docToData<Ingreso>(doc));
      callback(ingresos);
    });
  },

  // ========================================================================
  // GASTOS
  // ========================================================================

  /**
   * Obtiene todos los gastos de un banco desde su colección específica
   */
  async getGastos(bancoId: BancoId, limite = 100): Promise<Gasto[]> {
    try {
      const firestore = getFirestore();
      const collectionName = BANCO_TO_COLLECTION[bancoId];
      const docRef = doc(firestore, collectionName, 'cuenta');
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) return [];

      const data = docSnap.data();
      const cortes = data.cortes || [];

      // Extraer gastos de los cortes
      const gastos: Gasto[] = [];
      cortes.forEach((corte: any, index: number) => {
        if (corte.gasto && corte.gasto > 0) {
          gastos.push({
            id: `${bancoId}-gasto-${index}`,
            bancoId,
            fecha: new Date(corte.fecha || Date.now()),
            monto: corte.gasto,
            concepto: corte.concepto || 'Gasto',
            categoria: corte.categoria || 'General',
            notas: corte.observaciones || '',
            createdAt: new Date(),
            updatedAt: new Date(),
          });
        }
      });

      return gastos.slice(0, limite);
    } catch (error) {
      console.error('❌ Error obteniendo gastos:', error);
      return [];
    }
  },

  /**
   * Crea un gasto y actualiza el capital del banco
   */
  async crearGasto(gasto: Omit<Gasto, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const firestore = getFirestore();
      return await runTransaction(firestore, async (transaction) => {
        const bancoRef = doc(firestore, 'bancos', gasto.bancoId);
        const bancoDoc = await transaction.get(bancoRef);

        if (!bancoDoc.exists()) {
          throw new Error('Banco no encontrado');
        }

        const banco = docToData<Banco>(bancoDoc);

        if (banco.capitalActual < gasto.monto) {
          throw new Error('Fondos insuficientes');
        }

        // Crear gasto
        const gastoRef = doc(collection(firestore, 'gastos'));
        transaction.set(gastoRef, {
          ...gasto,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });

        // Actualizar capital
        transaction.update(bancoRef, {
          capitalActual: banco.capitalActual - gasto.monto,
          updatedAt: serverTimestamp(),
        });

        return gastoRef.id;
      });
    } catch (error) {
      console.error('❌ Error creando gasto:', error);
      throw error;
    }
  },

  /**
   * Elimina un gasto y ajusta el capital
   */
  async eliminarGasto(gastoId: string, bancoId: BancoId, monto: number): Promise<void> {
    try {
      const firestore = getFirestore();
      await runTransaction(firestore, async (transaction) => {
        const bancoRef = doc(firestore, 'bancos', bancoId);
        const bancoDoc = await transaction.get(bancoRef);

        if (!bancoDoc.exists()) {
          throw new Error('Banco no encontrado');
        }

        const banco = docToData<Banco>(bancoDoc);

        const gastoRef = doc(firestore, 'gastos', gastoId);
        transaction.delete(gastoRef);

        transaction.update(bancoRef, {
          capitalActual: banco.capitalActual + monto,
          updatedAt: serverTimestamp(),
        });
      });
    } catch (error) {
      console.error('❌ Error eliminando gasto:', error);
      throw error;
    }
  },

  /**
   * Suscripción en tiempo real a gastos de un banco
   */
  onGastosChange(bancoId: BancoId, callback: (gastos: Gasto[]) => void): Unsubscribe {
    const firestore = getFirestore();
    const q = query(
      collection(firestore, 'gastos'),
      where('bancoId', '==', bancoId),
      orderBy('fecha', 'desc'),
      limit(100)
    );
    return onSnapshot(q, (snapshot) => {
      const gastos = snapshot.docs.map((doc) => docToData<Gasto>(doc));
      callback(gastos);
    });
  },

  // ========================================================================
  // CORTES
  // ========================================================================

  /**
   * Obtiene todos los cortes de un banco
   */
  async getCortes(bancoId: BancoId, limite = 50): Promise<Corte[]> {
    try {
      const firestore = getFirestore();
      const q = query(
        collection(firestore, 'cortes'),
        where('bancoId', '==', bancoId),
        orderBy('fecha', 'desc'),
        limit(limite)
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc) => docToData<Corte>(doc));
    } catch (error) {
      console.error('❌ Error obteniendo cortes:', error);
      throw error;
    }
  },

  /**
   * Crea un corte de caja
   */
  async crearCorte(corte: Omit<Corte, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const firestore = getFirestore();
      const corteRef = await addDoc(collection(firestore, 'cortes'), {
        ...corte,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return corteRef.id;
    } catch (error) {
      console.error('❌ Error creando corte:', error);
      throw error;
    }
  },

  /**
   * Suscripción en tiempo real a cortes de un banco
   */
  onCortesChange(bancoId: BancoId, callback: (cortes: Corte[]) => void): Unsubscribe {
    const firestore = getFirestore();
    const q = query(
      collection(firestore, 'cortes'),
      where('bancoId', '==', bancoId),
      orderBy('fecha', 'desc'),
      limit(50)
    );
    return onSnapshot(q, (snapshot) => {
      const cortes = snapshot.docs.map((doc) => docToData<Corte>(doc));
      callback(cortes);
    });
  },

  // ========================================================================
  // TRANSFERENCIAS
  // ========================================================================

  /**
   * Obtiene todas las transferencias (enviadas o recibidas) de un banco
   */
  async getTransferencias(bancoId: BancoId, limite = 100): Promise<Transferencia[]> {
    try {
      const firestore = getFirestore();
      const [enviadas, recibidas] = await Promise.all([
        getDocs(
          query(
            collection(firestore, 'transferencias'),
            where('bancoOrigenId', '==', bancoId),
            orderBy('fecha', 'desc'),
            limit(limite)
          )
        ),
        getDocs(
          query(
            collection(firestore, 'transferencias'),
            where('bancoDestinoId', '==', bancoId),
            orderBy('fecha', 'desc'),
            limit(limite)
          )
        ),
      ]);

      const todas = [
        ...enviadas.docs.map((doc) => docToData<Transferencia>(doc)),
        ...recibidas.docs.map((doc) => docToData<Transferencia>(doc)),
      ];

      // Ordenar por fecha descendente
      return todas.sort((a, b) => b.fecha.getTime() - a.fecha.getTime()).slice(0, limite);
    } catch (error) {
      console.error('❌ Error obteniendo transferencias:', error);
      throw error;
    }
  },

  /**
   * Crea una transferencia entre bancos
   */
  async crearTransferencia(
    transferencia: Omit<Transferencia, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<string> {
    try {
      const firestore = getFirestore();
      return await runTransaction(firestore, async (transaction) => {
        // 1. Obtener ambos bancos
        const origenRef = doc(firestore, 'bancos', transferencia.bancoOrigenId);
        const destinoRef = doc(firestore, 'bancos', transferencia.bancoDestinoId);

        const [origenDoc, destinoDoc] = await Promise.all([
          transaction.get(origenRef),
          transaction.get(destinoRef),
        ]);

        if (!origenDoc.exists() || !destinoDoc.exists()) {
          throw new Error('Uno o ambos bancos no encontrados');
        }

        const origen = docToData<Banco>(origenDoc);
        const destino = docToData<Banco>(destinoDoc);

        if (origen.capitalActual < transferencia.monto) {
          throw new Error('Fondos insuficientes en banco origen');
        }

        // 2. Crear transferencia
        const transferenciaRef = doc(collection(firestore, 'transferencias'));
        transaction.set(transferenciaRef, {
          ...transferencia,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });

        // 3. Actualizar capitales
        transaction.update(origenRef, {
          capitalActual: origen.capitalActual - transferencia.monto,
          updatedAt: serverTimestamp(),
        });

        transaction.update(destinoRef, {
          capitalActual: destino.capitalActual + transferencia.monto,
          updatedAt: serverTimestamp(),
        });

        // 4. Registrar como gasto en origen
        const gastoRef = doc(collection(firestore, 'gastos'));
        transaction.set(gastoRef, {
          bancoId: transferencia.bancoOrigenId,
          fecha: transferencia.fecha,
          monto: transferencia.monto,
          concepto: `Transferencia a ${destino.nombre}: ${transferencia.concepto}`,
          categoria: 'Transferencia',
          notas: transferencia.notas,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });

        // 5. Registrar como ingreso en destino
        const ingresoRef = doc(collection(firestore, 'ingresos'));
        transaction.set(ingresoRef, {
          bancoId: transferencia.bancoDestinoId,
          fecha: transferencia.fecha,
          monto: transferencia.monto,
          concepto: `Transferencia desde ${origen.nombre}: ${transferencia.concepto}`,
          notas: transferencia.notas,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });

        return transferenciaRef.id;
      });
    } catch (error) {
      console.error('❌ Error creando transferencia:', error);
      throw error;
    }
  },

  /**
   * Suscripción en tiempo real a transferencias de un banco
   */
  onTransferenciasChange(
    bancoId: BancoId,
    callback: (transferencias: Transferencia[]) => void
  ): Unsubscribe {
    const firestore = getFirestore();
    // Necesitamos dos listeners (enviadas y recibidas)
    const enviadas = query(
      collection(firestore, 'transferencias'),
      where('bancoOrigenId', '==', bancoId),
      orderBy('fecha', 'desc'),
      limit(50)
    );

    const recibidas = query(
      collection(firestore, 'transferencias'),
      where('bancoDestinoId', '==', bancoId),
      orderBy('fecha', 'desc'),
      limit(50)
    );

    let enviadasData: Transferencia[] = [];
    let recibidasData: Transferencia[] = [];

    const combinarYNotificar = () => {
      const todas = [...enviadasData, ...recibidasData];
      const unicas = Array.from(new Map(todas.map((t) => [t.id, t])).values());
      const ordenadas = unicas.sort((a, b) => b.fecha.getTime() - a.fecha.getTime());
      callback(ordenadas);
    };

    const unsub1 = onSnapshot(enviadas, (snapshot) => {
      enviadasData = snapshot.docs.map((doc) => docToData<Transferencia>(doc));
      combinarYNotificar();
    });

    const unsub2 = onSnapshot(recibidas, (snapshot) => {
      recibidasData = snapshot.docs.map((doc) => docToData<Transferencia>(doc));
      combinarYNotificar();
    });

    // Retornar función que desuscribe ambos
    return () => {
      unsub1();
      unsub2();
    };
  },

  // ========================================================================
  // MÉTODOS ALIAS - Compatibilidad con hooks legacy
  // ========================================================================

  /**
   * Alias de getById para compatibilidad con useBancos hook
   * @deprecated Usa getById directamente
   */
  async obtenerBanco(bancoId: BancoId): Promise<Banco | null> {
    return this.getById(bancoId);
  },

  /**
   * Alias de getIngresos para compatibilidad con useBancos hook
   * @deprecated Usa getIngresos directamente
   */
  async obtenerIngresos(bancoId: BancoId): Promise<Ingreso[]> {
    return this.getIngresos(bancoId);
  },

  /**
   * Alias de getGastos para compatibilidad con useBancos hook
   * @deprecated Usa getGastos directamente
   */
  async obtenerGastos(bancoId: BancoId): Promise<Gasto[]> {
    return this.getGastos(bancoId);
  },

  /**
   * Alias de getCortes para compatibilidad con useBancos hook
   * @deprecated Usa getCortes directamente
   */
  async obtenerCortes(bancoId: BancoId): Promise<Corte[]> {
    return this.getCortes(bancoId);
  },

  /**
   * Alias de getTransferencias para compatibilidad con useBancos hook
   * @deprecated Usa getTransferencias directamente
   */
  async obtenerTransferencias(bancoId: BancoId): Promise<Transferencia[]> {
    return this.getTransferencias(bancoId);
  },
};

export default bancosService;
