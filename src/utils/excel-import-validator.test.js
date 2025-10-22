/**
 * Tests unitarios para ExcelImportValidator
 * @jest-environment jsdom
 */
import { beforeEach, describe, expect, it } from 'vitest';

import { ExcelImportValidator } from './excel-import-validator.js';

describe('ExcelImportValidator', () => {
  let validator;

  beforeEach(() => {
    validator = new ExcelImportValidator();
  });

  describe('validateAll', () => {
    it('should validate correct data structure', async () => {
      const validData = {
        ventas: [
          {
            id: 'V001',
            fecha: '2025-01-01',
            cliente: 'Cliente Test',
            totalVenta: 1000,
            estadoPago: 'completo',
            adeudo: 0,
            productos: [{ nombre: 'Producto A', cantidad: 10, precio: 100 }],
          },
        ],
        clientes: [
          {
            nombre: 'Cliente Test',
            adeudo: 0,
            totalComprado: 1000,
            totalAbonado: 1000,
            estado: 'activo',
          },
        ],
        ordenesCompra: [],
        bancos: {},
        almacen: { stock: [], entradas: [], salidas: [] },
        distribuidores: [],
      };

      const result = await validator.validateAll(validData);

      expect(result.success).toBe(true);
      expect(result.errors).toHaveLength(0);
      expect(result.data).toBeDefined();
      expect(result.stats).toBeDefined();
    });

    it('should detect missing required fields', async () => {
      const invalidData = {
        ventas: [
          {
            id: 'V001',
            // Missing required fields
          },
        ],
        clientes: [],
        ordenesCompra: [],
        bancos: {},
        almacen: { stock: [], entradas: [], salidas: [] },
      };

      const result = await validator.validateAll(invalidData);

      expect(result.success).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should generate warnings for business logic issues', async () => {
      const dataWithWarnings = {
        ventas: [
          {
            id: 'V001',
            fecha: '2025-01-01',
            cliente: 'Cliente Inexistente', // Cliente no existe en catálogo
            totalVenta: 1000,
            estadoPago: 'pendiente',
            adeudo: 0, // Inconsistencia: pendiente pero adeudo 0
            productos: [],
          },
        ],
        clientes: [],
        ordenesCompra: [],
        bancos: {},
        almacen: { stock: [], entradas: [], salidas: [] },
        distribuidores: [],
      };

      const result = await validator.validateAll(dataWithWarnings);

      expect(result.warnings.length).toBeGreaterThan(0);
    });
  });

  describe('validateVentas', () => {
    it('should validate array of ventas', async () => {
      const ventas = [
        {
          id: 'V001',
          fecha: '2025-01-01',
          cliente: 'Cliente A',
          totalVenta: 1000,
          estadoPago: 'completo',
          adeudo: 0,
          productos: [],
        },
      ];

      const result = await validator.validateVentas(ventas);

      expect(Array.isArray(result)).toBe(true);
      expect(result).toHaveLength(1);
    });

    it('should filter out invalid ventas', async () => {
      const ventas = [
        {
          id: 'V001',
          fecha: '2025-01-01',
          cliente: 'Cliente A',
          totalVenta: 1000,
          estadoPago: 'completo',
          adeudo: 0,
        },
        {
          id: 'INVALID',
          // Missing required fields
        },
      ];

      const result = await validator.validateVentas(ventas);

      expect(validator.errors.length).toBeGreaterThan(0);
    });
  });

  describe('generateReport', () => {
    it('should generate validation report', async () => {
      const data = {
        ventas: [],
        clientes: [],
        ordenesCompra: [],
        bancos: {},
        almacen: { stock: [], entradas: [], salidas: [] },
        distribuidores: [],
      };

      await validator.validateAll(data);
      const report = validator.generateReport();

      expect(report).toBeDefined();
      expect(report.timestamp).toBeDefined();
      expect(report.errors).toBeDefined();
      expect(report.warnings).toBeDefined();
      expect(report.stats).toBeDefined();
    });
  });
});
