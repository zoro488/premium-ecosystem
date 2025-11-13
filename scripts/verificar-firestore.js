#!/usr/bin/env node
/**
 * Script para verificar datos en Firestore
 */
import { initializeApp } from 'firebase/app'
import { getFirestore, collection, getDocs, query, limit } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY || 'YOUR_API_KEY',
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN || 'premium-ecosystem.firebaseapp.com',
  projectId: process.env.VITE_FIREBASE_PROJECT_ID || 'premium-ecosystem',
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET || 'premium-ecosystem.appspot.com',
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || 'YOUR_SENDER_ID',
  appId: process.env.VITE_FIREBASE_APP_ID || 'YOUR_APP_ID',
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

async function verificar() {
  console.log('\n🔍 VERIFICANDO DATOS EN FIRESTORE\n')
  console.log('='.repeat(80))

  const colecciones = [
    'ventas',
    'clientes',
    'distribuidores',
    'bancos',
    'almacen',
    'gastosAbonos',
    'ordenesCompra',
    'productos',
  ]

  for (const col of colecciones) {
    try {
      const q = query(collection(db, col), limit(1))
      const snapshot = await getDocs(q)

      if (snapshot.empty) {
        console.log(`❌ ${col.padEnd(20)} - VACÍA`)
      } else {
        // Contar todos
        const allSnapshot = await getDocs(collection(db, col))
        console.log(`✅ ${col.padEnd(20)} - ${allSnapshot.size} documentos`)
      }
    } catch (error) {
      console.log(`⚠️  ${col.padEnd(20)} - No existe o error: ${error.message}`)
    }
  }

  console.log('='.repeat(80))
  console.log('✅ Verificación completada\n')
  process.exit(0)
}

verificar().catch(console.error)
