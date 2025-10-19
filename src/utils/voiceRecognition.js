/**
 * 🎤 VOICE RECOGNITION UTILITIES
 * Web Speech API helpers para comandos de voz
 */

/**
 * Inicializar reconocimiento de voz
 */
export const initVoiceRecognition = (onResult, onError) => {
  if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
    return null;
  }
  
  const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
  const recognition = new SpeechRecognition();
  
  recognition.continuous = false;
  recognition.interimResults = true;
  recognition.lang = 'es-MX';
  recognition.maxAlternatives = 3;
  
  recognition.onresult = (event) => {
    const results = event.results[event.results.length - 1];
    const transcript = results[0].transcript;
    const confidence = results[0].confidence;
    const isFinal = results.isFinal;
    
    onResult({
      transcript,
      confidence,
      isFinal,
      alternatives: Array.from(results).map(r => ({
        transcript: r.transcript,
        confidence: r.confidence
      }))
    });
  };
  
  recognition.onerror = (event) => {
    const errorMessages = {
      'no-speech': 'No se detectó ningún audio',
      'audio-capture': 'No se pudo acceder al micrófono',
      'not-allowed': 'Permiso denegado para usar el micrófono',
      'network': 'Error de conexión de red',
      'aborted': 'Reconocimiento cancelado',
      'language-not-supported': 'Idioma no soportado'
    };
    
    onError(errorMessages[event.error] || `Error: ${event.error}`);
  };
  
  return recognition;
};

/**
 * Verificar disponibilidad de Speech API
 */
export const isSpeechRecognitionAvailable = () => {
  return 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
};

/**
 * Solicitar permisos de micrófono
 */
export const requestMicrophonePermission = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    stream.getTracks().forEach(track => track.stop());
    return true;
  } catch (error) {
    console.error('Error requesting microphone permission:', error);
    return false;
  }
};

/**
 * Comandos de voz predefinidos (español)
 */
export const VOICE_COMMANDS = {
  // Navegación
  'ir a dashboard': { action: 'navigate', target: 'dashboard' },
  'ir a órdenes': { action: 'navigate', target: 'ordenes' },
  'ir a ventas': { action: 'navigate', target: 'ventas' },
  'ir a clientes': { action: 'navigate', target: 'clientes' },
  'ir a almacén': { action: 'navigate', target: 'almacen' },
  'ir a bancos': { action: 'navigate', target: 'bancos' },
  'ir a reportes': { action: 'navigate', target: 'reportes' },
  
  // Acciones
  'nueva venta': { action: 'new', type: 'venta' },
  'nuevo cliente': { action: 'new', type: 'cliente' },
  'nueva orden': { action: 'new', type: 'orden' },
  
  // Búsqueda
  'buscar': { action: 'search' },
  'abrir búsqueda': { action: 'search' },
  
  // UI
  'cerrar': { action: 'close' },
  'cancelar': { action: 'cancel' },
  'ayuda': { action: 'help' }
};

/**
 * Procesar comando de voz
 */
export const processVoiceCommand = (transcript) => {
  const normalizedTranscript = transcript.toLowerCase().trim();
  
  // Buscar coincidencia exacta
  if (VOICE_COMMANDS[normalizedTranscript]) {
    return VOICE_COMMANDS[normalizedTranscript];
  }
  
  // Buscar coincidencias parciales
  for (const [command, action] of Object.entries(VOICE_COMMANDS)) {
    if (normalizedTranscript.includes(command)) {
      return action;
    }
  }
  
  // Si no hay comando, es texto libre para IA
  return { action: 'ai_query', text: transcript };
};

/**
 * Text-to-Speech (opcional)
 */
export const speak = (text, options = {}) => {
  if (!('speechSynthesis' in window)) {
    console.warn('Text-to-Speech no disponible');
    return;
  }
  
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = options.lang || 'es-MX';
  utterance.rate = options.rate || 1;
  utterance.pitch = options.pitch || 1;
  utterance.volume = options.volume || 1;
  
  window.speechSynthesis.speak(utterance);
};

/**
 * Detener speech
 */
export const stopSpeaking = () => {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
};

export default {
  initVoiceRecognition,
  isSpeechRecognitionAvailable,
  requestMicrophonePermission,
  processVoiceCommand,
  VOICE_COMMANDS,
  speak,
  stopSpeaking
};
