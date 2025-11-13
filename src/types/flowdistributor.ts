/**
 * FlowDistributor System Types
 * @module types/flowdistributor
 */

import { Timestamp } from 'firebase/firestore';

// ============================================================================
// ENUMS
// ============================================================================

export enum EstadoPago {
  COMPLETO = 'completo',
  PARCIAL = 'parcial',
  PENDIENTE = 'pendiente',
}

export enum TipoBanco {
  BOVEDA_MONTE = 'boveda_monte',
  UTILIDADES = 'utilidades',
  FLETES = 'fletes',
  AZTECA = 'azteca',
  LEFTIE = 'leftie',
  PROFIT = 'profit',
}

export enum TipoMovimiento {
  INGRESO = 'ingreso',
  GASTO = 'gasto',
  TRANSFERENCIA = 'transferencia',
  VENTA = 'venta',
  ABONO_CLIENTE = 'abono_cliente',
  ABONO_DISTRIBUIDOR = 'abono_distribuidor',
}

export enum TipoMovimientoAlmacen {
  ENTRADA = 'entrada',
  SALIDA = 'salida',
}

// ============================================================================
// PRODUCTO
// ============================================================================

export interface Producto {
  id: string;
  nombre: string;
  descripcion?: string;
  sku?: string;
  precioCompra: number;
  precioVenta: number;
  precioFlete: number; // Default 500 USD
  stock: number;
  unidad: string;
  categoria?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// ============================================================================
// DISTRIBUIDOR
// ============================================================================

export interface Distribuidor {
  id: string;
  nombre: string;
  email?: string;
  telefono?: string;
  direccion?: string;
  rfc?: string;
  adeudoTotal: number;
  ordenesCompra: string[]; // IDs de órdenes
  historialPagos: HistorialPago[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface HistorialPago {
  id: string;
  monto: number;
  fecha: Timestamp;
  bancoOrigen: TipoBanco;
  concepto: string;
  saldoRestante: number;
}

// ============================================================================
// ORDEN DE COMPRA
// ============================================================================

export interface OrdenCompra {
  id: string;
  folio: string;
  distribuidorId: string;
  distribuidorNombre: string;
  productos: ItemOrdenCompra[];
  subtotal: number;
  impuestos: number;
  total: number;
  adeudoPendiente: number;
  estadoPago: EstadoPago;
  notas?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface ItemOrdenCompra {
  productoId: string;
  productoNombre: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}

// ============================================================================
// CLIENTE
// ============================================================================

export interface Cliente {
  id: string;
  nombre: string;
  email?: string;
  telefono?: string;
  direccion?: string;
  rfc?: string;
  adeudoTotal: number;
  ventas: string[]; // IDs de ventas
  historialAbonos: HistorialAbono[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface HistorialAbono {
  id: string;
  ventaId: string;
  monto: number;
  fecha: Timestamp;
  saldoRestante: number;
  notas?: string;
}

// ============================================================================
// VENTA
// ============================================================================

export interface Venta {
  id: string;
  folio: string;
  clienteId: string;
  clienteNombre: string;
  productos: ItemVenta[];
  subtotal: number;
  fleteTotal: number;
  total: number;
  montoPagado: number;
  adeudoPendiente: number;
  estadoPago: EstadoPago;
  distribucionBancos: DistribucionVenta;
  notas?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface ItemVenta {
  productoId: string;
  productoNombre: string;
  cantidad: number;
  precioUnitario: number;
  precioFlete: number; // Default 500 USD, editable
  precioTotal: number; // precioUnitario + precioFlete
  subtotal: number; // precioTotal * cantidad
}

export interface DistribucionVenta {
  bovedaMonte: number; // Monto total de venta
  utilidades: number; // Utilidad por unidad * cantidad
  fletes: number; // Flete por unidad * cantidad
}

// ============================================================================
// BANCO
// ============================================================================

export interface Banco {
  id: string;
  tipo: TipoBanco;
  nombre: string;
  capitalActual: number;
  historicoIngresos: number; // Acumulado de ingresos (nunca disminuye)
  historicoGastos: number; // Acumulado de gastos
  historicoTransferenciasEnviadas: number;
  historicoTransferenciasRecibidas: number;
  movimientos: Movimiento[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Movimiento {
  id: string;
  tipo: TipoMovimiento;
  monto: number;
  concepto: string;
  descripcion?: string;
  bancoOrigenId?: string;
  bancoDestinoId?: string;
  ventaId?: string;
  clienteId?: string;
  distribuidorId?: string;
  fecha: Timestamp;
  capitalDespues: number; // Capital del banco después del movimiento
}

// ============================================================================
// ALMACÉN
// ============================================================================

export interface Almacen {
  id: string;
  productoId: string;
  productoNombre: string;
  stockActual: number;
  entradas: MovimientoAlmacen[];
  salidas: MovimientoAlmacen[];
  historicoEntradas: number; // Total acumulado (nunca disminuye)
  historicoSalidas: number; // Total acumulado (nunca disminuye)
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface MovimientoAlmacen {
  id: string;
  tipo: TipoMovimientoAlmacen;
  cantidad: number;
  ordenCompraId?: string;
  ventaId?: string;
  referencia: string;
  fecha: Timestamp;
  stockDespues: number; // Stock después del movimiento
}

// ============================================================================
// GASTO
// ============================================================================

export interface Gasto {
  id: string;
  bancoId: string;
  bancoNombre: string;
  monto: number;
  concepto: string;
  descripcion?: string;
  categoria?: string;
  distribuidorId?: string; // Si es pago a distribuidor
  fecha: Timestamp;
  createdAt: Timestamp;
}

// ============================================================================
// TRANSFERENCIA
// ============================================================================

export interface Transferencia {
  id: string;
  bancoOrigenId: string;
  bancoOrigenNombre: string;
  bancoDestinoId: string;
  bancoDestinoNombre: string;
  monto: number;
  concepto: string;
  descripcion?: string;
  fecha: Timestamp;
  createdAt: Timestamp;
}

// ============================================================================
// DASHBOARD / KPIs
// ============================================================================

export interface DashboardData {
  totalCapitalBancos: number;
  totalAdeudosDistribuidores: number;
  totalAdeudosClientes: number;
  totalInventario: number;
  ventasMes: number;
  comprasMes: number;
  gastosMes: number;
  utilidadMes: number;
  bancos: BancoResumen[];
  topClientes: ClienteResumen[];
  topProductos: ProductoResumen[];
  alertas: Alerta[];
}

export interface BancoResumen {
  tipo: TipoBanco;
  nombre: string;
  capitalActual: number;
  historicoIngresos: number;
  historicoGastos: number;
  porcentajeCapital: number;
}

export interface ClienteResumen {
  id: string;
  nombre: string;
  totalCompras: number;
  adeudo: number;
  ultimaCompra: Timestamp;
}

export interface ProductoResumen {
  id: string;
  nombre: string;
  cantidadVendida: number;
  ingresos: number;
  stock: number;
}

export interface Alerta {
  tipo: 'stock_bajo' | 'adeudo_alto' | 'capital_bajo' | 'sin_ventas';
  severidad: 'info' | 'warning' | 'error';
  mensaje: string;
  fecha: Timestamp;
  datos?: any;
}

// ============================================================================
// FORMS DATA
// ============================================================================

export interface OrdenCompraFormData {
  distribuidorId?: string;
  distribuidorNombre: string;
  distribuidorEmail?: string;
  distribuidorTelefono?: string;
  productos: {
    productoId: string;
    cantidad: number;
    precioUnitario: number;
  }[];
  notas?: string;
}

export interface VentaFormData {
  clienteId?: string;
  clienteNombre: string;
  clienteEmail?: string;
  clienteTelefono?: string;
  productos: {
    productoId: string;
    cantidad: number;
    precioUnitario: number;
    precioFlete: number; // Default 500, editable
  }[];
  estadoPago: EstadoPago;
  montoPagado?: number; // Solo si es parcial
  notas?: string;
}

export interface AbonoClienteFormData {
  clienteId: string;
  monto: number;
  notas?: string;
}

export interface AbonoDistribuidorFormData {
  distribuidorId: string;
  monto: number;
  bancoOrigen: TipoBanco;
  concepto: string;
}

export interface GastoFormData {
  bancoId: string;
  monto: number;
  concepto: string;
  descripcion?: string;
  categoria?: string;
}

export interface TransferenciaFormData {
  bancoOrigenId: string;
  bancoDestinoId: string;
  monto: number;
  concepto: string;
  descripcion?: string;
}

export interface IngresoFormData {
  bancoId: string;
  monto: number;
  concepto: string;
  descripcion?: string;
}
