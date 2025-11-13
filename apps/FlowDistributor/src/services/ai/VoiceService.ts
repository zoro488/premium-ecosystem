/**
 * 🎤 VOICE SERVICE - Sistema de transcripción y síntesis de voz
 *
 * Integra Deepgram para:
 * - 🎙️ Transcripción en tiempo real (Speech-to-Text)
 * - 🔊 Síntesis de voz (Text-to-Speech)
 * - 📡 Streaming de audio
 * - 🎛️ Control de sesiones de voz
 */
import { createClient } from '@deepgram/sdk';

interface VoiceConfig {
  apiKey: string;
  language?: string;
  model?: string;
  interim_results?: boolean;
}

interface TranscriptionResult {
  text: string;
  isFinal: boolean;
  confidence: number;
  timestamp: Date;
}

export class VoiceService {
  private deepgram: ReturnType<typeof createClient>;
  private mediaRecorder: MediaRecorder | null = null;
  private liveConnection: ReturnType<ReturnType<typeof createClient>['listen']['live']> | null =
    null;
  private onTranscript?: (result: TranscriptionResult) => void;
  private onError?: (error: Error) => void;

  constructor(config: VoiceConfig) {
    this.deepgram = createClient(config.apiKey);
  }

  /**
   * Inicia una sesión de transcripción en tiempo real
   */
  async startListening(
    onTranscript: (result: TranscriptionResult) => void,
    onError?: (error: Error) => void
  ): Promise<void> {
    try {
      this.onTranscript = onTranscript;
      this.onError = onError;

      // Obtener stream de audio del micrófono
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // Configurar MediaRecorder
      this.mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm',
      });

      // Crear conexión con Deepgram
      this.liveConnection = this.deepgram.listen.live({
        model: 'nova-2',
        language: 'es',
        smart_format: true,
        interim_results: true,
        punctuate: true,
        diarize: false,
      });

      // Configurar event listeners
      this.setupConnectionListeners();

      // Abrir conexión
      await new Promise<void>((resolve, reject) => {
        if (!this.liveConnection) {
          reject(new Error('Failed to create connection'));
          return;
        }

        this.liveConnection.on('open', () => {
          console.log('✅ Conexión con Deepgram establecida');
          resolve();
        });

        this.liveConnection.on('error', (error: unknown) => {
          console.error('❌ Error de conexión:', error);
          reject(error);
        });
      });

      // Enviar audio a Deepgram
      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0 && this.liveConnection) {
          this.liveConnection.send(event.data);
        }
      };

      this.mediaRecorder.start(250); // Enviar chunks cada 250ms
    } catch (error) {
      console.error('Error iniciando escucha:', error);
      if (this.onError) {
        this.onError(error as Error);
      }
      throw error;
    }
  }

  /**
   * Detiene la sesión de transcripción
   */
  stopListening(): void {
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      this.mediaRecorder.stop();

      // Detener todos los tracks de audio
      this.mediaRecorder.stream.getTracks().forEach((track) => track.stop());
    }

    if (this.liveConnection) {
      this.liveConnection.finish();
      this.liveConnection = null;
    }

    this.mediaRecorder = null;
  }

  /**
   * Convierte texto a voz
   */
  async textToSpeech(text: string): Promise<void> {
    try {
      // TODO: Implementar TTS con Deepgram o alternativa
      console.log('TTS:', text);

      // Por ahora usar Web Speech API como fallback
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'es-ES';
        utterance.rate = 1.0;
        utterance.pitch = 1.0;
        window.speechSynthesis.speak(utterance);
      }
    } catch (error) {
      console.error('Error en TTS:', error);
      throw error;
    }
  }

  /**
   * Verifica si el navegador soporta grabación de audio
   */
  static isSupported(): boolean {
    return !!(
      navigator.mediaDevices &&
      typeof navigator.mediaDevices.getUserMedia === 'function' &&
      window.MediaRecorder
    );
  }

  /**
   * Solicita permisos de micrófono
   */
  static async requestMicrophonePermission(): Promise<boolean> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach((track) => track.stop());
      return true;
    } catch (error) {
      console.error('Error solicitando permisos de micrófono:', error);
      return false;
    }
  }

  /**
   * Configura los listeners de la conexión
   */
  private setupConnectionListeners(): void {
    if (!this.liveConnection) return;

    // Transcripciones recibidas
    this.liveConnection.on('transcript', (data: unknown) => {
      const transcriptData = data as {
        channel?: {
          alternatives?: Array<{
            transcript?: string;
            confidence?: number;
          }>;
        };
        is_final?: boolean;
      };

      const transcript = transcriptData.channel?.alternatives?.[0]?.transcript;
      const confidence = transcriptData.channel?.alternatives?.[0]?.confidence ?? 0;
      const isFinal = transcriptData.is_final ?? false;

      if (transcript && transcript.length > 0 && this.onTranscript) {
        this.onTranscript({
          text: transcript,
          isFinal,
          confidence,
          timestamp: new Date(),
        });
      }
    });

    // Errores
    this.liveConnection.on('error', (error: unknown) => {
      console.error('❌ Error de Deepgram:', error);
      if (this.onError) {
        this.onError(error as Error);
      }
    });

    // Cierre de conexión
    this.liveConnection.on('close', () => {
      console.log('🔌 Conexión con Deepgram cerrada');
    });

    // Warnings
    this.liveConnection.on('warning', (warning: unknown) => {
      console.warn('⚠️ Advertencia de Deepgram:', warning);
    });

    // Metadata
    this.liveConnection.on('metadata', (metadata: unknown) => {
      console.log('📊 Metadata:', metadata);
    });
  }

  /**
   * Verifica si hay una sesión activa
   */
  isListening(): boolean {
    return this.mediaRecorder !== null && this.mediaRecorder.state === 'recording';
  }
}

export default VoiceService;
