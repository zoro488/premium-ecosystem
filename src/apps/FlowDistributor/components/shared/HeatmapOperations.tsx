/**
 * 🗺️ HEATMAP OPERATIONS - Mapa de Calor de Operaciones
 *
 * Visualización de mapa de calor para analizar patrones
 * de operaciones por día y hora
 *
 * Features:
 * - Heatmap interactivo
 * - Tooltips con detalles
 * - Gradiente de colores según intensidad
 * - Animaciones fluidas
 *
 * @version 1.0.0
 */
import { memo, useMemo } from 'react';

import { motion } from 'framer-motion';
import { Activity, TrendingUp } from 'lucide-react';

// Design System
import animations from '../../design-system/animations';

// Utils

interface HeatmapOperationsProps {
  data: {
    ventas: any[];
    ordenesCompra: any[];
  };
}

export const HeatmapOperations = memo<HeatmapOperationsProps>(({ data }) => {
  // Procesar datos para heatmap
  const heatmapData = useMemo(() => {
    const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    const hours = Array.from({ length: 24 }, (_, i) => i);

    // Inicializar matriz 7x24
    const matrix: number[][] = Array(7)
      .fill(0)
      .map(() => Array(24).fill(0));

    // Validar que data existe y tiene las propiedades necesarias
    const ventas = Array.isArray(data?.ventas) ? data.ventas : [];
    const ordenesCompra = Array.isArray(data?.ordenesCompra) ? data.ordenesCompra : [];

    // Contar operaciones por día/hora
    [...ventas, ...ordenesCompra].forEach((item) => {
      if (!item?.fecha) return;

      try {
        const date = new Date(item.fecha);

        // Validar que la fecha es válida
        if (isNaN(date.getTime())) return;

        const day = date.getDay(); // 0-6
        const hour = date.getHours(); // 0-23

        // Validar índices
        if (day >= 0 && day < 7 && hour >= 0 && hour < 24) {
          matrix[day][hour] += 1;
        }
      } catch (error) {
        console.warn('Error procesando fecha:', item.fecha, error);
      }
    });

    // Encontrar máximo para normalización
    const max = Math.max(...matrix.flat(), 0);

    return {
      days,
      hours,
      matrix,
      max,
    };
  }, [data]);

  // Obtener color según intensidad
  const getColor = (value: number) => {
    if (!value || value === 0 || heatmapData.max === 0) return 'rgba(59, 130, 246, 0.1)';

    const intensity = value / heatmapData.max;

    if (intensity === 0) return 'rgba(255, 255, 255, 0.05)';
    if (intensity < 0.2) return 'rgba(59, 130, 246, 0.2)';
    if (intensity < 0.4) return 'rgba(59, 130, 246, 0.4)';
    if (intensity < 0.6) return 'rgba(168, 85, 247, 0.6)';
    if (intensity < 0.8) return 'rgba(236, 72, 153, 0.8)';
    return 'rgba(239, 68, 68, 1)';
  };

  // Si no hay datos, mostrar mensaje
  const totalOperations = heatmapData.matrix.flat().reduce((a, b) => a + b, 0);

  if (totalOperations === 0) {
    return (
      <motion.div
        variants={animations.card.glassCard}
        initial="initial"
        animate="animate"
        className="p-6 rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10"
      >
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5 text-purple-400" />
          Mapa de Calor de Operaciones
        </h3>
        <p className="text-sm text-white/40 text-center py-8">
          No hay suficientes datos para generar el mapa de calor
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={animations.card.glassCard}
      initial="initial"
      animate="animate"
      className="p-6 rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10"
    >
      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <Activity className="w-5 h-5 text-purple-400" />
        Mapa de Calor de Operaciones
      </h3>

      <p className="text-sm text-white/60 mb-6">
        Patrones de actividad por día de la semana y hora del día
      </p>

      {/* Heatmap Grid */}
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full">
          {/* Hours Header */}
          <div className="flex mb-2">
            <div className="w-12 flex-shrink-0" /> {/* Spacer para días */}
            <div className="flex-1 flex justify-between px-2">
              {[0, 6, 12, 18, 23].map((hour) => (
                <span
                  key={hour}
                  className="text-xs text-white/40"
                  style={{ width: '20%', textAlign: 'center' }}
                >
                  {hour}:00
                </span>
              ))}
            </div>
          </div>

          {/* Heatmap Rows */}
          <div className="space-y-1.5">
            {heatmapData.days.map((day, dayIndex) => {
              const dayData = heatmapData.matrix[dayIndex] || [];

              return (
                <div key={day} className="flex items-center gap-2">
                  {/* Day Label */}
                  <div className="w-12 text-xs text-white/60 font-medium flex-shrink-0">{day}</div>

                  {/* Hour Cells */}
                  <div className="flex-1 flex gap-1">
                    {dayData.map((value, hourIndex) => (
                      <motion.div
                        key={`${dayIndex}-${hourIndex}`}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{
                          delay: (dayIndex * 24 + hourIndex) * 0.005,
                          duration: 0.2,
                        }}
                        whileHover={{ scale: 1.2, zIndex: 10 }}
                        className="group relative flex-1 aspect-square rounded-sm cursor-pointer"
                        style={{
                          backgroundColor: getColor(value),
                        }}
                        title={`${day} ${hourIndex}:00 - ${value} operaciones`}
                      >
                        {/* Tooltip on Hover */}
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          whileHover={{ opacity: 1, y: 0 }}
                          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 rounded-lg bg-slate-900 border border-white/20 shadow-xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20"
                        >
                          <p className="text-xs text-white font-medium">
                            {day} {hourIndex}:00
                          </p>
                          <p className="text-xs text-white/60">{value} operaciones</p>
                        </motion.div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="mt-6 pt-6 border-t border-white/10">
            <div className="flex items-center justify-between">
              <span className="text-xs text-white/50">Menos actividad</span>
              <div className="flex gap-1">
                {[0, 0.2, 0.4, 0.6, 0.8, 1].map((intensity, index) => (
                  <div
                    key={index}
                    className="w-6 h-4 rounded-sm"
                    style={{
                      backgroundColor: getColor(intensity * heatmapData.max),
                    }}
                  />
                ))}
              </div>
              <span className="text-xs text-white/50">Más actividad</span>
            </div>
          </div>

          {/* Insights */}
          <div className="mt-4 p-4 rounded-lg bg-white/5">
            <h4 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-cyan-400" />
              Insights
            </h4>
            <ul className="space-y-1 text-xs text-white/60">
              <li>
                • Día más activo:{' '}
                <span className="text-white">
                  {
                    heatmapData.days[
                      heatmapData.matrix
                        .map((row, idx) => ({ idx, sum: row.reduce((a, b) => a + b, 0) }))
                        .sort((a, b) => b.sum - a.sum)[0]?.idx || 0
                    ]
                  }
                </span>
              </li>
              <li>
                • Hora pico:{' '}
                <span className="text-white">
                  {(() => {
                    const hourSums = Array(24)
                      .fill(0)
                      .map((_, hour) =>
                        heatmapData.matrix.reduce((sum, day) => sum + day[hour], 0)
                      );
                    const peakHour = hourSums.indexOf(Math.max(...hourSums));
                    return `${peakHour}:00 - ${peakHour + 1}:00`;
                  })()}
                </span>
              </li>
              <li>
                • Total operaciones:{' '}
                <span className="text-white">
                  {heatmapData.matrix.flat().reduce((a, b) => a + b, 0)}
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </motion.div>
  );
});

HeatmapOperations.displayName = 'HeatmapOperations';

export default HeatmapOperations;
