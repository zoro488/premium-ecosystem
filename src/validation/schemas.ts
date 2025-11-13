/**
 * 🔒 VALIDATION SCHEMAS - ZOD
 * Esquemas de validación enterprise para todo el sistema
 * Incluye: validaciones, sanitización, y type inference
 */
import { z } from 'zod';

// ============================================
// UTILIDADES DE VALIDACIÓN
// ============================================

/**
 * Validador de fechas en formato DD/MM/YYYY o YYYY-MM-DD
 */
const dateValidator = z.string().refine(
  (date) => {
    const regex1 = /^\d{2}\/\d{2}\/\d{4}$/; // DD/MM/YYYY
    const regex2 = /^\d{4}-\d{2}-\d{2}$/; // YYYY-MM-DD
    return regex1.test(date) || regex2.test(date);
  },
  { message: 'Fecha debe estar en formato DD/MM/YYYY o YYYY-MM-DD' }
);

/**
 * Validador de montos (positivos, máximo 10 millones)
 */
const moneyValidator = z
  .number()
  .positive('El valor debe ser positivo')
  .max(10000000, 'El valor no puede exceder $10,000,000');

/**
 * Validador de tipo de cambio (0 o positivo)
 */
const tcValidator = z
  .number()
  .nonnegative('El tipo de cambio no puede ser negativo')
  .max(100, 'Tipo de cambio inválido');

// ============================================
// SCHEMA: GASTO/ABONO (GYA)
// ============================================

export const GastoAbonoSchema = z.object({
  id: z
    .string()
    .min(1, 'ID requerido')
    .regex(/^GYA\d{4}$/, 'ID debe tener formato GYA0001'),

  fecha: dateValidator,

  origen: z
    .string()
    .min(1, 'Origen requerido')
    .max(100, 'Origen muy largo')
    .transform((val) => val.trim()),

  valor: moneyValidator,

  tc: tcValidator,

  pesos: z.number().nonnegative('Pesos no puede ser negativo'),

  destino: z
    .string()
    .min(1, 'Destino requerido')
    .max(100, 'Destino muy largo')
    .transform((val) => val.trim()),

  concepto: z.string().max(500, 'Concepto muy largo').optional().default(''),

  observaciones: z.string().max(1000, 'Observaciones muy largas').optional().default(''),

  // Metadata opcional
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
  createdBy: z.string().optional(),
});

// Type inference
export type GastoAbono = z.infer<typeof GastoAbonoSchema>;

// Array de gastos/abonos
export const GastosAbonosArraySchema = z.array(GastoAbonoSchema);

// ============================================
// SCHEMA: VENTA LOCAL
// ============================================

export const VentaLocalSchema = z.object({
  id: z
    .string()
    .min(1)
    .regex(/^VL\d{3,}$/, 'ID debe tener formato VL001'),

  fecha: dateValidator,

  ocRelacionada: z.string().optional(),

  cantidad: z.number().int().positive('Cantidad debe ser positiva'),

  cliente: z
    .string()
    .min(1, 'Cliente requerido')
    .max(200, 'Nombre de cliente muy largo')
    .transform((val) => val.trim()),

  bovedaMonte: moneyValidator,

  precioVenta: moneyValidator,

  ingreso: moneyValidator,

  fleteAplica: z.enum(['Aplica', 'No Aplica']).default('No Aplica'),

  fleteUtilidad: z.number().nonnegative().default(0),

  utilidad: z.number(),

  estatus: z.enum(['Pendiente', 'Pagado', 'Cancelado']).default('Pendiente'),

  concepto: z.string().max(500).optional().default(''),
});

export type VentaLocal = z.infer<typeof VentaLocalSchema>;

// ============================================
// SCHEMA: ORDEN DE COMPRA
// ============================================

export const OrdenCompraSchema = z.object({
  id: z
    .string()
    .min(1)
    .regex(/^OC\d{4,}$/, 'ID debe tener formato OC0001'),

  fecha: dateValidator,

  proveedor: z.string().min(1, 'Proveedor requerido').max(200),

  producto: z.string().min(1, 'Producto requerido').max(300),

  cantidad: z.number().int().positive('Cantidad debe ser positiva'),

  precioUnitario: moneyValidator,

  total: moneyValidator,

  estatus: z.enum(['Pendiente', 'En Tránsito', 'Recibido', 'Cancelado']).default('Pendiente'),

  fechaEntrega: dateValidator.optional(),

  observaciones: z.string().max(1000).optional().default(''),
});

export type OrdenCompra = z.infer<typeof OrdenCompraSchema>;

// ============================================
// SCHEMA: BANCO
// ============================================

export const MovimientoBancoSchema = z.object({
  id: z.string().min(1),
  fecha: dateValidator,
  tipo: z.enum(['ingreso', 'gasto', 'transferencia', 'corte']),
  valor: moneyValidator,
  concepto: z.string().max(500).optional().default(''),
  referencia: z.string().max(200).optional(),
});

export const BancoSchema = z.object({
  nombre: z.string().min(1, 'Nombre requerido'),
  saldo: z.number(),
  ingresos: z.array(MovimientoBancoSchema).default([]),
  gastos: z.array(MovimientoBancoSchema).default([]),
  transferencias: z.array(MovimientoBancoSchema).default([]),
  cortes: z.array(MovimientoBancoSchema).default([]),
});

export type Banco = z.infer<typeof BancoSchema>;

// ============================================
// SCHEMA: CLIENTE
// ============================================

export const ClienteSchema = z.object({
  id: z.string().min(1),

  nombre: z
    .string()
    .min(2, 'Nombre muy corto')
    .max(200, 'Nombre muy largo')
    .transform((val) => val.trim()),

  rfc: z
    .string()
    .regex(/^[A-ZÑ&]{3,4}\d{6}[A-Z0-9]{3}$/, 'RFC inválido')
    .optional(),

  email: z.string().email('Email inválido').optional(),

  telefono: z
    .string()
    .regex(/^\d{10}$/, 'Teléfono debe tener 10 dígitos')
    .optional(),

  direccion: z.string().max(500).optional(),

  credito: z.number().nonnegative().default(0),

  adeudo: z.number().nonnegative().default(0),

  estatus: z.enum(['Activo', 'Inactivo', 'Suspendido']).default('Activo'),

  notas: z.string().max(2000).optional().default(''),
});

export type Cliente = z.infer<typeof ClienteSchema>;

// ============================================
// SCHEMA: DISTRIBUIDOR
// ============================================

export const DistribuidorSchema = z.object({
  id: z.string().min(1),

  nombre: z
    .string()
    .min(2)
    .max(200)
    .transform((val) => val.trim()),

  zona: z.string().min(1, 'Zona requerida'),

  comision: z.number().min(0).max(100, 'Comisión no puede exceder 100%'),

  ventasTotales: z.number().nonnegative().default(0),

  estatus: z.enum(['Activo', 'Inactivo']).default('Activo'),

  contacto: z
    .object({
      telefono: z.string().optional(),
      email: z.string().email().optional(),
    })
    .optional(),
});

export type Distribuidor = z.infer<typeof DistribuidorSchema>;

// ============================================
// SCHEMA: PRODUCTO ALMACÉN
// ============================================

export const ProductoAlmacenSchema = z.object({
  id: z.string().min(1),

  nombre: z.string().min(1, 'Nombre requerido').max(300),

  sku: z.string().min(1, 'SKU requerido').max(100),

  cantidad: z.number().int().nonnegative('Cantidad no puede ser negativa'),

  costo: moneyValidator,

  precioVenta: moneyValidator.refine((val) => val > 0, {
    message: 'Precio de venta debe ser mayor a costo',
  }),

  categoria: z.string().max(100).optional(),

  ubicacion: z.string().max(200).optional(),

  minStock: z.number().int().nonnegative().default(10),

  maxStock: z.number().int().positive().default(1000),

  proveedor: z.string().max(200).optional(),

  ultimaEntrada: dateValidator.optional(),

  ultimaSalida: dateValidator.optional(),
});

export type ProductoAlmacen = z.infer<typeof ProductoAlmacenSchema>;

// ============================================
// FUNCIONES HELPER DE VALIDACIÓN
// ============================================

/**
 * Valida un objeto y devuelve resultado con errores
 * @param schema - Schema de Zod
 * @param data - Datos a validar
 * @returns {success: boolean, data?: T, errors?: string[]}
 */
export function validateData<T>(schema: z.ZodSchema<T>, data: unknown) {
  try {
    const validatedData = schema.parse(data);
    return {
      success: true,
      data: validatedData,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        errors: error.errors.map((err) => `${err.path.join('.')}: ${err.message}`),
      };
    }
    return {
      success: false,
      errors: ['Error de validación desconocido'],
    };
  }
}

/**
 * Valida array de datos
 * @param schema - Schema de Zod para un elemento
 * @param dataArray - Array de datos
 * @returns {success: boolean, validItems: T[], invalidItems: Array}
 */
export function validateArray<T>(schema: z.ZodSchema<T>, dataArray: unknown[]) {
  const results = dataArray.map((item, index) => ({
    index,
    ...validateData(schema, item),
  }));

  const validItems = results.filter((r) => r.success).map((r) => r.data as T);

  const invalidItems = results
    .filter((r) => !r.success)
    .map((r) => ({
      index: r.index,
      errors: r.errors,
    }));

  return {
    success: invalidItems.length === 0,
    validItems,
    invalidItems,
    stats: {
      total: dataArray.length,
      valid: validItems.length,
      invalid: invalidItems.length,
    },
  };
}

/**
 * Sanitiza string para prevenir XSS
 * @param input - String a sanitizar
 * @returns String limpio
 */
export function sanitizeString(input: string): string {
  return input
    .replace(/[<>]/g, '') // Remover < >
    .replace(/javascript:/gi, '') // Remover javascript:
    .replace(/on\w+=/gi, '') // Remover event handlers
    .trim();
}

/**
 * Valida y sanitiza objeto antes de guardar
 * @param schema - Schema de validación
 * @param data - Datos a validar
 * @returns Datos validados y sanitizados o null
 */
export function validateAndSanitize<T>(schema: z.ZodSchema<T>, data: unknown): T | null {
  // Sanitizar strings en el objeto
  const sanitizedData = JSON.parse(JSON.stringify(data), (key, value) => {
    if (typeof value === 'string') {
      return sanitizeString(value);
    }
    return value;
  });

  // Validar
  const result = validateData(schema, sanitizedData);

  if (result.success) {
    return result.data as T;
  }

  console.error('Validation errors:', result.errors);
  return null;
}

// ============================================
// EXPORT ALL SCHEMAS
// ============================================

export const schemas = {
  gastoAbono: GastoAbonoSchema,
  gastosAbonos: GastosAbonosArraySchema,
  ventaLocal: VentaLocalSchema,
  ordenCompra: OrdenCompraSchema,
  banco: BancoSchema,
  movimientoBanco: MovimientoBancoSchema,
  cliente: ClienteSchema,
  distribuidor: DistribuidorSchema,
  productoAlmacen: ProductoAlmacenSchema,
};

export default schemas;
