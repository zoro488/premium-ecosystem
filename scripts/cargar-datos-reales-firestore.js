#!/usr/bin/env node
/**
 * Script para cargar datos REALES del Excel a Firestore
 * Lee: src/data/datos_excel_reales_completos.json
 * Carga a: Firestore Collections
 */

import { initializeApp } from 'firebase/app'
import {
  getFirestore,
  collection,
  writeBatch,
  doc,
  deleteDoc,
  getDocs,
} from 'firebase/firestore'
import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Configuración Firebase
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY || 'YOUR_API_KEY',
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN || 'premium-ecosystem.firebaseapp.com',
  projectId: process.env.VITE_FIREBASE_PROJECT_ID || 'premium-ecosystem',
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET || 'premium-ecosystem.appspot.com',
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || 'YOUR_SENDER_ID',
  appId: process.env.VITE_FIREBASE_APP_ID || 'YOUR_APP_ID',
}

// Inicializar Firebase
const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

// Colores para consola
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
}

function log(color, icon, message) {
  console.log(`${color}${icon} ${message}${colors.reset}`)
}

/**
 * Limpia una colección antes de cargar datos nuevos
 */
async function limpiarColeccion(nombreColeccion) {
  log(colors.yellow, '🧹', `Limpiando colección: ${nombreColeccion}`)

  const colRef = collection(db, nombreColeccion)
  const snapshot = await getDocs(colRef)

  if (snapshot.empty) {
    log(colors.cyan, '  ℹ', `Colección vacía, nada que limpiar`)
    return
  }

  // Eliminar en batches
  const batch = writeBatch(db)
  let count = 0

  snapshot.docs.forEach((docSnap) => {
    batch.delete(docSnap.ref)
    count++
  })

  if (count > 0) {
    await batch.commit()
    log(colors.green, '  ✅', `${count} documentos eliminados`)
  }
}

/**
 * Sube documentos en batches de 500
 */
async function subirEnBatch(nombreColeccion, documentos, transformador = null) {
  if (!documentos || documentos.length === 0) {
    log(colors.yellow, '  ⚠', `Sin datos para subir a ${nombreColeccion}`)
    return
  }

  log(colors.blue, '📤', `Subiendo ${documentos.length} documentos a ${nombreColeccion}`)

  const BATCH_SIZE = 500
  let subidos = 0

  for (let i = 0; i < documentos.length; i += BATCH_SIZE) {
    const batch = writeBatch(db)
    const chunk = documentos.slice(i, i + BATCH_SIZE)

    chunk.forEach((documento) => {
      const data = transformador ? transformador(documento) : documento
      const docId = data.id || `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      const docRef = doc(db, nombreColeccion, docId)

      // Remover el campo id si existe (Firestore usa document ID)
      const { id, ...dataWithoutId } = data

      batch.set(docRef, dataWithoutId)
      subidos++
    })

    await batch.commit()
    log(colors.cyan, '  ⏳', `Progreso: ${subidos}/${documentos.length}`)
  }

  log(colors.green, '  ✅', `${subidos} documentos subidos exitosamente`)
}

/**
 * Transformador para VENTAS
 */
function transformarVenta(venta) {
  return {
    id: venta.id || `venta_${Date.now()}`,
    fecha: venta.fecha || new Date().toISOString(),
    ocRelacionada: venta.oc || '',
    cantidad: Number(venta.cantidad) || 0,
    cliente: venta.cliente || '',
    costoUnidad: Number(venta.costoBovedaMonte) || 0,
    precioVenta: Number(venta.precioVenta) || 0,
    totalVenta: Number(venta.ingreso) || 0,
    fleteAplica: venta.fleteAplica === 'Aplica' || venta.fleteAplica === 'Sí',
    totalFletes: Number(venta.fleteUtilidad) || 0,
    utilidadNeta: Number(venta.utilidad) || 0,
    estatus: venta.estatus || 'Pendiente',
    concepto: venta.concepto || '',
    panelAsignado: venta.panel || '',
    distribucionBancos: {
      bovedaMonte: 0,
      fletes: Number(venta.fleteUtilidad) || 0,
      utilidades: Number(venta.utilidad) || 0,
    },
    metadata: {
      creadoEn: new Date().toISOString(),
      actualizadoEn: new Date().toISOString(),
      fuente: 'Excel',
    },
  }
}

/**
 * Transformador para GYA (Gastos y Abonos)
 */
function transformarGYA(registro) {
  const valor = Number(registro.valor) || 0

  return {
    id: registro.id || `gya_${Date.now()}`,
    fecha: registro.fecha || new Date().toISOString(),
    tipo: valor < 0 ? 'gasto' : 'abono',
    origen: registro.origen || '',
    destino: registro.destino || '',
    valor: Math.abs(valor),
    tc: Number(registro.tc) || 0,
    pesos: Number(registro.pesos) || 0,
    concepto: registro.concepto || '',
    observaciones: registro.observaciones || '',
    metadata: {
      creadoEn: new Date().toISOString(),
      fuente: 'Excel',
    },
  }
}

/**
 * Transformador para CLIENTES
 */
function transformarCliente(cliente) {
  return {
    id: cliente.id || `cliente_${Date.now()}`,
    nombre: cliente['CLIENTES'] || cliente.nombre || '',
    rfc: cliente.RFC || cliente.rfc || '',
    direccion: cliente['DIRECCIÓN'] || cliente.direccion || '',
    telefono: cliente['TELÉFONO'] || cliente.telefono || '',
    email: cliente.EMAIL || cliente.email || '',
    adeudo: Number(cliente['ADEUDO (Dólares)']) || 0,
    notas: cliente.NOTAS || cliente.notas || '',
    metadata: {
      creadoEn: new Date().toISOString(),
      fuente: 'Excel',
    },
  }
}

/**
 * Transformador para DISTRIBUIDORES
 */
function transformarDistribuidor(distribuidor) {
  return {
    id: distribuidor.id || `dist_${Date.now()}`,
    nombre: distribuidor.DISTRIBUIDORES || distribuidor.nombre || '',
    rfc: distribuidor.RFC || distribuidor.rfc || '',
    direccion: distribuidor['DIRECCIÓN'] || distribuidor.direccion || '',
    telefono: distribuidor['TELÉFONO'] || distribuidor.telefono || '',
    email: distribuidor.EMAIL || distribuidor.email || '',
    adeudo: Number(distribuidor['ADEUDO (Dólares)']) || 0,
    notas: distribuidor.NOTAS || distribuidor.notas || '',
    metadata: {
      creadoEn: new Date().toISOString(),
      fuente: 'Excel',
    },
  }
}

/**
 * Crear documento de BANCO con movimientos
 */
function crearBanco(nombreBanco, idBanco, rfActual, movimientos = []) {
  return {
    id: idBanco,
    nombre: nombreBanco,
    capitalActual: Number(rfActual) || 0,
    tipo: 'banco',
    movimientos: movimientos.map((mov) => ({
      fecha: mov.fecha || new Date().toISOString(),
      tipo: mov.tipo || 'ingreso',
      monto: Number(mov.monto) || 0,
      concepto: mov.concepto || '',
      referencia: mov.referencia || '',
    })),
    metadata: {
      actualizadoEn: new Date().toISOString(),
      fuente: 'Excel',
    },
  }
}

/**
 * Crear documento de ALMACEN
 */
function crearAlmacen(rfActual, entradas = [], salidas = []) {
  return {
    id: 'almacen-monte',
    nombre: 'Almacén Monte',
    stockActual: Number(rfActual) || 0,
    tipo: 'almacen',
    entradas: entradas.map((ent) => ({
      fecha: ent.fecha || new Date().toISOString(),
      cantidad: Number(ent.cantidad) || 0,
      origen: ent.origen || '',
      concepto: ent.concepto || '',
    })),
    salidas: salidas.map((sal) => ({
      fecha: sal.fecha || new Date().toISOString(),
      cantidad: Number(sal.cantidad) || 0,
      destino: sal.destino || '',
      concepto: sal.concepto || '',
    })),
    metadata: {
      actualizadoEn: new Date().toISOString(),
      fuente: 'Excel',
    },
  }
}

/**
 * MAIN
 */
async function main() {
  try {
    console.log('\n' + '='.repeat(80))
    log(colors.cyan, '🚀', 'CARGA DE DATOS REALES DEL EXCEL A FIRESTORE')
    console.log('='.repeat(80) + '\n')

    // 1. Leer datos del JSON
    const jsonPath = path.join(__dirname, '../src/data/datos_excel_reales_completos.json')
    log(colors.blue, '📂', `Leyendo archivo: ${jsonPath}`)

    const contenido = await fs.readFile(jsonPath, 'utf-8')
    const datos = JSON.parse(contenido)

    log(colors.green, '✅', 'Archivo JSON cargado correctamente')
    log(
      colors.cyan,
      'ℹ',
      `Fuente: ${datos.metadata.fuente} | Extraído: ${datos.metadata.fechaExtraccion}`
    )

    console.log('\n' + '-'.repeat(80) + '\n')

    // 2. VENTAS
    log(colors.blue, '📊', 'CARGANDO VENTAS')
    await limpiarColeccion('ventas')
    await subirEnBatch('ventas', datos.controlMaestro, transformarVenta)

    console.log('\n' + '-'.repeat(80) + '\n')

    // 3. GASTOS Y ABONOS (GYA)
    log(colors.blue, '💰', 'CARGANDO GASTOS Y ABONOS')
    await limpiarColeccion('gastosAbonos')
    await subirEnBatch('gastosAbonos', datos.tablaGYA, transformarGYA)

    console.log('\n' + '-'.repeat(80) + '\n')

    // 4. CLIENTES
    log(colors.blue, '👥', 'CARGANDO CLIENTES')
    await limpiarColeccion('clientes')
    await subirEnBatch('clientes', datos.clientes, transformarCliente)

    console.log('\n' + '-'.repeat(80) + '\n')

    // 5. DISTRIBUIDORES
    log(colors.blue, '🚚', 'CARGANDO DISTRIBUIDORES')
    await limpiarColeccion('distribuidores')
    await subirEnBatch('distribuidores', datos.distribuidores, transformarDistribuidor)

    console.log('\n' + '-'.repeat(80) + '\n')

    // 6. BANCOS (RF Actual de cada panel)
    log(colors.blue, '🏦', 'CARGANDO BANCOS')
    await limpiarColeccion('bancos')

    const bancos = [
      { nombre: 'Bóveda Monte', id: 'boveda-monte', rf: datos.rfActual.bovedas.bovedaMonte },
      { nombre: 'Bóveda USA', id: 'boveda-usa', rf: datos.rfActual.bovedas.bovedaUsa },
      { nombre: 'Flete Sur', id: 'fletes', rf: datos.rfActual.bovedas.fleteSur },
      { nombre: 'Utilidades', id: 'utilidades', rf: datos.rfActual.bovedas.utilidades },
      { nombre: 'Azteca', id: 'azteca', rf: datos.rfActual.bovedas.azteca },
      { nombre: 'Leftie', id: 'leftie', rf: datos.rfActual.bovedas.leftie },
      { nombre: 'Profit', id: 'profit', rf: datos.rfActual.bovedas.profit },
    ]

    for (const banco of bancos) {
      const bancoDoc = crearBanco(banco.nombre, banco.id, banco.rf)
      const docRef = doc(db, 'bancos', banco.id)
      const batch = writeBatch(db)
      batch.set(docRef, bancoDoc)
      await batch.commit()
      log(colors.green, '  ✅', `${banco.nombre}: $${banco.rf.toLocaleString()}`)
    }

    console.log('\n' + '-'.repeat(80) + '\n')

    // 7. ALMACÉN
    log(colors.blue, '📦', 'CARGANDO ALMACÉN')
    await limpiarColeccion('almacen')

    const almacenDoc = crearAlmacen(datos.rfActual.bovedas.almacenMonte)
    const almacenRef = doc(db, 'almacen', 'almacen-monte')
    const batch = writeBatch(db)
    batch.set(almacenRef, almacenDoc)
    await batch.commit()
    log(colors.green, '  ✅', `Almacén Monte: ${datos.rfActual.bovedas.almacenMonte} unidades`)

    console.log('\n' + '='.repeat(80))
    log(colors.green, '🎉', 'CARGA COMPLETADA EXITOSAMENTE')
    console.log('='.repeat(80) + '\n')

    // Resumen
    log(colors.cyan, '📊', 'RESUMEN:')
    log(colors.cyan, '  •', `Ventas: ${datos.controlMaestro.length} registros`)
    log(colors.cyan, '  •', `Gastos/Abonos: ${datos.tablaGYA.length} registros`)
    log(colors.cyan, '  •', `Clientes: ${datos.clientes.length} registros`)
    log(colors.cyan, '  •', `Distribuidores: ${datos.distribuidores.length} registros`)
    log(colors.cyan, '  •', `Bancos: ${bancos.length} paneles`)
    log(colors.cyan, '  •', `Almacén: 1 panel`)
    log(
      colors.cyan,
      '  •',
      `Total Sistema: $${datos.rfActual.totalSistema.toLocaleString()}`
    )

    console.log('\n' + '='.repeat(80))
    log(colors.green, '✅', 'Todos los datos están listos en Firestore')
    log(colors.cyan, '💡', 'Ahora puedes iniciar el servidor: npm run dev')
    console.log('='.repeat(80) + '\n')

    process.exit(0)
  } catch (error) {
    console.error('\n' + '='.repeat(80))
    log(colors.red, '❌', 'ERROR EN LA CARGA DE DATOS')
    console.error(error)
    console.log('='.repeat(80) + '\n')
    process.exit(1)
  }
}

main()
