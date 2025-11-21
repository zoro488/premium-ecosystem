/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 🔥 VERIFICACIÓN DE DATOS EN FIRESTORE
 * ═══════════════════════════════════════════════════════════════════════════
 */
import { initializeApp } from 'firebase/app';
import { collection, getCountFromServer, getDocs, getFirestore } from 'firebase/firestore';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuración Firebase
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY || 'AIzaSyA_your_api_key',
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN || 'chronos-176d8.firebaseapp.com',
  projectId: process.env.VITE_FIREBASE_PROJECT_ID || 'chronos-176d8',
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const COLECCIONES = [
  'clientes',
  'distribuidores',
  'ordenesCompra',
  'ventas',
  'productos',
  'almacen',
  'bancos',
  'movimientosBancarios',
  'gastos',
  'transferencias',
  'adeudosClientes',
  'adeudosDistribuidores',
  'ingresos',
  'gastosBancarios',
  'cortes',
  'bovedaMonte',
  'bovedaUsa',
  'azteca',
  'leftie',
  'profit',
  'utilidades',
  'fletes',
];

async function verificarFirestore() {
  console.log(`
╔═══════════════════════════════════════════════════════════════════════════╗
║              🔥 VERIFICACIÓN DE DATOS EN FIRESTORE                        ║
╚═══════════════════════════════════════════════════════════════════════════╝
  `);

  const resultado = {
    fecha: new Date().toISOString(),
    colecciones: [],
    resumen: {
      totalColecciones: 0,
      coleccionesConDatos: 0,
      coleccionesVacias: 0,
      totalDocumentos: 0,
    },
  };

  for (const nombreColeccion of COLECCIONES) {
    try {
      const colRef = collection(db, nombreColeccion);
      const countSnapshot = await getCountFromServer(colRef);
      const count = countSnapshot.data().count;

      const info = {
        nombre: nombreColeccion,
        documentos: count,
        estado: count > 0 ? '✅ CON DATOS' : '❌ VACÍA',
      };

      // Si tiene datos, obtener algunos ejemplos
      if (count > 0 && count <= 10) {
        const snapshot = await getDocs(colRef);
        info.ejemplos = snapshot.docs.slice(0, 3).map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
      }

      resultado.colecciones.push(info);
      resultado.resumen.totalDocumentos += count;

      if (count > 0) {
        resultado.resumen.coleccionesConDatos++;
        console.log(`✅ ${nombreColeccion.padEnd(25)} ${count} documentos`);
      } else {
        resultado.resumen.coleccionesVacias++;
        console.log(`❌ ${nombreColeccion.padEnd(25)} VACÍA`);
      }
    } catch (error) {
      console.error(`⚠️  ${nombreColeccion.padEnd(25)} ERROR: ${error.message}`);
      resultado.colecciones.push({
        nombre: nombreColeccion,
        error: error.message,
        estado: '⚠️ ERROR',
      });
    }
  }

  resultado.resumen.totalColecciones = COLECCIONES.length;

  console.log(`
╔═══════════════════════════════════════════════════════════════════════════╗
║                           📊 RESUMEN                                      ║
╠═══════════════════════════════════════════════════════════════════════════╣
║ Total colecciones verificadas: ${resultado.resumen.totalColecciones}                          ║
║ Colecciones con datos: ${resultado.resumen.coleccionesConDatos}                               ║
║ Colecciones vacías: ${resultado.resumen.coleccionesVacias}                                  ║
║ Total documentos: ${resultado.resumen.totalDocumentos}                                     ║
╚═══════════════════════════════════════════════════════════════════════════╝
  `);

  // Guardar resultado
  const outputPath = path.join(__dirname, '../FIRESTORE_ESTADO_ACTUAL.json');
  fs.writeFileSync(outputPath, JSON.stringify(resultado, null, 2));
  console.log(`\n✅ Estado de Firestore guardado en: FIRESTORE_ESTADO_ACTUAL.json\n`);

  return resultado;
}

async function compararConDatosJSON() {
  console.log(`
╔═══════════════════════════════════════════════════════════════════════════╗
║             📊 COMPARACIÓN JSON vs FIRESTORE                              ║
╚═══════════════════════════════════════════════════════════════════════════╝
  `);

  // Leer análisis de datos válidos
  const analisisPath = path.join(__dirname, '../ANALISIS_DATOS_VALIDOS.json');

  if (!fs.existsSync(analisisPath)) {
    console.log('⚠️  Primero ejecuta: node scripts/analizar-datos-validos.js');
    return;
  }

  const datosValidos = JSON.parse(fs.readFileSync(analisisPath, 'utf8'));
  const estadoFirestore = await verificarFirestore();

  const comparacion = {
    fecha: new Date().toISOString(),
    diferencias: [],
    recomendaciones: [],
  };

  // Comparar clientes
  const clientesFirestore = estadoFirestore.colecciones.find((c) => c.nombre === 'clientes');
  const clientesJSON = datosValidos.datosValidos.clientes.total;

  console.log('\n🔍 CLIENTES:');
  console.log(`  En JSON (válidos): ${clientesJSON}`);
  console.log(`  En Firestore: ${clientesFirestore?.documentos || 0}`);

  if (clientesJSON > (clientesFirestore?.documentos || 0)) {
    comparacion.diferencias.push({
      coleccion: 'clientes',
      esperados: clientesJSON,
      actuales: clientesFirestore?.documentos || 0,
      faltantes: clientesJSON - (clientesFirestore?.documentos || 0),
      accion: 'MIGRAR CLIENTES',
    });
    console.log(
      `  ⚠️  FALTAN ${clientesJSON - (clientesFirestore?.documentos || 0)} clientes por migrar`
    );
  } else {
    console.log(`  ✅ Clientes migrados correctamente`);
  }

  // Comparar distribuidores
  const distribuidoresFirestore = estadoFirestore.colecciones.find(
    (c) => c.nombre === 'distribuidores'
  );
  const distribuidoresJSON = datosValidos.datosValidos.distribuidores.total;

  console.log('\n🔍 DISTRIBUIDORES:');
  console.log(`  En JSON (válidos): ${distribuidoresJSON}`);
  console.log(`  En Firestore: ${distribuidoresFirestore?.documentos || 0}`);

  if (distribuidoresJSON > (distribuidoresFirestore?.documentos || 0)) {
    comparacion.diferencias.push({
      coleccion: 'distribuidores',
      esperados: distribuidoresJSON,
      actuales: distribuidoresFirestore?.documentos || 0,
      faltantes: distribuidoresJSON - (distribuidoresFirestore?.documentos || 0),
      accion: 'MIGRAR DISTRIBUIDORES',
    });
    console.log(
      `  ⚠️  FALTAN ${distribuidoresJSON - (distribuidoresFirestore?.documentos || 0)} distribuidores por migrar`
    );
  } else {
    console.log(`  ✅ Distribuidores migrados correctamente`);
  }

  // Comparar ventas
  const ventasFirestore = estadoFirestore.colecciones.find((c) => c.nombre === 'ventas');
  const ventasJSON = datosValidos.datosValidos.ventas.total;

  console.log('\n🔍 VENTAS:');
  console.log(`  En JSON (válidos): ${ventasJSON}`);
  console.log(`  En Firestore: ${ventasFirestore?.documentos || 0}`);

  if (ventasJSON > (ventasFirestore?.documentos || 0)) {
    comparacion.diferencias.push({
      coleccion: 'ventas',
      esperados: ventasJSON,
      actuales: ventasFirestore?.documentos || 0,
      faltantes: ventasJSON - (ventasFirestore?.documentos || 0),
      accion: 'MIGRAR VENTAS',
    });
    console.log(
      `  ⚠️  FALTAN ${ventasJSON - (ventasFirestore?.documentos || 0)} ventas por migrar`
    );
  } else {
    console.log(`  ✅ Ventas migradas correctamente`);
  }

  // Comparar órdenes de compra
  const ordenesFirestore = estadoFirestore.colecciones.find((c) => c.nombre === 'ordenesCompra');
  const ordenesJSON = datosValidos.datosValidos.ordenesCompra.total;

  console.log('\n🔍 ÓRDENES DE COMPRA:');
  console.log(`  En JSON: ${ordenesJSON} únicas`);
  console.log(`  En Firestore: ${ordenesFirestore?.documentos || 0}`);

  if (ordenesJSON > (ordenesFirestore?.documentos || 0)) {
    comparacion.diferencias.push({
      coleccion: 'ordenesCompra',
      esperados: ordenesJSON,
      actuales: ordenesFirestore?.documentos || 0,
      faltantes: ordenesJSON - (ordenesFirestore?.documentos || 0),
      accion: 'MIGRAR ÓRDENES DE COMPRA',
    });
    console.log(
      `  ⚠️  FALTAN ${ordenesJSON - (ordenesFirestore?.documentos || 0)} órdenes por migrar`
    );
  } else {
    console.log(`  ✅ Órdenes de compra migradas correctamente`);
  }

  // Resumen final
  console.log(`
╔═══════════════════════════════════════════════════════════════════════════╗
║                      🎯 QUÉ FALTA POR MIGRAR                              ║
╠═══════════════════════════════════════════════════════════════════════════╣`);

  if (comparacion.diferencias.length === 0) {
    console.log(`║ ✅ TODO MIGRADO CORRECTAMENTE                                         ║`);
  } else {
    comparacion.diferencias.forEach((d) => {
      console.log(
        `║ ⚠️  ${d.coleccion.padEnd(20)} Faltan: ${String(d.faltantes).padStart(3)}                       ║`
      );
    });
  }

  console.log(`╚═══════════════════════════════════════════════════════════════════════════╝
  `);

  // Guardar comparación
  const compPath = path.join(__dirname, '../COMPARACION_JSON_FIRESTORE.json');
  fs.writeFileSync(compPath, JSON.stringify(comparacion, null, 2));
  console.log(`✅ Comparación guardada en: COMPARACION_JSON_FIRESTORE.json\n`);

  return comparacion;
}

// Ejecutar
compararConDatosJSON()
  .then(() => {
    console.log('\n✅ Análisis completo terminado\n');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Error:', error);
    process.exit(1);
  });
