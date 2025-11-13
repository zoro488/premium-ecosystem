/**
 * 🎯 TYPES & INTERFACES - FlowDistributor Supreme 2025
 * Sistema de 8 Bóvedas con distribución automática en USD
 *
 * Adaptado de REFACTORIZAR pero ELEVADO con:
 * - 8 bóvedas (no 6)
 * - Transferencias entre bóvedas
 * - Cortes automáticos configurables
 * - Exchange rate real-time USD/MXN
 * - Traceability completa de inventario
 */

// ==================== TIPOS BASE ====================

export type Currency = 'USD' | 'MXN';
export type TransactionType = 'INCOME' | 'EXPENSE' | 'TRANSFER' | 'DISTRIBUTION' | 'CUT';
export type TransactionStatus = 'PENDING' | 'COMPLETED' | 'CANCELLED' | 'FAILED';
export type BankCode = 'BM' | 'BS' | 'AZ' | 'UT' | 'FL' | 'LF' | 'PR' | 'CL';
export type CutFrequency =
  | 'DAILY'
  | 'WEEKLY'
  | 'BIWEEKLY'
  | 'MONTHLY'
  | 'QUARTERLY'
  | 'YEARLY'
  | 'MANUAL';
export type TrendType = 'GROWING' | 'DECLINING' | 'STABLE';

// ==================== BÓVEDAS (8 Banks) ====================

export interface Bank {
  id: string;
  code: BankCode;
  name: string;
  description: string;
  color: string; // Tailwind color class
  balance: number; // USD
  balanceMXN?: number; // Calculated MXN
  totalIncome: number;
  totalExpenses: number;
  icon: string; // Lucide icon name
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BankDetails extends Bank {
  transactions: Transaction[];
  cuts: Cut[];
  transfers: Transfer[];
  statistics: BankStatistics;
}

export interface BankStatistics {
  currentPeriod: {
    income: number;
    expenses: number;
    net: number;
  };
  previousPeriod: {
    income: number;
    expenses: number;
    net: number;
  };
  trend: TrendType;
  growth: number; // Percentage
}

// ==================== TRANSACCIONES ====================

export interface Transaction {
  id: string;
  type: TransactionType;
  bankCode: BankCode;
  bankName: string;

  // Montos
  amountUSD: number;
  amountMXN?: number;
  exchangeRate?: number; // USD to MXN rate applied

  // Metadata
  concept: string;
  description?: string;
  category?: string;
  reference?: string; // Order ID, Sale ID, etc.

  // Audit
  status: TransactionStatus;
  createdAt: string;
  createdBy: string;
  updatedAt?: string;
  notes?: string;
}

// ==================== TRANSFERENCIAS ====================

export interface Transfer {
  id: string;

  // Origen
  fromBank: BankCode;
  fromBankName: string;

  // Destino
  toBank: BankCode;
  toBankName: string;

  // Montos
  amountUSD: number;
  amountMXN: number;
  exchangeRate: number;

  // Conversión especial para Profit (casa de cambio)
  conversionType?: 'USD_TO_MXN' | 'MXN_TO_USD';

  // Metadata
  concept: string;
  category?: string;
  receipt?: string; // URL to receipt
  notes?: string;

  // Audit
  status: TransactionStatus;
  createdAt: string;
  createdBy: string;
  completedAt?: string;
  cancelledAt?: string;
}

// ==================== CORTES (RF ACTUAL) ====================

export interface Cut {
  id: string;

  // Entidad
  entityType: 'BANK' | 'WAREHOUSE';
  entityCode: BankCode | 'WAREHOUSE';
  entityName: string;

  // Fecha y tipo
  date: string;
  type: 'AUTOMATIC' | 'MANUAL';
  frequency?: CutFrequency;

  // Valores del corte
  previousBalance: number;
  currentBalance: number;
  difference: number;
  percentageChange: number;

  // Detalles adicionales
  details: {
    income?: number;
    expenses?: number;
    transfersIn?: number;
    transfersOut?: number;

    // Para warehouse
    stockUnits?: number;
    stockValueUSD?: number;
    entries?: number;
    exits?: number;
  };

  // Movimientos
  transactionsCount: number;

  // Metadata
  concept?: string;
  notes?: string;
  createdAt: string;
  createdBy: string;
}

export interface CutConfiguration {
  entityType: 'BANK' | 'WAREHOUSE';
  entityCode: string;
  frequency: CutFrequency;
  dayOfExecution: number; // 1-31 for month, 0-6 for week
  timeOfExecution: string; // HH:mm format
  isAutomatic: boolean;
  lastCut?: string;
  nextCut?: string;
  notifyBeforeHours: number;
  isActive: boolean;
}

// ==================== ÓRDENES DE COMPRA ====================

export interface PurchaseOrder {
  id: string; // OC0001, OC0002, etc.
  date: string;
  supplier: string;
  supplierCode: string;

  // Cantidades
  quantity: number;
  unit: string; // 'pz', 'kg', etc.

  // Costos
  supplierCostUSD: number;
  transportCostUSD: number;
  costPerUnitUSD: number;
  totalCostUSD: number;

  // MXN
  supplierCostMXN?: number;
  transportCostMXN?: number;
  totalCostMXN?: number;
  exchangeRate?: number;

  // Stock
  currentStock: number;

  // Pagos
  paidToSupplier: number;
  debt: number;

  // Status
  status: 'PENDING' | 'IN_TRANSIT' | 'RECEIVED' | 'COMPLETED' | 'CANCELLED';

  // Audit
  createdAt: string;
  updatedAt?: string;
  notes?: string;
}

// ==================== VENTAS ====================

export interface Sale {
  id: string; // V0001, V0002, etc.
  date: string;

  // Cliente
  clientId: string;
  clientName: string;
  clientType?: 'REGULAR' | 'WHOLESALE' | 'INTERNAL';

  // Cantidades
  quantity: number;
  unit: string;

  // Precios
  pricePerUnitUSD: number;
  totalAmountUSD: number;

  // Costo (para margen)
  costPerUnitUSD?: number;
  totalCostUSD?: number;
  marginUSD?: number;
  marginPercentage?: number;

  // MXN
  totalAmountMXN?: number;
  exchangeRate?: number;

  // Distribución a bancos
  distribution?: {
    bovedaMonte: number; // 30% profit
    utilities: number;
    fletes: number;
    azteca: number;
    leftie: number;
    profit: number;
  };

  // Pagos
  totalPaid: number;
  debt: number;

  // Status
  status: 'DRAFT' | 'CONFIRMED' | 'PAID' | 'PARTIALLY_PAID' | 'CANCELLED';
  paymentStatus: 'PENDING' | 'PARTIAL' | 'COMPLETED';

  // Metadata
  concept?: string;
  notes?: string;

  // Audit
  createdAt: string;
  createdBy: string;
  updatedAt?: string;
}

// ==================== CLIENTES ====================

export interface Client {
  id: string;
  name: string;
  type: 'REGULAR' | 'WHOLESALE' | 'INTERNAL';

  // Financiero
  totalPurchased: number;
  totalPaid: number;
  currentDebt: number;
  creditLimit?: number;

  // Contacto
  email?: string;
  phone?: string;
  address?: string;

  // Status
  status: 'ACTIVE' | 'INACTIVE' | 'BLOCKED';

  // Historial
  sales: Sale[];
  payments: Payment[];

  // Metadata
  notes?: string;
  createdAt: string;
  updatedAt?: string;
}

// ==================== PAGOS ====================

export interface Payment {
  id: string;

  // Referencia
  referenceType: 'SALE' | 'PURCHASE_ORDER' | 'DEBT';
  referenceId: string;

  // Cliente o Proveedor
  payerType: 'CLIENT' | 'SUPPLIER';
  payerId: string;
  payerName: string;

  // Monto
  amountUSD: number;
  amountMXN?: number;
  exchangeRate?: number;

  // Método de pago
  paymentMethod: 'CASH' | 'TRANSFER' | 'CHECK' | 'CARD' | 'OTHER';

  // Metadata
  concept?: string;
  receipt?: string;
  notes?: string;

  // Audit
  status: 'PENDING' | 'COMPLETED' | 'CANCELLED';
  createdAt: string;
  createdBy: string;
}

// ==================== INVENTARIO ====================

export interface InventoryItem {
  id: string;
  purchaseOrderId: string;

  // Producto
  productCode?: string;
  productName?: string;
  description?: string;

  // Stock
  currentStock: number;
  unit: string;

  // Costo
  costPerUnitUSD: number;
  totalValueUSD: number;

  // Traceability
  history: InventoryMovement[];

  // Status
  status: 'AVAILABLE' | 'RESERVED' | 'DEPLETED';

  // Metadata
  location?: string;
  notes?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface InventoryMovement {
  id: string;
  type: 'ENTRY' | 'EXIT' | 'ADJUSTMENT' | 'TRANSFER';

  // Cantidades
  quantity: number;
  unit: string;
  previousStock: number;
  newStock: number;

  // Referencia
  referenceType?: 'PURCHASE_ORDER' | 'SALE' | 'ADJUSTMENT' | 'TRANSFER';
  referenceId?: string;

  // Valores
  costPerUnitUSD?: number;
  salePriceUSD?: number;
  totalValueUSD?: number;

  // Metadata
  concept: string;
  notes?: string;

  // Audit
  createdAt: string;
  createdBy: string;
}

// ==================== EXCHANGE RATE ====================

export interface ExchangeRate {
  rate: number;
  timestamp: string;
  source: 'api' | 'manual' | 'fallback';
  loading: boolean;
  error: string | null;
}

export interface ExchangeRateOpportunity {
  recommendation: 'BUY_USD' | 'SELL_USD' | 'HOLD';
  reason: string;
  confidence: number; // 0-100
  action: string;
}

// ==================== ANALYTICS ====================

export interface DashboardMetrics {
  totalRevenue: number;
  totalCosts: number;
  netProfit: number;
  profitMargin: number;

  // Por bóveda
  bankBalances: Record<BankCode, number>;

  // Inventory
  totalStockUnits: number;
  totalStockValueUSD: number;

  // Ventas
  totalSales: number;
  averageTicket: number;

  // Deudas
  clientsDebt: number;
  suppliersDebt: number;
}

export interface PeriodComparison {
  current: DashboardMetrics;
  previous: DashboardMetrics;
  growth: {
    revenue: number;
    profit: number;
    margin: number;
  };
}

// ==================== FILTERS & SEARCH ====================

export interface DateRange {
  from: string;
  to: string;
}

export interface TransactionFilters {
  bankCode?: BankCode | BankCode[];
  type?: TransactionType | TransactionType[];
  status?: TransactionStatus | TransactionStatus[];
  dateRange?: DateRange;
  amountRange?: {
    min: number;
    max: number;
  };
  search?: string;
}

export interface SaleFilters {
  clientId?: string | string[];
  clientType?: 'REGULAR' | 'WHOLESALE' | 'INTERNAL';
  status?: Sale['status'] | Sale['status'][];
  paymentStatus?: Sale['paymentStatus'] | Sale['paymentStatus'][];
  dateRange?: DateRange;
  amountRange?: {
    min: number;
    max: number;
  };
  search?: string;
}

// ==================== FORMS ====================

export interface TransferFormData {
  fromBank: BankCode;
  toBank: BankCode;
  amountUSD: number;
  concept: string;
  category?: string;
  conversionType?: 'USD_TO_MXN' | 'MXN_TO_USD';
  notes?: string;
}

export interface CutFormData {
  entityType: 'BANK' | 'WAREHOUSE';
  entityCode: string;
  concept?: string;
  notes?: string;
}

export interface SaleFormData {
  clientId: string;
  quantity: number;
  pricePerUnitUSD: number;
  concept?: string;
  notes?: string;
}

// ==================== API RESPONSES ====================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  metadata?: {
    timestamp: string;
    requestId?: string;
  };
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

// ==================== ADDITIONAL TYPES FOR LEGACY COMPATIBILITY ====================

export interface Almacen {
  id: string;
  fecha: string;
  tipo: 'entrada' | 'salida';
  cantidad: number;
  producto?: string;
  observaciones?: string;
}

export interface Banco {
  nombre: string;
  capitalActual: number;
  historico: number;
  moneda: Currency;
  registros: Transaction[];
}

export interface Gasto {
  id: string;
  fecha: string;
  monto: number;
  concepto: string;
  destino?: string;
}

export interface ProductItem {
  id: string;
  nombre: string;
  cantidad: number;
  precio: number;
  subtotal: number;
}

// ==================== TYPE ALIASES (ESPAÑOL) ====================
// Aliases para compatibilidad con código existente en español

export type Cliente = Client;
export type Venta = Sale & {
  totalVenta?: number;
  totalUtilidades?: number;
  adeudo?: number;
  estadoPago?: 'Pendiente' | 'Parcial' | 'Pagado';
  cliente?: string; // Legacy compatibility: alias for clientName
};
export type OrdenCompra = PurchaseOrder;

// Enums y tipos adicionales para compatibilidad
export type CategoriaCliente = 'REGULAR' | 'WHOLESALE' | 'INTERNAL' | 'VIP';
export type EstadoVenta =
  | 'PENDIENTE'
  | 'PAGADA'
  | 'CREDITO'
  | 'CANCELADA'
  | 'PENDING'
  | 'CONFIRMED'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED';
export type VentaEstado = EstadoVenta;
export type OCEstado = 'PENDING' | 'IN_TRANSIT' | 'RECEIVED' | 'COMPLETED' | 'CANCELLED';
export type PagoEstado = 'PENDING' | 'PARTIAL' | 'COMPLETED' | 'OVERDUE' | 'CANCELLED';
export type CategoriaGasto = 'OPERATIONAL' | 'ADMINISTRATIVE' | 'TRANSPORT' | 'SUPPLIES' | 'OTHER';
export type GastoEstado = 'PENDING' | 'APPROVED' | 'PAID' | 'REJECTED';
export type EnvioEstado = 'PENDING' | 'IN_TRANSIT' | 'DELIVERED' | 'RETURNED';
export type Moneda = Currency;
export type NivelRiesgo = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type TipoMovimiento = 'ENTRY' | 'EXIT' | 'TRANSFER' | 'ADJUSTMENT';

// DTOs genéricos
export type CreateDTO<T> = Omit<T, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateDTO<T> = Partial<Omit<T, 'id' | 'createdAt'>>;

// ==================== EXTENDED SALE WITH STATES ====================
export interface VentaExtended extends Sale {
  estado?: EstadoVenta;
  montoTotal?: number;
  costoTotal?: number;
}
