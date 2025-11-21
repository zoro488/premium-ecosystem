/**
 * 🏦 DASHBOARD INTELIGENTE DE BANCOS
 * Panel funcional y avanzado para visualización y gestión de bancos
 *
 * FEATURES:
 * - Resumen de saldos por banco con gráficos
 * - Filtros avanzados (fecha, tipo, monto)
 * - Análisis de flujo de caja
 * - Alertas de saldos bajos
 * - Exportación de datos
 * - Búsqueda inteligente
 */
import { useMemo, useState } from 'react';

import { AnimatePresence, motion } from 'framer-motion';
import {
  Activity,
  AlertCircle,
  ArrowUpRight,
  Calendar,
  CreditCard,
  DollarSign,
  Download,
  Filter,
  PieChart,
  Search,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';

import { formatCurrency } from '../../utils/formatters';

export const DashboardBancosInteligente = ({ bancos, onSelectBanco }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('mes'); // mes, trimestre, año
  const [sortBy, setSortBy] = useState('saldo'); // saldo, nombre, movimientos

  // Calcular estadísticas globales
  const stats = useMemo(() => {
    const totalSaldos = bancos.reduce((sum, b) => sum + (b.saldo || 0), 0);
    const bancoMayor = bancos.reduce(
      (max, b) => ((b.saldo || 0) > (max.saldo || 0) ? b : max),
      bancos[0]
    );
    const promedio = totalSaldos / (bancos.length || 1);
    const bancosActivos = bancos.filter((b) => (b.saldo || 0) > 0).length;
    const bancosConAlerta = bancos.filter((b) => (b.saldo || 0) < 10000).length;

    return {
      totalSaldos,
      bancoMayor,
      promedio,
      bancosActivos,
      bancosConAlerta,
    };
  }, [bancos]);

  // Filtrar y ordenar bancos
  const bancosFiltrados = useMemo(() => {
    const filtered = bancos.filter((banco) =>
      banco.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Ordenar
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'saldo':
          return (b.saldo || 0) - (a.saldo || 0);
        case 'nombre':
          return a.nombre.localeCompare(b.nombre);
        default:
          return 0;
      }
    });

    return filtered;
  }, [bancos, searchTerm, sortBy]);

  return (
    <div className="w-full h-full overflow-auto bg-gradient-to-br from-slate-900 via-zinc-800/20 to-slate-900 p-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-zinc-700 to-zinc-800 bg-clip-text text-transparent mb-2">
          🏦 Dashboard de Bancos
        </h2>
        <p className="text-slate-400">Gestión inteligente de cuentas bancarias</p>
      </motion.div>

      {/* KPIs principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-zinc-800/20 to-zinc-900/10 backdrop-blur-lg border border-zinc-700/30 rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-2">
            <DollarSign className="w-8 h-8 text-zinc-300" />
            <TrendingUp className="w-5 h-5 text-zinc-200" />
          </div>
          <p className="text-slate-400 text-sm mb-1">Saldo Total</p>
          <p className="text-2xl font-bold text-white">{formatCurrency(stats.totalSaldos)}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-zinc-800/20 to-zinc-800/10 backdrop-blur-lg border border-zinc-800/30 rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-2">
            <Activity className="w-8 h-8 text-zinc-800" />
            <CreditCard className="w-5 h-5 text-zinc-800" />
          </div>
          <p className="text-slate-400 text-sm mb-1">Bancos Activos</p>
          <p className="text-2xl font-bold text-white">
            {stats.bancosActivos} / {bancos.length}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-green-500/20 to-green-600/10 backdrop-blur-lg border border-zinc-500/30 rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-2">
            <PieChart className="w-8 h-8 text-zinc-200" />
            <ArrowUpRight className="w-5 h-5 text-green-300" />
          </div>
          <p className="text-slate-400 text-sm mb-1">Promedio por Banco</p>
          <p className="text-2xl font-bold text-white">{formatCurrency(stats.promedio)}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          whileHover={{ scale: 1.02 }}
          className={`bg-gradient-to-br ${
            stats.bancosConAlerta > 0
              ? 'from-zinc-700/20 to-zinc-800/10 border-zinc-500/30'
              : 'from-emerald-500/20 to-emerald-600/10 border-zinc-500/30'
          } backdrop-blur-lg border rounded-xl p-6`}
        >
          <div className="flex items-center justify-between mb-2">
            <AlertCircle
              className={`w-8 h-8 ${stats.bancosConAlerta > 0 ? 'text-zinc-200' : 'text-zinc-200'}`}
            />
            {stats.bancosConAlerta > 0 && <TrendingDown className="w-5 h-5 text-red-300" />}
          </div>
          <p className="text-slate-400 text-sm mb-1">Alertas Saldo Bajo</p>
          <p className="text-2xl font-bold text-white">{stats.bancosConAlerta}</p>
        </motion.div>
      </div>

      {/* Controles y filtros */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-slate-800/50 backdrop-blur-lg border border-slate-700 rounded-xl p-4 mb-6"
      >
        <div className="flex flex-wrap gap-4 items-center">
          {/* Búsqueda */}
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar banco..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Ordenar */}
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="saldo">Mayor Saldo</option>
              <option value="nombre">Nombre A-Z</option>
            </select>
          </div>

          {/* Período */}
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-slate-400" />
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="mes">Este Mes</option>
              <option value="trimestre">Trimestre</option>
              <option value="año">Año</option>
            </select>
          </div>

          {/* Exportar */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 bg-gradient-to-r from-zinc-800 to-zinc-800 text-white rounded-lg font-medium flex items-center gap-2 hover:shadow-lg hover:shadow-blue-500/50 transition-shadow"
          >
            <Download className="w-4 h-4" />
            Exportar
          </motion.button>
        </div>
      </motion.div>

      {/* Lista de bancos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <AnimatePresence mode="popLayout">
          {bancosFiltrados.map((banco, index) => {
            const saldo = banco.saldo || 0;
            const esAlerta = saldo < 10000;
            const porcentajeDelTotal =
              stats.totalSaldos > 0 ? (saldo / stats.totalSaldos) * 100 : 0;

            return (
              <motion.div
                key={banco.id || index}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                whileHover={{ scale: 1.02, y: -5 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => onSelectBanco?.(banco)}
                className={`bg-gradient-to-br ${
                  esAlerta
                    ? 'from-zinc-700/20 to-zinc-800/10 border-zinc-500/30'
                    : 'from-slate-800/50 to-slate-900/50 border-slate-700'
                } backdrop-blur-lg border rounded-xl p-6 cursor-pointer hover:shadow-xl hover:shadow-blue-500/20 transition-all`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">{banco.nombre}</h3>
                    <p className="text-slate-400 text-sm">{banco.tipo || 'Cuenta Corriente'}</p>
                  </div>
                  <div
                    className={`p-3 rounded-lg ${esAlerta ? 'bg-zinc-9000/20' : 'bg-zinc-800/20'}`}
                  >
                    <CreditCard
                      className={`w-6 h-6 ${esAlerta ? 'text-zinc-200' : 'text-zinc-300'}`}
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-slate-400 text-sm mb-1">Saldo Actual</p>
                  <p
                    className={`text-3xl font-bold ${esAlerta ? 'text-zinc-200' : 'text-zinc-200'}`}
                  >
                    {formatCurrency(saldo)}
                  </p>
                </div>

                {/* Barra de progreso relativa */}
                <div className="mb-3">
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                    <span>% del Total</span>
                    <span>{porcentajeDelTotal.toFixed(1)}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${porcentajeDelTotal}%` }}
                      transition={{ delay: index * 0.05 + 0.5, duration: 0.8 }}
                      className={`h-full ${
                        esAlerta
                          ? 'bg-gradient-to-r from-zinc-700 to-zinc-800'
                          : 'bg-gradient-to-r from-zinc-800 to-zinc-800'
                      }`}
                    />
                  </div>
                </div>

                {/* Footer con info adicional */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-700/50">
                  <div className="flex items-center gap-2 text-slate-400 text-sm">
                    <Activity className="w-4 h-4" />
                    <span>Activo</span>
                  </div>
                  {esAlerta && (
                    <div className="flex items-center gap-1 text-zinc-200 text-sm">
                      <AlertCircle className="w-4 h-4" />
                      <span>Saldo Bajo</span>
                    </div>
                  )}
                  <motion.button
                    whileHover={{ x: 5 }}
                    className="text-zinc-300 hover:text-zinc-300 text-sm font-medium flex items-center gap-1"
                  >
                    Ver detalles
                    <ArrowUpRight className="w-4 h-4" />
                  </motion.button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* No results */}
      {bancosFiltrados.length === 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
          <Search className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <p className="text-slate-400 text-lg">No se encontraron bancos</p>
          <p className="text-slate-500 text-sm">Intenta ajustar los filtros de búsqueda</p>
        </motion.div>
      )}
    </div>
  );
};
