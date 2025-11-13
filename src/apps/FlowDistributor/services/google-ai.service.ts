/**
 * 🤖 GOOGLE VERTEX AI SERVICE
 * Integración con Google Cloud Vertex AI
 * - Gemini Pro (Chat y generación de texto)
 * - Speech-to-Text (Transcripción de voz)
 * - Document AI (OCR y análisis de documentos)
 * - Vision API (Análisis de imágenes)
 */

// ============================================================================
// CONFIGURACIÓN
// ============================================================================

const VERTEX_AI_CONFIG = {
  projectId: import.meta.env.VITE_GOOGLE_PROJECT_ID || 'flowdistributor-ai',
  location: import.meta.env.VITE_GOOGLE_LOCATION || 'us-central1',
  apiKey: import.meta.env.VITE_GOOGLE_API_KEY || '',
};

// ============================================================================
// TIPOS
// ============================================================================

export interface GeminiMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface GeminiResponse {
  text: string;
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export interface SpeechToTextResult {
  transcript: string;
  confidence: number;
  language: string;
}

export interface DocumentAIResult {
  text: string;
  entities: Array<{
    type: string;
    mentionText: string;
    confidence: number;
  }>;
  tables?: Array<{
    rows: number;
    columns: number;
    data: string[][];
  }>;
}

export interface VisionAnalysisResult {
  labels: Array<{ description: string; score: number }>;
  objects: Array<{ name: string; confidence: number; boundingBox: any }>;
  text?: string;
  safeSearch: {
    adult: string;
    violence: string;
  };
}

// ============================================================================
// GEMINI PRO - Chat y Generación
// ============================================================================

/**
 * Enviar mensaje a Gemini Pro
 */
export async function sendToGemini(
  messages: GeminiMessage[],
  options: {
    temperature?: number;
    maxTokens?: number;
    systemPrompt?: string;
  } = {}
): Promise<GeminiResponse> {

  const {
    temperature = 0.7,
    maxTokens = 2048,
    systemPrompt = 'Eres un asistente inteligente para FlowDistributor, un sistema de gestión empresarial.'
  } = options;

  try {
    // Construir el prompt
    const conversation = messages.map(msg => {
      const role = msg.role === 'assistant' ? 'model' : 'user';
      return { role, parts: [{ text: msg.content }] };
    });

    // Si hay system prompt, agregarlo al inicio
    if (systemPrompt) {
      conversation.unshift({
        role: 'user',
        parts: [{ text: systemPrompt }]
      });
    }

    // Llamar a la API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${VERTEX_AI_CONFIG.apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: conversation,
          generationConfig: {
            temperature,
            maxOutputTokens: maxTokens,
            topP: 0.95,
            topK: 40,
          },
          safetySettings: [
            {
              category: 'HARM_CATEGORY_HARASSMENT',
              threshold: 'BLOCK_MEDIUM_AND_ABOVE'
            },
            {
              category: 'HARM_CATEGORY_HATE_SPEECH',
              threshold: 'BLOCK_MEDIUM_AND_ABOVE'
            }
          ]
        })
      }
    );

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    // Extraer respuesta
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

    return {
      text,
      usage: {
        promptTokens: data.usageMetadata?.promptTokenCount || 0,
        completionTokens: data.usageMetadata?.candidatesTokenCount || 0,
        totalTokens: data.usageMetadata?.totalTokenCount || 0,
      }
    };

  } catch (error) {
    console.error('Error en Gemini Pro:', error);
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    throw new Error(`Error al comunicarse con Gemini: ${errorMessage}`);
  }
}

/**
 * Streaming de respuestas de Gemini
 */
export async function* streamGemini(
  messages: GeminiMessage[],
  options: {
    temperature?: number;
    maxTokens?: number;
    systemPrompt?: string;
  } = {}
): AsyncGenerator<string, void, unknown> {

  const {
    temperature = 0.7,
    maxTokens = 2048,
    systemPrompt = 'Eres un asistente inteligente para FlowDistributor.'
  } = options;

  try {
    const conversation = messages.map(msg => {
      const role = msg.role === 'assistant' ? 'model' : 'user';
      return { role, parts: [{ text: msg.content }] };
    });

    if (systemPrompt) {
      conversation.unshift({
        role: 'user',
        parts: [{ text: systemPrompt }]
      });
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:streamGenerateContent?key=${VERTEX_AI_CONFIG.apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: conversation,
          generationConfig: {
            temperature,
            maxOutputTokens: maxTokens,
          }
        })
      }
    );

    if (!response.ok) {
      throw new Error(`Gemini streaming error: ${response.status}`);
    }

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();

    if (!reader) {
      throw new Error('No se pudo obtener el reader de la respuesta');
    }

    while (true) {
      const { done, value } = await reader.read();

      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split('\n');

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const jsonData = line.slice(6);

          try {
            const parsed = JSON.parse(jsonData);
            const text = parsed.candidates?.[0]?.content?.parts?.[0]?.text;

            if (text) {
              yield text;
            }
          } catch (e) {
            // Ignorar líneas que no son JSON válido
          }
        }
      }
    }

  } catch (error) {
    console.error('Error en Gemini streaming:', error);
    throw error;
  }
}

// ============================================================================
// SPEECH-TO-TEXT - Transcripción de voz
// ============================================================================

/**
 * Transcribir audio a texto
 */
export async function transcribeAudio(
  audioBlob: Blob,
  options: {
    language?: string;
    model?: 'default' | 'enhanced';
  } = {}
): Promise<SpeechToTextResult> {

  const {
    language = 'es-MX',
    model = 'enhanced'
  } = options;

  try {
    // Convertir blob a base64
    const reader = new FileReader();
    const audioBase64 = await new Promise<string>((resolve, reject) => {
      reader.onloadend = () => {
        const base64 = reader.result as string;
        const base64Data = base64.split(',')[1];
        resolve(base64Data || '');
      };
      reader.onerror = reject;
      reader.readAsDataURL(audioBlob);
    });

    // Llamar a Speech-to-Text API
    const response = await fetch(
      `https://speech.googleapis.com/v1/speech:recognize?key=${VERTEX_AI_CONFIG.apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          config: {
            encoding: 'WEBM_OPUS',
            sampleRateHertz: 48000,
            languageCode: language,
            model: model === 'enhanced' ? 'latest_long' : 'default',
            enableAutomaticPunctuation: true,
          },
          audio: {
            content: audioBase64
          }
        })
      }
    );

    if (!response.ok) {
      throw new Error(`Speech-to-Text error: ${response.status}`);
    }

    const data = await response.json();

    const result = data.results?.[0];
    const alternative = result?.alternatives?.[0];

    return {
      transcript: alternative?.transcript || '',
      confidence: alternative?.confidence || 0,
      language: language
    };

  } catch (error) {
    console.error('Error en Speech-to-Text:', error);
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    throw new Error(`Error al transcribir audio: ${errorMessage}`);
  }
}

// ============================================================================
// DOCUMENT AI - OCR y análisis de documentos
// ============================================================================

/**
 * Analizar documento (OCR)
 */
export async function analyzeDocument(
  file: File | Blob
): Promise<DocumentAIResult> {

  try {
    // Convertir a base64
    const reader = new FileReader();
    const fileBase64 = await new Promise<string>((resolve, reject) => {
      reader.onloadend = () => {
        const base64 = reader.result as string;
        const base64Data = base64.split(',')[1];
        resolve(base64Data || '');
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

    // Llamar a Document AI (usando Vision API como fallback)
    const response = await fetch(
      `https://vision.googleapis.com/v1/images:annotate?key=${VERTEX_AI_CONFIG.apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          requests: [{
            image: {
              content: fileBase64
            },
            features: [
              { type: 'DOCUMENT_TEXT_DETECTION' },
              { type: 'TEXT_DETECTION' }
            ]
          }]
        })
      }
    );

    if (!response.ok) {
      throw new Error(`Document AI error: ${response.status}`);
    }

    const data = await response.json();
    const annotations = data.responses?.[0];

    return {
      text: annotations?.fullTextAnnotation?.text || '',
      entities: [], // TODO: Implementar entity extraction
      tables: [] // TODO: Implementar table extraction
    };

  } catch (error) {
    console.error('Error en Document AI:', error);
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    throw new Error(`Error al analizar documento: ${errorMessage}`);
  }
}

// ============================================================================
// VISION API - Análisis de imágenes
// ============================================================================

/**
 * Analizar imagen
 */
export async function analyzeImage(
  file: File | Blob
): Promise<VisionAnalysisResult> {

  try {
    const reader = new FileReader();
    const imageBase64 = await new Promise<string>((resolve, reject) => {
      reader.onloadend = () => {
        const base64 = reader.result as string;
        const base64Data = base64.split(',')[1];
        resolve(base64Data || '');
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

    const response = await fetch(
      `https://vision.googleapis.com/v1/images:annotate?key=${VERTEX_AI_CONFIG.apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          requests: [{
            image: {
              content: imageBase64
            },
            features: [
              { type: 'LABEL_DETECTION', maxResults: 10 },
              { type: 'OBJECT_LOCALIZATION', maxResults: 10 },
              { type: 'TEXT_DETECTION' },
              { type: 'SAFE_SEARCH_DETECTION' }
            ]
          }]
        })
      }
    );

    if (!response.ok) {
      throw new Error(`Vision API error: ${response.status}`);
    }

    const data = await response.json();
    const annotations = data.responses?.[0];

    return {
      labels: annotations?.labelAnnotations?.map((label: any) => ({
        description: label.description,
        score: label.score
      })) || [],
      objects: annotations?.localizedObjectAnnotations?.map((obj: any) => ({
        name: obj.name,
        confidence: obj.score,
        boundingBox: obj.boundingPoly
      })) || [],
      text: annotations?.textAnnotations?.[0]?.description || '',
      safeSearch: {
        adult: annotations?.safeSearchAnnotation?.adult || 'UNKNOWN',
        violence: annotations?.safeSearchAnnotation?.violence || 'UNKNOWN'
      }
    };

  } catch (error) {
    console.error('Error en Vision API:', error);
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    throw new Error(`Error al analizar imagen: ${errorMessage}`);
  }
}

// ============================================================================
// UTILIDADES
// ============================================================================

/**
 * Verificar si la API key está configurada
 */
export function isGoogleAIConfigured(): boolean {
  return Boolean(VERTEX_AI_CONFIG.apiKey);
}

/**
 * Obtener información de configuración
 */
export function getGoogleAIConfig() {
  return {
    ...VERTEX_AI_CONFIG,
    apiKey: VERTEX_AI_CONFIG.apiKey ? '***' + VERTEX_AI_CONFIG.apiKey.slice(-4) : 'NO CONFIGURADA'
  };
}
