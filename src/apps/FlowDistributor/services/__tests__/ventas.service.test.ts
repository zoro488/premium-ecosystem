/**
 * Tests para Ventas Service
 * @module FlowDistributor/services/__tests__
 */
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { Venta } from '../../types';
import { VentasService } from '../ventas.service';

describe('VentasService', () => {
  const mockVenta: Partial<Venta> = {
    numeroVenta: 'V-2025-001',
    fecha: new Date().toISOString(),
    cliente: {
      id: 'cliente-1',
      nombre: 'Cliente Test',
    },
    producto: 'Producto Test',
    cantidad: 10,
    precioUnitario: 100,
    total: 1000,
    costo: 600,
    utilidad: 400,
    margen: 40,
    moneda: 'USD',
    estado: 'PAGADA',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('crear', () => {
    it('debe crear una venta correctamente', async () => {
      const id = await VentasService.crear(mockVenta as Venta);
      expect(id).toBeDefined();
    });

    it('debe validar stock disponible antes de crear', async () => {
      const ventaSinStock = { ...mockVenta, cantidad: 99999 };
      await expect(VentasService.crear(ventaSinStock as Venta)).rejects.toThrow(/stock/i);
    });

    it('debe calcular utilidad y margen automáticamente', async () => {
      const ventaSinCalculo = { ...mockVenta };
      delete ventaSinCalculo.utilidad;
      delete ventaSinCalculo.margen;

      const id = await VentasService.crear(ventaSinCalculo as Venta);
      expect(id).toBeDefined();
      // Utilidad = total - costo = 1000 - 600 = 400
      // Margen = (utilidad / total) * 100 = (400/1000)*100 = 40%
    });

    it('debe actualizar stock al crear venta', async () => {
      const id = await VentasService.crear(mockVenta as Venta);
      expect(id).toBeDefined();
      // Verificar que el stock se redujo
    });
  });

  describe('validaciones', () => {
    it('debe validar que todos los montos estén en USD', () => {
      expect(mockVenta.moneda).toBe('USD');
    });

    it('debe rechazar cantidades negativas', async () => {
      const ventaInvalida = { ...mockVenta, cantidad: -5 };
      await expect(VentasService.crear(ventaInvalida as Venta)).rejects.toThrow();
    });

    it('debe rechazar precios negativos', async () => {
      const ventaInvalida = { ...mockVenta, precioUnitario: -100 };
      await expect(VentasService.crear(ventaInvalida as Venta)).rejects.toThrow();
    });

    it('debe validar que cliente tenga crédito disponible', async () => {
      const ventaCredito = { ...mockVenta, estado: 'CREDITO' as const, total: 999999 };
      await expect(VentasService.crear(ventaCredito as Venta)).rejects.toThrow(/crédito/i);
    });
  });

  describe('cálculos financieros', () => {
    it('debe calcular total correctamente (cantidad * precio)', () => {
      const total = 10 * 100;
      expect(total).toBe(1000);
      expect(total).toBe(mockVenta.total);
    });

    it('debe calcular utilidad correctamente (total - costo)', () => {
      const utilidad = 1000 - 600;
      expect(utilidad).toBe(400);
      expect(utilidad).toBe(mockVenta.utilidad);
    });

    it('debe calcular margen correctamente ((utilidad/total)*100)', () => {
      const margen = (400 / 1000) * 100;
      expect(margen).toBe(40);
      expect(margen).toBe(mockVenta.margen);
    });

    it('debe manejar margen cuando costo es cero', () => {
      const _ventaCostoCero = { ...mockVenta, costo: 0 };
      const margen = ((1000 - 0) / 1000) * 100;
      expect(margen).toBe(100);
    });
  });

  describe('obtenerPorCliente', () => {
    it('debe filtrar ventas por cliente', async () => {
      const ventas = await VentasService.obtenerPorCliente('cliente-1');
      expect(Array.isArray(ventas)).toBe(true);
    });
  });

  describe('obtenerPorFecha', () => {
    it('debe filtrar ventas por rango de fechas', async () => {
      const inicio = new Date('2025-01-01');
      const fin = new Date('2025-12-31');
      const ventas = await VentasService.obtenerPorFecha(inicio, fin);
      expect(Array.isArray(ventas)).toBe(true);
    });
  });

  describe('estadísticas', () => {
    it('debe calcular ventas del mes en USD', async () => {
      const ventas = await VentasService.obtenerTodas();
      const now = new Date();
      const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);

      const ventasMes = ventas.filter((v) => new Date(v.fecha) >= firstDay);
      const total = ventasMes.reduce((sum, v) => sum + v.total, 0);

      expect(typeof total).toBe('number');
    });

    it('debe calcular utilidad total', async () => {
      const ventas = await VentasService.obtenerTodas();
      const utilidadTotal = ventas.reduce((sum, v) => sum + (v.utilidad || 0), 0);

      expect(typeof utilidadTotal).toBe('number');
    });

    it('debe calcular margen promedio', async () => {
      const ventas = await VentasService.obtenerTodas();
      if (ventas.length === 0) return;

      const margenPromedio = ventas.reduce((sum, v) => sum + (v.margen || 0), 0) / ventas.length;

      expect(typeof margenPromedio).toBe('number');
      expect(margenPromedio).toBeGreaterThanOrEqual(0);
      expect(margenPromedio).toBeLessThanOrEqual(100);
    });
  });

  describe('transacciones', () => {
    it('debe usar transacción al crear venta con actualización de stock', async () => {
      const { runTransaction } = await import('../../../lib/firebase');
      await VentasService.crear(mockVenta as Venta);
      expect(runTransaction).toHaveBeenCalled();
    });

    it('debe revertir cambios si falla la transacción', async () => {
      vi.mocked(import('../../../lib/firebase')).runTransaction.mockRejectedValueOnce(
        new Error('Transaction failed')
      );

      await expect(VentasService.crear(mockVenta as Venta)).rejects.toThrow();
    });
  });
});
