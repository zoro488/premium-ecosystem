// Hook para gestionar cortes de RF Actual automáticos y manuales
import { useEffect, useMemo, useState } from 'react';

import { useFlowStore } from './useFlowStore';

/**
 * Hook para gestionar cortes de RF Actual
 * Permite configurar frecuencia automática y hacer cortes manuales
 */
export const useCortes = (entidad, entidadId) => {
  const { cortes, configuracionCortes, agregarCorte, actualizarConfiguracionCortes } =
    useFlowStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Filtra cortes por entidad
   */
  const cortesEntidad = useMemo(() => {
    return (cortes || []).filter((c) => c.entidad === entidad && c.entidadId === entidadId);
  }, [cortes, entidad, entidadId]);

  /**
   * Obtiene configuración de cortes para esta entidad
   */
  const configuracion = useMemo(() => {
    const config = (configuracionCortes || []).find(
      (c) => c.entidad === entidad && c.entidadId === entidadId
    );

    // Configuración por defecto
    return (
      config || {
        entidad,
        entidadId,
        frecuencia: 'MENSUAL', // DIARIO, SEMANAL, QUINCENAL, MENSUAL, TRIMESTRAL, ANUAL, MANUAL
        diaEjecucion: 1, // Día del mes (1-31) o día de la semana (0-6)
        horaEjecucion: '23:59',
        automatico: false,
        ultimoCorte: null,
        proximoCorte: null,
        notificarAntes: 24, // horas
        activo: true,
      }
    );
  }, [configuracionCortes, entidad, entidadId]);

  /**
   * Calcula próxima fecha de corte según frecuencia
   */
  const calcularProximoCorte = (frecuencia, ultimoCorte = null) => {
    const ahora = new Date();
    const base = ultimoCorte ? new Date(ultimoCorte) : ahora;

    switch (frecuencia) {
      case 'DIARIO':
        base.setDate(base.getDate() + 1);
        break;
      case 'SEMANAL':
        base.setDate(base.getDate() + 7);
        break;
      case 'QUINCENAL':
        base.setDate(base.getDate() + 15);
        break;
      case 'MENSUAL':
        base.setMonth(base.getMonth() + 1);
        base.setDate(configuracion.diaEjecucion);
        break;
      case 'TRIMESTRAL':
        base.setMonth(base.getMonth() + 3);
        base.setDate(configuracion.diaEjecucion);
        break;
      case 'ANUAL':
        base.setFullYear(base.getFullYear() + 1);
        base.setDate(configuracion.diaEjecucion);
        break;
      case 'MANUAL':
        return null;
      default:
        return null;
    }

    return base.toISOString();
  };

  /**
   * Actualiza configuración de cortes automáticos
   */
  const actualizarConfiguracion = async (nuevaConfig) => {
    setLoading(true);
    setError(null);

    try {
      const configActualizada = {
        ...configuracion,
        ...nuevaConfig,
        proximoCorte: nuevaConfig.automatico
          ? calcularProximoCorte(nuevaConfig.frecuencia, configuracion.ultimoCorte)
          : null,
        modificadoEn: new Date().toISOString(),
      };

      actualizarConfiguracionCortes(entidad, entidadId, configActualizada);
      setLoading(false);
      return configActualizada;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  };

  /**
   * Ejecuta un corte manual o automático
   */
  const ejecutarCorte = async (datosCorte = {}) => {
    setLoading(true);
    setError(null);

    try {
      // Obtener datos actuales de la entidad según tipo
      let rfAnterior = 0;
      let rfActual = 0;
      let movimientos = [];
      let detalles = {};

      // Obtener último corte para RF anterior
      if (cortesEntidad.length > 0) {
        const ultimoCorte = cortesEntidad.sort((a, b) => new Date(b.fecha) - new Date(a.fecha))[0];
        rfAnterior = ultimoCorte.rfFinal;
      }

      // Calcular RF actual según tipo de entidad
      if (entidad === 'banco') {
        const { bancos } = useFlowStore.getState();
        const banco = bancos[entidadId];

        if (!banco) {
          throw new Error('Banco no encontrado');
        }

        rfActual = banco.capitalActual;
        movimientos = banco.movimientos || [];

        detalles = {
          ingresos: banco.ingresos || 0,
          gastos: banco.gastos || 0,
          transferenciasIn: movimientos
            .filter((m) => m.tipo === 'TRANSFERENCIA_ENTRADA')
            .reduce((sum, m) => sum + m.monto, 0),
          transferenciasOut: movimientos
            .filter((m) => m.tipo === 'TRANSFERENCIA_SALIDA')
            .reduce((sum, m) => sum + Math.abs(m.monto), 0),
        };
      } else if (entidad === 'almacen') {
        const { inventario } = useFlowStore.getState();

        if (!inventario) {
          throw new Error('Inventario no encontrado');
        }

        rfActual = inventario.stockActual || 0;

        detalles = {
          entradas: inventario.totalEntradas || 0,
          salidas: inventario.totalSalidas || 0,
          valorStock: inventario.valorStockUSD || 0,
        };
      }

      // Crear registro de corte
      const corte = {
        id: `corte_${Date.now()}`,
        entidad,
        entidadId,
        fecha: new Date().toISOString(),
        tipo: datosCorte.tipo || (configuracion.automatico ? 'AUTOMATICO' : 'MANUAL'),

        // Valores del corte
        rfAnterior,
        rfActual,
        diferencia: rfActual - rfAnterior,
        porcentajeCambio: rfAnterior > 0 ? ((rfActual - rfAnterior) / rfAnterior) * 100 : 0,

        // Detalles adicionales
        detalles,
        movimientosCount: movimientos.length,

        // Observaciones
        concepto: datosCorte.concepto || `Corte ${configuracion.frecuencia || 'MANUAL'}`,
        observaciones: datosCorte.observaciones || null,

        // Auditoría
        creadoPor: datosCorte.creadoPor || 'Sistema',
        creadoEn: new Date().toISOString(),
      };

      // Agregar corte al store
      agregarCorte(corte);

      // Actualizar configuración con último corte
      if (configuracion.automatico) {
        await actualizarConfiguracion({
          ultimoCorte: corte.fecha,
          proximoCorte: calcularProximoCorte(configuracion.frecuencia, corte.fecha),
        });
      }

      setLoading(false);
      return corte;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  };

  /**
   * Verifica si es necesario ejecutar un corte automático
   */
  const verificarCorteAutomatico = () => {
    if (!configuracion.automatico || !configuracion.proximoCorte) {
      return false;
    }

    const ahora = new Date();
    const proximo = new Date(configuracion.proximoCorte);

    return ahora >= proximo;
  };

  /**
   * Obtiene estadísticas de cortes
   */
  const estadisticas = useMemo(() => {
    if (cortesEntidad.length === 0) {
      return {
        total: 0,
        promedioRF: 0,
        tendencia: 'ESTABLE',
        ultimoCorte: null,
      };
    }

    const ordenados = [...cortesEntidad].sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

    const ultimoCorte = ordenados[0];
    const promedioRF = ordenados.reduce((sum, c) => sum + c.rfActual, 0) / ordenados.length;

    // Calcular tendencia (últimos 3 cortes)
    let tendencia = 'ESTABLE';
    if (ordenados.length >= 3) {
      const ultimos3 = ordenados.slice(0, 3);
      const creciente =
        ultimos3[0].rfActual > ultimos3[1].rfActual && ultimos3[1].rfActual > ultimos3[2].rfActual;
      const decreciente =
        ultimos3[0].rfActual < ultimos3[1].rfActual && ultimos3[1].rfActual < ultimos3[2].rfActual;

      if (creciente) tendencia = 'CRECIENTE';
      if (decreciente) tendencia = 'DECRECIENTE';
    }

    return {
      total: cortesEntidad.length,
      promedioRF,
      tendencia,
      ultimoCorte,
      variacionPromedio:
        ordenados.reduce((sum, c) => sum + Math.abs(c.diferencia), 0) / ordenados.length,
    };
  }, [cortesEntidad]);

  // Verificar cortes automáticos cada minuto
  useEffect(() => {
    if (!configuracion.automatico) return;

    const interval = setInterval(() => {
      if (verificarCorteAutomatico()) {
        ejecutarCorte({ tipo: 'AUTOMATICO' });
      }
    }, 60 * 1000); // Cada minuto

    return () => clearInterval(interval);
  }, [configuracion]);

  return {
    cortes: cortesEntidad,
    configuracion,
    estadisticas,
    loading,
    error,
    ejecutarCorte,
    actualizarConfiguracion,
    verificarCorteAutomatico,
    calcularProximoCorte,
  };
};
