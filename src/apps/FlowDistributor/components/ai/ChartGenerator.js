/**
 * 📈 CHART GENERATOR - GENERADOR DE GRÁFICOS DINÁMICOS
 * =====================================================
 *
 * Genera configuraciones de gráficos para Recharts basadas en datos y tipo
 * Soporta: line, bar, pie, area, radar, scatter
 */
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

/**
 * Generador de configuraciones de gráficos
 */
export class ChartGenerator {
  /**
   * Genera gráfico de líneas para tendencias
   */
  static generateLineChart(data, options = {}) {
    const { xKey = 'date', yKey = 'value', title = 'Tendencia', color = '#0ea5e9' } = options;

    return {
      type: 'line',
      title,
      data: this.prepareTimeSeriesData(data, xKey, yKey),
      config: {
        xAxis: { dataKey: xKey, label: 'Fecha' },
        yAxis: { label: 'Valor' },
        lines: [
          {
            dataKey: yKey,
            stroke: color,
            strokeWidth: 2,
            dot: { r: 4 },
            activeDot: { r: 6 },
          },
        ],
      },
    };
  }

  /**
   * Genera gráfico de barras para comparaciones
   */
  static generateBarChart(data, options = {}) {
    const { xKey = 'name', yKey = 'value', title = 'Comparación', color = '#10b981' } = options;

    return {
      type: 'bar',
      title,
      data: this.prepareBarData(data, xKey, yKey),
      config: {
        xAxis: { dataKey: xKey },
        yAxis: { label: 'Valor' },
        bars: [
          {
            dataKey: yKey,
            fill: color,
            radius: [8, 8, 0, 0],
          },
        ],
      },
    };
  }

  /**
   * Genera gráfico de pastel para distribuciones
   */
  static generatePieChart(data, options = {}) {
    const {
      nameKey = 'name',
      valueKey = 'value',
      title = 'Distribución',
      colors = ['#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'],
    } = options;

    const preparedData = this.preparePieData(data, nameKey, valueKey);

    return {
      type: 'pie',
      title,
      data: preparedData.map((item, index) => ({
        ...item,
        fill: colors[index % colors.length],
      })),
      config: {
        innerRadius: 0,
        outerRadius: 80,
        paddingAngle: 2,
        label: true,
      },
    };
  }

  /**
   * Genera gráfico de área para volúmenes
   */
  static generateAreaChart(data, options = {}) {
    const { xKey = 'date', yKey = 'value', title = 'Volumen', color = '#8b5cf6' } = options;

    return {
      type: 'area',
      title,
      data: this.prepareTimeSeriesData(data, xKey, yKey),
      config: {
        xAxis: { dataKey: xKey },
        yAxis: { label: 'Valor' },
        areas: [
          {
            dataKey: yKey,
            stroke: color,
            fill: color,
            fillOpacity: 0.3,
            strokeWidth: 2,
          },
        ],
      },
    };
  }

  /**
   * Genera gráfico combinado (línea + barra)
   */
  static generateComposedChart(data, options = {}) {
    const {
      xKey = 'date',
      lineKey = 'revenue',
      barKey = 'expenses',
      title = 'Ingresos vs Gastos',
    } = options;

    return {
      type: 'composed',
      title,
      data: this.prepareComposedData(data, xKey, lineKey, barKey),
      config: {
        xAxis: { dataKey: xKey },
        yAxis: { label: 'Monto ($)' },
        lines: [
          {
            dataKey: lineKey,
            stroke: '#10b981',
            strokeWidth: 2,
            name: 'Ingresos',
          },
        ],
        bars: [
          {
            dataKey: barKey,
            fill: '#ef4444',
            name: 'Gastos',
          },
        ],
      },
    };
  }

  /**
   * Genera múltiples gráficos para dashboard
   */
  static generateDashboardCharts(data) {
    const charts = [];

    // Ventas por día (últimos 30 días)
    if (data.ventas && data.ventas.length > 0) {
      charts.push(
        this.generateLineChart(data.ventas, {
          xKey: 'fecha',
          yKey: 'totalVenta',
          title: 'Ventas Diarias',
          color: '#0ea5e9',
        })
      );

      // Top clientes
      const ventasPorCliente = this.groupByField(data.ventas, 'cliente', 'totalVenta');
      charts.push(
        this.generateBarChart(ventasPorCliente.slice(0, 10), {
          xKey: 'name',
          yKey: 'value',
          title: 'Top 10 Clientes',
          color: '#10b981',
        })
      );
    }

    // Distribución de gastos
    if (data.compras && data.compras.length > 0) {
      const comprasPorDistribuidor = this.groupByField(data.compras, 'distribuidor', 'costoTotal');
      charts.push(
        this.generatePieChart(comprasPorDistribuidor, {
          nameKey: 'name',
          valueKey: 'value',
          title: 'Gastos por Distribuidor',
        })
      );
    }

    // Ingresos vs Gastos
    if (data.ventas && data.compras) {
      const combined = this.combineIncomeExpenses(data.ventas, data.compras);
      charts.push(
        this.generateComposedChart(combined, {
          xKey: 'date',
          lineKey: 'ingresos',
          barKey: 'gastos',
          title: 'Análisis Financiero',
        })
      );
    }

    return charts;
  }

  // ========================================
  // UTILIDADES PRIVADAS
  // ========================================

  static prepareTimeSeriesData(data, xKey, yKey) {
    if (!Array.isArray(data)) return [];

    return data
      .map((item) => ({
        [xKey]: this.formatDate(item[xKey] || item.fecha),
        [yKey]: Number(item[yKey]) || 0,
      }))
      .sort((a, b) => new Date(a[xKey]) - new Date(b[xKey]));
  }

  static prepareBarData(data, xKey, yKey) {
    if (!Array.isArray(data)) return [];

    return data
      .map((item) => ({
        [xKey]: item[xKey] || item.name || 'Sin nombre',
        [yKey]: Number(item[yKey]) || 0,
      }))
      .sort((a, b) => b[yKey] - a[yKey]); // Ordenar descendente
  }

  static preparePieData(data, nameKey, valueKey) {
    if (!Array.isArray(data)) return [];

    return data
      .map((item) => ({
        name: item[nameKey] || item.name || 'Sin nombre',
        value: Number(item[valueKey]) || 0,
      }))
      .filter((item) => item.value > 0)
      .sort((a, b) => b.value - a.value);
  }

  static prepareComposedData(data, xKey, lineKey, barKey) {
    if (!Array.isArray(data)) return [];

    return data.map((item) => ({
      [xKey]: this.formatDate(item[xKey] || item.fecha),
      [lineKey]: Number(item[lineKey]) || 0,
      [barKey]: Number(item[barKey]) || 0,
    }));
  }

  static groupByField(items, field, valueField) {
    const grouped = {};
    items.forEach((item) => {
      const key = item[field] || 'Sin especificar';
      grouped[key] = (grouped[key] || 0) + (Number(item[valueField]) || 0);
    });

    return Object.entries(grouped).map(([name, value]) => ({
      name,
      value,
    }));
  }

  static combineIncomeExpenses(ventas, compras) {
    const combined = {};

    // Agrupar ingresos por fecha
    ventas.forEach((venta) => {
      const date = this.formatDate(venta.fecha);
      if (!combined[date]) {
        combined[date] = { date, ingresos: 0, gastos: 0 };
      }
      combined[date].ingresos += Number(venta.totalVenta) || 0;
    });

    // Agrupar gastos por fecha
    compras.forEach((compra) => {
      const date = this.formatDate(compra.fecha);
      if (!combined[date]) {
        combined[date] = { date, ingresos: 0, gastos: 0 };
      }
      combined[date].gastos += Number(compra.costoTotal) || 0;
    });

    return Object.values(combined).sort((a, b) => new Date(a.date) - new Date(b.date));
  }

  static formatDate(dateString) {
    try {
      const date = new Date(dateString);
      return format(date, 'dd/MM', { locale: es });
    } catch {
      return dateString;
    }
  }
}

export default ChartGenerator;
