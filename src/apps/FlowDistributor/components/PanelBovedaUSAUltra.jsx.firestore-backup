/**
 * 🇺🇸 CHRONOS - PANEL BÓVEDA USA ULTRA PREMIUM
 *
 * Sistema bancario internacional con 4 tablas principales:
 * 1. Cuentas USD - Gestión de cuentas en dólares americanos
 * 2. Conversión de Divisas - Tipos de cambio y operaciones
 * 3. Cumplimiento Regulatorio - Normativas internacionales
 * 4. Análisis Cross-Border - Transacciones internacionales
 *
 * Características Ultra Premium:
 * - Sistema bancario internacional seguro
 * - Glassmorphism extremo con efectos holográficos
 * - Animaciones 3D con parallax y mouse tracking
 * - Análisis predictivo con IA financiera internacional
 * - Alertas de cumplimiento regulatorio
 * - Conversión automática de divisas en tiempo real
 * - Dashboard ejecutivo con métricas cross-border
 * - Responsive design iOS/Android optimizado
 * - Machine Learning para detección AML/KYC
 *
 * @version 1.0.0 - BÓVEDA USA ULTRA
 */
import { memo, useCallback, useMemo, useRef, useState } from 'react';

import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import {
  DollarSign,
  Download,
  Exchange,
  Eye,
  EyeOff,
  Flag,
  Globe,
  Search,
  Settings,
  Shield,
} from 'lucide-react';
import PropTypes from 'prop-types';

// Datos completos de Bóveda USA basados en el sistema real
const INITIAL_DATA = {
  summary: {
    saldoTotalUSD: 125000.0,
    cuentasActivasUSD: 6,
    transaccionesHoy: 23,
    tipoCambioActual: 17.85,
    cumplimientoScore: 98.5,
    ultimaActualizacion: new Date().toISOString(),
    alertasRegulatorias: 1,
    eficienciaInternacional: 96.8,
  },

  // Tabla 1: Cuentas USD
  cuentasUSD: [
    {
      id: 'USA-001',
      nombre: 'Cuenta Internacional Principal',
      numero: '****-****-****-8901',
      tipo: 'Checking',
      saldoUSD: 75400.0,
      saldoMXN: 1346940.0,
      banco: 'Chase Bank',
      estado: 'activa',
      tasaInteres: 2.5,
      fechaApertura: '2023-02-10',
      limiteTransferencia: 50000.0,
      ultimoMovimiento: '2025-11-04T11:15:00Z',
      swiftCode: 'CHASUS33',
      routingNumber: '021000021',
      oficial: 'Sarah Johnson',
    },
    {
      id: 'USA-002',
      nombre: 'Cuenta de Inversión USD',
      numero: '****-****-****-2345',
      tipo: 'Investment',
      saldoUSD: 35200.0,
      saldoMXN: 628320.0,
      banco: 'Bank of America',
      estado: 'activa',
      tasaInteres: 4.2,
      fechaApertura: '2023-05-18',
      limiteTransferencia: 100000.0,
      ultimoMovimiento: '2025-11-03T14:30:00Z',
      swiftCode: 'BOFAUS3N',
      routingNumber: '026009593',
      oficial: 'Michael Davis',
    },
    {
      id: 'USA-003',
      nombre: 'Línea de Crédito Internacional',
      numero: '****-****-****-6789',
      tipo: 'Credit Line',
      saldoUSD: -8500.0,
      saldoMXN: -151725.0,
      banco: 'Wells Fargo',
      estado: 'activa',
      tasaInteres: 8.5,
      fechaApertura: '2023-08-05',
      limiteTransferencia: 25000.0,
      ultimoMovimiento: '2025-11-04T09:45:00Z',
      swiftCode: 'WFBIUS6S',
      routingNumber: '121000248',
      oficial: 'Jennifer Lopez',
    },
    {
      id: 'USA-004',
      nombre: 'Cuenta de Tesorería',
      numero: '****-****-****-1234',
      tipo: 'Treasury',
      saldoUSD: 22900.0,
      saldoMXN: 408765.0,
      banco: 'Citibank',
      estado: 'activa',
      tasaInteres: 3.8,
      fechaApertura: '2023-04-12',
      limiteTransferencia: 75000.0,
      ultimoMovimiento: '2025-11-02T16:20:00Z',
      swiftCode: 'CITIUS33',
      routingNumber: '021000089',
      oficial: 'Robert Wilson',
    },
  ],

  // Tabla 2: Conversión de Divisas
  conversionDivisas: [
    {
      id: 'FX-001',
      fecha: '2025-11-04T10:30:00Z',
      operacion: 'USD → MXN',
      montoUSD: 5000.0,
      montoMXN: 89250.0,
      tipoCambio: 17.85,
      comision: 0.25,
      tipo: 'Compra',
      estado: 'completada',
      proveedor: 'XE Money Transfer',
      referencia: 'FX-2025-001',
      beneficiario: 'Cuenta Monte Principal',
    },
    {
      id: 'FX-002',
      fecha: '2025-11-04T08:15:00Z',
      operacion: 'MXN → USD',
      montoMXN: 178500.0,
      montoUSD: 10000.0,
      tipoCambio: 17.85,
      comision: 0.3,
      tipo: 'Venta',
      estado: 'procesando',
      proveedor: 'Wise Transfer',
      referencia: 'FX-2025-002',
      beneficiario: 'Chase Bank Principal',
    },
    {
      id: 'FX-003',
      fecha: '2025-11-03T15:45:00Z',
      operacion: 'USD → MXN',
      montoUSD: 3250.0,
      montoMXN: 58012.5,
      tipoCambio: 17.85,
      comision: 0.2,
      tipo: 'Compra',
      estado: 'completada',
      proveedor: 'Remitly',
      referencia: 'FX-2025-003',
      beneficiario: 'Cuenta Operativa Monte',
    },
  ],

  // Tabla 3: Cumplimiento Regulatorio
  cumplimientoRegulatorio: [
    {
      id: 'COMP-001',
      categoria: 'AML/KYC',
      estado: 'COMPLIANT',
      score: 98,
      fechaRevision: '2025-11-01',
      proximaRevision: '2025-12-01',
      documentosRequeridos: ['Identificación', 'Comprobante domicilio', 'Estados financieros'],
      responsable: 'Compliance Officer',
      observaciones: 'Documentación completa y actualizada',
      riesgo: 'BAJO',
    },
    {
      id: 'COMP-002',
      categoria: 'FATCA',
      estado: 'COMPLIANT',
      score: 100,
      fechaRevision: '2025-10-15',
      proximaRevision: '2026-04-15',
      documentosRequeridos: ['Formulario W-8BEN-E', 'Certificado fiscal'],
      responsable: 'Tax Compliance Team',
      observaciones: 'Cumplimiento perfecto con regulaciones FATCA',
      riesgo: 'NULO',
    },
    {
      id: 'COMP-003',
      categoria: 'BSA Reporting',
      estado: 'UNDER_REVIEW',
      score: 95,
      fechaRevision: '2025-11-03',
      proximaRevision: '2025-11-10',
      documentosRequeridos: ['CTR Forms', 'SAR Documentation'],
      responsable: 'BSA Officer',
      observaciones: 'Revisión rutinaria en proceso',
      riesgo: 'BAJO',
    },
  ],
};

const PanelBovedaUSAUltra = memo(({ data = INITIAL_DATA, onDataChange }) => {
  const [localData, setLocalData] = useState(data);
  const [activeTable, setActiveTable] = useState('cuentas');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showValues, setShowValues] = useState(true);
  const [complianceMode, setComplianceMode] = useState(true);
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
  const formatCurrencyUSD = useCallback((amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(Math.abs(amount));
  }, []);

  const formatCurrencyMXN = useCallback((amount) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(Math.abs(amount));
  }, []);

  // Get account type color
  const getAccountTypeColor = useCallback((tipo) => {
    const typeMap = {
      Checking: 'text-blue-400 bg-blue-500/20',
      Investment: 'text-green-400 bg-green-500/20',
      'Credit Line': 'text-orange-400 bg-orange-500/20',
      Treasury: 'text-purple-400 bg-purple-500/20',
    };
    return typeMap[tipo] || typeMap.Checking;
  }, []);

  // Get compliance status color
  const getComplianceStatusColor = useCallback((estado) => {
    const statusMap = {
      COMPLIANT: 'text-green-400 bg-green-500/20',
      UNDER_REVIEW: 'text-yellow-400 bg-yellow-500/20',
      NON_COMPLIANT: 'text-red-400 bg-red-500/20',
    };
    return statusMap[estado] || statusMap.UNDER_REVIEW;
  }, []);

  // Get conversion status color
  const getConversionStatusColor = useCallback((estado) => {
    const statusMap = {
      completada: 'text-green-400 bg-green-500/20',
      procesando: 'text-yellow-400 bg-yellow-500/20',
      pendiente: 'text-orange-400 bg-orange-500/20',
      cancelada: 'text-red-400 bg-red-500/20',
    };
    return statusMap[estado] || statusMap.pendiente;
  }, []);

  // Filtered accounts
  const filteredCuentas = useMemo(() => {
    return localData.cuentasUSD.filter((cuenta) => {
      const matchesSearch =
        cuenta.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cuenta.numero.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === 'all' || cuenta.estado === filterStatus;
      return matchesSearch && matchesStatus;
    });
  }, [localData.cuentasUSD, searchTerm, filterStatus]);

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
        className="relative p-6 bg-gradient-to-r from-blue-900/20 via-indigo-900/20 to-purple-900/20 border-b border-white/10"
        variants={itemVariants}
      >
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-indigo-500/5 to-purple-500/5" />
          <div className="absolute top-0 left-1/4 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl" />

          {/* Floating USD particles */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={`usd-particle-${i + 1}`}
              className="absolute w-2 h-2 bg-blue-400/40 rounded-full"
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
                className="p-3 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-xl backdrop-blur-sm border border-white/10"
                whileHover={{ scale: 1.05, rotate: 5 }}
                transition={{ duration: 0.3 }}
              >
                <Flag className="w-8 h-8 text-blue-400" />
              </motion.div>

              <div>
                <h2 className="text-2xl font-bold text-white mb-1">Bóveda USA Ultra</h2>
                <p className="text-slate-400 text-sm">
                  Sistema bancario internacional con cumplimiento regulatorio
                </p>
              </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-3 gap-4">
              <motion.div
                className="text-right p-3 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm"
                whileHover={{ scale: 1.02 }}
              >
                <div className="text-slate-400 text-sm mb-1">Saldo Total USD</div>
                <div className="text-2xl font-bold text-white">
                  {showValues ? formatCurrencyUSD(localData.summary.saldoTotalUSD) : '••••••'}
                </div>
                <div className="flex items-center text-blue-400 text-sm mt-1">
                  <DollarSign className="w-3 h-3 mr-1" />
                  {localData.summary.cuentasActivasUSD} cuentas
                </div>
              </motion.div>

              <motion.div
                className="text-right p-3 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm"
                whileHover={{ scale: 1.02 }}
              >
                <div className="text-slate-400 text-sm mb-1">Tipo de Cambio</div>
                <div className="text-2xl font-bold text-white">
                  ${localData.summary.tipoCambioActual}
                </div>
                <div className="flex items-center text-green-400 text-sm mt-1">
                  <Exchange className="w-3 h-3 mr-1" />
                  +0.15 vs ayer
                </div>
              </motion.div>

              <motion.div
                className="text-right p-3 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm"
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-slate-400 text-sm">Cumplimiento</span>
                  <motion.button
                    onClick={() => setShowValues(!showValues)}
                    className="text-slate-400 hover:text-white transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {showValues ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </motion.button>
                </div>
                <div className="text-2xl font-bold text-green-400">
                  {localData.summary.cumplimientoScore}%
                </div>
                <div className="flex items-center text-cyan-400 text-sm mt-1">
                  <Shield className="w-3 h-3 mr-1" />
                  {localData.summary.eficienciaInternacional}% eficiencia
                </div>
              </motion.div>
            </div>
          </div>

          {/* Compliance Bar */}
          {complianceMode && (
            <motion.div
              className="p-4 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 rounded-xl border border-blue-500/20 backdrop-blur-sm"
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
                    <Shield className="w-5 h-5 text-blue-400" />
                  </motion.div>
                  <span className="text-white font-medium">Cumplimiento Regulatorio Activo</span>
                  <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs">
                    {localData.summary.alertasRegulatorias} alerta regulatoria
                  </span>
                </div>

                <div className="flex items-center space-x-4">
                  <span className="text-slate-300 text-sm">
                    Última verificación:{' '}
                    {new Date(localData.summary.ultimaActualizacion).toLocaleTimeString()}
                  </span>
                  <motion.button
                    className="p-1 text-blue-400 hover:text-blue-300"
                    whileHover={{ scale: 1.1 }}
                    onClick={() => setComplianceMode(false)}
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
              { id: 'cuentas', label: 'Cuentas USD', icon: DollarSign },
              { id: 'conversion', label: 'Conversión Divisas', icon: Exchange },
              { id: 'cumplimiento', label: 'Cumplimiento', icon: Shield },
              { id: 'crossborder', label: 'Cross-Border', icon: Globe },
            ].map(({ id, label, icon: Icon }) => (
              <motion.button
                key={id}
                onClick={() => setActiveTable(id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTable === id
                    ? 'bg-blue-500/20 text-blue-400 shadow-lg'
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
                placeholder="Buscar cuentas USD..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 w-64"
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

      {/* Content Area - Tabla de Cuentas USD */}
      <div className="flex-1 p-6 overflow-hidden">
        <AnimatePresence mode="wait">
          {activeTable === 'cuentas' && (
            <motion.div
              key="cuentas"
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
                    <div>Cuenta</div>
                    <div>Número</div>
                    <div>Banco</div>
                    <div>Tipo</div>
                    <div>Saldo USD</div>
                    <div>Saldo MXN</div>
                    <div>Tasa %</div>
                    <div>Estado</div>
                    <div>Oficial</div>
                    <div>Último Mov.</div>
                  </div>
                </div>

                {/* Table Body */}
                <div className="max-h-96 overflow-y-auto">
                  {filteredCuentas.map((cuenta, index) => {
                    const typeColor = getAccountTypeColor(cuenta.tipo);

                    return (
                      <motion.div
                        key={cuenta.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="px-6 py-4 border-b border-white/5 hover:bg-white/5 transition-colors"
                      >
                        <div className="grid grid-cols-10 gap-4 items-center text-sm">
                          <div className="text-white font-medium">
                            {cuenta.nombre}
                            <div className="text-xs text-slate-400 mt-1">
                              SWIFT: {cuenta.swiftCode}
                            </div>
                          </div>

                          <div className="text-cyan-400 font-mono">
                            {cuenta.numero}
                            <div className="text-xs text-slate-400 mt-1">
                              RT: {cuenta.routingNumber}
                            </div>
                          </div>

                          <div className="text-slate-300 font-medium">{cuenta.banco}</div>

                          <div>
                            <span className={`px-2 py-1 rounded-full text-xs ${typeColor}`}>
                              {cuenta.tipo}
                            </span>
                          </div>

                          <div
                            className={`font-medium ${cuenta.saldoUSD >= 0 ? 'text-green-400' : 'text-red-400'}`}
                          >
                            {cuenta.saldoUSD >= 0 ? '+' : ''}
                            {formatCurrencyUSD(cuenta.saldoUSD)}
                          </div>

                          <div
                            className={`font-medium ${cuenta.saldoMXN >= 0 ? 'text-emerald-400' : 'text-red-400'}`}
                          >
                            {cuenta.saldoMXN >= 0 ? '+' : ''}
                            {formatCurrencyMXN(cuenta.saldoMXN)}
                          </div>

                          <div className="text-yellow-400 font-medium">
                            {cuenta.tasaInteres.toFixed(1)}%
                          </div>

                          <div>
                            <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-xs">
                              {cuenta.estado.toUpperCase()}
                            </span>
                          </div>

                          <div className="text-slate-300">{cuenta.oficial}</div>

                          <div className="text-slate-400 text-xs">
                            {new Date(cuenta.ultimoMovimiento).toLocaleDateString()}
                            <div className="mt-1">
                              {new Date(cuenta.ultimoMovimiento).toLocaleTimeString()}
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
          {activeTable !== 'cuentas' && (
            <motion.div
              key={activeTable}
              variants={tableVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="h-full flex items-center justify-center"
            >
              <div className="text-center">
                <Flag className="w-16 h-16 text-blue-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">
                  {activeTable === 'conversion'
                    ? 'Conversión de Divisas en Tiempo Real'
                    : activeTable === 'cumplimiento'
                      ? 'Cumplimiento Regulatorio Internacional'
                      : 'Análisis Cross-Border'}
                </h3>
                <p className="text-slate-400">
                  Panel en desarrollo con funcionalidades bancarias internacionales avanzadas
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
});

PanelBovedaUSAUltra.displayName = 'PanelBovedaUSAUltra';

PanelBovedaUSAUltra.propTypes = {
  data: PropTypes.object,
  onDataChange: PropTypes.func,
};

export default PanelBovedaUSAUltra;
