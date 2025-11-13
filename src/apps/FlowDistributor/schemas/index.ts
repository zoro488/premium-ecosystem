/**
 * FlowDistributor - Esquemas de Validación Zod
 * @module FlowDistributor/schemas
 */
import { z } from 'zod';

// NOTE: Los tipos en '../types' son type aliases, NO enums
// Por eso usamos z.enum() en lugar de z.nativeEnum()

// ============================================================================
// ENUMS Y CONSTANTES
// ============================================================================

// Definimos los enums como const para z.enum()
const OCEstadoEnum = ['PENDING', 'IN_TRANSIT', 'RECEIVED', 'COMPLETED', 'CANCELLED'] as const;

const VentaEstadoEnum = [
  'DRAFT',
  'CONFIRMED',
  'PAID',
  'PARTIALLY_PAID',
  'CANCELLED',
  'PENDIENTE',
  'PAGADA',
  'CREDITO',
  'CANCELADA',
  'PENDING',
  'SHIPPED',
  'DELIVERED',
] as const;

const PagoEstadoEnum = ['PENDING', 'PARTIAL', 'COMPLETED', 'OVERDUE', 'CANCELLED'] as const;

const CategoriaClienteEnum = ['REGULAR', 'WHOLESALE', 'INTERNAL', 'VIP'] as const;

const NivelRiesgoEnum = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'] as const;

const CategoriaGastoEnum = [
  'OPERATIONAL',
  'ADMINISTRATIVE',
  'TRANSPORT',
  'SUPPLIES',
  'OTHER',
] as const;

const GastoEstadoEnum = ['PENDING', 'PENDING_APPROVAL', 'APPROVED', 'PAID', 'REJECTED'] as const;

const MonedaEnum = ['USD', 'MXN'] as const;

const TipoMovimientoEnum = ['ENTRY', 'EXIT', 'TRANSFER', 'ADJUSTMENT'] as const;

const EnvioEstadoEnum = ['PENDING', 'IN_TRANSIT', 'DELIVERED', 'RETURNED'] as const;

// Exportar tipos de enum para uso en el código
export type OCEstado = (typeof OCEstadoEnum)[number];
export type VentaEstado = (typeof VentaEstadoEnum)[number];
export type PagoEstado = (typeof PagoEstadoEnum)[number];
export type CategoriaCliente = (typeof CategoriaClienteEnum)[number];
export type NivelRiesgo = (typeof NivelRiesgoEnum)[number];
export type CategoriaGasto = (typeof CategoriaGastoEnum)[number];
export type GastoEstado = (typeof GastoEstadoEnum)[number];
export type Moneda = (typeof MonedaEnum)[number];
export type TipoMovimiento = (typeof TipoMovimientoEnum)[number];
export type EnvioEstado = (typeof EnvioEstadoEnum)[number];

// ============================================================================
// ESQUEMAS COMPARTIDOS
// ============================================================================

/**
 * Esquema de dirección
 */
export const DireccionSchema = z.object({
  calle: z.string().min(1, 'Calle es requerida'),
  numero: z.string().optional(),
  colonia: z.string().optional(),
  ciudad: z.string().min(1, 'Ciudad es requerida'),
  estado: z.string().min(1, 'Estado es requerido'),
  codigoPostal: z.string().regex(/^\d{5}$/, 'Código postal inválido'),
  pais: z.string().default('México'),
  referencias: z.string().optional(),
});

export type Direccion = z.infer<typeof DireccionSchema>;

/**
 * Esquema de contacto
 */
export const ContactoSchema = z.object({
  nombre: z.string().min(1, 'Nombre es requerido'),
  telefono: z.string().min(10, 'Teléfono debe tener al menos 10 dígitos'),
  email: z.string().email('Email inválido'),
  puesto: z.string().optional(),
  whatsapp: z.string().optional(),
});

export type Contacto = z.infer<typeof ContactoSchema>;

// ============================================================================
// ORDENES DE COMPRA
// ============================================================================

/**
 * Esquema de producto en OC
 */
export const ProductoOCSchema = z
  .object({
    sku: z.string().min(1, 'SKU es requerido'),
    nombre: z.string().min(1, 'Nombre es requerido'),
    descripcion: z.string().optional(),
    cantidad: z.number().positive('Cantidad debe ser positiva'),
    cantidadRecibida: z.number().nonnegative('Cantidad recibida no puede ser negativa').default(0),
    costoUnitario: z.number().positive('Costo unitario debe ser positivo'),
    costoTotal: z.number().nonnegative('Costo total no puede ser negativo'),
    unidadMedida: z.string().default('pza'),
  })
  .refine((data) => data.costoTotal === data.cantidad * data.costoUnitario, {
    message: 'El costo total debe ser igual a cantidad * costo unitario',
  })
  .refine((data) => data.cantidadRecibida <= data.cantidad, {
    message: 'Cantidad recibida no puede exceder cantidad ordenada',
  });

export type ProductoOC = z.infer<typeof ProductoOCSchema>;

/**
 * Esquema de Orden de Compra
 */
export const OrdenCompraSchema = z
  .object({
    numeroOC: z.string().min(1, 'Número de OC es requerido'),
    fecha: z.date({ required_error: 'Fecha es requerida' }),
    fechaEstimadaEntrega: z.date().optional(),
    fechaRecepcion: z.date().optional(),

    distribuidorId: z.string().min(1, 'Distribuidor es requerido'),
    distribuidor: z.string().min(1, 'Nombre del distribuidor es requerido'),
    origen: z.string().min(1, 'Origen es requerido'),

    productos: z.array(ProductoOCSchema).min(1, 'Debe incluir al menos un producto'),

    cantidadTotal: z.number().positive('Cantidad total debe ser positiva'),
    cantidadRecibida: z.number().nonnegative('Cantidad recibida no puede ser negativa').default(0),
    stockActual: z.number().nonnegative('Stock actual no puede ser negativo').default(0),
    stockMinimo: z.number().nonnegative('Stock mínimo no puede ser negativo').default(0),

    costoDistribuidor: z.number().nonnegative('Costo del distribuidor no puede ser negativo'),
    costoTransporte: z.number().nonnegative('Costo de transporte no puede ser negativo').default(0),
    costoAduanal: z.number().nonnegative('Costo aduanal no puede ser negativo').default(0),
    otrosCostos: z.number().nonnegative('Otros costos no pueden ser negativos').default(0),
    costoTotal: z.number().positive('Costo total debe ser positivo'),
    costoPorUnidad: z.number().positive('Costo por unidad debe ser positivo'),

    pagoDistribuidor: z
      .number()
      .nonnegative('Pago al distribuidor no puede ser negativo')
      .default(0),
    saldoPendiente: z.number().nonnegative('Saldo pendiente no puede ser negativo'),

    estado: z.enum(OCEstadoEnum),
    tracking: z.string().optional(),
    notasRecepcion: z.string().optional(),
    observaciones: z.string().optional(),

    factura: z.string().optional(),
    pedimento: z.string().optional(),
    comprobantes: z.array(z.string()).optional(),
  })
  .refine(
    (data) => {
      const costoCalculado =
        Number(data.costoDistribuidor) +
        Number(data.costoTransporte) +
        Number(data.costoAduanal) +
        Number(data.otrosCostos);
      return Math.abs(Number(data.costoTotal) - costoCalculado) < 0.01;
    },
    { message: 'El costo total debe ser la suma de todos los costos' }
  )
  .refine(
    (data) => {
      const costoCalculado = Number(data.costoTotal) / Number(data.cantidadTotal);
      return Math.abs(Number(data.costoPorUnidad) - costoCalculado) < 0.01;
    },
    { message: 'El costo por unidad debe ser costo total / cantidad total' }
  )
  .refine(
    (data) =>
      Number(data.saldoPendiente) === Number(data.costoTotal) - Number(data.pagoDistribuidor),
    {
      message: 'El saldo pendiente debe ser costo total - pago distribuidor',
    }
  )
  .refine((data) => data.cantidadRecibida <= data.cantidadTotal, {
    message: 'Cantidad recibida no puede exceder cantidad total',
  })
  .refine((data) => !data.fechaRecepcion || data.fechaRecepcion >= data.fecha, {
    message: 'Fecha de recepción no puede ser anterior a fecha de orden',
  })
  .refine((data) => !data.fechaEstimadaEntrega || data.fechaEstimadaEntrega >= data.fecha, {
    message: 'Fecha estimada de entrega no puede ser anterior a fecha de orden',
  });

export type OrdenCompra = z.infer<typeof OrdenCompraSchema>;

// ============================================================================
// DISTRIBUIDORES
// ============================================================================

/**
 * Esquema de Distribuidor
 */
export const DistribuidorSchema = z
  .object({
    nombre: z.string().min(1, 'Nombre es requerido'),
    razonSocial: z.string().min(1, 'Razón social es requerida'),
    rfc: z
      .string()
      .regex(/^[A-ZÑ&]{3,4}\d{6}[A-Z0-9]{3}$/, 'RFC inválido')
      .optional(),

    contactos: z.array(ContactoSchema).min(1, 'Debe incluir al menos un contacto'),
    direccion: DireccionSchema,

    totalComprado: z.number().nonnegative('Total comprado no puede ser negativo').default(0),
    totalPagado: z.number().nonnegative('Total pagado no puede ser negativo').default(0),
    saldoPendiente: z.number().nonnegative('Saldo pendiente no puede ser negativo').default(0),
    creditoDias: z.number().int().nonnegative('Días de crédito no pueden ser negativos').default(0),

    calificacion: z.number().min(1).max(5, 'Calificación debe estar entre 1 y 5').default(3),
    tiempoEntregaPromedio: z
      .number()
      .nonnegative('Tiempo de entrega promedio no puede ser negativo')
      .default(0),
    cumplimiento: z.number().min(0).max(100, 'Cumplimiento debe estar entre 0 y 100').default(100),

    activo: z.boolean().default(true),
    notas: z.string().optional(),

    ordenesCompra: z.array(z.string()).default([]),
    ultimaCompra: z.date().optional(),
  })
  .refine((data) => data.saldoPendiente === data.totalComprado - data.totalPagado, {
    message: 'Saldo pendiente debe ser total comprado - total pagado',
  });

export type Distribuidor = z.infer<typeof DistribuidorSchema>;

// ============================================================================
// VENTAS
// ============================================================================

/**
 * Esquema de producto en venta
 */
export const ProductoVentaSchema = z
  .object({
    sku: z.string().min(1, 'SKU es requerido'),
    nombre: z.string().min(1, 'Nombre es requerido'),
    descripcion: z.string().optional(),
    cantidad: z.number().positive('Cantidad debe ser positiva'),
    precioUnitario: z.number().positive('Precio unitario debe ser positivo'),
    descuento: z.number().min(0).max(100, 'Descuento debe estar entre 0 y 100').default(0),
    subtotal: z.number().nonnegative('Subtotal no puede ser negativo'),
    impuestos: z.number().nonnegative('Impuestos no pueden ser negativos').default(0),
    total: z.number().nonnegative('Total no puede ser negativo'),
    costoUnitario: z.number().nonnegative('Costo unitario no puede ser negativo'),
  })
  .refine(
    (data) => {
      const subtotalCalculado = data.cantidad * data.precioUnitario * (1 - data.descuento / 100);
      return Math.abs(data.subtotal - subtotalCalculado) < 0.01;
    },
    { message: 'Subtotal debe ser cantidad * precio * (1 - descuento/100)' }
  )
  .refine(
    (data) => {
      const totalCalculado = data.subtotal + data.impuestos;
      return Math.abs(data.total - totalCalculado) < 0.01;
    },
    { message: 'Total debe ser subtotal + impuestos' }
  );

export type ProductoVenta = z.infer<typeof ProductoVentaSchema>;

/**
 * Esquema de Venta
 */
export const VentaSchema = z
  .object({
    numeroVenta: z.string().min(1, 'Número de venta es requerido'),
    folio: z.string().min(1, 'Folio es requerido'),

    fecha: z.date({ required_error: 'Fecha es requerida' }),
    fechaEntrega: z.date().optional(),
    fechaPago: z.date().optional(),

    clienteId: z.string().min(1, 'Cliente es requerido'),
    cliente: z.string().min(1, 'Nombre del cliente es requerido'),

    productos: z.array(ProductoVentaSchema).min(1, 'Debe incluir al menos un producto'),

    ocRelacionada: z.string().optional(),

    cantidad: z.number().positive('Cantidad debe ser positiva'),

    precioVenta: z.number().positive('Precio de venta debe ser positivo'),
    subtotal: z.number().nonnegative('Subtotal no puede ser negativo'),
    descuento: z.number().nonnegative('Descuento no puede ser negativo').default(0),
    impuestos: z.number().nonnegative('Impuestos no pueden ser negativos').default(0),
    total: z.number().positive('Total debe ser positivo'),

    costoProducto: z.number().nonnegative('Costo del producto no puede ser negativo'),
    costoFlete: z.number().nonnegative('Costo de flete no puede ser negativo').default(0),
    costoOperativo: z.number().nonnegative('Costo operativo no puede ser negativo').default(0),
    costoTotal: z.number().nonnegative('Costo total no puede ser negativo'),

    utilidadBruta: z.number(),
    utilidadNeta: z.number(),
    margen: z.number().min(0).max(100),

    bovedaMonte: z.number().nonnegative('Bóveda Monte no puede ser negativa').default(0),
    flete: z.string().default(''),
    fleteUtilidad: z.number().default(0),

    estado: z.enum(VentaEstadoEnum),
    estadoPago: z.enum(PagoEstadoEnum),

    metodoPago: z.string().optional(),
    condicionPago: z.string().optional(),
    concepto: z.string().optional(),
    observaciones: z.string().optional(),

    factura: z.string().optional(),
    remision: z.string().optional(),
    comprobantes: z.array(z.string()).optional(),
  })
  .refine(
    (data) => {
      const totalCalculado =
        Number(data.subtotal) - Number(data.descuento) + Number(data.impuestos);
      return Math.abs(Number(data.total) - totalCalculado) < 0.01;
    },
    { message: 'Total debe ser subtotal - descuento + impuestos' }
  )
  .refine(
    (data) => {
      const costoCalculado = data.costoProducto + data.costoFlete + data.costoOperativo;
      return Math.abs(data.costoTotal - costoCalculado) < 0.01;
    },
    { message: 'Costo total debe ser suma de todos los costos' }
  )
  .refine(
    (data) => {
      const utilidadBrutaCalculada = data.total - data.costoProducto;
      return Math.abs(data.utilidadBruta - utilidadBrutaCalculada) < 0.01;
    },
    { message: 'Utilidad bruta debe ser total - costo producto' }
  )
  .refine(
    (data) => {
      const utilidadNetaCalculada = data.total - data.costoTotal;
      return Math.abs(data.utilidadNeta - utilidadNetaCalculada) < 0.01;
    },
    { message: 'Utilidad neta debe ser total - costo total' }
  )
  .refine(
    (data) => {
      const margenCalculado = data.total > 0 ? (data.utilidadNeta / data.total) * 100 : 0;
      return Math.abs(data.margen - margenCalculado) < 0.01;
    },
    { message: 'Margen debe ser (utilidad neta / total) * 100' }
  )
  .refine((data) => !data.fechaEntrega || data.fechaEntrega >= data.fecha, {
    message: 'Fecha de entrega no puede ser anterior a fecha de venta',
  })
  .refine((data) => !data.fechaPago || data.fechaPago >= data.fecha, {
    message: 'Fecha de pago no puede ser anterior a fecha de venta',
  });

export type Venta = z.infer<typeof VentaSchema>;

// ============================================================================
// CLIENTES
// ============================================================================

/**
 * Esquema de precio especial
 */
export const PrecioEspecialSchema = z
  .object({
    sku: z.string().min(1, 'SKU es requerido'),
    producto: z.string().min(1, 'Producto es requerido'),
    precio: z.number().positive('Precio debe ser positivo'),
    vigenciaDesde: z.date().optional(),
    vigenciaHasta: z.date().optional(),
  })
  .refine(
    (data) =>
      !data.vigenciaDesde || !data.vigenciaHasta || data.vigenciaHasta >= data.vigenciaDesde,
    { message: 'Vigencia hasta debe ser posterior a vigencia desde' }
  );

export type PrecioEspecial = z.infer<typeof PrecioEspecialSchema>;

/**
 * Esquema de Cliente
 */
export const ClienteSchema = z
  .object({
    nombre: z.string().min(1, 'Nombre es requerido'),
    razonSocial: z.string().min(1, 'Razón social es requerida'),
    nombreComercial: z.string().optional(),
    rfc: z
      .string()
      .regex(/^[A-ZÑ&]{3,4}\d{6}[A-Z0-9]{3}$/, 'RFC inválido')
      .optional(),

    contactos: z.array(ContactoSchema).min(1, 'Debe incluir al menos un contacto'),
    direccion: DireccionSchema,
    direccionEntrega: DireccionSchema.optional(),

    creditoAutorizado: z
      .number()
      .nonnegative('Crédito autorizado no puede ser negativo')
      .default(0),
    creditoDisponible: z
      .number()
      .nonnegative('Crédito disponible no puede ser negativo')
      .default(0),
    creditoUtilizado: z.number().nonnegative('Crédito utilizado no puede ser negativo').default(0),
    diasCredito: z.number().int().nonnegative('Días de crédito no pueden ser negativos').default(0),
    limiteMensual: z.number().nonnegative('Límite mensual no puede ser negativo').optional(),

    descuentoAutorizado: z
      .number()
      .min(0)
      .max(100, 'Descuento debe estar entre 0 y 100')
      .default(0),
    preciosEspeciales: z.array(PrecioEspecialSchema).optional(),
    vendedorAsignado: z.string().optional(),
    zonaVenta: z.string().optional(),

    totalCompras: z.number().nonnegative('Total compras no puede ser negativo').default(0),
    totalPagado: z.number().nonnegative('Total pagado no puede ser negativo').default(0),
    saldoPendiente: z.number().nonnegative('Saldo pendiente no puede ser negativo').default(0),
    ventasPromedio: z.number().nonnegative('Ventas promedio no pueden ser negativas').default(0),
    ultimaCompra: z.date().optional(),
    frecuenciaCompra: z
      .number()
      .nonnegative('Frecuencia de compra no puede ser negativa')
      .default(30),

    diasPromedioAtraso: z
      .number()
      .nonnegative('Días promedio de atraso no pueden ser negativos')
      .default(0),
    cumplimientoPago: z
      .number()
      .min(0)
      .max(100, 'Cumplimiento de pago debe estar entre 0 y 100')
      .default(100),
    ventasVencidas: z.number().nonnegative('Ventas vencidas no pueden ser negativas').default(0),

    categoria: z.enum(CategoriaClienteEnum),
    nivelRiesgo: z.enum(NivelRiesgoEnum),
    calificacion: z.number().min(1).max(5, 'Calificación debe estar entre 1 y 5').default(3),

    activo: z.boolean().default(true),
    bloqueado: z.boolean().default(false),
    motivoBloqueo: z.string().optional(),
    fechaBloqueo: z.date().optional(),

    ventasProyectadas: z
      .number()
      .nonnegative('Ventas proyectadas no pueden ser negativas')
      .default(0),
    utilidadProyectada: z
      .number()
      .nonnegative('Utilidad proyectada no puede ser negativa')
      .default(0),

    notas: z.string().optional(),
    observaciones: z.string().optional(),
  })
  .refine((data) => data.creditoUtilizado + data.creditoDisponible === data.creditoAutorizado, {
    message: 'Crédito utilizado + disponible debe ser igual a crédito autorizado',
  })
  .refine((data) => data.saldoPendiente === data.totalCompras - data.totalPagado, {
    message: 'Saldo pendiente debe ser total compras - total pagado',
  })
  .refine((data) => !data.bloqueado || data.motivoBloqueo, {
    message: 'Si el cliente está bloqueado, debe incluir motivo de bloqueo',
  });

export type Cliente = z.infer<typeof ClienteSchema>;

// ============================================================================
// GASTOS Y ABONOS
// ============================================================================

/**
 * Esquema de Gasto
 */
export const GastoSchema = z
  .object({
    numeroGasto: z.string().min(1, 'Número de gasto es requerido'),

    fecha: z.date({ required_error: 'Fecha es requerida' }),
    fechaVencimiento: z.date().optional(),
    fechaPago: z.date().optional(),

    categoria: z.enum(CategoriaGastoEnum),
    subcategoria: z.string().optional(),

    origen: z.string().min(1, 'Origen es requerido'),
    destino: z.string().min(1, 'Destino es requerido'),

    moneda: z.enum(MonedaEnum),
    monto: z.number().positive('Monto debe ser positivo'),
    tipoCambio: z.number().positive('Tipo de cambio debe ser positivo').default(1),
    montoPesos: z.number().positive('Monto en pesos debe ser positivo'),

    concepto: z.string().min(1, 'Concepto es requerido'),
    descripcion: z.string().optional(),
    observaciones: z.string().optional(),

    estado: z.enum(GastoEstadoEnum),

    presupuestoId: z.string().optional(),
    excedePresupuesto: z.boolean().default(false),

    requiereAprobacion: z.boolean().default(false),
    aprobadoPor: z.string().optional(),
    fechaAprobacion: z.date().optional(),

    metodoPago: z.string().optional(),
    referenciaPago: z.string().optional(),
    comprobante: z.string().optional(),

    deducible: z.boolean().default(true),
    facturaId: z.string().optional(),
  })
  .refine(
    (data) => {
      const montoPesosCalculado = data.monto * data.tipoCambio;
      return Math.abs(data.montoPesos - montoPesosCalculado) < 0.01;
    },
    { message: 'Monto en pesos debe ser monto * tipo de cambio' }
  )
  .refine((data) => !data.fechaPago || data.fechaPago >= data.fecha, {
    message: 'Fecha de pago no puede ser anterior a fecha de gasto',
  })
  .refine(
    (data) => !data.requiereAprobacion || data.estado === 'PENDING_APPROVAL' || data.aprobadoPor,
    { message: 'Si requiere aprobación, debe estar pendiente o tener aprobador' }
  );

export type Gasto = z.infer<typeof GastoSchema>;

/**
 * Esquema de Abono
 */
export const AbonoSchema = z
  .object({
    numeroAbono: z.string().min(1, 'Número de abono es requerido'),

    fecha: z.date({ required_error: 'Fecha es requerida' }),

    origen: z.string().min(1, 'Origen es requerido'),
    destino: z.string().min(1, 'Destino es requerido'),

    moneda: z.enum(MonedaEnum),
    monto: z.number().positive('Monto debe ser positivo'),
    tipoCambio: z.number().positive('Tipo de cambio debe ser positivo').default(1),
    montoPesos: z.number().positive('Monto en pesos debe ser positivo'),

    ventaId: z.string().optional(),
    clienteId: z.string().optional(),

    concepto: z.string().min(1, 'Concepto es requerido'),
    metodoPago: z.string().optional(),
    referencia: z.string().optional(),

    observaciones: z.string().optional(),

    comprobante: z.string().optional(),
    factura: z.string().optional(),
  })
  .refine(
    (data) => {
      const montoPesosCalculado = data.monto * data.tipoCambio;
      return Math.abs(data.montoPesos - montoPesosCalculado) < 0.01;
    },
    { message: 'Monto en pesos debe ser monto * tipo de cambio' }
  );

export type Abono = z.infer<typeof AbonoSchema>;

// ============================================================================
// INVENTARIO
// ============================================================================

/**
 * Esquema de Movimiento de Inventario
 */
export const MovimientoInventarioSchema = z
  .object({
    tipo: z.enum(TipoMovimientoEnum),

    referenciaId: z.string().optional(),
    referenciaNumero: z.string().optional(),

    sku: z.string().min(1, 'SKU es requerido'),
    producto: z.string().min(1, 'Producto es requerido'),

    cantidad: z.number().positive('Cantidad debe ser positiva'),
    cantidadAnterior: z.number().nonnegative('Cantidad anterior no puede ser negativa'),
    cantidadNueva: z.number().nonnegative('Cantidad nueva no puede ser negativa'),

    almacenOrigen: z.string().optional(),
    almacenDestino: z.string().optional(),

    costoUnitario: z.number().nonnegative('Costo unitario no puede ser negativo'),
    costoTotal: z.number().nonnegative('Costo total no puede ser negativo'),

    fecha: z.date({ required_error: 'Fecha es requerida' }),
    usuario: z.string().min(1, 'Usuario es requerido'),

    motivo: z.string().min(1, 'Motivo es requerido'),
    observaciones: z.string().optional(),
    aprobadoPor: z.string().optional(),
  })
  .refine(
    (data) => {
      const costoCalculado = data.cantidad * data.costoUnitario;
      return Math.abs(data.costoTotal - costoCalculado) < 0.01;
    },
    { message: 'Costo total debe ser cantidad * costo unitario' }
  )
  .refine(
    (data) => {
      if (data.tipo === 'ENTRY') {
        return data.cantidadNueva === data.cantidadAnterior + data.cantidad;
      }
      if (data.tipo === 'EXIT') {
        return data.cantidadNueva === data.cantidadAnterior - data.cantidad;
      }
      return true;
    },
    { message: 'Cantidad nueva no coincide con el tipo de movimiento' }
  );

export type MovimientoInventario = z.infer<typeof MovimientoInventarioSchema>;

// ============================================================================
// ENVÍOS
// ============================================================================

/**
 * Esquema de Envío
 */
export const EnvioSchema = z
  .object({
    numeroEnvio: z.string().min(1, 'Número de envío es requerido'),
    tracking: z.string().optional(),

    ventaId: z.string().min(1, 'Venta es requerida'),
    clienteId: z.string().min(1, 'Cliente es requerido'),

    origen: z.string().min(1, 'Origen es requerido'),
    destino: z.string().min(1, 'Destino es requerido'),
    direccionEntrega: DireccionSchema,

    fechaSalida: z.date().optional(),
    fechaEstimada: z.date({ required_error: 'Fecha estimada es requerida' }),
    fechaEntrega: z.date().optional(),

    transportista: z.string().min(1, 'Transportista es requerido'),
    conductor: z.string().optional(),
    vehiculo: z.string().optional(),
    telefono: z.string().optional(),

    peso: z.number().positive('Peso debe ser positivo'),
    volumen: z.number().positive('Volumen debe ser positivo'),
    paquetes: z.number().int().positive('Número de paquetes debe ser positivo'),

    costoFlete: z.number().nonnegative('Costo de flete no puede ser negativo'),
    costoSeguro: z.number().nonnegative('Costo de seguro no puede ser negativo').default(0),
    otrosCostos: z.number().nonnegative('Otros costos no pueden ser negativos').default(0),
    costoTotal: z.number().nonnegative('Costo total no puede ser negativo'),

    estado: z.enum(EnvioEstadoEnum),

    ubicacionActual: z.string().optional(),
    ultimaActualizacion: z.date().optional(),

    recibidoPor: z.string().optional(),
    firmaRecepcion: z.string().optional(),
    fotoEvidencia: z.array(z.string()).optional(),

    instrucciones: z.string().optional(),
    observaciones: z.string().optional(),
    incidencias: z.string().optional(),
  })
  .refine(
    (data) => {
      const costoCalculado = data.costoFlete + data.costoSeguro + data.otrosCostos;
      return Math.abs(data.costoTotal - costoCalculado) < 0.01;
    },
    { message: 'Costo total debe ser suma de todos los costos' }
  )
  .refine(
    (data) => !data.fechaSalida || !data.fechaEstimada || data.fechaEstimada >= data.fechaSalida,
    { message: 'Fecha estimada debe ser posterior a fecha de salida' }
  )
  .refine(
    (data) => !data.fechaEntrega || !data.fechaSalida || data.fechaEntrega >= data.fechaSalida,
    { message: 'Fecha de entrega debe ser posterior a fecha de salida' }
  );

export type Envio = z.infer<typeof EnvioSchema>;

// ============================================================================
// EXPORTACIONES
// ============================================================================

export const schemas = {
  // Compartidos
  DireccionSchema,
  ContactoSchema,

  // Órdenes de Compra
  ProductoOCSchema,
  OrdenCompraSchema,

  // Distribuidores
  DistribuidorSchema,

  // Ventas
  ProductoVentaSchema,
  VentaSchema,

  // Clientes
  PrecioEspecialSchema,
  ClienteSchema,

  // Gastos y Abonos
  GastoSchema,
  AbonoSchema,

  // Inventario
  MovimientoInventarioSchema,

  // Envíos
  EnvioSchema,
};

// Exportar constantes de enum para uso en el código
export const GASTO_ESTADO = {
  PENDING: 'PENDING',
  PENDING_APPROVAL: 'PENDING_APPROVAL',
  APPROVED: 'APPROVED',
  PAID: 'PAID',
  REJECTED: 'REJECTED',
} as const;

export const TIPO_MOVIMIENTO = {
  ENTRY: 'ENTRY',
  EXIT: 'EXIT',
  TRANSFER: 'TRANSFER',
  ADJUSTMENT: 'ADJUSTMENT',
} as const;

export default schemas;
