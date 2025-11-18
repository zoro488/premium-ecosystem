/**
 * 🧮 Calculations - Funciones de cálculo para lógica de negocio
 */
import type { Almacen, Banco, Gasto, ProductItem, Venta } from '../types';

// ==================== CÁLCULOS DE PRODUCTOS ====================

/**
 * Calcula el subtotal de un producto
 */
export const calculateProductSubtotal = (cantidad: number, precio: number): number => {
  return Math.round(cantidad * precio * 100) / 100; // Redondear a 2 decimales
};

/**
 * Calcula el total de una venta sumando todos los productos
 */
export const calculateSaleTotal = (productos: ProductItem[]): number => {
  const total = productos.reduce((sum, p) => sum + p.subtotal, 0);
  return Math.round(total * 100) / 100;
};

/**
 * Calcula las utilidades de una venta
 * Utilidades = Total Venta - Total Fletes
 */
export const calculateSaleUtilities = (totalVenta: number, totalFletes: number): number => {
  return Math.max(0, totalVenta - totalFletes);
};

/**
 * Calcula el adeudo pendiente de una venta
 */
export const calculateDebt = (totalVenta: number, montoPagado: number): number => {
  return Math.max(0, totalVenta - montoPagado);
};

/**
 * Determina el estado de pago de una venta
 */
export const calculatePaymentStatus = (
  totalVenta: number,
  montoPagado: number
): 'Pendiente' | 'Parcial' | 'Pagado' => {
  if (montoPagado === 0) return 'Pendiente';
  if (montoPagado >= totalVenta) return 'Pagado';
  return 'Parcial';
};

// ==================== CÁLCULOS DE BANCOS ====================

/**
 * Calcula el capital total sumando todos los bancos
 */
export const calculateTotalCapital = (bancos: Record<string, Banco>): number => {
  return Object.values(bancos).reduce((sum, banco) => sum + (banco.capitalActual || 0), 0);
};

/**
 * Calcula el balance de un banco después de una operación
 */
export const calculateBankBalance = (
  saldoActual: number,
  operacion: 'ingreso' | 'egreso',
  monto: number
): number => {
  if (operacion === 'ingreso') {
    return saldoActual + monto;
  }
  return Math.max(0, saldoActual - monto);
};

/**
 * Calcula el porcentaje de distribución de un banco
 */
export const calculateBankPercentage = (capitalBanco: number, capitalTotal: number): number => {
  if (capitalTotal === 0) return 0;
  return (capitalBanco / capitalTotal) * 100;
};

/**
 * Calcula cuánto dinero se puede transferir sin dejar el banco en negativo
 */
export const calculateMaxTransferAmount = (
  saldoOrigen: number,
  minimoRequerido: number = 0
): number => {
  return Math.max(0, saldoOrigen - minimoRequerido);
};

// ==================== CÁLCULOS DE GASTOS ====================

/**
 * Calcula el total de gastos en un período
 */
export const calculateTotalExpenses = (gastos: Gasto[]): number => {
  return gastos.reduce((sum, g) => sum + g.monto, 0);
};

/**
 * Calcula gastos por categoría/destino
 */
export const calculateExpensesByCategory = (gastos: Gasto[]): Record<string, number> => {
  return gastos.reduce(
    (acc, g) => {
      const destino = g.destino || 'Sin categoría';
      acc[destino] = (acc[destino] || 0) + g.monto;
      return acc;
    },
    {} as Record<string, number>
  );
};

/**
 * Calcula el promedio de gastos diarios
 */
export const calculateDailyAverageExpenses = (gastos: Gasto[], dias: number): number => {
  if (dias === 0) return 0;
  const total = calculateTotalExpenses(gastos);
  return total / dias;
};

// ==================== CÁLCULOS DE ALMACÉN ====================

/**
 * Calcula el stock disponible sumando entradas y restando salidas
 */
export const calculateAvailableStock = (movimientos: Almacen[]): number => {
  return movimientos.reduce((stock, m) => {
    if (m.tipo === 'entrada') return stock + m.cantidad;
    if (m.tipo === 'salida') return stock - m.cantidad;
    return stock;
  }, 0);
};

/**
 * Calcula el stock por producto
 */
export const calculateStockByProduct = (movimientos: Almacen[]): Record<string, number> => {
  return movimientos.reduce(
    (acc, m) => {
      const producto = m.producto || 'General';
      const cantidad = m.tipo === 'entrada' ? m.cantidad : -m.cantidad;
      acc[producto] = (acc[producto] || 0) + cantidad;
      return acc;
    },
    {} as Record<string, number>
  );
};

/**
 * Verifica si hay stock suficiente para una venta
 */
export const hasAvailableStock = (stockActual: number, cantidadRequerida: number): boolean => {
  return stockActual >= cantidadRequerida;
};

// ==================== CÁLCULOS DE KPIs ====================

/**
 * Calcula el total de ventas en un período
 */
export const calculateTotalSales = (ventas: Venta[]): number => {
  return ventas.reduce((sum, v) => sum + (v.totalVenta || 0), 0);
};

/**
 * Calcula el total de utilidades en un período
 */
export const calculateTotalUtilities = (ventas: Venta[]): number => {
  return ventas.reduce((sum, v) => sum + (v.totalUtilidades || 0), 0);
};

/**
 * Calcula el promedio de ventas
 */
export const calculateAverageSale = (ventas: Venta[]): number => {
  if (ventas.length === 0) return 0;
  const total = calculateTotalSales(ventas);
  return total / ventas.length;
};

/**
 * Calcula el margen de utilidad promedio
 */
export const calculateProfitMargin = (ventas: Venta[]): number => {
  const totalVentas = calculateTotalSales(ventas);
  if (totalVentas === 0) return 0;

  const totalUtilidades = calculateTotalUtilities(ventas);
  return (totalUtilidades / totalVentas) * 100;
};

/**
 * Calcula ventas pendientes de pago
 */
export const calculatePendingSales = (
  ventas: Venta[]
): {
  cantidad: number;
  montoTotal: number;
} => {
  const pendientes = ventas.filter(
    (v) => v.estadoPago === 'Pendiente' || (v.adeudo && v.adeudo > 0)
  );

  return {
    cantidad: pendientes.length,
    montoTotal: pendientes.reduce((sum, v) => sum + (v.adeudo || 0), 0),
  };
};

/**
 * Calcula ventas por cliente
 */
export const calculateSalesByClient = (
  ventas: Venta[]
): Record<
  string,
  {
    cantidad: number;
    total: number;
  }
> => {
  return ventas.reduce(
    (acc, v) => {
      const cliente = v.cliente || v.clientName || 'Sin cliente';
      if (!acc[cliente]) {
        acc[cliente] = { cantidad: 0, total: 0 };
      }
      acc[cliente].cantidad += 1;
      acc[cliente].total += v.totalVenta || v.totalAmountUSD || 0;
      return acc;
    },
    {} as Record<string, { cantidad: number; total: number }>
  );
};

/**
 * Calcula el ticket promedio por cliente
 */
export const calculateAverageTicketByClient = (ventas: Venta[]): Record<string, number> => {
  const salesByClient = calculateSalesByClient(ventas);

  return Object.entries(salesByClient).reduce(
    (acc, [cliente, data]) => {
      acc[cliente] = data.cantidad > 0 ? data.total / data.cantidad : 0;
      return acc;
    },
    {} as Record<string, number>
  );
};

// ==================== CÁLCULOS DE CRECIMIENTO ====================

/**
 * Calcula el crecimiento porcentual entre dos valores
 */
export const calculateGrowthPercentage = (valorAnterior: number, valorActual: number): number => {
  if (valorAnterior === 0) return valorActual > 0 ? 100 : 0;
  return ((valorActual - valorAnterior) / valorAnterior) * 100;
};

/**
 * Calcula el crecimiento de ventas comparando períodos
 */
export const calculateSalesGrowth = (
  ventasPeriodo1: Venta[],
  ventasPeriodo2: Venta[]
): {
  cantidad: number;
  monto: number;
} => {
  const totalPeriodo1 = calculateTotalSales(ventasPeriodo1);
  const totalPeriodo2 = calculateTotalSales(ventasPeriodo2);

  return {
    cantidad: calculateGrowthPercentage(ventasPeriodo1.length, ventasPeriodo2.length),
    monto: calculateGrowthPercentage(totalPeriodo1, totalPeriodo2),
  };
};

// ==================== CÁLCULOS DE PROYECCIONES ====================

/**
 * Proyecta ventas futuras basándose en tendencia histórica
 */
export const projectFutureSales = (ventasHistoricas: Venta[], diasAProyectar: number): number => {
  if (ventasHistoricas.length === 0) return 0;

  const promedioVentasDiarias = calculateTotalSales(ventasHistoricas) / ventasHistoricas.length;
  return promedioVentasDiarias * diasAProyectar;
};

/**
 * Calcula la tasa de conversión de ventas
 */
export const calculateConversionRate = (
  totalOportunidades: number,
  ventasCerradas: number
): number => {
  if (totalOportunidades === 0) return 0;
  return (ventasCerradas / totalOportunidades) * 100;
};

// ==================== DISTRIBUCIÓN DE UTILIDADES ====================

/**
 * Distribuye las utilidades de una venta entre bóvedas según lógica del negocio
 *
 * ✅ FÓRMULAS CORRECTAS (Actualizado 2025-11-07):
 * - Bóveda Monte: Precio COMPRA × Cantidad (costo de mercancía)
 * - Fletes: Precio FLETE × Cantidad (costo de transporte, default 500 USD/unidad)
 * - Utilidades: (Precio VENTA - Precio COMPRA - Precio FLETE) × Cantidad (ganancia neta)
 *
 * Ejemplo:
 * - Precio Compra: 6,300 USD/unidad
 * - Precio Venta: 10,000 USD/unidad
 * - Flete: 500 USD/unidad
 * - Cantidad: 10 unidades
 *
 * Resultado:
 * - Bóveda Monte: 6,300 × 10 = 63,000 USD
 * - Fletes: 500 × 10 = 5,000 USD
 * - Utilidades: (10,000 - 6,300 - 500) × 10 = 32,000 USD
 * - Total distribuido: 100,000 USD
 * - Cobro al cliente: (10,000 + 500) × 10 = 105,000 USD
 */
export const distribuirUtilidad = (
  params: {
    cantidad: number;
    precioVenta: number;
    costoUnidad: number;
    aplicaFlete?: boolean;
    montoFlete?: number;
  },
  tipoCambio = 18.5
): {
  totalVentaUSD: number;
  totalVentaMXN: number;
  distribucion: {
    bovedaMonte: number;
    fleteSur: number;
    utilidades: number;
  };
  gananciaNetaCalculada: number; // Ganancia neta para referencia
} => {
  const { cantidad, precioVenta, costoUnidad, aplicaFlete = false, montoFlete = 0 } = params;

  // Calcular totales
  const totalVentaUSD = cantidad * precioVenta;
  const totalVentaMXN = totalVentaUSD * tipoCambio;
  const costoTotal = cantidad * costoUnidad;

  // Flete (si aplica)
  const flete = aplicaFlete ? montoFlete || cantidad * 500 : 0; // $500 USD por unidad default

  // ✅ DISTRIBUCIÓN A BANCOS (LÓGICA CORRECTA):
  const bovedaMonteDistribucion = costoTotal;                    // Precio Compra × Cantidad
  const fletesDistribucion = flete;                               // Precio Flete × Cantidad
  const utilidadesDistribucion = totalVentaUSD - costoTotal - flete;  // (Precio Venta - Precio Compra - Flete) × Cantidad

  return {
    totalVentaUSD,
    totalVentaMXN,
    distribucion: {
      bovedaMonte: bovedaMonteDistribucion,   // Costo de mercancía
      fleteSur: fletesDistribucion,            // Costo de transporte
      utilidades: utilidadesDistribucion,      // GANANCIA NETA
    },
    gananciaNetaCalculada: utilidadesDistribucion, // Mismo valor que utilidades
  };
};

// ==================== EXPORTACIONES ====================

export default {
  // Productos
  calculateProductSubtotal,
  calculateSaleTotal,
  calculateSaleUtilities,
  calculateDebt,
  calculatePaymentStatus,

  // Bancos
  calculateTotalCapital,
  calculateBankBalance,
  calculateBankPercentage,
  calculateMaxTransferAmount,

  // Gastos
  calculateTotalExpenses,
  calculateExpensesByCategory,
  calculateDailyAverageExpenses,

  // Almacén
  calculateAvailableStock,
  calculateStockByProduct,
  hasAvailableStock,

  // KPIs
  calculateTotalSales,
  calculateTotalUtilities,
  calculateAverageSale,
  calculateProfitMargin,
  calculatePendingSales,
  calculateSalesByClient,
  calculateAverageTicketByClient,

  // Crecimiento
  calculateGrowthPercentage,
  calculateSalesGrowth,

  // Proyecciones
  projectFutureSales,
  calculateConversionRate,
};
