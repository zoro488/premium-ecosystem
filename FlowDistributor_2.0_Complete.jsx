import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  TrendingUp, DollarSign, Package, Users, Wallet, BarChart3,
  ArrowUpRight, ArrowDownRight, AlertCircle, CheckCircle,
  Activity, PieChart, Target, Zap, Shield, Globe,
  Database, RefreshCw, Download, Upload, Settings,
  ChevronRight, ChevronDown, Plus, Minus, Edit2, Trash2,
  Search, Filter, Calendar, Clock, Bell, Eye, EyeOff,
  Send, Copy, Share2, Printer, Save, X, Check,
  CreditCard, Building, Truck, ShoppingCart, UserCheck,
  FileText, Calculator, TrendingDown, Award, Star,
  AlertTriangle, Info, HelpCircle, Lock, Unlock,
  Layers, Grid, List, Map, Navigation, Compass
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  AreaChart, Area, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis, ComposedChart,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, Treemap, Sankey
} from 'recharts';

// ==================== CONFIGURACIÓN INICIAL ====================
const INITIAL_DATA = {
  // Configuración del sistema
  config: {
    empresa: "FLOW DISTRIBUTOR",
    version: "2.0",
    moneda: "MXN",
    tasaCambio: 20.5,
    actualizado: new Date().toISOString()
  },

  // BANCOS - Con todos los datos del Excel
  bancos: {
    bovedaMonte: {
      nombre: "Bóveda Monte",
      codigo: "MONTE",
      capitalActual: 0,
      capitalInicial: 5722280,
      ingresos: [],
      gastos: [],
      estado: "activo",
      color: "#10b981",
      icono: "🏦",
      limiteCredito: 10000000,
      tasaInteres: 0
    },
    bovedaUsa: {
      nombre: "Bóveda USA",
      codigo: "USA",
      capitalActual: 128005,
      capitalInicial: 1888275,
      ingresos: [],
      gastos: [],
      estado: "activo",
      color: "#3b82f6",
      icono: "🇺🇸",
      limiteCredito: 5000000,
      tasaInteres: 0,
      moneda: "USD"
    },
    utilidades: {
      nombre: "Utilidades",
      codigo: "UTIL",
      capitalActual: 102658,
      capitalInicial: 280758,
      ingresos: [],
      gastos: [],
      estado: "activo",
      color: "#8b5cf6",
      icono: "💰",
      limiteCredito: 1000000,
      tasaInteres: 0
    },
    fleteSur: {
      nombre: "Flete Sur",
      codigo: "FLETE",
      capitalActual: 185792,
      capitalInicial: 652512,
      ingresos: [],
      gastos: [],
      estado: "activo",
      color: "#f59e0b",
      icono: "🚚",
      limiteCredito: 2000000,
      tasaInteres: 0
    },
    azteca: {
      nombre: "Azteca",
      codigo: "AZTEC",
      capitalActual: -178715,
      capitalInicial: 1880970,
      ingresos: [],
      gastos: [],
      estado: "negativo",
      color: "#ef4444",
      icono: "🏛️",
      limiteCredito: 3000000,
      tasaInteres: 2.5
    },
    leftie: {
      nombre: "Leftie",
      codigo: "LEFT",
      capitalActual: 45844,
      capitalInicial: 1252100,
      ingresos: [],
      gastos: [],
      estado: "activo",
      color: "#06b6d4",
      icono: "💳",
      limiteCredito: 1500000,
      tasaInteres: 0
    },
    profit: {
      nombre: "Profit",
      codigo: "PROF",
      capitalActual: 12577748,
      capitalInicial: 12577748,
      ingresos: [],
      gastos: [],
      estado: "activo",
      color: "#22c55e",
      icono: "📈",
      limiteCredito: 20000000,
      tasaInteres: 0
    }
  },

  // ALMACÉN
  almacen: {
    stockActual: 17,
    stockMinimo: 50,
    stockMaximo: 3000,
    totalEntradas: 2296,
    totalSalidas: 2279,
    valorInventario: 107100,
    costoPromedio: 6300,
    movimientos: [],
    alertas: {
      stockBajo: true,
      reordenar: false,
      sobrestock: false
    },
    ubicaciones: {
      principal: { stock: 17, capacidad: 1000 },
      secundario: { stock: 0, capacidad: 500 },
      transito: { stock: 0, capacidad: 100 }
    }
  },

  // DISTRIBUIDORES - Todos los del Excel
  distribuidores: [
    {
      id: "DIST-001",
      nombre: "PACMAN",
      codigo: "PAC",
      totalComprado: 6142500,
      totalPagado: 0,
      adeudo: 6142500,
      estado: "activo",
      calificacion: 4.5,
      diasCredito: 30,
      contacto: {
        telefono: "",
        email: "",
        direccion: ""
      },
      historialPagos: []
    },
    {
      id: "DIST-002",
      nombre: "Q-MAYA",
      codigo: "QMA",
      totalComprado: 6098400,
      totalPagado: 0,
      adeudo: 6098400,
      estado: "activo",
      calificacion: 4.8,
      diasCredito: 45,
      contacto: {
        telefono: "",
        email: "",
        direccion: ""
      },
      historialPagos: []
    },
    {
      id: "DIST-003",
      nombre: "A/X🌶️🦀",
      codigo: "AXC",
      totalComprado: 207900,
      totalPagado: 0,
      adeudo: 207900,
      estado: "activo",
      calificacion: 3.8,
      diasCredito: 15,
      contacto: {
        telefono: "",
        email: "",
        direccion: ""
      },
      historialPagos: []
    },
    {
      id: "DIST-004",
      nombre: "CH-MONTE",
      codigo: "CHM",
      totalComprado: 630000,
      totalPagado: 0,
      adeudo: 630000,
      estado: "activo",
      calificacion: 4.2,
      diasCredito: 30,
      contacto: {
        telefono: "",
        email: "",
        direccion: ""
      },
      historialPagos: []
    },
    {
      id: "DIST-005",
      nombre: "VALLE-MONTE",
      codigo: "VAM",
      totalComprado: 140000,
      totalPagado: 0,
      adeudo: 140000,
      estado: "activo",
      calificacion: 4.0,
      diasCredito: 20,
      contacto: {
        telefono: "",
        email: "",
        direccion: ""
      },
      historialPagos: []
    },
    {
      id: "DIST-006",
      nombre: "Q-MAYA-MP",
      codigo: "QMP",
      totalComprado: 863100,
      totalPagado: 0,
      adeudo: 863100,
      estado: "activo",
      calificacion: 4.6,
      diasCredito: 35,
      contacto: {
        telefono: "",
        email: "",
        direccion: ""
      },
      historialPagos: []
    }
  ],

  // CLIENTES - Los principales del Excel
  clientes: [
    { id: "CLI-001", nombre: "Bódega M-P", adeudo: 945000, totalComprado: 945000, estado: "activo" },
    { id: "CLI-002", nombre: "Ax", adeudo: -317380, totalComprado: 365400, estado: "saldado" },
    { id: "CLI-003", nombre: "amigo playa azul", adeudo: 355000, totalComprado: 355000, estado: "activo" },
    { id: "CLI-004", nombre: "flama", adeudo: 335000, totalComprado: 335000, estado: "activo" },
    { id: "CLI-005", nombre: "Tio Tocayo", adeudo: 315000, totalComprado: 315000, estado: "activo" },
    { id: "CLI-006", nombre: "Tocayo", adeudo: 255200, totalComprado: 255200, estado: "activo" },
    { id: "CLI-007", nombre: "Robalo", adeudo: 234000, totalComprado: 660000, estado: "activo" },
    { id: "CLI-008", nombre: "tx8", adeudo: 151500, totalComprado: 151500, estado: "activo" },
    { id: "CLI-009", nombre: "mg", adeudo: 100100, totalComprado: 100100, estado: "activo" },
    { id: "CLI-010", nombre: "cabo", adeudo: 63000, totalComprado: 63000, estado: "activo" },
    { id: "CLI-011", nombre: "Valle", adeudo: 35000, totalComprado: 880500, estado: "activo" },
    { id: "CLI-012", nombre: "tavo", adeudo: 21000, totalComprado: 21000, estado: "activo" },
    { id: "CLI-013", nombre: "primo", adeudo: 20000, totalComprado: 20000, estado: "activo" },
    { id: "CLI-014", nombre: "Arabe", adeudo: 0, totalComprado: 170800, estado: "saldado" },
    { id: "CLI-015", nombre: "Negrito", adeudo: 0, totalComprado: 945000, estado: "saldado" }
  ],

  // VENTAS - Sincronizadas del Control_Maestro
  ventas: [],

  // ÓRDENES DE COMPRA - Del Excel
  ordenesCompra: [
    { id: "OC0001", fecha: "2025-08-25", distribuidor: "Q-MAYA", cantidad: 423, costoTotal: 2664900, estado: "completada" },
    { id: "OC0002", fecha: "2025-08-25", distribuidor: "Q-MAYA", cantidad: 32, costoTotal: 201600, estado: "completada" },
    { id: "OC0003", fecha: "2025-08-25", distribuidor: "A/X🌶️🦀", cantidad: 33, costoTotal: 207900, estado: "completada" },
    { id: "OC0004", fecha: "2025-08-30", distribuidor: "PACMAN", cantidad: 487, costoTotal: 3068100, estado: "completada" },
    { id: "OC0005", fecha: "2025-09-06", distribuidor: "Q-MAYA", cantidad: 513, costoTotal: 3231900, estado: "completada" },
    { id: "OC0006", fecha: "2025-09-10", distribuidor: "CH-MONTE", cantidad: 100, costoTotal: 630000, estado: "completada" },
    { id: "OC0007", fecha: "2025-09-15", distribuidor: "PACMAN", cantidad: 487, costoTotal: 3074400, estado: "completada" },
    { id: "OC0008", fecha: "2025-09-20", distribuidor: "VALLE-MONTE", cantidad: 20, costoTotal: 140000, estado: "completada" },
    { id: "OC0009", fecha: "2025-09-25", distribuidor: "Q-MAYA-MP", cantidad: 137, costoTotal: 863100, estado: "completada" }
  ],

  // MÉTRICAS CALCULADAS
  metricas: {
    capitalTotal: 12861332,
    ventasTotales: 0,
    comprasTotales: 14081900,
    utilidadNeta: 0,
    margenPromedio: 0,
    rotacionInventario: 0,
    diasInventario: 0,
    liquidezInmediata: 12861332,
    apalancamiento: 0,
    roi: 0
  }
};

// ==================== COMPONENTE PRINCIPAL ====================
const FlowDistributor = () => {
  // Estados principales
  const [data, setData] = useState(() => {
    const savedData = localStorage.getItem('flowDistributor_data_v2');
    return savedData ? JSON.parse(savedData) : INITIAL_DATA;
  });

  const [activePanel, setActivePanel] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    dateRange: 'month',
    status: 'all',
    banco: 'all',
    tipo: 'all'
  });
  const [theme, setTheme] = useState('dark');
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Guardar datos en localStorage
  useEffect(() => {
    localStorage.setItem('flowDistributor_data_v2', JSON.stringify(data));
  }, [data]);

  // Calcular métricas en tiempo real
  const calculateMetrics = useCallback(() => {
    const capitalTotal = Object.values(data.bancos).reduce((sum, banco) => 
      sum + banco.capitalActual, 0
    );
    
    const ventasTotales = data.ventas.reduce((sum, venta) => 
      sum + venta.totalVenta, 0
    );
    
    const comprasTotales = data.ordenesCompra.reduce((sum, oc) => 
      sum + oc.costoTotal, 0
    );

    const deudaDistribuidores = data.distribuidores.reduce((sum, dist) => 
      sum + dist.adeudo, 0
    );

    const carteraClientes = data.clientes.reduce((sum, cliente) => 
      sum + Math.max(0, cliente.adeudo), 0
    );

    setData(prev => ({
      ...prev,
      metricas: {
        ...prev.metricas,
        capitalTotal,
        ventasTotales,
        comprasTotales,
        deudaDistribuidores,
        carteraClientes,
        liquidezInmediata: capitalTotal,
        utilidadNeta: ventasTotales - comprasTotales
      }
    }));
  }, [data.bancos, data.ventas, data.ordenesCompra, data.distribuidores, data.clientes]);

  // Efectos
  useEffect(() => {
    calculateMetrics();
  }, [calculateMetrics]);

  // Funciones de utilidad
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatPercent = (value) => {
    return `${(value * 100).toFixed(1)}%`;
  };

  // Agregar notificación
  const addNotification = (title, message, type = 'info') => {
    const newNotification = {
      id: Date.now(),
      title,
      message,
      type,
      timestamp: new Date()
    };
    setNotifications(prev => [newNotification, ...prev]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== newNotification.id));
    }, 5000);
  };

  // ==================== PANEL DASHBOARD ====================
  const DashboardPanel = () => {
    const totalCapital = Object.values(data.bancos).reduce((sum, banco) => 
      sum + banco.capitalActual, 0
    );

    const bancosData = Object.entries(data.bancos).map(([key, banco]) => ({
      name: banco.nombre,
      value: Math.abs(banco.capitalActual),
      color: banco.color,
      percent: (Math.abs(banco.capitalActual) / Math.abs(totalCapital) * 100).toFixed(1)
    }));

    const tendenciaData = [
      { mes: 'Jul', capital: 10500000 },
      { mes: 'Ago', capital: 11200000 },
      { mes: 'Sep', capital: 12000000 },
      { mes: 'Oct', capital: 12861332 }
    ];

    return (
      <div className="space-y-6">
        {/* Header con métricas principales */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-green-500/10 to-green-600/10 backdrop-blur-lg rounded-2xl p-6 border border-green-500/20"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-500/20 rounded-xl">
                <DollarSign className="w-6 h-6 text-green-400" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-400" />
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-400">Capital Total</p>
              <p className="text-2xl font-bold text-white">
                {formatCurrency(totalCapital)}
              </p>
              <p className="text-xs text-green-400">+15.2% este mes</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 backdrop-blur-lg rounded-2xl p-6 border border-blue-500/20"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-500/20 rounded-xl">
                <Package className="w-6 h-6 text-blue-400" />
              </div>
              <AlertTriangle className="w-5 h-5 text-yellow-400" />
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-400">Stock Actual</p>
              <p className="text-2xl font-bold text-white">
                {data.almacen.stockActual} unidades
              </p>
              <p className="text-xs text-yellow-400">⚠️ Stock bajo</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 backdrop-blur-lg rounded-2xl p-6 border border-purple-500/20"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-500/20 rounded-xl">
                <Users className="w-6 h-6 text-purple-400" />
              </div>
              <ArrowUpRight className="w-5 h-5 text-purple-400" />
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-400">Cartera Clientes</p>
              <p className="text-2xl font-bold text-white">
                {formatCurrency(data.metricas.carteraClientes || 2753100)}
              </p>
              <p className="text-xs text-gray-400">31 clientes activos</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-red-500/10 to-red-600/10 backdrop-blur-lg rounded-2xl p-6 border border-red-500/20"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-red-500/20 rounded-xl">
                <Truck className="w-6 h-6 text-red-400" />
              </div>
              <AlertCircle className="w-5 h-5 text-red-400" />
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-400">Deuda Distribuidores</p>
              <p className="text-2xl font-bold text-white">
                {formatCurrency(14081900)}
              </p>
              <p className="text-xs text-red-400">6 distribuidores</p>
            </div>
          </motion.div>
        </div>

        {/* Gráficos principales */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Tendencia de Capital */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/50"
          >
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-400" />
              Tendencia de Capital
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={tendenciaData}>
                <defs>
                  <linearGradient id="colorCapital" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="mes" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" tickFormatter={(value) => `${(value/1000000).toFixed(1)}M`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1f2937', border: 'none' }}
                  labelStyle={{ color: '#9ca3af' }}
                  formatter={(value) => formatCurrency(value)}
                />
                <Area
                  type="monotone"
                  dataKey="capital"
                  stroke="#3b82f6"
                  fillOpacity={1}
                  fill="url(#colorCapital)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Distribución por Banco */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/50"
          >
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <PieChart className="w-5 h-5 text-purple-400" />
              Distribución por Banco
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={bancosData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${percent}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {bancosData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(value)} />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Estado de Bancos */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/50"
        >
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Building className="w-5 h-5 text-green-400" />
            Estado de Bancos
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Object.entries(data.bancos).map(([key, banco]) => (
              <motion.div
                key={key}
                whileHover={{ scale: 1.02 }}
                className={`relative bg-gradient-to-br ${
                  banco.capitalActual >= 0 
                    ? 'from-gray-700/50 to-gray-800/50' 
                    : 'from-red-900/20 to-red-800/20'
                } rounded-xl p-4 border ${
                  banco.capitalActual >= 0 
                    ? 'border-gray-700' 
                    : 'border-red-500/50'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{banco.icono}</span>
                    <div>
                      <p className="text-sm font-medium text-white">{banco.nombre}</p>
                      <p className="text-xs text-gray-400">{banco.codigo}</p>
                    </div>
                  </div>
                  {banco.capitalActual < 0 && (
                    <AlertCircle className="w-4 h-4 text-red-400" />
                  )}
                </div>
                <div className="space-y-2">
                  <div>
                    <p className="text-xs text-gray-400">Saldo Actual</p>
                    <p className={`text-lg font-bold ${
                      banco.capitalActual >= 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {formatCurrency(banco.capitalActual)}
                    </p>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400">Inicial:</span>
                    <span className="text-gray-300">{formatCurrency(banco.capitalInicial)}</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-1.5">
                    <div
                      className={`h-1.5 rounded-full ${
                        banco.capitalActual >= 0 ? 'bg-green-500' : 'bg-red-500'
                      }`}
                      style={{
                        width: `${Math.min(100, Math.abs(banco.capitalActual / banco.limiteCredito * 100))}%`
                      }}
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Alertas y Notificaciones */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/50"
        >
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Bell className="w-5 h-5 text-yellow-400" />
            Alertas del Sistema
          </h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/30">
              <AlertTriangle className="w-5 h-5 text-yellow-400" />
              <div className="flex-1">
                <p className="text-sm font-medium text-white">Stock Bajo en Almacén</p>
                <p className="text-xs text-gray-400">Solo quedan 17 unidades, considere reordenar</p>
              </div>
              <button className="text-xs text-yellow-400 hover:text-yellow-300">Ver más</button>
            </div>
            <div className="flex items-center gap-3 p-3 bg-red-500/10 rounded-lg border border-red-500/30">
              <AlertCircle className="w-5 h-5 text-red-400" />
              <div className="flex-1">
                <p className="text-sm font-medium text-white">Banco Azteca en Negativo</p>
                <p className="text-xs text-gray-400">Saldo: {formatCurrency(-178715)}</p>
              </div>
              <button className="text-xs text-red-400 hover:text-red-300">Resolver</button>
            </div>
            <div className="flex items-center gap-3 p-3 bg-blue-500/10 rounded-lg border border-blue-500/30">
              <Info className="w-5 h-5 text-blue-400" />
              <div className="flex-1">
                <p className="text-sm font-medium text-white">6 Distribuidores con Deuda</p>
                <p className="text-xs text-gray-400">Total pendiente: {formatCurrency(14081900)}</p>
              </div>
              <button className="text-xs text-blue-400 hover:text-blue-300">Gestionar</button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  };

  // ==================== PANEL BANCOS ====================
  const BancosPanel = ({ bancoId }) => {
    const banco = data.bancos[bancoId];
    const [showAddTransaction, setShowAddTransaction] = useState(false);
    const [transactionType, setTransactionType] = useState('ingreso');
    const [transactionData, setTransactionData] = useState({
      monto: '',
      concepto: '',
      cliente: '',
      fecha: new Date().toISOString().split('T')[0]
    });

    const handleAddTransaction = () => {
      const monto = parseFloat(transactionData.monto);
      if (isNaN(monto) || monto <= 0) {
        addNotification('Error', 'El monto debe ser mayor a 0', 'error');
        return;
      }

      const newTransaction = {
        id: Date.now(),
        tipo: transactionType,
        monto,
        concepto: transactionData.concepto || 'Sin concepto',
        cliente: transactionData.cliente || 'N/A',
        fecha: transactionData.fecha,
        timestamp: new Date().toISOString()
      };

      setData(prev => {
        const updatedBanco = { ...prev.bancos[bancoId] };
        
        if (transactionType === 'ingreso') {
          updatedBanco.ingresos = [...(updatedBanco.ingresos || []), newTransaction];
          updatedBanco.capitalActual += monto;
        } else {
          updatedBanco.gastos = [...(updatedBanco.gastos || []), newTransaction];
          updatedBanco.capitalActual -= monto;
        }

        return {
          ...prev,
          bancos: {
            ...prev.bancos,
            [bancoId]: updatedBanco
          }
        };
      });

      addNotification(
        'Transacción Exitosa',
        `${transactionType === 'ingreso' ? 'Ingreso' : 'Gasto'} de ${formatCurrency(monto)} registrado`,
        'success'
      );

      setShowAddTransaction(false);
      setTransactionData({ monto: '', concepto: '', cliente: '', fecha: new Date().toISOString().split('T')[0] });
    };

    // Calcular estadísticas
    const totalIngresos = (banco.ingresos || []).reduce((sum, ing) => sum + ing.monto, 0);
    const totalGastos = (banco.gastos || []).reduce((sum, gasto) => sum + gasto.monto, 0);
    const flujoNeto = totalIngresos - totalGastos;
    const rendimiento = banco.capitalInicial > 0 
      ? ((banco.capitalActual - banco.capitalInicial) / banco.capitalInicial * 100)
      : 0;

    // Datos para gráficos
    const flujoData = [
      { name: 'Ingresos', value: totalIngresos, color: '#10b981' },
      { name: 'Gastos', value: totalGastos, color: '#ef4444' }
    ];

    const ultimasTransacciones = [
      ...(banco.ingresos || []).map(i => ({ ...i, tipo: 'ingreso' })),
      ...(banco.gastos || []).map(g => ({ ...g, tipo: 'gasto' }))
    ].sort((a, b) => new Date(b.fecha) - new Date(a.fecha)).slice(0, 10);

    return (
      <div className="space-y-6">
        {/* Header del Banco */}
        <div className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/50">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="text-4xl">{banco.icono}</div>
              <div>
                <h2 className="text-2xl font-bold text-white">{banco.nombre}</h2>
                <p className="text-sm text-gray-400">Código: {banco.codigo}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowAddTransaction(true)}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg flex items-center gap-2 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Nueva Transacción
              </button>
              <button className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg flex items-center gap-2 transition-colors">
                <Download className="w-4 h-4" />
                Exportar
              </button>
            </div>
          </div>

          {/* Métricas principales */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-gray-700/30 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Wallet className="w-5 h-5 text-blue-400" />
                <p className="text-sm text-gray-400">Saldo Actual</p>
              </div>
              <p className={`text-2xl font-bold ${banco.capitalActual >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {formatCurrency(banco.capitalActual)}
              </p>
              <p className="text-xs text-gray-500 mt-1">Disponible ahora</p>
            </div>

            <div className="bg-gray-700/30 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="w-5 h-5 text-purple-400" />
                <p className="text-sm text-gray-400">Flujo Neto</p>
              </div>
              <p className={`text-2xl font-bold ${flujoNeto >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {formatCurrency(flujoNeto)}
              </p>
              <p className="text-xs text-gray-500 mt-1">Ingresos - Gastos</p>
            </div>

            <div className="bg-gray-700/30 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-5 h-5 text-yellow-400" />
                <p className="text-sm text-gray-400">Rendimiento</p>
              </div>
              <p className={`text-2xl font-bold ${rendimiento >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {rendimiento.toFixed(1)}%
              </p>
              <p className="text-xs text-gray-500 mt-1">% Capital vs histórico</p>
            </div>

            <div className="bg-gray-700/30 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <BarChart3 className="w-5 h-5 text-green-400" />
                <p className="text-sm text-gray-400">Histórico Total</p>
              </div>
              <p className="text-2xl font-bold text-yellow-400">
                {formatCurrency(totalIngresos + totalGastos)}
              </p>
              <p className="text-xs text-gray-500 mt-1">Ganancias acumuladas</p>
            </div>
          </div>
        </div>

        {/* Gráficos y Análisis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Distribución de Flujo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/50"
          >
            <h3 className="text-lg font-semibold text-white mb-4">Distribución de Flujo</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={flujoData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" tickFormatter={(value) => `${(value/1000).toFixed(0)}k`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1f2937', border: 'none' }}
                  formatter={(value) => formatCurrency(value)}
                />
                <Bar dataKey="value" fill="#8884d8">
                  {flujoData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Estadísticas */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/50"
          >
            <h3 className="text-lg font-semibold text-white mb-4">Estadísticas</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">Total Ingresos</span>
                <span className="text-sm font-medium text-green-400">{formatCurrency(totalIngresos)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">Total Gastos</span>
                <span className="text-sm font-medium text-red-400">{formatCurrency(totalGastos)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">Transacciones</span>
                <span className="text-sm font-medium text-white">
                  {(banco.ingresos?.length || 0) + (banco.gastos?.length || 0)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">Límite Crédito</span>
                <span className="text-sm font-medium text-white">{formatCurrency(banco.limiteCredito)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">Estado</span>
                <span className={`text-sm font-medium px-2 py-1 rounded ${
                  banco.estado === 'activo' 
                    ? 'bg-green-500/20 text-green-400' 
                    : 'bg-red-500/20 text-red-400'
                }`}>
                  {banco.estado === 'activo' ? '✅ Activo' : '⚠️ Negativo'}
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Últimas Transacciones */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/50"
        >
          <h3 className="text-lg font-semibold text-white mb-4">Últimas Transacciones</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Fecha</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Tipo</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Cliente/Origen</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Concepto</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-400">Monto</th>
                </tr>
              </thead>
              <tbody>
                {ultimasTransacciones.length > 0 ? (
                  ultimasTransacciones.map((trans, index) => (
                    <tr key={trans.id || index} className="border-b border-gray-700/50 hover:bg-gray-700/30">
                      <td className="py-3 px-4 text-sm text-gray-300">{formatDate(trans.fecha)}</td>
                      <td className="py-3 px-4">
                        <span className={`text-xs px-2 py-1 rounded ${
                          trans.tipo === 'ingreso' 
                            ? 'bg-green-500/20 text-green-400' 
                            : 'bg-red-500/20 text-red-400'
                        }`}>
                          {trans.tipo === 'ingreso' ? '↓ Ingreso' : '↑ Gasto'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-300">{trans.cliente || trans.origen || 'N/A'}</td>
                      <td className="py-3 px-4 text-sm text-gray-300">{trans.concepto}</td>
                      <td className={`py-3 px-4 text-sm text-right font-medium ${
                        trans.tipo === 'ingreso' ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {trans.tipo === 'ingreso' ? '+' : '-'}{formatCurrency(trans.monto)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="py-8 text-center text-gray-500">
                      No hay transacciones registradas
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Modal Nueva Transacción */}
        <AnimatePresence>
          {showAddTransaction && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
              onClick={() => setShowAddTransaction(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-gray-800 rounded-2xl p-6 max-w-md w-full mx-4"
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-xl font-semibold text-white mb-4">Nueva Transacción</h3>
                
                {/* Tipo de transacción */}
                <div className="flex gap-2 mb-4">
                  <button
                    onClick={() => setTransactionType('ingreso')}
                    className={`flex-1 py-2 px-4 rounded-lg transition-colors ${
                      transactionType === 'ingreso' 
                        ? 'bg-green-500 text-white' 
                        : 'bg-gray-700 text-gray-300'
                    }`}
                  >
                    Ingreso
                  </button>
                  <button
                    onClick={() => setTransactionType('gasto')}
                    className={`flex-1 py-2 px-4 rounded-lg transition-colors ${
                      transactionType === 'gasto' 
                        ? 'bg-red-500 text-white' 
                        : 'bg-gray-700 text-gray-300'
                    }`}
                  >
                    Gasto
                  </button>
                </div>

                {/* Formulario */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Monto</label>
                    <input
                      type="number"
                      value={transactionData.monto}
                      onChange={(e) => setTransactionData(prev => ({ ...prev, monto: e.target.value }))}
                      className="w-full px-3 py-2 bg-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="0.00"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      {transactionType === 'ingreso' ? 'Cliente' : 'Origen'}
                    </label>
                    <input
                      type="text"
                      value={transactionData.cliente}
                      onChange={(e) => setTransactionData(prev => ({ ...prev, cliente: e.target.value }))}
                      className="w-full px-3 py-2 bg-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder={transactionType === 'ingreso' ? 'Nombre del cliente' : 'Origen del gasto'}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Concepto</label>
                    <input
                      type="text"
                      value={transactionData.concepto}
                      onChange={(e) => setTransactionData(prev => ({ ...prev, concepto: e.target.value }))}
                      className="w-full px-3 py-2 bg-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="Descripción de la transacción"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Fecha</label>
                    <input
                      type="date"
                      value={transactionData.fecha}
                      onChange={(e) => setTransactionData(prev => ({ ...prev, fecha: e.target.value }))}
                      className="w-full px-3 py-2 bg-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                </div>

                {/* Botones */}
                <div className="flex gap-2 mt-6">
                  <button
                    onClick={() => setShowAddTransaction(false)}
                    className="flex-1 py-2 px-4 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleAddTransaction}
                    className="flex-1 py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                  >
                    Guardar
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  // ==================== PANEL INVENTARIO ====================
  const InventarioPanel = () => {
    const [showAddMovement, setShowAddMovement] = useState(false);
    const [movementType, setMovementType] = useState('entrada');
    const [movementData, setMovementData] = useState({
      cantidad: '',
      origen: '',
      oc: '',
      fecha: new Date().toISOString().split('T')[0]
    });

    const handleAddMovement = () => {
      const cantidad = parseInt(movementData.cantidad);
      if (isNaN(cantidad) || cantidad <= 0) {
        addNotification('Error', 'La cantidad debe ser mayor a 0', 'error');
        return;
      }

      const newMovement = {
        id: Date.now(),
        tipo: movementType,
        cantidad,
        origen: movementData.origen || 'N/A',
        oc: movementData.oc || 'N/A',
        fecha: movementData.fecha,
        timestamp: new Date().toISOString()
      };

      setData(prev => {
        const updatedAlmacen = { ...prev.almacen };
        
        if (movementType === 'entrada') {
          updatedAlmacen.stockActual += cantidad;
          updatedAlmacen.totalEntradas += cantidad;
        } else {
          if (cantidad > updatedAlmacen.stockActual) {
            addNotification('Error', 'No hay suficiente stock', 'error');
            return prev;
          }
          updatedAlmacen.stockActual -= cantidad;
          updatedAlmacen.totalSalidas += cantidad;
        }

        updatedAlmacen.movimientos = [...(updatedAlmacen.movimientos || []), newMovement];

        return {
          ...prev,
          almacen: updatedAlmacen
        };
      });

      addNotification(
        'Movimiento Registrado',
        `${movementType === 'entrada' ? 'Entrada' : 'Salida'} de ${cantidad} unidades`,
        'success'
      );

      setShowAddMovement(false);
      setMovementData({ cantidad: '', origen: '', oc: '', fecha: new Date().toISOString().split('T')[0] });
    };

    const stockPercentage = (data.almacen.stockActual / data.almacen.stockMaximo) * 100;
    const rotacionInventario = data.almacen.totalSalidas / ((data.almacen.stockActual + data.almacen.totalEntradas) / 2);
    
    return (
      <div className="space-y-6">
        {/* Header del Inventario */}
        <div className="bg-gradient-to-r from-blue-900/50 to-blue-800/50 backdrop-blur-lg rounded-2xl p-6 border border-blue-700/50">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Package className="w-8 h-8 text-blue-400" />
              <div>
                <h2 className="text-2xl font-bold text-white">Almacén Monte</h2>
                <p className="text-sm text-gray-400">Control de Inventario</p>
              </div>
            </div>
            <button
              onClick={() => setShowAddMovement(true)}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg flex items-center gap-2 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Registrar Movimiento
            </button>
          </div>

          {/* Indicador de Stock */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-400">Nivel de Stock</span>
              <span className="text-sm font-medium text-white">{data.almacen.stockActual} / {data.almacen.stockMaximo} unidades</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-4 overflow-hidden">
              <div
                className={`h-4 rounded-full transition-all duration-500 ${
                  stockPercentage < 10 ? 'bg-red-500' :
                  stockPercentage < 30 ? 'bg-yellow-500' :
                  stockPercentage < 80 ? 'bg-green-500' :
                  'bg-blue-500'
                }`}
                style={{ width: `${stockPercentage}%` }}
              />
            </div>
            {data.almacen.stockActual < data.almacen.stockMinimo && (
              <p className="text-xs text-yellow-400 mt-2 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                Stock por debajo del mínimo ({data.almacen.stockMinimo} unidades)
              </p>
            )}
          </div>

          {/* Métricas del Inventario */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-700/30 rounded-xl p-4">
              <p className="text-xs text-gray-400 mb-1">Stock Actual</p>
              <p className={`text-xl font-bold ${data.almacen.stockActual < data.almacen.stockMinimo ? 'text-yellow-400' : 'text-white'}`}>
                {data.almacen.stockActual} unidades
              </p>
            </div>
            <div className="bg-gray-700/30 rounded-xl p-4">
              <p className="text-xs text-gray-400 mb-1">Total Entradas</p>
              <p className="text-xl font-bold text-green-400">{data.almacen.totalEntradas}</p>
            </div>
            <div className="bg-gray-700/30 rounded-xl p-4">
              <p className="text-xs text-gray-400 mb-1">Total Salidas</p>
              <p className="text-xl font-bold text-red-400">{data.almacen.totalSalidas}</p>
            </div>
            <div className="bg-gray-700/30 rounded-xl p-4">
              <p className="text-xs text-gray-400 mb-1">Valor Inventario</p>
              <p className="text-xl font-bold text-blue-400">{formatCurrency(data.almacen.valorInventario)}</p>
            </div>
          </div>
        </div>

        {/* Ubicaciones */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(data.almacen.ubicaciones).map(([key, ubicacion]) => (
            <motion.div
              key={key}
              whileHover={{ scale: 1.02 }}
              className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-4 border border-gray-700/50"
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-medium text-white capitalize">{key}</h4>
                <Map className="w-4 h-4 text-gray-400" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">Stock:</span>
                  <span className="text-white">{ubicacion.stock} unidades</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">Capacidad:</span>
                  <span className="text-white">{ubicacion.capacidad} unidades</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-1">
                  <div
                    className="h-1 rounded-full bg-blue-500"
                    style={{ width: `${(ubicacion.stock / ubicacion.capacidad) * 100}%` }}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Últimos Movimientos */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/50"
        >
          <h3 className="text-lg font-semibold text-white mb-4">Últimos Movimientos</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Fecha</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Tipo</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Cantidad</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Origen/Destino</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">OC</th>
                </tr>
              </thead>
              <tbody>
                {(data.almacen.movimientos || []).slice(-10).reverse().map((mov, index) => (
                  <tr key={mov.id || index} className="border-b border-gray-700/50 hover:bg-gray-700/30">
                    <td className="py-3 px-4 text-sm text-gray-300">{formatDate(mov.fecha)}</td>
                    <td className="py-3 px-4">
                      <span className={`text-xs px-2 py-1 rounded ${
                        mov.tipo === 'entrada' 
                          ? 'bg-green-500/20 text-green-400' 
                          : 'bg-red-500/20 text-red-400'
                      }`}>
                        {mov.tipo === 'entrada' ? '↓ Entrada' : '↑ Salida'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-white font-medium">{mov.cantidad}</td>
                    <td className="py-3 px-4 text-sm text-gray-300">{mov.origen || mov.destino || 'N/A'}</td>
                    <td className="py-3 px-4 text-sm text-gray-300">{mov.oc || 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Modal Nuevo Movimiento */}
        <AnimatePresence>
          {showAddMovement && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
              onClick={() => setShowAddMovement(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-gray-800 rounded-2xl p-6 max-w-md w-full mx-4"
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-xl font-semibold text-white mb-4">Registrar Movimiento</h3>
                
                {/* Tipo de movimiento */}
                <div className="flex gap-2 mb-4">
                  <button
                    onClick={() => setMovementType('entrada')}
                    className={`flex-1 py-2 px-4 rounded-lg transition-colors ${
                      movementType === 'entrada' 
                        ? 'bg-green-500 text-white' 
                        : 'bg-gray-700 text-gray-300'
                    }`}
                  >
                    Entrada
                  </button>
                  <button
                    onClick={() => setMovementType('salida')}
                    className={`flex-1 py-2 px-4 rounded-lg transition-colors ${
                      movementType === 'salida' 
                        ? 'bg-red-500 text-white' 
                        : 'bg-gray-700 text-gray-300'
                    }`}
                  >
                    Salida
                  </button>
                </div>

                {/* Formulario */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Cantidad</label>
                    <input
                      type="number"
                      value={movementData.cantidad}
                      onChange={(e) => setMovementData(prev => ({ ...prev, cantidad: e.target.value }))}
                      className="w-full px-3 py-2 bg-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="0"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      {movementType === 'entrada' ? 'Origen' : 'Destino'}
                    </label>
                    <input
                      type="text"
                      value={movementData.origen}
                      onChange={(e) => setMovementData(prev => ({ ...prev, origen: e.target.value }))}
                      className="w-full px-3 py-2 bg-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder={movementType === 'entrada' ? 'Distribuidor o proveedor' : 'Cliente o destino'}
                    />
                  </div>
                  
                  {movementType === 'entrada' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">Orden de Compra</label>
                      <input
                        type="text"
                        value={movementData.oc}
                        onChange={(e) => setMovementData(prev => ({ ...prev, oc: e.target.value }))}
                        className="w-full px-3 py-2 bg-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="OC0001"
                      />
                    </div>
                  )}
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Fecha</label>
                    <input
                      type="date"
                      value={movementData.fecha}
                      onChange={(e) => setMovementData(prev => ({ ...prev, fecha: e.target.value }))}
                      className="w-full px-3 py-2 bg-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                </div>

                {/* Botones */}
                <div className="flex gap-2 mt-6">
                  <button
                    onClick={() => setShowAddMovement(false)}
                    className="flex-1 py-2 px-4 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleAddMovement}
                    className="flex-1 py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                  >
                    Guardar
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  // ==================== SIDEBAR ====================
  const Sidebar = () => {
    const menuItems = [
      { id: 'dashboard', label: 'Dashboard', icon: Grid, badge: null },
      { id: 'ordenesCompra', label: 'Órdenes de Compra', icon: ShoppingCart, badge: data.ordenesCompra.length },
      { id: 'distribuidores', label: 'Distribuidores', icon: Truck, badge: data.distribuidores.length },
      { id: 'almacen', label: 'Almacén', icon: Package, badge: data.almacen.stockActual },
      { id: 'ventas', label: 'Ventas', icon: TrendingUp, badge: 96 },
      { id: 'clientes', label: 'Clientes', icon: Users, badge: data.clientes.length },
      { id: 'gastosAbonos', label: 'Gastos y Abonos', icon: Calculator, badge: null }
    ];

    const bancoItems = Object.entries(data.bancos).map(([key, banco]) => ({
      id: key,
      label: banco.nombre,
      icon: CreditCard,
      amount: formatCurrency(banco.capitalActual),
      color: banco.color,
      isNegative: banco.capitalActual < 0
    }));

    return (
      <div className="w-72 h-screen bg-gray-900/95 backdrop-blur-xl border-r border-gray-800 overflow-y-auto">
        {/* Logo */}
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">FlowDistributor</h1>
              <p className="text-xs text-gray-400">v2.0 Excel Edition</p>
            </div>
          </div>
        </div>

        {/* Menú Principal */}
        <div className="p-4">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">Menú Principal</p>
          <div className="space-y-1">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActivePanel(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
                  activePanel === item.id
                    ? 'bg-blue-500/20 text-blue-400'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <item.icon className="w-5 h-5" />
                  <span className="text-sm font-medium">{item.label}</span>
                </div>
                {item.badge !== null && (
                  <span className="text-xs bg-gray-700 px-2 py-1 rounded">
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Bancos */}
        <div className="p-4 border-t border-gray-800">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">Bancos</p>
          <div className="space-y-1">
            {bancoItems.map((banco) => (
              <button
                key={banco.id}
                onClick={() => setActivePanel(`banco-${banco.id}`)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
                  activePanel === `banco-${banco.id}`
                    ? 'bg-blue-500/20 text-blue-400'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div 
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: banco.color }}
                  />
                  <span className="text-sm font-medium">{banco.label}</span>
                </div>
                <span className={`text-xs font-medium ${
                  banco.isNegative ? 'text-red-400' : 'text-gray-400'
                }`}>
                  {banco.amount}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-500">Capital Total</span>
            <span className="text-sm font-bold text-white">
              {formatCurrency(data.metricas.capitalTotal)}
            </span>
          </div>
          <div className="flex gap-2">
            <button className="flex-1 p-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-gray-400 transition-colors">
              <Settings className="w-4 h-4 mx-auto" />
            </button>
            <button className="flex-1 p-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-gray-400 transition-colors">
              <HelpCircle className="w-4 h-4 mx-auto" />
            </button>
            <button className="flex-1 p-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-gray-400 transition-colors">
              <Download className="w-4 h-4 mx-auto" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  // ==================== RENDER PRINCIPAL ====================
  return (
    <div className="flex h-screen bg-gray-950">
      <Sidebar />
      
      {/* Área de contenido principal */}
      <div className="flex-1 overflow-y-auto">
        {/* Header */}
        <div className="bg-gray-900/50 backdrop-blur-xl border-b border-gray-800 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h2 className="text-xl font-semibold text-white">
                {activePanel === 'dashboard' && 'Dashboard General'}
                {activePanel === 'almacen' && 'Control de Inventario'}
                {activePanel.startsWith('banco-') && data.bancos[activePanel.replace('banco-', '')]?.nombre}
                {activePanel === 'distribuidores' && 'Gestión de Distribuidores'}
                {activePanel === 'clientes' && 'Gestión de Clientes'}
                {activePanel === 'ventas' && 'Control de Ventas'}
                {activePanel === 'ordenesCompra' && 'Órdenes de Compra'}
                {activePanel === 'gastosAbonos' && 'Gastos y Abonos'}
              </h2>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Buscar..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-gray-800 rounded-lg text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none w-64"
                />
              </div>
              <button className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-gray-400 transition-colors relative">
                <Bell className="w-5 h-5" />
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full" />
                )}
              </button>
              <button className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-gray-400 transition-colors">
                <RefreshCw className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Contenido */}
        <div className="p-6">
          {activePanel === 'dashboard' && <DashboardPanel />}
          {activePanel === 'almacen' && <InventarioPanel />}
          {activePanel.startsWith('banco-') && (
            <BancosPanel bancoId={activePanel.replace('banco-', '')} />
          )}
          {activePanel === 'distribuidores' && (
            <div className="text-white">Panel de Distribuidores - En construcción</div>
          )}
          {activePanel === 'clientes' && (
            <div className="text-white">Panel de Clientes - En construcción</div>
          )}
          {activePanel === 'ventas' && (
            <div className="text-white">Panel de Ventas - En construcción</div>
          )}
          {activePanel === 'ordenesCompra' && (
            <div className="text-white">Panel de Órdenes de Compra - En construcción</div>
          )}
          {activePanel === 'gastosAbonos' && (
            <div className="text-white">Panel de Gastos y Abonos - En construcción</div>
          )}
        </div>
      </div>

      {/* Notificaciones */}
      <AnimatePresence>
        {notifications.length > 0 && (
          <div className="fixed top-4 right-4 z-50 space-y-2">
            {notifications.map((notif) => (
              <motion.div
                key={notif.id}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                className={`p-4 rounded-lg shadow-lg backdrop-blur-lg flex items-start gap-3 min-w-[300px] ${
                  notif.type === 'success' ? 'bg-green-500/20 border border-green-500/50' :
                  notif.type === 'error' ? 'bg-red-500/20 border border-red-500/50' :
                  notif.type === 'warning' ? 'bg-yellow-500/20 border border-yellow-500/50' :
                  'bg-blue-500/20 border border-blue-500/50'
                }`}
              >
                {notif.type === 'success' && <CheckCircle className="w-5 h-5 text-green-400" />}
                {notif.type === 'error' && <X className="w-5 h-5 text-red-400" />}
                {notif.type === 'warning' && <AlertTriangle className="w-5 h-5 text-yellow-400" />}
                {notif.type === 'info' && <Info className="w-5 h-5 text-blue-400" />}
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">{notif.title}</p>
                  <p className="text-xs text-gray-300 mt-1">{notif.message}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FlowDistributor;