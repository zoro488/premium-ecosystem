// Script para activar Firestore y Authentication usando Firebase Admin SDK
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';

const projectId = 'premium-ecosystem-1760790572';
const apiKey = 'AIzaSyCR7zKZJAzCEq-jBbfkLJxWaz98zuRCkX4';

console.log('🔥 Configurando Firebase...');
console.log(`📦 Project ID: ${projectId}`);

// Nota: Para configurar Firestore y Authentication desde CLI,
// necesitamos usar la Firebase Console o gcloud CLI con autenticación completa.
// La API Key por sí sola no tiene permisos de administrador.

console.log('\n⚠️ Información Importante:');
console.log('La API Key que proporcionaste es para el CLIENTE (frontend).');
console.log('Para activar servicios necesitamos credenciales de ADMINISTRADOR.\n');

console.log('📋 Opciones para activar Firestore y Authentication:\n');

console.log('OPCIÓN 1: Firebase Console (MÁS RÁPIDO - 2 minutos)');
console.log('---------------------------------------------------');
console.log('Firestore:');
console.log('  1. Ve a: https://console.firebase.google.com/project/premium-ecosystem-1760790572/firestore');
console.log('  2. Click "Crear base de datos"');
console.log('  3. Selecciona "Modo de prueba"');
console.log('  4. Ubicación: us-central1');
console.log('  5. Click "Habilitar"\n');

console.log('Authentication:');
console.log('  1. Ve a: https://console.firebase.google.com/project/premium-ecosystem-1760790572/authentication');
console.log('  2. Click "Comenzar"');
console.log('  3. Habilita "Email/Password"');
console.log('  4. Habilita "Google" (opcional)\n');

console.log('OPCIÓN 2: Firebase CLI (Requiere login)');
console.log('---------------------------------------------------');
console.log('  1. Ejecuta: firebase login');
console.log('  2. Ejecuta: firebase init firestore');
console.log('  3. Ejecuta: firebase deploy --only firestore:rules\n');

console.log('OPCIÓN 3: Componente de Pruebas (Interactivo)');
console.log('---------------------------------------------------');
console.log('  1. Abre: http://localhost:3003/firebase-setup');
console.log('  2. Click en "Probar Todo"');
console.log('  3. Sigue las instrucciones en pantalla\n');

console.log('✅ Tu configuración actual está LISTA:');
console.log('  - Firebase SDK instalado');
console.log('  - Credenciales en .env');
console.log('  - Código de integración completo');
console.log('  - Solo falta activar los servicios (2 min)\n');

console.log('💡 RECOMENDACIÓN:');
console.log('  Usa OPCIÓN 1 (Firebase Console) - Es lo más rápido y directo.\n');
