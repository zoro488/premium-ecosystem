import { initializeApp } from 'firebase/app'
import {
    collection,
    deleteDoc,
    doc,
    getDocs,
    getFirestore
} from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyDN82KFpPJGfzUDgU4wB7rLVJHLCn6DKM8",
  authDomain: "premium-ecosystem-1760790572.firebaseapp.com",
  projectId: "premium-ecosystem-1760790572",
  storageBucket: "premium-ecosystem-1760790572.firebasestorage.app",
  messagingSenderId: "1025668867803",
  appId: "1:1025668867803:web:f8eef72d2ff2b52bd8f394",
  measurementId: "G-FDH6XLGQR4"
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

// Colecciones VÁLIDAS (las que acabamos de migrar correctamente)
const VALID_COLLECTIONS = [
  'control_maestro',      // ✅ 96 docs - Ventas completas
  'tabla_gya',           // ✅ 303 docs - Gastos y Abonos
  'distribuidores',      // ✅ 997 docs - Órdenes de compra
  'clientes',            // ✅ 197 docs - Clientes
  'almacen_monte',       // ✅ 96 docs - Almacén Monte
  'boveda_monte_ingresos', // ✅ 69 docs - Bóveda Monte Ingresos
  'boveda_monte_gastos',   // ✅ 26 docs - Bóveda Monte Gastos
  'boveda_usa_ingresos',   // ✅ 17 docs - Bóveda USA Ingresos
  'boveda_usa_gastos',     // ✅ 49 docs - Bóveda USA Gastos
  'azteca_ingresos',       // ✅ 6 docs - Azteca Ingresos
  'azteca_gastos',         // ✅ 24 docs - Azteca Gastos
  'utilidades_ingresos',   // ✅ 50 docs - Utilidades Ingresos
  'utilidades_gastos',     // ✅ 13 docs - Utilidades Gastos
  'flete_sur_ingresos',    // ✅ 58 docs - Flete Sur Ingresos
  'flete_sur_gastos',      // ✅ 103 docs - Flete Sur Gastos
  'leftie_ingresos',       // ✅ 9 docs - Leftie Ingresos
  'leftie_gastos',         // ✅ 4 docs - Leftie Gastos
  'profit_ingresos',       // ✅ 55 docs - Profit Ingresos
  'data_adicional',        // ✅ 83 docs - Data adicional
  'rf_actual'              // ✅ 1 doc - Estado actual del sistema
]

// Colecciones ANTIGUAS a eliminar (de migraciones anteriores o duplicadas)
const COLLECTIONS_TO_DELETE = [
  'almacen_monte_ordenes',  // ❌ Ya no se usa - datos en almacen_monte
  'almacen_monte_salidas',  // ❌ Ya no se usa - datos en almacen_monte
  'profit_gastos',          // ❌ No existe en Excel
]

async function verifyCollection(collectionName) {
  try {
    const collectionRef = collection(db, collectionName)
    const snapshot = await getDocs(collectionRef)
    return {
      name: collectionName,
      exists: !snapshot.empty,
      count: snapshot.size
    }
  } catch (error) {
    return {
      name: collectionName,
      exists: false,
      count: 0,
      error: error.message
    }
  }
}

async function deleteCollection(collectionName) {
  try {
    const collectionRef = collection(db, collectionName)
    const snapshot = await getDocs(collectionRef)

    if (snapshot.empty) {
      console.log(`   📭 ${collectionName}: Ya está vacía`)
      return 0
    }

    console.log(`\n🗑️  Eliminando: ${collectionName} (${snapshot.size} docs)...`)

    const deletePromises = snapshot.docs.map(document =>
      deleteDoc(doc(db, collectionName, document.id))
    )

    await Promise.all(deletePromises)

    console.log(`   ✅ ${snapshot.size} documentos eliminados`)
    return snapshot.size

  } catch (error) {
    console.error(`   ❌ Error en ${collectionName}:`, error.message)
    return 0
  }
}

async function main() {
  console.log('🔍 VERIFICACIÓN Y LIMPIEZA DE FIRESTORE')
  console.log('='.repeat(80) + '\n')

  // 1. Verificar colecciones válidas
  console.log('✅ VERIFICANDO COLECCIONES VÁLIDAS:\n')

  let totalValid = 0
  let totalDocsValid = 0

  for (const collectionName of VALID_COLLECTIONS) {
    const result = await verifyCollection(collectionName)
    if (result.exists) {
      console.log(`   ✅ ${result.name.padEnd(30)} ${result.count.toString().padStart(5)} docs`)
      totalValid++
      totalDocsValid += result.count
    } else {
      console.log(`   ⚠️  ${result.name.padEnd(30)} NO EXISTE`)
    }
  }

  console.log(`\n   Total: ${totalValid}/${VALID_COLLECTIONS.length} colecciones válidas con ${totalDocsValid} documentos`)

  // 2. Verificar y eliminar colecciones antiguas
  console.log('\n' + '='.repeat(80))
  console.log('🗑️  VERIFICANDO COLECCIONES A ELIMINAR:\n')

  let totalToDelete = 0
  let totalDocsToDelete = 0
  const existingToDelete = []

  for (const collectionName of COLLECTIONS_TO_DELETE) {
    const result = await verifyCollection(collectionName)
    if (result.exists) {
      console.log(`   ❌ ${result.name.padEnd(30)} ${result.count.toString().padStart(5)} docs - ELIMINAR`)
      existingToDelete.push(result)
      totalToDelete++
      totalDocsToDelete += result.count
    } else {
      console.log(`   ✅ ${result.name.padEnd(30)} Ya eliminada`)
    }
  }

  // 3. Eliminar si existen colecciones antiguas
  if (existingToDelete.length > 0) {
    console.log('\n' + '='.repeat(80))
    console.log('🗑️  ELIMINANDO COLECCIONES OBSOLETAS:\n')

    let deleted = 0
    for (const { name } of existingToDelete) {
      deleted += await deleteCollection(name)
    }

    console.log('\n' + '='.repeat(80))
    console.log(`✅ Total eliminado: ${deleted} documentos de ${existingToDelete.length} colecciones`)
  } else {
    console.log('\n✅ No hay colecciones obsoletas para eliminar')
  }

  // Resumen final
  console.log('\n' + '='.repeat(80))
  console.log('🎉 FIRESTORE LIMPIO Y ORGANIZADO')
  console.log('='.repeat(80))
  console.log(`✅ Colecciones válidas: ${totalValid}`)
  console.log(`📄 Total documentos válidos: ${totalDocsValid}`)
  console.log(`🗑️  Colecciones eliminadas: ${existingToDelete.length}`)
  console.log('='.repeat(80) + '\n')

  process.exit(0)
}

main().catch(error => {
  console.error('❌ Error:', error)
  process.exit(1)
})
