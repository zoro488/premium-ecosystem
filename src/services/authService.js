import {
  EmailAuthProvider,
  FacebookAuthProvider,
  GithubAuthProvider,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  deleteUser,
  onAuthStateChanged,
  reauthenticateWithCredential,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateEmail,
  updatePassword,
  updateProfile,
} from 'firebase/auth';

import { auth, isFirebaseConfigured } from '../lib/firebase';

/**
 * REGISTRO Y LOGIN
 */

// Registrar nuevo usuario con email y contraseña
export const registrarUsuario = async (email, password, nombre) => {
  if (!isFirebaseConfigured()) {
    throw new Error('Firebase no está configurado');
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);

    // Actualizar perfil con nombre
    if (nombre) {
      await updateProfile(userCredential.user, {
        displayName: nombre,
      });
    }

    return userCredential.user;
  } catch (error) {
    // console.error('Error registrando usuario:', error);
    throw error;
  }
};

// Iniciar sesión con email y contraseña
export const iniciarSesion = async (email, password) => {
  if (!isFirebaseConfigured()) {
    throw new Error('Firebase no está configurado');
  }

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    // console.error('Error iniciando sesión:', error);
    throw error;
  }
};

// Cerrar sesión
export const cerrarSesion = async () => {
  if (!isFirebaseConfigured()) {
    return;
  }

  try {
    await signOut(auth);
  } catch (error) {
    // console.error('Error cerrando sesión:', error);
    throw error;
  }
};

/**
 * AUTENTICACIÓN CON REDES SOCIALES
 */

// Iniciar sesión con Google
export const iniciarSesionConGoogle = async () => {
  if (!isFirebaseConfigured()) {
    throw new Error('Firebase no está configurado');
  }

  try {
    const provider = new GoogleAuthProvider();
    // Configurar idioma español
    provider.setCustomParameters({
      prompt: 'select_account',
    });
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (error) {
    // console.error('Error con Google Sign-In:', error);
    throw error;
  }
};

// Iniciar sesión con Facebook
export const iniciarSesionConFacebook = async () => {
  if (!isFirebaseConfigured()) {
    throw new Error('Firebase no está configurado');
  }

  try {
    const provider = new FacebookAuthProvider();
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (error) {
    // console.error('Error con Facebook Sign-In:', error);
    throw error;
  }
};

// Iniciar sesión con GitHub
export const iniciarSesionConGithub = async () => {
  if (!isFirebaseConfigured()) {
    throw new Error('Firebase no está configurado');
  }

  try {
    const provider = new GithubAuthProvider();
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (error) {
    // console.error('Error con GitHub Sign-In:', error);
    throw error;
  }
};

/**
 * RECUPERACIÓN DE CONTRASEÑA
 */

// Enviar email de recuperación de contraseña
export const recuperarContrasena = async (email) => {
  if (!isFirebaseConfigured()) {
    throw new Error('Firebase no está configurado');
  }

  try {
    await sendPasswordResetEmail(auth, email, {
      url: window.location.origin, // URL de retorno después de resetear
      handleCodeInApp: false,
    });
  } catch (error) {
    // console.error('Error recuperando contraseña:', error);
    throw error;
  }
};

/**
 * GESTIÓN DE PERFIL
 */

// Actualizar nombre del usuario
export const actualizarNombre = async (nuevoNombre) => {
  if (!isFirebaseConfigured()) {
    throw new Error('Firebase no está configurado');
  }

  if (!auth.currentUser) {
    throw new Error('No hay usuario autenticado');
  }

  try {
    await updateProfile(auth.currentUser, {
      displayName: nuevoNombre,
    });
    return auth.currentUser;
  } catch (error) {
    // console.error('Error actualizando nombre:', error);
    throw error;
  }
};

// Actualizar foto de perfil
export const actualizarFotoPerfil = async (photoURL) => {
  if (!isFirebaseConfigured()) {
    throw new Error('Firebase no está configurado');
  }

  if (!auth.currentUser) {
    throw new Error('No hay usuario autenticado');
  }

  try {
    await updateProfile(auth.currentUser, {
      photoURL: photoURL,
    });
    return auth.currentUser;
  } catch (error) {
    // console.error('Error actualizando foto:', error);
    throw error;
  }
};

// Actualizar email
export const actualizarEmailUsuario = async (nuevoEmail) => {
  if (!isFirebaseConfigured()) {
    throw new Error('Firebase no está configurado');
  }

  if (!auth.currentUser) {
    throw new Error('No hay usuario autenticado');
  }

  try {
    await updateEmail(auth.currentUser, nuevoEmail);
    return auth.currentUser;
  } catch (error) {
    // console.error('Error actualizando email:', error);
    throw error;
  }
};

// Actualizar contraseña
export const actualizarContrasena = async (nuevaContrasena) => {
  if (!isFirebaseConfigured()) {
    throw new Error('Firebase no está configurado');
  }

  if (!auth.currentUser) {
    throw new Error('No hay usuario autenticado');
  }

  try {
    await updatePassword(auth.currentUser, nuevaContrasena);
    return auth.currentUser;
  } catch (error) {
    // console.error('Error actualizando contraseña:', error);
    throw error;
  }
};

// Reautenticar usuario (necesario antes de operaciones sensibles)
export const reautenticarUsuario = async (password) => {
  if (!isFirebaseConfigured()) {
    throw new Error('Firebase no está configurado');
  }

  if (!auth.currentUser) {
    throw new Error('No hay usuario autenticado');
  }

  try {
    const credential = EmailAuthProvider.credential(auth.currentUser.email, password);
    await reauthenticateWithCredential(auth.currentUser, credential);
    return true;
  } catch (error) {
    // console.error('Error reautenticando usuario:', error);
    throw error;
  }
};

// Eliminar cuenta de usuario
export const eliminarCuenta = async () => {
  if (!isFirebaseConfigured()) {
    throw new Error('Firebase no está configurado');
  }

  if (!auth.currentUser) {
    throw new Error('No hay usuario autenticado');
  }

  try {
    await deleteUser(auth.currentUser);
  } catch (error) {
    // console.error('Error eliminando cuenta:', error);
    throw error;
  }
};

/**
 * ESTADO DE AUTENTICACIÓN
 */

// Escuchar cambios de autenticación
export const escucharAuthState = (callback) => {
  if (!isFirebaseConfigured()) {
    callback(null);
    return () => {}; // Retornar función vacía si no está configurado
  }

  return onAuthStateChanged(auth, callback);
};

// Obtener usuario actual
export const obtenerUsuarioActual = () => {
  if (!isFirebaseConfigured()) {
    return null;
  }

  return auth.currentUser;
};

// Verificar si hay usuario autenticado
export const estaAutenticado = () => {
  if (!isFirebaseConfigured()) {
    return false;
  }

  return auth.currentUser !== null;
};

// Obtener token de autenticación
export const obtenerToken = async () => {
  if (!isFirebaseConfigured()) {
    return null;
  }

  if (!auth.currentUser) {
    return null;
  }

  try {
    return await auth.currentUser.getIdToken();
  } catch (error) {
    // console.error('Error obteniendo token:', error);
    return null;
  }
};

/**
 * UTILIDADES
 */

// Manejar errores de autenticación con mensajes en español
export const obtenerMensajeError = (errorCode) => {
  const errores = {
    'auth/email-already-in-use': 'Este email ya está registrado',
    'auth/invalid-email': 'Email inválido',
    'auth/operation-not-allowed': 'Operación no permitida',
    'auth/weak-password': 'La contraseña es muy débil (mínimo 6 caracteres)',
    'auth/user-disabled': 'Esta cuenta ha sido deshabilitada',
    'auth/user-not-found': 'No existe una cuenta con este email',
    'auth/wrong-password': 'Contraseña incorrecta',
    'auth/too-many-requests': 'Demasiados intentos fallidos. Intenta más tarde',
    'auth/network-request-failed': 'Error de red. Verifica tu conexión',
    'auth/requires-recent-login': 'Esta operación requiere reautenticación',
    'auth/popup-closed-by-user': 'Ventana de autenticación cerrada',
    'auth/cancelled-popup-request': 'Operación cancelada',
    'auth/popup-blocked': 'Popup bloqueado por el navegador',
  };

  return errores[errorCode] || 'Error de autenticación';
};

export default {
  // Registro y Login
  registrarUsuario,
  iniciarSesion,
  cerrarSesion,

  // Redes Sociales
  iniciarSesionConGoogle,
  iniciarSesionConFacebook,
  iniciarSesionConGithub,

  // Recuperación
  recuperarContrasena,

  // Perfil
  actualizarNombre,
  actualizarFotoPerfil,
  actualizarEmailUsuario,
  actualizarContrasena,
  reautenticarUsuario,
  eliminarCuenta,

  // Estado
  escucharAuthState,
  obtenerUsuarioActual,
  estaAutenticado,
  obtenerToken,

  // Utilidades
  obtenerMensajeError,
};
