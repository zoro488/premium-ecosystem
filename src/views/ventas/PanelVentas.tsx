import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingCart,
  TrendingUp,
  Users,
  DollarSign,
  AlertTriangle,
  Plus,
  Download,
  Filter,
  Search,
  Calendar,
  Eye,
  Edit2,
  Trash2,
  CheckCircle,
  Clock,
  XCircle,
  ArrowUpRight,
  ArrowDownRight,
  Package,
} from 'lucide-react';

import { ChronosCard, ChronosKPI, ChronosTable, ChronosButton } from '@/components/chronos-ui';
import { useChronosData } from '@/hooks/useChronosData';
import { formatCurrency, formatDate } from '@/lib/utils';

interface Venta {
  id: string;
  numeroVenta: string;
  fecha: Date;
  clienteId: string;
  clienteNombre: string;
  productos: {
    productoId: string;
    nombre: string;
    cantidad: number;
    precioUnitario: number;
    precioFlete: number;
    subtotal: number;
  }[];
  subtotal: number;
  totalFlete: number;
  total: number;
  estadoPago: 'completo' | 'parcial' | 'pendiente';
  montoPagado: number;
  adeudo: number;
  notas?: string;
  creadoPor: string;
  actualizadoEn?: Date;
}

const ESTADOS_PAGO = {
  completo: { label: 'Pagado', color: 'green', icon: CheckCircle },
  parcial: { label: 'Parcial', color: 'yellow', icon: Clock },
  pendiente: { label: 'Pendiente', color: 'red', icon: XCircle },
};

export function PanelVentas() {
  const { ventas, loading, error } = useChronosData();
  const [filteredVentas, setFilteredVentas] = useState<Venta[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEstado, setSelectedEstado] = useState<string>('todos');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [showNewVentaModal, setShowNewVentaModal] = useState(false);
  const [selectedVenta, setSelectedVenta] = useState<Venta | null>(null);

  // Cálculo de KPIs en tiempo real
  const kpis = useMemo(() => {
    if (!ventas?.length) return {
      totalVentas: 0,
      ventasHoy: 0,
      adeudoTotal: 0,
      ventaPromedio: 0,
      clientesActivos: 0,
      tasaCobranza: 0,
      tendenciaVentas: 0,
      tendenciaCobranza: 0,
    };

    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    const totalVentas = ventas.reduce((sum, v) => sum + v.total, 0);
    const ventasHoy = ventas
      .filter(v => new Date(v.fecha) >= hoy)
      .reduce((sum, v) => sum + v.total, 0);
    const adeudoTotal = ventas.reduce((sum, v) => sum + v.adeudo, 0);
    const ventaPromedio = totalVentas / ventas.length;
    const clientesUnicos = new Set(ventas.map(v => v.clienteId)).size;
    const montoPagado = ventas.reduce((sum, v) => sum + v.montoPagado, 0);
    const tasaCobranza = (montoPagado / totalVentas) * 100;

    // Calcular tendencias (comparar último mes vs mes anterior)
    const unMesAtras = new Date();
    unMesAtras.setMonth(unMesAtras.getMonth() - 1);
    const dosMesesAtras = new Date();
    dosMesesAtras.setMonth(dosMesesAtras.getMonth() - 2);

    const ventasUltimoMes = ventas
      .filter(v => new Date(v.fecha) >= unMesAtras)
      .reduce((sum, v) => sum + v.total, 0);
    const ventasMesAnterior = ventas
      .filter(v => new Date(v.fecha) >= dosMesesAtras && new Date(v.fecha) < unMesAtras)
      .reduce((sum, v) => sum + v.total, 0);

    const tendenciaVentas = ventasMesAnterior > 0
      ? ((ventasUltimoMes - ventasMesAnterior) / ventasMesAnterior) * 100
      : 0;

    return {
      totalVentas,
      ventasHoy,
      adeudoTotal,
      ventaPromedio,
      clientesActivos: clientesUnicos,
      tasaCobranza,
      tendenciaVentas,
      tendenciaCobranza: tasaCobranza > 75 ? 5 : -2,
    };
  }, [ventas]);

  // Filtrado avanzado
  useEffect(() => {
    if (!ventas) return;

    let filtered = [...ventas];

    // Filtro por búsqueda
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(v =>
        v.numeroVenta.toLowerCase().includes(term) ||
        v.clienteNombre.toLowerCase().includes(term) ||
        v.productos.some(p => p.nombre.toLowerCase().includes(term))
      );
    }

    // Filtro por estado
    if (selectedEstado !== 'todos') {
      filtered = filtered.filter(v => v.estadoPago === selectedEstado);
    }

    // Filtro por rango de fechas
    if (dateRange.start) {
      filtered = filtered.filter(v => new Date(v.fecha) >= new Date(dateRange.start));
    }
    if (dateRange.end) {
      filtered = filtered.filter(v => new Date(v.fecha) <= new Date(dateRange.end));
    }

    // Ordenar por fecha descendente
    filtered.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());

    setFilteredVentas(filtered);
  }, [ventas, searchTerm, selectedEstado, dateRange]);

  // Columnas de la tabla
  const columns = [
    {
      key: 'numeroVenta',
      label: '# Venta',
      render: (venta: Venta) => (
        <div className="font-mono text-sm font-bold text-cyan-400">
          {venta.numeroVenta}
        </div>
      ),
    },
    {
      key: 'fecha',
      label: 'Fecha',
      render: (venta: Venta) => (
        <div className="text-sm text-gray-400">
          {formatDate(venta.fecha)}
        </div>
      ),
    },
    {
      key: 'cliente',
      label: 'Cliente',
      render: (venta: Venta) => (
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
            {venta.clienteNombre.charAt(0)}
          </div>
          <span className="text-sm font-medium text-white">
            {venta.clienteNombre}
          </span>
        </div>
      ),
    },
    {
      key: 'productos',
      label: 'Productos',
      render: (venta: Venta) => (
        <div className="flex items-center gap-1 text-xs text-gray-400">
          <Package className="h-3 w-3" />
          <span>{venta.productos.length} items</span>
        </div>
      ),
    },
    {
      key: 'total',
      label: 'Total',
      render: (venta: Venta) => (
        <div className="text-sm font-bold text-white">
          {formatCurrency(venta.total)}
        </div>
      ),
    },
    {
      key: 'estadoPago',
      label: 'Estado',
      render: (venta: Venta) => {
        const estado = ESTADOS_PAGO[venta.estadoPago];
        const Icon = estado.icon;
        return (
          <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-${estado.color}-500/10 text-${estado.color}-400 border border-${estado.color}-500/20`}>
            <Icon className="h-3 w-3" />
            {estado.label}
          </div>
        );
      },
    },
    {
      key: 'adeudo',
      label: 'Adeudo',
      render: (venta: Venta) => (
        <div className={`text-sm font-medium ${venta.adeudo > 0 ? 'text-red-400' : 'text-green-400'}`}>
          {venta.adeudo > 0 ? formatCurrency(venta.adeudo) : '—'}
        </div>
      ),
    },
    {
      key: 'acciones',
      label: 'Acciones',
      render: (venta: Venta) => (
        <div className="flex items-center gap-1">
          <button
            onClick={() => setSelectedVenta(venta)}
            className="p-1 rounded hover:bg-white/5 text-gray-400 hover:text-white transition-colors"
          >
            <Eye className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleEditVenta(venta)}
            className="p-1 rounded hover:bg-white/5 text-gray-400 hover:text-white transition-colors"
          >
            <Edit2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  const handleEditVenta = (venta: Venta) => {
    setSelectedVenta(venta);
    setShowNewVentaModal(true);
  };

  const handleExport = () => {
    // Implementar exportación a Excel
    console.log('Exportando ventas...');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="h-12 w-12 rounded-full border-4 border-cyan-500/20 border-t-cyan-500"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <ChronosCard className="max-w-md">
          <div className="flex items-center gap-3 text-red-400">
            <AlertTriangle className="h-6 w-6" />
            <div>
              <h3 className="font-bold">Error al cargar ventas</h3>
              <p className="text-sm text-gray-400">{error}</p>
            </div>
          </div>
        </ChronosCard>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <ShoppingCart className="h-8 w-8 text-cyan-500" />
            Panel de Ventas
          </h1>
          <p className="text-gray-400">Gestión completa de ventas y cobranza</p>
        </div>

        <div className="flex items-center gap-3">
          <ChronosButton
            onClick={handleExport}
            variant="outline"
            leftIcon={<Download className="h-4 w-4" />}
          >
            Exportar
          </ChronosButton>
          <ChronosButton
            onClick={() => setShowNewVentaModal(true)}
            leftIcon={<Plus className="h-4 w-4" />}
          >
            Nueva Venta
          </ChronosButton>
        </div>
      </motion.div>

      {/* KPIs Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <ChronosKPI
          label="Total Ventas"
          value={formatCurrency(kpis.totalVentas)}
          icon={<DollarSign className="h-6 w-6" />}
          trend={kpis.tendenciaVentas}
          trendLabel={`${kpis.tendenciaVentas > 0 ? '+' : ''}${kpis.tendenciaVentas.toFixed(1)}% vs mes anterior`}
          color="cyan"
        />
        <ChronosKPI
          label="Ventas Hoy"
          value={formatCurrency(kpis.ventasHoy)}
          icon={<TrendingUp className="h-6 w-6" />}
          color="green"
        />
        <ChronosKPI
          label="Adeudo Total"
          value={formatCurrency(kpis.adeudoTotal)}
          icon={<AlertTriangle className="h-6 w-6" />}
          trend={-kpis.tendenciaCobranza}
          trendLabel={`${kpis.tasaCobranza.toFixed(1)}% cobrado`}
          color="red"
        />
        <ChronosKPI
          label="Clientes Activos"
          value={kpis.clientesActivos.toString()}
          icon={<Users className="h-6 w-6" />}
          color="purple"
        />
      </motion.div>

      {/* Filtros */}
      <ChronosCard>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por # venta, cliente o producto..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:border-cyan-500/50 transition-colors"
            />
          </div>

          <select
            value={selectedEstado}
            onChange={(e) => setSelectedEstado(e.target.value)}
            className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-cyan-500/50 transition-colors"
          >
            <option value="todos">Todos los estados</option>
            <option value="completo">Pagado</option>
            <option value="parcial">Parcial</option>
            <option value="pendiente">Pendiente</option>
          </select>

          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-400" />
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
              className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-cyan-500/50 transition-colors"
            />
            <span className="text-gray-500">-</span>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
              className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-cyan-500/50 transition-colors"
            />
          </div>
        </div>
      </ChronosCard>

      {/* Tabla de Ventas */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <ChronosTable
          data={filteredVentas}
          columns={columns}
          emptyMessage="No se encontraron ventas"
        />
      </motion.div>

      {/* Modal de detalle de venta */}
      <AnimatePresence>
        {selectedVenta && !showNewVentaModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedVenta(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-black/90 border border-white/10 rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto"
            >
              <div className="p-6 space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-white">
                    Detalle de Venta #{selectedVenta.numeroVenta}
                  </h2>
                  <button
                    onClick={() => setSelectedVenta(null)}
                    className="p-2 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-colors"
                  >
                    <XCircle className="h-5 w-5" />
                  </button>
                </div>

                {/* Info general */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Cliente</p>
                    <p className="text-white font-medium">{selectedVenta.clienteNombre}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Fecha</p>
                    <p className="text-white font-medium">{formatDate(selectedVenta.fecha)}</p>
                  </div>
                </div>

                {/* Productos */}
                <div>
                  <h3 className="text-lg font-bold text-white mb-3">Productos</h3>
                  <div className="space-y-2">
                    {selectedVenta.productos.map((producto, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10"
                      >
                        <div>
                          <p className="text-white font-medium">{producto.nombre}</p>
                          <p className="text-sm text-gray-400">
                            {producto.cantidad} unidades × {formatCurrency(producto.precioUnitario)}
                          </p>
                        </div>
                        <p className="text-white font-bold">{formatCurrency(producto.subtotal)}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Totales */}
                <div className="border-t border-white/10 pt-4 space-y-2">
                  <div className="flex justify-between text-gray-400">
                    <span>Subtotal</span>
                    <span>{formatCurrency(selectedVenta.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>Flete Total</span>
                    <span>{formatCurrency(selectedVenta.totalFlete)}</span>
                  </div>
                  <div className="flex justify-between text-xl font-bold text-white">
                    <span>Total</span>
                    <span>{formatCurrency(selectedVenta.total)}</span>
                  </div>
                  <div className="flex justify-between text-green-400">
                    <span>Pagado</span>
                    <span>{formatCurrency(selectedVenta.montoPagado)}</span>
                  </div>
                  {selectedVenta.adeudo > 0 && (
                    <div className="flex justify-between text-red-400 font-bold">
                      <span>Adeudo</span>
                      <span>{formatCurrency(selectedVenta.adeudo)}</span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
