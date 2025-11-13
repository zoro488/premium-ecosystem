#!/usr/bin/env node
/**
 * 🔥 CARGA DE PANELES A FIRESTORE V2
 * Versión mejorada con sanitización de datos
 */
import { initializeApp } from 'firebase/app';
import { doc, getFirestore, setDoc } from 'firebase/firestore';
import { readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Firebase config desde .env
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

// Leer datos
const dataPath = join(__dirname, '../datos_paneles_completos.json');
const panelData = JSON.parse(readFileSync(dataPath, 'utf-8'));

console.log('\n🔥 CARGA DE PANELES A FIRESTORE V2');
console.log('='.repeat(80));

/**
 * Sanitiza un objeto para Firestore:
 * - Remueve undefined, null, empty strings
 * - Convierte nombres con caracteres especiales
 * - Asegura que todos los valores sean válidos
 */
function sanitizarParaFirestore(obj, path = '') {
  if (obj === null || obj === undefined) return null;

  if (Array.isArray(obj)) {
    return obj
      .map((item, i) => sanitizarParaFirestore(item, `${path}[${i}]`))
      .filter((item) => item !== null);
  }

  if (typeof obj === 'object' && obj !== null) {
    const resultado = {};
    for (const [key, value] of Object.entries(obj)) {
      // Sanitizar nombre de campo (remover caracteres especiales)
      const keySanitizada = key
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Remover acentos
        .replace(/[^\w\s-]/g, '') // Remover emoji y caracteres especiales
        .replace(/\s+/g, '_') // Espacios a underscore
        .substring(0, 1500); // Firestore limit

      const valorSanitizado = sanitizarParaFirestore(value, `${path}.${keySanitizada}`);

      if (valorSanitizado !== null && valorSanitizado !== undefined && valorSanitizado !== '') {
        resultado[keySanitizada] = valorSanitizado;
      }
    }
    return Object.keys(resultado).length > 0 ? resultado : null;
  }

  if (typeof obj === 'string') {
    // Limpiar strings (max 1MB pero prácticamente strings cortos)
    return obj.substring(0, 1048487);
  }

  if (typeof obj === 'number' && !isNaN(obj) && isFinite(obj)) {
    return obj;
  }

  if (typeof obj === 'boolean') {
    return obj;
  }

  return null;
}

/**
 * Sube documentos con retry y sanitización
 */
async function subirDocumento(coleccion, id, data, intentos = 3) {
  for (let i = 0; i < intentos; i++) {
    try {
      const docRef = doc(db, coleccion, id);
      const dataSanitizada = sanitizarParaFirestore({
        ...data,
        _metadata: {
          cargadoEn: new Date().toISOString(),
          version: '2.0',
        },
      });

      if (!dataSanitizada) {
        console.warn(`   ⚠️  ${id}: Datos vacíos después de sanitizar`);
        return false;
      }

      await setDoc(docRef, dataSanitizada);
      return true;
    } catch (error) {
      if (i === intentos - 1) {
        console.error(`   ❌ ${id}: ${error.message}`);
        return false;
      }
      console.warn(`   ⚠️  ${id}: Reintentando... (${i + 1}/${intentos})`);
      await new Promise((resolve) => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
  return false;
}

async function main() {
  let totalExitos = 0;
  let totalErrores = 0;

  // 1. DISTRIBUIDORES - Órdenes de Compra
  console.log('\n📦 PANEL: DISTRIBUIDORES');
  for (const oc of panelData.distribuidores.ordenesCompra) {
    const exito = await subirDocumento('ordenesCompra', oc.id, {
      ...oc,
      panel: 'distribuidores',
    });
    exito ? totalExitos++ : totalErrores++;
  }
  console.log(`   ✅ Órdenes de Compra: ${panelData.distribuidores.ordenesCompra.length}`);

  // 2. DISTRIBUIDORES - Resumen
  for (const dist of panelData.distribuidores.resumen) {
    const idSanitizado = dist.distribuidor.replace(/[^\w-]/g, '_');
    const exito = await subirDocumento('distribuidores', idSanitizado, {
      ...dist,
      panel: 'distribuidores',
    });
    exito ? totalExitos++ : totalErrores++;
  }
  console.log(`   ✅ Distribuidores: ${panelData.distribuidores.resumen.length}`);

  // 3. DASHBOARD
  console.log('\n📊 PANEL: DASHBOARD');
  const exitoDashboard = await subirDocumento('dashboard', 'global', {
    ...panelData.dashboard,
    panel: 'dashboard',
  });
  exitoDashboard ? totalExitos++ : totalErrores++;
  console.log(`   ✅ Dashboard Global`);

  // 4. ALMACÉN
  console.log('\n📦 PANEL: ALMACÉN');
  const exitoAlmacen = await subirDocumento('almacen', 'inventario', {
    ...panelData.almacen,
    panel: 'almacen',
  });
  exitoAlmacen ? totalExitos++ : totalErrores++;
  console.log(`   ✅ Almacén Inventario`);

  // 5-12. BANCOS (8 paneles)
  console.log('\n🏦 PANELES: BANCOS');
  const bancos = [
    { key: 'bovedaMonte', nombre: 'Bóveda Monte' },
    { key: 'bovedaUsa', nombre: 'Bóveda USA' },
    { key: 'azteca', nombre: 'Azteca' },
    { key: 'utilidades', nombre: 'Utilidades' },
    { key: 'fleteSur', nombre: 'Flete Sur' },
    { key: 'leftie', nombre: 'Leftie' },
    { key: 'profit', nombre: 'Profit' },
  ];

  for (const banco of bancos) {
    if (panelData[banco.key]) {
      const exito = await subirDocumento('bancos', banco.key, {
        ...panelData[banco.key],
        panel: 'bancos',
        nombre: banco.nombre,
      });
      exito ? totalExitos++ : totalErrores++;
      console.log(`   ✅ ${banco.nombre}`);
    }
  }

  // 13. CLIENTES
  console.log('\n👥 PANEL: CLIENTES');
  for (const cliente of panelData.clientes) {
    const exito = await subirDocumento('clientes', cliente.id, {
      ...cliente,
      panel: 'clientes',
    });
    exito ? totalExitos++ : totalErrores++;
  }
  console.log(`   ✅ Clientes: ${panelData.clientes.length}`);

  // RESUMEN FINAL
  console.log('\n' + '='.repeat(80));
  console.log(`✅ CARGA COMPLETADA`);
  console.log(`   ✔️  Documentos exitosos: ${totalExitos}`);
  console.log(`   ❌ Documentos fallidos: ${totalErrores}`);
  console.log(`   📊 Total procesados: ${totalExitos + totalErrores}`);
  console.log('='.repeat(80) + '\n');

  process.exit(totalErrores > 0 ? 1 : 0);
}

main().catch((error) => {
  console.error('\n❌ ERROR FATAL:', error);
  process.exit(1);
});
