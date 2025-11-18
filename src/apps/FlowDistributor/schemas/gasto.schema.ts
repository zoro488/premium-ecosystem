/**
 * 📋 SCHEMA DE VALIDACIÓN - GASTOS
 *
 * Validación completa con Zod para el formulario de registro de gastos.
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

// Categorías de gastos
const CATEGORIAS_GASTO = [
  'operativo',
  'administrativo',
  'marketing',
  'transporte',
  'mantenimiento',
  'servicios',
  'nomina',
  'impuestos',
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
 * Schema principal para registro de gastos
 */
export const gastoSchema = z.object({
  // Información del gasto
  concepto: z.string({
    required_error: 'El concepto del gasto es obligatorio',
    invalid_type_error: 'El concepto debe ser un texto válido'
  })
    .min(3, 'El concepto debe tener al menos 3 caracteres')
    .max(200, 'El concepto no puede exceder 200 caracteres'),

  descripcion: z.string()
    .max(1000, 'La descripción no puede exceder 1000 caracteres')
    .optional(),

  categoria: z.enum(CATEGORIAS_GASTO, {
    required_error: 'La categoría es obligatoria',
    invalid_type_error: 'Categoría inválida'
  }),

  // Monto y banco
  monto: z.number({
    required_error: 'El monto es obligatorio',
    invalid_type_error: 'El monto debe ser un número'
  })
    .positive('El monto debe ser mayor a 0')
    .min(0.01, 'El monto mínimo es $0.01')
    .max(10000000, 'El monto máximo es $10,000,000')
    .finite('El monto debe ser un número finito'),

  bancoOrigen: z.enum(BANCOS, {
    required_error: 'El banco de origen es obligatorio',
    invalid_type_error: 'Banco inválido'
  }),

  metodoPago: z.enum(METODOS_PAGO, {
    required_error: 'El método de pago es obligatorio'
  }),

  // Información del beneficiario
  beneficiario: z.string()
    .min(2, 'El nombre del beneficiario debe tener al menos 2 caracteres')
    .max(200, 'El nombre del beneficiario es demasiado largo')
    .optional(),

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
  esDeducible: z.boolean()
    .optional()
    .default(false),

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
  message: 'Si el gasto tiene factura, debe proporcionar el número de factura',
  path: ['numeroFactura']
});

/**
 * Schema para actualizar un gasto existente
 */
export const gastoUpdateSchema = gastoSchema.partial();

/**
 * Schema para gasto recurrente
 */
export const gastoRecurrenteSchema = gastoSchema.extend({
  frecuencia: z.enum(['diario', 'semanal', 'quincenal', 'mensual', 'anual'], {
    required_error: 'La frecuencia es obligatoria para gastos recurrentes'
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
export type GastoFormData = z.infer<typeof gastoSchema>;
export type GastoUpdateData = z.infer<typeof gastoUpdateSchema>;
export type GastoRecurrenteData = z.infer<typeof gastoRecurrenteSchema>;

/**
 * Valores por defecto para el formulario
 */
export const gastoDefaultValues: Partial<GastoFormData> = {
  categoria: 'operativo',
  metodoPago: 'transferencia',
  fecha: new Date().toISOString().split('T')[0],
  esDeducible: false,
  tieneFactura: false,
  notas: ''
};

/**
 * Mensajes de error personalizados
 */
export const gastoErrorMessages = {
  concepto: 'Ingrese un concepto válido',
  categoria: 'Seleccione una categoría',
  monto: 'Ingrese un monto válido',
  bancoOrigen: 'Seleccione un banco de origen',
  metodoPago: 'Seleccione un método de pago',
  beneficiario: 'Ingrese el nombre del beneficiario',
  numeroFactura: 'Ingrese el número de factura'
};

/**
 * Labels para categorías de gastos
 */
export const categoriasGastoLabels: Record<typeof CATEGORIAS_GASTO[number], string> = {
  operativo: 'Operativo',
  administrativo: 'Administrativo',
  marketing: 'Marketing y Publicidad',
  transporte: 'Transporte y Logística',
  mantenimiento: 'Mantenimiento',
  servicios: 'Servicios',
  nomina: 'Nómina',
  impuestos: 'Impuestos y Contribuciones',
  otro: 'Otro'
};
