// 🧪 TESTS UNITARIOS - calculations.js
// Tests comprehensivos para lógica de negocio crítica
import { beforeEach, describe, expect, it } from 'vitest';

import {
  CODIGOS_BOVEDA,
  FLETE_POR_UNIDAD,
  PORCENTAJES_DISTRIBUCION,
  calcularCostoBovedaMonte,
  calcularCostoFlete,
  calcularDeudaOC,
  calcularIngresoVenta,
  calcularKPIsVentas,
  calcularMargen,
  calcularOrdenCompra,
  calcularStockDisponible,
  calcularUtilidadNeta,
  calcularValorInventario,
  distribuirUtilidad,
  mxnToUsd,
  redondear,
  usdToMxn,
  validarVenta,
} from '../calculations.js';

// ============================================================================
// TESTS DE CONSTANTES
// ============================================================================

describe('Constantes del Sistema', () => {
  it('PORCENTAJES_DISTRIBUCION debe sumar 1.0', () => {
    const suma = PORCENTAJES_DISTRIBUCION.BOVEDA_MONTE + PORCENTAJES_DISTRIBUCION.RESTO;
    expect(suma).toBe(1.0);
  });

  it('FLETE_POR_UNIDAD debe ser 500 MXN', () => {
    expect(FLETE_POR_UNIDAD).toBe(500);
  });

  it('CODIGOS_BOVEDA debe contener todas las bóvedas', () => {
    expect(CODIGOS_BOVEDA).toHaveProperty('BOVEDA_MONTE');
    expect(CODIGOS_BOVEDA).toHaveProperty('BOVEDA_USA');
    expect(CODIGOS_BOVEDA).toHaveProperty('AZTECA');
    expect(CODIGOS_BOVEDA).toHaveProperty('UTILIDADES');
    expect(CODIGOS_BOVEDA).toHaveProperty('FLETE_SUR');
    expect(CODIGOS_BOVEDA).toHaveProperty('LEFTIE');
    expect(CODIGOS_BOVEDA).toHaveProperty('PROFIT');
  });
});

// ============================================================================
// TESTS DE CÁLCULOS DE VENTA
// ============================================================================

describe('calcularIngresoVenta', () => {
  it('calcula ingreso correctamente con valores positivos', () => {
    const resultado = calcularIngresoVenta(100, 50);
    expect(resultado).toBe(5000);
  });

  it('retorna 0 cuando cantidad es 0', () => {
    const resultado = calcularIngresoVenta(0, 50);
    expect(resultado).toBe(0);
  });

  it('retorna 0 cuando precio es 0', () => {
    const resultado = calcularIngresoVenta(100, 0);
    expect(resultado).toBe(0);
  });

  it('maneja decimales correctamente', () => {
    const resultado = calcularIngresoVenta(10.5, 99.99);
    expect(resultado).toBeCloseTo(1049.895, 2);
  });

  it('maneja números grandes', () => {
    const resultado = calcularIngresoVenta(10000, 500.75);
    expect(resultado).toBe(5007500);
  });

  it('retorna negativo si precio es negativo (caso edge)', () => {
    const resultado = calcularIngresoVenta(10, -50);
    expect(resultado).toBe(-500);
  });
});

describe('calcularCostoBovedaMonte', () => {
  it('calcula costo correctamente', () => {
    const resultado = calcularCostoBovedaMonte(100, 30);
    expect(resultado).toBe(3000);
  });

  it('retorna 0 cuando cantidad es 0', () => {
    const resultado = calcularCostoBovedaMonte(0, 30);
    expect(resultado).toBe(0);
  });

  it('retorna 0 cuando costo unitario es 0', () => {
    const resultado = calcularCostoBovedaMonte(100, 0);
    expect(resultado).toBe(0);
  });

  it('maneja decimales', () => {
    const resultado = calcularCostoBovedaMonte(50.5, 25.75);
    expect(resultado).toBeCloseTo(1300.375, 2);
  });
});

describe('calcularCostoFlete', () => {
  it('calcula flete cuando aplica', () => {
    // 10 unidades * 500 MXN / 20 (tipo cambio) = 250 USD
    const resultado = calcularCostoFlete(10, 20, true);
    expect(resultado).toBe(250);
  });

  it('retorna 0 cuando no aplica flete', () => {
    const resultado = calcularCostoFlete(10, 20, false);
    expect(resultado).toBe(0);
  });

  it('retorna 0 cuando cantidad es 0', () => {
    const resultado = calcularCostoFlete(0, 20, true);
    expect(resultado).toBe(0);
  });

  it('maneja diferentes tipos de cambio', () => {
    // 10 * 500 / 18 = 277.777...
    const resultado = calcularCostoFlete(10, 18, true);
    expect(resultado).toBeCloseTo(277.78, 2);
  });

  it('maneja cantidades decimales', () => {
    // 10.5 * 500 / 20 = 262.5
    const resultado = calcularCostoFlete(10.5, 20, true);
    expect(resultado).toBe(262.5);
  });
});

describe('calcularUtilidadNeta', () => {
  it('calcula utilidad correcta con valores positivos', () => {
    const ingreso = 10000;
    const costo = 6000;
    const flete = 1000;
    const resultado = calcularUtilidadNeta(ingreso, costo, flete);
    expect(resultado).toBe(3000);
  });

  it('retorna negativo cuando hay pérdida', () => {
    const ingreso = 5000;
    const costo = 7000;
    const flete = 1000;
    const resultado = calcularUtilidadNeta(ingreso, costo, flete);
    expect(resultado).toBe(-3000);
  });

  it('retorna 0 cuando ingreso = costos', () => {
    const ingreso = 10000;
    const costo = 7000;
    const flete = 3000;
    const resultado = calcularUtilidadNeta(ingreso, costo, flete);
    expect(resultado).toBe(0);
  });

  it('maneja flete = 0', () => {
    const resultado = calcularUtilidadNeta(10000, 6000, 0);
    expect(resultado).toBe(4000);
  });
});

describe('calcularMargen', () => {
  it('calcula margen correctamente', () => {
    const utilidad = 3000;
    const ingreso = 10000;
    const resultado = calcularMargen(utilidad, ingreso);
    expect(resultado).toBe(30); // 30%
  });

  it('retorna 0 cuando ingreso es 0', () => {
    const resultado = calcularMargen(1000, 0);
    expect(resultado).toBe(0);
  });

  it('retorna margen negativo cuando hay pérdida', () => {
    const resultado = calcularMargen(-2000, 10000);
    expect(resultado).toBe(-20); // -20%
  });

  it('retorna 100 cuando utilidad = ingreso', () => {
    const resultado = calcularMargen(10000, 10000);
    expect(resultado).toBe(100);
  });

  it('maneja decimales correctamente', () => {
    const resultado = calcularMargen(3333, 10000);
    expect(resultado).toBeCloseTo(33.33, 2);
  });
});

describe('distribuirUtilidad', () => {
  it('distribuye correctamente según porcentajes', () => {
    const utilidad = 10000;
    const resultado = distribuirUtilidad(utilidad);

    // Verificar que Bóveda Monte recibe 30%
    expect(resultado.bovedaMonte).toBe(3000);

    // Verificar que el resto suma 70%
    const resto =
      resultado.utilidades +
      resultado.profit +
      resultado.leftie +
      resultado.fleteSur +
      resultado.azteca +
      resultado.bovedaUSA;

    expect(resto).toBeCloseTo(7000, 1);

    // Verificar que la suma total es correcta
    expect(resultado.totalDistribuido).toBeCloseTo(10000, 1);
  });

  it('retorna 0s cuando utilidad es 0', () => {
    const resultado = distribuirUtilidad(0);

    expect(resultado.bovedaMonte).toBe(0);
    expect(resultado.totalDistribuido).toBe(0);
  });

  it('maneja utilidad negativa', () => {
    const resultado = distribuirUtilidad(-5000);

    expect(resultado.bovedaMonte).toBe(-1500); // 30% de -5000
    expect(resultado.totalDistribuido).toBeCloseTo(-5000, 1);
  });

  it('distribuye utilidad pequeña correctamente', () => {
    const resultado = distribuirUtilidad(100);

    expect(resultado.bovedaMonte).toBe(30);
    expect(resultado.totalDistribuido).toBeCloseTo(100, 1);
  });

  it('todas las propiedades están definidas', () => {
    const resultado = distribuirUtilidad(10000);

    expect(resultado).toHaveProperty('bovedaMonte');
    expect(resultado).toHaveProperty('utilidades');
    expect(resultado).toHaveProperty('profit');
    expect(resultado).toHaveProperty('leftie');
    expect(resultado).toHaveProperty('fleteSur');
    expect(resultado).toHaveProperty('azteca');
    expect(resultado).toHaveProperty('bovedaUSA');
    expect(resultado).toHaveProperty('totalDistribuido');
  });
});

// ============================================================================
// TESTS DE ÓRDENES DE COMPRA
// ============================================================================

describe('calcularOrdenCompra', () => {
  it('calcula orden de compra correctamente', () => {
    const resultado = calcularOrdenCompra({
      cantidad: 100,
      costoUnidad: 25.5,
      tipoCambio: 18,
    });

    expect(resultado.costoTotalUSD).toBe(2550); // 100 * 25.5
    expect(resultado.costoTotalMXN).toBe(45900); // 2550 * 18
    expect(resultado.costoUnitarioMXN).toBe(459); // 25.5 * 18
  });

  it('maneja cantidad decimal', () => {
    const resultado = calcularOrdenCompra({
      cantidad: 50.5,
      costoUnidad: 30,
      tipoCambio: 20,
    });

    expect(resultado.costoTotalUSD).toBe(1515);
    expect(resultado.costoTotalMXN).toBe(30300);
  });

  it('retorna 0s cuando cantidad es 0', () => {
    const resultado = calcularOrdenCompra({
      cantidad: 0,
      costoUnidad: 25,
      tipoCambio: 18,
    });

    expect(resultado.costoTotalUSD).toBe(0);
    expect(resultado.costoTotalMXN).toBe(0);
  });
});

describe('calcularDeudaOC', () => {
  it('calcula deuda correctamente con abonos', () => {
    const ordenCompra = {
      costoTotalMXN: 10000,
      abonos: [2000, 3000],
    };

    const deuda = calcularDeudaOC(ordenCompra);
    expect(deuda).toBe(5000); // 10000 - 5000
  });

  it('retorna total cuando no hay abonos', () => {
    const ordenCompra = {
      costoTotalMXN: 10000,
      abonos: [],
    };

    const deuda = calcularDeudaOC(ordenCompra);
    expect(deuda).toBe(10000);
  });

  it('retorna 0 cuando está pagado completamente', () => {
    const ordenCompra = {
      costoTotalMXN: 10000,
      abonos: [5000, 5000],
    };

    const deuda = calcularDeudaOC(ordenCompra);
    expect(deuda).toBe(0);
  });

  it('retorna negativo si hay sobrepago (caso edge)', () => {
    const ordenCompra = {
      costoTotalMXN: 10000,
      abonos: [6000, 5000],
    };

    const deuda = calcularDeudaOC(ordenCompra);
    expect(deuda).toBe(-1000);
  });
});

// ============================================================================
// TESTS DE INVENTARIO
// ============================================================================

describe('calcularStockDisponible', () => {
  it('calcula stock correctamente', () => {
    const entradas = [{ cantidad: 100 }, { cantidad: 50 }, { cantidad: 30 }];
    const salidas = [{ cantidad: 40 }, { cantidad: 20 }];

    const stock = calcularStockDisponible(entradas, salidas);
    expect(stock).toBe(120); // (100+50+30) - (40+20)
  });

  it('retorna 0 cuando entradas = salidas', () => {
    const entradas = [{ cantidad: 100 }];
    const salidas = [{ cantidad: 100 }];

    const stock = calcularStockDisponible(entradas, salidas);
    expect(stock).toBe(0);
  });

  it('retorna total de entradas cuando no hay salidas', () => {
    const entradas = [{ cantidad: 100 }, { cantidad: 50 }];
    const salidas = [];

    const stock = calcularStockDisponible(entradas, salidas);
    expect(stock).toBe(150);
  });

  it('retorna negativo si más salidas que entradas (caso edge)', () => {
    const entradas = [{ cantidad: 50 }];
    const salidas = [{ cantidad: 100 }];

    const stock = calcularStockDisponible(entradas, salidas);
    expect(stock).toBe(-50);
  });

  it('maneja arrays vacíos', () => {
    const stock = calcularStockDisponible([], []);
    expect(stock).toBe(0);
  });
});

describe('calcularValorInventario', () => {
  it('calcula valor total del inventario', () => {
    const productos = [
      { stockActual: 100, costoUnidad: 25 },
      { stockActual: 50, costoUnidad: 30 },
      { stockActual: 20, costoUnidad: 40 },
    ];

    const valor = calcularValorInventario(productos);
    expect(valor).toBe(4800); // (100*25) + (50*30) + (20*40)
  });

  it('retorna 0 cuando no hay productos', () => {
    const valor = calcularValorInventario([]);
    expect(valor).toBe(0);
  });

  it('ignora productos con stock 0', () => {
    const productos = [
      { stockActual: 100, costoUnidad: 25 },
      { stockActual: 0, costoUnidad: 30 },
    ];

    const valor = calcularValorInventario(productos);
    expect(valor).toBe(2500);
  });

  it('maneja decimales', () => {
    const productos = [{ stockActual: 10.5, costoUnidad: 99.99 }];

    const valor = calcularValorInventario(productos);
    expect(valor).toBeCloseTo(1049.895, 2);
  });
});

// ============================================================================
// TESTS DE VALIDACIÓN
// ============================================================================

describe('validarVenta', () => {
  it('valida venta correcta', () => {
    const venta = {
      cantidad: 10,
      precioVenta: 100,
      costoUnidad: 60,
      cliente: 'cliente-1',
      producto: 'producto-1',
    };

    const resultado = validarVenta(venta);
    expect(resultado.valido).toBe(true);
    expect(resultado.errores).toHaveLength(0);
  });

  it('detecta cantidad inválida', () => {
    const venta = {
      cantidad: 0,
      precioVenta: 100,
      costoUnidad: 60,
    };

    const resultado = validarVenta(venta);
    expect(resultado.valido).toBe(false);
    expect(resultado.errores).toContain('Cantidad debe ser mayor a 0');
  });

  it('detecta precio de venta inválido', () => {
    const venta = {
      cantidad: 10,
      precioVenta: -50,
      costoUnidad: 60,
    };

    const resultado = validarVenta(venta);
    expect(resultado.valido).toBe(false);
    expect(resultado.errores).toContain('Precio de venta debe ser positivo');
  });

  it('detecta cuando precio < costo (pérdida)', () => {
    const venta = {
      cantidad: 10,
      precioVenta: 50,
      costoUnidad: 60,
    };

    const resultado = validarVenta(venta);
    expect(resultado.valido).toBe(false);
    expect(resultado.errores).toContain('Precio de venta menor al costo');
  });

  it('detecta múltiples errores', () => {
    const venta = {
      cantidad: -10,
      precioVenta: -50,
      costoUnidad: 60,
    };

    const resultado = validarVenta(venta);
    expect(resultado.valido).toBe(false);
    expect(resultado.errores.length).toBeGreaterThan(1);
  });
});

// ============================================================================
// TESTS DE KPIs
// ============================================================================

describe('calcularKPIsVentas', () => {
  it('calcula KPIs correctamente', () => {
    const ventas = [
      { totalVenta: 1000, totalUtilidades: 300, cantidad: 10 },
      { totalVenta: 2000, totalUtilidades: 500, cantidad: 20 },
      { totalVenta: 1500, totalUtilidades: 400, cantidad: 15 },
    ];

    const kpis = calcularKPIsVentas(ventas);

    expect(kpis.totalVentas).toBe(4500);
    expect(kpis.totalUtilidades).toBe(1200);
    expect(kpis.margenPromedio).toBeCloseTo(26.67, 2); // 1200/4500 * 100
    expect(kpis.ticketPromedio).toBe(1500); // 4500/3
    expect(kpis.unidadesVendidas).toBe(45);
  });

  it('retorna 0s cuando no hay ventas', () => {
    const kpis = calcularKPIsVentas([]);

    expect(kpis.totalVentas).toBe(0);
    expect(kpis.totalUtilidades).toBe(0);
    expect(kpis.margenPromedio).toBe(0);
    expect(kpis.ticketPromedio).toBe(0);
  });

  it('maneja una sola venta', () => {
    const ventas = [{ totalVenta: 1000, totalUtilidades: 300, cantidad: 10 }];

    const kpis = calcularKPIsVentas(ventas);

    expect(kpis.totalVentas).toBe(1000);
    expect(kpis.ticketPromedio).toBe(1000);
  });
});

// ============================================================================
// TESTS DE CONVERSIÓN DE MONEDA
// ============================================================================

describe('usdToMxn', () => {
  it('convierte USD a MXN correctamente', () => {
    const resultado = usdToMxn(100, 20);
    expect(resultado).toBe(2000);
  });

  it('retorna 0 cuando USD es 0', () => {
    const resultado = usdToMxn(0, 20);
    expect(resultado).toBe(0);
  });

  it('maneja decimales', () => {
    const resultado = usdToMxn(100.5, 18.75);
    expect(resultado).toBeCloseTo(1884.375, 2);
  });
});

describe('mxnToUsd', () => {
  it('convierte MXN a USD correctamente', () => {
    const resultado = mxnToUsd(2000, 20);
    expect(resultado).toBe(100);
  });

  it('retorna 0 cuando MXN es 0', () => {
    const resultado = mxnToUsd(0, 20);
    expect(resultado).toBe(0);
  });

  it('maneja decimales', () => {
    const resultado = mxnToUsd(1884.375, 18.75);
    expect(resultado).toBeCloseTo(100.5, 2);
  });
});

describe('redondear', () => {
  it('redondea a 2 decimales', () => {
    expect(redondear(10.12345)).toBe(10.12);
    expect(redondear(10.999)).toBe(11.0);
    expect(redondear(10.555)).toBe(10.56);
  });

  it('maneja números enteros', () => {
    expect(redondear(100)).toBe(100);
  });

  it('maneja negativos', () => {
    expect(redondear(-10.567)).toBe(-10.57);
  });
});

// ============================================================================
// TESTS DE CASOS EXTREMOS (EDGE CASES)
// ============================================================================

describe('Edge Cases y Validaciones', () => {
  it('maneja números muy grandes sin overflow', () => {
    const ingreso = calcularIngresoVenta(1000000, 999.99);
    expect(ingreso).toBe(999990000);
  });

  it('maneja números muy pequeños correctamente', () => {
    const ingreso = calcularIngresoVenta(0.001, 0.001);
    expect(ingreso).toBeCloseTo(0.000001, 6);
  });

  it('maneja NaN correctamente', () => {
    const resultado = calcularIngresoVenta(NaN, 50);
    expect(isNaN(resultado)).toBe(true);
  });

  it('maneja undefined como 0', () => {
    const resultado = calcularIngresoVenta(undefined, 50);
    expect(isNaN(resultado)).toBe(true);
  });

  it('maneja Infinity correctamente', () => {
    const resultado = calcularIngresoVenta(Infinity, 50);
    expect(resultado).toBe(Infinity);
  });
});

// ============================================================================
// TESTS DE INTEGRACIÓN (FLUJO COMPLETO)
// ============================================================================

describe('Flujo Completo de Venta', () => {
  it('calcula todos los valores de una venta desde cero', () => {
    // Datos de entrada
    const cantidad = 100;
    const precioVenta = 50; // USD
    const costoUnidad = 30; // USD
    const tipoCambio = 18;
    const aplicaFlete = true;

    // Paso 1: Calcular ingreso
    const ingreso = calcularIngresoVenta(cantidad, precioVenta);
    expect(ingreso).toBe(5000);

    // Paso 2: Calcular costo Bóveda Monte
    const costoBovedaMonte = calcularCostoBovedaMonte(cantidad, costoUnidad);
    expect(costoBovedaMonte).toBe(3000);

    // Paso 3: Calcular flete
    const costoFlete = calcularCostoFlete(cantidad, tipoCambio, aplicaFlete);
    expect(costoFlete).toBeCloseTo(2777.78, 2);

    // Paso 4: Calcular utilidad neta
    const utilidad = calcularUtilidadNeta(ingreso, costoBovedaMonte, costoFlete);
    expect(utilidad).toBeCloseTo(-777.78, 2); // Pérdida

    // Paso 5: Calcular margen
    const margen = calcularMargen(utilidad, ingreso);
    expect(margen).toBeCloseTo(-15.56, 2);

    // Paso 6: Distribuir utilidad (aunque sea negativa)
    const distribucion = distribuirUtilidad(utilidad);
    expect(distribucion.totalDistribuido).toBeCloseTo(-777.78, 2);
  });

  it('valida fórmula PV = FL + BM + UT', () => {
    const cantidad = 100;
    const precioVenta = 50;
    const costoUnidad = 25;
    const tipoCambio = 20;
    const aplicaFlete = true;

    const pv = calcularIngresoVenta(cantidad, precioVenta); // 5000
    const bm = calcularCostoBovedaMonte(cantidad, costoUnidad); // 2500
    const fl = calcularCostoFlete(cantidad, tipoCambio, aplicaFlete); // 2500
    const ut = calcularUtilidadNeta(pv, bm, fl); // 0

    // PV = FL + BM + UT
    const suma = fl + bm + ut;
    expect(Math.abs(pv - suma)).toBeLessThan(0.01);
  });
});
