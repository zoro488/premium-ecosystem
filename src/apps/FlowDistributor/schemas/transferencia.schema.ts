/**
 * 📋 SCHEMA DE VALIDACIÓN - TRANSFERENCIAS BANCARIAS
 *
 * Validación completa con Zod para el formulario de transferencias entre bancos.
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

// Estados de transferencia
const ESTADOS_TRANSFER = [
  'pendiente',
  'en_proceso',
  'completada',
  'cancelada',
  'rechazada'
] as const;

// Tipos de transferencia
const TIPOS_TRANSFER = [
  'reubicacion',
  'ahorro',
  'inversion',
  'pago',
  'prestamo',
  'otro'
] as const;

/**
 * Schema principal para registro de transferencias
 */
export const transferenciaSchema = z.object({
  // Información de la transferencia
  concepto: z.string({
    required_error: 'El concepto de la transferencia es obligatorio',
    invalid_type_error: 'El concepto debe ser un texto válido'
  })
    .min(3, 'El concepto debe tener al menos 3 caracteres')
    .max(200, 'El concepto no puede exceder 200 caracteres'),

  descripcion: z.string()
    .max(1000, 'La descripción no puede exceder 1000 caracteres')
    .optional(),

  tipoTransferencia: z.enum(TIPOS_TRANSFER, {
    required_error: 'El tipo de transferencia es obligatorio',
    invalid_type_error: 'Tipo de transferencia inválido'
  }),

  // Monto
  monto: z.number({
    required_error: 'El monto es obligatorio',
    invalid_type_error: 'El monto debe ser un número'
  })
    .positive('El monto debe ser mayor a 0')
    .min(0.01, 'El monto mínimo es $0.01')
    .max(100000000, 'El monto máximo es $100,000,000')
    .finite('El monto debe ser un número finito'),

  // Bancos origen y destino
  bancoOrigen: z.enum(BANCOS, {
    required_error: 'El banco de origen es obligatorio',
    invalid_type_error: 'Banco de origen inválido'
  }),

  bancoDestino: z.enum(BANCOS, {
    required_error: 'El banco de destino es obligatorio',
    invalid_type_error: 'Banco de destino inválido'
  }),

  // Estado
  estado: z.enum(ESTADOS_TRANSFER, {
    invalid_type_error: 'Estado de transferencia inválido'
  })
    .optional()
    .default('completada'),

  // Fechas
  fecha: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato de fecha inválido (YYYY-MM-DD)')
    .refine((date) => {
      const d = new Date(date);
      return d <= new Date();
    }, 'La fecha no puede ser futura')
    .optional()
    .default(() => new Date().toISOString().split('T')[0]),

  fechaEjecucion: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato de fecha inválido (YYYY-MM-DD)')
    .optional(),

  // Información adicional
  comision: z.number()
    .nonnegative('La comisión no puede ser negativa')
    .max(100000, 'La comisión máxima es $100,000')
    .finite('La comisión debe ser un número finito')
    .optional()
    .default(0),

  referencia: z.string()
    .max(100, 'La referencia es demasiado larga')
    .optional(),

  // Notas
  notas: z.string()
    .max(1000, 'Las notas no pueden exceder 1000 caracteres')
    .optional(),

  // Metadata
  creadoPor: z.string().optional(),
  actualizadoPor: z.string().optional(),
  aprobadoPor: z.string().optional(),

}).refine((data) => {
  // Validación: Banco origen y destino deben ser diferentes
  return data.bancoOrigen !== data.bancoDestino;
}, {
  message: 'El banco de origen y destino deben ser diferentes',
  path: ['bancoDestino']
})
.refine((data) => {
  // Validación: Monto debe ser mayor que comisión
  if (data.comision) {
    return data.monto > data.comision;
  }
  return true;
}, {
  message: 'El monto debe ser mayor que la comisión',
  path: ['monto']
})
.refine((data) => {
  // Validación: Fecha de ejecución debe ser posterior o igual a fecha de registro
  if (data.fechaEjecucion) {
    return new Date(data.fechaEjecucion) >= new Date(data.fecha);
  }
  return true;
}, {
  message: 'La fecha de ejecución debe ser posterior o igual a la fecha de registro',
  path: ['fechaEjecucion']
});

/**
 * Schema para actualizar una transferencia existente
 */
export const transferenciaUpdateSchema = transferenciaSchema.partial();

/**
 * Schema para aprobar/rechazar transferencia
 */
export const transferenciaAprobacionSchema = z.object({
  transferenciaId: z.string().min(1, 'ID de transferencia requerido'),
  estado: z.enum(['completada', 'rechazada'], {
    required_error: 'El estado es obligatorio'
  }),
  aprobadoPor: z.string().min(1, 'Usuario aprobador requerido'),
  motivoRechazo: z.string()
    .min(10, 'El motivo de rechazo debe tener al menos 10 caracteres')
    .max(500, 'El motivo de rechazo es demasiado largo')
    .optional(),
  notas: z.string().max(500).optional()
}).refine((data) => {
  // Validación: Si está rechazada, debe tener motivo
  if (data.estado === 'rechazada' && !data.motivoRechazo) {
    return false;
  }
  return true;
}, {
  message: 'Las transferencias rechazadas deben tener un motivo',
  path: ['motivoRechazo']
});

/**
 * Schema para transferencia programada
 */
export const transferenciaProgramadaSchema = transferenciaSchema.extend({
  frecuencia: z.enum(['unica', 'diaria', 'semanal', 'quincenal', 'mensual', 'anual'], {
    required_error: 'La frecuencia es obligatoria'
  }),
  fechaInicio: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato de fecha inválido'),
  fechaFin: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato de fecha inválido')
    .optional(),
  activa: z.boolean().default(true),
  proximaEjecucion: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato de fecha inválido')
    .optional()
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
export type TransferenciaFormData = z.infer<typeof transferenciaSchema>;
export type TransferenciaUpdateData = z.infer<typeof transferenciaUpdateSchema>;
export type TransferenciaAprobacionData = z.infer<typeof transferenciaAprobacionSchema>;
export type TransferenciaProgramadaData = z.infer<typeof transferenciaProgramadaSchema>;

/**
 * Valores por defecto para el formulario
 */
export const transferenciaDefaultValues: Partial<TransferenciaFormData> = {
  tipoTransferencia: 'reubicacion',
  estado: 'completada',
  fecha: new Date().toISOString().split('T')[0],
  comision: 0,
  notas: ''
};

/**
 * Mensajes de error personalizados
 */
export const transferenciaErrorMessages = {
  concepto: 'Ingrese un concepto válido',
  tipoTransferencia: 'Seleccione un tipo de transferencia',
  monto: 'Ingrese un monto válido',
  bancoOrigen: 'Seleccione un banco de origen',
  bancoDestino: 'Seleccione un banco de destino (diferente al origen)',
  estado: 'Seleccione un estado',
  comision: 'Ingrese una comisión válida',
  motivoRechazo: 'Ingrese el motivo del rechazo'
};

/**
 * Labels para tipos de transferencia
 */
export const tiposTransferenciaLabels: Record<typeof TIPOS_TRANSFER[number], string> = {
  reubicacion: 'Reubicación de Fondos',
  ahorro: 'Ahorro',
  inversion: 'Inversión',
  pago: 'Pago',
  prestamo: 'Préstamo Interno',
  otro: 'Otro'
};

/**
 * Labels para estados de transferencia
 */
export const estadosTransferenciaLabels: Record<typeof ESTADOS_TRANSFER[number], string> = {
  pendiente: 'Pendiente',
  en_proceso: 'En Proceso',
  completada: 'Completada',
  cancelada: 'Cancelada',
  rechazada: 'Rechazada'
};
