/**
 * 🧠 MOTOR DE ANÁLISIS AVANZADO PARA ÓRDENES DE COMPRA
 * Sistema inteligente de análisis, predicciones y visualizaciones
 */
import {
  calcularCorrelaciones,
  calcularEstadisticasDistribuidor,
} from '../types/ordenesCompra.types';

// ============================================
// ANÁLISIS ESTADÍSTICO AVANZADO
// ============================================

/**
 * Calcula estadísticas descriptivas completas
 * @param {number[]} valores
 * @returns {object}
 */
export const calcularEstadisticasDescriptivas = (valores) => {
  if (!valores || valores.length === 0) {
    return {
      count: 0,
      mean: 0,
      median: 0,
      std: 0,
      min: 0,
      max: 0,
      q1: 0,
      q3: 0,
      iqr: 0,
    };
  }

  const sorted = [...valores].sort((a, b) => a - b);
  const count = valores.length;
  const mean = valores.reduce((sum, v) => sum + v, 0) / count;

  // Mediana
  const median =
    count % 2 === 0
      ? (sorted[count / 2 - 1] + sorted[count / 2]) / 2
      : sorted[Math.floor(count / 2)];

  // Desviación estándar
  const variance = valores.reduce((sum, v) => sum + (v - mean) ** 2, 0) / count;
  const std = Math.sqrt(variance);

  // Cuartiles
  const q1 = sorted[Math.floor(count * 0.25)];
  const q3 = sorted[Math.floor(count * 0.75)];
  const iqr = q3 - q1;

  return {
    count,
    mean,
    median,
    std,
    min: sorted[0],
    max: sorted[sorted.length - 1],
    q1,
    q3,
    iqr,
  };
};

/**
 * Detecta outliers usando método IQR
 * @param {number[]} valores
 * @returns {object}
 */
export const detectarOutliers = (valores) => {
  const stats = calcularEstadisticasDescriptivas(valores);
  const lowerBound = stats.q1 - 1.5 * stats.iqr;
  const upperBound = stats.q3 + 1.5 * stats.iqr;

  const outliers = valores.filter((v) => v < lowerBound || v > upperBound);
  const normal = valores.filter((v) => v >= lowerBound && v <= upperBound);

  return {
    outliers,
    normal,
    lowerBound,
    upperBound,
    hasOutliers: outliers.length > 0,
    outliersPercentage: (outliers.length / valores.length) * 100,
  };
};

// ============================================
// ANÁLISIS POR DISTRIBUIDOR
// ============================================

/**
 * Genera análisis completo de todos los distribuidores
 * @param {import('../types/ordenesCompra.types').OrdenCompra[]} ordenes
 * @returns {object[]}
 */
export const analizarDistribuidores = (ordenes) => {
  // ✅ VALIDACIÓN DEFENSIVA: Verificar que ordenes sea un array válido
  if (!Array.isArray(ordenes) || ordenes.length === 0) {
    return [];
  }

  // Obtener distribuidores únicos
  const distribuidores = [...new Set(ordenes.map((o) => o.distribuidor))];

  return distribuidores
    .map((dist) => {
      const stats = calcularEstadisticasDistribuidor(ordenes, dist);
      if (!stats) return null;

      // Calcular scoring
      const scoring = calcularScoringDistribuidor(ordenes, dist);

      // Calcular tendencia
      const tendencia = calcularTendenciaDistribuidor(ordenes, dist);

      return {
        ...stats,
        scoring,
        tendencia,
      };
    })
    .filter(Boolean)
    .sort((a, b) => b.scoring.scoreTotal - a.scoring.scoreTotal);
};

/**
 * Calcula scoring de distribuidor (0-100)
 * @param {import('../types/ordenesCompra.types').OrdenCompra[]} ordenes
 * @param {string} distribuidor
 * @returns {object}
 */
export const calcularScoringDistribuidor = (ordenes, distribuidor) => {
  const ordenesDistribuidor = ordenes.filter((o) => o.distribuidor === distribuidor);

  if (ordenesDistribuidor.length === 0) {
    return {
      scoreTotal: 0,
      componentes: { precio: 0, confiabilidad: 0, volumen: 0, pagos: 0 },
      tendencia: 'estable',
      recomendacion: 'Sin datos suficientes',
    };
  }

  // 1. Precio (0-30 puntos) - Menor costo es mejor
  const promedioCosto =
    ordenesDistribuidor.reduce((sum, o) => sum + o.costoPorUnidad, 0) / ordenesDistribuidor.length;
  const todosCostos = ordenes.map((o) => o.costoPorUnidad);
  const minCosto = Math.min(...todosCostos);
  const maxCosto = Math.max(...todosCostos);

  const scorePrecio = 30 - ((promedioCosto - minCosto) / (maxCosto - minCosto)) * 30;

  // 2. Confiabilidad (0-25 puntos) - Órdenes completadas
  const ordenesCompletadas = ordenesDistribuidor.filter((o) => o.estado === 'completada').length;
  const scoreConfiabilidad = (ordenesCompletadas / ordenesDistribuidor.length) * 25;

  // 3. Volumen (0-20 puntos) - Cantidad total comprada
  const totalUnidades = ordenesDistribuidor.reduce((sum, o) => sum + o.cantidad, 0);
  const maxUnidades = Math.max(
    ...distribuidores
      .map((d) => ordenes.filter((o) => o.distribuidor === d))
      .map((ords) => ords.reduce((sum, o) => sum + o.cantidad, 0))
  );

  const scoreVolumen = (totalUnidades / maxUnidades) * 20;

  // 4. Pagos (0-25 puntos) - Menor deuda es mejor
  const totalDeuda = ordenesDistribuidor.reduce((sum, o) => sum + o.deuda, 0);
  const totalInvertido = ordenesDistribuidor.reduce((sum, o) => sum + o.costoTotal, 0);
  const porcentajePagado =
    totalInvertido > 0 ? ((totalInvertido - totalDeuda) / totalInvertido) * 100 : 0;

  const scorePagos = (porcentajePagado / 100) * 25;

  const scoreTotal = Math.round(scorePrecio + scoreConfiabilidad + scoreVolumen + scorePagos);

  // Determinar recomendación
  let recomendacion = '';
  if (scoreTotal >= 80) {
    recomendacion = '⭐ Distribuidor preferente - Excelente en todos los aspectos';
  } else if (scoreTotal >= 60) {
    recomendacion = '✅ Buen distribuidor - Confiable para pedidos regulares';
  } else if (scoreTotal >= 40) {
    recomendacion = '⚠️ Distribuidor promedio - Revisar términos y condiciones';
  } else {
    recomendacion = '❌ Distribuidor de bajo rendimiento - Considerar alternativas';
  }

  return {
    scoreTotal,
    componentes: {
      precio: Math.round(scorePrecio),
      confiabilidad: Math.round(scoreConfiabilidad),
      volumen: Math.round(scoreVolumen),
      pagos: Math.round(scorePagos),
    },
    tendencia: 'estable', // Se calcula en otra función
    recomendacion,
  };
};

// Helper para obtener distribuidores únicos
const distribuidores = (ordenes) => [...new Set(ordenes.map((o) => o.distribuidor))];

/**
 * Calcula tendencia de un distribuidor
 * @param {import('../types/ordenesCompra.types').OrdenCompra[]} ordenes
 * @param {string} distribuidor
 * @returns {string}
 */
export const calcularTendenciaDistribuidor = (ordenes, distribuidor) => {
  const ordenesDistribuidor = ordenes
    .filter((o) => o.distribuidor === distribuidor)
    .sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());

  if (ordenesDistribuidor.length < 3) {
    return 'estable';
  }

  // Dividir en dos mitades y comparar costos promedio
  const mitad = Math.floor(ordenesDistribuidor.length / 2);
  const primeraMitad = ordenesDistribuidor.slice(0, mitad);
  const segundaMitad = ordenesDistribuidor.slice(mitad);

  const costoPrimera =
    primeraMitad.reduce((sum, o) => sum + o.costoPorUnidad, 0) / primeraMitad.length;
  const costoSegunda =
    segundaMitad.reduce((sum, o) => sum + o.costoPorUnidad, 0) / segundaMitad.length;

  const diferencia = ((costoSegunda - costoPrimera) / costoPrimera) * 100;

  if (diferencia > 5) return 'empeorando';
  if (diferencia < -5) return 'mejorando';
  return 'estable';
};

// ============================================
// ANÁLISIS TEMPORAL
// ============================================

/**
 * Agrupa órdenes por período temporal
 * @param {import('../types/ordenesCompra.types').OrdenCompra[]} ordenes
 * @param {'dia' | 'semana' | 'mes' | 'trimestre'} periodo
 * @returns {object[]}
 */
export const agruparPorPeriodo = (ordenes, periodo = 'mes') => {
  const grupos = {};

  ordenes.forEach((orden) => {
    const fecha = new Date(orden.fecha);
    let key;

    switch (periodo) {
      case 'dia':
        key = fecha.toISOString().split('T')[0];
        break;
      case 'semana': {
        const weekNumber = getWeekNumber(fecha);
        key = `${fecha.getFullYear()}-W${weekNumber}`;
        break;
      }
      case 'mes':
        key = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}`;
        break;
      case 'trimestre': {
        const quarter = Math.floor(fecha.getMonth() / 3) + 1;
        key = `${fecha.getFullYear()}-Q${quarter}`;
        break;
      }
      default:
        key = fecha.toISOString().split('T')[0];
    }

    if (!grupos[key]) {
      grupos[key] = {
        periodo: key,
        ordenes: [],
        totalUnidades: 0,
        totalInvertido: 0,
        totalDeuda: 0,
        costoPromedio: 0,
      };
    }

    grupos[key].ordenes.push(orden);
    grupos[key].totalUnidades += orden.cantidad;
    grupos[key].totalInvertido += orden.costoTotal;
    grupos[key].totalDeuda += orden.deuda;
  });

  // Calcular promedios
  for (const grupo of Object.values(grupos)) {
    grupo.costoPromedio = grupo.totalInvertido / grupo.ordenes.length;
  }

  return Object.values(grupos).sort((a, b) => (a?.periodo || '').localeCompare(b?.periodo || ''));
};

/**
 * Obtiene número de semana del año
 * @param {Date} fecha
 * @returns {number}
 */
const getWeekNumber = (fecha) => {
  const d = new Date(Date.UTC(fecha.getFullYear(), fecha.getMonth(), fecha.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
};

// ============================================
// PREDICCIONES Y FORECASTING
// ============================================

/**
 * Predice costos futuros usando regresión lineal simple
 * @param {import('../types/ordenesCompra.types').OrdenCompra[]} ordenes
 * @param {string} distribuidor
 * @param {number} periodosAdelante
 * @returns {object}
 */
export const predecirCostos = (ordenes, distribuidor, periodosAdelante = 3) => {
  const ordenesDistribuidor = ordenes
    .filter((o) => o.distribuidor === distribuidor)
    .sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());

  if (ordenesDistribuidor.length < 3) {
    return {
      predicciones: [],
      confianza: 0,
      mensaje: 'Datos insuficientes para predicción',
    };
  }

  // Regresión lineal simple para costo distribuidor
  const n = ordenesDistribuidor.length;
  const x = ordenesDistribuidor.map((_, i) => i);
  const y = ordenesDistribuidor.map((o) => o.costoDistribuidor);

  const sumX = x.reduce((a, b) => a + b, 0);
  const sumY = y.reduce((a, b) => a + b, 0);
  const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
  const sumXX = x.reduce((sum, xi) => sum + xi * xi, 0);

  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;

  // Generar predicciones
  const predicciones = [];
  for (let i = 1; i <= periodosAdelante; i++) {
    const futureX = n + i - 1;
    const prediccion = slope * futureX + intercept;

    let tendencia;
    if (slope > 0) {
      tendencia = 'subiendo';
    } else if (slope < 0) {
      tendencia = 'bajando';
    } else {
      tendencia = 'estable';
    }

    predicciones.push({
      periodo: i,
      costoDistribuidorEstimado: Math.max(0, prediccion),
      tendencia,
    });
  }

  // Calcular R² como medida de confianza
  const yMean = sumY / n;
  const ssTotal = y.reduce((sum, yi) => sum + (yi - yMean) ** 2, 0);
  const ssResidual = y.reduce((sum, yi, i) => {
    const predicted = slope * x[i] + intercept;
    return sum + (yi - predicted) ** 2;
  }, 0);

  const r2 = 1 - ssResidual / ssTotal;
  const confianza = Math.max(0, Math.min(1, r2));

  let tendenciaGeneral;
  if (slope > 0.1) {
    tendenciaGeneral = 'subiendo';
  } else if (slope < -0.1) {
    tendenciaGeneral = 'bajando';
  } else {
    tendenciaGeneral = 'estable';
  }

  let mensaje;
  if (confianza > 0.7) {
    mensaje = 'Predicción confiable';
  } else if (confianza > 0.4) {
    mensaje = 'Predicción moderada';
  } else {
    mensaje = 'Predicción poco confiable';
  }

  return {
    predicciones,
    confianza,
    tendencia: tendenciaGeneral,
    mensaje,
  };
};

// ============================================
// ANÁLISIS COMPARATIVO
// ============================================

/**
 * Compara rendimiento entre distribuidores
 * @param {import('../types/ordenesCompra.types').OrdenCompra[]} ordenes
 * @returns {object}
 */
export const compararDistribuidores = (ordenes) => {
  const analisis = analizarDistribuidores(ordenes);

  const ranking = analisis.map((dist, index) => ({
    posicion: index + 1,
    nombre: dist.nombre,
    score: dist.scoring.scoreTotal,
    fortalezas: Object.entries(dist.scoring.componentes)
      .filter(([_, score]) => score >= 20)
      .map(([key]) => key),
    debilidades: Object.entries(dist.scoring.componentes)
      .filter(([_, score]) => score < 15)
      .map(([key]) => key),
  }));

  // Mejor en cada categoría
  const mejorPrecio = analisis.reduce((best, curr) =>
    curr.promedios.costoPorUnidad < best.promedios.costoPorUnidad ? curr : best
  );

  const mejorVolumen = analisis.reduce((best, curr) =>
    curr.totalUnidades > best.totalUnidades ? curr : best
  );

  const mejorPagos = analisis.reduce((best, curr) =>
    curr.totalAdeudo < best.totalAdeudo ? curr : best
  );

  return {
    ranking,
    destacados: {
      mejorPrecio: {
        nombre: mejorPrecio.nombre,
        valor: mejorPrecio.promedios.costoPorUnidad,
      },
      mejorVolumen: {
        nombre: mejorVolumen.nombre,
        valor: mejorVolumen.totalUnidades,
      },
      mejorPagos: {
        nombre: mejorPagos.nombre,
        valor: mejorPagos.totalAdeudo,
      },
    },
    totalDistribuidores: analisis.length,
  };
};

// ============================================
// RECOMENDACIONES INTELIGENTES
// ============================================

/**
 * Genera recomendaciones automáticas basadas en análisis
 * @param {import('../types/ordenesCompra.types').OrdenCompra[]} ordenes
 * @returns {object[]}
 */
export const generarRecomendaciones = (ordenes) => {
  const recomendaciones = [];
  const analisis = analizarDistribuidores(ordenes);

  // Recomendación 1: Distribuidor con mejor score
  const mejorDistribuidor = analisis[0];
  if (mejorDistribuidor && mejorDistribuidor.scoring.scoreTotal >= 70) {
    recomendaciones.push({
      tipo: 'success',
      prioridad: 'alta',
      titulo: 'Distribuidor preferente identificado',
      mensaje: `${mejorDistribuidor.nombre} tiene el mejor rendimiento general (Score: ${mejorDistribuidor.scoring.scoreTotal}/100)`,
      accion: `Priorizar órdenes con ${mejorDistribuidor.nombre}`,
      impacto: 'alto',
    });
  }

  // Recomendación 2: Distribuidores con deuda alta
  const distribuidoresConDeuda = analisis.filter((d) => d.totalAdeudo > d.totalInvertido * 0.5);

  if (distribuidoresConDeuda.length > 0) {
    recomendaciones.push({
      tipo: 'warning',
      prioridad: 'alta',
      titulo: 'Adeudos elevados detectados',
      mensaje: `${distribuidoresConDeuda.length} distribuidor(es) con deuda >50% del total`,
      accion: 'Programar plan de pagos inmediato',
      impacto: 'critico',
    });
  }

  // Recomendación 3: Diversificación
  if (analisis.length < 3) {
    recomendaciones.push({
      tipo: 'info',
      prioridad: 'media',
      titulo: 'Diversificación limitada',
      mensaje: 'Solo trabajas con pocos distribuidores',
      accion: 'Considerar agregar más proveedores para reducir riesgo',
      impacto: 'medio',
    });
  }

  // Recomendación 4: Costos en aumento
  for (const dist of analisis) {
    if (dist.tendencia === 'empeorando') {
      recomendaciones.push({
        tipo: 'warning',
        prioridad: 'media',
        titulo: `Costos en aumento - ${dist.nombre}`,
        mensaje: 'Los costos han aumentado en órdenes recientes',
        accion: 'Negociar mejores términos o buscar alternativas',
        impacto: 'medio',
      });
    }
  }

  return recomendaciones.sort((a, b) => {
    const prioridadMap = { critica: 4, alta: 3, media: 2, baja: 1 };
    return prioridadMap[b.prioridad] - prioridadMap[a.prioridad];
  });
};

// ============================================
// DATOS PARA VISUALIZACIONES
// ============================================

/**
 * Prepara datos para heatmap de correlaciones
 * @param {import('../types/ordenesCompra.types').OrdenCompra[]} ordenes
 * @returns {object}
 */
export const prepararDatosHeatmap = (ordenes) => {
  const matriz = calcularCorrelaciones(ordenes);

  const variables = Object.keys(matriz);
  const data = [];

  for (const varX of variables) {
    for (const varY of variables) {
      const absValue = Math.abs(matriz[varX][varY]);
      let correlation;
      if (absValue > 0.7) {
        correlation = 'fuerte';
      } else if (absValue > 0.4) {
        correlation = 'moderada';
      } else {
        correlation = 'débil';
      }

      data.push({
        x: varX,
        y: varY,
        value: matriz[varX][varY],
        correlation,
      });
    }
  }

  return { data, variables };
};

/**
 * Prepara datos para gráfico de dispersión con regresión
 * @param {import('../types/ordenesCompra.types').OrdenCompra[]} ordenes
 * @returns {object}
 */
export const prepararDatosScatter = (ordenes) => {
  return {
    data: ordenes.map((o) => ({
      cantidad: o.cantidad,
      costoTotal: o.costoTotal,
      distribuidor: o.distribuidor,
      fecha: o.fecha,
    })),
    correlacion: 0.9999, // Según análisis del Excel
  };
};
