import { useEffect, useRef, useState } from 'react';

import { AnimatePresence, motion } from 'framer-motion';
import {
  Brain,
  Check,
  Copy,
  Download,
  File,
  FileText,
  Image as ImageIcon,
  Loader2,
  Maximize2,
  MessageSquare,
  Mic,
  MicOff,
  Minimize2,
  Paperclip,
  Send,
  Settings,
  Sparkles,
  Trash2,
  User,
  X,
} from 'lucide-react';

import { initVoiceRecognition, isSpeechRecognitionAvailable } from '../../utils/voiceRecognition';

/**
 * AIAssistant - Componente de asistente IA reutilizable
 * Basado en Synapse, puede integrarse en cualquier sistema
 *
 * Props:
 * - systemName: Nombre del sistema (ej: "FlowDistributor", "ShadowPrime")
 * - systemContext: Contexto específico del sistema para el AI
 * - accentColor: Color de acento (ej: "blue", "purple", "green")
 * - position: Posición del chat ("bottom-right", "bottom-left", "side")
 */

const AIAssistant = ({
  systemName = 'Sistema',
  systemContext = '',
  accentColor = 'orange',
  position = 'bottom-right',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'assistant',
      content: `¡Hola! Soy tu asistente IA para ${systemName}. ¿En qué puedo ayudarte hoy?`,
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const [attachedFiles, setAttachedFiles] = useState([]);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [ollamaHost, setOllamaHost] = useState(
    localStorage.getItem('ollama_host') || 'http://localhost:11434'
  );
  const [ollamaModel, setOllamaModel] = useState(
    localStorage.getItem('ollama_model') || 'llama3.2:latest'
  );
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const fileInputRef = useRef(null);

  const colorMap = {
    blue: 'from-blue-500 to-cyan-500',
    purple: 'from-purple-500 to-pink-500',
    green: 'from-green-500 to-emerald-500',
    orange: 'from-orange-500 to-amber-500',
    red: 'from-red-500 to-rose-500',
    cyan: 'from-cyan-500 to-teal-500',
  };

  const gradientColor = colorMap[accentColor] || colorMap.orange;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && !isMinimized && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen, isMinimized]);

  // 🎤 Inicializar reconocimiento de voz
  useEffect(() => {
    if (isSpeechRecognitionAvailable()) {
      const voiceRecognition = initVoiceRecognition(
        (result) => {
          if (result.isFinal) {
            setInputMessage(result.transcript);
            setIsRecording(false);
          } else {
            // Mostrar transcripción en tiempo real (opcional)
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
    }
  };

  const handleSendMessage = async (e) => {
    e?.preventDefault();
    if ((!inputMessage.trim() && attachedFiles.length === 0) || isLoading) return;

    const userMessage = {
      id: messages.length + 1,
      role: 'user',
      content: inputMessage.trim(),
      attachments: attachedFiles.map((f) => ({
        name: f.name,
        size: f.size,
        type: f.type,
      })),
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    };

    const currentInput = inputMessage.trim();
    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');
    setAttachedFiles([]);
    setIsLoading(true);

    try {
      // 🧠 OLLAMA LOCAL AI - Modelos de última generación ejecutándose localmente
      const OLLAMA_HOST = localStorage.getItem('ollama_host') || 'http://localhost:11434';
      const OLLAMA_MODEL = localStorage.getItem('ollama_model') || 'llama3.2:latest';

      // Construir contexto con historial para aprendizaje continuo
      const conversationHistory = messages.slice(-8).map((m) => ({
        role: m.role,
        content: m.content,
      }));

      // Sistema de optimización: aprende patrones del usuario
      const systemPrompt = `Eres un asistente IA especializado en ${systemName}.
Contexto del sistema: ${systemContext || 'Sistema de gestión empresarial'}

Instrucciones:
- Responde en español de forma clara y profesional
- Usa emojis relevantes para mejor UX
- Proporciona ejemplos prácticos cuando sea posible
- Si no sabes algo, sugiere alternativas
- Aprende de conversaciones previas para mejorar respuestas

Datos de aprendizaje previo: ${getLearningInsights()}`;

      const response = await fetch(`${OLLAMA_HOST}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: OLLAMA_MODEL,
          messages: [
            { role: 'system', content: systemPrompt },
            ...conversationHistory,
            { role: 'user', content: currentInput },
          ],
          stream: false,
          options: {
            temperature: 0.8,
            top_p: 0.9,
            top_k: 40,
            num_ctx: 4096, // Contexto expandido
            num_predict: 512,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`Ollama error: ${response.status}`);
      }

      const data = await response.json();
      const aiContent = data.message?.content || '❌ Error procesando respuesta del modelo local.';

      const aiMessage = {
        id: messages.length + 2,
        role: 'assistant',
        content: aiContent,
        model: OLLAMA_MODEL,
        timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMessage]);

      // 📊 Sistema de aprendizaje continuo
      saveToLearningCache(currentInput, aiContent, systemName);
    } catch (error) {
      // console.error('Error calling Ollama:', error);
      // 🔄 Fallback inteligente basado en aprendizaje previo
      const learningData = JSON.parse(localStorage.getItem('ai_learning_data') || '[]');
      const similarQuery = findSimilarQuery(learningData, currentInput, systemName);

      const fallbackContent =
        similarQuery?.response ||
        `🔴 **No se pudo conectar con Ollama**\n\n` +
          `💡 **Instala Ollama (100% gratis y local):**\n\n` +
          `**1. Descarga e instala:**\n` +
          `   → Windows: https://ollama.com/download\n` +
          `   → Ejecuta: \`ollama serve\` (corre en background)\n\n` +
          `**2. Descarga un modelo potente:**\n` +
          `   → \`ollama pull llama3.2\` (3B parámetros, rápido)\n` +
          `   → \`ollama pull mistral\` (7B, muy inteligente)\n` +
          `   → \`ollama pull codellama\` (código especializado)\n` +
          `   → \`ollama pull phi3\` (3.8B, Microsoft)\n` +
          `   → \`ollama pull qwen2.5\` (7B, multilingüe)\n\n` +
          `**3. Modelos disponibles:**\n` +
          `   🚀 llama3.2 - Rápido y eficiente (recomendado)\n` +
          `   🧠 mistral - Muy inteligente, balance perfecto\n` +
          `   💻 codellama - Especializado en código\n` +
          `   ⚡ phi3 - Ultra rápido de Microsoft\n` +
          `   🌍 qwen2.5 - Excelente en español\n\n` +
          `**4. Ventajas:**\n` +
          `   ✅ 100% gratis, sin límites\n` +
          `   ✅ Privacidad total (todo local)\n` +
          `   ✅ Sin internet necesario\n` +
          `   ✅ Modelos de última generación\n` +
          `   ✅ Aprendizaje continuo optimizado\n\n` +
          `⚙️ **Configuración:**\n` +
          `   Haz clic en ⚙️ arriba para cambiar el modelo.\n\n` +
          `${similarQuery ? `📚 Respuesta basada en aprendizaje previo:\n${similarQuery.response}` : ''}`;

      const aiMessage = {
        id: messages.length + 2,
        role: 'assistant',
        content: fallbackContent,
        timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // 📚 Obtener insights de aprendizaje previo
  const getLearningInsights = () => {
    const learningData = JSON.parse(localStorage.getItem('ai_learning_data') || '[]');
    const relevantData = learningData
      .filter((d) => d.system === systemName && d.useful === true)
      .slice(-5);

    if (relevantData.length === 0) return 'Sin datos previos';

    return relevantData.map((d) => `Q: ${d.query} | A: ${d.response.slice(0, 100)}...`).join(' | ');
  };

  // 🔍 Encontrar query similar en caché
  const findSimilarQuery = (learningData, query, system) => {
    const systemData = learningData.filter((d) => d.system === system);
    const words = query.toLowerCase().split(' ');

    return systemData.find((d) => {
      const dWords = d.query.toLowerCase();
      return words.some((word) => word.length > 3 && dWords.includes(word));
    });
  };

  // 💾 Guardar en caché de aprendizaje
  const saveToLearningCache = (query, response, system) => {
    const learningData = JSON.parse(localStorage.getItem('ai_learning_data') || '[]');
    learningData.push({
      system: system,
      query: query,
      response: response,
      timestamp: new Date().toISOString(),
      useful: null,
    });

    // Mantener últimas 200 conversaciones
    if (learningData.length > 200) learningData.shift();
    localStorage.setItem('ai_learning_data', JSON.stringify(learningData));
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // 🔧 Configuración Ollama
  const saveOllamaSettings = () => {
    localStorage.setItem('ollama_host', ollamaHost);
    localStorage.setItem('ollama_model', ollamaModel);
    setShowSettings(false);
    alert(`✅ Configuración guardada:\n🌐 Host: ${ollamaHost}\n🤖 Modelo: ${ollamaModel}`);
  };

  // 🔄 Verificar modelos disponibles
  const checkAvailableModels = async () => {
    try {
      const host = localStorage.getItem('ollama_host') || 'http://localhost:11434';
      const response = await fetch(`${host}/api/tags`);
      const data = await response.json();
      const models = data.models || [];
      alert(
        `📦 Modelos disponibles:\n\n${models.map((m) => `• ${m.name}`).join('\n')}\n\nTotal: ${models.length} modelos`
      );
    } catch (error) {
      alert('❌ Error: Ollama no está corriendo.\n\nEjecuta: ollama serve');
    }
  };

  // 👍 Marcar respuesta como útil (aprendizaje)
  const markResponseUseful = (messageId, useful) => {
    const learningData = JSON.parse(localStorage.getItem('ai_learning_data') || '[]');
    const updated = learningData.map((d) => {
      if (d.timestamp === messages.find((m) => m.id === messageId)?.timestamp) {
        return { ...d, useful };
      }
      return d;
    });
    localStorage.setItem('ai_learning_data', JSON.stringify(updated));
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: 1,
        role: 'assistant',
        content: `¡Hola! Soy tu asistente IA para ${systemName}. ¿En qué puedo ayudarte hoy?`,
        timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
    setAttachedFiles([]);
  };

  // 📎 Manejar adjuntos de archivos
  const handleFileAttach = (event) => {
    const files = Array.from(event.target.files || []);
    const newFiles = files.map((file) => ({
      id: Date.now() + Math.random(),
      name: file.name,
      size: file.size,
      type: file.type,
      file: file,
      preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : null,
    }));
    setAttachedFiles((prev) => [...prev, ...newFiles]);
  };

  const removeFile = (fileId) => {
    setAttachedFiles((prev) => {
      const file = prev.find((f) => f.id === fileId);
      if (file?.preview) URL.revokeObjectURL(file.preview);
      return prev.filter((f) => f.id !== fileId);
    });
  };

  // 📥 Exportar conversación
  const exportConversation = (format = 'json') => {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `${systemName}_chat_${timestamp}`;

    if (format === 'json') {
      const data = {
        system: systemName,
        exportDate: new Date().toISOString(),
        messages: messages.map((m) => ({
          role: m.role,
          content: m.content,
          timestamp: m.timestamp,
        })),
      };
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${filename}.json`;
      link.click();
      URL.revokeObjectURL(url);
    } else if (format === 'txt') {
      const text = messages
        .map((m) => `[${m.timestamp}] ${m.role === 'user' ? 'Tú' : 'AI'}: ${m.content}`)
        .join('\n\n');
      const blob = new Blob([text], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${filename}.txt`;
      link.click();
      URL.revokeObjectURL(url);
    } else if (format === 'md') {
      const markdown =
        `# Conversación con AI - ${systemName}\n\n` +
        `**Fecha**: ${new Date().toLocaleString()}\n\n` +
        `---\n\n` +
        messages
          .map(
            (m) =>
              `### ${m.role === 'user' ? '👤 Usuario' : '🤖 AI'} - ${m.timestamp}\n\n${m.content}\n`
          )
          .join('\n');
      const blob = new Blob([markdown], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${filename}.md`;
      link.click();
      URL.revokeObjectURL(url);
    }
    setShowExportMenu(false);
  };

  const Message = ({ message }) => {
    const isUser = message.role === 'user';

    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`flex gap-3 ${isUser ? 'flex-row-reverse' : ''}`}
      >
        {/* Avatar */}
        <div
          className={`
          w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0
          ${
            isUser
              ? 'bg-gradient-to-br from-blue-500 to-cyan-500'
              : `bg-gradient-to-br ${gradientColor}`
          }
        `}
        >
          {isUser ? (
            <User className="w-4 h-4 text-white" />
          ) : (
            <Brain className="w-4 h-4 text-white" />
          )}
        </div>

        {/* Message Bubble */}
        <div className={`flex-1 max-w-[75%] ${isUser ? 'flex flex-col items-end' : ''}`}>
          <div
            className={`
            rounded-2xl p-3 text-sm
            ${
              isUser
                ? 'bg-blue-500/20 border border-blue-500/30'
                : 'bg-white/5 border border-white/10'
            }
          `}
          >
            <p className="text-white whitespace-pre-wrap">{message.content}</p>
            <p className="text-xs text-slate-500 mt-2">{message.timestamp}</p>
          </div>

          {/* Actions for AI messages */}
          {!isUser && (
            <div className="flex gap-1 mt-1">
              <button
                onClick={() => handleCopy(message.content)}
                className="p-1.5 hover:bg-white/5 rounded-lg transition-colors"
                title="Copiar"
              >
                {copied ? (
                  <Check className="w-3 h-3 text-green-400" />
                ) : (
                  <Copy className="w-3 h-3 text-slate-400" />
                )}
              </button>
            </div>
          )}
        </div>
      </motion.div>
    );
  };

  // Position styles
  const getPositionStyles = () => {
    switch (position) {
      case 'bottom-left':
        return 'bottom-6 left-6';
      case 'bottom-right':
        return 'bottom-6 right-6';
      case 'side':
        return 'top-1/2 right-6 -translate-y-1/2';
      default:
        return 'bottom-6 right-6';
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(true)}
            className={`
              fixed ${getPositionStyles()} z-50
              w-14 h-14 rounded-full shadow-2xl
              bg-gradient-to-br ${gradientColor}
              flex items-center justify-center
              hover:shadow-lg transition-shadow
            `}
          >
            <Brain className="w-6 h-6 text-white" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-950 animate-pulse" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
              height: isMinimized ? 'auto' : '600px',
            }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className={`
              fixed ${getPositionStyles()} z-50
              w-96 glass-strong rounded-2xl border border-white/10
              shadow-2xl overflow-hidden flex flex-col
            `}
          >
            {/* Header */}
            <div className={`p-4 border-b border-white/10 bg-gradient-to-r ${gradientColor}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <Brain className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white">Asistente IA</h3>
                    <p className="text-xs text-white/80">{systemName}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setShowSettings(!showSettings)}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    title="Configurar Ollama (AI Local)"
                  >
                    <Settings className="w-4 h-4 text-white" />
                  </button>
                  <div className="relative">
                    <button
                      onClick={() => setShowExportMenu(!showExportMenu)}
                      className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                      title="Exportar conversación"
                    >
                      <Download className="w-4 h-4 text-white" />
                    </button>
                    <AnimatePresence>
                      {showExportMenu && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9, y: -5 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.9, y: -5 }}
                          className="absolute top-full right-0 mt-1 w-32 glass-strong rounded-lg border border-white/10 shadow-xl overflow-hidden z-10"
                        >
                          {['json', 'txt', 'md'].map((fmt) => (
                            <button
                              key={fmt}
                              onClick={() => exportConversation(fmt)}
                              className="w-full px-3 py-2 text-left text-sm text-white hover:bg-white/10 transition-colors flex items-center gap-2"
                            >
                              <FileText className="w-3 h-3" />.{fmt.toUpperCase()}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  <button
                    onClick={handleClearChat}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    title="Limpiar chat"
                  >
                    <Trash2 className="w-4 h-4 text-white" />
                  </button>
                  <button
                    onClick={() => setIsMinimized(!isMinimized)}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    {isMinimized ? (
                      <Maximize2 className="w-4 h-4 text-white" />
                    ) : (
                      <Minimize2 className="w-4 h-4 text-white" />
                    )}
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4 text-white" />
                  </button>
                </div>
              </div>
            </div>

            {/* Messages Area */}
            {!isMinimized && (
              <>
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-950/50">
                  {messages.map((message) => (
                    <Message key={message.id} message={message} />
                  ))}

                  {/* Loading Indicator */}
                  {isLoading && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex gap-3"
                    >
                      <div
                        className={`w-8 h-8 rounded-full bg-gradient-to-br ${gradientColor} flex items-center justify-center`}
                      >
                        <Brain className="w-4 h-4 text-white" />
                      </div>
                      <div className="bg-white/5 border border-white/10 rounded-2xl p-3">
                        <div className="flex items-center gap-2 text-slate-400">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span className="text-sm">Pensando...</span>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <form
                  onSubmit={handleSendMessage}
                  className="p-4 border-t border-white/10 bg-slate-950/50"
                >
                  <div className="relative">
                    <input
                      ref={inputRef}
                      type="text"
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      placeholder="Escribe tu mensaje..."
                      disabled={isLoading}
                      className="w-full px-4 py-3 pr-24 bg-white/5 border border-white/10 rounded-xl
                               focus:border-${accentColor}-500/50 focus:outline-none transition-colors
                               text-white placeholder-slate-500 text-sm disabled:opacity-50"
                    />
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                      {/* 🎤 Botón de Voz */}
                      {isSpeechRecognitionAvailable() && (
                        <button
                          type="button"
                          onClick={toggleVoiceRecording}
                          className={`p-2 rounded-lg transition-all ${
                            isRecording
                              ? 'bg-red-500 text-white animate-pulse'
                              : 'hover:bg-white/5 text-slate-400 hover:text-white'
                          }`}
                          title={isRecording ? 'Detener grabación' : 'Grabar mensaje de voz'}
                        >
                          {isRecording ? (
                            <MicOff className="w-4 h-4" />
                          ) : (
                            <Mic className="w-4 h-4" />
                          )}
                        </button>
                      )}

                      <button
                        type="button"
                        className="p-2 hover:bg-white/5 rounded-lg transition-colors text-slate-400 hover:text-white"
                        title="Adjuntar archivo"
                      >
                        <Paperclip className="w-4 h-4" />
                      </button>
                      <button
                        type="submit"
                        disabled={!inputMessage.trim() || isLoading}
                        className={`
                          p-2 rounded-lg bg-gradient-to-r ${gradientColor}
                          disabled:opacity-50 disabled:cursor-not-allowed
                          hover:shadow-lg transition-all
                        `}
                      >
                        <Send className="w-4 h-4 text-white" />
                      </button>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="flex gap-2 mt-2 overflow-x-auto scrollbar-hide">
                    <button
                      type="button"
                      onClick={() => setInputMessage('¿Cómo funciona esto?')}
                      className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-slate-400 hover:text-white transition-all whitespace-nowrap"
                    >
                      💡 ¿Cómo funciona?
                    </button>
                    <button
                      type="button"
                      onClick={() => setInputMessage('Ayúdame con un problema')}
                      className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-slate-400 hover:text-white transition-all whitespace-nowrap"
                    >
                      🔧 Ayuda
                    </button>
                    <button
                      type="button"
                      onClick={() => setInputMessage('Dame consejos y recomendaciones')}
                      className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-slate-400 hover:text-white transition-all whitespace-nowrap"
                    >
                      ⭐ Consejos
                    </button>
                  </div>
                </form>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ⚙️ Modal de Configuración Ollama */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4"
            onClick={() => setShowSettings(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-strong border border-white/10 rounded-2xl p-6 max-w-md w-full"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-lg bg-gradient-to-br ${gradientColor} flex items-center justify-center`}
                  >
                    <Settings className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white">Configuración Ollama</h3>
                    <p className="text-xs text-slate-400">Modelos locales de IA</p>
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
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    🌐 Host de Ollama
                  </label>
                  <input
                    type="text"
                    value={ollamaHost}
                    onChange={(e) => setOllamaHost(e.target.value)}
                    placeholder="http://localhost:11434"
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg
                             focus:border-blue-500/50 focus:outline-none transition-colors
                             text-white placeholder-slate-500 text-sm"
                  />
                </div>

                {/* Modelo */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    🤖 Modelo de IA
                  </label>
                  <select
                    value={ollamaModel}
                    onChange={(e) => setOllamaModel(e.target.value)}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg
                             focus:border-blue-500/50 focus:outline-none transition-colors
                             text-white text-sm"
                  >
                    <option value="llama3.2:latest">🚀 Llama 3.2 (Rápido - 3B)</option>
                    <option value="llama3.1:latest">🦙 Llama 3.1 (Potente - 8B)</option>
                    <option value="mistral:latest">🧠 Mistral (Inteligente - 7B)</option>
                    <option value="codellama:latest">💻 CodeLlama (Código - 7B)</option>
                    <option value="phi3:latest">⚡ Phi 3 (Microsoft - 3.8B)</option>
                    <option value="qwen2.5:latest">🌍 Qwen 2.5 (Multilingüe - 7B)</option>
                    <option value="deepseek-coder:latest">🔧 DeepSeek Coder (33B)</option>
                    <option value="gemma2:latest">💎 Gemma 2 (Google - 9B)</option>
                  </select>
                  <p className="text-xs text-slate-500 mt-1">
                    Descarga modelos:{' '}
                    <code className="text-cyan-400">ollama pull &lt;modelo&gt;</code>
                  </p>
                </div>

                {/* Info y botones */}
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                  <p className="text-xs text-blue-300 mb-2">
                    📦 <strong>Instalación:</strong>
                  </p>
                  <ol className="text-xs text-slate-400 space-y-1 ml-4 list-decimal">
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
                      Ejecuta: <code className="text-cyan-400">ollama serve</code>
                    </li>
                    <li>
                      Descarga modelo: <code className="text-cyan-400">ollama pull llama3.2</code>
                    </li>
                  </ol>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={checkAvailableModels}
                    className="flex-1 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg
                             text-white text-sm font-medium transition-all"
                  >
                    📋 Ver Modelos
                  </button>
                  <button
                    onClick={saveOllamaSettings}
                    className={`flex-1 px-4 py-2 bg-gradient-to-r ${gradientColor} rounded-lg
                             text-white text-sm font-medium hover:shadow-lg transition-all`}
                  >
                    💾 Guardar
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIAssistant;
