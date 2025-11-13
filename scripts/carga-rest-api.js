#!/usr/bin/env node
/**
 * 🔥 CARGA VIA REST API (FUNCIONA!)
 * Usa REST API de Firestore directamente
 */
import { readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import https from 'https';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const projectId = 'premium-ecosystem-1760790572';
const apiKey = process.env.VITE_FIREBASE_API_KEY;

const dataPath = join(__dirname, '../datos_paneles_limpios.json');
const data = JSON.parse(readFileSync(dataPath, 'utf-8'));

console.log('\n🔥 CARGA VIA REST API\n');

function convertirAFirestoreFormat(obj) {
  if (obj === null || obj === undefined) return { nullValue: null };
  if (typeof obj === 'string') return { stringValue: obj };
  if (typeof obj === 'number') {
    return Number.isInteger(obj)
      ? { integerValue: obj.toString() }
      : { doubleValue: obj };
  }
  if (typeof obj === 'boolean') return { booleanValue: obj };
  if (Array.isArray(obj)) {
    return { arrayValue: { values: obj.map(convertirAFirestoreFormat) } };
  }
  if (typeof obj === 'object') {
    const fields = {};
    for (const [key, value] of Object.entries(obj)) {
      fields[key] = convertirAFirestoreFormat(value);
    }
    return { mapValue: { fields } };
  }
  return { nullValue: null };
}

function subirDocumento(coleccion, docId, datos) {
  return new Promise((resolve, reject) => {
    const fields = {};
    for (const [key, value] of Object.entries(datos)) {
      fields[key] = convertirAFirestoreFormat(value);
    }

    const body = JSON.stringify({ fields });

    const options = {
      hostname: 'firestore.googleapis.com',
      path: `/v1/projects/${projectId}/databases/(default)/documents/${coleccion}/${docId}?key=${apiKey}`,
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body)
      }
    };

    const req = https.request(options, (res) => {
      let responseData = '';
      res.on('data', chunk => responseData += chunk);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(true);
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${responseData}`));
        }
      });
    });

    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

async function main() {
  let exitos = 0;
  let errores = 0;

  // 1. Órdenes de Compra
  console.log('📦 Órdenes de Compra:');
  for (const oc of data.distribuidores.ordenesCompra) {
    try {
      await subirDocumento('ordenes_compra', oc.id, oc);
      console.log(`  ✅ ${oc.id}`);
      exitos++;
    } catch (error) {
      console.error(`  ❌ ${oc.id}: ${error.message}`);
      errores++;
    }
  }

  // 2. Distribuidores
  console.log('\n👥 Distribuidores:');
  for (const dist of data.distribuidores.resumen) {
    const id = dist.nombre.replace(/[^\w-]/g, '_').toLowerCase();
    try {
      await subirDocumento('distribuidores', id, dist);
      console.log(`  ✅ ${dist.nombre}`);
      exitos++;
    } catch (error) {
      console.error(`  ❌ ${dist.nombre}: ${error.message}`);
      errores++;
    }
  }

  // 3. Dashboard
  console.log('\n📊 Dashboard:');
  try {
    await subirDocumento('dashboard', 'global', data.dashboard);
    console.log(`  ✅ Dashboard`);
    exitos++;
  } catch (error) {
    console.error(`  ❌ Dashboard: ${error.message}`);
    errores++;
  }

  // 4. Almacén
  console.log('\n📦 Almacén:');
  try {
    await subirDocumento('almacen_monte', 'inventario', data.almacen);
    console.log(`  ✅ Almacén`);
    exitos++;
  } catch (error) {
    console.error(`  ❌ Almacén: ${error.message}`);
    errores++;
  }

  // 5-11. Bancos
  console.log('\n🏦 Bancos:');
  const bancos = [
    ['boveda_monte', 'cuenta', data.bovedaMonte, 'Bóveda Monte'],
    ['boveda_usa', 'cuenta', data.bovedaUsa, 'Bóveda USA'],
    ['azteca', 'cuenta', data.azteca, 'Azteca'],
    ['utilidades', 'cuenta', data.utilidades, 'Utilidades'],
    ['fleteSur', 'cuenta', data.fleteSur, 'Flete Sur'],
    ['leftie', 'cuenta', data.leftie, 'Leftie'],
    ['profit', 'cuenta', data.profit, 'Profit'],
  ];

  for (const [col, id, datos, nombre] of bancos) {
    try {
      await subirDocumento(col, id, datos);
      console.log(`  ✅ ${nombre}`);
      exitos++;
    } catch (error) {
      console.error(`  ❌ ${nombre}: ${error.message}`);
      errores++;
    }
  }

  // 12. Clientes
  console.log('\n👥 Clientes:');
  for (const cliente of data.clientes) {
    try {
      await subirDocumento('clientes', cliente.id, cliente);
      console.log(`  ✅ ${cliente.nombre}`);
      exitos++;
    } catch (error) {
      console.error(`  ❌ ${cliente.nombre}: ${error.message}`);
      errores++;
    }
  }

  // Resumen
  console.log('\n' + '='.repeat(80));
  console.log(`✅ Exitosos: ${exitos} | ❌ Fallidos: ${errores}`);
  console.log('='.repeat(80) + '\n');

  if (errores === 0) {
    console.log('🎉 ¡TODOS LOS DATOS CARGADOS!\n');
  }

  process.exit(errores > 0 ? 1 : 0);
}

main();
