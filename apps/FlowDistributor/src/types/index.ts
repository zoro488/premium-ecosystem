// ============================================================================
// CHRONOS OS - TYPE DEFINITIONS
// Sistema de tipos completo para el ecosistema financiero
// ============================================================================

// ============================================================================
// VENTAS - Sistema de Ventas
// ============================================================================
export interface Venta {
  id: string;
  folio: string;
  fecha: Date | string;
  cliente: string;
  clienteId: string;
  productos: ProductoVenta[];

  // Cálculos FL/BM/UT
  precioVenta: number;
  flete: number; // FL = unidadesCaja * 500
  bovedaMonte: number; // BM = suma(cpUnit * quantity)
  utilidades: number; // UT = PV - FL - BM

  // Estado de pago
  estatus: 'Pagado' | 'Pendiente';
  fechaPago?: Date | string;
  metodoPago?: 'Efectivo' | 'Transferencia' | 'Cheque' | 'Tarjeta';

  // Distribución bancaria (solo si estatus = Pagado)
  banco?: 'BM' | 'FL' | 'UT' | 'AZTECA' | 'LEFTIE' | 'PROFIT' | 'BOVEDA_USA';

  // Metadata
  createdAt: Date | string;
  updatedAt: Date | string;
  createdBy: string;
  notas?: string;
}

export interface ProductoVenta {
  productoId: string;
  nombreProducto: string;
  cantidad: number;
  unidadesCaja: number;
  cpUnit: number; // Costo por unidad
  precioUnitario: number;
  subtotal: number;
}

// ============================================================================
// CLIENTES
// ============================================================================
export interface Cliente {
  id: string;
  nombre: string;
  razonSocial?: string;
  rfc?: string;

  // Contacto
  telefono?: string;
  email?: string;
  direccion?: string;
  ciudad?: string;
  estado?: string;

  // Financiero
  adeudo: number; // Calculado: sum(ventas.pendientes) - sum(abonos)
  limiteCredito?: number;
  diasCredito?: number;

  // Estado
  activo: boolean;

  // Metadata
  createdAt: Date | string;
  updatedAt: Date | string;
  notas?: string;
}

// ============================================================================
// BANCOS - Sistema de 7 Cuentas
// ============================================================================
export interface Banco {
  id: 'BM' | 'FL' | 'UT' | 'AZTECA' | 'LEFTIE' | 'PROFIT' | 'BOVEDA_USA';
  nombre: string;
  tipo: 'bucket' | 'operacional';

  // Capital
  capitalActual: number;
  capitalHistorico: CapitalHistorico[];

  // Configuración visual
  color: string;
  icono?: string;

  // Estado
  activo: boolean;

  // Metadata
  updatedAt: Date | string;
}

export interface CapitalHistorico {
  fecha: Date | string;
  capital: number;
  tipo: 'ingreso' | 'egreso' | 'transferencia';
  concepto: string;
  referenciaId?: string; // ID de la venta, gasto, o movimiento
}

// ============================================================================
// ALMACÉN - Inventario
// ============================================================================
export interface Producto {
  id: string;
  nombre: string;
  descripcion?: string;

  // Inventario
  existencia: number;
  unidad: string; // 'caja', 'pieza', 'kg', etc.
  unidadesPorCaja?: number;

  // Costos
  costoPromedio: number;
  costoUltimo: number;

  // Precios
  precioVenta: number;
  precioMayoreo?: number;
  precioMinimo?: number;

  // Categorización
  categoria?: string;
  subcategoria?: string;
  sku?: string;
  codigoBarras?: string;

  // Control
  stockMinimo?: number;
  stockMaximo?: number;

  // Estado
  activo: boolean;

  // Metadata
  createdAt: Date | string;
  updatedAt: Date | string;
  imagenUrl?: string;
}

// ============================================================================
// ÓRDENES DE COMPRA
// ============================================================================
export interface OrdenCompra {
  id: string;
  folio: string;
  fecha: Date | string;

  // Proveedor/Distribuidor
  distribuidor: string;
  distribuidorId: string;

  // Productos
  productos: ProductoOrden[];

  // Financiero
  subtotal: number;
  iva: number;
  total: number;

  // Estado
  estatus: 'Pendiente' | 'Recibida' | 'Parcial' | 'Cancelada';
  fechaRecepcion?: Date | string;

  // Pago
  estatusPago: 'Pendiente' | 'Pagado' | 'Parcial';
  montoPagado: number;

  // Metadata
  createdAt: Date | string;
  updatedAt: Date | string;
  notas?: string;
}

export interface ProductoOrden {
  productoId: string;
  nombreProducto: string;
  cantidad: number;
  cantidadRecibida?: number;
  costoUnitario: number;
  subtotal: number;
}

// ============================================================================
// DISTRIBUIDORES
// ============================================================================
export interface Distribuidor {
  id: string;
  nombre: string;
  razonSocial?: string;
  rfc?: string;

  // Contacto
  contacto?: string;
  telefono?: string;
  email?: string;
  direccion?: string;

  // Financiero
  adeudo: number; // Lo que nosotros debemos al distribuidor
  limiteCredito?: number;

  // Categorías de productos
  categorias?: string[];

  // Estado
  activo: boolean;

  // Metadata
  createdAt: Date | string;
  updatedAt: Date | string;
  notas?: string;
}

// ============================================================================
// GASTOS Y ABONOS
// ============================================================================
export interface Gasto {
  id: string;
  tipo: 'gasto' | 'abono' | 'transferencia';
  fecha: Date | string;

  // Concepto
  concepto: string;
  categoria?: string; // 'Operativo', 'Administrativo', 'Pago Cliente', etc.

  // Monto
  monto: number;

  // Banco origen/destino
  bancoOrigen: 'BM' | 'FL' | 'UT' | 'AZTECA' | 'LEFTIE' | 'PROFIT' | 'BOVEDA_USA';
  bancoDestino?: 'BM' | 'FL' | 'UT' | 'AZTECA' | 'LEFTIE' | 'PROFIT' | 'BOVEDA_USA';

  // Relaciones
  clienteId?: string; // Si es abono de cliente
  distribuidorId?: string; // Si es pago a distribuidor
  ventaId?: string; // Si es abono relacionado a venta

  // Metadata
  createdAt: Date | string;
  createdBy: string;
  notas?: string;
}

// ============================================================================
// MOVIMIENTOS BANCARIOS
// ============================================================================
export interface Movimiento {
  id: string;
  fecha: Date | string;
  banco: 'BM' | 'FL' | 'UT' | 'AZTECA' | 'LEFTIE' | 'PROFIT' | 'BOVEDA_USA';

  tipo: 'ingreso' | 'egreso' | 'transferencia';

  // Monto
  monto: number;
  saldoAnterior: number;
  saldoNuevo: number;

  // Origen
  origen: 'venta' | 'gasto' | 'abono' | 'transferencia' | 'ajuste';
  referenciaId?: string; // ID del documento origen

  // Descripción
  concepto: string;

  // Metadata
  createdAt: Date | string;
  createdBy: string;
}

// ============================================================================
// ANALYTICS & KPIs
// ============================================================================
export interface KPI {
  label: string;
  value: number;
  format: 'currency' | 'number' | 'percentage';
  trend?: number; // Porcentaje de cambio vs periodo anterior
  color?: string;
}

export interface ChartData {
  fecha: string;
  valor: number;
  label?: string;
}

export interface DistribucionBuckets {
  fl: number;
  bm: number;
  ut: number;
}

// ============================================================================
// USER & AUTH
// ============================================================================
export interface User {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  rol: 'admin' | 'gerente' | 'vendedor' | 'almacenista';
  permisos: string[];
  activo: boolean;
  createdAt: Date | string;
}

// ============================================================================
// CHRONOS AI - Comandos y Contexto
// ============================================================================
export interface ChronosCommand {
  comando: string;
  parametros?: Record<string, unknown>;
  contexto: string;
}

export interface ChronosResponse {
  exito: boolean;
  mensaje: string;
  data?: unknown;
  accion?: 'navigate' | 'show-data' | 'execute-calculation' | 'error';
}

// ============================================================================
// FILTERS & QUERIES
// ============================================================================
export interface FiltrosVentas {
  fechaInicio?: Date | string;
  fechaFin?: Date | string;
  clienteId?: string;
  estatus?: 'Pagado' | 'Pendiente';
  banco?: string;
}

export interface FiltrosGastos {
  fechaInicio?: Date | string;
  fechaFin?: Date | string;
  tipo?: 'gasto' | 'abono' | 'transferencia';
  banco?: string;
  categoria?: string;
}

// ============================================================================
// UTILS
// ============================================================================
export type BancoId = 'BM' | 'FL' | 'UT' | 'AZTECA' | 'LEFTIE' | 'PROFIT' | 'BOVEDA_USA';
export type EstatusVenta = 'Pagado' | 'Pendiente';
export type TipoGasto = 'gasto' | 'abono' | 'transferencia';
export type TipoMovimiento = 'ingreso' | 'egreso' | 'transferencia';
