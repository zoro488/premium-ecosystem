/**
 * CLIENTES - ANÁLISIS Y DATOS
 */
import { ventasLocalesData } from './ventasLocales';

/**
 * @typedef {Object} Cliente
 * @property {string} id
 * @property {string} nombre
 * @property {number} totalCompras
 * @property {number} totalIngresos
 * @property {number} numeroOrdenes
 * @property {Date} ultimaCompra
 * @property {'Activo' | 'Inactivo'} estatus
 * @property {'VIP' | 'Regular' | 'Nuevo'} categoria
 * @property {number} totalComprado
 * @property {number} totalAbonado
 * @property {number} adeudo
 * @property {'activo' | 'saldado'} estado
 * @property {string} [observaciones]
 */

// Generar análisis de clientes desde ventasLocales
export const generarAnalisisClientes = () => {
  const clientesMap = new Map();

  ventasLocalesData.forEach((venta) => {
    const clienteExistente = clientesMap.get(venta.cliente);

    if (clienteExistente) {
      clienteExistente.totalCompras += venta.cantidad;
      clienteExistente.totalIngresos += venta.ingreso;
      clienteExistente.numeroOrdenes += 1;
      clienteExistente.ultimaCompra = venta.fecha;

      // Actualizar propiedades adicionales
      clienteExistente.totalComprado += venta.ingreso;
      clienteExistente.totalAbonado += Math.random() * venta.ingreso * 0.5; // Simulado
      clienteExistente.adeudo = clienteExistente.totalComprado - clienteExistente.totalAbonado;
      clienteExistente.estado = clienteExistente.adeudo < 100 ? 'saldado' : 'activo';

      // Actualizar categoría
      if (clienteExistente.totalIngresos > 50000) {
        clienteExistente.categoria = 'VIP';
      } else if (clienteExistente.totalIngresos > 15000) {
        clienteExistente.categoria = 'Premium';
      }
    } else {
      clientesMap.set(venta.cliente, {
        id: `CLI_${clientesMap.size + 1}`,
        nombre: venta.cliente,
        totalCompras: venta.cantidad,
        totalIngresos: venta.ingreso,
        numeroOrdenes: 1,
        ultimaCompra: venta.fecha,
        estatus: 'Activo',
        categoria: 'Regular',
        // Propiedades adicionales para PanelClientesUltra
        totalComprado: venta.ingreso,
        totalAbonado: Math.random() * venta.ingreso * 0.8, // Simulado
        adeudo: venta.ingreso * (0.1 + Math.random() * 0.3), // Simulado
        estado: Math.random() > 0.7 ? 'saldado' : 'activo',
        observaciones: `Cliente desde ${venta.fecha.toLocaleDateString()}`,
      });
    }
  });

  const clientes = Array.from(clientesMap.values());

  // Categorizar clientes
  clientes.forEach((cliente) => {
    if (cliente.totalIngresos > 1000000) {
      cliente.categoria = 'VIP';
    } else if (cliente.numeroOrdenes === 1) {
      cliente.categoria = 'Nuevo';
    }
  });

  return clientes.sort((a, b) => b.totalIngresos - a.totalIngresos);
};

export const clientesData = generarAnalisisClientes();

export const estadisticasClientes = {
  totalClientes: clientesData.length,
  clientesVIP: clientesData.filter((c) => c.categoria === 'VIP').length,
  clientesRegulares: clientesData.filter((c) => c.categoria === 'Regular').length,
  clientesNuevos: clientesData.filter((c) => c.categoria === 'Nuevo').length,
  ventaTotalClientes: clientesData.reduce((sum, c) => sum + c.totalIngresos, 0),
};
