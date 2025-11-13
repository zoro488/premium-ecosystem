/**
 * 🛡️ Validators - Esquemas de validación con Zod
 */
import { z } from 'zod';

// ==================== VALIDADORES BASE ====================

/**
 * Esquema para montos monetarios
 */
export const amountSchema = z
  .number()
  .positive('El monto debe ser positivo')
  .finite('El monto debe ser un número válido')
  .refine((val) => val <= 100_000_000, {
    message: 'El monto máximo es $100,000,000',
  });

/**
 * Esquema para fechas
 */
export const dateSchema = z.string().refine(
  (val) => {
    const date = new Date(val);
    return !isNaN(date.getTime());
  },
  { message: 'Fecha inválida' }
);

/**
 * Esquema para nombres de clientes/distribuidores
 */
export const nameSchema = z
  .string()
  .min(2, 'El nombre debe tener al menos 2 caracteres')
  .max(100, 'El nombre no puede exceder 100 caracteres')
  .trim();

/**
 * Esquema para emails
 */
export const emailSchema = z.string().email('Email inválido').trim().toLowerCase();

/**
 * Esquema para RFC mexicano
 */
export const rfcSchema = z
  .string()
  .regex(/^[A-ZÑ&]{3,4}\d{6}[A-Z0-9]{3}$/, 'RFC inválido (ej: ABC123456XYZ)')
  .trim()
  .toUpperCase();

/**
 * Esquema para teléfonos mexicanos
 */
export const phoneSchema = z
  .string()
  .regex(/^(\d{10}|\d{3}-\d{3}-\d{4})$/, 'Teléfono inválido (10 dígitos)');

/**
 * Esquema para códigos de banco
 */
export const bankCodeSchema = z.enum([
  'bovedaMonte',
  'bovedaUsa',
  'azteca',
  'leftie',
  'fleteSur',
  'profit',
  'utilidades',
]);

/**
 * Esquema para estatus de venta
 */
export const saleStatusSchema = z.enum(['Pendiente', 'Pagado', 'Cancelado']);

/**
 * Esquema para estado de pago
 */
export const paymentStatusSchema = z.enum(['Pendiente', 'Pagado', 'Parcial']);

// ==================== ESQUEMAS DE PRODUCTOS ====================

/**
 * Esquema para un producto en una venta
 */
export const productItemSchema = z.object({
  nombre: z.string().min(1, 'El nombre del producto es requerido'),
  cantidad: z
    .number()
    .int('La cantidad debe ser un número entero')
    .positive('La cantidad debe ser mayor a 0')
    .max(10000, 'Cantidad máxima: 10,000'),
  precio: amountSchema,
  subtotal: amountSchema,
});

/**
 * Esquema para array de productos
 */
export const productsArraySchema = z
  .array(productItemSchema)
  .min(1, 'Debe agregar al menos un producto')
  .max(100, 'Máximo 100 productos por venta');

// ==================== ESQUEMAS DE TRANSACCIONES ====================

/**
 * Esquema para crear una venta
 */
export const createSaleSchema = z.object({
  tipo: z.string().default('Venta'),
  fecha: dateSchema,
  cliente: nameSchema,
  productos: productsArraySchema,
  totalVenta: amountSchema,
  totalFletes: z.number().min(0, 'Los fletes no pueden ser negativos'),
  totalUtilidades: z.number().min(0, 'Las utilidades no pueden ser negativas'),
  aplicaFlete: z.boolean().default(false),
  destino: bankCodeSchema,
  concepto: z.string().optional(),
  bovedaMonte: z.number().min(0).optional(),
});

/**
 * Esquema para crear una compra/orden de compra
 */
export const createPurchaseSchema = z.object({
  fecha: dateSchema,
  proveedor: nameSchema,
  productos: productsArraySchema,
  totalCompra: amountSchema,
  origen: bankCodeSchema, // De dónde sale el dinero
  ocRelacionada: z.string().optional(),
  concepto: z.string().optional(),
});

/**
 * Esquema para crear un gasto
 */
export const createExpenseSchema = z.object({
  fecha: dateSchema,
  concepto: z
    .string()
    .min(3, 'El concepto debe tener al menos 3 caracteres')
    .max(500, 'El concepto no puede exceder 500 caracteres'),
  monto: amountSchema,
  destino: bankCodeSchema,
});

/**
 * Esquema para crear un abono
 */
export const createPaymentSchema = z.object({
  fecha: dateSchema,
  ventaId: z.string().min(1, 'Debe seleccionar una venta'),
  monto: amountSchema,
  concepto: z.string().optional(),
});

/**
 * Esquema para crear una transferencia
 */
export const createTransferSchema = z
  .object({
    fecha: dateSchema,
    origen: bankCodeSchema,
    destino: bankCodeSchema,
    monto: amountSchema,
    concepto: z
      .string()
      .min(3, 'El concepto debe tener al menos 3 caracteres')
      .max(200, 'El concepto no puede exceder 200 caracteres'),
  })
  .refine((data) => data.origen !== data.destino, {
    message: 'El origen y destino deben ser diferentes',
    path: ['destino'],
  });

/**
 * Esquema para movimientos de almacén
 */
export const createStockMovementSchema = z.object({
  tipo: z.enum(['entrada', 'salida']),
  fecha: dateSchema,
  cantidad: z.number().int().positive('La cantidad debe ser mayor a 0'),
  destino: z.string().min(1, 'El destino es requerido'),
  producto: z.string().optional(),
  concepto: z.string().optional(),
});

// ==================== ESQUEMAS DE ENTIDADES ====================

/**
 * Esquema para crear/editar cliente
 */
export const clientSchema = z.object({
  nombre: nameSchema,
  rfc: rfcSchema.optional(),
  direccion: z.string().optional(),
  telefono: phoneSchema.optional(),
  email: emailSchema.optional(),
  contacto: z.string().optional(),
  limiteCredito: z.number().min(0).optional(),
  notas: z.string().optional(),
});

/**
 * Esquema para crear/editar distribuidor
 */
export const distributorSchema = z.object({
  nombre: nameSchema,
  rfc: rfcSchema.optional(),
  direccion: z.string().optional(),
  telefono: phoneSchema.optional(),
  email: emailSchema.optional(),
  contacto: z.string().optional(),
  zona: z.string().optional(),
  comision: z.number().min(0).max(100, 'La comisión no puede ser mayor a 100%').optional(),
  notas: z.string().optional(),
});

// ==================== ESQUEMAS DE BANCOS ====================

/**
 * Esquema para ingreso a banco
 */
export const bankDepositSchema = z.object({
  fecha: dateSchema,
  banco: bankCodeSchema,
  monto: amountSchema,
  concepto: z
    .string()
    .min(3, 'El concepto debe tener al menos 3 caracteres')
    .max(200, 'El concepto no puede exceder 200 caracteres'),
  tipo: z.enum(['ingreso', 'deposito', 'transferencia_externa']),
});

/**
 * Esquema para deuda
 */
export const debtSchema = z.object({
  fecha: dateSchema,
  acreedor: nameSchema,
  monto: amountSchema,
  fechaVencimiento: dateSchema.optional(),
  bancoAfectado: bankCodeSchema,
  concepto: z.string().min(3, 'El concepto es requerido'),
  estatus: z.enum(['Pendiente', 'Pagada', 'Vencida']).default('Pendiente'),
});

// ==================== VALIDACIONES PERSONALIZADAS ====================

/**
 * Valida que un array de productos tenga totales correctos
 */
export const validateProductTotals = (productos: any[]): boolean => {
  return productos.every((p) => {
    const subtotal = p.cantidad * p.precio;
    return Math.abs(subtotal - p.subtotal) < 0.01; // Tolerancia de 1 centavo
  });
};

/**
 * Valida que el total de venta coincida con la suma de productos
 */
export const validateSaleTotal = (
  productos: any[],
  totalVenta: number,
  tolerance: number = 0.01
): boolean => {
  const calculatedTotal = productos.reduce((sum, p) => sum + p.subtotal, 0);
  return Math.abs(calculatedTotal - totalVenta) <= tolerance;
};

/**
 * Valida que un abono no exceda el adeudo de la venta
 */
export const validatePaymentAmount = (monto: number, adeudo: number): boolean => {
  return monto > 0 && monto <= adeudo;
};

/**
 * Valida que haya suficiente saldo en un banco
 */
export const validateBankBalance = (
  monto: number,
  saldoActual: number
): { valid: boolean; message?: string } => {
  if (monto > saldoActual) {
    return {
      valid: false,
      message: `Saldo insuficiente. Disponible: $${saldoActual.toFixed(2)}`,
    };
  }
  return { valid: true };
};

// ==================== EXPORTACIONES ====================

export default {
  // Base
  amountSchema,
  dateSchema,
  nameSchema,
  emailSchema,
  rfcSchema,
  phoneSchema,
  bankCodeSchema,
  saleStatusSchema,
  paymentStatusSchema,

  // Productos
  productItemSchema,
  productsArraySchema,

  // Transacciones
  createSaleSchema,
  createPurchaseSchema,
  createExpenseSchema,
  createPaymentSchema,
  createTransferSchema,
  createStockMovementSchema,

  // Entidades
  clientSchema,
  distributorSchema,

  // Bancos
  bankDepositSchema,
  debtSchema,

  // Validaciones
  validateProductTotals,
  validateSaleTotal,
  validatePaymentAmount,
  validateBankBalance,
};
