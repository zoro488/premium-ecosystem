/**
 * 🔥 WIDGET INVENTARIO HEATMAP
 *
 * Mapa de calor interactivo con D3.js mostrando:
 * - Rotación de inventario por panel
 * - Colores desde verde (rotación alta) a rojo (rotación baja)
 * - Tooltips con detalles de entrada/salida
 * - Animaciones suaves de transición
 * - Métricas de velocidad de movimiento
 *
 * @author Premium Ecosystem
 * @version 1.0.0
 */
import React, { useEffect, useRef, useState } from 'react';

import * as d3 from 'd3';
import { motion } from 'framer-motion';
import { Activity, TrendingDown, TrendingUp } from 'lucide-react';

import { getDatosCompletos } from '@/services/dataService';

// ==================== TYPES ====================

interface PanelData {
  panel: string;
  ingresos: number;
  salidas: number;
  rotacion: number; // salidas / ingresos * 100
  rfActual: number;
  velocidad: 'rápida' | 'normal' | 'lenta';
  color: string;
}

// ==================== MAIN WIDGET ====================

export const WidgetInventarioHeatmap: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [data, setData] = useState<PanelData[]>([]);
  const [selectedPanel, setSelectedPanel] = useState<PanelData | null>(null);
  const [loading, setLoading] = useState(true);

  // Cargar datos
  useEffect(() => {
    const loadData = async () => {
      try {
        const datos = await getDatosCompletos();

        const panelData: PanelData[] = datos.paneles
          .map((panel) => {
            const ingresos = panel.ingresos?.total || 0;
            const salidas = panel.salidas?.total || 0;
            const rotacion = ingresos > 0 ? (salidas / ingresos) * 100 : 0;
            const rfActual = panel.rfActual?.total || 0;

            let velocidad: 'rápida' | 'normal' | 'lenta';
            if (rotacion > 70) velocidad = 'rápida';
            else if (rotacion > 40) velocidad = 'normal';
            else velocidad = 'lenta';

            return {
              panel: panel.panel,
              ingresos,
              salidas,
              rotacion,
              rfActual,
              velocidad,
              color: '', // Se calcula en el render
            };
          })
          .filter((p) => p.ingresos > 0 || p.salidas > 0)
          .sort((a, b) => b.rotacion - a.rotacion);

        setData(panelData);
      } catch (error) {
        console.error('Error loading inventory data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Renderizar heatmap con D3
  useEffect(() => {
    if (!svgRef.current || data.length === 0) return;

    const svg = d3.select(svgRef.current);
    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;

    // Limpiar SVG
    svg.selectAll('*').remove();

    // Configurar escala de colores
    const colorScale = d3
      .scaleSequential()
      .domain([0, 100])
      .interpolator((t) => {
        if (t < 0.4) return d3.interpolateRgb('#ef4444', '#f59e0b')(t * 2.5);
        if (t < 0.7) return d3.interpolateRgb('#f59e0b', '#10b981')(t * 1.43 - 0.57);
        return d3.interpolateRgb('#10b981', '#06b6d4')((t - 0.7) * 3.33);
      });

    // Calcular dimensiones de los rectángulos
    const cols = Math.ceil(Math.sqrt(data.length));
    const rows = Math.ceil(data.length / cols);
    const cellWidth = (width - 40) / cols;
    const cellHeight = (height - 40) / rows;

    // Crear grupo principal
    const g = svg.append('g').attr('transform', 'translate(20, 20)');

    // Renderizar celdas
    const cells = g
      .selectAll('.cell')
      .data(data)
      .enter()
      .append('g')
      .attr('class', 'cell')
      .attr('transform', (d, i) => {
        const col = i % cols;
        const row = Math.floor(i / cols);
        return `translate(${col * cellWidth}, ${row * cellHeight})`;
      })
      .style('cursor', 'pointer')
      .on('mouseenter', function (event, d) {
        d3.select(this).select('rect').transition().duration(200).attr('stroke-width', 3);

        setSelectedPanel(d);
      })
      .on('mouseleave', function () {
        d3.select(this).select('rect').transition().duration(200).attr('stroke-width', 1);
      });

    // Rectángulos
    cells
      .append('rect')
      .attr('width', cellWidth - 4)
      .attr('height', cellHeight - 4)
      .attr('rx', 8)
      .attr('fill', (d) => colorScale(d.rotacion))
      .attr('stroke', '#8b5cf6')
      .attr('stroke-width', 1)
      .attr('opacity', 0)
      .transition()
      .duration(800)
      .delay((d, i) => i * 50)
      .attr('opacity', 0.9);

    // Texto principal (nombre del panel)
    cells
      .append('text')
      .attr('x', (cellWidth - 4) / 2)
      .attr('y', (cellHeight - 4) / 2 - 10)
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .attr('fill', 'white')
      .attr('font-size', '12px')
      .attr('font-weight', 'bold')
      .attr('opacity', 0)
      .text((d) => {
        const maxLength = Math.floor(cellWidth / 8);
        return d.panel.length > maxLength ? d.panel.substring(0, maxLength - 2) + '...' : d.panel;
      })
      .transition()
      .duration(800)
      .delay((d, i) => i * 50 + 200)
      .attr('opacity', 1);

    // Texto secundario (rotación %)
    cells
      .append('text')
      .attr('x', (cellWidth - 4) / 2)
      .attr('y', (cellHeight - 4) / 2 + 10)
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .attr('fill', 'rgba(255,255,255,0.8)')
      .attr('font-size', '16px')
      .attr('font-weight', 'bold')
      .attr('opacity', 0)
      .text((d) => `${d.rotacion.toFixed(0)}%`)
      .transition()
      .duration(800)
      .delay((d, i) => i * 50 + 400)
      .attr('opacity', 1);

    // Badge de velocidad
    cells
      .append('text')
      .attr('x', (cellWidth - 4) / 2)
      .attr('y', 12)
      .attr('text-anchor', 'middle')
      .attr('fill', 'rgba(255,255,255,0.6)')
      .attr('font-size', '8px')
      .attr('text-transform', 'uppercase')
      .text((d) => d.velocidad)
      .attr('opacity', 0)
      .transition()
      .duration(800)
      .delay((d, i) => i * 50 + 600)
      .attr('opacity', 1);
  }, [data]);

  // Calcular métricas
  const avgRotacion =
    data.length > 0 ? data.reduce((sum, d) => sum + d.rotacion, 0) / data.length : 0;

  const rapidCount = data.filter((d) => d.velocidad === 'rápida').length;
  const slowCount = data.filter((d) => d.velocidad === 'lenta').length;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative h-full flex flex-col overflow-hidden rounded-2xl backdrop-blur-xl bg-gradient-to-br from-slate-900/90 via-purple-900/40 to-slate-900/90 border border-purple-500/20"
    >
      {/* Header */}
      <div className="p-4 border-b border-purple-500/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-orange-500/20 border border-orange-500/30">
              <Activity className="w-5 h-5 text-orange-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Rotación de Inventario</h3>
              <p className="text-xs text-slate-400">Mapa de Calor por Panel</p>
            </div>
          </div>
        </div>

        {/* Métricas */}
        <div className="grid grid-cols-3 gap-2 mt-3">
          <div className="p-2 rounded-lg bg-slate-800/50">
            <div className="text-xs text-slate-400">Promedio</div>
            <div className="text-lg font-bold text-purple-400">{avgRotacion.toFixed(1)}%</div>
          </div>
          <div className="p-2 rounded-lg bg-slate-800/50">
            <div className="text-xs text-slate-400 flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-green-400" />
              Rápida
            </div>
            <div className="text-lg font-bold text-green-400">{rapidCount}</div>
          </div>
          <div className="p-2 rounded-lg bg-slate-800/50">
            <div className="text-xs text-slate-400 flex items-center gap-1">
              <TrendingDown className="w-3 h-3 text-red-400" />
              Lenta
            </div>
            <div className="text-lg font-bold text-red-400">{slowCount}</div>
          </div>
        </div>
      </div>

      {/* Heatmap */}
      <div className="flex-1 p-4 relative">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-orange-500/30 border-t-orange-500 rounded-full animate-spin mx-auto mb-3" />
              <div className="text-slate-400 text-sm">Analizando rotación...</div>
            </div>
          </div>
        ) : (
          <svg ref={svgRef} className="w-full h-full" />
        )}
      </div>

      {/* Panel seleccionado */}
      {selectedPanel && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-slate-900/95 backdrop-blur-sm border border-purple-500/30"
        >
          <div className="flex items-start justify-between mb-2">
            <div>
              <div className="text-white font-bold">{selectedPanel.panel}</div>
              <div className="text-xs text-slate-400 mt-1 flex items-center gap-2">
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-bold ${
                    selectedPanel.velocidad === 'rápida'
                      ? 'bg-green-500/20 text-green-400'
                      : selectedPanel.velocidad === 'normal'
                        ? 'bg-yellow-500/20 text-yellow-400'
                        : 'bg-red-500/20 text-red-400'
                  }`}
                >
                  {selectedPanel.velocidad}
                </span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-purple-400">
                {selectedPanel.rotacion.toFixed(1)}%
              </div>
              <div className="text-xs text-slate-400">Rotación</div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 mt-3">
            <div>
              <div className="text-xs text-slate-400">Ingresos</div>
              <div className="text-sm font-bold text-green-400">
                {selectedPanel.ingresos.toLocaleString()}
              </div>
            </div>
            <div>
              <div className="text-xs text-slate-400">Salidas</div>
              <div className="text-sm font-bold text-orange-400">
                {selectedPanel.salidas.toLocaleString()}
              </div>
            </div>
            <div>
              <div className="text-xs text-slate-400">RF Actual</div>
              <div className="text-sm font-bold text-blue-400">
                ${(selectedPanel.rfActual / 1000).toFixed(1)}K
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Leyenda */}
      <div className="p-3 border-t border-purple-500/20">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              <div className="w-12 h-3 bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 to-cyan-500 rounded" />
            </div>
            <span className="text-slate-400">0% → 100% Rotación</span>
          </div>
          <div className="text-slate-500">{data.length} paneles</div>
        </div>
      </div>
    </motion.div>
  );
};

export default WidgetInventarioHeatmap;
