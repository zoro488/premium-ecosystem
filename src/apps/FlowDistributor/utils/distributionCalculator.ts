/**
 * 📊 DISTRIBUTION CALCULATOR - FlowDistributor Supreme 2025
 * Lógica de distribución de ganancias entre 8 bóvedas
 *
 * REGLA DE ORO:
 * - 30% de la ganancia → Bóveda Monte (BM)
 * - 70% restante → Distribuido entre otras bóvedas según porcentajes
 */

import type { BankCode, Sale } from '../types';
import { DISTRIBUTION_RULES } from '../constants';

export interface DistributionResult {
  totalProfit: number;
  distributions: Record<BankCode, number>;
  breakdown: {
    saleAmount: number;
    costAmount: number;
    profit: number;
    bovedaMonteAmount: number; // 30%
    remainingAmount: number; // 70%
  };
}

/**
 * Calcula la distribución de una venta entre las 8 bóvedas
 */
export const calculateSaleDistribution = (sale: {
  totalAmountUSD: number;
  totalCostUSD?: number;
  quantity: number;
  pricePerUnitUSD: number;
  costPerUnitUSD?: number;
}): DistributionResult => {
  // Calcular costo si no está provisto
  const costAmount = sale.totalCostUSD || (sale.costPerUnitUSD || 0) * sale.quantity;

  // Calcular ganancia
  const profit = sale.totalAmountUSD - costAmount;

  // 30% a Bóveda Monte
  const bovedaMonteAmount = profit * (DISTRIBUTION_RULES.BOVEDA_MONTE_PERCENTAGE / 100);

  // 70% restante para distribuir
  const remainingAmount = profit * (DISTRIBUTION_RULES.REMAINING_PERCENTAGE / 100);

  // Distribuir el 70% entre las demás bóvedas
  const distributions: Record<BankCode, number> = {
    BM: bovedaMonteAmount,
    BS: remainingAmount * DISTRIBUTION_RULES.DISTRIBUTION_MAP.BS,
    AZ: remainingAmount * DISTRIBUTION_RULES.DISTRIBUTION_MAP.AZ,
    UT: remainingAmount * DISTRIBUTION_RULES.DISTRIBUTION_MAP.UT,
    FL: remainingAmount * DISTRIBUTION_RULES.DISTRIBUTION_MAP.FL,
    LF: remainingAmount * DISTRIBUTION_RULES.DISTRIBUTION_MAP.LF,
    PR: remainingAmount * DISTRIBUTION_RULES.DISTRIBUTION_MAP.PR,
    CL: 0, // Clientes no recibe distribución automática
  };

  return {
    totalProfit: profit,
    distributions,
    breakdown: {
      saleAmount: sale.totalAmountUSD,
      costAmount,
      profit,
      bovedaMonteAmount,
      remainingAmount,
    },
  };
};

/**
 * Calcula distribución para múltiples ventas
 */
export const calculateBatchDistribution = (sales: Array<{
  totalAmountUSD: number;
  totalCostUSD?: number;
  quantity: number;
  pricePerUnitUSD: number;
  costPerUnitUSD?: number;
}>): DistributionResult => {
  const totalDistribution: Record<BankCode, number> = {
    BM: 0,
    BS: 0,
    AZ: 0,
    UT: 0,
    FL: 0,
    LF: 0,
    PR: 0,
    CL: 0,
  };

  let totalProfit = 0;
  let totalSaleAmount = 0;
  let totalCostAmount = 0;

  // Sumar distribuciones de todas las ventas
  sales.forEach(sale => {
    const distribution = calculateSaleDistribution(sale);
    totalProfit += distribution.totalProfit;
    totalSaleAmount += sale.totalAmountUSD;
    totalCostAmount += distribution.breakdown.costAmount;

    // Sumar a cada bóveda
    (Object.keys(distribution.distributions) as BankCode[]).forEach(bankCode => {
      totalDistribution[bankCode] += distribution.distributions[bankCode];
    });
  });

  return {
    totalProfit,
    distributions: totalDistribution,
    breakdown: {
      saleAmount: totalSaleAmount,
      costAmount: totalCostAmount,
      profit: totalProfit,
      bovedaMonteAmount: totalDistribution.BM,
      remainingAmount: totalProfit - totalDistribution.BM,
    },
  };
};

/**
 * Calcula el margen de ganancia
 */
export const calculateMargin = (salePrice: number, cost: number): {
  marginUSD: number;
  marginPercentage: number;
} => {
  const marginUSD = salePrice - cost;
  const marginPercentage = cost > 0 ? (marginUSD / cost) * 100 : 0;

  return {
    marginUSD,
    marginPercentage,
  };
};

/**
 * Calcula el margen por unidad
 */
export const calculateUnitMargin = (
  pricePerUnit: number,
  costPerUnit: number,
  quantity: number
): {
  unitMarginUSD: number;
  unitMarginPercentage: number;
  totalMarginUSD: number;
} => {
  const unitMargin = calculateMargin(pricePerUnit, costPerUnit);

  return {
    unitMarginUSD: unitMargin.marginUSD,
    unitMarginPercentage: unitMargin.marginPercentage,
    totalMarginUSD: unitMargin.marginUSD * quantity,
  };
};

/**
 * Verifica si una distribución es válida (suma 100%)
 */
export const validateDistribution = (distributions: Record<BankCode, number>): {
  isValid: boolean;
  total: number;
  errors: string[];
} => {
  const errors: string[] = [];

  // Sumar todas las distribuciones
  const total = Object.values(distributions).reduce((sum, amount) => sum + amount, 0);

  // Verificar montos negativos
  Object.entries(distributions).forEach(([bank, amount]) => {
    if (amount < 0) {
      errors.push(`${bank} tiene monto negativo: ${amount}`);
    }
  });

  return {
    isValid: errors.length === 0,
    total,
    errors,
  };
};

/**
 * Recalcula distribución si hay ajustes manuales
 */
export const recalculateDistribution = (
  baseDistribution: DistributionResult,
  adjustments: Partial<Record<BankCode, number>>
): DistributionResult => {
  const newDistributions = { ...baseDistribution.distributions };

  // Aplicar ajustes
  Object.entries(adjustments).forEach(([bankCode, amount]) => {
    if (amount !== undefined) {
      newDistributions[bankCode as BankCode] = amount;
    }
  });

  // Recalcular total
  const newTotal = Object.values(newDistributions).reduce((sum, amount) => sum + amount, 0);

  return {
    ...baseDistribution,
    totalProfit: newTotal,
    distributions: newDistributions,
  };
};

/**
 * Obtiene el porcentaje de distribución para una bóveda
 */
export const getBankDistributionPercentage = (bankCode: BankCode, totalProfit: number): number => {
  if (bankCode === 'BM') {
    return DISTRIBUTION_RULES.BOVEDA_MONTE_PERCENTAGE;
  }

  if (bankCode === 'CL') {
    return 0; // Clientes no recibe distribución
  }

  // Para las demás, calcular del 70% restante
  const remainingPercentage = DISTRIBUTION_RULES.REMAINING_PERCENTAGE;
  const bankShare = DISTRIBUTION_RULES.DISTRIBUTION_MAP[bankCode as keyof typeof DISTRIBUTION_RULES.DISTRIBUTION_MAP];

  return remainingPercentage * (bankShare || 0);
};

/**
 * Simula una venta con diferentes márgenes
 */
export const simulateSaleScenarios = (basePrice: number, quantity: number): Array<{
  margin: number;
  cost: number;
  profit: number;
  distribution: DistributionResult;
}> => {
  const margins = [20, 30, 40, 50, 60]; // Diferentes márgenes de ganancia

  return margins.map(marginPercentage => {
    // Calcular costo basado en margen deseado
    // Si margen = 30%, entonces costo = precio / 1.30
    const cost = basePrice / (1 + marginPercentage / 100);
    const profit = basePrice - cost;

    const distribution = calculateSaleDistribution({
      totalAmountUSD: basePrice * quantity,
      totalCostUSD: cost * quantity,
      quantity,
      pricePerUnitUSD: basePrice,
      costPerUnitUSD: cost,
    });

    return {
      margin: marginPercentage,
      cost,
      profit,
      distribution,
    };
  });
};

export default {
  calculateSaleDistribution,
  calculateBatchDistribution,
  calculateMargin,
  calculateUnitMargin,
  validateDistribution,
  recalculateDistribution,
  getBankDistributionPercentage,
  simulateSaleScenarios,
};
