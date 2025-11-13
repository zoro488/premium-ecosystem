/**
 * ====================================
 * GEMINI AI - INICIO RÁPIDO
 * ====================================
 * Ejemplo mínimo para empezar a usar Gemini
 * Copia y pega en cualquier componente
 */
import { useState } from 'react';

import { useGemini } from '@/hooks/useGemini';

export default function QuickStartGemini() {
  const [prompt, setPrompt] = useState('');
  const { generateContent, loading, response } = useGemini();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (prompt.trim()) {
      await generateContent(prompt);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h2>🧠 Gemini AI - Test Rápido</h2>

      <form onSubmit={handleSubmit}>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Escribe tu pregunta aquí..."
          style={{
            width: '100%',
            height: '100px',
            padding: '10px',
            marginBottom: '10px',
            fontSize: '14px',
          }}
        />

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? '⏳ Generando...' : '🚀 Generar con Gemini'}
        </button>
      </form>

      {response && (
        <div
          style={{
            marginTop: '20px',
            padding: '15px',
            background: '#f0f0f0',
            borderRadius: '8px',
            whiteSpace: 'pre-wrap',
          }}
        >
          <strong>Respuesta:</strong>
          <p>{response}</p>
        </div>
      )}
    </div>
  );
}

/*
 * USO:
 *
 * 1. Importa este componente en tu App:
 *    import QuickStartGemini from './QuickStartGemini';
 *
 * 2. Úsalo:
 *    <QuickStartGemini />
 *
 * 3. Escribe algo y presiona el botón
 *
 * ¡Eso es todo! 🎉
 */
