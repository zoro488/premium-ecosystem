/**
 * 🤖 PANEL IA - CENTRO DE INTELIGENCIA ARTIFICIAL
 *
 * Panel completo con todas las funcionalidades de IA:
 * - Chat conversacional
 * - Análisis y predicciones
 * - Generación de reportes
 * - Comandos por voz
 * - Detección de anomalías
 */

import { AnimatePresence, motion } from 'framer-motion';
import {
    AlertTriangle,
    Download,
    FileText,
    Loader2,
    MessageCircle,
    Mic,
    RefreshCw,
    Send,
    Settings,
    Sparkles,
    TrendingUp,
} from 'lucide-react';
import React, { useState } from 'react';
import {
    useAIAnalysis,
    useAIAnomalyDetection,
    useAIChat,
    useAIPredictions,
    useAIReports,
    useAIVoiceCommands,
} from '../hooks/useAI';

type Tab = 'chat' | 'analysis' | 'predictions' | 'reports' | 'anomalies' | 'settings';

export function PanelIA() {
  const [activeTab, setActiveTab] = useState<Tab>('chat');
  const [inputMessage, setInputMessage] = useState('');

  // Hooks
  const chat = useAIChat();
  const analysis = useAIAnalysis();
  const predictions = useAIPredictions();
  const reports = useAIReports();
  const anomalies = useAIAnomalyDetection();
  const voice = useAIVoiceCommands();

  // Tabs
  const tabs = [
    { id: 'chat' as Tab, label: 'Chat', icon: MessageCircle },
    { id: 'analysis' as Tab, label: 'Análisis', icon: TrendingUp },
    { id: 'predictions' as Tab, label: 'Predicciones', icon: Sparkles },
    { id: 'reports' as Tab, label: 'Reportes', icon: FileText },
    { id: 'anomalies' as Tab, label: 'Anomalías', icon: AlertTriangle },
    { id: 'settings' as Tab, label: 'Configuración', icon: Settings },
  ];

  // Send message
  const handleSendMessage = async () => {
    if (!inputMessage.trim() || chat.isLoading) return;
    await chat.sendMessage(inputMessage);
    setInputMessage('');
  };

  // Voice input effect
  React.useEffect(() => {
    if (voice.transcript) {
      setInputMessage(voice.transcript);
    }
  }, [voice.transcript]);

  return (
    <div className="w-full h-full bg-gradient-to-br from-zinc-800 via-blue-900 to-indigo-900 p-6 overflow-hidden">
      <div className="max-w-7xl mx-auto h-full flex flex-col">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-xl shadow-lg">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Panel de Inteligencia Artificial</h1>
                <p className="text-zinc-400">Asistente avanzado con Gemini, AWS y Ollama</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="flex space-x-2 mb-6 bg-white/10 backdrop-blur-lg rounded-xl p-2"
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-zinc-800 to-zinc-900 text-white shadow-lg'
                  : 'text-white/60 hover:text-white hover:bg-white/10'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              <span className="font-medium">{tab.label}</span>
            </button>
          ))}
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex-1 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6 overflow-hidden flex flex-col"
        >
          <AnimatePresence mode="wait">
            {/* TAB: Chat */}
            {activeTab === 'chat' && (
              <motion.div
                key="chat"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="h-full flex flex-col"
              >
                {/* Messages */}
                <div className="flex-1 overflow-y-auto space-y-4 mb-4 custom-scrollbar">
                  {chat.messages.length === 0 && (
                    <div className="text-center text-white/60 mt-12">
                      <Sparkles className="w-16 h-16 mx-auto mb-4 opacity-50" />
                      <h3 className="text-xl font-semibold mb-2">Asistente IA FlowDistributor</h3>
                      <p className="text-sm">Pregúntame sobre ventas, análisis, reportes o cualquier cosa...</p>
                    </div>
                  )}

                  {chat.messages.map((msg, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[70%] p-4 rounded-2xl ${
                          msg.role === 'user'
                            ? 'bg-gradient-to-br from-zinc-800 to-zinc-900 text-white'
                            : 'bg-white/10 text-white'
                        }`}
                      >
                        <p className="whitespace-pre-wrap">{msg.content}</p>
                        {msg.timestamp && (
                          <p className="text-xs opacity-60 mt-2">
                            {new Date(msg.timestamp).toLocaleString('es-MX')}
                          </p>
                        )}
                      </div>
                    </motion.div>
                  ))}

                  {chat.isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-white/10 p-4 rounded-2xl flex items-center space-x-2">
                        <Loader2 className="w-5 h-5 text-white animate-spin" />
                        <span className="text-white">Pensando...</span>
                      </div>
                    </div>
                  )}

                  {chat.error && (
                    <div className="bg-zinc-9000/20 text-red-300 p-4 rounded-lg">
                      {chat.error}
                    </div>
                  )}
                </div>

                {/* Input */}
                <div className="flex items-center space-x-2">
                  {voice.supported && (
                    <button
                      onClick={voice.isListening ? voice.stopListening : voice.startListening}
                      className={`p-3 rounded-xl transition-all ${
                        voice.isListening
                          ? 'bg-zinc-9000 text-white animate-pulse'
                          : 'bg-white/10 text-white hover:bg-white/20'
                      }`}
                    >
                      <Mic className="w-5 h-5" />
                    </button>
                  )}

                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Escribe tu mensaje..."
                    disabled={chat.isLoading}
                    className="flex-1 px-4 py-3 bg-white/10 text-white placeholder-white/50 rounded-xl border border-white/20 focus:outline-none focus:border-zinc-800 transition-colors"
                  />

                  <button
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim() || chat.isLoading}
                    className="p-3 bg-gradient-to-r from-zinc-800 to-zinc-900 text-white rounded-xl hover:shadow-lg transition-all disabled:opacity-50"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* TAB: Analysis */}
            {activeTab === 'analysis' && (
              <motion.div
                key="analysis"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-4"
              >
                <h2 className="text-2xl font-bold text-white mb-4">Análisis Financiero</h2>

                {analysis.analysis ? (
                  <div className="space-y-4">
                    <div className="bg-white/10 p-6 rounded-xl">
                      <h3 className="text-xl font-semibold text-white mb-4">Insights</h3>
                      <ul className="space-y-2 text-white/80">
                        {analysis.analysis.insights.map((insight, idx) => (
                          <li key={idx} className="flex items-start space-x-2">
                            <Sparkles className="w-5 h-5 text-zinc-800 flex-shrink-0 mt-0.5" />
                            <span>{insight}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-white/10 p-6 rounded-xl">
                      <h3 className="text-xl font-semibold text-white mb-4">Recomendaciones</h3>
                      <ul className="space-y-2 text-white/80">
                        {analysis.analysis.recommendations.map((rec, idx) => (
                          <li key={idx} className="flex items-start space-x-2">
                            <TrendingUp className="w-5 h-5 text-zinc-300 flex-shrink-0 mt-0.5" />
                            <span>{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="text-center text-white/60">
                      Confianza: {(analysis.analysis.confidence * 100).toFixed(0)}%
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-white/60 py-12">
                    <TrendingUp className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p>No hay análisis disponible</p>
                    <button
                      onClick={() => analysis.analyze({}, 'ventas')}
                      disabled={analysis.isAnalyzing}
                      className="mt-4 px-6 py-3 bg-gradient-to-r from-zinc-800 to-zinc-900 text-white rounded-xl hover:shadow-lg transition-all disabled:opacity-50"
                    >
                      {analysis.isAnalyzing ? (
                        <span className="flex items-center space-x-2">
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span>Analizando...</span>
                        </span>
                      ) : (
                        'Analizar Datos'
                      )}
                    </button>
                  </div>
                )}
              </motion.div>
            )}

            {/* TAB: Predictions */}
            {activeTab === 'predictions' && (
              <motion.div
                key="predictions"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="text-center text-white/60 py-12"
              >
                <Sparkles className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <h2 className="text-2xl font-bold text-white mb-2">Predicciones</h2>
                <p>Predicciones de ventas, demanda y flujo de caja</p>
                <button
                  onClick={() => predictions.predictSales([])}
                  disabled={predictions.isPredicting}
                  className="mt-4 px-6 py-3 bg-gradient-to-r from-zinc-800 to-zinc-900 text-white rounded-xl hover:shadow-lg transition-all disabled:opacity-50"
                >
                  {predictions.isPredicting ? 'Prediciendo...' : 'Generar Predicciones'}
                </button>
              </motion.div>
            )}

            {/* TAB: Reports */}
            {activeTab === 'reports' && (
              <motion.div
                key="reports"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-4"
              >
                <h2 className="text-2xl font-bold text-white mb-4">Generación de Reportes</h2>

                {reports.report ? (
                  <div className="space-y-4">
                    <div className="bg-white/10 p-6 rounded-xl">
                      <pre className="text-white/80 whitespace-pre-wrap text-sm">
                        {reports.report}
                      </pre>
                    </div>
                    <button
                      onClick={() => reports.downloadReport('reporte.txt')}
                      className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-zinc-800 to-zinc-900 text-white rounded-xl hover:shadow-lg transition-all"
                    >
                      <Download className="w-5 h-5" />
                      <span>Descargar Reporte</span>
                    </button>
                  </div>
                ) : (
                  <div className="text-center text-white/60 py-12">
                    <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p>No hay reporte generado</p>
                    <button
                      onClick={() => reports.generateReport('ventas-mensual', {})}
                      disabled={reports.isGenerating}
                      className="mt-4 px-6 py-3 bg-gradient-to-r from-zinc-800 to-zinc-900 text-white rounded-xl hover:shadow-lg transition-all disabled:opacity-50"
                    >
                      {reports.isGenerating ? (
                        <span className="flex items-center space-x-2">
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span>Generando...</span>
                        </span>
                      ) : (
                        'Generar Reporte'
                      )}
                    </button>
                  </div>
                )}
              </motion.div>
            )}

            {/* TAB: Anomalies */}
            {activeTab === 'anomalies' && (
              <motion.div
                key="anomalies"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-4"
              >
                <h2 className="text-2xl font-bold text-white mb-4">Detección de Anomalías</h2>

                {anomalies.anomalies.length > 0 ? (
                  <div className="space-y-3">
                    {anomalies.anomalies.map((anomaly, idx) => (
                      <div key={idx} className="bg-zinc-9000/20 border border-zinc-500/30 p-4 rounded-xl text-white">
                        <div className="flex items-start space-x-2">
                          <AlertTriangle className="w-5 h-5 text-zinc-200 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="font-semibold">Anomalía detectada</p>
                            <p className="text-sm text-white/80 mt-1">{JSON.stringify(anomaly)}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-white/60 py-12">
                    <AlertTriangle className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p>No se detectaron anomalías</p>
                    <button
                      onClick={() => anomalies.detectAnomalies([])}
                      disabled={anomalies.isDetecting}
                      className="mt-4 px-6 py-3 bg-gradient-to-r from-zinc-800 to-zinc-900 text-white rounded-xl hover:shadow-lg transition-all disabled:opacity-50"
                    >
                      {anomalies.isDetecting ? (
                        <span className="flex items-center space-x-2">
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span>Detectando...</span>
                        </span>
                      ) : (
                        'Detectar Anomalías'
                      )}
                    </button>
                  </div>
                )}
              </motion.div>
            )}

            {/* TAB: Settings */}
            {activeTab === 'settings' && (
              <motion.div
                key="settings"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-4"
              >
                <h2 className="text-2xl font-bold text-white mb-4">Configuración</h2>
                <div className="bg-white/10 p-6 rounded-xl space-y-4">
                  <div>
                    <label className="block text-white font-medium mb-2">Proveedor de IA</label>
                    <select className="w-full px-4 py-2 bg-white/10 text-white border border-white/20 rounded-lg focus:outline-none focus:border-zinc-800">
                      <option value="gemini">Google Gemini</option>
                      <option value="ollama">Ollama (Local)</option>
                      <option value="bedrock">AWS Bedrock</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-white font-medium mb-2">Temperatura</label>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      defaultValue="0.7"
                      className="w-full"
                    />
                  </div>
                  <button
                    onClick={chat.clearChat}
                    className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-zinc-9000/20 text-red-300 border border-zinc-500/30 rounded-xl hover:bg-zinc-9000/30 transition-all"
                  >
                    <RefreshCw className="w-5 h-5" />
                    <span>Limpiar Historial</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Scrollbar styles */}
      <style>
        {`
          .custom-scrollbar::-webkit-scrollbar {
            width: 8px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: rgba(255, 255, 255, 0.05);
            border-radius: 4px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: rgba(255, 255, 255, 0.2);
            border-radius: 4px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: rgba(255, 255, 255, 0.3);
          }
        `}
      </style>
    </div>
  );
}
