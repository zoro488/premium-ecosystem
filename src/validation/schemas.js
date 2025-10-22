/**
 * ✅ ZOD VALIDATION SCHEMAS
 * Nivel: TYPE-SAFE ENTERPRISE
 * Pattern: Runtime Type Validation
 */
import { z } from 'zod';

// 📊 Schema de Estado
export const estadoSchema = z.object({
  id: z.string().or(z.number()),
  nombre: z.string().min(1, 'Nombre requerido').max(100),
  cantidad: z.number().min(0, 'Cantidad debe ser positiva'),
  precioCompra: z.number().min(0, 'Precio debe ser positivo'),
  precioVenta: z.number().min(0, 'Precio debe ser positivo'),
  utilidad: z.number().optional(),
  categoria: z.string().optional(),
  fechaCreacion: z.string().or(z.date()).optional(),
});

// 💵 Schema de Venta
export const ventaSchema = z.object({
  id: z.string().or(z.number()),
  fecha: z.string().or(z.date()),
  cliente: z.string().min(1, 'Cliente requerido'),
  estatus: z.enum(['Pendiente', 'Pagado']).default('Pendiente'),
  destino: z.string().optional(),
  totalVenta: z.number().min(0, 'Total debe ser positivo'),
  montoPagado: z.number().min(0).default(0),
  adeudo: z.number().min(0).default(0),
  utilidad: z.number().optional(),
  concepto: z.string().optional(),
  items: z
    .array(
      z.object({
        estadoId: z.string().or(z.number()),
        cantidad: z.number().min(1),
        precioUnitario: z.number().min(0),
      })
    )
    .optional(),
});

// 👤 Schema de Cliente
export const clienteSchema = z.object({
  nombre: z.string().min(1, 'Nombre requerido').max(200),
  contacto: z.string().optional(),
  direccion: z.string().optional(),
  adeudo: z.number().min(0).default(0),
  abonos: z
    .array(
      z.object({
        id: z.string().or(z.number()),
        fecha: z.string().or(z.date()),
        monto: z.number().min(0),
        bancoDestino: z.string(),
      })
    )
    .optional()
    .default([]),
  historialCompras: z.array(z.string().or(z.number())).optional().default([]),
});

// 🏦 Schema de Registro Bancario
export const registroBancarioSchema = z.object({
  id: z.string().or(z.number()),
  fecha: z.string().or(z.date()),
  tipo: z.enum(['Ingreso', 'Egreso']),
  concepto: z.string().min(1, 'Concepto requerido'),
  monto: z.number().min(0.01, 'Monto debe ser mayor a 0'),
  categoria: z.string().optional(),
  referencia: z.string().optional(),
});

// 💰 Schema de Banco
export const bancoSchema = z.object({
  nombre: z.string().min(1, 'Nombre requerido'),
  capitalActual: z.number().default(0),
  registros: z.array(registroBancarioSchema).default([]),
  color: z.string().optional(),
  icono: z.string().optional(),
});

// 🔄 Schema de Abono
export const abonoSchema = z.object({
  clienteNombre: z.string().min(1, 'Cliente requerido'),
  monto: z.number().min(0.01, 'Monto debe ser mayor a 0'),
  bancoDestino: z.enum(['bovedaMonte', 'bancoCuscatlan', 'bancoAgricola']),
  fecha: z
    .string()
    .or(z.date())
    .default(() => new Date().toISOString()),
  concepto: z.string().optional(),
});

// Helper para validar datos
export function validateData(schema, data) {
  try {
    return {
      success: true,
      data: schema.parse(data),
      errors: null,
    };
  } catch (error) {
    return {
      success: false,
      data: null,
      errors: error.errors,
    };
  }
}

// Helper para validación asíncrona
export async function validateDataAsync(schema, data) {
  try {
    const validated = await schema.parseAsync(data);
    return {
      success: true,
      data: validated,
      errors: null,
    };
  } catch (error) {
    return {
      success: false,
      data: null,
      errors: error.errors,
    };
  }
}
