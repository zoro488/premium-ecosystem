#!/usr/bin/env node
/**
 * 🔥 TEST SIMPLE - VALIDAR CONEXIÓN
 */
import { initializeApp } from 'firebase/app';
import { doc, getFirestore, setDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
};

console.log('\n🧪 TEST DE CONEXIÓN FIRESTORE\n');

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function testSimple() {
  try {
    // Test 1: Documento super simple
    console.log('1️⃣ Test documento simple...');
    await setDoc(doc(db, 'test', 'test1'), {
      mensaje: 'hola',
      numero: 123,
      fecha: new Date().toISOString(),
    });
    console.log('✅ Test 1 exitoso\n');

    // Test 2: Documento con más datos
    console.log('2️⃣ Test con datos numéricos...');
    await setDoc(doc(db, 'test', 'test2'), {
      id: 'OC0001',
      fecha: '25/08/2025',
      origen: 'Q-MAYA',
      cantidad: 423,
      costo: 6100,
    });
    console.log('✅ Test 2 exitoso\n');

    console.log('🎉 CONEXIÓN FUNCIONA PERFECTAMENTE!\n');
    process.exit(0);
  } catch (error) {
    console.error('❌ ERROR:', error.message);
    console.error('📋 Código:', error.code);
    console.error('📋 Stack:', error.stack);
    process.exit(1);
  }
}

testSimple();
