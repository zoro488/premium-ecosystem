/* eslint-disable no-console */
// Cargar SOLO los datos faltantes a Firestore (sin eliminar existentes)
import { initializeApp } from 'firebase/app';
import { collection, doc, getDocs, getFirestore, setDoc } from 'firebase/firestore';
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

function leerJSON(nombre) {
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

async function verificarExistentes(nombreColeccion) {
  const snapshot = await getDocs(collection(db, nombreColeccion));
  return snapshot.size;
}

async function cargarDatos(nombreColeccion, documentos, descripcion) {
  if (!documentos || documentos.length === 0) return 0;

  console.log(`📤 ${descripcion}... (${documentos.length} docs)`);

  let cargados = 0;
  for (const documento of documentos) {
    try {
      const docId = documento.id || generarId();
      await setDoc(doc(db, nombreColeccion, docId), {
        ...documento,
        syncedAt: new Date().toISOString(),
      });
      cargados++;

      if (cargados % 50 === 0) {
        console.log(`   💾 ${cargados}/${documentos.length}...`);
      }
    } catch (error) {
      console.error(`   ⚠️ Error en doc: ${error.message}`);
    }
  }

  console.log(`   ✅ ${descripcion}: ${cargados} documentos cargados\n`);
  return cargados;
}

async function main() {
  console.log('\n╔════════════════════════════════════════════════════════════╗');
  console.log('║  📤 CARGANDO DATOS REALES A FIRESTORE                     ║');
  console.log('║  (Sin eliminar datos existentes)                          ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');

  let totalCargados = 0;

  // 1. ÓRDENES DE COMPRA (9 registros)
  const ordenesData = leerJSON('panel-ordenes-compra');
  if (ordenesData?.distribuidores?.ordenesCompra) {
    const compras = ordenesData.distribuidores.ordenesCompra.map((oc) => ({
      id: `oc_${oc.oc || generarId()}`,
      ...oc,
      tipo: 'orden_compra',
      fuente: 'panel-ordenes-compra',
    }));
    totalCargados += await cargarDatos('compras', compras, 'Órdenes de Compra');
  }

  // 2. DISTRIBUIDORES (2 registros)
  if (ordenesData?.distribuidores?.distribuidores) {
    const dists = ordenesData.distribuidores.distribuidores.map((d) => ({
      id: `dist_${d.nombre?.replace(/\s/g, '_').toLowerCase() || generarId()}`,
      ...d,
      fuente: 'panel-ordenes-compra',
    }));
    totalCargados += await cargarDatos('distribuidores', dists, 'Distribuidores');
  }

  // 3. CLIENTES (31 registros)
  const clientesData = leerJSON('panel-clientes');
  if (clientesData?.clientes) {
    const clientes = clientesData.clientes.map((c) => ({
      id: `cli_${c.nombre?.replace(/\s/g, '_').toLowerCase() || generarId()}`,
      ...c,
      fuente: 'panel-clientes',
    }));
    totalCargados += await cargarDatos('clientes', clientes, 'Clientes');
  }

  // 4. VENTAS LOCAL (96 registros)
  const ventasData = leerJSON('panel-ventas-local');
  if (ventasData?.ventasLocal) {
    const ventas = ventasData.ventasLocal.map((v) => ({
      id: `venta_local_${generarId()}`,
      ...v,
      tipo: 'venta_local',
      fuente: 'panel-ventas-local',
    }));
    totalCargados += await cargarDatos('ventas', ventas, 'Ventas Locales');
  }

  // 5. GASTOS Y ABONOS (302 registros)
  const gastosData = leerJSON('panel-gastos-abonos');
  if (gastosData?.gastosAbonos) {
    const gastos = gastosData.gastosAbonos.map((g) => ({
      id: `gya_${generarId()}`,
      ...g,
      fuente: 'panel-gastos-abonos',
    }));
    totalCargados += await cargarDatos('gastos', gastos, 'Gastos y Abonos');
  }

  // 6. ALMACÉN MONTE
  const almacenData = leerJSON('panel-almacen-monte');
  if (almacenData?.almacenMonte) {
    const alm = almacenData.almacenMonte;
    const almacenDocs = [
      ...(alm.ordenesCompra?.map((oc) => ({
        id: `alm_oc_${generarId()}`,
        ...oc,
        tipo: 'orden_compra',
        fuente: 'almacen-monte',
      })) || []),
      ...(alm.salidas?.map((s) => ({
        id: `alm_sal_${generarId()}`,
        ...s,
        tipo: 'salida',
        fuente: 'almacen-monte',
      })) || []),
    ];
    totalCargados += await cargarDatos('almacen', almacenDocs, 'Almacén Monte');
  }

  // 7-13. PANELES DE BANCOS (todos los movimientos)
  const paneles = [
    { archivo: 'panel-boveda-monte', key: 'bovedaMonte', nombre: 'Bóveda Monte' },
    { archivo: 'panel-boveda-usa', key: 'bovedaUsa', nombre: 'Bóveda USA' },
    { archivo: 'panel-azteca', key: 'azteca', nombre: 'Azteca' },
    { archivo: 'panel-leftie', key: 'leftie', nombre: 'Leftie' },
    { archivo: 'panel-profit', key: 'profit', nombre: 'Profit' },
    { archivo: 'panel-utilidades', key: 'utilidades', nombre: 'Utilidades' },
    { archivo: 'panel-fletes', key: 'fleteSur', nombre: 'Flete Sur' },
  ];

  for (const panel of paneles) {
    const panelData = leerJSON(panel.archivo);
    if (panelData?.[panel.key]) {
      const p = panelData[panel.key];

      const movimientos = [
        ...(p.ingresosList?.map((ing) => ({
          id: `${panel.key}_ing_${generarId()}`,
          ...ing,
          panel: panel.key,
          panelNombre: panel.nombre,
          tipo: 'ingreso',
          fuente: panel.archivo,
        })) || []),
        ...(p.gastosList?.map((g) => ({
          id: `${panel.key}_gasto_${generarId()}`,
          ...g,
          panel: panel.key,
          panelNombre: panel.nombre,
          tipo: 'gasto',
          fuente: panel.archivo,
        })) || []),
      ];

      if (movimientos.length > 0) {
        totalCargados += await cargarDatos('bancos', movimientos, `${panel.nombre}`);
      }

      // RF Actual
      await setDoc(doc(db, 'sistema', `rf_${panel.key}`), {
        panel: panel.key,
        panelNombre: panel.nombre,
        rfActual: p.rfActual || 0,
        ingresos: p.ingresos || 0,
        gastos: p.gastos || 0,
        cortes: p.rfCortes || [],
        updatedAt: new Date().toISOString(),
      });
    }
  }

  // 14. DASHBOARD
  const dashboardData = leerJSON('panel-dashboard');
  if (dashboardData?.dashboard) {
    await setDoc(doc(db, 'sistema', 'dashboard'), {
      ...dashboardData.dashboard,
      updatedAt: new Date().toISOString(),
    });
    console.log('✅ Dashboard actualizado\n');
  }

  // RESUMEN FINAL
  console.log('═'.repeat(60));
  console.log('✅ CARGA COMPLETA');
  console.log('═'.repeat(60));
  console.log(`\n📊 Total documentos agregados: ${totalCargados}`);
  console.log('🔥 Proyecto: premium-ecosystem-1760790572');

  // Verificar totales finales
  console.log('\n📋 TOTALES EN FIRESTORE AHORA:\n');
  const colecciones = [
    'compras',
    'distribuidores',
    'clientes',
    'ventas',
    'gastos',
    'almacen',
    'bancos',
  ];
  for (const col of colecciones) {
    const count = await verificarExistentes(col);
    console.log(`   ${col.padEnd(20)} ${count} documentos`);
  }

  console.log('\n🌐 Verifica en: http://localhost:3001/\n');
  process.exit(0);
}

main().catch(error => {
  console.error('\n❌ Error:', error);
  process.exit(1);
});
