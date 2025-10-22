import { useEffect, useRef, useState } from 'react';

import { AnimatePresence, motion, useMotionValue, useSpring } from 'framer-motion';
import {
  Activity,
  AlertCircle,
  Archive,
  BarChart3,
  Bookmark,
  Bot,
  Brain,
  Camera,
  Check,
  ChevronDown,
  Clock,
  CloudLightning,
  Code,
  Copy,
  Cpu,
  Database,
  Download,
  Edit,
  FileText,
  Filter,
  Globe,
  Heart,
  Image,
  Layers,
  Loader2,
  Maximize2,
  Menu,
  MessageSquare,
  Mic,
  Minimize2,
  Moon,
  MoreVertical,
  Music,
  Paperclip,
  Plus,
  Search,
  Send,
  Settings,
  Share2,
  SlidersHorizontal,
  Sparkles,
  Star,
  Sun,
  Target,
  Trash2,
  TrendingUp,
  Upload,
  User,
  Video,
  Volume2,
  VolumeX,
  X,
  Zap,
} from 'lucide-react';

import AIAssistant from '../../components/shared/AIAssistant';
import { STORAGE_KEYS, useLocalStorage } from '../../utils/storage';

// Mock data de conversaciones
const initialConversations = [
  {
    id: 1,
    title: 'Análisis de Mercado Q4 2024',
    preview: 'Genera un informe detallado del comportamiento...',
    model: 'GPT-4 Turbo',
    timestamp: '10:45 AM',
    category: 'business',
    starred: true,
    messages: 24,
  },
  {
    id: 2,
    title: 'Desarrollo de App React',
    preview: 'Necesito ayuda para optimizar el rendimiento...',
    model: 'Claude 3 Opus',
    timestamp: '9:30 AM',
    category: 'code',
    starred: false,
    messages: 18,
  },
  {
    id: 3,
    title: 'Generación de Imágenes',
    preview: 'Crea una serie de conceptos visuales para...',
    model: 'DALL-E 3',
    timestamp: 'Yesterday',
    category: 'creative',
    starred: true,
    messages: 12,
  },
  {
    id: 4,
    title: 'Análisis de Datos SQL',
    preview: 'Optimiza estas consultas de base de datos...',
    model: 'GPT-4',
    timestamp: '2 days ago',
    category: 'data',
    starred: false,
    messages: 8,
  },
];

// Mock mensajes de chat
const initialMessages = [
  {
    id: 1,
    role: 'user',
    content: 'Necesito crear un dashboard para analizar métricas de ventas en tiempo real',
    timestamp: '10:45 AM',
  },
  {
    id: 2,
    role: 'assistant',
    content: `Excelente proyecto. Te ayudaré a crear un dashboard profesional para análisis de ventas en tiempo real.

Aquí está mi propuesta de arquitectura:

## 🎯 Componentes Principales

1. **Panel de Métricas**
   - KPIs principales (ventas, conversión, ROI)
   - Gráficos en tiempo real con Chart.js
   - Alertas automáticas de umbrales

2. **Visualizaciones**
   - Gráfico de líneas para tendencias
   - Barras para comparativas
   - Heat maps para análisis geográfico

3. **Filtros Dinámicos**
   - Por fecha, región, producto
   - Búsqueda avanzada
   - Exportación de datos

¿Quieres que comience con el código del panel de métricas?`,
    timestamp: '10:45 AM',
    codeBlocks: [
      {
        language: 'jsx',
        code: `const DashboardMetrics = () => {
  const [metrics, setMetrics] = useState({
    sales: 0,
    conversion: 0,
    roi: 0
  });

  useEffect(() => {
    // Conexión WebSocket para datos en tiempo real
    const ws = new WebSocket('ws://api.example.com/metrics');

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setMetrics(data);
    };

    return () => ws.close();
  }, []);

  return (
    <div className="grid grid-cols-3 gap-4">
      <MetricCard
        title="Ventas Totales"
        value={metrics.sales}
        icon={<TrendingUp />}
      />
    </div>
  );
};`,
      },
    ],
  },
  {
    id: 3,
    role: 'user',
    content:
      'Perfecto, pero agrega también notificaciones push cuando las ventas superen cierto umbral',
    timestamp: '10:46 AM',
  },
  {
    id: 4,
    role: 'assistant',
    content: `¡Claro! Aquí está la implementación del sistema de notificaciones push con umbrales configurables:`,
    timestamp: '10:46 AM',
    codeBlocks: [
      {
        language: 'jsx',
        code: `const NotificationSystem = ({ threshold = 10000 }) => {
  useEffect(() => {
    const checkThreshold = (sales) => {
      if (sales > threshold) {
        // Crear notificación push
        new Notification('¡Meta Alcanzada!', {
          body: \`Ventas: $\${sales.toLocaleString()}\`,
          icon: '/success-icon.png',
          tag: 'sales-alert'
        });

        // Enviar a Slack/Discord (opcional)
        sendWebhook({
          channel: '#sales',
          message: '🎉 ¡Se superó el umbral de ventas!'
        });
      }
    };

    // Suscribirse a actualizaciones
    subscribeToMetrics(checkThreshold);
  }, [threshold]);

  return <NotificationBadge />;
};`,
      },
    ],
  },
];

// Modelos de IA disponibles
const aiModels = [
  {
    id: 'gpt4-turbo',
    name: 'GPT-4 Turbo',
    provider: 'OpenAI',
    icon: Cpu,
    color: 'from-emerald-500 to-green-500',
    capabilities: ['text', 'code', 'analysis'],
    speed: 'fast',
  },
  {
    id: 'claude-opus',
    name: 'Claude 3 Opus',
    provider: 'Anthropic',
    icon: Brain,
    color: 'from-orange-500 to-amber-500',
    capabilities: ['text', 'code', 'reasoning'],
    speed: 'medium',
  },
  {
    id: 'dalle3',
    name: 'DALL-E 3',
    provider: 'OpenAI',
    icon: Image,
    color: 'from-purple-500 to-pink-500',
    capabilities: ['image'],
    speed: 'slow',
  },
  {
    id: 'codex',
    name: 'Codex',
    provider: 'OpenAI',
    icon: Code,
    color: 'from-blue-500 to-cyan-500',
    capabilities: ['code'],
    speed: 'fast',
  },
];

// Sidebar Component
const Sidebar = ({
  conversations,
  activeConversation,
  setActiveConversation,
  isCollapsed,
  setIsCollapsed,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

  const categories = [
    { id: 'all', label: 'Todos', icon: Layers, color: 'gray' },
    { id: 'code', label: 'Código', icon: Code, color: 'blue' },
    { id: 'business', label: 'Negocios', icon: TrendingUp, color: 'green' },
    { id: 'creative', label: 'Creatividad', icon: Sparkles, color: 'purple' },
    { id: 'data', label: 'Datos', icon: Database, color: 'cyan' },
  ];

  const filteredConversations = conversations.filter((conv) => {
    const matchesSearch = conv.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || conv.category === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <motion.aside
      animate={{ width: isCollapsed ? 80 : 320 }}
      className="fixed left-0 top-0 h-screen glass-strong border-r border-orange-500/20 z-50 flex flex-col"
    >
      {/* Header */}
      <div className="p-6 border-b border-orange-500/20">
        <div className="flex items-center justify-between mb-4">
          {!isCollapsed && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="flex items-center gap-2 mb-1">
                <Brain className="w-6 h-6 text-orange-400" />
                <h1 className="text-xl font-bold bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">
                  Synapse
                </h1>
              </div>
              <p className="text-xs text-slate-400">AI Assistant</p>
            </motion.div>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 hover:bg-white/5 rounded-lg transition-colors"
          >
            {isCollapsed ? <Menu className="w-5 h-5" /> : <X className="w-5 h-5" />}
          </button>
        </div>

        {/* Search */}
        {!isCollapsed && (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar conversaciones..."
              className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm focus:border-orange-500/50 focus:outline-none transition-colors"
            />
          </div>
        )}
      </div>

      {/* Categories */}
      {!isCollapsed && (
        <div className="px-4 py-3 border-b border-orange-500/20">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.id}
                  onClick={() => setFilter(cat.id)}
                  className={`
                    px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all
                    ${
                      filter === cat.id
                        ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                        : 'bg-white/5 text-slate-400 hover:text-white'
                    }
                  `}
                >
                  <div className="flex items-center gap-1.5">
                    <Icon className="w-3.5 h-3.5" />
                    {cat.label}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Conversations List */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-2">
        {!isCollapsed && (
          <button className="w-full px-4 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 font-semibold transition-all flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-4 h-4" />
            Nueva Conversación
          </button>
        )}

        {filteredConversations.map((conv) => (
          <motion.button
            key={conv.id}
            whileHover={{ x: 4 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveConversation(conv.id)}
            className={`
              w-full text-left px-4 py-3 rounded-xl transition-all
              ${
                activeConversation === conv.id
                  ? 'bg-gradient-to-r from-orange-500/20 to-amber-500/20 border border-orange-500/30'
                  : 'hover:bg-white/5 border border-transparent'
              }
            `}
          >
            {!isCollapsed ? (
              <div>
                <div className="flex items-start justify-between mb-1">
                  <h3 className="font-medium text-white text-sm line-clamp-1">{conv.title}</h3>
                  {conv.starred && (
                    <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400 flex-shrink-0" />
                  )}
                </div>
                <p className="text-xs text-slate-400 line-clamp-1 mb-2">{conv.preview}</p>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">{conv.model}</span>
                  <span className="text-slate-500">{conv.timestamp}</span>
                </div>
              </div>
            ) : (
              <MessageSquare className="w-5 h-5 mx-auto" />
            )}
          </motion.button>
        ))}
      </nav>

      {/* Footer - New Chat Button (collapsed mode) */}
      {isCollapsed && (
        <div className="p-4 border-t border-orange-500/20">
          <button className="w-full p-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 transition-all">
            <Sparkles className="w-5 h-5 mx-auto" />
          </button>
        </div>
      )}
    </motion.aside>
  );
};

// Message Component
const Message = ({ message }) => {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === 'user';

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex gap-4 ${isUser ? 'flex-row-reverse' : ''}`}
    >
      {/* Avatar */}
      <div
        className={`
        w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0
        ${
          isUser
            ? 'bg-gradient-to-br from-blue-500 to-cyan-500'
            : 'bg-gradient-to-br from-orange-500 to-amber-500'
        }
      `}
      >
        {isUser ? (
          <User className="w-5 h-5 text-white" />
        ) : (
          <Brain className="w-5 h-5 text-white" />
        )}
      </div>

      {/* Message Content */}
      <div className={`flex-1 max-w-3xl ${isUser ? 'flex flex-col items-end' : ''}`}>
        <div
          className={`
          glass rounded-2xl p-4 border
          ${isUser ? 'bg-blue-500/10 border-blue-500/20' : 'border-white/10'}
        `}
        >
          {/* Message Text */}
          <div className="prose prose-invert prose-sm max-w-none">
            {message.content.split('\n').map((line, i) => {
              if (line.startsWith('##')) {
                return (
                  <h2 key={`item-${i}`} className="text-xl font-bold mb-2 mt-4 first:mt-0">
                    {line.replace('##', '').trim()}
                  </h2>
                );
              }
              if (line.startsWith('-')) {
                return (
                  <li key={`item-${i}`} className="ml-4">
                    {line.replace('-', '').trim()}
                  </li>
                );
              }
              if (line.trim() === '') {
                return <br key={`item-${i}`} />;
              }
              return (
                <p key={`item-${i}`} className="mb-2 last:mb-0">
                  {line}
                </p>
              );
            })}
          </div>

          {/* Code Blocks */}
          {message.codeBlocks &&
            message.codeBlocks.map((block, index) => (
              <div key={`item-${index}`} className="mt-4 rounded-xl overflow-hidden border border-white/10">
                <div className="flex items-center justify-between px-4 py-2 bg-slate-900/50 border-b border-white/10">
                  <span className="text-xs font-mono text-slate-400">{block.language}</span>
                  <button
                    onClick={() => handleCopy(block.code)}
                    className="p-1.5 hover:bg-white/5 rounded-lg transition-colors text-slate-400 hover:text-white"
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                <pre className="p-4 overflow-x-auto bg-slate-950/50">
                  <code className="text-sm font-mono text-slate-300">{block.code}</code>
                </pre>
              </div>
            ))}

          {/* Timestamp */}
          <div
            className={`flex items-center gap-2 mt-3 pt-3 border-t border-white/5 text-xs text-slate-500`}
          >
            <Clock className="w-3 h-3" />
            {message.timestamp}
          </div>
        </div>

        {/* Actions */}
        {!isUser && (
          <div className="flex gap-2 mt-2">
            <button className="p-2 hover:bg-white/5 rounded-lg transition-colors">
              <Copy className="w-4 h-4 text-slate-400" />
            </button>
            <button className="p-2 hover:bg-white/5 rounded-lg transition-colors">
              <Share2 className="w-4 h-4 text-slate-400" />
            </button>
            <button className="p-2 hover:bg-white/5 rounded-lg transition-colors">
              <Bookmark className="w-4 h-4 text-slate-400" />
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

// Model Selector Component
const ModelSelector = ({ selectedModel, setSelectedModel }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 rounded-xl glass border border-white/10 hover:border-orange-500/30 transition-all"
      >
        <Brain className="w-4 h-4 text-orange-400" />
        <span className="text-sm font-medium">{selectedModel.name}</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute bottom-full left-0 mb-2 w-80 glass-strong rounded-xl border border-white/10 overflow-hidden"
          >
            <div className="p-3 border-b border-white/10">
              <h3 className="font-semibold text-sm mb-1">Seleccionar Modelo</h3>
              <p className="text-xs text-slate-400">
                Elige el modelo de IA más adecuado para tu tarea
              </p>
            </div>

            <div className="p-2 max-h-96 overflow-y-auto">
              {aiModels.map((model) => {
                const Icon = model.icon;
                return (
                  <button
                    key={model.id}
                    onClick={() => {
                      setSelectedModel(model);
                      setIsOpen(false);
                    }}
                    className={`
                      w-full p-3 rounded-lg text-left transition-all mb-1
                      ${
                        selectedModel.id === model.id
                          ? 'bg-orange-500/20 border border-orange-500/30'
                          : 'hover:bg-white/5'
                      }
                    `}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg bg-gradient-to-br ${model.color}`}>
                        <Icon className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-semibold text-sm">{model.name}</h4>
                          {selectedModel.id === model.id && (
                            <Check className="w-4 h-4 text-orange-400" />
                          )}
                        </div>
                        <p className="text-xs text-slate-400 mb-2">{model.provider}</p>
                        <div className="flex gap-1.5">
                          {model.capabilities.map((cap) => (
                            <span
                              key={cap}
                              className="px-2 py-0.5 rounded text-xs bg-white/5 text-slate-400 capitalize"
                            >
                              {cap}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Chat Input Component
const ChatInput = ({ onSend, isLoading }) => {
  const [message, setMessage] = useState('');
  const textareaRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      onSend(message);
      setMessage('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="glass-strong border-t border-orange-500/20 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="relative">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Escribe tu mensaje... (Shift + Enter para nueva línea)"
            className="w-full px-4 py-3 pr-32 bg-white/5 border border-white/10 rounded-xl resize-none focus:border-orange-500/50 focus:outline-none transition-colors text-white placeholder-slate-500"
            rows="3"
            disabled={isLoading}
          />

          {/* Actions */}
          <div className="absolute bottom-3 right-3 flex items-center gap-2">
            <button
              type="button"
              className="p-2 hover:bg-white/5 rounded-lg transition-colors text-slate-400 hover:text-white"
            >
              <Paperclip className="w-4 h-4" />
            </button>
            <button
              type="button"
              className="p-2 hover:bg-white/5 rounded-lg transition-colors text-slate-400 hover:text-white"
            >
              <Mic className="w-4 h-4" />
            </button>
            <button
              type="submit"
              disabled={!message.trim() || isLoading}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-2 mt-3">
          <button
            type="button"
            className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-slate-400 hover:text-white transition-all"
          >
            💡 Sugerir idea
          </button>
          <button
            type="button"
            className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-slate-400 hover:text-white transition-all"
          >
            📝 Escribir código
          </button>
          <button
            type="button"
            className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-slate-400 hover:text-white transition-all"
          >
            🎨 Generar imagen
          </button>
          <button
            type="button"
            className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-slate-400 hover:text-white transition-all"
          >
            📊 Analizar datos
          </button>
        </div>
      </div>
    </form>
  );
};

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
      <div className="w-full h-full bg-gradient-to-r from-orange-500/20 via-amber-500/20 to-yellow-500/20 blur-3xl rounded-full" />
    </motion.div>
  );
};

// Main Component
export default function Synapse() {
  const [conversations, setConversations] = useLocalStorage(
    STORAGE_KEYS.SYNAPSE_CONVERSATIONS,
    initialConversations
  );
  const [activeConversation, setActiveConversation] = useLocalStorage(
    'synapse_active_conversation',
    1
  );
  const [messages, setMessages] = useLocalStorage(STORAGE_KEYS.SYNAPSE_MESSAGES, initialMessages);
  const [isCollapsed, setIsCollapsed] = useLocalStorage(STORAGE_KEYS.SIDEBAR_STATE, false);
  const [selectedModel, setSelectedModel] = useLocalStorage('synapse_selected_model', aiModels[0]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (content) => {
    // Add user message
    const userMessage = {
      id: messages.length + 1,
      role: 'user',
      content,
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages([...messages, userMessage]);

    // Simulate AI response
    setIsLoading(true);
    setTimeout(() => {
      const aiMessage = {
        id: messages.length + 2,
        role: 'assistant',
        content: `Entiendo tu solicitud. Estoy procesando la información con ${selectedModel.name}...

Aquí está mi respuesta basada en el análisis:

## 🎯 Resumen
Te ayudaré con eso de manera eficiente y profesional.

## 📋 Pasos a Seguir
- Análisis de requisitos
- Implementación de solución
- Testing y validación
- Documentación completa

¿Necesitas que profundice en algún punto específico?`,
        timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsLoading(false);
    }, 2000);
  };

  return (
    <div className="flex h-screen bg-slate-950 overflow-hidden relative">
      {/* Cursor glow effect */}
      <CursorGlow />

      {/* Animated grid background */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'linear-gradient(rgba(251, 146, 60, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(251, 146, 60, 0.1) 1px, transparent 1px)',
            backgroundSize: '50px 50px',
          }}
        />
      </div>

      <Sidebar
        conversations={conversations}
        activeConversation={activeConversation}
        setActiveConversation={setActiveConversation}
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
      />

      <div
        className="flex-1 flex flex-col overflow-hidden"
        style={{ marginLeft: isCollapsed ? 80 : 320 }}
      >
        {/* Header */}
        <header className="glass-strong border-b border-orange-500/20 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">
                {conversations.find((c) => c.id === activeConversation)?.title}
              </h2>
              <p className="text-sm text-slate-400 mt-0.5">
                {messages.length} mensajes • Modelo: {selectedModel.name}
              </p>
            </div>

            <div className="flex gap-3">
              <ModelSelector selectedModel={selectedModel} setSelectedModel={setSelectedModel} />
              <button className="p-2 hover:bg-white/5 rounded-lg transition-colors">
                <Share2 className="w-5 h-5" />
              </button>
              <button className="p-2 hover:bg-white/5 rounded-lg transition-colors">
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
        </header>

        {/* Messages */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            {messages.map((message) => (
              <Message key={message.id} message={message} />
            ))}

            {/* Loading indicator */}
            {isLoading && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center">
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <div className="glass rounded-2xl p-4 border border-white/10">
                  <div className="flex items-center gap-2 text-slate-400">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm">Generando respuesta...</span>
                  </div>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </main>

        {/* Input */}
        <ChatInput onSend={handleSendMessage} isLoading={isLoading} />
      </div>

      {/* AI Assistant */}
      <AIAssistant
        systemName="Synapse"
        systemContext="Asistente de IA conversacional con múltiples modelos (GPT-4, Claude, Gemini)"
        accentColor="orange"
        position="bottom-right"
      />
    </div>
  );
}
