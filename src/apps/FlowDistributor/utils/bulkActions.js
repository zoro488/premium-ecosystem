/**
 * Utilidades para operaciones bulk (masivas)
 * Maneja eliminaciones y exportaciones en batch
 */

/**
 * Elimina múltiples ventas del estado
 * @param {Array} ventas - Array de ventas
 * @param {Array} selectedIds - IDs de ventas a eliminar
 * @param {Function} onSuccess - Callback de éxito
 * @param {Function} onError - Callback de error
 * @returns {Array} - Nuevo array de ventas sin las eliminadas
 */
export const handleBulkDeleteVentas = (ventas, selectedIds, onSuccess, onError) => {
  try {
    if (!selectedIds || selectedIds.length === 0) {
      throw new Error('No hay elementos seleccionados');
    }

    const deletedCount = selectedIds.length;
    const updatedVentas = ventas.filter((venta) => !selectedIds.includes(venta.id));

    if (onSuccess) {
      onSuccess(`${deletedCount} venta(s) eliminada(s) exitosamente`);
    }

    return updatedVentas;
  } catch (error) {
    if (onError) {
      onError(error.message);
    }
    return ventas;
  }
};

/**
 * Elimina múltiples clientes del estado
 * @param {Array} clientes - Array de clientes
 * @param {Array} selectedIds - IDs de clientes a eliminar
 * @param {Function} onSuccess - Callback de éxito
 * @param {Function} onError - Callback de error
 * @returns {Array} - Nuevo array de clientes sin los eliminados
 */
export const handleBulkDeleteClientes = (clientes, selectedIds, onSuccess, onError) => {
  try {
    if (!selectedIds || selectedIds.length === 0) {
      throw new Error('No hay elementos seleccionados');
    }

    const deletedCount = selectedIds.length;
    const updatedClientes = clientes.filter((cliente) => !selectedIds.includes(cliente.nombre));

    if (onSuccess) {
      onSuccess(`${deletedCount} cliente(s) eliminado(s) exitosamente`);
    }

    return updatedClientes;
  } catch (error) {
    if (onError) {
      onError(error.message);
    }
    return clientes;
  }
};

/**
 * Exporta ventas seleccionadas a CSV
 * @param {Array} ventas - Array de ventas
 * @param {Array} selectedIds - IDs de ventas a exportar
 * @param {Function} onSuccess - Callback de éxito
 * @param {Function} onError - Callback de error
 */
export const handleBulkExportVentas = (ventas, selectedIds, onSuccess, onError) => {
  try {
    if (!selectedIds || selectedIds.length === 0) {
      throw new Error('No hay elementos seleccionados');
    }

    const ventasToExport = ventas.filter((venta) => selectedIds.includes(venta.id));

    // Crear contenido CSV
    let csvContent = 'ID,Cliente,Fecha,Total,Estado Pago,Productos\n';
    ventasToExport.forEach((venta) => {
      const productos = venta.productos.map((p) => `${p.nombre}(${p.cantidad})`).join(';');
      csvContent += `${venta.id},"${venta.cliente}","${venta.fecha}",${venta.totalVenta},"${venta.estadoPago}","${productos}"\n`;
    });

    // Descargar archivo
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ventas_export_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    if (onSuccess) {
      onSuccess(`${ventasToExport.length} venta(s) exportada(s) exitosamente`);
    }
  } catch (error) {
    if (onError) {
      onError(error.message);
    }
  }
};

/**
 * Exporta clientes seleccionados a CSV
 * @param {Array} clientes - Array de clientes
 * @param {Array} selectedIds - IDs de clientes a exportar
 * @param {Function} onSuccess - Callback de éxito
 * @param {Function} onError - Callback de error
 */
export const handleBulkExportClientes = (clientes, selectedIds, onSuccess, onError) => {
  try {
    if (!selectedIds || selectedIds.length === 0) {
      throw new Error('No hay elementos seleccionados');
    }

    const clientesToExport = clientes.filter((cliente) => selectedIds.includes(cliente.nombre));

    // Crear contenido CSV
    let csvContent = 'Nombre,Total Ventas,Adeudo,Estado\n';
    clientesToExport.forEach((cliente) => {
      const totalVentas = cliente.ventas.reduce((sum, v) => sum + (v.totalVenta || 0), 0);
      csvContent += `"${cliente.nombre}",${totalVentas},${cliente.adeudo},"${cliente.adeudo > 0 ? 'Con adeudo' : 'Al corriente'}"\n`;
    });

    // Descargar archivo
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `clientes_export_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    if (onSuccess) {
      onSuccess(`${clientesToExport.length} cliente(s) exportado(s) exitosamente`);
    }
  } catch (error) {
    if (onError) {
      onError(error.message);
    }
  }
};

export default {
  handleBulkDeleteVentas,
  handleBulkDeleteClientes,
  handleBulkExportVentas,
  handleBulkExportClientes,
};
