/* eslint-disable no-console */
// Script para cargar datos a Firestore desde datos_para_firebase_COMPLETOS.json
// Ejecutar con: node cargar-a-firestore.js

const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// Inicializar Firebase Admin
const serviceAccount = require('./firebase-service-account.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: 'premium-ecosystem-1760790572',
});

const db = admin.firestore();

// Función para cargar una colección completa
async function cargarColeccion(nombreColeccion, documentos) {
  console.log(`\n📤 Cargando ${nombreColeccion}...`);

  const batch = db.batch();
  let contador = 0;

  for (const doc of documentos) {
    const docRef = db
      .collection(nombreColeccion)
      .doc(doc.id || admin.firestore().collection('_').doc().id);
    batch.set(docRef, doc);
    contador++;

    // Firestore limita a 500 operaciones por batch
    if (contador % 500 === 0) {
      await batch.commit();
      console.log(`   ✅ ${contador} documentos cargados...`);
    }
  }

  // Commit final
  await batch.commit();
  console.log(`   ✅ Total ${nombreColeccion}: ${documentos.length} documentos`);

  return documentos.length;
}

async function main() {
  console.log('\n╔════════════════════════════════════════════════════╗');
  console.log('║     🔥 CARGANDO DATOS A FIRESTORE                 ║');
  console.log('╚════════════════════════════════════════════════════╝\n');
  
  try {
    // Leer archivo de datos
    const datosPath = path.join(__dirname, 'datos_para_firebase_COMPLETOS.json');    if (!fs.existsSync(datosPath)) {
      console.error('❌ Error: No se encuentra el archivo datos_para_firebase_COMPLETOS.json');
      console.log('   Ejecuta primero: python convertir-directo-firebase.py');
      process.exit(1);
    }

    console.log('📖 Leyendo datos_para_firebase.json...');
    const datos = JSON.parse(fs.readFileSync(datosPath, 'utf-8'));

    const colecciones = datos.colecciones;
    let totalDocumentos = 0;

    // Cargar cada colección
    for (const [nombre, documentos] of Object.entries(colecciones)) {
      if (Array.isArray(documentos) && documentos.length > 0) {
        const cargados = await cargarColeccion(nombre, documentos);
        totalDocumentos += cargados;
      }
    }

    // Cargar RF Actual como documento especial
    console.log('\n💰 Guardando RF Actual...');
    await db.collection('sistema').doc('rfActual').set(datos.rfActual);
    console.log('   ✅ RF Actual guardado');

    // Resumen final
    console.log('\n' + '='.repeat(60));
    console.log('✅ CARGA COMPLETA A FIRESTORE');
    console.log('='.repeat(60));
    console.log(`📊 Total documentos cargados: ${totalDocumentos}`);
    console.log(`🔥 Proyecto: premium-ecosystem-1760790572`);
    console.log('\n✅ Datos disponibles en Firestore\n');
  } catch (error) {
    console.error('❌ Error durante la carga:', error);
    process.exit(1);
  }
}

main()
  .then(() => {
    console.log('🎉 Proceso completado exitosamente');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Error fatal:', error);
    process.exit(1);
  });
