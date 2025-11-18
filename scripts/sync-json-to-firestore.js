/**
 * 🔄 SCRIPT DE SINCRONIZACIÓN JSON → FIRESTORE
 * ==============================================
 * Sincroniza los datos de data/bancos.json a Firestore.
 * Se ejecuta automáticamente en GitHub Actions cuando cambia bancos.json
 */

const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// Inicializar Firebase Admin
if (process.env.FIREBASE_SERVICE_ACCOUNT) {
  const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: process.env.FIREBASE_PROJECT_ID,
  });
} else {
  // Desarrollo local - usa las credenciales por defecto
  admin.initializeApp({
    projectId: process.env.FIREBASE_PROJECT_ID || 'your-project-id',
  });
}

const db = admin.firestore();

/**
 * Sincronizar bancos
 */
async function sincronizarBancos() {
  console.log('🔄 Iniciando sincronización de bancos...\n');

  // Leer JSON local
  const bancosPath = path.join(__dirname, '../data/bancos.json');
  const bancosData = JSON.parse(fs.readFileSync(bancosPath, 'utf8'));

  console.log(`📦 Bancos en JSON: ${bancosData.bancos.length}`);
  console.log(`📋 Operaciones en JSON: ${bancosData.operaciones.length}\n`);

  const batch = db.batch();
  let creados = 0;
  let actualizados = 0;

  // Sincronizar cada banco
  for (const banco of bancosData.bancos) {
    const bancoRef = db.collection('bancos').doc(banco.id);
    const bancoDoc = await bancoRef.get();

    if (!bancoDoc.exists || process.env.FORCE_SYNC === 'true') {
      batch.set(
        bancoRef,
        {
          ...banco,
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        },
        { merge: true }
      );

      if (bancoDoc.exists) {
        actualizados++;
        console.log(`✏️  Actualizado: ${banco.nombre} (${banco.id})`);
      } else {
        creados++;
        console.log(`✅ Creado: ${banco.nombre} (${banco.id})`);
      }
    } else {
      console.log(`⏭️  Omitido: ${banco.nombre} (ya existe)`);
    }
  }

  // Sincronizar operaciones (solo las nuevas)
  let operacionesCreadas = 0;
  for (const operacion of bancosData.operaciones) {
    const opRef = db.collection('operaciones_bancos').doc(operacion.id);
    const opDoc = await opRef.get();

    if (!opDoc.exists) {
      batch.set(opRef, {
        ...operacion,
        fecha: admin.firestore.Timestamp.fromDate(new Date(operacion.fecha)),
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });
      operacionesCreadas++;
    }
  }

  // Ejecutar batch
  await batch.commit();

  console.log('\n✅ SINCRONIZACIÓN COMPLETADA\n');
  console.log('📊 RESUMEN:');
  console.log(`  - Bancos creados: ${creados}`);
  console.log(`  - Bancos actualizados: ${actualizados}`);
  console.log(`  - Operaciones creadas: ${operacionesCreadas}`);
  console.log(`  - Total bancos: ${bancosData.bancos.length}`);
  console.log(`  - Total operaciones: ${bancosData.operaciones.length + operacionesCreadas}\n`);

  return {
    creados,
    actualizados,
    operacionesCreadas,
  };
}

/**
 * Main
 */
(async () => {
  try {
    await sincronizarBancos();
    process.exit(0);
  } catch (error) {
    console.error('\n❌ ERROR en sincronización:', error);
    process.exit(1);
  }
})();
