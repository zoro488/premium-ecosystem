/**
 * ====================================
 * GEMINI AI - PRUEBA RÁPIDA
 * ====================================
 * Componente de prueba para verificar la integración
 * Úsalo en cualquier aplicación para probar Gemini
 */
import { useState } from 'react';
import toast from 'react-hot-toast';

import {
  Brain,
  CheckCircle2,
  FileText,
  Loader2,
  MessageSquare,
  Sparkles,
  XCircle,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useGemini } from '@/hooks/useGemini';
import GeminiAIService from '@/services/geminiAI';

export const GeminiQuickTest = () => {
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState({});

  // Test 1: Conexión básica
  const testBasicConnection = async () => {
    setLoading({ ...loading, basic: true });
    try {
      const { generateContent } = useGemini();
      const response = await generateContent('Di "Hola" si funcionas correctamente');

      setResults({
        ...results,
        basic: { success: true, response },
      });
      toast.success('✅ Conexión exitosa');
    } catch (error) {
      setResults({
        ...results,
        basic: { success: false, error: error.message },
      });
      toast.error('❌ Error de conexión');
    } finally {
      setLoading({ ...loading, basic: false });
    }
  };

  // Test 2: Análisis de texto
  const testTextAnalysis = async () => {
    setLoading({ ...loading, analysis: true });
    try {
      const result = await GeminiAIService.analyzeText(
        'Este producto es excelente, muy buena calidad y precio justo.',
        'Análisis de review'
      );

      setResults({
        ...results,
        analysis: { success: result.success, data: result.analysis },
      });
      toast.success('✅ Análisis completado');
    } catch (error) {
      setResults({
        ...results,
        analysis: { success: false, error: error.message },
      });
      toast.error('❌ Error en análisis');
    } finally {
      setLoading({ ...loading, analysis: false });
    }
  };

  // Test 3: Generación de contenido
  const testContentGeneration = async () => {
    setLoading({ ...loading, content: true });
    try {
      const result = await GeminiAIService.generateProductDescription(
        'Laptop Gaming: Intel i7, RTX 4070, 32GB RAM'
      );

      setResults({
        ...results,
        content: { success: result.success, data: result.description },
      });
      toast.success('✅ Contenido generado');
    } catch (error) {
      setResults({
        ...results,
        content: { success: false, error: error.message },
      });
      toast.error('❌ Error en generación');
    } finally {
      setLoading({ ...loading, content: false });
    }
  };

  // Test 4: Resumen
  const testSummarization = async () => {
    setLoading({ ...loading, summary: true });
    try {
      const longText = `
        El ecosistema premium es una suite completa de 5 aplicaciones empresariales
        integradas que incluye FlowDistributor para gestión de flujos de trabajo,
        SmartSales para ventas inteligentes, ClientHub como CRM empresarial,
        AnalyticsPro para análisis de datos, y TeamSync para colaboración en equipo.
        Todas las aplicaciones están construidas con React 18, Vite, TailwindCSS,
        Firebase y ahora integran Google Gemini AI para capacidades de inteligencia artificial.
      `;

      const result = await GeminiAIService.summarize(longText, 50);

      setResults({
        ...results,
        summary: { success: result.success, data: result.summary },
      });
      toast.success('✅ Resumen creado');
    } catch (error) {
      setResults({
        ...results,
        summary: { success: false, error: error.message },
      });
      toast.error('❌ Error en resumen');
    } finally {
      setLoading({ ...loading, summary: false });
    }
  };

  const runAllTests = async () => {
    await testBasicConnection();
    await new Promise((resolve) => setTimeout(resolve, 1000));
    await testTextAnalysis();
    await new Promise((resolve) => setTimeout(resolve, 1000));
    await testContentGeneration();
    await new Promise((resolve) => setTimeout(resolve, 1000));
    await testSummarization();
    toast.success('🎉 Todas las pruebas completadas');
  };

  const TestCard = ({ title, icon: Icon, testKey, onTest, color }) => (
    <Card className="p-4">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon className={`h-5 w-5 ${color}`} />
            <h3 className="font-medium">{title}</h3>
          </div>
          {results[testKey] &&
            (results[testKey].success ? (
              <CheckCircle2 className="h-5 w-5 text-green-500" />
            ) : (
              <XCircle className="h-5 w-5 text-red-500" />
            ))}
        </div>

        <Button
          onClick={onTest}
          disabled={loading[testKey]}
          size="sm"
          className="w-full"
          variant="outline"
        >
          {loading[testKey] ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Probando...
            </>
          ) : (
            'Ejecutar Prueba'
          )}
        </Button>

        {results[testKey] && (
          <div
            className={`text-xs p-2 rounded ${
              results[testKey].success
                ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300'
                : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'
            }`}
          >
            {results[testKey].success ? (
              <div className="space-y-1">
                <p className="font-medium">✅ Éxito</p>
                {results[testKey].data && <p className="line-clamp-3">{results[testKey].data}</p>}
                {results[testKey].response && (
                  <p className="line-clamp-3">{results[testKey].response}</p>
                )}
              </div>
            ) : (
              <div>
                <p className="font-medium">❌ Error</p>
                <p>{results[testKey].error}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2">
          <Brain className="h-8 w-8 text-purple-500" />
          <h1 className="text-3xl font-bold">Gemini AI - Pruebas</h1>
        </div>
        <p className="text-gray-600 dark:text-gray-400">
          Verifica que la integración de Gemini funcione correctamente
        </p>
      </div>

      {/* Quick Actions */}
      <div className="flex gap-4">
        <Button
          onClick={runAllTests}
          className="flex-1"
          disabled={Object.values(loading).some((v) => v)}
        >
          <Sparkles className="mr-2 h-4 w-4" />
          Ejecutar Todas las Pruebas
        </Button>
      </div>

      {/* Test Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TestCard
          title="Conexión Básica"
          icon={Sparkles}
          testKey="basic"
          onTest={testBasicConnection}
          color="text-purple-500"
        />

        <TestCard
          title="Análisis de Texto"
          icon={Brain}
          testKey="analysis"
          onTest={testTextAnalysis}
          color="text-blue-500"
        />

        <TestCard
          title="Generación de Contenido"
          icon={FileText}
          testKey="content"
          onTest={testContentGeneration}
          color="text-green-500"
        />

        <TestCard
          title="Resumen de Texto"
          icon={MessageSquare}
          testKey="summary"
          onTest={testSummarization}
          color="text-orange-500"
        />
      </div>

      {/* API Info */}
      <Card className="p-4 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20">
        <div className="space-y-2">
          <p className="text-sm font-medium">📊 Información de API</p>
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <p className="text-gray-600 dark:text-gray-400">API Key:</p>
              <p className="font-mono">
                {import.meta.env.VITE_GEMINI_API_KEY?.substring(0, 10)}...
              </p>
            </div>
            <div>
              <p className="text-gray-600 dark:text-gray-400">Modelo:</p>
              <p className="font-mono">gemini-pro</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Instructions */}
      <Card className="p-4 bg-blue-50 dark:bg-blue-900/20">
        <div className="space-y-2">
          <p className="text-sm font-medium text-blue-700 dark:text-blue-300">
            💡 Cómo usar este componente
          </p>
          <ol className="text-xs text-blue-600 dark:text-blue-400 space-y-1 list-decimal list-inside">
            <li>Importa el componente en cualquier app</li>
            <li>Ejecuta las pruebas individuales o todas juntas</li>
            <li>Verifica que todas pasen exitosamente</li>
            <li>Si alguna falla, revisa la API key en .env</li>
          </ol>
        </div>
      </Card>
    </div>
  );
};

export default GeminiQuickTest;
