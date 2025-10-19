import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp
} from 'firebase/firestore';
import { db, auth, isFirebaseConfigured } from '../lib/firebase';

// Verificar si Firebase está disponible
const checkFirebase = () => {
  if (!isFirebaseConfigured()) {
    throw new Error('Firebase no está configurado. Por favor configura las variables de entorno.');
  }
};

/**
 * CRUD GENÉRICO para cualquier colección
 */

// CREATE - Crear documento
export const createDocument = async (collectionName, data) => {
  checkFirebase();
  try {
    const docRef = await addDoc(collection(db, collectionName), {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      userId: auth.currentUser?.uid || null
    });
    return { id: docRef.id, ...data };
  } catch (error) {
    console.error(`Error creando documento en ${collectionName}:`, error);
    throw error;
  }
};

// READ - Leer todos los documentos
export const getDocuments = async (collectionName, filters = {}) => {
  checkFirebase();
  try {
    let q = collection(db, collectionName);

    // Aplicar filtros si existen
    if (filters.userId) {
      q = query(q, where('userId', '==', filters.userId));
    }
    if (filters.orderBy) {
      q = query(q, orderBy(filters.orderBy.field, filters.orderBy.direction || 'asc'));
    }

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error(`Error obteniendo documentos de ${collectionName}:`, error);
    throw error;
  }
};

// READ - Leer un documento específico
export const getDocument = async (collectionName, id) => {
  checkFirebase();
  try {
    const docRef = doc(db, collectionName, id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      throw new Error(`Documento ${id} no encontrado en ${collectionName}`);
    }
  } catch (error) {
    console.error(`Error obteniendo documento ${id}:`, error);
    throw error;
  }
};

// UPDATE - Actualizar documento
export const updateDocument = async (collectionName, id, updates) => {
  checkFirebase();
  try {
    const docRef = doc(db, collectionName, id);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
    return { id, ...updates };
  } catch (error) {
    console.error(`Error actualizando documento ${id}:`, error);
    throw error;
  }
};

// DELETE - Eliminar documento
export const deleteDocument = async (collectionName, id) => {
  checkFirebase();
  try {
    await deleteDoc(doc(db, collectionName, id));
    return id;
  } catch (error) {
    console.error(`Error eliminando documento ${id}:`, error);
    throw error;
  }
};

// REALTIME - Escuchar cambios en tiempo real
export const subscribeToCollection = (collectionName, callback, filters = {}) => {
  checkFirebase();
  try {
    let q = collection(db, collectionName);

    // Aplicar filtros
    if (filters.userId) {
      q = query(q, where('userId', '==', filters.userId));
    }
    if (filters.orderBy) {
      q = query(q, orderBy(filters.orderBy.field, filters.orderBy.direction || 'asc'));
    }

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const documents = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      callback(documents);
    }, (error) => {
      console.error(`Error en suscripción a ${collectionName}:`, error);
    });

    return unsubscribe; // Llamar esto para dejar de escuchar
  } catch (error) {
    console.error(`Error suscribiéndose a ${collectionName}:`, error);
    throw error;
  }
};

/**
 * FUNCIONES ESPECÍFICAS PARA FLOWDISTRIBUTOR
 */

// Bancos
export const crearBanco = (data) => createDocument('bancos', data);
export const obtenerBancos = () => getDocuments('bancos', {
  userId: auth.currentUser?.uid,
  orderBy: { field: 'createdAt', direction: 'desc' }
});
export const obtenerBanco = (id) => getDocument('bancos', id);
export const actualizarBanco = (id, data) => updateDocument('bancos', id, data);
export const eliminarBanco = (id) => deleteDocument('bancos', id);
export const escucharBancos = (callback) => subscribeToCollection('bancos', callback, {
  userId: auth.currentUser?.uid
});

// Transacciones
export const crearTransaccion = (data) => createDocument('transacciones', data);
export const obtenerTransacciones = () => getDocuments('transacciones', {
  userId: auth.currentUser?.uid,
  orderBy: { field: 'fecha', direction: 'desc' }
});
export const eliminarTransaccion = (id) => deleteDocument('transacciones', id);

// Alertas
export const crearAlerta = (data) => createDocument('alertas', data);
export const obtenerAlertas = () => getDocuments('alertas', {
  userId: auth.currentUser?.uid,
  orderBy: { field: 'createdAt', direction: 'desc' }
});
export const actualizarAlerta = (id, data) => updateDocument('alertas', id, data);
export const eliminarAlerta = (id) => deleteDocument('alertas', id);

/**
 * FUNCIONES ESPECÍFICAS PARA SHADOWPRIME
 */

// Cuentas bancarias
export const crearCuentaBancaria = (data) => createDocument('cuentas_bancarias', data);
export const obtenerCuentasBancarias = () => getDocuments('cuentas_bancarias', {
  userId: auth.currentUser?.uid
});
export const actualizarCuentaBancaria = (id, data) => updateDocument('cuentas_bancarias', id, data);
export const eliminarCuentaBancaria = (id) => deleteDocument('cuentas_bancarias', id);

// Inversiones
export const crearInversion = (data) => createDocument('inversiones', data);
export const obtenerInversiones = () => getDocuments('inversiones', {
  userId: auth.currentUser?.uid
});
export const actualizarInversion = (id, data) => updateDocument('inversiones', id, data);
export const eliminarInversion = (id) => deleteDocument('inversiones', id);

// Propiedades
export const crearPropiedad = (data) => createDocument('propiedades', data);
export const obtenerPropiedades = () => getDocuments('propiedades', {
  userId: auth.currentUser?.uid
});
export const actualizarPropiedad = (id, data) => updateDocument('propiedades', id, data);
export const eliminarPropiedad = (id) => deleteDocument('propiedades', id);

/**
 * FUNCIONES ESPECÍFICAS PARA APOLLO
 */

// Finanzas personales
export const crearGasto = (data) => createDocument('gastos', data);
export const obtenerGastos = () => getDocuments('gastos', {
  userId: auth.currentUser?.uid,
  orderBy: { field: 'fecha', direction: 'desc' }
});
export const eliminarGasto = (id) => deleteDocument('gastos', id);

// Presupuestos
export const crearPresupuesto = (data) => createDocument('presupuestos', data);
export const obtenerPresupuestos = () => getDocuments('presupuestos', {
  userId: auth.currentUser?.uid
});
export const actualizarPresupuesto = (id, data) => updateDocument('presupuestos', id, data);
export const eliminarPresupuesto = (id) => deleteDocument('presupuestos', id);

/**
 * FUNCIONES ESPECÍFICAS PARA SYNAPSE
 */

// Conversaciones de IA
export const crearConversacion = (data) => createDocument('conversaciones', data);
export const obtenerConversaciones = () => getDocuments('conversaciones', {
  userId: auth.currentUser?.uid,
  orderBy: { field: 'createdAt', direction: 'desc' }
});
export const actualizarConversacion = (id, data) => updateDocument('conversaciones', id, data);
export const eliminarConversacion = (id) => deleteDocument('conversaciones', id);

// Mensajes
export const crearMensaje = (data) => createDocument('mensajes', data);
export const obtenerMensajes = (conversacionId) => getDocuments('mensajes', {
  where: { field: 'conversacionId', operator: '==', value: conversacionId },
  orderBy: { field: 'createdAt', direction: 'asc' }
});

/**
 * FUNCIONES ESPECÍFICAS PARA NEXUS
 */

// Tareas
export const crearTarea = (data) => createDocument('tareas', data);
export const obtenerTareas = () => getDocuments('tareas', {
  userId: auth.currentUser?.uid,
  orderBy: { field: 'createdAt', direction: 'desc' }
});
export const actualizarTarea = (id, data) => updateDocument('tareas', id, data);
export const eliminarTarea = (id) => deleteDocument('tareas', id);

// Proyectos
export const crearProyecto = (data) => createDocument('proyectos', data);
export const obtenerProyectos = () => getDocuments('proyectos', {
  userId: auth.currentUser?.uid
});
export const actualizarProyecto = (id, data) => updateDocument('proyectos', id, data);
export const eliminarProyecto = (id) => deleteDocument('proyectos', id);

export default {
  // CRUD Genérico
  createDocument,
  getDocuments,
  getDocument,
  updateDocument,
  deleteDocument,
  subscribeToCollection,

  // FlowDistributor
  crearBanco,
  obtenerBancos,
  obtenerBanco,
  actualizarBanco,
  eliminarBanco,
  escucharBancos,
  crearTransaccion,
  obtenerTransacciones,
  eliminarTransaccion,

  // ShadowPrime
  crearCuentaBancaria,
  obtenerCuentasBancarias,
  actualizarCuentaBancaria,
  eliminarCuentaBancaria,
  crearInversion,
  obtenerInversiones,

  // Apollo
  crearGasto,
  obtenerGastos,
  eliminarGasto,

  // Synapse
  crearConversacion,
  obtenerConversaciones,

  // Nexus
  crearTarea,
  obtenerTareas,
  actualizarTarea,
  eliminarTarea
};
