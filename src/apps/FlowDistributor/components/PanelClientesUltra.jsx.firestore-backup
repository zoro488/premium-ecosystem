/**
 * 👥 CHRONOS - PANEL CLIENTES ULTRA PREMIUM
 *
 * Panel de CRM con 4 tablas principales:
 * 1. Base de Clientes (31 específicos) - Gestión completa de customer data
 * 2. Customer Journey - Tracking de interacciones y touchpoints
 * 3. Segmentación AI - Clasificación inteligente y personas
 * 4. Analytics 360° - Business intelligence y customer lifetime value
 *
 * @version 1.1.0 - CUSTOMER RELATIONSHIP MANAGEMENT SYSTEM - Data-driven
 */
import { memo, useCallback, useMemo, useRef, useState } from 'react';

import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import {
  AlertTriangle,
  ArrowDown,
  ArrowRight,
  ArrowUp,
  Award,
  BarChart3,
  Building2,
  Calendar,
  CheckCircle,
  Clock,
  Crown,
  DollarSign,
  Download,
  Eye,
  EyeOff,
  Filter,
  Flame,
  Heart,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  RefreshCw,
  Search,
  Settings,
  Star,
  Target,
  TrendingDown,
  TrendingUp,
  Trophy,
  User,
  UserPlus,
  Users,
  Zap,
} from 'lucide-react';
import PropTypes from 'prop-types';

import clientesData from '../data/panel-clientes-manual.json';

// Mantenemos los datos detallados como una fuente estática para enriquecer los datos del JSON
const DETAILED_CLIENT_DATA = {
  'Corporativo Monterrey SA': {
    categoria: 'Enterprise',
    segmento: 'Corporativo',
    industria: 'Tecnología',
    fechaRegistro: '2023-03-15T09:00:00Z',
    ultimaInteraccion: '2025-11-05T14:30:00Z',
    vendedorAsignado: 'Carlos Mendoza',
    estado: 'activo',
    healthScore: 85,
    contactoPrincipal: {
      nombre: 'Ing. Roberto Silva',
      cargo: 'Director de Tecnología',
      email: 'roberto.silva@corpmont.mx',
      telefono: '+52 81 1234 5678',
    },
    direccion: {
      calle: 'Av. Constitución 2847',
      ciudad: 'Monterrey',
      estado: 'Nuevo León',
      pais: 'México',
      codigoPostal: '64000',
    },
    preferencias: ['email', 'whatsapp'],
    tags: ['high_value', 'tech_leader', 'strategic'],
    notas: 'Cliente estratégico con alto potencial de crecimiento',
  },
  'Innovación Digital CDMX': {
    categoria: 'Premium',
    segmento: 'Mediano',
    industria: 'Digital',
    fechaRegistro: '2023-07-22T11:30:00Z',
    ultimaInteraccion: '2025-11-04T16:45:00Z',
    vendedorAsignado: 'María González',
    estado: 'activo',
    healthScore: 78,
    contactoPrincipal: {
      nombre: 'Lic. Ana Martínez',
      cargo: 'Gerente de Innovación',
      email: 'ana.martinez@innovadigital.mx',
      telefono: '+52 55 9876 5432',
    },
    direccion: {
      calle: 'Polanco Business Center 456',
      ciudad: 'Ciudad de México',
      estado: 'CDMX',
      pais: 'México',
      codigoPostal: '11560',
    },
    preferencias: ['email', 'telefono'],
    tags: ['digital_native', 'startup', 'growth_potential'],
    notas: 'Startup en crecimiento acelerado',
  },
  Ax: {
    categoria: 'Premium',
    segmento: 'Mediano',
    industria: 'Digital',
    fechaRegistro: '2023-07-22T11:30:00Z',
    ultimaInteraccion: '2025-11-04T16:45:00Z',
    vendedorAsignado: 'María González',
    estado: 'activo',
    healthScore: 78,
    contactoPrincipal: {
      nombre: 'Lic. Ana Martínez',
      cargo: 'Gerente de Innovación',
      email: 'ana.martinez@innovadigital.mx',
      telefono: '+52 55 9876 5432',
    },
    direccion: {
      calle: 'Polanco Business Center 456',
      ciudad: 'Ciudad de México',
      estado: 'CDMX',
      pais: 'México',
      codigoPostal: '11560',
    },
    preferencias: ['email', 'telefono'],
    tags: ['digital_native', 'startup', 'growth_potential'],
    notas: 'Startup en crecimiento acelerado',
  },
  // ... agregar más datos detallados para otros clientes si es necesario
};

const PanelClientesUltra = memo(() => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSegmento, setFilterSegmento] = useState('all');
  const [showValues, setShowValues] = useState(true);
  const [selectedClient, setSelectedClient] = useState(null);

  const mergedClientes = useMemo(() => {
    return clientesData.clientes.map((cliente, index) => {
      const details = DETAILED_CLIENT_DATA[cliente.cliente] || {};
      return {
        id: `CLI-${index + 1}`,
        nombre: cliente.cliente,
        actual: cliente.actual,
        deuda: cliente.deuda,
        abonos: cliente.abonos,
        pendiente: cliente.pendiente,
        observaciones: cliente.observaciones,
        // Datos enriquecidos
        categoria: details.categoria || 'Standard',
        segmento: details.segmento || 'General',
        industria: details.industria || 'Varios',
        fechaRegistro: details.fechaRegistro || new Date().toISOString(),
        ultimaInteraccion: details.ultimaInteraccion || new Date().toISOString(),
        vendedorAsignado: details.vendedorAsignado || 'N/A',
        estado: details.estado || 'activo',
        healthScore: details.healthScore || 60,
        clv: cliente.deuda + cliente.abonos, // Cálculo simple de CLV
        totalVentas: cliente.abonos,
        totalOrdenes: cliente.observaciones.length > 5 ? 5 : 1, // Placeholder
        contactoPrincipal: details.contactoPrincipal || {
          nombre: 'N/A',
          cargo: 'N/A',
          email: 'N/A',
          telefono: 'N/A',
        },
        direccion: details.direccion || {
          calle: 'N/A',
          ciudad: 'N/A',
          estado: 'N/A',
          pais: 'N/A',
          codigoPostal: 'N/A',
        },
        preferencias: details.preferencias || ['email'],
        tags: details.tags || ['general'],
        notas: details.notas || cliente.observaciones,
      };
    });
  }, []);

  const [localData, setLocalData] = useState(mergedClientes);

  const summary = useMemo(() => {
    const totalClientes = localData.length;
    const clientesActivos = localData.filter((c) => c.estado === 'activo').length;
    const valorTotalCartera = localData.reduce((acc, c) => acc + c.pendiente, 0);
    const clvPromedio =
      totalClientes > 0 ? localData.reduce((acc, c) => acc + c.clv, 0) / totalClientes : 0;

    return {
      totalClientes,
      clientesActivos,
      clientesNuevos: 5, // Placeholder
      clientesPremium: localData.filter(
        (c) => c.categoria === 'Premium' || c.categoria === 'Enterprise'
      ).length,
      valorTotalCartera,
      clvPromedio,
      satisfactionScore: 4.7, // Placeholder
      retentionRate: 89.2, // Placeholder
      churnRate: 10.8, // Placeholder
      interaccionesDelMes: 247, // Placeholder
      touchPointsActivos: 156, // Placeholder
      ultimaActualizacion: new Date().toISOString(),
    };
  }, [localData]);

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

  // Get health score color
  const getHealthScoreColor = useCallback((score) => {
    if (score >= 85) return { color: 'text-green-400', bgColor: 'bg-green-500/20' };
    if (score >= 70) return { color: 'text-blue-400', bgColor: 'bg-blue-500/20' };
    if (score >= 60) return { color: 'text-yellow-400', bgColor: 'bg-yellow-500/20' };
    return { color: 'text-red-400', bgColor: 'bg-red-500/20' };
  }, []);

  // Get category icon
  const getCategoryIcon = useCallback((categoria) => {
    switch (categoria) {
      case 'Enterprise':
        return Crown;
      case 'Premium':
        return Star;
      case 'Standard':
        return User;
      default:
        return Users;
    }
  }, []);

  // Filtered data
  const filteredClientes = useMemo(() => {
    return localData.filter((cliente) => {
      const matchesSearch =
        cliente.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (cliente.industria && cliente.industria.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesSegment = filterSegmento === 'all' || cliente.segmento === filterSegmento;
      return matchesSearch && matchesSegment;
    });
  }, [localData, searchTerm, filterSegmento]);

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
      className="h-full bg-black/95 backdrop-blur-3xl border border-white/10 rounded-2xl overflow-hidden flex flex-col"
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
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-cyan-500/5 to-teal-500/5" />
          <div className="absolute top-0 left-1/4 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-24 h-24 bg-cyan-500/10 rounded-full blur-2xl" />

          {/* Floating customer particles */}
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={`customer-particle-${i + 1}`}
              className="absolute w-2 h-2 bg-cyan-400/40 rounded-full"
              style={{
                left: `${8 + i * 6}%`,
                top: `${20 + (i % 3) * 25}%`,
              }}
              animate={{
                y: [-8, 12, -8],
                opacity: [0.4, 1, 0.4],
                scale: [1, 1.3, 1],
              }}
              transition={{
                duration: 2.8 + i * 0.2,
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
                className="p-3 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl backdrop-blur-sm border border-white/10"
                whileHover={{ scale: 1.05, rotate: 5 }}
                transition={{ duration: 0.3 }}
              >
                <Users className="w-8 h-8 text-cyan-400" />
              </motion.div>

              <div>
                <h2 className="text-2xl font-bold text-white mb-1">Clientes Ultra</h2>
                <p className="text-slate-400 text-sm">
                  Customer Relationship Management con {summary.totalClientes} clientes
                </p>
              </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-3 gap-4">
              <motion.div
                className="text-right p-3 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm"
                whileHover={{ scale: 1.02 }}
              >
                <div className="text-slate-400 text-sm mb-1">Total Clientes</div>
                <div className="text-2xl font-bold text-white">{summary.totalClientes}</div>
                <div className="flex items-center text-green-400 text-sm mt-1 justify-end">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  {summary.clientesActivos} activos
                </div>
              </motion.div>

              <motion.div
                className="text-right p-3 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm"
                whileHover={{ scale: 1.02 }}
              >
                <div className="text-slate-400 text-sm mb-1">Deuda Total Cartera</div>
                <div className="text-2xl font-bold text-white">
                  {showValues ? formatCurrency(summary.valorTotalCartera) : '••••••••'}
                </div>
                <div className="flex items-center text-cyan-400 text-sm mt-1 justify-end">
                  <DollarSign className="w-3 h-3 mr-1" />
                  CLV Prom: {showValues ? formatCurrency(summary.clvPromedio) : '••••••'}
                </div>
              </motion.div>

              <motion.div
                className="text-right p-3 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm"
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-slate-400 text-sm">Clientes Premium</span>
                  <motion.button
                    onClick={() => setShowValues(!showValues)}
                    className="text-slate-400 hover:text-white transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {showValues ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </motion.button>
                </div>
                <div className="text-2xl font-bold text-white">{summary.clientesPremium}</div>
                <div className="flex items-center text-blue-400 text-sm mt-1 justify-end">
                  <Heart className="w-3 h-3 mr-1" />
                  Retención: {summary.retentionRate}%
                </div>
              </motion.div>
            </div>
          </div>
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
              { id: 'clientes', label: 'Base Clientes', icon: Users },
              { id: 'journey', label: 'Customer Journey', icon: MapPin },
              { id: 'segmentacion', label: 'Segmentación AI', icon: Target },
              { id: 'analytics', label: 'Analytics 360°', icon: BarChart3 },
            ].map(({ id, label, icon: Icon }) => (
              <motion.button
                key={id}
                onClick={() => alert('Navegación a otras tablas en desarrollo.')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  'clientes' === id
                    ? 'bg-cyan-500/20 text-cyan-400 shadow-lg'
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
            {/* Segment Filter */}
            <select
              value={filterSegmento}
              onChange={(e) => setFilterSegmento(e.target.value)}
              className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
            >
              <option value="all">Todos los segmentos</option>
              <option value="Corporativo">Corporativo</option>
              <option value="Mediano">Mediano</option>
              <option value="Industrial">Industrial</option>
              <option value="Retail">Retail</option>
              <option value="Financiero">Financiero</option>
              <option value="Tecnología">Tecnología</option>
            </select>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar clientes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500/50 w-64"
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

      {/* Content Area - Tabla de Base de Clientes */}
      <div className="flex-1 p-6 overflow-hidden">
        <AnimatePresence mode="wait">
          {'clientes' === 'clientes' && (
            <motion.div
              key="clientes"
              variants={tableVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="h-full"
            >
              <div className="bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm overflow-hidden h-full flex flex-col">
                {/* Table Header */}
                <div className="px-6 py-4 bg-white/5 border-b border-white/10">
                  <div className="grid grid-cols-8 gap-4 text-sm font-semibold text-slate-300">
                    <div>Cliente</div>
                    <div>Categoría</div>
                    <div>Health Score</div>
                    <div>Deuda Pendiente</div>
                    <div>Última Interacción</div>
                    <div>Vendedor</div>
                    <div>Contacto</div>
                    <div>Acciones</div>
                  </div>
                </div>

                {/* Table Body */}
                <div className="overflow-y-auto">
                  {filteredClientes.map((cliente, index) => {
                    const healthColor = getHealthScoreColor(cliente.healthScore);
                    const CategoryIcon = getCategoryIcon(cliente.categoria);

                    return (
                      <motion.div
                        key={cliente.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="px-6 py-4 border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer"
                        onClick={() => setSelectedClient(cliente)}
                      >
                        <div className="grid grid-cols-8 gap-4 items-center text-sm">
                          <div className="text-white font-medium">
                            {cliente.nombre}
                            <div className="text-xs text-slate-400 mt-1">{cliente.industria}</div>
                          </div>

                          <div className="flex items-center space-x-2">
                            <CategoryIcon className="w-4 h-4 text-cyan-400" />
                            <span className="text-cyan-400">{cliente.categoria}</span>
                          </div>

                          <div className="text-center">
                            <div className={`text-lg font-bold ${healthColor.color}`}>
                              {cliente.healthScore}
                            </div>
                            <div className="w-full bg-white/10 rounded-full h-1.5 mt-1">
                              <div
                                className={`h-1.5 rounded-full ${healthColor.color.replace('text-', 'bg-')}`}
                                style={{ width: `${cliente.healthScore}%` }}
                              />
                            </div>
                          </div>

                          <div
                            className="font-bold"
                            style={{ color: cliente.pendiente > 0 ? 'orange' : 'lightgreen' }}
                          >
                            {formatCurrency(cliente.pendiente)}
                            <div className="text-xs text-slate-400 mt-1">
                              {cliente.totalOrdenes} órdenes
                            </div>
                          </div>

                          <div className="text-slate-300 text-xs">
                            {new Date(cliente.ultimaInteraccion).toLocaleDateString()}
                            <div className="text-slate-400">
                              {Math.ceil(
                                (new Date() - new Date(cliente.ultimaInteraccion)) /
                                  (1000 * 60 * 60 * 24)
                              )}{' '}
                              días
                            </div>
                          </div>

                          <div className="text-slate-300">{cliente.vendedorAsignado}</div>

                          <div className="text-slate-300 text-xs">
                            {cliente.contactoPrincipal.nombre}
                            <div className="text-slate-400">{cliente.contactoPrincipal.cargo}</div>
                          </div>

                          <div className="flex space-x-1">
                            <motion.button
                              className="p-1 text-green-400 hover:text-green-300"
                              whileHover={{ scale: 1.1 }}
                            >
                              <Phone className="w-4 h-4" />
                            </motion.button>
                            <motion.button
                              className="p-1 text-blue-400 hover:text-blue-300"
                              whileHover={{ scale: 1.1 }}
                            >
                              <Mail className="w-4 h-4" />
                            </motion.button>
                            <motion.button
                              className="p-1 text-purple-400 hover:text-purple-300"
                              whileHover={{ scale: 1.1 }}
                            >
                              <MessageSquare className="w-4 h-4" />
                            </motion.button>
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
          {'clientes' !== 'clientes' && (
            <motion.div
              key={'clientes'}
              variants={tableVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="h-full flex items-center justify-center"
            >
              <div className="text-center">
                <Users className="w-16 h-16 text-cyan-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">
                  {'clientes' === 'journey'
                    ? 'Customer Journey Analytics en Tiempo Real'
                    : 'clientes' === 'segmentacion'
                      ? 'Segmentación AI con Machine Learning'
                      : 'Analytics 360° y Customer Intelligence'}
                </h3>
                <p className="text-slate-400">
                  Panel en desarrollo con {summary.totalClientes} clientes específicos y CRM
                  avanzado
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Client Detail Modal */}
      <AnimatePresence>
        {selectedClient && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedClient(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-slate-800/90 backdrop-blur-xl p-6 rounded-2xl border border-cyan-500/30 max-w-4xl w-full max-h-[80vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-lg">
                    <Building2 className="w-6 h-6 text-cyan-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">{selectedClient.nombre}</h3>
                    <p className="text-slate-400">
                      {selectedClient.industria} • {selectedClient.categoria}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <div
                    className={`px-3 py-1 rounded-full text-sm ${getHealthScoreColor(selectedClient.healthScore).bgColor} ${getHealthScoreColor(selectedClient.healthScore).color}`}
                  >
                    Health Score: {selectedClient.healthScore}
                  </div>
                  <motion.button
                    onClick={() => setSelectedClient(null)}
                    className="p-2 text-slate-400 hover:text-white rounded-lg transition-colors"
                    whileHover={{ scale: 1.05 }}
                  >
                    ✕
                  </motion.button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Client Details */}
                <div className="space-y-4">
                  <div className="bg-slate-700/50 p-4 rounded-xl">
                    <h4 className="font-semibold text-white mb-3 flex items-center">
                      <User className="w-4 h-4 mr-2" />
                      Información General
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Segmento:</span>
                        <span className="text-white">{selectedClient.segmento}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Registro:</span>
                        <span className="text-white">
                          {new Date(selectedClient.fechaRegistro).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Vendedor:</span>
                        <span className="text-white">{selectedClient.vendedorAsignado}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Estado:</span>
                        <span
                          className={
                            selectedClient.estado === 'activo' ? 'text-green-400' : 'text-red-400'
                          }
                        >
                          {selectedClient.estado}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-700/50 p-4 rounded-xl">
                    <h4 className="font-semibold text-white mb-3 flex items-center">
                      <MapPin className="w-4 h-4 mr-2" />
                      Contacto Principal
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Nombre:</span>
                        <span className="text-white">
                          {selectedClient.contactoPrincipal.nombre}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Cargo:</span>
                        <span className="text-white">{selectedClient.contactoPrincipal.cargo}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Email:</span>
                        <span className="text-cyan-400">
                          {selectedClient.contactoPrincipal.email}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Teléfono:</span>
                        <span className="text-cyan-400">
                          {selectedClient.contactoPrincipal.telefono}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Financial & Performance */}
                <div className="space-y-4">
                  <div className="bg-slate-700/50 p-4 rounded-xl">
                    <h4 className="font-semibold text-white mb-3 flex items-center">
                      <DollarSign className="w-4 h-4 mr-2" />
                      Métricas Financieras
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Deuda Pendiente:</span>
                        <span
                          className="font-bold"
                          style={{ color: selectedClient.pendiente > 0 ? 'orange' : 'lightgreen' }}
                        >
                          {formatCurrency(selectedClient.pendiente)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Total Abonado:</span>
                        <span className="text-green-400">
                          {formatCurrency(selectedClient.abonos)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Total Deuda Histórica:</span>
                        <span className="text-white">{formatCurrency(selectedClient.deuda)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">CLV (calculado):</span>
                        <span className="text-green-400 font-bold">
                          {formatCurrency(selectedClient.clv)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-700/50 p-4 rounded-xl">
                    <h4 className="font-semibold text-white mb-3 flex items-center">
                      <Building2 className="w-4 h-4 mr-2" />
                      Dirección
                    </h4>
                    <div className="space-y-1 text-sm text-slate-300">
                      <p>{selectedClient.direccion.calle}</p>
                      <p>
                        {selectedClient.direccion.ciudad}, {selectedClient.direccion.estado}
                      </p>
                      <p>
                        {selectedClient.direccion.pais} • {selectedClient.direccion.codigoPostal}
                      </p>
                    </div>

                    <div className="mt-3">
                      <h5 className="text-slate-400 text-xs mb-2">Tags:</h5>
                      <div className="flex flex-wrap gap-1">
                        {selectedClient.tags.map((tag, index) => (
                          <span
                            key={index}
                            className={`px-2 py-1 bg-cyan-500/20 text-cyan-400 rounded-full text-xs`}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {selectedClient.notas && (
                <div className="mt-6 bg-slate-700/50 p-4 rounded-xl">
                  <h4 className="font-semibold text-white mb-2 flex items-center">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Notas
                  </h4>
                  <p className="text-slate-300 text-sm">{selectedClient.notas}</p>
                </div>
              )}

              <div className="flex justify-end gap-3 mt-6">
                <motion.button
                  className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
                  onClick={() => setSelectedClient(null)}
                  whileHover={{ scale: 1.02 }}
                >
                  Cerrar
                </motion.button>
                <motion.button
                  className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors"
                  whileHover={{ scale: 1.02 }}
                >
                  Editar Cliente
                </motion.button>
                <motion.button
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  whileHover={{ scale: 1.02 }}
                >
                  Nueva Interacción
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
});

PanelClientesUltra.displayName = 'PanelClientesUltra';

export default PanelClientesUltra;
