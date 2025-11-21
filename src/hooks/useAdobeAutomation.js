/**
 * 🎮 REACT HOOKS - CLI Integration
 * Hooks para integrar comandos CLI con componentes React
 */
import { useCallback, useEffect, useState } from 'react';

import { getJobQueue } from '../services/BackgroundJobProcessor';

/**
 * Hook para generar componentes con CLI
 */
export function useComponentGenerator() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const queue = getJobQueue();

  const generate = useCallback(
    async (config) => {
      setIsGenerating(true);
      setProgress(0);
      setError(null);
      setResult(null);

      try {
        const jobId = queue.addJob({
          type: 'generate-component',
          params: config,
        });

        // Escuchar progreso
        const handleProgress = ({ id, progress: prog }) => {
          if (id === jobId) {
            setProgress(prog);
          }
        };

        const handleCompleted = (job) => {
          if (job.id === jobId) {
            setResult(job.result);
            setIsGenerating(false);
            queue.off('job:progress', handleProgress);
            queue.off('job:completed', handleCompleted);
            queue.off('job:failed', handleFailed);
          }
        };

        const handleFailed = (job) => {
          if (job.id === jobId) {
            setError(job.error);
            setIsGenerating(false);
            queue.off('job:progress', handleProgress);
            queue.off('job:completed', handleCompleted);
            queue.off('job:failed', handleFailed);
          }
        };

        queue.on('job:progress', handleProgress);
        queue.on('job:completed', handleCompleted);
        queue.on('job:failed', handleFailed);
      } catch (err) {
        setError(err.message);
        setIsGenerating(false);
      }
    },
    [queue]
  );

  return { generate, isGenerating, progress, result, error };
}

/**
 * Hook para exportar animaciones
 */
export function useAnimationExporter() {
  const [isExporting, setIsExporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const queue = getJobQueue();

  const exportAnimation = useCallback(
    async (config) => {
      setIsExporting(true);
      setProgress(0);
      setError(null);
      setResult(null);

      try {
        const jobId = queue.addJob({
          type: 'export-animation',
          params: config,
        });

        const handleProgress = ({ id, progress: prog }) => {
          if (id === jobId) setProgress(prog);
        };

        const handleCompleted = (job) => {
          if (job.id === jobId) {
            setResult(job.result);
            setIsExporting(false);
            queue.off('job:progress', handleProgress);
            queue.off('job:completed', handleCompleted);
            queue.off('job:failed', handleFailed);
          }
        };

        const handleFailed = (job) => {
          if (job.id === jobId) {
            setError(job.error);
            setIsExporting(false);
            queue.off('job:progress', handleProgress);
            queue.off('job:completed', handleCompleted);
            queue.off('job:failed', handleFailed);
          }
        };

        queue.on('job:progress', handleProgress);
        queue.on('job:completed', handleCompleted);
        queue.on('job:failed', handleFailed);
      } catch (err) {
        setError(err.message);
        setIsExporting(false);
      }
    },
    [queue]
  );

  return { exportAnimation, isExporting, progress, result, error };
}

/**
 * Hook para generar sistemas de diseño
 */
export function useDesignSystemGenerator() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const queue = getJobQueue();

  const generateDesignSystem = useCallback(
    async (config) => {
      setIsGenerating(true);
      setProgress(0);
      setError(null);
      setResult(null);

      try {
        const jobId = queue.addJob({
          type: 'generate-design-system',
          params: config,
        });

        const handleProgress = ({ id, progress: prog }) => {
          if (id === jobId) setProgress(prog);
        };

        const handleCompleted = (job) => {
          if (job.id === jobId) {
            setResult(job.result);
            setIsGenerating(false);
            cleanup();
          }
        };

        const handleFailed = (job) => {
          if (job.id === jobId) {
            setError(job.error);
            setIsGenerating(false);
            cleanup();
          }
        };

        const cleanup = () => {
          queue.off('job:progress', handleProgress);
          queue.off('job:completed', handleCompleted);
          queue.off('job:failed', handleFailed);
        };

        queue.on('job:progress', handleProgress);
        queue.on('job:completed', handleCompleted);
        queue.on('job:failed', handleFailed);
      } catch (err) {
        setError(err.message);
        setIsGenerating(false);
      }
    },
    [queue]
  );

  return { generateDesignSystem, isGenerating, progress, result, error };
}

/**
 * Hook para monitorear queue de jobs
 */
export function useJobQueue() {
  const [jobs, setJobs] = useState([]);
  const [isRunning, setIsRunning] = useState(false);

  const queue = getJobQueue();

  useEffect(() => {
    const updateJobs = () => {
      setJobs([...queue.getAllJobs()]);
      setIsRunning(queue.running);
    };

    // Actualizar en cada evento
    queue.on('job:added', updateJobs);
    queue.on('job:started', updateJobs);
    queue.on('job:completed', updateJobs);
    queue.on('job:failed', updateJobs);
    queue.on('job:progress', updateJobs);

    // Actualización inicial
    updateJobs();

    return () => {
      queue.off('job:added', updateJobs);
      queue.off('job:started', updateJobs);
      queue.off('job:completed', updateJobs);
      queue.off('job:failed', updateJobs);
      queue.off('job:progress', updateJobs);
    };
  }, [queue]);

  const startQueue = useCallback(() => {
    queue.start();
    setIsRunning(true);
  }, [queue]);

  const stopQueue = useCallback(() => {
    queue.stop();
    setIsRunning(false);
  }, [queue]);

  const clearCompleted = useCallback(() => {
    queue.clearCompleted();
    setJobs([...queue.getAllJobs()]);
  }, [queue]);

  const cancelJob = useCallback(
    (jobId) => {
      queue.cancelJob(jobId);
      setJobs([...queue.getAllJobs()]);
    },
    [queue]
  );

  return {
    jobs,
    isRunning,
    startQueue,
    stopQueue,
    clearCompleted,
    cancelJob,
  };
}

/**
 * Hook para generar assets visuales
 */
export function useAssetGenerator() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [assets, setAssets] = useState([]);
  const [error, setError] = useState(null);

  const queue = getJobQueue();

  const generateAssets = useCallback(
    async (config) => {
      setIsGenerating(true);
      setProgress(0);
      setError(null);
      setAssets([]);

      try {
        const jobId = queue.addJob({
          type: 'generate-assets',
          params: config,
        });

        const handleProgress = ({ id, progress: prog }) => {
          if (id === jobId) setProgress(prog);
        };

        const handleCompleted = (job) => {
          if (job.id === jobId) {
            setAssets(job.result.assets || []);
            setIsGenerating(false);
            cleanup();
          }
        };

        const handleFailed = (job) => {
          if (job.id === jobId) {
            setError(job.error);
            setIsGenerating(false);
            cleanup();
          }
        };

        const cleanup = () => {
          queue.off('job:progress', handleProgress);
          queue.off('job:completed', handleCompleted);
          queue.off('job:failed', handleFailed);
        };

        queue.on('job:progress', handleProgress);
        queue.on('job:completed', handleCompleted);
        queue.on('job:failed', handleFailed);
      } catch (err) {
        setError(err.message);
        setIsGenerating(false);
      }
    },
    [queue]
  );

  return { generateAssets, isGenerating, progress, assets, error };
}
