/**
 * 📋 SCHEMA DE VALIDACIÓN - INGRESOS
 *
 * Validación completa con Zod para el formulario de registro de ingresos.
 * Incluye validaciones de negocio y mensajes de error en español.
 */

import { z } from 'zod';

// Bancos disponibles
const BANCOS = [
  'Bóveda Monte',
  'Bóveda USA',
  'Azteca',
  'Banorte',
  'Utilidades',
  'Guardadito',
  'Miel'
] as const;

// Tipos de ingreso
const TIPOS_INGRESO = [
  'venta',
  'servicio',
  'inversion',
  'prestamo',
  'devolucion',
  'intereses',
  'otro'
] as const;

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
 * Schema principal para registro de ingresos
 */
export const ingresoSchema = z.object({
  // Información del ingreso
  concepto: z.string({
    required_error: 'El concepto del ingreso es obligatorio',
    invalid_type_error: 'El concepto debe ser un texto válido'
  })
    .min(3, 'El concepto debe tener al menos 3 caracteres')
    .max(200, 'El concepto no puede exceder 200 caracteres'),

  descripcion: z.string()
    .max(1000, 'La descripción no puede exceder 1000 caracteres')
    .optional(),

  tipoIngreso: z.enum(TIPOS_INGRESO, {
    required_error: 'El tipo de ingreso es obligatorio',
    invalid_type_error: 'Tipo de ingreso inválido'
  }),

  // Monto y banco
  monto: z.number({
    required_error: 'El monto es obligatorio',
    invalid_type_error: 'El monto debe ser un número'
  })
    .positive('El monto debe ser mayor a 0')
    .min(0.01, 'El monto mínimo es $0.01')
    .max(100000000, 'El monto máximo es $100,000,000')
    .finite('El monto debe ser un número finito'),

  bancoDestino: z.enum(BANCOS, {
    required_error: 'El banco de destino es obligatorio',
    invalid_type_error: 'Banco inválido'
  }),

  metodoPago: z.enum(METODOS_PAGO, {
    required_error: 'El método de pago es obligatorio'
  }),

  // Información del pagador
  pagador: z.string()
    .min(2, 'El nombre del pagador debe tener al menos 2 caracteres')
    .max(200, 'El nombre del pagador es demasiado largo')
    .optional(),

  // Relación con otras entidades
  ventaId: z.string()
    .max(100)
    .optional(), // Si el ingreso está relacionado con una venta

  clienteId: z.string()
    .max(100)
    .optional(), // Si el ingreso proviene de un cliente

  // Fechas
  fecha: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato de fecha inválido (YYYY-MM-DD)')
    .refine((date) => {
      const d = new Date(date);
      return d <= new Date();
    }, 'La fecha no puede ser futura')
    .optional()
    .default(() => new Date().toISOString().split('T')[0]),

  // Información fiscal
  esGravable: z.boolean()
    .optional()
    .default(true),

  tieneFactura: z.boolean()
    .optional()
    .default(false),

  numeroFactura: z.string()
    .max(50, 'El número de factura es demasiado largo')
    .optional(),

  // Notas adicionales
  notas: z.string()
    .max(1000, 'Las notas no pueden exceder 1000 caracteres')
    .optional(),

  // Adjuntos
  comprobante: z.string()
    .url('URL de comprobante inválida')
    .optional(),

  // Metadata
  creadoPor: z.string().optional(),
  actualizadoPor: z.string().optional(),

}).refine((data) => {
  // Validación: Si tiene factura, debe tener número de factura
  if (data.tieneFactura && !data.numeroFactura) {
    return false;
  }
  return true;
}, {
  message: 'Si el ingreso tiene factura, debe proporcionar el número de factura',
  path: ['numeroFactura']
});

/**
 * Schema para actualizar un ingreso existente
 */
export const ingresoUpdateSchema = ingresoSchema.partial();

/**
 * Schema para ingreso recurrente
 */
export const ingresoRecurrenteSchema = ingresoSchema.extend({
  frecuencia: z.enum(['diario', 'semanal', 'quincenal', 'mensual', 'anual'], {
    required_error: 'La frecuencia es obligatoria para ingresos recurrentes'
  }),
  fechaInicio: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato de fecha inválido'),
  fechaFin: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato de fecha inválido')
    .optional(),
  activo: z.boolean().default(true)
}).refine((data) => {
  // Validación: Fecha fin debe ser posterior a fecha inicio
  if (data.fechaFin) {
    return new Date(data.fechaFin) > new Date(data.fechaInicio);
  }
  return true;
}, {
  message: 'La fecha de fin debe ser posterior a la fecha de inicio',
  path: ['fechaFin']
});

/**
 * Tipos TypeScript generados desde los schemas
 */
export type IngresoFormData = z.infer<typeof ingresoSchema>;
export type IngresoUpdateData = z.infer<typeof ingresoUpdateSchema>;
export type IngresoRecurrenteData = z.infer<typeof ingresoRecurrenteSchema>;

/**
 * Valores por defecto para el formulario
 */
export const ingresoDefaultValues: Partial<IngresoFormData> = {
  tipoIngreso: 'venta',
  metodoPago: 'transferencia',
  fecha: new Date().toISOString().split('T')[0],
  esGravable: true,
  tieneFactura: false,
  notas: ''
};

/**
 * Mensajes de error personalizados
 */
export const ingresoErrorMessages = {
  concepto: 'Ingrese un concepto válido',
  tipoIngreso: 'Seleccione un tipo de ingreso',
  monto: 'Ingrese un monto válido',
  bancoDestino: 'Seleccione un banco de destino',
  metodoPago: 'Seleccione un método de pago',
  pagador: 'Ingrese el nombre del pagador',
  numeroFactura: 'Ingrese el número de factura'
};

/**
 * Labels para tipos de ingreso
 */
export const tiposIngresoLabels: Record<typeof TIPOS_INGRESO[number], string> = {
  venta: 'Venta de Productos',
  servicio: 'Prestación de Servicios',
  inversion: 'Retorno de Inversión',
  prestamo: 'Préstamo Recibido',
  devolucion: 'Devolución',
  intereses: 'Intereses',
  otro: 'Otro Ingreso'
};
