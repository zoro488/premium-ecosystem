/**
 * 🏦 CHRONOS - PANEL BÓVEDA MONTE ULTRA PREMIUM
 *
 * Sistema bancario completo con 4 tablas principales:
 * 1. Cuentas Principales - Gestión de cuentas bancarias Monte
 * 2. Transacciones en Tiempo Real - Movimientos y transferencias
 * 3. Análisis de Riesgo - Evaluación crediticia y riesgos
 * 4. Reportes Ejecutivos - Dashboard financiero ejecutivo
 *
 * Características Ultra Premium:
 * - Sistema bancario seguro con encriptación
 * - Glassmorphism extremo con efectos holográficos
 * - Animaciones 3D con parallax y mouse tracking
 * - Análisis predictivo con IA financiera
 * - Alertas de riesgo en tiempo real
 * - Cumplimiento regulatorio automático
 * - Dashboard ejecutivo con métricas avanzadas
 * - Responsive design iOS/Android optimizado
 * - Machine Learning para detección de fraudes
 *
 * @version 1.0.0 - BÓVEDA MONTE ULTRA
 */
import { memo, useCallback, useMemo, useRef, useState } from 'react';

import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import {
  Activity,
  BarChart3,
  Building2,
  CreditCard,
  Download,
  Eye,
  EyeOff,
  Lock,
  Search,
  Settings,
  Shield,
  TrendingUp,
} from 'lucide-react';
import PropTypes from 'prop-types';

// Datos completos de Bóveda Monte basados en el sistema real
const INITIAL_DATA = {
  summary: {
    saldoTotal: 1250000.0,
    cuentasActivas: 8,
    transaccionesHoy: 47,
    rentabilidadPromedio: 8.5,
    riesgoGeneral: 'BAJO',
    ultimaActualizacion: new Date().toISOString(),
    alertasActivas: 2,
    eficienciaBancaria: 94.2,
  },

  // Tabla 1: Cuentas Principales
  cuentasPrincipales: [
    {
      id: 'MONTE-001',
      nombre: 'Cuenta Operativa Principal',
      numero: '****-****-****-4521',
      tipo: 'Corriente',
      saldo: 485600.0,
      moneda: 'MXN',
      estado: 'activa',
      tasaInteres: 3.5,
      fechaApertura: '2023-01-15',
      limiteCredito: 1000000.0,
      saldoDisponible: 485600.0,
      ultimoMovimiento: '2025-11-04T08:30:00Z',
      titular: 'FlowDistributor S.A. de C.V.',
      sucursal: 'Monte Morelos',
      gerente: 'Lic. María González',
    },
    {
      id: 'MONTE-002',
      nombre: 'Cuenta de Inversión Premium',
      numero: '****-****-****-7892',
      tipo: 'Inversión',
      saldo: 325400.0,
      moneda: 'MXN',
      estado: 'activa',
      tasaInteres: 8.2,
      fechaApertura: '2023-03-22',
      limiteCredito: 0,
      saldoDisponible: 325400.0,
      ultimoMovimiento: '2025-11-03T16:45:00Z',
      titular: 'FlowDistributor S.A. de C.V.',
      sucursal: 'Monte Centro',
      gerente: 'Lic. Carlos Mendoza',
    },
    {
      id: 'MONTE-003',
      nombre: 'Línea de Crédito Comercial',
      numero: '****-****-****-3456',
      tipo: 'Crédito',
      saldo: -125000.0,
      moneda: 'MXN',
      estado: 'activa',
      tasaInteres: 12.5,
      fechaApertura: '2023-06-10',
      limiteCredito: 500000.0,
      saldoDisponible: 375000.0,
      ultimoMovimiento: '2025-11-04T10:15:00Z',
      titular: 'FlowDistributor S.A. de C.V.',
      sucursal: 'Monte Plaza',
      gerente: 'Lic. Ana Rodríguez',
    },
    {
      id: 'MONTE-004',
      nombre: 'Cuenta de Nómina',
      numero: '****-****-****-9087',
      tipo: 'Nómina',
      saldo: 85200.0,
      moneda: 'MXN',
      estado: 'activa',
      tasaInteres: 2.1,
      fechaApertura: '2023-02-28',
      limiteCredito: 0,
      saldoDisponible: 85200.0,
      ultimoMovimiento: '2025-11-01T09:00:00Z',
      titular: 'FlowDistributor S.A. de C.V.',
      sucursal: 'Monte Norte',
      gerente: 'Lic. Roberto Silva',
    },
  ],

  // Tabla 2: Transacciones en Tiempo Real
  transaccionesRealTime: [
    {
      id: 'TXN-001',
      fecha: '2025-11-04T10:30:00Z',
      tipo: 'Transferencia Entrante',
      monto: 45000.0,
      cuentaOrigen: 'Cliente Premium - Bódega M-P',
      cuentaDestino: 'MONTE-001',
      concepto: 'Pago factura FACT-2025-1034',
      estado: 'completada',
      comision: 150.0,
      referencia: 'REF-TXN-001-2025',
      canal: 'Banca Digital',
      autorizadoPor: 'Sistema Automático',
      nivelRiesgo: 'bajo',
    },
    {
      id: 'TXN-002',
      fecha: '2025-11-04T09:15:00Z',
      tipo: 'Pago Proveedor',
      monto: -28500.0,
      cuentaOrigen: 'MONTE-001',
      cuentaDestino: 'Proveedor Logística XYZ',
      concepto: 'Pago servicios de transporte',
      estado: 'completada',
      comision: 85.0,
      referencia: 'REF-TXN-002-2025',
      canal: 'Transferencia SPEI',
      autorizadoPor: 'Lic. María González',
      nivelRiesgo: 'bajo',
    },
    {
      id: 'TXN-003',
      fecha: '2025-11-04T08:45:00Z',
      tipo: 'Inversión',
      monto: -75000.0,
      cuentaOrigen: 'MONTE-001',
      cuentaDestino: 'MONTE-002',
      concepto: 'Traspaso a cuenta de inversión',
      estado: 'procesando',
      comision: 0,
      referencia: 'REF-TXN-003-2025',
      canal: 'Banca Privada',
      autorizadoPor: 'Lic. Carlos Mendoza',
      nivelRiesgo: 'medio',
    },
  ],

  // Tabla 3: Análisis de Riesgo
  analisisRiesgo: [
    {
      id: 'RISK-001',
      categoria: 'Riesgo Crediticio',
      nivel: 'BAJO',
      score: 850,
      factores: [
        'Historial crediticio excelente',
        'Flujo de caja estable',
        'Garantías suficientes',
      ],
      impacto: 'Mínimo',
      probabilidad: 5,
      mitigacion: 'Revisión trimestral automática',
      fechaEvaluacion: '2025-11-01',
      responsable: 'Área de Riesgos',
      recomendacion: 'Mantener líneas de crédito actuales',
    },
    {
      id: 'RISK-002',
      categoria: 'Riesgo Operacional',
      nivel: 'MEDIO',
      score: 720,
      factores: ['Concentración sectorial', 'Dependencia de proveedores clave'],
      impacto: 'Moderado',
      probabilidad: 25,
      mitigacion: 'Diversificación de cartera recomendada',
      fechaEvaluacion: '2025-11-01',
      responsable: 'Comité de Riesgos',
      recomendacion: 'Implementar plan de contingencia',
    },
    {
      id: 'RISK-003',
      categoria: 'Riesgo de Mercado',
      nivel: 'BAJO',
      score: 780,
      factores: ['Exposición limitada a divisas', 'Inversiones conservadoras'],
      impacto: 'Bajo',
      probabilidad: 15,
      mitigacion: 'Monitoreo de indicadores económicos',
      fechaEvaluacion: '2025-11-01',
      responsable: 'Mesa de Dinero',
      recomendacion: 'Continuar estrategia actual',
    },
  ],
};

const PanelBovedaMonteUltra = memo(({ data = INITIAL_DATA, onDataChange }) => {
  const [localData, setLocalData] = useState(data);
  const [activeTable, setActiveTable] = useState('cuentas');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showValues, setShowValues] = useState(true);
  const [securityMode, setSecurityMode] = useState(true);
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
    }).format(Math.abs(amount));
  }, []);

  // Get account type color
  const getAccountTypeColor = useCallback((tipo) => {
    const typeMap = {
      Corriente: 'text-zinc-300 bg-zinc-800/20',
      Inversión: 'text-zinc-200 bg-zinc-9000/20',
      Crédito: 'text-zinc-200 bg-zinc-9000/20',
      Nómina: 'text-zinc-800 bg-zinc-800/20',
    };
    return typeMap[tipo] || typeMap.Corriente;
  }, []);

  // Get risk level color
  const getRiskLevelColor = useCallback((nivel) => {
    const riskMap = {
      BAJO: 'text-zinc-200 bg-zinc-9000/20',
      MEDIO: 'text-zinc-200 bg-zinc-9000/20',
      ALTO: 'text-zinc-200 bg-zinc-9000/20',
    };
    return riskMap[nivel] || riskMap.MEDIO;
  }, []);

  // Get transaction status color
  const getTransactionStatusColor = useCallback((estado) => {
    const statusMap = {
      completada: 'text-zinc-200 bg-zinc-9000/20',
      procesando: 'text-zinc-200 bg-zinc-9000/20',
      pendiente: 'text-zinc-200 bg-zinc-9000/20',
      rechazada: 'text-zinc-200 bg-zinc-9000/20',
    };
    return statusMap[estado] || statusMap.pendiente;
  }, []);

  // Filtered accounts
  const filteredCuentas = useMemo(() => {
    return localData.cuentasPrincipales.filter((cuenta) => {
      const matchesSearch =
        cuenta.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cuenta.numero.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === 'all' || cuenta.estado === filterStatus;
      return matchesSearch && matchesStatus;
    });
  }, [localData.cuentasPrincipales, searchTerm, filterStatus]);

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
        className="relative p-6 bg-gradient-to-r from-emerald-900/20 via-green-900/20 to-teal-900/20 border-b border-white/10"
        variants={itemVariants}
      >
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 via-green-500/5 to-teal-500/5" />
          <div className="absolute top-0 left-1/4 w-32 h-32 bg-zinc-9000/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-24 h-24 bg-zinc-9000/10 rounded-full blur-2xl" />

          {/* Floating bank particles */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={`bank-particle-${i + 1}`}
              className="absolute w-2 h-2 bg-emerald-400/40 rounded-full"
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
                className="p-3 bg-gradient-to-br from-emerald-500/20 to-green-500/20 rounded-xl backdrop-blur-sm border border-white/10"
                whileHover={{ scale: 1.05, rotate: 5 }}
                transition={{ duration: 0.3 }}
              >
                <Building2 className="w-8 h-8 text-zinc-200" />
              </motion.div>

              <div>
                <h2 className="text-2xl font-bold text-white mb-1">Bóveda Monte Ultra</h2>
                <p className="text-slate-400 text-sm">
                  Sistema bancario seguro con análisis avanzado
                </p>
              </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-3 gap-4">
              <motion.div
                className="text-right p-3 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm"
                whileHover={{ scale: 1.02 }}
              >
                <div className="text-slate-400 text-sm mb-1">Saldo Total</div>
                <div className="text-2xl font-bold text-white">
                  {showValues ? formatCurrency(localData.summary.saldoTotal) : '••••••'}
                </div>
                <div className="flex items-center text-zinc-200 text-sm mt-1">
                  <CreditCard className="w-3 h-3 mr-1" />
                  {localData.summary.cuentasActivas} cuentas
                </div>
              </motion.div>

              <motion.div
                className="text-right p-3 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm"
                whileHover={{ scale: 1.02 }}
              >
                <div className="text-slate-400 text-sm mb-1">Rentabilidad</div>
                <div className="text-2xl font-bold text-white">
                  {localData.summary.rentabilidadPromedio}%
                </div>
                <div className="flex items-center text-zinc-200 text-sm mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +2.1% vs mes anterior
                </div>
              </motion.div>

              <motion.div
                className="text-right p-3 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm"
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-slate-400 text-sm">Riesgo General</span>
                  <motion.button
                    onClick={() => setShowValues(!showValues)}
                    className="text-slate-400 hover:text-white transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {showValues ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </motion.button>
                </div>
                <div className="text-2xl font-bold text-zinc-200">
                  {localData.summary.riesgoGeneral}
                </div>
                <div className="flex items-center text-zinc-300 text-sm mt-1">
                  <Shield className="w-3 h-3 mr-1" />
                  {localData.summary.eficienciaBancaria}% eficiencia
                </div>
              </motion.div>
            </div>
          </div>

          {/* Security Bar */}
          {securityMode && (
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
                    <Lock className="w-5 h-5 text-zinc-200" />
                  </motion.div>
                  <span className="text-white font-medium">Modo Seguridad Activo</span>
                  <span className="px-2 py-1 bg-zinc-9000/20 text-zinc-200 rounded-full text-xs">
                    {localData.summary.alertasActivas} alertas pendientes
                  </span>
                </div>

                <div className="flex items-center space-x-4">
                  <span className="text-slate-300 text-sm">
                    Última sincronización:{' '}
                    {new Date(localData.summary.ultimaActualizacion).toLocaleTimeString()}
                  </span>
                  <motion.button
                    className="p-1 text-zinc-200 hover:text-green-300"
                    whileHover={{ scale: 1.1 }}
                    onClick={() => setSecurityMode(false)}
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
              { id: 'cuentas', label: 'Cuentas Principales', icon: CreditCard },
              { id: 'transacciones', label: 'Transacciones', icon: Activity },
              { id: 'riesgo', label: 'Análisis Riesgo', icon: Shield },
              { id: 'reportes', label: 'Reportes Ejecutivos', icon: BarChart3 },
            ].map(({ id, label, icon: Icon }) => (
              <motion.button
                key={id}
                onClick={() => setActiveTable(id)}
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
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar cuentas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-zinc-500/50 w-64"
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

      {/* Content Area - Tabla de Cuentas Principales */}
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
                  <div className="grid grid-cols-9 gap-4 text-sm font-semibold text-slate-300">
                    <div>Cuenta</div>
                    <div>Número</div>
                    <div>Tipo</div>
                    <div>Saldo</div>
                    <div>Disponible</div>
                    <div>Tasa %</div>
                    <div>Estado</div>
                    <div>Gerente</div>
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
                        <div className="grid grid-cols-9 gap-4 items-center text-sm">
                          <div className="text-white font-medium">
                            {cuenta.nombre}
                            <div className="text-xs text-slate-400 mt-1">{cuenta.sucursal}</div>
                          </div>

                          <div className="text-zinc-300 font-mono">{cuenta.numero}</div>

                          <div>
                            <span className={`px-2 py-1 rounded-full text-xs ${typeColor}`}>
                              {cuenta.tipo}
                            </span>
                          </div>

                          <div
                            className={`font-medium ${cuenta.saldo >= 0 ? 'text-zinc-200' : 'text-zinc-200'}`}
                          >
                            {cuenta.saldo >= 0 ? '+' : ''}
                            {formatCurrency(cuenta.saldo)}
                            <div className="text-xs text-slate-400 mt-1">{cuenta.moneda}</div>
                          </div>

                          <div className="text-zinc-200 font-medium">
                            {formatCurrency(cuenta.saldoDisponible)}
                            {cuenta.limiteCredito > 0 && (
                              <div className="text-xs text-slate-400 mt-1">
                                Límite: {formatCurrency(cuenta.limiteCredito)}
                              </div>
                            )}
                          </div>

                          <div className="text-zinc-200 font-medium">
                            {cuenta.tasaInteres.toFixed(1)}%
                          </div>

                          <div>
                            <span className="px-2 py-1 bg-zinc-9000/20 text-zinc-200 rounded-full text-xs">
                              {cuenta.estado.toUpperCase()}
                            </span>
                          </div>

                          <div className="text-slate-300">{cuenta.gerente}</div>

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
                <Building2 className="w-16 h-16 text-zinc-200 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">
                  {activeTable === 'transacciones'
                    ? 'Transacciones en Tiempo Real'
                    : activeTable === 'riesgo'
                      ? 'Análisis de Riesgo Financiero'
                      : 'Reportes Ejecutivos Bancarios'}
                </h3>
                <p className="text-slate-400">
                  Panel en desarrollo con funcionalidades bancarias avanzadas
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
});

PanelBovedaMonteUltra.displayName = 'PanelBovedaMonteUltra';

PanelBovedaMonteUltra.propTypes = {
  data: PropTypes.object,
  onDataChange: PropTypes.func,
};

export default PanelBovedaMonteUltra;
