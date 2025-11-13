/**
 * 💰 TIPOS DE VENTAS - FlowDistributor
 * @module FlowDistributor/types/ventas
 *
 * Tipos centralizados para todo el módulo de ventas
 */

// ==================== ESTADOS ====================

/**
 * Estados posibles de una venta
 */
export type VentaEstado =
  | 'DRAFT' // Borrador, no confirmada
  | 'CONFIRMED' // Confirmada, pendiente de pago
  | 'PAID' // Pagada completamente
  | 'PARTIALLY_PAID' // Pagada parcialmente
  | 'CANCELLED' // Cancelada
  | 'PENDIENTE' // Legacy: Pendiente (español)
  | 'PAGADA' // Legacy: Pagada (español)
  | 'CREDITO' // Legacy: A crédito (español)
  | 'CANCELADA' // Legacy: Cancelada (español)
  | 'PENDING' // Alias: Pendiente
  | 'SHIPPED' // Enviada
  | 'DELIVERED'; // Entregada

/**
 * Estados de pago de una venta
 */
export type VentaPagoEstado =
  | 'PENDING' // Pendiente de pago
  | 'PARTIAL' // Pago parcial
  | 'COMPLETED' // Pago completo
  | 'OVERDUE' // Pago vencido
  | 'CANCELLED'; // Cancelado

/**
 * Alias en español para compatibilidad
 */
export type EstadoPago = 'Pendiente' | 'Parcial' | 'Pagado';

// ==================== DISTRIBUCIÓN ====================

/**
 * Distribución de utilidades entre bóvedas
 * ⚠️ Esta distribución se activa SOLO cuando el cliente PAGA
 */
export interface VentaDistribucion {
  /** Bóveda Monte: Recupera el COSTO de la mercancía */
  bovedaMonte: number;

  /** Flete Sur: Costo de flete (si aplica) */
  fleteSur: number;

  /** Utilidades: Utilidad neta (Venta - Costo - Flete) */
  utilidades: number;

  /** Total distribuido (debe ser igual a ingresoVenta) */
  totalDistribuido: number;
}

// ==================== PRODUCTOS EN VENTA ====================

/**
 * Producto individual en una venta
 */
export interface VentaProducto {
  /** SKU o código del producto */
  sku: string;

  /** Nombre del producto */
  nombre: string;

  /** Descripción opcional */
  descripcion?: string;

  /** Cantidad vendida */
  cantidad: number;

  /** Precio unitario en USD */
  precioUnitario: number;

  /** Descuento aplicado (0-100%) */
  descuento?: number;

  /** Subtotal (cantidad * precio - descuento) */
  subtotal: number;

  /** Impuestos aplicados */
  impuestos?: number;

  /** Total del producto */
  total: number;

  /** Costo unitario (para calcular margen) */
  costoUnitario?: number;
}

// ==================== VENTA PRINCIPAL ====================

/**
 * Interfaz principal de Venta
 * Incluye toda la información de una transacción de venta
 */
export interface Venta {
  /** ID único de la venta */
  id?: string;

  /** Número de venta (ej: V0001, V0002) */
  numeroVenta?: string;

  /** Folio de la venta */
  folio?: string;

  // ==================== FECHAS ====================

  /** Fecha de la venta */
  fecha: string;

  /** Fecha estimada de entrega */
  fechaEntrega?: string;

  /** Fecha de pago */
  fechaPago?: string;

  // ==================== CLIENTE ====================

  /** ID del cliente */
  clienteId?: string;

  /** Nombre del cliente (legacy) */
  cliente?: string;

  /** Nombre completo del cliente */
  clientName?: string;

  // ==================== PRODUCTOS ====================

  /** Lista de productos vendidos */
  productos?: VentaProducto[];

  /** ID de producto (legacy, cuando es venta simple) */
  productoId?: string;

  /** Cantidad total (legacy) */
  cantidad: number;

  // ==================== ORDEN DE COMPRA ====================

  /** OC relacionada (para tracking de inventario) */
  ocRelacionada?: string;

  // ==================== MONTOS ====================

  /** Precio de venta unitario en USD (legacy) */
  precioVenta?: number;

  /** Costo unitario del producto en USD */
  costoUnidad?: number;

  /** Subtotal de la venta */
  subtotal?: number;

  /** Descuento aplicado */
  descuento?: number;

  /** Impuestos */
  impuestos?: number;

  /** Total de la venta (USD) */
  totalVenta?: number;

  /** Total amount (alias) */
  totalAmountUSD?: number;

  // ==================== COSTOS ====================

  /** Costo del producto */
  costoProducto?: number;

  /** Costo de flete */
  costoFlete?: number;

  /** Costo operativo */
  costoOperativo?: number;

  /** Costo total */
  costoTotal?: number;

  // ==================== FLETES ====================

  /** Indica si aplica flete */
  aplicaFlete?: boolean;

  /** Monto del flete */
  flete?: number;

  /** Monto de flete (alias) */
  montoFlete?: number;

  /** Nombre del servicio de flete */
  fleteNombre?: string;

  // ==================== UTILIDADES ====================

  /** Utilidad bruta (Venta - Costo Producto) */
  utilidadBruta?: number;

  /** Utilidad neta (Venta - Todos los Costos) */
  utilidadNeta?: number;

  /** Total de utilidades (legacy) */
  totalUtilidades?: number;

  /** Margen de ganancia (0-100%) */
  margen?: number;

  // ==================== DISTRIBUCIÓN A BÓVEDAS ====================

  /** Distribución automática cuando se paga */
  distribucion?: VentaDistribucion;

  /** Monto asignado a Bóveda Monte (legacy) */
  bovedaMonte?: number;

  /** Utilidad del flete (legacy) */
  fleteUtilidad?: number;

  // ==================== ESTADO Y PAGOS ====================

  /** Estado de la venta */
  estado?: VentaEstado;

  /** Estado del pago */
  estadoPago?: VentaPagoEstado | EstadoPago;

  /** Estatus (legacy) */
  estatus?: string;

  /** Monto total pagado */
  montoPagado?: number;

  /** Adeudo pendiente */
  adeudo?: number;

  /** Ingreso registrado (legacy) */
  ingreso?: number;

  // ==================== MONEDA Y TIPO DE CAMBIO ====================

  /** Moneda de la transacción */
  moneda?: 'USD' | 'MXN';

  /** Tipo de cambio USD/MXN aplicado */
  tipoCambio?: number;

  /** Monto en MXN */
  totalAmountMXN?: number;

  // ==================== PAGO Y FACTURACIÓN ====================

  /** Método de pago */
  metodoPago?: string;

  /** Condiciones de pago */
  condicionPago?: string;

  /** Concepto de la venta */
  concepto?: string;

  /** Observaciones */
  observaciones?: string;

  /** ID de factura */
  factura?: string;

  /** Número de remisión */
  remision?: string;

  /** URLs de comprobantes */
  comprobantes?: string[];

  // ==================== METADATA ====================

  /** Fecha de creación */
  createdAt?: Date | string | any;

  /** Fecha de última actualización */
  updatedAt?: Date | string | any;

  /** Usuario que creó la venta */
  createdBy?: string;
}

// ==================== DTOs ====================

/**
 * DTO para crear una nueva venta
 */
export type VentaCreateDTO = Omit<Venta, 'id' | 'createdAt' | 'updatedAt'>;

/**
 * DTO para actualizar una venta existente
 */
export type VentaUpdateDTO = Partial<Omit<Venta, 'id' | 'createdAt'>>;

// ==================== FILTROS ====================

/**
 * Filtros para consultar ventas
 */
export interface VentasFiltros {
  /** Filtrar por cliente */
  clienteId?: string | string[];

  /** Filtrar por tipo de cliente */
  clientType?: 'REGULAR' | 'WHOLESALE' | 'INTERNAL';

  /** Filtrar por estado */
  estado?: VentaEstado | VentaEstado[];

  /** Filtrar por estado de pago */
  estadoPago?: VentaPagoEstado | VentaPagoEstado[];

  /** Rango de fechas */
  fechaDesde?: string;
  fechaHasta?: string;

  /** Rango de montos */
  montoMin?: number;
  montoMax?: number;

  /** Búsqueda por texto */
  busqueda?: string;
}

// ==================== RESUMEN ====================

/**
 * Resumen de ventas para dashboard
 */
export interface VentasResumen {
  /** Total de ventas */
  totalVentas: number;

  /** Monto total vendido */
  montoTotal: number;

  /** Total de utilidades */
  utilidadesTotal: number;

  /** Margen promedio */
  margenPromedio: number;

  /** Ticket promedio */
  ticketPromedio: number;

  /** Total adeudado */
  adeudoTotal: number;

  /** Ventas pendientes de pago */
  ventasPendientes: number;
}

// ==================== ESTADÍSTICAS ====================

/**
 * Estadísticas de ventas por período
 */
export interface VentasEstadisticas {
  /** Período actual */
  periodoActual: VentasResumen;

  /** Período anterior (para comparación) */
  periodoAnterior: VentasResumen;

  /** Crecimiento en porcentaje */
  crecimiento: {
    ventas: number;
    monto: number;
    utilidades: number;
    margen: number;
  };
}

// ==================== EXPORTACIONES ====================

export type {
  VentaDistribucion as VentaDistribucionType,
  VentaProducto as VentaProductoType,
  Venta as VentaType,
};
