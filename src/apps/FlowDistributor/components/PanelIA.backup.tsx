import { motion } from 'framer-motion';
import {
  BarChart3,
  Bot,
  Brain,
  FileText,
  Lightbulb,
  MessageSquare,
  Sparkles,
  TrendingUp,
  Zap
} from 'lucide-react';
import { useState } from 'react';
import Card, { CardContent, CardHeader, CardTitle } from './ui/Card';

export default function PanelIA() {
  const [activeTab, setActiveTab] = useState('chat');
  const [isProcessing, setIsProcessing] = useState(false);
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'ai'; content: string; timestamp: Date }>>([]);
  const [message, setMessage] = useState('');

  const tabs = [
    { id: 'chat', label: 'Chat IA', icon: MessageSquare, gradient: 'from-blue-500 to-cyan-500' },
    { id: 'insights', label: 'Insights', icon: Lightbulb, gradient: 'from-yellow-500 to-orange-500' },
    { id: 'predictions', label: 'Predicciones', icon: TrendingUp, gradient: 'from-green-500 to-emerald-500' },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, gradient: 'from-purple-500 to-violet-500' },
    { id: 'reports', label: 'Reportes', icon: FileText, gradient: 'from-pink-500 to-rose-500' },
    { id: 'actions', label: 'Acciones', icon: Zap, gradient: 'from-indigo-500 to-blue-500' }
  ];

  const insights = [
    {
      type: 'success',
      title: 'Ventas en tendencia positiva',
      description: 'Las ventas han aumentado un 23% en los últimos 7 días',
      impact: 'high'
    },
    {
      type: 'warning',
      title: 'Stock bajo en 5 productos',
      description: 'Se recomienda generar orden de compra',
      impact: 'medium'
    },
    {
      type: 'info',
      title: '3 clientes con pagos pendientes',
      description: 'Total: $15,000 MXN desde hace 15+ días',
      impact: 'medium'
    }
  ];

  const predictions = [
    {
      metric: 'Ventas próximos 7 días',
      predicted: '$45,000',
      confidence: 92,
      trend: 'up'
    },
    {
      metric: 'Stock crítico',
      predicted: '8 productos',
      confidence: 88,
      trend: 'down'
    },
    {
      metric: 'Flujo de caja',
      predicted: '+$12,000',
      confidence: 85,
      trend: 'up'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold gradient-text">Panel IA Avanzada</h1>
              <p className="text-white/60">Inteligencia artificial para tu negocio</p>
            </div>
          </div>
        </div>
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="px-4 py-2 glass rounded-lg flex items-center gap-2"
        >
          <div className="w-2 h-2 bg-green-500 rounded-full" />
          <span className="text-sm text-white/80">IA Activa</span>
        </motion.div>
      </div>

      {/* Tabs */}
      <div className="glass rounded-xl p-2 flex gap-2 overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white'
                  : 'text-white/60 hover:text-white hover:bg-white/10'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {activeTab === 'chat' && (
            <Card>
              <CardHeader>
                <CardTitle>Chat con IA</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="h-[400px] glass rounded-lg p-4 flex items-center justify-center">
                    <div className="text-center text-white/40">
                      <Bot className="w-16 h-16 mx-auto mb-4 opacity-40" />
                      <p>Pregúntame cualquier cosa sobre tu negocio</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Escribe tu pregunta..."
                      className="flex-1 px-4 py-3 glass rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                    />
                    <button className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg text-white font-medium hover:from-purple-600 hover:to-pink-700 transition-all">
                      Enviar
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'insights' && (
            <div className="space-y-4">
              {insights.map((insight, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card>
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                        insight.type === 'success' ? 'bg-green-500/20' :
                        insight.type === 'warning' ? 'bg-yellow-500/20' :
                        'bg-blue-500/20'
                      }`}>
                        <Sparkles className={`w-6 h-6 ${
                          insight.type === 'success' ? 'text-green-400' :
                          insight.type === 'warning' ? 'text-yellow-400' :
                          'text-blue-400'
                        }`} />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-white mb-1">{insight.title}</h3>
                        <p className="text-white/60">{insight.description}</p>
                        <div className="mt-2">
                          <span className={`inline-block px-3 py-1 rounded-full text-xs ${
                            insight.impact === 'high' ? 'bg-red-500/20 text-red-400' :
                            insight.impact === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-blue-500/20 text-blue-400'
                          }`}>
                            Impacto: {insight.impact === 'high' ? 'Alto' : insight.impact === 'medium' ? 'Medio' : 'Bajo'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}

          {activeTab === 'predictions' && (
            <div className="space-y-4">
              {predictions.map((pred, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card>
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="text-white/60 text-sm mb-1">{pred.metric}</h3>
                        <p className="text-2xl font-bold gradient-text">{pred.predicted}</p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-2 mb-2">
                          <TrendingUp className={`w-5 h-5 ${pred.trend === 'up' ? 'text-green-400' : 'text-red-400'}`} />
                          <span className="text-white/60 text-sm">Confianza: {pred.confidence}%</span>
                        </div>
                        <div className="w-32 h-2 glass rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${pred.confidence}%` }}
                            transition={{ delay: i * 0.1 + 0.5, duration: 0.5 }}
                            className="h-full bg-gradient-to-r from-purple-500 to-pink-600"
                          />
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Capacidades IA</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  'Chat conversacional',
                  'Análisis predictivo',
                  'Generación de reportes',
                  'Recomendaciones inteligentes',
                  'Automatización de tareas',
                  'Análisis visual',
                  'OCR documentos',
                  'Comandos por voz'
                ].map((capability, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-white/80">
                    <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-purple-500 to-pink-600" />
                    {capability}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Estadísticas IA</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-white/60">Consultas hoy</span>
                    <span className="text-white font-medium">47</span>
                  </div>
                  <div className="w-full h-2 glass rounded-full overflow-hidden">
                    <div className="h-full w-[70%] bg-gradient-to-r from-purple-500 to-pink-600" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-white/60">Precisión</span>
                    <span className="text-white font-medium">94%</span>
                  </div>
                  <div className="w-full h-2 glass rounded-full overflow-hidden">
                    <div className="h-full w-[94%] bg-gradient-to-r from-green-500 to-emerald-600" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-white/60">Tiempo promedio</span>
                    <span className="text-white font-medium">1.2s</span>
                  </div>
                  <div className="w-full h-2 glass rounded-full overflow-hidden">
                    <div className="h-full w-[85%] bg-gradient-to-r from-cyan-500 to-blue-600" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
