import React, { useState, useEffect, useRef } from 'react';
import {
  Activity,
  Bell,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  Zap,
  Eye,
  Filter,
  Radio,
  Wifi
} from 'lucide-react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const Pulse = () => {
  const [activeTab, setActiveTab] = useState('events');
  const [events, setEvents] = useState([]);
  const [filters, setFilters] = useState({
    severity: 'all',
    type: 'all',
    status: 'all'
  });
  const eventStreamRef = useRef(null);

  // Estadísticas en tiempo real
  const [stats, setStats] = useState({
    totalEvents: 1247,
    criticalEvents: 12,
    warningEvents: 45,
    infoEvents: 890,
    avgResponseTime: 234,
    systemHealth: 98.5
  });

  // Datos de eventos por hora
  const eventData = [
    { time: '00:00', critical: 2, warning: 5, info: 120, success: 180 },
    { time: '04:00', critical: 1, warning: 8, info: 95, success: 150 },
    { time: '08:00', critical: 3, warning: 12, info: 180, success: 220 },
    { time: '12:00', critical: 4, warning: 15, info: 210, success: 250 },
    { time: '16:00', critical: 2, warning: 10, info: 165, success: 200 },
    { time: '20:00', critical: 1, warning: 6, info: 140, success: 170 }
  ];

  // Distribución de eventos
  const eventDistribution = [
    { name: 'Información', value: 890, color: '#3b82f6' },
    { name: 'Advertencias', value: 45, color: '#f59e0b' },
    { name: 'Críticos', value: 12, color: '#ef4444' },
    { name: 'Exitosos', value: 300, color: '#10b981' }
  ];

  // Tipos de eventos
  const eventTypes = [
    { type: 'Sistema', count: 423, trend: '+12%', color: 'blue' },
    { type: 'Red', count: 312, trend: '+8%', color: 'cyan' },
    { type: 'Seguridad', count: 178, trend: '-3%', color: 'red' },
    { type: 'Aplicación', count: 245, trend: '+15%', color: 'purple' },
    { type: 'Base de Datos', count: 89, trend: '+5%', color: 'green' }
  ];

  // Generar eventos en tiempo real
  const generateEvent = () => {
    const types = ['Sistema', 'Red', 'Seguridad', 'Aplicación', 'Base de Datos'];
    const severities = [
      { level: 'info', weight: 70 },
      { level: 'warning', weight: 20 },
      { level: 'critical', weight: 10 }
    ];

    const randomSeverity = () => {
      const rand = Math.random() * 100;
      let sum = 0;
      for (const { level, weight } of severities) {
        sum += weight;
        if (rand <= sum) return level;
      }
      return 'info';
    };

    const severity = randomSeverity();
    const type = types[Math.floor(Math.random() * types.length)];
    const messages = {
      info: [
        'Proceso completado exitosamente',
        'Conexión establecida',
        'Backup realizado',
        'Actualización aplicada',
        'Usuario autenticado'
      ],
      warning: [
        'Uso de CPU elevado',
        'Memoria cerca del límite',
        'Latencia aumentada',
        'Reintentos detectados',
        'Cache cerca de capacidad'
      ],
      critical: [
        'Servicio no responde',
        'Error de conexión',
        'Fallo de autenticación',
        'Disco lleno',
        'Base de datos inaccesible'
      ]
    };

    return {
      id: Date.now() + Math.random(),
      timestamp: new Date().toLocaleTimeString(),
      type,
      severity,
      message: messages[severity][Math.floor(Math.random() * messages[severity].length)],
      source: `srv-${Math.floor(Math.random() * 10 + 1)}.prod.local`,
      status: severity === 'critical' ? 'pending' : 'resolved'
    };
  };

  useEffect(() => {
    // Generar eventos iniciales
    const initialEvents = Array.from({ length: 20 }, generateEvent);
    setEvents(initialEvents);

    // Simular stream de eventos
    const interval = setInterval(() => {
      const newEvent = generateEvent();
      setEvents(prev => [newEvent, ...prev.slice(0, 49)]);

      setStats(prev => ({
        ...prev,
        totalEvents: prev.totalEvents + 1,
        criticalEvents: prev.criticalEvents + (newEvent.severity === 'critical' ? 1 : 0),
        warningEvents: prev.warningEvents + (newEvent.severity === 'warning' ? 1 : 0),
        infoEvents: prev.infoEvents + (newEvent.severity === 'info' ? 1 : 0)
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const filteredEvents = events.filter(event => {
    if (filters.severity !== 'all' && event.severity !== filters.severity) return false;
    if (filters.type !== 'all' && event.type !== filters.type) return false;
    if (filters.status !== 'all' && event.status !== filters.status) return false;
    return true;
  });

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'critical':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case 'info':
        return <CheckCircle className="w-5 h-5 text-blue-600" />;
      default:
        return <Activity className="w-5 h-5 text-gray-600" />;
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'info':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const renderEvents = () => (
    <div className="space-y-6">
      {/* Filtros */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5 text-gray-600" />
          <h3 className="font-bold">Filtros</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Severidad</label>
            <select
              value={filters.severity}
              onChange={(e) => setFilters({ ...filters, severity: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Todas</option>
              <option value="critical">Crítico</option>
              <option value="warning">Advertencia</option>
              <option value="info">Información</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tipo</label>
            <select
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Todos</option>
              <option value="Sistema">Sistema</option>
              <option value="Red">Red</option>
              <option value="Seguridad">Seguridad</option>
              <option value="Aplicación">Aplicación</option>
              <option value="Base de Datos">Base de Datos</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Todos</option>
              <option value="pending">Pendiente</option>
              <option value="resolved">Resuelto</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stream de eventos */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 px-6 py-4 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Radio className="w-5 h-5 animate-pulse" />
              <h3 className="font-bold">Stream de Eventos en Tiempo Real</h3>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>{filteredEvents.length} eventos</span>
            </div>
          </div>
        </div>
        <div className="max-h-[600px] overflow-y-auto">
          {filteredEvents.map((event) => (
            <div
              key={event.id}
              className="border-b border-gray-200 p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-start gap-4">
                <div className="mt-1">
                  {getSeverityIcon(event.severity)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`px-2 py-1 rounded text-xs font-medium border ${getSeverityColor(event.severity)}`}>
                          {event.severity.toUpperCase()}
                        </span>
                        <span className="px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-700">
                          {event.type}
                        </span>
                        {event.status === 'resolved' && (
                          <span className="px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-700">
                            Resuelto
                          </span>
                        )}
                      </div>
                      <p className="font-medium text-gray-900">{event.message}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-sm text-gray-600 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {event.timestamp}
                      </div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Origen:</span> {event.source}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-6">
      {/* Gráficos de análisis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-600" />
            Eventos por Hora
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={eventData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="critical" stackId="1" stroke="#ef4444" fill="#ef4444" name="Críticos" />
              <Area type="monotone" dataKey="warning" stackId="1" stroke="#f59e0b" fill="#f59e0b" name="Advertencias" />
              <Area type="monotone" dataKey="info" stackId="1" stroke="#3b82f6" fill="#3b82f6" name="Info" />
              <Area type="monotone" dataKey="success" stackId="1" stroke="#10b981" fill="#10b981" name="Exitosos" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Eye className="w-5 h-5 text-cyan-600" />
            Distribución de Eventos
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={eventDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {eventDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tipos de eventos */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-bold mb-4">Eventos por Tipo</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {eventTypes.map((type, index) => (
            <div key={index} className={`bg-gradient-to-br from-${type.color}-500 to-${type.color}-700 rounded-xl p-6 text-white`}>
              <div className="text-sm opacity-80 mb-1">{type.type}</div>
              <div className="text-3xl font-bold mb-2">{type.count}</div>
              <div className="text-sm flex items-center gap-1">
                <TrendingUp className="w-4 h-4" />
                {type.trend}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderMonitoring = () => (
    <div className="space-y-6">
      {/* Estado de servicios */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {['API Gateway', 'Base de Datos', 'Cache Redis', 'Message Queue'].map((service, index) => {
          const statuses = ['operational', 'operational', 'degraded', 'operational'];
          const status = statuses[index];
          return (
            <div key={index} className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <Wifi className={`w-6 h-6 ${status === 'operational' ? 'text-green-600' : 'text-yellow-600'}`} />
                <div className={`w-3 h-3 rounded-full ${status === 'operational' ? 'bg-green-500' : 'bg-yellow-500'} animate-pulse`}></div>
              </div>
              <h3 className="font-bold mb-1">{service}</h3>
              <p className={`text-sm ${status === 'operational' ? 'text-green-600' : 'text-yellow-600'}`}>
                {status === 'operational' ? 'Operacional' : 'Degradado'}
              </p>
              <div className="mt-4 pt-4 border-t">
                <div className="text-sm text-gray-600">Uptime</div>
                <div className="text-xl font-bold">99.{Math.floor(Math.random() * 10)}%</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Métricas de rendimiento */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-bold mb-4">Métricas de Rendimiento</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={eventData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="success" stroke="#10b981" strokeWidth={2} name="Operaciones Exitosas" />
            <Line type="monotone" dataKey="warning" stroke="#f59e0b" strokeWidth={2} name="Advertencias" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 text-white shadow-2xl">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
                <Activity className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Pulse</h1>
                <p className="text-blue-100 text-sm">Monitor de Eventos en Tiempo Real</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
                <div className="text-xs opacity-80">Eventos Totales</div>
                <div className="font-bold text-2xl">{stats.totalEvents.toLocaleString()}</div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
                <div className="text-xs opacity-80">Críticos</div>
                <div className="font-bold text-2xl text-red-300">{stats.criticalEvents}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto px-6 -mt-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Eventos Info</p>
                <p className="text-3xl font-bold text-blue-600">{stats.infoEvents}</p>
              </div>
              <Bell className="w-12 h-12 text-blue-600 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Advertencias</p>
                <p className="text-3xl font-bold text-yellow-600">{stats.warningEvents}</p>
              </div>
              <AlertTriangle className="w-12 h-12 text-yellow-600 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Tiempo Respuesta</p>
                <p className="text-3xl font-bold text-cyan-600">{stats.avgResponseTime}ms</p>
              </div>
              <Zap className="w-12 h-12 text-cyan-600 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Salud del Sistema</p>
                <p className="text-3xl font-bold text-green-600">{stats.systemHealth}%</p>
              </div>
              <CheckCircle className="w-12 h-12 text-green-600 opacity-20" />
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white shadow-md sticky top-0 z-10 mt-6">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-1">
            <button
              onClick={() => setActiveTab('events')}
              className={`px-6 py-4 font-medium transition-all ${
                activeTab === 'events'
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4" />
                Eventos
              </div>
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`px-6 py-4 font-medium transition-all ${
                activeTab === 'analytics'
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Analíticas
              </div>
            </button>
            <button
              onClick={() => setActiveTab('monitoring')}
              className={`px-6 py-4 font-medium transition-all ${
                activeTab === 'monitoring'
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4" />
                Monitoreo
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === 'events' && renderEvents()}
        {activeTab === 'analytics' && renderAnalytics()}
        {activeTab === 'monitoring' && renderMonitoring()}
      </div>
    </div>
  );
};

export default Pulse;
