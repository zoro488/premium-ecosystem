/**
 * 📋 SCHEMA DE VALIDACIÓN - DISTRIBUIDORES
 *
 * Validación completa con Zod para el formulario de gestión de distribuidores.
 * Incluye validaciones de negocio y mensajes de error en español.
 */

import { z } from 'zod';

// Tipos de distribuidor
const TIPOS_DISTRIBUIDOR = [
  'nacional',
  'internacional',
  'fabricante',
  'mayorista',
  'minorista'
] as const;

// Categorías de distribuidor (por confiabilidad)
const CATEGORIAS_DISTRIBUIDOR = [
  'preferente',
  'confiable',
  'regular',
  'nuevo',
  'en_evaluacion'
] as const;

// Países
const PAISES = [
  'México',
  'Estados Unidos',
  'Canadá',
  'China',
  'Alemania',
  'Japón',
  'Reino Unido',
  'Francia',
  'Italia',
  'España',
  'Brasil',
  'Argentina',
  'Colombia',
  'Chile',
  'Perú',
  'Otro'
] as const;

/**
 * Schema principal para registro de distribuidores
 */
export const distribuidorSchema = z.object({
  // Información básica
  nombre: z.string({
    required_error: 'El nombre del distribuidor es obligatorio',
    invalid_type_error: 'El nombre debe ser un texto válido'
  })
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(200, 'El nombre no puede exceder 200 caracteres'),

  nombreComercial: z.string()
    .max(200, 'El nombre comercial no puede exceder 200 caracteres')
    .optional(),

  tipoDistribuidor: z.enum(TIPOS_DISTRIBUIDOR, {
    required_error: 'El tipo de distribuidor es obligatorio',
    invalid_type_error: 'Tipo de distribuidor inválido'
  }),

  categoria: z.enum(CATEGORIAS_DISTRIBUIDOR, {
    invalid_type_error: 'Categoría inválida'
  })
    .optional()
    .default('nuevo'),

  // Información de contacto
  email: z.string()
    .email('Email inválido')
    .max(100, 'El email es demasiado largo')
    .optional(),

  telefono: z.string()
    .min(10, 'El teléfono debe tener al menos 10 dígitos')
    .max(20, 'El teléfono no puede exceder 20 caracteres')
    .optional(),

  telefonoAdicional: z.string()
    .min(10, 'El teléfono debe tener al menos 10 dígitos')
    .max(20, 'El teléfono no puede exceder 20 caracteres')
    .optional(),

  sitioWeb: z.string()
    .url('URL inválida')
    .optional(),

  // Dirección
  direccion: z.string()
    .max(500, 'La dirección es demasiado larga')
    .optional(),

  ciudad: z.string()
    .max(100, 'La ciudad es demasiado larga')
    .optional(),

  estado: z.string()
    .max(100, 'El estado/provincia es demasiado largo')
    .optional(),

  pais: z.enum(PAISES, {
    invalid_type_error: 'País inválido'
  })
    .optional()
    .default('México'),

  codigoPostal: z.string()
    .max(20, 'El código postal es demasiado largo')
    .optional(),

  // Información fiscal
  rfc: z.string()
    .max(50, 'El RFC/Tax ID es demasiado largo')
    .optional(),

  regimenFiscal: z.string()
    .max(200, 'El régimen fiscal es demasiado largo')
    .optional(),

  // Información de pago
  condicionesPago: z.string()
    .max(500, 'Las condiciones de pago son demasiado largas')
    .optional(),

  diasCredito: z.number()
    .int('Los días de crédito deben ser un número entero')
    .nonnegative('Los días de crédito no pueden ser negativos')
    .max(365, 'Los días de crédito máximos son 365')
    .optional()
    .default(0),

  limiteCredito: z.number()
    .nonnegative('El límite de crédito no puede ser negativo')
    .max(1000000000, 'El límite de crédito máximo es $1,000,000,000')
    .finite('El límite de crédito debe ser un número finito')
    .optional()
    .default(0),

  deudaActual: z.number()
    .nonnegative('La deuda no puede ser negativa')
    .finite('La deuda debe ser un número finito')
    .optional()
    .default(0),

  // Información bancaria
  nombreBanco: z.string()
    .max(100, 'El nombre del banco es demasiado largo')
    .optional(),

  numeroCuenta: z.string()
    .max(50, 'El número de cuenta es demasiado largo')
    .optional(),

  clabe: z.string()
    .regex(/^[0-9]{18}$/, 'La CLABE debe tener 18 dígitos')
    .optional(),

  swift: z.string()
    .max(20, 'El código SWIFT es demasiado largo')
    .optional(),

  // Información de productos
  productosOfrecidos: z.array(z.string())
    .optional(),

  // Evaluación
  calificacion: z.number()
    .min(1, 'La calificación mínima es 1')
    .max(5, 'La calificación máxima es 5')
    .optional(),

  tiempoEntregaPromedio: z.number()
    .int('El tiempo de entrega debe ser un número entero')
    .nonnegative('El tiempo de entrega no puede ser negativo')
    .max(365, 'El tiempo de entrega máximo es 365 días')
    .optional(),

  // Estado del distribuidor
  activo: z.boolean()
    .optional()
    .default(true),

  bloqueado: z.boolean()
    .optional()
    .default(false),

  motivoBloqueo: z.string()
    .max(500, 'El motivo de bloqueo es demasiado largo')
    .optional(),

  // Información adicional
  notas: z.string()
    .max(2000, 'Las notas no pueden exceder 2000 caracteres')
    .optional(),

  certificaciones: z.array(z.string())
    .optional(),

  // Metadata
  fechaRegistro: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato de fecha inválido')
    .optional()
    .default(() => new Date().toISOString().split('T')[0]),

  creadoPor: z.string().optional(),
  actualizadoPor: z.string().optional(),

}).refine((data) => {
  // Validación: Si está bloqueado, debe tener motivo
  if (data.bloqueado && !data.motivoBloqueo) {
    return false;
  }
  return true;
}, {
  message: 'Si el distribuidor está bloqueado, debe proporcionar el motivo',
  path: ['motivoBloqueo']
})
.refine((data) => {
  // Validación: Deuda no puede exceder límite de crédito
  if (data.limiteCredito && data.deudaActual) {
    return data.deudaActual <= data.limiteCredito;
  }
  return true;
}, {
  message: 'La deuda actual no puede exceder el límite de crédito',
  path: ['deudaActual']
});

/**
 * Schema para actualizar un distribuidor existente
 */
export const distribuidorUpdateSchema = distribuidorSchema.partial();

/**
 * Schema para registro de contacto adicional del distribuidor
 */
export const contactoDistribuidorSchema = z.object({
  distribuidorId: z.string().min(1, 'ID de distribuidor requerido'),
  nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').max(200),
  cargo: z.string().max(100).optional(),
  email: z.string().email('Email inválido').optional(),
  telefono: z.string().min(10).max(20).optional(),
  extension: z.string().max(10).optional(),
  notas: z.string().max(500).optional()
});

/**
 * Schema para evaluación de distribuidor
 */
export const evaluacionDistribuidorSchema = z.object({
  distribuidorId: z.string().min(1, 'ID de distribuidor requerido'),
  calificacion: z.number().min(1).max(5),
  puntualidadEntrega: z.number().min(1).max(5),
  calidadProducto: z.number().min(1).max(5),
  atencionCliente: z.number().min(1).max(5),
  preciosCompetitivos: z.number().min(1).max(5),
  comentarios: z.string().max(1000).optional(),
  evaluadoPor: z.string(),
  fecha: z.string().regex(/^\d{4}-\d{2}-\d{2}$/)
});

/**
 * Tipos TypeScript generados desde los schemas
 */
export type DistribuidorFormData = z.infer<typeof distribuidorSchema>;
export type DistribuidorUpdateData = z.infer<typeof distribuidorUpdateSchema>;
export type ContactoDistribuidorData = z.infer<typeof contactoDistribuidorSchema>;
export type EvaluacionDistribuidorData = z.infer<typeof evaluacionDistribuidorSchema>;

/**
 * Valores por defecto para el formulario
 */
export const distribuidorDefaultValues: Partial<DistribuidorFormData> = {
  tipoDistribuidor: 'mayorista',
  categoria: 'nuevo',
  pais: 'México',
  diasCredito: 0,
  limiteCredito: 0,
  deudaActual: 0,
  activo: true,
  bloqueado: false,
  fechaRegistro: new Date().toISOString().split('T')[0],
  notas: ''
};

/**
 * Mensajes de error personalizados
 */
export const distribuidorErrorMessages = {
  nombre: 'Ingrese un nombre válido',
  tipoDistribuidor: 'Seleccione un tipo de distribuidor',
  categoria: 'Seleccione una categoría',
  email: 'Ingrese un email válido',
  telefono: 'Ingrese un teléfono válido',
  sitioWeb: 'Ingrese una URL válida',
  limiteCredito: 'Ingrese un límite de crédito válido',
  clabe: 'La CLABE debe tener 18 dígitos',
  calificacion: 'La calificación debe estar entre 1 y 5',
  motivoBloqueo: 'Ingrese el motivo del bloqueo'
};

/**
 * Labels para tipos de distribuidor
 */
export const tiposDistribuidorLabels: Record<typeof TIPOS_DISTRIBUIDOR[number], string> = {
  nacional: 'Nacional',
  internacional: 'Internacional',
  fabricante: 'Fabricante',
  mayorista: 'Mayorista',
  minorista: 'Minorista'
};

/**
 * Labels para categorías de distribuidor
 */
export const categoriasDistribuidorLabels: Record<typeof CATEGORIAS_DISTRIBUIDOR[number], string> = {
  preferente: 'Preferente',
  confiable: 'Confiable',
  regular: 'Regular',
  nuevo: 'Nuevo',
  en_evaluacion: 'En Evaluación'
};
