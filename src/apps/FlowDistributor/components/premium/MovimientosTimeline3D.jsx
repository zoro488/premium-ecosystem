/**
 * ⏰ MOVIMIENTOS TIMELINE 3D
 * Timeline de movimientos con diseño 3D, parallax scroll y efectos premium
 */
import { useMemo, useState } from 'react';

import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowRightLeft,
  Calendar,
  DollarSign,
  FileText,
  Search,
  TrendingDown,
  TrendingUp,
  User,
} from 'lucide-react';

import { formatCurrency, formatDate } from '../../utils/formatters';

/**
 * Icono por tipo de movimiento
 */
const getMovimientoIcon = (tipo) => {
  switch (tipo) {
    case 'INGRESO':
    case 'TRANSFERENCIA_ENTRADA':
      return TrendingUp;
    case 'GASTO':
    case 'TRANSFERENCIA_SALIDA':
      return TrendingDown;
    case 'TRANSFERENCIA':
      return ArrowRightLeft;
    default:
      return DollarSign;
  }
};

/**
 * Color por tipo de movimiento
 */
const getMovimientoColor = (tipo) => {
  switch (tipo) {
    case 'INGRESO':
      return 'success';
    case 'GASTO':
      return 'error';
    case 'TRANSFERENCIA_ENTRADA':
      return 'info';
    case 'TRANSFERENCIA_SALIDA':
      return 'warning';
    case 'TRANSFERENCIA':
      return 'primary';
    default:
      return 'white';
  }
};

/**
 * Tarjeta de movimiento individual
 */
const MovimientoCard = ({ movimiento, index, delay = 0 }) => {
  const [isHovered, setIsHovered] = useState(false);

  const Icon = getMovimientoIcon(movimiento.tipo);
  const color = getMovimientoColor(movimiento.tipo);
  const isPositive = movimiento.impacto >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: delay + index * 0.05 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="relative"
    >
      {/* Conector de línea timeline */}
      {index > 0 && (
        <div className="absolute left-6 -top-4 w-0.5 h-4 bg-gradient-to-b from-white/10 to-white/20" />
      )}

      <motion.div
        className={`
          relative backdrop-blur-xl rounded-xl overflow-hidden
          bg-gradient-to-br from-${color}/10 via-${color}/5 to-transparent
          border border-${color}/20
          shadow-lg shadow-${color}/10
          transition-all duration-300
        `}
        whileHover={{ scale: 1.02, x: 5 }}
      >
        <div className="p-4">
          <div className="flex items-start gap-4">
            {/* Icono con efecto 3D */}
            <motion.div
              className={`
                relative flex-shrink-0 w-12 h-12 rounded-xl
                bg-gradient-to-br from-${color}/30 to-${color}/10
                border border-${color}/30
                shadow-lg shadow-${color}/20
                flex items-center justify-center
              `}
              animate={{
                rotate: isHovered ? [0, -5, 5, 0] : 0,
                scale: isHovered ? 1.1 : 1,
              }}
              transition={{ duration: 0.3 }}
            >
              <Icon className={`w-6 h-6 text-${color}`} />

              {/* Partículas alrededor del icono */}
              {isHovered && (
                <motion.div
                  className="absolute inset-0"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {[0, 90, 180, 270].map((angle) => (
                    <motion.div
                      key={angle}
                      className={`absolute w-1 h-1 rounded-full bg-${color}`}
                      style={{
                        left: '50%',
                        top: '50%',
                      }}
                      animate={{
                        x: [0, Math.cos((angle * Math.PI) / 180) * 20],
                        y: [0, Math.sin((angle * Math.PI) / 180) * 20],
                        opacity: [1, 0],
                        scale: [1, 0],
                      }}
                      transition={{
                        duration: 0.6,
                        repeat: Infinity,
                        repeatDelay: 0.2,
                      }}
                    />
                  ))}
                </motion.div>
              )}
            </motion.div>

            {/* Contenido */}
            <div className="flex-1 min-w-0">
              {/* Header */}
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex-1 min-w-0">
                  <h4 className="text-white font-semibold text-sm truncate mb-1">
                    {movimiento.concepto || movimiento.tipoDisplay || 'Sin concepto'}
                  </h4>
                  <div className="flex items-center gap-2 text-xs text-white/60">
                    <Calendar className="w-3 h-3" />
                    <span>{formatDate(movimiento.fecha)}</span>
                    {movimiento.clienteNombre && (
                      <>
                        <span className="text-white/30">•</span>
                        <User className="w-3 h-3" />
                        <span className="truncate">{movimiento.clienteNombre}</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Monto */}
                <motion.div
                  className="text-right flex-shrink-0"
                  animate={{
                    scale: isHovered ? 1.05 : 1,
                  }}
                >
                  <p className={`font-bold text-lg ${isPositive ? 'text-success' : 'text-error'}`}>
                    {isPositive ? '+' : ''}
                    {formatCurrency(movimiento.impacto || movimiento.monto || 0)}
                  </p>
                  {movimiento.categoria && (
                    <p className="text-xs text-white/40 mt-1">{movimiento.categoria}</p>
                  )}
                </motion.div>
              </div>

              {/* Detalles adicionales */}
              {(movimiento.referencia || movimiento.observaciones) && (
                <div className="flex items-start gap-2 mt-2 pt-2 border-t border-white/10">
                  <FileText className="w-3 h-3 text-white/40 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-white/60 line-clamp-2">
                    {movimiento.referencia || movimiento.observaciones}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Brillo superior */}
        <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />

        {/* Barra lateral de color */}
        <motion.div
          className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-${color} to-${color}/30`}
          animate={{
            opacity: isHovered ? 1 : 0.5,
          }}
        />
      </motion.div>

      {/* Sombra 3D */}
      <div
        className={`
          absolute -right-1 top-1 w-1 rounded-r-xl
          bg-gradient-to-b from-${color}/20 to-${color}/5
          pointer-events-none
        `}
        style={{
          height: 'calc(100% - 4px)',
          transform: 'skewY(-2deg)',
        }}
      />
    </motion.div>
  );
};

/**
 * Timeline 3D de movimientos
 */
export const MovimientosTimeline3D = ({
  movimientos = [],
  maxItems = 10,
  showFilters = true,
  className = '',
}) => {
  const [filtroTipo, setFiltroTipo] = useState('todos');
  const [busqueda, setBusqueda] = useState('');

  // Filtrar movimientos
  const movimientosFiltrados = useMemo(() => {
    let resultado = [...movimientos];

    // Filtro por tipo
    if (filtroTipo !== 'todos') {
      resultado = resultado.filter((m) => m.tipo === filtroTipo);
    }

    // Filtro por búsqueda
    if (busqueda) {
      const searchLower = busqueda.toLowerCase();
      resultado = resultado.filter(
        (m) =>
          m.concepto?.toLowerCase().includes(searchLower) ||
          m.clienteNombre?.toLowerCase().includes(searchLower) ||
          m.referencia?.toLowerCase().includes(searchLower)
      );
    }

    // Limitar cantidad
    return resultado.slice(0, maxItems);
  }, [movimientos, filtroTipo, busqueda, maxItems]);

  const tiposFiltro = [
    { value: 'todos', label: 'Todos', icon: DollarSign },
    { value: 'INGRESO', label: 'Ingresos', icon: TrendingUp },
    { value: 'GASTO', label: 'Gastos', icon: TrendingDown },
    { value: 'TRANSFERENCIA', label: 'Transferencias', icon: ArrowRightLeft },
  ];

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Filtros */}
      {showFilters && (
        <div className="flex items-center gap-3 flex-wrap">
          {/* Filtros de tipo */}
          <div className="flex items-center gap-2 bg-white/5 backdrop-blur-xl rounded-xl p-1">
            {tiposFiltro.map((tipo) => {
              const Icon = tipo.icon;
              const isActive = filtroTipo === tipo.value;

              return (
                <button
                  key={tipo.value}
                  onClick={() => setFiltroTipo(tipo.value)}
                  className={`
                    px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2
                    ${
                      isActive
                        ? 'bg-primary/20 text-primary border border-primary/30'
                        : 'text-white/60 hover:text-white hover:bg-white/5'
                    }
                  `}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm">{tipo.label}</span>
                </button>
              );
            })}
          </div>

          {/* Buscador */}
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <input
                type="text"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Buscar movimientos..."
                className="
                  w-full pl-10 pr-4 py-2 rounded-xl
                  bg-white/5 backdrop-blur-xl
                  border border-white/10
                  text-white placeholder-white/40
                  focus:outline-none focus:border-primary/50 focus:bg-white/10
                  transition-all
                "
              />
            </div>
          </div>
        </div>
      )}

      {/* Lista de movimientos */}
      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {movimientosFiltrados.length > 0 ? (
            movimientosFiltrados.map((movimiento, index) => (
              <MovimientoCard key={movimiento.id} movimiento={movimiento} index={index} />
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-12 backdrop-blur-xl bg-white/5 rounded-xl border border-white/10"
            >
              <DollarSign className="w-12 h-12 mx-auto text-white/20 mb-3" />
              <p className="text-white/60">No hay movimientos que mostrar</p>
              {busqueda && (
                <button
                  onClick={() => setBusqueda('')}
                  className="mt-2 text-primary hover:underline text-sm"
                >
                  Limpiar búsqueda
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer con contador */}
      {movimientos.length > maxItems && (
        <div className="text-center text-white/40 text-sm">
          Mostrando {movimientosFiltrados.length} de {movimientos.length} movimientos
        </div>
      )}
    </div>
  );
};

export default MovimientosTimeline3D;
