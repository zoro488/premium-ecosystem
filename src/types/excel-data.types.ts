/**
 * Tipos TypeScript para los datos del Excel
 * Basados en BASE_DATOS_excel_data.json
 */

// ==================== VENTAS ====================
export interface Producto {
  nombre: string;
  cantidad: number;
  precio: number;
  subtotal: number;
}

export interface Venta {
  id: string;
  tipo: 'venta';
  fecha: string;
  ocRelacionada: string;
  cantidad: number;
  cliente: string;
  productos: Producto[];
  totalVenta: number;
  totalFletes: number;
  totalUtilidades: number;
  estatus: 'Pendiente' | 'Pagado' | 'Cancelado';
  estadoPago: 'pendiente' | 'pagado' | 'parcial';
  adeudo: number;
  montoPagado: number;
  destino: string;
  concepto: string;
  aplicaFlete: boolean;
  bovedaMonte?: number;
  bovedaUsa?: number;
}

// ==================== COMPRAS ====================
export interface ProductoCompra {
  nombre: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}

export interface Compra {
  id: string;
  tipo: 'compra';
  fecha: string;
  proveedor: string;
  productos: ProductoCompra[];
  totalCompra: number;
  estatus: string;
  estadoPago: string;
  ordenCompra: string;
  bovedaMonte?: number;
}

// ==================== DISTRIBUIDORES ====================
export interface Distribuidor {
  nombre: string;
  actual: string | number;
  deuda: number;
  abonos: number;
  pendiente: number;
  observaciones: string;
}

// ==================== CLIENTES ====================
export interface Cliente {
  cliente: string;
  actual: string | number;
  deuda: number;
  abonos: number;
  pendiente: number;
  observaciones: string;
}

// ==================== INVENTARIO ====================
export interface MovimientoInventario {
  tipo: 'entrada' | 'salida';
  fecha: string;
  cantidad: number;
  origen?: string;
  destino?: string;
}

export interface Inventario {
  fecha: string;
  panelNumero: string | number;
  movimientos: MovimientoInventario[];
}

// ==================== MOVIMIENTOS FINANCIEROS ====================
export interface Movimiento {
  id: string;
  tipo: 'gasto' | 'abono' | 'retiro' | 'transferencia';
  monto: number;
  fecha: string | null;
  concepto: string;
  banco: string;
  origen?: string;
  destino?: string;
}

// ==================== MÉTRICAS FINANCIERAS ====================
export interface MetricasFinancieras {
  capitalTotal: number;
  inventarioActual: number;
  carteraPorCobrar: number;
  cuentasPorPagar: number;
  utilidadTotal: number;
  costoTotalInventario: number;
  ventasTotales: number;
}

// ==================== ESTRUCTURA COMPLETA ====================
export interface DatosExcelCompletos {
  ventas: Venta[];
  compras: Compra[];
  distribuidores: Distribuidor[];
  clientes: Cliente[];
  inventario: Inventario[];
  movimientos: Movimiento[];
  metricasFinancieras: MetricasFinancieras;
}

// ==================== TIPOS PARA FORMULARIOS ====================
export interface VentaFormData {
  fecha: Date | string;
  cliente: string;
  productos: {
    nombre: string;
    cantidad: number;
    precio: number;
  }[];
  aplicaFlete: boolean;
  totalFletes: number;
  destino: 'bovedaMonte' | 'bovedaUsa';
  concepto?: string;
}

export interface CompraFormData {
  fecha: Date | string;
  proveedor: string;
  productos: {
    nombre: string;
    cantidad: number;
    precioUnitario: number;
  }[];
  ordenCompra: string;
  bovedaMonte?: number;
}

export interface ClienteFormData {
  cliente: string;
  actual: string | number;
  observaciones?: string;
}

export interface MovimientoFormData {
  tipo: 'gasto' | 'abono' | 'retiro' | 'transferencia';
  monto: number;
  fecha: Date | string;
  concepto: string;
  banco: string;
  origen?: string;
  destino?: string;
}

// ==================== TIPOS PARA TABLAS ====================
export type VentaRow = Venta & {
  clienteNombre?: string;
  totalProductos?: number;
  margenUtilidad?: number;
};

export type CompraRow = Compra & {
  proveedorNombre?: string;
  totalProductos?: number;
};

export type ClienteRow = Cliente & {
  estadoCuenta?: 'Al corriente' | 'Pendiente' | 'Atrasado';
  porcentajePendiente?: number;
};
