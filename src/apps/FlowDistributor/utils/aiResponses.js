/**
 * 🤖 AI RESPONSE HANDLERS - FlowDistributor
 *
 * Módulo para manejar respuestas del asistente AI con baja complejidad cognitiva.
 * Refactorizado desde handleAISend para mejorar mantenibilidad.
 *
 * @author Premium Ecosystem Team
 * @version 3.0.0
 */

// ============================================
// PATRONES DE CONSULTAS (Query Patterns)
// ============================================

const QUERY_PATTERNS = {
  // Órdenes de Compra
  ORDENES: {
    keywords: ['orden', 'órdenes', 'compra', 'comprar', 'pedido', 'proveedor', 'distribuidor'],
    priority: 1,
  },

  // Ventas
  VENTAS: {
    keywords: ['venta', 'ventas', 'vender', 'cliente', 'factura', 'ingreso'],
    priority: 1,
  },

  // Bancos y Finanzas
  BANCOS: {
    keywords: ['banco', 'bancos', 'transferencia', 'saldo', 'dinero', 'cuenta', 'gasto', 'pago'],
    priority: 1,
  },

  // Almacén e Inventario
  ALMACEN: {
    keywords: ['almacén', 'inventario', 'stock', 'producto', 'productos', 'existencias'],
    priority: 1,
  },

  // Distribuidores
  DISTRIBUIDORES: {
    keywords: ['distribuidor', 'distribuidores', 'proveedor', 'proveedores'],
    priority: 2,
  },

  // Clientes
  CLIENTES: {
    keywords: ['cliente', 'clientes', 'adeudo', 'abono', 'crédito'],
    priority: 2,
  },

  // Reportes
  REPORTES: {
    keywords: ['reporte', 'reportes', 'análisis', 'estadística', 'gráfico', 'exportar'],
    priority: 2,
  },

  // Dashboard
  DASHBOARD: {
    keywords: ['dashboard', 'resumen', 'kpi', 'métricas', 'general', 'vista general'],
    priority: 3,
  },
};

// ============================================
// FUNCIONES DE DETECCIÓN DE INTENCIÓN
// ============================================

/**
 * Detecta la categoría de la consulta basándose en keywords
 * @param {string} query - Consulta del usuario
 * @returns {string|null} - Categoría detectada o null
 */
export const detectQueryCategory = (query) => {
  const lowerQuery = query.toLowerCase();
  let bestMatch = null;
  let bestScore = 0;

  for (const [category, config] of Object.entries(QUERY_PATTERNS)) {
    const matches = config.keywords.filter((keyword) => lowerQuery.includes(keyword));
    const score = matches.length * config.priority;

    if (score > bestScore) {
      bestScore = score;
      bestMatch = category;
    }
  }

  return bestMatch;
};

/**
 * Detecta si la consulta es una pregunta numérica
 * @param {string} query - Consulta del usuario
 * @returns {boolean}
 */
export const isNumericQuery = (query) => {
  const numericKeywords = ['cuánto', 'cuántos', 'total', 'suma', 'cantidad', 'número'];
  return numericKeywords.some((keyword) => query.toLowerCase().includes(keyword));
};

// ============================================
// GENERADORES DE RESPUESTAS POR CATEGORÍA
// ============================================

/**
 * Genera respuesta para consultas de órdenes
 * @param {string} query - Consulta del usuario
 * @param {Object} data - Datos del contexto
 * @returns {string}
 */
export const generateOrdenesResponse = (query, data) => {
  const { ordenesCompra = [] } = data;

  if (ordenesCompra.length === 0) {
    return '📦 No tienes órdenes de compra registradas actualmente.';
  }

  const totalOrdenes = ordenesCompra.length;
  const totalMontoOrdenes = ordenesCompra.reduce((sum, o) => sum + (o.total || 0), 0);

  if (isNumericQuery(query)) {
    return `📊 Resumen de Órdenes:\n• Total de órdenes: ${totalOrdenes}\n• Monto total: $${totalMontoOrdenes.toLocaleString('es-MX')}`;
  }

  const ultimasOrdenes = ordenesCompra.slice(-3);
  const ordenesInfo = ultimasOrdenes
    .map((o) => `  • ${o.distribuidor}: $${o.total?.toLocaleString('es-MX')} (${o.fecha})`)
    .join('\n');

  return `📦 Últimas Órdenes de Compra:\n${ordenesInfo}\n\nTotal de órdenes: ${totalOrdenes}`;
};

/**
 * Genera respuesta para consultas de ventas
 * @param {string} query - Consulta del usuario
 * @param {Object} data - Datos del contexto
 * @returns {string}
 */
export const generateVentasResponse = (query, data) => {
  const { ventas = [] } = data;

  if (ventas.length === 0) {
    return '💰 No tienes ventas registradas actualmente.';
  }

  const totalVentas = ventas.length;
  const totalMontoVentas = ventas.reduce((sum, v) => sum + (v.totalVenta || 0), 0);

  if (isNumericQuery(query)) {
    return `💰 Resumen de Ventas:\n• Total de ventas: ${totalVentas}\n• Ingresos totales: $${totalMontoVentas.toLocaleString('es-MX')}`;
  }

  const ultimasVentas = ventas.slice(-3);
  const ventasInfo = ultimasVentas
    .map((v) => `  • ${v.cliente}: $${v.totalVenta?.toLocaleString('es-MX')} (${v.fecha})`)
    .join('\n');

  return `💰 Últimas Ventas:\n${ventasInfo}\n\nTotal de ventas: ${totalVentas}`;
};

/**
 * Genera respuesta para consultas de bancos
 * @param {string} query - Consulta del usuario
 * @param {Object} data - Datos del contexto
 * @returns {string}
 */
export const generateBancosResponse = (query, data) => {
  const { bancos = [] } = data;

  if (bancos.length === 0) {
    return '🏦 No tienes bancos registrados actualmente.';
  }

  const totalBancos = bancos.length;
  const saldoTotal = bancos.reduce((sum, b) => sum + (b.saldo || 0), 0);

  if (isNumericQuery(query)) {
    return `🏦 Resumen Financiero:\n• Total de bancos: ${totalBancos}\n• Saldo total: $${saldoTotal.toLocaleString('es-MX')}`;
  }

  const bancosInfo = bancos
    .map((b) => `  • ${b.nombre}: $${b.saldo?.toLocaleString('es-MX')}`)
    .join('\n');

  return `🏦 Estado de Bancos:\n${bancosInfo}\n\nSaldo total: $${saldoTotal.toLocaleString('es-MX')}`;
};

/**
 * Genera respuesta para consultas de almacén
 * @param {string} query - Consulta del usuario
 * @param {Object} data - Datos del contexto
 * @returns {string}
 */
export const generateAlmacenResponse = (query, data) => {
  const { almacen = { stock: [] } } = data;
  const stock = almacen.stock || [];

  if (stock.length === 0) {
    return '📦 No tienes productos en el almacén actualmente.';
  }

  const totalProductos = stock.length;
  const totalValor = stock.reduce((sum, p) => sum + (p.precioVenta * p.cantidad || 0), 0);
  const productosStockBajo = stock.filter((p) => p.cantidad <= (p.cantidadMinima || 10));

  if (isNumericQuery(query)) {
    return `📦 Resumen de Inventario:\n• Total de productos: ${totalProductos}\n• Valor total: $${totalValor.toLocaleString('es-MX')}\n• Productos con stock bajo: ${productosStockBajo.length}`;
  }

  const productosInfo = stock
    .slice(0, 5)
    .map(
      (p) =>
        `  • ${p.nombre}: ${p.cantidad} unidades ($${p.precioVenta?.toLocaleString('es-MX')} c/u)`
    )
    .join('\n');

  return `📦 Estado del Almacén:\n${productosInfo}\n\nTotal de productos: ${totalProductos}`;
};

/**
 * Genera respuesta para consultas de distribuidores
 * @param {string} query - Consulta del usuario
 * @param {Object} data - Datos del contexto
 * @returns {string}
 */
export const generateDistribuidoresResponse = (query, data) => {
  const { distribuidores = [] } = data;

  if (distribuidores.length === 0) {
    return '🏭 No tienes distribuidores registrados actualmente.';
  }

  const totalDistribuidores = distribuidores.length;
  const distribuidoresActivos = distribuidores.filter((d) => d.estatus === 'activo').length;

  if (isNumericQuery(query)) {
    return `🏭 Resumen de Distribuidores:\n• Total: ${totalDistribuidores}\n• Activos: ${distribuidoresActivos}`;
  }

  const distribuidoresInfo = distribuidores
    .slice(0, 5)
    .map((d) => `  • ${d.nombre} - ${d.estatus || 'activo'}`)
    .join('\n');

  return `🏭 Distribuidores Registrados:\n${distribuidoresInfo}\n\nTotal: ${totalDistribuidores}`;
};

/**
 * Genera respuesta para consultas de clientes
 * @param {string} query - Consulta del usuario
 * @param {Object} data - Datos del contexto
 * @returns {string}
 */
export const generateClientesResponse = (query, data) => {
  const { clientes = [] } = data;

  if (clientes.length === 0) {
    return '👥 No tienes clientes registrados actualmente.';
  }

  const totalClientes = clientes.length;
  const clientesConAdeudo = clientes.filter((c) => (c.adeudo || 0) > 0);
  const adeudoTotal = clientes.reduce((sum, c) => sum + (c.adeudo || 0), 0);

  if (isNumericQuery(query)) {
    return `👥 Resumen de Clientes:\n• Total de clientes: ${totalClientes}\n• Con adeudo: ${clientesConAdeudo.length}\n• Adeudo total: $${adeudoTotal.toLocaleString('es-MX')}`;
  }

  const clientesInfo = clientes
    .slice(0, 5)
    .map((c) => `  • ${c.nombre} - Adeudo: $${(c.adeudo || 0).toLocaleString('es-MX')}`)
    .join('\n');

  return `👥 Clientes Registrados:\n${clientesInfo}\n\nTotal: ${totalClientes}`;
};

/**
 * Genera respuesta para consultas de reportes
 * @param {string} query - Consulta del usuario
 * @param {Object} data - Datos del contexto
 * @returns {string}
 */
export const generateReportesResponse = (_query, data) => {
  const { ventas = [], ordenesCompra = [], bancos = [] } = data;

  const totalIngresos = ventas.reduce((sum, v) => sum + (v.totalVenta || 0), 0);
  const totalEgresos = ordenesCompra.reduce((sum, o) => sum + (o.total || 0), 0);
  const balance = totalIngresos - totalEgresos;

  return `📊 Reporte Financiero:\n• Ingresos: $${totalIngresos.toLocaleString('es-MX')}\n• Egresos: $${totalEgresos.toLocaleString('es-MX')}\n• Balance: $${balance.toLocaleString('es-MX')}\n• Bancos activos: ${bancos.length}`;
};

/**
 * Genera respuesta para consultas del dashboard
 * @param {string} query - Consulta del usuario
 * @param {Object} data - Datos del contexto
 * @returns {string}
 */
export const generateDashboardResponse = (_query, data) => {
  const {
    ventas = [],
    ordenesCompra = [],
    almacen = { stock: [] },
    clientes = [],
    bancos = [],
  } = data;

  const totalIngresos = ventas.reduce((sum, v) => sum + (v.totalVenta || 0), 0);
  const totalEgresos = ordenesCompra.reduce((sum, o) => sum + (o.total || 0), 0);
  const saldoBancos = bancos.reduce((sum, b) => sum + (b.saldo || 0), 0);

  return `📈 Resumen General:\n• Ingresos: $${totalIngresos.toLocaleString('es-MX')}\n• Egresos: $${totalEgresos.toLocaleString('es-MX')}\n• Saldo en bancos: $${saldoBancos.toLocaleString('es-MX')}\n• Productos: ${almacen.stock.length}\n• Clientes: ${clientes.length}\n• Ventas: ${ventas.length}`;
};

// ============================================
// GENERADOR PRINCIPAL DE RESPUESTAS
// ============================================

/**
 * Genera respuesta basada en la categoría detectada
 * @param {string} query - Consulta del usuario
 * @param {Object} data - Datos completos del contexto
 * @returns {string}
 */
export const generateAIResponse = (query, data) => {
  const category = detectQueryCategory(query);

  const responseMap = {
    ORDENES: generateOrdenesResponse,
    VENTAS: generateVentasResponse,
    BANCOS: generateBancosResponse,
    ALMACEN: generateAlmacenResponse,
    DISTRIBUIDORES: generateDistribuidoresResponse,
    CLIENTES: generateClientesResponse,
    REPORTES: generateReportesResponse,
    DASHBOARD: generateDashboardResponse,
  };

  const responseGenerator = responseMap[category];

  if (responseGenerator) {
    try {
      return responseGenerator(query, data);
    } catch (error) {
      // console.error('Error generating AI response:', error);
      return '❌ Error al procesar tu consulta. Por favor intenta de nuevo.';
    }
  }

  // Respuesta por defecto si no se detecta categoría
  return `🤖 Hola! Puedo ayudarte con:\n• Órdenes de compra\n• Ventas y facturación\n• Estados de bancos\n• Inventario y almacén\n• Información de clientes\n• Reportes y análisis\n\n¿Sobre qué te gustaría saber?`;
};

/**
 * Valida que el contexto de datos esté disponible
 * @param {Object} data - Datos del contexto
 * @returns {boolean}
 */
export const validateDataContext = (data) => {
  if (!data || typeof data !== 'object') {
    return false;
  }

  // Al menos debe tener una propiedad válida
  const validKeys = ['ventas', 'ordenesCompra', 'bancos', 'almacen', 'clientes', 'distribuidores'];
  return validKeys.some((key) => key in data);
};
