/*
 * SCRIPT DE IMPORTACIÓN A FIRESTORE (NODE.JS) - VERSIÓN CORREGIDA Y COMPLETA
 *
 * Este script lee tu archivo 'BASE_DATOS_FLOWDISTRIBUTOR_UNIFICADO.json',
 * se conecta a tu proyecto de Firebase usando una Clave de Administrador,
 * y carga los datos en la estructura de colecciones EXACTA que tu app 'chronos-system' espera.
 *
 * --- INSTRUCCIONES DE USO ---
 *
 * Sigue las instrucciones en el archivo `README.md` de esta carpeta.
 *
 */

const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// --- Configuración ---
try {
  const serviceAccount = require('./serviceAccountKey.json');
  const dataToImport = require('./BASE_DATOS_FLOWDISTRIBUTOR_UNIFICADO.json');

  // ❗️❗️ REEMPLAZA ESTA URL ❗️❗️
  const FIREBASE_DATABASE_URL = 'https://TU_PROYECTO_AQUI.firebaseio.com';
  // ❗️❗️ ------------------ ❗️❗️

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: FIREBASE_DATABASE_URL,
  });

  const db = admin.firestore();
  main(db, dataToImport);
} catch (error) {
  console.error('❌ Error de configuración inicial:');
  console.error(
    "Asegúrate de tener los archivos 'serviceAccountKey.json' y 'BASE_DATOS_FLOWDISTRIBUTOR_UNIFICADO.json' en la misma carpeta."
  );
  console.error("También asegúrate de haber ejecutado 'npm install'");
  console.error(error.message);
  process.exit(1);
}

// --- Funciones de Importación ---

/**
 * Sube un array de objetos a una colección de Firestore, usando batches.
 * @param {admin.firestore.Firestore} db - Instancia de Firestore.
 * @param {string} collectionName - Nombre de la colección.
 * @param {Array<Object>} dataArray - Array de documentos a subir.
 * @param {string} idKey - La propiedad del objeto que se usará como ID del documento.
 */
async function importCollection(db, collectionName, dataArray, idKey) {
  if (!dataArray || dataArray.length === 0) {
    console.warn(`⚠️ No hay datos para importar en: ${collectionName}. Omitiendo.`);
    return;
  }

  console.log(`Iniciando importación para: ${collectionName}...`);
  const batchArray = [db.batch()];
  let operationCounter = 0;
  let batchIndex = 0;

  for (const doc of dataArray) {
    let docId;
    if (idKey && doc[idKey]) {
      // Usar una propiedad del documento como ID (ej. "OC0001", "PACMAN")
      docId = String(doc[idKey]).replace(/[\/]/g, '-'); // Firestore no permite '/' en IDs
    } else {
      // Dejar que Firestore genere un ID automático
      docId = db.collection(collectionName).doc().id;
      doc.id = docId; // Añadir el ID generado al documento
    }

    const docRef = db.collection(collectionName).doc(docId);
    batchArray[batchIndex].set(docRef, doc);
    operationCounter++;

    // Firestore tiene un límite de 500 operaciones por batch
    if (operationCounter === 499) {
      batchArray.push(db.batch());
      batchIndex++;
      operationCounter = 0;
      console.log(`  ...lote ${batchIndex} creado.`);
    }
  }

  // Commitear todos los batches
  try {
    await Promise.all(batchArray.map((batch) => batch.commit()));
    console.log(`✅ Éxito: ${dataArray.length} documentos importados a '${collectionName}'.`);
  } catch (error) {
    console.error(`❌ Error importando a '${collectionName}':`, error);
  }
}

/**
 * Sube un objeto simple como un documento único.
 * @param {admin.firestore.Firestore} db - Instancia de Firestore.
 * @param {string} collectionName - Nombre de la colección.
 * @param {string} docId - ID del documento.
 * @param {Object} dataObject - El objeto a guardar.
 */
async function importSingleDoc(db, collectionName, docId, dataObject) {
  if (!dataObject) {
    console.warn(`⚠️ No hay datos para el documento: ${collectionName}/${docId}. Omitiendo.`);
    return;
  }
  console.log(`Iniciando importación para documento: ${collectionName}/${docId}...`);
  try {
    const docRef = db.collection(collectionName).doc(docId);
    await docRef.set(dataObject);
    console.log(`✅ Éxito: Documento '${collectionName}/${docId}' importado.`);
  } catch (error) {
    console.error(`❌ Error importando documento '${collectionName}/${docId}':`, error);
  }
}

// --- Proceso Principal de Importación ---

async function main(db, dataToImport) {
  console.log('--- INICIANDO IMPORTACIÓN A FIRESTORE ---');

  // 1. Órdenes de Compra
  if (
    dataToImport.ordenesCompra &&
    dataToImport.ordenesCompra.distribuidores &&
    dataToImport.ordenesCompra.distribuidores.ordenesCompra
  ) {
    await importCollection(
      db,
      'ordenesCompra',
      dataToImport.ordenesCompra.distribuidores.ordenesCompra,
      'id'
    );
  }

  // 2. Distribuidores (Resumen de Deudas)
  if (
    dataToImport.ordenesCompra &&
    dataToImport.ordenesCompra.distribuidores &&
    dataToImport.ordenesCompra.distribuidores.resumen
  ) {
    await importCollection(
      db,
      'distribuidores',
      dataToImport.ordenesCompra.distribuidores.resumen,
      'distribuidor'
    );
  }

  // 3. Ventas
  if (dataToImport.ventas && dataToImport.ventas.ventas) {
    await importCollection(db, 'ventas', dataToImport.ventas.ventas, 'id'); // 'id' puede ser nulo, se autogenerará
  }

  // 4. Clientes (Resumen de Deudas)
  if (dataToImport.ventas && dataToImport.ventas.clientes) {
    await importCollection(db, 'clientes', dataToImport.ventas.clientes, 'cliente');
  }

  // 5. Bancos (Colección) - Lógica Corregida
  // ANÁLISIS: Tu app (hooks/useBancos-v2.js, schemas/banco.schema.ts) espera una
  // colección 'bancos', donde CADA banco es un documento.
  if (dataToImport.bancos) {
    console.log("Iniciando importación de la colección 'bancos'...");
    const bancosData = { ...dataToImport.bancos }; // Copiar para no modificar el original

    // Eliminamos el 'granTotal' si existe, ya que no es un banco
    if ('granTotal' in bancosData) {
      delete bancosData.granTotal;
    }

    for (const bankId of Object.keys(bancosData)) {
      // Tu schema 'banco.schema.ts' es más complejo.
      // Añadimos campos default para que tu app los lea correctamente.
      const bankData = {
        id: bankId, // ej: "bovedaMonte"
        saldo: bancosData[bankId], // ej: 5722280.00
        nombre:
          bankId.charAt(0).toUpperCase() +
          bankId
            .slice(1)
            .replace(/([A-Z])/g, ' $1')
            .trim(), // ej: "Boveda Monte"
        tipo: bankId.toLowerCase().includes('usa') ? 'internacional' : 'nacional',
        moneda: bankId.toLowerCase().includes('usa') ? 'USD' : 'MXN',
      };
      // Usamos importSingleDoc para crear un documento por banco
      await importSingleDoc(db, 'bancos', bankId, bankData);
    }
    console.log("✅ Éxito: Colección 'bancos' importada.");
  }

  // 6. Estado Global: Almacén (Documento Único)
  // ANÁLISIS: Tu app (services/almacen.service.js) espera un único
  // documento para el inventario. El plan 'estadoGlobal/almacen' es correcto.
  if (dataToImport.almacen) {
    await importSingleDoc(db, 'estadoGlobal', 'almacen', dataToImport.almacen);
  }

  // 7. Gastos/Abonos (gastosAbonos)
  if (dataToImport.gastosAbonos && dataToImport.gastosAbonos.gastosAbonos) {
    await importCollection(db, 'gastosAbonos', dataToImport.gastosAbonos.gastosAbonos, null);
  }

  // 8. Movimientos Bancarios - Bóveda Monte
  if (dataToImport.bovedaMonte) {
    // Ingresos
    if (dataToImport.bovedaMonte.ingresos) {
      await importCollection(
        db,
        'movimientosBancarios_bovedaMonte',
        dataToImport.bovedaMonte.ingresos,
        null
      );
    }
    // Gastos detallados
    if (dataToImport.bovedaMonte.gastosList) {
      await importCollection(db, 'gastos_bovedaMonte', dataToImport.bovedaMonte.gastosList, null);
    }
    // Cortes de caja
    if (dataToImport.bovedaMonte.rfCortes) {
      await importSingleDoc(db, 'estadoGlobal', 'cortesBovedaMonte', {
        cortes: dataToImport.bovedaMonte.rfCortes,
        actualizado: new Date().toISOString(),
      });
    }
  }

  // 9. Movimientos Bancarios - Bóveda USA
  if (dataToImport.bovedaUsa) {
    // Ingresos
    if (dataToImport.bovedaUsa.ingresos) {
      await importCollection(
        db,
        'movimientosBancarios_bovedaUsa',
        dataToImport.bovedaUsa.ingresos,
        null
      );
    }
    // Gastos detallados
    if (dataToImport.bovedaUsa.gastos) {
      await importCollection(db, 'gastos_bovedaUsa', dataToImport.bovedaUsa.gastos, null);
    }
    // Cortes de caja
    if (dataToImport.bovedaUsa.cortesRF) {
      await importSingleDoc(db, 'estadoGlobal', 'cortesBovedaUsa', {
        cortes: dataToImport.bovedaUsa.cortesRF,
        actualizado: new Date().toISOString(),
      });
    }
  }

  // 10. Movimientos Bancarios - Utilidades
  if (dataToImport.utilidades) {
    if (dataToImport.utilidades.ingresos) {
      await importCollection(
        db,
        'movimientosBancarios_utilidades',
        dataToImport.utilidades.ingresos,
        null
      );
    }
    if (dataToImport.utilidades.gastos) {
      await importCollection(db, 'gastos_utilidades', dataToImport.utilidades.gastos, null);
    }
    if (dataToImport.utilidades.cortesRF) {
      await importSingleDoc(db, 'estadoGlobal', 'cortesUtilidades', {
        cortes: dataToImport.utilidades.cortesRF,
        actualizado: new Date().toISOString(),
      });
    }
  }

  // 11. Movimientos Bancarios - Fletes
  if (dataToImport.fletes) {
    if (dataToImport.fletes.ingresos) {
      await importCollection(db, 'movimientosBancarios_fletes', dataToImport.fletes.ingresos, null);
    }
    if (dataToImport.fletes.gastos) {
      await importCollection(db, 'gastos_fletes', dataToImport.fletes.gastos, null);
    }
    if (dataToImport.fletes.cortesRF) {
      await importSingleDoc(db, 'estadoGlobal', 'cortesFletes', {
        cortes: dataToImport.fletes.cortesRF,
        actualizado: new Date().toISOString(),
      });
    }
  }

  // 12. Movimientos Bancarios - Banco Azteca
  if (dataToImport.bancoAzteca) {
    if (dataToImport.bancoAzteca.ingresos) {
      await importCollection(
        db,
        'movimientosBancarios_azteca',
        dataToImport.bancoAzteca.ingresos,
        null
      );
    }
    if (dataToImport.bancoAzteca.gastos) {
      await importCollection(db, 'gastos_azteca', dataToImport.bancoAzteca.gastos, null);
    }
  }

  // 13. Productos (si existen en el JSON)
  if (dataToImport.productos) {
    await importCollection(db, 'productos', dataToImport.productos, 'id');
  }

  // 14. Metadata del sistema
  if (dataToImport.metadata) {
    await importSingleDoc(db, 'estadoGlobal', 'metadata', {
      ...dataToImport.metadata,
      importadoEl: new Date().toISOString(),
      version: dataToImport.metadata.version || '1.0',
    });
  }

  console.log('');
  console.log('='.repeat(70));
  console.log('✅ IMPORTACIÓN COMPLETADA EXITOSAMENTE');
  console.log('='.repeat(70));
  console.log('');
  console.log('📊 Resumen de Colecciones Importadas:');
  console.log('   • ordenesCompra - Órdenes de compra a distribuidores');
  console.log('   • distribuidores - Resumen de deudas por distribuidor');
  console.log('   • ventas - Registro completo de ventas');
  console.log('   • clientes - Resumen de deudas por cliente');
  console.log('   • bancos - Cuentas bancarias y saldos');
  console.log('   • gastosAbonos - Gastos y abonos generales');
  console.log('   • movimientosBancarios_* - Movimientos por cada cuenta');
  console.log('   • gastos_* - Gastos detallados por cuenta');
  console.log('   • estadoGlobal/* - Almacén, cortes y metadata');
  console.log('');
  console.log('🎯 Tus datos están listos para chronos-system');
  console.log('');
  console.log('📝 Próximos pasos:');
  console.log('   1. Verifica los datos en Firebase Console');
  console.log('   2. Inicia tu aplicación chronos-system');
  console.log('   3. ¡Disfruta de tu sistema completamente funcional!');
  console.log('');
}
