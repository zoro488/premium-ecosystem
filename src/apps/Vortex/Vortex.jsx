import React, { useState, useEffect } from 'react';
import {
  Layers,
  GitBranch,
  TrendingUp,
  BarChart3,
  PieChart as PieIcon,
  Boxes,
  Network,
  Workflow,
  Sparkles,
  Cube
} from 'lucide-react';
import {
  ScatterChart,
  Scatter,
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ZAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';

const Vortex = () => {
  const [activeTab, setActiveTab] = useState('multidimensional');
  const [dimension, setDimension] = useState('3d');

  // Datos multidimensionales
  const scatterData = Array.from({ length: 100 }, () => ({
    x: Math.random() * 100,
    y: Math.random() * 100,
    z: Math.random() * 1000,
    category: ['A', 'B', 'C', 'D'][Math.floor(Math.random() * 4)]
  }));

  // Datos de análisis temporal
  const temporalData = [
    { time: 'Jan', dim1: 65, dim2: 28, dim3: 42, dim4: 89, dim5: 56 },
    { time: 'Feb', dim1: 75, dim2: 38, dim3: 52, dim4: 95, dim5: 68 },
    { time: 'Mar', dim1: 85, dim2: 48, dim3: 62, dim4: 102, dim5: 78 },
    { time: 'Apr', dim1: 95, dim2: 58, dim3: 72, dim4: 110, dim5: 88 },
    { time: 'May', dim1: 105, dim2: 68, dim3: 82, dim4: 118, dim5: 98 },
    { time: 'Jun', dim1: 115, dim2: 78, dim3: 92, dim4: 125, dim5: 108 }
  ];

  // Datos de correlación
  const correlationData = [
    { dimension: 'Velocidad', value: 92, benchmark: 85 },
    { dimension: 'Precisión', value: 88, benchmark: 90 },
    { dimension: 'Eficiencia', value: 95, benchmark: 88 },
    { dimension: 'Complejidad', value: 78, benchmark: 75 },
    { dimension: 'Escalabilidad', value: 85, benchmark: 80 }
  ];

  // Datos de distribución
  const distributionData = [
    { name: 'Cluster A', value: 450, color: '#3b82f6' },
    { name: 'Cluster B', value: 320, color: '#8b5cf6' },
    { name: 'Cluster C', value: 280, color: '#06b6d4' },
    { name: 'Cluster D', value: 190, color: '#10b981' },
    { name: 'Cluster E', value: 160, color: '#f59e0b' }
  ];

  // Métricas de análisis
  const analysisMetrics = [
    { label: 'Dimensiones Analizadas', value: 47, trend: '+12%', color: 'blue' },
    { label: 'Correlaciones Detectadas', value: 234, trend: '+8%', color: 'purple' },
    { label: 'Patrones Identificados', value: 89, trend: '+15%', color: 'cyan' },
    { label: 'Anomalías', value: 12, trend: '-3%', color: 'red' },
    { label: 'Precisión Global', value: '94.2%', trend: '+2%', color: 'green' }
  ];

  // Capas de datos
  const dataLayers = [
    { id: 1, name: 'Capa Temporal', records: 1240000, status: 'active', dimensions: 8 },
    { id: 2, name: 'Capa Espacial', records: 850000, status: 'active', dimensions: 12 },
    { id: 3, name: 'Capa Categórica', records: 620000, status: 'processing', dimensions: 6 },
    { id: 4, name: 'Capa Jerárquica', records: 340000, status: 'active', dimensions: 15 },
    { id: 5, name: 'Capa de Red', records: 920000, status: 'active', dimensions: 10 }
  ];

  const COLORS = ['#3b82f6', '#8b5cf6', '#06b6d4', '#10b981'];

  const renderMultidimensional = () => (
    <div className="space-y-6">
      {/* Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {analysisMetrics.map((metric, index) => (
          <div key={index} className={`bg-gradient-to-br from-${metric.color}-500 to-${metric.color}-700 rounded-xl p-6 text-white`}>
            <div className="text-sm opacity-80 mb-1">{metric.label}</div>
            <div className="text-3xl font-bold mb-2">{metric.value}</div>
            <div className="text-sm flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
              {metric.trend}
            </div>
          </div>
        ))}
      </div>

      {/* Visualización 3D */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <Cube className="w-5 h-5 text-blue-600" />
            Análisis Multidimensional
          </h3>
          <div className="flex gap-2">
            <button
              onClick={() => setDimension('2d')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                dimension === '2d' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              2D
            </button>
            <button
              onClick={() => setDimension('3d')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                dimension === '3d' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              3D
            </button>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={400}>
          <ScatterChart>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" dataKey="x" name="Dimensión X" />
            <YAxis type="number" dataKey="y" name="Dimensión Y" />
            {dimension === '3d' && <ZAxis type="number" dataKey="z" name="Dimensión Z" range={[100, 1000]} />}
            <Tooltip cursor={{ strokeDasharray: '3 3' }} />
            <Legend />
            {['A', 'B', 'C', 'D'].map((cat, index) => (
              <Scatter
                key={cat}
                name={`Categoría ${cat}`}
                data={scatterData.filter(d => d.category === cat)}
                fill={COLORS[index]}
              />
            ))}
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      {/* Análisis temporal multidimensional */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <GitBranch className="w-5 h-5 text-purple-600" />
            Evolución Multidimensional
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={temporalData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="dim1" stroke="#3b82f6" strokeWidth={2} name="Dimensión 1" />
              <Line type="monotone" dataKey="dim2" stroke="#8b5cf6" strokeWidth={2} name="Dimensión 2" />
              <Line type="monotone" dataKey="dim3" stroke="#06b6d4" strokeWidth={2} name="Dimensión 3" />
              <Line type="monotone" dataKey="dim4" stroke="#10b981" strokeWidth={2} name="Dimensión 4" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Network className="w-5 h-5 text-cyan-600" />
            Correlaciones Dimensionales
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={correlationData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="dimension" />
              <PolarRadiusAxis angle={90} domain={[0, 100]} />
              <Radar name="Actual" dataKey="value" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
              <Radar name="Benchmark" dataKey="benchmark" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
              <Legend />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );

  const renderClustering = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Boxes className="w-5 h-5 text-blue-600" />
            Distribución de Clusters
          </h3>
          <ResponsiveContainer width="100%" height={350}>
            <PieChart>
              <Pie
                data={distributionData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
              >
                {distributionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-purple-600" />
            Densidad por Cluster
          </h3>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={distributionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#8b5cf6" radius={[8, 8, 0, 0]}>
                {distributionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detalles de clusters */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {distributionData.map((cluster, index) => (
          <div key={index} className="bg-white rounded-xl shadow-lg p-6 border-l-4" style={{ borderColor: cluster.color }}>
            <h4 className="font-bold mb-3">{cluster.name}</h4>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Elementos:</span>
                <span className="font-medium">{cluster.value}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Densidad:</span>
                <span className="font-medium">{(cluster.value / 1400 * 100).toFixed(1)}%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Coherencia:</span>
                <span className="font-medium">{(85 + Math.random() * 10).toFixed(1)}%</span>
              </div>
            </div>
            <button className="mt-4 w-full px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium">
              Explorar
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderLayers = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
              <tr>
                <th className="px-6 py-4 text-left">Capa</th>
                <th className="px-6 py-4 text-left">Registros</th>
                <th className="px-6 py-4 text-left">Dimensiones</th>
                <th className="px-6 py-4 text-left">Estado</th>
                <th className="px-6 py-4 text-left">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {dataLayers.map((layer) => (
                <tr key={layer.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <Layers className="w-5 h-5 text-blue-600" />
                      <span className="font-medium">{layer.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-700">{layer.records.toLocaleString()}</td>
                  <td className="px-6 py-4 text-gray-700">{layer.dimensions}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      layer.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {layer.status === 'active' ? 'Activa' : 'Procesando'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm">
                        Analizar
                      </button>
                      <button className="px-3 py-1 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors text-sm">
                        Visualizar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Visualización de capas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Workflow className="w-5 h-5 text-blue-600" />
            Distribución de Registros
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={dataLayers}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-15} textAnchor="end" height={80} />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="records" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-600" />
            Complejidad Dimensional
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dataLayers} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={120} />
              <Tooltip />
              <Bar dataKey="dimensions" fill="#8b5cf6" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white shadow-2xl">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
                <Layers className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Vortex</h1>
                <p className="text-blue-100 text-sm">Sistema de Análisis Multidimensional</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
                <div className="text-xs opacity-80">Dimensiones Activas</div>
                <div className="font-bold text-2xl">47</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white shadow-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-1">
            <button
              onClick={() => setActiveTab('multidimensional')}
              className={`px-6 py-4 font-medium transition-all ${
                activeTab === 'multidimensional'
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-2">
                <Cube className="w-4 h-4" />
                Multidimensional
              </div>
            </button>
            <button
              onClick={() => setActiveTab('clustering')}
              className={`px-6 py-4 font-medium transition-all ${
                activeTab === 'clustering'
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-2">
                <Boxes className="w-4 h-4" />
                Clustering
              </div>
            </button>
            <button
              onClick={() => setActiveTab('layers')}
              className={`px-6 py-4 font-medium transition-all ${
                activeTab === 'layers'
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4" />
                Capas de Datos
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === 'multidimensional' && renderMultidimensional()}
        {activeTab === 'clustering' && renderClustering()}
        {activeTab === 'layers' && renderLayers()}
      </div>
    </div>
  );
};

export default Vortex;
