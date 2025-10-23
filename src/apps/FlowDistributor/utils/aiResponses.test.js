import { describe, it, expect } from 'vitest';
import {
  detectQueryCategory,
  isNumericQuery,
  generateOrdenesResponse,
  generateVentasResponse,
  generateBancosResponse,
} from './aiResponses.js';

describe('aiResponses', () => {
  describe('detectQueryCategory', () => {
    it('should detect ORDENES category', () => {
      const category = detectQueryCategory('¿Cuántas órdenes de compra tenemos?');
      expect(category).toBe('ORDENES');
    });

    it('should detect VENTAS category', () => {
      const category = detectQueryCategory('Muestra las ventas de hoy');
      expect(category).toBe('VENTAS');
    });

    it('should detect BANCOS category', () => {
      const category = detectQueryCategory('¿Cuál es el saldo del banco?');
      expect(category).toBe('BANCOS');
    });

    it('should detect ALMACEN category', () => {
      const category = detectQueryCategory('¿Qué productos hay en almacén?');
      expect(category).toBe('ALMACEN');
    });

    it('should return null for unknown queries', () => {
      const category = detectQueryCategory('Hola cómo estás');
      expect(category).toBeNull();
    });
  });

  describe('isNumericQuery', () => {
    it('should detect numeric queries', () => {
      expect(isNumericQuery('¿Cuánto dinero?')).toBe(true);
      expect(isNumericQuery('¿Cuántos productos?')).toBe(true);
      expect(isNumericQuery('Total de gastos')).toBe(true);
      expect(isNumericQuery('Suma de ventas')).toBe(true);
      expect(isNumericQuery('Cantidad disponible')).toBe(true);
    });

    it('should return false for non-numeric queries', () => {
      expect(isNumericQuery('Mostrar lista')).toBe(false);
      expect(isNumericQuery('Hola')).toBe(false);
    });
  });

  describe('generateOrdenesResponse', () => {
    it('should generate response for ordenes query', () => {
      const data = {
        ordenesCompra: [
          { id: 'OC001', distribuidor: 'Dist 1', total: 1000 },
          { id: 'OC002', distribuidor: 'Dist 2', total: 2000 },
        ],
      };
      
      const response = generateOrdenesResponse('¿Cuántas órdenes?', data);
      
      expect(response).toContain('2');
      expect(response).toContain('órden');
    });

    it('should handle empty ordenes', () => {
      const data = { ordenesCompra: [] };
      
      const response = generateOrdenesResponse('¿Cuántas órdenes?', data);
      
      expect(response).toContain('No tienes');
    });
  });

  describe('generateVentasResponse', () => {
    it('should generate response for ventas query', () => {
      const data = {
        ventas: [
          { id: 'V001', cliente: 'Cliente 1', totalVenta: 1000 },
          { id: 'V002', cliente: 'Cliente 2', totalVenta: 2000 },
        ],
      };
      
      const response = generateVentasResponse('¿Cuántas ventas?', data);
      
      expect(response).toContain('2');
      expect(response).toContain('venta');
    });
  });

  describe('generateBancosResponse', () => {
    it('should generate response for bancos query', () => {
      const data = {
        bancos: [
          { nombre: 'Bóveda Monte', saldo: 10000 },
          { nombre: 'Utilidades', saldo: 5000 },
        ],
      };
      
      const response = generateBancosResponse('¿Cuál es el saldo total?', data);
      
      expect(response).toBeTruthy();
      expect(response).toContain('15');
      expect(typeof response).toBe('string');
    });
  });
});
