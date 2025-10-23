import React, { Suspense, lazy, useCallback, useEffect, useRef, useState } from 'react';

import { AnimatePresence, motion, useMotionValue, useSpring } from 'framer-motion';
//  NOTIFICACIONES EN TIEMPO REAL (Blueprint Supreme 2025)
import {
  Activity,
  AlertCircle,
  ArrowDownCircle,
  ArrowDownRight,
  ArrowRight,
  ArrowUpCircle,
  ArrowUpRight,
  BarChart3,
  Bell,
  Bot,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  Copy,
  DollarSign,
  Download,
  Eye,
  FileSpreadsheet,
  FileText,
  Info,
  Keyboard,
  LayoutDashboard,
  List,
  Menu,
  Moon,
  Package,
  Plus,
  Redo2,
  Search,
  Send,
  Settings,
  Sparkles,
  Sun,
  Target,
  Trash2,
  TrendingDown,
  TrendingUp,
  Undo2,
  UserCheck,
  Users,
  Wallet,
  Warehouse,
  X,
  Zap,
} from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

// 🚀 NUEVAS IMPORTACIONES - FEATURES AVANZADOS
import {
  ConversionFunnel,
  GaugeChart,
  PeriodComparison,
  RadarAnalysis,
  SalesHeatmap,
  TrendPrediction,
} from '../../components/AdvancedCharts';
// 🎨 COMPONENTES PREMIUM DE ANÁLISIS (Blueprint Supreme 2025)
import AnimatedChart from '../../components/AnimatedChart';
import ChartsLoading from '../../components/ChartsLoading';
import { GuidedTour, useTour } from '../../components/GuidedTour';
import NotificationCenter, {
  NOTIFICATION_CATEGORY,
  NOTIFICATION_PRIORITY,
  useNotifications,
} from '../../components/NotificationCenter';
import StatCard from '../../components/StatCard';
import AIAssistant from '../../components/shared/AIAssistant';
import {
  BulkActionsBar,
  BulkConfirmModal,
  SelectionCheckbox,
  useBulkActions,
  useBulkSelection,
} from '../../utils/bulkActions';
import {
  DragModeToggle,
  DragOverlay,
  DraggableItem,
  useDragAndDrop,
  usePersistentOrder,
} from '../../utils/dragAndDrop';
import { KeyboardShortcutsHelp, useKeyboardShortcuts } from '../../utils/keyboardShortcuts';
import { useAdvancedSearch } from '../../utils/searchHooks';
import { highlightMatch } from '../../utils/searchUtils';
import { STORAGE_KEYS, useLocalStorage } from '../../utils/storage';
import { ThemeCustomizer, useTheme } from '../../utils/themeSystem';
import { useActionHistory } from '../../utils/undoRedo';
// 🎨 ANIMACIONES CSS SCROLL-DRIVEN (Blueprint Supreme 2025)
import './animations.css';
// 🛒 PANEL ÓRDENES DE COMPRA PREMIUM
import PanelOrdenesCompra from './components/PanelOrdenesCompra';
import RealtimeNotifications from './components/RealtimeNotifications';
// � INICIALIZADORES DE DATOS
import {
  inicializarSistemaDistribuidores,
  registrarPagoDistribuidor,
  verificarEstadoDistribuidores,
} from './data/inicializadorDistribuidores';
// 🔄 DATA INITIALIZER - AUTO-CARGA DE DATOS DEL EXCEL
import { inicializarTodosSiVacio } from './utils/dataInitializer';

// ==================== SISTEMA DE DISEÑO PREMIUM 2025 (BLUEPRINT SUPREME) ====================
const designSystem = {
  // ✨ Glassmorphism 3D Premium
  glass: {
    base: 'backdrop-blur-xl bg-gradient-to-br from-white/5 to-white/[0.02]',
    border: 'border border-white/10',
    shadow:
      'shadow-[0_8px_32px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.2),0_0_80px_rgba(66,153,225,0.1)]',
    hover:
      'hover:bg-white/10 hover:shadow-[0_12px_40px_rgba(0,0,0,0.15),0_0_100px_rgba(66,153,225,0.15)]',
    animation: 'transition-all duration-500 ease-out',
    saturate: 'saturate-150',
    // Clase completa combinada
    full: 'backdrop-blur-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.2)] transition-all duration-500',
  },

  // 🌌 Aurora Gradient Backgrounds
  aurora: {
    primary: 'bg-gradient-to-br from-[#0F2027] via-[#203A43] to-[#2C5364]',
    secondary: 'bg-gradient-to-br from-[#141E30] via-[#243B55] to-[#0F2027]',
    overlay:
      'absolute inset-0 bg-gradient-radial from-blue-500/10 via-purple-500/5 to-transparent blur-3xl',
  },

  // 📊 Bento Grid System
  bento: {
    grid: 'grid grid-cols-12 gap-[clamp(1rem,2vw,2rem)]',
    item: 'rounded-3xl overflow-hidden',
    aspect: {
      square: 'aspect-square',
      wide: 'aspect-[2/1]',
      tall: 'aspect-[1/2]',
      video: 'aspect-[3/2]',
      portrait: 'aspect-[2/3]',
    },
  },

  // 🎨 Colores Premium
  colors: {
    primary: {
      50: '#E6F3FF',
      500: '#0EA5E9',
      900: '#0C4A6E',
    },
    accent: {
      neon: '#00FF88',
      purple: '#8B5CF6',
      orange: '#F97316',
    },
    semantic: {
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444',
      info: '#3B82F6',
    },
  },

  // 🎭 Animaciones y Transiciones
  springs: {
    default: { tension: 300, friction: 10 },
    gentle: { tension: 120, friction: 14 },
    bouncy: { tension: 180, friction: 8 },
    stiff: { tension: 400, friction: 20 },
  },

  // Gradientes premium
  gradients: {
    primary: 'bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500',
    secondary: 'bg-gradient-to-r from-emerald-400 to-cyan-500',
    dark: 'bg-gradient-to-b from-gray-900 via-gray-800 to-black',
    neon: 'bg-gradient-to-r from-[#00FF88] via-[#8B5CF6] to-[#F97316]',
  },
};

// 🎨 Utilidad para combinar clases de Glassmorphism
const glassClass = (...classes) => {
  const { glass } = designSystem;
  return `${glass.full} ${classes.join(' ')}`;
};

// Lazy loading para componentes pesados
const ReportsCharts = lazy(() => import('../../components/Charts'));

// 🚀 LAZY IMPORTS - PANELES PREMIUM
const PanelUtilidades = lazy(() => import('./components/PanelUtilidades'));
const PanelFletes = lazy(() => import('./components/PanelFletes'));
const PanelBovedaMonte = lazy(() => import('./components/PanelBovedaMonte'));
const PanelAzteca = lazy(() => import('./components/PanelAzteca'));
const PanelLeftie = lazy(() => import('./components/PanelLeftie'));
const PanelProfit = lazy(() => import('./components/PanelProfit'));
const PanelClientes = lazy(() => import('./components/PanelClientes'));

// Cursor glow effect component
const CursorGlow = () => {
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);
  const springConfig = { damping: 25, stiffness: 150 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    const moveCursor = (e) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };
    globalThis.addEventListener('mousemove', moveCursor);
    return () => globalThis.removeEventListener('mousemove', moveCursor);
  }, [cursorX, cursorY]);

  return (
    <motion.div
      className="fixed w-96 h-96 pointer-events-none z-0 mix-blend-screen"
      style={{
        left: cursorXSpring,
        top: cursorYSpring,
        x: '-50%',
        y: '-50%',
      }}
    >
      <div className="w-full h-full bg-gradient-to-r from-blue-500/20 via-cyan-500/20 to-teal-500/20 blur-3xl rounded-full" />
    </motion.div>
  );
};

// Componente de Menú Contextual
const ContextMenu = ({ x, y, items, onClose }) => {
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        onClose();
      }
    };
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  return (
    <motion.div
      ref={menuRef}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.1 }}
      style={{ left: x, top: y }}
      className="fixed z-[9999] min-w-[200px] glass rounded-xl border border-white/20 shadow-2xl py-2"
    >
      {items.map((item, index) => (
        <React.Fragment key={`item-${index}`}>
          {item.divider ? (
            <div className="h-px bg-white/10 my-2" />
          ) : (
            <button
              onClick={() => {
                item.onClick();
                onClose();
              }}
              disabled={item.disabled}
              className={`w-full px-4 py-2.5 flex items-center gap-3 transition-all ${
                item.danger
                  ? 'hover:bg-red-500/20 text-red-400 hover:text-red-300'
                  : 'hover:bg-white/10 text-slate-300 hover:text-white'
              } ${item.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {item.icon && <item.icon className="w-4 h-4" />}
              <span className="text-sm font-medium">{item.label}</span>
              {item.shortcut && (
                <span className="ml-auto text-xs text-slate-500">{item.shortcut}</span>
              )}
            </button>
          )}
        </React.Fragment>
      ))}
    </motion.div>
  );
};

// COMPONENTE PRINCIPAL
export default function FlowDistributor() {
  // 🎯 HOOKS AVANZADOS - NUEVAS FUNCIONALIDADES
  const notificationSystem = useNotifications();
  const actionHistory = useActionHistory();
  const tour = useTour();
  const themeManager = useTheme();

  // Estados UI adicionales
  const [showNotificationCenter, setShowNotificationCenter] = useState(false);
  const [showKeyboardHelp, setShowKeyboardHelp] = useState(false);
  const [showThemeCustomizer, setShowThemeCustomizer] = useState(false);

  // Estado de menú contextual
  const [contextMenu, setContextMenu] = useState(null);

  // 🎨 BULK ACTIONS & DRAG-DROP STATES
  const [dragModeEnabled, setDragModeEnabled] = useState(false);
  const [bulkConfirmAction, setBulkConfirmAction] = useState(null);

  // Estados principales con persistencia
  const [activePanel, setActivePanel] = useLocalStorage('flow_active_panel', 'dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useLocalStorage(STORAGE_KEYS.SIDEBAR_STATE, true);
  const [darkMode, setDarkMode] = useLocalStorage(STORAGE_KEYS.THEME, false);
  const [showAIWidget, setShowAIWidget] = useState(false);
  const [aiMessages, setAiMessages] = useState([]);
  const [aiInput, setAiInput] = useState('');
  const [aiConversationContext, setAiConversationContext] = useState([]);
  const [notifications, setNotifications] = useState([]);

  // 🎯 DATOS COMPLETOS DEL EXCEL - INTEGRACIÓN TOTAL
  const [bancos, setBancos] = useLocalStorage(STORAGE_KEYS.FLOW_BANCOS, {
    bovedaMonte: {
      nombre: 'Bóveda Monte',
      codigo: 'BM',
      capitalActual: 0,
      capitalInicial: 5722280,
      historico: 5722280,
      registros: [],
      ingresos: [],
      gastos: [],
      transferencias: [],
      moneda: 'MXN',
      color: '#10b981',
      icono: '🏦',
      estado: 'alerta',
      limiteCredito: 10000000,
      tasaInteres: 0,
    },
    bovedaUSA: {
      nombre: 'Bóveda USA',
      codigo: 'BU',
      capitalActual: 128005,
      capitalInicial: 1888275,
      historico: 1888275,
      registros: [],
      ingresos: [],
      gastos: [],
      transferencias: [],
      moneda: 'USD',
      color: '#3b82f6',
      icono: '🇺🇸',
      estado: 'activo',
      limiteCredito: 5000000,
      tasaInteres: 0,
    },
    utilidades: {
      nombre: 'Utilidades',
      codigo: 'UT',
      capitalActual: 102658,
      capitalInicial: 280758,
      historico: 280758,
      registros: [],
      ingresos: [],
      gastos: [],
      transferencias: [],
      moneda: 'MXN',
      color: '#8b5cf6',
      icono: '💰',
      estado: 'activo',
      limiteCredito: 1000000,
      tasaInteres: 0,
    },
    fletes: {
      nombre: 'Flete Sur',
      codigo: 'FL',
      capitalActual: 185792,
      capitalInicial: 652512,
      historico: 652512,
      registros: [],
      ingresos: [],
      gastos: [],
      transferencias: [],
      moneda: 'MXN',
      color: '#f59e0b',
      icono: '🚚',
      estado: 'activo',
      limiteCredito: 2000000,
      tasaInteres: 0,
    },
    azteca: {
      nombre: 'Azteca',
      codigo: 'AZ',
      capitalActual: -178715,
      capitalInicial: 1880970,
      historico: 1880970,
      registros: [],
      ingresos: [],
      gastos: [],
      transferencias: [],
      moneda: 'MXN',
      color: '#ef4444',
      icono: '🏛️',
      estado: 'negativo',
      limiteCredito: 3000000,
      tasaInteres: 2.5,
    },
    leftie: {
      nombre: 'Leftie',
      codigo: 'LF',
      capitalActual: 45844,
      capitalInicial: 1252100,
      historico: 1252100,
      registros: [],
      ingresos: [],
      gastos: [],
      transferencias: [],
      moneda: 'MXN',
      color: '#06b6d4',
      icono: '💳',
      estado: 'activo',
      limiteCredito: 1500000,
      tasaInteres: 0,
    },
    profit: {
      nombre: 'Profit',
      codigo: 'PR',
      capitalActual: 12577748,
      capitalInicial: 12577748,
      historico: 12577748,
      registros: [],
      ingresos: [],
      gastos: [],
      transferencias: [],
      moneda: 'MXN',
      color: '#22c55e',
      icono: '📈',
      estado: 'excelente',
      limiteCredito: 20000000,
      tasaInteres: 0,
    },
  });

  const [ordenesCompra, setOrdenesCompra] = useLocalStorage(STORAGE_KEYS.FLOW_ORDENES, [
    {
      id: 'OC0001',
      folio: 'OC0001',
      fecha: '2025-08-23',
      distribuidor: 'Q-MAYA',
      cantidad: 423,
      total: 2653380,
      estado: 'completada',
    },
    {
      id: 'OC0002',
      folio: 'OC0002',
      fecha: '2025-08-25',
      distribuidor: 'Q-MAYA',
      cantidad: 32,
      total: 188800,
      estado: 'completada',
    },
    {
      id: 'OC0003',
      folio: 'OC0003',
      fecha: '2025-08-26',
      distribuidor: 'A/X🌶️🦀',
      cantidad: 33,
      total: 207900,
      estado: 'completada',
    },
    {
      id: 'OC0004',
      folio: 'OC0004',
      fecha: '2025-08-30',
      distribuidor: 'PACMAN',
      cantidad: 487,
      total: 3066100,
      estado: 'completada',
    },
    {
      id: 'OC0005',
      folio: 'OC0005',
      fecha: '2025-09-06',
      distribuidor: 'Q-MAYA',
      cantidad: 513,
      total: 3231900,
      estado: 'completada',
    },
    {
      id: 'OC0006',
      folio: 'OC0006',
      fecha: '2025-09-09',
      distribuidor: 'CH-MONTE',
      cantidad: 100,
      total: 630000,
      estado: 'completada',
    },
    {
      id: 'OC0007',
      folio: 'OC0007',
      fecha: '2025-09-29',
      distribuidor: 'VALLE-MONTE',
      cantidad: 20,
      total: 140000,
      estado: 'completada',
    },
    {
      id: 'OC0008',
      folio: 'OC0008',
      fecha: '2025-10-05',
      distribuidor: 'PACMAN',
      cantidad: 488,
      total: 2831200,
      estado: 'completada',
    },
    {
      id: 'OC0009',
      folio: 'OC0009',
      fecha: '2025-10-05',
      distribuidor: 'Q-MAYA-MP',
      cantidad: 200,
      total: 1180000,
      estado: 'completada',
    },
  ]);

  const [distribuidores, setDistribuidores] = useLocalStorage(STORAGE_KEYS.FLOW_DISTRIBUIDORES, []);

  const [ventas, setVentas] = useLocalStorage(STORAGE_KEYS.FLOW_VENTAS, []);

  const [clientes, setClientes] = useLocalStorage(STORAGE_KEYS.FLOW_CLIENTES, [
    {
      id: 'CLI-001',
      nombre: 'Bódega M-P',
      tipo: 'mayorista',
      totalCompras: 2156000,
      adeudo: 945000,
      pagado: 1211000,
      ventas: 67,
      estado: 'activo',
    },
    {
      id: 'CLI-002',
      nombre: 'Valle',
      tipo: 'mayorista',
      totalCompras: 1876000,
      adeudo: 878000,
      pagado: 998000,
      ventas: 54,
      estado: 'activo',
    },
    {
      id: 'CLI-003',
      nombre: 'Ax',
      tipo: 'mayorista',
      totalCompras: 1048180,
      adeudo: 125000,
      pagado: 923180,
      ventas: 45,
      estado: 'activo',
    },
    {
      id: 'CLI-004',
      nombre: 'Tocayo',
      tipo: 'regular',
      totalCompras: 897200,
      adeudo: 355000,
      pagado: 542200,
      ventas: 38,
      estado: 'activo',
    },
    {
      id: 'CLI-005',
      nombre: 'Tio Tocayo',
      tipo: 'mayorista',
      totalCompras: 1567000,
      adeudo: 315000,
      pagado: 1252000,
      ventas: 52,
      estado: 'activo',
    },
    {
      id: 'CLI-006',
      nombre: 'Lamas',
      tipo: 'regular',
      totalCompras: 1234000,
      adeudo: 456000,
      pagado: 778000,
      ventas: 44,
      estado: 'activo',
    },
    {
      id: 'CLI-007',
      nombre: 'Trámite Chucho',
      tipo: 'regular',
      totalCompras: 998000,
      adeudo: 302400,
      pagado: 695600,
      ventas: 35,
      estado: 'activo',
    },
    {
      id: 'CLI-008',
      nombre: 'Galvan',
      tipo: 'menudeo',
      totalCompras: 156700,
      adeudo: 22200,
      pagado: 134500,
      ventas: 28,
      estado: 'activo',
    },
    {
      id: 'CLI-009',
      nombre: 'Sierra47',
      tipo: 'regular',
      totalCompras: 543000,
      adeudo: 105000,
      pagado: 438000,
      ventas: 31,
      estado: 'activo',
    },
    {
      id: 'CLI-010',
      nombre: 'Negrito',
      tipo: 'menudeo',
      totalCompras: 345000,
      adeudo: 175000,
      pagado: 170000,
      ventas: 22,
      estado: 'activo',
    },
    {
      id: 'CLI-011',
      nombre: 'Rafael G-69',
      tipo: 'menudeo',
      totalCompras: 287000,
      adeudo: 84000,
      pagado: 203000,
      ventas: 19,
      estado: 'activo',
    },
    {
      id: 'CLI-012',
      nombre: 'Manny',
      tipo: 'regular',
      totalCompras: 678000,
      adeudo: 234000,
      pagado: 444000,
      ventas: 26,
      estado: 'activo',
    },
    {
      id: 'CLI-013',
      nombre: 'Panchito Guasp',
      tipo: 'menudeo',
      totalCompras: 198000,
      adeudo: 62000,
      pagado: 136000,
      ventas: 15,
      estado: 'activo',
    },
    {
      id: 'CLI-014',
      nombre: 'Morsa',
      tipo: 'regular',
      totalCompras: 445000,
      adeudo: 145000,
      pagado: 300000,
      ventas: 24,
      estado: 'activo',
    },
    {
      id: 'CLI-015',
      nombre: 'Emiliano Vázquez',
      tipo: 'menudeo',
      totalCompras: 167000,
      adeudo: 45000,
      pagado: 122000,
      ventas: 12,
      estado: 'activo',
    },
    {
      id: 'CLI-016',
      nombre: 'Jaime Juguetes',
      tipo: 'menudeo',
      totalCompras: 234000,
      adeudo: 78000,
      pagado: 156000,
      ventas: 18,
      estado: 'activo',
    },
    {
      id: 'CLI-017',
      nombre: 'Ruben',
      tipo: 'menudeo',
      totalCompras: 189000,
      adeudo: 52000,
      pagado: 137000,
      ventas: 14,
      estado: 'activo',
    },
    {
      id: 'CLI-018',
      nombre: 'Hermano Negrito',
      tipo: 'menudeo',
      totalCompras: 156000,
      adeudo: 43000,
      pagado: 113000,
      ventas: 11,
      estado: 'activo',
    },
    {
      id: 'CLI-019',
      nombre: 'Coreano',
      tipo: 'regular',
      totalCompras: 567000,
      adeudo: 187000,
      pagado: 380000,
      ventas: 29,
      estado: 'activo',
    },
    {
      id: 'CLI-020',
      nombre: 'Chalo',
      tipo: 'menudeo',
      totalCompras: 145000,
      adeudo: 38000,
      pagado: 107000,
      ventas: 10,
      estado: 'activo',
    },
    {
      id: 'CLI-021',
      nombre: 'Juan-Braulio',
      tipo: 'regular',
      totalCompras: 423000,
      adeudo: 132000,
      pagado: 291000,
      ventas: 21,
      estado: 'activo',
    },
    {
      id: 'CLI-022',
      nombre: 'Primo Tocayo',
      tipo: 'menudeo',
      totalCompras: 178000,
      adeudo: 51000,
      pagado: 127000,
      ventas: 13,
      estado: 'activo',
    },
    {
      id: 'CLI-023',
      nombre: 'Raul G',
      tipo: 'regular',
      totalCompras: 389000,
      adeudo: 118000,
      pagado: 271000,
      ventas: 20,
      estado: 'activo',
    },
    {
      id: 'CLI-024',
      nombre: 'Nacho',
      tipo: 'menudeo',
      totalCompras: 234000,
      adeudo: 76000,
      pagado: 158000,
      ventas: 17,
      estado: 'activo',
    },
    {
      id: 'CLI-025',
      nombre: 'Fabri/Yamilet',
      tipo: 'regular',
      totalCompras: 512000,
      adeudo: 162000,
      pagado: 350000,
      ventas: 27,
      estado: 'activo',
    },
    {
      id: 'CLI-026',
      nombre: 'Primo Lamas',
      tipo: 'menudeo',
      totalCompras: 201000,
      adeudo: 64000,
      pagado: 137000,
      ventas: 16,
      estado: 'activo',
    },
    {
      id: 'CLI-027',
      nombre: 'Varillas Negrito',
      tipo: 'menudeo',
      totalCompras: 167000,
      adeudo: 48000,
      pagado: 119000,
      ventas: 12,
      estado: 'activo',
    },
    {
      id: 'CLI-028',
      nombre: 'Armando Rodríguez',
      tipo: 'regular',
      totalCompras: 456000,
      adeudo: 143000,
      pagado: 313000,
      ventas: 23,
      estado: 'activo',
    },
    {
      id: 'CLI-029',
      nombre: 'Marco Antonio',
      tipo: 'menudeo',
      totalCompras: 189000,
      adeudo: 57000,
      pagado: 132000,
      ventas: 14,
      estado: 'activo',
    },
    {
      id: 'CLI-030',
      nombre: 'Chuy Campos',
      tipo: 'regular',
      totalCompras: 378000,
      adeudo: 115000,
      pagado: 263000,
      ventas: 19,
      estado: 'activo',
    },
    {
      id: 'CLI-031',
      nombre: 'José Luis Martínez',
      tipo: 'menudeo',
      totalCompras: 145000,
      adeudo: 41000,
      pagado: 104000,
      ventas: 10,
      estado: 'activo',
    },
  ]);

  const [almacen, setAlmacen] = useLocalStorage(STORAGE_KEYS.FLOW_ALMACEN, {
    stockActual: 17,
    stockMinimo: 50,
    stockMaximo: 3000,
    totalEntradas: 2296,
    totalSalidas: 2279,
    valorInventario: 107100,
    costoPromedio: 6300,
    stock: [
      {
        id: 'PROD-001',
        nombre: 'Producto Principal',
        sku: 'PROD-001',
        cantidad: 17,
        cantidadMinima: 50,
        cantidadMaxima: 3000,
        precioCompra: 6300,
        precioVenta: 7000,
        ubicacion: 'Monte',
        categoria: 'Principal',
        estado: 'critico',
      },
    ],
    entradas: [
      {
        id: 'ENT-001',
        fecha: '2025-08-25',
        cantidad: 423,
        origen: 'Q-MAYA',
        oc: 'OC0001',
        precio: 6300,
      },
      {
        id: 'ENT-002',
        fecha: '2025-08-25',
        cantidad: 32,
        origen: 'Q-MAYA',
        oc: 'OC0002',
        precio: 5900,
      },
      {
        id: 'ENT-003',
        fecha: '2025-08-25',
        cantidad: 33,
        origen: 'A/X🌶️🦀',
        oc: 'OC0003',
        precio: 6300,
      },
      {
        id: 'ENT-004',
        fecha: '2025-08-30',
        cantidad: 487,
        origen: 'PACMAN',
        oc: 'OC0004',
        precio: 6300,
      },
      {
        id: 'ENT-005',
        fecha: '2025-09-06',
        cantidad: 513,
        origen: 'Q-MAYA',
        oc: 'OC0005',
        precio: 6300,
      },
      {
        id: 'ENT-006',
        fecha: '2025-09-09',
        cantidad: 100,
        origen: 'CH-MONTE',
        oc: 'OC0006',
        precio: 6300,
      },
      {
        id: 'ENT-007',
        fecha: '2025-09-29',
        cantidad: 20,
        origen: 'VALLE-MONTE',
        oc: 'OC0007',
        precio: 7000,
      },
      {
        id: 'ENT-008',
        fecha: '2025-10-05',
        cantidad: 488,
        origen: 'PACMAN',
        oc: 'OC0008',
        precio: 5800,
      },
      {
        id: 'ENT-009',
        fecha: '2025-10-05',
        cantidad: 200,
        origen: 'Q-MAYA-MP',
        oc: 'OC0009',
        precio: 5900,
      },
    ],
    salidas: [
      {
        id: 'SAL-001',
        fecha: '2025-08-26',
        cantidad: 423,
        destino: 'Bódega M-P',
        venta: 'VEN-001',
        precio: 6300,
      },
      {
        id: 'SAL-002',
        fecha: '2025-08-27',
        cantidad: 32,
        destino: 'Valle',
        venta: 'VEN-002',
        precio: 5900,
      },
      {
        id: 'SAL-003',
        fecha: '2025-08-28',
        cantidad: 33,
        destino: 'Ax',
        venta: 'VEN-003',
        precio: 6300,
      },
      {
        id: 'SAL-004',
        fecha: '2025-09-01',
        cantidad: 487,
        destino: 'Tocayo',
        venta: 'VEN-004',
        precio: 6300,
      },
      {
        id: 'SAL-005',
        fecha: '2025-09-07',
        cantidad: 513,
        destino: 'Tio Tocayo',
        venta: 'VEN-005',
        precio: 6300,
      },
      {
        id: 'SAL-006',
        fecha: '2025-09-10',
        cantidad: 100,
        destino: 'Lamas',
        venta: 'VEN-006',
        precio: 6300,
      },
      {
        id: 'SAL-007',
        fecha: '2025-09-30',
        cantidad: 20,
        destino: 'Trámite Chucho',
        venta: 'VEN-007',
        precio: 7000,
      },
      {
        id: 'SAL-008',
        fecha: '2025-10-06',
        cantidad: 488,
        destino: 'Galvan',
        venta: 'VEN-008',
        precio: 6200,
      },
      {
        id: 'SAL-009',
        fecha: '2025-10-21',
        cantidad: 200,
        destino: 'Sierra47',
        venta: 'VEN-009',
        precio: 5900,
      },
    ],
    ubicaciones: {
      principal: { stock: 17, capacidad: 1000 },
      secundario: { stock: 0, capacidad: 500 },
      transito: { stock: 0, capacidad: 100 },
    },
    alertas: [
      {
        tipo: 'critico',
        mensaje: 'Stock crítico: Solo 17 unidades disponibles',
        fecha: new Date().toISOString(),
        prioridad: 'alta',
      },
    ],
  });

  // ⭐ NUEVO - Gastos y Abonos (Lógica del Excel)
  const [gastosAbonos, setGastosAbonos] = useLocalStorage(STORAGE_KEYS.FLOW_GASTOS_ABONOS, []);

  // Estados de búsqueda y filtros
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [filterOptions, setFilterOptions] = useState({
    status: 'todos',
    dateRange: 'todos',
    sortBy: 'reciente',
  });

  // 🎯 ATAJOS DE TECLADO
  useKeyboardShortcuts({
    SEARCH: () => setShowSearchBar(true),
    DASHBOARD: () => setActivePanel('dashboard'),
    ORDERS: () => setActivePanel('ordenes'),
    DISTRIBUTORS: () => setActivePanel('distribuidores'),
    WAREHOUSE: () => setActivePanel('almacen'),
    SALES: () => setActivePanel('ventas'),
    CLIENTS: () => setActivePanel('clientes'),
    BANKS: () => setActivePanel('bancos'),
    REPORTS: () => setActivePanel('reportes'),
    // 🚀 PANELES PREMIUM
    UTILIDADES: () => setActivePanel('utilidades'),
    FLETES: () => setActivePanel('fletes'),
    BOVEDA_MONTE: () => setActivePanel('bovedaMonte'),
    AZTECA: () => setActivePanel('azteca'),
    LEFTIE: () => setActivePanel('leftie'),
    PROFIT: () => setActivePanel('profit'),
    CLIENTES_CARTERA: () => setActivePanel('clientesCartera'),
    // SISTEMA
    TOGGLE_SIDEBAR: () => setIsSidebarOpen(!isSidebarOpen),
    TOGGLE_AI: () => setShowAIWidget(!showAIWidget),
    NOTIFICATIONS: () => setShowNotificationCenter(true),
    HELP: () => setShowKeyboardHelp(true),
    CANCEL: () => {
      setShowSearchBar(false);
      setShowNotificationCenter(false);
      setShowKeyboardHelp(false);
    },
  });

  // Helper optimizado para agregar notificaciones avanzadas
  const addAdvancedNotification = useCallback(
    (config) => {
      notificationSystem.addNotification(config);
    },
    [notificationSystem]
  );

  // 🔔 NOTIFICACIONES AUTOMÁTICAS - OPTIMIZADO
  useEffect(() => {
    const productosStockBajo = (almacen?.stock || []).filter(
      (item) => item.cantidad <= (item.cantidadMinima || 5)
    );

    if (productosStockBajo.length > 0) {
      const lastNotified = localStorage.getItem('last_stock_notification');
      const now = Date.now();
      const oneHour = 60 * 60 * 1000;

      if (!lastNotified || now - Number.parseInt(lastNotified) > oneHour) {
        addAdvancedNotification({
          title: '⚠️ Stock Bajo',
          message: `${productosStockBajo.length} productos necesitan reorden urgente`,
          priority: NOTIFICATION_PRIORITY.HIGH,
          category: NOTIFICATION_CATEGORY.INVENTORY,
          action: {
            label: 'Ver Almacén',
            callback: () => setActivePanel('almacen'),
          },
        });
        localStorage.setItem('last_stock_notification', now.toString());
      }
    }
  }, [almacen?.stock, addAdvancedNotification, setActivePanel]);

  // 🎯 TOUR AUTOMÁTICO PARA NUEVOS USUARIOS - OPTIMIZADO
  useEffect(() => {
    if (!tour.completed && !tour.isActive) {
      const timer = setTimeout(() => {
        tour.start();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [tour.completed, tour.isActive, tour.start]);

  // 🔄 AUTO-INICIALIZACIÓN DE DATOS DEL EXCEL - CRÍTICO
  useEffect(() => {
    const count = inicializarTodosSiVacio();
    if (count > 0) {
      console.log(`✅ FlowDistributor: ${count} paneles inicializados con datos del Excel`);
      // Opcional: Mostrar notificación global
      addAdvancedNotification({
        title: '✅ Datos Cargados',
        message: `${count} paneles inicializados con datos del Excel`,
        priority: NOTIFICATION_PRIORITY.NORMAL,
        category: NOTIFICATION_CATEGORY.SYSTEM,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Solo ejecutar una vez al montar

  // 📦 AUTO-INICIALIZACIÓN DE DISTRIBUIDORES
  useEffect(() => {
    const estado = verificarEstadoDistribuidores();
    if (estado.totalDistribuidores === 0) {
      const resultado = inicializarSistemaDistribuidores();
      if (resultado.success) {
        setDistribuidores(resultado.distribuidores);
        console.log(
          `✅ Distribuidores inicializados: ${resultado.distribuidores.length} distribuidores, ${resultado.ordenes.length} órdenes`
        );
      }
    } else {
      setDistribuidores(estado.distribuidores);
      console.log(`✅ Distribuidores cargados: ${estado.totalDistribuidores} encontrados`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 🎨 BULK SELECTION HOOKS - Para cada entidad
  const productosSelection = useBulkSelection(almacen.stock, 'id');
  const ventasSelection = useBulkSelection(ventas, 'id');
  const clientesSelection = useBulkSelection(clientes, 'id');
  const ordenesSelection = useBulkSelection(ordenesCompra, 'id');
  const distribuidoresSelection = useBulkSelection(distribuidores, 'id');

  // 🎨 BULK ACTIONS HOOKS
  const bulkActionsManager = useBulkActions(
    (result) => {
      showNotification(
        `✓ Operación completada: ${result.successCount} elementos procesados`,
        'success'
      );
      // Limpiar selecciones después de operación exitosa
      productosSelection.clearSelection();
      ventasSelection.clearSelection();
      clientesSelection.clearSelection();
      ordenesSelection.clearSelection();
      distribuidoresSelection.clearSelection();
    },
    (error) => {
      showNotification(`✗ Error en operación masiva: ${error.message}`, 'error');
    }
  );

  // 🎨 DRAG & DROP HOOKS - Reordenamiento con persistencia
  const [productosOrdenados, setProductosOrdenados] = usePersistentOrder(
    'productos',
    almacen.stock
  );
  const dragDropProductos = useDragAndDrop(productosOrdenados, (newOrder) => {
    setProductosOrdenados(newOrder);
    setAlmacen((prev) => ({ ...prev, stock: newOrder }));
    actionHistory.addAction('Reordenar productos', { count: newOrder.length });
    showNotification('Productos reordenados exitosamente', 'success');
  });

  const [ventasOrdenadas, setVentasOrdenadas] = usePersistentOrder('ventas', ventas);
  const dragDropVentas = useDragAndDrop(ventasOrdenadas, (newOrder) => {
    setVentasOrdenadas(newOrder);
    setVentas(newOrder);
    actionHistory.addAction('Reordenar ventas', { count: newOrder.length });
    showNotification('Ventas reordenadas exitosamente', 'success');
  });

  const [clientesOrdenados, setClientesOrdenados] = usePersistentOrder('clientes', clientes);
  const dragDropClientes = useDragAndDrop(clientesOrdenados, (newOrder) => {
    setClientesOrdenados(newOrder);
    setClientes(newOrder);
    actionHistory.addAction('Reordenar clientes', { count: newOrder.length });
    showNotification('Clientes reordenados exitosamente', 'success');
  });

  // Estados de configuración y respaldo
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  // Toggle dark mode (persistence handled by useLocalStorage) - OPTIMIZADO
  const toggleTheme = useCallback(() => {
    setDarkMode((prev) => !prev);
  }, [setDarkMode]);

  // Toast notifications - MEJORADO CON INTEGRACIÓN Y OPTIMIZADO
  const showNotification = useCallback(
    (message, type = 'info') => {
      const id = Date.now();
      setNotifications((prev) => [...prev, { id, message, type }]);
      setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
      }, 3000);

      // También agregar al sistema de notificaciones avanzado
      const priorityMap = {
        success: NOTIFICATION_PRIORITY.LOW,
        error: NOTIFICATION_PRIORITY.HIGH,
        info: NOTIFICATION_PRIORITY.MEDIUM,
      };

      const categoryMap = {
        success: NOTIFICATION_CATEGORY.INFO,
        error: NOTIFICATION_CATEGORY.ALERT,
        info: NOTIFICATION_CATEGORY.SYSTEM,
      };

      const getNotificationTitle = (type) => {
        if (type === 'error') return 'Error';
        if (type === 'success') return 'Éxito';
        return 'Información';
      };

      notificationSystem.addNotification({
        title: getNotificationTitle(type),
        message,
        priority: priorityMap[type] || NOTIFICATION_PRIORITY.MEDIUM,
        category: categoryMap[type] || NOTIFICATION_CATEGORY.SYSTEM,
      });
    },
    [notificationSystem]
  );

  // 🎯 BULK ACTIONS FUNCTIONS - Operaciones masivas
  const handleBulkDeleteProductos = async () => {
    setBulkConfirmAction({
      title: '¿Eliminar productos seleccionados?',
      message: 'Esta acción no se puede deshacer',
      confirmText: 'Eliminar',
      confirmColor: 'red',
      isDangerous: true,
      itemCount: productosSelection.selectedCount,
      onConfirm: async () => {
        const selectedItems = productosSelection.getSelectedItems();
        await bulkActionsManager.bulkDelete(selectedItems, async (item) => {
          // Simular delete con delay
          await new Promise((resolve) => setTimeout(resolve, 100));
          return true;
        });

        // Actualizar almacén
        const newStock = (almacen?.stock || []).filter(
          (p) => !productosSelection.selectedItems.includes(p.id)
        );
        setAlmacen({ ...almacen, stock: newStock });
        setBulkConfirmAction(null);
        actionHistory.addAction(`Eliminar ${selectedItems.length} productos en masa`, {
          items: selectedItems,
        });
      },
      onCancel: () => setBulkConfirmAction(null),
    });
  };

  const handleBulkDeleteVentas = async () => {
    setBulkConfirmAction({
      title: '¿Eliminar ventas seleccionadas?',
      message: 'Esta acción no se puede deshacer',
      confirmText: 'Eliminar',
      confirmColor: 'red',
      isDangerous: true,
      itemCount: ventasSelection.selectedCount,
      onConfirm: async () => {
        const selectedItems = ventasSelection.getSelectedItems();
        await bulkActionsManager.bulkDelete(selectedItems, async () => true);
        setVentas(ventas.filter((v) => !ventasSelection.selectedItems.includes(v.id)));
        setBulkConfirmAction(null);
        actionHistory.addAction(`Eliminar ${selectedItems.length} ventas en masa`, {
          items: selectedItems,
        });
      },
      onCancel: () => setBulkConfirmAction(null),
    });
  };

  const handleBulkDeleteClientes = async () => {
    setBulkConfirmAction({
      title: '¿Eliminar clientes seleccionados?',
      message: 'Esta acción no se puede deshacer',
      confirmText: 'Eliminar',
      confirmColor: 'red',
      isDangerous: true,
      itemCount: clientesSelection.selectedCount,
      onConfirm: async () => {
        const selectedItems = clientesSelection.getSelectedItems();
        await bulkActionsManager.bulkDelete(selectedItems, async () => true);
        setClientes(clientes.filter((c) => !clientesSelection.selectedItems.includes(c.id)));
        setBulkConfirmAction(null);
        actionHistory.addAction(`Eliminar ${selectedItems.length} clientes en masa`, {
          items: selectedItems,
        });
      },
      onCancel: () => setBulkConfirmAction(null),
    });
  };

  const handleBulkExportProductos = async () => {
    const selectedItems = productosSelection.getSelectedItems();
    const dataStr = JSON.stringify(selectedItems, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `productos_export_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    showNotification(`${selectedItems.length} productos exportados exitosamente`, 'success');
    actionHistory.addAction(`Exportar ${selectedItems.length} productos`, {
      count: selectedItems.length,
    });
  };

  // 🗑️ FUNCIONES DE BORRADO INDIVIDUAL CON LÓGICA COMPLETA

  // Borrar una venta y actualizar todas las entidades relacionadas
  const deleteVenta = useCallback(
    (ventaId) => {
      const venta = ventas.find((v) => v.id === ventaId);
      if (!venta) {
        showNotification('Venta no encontrada', 'error');
        return;
      }

      // 1. Revertir salidas de almacén (devolver productos al stock)
      const nuevasSalidas = (almacen?.salidas || []).filter((s) => s.ventaId !== ventaId);
      const salidasEliminadas = (almacen?.salidas || []).filter((s) => s.ventaId === ventaId);

      const nuevoStock = [...(almacen?.stock || [])];
      salidasEliminadas.forEach((salida) => {
        const productoIndex = nuevoStock.findIndex((p) => p.id === salida.productoId);
        if (productoIndex !== -1) {
          nuevoStock[productoIndex] = {
            ...nuevoStock[productoIndex],
            cantidad: (nuevoStock[productoIndex].cantidad || 0) + (salida.cantidad || 0),
          };
        }
      });

      // 2. Actualizar cliente - revertir adeudo y actualizar historial
      if (venta.cliente) {
        const nuevosClientes = clientes.map((c) => {
          if (c.nombre === venta.cliente) {
            // Buscar y eliminar la venta de su historial
            const nuevasVentas = (c.ventas || []).filter((v) => v.id !== ventaId);
            // Revertir adeudo solo si el pago no estaba completo
            const nuevoAdeudo =
              venta.estadoPago !== 'completo'
                ? Math.max(0, (c.adeudo || 0) - (venta.adeudo || 0))
                : c.adeudo;
            return {
              ...c,
              adeudo: nuevoAdeudo,
              ventas: nuevasVentas,
            };
          }
          return c;
        });
        setClientes(nuevosClientes);
      }

      // 3. Revertir movimientos bancarios solo si el pago estaba completo
      if (venta.estadoPago === 'completo') {
        const nuevosBancos = { ...bancos };
        const totalVenta = venta.totalVenta || 0;
        const fletes = venta.fletes || 0;
        const utilidades = venta.utilidades || 0;

        // Revertir en Bóveda Monte
        if (nuevosBancos.bovedaMonte) {
          nuevosBancos.bovedaMonte = {
            ...nuevosBancos.bovedaMonte,
            capitalActual:
              (nuevosBancos.bovedaMonte.capitalActual || 0) - (totalVenta - fletes - utilidades),
            historico:
              (nuevosBancos.bovedaMonte.historico || 0) - (totalVenta - fletes - utilidades),
            registros: (nuevosBancos.bovedaMonte.registros || []).filter(
              (r) => r.ventaId !== ventaId
            ),
          };
        }

        // Revertir en Banco Fletes
        if (nuevosBancos.fletes && fletes > 0) {
          nuevosBancos.fletes = {
            ...nuevosBancos.fletes,
            capitalActual: (nuevosBancos.fletes.capitalActual || 0) - fletes,
            historico: (nuevosBancos.fletes.historico || 0) - fletes,
            ingresos: (nuevosBancos.fletes.ingresos || []).filter((i) => i.ventaId !== ventaId),
          };
        }

        // Revertir en Banco Utilidades
        if (nuevosBancos.utilidades && utilidades > 0) {
          nuevosBancos.utilidades = {
            ...nuevosBancos.utilidades,
            capitalActual: (nuevosBancos.utilidades.capitalActual || 0) - utilidades,
            historico: (nuevosBancos.utilidades.historico || 0) - utilidades,
            ingresos: (nuevosBancos.utilidades.ingresos || []).filter((i) => i.ventaId !== ventaId),
          };
        }

        setBancos(nuevosBancos);
      }

      // 4. Eliminar la venta
      setVentas(ventas.filter((v) => v.id !== ventaId));

      // 5. Actualizar almacén
      setAlmacen({
        ...almacen,
        stock: nuevoStock,
        salidas: nuevasSalidas,
      });

      showNotification('Venta eliminada y datos revertidos correctamente', 'success');
      actionHistory.addAction('Eliminar venta', { ventaId, cliente: venta.cliente });
    },
    [
      ventas,
      almacen,
      clientes,
      bancos,
      showNotification,
      actionHistory,
      setVentas,
      setAlmacen,
      setClientes,
      setBancos,
    ]
  );

  // Borrar una orden de compra y actualizar entidades relacionadas
  const deleteOrdenCompra = useCallback(
    (ordenId) => {
      const orden = ordenesCompra.find((o) => o.id === ordenId);
      if (!orden) {
        showNotification('Orden no encontrada', 'error');
        return;
      }

      // 1. Revertir entradas de almacén (quitar productos del stock)
      const nuevasEntradas = (almacen?.entradas || []).filter((e) => e.ordenId !== ordenId);
      const entradasEliminadas = (almacen?.entradas || []).filter((e) => e.ordenId === ordenId);

      let nuevoStock = [...(almacen?.stock || [])];
      entradasEliminadas.forEach((entrada) => {
        const productoIndex = nuevoStock.findIndex((p) => p.id === entrada.productoId);
        if (productoIndex !== -1) {
          const nuevaCantidad = (nuevoStock[productoIndex].cantidad || 0) - (entrada.cantidad || 0);
          if (nuevaCantidad <= 0) {
            // Si la cantidad queda en 0 o menos, eliminar el producto
            nuevoStock = nuevoStock.filter((p) => p.id !== entrada.productoId);
          } else {
            nuevoStock[productoIndex] = {
              ...nuevoStock[productoIndex],
              cantidad: nuevaCantidad,
            };
          }
        }
      });

      // 2. Actualizar distribuidor (eliminar orden de su historial)
      if (orden.distribuidor) {
        const nuevosDistribuidores = distribuidores.map((d) => {
          if (d.nombre === orden.distribuidor) {
            return {
              ...d,
              ordenes: (d.ordenes || []).filter((o) => o.id !== ordenId),
            };
          }
          return d;
        });
        setDistribuidores(nuevosDistribuidores);
      }

      // 3. Eliminar la orden
      setOrdenesCompra(ordenesCompra.filter((o) => o.id !== ordenId));

      // 4. Actualizar almacén
      setAlmacen({
        ...almacen,
        stock: nuevoStock,
        entradas: nuevasEntradas,
      });

      showNotification('Orden de compra eliminada y datos revertidos correctamente', 'success');
      actionHistory.addAction('Eliminar orden de compra', {
        ordenId,
        distribuidor: orden.distribuidor,
      });
    },
    [
      ordenesCompra,
      almacen,
      distribuidores,
      showNotification,
      actionHistory,
      setOrdenesCompra,
      setAlmacen,
      setDistribuidores,
    ]
  );

  // Borrar un cliente
  const deleteCliente = useCallback(
    (clienteId) => {
      const cliente = clientes.find((c) => c.id === clienteId);
      if (!cliente) {
        showNotification('Cliente no encontrado', 'error');
        return;
      }

      // Verificar si tiene ventas asociadas
      const ventasCliente = ventas.filter((v) => v.cliente === cliente.nombre);
      if (ventasCliente.length > 0) {
        showNotification(
          `No se puede eliminar: el cliente tiene ${ventasCliente.length} venta(s) asociada(s)`,
          'error'
        );
        return;
      }

      setClientes(clientes.filter((c) => c.id !== clienteId));
      showNotification(`Cliente "${cliente.nombre}" eliminado correctamente`, 'success');
      actionHistory.addAction('Eliminar cliente', { clienteId, nombre: cliente.nombre });
    },
    [clientes, ventas, showNotification, actionHistory, setClientes]
  );

  // Borrar un distribuidor
  const deleteDistribuidor = useCallback(
    (distribuidorId) => {
      const distribuidor = distribuidores.find((d) => d.id === distribuidorId);
      if (!distribuidor) {
        showNotification('Distribuidor no encontrado', 'error');
        return;
      }

      // Verificar si tiene órdenes asociadas
      const ordenesDistribuidor = ordenesCompra.filter(
        (o) => o.distribuidor === distribuidor.nombre
      );
      if (ordenesDistribuidor.length > 0) {
        showNotification(
          `No se puede eliminar: el distribuidor tiene ${ordenesDistribuidor.length} orden(es) asociada(s)`,
          'error'
        );
        return;
      }

      setDistribuidores(distribuidores.filter((d) => d.id !== distribuidorId));
      showNotification(`Distribuidor "${distribuidor.nombre}" eliminado correctamente`, 'success');
      actionHistory.addAction('Eliminar distribuidor', {
        distribuidorId,
        nombre: distribuidor.nombre,
      });
    },
    [distribuidores, ordenesCompra, showNotification, actionHistory, setDistribuidores]
  );

  // Borrar un producto del almacén
  const deleteProducto = useCallback(
    (productoId) => {
      const producto = (almacen?.stock || []).find((p) => p.id === productoId);
      if (!producto) {
        showNotification('Producto no encontrado', 'error');
        return;
      }

      // Verificar si está en ventas recientes
      const enVentas = ventas.some((v) =>
        (v.productos || []).some((p) => p.id === productoId || p.nombre === producto.nombre)
      );

      if (enVentas) {
        showNotification('No se puede eliminar: el producto está en ventas registradas', 'error');
        return;
      }

      const nuevoStock = (almacen?.stock || []).filter((p) => p.id !== productoId);
      setAlmacen({ ...almacen, stock: nuevoStock });
      showNotification(`Producto "${producto.nombre}" eliminado correctamente`, 'success');
      actionHistory.addAction('Eliminar producto', { productoId, nombre: producto.nombre });
    },
    [almacen, ventas, showNotification, actionHistory, setAlmacen]
  );

  // Borrar un registro bancario (gasto, ingreso, transferencia)
  const deleteBancoRegistro = useCallback(
    (nombreBanco, tipoRegistro, registroId) => {
      const banco = bancos?.[nombreBanco];
      if (!banco) {
        showNotification('Banco no encontrado', 'error');
        return;
      }

      const nuevosBancos = { ...bancos };
      let montoRevertido = 0;

      if (tipoRegistro === 'gasto') {
        const gasto = (banco.gastos || []).find((g) => g.id === registroId);
        if (gasto) {
          montoRevertido = gasto.monto || 0;
          nuevosBancos[nombreBanco] = {
            ...banco,
            capitalActual: (banco.capitalActual || 0) + montoRevertido,
            gastos: (banco.gastos || []).filter((g) => g.id !== registroId),
          };
        }
      } else if (tipoRegistro === 'ingreso') {
        const ingreso = (banco.ingresos || []).find((i) => i.id === registroId);
        if (ingreso) {
          montoRevertido = ingreso.monto || 0;
          nuevosBancos[nombreBanco] = {
            ...banco,
            capitalActual: (banco.capitalActual || 0) - montoRevertido,
            historico: Math.max(0, (banco.historico || 0) - montoRevertido),
            ingresos: (banco.ingresos || []).filter((i) => i.id !== registroId),
          };
        }
      } else if (tipoRegistro === 'transferencia') {
        const transf = (banco.transferencias || []).find((t) => t.id === registroId);
        if (transf) {
          // Revertir transferencia (más complejo porque afecta dos bancos)
          showNotification('Revertir transferencias aún no implementado', 'warning');
          return;
        }
      }

      setBancos(nuevosBancos);
      showNotification(
        `Registro eliminado y $${montoRevertido.toLocaleString()} revertido`,
        'success'
      );
      actionHistory.addAction('Eliminar registro bancario', {
        nombreBanco,
        tipoRegistro,
        registroId,
      });
    },
    [bancos, showNotification, actionHistory, setBancos]
  );

  // 🧹 FUNCIONES DE LIMPIEZA AUTOMÁTICA

  // Limpiar clientes con adeudo 0 y sin ventas
  const cleanupClientes = useCallback(() => {
    const clientesLimpios = clientes.filter((c) => {
      // Mantener solo si tiene adeudo > 0 o tiene ventas registradas
      return c.adeudo > 0 || (c.ventas && c.ventas.length > 0);
    });

    const clientesEliminados = clientes.length - clientesLimpios.length;
    if (clientesEliminados > 0) {
      setClientes(clientesLimpios);
      showNotification(`${clientesEliminados} cliente(s) sin actividad eliminado(s)`, 'info');
      actionHistory.addAction('Limpieza automática de clientes', { count: clientesEliminados });
    }
  }, [clientes, setClientes, showNotification, actionHistory]);

  // Limpiar distribuidores con adeudo 0 y sin órdenes
  const cleanupDistribuidores = useCallback(() => {
    const distribuidoresLimpios = distribuidores.filter((d) => {
      // Mantener solo si tiene adeudo > 0 o tiene órdenes registradas
      return d.adeudo > 0 || (d.ordenes && d.ordenes.length > 0);
    });

    const distribuidoresEliminados = distribuidores.length - distribuidoresLimpios.length;
    if (distribuidoresEliminados > 0) {
      setDistribuidores(distribuidoresLimpios);
      showNotification(
        `${distribuidoresEliminados} distribuidor(es) sin actividad eliminado(s)`,
        'info'
      );
      actionHistory.addAction('Limpieza automática de distribuidores', {
        count: distribuidoresEliminados,
      });
    }
  }, [distribuidores, setDistribuidores, showNotification, actionHistory]);

  // Ejecutar limpieza automática después de cada borrado
  React.useEffect(() => {
    // Ejecutar limpieza 2 segundos después de cambios en clientes/distribuidores
    const timer = setTimeout(() => {
      const clientesSinActividad = clientes.filter(
        (c) => (c.adeudo === 0 || !c.adeudo) && (!c.ventas || c.ventas.length === 0)
      ).length;

      const distribuidoresSinActividad = distribuidores.filter(
        (d) => (d.adeudo === 0 || !d.adeudo) && (!d.ordenes || d.ordenes.length === 0)
      ).length;

      if (clientesSinActividad > 0 || distribuidoresSinActividad > 0) {
        // Auto-cleanup está disponible pero no lo ejecutamos automáticamente
        // El usuario puede hacerlo manualmente
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [clientes, distribuidores]);

  const handleBulkExportVentas = async () => {
    const selectedItems = ventasSelection.getSelectedItems();
    const dataStr = JSON.stringify(selectedItems, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ventas_export_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    showNotification(`${selectedItems.length} ventas exportadas exitosamente`, 'success');
    actionHistory.addAction(`Exportar ${selectedItems.length} ventas`, {
      count: selectedItems.length,
    });
  };

  const handleBulkExportClientes = async () => {
    const selectedItems = clientesSelection.getSelectedItems();
    const dataStr = JSON.stringify(selectedItems, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `clientes_export_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    showNotification(`${selectedItems.length} clientes exportados exitosamente`, 'success');
    actionHistory.addAction(`Exportar ${selectedItems.length} clientes`, {
      count: selectedItems.length,
    });
  };

  // AI Widget Handlers
  // AI CONVERSACIONAL REVOLUCIONARIA CON PERSONALIDAD Y CONTEXTO
  // ========================================
  // ⭐ FUNCIONES DE LÓGICA DE NEGOCIO DEL EXCEL
  // ========================================

  /**
   * Calcula el adeudo REAL de un cliente según lógica del Excel:
   * Adeudo = Ventas Pendientes - Abonos Realizados
   */
  const calcularAdeudoCliente = useCallback(
    (nombreCliente) => {
      // PASO 1: Sumar ventas pendientes
      const ventasPendientes = ventas
        .filter((v) => v.cliente === nombreCliente && v.estatus === 'Pendiente')
        .reduce((sum, v) => sum + (v.totalVenta || 0), 0);

      // PASO 2: Sumar abonos realizados
      const abonosRealizados = gastosAbonos
        .filter((g) => g.tipo === 'abono' && g.origenGastoOAbono === nombreCliente)
        .reduce((sum, g) => sum + (g.valor || 0), 0);

      // PASO 3: Calcular adeudo neto
      const adeudoNeto = ventasPendientes - abonosRealizados;

      return adeudoNeto;
    },
    [ventas, gastosAbonos]
  );

  /**
   * Marca una venta como PAGADA y acredita el monto al banco seleccionado
   */
  const marcarVentaPagada = useCallback(
    (ventaId, bancoDestino) => {
      const venta = ventas.find((v) => v.id === ventaId);

      if (!venta) {
        showNotification('Venta no encontrada', 'error');
        return;
      }

      if (venta.estatus === 'Pagado') {
        showNotification('Esta venta ya está marcada como pagada', 'warning');
        return;
      }

      // Actualizar venta
      setVentas(
        ventas.map((v) =>
          v.id === ventaId
            ? {
                ...v,
                estatus: 'Pagado',
                estadoPago: 'completo',
                adeudo: 0,
                fechaPago: new Date().toISOString(),
              }
            : v
        )
      );

      // Acreditar a banco
      const banco = bancos[bancoDestino];
      if (!banco) {
        showNotification('Banco no encontrado', 'error');
        return;
      }

      const nuevoRegistro = {
        id: `ING-${bancoDestino}-${Date.now()}`,
        fecha: new Date().toISOString(),
        cliente: venta.cliente,
        monto: venta.totalVenta,
        concepto: `Venta pagada: ${venta.cliente} - ${venta.concepto || ''}`,
        tipo: 'Ingreso',
      };

      setBancos({
        ...bancos,
        [bancoDestino]: {
          ...banco,
          capitalActual: banco.capitalActual + venta.totalVenta,
          registros: [...(banco.registros || []), nuevoRegistro],
          ingresos: [...(banco.ingresos || []), nuevoRegistro],
        },
      });

      // Registrar en historial de acciones
      actionHistory.addAction('Venta marcada como pagada', {
        ventaId,
        banco: bancoDestino,
        monto: venta.totalVenta,
        cliente: venta.cliente,
      });

      showNotification(
        `✅ Venta marcada como PAGADA. $${venta.totalVenta.toLocaleString()} ingresado a ${banco.nombre}`,
        'success'
      );
    },
    [ventas, bancos, actionHistory, showNotification, setVentas, setBancos]
  );

  /**
   * Registra un abono de cliente (reduce adeudo pero NO marca ventas como pagadas)
   */
  const registrarAbono = useCallback(
    (cliente, monto, bancoDestino, observaciones = '') => {
      if (!cliente || monto <= 0) {
        showNotification('Datos de abono inválidos', 'error');
        return;
      }

      const banco = bancos[bancoDestino];
      if (!banco) {
        showNotification('Banco no encontrado', 'error');
        return;
      }

      // Crear registro de abono
      const nuevoAbono = {
        id: `ABONO-${Date.now()}`,
        fecha: new Date().toISOString(),
        tipo: 'abono',
        origenGastoOAbono: cliente,
        valor: monto,
        destino: bancoDestino,
        observaciones: observaciones || `Abono de ${cliente}`,
      };

      setGastosAbonos([...gastosAbonos, nuevoAbono]);

      // Acreditar a banco
      const nuevoRegistro = {
        id: `ING-${bancoDestino}-${Date.now()}`,
        fecha: new Date().toISOString(),
        cliente: cliente,
        monto: monto,
        concepto: `Abono de ${cliente}${observaciones ? ` - ${observaciones}` : ''}`,
        tipo: 'Ingreso',
      };

      setBancos({
        ...bancos,
        [bancoDestino]: {
          ...banco,
          capitalActual: banco.capitalActual + monto,
          registros: [...(banco.registros || []), nuevoRegistro],
          ingresos: [...(banco.ingresos || []), nuevoRegistro],
        },
      });

      // Registrar en historial
      actionHistory.addAction('Abono registrado', {
        cliente,
        monto,
        banco: bancoDestino,
      });

      showNotification(
        `✅ Abono de $${monto.toLocaleString()} registrado para ${cliente}. Nuevo adeudo: $${calcularAdeudoCliente(cliente).toLocaleString()}`,
        'success'
      );
    },
    [
      gastosAbonos,
      bancos,
      actionHistory,
      showNotification,
      setGastosAbonos,
      setBancos,
      calcularAdeudoCliente,
    ]
  );

  /**
   * Registra un gasto operativo (reduce capital del banco)
   */
  const registrarGasto = useCallback(
    (concepto, monto, bancoOrigen, observaciones = '') => {
      if (!concepto || monto <= 0) {
        showNotification('Datos de gasto inválidos', 'error');
        return;
      }

      const banco = bancos[bancoOrigen];
      if (!banco) {
        showNotification('Banco no encontrado', 'error');
        return;
      }

      if (banco.capitalActual < monto) {
        showNotification('Fondos insuficientes en el banco', 'error');
        return;
      }

      // Crear registro de gasto
      const nuevoGasto = {
        id: `GASTO-${Date.now()}`,
        fecha: new Date().toISOString(),
        tipo: 'gasto',
        origenGastoOAbono: concepto,
        valor: monto,
        destino: bancoOrigen,
        observaciones: observaciones,
      };

      setGastosAbonos([...gastosAbonos, nuevoGasto]);

      // Debitar del banco
      const nuevoRegistro = {
        id: `EGR-${bancoOrigen}-${Date.now()}`,
        fecha: new Date().toISOString(),
        cliente: concepto,
        monto: monto,
        concepto: `Gasto: ${concepto}${observaciones ? ` - ${observaciones}` : ''}`,
        tipo: 'Egreso',
      };

      setBancos({
        ...bancos,
        [bancoOrigen]: {
          ...banco,
          capitalActual: banco.capitalActual - monto,
          registros: [...(banco.registros || []), nuevoRegistro],
          gastos: [...(banco.gastos || []), nuevoRegistro],
        },
      });

      // Registrar en historial
      actionHistory.addAction('Gasto registrado', {
        concepto,
        monto,
        banco: bancoOrigen,
      });

      showNotification(
        `✅ Gasto de $${monto.toLocaleString()} registrado. Nuevo capital en ${banco.nombre}: $${(banco.capitalActual - monto).toLocaleString()}`,
        'success'
      );
    },
    [gastosAbonos, bancos, actionHistory, showNotification, setGastosAbonos, setBancos]
  );

  /**
   * Transfiere dinero entre bancos
   */
  const transferirEntreBancos = useCallback(
    (bancoOrigenKey, bancoDestinoKey, monto, concepto = '') => {
      if (!bancoOrigenKey || !bancoDestinoKey || monto <= 0) {
        showNotification('Datos de transferencia inválidos', 'error');
        return;
      }

      if (bancoOrigenKey === bancoDestinoKey) {
        showNotification('No puedes transferir al mismo banco', 'error');
        return;
      }

      const bancoOrigen = bancos[bancoOrigenKey];
      const bancoDestino = bancos[bancoDestinoKey];

      if (!bancoOrigen || !bancoDestino) {
        showNotification('Banco no encontrado', 'error');
        return;
      }

      if (bancoOrigen.capitalActual < monto) {
        showNotification('Fondos insuficientes en el banco origen', 'error');
        return;
      }

      const timestamp = Date.now();

      // Crear registro de transferencia
      const nuevaTransferencia = {
        id: `TRANS-${timestamp}`,
        fecha: new Date().toISOString(),
        tipo: 'transferencia',
        origen: bancoOrigenKey,
        destino: bancoDestinoKey,
        monto: monto,
        concepto: concepto || `Transferencia de ${bancoOrigen.nombre} a ${bancoDestino.nombre}`,
      };

      setGastosAbonos([...gastosAbonos, nuevaTransferencia]);

      // Egreso en banco origen
      const egresoOrigen = {
        id: `TRANS-OUT-${timestamp}`,
        fecha: new Date().toISOString(),
        monto: monto,
        concepto: `Transferencia a ${bancoDestino.nombre}${concepto ? `: ${concepto}` : ''}`,
        tipo: 'Egreso',
        relacionadoCon: bancoDestinoKey,
      };

      // Ingreso en banco destino
      const ingresoDestino = {
        id: `TRANS-IN-${timestamp}`,
        fecha: new Date().toISOString(),
        monto: monto,
        concepto: `Transferencia desde ${bancoOrigen.nombre}${concepto ? `: ${concepto}` : ''}`,
        tipo: 'Ingreso',
        relacionadoCon: bancoOrigenKey,
      };

      // Actualizar bancos
      setBancos({
        ...bancos,
        [bancoOrigenKey]: {
          ...bancoOrigen,
          capitalActual: bancoOrigen.capitalActual - monto,
          registros: [...(bancoOrigen.registros || []), egresoOrigen],
          gastos: [...(bancoOrigen.gastos || []), egresoOrigen],
          transferencias: [...(bancoOrigen.transferencias || []), nuevaTransferencia],
        },
        [bancoDestinoKey]: {
          ...bancoDestino,
          capitalActual: bancoDestino.capitalActual + monto,
          registros: [...(bancoDestino.registros || []), ingresoDestino],
          ingresos: [...(bancoDestino.ingresos || []), ingresoDestino],
          transferencias: [...(bancoDestino.transferencias || []), nuevaTransferencia],
        },
      });

      // Registrar en historial
      actionHistory.addAction('Transferencia realizada', {
        origen: bancoOrigenKey,
        destino: bancoDestinoKey,
        monto,
      });

      showNotification(
        `✅ Transferencia de $${monto.toLocaleString()} completada: ${bancoOrigen.nombre} → ${bancoDestino.nombre}`,
        'success'
      );
    },
    [gastosAbonos, bancos, actionHistory, showNotification, setGastosAbonos, setBancos]
  );

  // ========================================
  // FIN DE FUNCIONES DE LÓGICA DEL EXCEL
  // ========================================

  const handleAISend = () => {
    if (!aiInput.trim()) return;
    const userMessage = aiInput.toLowerCase();
    const messageTime = new Date().toLocaleTimeString('es-MX', {
      hour: '2-digit',
      minute: '2-digit',
    });

    setAiMessages([...aiMessages, { type: 'user', text: aiInput, time: messageTime }]);
    setAiConversationContext([...aiConversationContext, { role: 'user', message: userMessage }]);

    // Simular "typing indicator"
    setAiMessages((prev) => [...prev, { type: 'typing', text: '...' }]);

    setTimeout(
      () => {
        let aiResponse = '';
        let suggestedActions = [];
        let quickReplies = [];

        // ANÁLISIS CONVERSACIONAL AVANZADO CON CONTEXTO
        const totalBancos = Object.values(bancos || {}).reduce(
          (sum, b) => sum + (b?.capitalActual || 0),
          0
        );
        const totalIngresos = (ventas || []).reduce((sum, v) => sum + (v?.totalVenta || 0), 0);
        const totalEgresos = (ordenesCompra || []).reduce((sum, o) => sum + (o?.total || 0), 0);
        const gananciaTotal = (totalIngresos || 0) - (totalEgresos || 0);
        const productosStockBajo = (almacen?.stock || []).filter(
          (item) => (item?.cantidad || 0) <= (item?.cantidadMinima || 5)
        ).length;
        const adeudosClientes = (clientes || []).reduce((sum, c) => sum + (c?.adeudo || 0), 0);
        const adeudosDistribuidores = (distribuidores || []).reduce(
          (sum, d) => sum + (d?.adeudo || 0),
          0
        );

        // Detectar último tema de conversación
        const lastContext = aiConversationContext.slice(-3);
        const _isFollowUp = lastContext.some(
          (ctx) =>
            ctx.message.includes('más') ||
            ctx.message.includes('detalle') ||
            ctx.message.includes('específic')
        );

        // SALUDOS Y PRESENTACIÓN
        const greetingPattern = /^(hola|hey|buenas|buenos días|buenas tardes|hi|hello)/;
        if (greetingPattern.test(userMessage)) {
          const greetings = [
            `¡Hola! 👋 Soy Flow, tu asistente inteligente. Acabo de revisar tus números y todo se ve ${
              gananciaTotal > 0 ? '¡excelente! 📈' : 'interesante 🤔'
            }`,
            `¡Hey! 😊 Flow aquí, listo para ayudarte. Vi que tienes $${totalBancos.toLocaleString()} en bancos. ¿En qué puedo asistirte hoy?`,
            `¡Qué tal! 🚀 Soy Flow, tu copiloto de negocios. ${
              productosStockBajo > 0
                ? `⚠️ Noté que ${productosStockBajo} productos necesitan reorden.`
                : '✨ Todo está bajo control.'
            } ¿Qué necesitas?`,
          ];
          aiResponse = greetings[Math.floor(Math.random() * greetings.length)];
          quickReplies = [
            '📊 Ver resumen',
            '💰 Estado financiero',
            '📦 Revisar inventario',
            '🎯 Sugerencias',
          ];
        }

        // ANÁLISIS INTELIGENTE DE FINANZAS
        else if (
          userMessage.includes('banco') ||
          userMessage.includes('capital') ||
          userMessage.includes('saldo') ||
          userMessage.includes('dinero')
        ) {
          const topBancos = Object.entries(bancos)
            .sort(([, a], [, b]) => b.capitalActual - a.capitalActual)
            .slice(0, 3);

          const nombres = {
            bovedaMonte: 'Bóveda Monte 🏦',
            utilidades: 'Utilidades 💎',
            fletes: 'Fletes 🚚',
            azteca: 'Azteca 🏛️',
            leftie: 'Leftie 🎯',
            profit: 'Profit 💰',
          };

          if (totalBancos > 100000) {
            aiResponse = `¡Impresionante! 💪 Tienes un capital sólido de $${totalBancos.toLocaleString()} distribuido estratégicamente:\n\n`;
          } else if (totalBancos > 50000) {
            aiResponse = `Bien hecho 👍 Mantienes $${totalBancos.toLocaleString()} en liquidez. Aquí está la distribución:\n\n`;
          } else {
            aiResponse = `Tu capital actual es de $${totalBancos.toLocaleString()}. Te recomendaría aumentar reservas. Distribución:\n\n`;
          }

          topBancos.forEach(([key, banco], i) => {
            const percentage = (((banco?.capitalActual || 0) / totalBancos) * 100).toFixed(1);
            aiResponse += `${i === 0 ? '🥇' : i === 1 ? '🥈' : '🥉'} ${
              nombres[key]
            }: $${(banco?.capitalActual || 0).toLocaleString()} (${percentage}%)\n`;
          });

          suggestedActions = ['Ver todos los bancos', 'Hacer transferencia', 'Registrar ingreso'];
          quickReplies = ['💸 Hacer transferencia', '📊 Ver detalles', '💡 Consejos financieros'];
        }

        // VENTAS Y RENDIMIENTO
        else if (
          userMessage.includes('venta') ||
          userMessage.includes('ingreso') ||
          userMessage.includes('ganancia')
        ) {
          const tasaCrecimiento =
            totalIngresos > 0
              ? (((totalIngresos - totalEgresos) / totalIngresos) * 100).toFixed(1)
              : 0;
          const promedioVenta = ventas.length > 0 ? (totalIngresos / ventas.length).toFixed(0) : 0;

          if (gananciaTotal > 50000) {
            aiResponse = `¡Excelente desempeño! 🎉\n\n`;
          } else if (gananciaTotal > 0) {
            aiResponse = `Vamos bien 📈 Aquí está tu análisis:\n\n`;
          } else {
            aiResponse = `Necesitamos revisar la estrategia 🤔\n\n`;
          }

          aiResponse += `💰 Total de Ventas: ${ventas.length} operaciones\n`;
          aiResponse += `💵 Ingresos: $${totalIngresos.toLocaleString()}\n`;
          aiResponse += `💸 Egresos: $${totalEgresos.toLocaleString()}\n`;
          aiResponse += `✨ Ganancia Neta: $${gananciaTotal.toLocaleString()}\n`;
          aiResponse += `📊 Margen: ${tasaCrecimiento}%\n`;
          aiResponse += `🎯 Ticket Promedio: $${promedioVenta.toLocaleString()}\n\n`;

          if (gananciaTotal > 0) {
            aiResponse += `💡 Consejo: Tu margen es saludable. Considera reinvertir en productos de alto movimiento.`;
          } else {
            aiResponse += `⚠️ Alerta: Los egresos superan ingresos. Te sugiero revisar costos y estrategia de precios.`;
          }

          suggestedActions = ['Nueva venta', 'Ver gráficos', 'Exportar reporte'];
          quickReplies = ['📈 Ver tendencias', '🎯 Top productos', '💡 Estrategias'];
        }

        // CLIENTES CON INTELIGENCIA
        else if (userMessage.includes('cliente')) {
          const clientesConAdeudo = clientes.filter((c) => c.adeudo > 0);
          const topDeudores = clientesConAdeudo.sort((a, b) => b.adeudo - a.adeudo).slice(0, 3);

          if (clientesConAdeudo.length === 0) {
            aiResponse = `¡Perfecto! 🎊 Todos tus ${clientes.length} clientes están al corriente. Excelente gestión de cobranza.\n\n`;
            aiResponse += `💡 Sugerencia: Aprovecha para ofrecer promociones y fidelizarlos aún más.`;
            quickReplies = ['➕ Agregar cliente', '📊 Ver análisis', '🎁 Crear promoción'];
          } else {
            aiResponse = `Tienes ${clientes.length} clientes registrados.\n\n`;
            aiResponse += `⚠️ ${
              clientesConAdeudo.length
            } con adeudos pendientes por $${adeudosClientes.toLocaleString()}:\n\n`;

            topDeudores.forEach((cliente, i) => {
              aiResponse += `${i + 1}. ${cliente.nombre}: $${cliente.adeudo.toLocaleString()}\n`;
            });

            aiResponse += `\n💡 Te recomiendo priorizar la cobranza con ${
              topDeudores[0]?.nombre || 'estos clientes'
            }.`;
            quickReplies = ['📞 Enviar recordatorio', '💵 Registrar pago', '📋 Ver todos'];
          }

          suggestedActions = ['Registrar pago', 'Ver historial', 'Agregar cliente'];
        }

        // INVENTARIO Y ALMACÉN INTELIGENTE
        else if (
          userMessage.includes('almacen') ||
          userMessage.includes('stock') ||
          userMessage.includes('inventario') ||
          userMessage.includes('producto')
        ) {
          const valorTotalInventario = (almacen?.stock || []).reduce(
            (sum, p) => sum + p.cantidad * (p.precioVenta || 0),
            0
          );
          const productosAgotados = (almacen?.stock || []).filter((p) => p.cantidad === 0).length;

          aiResponse = `📦 Estado del Almacén:\n\n`;
          aiResponse += `✅ Productos en stock: ${(almacen?.stock || []).length}\n`;
          aiResponse += `💰 Valor del inventario: $${valorTotalInventario.toLocaleString()}\n`;

          if (productosStockBajo > 0) {
            aiResponse += `⚠️ Productos con stock bajo: ${productosStockBajo}\n`;
            const productosCriticos = almacen.stock
              .filter((p) => p.cantidad <= (p.cantidadMinima || 5))
              .slice(0, 3);
            aiResponse += `\n🚨 Requieren reorden urgente:\n`;
            productosCriticos.forEach((p) => {
              aiResponse += `• ${p.nombre}: ${p.cantidad} unidades (mín: ${p.cantidadMinima || 5})\n`;
            });
          }

          if (productosAgotados > 0) {
            aiResponse += `❌ Productos agotados: ${productosAgotados}\n`;
          }

          if (productosStockBajo === 0 && productosAgotados === 0) {
            aiResponse += `\n✨ ¡Excelente! Todo el inventario está en niveles óptimos.`;
          } else {
            aiResponse += `\n💡 Sugiero crear órdenes de compra para los productos críticos.`;
          }

          suggestedActions = ['Crear orden de compra', 'Ver productos', 'Ajustar mínimos'];
          quickReplies = ['📋 Crear orden', '📊 Ver análisis', '🔔 Configurar alertas'];
        }

        // DISTRIBUIDORES Y PROVEEDORES
        else if (userMessage.includes('distribuidor') || userMessage.includes('proveedor')) {
          const distConAdeudo = distribuidores.filter((d) => d.adeudo > 0);

          if (distConAdeudo.length === 0) {
            aiResponse = `👍 Excelente relación con proveedores!\n\n`;
            aiResponse += `Tienes ${distribuidores.length} distribuidores registrados, todos al corriente.\n\n`;
            aiResponse += `💡 Mantén esta buena relación para negociar mejores términos.`;
          } else {
            aiResponse = `📊 Análisis de Distribuidores:\n\n`;
            aiResponse += `Total registrados: ${distribuidores.length}\n`;
            aiResponse += `⚠️ Con adeudos: ${distConAdeudo.length}\n`;
            aiResponse += `💸 Adeudo total: $${adeudosDistribuidores.toLocaleString()}\n\n`;

            const topAdeudos = distConAdeudo.sort((a, b) => b.adeudo - a.adeudo).slice(0, 3);

            aiResponse += `Mayores adeudos:\n`;
            topAdeudos.forEach((d, i) => {
              aiResponse += `${i + 1}. ${d.nombre}: $${d.adeudo.toLocaleString()}\n`;
            });

            aiResponse += `\n💡 Programa pagos para mantener buenas relaciones comerciales.`;
          }

          suggestedActions = ['Registrar pago', 'Nueva orden', 'Ver historial'];
          quickReplies = ['💵 Pagar adeudo', '📦 Nueva orden', '📊 Ver detalles'];
        }

        // ÓRDENES DE COMPRA
        else if (userMessage.includes('orden') || userMessage.includes('compra')) {
          const ordenesRecientes = (ordenesCompra || []).slice(-5);
          const totalOrdenes = (ordenesCompra || []).reduce((sum, o) => sum + (o?.total || 0), 0);

          aiResponse = `📦 Gestión de Órdenes de Compra:\n\n`;
          aiResponse += `📋 Total de órdenes: ${ordenesCompra.length}\n`;
          aiResponse += `💰 Inversión total: $${totalOrdenes.toLocaleString()}\n\n`;

          if (ordenesRecientes.length > 0) {
            aiResponse += `Últimas órdenes:\n`;
            ordenesRecientes.reverse().forEach((orden, i) => {
              aiResponse += `${i + 1}. ${orden.proveedor || 'Proveedor'} - $${(
                orden.total || 0
              ).toLocaleString()}\n`;
            });
            aiResponse += `\n💡 Tip: Revisa el estado de estas órdenes en el panel correspondiente.`;
          } else {
            aiResponse += `📝 No hay órdenes registradas aún.\n\n`;
            aiResponse += `💡 Crea tu primera orden desde el panel de Órdenes de Compra.`;
          }

          suggestedActions = ['Nueva orden', 'Ver órdenes', 'Consultar distribuidor'];
          quickReplies = ['➕ Nueva orden', '📊 Ver todas', '🔍 Buscar'];
        }

        // REPORTES Y ANÁLISIS
        else if (
          userMessage.includes('reporte') ||
          userMessage.includes('estadística') ||
          userMessage.includes('análisis') ||
          userMessage.includes('gráfico')
        ) {
          aiResponse = `📊 Centro de Inteligencia de Negocio:\n\n`;
          aiResponse += `Puedo generar reportes avanzados sobre:\n\n`;
          aiResponse += `💰 Financiero:\n`;
          aiResponse += `• Flujo de efectivo\n`;
          aiResponse += `• Estado de resultados\n`;
          aiResponse += `• Proyecciones de ganancia\n\n`;
          aiResponse += `📦 Inventario:\n`;
          aiResponse += `• Rotación de productos\n`;
          aiResponse += `• Valor del inventario\n`;
          aiResponse += `• Productos más rentables\n\n`;
          aiResponse += `👥 Comercial:\n`;
          aiResponse += `• Performance de ventas\n`;
          aiResponse += `• Análisis de clientes\n`;
          aiResponse += `• Tendencias de mercado\n\n`;
          aiResponse += `💡 Todos los reportes incluyen gráficos interactivos y pueden exportarse a PDF/Excel.`;

          suggestedActions = ['Ver reportes', 'Exportar datos', 'Configurar análisis'];
          quickReplies = ['📈 Reporte financiero', '📦 Reporte inventario', '👥 Reporte clientes'];
        }

        // AYUDA Y CAPACIDADES
        else if (
          userMessage.includes('ayuda') ||
          userMessage.includes('qué puedes') ||
          userMessage.includes('cómo funciona')
        ) {
          aiResponse = `🤖 Soy Flow, tu asistente inteligente revolucionario. Mis capacidades incluyen:\n\n`;
          aiResponse += `🧠 Análisis Inteligente:\n`;
          aiResponse += `• Interpreto datos financieros en tiempo real\n`;
          aiResponse += `• Detecto patrones y anomalías\n`;
          aiResponse += `• Sugiero acciones basadas en tu situación\n\n`;
          aiResponse += `� Conversación Natural:\n`;
          aiResponse += `• Entiendo preguntas en lenguaje cotidiano\n`;
          aiResponse += `• Mantengo contexto de la conversación\n`;
          aiResponse += `• Aprendo de tus preferencias\n\n`;
          aiResponse += `⚡ Acciones Rápidas:\n`;
          aiResponse += `• Navego entre secciones\n`;
          aiResponse += `• Creo recordatorios y alertas\n`;
          aiResponse += `• Genero reportes instantáneos\n\n`;
          aiResponse += `🎯 Solo pregúntame lo que necesites en lenguaje natural!`;

          quickReplies = [
            '💰 Estado financiero',
            '📦 Ver inventario',
            '📊 Reportes',
            '🚀 Tour guiado',
          ];
        }

        // NAVEGACIÓN INTELIGENTE
        else if (
          userMessage.includes('ir a') ||
          userMessage.includes('abrir') ||
          userMessage.includes('mostrar') ||
          userMessage.includes('ver')
        ) {
          const panelMap = {
            dashboard: 'dashboard',
            inicio: 'dashboard',
            principal: 'dashboard',
            orden: 'ordenes',
            compra: 'ordenes',
            distribuidor: 'distribuidores',
            proveedor: 'distribuidores',
            almacen: 'almacen',
            inventario: 'almacen',
            stock: 'almacen',
            producto: 'almacen',
            venta: 'ventas',
            cliente: 'clientes',
            banco: 'bancos',
            dinero: 'bancos',
            capital: 'bancos',
            reporte: 'reportes',
            estadística: 'reportes',
            gráfico: 'reportes',
          };

          let targetPanel = null;
          for (const [keyword, panel] of Object.entries(panelMap)) {
            if (userMessage.includes(keyword)) {
              targetPanel = panel;
              break;
            }
          }

          if (targetPanel) {
            setActivePanel(targetPanel);
            const panelNames = {
              dashboard: 'Dashboard Principal',
              ordenes: 'Órdenes de Compra',
              distribuidores: 'Distribuidores',
              almacen: 'Almacén',
              ventas: 'Ventas',
              clientes: 'Clientes',
              bancos: 'Sistema Bancario',
              reportes: 'Reportes y Análisis',
            };
            aiResponse = `✅ Perfecto! Te llevo a ${panelNames[targetPanel]} 🚀\n\n¿Hay algo específico que quieras hacer ahí?`;
            quickReplies = ['Ver resumen', 'Crear nuevo', 'Buscar'];
          } else {
            aiResponse = `Los paneles disponibles son:\n\n`;
            aiResponse += `📊 Dashboard\n📦 Órdenes de Compra\n👥 Distribuidores\n`;
            aiResponse += `🏪 Almacén\n💰 Ventas\n👤 Clientes\n🏦 Bancos\n📈 Reportes\n\n`;
            aiResponse += `¿A cuál te gustaría ir?`;
          }
        }

        // ACCIONES PROACTIVAS
        else if (
          userMessage.includes('consejo') ||
          userMessage.includes('sugerencia') ||
          userMessage.includes('recomendación')
        ) {
          aiResponse = `💡 Análisis y Recomendaciones Personalizadas:\n\n`;

          const insights = [];
          if (productosStockBajo > 0) {
            insights.push(
              `⚠️ URGENTE: ${productosStockBajo} productos necesitan reorden para evitar desabasto.`
            );
          }
          if (gananciaTotal < 0) {
            insights.push(
              `📉 Los egresos superan ingresos. Revisa costos y ajusta precios de venta.`
            );
          }
          if (adeudosClientes > totalBancos * 0.3) {
            insights.push(
              `💸 Las cuentas por cobrar representan más del 30% de tu capital. Intensifica la cobranza.`
            );
          }
          if (totalBancos < 20000) {
            insights.push(`🏦 El capital es bajo. Considera aumentar reservas para contingencias.`);
          }
          if (ventas.length < 10) {
            insights.push(
              `📈 Pocas ventas registradas. Enfócate en estrategias de marketing y adquisición.`
            );
          }
          if (insights.length === 0) {
            insights.push(`✨ ¡Tu negocio está en excelente forma! Sigue así.`);
            insights.push(`💡 Considera reinvertir ganancias en diversificar inventario.`);
            insights.push(`🎯 Implementa programas de fidelización para tus mejores clientes.`);
          }

          insights.forEach((insight, i) => {
            aiResponse += `${i + 1}. ${insight}\n\n`;
          });

          quickReplies = ['📊 Ver detalles', '✅ Aplicar sugerencia', '💬 Más consejos'];
        }

        // RESPUESTA GENÉRICA INTELIGENTE
        else {
          const responses = [
            `Interesante pregunta 🤔 Puedo ayudarte mejor si me das más detalles. ¿Te refieres a bancos, ventas, inventario o clientes?`,
            `Hmm, no estoy seguro de entender completamente. ¿Podrías reformular tu pregunta? Puedo ayudarte con finanzas, inventario, ventas y más.`,
            `🤖 Todavía estoy aprendiendo! Intenta preguntarme sobre:\n• Estado financiero\n• Inventario\n• Ventas y clientes\n• Reportes y análisis`,
            `💬 No capté eso del todo. Soy experto en:\n💰 Bancos y finanzas\n📦 Inventario y almacén\n📈 Ventas y reportes\n👥 Clientes y distribuidores\n\n¿Sobre qué quieres saber?`,
          ];
          aiResponse = responses[Math.floor(Math.random() * responses.length)];
          quickReplies = ['💰 Finanzas', '📦 Inventario', '📊 Reportes', '❓ Ayuda'];
        }

        // Remover typing indicator y agregar respuesta
        setAiMessages((prev) => {
          const filtered = prev.filter((m) => m.type !== 'typing');
          return [
            ...filtered,
            {
              type: 'ai',
              text: aiResponse,
              time: new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' }),
              quickReplies,
              suggestedActions,
            },
          ];
        });

        // Actualizar contexto
        setAiConversationContext((prev) => [...prev, { role: 'ai', message: aiResponse }]);
      },
      1200 + Math.random() * 800
    ); // Delay variable para simular "pensamiento"

    setAiInput('');
  };

  // Backup/Restore Functions
  const createBackup = () => {
    const backupData = {
      version: '3.0.0',
      fecha: new Date().toISOString(),
      datos: {
        bancos,
        ordenesCompra,
        distribuidores,
        ventas,
        clientes,
        almacen,
      },
    };

    const dataStr = JSON.stringify(backupData, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `flowdistributor-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);

    showNotification('Respaldo creado exitosamente', 'success');
  };

  const restoreBackup = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      const text = await file.text();
      const backupData = JSON.parse(text);

      if (!backupData.datos) {
        showNotification('Archivo de respaldo inválido', 'error');
        return;
      }

      // Restaurar todos los datos
      if (backupData.datos.bancos) setBancos(backupData.datos.bancos);
      if (backupData.datos.ordenesCompra) setOrdenesCompra(backupData.datos.ordenesCompra);
      if (backupData.datos.distribuidores) setDistribuidores(backupData.datos.distribuidores);
      if (backupData.datos.ventas) setVentas(backupData.datos.ventas);
      if (backupData.datos.clientes) setClientes(backupData.datos.clientes);
      if (backupData.datos.almacen) setAlmacen(backupData.datos.almacen);

      showNotification('Datos restaurados exitosamente', 'success');
      setShowSettingsModal(false);
    } catch (error) {
      // console.error('Error al restaurar respaldo:', error);
      showNotification('Error al restaurar el respaldo', 'error');
    }
  };

  // Función para importar desde Excel con validación enterprise
  const importFromExcel = async () => {
    // 1. Confirmación inicial
    const confirmImport = confirm(
      '📊 IMPORTAR DATOS DESDE EXCEL (ENTERPRISE MODE)\n\n' +
        'Se realizará una validación profunda en 3 capas:\n' +
        '✓ Validación de tipos de datos (Zod)\n' +
        '✓ Validación de lógica de negocio\n' +
        '✓ Validación de consistencia cruzada\n\n' +
        'Datos esperados:\n' +
        '• ~83 Ventas\n' +
        '• ~29 Clientes\n' +
        '• ~9 Órdenes de Compra\n' +
        '• ~6 Distribuidores\n' +
        '• ~9 Entradas + ~80 Salidas de Almacén\n' +
        '• ~6 Bancos con transacciones\n\n' +
        '¿Continuar con validación y importación?'
    );

    if (!confirmImport) return;

    try {
      showNotification('🔍 Cargando y validando datos del Excel...', 'info');

      // 2. Cargar el JSON generado desde el Excel
      const response = await fetch('/excel_data.json');
      if (!response.ok) {
        throw new Error('No se pudo cargar el archivo de datos del Excel');
      }
      const excelData = await response.json();

      // Validación básica de estructura
      if (!excelData.ventas || !excelData.clientes || !excelData.bancos) {
        throw new Error('El archivo de datos del Excel tiene una estructura inválida');
      }

      // 3. Importar validador dinámicamente
      const { ExcelImportValidator } = await import('../../utils/excel-import-validator.js');
      const validator = new ExcelImportValidator();

      // 4. Ejecutar validación enterprise
      const validationResult = await validator.validateAll(excelData);

      // 5. Mostrar advertencias si existen
      if (validationResult.warnings.length > 0) {
        const warningMsg =
          `⚠️ SE ENCONTRARON ${validationResult.warnings.length} ADVERTENCIAS:\n\n` +
          validationResult.warnings
            .slice(0, 5)
            .map((w, i) => `${i + 1}. [${w.type}] ${w.message}`)
            .join('\n') +
          (validationResult.warnings.length > 5
            ? `\n\n... y ${validationResult.warnings.length - 5} más`
            : '') +
          '\n\nEstas advertencias NO impiden la importación, pero deberías revisarlas.\n\n¿Continuar con la importación?';

        const continueWithWarnings = confirm(warningMsg);
        if (!continueWithWarnings) return;
      }

      // 6. Verificar errores críticos
      if (!validationResult.success) {
        const errorMsg =
          `❌ SE ENCONTRARON ${validationResult.errors.length} ERRORES CRÍTICOS:\n\n` +
          validationResult.errors
            .slice(0, 3)
            .map((e, i) => `${i + 1}. [${e.type}] ${e.message}`)
            .join('\n') +
          (validationResult.errors.length > 3
            ? `\n\n... y ${validationResult.errors.length - 3} más`
            : '') +
          '\n\n❌ NO SE PUEDE IMPORTAR con errores críticos.\n\nSe generará un reporte detallado para corrección.';

        alert(errorMsg);
        showNotification('❌ Importación cancelada por errores críticos', 'error');

        // Descargar reporte de validación
        const report = validator.generateReport();
        const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `validation-report-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);

        return;
      }

      // 7. Usar datos VALIDADOS y TRANSFORMADOS
      const { data: transformedData, stats } = validationResult;

      // 8. Importar datos validados
      if (transformedData.bancos) {
        // Asegurar estructura completa de bancos
        const bancosImportados = {};
        Object.keys(transformedData.bancos).forEach((key) => {
          if (transformedData.bancos[key]) {
            bancosImportados[key] = {
              capitalActual: transformedData.bancos[key].capitalActual || 0,
              historico:
                transformedData.bancos[key].historico ||
                transformedData.bancos[key].capitalActual ||
                0,
              registros: transformedData.bancos[key].registros || [],
              ingresos: transformedData.bancos[key].ingresos || [],
              gastos: transformedData.bancos[key].gastos || [],
              transferencias: transformedData.bancos[key].transferencias || [],
            };
          }
        });
        setBancos(bancosImportados);
      }

      if (transformedData.ordenesCompra) setOrdenesCompra(transformedData.ordenesCompra);
      if (transformedData.distribuidores) setDistribuidores(transformedData.distribuidores);
      if (transformedData.ventas) setVentas(transformedData.ventas);
      if (transformedData.clientes) setClientes(transformedData.clientes);
      if (transformedData.almacen) setAlmacen(transformedData.almacen);

      // 9. Registrar acción con métricas enterprise
      actionHistory.addAction('Importación Enterprise desde Excel', {
        ventas: stats.ventasValidadas,
        clientes: stats.clientesValidados,
        ordenes: stats.ordenesValidadas,
        distribuidores: transformedData.distribuidores?.length || 0,
        bancos: stats.bancosValidados,
        warnings: validationResult.warnings.length,
        timestamp: new Date().toISOString(),
        validationPassed: true,
      });

      // 10. Guardar reporte de importación
      localStorage.setItem('lastImportReport', JSON.stringify(validator.generateReport()));

      showNotification(
        `✅ IMPORTACIÓN ENTERPRISE COMPLETADA\n` +
          `📊 ${stats.ventasValidadas} ventas | ` +
          `👥 ${stats.clientesValidados} clientes | ` +
          `📦 ${stats.ordenesValidadas} OC | ` +
          `🏦 ${stats.bancosValidados} bancos\n` +
          `⚠️ ${validationResult.warnings.length} advertencias (ver consola)`,
        'success'
      );

      // Mostrar resumen en consola
      if (validationResult.warnings.length > 0) {
        console.group('📊 REPORTE DE IMPORTACIÓN EXCEL');
        // console.log('Estadísticas:', stats);
        // console.log('Advertencias:', validationResult.warnings);
        console.groupEnd();
      }

      setShowSettingsModal(false);
    } catch (error) {
      // console.error('Error al importar desde Excel:', error);
      showNotification(`❌ Error crítico al importar: ${error.message}`, 'error');
    }
  };

  const clearAllData = () => {
    if (
      confirm(
        '⚠️ ¿Estás seguro de que quieres borrar todos los datos?\n\nEsto eliminará:\n- Todos los bancos y sus transacciones\n- Todas las ventas\n- Todas las órdenes de compra\n- Todos los clientes y distribuidores\n- Todo el inventario\n\nEsta acción NO se puede deshacer.'
      )
    ) {
      // Resetear todos los bancos a 0 con estructura completa
      setBancos({
        bovedaMonte: {
          capitalActual: 0,
          historico: 0,
          registros: [],
          gastos: [],
          transferencias: [],
          ingresos: [],
        },
        utilidades: {
          capitalActual: 0,
          historico: 0,
          registros: [],
          gastos: [],
          transferencias: [],
          ingresos: [],
        },
        fletes: {
          capitalActual: 0,
          historico: 0,
          registros: [],
          gastos: [],
          transferencias: [],
          ingresos: [],
        },
        azteca: {
          capitalActual: 0,
          historico: 0,
          registros: [],
          gastos: [],
          transferencias: [],
          ingresos: [],
        },
        leftie: {
          capitalActual: 0,
          historico: 0,
          registros: [],
          gastos: [],
          transferencias: [],
          ingresos: [],
        },
        profit: {
          capitalActual: 0,
          historico: 0,
          registros: [],
          gastos: [],
          transferencias: [],
          ingresos: [],
        },
      });

      // Limpiar todos los demás datos
      setOrdenesCompra([]);
      setDistribuidores([]);
      setVentas([]);
      setClientes([]);
      setAlmacen({ stock: [], entradas: [], salidas: [] });

      showNotification('✨ Sistema limpiado completamente. Todos los marcadores en 0', 'success');
      actionHistory.addAction('Reset total del sistema', { timestamp: new Date().toISOString() });
    }
  };

  // TOAST CONTAINER
  const ToastContainer = () => (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      {notifications.map((notif) => (
        <motion.div
          key={notif.id}
          initial={{ x: 400, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 400, opacity: 0 }}
          className={`glass rounded-xl px-6 py-4 shadow-2xl flex items-center gap-3 border-l-4 ${
            notif.type === 'success'
              ? 'border-green-500'
              : notif.type === 'error'
                ? 'border-red-500'
                : 'border-blue-500'
          }`}
        >
          {notif.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-green-500" />
          ) : notif.type === 'error' ? (
            <AlertCircle className="w-5 h-5 text-red-500" />
          ) : (
            <Bell className="w-5 h-5 text-blue-500" />
          )}
          <span className="text-white">{notif.message}</span>
        </motion.div>
      ))}
    </div>
  );

  // AI WIDGET MEJORADO CON QUICK REPLIES
  const AIWidget = () => (
    <div className="fixed bottom-6 right-6 z-50">
      {!showAIWidget ? (
        <motion.button
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.9 }}
          animate={{
            boxShadow: [
              '0 0 20px rgba(168, 85, 247, 0.4)',
              '0 0 40px rgba(59, 130, 246, 0.6)',
              '0 0 20px rgba(168, 85, 247, 0.4)',
            ],
          }}
          transition={{ duration: 2, repeat: Infinity }}
          onClick={() => setShowAIWidget(true)}
          className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-5 rounded-full shadow-2xl relative"
        >
          <Bot className="w-7 h-7 animate-pulse" />
          <motion.div
            className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-slate-900"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.button>
      ) : (
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          className="glass rounded-2xl shadow-2xl w-96 h-[32rem] flex flex-col border border-white/10"
        >
          {/* Header mejorado */}
          <div className="bg-gradient-to-r from-purple-600 via-violet-600 to-blue-600 text-white p-4 rounded-t-2xl flex justify-between items-center relative overflow-hidden">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              animate={{ x: ['-100%', '100%'] }}
              transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
            />
            <div className="flex items-center gap-3 relative z-10">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              >
                <Bot className="w-6 h-6" />
              </motion.div>
              <div>
                <span className="font-bold">Flow AI Assistant</span>
                <div className="flex items-center gap-1 text-xs">
                  <motion.div
                    className="w-2 h-2 bg-green-400 rounded-full"
                    animate={{ scale: [1, 1.3, 1], opacity: [1, 0.7, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <span className="text-green-200">En línea</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowAIWidget(false)}
              className="hover:bg-white/20 rounded-full p-1.5 transition-colors relative z-10"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Chat container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
            {aiMessages.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <div className="text-center text-slate-300">
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Bot className="w-16 h-16 mx-auto mb-3 text-purple-400" />
                  </motion.div>
                  <h3 className="font-bold text-lg mb-2">¡Hola! Soy Flow 👋</h3>
                  <p className="text-sm text-slate-400">Tu asistente inteligente conversacional</p>
                  <p className="text-xs mt-2 text-slate-500">
                    Pregúntame lo que necesites en lenguaje natural
                  </p>
                </div>

                {/* Quick Actions mejoradas */}
                <div className="space-y-2">
                  <p className="text-xs text-slate-400 font-semibold flex items-center gap-2">
                    <Zap className="w-3 h-3 text-yellow-400" />
                    Acciones rápidas:
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { label: '💰 Ver capital', query: '¿Cuál es mi capital en bancos?' },
                      { label: '📊 Estadísticas', query: 'Dame un análisis de ventas' },
                      { label: '📦 Inventario', query: '¿Cómo está mi inventario?' },
                      { label: '❓ Ayuda', query: '¿Qué puedes hacer?' },
                    ].map((action, _idx) => (
                      <motion.button
                        key={_idx}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: _idx * 0.1 }}
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          setAiInput(action.query);
                          setTimeout(() => handleAISend(), 100);
                        }}
                        className="p-3 bg-white/5 hover:bg-white/10 rounded-xl text-xs transition-all text-left border border-white/5 hover:border-purple-500/30"
                      >
                        {action.label}
                      </motion.button>
                    ))}
                  </div>
                </div>
              </motion.div>
            ) : (
              <>
                {aiMessages.map((msg, _idx) => (
                  <div key={_idx}>
                    {msg.type === 'typing' ? (
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex justify-start"
                      >
                        <div className="bg-white/10 px-4 py-3 rounded-2xl rounded-tl-sm flex items-center gap-2">
                          <motion.div
                            className="flex gap-1"
                            animate={{ opacity: [0.3, 1, 0.3] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                          >
                            <div className="w-2 h-2 bg-purple-400 rounded-full" />
                            <div className="w-2 h-2 bg-blue-400 rounded-full" />
                            <div className="w-2 h-2 bg-cyan-400 rounded-full" />
                          </motion.div>
                          <span className="text-xs text-slate-400">Flow está pensando...</span>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0, x: msg.type === 'user' ? 20 : -20, y: 10 }}
                        animate={{ opacity: 1, x: 0, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-[85%] ${msg.type === 'user' ? '' : 'space-y-2'}`}>
                          <div
                            className={`p-3 rounded-2xl whitespace-pre-line ${
                              msg.type === 'user'
                                ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-tr-sm shadow-lg'
                                : 'bg-white/10 text-white text-sm rounded-tl-sm border border-white/10'
                            }`}
                          >
                            {msg.text}
                            {msg.time && (
                              <p
                                className={`text-[10px] mt-1 ${
                                  msg.type === 'user' ? 'text-white/70' : 'text-slate-500'
                                }`}
                              >
                                {msg.time}
                              </p>
                            )}
                          </div>

                          {/* Quick Replies */}
                          {msg.quickReplies && msg.quickReplies.length > 0 && (
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.3 }}
                              className="flex flex-wrap gap-2"
                            >
                              {msg.quickReplies.map((reply, i) => (
                                <motion.button
                                  key={`item-${i}`}
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => {
                                    setAiInput(reply);
                                    setTimeout(() => handleAISend(), 100);
                                  }}
                                  className="px-3 py-1.5 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 rounded-full text-xs font-medium transition-all"
                                >
                                  {reply}
                                </motion.button>
                              ))}
                            </motion.div>
                          )}

                          {/* Suggested Actions */}
                          {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.5 }}
                              className="flex flex-wrap gap-2"
                            >
                              {msg.suggestedActions.slice(0, 2).map((action, i) => (
                                <motion.button
                                  key={`item-${i}`}
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  className="px-3 py-1.5 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 rounded-lg text-xs font-medium flex items-center gap-1"
                                >
                                  <ArrowRight className="w-3 h-3" />
                                  {action}
                                </motion.button>
                              ))}
                            </motion.div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </div>
                ))}
              </>
            )}
          </div>

          {/* Input mejorado */}
          <div className="p-4 border-t border-white/10 bg-slate-900/50">
            <div className="flex gap-2">
              <input
                type="text"
                value={aiInput}
                onChange={(e) => setAiInput(e.target.value)}
                placeholder="Pregúntame lo que necesites..."
                className="flex-1 px-4 py-3 bg-white/10 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-slate-400 text-sm transition-all"
                onKeyPress={(e) => e.key === 'Enter' && handleAISend()}
              />
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleAISend}
                disabled={!aiInput.trim()}
                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-3 rounded-xl hover:shadow-lg hover:shadow-purple-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5" />
              </motion.button>
            </div>
            <p className="text-[10px] text-slate-500 mt-2 flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              Powered by Flow AI • Conversacional & Contextual
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );

  // SETTINGS MODAL
  const SettingsModal = () =>
    showSettingsModal && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
        onClick={() => setShowSettingsModal(false)}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          onClick={(e) => e.stopPropagation()}
          className="glass rounded-2xl p-8 max-w-2xl w-full border border-white/10"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Settings className="w-6 h-6" />
              Configuración y Respaldos
            </h2>
            <button
              onClick={() => setShowSettingsModal(false)}
              className="p-2 hover:bg-white/5 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-6">
            {/* Sección de Respaldos */}
            <div className="glass rounded-xl p-6 border border-white/10">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Download className="w-5 h-5 text-blue-400" />
                Gestión de Respaldos
              </h3>

              <div className="space-y-4">
                {/* Crear respaldo */}
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                  <div>
                    <p className="font-semibold">Crear Respaldo</p>
                    <p className="text-sm text-slate-400">
                      Descarga todos tus datos en formato JSON
                    </p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={createBackup}
                    className="px-6 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/20 transition-all"
                  >
                    Descargar
                  </motion.button>
                </div>

                {/* Restaurar respaldo */}
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                  <div>
                    <p className="font-semibold">Restaurar Respaldo</p>
                    <p className="text-sm text-slate-400">Carga un archivo de respaldo anterior</p>
                  </div>
                  <label className="cursor-pointer">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl font-semibold hover:shadow-lg hover:shadow-green-500/20 transition-all"
                    >
                      Cargar
                    </motion.div>
                    <input type="file" accept=".json" onChange={restoreBackup} className="hidden" />
                  </label>
                </div>

                {/* Importar desde Excel */}
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl">
                  <div>
                    <p className="font-semibold text-purple-400">📊 Importar desde Excel</p>
                    <p className="text-sm text-slate-400">
                      Carga todos los datos del Excel de Administración General
                    </p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={importFromExcel}
                    className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/20 transition-all"
                  >
                    Importar
                  </motion.button>
                </div>

                {/* Borrar todos los datos */}
                <div className="flex items-center justify-between p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                  <div>
                    <p className="font-semibold text-red-400">🗑️ Resetear Sistema a Cero</p>
                    <p className="text-sm text-slate-400">
                      ⚠️ Limpia todos los datos y pone marcadores en $0
                    </p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={clearAllData}
                    className="px-6 py-2 bg-gradient-to-r from-red-500 to-red-600 rounded-xl font-semibold hover:shadow-lg hover:shadow-red-500/20 transition-all"
                  >
                    Resetear
                  </motion.button>
                </div>
              </div>
            </div>

            {/* Sección de Información */}
            <div className="glass rounded-xl p-6 border border-white/10">
              <h3 className="text-lg font-bold mb-4">Información del Sistema</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">Versión:</span>
                  <span className="font-semibold">3.0.0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Órdenes de Compra:</span>
                  <span className="font-semibold">{ordenesCompra.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Distribuidores:</span>
                  <span className="font-semibold">{distribuidores.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Ventas:</span>
                  <span className="font-semibold">{ventas.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Clientes:</span>
                  <span className="font-semibold">{clientes.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Productos en Stock:</span>
                  <span className="font-semibold">{(almacen?.stock || []).length}</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    );

  // 🎨 SIDEBAR OPTIMIZADO Y MEJORADO
  // ============================================
  // SIDEBAR REACTIVO CON EXPANSIÓN AL CURSOR
  // ============================================
  const Sidebar = () => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [hoveredItem, setHoveredItem] = useState(null);
    const sidebarRef = useRef(null);

    const menuItems = [
      { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard', badge: null, color: 'blue' },
      {
        id: 'ordenes',
        icon: Package,
        label: 'Órdenes de Compra',
        badge: ordenesCompra.length,
        color: 'purple',
      },
      {
        id: 'distribuidores',
        icon: Users,
        label: 'Distribuidores',
        badge: distribuidores.length,
        color: 'green',
      },
      {
        id: 'almacen',
        icon: Warehouse,
        label: 'Almacén',
        badge: (almacen?.stock || []).length,
        color: 'orange',
      },
      { id: 'ventas', icon: TrendingUp, label: 'Ventas', badge: ventas.length, color: 'pink' },
      { id: 'clientes', icon: UserCheck, label: 'Clientes', badge: clientes.length, color: 'cyan' },
      {
        id: 'gastosAbonos',
        icon: DollarSign,
        label: 'Gastos y Abonos',
        badge: gastosAbonos.length,
        color: 'green',
      },
      { id: 'separator1', separator: true },
      {
        id: 'clientesCartera',
        icon: Users,
        label: '👥 Cartera Clientes',
        badge: null,
        color: 'indigo',
      },
      { id: 'separator1b', separator: true },
      {
        id: 'banco-bovedaMonte',
        icon: Building2,
        label: 'Bóveda Monte',
        isBanco: true,
        valor: bancos.bovedaMonte?.capitalActual || 0,
        color: 'emerald',
      },
      {
        id: 'banco-bovedaUSA',
        icon: DollarSign,
        label: 'Bóveda USA 🇺🇸',
        isBanco: true,
        valor: bancos.bovedaUSA?.capitalActual || 0,
        moneda: 'USD',
        color: 'blue',
        badge: 'USD',
      },
      {
        id: 'banco-utilidades',
        icon: DollarSign,
        label: 'Utilidades',
        isBanco: true,
        valor: bancos.utilidades?.capitalActual || 0,
        color: 'green',
      },
      {
        id: 'banco-fletes',
        icon: TrendingUp,
        label: 'Fletes',
        isBanco: true,
        valor: bancos.fletes?.capitalActual || 0,
        color: 'yellow',
      },
      {
        id: 'banco-azteca',
        icon: Building2,
        label: 'Azteca',
        isBanco: true,
        valor: bancos.azteca?.capitalActual || 0,
        color: 'red',
      },
      {
        id: 'banco-leftie',
        icon: DollarSign,
        label: 'Leftie',
        isBanco: true,
        valor: bancos.leftie?.capitalActual || 0,
        color: 'indigo',
      },
      {
        id: 'banco-profit',
        icon: TrendingUp,
        label: 'Profit',
        isBanco: true,
        valor: bancos.profit?.capitalActual || 0,
        color: 'violet',
      },
      { id: 'separator2', separator: true },
      { id: 'reportes', icon: FileText, label: 'Reportes', badge: null, color: 'slate' },
    ];

    // Color themes para cada item
    const colorThemes = {
      blue: {
        bg: 'from-blue-500/20 to-cyan-500/10',
        border: 'border-blue-400/50',
        text: 'text-blue-400',
        shadow: 'shadow-blue-500/30',
      },
      purple: {
        bg: 'from-purple-500/20 to-pink-500/10',
        border: 'border-purple-400/50',
        text: 'text-purple-400',
        shadow: 'shadow-purple-500/30',
      },
      green: {
        bg: 'from-green-500/20 to-emerald-500/10',
        border: 'border-green-400/50',
        text: 'text-green-400',
        shadow: 'shadow-green-500/30',
      },
      orange: {
        bg: 'from-orange-500/20 to-yellow-500/10',
        border: 'border-orange-400/50',
        text: 'text-orange-400',
        shadow: 'shadow-orange-500/30',
      },
      pink: {
        bg: 'from-pink-500/20 to-rose-500/10',
        border: 'border-pink-400/50',
        text: 'text-pink-400',
        shadow: 'shadow-pink-500/30',
      },
      cyan: {
        bg: 'from-cyan-500/20 to-blue-500/10',
        border: 'border-cyan-400/50',
        text: 'text-cyan-400',
        shadow: 'shadow-cyan-500/30',
      },
      emerald: {
        bg: 'from-emerald-500/20 to-green-500/10',
        border: 'border-emerald-400/50',
        text: 'text-emerald-400',
        shadow: 'shadow-emerald-500/30',
      },
      yellow: {
        bg: 'from-yellow-500/20 to-amber-500/10',
        border: 'border-yellow-400/50',
        text: 'text-yellow-400',
        shadow: 'shadow-yellow-500/30',
      },
      red: {
        bg: 'from-red-500/20 to-rose-500/10',
        border: 'border-red-400/50',
        text: 'text-red-400',
        shadow: 'shadow-red-500/30',
      },
      indigo: {
        bg: 'from-indigo-500/20 to-blue-500/10',
        border: 'border-indigo-400/50',
        text: 'text-indigo-400',
        shadow: 'shadow-indigo-500/30',
      },
      violet: {
        bg: 'from-violet-500/20 to-purple-500/10',
        border: 'border-violet-400/50',
        text: 'text-violet-400',
        shadow: 'shadow-violet-500/30',
      },
      slate: {
        bg: 'from-slate-500/20 to-gray-500/10',
        border: 'border-slate-400/50',
        text: 'text-slate-400',
        shadow: 'shadow-slate-500/30',
      },
    };

    return (
      <>
        {/* Overlay para móviles */}
        <AnimatePresence>
          {isSidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
            />
          )}
        </AnimatePresence>

        {/* Sidebar Reactivo - Se expande con cursor */}
        <motion.aside
          ref={sidebarRef}
          initial={false}
          animate={{
            width: isExpanded ? 280 : 80,
          }}
          transition={{
            type: 'spring',
            damping: 30,
            stiffness: 300,
          }}
          onMouseEnter={() => setIsExpanded(true)}
          onMouseLeave={() => {
            setIsExpanded(false);
            setHoveredItem(null);
          }}
          className="relative left-0 top-0 h-screen backdrop-blur-2xl bg-gradient-to-br from-slate-950/95 via-purple-950/30 to-slate-950/95 border-r border-purple-500/20 z-50 flex flex-col overflow-hidden shadow-2xl shadow-purple-500/10"
        >
          {/* Header con Logo */}
          <motion.div
            className="relative p-4 border-b border-purple-500/20 overflow-hidden"
            animate={{ height: isExpanded ? 80 : 70 }}
          >
            {/* Partículas de fondo animadas */}
            <motion.div
              className="absolute inset-0 opacity-20"
              animate={{
                background: [
                  'radial-gradient(circle at 20% 50%, rgba(139, 92, 246, 0.3) 0%, transparent 50%)',
                  'radial-gradient(circle at 80% 50%, rgba(59, 130, 246, 0.3) 0%, transparent 50%)',
                  'radial-gradient(circle at 20% 50%, rgba(139, 92, 246, 0.3) 0%, transparent 50%)',
                ],
              }}
              transition={{ duration: 4, repeat: Infinity }}
            />

            <div className="relative z-10 flex items-center gap-3">
              <motion.div
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.6 }}
                className="p-2.5 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 shadow-lg shadow-purple-500/50"
              >
                <Building2 className="w-6 h-6 text-white" />
              </motion.div>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <h1 className="text-lg font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
                      FlowDistributor
                    </h1>
                    <p className="text-[10px] text-slate-400 flex items-center gap-1">
                      <motion.span
                        animate={{ scale: [1, 1.2, 1], opacity: [1, 0.7, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="w-1.5 h-1.5 bg-green-400 rounded-full"
                      />
                      Online
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Menu Items con scroll */}
          <nav className="flex-1 overflow-y-auto p-3 space-y-1.5 custom-scrollbar">
            {menuItems.map((item, index) => {
              // Separador
              if (item.separator) {
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="my-2 mx-2 border-t border-purple-500/20 relative"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/30 to-transparent h-px" />
                  </motion.div>
                );
              }

              const Icon = item.icon;
              const isActive = activePanel === item.id;
              const theme = colorThemes[item.color] || colorThemes.blue;

              return (
                <motion.button
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.03 }}
                  whileHover={{ x: 4, scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => {
                    setActivePanel(item.id);
                    if (globalThis.innerWidth < 1024) {
                      setIsSidebarOpen(false);
                    }
                  }}
                  onMouseEnter={() => setHoveredItem(item.id)}
                  onMouseLeave={() => setHoveredItem(null)}
                  className={`
                    w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 relative overflow-hidden group
                    ${
                      isActive
                        ? `bg-gradient-to-r ${theme.bg} border ${theme.border} ${theme.text} shadow-lg ${theme.shadow}`
                        : 'hover:bg-white/5 text-slate-300 hover:text-white border border-transparent'
                    }
                  `}
                >
                  {/* Efecto de onda en hover */}
                  <AnimatePresence>
                    {hoveredItem === item.id && !isActive && (
                      <motion.div
                        initial={{ scale: 0, opacity: 0.5 }}
                        animate={{ scale: 2, opacity: 0 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ duration: 0.6 }}
                        className={`absolute inset-0 bg-gradient-to-r ${theme.bg} rounded-xl`}
                      />
                    )}
                  </AnimatePresence>

                  {/* Icono con indicador activo */}
                  <div className="relative flex-shrink-0">
                    <Icon
                      className={`w-5 h-5 transition-all duration-300 ${
                        isActive ? theme.text : 'group-hover:scale-110'
                      }`}
                    />
                    {isActive && (
                      <motion.div
                        layoutId="activeIndicator"
                        className={`absolute -inset-1 bg-gradient-to-r ${theme.bg} rounded-lg -z-10`}
                        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                      />
                    )}
                  </div>

                  {/* Label (solo visible cuando está expandido) */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ duration: 0.2 }}
                        className="flex-1 flex items-center justify-between overflow-hidden"
                      >
                        <span
                          className={`font-medium text-sm whitespace-nowrap ${item.isBanco ? 'text-xs' : ''}`}
                        >
                          {item.label}
                        </span>

                        {/* Badges y valores */}
                        {item.badge !== null && item.badge > 0 && !item.isBanco && (
                          <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                              isActive ? `${theme.text} bg-white/20` : 'bg-slate-700 text-slate-300'
                            }`}
                          >
                            {item.badge}
                          </motion.span>
                        )}

                        {item.isBanco && (
                          <span
                            className={`text-[10px] font-bold ${isActive ? theme.text : 'text-green-400'}`}
                          >
                            ${(item.valor / 1000).toFixed(1)}K
                          </span>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Tooltip cuando está colapsado */}
                  {!isExpanded && hoveredItem === item.id && (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="absolute left-full ml-2 px-3 py-2 bg-slate-900 border border-purple-500/30 rounded-lg shadow-xl shadow-purple-500/20 whitespace-nowrap z-50"
                    >
                      <span className="text-sm font-medium text-white">{item.label}</span>
                      {item.badge !== null && item.badge > 0 && (
                        <span className="ml-2 text-xs text-slate-400">({item.badge})</span>
                      )}
                    </motion.div>
                  )}
                </motion.button>
              );
            })}
          </nav>

          {/* Footer con Quick Actions (solo expandido) */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="p-3 border-t border-purple-500/20 space-y-2"
              >
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={toggleTheme}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
                >
                  {darkMode ? (
                    <Sun className="w-4 h-4 text-yellow-400" />
                  ) : (
                    <Moon className="w-4 h-4 text-blue-400" />
                  )}
                  <span className="text-sm text-slate-300">Cambiar Tema</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowSettingsModal(true)}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
                >
                  <Settings className="w-4 h-4 text-purple-400" />
                  <span className="text-sm text-slate-300">Configuración</span>
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Indicador de expansión */}
          <motion.div
            className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-20 bg-gradient-to-b from-transparent via-purple-500 to-transparent rounded-l-full"
            animate={{ opacity: isExpanded ? 0.5 : 0.2 }}
          />
        </motion.aside>
      </>
    );
  };

  // DASHBOARD PANEL REVOLUCIONARIO
  const Dashboard = () => {
    const [selectedTimeRange, setSelectedTimeRange] = useState('mes');
    const [showQuickActions, setShowQuickActions] = useState(false);

    // Dashboard mounted effect
    React.useEffect(() => {
      // Component mounted successfully
    }, []);

    // Optimización con useMemo para cálculos pesados
    const totalBancos = React.useMemo(
      () => Object.values(bancos || {}).reduce((sum, b) => sum + (b?.capitalActual || 0), 0),
      [bancos]
    );

    const totalIngresos = React.useMemo(
      () => (ventas || []).reduce((sum, v) => sum + (v?.totalVenta || 0), 0),
      [ventas]
    );

    const totalEgresos = React.useMemo(
      () => (ordenesCompra || []).reduce((sum, o) => sum + (o?.total || 0), 0),
      [ordenesCompra]
    );

    const gananciaTotal = React.useMemo(
      () => (totalIngresos || 0) - (totalEgresos || 0),
      [totalIngresos, totalEgresos]
    );

    const tasaCrecimiento = 18.5;

    const productosStockBajo = React.useMemo(
      () =>
        (almacen?.stock || []).filter(
          (item) => (item?.cantidad || 0) <= (item?.cantidadMinima || 5)
        ).length,
      [almacen]
    );

    const adeudosClientes = React.useMemo(
      () => (clientes || []).reduce((sum, c) => sum + (c?.adeudo || 0), 0),
      [clientes]
    );

    const adeudosDistribuidores = React.useMemo(
      () => (distribuidores || []).reduce((sum, d) => sum + (d?.adeudo || 0), 0),
      [distribuidores]
    );

    // Datos para gráficos
    const chartData = React.useMemo(
      () => [
        { mes: 'Ene', ingresos: 85000, egresos: 65000 },
        { mes: 'Feb', ingresos: 92000, egresos: 70000 },
        { mes: 'Mar', ingresos: 78000, egresos: 58000 },
        { mes: 'Abr', ingresos: 105000, egresos: 80000 },
        { mes: 'May', ingresos: 118000, egresos: 85000 },
        { mes: 'Jun', ingresos: 125000, egresos: 90000 },
      ],
      []
    );

    // KPIs principales memorizados para optimización de performance
    const dashboardKPIs = React.useMemo(
      () => [
        {
          title: 'Capital Total',
          value: `$${totalBancos.toLocaleString()}`,
          icon: Wallet,
          gradient: 'from-cyan-400 to-blue-500',
          bgGradient: 'from-cyan-500/10 to-blue-500/5',
          change: '+12.5%',
          description: 'Efectivo disponible',
          action: () => setActivePanel('bancos'),
        },
        {
          title: 'Ganancia Neta',
          value: `$${gananciaTotal.toLocaleString()}`,
          icon: TrendingUp,
          gradient: 'from-green-400 to-emerald-500',
          bgGradient: 'from-green-500/10 to-emerald-500/5',
          change: `+${tasaCrecimiento}%`,
          description: 'Ingresos - Egresos',
          action: () => setActivePanel('reportes'),
        },
        {
          title: 'Operaciones',
          value: ventas.length + ordenesCompra.length,
          icon: Activity,
          gradient: 'from-purple-400 to-pink-500',
          bgGradient: 'from-purple-500/10 to-pink-500/5',
          change: '+23',
          description: 'Ventas y compras',
          action: () => {},
        },
        {
          title: 'Inventario',
          value: (almacen?.stock || []).length,
          icon: Package,
          gradient: 'from-orange-400 to-red-500',
          bgGradient: 'from-orange-500/10 to-red-500/5',
          change: productosStockBajo > 0 ? `⚠️ ${productosStockBajo} bajos` : '✓ Normal',
          description: 'Productos en stock',
          action: () => setActivePanel('almacen'),
        },
      ],
      [
        totalBancos,
        gananciaTotal,
        tasaCrecimiento,
        ventas.length,
        ordenesCompra.length,
        (almacen?.stock || []).length,
        productosStockBajo,
        setActivePanel,
      ]
    );

    return (
      <div className="space-y-6 w-full min-h-screen bg-slate-900 p-8">
        {/* Header Revolucionario */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.6,
            ease: [0.25, 0.1, 0.25, 1], // Curva de bezier suave
            type: 'spring',
            stiffness: 100,
            damping: 15,
          }}
          className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4"
        >
          <div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 bg-clip-text text-transparent mb-2">
              Command Center
            </h1>
            <p className="text-slate-400 flex items-center gap-2">
              <Activity className="w-4 h-4 text-green-400 animate-pulse" />
              Sistema en tiempo real • {new Date().toLocaleString('es-MX', { dateStyle: 'long' })}
            </p>
          </div>
          <div className="flex gap-3">
            <motion.select
              whileFocus={{ scale: 1.02 }}
              value={selectedTimeRange}
              onChange={(e) => setSelectedTimeRange(e.target.value)}
              className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-cyan-500 text-white transition-all duration-200"
            >
              <option value="hoy" className="bg-slate-800">
                Hoy
              </option>
              <option value="semana" className="bg-slate-800">
                Esta semana
              </option>
              <option value="mes" className="bg-slate-800">
                Este mes
              </option>
              <option value="trimestre" className="bg-slate-800">
                Trimestre
              </option>
              <option value="año" className="bg-slate-800">
                Este año
              </option>
            </motion.select>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowQuickActions(!showQuickActions)}
              className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-semibold shadow-lg hover:shadow-purple-500/20 transition-all duration-200 flex items-center gap-2"
              aria-label="Acciones rápidas"
            >
              <motion.div
                animate={{ rotate: showQuickActions ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <Settings className="w-5 h-5" />
              </motion.div>
              <span className="hidden sm:inline">Acciones</span>
            </motion.button>
          </div>
          <div className="flex gap-3">
            <motion.select
              whileFocus={{ scale: 1.02 }}
              value={selectedTimeRange}
              onChange={(e) => setSelectedTimeRange(e.target.value)}
              className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-cyan-500 text-white"
            >
              <option value="hoy" className="bg-slate-800">
                Hoy
              </option>
              <option value="semana" className="bg-slate-800">
                Esta semana
              </option>
              <option value="mes" className="bg-slate-800">
                Este mes
              </option>
              <option value="trimestre" className="bg-slate-800">
                Trimestre
              </option>
              <option value="año" className="bg-slate-800">
                Este año
              </option>
            </motion.select>

            <motion.button
              whileHover={{ scale: 1.05, rotate: 180 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowQuickActions(!showQuickActions)}
              className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-semibold shadow-lg"
            >
              <Settings className="w-5 h-5" />
            </motion.button>
          </div>
        </motion.div>

        {/* KPIs Premium con StatCard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {dashboardKPIs.map((kpi, index) => (
            <StatCard
              key={kpi.title}
              title={kpi.title}
              value={kpi.value}
              icon={kpi.icon}
              trend="up"
              trendValue={parseFloat(kpi.change)}
              gradient={kpi.gradient}
              bgGradient={kpi.bgGradient}
              onClick={kpi.action}
              delay={index * 0.1}
            />
          ))}
        </div>

        {/* Sección de Gráficos Avanzados */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Gráfico de Tendencias con AnimatedChart Premium */}
          <AnimatedChart
            data={chartData.map((item) => ({ name: item.mes, ...item }))}
            type="line"
            title="Tendencia Financiera"
            description="Ingresos y egresos mensuales comparados"
            dataKeys={['ingresos', 'egresos']}
            colors={['#10b981', '#ef4444']}
            enableTypeSwitch={true}
            showLegend={true}
            showGrid={true}
            height={350}
          />

          {/* Distribución de Capital */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: 0.8,
              delay: 0.2,
              ease: [0.25, 0.1, 0.25, 1],
              type: 'spring',
              stiffness: 80,
              damping: 15,
            }}
            style={{ willChange: 'transform, opacity' }}
            className="glass rounded-2xl p-6 border border-white/10"
          >
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Wallet className="w-6 h-6 text-purple-400" />
              Distribución de Capital
            </h2>
            <div className="space-y-4">
              {Object.entries(bancos || {}).map(([key, banco], index) => {
                const percentage =
                  totalBancos > 0 ? ((banco?.capitalActual || 0) / totalBancos) * 100 : 0;
                const nombres = {
                  bovedaMonte: '🏦 Bóveda Monte',
                  utilidades: '💎 Utilidades',
                  fletes: '🚚 Fletes',
                  azteca: '🏛️ Azteca',
                  leftie: '🎯 Leftie',
                  profit: '💰 Profit',
                };
                const colores = ['cyan', 'purple', 'green', 'blue', 'pink', 'orange'];
                const color = colores[index % colores.length];

                // Mapas de clases estáticas para Tailwind
                const textColorClasses = {
                  cyan: 'group-hover:text-cyan-400',
                  purple: 'group-hover:text-purple-400',
                  green: 'group-hover:text-green-400',
                  blue: 'group-hover:text-blue-400',
                  pink: 'group-hover:text-pink-400',
                  orange: 'group-hover:text-orange-400',
                };

                const badgeClasses = {
                  cyan: 'text-cyan-400 bg-cyan-400/20',
                  purple: 'text-purple-400 bg-purple-400/20',
                  green: 'text-green-400 bg-green-400/20',
                  blue: 'text-blue-400 bg-blue-400/20',
                  pink: 'text-pink-400 bg-pink-400/20',
                  orange: 'text-orange-400 bg-orange-400/20',
                };

                const barClasses = {
                  cyan: 'bg-gradient-to-r from-cyan-400 to-cyan-600 group-hover:from-cyan-300 group-hover:to-cyan-500 shadow-cyan-500/50',
                  purple:
                    'bg-gradient-to-r from-purple-400 to-purple-600 group-hover:from-purple-300 group-hover:to-purple-500 shadow-purple-500/50',
                  green:
                    'bg-gradient-to-r from-green-400 to-green-600 group-hover:from-green-300 group-hover:to-green-500 shadow-green-500/50',
                  blue: 'bg-gradient-to-r from-blue-400 to-blue-600 group-hover:from-blue-300 group-hover:to-blue-500 shadow-blue-500/50',
                  pink: 'bg-gradient-to-r from-pink-400 to-pink-600 group-hover:from-pink-300 group-hover:to-pink-500 shadow-pink-500/50',
                  orange:
                    'bg-gradient-to-r from-orange-400 to-orange-600 group-hover:from-orange-300 group-hover:to-orange-500 shadow-orange-500/50',
                };

                return (
                  <motion.div
                    key={key}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      delay: index * 0.08 + 0.3,
                      duration: 0.6,
                      ease: [0.25, 0.1, 0.25, 1],
                      type: 'spring',
                      stiffness: 120,
                      damping: 14,
                    }}
                    whileHover={{
                      scale: 1.02,
                      x: 10,
                      transition: {
                        duration: 0.2,
                        ease: [0.25, 0.1, 0.25, 1],
                      },
                    }}
                    onClick={() => setActivePanel(`banco-${key}`)}
                    style={{ willChange: 'transform' }}
                    className="cursor-pointer group"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span
                        className={`font-semibold transition-colors ${textColorClasses[color]}`}
                      >
                        {nombres[key]}
                      </span>
                      <div className="flex items-center gap-3">
                        <span className="text-slate-400">
                          ${(banco?.capitalActual || 0).toLocaleString()}
                        </span>
                        <span
                          className={`text-sm font-bold px-2 py-1 rounded-lg ${badgeClasses[color]}`}
                        >
                          {percentage.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                    <div className="h-3 bg-white/5 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{
                          duration: 1.5,
                          delay: index * 0.1 + 0.5,
                          ease: [0.25, 0.1, 0.25, 1],
                          type: 'spring',
                          stiffness: 60,
                          damping: 15,
                        }}
                        style={{ willChange: 'width' }}
                        className={`h-full transition-all duration-300 shadow-lg ${barClasses[color]}`}
                      />
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActivePanel('bancos')}
              className="w-full mt-6 px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-semibold flex items-center justify-center gap-2 shadow-lg"
            >
              <Eye className="w-5 h-5" />
              Ver Todos los Bancos
            </motion.button>
          </motion.div>
        </div>

        {/* Alertas y Actividad en Tiempo Real */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Alertas Críticas */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="glass rounded-2xl p-6 border border-red-500/20 bg-gradient-to-br from-red-500/10 to-pink-500/5"
          >
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-400 animate-pulse" />
              Alertas Críticas
            </h3>
            <div className="space-y-3">
              {productosStockBajo > 0 && (
                <motion.div
                  whileHover={{ scale: 1.02, x: 5 }}
                  className="p-3 bg-red-500/20 rounded-xl border border-red-500/30 cursor-pointer"
                  onClick={() => setActivePanel('almacen')}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Package className="w-4 h-4 text-red-400" />
                    <span className="font-semibold text-red-400">Stock Bajo</span>
                  </div>
                  <p className="text-sm text-slate-300">
                    {productosStockBajo} productos necesitan reorden urgente
                  </p>
                </motion.div>
              )}

              {adeudosClientes > 0 && (
                <motion.div
                  whileHover={{ scale: 1.02, x: 5 }}
                  className="p-3 bg-orange-500/20 rounded-xl border border-orange-500/30 cursor-pointer"
                  onClick={() => setActivePanel('clientes')}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <DollarSign className="w-4 h-4 text-orange-400" />
                    <span className="font-semibold text-orange-400">Adeudos Clientes</span>
                  </div>
                  <p className="text-sm text-slate-300">
                    ${adeudosClientes.toLocaleString()} pendientes de cobro
                  </p>
                </motion.div>
              )}

              {adeudosDistribuidores > 0 && (
                <motion.div
                  whileHover={{ scale: 1.02, x: 5 }}
                  className="p-3 bg-yellow-500/20 rounded-xl border border-yellow-500/30 cursor-pointer"
                  onClick={() => setActivePanel('distribuidores')}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Users className="w-4 h-4 text-yellow-400" />
                    <span className="font-semibold text-yellow-400">Adeudos Distribuidores</span>
                  </div>
                  <p className="text-sm text-slate-300">
                    ${adeudosDistribuidores.toLocaleString()} por pagar
                  </p>
                </motion.div>
              )}

              {productosStockBajo === 0 && adeudosClientes === 0 && adeudosDistribuidores === 0 && (
                <div className="text-center py-4">
                  <CheckCircle2 className="w-12 h-12 mx-auto mb-2 text-green-400" />
                  <p className="text-green-400 font-semibold">Sistema Saludable</p>
                  <p className="text-xs text-slate-400">Sin alertas críticas</p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Actividad Reciente */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="lg:col-span-2 glass rounded-2xl p-6 border border-white/10"
          >
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-400" />
              Actividad Reciente en Tiempo Real
            </h3>
            <div className="space-y-3 max-h-64 overflow-y-auto custom-scrollbar">
              {[...ventas, ...ordenesCompra]
                .slice(-8)
                .reverse()
                .map((item, _idx) => (
                  <motion.div
                    key={_idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: _idx * 0.05 }}
                    whileHover={{ scale: 1.02, x: 10 }}
                    className="flex items-center justify-between p-3 glass rounded-xl hover:bg-white/10 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <motion.div
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.6 }}
                        className={`p-2 rounded-xl ${
                          item.tipo === 'venta' || item.totalVenta
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-blue-500/20 text-blue-400'
                        }`}
                      >
                        {item.tipo === 'venta' || item.totalVenta ? (
                          <TrendingUp className="w-5 h-5" />
                        ) : (
                          <Package className="w-5 h-5" />
                        )}
                      </motion.div>
                      <div>
                        <p className="font-semibold group-hover:text-cyan-400 transition-colors">
                          {item.tipo === 'venta' || item.totalVenta
                            ? '💰 Nueva Venta'
                            : '📦 Orden de Compra'}
                        </p>
                        <p className="text-xs text-slate-400">{item.fecha || 'Reciente'}</p>
                      </div>
                    </div>
                    <span
                      className={`font-bold text-lg ${
                        item.tipo === 'venta' || item.totalVenta
                          ? 'text-green-400'
                          : 'text-blue-400'
                      }`}
                    >
                      ${(item.total || item.totalVenta || 0).toLocaleString()}
                    </span>
                  </motion.div>
                ))}
            </div>
          </motion.div>
        </div>

        {/* Acciones Rápidas */}
        <AnimatePresence>
          {showQuickActions && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="glass rounded-2xl p-6 border border-purple-500/20"
            >
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <ArrowRight className="w-5 h-5 text-purple-400" />
                Acciones Rápidas
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Nueva Venta', icon: TrendingUp, color: 'green', panel: 'ventas' },
                  { label: 'Nueva Orden', icon: Package, color: 'blue', panel: 'ordenes' },
                  { label: 'Agregar Producto', icon: Plus, color: 'purple', panel: 'almacen' },
                  { label: 'Ver Reportes', icon: BarChart3, color: 'orange', panel: 'reportes' },
                ].map((action, index) => {
                  const actionButtonClasses = {
                    green:
                      'bg-gradient-to-br from-green-500/20 to-green-600/10 border-green-500/30 hover:shadow-green-500/20',
                    blue: 'bg-gradient-to-br from-blue-500/20 to-blue-600/10 border-blue-500/30 hover:shadow-blue-500/20',
                    purple:
                      'bg-gradient-to-br from-purple-500/20 to-purple-600/10 border-purple-500/30 hover:shadow-purple-500/20',
                    orange:
                      'bg-gradient-to-br from-orange-500/20 to-orange-600/10 border-orange-500/30 hover:shadow-orange-500/20',
                  };

                  const actionIconClasses = {
                    green: 'text-green-400',
                    blue: 'text-blue-400',
                    purple: 'text-purple-400',
                    orange: 'text-orange-400',
                  };

                  return (
                    <motion.button
                      key={action.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.05, y: -5 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setActivePanel(action.panel);
                        setShowQuickActions(false);
                      }}
                      className={`p-4 border rounded-xl flex flex-col items-center gap-2 hover:shadow-lg transition-all ${
                        actionButtonClasses[action.color]
                      }`}
                    >
                      <action.icon className={`w-6 h-6 ${actionIconClasses[action.color]}`} />
                      <span className="text-sm font-semibold">{action.label}</span>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  const MetricCard = ({ title, value, icon: Icon, color, trend }) => (
    <motion.div whileHover={{ y: -4 }} className="glass rounded-2xl p-6 border border-white/10">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-xl bg-gradient-to-br ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        {trend && (
          <span className="text-xs text-green-400 font-medium flex items-center gap-1">
            <ArrowUpRight className="w-3 h-3" />
            {trend}
          </span>
        )}
      </div>
      <p className="text-sm text-slate-400 mb-1">{title}</p>
      <p className="text-2xl font-bold">{value}</p>
    </motion.div>
  );

  const BancoCard = ({ nombre, data, onClick }) => {
    const nombres = {
      bovedaMonte: 'Bóveda Monte',
      utilidades: 'Utilidades',
      fletes: 'Fletes',
      azteca: 'Azteca',
      leftie: 'Leftie',
      profit: 'Profit',
    };

    return (
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onClick}
        className="glass rounded-xl p-4 cursor-pointer border border-white/10 hover:border-blue-500/30 transition-all"
      >
        <h3 className="font-bold mb-2">{nombres[nombre]}</h3>
        <div className="space-y-1">
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">Capital:</span>
            <span className="font-semibold text-green-400">
              ${data.capitalActual.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">Histórico:</span>
            <span className="font-semibold">${data.historico.toLocaleString()}</span>
          </div>
        </div>
      </motion.div>
    );
  };

  const ActividadItem = ({ item }) => (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex items-center justify-between p-3 glass rounded-lg hover:bg-white/5 transition-all"
    >
      <div className="flex items-center gap-3">
        <div
          className={`p-2 rounded-lg ${
            item.tipo === 'venta' ? 'bg-green-500/20' : 'bg-blue-500/20'
          }`}
        >
          {item.tipo === 'venta' ? (
            <TrendingUp className="w-5 h-5 text-green-400" />
          ) : (
            <Package className="w-5 h-5 text-blue-400" />
          )}
        </div>
        <div>
          <p className="font-semibold">{item.tipo === 'venta' ? 'Venta' : 'Orden de Compra'}</p>
          <p className="text-sm text-slate-400">{item.fecha}</p>
        </div>
      </div>
      <span className="font-bold">${item.total?.toLocaleString()}</span>
    </motion.div>
  );

  // ============================================
  // � PANEL ÓRDENES DE COMPRA - NUEVO COMPONENTE PREMIUM
  // ============================================
  const OrdenesPanel = () => <PanelOrdenesCompra />;

  // DISTRIBUIDORES PANEL
  const DistribuidoresPanel = () => {
    const [distribuidorExpandido, setDistribuidorExpandido] = useState(null);
    const [montoPago, setMontoPago] = useState('');
    const [mostrarModalPago, setMostrarModalPago] = useState(false);
    const [distribuidorSeleccionado, setDistribuidorSeleccionado] = useState(null);
    const [formPago, setFormPago] = useState({
      monto: '',
      fecha: new Date().toISOString().slice(0, 10),
      banco: 'bovedaMonte',
      referencia: '',
      observaciones: '',
    });

    // Calcular totales
    const totales = React.useMemo(() => {
      const total = distribuidores.reduce(
        (acc, d) => ({
          compras: acc.compras + (d.totalCompras || 0),
          adeudo: acc.adeudo + (d.adeudo || 0),
          pagado: acc.pagado + (d.pagado || 0),
          ordenes: acc.ordenes + (d.ordenes?.length || 0),
        }),
        { compras: 0, adeudo: 0, pagado: 0, ordenes: 0 }
      );
      return total;
    }, [distribuidores]);

    const handleRegistrarPago = useCallback(
      (e) => {
        e.preventDefault();

        if (!distribuidorSeleccionado || !formPago.monto) {
          showNotification('❌ Por favor completa todos los campos requeridos', 'error');
          return;
        }

        const monto = parseFloat(formPago.monto);
        if (monto <= 0 || monto > distribuidorSeleccionado.adeudo) {
          showNotification('❌ Monto inválido', 'error');
          return;
        }

        const resultado = registrarPagoDistribuidor({
          distribuidorId: distribuidorSeleccionado.id,
          monto,
          fecha: formPago.fecha,
          banco: formPago.banco,
          referencia: formPago.referencia,
          observaciones: formPago.observaciones,
        });

        if (resultado.success) {
          // Actualizar estado local
          const estado = verificarEstadoDistribuidores();
          setDistribuidores(estado.distribuidores);

          showNotification(
            `✅ Pago registrado: ${distribuidorSeleccionado.nombre} - $${monto.toLocaleString()}`,
            'success'
          );

          // Resetear formulario
          setFormPago({
            monto: '',
            fecha: new Date().toISOString().slice(0, 10),
            banco: 'bovedaMonte',
            referencia: '',
            observaciones: '',
          });
          setMostrarModalPago(false);
          setDistribuidorSeleccionado(null);
        } else {
          showNotification(`❌ ${resultado.message}`, 'error');
        }
      },
      [distribuidorSeleccionado, formPago, setDistribuidores, showNotification]
    );

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              📦 Distribuidores
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Gestión de proveedores y órdenes de compra
            </p>
          </div>
        </div>

        {/* KPIs Resumen */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-xl p-4 border border-white/10"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Total Compras</p>
                <p className="text-2xl font-bold text-white">${totales.compras.toLocaleString()}</p>
              </div>
              <DollarSign className="w-8 h-8 text-blue-400" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass rounded-xl p-4 border border-white/10"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Adeudo Pendiente</p>
                <p className="text-2xl font-bold text-red-400">
                  ${totales.adeudo.toLocaleString()}
                </p>
              </div>
              <AlertCircle className="w-8 h-8 text-red-400" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass rounded-xl p-4 border border-white/10"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Pagado</p>
                <p className="text-2xl font-bold text-green-400">
                  ${totales.pagado.toLocaleString()}
                </p>
              </div>
              <CheckCircle2 className="w-8 h-8 text-green-400" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass rounded-xl p-4 border border-white/10"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Órdenes Totales</p>
                <p className="text-2xl font-bold text-purple-400">{totales.ordenes}</p>
              </div>
              <Package className="w-8 h-8 text-purple-400" />
            </div>
          </motion.div>
        </div>

        {/* Tabla de Distribuidores */}
        <div className="glass rounded-2xl border border-white/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5">
                <tr>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-slate-300"></th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-slate-300">
                    Distribuidor
                  </th>
                  <th className="text-right py-4 px-6 text-sm font-semibold text-slate-300">
                    Total Compras
                  </th>
                  <th className="text-right py-4 px-6 text-sm font-semibold text-slate-300">
                    Adeudo
                  </th>
                  <th className="text-right py-4 px-6 text-sm font-semibold text-slate-300">
                    Pagado
                  </th>
                  <th className="text-center py-4 px-6 text-sm font-semibold text-slate-300">
                    Órdenes
                  </th>
                  <th className="text-center py-4 px-6 text-sm font-semibold text-slate-300">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                {distribuidores.map((dist, idx) => (
                  <React.Fragment key={dist.id}>
                    <motion.tr
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: idx * 0.05 }}
                      className="border-t border-white/5 hover:bg-white/5 transition-colors"
                    >
                      <td className="py-4 px-6">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() =>
                            setDistribuidorExpandido(
                              distribuidorExpandido === dist.id ? null : dist.id
                            )
                          }
                          className="text-slate-400 hover:text-white transition-colors"
                        >
                          {distribuidorExpandido === dist.id ? '▼' : '▶'}
                        </motion.button>
                      </td>
                      <td className="py-4 px-6">
                        <div>
                          <p className="font-semibold text-white">{dist.nombre}</p>
                          <p className="text-xs text-slate-400">{dist.codigo}</p>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <span className="text-blue-400 font-semibold">
                          ${(dist.totalCompras || 0).toLocaleString()}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <span
                          className={`font-semibold ${
                            dist.adeudo > 0 ? 'text-red-400' : 'text-green-400'
                          }`}
                        >
                          ${(dist.adeudo || 0).toLocaleString()}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <span className="text-green-400 font-semibold">
                          ${(dist.pagado || 0).toLocaleString()}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm font-semibold">
                          {dist.ordenes?.length || 0}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-center">
                        {dist.adeudo > 0 && (
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                              setDistribuidorSeleccionado(dist);
                              setMostrarModalPago(true);
                            }}
                            className="bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-2 rounded-lg text-sm font-medium hover:shadow-lg transition-shadow"
                          >
                            💰 Registrar Pago
                          </motion.button>
                        )}
                      </td>
                    </motion.tr>

                    {/* Tabla Expandible de Órdenes */}
                    <AnimatePresence>
                      {distribuidorExpandido === dist.id && (
                        <motion.tr
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <td colSpan={7} className="bg-white/5 p-6">
                            <div className="space-y-3">
                              <h4 className="font-semibold text-lg text-white mb-4">
                                📋 Órdenes de Compra - {dist.nombre}
                              </h4>
                              {dist.ordenes && dist.ordenes.length > 0 ? (
                                <div className="glass rounded-lg overflow-hidden">
                                  <table className="w-full">
                                    <thead className="bg-white/10">
                                      <tr>
                                        <th className="text-left py-3 px-4 text-sm font-semibold text-slate-300">
                                          OC
                                        </th>
                                        <th className="text-left py-3 px-4 text-sm font-semibold text-slate-300">
                                          Fecha
                                        </th>
                                        <th className="text-right py-3 px-4 text-sm font-semibold text-slate-300">
                                          Cantidad
                                        </th>
                                        <th className="text-right py-3 px-4 text-sm font-semibold text-slate-300">
                                          Costo/Unidad
                                        </th>
                                        <th className="text-right py-3 px-4 text-sm font-semibold text-slate-300">
                                          Costo Dist.
                                        </th>
                                        <th className="text-right py-3 px-4 text-sm font-semibold text-slate-300">
                                          Flete
                                        </th>
                                        <th className="text-right py-3 px-4 text-sm font-semibold text-slate-300">
                                          Total
                                        </th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {dist.ordenes.map((orden, oidx) => (
                                        <tr
                                          key={oidx}
                                          className="border-t border-white/5 hover:bg-white/5"
                                        >
                                          <td className="py-3 px-4">
                                            <span className="text-purple-400 font-mono text-sm">
                                              {orden.oc}
                                            </span>
                                          </td>
                                          <td className="py-3 px-4">
                                            <span className="text-slate-300 text-sm">
                                              {orden.fecha}
                                            </span>
                                          </td>
                                          <td className="py-3 px-4 text-right">
                                            <span className="text-blue-400 font-semibold">
                                              {orden.cantidad}
                                            </span>
                                          </td>
                                          <td className="py-3 px-4 text-right">
                                            <span className="text-slate-300">
                                              ${orden.costoPorUnidad.toLocaleString()}
                                            </span>
                                          </td>
                                          <td className="py-3 px-4 text-right">
                                            <span className="text-slate-300">
                                              ${orden.costoDistribuidor.toLocaleString()}
                                            </span>
                                          </td>
                                          <td className="py-3 px-4 text-right">
                                            <span className="text-slate-300">
                                              ${orden.costoTransporte.toLocaleString()}
                                            </span>
                                          </td>
                                          <td className="py-3 px-4 text-right">
                                            <span className="text-green-400 font-bold">
                                              ${orden.total.toLocaleString()}
                                            </span>
                                          </td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              ) : (
                                <p className="text-slate-400 text-center py-4">
                                  No hay órdenes registradas
                                </p>
                              )}
                            </div>
                          </td>
                        </motion.tr>
                      )}
                    </AnimatePresence>
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {distribuidores.length === 0 && (
          <div className="text-center text-slate-400 py-20">
            <Users className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p>No hay distribuidores registrados</p>
            <p className="text-sm mt-2">Los distribuidores se cargarán automáticamente</p>
          </div>
        )}

        {/* Modal de Pago */}
        <AnimatePresence>
          {mostrarModalPago && distribuidorSeleccionado && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
              onClick={() => setMostrarModalPago(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="glass rounded-2xl p-6 max-w-md w-full border border-white/10"
              >
                <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                  💰 Registrar Pago
                </h3>

                {/* Info del Distribuidor */}
                <div className="mb-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                  <p className="text-sm text-blue-300 mb-1">Distribuidor:</p>
                  <p className="font-bold text-white">{distribuidorSeleccionado.nombre}</p>
                  <p className="text-sm text-blue-300 mt-2">Adeudo pendiente:</p>
                  <p className="text-2xl font-bold text-red-400">
                    ${distribuidorSeleccionado.adeudo.toLocaleString()}
                  </p>
                </div>

                <form onSubmit={handleRegistrarPago} className="space-y-4">
                  {/* Monto */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">
                      Monto a Pagar *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={formPago.monto}
                      onChange={(e) => setFormPago({ ...formPago, monto: e.target.value })}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all text-white"
                      placeholder="0.00"
                    />
                  </div>

                  {/* Fecha */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">
                      Fecha *
                    </label>
                    <input
                      type="date"
                      required
                      value={formPago.fecha}
                      onChange={(e) => setFormPago({ ...formPago, fecha: e.target.value })}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all text-white"
                    />
                  </div>

                  {/* Banco */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">
                      Banco de Origen
                    </label>
                    <select
                      value={formPago.banco}
                      onChange={(e) => setFormPago({ ...formPago, banco: e.target.value })}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all text-white"
                    >
                      <option value="bovedaMonte">💎 Bóveda Monte</option>
                      <option value="utilidades">📈 Utilidades</option>
                      <option value="fletes">🚚 Fletes</option>
                      <option value="azteca">🏦 Azteca</option>
                      <option value="leftie">💳 Leftie</option>
                      <option value="profit">💵 Profit</option>
                    </select>
                  </div>

                  {/* Referencia */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">
                      Referencia
                    </label>
                    <input
                      type="text"
                      value={formPago.referencia}
                      onChange={(e) => setFormPago({ ...formPago, referencia: e.target.value })}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all text-white"
                      placeholder="Núm. transacción"
                    />
                  </div>

                  {/* Observaciones */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">
                      Observaciones
                    </label>
                    <textarea
                      rows={3}
                      value={formPago.observaciones}
                      onChange={(e) => setFormPago({ ...formPago, observaciones: e.target.value })}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all text-white resize-none"
                      placeholder="Notas adicionales..."
                    />
                  </div>

                  {/* Botones */}
                  <div className="flex gap-3 pt-4">
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setMostrarModalPago(false);
                        setDistribuidorSeleccionado(null);
                      }}
                      className="flex-1 px-4 py-3 bg-slate-700 hover:bg-slate-600 rounded-xl font-semibold transition-colors"
                    >
                      Cancelar
                    </motion.button>
                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex-1 px-4 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 rounded-xl font-semibold transition-all"
                    >
                      Registrar Pago
                    </motion.button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  // ALMACEN PANEL
  const AlmacenPanel = () => {
    const [activeTab, setActiveTab] = useState('inventory');
    const [showAddModal, setShowAddModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('nombre');
    const [selectedCategory, setSelectedCategory] = useState('todas');

    // Cálculos dinámicos optimizados con useMemo
    const totalInventario = React.useMemo(
      () => (almacen?.stock || []).reduce((sum, item) => sum + (item.valorInventario || 0), 0),
      [almacen]
    );

    const totalProductos = (almacen?.stock || []).length;

    // Calcular stock actual total (suma de cantidades de todos los productos)
    const stockActualTotal = React.useMemo(
      () => (almacen?.stock || []).reduce((sum, item) => sum + (item.cantidad || 0), 0),
      [almacen]
    );

    // Calcular total de entradas acumuladas (órdenes de compra)
    const totalEntradas = React.useMemo(
      () =>
        (ordenesCompra || []).reduce((sum, orden) => {
          const productos = orden?.productos || [];
          return sum + productos.reduce((pSum, p) => pSum + (p?.cantidad || 0), 0);
        }, 0),
      [ordenesCompra]
    );

    // Calcular total de salidas acumuladas (ventas)
    const totalSalidas = React.useMemo(
      () =>
        (ventas || []).reduce((sum, venta) => {
          const productos = venta?.productos || [];
          return sum + productos.reduce((pSum, p) => pSum + (p?.cantidad || 0), 0);
        }, 0),
      [ventas]
    );

    const productosStockBajo = React.useMemo(
      () =>
        (almacen?.stock || []).filter((item) => (item.cantidad || 0) <= (item.cantidadMinima || 0))
          .length,
      [almacen]
    );

    const valorPromedioProducto = React.useMemo(
      () => (totalProductos > 0 && totalInventario != null ? totalInventario / totalProductos : 0),
      [totalInventario, totalProductos]
    );

    const categorias = React.useMemo(
      () => [...new Set((almacen?.stock || []).map((item) => item.categoria))],
      [almacen]
    );

    // Filtrado simple y eficiente sin useAdvancedSearch
    const productosFiltrados = React.useMemo(() => {
      let filtered = almacen?.stock || [];

      // Filtrar por categoría
      if (selectedCategory !== 'todas') {
        filtered = filtered.filter((item) => item.categoria === selectedCategory);
      }

      // Filtrar por término de búsqueda
      if (searchTerm) {
        const search = searchTerm.toLowerCase();
        filtered = filtered.filter(
          (item) =>
            item.nombre?.toLowerCase().includes(search) ||
            item.id?.toLowerCase().includes(search) ||
            item.categoria?.toLowerCase().includes(search)
        );
      }

      // Ordenar
      return filtered.sort((a, b) => {
        switch (sortBy) {
          case 'nombre':
            return a.nombre.localeCompare(b.nombre);
          case 'cantidad':
            return b.cantidad - a.cantidad;
          case 'valor':
            return b.valorInventario - a.valorInventario;
          case 'margen':
            return b.margenGanancia - a.margenGanancia;
          default:
            return 0;
        }
      });
    }, [almacen, selectedCategory, searchTerm, sortBy]);

    return (
      <div className="space-y-6">
        {/* Header Premium con Animaciones */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4"
        >
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent">
              Centro de Almacén
            </h1>
            <p className="text-slate-400 mt-2">Gestión inteligente de inventarios</p>
          </div>

          <div className="flex items-center gap-3">
            <DragModeToggle
              enabled={dragModeEnabled}
              onToggle={() => setDragModeEnabled(!dragModeEnabled)}
            />

            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0 10px 30px rgba(139, 92, 246, 0.3)' }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAddModal(true)}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 rounded-2xl font-semibold flex items-center gap-2 shadow-lg"
            >
              <Plus className="w-5 h-5" />
              Agregar Producto
            </motion.button>
          </div>
        </motion.div>

        {/* KPIs Avanzados con Microanimaciones */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {[
            {
              title: 'Stock Actual',
              value: stockActualTotal.toLocaleString(),
              icon: Package,
              color: 'blue',
              gradient: 'from-blue-400 to-cyan-500',
              bgGradient: 'from-blue-500/10 to-cyan-500/5',
              change: `${stockActualTotal}`,
              description: 'unidades disponibles',
            },
            {
              title: 'Entradas Totales',
              value: totalEntradas.toLocaleString(),
              icon: ArrowDownCircle,
              color: 'emerald',
              gradient: 'from-emerald-400 to-green-500',
              bgGradient: 'from-emerald-500/10 to-green-500/5',
              change: `+${totalEntradas}`,
              description: 'órdenes de compra',
            },
            {
              title: 'Salidas Totales',
              value: totalSalidas.toLocaleString(),
              icon: ArrowUpCircle,
              color: 'red',
              gradient: 'from-red-400 to-pink-500',
              bgGradient: 'from-red-500/10 to-pink-500/5',
              change: `-${totalSalidas}`,
              description: 'productos vendidos',
            },
            {
              title: 'Valor Total',
              value: `$${totalInventario.toLocaleString()}`,
              icon: DollarSign,
              color: 'green',
              gradient: 'from-green-400 to-emerald-500',
              bgGradient: 'from-green-500/10 to-emerald-500/5',
              change: '+12.5%',
              description: 'valor del inventario',
            },
          ].map((kpi, index) => {
            const kpiBorderClasses = {
              green: 'border-green-500/20',
              blue: 'border-blue-500/20',
              red: 'border-red-500/20',
              purple: 'border-purple-500/20',
              emerald: 'border-emerald-500/20',
            };

            const kpiTextClasses = {
              green: 'text-green-400',
              blue: 'text-blue-400',
              red: 'text-red-400',
              purple: 'text-purple-400',
              emerald: 'text-emerald-400',
            };

            const kpiBadgeClasses = {
              green: 'text-green-400 bg-green-400/20',
              blue: 'text-blue-400 bg-blue-400/20',
              red: 'text-red-400 bg-red-400/20',
              purple: 'text-purple-400 bg-purple-400/20',
              emerald: 'text-emerald-400 bg-emerald-400/20',
            };

            return (
              <motion.div
                key={kpi.title}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{
                  scale: 1.05,
                  boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                  transition: { duration: 0.2 },
                }}
                className={`glass rounded-2xl p-6 border ${
                  kpiBorderClasses[kpi.color]
                } bg-gradient-to-br ${kpi.bgGradient} cursor-pointer group`}
              >
                <div className="flex items-center justify-between mb-4">
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                    className={`p-3 rounded-xl bg-gradient-to-r ${kpi.gradient} group-hover:shadow-lg transition-all duration-300`}
                  >
                    <kpi.icon className="w-6 h-6 text-white" />
                  </motion.div>
                  <span
                    className={`text-xs font-semibold px-2 py-1 rounded-full ${
                      kpiBadgeClasses[kpi.color]
                    }`}
                  >
                    {kpi.change}
                  </span>
                </div>
                <h3 className="text-sm font-semibold text-slate-400 mb-2">{kpi.title}</h3>
                <p className={`text-3xl font-bold mb-1 ${kpiTextClasses[kpi.color]}`}>
                  {kpi.value}
                </p>
                <p className="text-xs text-slate-500">{kpi.description}</p>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Navegación por Pestañas con Efectos */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="glass rounded-2xl border border-white/10"
        >
          <div className="flex border-b border-white/10 overflow-x-auto">
            {[
              { key: 'inventory', label: 'Inventario', icon: Package },
              { key: 'entries', label: 'Entradas', icon: ArrowDownRight },
              { key: 'exits', label: 'Salidas', icon: ArrowUpRight },
              { key: 'analytics', label: 'Analytics', icon: BarChart3 },
            ].map((tab) => (
              <motion.button
                key={tab.key}
                whileHover={{ backgroundColor: 'rgba(139, 92, 246, 0.1)' }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveTab(tab.key)}
                className={`flex-1 min-w-[120px] px-6 py-4 font-semibold transition-all duration-300 flex items-center justify-center gap-2 relative ${
                  activeTab === tab.key
                    ? 'text-purple-400 bg-purple-500/10'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
                {activeTab === tab.key && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-400 to-pink-400"
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
              </motion.button>
            ))}
          </div>

          <div className="p-6">
            <AnimatePresence mode="wait">
              {activeTab === 'inventory' && (
                <motion.div
                  key="inventory"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  {/* Controles de Filtrado Avanzados */}
                  <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <div className="flex-1">
                      <div className="relative group">
                        <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 group-focus-within:text-purple-400 transition-colors" />
                        <input
                          type="text"
                          placeholder="Buscar productos..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300"
                        />
                      </div>
                    </div>
                    <motion.select
                      whileFocus={{ scale: 1.02 }}
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-purple-500 min-w-[150px]"
                    >
                      <option value="todas" className="bg-slate-800">
                        Todas las categorías
                      </option>
                      {categorias.map((cat) => (
                        <option key={cat} value={cat} className="bg-slate-800">
                          {cat}
                        </option>
                      ))}
                    </motion.select>
                    <motion.select
                      whileFocus={{ scale: 1.02 }}
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-purple-500 min-w-[150px]"
                    >
                      <option value="nombre" className="bg-slate-800">
                        Ordenar por Nombre
                      </option>
                      <option value="cantidad" className="bg-slate-800">
                        Ordenar por Cantidad
                      </option>
                      <option value="valor" className="bg-slate-800">
                        Ordenar por Valor
                      </option>
                      <option value="margen" className="bg-slate-800">
                        Ordenar por Margen
                      </option>
                    </motion.select>
                  </div>

                  {/* Tabla de Productos Premium */}
                  <div className="glass rounded-xl border border-white/10 overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gradient-to-r from-purple-500/10 to-pink-500/10">
                          <tr>
                            <th className="px-4 py-4 text-center w-12">
                              <SelectionCheckbox
                                checked={productosSelection.isSelectAllMode}
                                onChange={productosSelection.toggleSelectAll}
                                label=""
                              />
                            </th>
                            {dragModeEnabled && <th className="px-2 py-4 w-8"></th>}
                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                              Producto
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                              Cantidad
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                              Costo Unit.
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                              Precio Venta
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                              Valor Total
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                              Margen %
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                              Estado
                            </th>
                            <th className="px-6 py-4 text-center text-xs font-semibold text-slate-400 uppercase tracking-wider">
                              Acciones
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          {productosFiltrados.map((producto, index) => {
                            const TableRow = dragModeEnabled ? DraggableItem : motion.tr;
                            const dragProps = dragModeEnabled
                              ? {
                                  item: producto,
                                  index,
                                  onDragStart: dragDropProductos.handleDragStart,
                                  onDragEnd: dragDropProductos.handleDragEnd,
                                  onDragEnter: dragDropProductos.handleDragEnter,
                                  onDragLeave: dragDropProductos.handleDragLeave,
                                  onDragOver: dragDropProductos.handleDragOver,
                                  onDrop: dragDropProductos.handleDrop,
                                  isDraggedOver: dragDropProductos.dragOverItem?.index === index,
                                  isDragging: dragDropProductos.isDragging,
                                }
                              : {};

                            return (
                              <TableRow
                                key={producto.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                whileHover={{
                                  backgroundColor: 'rgba(255, 255, 255, 0.02)',
                                  transition: { duration: 0.2 },
                                }}
                                className="hover:bg-white/5 transition-all duration-200 group cursor-context-menu"
                                onContextMenu={(e) => {
                                  e.preventDefault();
                                  setContextMenu({
                                    x: e.clientX,
                                    y: e.clientY,
                                    items: [
                                      {
                                        label: 'Ver detalles',
                                        icon: Eye,
                                        onClick: () => {
                                          showNotification(
                                            `Producto: ${producto.nombre} - Stock: ${producto.cantidad}`,
                                            'info'
                                          );
                                        },
                                      },
                                      {
                                        label: 'Copiar ID',
                                        icon: Copy,
                                        onClick: () => {
                                          navigator.clipboard.writeText(producto.id);
                                          showNotification('ID copiado al portapapeles', 'success');
                                        },
                                      },
                                      { divider: true },
                                      {
                                        label: 'Eliminar producto',
                                        icon: Trash2,
                                        danger: true,
                                        onClick: () => deleteProducto(producto.id),
                                      },
                                    ],
                                  });
                                }}
                                {...dragProps}
                              >
                                <td className="px-4 py-4 text-center">
                                  <SelectionCheckbox
                                    checked={productosSelection.isSelected(producto.id)}
                                    onChange={() => productosSelection.toggleItem(producto.id)}
                                    label=""
                                  />
                                </td>
                                {dragModeEnabled && (
                                  <td className="px-2 py-4 cursor-grab">
                                    {/* El drag handle ya está en DraggableItem */}
                                  </td>
                                )}
                                <td className="px-6 py-4">
                                  <div className="flex items-center space-x-4">
                                    <motion.div
                                      whileHover={{ scale: 1.1 }}
                                      className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center"
                                    >
                                      <Package className="w-6 h-6 text-white" />
                                    </motion.div>
                                    <div>
                                      <p className="text-sm font-semibold text-white group-hover:text-purple-400 transition-colors">
                                        {searchTerm ? (
                                          <span
                                            dangerouslySetInnerHTML={{
                                              __html: highlightMatch(producto.nombre, searchTerm),
                                            }}
                                          />
                                        ) : (
                                          producto.nombre
                                        )}
                                      </p>
                                      <p className="text-xs text-slate-400">
                                        ID:{' '}
                                        {searchTerm ? (
                                          <span
                                            dangerouslySetInnerHTML={{
                                              __html: highlightMatch(producto.id, searchTerm),
                                            }}
                                          />
                                        ) : (
                                          producto.id
                                        )}
                                      </p>
                                      <p className="text-xs text-slate-500">{producto.categoria}</p>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-6 py-4">
                                  <div className="flex items-center gap-2">
                                    <span
                                      className={`text-lg font-bold ${
                                        (producto.cantidad || 0) <= (producto.cantidadMinima || 0)
                                          ? 'text-red-400'
                                          : (producto.cantidad || 0) >=
                                              (producto.cantidadMaxima || 100) * 0.8
                                            ? 'text-green-400'
                                            : 'text-blue-400'
                                      }`}
                                    >
                                      {producto.cantidad || 0}
                                    </span>
                                    <div className="flex flex-col text-xs text-slate-500">
                                      <span>Min: {producto.cantidadMinima || 0}</span>
                                      <span>Max: {producto.cantidadMaxima || 100}</span>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-6 py-4">
                                  <span className="text-sm font-semibold text-slate-300">
                                    ${(producto.costoUnitario || 0).toLocaleString()}
                                  </span>
                                </td>
                                <td className="px-6 py-4">
                                  <span className="text-sm font-semibold text-green-400">
                                    ${(producto.precioVenta || 0).toLocaleString()}
                                  </span>
                                </td>
                                <td className="px-6 py-4">
                                  <span className="text-sm font-bold text-purple-400">
                                    ${(producto.valorInventario || 0).toLocaleString()}
                                  </span>
                                </td>
                                <td className="px-6 py-4">
                                  <motion.span
                                    whileHover={{ scale: 1.1 }}
                                    className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                                      (producto.margenGanancia || 0) >= 60
                                        ? 'bg-green-100 text-green-800'
                                        : (producto.margenGanancia || 0) >= 40
                                          ? 'bg-yellow-100 text-yellow-800'
                                          : 'bg-red-100 text-red-800'
                                    }`}
                                  >
                                    {producto.margenGanancia || 0}%
                                  </motion.span>
                                </td>
                                <td className="px-6 py-4">
                                  <motion.span
                                    whileHover={{ scale: 1.05 }}
                                    className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                                      producto.estado === 'Activo'
                                        ? 'bg-green-100 text-green-800'
                                        : producto.estado === 'Stock Bajo'
                                          ? 'bg-red-100 text-red-800'
                                          : 'bg-yellow-100 text-yellow-800'
                                    }`}
                                  >
                                    {producto.estado}
                                  </motion.span>
                                </td>
                                <td className="px-6 py-4 text-center">
                                  <div className="flex justify-center gap-2">
                                    <motion.button
                                      whileHover={{ scale: 1.1 }}
                                      whileTap={{ scale: 0.9 }}
                                      className="p-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors"
                                    >
                                      <Eye className="w-4 h-4" />
                                    </motion.button>
                                    <motion.button
                                      whileHover={{ scale: 1.1 }}
                                      whileTap={{ scale: 0.9 }}
                                      className="p-2 bg-purple-500/20 text-purple-400 rounded-lg hover:bg-purple-500/30 transition-colors"
                                    >
                                      <Settings className="w-4 h-4" />
                                    </motion.button>
                                  </div>
                                </td>
                              </TableRow>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'entries' && (
                <motion.div
                  key="entries"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <ArrowDownRight className="w-6 h-6 text-green-400" />
                    Entradas de Mercancía
                  </h3>
                  <div className="grid gap-4">
                    {(almacen?.entradas || []).map((entrada, index) => (
                      <motion.div
                        key={entrada?.id || index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: 1.02 }}
                        className="glass rounded-xl p-6 border border-green-500/20 bg-gradient-to-r from-green-500/10 to-emerald-500/5"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                          <div>
                            <p className="text-sm text-slate-400">Producto</p>
                            <p className="font-semibold text-white">{entrada?.nombre || 'N/A'}</p>
                            <p className="text-xs text-slate-500">ID: {entrada?.id || 'N/A'}</p>
                          </div>
                          <div>
                            <p className="text-sm text-slate-400">Cantidad</p>
                            <p className="font-bold text-green-400 text-xl">
                              +{entrada?.cantidad || 0}
                            </p>
                            <p className="text-xs text-slate-500">
                              Costo Unit: ${(entrada?.costoUnitario || 0).toLocaleString()}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-slate-400">Costo Total</p>
                            <p className="font-bold text-blue-400 text-xl">
                              ${(entrada?.costoTotal || 0).toLocaleString()}
                            </p>
                            <p className="text-xs text-slate-500">
                              Factura: {entrada?.numeroFactura || 'N/A'}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-slate-400">Proveedor</p>
                            <p className="font-semibold text-white">
                              {entrada?.proveedor || 'N/A'}
                            </p>
                            <p className="text-xs text-slate-500">{entrada?.fecha || 'N/A'}</p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === 'exits' && (
                <motion.div
                  key="exits"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <ArrowUpRight className="w-6 h-6 text-red-400" />
                    Salidas de Mercancía
                  </h3>
                  <div className="grid gap-4">
                    {(almacen?.salidas || []).map((salida, index) => (
                      <motion.div
                        key={salida?.id || index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: 1.02 }}
                        className="glass rounded-xl p-6 border border-red-500/20 bg-gradient-to-r from-red-500/10 to-pink-500/5"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                          <div>
                            <p className="text-sm text-slate-400">Producto</p>
                            <p className="font-semibold text-white">{salida?.nombre || 'N/A'}</p>
                            <p className="text-xs text-slate-500">ID: {salida?.id || 'N/A'}</p>
                          </div>
                          <div>
                            <p className="text-sm text-slate-400">Cantidad</p>
                            <p className="font-bold text-red-400 text-xl">
                              -{salida?.cantidad || 0}
                            </p>
                            <p className="text-xs text-slate-500">
                              Motivo: {salida?.motivoSalida || 'N/A'}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-slate-400">Valor Total</p>
                            <p className="font-bold text-green-400 text-xl">
                              ${(salida?.valorTotal || 0).toLocaleString()}
                            </p>
                            <p className="text-xs text-slate-500">
                              Precio Unit: ${(salida?.precioVenta || 0).toLocaleString()}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-slate-400">Cliente</p>
                            <p className="font-semibold text-white">{salida?.cliente || 'N/A'}</p>
                            <p className="text-xs text-slate-500">{salida?.fecha || 'N/A'}</p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === 'analytics' && (
                <motion.div
                  key="analytics"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <BarChart3 className="w-6 h-6 text-purple-400" />
                    Analytics de Inventario
                  </h3>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="glass rounded-xl p-6 border border-white/10">
                      <h4 className="text-lg font-semibold mb-4">Distribución por Categoría</h4>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={categorias.map((cat) => ({
                                name: cat,
                                value: (almacen?.stock || []).filter(
                                  (item) => item.categoria === cat
                                ).length,
                                fill:
                                  cat === 'Electrónicos'
                                    ? '#8B5CF6'
                                    : cat === 'Mobiliario'
                                      ? '#EC4899'
                                      : cat === 'Accesorios'
                                        ? '#F59E0B'
                                        : '#10B981',
                              }))}
                              cx="50%"
                              cy="50%"
                              outerRadius={80}
                              dataKey="value"
                            />
                            <Tooltip />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    <div className="glass rounded-xl p-6 border border-white/10">
                      <h4 className="text-lg font-semibold mb-4">Valor por Producto</h4>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={(almacen?.stock || []).slice(0, 5)}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                            <XAxis dataKey="nombre" stroke="#9CA3AF" />
                            <YAxis stroke="#9CA3AF" />
                            <Tooltip />
                            <Bar dataKey="valorInventario" fill="#8B5CF6" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Modal Agregar Producto Premium */}
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowAddModal(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="glass rounded-2xl p-8 w-full max-w-2xl border border-white/20"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Agregar Nuevo Producto
                </h2>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowAddModal(false)}
                  className="p-2 rounded-xl bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                >
                  <X className="w-6 h-6" />
                </motion.button>
              </div>

              <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Nombre del Producto */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-purple-400 flex items-center gap-2">
                    <Package className="w-4 h-4" />
                    Nombre del Producto *
                  </label>
                  <input
                    type="text"
                    onFocus={(e) => (e.target.placeholder = '')}
                    onBlur={(e) => (e.target.placeholder = 'Ej: MacBook Pro 16')}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all text-white"
                    placeholder="Ej: MacBook Pro 16"
                  />
                  <p className="text-xs text-slate-400">📝 Descripción del artículo a almacenar</p>
                </div>

                {/* Categoría */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-blue-400 flex items-center gap-2">
                    <List className="w-4 h-4" />
                    Categoría *
                  </label>
                  <select className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-white">
                    <option value="" className="bg-slate-800">
                      Seleccionar categoría
                    </option>
                    <option value="Electrónicos" className="bg-slate-800">
                      📱 Electrónicos
                    </option>
                    <option value="Mobiliario" className="bg-slate-800">
                      🪑 Mobiliario
                    </option>
                    <option value="Accesorios" className="bg-slate-800">
                      🔧 Accesorios
                    </option>
                    <option value="Herramientas" className="bg-slate-800">
                      🛠️ Herramientas
                    </option>
                  </select>
                  <p className="text-xs text-slate-400">🏷️ Tipo de producto para organización</p>
                </div>

                {/* Cantidad Inicial */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-green-400 flex items-center gap-2">
                    <Package className="w-4 h-4" />
                    Cantidad Inicial *
                  </label>
                  <input
                    type="number"
                    onFocus={(e) => {
                      if (e.target.value === '0') e.target.value = '';
                    }}
                    onBlur={(e) => {
                      if (e.target.value === '') e.target.value = '0';
                    }}
                    defaultValue="0"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all text-white"
                    placeholder="Ingresa cantidad"
                    min="0"
                  />
                  <p className="text-xs text-slate-400">📦 Unidades que ingresan al inventario</p>
                </div>

                {/* Costo Unitario */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-red-400 flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    Costo Unitario * (USD)
                  </label>
                  <input
                    type="number"
                    onFocus={(e) => {
                      if (e.target.value === '0' || e.target.value === '0.00') e.target.value = '';
                    }}
                    onBlur={(e) => {
                      if (e.target.value === '') e.target.value = '0.00';
                    }}
                    defaultValue="0.00"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all text-white"
                    placeholder="Ingresa precio de compra"
                    min="0"
                    step="0.01"
                  />
                  <p className="text-xs text-red-300">
                    💸 LO QUE TE COSTÓ COMPRARLO (precio de adquisición)
                  </p>
                </div>

                {/* Precio de Venta */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-emerald-400 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    Precio de Venta * (USD)
                  </label>
                  <input
                    type="number"
                    onFocus={(e) => {
                      if (e.target.value === '0' || e.target.value === '0.00') e.target.value = '';
                    }}
                    onBlur={(e) => {
                      if (e.target.value === '') e.target.value = '0.00';
                    }}
                    defaultValue="0.00"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all text-white"
                    placeholder="Ingresa precio de venta"
                    min="0"
                    step="0.01"
                  />
                  <p className="text-xs text-emerald-300">
                    💰 LO QUE COBRAS AL CLIENTE (precio de venta final)
                  </p>
                </div>

                {/* Proveedor */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-orange-400 flex items-center gap-2">
                    <Building2 className="w-4 h-4" />
                    Proveedor
                  </label>
                  <input
                    type="text"
                    onFocus={(e) => (e.target.placeholder = '')}
                    onBlur={(e) => (e.target.placeholder = 'Nombre del proveedor')}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all text-white"
                    placeholder="Nombre del proveedor"
                  />
                  <p className="text-xs text-slate-400">
                    🏢 Empresa o persona que te vende este producto
                  </p>
                </div>

                {/* Stock Mínimo */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-yellow-400 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    Stock Mínimo
                  </label>
                  <input
                    type="number"
                    onFocus={(e) => {
                      if (e.target.value === '0') e.target.value = '';
                    }}
                    onBlur={(e) => {
                      if (e.target.value === '') e.target.value = '0';
                    }}
                    defaultValue="0"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 transition-all text-white"
                    placeholder="Cantidad mínima"
                    min="0"
                  />
                  <p className="text-xs text-yellow-300">
                    ⚠️ Cantidad mínima para activar ALERTA de reorden
                  </p>
                </div>

                {/* Stock Máximo */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-cyan-400 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    Stock Máximo
                  </label>
                  <input
                    type="number"
                    onFocus={(e) => {
                      if (e.target.value === '0') e.target.value = '';
                    }}
                    onBlur={(e) => {
                      if (e.target.value === '') e.target.value = '0';
                    }}
                    defaultValue="0"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all text-white"
                    placeholder="Capacidad máxima"
                    min="0"
                  />
                  <p className="text-xs text-slate-400">
                    📊 Capacidad máxima de almacenamiento recomendada
                  </p>
                </div>

                {/* Ubicación */}
                <div className="md:col-span-2 space-y-2">
                  <label className="text-sm font-semibold text-pink-400 flex items-center gap-2">
                    <Warehouse className="w-4 h-4" />
                    Ubicación en Almacén
                  </label>
                  <input
                    type="text"
                    onFocus={(e) => (e.target.placeholder = '')}
                    onBlur={(e) => (e.target.placeholder = 'Ej: Pasillo A, Estante 3, Nivel 2')}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 transition-all text-white"
                    placeholder="Ej: Pasillo A, Estante 3, Nivel 2"
                  />
                  <p className="text-xs text-slate-400">
                    📍 Ubicación física para localizar el producto rápidamente
                  </p>
                </div>

                <div className="md:col-span-2 flex gap-4 mt-8">
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 px-6 py-3 bg-slate-600 hover:bg-slate-500 rounded-xl font-semibold transition-colors"
                  >
                    Cancelar
                  </motion.button>
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02, boxShadow: '0 10px 30px rgba(139, 92, 246, 0.3)' }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 rounded-xl font-semibold flex items-center justify-center gap-2"
                  >
                    <Plus className="w-5 h-5" />
                    Agregar Producto
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}

        {/* 🎨 BULK ACTIONS BAR */}
        <BulkActionsBar
          selectedCount={productosSelection.selectedCount}
          totalCount={(almacen?.stock || []).length}
          onDelete={handleBulkDeleteProductos}
          onExport={handleBulkExportProductos}
          onClearSelection={productosSelection.clearSelection}
          isProcessing={bulkActionsManager.isProcessing}
        />

        {/* 🎨 DRAG OVERLAY */}
        <DragOverlay
          isDragging={dragDropProductos.isDragging}
          itemName={dragDropProductos.draggedItem?.item?.nombre}
        />
      </div>
    );
  };

  // VENTAS PANEL
  const VentasPanel = () => {
    const [showForm, setShowForm] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filtroEstatus, setFiltroEstatus] = useState('Todos'); // ⭐ NUEVO: Filtro de estatus
    const [showMarcarPagadoModal, setShowMarcarPagadoModal] = useState(false); // ⭐ NUEVO: Modal
    const [ventaSeleccionada, setVentaSeleccionada] = useState(null); // ⭐ NUEVO: Venta a marcar
    const [bancoDestinoPago, setBancoDestinoPago] = useState('bovedaMonte'); // ⭐ NUEVO: Banco seleccionado
    const [formData, setFormData] = useState({
      cliente: '',
      productos: [{ nombre: '', cantidad: 0, precioUnitario: 0, precioCompra: 0 }],
      estadoPago: 'completo',
      montoAbonado: 0,
      precioFlete: 500,
      destino: 'bovedaMonte', // ⭐ NUEVO: Campo destino
    });

    // Advanced search integration for ventas
    const advancedSearch = useAdvancedSearch(ventas, ['cliente', 'id', 'tipo', 'fecha']);

    React.useEffect(() => {
      advancedSearch.setQuery(searchTerm);
    }, [searchTerm, advancedSearch]);

    // ⭐ NUEVO: Filtrar ventas por búsqueda Y estatus
    let ventasFiltradas =
      advancedSearch.filteredData.length > 0 && searchTerm ? advancedSearch.filteredData : ventas;

    if (filtroEstatus !== 'Todos') {
      ventasFiltradas = ventasFiltradas.filter((v) => v.estatus === filtroEstatus);
    }

    // ⭐ NUEVO: Función para marcar venta como pagada (Usa función del Excel)
    const handleMarcarComoPagado = () => {
      if (!ventaSeleccionada) return;

      // Usar la función de lógica del Excel
      marcarVentaPagada(ventaSeleccionada.id, bancoDestinoPago);

      // Cerrar modal
      setShowMarcarPagadoModal(false);
      setVentaSeleccionada(null);
      setBancoDestinoPago('bovedaMonte');
    };

    const calcularTotalVenta = () => {
      // Total de productos + flete (una sola vez)
      const totalProductos = (formData?.productos || []).reduce(
        (sum, p) => sum + (p?.precioUnitario || 0) * (p?.cantidad || 0),
        0
      );
      return totalProductos + (formData?.precioFlete || 0);
    };

    const calcularFletes = () => {
      // El flete es un costo único por venta
      return formData?.precioFlete || 0;
    };

    const calcularUtilidades = () => {
      // Utilidad = (Precio Venta - Precio Compra) * Cantidad
      return (formData?.productos || []).reduce(
        (sum, p) => sum + ((p?.precioUnitario || 0) - (p?.precioCompra || 0)) * (p?.cantidad || 0),
        0
      );
    };

    const registrarVenta = () => {
      const totalVenta = calcularTotalVenta();
      const totalFletes = calcularFletes();
      const totalUtilidades = calcularUtilidades();

      // ⭐ NUEVA LÓGICA DEL EXCEL: Ventas siempre empiezan como PENDIENTE
      const nuevaVenta = {
        id: Date.now(),
        ...formData,
        totalVenta,
        totalFletes,
        totalUtilidades,
        tipo: 'venta',
        fecha: new Date().toISOString(),
        // ⭐ CAMPOS DEL EXCEL
        estatus: 'Pendiente', // Siempre pendiente al crear
        estadoPago: 'pendiente', // Para compatibilidad
        adeudo: totalVenta, // Inicialmente debe el total
        montoPagado: 0, // Aún no ha pagado nada
        destino: formData.destino || 'bovedaMonte', // Banco donde se acreditará cuando se pague
        concepto:
          formData.concepto || `Venta a ${formData.cliente} - ${new Date().toLocaleDateString()}`,
        ocRelacionada: formData.ocRelacionada || 'N/A',
      };

      setVentas([...ventas, nuevaVenta]);

      // ⭐ Crear o actualizar cliente (sin modificar adeudo directo, se calcula dinámicamente)
      const clienteExistente = clientes.find((c) => c.nombre === formData.cliente);
      if (clienteExistente) {
        setClientes(
          clientes.map((c) =>
            c.nombre === formData.cliente
              ? {
                  ...c,
                  ventas: [...(c.ventas || []), nuevaVenta.id],
                  totalComprado: (c.totalComprado || 0) + totalVenta,
                }
              : c
          )
        );
      } else {
        setClientes([
          ...clientes,
          {
            id: `CLI-${Date.now()}`,
            nombre: formData.cliente,
            totalComprado: totalVenta,
            totalAbonado: 0,
            estado: 'activo',
            observaciones: '',
            ventas: [nuevaVenta.id],
          },
        ]);
      }

      // ⭐ NO actualizamos bancos aquí - solo cuando se marque como pagado
      // Solo registramos en histórico para tracking
      setBancos({
        ...bancos,
        bovedaMonte: {
          ...bancos.bovedaMonte,
          historico: bancos.bovedaMonte.historico + totalVenta,
        },
        fletes: {
          ...bancos.fletes,
          historico: bancos.fletes.historico + totalFletes,
        },
        utilidades: {
          ...bancos.utilidades,
          historico: bancos.utilidades.historico + totalUtilidades,
        },
      });

      // Actualizar almacén (salidas) - esto sí se hace inmediatamente
      const nuevasSalidas = [];
      const nuevoStock = almacen.stock.map((item) => {
        const productoVendido = formData.productos.find((p) => p.nombre === item.nombre);
        if (productoVendido) {
          nuevasSalidas.push({
            ...productoVendido,
            fecha: new Date().toISOString(),
            id: `SAL-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            motivoSalida: 'Venta',
            cliente: formData.cliente,
            ventaRelacionada: nuevaVenta.id,
          });
          return {
            ...item,
            cantidad: item.cantidad - productoVendido.cantidad,
          };
        }
        return item;
      });

      setAlmacen({
        ...almacen,
        stock: nuevoStock,
        salidas: [...(almacen.salidas || []), ...nuevasSalidas],
      });

      // Registrar en historial de acciones
      actionHistory.addAction('Venta registrada como PENDIENTE', {
        ventaId: nuevaVenta.id,
        cliente: formData.cliente,
        monto: totalVenta,
      });

      showNotification(
        `✅ Venta registrada como PENDIENTE por $${totalVenta.toLocaleString()}. Use "Marcar como Pagado" cuando reciba el pago.`,
        'success'
      );

      setShowForm(false);
      setFormData({
        cliente: '',
        productos: [{ nombre: '', cantidad: 0, precioUnitario: 0, precioCompra: 0 }],
        estadoPago: 'pendiente',
        montoAbonado: 0,
        precioFlete: 500,
        concepto: '',
        ocRelacionada: '',
        destino: 'bovedaMonte',
      });
    };

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Ventas</h1>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowForm(!showForm)}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 font-semibold flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Nueva Venta
          </motion.button>
        </div>

        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-2xl p-6 border border-white/10"
          >
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">💳 Registrar Venta</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2 flex items-center gap-2">
                    👤 Cliente
                  </label>
                  <input
                    type="text"
                    value={formData.cliente}
                    onChange={(e) => setFormData({ ...formData, cliente: e.target.value })}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600 text-white"
                    placeholder="Ej: Corporativo ABC, Juan Pérez, etc."
                  />
                  <p className="text-xs text-slate-400 mt-1 ml-1">
                    💡 Nombre del cliente o empresa que compra
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2 flex items-center gap-2">
                    🚚 Costo de Flete / Envío
                  </label>
                  <input
                    type="number"
                    value={formData.precioFlete}
                    onChange={(e) =>
                      setFormData({ ...formData, precioFlete: parseFloat(e.target.value) || 0 })
                    }
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600 text-white"
                    placeholder="Ej: 500"
                  />
                  <p className="text-xs text-slate-400 mt-1 ml-1">
                    💡 Costo único por envío/transporte (NO por unidad)
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2 flex items-center gap-2">
                  💰 Estado de Pago
                </label>
                <select
                  value={formData.estadoPago}
                  onChange={(e) => setFormData({ ...formData, estadoPago: e.target.value })}
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600 text-white"
                >
                  <option value="completo">✅ Completo - Cliente pagó todo</option>
                  <option value="parcial">💵 Parcial - Cliente hizo abono</option>
                  <option value="pendiente">⏳ Pendiente - Cliente debe todo</option>
                </select>
                <p className="text-xs text-slate-400 mt-1 ml-1">
                  💡 ¿El cliente ya pagó? Selecciona el estado del pago
                </p>
              </div>

              {formData.estadoPago === 'parcial' && (
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2 flex items-center gap-2">
                    💵 Monto Abonado por el Cliente
                  </label>
                  <input
                    type="number"
                    value={formData.montoAbonado}
                    onChange={(e) =>
                      setFormData({ ...formData, montoAbonado: parseFloat(e.target.value) || 0 })
                    }
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600 text-white"
                    placeholder="Ej: 25000"
                  />
                  <p className="text-xs text-slate-400 mt-1 ml-1">
                    💡 Cantidad que el cliente pagó ahora (el resto quedará como adeudo)
                  </p>
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  🛒 Productos Vendidos
                </label>
                <div className="mb-2 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                  <p className="text-xs text-blue-300 flex items-center gap-2">
                    <span>ℹ️</span>
                    <span>
                      <strong>Precio Venta:</strong> Lo que le cobras al cliente |
                      <strong> Precio Compra:</strong> Lo que TÚ pagaste originalmente
                    </span>
                  </p>
                </div>
                {formData.productos.map((producto, _idx) => (
                  <div
                    key={_idx}
                    className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-3 p-4 glass rounded-lg border border-orange-500/20"
                  >
                    <div>
                      <label className="text-xs text-slate-400 mb-1 block">
                        📦 Nombre del Producto
                      </label>
                      <input
                        type="text"
                        placeholder="Ej: Laptop Dell XPS 15"
                        value={producto.nombre}
                        onChange={(e) => {
                          const newProductos = [...formData.productos];
                          newProductos[_idx].nombre = e.target.value;
                          setFormData({ ...formData, productos: newProductos });
                        }}
                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600 text-white"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-slate-400 mb-1 block">
                        🔢 Cantidad Vendida
                      </label>
                      <input
                        type="number"
                        placeholder="Ej: 3"
                        value={producto.cantidad}
                        onChange={(e) => {
                          const newProductos = [...formData.productos];
                          newProductos[_idx].cantidad = parseFloat(e.target.value) || 0;
                          setFormData({ ...formData, productos: newProductos });
                        }}
                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600 text-white"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-slate-400 mb-1 block">
                        💵 Precio Venta c/u
                      </label>
                      <input
                        type="number"
                        placeholder="Ej: 18000"
                        value={producto.precioUnitario}
                        onChange={(e) => {
                          const newProductos = [...formData.productos];
                          newProductos[_idx].precioUnitario = parseFloat(e.target.value) || 0;
                          setFormData({ ...formData, productos: newProductos });
                        }}
                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600 text-white"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-slate-400 mb-1 block">
                        💰 Precio Compra c/u
                      </label>
                      <input
                        type="number"
                        placeholder="Ej: 12000"
                        value={producto.precioCompra}
                        onChange={(e) => {
                          const newProductos = [...formData.productos];
                          newProductos[_idx].precioCompra = parseFloat(e.target.value) || 0;
                          setFormData({ ...formData, productos: newProductos });
                        }}
                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600 text-white"
                      />
                    </div>
                    {producto.cantidad > 0 &&
                      producto.precioUnitario > 0 &&
                      producto.precioCompra > 0 && (
                        <div className="col-span-4 grid grid-cols-3 gap-2 mt-2 pt-2 border-t border-white/10">
                          <div className="text-center">
                            <span className="text-xs text-slate-400 block">Subtotal Venta</span>
                            <span className="text-sm font-bold text-green-400">
                              ${(producto.cantidad * producto.precioUnitario).toLocaleString()}
                            </span>
                          </div>
                          <div className="text-center">
                            <span className="text-xs text-slate-400 block">Subtotal Compra</span>
                            <span className="text-sm font-bold text-yellow-400">
                              ${(producto.cantidad * producto.precioCompra).toLocaleString()}
                            </span>
                          </div>
                          <div className="text-center">
                            <span className="text-xs text-slate-400 block">Ganancia</span>
                            <span className="text-sm font-bold text-blue-400">
                              $
                              {(
                                (producto.precioUnitario - producto.precioCompra) *
                                producto.cantidad
                              ).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      )}
                  </div>
                ))}
                <button
                  onClick={() =>
                    setFormData({
                      ...formData,
                      productos: [
                        ...formData.productos,
                        { nombre: '', cantidad: 0, precioUnitario: 0, precioCompra: 0 },
                      ],
                    })
                  }
                  className="text-orange-400 hover:text-orange-300 font-semibold flex items-center gap-2 mt-2"
                >
                  <Plus className="w-4 h-4" />
                  Agregar producto
                </button>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/10">
                <div className="text-center">
                  <p className="text-sm text-slate-400">Total Venta</p>
                  <p className="text-2xl font-bold text-green-400">
                    ${calcularTotalVenta().toLocaleString()}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-slate-400">Fletes</p>
                  <p className="text-2xl font-bold text-purple-400">
                    ${calcularFletes().toLocaleString()}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-slate-400">Utilidades</p>
                  <p className="text-2xl font-bold text-blue-400">
                    ${calcularUtilidades().toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Información de distribución del dinero */}
              <div className="glass rounded-lg p-4 border border-blue-500/30 bg-blue-500/5">
                <h4 className="text-sm font-bold text-blue-300 mb-3 flex items-center gap-2">
                  <Wallet className="w-4 h-4" />
                  Distribución del Dinero
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">💰 Bóveda Monte:</span>
                    <span className="font-bold text-green-400">
                      $
                      {formData.estadoPago === 'completo'
                        ? calcularTotalVenta().toLocaleString()
                        : formData.montoAbonado.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">🚚 Banco Fletes:</span>
                    <span className="font-bold text-purple-400">
                      {formData.estadoPago === 'completo'
                        ? `$${calcularFletes().toLocaleString()}`
                        : '$0 (pago pendiente)'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">📈 Banco Utilidades:</span>
                    <span className="font-bold text-blue-400">
                      {formData.estadoPago === 'completo'
                        ? `$${calcularUtilidades().toLocaleString()}`
                        : '$0 (pago pendiente)'}
                    </span>
                  </div>
                  {formData.estadoPago !== 'completo' && (
                    <div className="mt-2 pt-2 border-t border-white/10">
                      <p className="text-xs text-amber-400">
                        ⚠️ Los fletes y utilidades se acreditarán cuando el pago esté completo
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setShowForm(false)}
                  className="px-6 py-2 border border-white/10 rounded-xl hover:bg-white/5"
                >
                  Cancelar
                </button>
                <button
                  onClick={registrarVenta}
                  className="px-6 py-2 bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl hover:shadow-lg"
                >
                  Registrar Venta
                </button>
              </div>
            </div>
          </motion.div>
        )}

        <div className="glass rounded-2xl p-6 border border-white/10">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Historial de Ventas</h2>
            <div className="flex gap-3 items-center">
              {/* ⭐ NUEVO: Filtro de Estatus */}
              <select
                value={filtroEstatus}
                onChange={(e) => setFiltroEstatus(e.target.value)}
                className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600 text-white"
              >
                <option value="Todos">📊 Todos</option>
                <option value="Pendiente">🟡 Pendiente</option>
                <option value="Pagado">🟢 Pagado</option>
              </select>

              {/* Search bar for ventas */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar ventas..."
                  className="pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600 text-white w-64"
                />
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Fecha</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Cliente</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold">⭐ Estatus</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold">🏦 Destino</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold">Total</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold">Utilidades</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {ventasFiltradas.map((venta) => (
                  <tr
                    key={venta.id}
                    className={`border-t border-white/5 hover:bg-white/5 transition-colors ${
                      venta.estatus === 'Pendiente'
                        ? 'border-l-4 border-l-yellow-500'
                        : 'border-l-4 border-l-green-500'
                    }`}
                    onContextMenu={(e) => {
                      e.preventDefault();
                      setContextMenu({
                        x: e.clientX,
                        y: e.clientY,
                        items: [
                          {
                            label: 'Ver detalles',
                            icon: Eye,
                            onClick: () => {
                              showNotification(
                                `Venta: ${venta.cliente} - $${venta.totalVenta?.toLocaleString()}`,
                                'info'
                              );
                            },
                          },
                          {
                            label: 'Copiar ID',
                            icon: Copy,
                            onClick: () => {
                              navigator.clipboard.writeText(venta.id);
                              showNotification('ID copiado al portapapeles', 'success');
                            },
                          },
                          { divider: true },
                          {
                            label: 'Eliminar venta',
                            icon: Trash2,
                            danger: true,
                            onClick: () => deleteVenta(venta.id),
                          },
                        ],
                      });
                    }}
                  >
                    <td className="px-4 py-3 text-sm">{venta.fecha}</td>
                    <td className="px-4 py-3 text-sm font-semibold">
                      {searchTerm ? (
                        <span
                          dangerouslySetInnerHTML={{
                            __html: highlightMatch(venta.cliente, searchTerm),
                          }}
                        />
                      ) : (
                        venta.cliente
                      )}
                    </td>
                    {/* ⭐ NUEVA COLUMNA: Estatus con badge color-coded */}
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${
                          venta.estatus === 'Pagado'
                            ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                            : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                        }`}
                      >
                        {venta.estatus === 'Pagado' ? '✅' : '⏳'}
                        {venta.estatus || 'Pendiente'}
                      </span>
                    </td>
                    {/* ⭐ NUEVA COLUMNA: Destino (banco) */}
                    <td className="px-4 py-3 text-center text-sm">
                      <span className="text-slate-300">
                        {bancos[venta.destino || 'bovedaMonte']?.nombre ||
                          venta.destino ||
                          'Bóveda Monte'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-right font-bold">
                      ${venta.totalVenta?.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-sm text-right font-bold text-blue-400">
                      ${venta.totalUtilidades?.toLocaleString()}
                    </td>
                    {/* ⭐ NUEVA COLUMNA: Botón Marcar como Pagado */}
                    <td className="px-4 py-3 text-center">
                      {venta.estatus === 'Pendiente' ? (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => {
                            setVentaSeleccionada(venta);
                            setShowMarcarPagadoModal(true);
                          }}
                          className="px-3 py-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg text-xs font-bold flex items-center gap-1 mx-auto hover:shadow-lg"
                        >
                          <CheckCircle2 className="w-3 h-3" />
                          Marcar Pagado
                        </motion.button>
                      ) : (
                        <span className="text-green-400 text-xs flex items-center gap-1 justify-center">
                          <CheckCircle2 className="w-4 h-4" />
                          Pagado
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {ventasFiltradas.length === 0 && (
              <div className="text-center text-slate-400 py-8">
                <TrendingUp className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>
                  {searchTerm
                    ? 'No se encontraron ventas'
                    : filtroEstatus !== 'Todos'
                      ? `No hay ventas con estatus "${filtroEstatus}"`
                      : 'No hay ventas registradas'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* ⭐ NUEVO: Modal para Marcar como Pagado */}
        {showMarcarPagadoModal && ventaSeleccionada && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={() => setShowMarcarPagadoModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="glass rounded-2xl p-6 border border-white/10 max-w-md w-full mx-4"
            >
              <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-6 h-6 text-green-400" />
                Marcar Venta como Pagada
              </h3>

              <div className="space-y-4 mb-6">
                <div className="glass rounded-lg p-4 border border-blue-500/30 bg-blue-500/5">
                  <p className="text-sm text-slate-300 mb-2">
                    <strong>Cliente:</strong> {ventaSeleccionada.cliente}
                  </p>
                  <p className="text-sm text-slate-300 mb-2">
                    <strong>Total:</strong> ${ventaSeleccionada.totalVenta?.toLocaleString()}
                  </p>
                  <p className="text-sm text-slate-300">
                    <strong>Monto a acreditar:</strong>{' '}
                    <span className="text-green-400 font-bold">
                      $
                      {(
                        ventaSeleccionada.totalVenta - ventaSeleccionada.montoPagado
                      )?.toLocaleString()}
                    </span>
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2 flex items-center gap-2">
                    🏦 Selecciona el Banco Destino
                  </label>
                  <select
                    value={bancoDestinoPago}
                    onChange={(e) => setBancoDestinoPago(e.target.value)}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 text-white"
                  >
                    {Object.keys(bancos).map((bancoKey) => (
                      <option key={bancoKey} value={bancoKey}>
                        {bancos[bancoKey].nombre} ({bancos[bancoKey].moneda})
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-slate-400 mt-1 ml-1">
                    💡 El dinero se acreditará a este banco
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowMarcarPagadoModal(false)}
                  className="flex-1 px-4 py-2 border border-white/10 rounded-lg hover:bg-white/5 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleMarcarComoPagado}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg hover:shadow-lg transition-all font-bold"
                >
                  ✅ Confirmar Pago
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    );
  };

  // CLIENTES PANEL
  const ClientesPanel = () => {
    const [montoAbono, setMontoAbono] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');

    // Advanced search integration for clientes
    const advancedSearch = useAdvancedSearch(clientes, ['nombre']);

    React.useEffect(() => {
      advancedSearch.setQuery(searchTerm);
    }, [searchTerm, advancedSearch]);

    const clientesFiltrados =
      advancedSearch.filteredData.length > 0 && searchTerm ? advancedSearch.filteredData : clientes;

    const realizarAbono = (cliente, monto, bancoDestino = 'bovedaMonte') => {
      if (monto <= 0) {
        showNotification('El monto debe ser mayor a cero', 'error');
        return;
      }

      const adeudoActual = calcularAdeudoCliente(cliente.nombre);
      if (monto > adeudoActual) {
        showNotification(
          `El monto ($${monto.toLocaleString()}) es mayor al adeudo actual ($${adeudoActual.toLocaleString()})`,
          'warning'
        );
        // Permitir de todos modos (puede ser anticipo)
      }

      // Usar la función de lógica del Excel
      registrarAbono(
        cliente.nombre,
        monto,
        bancoDestino,
        `Abono registrado desde panel de clientes`
      );

      setMontoAbono(0);
    };

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Clientes</h1>
          <div className="flex items-center gap-3">
            {/* Botón de limpieza */}
            {clientes.filter(
              (c) => (c.adeudo === 0 || !c.adeudo) && (!c.ventas || c.ventas.length === 0)
            ).length > 0 && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={cleanupClientes}
                className="px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg font-semibold flex items-center gap-2 text-sm"
              >
                <Trash2 className="w-4 h-4" />
                Limpiar sin actividad
              </motion.button>
            )}
            {/* Search bar for clientes */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar clientes..."
                className="pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-white w-64"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {clientesFiltrados.map((cliente, _idx) => {
            // ⭐ CALCULAR ADEUDO REAL USANDO FUNCIÓN DEL EXCEL
            const adeudoReal = calcularAdeudoCliente(cliente.nombre);

            return (
              <motion.div
                key={_idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: _idx * 0.1 }}
                className="glass rounded-2xl p-6 border border-white/10 cursor-context-menu"
                onContextMenu={(e) => {
                  e.preventDefault();
                  setContextMenu({
                    x: e.clientX,
                    y: e.clientY,
                    items: [
                      {
                        label: 'Ver detalles',
                        icon: Eye,
                        onClick: () => {
                          showNotification(
                            `Cliente: ${cliente.nombre} - Adeudo: $${adeudoReal.toLocaleString()}`,
                            'info'
                          );
                        },
                      },
                      {
                        label: 'Copiar ID',
                        icon: Copy,
                        onClick: () => {
                          navigator.clipboard.writeText(cliente.id);
                          showNotification('ID copiado al portapapeles', 'success');
                        },
                      },
                      { divider: true },
                      {
                        label: 'Eliminar cliente',
                        icon: Trash2,
                        danger: true,
                        onClick: () => deleteCliente(cliente.id),
                      },
                    ],
                  });
                }}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold">
                      {searchTerm ? (
                        <span
                          dangerouslySetInnerHTML={{
                            __html: highlightMatch(cliente.nombre, searchTerm),
                          }}
                        />
                      ) : (
                        cliente.nombre
                      )}
                    </h3>
                    <p className="text-sm text-slate-400">
                      {cliente.ventas?.length || 0} ventas totales
                    </p>
                  </div>
                  <div
                    className={`px-4 py-2 rounded-full font-semibold ${
                      adeudoReal > 0
                        ? 'bg-red-500/20 text-red-400'
                        : 'bg-green-500/20 text-green-400'
                    }`}
                  >
                    ${adeudoReal.toLocaleString()}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="glass rounded-lg p-3">
                    <p className="text-sm text-slate-400 mb-2">
                      📊 Ventas Pendientes:{' '}
                      <span className="text-yellow-400 font-bold">
                        {
                          ventas.filter(
                            (v) => v.cliente === cliente.nombre && v.estatus === 'Pendiente'
                          ).length
                        }
                      </span>
                    </p>
                    <p className="text-sm text-slate-400 mb-2">
                      ✅ Ventas Pagadas:{' '}
                      <span className="text-green-400 font-bold">
                        {
                          ventas.filter(
                            (v) => v.cliente === cliente.nombre && v.estatus === 'Pagado'
                          ).length
                        }
                      </span>
                    </p>
                    <p className="text-sm text-slate-400">
                      💰 Total Comprado:{' '}
                      <span className="text-blue-400 font-bold">
                        ${(cliente.totalComprado || 0).toLocaleString()}
                      </span>
                    </p>
                  </div>

                  {adeudoReal > 0 && (
                    <div className="space-y-3 pt-3 border-t border-white/10">
                      <div className="mb-2 p-2 bg-green-500/10 border border-green-500/30 rounded-lg">
                        <p className="text-xs text-green-300">
                          💡 Registrar el pago que el cliente te hizo
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-300 mb-2 flex items-center gap-2">
                          💵 Monto que el Cliente te Pagó ($)
                        </label>
                        <input
                          type="number"
                          value={montoAbono}
                          onChange={(e) => setMontoAbono(parseFloat(e.target.value) || 0)}
                          className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-white"
                          placeholder="Ej: 20000"
                        />
                        <p className="text-xs text-slate-400 mt-1 ml-1">
                          Adeudo actual del cliente:{' '}
                          <span className="font-bold text-red-400">
                            ${cliente.adeudo.toLocaleString()}
                          </span>
                        </p>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => realizarAbono(cliente, montoAbono)}
                          className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 py-2 rounded-lg hover:shadow-lg font-semibold"
                        >
                          Abonar
                        </button>
                        <button
                          onClick={() => realizarAbono(cliente, adeudoReal)}
                          className="flex-1 bg-gradient-to-r from-green-500 to-green-600 py-2 rounded-lg hover:shadow-lg font-semibold"
                        >
                          Saldar
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {clientesFiltrados.length === 0 && (
          <div className="text-center text-slate-400 py-20">
            <UserCheck className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p>{searchTerm ? 'No se encontraron clientes' : 'No hay clientes registrados'}</p>
            <p className="text-sm mt-2">
              Los clientes se crean automáticamente al registrar ventas
            </p>
          </div>
        )}
      </div>
    );
  };

  // ⭐ NUEVO: PANEL DE GASTOS Y ABONOS (LÓGICA DEL EXCEL)
  const GastosAbonosPanel = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filtroTipo, setFiltroTipo] = useState('Todos'); // 'Todos', 'abono', 'gasto', 'transferencia'
    const [showRegistrarModal, setShowRegistrarModal] = useState(false);
    const [tipoRegistro, setTipoRegistro] = useState('abono'); // Para el modal
    const [formDataGastoAbono, setFormDataGastoAbono] = useState({
      cliente: '',
      monto: 0,
      bancoDestino: 'bovedaMonte',
      observaciones: '',
      concepto: '',
      bancoOrigen: 'bovedaMonte',
    });

    // Filtrar gastos/abonos
    let gastosAbonosFiltrados = gastosAbonos;

    if (filtroTipo !== 'Todos') {
      gastosAbonosFiltrados = gastosAbonosFiltrados.filter((g) => g.tipo === filtroTipo);
    }

    if (searchTerm) {
      gastosAbonosFiltrados = gastosAbonosFiltrados.filter(
        (g) =>
          g.origenGastoOAbono?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          g.concepto?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          g.observaciones?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    const handleRegistrar = () => {
      if (tipoRegistro === 'abono') {
        registrarAbono(
          formDataGastoAbono.cliente,
          formDataGastoAbono.monto,
          formDataGastoAbono.bancoDestino,
          formDataGastoAbono.observaciones
        );
      } else if (tipoRegistro === 'gasto') {
        registrarGasto(
          formDataGastoAbono.concepto,
          formDataGastoAbono.monto,
          formDataGastoAbono.bancoOrigen,
          formDataGastoAbono.observaciones
        );
      } else if (tipoRegistro === 'transferencia') {
        transferirEntreBancos(
          formDataGastoAbono.bancoOrigen,
          formDataGastoAbono.bancoDestino,
          formDataGastoAbono.monto,
          formDataGastoAbono.concepto
        );
      }

      setShowRegistrarModal(false);
      setFormDataGastoAbono({
        cliente: '',
        monto: 0,
        bancoDestino: 'bovedaMonte',
        observaciones: '',
        concepto: '',
        bancoOrigen: 'bovedaMonte',
      });
    };

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">💰 Gastos y Abonos</h1>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowRegistrarModal(true)}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 font-semibold flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Nuevo Registro
          </motion.button>
        </div>

        {/* Filtros */}
        <div className="glass rounded-2xl p-6 border border-white/10">
          <div className="flex gap-4 flex-wrap">
            {/* Filtro por tipo */}
            <div>
              <label className="block text-sm font-semibold mb-2">Tipo</label>
              <select
                value={filtroTipo}
                onChange={(e) => setFiltroTipo(e.target.value)}
                className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 text-white"
              >
                <option value="Todos">Todos</option>
                <option value="abono">💰 Abonos</option>
                <option value="gasto">💸 Gastos</option>
                <option value="transferencia">🔄 Transferencias</option>
              </select>
            </div>

            {/* Búsqueda */}
            <div className="flex-1">
              <label className="block text-sm font-semibold mb-2">Buscar</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar por cliente, concepto u observaciones..."
                  className="pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 text-white w-full"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Tabla de gastos/abonos */}
        <div className="glass rounded-2xl p-6 border border-white/10">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Fecha</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold">Tipo</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Cliente/Concepto</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold">Monto</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold">Destino</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Observaciones</th>
                </tr>
              </thead>
              <tbody>
                {gastosAbonosFiltrados
                  .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
                  .map((item) => (
                    <tr key={item.id} className="border-t border-white/5 hover:bg-white/5">
                      <td className="px-4 py-3 text-sm">
                        {new Date(item.fecha).toLocaleDateString('es-MX')}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${
                            item.tipo === 'abono'
                              ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                              : item.tipo === 'gasto'
                                ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                                : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                          }`}
                        >
                          {item.tipo === 'abono'
                            ? '💰 Abono'
                            : item.tipo === 'gasto'
                              ? '💸 Gasto'
                              : '🔄 Transferencia'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm font-semibold">
                        {item.origenGastoOAbono || item.concepto || 'N/A'}
                      </td>
                      <td
                        className={`px-4 py-3 text-sm text-right font-bold ${
                          item.tipo === 'abono' ? 'text-green-400' : 'text-red-400'
                        }`}
                      >
                        {item.tipo === 'gasto' ? '-' : '+'}${item.valor?.toLocaleString() || 0}
                      </td>
                      <td className="px-4 py-3 text-center text-sm">
                        <span className="text-slate-300">
                          {bancos[item.destino]?.nombre || item.destino || 'N/A'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-400">
                        {item.observaciones || '-'}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>

            {gastosAbonosFiltrados.length === 0 && (
              <div className="text-center text-slate-400 py-8">
                <DollarSign className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>
                  {searchTerm || filtroTipo !== 'Todos'
                    ? 'No se encontraron registros'
                    : 'No hay gastos ni abonos registrados'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Modal para registrar */}
        {showRegistrarModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={() => setShowRegistrarModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="glass rounded-2xl p-6 border border-white/10 max-w-md w-full mx-4"
            >
              <h3 className="text-2xl font-bold mb-4">Nuevo Registro</h3>

              {/* Selector de tipo */}
              <div className="mb-4">
                <label className="block text-sm font-semibold mb-2">Tipo de Registro</label>
                <select
                  value={tipoRegistro}
                  onChange={(e) => setTipoRegistro(e.target.value)}
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 text-white"
                >
                  <option value="abono">💰 Abono de Cliente</option>
                  <option value="gasto">💸 Gasto Operativo</option>
                  <option value="transferencia">🔄 Transferencia entre Bancos</option>
                </select>
              </div>

              {/* Formulario dinámico según el tipo */}
              <div className="space-y-4 mb-6">
                {tipoRegistro === 'abono' && (
                  <>
                    <div>
                      <label className="block text-sm font-semibold mb-2">Cliente</label>
                      <input
                        type="text"
                        value={formDataGastoAbono.cliente}
                        onChange={(e) =>
                          setFormDataGastoAbono({ ...formDataGastoAbono, cliente: e.target.value })
                        }
                        placeholder="Nombre del cliente"
                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">Banco Destino</label>
                      <select
                        value={formDataGastoAbono.bancoDestino}
                        onChange={(e) =>
                          setFormDataGastoAbono({
                            ...formDataGastoAbono,
                            bancoDestino: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 text-white"
                      >
                        {Object.keys(bancos).map((key) => (
                          <option key={key} value={key}>
                            {bancos[key].nombre}
                          </option>
                        ))}
                      </select>
                    </div>
                  </>
                )}

                {tipoRegistro === 'gasto' && (
                  <>
                    <div>
                      <label className="block text-sm font-semibold mb-2">Concepto</label>
                      <input
                        type="text"
                        value={formDataGastoAbono.concepto}
                        onChange={(e) =>
                          setFormDataGastoAbono({
                            ...formDataGastoAbono,
                            concepto: e.target.value,
                          })
                        }
                        placeholder="Concepto del gasto"
                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">Banco Origen</label>
                      <select
                        value={formDataGastoAbono.bancoOrigen}
                        onChange={(e) =>
                          setFormDataGastoAbono({
                            ...formDataGastoAbono,
                            bancoOrigen: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 text-white"
                      >
                        {Object.keys(bancos).map((key) => (
                          <option key={key} value={key}>
                            {bancos[key].nombre}
                          </option>
                        ))}
                      </select>
                    </div>
                  </>
                )}

                {tipoRegistro === 'transferencia' && (
                  <>
                    <div>
                      <label className="block text-sm font-semibold mb-2">Banco Origen</label>
                      <select
                        value={formDataGastoAbono.bancoOrigen}
                        onChange={(e) =>
                          setFormDataGastoAbono({
                            ...formDataGastoAbono,
                            bancoOrigen: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-white"
                      >
                        {Object.keys(bancos).map((key) => (
                          <option key={key} value={key}>
                            {bancos[key].nombre}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">Banco Destino</label>
                      <select
                        value={formDataGastoAbono.bancoDestino}
                        onChange={(e) =>
                          setFormDataGastoAbono({
                            ...formDataGastoAbono,
                            bancoDestino: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-white"
                      >
                        {Object.keys(bancos).map((key) => (
                          <option key={key} value={key}>
                            {bancos[key].nombre}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">Concepto</label>
                      <input
                        type="text"
                        value={formDataGastoAbono.concepto}
                        onChange={(e) =>
                          setFormDataGastoAbono({
                            ...formDataGastoAbono,
                            concepto: e.target.value,
                          })
                        }
                        placeholder="Concepto de la transferencia"
                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-white"
                      />
                    </div>
                  </>
                )}

                {/* Monto - común para todos */}
                <div>
                  <label className="block text-sm font-semibold mb-2">Monto</label>
                  <input
                    type="number"
                    value={formDataGastoAbono.monto}
                    onChange={(e) =>
                      setFormDataGastoAbono({
                        ...formDataGastoAbono,
                        monto: parseFloat(e.target.value) || 0,
                      })
                    }
                    placeholder="0"
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 text-white"
                  />
                </div>

                {/* Observaciones - común para todos */}
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Observaciones (opcional)
                  </label>
                  <textarea
                    value={formDataGastoAbono.observaciones}
                    onChange={(e) =>
                      setFormDataGastoAbono({
                        ...formDataGastoAbono,
                        observaciones: e.target.value,
                      })
                    }
                    placeholder="Notas adicionales..."
                    rows={3}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 text-white resize-none"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowRegistrarModal(false)}
                  className="flex-1 px-4 py-2 border border-white/10 rounded-lg hover:bg-white/5 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleRegistrar}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg hover:shadow-lg transition-all font-bold"
                >
                  ✅ Registrar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    );
  };

  // BANCO PANEL INDIVIDUAL - Para mostrar un banco específico desde el sidebar
  const BancoPanelIndividual = ({ nombreBanco }) => {
    const [showTransferModal, setShowTransferModal] = useState(false);
    const [showGastoModal, setShowGastoModal] = useState(false);
    const [showIngresoModal, setShowIngresoModal] = useState(false);
    const [showAnalyticsModal, setShowAnalyticsModal] = useState(false);
    const [showHistoryModal, setShowHistoryModal] = useState(false);
    const [activeTab, setActiveTab] = useState('overview');
    const [timeFilter, setTimeFilter] = useState('week');
    const [searchTerm, setSearchTerm] = useState('');
    const [transferData, setTransferData] = useState({
      hacia: 'utilidades',
      monto: 0,
      concepto: '',
      categoria: 'operativo',
    });
    const [gastoData, setGastoData] = useState({
      monto: 0,
      concepto: '',
      categoria: 'operativo',
      proveedor: '',
    });
    const [ingresoData, setIngresoData] = useState({
      monto: 0,
      concepto: '',
      categoria: 'venta',
      cliente: '',
    });

    const banco = bancos?.[nombreBanco] || {
      capitalActual: 0,
      historico: 0,
      ingresos: [],
      gastos: [],
      transferencias: [],
      registros: [],
    };
    const nombres = {
      bovedaMonte: 'Bóveda Monte',
      utilidades: 'Utilidades',
      fletes: 'Fletes',
      azteca: 'Azteca',
      leftie: 'Leftie',
      profit: 'Profit',
    };

    const esBancoVentas = ['bovedaMonte', 'utilidades', 'fletes'].includes(nombreBanco);

    // Datos simulados para gráficos avanzados
    const generateChartData = () => {
      const baseAmount = banco.capitalActual;
      return Array.from({ length: 30 }, (_, i) => ({
        date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toLocaleDateString(),
        balance: baseAmount + Math.floor(Math.random() * 50000) - 25000,
        ingresos: Math.floor(Math.random() * 15000),
        gastos: Math.floor(Math.random() * 10000),
        transferencias: Math.floor(Math.random() * 8000),
      }));
    };

    const chartData = generateChartData();

    // Categorías para mejor organización
    const categorias = {
      ingreso: ['venta', 'servicio', 'inversion', 'otro'],
      gasto: ['operativo', 'marketing', 'personal', 'inventario', 'otro'],
      transferencia: ['operativo', 'inversion', 'reserva', 'otro'],
    };

    const realizarTransferencia = () => {
      if (transferData.monto <= 0 || transferData.monto > banco.capitalActual) {
        showNotification('Monto inválido o fondos insuficientes', 'error');
        return;
      }

      setBancos({
        ...bancos,
        [nombreBanco]: {
          ...banco,
          capitalActual: banco.capitalActual - transferData.monto,
          transferencias: [
            ...banco.transferencias,
            {
              tipo: 'salida',
              hacia: transferData.hacia,
              monto: transferData.monto,
              concepto: transferData.concepto,
              fecha: new Date().toLocaleString(),
            },
          ],
        },
        [transferData.hacia]: {
          ...bancos[transferData.hacia],
          capitalActual: bancos[transferData.hacia].capitalActual + transferData.monto,
          transferencias: [
            ...bancos[transferData.hacia].transferencias,
            {
              tipo: 'entrada',
              desde: nombreBanco,
              monto: transferData.monto,
              concepto: transferData.concepto,
              fecha: new Date().toLocaleString(),
            },
          ],
        },
      });

      showNotification('Transferencia realizada exitosamente', 'success');
      setShowTransferModal(false);
      setTransferData({ hacia: 'utilidades', monto: 0, concepto: '' });
    };

    const registrarGasto = () => {
      if (gastoData.monto <= 0 || gastoData.monto > banco.capitalActual || !gastoData.concepto) {
        showNotification('Datos inválidos', 'error');
        return;
      }

      setBancos({
        ...bancos,
        [nombreBanco]: {
          ...banco,
          capitalActual: banco.capitalActual - gastoData.monto,
          gastos: [
            ...banco.gastos,
            {
              id: `GAS-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              monto: gastoData.monto,
              concepto: gastoData.concepto,
              fecha: new Date().toLocaleString(),
            },
          ],
        },
      });

      showNotification('Gasto registrado exitosamente', 'success');
      setShowGastoModal(false);
      setGastoData({ monto: 0, concepto: '' });
    };

    const registrarIngreso = () => {
      if (ingresoData.monto <= 0 || !ingresoData.concepto) {
        showNotification('Datos inválidos', 'error');
        return;
      }

      setBancos({
        ...bancos,
        [nombreBanco]: {
          ...banco,
          capitalActual: banco.capitalActual + ingresoData.monto,
          historico: banco.historico + ingresoData.monto,
          registros: [
            ...banco.registros,
            {
              id: `ING-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              concepto: `Ingreso: ${ingresoData.concepto}`,
              monto: ingresoData.monto,
              fecha: new Date().toLocaleString(),
            },
          ],
        },
      });

      showNotification('Ingreso registrado exitosamente', 'success');
      setShowIngresoModal(false);
      setIngresoData({ monto: 0, concepto: '' });
    };

    return (
      <div className="space-y-6">
        {/* Header con navegación avanzada */}
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              {nombres[nombreBanco]}
            </h1>
            <p className="text-slate-400 mt-1">Sistema Bancario Avanzado</p>
          </div>

          <div className="flex flex-wrap gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAnalyticsModal(true)}
              className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-semibold flex items-center gap-2"
            >
              <BarChart3 className="w-4 h-4" />
              Analytics
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowHistoryModal(true)}
              className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl font-semibold flex items-center gap-2"
            >
              <Clock className="w-4 h-4" />
              Historial
            </motion.button>
            {!esBancoVentas && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowIngresoModal(true)}
                className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl font-semibold flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Ingreso
              </motion.button>
            )}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowTransferModal(true)}
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl font-semibold flex items-center gap-2"
            >
              <ArrowRight className="w-4 h-4" />
              Transferir
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowGastoModal(true)}
              className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 rounded-xl font-semibold flex items-center gap-2"
            >
              <TrendingDown className="w-4 h-4" />
              Gasto
            </motion.button>
          </div>
        </div>

        {/* Métricas avanzadas - KPIs Financieros Inteligentes */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="glass rounded-2xl p-6 border border-green-500/20 bg-gradient-to-br from-green-500/10 to-emerald-500/5 cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-3">
              <Wallet className="w-8 h-8 text-green-400" />
              <span className="text-xs text-green-400 font-semibold">SALDO ACTUAL</span>
            </div>
            <p className="text-2xl font-bold text-green-400 mb-1">
              ${banco.capitalActual.toLocaleString()}
            </p>
            <p className="text-xs text-slate-400">Disponible ahora</p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="glass rounded-2xl p-6 border border-blue-500/20 bg-gradient-to-br from-blue-500/10 to-cyan-500/5 cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-3">
              <TrendingUp className="w-8 h-8 text-blue-400" />
              <span className="text-xs text-blue-400 font-semibold">FLUJO NETO</span>
            </div>
            <p className="text-2xl font-bold text-blue-400 mb-1">
              $
              {(
                (banco?.ingresos?.reduce((sum, i) => sum + (i?.monto || 0), 0) || 0) -
                (banco?.gastos || []).reduce((sum, g) => sum + (g?.monto || 0), 0)
              ).toLocaleString()}
            </p>
            <p className="text-xs text-slate-400">Ingresos - Egresos</p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="glass rounded-2xl p-6 border border-purple-500/20 bg-gradient-to-br from-purple-500/10 to-pink-500/5 cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-3">
              <Target className="w-8 h-8 text-purple-400" />
              <span className="text-xs text-purple-400 font-semibold">RENDIMIENTO</span>
            </div>
            <p className="text-2xl font-bold text-purple-400 mb-1">
              {banco.historico > 0
                ? `${((banco.capitalActual / banco.historico) * 100).toFixed(1)}%`
                : '0%'}
            </p>
            <p className="text-xs text-slate-400">% Capital vs histórico</p>
          </motion.div>

          {/* KPI condicional: Histórico Total para Bóveda Monte, Actividad para otros */}
          {nombreBanco === 'bovedaMonte' ? (
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="glass rounded-2xl p-6 border border-amber-500/20 bg-gradient-to-br from-amber-500/10 to-orange-500/5 cursor-pointer group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="flex items-center justify-between mb-3 relative z-10">
                <TrendingUp className="w-8 h-8 text-amber-400" />
                <span className="text-xs text-amber-400 font-semibold">HISTÓRICO TOTAL</span>
              </div>
              <p className="text-2xl font-bold text-amber-400 mb-1 relative z-10">
                ${banco.historico.toLocaleString()}
              </p>
              <p className="text-xs text-slate-400 relative z-10">Ganancias acumuladas</p>
              <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl group-hover:bg-amber-500/20 transition-all duration-300" />
            </motion.div>
          ) : (
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="glass rounded-2xl p-6 border border-yellow-500/20 bg-gradient-to-br from-yellow-500/10 to-amber-500/5 cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-3">
                <Sparkles className="w-8 h-8 text-yellow-400" />
                <span className="text-xs text-yellow-400 font-semibold">ACTIVIDAD</span>
              </div>
              <p className="text-2xl font-bold text-yellow-400 mb-1">
                {(banco.ingresos?.length || 0) + banco.gastos.length + banco.transferencias.length}
              </p>
              <p className="text-xs text-slate-400">Total transacciones</p>
            </motion.div>
          )}
        </div>

        {/* Navegación por pestañas */}
        <div className="glass rounded-2xl border border-white/10">
          <div className="flex border-b border-white/10">
            {[
              { key: 'overview', label: 'Resumen', icon: Eye },
              { key: 'transactions', label: 'Transacciones', icon: List },
              { key: 'analytics', label: 'Análisis', icon: BarChart3 },
              { key: 'reports', label: 'Reportes', icon: FileText },
            ].map((tab) => (
              <motion.button
                key={tab.key}
                whileHover={{ backgroundColor: 'rgba(59, 130, 246, 0.1)' }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveTab(tab.key)}
                className={`flex-1 px-6 py-4 font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
                  activeTab === tab.key
                    ? 'text-blue-400 border-b-2 border-blue-400 bg-blue-500/10'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </motion.button>
            ))}
          </div>

          <div className="p-6">
            <AnimatePresence mode="wait">
              {activeTab === 'overview' && (
                <motion.div
                  key="overview"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  {/* Gráfico de flujo de efectivo */}
                  <div className="glass rounded-xl p-6 border border-white/10">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-blue-400" />
                      Flujo de Efectivo (30 días)
                    </h3>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                          <XAxis dataKey="date" stroke="#9CA3AF" />
                          <YAxis stroke="#9CA3AF" />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: 'rgba(15, 23, 42, 0.95)',
                              border: '1px solid rgba(59, 130, 246, 0.2)',
                              borderRadius: '12px',
                            }}
                          />
                          <Line
                            type="monotone"
                            dataKey="balance"
                            stroke="#3B82F6"
                            strokeWidth={3}
                          />
                          <Line
                            type="monotone"
                            dataKey="ingresos"
                            stroke="#10B981"
                            strokeWidth={2}
                          />
                          <Line type="monotone" dataKey="gastos" stroke="#EF4444" strokeWidth={2} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Distribución por categorías */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="glass rounded-xl p-6 border border-white/10">
                      <h3 className="text-lg font-semibold mb-4">Distribución de Ingresos</h3>
                      <div className="h-48">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={[
                                { name: 'Ventas', value: 45, fill: '#10B981' },
                                { name: 'Servicios', value: 30, fill: '#3B82F6' },
                                { name: 'Inversiones', value: 15, fill: '#8B5CF6' },
                                { name: 'Otros', value: 10, fill: '#F59E0B' },
                              ]}
                              cx="50%"
                              cy="50%"
                              outerRadius={80}
                              dataKey="value"
                            />
                            <Tooltip />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    <div className="glass rounded-xl p-6 border border-white/10">
                      <h3 className="text-lg font-semibold mb-4">Distribución de Gastos</h3>
                      <div className="h-48">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={[
                                { name: 'Operativo', value: 40, fill: '#EF4444' },
                                { name: 'Personal', value: 25, fill: '#F97316' },
                                { name: 'Marketing', value: 20, fill: '#EC4899' },
                                { name: 'Inventario', value: 15, fill: '#6366F1' },
                              ]}
                              cx="50%"
                              cy="50%"
                              outerRadius={80}
                              dataKey="value"
                            />
                            <Tooltip />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'transactions' && (
                <motion.div
                  key="transactions"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-4"
                >
                  {/* Filtros y búsqueda */}
                  <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <div className="flex-1">
                      <div className="relative">
                        <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                        <input
                          type="text"
                          placeholder="Buscar transacciones..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-blue-500 transition-colors"
                        />
                      </div>
                    </div>
                    <select
                      value={timeFilter}
                      onChange={(e) => setTimeFilter(e.target.value)}
                      className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-blue-500"
                    >
                      <option value="week">Última semana</option>
                      <option value="month">Último mes</option>
                      <option value="quarter">Último trimestre</option>
                      <option value="year">Último año</option>
                    </select>
                  </div>

                  {/* Tabla de transacciones */}
                  <div className="glass rounded-xl border border-white/10 overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-white/5">
                          <tr>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                              Fecha
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                              Tipo
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                              Concepto
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                              Categoría
                            </th>
                            <th className="px-6 py-4 text-right text-xs font-semibold text-slate-400 uppercase tracking-wider">
                              Monto
                            </th>
                            <th className="px-6 py-4 text-center text-xs font-semibold text-slate-400 uppercase tracking-wider">
                              Estado
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/10">
                          {/* Simulación de transacciones */}
                          {Array.from({ length: 10 }, (_, i) => (
                            <motion.tr
                              key={`item-${i}`}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: i * 0.1 }}
                              className="hover:bg-white/5 transition-colors"
                            >
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                                {new Date(
                                  Date.now() - i * 24 * 60 * 60 * 1000
                                ).toLocaleDateString()}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span
                                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                    i % 3 === 0
                                      ? 'bg-green-100 text-green-800'
                                      : i % 3 === 1
                                        ? 'bg-red-100 text-red-800'
                                        : 'bg-blue-100 text-blue-800'
                                  }`}
                                >
                                  {i % 3 === 0
                                    ? 'Ingreso'
                                    : i % 3 === 1
                                      ? 'Gasto'
                                      : 'Transferencia'}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-sm text-slate-300">
                                {i % 3 === 0
                                  ? 'Venta de producto'
                                  : i % 3 === 1
                                    ? 'Pago de servicios'
                                    : 'Transferencia interna'}
                              </td>
                              <td className="px-6 py-4 text-sm text-slate-400">
                                {i % 3 === 0 ? 'Ventas' : i % 3 === 1 ? 'Operativo' : 'Interno'}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-semibold">
                                <span
                                  className={
                                    i % 3 === 0
                                      ? 'text-green-400'
                                      : i % 3 === 1
                                        ? 'text-red-400'
                                        : 'text-blue-400'
                                  }
                                >
                                  ${(Math.random() * 50000 + 1000).toLocaleString()}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-center">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  Completado
                                </span>
                              </td>
                            </motion.tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'analytics' && (
                <motion.div
                  key="analytics"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  {/* Métricas avanzadas */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="glass rounded-xl p-6 border border-white/10">
                      <h3 className="text-sm font-semibold text-slate-400 mb-2">
                        Crecimiento Mensual
                      </h3>
                      <p className="text-2xl font-bold text-green-400">+12.5%</p>
                      <p className="text-xs text-slate-500 mt-1">vs mes anterior</p>
                    </div>
                    <div className="glass rounded-xl p-6 border border-white/10">
                      <h3 className="text-sm font-semibold text-slate-400 mb-2">ROI Promedio</h3>
                      <p className="text-2xl font-bold text-blue-400">23.7%</p>
                      <p className="text-xs text-slate-500 mt-1">en los últimos 6 meses</p>
                    </div>
                    <div className="glass rounded-xl p-6 border border-white/10">
                      <h3 className="text-sm font-semibold text-slate-400 mb-2">Eficiencia</h3>
                      <p className="text-2xl font-bold text-purple-400">89.2%</p>
                      <p className="text-xs text-slate-500 mt-1">ratio ingresos/gastos</p>
                    </div>
                  </div>

                  {/* Gráfico de barras comparativo */}
                  <div className="glass rounded-xl p-6 border border-white/10">
                    <h3 className="text-lg font-semibold mb-4">Comparativo Mensual</h3>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData.slice(-12)}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                          <XAxis dataKey="date" stroke="#9CA3AF" />
                          <YAxis stroke="#9CA3AF" />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: 'rgba(15, 23, 42, 0.95)',
                              border: '1px solid rgba(59, 130, 246, 0.2)',
                              borderRadius: '12px',
                            }}
                          />
                          <Bar dataKey="ingresos" fill="#10B981" />
                          <Bar dataKey="gastos" fill="#EF4444" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'reports' && (
                <motion.div
                  key="reports"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[
                      { title: 'Reporte Mensual', icon: Calendar, color: 'blue' },
                      { title: 'Estado Financiero', icon: DollarSign, color: 'green' },
                      { title: 'Análisis de Flujo', icon: TrendingUp, color: 'purple' },
                      { title: 'Resumen Ejecutivo', icon: FileText, color: 'orange' },
                      { title: 'Proyecciones', icon: Target, color: 'pink' },
                      { title: 'Comparativo', icon: BarChart3, color: 'cyan' },
                    ].map((report, index) => {
                      const reportBorderClasses = {
                        blue: 'border-blue-500/20 bg-gradient-to-br from-blue-500/10 to-blue-600/5',
                        green:
                          'border-green-500/20 bg-gradient-to-br from-green-500/10 to-green-600/5',
                        purple:
                          'border-purple-500/20 bg-gradient-to-br from-purple-500/10 to-purple-600/5',
                        orange:
                          'border-orange-500/20 bg-gradient-to-br from-orange-500/10 to-orange-600/5',
                        pink: 'border-pink-500/20 bg-gradient-to-br from-pink-500/10 to-pink-600/5',
                        cyan: 'border-cyan-500/20 bg-gradient-to-br from-cyan-500/10 to-cyan-600/5',
                      };

                      const reportIconClasses = {
                        blue: 'text-blue-400',
                        green: 'text-green-400',
                        purple: 'text-purple-400',
                        orange: 'text-orange-400',
                        pink: 'text-pink-400',
                        cyan: 'text-cyan-400',
                      };

                      const reportButtonClasses = {
                        blue: 'bg-gradient-to-r from-blue-500 to-blue-600',
                        green: 'bg-gradient-to-r from-green-500 to-green-600',
                        purple: 'bg-gradient-to-r from-purple-500 to-purple-600',
                        orange: 'bg-gradient-to-r from-orange-500 to-orange-600',
                        pink: 'bg-gradient-to-r from-pink-500 to-pink-600',
                        cyan: 'bg-gradient-to-r from-cyan-500 to-cyan-600',
                      };

                      return (
                        <motion.div
                          key={report.title}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className={`glass rounded-xl p-6 border cursor-pointer ${
                            reportBorderClasses[report.color]
                          }`}
                        >
                          <report.icon
                            className={`w-8 h-8 mb-3 ${reportIconClasses[report.color]}`}
                          />
                          <h3 className="text-lg font-semibold mb-2">{report.title}</h3>
                          <p className="text-sm text-slate-400 mb-4">
                            Generar reporte detallado del período seleccionado
                          </p>
                          <button
                            className={`w-full py-2 px-4 rounded-lg font-semibold text-sm ${
                              reportButtonClasses[report.color]
                            }`}
                          >
                            Generar
                          </button>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Modales (Transfer, Gasto, Ingreso) */}
        {showTransferModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
            onClick={() => setShowTransferModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              onClick={(e) => e.stopPropagation()}
              className="glass rounded-2xl p-6 max-w-md w-full border border-white/10"
            >
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                💸 Nueva Transferencia
              </h2>
              <div className="mb-3 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                <p className="text-xs text-blue-300">
                  💡 Transfiere dinero entre tus bancos de forma segura
                </p>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2 flex items-center gap-2">
                    🏦 Banco Destino (¿A dónde va el dinero?)
                  </label>
                  <select
                    value={transferData.hacia}
                    onChange={(e) => setTransferData({ ...transferData, hacia: e.target.value })}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                  >
                    {Object.keys(bancos)
                      .filter((k) => k !== nombreBanco)
                      .map((k) => (
                        <option key={k} value={k}>
                          {nombres[k]}
                        </option>
                      ))}
                  </select>
                  <p className="text-xs text-slate-400 mt-1 ml-1">
                    Selecciona el banco que recibirá el dinero
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2 flex items-center gap-2">
                    💵 Monto a Transferir ($)
                  </label>
                  <input
                    type="number"
                    value={transferData.monto}
                    onChange={(e) =>
                      setTransferData({ ...transferData, monto: parseFloat(e.target.value) || 0 })
                    }
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                    placeholder="Ej: 50000"
                  />
                  <p className="text-xs text-slate-400 mt-1 ml-1">
                    Cantidad de dinero a transferir
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2 flex items-center gap-2">
                    📝 Concepto / Motivo
                  </label>
                  <input
                    type="text"
                    value={transferData.concepto}
                    onChange={(e) => setTransferData({ ...transferData, concepto: e.target.value })}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                    placeholder="Ej: Fondeo mensual, Reserva de emergencia, etc."
                  />
                  <p className="text-xs text-slate-400 mt-1 ml-1">
                    Descripción del motivo de la transferencia
                  </p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowTransferModal(false)}
                    className="flex-1 px-4 py-2 border border-white/10 rounded-lg"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={realizarTransferencia}
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg"
                  >
                    Transferir
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {showGastoModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
            onClick={() => setShowGastoModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              onClick={(e) => e.stopPropagation()}
              className="glass rounded-2xl p-6 max-w-md w-full border border-white/10"
            >
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">💸 Registrar Gasto</h2>
              <div className="mb-3 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                <p className="text-xs text-red-300">
                  ⚠️ Este dinero SALDRÁ de este banco (gasto/egreso)
                </p>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2 flex items-center gap-2">
                    💵 Monto del Gasto ($)
                  </label>
                  <input
                    type="number"
                    value={gastoData.monto}
                    onChange={(e) =>
                      setGastoData({ ...gastoData, monto: parseFloat(e.target.value) || 0 })
                    }
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-white"
                    placeholder="Ej: 5000"
                  />
                  <p className="text-xs text-slate-400 mt-1 ml-1">
                    Cantidad de dinero que gastaste
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2 flex items-center gap-2">
                    📝 ¿En qué gastaste?
                  </label>
                  <input
                    type="text"
                    value={gastoData.concepto}
                    onChange={(e) => setGastoData({ ...gastoData, concepto: e.target.value })}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-white"
                    placeholder="Ej: Renta de oficina, Servicios, Nómina, etc."
                  />
                  <p className="text-xs text-slate-400 mt-1 ml-1">
                    Descripción del gasto realizado
                  </p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowGastoModal(false)}
                    className="flex-1 px-4 py-2 border border-white/10 rounded-lg"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={registrarGasto}
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 rounded-lg"
                  >
                    Registrar
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {showIngresoModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
            onClick={() => setShowIngresoModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              onClick={(e) => e.stopPropagation()}
              className="glass rounded-2xl p-6 max-w-md w-full border border-white/10"
            >
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                💰 Registrar Ingreso
              </h2>
              <div className="mb-3 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                <p className="text-xs text-green-300">
                  ✅ Este dinero ENTRARÁ a este banco (ingreso extra)
                </p>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2 flex items-center gap-2">
                    💵 Monto del Ingreso ($)
                  </label>
                  <input
                    type="number"
                    value={ingresoData.monto}
                    onChange={(e) =>
                      setIngresoData({ ...ingresoData, monto: parseFloat(e.target.value) || 0 })
                    }
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-white"
                    placeholder="Ej: 10000"
                  />
                  <p className="text-xs text-slate-400 mt-1 ml-1">Cantidad de dinero que ingresó</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2 flex items-center gap-2">
                    📝 ¿De dónde vino el dinero?
                  </label>
                  <input
                    type="text"
                    value={ingresoData.concepto}
                    onChange={(e) => setIngresoData({ ...ingresoData, concepto: e.target.value })}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-white"
                    placeholder="Ej: Aportación socio, Préstamo, Inversión, etc."
                  />
                  <p className="text-xs text-slate-400 mt-1 ml-1">
                    Descripción del origen del ingreso
                  </p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowIngresoModal(false)}
                    className="flex-1 px-4 py-2 border border-white/10 rounded-lg"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={registrarIngreso}
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg"
                  >
                    Registrar
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Historial de transferencias y gastos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="glass rounded-2xl p-6 border border-white/10">
            <h2 className="text-xl font-bold mb-4">Transferencias Recientes</h2>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {banco.transferencias
                .slice(-10)
                .reverse()
                .map((t, _idx) => (
                  <div
                    key={_idx}
                    className={`p-3 rounded-lg border-l-4 ${
                      t.tipo === 'entrada'
                        ? 'border-green-500 bg-green-500/10'
                        : 'border-red-500 bg-red-500/10'
                    }`}
                  >
                    <div className="flex justify-between">
                      <span className="text-sm font-semibold">
                        {t.tipo === 'entrada'
                          ? `De ${nombres[t.desde]}`
                          : `Hacia ${nombres[t.hacia]}`}
                      </span>
                      <span
                        className={`text-sm font-bold ${
                          t.tipo === 'entrada' ? 'text-green-400' : 'text-red-400'
                        }`}
                      >
                        {t.tipo === 'entrada' ? '+' : '-'}${t.monto.toLocaleString()}
                      </span>
                    </div>
                    {t.concepto && <p className="text-xs text-slate-400 mt-1">{t.concepto}</p>}
                    <p className="text-xs text-slate-500 mt-1">{t.fecha}</p>
                  </div>
                ))}
              {banco.transferencias.length === 0 && (
                <p className="text-center text-slate-400 py-4">No hay transferencias</p>
              )}
            </div>
          </div>

          <div className="glass rounded-2xl p-6 border border-white/10">
            <h2 className="text-xl font-bold mb-4">Gastos Recientes</h2>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {banco.gastos
                .slice(-10)
                .reverse()
                .map((g, _idx) => (
                  <div key={_idx} className="p-3 rounded-lg bg-white/5">
                    <div className="flex justify-between">
                      <span className="text-sm font-semibold">{g.concepto}</span>
                      <span className="text-sm font-bold text-red-400">
                        -${g.monto.toLocaleString()}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">{g.fecha}</p>
                  </div>
                ))}
              {banco.gastos.length === 0 && (
                <p className="text-center text-slate-400 py-4">No hay gastos registrados</p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // BANCOS PANEL - VERSIÓN MEJORADA CON TRANSFERENCIAS Y GASTOS
  const BancosPanel = () => {
    const [selectedBanco, setSelectedBanco] = useState('bovedaMonte');
    const [showTransferModal, setShowTransferModal] = useState(false);
    const [showGastoModal, setShowGastoModal] = useState(false);
    const [transferData, setTransferData] = useState({
      desde: 'bovedaMonte',
      hacia: 'utilidades',
      monto: 0,
      concepto: '',
    });
    const [gastoData, setGastoData] = useState({
      concepto: '',
      monto: 0,
    });

    const nombres = {
      bovedaMonte: 'Bóveda Monte',
      utilidades: 'Utilidades',
      fletes: 'Fletes',
      azteca: 'Azteca',
      leftie: 'Leftie',
      profit: 'Profit',
    };

    const banco = bancos?.[selectedBanco] || {
      capitalActual: 0,
      historico: 0,
      ingresos: [],
      gastos: [],
      transferencias: [],
      registros: [],
    };

    const realizarTransferencia = () => {
      if (
        transferData.monto <= 0 ||
        transferData.monto > bancos[transferData.desde].capitalActual
      ) {
        showNotification('Monto inválido o fondos insuficientes', 'error');
        return;
      }

      if (transferData.desde === transferData.hacia) {
        showNotification('Selecciona bancos diferentes', 'error');
        return;
      }

      setBancos({
        ...bancos,
        [transferData.desde]: {
          ...bancos[transferData.desde],
          capitalActual: bancos[transferData.desde].capitalActual - transferData.monto,
          transferencias: [
            ...bancos[transferData.desde].transferencias,
            {
              tipo: 'salida',
              hacia: transferData.hacia,
              monto: transferData.monto,
              concepto: transferData.concepto,
              fecha: new Date().toLocaleString(),
            },
          ],
        },
        [transferData.hacia]: {
          ...bancos[transferData.hacia],
          capitalActual: bancos[transferData.hacia].capitalActual + transferData.monto,
          transferencias: [
            ...bancos[transferData.hacia].transferencias,
            {
              tipo: 'entrada',
              desde: transferData.desde,
              monto: transferData.monto,
              concepto: transferData.concepto,
              fecha: new Date().toLocaleString(),
            },
          ],
        },
      });

      showNotification('Transferencia realizada exitosamente', 'success');
      setShowTransferModal(false);
      setTransferData({ desde: 'bovedaMonte', hacia: 'utilidades', monto: 0, concepto: '' });
    };

    const registrarGasto = () => {
      if (gastoData.monto <= 0 || gastoData.monto > banco.capitalActual) {
        showNotification('Monto inválido o fondos insuficientes', 'error');
        return;
      }

      if (!gastoData.concepto.trim()) {
        showNotification('El concepto es requerido', 'error');
        return;
      }

      setBancos({
        ...bancos,
        [selectedBanco]: {
          ...bancos[selectedBanco],
          capitalActual: bancos[selectedBanco].capitalActual - gastoData.monto,
          gastos: [
            ...bancos[selectedBanco].gastos,
            {
              id: `GAS-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              concepto: gastoData.concepto,
              monto: gastoData.monto,
              fecha: new Date().toLocaleString(),
            },
          ],
        },
      });

      showNotification('Gasto registrado exitosamente', 'success');
      setShowGastoModal(false);
      setGastoData({ concepto: '', monto: 0 });
    };

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Bancos</h1>
          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowTransferModal(true)}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-violet-500 font-semibold flex items-center gap-2"
            >
              <ArrowRight className="w-5 h-5" />
              Transferir
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowGastoModal(true)}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-red-500 to-orange-500 font-semibold flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Registrar Gasto
            </motion.button>
          </div>
        </div>

        {/* Modal de Transferencia */}
        {showTransferModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={() => setShowTransferModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              onClick={(e) => e.stopPropagation()}
              className="glass rounded-2xl p-6 border border-white/10 max-w-md w-full mx-4"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Transferencia Entre Bancos</h2>
                <button onClick={() => setShowTransferModal(false)}>
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">Desde</label>
                  <select
                    value={transferData.desde}
                    onChange={(e) => setTransferData({ ...transferData, desde: e.target.value })}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 text-white"
                  >
                    {Object.keys(bancos).map((key) => (
                      <option key={key} value={key}>
                        {nombres[key]}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-slate-400 mt-1">
                    Disponible: ${bancos[transferData.desde].capitalActual.toLocaleString()}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">Hacia</label>
                  <select
                    value={transferData.hacia}
                    onChange={(e) => setTransferData({ ...transferData, hacia: e.target.value })}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 text-white"
                  >
                    {Object.keys(bancos).map((key) => (
                      <option key={key} value={key}>
                        {nombres[key]}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">Monto</label>
                  <input
                    type="number"
                    value={transferData.monto}
                    onChange={(e) =>
                      setTransferData({ ...transferData, monto: parseFloat(e.target.value) || 0 })
                    }
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 text-white"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">
                    Concepto (opcional)
                  </label>
                  <input
                    type="text"
                    value={transferData.concepto}
                    onChange={(e) => setTransferData({ ...transferData, concepto: e.target.value })}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 text-white"
                    placeholder="Ej: Capitalización"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowTransferModal(false)}
                    className="flex-1 px-6 py-2 border border-white/10 rounded-xl hover:bg-white/5"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={realizarTransferencia}
                    className="flex-1 px-6 py-2 bg-gradient-to-r from-purple-500 to-violet-500 rounded-xl hover:shadow-lg"
                  >
                    Transferir
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Modal de Gasto */}
        {showGastoModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={() => setShowGastoModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              onClick={(e) => e.stopPropagation()}
              className="glass rounded-2xl p-6 border border-white/10 max-w-md w-full mx-4"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Registrar Gasto</h2>
                <button onClick={() => setShowGastoModal(false)}>
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="glass rounded-lg p-4">
                  <p className="text-sm text-slate-400">Banco seleccionado</p>
                  <p className="text-xl font-bold">{nombres[selectedBanco]}</p>
                  <p className="text-sm text-green-400 mt-1">
                    Disponible: ${banco.capitalActual.toLocaleString()}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">
                    Concepto
                  </label>
                  <input
                    type="text"
                    value={gastoData.concepto}
                    onChange={(e) => setGastoData({ ...gastoData, concepto: e.target.value })}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 text-white"
                    placeholder="Ej: Renta de oficina"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">Monto</label>
                  <input
                    type="number"
                    value={gastoData.monto}
                    onChange={(e) =>
                      setGastoData({ ...gastoData, monto: parseFloat(e.target.value) || 0 })
                    }
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 text-white"
                    placeholder="0.00"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowGastoModal(false)}
                    className="flex-1 px-6 py-2 border border-white/10 rounded-xl hover:bg-white/5"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={registrarGasto}
                    className="flex-1 px-6 py-2 bg-gradient-to-r from-red-500 to-orange-500 rounded-xl hover:shadow-lg"
                  >
                    Registrar
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Selector de banco */}
        <div className="flex gap-2 overflow-x-auto">
          {Object.keys(bancos).map((key) => (
            <button
              key={key}
              onClick={() => setSelectedBanco(key)}
              className={`px-4 py-2 rounded-xl font-semibold whitespace-nowrap transition-all ${
                selectedBanco === key
                  ? 'bg-gradient-to-r from-blue-500 to-cyan-500'
                  : 'bg-white/5 hover:bg-white/10'
              }`}
            >
              {nombres[key]}
            </button>
          ))}
        </div>

        {/* Información del banco */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass rounded-2xl p-6 border border-white/10">
            <p className="text-sm text-slate-400 mb-2">Capital Actual</p>
            <p className="text-3xl font-bold text-green-400">
              ${banco.capitalActual.toLocaleString()}
            </p>
          </div>

          <div className="glass rounded-2xl p-6 border border-white/10">
            <p className="text-sm text-slate-400 mb-2">Histórico Total</p>
            <p className="text-3xl font-bold text-blue-400">${banco.historico.toLocaleString()}</p>
          </div>

          <div className="glass rounded-2xl p-6 border border-white/10">
            <p className="text-sm text-slate-400 mb-2">Total Gastos</p>
            <p className="text-3xl font-bold text-red-400">
              ${(banco?.gastos || []).reduce((sum, g) => sum + (g?.monto || 0), 0).toLocaleString()}
            </p>
          </div>
        </div>

        {/* Transferencias */}
        {banco.transferencias && banco.transferencias.length > 0 && (
          <div className="glass rounded-2xl p-6 border border-white/10">
            <h2 className="text-xl font-bold mb-4">Transferencias</h2>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {banco.transferencias.map((trans, _idx) => (
                <div
                  key={_idx}
                  className={`p-4 glass rounded-lg flex justify-between items-center cursor-context-menu transition-all hover:bg-white/5 ${
                    trans.tipo === 'entrada'
                      ? 'border-l-4 border-green-500'
                      : 'border-l-4 border-red-500'
                  }`}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    setContextMenu({
                      x: e.clientX,
                      y: e.clientY,
                      items: [
                        {
                          label: 'Ver detalles',
                          icon: Eye,
                          onClick: () => {
                            const detalle =
                              trans.tipo === 'entrada'
                                ? `Recibido de ${trans.desde}: $${trans.monto?.toLocaleString()}`
                                : `Enviado a ${trans.hacia}: $${trans.monto?.toLocaleString()}`;
                            showNotification(detalle, 'info');
                          },
                        },
                        { divider: true },
                        {
                          label: 'Revertir transferencia',
                          icon: Info,
                          disabled: true,
                          onClick: () => {
                            showNotification(
                              'Revertir transferencias aún no disponible',
                              'warning'
                            );
                          },
                        },
                      ],
                    });
                  }}
                >
                  <div>
                    <p className="font-semibold">
                      {trans.tipo === 'entrada'
                        ? `Recibido de ${nombres[trans.desde]}`
                        : `Enviado a ${nombres[trans.hacia]}`}
                    </p>
                    {trans.concepto && <p className="text-sm text-slate-400">{trans.concepto}</p>}
                    <p className="text-xs text-slate-500 mt-1">{trans.fecha}</p>
                  </div>
                  <span
                    className={`text-lg font-bold ${
                      trans.tipo === 'entrada' ? 'text-green-400' : 'text-red-400'
                    }`}
                  >
                    {trans.tipo === 'entrada' ? '+' : '-'}${trans.monto.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Registros */}
        <div className="glass rounded-2xl p-6 border border-white/10">
          <h2 className="text-xl font-bold mb-4">Registros</h2>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {banco.registros.map((registro, _idx) => (
              <div
                key={_idx}
                className="p-4 glass rounded-lg flex justify-between items-center cursor-context-menu transition-all hover:bg-white/5"
                onContextMenu={(e) => {
                  e.preventDefault();
                  setContextMenu({
                    x: e.clientX,
                    y: e.clientY,
                    items: [
                      {
                        label: 'Ver detalles',
                        icon: Eye,
                        onClick: () => {
                          showNotification(
                            `Ingreso: ${registro.concepto} - $${registro.monto?.toLocaleString()}`,
                            'info'
                          );
                        },
                      },
                      { divider: true },
                      {
                        label: 'Eliminar ingreso',
                        icon: Trash2,
                        danger: true,
                        onClick: () => deleteBancoRegistro(selectedBanco, 'ingreso', registro.id),
                      },
                    ],
                  });
                }}
              >
                <div>
                  <p className="font-semibold">{registro.concepto}</p>
                  <p className="text-sm text-slate-400">{registro.fecha}</p>
                </div>
                <span className="text-lg font-bold text-green-400">
                  ${registro.monto.toLocaleString()}
                </span>
              </div>
            ))}
            {banco.registros.length === 0 && (
              <div className="text-center text-slate-400 py-8">
                <Building2 className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No hay registros</p>
              </div>
            )}
          </div>
        </div>

        {/* Gastos */}
        <div className="glass rounded-2xl p-6 border border-white/10">
          <h2 className="text-xl font-bold mb-4">Gastos</h2>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {banco.gastos.map((gasto, _idx) => (
              <div
                key={_idx}
                className="p-4 glass rounded-lg flex justify-between items-center cursor-context-menu transition-all hover:bg-white/5"
                onContextMenu={(e) => {
                  e.preventDefault();
                  setContextMenu({
                    x: e.clientX,
                    y: e.clientY,
                    items: [
                      {
                        label: 'Ver detalles',
                        icon: Eye,
                        onClick: () => {
                          showNotification(
                            `Gasto: ${gasto.concepto} - $${gasto.monto?.toLocaleString()}`,
                            'info'
                          );
                        },
                      },
                      { divider: true },
                      {
                        label: 'Eliminar gasto',
                        icon: Trash2,
                        danger: true,
                        onClick: () => deleteBancoRegistro(selectedBanco, 'gasto', gasto.id),
                      },
                    ],
                  });
                }}
              >
                <div>
                  <p className="font-semibold">{gasto.concepto}</p>
                  <p className="text-sm text-slate-400">{gasto.fecha}</p>
                </div>
                <span className="text-lg font-bold text-red-400">
                  -${gasto.monto.toLocaleString()}
                </span>
              </div>
            ))}
            {banco.gastos.length === 0 && (
              <div className="text-center text-slate-400 py-8">
                <DollarSign className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No hay gastos registrados</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // REPORTES PANEL
  const ReportesPanel = () => {
    const [showExportModal, setShowExportModal] = useState(false);
    const [exportFormat, setExportFormat] = useState('pdf');
    const [dateRange, setDateRange] = useState({ inicio: '', fin: '' });

    // Cálculos optimizados con useMemo
    const totalIngresos = React.useMemo(
      () => (ventas || []).reduce((sum, v) => sum + (v?.totalVenta || 0), 0),
      [ventas]
    );

    const totalEgresos = React.useMemo(
      () => (ordenesCompra || []).reduce((sum, o) => sum + (o?.total || 0), 0),
      [ordenesCompra]
    );

    const totalBancos = React.useMemo(
      () => Object.values(bancos || {}).reduce((sum, b) => sum + (b?.capitalActual || 0), 0),
      [bancos]
    );

    // Datos para gráficos de tendencias
    const chartData = React.useMemo(
      () => [
        { mes: 'Ene', ingresos: 85000, egresos: 65000 },
        { mes: 'Feb', ingresos: 92000, egresos: 70000 },
        { mes: 'Mar', ingresos: 78000, egresos: 58000 },
        { mes: 'Abr', ingresos: 105000, egresos: 80000 },
        { mes: 'May', ingresos: 118000, egresos: 85000 },
        { mes: 'Jun', ingresos: 125000, egresos: 90000 },
      ],
      []
    );

    // Función para exportar a PDF
    const exportToPDF = () => {
      const content = `
REPORTE FLOWDISTRIBUTOR
========================
Fecha de generación: ${new Date().toLocaleString()}
${
  dateRange.inicio
    ? `Período: ${dateRange.inicio} - ${dateRange.fin}`
    : 'Período: Todos los registros'
}

RESUMEN FINANCIERO
------------------
Total en Bancos: $${totalBancos.toLocaleString()}
Ingresos Totales: $${totalIngresos.toLocaleString()}
Egresos Totales: $${totalEgresos.toLocaleString()}
Balance: $${(totalIngresos - totalEgresos).toLocaleString()}

DISTRIBUCIÓN DE CAPITAL POR BANCO
----------------------------------
${Object.entries(bancos)
  .map(([key, banco]) => {
    const nombres = {
      bovedaMonte: 'Bóveda Monte',
      utilidades: 'Utilidades',
      fletes: 'Fletes',
      azteca: 'Azteca',
      leftie: 'Leftie',
      profit: 'Profit',
    };
    const percentage = totalBancos > 0 ? (banco.capitalActual / totalBancos) * 100 : 0;
    return `${nombres[key]}: $${banco.capitalActual.toLocaleString()} (${percentage.toFixed(1)}%)`;
  })
  .join('\n')}

RESUMEN DE OPERACIONES
----------------------
Total Órdenes de Compra: ${ordenesCompra.length}
Total Ventas: ${ventas.length}
Distribuidores Activos: ${distribuidores.length}
Clientes Activos: ${clientes.length}
Productos en Stock: ${almacen.stock.length}

ADEUDOS PENDIENTES
------------------
Distribuidores: $${(distribuidores || []).reduce((sum, d) => sum + (d?.adeudo || 0), 0).toLocaleString()}
Clientes: $${(clientes || []).reduce((sum, c) => sum + (c?.adeudo || 0), 0).toLocaleString()}
      `.trim();

      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `reporte-flowdistributor-${new Date().toISOString().split('T')[0]}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      showNotification('Reporte exportado exitosamente', 'success');
      setShowExportModal(false);
    };

    // Función para exportar a Excel (CSV)
    const exportToExcel = () => {
      let csvContent = 'REPORTE FLOWDISTRIBUTOR\n';
      csvContent += `Fecha de generación,${new Date().toLocaleString()}\n\n`;

      csvContent += 'RESUMEN FINANCIERO\n';
      csvContent += 'Concepto,Monto\n';
      csvContent += `Total en Bancos,$${totalBancos}\n`;
      csvContent += `Ingresos Totales,$${totalIngresos}\n`;
      csvContent += `Egresos Totales,$${totalEgresos}\n`;
      csvContent += `Balance,$${totalIngresos - totalEgresos}\n\n`;

      csvContent += 'DISTRIBUCIÓN DE CAPITAL POR BANCO\n';
      csvContent += 'Banco,Capital Actual,Porcentaje\n';
      Object.entries(bancos).forEach(([key, banco]) => {
        const nombres = {
          bovedaMonte: 'Bóveda Monte',
          utilidades: 'Utilidades',
          fletes: 'Fletes',
          azteca: 'Azteca',
          leftie: 'Leftie',
          profit: 'Profit',
        };
        const percentage = totalBancos > 0 ? (banco.capitalActual / totalBancos) * 100 : 0;
        csvContent += `${nombres[key]},$${banco.capitalActual},${percentage.toFixed(1)}%\n`;
      });

      csvContent += '\nRESUMEN DE OPERACIONES\n';
      csvContent += `Total Órdenes de Compra,${ordenesCompra.length}\n`;
      csvContent += `Total Ventas,${ventas.length}\n`;
      csvContent += `Distribuidores Activos,${distribuidores.length}\n`;
      csvContent += `Clientes Activos,${clientes.length}\n`;
      csvContent += `Productos en Stock,${almacen.stock.length}\n`;

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `reporte-flowdistributor-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      showNotification('Reporte exportado exitosamente (formato CSV)', 'success');
      setShowExportModal(false);
    };

    const handleExport = () => {
      if (exportFormat === 'pdf') {
        exportToPDF();
      } else {
        exportToExcel();
      }
    };

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Reportes y Estadísticas</h1>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowExportModal(true)}
            className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl font-semibold flex items-center gap-2 hover:shadow-lg hover:shadow-green-500/20 transition-all"
          >
            <Download className="w-5 h-5" />
            Exportar Reporte
          </motion.button>
        </div>

        {/* Modal de Exportación */}
        {showExportModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
            onClick={() => setShowExportModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              onClick={(e) => e.stopPropagation()}
              className="glass rounded-2xl p-8 max-w-md w-full border border-white/10"
            >
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Download className="w-6 h-6" />
                Exportar Reporte
              </h2>

              <div className="space-y-6">
                {/* Formato */}
                <div>
                  <label className="block text-sm font-semibold mb-3">Formato de exportación</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setExportFormat('pdf')}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        exportFormat === 'pdf'
                          ? 'border-red-500 bg-red-500/10'
                          : 'border-white/10 hover:border-white/20'
                      }`}
                    >
                      <FileText className="w-6 h-6 mx-auto mb-2" />
                      <p className="text-sm font-semibold">PDF/TXT</p>
                    </button>
                    <button
                      onClick={() => setExportFormat('excel')}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        exportFormat === 'excel'
                          ? 'border-green-500 bg-green-500/10'
                          : 'border-white/10 hover:border-white/20'
                      }`}
                    >
                      <FileSpreadsheet className="w-6 h-6 mx-auto mb-2" />
                      <p className="text-sm font-semibold">Excel/CSV</p>
                    </button>
                  </div>
                </div>

                {/* Rango de fechas (opcional) */}
                <div>
                  <label className="block text-sm font-semibold mb-3">
                    Rango de fechas (opcional)
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Desde</label>
                      <input
                        type="date"
                        value={dateRange.inicio}
                        onChange={(e) => setDateRange({ ...dateRange, inicio: e.target.value })}
                        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Hasta</label>
                      <input
                        type="date"
                        value={dateRange.fin}
                        onChange={(e) => setDateRange({ ...dateRange, fin: e.target.value })}
                        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Botones */}
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setShowExportModal(false)}
                    className="flex-1 px-4 py-3 border border-white/10 rounded-xl hover:bg-white/5 transition-colors"
                  >
                    Cancelar
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleExport}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/20 transition-all"
                  >
                    Exportar
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Resumen General */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="glass rounded-2xl p-6 border border-white/10">
            <p className="text-sm text-slate-400 mb-2">Total en Bancos</p>
            <p className="text-3xl font-bold text-blue-400">${totalBancos.toLocaleString()}</p>
          </div>

          <div className="glass rounded-2xl p-6 border border-white/10">
            <p className="text-sm text-slate-400 mb-2">Ingresos Totales</p>
            <p className="text-3xl font-bold text-green-400">${totalIngresos.toLocaleString()}</p>
          </div>

          <div className="glass rounded-2xl p-6 border border-white/10">
            <p className="text-sm text-slate-400 mb-2">Egresos Totales</p>
            <p className="text-3xl font-bold text-red-400">${totalEgresos.toLocaleString()}</p>
          </div>

          <div className="glass rounded-2xl p-6 border border-white/10">
            <p className="text-sm text-slate-400 mb-2">Balance</p>
            <p className="text-3xl font-bold text-purple-400">
              ${(totalIngresos - totalEgresos).toLocaleString()}
            </p>
          </div>
        </div>

        {/* Gráfico de Bancos */}
        <div className="glass rounded-2xl p-6 border border-white/10">
          <h2 className="text-xl font-bold mb-4">Distribución de Capital por Banco</h2>
          <div className="space-y-3">
            {Object.entries(bancos || {}).map(([key, banco]) => {
              const percentage =
                totalBancos > 0 ? ((banco?.capitalActual || 0) / totalBancos) * 100 : 0;
              const nombres = {
                bovedaMonte: 'Bóveda Monte',
                bovedaUSA: 'Bóveda USA 🇺🇸',
                utilidades: 'Utilidades',
                fletes: 'Fletes',
                azteca: 'Azteca',
                leftie: 'Leftie',
                profit: 'Profit',
              };

              return (
                <div key={key}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-semibold">{nombres[key]}</span>
                    <span className="text-slate-400">
                      ${(banco?.capitalActual || 0).toLocaleString()} ({percentage.toFixed(1)}%)
                    </span>
                  </div>
                  <div className="h-3 bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 1, delay: 0.2 }}
                      className="h-full bg-gradient-to-r from-blue-500 to-cyan-500"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass rounded-2xl p-6 border border-white/10">
            <h2 className="text-xl font-bold mb-4">Resumen de Operaciones</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-slate-400">Total Órdenes de Compra:</span>
                <span className="font-bold">{ordenesCompra.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Total Ventas:</span>
                <span className="font-bold">{ventas.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Distribuidores Activos:</span>
                <span className="font-bold">{distribuidores.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Clientes Activos:</span>
                <span className="font-bold">{clientes.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Productos en Stock:</span>
                <span className="font-bold">{almacen.stock.length}</span>
              </div>
            </div>
          </div>

          <div className="glass rounded-2xl p-6 border border-white/10">
            <h2 className="text-xl font-bold mb-4">Adeudos Pendientes</h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-slate-400 mb-2">Distribuidores:</p>
                <p className="text-2xl font-bold text-red-400">
                  $
                  {(distribuidores || [])
                    .reduce((sum, d) => sum + (d?.adeudo || 0), 0)
                    .toLocaleString()}
                </p>
              </div>
              <div className="pt-3 border-t border-white/10">
                <p className="text-sm text-slate-400 mb-2">Clientes:</p>
                <p className="text-2xl font-bold text-yellow-400">
                  ${(clientes || []).reduce((sum, c) => sum + (c?.adeudo || 0), 0).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 📊 ADVANCED CHARTS SECTION */}
        <div className="space-y-6">
          {/* Sales Heatmap */}
          <SalesHeatmap data={ventas} />

          {/* KPI Gauges Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <GaugeChart
              value={ventas.length}
              max={100}
              title="Meta de Ventas"
              subtitle="Ventas este mes"
            />
            <GaugeChart
              value={totalBancos}
              max={1000000}
              title="Capital Disponible"
              subtitle="Total en bancos"
            />
            <GaugeChart
              value={almacen.stock.filter((p) => p.cantidad > p.cantidadMinima).length}
              max={almacen.stock.length}
              title="Stock Saludable"
              subtitle="Productos con stock adecuado"
            />
          </div>

          {/* Conversion Funnel */}
          <ConversionFunnel
            data={[
              { name: 'Clientes Potenciales', value: clientes.length * 2 },
              { name: 'Cotizaciones', value: Math.floor(clientes.length * 1.5) },
              { name: 'Ventas Iniciadas', value: clientes.length },
              {
                name: 'Ventas Completadas',
                value: ventas.filter((v) => v.estadoPago === 'completo').length,
              },
              {
                name: 'Clientes Recurrentes',
                value: clientes.filter((c) => c.ventas.length > 1).length,
              },
            ]}
          />

          {/* Period Comparison */}
          <PeriodComparison
            currentData={[
              { mes: 'Ene', value: totalIngresos * 0.15 },
              { mes: 'Feb', value: totalIngresos * 0.18 },
              { mes: 'Mar', value: totalIngresos * 0.2 },
              { mes: 'Abr', value: totalIngresos * 0.22 },
              { mes: 'May', value: totalIngresos * 0.25 },
            ]}
            previousData={[
              { mes: 'Ene', value: totalIngresos * 0.12 },
              { mes: 'Feb', value: totalIngresos * 0.14 },
              { mes: 'Mar', value: totalIngresos * 0.16 },
              { mes: 'Abr', value: totalIngresos * 0.18 },
              { mes: 'May', value: totalIngresos * 0.2 },
            ]}
            metricName="Ingresos Mensuales"
          />

          {/* Radar Analysis */}
          <RadarAnalysis
            data={{
              actual: {
                Ventas: ventas.length,
                Stock: almacen.stock.length,
                Clientes: clientes.length,
                Distribuidores: distribuidores.length,
                Capital: totalBancos / 10000,
                Rentabilidad: (totalIngresos - totalEgresos) / 1000,
              },
              objetivo: {
                Ventas: 100,
                Stock: 150,
                Clientes: 50,
                Distribuidores: 20,
                Capital: 100,
                Rentabilidad: 50,
              },
            }}
            categories={[
              'Ventas',
              'Stock',
              'Clientes',
              'Distribuidores',
              'Capital',
              'Rentabilidad',
            ]}
          />

          {/* Trend Prediction */}
          <TrendPrediction
            historicalData={chartData.slice(0, 5).map((item, _idx) => ({
              date: item.mes,
              value: item.ingresos,
            }))}
            predictions={[
              { date: 'Jun', predicted: chartData[0]?.ingresos * 1.1 || 0 },
              { date: 'Jul', predicted: chartData[0]?.ingresos * 1.15 || 0 },
              { date: 'Ago', predicted: chartData[0]?.ingresos * 1.2 || 0 },
            ]}
          />
        </div>

        {/* Gráficos Avanzados con Recharts */}
        <Suspense fallback={<ChartsLoading />}>
          <ReportsCharts
            bancos={bancos}
            totalIngresos={totalIngresos}
            totalEgresos={totalEgresos}
          />
        </Suspense>
      </div>
    );
  };

  // RENDER SECTION
  const renderSection = () => {
    try {
      // Verificar si es un panel de banco individual
      if (activePanel.startsWith('banco-')) {
        const bancoKey = activePanel.replace('banco-', '');

        // 🚀 PANELES PREMIUM - Usar componentes especializados
        switch (bancoKey) {
          case 'utilidades':
            return <PanelUtilidades />;
          case 'fletes':
            return <PanelFletes />;
          case 'bovedaMonte':
            return <PanelBovedaMonte />;
          case 'azteca':
            return <PanelAzteca />;
          case 'leftie':
            return <PanelLeftie />;
          case 'profit':
            return <PanelProfit />;
          default:
            return <BancoPanelIndividual nombreBanco={bancoKey} />;
        }
      }

      switch (activePanel) {
        case 'dashboard':
          return <Dashboard />;
        case 'ordenes':
          return <OrdenesPanel />;
        case 'distribuidores':
          return <DistribuidoresPanel />;
        case 'almacen':
          return <AlmacenPanel />;
        case 'ventas':
          return <VentasPanel />;
        case 'clientes':
          return <ClientesPanel />;
        case 'gastosAbonos':
          return <GastosAbonosPanel />;
        case 'reportes':
          return <ReportesPanel />;

        // 🚀 PANELES PREMIUM (acceso directo)
        case 'utilidades':
          return <PanelUtilidades />;
        case 'fletes':
          return <PanelFletes />;
        case 'bovedaMonte':
          return <PanelBovedaMonte />;
        case 'azteca':
          return <PanelAzteca />;
        case 'leftie':
          return <PanelLeftie />;
        case 'profit':
          return <PanelProfit />;
        case 'clientesCartera':
          return <PanelClientes />;

        default:
          return <Dashboard />;
      }
    } catch (error) {
      // console.error('Error rendering section:', error);
      return (
        <div className="p-8 bg-red-500/20 border border-red-500 rounded-lg text-white">
          <h2 className="text-2xl font-bold mb-4">Error al renderizar el panel</h2>
          <p className="mb-2">Panel activo: {activePanel}</p>
          <p className="text-red-300">{error.toString()}</p>
          <button
            onClick={() => setActivePanel('dashboard')}
            className="mt-4 px-4 py-2 bg-blue-500 rounded-lg hover:bg-blue-600"
          >
            Volver al Dashboard
          </button>
        </div>
      );
    }
  };

  return (
    <div
      className={`flex h-screen ${
        darkMode ? 'bg-slate-950' : 'bg-slate-900'
      } overflow-hidden relative`}
    >
      {/* Cursor glow effect */}
      <CursorGlow />

      {/* Animated grid background */}
      <div className="absolute inset-0 opacity-20 pointer-events-none z-0">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)',
            backgroundSize: '50px 50px',
          }}
        />
      </div>

      {/* SIDEBAR - Siempre visible en desktop */}
      <Sidebar />

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col overflow-hidden relative z-10">
        {/* Header Optimizado */}
        <header className="glass-strong border-b border-blue-500/20 px-6 py-4 flex-shrink-0">
          <div className="flex items-center justify-between gap-4">
            {/* Left Section */}
            <div className="flex items-center gap-4 flex-1">
              {/* Botón hamburger - solo visible en móviles */}
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="lg:hidden p-2 hover:bg-white/10 rounded-xl transition-all"
                aria-label="Toggle menu"
              >
                <Menu className="w-6 h-6 text-blue-400" />
              </motion.button>

              {/* Panel title con gradiente */}
              <div className="flex items-center gap-3">
                <motion.h2
                  key={activePanel}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent capitalize"
                >
                  {activePanel
                    .replace('banco-', '')
                    .replace(/([A-Z])/g, ' $1')
                    .trim()}
                </motion.h2>

                {/* Breadcrumb indicator */}
                {activePanel.startsWith('banco-') && (
                  <span className="px-3 py-1 bg-green-500/20 border border-green-500/30 rounded-full text-xs font-semibold text-green-300 flex items-center gap-1">
                    <DollarSign className="w-3 h-3" />
                    Banco
                  </span>
                )}
              </div>
            </div>

            {/* Right Section - Herramientas */}
            <div className="flex items-center gap-2">
              {/* Theme toggle */}
              <motion.button
                whileHover={{ scale: 1.1, rotate: 180 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleTheme}
                className="p-2.5 hover:bg-white/10 rounded-xl transition-all border border-white/5 hover:border-white/20"
                title="Cambiar tema"
              >
                {darkMode ? (
                  <Sun className="w-5 h-5 text-yellow-400" />
                ) : (
                  <Moon className="w-5 h-5 text-blue-400" />
                )}
              </motion.button>

              {/* Notificaciones */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowNotificationCenter(true)}
                className="p-2.5 hover:bg-white/10 rounded-xl transition-all relative border border-white/5 hover:border-blue-500/30"
                aria-label="notifications"
                title="Notificaciones (Ctrl+Shift+N)"
              >
                <Bell className="w-5 h-5 text-blue-400" />
                {notificationSystem.unreadCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 500 }}
                    className="absolute -top-1 -right-1 min-w-[20px] h-5 bg-gradient-to-r from-red-500 to-pink-500 rounded-full text-xs flex items-center justify-center font-bold px-1.5 shadow-lg shadow-red-500/50"
                  >
                    {notificationSystem.unreadCount > 9 ? '9+' : notificationSystem.unreadCount}
                  </motion.span>
                )}
              </motion.button>

              {/* Búsqueda */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowSearchBar(!showSearchBar)}
                className="p-2.5 hover:bg-white/10 rounded-xl transition-all border border-white/5 hover:border-cyan-500/30"
                aria-label="search"
                title="Búsqueda (Ctrl+K)"
              >
                <Search className="w-5 h-5 text-cyan-400" />
              </motion.button>

              {/* Atajos de teclado */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowKeyboardHelp(true)}
                className="hidden md:flex p-2.5 hover:bg-white/10 rounded-xl transition-all border border-white/5 hover:border-purple-500/30"
                title="Atajos de Teclado (?)"
              >
                <Keyboard className="w-5 h-5 text-purple-400" />
              </motion.button>

              {/* Personalizador de temas */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowThemeCustomizer(true)}
                className="hidden md:flex p-2.5 hover:bg-white/10 rounded-xl transition-all relative border border-white/5 hover:border-pink-500/30"
                title="Personalizar Tema"
              >
                <div className="relative">
                  <span className="text-xl">{themeManager.theme.icon}</span>
                  <motion.span
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute -bottom-1 -right-1 w-2 h-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
                  />
                </div>
              </motion.button>

              {/* Undo/Redo */}
              <div className="hidden md:flex items-center gap-1 border-l border-white/10 pl-3 ml-1">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => actionHistory.undo()}
                  disabled={!actionHistory.canUndo}
                  className="p-2 hover:bg-white/10 rounded-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                  title={`Deshacer (Ctrl+Z)${
                    actionHistory.canUndo
                      ? ` - ${actionHistory.history[actionHistory.currentIndex - 1]?.action}`
                      : ''
                  }`}
                >
                  <Undo2 className="w-5 h-5 text-orange-400" />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => actionHistory.redo()}
                  disabled={!actionHistory.canRedo}
                  className="p-2 hover:bg-white/10 rounded-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                  title={`Rehacer (Ctrl+Shift+Z)${
                    actionHistory.canRedo
                      ? ` - ${actionHistory.history[actionHistory.currentIndex + 1]?.action}`
                      : ''
                  }`}
                >
                  <Redo2 className="w-5 h-5 text-green-400" />
                </motion.button>
              </div>

              {/* Settings */}
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowSettingsModal(true)}
                className="p-2.5 hover:bg-white/10 rounded-xl transition-all border border-white/5 hover:border-slate-500/30"
                title="Configuración"
              >
                <Settings className="w-5 h-5 text-slate-400" />
              </motion.button>
            </div>
          </div>

          {/* Barra de búsqueda expandible */}
          <AnimatePresence>
            {showSearchBar && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden mt-3"
              >
                <div className="flex gap-3">
                  {/* Búsqueda */}
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Buscar por nombre, producto, cliente..."
                      className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-blue-500 transition-colors text-white"
                      autoFocus
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-white/5 rounded-lg"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {/* Filtros rápidos */}
                  <div className="flex gap-2">
                    <select
                      value={filterOptions.status}
                      onChange={(e) =>
                        setFilterOptions({ ...filterOptions, status: e.target.value })
                      }
                      className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-blue-500 cursor-pointer text-white"
                    >
                      <option value="todos" className="bg-slate-800">
                        Todos
                      </option>
                      <option value="activo" className="bg-slate-800">
                        Activos
                      </option>
                      <option value="pendiente" className="bg-slate-800">
                        Pendientes
                      </option>
                      <option value="completado" className="bg-slate-800">
                        Completados
                      </option>
                    </select>

                    <select
                      value={filterOptions.sortBy}
                      onChange={(e) =>
                        setFilterOptions({ ...filterOptions, sortBy: e.target.value })
                      }
                      className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-blue-500 cursor-pointer text-white"
                    >
                      <option value="reciente" className="bg-slate-800">
                        Más reciente
                      </option>
                      <option value="antiguo" className="bg-slate-800">
                        Más antiguo
                      </option>
                      <option value="mayor" className="bg-slate-800">
                        Mayor monto
                      </option>
                      <option value="menor" className="bg-slate-800">
                        Menor monto
                      </option>
                      <option value="alfabetico" className="bg-slate-800">
                        A-Z
                      </option>
                    </select>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6 bg-slate-900/50">
          <AnimatePresence mode="wait">
            <motion.div
              key={activePanel}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="w-full h-full"
            >
              {renderSection()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Toast Container */}
      <ToastContainer />

      {/* AI Assistant Premium */}
      <AIAssistant
        systemName="FlowDistributor"
        systemContext="Sistema de gestión empresarial, control de inventario, distribuidores, ventas, bancos y finanzas"
        accentColor="blue"
        position="bottom-right"
      />

      {/* Settings Modal */}
      <SettingsModal />

      {/* 🔔 CENTRO DE NOTIFICACIONES AVANZADO */}
      <NotificationCenter
        isOpen={showNotificationCenter}
        onClose={() => setShowNotificationCenter(false)}
        notifications={notificationSystem.notifications}
        onAction={(action, id) => {
          switch (action) {
            case 'markRead':
              notificationSystem.markAsRead(id);
              break;
            case 'markAllRead':
              notificationSystem.markAllAsRead();
              break;
            case 'delete':
              notificationSystem.deleteNotification(id);
              break;
            case 'clearRead':
              notificationSystem.clearRead();
              break;
          }
        }}
      />

      {/* ⌨️ AYUDA DE ATAJOS DE TECLADO */}
      <KeyboardShortcutsHelp isOpen={showKeyboardHelp} onClose={() => setShowKeyboardHelp(false)} />

      {/* � PERSONALIZADOR DE TEMAS */}
      <ThemeCustomizer isOpen={showThemeCustomizer} onClose={() => setShowThemeCustomizer(false)} />

      {/* �🎯 TOUR GUIADO INTERACTIVO */}
      <GuidedTour tour={tour} />

      {/* MODAL DE CONFIRMACION BULK ACTIONS */}
      {bulkConfirmAction && (
        <BulkConfirmModal
          isOpen={true}
          onClose={() => setBulkConfirmAction(null)}
          onConfirm={bulkConfirmAction.onConfirm}
          title={bulkConfirmAction.title}
          message={bulkConfirmAction.message}
          confirmText={bulkConfirmAction.confirmText}
          confirmColor={bulkConfirmAction.confirmColor}
          itemCount={bulkConfirmAction.itemCount}
          isDangerous={bulkConfirmAction.isDangerous}
        />
      )}

      {/* MENU CONTEXTUAL */}
      <AnimatePresence>
        {contextMenu && (
          <ContextMenu
            x={contextMenu.x}
            y={contextMenu.y}
            items={contextMenu.items}
            onClose={() => setContextMenu(null)}
          />
        )}
      </AnimatePresence>

      {/* 🔴 NOTIFICACIONES REAL-TIME CON WEBSOCKET (Blueprint Supreme 2025) */}
      <RealtimeNotifications serverUrl="ws://localhost:3001" position="top-right" />
    </div>
  );
}
