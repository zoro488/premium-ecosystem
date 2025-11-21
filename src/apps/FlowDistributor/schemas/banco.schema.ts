/**
 * 🏦 SCHEMA DE VALIDACIÓN - BANCOS
 *
 * Sistema de validación para la gestión de bancos, cuentas bancarias,
 * transacciones, cortes de caja y conciliaciones bancarias.
 *
 * @module FlowDistributor/schemas/banco
 */

import { z } from 'zod';

// ============================================================================
// ENUMS Y CONSTANTES
// ============================================================================

/**
 * 7 Bancos del Sistema
 */
export const BANCOS_SISTEMA = [
  'Bóveda Monte',
  'Bóveda USA',
  'Azteca',
  'Banorte',
  'Utilidades',
  'Guardadito',
  'Miel'
] as const;

/**
 * Tipos de cuenta bancaria
 */
export const TIPOS_CUENTA = [
  'ahorros',
  'corriente',
  'inversion',
  'nomina',
  'empresarial',
  'otro'
] as const;

/**
 * Monedas soportadas
 */
export const MONEDAS = ['MXN', 'USD', 'EUR'] as const;

/**
 * Estados de cuenta bancaria
 */
export const ESTADOS_CUENTA = ['activa', 'inactiva', 'bloqueada', 'cerrada'] as const;

/**
 * Tipos de transacción
 */
export const TIPOS_TRANSACCION = [
  'ingreso',
  'gasto',
  'transferencia_entrada',
  'transferencia_salida',
  'ajuste',
  'interes',
  'comision',
  'cargo_bancario',
  'devolucion',
  'deposito',
  'retiro'
] as const;

/**
 * Estados de transacción
 */
export const ESTADOS_TRANSACCION = [
  'pendiente',
  'procesando',
  'completada',
  'fallida',
  'cancelada',
  'revertida'
] as const;

/**
 * Frecuencias para transacciones recurrentes
 */
export const FRECUENCIAS = ['diario', 'semanal', 'quincenal', 'mensual', 'bimestral', 'trimestral', 'semestral', 'anual'] as const;

/**
 * Estados de corte de caja
 */
export const ESTADOS_CORTE = ['abierto', 'cerrado', 'auditado', 'conciliado'] as const;

// ============================================================================
// SCHEMAS DE CUENTA BANCARIA
// ============================================================================

/**
 * Schema de información bancaria
 */
export const infoBancariaSchema = z.object({
  numeroCuenta: z.string().min(10, 'El número de cuenta debe tener al menos 10 dígitos'),
  clabe: z.string().regex(/^\d{18}$/, 'La CLABE debe tener exactamente 18 dígitos').optional(),
  swift: z.string().regex(/^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/, 'Código SWIFT inválido').optional(),
  iban: z.string().optional(),
  sucursal: z.string().optional(),
  referencia: z.string().optional()
});

/**
 * Schema principal de banco/cuenta bancaria
 */
export const bancoSchema = z.object({
  // Identificación
  id: z.string().optional(),
  nombre: z.enum(BANCOS_SISTEMA, {
    errorMap: () => ({ message: 'Selecciona un banco válido del sistema' })
  }),
  nombreCompleto: z.string().min(1, 'El nombre completo del banco es requerido'),
  alias: z.string().optional(),

  // Tipo y estado
  tipoCuenta: z.enum(TIPOS_CUENTA, {
    errorMap: () => ({ message: 'Selecciona un tipo de cuenta válido' })
  }),
  moneda: z.enum(MONEDAS, {
    errorMap: () => ({ message: 'Selecciona una moneda válida' })
  }).default('MXN'),
  estado: z.enum(ESTADOS_CUENTA, {
    errorMap: () => ({ message: 'Estado de cuenta inválido' })
  }).default('activa'),

  // Información bancaria
  informacionBancaria: infoBancariaSchema,

  // Saldos y límites
  saldoActual: z.number({
    required_error: 'El saldo actual es requerido',
    invalid_type_error: 'El saldo debe ser un número'
  }),
  saldoInicial: z.number().default(0),
  saldoMinimo: z.number().min(0, 'El saldo mínimo no puede ser negativo').default(0),
  limiteRetiro: z.number().min(0, 'El límite de retiro no puede ser negativo').optional(),
  limiteTransferencia: z.number().min(0, 'El límite de transferencia no puede ser negativo').optional(),

  // Totales
  totalIngresos: z.number().nonnegative('Los ingresos totales no pueden ser negativos').default(0),
  totalGastos: z.number().nonnegative('Los gastos totales no pueden ser negativos').default(0),
  totalTransferenciasEntrada: z.number().nonnegative().default(0),
  totalTransferenciasSalida: z.number().nonnegative().default(0),

  // Auditoría y metadatos
  fechaApertura: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato de fecha inválido (YYYY-MM-DD)'),
  fechaCierre: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato de fecha inválido').optional(),
  fechaUltimaTransaccion: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato de fecha inválido').optional(),

  ultimoCorteCaja: z.string().optional(),
  ultimaConciliacion: z.string().optional(),

  // Configuración
  requiereAprobacion: z.boolean().default(false),
  limiteDiario: z.number().nonnegative().optional(),
  alertaSaldoBajo: z.boolean().default(true),
  notificacionesActivas: z.boolean().default(true),

  // Notas y observaciones
  descripcion: z.string().optional(),
  notas: z.string().max(1000, 'Las notas no pueden exceder 1000 caracteres').optional(),

  // Campos de auditoría
  creadoPor: z.string().optional(),
  fechaCreacion: z.string().optional(),
  modificadoPor: z.string().optional(),
  fechaModificacion: z.string().optional()
}).refine(
  (data) => data.saldoActual >= data.saldoMinimo || data.estado === 'cerrada',
  {
    message: 'El saldo actual no puede ser menor al saldo mínimo (excepto si la cuenta está cerrada)',
    path: ['saldoActual']
  }
).refine(
  (data) => {
    if (data.fechaCierre && data.estado !== 'cerrada') {
      return false;
    }
    return true;
  },
  {
    message: 'Si hay fecha de cierre, el estado debe ser "cerrada"',
    path: ['estado']
  }
);

/**
 * Schema para actualización de banco (campos opcionales)
 */
export const bancoUpdateSchema = bancoSchema.partial().extend({
  id: z.string().min(1, 'El ID es requerido para actualización')
});

// ============================================================================
// SCHEMAS DE TRANSACCIÓN
// ============================================================================

/**
 * Schema de transacción bancaria
 */
export const transaccionSchema = z.object({
  // Identificación
  id: z.string().optional(),
  numeroTransaccion: z.string().min(1, 'El número de transacción es requerido'),
  folio: z.string().optional(),

  // Banco y tipo
  banco: z.enum(BANCOS_SISTEMA, {
    errorMap: () => ({ message: 'Selecciona un banco válido' })
  }),
  tipo: z.enum(TIPOS_TRANSACCION, {
    errorMap: () => ({ message: 'Tipo de transacción inválido' })
  }),
  estado: z.enum(ESTADOS_TRANSACCION).default('pendiente'),

  // Montos
  monto: z.number()
    .positive('El monto debe ser mayor a cero')
    .max(100000000, 'El monto excede el límite máximo de $100,000,000'),
  moneda: z.enum(MONEDAS).default('MXN'),
  tipoCambio: z.number().positive().default(1),
  montoMXN: z.number().optional(),

  // Comisiones y cargos
  comision: z.number().nonnegative('La comisión no puede ser negativa').default(0),
  iva: z.number().nonnegative('El IVA no puede ser negativo').default(0),
  totalCargos: z.number().nonnegative().default(0),

  // Fechas
  fecha: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato de fecha inválido (YYYY-MM-DD)'),
  fechaValor: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato de fecha inválido').optional(),
  hora: z.string().regex(/^\d{2}:\d{2}$/, 'Formato de hora inválido (HH:MM)').optional(),

  // Relaciones
  ventaId: z.string().optional(),
  ordenCompraId: z.string().optional(),
  gastoId: z.string().optional(),
  transferenciaId: z.string().optional(),
  clienteId: z.string().optional(),
  distribuidorId: z.string().optional(),

  // Detalles
  concepto: z.string().min(1, 'El concepto es requerido').max(500),
  descripcion: z.string().max(1000).optional(),
  categoria: z.string().optional(),
  subcategoria: z.string().optional(),

  // Información adicional
  referencia: z.string().optional(),
  autorizacion: z.string().optional(),
  metodoPago: z.string().optional(),

  // Saldos
  saldoAnterior: z.number(),
  saldoNuevo: z.number(),

  // Recurrencia
  esRecurrente: z.boolean().default(false),
  frecuencia: z.enum(FRECUENCIAS).optional(),
  proximaEjecucion: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),

  // Auditoría
  realizadaPor: z.string().optional(),
  aprobadaPor: z.string().optional(),
  fechaAprobacion: z.string().optional(),

  // Conciliación
  conciliada: z.boolean().default(false),
  fechaConciliacion: z.string().optional(),
  estadoCuentaBancario: z.string().optional(),

  // Documentos
  comprobante: z.string().optional(),
  factura: z.string().optional(),
  evidencias: z.array(z.string()).optional(),

  // Notas
  notas: z.string().max(1000).optional(),

  // Timestamps
  createdAt: z.string().optional(),
  updatedAt: z.string().optional()
}).refine(
  (data) => {
    // Si es MXN, montoMXN debe ser igual a monto
    if (data.moneda === 'MXN') {
      return !data.montoMXN || Math.abs(data.monto - data.montoMXN) < 0.01;
    }
    // Si no es MXN, montoMXN debe ser monto * tipoCambio
    if (data.montoMXN) {
      const calculado = data.monto * data.tipoCambio;
      return Math.abs(data.montoMXN - calculado) < 0.01;
    }
    return true;
  },
  {
    message: 'El monto en MXN debe ser calculado correctamente según la moneda y tipo de cambio',
    path: ['montoMXN']
  }
).refine(
  (data) => {
    const totalCalculado = data.comision + data.iva;
    return Math.abs(data.totalCargos - totalCalculado) < 0.01;
  },
  {
    message: 'Total de cargos debe ser la suma de comisión + IVA',
    path: ['totalCargos']
  }
).refine(
  (data) => {
    if (data.esRecurrente) {
      return data.frecuencia && data.proximaEjecucion;
    }
    return true;
  },
  {
    message: 'Las transacciones recurrentes deben tener frecuencia y próxima ejecución',
    path: ['esRecurrente']
  }
).refine(
  (data) => {
    // Validar que el saldo nuevo sea correcto según el tipo de transacción
    if (data.tipo === 'ingreso' || data.tipo === 'transferencia_entrada' || data.tipo === 'deposito' || data.tipo === 'devolucion' || data.tipo === 'interes') {
      const esperado = data.saldoAnterior + data.monto;
      return Math.abs(data.saldoNuevo - esperado) < 0.01;
    }
    if (data.tipo === 'gasto' || data.tipo === 'transferencia_salida' || data.tipo === 'retiro' || data.tipo === 'comision' || data.tipo === 'cargo_bancario') {
      const esperado = data.saldoAnterior - data.monto - data.totalCargos;
      return Math.abs(data.saldoNuevo - esperado) < 0.01;
    }
    return true; // ajuste puede tener cualquier saldo
  },
  {
    message: 'El saldo nuevo no es correcto según el tipo de transacción',
    path: ['saldoNuevo']
  }
);

/**
 * Schema para actualización de transacción
 */
export const transaccionUpdateSchema = transaccionSchema.partial().extend({
  id: z.string().min(1, 'El ID es requerido para actualización')
});

/**
 * Schema para aprobar transacción
 */
export const transaccionAprobacionSchema = z.object({
  id: z.string().min(1, 'El ID de la transacción es requerido'),
  aprobadaPor: z.string().min(1, 'Se requiere el usuario que aprueba'),
  fechaAprobacion: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  notas: z.string().optional()
});

// ============================================================================
// SCHEMAS DE CORTE DE CAJA
// ============================================================================

/**
 * Schema de movimiento en corte de caja
 */
export const movimientoCorteSchema = z.object({
  tipo: z.enum(TIPOS_TRANSACCION),
  cantidad: z.number().int().nonnegative('La cantidad no puede ser negativa'),
  subtotal: z.number().nonnegative('El subtotal no puede ser negativo'),
  total: z.number().nonnegative('El total no puede ser negativo')
});

/**
 * Schema de corte de caja
 */
export const corteCajaSchema = z.object({
  // Identificación
  id: z.string().optional(),
  numeroCorte: z.string().min(1, 'El número de corte es requerido'),

  // Banco y período
  banco: z.enum(BANCOS_SISTEMA),
  fechaInicio: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  fechaFin: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  horaCorte: z.string().regex(/^\d{2}:\d{2}$/).optional(),

  // Saldos
  saldoInicial: z.number(),
  saldoFinal: z.number(),
  saldoEsperado: z.number(),
  diferencia: z.number().default(0),

  // Totales
  totalIngresos: z.number().nonnegative().default(0),
  totalGastos: z.number().nonnegative().default(0),
  totalTransferenciasEntrada: z.number().nonnegative().default(0),
  totalTransferenciasSalida: z.number().nonnegative().default(0),

  // Desglose de movimientos
  movimientos: z.array(movimientoCorteSchema).default([]),

  // Transacciones incluidas
  transaccionesIds: z.array(z.string()).default([]),
  cantidadTransacciones: z.number().int().nonnegative().default(0),

  // Estado y auditoría
  estado: z.enum(ESTADOS_CORTE).default('abierto'),
  realizadoPor: z.string().min(1, 'Se requiere el usuario que realiza el corte'),
  cerradoPor: z.string().optional(),
  fechaCierre: z.string().optional(),
  aprobadoPor: z.string().optional(),
  fechaAprobacion: z.string().optional(),

  // Conciliación
  conciliado: z.boolean().default(false),
  fechaConciliacion: z.string().optional(),
  conciliadoPor: z.string().optional(),

  // Observaciones
  observaciones: z.string().max(1000).optional(),
  notasDiferencia: z.string().max(500).optional(),
  ajustesRealizados: z.string().optional(),

  // Documentos
  comprobantes: z.array(z.string()).optional(),

  // Timestamps
  createdAt: z.string().optional(),
  updatedAt: z.string().optional()
}).refine(
  (data) => {
    const esperado = data.saldoInicial + data.totalIngresos + data.totalTransferenciasEntrada - data.totalGastos - data.totalTransferenciasSalida;
    return Math.abs(data.saldoEsperado - esperado) < 0.01;
  },
  {
    message: 'El saldo esperado no coincide con el cálculo: saldoInicial + ingresos + transf_entrada - gastos - transf_salida',
    path: ['saldoEsperado']
  }
).refine(
  (data) => {
    const dif = data.saldoFinal - data.saldoEsperado;
    return Math.abs(data.diferencia - dif) < 0.01;
  },
  {
    message: 'La diferencia debe ser saldoFinal - saldoEsperado',
    path: ['diferencia']
  }
).refine(
  (data) => new Date(data.fechaFin) >= new Date(data.fechaInicio),
  {
    message: 'La fecha fin no puede ser anterior a la fecha inicio',
    path: ['fechaFin']
  }
).refine(
  (data) => {
    if (data.estado === 'cerrado' || data.estado === 'auditado' || data.estado === 'conciliado') {
      return data.cerradoPor && data.fechaCierre;
    }
    return true;
  },
  {
    message: 'Los cortes cerrados, auditados o conciliados deben tener fecha y usuario de cierre',
    path: ['estado']
  }
);

/**
 * Schema para actualización de corte de caja
 */
export const corteCajaUpdateSchema = corteCajaSchema.partial().extend({
  id: z.string().min(1, 'El ID es requerido para actualización')
});

/**
 * Schema para cerrar corte de caja
 */
export const corteCajaCierreSchema = z.object({
  id: z.string().min(1, 'El ID del corte es requerido'),
  cerradoPor: z.string().min(1, 'Se requiere el usuario que cierra'),
  fechaCierre: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  saldoFinal: z.number(),
  observaciones: z.string().optional()
});

// ============================================================================
// SCHEMAS DE CONCILIACIÓN BANCARIA
// ============================================================================

/**
 * Schema de diferencia en conciliación
 */
export const diferenciaConciliacionSchema = z.object({
  transaccionId: z.string(),
  tipo: z.enum(['faltante_sistema', 'faltante_banco', 'diferencia_monto', 'diferencia_fecha']),
  montoSistema: z.number().optional(),
  montoBanco: z.number().optional(),
  diferencia: z.number(),
  resuelta: z.boolean().default(false),
  accion: z.enum(['ajuste_sistema', 'ajuste_banco', 'ignorar', 'investigar']).optional(),
  notas: z.string().optional()
});

/**
 * Schema de conciliación bancaria
 */
export const conciliacionSchema = z.object({
  // Identificación
  id: z.string().optional(),
  numeroConciliacion: z.string().min(1, 'El número de conciliación es requerido'),

  // Banco y período
  banco: z.enum(BANCOS_SISTEMA),
  mes: z.number().int().min(1).max(12),
  año: z.number().int().min(2020).max(2100),
  fechaInicio: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  fechaFin: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),

  // Saldos
  saldoInicialSistema: z.number(),
  saldoFinalSistema: z.number(),
  saldoInicialBanco: z.number(),
  saldoFinalBanco: z.number(),

  // Movimientos
  totalMovimientosSistema: z.number().int().nonnegative(),
  totalMovimientosBanco: z.number().int().nonnegative(),
  movimientosConciliados: z.number().int().nonnegative(),

  // Diferencias
  diferencias: z.array(diferenciaConciliacionSchema).default([]),
  totalDiferencias: z.number().default(0),
  diferenciasResueltas: z.number().int().nonnegative().default(0),
  diferenciasPendientes: z.number().int().nonnegative().default(0),

  // Estado
  conciliado: z.boolean().default(false),
  porcentajeConciliacion: z.number().min(0).max(100).default(0),

  // Auditoría
  realizadoPor: z.string().min(1),
  fechaConciliacion: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  revisadoPor: z.string().optional(),
  fechaRevision: z.string().optional(),
  aprobadoPor: z.string().optional(),
  fechaAprobacion: z.string().optional(),

  // Documentos
  estadoCuentaBanco: z.string().optional(),
  archivoEstadoCuenta: z.string().optional(),
  comprobantes: z.array(z.string()).optional(),

  // Observaciones
  observaciones: z.string().max(1000).optional(),
  ajustesRealizados: z.string().optional(),

  // Timestamps
  createdAt: z.string().optional(),
  updatedAt: z.string().optional()
}).refine(
  (data) => data.diferenciasPendientes === data.diferencias.filter(d => !d.resuelta).length,
  {
    message: 'El contador de diferencias pendientes no coincide con las diferencias no resueltas',
    path: ['diferenciasPendientes']
  }
).refine(
  (data) => data.diferenciasResueltas === data.diferencias.filter(d => d.resuelta).length,
  {
    message: 'El contador de diferencias resueltas no coincide con las diferencias resueltas',
    path: ['diferenciasResueltas']
  }
).refine(
  (data) => {
    if (data.totalMovimientosSistema > 0) {
      const calculado = (data.movimientosConciliados / data.totalMovimientosSistema) * 100;
      return Math.abs(data.porcentajeConciliacion - calculado) < 0.01;
    }
    return data.porcentajeConciliacion === 0;
  },
  {
    message: 'El porcentaje de conciliación debe ser (movimientosConciliados / totalMovimientosSistema) * 100',
    path: ['porcentajeConciliacion']
  }
);

// ============================================================================
// VALORES POR DEFECTO
// ============================================================================

export const bancoDefaultValues = {
  nombre: 'Bóveda Monte' as const,
  nombreCompleto: '',
  tipoCuenta: 'empresarial' as const,
  moneda: 'MXN' as const,
  estado: 'activa' as const,
  informacionBancaria: {
    numeroCuenta: '',
    clabe: '',
    sucursal: ''
  },
  saldoActual: 0,
  saldoInicial: 0,
  saldoMinimo: 0,
  totalIngresos: 0,
  totalGastos: 0,
  totalTransferenciasEntrada: 0,
  totalTransferenciasSalida: 0,
  fechaApertura: new Date().toISOString().split('T')[0],
  requiereAprobacion: false,
  alertaSaldoBajo: true,
  notificacionesActivas: true
};

export const transaccionDefaultValues = {
  banco: 'Bóveda Monte' as const,
  tipo: 'ingreso' as const,
  estado: 'pendiente' as const,
  monto: 0,
  moneda: 'MXN' as const,
  tipoCambio: 1,
  comision: 0,
  iva: 0,
  totalCargos: 0,
  fecha: new Date().toISOString().split('T')[0],
  concepto: '',
  saldoAnterior: 0,
  saldoNuevo: 0,
  esRecurrente: false,
  conciliada: false
};

export const corteCajaDefaultValues = {
  estado: 'abierto' as const,
  totalIngresos: 0,
  totalGastos: 0,
  totalTransferenciasEntrada: 0,
  totalTransferenciasSalida: 0,
  diferencia: 0,
  movimientos: [],
  transaccionesIds: [],
  cantidadTransacciones: 0,
  conciliado: false
};

// ============================================================================
// MENSAJES DE ERROR PERSONALIZADOS
// ============================================================================

export const bancoErrorMessages = {
  nombre: 'Selecciona un banco del sistema',
  nombreCompleto: 'El nombre completo es requerido',
  tipoCuenta: 'Selecciona un tipo de cuenta válido',
  saldoActual: 'El saldo actual es requerido',
  saldoMinimo: 'El saldo actual no puede ser menor al mínimo',
  fechaApertura: 'La fecha de apertura es requerida',
  informacionBancaria: 'La información bancaria es requerida'
};

export const transaccionErrorMessages = {
  banco: 'Selecciona un banco válido',
  tipo: 'Selecciona un tipo de transacción',
  monto: 'El monto debe ser mayor a cero',
  concepto: 'El concepto es requerido',
  fecha: 'La fecha es requerida',
  saldos: 'Los saldos no cuadran con el tipo de transacción'
};

// ============================================================================
// LABELS PARA UI
// ============================================================================

export const tiposCuentaLabels: Record<typeof TIPOS_CUENTA[number], string> = {
  ahorros: 'Cuenta de Ahorros',
  corriente: 'Cuenta Corriente',
  inversion: 'Cuenta de Inversión',
  nomina: 'Cuenta de Nómina',
  empresarial: 'Cuenta Empresarial',
  otro: 'Otro Tipo'
};

export const tiposTransaccionLabels: Record<typeof TIPOS_TRANSACCION[number], string> = {
  ingreso: 'Ingreso',
  gasto: 'Gasto',
  transferencia_entrada: 'Transferencia Entrada',
  transferencia_salida: 'Transferencia Salida',
  ajuste: 'Ajuste',
  interes: 'Interés',
  comision: 'Comisión',
  cargo_bancario: 'Cargo Bancario',
  devolucion: 'Devolución',
  deposito: 'Depósito',
  retiro: 'Retiro'
};

export const estadosTransaccionLabels: Record<typeof ESTADOS_TRANSACCION[number], string> = {
  pendiente: 'Pendiente',
  procesando: 'Procesando',
  completada: 'Completada',
  fallida: 'Fallida',
  cancelada: 'Cancelada',
  revertida: 'Revertida'
};

export const estadosCorteLabels: Record<typeof ESTADOS_CORTE[number], string> = {
  abierto: 'Abierto',
  cerrado: 'Cerrado',
  auditado: 'Auditado',
  conciliado: 'Conciliado'
};

// ============================================================================
// TIPOS TYPESCRIPT
// ============================================================================

export type BancoFormData = z.infer<typeof bancoSchema>;
export type BancoUpdateData = z.infer<typeof bancoUpdateSchema>;
export type InfoBancariaData = z.infer<typeof infoBancariaSchema>;

export type TransaccionFormData = z.infer<typeof transaccionSchema>;
export type TransaccionUpdateData = z.infer<typeof transaccionUpdateSchema>;
export type TransaccionAprobacionData = z.infer<typeof transaccionAprobacionSchema>;

export type CorteCajaFormData = z.infer<typeof corteCajaSchema>;
export type CorteCajaUpdateData = z.infer<typeof corteCajaUpdateSchema>;
export type CorteCajaCierreData = z.infer<typeof corteCajaCierreSchema>;
export type MovimientoCorteData = z.infer<typeof movimientoCorteSchema>;

export type ConciliacionFormData = z.infer<typeof conciliacionSchema>;
export type DiferenciaConciliacionData = z.infer<typeof diferenciaConciliacionSchema>;

export type BancoSistema = typeof BANCOS_SISTEMA[number];
export type TipoCuenta = typeof TIPOS_CUENTA[number];
export type Moneda = typeof MONEDAS[number];
export type EstadoCuenta = typeof ESTADOS_CUENTA[number];
export type TipoTransaccion = typeof TIPOS_TRANSACCION[number];
export type EstadoTransaccion = typeof ESTADOS_TRANSACCION[number];
export type Frecuencia = typeof FRECUENCIAS[number];
export type EstadoCorte = typeof ESTADOS_CORTE[number];
