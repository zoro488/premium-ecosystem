// Agregar al inicio del archivo después de imports
import hybridAI from '../../services/ai/HybridAIService';

// Reemplazar handleSendMessage con:
const handleSendMessage = async (content) => {
  if (!content.trim()) return;

  const userMessage = {
    id: Date.now(),
    role: 'user',
    content: content.trim(),
    timestamp: new Date().toLocaleTimeString()
  };

  setMessages(prev => [...prev, userMessage]);
  setIsLoading(true);

  try {
    // Usar IA real con Bedrock
    const response = await hybridAI.chat(
      [...messages, userMessage],
      'general',
      { model: selectedModel.id, stream: false }
    );

    const assistantMessage = {
      id: Date.now() + 1,
      role: 'assistant',
      content: response.text,
      model: response.model,
      timestamp: new Date().toLocaleTimeString()
    };

    setMessages(prev => [...prev, assistantMessage]);
  } catch (error) {
    console.error('AI Error:', error);

    const errorMessage = {
      id: Date.now() + 1,
      role: 'assistant',
      content: 'Lo siento, ocurrió un error al procesar tu mensaje. Por favor intenta de nuevo.',
      timestamp: new Date().toLocaleTimeString()
    };

    setMessages(prev => [...prev, errorMessage]);
  } finally {
    setIsLoading(false);
  }
};
