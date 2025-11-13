/**
 * Tests para utilidades y formatters
 * @module FlowDistributor/utils/__tests__
 */
import { describe, expect, it } from 'vitest';

import {
  calcularDiasTranscurridos,
  calcularMargen,
  calcularUtilidad,
  formatCurrency,
  formatDate,
  validarEmail,
  validarRFC,
} from '../formatters';

describe('Formatters y Utilidades', () => {
  describe('formatCurrency', () => {
    it('debe formatear correctamente USD', () => {
      expect(formatCurrency(1000, 'USD')).toBe('$1,000.00');
      expect(formatCurrency(1234.56, 'USD')).toBe('$1,234.56');
      expect(formatCurrency(0, 'USD')).toBe('$0.00');
    });

    it('debe manejar números negativos', () => {
      expect(formatCurrency(-500, 'USD')).toBe('-$500.00');
    });

    it('debe manejar números grandes', () => {
      expect(formatCurrency(1000000, 'USD')).toBe('$1,000,000.00');
      expect(formatCurrency(1234567.89, 'USD')).toBe('$1,234,567.89');
    });

    it('debe manejar decimales correctamente', () => {
      expect(formatCurrency(10.5, 'USD')).toBe('$10.50');
      expect(formatCurrency(10.999, 'USD')).toBe('$11.00');
    });
  });

  describe('formatDate', () => {
    it('debe formatear fecha en formato corto', () => {
      const date = new Date('2025-01-15');
      const formatted = formatDate(date, 'short');
      expect(formatted).toMatch(/15\/01\/2025|01\/15\/2025/);
    });

    it('debe formatear fecha en formato largo', () => {
      const date = new Date('2025-01-15');
      const formatted = formatDate(date, 'long');
      expect(formatted).toContain('2025');
      expect(formatted).toContain('enero' || 'January');
    });

    it('debe manejar strings de fecha ISO', () => {
      const isoDate = '2025-01-15T10:30:00.000Z';
      const formatted = formatDate(isoDate, 'short');
      expect(formatted).toBeDefined();
    });
  });

  describe('calcularMargen', () => {
    it('debe calcular margen correctamente', () => {
      expect(calcularMargen(1000, 600)).toBe(40); // (1000-600)/1000 * 100 = 40%
      expect(calcularMargen(500, 400)).toBe(20); // 20%
      expect(calcularMargen(1000, 1000)).toBe(0); // Sin margen
    });

    it('debe retornar 0 cuando total es 0', () => {
      expect(calcularMargen(0, 0)).toBe(0);
    });

    it('debe manejar margen del 100%', () => {
      expect(calcularMargen(1000, 0)).toBe(100);
    });

    it('debe redondear a 2 decimales', () => {
      expect(calcularMargen(1000, 667)).toBe(33.3);
    });
  });

  describe('calcularUtilidad', () => {
    it('debe calcular utilidad correctamente', () => {
      expect(calcularUtilidad(1000, 600)).toBe(400);
      expect(calcularUtilidad(500, 200)).toBe(300);
      expect(calcularUtilidad(1000, 1000)).toBe(0);
    });

    it('debe manejar pérdidas (costo mayor que venta)', () => {
      expect(calcularUtilidad(500, 700)).toBe(-200);
    });

    it('debe manejar USD correctamente', () => {
      const total = 1234.56;
      const costo = 789.12;
      const utilidad = calcularUtilidad(total, costo);
      expect(utilidad).toBeCloseTo(445.44, 2);
    });
  });

  describe('validarRFC', () => {
    it('debe validar RFC mexicano válido (persona física)', () => {
      expect(validarRFC('XAXX010101000')).toBe(true);
      expect(validarRFC('VECJ880326XXX')).toBe(true);
    });

    it('debe validar RFC mexicano válido (persona moral)', () => {
      expect(validarRFC('XAX010101000')).toBe(true);
      expect(validarRFC('ABC123456XXX')).toBe(true);
    });

    it('debe rechazar RFC inválido', () => {
      expect(validarRFC('INVALID')).toBe(false);
      expect(validarRFC('123456')).toBe(false);
      expect(validarRFC('')).toBe(false);
    });

    it('debe ser case-insensitive', () => {
      expect(validarRFC('xaxx010101000')).toBe(true);
      expect(validarRFC('XAXX010101000')).toBe(true);
    });
  });

  describe('validarEmail', () => {
    it('debe validar emails correctos', () => {
      expect(validarEmail('test@example.com')).toBe(true);
      expect(validarEmail('user+tag@domain.co.uk')).toBe(true);
      expect(validarEmail('name.surname@company.com')).toBe(true);
    });

    it('debe rechazar emails inválidos', () => {
      expect(validarEmail('invalid')).toBe(false);
      expect(validarEmail('@example.com')).toBe(false);
      expect(validarEmail('test@')).toBe(false);
      expect(validarEmail('')).toBe(false);
    });
  });

  describe('calcularDiasTranscurridos', () => {
    it('debe calcular días correctamente', () => {
      const hoy = new Date();
      const hace7dias = new Date(hoy.getTime() - 7 * 24 * 60 * 60 * 1000);

      expect(calcularDiasTranscurridos(hace7dias)).toBe(7);
    });

    it('debe retornar 0 para fecha de hoy', () => {
      const hoy = new Date();
      expect(calcularDiasTranscurridos(hoy)).toBe(0);
    });

    it('debe manejar fechas futuras', () => {
      const manana = new Date(Date.now() + 24 * 60 * 60 * 1000);
      expect(calcularDiasTranscurridos(manana)).toBe(-1);
    });

    it('debe manejar strings de fecha', () => {
      const hace30dias = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
      expect(calcularDiasTranscurridos(hace30dias)).toBeCloseTo(30, 0);
    });
  });

  describe('Casos edge en USD', () => {
    it('debe manejar valores muy pequeños en USD', () => {
      expect(formatCurrency(0.01, 'USD')).toBe('$0.01');
      expect(formatCurrency(0.001, 'USD')).toBe('$0.00');
    });

    it('debe manejar valores muy grandes en USD', () => {
      expect(formatCurrency(999999999.99, 'USD')).toBe('$999,999,999.99');
    });

    it('debe calcular márgenes con centavos', () => {
      const margen = calcularMargen(10.5, 7.25);
      expect(margen).toBeCloseTo(30.95, 1);
    });
  });
});
