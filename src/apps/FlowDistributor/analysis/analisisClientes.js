/**
 * 👥 ANÁLISIS AVANZADO - CLIENTES
 * Motor de IA/ML para gestión de cartera, churn prediction y RFM
 * @module analysis/analisisClientes
 */
import {
  calcularMetricasCliente,
  calcularPendiente,
  categorizarCliente,
  predecirChurn,
} from '../types/clientes.types';

/**
 * Analiza cartera de deudas completa
 * @param {Array<object>} clientes - Array de clientes
 * @returns {object} Análisis de cartera
 */
export const analizarCarteraDeudas = (clientes = []) => {
  const analisis = clientes.map((c) => {
    const pendiente = calcularPendiente(c.deuda, c.abonos);
    const categoria = categorizarCliente(pendiente, c.diasMorosidad);
    return { ...c, pendiente, categoria };
  });

  const totalDeuda = analisis.reduce((s, c) => s + c.deuda, 0);
  const totalAbonos = analisis.reduce((s, c) => s + c.abonos, 0);
  const totalPendiente = analisis.reduce((s, c) => s + c.pendiente, 0);

  const porCategoria = {
    alDia: analisis.filter((c) => c.categoria === 'al_dia').length,
    porVencer: analisis.filter((c) => c.categoria === 'por_vencer').length,
    vencido: analisis.filter((c) => c.categoria === 'vencido').length,
    moroso: analisis.filter((c) => c.categoria === 'moroso').length,
    critico: analisis.filter((c) => c.categoria === 'critico').length,
  };

  return {
    totalDeuda,
    totalAbonos,
    totalPendiente,
    porCategoria,
    tasaRecuperacion: totalDeuda > 0 ? (totalAbonos / totalDeuda) * 100 : 0,
    clientes: analisis,
  };
};

/**
 * Analiza churn (riesgo de pérdida de clientes)
 * @param {Array<object>} clientes - Array de clientes
 * @returns {object} Análisis de churn
 */
export const analizarChurnCartera = (clientes = []) => {
  const predicciones = clientes.map((c) => {
    const metricas = calcularMetricasCliente(c.movimientos || []);
    const churn = predecirChurn(c, metricas);
    return { cliente: c, churn };
  });

  const porRiesgo = {
    bajo: predicciones.filter((p) => p.churn.nivelRiesgo === 'bajo').length,
    medio: predicciones.filter((p) => p.churn.nivelRiesgo === 'medio').length,
    alto: predicciones.filter((p) => p.churn.nivelRiesgo === 'alto').length,
    critico: predicciones.filter((p) => p.churn.nivelRiesgo === 'critico').length,
  };

  const clientesEnRiesgo = predicciones.filter((p) => p.churn.probabilidadChurn > 0.5);

  return {
    totalClientes: clientes.length,
    porRiesgo,
    clientesEnRiesgo: clientesEnRiesgo.length,
    tasaRiesgo: clientes.length > 0 ? (clientesEnRiesgo.length / clientes.length) * 100 : 0,
    predicciones,
  };
};

/**
 * Analiza patrones de pago
 * @param {Array<object>} clientes - Array de clientes
 * @returns {object} Análisis de patrones
 */
export const analizarPatronesPago = (clientes = []) => {
  const patrones = clientes.map((c) => {
    const metricas = calcularMetricasCliente(c.movimientos || []);
    return {
      cliente: c.nombre,
      ...metricas,
    };
  });

  const promedioFrecuencia =
    patrones.reduce((s, p) => s + p.frecuenciaPagos, 0) / patrones.length || 0;
  const promedioMonto = patrones.reduce((s, p) => s + p.montoPromedio, 0) / patrones.length || 0;

  return {
    patrones,
    promedioFrecuencia,
    promedioMonto,
    clientesActivos: patrones.filter((p) => p.diasUltimoPago < 30).length,
    clientesInactivos: patrones.filter((p) => p.diasUltimoPago > 90).length,
  };
};

/**
 * Segmentación RFM (Recency, Frequency, Monetary)
 * @param {Array<object>} clientes - Array de clientes
 * @returns {object} Segmentación RFM
 */
export const segmentacionRFM = (clientes = []) => {
  const analisisRFM = clientes.map((c) => {
    const metricas = calcularMetricasCliente(c.movimientos || []);

    // Scoring RFM (1-5, donde 5 es mejor)
    let recency = 5;
    if (metricas.diasUltimoPago > 180) {
      recency = 1;
    } else if (metricas.diasUltimoPago > 90) {
      recency = 2;
    } else if (metricas.diasUltimoPago > 30) {
      recency = 3;
    } else if (metricas.diasUltimoPago > 7) {
      recency = 4;
    }

    let frequency = 1;
    if (metricas.frecuenciaPagos > 20) {
      frequency = 5;
    } else if (metricas.frecuenciaPagos > 10) {
      frequency = 4;
    } else if (metricas.frecuenciaPagos > 5) {
      frequency = 3;
    } else if (metricas.frecuenciaPagos > 2) {
      frequency = 2;
    }

    let monetary = 1;
    if (metricas.montoPromedio > 50000) {
      monetary = 5;
    } else if (metricas.montoPromedio > 20000) {
      monetary = 4;
    } else if (metricas.montoPromedio > 10000) {
      monetary = 3;
    } else if (metricas.montoPromedio > 5000) {
      monetary = 2;
    }

    const scoreRFM = recency + frequency + monetary;

    let segmento = 'En Riesgo';
    if (scoreRFM >= 13) {
      segmento = 'Champions';
    } else if (scoreRFM >= 10) {
      segmento = 'Leales';
    } else if (scoreRFM >= 7) {
      segmento = 'Potenciales';
    } else if (scoreRFM >= 5) {
      segmento = 'Necesitan Atención';
    }

    return {
      cliente: c.nombre,
      recency,
      frequency,
      monetary,
      scoreRFM,
      segmento,
    };
  });

  const porSegmento = {
    champions: analisisRFM.filter((a) => a.segmento === 'Champions').length,
    leales: analisisRFM.filter((a) => a.segmento === 'Leales').length,
    potenciales: analisisRFM.filter((a) => a.segmento === 'Potenciales').length,
    necesitanAtencion: analisisRFM.filter((a) => a.segmento === 'Necesitan Atención').length,
    enRiesgo: analisisRFM.filter((a) => a.segmento === 'En Riesgo').length,
  };

  return {
    analisisRFM,
    porSegmento,
    scorePromedio: analisisRFM.reduce((s, a) => s + a.scoreRFM, 0) / analisisRFM.length || 0,
  };
};

/**
 * Calcula Customer Lifetime Value (CLV)
 * @param {Array<object>} clientes - Array de clientes
 * @returns {object} Análisis CLV
 */
export const calcularLifetimeValue = (clientes = []) => {
  const analisisCLV = clientes.map((c) => {
    const metricas = calcularMetricasCliente(c.movimientos || []);

    // CLV simplificado: (Monto Promedio × Frecuencia × Meses Activo) - Pendiente
    const mesesActivo = Math.max(1, Math.floor(metricas.diasUltimoPago / 30));
    const valorBruto = metricas.montoPromedio * metricas.frecuenciaPagos * mesesActivo;
    const pendiente = calcularPendiente(c.deuda, c.abonos);
    const clv = valorBruto - pendiente;

    let calificacion = 'Bajo';
    if (clv > 100000) {
      calificacion = 'Muy Alto';
    } else if (clv > 50000) {
      calificacion = 'Alto';
    } else if (clv > 20000) {
      calificacion = 'Medio';
    }

    return {
      cliente: c.nombre,
      clv,
      valorBruto,
      pendiente,
      calificacion,
    };
  });

  const totalCLV = analisisCLV.reduce((s, a) => s + a.clv, 0);

  return {
    analisisCLV,
    totalCLV,
    promedioClv: analisisCLV.length > 0 ? totalCLV / analisisCLV.length : 0,
    topClientes: analisisCLV.sort((a, b) => b.clv - a.clv).slice(0, 10),
  };
};

/**
 * Genera recomendaciones de gestión de cartera
 * @param {Array<object>} clientes - Array de clientes
 * @returns {object} Recomendaciones
 */
export const generarRecomendacionesClientes = (clientes = []) => {
  const cartera = analizarCarteraDeudas(clientes);
  const churn = analizarChurnCartera(clientes);
  const rfm = segmentacionRFM(clientes);
  const recomendaciones = [];

  if (churn.tasaRiesgo > 30) {
    recomendaciones.push({
      tipo: 'Alto Riesgo de Churn',
      mensaje: `${churn.tasaRiesgo.toFixed(1)}% de clientes en riesgo`,
      prioridad: 'critica',
      accion: 'Implementar campaña de retención urgente',
    });
  }

  if (cartera.tasaRecuperacion < 50) {
    recomendaciones.push({
      tipo: 'Baja Recuperación',
      mensaje: `Tasa de recuperación: ${cartera.tasaRecuperacion.toFixed(1)}%`,
      prioridad: 'alta',
      accion: 'Mejorar estrategia de cobranza',
    });
  }

  if (rfm.porSegmento.enRiesgo > rfm.porSegmento.champions) {
    recomendaciones.push({
      tipo: 'Segmentación Desequilibrada',
      mensaje: 'Más clientes en riesgo que champions',
      prioridad: 'alta',
      accion: 'Programa de fidelización para segmentos medios',
    });
  }

  return {
    recomendaciones,
    cartera,
    churn,
    rfm,
    prioridad: recomendaciones.length > 0 ? recomendaciones[0].prioridad : 'baja',
  };
};

export default {
  analizarCarteraDeudas,
  analizarChurnCartera,
  analizarPatronesPago,
  segmentacionRFM,
  calcularLifetimeValue,
  generarRecomendacionesClientes,
};
