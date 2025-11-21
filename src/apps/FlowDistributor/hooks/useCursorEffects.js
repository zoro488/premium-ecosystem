/**
 * 🎯 CURSOR EFFECTS HOOK
 * Sistema de efectos de cursor táctico para CHRONOS
 */
import { useCallback, useEffect, useRef, useState } from 'react';

export const useCursorEffects = () => {
  const [isActive, setIsActive] = useState(true);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [cursorVariant, setCursorVariant] = useState('default');
  const [trails, setTrails] = useState([]);
  const animationFrameRef = useRef();
  const trailHistoryRef = useRef([]);

  // Variantes de cursor disponibles
  const cursorVariants = {
    default: {
      size: 20,
      color: 'rgba(255, 102, 0, 0.8)',
      glow: '0 0 20px rgba(255, 102, 0, 0.5)',
      border: '2px solid rgba(255, 102, 0, 0.9)',
    },
    tactical: {
      size: 30,
      color: 'rgba(255, 0, 0, 0.9)',
      glow: '0 0 30px rgba(255, 0, 0, 0.7)',
      border: '2px solid rgba(255, 0, 0, 1)',
      innerGlow: '0 0 10px rgba(255, 255, 255, 0.8)',
    },
    scanning: {
      size: 40,
      color: 'rgba(0, 255, 100, 0.8)',
      glow: '0 0 40px rgba(0, 255, 100, 0.6)',
      border: '2px dashed rgba(0, 255, 100, 1)',
      pulse: true,
    },
    interactive: {
      size: 25,
      color: 'rgba(255, 215, 0, 0.9)',
      glow: '0 0 25px rgba(255, 215, 0, 0.6)',
      border: '2px solid rgba(255, 215, 0, 1)',
      scale: 1.2,
    },
    danger: {
      size: 35,
      color: 'rgba(255, 0, 0, 1)',
      glow: '0 0 35px rgba(255, 0, 0, 0.8)',
      border: '3px solid rgba(255, 0, 0, 1)',
      shake: true,
    },
  };

  // Actualizar posición del cursor
  const updateCursorPosition = useCallback((e) => {
    setCursorPosition({ x: e.clientX, y: e.clientY });

    // Agregar a historial de trail
    const newTrail = {
      x: e.clientX,
      y: e.clientY,
      timestamp: Date.now(),
      id: Math.random(),
    };

    trailHistoryRef.current = [
      newTrail,
      ...trailHistoryRef.current.slice(0, 9), // Mantener 10 puntos máximo
    ];
  }, []);

  // Actualizar trails con animación
  const updateTrails = useCallback(() => {
    const now = Date.now();
    const validTrails = trailHistoryRef.current
      .filter((trail) => now - trail.timestamp < 500) // Duración del trail: 500ms
      .map((trail, index) => ({
        ...trail,
        opacity: Math.max(0, 1 - (now - trail.timestamp) / 500),
        scale: Math.max(0.1, 1 - index * 0.1),
        delay: index * 20,
      }));

    setTrails(validTrails);

    if (isActive) {
      animationFrameRef.current = requestAnimationFrame(updateTrails);
    }
  }, [isActive]);

  // Cambiar variante de cursor
  const setCursorEffect = useCallback((variant) => {
    if (cursorVariants[variant]) {
      setCursorVariant(variant);
    }
  }, []);

  // Eventos de hover para elementos interactivos
  const addHoverEffect = useCallback(
    (element, variant = 'interactive') => {
      if (!element) return;

      const handleMouseEnter = () => {
        setIsHovering(true);
        setCursorEffect(variant);
      };

      const handleMouseLeave = () => {
        setIsHovering(false);
        setCursorEffect('default');
      };

      element.addEventListener('mouseenter', handleMouseEnter);
      element.addEventListener('mouseleave', handleMouseLeave);

      // Función de limpieza
      return () => {
        element.removeEventListener('mouseenter', handleMouseEnter);
        element.removeEventListener('mouseleave', handleMouseLeave);
      };
    },
    [setCursorEffect]
  );

  // Efectos especiales
  const triggerCursorPulse = useCallback(() => {
    setCursorEffect('scanning');
    setTimeout(() => setCursorEffect('default'), 1000);
  }, [setCursorEffect]);

  const triggerCursorAlert = useCallback(() => {
    setCursorEffect('danger');
    setTimeout(() => setCursorEffect('default'), 800);
  }, [setCursorEffect]);

  const triggerTacticalMode = useCallback(
    (duration = 3000) => {
      setCursorEffect('tactical');
      setTimeout(() => setCursorEffect('default'), duration);
    },
    [setCursorEffect]
  );

  // Configurar eventos del mouse
  useEffect(() => {
    if (!isActive) return;

    document.addEventListener('mousemove', updateCursorPosition);
    document.body.style.cursor = 'none'; // Ocultar cursor nativo

    // Iniciar animación de trails
    updateTrails();

    return () => {
      document.removeEventListener('mousemove', updateCursorPosition);
      document.body.style.cursor = 'auto'; // Restaurar cursor nativo
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isActive, updateCursorPosition, updateTrails]);

  // Limpiar al desmontar
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  // Obtener estilos del cursor actual
  const getCurrentCursorStyles = useCallback(() => {
    const variant = cursorVariants[cursorVariant] || cursorVariants.default;

    return {
      position: 'fixed',
      left: cursorPosition.x - variant.size / 2,
      top: cursorPosition.y - variant.size / 2,
      width: variant.size,
      height: variant.size,
      background: variant.color,
      border: variant.border,
      borderRadius: '50%',
      boxShadow: variant.glow + (variant.innerGlow ? `, ${variant.innerGlow}` : ''),
      pointerEvents: 'none',
      zIndex: 9999,
      transform: `scale(${variant.scale || 1}) ${variant.shake ? 'translateX(2px)' : ''}`,
      transition: 'all 0.1s ease-out',
      animation: variant.pulse ? 'pulse 1s infinite' : 'none',
    };
  }, [cursorPosition, cursorVariant]);

  // Obtener estilos para trails
  const getTrailStyles = useCallback(
    (trail) => {
      const variant = cursorVariants[cursorVariant] || cursorVariants.default;

      return {
        position: 'fixed',
        left: trail.x - (variant.size * trail.scale) / 2,
        top: trail.y - (variant.size * trail.scale) / 2,
        width: variant.size * trail.scale,
        height: variant.size * trail.scale,
        background: variant.color,
        borderRadius: '50%',
        opacity: trail.opacity * 0.6,
        pointerEvents: 'none',
        zIndex: 9998,
        transition: `all ${trail.delay}ms ease-out`,
      };
    },
    [cursorVariant]
  );

  return {
    // Estado
    isActive,
    cursorPosition,
    isHovering,
    cursorVariant,
    trails,

    // Funciones principales
    setCursorEffect,
    addHoverEffect,

    // Efectos especiales
    triggerCursorPulse,
    triggerCursorAlert,
    triggerTacticalMode,

    // Estilos
    getCurrentCursorStyles,
    getTrailStyles,

    // Configuración
    setIsActive,

    // Variantes disponibles
    availableVariants: Object.keys(cursorVariants),
  };
};
