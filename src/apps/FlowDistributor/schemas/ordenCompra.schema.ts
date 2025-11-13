/**
 * 📦 SCHEMA DE VALIDACIÓN - ÓRDENES DE COMPRA
 *
 * Sistema de validación para órdenes de compra a distribuidores,
 * gestión de inventario, pagos, recepciones y tracking.
 *
 * @module FlowDistributor/schemas/ordenCompra
 */

import { z } from 'zod';

// ============================================================================
// ENUMS Y CONSTANTES
// ============================================================================

/**
 * Estados de Orden de Compra
 */
export const ESTADOS_OC = [
  'borrador',
  'pendiente',
  'enviada',
  'en_transito',
  'recibida_parcial',
  'recibida',
  'completada',
  'cancelada',
  'devuelta'
] as const;

/**
 * Estados de pago de OC
 */
export const ESTADOS_PAGO_OC = [
  'pendiente',
  'anticipo',
  'parcial',
  'completo',
  'vencido'
] as const;

/**
 * Monedas soportadas
 */
export const MONEDAS = ['MXN', 'USD', 'EUR'] as const;

/**
 * Prioridades de OC
 */
export const PRIORIDADES = ['baja', 'normal', 'alta', 'urgente'] as const;

/**
 * Métodos de envío
 */
export const METODOS_ENVIO = [
  'terrestre',
  'aereo',
  'maritimo',
  'mensajeria',
  'recoleccion',
  'otro'
] as const;

// ============================================================================
// SCHEMAS DE PRODUCTO
// ============================================================================

/**
 * Schema de producto en la orden de compra
 */
export const productoOCSchema = z.object({
  sku: z.string().min(1, 'El SKU es requerido'),
  nombre: z.string().min(1, 'El nombre del producto es requerido'),
  descripcion: z.string().max(500, 'La descripción no puede exceder 500 caracteres').optional(),

  // Cantidades
  cantidadSolicitada: z.number()
    .int('La cantidad debe ser un número entero')
    .positive('La cantidad debe ser mayor a cero'),
  cantidadRecibida: z.number()
    .int()
    .nonnegative('La cantidad recibida no puede ser negativa')
    .default(0),
  cantidadPendiente: z.number().int().nonnegative().default(0),

  // Unidad de medida
  unidadMedida: z.string().default('pza'),

  // Costos
  costoUnitario: z.number()
    .positive('El costo unitario debe ser mayor a cero')
    .max(1000000, 'El costo unitario excede el límite máximo'),
  subtotal: z.number().nonnegative(),
  descuento: z.number()
    .min(0, 'El descuento no puede ser negativo')
    .max(100, 'El descuento no puede exceder 100%')
    .default(0),
  impuestos: z.number().nonnegative('Los impuestos no pueden ser negativos').default(0),
  total: z.number().positive('El total debe ser mayor a cero'),

  // Información adicional
  marca: z.string().optional(),
  modelo: z.string().optional(),
  lote: z.string().optional(),
  fechaCaducidad: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),

  // Observaciones
  notas: z.string().max(500).optional()
}).refine(
  (data) => {
    const subtotalCalculado = data.cantidadSolicitada * data.costoUnitario;
    return Math.abs(data.subtotal - subtotalCalculado) < 0.01;
  },
  {
    message: 'El subtotal debe ser cantidadSolicitada * costoUnitario',
    path: ['subtotal']
  }
).refine(
  (data) => {
    const totalCalculado = data.subtotal * (1 - data.descuento / 100) + data.impuestos;
    return Math.abs(data.total - totalCalculado) < 0.01;
  },
  {
    message: 'El total debe ser (subtotal * (1 - descuento/100)) + impuestos',
    path: ['total']
  }
).refine(
  (data) => data.cantidadRecibida <= data.cantidadSolicitada,
  {
    message: 'La cantidad recibida no puede exceder la cantidad solicitada',
    path: ['cantidadRecibida']
  }
).refine(
  (data) => data.cantidadPendiente === data.cantidadSolicitada - data.cantidadRecibida,
  {
    message: 'La cantidad pendiente debe ser cantidadSolicitada - cantidadRecibida',
    path: ['cantidadPendiente']
  }
);

// ============================================================================
// SCHEMA PRINCIPAL DE ORDEN DE COMPRA
// ============================================================================

/**
 * Schema completo de Orden de Compra
 */
export const ordenCompraSchema = z.object({
  // Identificación
  id: z.string().optional(),
  numeroOC: z.string().min(1, 'El número de OC es requerido'),
  folio: z.string().optional(),

  // Distribuidor
  distribuidorId: z.string().min(1, 'El ID del distribuidor es requerido'),
  distribuidorNombre: z.string().min(1, 'El nombre del distribuidor es requerido'),
  distribuidorContacto: z.string().optional(),
  distribuidorTelefono: z.string().optional(),
  distribuidorEmail: z.string().email('Email inválido').optional(),

  // Fechas
  fecha: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato de fecha inválido (YYYY-MM-DD)'),
  fechaEstimadaEntrega: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  fechaEntrega: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  fechaRecepcion: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),

  // Origen y destino
  origen: z.string().min(1, 'El origen es requerido'),
  destino: z.string().min(1, 'El destino es requerido'),
  almacenDestino: z.string().optional(),

  // Productos
  productos: z.array(productoOCSchema).min(1, 'Debe incluir al menos un producto'),

  // Cantidades totales
  cantidadTotal: z.number()
    .int()
    .positive('La cantidad total debe ser mayor a cero'),
  cantidadRecibida: z.number().int().nonnegative().default(0),
  cantidadPendiente: z.number().int().nonnegative().default(0),

  // Stock
  stockActual: z.number().int().nonnegative('El stock actual no puede ser negativo').default(0),
  stockMinimo: z.number().int().nonnegative('El stock mínimo no puede ser negativo').default(0),
  stockMaximo: z.number().int().nonnegative().optional(),

  // Moneda y costos
  moneda: z.enum(MONEDAS, {
    errorMap: () => ({ message: 'Selecciona una moneda válida' })
  }).default('MXN'),
  tipoCambio: z.number().positive('El tipo de cambio debe ser mayor a cero').default(1),

  costoDistribuidor: z.number()
    .nonnegative('El costo del distribuidor no puede ser negativo'),
  costoTransporte: z.number().nonnegative().default(0),
  costoAduanal: z.number().nonnegative().default(0),
  costoSeguro: z.number().nonnegative().default(0),
  otrosCostos: z.number().nonnegative().default(0),
  subtotal: z.number().nonnegative(),
  descuentoGlobal: z.number().min(0).max(100).default(0),
  impuestosTotal: z.number().nonnegative().default(0),
  costoTotal: z.number().positive('El costo total debe ser mayor a cero'),
  costoPorUnidad: z.number().positive('El costo por unidad debe ser mayor a cero'),

  // Costos en MXN (si la moneda no es MXN)
  costoTotalMXN: z.number().optional(),

  // Pagos
  estadoPago: z.enum(ESTADOS_PAGO_OC).default('pendiente'),
  pagoDistribuidor: z.number().nonnegative().default(0),
  saldoPendiente: z.number().nonnegative(),
  formaPago: z.string().optional(),
  plazoCredito: z.number().int().nonnegative('El plazo de crédito no puede ser negativo').default(0),
  fechaVencimiento: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),

  // Estado y prioridad
  estado: z.enum(ESTADOS_OC, {
    errorMap: () => ({ message: 'Estado de OC inválido' })
  }),
  prioridad: z.enum(PRIORIDADES).default('normal'),

  // Envío y tracking
  metodoEnvio: z.enum(METODOS_ENVIO).optional(),
  numeroGuia: z.string().optional(),
  tracking: z.string().optional(),
  transportista: z.string().optional(),

  // Calidad y recepción
  inspeccionRealizada: z.boolean().default(false),
  calidadAprobada: z.boolean().optional(),
  productosDefectuosos: z.number().int().nonnegative().default(0),
  notasInspeccion: z.string().max(1000).optional(),
  recibidoPor: z.string().optional(),

  // Documentos
  factura: z.string().optional(),
  numeroFactura: z.string().optional(),
  pedimento: z.string().optional(),
  certificadoCalidad: z.string().optional(),
  comprobantes: z.array(z.string()).optional(),

  // Observaciones y notas
  concepto: z.string().max(500, 'El concepto no puede exceder 500 caracteres').optional(),
  observaciones: z.string().max(1000, 'Las observaciones no pueden exceder 1000 caracteres').optional(),
  notasInternas: z.string().max(500).optional(),
  motivoCancelacion: z.string().max(500).optional(),

  // Auditoría
  creadoPor: z.string().optional(),
  aprobadoPor: z.string().optional(),
  fechaAprobacion: z.string().optional(),
  modificadoPor: z.string().optional(),

  // Timestamps
  createdAt: z.string().optional(),
  updatedAt: z.string().optional()
}).refine(
  (data) => {
    const costoCalculado =
      data.costoDistribuidor +
      data.costoTransporte +
      data.costoAduanal +
      data.costoSeguro +
      data.otrosCostos;
    return Math.abs(data.subtotal - costoCalculado) < 0.01;
  },
  {
    message: 'El subtotal debe ser la suma de todos los costos',
    path: ['subtotal']
  }
).refine(
  (data) => {
    const totalCalculado = data.subtotal * (1 - data.descuentoGlobal / 100) + data.impuestosTotal;
    return Math.abs(data.costoTotal - totalCalculado) < 0.01;
  },
  {
    message: 'El costo total debe ser (subtotal * (1 - descuento/100)) + impuestos',
    path: ['costoTotal']
  }
).refine(
  (data) => {
    const costoPorUnidadCalculado = data.costoTotal / data.cantidadTotal;
    return Math.abs(data.costoPorUnidad - costoPorUnidadCalculado) < 0.01;
  },
  {
    message: 'El costo por unidad debe ser costoTotal / cantidadTotal',
    path: ['costoPorUnidad']
  }
).refine(
  (data) => {
    const saldoCalculado = data.costoTotal - data.pagoDistribuidor;
    return Math.abs(data.saldoPendiente - saldoCalculado) < 0.01;
  },
  {
    message: 'El saldo pendiente debe ser costoTotal - pagoDistribuidor',
    path: ['saldoPendiente']
  }
).refine(
  (data) => data.cantidadRecibida <= data.cantidadTotal,
  {
    message: 'La cantidad recibida no puede exceder la cantidad total',
    path: ['cantidadRecibida']
  }
).refine(
  (data) => data.cantidadPendiente === data.cantidadTotal - data.cantidadRecibida,
  {
    message: 'La cantidad pendiente debe ser cantidadTotal - cantidadRecibida',
    path: ['cantidadPendiente']
  }
).refine(
  (data) => {
    if (data.moneda !== 'MXN' && data.costoTotalMXN) {
      const calculado = data.costoTotal * data.tipoCambio;
      return Math.abs(data.costoTotalMXN - calculado) < 0.01;
    }
    return true;
  },
  {
    message: 'El costo total en MXN debe ser costoTotal * tipoCambio',
    path: ['costoTotalMXN']
  }
).refine(
  (data) => !data.fechaEntrega || new Date(data.fechaEntrega) >= new Date(data.fecha),
  {
    message: 'La fecha de entrega no puede ser anterior a la fecha de la orden',
    path: ['fechaEntrega']
  }
).refine(
  (data) => !data.fechaRecepcion || new Date(data.fechaRecepcion) >= new Date(data.fecha),
  {
    message: 'La fecha de recepción no puede ser anterior a la fecha de la orden',
    path: ['fechaRecepcion']
  }
).refine(
  (data) => {
    if (data.plazoCredito > 0 && data.fechaVencimiento) {
      const fechaOrden = new Date(data.fecha);
      const fechaVenc = new Date(data.fechaVencimiento);
      const diffDias = Math.ceil((fechaVenc.getTime() - fechaOrden.getTime()) / (1000 * 60 * 60 * 24));
      return Math.abs(diffDias - data.plazoCredito) <= 1; // Permitir 1 día de diferencia
    }
    return true;
  },
  {
    message: 'La fecha de vencimiento debe coincidir con el plazo de crédito',
    path: ['fechaVencimiento']
  }
).refine(
  (data) => {
    if (data.estado === 'cancelada') {
      return data.motivoCancelacion && data.motivoCancelacion.length > 0;
    }
    return true;
  },
  {
    message: 'Las órdenes canceladas deben incluir un motivo de cancelación',
    path: ['motivoCancelacion']
  }
).refine(
  (data) => data.productosDefectuosos <= data.cantidadRecibida,
  {
    message: 'Los productos defectuosos no pueden exceder la cantidad recibida',
    path: ['productosDefectuosos']
  }
);

/**
 * Schema para actualización de orden de compra (campos opcionales)
 */
export const ordenCompraUpdateSchema = ordenCompraSchema.partial().extend({
  id: z.string().min(1, 'El ID es requerido para actualización')
});

/**
 * Schema para recepción de productos
 */
export const recepcionOCSchema = z.object({
  id: z.string().min(1, 'El ID de la OC es requerido'),
  productos: z.array(
    z.object({
      sku: z.string(),
      cantidadRecibida: z.number().int().positive(),
      calidadAprobada: z.boolean(),
      productosDefectuosos: z.number().int().nonnegative().default(0),
      lote: z.string().optional(),
      fechaCaducidad: z.string().optional(),
      notas: z.string().optional()
    })
  ),
  fechaRecepcion: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  recibidoPor: z.string().min(1, 'Se requiere el nombre de quien recibe'),
  inspeccionRealizada: z.boolean(),
  notasInspeccion: z.string().optional(),
  evidenciaFotografica: z.array(z.string()).optional()
});

/**
 * Schema para pago a distribuidor
 */
export const pagoOCSchema = z.object({
  id: z.string().min(1, 'El ID de la OC es requerido'),
  montoPago: z.number().positive('El monto del pago debe ser mayor a cero'),
  banco: z.string().min(1, 'El banco es requerido'),
  metodoPago: z.string().min(1, 'El método de pago es requerido'),
  referencia: z.string().optional(),
  fechaPago: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  comprobante: z.string().optional(),
  notas: z.string().optional()
});

// ============================================================================
// VALORES POR DEFECTO
// ============================================================================

export const ordenCompraDefaultValues = {
  numeroOC: '',
  distribuidorId: '',
  distribuidorNombre: '',
  fecha: new Date().toISOString().split('T')[0],
  origen: '',
  destino: '',
  productos: [],
  cantidadTotal: 0,
  cantidadRecibida: 0,
  cantidadPendiente: 0,
  stockActual: 0,
  stockMinimo: 0,
  moneda: 'MXN' as const,
  tipoCambio: 1,
  costoDistribuidor: 0,
  costoTransporte: 0,
  costoAduanal: 0,
  costoSeguro: 0,
  otrosCostos: 0,
  subtotal: 0,
  descuentoGlobal: 0,
  impuestosTotal: 0,
  costoTotal: 0,
  costoPorUnidad: 0,
  estadoPago: 'pendiente' as const,
  pagoDistribuidor: 0,
  saldoPendiente: 0,
  plazoCredito: 0,
  estado: 'borrador' as const,
  prioridad: 'normal' as const,
  inspeccionRealizada: false,
  productosDefectuosos: 0
};

export const productoOCDefaultValues = {
  sku: '',
  nombre: '',
  cantidadSolicitada: 1,
  cantidadRecibida: 0,
  cantidadPendiente: 0,
  unidadMedida: 'pza',
  costoUnitario: 0,
  subtotal: 0,
  descuento: 0,
  impuestos: 0,
  total: 0
};

// ============================================================================
// MENSAJES DE ERROR PERSONALIZADOS
// ============================================================================

export const ordenCompraErrorMessages = {
  numeroOC: 'El número de OC es requerido',
  distribuidorId: 'Debes seleccionar un distribuidor',
  distribuidorNombre: 'El nombre del distribuidor es requerido',
  fecha: 'La fecha es requerida',
  origen: 'El origen es requerido',
  destino: 'El destino es requerido',
  productos: 'Debes agregar al menos un producto',
  cantidadTotal: 'La cantidad total debe ser mayor a cero',
  costoTotal: 'El costo total debe ser mayor a cero',
  costoPorUnidad: 'El costo por unidad es requerido',
  estado: 'Selecciona un estado válido',
  saldos: 'Los cálculos de saldos no cuadran',
  fechas: 'Las fechas de entrega/recepción no pueden ser anteriores a la fecha de orden'
};

// ============================================================================
// LABELS PARA UI
// ============================================================================

export const estadosOCLabels: Record<typeof ESTADOS_OC[number], string> = {
  borrador: 'Borrador',
  pendiente: 'Pendiente',
  enviada: 'Enviada',
  en_transito: 'En Tránsito',
  recibida_parcial: 'Recibida Parcial',
  recibida: 'Recibida',
  completada: 'Completada',
  cancelada: 'Cancelada',
  devuelta: 'Devuelta'
};

export const estadosPagoOCLabels: Record<typeof ESTADOS_PAGO_OC[number], string> = {
  pendiente: 'Pendiente',
  anticipo: 'Anticipo',
  parcial: 'Pago Parcial',
  completo: 'Pago Completo',
  vencido: 'Vencido'
};

export const prioridadesLabels: Record<typeof PRIORIDADES[number], string> = {
  baja: 'Baja',
  normal: 'Normal',
  alta: 'Alta',
  urgente: 'Urgente'
};

export const metodosEnvioLabels: Record<typeof METODOS_ENVIO[number], string> = {
  terrestre: 'Terrestre',
  aereo: 'Aéreo',
  maritimo: 'Marítimo',
  mensajeria: 'Mensajería',
  recoleccion: 'Recolección en Sitio',
  otro: 'Otro'
};

// ============================================================================
// TIPOS TYPESCRIPT
// ============================================================================

export type OrdenCompraFormData = z.infer<typeof ordenCompraSchema>;
export type OrdenCompraUpdateData = z.infer<typeof ordenCompraUpdateSchema>;
export type ProductoOCData = z.infer<typeof productoOCSchema>;
export type RecepcionOCData = z.infer<typeof recepcionOCSchema>;
export type PagoOCData = z.infer<typeof pagoOCSchema>;

export type EstadoOC = typeof ESTADOS_OC[number];
export type EstadoPagoOC = typeof ESTADOS_PAGO_OC[number];
export type Moneda = typeof MONEDAS[number];
export type Prioridad = typeof PRIORIDADES[number];
export type MetodoEnvio = typeof METODOS_ENVIO[number];

// Mantener compatibilidad con código existente
export type OrdenCompraInput = OrdenCompraFormData;
export const OrdenCompraSchema = ordenCompraSchema;
export const parseOrdenCompra = (obj: unknown): OrdenCompraInput => {
  return ordenCompraSchema.parse(obj);
};
