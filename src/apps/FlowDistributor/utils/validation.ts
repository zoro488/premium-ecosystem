/**
 * ✅ VALIDATION - FlowDistributor Supreme 2025
 * Funciones de validación para forms y datos
 */

import type {
  BankCode,
  Transfer,
  TransferFormData,
  Sale,
  SaleFormData,
  PurchaseOrder,
  Client,
  CutFormData,
} from '../types';
import { VALIDATION, ERROR_MESSAGES, BANK_CODES } from '../constants';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings?: string[];
}

export interface FieldValidationResult {
  isValid: boolean;
  error?: string;
}

// ==================== VALIDACIÓN DE CAMPOS BÁSICOS ====================

/**
 * Valida un monto (debe ser positivo y dentro de rangos)
 */
export const validateAmount = (amount: number, fieldName: string = 'Monto'): FieldValidationResult => {
  if (typeof amount !== 'number' || isNaN(amount) || !isFinite(amount)) {
    return {
      isValid: false,
      error: `${fieldName} inválido`,
    };
  }

  if (amount < VALIDATION.MIN_AMOUNT) {
    return {
      isValid: false,
      error: `${fieldName} debe ser mayor a ${VALIDATION.MIN_AMOUNT}`,
    };
  }

  if (amount > VALIDATION.MAX_AMOUNT) {
    return {
      isValid: false,
      error: `${fieldName} excede el máximo permitido`,
    };
  }

  return { isValid: true };
};

/**
 * Valida una cantidad
 */
export const validateQuantity = (quantity: number): FieldValidationResult => {
  if (typeof quantity !== 'number' || isNaN(quantity) || !isFinite(quantity)) {
    return {
      isValid: false,
      error: 'Cantidad inválida',
    };
  }

  if (quantity < VALIDATION.MIN_QUANTITY) {
    return {
      isValid: false,
      error: `Cantidad debe ser al menos ${VALIDATION.MIN_QUANTITY}`,
    };
  }

  if (quantity > VALIDATION.MAX_QUANTITY) {
    return {
      isValid: false,
      error: 'Cantidad excede el máximo permitido',
    };
  }

  // Debe ser entero para cantidades
  if (!Number.isInteger(quantity)) {
    return {
      isValid: false,
      error: 'Cantidad debe ser un número entero',
    };
  }

  return { isValid: true };
};

/**
 * Valida un texto requerido
 */
export const validateRequiredText = (
  text: string | undefined | null,
  fieldName: string,
  maxLength?: number
): FieldValidationResult => {
  if (!text || text.trim() === '') {
    return {
      isValid: false,
      error: `${fieldName} es obligatorio`,
    };
  }

  if (maxLength && text.length > maxLength) {
    return {
      isValid: false,
      error: `${fieldName} no puede exceder ${maxLength} caracteres`,
    };
  }

  return { isValid: true };
};

/**
 * Valida un código de bóveda
 */
export const validateBankCode = (code: string): FieldValidationResult => {
  if (!BANK_CODES.includes(code as BankCode)) {
    return {
      isValid: false,
      error: ERROR_MESSAGES.INVALID_BANK,
    };
  }

  return { isValid: true };
};

/**
 * Valida una fecha
 */
export const validateDate = (date: string | Date): FieldValidationResult => {
  const d = typeof date === 'string' ? new Date(date) : date;

  if (isNaN(d.getTime())) {
    return {
      isValid: false,
      error: 'Fecha inválida',
    };
  }

  // No permitir fechas futuras (opcional)
  const now = new Date();
  if (d > now) {
    return {
      isValid: false,
      error: 'No se permiten fechas futuras',
    };
  }

  return { isValid: true };
};

// ==================== VALIDACIÓN DE TRANSFERENCIAS ====================

/**
 * Valida datos de transferencia
 */
export const validateTransfer = (
  transferData: TransferFormData,
  bankBalances: Record<BankCode, number>
): ValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];

  // 1. Validar origen
  const originValidation = validateBankCode(transferData.fromBank);
  if (!originValidation.isValid) {
    errors.push(`Origen: ${originValidation.error}`);
  }

  // 2. Validar destino
  const destValidation = validateBankCode(transferData.toBank);
  if (!destValidation.isValid) {
    errors.push(`Destino: ${destValidation.error}`);
  }

  // 3. Origen y destino diferentes
  if (transferData.fromBank === transferData.toBank) {
    errors.push(ERROR_MESSAGES.SAME_BANK_TRANSFER);
  }

  // 4. Validar monto
  const amountValidation = validateAmount(transferData.amountUSD, 'Monto');
  if (!amountValidation.isValid) {
    errors.push(amountValidation.error!);
  }

  // 5. Validar saldo suficiente
  const originBalance = bankBalances[transferData.fromBank] || 0;
  if (transferData.amountUSD > originBalance) {
    errors.push(`${ERROR_MESSAGES.INSUFFICIENT_BALANCE}. Disponible: $${originBalance.toFixed(2)} USD`);
  }

  // 6. Warning si es más del 80% del saldo
  if (transferData.amountUSD > originBalance * 0.8) {
    warnings.push('Esta transferencia usará más del 80% del saldo disponible');
  }

  // 7. Validar concepto
  const conceptValidation = validateRequiredText(
    transferData.concept,
    'Concepto',
    VALIDATION.MAX_CONCEPT_LENGTH
  );
  if (!conceptValidation.isValid) {
    errors.push(conceptValidation.error!);
  }

  // 8. Si es a/desde Profit, validar tipo de conversión
  if (transferData.toBank === 'PR' || transferData.fromBank === 'PR') {
    if (!transferData.conversionType) {
      errors.push('Para transferencias con Profit debes especificar el tipo de conversión');
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings: warnings.length > 0 ? warnings : undefined,
  };
};

// ==================== VALIDACIÓN DE VENTAS ====================

/**
 * Valida datos de venta
 */
export const validateSale = (saleData: Partial<Sale>): ValidationResult => {
  const errors: string[] = [];

  // 1. Cliente
  if (!saleData.clientId || !saleData.clientName) {
    errors.push('Cliente es obligatorio');
  }

  // 2. Cantidad
  if (saleData.quantity) {
    const qtyValidation = validateQuantity(saleData.quantity);
    if (!qtyValidation.isValid) {
      errors.push(qtyValidation.error!);
    }
  } else {
    errors.push('Cantidad es obligatoria');
  }

  // 3. Precio por unidad
  if (saleData.pricePerUnitUSD) {
    const priceValidation = validateAmount(saleData.pricePerUnitUSD, 'Precio por unidad');
    if (!priceValidation.isValid) {
      errors.push(priceValidation.error!);
    }
  } else {
    errors.push('Precio por unidad es obligatorio');
  }

  // 4. Total debe coincidir con qty * price
  if (saleData.quantity && saleData.pricePerUnitUSD && saleData.totalAmountUSD) {
    const expectedTotal = saleData.quantity * saleData.pricePerUnitUSD;
    const diff = Math.abs(expectedTotal - saleData.totalAmountUSD);

    if (diff > 0.01) { // Tolerance for floating point
      errors.push(`Total no coincide con cantidad × precio (esperado: $${expectedTotal.toFixed(2)})`);
    }
  }

  // 5. Validar margen si hay costo
  if (saleData.costPerUnitUSD && saleData.pricePerUnitUSD) {
    if (saleData.costPerUnitUSD > saleData.pricePerUnitUSD) {
      errors.push('El costo no puede ser mayor al precio de venta');
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// ==================== VALIDACIÓN DE ÓRDENES DE COMPRA ====================

/**
 * Valida orden de compra
 */
export const validatePurchaseOrder = (orderData: Partial<PurchaseOrder>): ValidationResult => {
  const errors: string[] = [];

  // 1. Proveedor
  if (!orderData.supplier) {
    errors.push('Proveedor es obligatorio');
  }

  // 2. Cantidad
  if (orderData.quantity) {
    const qtyValidation = validateQuantity(orderData.quantity);
    if (!qtyValidation.isValid) {
      errors.push(qtyValidation.error!);
    }
  } else {
    errors.push('Cantidad es obligatoria');
  }

  // 3. Costo proveedor
  if (orderData.supplierCostUSD) {
    const costValidation = validateAmount(orderData.supplierCostUSD, 'Costo proveedor');
    if (!costValidation.isValid) {
      errors.push(costValidation.error!);
    }
  } else {
    errors.push('Costo de proveedor es obligatorio');
  }

  // 4. Costo transporte
  if (orderData.transportCostUSD !== undefined) {
    const transportValidation = validateAmount(orderData.transportCostUSD, 'Costo transporte');
    if (!transportValidation.isValid && orderData.transportCostUSD !== 0) {
      errors.push(transportValidation.error!);
    }
  }

  // 5. Validar cálculos
  if (orderData.supplierCostUSD && orderData.transportCostUSD !== undefined && orderData.quantity) {
    const expectedTotal = orderData.supplierCostUSD + orderData.transportCostUSD;
    const expectedCostPerUnit = expectedTotal / orderData.quantity;

    if (orderData.totalCostUSD) {
      const diff = Math.abs(expectedTotal - orderData.totalCostUSD);
      if (diff > 0.01) {
        errors.push('Total no coincide con costos');
      }
    }

    if (orderData.costPerUnitUSD) {
      const diff = Math.abs(expectedCostPerUnit - orderData.costPerUnitUSD);
      if (diff > 0.01) {
        errors.push('Costo por unidad no coincide con cálculo');
      }
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// ==================== VALIDACIÓN DE CLIENTES ====================

/**
 * Valida cliente
 */
export const validateClient = (clientData: Partial<Client>): ValidationResult => {
  const errors: string[] = [];

  // 1. Nombre
  const nameValidation = validateRequiredText(clientData.name, 'Nombre');
  if (!nameValidation.isValid) {
    errors.push(nameValidation.error!);
  }

  // 2. Email (si está presente)
  if (clientData.email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(clientData.email)) {
      errors.push('Email inválido');
    }
  }

  // 3. Phone (si está presente)
  if (clientData.phone) {
    const phoneRegex = /^\+?[\d\s\-\(\)]+$/;
    if (!phoneRegex.test(clientData.phone)) {
      errors.push('Teléfono inválido');
    }
  }

  // 4. Límite de crédito
  if (clientData.creditLimit) {
    const creditValidation = validateAmount(clientData.creditLimit, 'Límite de crédito');
    if (!creditValidation.isValid) {
      errors.push(creditValidation.error!);
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// ==================== VALIDACIÓN DE CORTES ====================

/**
 * Valida datos de corte
 */
export const validateCut = (cutData: CutFormData): ValidationResult => {
  const errors: string[] = [];

  // 1. Tipo de entidad
  if (!['BANK', 'WAREHOUSE'].includes(cutData.entityType)) {
    errors.push('Tipo de entidad inválido');
  }

  // 2. Código de entidad
  if (cutData.entityType === 'BANK') {
    const codeValidation = validateBankCode(cutData.entityCode);
    if (!codeValidation.isValid) {
      errors.push(codeValidation.error!);
    }
  }

  // 3. Concepto (opcional pero si está, validar longitud)
  if (cutData.concept) {
    const conceptValidation = validateRequiredText(
      cutData.concept,
      'Concepto',
      VALIDATION.MAX_CONCEPT_LENGTH
    );
    if (!conceptValidation.isValid) {
      errors.push(conceptValidation.error!);
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// ==================== HELPERS ====================

/**
 * Combina múltiples validaciones
 */
export const combineValidations = (...validations: ValidationResult[]): ValidationResult => {
  const allErrors: string[] = [];
  const allWarnings: string[] = [];

  validations.forEach(v => {
    allErrors.push(...v.errors);
    if (v.warnings) {
      allWarnings.push(...v.warnings);
    }
  });

  return {
    isValid: allErrors.length === 0,
    errors: allErrors,
    warnings: allWarnings.length > 0 ? allWarnings : undefined,
  };
};

/**
 * Limpia y sanitiza un string
 */
export const sanitizeString = (str: string): string => {
  return str.trim().replace(/\s+/g, ' ');
};

/**
 * Valida rangos de fechas
 */
export const validateDateRange = (from: string, to: string): ValidationResult => {
  const errors: string[] = [];

  const fromDate = new Date(from);
  const toDate = new Date(to);

  if (isNaN(fromDate.getTime())) {
    errors.push('Fecha inicial inválida');
  }

  if (isNaN(toDate.getTime())) {
    errors.push('Fecha final inválida');
  }

  if (fromDate > toDate) {
    errors.push('Fecha inicial debe ser anterior a fecha final');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export default {
  validateAmount,
  validateQuantity,
  validateRequiredText,
  validateBankCode,
  validateDate,
  validateTransfer,
  validateSale,
  validatePurchaseOrder,
  validateClient,
  validateCut,
  combineValidations,
  sanitizeString,
  validateDateRange,
};
