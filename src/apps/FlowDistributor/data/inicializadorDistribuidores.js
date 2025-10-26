/**
 * 🚀 INICIALIZADOR DE DISTRIBUIDORES
 * Sistema de gestión y registro de distribuidores
 */

/**
 * Inicializa el sistema de distribuidores
 * @returns {Array} Lista de distribuidores inicializados
 */
export const inicializarSistemaDistribuidores = () => {
  const distribuidoresIniciales = [];
  return distribuidoresIniciales;
};

/**
 * Registra un pago a un distribuidor
 * @param {string} distribuidorId - ID del distribuidor
 * @param {number} monto - Monto del pago
 * @param {string} fecha - Fecha del pago
 * @param {string} concepto - Concepto del pago
 * @returns {Object} Resultado del registro
 */
export const registrarPagoDistribuidor = (
  distribuidorId,
  monto,
  fecha,
  concepto
) => {
  try {
    // Validar parámetros
    if (!distribuidorId || typeof monto !== 'number' || monto <= 0) {
      throw new Error('Parámetros inválidos para el pago');
    }

    // Registrar el pago
    const pago = {
      id: `PAG-${Date.now()}`,
      distribuidorId,
      monto,
      fecha: fecha || new Date().toISOString(),
      concepto: concepto || 'Pago a distribuidor',
      estado: 'completado',
      timestamp: Date.now(),
    };

    return {
      success: true,
      pago,
      mensaje: 'Pago registrado exitosamente',
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      mensaje: 'Error al registrar el pago',
    };
  }
};

/**
 * Verifica el estado de todos los distribuidores
 * @param {Array} distribuidores - Lista de distribuidores
 * @returns {Object} Reporte del estado de distribuidores
 */
export const verificarEstadoDistribuidores = (distribuidores = []) => {
  try {
    const reporte = {
      total: distribuidores.length,
      activos: 0,
      inactivos: 0,
      conDeuda: 0,
      totalAdeudado: 0,
      totalPagado: 0,
      detalles: [],
    };

    distribuidores.forEach((distribuidor) => {
      // Contar activos/inactivos
      if (distribuidor.activo) {
        reporte.activos++;
      } else {
        reporte.inactivos++;
      }

      // Calcular deudas
      const deuda = distribuidor.deuda || 0;
      if (deuda > 0) {
        reporte.conDeuda++;
        reporte.totalAdeudado += deuda;
      }

      // Calcular pagos
      reporte.totalPagado += distribuidor.totalPagado || 0;

      // Agregar detalle
      reporte.detalles.push({
        id: distribuidor.id,
        nombre: distribuidor.nombre || distribuidor.origen,
        activo: distribuidor.activo,
        deuda: deuda,
        totalComprado: distribuidor.totalComprado || 0,
        totalPagado: distribuidor.totalPagado || 0,
        ultimaCompra: distribuidor.ultimaCompra,
      });
    });

    return {
      success: true,
      reporte,
      mensaje: 'Verificación completada exitosamente',
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      mensaje: 'Error al verificar el estado de los distribuidores',
    };
  }
};

/**
 * Obtener distribuidor por ID
 * @param {Array} distribuidores - Lista de distribuidores
 * @param {string} id - ID del distribuidor
 * @returns {Object|null} Distribuidor encontrado o null
 */
export const obtenerDistribuidorPorId = (distribuidores, id) => {
  return distribuidores.find((d) => d.id === id) || null;
};

/**
 * Actualizar información de un distribuidor
 * @param {Array} distribuidores - Lista de distribuidores
 * @param {string} id - ID del distribuidor
 * @param {Object} datos - Datos a actualizar
 * @returns {Object} Resultado de la actualización
 */
export const actualizarDistribuidor = (distribuidores, id, datos) => {
  try {
    const indice = distribuidores.findIndex((d) => d.id === id);

    if (indice === -1) {
      throw new Error('Distribuidor no encontrado');
    }

    distribuidores[indice] = {
      ...distribuidores[indice],
      ...datos,
      ultimaActualizacion: new Date().toISOString(),
    };

    return {
      success: true,
      distribuidor: distribuidores[indice],
      mensaje: 'Distribuidor actualizado exitosamente',
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      mensaje: 'Error al actualizar el distribuidor',
    };
  }
};

export default {
  inicializarSistemaDistribuidores,
  registrarPagoDistribuidor,
  verificarEstadoDistribuidores,
  obtenerDistribuidorPorId,
  actualizarDistribuidor,
};
