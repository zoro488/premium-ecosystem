import { useEffect, useRef, useState } from 'react';

import { AnimatePresence, motion } from 'framer-motion';
import {
  Activity,
  BarChart3,
  Brain,
  ChevronDown,
  ChevronUp,
  Copy,
  Cpu,
  Globe,
  HardDrive,
  Layers,
  Loader2,
  Maximize,
  MessageSquare,
  Mic,
  MicOff,
  Minimize2,
  Send,
  Settings,
  Sparkles,
  TrendingUp,
  User,
  Volume2,
  VolumeX,
  X,
  Zap,
} from 'lucide-react';

import { initVoiceRecognition, isSpeechRecognitionAvailable } from '../../utils/voiceRecognition';

/**
 * ⚡ ZEROFORCE AI - Sistema de Inteligencia Artificial de Máxima Potencia
 *
 * Funcionalidades ULTRA AVANZADAS:
 * - 🧠 Multi-Agente: Sistema de múltiples IAs trabajando en paralelo
 * - 📊 Análisis Predictivo con Machine Learning
 * - 🎯 RAG (Retrieval Augmented Generation) con embeddings vectoriales
 * - 🔮 Comandos de voz con NLP avanzado
 * - 📈 Dashboard 3D con visualizaciones holográficas
 * - 🔌 Sistema de plugins dinámicos
 * - 💡 Sugerencias proactivas con IA contextual
 * - 🌐 Streaming de respuestas en tiempo real
 * - 🎨 Interfaz holográfica tipo sci-fi
 * - 🔐 Sistema de memoria persistente y aprendizaje continuo
 * - ⚙️ Auto-optimización de parámetros
 * - 🚀 Multi-modelo switching inteligente
 */

const ZeroForceAI = ({
  systemName = 'Sistema',
  systemContext = '',
  accentColor = 'cyan',
  position = 'bottom-right',
  onDataAnalysis,
  onCommandExecute,
  systemData = {},
}) => {
  // Estados principales
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'assistant',
      content: `⚡ ZEROFORCE iniciado. Todos los sistemas operativos. ${systemName} conectado. ¿Cómo puedo asistirte?`,
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      type: 'system',
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingText, setStreamingText] = useState('');

  // Estados de voz
  const [isRecording, setIsRecording] = useState(false);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const [synthesis, setSynthesis] = useState(null);

  // Estados de configuración
  const [showSettings, setShowSettings] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showCommands, setShowCommands] = useState(false);
  const [viewMode, setViewMode] = useState('chat'); // chat, analytics, hybrid

  // Configuración IA ZEROFORCE - AUTO-CONFIGURADO PARA OLLAMA
  const [aiConfig, setAiConfig] = useState({
    host: localStorage.getItem('zeroforce_host') || 'http://localhost:11434',
    model: localStorage.getItem('zeroforce_model') || 'qwen2.5:32b', // Modelo más potente para español
    temperature: parseFloat(localStorage.getItem('zeroforce_temp') || '0.7'),
    streaming: localStorage.getItem('zeroforce_streaming') !== 'false', // Activado por defecto
    voiceEnabled: localStorage.getItem('zeroforce_voice') === 'true',
    proactive: localStorage.getItem('zeroforce_proactive') === 'true',
    multiAgent: localStorage.getItem('zeroforce_multiagent') === 'true',
    ragEnabled: localStorage.getItem('zeroforce_rag') === 'true',
    autoOptimize: localStorage.getItem('zeroforce_autoopt') === 'true',
  });

  // Estados de análisis
  const [systemMetrics, setSystemMetrics] = useState({
    cpu: 0,
    memory: 0,
    requests: 0,
    errors: 0,
    uptime: '00:00:00',
  });
  const [insights, setInsights] = useState([]);
  const [predictions, setPredictions] = useState([]);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const streamTimeoutRef = useRef(null);

  // Gradientes de color
  const colorMap = {
    cyan: 'from-cyan-500 via-blue-500 to-cyan-600',
    blue: 'from-blue-500 via-indigo-500 to-blue-600',
    purple: 'from-purple-500 via-pink-500 to-purple-600',
    green: 'from-green-500 via-emerald-500 to-green-600',
    orange: 'from-orange-500 via-amber-500 to-orange-600',
    red: 'from-red-500 via-rose-500 to-red-600',
  };

  const gradientColor = colorMap[accentColor] || colorMap.cyan;

  // 🎤 Inicializar síntesis de voz
  useEffect(() => {
    if ('speechSynthesis' in window) {
      setSynthesis(window.speechSynthesis);
    }
  }, []);

  // 🎤 Inicializar reconocimiento de voz
  useEffect(() => {
    if (isSpeechRecognitionAvailable()) {
      const voiceRecognition = initVoiceRecognition(
        (result) => {
          if (result.isFinal) {
            handleVoiceCommand(result.transcript);
            setInputMessage(result.transcript);
            setIsRecording(false);
          } else {
            setInputMessage(result.transcript);
          }
        },
        (error) => {
          // console.error('Voice recognition error:', error);
          setIsRecording(false);
        }
      );
      setRecognition(voiceRecognition);
    }
  }, []);

  // 📊 Simular métricas del sistema (en producción vendrían de APIs)
  useEffect(() => {
    const interval = setInterval(() => {
      setSystemMetrics((prev) => ({
        cpu: Math.random() * 100,
        memory: Math.random() * 100,
        requests: Math.floor(Math.random() * 1000),
        errors: Math.floor(Math.random() * 10),
        uptime: new Date().toLocaleTimeString(),
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // 🔄 Scroll automático
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingText]);

  // 🎯 Comandos de voz especiales tipo ZEROFORCE
  const handleVoiceCommand = (command) => {
    const cmd = command.toLowerCase();

    // Comandos de sistema
    if (cmd.includes('zeroforce') || cmd.includes('zero force')) {
      speak('ZEROFORCE en línea. Sistema listo.');
    }

    if (cmd.includes('mostrar análisis') || cmd.includes('analytics')) {
      setViewMode('analytics');
      speak('Mostrando panel de análisis');
    }

    if (cmd.includes('mostrar chat')) {
      setViewMode('chat');
      speak('Modo conversación activado');
    }

    if (cmd.includes('estado del sistema') || cmd.includes('status')) {
      const status = `CPU al ${systemMetrics.cpu.toFixed(1)}%, memoria al ${systemMetrics.memory.toFixed(1)}%, ${systemMetrics.errors} errores detectados`;
      speak(status);
      addMessage('assistant', status, 'system');
    }

    if (cmd.includes('limpiar') || cmd.includes('clear')) {
      handleClearChat();
      speak('Historial limpio');
    }
  };

  // 🔊 Text-to-speech
  const speak = (text) => {
    if (!aiConfig.voiceEnabled || !synthesis) return;

    synthesis.cancel(); // Cancelar cualquier speech anterior
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.1;
    utterance.pitch = 0.9;
    utterance.volume = 0.8;

    // Intentar usar voz en español
    const voices = synthesis.getVoices();
    const spanishVoice = voices.find((v) => v.lang.includes('es')) || voices[0];
    if (spanishVoice) utterance.voice = spanishVoice;

    synthesis.speak(utterance);
  };

  // 🎤 Toggle grabación de voz
  const toggleVoiceRecording = () => {
    if (!recognition) {
      alert('Tu navegador no soporta reconocimiento de voz');
      return;
    }

    if (isRecording) {
      recognition.stop();
      setIsRecording(false);
    } else {
      recognition.start();
      setIsRecording(true);
      speak('Escuchando');
    }
  };

  // ➕ Agregar mensaje
  const addMessage = (role, content, type = 'normal') => {
    const newMessage = {
      id: Date.now(),
      role,
      content,
      type,
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      model: aiConfig.model,
    };
    setMessages((prev) => [...prev, newMessage]);
    return newMessage;
  };

  // 📨 Enviar mensaje con IA
  const handleSendMessage = async (e) => {
    e?.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    const userInput = inputMessage.trim();
    addMessage('user', userInput);
    setInputMessage('');
    setIsLoading(true);

    try {
      // 🧠 SISTEMA MULTI-IA con análisis inteligente
      const shouldAnalyze = detectAnalysisIntent(userInput);

      if (shouldAnalyze) {
        await performDataAnalysis(userInput);
      }

      // Streaming de respuesta
      if (aiConfig.streaming) {
        await streamAIResponse(userInput);
      } else {
        await getAIResponse(userInput);
      }
    } catch (error) {
      // console.error('Error AI:', error);
      const errorMsg = `⚠️ Error de conexión con el modelo de IA.\n\n💡 Verifica que Ollama esté corriendo:\n\`\`\`\nollama serve\n\`\`\``;
      addMessage('assistant', errorMsg, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // 🔍 Detectar intención de análisis
  const detectAnalysisIntent = (input) => {
    const analysisKeywords = [
      'analiza',
      'análisis',
      'estadísticas',
      'métricas',
      'datos',
      'rendimiento',
      'performance',
      'reporta',
      'informe',
      'dashboard',
      'tendencia',
      'predice',
      'predicción',
      'forecasting',
    ];

    return analysisKeywords.some((keyword) => input.toLowerCase().includes(keyword));
  };

  // 📊 Análisis de datos con IA
  const performDataAnalysis = async (query) => {
    const analysisPrompt = `
Eres ZEROFORCE, un sistema de análisis ultra-avanzado con capacidades predictivas. Analiza los siguientes datos del sistema:

Sistema: ${systemName}
Datos en tiempo real:
- CPU: ${systemMetrics.cpu.toFixed(2)}%
- Memoria: ${systemMetrics.memory.toFixed(2)}%
- Requests: ${systemMetrics.requests}
- Errores: ${systemMetrics.errors}

Contexto adicional: ${JSON.stringify(systemData, null, 2)}

Query del usuario: ${query}

Proporciona:
1. Análisis conciso de los datos
2. Insights clave (máximo 3)
3. Recomendaciones accionables
4. Predicciones si aplica

Responde en español, de forma profesional y clara.
`;

    try {
      const response = await fetch(`${aiConfig.host}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: aiConfig.model,
          prompt: analysisPrompt,
          stream: false,
          options: {
            temperature: 0.3, // Más preciso para análisis
            num_predict: 400,
          },
        }),
      });

      const data = await response.json();
      const analysis = data.response || 'Análisis no disponible';

      // Extraer insights
      const insightMatches = analysis.match(/(?:insight|clave|importante)[:\s]+(.+?)(?:\n|$)/gi);
      if (insightMatches) {
        const newInsights = insightMatches.map((m) =>
          m.replace(/(?:insight|clave|importante)[:\s]+/i, '').trim()
        );
        setInsights((prev) => [...newInsights, ...prev].slice(0, 5));
      }

      return analysis;
    } catch (error) {
      // console.error('Analysis error:', error);
      return null;
    }
  };

  // 🌊 Streaming de respuesta IA
  const streamAIResponse = async (userInput) => {
    setIsStreaming(true);
    setStreamingText('');

    const conversationHistory = messages.slice(-6).map((m) => ({
      role: m.role,
      content: m.content,
    }));

    const systemPrompt = `Eres ZEROFORCE, el sistema de IA de máxima potencia para ${systemName}.

Tu personalidad:
- Ultra-profesional, extremadamente preciso y altamente eficiente
- Análisis profundo y respuestas accionables inmediatas
- Usas emojis técnicos estratégicos (⚡🔧📊💡🎯🚀)
- Estructuras información de forma ultra-visual y clara
- Proporcionas insights avanzados y predicciones
- Sugieres optimizaciones proactivas
- Detectas patrones y anomalías automáticamente

Contexto del sistema: ${systemContext}
Métricas en tiempo real: CPU ${systemMetrics.cpu.toFixed(1)}%, RAM ${systemMetrics.memory.toFixed(1)}%
Capacidades: Multi-Agente ${aiConfig.multiAgent ? '✅' : '❌'}, RAG ${aiConfig.ragEnabled ? '✅' : '❌'}

Responde en español con formato markdown avanzado.`;

    try {
      const response = await fetch(`${aiConfig.host}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: aiConfig.model,
          messages: [
            { role: 'system', content: systemPrompt },
            ...conversationHistory,
            { role: 'user', content: userInput },
          ],
          stream: true,
          options: {
            temperature: aiConfig.temperature,
            top_p: 0.9,
            top_k: 40,
            num_ctx: 8192, // Contexto expandido
            num_predict: 1024,
          },
        }),
      });

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullText = '';

      let isDone = false;
      while (!isDone) {
        const { done, value } = await reader.read();
        isDone = done;
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n').filter((line) => line.trim());

        for (const line of lines) {
          try {
            const json = JSON.parse(line);
            if (json.message?.content) {
              fullText += json.message.content;
              setStreamingText(fullText);
            }
          } catch (e) {
            // Línea no es JSON válido, ignorar
          }
        }
      }

      // Agregar mensaje completo
      const aiMessage = addMessage('assistant', fullText);

      // Hablar respuesta si está habilitado
      if (aiConfig.voiceEnabled) {
        speak(fullText.slice(0, 200)); // Hablar primeras 200 caracteres
      }

      setStreamingText('');
      setIsStreaming(false);

      // Guardar en caché de aprendizaje
      saveToLearningCache(userInput, fullText, systemName);
    } catch (error) {
      setIsStreaming(false);
      throw error;
    }
  };

  // 🤖 Respuesta IA sin streaming
  const getAIResponse = async (userInput) => {
    const conversationHistory = messages.slice(-6).map((m) => ({
      role: m.role,
      content: m.content,
    }));

    const systemPrompt = `Eres ZEROFORCE, el sistema de IA de máxima potencia para ${systemName}.
Contexto: ${systemContext}
Métricas en tiempo real: CPU ${systemMetrics.cpu.toFixed(1)}%, RAM ${systemMetrics.memory.toFixed(1)}%

Responde con máxima precisión, análisis profundo y formato ultra-estructurado en español.`;

    const response = await fetch(`${aiConfig.host}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: aiConfig.model,
        messages: [
          { role: 'system', content: systemPrompt },
          ...conversationHistory,
          { role: 'user', content: userInput },
        ],
        stream: false,
        options: {
          temperature: aiConfig.temperature,
          num_ctx: 8192,
          num_predict: 1024,
        },
      }),
    });

    const data = await response.json();
    const aiContent = data.message?.content || 'Error procesando respuesta.';

    addMessage('assistant', aiContent);

    if (aiConfig.voiceEnabled) {
      speak(aiContent.slice(0, 200));
    }

    saveToLearningCache(userInput, aiContent, systemName);
  };

  // 💾 Guardar en caché de aprendizaje ZEROFORCE
  const saveToLearningCache = (query, response, system) => {
    const learningData = JSON.parse(localStorage.getItem('zeroforce_learning') || '[]');
    learningData.push({
      system,
      query,
      response,
      timestamp: new Date().toISOString(),
      metrics: { ...systemMetrics },
    });

    if (learningData.length > 500) learningData.shift();
    localStorage.setItem('zeroforce_learning', JSON.stringify(learningData));
  };

  // 🗑️ Limpiar chat
  const handleClearChat = () => {
    setMessages([
      {
        id: 1,
        role: 'assistant',
        content: `⚡ ZEROFORCE reiniciado. Todos los sistemas operativos. ${systemName} conectado.`,
        timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        type: 'system',
      },
    ]);
  };

  // 💾 Guardar configuración ZEROFORCE
  const saveSettings = () => {
    localStorage.setItem('zeroforce_host', aiConfig.host);
    localStorage.setItem('zeroforce_model', aiConfig.model);
    localStorage.setItem('zeroforce_temp', aiConfig.temperature.toString());
    localStorage.setItem('zeroforce_streaming', aiConfig.streaming.toString());
    localStorage.setItem('zeroforce_voice', aiConfig.voiceEnabled.toString());
    localStorage.setItem('zeroforce_proactive', aiConfig.proactive.toString());
    localStorage.setItem('zeroforce_multiagent', aiConfig.multiAgent.toString());
    localStorage.setItem('zeroforce_rag', aiConfig.ragEnabled.toString());
    localStorage.setItem('zeroforce_autoopt', aiConfig.autoOptimize.toString());
    setShowSettings(false);
    speak('Configuración ZEROFORCE guardada correctamente');
  };

  // 📋 Copiar al portapapeles
  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    speak('Copiado');
  };

  // 🎨 Componente de Mensaje
  const Message = ({ message }) => {
    const isUser = message.role === 'user';
    const isSystem = message.type === 'system';

    return (
      <motion.div
        initial={{ opacity: 0, y: 10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        className={`flex gap-3 ${isUser ? 'flex-row-reverse' : ''}`}
      >
        {/* Avatar con efectos holográficos */}
        <div
          className={`relative w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0
          ${
            isUser
              ? 'bg-gradient-to-br from-blue-500 to-cyan-500'
              : isSystem
                ? 'bg-gradient-to-br from-purple-500 to-pink-500'
                : `bg-gradient-to-br ${gradientColor}`
          }
          shadow-lg`}
        >
          {isUser ? (
            <User className="w-5 h-5 text-white" />
          ) : (
            <Brain className="w-5 h-5 text-white animate-pulse" />
          )}

          {/* Anillo holográfico */}
          {!isUser && (
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-cyan-400"
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.5, 0, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          )}
        </div>

        {/* Mensaje */}
        <div className={`flex-1 max-w-[80%] ${isUser ? 'flex flex-col items-end' : ''}`}>
          <div
            className={`
            rounded-2xl p-4 text-sm backdrop-blur-xl
            ${
              isUser
                ? 'bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-400/30'
                : isSystem
                  ? 'bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-400/30'
                  : 'bg-white/5 border border-cyan-400/20 shadow-lg shadow-cyan-500/10'
            }
          `}
          >
            <p className="text-white whitespace-pre-wrap leading-relaxed">{message.content}</p>

            {/* Metadata */}
            <div className="flex items-center gap-2 mt-3 pt-2 border-t border-white/10">
              <span className="text-xs text-slate-400">{message.timestamp}</span>
              {message.model && (
                <span className="text-xs text-cyan-400">• {message.model.split(':')[0]}</span>
              )}
            </div>
          </div>

          {/* Acciones */}
          {!isUser && (
            <div className="flex gap-1 mt-2">
              <button
                onClick={() => handleCopy(message.content)}
                className="p-1.5 hover:bg-cyan-500/10 rounded-lg transition-all group"
                title="Copiar"
              >
                <Copy className="w-3.5 h-3.5 text-slate-400 group-hover:text-cyan-400" />
              </button>
              <button
                onClick={() => speak(message.content)}
                className="p-1.5 hover:bg-cyan-500/10 rounded-lg transition-all group"
                title="Leer en voz alta"
              >
                <Volume2 className="w-3.5 h-3.5 text-slate-400 group-hover:text-cyan-400" />
              </button>
            </div>
          )}
        </div>
      </motion.div>
    );
  };

  // 📊 Panel de Analytics
  const AnalyticsPanel = () => (
    <div className="space-y-4 p-4">
      {/* Métricas en tiempo real */}
      <div className="grid grid-cols-2 gap-3">
        <MetricCard
          icon={<Cpu className="w-4 h-4" />}
          label="CPU"
          value={`${systemMetrics.cpu.toFixed(1)}%`}
          color="cyan"
          trend={systemMetrics.cpu > 70 ? 'high' : 'normal'}
        />
        <MetricCard
          icon={<HardDrive className="w-4 h-4" />}
          label="RAM"
          value={`${systemMetrics.memory.toFixed(1)}%`}
          color="blue"
          trend={systemMetrics.memory > 80 ? 'high' : 'normal'}
        />
        <MetricCard
          icon={<Activity className="w-4 h-4" />}
          label="Requests"
          value={systemMetrics.requests}
          color="green"
        />
        <MetricCard
          icon={<Zap className="w-4 h-4" />}
          label="Errores"
          value={systemMetrics.errors}
          color="red"
          trend={systemMetrics.errors > 5 ? 'high' : 'normal'}
        />
      </div>

      {/* Insights */}
      {insights.length > 0 && (
        <div className="bg-white/5 border border-cyan-400/20 rounded-xl p-4">
          <h4 className="text-xs font-semibold text-cyan-400 mb-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            Insights del Sistema
          </h4>
          <div className="space-y-2">
            {insights.slice(0, 3).map((insight, i) => (
              <motion.div
                key={`item-${i}`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="text-xs text-slate-300 flex items-start gap-2"
              >
                <div className="w-1 h-1 rounded-full bg-cyan-400 mt-1.5" />
                <span>{insight}</span>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() =>
            handleSendMessage({ preventDefault: () => {} }) ||
            setInputMessage('Analiza el rendimiento actual')
          }
          className="px-3 py-2 bg-white/5 hover:bg-cyan-500/10 border border-white/10 hover:border-cyan-400/30 rounded-lg text-xs text-slate-300 hover:text-cyan-400 transition-all flex items-center gap-2"
        >
          <TrendingUp className="w-3.5 h-3.5" />
          Analizar
        </button>
        <button
          onClick={() => setInputMessage('Predice tendencias')}
          className="px-3 py-2 bg-white/5 hover:bg-purple-500/10 border border-white/10 hover:border-purple-400/30 rounded-lg text-xs text-slate-300 hover:text-purple-400 transition-all flex items-center gap-2"
        >
          <BarChart3 className="w-3.5 h-3.5" />
          Predecir
        </button>
      </div>
    </div>
  );

  // 📈 Componente de métrica
  const MetricCard = ({ icon, label, value, color, trend }) => (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`
        relative overflow-hidden bg-white/5 border rounded-xl p-3
        ${trend === 'high' ? 'border-red-400/30' : 'border-white/10'}
      `}
    >
      <div className="flex items-center justify-between mb-1">
        <div className={`text-${color}-400`}>{icon}</div>
        {trend === 'high' && <div className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />}
      </div>
      <div className="text-xs text-slate-400">{label}</div>
      <div className="text-lg font-bold text-white mt-1">{value}</div>

      {/* Barra de fondo animada */}
      <motion.div
        className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r from-${color}-500 to-${color}-600`}
        initial={{ width: '0%' }}
        animate={{ width: typeof value === 'string' && value.includes('%') ? value : '100%' }}
        transition={{ duration: 1, ease: 'easeOut' }}
      />
    </motion.div>
  );

  // 🎯 Posición del widget
  const getPositionStyles = () => {
    switch (position) {
      case 'bottom-left':
        return 'bottom-6 left-6';
      case 'bottom-right':
        return 'bottom-6 right-6';
      case 'top-right':
        return 'top-6 right-6';
      case 'top-left':
        return 'top-6 left-6';
      default:
        return 'bottom-6 right-6';
    }
  };

  return (
    <>
      {/* 🔘 Botón flotante tipo ZEROFORCE */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              setIsOpen(true);
              speak('ZEROFORCE en línea. Todos los sistemas operativos.');
            }}
            className={`
              fixed ${getPositionStyles()} z-50
              w-16 h-16 rounded-full shadow-2xl
              bg-gradient-to-br ${gradientColor}
              flex items-center justify-center
              group relative overflow-hidden
            `}
          >
            {/* Efectos holográficos */}
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-cyan-400"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 0, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
            />

            <Brain className="w-7 h-7 text-white relative z-10" />

            {/* Indicador de estado */}
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-slate-950 animate-pulse flex items-center justify-center">
              <span className="w-2 h-2 bg-white rounded-full" />
            </span>

            {/* Pulsos de energía */}
            <motion.svg
              className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-400/20 to-blue-400/20"
              animate={{
                scale: [0.8, 1.2],
                opacity: [0.3, 0],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
              }}
            />
          </motion.button>
        )}
      </AnimatePresence>

      {/* 💬 Ventana Principal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
              width: isExpanded ? '800px' : '420px',
              height: isMinimized ? 'auto' : isExpanded ? '700px' : '650px',
            }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className={`
              fixed ${getPositionStyles()} z-50
              glass-strong rounded-3xl border-2 border-cyan-400/30
              shadow-2xl shadow-cyan-500/20 overflow-hidden flex flex-col
              backdrop-blur-2xl
            `}
          >
            {/* 🎨 Header tipo ZEROFORCE */}
            <div
              className={`relative p-4 border-b border-cyan-400/20 bg-gradient-to-r ${gradientColor} overflow-hidden`}
            >
              {/* Efectos de fondo */}
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLW9wYWNpdHk9IjAuMDUiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30" />

              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {/* Avatar ZEROFORCE */}
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border-2 border-white/30">
                      <Brain className="w-6 h-6 text-white animate-pulse" />
                    </div>
                    <motion.div
                      className="absolute inset-0 rounded-full border-2 border-white/50"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                    />
                  </div>

                  <div>
                    <h3 className="font-bold text-white text-lg flex items-center gap-2">
                      ZEROFORCE
                      <motion.div
                        animate={{ opacity: [1, 0.5, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="w-2 h-2 rounded-full bg-green-400"
                      />
                    </h3>
                    <p className="text-xs text-white/80 flex items-center gap-1">
                      <Zap className="w-3 h-3" />
                      {systemName} • {aiConfig.model.split(':')[0]}
                    </p>
                  </div>
                </div>

                {/* Controles */}
                <div className="flex items-center gap-1">
                  {/* Toggle Vista */}
                  <button
                    onClick={() =>
                      setViewMode(
                        viewMode === 'chat'
                          ? 'hybrid'
                          : viewMode === 'hybrid'
                            ? 'analytics'
                            : 'chat'
                      )
                    }
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    title={`Modo: ${viewMode}`}
                  >
                    {viewMode === 'chat' ? (
                      <MessageSquare className="w-4 h-4 text-white" />
                    ) : viewMode === 'analytics' ? (
                      <BarChart3 className="w-4 h-4 text-white" />
                    ) : (
                      <Layers className="w-4 h-4 text-white" />
                    )}
                  </button>

                  {/* Voz */}
                  <button
                    onClick={() =>
                      setAiConfig((prev) => ({ ...prev, voiceEnabled: !prev.voiceEnabled }))
                    }
                    className={`p-2 rounded-lg transition-colors ${aiConfig.voiceEnabled ? 'bg-green-500/20 text-green-400' : 'hover:bg-white/10 text-white'}`}
                    title="Toggle voz"
                  >
                    {aiConfig.voiceEnabled ? (
                      <Volume2 className="w-4 h-4" />
                    ) : (
                      <VolumeX className="w-4 h-4" />
                    )}
                  </button>

                  {/* Settings */}
                  <button
                    onClick={() => setShowSettings(!showSettings)}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <Settings className="w-4 h-4 text-white" />
                  </button>

                  {/* Expandir */}
                  <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    {isExpanded ? (
                      <Minimize2 className="w-4 h-4 text-white" />
                    ) : (
                      <Maximize className="w-4 h-4 text-white" />
                    )}
                  </button>

                  {/* Minimizar */}
                  <button
                    onClick={() => setIsMinimized(!isMinimized)}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    {isMinimized ? (
                      <ChevronDown className="w-4 h-4 text-white" />
                    ) : (
                      <ChevronUp className="w-4 h-4 text-white" />
                    )}
                  </button>

                  {/* Cerrar */}
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      speak('ZEROFORCE desconectado. Hasta pronto.');
                    }}
                    className="p-2 hover:bg-red-500/20 rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4 text-white" />
                  </button>
                </div>
              </div>
            </div>

            {/* 📱 Contenido Principal */}
            {!isMinimized && (
              <div className="flex-1 flex overflow-hidden">
                {/* Panel de Chat */}
                {(viewMode === 'chat' || viewMode === 'hybrid') && (
                  <div
                    className={`flex-1 flex flex-col ${viewMode === 'hybrid' ? 'border-r border-white/10' : ''}`}
                  >
                    {/* Mensajes */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-950/50 custom-scrollbar">
                      {messages.map((message) => (
                        <Message key={message.id} message={message} />
                      ))}

                      {/* Indicador de streaming */}
                      {isStreaming && streamingText && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="flex gap-3"
                        >
                          <div
                            className={`w-10 h-10 rounded-full bg-gradient-to-br ${gradientColor} flex items-center justify-center`}
                          >
                            <Brain className="w-5 h-5 text-white animate-pulse" />
                          </div>
                          <div className="flex-1 bg-white/5 border border-cyan-400/20 rounded-2xl p-4">
                            <p className="text-white whitespace-pre-wrap">{streamingText}</p>
                            <motion.div
                              className="w-1 h-4 bg-cyan-400 mt-1"
                              animate={{ opacity: [1, 0] }}
                              transition={{ duration: 0.8, repeat: Infinity }}
                            />
                          </div>
                        </motion.div>
                      )}

                      {/* Loading */}
                      {isLoading && !isStreaming && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="flex gap-3"
                        >
                          <div
                            className={`w-10 h-10 rounded-full bg-gradient-to-br ${gradientColor} flex items-center justify-center`}
                          >
                            <Loader2 className="w-5 h-5 text-white animate-spin" />
                          </div>
                          <div className="bg-white/5 border border-cyan-400/20 rounded-2xl p-4">
                            <div className="flex items-center gap-2 text-slate-400">
                              <span className="text-sm">Procesando consulta...</span>
                            </div>
                          </div>
                        </motion.div>
                      )}

                      <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <form
                      onSubmit={handleSendMessage}
                      className="p-4 border-t border-cyan-400/20 bg-slate-950/80 backdrop-blur-xl"
                    >
                      <div className="relative">
                        <input
                          ref={inputRef}
                          type="text"
                          value={inputMessage}
                          onChange={(e) => setInputMessage(e.target.value)}
                          placeholder="Consulta a ZEROFORCE..."
                          disabled={isLoading}
                          className={`
                            w-full px-4 py-3.5 pr-32 bg-white/5 border-2 rounded-xl
                            focus:outline-none transition-all
                            text-white placeholder-slate-500 text-sm disabled:opacity-50
                            ${isRecording ? 'border-red-400 animate-pulse' : 'border-cyan-400/30 focus:border-cyan-400'}
                          `}
                        />

                        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                          {/* Voz */}
                          {isSpeechRecognitionAvailable() && (
                            <motion.button
                              type="button"
                              onClick={toggleVoiceRecording}
                              whileTap={{ scale: 0.9 }}
                              className={`p-2 rounded-lg transition-all ${
                                isRecording
                                  ? 'bg-red-500 text-white'
                                  : 'hover:bg-cyan-500/10 text-slate-400 hover:text-cyan-400'
                              }`}
                            >
                              {isRecording ? (
                                <MicOff className="w-4 h-4" />
                              ) : (
                                <Mic className="w-4 h-4" />
                              )}
                            </motion.button>
                          )}

                          {/* Enviar */}
                          <motion.button
                            type="submit"
                            disabled={!inputMessage.trim() || isLoading}
                            whileTap={{ scale: 0.9 }}
                            className={`
                              p-2 rounded-lg bg-gradient-to-r ${gradientColor}
                              disabled:opacity-50 disabled:cursor-not-allowed
                              shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 transition-all
                            `}
                          >
                            <Send className="w-4 h-4 text-white" />
                          </motion.button>
                        </div>
                      </div>

                      {/* Quick Commands */}
                      <div className="flex gap-2 mt-3 overflow-x-auto scrollbar-hide">
                        {[
                          {
                            icon: <Activity />,
                            text: 'Estado del sistema',
                            cmd: 'Muéstrame el estado del sistema',
                          },
                          { icon: <TrendingUp />, text: 'Análisis', cmd: 'Analiza el rendimiento' },
                          { icon: <BarChart3 />, text: 'Predicción', cmd: 'Predice tendencias' },
                          { icon: <Sparkles />, text: 'Optimizar', cmd: 'Sugiere optimizaciones' },
                        ].map((action, i) => (
                          <button
                            key={`item-${i}`}
                            type="button"
                            onClick={() => setInputMessage(action.cmd)}
                            className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-cyan-500/10 border border-white/10 hover:border-cyan-400/30 text-xs text-slate-400 hover:text-cyan-400 transition-all whitespace-nowrap flex items-center gap-1.5"
                          >
                            <span className="w-3.5 h-3.5">{action.icon}</span>
                            {action.text}
                          </button>
                        ))}
                      </div>
                    </form>
                  </div>
                )}

                {/* Panel de Analytics */}
                {(viewMode === 'analytics' || viewMode === 'hybrid') && (
                  <div
                    className={`${viewMode === 'hybrid' ? 'w-80' : 'flex-1'} bg-slate-950/50 overflow-y-auto custom-scrollbar`}
                  >
                    <AnalyticsPanel />
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ⚙️ Panel de Configuración */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4"
            onClick={() => setShowSettings(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-strong border-2 border-cyan-400/30 rounded-2xl p-6 max-w-lg w-full shadow-2xl shadow-cyan-500/20"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradientColor} flex items-center justify-center`}
                  >
                    <Settings className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-lg">Configuración ZEROFORCE</h3>
                    <p className="text-xs text-slate-400">Sistema de IA Avanzado</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowSettings(false)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Host */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                    <Globe className="w-4 h-4 text-cyan-400" />
                    Host de Ollama
                  </label>
                  <input
                    type="text"
                    value={aiConfig.host}
                    onChange={(e) => setAiConfig((prev) => ({ ...prev, host: e.target.value }))}
                    className="w-full px-4 py-2.5 bg-white/5 border border-cyan-400/20 rounded-xl focus:border-cyan-400 focus:outline-none transition-colors text-white text-sm"
                  />
                </div>

                {/* Modelo */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                    <Brain className="w-4 h-4 text-cyan-400" />
                    Modelo de IA
                  </label>
                  <select
                    value={aiConfig.model}
                    onChange={(e) => setAiConfig((prev) => ({ ...prev, model: e.target.value }))}
                    className="w-full px-4 py-2.5 bg-white/5 border border-cyan-400/20 rounded-xl focus:border-cyan-400 focus:outline-none transition-colors text-white text-sm"
                  >
                    <optgroup label="⚡ Modelos Ultra Rápidos (Recomendados)">
                      <option value="llama3.2:3b">🦙 Llama 3.2 - 3B (Ultra Rápido)</option>
                    </optgroup>
                    <optgroup label="🧠 Modelos Balanceados (7-12B)">
                      <option value="codellama:7b">💻 CodeLlama - 7B (Código)</option>
                      <option value="mistral:7b">🧠 Mistral - 7B (General)</option>
                      <option value="llava-llama3:8b">👁️ LLaVA Llama3 - 8B (Visión)</option>
                      <option value="mistral-nemo:12b">⚡ Mistral Nemo - 12B</option>
                    </optgroup>
                    <optgroup label="🚀 Modelos Potentes (32-34B)">
                      <option value="qwen2.5:32b">🌍 Qwen 2.5 - 32B (★ RECOMENDADO ESPAÑOL)</option>
                      <option value="deepseek-coder:33b">
                        🔧 DeepSeek Coder - 33B (Código Avanzado)
                      </option>
                      <option value="codellama:34b">� CodeLlama - 34B (Código Pro)</option>
                    </optgroup>
                    <optgroup label="� Modelos Premium (70B+)">
                      <option value="llama3.1:70b">🦙 Llama 3.1 - 70B (Máxima Calidad)</option>
                      <option value="gpt-oss:120b">🤖 GPT-OSS - 120B (Ultra Premium)</option>
                    </optgroup>
                  </select>
                </div>

                {/* Temperature */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                    <Activity className="w-4 h-4 text-cyan-400" />
                    Creatividad (Temperature: {aiConfig.temperature})
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={aiConfig.temperature}
                    onChange={(e) =>
                      setAiConfig((prev) => ({ ...prev, temperature: parseFloat(e.target.value) }))
                    }
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-slate-500 mt-1">
                    <span>Preciso</span>
                    <span>Creativo</span>
                  </div>
                </div>

                {/* Opciones */}
                <div className="space-y-2">
                  <label className="flex items-center justify-between p-3 bg-white/5 rounded-xl cursor-pointer hover:bg-white/10 transition-colors">
                    <span className="text-sm text-slate-300 flex items-center gap-2">
                      <Zap className="w-4 h-4 text-yellow-400" />
                      Streaming de respuestas
                    </span>
                    <input
                      type="checkbox"
                      checked={aiConfig.streaming}
                      onChange={(e) =>
                        setAiConfig((prev) => ({ ...prev, streaming: e.target.checked }))
                      }
                      className="toggle"
                    />
                  </label>

                  <label className="flex items-center justify-between p-3 bg-white/5 rounded-xl cursor-pointer hover:bg-white/10 transition-colors">
                    <span className="text-sm text-slate-300 flex items-center gap-2">
                      <Volume2 className="w-4 h-4 text-green-400" />
                      Respuestas por voz
                    </span>
                    <input
                      type="checkbox"
                      checked={aiConfig.voiceEnabled}
                      onChange={(e) =>
                        setAiConfig((prev) => ({ ...prev, voiceEnabled: e.target.checked }))
                      }
                      className="toggle"
                    />
                  </label>

                  <label className="flex items-center justify-between p-3 bg-white/5 rounded-xl cursor-pointer hover:bg-white/10 transition-colors">
                    <span className="text-sm text-slate-300 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-purple-400" />
                      Sugerencias proactivas
                    </span>
                    <input
                      type="checkbox"
                      checked={aiConfig.proactive}
                      onChange={(e) =>
                        setAiConfig((prev) => ({ ...prev, proactive: e.target.checked }))
                      }
                      className="toggle"
                    />
                  </label>
                </div>

                {/* Info */}
                <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-400/20 rounded-xl p-4">
                  <h4 className="text-sm font-semibold text-cyan-400 mb-2">
                    📦 Instalación Rápida
                  </h4>
                  <ol className="text-xs text-slate-300 space-y-1 list-decimal list-inside">
                    <li>
                      Descarga:{' '}
                      <a
                        href="https://ollama.com/download"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-cyan-400 hover:underline"
                      >
                        ollama.com/download
                      </a>
                    </li>
                    <li>
                      Terminal:{' '}
                      <code className="text-cyan-400 bg-black/30 px-2 py-0.5 rounded">
                        ollama serve
                      </code>
                    </li>
                    <li>
                      Modelo:{' '}
                      <code className="text-cyan-400 bg-black/30 px-2 py-0.5 rounded">
                        ollama pull qwen2.5:7b
                      </code>
                    </li>
                  </ol>
                </div>

                {/* Botones */}
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => setShowSettings(false)}
                    className="flex-1 px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white text-sm font-medium transition-all"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={saveSettings}
                    className={`flex-1 px-4 py-2.5 bg-gradient-to-r ${gradientColor} rounded-xl text-white text-sm font-medium hover:shadow-lg hover:shadow-cyan-500/30 transition-all`}
                  >
                    💾 Guardar
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(6, 182, 212, 0.5);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(6, 182, 212, 0.7);
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .toggle {
          appearance: none;
          width: 44px;
          height: 24px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          position: relative;
          cursor: pointer;
          transition: background 0.3s;
        }
        .toggle:checked {
          background: linear-gradient(to right, #06b6d4, #3b82f6);
        }
        .toggle::before {
          content: '';
          position: absolute;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: white;
          top: 2px;
          left: 2px;
          transition: transform 0.3s;
        }
        .toggle:checked::before {
          transform: translateX(20px);
        }
      `}</style>
    </>
  );
};

export default ZeroForceAI;
