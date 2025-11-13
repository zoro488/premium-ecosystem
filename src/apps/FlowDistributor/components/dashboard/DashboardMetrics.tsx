/**
 * DashboardMetrics - Componente de métricas del dashboard
 * @module FlowDistributor/components/dashboard
 */

import {
  AlertCircle,
  CheckCircle,
  DollarSign,
  Package,
  ShoppingCart,
  TrendingDown,
  TrendingUp,
  Users,
} from 'lucide-react';
import type React from 'react';
import { useMemo } from 'react';

import { useClientes } from '../../hooks/useClientes';
import { useOrdenesCompra } from '../../hooks/useOrdenesCompra';
import { useVentas } from '../../hooks/useVentas';
import { formatCurrency } from '../../utils/formatters';

export const DashboardMetrics: React.FC = () => {
  const { ordenes } = useOrdenesCompra();
  const { ventas } = useVentas();
  const { clientes } = useClientes();

  const metrics = useMemo(() => {
    // Ventas del mes actual
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const ventasMes = ventas.filter((v) => new Date(v.fecha) >= firstDayOfMonth);

    const totalVentasMes = ventasMes.reduce((sum, v) => sum + v.montoTotal, 0);
    const costoVentasMes = ventasMes.reduce((sum, v) => sum + v.costoTotal, 0);
    const utilidadMes = totalVentasMes - costoVentasMes;
    const margenMes = totalVentasMes > 0 ? (utilidadMes / totalVentasMes) * 100 : 0;

    // Compras del mes
    const comprasMes = ordenes.filter((o) => new Date(o.fechaOrden) >= firstDayOfMonth);
    const totalComprasMes = comprasMes.reduce((sum, o) => sum + o.montoTotal, 0);

    // Órdenes pendientes
    const ordenesPendientes = ordenes.filter(
      (o) => o.estado === 'PENDIENTE' || o.estado === 'EN_TRANSITO'
    );
    const montoOrdenesPendientes = ordenesPendientes.reduce((sum, o) => sum + o.montoTotal, 0);

    // Clientes
    const clientesActivos = clientes.filter((c) => !c.bloqueado).length;
    const clientesBloqueados = clientes.filter((c) => c.bloqueado).length;
    const deudaTotal = clientes.reduce(
      (sum, c) => sum + (c.creditoAutorizado || 0) - (c.creditoDisponible || 0),
      0
    );

    // Ventas pendientes de pago
    const ventasPendientes = ventas.filter(
      (v) => v.estado === 'PENDIENTE' || v.estado === 'CREDITO'
    );
    const montoVentasPendientes = ventasPendientes.reduce((sum, v) => sum + v.montoTotal, 0);

    // Comparación con mes anterior
    const firstDayLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastDayLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
    const ventasMesAnterior = ventas.filter(
      (v) => new Date(v.fecha) >= firstDayLastMonth && new Date(v.fecha) <= lastDayLastMonth
    );
    const totalVentasMesAnterior = ventasMesAnterior.reduce((sum, v) => sum + v.montoTotal, 0);
    const crecimiento =
      totalVentasMesAnterior > 0
        ? ((totalVentasMes - totalVentasMesAnterior) / totalVentasMesAnterior) * 100
        : 0;

    return {
      totalVentasMes,
      utilidadMes,
      margenMes,
      totalComprasMes,
      ordenesPendientes: ordenesPendientes.length,
      montoOrdenesPendientes,
      clientesActivos,
      clientesBloqueados,
      deudaTotal,
      ventasPendientes: ventasPendientes.length,
      montoVentasPendientes,
      crecimiento,
    };
  }, [ordenes, ventas, clientes]);

  const MetricCard: React.FC<{
    title: string;
    value: string | number;
    icon: React.ReactNode;
    color: string;
    subtitle?: string;
    trend?: 'up' | 'down';
    trendValue?: number;
  }> = ({ title, value, icon, color, subtitle, trend, trendValue }) => (
    <div className={`${color} rounded-lg p-6 shadow-sm`}>
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <div className="text-gray-600">{icon}</div>
      </div>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
      {subtitle && <p className="text-sm text-gray-600 mt-1">{subtitle}</p>}
      {trend && trendValue !== undefined && (
        <div
          className={`flex items-center gap-1 mt-2 text-sm ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}
        >
          {trend === 'up' ? (
            <TrendingUp className="h-4 w-4" />
          ) : (
            <TrendingDown className="h-4 w-4" />
          )}
          <span>{Math.abs(trendValue).toFixed(1)}% vs mes anterior</span>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Ventas del Mes"
          value={formatCurrency(metrics.totalVentasMes, 'USD')}
          icon={<DollarSign className="h-6 w-6" />}
          color="bg-blue-50"
          trend={metrics.crecimiento >= 0 ? 'up' : 'down'}
          trendValue={metrics.crecimiento}
        />

        <MetricCard
          title="Utilidad del Mes"
          value={formatCurrency(metrics.utilidadMes, 'USD')}
          icon={<TrendingUp className="h-6 w-6" />}
          color="bg-green-50"
          subtitle={`Margen: ${metrics.margenMes.toFixed(1)}%`}
        />

        <MetricCard
          title="Compras del Mes"
          value={formatCurrency(metrics.totalComprasMes, 'USD')}
          icon={<ShoppingCart className="h-6 w-6" />}
          color="bg-purple-50"
        />

        <MetricCard
          title="Clientes Activos"
          value={metrics.clientesActivos}
          icon={<Users className="h-6 w-6" />}
          color="bg-orange-50"
          subtitle={`${metrics.clientesBloqueados} bloqueados`}
        />
      </div>

      {/* Métricas secundarias */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Órdenes Pendientes</h3>
            <Package className="h-5 w-5 text-yellow-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{metrics.ordenesPendientes}</p>
          <p className="text-sm text-gray-600 mt-1">
            {formatCurrency(metrics.montoOrdenesPendientes, 'USD')}
          </p>
          <div className="mt-4 flex items-center gap-2 text-sm text-yellow-600">
            <AlertCircle className="h-4 w-4" />
            <span>Requieren atención</span>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Cuentas por Cobrar</h3>
            <DollarSign className="h-5 w-5 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{metrics.ventasPendientes}</p>
          <p className="text-sm text-gray-600 mt-1">
            {formatCurrency(metrics.montoVentasPendientes, 'USD')}
          </p>
          <div className="mt-4 flex items-center gap-2 text-sm text-blue-600">
            <CheckCircle className="h-4 w-4" />
            <span>Por cobrar</span>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Deuda de Clientes</h3>
            <AlertCircle className="h-5 w-5 text-red-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {formatCurrency(metrics.deudaTotal, 'USD')}
          </p>
          <p className="text-sm text-gray-600 mt-1">Créditos otorgados</p>
          <div className="mt-4 flex items-center gap-2 text-sm text-red-600">
            <AlertCircle className="h-4 w-4" />
            <span>Monitorear</span>
          </div>
        </div>
      </div>

      {/* Alertas */}
      {(metrics.ordenesPendientes > 5 ||
        metrics.deudaTotal > 50000 ||
        metrics.clientesBloqueados > 0) && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-yellow-900 mb-2">Alertas del Sistema</h4>
              <ul className="space-y-1 text-sm text-yellow-800">
                {metrics.ordenesPendientes > 5 && (
                  <li>
                    • Hay {metrics.ordenesPendientes} órdenes de compra pendientes de gestionar
                  </li>
                )}
                {metrics.deudaTotal > 50000 && (
                  <li>• La deuda total de clientes supera los {formatCurrency(50000, 'USD')}</li>
                )}
                {metrics.clientesBloqueados > 0 && (
                  <li>• Hay {metrics.clientesBloqueados} clientes bloqueados</li>
                )}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
