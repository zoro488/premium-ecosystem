/**
 * Utilidades de validación para FlowDistributor
 * Valida datos de formularios y entradas del usuario
 */

/**
 * Valida datos de una orden de compra
 * @param {Object} formData - Datos del formulario
 * @returns {Object} - { isValid: boolean, errors: array }
 */
export const validateOrdenCompra = (formData) => {
  const errors = [];

  if (!formData.distribuidor || formData.distribuidor.trim() === '') {
    errors.push('El distribuidor es requerido');
  }

  if (!formData.productos || formData.productos.length === 0) {
    errors.push('Debe agregar al menos un producto');
  }

  if (formData.productos && formData.productos.length > 0) {
    formData.productos.forEach((producto, index) => {
      if (!producto.nombre || producto.nombre.trim() === '') {
        errors.push(`Producto ${index + 1}: El nombre es requerido`);
      }
      if (!producto.cantidad || producto.cantidad <= 0) {
        errors.push(`Producto ${index + 1}: La cantidad debe ser mayor a 0`);
      }
      if (!producto.precioUnitario || producto.precioUnitario <= 0) {
        errors.push(`Producto ${index + 1}: El precio unitario debe ser mayor a 0`);
      }
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Valida datos de una venta
 * @param {Object} formData - Datos del formulario
 * @returns {Object} - { isValid: boolean, errors: array }
 */
export const validateVenta = (formData) => {
  const errors = [];

  if (!formData.cliente || formData.cliente.trim() === '') {
    errors.push('El cliente es requerido');
  }

  if (!formData.productos || formData.productos.length === 0) {
    errors.push('Debe agregar al menos un producto');
  }

  if (formData.productos && formData.productos.length > 0) {
    formData.productos.forEach((producto, index) => {
      if (!producto.nombre || producto.nombre.trim() === '') {
        errors.push(`Producto ${index + 1}: El nombre es requerido`);
      }
      if (!producto.cantidad || producto.cantidad <= 0) {
        errors.push(`Producto ${index + 1}: La cantidad debe ser mayor a 0`);
      }
      if (!producto.precioUnitario || producto.precioUnitario <= 0) {
        errors.push(`Producto ${index + 1}: El precio unitario debe ser mayor a 0`);
      }
    });
  }

  if (!formData.tipoPago) {
    errors.push('El tipo de pago es requerido');
  }

  if (formData.tipoPago === 'credito' && (!formData.plazo || formData.plazo <= 0)) {
    errors.push('El plazo de crédito debe ser mayor a 0');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Valida datos de transferencia bancaria
 * @param {Object} transferData - Datos de la transferencia
 * @param {number} saldoDisponible - Saldo disponible en el banco
 * @returns {Object} - { isValid: boolean, errors: array }
 */
export const validateTransferencia = (transferData, saldoDisponible) => {
  const errors = [];

  if (!transferData.hacia) {
    errors.push('El banco destino es requerido');
  }

  if (!transferData.monto || transferData.monto <= 0) {
    errors.push('El monto debe ser mayor a 0');
  }

  if (transferData.monto > saldoDisponible) {
    errors.push('Fondos insuficientes');
  }

  if (!transferData.concepto || transferData.concepto.trim() === '') {
    errors.push('El concepto es requerido');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Valida datos de un gasto
 * @param {Object} gastoData - Datos del gasto
 * @param {number} saldoDisponible - Saldo disponible
 * @returns {Object} - { isValid: boolean, errors: array }
 */
export const validateGasto = (gastoData, saldoDisponible) => {
  const errors = [];

  if (!gastoData.monto || gastoData.monto <= 0) {
    errors.push('El monto debe ser mayor a 0');
  }

  if (gastoData.monto > saldoDisponible) {
    errors.push('Fondos insuficientes');
  }

  if (!gastoData.concepto || gastoData.concepto.trim() === '') {
    errors.push('El concepto es requerido');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Valida datos de un ingreso
 * @param {Object} ingresoData - Datos del ingreso
 * @returns {Object} - { isValid: boolean, errors: array }
 */
export const validateIngreso = (ingresoData) => {
  const errors = [];

  if (!ingresoData.monto || ingresoData.monto <= 0) {
    errors.push('El monto debe ser mayor a 0');
  }

  if (!ingresoData.concepto || ingresoData.concepto.trim() === '') {
    errors.push('El concepto es requerido');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Valida datos de un producto de almacén
 * @param {Object} productoData - Datos del producto
 * @returns {Object} - { isValid: boolean, errors: array }
 */
export const validateProducto = (productoData) => {
  const errors = [];

  if (!productoData.nombre || productoData.nombre.trim() === '') {
    errors.push('El nombre del producto es requerido');
  }

  if (!productoData.id || productoData.id.trim() === '') {
    errors.push('El ID del producto es requerido');
  }

  if (!productoData.categoria || productoData.categoria.trim() === '') {
    errors.push('La categoría es requerida');
  }

  if (!productoData.cantidad || productoData.cantidad < 0) {
    errors.push('La cantidad debe ser 0 o mayor');
  }

  if (!productoData.costoUnitario || productoData.costoUnitario <= 0) {
    errors.push('El costo unitario debe ser mayor a 0');
  }

  if (!productoData.precioVenta || productoData.precioVenta <= 0) {
    errors.push('El precio de venta debe ser mayor a 0');
  }

  if (productoData.precioVenta <= productoData.costoUnitario) {
    errors.push('El precio de venta debe ser mayor al costo unitario');
  }

  if (!productoData.cantidadMinima || productoData.cantidadMinima < 0) {
    errors.push('La cantidad mínima debe ser 0 o mayor');
  }

  if (!productoData.cantidadMaxima || productoData.cantidadMaxima < 0) {
    errors.push('La cantidad máxima debe ser 0 o mayor');
  }

  if (productoData.cantidadMaxima < productoData.cantidadMinima) {
    errors.push('La cantidad máxima debe ser mayor a la cantidad mínima');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Sanitiza input de texto para prevenir XSS
 * @param {string} text - Texto a sanitizar
 * @returns {string} - Texto limpio
 */
export const sanitizeText = (text) => {
  if (!text) return '';
  return text
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

/**
 * Formatea un número como moneda
 * @param {number} amount - Cantidad a formatear
 * @returns {string} - Cantidad formateada
 */
export const formatCurrency = (amount) => {
  if (typeof amount !== 'number') return '$0';
  return `$${amount.toLocaleString('es-MX', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
};

/**
 * Valida formato de email
 * @param {string} email - Email a validar
 * @returns {boolean} - true si es válido
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Valida formato de teléfono (México)
 * @param {string} phone - Teléfono a validar
 * @returns {boolean} - true si es válido
 */
export const isValidPhone = (phone) => {
  const phoneRegex = /^(\+?52)?[\s-]?(\d{2,3})[\s-]?(\d{3,4})[\s-]?(\d{4})$/;
  return phoneRegex.test(phone);
};

export default {
  validateOrdenCompra,
  validateVenta,
  validateTransferencia,
  validateGasto,
  validateIngreso,
  validateProducto,
  sanitizeText,
  formatCurrency,
  isValidEmail,
  isValidPhone,
};
