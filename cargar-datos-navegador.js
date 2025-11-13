// 🔥 CARGAR DATOS COMPLETOS A FIRESTORE
// Ejecutar en CONSOLA DEL NAVEGADOR (F12) en http://localhost:3001/

(async function cargarDatosCompletos() {
  console.log('\n╔════════════════════════════════════════════════════╗');
  console.log('║  🔥 CARGANDO 2,017 DOCUMENTOS A FIRESTORE         ║');
  console.log('╚════════════════════════════════════════════════════╝\n');

  try {
    // Cargar datos
    console.log('📖 Cargando datos_para_firebase_COMPLETOS.json...');
    const response = await fetch('/datos_para_firebase_COMPLETOS.json');
    const datos = await response.json();

    console.log('✅ Datos cargados:', datos.metadata);

    const colecciones = datos.colecciones;
    let totalCargados = 0;

    // Función para cargar una colección
    const cargarColeccion = async (nombre, documentos) => {
      console.log(`\n📤 Cargando ${nombre}... (${documentos.length} documentos)`);

      const batch = window.firebase.firestore().batch();
      let contador = 0;

      for (const doc of documentos) {
        const docId = doc.id || `${nombre}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const docRef = window.firebase.firestore().collection(nombre).doc(docId);
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
      console.log(`   ✅ Total ${nombre}: ${documentos.length} documentos ✓`);

      return documentos.length;
    };

    // Cargar cada colección
    for (const [nombre, documentos] of Object.entries(colecciones)) {
      if (Array.isArray(documentos) && documentos.length > 0) {
        const cargados = await cargarColeccion(nombre, documentos);
        totalCargados += cargados;
      }
    }

    // Resumen final
    console.log('\n' + '='.repeat(60));
    console.log('✅ CARGA COMPLETA A FIRESTORE');
    console.log('='.repeat(60));
    console.log(`📊 Total documentos cargados: ${totalCargados}`);
    console.log(`🔥 Proyecto: premium-ecosystem-1760790572`);
    console.log('\n🎉 ¡Datos disponibles en Firestore!');
    console.log('🌐 Recarga la página para ver los datos\n');

  } catch (error) {
    console.error('❌ Error durante la carga:', error);
    console.log('\n⚠️ Asegúrate de:');
    console.log('1. Copiar datos_para_firebase_COMPLETOS.json a /public/');
    console.log('2. Ejecutar este script en http://localhost:3001/');
  }
})();
