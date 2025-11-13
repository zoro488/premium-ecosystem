// ============================================================================
// DASHBOARD MASTER - Command Center
// Vista principal con KPIs, gráficos y distribución de buckets
// ============================================================================
import { useMemo } from 'react';

import { motion } from 'framer-motion';
import { AlertCircle, Calendar, DollarSign, Package, TrendingUp } from 'lucide-react';
import {
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { ChronosCard } from '@/components/chronos-ui/ChronosCard';
import { ChronosKPI } from '@/components/chronos-ui/ChronosKPI';
import {
  calcularCapitalTotal,
  calcularDistribucionBuckets,
  useChronosData,
} from '@/hooks/useChronosData';

export function DashboardMaster() {
  const { ventas, bancos, productos, clientes, loading, error } = useChronosData();

  // KPI: Ventas de hoy
  const ventasHoy = useMemo(() => {
    const hoy = new Date();
    return ventas.filter((v) => {
      const fecha = v.fecha instanceof Date ? v.fecha : new Date(v.fecha);
      return fecha.toDateString() === hoy.toDateString();
    });
  }, [ventas]);

  const totalVentasHoy = ventasHoy.reduce((sum, v) => sum + v.precioVenta, 0);

  // KPI: Ingresos mensuales
  const ingresosMes = useMemo(() => {
    const now = new Date();
    const inicioMes = new Date(now.getFullYear(), now.getMonth(), 1);

    return ventas
      .filter((v) => {
        const fecha = v.fecha instanceof Date ? v.fecha : new Date(v.fecha);
        return fecha >= inicioMes && v.estatus === 'Pagado';
      })
      .reduce((sum, v) => sum + v.precioVenta, 0);
  }, [ventas]);

  // KPI: Capital total
  const capitalTotal = calcularCapitalTotal(bancos);

  // KPI: Alertas (productos con stock bajo)
  const alertas = productos.filter((p) => p.stockMinimo && p.existencia <= p.stockMinimo).length;

  // Chart: Flujo de efectivo últimos 7 días
  const flujoCajaData = useMemo(() => {
    const data: Array<{ fecha: string; ingresos: number; egresos: number }> = [];

    for (let i = 6; i >= 0; i--) {
      const fecha = new Date();
      fecha.setDate(fecha.getDate() - i);
      const fechaStr = fecha.toLocaleDateString('es-MX', { day: '2-digit', month: 'short' });

      const ventasDia = ventas.filter((v) => {
        const vFecha = v.fecha instanceof Date ? v.fecha : new Date(v.fecha);
        return vFecha.toDateString() === fecha.toDateString() && v.estatus === 'Pagado';
      });

      const ingresos = ventasDia.reduce((sum, v) => sum + v.precioVenta, 0);

      data.push({
        fecha: fechaStr,
        ingresos,
        egresos: 0, // TODO: Implementar con gastos
      });
    }

    return data;
  }, [ventas]);

  // Chart: Distribución de buckets (FL/BM/UT)
  const distribucionBuckets = useMemo(() => {
    const dist = calcularDistribucionBuckets(bancos);
    return [
      { name: 'Flete (FL)', value: dist.fl.monto, color: '#00d9ff' },
      { name: 'Bóveda Monte (BM)', value: dist.bm.monto, color: '#6366f1' },
      { name: 'Utilidades (UT)', value: dist.ut.monto, color: '#10b981' },
    ];
  }, [bancos]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-chronos-void flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-neon-cyan border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-chronos-silver">Cargando datos del sistema...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-chronos-void flex items-center justify-center">
        <ChronosCard variant="glass-dark" className="max-w-md">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-neon-red mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-chronos-white mb-2">Error cargando datos</h3>
            <p className="text-chronos-silver">{error.message}</p>
          </div>
        </ChronosCard>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-chronos-void p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-chronos-white mb-2">Command Center</h1>
          <p className="text-chronos-silver flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            {new Date().toLocaleDateString('es-MX', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>

        {/* KPIs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <ChronosCard>
            <ChronosKPI
              label="Ventas Hoy"
              value={totalVentasHoy}
              format="currency"
              color="cyan"
              icon={TrendingUp}
              pulse
              size="lg"
            />
          </ChronosCard>

          <ChronosCard>
            <ChronosKPI
              label="Ingresos del Mes"
              value={ingresosMes}
              format="currency"
              color="green"
              icon={DollarSign}
              size="lg"
            />
          </ChronosCard>

          <ChronosCard>
            <ChronosKPI
              label="Capital Total"
              value={capitalTotal}
              format="currency"
              color="purple"
              icon={Package}
              size="lg"
            />
          </ChronosCard>

          <ChronosCard>
            <ChronosKPI
              label="Alertas"
              value={alertas}
              format="number"
              color={alertas > 0 ? 'red' : 'green'}
              icon={AlertCircle}
              size="lg"
            />
          </ChronosCard>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Flujo de Caja */}
          <ChronosCard
            title="Flujo de Efectivo"
            subtitle="Últimos 7 días"
            icon={TrendingUp}
            variant="glass-metal"
          >
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={flujoCajaData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#404040" />
                <XAxis dataKey="fecha" stroke="#808080" style={{ fontSize: '12px' }} />
                <YAxis
                  stroke="#808080"
                  style={{ fontSize: '12px' }}
                  tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(20, 20, 20, 0.9)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px',
                    color: '#fff',
                  }}
                  formatter={(value: number) => `$${value.toLocaleString('es-MX')}`}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="ingresos"
                  stroke="#00d9ff"
                  strokeWidth={2}
                  dot={{ fill: '#00d9ff', r: 4 }}
                  activeDot={{ r: 6 }}
                  name="Ingresos"
                />
                <Line
                  type="monotone"
                  dataKey="egresos"
                  stroke="#ef4444"
                  strokeWidth={2}
                  dot={{ fill: '#ef4444', r: 4 }}
                  name="Egresos"
                />
              </LineChart>
            </ResponsiveContainer>
          </ChronosCard>

          {/* Distribución Buckets */}
          <ChronosCard
            title="Distribución de Buckets"
            subtitle="FL / BM / UT"
            icon={Package}
            variant="glass-metal"
          >
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={distribucionBuckets}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    name && percent !== undefined
                      ? `${name.split(' ')[0]}: ${(percent * 100).toFixed(0)}%`
                      : ''
                  }
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {distribucionBuckets.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(20, 20, 20, 0.9)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px',
                    color: '#fff',
                  }}
                  formatter={(value: number) => `$${value.toLocaleString('es-MX')}`}
                />
              </PieChart>
            </ResponsiveContainer>
          </ChronosCard>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ChronosCard title="Clientes Activos" variant="glass-dark">
            <div className="text-3xl font-bold text-neon-cyan">
              {clientes.filter((c) => c.activo).length}
            </div>
            <p className="text-chronos-silver text-sm mt-2">Total: {clientes.length} registrados</p>
          </ChronosCard>

          <ChronosCard title="Productos en Stock" variant="glass-dark">
            <div className="text-3xl font-bold text-neon-green">
              {productos.filter((p) => p.activo && p.existencia > 0).length}
            </div>
            <p className="text-chronos-silver text-sm mt-2">Total: {productos.length} productos</p>
          </ChronosCard>

          <ChronosCard title="Bancos Operativos" variant="glass-dark">
            <div className="text-3xl font-bold text-neon-purple">
              {bancos.filter((b) => b.activo).length}
            </div>
            <p className="text-chronos-silver text-sm mt-2">
              Capital total: ${capitalTotal.toLocaleString('es-MX')}
            </p>
          </ChronosCard>
        </div>
      </motion.div>
    </div>
  );
}

export default DashboardMaster;
