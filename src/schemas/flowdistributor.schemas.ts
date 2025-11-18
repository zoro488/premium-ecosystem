/**
 * 🛡️ ZOD SCHEMAS - FLOWDISTRIBUTOR
 * ==================================
 * Esquemas de validación para todos los formularios del sistema
 */
import { z } from 'zod';

import { EstadoPago } from '@/types/flowdistributor.types';

// ============================================================================
// SCHEMAS DE FORMULARIOS
// ============================================================================

/**
 * Schema para Orden de Compra
 */
export const ordenCompraSchema = z.object({
  distribuidorNombre: z.string().min(2, 'Nombre del distribuidor es requerido').max(100),
  distribuidorContacto: z.string().optional(),
  distribuidorTelefono: z.string().optional(),
  distribuidorEmail: z.string().email('Email inválido').optional().or(z.literal('')),
  productos: z
    .array(
      z.object({
        productoId: z.string().min(1, 'Producto es requerido'),
        productoNombre: z.string(),
        cantidad: z.number().min(1, 'Cantidad debe ser mayor a 0'),
        precioUnitario: z.number().min(0.01, 'Precio debe ser mayor a 0'),
      })
    )
    .min(1, 'Debe agregar al menos un producto'),
  fechaEntregaEstimada: z.date().optional(),
  notas: z.string().max(500).optional(),
});

export type OrdenCompraFormSchema = z.infer<typeof ordenCompraSchema>;

/**
 * Schema para Venta
 */
export const ventaSchema = z
  .object({
    clienteNombre: z.string().min(2, 'Nombre del cliente es requerido').max(100),
    clienteContacto: z.string().optional(),
    clienteTelefono: z.string().optional(),
    clienteEmail: z.string().email('Email inválido').optional().or(z.literal('')),
    productos: z
      .array(
        z.object({
          productoId: z.string().min(1, 'Producto es requerido'),
          productoNombre: z.string(),
          cantidad: z.number().min(1, 'Cantidad debe ser mayor a 0'),
          precioVenta: z.number().min(0.01, 'Precio de venta debe ser mayor a 0'),
          precioFlete: z.number().min(0, 'Precio de flete no puede ser negativo').default(500),
        })
      )
      .min(1, 'Debe agregar al menos un producto'),
    estadoPago: z.enum([EstadoPago.COMPLETO, EstadoPago.PARCIAL, EstadoPago.PENDIENTE]),
    montoPagado: z.number().min(0).optional(),
    notas: z.string().max(500).optional(),
  })
  .refine(
    (data) => {
      // Si el estado es PARCIAL, montoPagado es requerido y debe ser mayor a 0
      if (data.estadoPago === EstadoPago.PARCIAL) {
        return data.montoPagado !== undefined && data.montoPagado > 0;
      }
      return true;
    },
    {
      message: 'Monto pagado es requerido cuando el estado es PARCIAL',
      path: ['montoPagado'],
    }
  )
  .refine(
    (data) => {
      // Si el estado es PARCIAL, montoPagado debe ser menor al total
      if (data.estadoPago === EstadoPago.PARCIAL && data.montoPagado) {
        const total = data.productos.reduce((sum, p) => {
          return sum + (p.precioVenta + p.precioFlete) * p.cantidad;
        }, 0);
        return data.montoPagado < total;
      }
      return true;
    },
    {
      message: 'El monto pagado no puede ser mayor o igual al total',
      path: ['montoPagado'],
    }
  );

export type VentaFormSchema = z.infer<typeof ventaSchema>;

/**
 * Schema para Abono de Cliente
 */
export const abonoClienteSchema = z.object({
  clienteId: z.string().min(1, 'Cliente es requerido'),
  monto: z.number().min(0.01, 'Monto debe ser mayor a 0'),
  concepto: z.string().min(3, 'Concepto es requerido').max(100),
  descripcion: z.string().max(500).optional(),
});

export type AbonoClienteFormSchema = z.infer<typeof abonoClienteSchema>;

/**
 * Schema para Abono a Distribuidor
 */
export const abonoDistribuidorSchema = z.object({
  distribuidorId: z.string().min(1, 'Distribuidor es requerido'),
  monto: z.number().min(0.01, 'Monto debe ser mayor a 0'),
  bancoOrigenId: z.string().min(1, 'Banco origen es requerido'),
  concepto: z.string().min(3, 'Concepto es requerido').max(100),
  descripcion: z.string().max(500).optional(),
});

export type AbonoDistribuidorFormSchema = z.infer<typeof abonoDistribuidorSchema>;

/**
 * Schema para Gasto
 */
export const gastoSchema = z.object({
  bancoId: z.string().min(1, 'Banco es requerido'),
  concepto: z.string().min(3, 'Concepto es requerido').max(100),
  descripcion: z.string().max(500).optional(),
  monto: z.number().min(0.01, 'Monto debe ser mayor a 0'),
  categoria: z
    .enum(['operativo', 'administrativo', 'marketing', 'compras', 'servicios', 'otros'])
    .default('otros'),
  fechaGasto: z.date().optional(),
});

export type GastoFormSchema = z.infer<typeof gastoSchema>;

/**
 * Schema para Transferencia entre Bancos
 */
export const transferenciaSchema = z
  .object({
    bancoOrigenId: z.string().min(1, 'Banco origen es requerido'),
    bancoDestinoId: z.string().min(1, 'Banco destino es requerido'),
    monto: z.number().min(0.01, 'Monto debe ser mayor a 0'),
    concepto: z.string().min(3, 'Concepto es requerido').max(100),
    descripcion: z.string().max(500).optional(),
  })
  .refine((data) => data.bancoOrigenId !== data.bancoDestinoId, {
    message: 'El banco origen y destino no pueden ser el mismo',
    path: ['bancoDestinoId'],
  });

export type TransferenciaFormSchema = z.infer<typeof transferenciaSchema>;

/**
 * Schema para Ingreso
 */
export const ingresoSchema = z.object({
  bancoId: z.string().min(1, 'Banco es requerido'),
  concepto: z.string().min(3, 'Concepto es requerido').max(100),
  descripcion: z.string().max(500).optional(),
  monto: z.number().min(0.01, 'Monto debe ser mayor a 0'),
  fuente: z
    .enum(['deposito', 'transferencia_externa', 'venta_activo', 'prestamo', 'otros'])
    .default('deposito'),
  fechaIngreso: z.date().optional(),
});

export type IngresoFormSchema = z.infer<typeof ingresoSchema>;

/**
 * Schema para Producto
 */
export const productoSchema = z.object({
  nombre: z.string().min(2, 'Nombre es requerido').max(100),
  descripcion: z.string().max(500).optional(),
  skuCode: z.string().max(50).optional(),
  precioCompra: z.number().min(0.01, 'Precio de compra debe ser mayor a 0'),
  precioVenta: z.number().min(0.01, 'Precio de venta debe ser mayor a 0'),
  precioFleteDefault: z.number().min(0).default(500),
  stockActual: z.number().min(0).default(0),
  stockMinimo: z.number().min(0).default(5),
  unidadMedida: z.string().default('unidad'),
  categoria: z.string().max(50).optional(),
});

export type ProductoFormSchema = z.infer<typeof productoSchema>;

// ============================================================================
// HELPERS DE VALIDACIÓN
// ============================================================================

/**
 * Validar formulario con Zod y retornar errores en formato React Hook Form
 */
export const validateForm = <T>(schema: z.ZodSchema<T>, data: unknown) => {
  try {
    const result = schema.parse(data);
    return { success: true, data: result, errors: null };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        data: null,
        errors: error.errors.reduce(
          (acc, err) => {
            const path = err.path.join('.');
            acc[path] = err.message;
            return acc;
          },
          {} as Record<string, string>
        ),
      };
    }
    return { success: false, data: null, errors: { general: 'Error de validación' } };
  }
};
