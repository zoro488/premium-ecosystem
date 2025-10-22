/**
 * 🔬 SCHEMAS DE VALIDACIÓN ESPECÍFICOS PARA IMPORT EXCEL
 *
 * Este archivo contiene schemas Zod especializados para validar
 * y transformar datos importados desde Excel a FlowDistributor.
 *
 * Incluye:
 * - Transformaciones automáticas de campos
 * - Normalizaciones de valores
 * - Validaciones cruzadas
 * - Manejo de inconsistencias
 *
 * @module excel-schemas
 * @author FlowDistributor Enterprise Team
 * @version 2.0.0
 */
import { z } from 'zod';

// ========================================
// HELPER FUNCTIONS - Transformaciones
// ========================================

/**
 * Sanitiza el campo cliente que puede venir como número en Excel
 * @param {string|number} value - Valor del cliente
 * @returns {string} - Nombre de cliente sanitizado
 */
const sanitizeCliente = (value) => {
  if (typeof value === 'number') {
    return `Cliente ${value.toString().replace('.0', '')}`;
  }
  return String(value).trim();
};

/**
 * Normaliza el estatus de venta de Excel a FlowDistributor
 * @param {string} value - "Pagado" o "Pendiente" desde Excel
 * @returns {string} - "completo" o "pendiente"
 */
const normalizeEstatusVenta = (value) => {
  const val = String(value).toLowerCase();
  return val === 'pagado' ? 'completo' : 'pendiente';
};

/**
 * Normaliza el estado del cliente (puede ser número o string en Excel)
 * @param {string|number} value - Estado desde Excel
 * @returns {string} - "activo", "inactivo", o "pendiente"
 */
const normalizeClienteEstado = (value) => {
  if (typeof value === 'number') {
    return value > 0 ? 'activo' : 'inactivo';
  }
  const val = String(value).toLowerCase();
  if (val === 'pendiente') return 'pendiente';
  if (val === 'activo' || val === '1') return 'activo';
  return 'inactivo';
};

/**
 * Sanitiza nombre de distribuidor
 * @param {string} value - Nombre desde Excel
 * @returns {string} - Nombre sanitizado
 */
const sanitizeDistribuidor = (value) => {
  return String(value).trim();
};

// ========================================
// SCHEMA: VENTA (desde Excel)
// ========================================

export const ventaExcelSchema = z
  .object({
    id: z.string(),
    fecha: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Fecha debe ser YYYY-MM-DD'),
    ocRelacionada: z.string().default(''),
    cliente: z.union([z.string(), z.number()]).transform(sanitizeCliente),
    cantidad: z.number().min(0, 'Cantidad debe ser >= 0'),
    precioVenta: z.number().min(0, 'Precio de venta debe ser >= 0'),
    totalVenta: z.number().min(0, 'Total de venta debe ser >= 0'),
    costoBoveda: z.number().default(0),
    fletes: z.number().default(0),
    utilidades: z.number(),
    estadoPago: z.string().transform(normalizeEstatusVenta),
    adeudo: z.number().min(0, 'Adeudo debe ser >= 0'),
    concepto: z.string().default(''),
    productos: z
      .array(
        z.object({
          nombre: z.string(),
          cantidad: z.number().min(0),
          precio: z.number().min(0),
        })
      )
      .default([]),
  })
  .refine(
    (data) => {
      // Validación cruzada: totalVenta debe ser cantidad * precioVenta
      // Tolerancia de $0.01 por redondeos
      const expectedTotal = data.cantidad * data.precioVenta;
      return Math.abs(data.totalVenta - expectedTotal) < 0.01;
    },
    {
      message: 'totalVenta no coincide con cantidad * precioVenta',
      path: ['totalVenta'],
    }
  )
  .refine(
    (data) => {
      // Si está pagado, adeudo debe ser 0
      if (data.estadoPago === 'completo') {
        return data.adeudo === 0;
      }
      return true;
    },
    {
      message: 'Venta pagada debe tener adeudo en 0',
      path: ['adeudo'],
    }
  );

// ========================================
// SCHEMA: CLIENTE (desde Excel)
// ========================================

export const clienteExcelSchema = z
  .object({
    id: z.string(),
    nombre: z.union([z.string(), z.number()]).transform(String),
    adeudo: z.number(),
    totalComprado: z.number().min(0, 'Total comprado debe ser >= 0'),
    totalAbonado: z.number().min(0, 'Total abonado debe ser >= 0'),
    estado: z.union([z.string(), z.number()]).transform(normalizeClienteEstado),
    observaciones: z.string().default(''),
    ventas: z.array(z.any()).default([]),
  })
  .refine(
    (data) => {
      // Validación: adeudo = totalComprado - totalAbonado
      // Tolerancia de $0.01 por redondeos
      const expectedAdeudo = data.totalComprado - data.totalAbonado;
      return Math.abs(data.adeudo - expectedAdeudo) < 0.01;
    },
    {
      message: 'Adeudo calculado no coincide con el esperado',
      path: ['adeudo'],
    }
  )
  .transform((data) => {
    // Manejar adeudos negativos (saldo a favor del cliente)
    if (data.adeudo < 0) {
      return {
        ...data,
        adeudo: 0,
        saldoFavor: Math.abs(data.adeudo),
        observaciones: data.observaciones
          ? `${data.observaciones} | Saldo a favor: $${Math.abs(data.adeudo).toFixed(2)}`
          : `Saldo a favor: $${Math.abs(data.adeudo).toFixed(2)}`,
      };
    }
    return { ...data, saldoFavor: 0 };
  });

// ========================================
// SCHEMA: ORDEN DE COMPRA (desde Excel)
// ========================================

export const ordenCompraExcelSchema = z
  .object({
    id: z.string(),
    fecha: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Fecha debe ser YYYY-MM-DD'),
    distribuidor: z.string().transform(sanitizeDistribuidor),
    cantidad: z.number().min(0, 'Cantidad debe ser >= 0'),
    costoDistribuidor: z.number().min(0, 'Costo distribuidor debe ser >= 0'),
    costoTransporte: z.number().default(0),
    costoPorUnidad: z.number().min(0, 'Costo por unidad debe ser >= 0'),
    stock: z.number().min(0, 'Stock debe ser >= 0').default(0),
    costoTotal: z.number().min(0, 'Costo total debe ser >= 0'),
    pagado: z.number().min(0, 'Pagado debe ser >= 0').default(0),
    adeudo: z.number().min(0, 'Adeudo debe ser >= 0'),
    productos: z
      .array(
        z.object({
          nombre: z.string(),
          cantidad: z.number().min(0),
          precio: z.number().min(0),
        })
      )
      .default([]),
  })
  .refine(
    (data) => {
      // Validación: costoPorUnidad debe ser costoDistribuidor + costoTransporte
      const expectedCostoPorUnidad = data.costoDistribuidor + data.costoTransporte;
      return Math.abs(data.costoPorUnidad - expectedCostoPorUnidad) < 0.01;
    },
    {
      message: 'costoPorUnidad no coincide con costoDistribuidor + costoTransporte',
      path: ['costoPorUnidad'],
    }
  )
  .refine(
    (data) => {
      // Validación: costoTotal debe ser cantidad * costoPorUnidad
      const expectedCostoTotal = data.cantidad * data.costoPorUnidad;
      return Math.abs(data.costoTotal - expectedCostoTotal) < 0.01;
    },
    {
      message: 'costoTotal no coincide con cantidad * costoPorUnidad',
      path: ['costoTotal'],
    }
  )
  .refine(
    (data) => {
      // Validación: adeudo debe ser costoTotal - pagado
      const expectedAdeudo = Math.max(0, data.costoTotal - data.pagado);
      return Math.abs(data.adeudo - expectedAdeudo) < 0.01;
    },
    {
      message: 'adeudo no coincide con costoTotal - pagado',
      path: ['adeudo'],
    }
  );

// ========================================
// SCHEMA: BANCO (desde Excel)
// ========================================

const registroBancarioSchema = z.object({
  id: z.string(),
  fecha: z.string(),
  tipo: z.enum(['Ingreso', 'Egreso']),
  concepto: z.string(),
  monto: z.number(),
  categoria: z.string().default('General'),
});

export const bancoExcelSchema = z
  .object({
    capitalActual: z.number(),
    historico: z.number().optional(),
    registros: z.array(registroBancarioSchema).default([]),
    ingresos: z.array(z.any()).default([]),
    gastos: z.array(z.any()).default([]),
    transferencias: z.array(z.any()).default([]),
  })
  .transform((data) => {
    // Si historico no existe, copiarlo de capitalActual
    if (data.historico === undefined) {
      data.historico = data.capitalActual;
    }
    return data;
  });

// ========================================
// SCHEMA: ALMACÉN (desde Excel)
// ========================================

export const almacenExcelSchema = z.object({
  ingresos: z
    .array(
      z.object({
        id: z.string(),
        fecha: z.string(),
        distribuidor: z.string(),
        cantidad: z.number().min(0),
        oc: z.string().default(''),
      })
    )
    .default([]),
  salidas: z
    .array(
      z.object({
        id: z.string(),
        fecha: z.string(),
        cliente: z.string(),
        cantidad: z.number().min(0),
        concepto: z.string().default(''),
      })
    )
    .default([]),
  stockActual: z.number().min(0).default(0),
});

// ========================================
// FUNCIÓN PRINCIPAL DE VALIDACIÓN
// ========================================

/**
 * Valida datos completos del Excel con todos los schemas
 * @param {object} data - Datos desde excel_data.json
 * @returns {object} - { success, data, errors }
 */
export const validateExcelData = async (data) => {
  const errors = [];
  const validated = {
    ventas: [],
    clientes: [],
    ordenesCompra: [],
    bancos: {},
    almacen: null,
  };

  // Validar ventas
  if (data.ventas && Array.isArray(data.ventas)) {
    for (let i = 0; i < data.ventas.length; i++) {
      try {
        const venta = ventaExcelSchema.parse(data.ventas[i]);
        validated.ventas.push(venta);
      } catch (error) {
        errors.push({
          type: 'VENTA_VALIDATION',
          index: i,
          id: data.ventas[i]?.id || `venta-${i}`,
          message: error.message,
          details: error.errors || [],
        });
      }
    }
  }

  // Validar clientes
  if (data.clientes && Array.isArray(data.clientes)) {
    for (let i = 0; i < data.clientes.length; i++) {
      try {
        const cliente = clienteExcelSchema.parse(data.clientes[i]);
        validated.clientes.push(cliente);
      } catch (error) {
        errors.push({
          type: 'CLIENTE_VALIDATION',
          index: i,
          id: data.clientes[i]?.id || `cliente-${i}`,
          message: error.message,
          details: error.errors || [],
        });
      }
    }
  }

  // Validar órdenes de compra
  if (data.ordenesCompra && Array.isArray(data.ordenesCompra)) {
    for (let i = 0; i < data.ordenesCompra.length; i++) {
      try {
        const orden = ordenCompraExcelSchema.parse(data.ordenesCompra[i]);
        validated.ordenesCompra.push(orden);
      } catch (error) {
        errors.push({
          type: 'ORDEN_VALIDATION',
          index: i,
          id: data.ordenesCompra[i]?.id || `orden-${i}`,
          message: error.message,
          details: error.errors || [],
        });
      }
    }
  }

  // Validar bancos
  if (data.bancos && typeof data.bancos === 'object') {
    for (const [bancoNombre, bancoData] of Object.entries(data.bancos)) {
      try {
        const banco = bancoExcelSchema.parse(bancoData);
        validated.bancos[bancoNombre] = banco;
      } catch (error) {
        errors.push({
          type: 'BANCO_VALIDATION',
          banco: bancoNombre,
          message: error.message,
          details: error.errors || [],
        });
      }
    }
  }

  // Validar almacén
  if (data.almacen) {
    try {
      validated.almacen = almacenExcelSchema.parse(data.almacen);
    } catch (error) {
      errors.push({
        type: 'ALMACEN_VALIDATION',
        message: error.message,
        details: error.errors || [],
      });
    }
  }

  // Copiar distribuidores sin validación (ya están validados en el parser)
  if (data.distribuidores) {
    validated.distribuidores = data.distribuidores;
  }

  return {
    success: errors.length === 0,
    data: validated,
    errors,
    stats: {
      ventasValidadas: validated.ventas.length,
      clientesValidados: validated.clientes.length,
      ordenesValidadas: validated.ordenesCompra.length,
      bancosValidados: Object.keys(validated.bancos).length,
      erroresEncontrados: errors.length,
    },
  };
};

// Exportar todo
export default {
  ventaExcelSchema,
  clienteExcelSchema,
  ordenCompraExcelSchema,
  bancoExcelSchema,
  almacenExcelSchema,
  validateExcelData,
};
