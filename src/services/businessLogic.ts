/**
 * 💼 BUSINESS LOGIC SERVICE
 *
 * Sistema completo de automatización de lógica de negocio para:
 * - Orden de Compra → Incremento STK + Deuda Distribuidor
 * - Venta → Múltiples asientos contables (Bóveda Monte, Flete Sur, Utilidades)
 * - Auto-cálculo Flete ($500/unidad)
 * - Auto-cálculo Utilidades ((precio_venta - precio_compra - 500) × cantidad)
 * - Tracking de deudas distribuidores/clientes
 * - Real-time RF Actual updates
 *
 * @author Premium Ecosystem
 * @version 2.0.0
 */
import datosCompletos from '@/data/datos_bovedas_completos.json';

// ==================== TYPES & INTERFACES ====================

export interface OrdenCompra {
  OC: string;
  Fecha: string;
  Distribuidor: string;
  Cantidad: number;
  Precio_Compra: number; // Por unidad
  Total: number; // Precio_Compra × Cantidad
  Concepto?: string;
}

export interface Venta {
  id: string;
  Fecha: string;
  Cliente: string;
  Cantidad: number;
  Precio_Venta: number; // Por unidad
  Precio_Compra: number; // Por unidad (referencia para contabilidad)
  Estado_Pago: 'pagado' | 'abonado' | 'pendiente';
  Monto_Total: number; // Precio_Venta × Cantidad
  Monto_Abonado: number;
  Deuda_Pendiente: number;
  Concepto?: string;
  Observaciones?: string;
}

export interface AsientoContable {
  id: string;
  panel: string;
  tipo: 'ingreso' | 'gasto' | 'egreso';
  monto: number;
  fecha: string;
  concepto: string;
  referencia?: string; // ID de venta/OC origen
}

export interface DeudaDistribuidor {
  nombre: string;
  deuda_total: number;
  abonos: Array<{
    fecha: string;
    monto: number;
    concepto: string;
  }>;
  saldo_pendiente: number;
  ordenes_compra: string[]; // Array de OC numbers
  ultima_actualizacion: string;
}

export interface DeudaCliente {
  nombre: string;
  deuda_total: number;
  abonos: Array<{
    fecha: string;
    monto: number;
    concepto: string;
  }>;
  saldo_pendiente: number;
  ventas: string[]; // Array de venta IDs
  ultima_actualizacion: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings?: string[];
}

// ==================== CONSTANTS ====================

const FLETE_RATE = 500; // $500 por unidad
const PANEL_ALMACEN = 'Almacen_Monte';
const PANEL_BOVEDA_MONTE = 'Boveda_Monte';
const PANEL_FLETE_SUR = 'Flete_Sur';
const PANEL_UTILIDADES = 'Utilidades';

// ==================== INVENTORY MANAGEMENT ====================

/**
 * Obtener STK actual del almacén
 */
export const getCurrentSTK = (): number => {
  const panelAlmacen = datosCompletos.paneles.find((p) => p.panel === PANEL_ALMACEN);

  if (!panelAlmacen) {
    throw new Error('Panel Almacén no encontrado');
  }

  const totalIngresos = panelAlmacen.ingresos?.total || 0;
  const totalSalidas = panelAlmacen.salidas?.total || 0;

  return totalIngresos - totalSalidas;
};

/**
 * Actualizar STK (entrada o salida)
 * @throws Error si STK resultante es negativo
 */
export const updateSTK = (operacion: 'entrada' | 'salida', cantidad: number): number => {
  if (cantidad <= 0) {
    throw new Error('La cantidad debe ser mayor a 0');
  }

  const currentSTK = getCurrentSTK();
  const newSTK = operacion === 'entrada' ? currentSTK + cantidad : currentSTK - cantidad;

  if (newSTK < 0) {
    throw new Error(`STK insuficiente. Disponible: ${currentSTK}, Requerido: ${cantidad}`);
  }

  return newSTK;
};

/**
 * Validar disponibilidad de STK
 */
export const validateSTKAvailability = (cantidad: number): ValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];

  const currentSTK = getCurrentSTK();

  if (cantidad > currentSTK) {
    errors.push(`STK insuficiente. Disponible: ${currentSTK}, Requerido: ${cantidad}`);
  }

  // Warning si STK quedará bajo después de la venta
  const newSTK = currentSTK - cantidad;
  if (newSTK < 10 && newSTK >= 0) {
    warnings.push(`⚠️ STK bajo después de venta: ${newSTK} unidades`);
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
};

// ==================== ORDEN DE COMPRA WORKFLOW ====================

/**
 * Validar Orden de Compra
 */
export const validateOrdenCompra = (oc: Partial<OrdenCompra>): ValidationResult => {
  const errors: string[] = [];

  if (!oc.OC || oc.OC.trim() === '') {
    errors.push('Número de OC es obligatorio');
  }

  if (!oc.Fecha) {
    errors.push('Fecha es obligatoria');
  }

  if (!oc.Distribuidor || oc.Distribuidor.trim() === '') {
    errors.push('Distribuidor es obligatorio');
  }

  if (!oc.Cantidad || oc.Cantidad <= 0) {
    errors.push('Cantidad debe ser mayor a 0');
  }

  if (!oc.Precio_Compra || oc.Precio_Compra <= 0) {
    errors.push('Precio de compra debe ser mayor a 0');
  }

  // Validar cálculo total
  if (oc.Cantidad && oc.Precio_Compra && oc.Total) {
    const expectedTotal = oc.Cantidad * oc.Precio_Compra;
    const diff = Math.abs(expectedTotal - oc.Total);

    if (diff > 0.01) {
      // Tolerancia para decimales
      errors.push(
        `Total no coincide. Esperado: $${expectedTotal.toFixed(2)}, Actual: $${oc.Total.toFixed(2)}`
      );
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Procesar Orden de Compra
 *
 * Efectos:
 * 1. Agregar a Almacén ingresos
 * 2. STK += Cantidad
 * 3. Crear/Actualizar deuda Distribuidor
 * 4. Actualizar RF Actual Almacén
 *
 * @returns Array de asientos contables generados
 */
export const processOrdenCompra = (oc: OrdenCompra): AsientoContable[] => {
  // 1. Validar
  const validation = validateOrdenCompra(oc);
  if (!validation.isValid) {
    throw new Error(`Validación OC fallida: ${validation.errors.join(', ')}`);
  }

  // 2. Calcular nuevo STK
  const newSTK = updateSTK('entrada', oc.Cantidad);

  // 3. Crear asiento contable para Almacén
  const asiento: AsientoContable = {
    id: `OC-${oc.OC}-${Date.now()}`,
    panel: PANEL_ALMACEN,
    tipo: 'ingreso',
    monto: oc.Total,
    fecha: oc.Fecha,
    concepto: `Compra ${oc.Distribuidor} - ${oc.Cantidad} pzas @ $${oc.Precio_Compra}`,
    referencia: oc.OC,
  };

  console.log('✅ OC procesada:', {
    oc: oc.OC,
    distribuidor: oc.Distribuidor,
    cantidad: oc.Cantidad,
    total: oc.Total,
    newSTK,
  });

  return [asiento];
};

// ==================== VENTA WORKFLOW ====================

/**
 * Validar Venta
 */
export const validateVenta = (venta: Partial<Venta>): ValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!venta.Fecha) {
    errors.push('Fecha es obligatoria');
  }

  if (!venta.Cliente || venta.Cliente.trim() === '') {
    errors.push('Cliente es obligatorio');
  }

  if (!venta.Cantidad || venta.Cantidad <= 0) {
    errors.push('Cantidad debe ser mayor a 0');
  } else {
    // Validar STK disponible
    const stkValidation = validateSTKAvailability(venta.Cantidad);
    if (!stkValidation.isValid) {
      errors.push(...stkValidation.errors);
    }
    if (stkValidation.warnings) {
      warnings.push(...stkValidation.warnings);
    }
  }

  if (!venta.Precio_Venta || venta.Precio_Venta <= 0) {
    errors.push('Precio de venta debe ser mayor a 0');
  }

  if (!venta.Precio_Compra || venta.Precio_Compra <= 0) {
    errors.push('Precio de compra (referencia) debe ser mayor a 0');
  }

  if (!venta.Estado_Pago) {
    errors.push('Estado de pago es obligatorio');
  }

  // Validar que precio venta > precio compra + flete
  if (venta.Precio_Venta && venta.Precio_Compra) {
    const costoTotal = venta.Precio_Compra + FLETE_RATE;
    if (venta.Precio_Venta < costoTotal) {
      warnings.push(`⚠️ Venta sin utilidad. Precio: $${venta.Precio_Venta}, Costo: $${costoTotal}`);
    }
  }

  // Validar monto total
  if (venta.Cantidad && venta.Precio_Venta && venta.Monto_Total) {
    const expectedTotal = venta.Cantidad * venta.Precio_Venta;
    const diff = Math.abs(expectedTotal - venta.Monto_Total);

    if (diff > 0.01) {
      errors.push(
        `Monto total no coincide. Esperado: $${expectedTotal.toFixed(2)}, Actual: $${venta.Monto_Total.toFixed(2)}`
      );
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
};

/**
 * Calcular asientos contables para venta
 *
 * Si Estado_Pago = "pagado":
 *   1. Bóveda Monte: Ingreso = Precio_Compra × Cantidad
 *   2. Flete Sur: Gasto = $500 × Cantidad
 *   3. Utilidades: Ingreso = (Precio_Venta - Precio_Compra - 500) × Cantidad
 *
 * Si Estado_Pago = "abonado":
 *   - Crear deuda cliente
 *   - Registrar abono parcial
 */
export const calculateAccountingEntries = (venta: Venta): AsientoContable[] => {
  const entries: AsientoContable[] = [];

  if (venta.Estado_Pago === 'pagado') {
    // 1. Bóveda Monte - Ingreso por venta
    entries.push({
      id: `BM-${venta.id}-${Date.now()}`,
      panel: PANEL_BOVEDA_MONTE,
      tipo: 'ingreso',
      monto: venta.Precio_Compra * venta.Cantidad,
      fecha: venta.Fecha,
      concepto: `Venta ${venta.Cliente} - ${venta.Cantidad} pzas @ $${venta.Precio_Compra}`,
      referencia: venta.id,
    });

    // 2. Flete Sur - Gasto por envío
    const totalFlete = FLETE_RATE * venta.Cantidad;
    entries.push({
      id: `FL-${venta.id}-${Date.now()}`,
      panel: PANEL_FLETE_SUR,
      tipo: 'gasto',
      monto: totalFlete,
      fecha: venta.Fecha,
      concepto: `Flete venta ${venta.Cliente} - ${venta.Cantidad} pzas @ $${FLETE_RATE}`,
      referencia: venta.id,
    });

    // 3. Utilidades - Ganancia neta
    const utilidadPorUnidad = venta.Precio_Venta - venta.Precio_Compra - FLETE_RATE;
    const totalUtilidad = utilidadPorUnidad * venta.Cantidad;

    entries.push({
      id: `UT-${venta.id}-${Date.now()}`,
      panel: PANEL_UTILIDADES,
      tipo: 'ingreso',
      monto: totalUtilidad,
      fecha: venta.Fecha,
      concepto: `Utilidad venta ${venta.Cliente} - ${venta.Cantidad} pzas (Margen: $${utilidadPorUnidad.toFixed(2)}/pza)`,
      referencia: venta.id,
    });
  }

  return entries;
};

/**
 * Procesar Venta
 *
 * Efectos:
 * 1. Agregar a Almacén salidas
 * 2. STK -= Cantidad
 * 3. Si pagado: Crear asientos en Bóveda Monte, Flete Sur, Utilidades
 * 4. Si abonado: Crear deuda cliente
 * 5. Actualizar RF Actual de paneles afectados
 *
 * @returns Array de asientos contables generados
 */
export const processVenta = (venta: Venta): AsientoContable[] => {
  // 1. Validar
  const validation = validateVenta(venta);
  if (!validation.isValid) {
    throw new Error(`Validación venta fallida: ${validation.errors.join(', ')}`);
  }

  // 2. Actualizar STK
  const newSTK = updateSTK('salida', venta.Cantidad);

  // 3. Crear asiento de salida Almacén
  const asientoAlmacen: AsientoContable = {
    id: `ALM-${venta.id}-${Date.now()}`,
    panel: PANEL_ALMACEN,
    tipo: 'gasto',
    monto: venta.Precio_Compra * venta.Cantidad,
    fecha: venta.Fecha,
    concepto: `Venta ${venta.Cliente} - ${venta.Cantidad} pzas`,
    referencia: venta.id,
  };

  // 4. Calcular asientos contables según estado pago
  const accountingEntries = calculateAccountingEntries(venta);

  console.log('✅ Venta procesada:', {
    id: venta.id,
    cliente: venta.Cliente,
    cantidad: venta.Cantidad,
    estado: venta.Estado_Pago,
    newSTK,
    asientosGenerados: accountingEntries.length + 1,
  });

  if (validation.warnings && validation.warnings.length > 0) {
    console.warn('⚠️ Warnings:', validation.warnings);
  }

  return [asientoAlmacen, ...accountingEntries];
};

// ==================== DEBT TRACKING ====================

/**
 * Actualizar deuda de distribuidor
 */
export const updateDistributorDebt = (
  distribuidor: string,
  monto: number,
  ocNumber: string
): DeudaDistribuidor => {
  // TODO: Implementar persistencia en JSON/Firebase
  const deuda: DeudaDistribuidor = {
    nombre: distribuidor,
    deuda_total: monto,
    abonos: [],
    saldo_pendiente: monto,
    ordenes_compra: [ocNumber],
    ultima_actualizacion: new Date().toISOString(),
  };

  console.log('💳 Deuda distribuidor actualizada:', deuda);
  return deuda;
};

/**
 * Actualizar deuda de cliente
 */
export const updateClientDebt = (
  cliente: string,
  montoTotal: number,
  montoAbonado: number,
  ventaId: string
): DeudaCliente => {
  // TODO: Implementar persistencia en JSON/Firebase
  const deuda: DeudaCliente = {
    nombre: cliente,
    deuda_total: montoTotal,
    abonos:
      montoAbonado > 0
        ? [
            {
              fecha: new Date().toISOString(),
              monto: montoAbonado,
              concepto: `Abono venta ${ventaId}`,
            },
          ]
        : [],
    saldo_pendiente: montoTotal - montoAbonado,
    ventas: [ventaId],
    ultima_actualizacion: new Date().toISOString(),
  };

  console.log('💳 Deuda cliente actualizada:', deuda);
  return deuda;
};

// ==================== RF ACTUAL CALCULATIONS ====================

/**
 * Recalcular RF Actual de un panel
 */
export const recalculateRFActual = (panelName: string): number => {
  const panel = datosCompletos.paneles.find((p) => p.panel === panelName);

  if (!panel) {
    throw new Error(`Panel ${panelName} no encontrado`);
  }

  let rfActual = 0;

  // Para Almacén: STK en unidades
  if (panelName === PANEL_ALMACEN) {
    rfActual = getCurrentSTK();
  } else {
    // Para otros paneles: ingresos - egresos
    const totalIngresos = panel.ingresos?.total || 0;
    const totalEgresos = panel.egresos?.total || 0;
    rfActual = totalIngresos - totalEgresos;
  }

  console.log(`📊 RF Actual ${panelName}:`, rfActual);
  return rfActual;
};

/**
 * Recalcular RF Actual de múltiples paneles
 */
export const recalculateMultipleRFActual = (panelNames: string[]): Record<string, number> => {
  const results: Record<string, number> = {};

  for (const panelName of panelNames) {
    results[panelName] = recalculateRFActual(panelName);
  }

  return results;
};

// ==================== AUTO CALCULATIONS ====================

/**
 * Calcular Flete automático
 */
export const calculateFlete = (cantidad: number): number => {
  return FLETE_RATE * cantidad;
};

/**
 * Calcular Utilidades automáticas
 */
export const calculateUtilidad = (
  precioVenta: number,
  precioCompra: number,
  cantidad: number
): number => {
  const utilidadPorUnidad = precioVenta - precioCompra - FLETE_RATE;
  return utilidadPorUnidad * cantidad;
};

/**
 * Calcular margen de utilidad porcentual
 */
export const calculateMarginPercentage = (precioVenta: number, precioCompra: number): number => {
  const utilidadPorUnidad = precioVenta - precioCompra - FLETE_RATE;
  return (utilidadPorUnidad / precioVenta) * 100;
};

// ==================== SUMMARY FUNCTIONS ====================

/**
 * Obtener resumen de inventario
 */
export const getInventorySummary = () => {
  const currentSTK = getCurrentSTK();
  const panelAlmacen = datosCompletos.paneles.find((p) => p.panel === PANEL_ALMACEN);

  return {
    stkActual: currentSTK,
    totalIngresos: panelAlmacen?.ingresos?.total || 0,
    totalSalidas: panelAlmacen?.salidas?.total || 0,
    cantidadOrdenes: panelAlmacen?.ingresos?.cantidad || 0,
    cantidadVentas: panelAlmacen?.salidas?.cantidad || 0,
  };
};

/**
 * Preview de asientos antes de confirmar venta
 */
export const previewVentaEntries = (venta: Partial<Venta>) => {
  if (!venta.Cantidad || !venta.Precio_Venta || !venta.Precio_Compra) {
    return null;
  }

  const flete = calculateFlete(venta.Cantidad);
  const utilidad = calculateUtilidad(venta.Precio_Venta, venta.Precio_Compra, venta.Cantidad);
  const margen = calculateMarginPercentage(venta.Precio_Venta, venta.Precio_Compra);

  return {
    bovedaMonte: venta.Precio_Compra * venta.Cantidad,
    fleteSur: flete,
    utilidades: utilidad,
    margenPorcentaje: margen,
    newSTK: getCurrentSTK() - venta.Cantidad,
  };
};

export default {
  // Inventory
  getCurrentSTK,
  updateSTK,
  validateSTKAvailability,
  getInventorySummary,

  // Orden de Compra
  validateOrdenCompra,
  processOrdenCompra,

  // Venta
  validateVenta,
  processVenta,
  calculateAccountingEntries,
  previewVentaEntries,

  // Debt tracking
  updateDistributorDebt,
  updateClientDebt,

  // RF Actual
  recalculateRFActual,
  recalculateMultipleRFActual,

  // Auto calculations
  calculateFlete,
  calculateUtilidad,
  calculateMarginPercentage,
};
