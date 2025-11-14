/**
 * ═══════════════════════════════════════════════════════════════
 * 🧪 TEST DE CONEXIÓN A FIRESTORE
 * ═══════════════════════════════════════════════════════════════
 *
 * Este script prueba la conexión a Firebase ANTES de importar datos.
 *
 * COMANDO: npx ts-node scripts/test-connection.ts
 * ═══════════════════════════════════════════════════════════════
 */

import chalk from 'chalk';
import * as admin from 'firebase-admin';
import * as fs from 'fs';

const SERVICE_ACCOUNT_PATH = './firebase/serviceAccountKey.json';
const DATABASE_URL = process.env.FIREBASE_DATABASE_URL || 'https://TU_PROYECTO_AQUI.firebaseio.com';

async function testConnection() {
  console.log('\n' + chalk.cyan('═'.repeat(70)));
  console.log(chalk.cyan.bold('        🧪 TEST DE CONEXIÓN A FIRESTORE        '));
  console.log(chalk.cyan('═'.repeat(70)) + '\n');

  try {
    // 1. Verificar Service Account
    console.log(chalk.blue('1️⃣  Verificando Service Account...'));

    if (!fs.existsSync(SERVICE_ACCOUNT_PATH)) {
      throw new Error(
        `Service Account no encontrado en: ${SERVICE_ACCOUNT_PATH}\n` +
        `Descárgalo desde Firebase Console > Project Settings > Service Accounts`
      );
    }

    const serviceAccount = JSON.parse(
      fs.readFileSync(SERVICE_ACCOUNT_PATH, 'utf8')
    );

    console.log(chalk.green('   ✅ Service Account encontrado'));
    console.log(chalk.gray(`   Project ID: ${serviceAccount.project_id}`));

    // 2. Inicializar Firebase
    console.log(chalk.blue('\n2️⃣  Conectando a Firebase...'));

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: DATABASE_URL,
    });

    const db = admin.firestore();
    console.log(chalk.green('   ✅ Conexión a Firebase establecida'));

    // 3. Probar escritura
    console.log(chalk.blue('\n3️⃣  Probando escritura en Firestore...'));

    const testDoc = db.collection('_test').doc('connection-test');
    await testDoc.set({
      timestamp: new Date(),
      test: 'Connection successful',
      version: '2.0.0',
    });

    console.log(chalk.green('   ✅ Escritura exitosa'));

    // 4. Probar lectura
    console.log(chalk.blue('\n4️⃣  Probando lectura de Firestore...'));

    const snapshot = await testDoc.get();
    const data = snapshot.data();

    if (!data) {
      throw new Error('No se pudo leer el documento de prueba');
    }

    console.log(chalk.green('   ✅ Lectura exitosa'));
    console.log(chalk.gray(`   Timestamp: ${data.timestamp.toDate().toISOString()}`));

    // 5. Limpiar documento de prueba
    console.log(chalk.blue('\n5️⃣  Limpiando datos de prueba...'));

    await testDoc.delete();

    console.log(chalk.green('   ✅ Limpieza completada'));

    // 6. Verificar colecciones existentes
    console.log(chalk.blue('\n6️⃣  Verificando colecciones existentes...'));

    const collections = await db.listCollections();
    const collectionNames = collections.map((col) => col.id);

    if (collectionNames.length === 0) {
      console.log(chalk.yellow('   ⚠️  No hay colecciones en Firestore (base de datos vacía)'));
    } else {
      console.log(chalk.green(`   ✅ Encontradas ${collectionNames.length} colecciones:`));
      collectionNames.forEach((name) => {
        console.log(chalk.gray(`      - ${name}`));
      });
    }

    // 7. Resumen final
    console.log('\n' + chalk.cyan('═'.repeat(70)));
    console.log(chalk.green.bold('✅ TODAS LAS PRUEBAS PASARON EXITOSAMENTE'));
    console.log(chalk.cyan('═'.repeat(70)));
    console.log(chalk.white('\n📊 Resumen:'));
    console.log(chalk.gray('   • Service Account:    ✅ Válido'));
    console.log(chalk.gray('   • Conexión Firebase:  ✅ Exitosa'));
    console.log(chalk.gray('   • Permisos Escritura: ✅ OK'));
    console.log(chalk.gray('   • Permisos Lectura:   ✅ OK'));
    console.log(chalk.gray(`   • Colecciones:        ${collectionNames.length}`));
    console.log(chalk.white('\n🚀 Siguiente paso:'));
    console.log(chalk.cyan('   npm run validate:csv\n'));

  } catch (error: any) {
    console.log('\n' + chalk.red('═'.repeat(70)));
    console.log(chalk.red.bold('❌ PRUEBA FALLIDA'));
    console.log(chalk.red('═'.repeat(70)));
    console.log(chalk.white('\n💥 Error:'));
    console.log(chalk.red(`   ${error.message}\n`));

    if (error.message.includes('PERMISSION_DENIED')) {
      console.log(chalk.yellow('📝 Solución:'));
      console.log(chalk.gray('   1. Ve a Firebase Console > Firestore > Rules'));
      console.log(chalk.gray('   2. Cambia temporalmente las reglas a:'));
      console.log(chalk.cyan('      allow read, write: if true;'));
      console.log(chalk.gray('   3. Vuelve a ejecutar este test'));
      console.log(chalk.red('   ⚠️  NO OLVIDES restaurar las reglas después\n'));
    }

    if (error.message.includes('ECONNREFUSED') || error.message.includes('Network')) {
      console.log(chalk.yellow('📝 Solución:'));
      console.log(chalk.gray('   1. Verifica tu conexión a internet'));
      console.log(chalk.gray('   2. Verifica que Firebase esté activo'));
      console.log(chalk.gray('   3. Ejecuta: ping firestore.googleapis.com\n'));
    }

    process.exit(1);
  } finally {
    await admin.app().delete();
  }
}

testConnection();
