import { describe, it, expect } from 'vitest';
import {
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
} from './validation.js';

describe('validation', () => {
  describe('validateOrdenCompra', () => {
    it('should validate valid orden de compra', () => {
      const validData = {
        distribuidor: 'Distribuidor Test',
        productos: [
          { nombre: 'Producto 1', cantidad: 10, precioUnitario: 100 },
        ],
      };
      
      const result = validateOrdenCompra(validData);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject orden without distribuidor', () => {
      const invalidData = {
        distribuidor: '',
        productos: [{ nombre: 'Producto 1', cantidad: 10, precioUnitario: 100 }],
      };
      
      const result = validateOrdenCompra(invalidData);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('El distribuidor es requerido');
    });

    it('should reject orden without productos', () => {
      const invalidData = {
        distribuidor: 'Test',
        productos: [],
      };
      
      const result = validateOrdenCompra(invalidData);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Debe agregar al menos un producto');
    });
  });

  describe('validateVenta', () => {
    it('should validate valid venta', () => {
      const validData = {
        cliente: 'Cliente Test',
        productos: [{ nombre: 'Producto 1', cantidad: 10, precioUnitario: 100 }],
        tipoPago: 'contado',
      };
      
      const result = validateVenta(validData);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should require plazo for credito payment', () => {
      const invalidData = {
        cliente: 'Cliente Test',
        productos: [{ nombre: 'Producto 1', cantidad: 10, precioUnitario: 100 }],
        tipoPago: 'credito',
        plazo: 0,
      };
      
      const result = validateVenta(invalidData);
      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.includes('plazo'))).toBe(true);
    });
  });

  describe('validateTransferencia', () => {
    it('should validate valid transferencia', () => {
      const validData = {
        hacia: 'Banco Destino',
        monto: 1000,
        concepto: 'Test transfer',
      };
      
      const result = validateTransferencia(validData, 2000);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject transfer with insufficient funds', () => {
      const invalidData = {
        hacia: 'Banco Destino',
        monto: 3000,
        concepto: 'Test transfer',
      };
      
      const result = validateTransferencia(invalidData, 2000);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Fondos insuficientes');
    });
  });

  describe('sanitizeText', () => {
    it('should escape HTML characters', () => {
      const dangerous = '<script>alert("xss")</script>';
      const safe = sanitizeText(dangerous);
      expect(safe).not.toContain('<script>');
      expect(safe).toContain('&lt;script&gt;');
    });
  });

  describe('formatCurrency', () => {
    it('should format numbers as currency', () => {
      expect(formatCurrency(1000)).toContain('1');
      expect(formatCurrency(1000)).toContain('000');
    });

    it('should handle non-numbers', () => {
      expect(formatCurrency('invalid')).toBe('$0');
    });
  });

  describe('isValidEmail', () => {
    it('should validate correct emails', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
      expect(isValidEmail('user.name@domain.co.uk')).toBe(true);
    });

    it('should reject invalid emails', () => {
      expect(isValidEmail('notanemail')).toBe(false);
      expect(isValidEmail('@domain.com')).toBe(false);
      expect(isValidEmail('user@')).toBe(false);
    });
  });

  describe('isValidPhone', () => {
    it('should validate Mexican phone numbers', () => {
      expect(isValidPhone('5512345678')).toBe(true);
      expect(isValidPhone('+52 55 1234 5678')).toBe(true);
    });

    it('should reject invalid phone numbers', () => {
      expect(isValidPhone('123')).toBe(false);
      expect(isValidPhone('abcd')).toBe(false);
    });
  });
});
