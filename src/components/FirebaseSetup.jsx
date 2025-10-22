import { useEffect, useState } from 'react';

import {
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { addDoc, collection, deleteDoc, doc, getDocs } from 'firebase/firestore';
import { motion } from 'framer-motion';

import { auth, db, isFirebaseConfigured } from '../lib/firebase';

/**
 * Componente de verificación y prueba de Firebase
 * Este componente verifica que Firebase esté correctamente configurado
 * y permite probar las funcionalidades básicas
 */
export default function FirebaseSetup() {
  const [status, setStatus] = useState({
    configured: false,
    firestoreWorking: false,
    authWorking: false,
    testing: false,
    error: null,
  });

  const [testResults, setTestResults] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    checkFirebaseConfig();
  }, []);

  const checkFirebaseConfig = () => {
    const configured = isFirebaseConfigured();
    setStatus((prev) => ({ ...prev, configured }));

    if (configured) {
      addTestResult('✅ Firebase está configurado correctamente', 'success');
      addTestResult(`📦 Project ID: ${import.meta.env.VITE_FIREBASE_PROJECT_ID}`, 'info');
    } else {
      addTestResult('❌ Firebase NO está configurado', 'error');
      addTestResult('⚠️ Verifica el archivo .env', 'warning');
    }
  };

  const addTestResult = (message, type = 'info') => {
    setTestResults((prev) => [
      ...prev,
      { message, type, timestamp: new Date().toLocaleTimeString() },
    ]);
  };

  const testFirestore = async () => {
    if (!isFirebaseConfigured()) {
      addTestResult('❌ Firebase no configurado', 'error');
      return;
    }

    setStatus((prev) => ({ ...prev, testing: true, error: null }));
    addTestResult('🧪 Probando Firestore...', 'info');

    try {
      // Intentar crear un documento de prueba
      addTestResult('📝 Creando documento de prueba...', 'info');

      const docRef = await addDoc(collection(db, 'test_firebase'), {
        message: 'Prueba de Firebase',
        timestamp: new Date().toISOString(),
        source: 'FirebaseSetup Component',
      });

      addTestResult(`✅ Documento creado: ${docRef.id}`, 'success');

      // Leer el documento
      addTestResult('📖 Leyendo documentos...', 'info');
      const querySnapshot = await getDocs(collection(db, 'test_firebase'));
      addTestResult(`✅ Se encontraron ${querySnapshot.size} documentos`, 'success');

      // Eliminar el documento de prueba
      addTestResult('🗑️ Eliminando documento de prueba...', 'info');
      await deleteDoc(doc(db, 'test_firebase', docRef.id));
      addTestResult('✅ Documento eliminado', 'success');

      addTestResult('🎉 FIRESTORE FUNCIONA CORRECTAMENTE', 'success');
      setStatus((prev) => ({ ...prev, firestoreWorking: true, testing: false }));
    } catch (error) {
      // console.error('Error en Firestore:', error);
      if (error.code === 'permission-denied') {
        addTestResult('❌ Permiso denegado en Firestore', 'error');
        addTestResult('⚠️ Debes activar Firestore en modo de prueba:', 'warning');
        addTestResult(
          '1. Ve a: https://console.firebase.google.com/project/premium-ecosystem-1760790572/firestore',
          'info'
        );
        addTestResult('2. Click en "Crear base de datos"', 'info');
        addTestResult('3. Selecciona "Iniciar en modo de prueba"', 'info');
        addTestResult('4. Ubicación: us-central1', 'info');
        addTestResult('5. Click en "Habilitar"', 'info');
      } else if (error.code === 'unavailable') {
        addTestResult('❌ Firestore no está disponible', 'error');
        addTestResult('⚠️ Verifica que Firestore esté habilitado en Firebase Console', 'warning');
      } else {
        addTestResult(`❌ Error: ${error.message}`, 'error');
      }

      setStatus((prev) => ({ ...prev, error: error.message, testing: false }));
    }
  };

  const testAuth = async () => {
    if (!isFirebaseConfigured()) {
      addTestResult('❌ Firebase no configurado', 'error');
      return;
    }

    setStatus((prev) => ({ ...prev, testing: true, error: null }));
    addTestResult('🧪 Probando Authentication...', 'info');

    try {
      const testEmail = `test-${Date.now()}@test.com`;
      const testPassword = 'test123456';

      // Intentar crear usuario
      addTestResult('👤 Creando usuario de prueba...', 'info');

      const userCredential = await createUserWithEmailAndPassword(auth, testEmail, testPassword);
      addTestResult(`✅ Usuario creado: ${userCredential.user.email}`, 'success');
      setUser(userCredential.user);

      // Cerrar sesión
      addTestResult('🚪 Cerrando sesión...', 'info');
      await firebaseSignOut(auth);
      addTestResult('✅ Sesión cerrada', 'success');

      // Iniciar sesión
      addTestResult('🔑 Iniciando sesión...', 'info');
      const signInCredential = await signInWithEmailAndPassword(auth, testEmail, testPassword);
      addTestResult(`✅ Sesión iniciada: ${signInCredential.user.email}`, 'success');
      setUser(signInCredential.user);

      // Cerrar sesión final
      await firebaseSignOut(auth);
      setUser(null);

      addTestResult('🎉 AUTHENTICATION FUNCIONA CORRECTAMENTE', 'success');
      setStatus((prev) => ({ ...prev, authWorking: true, testing: false }));
    } catch (error) {
      // console.error('Error en Authentication:', error);
      if (error.code === 'auth/operation-not-allowed') {
        addTestResult('❌ Email/Password no está habilitado', 'error');
        addTestResult('⚠️ Debes activar Authentication:', 'warning');
        addTestResult(
          '1. Ve a: https://console.firebase.google.com/project/premium-ecosystem-1760790572/authentication',
          'info'
        );
        addTestResult('2. Click en "Comenzar"', 'info');
        addTestResult('3. Click en "Email/Password"', 'info');
        addTestResult('4. Habilitar y Guardar', 'info');
      } else {
        addTestResult(`❌ Error: ${error.message}`, 'error');
      }

      setStatus((prev) => ({ ...prev, error: error.message, testing: false }));
    }
  };

  const testAll = async () => {
    setTestResults([]);
    addTestResult('🚀 Iniciando pruebas completas de Firebase...', 'info');
    await testFirestore();
    await new Promise((resolve) => setTimeout(resolve, 1000));
    await testAuth();
    addTestResult('✅ Pruebas completadas', 'success');
  };

  const clearResults = () => {
    setTestResults([]);
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'success':
        return 'text-green-400';
      case 'error':
        return 'text-red-400';
      case 'warning':
        return 'text-yellow-400';
      default:
        return 'text-slate-300';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      case 'warning':
        return '⚠️';
      default:
        return '📌';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-5xl font-bold text-white mb-4">🔥 Firebase Setup & Testing</h1>
          <p className="text-slate-300 text-lg">
            Verificación y pruebas de Firebase para Premium Ecosystem
          </p>
        </motion.div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Firebase Config */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`p-6 rounded-2xl backdrop-blur-xl border ${
              status.configured
                ? 'bg-green-500/10 border-green-500/30'
                : 'bg-red-500/10 border-red-500/30'
            }`}
          >
            <div className="text-4xl mb-3">{status.configured ? '✅' : '❌'}</div>
            <h3 className="text-xl font-bold text-white mb-2">Configuración</h3>
            <p className="text-slate-300 text-sm">
              {status.configured ? 'Firebase configurado' : 'No configurado'}
            </p>
          </motion.div>

          {/* Firestore */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className={`p-6 rounded-2xl backdrop-blur-xl border ${
              status.firestoreWorking
                ? 'bg-green-500/10 border-green-500/30'
                : 'bg-slate-500/10 border-slate-500/30'
            }`}
          >
            <div className="text-4xl mb-3">{status.firestoreWorking ? '✅' : '📦'}</div>
            <h3 className="text-xl font-bold text-white mb-2">Firestore</h3>
            <p className="text-slate-300 text-sm">
              {status.firestoreWorking ? 'Funcionando' : 'No probado'}
            </p>
          </motion.div>

          {/* Authentication */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className={`p-6 rounded-2xl backdrop-blur-xl border ${
              status.authWorking
                ? 'bg-green-500/10 border-green-500/30'
                : 'bg-slate-500/10 border-slate-500/30'
            }`}
          >
            <div className="text-4xl mb-3">{status.authWorking ? '✅' : '🔐'}</div>
            <h3 className="text-xl font-bold text-white mb-2">Authentication</h3>
            <p className="text-slate-300 text-sm">
              {status.authWorking ? 'Funcionando' : 'No probado'}
            </p>
          </motion.div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 mb-8 justify-center">
          <button
            onClick={testFirestore}
            disabled={!status.configured || status.testing}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white rounded-xl font-semibold transition-colors"
          >
            {status.testing ? '⏳ Probando...' : '🧪 Probar Firestore'}
          </button>

          <button
            onClick={testAuth}
            disabled={!status.configured || status.testing}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white rounded-xl font-semibold transition-colors"
          >
            {status.testing ? '⏳ Probando...' : '🧪 Probar Authentication'}
          </button>

          <button
            onClick={testAll}
            disabled={!status.configured || status.testing}
            className="px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white rounded-xl font-semibold transition-colors"
          >
            {status.testing ? '⏳ Probando...' : '🚀 Probar Todo'}
          </button>

          <button
            onClick={clearResults}
            className="px-6 py-3 bg-slate-600 hover:bg-slate-700 text-white rounded-xl font-semibold transition-colors"
          >
            🗑️ Limpiar
          </button>
        </div>

        {/* Test Results */}
        {testResults.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700 p-6"
          >
            <h2 className="text-2xl font-bold text-white mb-4">📊 Resultados de Pruebas</h2>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {testResults.map((result, index) => (
                <motion.div
                  key={`item-${index}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-start gap-3 p-3 rounded-lg bg-slate-900/50"
                >
                  <span className="text-xl">{getTypeIcon(result.type)}</span>
                  <div className="flex-1">
                    <p className={`${getTypeColor(result.type)} font-mono text-sm`}>
                      {result.message}
                    </p>
                    <p className="text-slate-500 text-xs mt-1">{result.timestamp}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Quick Links */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <a
            href="https://console.firebase.google.com/project/premium-ecosystem-1760790572/firestore"
            target="_blank"
            rel="noopener noreferrer"
            className="p-4 bg-orange-600/20 border border-orange-500/30 rounded-xl hover:bg-orange-600/30 transition-colors"
          >
            <h3 className="text-white font-bold mb-2">🔥 Activar Firestore</h3>
            <p className="text-slate-300 text-sm">
              Click para ir a Firebase Console y activar Firestore Database
            </p>
          </a>

          <a
            href="https://console.firebase.google.com/project/premium-ecosystem-1760790572/authentication"
            target="_blank"
            rel="noopener noreferrer"
            className="p-4 bg-purple-600/20 border border-purple-500/30 rounded-xl hover:bg-purple-600/30 transition-colors"
          >
            <h3 className="text-white font-bold mb-2">🔐 Activar Authentication</h3>
            <p className="text-slate-300 text-sm">
              Click para ir a Firebase Console y activar Authentication
            </p>
          </a>
        </div>
      </div>
    </div>
  );
}
