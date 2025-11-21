/**
 * 📋 ZOD SCHEMAS - Validación de Formularios Enterprise
 * ======================================================
 * Schemas para validación de formularios de bancos
 * con mensajes de error en español
 */
import { z } from 'zod';

/**
 * 💰 SCHEMA PARA INGRESOS
 */
export const ingresoSchema = z.object({
  fecha: z.string().min(1, 'La fecha es requerida'),
  cliente: z.string().min(1, 'El nombre del cliente es requerido'),
  ingreso: z
    .union([
      z.string().refine((val) => !Number.isNaN(Number(val)) && Number(val) > 0, {
        message: 'El ingreso debe ser un número mayor a 0',
      }),
      z.number().positive('El ingreso debe ser mayor a 0'),
    ])
    .transform((val) => (typeof val === 'string' ? Number(val) : val)),
  concepto: z.string().optional().default(''),
  tc: z.union([z.string().optional(), z.number().optional()]).optional(),
  dolares: z.union([z.string().optional(), z.number().optional()]).optional(),
  destino: z.string().optional(),
  observaciones: z.string().optional(),
});

export type IngresoFormData = z.infer<typeof ingresoSchema>;

/**
 * 📉 SCHEMA PARA GASTOS
 */
export const gastoSchema = z.object({
  fecha: z.string().min(1, 'La fecha es requerida'),
  origenDelGastoOAbono: z.string().min(1, 'El origen del gasto es requerido'),
  gasto: z
    .union([
      z.string().refine((val) => !Number.isNaN(Number(val)) && Number(val) > 0, {
        message: 'El gasto debe ser un número mayor a 0',
      }),
      z.number().positive('El gasto debe ser mayor a 0'),
    ])
    .transform((val) => (typeof val === 'string' ? Number(val) : val)),
  concepto: z.string().optional().default(''),
  tc: z.union([z.string().optional(), z.number().optional()]).optional(),
  dolares: z.union([z.string().optional(), z.number().optional()]).optional(),
  destinoDeGasto: z.string().optional(),
  observaciones: z.string().optional(),
});

export type GastoFormData = z.infer<typeof gastoSchema>;

/**
 * 📊 SCHEMA PARA CORTES
 */
export const corteSchema = z.object({
  fecha: z.string().min(1, 'La fecha es requerida'),
  corte: z
    .union([
      z.string().refine((val) => !Number.isNaN(Number(val)) && Number(val) >= 0, {
        message: 'El corte debe ser un número válido',
      }),
      z.number().nonnegative('El corte debe ser mayor o igual a 0'),
    ])
    .transform((val) => (typeof val === 'string' ? Number(val) : val)),
  observaciones: z.string().optional(),
});

export type CorteFormData = z.infer<typeof corteSchema>;

/**
 * 🎯 SCHEMAS EXPORTADOS
 */
export const bancoSchemas = {
  ingreso: ingresoSchema,
  gasto: gastoSchema,
  corte: corteSchema,
};
