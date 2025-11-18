import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import {
  ChronosHeader,
  ChronosPanelContainer,
  ChronosCard,
  ChronosStatCard,
  ChronosTableCard,
  ChronosTable,
  ChronosBadge,
  ChronosTabs,
  ChronosProgress,
  ChronosButton,
  ChronosUtils
} from './shared';
import {
  DollarSign,
  Package,
  ShoppingCart,
  TrendingUp,
  Users,
  Building2,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Plus
} from 'lucide-react';

/**
 * 🎯 CHRONOS DASHBOARD - Dashboard principal unificado
 * Ejemplo de implementación con el nuevo sistema de diseño
 */
const ChronosDashboard = ({ data, onNavigate }) => {
  const [activeTab, setActiveTab] = React.useState('overview');

  // Handlers
  const handleSearch = React.useCallback((query) => {
    // Implementar búsqueda de transacciones
    console.log('Search:', query);
  }, []);

  const handleNotifications = React.useCallback(() => {
    // Implementar vista de notificaciones
    console.log('Open notifications');
  }, []);

  const handleRefresh = React.useCallback(() => {
    // Implementar refresh de datos
    console.log('Refresh data');
  }, []);

  const handleAddTransaction = React.useCallback(() => {
    // Implementar modal de nueva transacción
    console.log('Add transaction');
  }, []);

  // Mock data - reemplazar con data real
  const stats = {
    totalCapital: 250000,
    stock: 1250,
    sales: 85,
    customers: 42,
    trend: {
      capital: 8.5,
      stock: -15.3,
      sales: 12.7,
      customers: 5.2
    }
  };

  const recentTransactions = [
    { id: 1, type: 'sale', customer: 'Cliente A', amount: 5250, date: '2025-11-07', status: 'completed' },
    { id: 2, type: 'purchase', supplier: 'Proveedor B', amount: -3200, date: '2025-11-07', status: 'pending' },
    { id: 3, type: 'sale', customer: 'Cliente C', amount: 8900, date: '2025-11-06', status: 'completed' },
    { id: 4, type: 'expense', description: 'Flete', amount: -450, date: '2025-11-06', status: 'completed' },
    { id: 5, type: 'sale', customer: 'Cliente D', amount: 12300, date: '2025-11-06', status: 'completed' }
  ];

  const alerts = [
    { id: 1, type: 'warning', message: 'Stock bajo en Almacén Monte', priority: 'high' },
    { id: 2, type: 'info', message: '3 órdenes pendientes de aprobación', priority: 'medium' },
    { id: 3, type: 'danger', message: 'Pago vencido - Cliente X', priority: 'high' }
  ];

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'banks', label: 'Banks', badge: 6 },
    { id: 'inventory', label: 'Inventory' },
    { id: 'sales', label: 'Sales', badge: 3 }
  ];

  return (
    <ChronosPanelContainer>
      {/* Header */}
            <ChronosHeader
        title="Dashboard"
        subtitle="Panel de control principal"
        searchPlaceholder="Buscar transacciones..."
        notifications={3}
        onSearchChange={(query) => handleSearch(query)}
        onNotificationClick={handleNotifications}
        onRefresh={handleRefresh}

      {/* Content */}
      <div className="p-8 space-y-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <ChronosStatCard
            title="Total Capital"
            value={ChronosUtils.formatCurrency(stats.totalCapital)}
            icon={DollarSign}
            trend={stats.trend.capital}
            trendLabel="vs last month"
            color="#10B981"
            index={0}
          />

          <ChronosStatCard
            title="Stock Inventory"
            value={ChronosUtils.formatNumber(stats.stock)}
            icon={Package}
            trend={stats.trend.stock}
            trendLabel="units available"
            color="#EF4444"
            index={1}
          />

          <ChronosStatCard
            title="Active Sales"
            value={ChronosUtils.formatNumber(stats.sales)}
            icon={ShoppingCart}
            trend={stats.trend.sales}
            trendLabel="this week"
            color="#3B82F6"
            index={2}
          />

          <ChronosStatCard
            title="Total Customers"
            value={ChronosUtils.formatNumber(stats.customers)}
            icon={Users}
            trend={stats.trend.customers}
            trendLabel="active accounts"
            color="#F59E0B"
            index={3}
          />
        </div>

        {/* Tabs */}
        <ChronosTabs
          tabs={tabs}
          activeTab={activeTab}
          onChange={setActiveTab}
        />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Transactions - 2 columns */}
          <div className="lg:col-span-2">
            <ChronosTableCard
              title="Recent Transactions"
              subtitle="Last 5 transactions"
              icon={TrendingUp}
              actions={
                                  variant="primary"
                  icon={Plus}
                  onClick={handleAddTransaction}
              }
            >
              <ChronosTable
                headers={['Type', 'Description', 'Amount', 'Date', 'Status']}
                data={recentTransactions}
                hoverable={true}
                renderCell={(row, header) => {
                  if (header === 'Type') {
                    const typeColors = {
                      sale: 'success',
                      purchase: 'info',
                      expense: 'warning'
                    };
                    return (
                      <ChronosBadge variant={typeColors[row.type]} size="sm">
                        {row.type}
                      </ChronosBadge>
                    );
                  }
                  if (header === 'Description') {
                    return row.customer || row.supplier || row.description;
                  }
                  if (header === 'Amount') {
                    const isPositive = row.amount > 0;
                    return (
                      <span className={isPositive ? 'text-zinc-200' : 'text-zinc-200'}>
                        {isPositive ? (
                          <ArrowUpRight className="inline w-3 h-3 mr-1" />
                        ) : (
                          <ArrowDownRight className="inline w-3 h-3 mr-1" />
                        )}
                        {ChronosUtils.formatCurrency(Math.abs(row.amount))}
                      </span>
                    );
                  }
                  if (header === 'Date') {
                    return ChronosUtils.formatDate(row.date, 'short');
                  }
                  if (header === 'Status') {
                    const statusColors = {
                      completed: 'success',
                      pending: 'warning',
                      failed: 'danger'
                    };
                    return (
                      <ChronosBadge
                        variant={statusColors[row.status]}
                        size="sm"
                        pulse={row.status === 'pending'}
                      >
                        {row.status}
                      </ChronosBadge>
                    );
                  }
                  return row[header];
                }}
              />
            </ChronosTableCard>
          </div>

          {/* Alerts & Quick Actions - 1 column */}
          <div className="space-y-6">
            {/* System Alerts */}
            <ChronosCard
              title="System Alerts"
              subtitle={`${alerts.length} active alerts`}
              icon={AlertTriangle}
              index={0}
            >
              <div className="space-y-3">
                {alerts.map((alert, index) => (
                  <motion.div
                    key={alert.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-3 p-3 bg-white/5 rounded-sm border border-white/10"
                  >
                    <div className={`w-2 h-2 mt-1.5 rounded-full ${
                      alert.type === 'danger' ? 'bg-zinc-9000' :
                      alert.type === 'warning' ? 'bg-zinc-9000' :
                      'bg-zinc-800'
                    }`} />
                    <div className="flex-1">
                      <p className="text-sm text-white/80">
                        {alert.message}
                      </p>
                      <ChronosBadge
                        variant={alert.type}
                        size="sm"
                        className="mt-2"
                      >
                        {alert.priority}
                      </ChronosBadge>
                    </div>
                  </motion.div>
                ))}
              </div>
            </ChronosCard>

            {/* Quick Stats */}
            <ChronosCard
              title="Quick Stats"
              icon={Building2}
              index={1}
            >
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-white/60">Bóveda Monte</span>
                    <span className="text-xs text-white">75%</span>
                  </div>
                  <ChronosProgress value={75} color="#10B981" />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-white/60">Azteca</span>
                    <span className="text-xs text-white">45%</span>
                  </div>
                  <ChronosProgress value={45} color="#3B82F6" />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-white/60">Utilidades</span>
                    <span className="text-xs text-white">90%</span>
                  </div>
                  <ChronosProgress value={90} color="#F59E0B" />
                </div>
              </div>
            </ChronosCard>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-center gap-4">
          <ChronosButton
            variant="primary"
            size="lg"
            icon={Plus}
            onClick={() => onNavigate?.('ventas')}
          >
            New Sale
          </ChronosButton>

          <ChronosButton
            variant="secondary"
            size="lg"
            icon={Package}
            onClick={() => onNavigate?.('almacen')}
          >
            Manage Inventory
          </ChronosButton>

          <ChronosButton
            variant="ghost"
            size="lg"
            icon={Building2}
            onClick={() => onNavigate?.('bancos')}
          >
            View Banks
          </ChronosButton>
        </div>
      </div>
    </ChronosPanelContainer>
  );
};

// PropTypes
ChronosDashboard.propTypes = {
  data: PropTypes.shape({
    stats: PropTypes.object,
    transactions: PropTypes.array,
    alerts: PropTypes.array
  }),
  onNavigate: PropTypes.func
};

ChronosDashboard.defaultProps = {
  data: null,
  onNavigate: () => {}
};

export default ChronosDashboard;
