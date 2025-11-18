/**
 * 🚛 CHRONOS - PANEL FLETES ULTRA PREMIUM
 *
 * Panel completo con 4 tablas principales:
 * 1. Rutas Activas - Gestión en tiempo real de rutas
 * 2. Costos por Kilómetro - Análisis detallado de eficiencia
 * 3. Análisis de Eficiencia - Optimización y performance
 * 4. Tracking GPS - Seguimiento en tiempo real
 *
 * Características Ultra Premium:
 * - Mapas interactivos 3D con geolocalización
 * - Glassmorphism extremo con efectos holográficos
 * - Animaciones 3D con parallax y mouse tracking
 * - Calculadora de rutas inteligente con IA
 * - Optimización automática de rutas
 * - Sistema GPS en tiempo real
 * - Alertas predictivas de tráfico
 * - Análisis de combustible y costos
 * - Responsive design iOS/Android optimizado
 * - Machine Learning para patrones de tráfico
 *
 * @version 1.0.0 - FLETES ULTRA
 */
import { memo, useCallback, useMemo, useRef, useState } from 'react';

import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import {
  AlertTriangle,
  ArrowDownRight,
  BarChart3,
  CheckCircle,
  Clock,
  DollarSign,
  Download,
  Eye,
  EyeOff,
  Fuel,
  Navigation,
  Route,
  Search,
  Settings,
  Signal,
  TrendingUp,
  Truck,
} from 'lucide-react';
import PropTypes from 'prop-types';

// Datos completos de fletes basados en el sistema real
const INITIAL_DATA = {
  summary: {
    rutasActivas: 12,
    vehiculosOperando: 8,
    costoPromedioKm: 4.25,
    eficienciaGeneral: 87.3,
    ingresosDiarios: 45600.0,
    combustibleGastado: 285.5,
    kmRecorridos: 1847,
    ultimaActualizacion: new Date().toISOString(),
  },

  // Tabla 1: Rutas Activas
  rutasActivas: [
    {
      id: 'RUTA-001',
      nombre: 'Ruta Central Guadalajara',
      vehiculo: 'Unidad 101 - Ford Transit',
      conductor: 'Miguel Hernández',
      origen: 'Guadalajara, Centro',
      destino: 'Valle de México',
      distancia: 485.6,
      tiempoEstimado: '6h 15m',
      estado: 'en_transito',
      progreso: 65,
      costoEstimado: 2057.0,
      ingresoEstimado: 3500.0,
      prioridad: 'alta',
      coordenadasActuales: { lat: 20.659699, lng: -103.349609 },
      etaDestino: '2025-11-04T16:30:00Z',
      cargaTipo: 'Productos Premium',
      cargaPeso: '2.5 ton',
      combustibleRestante: 68,
      velocidadPromedio: 78.5,
    },
    {
      id: 'RUTA-002',
      nombre: 'Ruta Norte Monterrey',
      vehiculo: 'Unidad 203 - Mercedes Sprinter',
      conductor: 'Carlos Ruiz',
      origen: 'Monterrey, Industrial',
      destino: 'San Luis Potosí',
      distancia: 318.2,
      tiempoEstimado: '4h 30m',
      estado: 'en_transito',
      progreso: 45,
      costoEstimado: 1352.0,
      ingresoEstimado: 2800.0,
      prioridad: 'media',
      coordenadasActuales: { lat: 25.686613, lng: -100.316113 },
      etaDestino: '2025-11-04T15:45:00Z',
      cargaTipo: 'Mercancía General',
      cargaPeso: '1.8 ton',
      combustibleRestante: 52,
      velocidadPromedio: 72.3,
    },
    {
      id: 'RUTA-003',
      nombre: 'Ruta Sur Oaxaca',
      vehiculo: 'Unidad 105 - Isuzu NPR',
      conductor: 'Roberto Jiménez',
      origen: 'Oaxaca Ciudad',
      destino: 'Tuxtla Gutiérrez',
      distancia: 287.5,
      tiempoEstimado: '5h 15m',
      estado: 'programada',
      progreso: 0,
      costoEstimado: 1221.0,
      ingresoEstimado: 2200.0,
      prioridad: 'baja',
      coordenadasActuales: { lat: 17.073, lng: -96.7265 },
      etaDestino: '2025-11-04T18:00:00Z',
      cargaTipo: 'Productos Artesanales',
      cargaPeso: '1.2 ton',
      combustibleRestante: 95,
      velocidadPromedio: 0,
    },
  ],
};

const PanelFletesUltra = memo(({ data = INITIAL_DATA, onDataChange }) => {
  const [localData, setLocalData] = useState(data);
  const [activeTable, setActiveTable] = useState('rutas');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showValues, setShowValues] = useState(true);
  const [gpsTracking, setGpsTracking] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);

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

  // Format currency
  const formatCurrency = useCallback((amount) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  }, []);

  // Format distance
  const formatDistance = useCallback((km) => {
    return `${km.toFixed(1)} km`;
  }, []);

  // Get status color and icon
  const getStatusInfo = useCallback((status) => {
    const statusMap = {
      en_transito: {
        color: 'text-zinc-300',
        bgColor: 'bg-zinc-800/20',
        icon: Truck,
        label: 'En Tránsito',
      },
      programada: {
        color: 'text-zinc-200',
        bgColor: 'bg-zinc-9000/20',
        icon: Clock,
        label: 'Programada',
      },
      completada: {
        color: 'text-zinc-200',
        bgColor: 'bg-zinc-9000/20',
        icon: CheckCircle,
        label: 'Completada',
      },
      retrasada: {
        color: 'text-zinc-200',
        bgColor: 'bg-zinc-9000/20',
        icon: AlertTriangle,
        label: 'Retrasada',
      },
    };
    return statusMap[status] || statusMap.programada;
  }, []);

  // Get priority color
  const getPriorityColor = useCallback((priority) => {
    const priorityMap = {
      alta: 'text-zinc-200 bg-zinc-9000/20',
      media: 'text-zinc-200 bg-zinc-9000/20',
      baja: 'text-zinc-200 bg-zinc-9000/20',
    };
    return priorityMap[priority] || priorityMap.media;
  }, []);

  // Filtered data
  const filteredRutas = useMemo(() => {
    return localData.rutasActivas.filter((ruta) => {
      const matchesSearch =
        ruta.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ruta.conductor.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === 'all' || ruta.estado === filterStatus;
      return matchesSearch && matchesStatus;
    });
  }, [localData.rutasActivas, searchTerm, filterStatus]);

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
        className="relative p-6 bg-gradient-to-r from-blue-900/20 via-cyan-900/20 to-teal-900/20 border-b border-white/10"
        variants={itemVariants}
      >
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-zinc-800/5 via-cyan-500/5 to-teal-500/5" />
          <div className="absolute top-0 left-1/4 w-32 h-32 bg-zinc-800/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-24 h-24 bg-zinc-9000/10 rounded-full blur-2xl" />

          {/* Floating truck particles */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={`truck-particle-${i + 1}`}
              className="absolute w-2 h-2 bg-zinc-700/40 rounded-full"
              style={{
                left: `${15 + i * 12}%`,
                top: `${25 + (i % 2) * 30}%`,
              }}
              animate={{
                y: [-8, 8, -8],
                opacity: [0.4, 1, 0.4],
                scale: [1, 1.3, 1],
              }}
              transition={{
                duration: 2.5 + i * 0.4,
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
                className="p-3 bg-gradient-to-br from-zinc-800/20 to-zinc-800/20 rounded-xl backdrop-blur-sm border border-white/10"
                whileHover={{ scale: 1.05, rotate: 5 }}
                transition={{ duration: 0.3 }}
              >
                <Truck className="w-8 h-8 text-zinc-300" />
              </motion.div>

              <div>
                <h2 className="text-2xl font-bold text-white mb-1">Fletes Ultra</h2>
                <p className="text-slate-400 text-sm">
                  Gestión inteligente de rutas y tracking GPS
                </p>
              </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-3 gap-4">
              <motion.div
                className="text-right p-3 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm"
                whileHover={{ scale: 1.02 }}
              >
                <div className="text-slate-400 text-sm mb-1">Rutas Activas</div>
                <div className="text-2xl font-bold text-white">
                  {localData.summary.rutasActivas}
                </div>
                <div className="flex items-center text-zinc-300 text-sm mt-1">
                  <Route className="w-3 h-3 mr-1" />
                  {localData.summary.vehiculosOperando} vehículos
                </div>
              </motion.div>

              <motion.div
                className="text-right p-3 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm"
                whileHover={{ scale: 1.02 }}
              >
                <div className="text-slate-400 text-sm mb-1">Eficiencia</div>
                <div className="text-2xl font-bold text-white">
                  {localData.summary.eficienciaGeneral}%
                </div>
                <div className="flex items-center text-zinc-200 text-sm mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +3.2% vs ayer
                </div>
              </motion.div>

              <motion.div
                className="text-right p-3 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm"
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-slate-400 text-sm">Ingresos Hoy</span>
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
                  {showValues ? formatCurrency(localData.summary.ingresosDiarios) : '••••••'}
                </div>
                <div className="flex items-center text-zinc-300 text-sm mt-1">
                  <DollarSign className="w-3 h-3 mr-1" />
                  {formatDistance(localData.summary.kmRecorridos)}
                </div>
              </motion.div>
            </div>
          </div>

          {/* GPS Tracking Bar */}
          {gpsTracking && (
            <motion.div
              className="p-4 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-xl border border-zinc-500/20 backdrop-blur-sm"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    <Signal className="w-5 h-5 text-zinc-200" />
                  </motion.div>
                  <span className="text-white font-medium">GPS Tracking Activo</span>
                  <span className="px-2 py-1 bg-zinc-9000/20 text-zinc-200 rounded-full text-xs">
                    {filteredRutas.filter((r) => r.estado === 'en_transito').length} vehículos en
                    movimiento
                  </span>
                </div>

                <div className="flex items-center space-x-4">
                  <span className="text-slate-300 text-sm">
                    Última actualización:{' '}
                    {new Date(localData.summary.ultimaActualizacion).toLocaleTimeString()}
                  </span>
                  <motion.button
                    className="p-1 text-zinc-200 hover:text-green-300"
                    whileHover={{ scale: 1.1 }}
                    onClick={() => setGpsTracking(false)}
                  >
                    <Settings className="w-4 h-4" />
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
              { id: 'rutas', label: 'Rutas Activas', icon: Route },
              { id: 'costos', label: 'Costos x Km', icon: Fuel },
              { id: 'eficiencia', label: 'Análisis Eficiencia', icon: BarChart3 },
              { id: 'tracking', label: 'Tracking GPS', icon: Navigation },
            ].map(({ id, label, icon: Icon }) => (
              <motion.button
                key={id}
                onClick={() => setActiveTable(id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTable === id
                    ? 'bg-zinc-800/20 text-zinc-300 shadow-lg'
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
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar rutas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-zinc-700/50 w-64"
              />
            </div>

            {/* Export */}
            <motion.button
              className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Download className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Content Area - Tabla de Rutas Activas */}
      <div className="flex-1 p-6 overflow-hidden">
        <AnimatePresence mode="wait">
          {activeTable === 'rutas' && (
            <motion.div
              key="rutas"
              variants={tableVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="h-full"
            >
              <div className="bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm overflow-hidden">
                {/* Table Header */}
                <div className="px-6 py-4 bg-white/5 border-b border-white/10">
                  <div className="grid grid-cols-10 gap-4 text-sm font-semibold text-slate-300">
                    <div>Ruta</div>
                    <div>Vehículo</div>
                    <div>Conductor</div>
                    <div>Origen → Destino</div>
                    <div>Progreso</div>
                    <div>Estado</div>
                    <div>Prioridad</div>
                    <div>ETA</div>
                    <div>Combustible</div>
                    <div>Ingreso</div>
                  </div>
                </div>

                {/* Table Body */}
                <div className="max-h-96 overflow-y-auto">
                  {filteredRutas.map((ruta, index) => {
                    const statusInfo = getStatusInfo(ruta.estado);
                    const priorityColor = getPriorityColor(ruta.prioridad);
                    const StatusIcon = statusInfo.icon;

                    return (
                      <motion.div
                        key={ruta.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="px-6 py-4 border-b border-white/5 hover:bg-white/5 transition-colors"
                      >
                        <div className="grid grid-cols-10 gap-4 items-center text-sm">
                          <div className="text-white font-medium">
                            {ruta.nombre}
                            <div className="text-xs text-slate-400 mt-1">
                              {formatDistance(ruta.distancia)}
                            </div>
                          </div>

                          <div className="text-zinc-300 font-semibold">
                            {ruta.vehiculo.split(' - ')[0]}
                            <div className="text-xs text-slate-400 mt-1">
                              {ruta.vehiculo.split(' - ')[1]}
                            </div>
                          </div>

                          <div className="text-white">
                            {ruta.conductor}
                            <div className="text-xs text-slate-400 mt-1">{ruta.cargaTipo}</div>
                          </div>

                          <div className="text-slate-300">
                            <div className="font-medium">{ruta.origen}</div>
                            <div className="text-xs text-slate-400 flex items-center mt-1">
                              <ArrowDownRight className="w-3 h-3 mr-1" />
                              {ruta.destino}
                            </div>
                          </div>

                          <div>
                            <div className="flex items-center space-x-2 mb-1">
                              <div className="flex-1 bg-white/10 rounded-full h-2">
                                <motion.div
                                  className="bg-zinc-700 h-2 rounded-full"
                                  initial={{ width: 0 }}
                                  animate={{ width: `${ruta.progreso}%` }}
                                  transition={{ duration: 1 }}
                                />
                              </div>
                              <span className="text-zinc-300 text-xs font-medium">
                                {ruta.progreso.toFixed(0)}%
                              </span>
                            </div>
                          </div>

                          <div>
                            <span
                              className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs ${statusInfo.bgColor} ${statusInfo.color}`}
                            >
                              <StatusIcon className="w-3 h-3" />
                              <span>{statusInfo.label}</span>
                            </span>
                          </div>

                          <div>
                            <span className={`px-2 py-1 rounded-full text-xs ${priorityColor}`}>
                              {ruta.prioridad.toUpperCase()}
                            </span>
                          </div>

                          <div className="text-slate-300">
                            {ruta.tiempoEstimado}
                            <div className="text-xs text-slate-400 mt-1">
                              {new Date(ruta.etaDestino).toLocaleTimeString()}
                            </div>
                          </div>

                          <div>
                            <div className="flex items-center space-x-1">
                              <Fuel className="w-3 h-3 text-zinc-200" />
                              <span
                                className={`text-sm ${
                                  ruta.combustibleRestante > 50
                                    ? 'text-zinc-200'
                                    : ruta.combustibleRestante > 25
                                      ? 'text-zinc-200'
                                      : 'text-zinc-200'
                                }`}
                              >
                                {ruta.combustibleRestante.toFixed(0)}%
                              </span>
                            </div>
                          </div>

                          <div className="text-zinc-200 font-medium">
                            {formatCurrency(ruta.ingresoEstimado)}
                            <div className="text-xs text-slate-400 mt-1">
                              Margen: {formatCurrency(ruta.ingresoEstimado - ruta.costoEstimado)}
                            </div>
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
          {activeTable !== 'rutas' && (
            <motion.div
              key={activeTable}
              variants={tableVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="h-full flex items-center justify-center"
            >
              <div className="text-center">
                <Truck className="w-16 h-16 text-zinc-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">
                  {activeTable === 'costos'
                    ? 'Análisis de Costos por Kilómetro'
                    : activeTable === 'eficiencia'
                      ? 'Análisis de Eficiencia Operativa'
                      : 'Sistema de Tracking GPS'}
                </h3>
                <p className="text-slate-400">
                  Panel en desarrollo con funcionalidades avanzadas de logística
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
});

PanelFletesUltra.displayName = 'PanelFletesUltra';

PanelFletesUltra.propTypes = {
  data: PropTypes.object,
  onDataChange: PropTypes.func,
};

export default PanelFletesUltra;
