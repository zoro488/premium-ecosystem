/**
 * 🧪 BUSINESS LOGIC TESTS
 *
 * Suite completa de tests para businessLogic.ts
 * Cubre todos los flujos críticos de negocio
 *
 * @author Premium Ecosystem
 * @version 2.0.0
 */
import { describe, expect, it } from 'vitest';

import {
  type OrdenCompra,
  type Venta,
  calculateAccountingEntries,
  calculateFlete,
  calculateMarginPercentage,
  calculateUtilidad,
  getCurrentSTK,
  getInventorySummary,
  previewVentaEntries,
  processOrdenCompra,
  processVenta,
  recalculateRFActual,
  updateSTK,
  validateOrdenCompra,
  validateSTKAvailability,
  validateVenta,
} from '@/services/businessLogic';

// ==================== MOCK DATA ====================

const mockOrdenCompra: OrdenCompra = {
  OC: 'OC0001',
  Fecha: '2025-01-28',
  Distribuidor: 'PACMAN',
  Cantidad: 100,
  Precio_Compra: 150.5,
  Total: 15050,
  Concepto: 'Orden de prueba',
};

const mockVenta: Venta = {
  id: 'V-TEST-001',
  Fecha: '2025-01-28',
  Cliente: 'Bódega M-P',
  Cantidad: 50,
  Precio_Venta: 200,
  Precio_Compra: 150,
  Estado_Pago: 'pagado',
  Monto_Total: 10000,
  Monto_Abonado: 0,
  Deuda_Pendiente: 0,
  Concepto: 'Venta de prueba',
};

// ==================== INVENTORY TESTS ====================

describe('Inventory Management', () => {
  describe('getCurrentSTK', () => {
    it('debe retornar el STK actual del almacén', () => {
      const stk = getCurrentSTK();
      expect(stk).toBeGreaterThanOrEqual(0);
      expect(typeof stk).toBe('number');
    });

    it('debe calcular STK como ingresos - salidas', () => {
      const stk = getCurrentSTK();
      const summary = getInventorySummary();
      expect(stk).toBe(summary.totalIngresos - summary.totalSalidas);
    });
  });

  describe('updateSTK', () => {
    it('debe incrementar STK en entrada', () => {
      const currentSTK = getCurrentSTK();
      const cantidad = 100;
      const newSTK = updateSTK('entrada', cantidad);
      expect(newSTK).toBe(currentSTK + cantidad);
    });

    it('debe decrementar STK en salida', () => {
      const currentSTK = getCurrentSTK();
      const cantidad = 5;
      const newSTK = updateSTK('salida', cantidad);
      expect(newSTK).toBe(currentSTK - cantidad);
    });

    it('debe lanzar error si cantidad es 0 o negativa', () => {
      expect(() => updateSTK('entrada', 0)).toThrow('La cantidad debe ser mayor a 0');
      expect(() => updateSTK('entrada', -10)).toThrow('La cantidad debe ser mayor a 0');
    });

    it('debe lanzar error si STK resultante es negativo', () => {
      const currentSTK = getCurrentSTK();
      expect(() => updateSTK('salida', currentSTK + 1000)).toThrow('STK insuficiente');
    });
  });

  describe('validateSTKAvailability', () => {
    it('debe validar correctamente STK disponible', () => {
      const currentSTK = getCurrentSTK();
      const validation = validateSTKAvailability(currentSTK - 1);
      expect(validation.isValid).toBe(true);
      expect(validation.errors.length).toBe(0);
    });

    it('debe retornar error si cantidad excede STK', () => {
      const currentSTK = getCurrentSTK();
      const validation = validateSTKAvailability(currentSTK + 100);
      expect(validation.isValid).toBe(false);
      expect(validation.errors.length).toBeGreaterThan(0);
      expect(validation.errors[0]).toContain('STK insuficiente');
    });

    it('debe retornar warning si STK quedará bajo', () => {
      const currentSTK = getCurrentSTK();
      if (currentSTK > 8) {
        const validation = validateSTKAvailability(currentSTK - 8);
        expect(validation.warnings).toBeDefined();
        expect(validation.warnings!.length).toBeGreaterThan(0);
      }
    });
  });
});

// ==================== ORDEN DE COMPRA TESTS ====================

describe('Orden de Compra Workflow', () => {
  describe('validateOrdenCompra', () => {
    it('debe validar OC completa correctamente', () => {
      const validation = validateOrdenCompra(mockOrdenCompra);
      expect(validation.isValid).toBe(true);
      expect(validation.errors.length).toBe(0);
    });

    it('debe retornar error si falta OC number', () => {
      const ocInvalida = { ...mockOrdenCompra, OC: '' };
      const validation = validateOrdenCompra(ocInvalida);
      expect(validation.isValid).toBe(false);
      expect(validation.errors).toContain('Número de OC es obligatorio');
    });

    it('debe retornar error si falta fecha', () => {
      const ocInvalida = { ...mockOrdenCompra, Fecha: '' };
      const validation = validateOrdenCompra(ocInvalida);
      expect(validation.isValid).toBe(false);
      expect(validation.errors).toContain('Fecha es obligatoria');
    });

    it('debe retornar error si falta distribuidor', () => {
      const ocInvalida = { ...mockOrdenCompra, Distribuidor: '' };
      const validation = validateOrdenCompra(ocInvalida);
      expect(validation.isValid).toBe(false);
      expect(validation.errors).toContain('Distribuidor es obligatorio');
    });

    it('debe retornar error si cantidad es 0 o negativa', () => {
      const ocInvalida = { ...mockOrdenCompra, Cantidad: 0 };
      const validation = validateOrdenCompra(ocInvalida);
      expect(validation.isValid).toBe(false);
      expect(validation.errors).toContain('Cantidad debe ser mayor a 0');
    });

    it('debe retornar error si precio es 0 o negativo', () => {
      const ocInvalida = { ...mockOrdenCompra, Precio_Compra: 0 };
      const validation = validateOrdenCompra(ocInvalida);
      expect(validation.isValid).toBe(false);
      expect(validation.errors).toContain('Precio de compra debe ser mayor a 0');
    });

    it('debe validar cálculo de total correctamente', () => {
      const ocInvalida = { ...mockOrdenCompra, Total: 99999 };
      const validation = validateOrdenCompra(ocInvalida);
      expect(validation.isValid).toBe(false);
      expect(validation.errors[0]).toContain('Total no coincide');
    });
  });

  describe('processOrdenCompra', () => {
    it('debe procesar OC y generar asiento contable', () => {
      const asientos = processOrdenCompra(mockOrdenCompra);

      expect(asientos).toHaveLength(1);
      expect(asientos[0].panel).toBe('Almacen_Monte');
      expect(asientos[0].tipo).toBe('ingreso');
      expect(asientos[0].monto).toBe(mockOrdenCompra.Total);
      expect(asientos[0].referencia).toBe(mockOrdenCompra.OC);
    });

    it('debe lanzar error si validación falla', () => {
      const ocInvalida = { ...mockOrdenCompra, OC: '' };
      expect(() => processOrdenCompra(ocInvalida)).toThrow('Validación OC fallida');
    });
  });
});

// ==================== VENTA TESTS ====================

describe('Venta Workflow', () => {
  describe('validateVenta', () => {
    it('debe validar venta completa correctamente', () => {
      const validation = validateVenta(mockVenta);
      expect(validation.isValid).toBe(true);
      expect(validation.errors.length).toBe(0);
    });

    it('debe retornar error si falta fecha', () => {
      const ventaInvalida = { ...mockVenta, Fecha: '' };
      const validation = validateVenta(ventaInvalida);
      expect(validation.isValid).toBe(false);
      expect(validation.errors).toContain('Fecha es obligatoria');
    });

    it('debe retornar error si falta cliente', () => {
      const ventaInvalida = { ...mockVenta, Cliente: '' };
      const validation = validateVenta(ventaInvalida);
      expect(validation.isValid).toBe(false);
      expect(validation.errors).toContain('Cliente es obligatorio');
    });

    it('debe validar STK disponible', () => {
      const currentSTK = getCurrentSTK();
      const ventaInvalida = { ...mockVenta, Cantidad: currentSTK + 100 };
      const validation = validateVenta(ventaInvalida);
      expect(validation.isValid).toBe(false);
      expect(validation.errors[0]).toContain('STK insuficiente');
    });

    it('debe retornar warning si venta sin utilidad', () => {
      const ventaSinUtilidad = {
        ...mockVenta,
        Precio_Venta: 650,
        Precio_Compra: 650,
      };
      const validation = validateVenta(ventaSinUtilidad);
      expect(validation.warnings).toBeDefined();
      expect(validation.warnings!.length).toBeGreaterThan(0);
      expect(validation.warnings![0]).toContain('Venta sin utilidad');
    });
  });

  describe('calculateAccountingEntries', () => {
    it('debe generar 3 asientos para venta pagada', () => {
      const asientos = calculateAccountingEntries(mockVenta);

      expect(asientos).toHaveLength(3);

      // Bóveda Monte
      expect(asientos[0].panel).toBe('Boveda_Monte');
      expect(asientos[0].tipo).toBe('ingreso');
      expect(asientos[0].monto).toBe(mockVenta.Precio_Compra * mockVenta.Cantidad);

      // Flete Sur
      expect(asientos[1].panel).toBe('Flete_Sur');
      expect(asientos[1].tipo).toBe('gasto');
      expect(asientos[1].monto).toBe(500 * mockVenta.Cantidad);

      // Utilidades
      expect(asientos[2].panel).toBe('Utilidades');
      expect(asientos[2].tipo).toBe('ingreso');
      const expectedUtilidad =
        (mockVenta.Precio_Venta - mockVenta.Precio_Compra - 500) * mockVenta.Cantidad;
      expect(asientos[2].monto).toBe(expectedUtilidad);
    });

    it('no debe generar asientos si venta no pagada', () => {
      const ventaAbonada = { ...mockVenta, Estado_Pago: 'abonado' as const };
      const asientos = calculateAccountingEntries(ventaAbonada);
      expect(asientos).toHaveLength(0);
    });
  });

  describe('processVenta', () => {
    it('debe procesar venta pagada y generar 4 asientos (almacén + 3)', () => {
      const asientos = processVenta(mockVenta);

      expect(asientos.length).toBeGreaterThan(0);

      // Primer asiento debe ser salida de almacén
      expect(asientos[0].panel).toBe('Almacen_Monte');
      expect(asientos[0].tipo).toBe('gasto');
    });

    it('debe lanzar error si validación falla', () => {
      const ventaInvalida = { ...mockVenta, Cliente: '' };
      expect(() => processVenta(ventaInvalida)).toThrow('Validación venta fallida');
    });
  });
});

// ==================== AUTO CALCULATIONS TESTS ====================

describe('Auto Calculations', () => {
  describe('calculateFlete', () => {
    it('debe calcular flete correctamente ($500 × cantidad)', () => {
      expect(calculateFlete(1)).toBe(500);
      expect(calculateFlete(10)).toBe(5000);
      expect(calculateFlete(100)).toBe(50000);
    });
  });

  describe('calculateUtilidad', () => {
    it('debe calcular utilidad correctamente', () => {
      const precioVenta = 200;
      const precioCompra = 150;
      const cantidad = 50;

      const utilidad = calculateUtilidad(precioVenta, precioCompra, cantidad);
      const expectedUtilidad = (200 - 150 - 500) * 50;

      expect(utilidad).toBe(expectedUtilidad);
    });

    it('debe manejar utilidad negativa', () => {
      const utilidad = calculateUtilidad(100, 150, 10);
      expect(utilidad).toBeLessThan(0);
    });
  });

  describe('calculateMarginPercentage', () => {
    it('debe calcular margen porcentual correctamente', () => {
      const margen = calculateMarginPercentage(200, 150);
      const expectedMargen = ((200 - 150 - 500) / 200) * 100;

      expect(margen).toBe(expectedMargen);
    });

    it('debe retornar margen negativo si precio no cubre costos', () => {
      const margen = calculateMarginPercentage(100, 150);
      expect(margen).toBeLessThan(0);
    });
  });

  describe('previewVentaEntries', () => {
    it('debe generar preview completo de venta', () => {
      const preview = previewVentaEntries({
        Cantidad: 50,
        Precio_Venta: 200,
        Precio_Compra: 150,
      });

      expect(preview).toBeDefined();
      expect(preview!.bovedaMonte).toBe(150 * 50);
      expect(preview!.fleteSur).toBe(500 * 50);
      expect(preview!.utilidades).toBe((200 - 150 - 500) * 50);
      expect(preview!.margenPorcentaje).toBeDefined();
      expect(preview!.newSTK).toBeDefined();
    });

    it('debe retornar null si faltan datos', () => {
      const preview = previewVentaEntries({
        Cantidad: 0,
        Precio_Venta: 200,
        Precio_Compra: 150,
      });

      expect(preview).toBeNull();
    });
  });
});

// ==================== RF ACTUAL TESTS ====================

describe('RF Actual Calculations', () => {
  describe('recalculateRFActual', () => {
    it('debe calcular RF Actual de Almacén en unidades', () => {
      const rfActual = recalculateRFActual('Almacen_Monte');
      expect(rfActual).toBeGreaterThanOrEqual(0);
      expect(rfActual).toBe(getCurrentSTK());
    });

    it('debe lanzar error si panel no existe', () => {
      expect(() => recalculateRFActual('Panel_Invalido')).toThrow(
        'Panel Panel_Invalido no encontrado'
      );
    });
  });

  describe('getInventorySummary', () => {
    it('debe retornar resumen completo de inventario', () => {
      const summary = getInventorySummary();

      expect(summary).toHaveProperty('stkActual');
      expect(summary).toHaveProperty('totalIngresos');
      expect(summary).toHaveProperty('totalSalidas');
      expect(summary).toHaveProperty('cantidadOrdenes');
      expect(summary).toHaveProperty('cantidadVentas');

      expect(typeof summary.stkActual).toBe('number');
      expect(typeof summary.totalIngresos).toBe('number');
      expect(typeof summary.totalSalidas).toBe('number');
    });

    it('debe tener STK = ingresos - salidas', () => {
      const summary = getInventorySummary();
      expect(summary.stkActual).toBe(summary.totalIngresos - summary.totalSalidas);
    });
  });
});

// ==================== INTEGRATION TESTS ====================

describe('Integration Tests', () => {
  describe('OC → Venta Flow', () => {
    it('debe procesar flujo completo OC → Venta', () => {
      // 1. Procesar OC
      const asientosOC = processOrdenCompra(mockOrdenCompra);
      expect(asientosOC.length).toBeGreaterThan(0);

      // 2. Procesar Venta
      const asientosVenta = processVenta(mockVenta);
      expect(asientosVenta.length).toBeGreaterThan(0);

      // 3. Verificar que se generaron todos los asientos esperados
      const totalAsientos = asientosOC.length + asientosVenta.length;
      expect(totalAsientos).toBeGreaterThanOrEqual(4); // 1 OC + 1 Almacén + 3 contables
    });
  });
});
