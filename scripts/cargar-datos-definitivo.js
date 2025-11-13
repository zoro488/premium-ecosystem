#!/usr/bin/env node
/**
 * 🔥 CARGA DEFINITIVA DE DATOS A FIRESTORE
 * Lee: datos_excel_completos.json (raíz del proyecto)
 * Este archivo YA TIENE la estructura correcta
 */

import { initializeApp } from 'firebase/app'
import { collection, doc, getDocs, getFirestore, writeBatch } from 'firebase/firestore'
import { readFileSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Firebase config
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

// Leer datos (versión limpia sin emojis)
const dataPath = join(__dirname, '../datos_paneles_limpios.json')
const excelData = JSON.parse(readFileSync(dataPath, 'utf-8'))

console.log('\n🚀 CARGA DEFINITIVA DE DATOS A FIRESTORE')
console.log('='.repeat(80))
console.log(`📂 Archivo: datos_excel_completos.json`)
console.log(`📊 Ventas: ${excelData.ventas?.length || 0}`)
console.log(`👥 Clientes: ${excelData.clientes?.length || 0}`)
console.log(`🚚 Distribuidores: ${excelData.distribuidores?.length || 0}`)
console.log(`🏦 Bancos: ${Object.keys(excelData.bancos || {}).length}`)
console.log('='.repeat(80) + '\n')

async function limpiarColeccion(nombre) {
  console.log(`🧹 Limpiando ${nombre}...`)
  const snapshot = await getDocs(collection(db, nombre))
  if (!snapshot.empty) {
    const batch = writeBatch(db)
    snapshot.docs.forEach((d) => batch.delete(d.ref))
    await batch.commit()
    console.log(`   ✅ ${snapshot.size} docs eliminados`)
  }
}

async function subirBatch(coleccion, docs, transform = null) {
  if (!docs || docs.length === 0) return

  console.log(`📤 Subiendo ${docs.length} docs a ${coleccion}...`)

  const BATCH_SIZE = 500
  let count = 0

  for (let i = 0; i < docs.length; i += BATCH_SIZE) {
    const batch = writeBatch(db)
    const chunk = docs.slice(i, i + BATCH_SIZE)

    chunk.forEach((item) => {
      const data = transform ? transform(item) : item
      const id = data.id || `${coleccion}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      const { id: _, ...dataWithoutId } = data
      const docRef = doc(db, coleccion, id)
      batch.set(docRef, dataWithoutId)
      count++
    })

    await batch.commit()
    console.log(`   ⏳ ${count}/${docs.length}`)
  }

  console.log(`   ✅ ${count} docs subidos\n`)
}

async function main() {
  try {
    // 1. VENTAS
    console.log('📊 VENTAS')
    await limpiarColeccion('ventas')
    await subirBatch('ventas', excelData.ventas, (venta) => ({
      id: venta.id,
      fecha: venta.fecha,
      cliente: venta.cliente,
      cantidad: venta.cantidad || 0,
      costoUnidad: venta.costoUnidad || 0,
      precioVenta: venta.precioVenta || 0,
      totalVenta: venta.totalVenta || 0,
      totalFletes: venta.totalFletes || 0,
      aplicaFlete: venta.aplicaFlete || false,
      utilidadNeta: venta.utilidadNeta || 0,
      estatus: venta.estatus || 'Pendiente',
      ocRelacionada: venta.ocRelacionada || '',
      distribucionBancos: venta.distribucionBancos || {
        bovedaMonte: 0,
        fletes: 0,
        utilidades: 0,
      },
      metadata: {
        origen: 'excel',
        cargadoEn: new Date().toISOString(),
      },
    }))

    // 2. CLIENTES
    console.log('👥 CLIENTES')
    await limpiarColeccion('clientes')
    await subirBatch('clientes', excelData.clientes, (cliente) => ({
      id: cliente.id || `cliente_${cliente.nombre}`,
      nombre: cliente.nombre,
      adeudo: cliente.adeudo || 0,
      totalCompras: cliente.totalCompras || 0,
      metadata: {
        origen: 'excel',
        cargadoEn: new Date().toISOString(),
      },
    }))

    // 3. DISTRIBUIDORES
    console.log('🚚 DISTRIBUIDORES')
    await limpiarColeccion('distribuidores')
    await subirBatch('distribuidores', excelData.distribuidores, (dist) => ({
      id: dist.id || `dist_${dist.nombre}`,
      nombre: dist.nombre,
      adeudo: dist.adeudo || 0,
      metadata: {
        origen: 'excel',
        cargadoEn: new Date().toISOString(),
      },
    }))

    // 4. ORDENES DE COMPRA
    if (excelData.ordenesCompra && excelData.ordenesCompra.length > 0) {
      console.log('📋 ORDENES DE COMPRA')
      await limpiarColeccion('ordenesCompra')
      await subirBatch('ordenesCompra', excelData.ordenesCompra, (oc) => ({
        id: oc.id,
        fecha: oc.fecha,
        distribuidor: oc.distribuidor,
        cantidad: oc.cantidad || 0,
        costoUnitario: oc.costoUnitario || 0,
        costoTotal: oc.costoTotal || 0,
        estatus: oc.estatus || 'Pendiente',
        metadata: {
          origen: 'excel',
          cargadoEn: new Date().toISOString(),
        },
      }))
    }

    // 5. BANCOS
    console.log('🏦 BANCOS')
    await limpiarColeccion('bancos')

    const bancos = Object.entries(excelData.bancos || {})
    for (const [id, banco] of bancos) {
      const batch = writeBatch(db)
      const docRef = doc(db, 'bancos', id)

      batch.set(docRef, {
        nombre: banco.nombre || id,
        capitalActual: banco.saldoActual || 0,
        tipo: 'banco',
        ingresos: (banco.ingresos || []).map((ing) => ({
          fecha: ing.fecha,
          cliente: ing.cliente || '',
          concepto: ing.concepto || '',
          monto: ing.ingreso || 0,
        })),
        gastos: (banco.gastos || []).map((gasto) => ({
          fecha: gasto.fecha,
          concepto: gasto.concepto || '',
          monto: gasto.gasto || 0,
        })),
        metadata: {
          origen: 'excel',
          actualizadoEn: new Date().toISOString(),
        },
      })

      await batch.commit()
      console.log(`   ✅ ${id}: $${(banco.saldoActual || 0).toLocaleString()}`)
    }

    // 6. ALMACÉN
    console.log('\n📦 ALMACÉN')
    await limpiarColeccion('almacen')

    const batch = writeBatch(db)
    const almacenRef = doc(db, 'almacen', 'almacen-monte')

    const almacen = excelData.almacen || {}
    batch.set(almacenRef, {
      nombre: 'Almacén Monte',
      stockActual: almacen.stockActual || 0,
      tipo: 'almacen',
      entradas: (almacen.entradas || []).map((ent) => ({
        fecha: ent.fecha,
        cantidad: ent.cantidad || 0,
        origen: ent.origen || '',
        concepto: ent.concepto || '',
      })),
      salidas: (almacen.salidas || []).map((sal) => ({
        fecha: sal.fecha,
        cantidad: sal.cantidad || 0,
        destino: sal.destino || '',
        concepto: sal.concepto || '',
      })),
      metadata: {
        origen: 'excel',
        actualizadoEn: new Date().toISOString(),
      },
    })

    await batch.commit()
    console.log(`   ✅ Stock actual: ${almacen.stockActual || 0} unidades`)

    console.log('\n' + '='.repeat(80))
    console.log('🎉 ¡CARGA COMPLETADA EXITOSAMENTE!')
    console.log('='.repeat(80))
    console.log('\n📊 RESUMEN:')
    console.log(`   ✅ Ventas: ${excelData.ventas?.length || 0}`)
    console.log(`   ✅ Clientes: ${excelData.clientes?.length || 0}`)
    console.log(`   ✅ Distribuidores: ${excelData.distribuidores?.length || 0}`)
    console.log(`   ✅ Órdenes: ${excelData.ordenesCompra?.length || 0}`)
    console.log(`   ✅ Bancos: ${Object.keys(excelData.bancos || {}).length}`)
    console.log(`   ✅ Almacén: 1`)
    console.log('\n💡 Ahora puedes:')
    console.log('   1. Ejecutar: npm run dev')
    console.log('   2. Abrir: http://localhost:3004/flowdistributor')
    console.log('   3. Ver todos los datos en la UI\n')

    process.exit(0)
  } catch (error) {
    console.error('\n❌ ERROR:', error)
    process.exit(1)
  }
}

main()
