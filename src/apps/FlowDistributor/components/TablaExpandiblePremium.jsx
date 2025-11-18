/**
 * 📊 TablaExpandiblePremium.jsx
 * Componente reutilizable de tabla expandible con diseño premium
 *
 * Features:
 * - Expansión/colapso animado con Framer Motion
 * - Búsqueda en tiempo real
 * - Paginación configurable
 * - Exportación a CSV
 * - Totales automáticos
 * - Diseño glassmorphism
 * - Variantes de color personalizables
 */
import { useCallback, useMemo, useState } from 'react';

import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  ChevronDown,
  ChevronUp,
  Download,
  Search,
  X,
} from 'lucide-react';
import PropTypes from 'prop-types';

/**
 * Props del componente
 * @typedef {Object} TablaExpandiblePremiumProps
 * @property {string} titulo - Título de la tabla
 * @property {Array<Object>} datos - Array de objetos con los datos
 * @property {Array<{key: string, label: string, tipo: string, align: string}>} columnas - Configuración de columnas
 * @property {string} gradienteColor - Color del gradiente (blue, red, green, purple, orange)
 * @property {boolean} expandidaPorDefecto - Si la tabla inicia expandida
 * @property {boolean} mostrarBusqueda - Mostrar barra de búsqueda
 * @property {boolean} mostrarTotales - Mostrar fila de totales
 * @property {boolean} mostrarExportar - Mostrar botón de exportar CSV
 * @property {number} filasPorPagina - Filas por página (0 = sin paginación)
 * @property {React.Component} icono - Componente de icono de Lucide
 */

const TablaExpandiblePremium = ({
  titulo = 'Tabla',
  datos = [],
  columnas = [],
  gradienteColor = 'blue',
  expandidaPorDefecto = false,
  mostrarBusqueda = true,
  mostrarTotales = true,
  mostrarExportar = true,
  filasPorPagina = 10,
  icono: Icono,
}) => {
  const [expandida, setExpandida] = useState(expandidaPorDefecto);
  const [busqueda, setBusqueda] = useState('');
  const [paginaActual, setPaginaActual] = useState(1);
  const [ordenamiento, setOrdenamiento] = useState({ columna: null, direccion: 'asc' });

  // Gradientes por color
  const gradientes = {
    blue: 'from-blue-500/20 to-cyan-500/20 border-blue-500/30',
    red: 'from-red-500/20 to-rose-500/20 border-red-500/30',
    green: 'from-emerald-500/20 to-teal-500/20 border-emerald-500/30',
    purple: 'from-purple-500/20 to-pink-500/20 border-purple-500/30',
    orange: 'from-orange-500/20 to-amber-500/20 border-orange-500/30',
  };

  const textoColor = {
    blue: 'text-blue-400',
    red: 'text-red-400',
    green: 'text-emerald-400',
    purple: 'text-purple-400',
    orange: 'text-orange-400',
  };

  // Filtrado y ordenamiento de datos
  const datosFiltradosYOrdenados = useMemo(() => {
    let resultado = [...datos];

    // Aplicar búsqueda
    if (busqueda) {
      const busquedaLower = busqueda.toLowerCase();
      resultado = resultado.filter((row) =>
        columnas.some((col) =>
          String(row[col.key] || '')
            .toLowerCase()
            .includes(busquedaLower)
        )
      );
    }

    // Aplicar ordenamiento
    if (ordenamiento.columna) {
      resultado.sort((a, b) => {
        const valorA = a[ordenamiento.columna];
        const valorB = b[ordenamiento.columna];

        // Manejo de null/undefined
        if (valorA == null && valorB == null) return 0;
        if (valorA == null) return 1;
        if (valorB == null) return -1;

        // Comparación según tipo
        const columna = columnas.find((col) => col.key === ordenamiento.columna);
        const tipo = columna?.tipo || 'texto';

        let comparacion = 0;
        if (tipo === 'moneda' || tipo === 'numero') {
          comparacion = Number.parseFloat(valorA) - Number.parseFloat(valorB);
        } else if (tipo === 'fecha') {
          comparacion = new Date(valorA).getTime() - new Date(valorB).getTime();
        } else {
          comparacion = (String(valorA) || '').localeCompare(String(valorB) || '');
        }

        return ordenamiento.direccion === 'asc' ? comparacion : -comparacion;
      });
    }

    return resultado;
  }, [datos, busqueda, columnas, ordenamiento]);

  // Paginación
  const totalPaginas = useMemo(
    () => (filasPorPagina > 0 ? Math.ceil(datosFiltradosYOrdenados.length / filasPorPagina) : 1),
    [datosFiltradosYOrdenados.length, filasPorPagina]
  );

  const datosPaginados = useMemo(() => {
    if (filasPorPagina === 0) return datosFiltradosYOrdenados;
    const inicio = (paginaActual - 1) * filasPorPagina;
    return datosFiltradosYOrdenados.slice(inicio, inicio + filasPorPagina);
  }, [datosFiltradosYOrdenados, paginaActual, filasPorPagina]);

  // Cálculo de totales
  const totales = useMemo(() => {
    if (!mostrarTotales) return {};
    const resultado = {};
    // ✅ Cambiado forEach por for...of
    for (const col of columnas) {
      if (col.tipo === 'moneda' || col.tipo === 'numero') {
        resultado[col.key] = datosFiltradosYOrdenados.reduce(
          (sum, row) => sum + (Number.parseFloat(row[col.key]) || 0),
          0
        );
      }
    }
    return resultado;
  }, [datosFiltradosYOrdenados, columnas, mostrarTotales]);

  // Formateo de valores
  const formatearValor = useCallback((valor, tipo) => {
    if (valor === null || valor === undefined || valor === '') return '-';

    switch (tipo) {
      case 'moneda':
        return `$${Number.parseFloat(valor).toLocaleString('es-MX', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`;
      case 'numero':
        return Number.parseFloat(valor).toLocaleString('es-MX', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
      case 'porcentaje':
        return `${Number.parseFloat(valor).toFixed(2)}%`;
      case 'fecha':
        return new Date(valor).toLocaleDateString('es-MX');
      default:
        return String(valor);
    }
  }, []);

  // Manejo de ordenamiento
  const handleOrdenar = useCallback((key) => {
    setOrdenamiento((prev) => ({
      columna: key,
      direccion: prev.columna === key && prev.direccion === 'asc' ? 'desc' : 'asc',
    }));
    setPaginaActual(1); // Reset a primera página
  }, []);

  // Exportar CSV
  const exportarCSV = useCallback(() => {
    const headers = columnas.map((col) => col.label).join(',');
    const rows = datosFiltradosYOrdenados
      .map((row) =>
        columnas
          .map((col) => {
            const valor = row[col.key];
            // ✅ Cambiado replace() por replaceAll()
            const valorStr = String(valor || '').replaceAll('"', '""');
            return valorStr.includes(',') ? `"${valorStr}"` : valorStr;
          })
          .join(',')
      )
      .join('\n');

    const csv = `\uFEFF${headers}\n${rows}`; // BOM para UTF-8
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    // ✅ Cambiado replace() por replaceAll()
    link.setAttribute('download', `${titulo.replaceAll(/[^a-z0-9]/gi, '_')}_${Date.now()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    // ✅ Cambiado removeChild() por remove()
    link.remove();
  }, [datosFiltradosYOrdenados, columnas, titulo]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`backdrop-blur-2xl bg-gradient-to-br ${gradientes[gradienteColor]} border rounded-2xl overflow-hidden shadow-premium-2xl`}
    >
      {/* Header de la tabla */}
      <div className="p-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {Icono && <Icono className={`w-6 h-6 ${textoColor[gradienteColor]}`} />}
          <h3 className={`text-xl font-bold ${textoColor[gradienteColor]}`}>{titulo}</h3>
          <span className="text-sm text-slate-400">
            ({datosFiltradosYOrdenados.length}{' '}
            {datosFiltradosYOrdenados.length === 1 ? 'registro' : 'registros'})
          </span>
        </div>

        <div className="flex items-center gap-3">
          {mostrarExportar && datosFiltradosYOrdenados.length > 0 && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={exportarCSV}
              className="px-4 py-2 bg-slate-700/50 hover:bg-slate-600/50 rounded-lg flex items-center gap-2 text-slate-300 text-sm transition-colors"
            >
              <Download className="w-4 h-4" />
              Exportar CSV
            </motion.button>
          )}

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setExpandida(!expandida)}
            className={`p-2 rounded-lg ${textoColor[gradienteColor]} hover:bg-white/10 transition-colors`}
          >
            {expandida ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </motion.button>
        </div>
      </div>

      {/* Contenido expandible */}
      <AnimatePresence>
        {expandida && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Barra de búsqueda */}
            {mostrarBusqueda && (
              <div className="px-6 pb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={busqueda}
                    onChange={(e) => {
                      setBusqueda(e.target.value);
                      setPaginaActual(1);
                    }}
                    placeholder="Buscar en la tabla..."
                    className="w-full pl-10 pr-10 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-slate-300 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  />
                  {busqueda && (
                    <button
                      onClick={() => {
                        setBusqueda('');
                        setPaginaActual(1);
                      }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Tabla */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-800/50 border-y border-slate-700/50">
                    {columnas.map((col) => {
                      // ✅ Extraer lógica de ternario anidado
                      const getIconoOrdenamiento = () => {
                        if (ordenamiento.columna !== col.key) {
                          return <ArrowUpDown className="w-4 h-4 text-slate-500" />;
                        }
                        if (ordenamiento.direccion === 'asc') {
                          return <ArrowUp className="w-4 h-4 text-emerald-400" />;
                        }
                        return <ArrowDown className="w-4 h-4 text-orange-400" />;
                      };

                      return (
                        <th
                          key={col.key}
                          onClick={() => handleOrdenar(col.key)}
                          className={`px-6 py-3 text-${col.align || 'left'} text-sm font-semibold text-slate-300 uppercase tracking-wider cursor-pointer hover:bg-white/5 transition-colors select-none group`}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span>{col.label}</span>
                            <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                              {getIconoOrdenamiento()}
                            </span>
                          </div>
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody>
                  {datosPaginados.length > 0 ? (
                    datosPaginados.map((row, idx) => (
                      <motion.tr
                        key={row.id || idx}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: idx * 0.02 }}
                        className="border-b border-slate-700/30 hover:bg-white/5 transition-colors"
                      >
                        {columnas.map((col) => (
                          <td
                            key={col.key}
                            className={`px-6 py-4 text-${col.align || 'left'} text-sm text-slate-300`}
                          >
                            {formatearValor(row[col.key], col.tipo)}
                          </td>
                        ))}
                      </motion.tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={columnas.length}
                        className="px-6 py-8 text-center text-slate-400"
                      >
                        No se encontraron registros
                      </td>
                    </tr>
                  )}
                </tbody>

                {/* Fila de totales */}
                {mostrarTotales && datosFiltradosYOrdenados.length > 0 && (
                  <tfoot>
                    <tr className="bg-slate-800/70 border-t-2 border-slate-600/50">
                      {columnas.map((col, idx) => {
                        // ✅ Extraer lógica de ternario anidado
                        const getContenidoTotal = () => {
                          if (idx === 0) return 'TOTALES';
                          if (totales[col.key] !== undefined) {
                            return formatearValor(totales[col.key], col.tipo);
                          }
                          return '';
                        };

                        return (
                          <td
                            key={col.key}
                            className={`px-6 py-4 text-${col.align || 'left'} font-bold ${
                              idx === 0 ? 'text-slate-400' : textoColor[gradienteColor]
                            }`}
                          >
                            {getContenidoTotal()}
                          </td>
                        );
                      })}
                    </tr>
                  </tfoot>
                )}
              </table>
            </div>

            {/* Paginación */}
            {filasPorPagina > 0 && totalPaginas > 1 && (
              <div className="p-4 flex items-center justify-between border-t border-slate-700/30">
                <p className="text-sm text-slate-400">
                  Página {paginaActual} de {totalPaginas}
                </p>
                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setPaginaActual(Math.max(1, paginaActual - 1))}
                    disabled={paginaActual === 1}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      paginaActual === 1
                        ? 'bg-slate-800/30 text-slate-600 cursor-not-allowed'
                        : 'bg-slate-700/50 text-slate-300 hover:bg-slate-600/50'
                    }`}
                  >
                    Anterior
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setPaginaActual(Math.min(totalPaginas, paginaActual + 1))}
                    disabled={paginaActual === totalPaginas}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      paginaActual === totalPaginas
                        ? 'bg-slate-800/30 text-slate-600 cursor-not-allowed'
                        : 'bg-slate-700/50 text-slate-300 hover:bg-slate-600/50'
                    }`}
                  >
                    Siguiente
                  </motion.button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// ✅ Validación de PropTypes
TablaExpandiblePremium.propTypes = {
  titulo: PropTypes.string,
  datos: PropTypes.arrayOf(PropTypes.object),
  columnas: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      tipo: PropTypes.oneOf(['texto', 'moneda', 'numero', 'fecha']),
      align: PropTypes.oneOf(['left', 'center', 'right']),
    })
  ),
  gradienteColor: PropTypes.oneOf(['blue', 'red', 'green', 'purple', 'orange']),
  expandidaPorDefecto: PropTypes.bool,
  mostrarBusqueda: PropTypes.bool,
  mostrarTotales: PropTypes.bool,
  mostrarExportar: PropTypes.bool,
  filasPorPagina: PropTypes.number,
  icono: PropTypes.elementType,
};

export default TablaExpandiblePremium;
