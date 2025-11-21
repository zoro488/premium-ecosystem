/**
 * ====================================
 * SMARTSALES - INTEGRACIÓN GEMINI AI
 * ====================================
 * Ejemplo de uso de Gemini AI en SmartSales
 */
import { useState } from 'react';
import toast from 'react-hot-toast';

import { FileText, MessageSquare, Sparkles, TrendingUp } from 'lucide-react';

import { GeminiAssistant } from '@/components/ai/GeminiAssistant';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useGemini } from '@/hooks/useGemini';
import GeminiAIService from '@/services/geminiAI';

/**
 * Componente: Generador de Descripciones de Producto
 */
export const ProductDescriptionGenerator = ({ product }) => {
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const generateDescription = async () => {
    setLoading(true);
    try {
      const productInfo = `
        Nombre: ${product.name}
        Categoría: ${product.category}
        Características: ${product.features?.join(', ') || 'N/A'}
        Precio: $${product.price}
      `;

      const result = await GeminiAIService.generateProductDescription(productInfo);

      if (result.success) {
        setDescription(result.description);
        toast.success('Descripción generada exitosamente');
      }
    } catch (error) {
      toast.error('Error al generar descripción');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <FileText className="h-5 w-5 text-zinc-200" />
        <h3 className="text-lg font-semibold">Generador de Descripciones</h3>
      </div>

      <div className="space-y-4">
        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
          <p className="text-sm font-medium mb-2">Producto:</p>
          <p className="text-lg">{product.name}</p>
        </div>

        <Button onClick={generateDescription} disabled={loading} className="w-full">
          {loading ? (
            'Generando con IA...'
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              Generar Descripción con Gemini
            </>
          )}
        </Button>

        {description && (
          <div className="bg-gradient-to-br from-zinc-800 to-blue-50 dark:from-zinc-800/20 dark:to-blue-900/20 p-4 rounded-lg border border-zinc-700 dark:border-zinc-700">
            <p className="text-sm whitespace-pre-wrap">{description}</p>
          </div>
        )}
      </div>
    </Card>
  );
};

/**
 * Componente: Análisis de Feedback de Clientes
 */
export const CustomerFeedbackAnalyzer = ({ reviews }) => {
  const [analysis, setAnalysis] = useState(null);
  const { generateContent, loading } = useGemini({ modelType: 'precise' });

  const analyzeReviews = async () => {
    try {
      const reviewsText = reviews
        .map((r) => `"${r.comment}" - ${r.rating}/5 estrellas`)
        .join('\n\n');

      const prompt = `Analiza estos reviews de clientes y proporciona:
1. Sentimiento general
2. Aspectos positivos más mencionados
3. Áreas de mejora
4. Recomendaciones

Reviews:
${reviewsText}`;

      const result = await generateContent(prompt);
      setAnalysis(result);
      toast.success('Análisis completado');
    } catch (error) {
      toast.error('Error al analizar reviews');
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <MessageSquare className="h-5 w-5 text-blue-500" />
        <h3 className="text-lg font-semibold">Análisis de Feedback</h3>
      </div>

      <div className="space-y-4">
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {reviews.length} reviews para analizar
        </div>

        <Button onClick={analyzeReviews} disabled={loading} className="w-full">
          {loading ? 'Analizando...' : 'Analizar con IA'}
        </Button>

        {analysis && (
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <pre className="text-sm whitespace-pre-wrap">{analysis}</pre>
          </div>
        )}
      </div>
    </Card>
  );
};

/**
 * Componente: Predicción de Tendencias de Ventas
 */
export const SalesTrendPredictor = ({ salesData }) => {
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);

  const predictTrends = async () => {
    setLoading(true);
    try {
      const result = await GeminiAIService.predictTrends(salesData, 'ventas');

      if (result.success) {
        setPrediction(result.prediction);
        toast.success('Predicción generada');
      }
    } catch (error) {
      toast.error('Error al predecir tendencias');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="h-5 w-5 text-green-500" />
        <h3 className="text-lg font-semibold">Predicción de Tendencias</h3>
      </div>

      <div className="space-y-4">
        <Button onClick={predictTrends} disabled={loading} className="w-full">
          {loading ? 'Analizando datos...' : 'Predecir Tendencias'}
        </Button>

        {prediction && (
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
            <pre className="text-sm whitespace-pre-wrap">{prediction}</pre>
          </div>
        )}
      </div>
    </Card>
  );
};

/**
 * Componente: Asistente General de Ventas
 */
export const SalesAssistant = () => {
  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="h-5 w-5 text-zinc-200" />
        <h3 className="text-lg font-semibold">Asistente de Ventas IA</h3>
      </div>

      <GeminiAssistant
        modelType="creative"
        placeholder="Pregunta sobre estrategias de venta, productos, clientes..."
        onResponse={(response) => {
          // Guardar en historial, etc.
          console.log('AI Response:', response);
        }}
      />
    </Card>
  );
};

/**
 * Hook personalizado para SmartSales
 */
export const useSmartSalesAI = () => {
  const generateProductCopy = async (product) => {
    const result = await GeminiAIService.generateProductDescription(
      `${product.name} - ${product.description}`
    );
    return result.description;
  };

  const analyzeCompetition = async (competitorData) => {
    const { generateContent } = useGemini({ modelType: 'precise' });

    const prompt = `Analiza estos competidores y dame insights estratégicos:
${JSON.stringify(competitorData, null, 2)}`;

    return await generateContent(prompt);
  };

  const suggestPricing = async (product, marketData) => {
    const { generateContent } = useGemini({ modelType: 'precise' });

    const prompt = `Basándote en estos datos de mercado, sugiere una estrategia de precios:
Producto: ${JSON.stringify(product)}
Mercado: ${JSON.stringify(marketData)}`;

    return await generateContent(prompt);
  };

  const generateSalesEmail = async (lead, context) => {
    return await GeminiAIService.generateEmail(
      'prospección',
      `Lead: ${lead.name}, Empresa: ${lead.company}`,
      context
    );
  };

  return {
    generateProductCopy,
    analyzeCompetition,
    suggestPricing,
    generateSalesEmail,
  };
};

export default {
  ProductDescriptionGenerator,
  CustomerFeedbackAnalyzer,
  SalesTrendPredictor,
  SalesAssistant,
  useSmartSalesAI,
};
