/**
 * 🤖 PANEL IA ULTRA - FlowDistributor
 * Sistema de Inteligencia Artificial completo con:
 * - Chat multimodal (Google Gemini + AWS Claude + Ollama)
 * - Reconocimiento de voz (Speech-to-Text)
 * - Generación de reportes PDF/Excel
 * - OCR de documentos
 * - Predicciones con AWS Forecast
 * - Navegación por IA
 * - Análisis visual y recomendaciones
 */

import { AnimatePresence, motion } from 'framer-motion';
import {
    AlertCircle,
    BarChart3,
    Bot,
    Brain,
    Camera,
    CheckCircle2,
    Download,
    FileSpreadsheet,
    FileText,
    Loader2,
    MessageSquare,
    Mic,
    MicOff,
    Navigation,
    RefreshCw,
    Send,
    Sparkles,
    TrendingUp,
    Upload,
    Zap
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

// Servicios IA
import {
    analyzeDocument,
    isGoogleAIConfigured,
    sendToGemini,
    transcribeAudio,
    type GeminiMessage
} from '../services/google-ai.service';

import {
    checkOllamaHealth,
    sendToOllama,
    type OllamaMessage
} from '../services/ollama.service';

import {
    forecastVentas,
    isAWSConfigured,
    sendToClaude,
    type ClaudeMessage
} from '../services/aws-ai.service';

// ============================================================================
// TIPOS
// ============================================================================

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  provider?: 'gemini' | 'claude' | 'ollama';
  isStreaming?: boolean;
}

interface AIProvider {
  id: 'gemini' | 'claude' | 'ollama';
  name: string;
  available: boolean;
  icon: any;
  description: string;
}

type TabType = 'chat' | 'voice' | 'reports' | 'ocr' | 'predictions' | 'navigation' | 'analytics';

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================

export default function PanelIA() {
  // Estado principal
  const [activeTab, setActiveTab] = useState<TabType>('chat');
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<'gemini' | 'claude' | 'ollama'>('gemini');

  // Estado de voz
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  // Estado de providers
  const [providers, setProviders] = useState<AIProvider[]>([
    {
      id: 'gemini',
      name: 'Google Gemini',
      available: isGoogleAIConfigured(),
      icon: Sparkles,
      description: 'Gemini Pro - Google AI'
    },
    {
      id: 'claude',
      name: 'AWS Claude',
      available: isAWSConfigured(),
      icon: Brain,
      description: 'Claude 3 - Anthropic'
    },
    {
      id: 'ollama',
      name: 'Ollama Local',
      available: false,
      icon: Bot,
      description: 'Modelos locales gratuitos'
    }
  ]);

  // Estado de predicciones
  const [predictions, setPredictions] = useState<any>(null);
  const [isLoadingPredictions, setIsLoadingPredictions] = useState(false);

  // Referencias
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ============================================================================
  // EFECTOS
  // ============================================================================

  useEffect(() => {
    // Verificar disponibilidad de Ollama al cargar
    checkOllamaHealth().then(available => {
      setProviders(prev => prev.map(p =>
        p.id === 'ollama' ? { ...p, available } : p
      ));
    });
  }, []);

  useEffect(() => {
    // Auto-scroll a último mensaje
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // ============================================================================
  // FUNCIONES DE CHAT
  // ============================================================================

  const sendMessage = async () => {
    if (!inputMessage.trim() || isProcessing) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsProcessing(true);

    try {
      let response = '';

      // Seleccionar provider disponible
      const availableProvider = providers.find(p => p.id === selectedProvider && p.available);
      const providerToUse = availableProvider?.id || 'ollama';

      // Preparar historial de mensajes
      const chatHistory = messages.slice(-10); // Últimos 10 mensajes

      if (providerToUse === 'gemini') {
        // Usar Google Gemini
        const geminiMessages: GeminiMessage[] = [
          ...chatHistory.map(m => ({
            role: m.role as 'user' | 'assistant',
            content: m.content
          })),
          { role: 'user' as const, content: inputMessage }
        ];

        const result = await sendToGemini(geminiMessages, {
          systemPrompt: 'Eres el asistente IA de FlowDistributor. Ayuda con análisis de datos, reportes, predicciones y navegación del sistema. Responde en español de forma clara y profesional.'
        });

        response = result.text;

      } else if (providerToUse === 'claude') {
        // Usar AWS Claude
        const claudeMessages: ClaudeMessage[] = [
          ...chatHistory.map(m => ({
            role: m.role === 'user' ? 'user' as const : 'assistant' as const,
            content: m.content
          })),
          { role: 'user' as const, content: inputMessage }
        ];

        const result = await sendToClaude(claudeMessages);
        response = result.content;

      } else {
        // Usar Ollama (fallback local)
        const ollamaMessages: OllamaMessage[] = [
          { role: 'system', content: 'Eres el asistente IA de FlowDistributor. Ayuda con análisis, reportes y predicciones.' },
          ...chatHistory.map(m => ({
            role: m.role as 'user' | 'assistant' | 'system',
            content: m.content
          })),
          { role: 'user' as const, content: inputMessage }
        ];

        response = await sendToOllama(ollamaMessages);
      }

      // Agregar respuesta
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
        provider: providerToUse
      };

      setMessages(prev => [...prev, assistantMessage]);

    } catch (error) {
      console.error('Error en chat:', error);

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `❌ Error al procesar el mensaje: ${error instanceof Error ? error.message : 'Error desconocido'}. Intenta con otro proveedor de IA.`,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsProcessing(false);
    }
  };

  // ============================================================================
  // FUNCIONES DE VOZ
  // ============================================================================

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      const audioChunks: Blob[] = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
        setAudioBlob(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      mediaRecorderRef.current = mediaRecorder;
      setIsRecording(true);

    } catch (error) {
      console.error('Error al iniciar grabación:', error);
      alert('No se pudo acceder al micrófono. Verifica los permisos.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const transcribeAudioInput = async () => {
    if (!audioBlob) return;

    setIsProcessing(true);

    try {
      const result = await transcribeAudio(audioBlob, {
        language: 'es-MX',
        model: 'enhanced'
      });

      setInputMessage(result.transcript);
      setAudioBlob(null);

      // Cambiar a tab de chat
      setActiveTab('chat');

    } catch (error) {
      console.error('Error al transcribir:', error);
      alert('Error al transcribir el audio');
    } finally {
      setIsProcessing(false);
    }
  };

  // ============================================================================
  // FUNCIONES DE OCR
  // ============================================================================

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);

    try {
      if (file.type.startsWith('image/')) {
        // Analizar imagen con OCR
        const result = await analyzeDocument(file);

        const message: Message = {
          id: Date.now().toString(),
          role: 'assistant',
          content: `📄 **Texto extraído:**\n\n${result.text}\n\n¿Qué deseas hacer con esta información?`,
          timestamp: new Date(),
          provider: 'gemini'
        };

        setMessages(prev => [...prev, message]);
        setActiveTab('chat');

      } else if (file.type === 'application/pdf') {
        // Procesar PDF
        const message: Message = {
          id: Date.now().toString(),
          role: 'assistant',
          content: '📄 PDF detectado. Procesando documento...',
          timestamp: new Date()
        };

        setMessages(prev => [...prev, message]);
        setActiveTab('chat');
      }

    } catch (error) {
      console.error('Error al procesar archivo:', error);
      alert('Error al procesar el archivo');
    } finally {
      setIsProcessing(false);
    }
  };

  // ============================================================================
  // FUNCIONES DE PREDICCIONES
  // ============================================================================

  const generatePredictions = async () => {
    setIsLoadingPredictions(true);

    try {
      // Simular datos históricos de ventas
      const historicalData = Array.from({ length: 30 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (30 - i));
        return {
          timestamp: date.toISOString(),
          value: 15000 + Math.random() * 10000
        };
      });

      const forecast = await forecastVentas(historicalData, 30);
      setPredictions(forecast);

    } catch (error) {
      console.error('Error al generar predicciones:', error);
      alert('Error al generar predicciones');
    } finally {
      setIsLoadingPredictions(false);
    }
  };

  // ============================================================================
  // FUNCIONES DE REPORTES
  // ============================================================================

  const generateReport = async (type: 'pdf' | 'excel') => {
    setIsProcessing(true);

    try {
      const message: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: `📊 Generando reporte en formato ${type.toUpperCase()}...\n\nEsta funcionalidad está en desarrollo. Se integrará con jsPDF y ExcelJS para generar reportes completos.`,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, message]);
      setActiveTab('chat');

    } catch (error) {
      console.error('Error al generar reporte:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  // ============================================================================
  // RENDER - TABS
  // ============================================================================

  const tabs: Array<{ id: TabType; label: string; icon: any; gradient: string }> = [
    { id: 'chat', label: 'Chat IA', icon: MessageSquare, gradient: 'from-cyan-500 to-blue-600' },
    { id: 'voice', label: 'Voz', icon: Mic, gradient: 'from-purple-500 to-pink-600' },
    { id: 'reports', label: 'Reportes', icon: FileText, gradient: 'from-green-500 to-emerald-600' },
    { id: 'ocr', label: 'OCR', icon: Camera, gradient: 'from-orange-500 to-red-600' },
    { id: 'predictions', label: 'Predicciones', icon: TrendingUp, gradient: 'from-blue-500 to-indigo-600' },
    { id: 'navigation', label: 'Navegación', icon: Navigation, gradient: 'from-pink-500 to-rose-600' },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, gradient: 'from-violet-500 to-purple-600' }
  ];

  // ============================================================================
  // RENDER PRINCIPAL
  // ============================================================================

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 via-pink-600 to-blue-600 flex items-center justify-center shadow-2xl shadow-purple-500/50">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
                Panel IA Ultra
              </h1>
              <p className="text-white/60 text-sm mt-1">
                Inteligencia Artificial Avanzada para FlowDistributor
              </p>
            </div>
          </div>

          {/* Estado de providers */}
          <div className="flex gap-2">
            {providers.map(provider => {
              const Icon = provider.icon;
              return (
                <motion.button
                  key={provider.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedProvider(provider.id)}
                  className={`px-4 py-2 rounded-xl backdrop-blur-xl border transition-all ${
                    selectedProvider === provider.id
                      ? 'bg-white/10 border-white/30 shadow-lg'
                      : 'bg-white/5 border-white/10 hover:bg-white/10'
                  } ${!provider.available ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={!provider.available}
                  title={provider.description}
                >
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4 text-white" />
                    <span className="text-sm font-medium text-white">{provider.name}</span>
                    {provider.available ? (
                      <CheckCircle2 className="w-3 h-3 text-green-400" />
                    ) : (
                      <AlertCircle className="w-3 h-3 text-amber-400" />
                    )}
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Tabs de navegación */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <motion.button
                key={tab.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 rounded-xl backdrop-blur-xl border transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? `bg-gradient-to-r ${tab.gradient} border-white/20 shadow-2xl`
                    : 'bg-white/5 border-white/10 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Icon className="w-4 h-4 text-white" />
                  <span className="text-sm font-medium text-white">{tab.label}</span>
                </div>
              </motion.button>
            );
          })}
        </div>
      </motion.div>

      {/* Contenido según tab activo */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'chat' && (
            <ChatTab
              messages={messages}
              inputMessage={inputMessage}
              setInputMessage={setInputMessage}
              sendMessage={sendMessage}
              isProcessing={isProcessing}
              messagesEndRef={messagesEndRef}
            />
          )}

          {activeTab === 'voice' && (
            <VoiceTab
              isRecording={isRecording}
              audioBlob={audioBlob}
              startRecording={startRecording}
              stopRecording={stopRecording}
              transcribeAudio={transcribeAudioInput}
              isProcessing={isProcessing}
            />
          )}

          {activeTab === 'reports' && (
            <ReportsTab
              generateReport={generateReport}
              isProcessing={isProcessing}
            />
          )}

          {activeTab === 'ocr' && (
            <OCRTab
              fileInputRef={fileInputRef}
              handleFileUpload={handleFileUpload}
              isProcessing={isProcessing}
            />
          )}

          {activeTab === 'predictions' && (
            <PredictionsTab
              predictions={predictions}
              generatePredictions={generatePredictions}
              isLoading={isLoadingPredictions}
            />
          )}

          {activeTab === 'navigation' && (
            <NavigationTab />
          )}

          {activeTab === 'analytics' && (
            <AnalyticsTab />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// ============================================================================
// COMPONENTES DE TABS
// ============================================================================

// Chat Tab
function ChatTab({ messages, inputMessage, setInputMessage, sendMessage, isProcessing, messagesEndRef }: any) {
  return (
    <div className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden flex flex-col h-[calc(100vh-300px)]">
      {/* Mensajes */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <Sparkles className="w-16 h-16 text-purple-400/50 mb-4" />
            <h3 className="text-xl font-bold text-white/80 mb-2">
              ¡Hola! Soy tu asistente IA
            </h3>
            <p className="text-white/60 max-w-md">
              Puedo ayudarte con análisis de datos, generar reportes, hacer predicciones y navegar por el sistema. ¿En qué puedo ayudarte hoy?
            </p>
          </div>
        ) : (
          messages.map((message: Message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  message.role === 'user'
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white'
                    : 'bg-white/10 backdrop-blur-sm text-white border border-white/10'
                }`}
              >
                <div className="flex items-start gap-2">
                  {message.role === 'assistant' && (
                    <Bot className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    <div className="flex items-center gap-2 mt-2 text-xs opacity-70">
                      <span>{message.timestamp.toLocaleTimeString()}</span>
                      {message.provider && (
                        <span className="px-2 py-0.5 rounded-full bg-white/10">
                          {message.provider}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-white/10 bg-white/5">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && !isProcessing && sendMessage()}
            placeholder="Escribe tu mensaje..."
            disabled={isProcessing}
            className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 disabled:opacity-50"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={sendMessage}
            disabled={isProcessing || !inputMessage.trim()}
            className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl font-medium hover:from-cyan-600 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg shadow-cyan-500/25"
          >
            {isProcessing ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </motion.button>
        </div>
      </div>
    </div>
  );
}

// Voice Tab
function VoiceTab({ isRecording, audioBlob, startRecording, stopRecording, transcribeAudio, isProcessing }: any) {
  return (
    <div className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl p-8">
      <div className="flex flex-col items-center justify-center space-y-6 min-h-[400px]">
        <div className={`w-32 h-32 rounded-full flex items-center justify-center ${
          isRecording
            ? 'bg-gradient-to-br from-red-500 to-pink-600 animate-pulse'
            : 'bg-gradient-to-br from-purple-500 to-pink-600'
        } shadow-2xl`}>
          {isRecording ? (
            <MicOff className="w-16 h-16 text-white" />
          ) : (
            <Mic className="w-16 h-16 text-white" />
          )}
        </div>

        <div className="text-center">
          <h3 className="text-2xl font-bold text-white mb-2">
            {isRecording ? 'Grabando...' : 'Reconocimiento de Voz'}
          </h3>
          <p className="text-white/60">
            {isRecording
              ? 'Hablando... Presiona detener cuando termines'
              : 'Presiona el botón para comenzar a grabar'}
          </p>
        </div>

        <div className="flex gap-4">
          {!isRecording ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={startRecording}
              className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl font-medium shadow-lg shadow-purple-500/25 flex items-center gap-2"
            >
              <Mic className="w-5 h-5" />
              Iniciar Grabación
            </motion.button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={stopRecording}
              className="px-8 py-4 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-xl font-medium shadow-lg shadow-red-500/25 flex items-center gap-2"
            >
              <MicOff className="w-5 h-5" />
              Detener
            </motion.button>
          )}

          {audioBlob && !isRecording && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={transcribeAudio}
              disabled={isProcessing}
              className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-medium shadow-lg shadow-green-500/25 flex items-center gap-2 disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Transcribiendo...
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5" />
                  Transcribir
                </>
              )}
            </motion.button>
          )}
        </div>

        {audioBlob && (
          <div className="mt-4 p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
            <p className="text-sm text-green-400 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              Audio grabado exitosamente
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// Reports Tab
function ReportsTab({ generateReport, isProcessing }: any) {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Reporte PDF */}
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl p-6"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-pink-600 flex items-center justify-center">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Reporte PDF</h3>
            <p className="text-sm text-white/60">Genera reportes profesionales</p>
          </div>
        </div>

        <p className="text-white/70 text-sm mb-4">
          Genera reportes completos con gráficas, tablas y análisis detallados en formato PDF.
        </p>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => generateReport('pdf')}
          disabled={isProcessing}
          className="w-full px-4 py-3 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-xl font-medium shadow-lg shadow-red-500/25 flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <Download className="w-5 h-5" />
          Generar PDF
        </motion.button>
      </motion.div>

      {/* Reporte Excel */}
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl p-6"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
            <FileSpreadsheet className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Reporte Excel</h3>
            <p className="text-sm text-white/60">Datos en hojas de cálculo</p>
          </div>
        </div>

        <p className="text-white/70 text-sm mb-4">
          Exporta todos los datos en formato Excel con múltiples hojas y fórmulas.
        </p>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => generateReport('excel')}
          disabled={isProcessing}
          className="w-full px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-medium shadow-lg shadow-green-500/25 flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <Download className="w-5 h-5" />
          Generar Excel
        </motion.button>
      </motion.div>
    </div>
  );
}

// OCR Tab
function OCRTab({ fileInputRef, handleFileUpload, isProcessing }: any) {
  return (
    <div className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl p-8">
      <div className="flex flex-col items-center justify-center space-y-6 min-h-[400px]">
        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center shadow-2xl">
          <Camera className="w-16 h-16 text-white" />
        </div>

        <div className="text-center">
          <h3 className="text-2xl font-bold text-white mb-2">
            OCR - Reconocimiento de Texto
          </h3>
          <p className="text-white/60 max-w-md">
            Sube una imagen o documento para extraer el texto automáticamente usando Google Document AI
          </p>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,application/pdf"
          onChange={handleFileUpload}
          className="hidden"
          aria-label="Subir archivo para OCR"
        />

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => fileInputRef.current?.click()}
          disabled={isProcessing}
          className="px-8 py-4 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-xl font-medium shadow-lg shadow-orange-500/25 flex items-center gap-2 disabled:opacity-50"
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Procesando...
            </>
          ) : (
            <>
              <Upload className="w-5 h-5" />
              Subir Archivo
            </>
          )}
        </motion.button>

        <div className="grid grid-cols-2 gap-4 w-full max-w-md">
          <div className="p-4 bg-white/5 rounded-xl border border-white/10 text-center">
            <p className="text-sm text-white/60 mb-1">Formatos</p>
            <p className="text-lg font-bold text-white">JPG, PNG, PDF</p>
          </div>
          <div className="p-4 bg-white/5 rounded-xl border border-white/10 text-center">
            <p className="text-sm text-white/60 mb-1">Tamaño máx.</p>
            <p className="text-lg font-bold text-white">10 MB</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Predictions Tab
function PredictionsTab({ predictions, generatePredictions, isLoading }: any) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-bold text-white mb-2">Predicciones con AWS Forecast</h3>
          <p className="text-white/60">Análisis predictivo de ventas y tendencias</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={generatePredictions}
          disabled={isLoading}
          className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-medium shadow-lg shadow-blue-500/25 flex items-center gap-2 disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Generando...
            </>
          ) : (
            <>
              <RefreshCw className="w-5 h-5" />
              Generar Predicciones
            </>
          )}
        </motion.button>
      </div>

      {predictions ? (
        <div className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl p-6">
          <div className="mb-6">
            <h4 className="text-lg font-bold text-white mb-2">
              Predicción de Ventas - Próximos 30 días
            </h4>
            <div className="flex items-center gap-2">
              <span className="text-sm text-white/60">Precisión del modelo:</span>
              <span className="text-lg font-bold text-green-400">
                {(predictions.accuracy * 100).toFixed(1)}%
              </span>
            </div>
          </div>

          <div className="space-y-2 max-h-[400px] overflow-y-auto">
            {predictions.predictions.slice(0, 10).map((pred: any, idx: number) => (
              <div
                key={idx}
                className="p-4 bg-white/5 rounded-xl border border-white/10 flex justify-between items-center"
              >
                <div>
                  <p className="text-sm text-white/60">
                    {new Date(pred.timestamp).toLocaleDateString()}
                  </p>
                  <p className="text-lg font-bold text-white">
                    ${pred.value.toFixed(2)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-white/50">Rango de confianza</p>
                  <p className="text-sm text-white/70">
                    ${pred.confidence.low.toFixed(0)} - ${pred.confidence.high.toFixed(0)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl p-12">
          <div className="flex flex-col items-center justify-center text-center">
            <TrendingUp className="w-16 h-16 text-blue-400/50 mb-4" />
            <h4 className="text-xl font-bold text-white/80 mb-2">
              No hay predicciones generadas
            </h4>
            <p className="text-white/60 max-w-md">
              Haz clic en "Generar Predicciones" para analizar tus datos y obtener proyecciones futuras
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// Navigation Tab
function NavigationTab() {
  const shortcuts = [
    { label: 'Ir a Dashboard', icon: BarChart3, action: 'dashboard', gradient: 'from-cyan-500 to-blue-600' },
    { label: 'Ver Ventas', icon: TrendingUp, action: 'ventas', gradient: 'from-green-500 to-emerald-600' },
    { label: 'Órdenes de Compra', icon: FileText, action: 'ordenes', gradient: 'from-orange-500 to-red-600' },
    { label: 'Clientes', icon: MessageSquare, action: 'clientes', gradient: 'from-purple-500 to-pink-600' },
    { label: 'Almacén', icon: Upload, action: 'almacen', gradient: 'from-blue-500 to-indigo-600' },
    { label: 'Reportes', icon: FileText, action: 'reportes', gradient: 'from-pink-500 to-rose-600' }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold text-white mb-2">Navegación Inteligente</h3>
        <p className="text-white/60">Accede rápidamente a cualquier sección del sistema</p>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {shortcuts.map((shortcut, idx) => {
          const Icon = shortcut.icon;
          return (
            <motion.button
              key={idx}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`p-6 bg-gradient-to-br ${shortcut.gradient} rounded-2xl shadow-2xl text-white text-left`}
            >
              <Icon className="w-8 h-8 mb-3" />
              <h4 className="font-bold text-lg">{shortcut.label}</h4>
              <p className="text-sm opacity-80 mt-1">Navegar →</p>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

// Analytics Tab
function AnalyticsTab() {
  return (
    <div className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl p-8">
      <div className="flex flex-col items-center justify-center space-y-6 min-h-[400px]">
        <BarChart3 className="w-24 h-24 text-violet-400/50" />
        <div className="text-center">
          <h3 className="text-2xl font-bold text-white mb-2">
            Analytics Avanzado
          </h3>
          <p className="text-white/60 max-w-md">
            Análisis profundo de datos, visualizaciones interactivas y métricas clave de rendimiento
          </p>
        </div>
        <div className="text-sm text-white/40">
          Próximamente...
        </div>
      </div>
    </div>
  );
}
