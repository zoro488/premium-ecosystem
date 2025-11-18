/**
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║        INICIALIZACIÓN DE COLECCIONES FIRESTORE - CHRONOS SYSTEM           ║
 * ║  Script para crear todas las colecciones necesarias con datos iniciales   ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */

const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// Inicializar Firebase Admin
const serviceAccount = require('../src/apps/FlowDistributor/chronos-system/gg/chronos-176d8-firebase-adminsdk-fbsvc-44c3e9f82c_Version2.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: 'chronos-176d8',
});

const db = admin.firestore();

// ============================================
// FUNCIONES AUXILIARES
// ============================================

const createTimestamp = (dateString) => {
  if (!dateString) return admin.firestore.Timestamp.now();

  // Formato: DD/MM/YYYY
  const [day, month, year] = dateString.split('/');
  const date = new Date(`${year}-${month}-${day}`);
  return admin.firestore.Timestamp.fromDate(date);
};

// ============================================
// 1. CREAR COLECCIÓN: BANCOS
// ============================================

async function initBancos() {
  console.log('📦 Inicializando colección: BANCOS...');

  const bancosData = [
    {
      id: 'boveda-monte',
      nombre: 'Bóveda Monte',
      tipo: 'principal',
      capitalActual: 0,
      historicoIngresos: 0,
      historicoGastos: 0,
      historicoTransferencias: 0,
      activo: true,
      createdAt: admin.firestore.Timestamp.now(),
      updatedAt: admin.firestore.Timestamp.now(),
    },
    {
      id: 'boveda-usa',
      nombre: 'Bóveda USA',
      tipo: 'principal',
      capitalActual: 128000,
      historicoIngresos: 128000,
      historicoGastos: 0,
      historicoTransferencias: 0,
      activo: true,
      createdAt: admin.firestore.Timestamp.now(),
      updatedAt: admin.firestore.Timestamp.now(),
    },
    {
      id: 'fletes',
      nombre: 'Fletes',
      tipo: 'operativo',
      capitalActual: 185000,
      historicoIngresos: 185000,
      historicoGastos: 0,
      historicoTransferencias: 0,
      activo: true,
      createdAt: admin.firestore.Timestamp.now(),
      updatedAt: admin.firestore.Timestamp.now(),
    },
    {
      id: 'utilidades',
      nombre: 'Utilidades',
      tipo: 'operativo',
      capitalActual: 102000,
      historicoIngresos: 102000,
      historicoGastos: 0,
      historicoTransferencias: 0,
      activo: true,
      createdAt: admin.firestore.Timestamp.now(),
      updatedAt: admin.firestore.Timestamp.now(),
    },
    {
      id: 'azteca',
      nombre: 'Azteca',
      tipo: 'externo',
      capitalActual: -178000,
      historicoIngresos: 0,
      historicoGastos: 178000,
      historicoTransferencias: 0,
      activo: true,
      createdAt: admin.firestore.Timestamp.now(),
      updatedAt: admin.firestore.Timestamp.now(),
    },
    {
      id: 'leftie',
      nombre: 'Leftie',
      tipo: 'externo',
      capitalActual: 45000,
      historicoIngresos: 45000,
      historicoGastos: 0,
      historicoTransferencias: 0,
      activo: true,
      createdAt: admin.firestore.Timestamp.now(),
      updatedAt: admin.firestore.Timestamp.now(),
    },
    {
      id: 'profit',
      nombre: 'Profit',
      tipo: 'externo',
      capitalActual: 12500000,
      historicoIngresos: 12500000,
      historicoGastos: 0,
      historicoTransferencias: 0,
      activo: true,
      createdAt: admin.firestore.Timestamp.now(),
      updatedAt: admin.firestore.Timestamp.now(),
    },
  ];

  const batch = db.batch();

  for (const banco of bancosData) {
    const ref = db.collection('bancos').doc(banco.id);
    batch.set(ref, banco);
  }

  await batch.commit();
  console.log('✅ Bancos creados: 7 bancos');
}

// ============================================
// 2. CREAR COLECCIÓN: CLIENTES
// ============================================

async function initClientes() {
  console.log('📦 Inicializando colección: CLIENTES...');

  // Leer datos de panel-clientes-manual_Version2.json
  const clientesPath = path.join(
    __dirname,
    '../src/apps/FlowDistributor/chronos-system/gg/panel-clientes-manual_Version2.json'
  );
  const clientesData = JSON.parse(fs.readFileSync(clientesPath, 'utf8'));

  const batch = db.batch();
  let count = 0;

  for (const cliente of clientesData.clientes) {
    if (!cliente.cliente || cliente.cliente.trim() === '') continue;

    const docId = `CLI-${String(count + 1).padStart(3, '0')}`;
    const ref = db.collection('clientes').doc(docId);

    batch.set(ref, {
      id: docId,
      nombre: cliente.cliente,
      descripcion: cliente.observaciones || 'Cliente registrado',
      deudaTotal: cliente.deuda || 0,
      abonosTotal: cliente.abonos || 0,
      saldoPendiente: cliente.pendiente || 0,
      activo: true,
      tipo: 'mayorista',
      createdAt: admin.firestore.Timestamp.now(),
      updatedAt: admin.firestore.Timestamp.now(),
    });

    count++;
  }

  await batch.commit();
  console.log(`✅ Clientes creados: ${count} clientes`);
}

// ============================================
// 3. CREAR COLECCIÓN: DISTRIBUIDORES
// ============================================

async function initDistribuidores() {
  console.log('📦 Inicializando colección: DISTRIBUIDORES...');

  const distribuidoresData = [
    {
      id: 'DIST-001',
      nombre: 'PACMAN',
      descripcion: 'Distribuidor principal de productos',
      contacto: '+52 612 123 4567',
      email: 'pacman@example.com',
      activo: true,
    },
    {
      id: 'DIST-002',
      nombre: 'Q-MAYA',
      descripcion: 'Distribuidor secundario',
      contacto: '+52 612 987 6543',
      email: 'qmaya@example.com',
      activo: true,
    },
  ];

  const batch = db.batch();

  for (const dist of distribuidoresData) {
    const ref = db.collection('distribuidores').doc(dist.id);
    batch.set(ref, {
      ...dist,
      createdAt: admin.firestore.Timestamp.now(),
      updatedAt: admin.firestore.Timestamp.now(),
    });
  }

  await batch.commit();
  console.log('✅ Distribuidores creados: 2 distribuidores');
}

// ============================================
// 4. CREAR COLECCIÓN: VENTAS
// ============================================

async function initVentas() {
  console.log('📦 Inicializando colección: VENTAS...');

  // Leer datos de panel-ventas-local-manual_Version2.json
  const ventasPath = path.join(
    __dirname,
    '../src/apps/FlowDistributor/chronos-system/gg/panel-ventas-local-manual_Version2.json'
  );
  const ventasData = JSON.parse(fs.readFileSync(ventasPath, 'utf8'));

  const batch = db.batch();
  let count = 0;

  for (const venta of ventasData.ventasLocal) {
    if (!venta.cliente) continue;

    const docId = `VEN-${String(count + 1).padStart(4, '0')}`;
    const ref = db.collection('ventas').doc(docId);

    const precioTotal = venta.precioVenta || 0;
    const precioCompra = venta.costo || 0;
    const flete = venta.flete || 500;
    const cantidad = venta.cantidad || 1;

    // Calcular distribución a bancos según fórmulas correctas
    const distribucionBovedaMonte = precioCompra * cantidad;
    const distribucionFletes = flete * cantidad;
    const distribucionUtilidades = (precioTotal - precioCompra - flete) * cantidad;

    batch.set(ref, {
      id: docId,
      numeroVenta: docId,
      fecha: createTimestamp(venta.fecha),
      clienteNombre: venta.cliente,
      productos: [
        {
          nombre: venta.producto || 'Producto',
          cantidad: cantidad,
          precioVenta: precioTotal,
          precioCompra: precioCompra,
          flete: flete,
        },
      ],
      precioTotal: precioTotal * cantidad,
      precioTotalVenta: (precioTotal + flete) * cantidad,
      estadoPago: venta.estadoPago || 'pendiente',
      montoPagado: venta.montoPagado || 0,
      montoRestante: venta.montoRestante || (precioTotal + flete) * cantidad,
      // Distribución a bancos
      distribucionBancos: {
        bovedaMonte: distribucionBovedaMonte,
        fletes: distribucionFletes,
        utilidades: distribucionUtilidades,
      },
      createdAt: admin.firestore.Timestamp.now(),
      updatedAt: admin.firestore.Timestamp.now(),
    });

    count++;

    // Firestore batch tiene límite de 500 operaciones
    if (count % 500 === 0) {
      await batch.commit();
      console.log(`  Procesadas ${count} ventas...`);
    }
  }

  if (count % 500 !== 0) {
    await batch.commit();
  }

  console.log(`✅ Ventas creadas: ${count} ventas`);
}

// ============================================
// 5. CREAR COLECCIÓN: ALMACEN
// ============================================

async function initAlmacen() {
  console.log('📦 Inicializando colección: ALMACEN...');

  // Leer datos de panel-almacen-monte-manual_Version2.json
  const almacenPath = path.join(
    __dirname,
    '../src/apps/FlowDistributor/chronos-system/gg/panel-almacen-monte-manual_Version2.json'
  );
  const almacenData = JSON.parse(fs.readFileSync(almacenPath, 'utf8'));

  const batch = db.batch();
  let count = 0;

  for (const item of almacenData.almacen) {
    if (!item.producto) continue;

    const docId = `ALM-${String(count + 1).padStart(4, '0')}`;
    const ref = db.collection('almacen').doc(docId);

    batch.set(ref, {
      id: docId,
      fecha: createTimestamp(item.fecha),
      producto: item.producto,
      tipo: item.tipo || 'entrada',
      cantidad: item.cantidad || 0,
      precioCompra: item.precioCompra || 0,
      precioVenta: item.precioVenta || 0,
      stockActual: item.stockActual || 0,
      ubicacion: item.ubicacion || 'Almacén Monte',
      activo: true,
      createdAt: admin.firestore.Timestamp.now(),
      updatedAt: admin.firestore.Timestamp.now(),
    });

    count++;

    if (count % 500 === 0) {
      await batch.commit();
      console.log(`  Procesados ${count} movimientos...`);
    }
  }

  if (count % 500 !== 0) {
    await batch.commit();
  }

  console.log(`✅ Movimientos de almacén creados: ${count} registros`);
}

// ============================================
// 6. CREAR COLECCIÓN: OPERACIONES_BANCOS
// ============================================

async function initOperacionesBancos() {
  console.log('📦 Inicializando colección: OPERACIONES_BANCOS...');

  // Leer datos de varios paneles de bancos
  const bovedaMontePath = path.join(
    __dirname,
    '../src/apps/FlowDistributor/chronos-system/gg/panel-boveda-monte-manual_Version2.json'
  );
  const bovedaMonteData = JSON.parse(fs.readFileSync(bovedaMontePath, 'utf8'));

  const batch = db.batch();
  let count = 0;

  // Ingresos de Bóveda Monte
  for (const ingreso of bovedaMonteData.bovedaMonte.ingresosList) {
    const docId = `OPE-${String(count + 1).padStart(5, '0')}`;
    const ref = db.collection('operaciones_bancos').doc(docId);

    batch.set(ref, {
      id: docId,
      bancoId: 'boveda-monte',
      bancoNombre: 'Bóveda Monte',
      tipo: 'ingreso',
      fecha: createTimestamp(ingreso.fecha),
      monto: ingreso.ingreso || 0,
      concepto: ingreso.concepto || `Ingreso de ${ingreso.cliente}`,
      cliente: ingreso.cliente,
      createdAt: admin.firestore.Timestamp.now(),
    });

    count++;

    if (count % 500 === 0) {
      await batch.commit();
      console.log(`  Procesadas ${count} operaciones...`);
    }
  }

  // Gastos de Bóveda Monte
  for (const gasto of bovedaMonteData.bovedaMonte.gastosList) {
    const docId = `OPE-${String(count + 1).padStart(5, '0')}`;
    const ref = db.collection('operaciones_bancos').doc(docId);

    batch.set(ref, {
      id: docId,
      bancoId: 'boveda-monte',
      bancoNombre: 'Bóveda Monte',
      tipo: 'gasto',
      fecha: createTimestamp(gasto.fecha),
      monto: gasto.gasto || 0,
      concepto: gasto.concepto || 'Gasto',
      createdAt: admin.firestore.Timestamp.now(),
    });

    count++;

    if (count % 500 === 0) {
      await batch.commit();
      console.log(`  Procesadas ${count} operaciones...`);
    }
  }

  if (count % 500 !== 0) {
    await batch.commit();
  }

  console.log(`✅ Operaciones bancarias creadas: ${count} operaciones`);
}

// ============================================
// FUNCIÓN PRINCIPAL
// ============================================

async function main() {
  try {
    console.log('\n🚀 INICIANDO CONFIGURACIÓN DE FIRESTORE - CHRONOS SYSTEM\n');
    console.log('═══════════════════════════════════════════════════════════\n');

    // Ejecutar inicialización de colecciones
    await initBancos();
    await initClientes();
    await initDistribuidores();
    await initVentas();
    await initAlmacen();
    await initOperacionesBancos();

    console.log('\n═══════════════════════════════════════════════════════════');
    console.log('✅ FIRESTORE CONFIGURADO CORRECTAMENTE');
    console.log('═══════════════════════════════════════════════════════════\n');
    console.log('📊 Resumen:');
    console.log('  • 7 Bancos creados');
    console.log('  • 31+ Clientes creados');
    console.log('  • 2 Distribuidores creados');
    console.log('  • 1000+ Ventas creadas');
    console.log('  • 500+ Movimientos de almacén creados');
    console.log('  • 1000+ Operaciones bancarias creadas');
    console.log('\n🎉 ¡Sistema listo para operar!\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error al inicializar Firestore:', error);
    process.exit(1);
  }
}

// Ejecutar
main();
