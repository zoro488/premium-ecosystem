/**
 * 📊 TIPOS TYPESCRIPT - FLOWDISTRIBUTOR
 * =====================================
 * Definiciones completas de tipos para todo el sistema
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
  BOVEDA_USA = 'boveda_usa',
}

export enum TipoOperacion {
  VENTA = 'venta',
  COMPRA = 'compra',
  GASTO = 'gasto',
  TRANSFERENCIA = 'transferencia',
  ABONO_CLIENTE = 'abono_cliente',
  ABONO_DISTRIBUIDOR = 'abono_distribuidor',
  INGRESO = 'ingreso',
  ENTRADA_STOCK = 'entrada_stock',
  SALIDA_STOCK = 'salida_stock',
}

export enum EstadoOrdenCompra {
  PENDIENTE = 'pendiente',
  PAGADA_COMPLETO = 'pagada_completo',
  PAGADA_PARCIAL = 'pagada_parcial',
}

// ============================================================================
// INTERFACES PRINCIPALES
// ============================================================================

/**
 * Banco (7 bancos del sistema)
 */
export interface Banco {
  id: string;
  tipo: TipoBanco;
  nombre: string;
  capital: number; // Capital actual disponible
  capitalHistorico: number; // Suma total histórica (nunca disminuye)
  totalGastos: number; // Suma de todos los gastos
  totalTransferenciasEnviadas: number;
  totalTransferenciasRecibidas: number;
  fechaCreacion: Timestamp;
  fechaActualizacion: Timestamp;
  metadata?: Record<string, any>;
}

/**
 * Producto
 */
export interface Producto {
  id: string;
  nombre: string;
  descripcion?: string;
  skuCode?: string;
  precioCompra: number; // Precio al que compramos
  precioVenta: number; // Precio al que vendemos
  precioFleteDefault: number; // 500 USD por defecto
  stockActual: number; // Stock disponible actualmente
  stockMinimo?: number; // Alerta de bajo stock
  unidadMedida: string; // "unidad", "caja", "pallet", etc.
  categoria?: string;
  fechaCreacion: Timestamp;
  fechaActualizacion: Timestamp;
}

/**
 * Distribuidor
 */
export interface Distribuidor {
  id: string;
  nombre: string;
  empresa?: string;
  contacto?: string;
  telefono?: string;
  email?: string;
  direccion?: string;
  totalOrdenesCompra: number; // Número de OC
  montoTotalComprado: number; // Suma total de todas las OC
  adeudoPendiente: number; // Lo que le debemos
  historialPagos: Pago[]; // Abonos que hemos hecho
  fechaCreacion: Timestamp;
  fechaActualizacion: Timestamp;
  notas?: string;
}

/**
 * Cliente
 */
export interface Cliente {
  id: string;
  nombre: string;
  empresa?: string;
  contacto?: string;
  telefono?: string;
  email?: string;
  direccion?: string;
  totalVentas: number; // Número de ventas
  montoTotalVendido: number; // Suma total de ventas
  adeudoPendiente: number; // Lo que nos debe
  historialPagos: Pago[]; // Abonos que ha hecho
  fechaCreacion: Timestamp;
  fechaActualizacion: Timestamp;
  notas?: string;
  clasificacion?: 'VIP' | 'Regular' | 'Moroso';
}

/**
 * Orden de Compra
 */
export interface OrdenCompra {
  id: string;
  numeroOrden: string; // OC-001, OC-002, etc.
  distribuidorId: string;
  distribuidorNombre: string;
  productos: ProductoOrdenCompra[];
  subtotal: number; // Suma de productos
  impuestos?: number;
  descuentos?: number;
  total: number; // Total a pagar al distribuidor
  estadoPago: EstadoOrdenCompra;
  montoPagado: number;
  montoRestante: number;
  fechaOrden: Timestamp;
  fechaEntregaEstimada?: Timestamp;
  fechaEntregaReal?: Timestamp;
  fechaCreacion: Timestamp;
  fechaActualizacion: Timestamp;
  notas?: string;
  usuarioCreador?: string;
}

export interface ProductoOrdenCompra {
  productoId: string;
  productoNombre: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}

/**
 * Venta
 */
export interface Venta {
  id: string;
  numeroVenta: string; // V-001, V-002, etc.
  clienteId: string;
  clienteNombre: string;
  productos: ProductoVenta[];
  subtotalProductos: number; // Suma de productos sin flete
  totalFletes: number; // Suma de todos los fletes
  subtotal: number; // subtotalProductos + totalFletes
  impuestos?: number;
  descuentos?: number;
  total: number; // Total que debe pagar el cliente
  estadoPago: EstadoPago;
  montoPagado: number;
  montoRestante: number;
  // Distribución automática en bancos
  montoBOVedaMonte: number; // Total de la venta (precio venta * cantidad)
  montoUtilidades: number; // Utilidad por unidad * cantidad
  montoFletes: number; // Flete por unidad * cantidad
  fechaVenta: Timestamp;
  fechaCreacion: Timestamp;
  fechaActualizacion: Timestamp;
  notas?: string;
  usuarioCreador?: string;
}

export interface ProductoVenta {
  productoId: string;
  productoNombre: string;
  cantidad: number;
  precioCompra: number; // Precio al que lo compramos
  precioVenta: number; // Precio al que lo vendemos
  precioFlete: number; // Flete por unidad (default 500 USD, editable)
  precioTotalUnitario: number; // precioVenta + precioFlete
  utilidadUnitaria: number; // precioVenta - precioCompra
  subtotal: number; // (precioVenta + precioFlete) * cantidad
}

/**
 * Pago (Abono)
 */
export interface Pago {
  id: string;
  tipo: 'abono_cliente' | 'abono_distribuidor';
  clienteId?: string;
  distribuidorId?: string;
  monto: number;
  bancoOrigenId?: string; // Banco del que sale el dinero (para distribuidores)
  bancoOrigenNombre?: string;
  concepto: string;
  descripcion?: string;
  adeudoAnterior: number;
  adeudoNuevo: number;
  fechaPago: Timestamp;
  fechaCreacion: Timestamp;
  usuarioCreador?: string;
}

/**
 * Gasto
 */
export interface Gasto {
  id: string;
  bancoId: string;
  bancoNombre: string;
  concepto: string;
  descripcion?: string;
  monto: number;
  categoria?: string; // "operativo", "administrativo", "marketing", etc.
  fechaGasto: Timestamp;
  fechaCreacion: Timestamp;
  usuarioCreador?: string;
  comprobante?: string; // URL de comprobante
}

/**
 * Transferencia entre bancos
 */
export interface Transferencia {
  id: string;
  bancoOrigenId: string;
  bancoOrigenNombre: string;
  bancoDestinoId: string;
  bancoDestinoNombre: string;
  monto: number;
  concepto: string;
  descripcion?: string;
  fechaTransferencia: Timestamp;
  fechaCreacion: Timestamp;
  usuarioCreador?: string;
}

/**
 * Ingreso (para bancos Azteca, Leftie, Profit)
 */
export interface Ingreso {
  id: string;
  bancoId: string;
  bancoNombre: string;
  concepto: string;
  descripcion?: string;
  monto: number;
  fuente?: string; // "deposito", "transferencia_externa", etc.
  fechaIngreso: Timestamp;
  fechaCreacion: Timestamp;
  usuarioCreador?: string;
  comprobante?: string;
}

/**
 * Movimiento de Stock (Almacén)
 */
export interface MovimientoStock {
  id: string;
  tipo: 'entrada' | 'salida';
  productoId: string;
  productoNombre: string;
  cantidad: number;
  stockAnterior: number;
  stockNuevo: number;
  // Referencia a la operación que generó el movimiento
  origenTipo: 'orden_compra' | 'venta' | 'ajuste' | 'devolucion';
  origenId?: string; // ID de la OC o Venta
  concepto: string;
  fechaMovimiento: Timestamp;
  fechaCreacion: Timestamp;
  usuarioCreador?: string;
  notas?: string;
}

/**
 * Historial de Operaciones (Auditoría)
 */
export interface HistorialOperacion {
  id: string;
  tipo: TipoOperacion;
  entidad: string; // "banco", "cliente", "distribuidor", "stock", etc.
  entidadId: string;
  descripcion: string;
  datosAntes?: any;
  datosDespues?: any;
  montoAfectado?: number;
  usuarioId?: string;
  usuarioNombre?: string;
  fechaOperacion: Timestamp;
  fechaCreacion: Timestamp;
  metadata?: Record<string, any>;
}

// ============================================================================
// TIPOS PARA UI Y FORMS
// ============================================================================

/**
 * Form de Orden de Compra
 */
export interface OrdenCompraFormData {
  distribuidorNombre: string;
  distribuidorContacto?: string;
  distribuidorTelefono?: string;
  distribuidorEmail?: string;
  productos: {
    productoId: string;
    productoNombre: string;
    cantidad: number;
    precioUnitario: number;
  }[];
  fechaEntregaEstimada?: Date;
  notas?: string;
}

/**
 * Form de Venta
 */
export interface VentaFormData {
  clienteNombre: string;
  clienteContacto?: string;
  clienteTelefono?: string;
  clienteEmail?: string;
  productos: {
    productoId: string;
    productoNombre: string;
    cantidad: number;
    precioVenta: number;
    precioFlete: number; // Default 500, editable
  }[];
  estadoPago: EstadoPago;
  montoPagado?: number; // Solo si es PARCIAL
  notas?: string;
}

/**
 * Form de Abono Cliente
 */
export interface AbonoClienteFormData {
  clienteId: string;
  monto: number;
  concepto: string;
  descripcion?: string;
}

/**
 * Form de Abono Distribuidor
 */
export interface AbonoDistribuidorFormData {
  distribuidorId: string;
  monto: number;
  bancoOrigenId: string; // Banco del que sale el pago
  concepto: string;
  descripcion?: string;
}

/**
 * Form de Gasto
 */
export interface GastoFormData {
  bancoId: string;
  concepto: string;
  descripcion?: string;
  monto: number;
  categoria?: string;
  fechaGasto?: Date;
}

/**
 * Form de Transferencia
 */
export interface TransferenciaFormData {
  bancoOrigenId: string;
  bancoDestinoId: string;
  monto: number;
  concepto: string;
  descripcion?: string;
}

/**
 * Form de Ingreso
 */
export interface IngresoFormData {
  bancoId: string;
  concepto: string;
  descripcion?: string;
  monto: number;
  fuente?: string;
  fechaIngreso?: Date;
}

// ============================================================================
// TIPOS PARA ANALYTICS Y DASHBOARDS
// ============================================================================

export interface MetricaBanco {
  bancoId: string;
  bancoNombre: string;
  capital: number;
  capitalHistorico: number;
  totalGastos: number;
  totalTransferencias: number;
  porcentajeCapitalTotal: number;
  tendencia: 'alcista' | 'bajista' | 'estable';
}

export interface MetricaVentas {
  totalVentas: number;
  montoTotalVendido: number;
  ventasCompletas: number;
  ventasParciales: number;
  ventasPendientes: number;
  promedioVenta: number;
  topProductos: { productoNombre: string; cantidad: number; monto: number }[];
  topClientes: { clienteNombre: string; totalCompras: number; monto: number }[];
}

export interface MetricaAlmacen {
  totalProductos: number;
  stockTotal: number;
  productosbajoStock: number;
  totalEntradas: number;
  totalSalidas: number;
  valorInventario: number;
}

export interface DashboardData {
  bancos: MetricaBanco[];
  ventas: MetricaVentas;
  almacen: MetricaAlmacen;
  adeudosClientes: number;
  adeudosDistribuidores: number;
  flujoEfectivoNeto: number;
  saludFinanciera: number; // 0-100
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

export type FirestoreDoc<T> = T & {
  id: string;
  _createdAt?: Timestamp;
  _updatedAt?: Timestamp;
};

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type RequireFields<T, K extends keyof T> = T & Required<Pick<T, K>>;
