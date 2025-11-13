import admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';

// Inicializar Admin SDK
admin.initializeApp({
  projectId: 'premium-ecosystem-1760790572',
});

const db = getFirestore();

// Colecciones VÁLIDAS que deben existir
const VALID_COLLECTIONS = [
  'control_maestro', // ✅ Ventas completas
  'tabla_gya', // ✅ Gastos y Abonos
  'distribuidores', // ✅ Órdenes de compra
  'clientes', // ✅ Clientes
  'almacen_monte', // ✅ Almacén Monte
  'boveda_monte_ingresos', // ✅ Bóveda Monte Ingresos
  'boveda_monte_gastos', // ✅ Bóveda Monte Gastos
  'boveda_usa_ingresos', // ✅ Bóveda USA Ingresos
  'boveda_usa_gastos', // ✅ Bóveda USA Gastos
  'azteca_ingresos', // ✅ Azteca Ingresos
  'azteca_gastos', // ✅ Azteca Gastos
  'utilidades_ingresos', // ✅ Utilidades Ingresos
  'utilidades_gastos', // ✅ Utilidades Gastos
  'flete_sur_ingresos', // ✅ Flete Sur Ingresos
  'flete_sur_gastos', // ✅ Flete Sur Gastos
  'leftie_ingresos', // ✅ Leftie Ingresos
  'leftie_gastos', // ✅ Leftie Gastos
  'profit_ingresos', // ✅ Profit Ingresos
  'data_adicional', // ✅ Data adicional
  'rf_actual', // ✅ Estado actual del sistema
];

// Colecciones ANTIGUAS a eliminar (de la migración incorrecta anterior)
const COLLECTIONS_TO_DELETE = [
  'almacen_monte_ordenes', // ❌ Duplicado - ya está en almacen_monte
  'almacen_monte_salidas', // ❌ Duplicado - ya está en almacen_monte
  'profit_gastos', // ❌ No tiene datos en el Excel
  // Agregar otras colecciones que puedan estar duplicadas
];

async function listAllCollections() {
  console.log('🔍 LISTANDO TODAS LAS COLECCIONES EN FIRESTORE\n' + '='.repeat(80));

  try {
    const collections = await db.listCollections();
    const collectionNames = collections.map((col) => col.id);

    console.log(`\n📚 Total de colecciones encontradas: ${collectionNames.length}\n`);

    const valid = [];
    const toDelete = [];
    const unknown = [];

    for (const name of collectionNames) {
      // Contar documentos
      const snapshot = await db.collection(name).count().get();
      const count = snapshot.data().count;

      if (VALID_COLLECTIONS.includes(name)) {
        valid.push({ name, count, status: '✅ VÁLIDA' });
      } else if (COLLECTIONS_TO_DELETE.includes(name)) {
        toDelete.push({ name, count, status: '❌ ELIMINAR' });
      } else {
        unknown.push({ name, count, status: '⚠️  REVISAR' });
      }
    }

    console.log('✅ COLECCIONES VÁLIDAS:');
    valid.forEach(({ name, count }) => {
      console.log(`   • ${name.padEnd(30)} ${count.toString().padStart(5)} docs`);
    });

    if (toDelete.length > 0) {
      console.log('\n❌ COLECCIONES A ELIMINAR:');
      toDelete.forEach(({ name, count }) => {
        console.log(`   • ${name.padEnd(30)} ${count.toString().padStart(5)} docs`);
      });
    }

    if (unknown.length > 0) {
      console.log('\n⚠️  COLECCIONES DESCONOCIDAS (REVISAR):');
      unknown.forEach(({ name, count }) => {
        console.log(`   • ${name.padEnd(30)} ${count.toString().padStart(5)} docs`);
      });
    }

    console.log('\n' + '='.repeat(80));
    console.log(
      `\nTotal: ${valid.length} válidas, ${toDelete.length} a eliminar, ${unknown.length} desconocidas`
    );

    return {
      valid,
      toDelete,
      unknown,
      allCollections: collectionNames,
    };
  } catch (error) {
    console.error('❌ Error listando colecciones:', error);
    throw error;
  }
}

async function deleteCollections(collectionsToDelete) {
  if (collectionsToDelete.length === 0) {
    console.log('\n✅ No hay colecciones para eliminar');
    return;
  }

  console.log('\n🗑️  ELIMINANDO COLECCIONES DUPLICADAS/OBSOLETAS\n' + '='.repeat(80));

  let totalDeleted = 0;

  for (const { name, count } of collectionsToDelete) {
    try {
      console.log(`\n🗑️  Eliminando: ${name} (${count} docs)...`);

      // Eliminar en lotes de 500
      let deleted = 0;
      let hasMore = true;

      while (hasMore) {
        const snapshot = await db.collection(name).limit(500).get();

        if (snapshot.empty) {
          hasMore = false;
          break;
        }

        const batch = db.batch();
        snapshot.docs.forEach((doc) => batch.delete(doc.ref));

        await batch.commit();
        deleted += snapshot.docs.length;
        totalDeleted += snapshot.docs.length;

        console.log(`   ├─ ${deleted}/${count} documentos eliminados...`);

        if (snapshot.docs.length < 500) {
          hasMore = false;
        }
      }

      console.log(`   ✅ Colección "${name}" eliminada (${deleted} docs)`);
    } catch (error) {
      console.error(`   ❌ Error eliminando ${name}:`, error.message);
    }
  }

  console.log('\n' + '='.repeat(80));
  console.log(`✅ Total documentos eliminados: ${totalDeleted}`);
  console.log('='.repeat(80));
}

async function main() {
  try {
    // 1. Listar todas las colecciones
    const { valid, toDelete, unknown } = await listAllCollections();

    // 2. Si hay colecciones desconocidas, preguntar qué hacer
    if (unknown.length > 0) {
      console.log('\n⚠️  ATENCIÓN: Se encontraron colecciones desconocidas.');
      console.log('    Revisa la lista anterior antes de eliminarlas.');
      console.log('\n    Para eliminarlas, agrégalas a COLLECTIONS_TO_DELETE en el script.');
    }

    // 3. Eliminar colecciones marcadas
    if (toDelete.length > 0) {
      await deleteCollections(toDelete);
    } else {
      console.log('\n✅ No hay colecciones duplicadas u obsoletas para eliminar.');
    }

    console.log('\n🎉 PROCESO COMPLETADO\n');
  } catch (error) {
    console.error('\n❌ ERROR FATAL:', error);
  } finally {
    process.exit(0);
  }
}

main();
