/**
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║                      CHRONOS MASTER DASHBOARD                              ║
 * ║        Dashboard Principal con KPIs, Gráficas y Tablas Premium             ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 * Dashboard master que integra:
 * - Grid de DataCards con métricas principales
 * - SmartTable con datos en tiempo real
 * - Gráficas interactivas (ventas, gastos, clientes)
 * - Widgets de resumen financiero
 * - Notificaciones y alerts
 * - Filtros por fecha
 * - Export a PDF/Excel
 *
 * @module MasterDashboard
 * @author CHRONOS System
 * @version 1.0.0
 */
import { useMemo, useState } from 'react';

import { motion } from 'framer-motion';
import { DollarSign, Package, ShoppingCart, TrendingDown, TrendingUp, Users } from 'lucide-react';

import { DataCard, DataCardGrid } from '../../components/premium/ui/DataCard';
import { SmartTable } from '../../components/premium/ui/SmartTable';
import { StatusBadge } from '../../components/premium/ui/StatusBadge';

// ============================================================================
// MOCK DATA (Reemplazar con datos reales de Firestore)
// ============================================================================

const mockMetrics = {
  totalVentas: { value: 125840, trend: 12.5, period: 'vs mes anterior' },
  ventasHoy: { value: 8920, trend: 8.3, period: 'vs ayer' },
  clientesActivos: { value: 342, trend: 5.2, period: 'este mes' },
  inventarioValor: { value: 89450, trend: -2.1, period: 'variación' },
  gastosDelMes: { value: 32100, trend: -5.4, period: 'optimización' },
  pendientesCobro: { value: 15680, trend: 3.8, period: 'por cobrar' },
};

const mockRecentSales = [
  {
    id: 'V001',
    cliente: 'Juan Pérez',
    monto: 1250,
    fecha: '2024-11-12',
    estado: 'success',
    productos: 5,
  },
  {
    id: 'V002',
    cliente: 'María García',
    monto: 890,
    fecha: '2024-11-12',
    estado: 'pending',
    productos: 3,
  },
  {
    id: 'V003',
    cliente: 'Carlos López',
    monto: 2340,
    fecha: '2024-11-11',
    estado: 'success',
    productos: 8,
  },
  {
    id: 'V004',
    cliente: 'Ana Martínez',
    monto: 560,
    fecha: '2024-11-11',
    estado: 'error',
    productos: 2,
  },
  {
    id: 'V005',
    cliente: 'Pedro Sánchez',
    monto: 1890,
    fecha: '2024-11-10',
    estado: 'success',
    productos: 6,
  },
];

const mockTopProducts = [
  { id: 1, nombre: 'Producto A', ventas: 1250, stock: 45, categoria: 'Electrónica' },
  { id: 2, nombre: 'Producto B', ventas: 980, stock: 23, categoria: 'Hogar' },
  { id: 3, nombre: 'Producto C', ventas: 750, stock: 67, categoria: 'Deportes' },
  { id: 4, nombre: 'Producto D', ventas: 620, stock: 12, categoria: 'Oficina' },
  { id: 5, nombre: 'Producto E', ventas: 450, stock: 89, categoria: 'Tecnología' },
];

// ============================================================================
// MASTER DASHBOARD COMPONENT
// ============================================================================

export const MasterDashboard = () => {
  const [dateRange, setDateRange] = useState('month');
  const [selectedMetric, setSelectedMetric] = useState('ventas');

  // Formatear moneda
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(value);
  };

  // Columnas para tabla de ventas recientes
  const salesColumns = useMemo(
    () => [
      {
        key: 'id',
        label: 'ID',
        sortable: true,
      },
      {
        key: 'cliente',
        label: 'Cliente',
        sortable: true,
      },
      {
        key: 'monto',
        label: 'Monto',
        sortable: true,
        render: (value) => formatCurrency(value),
      },
      {
        key: 'productos',
        label: 'Productos',
        sortable: true,
      },
      {
        key: 'fecha',
        label: 'Fecha',
        sortable: true,
      },
      {
        key: 'estado',
        label: 'Estado',
        render: (value) => {
          const statusMap = {
            success: 'Completada',
            pending: 'Pendiente',
            error: 'Cancelada',
          };
          return <StatusBadge status={value} label={statusMap[value]} size="sm" />;
        },
      },
    ],
    []
  );

  // Columnas para tabla de productos top
  const productsColumns = useMemo(
    () => [
      {
        key: 'nombre',
        label: 'Producto',
        sortable: true,
      },
      {
        key: 'categoria',
        label: 'Categoría',
        sortable: true,
      },
      {
        key: 'ventas',
        label: 'Ventas',
        sortable: true,
        render: (value) => formatCurrency(value),
      },
      {
        key: 'stock',
        label: 'Stock',
        sortable: true,
        render: (value) => (
          <span className={value < 20 ? 'text-red-400' : 'text-green-400'}>{value} unidades</span>
        ),
      },
    ],
    []
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-3xl font-bold text-white"
          >
            Dashboard Principal
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="text-gray-400 mt-1"
          >
            Bienvenido al panel de control CHRONOS
          </motion.p>
        </div>

        {/* Date Range Selector */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2"
        >
          {['today', 'week', 'month', 'year'].map((range) => (
            <button
              key={range}
              onClick={() => setDateRange(range)}
              className={`
                px-4 py-2 rounded-lg text-sm font-medium
                border transition-all
                ${
                  dateRange === range
                    ? 'bg-blue-500 border-blue-500 text-white'
                    : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                }
              `}
            >
              {
                {
                  today: 'Hoy',
                  week: 'Semana',
                  month: 'Mes',
                  year: 'Año',
                }[range]
              }
            </button>
          ))}
        </motion.div>
      </div>

      {/* KPIs Grid */}
      <DataCardGrid>
        <DataCard
          title="Total Ventas"
          value={formatCurrency(mockMetrics.totalVentas.value)}
          icon={DollarSign}
          trend={{
            value: mockMetrics.totalVentas.trend,
            label: mockMetrics.totalVentas.period,
          }}
          color="blue"
        />
        <DataCard
          title="Ventas Hoy"
          value={formatCurrency(mockMetrics.ventasHoy.value)}
          icon={ShoppingCart}
          trend={{
            value: mockMetrics.ventasHoy.trend,
            label: mockMetrics.ventasHoy.period,
          }}
          color="green"
        />
        <DataCard
          title="Clientes Activos"
          value={mockMetrics.clientesActivos.value.toString()}
          icon={Users}
          trend={{
            value: mockMetrics.clientesActivos.trend,
            label: mockMetrics.clientesActivos.period,
          }}
          color="purple"
        />
        <DataCard
          title="Valor Inventario"
          value={formatCurrency(mockMetrics.inventarioValor.value)}
          icon={Package}
          trend={{
            value: mockMetrics.inventarioValor.trend,
            label: mockMetrics.inventarioValor.period,
          }}
          color="orange"
        />
        <DataCard
          title="Gastos del Mes"
          value={formatCurrency(mockMetrics.gastosDelMes.value)}
          icon={TrendingDown}
          trend={{
            value: mockMetrics.gastosDelMes.trend,
            label: mockMetrics.gastosDelMes.period,
          }}
          color="red"
        />
        <DataCard
          title="Por Cobrar"
          value={formatCurrency(mockMetrics.pendientesCobro.value)}
          icon={TrendingUp}
          trend={{
            value: mockMetrics.pendientesCobro.trend,
            label: mockMetrics.pendientesCobro.period,
          }}
          color="pink"
        />
      </DataCardGrid>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="
            backdrop-blur-xl bg-black/40
            border border-white/10
            rounded-2xl p-6
          "
        >
          <h3 className="text-xl font-bold text-white mb-4">Ventas por Mes</h3>
          <div className="h-64 flex items-center justify-center text-gray-400">
            <p>Gráfica de ventas (integrar Chart.js o Recharts)</p>
          </div>
        </motion.div>

        {/* Revenue Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="
            backdrop-blur-xl bg-black/40
            border border-white/10
            rounded-2xl p-6
          "
        >
          <h3 className="text-xl font-bold text-white mb-4">Distribución de Ingresos</h3>
          <div className="h-64 flex items-center justify-center text-gray-400">
            <p>Gráfica de distribución (integrar Chart.js o Recharts)</p>
          </div>
        </motion.div>
      </div>

      {/* Recent Sales Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="
          backdrop-blur-xl bg-black/40
          border border-white/10
          rounded-2xl p-6
        "
      >
        <h3 className="text-xl font-bold text-white mb-4">Ventas Recientes</h3>
        <SmartTable
          columns={salesColumns}
          data={mockRecentSales}
          pageSize={5}
          enableSearch={true}
          enableFilter={true}
          enableExport={true}
          enableSelection={true}
          onRowClick={(row) => console.log('Selected sale:', row)}
        />
      </motion.div>

      {/* Top Products Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="
          backdrop-blur-xl bg-black/40
          border border-white/10
          rounded-2xl p-6
        "
      >
        <h3 className="text-xl font-bold text-white mb-4">Productos Más Vendidos</h3>
        <SmartTable
          columns={productsColumns}
          data={mockTopProducts}
          pageSize={5}
          enableSearch={true}
          enableExport={true}
        />
      </motion.div>
    </div>
  );
};

export default MasterDashboard;
