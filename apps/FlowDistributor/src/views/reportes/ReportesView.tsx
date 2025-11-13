import { useMemo, useState } from 'react';

import { motion } from 'framer-motion';
import { BarChart3, DollarSign, Package, ShoppingCart, TrendingUp, Users } from 'lucide-react';

import { AdvancedChart } from '@/components/charts/AdvancedChart';
import { ChronosCard } from '@/components/chronos-ui/ChronosCard';
import { ChronosKPI } from '@/components/chronos-ui/ChronosKPI';
import { ExportButton } from '@/components/export';
import { calcularCapitalTotal, useChronosData } from '@/hooks/useChronosData';

/**
 * 📊 REPORTES VIEW
 * Dashboard de analíticas avanzadas y reportes
 */
export default function ReportesView() {
  const { ventas, clientes, bancos, productos } = useChronosData();

  const [dateRange, setDateRange] = useState<'semana' | 'mes' | 'trimestre' | 'año'>('mes');

  // Calcular métricas generales
  const metricas = useMemo(() => {
    const capitalTotal = calcularCapitalTotal(bancos);
    const ventasTotales = ventas.reduce((sum, v) => sum + v.precioVenta, 0);
    const clientesActivos = clientes.filter((c) => (c.adeudo || 0) === 0).length;
    const productosStock = productos.reduce((sum, p) => sum + p.existencia, 0);

    return {
      capitalTotal,
      ventasTotales,
      clientesActivos,
      productosStock,
    };
  }, [bancos, ventas, clientes, productos]);

  // Datos para gráfica de ventas por mes
  const ventasPorMes = useMemo(() => {
    const meses = [
      'Ene',
      'Feb',
      'Mar',
      'Abr',
      'May',
      'Jun',
      'Jul',
      'Ago',
      'Sep',
      'Oct',
      'Nov',
      'Dic',
    ];
    const ventasPorMesMap = new Map<number, number>();

    ventas.forEach((venta) => {
      const fecha = typeof venta.fecha === 'string' ? new Date(venta.fecha) : venta.fecha;
      const mes = fecha.getMonth();
      ventasPorMesMap.set(mes, (ventasPorMesMap.get(mes) || 0) + venta.precioVenta);
    });

    return meses.map((mes, idx) => ({
      mes,
      ventas: ventasPorMesMap.get(idx) || 0,
    }));
  }, [ventas]);

  // Datos para top productos más vendidos
  const topProductos = useMemo(() => {
    const productoVentas = new Map<
      string,
      { nombre: string; cantidad: number; ingresos: number }
    >();

    ventas.forEach((venta) => {
      venta.productos.forEach((vp) => {
        const producto = productos.find((p) => p.id === vp.productoId);
        if (producto) {
          const existing = productoVentas.get(vp.productoId) || {
            nombre: producto.nombre,
            cantidad: 0,
            ingresos: 0,
          };
          existing.cantidad += vp.cantidad;
          existing.ingresos += vp.cantidad * vp.precioUnitario;
          productoVentas.set(vp.productoId, existing);
        }
      });
    });

    return Array.from(productoVentas.values())
      .sort((a, b) => b.ingresos - a.ingresos)
      .slice(0, 10);
  }, [ventas, productos]);

  // Datos para ventas por estado
  const ventasPorEstado = useMemo(() => {
    const pagadas = ventas.filter((v) => v.estatus === 'Pagado').length;
    const pendientes = ventas.filter((v) => v.estatus === 'Pendiente').length;
    const total = pagadas + pendientes;

    return [
      { name: 'Pagadas', value: pagadas },
      { name: 'Pendientes', value: pendientes },
      { percentage: total > 0 ? (pagadas / total) * 100 : 0 },
    ];
  }, [ventas]);

  // Datos para Sankey: Flujo de capital entre bancos
  const sankeyData = useMemo(() => {
    return {
      nodes: bancos.map((b) => ({ name: b.nombre })),
      links: bancos.slice(0, -1).map((b, idx) => ({
        source: idx,
        target: idx + 1,
        value: Math.abs(b.capitalActual * 0.2),
      })),
    };
  }, [bancos]);

  // Datos para Gauge: Porcentaje de ventas pagadas
  const gaugeData = useMemo(() => {
    const pagadas = ventas.filter((v) => v.estatus === 'Pagado').length;
    const total = ventas.length;
    const percentage = total > 0 ? (pagadas / total) * 100 : 0;

    return [
      {
        value: percentage,
        name: 'Ventas Pagadas',
        title: { text: `${percentage.toFixed(1)}%` },
        detail: {
          valueAnimation: true,
          formatter: '{value}%',
        },
      },
    ];
  }, [ventas]);

  return (
    <div className="min-h-screen p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-4xl font-bold text-chronos-white flex items-center gap-3">
            <BarChart3 className="w-10 h-10 text-neon-cyan" />
            Reportes y Analíticas
          </h1>
          <p className="text-chronos-silver mt-2 text-lg">
            Dashboard ejecutivo con métricas avanzadas
          </p>
        </div>
        <ExportButton
          title="Reporte Ejecutivo"
          subtitle={`Período: ${dateRange.toUpperCase()} | Capital: $${metricas.capitalTotal.toLocaleString()}`}
          fileName={`reporte_ejecutivo_${Date.now()}`}
          formats={['pdf', 'excel', 'png']}
          tables={[
            {
              title: 'Top 10 Productos',
              headers: ['Producto', 'Cantidad Vendida', 'Ingresos'],
              rows: topProductos.map((p) => [
                p.nombre,
                p.cantidad.toString(),
                `$${p.ingresos.toLocaleString()}`,
              ]),
            },
            {
              title: 'Clientes con Mayor Adeudo',
              headers: ['Cliente', 'Adeudo', 'Límite Crédito', '% Utilizado'],
              rows: clientes
                .filter((c) => (c.adeudo || 0) > 0)
                .sort((a, b) => (b.adeudo || 0) - (a.adeudo || 0))
                .slice(0, 10)
                .map((c) => {
                  const porcentaje = ((c.adeudo || 0) / (c.limiteCredito || 1)) * 100;
                  return [
                    c.nombre,
                    `$${(c.adeudo || 0).toLocaleString()}`,
                    `$${(c.limiteCredito || 0).toLocaleString()}`,
                    `${porcentaje.toFixed(1)}%`,
                  ];
                }),
            },
          ]}
        />
      </motion.div>

      {/* Range Selector */}
      <div className="flex justify-end gap-2">
        {(['semana', 'mes', 'trimestre', 'año'] as const).map((rango) => (
          <button
            key={rango}
            onClick={() => setDateRange(rango)}
            className={`px-4 py-2 rounded-lg transition-colors ${
              dateRange === rango
                ? 'bg-neon-purple text-chronos-void'
                : 'bg-chronos-graphite text-chronos-silver hover:bg-chronos-smoke'
            }`}
          >
            {rango.charAt(0).toUpperCase() + rango.slice(1)}
          </button>
        ))}
      </div>

      {/* KPIs Principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <ChronosKPI
          label="Capital Total"
          value={metricas.capitalTotal}
          format="currency"
          color="cyan"
          pulse
        />
        <ChronosKPI
          label="Ventas Totales"
          value={metricas.ventasTotales}
          format="currency"
          color="green"
        />
        <ChronosKPI
          label="Clientes Activos"
          value={metricas.clientesActivos}
          format="number"
          color="purple"
        />
        <ChronosKPI
          label="Productos en Stock"
          value={metricas.productosStock}
          format="number"
          color="yellow"
        />
      </div>

      {/* Gráficas Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Ventas por Mes - Funnel Chart */}
        <ChronosCard variant="glass-metal">
          <div className="p-6">
            <h3 className="text-xl font-bold text-chronos-white mb-6 flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-neon-green" />
              Ventas por Mes (Embudo)
            </h3>
            <AdvancedChart
              type="funnel"
              data={ventasPorMes
                .sort((a, b) => b.ventas - a.ventas)
                .map((v) => ({ value: v.ventas, name: v.mes }))}
              title=""
              height={300}
              animationDelay={0}
            />
          </div>
        </ChronosCard>

        {/* Distribución de Capital - Sankey Flow */}
        <ChronosCard variant="glass-metal">
          <div className="p-6">
            <h3 className="text-xl font-bold text-chronos-white mb-6 flex items-center gap-2">
              <DollarSign className="w-6 h-6 text-neon-cyan" />
              Flujo de Capital (Sankey)
            </h3>
            <AdvancedChart
              type="sankey"
              data={sankeyData}
              title=""
              height={300}
              animationDelay={200}
            />
          </div>
        </ChronosCard>
      </div>

      {/* Gráficas Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top 10 Productos - Treemap */}
        <ChronosCard variant="glass-metal">
          <div className="p-6">
            <h3 className="text-xl font-bold text-chronos-white mb-6 flex items-center gap-2">
              <Package className="w-6 h-6 text-neon-purple" />
              Top 10 Productos (Treemap)
            </h3>
            <AdvancedChart
              type="treemap"
              data={topProductos.map((p) => ({
                name: p.nombre,
                value: p.ingresos,
              }))}
              title=""
              height={300}
              animationDelay={400}
            />
          </div>
        </ChronosCard>

        {/* Ventas por Estado - Gauge */}
        <ChronosCard variant="glass-metal">
          <div className="p-6">
            <h3 className="text-xl font-bold text-chronos-white mb-6 flex items-center gap-2">
              <ShoppingCart className="w-6 h-6 text-neon-pink" />% Ventas Pagadas (Gauge)
            </h3>
            <AdvancedChart
              type="gauge"
              data={gaugeData}
              title=""
              height={300}
              animationDelay={600}
            />
            <div className="mt-4 grid grid-cols-2 gap-4 text-center">
              <div>
                <p className="text-chronos-silver text-sm">Pagadas</p>
                <p className="text-neon-green text-xl font-bold">{ventasPorEstado[0].value}</p>
              </div>
              <div>
                <p className="text-chronos-silver text-sm">Pendientes</p>
                <p className="text-neon-yellow text-xl font-bold">{ventasPorEstado[1].value}</p>
              </div>
            </div>
          </div>
        </ChronosCard>
      </div>

      {/* Tabla de Clientes con Mayor Adeudo */}
      <ChronosCard variant="glass-metal">
        <div className="p-6">
          <h3 className="text-xl font-bold text-chronos-white mb-6 flex items-center gap-2">
            <Users className="w-6 h-6 text-neon-red" />
            Clientes con Mayor Adeudo
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-chronos-smoke">
                  <th className="text-left p-4 text-chronos-white font-medium">Cliente</th>
                  <th className="text-right p-4 text-chronos-white font-medium">Adeudo</th>
                  <th className="text-right p-4 text-chronos-white font-medium">Límite Crédito</th>
                  <th className="text-right p-4 text-chronos-white font-medium">% Utilizado</th>
                </tr>
              </thead>
              <tbody>
                {clientes
                  .filter((c) => (c.adeudo || 0) > 0)
                  .sort((a, b) => (b.adeudo || 0) - (a.adeudo || 0))
                  .slice(0, 10)
                  .map((cliente) => {
                    const porcentaje = ((cliente.adeudo || 0) / (cliente.limiteCredito || 1)) * 100;
                    return (
                      <tr key={cliente.id} className="border-b border-chronos-smoke/30">
                        <td className="p-4 text-chronos-white">{cliente.nombre}</td>
                        <td className="p-4 text-right text-neon-red font-bold">
                          ${(cliente.adeudo || 0).toLocaleString()}
                        </td>
                        <td className="p-4 text-right text-chronos-silver">
                          ${(cliente.limiteCredito || 0).toLocaleString()}
                        </td>
                        <td className="p-4 text-right">
                          <span
                            className={`font-bold ${
                              porcentaje > 80
                                ? 'text-neon-red'
                                : porcentaje > 50
                                  ? 'text-neon-yellow'
                                  : 'text-neon-green'
                            }`}
                          >
                            {porcentaje.toFixed(1)}%
                          </span>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      </ChronosCard>
    </div>
  );
}
