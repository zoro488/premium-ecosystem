/**
 * 🔄 HOOK DE SINCRONIZACIÓN AUTOMÁTICA
 * Sincroniza automáticamente transacciones entre paneles
 */
import { useCallback } from 'react';

import { useLocalStorage } from '../../../utils/storage';
import { STORAGE_KEYS } from '../constants/storageKeys';

export const useSyncTransactions = () => {
  const [utilidades, setUtilidades] = useLocalStorage(STORAGE_KEYS.FLOW_UTILIDADES, []);
  const [fletes, setFletes] = useLocalStorage(STORAGE_KEYS.FLOW_FLETES, []);
  const [gastosFletes, setGastosFletes] = useLocalStorage(STORAGE_KEYS.GASTOS_FLETES, []);
  const [ordenesAlmacen, setOrdenesAlmacen] = useLocalStorage(STORAGE_KEYS.ALMACEN_ORDENES, []);
  const [salidasAlmacen, setSalidasAlmacen] = useLocalStorage(STORAGE_KEYS.ALMACEN_SALIDAS, []);
  const [clientes, setClientes] = useLocalStorage(STORAGE_KEYS.FLOW_CLIENTES, []);

  /**
   * Sincroniza una venta a todos los paneles relevantes
   */
  const syncVenta = useCallback(
    (venta) => {
      try {
        // 1. Registrar salida en Almacén si tiene cantidad
        if (venta.cantidad && parseFloat(venta.cantidad) > 0) {
          const nuevaSalidaAlmacen = {
            id: `almacen_venta_${venta.id}_${Date.now()}`,
            fecha: venta.fecha || new Date().toISOString().split('T')[0],
            cliente: venta.cliente || 'Cliente General',
            cantidad: Math.abs(parseFloat(venta.cantidad) || 0),
            tipo: 'salida',
            estatus: 'completado',
            ventaId: venta.id,
            producto: venta.producto || 'Producto',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          setSalidasAlmacen([...salidasAlmacen, nuevaSalidaAlmacen]);
        }

        // 2. Agregar ingreso a Utilidades
        const nuevaUtilidad = {
          id: `util_venta_${venta.id}_${Date.now()}`,
          fecha: venta.fecha || new Date().toISOString(),
          tipo: 'Ingreso',
          concepto: `Venta ${venta.cliente || venta.id}`,
          cliente: venta.cliente,
          valor: Math.abs(parseFloat(venta.total) || 0),
          categoria: 'Ventas',
          destino: venta.banco || 'bovedaMonte',
          observaciones: `Venta automática ID: ${venta.id}`,
          ventaRelacionada: venta.id,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        setUtilidades([...utilidades, nuevaUtilidad]);

        // 3. NUEVA LÓGICA: Si aplica flete, registrar en Transacciones_Fletes
        const aplicaFlete = venta.aplicaFlete === true || venta.fleteVenta === 'Aplica';

        if (aplicaFlete && venta.cantidad && parseFloat(venta.cantidad) > 0) {
          const cantidadVendida = Math.abs(parseFloat(venta.cantidad) || 0);
          const precioVentaUnidad = parseFloat(venta.precioUnitario) || 500; // Default 500 USD
          const montoFleteGenerado = cantidadVendida * precioVentaUnidad;

          const transaccionFlete = {
            id: `flete_${venta.id}_${Date.now()}`,
            fecha: venta.fecha || new Date().toISOString().split('T')[0],
            ocRelacionada: venta.ocRelacionada || venta.id,
            cliente: venta.cliente || 'Cliente General',
            cantidadVendida,
            precioVentaUnidad,
            ingresoTotalVenta: Math.abs(parseFloat(venta.total) || 0),
            aplicaFlete: true,
            montoFleteGenerado,
            fleteUtilidad: montoFleteGenerado, // Por ahora igual, se puede calcular con gastos
            utilidadTotal: montoFleteGenerado,
            estatusVenta: venta.estatus || 'Pagado',
            concepto: venta.concepto || `Venta ${venta.cliente}`,
            ruta: venta.ruta || 'Sin especificar',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };

          setFletes([...fletes, transaccionFlete]);

          // Registrar ingreso de flete en Utilidades
          const ingresoFlete = {
            id: `util_ingreso_flete_${venta.id}_${Date.now()}`,
            fecha: venta.fecha || new Date().toISOString(),
            tipo: 'Ingreso',
            concepto: `Flete aplicado - ${venta.cliente || venta.id}`,
            cliente: venta.cliente,
            valor: montoFleteGenerado,
            categoria: 'Flete',
            destino: venta.banco || 'bovedaMonte',
            observaciones: `Flete automático: ${cantidadVendida} unidades × ${precioVentaUnidad} USD`,
            ventaRelacionada: venta.id,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };

          setUtilidades((prev) => [...prev, ingresoFlete]);
        }

        // 4. LEGACY: Flete manual si hay campo flete (mantener compatibilidad)
        else if (venta.flete && parseFloat(venta.flete) > 0) {
          const nuevoFlete = {
            id: `flete_venta_${venta.id}_${Date.now()}`,
            fecha: venta.fecha || new Date().toISOString(),
            proveedor: venta.proveedorFlete || 'Proveedor General',
            ruta: venta.ruta || 'Ruta estándar',
            gastoValor: Math.abs(parseFloat(venta.flete) || 0),
            gastoMoneda: venta.moneda || 'MXN',
            tcGasto: 1,
            pesoKg: parseFloat(venta.peso) || 0,
            volumenM3: parseFloat(venta.volumen) || 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };

          setFletes([...fletes, nuevoFlete]);

          // Agregar flete como gasto en utilidades
          const gastoFlete = {
            id: `util_flete_${venta.id}_${Date.now()}`,
            fecha: venta.fecha || new Date().toISOString(),
            tipo: 'Gasto',
            concepto: `Flete venta ${venta.cliente || venta.id}`,
            cliente: null,
            valor: -Math.abs(parseFloat(venta.flete) || 0),
            categoria: 'Fletes',
            destino: venta.banco || 'bovedaMonte',
            observaciones: `Flete de venta ID: ${venta.id}`,
            ventaRelacionada: venta.id,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };

          setUtilidades((prev) => [...prev, gastoFlete]);
        }

        return { success: true, message: '✅ Venta sincronizada (Almacén + Utilidades + Fletes)' };
      } catch (error) {
        return { success: false, message: `❌ Error: ${error.message}` };
      }
    },
    [utilidades, setUtilidades, fletes, setFletes, salidasAlmacen, setSalidasAlmacen]
  );

  /**
   * Sincroniza una compra
   */
  const syncCompra = useCallback(
    (compra) => {
      try {
        // 1. Registrar en Almacén si tiene cantidad
        if (compra.cantidad && parseFloat(compra.cantidad) > 0) {
          const nuevaOrdenAlmacen = {
            id: `almacen_compra_${compra.id}_${Date.now()}`,
            fecha: compra.fecha || new Date().toISOString().split('T')[0],
            distribuidor: compra.proveedor || compra.distribuidor || 'Proveedor General',
            cantidad: Math.abs(parseFloat(compra.cantidad) || 0),
            tipo: 'ingreso',
            estatus: 'completado',
            ordenCompraId: compra.id,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          setOrdenesAlmacen([...ordenesAlmacen, nuevaOrdenAlmacen]);
        }

        // 2. Registrar gasto en Utilidades
        const nuevaUtilidad = {
          id: `util_compra_${compra.id}_${Date.now()}`,
          fecha: compra.fecha || new Date().toISOString(),
          tipo: 'Gasto',
          concepto: `Compra ${compra.proveedor || compra.id}`,
          cliente: null,
          valor: -Math.abs(parseFloat(compra.total) || 0),
          categoria: 'Compras',
          destino: compra.banco || 'bovedaMonte',
          observaciones: `Compra automática ID: ${compra.id}`,
          ventaRelacionada: null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        setUtilidades([...utilidades, nuevaUtilidad]);

        return { success: true, message: '✅ Compra sincronizada (Almacén + Utilidades)' };
      } catch (error) {
        return { success: false, message: `❌ Error: ${error.message}` };
      }
    },
    [utilidades, setUtilidades, ordenesAlmacen, setOrdenesAlmacen]
  );

  /**
   * Sincroniza un movimiento de Bóveda Monte
   */
  const syncMovimientoBoveda = useCallback(
    (movimiento) => {
      try {
        const tipoUtilidad = movimiento.tipo === 'Entrada' ? 'Ingreso' : 'Gasto';
        const valor =
          movimiento.tipo === 'Entrada'
            ? Math.abs(parseFloat(movimiento.valor) || 0)
            : -Math.abs(parseFloat(movimiento.valor) || 0);

        const nuevaUtilidad = {
          id: `util_boveda_${movimiento.id}_${Date.now()}`,
          fecha: movimiento.fecha || new Date().toISOString(),
          tipo: tipoUtilidad,
          concepto: `Bóveda Monte: ${movimiento.concepto || movimiento.tipo}`,
          cliente: movimiento.producto || null,
          valor,
          categoria: 'Bóveda Monte',
          destino: 'bovedaMonte',
          observaciones: `Movimiento de bóveda ID: ${movimiento.id}`,
          ventaRelacionada: null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        setUtilidades([...utilidades, nuevaUtilidad]);

        return { success: true, message: '✅ Movimiento sincronizado' };
      } catch (error) {
        return { success: false, message: `❌ Error: ${error.message}` };
      }
    },
    [utilidades, setUtilidades]
  );

  /**
   * Sincroniza un pago o abono de cliente
   * Actualiza el estado del cliente y registra en Utilidades
   */
  const syncPago = useCallback(
    (pago) => {
      try {
        // 1. Actualizar estado del cliente
        if (pago.clienteId) {
          const clientesActualizados = clientes.map((cliente) => {
            if (cliente.id === pago.clienteId) {
              const nuevaDeuda = Math.max(
                0,
                (parseFloat(cliente.deuda) || 0) - (parseFloat(pago.monto) || 0)
              );
              const nuevosAbonos =
                (parseFloat(cliente.abonos) || 0) + (parseFloat(pago.monto) || 0);

              // Calcular nuevo estado basado en deuda y días de morosidad
              let nuevoEstado = 'Al Día';
              const diasMorosidad = parseInt(cliente.diasMorosidad, 10) || 0;

              if (nuevaDeuda > 0 && diasMorosidad > 60) {
                nuevoEstado = 'Crítico';
              } else if (nuevaDeuda > 0 && diasMorosidad > 30) {
                nuevoEstado = 'Moroso';
              } else if (nuevaDeuda > 0) {
                nuevoEstado = 'Pendiente';
              }

              return {
                ...cliente,
                deuda: nuevaDeuda,
                abonos: nuevosAbonos,
                estado: nuevoEstado,
                ultimoPago: {
                  fecha: pago.fecha || new Date().toISOString(),
                  monto: parseFloat(pago.monto) || 0,
                },
                updatedAt: new Date().toISOString(),
              };
            }
            return cliente;
          });

          setClientes(clientesActualizados);
        }

        // 2. Registrar ingreso en Utilidades
        const nuevaUtilidad = {
          id: `util_pago_${pago.id}_${Date.now()}`,
          fecha: pago.fecha || new Date().toISOString(),
          tipo: 'Ingreso',
          concepto: `Pago ${pago.tipo || 'cliente'}: ${pago.clienteNombre || pago.clienteId}`,
          cliente: pago.clienteNombre || pago.clienteId,
          valor: Math.abs(parseFloat(pago.monto) || 0),
          categoria: 'Pagos',
          destino: pago.banco || 'bovedaMonte',
          observaciones: `Pago de ${pago.tipo || 'cliente'} ID: ${pago.clienteId || pago.id}`,
          ventaRelacionada: pago.ventaId || null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        setUtilidades([...utilidades, nuevaUtilidad]);

        return {
          success: true,
          message: `✅ Pago sincronizado (Cliente actualizado + Utilidades)`,
        };
      } catch (error) {
        return { success: false, message: `❌ Error: ${error.message}` };
      }
    },
    [clientes, setClientes, utilidades, setUtilidades]
  );

  /**
   * Sincroniza un gasto de flete con conversión TC
   */
  const syncGastoFlete = useCallback(
    (gastoFlete) => {
      try {
        const tc = parseFloat(gastoFlete.tc) || 1;
        const gastoUSD = Math.abs(parseFloat(gastoFlete.gasto) || 0);
        const gastoMXN = tc > 0 ? gastoUSD * tc : 0;

        // 1. Registrar en Gastos Fletes
        const nuevoGastoFlete = {
          id: `gasto_flete_${Date.now()}`,
          fecha: gastoFlete.fecha || new Date().toISOString().split('T')[0],
          origen: gastoFlete.origen || 'Gasto Flete Sur',
          gasto: gastoUSD,
          tc,
          pesos: gastoMXN,
          destino: gastoFlete.destino || 'NA',
          concepto: gastoFlete.concepto || 'Gasto de flete',
          observaciones: gastoFlete.observaciones || '',
          categoria: gastoFlete.categoria || 'Operativo',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        setGastosFletes([...gastosFletes, nuevoGastoFlete]);

        // 2. Registrar en Utilidades
        const nuevaUtilidad = {
          id: `util_gasto_flete_${Date.now()}`,
          fecha: gastoFlete.fecha || new Date().toISOString(),
          tipo: 'Gasto',
          concepto: `Gasto Flete: ${gastoFlete.concepto || 'Sin concepto'}`,
          cliente: null,
          valor: -gastoUSD,
          categoria: gastoFlete.categoria || 'Operativo',
          destino: gastoFlete.destino || 'NA',
          observaciones: `TC: ${tc} | ${gastoMXN.toFixed(2)} MXN`,
          ventaRelacionada: null,
          tc,
          pesos: gastoMXN,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        setUtilidades([...utilidades, nuevaUtilidad]);

        return {
          success: true,
          message: '✅ Gasto de flete sincronizado (Gastos Fletes + Utilidades)',
        };
      } catch (error) {
        return { success: false, message: `❌ Error: ${error.message}` };
      }
    },
    [gastosFletes, setGastosFletes, utilidades, setUtilidades]
  );

  return {
    syncVenta,
    syncCompra,
    syncMovimientoBoveda,
    syncPago,
    syncGastoFlete,
  };
};
