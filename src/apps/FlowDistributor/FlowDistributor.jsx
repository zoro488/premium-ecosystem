import React, { useState, useEffect, Suspense, lazy, useMemo, useCallback } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import {
  LayoutDashboard,
  Package,
  Users,
  Warehouse,
  TrendingUp,
  UserCheck,
  Building2,
  FileText,
  Bell,
  Search,
  Menu,
  X,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  CheckCircle2,
  AlertCircle,
  Plus,
  Settings,
  Moon,
  Sun,
  Bot,
  Send,
  ArrowRight,
  FileSpreadsheet,
  TrendingDown,
  Wallet,
  ArrowUpDown,
  Eye,
  List,
  BarChart3,
  Clock,
  Calendar,
  Target,
  Download,
  Zap,
  Sparkles,
  Keyboard,
  Undo2,
  Redo2,
} from 'lucide-react';
import AIAssistant from '../../components/shared/AIAssistant';
import { STORAGE_KEYS, useLocalStorage } from '../../utils/storage';

// 🚀 NUEVAS IMPORTACIONES - FEATURES AVANZADOS
import NotificationCenter, { useNotifications, NOTIFICATION_PRIORITY, NOTIFICATION_CATEGORY } from '../../components/NotificationCenter';
import { useAdvancedSearch } from '../../utils/searchHooks';
import { highlightMatch } from '../../utils/searchUtils';
import { useKeyboardShortcuts, KeyboardShortcutsHelp } from '../../utils/keyboardShortcuts';
import { useActionHistory } from '../../utils/undoRedo';
import { GuidedTour, useTour } from '../../components/GuidedTour';
import { useTheme, ThemeCustomizer } from '../../utils/themeSystem';
import { 
  SalesHeatmap, 
  GaugeChart, 
  ConversionFunnel, 
  PeriodComparison, 
  RadarAnalysis, 
  TrendPrediction 
} from '../../components/AdvancedCharts';
import { 
  useBulkSelection, 
  useBulkActions, 
  SelectionCheckbox, 
  BulkActionsBar, 
  BulkConfirmModal 
} from '../../utils/bulkActions';
import { 
  useDragAndDrop, 
  DraggableItem, 
  DragOverlay, 
  DragModeToggle,
  usePersistentOrder 
} from '../../utils/dragAndDrop';

// Lazy loading para componentes pesados
const ReportsCharts = lazy(() => import('../../components/Charts'));
import ChartsLoading from '../../components/ChartsLoading';

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
    window.addEventListener('mousemove', moveCursor);
    return () => window.removeEventListener('mousemove', moveCursor);
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
  const [voiceRecognition, setVoiceRecognition] = useState(null);
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  
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

  // Estados de datos con persistencia
  const [bancos, setBancos] = useLocalStorage(STORAGE_KEYS.FLOW_BANCOS, {
    bovedaMonte: { capitalActual: 850000, historico: 1200000, registros: [], gastos: [], transferencias: [] },
    utilidades: { capitalActual: 425000, historico: 600000, registros: [], gastos: [], transferencias: [] },
    fletes: { capitalActual: 180000, historico: 250000, registros: [], gastos: [], transferencias: [] },
    azteca: { capitalActual: 95000, historico: 150000, registros: [], gastos: [], transferencias: [] },
    leftie: { capitalActual: 62000, historico: 100000, registros: [], gastos: [], transferencias: [] },
    profit: { capitalActual: 340000, historico: 480000, registros: [], gastos: [], transferencias: [] },
  });

  const [ordenesCompra, setOrdenesCompra] = useLocalStorage(STORAGE_KEYS.FLOW_ORDENES, []);
  const [distribuidores, setDistribuidores] = useLocalStorage(STORAGE_KEYS.FLOW_DISTRIBUIDORES, []);
  const [ventas, setVentas] = useLocalStorage(STORAGE_KEYS.FLOW_VENTAS, []);
  const [clientes, setClientes] = useLocalStorage(STORAGE_KEYS.FLOW_CLIENTES, []);
  const [almacen, setAlmacen] = useLocalStorage(STORAGE_KEYS.FLOW_ALMACEN, {
    stock: [
      { 
        id: 'PROD001',
        nombre: 'Laptop HP EliteBook 840', 
        cantidad: 25, 
        cantidadMinima: 10,
        cantidadMaxima: 50,
        costoUnitario: 15000,
        precioVenta: 22000,
        categoria: 'Electrónicos',
        proveedor: 'Tech Solutions S.A.',
        fechaIngreso: '2024-10-15',
        ubicacion: 'A1-B2',
        estado: 'Activo',
        valorInventario: 375000,
        margenGanancia: 46.7,
        rotacion: 'Alta'
      },
      { 
        id: 'PROD002',
        nombre: 'Monitor Samsung 24" FHD', 
        cantidad: 40, 
        cantidadMinima: 15,
        cantidadMaxima: 60,
        costoUnitario: 2800,
        precioVenta: 4200,
        categoria: 'Electrónicos',
        proveedor: 'Display World',
        fechaIngreso: '2024-10-12',
        ubicacion: 'A2-C1',
        estado: 'Activo',
        valorInventario: 112000,
        margenGanancia: 50,
        rotacion: 'Media'
      },
      { 
        id: 'PROD003',
        nombre: 'Silla Ejecutiva Ergonómica', 
        cantidad: 8, 
        cantidadMinima: 5,
        cantidadMaxima: 20,
        costoUnitario: 3500,
        precioVenta: 5800,
        categoria: 'Mobiliario',
        proveedor: 'Oficina Plus',
        fechaIngreso: '2024-10-10',
        ubicacion: 'B1-A3',
        estado: 'Stock Bajo',
        valorInventario: 28000,
        margenGanancia: 65.7,
        rotacion: 'Baja'
      },
      { 
        id: 'PROD004',
        nombre: 'Impresora Multifuncional Canon', 
        cantidad: 15, 
        cantidadMinima: 8,
        cantidadMaxima: 25,
        costoUnitario: 4200,
        precioVenta: 6800,
        categoria: 'Electrónicos',
        proveedor: 'Canon Distribuidor',
        fechaIngreso: '2024-10-08',
        ubicacion: 'A3-B1',
        estado: 'Activo',
        valorInventario: 63000,
        margenGanancia: 61.9,
        rotacion: 'Media'
      },
      { 
        id: 'PROD005',
        nombre: 'Teclado Mecánico RGB', 
        cantidad: 60, 
        cantidadMinima: 20,
        cantidadMaxima: 80,
        costoUnitario: 1200,
        precioVenta: 2100,
        categoria: 'Accesorios',
        proveedor: 'Gaming Store',
        fechaIngreso: '2024-10-14',
        ubicacion: 'C1-A2',
        estado: 'Activo',
        valorInventario: 72000,
        margenGanancia: 75,
        rotacion: 'Alta'
      }
    ],
    entradas: [
      {
        id: 'ENT001',
        nombre: 'Laptop HP EliteBook 840',
        cantidad: 10,
        costoUnitario: 15000,
        costoTotal: 150000,
        proveedor: 'Tech Solutions S.A.',
        fecha: '2024-10-15',
        numeroFactura: 'FAC-2024-1205',
        usuario: 'Admin'
      },
      {
        id: 'ENT002',
        nombre: 'Monitor Samsung 24" FHD',
        cantidad: 20,
        costoUnitario: 2800,
        costoTotal: 56000,
        proveedor: 'Display World',
        fecha: '2024-10-12',
        numeroFactura: 'FAC-2024-1198',
        usuario: 'Admin'
      }
    ],
    salidas: [
      {
        id: 'SAL001',
        nombre: 'Silla Ejecutiva Ergonómica',
        cantidad: 2,
        motivoSalida: 'Venta',
        cliente: 'Corporativo XYZ',
        fecha: '2024-10-16',
        precioVenta: 5800,
        valorTotal: 11600,
        usuario: 'Vendedor1'
      }
    ]
  });

  // Estados de búsqueda y filtros
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [filterOptions, setFilterOptions] = useState({
    status: 'todos',
    dateRange: 'todos',
    sortBy: 'reciente'
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
    TOGGLE_SIDEBAR: () => setIsSidebarOpen(!isSidebarOpen),
    TOGGLE_AI: () => setShowAIWidget(!showAIWidget),
    NOTIFICATIONS: () => setShowNotificationCenter(true),
    HELP: () => setShowKeyboardHelp(true),
    CANCEL: () => {
      setShowSearchBar(false);
      setShowNotificationCenter(false);
      setShowKeyboardHelp(false);
    }
  });

  // Helper optimizado para agregar notificaciones avanzadas
  const addAdvancedNotification = useCallback((config) => {
    notificationSystem.addNotification(config);
  }, [notificationSystem.addNotification]);

  // 🎤 INICIALIZAR WEB SPEECH API - OPTIMIZADO
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'es-MX';

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setAiInput(transcript);
      };

      recognition.onerror = () => {
        addAdvancedNotification({
          title: 'Error de voz',
          message: 'No se pudo reconocer el audio',
          type: 'error',
          priority: NOTIFICATION_PRIORITY.LOW,
          category: NOTIFICATION_CATEGORY.SYSTEM
        });
      };

      recognition.onend = () => {
        setIsRecordingVoice(false);
      };

      setVoiceRecognition(recognition);
    }
  }, [addAdvancedNotification]);
  
  // 🔔 NOTIFICACIONES AUTOMÁTICAS - OPTIMIZADO
  useEffect(() => {
    const productosStockBajo = almacen.stock.filter(item => item.cantidad <= (item.cantidadMinima || 5));

    if (productosStockBajo.length > 0) {
      const lastNotified = localStorage.getItem('last_stock_notification');
      const now = Date.now();
      const oneHour = 60 * 60 * 1000;

      if (!lastNotified || (now - Number.parseInt(lastNotified)) > oneHour) {
        addAdvancedNotification({
          title: '⚠️ Stock Bajo',
          message: `${productosStockBajo.length} productos necesitan reorden urgente`,
          priority: NOTIFICATION_PRIORITY.HIGH,
          category: NOTIFICATION_CATEGORY.INVENTORY,
          action: {
            label: 'Ver Almacén',
            callback: () => setActivePanel('almacen')
          }
        });
        localStorage.setItem('last_stock_notification', now.toString());
      }
    }
  }, [almacen.stock, addAdvancedNotification, setActivePanel]);
  
  // 🎯 TOUR AUTOMÁTICO PARA NUEVOS USUARIOS - OPTIMIZADO
  useEffect(() => {
    if (!tour.completed && !tour.isActive) {
      const timer = setTimeout(() => {
        tour.start();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [tour.completed, tour.isActive, tour.start]);

  // 🎨 BULK SELECTION HOOKS - Para cada entidad
  const productosSelection = useBulkSelection(almacen.stock, 'id');
  const ventasSelection = useBulkSelection(ventas, 'id');
  const clientesSelection = useBulkSelection(clientes, 'id');
  const ordenesSelection = useBulkSelection(ordenesCompra, 'id');
  const distribuidoresSelection = useBulkSelection(distribuidores, 'id');
  
  // 🎨 BULK ACTIONS HOOKS
  const bulkActionsManager = useBulkActions(
    (result) => {
      showNotification(`✓ Operación completada: ${result.successCount} elementos procesados`, 'success');
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
  const [productosOrdenados, setProductosOrdenados] = usePersistentOrder('productos', almacen.stock);
  const dragDropProductos = useDragAndDrop(productosOrdenados, (newOrder) => {
    setProductosOrdenados(newOrder);
    setAlmacen(prev => ({ ...prev, stock: newOrder }));
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
    setDarkMode(prev => !prev);
  }, [setDarkMode]);

  // Toast notifications - MEJORADO CON INTEGRACIÓN Y OPTIMIZADO
  const showNotification = useCallback((message, type = 'info') => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 3000);

    // También agregar al sistema de notificaciones avanzado
    const priorityMap = {
      'success': NOTIFICATION_PRIORITY.LOW,
      'error': NOTIFICATION_PRIORITY.HIGH,
      'info': NOTIFICATION_PRIORITY.MEDIUM
    };

    const categoryMap = {
      'success': NOTIFICATION_CATEGORY.INFO,
      'error': NOTIFICATION_CATEGORY.ALERT,
      'info': NOTIFICATION_CATEGORY.SYSTEM
    };

    notificationSystem.addNotification({
      title: type === 'error' ? 'Error' : type === 'success' ? 'Éxito' : 'Información',
      message,
      priority: priorityMap[type] || NOTIFICATION_PRIORITY.MEDIUM,
      category: categoryMap[type] || NOTIFICATION_CATEGORY.SYSTEM
    });
  }, [notificationSystem]);

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
        await bulkActionsManager.bulkDelete(
          selectedItems,
          async (item) => {
            // Simular delete con delay
            await new Promise(resolve => setTimeout(resolve, 100));
            return true;
          }
        );
        
        // Actualizar almacén
        const newStock = almacen.stock.filter(p => !productosSelection.selectedItems.includes(p.id));
        setAlmacen({ ...almacen, stock: newStock });
        setBulkConfirmAction(null);
        actionHistory.addAction(`Eliminar ${selectedItems.length} productos en masa`, { items: selectedItems });
      },
      onCancel: () => setBulkConfirmAction(null)
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
        setVentas(ventas.filter(v => !ventasSelection.selectedItems.includes(v.id)));
        setBulkConfirmAction(null);
        actionHistory.addAction(`Eliminar ${selectedItems.length} ventas en masa`, { items: selectedItems });
      },
      onCancel: () => setBulkConfirmAction(null)
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
        setClientes(clientes.filter(c => !clientesSelection.selectedItems.includes(c.id)));
        setBulkConfirmAction(null);
        actionHistory.addAction(`Eliminar ${selectedItems.length} clientes en masa`, { items: selectedItems });
      },
      onCancel: () => setBulkConfirmAction(null)
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
    actionHistory.addAction(`Exportar ${selectedItems.length} productos`, { count: selectedItems.length });
  };
  
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
    actionHistory.addAction(`Exportar ${selectedItems.length} ventas`, { count: selectedItems.length });
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
    actionHistory.addAction(`Exportar ${selectedItems.length} clientes`, { count: selectedItems.length });
  };

  // AI Widget Handlers
  // AI CONVERSACIONAL REVOLUCIONARIA CON PERSONALIDAD Y CONTEXTO
  const handleAISend = () => {
    if (!aiInput.trim()) return;
    const userMessage = aiInput.toLowerCase();
    const messageTime = new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });
    
    setAiMessages([...aiMessages, { type: 'user', text: aiInput, time: messageTime }]);
    setAiConversationContext([...aiConversationContext, { role: 'user', message: userMessage }]);

    // Simular "typing indicator"
    setAiMessages(prev => [...prev, { type: 'typing', text: '...' }]);

    setTimeout(() => {
      let aiResponse = '';
      let suggestedActions = [];
      let quickReplies = [];

      // ANÁLISIS CONVERSACIONAL AVANZADO CON CONTEXTO
      const totalBancos = Object.values(bancos).reduce((sum, b) => sum + b.capitalActual, 0);
      const totalIngresos = ventas.reduce((sum, v) => sum + (v.totalVenta || 0), 0);
      const totalEgresos = ordenesCompra.reduce((sum, o) => sum + (o.total || 0), 0);
      const gananciaTotal = totalIngresos - totalEgresos;
      const productosStockBajo = almacen.stock.filter(item => item.cantidad <= (item.cantidadMinima || 5)).length;
      const adeudosClientes = clientes.reduce((sum, c) => sum + c.adeudo, 0);
      const adeudosDistribuidores = distribuidores.reduce((sum, d) => sum + d.adeudo, 0);
      
      // Detectar último tema de conversación
      const lastContext = aiConversationContext.slice(-3);
      const isFollowUp = lastContext.some(ctx => 
        ctx.message.includes('más') || ctx.message.includes('detalle') || ctx.message.includes('específic')
      );

      // SALUDOS Y PRESENTACIÓN
      if (userMessage.match(/^(hola|hey|buenas|buenos días|buenas tardes|hi|hello)/)) {
        const greetings = [
          `¡Hola! 👋 Soy Flow, tu asistente inteligente. Acabo de revisar tus números y todo se ve ${gananciaTotal > 0 ? '¡excelente! 📈' : 'interesante 🤔'}`,
          `¡Hey! 😊 Flow aquí, listo para ayudarte. Vi que tienes $${totalBancos.toLocaleString()} en bancos. ¿En qué puedo asistirte hoy?`,
          `¡Qué tal! 🚀 Soy Flow, tu copiloto de negocios. ${productosStockBajo > 0 ? `⚠️ Noté que ${productosStockBajo} productos necesitan reorden.` : '✨ Todo está bajo control.'} ¿Qué necesitas?`
        ];
        aiResponse = greetings[Math.floor(Math.random() * greetings.length)];
        quickReplies = ['📊 Ver resumen', '💰 Estado financiero', '📦 Revisar inventario', '🎯 Sugerencias'];
      }
      
      // ANÁLISIS INTELIGENTE DE FINANZAS
      else if (userMessage.includes('banco') || userMessage.includes('capital') || userMessage.includes('saldo') || userMessage.includes('dinero')) {
        const topBancos = Object.entries(bancos)
          .sort(([,a], [,b]) => b.capitalActual - a.capitalActual)
          .slice(0, 3);
        
        const nombres = {
          bovedaMonte: 'Bóveda Monte 🏦',
          utilidades: 'Utilidades 💎',
          fletes: 'Fletes 🚚',
          azteca: 'Azteca 🏛️',
          leftie: 'Leftie 🎯',
          profit: 'Profit 💰'
        };

        if (totalBancos > 100000) {
          aiResponse = `¡Impresionante! 💪 Tienes un capital sólido de $${totalBancos.toLocaleString()} distribuido estratégicamente:\n\n`;
        } else if (totalBancos > 50000) {
          aiResponse = `Bien hecho 👍 Mantienes $${totalBancos.toLocaleString()} en liquidez. Aquí está la distribución:\n\n`;
        } else {
          aiResponse = `Tu capital actual es de $${totalBancos.toLocaleString()}. Te recomendaría aumentar reservas. Distribución:\n\n`;
        }

        topBancos.forEach(([key, banco], i) => {
          const percentage = ((banco.capitalActual / totalBancos) * 100).toFixed(1);
          aiResponse += `${i === 0 ? '🥇' : i === 1 ? '🥈' : '🥉'} ${nombres[key]}: $${banco.capitalActual.toLocaleString()} (${percentage}%)\n`;
        });

        suggestedActions = ['Ver todos los bancos', 'Hacer transferencia', 'Registrar ingreso'];
        quickReplies = ['💸 Hacer transferencia', '📊 Ver detalles', '💡 Consejos financieros'];
      }
      
      // VENTAS Y RENDIMIENTO
      else if (userMessage.includes('venta') || userMessage.includes('ingreso') || userMessage.includes('ganancia')) {
        const tasaCrecimiento = totalIngresos > 0 ? ((totalIngresos - totalEgresos) / totalIngresos * 100).toFixed(1) : 0;
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
        const clientesConAdeudo = clientes.filter(c => c.adeudo > 0);
        const topDeudores = clientesConAdeudo
          .sort((a, b) => b.adeudo - a.adeudo)
          .slice(0, 3);

        if (clientesConAdeudo.length === 0) {
          aiResponse = `¡Perfecto! 🎊 Todos tus ${clientes.length} clientes están al corriente. Excelente gestión de cobranza.\n\n`;
          aiResponse += `💡 Sugerencia: Aprovecha para ofrecer promociones y fidelizarlos aún más.`;
          quickReplies = ['➕ Agregar cliente', '📊 Ver análisis', '🎁 Crear promoción'];
        } else {
          aiResponse = `Tienes ${clientes.length} clientes registrados.\n\n`;
          aiResponse += `⚠️ ${clientesConAdeudo.length} con adeudos pendientes por $${adeudosClientes.toLocaleString()}:\n\n`;
          
          topDeudores.forEach((cliente, i) => {
            aiResponse += `${i + 1}. ${cliente.nombre}: $${cliente.adeudo.toLocaleString()}\n`;
          });

          aiResponse += `\n💡 Te recomiendo priorizar la cobranza con ${topDeudores[0]?.nombre || 'estos clientes'}.`;
          quickReplies = ['📞 Enviar recordatorio', '💵 Registrar pago', '📋 Ver todos'];
        }

        suggestedActions = ['Registrar pago', 'Ver historial', 'Agregar cliente'];
      }
      
      // INVENTARIO Y ALMACÉN INTELIGENTE
      else if (userMessage.includes('almacen') || userMessage.includes('stock') || userMessage.includes('inventario') || userMessage.includes('producto')) {
        const valorTotalInventario = almacen.stock.reduce((sum, p) => 
          sum + (p.cantidad * (p.precioVenta || 0)), 0
        );
        const productosAgotados = almacen.stock.filter(p => p.cantidad === 0).length;

        aiResponse = `📦 Estado del Almacén:\n\n`;
        aiResponse += `✅ Productos en stock: ${almacen.stock.length}\n`;
        aiResponse += `💰 Valor del inventario: $${valorTotalInventario.toLocaleString()}\n`;
        
        if (productosStockBajo > 0) {
          aiResponse += `⚠️ Productos con stock bajo: ${productosStockBajo}\n`;
          const productosCriticos = almacen.stock
            .filter(p => p.cantidad <= (p.cantidadMinima || 5))
            .slice(0, 3);
          aiResponse += `\n🚨 Requieren reorden urgente:\n`;
          productosCriticos.forEach(p => {
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
        const distConAdeudo = distribuidores.filter(d => d.adeudo > 0);
        
        if (distConAdeudo.length === 0) {
          aiResponse = `👍 Excelente relación con proveedores!\n\n`;
          aiResponse += `Tienes ${distribuidores.length} distribuidores registrados, todos al corriente.\n\n`;
          aiResponse += `💡 Mantén esta buena relación para negociar mejores términos.`;
        } else {
          aiResponse = `📊 Análisis de Distribuidores:\n\n`;
          aiResponse += `Total registrados: ${distribuidores.length}\n`;
          aiResponse += `⚠️ Con adeudos: ${distConAdeudo.length}\n`;
          aiResponse += `💸 Adeudo total: $${adeudosDistribuidores.toLocaleString()}\n\n`;
          
          const topAdeudos = distConAdeudo
            .sort((a, b) => b.adeudo - a.adeudo)
            .slice(0, 3);
          
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
        const ordenesRecientes = ordenesCompra.slice(-5);
        const totalOrdenes = ordenesCompra.reduce((sum, o) => sum + (o.total || 0), 0);
        
        aiResponse = `📦 Gestión de Órdenes de Compra:\n\n`;
        aiResponse += `📋 Total de órdenes: ${ordenesCompra.length}\n`;
        aiResponse += `💰 Inversión total: $${totalOrdenes.toLocaleString()}\n\n`;
        
        if (ordenesRecientes.length > 0) {
          aiResponse += `Últimas órdenes:\n`;
          ordenesRecientes.reverse().forEach((orden, i) => {
            aiResponse += `${i + 1}. ${orden.proveedor || 'Proveedor'} - $${(orden.total || 0).toLocaleString()}\n`;
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
      else if (userMessage.includes('reporte') || userMessage.includes('estadística') || userMessage.includes('análisis') || userMessage.includes('gráfico')) {
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
      else if (userMessage.includes('ayuda') || userMessage.includes('qué puedes') || userMessage.includes('cómo funciona')) {
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

        quickReplies = ['💰 Estado financiero', '📦 Ver inventario', '📊 Reportes', '🚀 Tour guiado'];
      }
      
      // NAVEGACIÓN INTELIGENTE
      else if (userMessage.includes('ir a') || userMessage.includes('abrir') || userMessage.includes('mostrar') || userMessage.includes('ver')) {
        const panelMap = {
          'dashboard': 'dashboard',
          'inicio': 'dashboard',
          'principal': 'dashboard',
          'orden': 'ordenes',
          'compra': 'ordenes',
          'distribuidor': 'distribuidores',
          'proveedor': 'distribuidores',
          'almacen': 'almacen',
          'inventario': 'almacen',
          'stock': 'almacen',
          'producto': 'almacen',
          'venta': 'ventas',
          'cliente': 'clientes',
          'banco': 'bancos',
          'dinero': 'bancos',
          'capital': 'bancos',
          'reporte': 'reportes',
          'estadística': 'reportes',
          'gráfico': 'reportes'
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
            'dashboard': 'Dashboard Principal',
            'ordenes': 'Órdenes de Compra',
            'distribuidores': 'Distribuidores',
            'almacen': 'Almacén',
            'ventas': 'Ventas',
            'clientes': 'Clientes',
            'bancos': 'Sistema Bancario',
            'reportes': 'Reportes y Análisis'
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
      else if (userMessage.includes('consejo') || userMessage.includes('sugerencia') || userMessage.includes('recomendación')) {
        aiResponse = `💡 Análisis y Recomendaciones Personalizadas:\n\n`;
        
        const insights = [];
        if (productosStockBajo > 0) {
          insights.push(`⚠️ URGENTE: ${productosStockBajo} productos necesitan reorden para evitar desabasto.`);
        }
        if (gananciaTotal < 0) {
          insights.push(`📉 Los egresos superan ingresos. Revisa costos y ajusta precios de venta.`);
        }
        if (adeudosClientes > totalBancos * 0.3) {
          insights.push(`💸 Las cuentas por cobrar representan más del 30% de tu capital. Intensifica la cobranza.`);
        }
        if (totalBancos < 20000) {
          insights.push(`🏦 El capital es bajo. Considera aumentar reservas para contingencias.`);
        }
        if (ventas.length < 10) {
          insights.push(`📈 Pocas ventas registradas. Enfócate en estrategias de marketing y adquisición.`);
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
          `💬 No capté eso del todo. Soy experto en:\n💰 Bancos y finanzas\n📦 Inventario y almacén\n📈 Ventas y reportes\n👥 Clientes y distribuidores\n\n¿Sobre qué quieres saber?`
        ];
        aiResponse = responses[Math.floor(Math.random() * responses.length)];
        quickReplies = ['💰 Finanzas', '📦 Inventario', '📊 Reportes', '❓ Ayuda'];
      }

      // Remover typing indicator y agregar respuesta
      setAiMessages(prev => {
        const filtered = prev.filter(m => m.type !== 'typing');
        return [...filtered, { 
          type: 'ai', 
          text: aiResponse,
          time: new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' }),
          quickReplies,
          suggestedActions
        }];
      });

      // Actualizar contexto
      setAiConversationContext(prev => [...prev, { role: 'ai', message: aiResponse }]);
    }, 1200 + Math.random() * 800); // Delay variable para simular "pensamiento"

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
        almacen
      }
    };

    const dataStr = JSON.stringify(backupData, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `flowdistributor-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showNotification('Respaldo creado exitosamente', 'success');
  };

  const restoreBackup = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const backupData = JSON.parse(e.target.result);

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
        showNotification('Error al restaurar el respaldo', 'error');
      }
    };
    reader.readAsText(file);
  };

  const clearAllData = () => {
    if (confirm('¿Estás seguro de que quieres borrar todos los datos? Esta acción no se puede deshacer.')) {
      setBancos({
        bovedaMonte: { capitalActual: 0, historico: 0, registros: [], gastos: [], transferencias: [] },
        utilidades: { capitalActual: 0, historico: 0, registros: [], gastos: [], transferencias: [] },
        fletes: { capitalActual: 0, historico: 0, registros: [], gastos: [], transferencias: [] },
        azteca: { capitalActual: 0, historico: 0, registros: [], gastos: [], transferencias: [] },
        leftie: { capitalActual: 0, historico: 0, registros: [], gastos: [], transferencias: [] },
        profit: { capitalActual: 0, historico: 0, registros: [], gastos: [], transferencias: [] },
      });
      setOrdenesCompra([]);
      setDistribuidores([]);
      setVentas([]);
      setClientes([]);
      setAlmacen({ stock: [], entradas: [], salidas: [] });
      showNotification('Todos los datos han sido eliminados', 'success');
    }
  };

  // TOAST CONTAINER
  const ToastContainer = () => (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      {notifications.map(notif => (
        <motion.div
          key={notif.id}
          initial={{ x: 400, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 400, opacity: 0 }}
          className={`glass rounded-xl px-6 py-4 shadow-2xl flex items-center gap-3 border-l-4 ${
            notif.type === 'success' ? 'border-green-500' :
            notif.type === 'error' ? 'border-red-500' :
            'border-blue-500'
          }`}
        >
          {notif.type === 'success' ? <CheckCircle2 className="w-5 h-5 text-green-500" /> :
           notif.type === 'error' ? <AlertCircle className="w-5 h-5 text-red-500" /> :
           <Bell className="w-5 h-5 text-blue-500" />}
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
            boxShadow: ["0 0 20px rgba(168, 85, 247, 0.4)", "0 0 40px rgba(59, 130, 246, 0.6)", "0 0 20px rgba(168, 85, 247, 0.4)"]
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
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
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
                      { label: '❓ Ayuda', query: '¿Qué puedes hacer?' }
                    ].map((action, idx) => (
                      <motion.button
                        key={idx}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.1 }}
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
                {aiMessages.map((msg, idx) => (
                  <div key={idx}>
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
                          <div className={`p-3 rounded-2xl whitespace-pre-line ${
                            msg.type === 'user'
                              ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-tr-sm shadow-lg'
                              : 'bg-white/10 text-white text-sm rounded-tl-sm border border-white/10'
                          }`}>
                            {msg.text}
                            {msg.time && (
                              <p className={`text-[10px] mt-1 ${msg.type === 'user' ? 'text-white/70' : 'text-slate-500'}`}>
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
                                  key={i}
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
                                  key={i}
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
  const SettingsModal = () => (
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
                    <p className="text-sm text-slate-400">Descarga todos tus datos en formato JSON</p>
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
                    <input
                      type="file"
                      accept=".json"
                      onChange={restoreBackup}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Borrar todos los datos */}
                <div className="flex items-center justify-between p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                  <div>
                    <p className="font-semibold text-red-400">Borrar Todos los Datos</p>
                    <p className="text-sm text-slate-400">⚠️ Esta acción no se puede deshacer</p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={clearAllData}
                    className="px-6 py-2 bg-gradient-to-r from-red-500 to-red-600 rounded-xl font-semibold hover:shadow-lg hover:shadow-red-500/20 transition-all"
                  >
                    Borrar
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
                  <span className="font-semibold">{almacen.stock.length}</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    )
  );

  // SIDEBAR
  const Sidebar = () => {
    const menuItems = [
      { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
      { id: 'ordenes', icon: Package, label: 'Órdenes de Compra' },
      { id: 'distribuidores', icon: Users, label: 'Distribuidores' },
      { id: 'almacen', icon: Warehouse, label: 'Almacén' },
      { id: 'ventas', icon: TrendingUp, label: 'Ventas' },
      { id: 'clientes', icon: UserCheck, label: 'Clientes' },
      { id: 'separator1', separator: true },
      { id: 'banco-bovedaMonte', icon: Building2, label: 'Bóveda Monte', isBanco: true },
      { id: 'banco-utilidades', icon: DollarSign, label: 'Utilidades', isBanco: true },
      { id: 'banco-fletes', icon: TrendingUp, label: 'Fletes', isBanco: true },
      { id: 'banco-azteca', icon: Building2, label: 'Azteca', isBanco: true },
      { id: 'banco-leftie', icon: DollarSign, label: 'Leftie', isBanco: true },
      { id: 'banco-profit', icon: TrendingUp, label: 'Profit', isBanco: true },
      { id: 'separator2', separator: true },
      { id: 'reportes', icon: FileText, label: 'Reportes' },
    ];

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
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            />
          )}
        </AnimatePresence>

        {/* Sidebar */}
        <motion.aside
          initial={false}
          animate={{ x: isSidebarOpen ? 0 : -320 }}
          transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          className="fixed lg:static left-0 top-0 w-80 glass-strong border-r border-blue-500/20 flex flex-col h-screen z-50"
        >
        {/* Header */}
        <div className="p-6 border-b border-blue-500/20">
          <div className="flex items-center gap-2 mb-1">
            <Building2 className="w-6 h-6 text-blue-400" />
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              FlowDistributor
            </h1>
          </div>
          <p className="text-xs text-slate-400">Sistema Empresarial</p>
        </div>

        {/* Menu */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {menuItems.map((item) => {
            // Separador
            if (item.separator) {
              return (
                <div key={item.id} className="my-4 border-t border-white/10"></div>
              );
            }

            const Icon = item.icon;
            const isActive = activePanel === item.id;

            return (
              <motion.button
                key={item.id}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setActivePanel(item.id);
                  setIsSidebarOpen(false);
                }}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all
                  ${isActive
                    ? 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30 text-blue-400'
                    : 'hover:bg-white/5 text-slate-400 hover:text-white'
                  }
                  ${item.isBanco ? 'text-sm' : ''}
                `}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span className="font-medium">{item.label}</span>
                {item.isBanco && (
                  <DollarSign className="w-4 h-4 ml-auto opacity-50" />
                )}
              </motion.button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-blue-500/20">
          <div className="glass rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium">Sistema Activo</p>
                <p className="text-xs text-green-400">● En línea</p>
              </div>
            </div>
          </div>
        </div>
      </motion.aside>
      </>
    );
  };

  // DASHBOARD PANEL REVOLUCIONARIO
  const Dashboard = () => {
    const [selectedTimeRange, setSelectedTimeRange] = useState('mes');
    const [showQuickActions, setShowQuickActions] = useState(false);
    const [liveStats, setLiveStats] = useState({ ventas: 0, ingresos: 0, ordenes: 0 });

    // Optimización con useMemo para cálculos pesados
    const totalBancos = React.useMemo(() =>
      Object.values(bancos).reduce((sum, b) => sum + b.capitalActual, 0),
      [bancos]
    );

    const totalIngresos = React.useMemo(() =>
      ventas.reduce((sum, v) => sum + (v.totalVenta || 0), 0),
      [ventas]
    );

    const totalEgresos = React.useMemo(() =>
      ordenesCompra.reduce((sum, o) => sum + (o.total || 0), 0),
      [ordenesCompra]
    );

    const gananciaTotal = React.useMemo(() =>
      totalIngresos - totalEgresos,
      [totalIngresos, totalEgresos]
    );

    const tasaCrecimiento = 18.5;

    const productosStockBajo = React.useMemo(() =>
      almacen.stock.filter(item => item.cantidad <= (item.cantidadMinima || 5)).length,
      [almacen.stock]
    );

    const adeudosClientes = React.useMemo(() =>
      clientes.reduce((sum, c) => sum + c.adeudo, 0),
      [clientes]
    );

    const adeudosDistribuidores = React.useMemo(() =>
      distribuidores.reduce((sum, d) => sum + d.adeudo, 0),
      [distribuidores]
    );

    // Datos para gráficos
    const chartData = React.useMemo(() => [
      { mes: 'Ene', ingresos: 85000, egresos: 65000 },
      { mes: 'Feb', ingresos: 92000, egresos: 70000 },
      { mes: 'Mar', ingresos: 78000, egresos: 58000 },
      { mes: 'Abr', ingresos: 105000, egresos: 80000 },
      { mes: 'May', ingresos: 118000, egresos: 85000 },
      { mes: 'Jun', ingresos: 125000, egresos: 90000 }
    ], []);

    // KPIs principales memorizados para optimización de performance
    const dashboardKPIs = React.useMemo(() => [
      {
        title: 'Capital Total',
        value: `$${totalBancos.toLocaleString()}`,
        icon: Wallet,
        gradient: 'from-cyan-400 to-blue-500',
        bgGradient: 'from-cyan-500/10 to-blue-500/5',
        change: '+12.5%',
        description: 'Efectivo disponible',
        action: () => setActivePanel('bancos')
      },
      {
        title: 'Ganancia Neta',
        value: `$${gananciaTotal.toLocaleString()}`,
        icon: TrendingUp,
        gradient: 'from-green-400 to-emerald-500',
        bgGradient: 'from-green-500/10 to-emerald-500/5',
        change: `+${tasaCrecimiento}%`,
        description: 'Ingresos - Egresos',
        action: () => setActivePanel('reportes')
      },
      {
        title: 'Operaciones',
        value: ventas.length + ordenesCompra.length,
        icon: Activity,
        gradient: 'from-purple-400 to-pink-500',
        bgGradient: 'from-purple-500/10 to-pink-500/5',
        change: '+23',
        description: 'Ventas y compras',
        action: () => {}
      },
      {
        title: 'Inventario',
        value: almacen.stock.length,
        icon: Package,
        gradient: 'from-orange-400 to-red-500',
        bgGradient: 'from-orange-500/10 to-red-500/5',
        change: productosStockBajo > 0 ? `⚠️ ${productosStockBajo} bajos` : '✓ Normal',
        description: 'Productos en stock',
        action: () => setActivePanel('almacen')
      }
    ], [totalBancos, gananciaTotal, tasaCrecimiento, ventas.length, ordenesCompra.length, almacen.stock.length, productosStockBajo, setActivePanel]);

    return (
      <div className="space-y-6">
        {/* Header Revolucionario */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
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
              className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-cyan-500 text-white"
            >
              <option value="hoy" className="bg-slate-800">Hoy</option>
              <option value="semana" className="bg-slate-800">Esta semana</option>
              <option value="mes" className="bg-slate-800">Este mes</option>
              <option value="trimestre" className="bg-slate-800">Trimestre</option>
              <option value="año" className="bg-slate-800">Este año</option>
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

        {/* KPIs Avanzados Principales */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {dashboardKPIs.map((kpi, index) => (
            <motion.div
              key={kpi.title}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ 
                scale: 1.05, 
                boxShadow: "0 25px 50px rgba(0,0,0,0.2)",
                y: -10,
                transition: { duration: 0.3 }
              }}
              onClick={kpi.action}
              className={`glass rounded-2xl p-6 border border-white/20 bg-gradient-to-br ${kpi.bgGradient} cursor-pointer group relative overflow-hidden`}
            >
              {/* Efecto de brillo animado */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                animate={{
                  x: ['-100%', '100%'],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  repeatDelay: 5
                }}
              />

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <motion.div
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                    className={`p-3 rounded-xl bg-gradient-to-r ${kpi.gradient} shadow-lg`}
                  >
                    <kpi.icon className="w-7 h-7 text-white" />
                  </motion.div>
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.1 + 0.5, type: "spring" }}
                    className="text-xs font-bold text-green-400 bg-green-400/20 px-3 py-1 rounded-full flex items-center gap-1"
                  >
                    <ArrowUpRight className="w-3 h-3" />
                    {kpi.change}
                  </motion.span>
                </div>
                
                <h3 className="text-sm font-semibold text-slate-400 mb-2">{kpi.title}</h3>
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.1 + 0.3 }}
                  className={`text-4xl font-bold bg-gradient-to-r ${kpi.gradient} bg-clip-text text-transparent mb-1`}
                >
                  {kpi.value}
                </motion.p>
                <p className="text-xs text-slate-500">{kpi.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Sección de Gráficos Avanzados */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Gráfico de Tendencias */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="glass rounded-2xl p-6 border border-white/10"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <BarChart3 className="w-6 h-6 text-cyan-400" />
                Tendencia Financiera
              </h2>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="text-cyan-400"
              >
                <Activity className="w-5 h-5" />
              </motion.div>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="mes" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(15, 23, 42, 0.9)', 
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '12px',
                      backdropFilter: 'blur(10px)'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="ingresos" 
                    stroke="#10B981" 
                    strokeWidth={4} 
                    dot={{ fill: '#10B981', strokeWidth: 2, r: 6 }}
                    activeDot={{ r: 8 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="egresos" 
                    stroke="#EF4444" 
                    strokeWidth={4} 
                    dot={{ fill: '#EF4444', strokeWidth: 2, r: 6 }}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="text-center p-3 bg-green-500/10 rounded-xl border border-green-500/20">
                <p className="text-sm text-slate-400">Ingresos Totales</p>
                <p className="text-2xl font-bold text-green-400">${totalIngresos.toLocaleString()}</p>
              </div>
              <div className="text-center p-3 bg-red-500/10 rounded-xl border border-red-500/20">
                <p className="text-sm text-slate-400">Egresos Totales</p>
                <p className="text-2xl font-bold text-red-400">${totalEgresos.toLocaleString()}</p>
              </div>
            </div>
          </motion.div>

          {/* Distribución de Capital */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="glass rounded-2xl p-6 border border-white/10"
          >
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Wallet className="w-6 h-6 text-purple-400" />
              Distribución de Capital
            </h2>
            <div className="space-y-4">
              {Object.entries(bancos).map(([key, banco], index) => {
                const percentage = totalBancos > 0 ? (banco.capitalActual / totalBancos) * 100 : 0;
                const nombres = {
                  bovedaMonte: '🏦 Bóveda Monte',
                  utilidades: '💎 Utilidades',
                  fletes: '🚚 Fletes',
                  azteca: '🏛️ Azteca',
                  leftie: '🎯 Leftie',
                  profit: '💰 Profit'
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
                  orange: 'group-hover:text-orange-400'
                };

                const badgeClasses = {
                  cyan: 'text-cyan-400 bg-cyan-400/20',
                  purple: 'text-purple-400 bg-purple-400/20',
                  green: 'text-green-400 bg-green-400/20',
                  blue: 'text-blue-400 bg-blue-400/20',
                  pink: 'text-pink-400 bg-pink-400/20',
                  orange: 'text-orange-400 bg-orange-400/20'
                };

                const barClasses = {
                  cyan: 'bg-gradient-to-r from-cyan-400 to-cyan-600 group-hover:from-cyan-300 group-hover:to-cyan-500 shadow-cyan-500/50',
                  purple: 'bg-gradient-to-r from-purple-400 to-purple-600 group-hover:from-purple-300 group-hover:to-purple-500 shadow-purple-500/50',
                  green: 'bg-gradient-to-r from-green-400 to-green-600 group-hover:from-green-300 group-hover:to-green-500 shadow-green-500/50',
                  blue: 'bg-gradient-to-r from-blue-400 to-blue-600 group-hover:from-blue-300 group-hover:to-blue-500 shadow-blue-500/50',
                  pink: 'bg-gradient-to-r from-pink-400 to-pink-600 group-hover:from-pink-300 group-hover:to-pink-500 shadow-pink-500/50',
                  orange: 'bg-gradient-to-r from-orange-400 to-orange-600 group-hover:from-orange-300 group-hover:to-orange-500 shadow-orange-500/50'
                };

                return (
                  <motion.div
                    key={key}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 + 0.3 }}
                    whileHover={{ scale: 1.02, x: 10 }}
                    onClick={() => setActivePanel(`banco-${key}`)}
                    className="cursor-pointer group"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className={`font-semibold transition-colors ${textColorClasses[color]}`}>
                        {nombres[key]}
                      </span>
                      <div className="flex items-center gap-3">
                        <span className="text-slate-400">${banco.capitalActual.toLocaleString()}</span>
                        <span className={`text-sm font-bold px-2 py-1 rounded-lg ${badgeClasses[color]}`}>
                          {percentage.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                    <div className="h-3 bg-white/5 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 1.5, delay: index * 0.1 + 0.5, ease: "easeOut" }}
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
                  <p className="text-sm text-slate-300">{productosStockBajo} productos necesitan reorden urgente</p>
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
                  <p className="text-sm text-slate-300">${adeudosClientes.toLocaleString()} pendientes de cobro</p>
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
                  <p className="text-sm text-slate-300">${adeudosDistribuidores.toLocaleString()} por pagar</p>
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
              {[...ventas, ...ordenesCompra].slice(-8).reverse().map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
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
                        {item.tipo === 'venta' || item.totalVenta ? '💰 Nueva Venta' : '📦 Orden de Compra'}
                      </p>
                      <p className="text-xs text-slate-400">{item.fecha || 'Reciente'}</p>
                    </div>
                  </div>
                  <span className={`font-bold text-lg ${
                    item.tipo === 'venta' || item.totalVenta ? 'text-green-400' : 'text-blue-400'
                  }`}>
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
                    green: 'bg-gradient-to-br from-green-500/20 to-green-600/10 border-green-500/30 hover:shadow-green-500/20',
                    blue: 'bg-gradient-to-br from-blue-500/20 to-blue-600/10 border-blue-500/30 hover:shadow-blue-500/20',
                    purple: 'bg-gradient-to-br from-purple-500/20 to-purple-600/10 border-purple-500/30 hover:shadow-purple-500/20',
                    orange: 'bg-gradient-to-br from-orange-500/20 to-orange-600/10 border-orange-500/30 hover:shadow-orange-500/20'
                  };

                  const actionIconClasses = {
                    green: 'text-green-400',
                    blue: 'text-blue-400',
                    purple: 'text-purple-400',
                    orange: 'text-orange-400'
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
                      className={`p-4 border rounded-xl flex flex-col items-center gap-2 hover:shadow-lg transition-all ${actionButtonClasses[action.color]}`}
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
    <motion.div
      whileHover={{ y: -4 }}
      className="glass rounded-2xl p-6 border border-white/10"
    >
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
      profit: 'Profit'
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
            <span className="font-semibold text-green-400">${data.capitalActual.toLocaleString()}</span>
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
        <div className={`p-2 rounded-lg ${item.tipo === 'venta' ? 'bg-green-500/20' : 'bg-blue-500/20'}`}>
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

  // ORDENES DE COMPRA PANEL
  const OrdenesPanel = () => {
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
      distribuidor: '',
      productos: [{ nombre: '', cantidad: 0, precioUnitario: 0 }],
      fecha: new Date().toISOString().split('T')[0]
    });

    const agregarProducto = () => {
      setFormData({
        ...formData,
        productos: [...formData.productos, { nombre: '', cantidad: 0, precioUnitario: 0 }]
      });
    };

    const calcularTotal = () => {
      return formData.productos.reduce((sum, p) => sum + (p.cantidad * p.precioUnitario), 0);
    };

    const crearOrden = () => {
      const total = calcularTotal();
      const nuevaOrden = {
        id: Date.now(),
        ...formData,
        total,
        tipo: 'compra',
        fecha: new Date().toLocaleString()
      };

      setOrdenesCompra([...ordenesCompra, nuevaOrden]);

      // Actualizar o crear distribuidor
      const distExistente = distribuidores.find(d => d.nombre === formData.distribuidor);
      if (distExistente) {
        setDistribuidores(distribuidores.map(d =>
          d.nombre === formData.distribuidor
            ? { ...d, adeudo: d.adeudo + total, ordenes: [...d.ordenes, nuevaOrden] }
            : d
        ));
      } else {
        setDistribuidores([...distribuidores, {
          nombre: formData.distribuidor,
          adeudo: total,
          ordenes: [nuevaOrden],
          pagos: []
        }]);
      }

      // Actualizar almacén
      formData.productos.forEach(producto => {
        const stockItem = almacen.stock.find(s => s.nombre === producto.nombre);
        if (stockItem) {
          setAlmacen({
            ...almacen,
            stock: almacen.stock.map(s =>
              s.nombre === producto.nombre
                ? { ...s, cantidad: s.cantidad + producto.cantidad }
                : s
            ),
            entradas: [...almacen.entradas, { ...producto, fecha: new Date().toLocaleString() }]
          });
        } else {
          setAlmacen({
            ...almacen,
            stock: [...almacen.stock, { nombre: producto.nombre, cantidad: producto.cantidad }],
            entradas: [...almacen.entradas, { ...producto, fecha: new Date().toLocaleString() }]
          });
        }
      });

      showNotification('Orden de compra creada exitosamente', 'success');
      setShowForm(false);
      setFormData({
        distribuidor: '',
        productos: [{ nombre: '', cantidad: 0, precioUnitario: 0 }],
        fecha: new Date().toISOString().split('T')[0]
      });
    };

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Órdenes de Compra</h1>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowForm(!showForm)}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 font-semibold flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Nueva Orden
          </motion.button>
        </div>

        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-2xl p-6 border border-white/10"
          >
            <h2 className="text-xl font-bold mb-4">Crear Orden de Compra</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">Distribuidor</label>
                <input
                  type="text"
                  value={formData.distribuidor}
                  onChange={(e) => setFormData({ ...formData, distribuidor: e.target.value })}
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 text-white"
                  placeholder="Nombre del distribuidor"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">Productos</label>
                {formData.productos.map((producto, idx) => (
                  <div key={idx} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3 p-4 glass rounded-lg">
                    <input
                      type="text"
                      placeholder="Nombre del producto"
                      value={producto.nombre}
                      onChange={(e) => {
                        const newProductos = [...formData.productos];
                        newProductos[idx].nombre = e.target.value;
                        setFormData({ ...formData, productos: newProductos });
                      }}
                      className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 text-white"
                    />
                    <input
                      type="number"
                      placeholder="Cantidad"
                      value={producto.cantidad}
                      onChange={(e) => {
                        const newProductos = [...formData.productos];
                        newProductos[idx].cantidad = parseFloat(e.target.value) || 0;
                        setFormData({ ...formData, productos: newProductos });
                      }}
                      className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 text-white"
                    />
                    <input
                      type="number"
                      placeholder="Precio unitario"
                      value={producto.precioUnitario}
                      onChange={(e) => {
                        const newProductos = [...formData.productos];
                        newProductos[idx].precioUnitario = parseFloat(e.target.value) || 0;
                        setFormData({ ...formData, productos: newProductos });
                      }}
                      className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 text-white"
                    />
                  </div>
                ))}
                <button
                  onClick={agregarProducto}
                  className="text-green-400 hover:text-green-300 font-semibold flex items-center gap-2 mt-2"
                >
                  <Plus className="w-4 h-4" />
                  Agregar producto
                </button>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-white/10">
                <div className="text-xl font-bold">
                  Total: ${calcularTotal().toLocaleString()}
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowForm(false)}
                    className="px-6 py-2 border border-white/10 rounded-xl hover:bg-white/5"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={crearOrden}
                    className="px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl hover:shadow-lg"
                  >
                    Crear Orden
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        <div className="glass rounded-2xl p-6 border border-white/10">
          <h2 className="text-xl font-bold mb-4">Historial de Órdenes</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Fecha</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Distribuidor</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Productos</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold">Total</th>
                </tr>
              </thead>
              <tbody>
                {ordenesCompra.map((orden) => (
                  <tr key={orden.id} className="border-t border-white/5 hover:bg-white/5">
                    <td className="px-4 py-3 text-sm">{orden.fecha}</td>
                    <td className="px-4 py-3 text-sm font-semibold">{orden.distribuidor}</td>
                    <td className="px-4 py-3 text-sm">{orden.productos.length} productos</td>
                    <td className="px-4 py-3 text-sm text-right font-bold">${orden.total.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {ordenesCompra.length === 0 && (
              <div className="text-center text-slate-400 py-8">
                <Package className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No hay órdenes registradas</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // DISTRIBUIDORES PANEL
  const DistribuidoresPanel = () => {
    const [selectedDistribuidor, setSelectedDistribuidor] = useState(null);
    const [montoPago, setMontoPago] = useState(0);
    const [bancoOrigen, setBancoOrigen] = useState('bovedaMonte');

    const realizarPago = (distribuidor, monto) => {
      if (monto <= 0 || monto > distribuidor.adeudo) {
        showNotification('Monto inválido', 'error');
        return;
      }

      setDistribuidores(distribuidores.map(d =>
        d.nombre === distribuidor.nombre
          ? {
              ...d,
              adeudo: d.adeudo - monto,
              pagos: [...d.pagos, { monto, fecha: new Date().toLocaleString(), banco: bancoOrigen }]
            }
          : d
      ));

      // Registrar gasto en banco
      setBancos({
        ...bancos,
        [bancoOrigen]: {
          ...bancos[bancoOrigen],
          capitalActual: bancos[bancoOrigen].capitalActual - monto,
          gastos: [...bancos[bancoOrigen].gastos, {
            concepto: `Pago a distribuidor ${distribuidor.nombre}`,
            monto,
            fecha: new Date().toLocaleString()
          }]
        }
      });

      showNotification('Pago realizado exitosamente', 'success');
      setMontoPago(0);
      setSelectedDistribuidor(null);
    };

    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Distribuidores</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {distribuidores.map((distribuidor, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="glass rounded-2xl p-6 border border-white/10"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold">{distribuidor.nombre}</h3>
                  <p className="text-sm text-slate-400">{distribuidor.ordenes.length} órdenes</p>
                </div>
                <div className={`px-4 py-2 rounded-full font-semibold ${
                  distribuidor.adeudo > 0 ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'
                }`}>
                  ${distribuidor.adeudo.toLocaleString()}
                </div>
              </div>

              <div className="space-y-3">
                <div className="glass rounded-lg p-3">
                  <p className="text-sm text-slate-400 mb-2">Órdenes registradas:</p>
                  <div className="max-h-40 overflow-y-auto space-y-1">
                    {distribuidor.ordenes.map((orden, oidx) => (
                      <div key={oidx} className="text-sm flex justify-between">
                        <span className="text-slate-300">{orden.fecha}</span>
                        <span className="font-semibold text-green-400">${orden.total.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {distribuidor.adeudo > 0 && (
                  <div className="space-y-3 pt-3 border-t border-white/10">
                    <div>
                      <label className="block text-sm font-semibold text-slate-300 mb-2">Banco de origen</label>
                      <select
                        value={bancoOrigen}
                        onChange={(e) => setBancoOrigen(e.target.value)}
                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 text-white"
                      >
                        <option value="bovedaMonte">Bóveda Monte</option>
                        <option value="utilidades">Utilidades</option>
                        <option value="fletes">Fletes</option>
                        <option value="azteca">Azteca</option>
                        <option value="leftie">Leftie</option>
                        <option value="profit">Profit</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-300 mb-2">Monto a pagar</label>
                      <input
                        type="number"
                        value={montoPago}
                        onChange={(e) => setMontoPago(parseFloat(e.target.value) || 0)}
                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 text-white"
                        placeholder="Ingrese monto"
                      />
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => realizarPago(distribuidor, montoPago)}
                        className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 py-2 rounded-lg hover:shadow-lg font-semibold"
                      >
                        Abonar
                      </button>
                      <button
                        onClick={() => realizarPago(distribuidor, distribuidor.adeudo)}
                        className="flex-1 bg-gradient-to-r from-green-500 to-green-600 py-2 rounded-lg hover:shadow-lg font-semibold"
                      >
                        Saldar
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {distribuidores.length === 0 && (
          <div className="text-center text-slate-400 py-20">
            <Users className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p>No hay distribuidores registrados</p>
            <p className="text-sm mt-2">Los distribuidores se crean automáticamente al registrar órdenes de compra</p>
          </div>
        )}
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

    // Advanced search integration
    const advancedSearch = useAdvancedSearch(almacen.stock, {
      searchableFields: ['nombre', 'id', 'categoria', 'descripcion'],
      filterOptions: { categoria: selectedCategory !== 'todas' ? selectedCategory : null }
    });

    // Cálculos dinámicos optimizados con useMemo
    const totalInventario = React.useMemo(() =>
      almacen.stock.reduce((sum, item) => sum + item.valorInventario, 0),
      [almacen.stock]
    );

    const totalProductos = almacen.stock.length;

    const productosStockBajo = React.useMemo(() =>
      almacen.stock.filter(item => item.cantidad <= item.cantidadMinima).length,
      [almacen.stock]
    );

    const valorPromedioProducto = React.useMemo(() =>
      totalInventario / totalProductos || 0,
      [totalInventario, totalProductos]
    );

    const categorias = React.useMemo(() =>
      [...new Set(almacen.stock.map(item => item.categoria))],
      [almacen.stock]
    );

    // Use advanced search results
    React.useEffect(() => {
      advancedSearch.search(searchTerm);
    }, [searchTerm, selectedCategory, advancedSearch]);

    const productosFiltrados = (advancedSearch.results.length > 0 ? advancedSearch.results : almacen.stock)
      .sort((a, b) => {
        switch(sortBy) {
          case 'nombre': return a.nombre.localeCompare(b.nombre);
          case 'cantidad': return b.cantidad - a.cantidad;
          case 'valor': return b.valorInventario - a.valorInventario;
          case 'margen': return b.margenGanancia - a.margenGanancia;
          default: return 0;
        }
      });

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
              whileHover={{ scale: 1.05, boxShadow: "0 10px 30px rgba(139, 92, 246, 0.3)" }}
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
              title: 'Valor Total Inventario',
              value: `$${totalInventario.toLocaleString()}`,
              icon: DollarSign,
              color: 'green',
              gradient: 'from-green-400 to-emerald-500',
              bgGradient: 'from-green-500/10 to-emerald-500/5',
              change: '+12.5%',
              description: 'vs mes anterior'
            },
            {
              title: 'Total Productos',
              value: totalProductos,
              icon: Package,
              color: 'blue',
              gradient: 'from-blue-400 to-cyan-500',
              bgGradient: 'from-blue-500/10 to-cyan-500/5',
              change: '+3',
              description: 'nuevos este mes'
            },
            {
              title: 'Stock Bajo',
              value: productosStockBajo,
              icon: AlertCircle,
              color: 'red',
              gradient: 'from-red-400 to-pink-500',
              bgGradient: 'from-red-500/10 to-pink-500/5',
              change: '-2',
              description: 'menos que ayer'
            },
            {
              title: 'Valor Promedio',
              value: `$${valorPromedioProducto.toLocaleString()}`,
              icon: TrendingUp,
              color: 'purple',
              gradient: 'from-purple-400 to-pink-500',
              bgGradient: 'from-purple-500/10 to-pink-500/5',
              change: '+8.3%',
              description: 'mejora continua'
            }
          ].map((kpi, index) => {
            const kpiBorderClasses = {
              green: 'border-green-500/20',
              blue: 'border-blue-500/20',
              red: 'border-red-500/20',
              purple: 'border-purple-500/20'
            };

            const kpiTextClasses = {
              green: 'text-green-400',
              blue: 'text-blue-400',
              red: 'text-red-400',
              purple: 'text-purple-400'
            };

            const kpiBadgeClasses = {
              green: 'text-green-400 bg-green-400/20',
              blue: 'text-blue-400 bg-blue-400/20',
              red: 'text-red-400 bg-red-400/20',
              purple: 'text-purple-400 bg-purple-400/20'
            };

            return (
              <motion.div
                key={kpi.title}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
                  transition: { duration: 0.2 }
                }}
                className={`glass rounded-2xl p-6 border ${kpiBorderClasses[kpi.color]} bg-gradient-to-br ${kpi.bgGradient} cursor-pointer group`}
              >
                <div className="flex items-center justify-between mb-4">
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                    className={`p-3 rounded-xl bg-gradient-to-r ${kpi.gradient} group-hover:shadow-lg transition-all duration-300`}
                  >
                    <kpi.icon className="w-6 h-6 text-white" />
                  </motion.div>
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${kpiBadgeClasses[kpi.color]}`}>
                    {kpi.change}
                  </span>
                </div>
                <h3 className="text-sm font-semibold text-slate-400 mb-2">{kpi.title}</h3>
                <p className={`text-3xl font-bold mb-1 ${kpiTextClasses[kpi.color]}`}>{kpi.value}</p>
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
              { key: 'analytics', label: 'Analytics', icon: BarChart3 }
            ].map(tab => (
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
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
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
                      <option value="todas" className="bg-slate-800">Todas las categorías</option>
                      {categorias.map(cat => (
                        <option key={cat} value={cat} className="bg-slate-800">{cat}</option>
                      ))}
                    </motion.select>
                    <motion.select
                      whileFocus={{ scale: 1.02 }}
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-purple-500 min-w-[150px]"
                    >
                      <option value="nombre" className="bg-slate-800">Ordenar por Nombre</option>
                      <option value="cantidad" className="bg-slate-800">Ordenar por Cantidad</option>
                      <option value="valor" className="bg-slate-800">Ordenar por Valor</option>
                      <option value="margen" className="bg-slate-800">Ordenar por Margen</option>
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
                            {dragModeEnabled && (
                              <th className="px-2 py-4 w-8"></th>
                            )}
                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Producto</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Cantidad</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Costo Unit.</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Precio Venta</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Valor Total</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Margen %</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Estado</th>
                            <th className="px-6 py-4 text-center text-xs font-semibold text-slate-400 uppercase tracking-wider">Acciones</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          {productosFiltrados.map((producto, index) => {
                            const TableRow = dragModeEnabled ? DraggableItem : motion.tr;
                            const dragProps = dragModeEnabled ? {
                              item: producto,
                              index,
                              onDragStart: dragDropProductos.handleDragStart,
                              onDragEnd: dragDropProductos.handleDragEnd,
                              onDragEnter: dragDropProductos.handleDragEnter,
                              onDragLeave: dragDropProductos.handleDragLeave,
                              onDragOver: dragDropProductos.handleDragOver,
                              onDrop: dragDropProductos.handleDrop,
                              isDraggedOver: dragDropProductos.dragOverItem?.index === index,
                              isDragging: dragDropProductos.isDragging
                            } : {};
                            
                            return (
                              <TableRow
                                key={producto.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                whileHover={{ 
                                  backgroundColor: 'rgba(255, 255, 255, 0.02)',
                                  transition: { duration: 0.2 }
                                }}
                                className="hover:bg-white/5 transition-all duration-200 group"
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
                                        <span dangerouslySetInnerHTML={{ __html: highlightMatch(producto.nombre, searchTerm) }} />
                                      ) : (
                                        producto.nombre
                                      )}
                                    </p>
                                    <p className="text-xs text-slate-400">
                                      ID: {searchTerm ? (
                                        <span dangerouslySetInnerHTML={{ __html: highlightMatch(producto.id, searchTerm) }} />
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
                                  <span className={`text-lg font-bold ${
                                    producto.cantidad <= producto.cantidadMinima ? 'text-red-400' :
                                    producto.cantidad >= producto.cantidadMaxima * 0.8 ? 'text-green-400' :
                                    'text-blue-400'
                                  }`}>
                                    {producto.cantidad}
                                  </span>
                                  <div className="flex flex-col text-xs text-slate-500">
                                    <span>Min: {producto.cantidadMinima}</span>
                                    <span>Max: {producto.cantidadMaxima}</span>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <span className="text-sm font-semibold text-slate-300">
                                  ${producto.costoUnitario.toLocaleString()}
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                <span className="text-sm font-semibold text-green-400">
                                  ${producto.precioVenta.toLocaleString()}
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                <span className="text-sm font-bold text-purple-400">
                                  ${producto.valorInventario.toLocaleString()}
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                <motion.span 
                                  whileHover={{ scale: 1.1 }}
                                  className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                                    producto.margenGanancia >= 60 ? 'bg-green-100 text-green-800' :
                                    producto.margenGanancia >= 40 ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-red-100 text-red-800'
                                  }`}
                                >
                                  {producto.margenGanancia}%
                                </motion.span>
                              </td>
                              <td className="px-6 py-4">
                                <motion.span 
                                  whileHover={{ scale: 1.05 }}
                                  className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                                    producto.estado === 'Activo' ? 'bg-green-100 text-green-800' :
                                    producto.estado === 'Stock Bajo' ? 'bg-red-100 text-red-800' :
                                    'bg-yellow-100 text-yellow-800'
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
                    {almacen.entradas.map((entrada, index) => (
                      <motion.div
                        key={entrada.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: 1.02 }}
                        className="glass rounded-xl p-6 border border-green-500/20 bg-gradient-to-r from-green-500/10 to-emerald-500/5"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                          <div>
                            <p className="text-sm text-slate-400">Producto</p>
                            <p className="font-semibold text-white">{entrada.nombre}</p>
                            <p className="text-xs text-slate-500">ID: {entrada.id}</p>
                          </div>
                          <div>
                            <p className="text-sm text-slate-400">Cantidad</p>
                            <p className="font-bold text-green-400 text-xl">+{entrada.cantidad}</p>
                            <p className="text-xs text-slate-500">Costo Unit: ${entrada.costoUnitario.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-sm text-slate-400">Costo Total</p>
                            <p className="font-bold text-blue-400 text-xl">${entrada.costoTotal.toLocaleString()}</p>
                            <p className="text-xs text-slate-500">Factura: {entrada.numeroFactura}</p>
                          </div>
                          <div>
                            <p className="text-sm text-slate-400">Proveedor</p>
                            <p className="font-semibold text-white">{entrada.proveedor}</p>
                            <p className="text-xs text-slate-500">{entrada.fecha}</p>
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
                    {almacen.salidas.map((salida, index) => (
                      <motion.div
                        key={salida.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: 1.02 }}
                        className="glass rounded-xl p-6 border border-red-500/20 bg-gradient-to-r from-red-500/10 to-pink-500/5"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                          <div>
                            <p className="text-sm text-slate-400">Producto</p>
                            <p className="font-semibold text-white">{salida.nombre}</p>
                            <p className="text-xs text-slate-500">ID: {salida.id}</p>
                          </div>
                          <div>
                            <p className="text-sm text-slate-400">Cantidad</p>
                            <p className="font-bold text-red-400 text-xl">-{salida.cantidad}</p>
                            <p className="text-xs text-slate-500">Motivo: {salida.motivoSalida}</p>
                          </div>
                          <div>
                            <p className="text-sm text-slate-400">Valor Total</p>
                            <p className="font-bold text-green-400 text-xl">${salida.valorTotal.toLocaleString()}</p>
                            <p className="text-xs text-slate-500">Precio Unit: ${salida.precioVenta.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-sm text-slate-400">Cliente</p>
                            <p className="font-semibold text-white">{salida.cliente}</p>
                            <p className="text-xs text-slate-500">{salida.fecha}</p>
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
                              data={categorias.map(cat => ({
                                name: cat,
                                value: almacen.stock.filter(item => item.categoria === cat).length,
                                fill: cat === 'Electrónicos' ? '#8B5CF6' : 
                                      cat === 'Mobiliario' ? '#EC4899' : 
                                      cat === 'Accesorios' ? '#F59E0B' : '#10B981'
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
                          <BarChart data={almacen.stock.slice(0, 5)}>
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
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
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
                    onFocus={(e) => e.target.placeholder = ''}
                    onBlur={(e) => e.target.placeholder = 'Ej: MacBook Pro 16'}
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
                    <option value="" className="bg-slate-800">Seleccionar categoría</option>
                    <option value="Electrónicos" className="bg-slate-800">📱 Electrónicos</option>
                    <option value="Mobiliario" className="bg-slate-800">🪑 Mobiliario</option>
                    <option value="Accesorios" className="bg-slate-800">🔧 Accesorios</option>
                    <option value="Herramientas" className="bg-slate-800">🛠️ Herramientas</option>
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
                    onFocus={(e) => { if(e.target.value === '0') e.target.value = '' }}
                    onBlur={(e) => { if(e.target.value === '') e.target.value = '0' }}
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
                    onFocus={(e) => { if(e.target.value === '0' || e.target.value === '0.00') e.target.value = '' }}
                    onBlur={(e) => { if(e.target.value === '') e.target.value = '0.00' }}
                    defaultValue="0.00"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all text-white"
                    placeholder="Ingresa precio de compra"
                    min="0"
                    step="0.01"
                  />
                  <p className="text-xs text-red-300">💸 LO QUE TE COSTÓ COMPRARLO (precio de adquisición)</p>
                </div>

                {/* Precio de Venta */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-emerald-400 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    Precio de Venta * (USD)
                  </label>
                  <input 
                    type="number" 
                    onFocus={(e) => { if(e.target.value === '0' || e.target.value === '0.00') e.target.value = '' }}
                    onBlur={(e) => { if(e.target.value === '') e.target.value = '0.00' }}
                    defaultValue="0.00"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all text-white"
                    placeholder="Ingresa precio de venta"
                    min="0"
                    step="0.01"
                  />
                  <p className="text-xs text-emerald-300">💰 LO QUE COBRAS AL CLIENTE (precio de venta final)</p>
                </div>

                {/* Proveedor */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-orange-400 flex items-center gap-2">
                    <Building2 className="w-4 h-4" />
                    Proveedor
                  </label>
                  <input 
                    type="text" 
                    onFocus={(e) => e.target.placeholder = ''}
                    onBlur={(e) => e.target.placeholder = 'Nombre del proveedor'}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all text-white"
                    placeholder="Nombre del proveedor"
                  />
                  <p className="text-xs text-slate-400">🏢 Empresa o persona que te vende este producto</p>
                </div>

                {/* Stock Mínimo */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-yellow-400 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    Stock Mínimo
                  </label>
                  <input 
                    type="number" 
                    onFocus={(e) => { if(e.target.value === '0') e.target.value = '' }}
                    onBlur={(e) => { if(e.target.value === '') e.target.value = '0' }}
                    defaultValue="0"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 transition-all text-white"
                    placeholder="Cantidad mínima"
                    min="0"
                  />
                  <p className="text-xs text-yellow-300">⚠️ Cantidad mínima para activar ALERTA de reorden</p>
                </div>

                {/* Stock Máximo */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-cyan-400 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    Stock Máximo
                  </label>
                  <input 
                    type="number" 
                    onFocus={(e) => { if(e.target.value === '0') e.target.value = '' }}
                    onBlur={(e) => { if(e.target.value === '') e.target.value = '0' }}
                    defaultValue="0"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all text-white"
                    placeholder="Capacidad máxima"
                    min="0"
                  />
                  <p className="text-xs text-slate-400">📊 Capacidad máxima de almacenamiento recomendada</p>
                </div>

                {/* Ubicación */}
                <div className="md:col-span-2 space-y-2">
                  <label className="text-sm font-semibold text-pink-400 flex items-center gap-2">
                    <Warehouse className="w-4 h-4" />
                    Ubicación en Almacén
                  </label>
                  <input 
                    type="text" 
                    onFocus={(e) => e.target.placeholder = ''}
                    onBlur={(e) => e.target.placeholder = 'Ej: Pasillo A, Estante 3, Nivel 2'}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 transition-all text-white"
                    placeholder="Ej: Pasillo A, Estante 3, Nivel 2"
                  />
                  <p className="text-xs text-slate-400">📍 Ubicación física para localizar el producto rápidamente</p>
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
                    whileHover={{ scale: 1.02, boxShadow: "0 10px 30px rgba(139, 92, 246, 0.3)" }}
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
          totalCount={almacen.stock.length}
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
    const [formData, setFormData] = useState({
      cliente: '',
      productos: [{ nombre: '', cantidad: 0, precioUnitario: 0, precioCompra: 0 }],
      estadoPago: 'completo',
      montoAbonado: 0,
      precioFlete: 500,
    });

    // Advanced search integration for ventas
    const advancedSearch = useAdvancedSearch(ventas, {
      searchableFields: ['cliente', 'id', 'tipo', 'fecha'],
      filterOptions: {}
    });

    React.useEffect(() => {
      advancedSearch.search(searchTerm);
    }, [searchTerm, advancedSearch]);

    const ventasFiltradas = advancedSearch.results.length > 0 && searchTerm ? advancedSearch.results : ventas;

    const calcularTotalVenta = () => {
      return formData.productos.reduce((sum, p) => sum + ((p.precioUnitario + formData.precioFlete) * p.cantidad), 0);
    };

    const calcularFletes = () => {
      return formData.productos.reduce((sum, p) => sum + (formData.precioFlete * p.cantidad), 0);
    };

    const calcularUtilidades = () => {
      return formData.productos.reduce((sum, p) => sum + ((p.precioUnitario - p.precioCompra) * p.cantidad), 0);
    };

    const registrarVenta = () => {
      const totalVenta = calcularTotalVenta();
      const totalFletes = calcularFletes();
      const totalUtilidades = calcularUtilidades();

      const montoPagado = formData.estadoPago === 'completo' ? totalVenta :
                         formData.estadoPago === 'parcial' ? formData.montoAbonado : 0;

      const nuevaVenta = {
        id: Date.now(),
        ...formData,
        totalVenta,
        totalFletes,
        totalUtilidades,
        montoPagado,
        adeudo: totalVenta - montoPagado,
        tipo: 'venta',
        fecha: new Date().toLocaleString()
      };

      setVentas([...ventas, nuevaVenta]);

      // Actualizar cliente
      const clienteExistente = clientes.find(c => c.nombre === formData.cliente);
      if (clienteExistente) {
        setClientes(clientes.map(c =>
          c.nombre === formData.cliente
            ? {
                ...c,
                adeudo: c.adeudo + (totalVenta - montoPagado),
                ventas: [...c.ventas, nuevaVenta]
              }
            : c
        ));
      } else {
        setClientes([...clientes, {
          nombre: formData.cliente,
          adeudo: totalVenta - montoPagado,
          ventas: [nuevaVenta],
          abonos: []
        }]);
      }

      // Actualizar bancos
      setBancos({
        ...bancos,
        bovedaMonte: {
          ...bancos.bovedaMonte,
          historico: bancos.bovedaMonte.historico + totalVenta,
          capitalActual: bancos.bovedaMonte.capitalActual + montoPagado,
          registros: [...bancos.bovedaMonte.registros, {
            concepto: `Venta a ${formData.cliente}`,
            monto: totalVenta,
            montoPagado,
            estado: formData.estadoPago,
            fecha: new Date().toLocaleString()
          }]
        },
        fletes: {
          ...bancos.fletes,
          historico: bancos.fletes.historico + totalFletes,
          capitalActual: bancos.fletes.capitalActual + (formData.estadoPago === 'completo' ? totalFletes : 0),
        },
        utilidades: {
          ...bancos.utilidades,
          historico: bancos.utilidades.historico + totalUtilidades,
          capitalActual: bancos.utilidades.capitalActual + (formData.estadoPago === 'completo' ? totalUtilidades : 0),
        }
      });

      // Actualizar almacén (salidas)
      formData.productos.forEach(producto => {
        setAlmacen({
          ...almacen,
          stock: almacen.stock.map(s =>
            s.nombre === producto.nombre
              ? { ...s, cantidad: s.cantidad - producto.cantidad }
              : s
          ),
          salidas: [...almacen.salidas, { ...producto, fecha: new Date().toLocaleString() }]
        });
      });

      showNotification('Venta registrada exitosamente', 'success');
      setShowForm(false);
      setFormData({
        cliente: '',
        productos: [{ nombre: '', cantidad: 0, precioUnitario: 0, precioCompra: 0 }],
        estadoPago: 'completo',
        montoAbonado: 0,
        precioFlete: 500,
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
            <h2 className="text-xl font-bold mb-4">Registrar Venta</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">Cliente</label>
                  <input
                    type="text"
                    value={formData.cliente}
                    onChange={(e) => setFormData({ ...formData, cliente: e.target.value })}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600 text-white"
                    placeholder="Nombre del cliente"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">Precio Flete (por unidad)</label>
                  <input
                    type="number"
                    value={formData.precioFlete}
                    onChange={(e) => setFormData({ ...formData, precioFlete: parseFloat(e.target.value) || 0 })}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">Estado de Pago</label>
                <select
                  value={formData.estadoPago}
                  onChange={(e) => setFormData({ ...formData, estadoPago: e.target.value })}
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600 text-white"
                >
                  <option value="completo">Completo</option>
                  <option value="parcial">Parcial</option>
                  <option value="pendiente">Pendiente</option>
                </select>
              </div>

              {formData.estadoPago === 'parcial' && (
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">Monto Abonado</label>
                  <input
                    type="number"
                    value={formData.montoAbonado}
                    onChange={(e) => setFormData({ ...formData, montoAbonado: parseFloat(e.target.value) || 0 })}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600 text-white"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">Productos</label>
                {formData.productos.map((producto, idx) => (
                  <div key={idx} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-3 p-4 glass rounded-lg">
                    <input
                      type="text"
                      placeholder="Producto"
                      value={producto.nombre}
                      onChange={(e) => {
                        const newProductos = [...formData.productos];
                        newProductos[idx].nombre = e.target.value;
                        setFormData({ ...formData, productos: newProductos });
                      }}
                      className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600 text-white"
                    />
                    <input
                      type="number"
                      placeholder="Cantidad"
                      value={producto.cantidad}
                      onChange={(e) => {
                        const newProductos = [...formData.productos];
                        newProductos[idx].cantidad = parseFloat(e.target.value) || 0;
                        setFormData({ ...formData, productos: newProductos });
                      }}
                      className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600 text-white"
                    />
                    <input
                      type="number"
                      placeholder="Precio Venta"
                      value={producto.precioUnitario}
                      onChange={(e) => {
                        const newProductos = [...formData.productos];
                        newProductos[idx].precioUnitario = parseFloat(e.target.value) || 0;
                        setFormData({ ...formData, productos: newProductos });
                      }}
                      className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600 text-white"
                    />
                    <input
                      type="number"
                      placeholder="Precio Compra"
                      value={producto.precioCompra}
                      onChange={(e) => {
                        const newProductos = [...formData.productos];
                        newProductos[idx].precioCompra = parseFloat(e.target.value) || 0;
                        setFormData({ ...formData, productos: newProductos });
                      }}
                      className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600 text-white"
                    />
                  </div>
                ))}
                <button
                  onClick={() => setFormData({
                    ...formData,
                    productos: [...formData.productos, { nombre: '', cantidad: 0, precioUnitario: 0, precioCompra: 0 }]
                  })}
                  className="text-orange-400 hover:text-orange-300 font-semibold flex items-center gap-2 mt-2"
                >
                  <Plus className="w-4 h-4" />
                  Agregar producto
                </button>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/10">
                <div className="text-center">
                  <p className="text-sm text-slate-400">Total Venta</p>
                  <p className="text-2xl font-bold text-green-400">${calcularTotalVenta().toLocaleString()}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-slate-400">Fletes</p>
                  <p className="text-2xl font-bold text-purple-400">${calcularFletes().toLocaleString()}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-slate-400">Utilidades</p>
                  <p className="text-2xl font-bold text-blue-400">${calcularUtilidades().toLocaleString()}</p>
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
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Fecha</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Cliente</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Estado</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold">Total</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold">Utilidades</th>
                </tr>
              </thead>
              <tbody>
                {ventasFiltradas.map((venta) => (
                  <tr key={venta.id} className="border-t border-white/5 hover:bg-white/5">
                    <td className="px-4 py-3 text-sm">{venta.fecha}</td>
                    <td className="px-4 py-3 text-sm font-semibold">
                      {searchTerm ? (
                        <span dangerouslySetInnerHTML={{ __html: highlightMatch(venta.cliente, searchTerm) }} />
                      ) : (
                        venta.cliente
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        venta.estadoPago === 'completo' ? 'bg-green-500/20 text-green-400' :
                        venta.estadoPago === 'parcial' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-red-500/20 text-red-400'
                      }`}>
                        {venta.estadoPago}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-right font-bold">${venta.totalVenta?.toLocaleString()}</td>
                    <td className="px-4 py-3 text-sm text-right font-bold text-blue-400">${venta.totalUtilidades?.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {ventasFiltradas.length === 0 && (
              <div className="text-center text-slate-400 py-8">
                <TrendingUp className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>{searchTerm ? 'No se encontraron ventas' : 'No hay ventas registradas'}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // CLIENTES PANEL
  const ClientesPanel = () => {
    const [montoAbono, setMontoAbono] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');

    // Advanced search integration for clientes
    const advancedSearch = useAdvancedSearch(clientes, {
      searchableFields: ['nombre'],
      filterOptions: {}
    });

    React.useEffect(() => {
      advancedSearch.search(searchTerm);
    }, [searchTerm, advancedSearch]);

    const clientesFiltrados = advancedSearch.results.length > 0 && searchTerm ? advancedSearch.results : clientes;

    const realizarAbono = (cliente, monto) => {
      if (monto <= 0 || monto > cliente.adeudo) {
        showNotification('Monto inválido', 'error');
        return;
      }

      setClientes(clientes.map(c =>
        c.nombre === cliente.nombre
          ? {
              ...c,
              adeudo: c.adeudo - monto,
              abonos: [...c.abonos, { monto, fecha: new Date().toLocaleString() }]
            }
          : c
      ));

      // Agregar al banco Bóveda Monte
      setBancos({
        ...bancos,
        bovedaMonte: {
          ...bancos.bovedaMonte,
          capitalActual: bancos.bovedaMonte.capitalActual + monto,
        }
      });

      showNotification('Abono registrado exitosamente', 'success');
      setMontoAbono(0);
    };

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Clientes</h1>
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {clientesFiltrados.map((cliente, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="glass rounded-2xl p-6 border border-white/10"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold">
                    {searchTerm ? (
                      <span dangerouslySetInnerHTML={{ __html: highlightMatch(cliente.nombre, searchTerm) }} />
                    ) : (
                      cliente.nombre
                    )}
                  </h3>
                  <p className="text-sm text-slate-400">{cliente.ventas.length} ventas</p>
                </div>
                <div className={`px-4 py-2 rounded-full font-semibold ${
                  cliente.adeudo > 0 ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'
                }`}>
                  ${cliente.adeudo.toLocaleString()}
                </div>
              </div>

              <div className="space-y-3">
                <div className="glass rounded-lg p-3">
                  <p className="text-sm text-slate-400 mb-2">Ventas:</p>
                  <div className="max-h-40 overflow-y-auto space-y-1">
                    {cliente.ventas.map((venta, vidx) => (
                      <div key={vidx} className="text-sm flex justify-between">
                        <span className="text-slate-300">{venta.fecha}</span>
                        <span className="font-semibold text-green-400">${venta.totalVenta?.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {cliente.adeudo > 0 && (
                  <div className="space-y-3 pt-3 border-t border-white/10">
                    <div>
                      <label className="block text-sm font-semibold text-slate-300 mb-2">Monto a abonar</label>
                      <input
                        type="number"
                        value={montoAbono}
                        onChange={(e) => setMontoAbono(parseFloat(e.target.value) || 0)}
                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-white"
                        placeholder="Ingrese monto"
                      />
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => realizarAbono(cliente, montoAbono)}
                        className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 py-2 rounded-lg hover:shadow-lg font-semibold"
                      >
                        Abonar
                      </button>
                      <button
                        onClick={() => realizarAbono(cliente, cliente.adeudo)}
                        className="flex-1 bg-gradient-to-r from-green-500 to-green-600 py-2 rounded-lg hover:shadow-lg font-semibold"
                      >
                        Saldar
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {clientesFiltrados.length === 0 && (
          <div className="text-center text-slate-400 py-20">
            <UserCheck className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p>{searchTerm ? 'No se encontraron clientes' : 'No hay clientes registrados'}</p>
            <p className="text-sm mt-2">Los clientes se crean automáticamente al registrar ventas</p>
          </div>
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
    const [transferData, setTransferData] = useState({ hacia: 'utilidades', monto: 0, concepto: '', categoria: 'operativo' });
    const [gastoData, setGastoData] = useState({ monto: 0, concepto: '', categoria: 'operativo', proveedor: '' });
    const [ingresoData, setIngresoData] = useState({ monto: 0, concepto: '', categoria: 'venta', cliente: '' });

    const banco = bancos[nombreBanco];
    const nombres = {
      bovedaMonte: 'Bóveda Monte',
      utilidades: 'Utilidades',
      fletes: 'Fletes',
      azteca: 'Azteca',
      leftie: 'Leftie',
      profit: 'Profit'
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
        transferencias: Math.floor(Math.random() * 8000)
      }));
    };

    const chartData = generateChartData();
    
    // Categorías para mejor organización
    const categorias = {
      ingreso: ['venta', 'servicio', 'inversion', 'otro'],
      gasto: ['operativo', 'marketing', 'personal', 'inventario', 'otro'],
      transferencia: ['operativo', 'inversion', 'reserva', 'otro']
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
          transferencias: [...banco.transferencias, {
            tipo: 'salida',
            hacia: transferData.hacia,
            monto: transferData.monto,
            concepto: transferData.concepto,
            fecha: new Date().toLocaleString()
          }]
        },
        [transferData.hacia]: {
          ...bancos[transferData.hacia],
          capitalActual: bancos[transferData.hacia].capitalActual + transferData.monto,
          transferencias: [...bancos[transferData.hacia].transferencias, {
            tipo: 'entrada',
            desde: nombreBanco,
            monto: transferData.monto,
            concepto: transferData.concepto,
            fecha: new Date().toLocaleString()
          }]
        }
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
          gastos: [...banco.gastos, {
            monto: gastoData.monto,
            concepto: gastoData.concepto,
            fecha: new Date().toLocaleString()
          }]
        }
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
          registros: [...banco.registros, {
            concepto: `Ingreso: ${ingresoData.concepto}`,
            monto: ingresoData.monto,
            fecha: new Date().toLocaleString()
          }]
        }
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

        {/* Métricas avanzadas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="glass rounded-2xl p-6 border border-green-500/20 bg-gradient-to-br from-green-500/10 to-emerald-500/5"
          >
            <div className="flex items-center justify-between mb-3">
              <Wallet className="w-8 h-8 text-green-400" />
              <span className="text-xs text-green-400 font-semibold">ACTUAL</span>
            </div>
            <p className="text-2xl font-bold text-green-400 mb-1">${banco.capitalActual.toLocaleString()}</p>
            <p className="text-xs text-slate-400">Capital disponible</p>
          </motion.div>

          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="glass rounded-2xl p-6 border border-blue-500/20 bg-gradient-to-br from-blue-500/10 to-cyan-500/5"
          >
            <div className="flex items-center justify-between mb-3">
              <TrendingUp className="w-8 h-8 text-blue-400" />
              <span className="text-xs text-blue-400 font-semibold">HISTÓRICO</span>
            </div>
            <p className="text-2xl font-bold text-blue-400 mb-1">${banco.historico.toLocaleString()}</p>
            <p className="text-xs text-slate-400">Total acumulado</p>
          </motion.div>

          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="glass rounded-2xl p-6 border border-red-500/20 bg-gradient-to-br from-red-500/10 to-red-600/5"
          >
            <div className="flex items-center justify-between mb-3">
              <TrendingDown className="w-8 h-8 text-red-400" />
              <span className="text-xs text-red-400 font-semibold">GASTOS</span>
            </div>
            <p className="text-2xl font-bold text-red-400 mb-1">
              ${banco.gastos.reduce((sum, g) => sum + g.monto, 0).toLocaleString()}
            </p>
            <p className="text-xs text-slate-400">Total egresos</p>
          </motion.div>

          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="glass rounded-2xl p-6 border border-purple-500/20 bg-gradient-to-br from-purple-500/10 to-pink-500/5"
          >
            <div className="flex items-center justify-between mb-3">
              <ArrowUpDown className="w-8 h-8 text-purple-400" />
              <span className="text-xs text-purple-400 font-semibold">FLUJO</span>
            </div>
            <p className="text-2xl font-bold text-purple-400 mb-1">
              ${banco.transferencias.reduce((sum, t) => sum + t.monto, 0).toLocaleString()}
            </p>
            <p className="text-xs text-slate-400">Transferencias</p>
          </motion.div>
        </div>

        {/* Navegación por pestañas */}
        <div className="glass rounded-2xl border border-white/10">
          <div className="flex border-b border-white/10">
            {[
              { key: 'overview', label: 'Resumen', icon: Eye },
              { key: 'transactions', label: 'Transacciones', icon: List },
              { key: 'analytics', label: 'Análisis', icon: BarChart3 },
              { key: 'reports', label: 'Reportes', icon: FileText }
            ].map(tab => (
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
                              borderRadius: '12px'
                            }}
                          />
                          <Line type="monotone" dataKey="balance" stroke="#3B82F6" strokeWidth={3} />
                          <Line type="monotone" dataKey="ingresos" stroke="#10B981" strokeWidth={2} />
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
                                { name: 'Otros', value: 10, fill: '#F59E0B' }
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
                                { name: 'Inventario', value: 15, fill: '#6366F1' }
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
                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Fecha</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Tipo</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Concepto</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Categoría</th>
                            <th className="px-6 py-4 text-right text-xs font-semibold text-slate-400 uppercase tracking-wider">Monto</th>
                            <th className="px-6 py-4 text-center text-xs font-semibold text-slate-400 uppercase tracking-wider">Estado</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/10">
                          {/* Simulación de transacciones */}
                          {Array.from({ length: 10 }, (_, i) => (
                            <motion.tr
                              key={i}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: i * 0.1 }}
                              className="hover:bg-white/5 transition-colors"
                            >
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                                {new Date(Date.now() - i * 24 * 60 * 60 * 1000).toLocaleDateString()}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  i % 3 === 0 ? 'bg-green-100 text-green-800' :
                                  i % 3 === 1 ? 'bg-red-100 text-red-800' :
                                  'bg-blue-100 text-blue-800'
                                }`}>
                                  {i % 3 === 0 ? 'Ingreso' : i % 3 === 1 ? 'Gasto' : 'Transferencia'}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-sm text-slate-300">
                                {i % 3 === 0 ? 'Venta de producto' : i % 3 === 1 ? 'Pago de servicios' : 'Transferencia interna'}
                              </td>
                              <td className="px-6 py-4 text-sm text-slate-400">
                                {i % 3 === 0 ? 'Ventas' : i % 3 === 1 ? 'Operativo' : 'Interno'}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-semibold">
                                <span className={
                                  i % 3 === 0 ? 'text-green-400' : i % 3 === 1 ? 'text-red-400' : 'text-blue-400'
                                }>
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
                      <h3 className="text-sm font-semibold text-slate-400 mb-2">Crecimiento Mensual</h3>
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
                              borderRadius: '12px'
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
                      { title: 'Comparativo', icon: BarChart3, color: 'cyan' }
                    ].map((report, index) => {
                      const reportBorderClasses = {
                        blue: 'border-blue-500/20 bg-gradient-to-br from-blue-500/10 to-blue-600/5',
                        green: 'border-green-500/20 bg-gradient-to-br from-green-500/10 to-green-600/5',
                        purple: 'border-purple-500/20 bg-gradient-to-br from-purple-500/10 to-purple-600/5',
                        orange: 'border-orange-500/20 bg-gradient-to-br from-orange-500/10 to-orange-600/5',
                        pink: 'border-pink-500/20 bg-gradient-to-br from-pink-500/10 to-pink-600/5',
                        cyan: 'border-cyan-500/20 bg-gradient-to-br from-cyan-500/10 to-cyan-600/5'
                      };

                      const reportIconClasses = {
                        blue: 'text-blue-400',
                        green: 'text-green-400',
                        purple: 'text-purple-400',
                        orange: 'text-orange-400',
                        pink: 'text-pink-400',
                        cyan: 'text-cyan-400'
                      };

                      const reportButtonClasses = {
                        blue: 'bg-gradient-to-r from-blue-500 to-blue-600',
                        green: 'bg-gradient-to-r from-green-500 to-green-600',
                        purple: 'bg-gradient-to-r from-purple-500 to-purple-600',
                        orange: 'bg-gradient-to-r from-orange-500 to-orange-600',
                        pink: 'bg-gradient-to-r from-pink-500 to-pink-600',
                        cyan: 'bg-gradient-to-r from-cyan-500 to-cyan-600'
                      };

                      return (
                        <motion.div
                          key={report.title}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className={`glass rounded-xl p-6 border cursor-pointer ${reportBorderClasses[report.color]}`}
                        >
                          <report.icon className={`w-8 h-8 mb-3 ${reportIconClasses[report.color]}`} />
                          <h3 className="text-lg font-semibold mb-2">{report.title}</h3>
                          <p className="text-sm text-slate-400 mb-4">
                            Generar reporte detallado del período seleccionado
                          </p>
                          <button className={`w-full py-2 px-4 rounded-lg font-semibold text-sm ${reportButtonClasses[report.color]}`}>
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
              <h2 className="text-xl font-bold mb-4">Nueva Transferencia</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm mb-2">Banco Destino</label>
                  <select
                    value={transferData.hacia}
                    onChange={(e) => setTransferData({...transferData, hacia: e.target.value})}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-blue-500"
                  >
                    {Object.keys(bancos).filter(k => k !== nombreBanco).map(k => (
                      <option key={k} value={k}>{nombres[k]}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm mb-2">Monto</label>
                  <input
                    type="number"
                    value={transferData.monto}
                    onChange={(e) => setTransferData({...transferData, monto: parseFloat(e.target.value) || 0})}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-2">Concepto</label>
                  <input
                    type="text"
                    value={transferData.concepto}
                    onChange={(e) => setTransferData({...transferData, concepto: e.target.value})}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setShowTransferModal(false)} className="flex-1 px-4 py-2 border border-white/10 rounded-lg">Cancelar</button>
                  <button onClick={realizarTransferencia} className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg">Transferir</button>
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
              <h2 className="text-xl font-bold mb-4">Registrar Gasto</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm mb-2">Monto</label>
                  <input
                    type="number"
                    value={gastoData.monto}
                    onChange={(e) => setGastoData({...gastoData, monto: parseFloat(e.target.value) || 0})}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-red-500"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-2">Concepto</label>
                  <input
                    type="text"
                    value={gastoData.concepto}
                    onChange={(e) => setGastoData({...gastoData, concepto: e.target.value})}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-red-500"
                  />
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setShowGastoModal(false)} className="flex-1 px-4 py-2 border border-white/10 rounded-lg">Cancelar</button>
                  <button onClick={registrarGasto} className="flex-1 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 rounded-lg">Registrar</button>
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
              <h2 className="text-xl font-bold mb-4">Registrar Ingreso</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm mb-2">Monto</label>
                  <input
                    type="number"
                    value={ingresoData.monto}
                    onChange={(e) => setIngresoData({...ingresoData, monto: parseFloat(e.target.value) || 0})}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-2">Concepto</label>
                  <input
                    type="text"
                    value={ingresoData.concepto}
                    onChange={(e) => setIngresoData({...ingresoData, concepto: e.target.value})}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-green-500"
                  />
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setShowIngresoModal(false)} className="flex-1 px-4 py-2 border border-white/10 rounded-lg">Cancelar</button>
                  <button onClick={registrarIngreso} className="flex-1 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg">Registrar</button>
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
              {banco.transferencias.slice(-10).reverse().map((t, idx) => (
                <div key={idx} className={`p-3 rounded-lg border-l-4 ${t.tipo === 'entrada' ? 'border-green-500 bg-green-500/10' : 'border-red-500 bg-red-500/10'}`}>
                  <div className="flex justify-between">
                    <span className="text-sm font-semibold">{t.tipo === 'entrada' ? `De ${nombres[t.desde]}` : `Hacia ${nombres[t.hacia]}`}</span>
                    <span className={`text-sm font-bold ${t.tipo === 'entrada' ? 'text-green-400' : 'text-red-400'}`}>
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
              {banco.gastos.slice(-10).reverse().map((g, idx) => (
                <div key={idx} className="p-3 rounded-lg bg-white/5">
                  <div className="flex justify-between">
                    <span className="text-sm font-semibold">{g.concepto}</span>
                    <span className="text-sm font-bold text-red-400">-${g.monto.toLocaleString()}</span>
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
      concepto: ''
    });
    const [gastoData, setGastoData] = useState({
      concepto: '',
      monto: 0
    });

    const nombres = {
      bovedaMonte: 'Bóveda Monte',
      utilidades: 'Utilidades',
      fletes: 'Fletes',
      azteca: 'Azteca',
      leftie: 'Leftie',
      profit: 'Profit'
    };

    const banco = bancos[selectedBanco];

    const realizarTransferencia = () => {
      if (transferData.monto <= 0 || transferData.monto > bancos[transferData.desde].capitalActual) {
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
          transferencias: [...bancos[transferData.desde].transferencias, {
            tipo: 'salida',
            hacia: transferData.hacia,
            monto: transferData.monto,
            concepto: transferData.concepto,
            fecha: new Date().toLocaleString()
          }]
        },
        [transferData.hacia]: {
          ...bancos[transferData.hacia],
          capitalActual: bancos[transferData.hacia].capitalActual + transferData.monto,
          transferencias: [...bancos[transferData.hacia].transferencias, {
            tipo: 'entrada',
            desde: transferData.desde,
            monto: transferData.monto,
            concepto: transferData.concepto,
            fecha: new Date().toLocaleString()
          }]
        }
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
          gastos: [...bancos[selectedBanco].gastos, {
            concepto: gastoData.concepto,
            monto: gastoData.monto,
            fecha: new Date().toLocaleString()
          }]
        }
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
                    {Object.keys(bancos).map(key => (
                      <option key={key} value={key}>{nombres[key]}</option>
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
                    {Object.keys(bancos).map(key => (
                      <option key={key} value={key}>{nombres[key]}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">Monto</label>
                  <input
                    type="number"
                    value={transferData.monto}
                    onChange={(e) => setTransferData({ ...transferData, monto: parseFloat(e.target.value) || 0 })}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 text-white"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">Concepto (opcional)</label>
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
                  <label className="block text-sm font-semibold text-slate-300 mb-2">Concepto</label>
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
                    onChange={(e) => setGastoData({ ...gastoData, monto: parseFloat(e.target.value) || 0 })}
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
            <p className="text-3xl font-bold text-green-400">${banco.capitalActual.toLocaleString()}</p>
          </div>

          <div className="glass rounded-2xl p-6 border border-white/10">
            <p className="text-sm text-slate-400 mb-2">Histórico Total</p>
            <p className="text-3xl font-bold text-blue-400">${banco.historico.toLocaleString()}</p>
          </div>

          <div className="glass rounded-2xl p-6 border border-white/10">
            <p className="text-sm text-slate-400 mb-2">Total Gastos</p>
            <p className="text-3xl font-bold text-red-400">
              ${banco.gastos.reduce((sum, g) => sum + g.monto, 0).toLocaleString()}
            </p>
          </div>
        </div>

        {/* Transferencias */}
        {banco.transferencias && banco.transferencias.length > 0 && (
          <div className="glass rounded-2xl p-6 border border-white/10">
            <h2 className="text-xl font-bold mb-4">Transferencias</h2>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {banco.transferencias.map((trans, idx) => (
                <div key={idx} className={`p-4 glass rounded-lg flex justify-between items-center ${
                  trans.tipo === 'entrada' ? 'border-l-4 border-green-500' : 'border-l-4 border-red-500'
                }`}>
                  <div>
                    <p className="font-semibold">
                      {trans.tipo === 'entrada'
                        ? `Recibido de ${nombres[trans.desde]}`
                        : `Enviado a ${nombres[trans.hacia]}`}
                    </p>
                    {trans.concepto && <p className="text-sm text-slate-400">{trans.concepto}</p>}
                    <p className="text-xs text-slate-500 mt-1">{trans.fecha}</p>
                  </div>
                  <span className={`text-lg font-bold ${
                    trans.tipo === 'entrada' ? 'text-green-400' : 'text-red-400'
                  }`}>
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
            {banco.registros.map((registro, idx) => (
              <div key={idx} className="p-4 glass rounded-lg flex justify-between items-center">
                <div>
                  <p className="font-semibold">{registro.concepto}</p>
                  <p className="text-sm text-slate-400">{registro.fecha}</p>
                </div>
                <span className="text-lg font-bold text-green-400">${registro.monto.toLocaleString()}</span>
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
            {banco.gastos.map((gasto, idx) => (
              <div key={idx} className="p-4 glass rounded-lg flex justify-between items-center">
                <div>
                  <p className="font-semibold">{gasto.concepto}</p>
                  <p className="text-sm text-slate-400">{gasto.fecha}</p>
                </div>
                <span className="text-lg font-bold text-red-400">-${gasto.monto.toLocaleString()}</span>
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
    const totalIngresos = React.useMemo(() =>
      ventas.reduce((sum, v) => sum + (v.totalVenta || 0), 0),
      [ventas]
    );

    const totalEgresos = React.useMemo(() =>
      ordenesCompra.reduce((sum, o) => sum + (o.total || 0), 0),
      [ordenesCompra]
    );

    const totalBancos = React.useMemo(() =>
      Object.values(bancos).reduce((sum, b) => sum + b.capitalActual, 0),
      [bancos]
    );

    // Datos para gráficos de tendencias
    const chartData = React.useMemo(() => [
      { mes: 'Ene', ingresos: 85000, egresos: 65000 },
      { mes: 'Feb', ingresos: 92000, egresos: 70000 },
      { mes: 'Mar', ingresos: 78000, egresos: 58000 },
      { mes: 'Abr', ingresos: 105000, egresos: 80000 },
      { mes: 'May', ingresos: 118000, egresos: 85000 },
      { mes: 'Jun', ingresos: 125000, egresos: 90000 }
    ], []);

    // Función para exportar a PDF
    const exportToPDF = () => {
      const content = `
REPORTE FLOWDISTRIBUTOR
========================
Fecha de generación: ${new Date().toLocaleString()}
${dateRange.inicio ? `Período: ${dateRange.inicio} - ${dateRange.fin}` : 'Período: Todos los registros'}

RESUMEN FINANCIERO
------------------
Total en Bancos: $${totalBancos.toLocaleString()}
Ingresos Totales: $${totalIngresos.toLocaleString()}
Egresos Totales: $${totalEgresos.toLocaleString()}
Balance: $${(totalIngresos - totalEgresos).toLocaleString()}

DISTRIBUCIÓN DE CAPITAL POR BANCO
----------------------------------
${Object.entries(bancos).map(([key, banco]) => {
  const nombres = {
    bovedaMonte: 'Bóveda Monte',
    utilidades: 'Utilidades',
    fletes: 'Fletes',
    azteca: 'Azteca',
    leftie: 'Leftie',
    profit: 'Profit'
  };
  const percentage = totalBancos > 0 ? (banco.capitalActual / totalBancos) * 100 : 0;
  return `${nombres[key]}: $${banco.capitalActual.toLocaleString()} (${percentage.toFixed(1)}%)`;
}).join('\n')}

RESUMEN DE OPERACIONES
----------------------
Total Órdenes de Compra: ${ordenesCompra.length}
Total Ventas: ${ventas.length}
Distribuidores Activos: ${distribuidores.length}
Clientes Activos: ${clientes.length}
Productos en Stock: ${almacen.stock.length}

ADEUDOS PENDIENTES
------------------
Distribuidores: $${distribuidores.reduce((sum, d) => sum + d.adeudo, 0).toLocaleString()}
Clientes: $${clientes.reduce((sum, c) => sum + c.adeudo, 0).toLocaleString()}
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
          profit: 'Profit'
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
                  <label className="block text-sm font-semibold mb-3">Rango de fechas (opcional)</label>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Desde</label>
                      <input
                        type="date"
                        value={dateRange.inicio}
                        onChange={(e) => setDateRange({...dateRange, inicio: e.target.value})}
                        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Hasta</label>
                      <input
                        type="date"
                        value={dateRange.fin}
                        onChange={(e) => setDateRange({...dateRange, fin: e.target.value})}
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
            <p className="text-3xl font-bold text-purple-400">${(totalIngresos - totalEgresos).toLocaleString()}</p>
          </div>
        </div>

        {/* Gráfico de Bancos */}
        <div className="glass rounded-2xl p-6 border border-white/10">
          <h2 className="text-xl font-bold mb-4">Distribución de Capital por Banco</h2>
          <div className="space-y-3">
            {Object.entries(bancos).map(([key, banco]) => {
              const percentage = totalBancos > 0 ? (banco.capitalActual / totalBancos) * 100 : 0;
              const nombres = {
                bovedaMonte: 'Bóveda Monte',
                utilidades: 'Utilidades',
                fletes: 'Fletes',
                azteca: 'Azteca',
                leftie: 'Leftie',
                profit: 'Profit'
              };

              return (
                <div key={key}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-semibold">{nombres[key]}</span>
                    <span className="text-slate-400">${banco.capitalActual.toLocaleString()} ({percentage.toFixed(1)}%)</span>
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
                  ${distribuidores.reduce((sum, d) => sum + d.adeudo, 0).toLocaleString()}
                </p>
              </div>
              <div className="pt-3 border-t border-white/10">
                <p className="text-sm text-slate-400 mb-2">Clientes:</p>
                <p className="text-2xl font-bold text-yellow-400">
                  ${clientes.reduce((sum, c) => sum + c.adeudo, 0).toLocaleString()}
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
              value={almacen.stock.filter(p => p.cantidad > p.cantidadMinima).length}
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
              { name: 'Ventas Completadas', value: ventas.filter(v => v.estadoPago === 'completo').length },
              { name: 'Clientes Recurrentes', value: clientes.filter(c => c.ventas.length > 1).length }
            ]}
          />

          {/* Period Comparison */}
          <PeriodComparison
            currentData={[
              { mes: 'Ene', value: totalIngresos * 0.15 },
              { mes: 'Feb', value: totalIngresos * 0.18 },
              { mes: 'Mar', value: totalIngresos * 0.20 },
              { mes: 'Abr', value: totalIngresos * 0.22 },
              { mes: 'May', value: totalIngresos * 0.25 }
            ]}
            previousData={[
              { mes: 'Ene', value: totalIngresos * 0.12 },
              { mes: 'Feb', value: totalIngresos * 0.14 },
              { mes: 'Mar', value: totalIngresos * 0.16 },
              { mes: 'Abr', value: totalIngresos * 0.18 },
              { mes: 'May', value: totalIngresos * 0.20 }
            ]}
            metricName="Ingresos Mensuales"
          />

          {/* Radar Analysis */}
          <RadarAnalysis
            data={{
              actual: {
                'Ventas': ventas.length,
                'Stock': almacen.stock.length,
                'Clientes': clientes.length,
                'Distribuidores': distribuidores.length,
                'Capital': totalBancos / 10000,
                'Rentabilidad': (totalIngresos - totalEgresos) / 1000
              },
              objetivo: {
                'Ventas': 100,
                'Stock': 150,
                'Clientes': 50,
                'Distribuidores': 20,
                'Capital': 100,
                'Rentabilidad': 50
              }
            }}
            categories={['Ventas', 'Stock', 'Clientes', 'Distribuidores', 'Capital', 'Rentabilidad']}
          />

          {/* Trend Prediction */}
          <TrendPrediction
            historicalData={chartData.slice(0, 5).map((item, idx) => ({
              date: item.mes,
              value: item.ingresos
            }))}
            predictions={[
              { date: 'Jun', predicted: chartData[0]?.ingresos * 1.1 || 0 },
              { date: 'Jul', predicted: chartData[0]?.ingresos * 1.15 || 0 },
              { date: 'Ago', predicted: chartData[0]?.ingresos * 1.2 || 0 }
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
    // Verificar si es un panel de banco individual
    if (activePanel.startsWith('banco-')) {
      const bancoKey = activePanel.replace('banco-', '');
      return <BancoPanelIndividual nombreBanco={bancoKey} />;
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
      case 'reportes':
        return <ReportesPanel />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className={`flex h-screen ${darkMode ? 'bg-slate-950' : 'bg-slate-900'} overflow-hidden relative`}>
      {/* Cursor glow effect */}
      <CursorGlow />

      {/* Animated grid background */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
        }} />
      </div>

      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="glass-strong border-b border-blue-500/20 p-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                  className="md:hidden p-2 hover:bg-white/5 rounded-lg"
                >
                  <Menu className="w-6 h-6" />
                </button>
                <h2 className="text-2xl font-bold capitalize">{activePanel}</h2>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={toggleTheme}
                  className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                  title="Cambiar tema"
                >
                  {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>
                
                {/* 🔔 BOTÓN DE NOTIFICACIONES MEJORADO */}
                <button
                  onClick={() => setShowNotificationCenter(true)}
                  className="p-2 hover:bg-white/5 rounded-lg transition-colors relative"
                  aria-label="notifications"
                  title="Centro de Notificaciones (Ctrl+Shift+N)"
                >
                  <Bell className="w-5 h-5" />
                  {notificationSystem.unreadCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs flex items-center justify-center font-bold"
                    >
                      {notificationSystem.unreadCount > 9 ? '9+' : notificationSystem.unreadCount}
                    </motion.span>
                  )}
                </button>
                
                <button
                  onClick={() => setShowSearchBar(!showSearchBar)}
                  className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                  aria-label="search"
                  title="Búsqueda Global (Ctrl+K)"
                >
                  <Search className="w-5 h-5" />
                </button>
                
                {/* ⌨️ BOTÓN DE ATAJOS */}
                <button
                  onClick={() => setShowKeyboardHelp(true)}
                  className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                  title="Atajos de Teclado (?)"
                >
                  <Keyboard className="w-5 h-5" />
                </button>

                {/* 🎨 BOTÓN DE TEMAS */}
                <button
                  onClick={() => setShowThemeCustomizer(true)}
                  className="p-2 hover:bg-white/5 rounded-lg transition-colors relative"
                  title="Personalizar Tema"
                >
                  <div className="relative">
                    <span className="text-xl">{themeManager.theme.icon}</span>
                    <span className="absolute -bottom-1 -right-1 w-2 h-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 animate-pulse" />
                  </div>
                </button>
                
                {/* ↩️ UNDO/REDO BUTTONS */}
                <div className="flex gap-1 border-l border-white/10 pl-3">
                  <button
                    onClick={() => actionHistory.undo()}
                    disabled={!actionHistory.canUndo}
                    className={`p-2 rounded-lg transition-colors ${
                      actionHistory.canUndo
                        ? 'hover:bg-white/5'
                        : 'opacity-30 cursor-not-allowed'
                    }`}
                    title="Deshacer (Ctrl+Z)"
                  >
                    <Undo2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => actionHistory.redo()}
                    disabled={!actionHistory.canRedo}
                    className={`p-2 rounded-lg transition-colors ${
                      actionHistory.canRedo
                        ? 'hover:bg-white/5'
                        : 'opacity-30 cursor-not-allowed'
                    }`}
                    title="Rehacer (Ctrl+Y)"
                  >
                    <Redo2 className="w-4 h-4" />
                  </button>
                </div>
                
                <button
                  onClick={() => setShowSettingsModal(true)}
                  className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                >
                  <Settings className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Barra de búsqueda expandible */}
            <AnimatePresence>
              {showSearchBar && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
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
                        className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-blue-500 transition-colors"
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
                        onChange={(e) => setFilterOptions({...filterOptions, status: e.target.value})}
                        className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-blue-500 cursor-pointer"
                      >
                        <option value="todos">Todos</option>
                        <option value="activo">Activos</option>
                        <option value="pendiente">Pendientes</option>
                        <option value="completado">Completados</option>
                      </select>

                      <select
                        value={filterOptions.sortBy}
                        onChange={(e) => setFilterOptions({...filterOptions, sortBy: e.target.value})}
                        className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-blue-500 cursor-pointer"
                      >
                        <option value="reciente">Más reciente</option>
                        <option value="antiguo">Más antiguo</option>
                        <option value="mayor">Mayor monto</option>
                        <option value="menor">Menor monto</option>
                        <option value="alfabetico">A-Z</option>
                      </select>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activePanel}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
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
      <KeyboardShortcutsHelp
        isOpen={showKeyboardHelp}
        onClose={() => setShowKeyboardHelp(false)}
      />
      
      {/* � PERSONALIZADOR DE TEMAS */}
      <ThemeCustomizer
        isOpen={showThemeCustomizer}
        onClose={() => setShowThemeCustomizer(false)}
      />
      
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
    </div>
  );
}
