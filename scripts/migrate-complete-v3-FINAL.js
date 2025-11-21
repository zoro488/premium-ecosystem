/**
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║           MIGRACIÓN COMPLETA V3 - TODAS LAS COLECCIONES                    ║
 * ║                                                                            ║
 * ║  COLECCIONES INCLUIDAS:                                                    ║
 * ║  ✅ control_maestro (Ventas completas)                                     ║
 * ║  ✅ tabla_gya (Gastos y Abonos)                                            ║
 * ║  ✅ distribuidores (Órdenes de compra)                                     ║
 * ║  ✅ clientes (Clientes)                                                    ║
 * ║  ✅ almacen_monte (Almacén)                                                ║
 * ║  ✅ data_adicional (Datos adicionales)                                     ║
 * ║  ✅ rf_actual (Estado actual del sistema)                                  ║
 * ║                                                                            ║
 * ║  BANCOS (Ingresos + Gastos + Transferencias):                             ║
 * ║  ✅ boveda_monte_ingresos, boveda_monte_gastos, boveda_monte_transferencias║
 * ║  ✅ boveda_usa_ingresos, boveda_usa_gastos, boveda_usa_transferencias      ║
 * ║  ✅ azteca_ingresos, azteca_gastos, azteca_transferencias                  ║
 * ║  ✅ utilidades_ingresos, utilidades_gastos, utilidades_transferencias      ║
 * ║  ✅ flete_sur_ingresos, flete_sur_gastos, flete_sur_transferencias         ║
 * ║  ✅ leftie_ingresos, leftie_gastos, leftie_transferencias                  ║
 * ║  ✅ profit_ingresos, profit_gastos, profit_transferencias                  ║
 * ║                                                                            ║
 * ║  NUEVAS COLECCIONES AGREGADAS:                                             ║
 * ║  🆕 productos (Catálogo de productos)                                      ║
 * ║  🆕 stock_actual (Inventario actual en tiempo real)                        ║
 * ║  🆕 movimientos_almacen (Historial de movimientos)                         ║
 * ║  🆕 ordenes_compra (Órdenes a proveedores)                                 ║
 * ║  🆕 pagos_clientes (Pagos recibidos de clientes)                           ║
 * ║  🆕 pagos_distribuidores (Pagos realizados a distribuidores)               ║
 * ║  🆕 cortes_caja (Cortes de caja diarios)                                   ║
 * ║  🆕 ajustes_inventario (Ajustes manuales de inventario)                    ║
 * ║  🆕 usuarios (Usuarios del sistema)                                        ║
 * ║  🆕 configuracion (Configuración del sistema)                              ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */
import { initializeApp } from 'firebase/app';
import { collection, doc, getFirestore, serverTimestamp, writeBatch } from 'firebase/firestore';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ==================== CONFIGURACIÓN FIREBASE ====================
const firebaseConfig = {
  apiKey: 'AIzaSyDN82KFpPJGfzUDgU4wB7rLVJHLCn6DKM8',
  authDomain: 'premium-ecosystem-1760790572.firebaseapp.com',
  projectId: 'premium-ecosystem-1760790572',
  storageBucket: 'premium-ecosystem-1760790572.firebasestorage.app',
  messagingSenderId: '1025668867803',
  appId: '1:1025668867803:web:f8eef72d2ff2b52bd8f394',
  measurementId: 'G-FDH6XLGQR4',
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ==================== CARGAR DATOS ====================
const jsonPath = path.join(__dirname, '../src/data/datos_excel_reales_completos.json');
const rawData = fs.readFileSync(jsonPath, 'utf8');
const data = JSON.parse(rawData);

console.log('\n');
console.log('╔════════════════════════════════════════════════════════════════════════════╗');
console.log('║        🚀 MIGRACIÓN COMPLETA V3 - TODAS LAS COLECCIONES 🚀                ║');
console.log('╚════════════════════════════════════════════════════════════════════════════╝');
console.log(`\n📁 Fuente: ${data.metadata.fuente}`);
console.log(`📅 Extracción: ${data.metadata.fechaExtraccion}`);
console.log(`📊 Total hojas: ${data.metadata.totalHojas}\n`);

// ==================== ESTADÍSTICAS ====================
const stats = {
  totalCollections: 0,
  totalDocuments: 0,
  collections: {},
  errors: [],
  startTime: Date.now(),
};

// ==================== HELPER: BATCH WRITE ====================
async function batchWrite(collectionName, documents, idField = 'id') {
  if (!documents || documents.length === 0) {
    console.log(`   📭 ${collectionName}: Sin datos, omitiendo...`);
    return 0;
  }

  console.log(`\n📦 Migrando ${collectionName}...`);
  console.log(`   └─ ${documents.length} documentos`);

  const collectionRef = collection(db, collectionName);
  let batch = writeBatch(db);
  let count = 0;
  let batchCount = 0;

  for (const document of documents) {
    const docId = document[idField] || `${collectionName}_${count}`;
    const docRef = doc(collectionRef, docId.toString());

    // Limpiar datos
    const cleanedDoc = Object.entries(document).reduce((acc, [key, value]) => {
      if (key !== '' && value !== undefined && value !== null && value !== '') {
        acc[key] = value;
      }
      return acc;
    }, {});

    const docData = {
      ...cleanedDoc,
      createdAt: serverTimestamp(),
      migratedAt: serverTimestamp(),
      source: 'excel_migration_v3',
    };

    batch.set(docRef, docData);
    count++;
    batchCount++;

    if (batchCount >= 500) {
      await batch.commit();
      batch = writeBatch(db);
      batchCount = 0;
      console.log(`   ├─ ${count}/${documents.length} documentos migrados...`);
    }
  }

  if (batchCount > 0) {
    await batch.commit();
  }

  console.log(`   ✅ ${count} documentos migrados exitosamente`);
  stats.collections[collectionName] = count;
  stats.totalDocuments += count;
  stats.totalCollections++;

  return count;
}

// ==================== HELPER: CREAR COLECCIÓN DESDE ARRAY ====================
async function crearColeccionDesdeArray(collectionName, dataArray, idField = 'id') {
  return await batchWrite(collectionName, dataArray, idField);
}

// ==================== HELPER: EXTRAER TRANSFERENCIAS ====================
function extraerTransferencias() {
  const transferencias = [];
  let idCounter = 1;

  // Extraer transferencias del data_adicional
  if (data.dataAdicional && Array.isArray(data.dataAdicional)) {
    data.dataAdicional.forEach((item) => {
      // Identificar transferencias (tienen origen y destino)
      if (item.Concepto && item.Concepto.toLowerCase().includes('transferencia')) {
        const transferencia = {
          id: `trans_${idCounter++}`,
          fecha: item.Fecha || new Date().toISOString(),
          concepto: item.Concepto || 'Transferencia',
          monto: parseFloat(item.Monto || item.Ingreso || item.Gasto || 0),
          bancoOrigen: determinarBancoOrigen(item),
          bancoDestino: determinarBancoDestino(item),
          tipo: 'transferencia_bancaria',
          estatus: 'completada',
          observaciones: item.Observaciones || '',
        };
        transferencias.push(transferencia);
      }
    });
  }

  return transferencias;
}

function determinarBancoOrigen(item) {
  // Lógica para determinar banco origen desde el concepto o panel
  if (item.Panel) return item.Panel.toLowerCase().replace(/\s+/g, '_');
  if (item.Concepto && item.Concepto.includes('Profit')) return 'profit';
  if (item.Concepto && item.Concepto.includes('Monte')) return 'boveda_monte';
  if (item.Concepto && item.Concepto.includes('USA')) return 'boveda_usa';
  return 'profit'; // default
}

function determinarBancoDestino(item) {
  // Lógica para determinar banco destino
  if (item.Observaciones && item.Observaciones.includes('Azteca')) return 'azteca';
  if (item.Observaciones && item.Observaciones.includes('Utilidades')) return 'utilidades';
  if (item.Observaciones && item.Observaciones.includes('Flete')) return 'flete_sur';
  if (item.Observaciones && item.Observaciones.includes('Leftie')) return 'leftie';
  return 'boveda_monte'; // default
}

// ==================== HELPER: CREAR PRODUCTOS ====================
function crearProductos() {
  const productos = [
    {
      id: 'prod_001',
      codigo: 'PROD-001',
      nombre: 'Producto Principal',
      descripcion: 'Producto principal de distribución',
      categoria: 'principal',
      unidadMedida: 'unidad',
      precioCompra: 6300.0,
      precioVenta: 7000.0,
      stock: 0,
      stockMinimo: 50,
      stockMaximo: 1000,
      activo: true,
    },
  ];
  return productos;
}

// ==================== HELPER: CREAR STOCK ACTUAL ====================
function crearStockActual() {
  // Calcular stock actual desde almacen_monte
  const stockActual = [];

  if (data.almacenMonte && Array.isArray(data.almacenMonte)) {
    const stockPorProducto = {};

    data.almacenMonte.forEach((movimiento) => {
      const productoId = 'prod_001'; // Por ahora un solo producto
      if (!stockPorProducto[productoId]) {
        stockPorProducto[productoId] = {
          id: `stock_${productoId}`,
          productoId,
          productoCodigo: 'PROD-001',
          productoNombre: 'Producto Principal',
          cantidad: 0,
          ubicacion: 'Almacén Monte',
          ultimoMovimiento: null,
        };
      }

      // Sumar o restar según el tipo de movimiento
      const cantidad = parseFloat(movimiento.Cantidad || movimiento['Stock Actual'] || 0);
      if (movimiento.Tipo === 'entrada' || movimiento.Ingreso) {
        stockPorProducto[productoId].cantidad += cantidad;
      } else if (movimiento.Tipo === 'salida' || movimiento.Gasto) {
        stockPorProducto[productoId].cantidad -= cantidad;
      }

      stockPorProducto[productoId].ultimoMovimiento = movimiento.Fecha;
    });

    stockActual.push(...Object.values(stockPorProducto));
  }

  // Si no hay datos, crear stock inicial
  if (stockActual.length === 0) {
    stockActual.push({
      id: 'stock_prod_001',
      productoId: 'prod_001',
      productoCodigo: 'PROD-001',
      productoNombre: 'Producto Principal',
      cantidad: 0,
      ubicacion: 'Almacén Monte',
      ultimoMovimiento: new Date().toISOString(),
    });
  }

  return stockActual;
}

// ==================== HELPER: CREAR MOVIMIENTOS ALMACÉN ====================
function crearMovimientosAlmacen() {
  const movimientos = [];
  let idCounter = 1;

  if (data.almacenMonte && Array.isArray(data.almacenMonte)) {
    data.almacenMonte.forEach((mov) => {
      movimientos.push({
        id: `mov_alm_${idCounter++}`,
        fecha: mov.Fecha || new Date().toISOString(),
        tipo: mov.Tipo || (mov.Ingreso ? 'entrada' : 'salida'),
        productoId: 'prod_001',
        cantidad: parseFloat(mov.Cantidad || mov['Stock Actual'] || 0),
        concepto: mov.Concepto || 'Movimiento de almacén',
        referencia: mov.Referencia || '',
        responsable: mov.Responsable || 'Sistema',
        observaciones: mov.Observaciones || '',
      });
    });
  }

  return movimientos;
}

// ==================== HELPER: CREAR ÓRDENES DE COMPRA ====================
function crearOrdenesCompra() {
  const ordenes = [];
  let idCounter = 1;

  if (data.distribuidores && Array.isArray(data.distribuidores)) {
    // Agrupar por OC
    const ordenesPorOC = {};

    data.distribuidores.forEach((dist) => {
      const oc = dist.OC || dist.oc || `OC${String(idCounter).padStart(4, '0')}`;

      if (!ordenesPorOC[oc]) {
        ordenesPorOC[oc] = {
          id: `oc_${idCounter++}`,
          numeroOC: oc,
          fecha: dist.Fecha || new Date().toISOString(),
          distribuidor: dist.Distribuidores || dist.Distribuidor || 'Sin especificar',
          productos: [],
          total: 0,
          estatus: dist.Estatus || 'pendiente',
          observaciones: dist.Observaciones || '',
        };
      }

      ordenesPorOC[oc].productos.push({
        productoId: 'prod_001',
        cantidad: parseFloat(dist.Cantidad || 0),
        precioUnitario: parseFloat(dist['Precio Unitario'] || dist.Precio || 6300),
        subtotal: parseFloat(dist.Total || dist.Subtotal || 0),
      });

      ordenesPorOC[oc].total += parseFloat(dist.Total || dist.Subtotal || 0);
    });

    ordenes.push(...Object.values(ordenesPorOC));
  }

  return ordenes;
}

// ==================== HELPER: CREAR PAGOS CLIENTES ====================
function crearPagosClientes() {
  const pagos = [];
  let idCounter = 1;

  if (data.clientes && Array.isArray(data.clientes)) {
    data.clientes.forEach((cliente) => {
      if (cliente.Monto && parseFloat(cliente.Monto) > 0) {
        pagos.push({
          id: `pago_cli_${idCounter++}`,
          fecha: cliente.Fecha || new Date().toISOString(),
          clienteId: cliente.id || `cliente_${idCounter}`,
          clienteNombre: cliente.Cliente || 'Cliente desconocido',
          monto: parseFloat(cliente.Monto || 0),
          formaPago: cliente['Forma de Pago'] || 'efectivo',
          referencia: cliente.Referencia || '',
          concepto: cliente.Concepto || 'Pago de cliente',
          estatus: 'aplicado',
        });
      }
    });
  }

  return pagos;
}

// ==================== HELPER: CREAR PAGOS DISTRIBUIDORES ====================
function crearPagosDistribuidores() {
  const pagos = [];
  let idCounter = 1;

  if (data.distribuidores && Array.isArray(data.distribuidores)) {
    const pagosPorDistribuidor = {};

    data.distribuidores.forEach((dist) => {
      const distribuidorNombre = dist.Distribuidores || dist.Distribuidor || 'Sin especificar';

      if (!pagosPorDistribuidor[distribuidorNombre]) {
        pagosPorDistribuidor[distribuidorNombre] = [];
      }

      if (dist.Total && parseFloat(dist.Total) > 0 && dist.Estatus === 'pagado') {
        pagosPorDistribuidor[distribuidorNombre].push({
          id: `pago_dist_${idCounter++}`,
          fecha: dist['Fecha de Pago'] || dist.Fecha || new Date().toISOString(),
          distribuidorId: dist.id || `dist_${idCounter}`,
          distribuidorNombre,
          monto: parseFloat(dist.Total || 0),
          ordenCompraId: dist.OC || '',
          formaPago: dist['Forma de Pago'] || 'transferencia',
          referencia: dist.Referencia || '',
          estatus: 'pagado',
        });
      }
    });

    Object.values(pagosPorDistribuidor).forEach((pagosArray) => {
      pagos.push(...pagosArray);
    });
  }

  return pagos;
}

// ==================== HELPER: CREAR CORTES DE CAJA ====================
function crearCortesCaja() {
  const cortes = [];
  // Por ahora solo crear corte inicial
  cortes.push({
    id: 'corte_001',
    fecha: new Date().toISOString(),
    fechaInicio: new Date(new Date().setHours(0, 0, 0, 0)).toISOString(),
    fechaFin: new Date(new Date().setHours(23, 59, 59, 999)).toISOString(),
    totalIngresos: 0,
    totalGastos: 0,
    saldoInicial: 0,
    saldoFinal: 0,
    diferencia: 0,
    responsable: 'Sistema',
    observaciones: 'Corte inicial del sistema',
    estatus: 'abierto',
  });

  return cortes;
}

// ==================== HELPER: CREAR AJUSTES INVENTARIO ====================
function crearAjustesInventario() {
  const ajustes = [];
  // Colección vacía inicialmente
  return ajustes;
}

// ==================== HELPER: CREAR USUARIOS ====================
function crearUsuarios() {
  const usuarios = [
    {
      id: 'user_admin',
      uid: 'admin_chronos',
      email: 'admin@chronos.com',
      displayName: 'Administrador',
      role: 'admin',
      permissions: ['read', 'write', 'delete', 'admin'],
      activo: true,
      fechaRegistro: new Date().toISOString(),
    },
  ];

  return usuarios;
}

// ==================== HELPER: CREAR CONFIGURACIÓN ====================
function crearConfiguracion() {
  const config = [
    {
      id: 'config_general',
      nombreEmpresa: 'CHRONOS System',
      timezone: 'America/Mexico_City',
      moneda: 'MXN',
      idioma: 'es',
      iva: 16,
      configuracionBancos: {
        boveda_monte: { nombre: 'Bóveda Monte', activo: true },
        boveda_usa: { nombre: 'Bóveda USA', activo: true },
        azteca: { nombre: 'Azteca', activo: true },
        utilidades: { nombre: 'Utilidades', activo: true },
        flete_sur: { nombre: 'Flete Sur', activo: true },
        leftie: { nombre: 'Leftie', activo: true },
        profit: { nombre: 'Profit', activo: true },
      },
      ultimaActualizacion: new Date().toISOString(),
    },
  ];

  return config;
}

// ==================== HELPER: SEPARAR INGRESOS Y GASTOS POR BANCO ====================
async function separarIngresosGastos(bancoNombre, bancoData) {
  if (!bancoData || !Array.isArray(bancoData)) {
    console.log(`   📭 ${bancoNombre}: Sin datos, omitiendo...`);
    return;
  }

  const ingresos = [];
  const gastos = [];
  let idIngreso = 1;
  let idGasto = 1;

  bancoData.forEach((item) => {
    // Determinar si es ingreso o gasto basado en las propiedades
    const tieneIngreso = item.Ingreso !== undefined && item.Ingreso !== null && item.Ingreso !== '';
    const tieneGasto = item.Gasto !== undefined && item.Gasto !== null && item.Gasto !== '';

    if (tieneIngreso && parseFloat(item.Ingreso || 0) > 0) {
      ingresos.push({
        id: item.id || `${bancoNombre}_ing_${idIngreso++}`,
        ...item,
        monto: parseFloat(item.Ingreso),
        tipo: 'ingreso',
      });
    }

    if (tieneGasto && parseFloat(item.Gasto || 0) > 0) {
      gastos.push({
        id: item.id || `${bancoNombre}_gas_${idGasto++}`,
        ...item,
        monto: parseFloat(item.Gasto),
        tipo: 'gasto',
      });
    }

    // Si no tiene ninguno, clasificar por lógica del concepto
    if (!tieneIngreso && !tieneGasto && item.Concepto) {
      const concepto = item.Concepto.toLowerCase();
      const monto = parseFloat(item.Monto || item.Total || 0);

      if (
        concepto.includes('ingreso') ||
        concepto.includes('deposito') ||
        concepto.includes('cobro') ||
        concepto.includes('venta')
      ) {
        ingresos.push({
          id: item.id || `${bancoNombre}_ing_${idIngreso++}`,
          ...item,
          monto,
          tipo: 'ingreso',
        });
      } else if (
        concepto.includes('gasto') ||
        concepto.includes('pago') ||
        concepto.includes('compra') ||
        concepto.includes('retiro')
      ) {
        gastos.push({
          id: item.id || `${bancoNombre}_gas_${idGasto++}`,
          ...item,
          monto,
          tipo: 'gasto',
        });
      }
    }
  });

  // Migrar ingresos y gastos
  await crearColeccionDesdeArray(`${bancoNombre}_ingresos`, ingresos, 'id');
  await crearColeccionDesdeArray(`${bancoNombre}_gastos`, gastos, 'id');
}

// ==================== HELPER: SEPARAR TRANSFERENCIAS POR BANCO ====================
function separarTransferenciasPorBanco(transferencias) {
  const bancos = [
    'boveda_monte',
    'boveda_usa',
    'azteca',
    'utilidades',
    'flete_sur',
    'leftie',
    'profit',
  ];
  const resultado = {};

  bancos.forEach((banco) => {
    resultado[`${banco}_transferencias`] = transferencias.filter(
      (t) => t.bancoOrigen === banco || t.bancoDestino === banco
    );
  });

  return resultado;
}

// ==================== MIGRACIÓN PRINCIPAL ====================
async function migrarTodo() {
  try {
    console.log('╔════════════════════════════════════════════════════════════════════════════╗');
    console.log('║                   FASE 1: COLECCIONES PRINCIPALES                          ║');
    console.log('╚════════════════════════════════════════════════════════════════════════════╝\n');

    // 1. Control Maestro (Ventas)
    await crearColeccionDesdeArray('control_maestro', data.controlMaestro, 'id');

    // 2. Tabla GYA
    await crearColeccionDesdeArray('tabla_gya', data.tablaGYA, 'id');

    // 3. Distribuidores
    await crearColeccionDesdeArray('distribuidores', data.distribuidores, 'id');

    // 4. Clientes
    await crearColeccionDesdeArray('clientes', data.clientes, 'id');

    // 5. Almacén Monte
    await crearColeccionDesdeArray('almacen_monte', data.almacenMonte, 'id');

    // 6. Data Adicional
    await crearColeccionDesdeArray('data_adicional', data.dataAdicional, 'id');

    // 7. RF Actual
    const rfActual = [
      {
        id: 'rf_actual',
        ...data.rfActual,
        ultimaActualizacion: new Date().toISOString(),
      },
    ];
    await crearColeccionDesdeArray('rf_actual', rfActual, 'id');

    console.log('\n╔════════════════════════════════════════════════════════════════════════════╗');
    console.log('║                   FASE 2: BANCOS (INGRESOS Y GASTOS)                       ║');
    console.log('╚════════════════════════════════════════════════════════════════════════════╝\n');

    // Bancos - Separar ingresos y gastos de cada banco
    await separarIngresosGastos('almacen_monte', data.almacenmonte);
    await separarIngresosGastos('boveda_monte', data.bovedamonte);
    await separarIngresosGastos('boveda_usa', data.bovedausa);
    await separarIngresosGastos('azteca', data.azteca);
    await separarIngresosGastos('utilidades', data.utilidades);
    await separarIngresosGastos('flete_sur', data.fletesur);
    await separarIngresosGastos('leftie', data.leftie);
    await separarIngresosGastos('profit', data.profit);

    console.log('\n╔════════════════════════════════════════════════════════════════════════════╗');
    console.log('║                   FASE 3: TRANSFERENCIAS BANCARIAS                         ║');
    console.log('╚════════════════════════════════════════════════════════════════════════════╝\n');

    // Extraer y separar transferencias
    const transferencias = extraerTransferencias();
    const transferenciasPorBanco = separarTransferenciasPorBanco(transferencias);

    for (const [collectionName, docs] of Object.entries(transferenciasPorBanco)) {
      await crearColeccionDesdeArray(collectionName, docs, 'id');
    }

    console.log('\n╔════════════════════════════════════════════════════════════════════════════╗');
    console.log('║                   FASE 4: NUEVAS COLECCIONES DE NEGOCIO                    ║');
    console.log('╚════════════════════════════════════════════════════════════════════════════╝\n');

    // Nuevas colecciones
    await crearColeccionDesdeArray('productos', crearProductos(), 'id');
    await crearColeccionDesdeArray('stock_actual', crearStockActual(), 'id');
    await crearColeccionDesdeArray('movimientos_almacen', crearMovimientosAlmacen(), 'id');
    await crearColeccionDesdeArray('ordenes_compra', crearOrdenesCompra(), 'id');
    await crearColeccionDesdeArray('pagos_clientes', crearPagosClientes(), 'id');
    await crearColeccionDesdeArray('pagos_distribuidores', crearPagosDistribuidores(), 'id');
    await crearColeccionDesdeArray('cortes_caja', crearCortesCaja(), 'id');
    await crearColeccionDesdeArray('ajustes_inventario', crearAjustesInventario(), 'id');

    console.log('\n╔════════════════════════════════════════════════════════════════════════════╗');
    console.log('║                   FASE 5: SISTEMA Y CONFIGURACIÓN                          ║');
    console.log('╚════════════════════════════════════════════════════════════════════════════╝\n');

    await crearColeccionDesdeArray('usuarios', crearUsuarios(), 'id');
    await crearColeccionDesdeArray('configuracion', crearConfiguracion(), 'id');

    // ==================== RESUMEN FINAL ====================
    const duration = ((Date.now() - stats.startTime) / 1000).toFixed(2);

    console.log('\n\n');
    console.log('╔════════════════════════════════════════════════════════════════════════════╗');
    console.log('║                         ✅ MIGRACIÓN COMPLETADA ✅                         ║');
    console.log('╚════════════════════════════════════════════════════════════════════════════╝');
    console.log(`\n⏱️  Tiempo total: ${duration}s`);
    console.log(`📚 Total colecciones: ${stats.totalCollections}`);
    console.log(`📄 Total documentos: ${stats.totalDocuments}\n`);

    console.log('📊 RESUMEN POR COLECCIÓN:');
    console.log('─'.repeat(80));

    const sortedCollections = Object.entries(stats.collections).sort((a, b) => b[1] - a[1]);

    sortedCollections.forEach(([name, count], index) => {
      const emoji = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '  ';
      console.log(`${emoji} ${name.padEnd(35)} ${String(count).padStart(6)} docs`);
    });

    if (stats.errors.length > 0) {
      console.log('\n⚠️  ERRORES ENCONTRADOS:');
      console.log('─'.repeat(80));
      stats.errors.forEach((error) => {
        console.log(`   ❌ ${error}`);
      });
    }

    console.log('\n✨ Sistema listo para usar con TODAS las colecciones necesarias ✨\n');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ ERROR EN MIGRACIÓN:', error);
    stats.errors.push(error.message);
    process.exit(1);
  }
}

// ==================== EJECUTAR ====================
migrarTodo();
