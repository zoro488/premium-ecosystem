import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, RadarChart, Radar, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';
import {
  TrendingUp, TrendingDown, DollarSign, Package, Users, Truck, AlertTriangle,
  CheckCircle, XCircle, Activity, BarChart2, PieChart as PieIcon, Download,
  Upload, Settings, Bell, Search, Filter, Calendar, Clock, Zap, Shield,
  Globe, Cpu, Database, Cloud, Lock, Unlock, Eye, EyeOff, RefreshCw,
  ChevronRight, ChevronLeft, Home, CreditCard, Box, UserCheck, ShoppingCart,
  FileText, Award, Target, Layers, Grid, List, Map, Navigation, Briefcase,
  Send, Archive, Trash2, Edit3, Save, Copy, Share2, Printer, Mail,
  MessageSquare, HelpCircle, Info, AlertCircle, CheckSquare, Square,
  ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Maximize2, Minimize2,
  Plus, Minus, X, Menu, MoreVertical, MoreHorizontal, Loader,
  Wifi, WifiOff, Battery, BatteryCharging, Bluetooth, Cast, Camera,
  Mic, MicOff, Video, VideoOff, Phone, PhoneOff, Volume2, VolumeX
} from 'lucide-react';

// ==========================================
// 🎯 DATOS REALES MIGRADOS DEL EXCEL
// ==========================================
const INITIAL_DATA = {
  // 💰 BANCOS (7 COMPLETOS)
  bancos: {
    boveda_monte: {
      nombre: "Bóveda Monte",
      codigo: "BVM",
      capitalActual: 0,
      capitalInicial: 5716450,
      ingresos: [
        { id: 1, fecha: "2025-10-15", concepto: "Venta contado", valor: 125000, categoria: "ventas" },
        { id: 2, fecha: "2025-10-16", concepto: "Transferencia cliente", valor: 89500, categoria: "cobros" },
        { id: 3, fecha: "2025-10-17", concepto: "Pago distribuidor", valor: 234000, categoria: "distribuidores" },
      ],
      gastos: [
        { id: 1, fecha: "2025-10-15", concepto: "Compra inventario", valor: 450000, categoria: "inventario" },
        { id: 2, fecha: "2025-10-16", concepto: "Gastos operativos", valor: 78000, categoria: "operacion" },
      ],
      totalIngresos: 5716450,
      totalGastos: 5722280,
      balance: -5830,
      estado: "alerta",
      color: "#FF6B6B",
      icono: "🏦",
      tendencia: -2.3,
      limiteCredito: 1000000,
      tasaInteres: 0.12,
      ultimaActualizacion: new Date().toISOString()
    },
    boveda_usa: {
      nombre: "Bóveda USA",
      codigo: "BVU", 
      capitalActual: 128005,
      capitalInicial: 0,
      ingresos: [
        { id: 1, fecha: "2025-10-14", concepto: "Wire transfer", valor: 450000, categoria: "internacional" },
        { id: 2, fecha: "2025-10-15", concepto: "Payment received", valor: 238000, categoria: "cobros" },
      ],
      gastos: [
        { id: 1, fecha: "2025-10-14", concepto: "International shipping", valor: 125000, categoria: "logistica" },
        { id: 2, fecha: "2025-10-15", concepto: "Customs fees", valor: 34500, categoria: "impuestos" },
      ],
      totalIngresos: 1888275,
      totalGastos: 1760270,
      balance: 128005,
      estado: "activo",
      color: "#4ECDC4",
      icono: "💵",
      tendencia: 8.5,
      limiteCredito: 500000,
      tasaInteres: 0.08,
      ultimaActualizacion: new Date().toISOString()
    },
    utilidades: {
      nombre: "Utilidades",
      codigo: "UTL",
      capitalActual: 102658,
      capitalInicial: 0,
      ingresos: [
        { id: 1, fecha: "2025-10-13", concepto: "Ganancia neta ventas", valor: 156000, categoria: "utilidad" },
        { id: 2, fecha: "2025-10-14", concepto: "Rendimientos", valor: 23450, categoria: "inversiones" },
      ],
      gastos: [
        { id: 1, fecha: "2025-10-13", concepto: "Impuestos", valor: 45000, categoria: "fiscal" },
        { id: 2, fecha: "2025-10-14", concepto: "Distribución utilidades", valor: 25000, categoria: "dividendos" },
      ],
      totalIngresos: 383686,
      totalGastos: 178100,
      balance: 205586,
      estado: "activo",
      color: "#95E77E",
      icono: "📈",
      tendencia: 12.3,
      limiteCredito: 0,
      tasaInteres: 0,
      ultimaActualizacion: new Date().toISOString()
    },
    flete_sur: {
      nombre: "Flete Sur",
      codigo: "FLS",
      capitalActual: 185792,
      capitalInicial: 0,
      ingresos: [
        { id: 1, fecha: "2025-10-12", concepto: "Cobro flete local", valor: 67000, categoria: "fletes" },
        { id: 2, fecha: "2025-10-13", concepto: "Flete foráneo", valor: 125000, categoria: "fletes" },
      ],
      gastos: [
        { id: 1, fecha: "2025-10-12", concepto: "Combustible", valor: 34500, categoria: "operacion" },
        { id: 2, fecha: "2025-10-13", concepto: "Mantenimiento unidades", valor: 18900, categoria: "mantenimiento" },
      ],
      totalIngresos: 838274,
      totalGastos: 466720,
      balance: 371554,
      estado: "activo",
      color: "#FFD93D",
      icono: "🚚",
      tendencia: 5.7,
      limiteCredito: 300000,
      tasaInteres: 0.1,
      ultimaActualizacion: new Date().toISOString()
    },
    azteca: {
      nombre: "Azteca",
      codigo: "AZT",
      capitalActual: -178714.88,
      capitalInicial: 0,
      ingresos: [
        { id: 1, fecha: "2025-10-11", concepto: "Depósito efectivo", valor: 234000, categoria: "depositos" },
      ],
      gastos: [
        { id: 1, fecha: "2025-10-11", concepto: "Retiro urgente", valor: 456000, categoria: "retiros" },
        { id: 2, fecha: "2025-10-12", concepto: "Comisiones", valor: 12500, categoria: "comisiones" },
      ],
      totalIngresos: 1880970,
      totalGastos: 1844691.68,
      balance: 36278.32,
      estado: "critico",
      color: "#E74C3C",
      icono: "💳",
      tendencia: -15.8,
      limiteCredito: 200000,
      tasaInteres: 0.18,
      ultimaActualizacion: new Date().toISOString()
    },
    leftie: {
      nombre: "Leftie",
      codigo: "LFT",
      capitalActual: 45844,
      capitalInicial: 0,
      ingresos: [
        { id: 1, fecha: "2025-10-10", concepto: "Ventas menudeo", valor: 89000, categoria: "ventas" },
      ],
      gastos: [
        { id: 1, fecha: "2025-10-10", concepto: "Compras menudeo", valor: 56000, categoria: "compras" },
      ],
      totalIngresos: 1252100,
      totalGastos: 1206256,
      balance: 45844,
      estado: "activo",
      color: "#9B59B6",
      icono: "🏪",
      tendencia: 3.2,
      limiteCredito: 150000,
      tasaInteres: 0.15,
      ultimaActualizacion: new Date().toISOString()
    },
    profit: {
      nombre: "Profit",
      codigo: "PRF",
      capitalActual: 12577748,
      capitalInicial: 0,
      ingresos: [
        { id: 1, fecha: "2025-10-09", concepto: "Ganancia total acumulada", valor: 12577748, categoria: "profit" },
      ],
      gastos: [],
      totalIngresos: 12577748,
      totalGastos: 0,
      balance: 12577748,
      estado: "excelente",
      color: "#2ECC71",
      icono: "💎",
      tendencia: 28.9,
      limiteCredito: 0,
      tasaInteres: 0,
      ultimaActualizacion: new Date().toISOString()
    }
  },

  // 📦 INVENTARIO
  almacen: {
    stockActual: 17,
    stockMinimo: 50,
    stockMaximo: 5000,
    totalEntradas: 2296,
    totalSalidas: 2279,
    valorInventario: 107100, // 17 * 6300 precio promedio
    ubicaciones: {
      monte: { stock: 10, capacidad: 2000 },
      usa: { stock: 5, capacidad: 1500 },
      transito: { stock: 2, capacidad: 500 }
    },
    movimientos: [
      { id: 1, tipo: "entrada", cantidad: 500, distribuidor: "PACMAN", fecha: "2025-10-15", precio: 5800 },
      { id: 2, tipo: "salida", cantidad: 450, cliente: "Bódega M-P", fecha: "2025-10-16", precio: 6300 },
      { id: 3, tipo: "entrada", cantidad: 300, distribuidor: "Q-MAYA", fecha: "2025-10-17", precio: 5900 },
      { id: 4, tipo: "salida", cantidad: 333, cliente: "Tio Tocayo", fecha: "2025-10-18", precio: 6300 },
    ],
    alertas: [
      { tipo: "critico", mensaje: "Stock crítico: Solo 17 unidades disponibles", fecha: new Date() }
    ]
  },

  // 🚚 DISTRIBUIDORES
  distribuidores: {
    PACMAN: {
      nombre: "PACMAN",
      codigo: "PCM",
      totalCompras: 8820423,
      adeudoActual: 6142500,
      pagado: 2677923,
      ordenes: 45,
      estado: "activo",
      calificacion: "A",
      diasCredito: 30,
      ultimaCompra: "2025-10-15",
      contacto: "+52 999 123 4567"
    },
    "Q-MAYA": {
      nombre: "Q-MAYA",
      codigo: "QMY",
      totalCompras: 6312632,
      adeudoActual: 6098400,
      pagado: 214232,
      ordenes: 38,
      estado: "activo",
      calificacion: "B",
      diasCredito: 21,
      ultimaCompra: "2025-10-14",
      contacto: "+52 999 234 5678"
    },
    "A/X🌶️🦀": {
      nombre: "A/X🌶️🦀",
      codigo: "AXC",
      totalCompras: 220533,
      adeudoActual: 207900,
      pagado: 12633,
      ordenes: 8,
      estado: "activo",
      calificacion: "C",
      diasCredito: 15,
      ultimaCompra: "2025-10-13",
      contacto: "+52 999 345 6789"
    },
    "CH-MONTE": {
      nombre: "CH-MONTE",
      codigo: "CHM",
      totalCompras: 3081187,
      adeudoActual: 630000,
      pagado: 2451187,
      ordenes: 22,
      estado: "activo",
      calificacion: "A",
      diasCredito: 45,
      ultimaCompra: "2025-10-16",
      contacto: "+52 999 456 7890"
    },
    "VALLE-MONTE": {
      nombre: "VALLE-MONTE",
      codigo: "VLM",
      totalCompras: 785612,
      adeudoActual: 140000,
      pagado: 645612,
      ordenes: 15,
      estado: "activo",
      calificacion: "B",
      diasCredito: 30,
      ultimaCompra: "2025-10-12",
      contacto: "+52 999 567 8901"
    },
    "Q-MAYA-MP": {
      nombre: "Q-MAYA-MP",
      codigo: "QMP",
      totalCompras: 987231,
      adeudoActual: 863100,
      pagado: 124131,
      ordenes: 12,
      estado: "revision",
      calificacion: "C",
      diasCredito: 15,
      ultimaCompra: "2025-10-11",
      contacto: "+52 999 678 9012"
    }
  },

  // 👥 CLIENTES
  clientes: {
    "Bódega M-P": {
      nombre: "Bódega M-P",
      codigo: "BMP",
      ventasTotales: 2156000,
      adeudo: 945000,
      pagado: 1211000,
      compras: 67,
      estado: "activo",
      tipo: "mayorista",
      diasCredito: 15,
      ultimaCompra: "2025-10-18"
    },
    "Primo": {
      nombre: "Primo",
      codigo: "PRM",
      ventasTotales: 4872,
      adeudo: 0,
      pagado: 4872,
      compras: 3,
      estado: "activo",
      tipo: "menudeo",
      diasCredito: 0,
      ultimaCompra: "2025-10-10"
    },
    "Tavo": {
      nombre: "Tavo",
      codigo: "TAV",
      ventasTotales: 189000,
      adeudo: 35000,
      pagado: 154000,
      compras: 12,
      estado: "activo",
      tipo: "regular",
      diasCredito: 7,
      ultimaCompra: "2025-10-17"
    },
    "Ax": {
      nombre: "Ax",
      codigo: "AXX",
      ventasTotales: 1048180,
      adeudo: 125000,
      pagado: 923180,
      compras: 45,
      estado: "activo",
      tipo: "mayorista",
      diasCredito: 21,
      ultimaCompra: "2025-10-16"
    },
    "Robalo": {
      nombre: "Robalo",
      codigo: "RBL",
      ventasTotales: 1320000,
      adeudo: 89000,
      pagado: 1231000,
      compras: 38,
      estado: "activo",
      tipo: "mayorista",
      diasCredito: 30,
      ultimaCompra: "2025-10-15"
    },
    "amigo playa azul": {
      nombre: "amigo playa azul",
      codigo: "APA",
      ventasTotales: 678900,
      adeudo: 355000,
      pagado: 323900,
      compras: 28,
      estado: "revision",
      tipo: "regular",
      diasCredito: 14,
      ultimaCompra: "2025-10-14"
    },
    "flama": {
      nombre: "flama",
      codigo: "FLM",
      ventasTotales: 892300,
      adeudo: 335000,
      pagado: 557300,
      compras: 31,
      estado: "moroso",
      tipo: "regular",
      diasCredito: 7,
      ultimaCompra: "2025-10-10"
    },
    "Tio Tocayo": {
      nombre: "Tio Tocayo",
      codigo: "TTC",
      ventasTotales: 1567000,
      adeudo: 315000,
      pagado: 1252000,
      compras: 52,
      estado: "activo",
      tipo: "mayorista",
      diasCredito: 30,
      ultimaCompra: "2025-10-18"
    }
  },

  // 📊 VENTAS
  ventas: Array.from({ length: 96 }, (_, i) => ({
    id: i + 1,
    fecha: new Date(Date.now() - (95 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    cliente: Object.keys({
      "Bódega M-P": {},
      "Ax": {},
      "Robalo": {},
      "Tio Tocayo": {}
    })[i % 4],
    cantidad: Math.floor(Math.random() * 50) + 10,
    precio: 6300,
    total: 0,
    estado: i < 90 ? "completado" : "pendiente",
    banco: Object.keys({
      boveda_monte: {},
      boveda_usa: {},
      flete_sur: {}
    })[i % 3],
    factura: `F-2025-${String(i + 1).padStart(4, '0')}`
  })).map(v => ({ ...v, total: v.cantidad * v.precio })),

  // 📈 ANALYTICS
  analytics: {
    kpis: {
      capitalTotal: 12861332.12,
      ventasMes: 3456789,
      utilidadMes: 567890,
      clientesActivos: 31,
      distribuidoresActivos: 6,
      rotacionInventario: 4.2,
      diasCartera: 18,
      margenUtilidad: 16.4
    },
    tendencias: {
      ventas: 15.3,
      utilidades: 12.8,
      inventario: -8.5,
      cartera: 5.2
    }
  }
};

// ==========================================
// 🚀 COMPONENTE PRINCIPAL FLOWDISTRIBUTOR 2.0
// ==========================================
const FlowDistributor = () => {
  // Estados principales
  const [data, setData] = useState(INITIAL_DATA);
  const [activeView, setActiveView] = useState('dashboard');
  const [selectedBank, setSelectedBank] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [searchTerm, setSearchTerm] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Referencias
  const chartRef = useRef(null);
  const exportRef = useRef(null);

  // ==========================================
  // 🎯 FUNCIONES DE UTILIDAD
  // ==========================================
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 2
    }).format(value);
  };

  const formatNumber = (value) => {
    return new Intl.NumberFormat('es-MX').format(value);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      excelente: '#2ECC71',
      activo: '#3498DB',
      alerta: '#F39C12',
      critico: '#E74C3C',
      revision: '#9B59B6',
      moroso: '#E67E22'
    };
    return colors[status] || '#95A5A6';
  };

  const getStatusIcon = (status) => {
    const icons = {
      excelente: <CheckCircle className="w-4 h-4" />,
      activo: <Activity className="w-4 h-4" />,
      alerta: <AlertCircle className="w-4 h-4" />,
      critico: <AlertTriangle className="w-4 h-4" />,
      revision: <Eye className="w-4 h-4" />,
      moroso: <XCircle className="w-4 h-4" />
    };
    return icons[status] || <Info className="w-4 h-4" />;
  };

  // ==========================================
  // 🔥 EFECTOS Y ACTUALIZACIONES
  // ==========================================
  useEffect(() => {
    // Generar notificaciones iniciales
    const alerts = [];
    
    // Alertas de inventario
    if (data.almacen.stockActual < data.almacen.stockMinimo) {
      alerts.push({
        id: Date.now(),
        tipo: 'critico',
        mensaje: `🚨 Stock crítico: Solo ${data.almacen.stockActual} unidades disponibles`,
        fecha: new Date(),
        leido: false
      });
    }

    // Alertas de bancos
    Object.entries(data.bancos).forEach(([key, banco]) => {
      if (banco.capitalActual < 0) {
        alerts.push({
          id: Date.now() + Math.random(),
          tipo: 'critico',
          mensaje: `💳 ${banco.nombre} tiene saldo negativo: ${formatCurrency(banco.capitalActual)}`,
          fecha: new Date(),
          leido: false
        });
      }
    });

    // Alertas de clientes morosos
    Object.entries(data.clientes).forEach(([key, cliente]) => {
      if (cliente.estado === 'moroso') {
        alerts.push({
          id: Date.now() + Math.random(),
          tipo: 'advertencia',
          mensaje: `👤 Cliente ${cliente.nombre} en estado moroso con adeudo de ${formatCurrency(cliente.adeudo)}`,
          fecha: new Date(),
          leido: false
        });
      }
    });

    setNotifications(alerts);

    // Auto-guardar cada minuto
    const autoSave = setInterval(() => {
      localStorage.setItem('flowdistributor_data', JSON.stringify(data));
    }, 60000);

    return () => clearInterval(autoSave);
  }, [data]);

  // ==========================================
  // 📊 PREPARACIÓN DE DATOS PARA GRÁFICOS
  // ==========================================
  const chartData = useMemo(() => {
    // Datos para gráfico de bancos
    const bankData = Object.entries(data.bancos).map(([key, banco]) => ({
      name: banco.nombre,
      capital: banco.capitalActual,
      ingresos: banco.totalIngresos,
      gastos: banco.totalGastos,
      color: banco.color
    }));

    // Datos para gráfico de ventas (últimos 30 días)
    const salesData = data.ventas.slice(-30).map(venta => ({
      fecha: formatDate(venta.fecha),
      total: venta.total,
      cantidad: venta.cantidad
    }));

    // Datos para distribución de inventario
    const inventoryData = Object.entries(data.almacen.ubicaciones).map(([key, ubicacion]) => ({
      name: key.charAt(0).toUpperCase() + key.slice(1),
      stock: ubicacion.stock,
      capacidad: ubicacion.capacidad,
      porcentaje: (ubicacion.stock / ubicacion.capacidad) * 100
    }));

    // Top clientes por adeudo
    const topClientes = Object.entries(data.clientes)
      .sort((a, b) => b[1].adeudo - a[1].adeudo)
      .slice(0, 5)
      .map(([key, cliente]) => ({
        name: cliente.nombre,
        adeudo: cliente.adeudo,
        pagado: cliente.pagado
      }));

    // Tendencias mensuales
    const tendencias = [
      { mes: 'Ene', ventas: 2850000, utilidad: 456000 },
      { mes: 'Feb', ventas: 3120000, utilidad: 498000 },
      { mes: 'Mar', ventas: 3450000, utilidad: 552000 },
      { mes: 'Abr', ventas: 3780000, utilidad: 604000 },
      { mes: 'May', ventas: 4100000, utilidad: 656000 },
      { mes: 'Jun', ventas: 4350000, utilidad: 696000 },
      { mes: 'Jul', ventas: 4680000, utilidad: 748000 },
      { mes: 'Ago', ventas: 4920000, utilidad: 787000 },
      { mes: 'Sep', ventas: 5150000, utilidad: 824000 },
      { mes: 'Oct', ventas: 5380000, utilidad: 860000 }
    ];

    return {
      bankData,
      salesData,
      inventoryData,
      topClientes,
      tendencias
    };
  }, [data]);

  // ==========================================
  // 🎨 COMPONENTE DE CARD
  // ==========================================
  const Card = ({ children, className = "", onClick, ...props }) => (
    <motion.div
      className={`bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700/50 ${className}`}
      whileHover={{ scale: onClick ? 1.02 : 1 }}
      whileTap={{ scale: onClick ? 0.98 : 1 }}
      onClick={onClick}
      {...props}
    >
      {children}
    </motion.div>
  );

  // ==========================================
  // 🎨 COMPONENTE DE KPI CARD
  // ==========================================
  const KPICard = ({ title, value, icon, trend, color, subtitle }) => (
    <Card className="relative overflow-hidden">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-gray-400 text-sm font-medium">{title}</p>
          <h3 className="text-2xl font-bold text-white mt-2">{value}</h3>
          {subtitle && (
            <p className="text-gray-500 text-xs mt-1">{subtitle}</p>
          )}
          {trend !== undefined && (
            <div className={`flex items-center mt-3 ${trend >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {trend >= 0 ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
              <span className="text-sm font-medium">{Math.abs(trend)}%</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg`} style={{ backgroundColor: `${color}20` }}>
          <div style={{ color }}>{icon}</div>
        </div>
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent to-gray-900/20 pointer-events-none" />
    </Card>
  );

  // ==========================================
  // 🏦 COMPONENTE DE BANCO
  // ==========================================
  const BankCard = ({ bank, onClick }) => {
    const isNegative = bank.capitalActual < 0;
    const percentage = bank.limiteCredito > 0 
      ? Math.abs(bank.capitalActual / bank.limiteCredito * 100)
      : 0;

    return (
      <Card 
        className="cursor-pointer hover:border-gray-600 transition-all"
        onClick={onClick}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center">
            <span className="text-2xl mr-3">{bank.icono}</span>
            <div>
              <h3 className="text-lg font-bold text-white">{bank.nombre}</h3>
              <p className="text-xs text-gray-400">{bank.codigo}</p>
            </div>
          </div>
          <div className={`px-2 py-1 rounded-full text-xs font-medium`}
               style={{ 
                 backgroundColor: `${getStatusColor(bank.estado)}20`,
                 color: getStatusColor(bank.estado)
               }}>
            {getStatusIcon(bank.estado)}
            <span className="ml-1">{bank.estado}</span>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <p className="text-xs text-gray-400 mb-1">Capital Actual</p>
            <p className={`text-2xl font-bold ${isNegative ? 'text-red-400' : 'text-green-400'}`}>
              {formatCurrency(bank.capitalActual)}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <p className="text-gray-500">Ingresos</p>
              <p className="text-green-400 font-medium">{formatCurrency(bank.totalIngresos)}</p>
            </div>
            <div>
              <p className="text-gray-500">Gastos</p>
              <p className="text-red-400 font-medium">{formatCurrency(bank.totalGastos)}</p>
            </div>
          </div>

          {bank.limiteCredito > 0 && (
            <div>
              <div className="flex justify-between text-xs text-gray-400 mb-1">
                <span>Uso de crédito</span>
                <span>{percentage.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="h-2 rounded-full transition-all"
                  style={{ 
                    width: `${Math.min(percentage, 100)}%`,
                    backgroundColor: percentage > 80 ? '#E74C3C' : percentage > 50 ? '#F39C12' : '#2ECC71'
                  }}
                />
              </div>
            </div>
          )}

          <div className="flex items-center justify-between pt-2 border-t border-gray-700">
            <div className={`flex items-center text-sm ${bank.tendencia >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {bank.tendencia >= 0 ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
              <span>{Math.abs(bank.tendencia)}%</span>
            </div>
            <button className="text-blue-400 hover:text-blue-300 text-sm flex items-center">
              Ver detalles <ChevronRight className="w-4 h-4 ml-1" />
            </button>
          </div>
        </div>
      </Card>
    );
  };

  // ==========================================
  // 📊 DASHBOARD PRINCIPAL
  // ==========================================
  const DashboardView = () => (
    <div className="space-y-6">
      {/* Header con KPIs principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Capital Total"
          value={formatCurrency(data.analytics.kpis.capitalTotal)}
          icon={<DollarSign className="w-6 h-6" />}
          trend={8.5}
          color="#2ECC71"
          subtitle="Todos los bancos"
        />
        <KPICard
          title="Stock Inventario"
          value={formatNumber(data.almacen.stockActual)}
          icon={<Package className="w-6 h-6" />}
          trend={-15.3}
          color="#E74C3C"
          subtitle={`Crítico: Min ${data.almacen.stockMinimo}`}
        />
        <KPICard
          title="Clientes Activos"
          value={formatNumber(data.analytics.kpis.clientesActivos)}
          icon={<Users className="w-6 h-6" />}
          trend={5.2}
          color="#3498DB"
          subtitle="31 de 32 totales"
        />
        <KPICard
          title="Ventas del Mes"
          value={formatCurrency(data.analytics.kpis.ventasMes)}
          icon={<ShoppingCart className="w-6 h-6" />}
          trend={15.3}
          color="#9B59B6"
          subtitle="96 transacciones"
        />
      </div>

      {/* Gráficos principales */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de tendencias */}
        <Card>
          <h3 className="text-lg font-bold text-white mb-4 flex items-center">
            <BarChart2 className="w-5 h-5 mr-2" />
            Tendencia de Ventas y Utilidades
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData.tendencias}>
              <defs>
                <linearGradient id="colorVentas" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3498DB" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3498DB" stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="colorUtilidad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2ECC71" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#2ECC71" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="mes" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }}
                labelStyle={{ color: '#F3F4F6' }}
              />
              <Area 
                type="monotone" 
                dataKey="ventas" 
                stroke="#3498DB" 
                fillOpacity={1} 
                fill="url(#colorVentas)" 
                strokeWidth={2}
              />
              <Area 
                type="monotone" 
                dataKey="utilidad" 
                stroke="#2ECC71" 
                fillOpacity={1} 
                fill="url(#colorUtilidad)" 
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* Gráfico de distribución de capital por banco */}
        <Card>
          <h3 className="text-lg font-bold text-white mb-4 flex items-center">
            <PieIcon className="w-5 h-5 mr-2" />
            Distribución de Capital por Banco
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData.bankData.filter(b => b.capital > 0)}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="capital"
              >
                {chartData.bankData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }}
                formatter={(value) => formatCurrency(value)}
              />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Grid de Bancos */}
      <div>
        <h3 className="text-lg font-bold text-white mb-4 flex items-center">
          <CreditCard className="w-5 h-5 mr-2" />
          Estado de Bancos
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Object.entries(data.bancos).map(([key, bank]) => (
            <BankCard 
              key={key} 
              bank={bank} 
              onClick={() => {
                setSelectedBank(bank);
                setActiveView('bank-detail');
              }}
            />
          ))}
        </div>
      </div>

      {/* Alertas y Notificaciones */}
      {notifications.length > 0 && (
        <Card>
          <h3 className="text-lg font-bold text-white mb-4 flex items-center">
            <Bell className="w-5 h-5 mr-2" />
            Alertas y Notificaciones
          </h3>
          <div className="space-y-2">
            {notifications.slice(0, 5).map(notif => (
              <div 
                key={notif.id} 
                className={`p-3 rounded-lg border ${
                  notif.tipo === 'critico' ? 'bg-red-900/20 border-red-800' :
                  notif.tipo === 'advertencia' ? 'bg-yellow-900/20 border-yellow-800' :
                  'bg-blue-900/20 border-blue-800'
                }`}
              >
                <div className="flex items-start justify-between">
                  <p className="text-sm text-gray-300">{notif.mensaje}</p>
                  <button className="text-gray-500 hover:text-gray-400">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Tabla de últimas ventas */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-white flex items-center">
            <FileText className="w-5 h-5 mr-2" />
            Últimas Ventas
          </h3>
          <button className="text-blue-400 hover:text-blue-300 text-sm flex items-center">
            Ver todas <ChevronRight className="w-4 h-4 ml-1" />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b border-gray-700">
                <th className="pb-3 text-gray-400 font-medium">Fecha</th>
                <th className="pb-3 text-gray-400 font-medium">Cliente</th>
                <th className="pb-3 text-gray-400 font-medium">Cantidad</th>
                <th className="pb-3 text-gray-400 font-medium">Total</th>
                <th className="pb-3 text-gray-400 font-medium">Estado</th>
              </tr>
            </thead>
            <tbody>
              {data.ventas.slice(-10).reverse().map(venta => (
                <tr key={venta.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                  <td className="py-3 text-gray-300">{formatDate(venta.fecha)}</td>
                  <td className="py-3 text-gray-300">{venta.cliente}</td>
                  <td className="py-3 text-gray-300">{venta.cantidad} u</td>
                  <td className="py-3 text-gray-300">{formatCurrency(venta.total)}</td>
                  <td className="py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      venta.estado === 'completado' ? 'bg-green-900/30 text-green-400' :
                      'bg-yellow-900/30 text-yellow-400'
                    }`}>
                      {venta.estado}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );

  // ==========================================
  // 💳 VISTA DETALLE DE BANCO
  // ==========================================
  const BankDetailView = () => {
    if (!selectedBank) return null;

    return (
      <div className="space-y-6">
        {/* Header del banco */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button 
              onClick={() => setActiveView('dashboard')}
              className="mr-4 p-2 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-3xl mr-3">{selectedBank.icono}</span>
            <div>
              <h2 className="text-2xl font-bold text-white">{selectedBank.nombre}</h2>
              <p className="text-gray-400">{selectedBank.codigo}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium flex items-center">
              <Plus className="w-4 h-4 mr-2" />
              Nueva Transacción
            </button>
            <button className="p-2 hover:bg-gray-800 rounded-lg">
              <Download className="w-5 h-5" />
            </button>
            <button className="p-2 hover:bg-gray-800 rounded-lg">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* KPIs del banco */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <KPICard
            title="Capital Actual"
            value={formatCurrency(selectedBank.capitalActual)}
            icon={<DollarSign className="w-6 h-6" />}
            trend={selectedBank.tendencia}
            color={selectedBank.capitalActual >= 0 ? "#2ECC71" : "#E74C3C"}
          />
          <KPICard
            title="Total Ingresos"
            value={formatCurrency(selectedBank.totalIngresos)}
            icon={<TrendingUp className="w-6 h-6" />}
            color="#3498DB"
          />
          <KPICard
            title="Total Gastos"
            value={formatCurrency(selectedBank.totalGastos)}
            icon={<TrendingDown className="w-6 h-6" />}
            color="#E74C3C"
          />
          <KPICard
            title="Balance"
            value={formatCurrency(selectedBank.balance)}
            icon={<Activity className="w-6 h-6" />}
            color={selectedBank.balance >= 0 ? "#2ECC71" : "#E74C3C"}
          />
        </div>

        {/* Gráfico de flujo de efectivo */}
        <Card>
          <h3 className="text-lg font-bold text-white mb-4">Flujo de Efectivo</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={[
              { name: 'Ene', ingresos: 450000, gastos: 320000 },
              { name: 'Feb', ingresos: 520000, gastos: 380000 },
              { name: 'Mar', ingresos: 480000, gastos: 410000 },
              { name: 'Abr', ingresos: 590000, gastos: 360000 },
              { name: 'May', ingresos: 610000, gastos: 420000 },
              { name: 'Jun', ingresos: 680000, gastos: 450000 },
              { name: 'Jul', ingresos: 720000, gastos: 480000 },
              { name: 'Ago', ingresos: 750000, gastos: 510000 },
              { name: 'Sep', ingresos: 820000, gastos: 540000 },
              { name: 'Oct', ingresos: selectedBank.totalIngresos / 10, gastos: selectedBank.totalGastos / 10 }
            ]}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }}
                formatter={(value) => formatCurrency(value)}
              />
              <Legend />
              <Bar dataKey="ingresos" fill="#2ECC71" />
              <Bar dataKey="gastos" fill="#E74C3C" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Transacciones recientes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Ingresos */}
          <Card>
            <h3 className="text-lg font-bold text-white mb-4 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-green-400" />
              Últimos Ingresos
            </h3>
            <div className="space-y-3">
              {selectedBank.ingresos.map(ingreso => (
                <div key={ingreso.id} className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg">
                  <div>
                    <p className="text-white font-medium">{ingreso.concepto}</p>
                    <p className="text-xs text-gray-400">{formatDate(ingreso.fecha)}</p>
                  </div>
                  <p className="text-green-400 font-bold">{formatCurrency(ingreso.valor)}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* Gastos */}
          <Card>
            <h3 className="text-lg font-bold text-white mb-4 flex items-center">
              <TrendingDown className="w-5 h-5 mr-2 text-red-400" />
              Últimos Gastos
            </h3>
            <div className="space-y-3">
              {selectedBank.gastos.map(gasto => (
                <div key={gasto.id} className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg">
                  <div>
                    <p className="text-white font-medium">{gasto.concepto}</p>
                    <p className="text-xs text-gray-400">{formatDate(gasto.fecha)}</p>
                  </div>
                  <p className="text-red-400 font-bold">{formatCurrency(gasto.valor)}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    );
  };

  // ==========================================
  // 📦 VISTA DE INVENTARIO
  // ==========================================
  const InventoryView = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white flex items-center">
          <Package className="w-8 h-8 mr-3" />
          Gestión de Inventario
        </h2>
        <div className="flex items-center space-x-2">
          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium flex items-center">
            <Plus className="w-4 h-4 mr-2" />
            Registrar Entrada
          </button>
          <button className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-white font-medium flex items-center">
            <Upload className="w-4 h-4 mr-2" />
            Importar
          </button>
        </div>
      </div>

      {/* KPIs de Inventario */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <KPICard
          title="Stock Actual"
          value={formatNumber(data.almacen.stockActual)}
          icon={<Package className="w-6 h-6" />}
          color="#E74C3C"
          subtitle="Crítico: Mínimo 50 unidades"
        />
        <KPICard
          title="Total Entradas"
          value={formatNumber(data.almacen.totalEntradas)}
          icon={<TrendingUp className="w-6 h-6" />}
          color="#2ECC71"
        />
        <KPICard
          title="Total Salidas"
          value={formatNumber(data.almacen.totalSalidas)}
          icon={<TrendingDown className="w-6 h-6" />}
          color="#E74C3C"
        />
        <KPICard
          title="Valor Inventario"
          value={formatCurrency(data.almacen.valorInventario)}
          icon={<DollarSign className="w-6 h-6" />}
          color="#3498DB"
        />
      </div>

      {/* Distribución por ubicación */}
      <Card>
        <h3 className="text-lg font-bold text-white mb-4">Distribución por Ubicación</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData.inventoryData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="name" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" />
            <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }} />
            <Legend />
            <Bar dataKey="stock" fill="#3498DB" name="Stock Actual" />
            <Bar dataKey="capacidad" fill="#1F2937" name="Capacidad Total" />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Movimientos recientes */}
      <Card>
        <h3 className="text-lg font-bold text-white mb-4">Movimientos Recientes</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b border-gray-700">
                <th className="pb-3 text-gray-400 font-medium">Fecha</th>
                <th className="pb-3 text-gray-400 font-medium">Tipo</th>
                <th className="pb-3 text-gray-400 font-medium">Cantidad</th>
                <th className="pb-3 text-gray-400 font-medium">Origen/Destino</th>
                <th className="pb-3 text-gray-400 font-medium">Precio</th>
                <th className="pb-3 text-gray-400 font-medium">Total</th>
              </tr>
            </thead>
            <tbody>
              {data.almacen.movimientos.map(mov => (
                <tr key={mov.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                  <td className="py-3 text-gray-300">{formatDate(mov.fecha)}</td>
                  <td className="py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      mov.tipo === 'entrada' ? 'bg-green-900/30 text-green-400' :
                      'bg-red-900/30 text-red-400'
                    }`}>
                      {mov.tipo}
                    </span>
                  </td>
                  <td className="py-3 text-gray-300">{mov.cantidad} u</td>
                  <td className="py-3 text-gray-300">{mov.distribuidor || mov.cliente}</td>
                  <td className="py-3 text-gray-300">{formatCurrency(mov.precio)}</td>
                  <td className="py-3 text-gray-300">{formatCurrency(mov.cantidad * mov.precio)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );

  // ==========================================
  // 🚚 VISTA DE DISTRIBUIDORES
  // ==========================================
  const DistributorsView = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white flex items-center">
          <Truck className="w-8 h-8 mr-3" />
          Gestión de Distribuidores
        </h2>
        <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium flex items-center">
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Distribuidor
        </button>
      </div>

      {/* Grid de distribuidores */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(data.distribuidores).map(([key, dist]) => (
          <Card key={key} className="hover:border-gray-600 transition-all cursor-pointer">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-white">{dist.nombre}</h3>
                <p className="text-xs text-gray-400">{dist.codigo}</p>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                dist.calificacion === 'A' ? 'bg-green-900/30 text-green-400' :
                dist.calificacion === 'B' ? 'bg-yellow-900/30 text-yellow-400' :
                'bg-red-900/30 text-red-400'
              }`}>
                Calificación {dist.calificacion}
              </span>
            </div>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="text-gray-500">Total Compras</p>
                  <p className="text-white font-medium">{formatCurrency(dist.totalCompras)}</p>
                </div>
                <div>
                  <p className="text-gray-500">Adeudo Actual</p>
                  <p className="text-red-400 font-medium">{formatCurrency(dist.adeudoActual)}</p>
                </div>
                <div>
                  <p className="text-gray-500">Órdenes</p>
                  <p className="text-white font-medium">{dist.ordenes}</p>
                </div>
                <div>
                  <p className="text-gray-500">Días Crédito</p>
                  <p className="text-white font-medium">{dist.diasCredito} días</p>
                </div>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-gray-700">
                <p className="text-xs text-gray-400">Última compra: {formatDate(dist.ultimaCompra)}</p>
                <button className="text-blue-400 hover:text-blue-300 text-sm">
                  Ver detalles
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );

  // ==========================================
  // 👥 VISTA DE CLIENTES
  // ==========================================
  const ClientsView = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white flex items-center">
          <Users className="w-8 h-8 mr-3" />
          Gestión de Clientes
        </h2>
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar cliente..."
              className="pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium flex items-center">
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Cliente
          </button>
        </div>
      </div>

      {/* Tabla de clientes */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b border-gray-700">
                <th className="pb-3 text-gray-400 font-medium">Cliente</th>
                <th className="pb-3 text-gray-400 font-medium">Código</th>
                <th className="pb-3 text-gray-400 font-medium">Ventas Totales</th>
                <th className="pb-3 text-gray-400 font-medium">Adeudo</th>
                <th className="pb-3 text-gray-400 font-medium">Pagado</th>
                <th className="pb-3 text-gray-400 font-medium">Estado</th>
                <th className="pb-3 text-gray-400 font-medium">Tipo</th>
                <th className="pb-3 text-gray-400 font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(data.clientes)
                .filter(([key, cliente]) => 
                  cliente.nombre.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map(([key, cliente]) => (
                <tr key={key} className="border-b border-gray-800 hover:bg-gray-800/50">
                  <td className="py-3 text-white font-medium">{cliente.nombre}</td>
                  <td className="py-3 text-gray-300">{cliente.codigo}</td>
                  <td className="py-3 text-gray-300">{formatCurrency(cliente.ventasTotales)}</td>
                  <td className="py-3 text-red-400">{formatCurrency(cliente.adeudo)}</td>
                  <td className="py-3 text-green-400">{formatCurrency(cliente.pagado)}</td>
                  <td className="py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium`}
                          style={{ 
                            backgroundColor: `${getStatusColor(cliente.estado)}20`,
                            color: getStatusColor(cliente.estado)
                          }}>
                      {cliente.estado}
                    </span>
                  </td>
                  <td className="py-3 text-gray-300">{cliente.tipo}</td>
                  <td className="py-3">
                    <div className="flex items-center space-x-2">
                      <button className="p-1 hover:bg-gray-700 rounded">
                        <Eye className="w-4 h-4 text-gray-400" />
                      </button>
                      <button className="p-1 hover:bg-gray-700 rounded">
                        <Edit3 className="w-4 h-4 text-gray-400" />
                      </button>
                      <button className="p-1 hover:bg-gray-700 rounded">
                        <Mail className="w-4 h-4 text-gray-400" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Top clientes por adeudo */}
      <Card>
        <h3 className="text-lg font-bold text-white mb-4">Top Clientes por Adeudo</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData.topClientes} layout="horizontal">
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis type="number" stroke="#9CA3AF" />
            <YAxis type="category" dataKey="name" stroke="#9CA3AF" />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }}
              formatter={(value) => formatCurrency(value)}
            />
            <Legend />
            <Bar dataKey="adeudo" fill="#E74C3C" name="Adeudo" />
            <Bar dataKey="pagado" fill="#2ECC71" name="Pagado" />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );

  // ==========================================
  // 📊 VISTA DE VENTAS
  // ==========================================
  const SalesView = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white flex items-center">
          <ShoppingCart className="w-8 h-8 mr-3" />
          Gestión de Ventas
        </h2>
        <div className="flex items-center space-x-2">
          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium flex items-center">
            <Plus className="w-4 h-4 mr-2" />
            Nueva Venta
          </button>
          <button className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white font-medium flex items-center">
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </button>
        </div>
      </div>

      {/* Gráfico de ventas */}
      <Card>
        <h3 className="text-lg font-bold text-white mb-4">Ventas Últimos 30 Días</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData.salesData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="fecha" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }}
              formatter={(value) => formatCurrency(value)}
            />
            <Line 
              type="monotone" 
              dataKey="total" 
              stroke="#3498DB" 
              strokeWidth={2}
              dot={{ fill: '#3498DB', r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Tabla de ventas */}
      <Card>
        <h3 className="text-lg font-bold text-white mb-4">Registro de Ventas</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b border-gray-700">
                <th className="pb-3 text-gray-400 font-medium">Factura</th>
                <th className="pb-3 text-gray-400 font-medium">Fecha</th>
                <th className="pb-3 text-gray-400 font-medium">Cliente</th>
                <th className="pb-3 text-gray-400 font-medium">Cantidad</th>
                <th className="pb-3 text-gray-400 font-medium">Precio</th>
                <th className="pb-3 text-gray-400 font-medium">Total</th>
                <th className="pb-3 text-gray-400 font-medium">Banco</th>
                <th className="pb-3 text-gray-400 font-medium">Estado</th>
                <th className="pb-3 text-gray-400 font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {data.ventas.slice(0, 20).map(venta => (
                <tr key={venta.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                  <td className="py-3 text-white font-medium">{venta.factura}</td>
                  <td className="py-3 text-gray-300">{formatDate(venta.fecha)}</td>
                  <td className="py-3 text-gray-300">{venta.cliente}</td>
                  <td className="py-3 text-gray-300">{venta.cantidad} u</td>
                  <td className="py-3 text-gray-300">{formatCurrency(venta.precio)}</td>
                  <td className="py-3 text-white font-medium">{formatCurrency(venta.total)}</td>
                  <td className="py-3 text-gray-300">{venta.banco}</td>
                  <td className="py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      venta.estado === 'completado' ? 'bg-green-900/30 text-green-400' :
                      'bg-yellow-900/30 text-yellow-400'
                    }`}>
                      {venta.estado}
                    </span>
                  </td>
                  <td className="py-3">
                    <div className="flex items-center space-x-2">
                      <button className="p-1 hover:bg-gray-700 rounded">
                        <Eye className="w-4 h-4 text-gray-400" />
                      </button>
                      <button className="p-1 hover:bg-gray-700 rounded">
                        <Edit3 className="w-4 h-4 text-gray-400" />
                      </button>
                      <button className="p-1 hover:bg-gray-700 rounded">
                        <Printer className="w-4 h-4 text-gray-400" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );

  // ==========================================
  // 🎨 SIDEBAR DE NAVEGACIÓN
  // ==========================================
  const Sidebar = () => (
    <div className="w-64 bg-gray-900 border-r border-gray-800 h-screen overflow-y-auto">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-white flex items-center">
          <Zap className="w-8 h-8 mr-2 text-blue-500" />
          FlowDistributor
        </h1>
        <p className="text-xs text-gray-400 mt-1">v2.0 Quantum Edition</p>
      </div>

      <nav className="px-4 pb-6">
        <div className="space-y-1">
          <button
            onClick={() => setActiveView('dashboard')}
            className={`w-full flex items-center px-3 py-2 rounded-lg transition-colors ${
              activeView === 'dashboard' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-800'
            }`}
          >
            <Home className="w-5 h-5 mr-3" />
            Dashboard
          </button>
          <button
            onClick={() => setActiveView('banks')}
            className={`w-full flex items-center px-3 py-2 rounded-lg transition-colors ${
              activeView === 'banks' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-800'
            }`}
          >
            <CreditCard className="w-5 h-5 mr-3" />
            Bancos
          </button>
          <button
            onClick={() => setActiveView('inventory')}
            className={`w-full flex items-center px-3 py-2 rounded-lg transition-colors ${
              activeView === 'inventory' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-800'
            }`}
          >
            <Package className="w-5 h-5 mr-3" />
            Inventario
            {data.almacen.stockActual < data.almacen.stockMinimo && (
              <span className="ml-auto bg-red-600 text-white text-xs px-2 py-0.5 rounded-full">!</span>
            )}
          </button>
          <button
            onClick={() => setActiveView('distributors')}
            className={`w-full flex items-center px-3 py-2 rounded-lg transition-colors ${
              activeView === 'distributors' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-800'
            }`}
          >
            <Truck className="w-5 h-5 mr-3" />
            Distribuidores
          </button>
          <button
            onClick={() => setActiveView('clients')}
            className={`w-full flex items-center px-3 py-2 rounded-lg transition-colors ${
              activeView === 'clients' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-800'
            }`}
          >
            <Users className="w-5 h-5 mr-3" />
            Clientes
          </button>
          <button
            onClick={() => setActiveView('sales')}
            className={`w-full flex items-center px-3 py-2 rounded-lg transition-colors ${
              activeView === 'sales' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-800'
            }`}
          >
            <ShoppingCart className="w-5 h-5 mr-3" />
            Ventas
          </button>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-800">
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">Herramientas</p>
          <div className="space-y-1">
            <button className="w-full flex items-center px-3 py-2 text-gray-300 hover:bg-gray-800 rounded-lg transition-colors">
              <FileText className="w-5 h-5 mr-3" />
              Reportes
            </button>
            <button className="w-full flex items-center px-3 py-2 text-gray-300 hover:bg-gray-800 rounded-lg transition-colors">
              <Upload className="w-5 h-5 mr-3" />
              Importar Excel
            </button>
            <button className="w-full flex items-center px-3 py-2 text-gray-300 hover:bg-gray-800 rounded-lg transition-colors">
              <Download className="w-5 h-5 mr-3" />
              Exportar
            </button>
            <button className="w-full flex items-center px-3 py-2 text-gray-300 hover:bg-gray-800 rounded-lg transition-colors">
              <Settings className="w-5 h-5 mr-3" />
              Configuración
            </button>
          </div>
        </div>

        <div className="mt-8 p-4 bg-gray-800/50 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-400">Almacenamiento</span>
            <span className="text-xs text-gray-300">2.3 GB / 10 GB</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div className="bg-blue-600 h-2 rounded-full" style={{ width: '23%' }} />
          </div>
        </div>
      </nav>
    </div>
  );

  // ==========================================
  // 🎨 HEADER PRINCIPAL
  // ==========================================
  const Header = () => (
    <header className="bg-gray-900/50 backdrop-blur-lg border-b border-gray-800 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <button className="p-2 hover:bg-gray-800 rounded-lg mr-4 lg:hidden">
            <Menu className="w-5 h-5" />
          </button>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar en todo el sistema..."
              className="pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white w-96 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {/* Selector de período */}
          <select 
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-3 py-1.5 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500"
          >
            <option value="day">Hoy</option>
            <option value="week">Esta Semana</option>
            <option value="month">Este Mes</option>
            <option value="quarter">Este Trimestre</option>
            <option value="year">Este Año</option>
          </select>

          {/* Notificaciones */}
          <div className="relative">
            <button className="p-2 hover:bg-gray-800 rounded-lg relative">
              <Bell className="w-5 h-5" />
              {notifications.filter(n => !n.leido).length > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              )}
            </button>
          </div>

          {/* Modo oscuro */}
          <button 
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 hover:bg-gray-800 rounded-lg"
          >
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          {/* Actualizar */}
          <button className="p-2 hover:bg-gray-800 rounded-lg">
            <RefreshCw className="w-5 h-5" />
          </button>

          {/* Usuario */}
          <div className="flex items-center">
            <img 
              src="https://ui-avatars.com/api/?name=Admin&background=3498DB&color=fff" 
              alt="Usuario"
              className="w-8 h-8 rounded-full"
            />
            <ChevronDown className="w-4 h-4 ml-1 text-gray-400" />
          </div>
        </div>
      </div>
    </header>
  );

  // ==========================================
  // 🚀 RENDER PRINCIPAL
  // ==========================================
  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark bg-gray-950 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="flex">
        {/* Sidebar */}
        <Sidebar />

        {/* Contenido principal */}
        <div className="flex-1">
          {/* Header */}
          <Header />

          {/* Vista activa */}
          <main className="p-6">
            <AnimatePresence mode="wait">
              {activeView === 'dashboard' && (
                <motion.div
                  key="dashboard"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <DashboardView />
                </motion.div>
              )}
              {activeView === 'bank-detail' && (
                <motion.div
                  key="bank-detail"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <BankDetailView />
                </motion.div>
              )}
              {activeView === 'inventory' && (
                <motion.div
                  key="inventory"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <InventoryView />
                </motion.div>
              )}
              {activeView === 'distributors' && (
                <motion.div
                  key="distributors"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <DistributorsView />
                </motion.div>
              )}
              {activeView === 'clients' && (
                <motion.div
                  key="clients"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <ClientsView />
                </motion.div>
              )}
              {activeView === 'sales' && (
                <motion.div
                  key="sales"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <SalesView />
                </motion.div>
              )}
            </AnimatePresence>
          </main>
        </div>
      </div>
    </div>
  );
};

export default FlowDistributor;