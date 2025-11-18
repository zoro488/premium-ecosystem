/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 🔍 ANÁLISIS QUIRÚRGICO COMPLETO - CHRONOS/FLOWDISTRIBUTOR
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Este script realiza un análisis profundo y detallado del sistema:
 * 1. Verifica datos JSON en carpeta gg/
 * 2. Compara con colecciones Firestore
 * 3. Valida conexión UI → Firestore
 * 4. Genera reporte completo con estado del sistema
 *
 * @author CHRONOS System
 * @version 1.0.0
 */
import { initializeApp } from 'firebase/app';
import { collection, getCountFromServer, getFirestore } from 'firebase/firestore';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ═══════════════════════════════════════════════════════════════════════════
// CONFIGURACIÓN
// ═══════════════════════════════════════════════════════════════════════════

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY || 'AIzaSyA_your_api_key',
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN || 'chronos-176d8.firebaseapp.com',
  projectId: process.env.VITE_FIREBASE_PROJECT_ID || 'chronos-176d8',
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET || 'chronos-176d8.appspot.com',
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '123456789',
  appId: process.env.VITE_FIREBASE_APP_ID || '1:123456789:web:abc123',
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Colecciones esperadas en Firestore
const COLECCIONES_ESPERADAS = [
  'bancos',
  'clientes',
  'distribuidores',
  'productos',
  'ventas',
  'ordenesCompra',
  'almacen',
  'movimientosBancarios',
  'gastos',
  'transferencias',
  'adeudosClientes',
  'adeudosDistribuidores',
  'ingresos',
  'gastosBancarios',
  'cortes',
];

// ═══════════════════════════════════════════════════════════════════════════
// ANÁLISIS DE DATOS JSON
// ═══════════════════════════════════════════════════════════════════════════

async function analizarDatosJSON() {
  console.log('\n📊 ANALIZANDO DATOS JSON EN CARPETA gg/...\n');

  const ggPath = path.join(__dirname, '../src/apps/FlowDistributor/chronos-system/gg');

  if (!fs.existsSync(ggPath)) {
    console.error('❌ Carpeta gg/ no encontrada');
    return { error: 'Carpeta no encontrada' };
  }

  const archivos = fs.readdirSync(ggPath).filter((f) => f.endsWith('.json'));

  const analisis = {
    totalArchivos: archivos.length,
    archivos: [],
    totalRegistros: 0,
    estructuras: {},
  };

  for (const archivo of archivos) {
    try {
      const rutaArchivo = path.join(ggPath, archivo);
      const contenido = JSON.parse(fs.readFileSync(rutaArchivo, 'utf8'));

      const info = {
        nombre: archivo,
        tamaño: `${(fs.statSync(rutaArchivo).size / 1024).toFixed(2)} KB`,
        estructura: {},
        registros: 0,
      };

      // Analizar estructura
      if (Array.isArray(contenido)) {
        info.registros = contenido.length;
        info.estructura = { tipo: 'array', elementos: contenido.length };
      } else if (typeof contenido === 'object') {
        Object.keys(contenido).forEach((key) => {
          if (Array.isArray(contenido[key])) {
            info.estructura[key] = contenido[key].length;
            info.registros += contenido[key].length;
          } else if (typeof contenido[key] === 'object') {
            info.estructura[key] = Object.keys(contenido[key]).length;
          } else {
            info.estructura[key] = typeof contenido[key];
          }
        });
      }

      analisis.totalRegistros += info.registros;
      analisis.archivos.push(info);

      console.log(`✅ ${archivo}: ${info.registros} registros`);
    } catch (error) {
      console.error(`❌ Error al leer ${archivo}:`, error.message);
      analisis.archivos.push({
        nombre: archivo,
        error: error.message,
      });
    }
  }

  return analisis;
}

// ═══════════════════════════════════════════════════════════════════════════
// ANÁLISIS DE FIRESTORE
// ═══════════════════════════════════════════════════════════════════════════

async function analizarFirestore() {
  console.log('\n🔥 ANALIZANDO COLECCIONES FIRESTORE...\n');

  const analisis = {
    colecciones: [],
    totalColecciones: 0,
    totalDocumentos: 0,
    coleccionesVacias: [],
    coleccionesFaltantes: [],
  };

  for (const nombreColeccion of COLECCIONES_ESPERADAS) {
    try {
      const colRef = collection(db, nombreColeccion);
      const snapshot = await getCountFromServer(colRef);
      const count = snapshot.data().count;

      const info = {
        nombre: nombreColeccion,
        documentos: count,
        estado: count > 0 ? '✅ Con datos' : '⚠️ Vacía',
      };

      if (count === 0) {
        analisis.coleccionesVacias.push(nombreColeccion);
      }

      analisis.colecciones.push(info);
      analisis.totalDocumentos += count;

      console.log(`${info.estado} ${nombreColeccion}: ${count} documentos`);
    } catch (error) {
      console.error(`❌ Error con colección ${nombreColeccion}:`, error.message);
      analisis.coleccionesFaltantes.push(nombreColeccion);
      analisis.colecciones.push({
        nombre: nombreColeccion,
        error: error.message,
        estado: '❌ Error',
      });
    }
  }

  analisis.totalColecciones = analisis.colecciones.length;

  return analisis;
}

// ═══════════════════════════════════════════════════════════════════════════
// COMPARACIÓN JSON vs FIRESTORE
// ═══════════════════════════════════════════════════════════════════════════

async function compararDatos(datosJSON, datosFirestore) {
  console.log('\n🔄 COMPARANDO JSON vs FIRESTORE...\n');

  const comparacion = {
    migracionCompleta: true,
    diferencias: [],
    recomendaciones: [],
  };

  // Mapeo de nombres JSON a colecciones Firestore
  const mapeo = {
    clientes: 'clientes',
    distribuidores: 'distribuidores',
    productos: 'productos',
    ventas: 'ventas',
    compras: 'ordenesCompra',
    bancos: 'bancos',
  };

  // Verificar cada colección
  for (const [jsonKey, firestoreCol] of Object.entries(mapeo)) {
    const jsonArchivo = datosJSON.archivos.find(
      (a) => a.nombre.toLowerCase().includes(jsonKey) || a.estructura[jsonKey]
    );

    const firestoreInfo = datosFirestore.colecciones.find((c) => c.nombre === firestoreCol);

    if (jsonArchivo && firestoreInfo) {
      const jsonCount = jsonArchivo.estructura[jsonKey] || jsonArchivo.registros;
      const firestoreCount = firestoreInfo.documentos;

      if (jsonCount > 0 && firestoreCount === 0) {
        comparacion.migracionCompleta = false;
        comparacion.diferencias.push({
          coleccion: firestoreCol,
          jsonRegistros: jsonCount,
          firestoreRegistros: firestoreCount,
          estado: '❌ NO MIGRADO',
          accion: 'Ejecutar script de migración',
        });
        console.log(
          `❌ ${firestoreCol}: JSON=${jsonCount} | Firestore=${firestoreCount} - FALTA MIGRAR`
        );
      } else if (jsonCount !== firestoreCount && jsonCount > 0) {
        comparacion.diferencias.push({
          coleccion: firestoreCol,
          jsonRegistros: jsonCount,
          firestoreRegistros: firestoreCount,
          estado: '⚠️ DIFERENCIA',
          accion: 'Verificar integridad de datos',
        });
        console.log(
          `⚠️ ${firestoreCol}: JSON=${jsonCount} | Firestore=${firestoreCount} - VERIFICAR`
        );
      } else if (firestoreCount > 0) {
        console.log(`✅ ${firestoreCol}: Migración correcta (${firestoreCount} docs)`);
      }
    }
  }

  // Recomendaciones
  if (datosFirestore.coleccionesVacias.length > 0) {
    comparacion.recomendaciones.push({
      tipo: 'MIGRACIÓN',
      mensaje: `Hay ${datosFirestore.coleccionesVacias.length} colecciones vacías que necesitan datos`,
      colecciones: datosFirestore.coleccionesVacias,
    });
  }

  if (comparacion.diferencias.length === 0) {
    comparacion.recomendaciones.push({
      tipo: 'ÉXITO',
      mensaje: '✅ Todos los datos están correctamente migrados',
    });
  }

  return comparacion;
}

// ═══════════════════════════════════════════════════════════════════════════
// ANÁLISIS DE COMPONENTES UI
// ═══════════════════════════════════════════════════════════════════════════

async function analizarComponentesUI() {
  console.log('\n🎨 ANALIZANDO COMPONENTES UI...\n');

  const componentesPath = path.join(
    __dirname,
    '../src/apps/FlowDistributor/chronos-system/components'
  );

  const analisis = {
    paneles: [],
    formularios: [],
    serviciosUsados: new Set(),
    componentes: {},
  };

  // Función recursiva para buscar archivos
  function buscarArchivos(dir, tipo) {
    const archivos = [];

    if (!fs.existsSync(dir)) return archivos;

    const items = fs.readdirSync(dir);

    for (const item of items) {
      const rutaCompleta = path.join(dir, item);
      const stats = fs.statSync(rutaCompleta);

      if (stats.isDirectory()) {
        archivos.push(...buscarArchivos(rutaCompleta, tipo));
      } else if (stats.isFile() && (item.endsWith('.jsx') || item.endsWith('.tsx'))) {
        if (tipo === 'panel' && item.toLowerCase().includes('panel')) {
          archivos.push(rutaCompleta);
        } else if (tipo === 'form' && item.toLowerCase().includes('form')) {
          archivos.push(rutaCompleta);
        }
      }
    }

    return archivos;
  }

  // Buscar paneles
  const paneles = buscarArchivos(path.join(componentesPath, 'panels'), 'panel');
  analisis.paneles = paneles.map((p) => ({
    nombre: path.basename(p),
    ruta: p.replace(__dirname + '/../', ''),
    conectadoFirestore: false,
  }));

  // Buscar formularios
  const formularios = buscarArchivos(path.join(componentesPath, 'forms'), 'form');
  analisis.formularios = formularios.map((f) => ({
    nombre: path.basename(f),
    ruta: f.replace(__dirname + '/../', ''),
    conectadoFirestore: false,
  }));

  // Analizar imports de servicios
  [...paneles, ...formularios].forEach((archivo) => {
    try {
      const contenido = fs.readFileSync(archivo, 'utf8');

      // Buscar imports de servicios
      const importMatches = contenido.matchAll(/import\s+{[^}]+}\s+from\s+['"](.+\.service)['"];/g);
      for (const match of importMatches) {
        analisis.serviciosUsados.add(match[1]);
      }

      // Verificar uso de Firebase
      if (
        contenido.includes('getDocs') ||
        contenido.includes('addDoc') ||
        contenido.includes('updateDoc')
      ) {
        const nombreArchivo = path.basename(archivo);
        const componente =
          analisis.paneles.find((p) => p.nombre === nombreArchivo) ||
          analisis.formularios.find((f) => f.nombre === nombreArchivo);
        if (componente) {
          componente.conectadoFirestore = true;
        }
      }
    } catch (error) {
      console.error(`Error al analizar ${archivo}:`, error.message);
    }
  });

  analisis.serviciosUsados = Array.from(analisis.serviciosUsados);

  console.log(`📊 Paneles encontrados: ${analisis.paneles.length}`);
  console.log(`📝 Formularios encontrados: ${analisis.formularios.length}`);
  console.log(`🔌 Servicios usados: ${analisis.serviciosUsados.length}`);

  return analisis;
}

// ═══════════════════════════════════════════════════════════════════════════
// GENERAR REPORTE FINAL
// ═══════════════════════════════════════════════════════════════════════════

async function generarReporte(datosJSON, datosFirestore, comparacion, ui) {
  const fecha = new Date().toISOString().split('T')[0];
  const reporte = {
    fecha,
    resumenEjecutivo: {
      estado: comparacion.migracionCompleta ? '✅ COMPLETO' : '⚠️ INCOMPLETO',
      archivosJSON: datosJSON.totalArchivos,
      registrosJSON: datosJSON.totalRegistros,
      coleccionesFirestore: datosFirestore.totalColecciones,
      documentosFirestore: datosFirestore.totalDocumentos,
      componentesUI: ui.paneles.length + ui.formularios.length,
      serviciosActivos: ui.serviciosUsados.length,
    },
    datosJSON,
    datosFirestore,
    comparacion,
    componentesUI: ui,
    recomendaciones: [],
  };

  // Generar recomendaciones
  if (!comparacion.migracionCompleta) {
    reporte.recomendaciones.push({
      prioridad: 'ALTA',
      titulo: '🚨 Migración Incompleta',
      descripcion: 'Hay datos en JSON que no están en Firestore',
      accion: 'Ejecutar: npm run migrate o node scripts/migrar-datos-completo.js',
    });
  }

  if (datosFirestore.coleccionesVacias.length > 0) {
    reporte.recomendaciones.push({
      prioridad: 'MEDIA',
      titulo: '⚠️ Colecciones Vacías',
      descripcion: `${datosFirestore.coleccionesVacias.length} colecciones sin datos`,
      colecciones: datosFirestore.coleccionesVacias,
      accion: 'Verificar si estas colecciones deben tener datos iniciales',
    });
  }

  const componentesDesconectados = [
    ...ui.paneles.filter((p) => !p.conectadoFirestore),
    ...ui.formularios.filter((f) => !f.conectadoFirestore),
  ];

  if (componentesDesconectados.length > 0) {
    reporte.recomendaciones.push({
      prioridad: 'MEDIA',
      titulo: '🔌 Componentes Sin Firestore',
      descripcion: `${componentesDesconectados.length} componentes no conectados a Firestore`,
      componentes: componentesDesconectados.map((c) => c.nombre),
      accion: 'Revisar y conectar componentes con servicios de Firebase',
    });
  }

  if (reporte.recomendaciones.length === 0) {
    reporte.recomendaciones.push({
      prioridad: 'ÉXITO',
      titulo: '✅ Sistema Completo',
      descripcion: 'Todos los datos migrados y componentes conectados',
      accion: 'Continuar con testing y optimización',
    });
  }

  return reporte;
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN - EJECUTAR ANÁLISIS
// ═══════════════════════════════════════════════════════════════════════════

async function ejecutarAnalisisCompleto() {
  console.log(`
╔═══════════════════════════════════════════════════════════════════════════╗
║                                                                             ║
║           🔍 ANÁLISIS QUIRÚRGICO COMPLETO - CHRONOS SYSTEM                 ║
║                                                                             ║
╚═══════════════════════════════════════════════════════════════════════════╝
  `);

  try {
    // 1. Analizar datos JSON
    const datosJSON = await analizarDatosJSON();

    // 2. Analizar Firestore
    const datosFirestore = await analizarFirestore();

    // 3. Comparar datos
    const comparacion = await compararDatos(datosJSON, datosFirestore);

    // 4. Analizar componentes UI
    const ui = await analizarComponentesUI();

    // 5. Generar reporte final
    const reporte = await generarReporte(datosJSON, datosFirestore, comparacion, ui);

    // 6. Guardar reporte
    const reportePath = path.join(__dirname, `../REPORTE_ANALISIS_SISTEMA_${reporte.fecha}.json`);
    fs.writeFileSync(reportePath, JSON.stringify(reporte, null, 2));

    // 7. Mostrar resumen
    console.log(`
╔═══════════════════════════════════════════════════════════════════════════╗
║                        📊 RESUMEN EJECUTIVO                                ║
╠═══════════════════════════════════════════════════════════════════════════╣
║ Estado: ${reporte.resumenEjecutivo.estado.padEnd(60)} ║
║ Archivos JSON: ${String(reporte.resumenEjecutivo.archivosJSON).padEnd(54)} ║
║ Registros JSON: ${String(reporte.resumenEjecutivo.registrosJSON).padEnd(53)} ║
║ Colecciones Firestore: ${String(reporte.resumenEjecutivo.coleccionesFirestore).padEnd(47)} ║
║ Documentos Firestore: ${String(reporte.resumenEjecutivo.documentosFirestore).padEnd(48)} ║
║ Componentes UI: ${String(reporte.resumenEjecutivo.componentesUI).padEnd(52)} ║
║ Servicios Activos: ${String(reporte.resumenEjecutivo.serviciosActivos).padEnd(49)} ║
╚═══════════════════════════════════════════════════════════════════════════╝
    `);

    console.log('\n📋 RECOMENDACIONES:\n');
    reporte.recomendaciones.forEach((rec, i) => {
      console.log(`${i + 1}. [${rec.prioridad}] ${rec.titulo}`);
      console.log(`   ${rec.descripcion}`);
      if (rec.accion) {
        console.log(`   ➡️ ${rec.accion}`);
      }
      console.log('');
    });

    console.log(`\n✅ Reporte completo guardado en: ${reportePath}\n`);

    return reporte;
  } catch (error) {
    console.error('\n❌ ERROR EN ANÁLISIS:', error);
    throw error;
  }
}

// Ejecutar si se llama directamente
if (import.meta.url === `file://${process.argv[1]}`) {
  ejecutarAnalisisCompleto()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

export { analizarDatosJSON, analizarFirestore, compararDatos, ejecutarAnalisisCompleto };
