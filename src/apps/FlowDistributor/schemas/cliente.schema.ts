/**
 * 📋 SCHEMA DE VALIDACIÓN - CLIENTES
 *
 * Validación completa con Zod para el formulario de gestión de clientes.
 * Incluye validaciones de negocio y mensajes de error en español.
 */

import { z } from 'zod';

// Tipos de cliente
const TIPOS_CLIENTE = [
  'persona_fisica',
  'persona_moral',
  'gobierno',
  'otro'
] as const;

// Categorías de cliente (por volumen de compra)
const CATEGORIAS_CLIENTE = [
  'premium',
  'oro',
  'plata',
  'bronce',
  'nuevo'
] as const;

// Estados
const ESTADOS_MEXICO = [
  'Aguascalientes', 'Baja California', 'Baja California Sur', 'Campeche',
  'Chiapas', 'Chihuahua', 'Ciudad de México', 'Coahuila', 'Colima',
  'Durango', 'Estado de México', 'Guanajuato', 'Guerrero', 'Hidalgo',
  'Jalisco', 'Michoacán', 'Morelos', 'Nayarit', 'Nuevo León', 'Oaxaca',
  'Puebla', 'Querétaro', 'Quintana Roo', 'San Luis Potosí', 'Sinaloa',
  'Sonora', 'Tabasco', 'Tamaulipas', 'Tlaxcala', 'Veracruz', 'Yucatán', 'Zacatecas'
] as const;

/**
 * Schema principal para registro de clientes
 */
export const clienteSchema = z.object({
  // Información básica
  nombre: z.string({
    required_error: 'El nombre del cliente es obligatorio',
    invalid_type_error: 'El nombre debe ser un texto válido'
  })
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(200, 'El nombre no puede exceder 200 caracteres'),

  nombreComercial: z.string()
    .max(200, 'El nombre comercial no puede exceder 200 caracteres')
    .optional(),

  tipoCliente: z.enum(TIPOS_CLIENTE, {
    required_error: 'El tipo de cliente es obligatorio',
    invalid_type_error: 'Tipo de cliente inválido'
  }),

  categoria: z.enum(CATEGORIAS_CLIENTE, {
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
    .regex(/^[0-9]{10}$/, 'El teléfono debe tener 10 dígitos')
    .optional(),

  telefonoAdicional: z.string()
    .regex(/^[0-9]{10}$/, 'El teléfono debe tener 10 dígitos')
    .optional(),

  // Dirección
  calle: z.string()
    .max(200, 'La calle es demasiado larga')
    .optional(),

  numeroExterior: z.string()
    .max(20, 'El número exterior es demasiado largo')
    .optional(),

  numeroInterior: z.string()
    .max(20, 'El número interior es demasiado largo')
    .optional(),

  colonia: z.string()
    .max(100, 'La colonia es demasiado larga')
    .optional(),

  ciudad: z.string()
    .max(100, 'La ciudad es demasiado larga')
    .optional(),

  estado: z.enum(ESTADOS_MEXICO, {
    invalid_type_error: 'Estado inválido'
  })
    .optional(),

  codigoPostal: z.string()
    .regex(/^[0-9]{5}$/, 'El código postal debe tener 5 dígitos')
    .optional(),

  // Información fiscal
  rfc: z.string()
    .regex(/^[A-ZÑ&]{3,4}[0-9]{6}[A-Z0-9]{3}$/, 'RFC inválido')
    .optional(),

  regimenFiscal: z.string()
    .max(200, 'El régimen fiscal es demasiado largo')
    .optional(),

  // Información crediticia
  limiteCredito: z.number()
    .nonnegative('El límite de crédito no puede ser negativo')
    .max(100000000, 'El límite de crédito máximo es $100,000,000')
    .finite('El límite de crédito debe ser un número finito')
    .optional()
    .default(0),

  diasCredito: z.number()
    .int('Los días de crédito deben ser un número entero')
    .nonnegative('Los días de crédito no pueden ser negativos')
    .max(365, 'Los días de crédito máximos son 365')
    .optional()
    .default(0),

  deudaActual: z.number()
    .nonnegative('La deuda no puede ser negativa')
    .finite('La deuda debe ser un número finito')
    .optional()
    .default(0),

  // Estado del cliente
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
  message: 'Si el cliente está bloqueado, debe proporcionar el motivo',
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
 * Schema para actualizar un cliente existente
 */
export const clienteUpdateSchema = clienteSchema.partial();

/**
 * Schema para registro de contacto adicional
 */
export const contactoClienteSchema = z.object({
  clienteId: z.string().min(1, 'ID de cliente requerido'),
  nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').max(200),
  cargo: z.string().max(100).optional(),
  email: z.string().email('Email inválido').optional(),
  telefono: z.string().regex(/^[0-9]{10}$/, 'El teléfono debe tener 10 dígitos').optional(),
  notas: z.string().max(500).optional()
});

/**
 * Tipos TypeScript generados desde los schemas
 */
export type ClienteFormData = z.infer<typeof clienteSchema>;
export type ClienteUpdateData = z.infer<typeof clienteUpdateSchema>;
export type ContactoClienteData = z.infer<typeof contactoClienteSchema>;

/**
 * Valores por defecto para el formulario
 */
export const clienteDefaultValues: Partial<ClienteFormData> = {
  tipoCliente: 'persona_fisica',
  categoria: 'nuevo',
  limiteCredito: 0,
  diasCredito: 0,
  deudaActual: 0,
  activo: true,
  bloqueado: false,
  fechaRegistro: new Date().toISOString().split('T')[0],
  notas: ''
};

/**
 * Mensajes de error personalizados
 */
export const clienteErrorMessages = {
  nombre: 'Ingrese un nombre válido',
  tipoCliente: 'Seleccione un tipo de cliente',
  categoria: 'Seleccione una categoría',
  email: 'Ingrese un email válido',
  telefono: 'Ingrese un teléfono válido (10 dígitos)',
  rfc: 'Ingrese un RFC válido',
  codigoPostal: 'Ingrese un código postal válido (5 dígitos)',
  limiteCredito: 'Ingrese un límite de crédito válido',
  motivoBloqueo: 'Ingrese el motivo del bloqueo'
};

/**
 * Labels para tipos de cliente
 */
export const tiposClienteLabels: Record<typeof TIPOS_CLIENTE[number], string> = {
  persona_fisica: 'Persona Física',
  persona_moral: 'Persona Moral',
  gobierno: 'Gobierno',
  otro: 'Otro'
};

/**
 * Labels para categorías de cliente
 */
export const categoriasClienteLabels: Record<typeof CATEGORIAS_CLIENTE[number], string> = {
  premium: 'Premium (VIP)',
  oro: 'Oro',
  plata: 'Plata',
  bronce: 'Bronce',
  nuevo: 'Nuevo'
};
