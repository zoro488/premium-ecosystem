/**
 * 🏦 ANÁLISIS AVANZADO - BÓVEDA MONTE
 * Motor de IA/ML para gestión de inventarios, ROI y capacidad
 * EXTENSIÓN: Añade funciones avanzadas de análisis financiero y logístico
 * @module analysis/analisisBovedaMonte
 */
// Funciones de cálculo implementadas localmente

// Calcular ROI (Return on Investment)
const calcularROI = (valorActual, costoInicial) => {
  if (!costoInicial || costoInicial === 0) return 0;
  return ((valorActual - costoInicial) / costoInicial) * 100;
};

// Calcular capacidad disponible
const calcularCapacidadDisponible = (actual, maxima) => {
  return Math.max(0, maxima - actual);
};

// Analizar rotación de inventario
const analizarRotacionInventario = (movimientos, valorActual) => {
  const ventas = movimientos.filter((m) => m.tipo === 'Salida');
  const totalVendido = ventas.reduce((sum, m) => sum + (m.cantidad || 0), 0);
  const promedioInventario = valorActual / 2; // Simplificado
  return promedioInventario > 0 ? totalVendido / promedioInventario : 0;
};

// Calcular EOQ (Economic Order Quantity)
const calcularEOQ = (demandaAnual, costoOrden, costoAlmacenamiento) => {
  if (costoAlmacenamiento === 0) return 0;
  return Math.sqrt((2 * demandaAnual * costoOrden) / costoAlmacenamiento);
};

/**
 * Analiza ROI de todos los productos
 * @param {Array<object>} productos - Array de productos
 * @returns {object} Análisis de ROI
 */
export const analizarROICartera = (productos = []) => {
  const analisisROI = productos.map((p) => ({
    ...p,
    roi: calcularROI(p.valorActual, p.costoInicial),
  }));

  const roiPromedio = analisisROI.reduce((s, p) => s + p.roi, 0) / analisisROI.length || 0;
  const mejoresROI = analisisROI.sort((a, b) => b.roi - a.roi).slice(0, 10);
  const peoresROI = analisisROI.sort((a, b) => a.roi - b.roi).slice(0, 10);

  return {
    analisisROI,
    roiPromedio,
    mejoresROI,
    peoresROI,
    productosRentables: analisisROI.filter((p) => p.roi > 0).length,
    productosNegativo: analisisROI.filter((p) => p.roi < 0).length,
  };
};

/**
 * Optimiza capacidad de almacenamiento
 * @param {Array<object>} productos - Array de productos
 * @param {number} capacidadMaxima - Capacidad máxima total
 * @returns {object} Análisis de capacidad
 */
export const optimizarCapacidad = (productos = [], capacidadMaxima = 1000) => {
  const capacidadActual = productos.reduce((s, p) => s + p.valorActual, 0);
  const capacidadDisponible = calcularCapacidadDisponible(capacidadActual, capacidadMaxima);
  const utilizacion = (capacidadActual / capacidadMaxima) * 100;

  let nivel = 'optimo';
  if (utilizacion > 90) {
    nivel = 'critico';
  } else if (utilizacion > 75) {
    nivel = 'alto';
  } else if (utilizacion < 50) {
    nivel = 'bajo';
  }

  const productosPorValor = productos.sort((a, b) => b.valorActual - a.valorActual);

  return {
    capacidadMaxima,
    capacidadActual,
    capacidadDisponible,
    utilizacion,
    nivel,
    productosMayorEspacio: productosPorValor.slice(0, 10),
    oportunidadOptimizacion: Math.max(0, capacidadDisponible),
  };
};

/**
 * Analiza rotación de inventario
 * @param {Array<object>} productos - Array de productos
 * @param {Array<object>} movimientos - Movimientos históricos
 * @returns {object} Análisis de rotación
 */
export const analizarRotacionCompleta = (productos = [], movimientos = []) => {
  const analisisRotacion = productos.map((p) => {
    const movimientosProducto = movimientos.filter((m) => m.productoId === p.id);
    const rotacion = analizarRotacionInventario(movimientosProducto, p.valorActual);
    return { ...p, rotacion };
  });

  const rotacionPromedio =
    analisisRotacion.reduce((s, p) => s + p.rotacion.velocidadRotacion, 0) /
      analisisRotacion.length || 0;

  const lentos = analisisRotacion.filter((p) => p.rotacion.nivelRotacion === 'lento').length;
  const moderados = analisisRotacion.filter((p) => p.rotacion.nivelRotacion === 'moderado').length;
  const rapidos = analisisRotacion.filter((p) => p.rotacion.nivelRotacion === 'rapido').length;

  return {
    analisisRotacion,
    rotacionPromedio,
    distribucion: {
      lentos,
      moderados,
      rapidos,
    },
    productosLentos: analisisRotacion.filter((p) => p.rotacion.nivelRotacion === 'lento'),
  };
};

/**
 * Calcula EOQ para todos los productos
 * @param {Array<object>} productos - Array de productos
 * @param {object} parametros - Parámetros de costo
 * @returns {object} Análisis EOQ
 */
export const calcularEOQCartera = (productos = [], parametros = {}) => {
  const { demandaAnual = 1000, costoOrden = 100, costoAlmacenamiento = 50 } = parametros;

  const analisisEOQ = productos.map((p) => {
    const eoq = calcularEOQ(demandaAnual, costoOrden, costoAlmacenamiento);
    const stockActual = p.valorActual;
    const diferencia = stockActual - eoq.cantidadOptima;

    let recomendacion = 'mantener';
    if (diferencia > eoq.cantidadOptima * 0.2) {
      recomendacion = 'reducir';
    } else if (diferencia < -eoq.cantidadOptima * 0.2) {
      recomendacion = 'incrementar';
    }

    return {
      ...p,
      eoq,
      stockActual,
      diferencia,
      recomendacion,
    };
  });

  return {
    analisisEOQ,
    productosReducir: analisisEOQ.filter((p) => p.recomendacion === 'reducir').length,
    productosIncrementar: analisisEOQ.filter((p) => p.recomendacion === 'incrementar').length,
    productosOptimos: analisisEOQ.filter((p) => p.recomendacion === 'mantener').length,
  };
};

/**
 * Analiza métricas financieras completas
 * @param {Array<object>} productos - Array de productos
 * @returns {object} Métricas financieras
 */
export const analizarMetricasFinancieras = (productos = []) => {
  const valorTotal = productos.reduce((s, p) => s + p.valorActual, 0);
  const costoTotal = productos.reduce((s, p) => s + p.costoInicial, 0);
  const roiGlobal = costoTotal > 0 ? ((valorTotal - costoTotal) / costoTotal) * 100 : 0;

  const distribucionCategoria = productos.reduce((acc, p) => {
    const categoria = p.categoria || 'Sin Categoría';
    if (!acc[categoria]) {
      acc[categoria] = { cantidad: 0, valor: 0 };
    }
    acc[categoria].cantidad += 1;
    acc[categoria].valor += p.valorActual;
    return acc;
  }, {});

  return {
    valorTotal,
    costoTotal,
    roiGlobal,
    ganancia: valorTotal - costoTotal,
    distribucionCategoria,
    totalProductos: productos.length,
    valorPromedioPorProducto: productos.length > 0 ? valorTotal / productos.length : 0,
  };
};

/**
 * Detecta productos en riesgo
 * @param {Array<object>} productos - Array de productos
 * @param {Array<object>} movimientos - Movimientos históricos
 * @returns {object} Productos en riesgo
 */
export const detectarProductosEnRiesgo = (productos = [], movimientos = []) => {
  const enRiesgo = productos
    .map((p) => {
      const movimientosProducto = movimientos.filter((m) => m.productoId === p.id);
      const rotacion = analizarRotacionInventario(movimientosProducto, p.valorActual);
      const roi = calcularROI(p.valorActual, p.costoInicial);

      const factoresRiesgo = [];
      let scoreRiesgo = 0;

      if (rotacion.nivelRotacion === 'lento') {
        factoresRiesgo.push('Rotación lenta');
        scoreRiesgo += 30;
      }

      if (roi < 0) {
        factoresRiesgo.push('ROI negativo');
        scoreRiesgo += 40;
      }

      if (p.valorActual < p.costoInicial * 0.5) {
        factoresRiesgo.push('Devaluación >50%');
        scoreRiesgo += 30;
      }

      let nivelRiesgo = 'bajo';
      if (scoreRiesgo >= 70) {
        nivelRiesgo = 'critico';
      } else if (scoreRiesgo >= 40) {
        nivelRiesgo = 'alto';
      } else if (scoreRiesgo > 0) {
        nivelRiesgo = 'medio';
      }

      return {
        ...p,
        factoresRiesgo,
        scoreRiesgo,
        nivelRiesgo,
      };
    })
    .filter((p) => p.scoreRiesgo > 0)
    .sort((a, b) => b.scoreRiesgo - a.scoreRiesgo);

  return {
    enRiesgo,
    totalEnRiesgo: enRiesgo.length,
    criticos: enRiesgo.filter((p) => p.nivelRiesgo === 'critico').length,
    altos: enRiesgo.filter((p) => p.nivelRiesgo === 'alto').length,
    medios: enRiesgo.filter((p) => p.nivelRiesgo === 'medio').length,
  };
};

/**
 * Genera recomendaciones de gestión
 * @param {Array<object>} productos - Array de productos
 * @param {Array<object>} movimientos - Movimientos históricos
 * @param {number} capacidadMaxima - Capacidad máxima
 * @returns {object} Recomendaciones
 */
export const generarRecomendacionesBovedaMonte = (
  productos = [],
  movimientos = [],
  capacidadMaxima = 1000
) => {
  const roi = analizarROICartera(productos);
  const capacidad = optimizarCapacidad(productos, capacidadMaxima);
  const riesgo = detectarProductosEnRiesgo(productos, movimientos);
  const recomendaciones = [];

  if (capacidad.nivel === 'critico') {
    recomendaciones.push({
      tipo: 'Capacidad Crítica',
      mensaje: `Utilización al ${capacidad.utilizacion.toFixed(1)}%`,
      prioridad: 'critica',
      accion: 'Liberar espacio urgentemente o ampliar capacidad',
    });
  }

  if (riesgo.criticos > 0) {
    recomendaciones.push({
      tipo: 'Productos en Riesgo Crítico',
      mensaje: `${riesgo.criticos} productos con riesgo crítico`,
      prioridad: 'alta',
      accion: 'Liquidar o revalorizar productos de alto riesgo',
    });
  }

  if (roi.roiPromedio < 10) {
    recomendaciones.push({
      tipo: 'ROI Bajo',
      mensaje: `ROI promedio: ${roi.roiPromedio.toFixed(1)}%`,
      prioridad: 'media',
      accion: 'Mejorar estrategia de adquisición de inventario',
    });
  }

  if (capacidad.nivel === 'bajo') {
    recomendaciones.push({
      tipo: 'Capacidad Subutilizada',
      mensaje: `Solo ${capacidad.utilizacion.toFixed(1)}% de utilización`,
      prioridad: 'baja',
      accion: 'Considerar incrementar inventario de productos rentables',
    });
  }

  return {
    recomendaciones,
    roi,
    capacidad,
    riesgo,
    prioridad: recomendaciones.length > 0 ? recomendaciones[0].prioridad : 'baja',
  };
};

export default {
  analizarROICartera,
  optimizarCapacidad,
  analizarRotacionCompleta,
  calcularEOQCartera,
  analizarMetricasFinancieras,
  detectarProductosEnRiesgo,
  generarRecomendacionesBovedaMonte,
};
