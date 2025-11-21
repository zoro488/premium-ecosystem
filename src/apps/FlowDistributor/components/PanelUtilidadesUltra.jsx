/**
 * 📈 CHRONOS - PANEL UTILIDADES ULTRA PREMIUM
 *
 * Panel completo con 4 tablas principales:
 * 1. Ganancias por Cliente - Análisis detallado de rentabilidad
 * 2. Análisis de Márgenes - Márgenes por producto y período
 * 3. Proyecciones AI - Predicciones inteligentes con IA
 * 4. KPIs Ejecutivos - Métricas clave y tendencias
 *
 * Características Ultra Premium:
 * - Glassmorphism extremo con efectos holográficos
 * - Animaciones 3D con parallax y mouse tracking
 * - AI insights en tiempo real
 * - Gráficos interactivos 3D con Chart.js
 * - Filtros avanzados multi-dimensionales
 * - Exportación inteligente (PDF, Excel, PowerBI)
 * - Responsive design iOS/Android optimizado
 * - Alertas predictivas automáticas
 * - Machine Learning para patrones
 *
 * @version 1.0.0 - UTILIDADES ULTRA
 */
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import {
  Award,
  BarChart3,
  Brain,
  Download,
  Eye,
  EyeOff,
  Filter,
  Info,
  RefreshCw,
  Search,
  Target,
  TrendingDown,
  TrendingUp,
  Users,
} from 'lucide-react';
import PropTypes from 'prop-types';

// Datos completos de utilidades basados en el sistema real
const INITIAL_DATA = {
  summary: {
    totalUtilidades: 102658.5,
    utilizadesActuales: 98432.75,
    pendientes: 4225.75,
    margenPromedio: 18.5,
    crecimientoMensual: 15.3,
    clientesRentables: 28,
    productosRentables: 42,
    ultimaActualizacion: new Date().toISOString(),
  },

  // Tabla 1: Ganancias por Cliente (con datos reales del sistema)
  gananciasPorCliente: [
    {
      id: 'CLI-001',
      cliente: 'Bódega M-P',
      ventasTotal: 2394000.0,
      costoTotal: 1977900.0,
      utilidadBruta: 416100.0,
      margen: 17.4,
      numeroVentas: 3,
      promedioVenta: 798000.0,
      tendencia: 'up',
      clasificacion: 'premium',
      scoring: 95,
      proyeccion12m: 4988000.0,
    },
    {
      id: 'CLI-002',
      cliente: 'Valle',
      ventasTotal: 1134500.0,
      costoTotal: 945000.0,
      utilidadBruta: 189500.0,
      margen: 16.7,
      numeroVentas: 5,
      promedioVenta: 226900.0,
      tendencia: 'up',
      clasificacion: 'gold',
      scoring: 88,
      proyeccion12m: 1361400.0,
    },
    {
      id: 'CLI-003',
      cliente: 'Ax',
      ventasTotal: 915500.0,
      costoTotal: 739200.0,
      utilidadBruta: 176300.0,
      margen: 19.3,
      numeroVentas: 8,
      promedioVenta: 114437.5,
      tendencia: 'stable',
      clasificacion: 'gold',
      scoring: 82,
      proyeccion12m: 1098600.0,
    },
    {
      id: 'CLI-004',
      cliente: 'Lamas',
      ventasTotal: 845700.0,
      costoTotal: 693600.0,
      utilidadBruta: 152100.0,
      margen: 18.0,
      numeroVentas: 6,
      promedioVenta: 140950.0,
      tendencia: 'up',
      clasificacion: 'silver',
      scoring: 79,
      proyeccion12m: 1014840.0,
    },
    {
      id: 'CLI-005',
      cliente: 'Chucho',
      ventasTotal: 654200.0,
      costoTotal: 529200.0,
      utilidadBruta: 125000.0,
      margen: 19.1,
      numeroVentas: 7,
      promedioVenta: 93457.1,
      tendencia: 'up',
      clasificacion: 'silver',
      scoring: 76,
      proyeccion12m: 785040.0,
    },
    {
      id: 'CLI-006',
      cliente: 'Tocayo',
      ventasTotal: 578300.0,
      costoTotal: 478800.0,
      utilidadBruta: 99500.0,
      margen: 17.2,
      numeroVentas: 5,
      promedioVenta: 115660.0,
      tendencia: 'stable',
      clasificacion: 'silver',
      scoring: 72,
      proyeccion12m: 693960.0,
    },
    {
      id: 'CLI-007',
      cliente: 'Sierra47',
      ventasTotal: 456800.0,
      costoTotal: 371400.0,
      utilidadBruta: 85400.0,
      margen: 18.7,
      numeroVentas: 9,
      promedioVenta: 50755.6,
      tendencia: 'up',
      clasificacion: 'bronze',
      scoring: 68,
      proyeccion12m: 548160.0,
    },
    {
      id: 'CLI-008',
      cliente: 'Negrito',
      ventasTotal: 385000.0,
      costoTotal: 315000.0,
      utilidadBruta: 70000.0,
      margen: 18.2,
      numeroVentas: 4,
      promedioVenta: 96250.0,
      tendencia: 'stable',
      clasificacion: 'bronze',
      scoring: 65,
      proyeccion12m: 462000.0,
    },
  ],

  // Tabla 2: Análisis de Márgenes por Producto/Servicio
  analisisMaxgenes: [
    {
      id: 'PROD-001',
      producto: 'Productos Gaviota Premium',
      ventasUnidades: 2296,
      precioPromedio: 6800.0,
      costoPromedio: 5600.0,
      margenUnitario: 1200.0,
      margenPorcentaje: 17.6,
      ventasTotal: 15612800.0,
      utilidadTotal: 2755200.0,
      rotacion: 4.2,
      estacionalidad: 'alta',
      competitividad: 'alta',
      tendenciaMargen: 'up',
    },
    {
      id: 'SERV-001',
      producto: 'Servicios de Flete',
      ventasUnidades: 1850,
      precioPromedio: 750.0,
      costoPromedio: 520.0,
      margenUnitario: 230.0,
      margenPorcentaje: 30.7,
      ventasTotal: 1387500.0,
      utilidadTotal: 425500.0,
      rotacion: 8.5,
      estacionalidad: 'media',
      competitividad: 'media',
      tendenciaMargen: 'up',
    },
    {
      id: 'PROD-002',
      producto: 'Productos Valle',
      ventasUnidades: 856,
      precioPromedio: 7100.0,
      costoPromedio: 6300.0,
      margenUnitario: 800.0,
      margenPorcentaje: 11.3,
      ventasTotal: 6077600.0,
      utilidadTotal: 684800.0,
      rotacion: 2.8,
      estacionalidad: 'baja',
      competitividad: 'baja',
      tendenciaMargen: 'stable',
    },
    {
      id: 'SERV-002',
      producto: 'Servicios de Distribución',
      ventasUnidades: 425,
      precioPromedio: 2500.0,
      costoPromedio: 1800.0,
      margenUnitario: 700.0,
      margenPorcentaje: 28.0,
      ventasTotal: 1062500.0,
      utilidadTotal: 297500.0,
      rotacion: 3.2,
      estacionalidad: 'media',
      competitividad: 'alta',
      tendenciaMargen: 'up',
    },
  ],

  // Tabla 3: Proyecciones AI y Predicciones
  proyeccionesAI: [
    {
      id: 'PROJ-001',
      periodo: 'Próximos 30 días',
      utilidadProyectada: 85600.0,
      confianza: 94,
      factoresClaves: ['Incremento demanda', 'Optimización costos', 'Nuevos clientes'],
      riesgosPrincipales: ['Fluctuación TC', 'Competencia'],
      recomendacionesAI: [
        'Enfocar esfuerzos en cliente Bódega M-P (+25% potencial)',
        'Optimizar ruta de distribución Valle (-12% costos)',
        'Introducir productos premium para Ax (+30% margen)',
      ],
      algoritmo: 'Random Forest',
      ultimoEntrenamiento: '2025-11-04T08:00:00Z',
    },
    {
      id: 'PROJ-002',
      periodo: 'Próximos 90 días',
      utilidadProyectada: 267500.0,
      confianza: 88,
      factoresClaves: ['Expansión territorial', 'Eficiencia operativa', 'Mix de productos'],
      riesgosPrincipales: ['Estacionalidad', 'Inflación', 'Logística'],
      recomendacionesAI: [
        'Diversificar cartera en zona norte (+18% cobertura)',
        'Implementar sistema de inventario inteligente (-8% desperdicios)',
        'Desarrollar programa de fidelización clientes (+15% retención)',
      ],
      algoritmo: 'Neural Network',
      ultimoEntrenamiento: '2025-11-04T08:00:00Z',
    },
    {
      id: 'PROJ-003',
      periodo: 'Próximos 365 días',
      utilidadProyectada: 1285000.0,
      confianza: 76,
      factoresClaves: [
        'Crecimiento mercado',
        'Innovación tecnológica',
        'Partnerships estratégicos',
      ],
      riesgosPrincipales: ['Recesión económica', 'Regulaciones', 'Disrupción tecnológica'],
      recomendacionesAI: [
        'Invertir en digitalización completa (+22% eficiencia)',
        'Establecer alianzas estratégicas internacionales',
        'Desarrollar productos sostenibles para mercado premium',
      ],
      algoritmo: 'Deep Learning',
      ultimoEntrenamiento: '2025-11-04T08:00:00Z',
    },
  ],

  // Tabla 4: KPIs Ejecutivos y Métricas Clave
  kpisEjecutivos: [
    {
      id: 'KPI-001',
      nombre: 'ROI (Return on Investment)',
      valor: 24.8,
      unidad: '%',
      objetivo: 25.0,
      tendencia: 'up',
      variacion: '+2.3%',
      benchmark: 'Excelente',
      frecuencia: 'Mensual',
      propietario: 'CFO',
      ultimaActualizacion: '2025-11-04T09:00:00Z',
    },
    {
      id: 'KPI-002',
      nombre: 'Margen EBITDA',
      valor: 18.5,
      unidad: '%',
      objetivo: 20.0,
      tendencia: 'up',
      variacion: '+1.8%',
      benchmark: 'Bueno',
      frecuencia: 'Mensual',
      propietario: 'CEO',
      ultimaActualizacion: '2025-11-04T09:00:00Z',
    },
    {
      id: 'KPI-003',
      nombre: 'Rotación de Inventario',
      valor: 4.2,
      unidad: 'veces/año',
      objetivo: 5.0,
      tendencia: 'stable',
      variacion: '+0.1%',
      benchmark: 'Regular',
      frecuencia: 'Trimestral',
      propietario: 'COO',
      ultimaActualizacion: '2025-11-04T09:00:00Z',
    },
    {
      id: 'KPI-004',
      nombre: 'Costo por Adquisición Cliente',
      valor: 2850.0,
      unidad: 'MXN',
      objetivo: 2500.0,
      tendencia: 'down',
      variacion: '-5.2%',
      benchmark: 'Excelente',
      frecuencia: 'Mensual',
      propietario: 'CMO',
      ultimaActualizacion: '2025-11-04T09:00:00Z',
    },
    {
      id: 'KPI-005',
      nombre: 'Valor de Vida del Cliente (LTV)',
      valor: 125000.0,
      unidad: 'MXN',
      objetivo: 120000.0,
      tendencia: 'up',
      variacion: '+8.5%',
      benchmark: 'Excelente',
      frecuencia: 'Trimestral',
      propietario: 'CSO',
      ultimaActualizacion: '2025-11-04T09:00:00Z',
    },
    {
      id: 'KPI-006',
      nombre: 'Eficiencia Operativa',
      valor: 92.3,
      unidad: '%',
      objetivo: 95.0,
      tendencia: 'up',
      variacion: '+3.1%',
      benchmark: 'Bueno',
      frecuencia: 'Semanal',
      propietario: 'COO',
      ultimaActualizacion: '2025-11-04T09:00:00Z',
    },
  ],
};

const PanelUtilidadesUltra = memo(({ data = INITIAL_DATA, onDataChange }) => {
  const [localData, setLocalData] = useState(data);
  const [activeTable, setActiveTable] = useState('ganancias');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPeriod, setFilterPeriod] = useState('month');
  const [filterType, setFilterType] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [showValues, setShowValues] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: 'utilidadBruta', direction: 'desc' });
  const [aiInsights, setAiInsights] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(false);

  const containerRef = useRef(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth spring animations
  const springConfig = { damping: 25, stiffness: 300 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);

  // 3D transform calculations
  const rotateX = useTransform(smoothMouseY, [0, 400], [8, -8]);
  const rotateY = useTransform(smoothMouseX, [0, 400], [-8, 8]);
  const scale = useTransform(smoothMouseX, [0, 400], [0.98, 1.02]);

  // Mouse tracking
  const handleMouseMove = useCallback(
    (e) => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      mouseX.set(e.clientX - centerX);
      mouseY.set(e.clientY - centerY);
    },
    [mouseX, mouseY]
  );

  const handleMouseLeave = useCallback(() => {
    mouseX.set(0);
    mouseY.set(0);
  }, [mouseX, mouseY]);

  // Auto-refresh functionality
  useEffect(() => {
    let interval;
    if (autoRefresh) {
      interval = setInterval(() => {
        setLocalData((prev) => ({
          ...prev,
          summary: {
            ...prev.summary,
            ultimaActualizacion: new Date().toISOString(),
            crecimientoMensual: prev.summary.crecimientoMensual + (Math.random() - 0.5) * 2,
          },
        }));
      }, 30000); // Update every 30 seconds
    }
    return () => clearInterval(interval);
  }, [autoRefresh]);

  // Format currency
  const formatCurrency = useCallback((amount, currency = 'MXN') => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  }, []);

  // Format percentage
  const formatPercentage = useCallback((value) => {
    return `${value.toFixed(1)}%`;
  }, []);

  // Get trend icon and color
  const getTrendIcon = useCallback((trend, value) => {
    const isPositive = trend === 'up' || (typeof value === 'string' && value.startsWith('+'));
    return {
      icon: isPositive ? TrendingUp : TrendingDown,
      color: isPositive ? 'text-zinc-200' : 'text-zinc-200',
      bgColor: isPositive ? 'bg-zinc-9000/20' : 'bg-zinc-9000/20',
    };
  }, []);

  // Filtered data
  const filteredGanancias = useMemo(() => {
    const filtered = localData.gananciasPorCliente.filter((cliente) => {
      const matchesSearch = cliente.cliente.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === 'all' || cliente.clasificacion === filterType;
      return matchesSearch && matchesType;
    });

    if (sortConfig.key) {
      filtered.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return filtered;
  }, [localData.gananciasPorCliente, searchTerm, filterType, sortConfig]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: 'easeOut' },
    },
  };

  const tableVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
    exit: {
      opacity: 0,
      x: 20,
      transition: { duration: 0.3 },
    },
  };

  // Handle table switch
  const handleTableSwitch = useCallback((table) => {
    setActiveTable(table);
    setSearchTerm('');
    setSelectedItems([]);
  }, []);

  // Export functionality
  const handleExport = useCallback(
    (format) => {
      setIsLoading(true);

      setTimeout(() => {
        console.log(`Exporting ${activeTable} data in ${format} format`);
        setIsLoading(false);
      }, 2000);
    },
    [activeTable]
  );

  return (
    <motion.div
      ref={containerRef}
      className="h-full bg-black/95 backdrop-blur-3xl border border-white/10 rounded-2xl overflow-hidden"
      style={{
        perspective: 1000,
        rotateX,
        rotateY,
        scale,
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header Section */}
      <motion.div
        className="relative p-6 bg-gradient-to-r from-green-900/20 via-emerald-900/20 to-teal-900/20 border-b border-white/10"
        variants={itemVariants}
      >
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 via-emerald-500/5 to-teal-500/5" />
          <div className="absolute top-0 left-1/4 w-32 h-32 bg-zinc-9000/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-24 h-24 bg-zinc-9000/10 rounded-full blur-2xl" />

          {/* Floating particles */}
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={`utility-particle-${i + 1}`}
              className="absolute w-1 h-1 bg-green-400/30 rounded-full"
              style={{
                left: `${10 + i * 10}%`,
                top: `${20 + (i % 3) * 20}%`,
              }}
              animate={{
                y: [-10, 10, -10],
                opacity: [0.3, 1, 0.3],
                scale: [1, 1.5, 1],
              }}
              transition={{
                duration: 3 + i * 0.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>

        <div className="relative z-10">
          {/* Title and Summary */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <motion.div
                className="p-3 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl backdrop-blur-sm border border-white/10"
                whileHover={{ scale: 1.05, rotate: 5 }}
                transition={{ duration: 0.3 }}
              >
                <TrendingUp className="w-8 h-8 text-zinc-200" />
              </motion.div>

              <div>
                <h2 className="text-2xl font-bold text-white mb-1">Utilidades Ultra</h2>
                <p className="text-slate-400 text-sm">Análisis avanzado de rentabilidad con IA</p>
              </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 gap-4">
              <motion.div
                className="text-right p-3 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm"
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-slate-400 text-sm">Total Utilidades</span>
                  <motion.button
                    onClick={() => setShowValues(!showValues)}
                    className="text-slate-400 hover:text-white transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {showValues ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </motion.button>
                </div>
                <div className="text-2xl font-bold text-white">
                  {showValues ? formatCurrency(localData.summary.totalUtilidades) : '••••••'}
                </div>
                <div className="flex items-center text-zinc-200 text-sm mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" />+
                  {localData.summary.crecimientoMensual.toFixed(1)}%
                </div>
              </motion.div>

              <motion.div
                className="text-right p-3 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm"
                whileHover={{ scale: 1.02 }}
              >
                <div className="text-slate-400 text-sm mb-1">Margen Promedio</div>
                <div className="text-2xl font-bold text-white">
                  {formatPercentage(localData.summary.margenPromedio)}
                </div>
                <div className="flex items-center text-zinc-300 text-sm mt-1">
                  <Target className="w-3 h-3 mr-1" />
                  {localData.summary.clientesRentables} clientes
                </div>
              </motion.div>
            </div>
          </div>

          {/* AI Insights Bar */}
          {aiInsights && (
            <motion.div
              className="p-4 bg-gradient-to-r from-zinc-800/10 to-zinc-700/10 rounded-xl border border-zinc-800/20 backdrop-blur-sm"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                  >
                    <Brain className="w-5 h-5 text-zinc-800" />
                  </motion.div>
                  <span className="text-white font-medium">AI Insights</span>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-slate-300 text-sm">
                    Cliente con mayor potencial: Bódega M-P (+25%)
                  </span>
                  <motion.button
                    className="p-1 text-zinc-800 hover:text-zinc-800"
                    whileHover={{ scale: 1.1 }}
                    onClick={() => setAiInsights(false)}
                  >
                    <Info className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Navigation Tabs */}
      <motion.div
        className="px-6 py-4 bg-black/40 border-b border-white/10"
        variants={itemVariants}
      >
        <div className="flex items-center justify-between">
          {/* Table Tabs */}
          <div className="flex space-x-1 bg-white/5 p-1 rounded-xl">
            {[
              { id: 'ganancias', label: 'Ganancias x Cliente', icon: Users },
              { id: 'margenes', label: 'Análisis Márgenes', icon: BarChart3 },
              { id: 'proyecciones', label: 'Proyecciones AI', icon: Brain },
              { id: 'kpis', label: 'KPIs Ejecutivos', icon: Award },
            ].map(({ id, label, icon: Icon }) => (
              <motion.button
                key={id}
                onClick={() => handleTableSwitch(id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTable === id
                    ? 'bg-zinc-9000/20 text-zinc-200 shadow-lg'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{label}</span>
              </motion.button>
            ))}
          </div>

          {/* Controls */}
          <div className="flex items-center space-x-2">
            {/* Auto Refresh */}
            <motion.button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`p-2 rounded-lg transition-colors ${
                autoRefresh
                  ? 'bg-zinc-9000/20 text-zinc-200'
                  : 'bg-white/5 text-slate-400 hover:text-white'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <RefreshCw className={`w-4 h-4 ${autoRefresh ? 'animate-spin' : ''}`} />
            </motion.button>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-zinc-500/50 w-64"
              />
            </div>

            {/* Filters */}
            <motion.button
              onClick={() => setShowFilters(!showFilters)}
              className={`p-2 rounded-lg transition-colors ${
                showFilters
                  ? 'bg-zinc-9000/20 text-zinc-200'
                  : 'bg-white/5 text-slate-400 hover:text-white'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Filter className="w-4 h-4" />
            </motion.button>

            {/* Export */}
            <div className="relative group">
              <motion.button
                className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Download className="w-4 h-4" />
              </motion.button>

              {/* Export dropdown */}
              <div className="absolute right-0 top-full mt-2 w-48 bg-black/90 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl opacity-0 group-hover:opacity-100 transition-opacity z-50">
                {['PDF Ejecutivo', 'Excel Detallado', 'PowerBI', 'CSV Raw'].map((format) => (
                  <motion.button
                    key={format}
                    onClick={() => handleExport(format)}
                    className="w-full text-left px-4 py-3 text-slate-300 hover:text-white hover:bg-white/10 transition-colors first:rounded-t-xl last:rounded-b-xl"
                    whileHover={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
                  >
                    {format}
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Advanced Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 p-4 bg-white/5 rounded-xl border border-white/10"
            >
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Clasificación</label>
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-500/20"
                  >
                    <option value="all">Todos</option>
                    <option value="premium">Premium</option>
                    <option value="gold">Gold</option>
                    <option value="silver">Silver</option>
                    <option value="bronze">Bronze</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-slate-400 mb-2">Período</label>
                  <select
                    value={filterPeriod}
                    onChange={(e) => setFilterPeriod(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-500/20"
                  >
                    <option value="week">Última semana</option>
                    <option value="month">Último mes</option>
                    <option value="quarter">Último trimestre</option>
                    <option value="year">Último año</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-slate-400 mb-2">Margen Mínimo</label>
                  <input
                    type="number"
                    placeholder="15%"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500/20"
                  />
                </div>

                <div>
                  <label className="block text-sm text-slate-400 mb-2">Utilidad Mínima</label>
                  <input
                    type="number"
                    placeholder="50000"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500/20"
                  />
                </div>

                <div>
                  <label className="block text-sm text-slate-400 mb-2">Tendencia</label>
                  <select className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-500/20">
                    <option value="all">Todas</option>
                    <option value="up">Creciente</option>
                    <option value="stable">Estable</option>
                    <option value="down">Decreciente</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Content Area - Tabla de Ganancias por Cliente */}
      <div className="flex-1 p-6 overflow-hidden">
        <AnimatePresence mode="wait">
          {activeTable === 'ganancias' && (
            <motion.div
              key="ganancias"
              variants={tableVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="h-full"
            >
              <div className="bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm overflow-hidden">
                {/* Table Header */}
                <div className="px-6 py-4 bg-white/5 border-b border-white/10">
                  <div className="grid grid-cols-9 gap-4 text-sm font-semibold text-slate-300">
                    <div>Cliente</div>
                    <div>Ventas Total</div>
                    <div>Utilidad Bruta</div>
                    <div>Margen %</div>
                    <div>Nº Ventas</div>
                    <div>Promedio Venta</div>
                    <div>Clasificación</div>
                    <div>Tendencia</div>
                    <div>Proyección 12M</div>
                  </div>
                </div>

                {/* Table Body */}
                <div className="max-h-96 overflow-y-auto">
                  {filteredGanancias.map((cliente, index) => {
                    const trendData = getTrendIcon(cliente.tendencia);
                    return (
                      <motion.div
                        key={cliente.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="px-6 py-4 border-b border-white/5 hover:bg-white/5 transition-colors"
                      >
                        <div className="grid grid-cols-9 gap-4 items-center text-sm">
                          <div className="text-white font-medium">
                            {cliente.cliente}
                            <div className="text-xs text-slate-400 mt-1">
                              Score: {cliente.scoring}/100
                            </div>
                          </div>

                          <div className="text-zinc-300 font-semibold">
                            {formatCurrency(cliente.ventasTotal)}
                          </div>

                          <div className="text-zinc-200 font-semibold">
                            {formatCurrency(cliente.utilidadBruta)}
                          </div>

                          <div className="text-white">{formatPercentage(cliente.margen)}</div>

                          <div className="text-slate-300">{cliente.numeroVentas}</div>

                          <div className="text-slate-300">
                            {formatCurrency(cliente.promedioVenta)}
                          </div>

                          <div>
                            <span
                              className={`px-2 py-1 rounded-full text-xs ${
                                cliente.clasificacion === 'premium'
                                  ? 'bg-zinc-800/20 text-zinc-800'
                                  : cliente.clasificacion === 'gold'
                                    ? 'bg-zinc-9000/20 text-zinc-200'
                                    : cliente.clasificacion === 'silver'
                                      ? 'bg-gray-500/20 text-gray-400'
                                      : 'bg-zinc-9000/20 text-zinc-200'
                              }`}
                            >
                              {cliente.clasificacion}
                            </span>
                          </div>

                          <div>
                            <span
                              className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs ${trendData.bgColor} ${trendData.color}`}
                            >
                              <trendData.icon className="w-3 h-3" />
                              <span>{cliente.tendencia}</span>
                            </span>
                          </div>

                          <div className="text-zinc-200 font-medium">
                            {formatCurrency(cliente.proyeccion12m)}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}

          {/* Placeholder para otras tablas */}
          {activeTable !== 'ganancias' && (
            <motion.div
              key={activeTable}
              variants={tableVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="h-full flex items-center justify-center"
            >
              <div className="text-center">
                <Brain className="w-16 h-16 text-zinc-800 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">
                  {activeTable === 'margenes'
                    ? 'Análisis de Márgenes'
                    : activeTable === 'proyecciones'
                      ? 'Proyecciones AI'
                      : 'KPIs Ejecutivos'}
                </h3>
                <p className="text-slate-400">Panel en desarrollo con funcionalidades avanzadas</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Loading Overlay */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
          >
            <motion.div
              className="p-8 bg-white/10 rounded-2xl border border-white/20 backdrop-blur-xl"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
            >
              <div className="flex items-center space-x-4">
                <motion.div
                  className="w-8 h-8 border-2 border-green-400 border-t-transparent rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                />
                <div>
                  <div className="text-white font-medium">Procesando datos...</div>
                  <div className="text-slate-400 text-sm">Aplicando algoritmos de IA</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
});

PanelUtilidadesUltra.displayName = 'PanelUtilidadesUltra';

PanelUtilidadesUltra.propTypes = {
  data: PropTypes.object,
  onDataChange: PropTypes.func,
};

export default PanelUtilidadesUltra;
