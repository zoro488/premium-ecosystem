/**
 * 📋 SCHEMA DE VALIDACIÓN - VENTAS
 *
 * Validación completa con Zod para el formulario de registro de ventas.
 * Incluye validaciones de negocio y mensajes de error en español.
 */

import { z } from 'zod';

// Bancos disponibles (debería venir de una configuración centralizada)
const BANCOS = [
  'Bóveda Monte',
  'Bóveda USA',
  'Azteca',
  'Banorte',
  'Utilidades',
  'Guardadito',
  'Miel'
] as const;

// Estados de pago válidos
const ESTADOS_PAGO = ['completo', 'parcial', 'pendiente'] as const;

// Métodos de pago
const METODOS_PAGO = [
  'efectivo',
  'transferencia',
  'tarjeta',
  'cheque',
  'deposito',
  'otro'
] as const;

/**
 * Schema principal para registro de ventas
 */
export const ventaSchema = z.object({
  // Información del cliente
  clienteId: z.string({
    required_error: 'El cliente es obligatorio',
    invalid_type_error: 'El cliente debe ser un texto válido'
  })
    .min(1, 'Debe seleccionar un cliente')
    .max(100, 'El ID del cliente es demasiado largo'),

  clienteNombre: z.string()
    .min(1, 'El nombre del cliente es obligatorio')
    .max(200, 'El nombre del cliente es demasiado largo')
    .optional(),

  // Información del producto
  productoId: z.string({
    required_error: 'El producto es obligatorio'
  })
    .min(1, 'Debe seleccionar un producto')
    .max(100, 'El ID del producto es demasiado largo'),

  productoNombre: z.string()
    .min(1, 'El nombre del producto es obligatorio')
    .max(200, 'El nombre del producto es demasiado largo')
    .optional(),

  concepto: z.string()
    .max(500, 'El concepto no puede exceder 500 caracteres')
    .optional(),

  // Cantidades y precios
  cantidad: z.number({
    required_error: 'La cantidad es obligatoria',
    invalid_type_error: 'La cantidad debe ser un número'
  })
    .int('La cantidad debe ser un número entero')
    .positive('La cantidad debe ser mayor a 0')
    .min(1, 'La cantidad mínima es 1')
    .max(100000, 'La cantidad máxima es 100,000')
    .finite('La cantidad debe ser un número finito'),

  precioVentaUnidad: z.number({
    required_error: 'El precio de venta es obligatorio',
    invalid_type_error: 'El precio debe ser un número'
  })
    .positive('El precio debe ser mayor a 0')
    .min(0.01, 'El precio mínimo es $0.01')
    .max(1000000, 'El precio máximo es $1,000,000')
    .finite('El precio debe ser un número finito'),

  precioCompraUnidad: z.number({
    required_error: 'El precio de compra es obligatorio',
    invalid_type_error: 'El precio de compra debe ser un número'
  })
    .positive('El precio de compra debe ser mayor a 0')
    .min(0.01, 'El precio de compra mínimo es $0.01')
    .max(1000000, 'El precio de compra máximo es $1,000,000')
    .finite('El precio de compra debe ser un número finito'),

  precioFlete: z.number({
    required_error: 'El precio del flete es obligatorio',
    invalid_type_error: 'El precio del flete debe ser un número'
  })
    .nonnegative('El precio del flete no puede ser negativo')
    .max(100000, 'El precio del flete máximo es $100,000')
    .finite('El precio del flete debe ser un número finito')
    .default(0),

  // Información de pago
  estadoPago: z.enum(ESTADOS_PAGO, {
    required_error: 'El estado de pago es obligatorio',
    invalid_type_error: 'Estado de pago inválido'
  }),

  metodoPago: z.enum(METODOS_PAGO, {
    required_error: 'El método de pago es obligatorio'
  })
    .optional(),

  montoPagado: z.number({
    invalid_type_error: 'El monto pagado debe ser un número'
  })
    .nonnegative('El monto pagado no puede ser negativo')
    .finite('El monto pagado debe ser un número finito')
    .optional()
    .default(0),

  // Distribución bancaria
  bancoBovedaMonte: z.string()
    .refine((val) => BANCOS.includes(val as any), {
      message: 'Banco Bóveda Monte inválido'
    })
    .optional()
    .default('Bóveda Monte'),

  bancoFletes: z.string()
    .refine((val) => BANCOS.includes(val as any), {
      message: 'Banco de Fletes inválido'
    })
    .optional()
    .default('Bóveda USA'),

  bancoUtilidades: z.string()
    .refine((val) => BANCOS.includes(val as any), {
      message: 'Banco de Utilidades inválido'
    })
    .optional()
    .default('Utilidades'),

  // Información adicional
  fecha: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato de fecha inválido (YYYY-MM-DD)')
    .refine((date) => {
      const d = new Date(date);
      return d <= new Date();
    }, 'La fecha no puede ser futura')
    .optional()
    .default(() => new Date().toISOString().split('T')[0]),

  notas: z.string()
    .max(1000, 'Las notas no pueden exceder 1000 caracteres')
    .optional(),

  // Metadata
  creadoPor: z.string().optional(),
  actualizadoPor: z.string().optional(),

}).refine((data) => {
  // Validación: Precio de venta debe ser mayor que precio de compra
  return data.precioVentaUnidad > data.precioCompraUnidad;
}, {
  message: 'El precio de venta debe ser mayor que el precio de compra',
  path: ['precioVentaUnidad']
})
.refine((data) => {
  // Validación: Monto pagado no puede exceder el precio total
  const precioTotal = data.precioVentaUnidad * data.cantidad;
  return !data.montoPagado || data.montoPagado <= precioTotal;
}, {
  message: 'El monto pagado no puede exceder el precio total de la venta',
  path: ['montoPagado']
})
.refine((data) => {
  // Validación: Si estado es "completo", monto pagado debe ser el total
  if (data.estadoPago === 'completo') {
    const precioTotal = data.precioVentaUnidad * data.cantidad;
    return data.montoPagado === precioTotal;
  }
  return true;
}, {
  message: 'Para ventas completas, el monto pagado debe ser igual al precio total',
  path: ['montoPagado']
})
.refine((data) => {
  // Validación: Si estado es "pendiente", monto pagado debe ser 0
  if (data.estadoPago === 'pendiente') {
    return !data.montoPagado || data.montoPagado === 0;
  }
  return true;
}, {
  message: 'Las ventas pendientes no deben tener monto pagado',
  path: ['montoPagado']
})
.refine((data) => {
  // Validación: Si estado es "parcial", monto pagado debe estar entre 0 y total
  if (data.estadoPago === 'parcial') {
    const precioTotal = data.precioVentaUnidad * data.cantidad;
    return data.montoPagado && data.montoPagado > 0 && data.montoPagado < precioTotal;
  }
  return true;
}, {
  message: 'Para ventas parciales, el monto pagado debe ser mayor a 0 y menor que el total',
  path: ['montoPagado']
});

/**
 * Schema para actualizar una venta existente (campos opcionales)
 */
export const ventaUpdateSchema = ventaSchema.partial();

/**
 * Schema para pago de venta
 */
export const ventaPagoSchema = z.object({
  ventaId: z.string().min(1, 'ID de venta requerido'),
  montoPago: z.number()
    .positive('El monto debe ser mayor a 0')
    .finite('El monto debe ser un número finito'),
  metodoPago: z.enum(METODOS_PAGO),
  bancoDestino: z.enum(BANCOS).optional(),
  fecha: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato de fecha inválido'),
  notas: z.string().max(500).optional()
}).refine((data) => {
  return data.montoPago > 0;
}, {
  message: 'El monto de pago debe ser mayor a 0',
  path: ['montoPago']
});

/**
 * Tipos TypeScript generados desde los schemas
 */
export type VentaFormData = z.infer<typeof ventaSchema>;
export type VentaUpdateData = z.infer<typeof ventaUpdateSchema>;
export type VentaPagoData = z.infer<typeof ventaPagoSchema>;

/**
 * Valores por defecto para el formulario
 */
export const ventaDefaultValues: Partial<VentaFormData> = {
  cantidad: 1,
  precioFlete: 0,
  montoPagado: 0,
  estadoPago: 'pendiente',
  metodoPago: 'efectivo',
  bancoBovedaMonte: 'Bóveda Monte',
  bancoFletes: 'Bóveda USA',
  bancoUtilidades: 'Utilidades',
  fecha: new Date().toISOString().split('T')[0],
  notas: ''
};

/**
 * Mensajes de error personalizados para campos específicos
 */
export const ventaErrorMessages = {
  clienteId: 'Seleccione un cliente válido',
  productoId: 'Seleccione un producto válido',
  cantidad: 'Ingrese una cantidad válida',
  precioVentaUnidad: 'Ingrese un precio de venta válido',
  precioCompraUnidad: 'Ingrese un precio de compra válido',
  estadoPago: 'Seleccione un estado de pago',
  metodoPago: 'Seleccione un método de pago'
};
