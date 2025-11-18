// Hook para gestionar transferencias entre bóvedas en USD
import { useEffect, useMemo, useState } from 'react';

import { useExchangeRate } from './useExchangeRate';
import { useFlowStore } from './useFlowStore';

/**
 * Hook para gestionar transferencias entre bóvedas
 * Todas las operaciones son en USD
 */
export const useTransferencias = (bovedaId = null) => {
  const { bancos, transferencias, agregarTransferencia, actualizarBanco } = useFlowStore();
  const { exchangeRate, usdToMxn, mxnToUsd } = useExchangeRate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Filtra transferencias por bóveda si se especifica
   */
  const transferenciasFiltraadas = useMemo(() => {
    if (!bovedaId) return transferencias || [];

    return (transferencias || []).filter(
      (t) => t.origenBoveda === bovedaId || t.destinoBoveda === bovedaId
    );
  }, [transferencias, bovedaId]);

  /**
   * Valida que una transferencia sea posible
   */
  const validarTransferencia = (datos) => {
    const errores = [];

    // 1. Validar origen y destino diferentes
    if (datos.origenBoveda === datos.destinoBoveda) {
      errores.push('Origen y destino deben ser diferentes');
    }

    // 2. Validar bóveda origen existe
    const bovedaOrigen = bancos[datos.origenBoveda];
    if (!bovedaOrigen) {
      errores.push('Bóveda origen no encontrada');
      return { valido: false, errores };
    }

    // 3. Validar saldo suficiente en USD
    if (bovedaOrigen.capitalActual < datos.montoUSD) {
      errores.push(
        `Saldo insuficiente en ${datos.origenNombre}. ` +
          `Disponible: $${bovedaOrigen.capitalActual.toLocaleString('en-US', { minimumFractionDigits: 2 })} USD`
      );
    }

    // 4. Validar monto positivo
    if (datos.montoUSD <= 0) {
      errores.push('El monto debe ser mayor a cero');
    }

    // 5. Validar concepto
    if (!datos.concepto || datos.concepto.trim() === '') {
      errores.push('El concepto es obligatorio');
    }

    // 6. Si es a/desde Profit, validar tipo de conversión
    if (datos.destinoBoveda === 'profit' || datos.origenBoveda === 'profit') {
      if (!datos.tipoConversion) {
        errores.push(
          'Para transferencias con Profit debes especificar tipo de conversión (USD→MXN o MXN→USD)'
        );
      }
    }

    return {
      valido: errores.length === 0,
      errores,
    };
  };

  /**
   * Crea una nueva transferencia
   * Actualiza saldos automáticamente en USD
   */
  const crearTransferencia = async (datos) => {
    setLoading(true);
    setError(null);

    try {
      // Validar
      const validacion = validarTransferencia(datos);
      if (!validacion.valido) {
        throw new Error(validacion.errores.join(', '));
      }

      // Preparar datos de transferencia
      const transferencia = {
        id: `transfer_${Date.now()}`,
        fecha: new Date().toISOString(),
        tipo: 'ENTRE_BOVEDAS',

        // Origen
        origenBoveda: datos.origenBoveda,
        origenNombre: datos.origenNombre,

        // Destino
        destinoBoveda: datos.destinoBoveda,
        destinoNombre: datos.destinoNombre,

        // Montos en USD (principal)
        montoUSD: parseFloat(datos.montoUSD),
        montoMXN: usdToMxn(parseFloat(datos.montoUSD)),
        tipoCambioAplicado: exchangeRate.rate,

        // Conversión si aplica (para Profit)
        tipoConversion: datos.tipoConversion || null, // 'USD_TO_MXN' o 'MXN_TO_USD'

        concepto: datos.concepto,
        categoria: datos.categoria || 'OPERATIVO',
        comprobante: datos.comprobante || null,
        observaciones: datos.observaciones || null,

        // Estado
        estatus: 'COMPLETADA',

        // Auditoría
        creadoEn: new Date().toISOString(),
        creadoPor: 'Sistema', // TODO: Usuario actual
      };

      // Agregar transferencia al store
      agregarTransferencia(transferencia);

      // Actualizar saldo origen (restar en USD)
      const bovedaOrigen = bancos[datos.origenBoveda];
      actualizarBanco(datos.origenBoveda, {
        ...bovedaOrigen,
        gastos: (bovedaOrigen.gastos || 0) + transferencia.montoUSD,
        capitalActual: bovedaOrigen.capitalActual - transferencia.montoUSD,
        movimientos: [
          ...(bovedaOrigen.movimientos || []),
          {
            tipo: 'TRANSFERENCIA_SALIDA',
            monto: -transferencia.montoUSD,
            montoMXN: -transferencia.montoMXN,
            concepto: `Transferencia a ${datos.destinoNombre}: ${datos.concepto}`,
            fecha: transferencia.fecha,
            referenciaId: transferencia.id,
          },
        ],
      });

      // Actualizar saldo destino (sumar en USD)
      const bovedaDestino = bancos[datos.destinoBoveda];
      actualizarBanco(datos.destinoBoveda, {
        ...bovedaDestino,
        ingresos: (bovedaDestino.ingresos || 0) + transferencia.montoUSD,
        capitalActual: bovedaDestino.capitalActual + transferencia.montoUSD,
        movimientos: [
          ...(bovedaDestino.movimientos || []),
          {
            tipo: 'TRANSFERENCIA_ENTRADA',
            monto: transferencia.montoUSD,
            montoMXN: transferencia.montoMXN,
            concepto: `Transferencia desde ${datos.origenNombre}: ${datos.concepto}`,
            fecha: transferencia.fecha,
            referenciaId: transferencia.id,
          },
        ],
      });

      setLoading(false);
      return transferencia;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  };

  /**
   * Cancela una transferencia pendiente
   * Revierte los cambios en saldos
   */
  const cancelarTransferencia = async (transferenciaId) => {
    setLoading(true);
    setError(null);

    try {
      const transferencia = transferencias.find((t) => t.id === transferenciaId);

      if (!transferencia) {
        throw new Error('Transferencia no encontrada');
      }

      if (transferencia.estatus !== 'PENDIENTE') {
        throw new Error('Solo se pueden cancelar transferencias pendientes');
      }

      // Marcar como cancelada
      const transferenciasCopy = [...transferencias];
      const index = transferenciasCopy.findIndex((t) => t.id === transferenciaId);
      transferenciasCopy[index] = {
        ...transferencia,
        estatus: 'CANCELADA',
        canceladoEn: new Date().toISOString(),
      };

      // Actualizar store
      useFlowStore.setState({ transferencias: transferenciasCopy });

      setLoading(false);
      return true;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  };

  /**
   * Obtiene estadísticas de transferencias
   */
  const estadisticas = useMemo(() => {
    const filtradas = transferenciasFiltraadas.filter((t) => t.estatus === 'COMPLETADA');

    const totales = filtradas.reduce(
      (acc, t) => {
        const esOrigen = t.origenBoveda === bovedaId;
        const esDestino = t.destinoBoveda === bovedaId;

        if (esOrigen) {
          acc.salidas += t.montoUSD;
          acc.salidasCount++;
        }
        if (esDestino) {
          acc.entradas += t.montoUSD;
          acc.entradasCount++;
        }

        return acc;
      },
      {
        entradas: 0,
        salidas: 0,
        entradasCount: 0,
        salidasCount: 0,
      }
    );

    return {
      ...totales,
      neto: totales.entradas - totales.salidas,
      total: filtradas.length,
    };
  }, [transferenciasFiltraadas, bovedaId]);

  return {
    transferencias: transferenciasFiltraadas,
    estadisticas,
    loading,
    error,
    crearTransferencia,
    cancelarTransferencia,
    validarTransferencia,
  };
};
