/**
 * 🏦 TABLAS PREMIUM PARA PANELES DE BANCO
 * Componentes reutilizables con animaciones, interactividad y filtros avanzados
 */
import { memo, useMemo, useState } from 'react';

import { AnimatePresence, motion } from 'framer-motion';
import {
  Activity,
  ArrowDownRight,
  ArrowRightLeft,
  ArrowUpRight,
  Calendar,
  DollarSign,
  Download,
  Filter,
  Plus,
  Search,
  Trash2,
  TrendingDown,
  TrendingUp,
  User,
  X,
} from 'lucide-react';

// ============================================================================
// UTILIDADES
// ============================================================================

const formatearMoneda = (valor) => {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: 2,
  }).format(valor || 0);
};

const formatearFecha = (fecha) => {
  if (!fecha) return '-';
  return new Date(fecha).toLocaleDateString('es-MX', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

// ============================================================================
// TABLA DE INGRESOS PREMIUM
// ============================================================================

export const TablaIngresosPremium = memo(
  ({ ingresos, titulo = 'Ingresos', onAgregar, onEliminar }) => {
    const [busqueda, setBusqueda] = useState('');
    const [ordenamiento, setOrdenamiento] = useState({ campo: 'fecha', direccion: 'desc' });
    const [paginaActual, setPaginaActual] = useState(1);
    const registrosPorPagina = 10;

    // Filtrar y ordenar
    const ingresosFiltrados = useMemo(() => {
      if (!ingresos) return [];

      let resultados = [...ingresos];

      // Buscar
      if (busqueda) {
        resultados = resultados.filter(
          (ing) =>
            ing.cliente?.toLowerCase().includes(busqueda.toLowerCase()) ||
            ing.concepto?.toLowerCase().includes(busqueda.toLowerCase())
        );
      }

      // Ordenar
      resultados.sort((a, b) => {
        let valorA = a[ordenamiento.campo];
        let valorB = b[ordenamiento.campo];

        if (ordenamiento.campo === 'fecha') {
          valorA = new Date(valorA);
          valorB = new Date(valorB);
        }

        if (ordenamiento.direccion === 'asc') {
          return valorA > valorB ? 1 : -1;
        }
        return valorA < valorB ? 1 : -1;
      });

      return resultados;
    }, [ingresos, busqueda, ordenamiento]);

    // Paginación
    const totalPaginas = Math.ceil(ingresosFiltrados.length / registrosPorPagina);
    const indiceInicio = (paginaActual - 1) * registrosPorPagina;
    const indiceFin = indiceInicio + registrosPorPagina;
    const ingresosPaginados = ingresosFiltrados.slice(indiceInicio, indiceFin);

    // Estadísticas
    const totalIngresos = ingresosFiltrados.reduce((sum, ing) => sum + (ing.monto || 0), 0);
    const promedioIngreso =
      ingresosFiltrados.length > 0 ? totalIngresos / ingresosFiltrados.length : 0;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-slate-900/80 via-slate-800/80 to-slate-900/80 backdrop-blur-xl rounded-3xl border border-zinc-500/20 shadow-2xl shadow-emerald-500/10 overflow-hidden"
      >
        {/* HEADER */}
        <div className="p-6 border-b border-zinc-500/20 bg-gradient-to-r from-emerald-500/10 to-green-500/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-r from-emerald-500 to-green-500 rounded-2xl">
                <TrendingUp className="w-7 h-7 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-white">{titulo}</h2>
                <p className="text-emerald-300 text-sm mt-1">
                  {ingresosFiltrados.length} registros • Total: {formatearMoneda(totalIngresos)}
                </p>
              </div>
            </div>

            {onAgregar && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onAgregar}
                className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-xl font-semibold flex items-center gap-2 shadow-lg shadow-emerald-500/50 hover:shadow-emerald-500/70 transition-all"
              >
                <Plus className="w-5 h-5" />
                Agregar Ingreso
              </motion.button>
            )}
          </div>

          {/* ESTADÍSTICAS RÁPIDAS */}
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-zinc-500/10">
              <p className="text-emerald-300 text-sm">Total Ingresos</p>
              <p className="text-2xl font-bold text-white mt-1">{formatearMoneda(totalIngresos)}</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-zinc-500/10">
              <p className="text-emerald-300 text-sm">Promedio</p>
              <p className="text-2xl font-bold text-white mt-1">
                {formatearMoneda(promedioIngreso)}
              </p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-zinc-500/10">
              <p className="text-emerald-300 text-sm">Registros</p>
              <p className="text-2xl font-bold text-white mt-1">{ingresosFiltrados.length}</p>
            </div>
          </div>
        </div>

        {/* FILTROS Y BÚSQUEDA */}
        <div className="p-6 border-b border-zinc-500/10 bg-slate-900/50">
          <div className="flex gap-4">
            {/* Búsqueda */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-200" />
              <input
                type="text"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Buscar por cliente o concepto..."
                className="w-full pl-12 pr-4 py-3 bg-white/5 border border-zinc-500/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-zinc-500 transition-colors"
              />
              {busqueda && (
                <button
                  onClick={() => setBusqueda('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              )}
            </div>

            {/* Ordenamiento */}
            <select
              value={`${ordenamiento.campo}-${ordenamiento.direccion}`}
              onChange={(e) => {
                const [campo, direccion] = e.target.value.split('-');
                setOrdenamiento({ campo, direccion });
              }}
              className="px-4 py-3 bg-white/5 border border-zinc-500/20 rounded-xl text-white cursor-pointer focus:outline-none focus:border-zinc-500"
            >
              <option value="fecha-desc" className="bg-slate-800">
                Más recientes
              </option>
              <option value="fecha-asc" className="bg-slate-800">
                Más antiguos
              </option>
              <option value="monto-desc" className="bg-slate-800">
                Mayor monto
              </option>
              <option value="monto-asc" className="bg-slate-800">
                Menor monto
              </option>
            </select>
          </div>
        </div>

        {/* TABLA */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-zinc-500/10 bg-zinc-9000/5">
                <th className="px-6 py-4 text-left text-xs font-semibold text-emerald-300 uppercase tracking-wider">
                  Fecha
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-emerald-300 uppercase tracking-wider">
                  Cliente / Origen
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-emerald-300 uppercase tracking-wider">
                  Concepto
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-emerald-300 uppercase tracking-wider">
                  Monto
                </th>
                {onEliminar && (
                  <th className="px-6 py-4 text-center text-xs font-semibold text-emerald-300 uppercase tracking-wider">
                    Acciones
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              <AnimatePresence mode="popLayout">
                {ingresosPaginados.length === 0 ? (
                  <tr>
                    <td colSpan={onEliminar ? 5 : 4} className="px-6 py-12 text-center">
                      <TrendingUp className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                      <p className="text-gray-400 text-lg">No se encontraron ingresos</p>
                    </td>
                  </tr>
                ) : (
                  ingresosPaginados.map((ingreso, index) => (
                    <motion.tr
                      key={ingreso.id || index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: index * 0.02 }}
                      className="border-b border-zinc-500/5 hover:bg-zinc-9000/5 transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-zinc-200" />
                          <span className="text-white font-medium">
                            {formatearFecha(ingreso.fecha)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-zinc-200" />
                          <span className="text-white">
                            {ingreso.cliente || ingreso.origen || '-'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-gray-300 text-sm">{ingreso.concepto || '-'}</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <ArrowUpRight className="w-4 h-4 text-zinc-200" />
                          <span className="text-xl font-bold text-zinc-200">
                            {formatearMoneda(ingreso.monto)}
                          </span>
                        </div>
                      </td>
                      {onEliminar && (
                        <td className="px-6 py-4 text-center">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => onEliminar(ingreso.id)}
                            className="p-2 hover:bg-zinc-9000/20 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                          >
                            <Trash2 className="w-4 h-4 text-zinc-200" />
                          </motion.button>
                        </td>
                      )}
                    </motion.tr>
                  ))
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* PAGINACIÓN */}
        {totalPaginas > 1 && (
          <div className="p-6 border-t border-zinc-500/10 bg-slate-900/50">
            <div className="flex items-center justify-between">
              <p className="text-gray-400 text-sm">
                Mostrando {indiceInicio + 1} a {Math.min(indiceFin, ingresosFiltrados.length)} de{' '}
                {ingresosFiltrados.length} registros
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setPaginaActual((p) => Math.max(1, p - 1))}
                  disabled={paginaActual === 1}
                  className="px-4 py-2 bg-white/5 text-white rounded-lg hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Anterior
                </button>
                <button
                  onClick={() => setPaginaActual((p) => Math.min(totalPaginas, p + 1))}
                  disabled={paginaActual === totalPaginas}
                  className="px-4 py-2 bg-white/5 text-white rounded-lg hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Siguiente
                </button>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    );
  }
);

TablaIngresosPremium.displayName = 'TablaIngresosPremium';

// ============================================================================
// TABLA DE GASTOS PREMIUM
// ============================================================================

export const TablaGastosPremium = memo(({ gastos, titulo = 'Gastos', onAgregar, onEliminar }) => {
  const [busqueda, setBusqueda] = useState('');
  const [ordenamiento, setOrdenamiento] = useState({ campo: 'fecha', direccion: 'desc' });
  const [paginaActual, setPaginaActual] = useState(1);
  const registrosPorPagina = 10;

  // Filtrar y ordenar
  const gastosFiltrados = useMemo(() => {
    if (!gastos) return [];

    let resultados = [...gastos];

    // Buscar
    if (busqueda) {
      resultados = resultados.filter(
        (gasto) =>
          gasto.destino?.toLowerCase().includes(busqueda.toLowerCase()) ||
          gasto.concepto?.toLowerCase().includes(busqueda.toLowerCase())
      );
    }

    // Ordenar
    resultados.sort((a, b) => {
      let valorA = a[ordenamiento.campo];
      let valorB = b[ordenamiento.campo];

      if (ordenamiento.campo === 'fecha') {
        valorA = new Date(valorA);
        valorB = new Date(valorB);
      }

      if (ordenamiento.direccion === 'asc') {
        return valorA > valorB ? 1 : -1;
      }
      return valorA < valorB ? 1 : -1;
    });

    return resultados;
  }, [gastos, busqueda, ordenamiento]);

  // Paginación
  const totalPaginas = Math.ceil(gastosFiltrados.length / registrosPorPagina);
  const indiceInicio = (paginaActual - 1) * registrosPorPagina;
  const indiceFin = indiceInicio + registrosPorPagina;
  const gastosPaginados = gastosFiltrados.slice(indiceInicio, indiceFin);

  // Estadísticas
  const totalGastos = gastosFiltrados.reduce(
    (sum, gasto) => sum + (gasto.monto || gasto.gasto || 0),
    0
  );
  const promedioGasto = gastosFiltrados.length > 0 ? totalGastos / gastosFiltrados.length : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="bg-gradient-to-br from-slate-900/80 via-slate-800/80 to-slate-900/80 backdrop-blur-xl rounded-3xl border border-zinc-500/20 shadow-2xl shadow-red-500/10 overflow-hidden"
    >
      {/* HEADER */}
      <div className="p-6 border-b border-zinc-500/20 bg-gradient-to-r from-zinc-700/10 to-orange-500/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-r from-zinc-700 to-orange-500 rounded-2xl">
              <TrendingDown className="w-7 h-7 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-white">{titulo}</h2>
              <p className="text-red-300 text-sm mt-1">
                {gastosFiltrados.length} registros • Total: {formatearMoneda(totalGastos)}
              </p>
            </div>
          </div>

          {onAgregar && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onAgregar}
              className="px-6 py-3 bg-gradient-to-r from-zinc-700 to-orange-600 text-white rounded-xl font-semibold flex items-center gap-2 shadow-lg shadow-red-500/50 hover:shadow-red-500/70 transition-all"
            >
              <Plus className="w-5 h-5" />
              Agregar Gasto
            </motion.button>
          )}
        </div>

        {/* ESTADÍSTICAS RÁPIDAS */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-zinc-500/10">
            <p className="text-red-300 text-sm">Total Gastos</p>
            <p className="text-2xl font-bold text-white mt-1">{formatearMoneda(totalGastos)}</p>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-zinc-500/10">
            <p className="text-red-300 text-sm">Promedio</p>
            <p className="text-2xl font-bold text-white mt-1">{formatearMoneda(promedioGasto)}</p>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-zinc-500/10">
            <p className="text-red-300 text-sm">Registros</p>
            <p className="text-2xl font-bold text-white mt-1">{gastosFiltrados.length}</p>
          </div>
        </div>
      </div>

      {/* FILTROS Y BÚSQUEDA */}
      <div className="p-6 border-b border-zinc-500/10 bg-slate-900/50">
        <div className="flex gap-4">
          {/* Búsqueda */}
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-200" />
            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar por destino o concepto..."
              className="w-full pl-12 pr-4 py-3 bg-white/5 border border-zinc-500/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-zinc-500 transition-colors"
            />
            {busqueda && (
              <button
                onClick={() => setBusqueda('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            )}
          </div>

          {/* Ordenamiento */}
          <select
            value={`${ordenamiento.campo}-${ordenamiento.direccion}`}
            onChange={(e) => {
              const [campo, direccion] = e.target.value.split('-');
              setOrdenamiento({ campo, direccion });
            }}
            className="px-4 py-3 bg-white/5 border border-zinc-500/20 rounded-xl text-white cursor-pointer focus:outline-none focus:border-zinc-500"
          >
            <option value="fecha-desc" className="bg-slate-800">
              Más recientes
            </option>
            <option value="fecha-asc" className="bg-slate-800">
              Más antiguos
            </option>
            <option value="monto-desc" className="bg-slate-800">
              Mayor monto
            </option>
            <option value="monto-asc" className="bg-slate-800">
              Menor monto
            </option>
          </select>
        </div>
      </div>

      {/* TABLA */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-zinc-500/10 bg-zinc-9000/5">
              <th className="px-6 py-4 text-left text-xs font-semibold text-red-300 uppercase tracking-wider">
                Fecha
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-red-300 uppercase tracking-wider">
                Origen
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-red-300 uppercase tracking-wider">
                Destino
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-red-300 uppercase tracking-wider">
                Monto
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-red-300 uppercase tracking-wider">
                TC
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-red-300 uppercase tracking-wider">
                Pesos
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-red-300 uppercase tracking-wider">
                Concepto
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-red-300 uppercase tracking-wider">
                Observaciones
              </th>
              {onEliminar && (
                <th className="px-6 py-4 text-center text-xs font-semibold text-red-300 uppercase tracking-wider">
                  Acciones
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            <AnimatePresence mode="popLayout">
              {gastosPaginados.length === 0 ? (
                <tr>
                  <td colSpan={onEliminar ? 9 : 8} className="px-6 py-12 text-center">
                    <TrendingDown className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400 text-lg">No se encontraron gastos</p>
                  </td>
                </tr>
              ) : (
                gastosPaginados.map((gasto, index) => (
                  <motion.tr
                    key={gasto.id || index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.02 }}
                    className="border-b border-zinc-500/5 hover:bg-zinc-9000/5 transition-colors group"
                  >
                    {/* Fecha */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-zinc-200" />
                        <span className="text-white font-medium">
                          {formatearFecha(gasto.fecha)}
                        </span>
                      </div>
                    </td>
                    {/* ✅ Origen - CAMPO AGREGADO */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-zinc-200" />
                        <span className="text-white">
                          {gasto.origen || gasto.origenDelGastoOAbono || '-'}
                        </span>
                      </div>
                    </td>
                    {/* Destino */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-zinc-200" />
                        <span className="text-white">{gasto.destino || gasto.cliente || '-'}</span>
                      </div>
                    </td>
                    {/* Monto */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <ArrowDownRight className="w-4 h-4 text-zinc-200" />
                        <span className="text-xl font-bold text-zinc-200">
                          {formatearMoneda(gasto.monto || gasto.gasto)}
                        </span>
                      </div>
                    </td>
                    {/* ✅ TC (Tipo de Cambio) - CAMPO AGREGADO */}
                    <td className="px-6 py-4 text-right">
                      <span className="text-gray-300 text-sm">
                        {gasto.tc !== undefined && gasto.tc !== null && gasto.tc !== 0
                          ? gasto.tc.toLocaleString('es-MX', { minimumFractionDigits: 2 })
                          : '-'}
                      </span>
                    </td>
                    {/* ✅ Pesos - CAMPO AGREGADO */}
                    <td className="px-6 py-4 text-right">
                      <span className="text-gray-300 text-sm">
                        {gasto.pesos && gasto.pesos > 0
                          ? `$${gasto.pesos.toLocaleString('es-MX')}`
                          : '-'}
                      </span>
                    </td>
                    {/* Concepto */}
                    <td className="px-6 py-4">
                      <span className="text-gray-300 text-sm">{gasto.concepto || '-'}</span>
                    </td>
                    {/* ✅ Observaciones - CAMPO AGREGADO */}
                    <td className="px-6 py-4">
                      <span className="text-gray-300 text-sm truncate max-w-xs block">
                        {gasto.observaciones || '-'}
                      </span>
                    </td>
                    {onEliminar && (
                      <td className="px-6 py-4 text-center">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => onEliminar(gasto.id)}
                          className="p-2 hover:bg-zinc-9000/20 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 className="w-4 h-4 text-zinc-200" />
                        </motion.button>
                      </td>
                    )}
                  </motion.tr>
                ))
              )}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {/* PAGINACIÓN */}
      {totalPaginas > 1 && (
        <div className="p-6 border-t border-zinc-500/10 bg-slate-900/50">
          <div className="flex items-center justify-between">
            <p className="text-gray-400 text-sm">
              Mostrando {indiceInicio + 1} a {Math.min(indiceFin, gastosFiltrados.length)} de{' '}
              {gastosFiltrados.length} registros
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPaginaActual((p) => Math.max(1, p - 1))}
                disabled={paginaActual === 1}
                className="px-4 py-2 bg-white/5 text-white rounded-lg hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Anterior
              </button>
              <button
                onClick={() => setPaginaActual((p) => Math.min(totalPaginas, p + 1))}
                disabled={paginaActual === totalPaginas}
                className="px-4 py-2 bg-white/5 text-white rounded-lg hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Siguiente
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
});

TablaGastosPremium.displayName = 'TablaGastosPremium';

// ============================================================================
// TABLA DE CORTES PREMIUM (RF ACTUAL)
// ============================================================================

export const TablaCortesPremium = memo(
  ({ cortes = [], titulo = 'RF Actual', onAgregar, onEliminar }) => {
    const [busqueda, setBusqueda] = useState('');
    const [ordenamiento, setOrdenamiento] = useState('recientes');
    const [paginaActual, setPaginaActual] = useState(1);
    const registrosPorPagina = 10;

    // Filtrado y ordenamiento
    const cortesFiltrados = useMemo(() => {
      let resultado = [...cortes];

      // Búsqueda
      if (busqueda.trim()) {
        const termino = busqueda.toLowerCase();
        resultado = resultado.filter((corte) => {
          const fecha = formatearFecha(corte.fecha).toLowerCase();
          const monto = String(corte.corte || corte.monto || 0);
          return fecha.includes(termino) || monto.includes(termino);
        });
      }

      // Ordenamiento
      resultado.sort((a, b) => {
        const montoA = parseFloat(a.corte || a.monto || 0);
        const montoB = parseFloat(b.corte || b.monto || 0);
        const fechaA = new Date(a.fecha || 0).getTime();
        const fechaB = new Date(b.fecha || 0).getTime();

        switch (ordenamiento) {
          case 'recientes':
            return fechaB - fechaA;
          case 'antiguos':
            return fechaA - fechaB;
          case 'mayor':
            return montoB - montoA;
          case 'menor':
            return montoA - montoB;
          default:
            return 0;
        }
      });

      return resultado;
    }, [cortes, busqueda, ordenamiento]);

    // Estadísticas
    const estadisticas = useMemo(() => {
      const total = cortesFiltrados.reduce(
        (sum, c) => sum + parseFloat(c.corte || c.monto || 0),
        0
      );
      const promedio = cortesFiltrados.length > 0 ? total / cortesFiltrados.length : 0;
      const cantidad = cortesFiltrados.length;

      return { total, promedio, cantidad };
    }, [cortesFiltrados]);

    // Paginación
    const totalPaginas = Math.ceil(cortesFiltrados.length / registrosPorPagina);
    const indiceInicio = (paginaActual - 1) * registrosPorPagina;
    const indiceFin = indiceInicio + registrosPorPagina;
    const cortesPaginados = cortesFiltrados.slice(indiceInicio, indiceFin);

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="rounded-3xl overflow-hidden backdrop-blur-xl bg-gradient-to-br from-zinc-800/5 to-zinc-800/5 border border-zinc-500/20 shadow-2xl shadow-cyan-500/10"
      >
        {/* HEADER CON ESTADÍSTICAS */}
        <div className="p-6 bg-gradient-to-r from-zinc-800/10 to-zinc-800/10 border-b border-zinc-500/20">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <Activity className="w-7 h-7 text-zinc-300" />
                {titulo}
              </h2>
              <p className="text-gray-400 text-sm mt-1">Gestión de cortes y RF actual del banco</p>
            </div>
            {onAgregar && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onAgregar}
                className="px-6 py-3 bg-gradient-to-r from-zinc-800 to-zinc-800 text-white rounded-xl font-semibold flex items-center gap-2 shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 transition-shadow"
              >
                <Plus className="w-5 h-5" />
                Nuevo Corte
              </motion.button>
            )}
          </div>

          {/* ESTADÍSTICAS */}
          <div className="grid grid-cols-3 gap-4">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-slate-900/50 rounded-xl p-4 border border-zinc-500/20"
            >
              <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Total RF</p>
              <p className="text-2xl font-bold text-zinc-300">
                {formatearMoneda(estadisticas.total)}
              </p>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-slate-900/50 rounded-xl p-4 border border-zinc-500/20"
            >
              <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Promedio</p>
              <p className="text-2xl font-bold text-zinc-300">
                {formatearMoneda(estadisticas.promedio)}
              </p>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-slate-900/50 rounded-xl p-4 border border-zinc-500/20"
            >
              <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Registros</p>
              <p className="text-2xl font-bold text-zinc-300">{estadisticas.cantidad}</p>
            </motion.div>
          </div>
        </div>

        {/* CONTROLES DE BÚSQUEDA Y FILTROS */}
        <div className="p-6 bg-slate-900/30 border-b border-zinc-500/10">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Buscar por fecha o monto..."
                className="w-full pl-12 pr-4 py-3 bg-white/5 border border-zinc-500/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-zinc-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={ordenamiento}
                onChange={(e) => setOrdenamiento(e.target.value)}
                className="pl-12 pr-8 py-3 bg-white/5 border border-zinc-500/20 rounded-xl text-white focus:outline-none focus:border-zinc-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all appearance-none cursor-pointer"
              >
                <option value="recientes">Más recientes</option>
                <option value="antiguos">Más antiguos</option>
                <option value="mayor">Mayor monto</option>
                <option value="menor">Menor monto</option>
              </select>
            </div>
          </div>
        </div>

        {/* TABLA */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-900/50 border-b border-zinc-500/20">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Fecha
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Corte RF
                </th>
                {onEliminar && (
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Acciones
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              <AnimatePresence mode="popLayout">
                {cortesPaginados.length === 0 ? (
                  <tr>
                    <td colSpan={onEliminar ? 3 : 2} className="px-6 py-12 text-center">
                      <Activity className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                      <p className="text-gray-400 text-lg">No se encontraron cortes</p>
                    </td>
                  </tr>
                ) : (
                  cortesPaginados.map((corte, index) => {
                    const valorCorte = parseFloat(corte.corte || corte.monto || 0);
                    return (
                      <motion.tr
                        key={corte.id || index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ delay: index * 0.02 }}
                        className="border-b border-zinc-500/5 hover:bg-zinc-9000/5 transition-colors group"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-zinc-300" />
                            <span className="text-white font-medium">
                              {formatearFecha(corte.fecha)}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Activity className="w-4 h-4 text-zinc-300" />
                            <span
                              className={`text-xl font-bold ${valorCorte >= 0 ? 'text-zinc-300' : 'text-zinc-200'}`}
                            >
                              {formatearMoneda(valorCorte)}
                            </span>
                          </div>
                        </td>
                        {onEliminar && (
                          <td className="px-6 py-4 text-center">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => onEliminar(corte.id)}
                              className="p-2 hover:bg-zinc-9000/20 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                            >
                              <Trash2 className="w-4 h-4 text-zinc-200" />
                            </motion.button>
                          </td>
                        )}
                      </motion.tr>
                    );
                  })
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* PAGINACIÓN */}
        {totalPaginas > 1 && (
          <div className="p-6 border-t border-zinc-500/10 bg-slate-900/50">
            <div className="flex items-center justify-between">
              <p className="text-gray-400 text-sm">
                Mostrando {indiceInicio + 1} a {Math.min(indiceFin, cortesFiltrados.length)} de{' '}
                {cortesFiltrados.length} registros
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setPaginaActual((p) => Math.max(1, p - 1))}
                  disabled={paginaActual === 1}
                  className="px-4 py-2 bg-white/5 text-white rounded-lg hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Anterior
                </button>
                <button
                  onClick={() => setPaginaActual((p) => Math.min(totalPaginas, p + 1))}
                  disabled={paginaActual === totalPaginas}
                  className="px-4 py-2 bg-white/5 text-white rounded-lg hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Siguiente
                </button>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    );
  }
);

TablaCortesPremium.displayName = 'TablaCortesPremium';

// ============================================================================
// TABLA DE TRANSFERENCIAS PREMIUM
// ============================================================================

export const TablaTransferenciasPremium = memo(
  ({ transferencias = [], titulo = 'Transferencias', onAgregar, onEliminar }) => {
    const [busqueda, setBusqueda] = useState('');
    const [ordenamiento, setOrdenamiento] = useState('recientes');
    const [paginaActual, setPaginaActual] = useState(1);
    const registrosPorPagina = 10;

    // Filtrado y ordenamiento
    const transferenciasFiltradas = useMemo(() => {
      let resultado = [...transferencias];

      // Búsqueda
      if (busqueda.trim()) {
        const termino = busqueda.toLowerCase();
        resultado = resultado.filter((trans) => {
          const bancoOrigen = (trans.bancoOrigen || trans.origen || '').toLowerCase();
          const bancoDestino = (trans.bancoDestino || trans.destino || '').toLowerCase();
          const concepto = (trans.concepto || '').toLowerCase();
          return (
            bancoOrigen.includes(termino) ||
            bancoDestino.includes(termino) ||
            concepto.includes(termino)
          );
        });
      }

      // Ordenamiento
      resultado.sort((a, b) => {
        const montoA = parseFloat(a.monto || 0);
        const montoB = parseFloat(b.monto || 0);
        const fechaA = new Date(a.fecha || 0).getTime();
        const fechaB = new Date(b.fecha || 0).getTime();

        switch (ordenamiento) {
          case 'recientes':
            return fechaB - fechaA;
          case 'antiguos':
            return fechaA - fechaB;
          case 'mayor':
            return montoB - montoA;
          case 'menor':
            return montoA - montoB;
          default:
            return 0;
        }
      });

      return resultado;
    }, [transferencias, busqueda, ordenamiento]);

    // Estadísticas
    const estadisticas = useMemo(() => {
      const total = transferenciasFiltradas.reduce((sum, t) => sum + parseFloat(t.monto || 0), 0);
      const promedio =
        transferenciasFiltradas.length > 0 ? total / transferenciasFiltradas.length : 0;
      const cantidad = transferenciasFiltradas.length;

      return { total, promedio, cantidad };
    }, [transferenciasFiltradas]);

    // Paginación
    const totalPaginas = Math.ceil(transferenciasFiltradas.length / registrosPorPagina);
    const indiceInicio = (paginaActual - 1) * registrosPorPagina;
    const indiceFin = indiceInicio + registrosPorPagina;
    const transferenciasPaginadas = transferenciasFiltradas.slice(indiceInicio, indiceFin);

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="rounded-3xl overflow-hidden backdrop-blur-xl bg-gradient-to-br from-amber-500/5 to-orange-500/5 border border-zinc-500/20 shadow-2xl shadow-amber-500/10"
      >
        {/* HEADER CON ESTADÍSTICAS */}
        <div className="p-6 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border-b border-zinc-500/20">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <ArrowRightLeft className="w-7 h-7 text-zinc-200" />
                {titulo}
              </h2>
              <p className="text-gray-400 text-sm mt-1">Movimientos entre bancos y cuentas</p>
            </div>
            {onAgregar && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onAgregar}
                className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-semibold flex items-center gap-2 shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50 transition-shadow"
              >
                <Plus className="w-5 h-5" />
                Nueva Transferencia
              </motion.button>
            )}
          </div>

          {/* ESTADÍSTICAS */}
          <div className="grid grid-cols-3 gap-4">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-slate-900/50 rounded-xl p-4 border border-zinc-500/20"
            >
              <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">
                Total Transferido
              </p>
              <p className="text-2xl font-bold text-zinc-200">
                {formatearMoneda(estadisticas.total)}
              </p>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-slate-900/50 rounded-xl p-4 border border-zinc-500/20"
            >
              <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Promedio</p>
              <p className="text-2xl font-bold text-zinc-200">
                {formatearMoneda(estadisticas.promedio)}
              </p>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-slate-900/50 rounded-xl p-4 border border-zinc-500/20"
            >
              <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Movimientos</p>
              <p className="text-2xl font-bold text-zinc-200">{estadisticas.cantidad}</p>
            </motion.div>
          </div>
        </div>

        {/* CONTROLES DE BÚSQUEDA Y FILTROS */}
        <div className="p-6 bg-slate-900/30 border-b border-zinc-500/10">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Buscar por banco origen, destino o concepto..."
                className="w-full pl-12 pr-4 py-3 bg-white/5 border border-zinc-500/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-zinc-500/50 focus:ring-2 focus:ring-amber-500/20 transition-all"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={ordenamiento}
                onChange={(e) => setOrdenamiento(e.target.value)}
                className="pl-12 pr-8 py-3 bg-white/5 border border-zinc-500/20 rounded-xl text-white focus:outline-none focus:border-zinc-500/50 focus:ring-2 focus:ring-amber-500/20 transition-all appearance-none cursor-pointer"
              >
                <option value="recientes">Más recientes</option>
                <option value="antiguos">Más antiguos</option>
                <option value="mayor">Mayor monto</option>
                <option value="menor">Menor monto</option>
              </select>
            </div>
          </div>
        </div>

        {/* TABLA */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-900/50 border-b border-zinc-500/20">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Fecha
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Banco Origen
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Banco Destino
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Concepto
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Monto
                </th>
                {onEliminar && (
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Acciones
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              <AnimatePresence mode="popLayout">
                {transferenciasPaginadas.length === 0 ? (
                  <tr>
                    <td colSpan={onEliminar ? 6 : 5} className="px-6 py-12 text-center">
                      <ArrowRightLeft className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                      <p className="text-gray-400 text-lg">No se encontraron transferencias</p>
                    </td>
                  </tr>
                ) : (
                  transferenciasPaginadas.map((trans, index) => (
                    <motion.tr
                      key={trans.id || index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: index * 0.02 }}
                      className="border-b border-zinc-500/5 hover:bg-zinc-9000/5 transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-zinc-200" />
                          <span className="text-white font-medium">
                            {formatearFecha(trans.fecha)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <ArrowUpRight className="w-4 h-4 text-zinc-200" />
                          <span className="text-white">
                            {trans.bancoOrigen || trans.origen || '-'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <ArrowDownRight className="w-4 h-4 text-zinc-300" />
                          <span className="text-white">
                            {trans.bancoDestino || trans.destino || '-'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-gray-300 text-sm">{trans.concepto || '-'}</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <DollarSign className="w-4 h-4 text-zinc-200" />
                          <span className="text-xl font-bold text-zinc-200">
                            {formatearMoneda(trans.monto)}
                          </span>
                        </div>
                      </td>
                      {onEliminar && (
                        <td className="px-6 py-4 text-center">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => onEliminar(trans.id)}
                            className="p-2 hover:bg-zinc-9000/20 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                          >
                            <Trash2 className="w-4 h-4 text-zinc-200" />
                          </motion.button>
                        </td>
                      )}
                    </motion.tr>
                  ))
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* PAGINACIÓN */}
        {totalPaginas > 1 && (
          <div className="p-6 border-t border-zinc-500/10 bg-slate-900/50">
            <div className="flex items-center justify-between">
              <p className="text-gray-400 text-sm">
                Mostrando {indiceInicio + 1} a {Math.min(indiceFin, transferenciasFiltradas.length)}{' '}
                de {transferenciasFiltradas.length} registros
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setPaginaActual((p) => Math.max(1, p - 1))}
                  disabled={paginaActual === 1}
                  className="px-4 py-2 bg-white/5 text-white rounded-lg hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Anterior
                </button>
                <button
                  onClick={() => setPaginaActual((p) => Math.min(totalPaginas, p + 1))}
                  disabled={paginaActual === totalPaginas}
                  className="px-4 py-2 bg-white/5 text-white rounded-lg hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Siguiente
                </button>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    );
  }
);

TablaTransferenciasPremium.displayName = 'TablaTransferenciasPremium';
