/**
 * 🎬 CINEMATIC TRANSITIONS HOOK
 * Sistema de transiciones cinematográficas para CHRONOS
 */
import { useCallback, useRef, useState } from 'react';

export const useCinematicTransitions = () => {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionType, setTransitionType] = useState('fade');
  const [transitionProgress, setTransitionProgress] = useState(0);
  const transitionTimeoutRef = useRef();

  // Tipos de transición disponibles
  const transitionTypes = {
    fade: {
      duration: 800,
      easing: 'ease-out',
      overlay: 'linear-gradient(45deg, rgba(0,0,0,0.9), rgba(0,0,0,0.7))',
    },
    tactical: {
      duration: 1200,
      easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      overlay: 'linear-gradient(45deg, rgba(255,102,0,0.1), rgba(255,0,0,0.05))',
      scanlines: true,
    },
    matrix: {
      duration: 1000,
      easing: 'ease-in-out',
      overlay: 'radial-gradient(circle, rgba(0,255,0,0.1), rgba(0,100,0,0.05))',
      digitalEffect: true,
    },
    warp: {
      duration: 1500,
      easing: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      overlay: 'conic-gradient(from 180deg, rgba(0,100,255,0.1), rgba(100,0,255,0.05))',
      warpEffect: true,
    },
    holographic: {
      duration: 900,
      easing: 'ease-out',
      overlay: 'linear-gradient(90deg, rgba(0,255,255,0.1), rgba(255,0,255,0.05))',
      hologramEffect: true,
    },
  };

  // Ejecutar transición
  const executeTransition = useCallback(
    async (fromPanel, toPanel, type = 'tactical', options = {}) => {
      if (isTransitioning) return false;

      const transitionConfig = transitionTypes[type] || transitionTypes.tactical;
      const duration = options.duration || transitionConfig.duration;

      setIsTransitioning(true);
      setTransitionType(type);
      setTransitionProgress(0);

      try {
        // Fase 1: Preparación (0-20%)
        await animateProgress(0, 20, duration * 0.2);

        // Fase 2: Salida del panel actual (20-50%)
        if (fromPanel && typeof fromPanel.exit === 'function') {
          await fromPanel.exit();
        }
        await animateProgress(20, 50, duration * 0.3);

        // Fase 3: Transición central (50-70%)
        await animateProgress(50, 70, duration * 0.2);

        // Fase 4: Entrada del nuevo panel (70-100%)
        if (toPanel && typeof toPanel.enter === 'function') {
          await toPanel.enter();
        }
        await animateProgress(70, 100, duration * 0.3);

        // Finalizar
        setTimeout(() => {
          setIsTransitioning(false);
          setTransitionProgress(0);
        }, 100);

        return true;
      } catch (error) {
        console.error('🎬 Error en transición cinematográfica:', error);
        setIsTransitioning(false);
        setTransitionProgress(0);
        return false;
      }
    },
    [isTransitioning]
  );

  // Animar progreso de transición
  const animateProgress = useCallback((from, to, duration) => {
    return new Promise((resolve) => {
      const startTime = Date.now();
      const progressDiff = to - from;

      const updateProgress = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Aplicar easing
        const easedProgress = easeOutCubic(progress);
        const currentProgress = from + progressDiff * easedProgress;

        setTransitionProgress(currentProgress);

        if (progress < 1) {
          requestAnimationFrame(updateProgress);
        } else {
          resolve();
        }
      };

      requestAnimationFrame(updateProgress);
    });
  }, []);

  // Función de easing
  const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

  // Transiciones rápidas específicas
  const fadeTransition = useCallback(
    async (fromPanel, toPanel, duration = 600) => {
      return executeTransition(fromPanel, toPanel, 'fade', { duration });
    },
    [executeTransition]
  );

  const tacticalTransition = useCallback(
    async (fromPanel, toPanel, duration = 1200) => {
      return executeTransition(fromPanel, toPanel, 'tactical', { duration });
    },
    [executeTransition]
  );

  const warpTransition = useCallback(
    async (fromPanel, toPanel, duration = 1500) => {
      return executeTransition(fromPanel, toPanel, 'warp', { duration });
    },
    [executeTransition]
  );

  const holographicTransition = useCallback(
    async (fromPanel, toPanel, duration = 900) => {
      return executeTransition(fromPanel, toPanel, 'holographic', { duration });
    },
    [executeTransition]
  );

  // Transición de entrada para sistema
  const systemEntryTransition = useCallback(
    async (duration = 2000) => {
      setIsTransitioning(true);
      setTransitionType('tactical');

      // Simular arranque del sistema
      await animateProgress(0, 30, duration * 0.3); // Inicialización
      await animateProgress(30, 60, duration * 0.3); // Carga de componentes
      await animateProgress(60, 90, duration * 0.3); // Sincronización
      await animateProgress(90, 100, duration * 0.1); // Finalización

      setTimeout(() => {
        setIsTransitioning(false);
        setTransitionProgress(0);
      }, 200);
    },
    [animateProgress]
  );

  // Obtener estilos de overlay de transición
  const getTransitionOverlayStyles = useCallback(() => {
    if (!isTransitioning) return { display: 'none' };

    const config = transitionTypes[transitionType] || transitionTypes.tactical;
    const opacity = transitionProgress / 100;

    const overlayStyles = {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: config.overlay,
      opacity: Math.sin(opacity * Math.PI) * 0.8, // Fade in/out suave
      zIndex: 9997,
      pointerEvents: 'none',
      transition: `all ${config.duration}ms ${config.easing}`,
    };

    // Efectos especiales según el tipo
    if (config.scanlines) {
      overlayStyles.backgroundImage = `
        ${config.overlay},
        repeating-linear-gradient(
          0deg,
          transparent,
          transparent 2px,
          rgba(255,102,0,0.1) 2px,
          rgba(255,102,0,0.1) 4px
        )
      `;
    }

    if (config.digitalEffect) {
      overlayStyles.filter = `
        contrast(1.2)
        saturate(1.1)
        hue-rotate(${transitionProgress * 3.6}deg)
      `;
    }

    if (config.warpEffect) {
      overlayStyles.transform = `
        perspective(1000px)
        rotateX(${transitionProgress * 0.5}deg)
        scale(${1 + transitionProgress * 0.01})
      `;
    }

    if (config.hologramEffect) {
      overlayStyles.backgroundImage = `
        ${config.overlay},
        linear-gradient(
          90deg,
          transparent 0%,
          rgba(255,255,255,0.1) 50%,
          transparent 100%
        )
      `;
      overlayStyles.backgroundSize = '200% 100%';
      overlayStyles.animation = 'holographic-sweep 2s linear infinite';
    }

    return overlayStyles;
  }, [isTransitioning, transitionType, transitionProgress]);

  // Obtener información de progreso
  const getProgressInfo = useCallback(() => {
    if (!isTransitioning) return null;

    const phases = [
      { min: 0, max: 20, label: 'Inicializando transición...', icon: '⚡' },
      { min: 20, max: 50, label: 'Desactivando panel actual...', icon: '🔄' },
      { min: 50, max: 70, label: 'Procesando transición...', icon: '🎬' },
      { min: 70, max: 100, label: 'Activando nuevo panel...', icon: '✨' },
    ];

    const currentPhase =
      phases.find((phase) => transitionProgress >= phase.min && transitionProgress <= phase.max) ||
      phases[phases.length - 1];

    return {
      progress: transitionProgress,
      phase: currentPhase,
      type: transitionType,
      config: transitionTypes[transitionType],
    };
  }, [isTransitioning, transitionProgress, transitionType]);

  // Limpiar timeouts al desmontar
  const cleanup = useCallback(() => {
    if (transitionTimeoutRef.current) {
      clearTimeout(transitionTimeoutRef.current);
    }
  }, []);

  return {
    // Estado
    isTransitioning,
    transitionProgress,
    transitionType,

    // Funciones principales
    executeTransition,
    systemEntryTransition,

    // Transiciones específicas
    fadeTransition,
    tacticalTransition,
    warpTransition,
    holographicTransition,

    // Utilidades
    getTransitionOverlayStyles,
    getProgressInfo,
    cleanup,

    // Configuración
    availableTypes: Object.keys(transitionTypes),
  };
};
