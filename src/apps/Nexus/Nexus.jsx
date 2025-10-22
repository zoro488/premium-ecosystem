import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { AnimatePresence, motion, useMotionValue, useSpring } from 'framer-motion';
import {
  Activity,
  AlertCircle,
  AlertTriangle,
  Award,
  BarChart3,
  Bell,
  Box,
  Boxes,
  Brain,
  Building2,
  Calendar,
  CheckCircle,
  ChevronRight,
  CircuitBoard,
  Clock,
  Cloud,
  CloudLightning,
  Cpu,
  CreditCard,
  Crosshair,
  Database,
  DollarSign,
  Download,
  ExternalLink,
  Eye,
  Filter,
  Flame,
  Gauge,
  Globe,
  HardDrive,
  Heart,
  Info,
  Layers,
  LineChart,
  Lock,
  Mail,
  MapPin,
  Maximize2,
  Menu,
  Monitor,
  Network,
  Package,
  Pause,
  PieChart,
  Play,
  Power,
  Radar,
  Radio,
  RefreshCw,
  Rocket,
  RotateCw,
  Satellite,
  Save,
  Search,
  Server,
  Settings,
  Share2,
  Shield,
  ShoppingCart,
  Smartphone,
  Sparkles,
  Star,
  StopCircle,
  Tablet,
  Target,
  ToggleLeft,
  ToggleRight,
  TrendingDown,
  TrendingUp,
  Truck,
  Upload,
  Users,
  Wallet,
  Wifi,
  WifiOff,
  X,
  XCircle,
  Zap,
} from 'lucide-react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Legend,
  Line,
  Pie,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  RadarChart,
  LineChart as RechartsLine,
  PieChart as RechartsPie,
  Radar as RechartsRadar,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import AIAssistant from '../../components/shared/AIAssistant';
import { STORAGE_KEYS, useLocalStorage } from '../../utils/storage';

// Mock data del dashboard central
const systemStats = {
  totalRevenue: 2847650,
  totalOrders: 1247,
  activeUsers: 3892,
  systemHealth: 98.5,
  networkStatus: 'online',
  activeApps: 4,
  totalApps: 5,
  cpuUsage: 42,
  ramUsage: 68,
  networkLoad: 85,
  dbConnections: 234,
};

// Estado de las aplicaciones del ecosistema
const appsStatus = [
  {
    id: 'flow',
    name: 'FlowDistributor',
    icon: Building2,
    status: 'online',
    uptime: 99.8,
    activeUsers: 147,
    requests: 12847,
    avgResponseTime: 245,
    color: 'from-blue-500 to-cyan-500',
    revenue: 847250,
    orders: 523,
    path: '/flow',
  },
  {
    id: 'shadow',
    name: 'ShadowPrime',
    icon: Wallet,
    status: 'online',
    uptime: 99.9,
    activeUsers: 89,
    requests: 8934,
    avgResponseTime: 189,
    color: 'from-purple-500 to-violet-500',
    revenue: 1254800,
    transactions: 456,
    path: '/shadow',
  },
  {
    id: 'apollo',
    name: 'Apollo',
    icon: Radio,
    status: 'online',
    uptime: 98.5,
    activeUsers: 34,
    requests: 15234,
    avgResponseTime: 312,
    color: 'from-green-500 to-emerald-500',
    revenue: 345600,
    vehicles: 24,
    drones: 8,
    path: '/apollo',
  },
  {
    id: 'synapse',
    name: 'Synapse',
    icon: Brain,
    status: 'online',
    uptime: 99.2,
    activeUsers: 178,
    requests: 45678,
    avgResponseTime: 567,
    color: 'from-orange-500 to-amber-500',
    revenue: 400000,
    conversations: 892,
    path: '/synapse',
  },
];

// Actividad reciente del sistema
const recentActivity = [
  {
    id: 1,
    type: 'order',
    app: 'FlowDistributor',
    message: 'Nueva orden #1247 procesada',
    value: '$12,450',
    timestamp: '2 min ago',
    icon: ShoppingCart,
    color: 'text-blue-400',
  },
  {
    id: 2,
    type: 'transaction',
    app: 'ShadowPrime',
    message: 'Transacción de wallet completada',
    value: '$45,000',
    timestamp: '5 min ago',
    icon: Wallet,
    color: 'text-purple-400',
  },
  {
    id: 3,
    type: 'detection',
    app: 'Apollo',
    message: 'Detección de IA confirmada',
    value: '12 objetos',
    timestamp: '8 min ago',
    icon: Radio,
    color: 'text-green-400',
  },
  {
    id: 4,
    type: 'ai',
    app: 'Synapse',
    message: 'Conversación iniciada con GPT-4',
    value: '145 tokens',
    timestamp: '12 min ago',
    icon: Brain,
    color: 'text-orange-400',
  },
];

// Datos de performance en tiempo real
const performanceData = [
  { time: '00:00', cpu: 35, ram: 58, network: 72, db: 28 },
  { time: '04:00', cpu: 38, ram: 62, network: 68, db: 32 },
  { time: '08:00', cpu: 45, ram: 70, network: 85, db: 45 },
  { time: '12:00', cpu: 42, ram: 68, network: 82, db: 38 },
  { time: '16:00', cpu: 48, ram: 72, network: 88, db: 42 },
  { time: '20:00', cpu: 40, ram: 65, network: 78, db: 35 },
];

// Revenue data
const revenueData = [
  { month: 'Jan', revenue: 45000, orders: 234 },
  { month: 'Feb', revenue: 52000, orders: 289 },
  { month: 'Mar', revenue: 48000, orders: 256 },
  { month: 'Apr', revenue: 61000, orders: 312 },
  { month: 'May', revenue: 55000, orders: 278 },
  { month: 'Jun', revenue: 67000, orders: 334 },
];

// Analytics data
const analyticsData = {
  userGrowth: [
    { month: 'Jan', users: 2400, activeUsers: 1800, newUsers: 400 },
    { month: 'Feb', users: 2800, activeUsers: 2100, newUsers: 450 },
    { month: 'Mar', users: 3200, activeUsers: 2400, newUsers: 500 },
    { month: 'Apr', users: 3600, activeUsers: 2700, newUsers: 520 },
    { month: 'May', users: 3800, activeUsers: 2850, newUsers: 480 },
    { month: 'Jun', users: 3892, activeUsers: 2920, newUsers: 510 },
  ],
  appUsage: [
    { name: 'FlowDistributor', value: 38 },
    { name: 'ShadowPrime', value: 23 },
    { name: 'Apollo', value: 15 },
    { name: 'Synapse', value: 24 },
  ],
  revenueByApp: [
    { name: 'FlowDistributor', revenue: 847250, orders: 523 },
    { name: 'ShadowPrime', revenue: 1254800, transactions: 456 },
    { name: 'Apollo', revenue: 345600, deliveries: 234 },
    { name: 'Synapse', revenue: 400000, conversations: 892 },
  ],
};

// Network data
const networkData = {
  connections: [
    {
      id: 1,
      source: 'FlowDistributor',
      target: 'Database',
      status: 'active',
      latency: 12,
      bandwidth: '1.2 Gbps',
    },
    {
      id: 2,
      source: 'ShadowPrime',
      target: 'Blockchain',
      status: 'active',
      latency: 45,
      bandwidth: '800 Mbps',
    },
    {
      id: 3,
      source: 'Apollo',
      target: 'IoT Network',
      status: 'active',
      latency: 8,
      bandwidth: '500 Mbps',
    },
    {
      id: 4,
      source: 'Synapse',
      target: 'AI Cluster',
      status: 'active',
      latency: 23,
      bandwidth: '2.4 Gbps',
    },
    {
      id: 5,
      source: 'API Gateway',
      target: 'Load Balancer',
      status: 'active',
      latency: 5,
      bandwidth: '10 Gbps',
    },
  ],
  traffic: [
    { time: '00:00', incoming: 245, outgoing: 189 },
    { time: '04:00', incoming: 198, outgoing: 156 },
    { time: '08:00', incoming: 412, outgoing: 378 },
    { time: '12:00', incoming: 567, outgoing: 523 },
    { time: '16:00', incoming: 623, outgoing: 589 },
    { time: '20:00', incoming: 445, outgoing: 412 },
  ],
};

// Alerts data
const alertsData = [
  {
    id: 1,
    type: 'warning',
    severity: 'medium',
    app: 'Apollo',
    message: 'CPU usage above 80% threshold',
    timestamp: '5 min ago',
    status: 'active',
    icon: AlertTriangle,
  },
  {
    id: 2,
    type: 'error',
    severity: 'high',
    app: 'ShadowPrime',
    message: 'Failed transaction attempt detected',
    timestamp: '12 min ago',
    status: 'active',
    icon: XCircle,
  },
  {
    id: 3,
    type: 'info',
    severity: 'low',
    app: 'FlowDistributor',
    message: 'New product catalog updated',
    timestamp: '23 min ago',
    status: 'resolved',
    icon: Info,
  },
  {
    id: 4,
    type: 'success',
    severity: 'low',
    app: 'Synapse',
    message: 'AI model training completed',
    timestamp: '1 hour ago',
    status: 'resolved',
    icon: CheckCircle,
  },
];

// Cursor glow effect
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
  }, []);

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
      <div className="w-full h-full bg-gradient-to-r from-pink-500/20 via-rose-500/20 to-red-500/20 blur-3xl rounded-full" />
    </motion.div>
  );
};

// Sidebar Premium
const Sidebar = ({ activeSection, setActiveSection, isCollapsed, setIsCollapsed }) => {
  const menuItems = [
    {
      id: 'dashboard',
      icon: Gauge,
      label: 'Mission Control',
      color: 'from-pink-500 to-rose-500',
      badge: null,
    },
    {
      id: 'apps',
      icon: Boxes,
      label: 'Aplicaciones',
      color: 'from-blue-500 to-cyan-500',
      badge: 4,
    },
    {
      id: 'analytics',
      icon: BarChart3,
      label: 'Analytics',
      color: 'from-purple-500 to-violet-500',
      badge: null,
    },
    {
      id: 'network',
      icon: Network,
      label: 'Red & Conexiones',
      color: 'from-green-500 to-emerald-500',
      badge: null,
    },
    {
      id: 'performance',
      icon: Activity,
      label: 'Rendimiento',
      color: 'from-cyan-500 to-teal-500',
      badge: 'LIVE',
    },
    { id: 'alerts', icon: Bell, label: 'Alertas', color: 'from-orange-500 to-red-500', badge: 3 },
    {
      id: 'settings',
      icon: Settings,
      label: 'Configuración',
      color: 'from-slate-500 to-slate-600',
      badge: null,
    },
  ];

  return (
    <motion.aside
      animate={{ width: isCollapsed ? 80 : 320 }}
      className="fixed left-0 top-0 h-screen backdrop-blur-2xl bg-gradient-to-br from-slate-950/95 via-pink-950/30 to-slate-950/95 border-r border-pink-500/20 z-50 flex flex-col overflow-hidden"
    >
      {/* Animated background */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 via-transparent to-rose-500/10" />
        <motion.div
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%'],
          }}
          transition={{ duration: 20, repeat: Infinity, repeatType: 'reverse' }}
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              'radial-gradient(circle at 50% 50%, rgba(236, 72, 153, 0.1) 0%, transparent 50%)',
            backgroundSize: '100% 100%',
          }}
        />
      </div>

      {/* Header */}
      <div className="relative p-6 border-b border-pink-500/20">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3"
            >
              <motion.div
                animate={{
                  boxShadow: [
                    '0 0 20px rgba(236, 72, 153, 0.5)',
                    '0 0 40px rgba(236, 72, 153, 0.8)',
                    '0 0 20px rgba(236, 72, 153, 0.5)',
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="relative"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 via-rose-500 to-red-500 p-[2px]">
                  <div className="w-full h-full rounded-xl bg-slate-950 flex items-center justify-center">
                    <Network className="w-6 h-6 text-pink-400" />
                  </div>
                </div>
                <motion.div
                  animate={{
                    rotate: 360,
                    scale: [1, 1.2, 1],
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="absolute -top-1 -right-1 w-3 h-3 bg-pink-500 rounded-full"
                />
              </motion.div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-pink-400 via-rose-400 to-red-400 bg-clip-text text-transparent">
                  Nexus
                </h1>
                <p className="text-xs text-slate-400 flex items-center gap-1">
                  <Satellite className="w-3 h-3 text-pink-400" />
                  Control Center
                </p>
              </div>
            </motion.div>
          )}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 hover:bg-white/5 rounded-lg transition-colors relative group"
          >
            {isCollapsed ? <Menu className="w-5 h-5" /> : <X className="w-5 h-5" />}
            <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-rose-500 rounded-lg opacity-0 group-hover:opacity-20 transition-opacity" />
          </motion.button>
        </div>
      </div>

      {/* Menu */}
      <nav className="relative flex-1 overflow-y-auto p-4 space-y-2 scrollbar-hide">
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;

          return (
            <motion.button
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ x: 8, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveSection(item.id)}
              className="w-full relative group"
            >
              {/* Glow effect */}
              <AnimatePresence>
                {isActive && (
                  <motion.div
                    layoutId="activeGlow"
                    className={`absolute inset-0 bg-gradient-to-r ${item.color} opacity-20 blur-xl rounded-xl`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.3 }}
                    exit={{ opacity: 0 }}
                  />
                )}
              </AnimatePresence>

              <div
                className={`
                  relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all
                  ${
                    isActive
                      ? `bg-gradient-to-r ${item.color} bg-opacity-20 border border-white/20 shadow-lg`
                      : 'hover:bg-white/5 border border-transparent'
                  }
                `}
              >
                <div className={`relative ${isActive ? 'scale-110' : ''} transition-transform`}>
                  <Icon
                    className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'} transition-colors`}
                  />
                  {isActive && (
                    <motion.div
                      animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className={`absolute inset-0 bg-gradient-to-r ${item.color} rounded-full blur-md`}
                    />
                  )}
                </div>

                {!isCollapsed && (
                  <>
                    <span
                      className={`font-medium flex-1 text-left ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'} transition-colors`}
                    >
                      {item.label}
                    </span>
                    {item.badge && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className={`
                          px-2 py-0.5 rounded-full text-xs font-bold
                          ${
                            typeof item.badge === 'number'
                              ? 'bg-pink-500/20 text-pink-400 border border-pink-500/30'
                              : 'bg-gradient-to-r from-red-500 to-orange-500 text-white animate-pulse'
                          }
                        `}
                      >
                        {item.badge}
                      </motion.span>
                    )}
                  </>
                )}
              </div>
            </motion.button>
          );
        })}
      </nav>

      {/* Footer Stats */}
      <div className="relative p-4 border-t border-pink-500/20">
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden rounded-xl p-4 bg-gradient-to-br from-pink-500/10 via-rose-500/10 to-red-500/10 border border-pink-500/20"
          >
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-slate-400">System Health</span>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-xs text-green-400 font-medium">
                    {systemStats.systemHealth}%
                  </span>
                </div>
              </div>
              <div className="h-2 bg-white/5 rounded-full overflow-hidden mb-3">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${systemStats.systemHealth}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="h-full bg-gradient-to-r from-green-500 to-emerald-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-slate-500">Apps:</span>
                  <span className="text-pink-400 ml-1 font-medium">
                    {systemStats.activeApps}/{systemStats.totalApps}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500">Users:</span>
                  <span className="text-cyan-400 ml-1 font-medium">{systemStats.activeUsers}</span>
                </div>
              </div>
            </div>
            <motion.div
              animate={{
                backgroundPosition: ['0% 0%', '100% 100%'],
              }}
              transition={{ duration: 10, repeat: Infinity, repeatType: 'reverse' }}
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage: 'linear-gradient(45deg, #ec4899 0%, #ef4444 100%)',
                backgroundSize: '200% 200%',
              }}
            />
          </motion.div>
        )}
      </div>
    </motion.aside>
  );
};

// App Status Card Premium
const AppStatusCard = ({ app, navigate, delay = 0 }) => {
  const Icon = app.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, type: 'spring', stiffness: 100 }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="relative overflow-hidden rounded-2xl cursor-pointer group"
      onClick={() => navigate(app.path)}
    >
      {/* Animated gradient background */}
      <motion.div
        animate={{
          backgroundPosition: ['0% 0%', '100% 100%'],
        }}
        transition={{ duration: 10, repeat: Infinity, repeatType: 'reverse' }}
        className={`absolute inset-0 bg-gradient-to-br ${app.color} opacity-20`}
        style={{ backgroundSize: '200% 200%' }}
      />

      {/* Glass overlay */}
      <div className="absolute inset-0 backdrop-blur-xl bg-slate-950/60 border border-white/10 group-hover:border-white/20 transition-all" />

      {/* Scan line effect */}
      <motion.div
        animate={{ y: ['0%', '100%'] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
        className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent"
      />

      <div className="relative z-10 p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <motion.div
              whileHover={{ rotate: 360, scale: 1.2 }}
              transition={{ duration: 0.6 }}
              className={`p-3 rounded-xl bg-gradient-to-br ${app.color}`}
            >
              <Icon className="w-6 h-6 text-white" />
            </motion.div>
            <div>
              <h3 className="text-lg font-bold text-white">{app.name}</h3>
              <div className="flex items-center gap-2 mt-1">
                <div
                  className={`w-2 h-2 rounded-full ${app.status === 'online' ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}
                />
                <span className="text-xs text-slate-400">{app.status}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="backdrop-blur-sm bg-black/20 rounded-lg p-3 border border-white/10">
            <p className="text-xs text-slate-400 mb-1">Uptime</p>
            <p className="text-lg font-bold text-white">{app.uptime}%</p>
          </div>
          <div className="backdrop-blur-sm bg-black/20 rounded-lg p-3 border border-white/10">
            <p className="text-xs text-slate-400 mb-1">Users</p>
            <p className="text-lg font-bold text-white">{app.activeUsers}</p>
          </div>
          <div className="backdrop-blur-sm bg-black/20 rounded-lg p-3 border border-white/10">
            <p className="text-xs text-slate-400 mb-1">Requests</p>
            <p className="text-lg font-bold text-white">{(app.requests / 1000).toFixed(1)}K</p>
          </div>
          <div className="backdrop-blur-sm bg-black/20 rounded-lg p-3 border border-white/10">
            <p className="text-xs text-slate-400 mb-1">Response</p>
            <p className="text-lg font-bold text-white">{app.avgResponseTime}ms</p>
          </div>
        </div>

        {/* Progress Bar - Uptime */}
        <div className="mb-3">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Disponibilidad</span>
            <span>{app.uptime}%</span>
          </div>
          <div className="h-2 bg-white/5 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${app.uptime}%` }}
              transition={{ duration: 1, delay: delay + 0.2 }}
              className={`h-full bg-gradient-to-r ${app.color}`}
            />
          </div>
        </div>

        {/* Revenue */}
        {app.revenue !== undefined && (
          <div className="pt-3 border-t border-white/5 flex items-center justify-between">
            <span className="text-sm text-slate-400">Revenue</span>
            <span className="text-lg font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
              ${(app.revenue / 1000).toFixed(0)}K
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

// Mission Control Dashboard
const DashboardView = ({ apps, navigate }) => {
  const totalBalance = apps.reduce((acc, app) => acc + (app.revenue || 0), 0);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      {/* Hero Stats - Mission Control Style */}
      <div className="relative overflow-hidden rounded-3xl p-8 bg-gradient-to-br from-pink-500/10 via-rose-500/10 to-red-500/10 border border-pink-500/20">
        <motion.div
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%'],
          }}
          transition={{ duration: 20, repeat: Infinity, repeatType: 'reverse' }}
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              'radial-gradient(circle at 50% 50%, rgba(236, 72, 153, 0.3) 0%, transparent 50%)',
            backgroundSize: '200% 200%',
          }}
        />

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-6">
            <Rocket className="w-8 h-8 text-pink-400" />
            <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-400 via-rose-400 to-red-400 bg-clip-text text-transparent">
              Mission Control Dashboard
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <motion.div
              whileHover={{ scale: 1.05, y: -4 }}
              className="backdrop-blur-sm bg-white/5 rounded-xl p-6 border border-white/10"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="p-3 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-xs text-slate-400">Total Revenue</p>
                  <p className="text-2xl font-bold text-white">
                    ${(totalBalance / 1000).toFixed(0)}K
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <TrendingUp className="w-3 h-3 text-green-400" />
                <span className="text-green-400 font-medium">+12.5%</span>
                <span className="text-slate-500">vs last month</span>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05, y: -4 }}
              className="backdrop-blur-sm bg-white/5 rounded-xl p-6 border border-white/10"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500">
                  <ShoppingCart className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-xs text-slate-400">Total Orders</p>
                  <p className="text-2xl font-bold text-white">{systemStats.totalOrders}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <TrendingUp className="w-3 h-3 text-blue-400" />
                <span className="text-blue-400 font-medium">+8.3%</span>
                <span className="text-slate-500">vs last month</span>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05, y: -4 }}
              className="backdrop-blur-sm bg-white/5 rounded-xl p-6 border border-white/10"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-violet-500">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-xs text-slate-400">Active Users</p>
                  <p className="text-2xl font-bold text-white">{systemStats.activeUsers}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <TrendingUp className="w-3 h-3 text-purple-400" />
                <span className="text-purple-400 font-medium">+15.2%</span>
                <span className="text-slate-500">vs last month</span>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05, y: -4 }}
              className="backdrop-blur-sm bg-white/5 rounded-xl p-6 border border-white/10"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="p-3 rounded-xl bg-gradient-to-br from-pink-500 to-rose-500">
                  <Activity className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-xs text-slate-400">System Health</p>
                  <p className="text-2xl font-bold text-white">{systemStats.systemHealth}%</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <CheckCircle className="w-3 h-3 text-green-400" />
                <span className="text-green-400 font-medium">Optimal</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Applications Grid */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Boxes className="w-7 h-7 text-pink-400" />
            Sistema de Aplicaciones
          </h2>
          <div className="flex items-center gap-2 text-sm">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-slate-400">
              {systemStats.activeApps} de {systemStats.totalApps} en línea
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {apps.map((app, index) => (
            <AppStatusCard key={app.id} app={app} navigate={navigate} delay={index * 0.1} />
          ))}
        </div>
      </div>

      {/* Activity & Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="backdrop-blur-xl bg-slate-950/60 rounded-2xl p-6 border border-pink-500/20">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-pink-400" />
            Actividad Reciente
          </h3>
          <div className="space-y-2">
            {recentActivity.map((activity, index) => {
              const Icon = activity.icon;
              return (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ x: 4, backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
                  className="flex items-center gap-4 p-4 rounded-xl border border-white/10 hover:border-white/20 transition-all cursor-pointer"
                >
                  <div className={`p-2 rounded-lg bg-white/5 ${activity.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-white text-sm">{activity.message}</p>
                    <p className="text-xs text-slate-500">
                      {activity.app} • {activity.timestamp}
                    </p>
                  </div>
                  <span className="text-sm font-semibold text-green-400">{activity.value}</span>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Performance Chart */}
        <div className="backdrop-blur-xl bg-slate-950/60 rounded-2xl p-6 border border-pink-500/20">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-pink-400" />
            Rendimiento del Sistema
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={performanceData}>
              <defs>
                <linearGradient id="colorCpu" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ec4899" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#ec4899" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorRam" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="time" stroke="#666" />
              <YAxis stroke="#666" />
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #ec4899' }} />
              <Area
                type="monotone"
                dataKey="cpu"
                stroke="#ec4899"
                fillOpacity={1}
                fill="url(#colorCpu)"
              />
              <Area
                type="monotone"
                dataKey="ram"
                stroke="#8b5cf6"
                fillOpacity={1}
                fill="url(#colorRam)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </motion.div>
  );
};

// Apps Management Section
const AppsView = ({ apps, navigate }) => {
  const [selectedApp, setSelectedApp] = useState(null);

  const AppControlCard = ({ app, index }) => {
    const Icon = app.icon;
    const [isRunning, setIsRunning] = useState(app.status === 'online');

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        className="backdrop-blur-xl bg-slate-950/60 rounded-2xl p-6 border border-pink-500/20 hover:border-pink-500/40 transition-all"
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className={`p-4 rounded-xl bg-gradient-to-br ${app.color}`}>
              <Icon className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-1">{app.name}</h3>
              <div className="flex items-center gap-2">
                <div
                  className={`w-2 h-2 rounded-full ${isRunning ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}
                />
                <span className="text-sm text-slate-400">{isRunning ? 'Online' : 'Offline'}</span>
                <span className="text-xs text-slate-500">• Uptime: {app.uptime}%</span>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsRunning(!isRunning)}
              className={`p-2 rounded-lg ${isRunning ? 'bg-red-500/20 hover:bg-red-500/30' : 'bg-green-500/20 hover:bg-green-500/30'} transition-colors`}
            >
              {isRunning ? (
                <Pause className="w-5 h-5 text-red-400" />
              ) : (
                <Play className="w-5 h-5 text-green-400" />
              )}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 transition-colors"
            >
              <RotateCw className="w-5 h-5 text-blue-400" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate(app.path)}
              className="p-2 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 transition-colors"
            >
              <ExternalLink className="w-5 h-5 text-purple-400" />
            </motion.button>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-4">
          <div className="backdrop-blur-sm bg-white/5 rounded-lg p-3 border border-white/10">
            <p className="text-xs text-slate-400 mb-1">Active Users</p>
            <p className="text-lg font-bold text-white">{app.activeUsers}</p>
          </div>
          <div className="backdrop-blur-sm bg-white/5 rounded-lg p-3 border border-white/10">
            <p className="text-xs text-slate-400 mb-1">Requests</p>
            <p className="text-lg font-bold text-white">{(app.requests / 1000).toFixed(1)}K</p>
          </div>
          <div className="backdrop-blur-sm bg-white/5 rounded-lg p-3 border border-white/10">
            <p className="text-xs text-slate-400 mb-1">Response Time</p>
            <p className="text-lg font-bold text-white">{app.avgResponseTime}ms</p>
          </div>
          <div className="backdrop-blur-sm bg-white/5 rounded-lg p-3 border border-white/10">
            <p className="text-xs text-slate-400 mb-1">Revenue</p>
            <p className="text-lg font-bold text-green-400">${(app.revenue / 1000).toFixed(0)}K</p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-400">CPU Usage</span>
            <span className="text-white font-medium">{Math.floor(Math.random() * 30 + 20)}%</span>
          </div>
          <div className="h-2 bg-white/5 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.floor(Math.random() * 30 + 20)}%` }}
              className="h-full bg-gradient-to-r from-blue-500 to-cyan-500"
            />
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-400">Memory Usage</span>
            <span className="text-white font-medium">{Math.floor(Math.random() * 40 + 30)}%</span>
          </div>
          <div className="h-2 bg-white/5 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.floor(Math.random() * 40 + 30)}%` }}
              className="h-full bg-gradient-to-r from-purple-500 to-violet-500"
            />
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold flex items-center gap-2">
            <Boxes className="w-8 h-8 text-blue-400" />
            Gestión de Aplicaciones
          </h2>
          <p className="text-slate-400 mt-1">
            Control total sobre todas las aplicaciones del ecosistema
          </p>
        </div>
        <div className="flex gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-medium flex items-center gap-2"
          >
            <Play className="w-4 h-4" />
            Start All
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white font-medium flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </motion.button>
        </div>
      </div>

      <div className="space-y-4">
        {apps.map((app, index) => (
          <AppControlCard key={app.id} app={app} index={index} />
        ))}
      </div>
    </motion.div>
  );
};

// Analytics Section
const AnalyticsView = () => {
  const COLORS = ['#ec4899', '#8b5cf6', '#06b6d4', '#10b981'];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-3xl font-bold flex items-center gap-2">
          <BarChart3 className="w-8 h-8 text-purple-400" />
          Analytics Dashboard
        </h2>
        <p className="text-slate-400 mt-1">Análisis detallado del rendimiento del ecosistema</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          {
            label: 'Total Revenue',
            value: '$2.8M',
            change: '+12.5%',
            icon: DollarSign,
            color: 'from-green-500 to-emerald-500',
          },
          {
            label: 'Total Users',
            value: '3,892',
            change: '+15.2%',
            icon: Users,
            color: 'from-blue-500 to-cyan-500',
          },
          {
            label: 'Active Apps',
            value: '4/5',
            change: '80%',
            icon: Boxes,
            color: 'from-purple-500 to-violet-500',
          },
          {
            label: 'Avg Response',
            value: '328ms',
            change: '-8.3%',
            icon: Zap,
            color: 'from-orange-500 to-amber-500',
          },
        ].map((kpi, index) => (
          <motion.div
            key={`item-${index}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.05, y: -4 }}
            className="backdrop-blur-xl bg-slate-950/60 rounded-2xl p-6 border border-pink-500/20"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`p-3 rounded-xl bg-gradient-to-br ${kpi.color}`}>
                <kpi.icon className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs text-green-400 font-medium">{kpi.change}</span>
            </div>
            <p className="text-sm text-slate-400 mb-1">{kpi.label}</p>
            <p className="text-2xl font-bold text-white">{kpi.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Growth Chart */}
        <div className="backdrop-blur-xl bg-slate-950/60 rounded-2xl p-6 border border-pink-500/20">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-400" />
            Crecimiento de Usuarios
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={analyticsData.userGrowth}>
              <defs>
                <linearGradient id="userGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="month" stroke="#666" />
              <YAxis stroke="#666" />
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #ec4899' }} />
              <Legend />
              <Area
                type="monotone"
                dataKey="users"
                fill="url(#userGradient)"
                stroke="#3b82f6"
                name="Total Users"
              />
              <Line
                type="monotone"
                dataKey="activeUsers"
                stroke="#10b981"
                name="Active Users"
                strokeWidth={2}
              />
              <Bar dataKey="newUsers" fill="#8b5cf6" name="New Users" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* App Usage Pie Chart */}
        <div className="backdrop-blur-xl bg-slate-950/60 rounded-2xl p-6 border border-pink-500/20">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <PieChart className="w-5 h-5 text-purple-400" />
            Distribución de Uso por App
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <RechartsPie>
              <Pie
                data={analyticsData.appUsage}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {analyticsData.appUsage.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #ec4899' }} />
            </RechartsPie>
          </ResponsiveContainer>
        </div>

        {/* Revenue by App */}
        <div className="backdrop-blur-xl bg-slate-950/60 rounded-2xl p-6 border border-pink-500/20 lg:col-span-2">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-green-400" />
            Revenue por Aplicación
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analyticsData.revenueByApp}>
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.3} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="name" stroke="#666" />
              <YAxis stroke="#666" />
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #ec4899' }} />
              <Legend />
              <Bar
                dataKey="revenue"
                fill="url(#revenueGradient)"
                name="Revenue ($)"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </motion.div>
  );
};

// Network Section
const NetworkView = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-3xl font-bold flex items-center gap-2">
          <Network className="w-8 h-8 text-green-400" />
          Network & Connections
        </h2>
        <p className="text-slate-400 mt-1">Monitoreo en tiempo real de la red y conexiones</p>
      </div>

      {/* Network Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'Network Status', value: 'Online', status: 'good', icon: Wifi },
          { label: 'Total Bandwidth', value: '14.9 Gbps', status: 'good', icon: Activity },
          { label: 'Avg Latency', value: '18ms', status: 'good', icon: Zap },
        ].map((stat, index) => (
          <motion.div
            key={`item-${index}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="backdrop-blur-xl bg-slate-950/60 rounded-2xl p-6 border border-pink-500/20"
          >
            <div className="flex items-center justify-between mb-3">
              <stat.icon className="w-8 h-8 text-green-400" />
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
            </div>
            <p className="text-sm text-slate-400 mb-1">{stat.label}</p>
            <p className="text-2xl font-bold text-white">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Active Connections */}
      <div className="backdrop-blur-xl bg-slate-950/60 rounded-2xl p-6 border border-pink-500/20">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Server className="w-5 h-5 text-green-400" />
          Conexiones Activas
        </h3>
        <div className="space-y-3">
          {networkData.connections.map((conn, index) => (
            <motion.div
              key={conn.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="p-2 rounded-lg bg-green-500/20">
                  <Network className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <p className="font-medium text-white">{conn.source}</p>
                  <p className="text-sm text-slate-400">→ {conn.target}</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <p className="text-xs text-slate-400">Latency</p>
                  <p className="text-sm font-medium text-white">{conn.latency}ms</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-400">Bandwidth</p>
                  <p className="text-sm font-medium text-white">{conn.bandwidth}</p>
                </div>
                <div
                  className={`w-2 h-2 rounded-full ${conn.status === 'active' ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Network Traffic Chart */}
      <div className="backdrop-blur-xl bg-slate-950/60 rounded-2xl p-6 border border-pink-500/20">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5 text-green-400" />
          Tráfico de Red
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={networkData.traffic}>
            <defs>
              <linearGradient id="incoming" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="outgoing" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <XAxis dataKey="time" stroke="#666" />
            <YAxis stroke="#666" />
            <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #ec4899' }} />
            <Legend />
            <Area
              type="monotone"
              dataKey="incoming"
              stroke="#10b981"
              fill="url(#incoming)"
              name="Incoming (Mbps)"
            />
            <Area
              type="monotone"
              dataKey="outgoing"
              stroke="#3b82f6"
              fill="url(#outgoing)"
              name="Outgoing (Mbps)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

// Performance Section
const PerformanceView = () => {
  const [liveData, setLiveData] = useState(performanceData);

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveData((prev) => {
        const newData = [
          ...prev.slice(1),
          {
            time: new Date().toLocaleTimeString(),
            cpu: Math.floor(Math.random() * 30 + 30),
            ram: Math.floor(Math.random() * 30 + 50),
            network: Math.floor(Math.random() * 20 + 70),
            db: Math.floor(Math.random() * 30 + 25),
          },
        ];
        return newData;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const currentMetrics = liveData[liveData.length - 1];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold flex items-center gap-2">
            <Activity className="w-8 h-8 text-cyan-400" />
            Performance Monitoring
          </h2>
          <p className="text-slate-400 mt-1">
            Monitoreo en tiempo real del rendimiento del sistema
          </p>
        </div>
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-red-500 to-orange-500"
        >
          <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
          <span className="text-white font-medium">LIVE</span>
        </motion.div>
      </div>

      {/* Real-time Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          {
            label: 'CPU Usage',
            value: currentMetrics.cpu,
            icon: Cpu,
            color: 'from-pink-500 to-rose-500',
            unit: '%',
          },
          {
            label: 'RAM Usage',
            value: currentMetrics.ram,
            icon: HardDrive,
            color: 'from-purple-500 to-violet-500',
            unit: '%',
          },
          {
            label: 'Network Load',
            value: currentMetrics.network,
            icon: Wifi,
            color: 'from-blue-500 to-cyan-500',
            unit: '%',
          },
          {
            label: 'DB Connections',
            value: currentMetrics.db,
            icon: Database,
            color: 'from-green-500 to-emerald-500',
            unit: '%',
          },
        ].map((metric, index) => (
          <motion.div
            key={`item-${index}`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="backdrop-blur-xl bg-slate-950/60 rounded-2xl p-6 border border-pink-500/20"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl bg-gradient-to-br ${metric.color}`}>
                <metric.icon className="w-6 h-6 text-white" />
              </div>
              <motion.span
                key={metric.value}
                initial={{ scale: 1.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-2xl font-bold text-white"
              >
                {metric.value}
                {metric.unit}
              </motion.span>
            </div>
            <p className="text-sm text-slate-400 mb-2">{metric.label}</p>
            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
              <motion.div
                animate={{ width: `${metric.value}%` }}
                className={`h-full bg-gradient-to-r ${metric.color}`}
                transition={{ duration: 0.5 }}
              />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Live Performance Chart */}
      <div className="backdrop-blur-xl bg-slate-950/60 rounded-2xl p-6 border border-pink-500/20">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-cyan-400" />
          Live Performance Metrics
        </h3>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={liveData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <XAxis dataKey="time" stroke="#666" />
            <YAxis stroke="#666" />
            <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #ec4899' }} />
            <Legend />
            <Line
              type="monotone"
              dataKey="cpu"
              stroke="#ec4899"
              strokeWidth={2}
              name="CPU %"
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="ram"
              stroke="#8b5cf6"
              strokeWidth={2}
              name="RAM %"
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="network"
              stroke="#06b6d4"
              strokeWidth={2}
              name="Network %"
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="db"
              stroke="#10b981"
              strokeWidth={2}
              name="DB %"
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* System Resources */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="backdrop-blur-xl bg-slate-950/60 rounded-2xl p-6 border border-pink-500/20">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Server className="w-5 h-5 text-blue-400" />
            Server Resources
          </h3>
          <div className="space-y-4">
            {[
              { label: 'CPU Cores', value: '16 cores', usage: '42%' },
              { label: 'Total RAM', value: '64 GB', usage: '68%' },
              { label: 'Disk Space', value: '2 TB', usage: '45%' },
              { label: 'Network I/O', value: '10 Gbps', usage: '85%' },
            ].map((resource, index) => (
              <div key={`item-${index}`} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">{resource.label}</span>
                  <span className="text-white font-medium">
                    {resource.value} • {resource.usage}
                  </span>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: resource.usage }}
                    className="h-full bg-gradient-to-r from-cyan-500 to-blue-500"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="backdrop-blur-xl bg-slate-950/60 rounded-2xl p-6 border border-pink-500/20">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-green-400" />
            Process Monitor
          </h3>
          <div className="space-y-3">
            {[
              { name: 'FlowDistributor API', cpu: 12, mem: 1.2 },
              { name: 'ShadowPrime Service', cpu: 8, mem: 0.9 },
              { name: 'Apollo Controller', cpu: 15, mem: 1.5 },
              { name: 'Synapse AI Engine', cpu: 22, mem: 2.8 },
              { name: 'Database Server', cpu: 18, mem: 3.2 },
            ].map((process, index) => (
              <div
                key={`item-${index}`}
                className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10"
              >
                <span className="text-white font-medium">{process.name}</span>
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-slate-400">
                    CPU: <span className="text-cyan-400">{process.cpu}%</span>
                  </span>
                  <span className="text-slate-400">
                    MEM: <span className="text-purple-400">{process.mem} GB</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Alerts Section
const AlertsView = () => {
  const [alerts, setAlerts] = useState(alertsData);
  const [filter, setFilter] = useState('all');

  const filteredAlerts =
    filter === 'all' ? alerts : alerts.filter((alert) => alert.status === filter);

  const alertColors = {
    error: 'from-red-500 to-rose-500',
    warning: 'from-orange-500 to-amber-500',
    info: 'from-blue-500 to-cyan-500',
    success: 'from-green-500 to-emerald-500',
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold flex items-center gap-2">
            <Bell className="w-8 h-8 text-orange-400" />
            System Alerts
          </h2>
          <p className="text-slate-400 mt-1">Gestión de alertas y notificaciones del sistema</p>
        </div>
        <div className="flex gap-2">
          {['all', 'active', 'resolved'].map((status) => (
            <motion.button
              key={status}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-xl font-medium transition-all ${
                filter === status
                  ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white'
                  : 'bg-white/5 text-slate-400 hover:bg-white/10'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Alert Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          {
            label: 'Active Alerts',
            value: alerts.filter((a) => a.status === 'active').length,
            icon: AlertTriangle,
            color: 'from-red-500 to-rose-500',
          },
          {
            label: 'Resolved',
            value: alerts.filter((a) => a.status === 'resolved').length,
            icon: CheckCircle,
            color: 'from-green-500 to-emerald-500',
          },
          {
            label: 'High Severity',
            value: alerts.filter((a) => a.severity === 'high').length,
            icon: XCircle,
            color: 'from-orange-500 to-amber-500',
          },
          {
            label: 'Total Alerts',
            value: alerts.length,
            icon: Bell,
            color: 'from-blue-500 to-cyan-500',
          },
        ].map((stat, index) => (
          <motion.div
            key={`item-${index}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="backdrop-blur-xl bg-slate-950/60 rounded-2xl p-6 border border-pink-500/20"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color}`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
            <p className="text-sm text-slate-400 mb-1">{stat.label}</p>
            <p className="text-2xl font-bold text-white">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Alerts List */}
      <div className="backdrop-blur-xl bg-slate-950/60 rounded-2xl p-6 border border-pink-500/20">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-orange-400" />
          Recent Alerts
        </h3>
        <div className="space-y-3">
          {filteredAlerts.map((alert, index) => {
            const Icon = alert.icon;
            return (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="relative overflow-hidden rounded-xl border border-white/10 hover:border-white/20 transition-all"
              >
                <div
                  className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b ${alertColors[alert.type]}`}
                />
                <div className="flex items-center justify-between p-4 pl-6">
                  <div className="flex items-center gap-4">
                    <div
                      className={`p-2 rounded-lg bg-gradient-to-br ${alertColors[alert.type]} bg-opacity-20`}
                    >
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-white mb-1">{alert.message}</p>
                      <div className="flex items-center gap-3 text-xs text-slate-400">
                        <span>{alert.app}</span>
                        <span>•</span>
                        <span>{alert.timestamp}</span>
                        <span>•</span>
                        <span
                          className={`px-2 py-0.5 rounded-full ${
                            alert.severity === 'high'
                              ? 'bg-red-500/20 text-red-400'
                              : alert.severity === 'medium'
                                ? 'bg-orange-500/20 text-orange-400'
                                : 'bg-blue-500/20 text-blue-400'
                          }`}
                        >
                          {alert.severity}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        alert.status === 'active'
                          ? 'bg-red-500/20 text-red-400'
                          : 'bg-green-500/20 text-green-400'
                      }`}
                    >
                      {alert.status}
                    </span>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                    >
                      <Eye className="w-4 h-4 text-slate-400" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};

// Settings Section
const SettingsView = () => {
  const [settings, setSettings] = useState({
    notifications: true,
    autoBackup: true,
    darkMode: true,
    analytics: true,
    twoFactor: false,
    maintenance: false,
  });

  const toggleSetting = (key) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-3xl font-bold flex items-center gap-2">
          <Settings className="w-8 h-8 text-slate-400" />
          System Settings
        </h2>
        <p className="text-slate-400 mt-1">Configuración general del ecosistema</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* General Settings */}
        <div className="backdrop-blur-xl bg-slate-950/60 rounded-2xl p-6 border border-pink-500/20">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-pink-400" />
            General
          </h3>
          <div className="space-y-4">
            {[
              {
                key: 'notifications',
                label: 'Enable Notifications',
                description: 'Receive system notifications',
              },
              { key: 'autoBackup', label: 'Auto Backup', description: 'Automatic daily backups' },
              { key: 'darkMode', label: 'Dark Mode', description: 'Use dark theme' },
              {
                key: 'analytics',
                label: 'Analytics Tracking',
                description: 'Track system analytics',
              },
            ].map((setting, index) => (
              <motion.div
                key={setting.key}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10"
              >
                <div>
                  <p className="font-medium text-white">{setting.label}</p>
                  <p className="text-sm text-slate-400">{setting.description}</p>
                </div>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => toggleSetting(setting.key)}
                  className={`relative w-14 h-7 rounded-full transition-colors ${
                    settings[setting.key]
                      ? 'bg-gradient-to-r from-pink-500 to-rose-500'
                      : 'bg-slate-700'
                  }`}
                >
                  <motion.div
                    animate={{ x: settings[setting.key] ? 28 : 2 }}
                    className="absolute top-1 w-5 h-5 bg-white rounded-full shadow-lg"
                  />
                </motion.button>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Security Settings */}
        <div className="backdrop-blur-xl bg-slate-950/60 rounded-2xl p-6 border border-pink-500/20">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-400" />
            Security
          </h3>
          <div className="space-y-4">
            {[
              {
                key: 'twoFactor',
                label: 'Two-Factor Authentication',
                description: 'Add extra security layer',
              },
              {
                key: 'maintenance',
                label: 'Maintenance Mode',
                description: 'Enable maintenance mode',
              },
            ].map((setting, index) => (
              <motion.div
                key={setting.key}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10"
              >
                <div>
                  <p className="font-medium text-white">{setting.label}</p>
                  <p className="text-sm text-slate-400">{setting.description}</p>
                </div>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => toggleSetting(setting.key)}
                  className={`relative w-14 h-7 rounded-full transition-colors ${
                    settings[setting.key]
                      ? 'bg-gradient-to-r from-pink-500 to-rose-500'
                      : 'bg-slate-700'
                  }`}
                >
                  <motion.div
                    animate={{ x: settings[setting.key] ? 28 : 2 }}
                    className="absolute top-1 w-5 h-5 bg-white rounded-full shadow-lg"
                  />
                </motion.button>
              </motion.div>
            ))}
          </div>
        </div>

        {/* System Info */}
        <div className="backdrop-blur-xl bg-slate-950/60 rounded-2xl p-6 border border-pink-500/20">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Info className="w-5 h-5 text-cyan-400" />
            System Information
          </h3>
          <div className="space-y-3">
            {[
              { label: 'Version', value: 'v2.4.1' },
              { label: 'Environment', value: 'Production' },
              { label: 'Database', value: 'PostgreSQL 15.2' },
              { label: 'Node Version', value: 'v18.16.0' },
              { label: 'Uptime', value: '45 days 12 hours' },
              { label: 'Last Backup', value: '2 hours ago' },
            ].map((info, index) => (
              <div
                key={`item-${index}`}
                className="flex items-center justify-between p-3 rounded-lg bg-white/5"
              >
                <span className="text-slate-400">{info.label}</span>
                <span className="text-white font-medium">{info.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="backdrop-blur-xl bg-slate-950/60 rounded-2xl p-6 border border-pink-500/20">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-400" />
            Actions
          </h3>
          <div className="space-y-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full p-4 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white font-medium flex items-center justify-center gap-2"
            >
              <Save className="w-5 h-5" />
              Save Configuration
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full p-4 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-medium flex items-center justify-center gap-2"
            >
              <Download className="w-5 h-5" />
              Export Settings
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full p-4 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-medium flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-5 h-5" />
              Restart System
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full p-4 rounded-xl bg-gradient-to-r from-red-500 to-rose-500 text-white font-medium flex items-center justify-center gap-2"
            >
              <AlertTriangle className="w-5 h-5" />
              Clear All Data
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Main Component
export default function Nexus() {
  const [activeSection, setActiveSection] = useLocalStorage('nexus_active_section', 'dashboard');
  const [isCollapsed, setIsCollapsed] = useLocalStorage(STORAGE_KEYS.SIDEBAR_STATE, false);
  const navigate = useNavigate();

  const renderSection = () => {
    switch (activeSection) {
      case 'dashboard':
        return <DashboardView apps={appsStatus} navigate={navigate} />;
      case 'apps':
        return <AppsView apps={appsStatus} navigate={navigate} />;
      case 'analytics':
        return <AnalyticsView />;
      case 'network':
        return <NetworkView />;
      case 'performance':
        return <PerformanceView />;
      case 'alerts':
        return <AlertsView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <DashboardView apps={appsStatus} navigate={navigate} />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-950 overflow-hidden relative">
      {/* Cursor glow effect */}
      <CursorGlow />

      {/* Animated grid background */}
      <div className="absolute inset-0 opacity-20">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'linear-gradient(rgba(236, 72, 153, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(236, 72, 153, 0.1) 1px, transparent 1px)',
            backgroundSize: '50px 50px',
          }}
        />
      </div>

      <Sidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
      />

      <div
        className="flex-1 flex flex-col overflow-hidden relative"
        style={{ marginLeft: isCollapsed ? 80 : 320 }}
      >
        {/* Header Premium */}
        <header className="relative backdrop-blur-xl bg-slate-950/80 border-b border-pink-500/20 p-6 z-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between"
          >
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-pink-400 via-rose-400 to-red-400 bg-clip-text text-transparent capitalize">
                {activeSection === 'dashboard' ? 'Mission Control' : activeSection}
              </h2>
              <p className="text-slate-400 mt-1">Centro de comando del ecosistema premium</p>
            </div>

            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all relative group"
              >
                <RefreshCw className="w-5 h-5" />
                <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-rose-500 rounded-xl opacity-0 group-hover:opacity-20 transition-opacity" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all relative group"
              >
                <Bell className="w-5 h-5" />
                <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-rose-500 rounded-xl opacity-0 group-hover:opacity-20 transition-opacity" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all relative group"
              >
                <Settings className="w-5 h-5" />
                <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-rose-500 rounded-xl opacity-0 group-hover:opacity-20 transition-opacity" />
              </motion.button>
            </div>
          </motion.div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-8 relative scrollbar-hide">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.05, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderSection()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* AI Assistant */}
      <AIAssistant
        systemName="Nexus"
        systemContext="Centro de control del ecosistema premium con analytics y monitoreo en tiempo real"
        accentColor="red"
        position="bottom-right"
      />
    </div>
  );
}
