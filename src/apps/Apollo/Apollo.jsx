import { useEffect, useRef, useState } from 'react';

import { AnimatePresence, motion, useMotionValue, useSpring } from 'framer-motion';
import {
  Activity,
  AlertCircle,
  Award,
  BarChart3,
  Battery,
  Bell,
  BellOff,
  Calendar,
  Camera,
  Car,
  CheckCircle,
  ChevronRight,
  Circle,
  CircuitBoard,
  Clock,
  CloudRain,
  Compass,
  Cpu,
  Crosshair,
  Database,
  Download,
  Edit,
  Eye,
  Filter,
  Flame,
  Gauge,
  Globe,
  HardDrive,
  Info,
  Layers,
  LineChart,
  Locate,
  Lock,
  Map,
  MapPin,
  MapPinned,
  Maximize2,
  Menu,
  Navigation,
  Navigation2,
  Package,
  Pause,
  PieChart,
  Plane,
  Play,
  Power,
  Radar,
  Radio,
  RefreshCw,
  Route,
  Satellite,
  Scan,
  Search,
  Settings,
  Shield,
  Signal,
  Sparkles,
  Square,
  Target,
  Thermometer,
  Trash2,
  TrendingDown,
  TrendingUp,
  Unlock,
  Upload,
  User,
  Users,
  Video,
  Wifi,
  WifiOff,
  Wind,
  X,
  XCircle,
  Zap,
} from 'lucide-react';

import AIAssistant from '../../components/shared/AIAssistant';
import { STORAGE_KEYS, useLocalStorage } from '../../utils/storage';

// Mock data de vehículos con GPS
const initialVehicles = [
  {
    id: 1,
    name: 'RAM 1500 Alpha',
    plate: 'ABC-1234',
    driver: 'Juan Pérez',
    status: 'moving',
    speed: 65,
    location: { lat: 25.6866, lng: -100.3161, address: 'Av. Constitución, Monterrey' },
    battery: 87,
    fuel: 75,
    lastUpdate: '2 min ago',
    color: 'from-blue-500 to-cyan-500',
    icon: '🚙',
    altitude: 540,
    heading: 145,
    odometer: 45230,
    engineTemp: 92,
  },
  {
    id: 2,
    name: 'RAM 2500 Bravo',
    plate: 'XYZ-5678',
    driver: 'María García',
    status: 'stopped',
    speed: 0,
    location: { lat: 25.675, lng: -100.309, address: 'Centro de Monterrey' },
    battery: 95,
    fuel: 90,
    lastUpdate: '5 min ago',
    color: 'from-green-500 to-emerald-500',
    icon: '🚗',
    altitude: 535,
    heading: 0,
    odometer: 32100,
    engineTemp: 85,
  },
  {
    id: 3,
    name: 'Silverado Charlie',
    plate: 'DEF-9012',
    driver: 'Carlos López',
    status: 'moving',
    speed: 45,
    location: { lat: 25.68, lng: -100.32, address: 'San Pedro Garza García' },
    battery: 72,
    fuel: 60,
    lastUpdate: '1 min ago',
    color: 'from-purple-500 to-pink-500',
    icon: '🚐',
    altitude: 550,
    heading: 280,
    odometer: 58900,
    engineTemp: 89,
  },
  {
    id: 4,
    name: 'F-150 Delta',
    plate: 'GHI-3456',
    driver: 'Ana Martínez',
    status: 'idle',
    speed: 0,
    location: { lat: 25.69, lng: -100.325, address: 'Santa Catarina' },
    battery: 45,
    fuel: 30,
    lastUpdate: '10 min ago',
    color: 'from-orange-500 to-red-500',
    icon: '🚕',
    altitude: 545,
    heading: 90,
    odometer: 67450,
    engineTemp: 78,
  },
];

// Mock data de drones
const initialDrones = [
  {
    id: 1,
    name: 'Drone Alpha',
    model: 'DJI Matrice 300',
    status: 'active',
    location: { lat: 25.685, lng: -100.318 },
    altitude: 120,
    battery: 78,
    camera: 'streaming',
    detections: 12,
    flightTime: '00:25:30',
    color: 'from-red-500 to-orange-500',
    speed: 15,
    heading: 180,
    signal: 95,
    temperature: 35,
    gpsAccuracy: 1.2,
  },
  {
    id: 2,
    name: 'Drone Beta',
    model: 'DJI Mavic 3',
    status: 'standby',
    location: { lat: 25.677, lng: -100.305 },
    altitude: 0,
    battery: 100,
    camera: 'offline',
    detections: 0,
    flightTime: '00:00:00',
    color: 'from-blue-500 to-cyan-500',
    speed: 0,
    heading: 0,
    signal: 100,
    temperature: 25,
    gpsAccuracy: 0.8,
  },
  {
    id: 3,
    name: 'Drone Gamma',
    model: 'Autel EVO II',
    status: 'active',
    location: { lat: 25.682, lng: -100.312 },
    altitude: 85,
    battery: 62,
    camera: 'streaming',
    detections: 8,
    flightTime: '00:18:45',
    color: 'from-purple-500 to-pink-500',
    speed: 12,
    heading: 90,
    signal: 88,
    temperature: 32,
    gpsAccuracy: 1.0,
  },
];

// Mock data de detecciones IA
const initialDetections = [
  {
    id: 1,
    type: 'person',
    confidence: 0.95,
    details: {
      age: '30-35',
      gender: 'male',
      clothing: 'Blue jacket, jeans',
      accessories: 'Backpack',
    },
    timestamp: '10:45:23',
    location: { lat: 25.685, lng: -100.318 },
    threat: 'low',
    droneId: 1,
    date: '2024-01-15',
  },
  {
    id: 2,
    type: 'vehicle',
    confidence: 0.89,
    details: {
      plate: 'Unknown',
      color: 'Black',
      model: 'Sedan',
      speed: '45 km/h',
    },
    timestamp: '10:44:18',
    location: { lat: 25.6845, lng: -100.3175 },
    threat: 'medium',
    droneId: 1,
    date: '2024-01-15',
  },
  {
    id: 3,
    type: 'person',
    confidence: 0.92,
    details: {
      age: '25-30',
      gender: 'female',
      clothing: 'Red dress',
      accessories: 'Handbag',
    },
    timestamp: '10:43:05',
    location: { lat: 25.682, lng: -100.312 },
    threat: 'low',
    droneId: 3,
    date: '2024-01-15',
  },
  {
    id: 4,
    type: 'weapon',
    confidence: 0.78,
    details: {
      weaponType: 'Handgun',
      carrier: 'Male adult',
      context: 'Public area',
    },
    timestamp: '10:40:12',
    location: { lat: 25.6855, lng: -100.3185 },
    threat: 'high',
    droneId: 1,
    date: '2024-01-15',
  },
  {
    id: 5,
    type: 'suspicious',
    confidence: 0.84,
    details: {
      activity: 'Loitering',
      duration: '15 minutes',
      persons: '3',
    },
    timestamp: '10:38:45',
    location: { lat: 25.6825, lng: -100.3125 },
    threat: 'medium',
    droneId: 3,
    date: '2024-01-15',
  },
];

// Mock alerts data
const initialAlerts = [
  {
    id: 1,
    type: 'critical',
    title: 'Weapon Detected',
    message: 'High confidence weapon detection in public area',
    timestamp: '10:40:12',
    read: false,
    source: 'Drone Alpha',
    location: 'Av. Constitución',
  },
  {
    id: 2,
    type: 'warning',
    title: 'Low Battery',
    message: 'F-150 Delta battery level below 50%',
    timestamp: '10:35:30',
    read: false,
    source: 'Vehicle GPS',
    location: 'Santa Catarina',
  },
  {
    id: 3,
    type: 'info',
    title: 'Drone Beta Ready',
    message: 'Drone Beta fully charged and ready for deployment',
    timestamp: '10:30:15',
    read: true,
    source: 'Drone Beta',
    location: 'Base Station',
  },
  {
    id: 4,
    type: 'warning',
    title: 'Suspicious Activity',
    message: 'Group loitering detected for 15+ minutes',
    timestamp: '10:28:45',
    read: false,
    source: 'Drone Gamma',
    location: 'San Pedro',
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
      <div className="w-full h-full bg-gradient-to-r from-green-500/20 via-emerald-500/20 to-cyan-500/20 blur-3xl rounded-full" />
    </motion.div>
  );
};

// Sidebar Premium
const Sidebar = ({ activeSection, setActiveSection, isCollapsed, setIsCollapsed }) => {
  const menuItems = [
    {
      id: 'map',
      icon: Map,
      label: 'Mapa Táctico',
      color: 'from-green-500 to-emerald-500',
      badge: null,
    },
    {
      id: 'vehicles',
      icon: Car,
      label: 'Vehículos GPS',
      color: 'from-blue-500 to-cyan-500',
      badge: 4,
    },
    {
      id: 'drones',
      icon: Radio,
      label: 'Control Drones',
      color: 'from-purple-500 to-pink-500',
      badge: 3,
    },
    {
      id: 'scanner',
      icon: Scan,
      label: 'Scanner IA',
      color: 'from-cyan-500 to-teal-500',
      badge: 'LIVE',
    },
    {
      id: 'detections',
      icon: Target,
      label: 'Detecciones',
      color: 'from-red-500 to-orange-500',
      badge: 12,
    },
    {
      id: 'analytics',
      icon: TrendingUp,
      label: 'Analytics',
      color: 'from-yellow-500 to-amber-500',
      badge: null,
    },
    {
      id: 'alerts',
      icon: AlertCircle,
      label: 'Alertas',
      color: 'from-orange-500 to-red-500',
      badge: 2,
    },
  ];

  return (
    <motion.aside
      animate={{ width: isCollapsed ? 80 : 320 }}
      className="fixed left-0 top-0 h-screen backdrop-blur-2xl bg-gradient-to-br from-slate-950/95 via-green-950/30 to-slate-950/95 border-r border-green-500/20 z-50 flex flex-col overflow-hidden"
    >
      {/* Animated background */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-transparent to-emerald-500/10" />
        <motion.div
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%'],
          }}
          transition={{ duration: 20, repeat: Infinity, repeatType: 'reverse' }}
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              'radial-gradient(circle at 50% 50%, rgba(16, 185, 129, 0.1) 0%, transparent 50%)',
            backgroundSize: '100% 100%',
          }}
        />
      </div>

      {/* Header */}
      <div className="relative p-6 border-b border-green-500/20">
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
                    '0 0 20px rgba(16, 185, 129, 0.5)',
                    '0 0 40px rgba(16, 185, 129, 0.8)',
                    '0 0 20px rgba(16, 185, 129, 0.5)',
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="relative"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 via-emerald-500 to-cyan-500 p-[2px]">
                  <div className="w-full h-full rounded-xl bg-slate-950 flex items-center justify-center">
                    <Radio className="w-6 h-6 text-green-400" />
                  </div>
                </div>
                <motion.div
                  animate={{ scale: [1, 1.5, 1], opacity: [1, 0, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full"
                />
              </motion.div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-green-400 via-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                  Apollo
                </h1>
                <p className="text-xs text-slate-400 flex items-center gap-1">
                  <Satellite className="w-3 h-3 text-green-400" />
                  Tactical Command
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
            <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg opacity-0 group-hover:opacity-20 transition-opacity" />
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
                              ? 'bg-green-500/20 text-green-400 border border-green-500/30'
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
      <div className="relative p-4 border-t border-green-500/20">
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
          >
            {/* System Status */}
            <div className="relative overflow-hidden rounded-xl p-4 bg-gradient-to-br from-green-500/10 via-emerald-500/10 to-cyan-500/10 border border-green-500/20">
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-slate-400">System Status</span>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-xs text-green-400 font-medium">ONLINE</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-slate-500">GPS:</span>
                    <span className="text-green-400 ml-1 font-medium">4 Active</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Drones:</span>
                    <span className="text-cyan-400 ml-1 font-medium">2 Flying</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.aside>
  );
};

// HUD Overlay Component
const HUDOverlay = ({ vehicles, drones, selectedVehicle, selectedDrone }) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none z-20">
      {/* Top HUD */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 pointer-events-auto">
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="backdrop-blur-xl bg-slate-950/80 border border-green-500/30 rounded-2xl px-6 py-3"
        >
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Satellite className="w-4 h-4 text-green-400" />
              <span className="text-sm font-mono text-green-400">{time.toLocaleTimeString()}</span>
            </div>
            <div className="w-px h-4 bg-green-500/30"></div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-cyan-400" />
              <span className="text-sm text-slate-400">Monterrey, MX</span>
            </div>
            <div className="w-px h-4 bg-green-500/30"></div>
            <div className="flex items-center gap-2">
              <Signal className="w-4 h-4 text-green-400 animate-pulse" />
              <span className="text-sm text-green-400 font-medium">CONNECTED</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Corner HUD Elements */}
      <div className="absolute top-4 right-4 pointer-events-auto">
        <motion.div
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="backdrop-blur-xl bg-slate-950/80 border border-green-500/30 rounded-xl p-4 space-y-2"
        >
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-green-400" />
            <span className="text-xs text-slate-400">NORTH</span>
          </div>
          <div className="text-2xl font-mono font-bold text-green-400">0°</div>
        </motion.div>
      </div>

      {/* Bottom Stats */}
      <div className="absolute bottom-4 left-4 right-4 pointer-events-auto">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="backdrop-blur-xl bg-slate-950/80 border border-green-500/30 rounded-2xl p-4"
        >
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center">
              <Car className="w-5 h-5 text-blue-400 mx-auto mb-1" />
              <div className="text-lg font-bold text-white">
                {vehicles.filter((v) => v.status === 'moving').length}
              </div>
              <div className="text-xs text-slate-400">En Movimiento</div>
            </div>
            <div className="text-center">
              <Radio className="w-5 h-5 text-purple-400 mx-auto mb-1" />
              <div className="text-lg font-bold text-white">
                {drones.filter((d) => d.status === 'active').length}
              </div>
              <div className="text-xs text-slate-400">Drones Activos</div>
            </div>
            <div className="text-center">
              <Target className="w-5 h-5 text-red-400 mx-auto mb-1" />
              <div className="text-lg font-bold text-white">
                {drones.reduce((acc, d) => acc + d.detections, 0)}
              </div>
              <div className="text-xs text-slate-400">Detecciones IA</div>
            </div>
            <div className="text-center">
              <Shield className="w-5 h-5 text-green-400 mx-auto mb-1" />
              <div className="text-lg font-bold text-white">98.5%</div>
              <div className="text-xs text-slate-400">Uptime</div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Crosshair Center */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        >
          <Crosshair className="w-12 h-12 text-green-400/30" />
        </motion.div>
      </div>

      {/* Scan Lines */}
      <motion.div
        animate={{ y: ['0%', '100%'] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
        className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-green-500/30 to-transparent"
      />
    </div>
  );
};

// Mapbox Integration Component
const MapboxView = ({ vehicles, drones, selectedVehicle, setSelectedVehicle }) => {
  const mapContainer = useRef(null);

  return (
    <div className="relative w-full h-full">
      {/* Map Container */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl overflow-hidden border border-green-500/20">
        {/* Simulated Mapbox with grid */}
        <div className="absolute inset-0">
          {/* Grid overlay */}
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage:
                'linear-gradient(rgba(16, 185, 129, 0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(16, 185, 129, 0.2) 1px, transparent 1px)',
              backgroundSize: '40px 40px',
            }}
          />

          {/* Glowing grid lines */}
          <svg className="absolute inset-0 w-full h-full">
            <defs>
              <linearGradient id="gridGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
                <stop offset="50%" stopColor="#06b6d4" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0.3" />
              </linearGradient>
            </defs>
            {[...Array(10)].map((_, i) => (
              <motion.line
                key={`h-${i}`}
                x1="0"
                y1={`${i * 10}%`}
                x2="100%"
                y2={`${i * 10}%`}
                stroke="url(#gridGlow)"
                strokeWidth="1"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2, delay: i * 0.1 }}
              />
            ))}
            {[...Array(10)].map((_, i) => (
              <motion.line
                key={`v-${i}`}
                x1={`${i * 10}%`}
                y1="0"
                x2={`${i * 10}%`}
                y2="100%"
                stroke="url(#gridGlow)"
                strokeWidth="1"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2, delay: i * 0.1 }}
              />
            ))}
          </svg>

          {/* Vehicle markers */}
          {vehicles.map((vehicle, index) => (
            <motion.div
              key={vehicle.id}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="absolute"
              style={{
                left: `${20 + index * 15}%`,
                top: `${30 + (index % 2) * 20}%`,
              }}
            >
              <motion.div
                animate={{
                  scale: vehicle.status === 'moving' ? [1, 1.3, 1] : 1,
                }}
                transition={{
                  duration: 2,
                  repeat: vehicle.status === 'moving' ? Infinity : 0,
                }}
                className="relative cursor-pointer group"
                onClick={() => setSelectedVehicle(vehicle)}
              >
                {/* Pulse ring for moving vehicles */}
                {vehicle.status === 'moving' && (
                  <motion.div
                    animate={{
                      scale: [1, 2, 1],
                      opacity: [0.5, 0, 0.5],
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute inset-0 rounded-full bg-green-500/30 -m-4"
                  />
                )}

                {/* Main marker */}
                <div
                  className={`relative p-4 rounded-2xl bg-gradient-to-br ${vehicle.color} shadow-2xl group-hover:shadow-green-500/50 transition-all`}
                >
                  <Car className="w-6 h-6 text-white" />
                </div>

                {/* Info tooltip */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileHover={{ opacity: 1, y: 0 }}
                  className="absolute top-full left-1/2 -translate-x-1/2 mt-2 backdrop-blur-xl bg-slate-950/90 border border-green-500/30 rounded-xl p-3 min-w-[200px] pointer-events-none"
                >
                  <div className="text-sm font-bold text-white mb-1">{vehicle.name}</div>
                  <div className="text-xs text-slate-400 space-y-1">
                    <div className="flex items-center gap-2">
                      <Navigation className="w-3 h-3" />
                      <span>{vehicle.speed} km/h</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Battery className="w-3 h-3" />
                      <span>{vehicle.battery}%</span>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
          ))}

          {/* Drone markers */}
          {drones.map((drone, index) => (
            <motion.div
              key={drone.id}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              className="absolute"
              style={{
                left: `${40 + index * 20}%`,
                top: `${15 + index * 15}%`,
              }}
            >
              <motion.div
                animate={{
                  y: drone.status === 'active' ? [-8, 8, -8] : 0,
                  rotate: drone.status === 'active' ? [0, 5, 0, -5, 0] : 0,
                }}
                transition={{
                  duration: 4,
                  repeat: drone.status === 'active' ? Infinity : 0,
                }}
                className="relative cursor-pointer group"
              >
                {/* Detection radius */}
                {drone.status === 'active' && (
                  <motion.div
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.3, 0, 0.3],
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="absolute inset-0 rounded-full bg-purple-500/20 -m-12 border-2 border-purple-500/30"
                  />
                )}

                {/* Main drone marker */}
                <div
                  className={`relative p-4 rounded-2xl bg-gradient-to-br ${drone.color} shadow-2xl`}
                >
                  <Radio className="w-6 h-6 text-white" />
                </div>

                {/* Altitude indicator */}
                <div className="absolute -top-2 -right-2 backdrop-blur-sm bg-slate-950/80 border border-purple-500/30 rounded-lg px-2 py-1">
                  <div className="text-xs text-purple-400 font-mono">{drone.altitude}m</div>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* HUD Overlay */}
      <HUDOverlay
        vehicles={vehicles}
        drones={drones}
        selectedVehicle={selectedVehicle}
        selectedDrone={null}
      />
    </div>
  );
};

// Main Map Section
const MapSection = ({ vehicles, drones }) => {
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="h-full space-y-6"
    >
      {/* Map View */}
      <div className="h-[calc(100vh-12rem)] relative">
        <MapboxView
          vehicles={vehicles}
          drones={drones}
          selectedVehicle={selectedVehicle}
          setSelectedVehicle={setSelectedVehicle}
        />
      </div>
    </motion.div>
  );
};

// Vehicles Section
const VehiclesSection = ({ vehicles }) => {
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [filter, setFilter] = useState('all');

  const filteredVehicles = vehicles.filter((v) => (filter === 'all' ? true : v.status === filter));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="h-full space-y-6"
    >
      {/* Filters */}
      <div className="flex items-center gap-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setFilter('all')}
          className={`px-6 py-3 rounded-xl font-medium transition-all ${
            filter === 'all'
              ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/50'
              : 'bg-white/5 text-slate-400 hover:bg-white/10'
          }`}
        >
          Todos ({vehicles.length})
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setFilter('moving')}
          className={`px-6 py-3 rounded-xl font-medium transition-all ${
            filter === 'moving'
              ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/50'
              : 'bg-white/5 text-slate-400 hover:bg-white/10'
          }`}
        >
          En Movimiento ({vehicles.filter((v) => v.status === 'moving').length})
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setFilter('stopped')}
          className={`px-6 py-3 rounded-xl font-medium transition-all ${
            filter === 'stopped'
              ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg shadow-orange-500/50'
              : 'bg-white/5 text-slate-400 hover:bg-white/10'
          }`}
        >
          Detenidos ({vehicles.filter((v) => v.status === 'stopped' || v.status === 'idle').length})
        </motion.button>
      </div>

      {/* Vehicle Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-18rem)] overflow-y-auto scrollbar-hide">
        {filteredVehicles.map((vehicle, index) => (
          <motion.div
            key={vehicle.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            onClick={() => setSelectedVehicle(vehicle)}
            className="relative backdrop-blur-xl bg-gradient-to-br from-slate-900/80 to-slate-800/80 border border-green-500/20 rounded-2xl p-6 cursor-pointer group overflow-hidden"
          >
            {/* Glow effect */}
            <div
              className={`absolute inset-0 bg-gradient-to-br ${vehicle.color} opacity-0 group-hover:opacity-10 transition-opacity`}
            />

            {/* Header */}
            <div className="relative flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${vehicle.color}`}>
                  <Car className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">{vehicle.name}</h3>
                  <p className="text-sm text-slate-400">{vehicle.plate}</p>
                </div>
              </div>
              <div
                className={`px-3 py-1 rounded-full text-xs font-bold ${
                  vehicle.status === 'moving'
                    ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                    : 'bg-slate-500/20 text-slate-400 border border-slate-500/30'
                }`}
              >
                {vehicle.status === 'moving' ? 'En Movimiento' : 'Detenido'}
              </div>
            </div>

            {/* Stats Grid */}
            <div className="relative grid grid-cols-2 gap-4 mb-4">
              <div className="backdrop-blur-sm bg-white/5 rounded-xl p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Navigation className="w-4 h-4 text-blue-400" />
                  <span className="text-xs text-slate-400">Velocidad</span>
                </div>
                <div className="text-xl font-bold text-white">{vehicle.speed} km/h</div>
              </div>
              <div className="backdrop-blur-sm bg-white/5 rounded-xl p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Battery className="w-4 h-4 text-green-400" />
                  <span className="text-xs text-slate-400">Batería</span>
                </div>
                <div className="text-xl font-bold text-white">{vehicle.battery}%</div>
              </div>
              <div className="backdrop-blur-sm bg-white/5 rounded-xl p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Zap className="w-4 h-4 text-yellow-400" />
                  <span className="text-xs text-slate-400">Combustible</span>
                </div>
                <div className="text-xl font-bold text-white">{vehicle.fuel}%</div>
              </div>
              <div className="backdrop-blur-sm bg-white/5 rounded-xl p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Thermometer className="w-4 h-4 text-red-400" />
                  <span className="text-xs text-slate-400">Temperatura</span>
                </div>
                <div className="text-xl font-bold text-white">{vehicle.engineTemp}°C</div>
              </div>
            </div>

            {/* Info */}
            <div className="relative space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <User className="w-4 h-4 text-slate-400" />
                <span className="text-slate-300">{vehicle.driver}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="w-4 h-4 text-slate-400" />
                <span className="text-slate-300">{vehicle.location.address}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4 text-slate-400" />
                <span className="text-slate-300">Actualizado hace {vehicle.lastUpdate}</span>
              </div>
            </div>

            {/* Action button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative w-full mt-4 px-4 py-2 rounded-xl bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 text-green-400 font-medium hover:from-green-500/30 hover:to-emerald-500/30 transition-all"
            >
              Ver en Mapa
            </motion.button>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

// Drones Section
const DronesSection = ({ drones }) => {
  const [selectedDrone, setSelectedDrone] = useState(null);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="h-full space-y-6"
    >
      {/* Drone Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {drones.map((drone, index) => (
          <motion.div
            key={drone.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="relative backdrop-blur-xl bg-gradient-to-br from-slate-900/80 to-slate-800/80 border border-purple-500/20 rounded-2xl p-6 overflow-hidden group"
          >
            {/* Animated background */}
            <div
              className={`absolute inset-0 bg-gradient-to-br ${drone.color} opacity-0 group-hover:opacity-10 transition-opacity`}
            />

            {/* Header */}
            <div className="relative mb-4">
              <div className="flex items-center justify-between mb-3">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${drone.color}`}>
                  <Radio className="w-6 h-6 text-white" />
                </div>
                <div
                  className={`px-3 py-1 rounded-full text-xs font-bold ${
                    drone.status === 'active'
                      ? 'bg-green-500/20 text-green-400 border border-green-500/30 animate-pulse'
                      : 'bg-slate-500/20 text-slate-400 border border-slate-500/30'
                  }`}
                >
                  {drone.status === 'active' ? 'ACTIVO' : 'STANDBY'}
                </div>
              </div>
              <h3 className="text-xl font-bold text-white">{drone.name}</h3>
              <p className="text-sm text-slate-400">{drone.model}</p>
            </div>

            {/* Stats */}
            <div className="relative space-y-3 mb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <Battery className="w-4 h-4" />
                  <span>Batería</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-2 bg-slate-700 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${drone.battery}%` }}
                      transition={{ delay: index * 0.1 + 0.3 }}
                      className={`h-full ${
                        drone.battery > 60
                          ? 'bg-green-500'
                          : drone.battery > 30
                            ? 'bg-yellow-500'
                            : 'bg-red-500'
                      }`}
                    />
                  </div>
                  <span className="text-sm font-bold text-white">{drone.battery}%</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <Compass className="w-4 h-4" />
                  <span>Altitud</span>
                </div>
                <span className="text-sm font-bold text-white">{drone.altitude}m</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <Wifi className="w-4 h-4" />
                  <span>Señal</span>
                </div>
                <span className="text-sm font-bold text-white">{drone.signal}%</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <Video className="w-4 h-4" />
                  <span>Cámara</span>
                </div>
                <span
                  className={`text-sm font-bold ${
                    drone.camera === 'streaming' ? 'text-green-400' : 'text-slate-500'
                  }`}
                >
                  {drone.camera === 'streaming' ? 'STREAMING' : 'OFFLINE'}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <Target className="w-4 h-4" />
                  <span>Detecciones</span>
                </div>
                <span className="text-sm font-bold text-green-400">{drone.detections}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <Clock className="w-4 h-4" />
                  <span>Tiempo de Vuelo</span>
                </div>
                <span className="text-sm font-mono text-white">{drone.flightTime}</span>
              </div>
            </div>

            {/* Controls */}
            <div className="relative grid grid-cols-3 gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`p-3 rounded-xl ${
                  drone.status === 'active'
                    ? 'bg-red-500/20 border border-red-500/30 text-red-400'
                    : 'bg-green-500/20 border border-green-500/30 text-green-400'
                } font-medium transition-all`}
              >
                {drone.status === 'active' ? (
                  <Pause className="w-4 h-4 mx-auto" />
                ) : (
                  <Play className="w-4 h-4 mx-auto" />
                )}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-3 rounded-xl bg-blue-500/20 border border-blue-500/30 text-blue-400 font-medium transition-all"
              >
                <Camera className="w-4 h-4 mx-auto" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-3 rounded-xl bg-purple-500/20 border border-purple-500/30 text-purple-400 font-medium transition-all"
              >
                <Locate className="w-4 h-4 mx-auto" />
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Camera Feeds */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {drones
          .filter((d) => d.camera === 'streaming')
          .map((drone, index) => (
            <motion.div
              key={drone.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative backdrop-blur-xl bg-gradient-to-br from-slate-900/80 to-slate-800/80 border border-purple-500/20 rounded-2xl p-6 overflow-hidden"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg bg-gradient-to-br ${drone.color}`}>
                    <Video className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">{drone.name}</h4>
                    <p className="text-xs text-slate-400">Live Feed</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="text-xs text-red-400 font-medium">LIVE</span>
                </div>
              </div>

              {/* Camera feed simulation */}
              <div className="relative aspect-video bg-slate-900/50 rounded-xl overflow-hidden border border-slate-700/50">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-800/50 to-slate-900/50" />

                {/* Crosshair overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                  >
                    <Crosshair className="w-24 h-24 text-green-400/30" />
                  </motion.div>
                </div>

                {/* HUD overlay */}
                <div className="absolute inset-0 p-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="text-xs font-mono text-green-400">ALT: {drone.altitude}m</div>
                      <div className="text-xs font-mono text-green-400">SPD: {drone.speed} m/s</div>
                      <div className="text-xs font-mono text-green-400">HDG: {drone.heading}°</div>
                    </div>
                    <div className="text-xs font-mono text-green-400">
                      {new Date().toLocaleTimeString()}
                    </div>
                  </div>
                </div>

                {/* Scan lines */}
                <motion.div
                  animate={{ y: ['0%', '100%'] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-green-500/50 to-transparent"
                />
              </div>
            </motion.div>
          ))}
      </div>
    </motion.div>
  );
};

// Scanner Section
const ScannerSection = ({ detections }) => {
  const [isScanning, setIsScanning] = useState(true);
  const [scanProgress, setScanProgress] = useState(0);

  useEffect(() => {
    if (isScanning) {
      const interval = setInterval(() => {
        setScanProgress((prev) => (prev + 1) % 100);
      }, 50);
      return () => clearInterval(interval);
    }
  }, [isScanning]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="h-full space-y-6"
    >
      {/* Scanner Control Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Scanner Display */}
        <div className="lg:col-span-2 relative backdrop-blur-xl bg-gradient-to-br from-slate-900/80 to-slate-800/80 border border-cyan-500/20 rounded-2xl p-6 overflow-hidden">
          {/* Animated background */}
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-teal-500/5" />

          {/* Scanner visualization */}
          <div className="relative aspect-square max-h-[500px] mx-auto">
            <div className="absolute inset-0 rounded-full border-2 border-cyan-500/30" />

            {/* Rotating scanner beam */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-0"
            >
              <div className="absolute top-1/2 left-1/2 w-1/2 h-px bg-gradient-to-r from-cyan-500 to-transparent origin-left" />
            </motion.div>

            {/* Detection points */}
            {detections.slice(0, 8).map((detection, index) => {
              const angle = (index / 8) * 360;
              const radius = 30 + Math.random() * 40;
              const x = 50 + radius * Math.cos((angle * Math.PI) / 180);
              const y = 50 + radius * Math.sin((angle * Math.PI) / 180);

              return (
                <motion.div
                  key={detection.id}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="absolute"
                  style={{
                    left: `${x}%`,
                    top: `${y}%`,
                    transform: 'translate(-50%, -50%)',
                  }}
                >
                  <motion.div
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [1, 0.5, 1],
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className={`w-4 h-4 rounded-full ${
                      detection.threat === 'high'
                        ? 'bg-red-500'
                        : detection.threat === 'medium'
                          ? 'bg-yellow-500'
                          : 'bg-green-500'
                    }`}
                  />
                </motion.div>
              );
            })}

            {/* Center crosshair */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <Crosshair className="w-12 h-12 text-cyan-400" />
            </div>

            {/* Range circles */}
            {[25, 50, 75].map((radius) => (
              <div
                key={radius}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-500/20"
                style={{
                  width: `${radius * 2}%`,
                  height: `${radius * 2}%`,
                }}
              />
            ))}
          </div>

          {/* Scan progress */}
          <div className="relative mt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-400">Escaneo en Progreso</span>
              <span className="text-sm font-mono text-cyan-400">{scanProgress}%</span>
            </div>
            <div className="w-full h-2 bg-slate-700/50 rounded-full overflow-hidden">
              <motion.div
                animate={{ width: `${scanProgress}%` }}
                className="h-full bg-gradient-to-r from-cyan-500 to-teal-500"
              />
            </div>
          </div>
        </div>

        {/* Scanner Stats */}
        <div className="space-y-4">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="backdrop-blur-xl bg-gradient-to-br from-slate-900/80 to-slate-800/80 border border-green-500/20 rounded-2xl p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Detecciones Seguras</h4>
                <p className="text-xs text-slate-400">Amenaza Baja</p>
              </div>
            </div>
            <div className="text-3xl font-bold text-green-400">
              {detections.filter((d) => d.threat === 'low').length}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="backdrop-blur-xl bg-gradient-to-br from-slate-900/80 to-slate-800/80 border border-yellow-500/20 rounded-2xl p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-yellow-500 to-amber-500">
                <AlertCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Sospechosas</h4>
                <p className="text-xs text-slate-400">Amenaza Media</p>
              </div>
            </div>
            <div className="text-3xl font-bold text-yellow-400">
              {detections.filter((d) => d.threat === 'medium').length}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="backdrop-blur-xl bg-gradient-to-br from-slate-900/80 to-slate-800/80 border border-red-500/20 rounded-2xl p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-red-500 to-orange-500">
                <XCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Críticas</h4>
                <p className="text-xs text-slate-400">Amenaza Alta</p>
              </div>
            </div>
            <div className="text-3xl font-bold text-red-400">
              {detections.filter((d) => d.threat === 'high').length}
            </div>
          </motion.div>

          {/* Scanner Control */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsScanning(!isScanning)}
            className={`w-full px-6 py-4 rounded-xl font-bold transition-all ${
              isScanning
                ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg shadow-red-500/50'
                : 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/50'
            }`}
          >
            {isScanning ? (
              <div className="flex items-center justify-center gap-2">
                <Pause className="w-5 h-5" />
                Pausar Escaneo
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <Play className="w-5 h-5" />
                Iniciar Escaneo
              </div>
            )}
          </motion.button>
        </div>
      </div>

      {/* Recent Detections */}
      <div className="backdrop-blur-xl bg-gradient-to-br from-slate-900/80 to-slate-800/80 border border-green-500/20 rounded-2xl p-6">
        <h3 className="text-xl font-bold text-white mb-4">Detecciones Recientes</h3>
        <div className="space-y-2">
          {detections.slice(0, 5).map((detection, index) => (
            <motion.div
              key={detection.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all"
            >
              <div
                className={`w-3 h-3 rounded-full ${
                  detection.threat === 'high'
                    ? 'bg-red-500'
                    : detection.threat === 'medium'
                      ? 'bg-yellow-500'
                      : 'bg-green-500'
                }`}
              />
              <div className="flex-1">
                <div className="text-sm font-medium text-white capitalize">{detection.type}</div>
                <div className="text-xs text-slate-400">{detection.timestamp}</div>
              </div>
              <div className="text-sm text-slate-300">
                Confianza: {(detection.confidence * 100).toFixed(0)}%
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

// Detections Section
const DetectionsSection = ({ detections }) => {
  const [filter, setFilter] = useState('all');
  const [selectedDetection, setSelectedDetection] = useState(null);

  const filteredDetections = detections.filter((d) =>
    filter === 'all' ? true : d.threat === filter
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="h-full space-y-6"
    >
      {/* Filters */}
      <div className="flex items-center gap-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setFilter('all')}
          className={`px-6 py-3 rounded-xl font-medium transition-all ${
            filter === 'all'
              ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/50'
              : 'bg-white/5 text-slate-400 hover:bg-white/10'
          }`}
        >
          Todas ({detections.length})
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setFilter('high')}
          className={`px-6 py-3 rounded-xl font-medium transition-all ${
            filter === 'high'
              ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg shadow-red-500/50'
              : 'bg-white/5 text-slate-400 hover:bg-white/10'
          }`}
        >
          Alta Amenaza ({detections.filter((d) => d.threat === 'high').length})
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setFilter('medium')}
          className={`px-6 py-3 rounded-xl font-medium transition-all ${
            filter === 'medium'
              ? 'bg-gradient-to-r from-yellow-500 to-amber-500 text-white shadow-lg shadow-yellow-500/50'
              : 'bg-white/5 text-slate-400 hover:bg-white/10'
          }`}
        >
          Media ({detections.filter((d) => d.threat === 'medium').length})
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setFilter('low')}
          className={`px-6 py-3 rounded-xl font-medium transition-all ${
            filter === 'low'
              ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/50'
              : 'bg-white/5 text-slate-400 hover:bg-white/10'
          }`}
        >
          Baja ({detections.filter((d) => d.threat === 'low').length})
        </motion.button>
      </div>

      {/* Detections List */}
      <div className="backdrop-blur-xl bg-gradient-to-br from-slate-900/80 to-slate-800/80 border border-green-500/20 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/5 border-b border-green-500/20">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-bold text-slate-300">Estado</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-slate-300">Tipo</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-slate-300">Confianza</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-slate-300">Amenaza</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-slate-300">Ubicación</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-slate-300">Hora</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-slate-300">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredDetections.map((detection, index) => (
                <motion.tr
                  key={detection.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-b border-white/5 hover:bg-white/5 transition-all"
                >
                  <td className="px-6 py-4">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        detection.threat === 'high'
                          ? 'bg-red-500 animate-pulse'
                          : detection.threat === 'medium'
                            ? 'bg-yellow-500'
                            : 'bg-green-500'
                      }`}
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {detection.type === 'person' && <User className="w-4 h-4 text-blue-400" />}
                      {detection.type === 'vehicle' && <Car className="w-4 h-4 text-purple-400" />}
                      {detection.type === 'weapon' && <Target className="w-4 h-4 text-red-400" />}
                      {detection.type === 'suspicious' && (
                        <AlertCircle className="w-4 h-4 text-yellow-400" />
                      )}
                      <span className="text-sm text-white capitalize">{detection.type}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 bg-slate-700/50 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-green-500 to-emerald-500"
                          style={{ width: `${detection.confidence * 100}%` }}
                        />
                      </div>
                      <span className="text-sm text-slate-300">
                        {(detection.confidence * 100).toFixed(0)}%
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        detection.threat === 'high'
                          ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                          : detection.threat === 'medium'
                            ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                            : 'bg-green-500/20 text-green-400 border border-green-500/30'
                      }`}
                    >
                      {detection.threat === 'high'
                        ? 'ALTA'
                        : detection.threat === 'medium'
                          ? 'MEDIA'
                          : 'BAJA'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-slate-300">
                      <MapPin className="w-4 h-4 text-slate-400" />
                      {detection.location.lat.toFixed(4)}, {detection.location.lng.toFixed(4)}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-slate-300">{detection.timestamp}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setSelectedDetection(detection)}
                        className="p-2 rounded-lg bg-blue-500/20 border border-blue-500/30 text-blue-400 hover:bg-blue-500/30 transition-all"
                      >
                        <Eye className="w-4 h-4" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2 rounded-lg bg-green-500/20 border border-green-500/30 text-green-400 hover:bg-green-500/30 transition-all"
                      >
                        <MapPin className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};

// Analytics Section
const AnalyticsSection = ({ vehicles, drones, detections }) => {
  const totalDetections = detections.length;
  const highThreat = detections.filter((d) => d.threat === 'high').length;
  const mediumThreat = detections.filter((d) => d.threat === 'medium').length;
  const lowThreat = detections.filter((d) => d.threat === 'low').length;

  const vehiclesMoving = vehicles.filter((v) => v.status === 'moving').length;
  const dronesActive = drones.filter((d) => d.status === 'active').length;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="h-full space-y-6 overflow-y-auto scrollbar-hide"
    >
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="backdrop-blur-xl bg-gradient-to-br from-blue-900/40 to-blue-800/40 border border-blue-500/20 rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500">
              <Car className="w-6 h-6 text-white" />
            </div>
            <TrendingUp className="w-5 h-5 text-blue-400" />
          </div>
          <div className="text-3xl font-bold text-white mb-2">{vehicles.length}</div>
          <div className="text-sm text-slate-400">Total Vehículos</div>
          <div className="mt-2 text-xs text-blue-400">{vehiclesMoving} en movimiento</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="backdrop-blur-xl bg-gradient-to-br from-purple-900/40 to-purple-800/40 border border-purple-500/20 rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500">
              <Radio className="w-6 h-6 text-white" />
            </div>
            <TrendingUp className="w-5 h-5 text-purple-400" />
          </div>
          <div className="text-3xl font-bold text-white mb-2">{drones.length}</div>
          <div className="text-sm text-slate-400">Total Drones</div>
          <div className="mt-2 text-xs text-purple-400">{dronesActive} activos</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="backdrop-blur-xl bg-gradient-to-br from-red-900/40 to-red-800/40 border border-red-500/20 rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-red-500 to-orange-500">
              <Target className="w-6 h-6 text-white" />
            </div>
            <TrendingUp className="w-5 h-5 text-red-400" />
          </div>
          <div className="text-3xl font-bold text-white mb-2">{totalDetections}</div>
          <div className="text-sm text-slate-400">Total Detecciones</div>
          <div className="mt-2 text-xs text-red-400">{highThreat} amenazas altas</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="backdrop-blur-xl bg-gradient-to-br from-green-900/40 to-green-800/40 border border-green-500/20 rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <TrendingUp className="w-5 h-5 text-green-400" />
          </div>
          <div className="text-3xl font-bold text-white mb-2">98.5%</div>
          <div className="text-sm text-slate-400">Uptime del Sistema</div>
          <div className="mt-2 text-xs text-green-400">Excelente rendimiento</div>
        </motion.div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Threat Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="backdrop-blur-xl bg-gradient-to-br from-slate-900/80 to-slate-800/80 border border-green-500/20 rounded-2xl p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-xl bg-gradient-to-br from-yellow-500 to-amber-500">
              <PieChart className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Distribución de Amenazas</h3>
              <p className="text-sm text-slate-400">Por nivel de peligrosidad</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-300">Alta Amenaza</span>
                <span className="text-sm font-bold text-red-400">
                  {highThreat} ({((highThreat / totalDetections) * 100).toFixed(0)}%)
                </span>
              </div>
              <div className="w-full h-3 bg-slate-700/50 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(highThreat / totalDetections) * 100}%` }}
                  transition={{ delay: 0.5 }}
                  className="h-full bg-gradient-to-r from-red-500 to-orange-500"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-300">Amenaza Media</span>
                <span className="text-sm font-bold text-yellow-400">
                  {mediumThreat} ({((mediumThreat / totalDetections) * 100).toFixed(0)}%)
                </span>
              </div>
              <div className="w-full h-3 bg-slate-700/50 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(mediumThreat / totalDetections) * 100}%` }}
                  transition={{ delay: 0.6 }}
                  className="h-full bg-gradient-to-r from-yellow-500 to-amber-500"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-300">Baja Amenaza</span>
                <span className="text-sm font-bold text-green-400">
                  {lowThreat} ({((lowThreat / totalDetections) * 100).toFixed(0)}%)
                </span>
              </div>
              <div className="w-full h-3 bg-slate-700/50 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(lowThreat / totalDetections) * 100}%` }}
                  transition={{ delay: 0.7 }}
                  className="h-full bg-gradient-to-r from-green-500 to-emerald-500"
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Vehicle Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="backdrop-blur-xl bg-gradient-to-br from-slate-900/80 to-slate-800/80 border border-green-500/20 rounded-2xl p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Estado de Vehículos</h3>
              <p className="text-sm text-slate-400">Por estado operativo</p>
            </div>
          </div>

          <div className="space-y-4">
            {['moving', 'stopped', 'idle'].map((status, index) => {
              const count = vehicles.filter((v) => v.status === status).length;
              const percentage = (count / vehicles.length) * 100;
              const colors = {
                moving: 'from-green-500 to-emerald-500',
                stopped: 'from-yellow-500 to-amber-500',
                idle: 'from-orange-500 to-red-500',
              };

              return (
                <div key={status}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-slate-300 capitalize">{status}</span>
                    <span className="text-sm font-bold text-white">
                      {count} ({percentage.toFixed(0)}%)
                    </span>
                  </div>
                  <div className="w-full h-3 bg-slate-700/50 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                      className={`h-full bg-gradient-to-r ${colors[status]}`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* Activity Timeline */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="backdrop-blur-xl bg-gradient-to-br from-slate-900/80 to-slate-800/80 border border-green-500/20 rounded-2xl p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500">
            <LineChart className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Actividad Reciente</h3>
            <p className="text-sm text-slate-400">Últimas 24 horas</p>
          </div>
        </div>

        <div className="space-y-3">
          {detections.slice(0, 6).map((detection, index) => (
            <motion.div
              key={detection.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 + index * 0.05 }}
              className="flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all"
            >
              <div
                className={`w-2 h-2 rounded-full ${
                  detection.threat === 'high'
                    ? 'bg-red-500'
                    : detection.threat === 'medium'
                      ? 'bg-yellow-500'
                      : 'bg-green-500'
                }`}
              />
              <div className="flex-1">
                <div className="text-sm font-medium text-white capitalize">
                  {detection.type} detectado
                </div>
                <div className="text-xs text-slate-400">
                  {detection.timestamp} - Confianza: {(detection.confidence * 100).toFixed(0)}%
                </div>
              </div>
              <div
                className={`px-3 py-1 rounded-full text-xs font-bold ${
                  detection.threat === 'high'
                    ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                    : detection.threat === 'medium'
                      ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                      : 'bg-green-500/20 text-green-400 border border-green-500/30'
                }`}
              >
                {detection.threat === 'high'
                  ? 'ALTA'
                  : detection.threat === 'medium'
                    ? 'MEDIA'
                    : 'BAJA'}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

// Alerts Section
const AlertsSection = ({ alerts: initialAlerts }) => {
  const [alerts, setAlerts] = useState(initialAlerts);
  const [filter, setFilter] = useState('all');

  const filteredAlerts = alerts.filter((a) => (filter === 'all' ? true : a.type === filter));

  const markAsRead = (id) => {
    setAlerts(alerts.map((a) => (a.id === id ? { ...a, read: true } : a)));
  };

  const deleteAlert = (id) => {
    setAlerts(alerts.filter((a) => a.id !== id));
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="h-full space-y-6"
    >
      {/* Alert Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="backdrop-blur-xl bg-gradient-to-br from-slate-900/80 to-slate-800/80 border border-green-500/20 rounded-2xl p-6"
        >
          <div className="flex items-center gap-3 mb-3">
            <Bell className="w-5 h-5 text-green-400" />
            <span className="text-sm text-slate-400">Total</span>
          </div>
          <div className="text-3xl font-bold text-white">{alerts.length}</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="backdrop-blur-xl bg-gradient-to-br from-red-900/40 to-red-800/40 border border-red-500/20 rounded-2xl p-6"
        >
          <div className="flex items-center gap-3 mb-3">
            <AlertCircle className="w-5 h-5 text-red-400" />
            <span className="text-sm text-slate-400">Críticas</span>
          </div>
          <div className="text-3xl font-bold text-white">
            {alerts.filter((a) => a.type === 'critical').length}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="backdrop-blur-xl bg-gradient-to-br from-yellow-900/40 to-yellow-800/40 border border-yellow-500/20 rounded-2xl p-6"
        >
          <div className="flex items-center gap-3 mb-3">
            <AlertCircle className="w-5 h-5 text-yellow-400" />
            <span className="text-sm text-slate-400">Advertencias</span>
          </div>
          <div className="text-3xl font-bold text-white">
            {alerts.filter((a) => a.type === 'warning').length}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="backdrop-blur-xl bg-gradient-to-br from-blue-900/40 to-blue-800/40 border border-blue-500/20 rounded-2xl p-6"
        >
          <div className="flex items-center gap-3 mb-3">
            <Info className="w-5 h-5 text-blue-400" />
            <span className="text-sm text-slate-400">Información</span>
          </div>
          <div className="text-3xl font-bold text-white">
            {alerts.filter((a) => a.type === 'info').length}
          </div>
        </motion.div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setFilter('all')}
          className={`px-6 py-3 rounded-xl font-medium transition-all ${
            filter === 'all'
              ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/50'
              : 'bg-white/5 text-slate-400 hover:bg-white/10'
          }`}
        >
          Todas
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setFilter('critical')}
          className={`px-6 py-3 rounded-xl font-medium transition-all ${
            filter === 'critical'
              ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg shadow-red-500/50'
              : 'bg-white/5 text-slate-400 hover:bg-white/10'
          }`}
        >
          Críticas
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setFilter('warning')}
          className={`px-6 py-3 rounded-xl font-medium transition-all ${
            filter === 'warning'
              ? 'bg-gradient-to-r from-yellow-500 to-amber-500 text-white shadow-lg shadow-yellow-500/50'
              : 'bg-white/5 text-slate-400 hover:bg-white/10'
          }`}
        >
          Advertencias
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setFilter('info')}
          className={`px-6 py-3 rounded-xl font-medium transition-all ${
            filter === 'info'
              ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/50'
              : 'bg-white/5 text-slate-400 hover:bg-white/10'
          }`}
        >
          Información
        </motion.button>
      </div>

      {/* Alerts List */}
      <div className="space-y-4 h-[calc(100vh-24rem)] overflow-y-auto scrollbar-hide">
        {filteredAlerts.map((alert, index) => (
          <motion.div
            key={alert.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`backdrop-blur-xl bg-gradient-to-br from-slate-900/80 to-slate-800/80 border rounded-2xl p-6 ${
              alert.type === 'critical'
                ? 'border-red-500/30'
                : alert.type === 'warning'
                  ? 'border-yellow-500/30'
                  : 'border-blue-500/30'
            } ${!alert.read ? 'bg-white/5' : ''}`}
          >
            <div className="flex items-start gap-4">
              <div
                className={`p-3 rounded-xl ${
                  alert.type === 'critical'
                    ? 'bg-gradient-to-br from-red-500 to-orange-500'
                    : alert.type === 'warning'
                      ? 'bg-gradient-to-br from-yellow-500 to-amber-500'
                      : 'bg-gradient-to-br from-blue-500 to-cyan-500'
                }`}
              >
                {alert.type === 'critical' && <AlertCircle className="w-6 h-6 text-white" />}
                {alert.type === 'warning' && <AlertCircle className="w-6 h-6 text-white" />}
                {alert.type === 'info' && <Info className="w-6 h-6 text-white" />}
              </div>

              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="text-lg font-bold text-white mb-1">{alert.title}</h4>
                    <p className="text-sm text-slate-300">{alert.message}</p>
                  </div>
                  {!alert.read && (
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                  )}
                </div>

                <div className="flex items-center gap-4 text-xs text-slate-400 mb-4">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {alert.timestamp}
                  </div>
                  <div className="flex items-center gap-1">
                    <Radio className="w-3 h-3" />
                    {alert.source}
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {alert.location}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {!alert.read && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => markAsRead(alert.id)}
                      className="px-4 py-2 rounded-xl bg-green-500/20 border border-green-500/30 text-green-400 hover:bg-green-500/30 transition-all text-sm font-medium"
                    >
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" />
                        Marcar como leída
                      </div>
                    </motion.button>
                  )}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 rounded-xl bg-blue-500/20 border border-blue-500/30 text-blue-400 hover:bg-blue-500/30 transition-all text-sm font-medium"
                  >
                    <div className="flex items-center gap-2">
                      <Eye className="w-4 h-4" />
                      Ver detalles
                    </div>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => deleteAlert(alert.id)}
                    className="px-4 py-2 rounded-xl bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30 transition-all text-sm font-medium"
                  >
                    <div className="flex items-center gap-2">
                      <Trash2 className="w-4 h-4" />
                      Eliminar
                    </div>
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

// Main Component
export default function Apollo() {
  const [activeSection, setActiveSection] = useLocalStorage('apollo_active_section', 'map');
  const [isCollapsed, setIsCollapsed] = useLocalStorage(STORAGE_KEYS.SIDEBAR_STATE, false);
  const [vehicles, setVehicles] = useLocalStorage(STORAGE_KEYS.APOLLO_VEHICLES, initialVehicles);
  const [drones, setDrones] = useLocalStorage(STORAGE_KEYS.APOLLO_DRONES, initialDrones);
  const [detections, setDetections] = useLocalStorage(
    STORAGE_KEYS.APOLLO_DETECTIONS,
    initialDetections
  );
  const [alerts, setAlerts] = useState(initialAlerts);

  const renderSection = () => {
    switch (activeSection) {
      case 'map':
        return <MapSection vehicles={vehicles} drones={drones} />;
      case 'vehicles':
        return <VehiclesSection vehicles={vehicles} />;
      case 'drones':
        return <DronesSection drones={drones} />;
      case 'scanner':
        return <ScannerSection detections={detections} />;
      case 'detections':
        return <DetectionsSection detections={detections} />;
      case 'analytics':
        return <AnalyticsSection vehicles={vehicles} drones={drones} detections={detections} />;
      case 'alerts':
        return <AlertsSection alerts={alerts} />;
      default:
        return <MapSection vehicles={vehicles} drones={drones} />;
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
              'linear-gradient(rgba(16, 185, 129, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(16, 185, 129, 0.1) 1px, transparent 1px)',
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
        <header className="relative backdrop-blur-xl bg-slate-950/80 border-b border-green-500/20 p-6 z-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between"
          >
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-green-400 via-emerald-400 to-cyan-400 bg-clip-text text-transparent capitalize">
                {activeSection === 'map'
                  ? 'Mapa Táctico'
                  : activeSection === 'vehicles'
                    ? 'Vehículos GPS'
                    : activeSection === 'drones'
                      ? 'Control Drones'
                      : activeSection === 'scanner'
                        ? 'Scanner IA'
                        : activeSection === 'detections'
                          ? 'Detecciones'
                          : activeSection === 'analytics'
                            ? 'Analytics'
                            : 'Alertas'}
              </h2>
              <p className="text-slate-400 mt-1">
                Control táctico de vehículos y drones en tiempo real
              </p>
            </div>

            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all relative group"
              >
                <RefreshCw className="w-5 h-5" />
                <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl opacity-0 group-hover:opacity-20 transition-opacity" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all relative group"
              >
                <Layers className="w-5 h-5" />
                <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl opacity-0 group-hover:opacity-20 transition-opacity" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all relative group"
              >
                <Settings className="w-5 h-5" />
                <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl opacity-0 group-hover:opacity-20 transition-opacity" />
              </motion.button>
            </div>
          </motion.div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-hidden p-8 relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.05, y: -20 }}
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              {renderSection()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* AI Assistant */}
      <AIAssistant
        systemName="Apollo"
        systemContext="Sistema de control táctico GPS, drones y detección IA en tiempo real"
        accentColor="green"
        position="bottom-right"
      />
    </div>
  );
}
