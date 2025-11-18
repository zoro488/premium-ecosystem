/**
 * 📦 TIPOS Y VALIDACIONES PARA ÓRDENES DE COMPRA
 * Sistema avanzado con análisis predictivo y correlaciones
 */
import { z } from 'zod';

// ============================================
// ENUMS Y CONSTANTES
// ============================================

export const OrigenDistribuidor = {
  PACMAN: 'PACMAN',
  Q_MAYA: 'Q-MAYA',
  Q_MAYA_MP: 'Q-MAYA-MP',
  AX_CANGREJO: 'A/X🌶️🦀',
  CH_MONTE: 'CH-MONTE',
  VALLE_MONTE: 'VALLE-MONTE',
} as const;

export type OrigenDistribuidorType = (typeof OrigenDistribuidor)[keyof typeof OrigenDistribuidor];

export const EstadoOrden = {
  PENDIENTE: 'pendiente',
  EN_TRANSITO: 'en_transito',
  COMPLETADA: 'completada',
  CANCELADA: 'cancelada',
  PARCIAL: 'parcial',
} as const;

export type EstadoOrdenType = (typeof EstadoOrden)[keyof typeof EstadoOrden];

// Aliases para compatibilidad con imports antiguos
export const ESTADOS_ORDEN = EstadoOrden;
export const ORIGENES_DISTRIBUIDOR = OrigenDistribuidor;

// ============================================
// SCHEMAS ZOD - VALIDACIÓN ENTERPRISE
// ============================================

/**
 * Schema para Orden de Compra con validaciones de negocio
 */
export const OrdenCompraSchema = z
  .object({
    // Identificación
    id: z.string().min(1, 'ID requerido'),
    oc: z.string().min(1, 'Número de OC requerido'),
    folio: z.string().optional(),

    // Temporal
    fecha: z
      .string()
      .datetime()
      .or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)),
    fechaEntrega: z
      .string()
      .datetime()
      .or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/))
      .optional(),
    fechaCreacion: z.string().datetime().optional(),

    // Distribuidor
    origen: z.nativeEnum(OrigenDistribuidor),
    distribuidor: z.string().min(1, 'Distribuidor requerido'),
    distribuidorId: z.string().optional(),

    // Cantidades
    cantidad: z.number().positive('Cantidad debe ser positiva').int('Cantidad debe ser entera'),

    // Costos (según Excel)
    costoDistribuidor: z
      .number()
      .positive('Costo distribuidor debe ser positivo')
      .describe('Costo base del distribuidor por unidad'),

    costoTransporte: z
      .number()
      .nonnegative('Costo transporte no puede ser negativo')
      .describe('Costo de transporte por unidad'),

    // CALCULADOS AUTOMÁTICAMENTE (read-only en forms)
    costoPorUnidad: z
      .number()
      .nonnegative()
      .describe('Auto: Costo Distribuidor + Costo Transporte'),

    costoTotal: z.number().nonnegative().describe('Auto: Cantidad * Costo Por Unidad'),

    // Stock y control
    stockActual: z.number().int().nonnegative().optional().describe('Stock disponible'),

    // Pagos y deudas
    pagoDistribuidor: z
      .number()
      .nonnegative()
      .optional()
      .default(0)
      .describe('Monto pagado al distribuidor'),

    deuda: z.number().nonnegative().describe('Auto: Costo Total - Pago Distribuidor'),

    // Estado y metadatos
    estado: z.nativeEnum(EstadoOrden).default(EstadoOrden.PENDIENTE),
    notas: z.string().optional(),
    tags: z.array(z.string()).optional(),

    // Tracking
    numeroGuia: z.string().optional(),
    transportista: z.string().optional(),

    // Audit
    creadoPor: z.string().optional(),
    modificadoPor: z.string().optional(),
    ultimaModificacion: z.string().datetime().optional(),
  })
  .refine(
    (data) => {
      // Validar que costo por unidad = costo distribuidor + costo transporte
      const expectedCostoPorUnidad = data.costoDistribuidor + data.costoTransporte;
      return Math.abs(data.costoPorUnidad - expectedCostoPorUnidad) < 0.01;
    },
    {
      message: 'Costo Por Unidad debe ser igual a Costo Distribuidor + Costo Transporte',
      path: ['costoPorUnidad'],
    }
  )
  .refine(
    (data) => {
      // Validar que costo total = cantidad * costo por unidad
      const expectedCostoTotal = data.cantidad * data.costoPorUnidad;
      return Math.abs(data.costoTotal - expectedCostoTotal) < 0.01;
    },
    {
      message: 'Costo Total debe ser igual a Cantidad × Costo Por Unidad',
      path: ['costoTotal'],
    }
  )
  .refine(
    (data) => {
      // Validar que deuda = costo total - pago distribuidor
      const expectedDeuda = data.costoTotal - (data.pagoDistribuidor || 0);
      return Math.abs(data.deuda - expectedDeuda) < 0.01;
    },
    {
      message: 'Deuda debe ser igual a Costo Total - Pago Distribuidor',
      path: ['deuda'],
    }
  );

export type OrdenCompra = z.infer<typeof OrdenCompraSchema>;

/**
 * Schema para crear nueva orden (sin campos calculados)
 */
export const NuevaOrdenCompraSchema = z.object({
  oc: z.string().min(1, 'Número de OC requerido'),
  fecha: z.string().min(1, 'Fecha requerida'),
  origen: z.string().min(1, 'Origen requerido'),
  distribuidor: z.string().min(1, 'Distribuidor requerido'),
  cantidad: z.number().positive('Cantidad debe ser positiva').int(),
  costoDistribuidor: z.number().positive('Costo distribuidor debe ser positivo'),
  costoTransporte: z.number().nonnegative('Costo transporte no puede ser negativo'),
  pagoDistribuidor: z.number().nonnegative().optional().default(0),
  fechaEntrega: z.string().optional(),
  notas: z.string().optional(),
});

export type NuevaOrdenCompra = z.infer<typeof NuevaOrdenCompraSchema>;

// ============================================
// TIPOS PARA ANÁLISIS AVANZADO
// ============================================

/**
 * Estadísticas agregadas por origen/distribuidor
 */
export interface EstadisticasDistribuidor {
  nombre: string;
  origen: OrigenDistribuidorType;
  totalOrdenes: number;
  totalUnidades: number;
  totalInvertido: number;
  totalAdeudo: number;
  promedios: {
    costoDistribuidor: number;
    costoTransporte: number;
    costoPorUnidad: number;
    cantidadPorOrden: number;
  };
  rangos: {
    costoDistribuidorMin: number;
    costoDistribuidorMax: number;
    costoTransporteMin: number;
    costoTransporteMax: number;
  };
  ultimaOrden: string; // fecha ISO
}

/**
 * Análisis de correlaciones (según JSON proporcionado)
 */
export interface AnalisisCorrelaciones {
  cantidadVsCostoTotal: number; // 0.9999 según datos
  cantidadVsCostoDistribuidor: number; // -0.4627
  cantidadVsCostoTransporte: number; // 0.5048
  cantidadVsCostoPorUnidad: number; // -0.4023
  matrizCompleta: {
    [key: string]: {
      [key: string]: number;
    };
  };
}

/**
 * Insights y recomendaciones automáticas
 */
export interface InsightOrdenCompra {
  tipo: 'info' | 'warning' | 'success' | 'error';
  categoria: 'costo' | 'cantidad' | 'distribuidor' | 'pago' | 'eficiencia';
  mensaje: string;
  prioridad: 'baja' | 'media' | 'alta' | 'critica';
  accionRecomendada?: string;
  metrica?: {
    actual: number;
    esperado: number;
    desviacion: number;
  };
}

/**
 * Scoring de distribuidor (0-100)
 */
export interface ScoringDistribuidor {
  distribuidorId: string;
  nombre: string;
  scoreTotal: number; // 0-100
  componentes: {
    precio: number; // 0-30 puntos
    confiabilidad: number; // 0-25 puntos
    volumen: number; // 0-20 puntos
    pagos: number; // 0-25 puntos
  };
  tendencia: 'mejorando' | 'estable' | 'empeorando';
  recomendacion: string;
}

/**
 * Predicción de costos futuros
 */
export interface PrediccionCostos {
  distribuidor: string;
  periodo: 'proximo_mes' | 'proximo_trimestre' | 'proximo_año';
  predicciones: {
    costoDistribuidorEstimado: number;
    costoTransporteEstimado: number;
    costoPorUnidadEstimado: number;
    confianza: number; // 0-1
  };
  tendencias: {
    costoDistribuidor: 'subiendo' | 'estable' | 'bajando';
    costoTransporte: 'subiendo' | 'estable' | 'bajando';
  };
}

// ============================================
// UTILIDADES Y HELPERS
// ============================================

/**
 * Calcula todos los campos derivados de una orden
 */
export const calcularCamposOrden = (
  input: NuevaOrdenCompra
): Omit<OrdenCompra, 'id' | 'estado' | 'creadoPor'> => {
  const costoPorUnidad = input.costoDistribuidor + input.costoTransporte;
  const costoTotal = input.cantidad * costoPorUnidad;
  const deuda = costoTotal - (input.pagoDistribuidor || 0);

  return {
    ...input,
    costoPorUnidad,
    costoTotal,
    deuda,
    fechaCreacion: new Date().toISOString(),
    ultimaModificacion: new Date().toISOString(),
  };
};

/**
 * Valida y retorna una orden completa con campos calculados
 */
export const crearOrdenCompleta = (input: NuevaOrdenCompra, id: string): OrdenCompra => {
  const camposCalculados = calcularCamposOrden(input);

  const orden: OrdenCompra = {
    id,
    folio: input.oc,
    estado: EstadoOrden.PENDIENTE,
    ...camposCalculados,
  };

  // Validar con schema
  const result = OrdenCompraSchema.safeParse(orden);

  if (!result.success) {
    throw new Error(`Validación fallida: ${result.error.message}`);
  }

  return result.data;
};

/**
 * Genera ID único para orden
 */
export const generarIdOrden = (): string => {
  return `OC-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Formatea moneda mexicana
 */
export const formatearMoneda = (monto: number): string => {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
  }).format(monto);
};

/**
 * Calcula porcentaje de variación
 */
export const calcularVariacion = (actual: number, anterior: number): number => {
  if (anterior === 0) return 0;
  return ((actual - anterior) / anterior) * 100;
};
