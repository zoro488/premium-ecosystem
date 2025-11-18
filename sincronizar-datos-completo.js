/* eslint-disable no-console */
// Script para sincronizar TODOS los datos locales a Firestore
import { initializeApp } from 'firebase/app';
import { collection, getDocs, getFirestore, writeBatch } from 'firebase/firestore';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const firebaseConfig = {
  apiKey: 'AIzaSyCR7zKZJAzCEq-jBbfkLJxWaz98zuRCkX4',
  authDomain: 'premium-ecosystem-1760790572.firebaseapp.com',
  projectId: 'premium-ecosystem-1760790572',
  storageBucket: 'premium-ecosystem-1760790572.firebasestorage.app',
  messagingSenderId: '1031760790572',
  appId: '1:1031760790572:web:d82131f6551c52af5c98d6',
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

function leerArchivoJSON(nombre) {
  const filePath = path.join(
    __dirname,
    'src',
    'apps',
    'FlowDistributor',
    'data',
    `${nombre}-manual.json`
  );
  if (fs.existsSync(filePath)) {
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  }
  return null;
}

function generarId() {
  return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

async function limpiarColeccion(nombreColeccion) {
  console.log(`🗑️  Limpiando colección: ${nombreColeccion}...`);
  const snapshot = await getDocs(collection(db, nombreColeccion));

  if (snapshot.empty) {
    console.log(`   ✅ Ya está vacía`);
    return 0;
  }

  const batch = writeBatch(db);
  let count = 0;

  snapshot.forEach((documento) => {
    batch.delete(documento.ref);
    count++;

    if (count % 500 === 0) {
      // Firestore limita a 500 ops por batch
      console.log(`   🗑️  Eliminando lote... (${count} docs)`);
    }
  });

  await batch.commit();
  console.log(`   ✅ Eliminados: ${count} documentos`);
  return count;
}

async function cargarColeccion(nombreColeccion, documentos) {
  if (!documentos || documentos.length === 0) {
    console.log(`⏭️  Colección ${nombreColeccion}: Sin datos`);
    return 0;
  }

  console.log(`📤 Cargando ${nombreColeccion}... (${documentos.length} docs)`);

  let batch = writeBatch(db);
  let count = 0;
  let batchCount = 0;

  for (const doc of documentos) {
    const docId = doc.id || generarId();
    const docRef = collection(db, nombreColeccion).doc
      ? collection(db, nombreColeccion).doc(docId)
      : doc(collection(db, nombreColeccion), docId);

    batch.set(docRef, {
      ...doc,
      updatedAt: new Date().toISOString(),
      syncedAt: new Date().toISOString(),
    });

    count++;
    batchCount++;

    if (batchCount >= 500) {
      await batch.commit();
      console.log(`   💾 Guardado lote... (${count}/${documentos.length})`);
      batch = writeBatch(db);
      batchCount = 0;
    }
  }

  if (batchCount > 0) {
    await batch.commit();
  }

  console.log(`   ✅ ${nombreColeccion}: ${count} documentos cargados`);
  return count;
}

function transformarDatos() {
  console.log('\n📊 Transformando datos locales...\n');

  const datos = {};

  // 1. Órdenes de Compra
  const ordenesData = leerArchivoJSON('panel-ordenes-compra');
  if (ordenesData?.distribuidores) {
    datos.compras =
      ordenesData.distribuidores.ordenesCompra?.map((oc) => ({
        id: `oc_${oc.oc || generarId()}`,
        ...oc,
        tipo: 'orden_compra',
      })) || [];

    datos.distribuidores =
      ordenesData.distribuidores.distribuidores?.map((dist) => ({
        id: `dist_${dist.nombre?.replace(/\s/g, '_') || generarId()}`,
        ...dist,
      })) || [];
  }

  // 2. Clientes
  const clientesData = leerArchivoJSON('panel-clientes');
  datos.clientes =
    clientesData?.clientes?.map((cli) => ({
      id: `cli_${cli.nombre?.replace(/\s/g, '_') || generarId()}`,
      ...cli,
    })) || [];

  // 3. Ventas Locales
  const ventasData = leerArchivoJSON('panel-ventas-local');
  datos.ventas =
    ventasData?.ventasLocal?.map((venta) => ({
      id: `venta_${generarId()}`,
      ...venta,
      tipo: 'venta_local',
    })) || [];

  // 4. Gastos y Abonos
  const gastosData = leerArchivoJSON('panel-gastos-abonos');
  datos.gastos =
    gastosData?.gastosAbonos?.map((gasto) => ({
      id: `gasto_${generarId()}`,
      ...gasto,
    })) || [];

  // 5. Almacén Monte
  const almacenData = leerArchivoJSON('panel-almacen-monte');
  if (almacenData?.almacenMonte) {
    const alm = almacenData.almacenMonte;
    datos.almacen = [
      ...(alm.ordenesCompra?.map((oc) => ({
        id: `alm_oc_${generarId()}`,
        ...oc,
        tipo: 'orden_compra',
      })) || []),
      ...(alm.salidas?.map((sal) => ({
        id: `alm_sal_${generarId()}`,
        ...sal,
        tipo: 'salida',
      })) || []),
    ];
  }

  // 6-13. Paneles de Bancos
  const panelesBancos = [
    { archivo: 'panel-boveda-monte', key: 'bovedaMonte', nombre: 'Bóveda Monte' },
    { archivo: 'panel-boveda-usa', key: 'bovedaUsa', nombre: 'Bóveda USA' },
    { archivo: 'panel-azteca', key: 'azteca', nombre: 'Azteca' },
    { archivo: 'panel-leftie', key: 'leftie', nombre: 'Leftie' },
    { archivo: 'panel-profit', key: 'profit', nombre: 'Profit' },
    { archivo: 'panel-utilidades', key: 'utilidades', nombre: 'Utilidades' },
    { archivo: 'panel-fletes', key: 'fleteSur', nombre: 'Flete Sur' },
  ];

  datos.bancos = [];

  for (const panel of panelesBancos) {
    const panelData = leerArchivoJSON(panel.archivo);
    if (panelData?.[panel.key]) {
      const p = panelData[panel.key];

      // Ingresos
      const ingresos =
        p.ingresosList?.map((ing) => ({
          id: `${panel.key}_ing_${generarId()}`,
          ...ing,
          panel: panel.key,
          panelNombre: panel.nombre,
          tipo: 'ingreso',
        })) || [];

      // Gastos
      const gastos =
        p.gastosList?.map((gasto) => ({
          id: `${panel.key}_gasto_${generarId()}`,
          ...gasto,
          panel: panel.key,
          panelNombre: panel.nombre,
          tipo: 'gasto',
        })) || [];

      datos.bancos.push(...ingresos, ...gastos);

      // RF Actual y Cortes
      datos[`${panel.key}_rf`] = [
        {
          id: panel.key,
          panel: panel.key,
          panelNombre: panel.nombre,
          rfActual: p.rfActual || 0,
          ingresos: p.ingresos || 0,
          gastos: p.gastos || 0,
          cortes: p.rfCortes || [],
          updatedAt: new Date().toISOString(),
        },
      ];
    }
  }

  // Dashboard
  const dashboardData = leerArchivoJSON('panel-dashboard');
  if (dashboardData?.dashboard) {
    datos.dashboard = [
      {
        id: 'main',
        ...dashboardData.dashboard,
        updatedAt: new Date().toISOString(),
      },
    ];
  }

  return datos;
}

async function main() {
  console.log('\n╔════════════════════════════════════════════════════════════╗');
  console.log('║  🔄 SINCRONIZACIÓN COMPLETA: LOCAL → FIRESTORE            ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');

  try {
    // Transformar datos
    const datos = transformarDatos();

    // Mostrar resumen
    console.log('📋 DATOS A CARGAR:\n');
    let totalDocs = 0;
    for (const [nombre, docs] of Object.entries(datos)) {
      if (Array.isArray(docs)) {
        const count = docs.length;
        totalDocs += count;
        console.log(`   ${nombre.padEnd(25)} ${count} docs`);
      }
    }
    console.log(`\n   📊 TOTAL: ${totalDocs} documentos\n`);

    console.log('═'.repeat(60));
    console.log('\n⚠️  IMPORTANTE: Se limpiarán las colecciones existentes');
    console.log('   y se cargarán los datos locales.\n');
    console.log('Presiona Ctrl+C para cancelar en los próximos 5 segundos...\n');

    await new Promise((resolve) => setTimeout(resolve, 5000));

    console.log('🚀 Iniciando sincronización...\n');

    // Limpiar y cargar cada colección
    let totalCargados = 0;

    for (const [nombre, docs] of Object.entries(datos)) {
      if (Array.isArray(docs) && docs.length > 0) {
        await limpiarColeccion(nombre);
        const count = await cargarColeccion(nombre, docs);
        totalCargados += count;
      }
    }

    console.log('\n' + '═'.repeat(60));
    console.log('✅ SINCRONIZACIÓN COMPLETA');
    console.log('═'.repeat(60));
    console.log(`\n📊 Total documentos sincronizados: ${totalCargados}`);
    console.log('🔥 Proyecto: premium-ecosystem-1760790572');
    console.log('🌐 Verifica en: http://localhost:3001/\n');
  } catch (error) {
    console.error('\n❌ Error durante la sincronización:', error);
    process.exit(1);
  }

  process.exit(0);
}

main().catch(console.error);
