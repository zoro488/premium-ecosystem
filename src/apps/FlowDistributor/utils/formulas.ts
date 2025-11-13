/**
 * 💎 FÓRMULAS DE CÁLCULO - FLOWDISTRIBUTOR
 * Todas las fórmulas de negocio del sistema
 */
import type { OrdenCompra, Venta } from '../services/firebase.config';

// ============================================================
// 📦 ÓRDENES DE COMPRA
// ============================================================

/**
 * Costo por unidad = Costo Distribuidor + Costo Transporte
 */
export function calcularCostoPorUnidad(costoDistribuidor: number, costoTransporte: number): number {
  return costoDistribuidor + costoTransporte;
}

/**
 * Costo Total = Costo por Unidad × Cantidad
 */
export function calcularCostoTotal(costoPorUnidad: number, cantidad: number): number {
  return costoPorUnidad * cantidad;
}

/**
 * Deuda = Costo Total - Pago Distribuidor
 */
export function calcularDeudaDistribuidor(costoTotal: number, pagoDistribuidor: number): number {
  return costoTotal - pagoDistribuidor;
}

// ============================================================
// 💰 VENTAS
// ============================================================

/**
 * Precio Total por Unidad = Precio Venta + Flete (500)
 */
export function calcularPrecioTotalUnidad(
  precioVentaUnidad: number,
  precioFlete: number = 500
): number {
  return precioVentaUnidad + precioFlete;
}

/**
 * Precio Total Venta = Precio Total Unidad × Cantidad
 */
export function calcularPrecioTotalVenta(precioTotalUnidad: number, cantidad: number): number {
  return precioTotalUnidad * cantidad;
}

/**
 * Monto Restante = Precio Total Venta - Monto Pagado
 */
export function calcularMontoRestante(precioTotalVenta: number, montoPagado: number): number {
  return precioTotalVenta - montoPagado;
}

// ============================================================
// 🏦 DISTRIBUCIÓN EN BANCOS
// ============================================================

/**
 * Bóveda Monte = Precio Venta por Unidad × Cantidad
 * Recibe el monto del PRECIO DE VENTA (sin flete)
 */
export function calcularMontoBovedaMonte(precioVentaUnidad: number, cantidad: number): number {
  return precioVentaUnidad * cantidad;
}

/**
 * Fletes = Flete por Unidad × Cantidad
 * Monto del flete por cada unidad vendida (default 500)
 */
export function calcularMontoFletes(cantidad: number, precioFlete: number = 500): number {
  return precioFlete * cantidad;
}

/**
 * Utilidades = (Precio Venta - Precio Compra - Flete) × Cantidad
 * La ganancia NETA real de la operación
 *
 * FÓRMULA CORRECTA:
 * Utilidades = (Precio Venta por Unidad - Precio Compra por Unidad - Flete por Unidad) × Cantidad
 */
export function calcularMontoUtilidades(
  precioVentaUnidad: number,
  precioCompraUnidad: number,
  precioFlete: number,
  cantidad: number
): number {
  const utilidadPorUnidad = precioVentaUnidad - precioCompraUnidad - precioFlete;
  return utilidadPorUnidad * cantidad;
}

// ============================================================
// 📊 ALMACÉN
// ============================================================

/**
 * Stock Actual = Total Entradas - Total Salidas
 */
export function calcularStockActual(totalEntradas: number, totalSalidas: number): number {
  return totalEntradas - totalSalidas;
}

/**
 * Stock Disponible de una Orden de Compra
 * Stock Actual OC = Cantidad Original - Total Vendido de esa OC
 */
export function calcularStockOrdenCompra(
  cantidadOriginal: number,
  cantidadVendida: number
): number {
  return cantidadOriginal - cantidadVendida;
}

// ============================================================
// 💸 CAPITAL BANCARIO
// ============================================================

/**
 * Capital Actual = Histórico Ingresos - Histórico Gastos
 * Este es el capital ACTUAL disponible del banco
 */
export function calcularCapitalActual(historicoIngresos: number, historicoGastos: number): number {
  return historicoIngresos - historicoGastos;
}

/**
 * Validar si un banco tiene capital suficiente
 */
export function validarCapitalSuficiente(capitalActual: number, montoOperacion: number): boolean {
  return capitalActual >= montoOperacion;
}

// ============================================================
// 📈 ESTADÍSTICAS Y REPORTES
// ============================================================

/**
 * Calcular Ganancia Bruta Total
 * Suma de todas las ventas - Suma de todos los costos de compra
 */
export function calcularGananciaBruta(totalVentas: number, totalCostos: number): number {
  return totalVentas - totalCostos;
}

/**
 * Calcular Ganancia Neta
 * Ganancia Bruta - Gastos Operacionales
 */
export function calcularGananciaNeta(gananciaBruta: number, gastosOperacionales: number): number {
  return gananciaBruta - gastosOperacionales;
}

/**
 * Calcular Margen de Ganancia %
 * (Ganancia / Total Ventas) × 100
 */
export function calcularMargenGanancia(ganancia: number, totalVentas: number): number {
  if (totalVentas === 0) return 0;
  return (ganancia / totalVentas) * 100;
}

/**
 * Calcular ROI (Return on Investment)
 * ((Ganancia - Inversión) / Inversión) × 100
 */
export function calcularROI(ganancia: number, inversion: number): number {
  if (inversion === 0) return 0;
  return ((ganancia - inversion) / inversion) * 100;
}

/**
 * Calcular Total de Deudas por Cobrar (Clientes)
 */
export function calcularDeudaPorCobrar(ventas: Venta[]): number {
  return ventas.reduce((total, venta) => {
    if (venta.estadoPago !== 'completo') {
      return total + venta.montoRestante;
    }
    return total;
  }, 0);
}

/**
 * Calcular Total de Deudas por Pagar (Distribuidores)
 */
export function calcularDeudaPorPagar(ordenes: OrdenCompra[]): number {
  return ordenes.reduce((total, orden) => {
    if (orden.estado !== 'pagado') {
      return total + orden.deuda;
    }
    return total;
  }, 0);
}

/**
 * Calcular Liquidez Neta
 * Capital Total en Bancos - Deudas por Pagar
 */
export function calcularLiquidezNeta(capitalTotalBancos: number, deudasPorPagar: number): number {
  return capitalTotalBancos - deudasPorPagar;
}

// ============================================================
// 🎯 DISTRIBUCIÓN PROPORCIONAL DE PAGOS
// ============================================================

/**
 * Cuando un cliente paga parcialmente, distribuir proporcionalmente a los 3 bancos
 */
export function distribuirPagoParcialCliente(montoPagado: number, venta: Venta) {
  const proporcion = montoPagado / venta.precioTotalVenta;

  return {
    bovedaMonte: venta.montoBovedaMonte * proporcion,
    fletes: venta.montoFletes * proporcion,
    utilidades: venta.montoUtilidades * proporcion,
  };
}

/**
 * Calcular cuánto falta por pagar en porcentaje
 */
export function calcularPorcentajePagado(montoPagado: number, montoTotal: number): number {
  if (montoTotal === 0) return 0;
  return (montoPagado / montoTotal) * 100;
}

// ============================================================
// 📅 ANÁLISIS POR PERÍODO
// ============================================================

/**
 * Filtrar ventas por rango de fechas
 */
export function filtrarPorFecha<T extends { fecha: string }>(
  items: T[],
  fechaInicio: string,
  fechaFin: string
): T[] {
  return items.filter((item) => {
    return item.fecha >= fechaInicio && item.fecha <= fechaFin;
  });
}

/**
 * Calcular promedio de ventas por día
 */
export function calcularPromedioVentasDiarias(ventas: Venta[], dias: number): number {
  if (dias === 0) return 0;
  const totalVentas = ventas.reduce((sum, v) => sum + v.precioTotalVenta, 0);
  return totalVentas / dias;
}

/**
 * Calcular el producto más vendido
 */
export function calcularProductoMasVendido(ventas: Venta[]): {
  producto: string;
  cantidad: number;
  totalVentas: number;
} | null {
  if (ventas.length === 0) return null;

  const productos = ventas.reduce(
    (acc, venta) => {
      if (!acc[venta.producto]) {
        acc[venta.producto] = { cantidad: 0, totalVentas: 0 };
      }
      acc[venta.producto].cantidad += venta.cantidad;
      acc[venta.producto].totalVentas += venta.precioTotalVenta;
      return acc;
    },
    {} as Record<string, { cantidad: number; totalVentas: number }>
  );

  const [producto, datos] = Object.entries(productos).sort(
    (a, b) => b[1].cantidad - a[1].cantidad
  )[0];

  return {
    producto,
    ...datos,
  };
}

// ============================================================
// EXPORTS
// ============================================================

export default {
  // Órdenes de Compra
  calcularCostoPorUnidad,
  calcularCostoTotal,
  calcularDeudaDistribuidor,

  // Ventas
  calcularPrecioTotalUnidad,
  calcularPrecioTotalVenta,
  calcularMontoRestante,

  // Bancos
  calcularMontoBovedaMonte,
  calcularMontoFletes,
  calcularMontoUtilidades,
  calcularCapitalActual,
  validarCapitalSuficiente,

  // Almacén
  calcularStockActual,
  calcularStockOrdenCompra,

  // Estadísticas
  calcularGananciaBruta,
  calcularGananciaNeta,
  calcularMargenGanancia,
  calcularROI,
  calcularDeudaPorCobrar,
  calcularDeudaPorPagar,
  calcularLiquidezNeta,

  // Distribución
  distribuirPagoParcialCliente,
  calcularPorcentajePagado,

  // Análisis
  filtrarPorFecha,
  calcularPromedioVentasDiarias,
  calcularProductoMasVendido,
};
