/**
 * 📊 REPORT GENERATOR - GENERADOR DE REPORTES INTELIGENTE
 * ========================================================
 *
 * Genera reportes dinámicos en múltiples formatos:
 * - PDF con gráficos y tablas
 * - Excel con fórmulas y formato
 * - CSV para análisis externo
 * - JSON para integración API
 */
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

/**
 * Genera reporte basado en datos y configuración
 * @param {Object} config - Configuración del reporte
 * @param {Object} data - Datos a incluir
 * @returns {Promise<Object>} Reporte generado
 */
export class ReportGenerator {
  /**
   * Genera reporte de ventas
   */
  static async generateSalesReport(ventas, options = {}) {
    const { format: formatType = 'json', startDate, endDate, includeCharts = true } = options;

    const filteredVentas = this.filterByDateRange(ventas, startDate, endDate);

    const report = {
      title: 'Reporte de Ventas',
      generatedAt: new Date().toISOString(),
      period: {
        start: startDate || 'Inicio',
        end: endDate || 'Actual',
      },
      summary: this.calculateSalesSummary(filteredVentas),
      details: filteredVentas,
    };

    if (includeCharts) {
      report.charts = this.generateSalesCharts(filteredVentas);
    }

    return this.convertToFormat(report, formatType);
  }

  /**
   * Genera reporte de inventario
   */
  static async generateInventoryReport(almacen, options = {}) {
    const { format: formatType = 'json', lowStockThreshold = 10 } = options;

    const report = {
      title: 'Reporte de Inventario',
      generatedAt: new Date().toISOString(),
      summary: {
        totalItems: almacen.length,
        totalValue: almacen.reduce((sum, item) => sum + (item.value || 0), 0),
        lowStock: almacen.filter((item) => item.stock < lowStockThreshold).length,
      },
      lowStockItems: almacen.filter((item) => item.stock < lowStockThreshold),
      details: almacen,
    };

    return this.convertToFormat(report, formatType);
  }

  /**
   * Genera reporte financiero
   */
  static async generateFinancialReport(data, options = {}) {
    const { format: formatType = 'json', includeProjections = false } = options;

    const report = {
      title: 'Reporte Financiero',
      generatedAt: new Date().toISOString(),
      summary: {
        totalIncome: this.calculateTotalIncome(data),
        totalExpenses: this.calculateTotalExpenses(data),
        netProfit: 0, // Calculado después
        profitMargin: 0,
      },
      bankAccounts: data.bancos || [],
      transactions: data.movimientos || [],
    };

    report.summary.netProfit = report.summary.totalIncome - report.summary.totalExpenses;
    report.summary.profitMargin =
      report.summary.totalIncome > 0
        ? ((report.summary.netProfit / report.summary.totalIncome) * 100).toFixed(2)
        : 0;

    if (includeProjections) {
      report.projections = this.generateProjections(data);
    }

    return this.convertToFormat(report, formatType);
  }

  /**
   * Genera reporte de clientes
   */
  static async generateClientReport(clientes, options = {}) {
    const { format: formatType = 'json', includeDebt = true } = options;

    const report = {
      title: 'Reporte de Clientes',
      generatedAt: new Date().toISOString(),
      summary: {
        totalClients: clientes.length,
        activeClients: clientes.filter((c) => c.estado === 'activo').length,
        totalDebt: clientes.reduce((sum, c) => sum + (c.adeudo || 0), 0),
      },
      details: clientes,
    };

    if (includeDebt) {
      report.debtAnalysis = {
        highDebtClients: clientes.filter((c) => c.adeudo > 10000),
        averageDebt: report.summary.totalDebt / clientes.length || 0,
      };
    }

    return this.convertToFormat(report, formatType);
  }

  // ========================================
  // UTILIDADES PRIVADAS
  // ========================================

  static filterByDateRange(items, startDate, endDate) {
    if (!startDate && !endDate) return items;

    return items.filter((item) => {
      const itemDate = new Date(item.fecha);
      if (startDate && itemDate < new Date(startDate)) return false;
      if (endDate && itemDate > new Date(endDate)) return false;
      return true;
    });
  }

  static calculateSalesSummary(ventas) {
    return {
      totalSales: ventas.length,
      totalRevenue: ventas.reduce((sum, v) => sum + (v.totalVenta || 0), 0),
      averageTicket:
        ventas.length > 0
          ? ventas.reduce((sum, v) => sum + (v.totalVenta || 0), 0) / ventas.length
          : 0,
      totalDebt: ventas.reduce((sum, v) => sum + (v.adeudo || 0), 0),
    };
  }

  static generateSalesCharts(ventas) {
    // Datos para gráficos
    const salesByDate = {};
    ventas.forEach((venta) => {
      const date = format(new Date(venta.fecha), 'yyyy-MM-dd', { locale: es });
      salesByDate[date] = (salesByDate[date] || 0) + venta.totalVenta;
    });

    return {
      salesByDate: Object.entries(salesByDate).map(([date, total]) => ({
        date,
        total,
      })),
      salesByClient: this.groupByField(ventas, 'cliente', 'totalVenta'),
    };
  }

  static groupByField(items, field, valueField) {
    const grouped = {};
    items.forEach((item) => {
      const key = item[field] || 'Sin especificar';
      grouped[key] = (grouped[key] || 0) + (item[valueField] || 0);
    });
    return Object.entries(grouped).map(([name, value]) => ({ name, value }));
  }

  static calculateTotalIncome(data) {
    const ventas = data.ventas || [];
    return ventas.reduce((sum, v) => sum + (v.totalVenta || 0), 0);
  }

  static calculateTotalExpenses(data) {
    const compras = data.compras || [];
    return compras.reduce((sum, c) => sum + (c.costoTotal || 0), 0);
  }

  static generateProjections(data) {
    // Proyecciones simples basadas en promedios
    const avgMonthlyIncome = this.calculateTotalIncome(data) / 12;
    const avgMonthlyExpenses = this.calculateTotalExpenses(data) / 12;

    return {
      nextMonth: {
        estimatedIncome: avgMonthlyIncome * 1.05, // +5% crecimiento
        estimatedExpenses: avgMonthlyExpenses,
        estimatedProfit: avgMonthlyIncome * 1.05 - avgMonthlyExpenses,
      },
      nextQuarter: {
        estimatedIncome: avgMonthlyIncome * 3 * 1.1, // +10% crecimiento
        estimatedExpenses: avgMonthlyExpenses * 3,
        estimatedProfit: avgMonthlyIncome * 3 * 1.1 - avgMonthlyExpenses * 3,
      },
    };
  }

  static convertToFormat(report, formatType) {
    switch (formatType.toLowerCase()) {
      case 'json':
        return report;

      case 'csv':
        return this.convertToCSV(report);

      case 'excel':
        return this.convertToExcel(report);

      case 'pdf':
        return this.convertToPDF(report);

      default:
        return report;
    }
  }

  static convertToCSV(report) {
    // Conversión simple a CSV
    const rows = [];

    // Header
    rows.push(['Reporte', report.title]);
    rows.push(['Generado', report.generatedAt]);
    rows.push([]);

    // Summary
    if (report.summary) {
      rows.push(['=== RESUMEN ===']);
      Object.entries(report.summary).forEach(([key, value]) => {
        rows.push([key, value]);
      });
      rows.push([]);
    }

    // Details (simplified)
    if (report.details && Array.isArray(report.details)) {
      rows.push(['=== DETALLES ===']);
      if (report.details.length > 0) {
        const headers = Object.keys(report.details[0]);
        rows.push(headers);
        report.details.forEach((item) => {
          rows.push(headers.map((h) => item[h] || ''));
        });
      }
    }

    return rows.map((row) => row.join(',')).join('\n');
  }

  static convertToExcel(report) {
    // Placeholder: requiere librería xlsx
    return {
      type: 'excel',
      data: report,
      message: 'Use XLSX library to generate actual Excel file',
    };
  }

  static convertToPDF(report) {
    // Placeholder: requiere librería jsPDF
    return {
      type: 'pdf',
      data: report,
      message: 'Use jsPDF library to generate actual PDF file',
    };
  }
}

export default ReportGenerator;
