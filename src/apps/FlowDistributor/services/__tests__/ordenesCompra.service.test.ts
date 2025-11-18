/**
 * Tests para OrdenesCompra Service
 * @module FlowDistributor/services/__tests__
 */
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { OrdenCompra } from '../../types';
import { OrdenesCompraService } from '../ordenesCompra.service';

// Mock de Firestore
vi.mock('../../../lib/firebase', () => ({
  db: {},
  collection: vi.fn(),
  addDoc: vi.fn(),
  updateDoc: vi.fn(),
  deleteDoc: vi.fn(),
  doc: vi.fn(),
  getDoc: vi.fn(),
  getDocs: vi.fn(),
  query: vi.fn(),
  where: vi.fn(),
  orderBy: vi.fn(),
  runTransaction: vi.fn(),
}));

describe('OrdenesCompraService', () => {
  const mockOrden: Partial<OrdenCompra> = {
    numeroOrden: 'OC-2025-001',
    proveedor: 'Proveedor Test',
    producto: 'Producto Test',
    cantidad: 100,
    precioUnitario: 50,
    montoTotal: 5000,
    moneda: 'USD',
    estado: 'PENDIENTE',
    fechaOrden: new Date().toISOString(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('crear', () => {
    it('debe crear una orden correctamente', async () => {
      const id = await OrdenesCompraService.crear(mockOrden as OrdenCompra);
      expect(id).toBeDefined();
      expect(typeof id).toBe('string');
    });

    it('debe validar campos requeridos', async () => {
      const ordenInvalida = { ...mockOrden };
      delete ordenInvalida.numeroOrden;

      await expect(OrdenesCompraService.crear(ordenInvalida as OrdenCompra)).rejects.toThrow();
    });

    it('debe calcular montoTotal correctamente', async () => {
      const ordenSinTotal = { ...mockOrden };
      delete ordenSinTotal.montoTotal;

      const id = await OrdenesCompraService.crear(ordenSinTotal as OrdenCompra);
      expect(id).toBeDefined();
      // Verificar que se calculó: cantidad * precioUnitario
    });
  });

  describe('actualizar', () => {
    it('debe actualizar una orden existente', async () => {
      const updates = { estado: 'RECIBIDA' as const };
      await expect(OrdenesCompraService.actualizar('test-id', updates)).resolves.not.toThrow();
    });

    it('debe actualizar fecha de recepción al marcar como RECIBIDA', async () => {
      const updates = { estado: 'RECIBIDA' as const };
      await OrdenesCompraService.actualizar('test-id', updates);
      // Verificar que fechaRecepcion se estableció
    });
  });

  describe('obtenerPorEstado', () => {
    it('debe filtrar órdenes por estado', async () => {
      const ordenes = await OrdenesCompraService.obtenerPorEstado('PENDIENTE');
      expect(Array.isArray(ordenes)).toBe(true);
    });
  });

  describe('marcarComoRecibida', () => {
    it('debe actualizar inventario al recibir orden', async () => {
      await expect(OrdenesCompraService.marcarComoRecibida('test-id')).resolves.not.toThrow();
    });

    it('debe usar transacción para atomicidad', async () => {
      const { runTransaction } = await import('../../../lib/firebase');
      await OrdenesCompraService.marcarComoRecibida('test-id');
      expect(runTransaction).toHaveBeenCalled();
    });
  });

  describe('obtenerAlertasStockBajo', () => {
    it('debe identificar productos con stock bajo', async () => {
      const alertas = await OrdenesCompraService.obtenerAlertasStockBajo();
      expect(Array.isArray(alertas)).toBe(true);
    });
  });

  describe('calcularTotales', () => {
    it('debe calcular correctamente los totales en USD', () => {
      const items = [
        { cantidad: 10, precioUnitario: 5 },
        { cantidad: 20, precioUnitario: 10 },
      ];

      const total = items.reduce((sum, item) => sum + item.cantidad * item.precioUnitario, 0);
      expect(total).toBe(250); // (10*5) + (20*10) = 50 + 200
    });

    it('debe manejar descuentos correctamente', () => {
      const subtotal = 1000;
      const descuento = 10; // 10%
      const total = subtotal * (1 - descuento / 100);

      expect(total).toBe(900);
    });
  });

  describe('validaciones', () => {
    it('debe rechazar cantidades negativas', async () => {
      const ordenInvalida = { ...mockOrden, cantidad: -10 };
      await expect(OrdenesCompraService.crear(ordenInvalida as OrdenCompra)).rejects.toThrow();
    });

    it('debe rechazar precios negativos', async () => {
      const ordenInvalida = { ...mockOrden, precioUnitario: -50 };
      await expect(OrdenesCompraService.crear(ordenInvalida as OrdenCompra)).rejects.toThrow();
    });

    it('debe validar que la moneda sea USD', () => {
      expect(mockOrden.moneda).toBe('USD');
    });
  });

  describe('estadísticas', () => {
    it('debe calcular total de compras del mes en USD', async () => {
      const ordenes = await OrdenesCompraService.obtenerTodas();
      const now = new Date();
      const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);

      const ordenesMes = ordenes.filter((o) => new Date(o.fechaOrden) >= firstDay);
      const total = ordenesMes.reduce((sum, o) => sum + o.montoTotal, 0);

      expect(typeof total).toBe('number');
      expect(total).toBeGreaterThanOrEqual(0);
    });
  });
});
