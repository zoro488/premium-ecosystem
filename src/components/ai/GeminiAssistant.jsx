/**
 * ====================================
 * GEMINI AI ASSISTANT - COMPONENTE UI
 * ====================================
 * Componente React para interactuar con Gemini
 * Incluye chat, generación de contenido y análisis
 */
import { useState } from 'react';
import toast from 'react-hot-toast';

import { Check, Copy, Loader2, Send, Sparkles, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useGemini } from '@/hooks/useGemini';

/**
 * Componente principal de asistente IA
 */
export const GeminiAssistant = ({
  modelType = 'balanced',
  placeholder = 'Pregunta algo al asistente IA...',
  onResponse,
  className = '',
}) => {
  const [prompt, setPrompt] = useState('');
  const [copied, setCopied] = useState(false);

  const { loading, error, response, generateContent, reset } = useGemini({ modelType });

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error('Escribe algo primero');
      return;
    }

    try {
      const result = await generateContent(prompt);

      if (onResponse) {
        onResponse(result);
      }

      toast.success('¡Respuesta generada!');
    } catch (err) {
      toast.error(err.error || 'Error al generar respuesta');
    }
  };

  const handleCopy = () => {
    if (response) {
      navigator.clipboard.writeText(response);
      setCopied(true);
      toast.success('Copiado al portapapeles');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleReset = () => {
    reset();
    setPrompt('');
    setCopied(false);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Input Area */}
      <div className="relative">
        <Textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder={placeholder}
          className="min-h-[120px] pr-12 resize-none"
          disabled={loading}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && e.ctrlKey) {
              e.preventDefault();
              handleGenerate();
            }
          }}
        />
        <div className="absolute bottom-3 right-3">
          <Sparkles className="h-5 w-5 text-zinc-200" />
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <Button onClick={handleGenerate} disabled={loading || !prompt.trim()} className="flex-1">
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generando...
            </>
          ) : (
            <>
              <Send className="mr-2 h-4 w-4" />
              Generar con Gemini
            </>
          )}
        </Button>

        {(response || error) && (
          <Button onClick={handleReset} variant="outline" size="icon">
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Response Area */}
      {response && (
        <div className="relative space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Respuesta de Gemini
            </h3>
            <Button onClick={handleCopy} variant="ghost" size="sm">
              {copied ? (
                <>
                  <Check className="mr-1 h-3 w-3" />
                  Copiado
                </>
              ) : (
                <>
                  <Copy className="mr-1 h-3 w-3" />
                  Copiar
                </>
              )}
            </Button>
          </div>

          <div className="rounded-lg bg-gradient-to-br from-zinc-800 to-blue-50 dark:from-zinc-800/20 dark:to-blue-900/20 p-4 border border-zinc-700 dark:border-zinc-700">
            <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap">
              {response}
            </div>
          </div>
        </div>
      )}

      {/* Error Area */}
      {error && (
        <div className="rounded-lg bg-red-50 dark:bg-red-900/20 p-4 border border-red-200 dark:border-red-800">
          <p className="text-sm text-red-600 dark:text-red-400">{error.error}</p>
        </div>
      )}

      {/* Helper Text */}
      <p className="text-xs text-gray-500 text-center">
        Presiona Ctrl+Enter para generar • Powered by Google Gemini
      </p>
    </div>
  );
};

/**
 * Componente de chat conversacional
 */
export const GeminiChat = ({ className = '' }) => {
  const [message, setMessage] = useState('');

  const { loading, chatHistory, chat, reset } = useGemini({ modelType: 'balanced' });

  const handleSend = async () => {
    if (!message.trim()) return;

    const userMessage = message;
    setMessage('');

    try {
      await chat(userMessage);
    } catch (err) {
      toast.error(err.error || 'Error en el chat');
    }
  };

  return (
    <div className={`flex flex-col h-full ${className}`}>
      {/* Chat History */}
      <div className="flex-1 overflow-y-auto space-y-4 p-4">
        {chatHistory.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-400">
            <div className="text-center">
              <Sparkles className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>Inicia una conversación con Gemini</p>
            </div>
          </div>
        ) : (
          chatHistory.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  msg.role === 'user'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
              </div>
            </div>
          ))
        )}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3">
              <Loader2 className="h-4 w-4 animate-spin" />
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="border-t p-4 space-y-2">
        <div className="flex gap-2">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Escribe un mensaje..."
            className="resize-none"
            rows={2}
            disabled={loading}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
          />
          <Button onClick={handleSend} disabled={loading || !message.trim()} size="icon">
            <Send className="h-4 w-4" />
          </Button>
        </div>

        {chatHistory.length > 0 && (
          <Button onClick={reset} variant="ghost" size="sm" className="w-full">
            Limpiar conversación
          </Button>
        )}
      </div>
    </div>
  );
};

/**
 * Componente compacto para quick actions
 */
export const GeminiQuickAction = ({ action, icon: Icon, label, onComplete }) => {
  const { generateContent, loading } = useGemini();

  const handleAction = async () => {
    try {
      const result = await generateContent(action);
      toast.success('¡Completado!');
      if (onComplete) onComplete(result);
    } catch (err) {
      toast.error('Error al procesar');
    }
  };

  return (
    <Button
      onClick={handleAction}
      disabled={loading}
      variant="outline"
      className="w-full justify-start"
    >
      {loading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        Icon && <Icon className="mr-2 h-4 w-4" />
      )}
      {label}
    </Button>
  );
};

export default GeminiAssistant;
