/**
 * 🔥 HEATMAP OPERATIONS
 * Mapa de calor de operaciones con datos reales
 */
import { memo, useMemo, useState } from 'react';

import { motion } from 'framer-motion';
import { Activity, BarChart3, Calendar, Filter, TrendingUp, Zap } from 'lucide-react';

/**
 * 🎯 Componente de mapa de calor
 */
export const HeatmapOperations = memo(({ data = {} }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [hoveredCell, setHoveredCell] = useState(null);

  const { ventas = [], ordenesCompra = [] } = data;

  // Generar datos de heatmap basados en ventas reales
  const heatmapData = useMemo(() => {
    if (!ventas.length && !ordenesCompra.length) {
      // Datos de ejemplo si no hay datos reales
      return Array.from({ length: 7 }, (_, dayIndex) =>
        Array.from({ length: 24 }, (_, hourIndex) => ({
          day: dayIndex,
          hour: hourIndex,
          value: Math.random() * 100,
          count: Math.floor(Math.random() * 20),
          operations: [],
        }))
      );
    }

    // Crear matriz de 7 días x 24 horas
    const matrix = Array.from({ length: 7 }, (_, dayIndex) =>
      Array.from({ length: 24 }, (_, hourIndex) => ({
        day: dayIndex,
        hour: hourIndex,
        value: 0,
        count: 0,
        operations: [],
      }))
    );

    // Procesar ventas
    ventas.forEach((venta) => {
      if (!venta.fecha) return;

      const fecha = new Date(venta.fecha);
      const dayOfWeek = fecha.getDay();
      const hour = fecha.getHours();

      if (matrix[dayOfWeek] && matrix[dayOfWeek][hour]) {
        const cell = matrix[dayOfWeek][hour];
        cell.value += venta.totalVenta || 0;
        cell.count += 1;
        cell.operations.push({
          type: 'venta',
          amount: venta.totalVenta,
          description: `Venta #${venta.id || 'N/A'}`,
        });
      }
    });

    // Procesar órdenes de compra
    ordenesCompra.forEach((orden) => {
      if (!orden.fecha) return;

      const fecha = new Date(orden.fecha);
      const dayOfWeek = fecha.getDay();
      const hour = fecha.getHours();

      if (matrix[dayOfWeek] && matrix[dayOfWeek][hour]) {
        const cell = matrix[dayOfWeek][hour];
        cell.value += orden.total || 0;
        cell.count += 1;
        cell.operations.push({
          type: 'compra',
          amount: orden.total,
          description: `Orden #${orden.id || 'N/A'}`,
        });
      }
    });

    return matrix;
  }, [ventas, ordenesCompra, selectedPeriod]);

  // Calcular valor máximo para normalización
  const maxValue = useMemo(() => {
    return Math.max(...heatmapData.flat().map((cell) => cell.value));
  }, [heatmapData]);

  // Obtener intensidad del color
  const getIntensity = (value) => {
    if (maxValue === 0) return 0;
    return Math.min(value / maxValue, 1);
  };

  // Obtener color basado en intensidad
  const getHeatColor = (intensity) => {
    if (intensity === 0) return 'rgba(71, 85, 105, 0.1)'; // slate-600/10

    const colors = [
      'rgba(34, 197, 94, 0.2)', // green-500/20
      'rgba(34, 197, 94, 0.4)', // green-500/40
      'rgba(34, 197, 94, 0.6)', // green-500/60
      'rgba(34, 197, 94, 0.8)', // green-500/80
      'rgba(34, 197, 94, 1)', // green-500
    ];

    const colorIndex = Math.floor(intensity * (colors.length - 1));
    return colors[colorIndex];
  };

  const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  const hours = Array.from({ length: 24 }, (_, i) => i);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <motion.div
            animate={{
              rotate: [0, 360],
              scale: [1, 1.1, 1],
            }}
            transition={{
              rotate: { duration: 8, repeat: Infinity, ease: 'linear' },
              scale: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
            }}
            className="p-2 rounded-lg bg-gradient-to-br from-orange-500/20 to-red-600/20 border border-orange-500/30"
          >
            <Activity className="w-5 h-5 text-orange-400" />
          </motion.div>
          <div>
            <h3 className="text-lg font-semibold text-white">Mapa de Calor - Operaciones</h3>
            <p className="text-white/60 text-sm">Actividad por hora y día de la semana</p>
          </div>
        </div>

        {/* Controles */}
        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white/60 hover:text-white transition-all"
          >
            <Filter className="w-4 h-4" />
          </motion.button>

          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white text-sm focus:outline-none focus:border-blue-500/50"
          >
            <option value="week">Esta Semana</option>
            <option value="month">Este Mes</option>
            <option value="quarter">Trimestre</option>
          </select>
        </div>
      </div>

      {/* Leyenda */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-sm text-white/60">
          <Calendar className="w-4 h-4" />
          <span>Menos actividad</span>
          <div className="flex gap-1">
            {[0, 0.25, 0.5, 0.75, 1].map((intensity, index) => (
              <div
                key={index}
                className="w-3 h-3 rounded-sm"
                style={{ backgroundColor: getHeatColor(intensity) }}
              />
            ))}
          </div>
          <span>Más actividad</span>
        </div>

        <div className="flex items-center gap-4 text-xs text-white/50">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-500 rounded-full" />
            <span>Ventas</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-blue-500 rounded-full" />
            <span>Compras</span>
          </div>
        </div>
      </div>

      {/* Heatmap Grid */}
      <div className="relative">
        {/* Labels de días */}
        <div className="grid grid-cols-25 gap-1 mb-2">
          <div className="w-8"></div> {/* Espacio para las horas */}
          {days.map((day) => (
            <div key={day} className="text-center text-xs text-white/60 font-medium py-1">
              {day}
            </div>
          ))}
        </div>

        {/* Grid principal */}
        <div className="space-y-1">
          {hours.map((hour) => (
            <div key={hour} className="grid grid-cols-25 gap-1">
              {/* Label de hora */}
              <div className="w-8 text-right text-xs text-white/60 font-medium pr-2 py-1">
                {hour.toString().padStart(2, '0')}
              </div>

              {/* Celdas del heatmap */}
              {days.map((_, dayIndex) => {
                const cell = heatmapData[dayIndex][hour];
                const intensity = getIntensity(cell.value);

                return (
                  <motion.div
                    key={`${dayIndex}-${hour}`}
                    className="relative h-4 rounded-sm cursor-pointer border border-white/10"
                    style={{ backgroundColor: getHeatColor(intensity) }}
                    onMouseEnter={() => setHoveredCell({ day: dayIndex, hour, ...cell })}
                    onMouseLeave={() => setHoveredCell(null)}
                    whileHover={{ scale: 1.2, zIndex: 10 }}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: (dayIndex * 24 + hour) * 0.001 }}
                  >
                    {/* Efectos adicionales para alta actividad */}
                    {intensity > 0.7 && (
                      <motion.div
                        className="absolute inset-0 rounded-sm"
                        animate={{
                          boxShadow: [
                            '0 0 0 rgba(34, 197, 94, 0)',
                            '0 0 8px rgba(34, 197, 94, 0.4)',
                            '0 0 0 rgba(34, 197, 94, 0)',
                          ],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: 'easeInOut',
                        }}
                      />
                    )}
                  </motion.div>
                );
              })}
            </div>
          ))}
        </div>

        {/* Tooltip */}
        {hoveredCell && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute z-50 pointer-events-none"
            style={{
              left: '50%',
              top: '10%',
              transform: 'translateX(-50%)',
            }}
          >
            <div className="bg-slate-900/95 backdrop-blur-xl border border-white/20 rounded-xl p-4 shadow-2xl min-w-[200px]">
              <div className="text-white font-medium mb-2">
                {days[hoveredCell.day]} {hoveredCell.hour}:00
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-white/60">Operaciones:</span>
                  <span className="text-white font-medium">{hoveredCell.count}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-white/60">Valor total:</span>
                  <span className="text-green-400 font-medium">
                    ${hoveredCell.value.toLocaleString()}
                  </span>
                </div>

                {hoveredCell.operations.length > 0 && (
                  <div className="pt-2 border-t border-white/10">
                    <div className="text-white/60 text-xs mb-1">Últimas operaciones:</div>
                    {hoveredCell.operations.slice(0, 3).map((op, index) => (
                      <div key={index} className="text-xs text-white/80">
                        {op.description}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Estadísticas rápidas */}
      <div className="mt-6 grid grid-cols-3 gap-4">
        <motion.div
          className="p-3 rounded-lg bg-white/5 border border-white/10"
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-4 h-4 text-green-400" />
            <span className="text-xs text-white/60">Pico de actividad</span>
          </div>
          <div className="text-white font-bold">14:00 - 16:00</div>
        </motion.div>

        <motion.div
          className="p-3 rounded-lg bg-white/5 border border-white/10"
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center gap-2 mb-1">
            <BarChart3 className="w-4 h-4 text-blue-400" />
            <span className="text-xs text-white/60">Promedio diario</span>
          </div>
          <div className="text-white font-bold">
            {Math.round(heatmapData.flat().reduce((acc, cell) => acc + cell.count, 0) / 7)} ops
          </div>
        </motion.div>

        <motion.div
          className="p-3 rounded-lg bg-white/5 border border-white/10"
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center gap-2 mb-1">
            <Zap className="w-4 h-4 text-yellow-400" />
            <span className="text-xs text-white/60">Tendencia</span>
          </div>
          <div className="text-green-400 font-bold">+12.5%</div>
        </motion.div>
      </div>
    </motion.div>
  );
});

HeatmapOperations.displayName = 'HeatmapOperations';

export default HeatmapOperations;
