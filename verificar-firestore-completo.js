// Verificar datos en Firestore y comparar con archivos locales
import { initializeApp } from 'firebase/app';
import { collection, getDocs, getFirestore, limit, query } from 'firebase/firestore';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY || 'AIzaSyCR7zKZJAzCEq-jBbfkLJxWaz98zuRCkX4',
  authDomain:
    process.env.VITE_FIREBASE_AUTH_DOMAIN || 'premium-ecosystem-1760790572.firebaseapp.com',
  projectId: process.env.VITE_FIREBASE_PROJECT_ID || 'premium-ecosystem-1760790572',
  storageBucket:
    process.env.VITE_FIREBASE_STORAGE_BUCKET || 'premium-ecosystem-1760790572.firebasestorage.app',
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '1031760790572',
  appId: process.env.VITE_FIREBASE_APP_ID || '1:1031760790572:web:d82131f6551c52af5c98d6',
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function verificarColeccion(nombre) {
  try {
    const q = query(collection(db, nombre), limit(1000));
    const snapshot = await getDocs(q);
    return snapshot.size;
  } catch (error) {
    return 0;
  }
}

async function contarDatosLocales() {
  const dataPath = path.join(__dirname, 'src', 'apps', 'FlowDistributor', 'data');
  const archivos = [
    'panel-ordenes-compra-manual.json',
    'panel-clientes-manual.json',
    'panel-ventas-local-manual.json',
    'panel-gastos-abonos-manual.json',
    'panel-utilidades-manual.json',
    'panel-profit-manual.json',
    'panel-azteca-manual.json',
    'panel-leftie-manual.json',
    'panel-boveda-monte-manual.json',
    'panel-boveda-usa-manual.json',
    'panel-almacen-monte-manual.json',
    'panel-fletes-manual.json',
    'panel-dashboard-manual.json',
  ];

  const conteos = {};

  for (const archivo of archivos) {
    try {
      const filePath = path.join(dataPath, archivo);
      if (fs.existsSync(filePath)) {
        const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        const nombre = archivo.replace('panel-', '').replace('-manual.json', '');

        // Contar registros según estructura
        let count = 0;
        if (Array.isArray(data)) {
          count = data.length;
        } else {
          const keys = Object.keys(data);
          const firstKey = keys[0];
          if (data[firstKey]) {
            if (Array.isArray(data[firstKey])) {
              count = data[firstKey].length;
            } else if (data[firstKey].ingresosList) {
              count =
                (data[firstKey].ingresosList?.length || 0) +
                (data[firstKey].gastosList?.length || 0);
            }
          }
        }

        conteos[nombre] = count;
      }
    } catch (error) {
      console.error(`Error leyendo ${archivo}:`, error.message);
    }
  }

  return conteos;
}

async function main() {
  console.log('\n╔════════════════════════════════════════════════════════════╗');
  console.log('║  🔍 VERIFICACIÓN FIRESTORE vs DATOS LOCALES               ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');

  const colecciones = [
    'compras',
    'ventas',
    'clientes',
    'productos',
    'distribuidores',
    'bancos',
    'gastos',
    'almacen',
  ];

  console.log('📊 DATOS EN FIRESTORE:\n');
  const firestoreCounts = {};

  for (const col of colecciones) {
    const count = await verificarColeccion(col);
    firestoreCounts[col] = count;
    const icon = count > 0 ? '✅' : '❌';
    console.log(`${icon} ${col.padEnd(20)} ${count} documentos`);
  }

  console.log('\n📁 DATOS LOCALES:\n');
  const localCounts = await contarDatosLocales();

  for (const [nombre, count] of Object.entries(localCounts)) {
    const icon = count > 0 ? '✅' : '❌';
    console.log(`${icon} ${nombre.padEnd(20)} ${count} registros`);
  }

  console.log('\n📊 RESUMEN:\n');
  const totalFirestore = Object.values(firestoreCounts).reduce((a, b) => a + b, 0);
  const totalLocal = Object.values(localCounts).reduce((a, b) => a + b, 0);

  console.log(`Firestore: ${totalFirestore} documentos`);
  console.log(`Local:     ${totalLocal} registros`);
  console.log(`Diferencia: ${totalLocal - totalFirestore} registros por cargar\n`);

  process.exit(0);
}

main().catch(console.error);
