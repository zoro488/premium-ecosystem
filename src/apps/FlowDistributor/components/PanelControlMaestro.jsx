import { useMemo, useState } from 'react';

import { AnimatePresence, motion } from 'framer-motion';
import {
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Clock,
  DollarSign,
  Download,
  Filter,
  Package,
  Plus,
  Search,
  TrendingUp,
  X,
} from 'lucide-react';

import { ventasLocalesData } from '../data/ventasLocales';
import FormVentaLocal from './FormVentaLocal';

/**
 * PANEL CONTROL MAESTRO - VENTA LOCAL
 * Replica EXACTA de la tabla del Excel con todos los datos reales
 * Updated: 2025-01-27
 */

export default function PanelControlMaestro() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filtroEstatus, setFiltroEstatus] = useState('Todos');
  const [filtroFlete, setFiltroFlete] = useState('Todos');
  const [sortConfig, setSortConfig] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showFormVenta, setShowFormVenta] = useState(false);
  const [ventaEditando, setVentaEditando] = useState(null);
  const [ventas, setVentas] = useState(ventasLocalesData);

  // Calcular totales de ventas
  const calcularTotalesVentas = () => {
    return ventas.reduce(
      (totales, venta) => {
        totales.totalVenta += venta.totalVenta || 0;
        totales.flete += venta.flete || 0;
        totales.utilidades += venta.utilidades || 0;
        totales.bovedaMonte += venta.bovedaMonte || 0;
        return totales;
      },
      { totalVenta: 0, flete: 0, utilidades: 0, bovedaMonte: 0 }
    );
  };

  const totalesVentasLocales = calcularTotalesVentas();

  // Handler para guardar venta
  const handleSaveVenta = (ventaData) => {
    if (ventaEditando) {
      setVentas(ventas.map((v) => (v.id === ventaEditando.id ? { ...ventaData, id: v.id } : v)));
    } else {
      setVentas([...ventas, { ...ventaData, id: Date.now() }]);
    }
    setShowFormVenta(false);
    setVentaEditando(null);
  };

  // Filtrado y búsqueda
  const ventasFiltradas = useMemo(() => {
    let filtered = ventas;

    // Búsqueda
    if (searchTerm) {
      filtered = filtered.filter(
        (v) =>
          v.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
          v.ocRelacionada.toLowerCase().includes(searchTerm.toLowerCase()) ||
          v.concepto.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtro estatus
    if (filtroEstatus !== 'Todos') {
      filtered = filtered.filter((v) => v.estatus === filtroEstatus);
    }

    // Filtro flete
    if (filtroFlete !== 'Todos') {
      filtered = filtered.filter((v) => v.flete === filtroFlete);
    }

    // Ordenamiento
    if (sortConfig) {
      filtered = [...filtered].sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [ventas, searchTerm, filtroEstatus, filtroFlete, sortConfig]);

  // Cálculos de totales
  const totales = useMemo(() => {
    const totalBoveda = ventasFiltradas.reduce((sum, v) => sum + v.bovedaMonte, 0);
    const totalIngreso = ventasFiltradas.reduce((sum, v) => sum + v.ingreso, 0);
    const totalFleteUtilidad = ventasFiltradas.reduce((sum, v) => sum + v.fleteUtilidad, 0);
    const totalUtilidad = ventasFiltradas.reduce((sum, v) => sum + v.utilidad, 0);

    return { totalBoveda, totalIngreso, totalFleteUtilidad, totalUtilidad };
  }, [ventasFiltradas]);

  const handleSort = (key) => {
    setSortConfig((current) => {
      if (!current || current.key !== key) {
        return { key, direction: 'asc' };
      }
      if (current.direction === 'asc') {
        return { key, direction: 'desc' };
      }
      return null;
    });
  };

  const exportToCSV = () => {
    const headers = [
      'Fecha',
      'OC Relacionada',
      'Cantidad',
      'Cliente',
      'Bóveda Monte',
      'Precio De Venta',
      'Ingreso',
      'Flete',
      'Flete Utilidad',
      'Utilidad',
      'Estatus',
      'Concepto',
    ];

    const rows = ventasFiltradas.map((v) => [
      v.fecha.toLocaleDateString(),
      v.ocRelacionada,
      v.cantidad,
      v.cliente,
      v.bovedaMonte,
      v.precioVenta,
      v.ingreso,
      v.flete,
      v.fleteUtilidad,
      v.utilidad,
      v.estatus,
      v.concepto,
    ]);

    const csv = [headers, ...rows].map((row) => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ventas_locales_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          type: 'spring',
          stiffness: 260,
          damping: 20,
          duration: 0.6,
        }}
        className="mb-6"
      >
        <div className="flex items-center justify-between mb-4">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              type: 'spring',
              stiffness: 200,
              damping: 25,
              delay: 0.1,
            }}
          >
            <motion.h1
              className="text-4xl font-bold text-white mb-2"
              whileHover={{
                scale: 1.02,
                textShadow: '0 0 20px rgba(59, 130, 246, 0.5)',
              }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              📊 Panel Control Maestro
            </motion.h1>
            <motion.p
              className="text-blue-300"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Venta Local - Registro Completo
            </motion.p>
          </motion.div>

          <div className="flex gap-3">
            <motion.button
              onClick={() => setShowFormVenta(true)}
              whileHover={{
                scale: 1.08,
                boxShadow: '0 10px 30px rgba(59, 130, 246, 0.3)',
                y: -2,
              }}
              whileTap={{
                scale: 0.92,
                boxShadow: '0 5px 15px rgba(59, 130, 246, 0.2)',
              }}
              className="flex items-center gap-2 px-5 py-2.5 bg-blue-500/20 border border-blue-400/30 rounded-xl text-blue-300 hover:bg-blue-500/30 transition-all backdrop-blur-sm overflow-hidden relative group"
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/20 to-blue-500/0"
                initial={{ x: '-100%' }}
                whileHover={{ x: '100%' }}
                transition={{ duration: 0.6, ease: 'easeInOut' }}
              />
              <motion.div
                whileHover={{ rotate: 90 }}
                transition={{ type: 'spring', stiffness: 400 }}
              >
                <Plus className="w-5 h-5" />
              </motion.div>
              <span className="relative z-10 font-semibold">Nueva Venta</span>
            </motion.button>

            <motion.button
              whileHover={{
                scale: 1.08,
                boxShadow: '0 10px 30px rgba(34, 197, 94, 0.3)',
                y: -2,
              }}
              whileTap={{
                scale: 0.92,
                boxShadow: '0 5px 15px rgba(34, 197, 94, 0.2)',
              }}
              onClick={exportToCSV}
              className="flex items-center gap-2 px-5 py-2.5 bg-green-500/20 border border-green-400/30 rounded-xl text-green-300 hover:bg-green-500/30 transition-all backdrop-blur-sm overflow-hidden relative group"
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-green-500/0 via-green-500/20 to-green-500/0"
                initial={{ x: '-100%' }}
                whileHover={{ x: '100%' }}
                transition={{ duration: 0.6, ease: 'easeInOut' }}
              />
              <motion.div
                whileHover={{ rotate: 90, scale: 1.1 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <Download className="w-5 h-5" />
              </motion.div>
              <span className="relative z-10">Exportar CSV</span>
            </motion.button>

            <motion.button
              whileHover={{
                scale: 1.08,
                boxShadow: '0 10px 30px rgba(168, 85, 247, 0.3)',
                y: -2,
              }}
              whileTap={{
                scale: 0.92,
                boxShadow: '0 5px 15px rgba(168, 85, 247, 0.2)',
              }}
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-5 py-2.5 bg-purple-500/20 border border-purple-400/30 rounded-xl text-purple-300 hover:bg-purple-500/30 transition-all backdrop-blur-sm overflow-hidden relative group"
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-purple-500/20 to-purple-500/0"
                initial={{ x: '-100%' }}
                whileHover={{ x: '100%' }}
                transition={{ duration: 0.6, ease: 'easeInOut' }}
              />
              <motion.div
                animate={{ rotate: showFilters ? 180 : 0 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <Filter className="w-5 h-5" />
              </motion.div>
              <span className="relative z-10">Filtros</span>
              <motion.div
                animate={{ rotate: showFilters ? 180 : 0 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                {showFilters ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </motion.div>
            </motion.button>
          </div>
        </div>

        {/* Panel RF Actual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            type: 'spring',
            stiffness: 200,
            damping: 20,
            delay: 0.2,
          }}
          className="grid grid-cols-4 gap-4 mb-6"
        >
          <motion.div
            className="col-span-1 bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 backdrop-blur-xl border border-emerald-400/30 rounded-2xl p-6 overflow-hidden relative group"
            whileHover={{
              scale: 1.03,
              boxShadow: '0 20px 60px rgba(16, 185, 129, 0.3)',
              y: -4,
            }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-tr from-emerald-500/0 via-emerald-500/10 to-emerald-500/0"
              initial={{ rotate: 0 }}
              whileHover={{ rotate: 360 }}
              transition={{ duration: 2, ease: 'linear' }}
            />
            <div className="flex items-center justify-between mb-2 relative z-10">
              <motion.span
                className="text-emerald-300 text-sm font-medium"
                whileHover={{ x: 2 }}
                transition={{ type: 'spring', stiffness: 400 }}
              >
                RF ACTUAL
              </motion.span>
              <motion.div
                animate={{
                  y: [0, -3, 0],
                  rotate: [0, 5, -5, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                <TrendingUp className="w-5 h-5 text-emerald-400" />
              </motion.div>
            </div>
            <motion.p
              className="text-3xl font-bold text-white relative z-10"
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 400 }}
            >
              ${totalesVentasLocales.totalIngreso.toLocaleString()}
            </motion.p>
          </motion.div>

          <motion.div
            className="col-span-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              type: 'spring',
              stiffness: 200,
              damping: 20,
              delay: 0.3,
            }}
          >
            <div className="grid grid-cols-4 gap-4">
              {[
                {
                  label: 'Almacén Villa',
                  value: totalesVentasLocales.totalIngreso * 0.25,
                  color: 'blue',
                  isString: true,
                },
                {
                  label: 'Bóveda Monte',
                  value: totalesVentasLocales.totalBovedaMonte,
                  color: 'blue',
                },
                { label: 'Flete Sur', value: totalesVentasLocales.totalFletes, color: 'blue' },
                { label: 'Utilidades', value: totalesVentasLocales.totalUtilidades, color: 'blue' },
                { label: 'Azteca', value: totalesVentasLocales.totalIngreso * 0.15, color: 'red' },
                { label: 'Leftie', value: totalesVentasLocales.totalIngreso * 0.1, color: 'blue' },
                {
                  label: 'Profit',
                  value: totalesVentasLocales.totalUtilidades * 0.8,
                  color: 'blue',
                },
                {
                  label: 'Bóveda USA',
                  value: totalesVentasLocales.totalIngreso * 0.05,
                  color: 'blue',
                },
              ].map((item, idx) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    type: 'spring',
                    stiffness: 300,
                    damping: 25,
                    delay: 0.4 + idx * 0.05,
                  }}
                  whileHover={{
                    scale: 1.05,
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    y: -2,
                  }}
                  className="p-2 rounded-lg transition-all cursor-default"
                >
                  <motion.p
                    className={`text-xs ${item.color === 'red' ? 'text-red-300' : 'text-blue-300'} mb-1`}
                    whileHover={{ x: 2 }}
                    transition={{ type: 'spring', stiffness: 400 }}
                  >
                    {item.label}
                  </motion.p>
                  <motion.p
                    className={`text-lg font-bold ${item.color === 'red' ? 'text-red-400' : 'text-white'}`}
                    whileHover={{ scale: 1.08 }}
                    transition={{ type: 'spring', stiffness: 400 }}
                  >
                    {item.isString ? item.value : `$${item.value.toLocaleString()}`}
                  </motion.p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* Búsqueda y Filtros */}
        <motion.div
          className="flex gap-4 mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            type: 'spring',
            stiffness: 200,
            damping: 20,
            delay: 0.5,
          }}
        >
          <motion.div
            className="flex-1 relative group"
            whileHover={{ scale: 1.01 }}
            transition={{ type: 'spring', stiffness: 400 }}
          >
            <motion.div
              className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-400"
              animate={{
                rotate: searchTerm ? 0 : [0, -15, 15, -10, 10, 0],
                scale: searchTerm ? 1 : [1, 1.1, 1],
              }}
              transition={{
                duration: 2,
                repeat: searchTerm ? 0 : Infinity,
                ease: 'easeInOut',
              }}
            >
              <Search className="w-5 h-5" />
            </motion.div>
            <motion.input
              type="text"
              placeholder="Buscar por cliente, OC o concepto..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl text-white placeholder-blue-300/50 focus:outline-none focus:ring-2 focus:ring-blue-400/50 transition-all duration-300"
              whileFocus={{
                scale: 1.01,
                boxShadow: '0 10px 40px rgba(59, 130, 246, 0.2)',
                borderColor: 'rgba(59, 130, 246, 0.5)',
              }}
            />
            {searchTerm && (
              <motion.button
                initial={{ opacity: 0, scale: 0, rotate: -180 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 0, rotate: 180 }}
                whileHover={{ scale: 1.2, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-400 hover:text-blue-300 transition-colors"
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              >
                <X className="w-5 h-5" />
              </motion.button>
            )}
          </motion.div>
        </motion.div>

        {/* Panel de Filtros */}
        <AnimatePresence mode="wait">
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0, scaleY: 0 }}
              animate={{
                opacity: 1,
                height: 'auto',
                scaleY: 1,
                transition: {
                  opacity: { duration: 0.3 },
                  height: { duration: 0.4, ease: 'easeOut' },
                  scaleY: { duration: 0.4, ease: [0.34, 1.56, 0.64, 1] },
                },
              }}
              exit={{
                opacity: 0,
                height: 0,
                scaleY: 0,
                transition: {
                  opacity: { duration: 0.2 },
                  height: { duration: 0.3, ease: 'easeIn' },
                  scaleY: { duration: 0.3, ease: 'easeIn' },
                },
              }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4 mb-4 overflow-hidden origin-top"
            >
              <motion.div
                className="grid grid-cols-3 gap-4"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 300 }}
              >
                <motion.div
                  whileHover={{ scale: 1.02, y: -2 }}
                  transition={{ type: 'spring', stiffness: 400 }}
                >
                  <motion.label
                    className="text-sm text-blue-300 mb-2 block"
                    whileHover={{ x: 2 }}
                    transition={{ type: 'spring', stiffness: 400 }}
                  >
                    Estatus
                  </motion.label>
                  <motion.select
                    value={filtroEstatus}
                    onChange={(e) => setFiltroEstatus(e.target.value)}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-400/50 transition-all cursor-pointer"
                    whileFocus={{
                      scale: 1.02,
                      boxShadow: '0 5px 20px rgba(59, 130, 246, 0.2)',
                    }}
                  >
                    <option value="Todos">Todos</option>
                    <option value="Pagado">Pagado</option>
                    <option value="Pendiente">Pendiente</option>
                  </motion.select>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02, y: -2 }}
                  transition={{ type: 'spring', stiffness: 400 }}
                >
                  <motion.label
                    className="text-sm text-blue-300 mb-2 block"
                    whileHover={{ x: 2 }}
                    transition={{ type: 'spring', stiffness: 400 }}
                  >
                    Flete
                  </motion.label>
                  <motion.select
                    value={filtroFlete}
                    onChange={(e) => setFiltroFlete(e.target.value)}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-400/50 transition-all cursor-pointer"
                    whileFocus={{
                      scale: 1.02,
                      boxShadow: '0 5px 20px rgba(59, 130, 246, 0.2)',
                    }}
                  >
                    <option value="Todos">Todos</option>
                    <option value="Aplica">Aplica</option>
                    <option value="No Aplica">No Aplica</option>
                  </motion.select>
                </motion.div>

                <motion.div
                  className="flex items-end"
                  whileHover={{ scale: 1.02, y: -2 }}
                  transition={{ type: 'spring', stiffness: 400 }}
                >
                  <motion.button
                    onClick={() => {
                      setSearchTerm('');
                      setFiltroEstatus('Todos');
                      setFiltroFlete('Todos');
                      setSortConfig(null);
                    }}
                    className="w-full px-4 py-2 bg-red-500/20 border border-red-400/30 rounded-lg text-red-300 hover:bg-red-500/30 transition-all flex items-center justify-center gap-2 relative overflow-hidden group"
                    whileHover={{
                      boxShadow: '0 10px 30px rgba(239, 68, 68, 0.3)',
                      scale: 1.05,
                    }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-red-500/0 via-red-500/20 to-red-500/0"
                      initial={{ x: '-100%' }}
                      whileHover={{ x: '100%' }}
                      transition={{ duration: 0.5 }}
                    />
                    <motion.div
                      whileHover={{ rotate: 90, scale: 1.1 }}
                      transition={{ type: 'spring', stiffness: 300 }}
                    >
                      <X className="w-4 h-4" />
                    </motion.div>
                    <span className="relative z-10">Limpiar Filtros</span>
                  </motion.button>
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tarjetas de Resumen */}
        <motion.div
          className="grid grid-cols-4 gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            type: 'spring',
            stiffness: 200,
            damping: 20,
            delay: 0.6,
          }}
        >
          {[
            {
              label: 'Total Registros',
              value: ventasFiltradas.length,
              icon: Package,
              color: 'blue',
              gradient: 'from-blue-500/20 to-blue-600/10',
              border: 'border-blue-400/30',
            },
            {
              label: 'Total Ingresos',
              value: `$${totales.totalIngreso.toLocaleString()}`,
              icon: DollarSign,
              color: 'green',
              gradient: 'from-green-500/20 to-green-600/10',
              border: 'border-green-400/30',
            },
            {
              label: 'Total Flete Utilidad',
              value: `$${totales.totalFleteUtilidad.toLocaleString()}`,
              icon: TrendingUp,
              color: 'purple',
              gradient: 'from-purple-500/20 to-purple-600/10',
              border: 'border-purple-400/30',
            },
            {
              label: 'Total Utilidad',
              value: `$${totales.totalUtilidad.toLocaleString()}`,
              icon: TrendingUp,
              color: 'amber',
              gradient: 'from-amber-500/20 to-amber-600/10',
              border: 'border-amber-400/30',
            },
          ].map((card, idx) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.label}
                className={`bg-gradient-to-br ${card.gradient} backdrop-blur-xl border ${card.border} rounded-xl p-4 relative overflow-hidden group cursor-default`}
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{
                  type: 'spring',
                  stiffness: 300,
                  damping: 20,
                  delay: 0.7 + idx * 0.1,
                }}
                whileHover={{
                  scale: 1.05,
                  y: -5,
                  boxShadow: `0 20px 60px rgba(${
                    card.color === 'blue'
                      ? '59, 130, 246'
                      : card.color === 'green'
                        ? '34, 197, 94'
                        : card.color === 'purple'
                          ? '168, 85, 247'
                          : '245, 158, 11'
                  }, 0.3)`,
                  transition: { type: 'spring', stiffness: 400, damping: 20 },
                }}
              >
                <motion.div
                  className={`absolute inset-0 bg-gradient-to-tr from-${card.color}-500/0 via-${card.color}-500/10 to-${card.color}-500/0 opacity-0 group-hover:opacity-100`}
                  initial={{ x: '-100%', y: '-100%' }}
                  whileHover={{ x: '100%', y: '100%' }}
                  transition={{ duration: 0.8, ease: 'easeInOut' }}
                />
                <div className="flex items-center justify-between mb-2 relative z-10">
                  <motion.span
                    className={`text-${card.color}-300 text-sm`}
                    whileHover={{ x: 2 }}
                    transition={{ type: 'spring', stiffness: 400 }}
                  >
                    {card.label}
                  </motion.span>
                  <motion.div
                    whileHover={{
                      rotate: [0, -10, 10, -10, 10, 0],
                      scale: 1.2,
                    }}
                    transition={{
                      duration: 0.5,
                      ease: 'easeInOut',
                    }}
                  >
                    <Icon className={`w-5 h-5 text-${card.color}-400`} />
                  </motion.div>
                </div>
                <motion.p
                  className="text-2xl font-bold text-white relative z-10"
                  whileHover={{
                    scale: 1.08,
                    textShadow: `0 0 20px rgba(255, 255, 255, 0.3)`,
                  }}
                  transition={{ type: 'spring', stiffness: 400 }}
                >
                  {card.value}
                </motion.p>
              </motion.div>
            );
          })}
        </motion.div>
      </motion.div>

      {/* Tabla de Ventas */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          type: 'spring',
          stiffness: 200,
          damping: 25,
          delay: 0.8,
        }}
        className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/5 border-b border-white/10">
              <tr>
                {[
                  { key: 'fecha', label: 'Fecha' },
                  { key: 'ocRelacionada', label: 'OC' },
                  { key: 'cantidad', label: 'Cant.' },
                  { key: 'cliente', label: 'Cliente' },
                  { key: 'bovedaMonte', label: 'Bóveda Monte' },
                  { key: 'precioVenta', label: 'Precio Venta' },
                  { key: 'ingreso', label: 'Ingreso' },
                  { key: 'flete', label: 'Flete' },
                  { key: 'fleteUtilidad', label: 'Flete Utilidad' },
                  { key: 'utilidad', label: 'Utilidad' },
                  { key: 'estatus', label: 'Estatus' },
                  { key: 'concepto', label: 'Concepto' },
                ].map((col, idx) => (
                  <motion.th
                    key={col.key}
                    onClick={() => handleSort(col.key)}
                    className="px-4 py-3 text-left text-xs font-semibold text-blue-300 uppercase tracking-wider cursor-pointer hover:bg-white/10 transition-all relative group"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: 0.9 + idx * 0.03,
                      type: 'spring',
                      stiffness: 300,
                    }}
                    whileHover={{
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      scale: 1.02,
                      y: -1,
                    }}
                  >
                    <motion.div
                      className="flex items-center gap-2"
                      whileHover={{ x: 2 }}
                      transition={{ type: 'spring', stiffness: 400 }}
                    >
                      {col.label}
                      <AnimatePresence mode="wait">
                        {sortConfig?.key === col.key && (
                          <motion.span
                            initial={{ opacity: 0, scale: 0, rotate: -180 }}
                            animate={{ opacity: 1, scale: 1, rotate: 0 }}
                            exit={{ opacity: 0, scale: 0, rotate: 180 }}
                            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                          >
                            {sortConfig.direction === 'asc' ? '↑' : '↓'}
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </motion.div>
                    <motion.div
                      className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-100"
                      initial={{ scaleX: 0 }}
                      whileHover={{ scaleX: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  </motion.th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              <AnimatePresence mode="popLayout">
                {ventasFiltradas.map((venta, idx) => (
                  <motion.tr
                    key={venta.id}
                    layout
                    initial={{ opacity: 0, x: -20, scale: 0.98 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: 20, scale: 0.98 }}
                    transition={{
                      type: 'spring',
                      stiffness: 400,
                      damping: 30,
                      delay: idx * 0.02,
                    }}
                    className="hover:bg-white/5 transition-colors group cursor-default"
                    whileHover={{
                      backgroundColor: 'rgba(255, 255, 255, 0.08)',
                      boxShadow: 'inset 0 0 20px rgba(59, 130, 246, 0.1)',
                      transition: { duration: 0.2 },
                    }}
                  >
                    <motion.td
                      className="px-4 py-3 text-sm text-white"
                      whileHover={{ scale: 1.05, x: 2 }}
                      transition={{ type: 'spring', stiffness: 500 }}
                    >
                      {venta.fecha.toLocaleDateString()}
                    </motion.td>
                    <motion.td
                      className="px-4 py-3 text-sm text-blue-300 font-mono"
                      whileHover={{ scale: 1.05, x: 2, color: '#93c5fd' }}
                      transition={{ type: 'spring', stiffness: 500 }}
                    >
                      {venta.ocRelacionada}
                    </motion.td>
                    <motion.td
                      className="px-4 py-3 text-sm text-white font-semibold"
                      whileHover={{ scale: 1.1, x: 2 }}
                      transition={{ type: 'spring', stiffness: 500 }}
                    >
                      {venta.cantidad}
                    </motion.td>
                    <motion.td
                      className="px-4 py-3 text-sm text-white"
                      whileHover={{ scale: 1.05, x: 2 }}
                      transition={{ type: 'spring', stiffness: 500 }}
                    >
                      {venta.cliente}
                    </motion.td>
                    <motion.td
                      className="px-4 py-3 text-sm text-green-400"
                      whileHover={{
                        scale: 1.05,
                        x: 2,
                        textShadow: '0 0 10px rgba(74, 222, 128, 0.5)',
                      }}
                      transition={{ type: 'spring', stiffness: 500 }}
                    >
                      ${venta.bovedaMonte.toLocaleString()}
                    </motion.td>
                    <motion.td
                      className="px-4 py-3 text-sm text-blue-300"
                      whileHover={{ scale: 1.05, x: 2 }}
                      transition={{ type: 'spring', stiffness: 500 }}
                    >
                      ${venta.precioVenta.toLocaleString()}
                    </motion.td>
                    <motion.td
                      className="px-4 py-3 text-sm text-emerald-400 font-semibold"
                      whileHover={{
                        scale: 1.08,
                        x: 2,
                        textShadow: '0 0 15px rgba(52, 211, 153, 0.5)',
                      }}
                      transition={{ type: 'spring', stiffness: 500 }}
                    >
                      ${venta.ingreso.toLocaleString()}
                    </motion.td>
                    <motion.td
                      className="px-4 py-3"
                      whileHover={{ scale: 1.05 }}
                      transition={{ type: 'spring', stiffness: 500 }}
                    >
                      <motion.span
                        className={`px-2 py-1 text-xs rounded-full inline-block ${
                          venta.flete === 'Aplica'
                            ? 'bg-blue-500/20 text-blue-300'
                            : 'bg-gray-500/20 text-gray-300'
                        }`}
                        whileHover={{
                          scale: 1.1,
                          boxShadow:
                            venta.flete === 'Aplica'
                              ? '0 5px 15px rgba(59, 130, 246, 0.3)'
                              : '0 5px 15px rgba(107, 114, 128, 0.3)',
                        }}
                        transition={{ type: 'spring', stiffness: 400 }}
                      >
                        {venta.flete}
                      </motion.span>
                    </motion.td>
                    <motion.td
                      className="px-4 py-3 text-sm text-purple-400"
                      whileHover={{ scale: 1.05, x: 2 }}
                      transition={{ type: 'spring', stiffness: 500 }}
                    >
                      ${venta.fleteUtilidad.toLocaleString()}
                    </motion.td>
                    <motion.td
                      className={`px-4 py-3 text-sm font-semibold ${
                        venta.utilidad >= 0 ? 'text-green-400' : 'text-red-400'
                      }`}
                      whileHover={{
                        scale: 1.08,
                        x: 2,
                        textShadow:
                          venta.utilidad >= 0
                            ? '0 0 15px rgba(74, 222, 128, 0.5)'
                            : '0 0 15px rgba(248, 113, 113, 0.5)',
                      }}
                      transition={{ type: 'spring', stiffness: 500 }}
                    >
                      ${venta.utilidad.toLocaleString()}
                    </motion.td>
                    <motion.td
                      className="px-4 py-3"
                      whileHover={{ scale: 1.05 }}
                      transition={{ type: 'spring', stiffness: 500 }}
                    >
                      <motion.div
                        className="flex items-center gap-2"
                        whileHover={{ x: 2 }}
                        transition={{ type: 'spring', stiffness: 400 }}
                      >
                        {venta.estatus === 'Pagado' ? (
                          <>
                            <motion.div
                              animate={{
                                rotate: [0, 360],
                                scale: [1, 1.2, 1],
                              }}
                              transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: 'easeInOut',
                              }}
                            >
                              <CheckCircle className="w-4 h-4 text-green-400" />
                            </motion.div>
                            <span className="text-green-300 text-sm">Pagado</span>
                          </>
                        ) : (
                          <>
                            <motion.div
                              animate={{
                                rotate: [0, 15, -15, 0],
                              }}
                              transition={{
                                duration: 1.5,
                                repeat: Infinity,
                                ease: 'easeInOut',
                              }}
                            >
                              <Clock className="w-4 h-4 text-amber-400" />
                            </motion.div>
                            <span className="text-amber-300 text-sm">Pendiente</span>
                          </>
                        )}
                      </motion.div>
                    </motion.td>
                    <motion.td
                      className="px-4 py-3 text-sm text-gray-400 max-w-xs truncate"
                      whileHover={{ scale: 1.05, x: 2 }}
                      transition={{ type: 'spring', stiffness: 500 }}
                    >
                      {venta.concepto || '-'}
                    </motion.td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Modal Formulario */}
      <AnimatePresence>
        {showFormVenta && (
          <FormVentaLocal
            onClose={() => {
              setShowFormVenta(false);
              setVentaEditando(null);
            }}
            onSave={handleSaveVenta}
            ventaExistente={ventaEditando}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
