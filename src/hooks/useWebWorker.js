/**
 * 🔄 HOOK para usar Web Workers
 * Nivel: PERFORMANCE ENTERPRISE
 */
import { useCallback, useEffect, useRef, useState } from 'react';

export function useWebWorker(workerUrl) {
  const workerRef = useRef(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    // Crear worker
    workerRef.current = new Worker(workerUrl, { type: 'module' });

    // Escuchar mensajes
    workerRef.current.onmessage = (e) => {
      setResult(e.data);
      setIsProcessing(false);
    };

    // Manejar errores
    workerRef.current.onerror = (err) => {
      setError(err);
      setIsProcessing(false);
    };

    // Cleanup
    return () => {
      workerRef.current?.terminate();
    };
  }, [workerUrl]);

  const postMessage = useCallback((message) => {
    setIsProcessing(true);
    setError(null);
    workerRef.current?.postMessage(message);
  }, []);

  return { postMessage, result, error, isProcessing };
}
