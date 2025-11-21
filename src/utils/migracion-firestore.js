/**
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║              SCRIPT DE MIGRACIÓN DATOS JSON → FIRESTORE                    ║
 * ║   Migra datos_excel_reales_completos.json a Firestore correctamente       ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */
import { collection, doc, runTransaction, serverTimestamp, writeBatch } from 'firebase/firestore';

import { db } from '../chronos-system/config/firebase';
import datosExcel from '../data/datos_excel_reales_completos.json';

/**
 * Migrar datos completos del JSON a Firestore
 */
export const migrarDatosCompletos = async () => {
  console.log('🚀 Iniciando migración de datos...');

  const resultados = {
    bancos: 0,
    distribuidores: 0,
    clientes: 0,
    ordenesCompra: 0,
    ventas: 0,
    movimientosAlmacen: 0,
    errores: [],
  };

  try {
    // 1. Migrar configuración inicial de bancos
    console.log('📊 Migrando configuración de bancos...');
    await migrarBancosIniciales();
    resultados.bancos = 6;

    // 2. Migrar Control Maestro (Ventas)
    console.log('💰 Migrando ventas del Control Maestro...');
    const ventasMigradas = await migrarControlMaestro(datosExcel.controlMaestro || []);
    resultados.ventas = ventasMigradas.length;
    resultados.clientes = new Set(ventasMigradas.map((v) => v.clienteId)).size;

    // 3. Migrar datos de cada banco (movimientos históricos)
    console.log('🏦 Migrando movimientos bancarios...');
    await migrarMovimientosBancos(datosExcel);

    console.log('✅ Migración completada con éxito!');
    console.log('📈 Resultados:', resultados);

    return resultados;
  } catch (error) {
    console.error('❌ Error en migración:', error);
    resultados.errores.push(error.message);
    throw error;
  }
};

/**
 * Migrar configuración inicial de bancos
 */
const migrarBancosIniciales = async () => {
  const bancos = [
    {
      id: 'bovedaMonte',
      nombre: 'Bóveda Monte',
      descripcion: 'Banco principal de ventas',
      tipo: 'operativo',
      color: '#3B82F6',
      icono: 'Vault',
      capitalActual: datosExcel.rfActual?.bovedas?.bovedaMonte || 0,
      activo: true,
    },
    {
      id: 'utilidades',
      nombre: 'Utilidades',
      descripcion: 'Banco de utilidades de ventas',
      tipo: 'operativo',
      color: '#10B981',
      icono: 'TrendingUp',
      capitalActual: datosExcel.rfActual?.bovedas?.utilidades || 0,
      activo: true,
    },
    {
      id: 'fletes',
      nombre: 'Flete Sur',
      descripcion: 'Banco de fletes',
      tipo: 'operativo',
      color: '#F59E0B',
      icono: 'Truck',
      capitalActual: datosExcel.rfActual?.bovedas?.fleteSur || 0,
      activo: true,
    },
    {
      id: 'azteca',
      nombre: 'Azteca',
      descripcion: 'Banco azteca',
      tipo: 'externo',
      color: '#8B5CF6',
      icono: 'Building2',
      capitalActual: datosExcel.rfActual?.bovedas?.azteca || 0,
      activo: true,
    },
    {
      id: 'leftie',
      nombre: 'Leftie',
      descripcion: 'Banco leftie',
      tipo: 'externo',
      color: '#EC4899',
      icono: 'Building2',
      capitalActual: datosExcel.rfActual?.bovedas?.leftie || 0,
      activo: true,
    },
    {
      id: 'profit',
      nombre: 'Profit',
      descripcion: 'Casa de cambio profit',
      tipo: 'externo',
      color: '#06B6D4',
      icono: 'DollarSign',
      capitalActual: datosExcel.rfActual?.bovedas?.profit || 0,
      activo: true,
    },
  ];

  const batch = writeBatch(db);

  for (const banco of bancos) {
    const bancoRef = doc(db, 'bancos', banco.id);
    batch.set(bancoRef, {
      ...banco,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    // Crear contador de banco
    const contadorRef = doc(db, 'contadoresBancos', banco.id);
    batch.set(contadorRef, {
      totalHistorico: banco.capitalActual,
      totalCapital: banco.capitalActual,
      totalIngresos: 0,
      totalGastos: 0,
      totalTransferencias: 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  }

  await batch.commit();
  console.log(`✅ Migrados ${bancos.length} bancos`);
};

/**
 * Migrar Control Maestro (Ventas)
 */
const migrarControlMaestro = async (controlMaestro) => {
  const ventasMigradas = [];
  const clientesMap = new Map();
  const distribuidoresMap = new Map();

  console.log(`📝 Procesando ${controlMaestro.length} registros del Control Maestro...`);

  for (let i = 0; i < controlMaestro.length; i++) {
    const registro = controlMaestro[i];

    try {
      await runTransaction(db, async (transaction) => {
        // 1. Crear/obtener cliente
        let clienteId = clientesMap.get(registro.cliente);

        if (!clienteId) {
          const clienteRef = doc(collection(db, 'clientes'));
          clienteId = clienteRef.id;

          transaction.set(clienteRef, {
            nombre: registro.cliente,
            tipo: 'regular',
            adeudoTotal: 0,
            totalComprado: 0,
            ventasRealizadas: 0,
            activo: true,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          });

          clientesMap.set(registro.cliente, clienteId);
        }

        // 2. Determinar estado de pago
        const estadoPago =
          registro.estatus === 'Pagado'
            ? 'pagado'
            : registro.estatus === 'Parcial'
              ? 'parcial'
              : 'pendiente';

        const montoPagado = estadoPago === 'pagado' ? registro.ingreso : 0;
        const saldoPendiente = registro.ingreso - montoPagado;

        // 3. Crear venta
        const ventaRef = doc(collection(db, 'ventas'));
        const ventaData = {
          folio: registro.id || `V-${String(i + 1).padStart(4, '0')}`,
          fecha: registro.fecha ? new Date(registro.fecha) : new Date(),
          clienteId,
          clienteNombre: registro.cliente,
          productos: [
            {
              productoId: null,
              nombre: 'Producto estándar',
              cantidad: registro.cantidad,
              precioUnitario: registro.precioVenta || 0,
              precioFlete: registro.fleteAplica === 'Aplica' ? 500 : 0,
              costoUnitario: registro.costoBovedaMonte / registro.cantidad || 0,
              subtotal: registro.ingreso,
              utilidad: registro.utilidad || 0,
              aplicaFlete: registro.fleteAplica === 'Aplica',
            },
          ],
          subtotal: registro.ingreso,
          total: registro.ingreso,
          totalFlete: registro.fleteUtilidad || 0,
          totalUtilidad: registro.utilidad || 0,
          precioFlete: 500,
          estadoPago,
          montoPagado,
          saldoPendiente,
          metodoPago: 'efectivo',
          notas: registro.concepto || '',
          panel: registro.panel || '',
          ordenCompraOrigen: registro.oc || null,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        };

        transaction.set(ventaRef, ventaData);

        // 4. Si hay adeudo, crear registro
        if (saldoPendiente > 0) {
          const adeudoRef = doc(collection(db, 'adeudosClientes'));
          transaction.set(adeudoRef, {
            clienteId,
            clienteNombre: registro.cliente,
            ventaId: ventaRef.id,
            ventaFolio: ventaData.folio,
            montoInicial: registro.ingreso,
            montoRestante: saldoPendiente,
            montoPagado,
            saldado: false,
            fechaCreacion: serverTimestamp(),
            createdAt: serverTimestamp(),
          });
        }

        // 5. Registrar en bancos si está pagado
        if (montoPagado > 0) {
          // Bóveda Monte
          const ingresoBovedaRef = doc(collection(db, 'ingresosBancos'));
          transaction.set(ingresoBovedaRef, {
            bancoId: 'bovedaMonte',
            bancoNombre: 'Bóveda Monte',
            tipo: 'venta',
            concepto: `Venta ${ventaData.folio}`,
            monto: montoPagado,
            estadoPago,
            ventaId: ventaRef.id,
            ventaFolio: ventaData.folio,
            clienteId,
            clienteNombre: registro.cliente,
            fecha: ventaData.fecha,
            createdAt: serverTimestamp(),
          });

          // Fletes
          if (ventaData.totalFlete > 0) {
            const ingresoFleteRef = doc(collection(db, 'ingresosBancos'));
            transaction.set(ingresoFleteRef, {
              bancoId: 'fletes',
              bancoNombre: 'Fletes',
              tipo: 'flete_venta',
              concepto: `Flete venta ${ventaData.folio}`,
              monto: ventaData.totalFlete,
              estadoPago,
              ventaId: ventaRef.id,
              ventaFolio: ventaData.folio,
              fecha: ventaData.fecha,
              createdAt: serverTimestamp(),
            });
          }

          // Utilidades
          if (ventaData.totalUtilidad > 0) {
            const ingresoUtilidadRef = doc(collection(db, 'ingresosBancos'));
            transaction.set(ingresoUtilidadRef, {
              bancoId: 'utilidades',
              bancoNombre: 'Utilidades',
              tipo: 'utilidad_venta',
              concepto: `Utilidad venta ${ventaData.folio}`,
              monto: ventaData.totalUtilidad,
              estadoPago,
              ventaId: ventaRef.id,
              ventaFolio: ventaData.folio,
              fecha: ventaData.fecha,
              createdAt: serverTimestamp(),
            });
          }
        }

        ventasMigradas.push({
          id: ventaRef.id,
          ...ventaData,
          clienteId,
        });
      });

      if ((i + 1) % 10 === 0) {
        console.log(`   Procesadas ${i + 1}/${controlMaestro.length} ventas...`);
      }
    } catch (error) {
      console.error(`Error procesando registro ${registro.id}:`, error);
    }
  }

  console.log(`✅ Migradas ${ventasMigradas.length} ventas`);
  return ventasMigradas;
};

/**
 * Migrar movimientos de bancos
 */
const migrarMovimientosBancos = async (datos) => {
  // TODO: Implementar migración de movimientos bancarios específicos
  // de cada hoja del Excel (gastos, transferencias, etc.)

  console.log('⏭️  Migración de movimientos bancarios pendiente de implementar');
};

/**
 * Verificar estado de la migración
 */
export const verificarMigracion = async () => {
  try {
    const [bancosSnap, ventasSnap, clientesSnap] = await Promise.all([
      getDocs(collection(db, 'bancos')),
      getDocs(collection(db, 'ventas')),
      getDocs(collection(db, 'clientes')),
    ]);

    return {
      bancos: bancosSnap.size,
      ventas: ventasSnap.size,
      clientes: clientesSnap.size,
      migrado: bancosSnap.size > 0 && ventasSnap.size > 0,
    };
  } catch (error) {
    console.error('Error verificando migración:', error);
    return {
      bancos: 0,
      ventas: 0,
      clientes: 0,
      migrado: false,
      error: error.message,
    };
  }
};

export default {
  migrarDatosCompletos,
  verificarMigracion,
};
