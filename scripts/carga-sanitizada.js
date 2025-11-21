#!/usr/bin/env node
/**
 * 🔥 CARGA CON SANITIZACIÓN COMPLETA
 * Limpia TODOS los valores problemáticos para Firestore
 */
import { initializeApp } from 'firebase/app';
import { doc, getFirestore, setDoc } from 'firebase/firestore';
import { readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const dataPath = join(__dirname, '../datos_paneles_limpios.json');
const data = JSON.parse(readFileSync(dataPath, 'utf-8'));

console.log('\n🔥 CARGA CON SANITIZACIÓN TOTAL\n');

/**
 * Sanitiza valores para Firestore
 * Firestore NO acepta: undefined, NaN, Infinity, null en algunos contextos
 */
function sanitizar(obj) {
  if (obj === null || obj === undefined) {
    return null;
  }

  if (Array.isArray(obj)) {
    return obj.map(sanitizar).filter(v => v !== null);
  }

  if (typeof obj === 'object') {
    const limpio = {};
    for (const [key, value] of Object.entries(obj)) {
      // Sanitizar nombre de campo (solo alfanumérico y guiones bajos)
      const keyLimpia = key.replace(/[^\w]/g, '_');

      const valorSanitizado = sanitizar(value);

      // Solo agregar si el valor no es null/undefined
      if (valorSanitizado !== null && valorSanitizado !== undefined) {
        limpio[keyLimpia] = valorSanitizado;
      }
    }
    return Object.keys(limpio).length > 0 ? limpio : null;
  }

  if (typeof obj === 'number') {
    // Firestore no acepta NaN o Infinity
    if (isNaN(obj) || !isFinite(obj)) {
      return 0;
    }
    return obj;
  }

  if (typeof obj === 'string') {
    // Strings vacíos a null
    return obj.trim() === '' ? null : obj;
  }

  if (typeof obj === 'boolean') {
    return obj;
  }

  return null;
}

let exitos = 0;
let errores = 0;

async function subir(coleccion, id, datos, descripcion) {
  try {
    const datosSanitizados = sanitizar({
      ...datos,
      _timestamp: new Date().toISOString(),
    });

    if (!datosSanitizados) {
      console.log(`⚠️  ${descripcion}: Datos vacíos después de sanitizar`);
      return;
    }

    await setDoc(doc(db, coleccion, id), datosSanitizados);
    console.log(`✅ ${descripcion}`);
    exitos++;
  } catch (error) {
    console.error(`❌ ${descripcion}:`);
    console.error(`   Error: ${error.message}`);
    console.error(`   Código: ${error.code}`);
    errores++;
  }
}

async function main() {
  console.log('📦 Órdenes de Compra:');
  for (const oc of data.distribuidores.ordenesCompra) {
    await subir('ordenes_compra', oc.id, oc, `  ${oc.id}`);
  }

  console.log('\n👥 Distribuidores:');
  for (const dist of data.distribuidores.resumen) {
    const id = dist.distribuidor.replace(/[^\w]/g, '_').toLowerCase();
    await subir('distribuidores', id, dist, `  ${dist.distribuidor}`);
  }

  console.log('\n📊 Dashboard:');
  await subir('dashboard', 'global', data.dashboard, '  Dashboard');

  console.log('\n📦 Almacén:');
  await subir('almacen_monte', 'inventario', data.almacen, '  Almacén');

  console.log('\n🏦 Bancos:');
  await subir('boveda_monte', 'cuenta', data.bovedaMonte, '  Bóveda Monte');
  await subir('boveda_usa', 'cuenta', data.bovedaUsa, '  Bóveda USA');
  await subir('azteca', 'cuenta', data.azteca, '  Azteca');
  await subir('utilidades', 'cuenta', data.utilidades, '  Utilidades');
  await subir('fleteSur', 'cuenta', data.fleteSur, '  Flete Sur');
  await subir('leftie', 'cuenta', data.leftie, '  Leftie');
  await subir('profit', 'cuenta', data.profit, '  Profit');

  console.log('\n👥 Clientes:');
  for (const cliente of data.clientes) {
    await subir('clientes', cliente.id, cliente, `  ${cliente.nombre}`);
  }

  console.log('\n' + '='.repeat(80));
  console.log(`✅ Exitosos: ${exitos} | ❌ Fallidos: ${errores}`);
  console.log('='.repeat(80) + '\n');

  if (errores === 0) {
    console.log('🎉 ¡CARGA COMPLETADA!\n');
  }

  process.exit(errores > 0 ? 1 : 0);
}

main().catch(console.error);
