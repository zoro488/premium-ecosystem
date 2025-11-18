/**
 * 🤖 AI ASSISTANT ULTRA - ASISTENTE COMPLETO CON CAPACIDADES AVANZADAS
 * =====================================================================
 *
 * CAPACIDADES:
 * ✅ Navegación entre paneles por voz/texto
 * ✅ Creación de registros mediante conversación natural
 * ✅ Comprensión de lenguaje desordenado/pobre
 * ✅ Análisis de datos en tiempo real desde Firebase
 * ✅ Generación de visualizaciones dinámicas
 * ✅ Exportación de reportes (PDF, Excel, CSV)
 * ✅ Predicciones y recomendaciones inteligentes
 * ✅ Ejecución de acciones complejas
 *
 * ARQUITECTURA:
 * - NLP: Ollama (llama3.1) para procesamiento local + OpenAI fallback
 * - Datos: Firebase Firestore real-time
 * - Actions: Sistema de intenciones y entidades
 * - UI: Video glitch background + animaciones reactivas
 */
import { useCallback, useEffect, useRef, useState } from 'react';

import { AnimatePresence, motion } from 'framer-motion';
import {
  Bot,
  Loader2,
  Maximize2,
  Mic,
  MicOff,
  Minimize2,
  Send,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react';
import PropTypes from 'prop-types';

// Hooks para acceso a datos
import { useClientes } from '../hooks/useClientes';
import { useDistribuidores } from '../hooks/useDistribuidores';
import { useGYA } from '../hooks/useGYA';
import { useVentas } from '../hooks/useVentas';
// Sistema de IA
import { AIEngine } from './ai/AIEngine';
import { ChartGenerator } from './ai/ChartGenerator';
import { EntityExtractor } from './ai/EntityExtractor';
import { IntentClassifier } from './ai/IntentClassifier';
import { ReportGenerator } from './ai/ReportGenerator';

const AIAssistantUltra = ({ onClose, onNavigate, onCreateRecord, currentPanel }) => {
  // ========== STATE ==========
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'ai',
      text: '¡Hola! 👋 Soy tu asistente inteligente de FlowDistributor.\n\nPuedo ayudarte a:\n• Navegar entre paneles\n• Crear registros (gastos, ventas, etc.)\n• Analizar datos y generar reportes\n• Crear gráficas personalizadas\n• Exportar información\n\n¿En qué puedo ayudarte hoy?',
      timestamp: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentAction, setCurrentAction] = useState(null);
  const [pendingConfirmation, setPendingConfirmation] = useState(null);

  // ========== REFS ==========
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const synthRef = useRef(null);
  const inputRef = useRef(null);
  const videoRef = useRef(null);

  // ========== DATOS EN TIEMPO REAL ==========
  const { data: gyaData, isLoading: gyaLoading } = useGYA();
  const { data: ventasData, isLoading: ventasLoading } = useVentas();
  const { data: clientesData, isLoading: clientesLoading } = useClientes();
  const { data: distribuidoresData, isLoading: distribuidoresLoading } = useDistribuidores();

  // ========== AI ENGINE ==========
  const aiEngine = useRef(null);

  useEffect(() => {
    aiEngine.current = new AIEngine({
      model: 'llama3.1', // Ollama local
      fallbackModel: 'gpt-4-turbo', // OpenAI fallback
      temperature: 0.7,
      context: {
        appName: 'FlowDistributor',
        currentPanel,
        availablePanels: [
          'Dashboard',
          'GYA',
          'Ventas',
          'Clientes',
          'Distribuidores',
          'Bóveda USA',
          'Bóveda Monte',
          'Almacén',
          'Reportes',
          'Analytics',
        ],
        user: 'Admin',
      },
    });
  }, [currentPanel]);

  // ========== SPEECH RECOGNITION ==========
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'es-ES';

      recognitionRef.current.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map((result) => result[0].transcript)
          .join('');

        setInputValue(transcript);

        if (event.results[0].isFinal) {
          setIsListening(false);
          handleSend(transcript);
        }
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    if ('speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
    }

    return () => {
      if (recognitionRef.current) recognitionRef.current.stop();
      if (synthRef.current) synthRef.current.cancel();
    };
  }, []);

  // ========== AUTO-SCROLL ==========
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // ========== VOICE INPUT ==========
  const toggleVoiceInput = useCallback(() => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current?.start();
        setIsListening(true);
      } catch (error) {
        console.error('Error starting recognition:', error);
      }
    }
  }, [isListening]);

  // ========== SPEAK RESPONSE ==========
  const speakText = useCallback(
    (text) => {
      if (!voiceEnabled || !synthRef.current) return;

      synthRef.current.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'es-ES';
      utterance.rate = 1;
      utterance.pitch = 1;
      utterance.volume = 0.8;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      synthRef.current.speak(utterance);
    },
    [voiceEnabled]
  );

  // ========== PROCESS USER MESSAGE (NÚCLEO DE LA IA) ==========
  const processUserMessage = useCallback(
    async (userMessage) => {
      try {
        setIsProcessing(true);
        setCurrentAction('Analizando tu mensaje...');

        // 1. Clasificar intención
        const intent = await IntentClassifier.classify(userMessage, {
          gyaData,
          ventasData,
          clientesData,
          distribuidoresData,
        });

        console.log('🎯 Intent detected:', intent);

        // 2. Extraer entidades (nombres, fechas, cantidades, etc.)
        const entities = EntityExtractor.extract(userMessage, intent.type);
        console.log('📊 Entities:', entities);

        // 3. Generar contexto para el LLM
        const context = {
          intent,
          entities,
          currentPanel,
          data: {
            gya: gyaData?.slice(0, 10), // Últimos 10 registros para contexto
            ventas: ventasData?.slice(0, 10),
            clientes: clientesData,
            distribuidores: distribuidoresData,
          },
          stats: {
            totalGYA: gyaData?.length || 0,
            totalVentas: ventasData?.length || 0,
            totalClientes: clientesData?.length || 0,
            totalDistribuidores: distribuidoresData?.length || 0,
          },
        };

        // 4. Ejecutar acción según intención
        let response;

        switch (intent.type) {
          case 'NAVIGATE':
            response = await handleNavigateIntent(entities);
            break;

          case 'CREATE_RECORD':
            response = await handleCreateRecordIntent(entities, userMessage);
            break;

          case 'QUERY_DATA':
            response = await handleQueryDataIntent(entities, context);
            break;

          case 'GENERATE_CHART':
            response = await handleGenerateChartIntent(entities, context);
            break;

          case 'EXPORT_REPORT':
            response = await handleExportReportIntent(entities, context);
            break;

          case 'ANALYZE':
            response = await handleAnalyzeIntent(entities, context);
            break;

          default:
            // LLM fallback para casos no clasificados
            response = await aiEngine.current.generateResponse(userMessage, context);
        }

        setCurrentAction(null);
        return response;
      } catch (error) {
        console.error('❌ Error processing message:', error);
        setCurrentAction(null);
        return {
          text: `Lo siento, ocurrió un error al procesar tu solicitud: ${error.message}\n\n¿Puedes intentar reformular tu pregunta?`,
          type: 'error',
        };
      } finally {
        setIsProcessing(false);
      }
    },
    [gyaData, ventasData, clientesData, distribuidoresData, currentPanel]
  );

  // ========== INTENT HANDLERS ==========

  // Navegación: "ir a ventas", "muéstrame el panel de clientes"
  const handleNavigateIntent = useCallback(
    async (entities) => {
      const targetPanel = entities.panel;

      if (!targetPanel) {
        return {
          text: '🤔 No pude identificar a qué panel quieres ir. Paneles disponibles:\n\n• Dashboard\n• GYA\n• Ventas\n• Clientes\n• Distribuidores\n• Bóveda USA\n• Bóveda Monte\n• Almacén\n• Reportes\n• Analytics',
          type: 'info',
        };
      }

      // Ejecutar navegación
      onNavigate?.(targetPanel);

      return {
        text: `✅ Perfecto, te llevo al panel de **${targetPanel}**`,
        type: 'success',
        action: 'navigate',
        target: targetPanel,
      };
    },
    [onNavigate]
  );

  // Crear registro: "registra un gasto de 5000 para gasolina"
  const handleCreateRecordIntent = useCallback(
    async (entities, originalMessage) => {
      const { recordType, amount, concept, destination } = entities;

      // Si faltan datos, solicitar confirmación
      if (!amount || !concept) {
        setPendingConfirmation({
          type: 'CREATE_RECORD',
          entities,
          message: originalMessage,
        });

        return {
          text: `📝 Entendido, quieres crear un registro de tipo **${recordType || 'gasto'}**.\n\nPara completar necesito:\n${!amount ? '• Monto' : ''}\n${!concept ? '• Concepto' : ''}\n${!destination ? '• Destino' : ''}\n\n¿Puedes proporcionarme esta información?`,
          type: 'question',
          requiresInput: true,
        };
      }

      // Crear el registro
      const record = {
        tipo: recordType === 'ingreso' ? 'Ingreso' : recordType === 'abono' ? 'Abono' : 'Gasto',
        valor: parseFloat(amount),
        concepto: concept,
        destino: destination || 'General',
        fecha: new Date().toISOString(),
        origen: 'IA Assistant',
        observaciones: `Creado por IA desde: "${originalMessage}"`,
      };

      // Ejecutar creación
      onCreateRecord?.('gya', record);

      return {
        text: `✅ ¡Listo! He creado el registro:\n\n💰 **${record.tipo}**: $${amount.toLocaleString()}\n📋 **Concepto**: ${concept}\n🏢 **Destino**: ${destination || 'General'}\n📅 **Fecha**: ${new Date().toLocaleDateString('es-MX')}\n\n¿Necesitas crear otro registro?`,
        type: 'success',
        action: 'record_created',
        record,
      };
    },
    [onCreateRecord]
  );

  // Consultar datos: "cuántos clientes tengo", "total de ventas del mes"
  const handleQueryDataIntent = useCallback(
    async (entities, context) => {
      const { queryType, timeRange, entity } = entities;

      let response = '';

      if (queryType === 'COUNT') {
        if (entity === 'clientes') {
          response = `👥 Tienes **${context.stats.totalClientes}** clientes registrados.`;
        } else if (entity === 'ventas') {
          response = `🛍️ Hay **${context.stats.totalVentas}** ventas registradas.`;
        } else if (entity === 'gya' || entity === 'gastos') {
          response = `💰 Hay **${context.stats.totalGYA}** registros de gastos y abonos.`;
        }
      } else if (queryType === 'SUM') {
        // Calcular totales
        const totalVentas = ventasData?.reduce((sum, v) => sum + (v.total || 0), 0) || 0;
        const totalGastos =
          gyaData?.filter((g) => g.tipo === 'Gasto').reduce((sum, g) => sum + (g.valor || 0), 0) ||
          0;
        const totalIngresos =
          gyaData
            ?.filter((g) => g.tipo === 'Ingreso')
            .reduce((sum, g) => sum + (g.valor || 0), 0) || 0;

        if (entity === 'ventas') {
          response = `💵 Total de ventas: **$${totalVentas.toLocaleString()}**`;
        } else if (entity === 'gastos') {
          response = `💸 Total de gastos: **$${totalGastos.toLocaleString()}**`;
        } else if (entity === 'ingresos') {
          response = `💰 Total de ingresos: **$${totalIngresos.toLocaleString()}**`;
        }
      }

      return {
        text: response || 'No pude calcular esa información. ¿Puedes ser más específico?',
        type: 'info',
        data: { entity, queryType, timeRange },
      };
    },
    [gyaData, ventasData]
  );

  // Generar gráfica: "muéstrame gráfica de ventas del último mes"
  const handleGenerateChartIntent = useCallback(
    async (entities, context) => {
      setCurrentAction('Generando visualización...');

      const chart = await ChartGenerator.generate({
        type: entities.chartType || 'line',
        data: entities.dataSource === 'ventas' ? ventasData : gyaData,
        timeRange: entities.timeRange,
        groupBy: entities.groupBy,
      });

      return {
        text: '📊 He generado la visualización que solicitaste:',
        type: 'chart',
        chart,
        downloadable: true,
      };
    },
    [gyaData, ventasData]
  );

  // Exportar reporte: "exporta reporte de ventas en PDF"
  const handleExportReportIntent = useCallback(async (entities, context) => {
    setCurrentAction('Generando reporte...');

    const report = await ReportGenerator.generate({
      type: entities.reportType || 'general',
      format: entities.format || 'pdf',
      data: context.data,
      stats: context.stats,
      timeRange: entities.timeRange,
    });

    // Descargar automáticamente
    const blob = new Blob([report.content], { type: report.mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = report.filename;
    a.click();
    URL.revokeObjectURL(url);

    return {
      text: `✅ Reporte generado y descargado:\n\n📄 **${report.filename}**\n📊 Formato: ${entities.format?.toUpperCase()}\n💾 Tamaño: ${(report.size / 1024).toFixed(2)} KB`,
      type: 'success',
      action: 'report_exported',
    };
  }, []);

  // Análisis: "analiza las ventas", "qué distribuidor tiene más adeudo"
  const handleAnalyzeIntent = useCallback(async (entities, context) => {
    setCurrentAction('Analizando datos...');

    // Usar LLM para análisis inteligente
    const analysis = await aiEngine.current.analyze({
      query: entities.originalMessage,
      data: context.data,
      stats: context.stats,
    });

    return {
      text: `🧠 **Análisis completado:**\n\n${analysis.insights}\n\n${analysis.recommendations ? '💡 **Recomendaciones:**\n' + analysis.recommendations : ''}`,
      type: 'analysis',
      data: analysis,
    };
  }, []);

  // ========== SEND MESSAGE ==========
  const handleSend = useCallback(
    async (messageText = inputValue) => {
      if (!messageText?.trim()) return;

      const userMessage = {
        id: Date.now(),
        type: 'user',
        text: messageText,
        timestamp: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, userMessage]);
      setInputValue('');

      // Procesar con IA
      const aiResponse = await processUserMessage(messageText);

      const aiMessage = {
        id: Date.now() + 1,
        type: 'ai',
        text: aiResponse.text,
        timestamp: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
        action: aiResponse.action,
        data: aiResponse.data,
        chart: aiResponse.chart,
        downloadable: aiResponse.downloadable,
      };

      setMessages((prev) => [...prev, aiMessage]);

      // Speak if voice enabled
      if (voiceEnabled && aiResponse.type !== 'chart') {
        speakText(aiResponse.text);
      }
    },
    [inputValue, processUserMessage, voiceEnabled, speakText]
  );

  // ========== KEYBOARD SHORTCUTS ==========
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'Enter' && !e.shiftKey && inputValue.trim()) {
        e.preventDefault();
        handleSend();
      }
    };

    const inputElement = inputRef.current;
    if (inputElement) {
      inputElement.addEventListener('keypress', handleKeyPress);
      return () => inputElement.removeEventListener('keypress', handleKeyPress);
    }
  }, [inputValue, handleSend]);

  // ========== MINIMIZED VIEW ==========
  if (isMinimized) {
    return (
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsMinimized(false)}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full bg-gradient-to-r from-zinc-800 via-zinc-800 to-zinc-900 flex items-center justify-center shadow-2xl group"
      >
        <Bot className="w-8 h-8 text-white group-hover:scale-110 transition-transform" />
        <motion.div
          className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-slate-900"
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        {(isSpeaking || isProcessing) && (
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-green-400"
            animate={{ scale: [1, 1.4, 1], opacity: [0.8, 0, 0.8] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        )}
      </motion.button>
    );
  }

  // ========== MAIN UI ==========
  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
      className={`fixed ${isExpanded ? 'inset-4' : 'bottom-6 right-6 w-[32rem] h-[40rem]'} z-50 flex flex-col glass rounded-2xl shadow-2xl border border-white/10 overflow-hidden transition-all duration-300`}
    >
      {/* Video Background */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
          src="/Zoom Glitch Logo - Square/AdobeStock_686134003.mp4"
        />
      </div>

      {/* Header */}
      <div className="relative bg-gradient-to-r from-zinc-800 via-zinc-800 to-zinc-900 text-white p-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Bot className="w-8 h-8" />
            {isProcessing && (
              <Loader2 className="w-4 h-4 absolute -top-1 -right-1 animate-spin text-zinc-200" />
            )}
          </div>
          <div>
            <h3 className="font-bold text-lg">Asistente IA Ultra</h3>
            <p className="text-xs opacity-80">{currentAction || 'En línea'}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setVoiceEnabled(!voiceEnabled)}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            title={voiceEnabled ? 'Desactivar voz' : 'Activar voz'}
          >
            {voiceEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </button>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            title={isExpanded ? 'Minimizar' : 'Expandir'}
          >
            {isExpanded ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
          </button>

          <button
            onClick={() => setIsMinimized(true)}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            title="Ocultar"
          >
            <Minimize2 className="w-5 h-5" />
          </button>

          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            title="Cerrar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 relative">
        <AnimatePresence mode="popLayout">
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-2xl ${
                  msg.type === 'user'
                    ? 'bg-gradient-to-r from-zinc-900 to-zinc-800 text-white'
                    : 'bg-slate-800/90 text-white border border-white/10'
                }`}
              >
                <p className="whitespace-pre-wrap text-sm">{msg.text}</p>
                {msg.chart && (
                  <div className="mt-2 p-2 bg-slate-900/50 rounded-lg">
                    {/* Chart component here */}
                    <p className="text-xs text-slate-400">📊 Visualización generada</p>
                  </div>
                )}
                <p className="text-xs opacity-60 mt-1">{msg.timestamp}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isProcessing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 text-slate-400 text-sm"
          >
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Procesando...</span>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="relative p-4 border-t border-white/10 bg-slate-900/50">
        <div className="flex items-center gap-2">
          <button
            onClick={toggleVoiceInput}
            className={`p-3 rounded-xl transition-all ${
              isListening
                ? 'bg-zinc-9000 animate-pulse'
                : 'bg-gradient-to-r from-zinc-800 to-zinc-900 hover:from-zinc-800 hover:to-blue-700'
            } text-white`}
          >
            {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Escribe o habla tu consulta..."
            className="flex-1 bg-slate-800/50 text-white px-4 py-3 rounded-xl border border-white/10 focus:border-zinc-800 focus:outline-none"
            disabled={isProcessing}
          />

          <button
            onClick={() => handleSend()}
            disabled={isProcessing || !inputValue.trim()}
            className="p-3 rounded-xl bg-gradient-to-r from-zinc-800 to-zinc-900 hover:from-zinc-800 hover:to-blue-700 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-slate-400 mt-2">
          💡 Intenta: &quot;ir a ventas&quot;, &quot;registra un gasto de 5000 para gasolina&quot;,
          &quot;cuántos clientes tengo&quot;
        </p>
      </div>
    </motion.div>
  );
};

AIAssistantUltra.propTypes = {
  onClose: PropTypes.func.isRequired,
  onNavigate: PropTypes.func,
  onCreateRecord: PropTypes.func,
  currentPanel: PropTypes.string,
};

export default AIAssistantUltra;
