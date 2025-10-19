import React, { useState, useEffect } from 'react';
import {
  Atom,
  Zap,
  Activity,
  TrendingUp,
  GitBranch,
  Layers,
  Box,
  Cpu,
  Radio,
  BarChart3
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
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';

const Quantum = () => {
  const [activeTab, setActiveTab] = useState('processing');
  const [quantumState, setQuantumState] = useState({
    qubits: 128,
    coherence: 98.5,
    entanglement: 94.2,
    fidelity: 99.1,
    gates: 1024
  });

  // Datos de procesamiento cuántico
  const [quantumData, setQuantumData] = useState([
    { time: '00:00', coherence: 98, entanglement: 92, fidelity: 99, operations: 850 },
    { time: '04:00', coherence: 97, entanglement: 93, fidelity: 98, operations: 920 },
    { time: '08:00', coherence: 99, entanglement: 95, fidelity: 99, operations: 1100 },
    { time: '12:00', coherence: 98, entanglement: 94, fidelity: 99, operations: 1050 },
    { time: '16:00', coherence: 97, entanglement: 93, fidelity: 98, operations: 980 },
    { time: '20:00', coherence: 99, entanglement: 96, fidelity: 99, operations: 1150 }
  ]);

  // Datos de estados cuánticos
  const quantumStates = [
    { state: 'Superposición', value: 95, max: 100 },
    { state: 'Entrelazamiento', value: 94, max: 100 },
    { state: 'Coherencia', value: 98, max: 100 },
    { state: 'Fidelidad', value: 99, max: 100 },
    { state: 'Estabilidad', value: 96, max: 100 }
  ];

  // Algoritmos cuánticos
  const quantumAlgorithms = [
    { name: 'Shor', status: 'running', progress: 78, qubits: 32 },
    { name: 'Grover', status: 'completed', progress: 100, qubits: 16 },
    { name: 'VQE', status: 'running', progress: 45, qubits: 24 },
    { name: 'QAOA', status: 'pending', progress: 0, qubits: 20 },
    { name: 'HHL', status: 'running', progress: 62, qubits: 28 }
  ];

  // Circuitos cuánticos
  const quantumCircuits = [
    { id: 1, name: 'Optimizer Circuit', gates: 256, depth: 12, status: 'active' },
    { id: 2, name: 'Error Correction', gates: 512, depth: 24, status: 'active' },
    { id: 3, name: 'Entanglement Gen', gates: 128, depth: 8, status: 'completed' },
    { id: 4, name: 'State Preparation', gates: 64, depth: 6, status: 'active' },
    { id: 5, name: 'Measurement Circuit', gates: 32, depth: 4, status: 'completed' }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setQuantumState(prev => ({
        qubits: prev.qubits,
        coherence: Math.min(100, prev.coherence + (Math.random() - 0.5) * 0.5),
        entanglement: Math.min(100, prev.entanglement + (Math.random() - 0.5) * 0.8),
        fidelity: Math.min(100, prev.fidelity + (Math.random() - 0.5) * 0.3),
        gates: prev.gates + Math.floor(Math.random() * 10)
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const renderProcessing = () => (
    <div className="space-y-6">
      {/* Métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-gradient-to-br from-purple-500 to-purple-700 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <Atom className="w-8 h-8" />
            <span className="text-sm opacity-80">Qubits</span>
          </div>
          <div className="text-3xl font-bold">{quantumState.qubits}</div>
          <div className="text-sm opacity-80 mt-1">Disponibles</div>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <Activity className="w-8 h-8" />
            <span className="text-sm opacity-80">Coherencia</span>
          </div>
          <div className="text-3xl font-bold">{quantumState.coherence.toFixed(1)}%</div>
          <div className="text-sm opacity-80 mt-1">Estado óptimo</div>
        </div>

        <div className="bg-gradient-to-br from-cyan-500 to-cyan-700 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <GitBranch className="w-8 h-8" />
            <span className="text-sm opacity-80">Entrelazamiento</span>
          </div>
          <div className="text-3xl font-bold">{quantumState.entanglement.toFixed(1)}%</div>
          <div className="text-sm opacity-80 mt-1">Eficiencia</div>
        </div>

        <div className="bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-8 h-8" />
            <span className="text-sm opacity-80">Fidelidad</span>
          </div>
          <div className="text-3xl font-bold">{quantumState.fidelity.toFixed(1)}%</div>
          <div className="text-sm opacity-80 mt-1">Precisión</div>
        </div>

        <div className="bg-gradient-to-br from-violet-500 to-violet-700 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <Layers className="w-8 h-8" />
            <span className="text-sm opacity-80">Gates</span>
          </div>
          <div className="text-3xl font-bold">{quantumState.gates}</div>
          <div className="text-sm opacity-80 mt-1">Operaciones</div>
        </div>
      </div>

      {/* Gráficos de procesamiento */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-purple-600" />
            Métricas Cuánticas en Tiempo Real
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={quantumData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="coherence" stroke="#8b5cf6" strokeWidth={2} name="Coherencia %" />
              <Line type="monotone" dataKey="entanglement" stroke="#06b6d4" strokeWidth={2} name="Entrelazamiento %" />
              <Line type="monotone" dataKey="fidelity" stroke="#6366f1" strokeWidth={2} name="Fidelidad %" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Radio className="w-5 h-5 text-blue-600" />
            Estados Cuánticos
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={quantumStates}>
              <PolarGrid />
              <PolarAngleAxis dataKey="state" />
              <PolarRadiusAxis angle={90} domain={[0, 100]} />
              <Radar name="Nivel" dataKey="value" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.6} />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Operaciones cuánticas */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-cyan-600" />
          Operaciones Cuánticas por Hora
        </h3>
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={quantumData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Area type="monotone" dataKey="operations" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.6} name="Operaciones" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  const renderAlgorithms = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {quantumAlgorithms.map((algo, index) => (
          <div key={index} className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                  algo.status === 'running' ? 'bg-blue-100' :
                  algo.status === 'completed' ? 'bg-green-100' : 'bg-gray-100'
                }`}>
                  <Cpu className={`w-6 h-6 ${
                    algo.status === 'running' ? 'text-blue-600' :
                    algo.status === 'completed' ? 'text-green-600' : 'text-gray-600'
                  }`} />
                </div>
                <div>
                  <h3 className="font-bold text-lg">{algo.name}</h3>
                  <p className="text-sm text-gray-600">{algo.qubits} Qubits</p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                algo.status === 'running' ? 'bg-blue-100 text-blue-700' :
                algo.status === 'completed' ? 'bg-green-100 text-green-700' :
                'bg-gray-100 text-gray-700'
              }`}>
                {algo.status === 'running' ? 'En Ejecución' :
                 algo.status === 'completed' ? 'Completado' : 'Pendiente'}
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Progreso</span>
                <span className="font-medium">{algo.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-500 ${
                    algo.status === 'running' ? 'bg-blue-600' :
                    algo.status === 'completed' ? 'bg-green-600' : 'bg-gray-400'
                  }`}
                  style={{ width: `${algo.progress}%` }}
                />
              </div>
            </div>

            <div className="mt-4 pt-4 border-t grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-purple-600">{Math.floor(algo.progress * 2.5)}</div>
                <div className="text-xs text-gray-600">Iteraciones</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">{(algo.progress * 0.42).toFixed(1)}s</div>
                <div className="text-xs text-gray-600">Tiempo</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-cyan-600">{(99 - algo.progress * 0.05).toFixed(1)}%</div>
                <div className="text-xs text-gray-600">Fidelidad</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderCircuits = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
              <tr>
                <th className="px-6 py-4 text-left">Circuito</th>
                <th className="px-6 py-4 text-left">Gates</th>
                <th className="px-6 py-4 text-left">Profundidad</th>
                <th className="px-6 py-4 text-left">Estado</th>
                <th className="px-6 py-4 text-left">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {quantumCircuits.map((circuit) => (
                <tr key={circuit.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <Box className="w-5 h-5 text-purple-600" />
                      <span className="font-medium">{circuit.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-700">{circuit.gates}</td>
                  <td className="px-6 py-4 text-gray-700">{circuit.depth}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      circuit.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {circuit.status === 'active' ? 'Activo' : 'Completado'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm">
                        Ver
                      </button>
                      <button className="px-3 py-1 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors text-sm">
                        Ejecutar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Visualización de circuito */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Box className="w-5 h-5 text-purple-600" />
          Visualización de Circuito Cuántico
        </h3>
        <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg p-8 min-h-[300px] flex items-center justify-center">
          <div className="text-center text-gray-500">
            <Atom className="w-16 h-16 mx-auto mb-4 text-purple-400" />
            <p className="text-lg">Selecciona un circuito para visualizar</p>
            <p className="text-sm mt-2">Los circuitos cuánticos se mostrarán aquí</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 text-white shadow-2xl">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
                <Atom className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Quantum</h1>
                <p className="text-purple-100 text-sm">Sistema de Procesamiento Cuántico Avanzado</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
                <div className="text-xs opacity-80">Estado del Sistema</div>
                <div className="font-bold flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  Operacional
                </div>
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
              onClick={() => setActiveTab('processing')}
              className={`px-6 py-4 font-medium transition-all ${
                activeTab === 'processing'
                  ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50'
                  : 'text-gray-600 hover:text-purple-600 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4" />
                Procesamiento
              </div>
            </button>
            <button
              onClick={() => setActiveTab('algorithms')}
              className={`px-6 py-4 font-medium transition-all ${
                activeTab === 'algorithms'
                  ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50'
                  : 'text-gray-600 hover:text-purple-600 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4" />
                Algoritmos
              </div>
            </button>
            <button
              onClick={() => setActiveTab('circuits')}
              className={`px-6 py-4 font-medium transition-all ${
                activeTab === 'circuits'
                  ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50'
                  : 'text-gray-600 hover:text-purple-600 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-2">
                <Box className="w-4 h-4" />
                Circuitos
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === 'processing' && renderProcessing()}
        {activeTab === 'algorithms' && renderAlgorithms()}
        {activeTab === 'circuits' && renderCircuits()}
      </div>
    </div>
  );
};

export default Quantum;
