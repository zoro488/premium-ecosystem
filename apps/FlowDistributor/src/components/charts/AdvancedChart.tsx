/**
 * 📊 ADVANCED CHARTS - Gráficos avanzados con ECharts
 *
 * Implementa tipos de gráficos complejos:
 * - 🕸️ Radar Charts (Análisis multidimensional)
 * - 🎯 Scatter Plots (Correlaciones y clusters)
 * - 🔥 Heatmaps (Mapas de calor)
 * - 🌳 Treemaps (Jerarquías y proporciones)
 * - 🌊 Sankey Diagrams (Flujos y relaciones)
 *
 * Con animaciones ultra-fluidas y transiciones avanzadas
 */

import { init, type EChartsOption } from 'echarts';
import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

export type ChartType = 'radar' | 'scatter' | 'heatmap' | 'treemap' | 'sankey' | 'gauge' | 'funnel';

interface AdvancedChartProps {
  type: ChartType;
  data: unknown;
  title?: string;
  className?: string;
  height?: number;
  animationDelay?: number;
}

/**
 * Componente de gráficos avanzados con ECharts
 */
export function AdvancedChart({
  type,
  data,
  title,
  className = '',
  height = 400,
  animationDelay = 0,
}: AdvancedChartProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const chartInstance = useRef<ReturnType<typeof init> | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    // Inicializar ECharts con tema dark
    chartInstance.current = init(chartRef.current, 'dark', {
      renderer: 'canvas',
      useDirtyRect: true,
    });

    // Configurar opciones según el tipo
    const option = getChartOption(type, data, title);
    chartInstance.current.setOption(option, true);

    setIsLoaded(true);

    // Resize handler
    const handleResize = () => {
      chartInstance.current?.resize();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chartInstance.current?.dispose();
    };
  }, [type, data, title]);

  return (
    <motion.div
      className={`relative w-full ${className}`}
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: isLoaded ? 1 : 0, y: 0, scale: 1 }}
      transition={{
        duration: 0.6,
        delay: animationDelay,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      style={{ height: `${height}px` }}
    >
      {/* Glow Background */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-neon-cyan/5 via-neon-purple/5 to-neon-blue/5 rounded-xl blur-xl"
        animate={{
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Chart Container */}
      <div
        ref={chartRef}
        className="relative w-full h-full rounded-xl bg-chronos-charcoal/50 backdrop-blur-sm border border-white/10"
        style={{ height: `${height}px` }}
      />

      {/* Loading Overlay */}
      {!isLoaded && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center bg-chronos-charcoal/80 backdrop-blur-sm rounded-xl"
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
        >
          <div className="flex gap-2">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-3 h-3 bg-neon-cyan rounded-full"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [1, 0.5, 1],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 1,
                  delay: i * 0.2,
                }}
              />
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

/**
 * Genera la configuración de ECharts según el tipo de gráfico
 */
function getChartOption(type: ChartType, data: unknown, title?: string): EChartsOption {
  const baseOption: EChartsOption = {
    backgroundColor: 'transparent',
    title: title
      ? {
          text: title,
          left: 'center',
          top: 20,
          textStyle: {
            color: '#e5e7eb',
            fontSize: 18,
            fontWeight: 'bold',
          },
        }
      : undefined,
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      borderColor: 'rgba(0, 217, 255, 0.5)',
      borderWidth: 1,
      textStyle: {
        color: '#e5e7eb',
      },
    },
    animation: true,
    animationDuration: 1000,
    animationEasing: 'cubicOut',
  };

  switch (type) {
    case 'radar':
      return {
        ...baseOption,
        radar: {
          indicator: (data as { indicator: { name: string; max: number }[] }).indicator || [
            { name: 'Ventas', max: 100 },
            { name: 'Clientes', max: 100 },
            { name: 'Productos', max: 100 },
            { name: 'Satisfacción', max: 100 },
            { name: 'Rentabilidad', max: 100 },
          ],
          center: ['50%', '55%'],
          radius: '60%',
          axisLine: {
            lineStyle: {
              color: 'rgba(0, 217, 255, 0.2)',
            },
          },
          splitLine: {
            lineStyle: {
              color: 'rgba(139, 92, 246, 0.2)',
            },
          },
          splitArea: {
            areaStyle: {
              color: ['rgba(0, 217, 255, 0.05)', 'rgba(139, 92, 246, 0.05)'],
            },
          },
        },
        series: [
          {
            type: 'radar',
            data: (data as { series: Array<{
              value: number[];
              name: string;
              areaStyle: Record<string, unknown>;
              lineStyle: Record<string, unknown>;
              itemStyle: Record<string, unknown>;
            }> }).series || [
              {
                value: [80, 90, 70, 85, 75],
                name: 'Desempeño',
                areaStyle: {
                  color: 'rgba(0, 217, 255, 0.3)',
                },
                lineStyle: {
                  color: '#00d9ff',
                  width: 2,
                },
                itemStyle: {
                  color: '#00d9ff',
                },
              },
            ],
            animationDelay: (idx: number) => idx * 100,
          },
        ],
      };

    case 'scatter':
      return {
        ...baseOption,
        xAxis: {
          type: 'value',
          splitLine: {
            lineStyle: {
              color: 'rgba(255, 255, 255, 0.1)',
            },
          },
          axisLine: {
            lineStyle: {
              color: 'rgba(139, 92, 246, 0.5)',
            },
          },
        },
        yAxis: {
          type: 'value',
          splitLine: {
            lineStyle: {
              color: 'rgba(255, 255, 255, 0.1)',
            },
          },
          axisLine: {
            lineStyle: {
              color: 'rgba(0, 217, 255, 0.5)',
            },
          },
        },
        series: [
          {
            type: 'scatter',
            data: (data as { series: [number, number][] }).series || [
              [10, 20],
              [30, 40],
              [50, 60],
              [70, 80],
              [90, 100],
            ],
            symbolSize: 15,
            itemStyle: {
              color: '#00d9ff',
              shadowBlur: 10,
              shadowColor: 'rgba(0, 217, 255, 0.5)',
            },
            animationDelay: (idx: number) => idx * 50,
          },
        ],
      };

    case 'heatmap':
      return {
        ...baseOption,
        grid: {
          left: 100,
          right: 40,
          top: title ? 80 : 40,
          bottom: 60,
        },
        xAxis: {
          type: 'category',
          data: (data as { xAxis: string[] }).xAxis || ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
          splitArea: {
            show: true,
          },
          axisLine: {
            lineStyle: {
              color: 'rgba(255, 255, 255, 0.3)',
            },
          },
        },
        yAxis: {
          type: 'category',
          data: (data as { yAxis: string[] }).yAxis || ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
          splitArea: {
            show: true,
          },
          axisLine: {
            lineStyle: {
              color: 'rgba(255, 255, 255, 0.3)',
            },
          },
        },
        visualMap: {
          min: 0,
          max: 100,
          calculable: true,
          orient: 'vertical',
          left: 'right',
          bottom: 60,
          inRange: {
            color: ['#1e3a8a', '#3b82f6', '#00d9ff', '#8b5cf6', '#ef4444'],
          },
          textStyle: {
            color: '#e5e7eb',
          },
        },
        series: [
          {
            type: 'heatmap',
            data: (data as { series: [number, number, number][] }).series || [
              [0, 0, 5],
              [1, 1, 20],
              [2, 2, 50],
              [3, 3, 80],
              [4, 4, 100],
            ],
            label: {
              show: false,
            },
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowColor: 'rgba(0, 0, 0, 0.5)',
              },
            },
            animationDelay: (idx: number) => idx * 5,
          },
        ],
      };

    case 'treemap':
      return {
        ...baseOption,
        series: [
          {
            type: 'treemap',
            data: (data as { series: Array<{
              name: string;
              value: number;
              children?: Array<{ name: string; value: number }>;
            }> }).series || [
              {
                name: 'Ventas',
                value: 40,
                children: [
                  { name: 'Producto A', value: 20 },
                  { name: 'Producto B', value: 20 },
                ],
              },
              {
                name: 'Marketing',
                value: 30,
                children: [
                  { name: 'Digital', value: 15 },
                  { name: 'Tradicional', value: 15 },
                ],
              },
              {
                name: 'Operaciones',
                value: 30,
              },
            ],
            roam: false,
            breadcrumb: {
              show: false,
            },
            label: {
              show: true,
              formatter: '{b}: {c}',
              color: '#fff',
            },
            itemStyle: {
              borderColor: 'rgba(0, 0, 0, 0.5)',
              borderWidth: 2,
              gapWidth: 2,
            },
            levels: [
              {
                itemStyle: {
                  borderColor: 'rgba(0, 0, 0, 0.8)',
                  borderWidth: 3,
                  gapWidth: 3,
                },
              },
              {
                colorSaturation: [0.35, 0.5],
                itemStyle: {
                  gapWidth: 1,
                  borderColorSaturation: 0.6,
                },
              },
            ],
            animationDurationUpdate: 1000,
          },
        ],
      };

    case 'sankey':
      return {
        ...baseOption,
        series: {
          type: 'sankey',
          emphasis: {
            focus: 'adjacency',
          },
          data: (data as { nodes: { name: string }[] }).nodes || [
            { name: 'Lead' },
            { name: 'Prospecto' },
            { name: 'Cliente' },
            { name: 'Perdido' },
          ],
          links: (data as { links: { source: string; target: string; value: number }[] }).links || [
            { source: 'Lead', target: 'Prospecto', value: 100 },
            { source: 'Prospecto', target: 'Cliente', value: 60 },
            { source: 'Prospecto', target: 'Perdido', value: 40 },
          ],
          lineStyle: {
            color: 'gradient',
            curveness: 0.5,
          },
          itemStyle: {
            color: '#00d9ff',
            borderColor: '#8b5cf6',
            borderWidth: 2,
          },
          label: {
            color: '#e5e7eb',
            fontWeight: 'bold',
          },
        },
      };

    case 'gauge':
      return {
        ...baseOption,
        series: [
          {
            type: 'gauge',
            center: ['50%', '60%'],
            startAngle: 200,
            endAngle: -20,
            min: 0,
            max: 100,
            splitNumber: 10,
            itemStyle: {
              color: '#00d9ff',
            },
            progress: {
              show: true,
              width: 20,
            },
            pointer: {
              show: true,
              length: '60%',
              width: 8,
              itemStyle: {
                color: '#8b5cf6',
              },
            },
            axisLine: {
              lineStyle: {
                width: 20,
                color: [
                  [0.3, '#ef4444'],
                  [0.7, '#f59e0b'],
                  [1, '#10b981'],
                ],
              },
            },
            axisTick: {
              distance: -30,
              splitNumber: 5,
              lineStyle: {
                width: 2,
                color: '#fff',
              },
            },
            splitLine: {
              distance: -30,
              length: 14,
              lineStyle: {
                width: 3,
                color: '#fff',
              },
            },
            axisLabel: {
              distance: -20,
              color: '#e5e7eb',
              fontSize: 12,
            },
            anchor: {
              show: true,
              showAbove: true,
              size: 18,
              itemStyle: {
                borderWidth: 15,
                borderColor: '#8b5cf6',
              },
            },
            title: {
              show: false,
            },
            detail: {
              valueAnimation: true,
              width: '60%',
              lineHeight: 40,
              borderRadius: 8,
              offsetCenter: [0, '35%'],
              fontSize: 40,
              fontWeight: 'bolder',
              formatter: '{value}%',
              color: '#00d9ff',
            },
            data: [
              {
                value: (data as { value: number }).value || 75,
              },
            ],
          },
        ],
      };

    case 'funnel':
      return {
        ...baseOption,
        series: [
          {
            type: 'funnel',
            left: '10%',
            top: title ? 100 : 60,
            bottom: 60,
            width: '80%',
            min: 0,
            max: 100,
            minSize: '0%',
            maxSize: '100%',
            sort: 'descending',
            gap: 2,
            label: {
              show: true,
              position: 'inside',
              formatter: '{b}: {c}%',
              color: '#fff',
              fontSize: 14,
            },
            labelLine: {
              length: 10,
              lineStyle: {
                width: 1,
                type: 'solid',
              },
            },
            itemStyle: {
              borderColor: '#000',
              borderWidth: 1,
            },
            emphasis: {
              label: {
                fontSize: 16,
              },
            },
            data: (data as { series: { name: string; value: number }[] }).series || [
              { value: 100, name: 'Visitas' },
              { value: 80, name: 'Interés' },
              { value: 60, name: 'Deseo' },
              { value: 40, name: 'Acción' },
              { value: 20, name: 'Conversión' },
            ],
          },
        ],
      };

    default:
      return baseOption;
  }
}

export default AdvancedChart;
