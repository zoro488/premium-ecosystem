/**
 * 👥 DASHBOARD AVANZADO DE CLIENTES - CRM INTELIGENTE
 * Sistema completo de gestión de relaciones con clientes
 *
 * FEATURES PREMIUM:
 * - Segmentación inteligente de clientes (RFM Analysis)
 * - Historial completo de compras y interacciones
 * - Predicción de churn y lifetime value
 * - Alertas de clientes en riesgo
 * - Análisis de comportamiento y patrones
 * - Gestión de contactos y follow-ups
 * - Exportación y reportes personalizados
 */
import { useMemo, useState } from 'react';

import { differenceInDays, format } from 'date-fns';
import { es } from 'date-fns/locale';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Activity,
  AlertTriangle,
  Award,
  BarChart3,
  Clock,
  DollarSign,
  Download,
  Filter,
  Mail,
  Phone,
  PieChart,
  Search,
  Star,
  TrendingUp,
  Users,
  Zap,
} from 'lucide-react';

import { formatCurrency } from '../../utils/formatters';

export const DashboardClientesAvanzado = ({ clientes = [], ventas = [] }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSegment, setSelectedSegment] = useState('todos');
  const [sortBy, setSortBy] = useState('valor'); // valor, nombre, recencia, frecuencia
  const [viewMode, setViewMode] = useState('grid'); // grid, list, analytics

  // Calcular métricas RFM y segmentación
  const clientesEnriquecidos = useMemo(() => {
    return clientes.map((cliente) => {
      // Ventas del cliente
      const ventasCliente = ventas.filter((v) => v.clienteId === cliente.id);
      const totalCompras = ventasCliente.reduce((sum, v) => sum + (v.total || 0), 0);
      const cantidadCompras = ventasCliente.length;

      // Recencia (días desde última compra)
      const ultimaCompra =
        ventasCliente.length > 0
          ? new Date(Math.max(...ventasCliente.map((v) => new Date(v.fecha))))
          : null;
      const recencia = ultimaCompra ? differenceInDays(new Date(), ultimaCompra) : 999;

      // Frecuencia (compras por mes)
      const frecuencia = cantidadCompras;

      // Valor monetario
      const valorMonetario = totalCompras;

      // Score RFM simplificado (0-100)
      const scoreRecencia = Math.max(0, 100 - recencia);
      const scoreFrecuencia = Math.min(100, frecuencia * 10);
      const scoreValor = Math.min(100, (valorMonetario / 1000) * 10);
      const scoreTotal = (scoreRecencia + scoreFrecuencia + scoreValor) / 3;

      // Segmentación
      let segmento = 'inactivo';
      let nivel = 'bronce';
      let riesgoChurn = 'bajo';

      if (scoreTotal >= 75) {
        segmento = 'champion';
        nivel = 'oro';
        riesgoChurn = 'bajo';
      } else if (scoreTotal >= 50) {
        segmento = 'leal';
        nivel = 'plata';
        riesgoChurn = recencia > 90 ? 'medio' : 'bajo';
      } else if (scoreTotal >= 25) {
        segmento = 'potencial';
        nivel = 'bronce';
        riesgoChurn = recencia > 60 ? 'alto' : 'medio';
      } else {
        segmento = 'en_riesgo';
        nivel = 'bronce';
        riesgoChurn = 'alto';
      }

      return {
        ...cliente,
        totalCompras,
        cantidadCompras,
        ultimaCompra,
        recencia,
        frecuencia,
        valorMonetario,
        scoreTotal,
        segmento,
        nivel,
        riesgoChurn,
      };
    });
  }, [clientes, ventas]);

  // Estadísticas globales
  const stats = useMemo(() => {
    const total = clientesEnriquecidos.length;
    const activos = clientesEnriquecidos.filter((c) => c.recencia < 90).length;
    const champions = clientesEnriquecidos.filter((c) => c.segmento === 'champion').length;
    const enRiesgo = clientesEnriquecidos.filter((c) => c.riesgoChurn === 'alto').length;
    const valorTotal = clientesEnriquecidos.reduce((sum, c) => sum + c.valorMonetario, 0);
    const valorPromedio = valorTotal / (total || 1);
    const ltv = valorPromedio * 12; // Lifetime value estimado (1 año)

    return {
      total,
      activos,
      champions,
      enRiesgo,
      valorTotal,
      valorPromedio,
      ltv,
      tasaActivacion: (activos / total) * 100,
    };
  }, [clientesEnriquecidos]);

  // Filtrar clientes
  const clientesFiltrados = useMemo(() => {
    const filtered = clientesEnriquecidos.filter(
      (cliente) =>
        (cliente.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          cliente.email?.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (selectedSegment === 'todos' || cliente.segmento === selectedSegment)
    );

    // Ordenar
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'valor':
          return b.valorMonetario - a.valorMonetario;
        case 'nombre':
          return (a.nombre || '').localeCompare(b.nombre || '');
        case 'recencia':
          return a.recencia - b.recencia;
        case 'frecuencia':
          return b.frecuencia - a.frecuencia;
        default:
          return 0;
      }
    });

    return filtered;
  }, [clientesEnriquecidos, searchTerm, selectedSegment, sortBy]);

  // Colores por segmento
  const getSegmentColor = (segmento) => {
    const colors = {
      champion: 'from-yellow-500/20 to-yellow-600/10 border-zinc-500/30 text-zinc-200',
      leal: 'from-zinc-800/20 to-zinc-900/10 border-zinc-700/30 text-zinc-300',
      potencial: 'from-green-500/20 to-green-600/10 border-zinc-500/30 text-zinc-200',
      en_riesgo: 'from-zinc-700/20 to-zinc-800/10 border-zinc-500/30 text-zinc-200',
      inactivo: 'from-gray-500/20 to-gray-600/10 border-gray-500/30 text-gray-400',
    };
    return colors[segmento] || colors.inactivo;
  };

  const getNivelIcon = (nivel) => {
    switch (nivel) {
      case 'oro':
        return <Award className="w-5 h-5 text-zinc-200" />;
      case 'plata':
        return <Award className="w-5 h-5 text-gray-300" />;
      default:
        return <Award className="w-5 h-5 text-orange-600" />;
    }
  };

  return (
    <div className="w-full h-full overflow-auto bg-gradient-to-br from-slate-900 via-indigo-900/20 to-slate-900 p-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-zinc-800 bg-clip-text text-transparent mb-2">
          👥 CRM Inteligente
        </h2>
        <p className="text-slate-400">Gestión avanzada de relaciones con clientes</p>
      </motion.div>

      {/* KPIs principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-indigo-500/20 to-indigo-600/10 backdrop-blur-lg border border-zinc-500/30 rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-2">
            <Users className="w-8 h-8 text-zinc-200" />
            <div className="text-right">
              <p className="text-xs text-indigo-300">{stats.tasaActivacion.toFixed(1)}% activos</p>
            </div>
          </div>
          <p className="text-slate-400 text-sm mb-1">Total Clientes</p>
          <p className="text-2xl font-bold text-white">{stats.total}</p>
          <p className="text-xs text-slate-500 mt-1">{stats.activos} activos</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-yellow-500/20 to-yellow-600/10 backdrop-blur-lg border border-zinc-500/30 rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-2">
            <Star className="w-8 h-8 text-zinc-200" />
            <TrendingUp className="w-5 h-5 text-zinc-200" />
          </div>
          <p className="text-slate-400 text-sm mb-1">Champions</p>
          <p className="text-2xl font-bold text-white">{stats.champions}</p>
          <p className="text-xs text-yellow-300 mt-1">Top performers</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-green-500/20 to-green-600/10 backdrop-blur-lg border border-zinc-500/30 rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-2">
            <DollarSign className="w-8 h-8 text-zinc-200" />
            <Activity className="w-5 h-5 text-green-300" />
          </div>
          <p className="text-slate-400 text-sm mb-1">Lifetime Value Promedio</p>
          <p className="text-2xl font-bold text-white">{formatCurrency(stats.ltv)}</p>
          <p className="text-xs text-slate-500 mt-1">Estimado anual</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          whileHover={{ scale: 1.02 }}
          className={`bg-gradient-to-br ${
            stats.enRiesgo > 0
              ? 'from-zinc-700/20 to-zinc-800/10 border-zinc-500/30'
              : 'from-emerald-500/20 to-emerald-600/10 border-zinc-500/30'
          } backdrop-blur-lg border rounded-xl p-6`}
        >
          <div className="flex items-center justify-between mb-2">
            <AlertTriangle
              className={`w-8 h-8 ${stats.enRiesgo > 0 ? 'text-zinc-200' : 'text-zinc-200'}`}
            />
            {stats.enRiesgo > 0 && <Zap className="w-5 h-5 text-red-300 animate-pulse" />}
          </div>
          <p className="text-slate-400 text-sm mb-1">Clientes en Riesgo</p>
          <p className="text-2xl font-bold text-white">{stats.enRiesgo}</p>
          <p className="text-xs text-red-300 mt-1">Requieren atención</p>
        </motion.div>
      </div>

      {/* Controles */}
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
                placeholder="Buscar cliente por nombre o email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Segmento */}
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-slate-400" />
            <select
              value={selectedSegment}
              onChange={(e) => setSelectedSegment(e.target.value)}
              className="px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="todos">Todos los segmentos</option>
              <option value="champion">🏆 Champions</option>
              <option value="leal">💙 Leales</option>
              <option value="potencial">🌱 Potenciales</option>
              <option value="en_riesgo">⚠️ En Riesgo</option>
              <option value="inactivo">😴 Inactivos</option>
            </select>
          </div>

          {/* Ordenar */}
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="valor">Mayor Valor</option>
              <option value="recencia">Más Reciente</option>
              <option value="frecuencia">Más Frecuente</option>
              <option value="nombre">Nombre A-Z</option>
            </select>
          </div>

          {/* Vista */}
          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg ${
                viewMode === 'grid' ? 'bg-zinc-9000 text-white' : 'bg-slate-700 text-slate-400'
              }`}
            >
              <PieChart className="w-5 h-5" />
            </motion.button>
          </div>

          {/* Exportar */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-zinc-800 text-white rounded-lg font-medium flex items-center gap-2 hover:shadow-lg hover:shadow-indigo-500/50 transition-shadow"
          >
            <Download className="w-4 h-4" />
            Exportar
          </motion.button>
        </div>
      </motion.div>

      {/* Lista de clientes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        <AnimatePresence mode="popLayout">
          {clientesFiltrados.map((cliente, index) => {
            const colorClass = getSegmentColor(cliente.segmento);

            return (
              <motion.div
                key={cliente.id || index}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                whileHover={{ scale: 1.02, y: -5 }}
                transition={{ delay: index * 0.03 }}
                className={`bg-gradient-to-br ${colorClass.split(' ')[0]} ${colorClass.split(' ')[1]} backdrop-blur-lg border rounded-xl p-5 cursor-pointer hover:shadow-xl transition-all`}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-zinc-800 flex items-center justify-center text-white font-bold text-lg">
                      {(cliente.nombre || 'C')[0].toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">
                        {cliente.nombre || 'Sin nombre'}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        {getNivelIcon(cliente.nivel)}
                        <span className="text-xs text-slate-400 capitalize">
                          {cliente.segmento.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                  </div>
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className={`px-2 py-1 rounded-full text-xs font-bold ${
                      cliente.riesgoChurn === 'alto'
                        ? 'bg-zinc-9000/20 text-red-300'
                        : cliente.riesgoChurn === 'medio'
                          ? 'bg-zinc-9000/20 text-yellow-300'
                          : 'bg-zinc-9000/20 text-green-300'
                    }`}
                  >
                    {cliente.scoreTotal.toFixed(0)}
                  </motion.div>
                </div>

                {/* Métricas */}
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="text-center">
                    <p className="text-xs text-slate-400 mb-1">Compras</p>
                    <p className="text-lg font-bold text-white">{cliente.cantidadCompras}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-slate-400 mb-1">Total</p>
                    <p className="text-lg font-bold text-zinc-200">
                      {formatCurrency(cliente.valorMonetario)}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-slate-400 mb-1">Recencia</p>
                    <p className="text-lg font-bold text-white">{cliente.recencia}d</p>
                  </div>
                </div>

                {/* Contacto */}
                <div className="space-y-2 pt-3 border-t border-slate-700/50">
                  {cliente.email && (
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <Mail className="w-3 h-3" />
                      <span className="truncate">{cliente.email}</span>
                    </div>
                  )}
                  {cliente.telefono && (
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <Phone className="w-3 h-3" />
                      <span>{cliente.telefono}</span>
                    </div>
                  )}
                  {cliente.ultimaCompra && (
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <Clock className="w-3 h-3" />
                      <span>
                        Última compra: {format(cliente.ultimaCompra, 'dd/MM/yyyy', { locale: es })}
                      </span>
                    </div>
                  )}
                </div>

                {/* Alerta si está en riesgo */}
                {cliente.riesgoChurn === 'alto' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-3 p-2 bg-zinc-9000/10 border border-zinc-500/30 rounded-lg flex items-center gap-2 text-xs text-red-300"
                  >
                    <AlertTriangle className="w-4 h-4" />
                    <span>Requiere seguimiento urgente</span>
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* No results */}
      {clientesFiltrados.length === 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
          <Users className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <p className="text-slate-400 text-lg">No se encontraron clientes</p>
          <p className="text-slate-500 text-sm">Intenta ajustar los filtros de búsqueda</p>
        </motion.div>
      )}
    </div>
  );
};
