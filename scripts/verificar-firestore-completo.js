/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 🔥 VERIFICACIÓN COMPLETA DE FIRESTORE - ESTADO ACTUAL
 * ═══════════════════════════════════════════════════════════════════════════
 */
import dotenv from 'dotenv';
import { initializeApp } from 'firebase/app';
import {
  collection,
  getCountFromServer,
  getDocs,
  getFirestore,
  limit,
  query,
} from 'firebase/firestore';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuración Firebase
const firebaseConfig = {
  apiKey: 'AIzaSyCR7zKZJAzCEq-jBbfkLJxWaz98zuRCkX4',
  authDomain: 'premium-ecosystem-1760790572.firebaseapp.com',
  projectId: 'premium-ecosystem-1760790572',
  storageBucket: 'premium-ecosystem-1760790572.appspot.com',
  messagingSenderId: '1029840619477',
  appId: '1:1029840619477:web:a7e5ad6f3536e0c3b516f8',
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const COLECCIONES_ESPERADAS = [
  'bancos',
  'clientes',
  'distribuidores',
  'ordenesCompra',
  'ventas',
  'productos',
  'almacen',
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
  'operaciones_bancos',
];

async function verificarColeccion(nombreColeccion) {
  try {
    const colRef = collection(db, nombreColeccion);
    const countSnapshot = await getCountFromServer(colRef);
    const count = countSnapshot.data().count;

    const info = {
      nombre: nombreColeccion,
      documentos: count,
      estado: count > 0 ? 'CON_DATOS' : 'VACIA',
    };

    // Si tiene datos, obtener ejemplos
    if (count > 0 && count <= 5) {
      const q = query(colRef, limit(3));
      const snapshot = await getDocs(q);
      info.ejemplos = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          // Mostrar solo campos clave
          ...(data.nombre && { nombre: data.nombre }),
          ...(data.clienteNombre && { clienteNombre: data.clienteNombre }),
          ...(data.tipo && { tipo: data.tipo }),
          ...(data.monto && { monto: data.monto }),
          ...(data.capitalActual && { capitalActual: data.capitalActual }),
        };
      });
    }

    return info;
  } catch (error) {
    return {
      nombre: nombreColeccion,
      error: error.message,
      estado: 'ERROR',
    };
  }
}

async function verificarFirestoreCompleto() {
  console.log(`
╔═══════════════════════════════════════════════════════════════════════════╗
║          🔥 VERIFICACIÓN COMPLETA DE FIRESTORE - ESTADO ACTUAL            ║
╚═══════════════════════════════════════════════════════════════════════════╝
  `);

  const resultado = {
    fecha: new Date().toISOString(),
    colecciones: [],
    resumen: {
      totalColecciones: COLECCIONES_ESPERADAS.length,
      coleccionesConDatos: 0,
      coleccionesVacias: 0,
      coleccionesConError: 0,
      totalDocumentos: 0,
    },
    datosEsperados: {
      clientes: 31,
      distribuidores: '2-6',
      ordenesCompra: 9,
      ventas: 96,
      gastosAbonos: '~306',
      bancos: 8,
    },
  };

  console.log('📊 Verificando colecciones...\n');

  for (const nombreColeccion of COLECCIONES_ESPERADAS) {
    const info = await verificarColeccion(nombreColeccion);
    resultado.colecciones.push(info);
    resultado.resumen.totalDocumentos += info.documentos || 0;

    if (info.estado === 'CON_DATOS') {
      resultado.resumen.coleccionesConDatos++;
      console.log(`✅ ${nombreColeccion.padEnd(25)} ${info.documentos} documentos`);
      if (info.ejemplos && info.ejemplos.length > 0) {
        console.log(
          `   Ejemplo: ${JSON.stringify(info.ejemplos[0], null, 2).substring(0, 100)}...`
        );
      }
    } else if (info.estado === 'VACIA') {
      resultado.resumen.coleccionesVacias++;
      console.log(`❌ ${nombreColeccion.padEnd(25)} VACÍA`);
    } else {
      resultado.resumen.coleccionesConError++;
      console.log(`⚠️  ${nombreColeccion.padEnd(25)} ERROR: ${info.error}`);
    }
  }

  // Análisis específico de colecciones clave
  console.log('\n\n📋 ANÁLISIS DETALLADO DE COLECCIONES CLAVE:\n');

  const coleccionesClave = ['clientes', 'distribuidores', 'ordenesCompra', 'ventas', 'bancos'];
  for (const nombre of coleccionesClave) {
    const col = resultado.colecciones.find((c) => c.nombre === nombre);
    if (col) {
      const esperado = resultado.datosEsperados[nombre] || 'N/A';
      const actual = col.documentos || 0;
      const estado = actual > 0 ? '✅' : '❌';
      console.log(
        `${estado} ${nombre.padEnd(20)} Esperado: ${esperado.toString().padEnd(10)} | Actual: ${actual}`
      );
    }
  }

  console.log(`
╔═══════════════════════════════════════════════════════════════════════════╗
║                           📊 RESUMEN GENERAL                              ║
╠═══════════════════════════════════════════════════════════════════════════╣
║ Total colecciones verificadas: ${resultado.resumen.totalColecciones}                          ║
║ Colecciones con datos: ${resultado.resumen.coleccionesConDatos}                               ║
║ Colecciones vacías: ${resultado.resumen.coleccionesVacias}                                  ║
║ Colecciones con error: ${resultado.resumen.coleccionesConError}                                ║
║ Total documentos en Firestore: ${resultado.resumen.totalDocumentos}                          ║
╚═══════════════════════════════════════════════════════════════════════════╝
  `);

  // Identificar qué falta
  const faltantes = [];

  if ((resultado.colecciones.find((c) => c.nombre === 'ventas')?.documentos || 0) < 96) {
    faltantes.push('⚠️  Ventas: Faltan registros (esperado: 96)');
  }

  if ((resultado.colecciones.find((c) => c.nombre === 'clientes')?.documentos || 0) < 31) {
    faltantes.push('⚠️  Clientes: Faltan registros (esperado: 31)');
  }

  if ((resultado.colecciones.find((c) => c.nombre === 'bancos')?.documentos || 0) < 8) {
    faltantes.push('⚠️  Bancos: Faltan registros RF Actual (esperado: 8)');
  }

  if (faltantes.length > 0) {
    console.log('\n🚨 DATOS FALTANTES IDENTIFICADOS:\n');
    faltantes.forEach((f) => console.log(f));
    console.log('\n💡 ACCIÓN RECOMENDADA: Ejecutar script de migración completa');
    console.log('   Comando: node scripts/migrar-datos-completo.js\n');
  } else {
    console.log('\n✅ TODOS LOS DATOS PARECEN ESTAR MIGRADOS CORRECTAMENTE\n');
  }

  // Guardar resultado
  const outputPath = path.join(__dirname, '../FIRESTORE_ESTADO_ACTUAL.json');
  fs.writeFileSync(outputPath, JSON.stringify(resultado, null, 2));
  console.log(`✅ Reporte guardado en: FIRESTORE_ESTADO_ACTUAL.json\n`);

  return resultado;
}

// Ejecutar verificación
verificarFirestoreCompleto()
  .then(() => {
    console.log('✅ Verificación completada exitosamente\n');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Error en verificación:', error);
    process.exit(1);
  });
