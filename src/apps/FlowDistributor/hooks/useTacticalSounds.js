/**
 * 🎵 TACTICAL SOUNDS HOOK
 * Sistema de sonidos tácticos para interfaz CHRONOS
 */
import { useCallback, useRef, useState } from 'react';

const soundLibrary = {
  // Sonidos de sistema
  systemOnline: '/sounds/system-online.mp3',
  systemShutdown: '/sounds/system-shutdown.mp3',
  panelSwitch: '/sounds/panel-switch.mp3',
  commandReceived: '/sounds/command-received.mp3',
  agentActivate: '/sounds/agent-activate.mp3',

  // Sonidos de UI
  hover: '/sounds/ui-hover.mp3',
  click: '/sounds/ui-click.mp3',
  notification: '/sounds/notification.mp3',
  error: '/sounds/error.mp3',
  success: '/sounds/success.mp3',

  // Sonidos tácticos
  scanning: '/sounds/tactical-scan.mp3',
  alert: '/sounds/tactical-alert.mp3',
  dataLoad: '/sounds/data-load.mp3',
  transmission: '/sounds/transmission.mp3',
};

export const useTacticalSounds = () => {
  const [isEnabled, setIsEnabled] = useState(true);
  const [volume, setVolume] = useState(0.3);
  const audioRefs = useRef({});

  // Inicializar sistema de sonidos
  const initializeSounds = useCallback(async () => {
    if (!isEnabled) return;

    try {
      // Pre-cargar sonidos esenciales
      const essentialSounds = ['systemOnline', 'panelSwitch', 'click', 'hover'];

      for (const soundKey of essentialSounds) {
        if (soundLibrary[soundKey]) {
          const audio = new Audio(soundLibrary[soundKey]);
          audio.volume = volume;
          audio.preload = 'auto';
          audioRefs.current[soundKey] = audio;
        }
      }
    } catch (error) {
      console.warn('🔊 No se pudieron cargar los sonidos tácticos:', error);
    }
  }, [isEnabled, volume]);

  // Reproducir sonido
  const playSound = useCallback(
    (soundKey, customVolume = null) => {
      if (!isEnabled) return;

      try {
        let audio = audioRefs.current[soundKey];

        if (!audio && soundLibrary[soundKey]) {
          audio = new Audio(soundLibrary[soundKey]);
          audio.volume = customVolume || volume;
          audioRefs.current[soundKey] = audio;
        }

        if (audio) {
          audio.currentTime = 0;
          audio.volume = customVolume || volume;
          audio.play().catch(() => {
            // Silently fail if audio can't play
          });
        }
      } catch (error) {
        console.warn(`🔊 Error reproduciendo sonido ${soundKey}:`, error);
      }
    },
    [isEnabled, volume]
  );

  // Sonidos específicos con configuración optimizada
  const playSystemSound = useCallback(
    (type = 'online') => {
      const soundMap = {
        online: 'systemOnline',
        shutdown: 'systemShutdown',
        scan: 'scanning',
        alert: 'alert',
      };
      playSound(soundMap[type] || 'systemOnline', 0.4);
    },
    [playSound]
  );

  const playUISound = useCallback(
    (type = 'click') => {
      const soundMap = {
        click: 'click',
        hover: 'hover',
        switch: 'panelSwitch',
        success: 'success',
        error: 'error',
      };
      playSound(soundMap[type] || 'click', 0.2);
    },
    [playSound]
  );

  const playTacticalSound = useCallback(
    (type = 'transmission') => {
      const soundMap = {
        transmission: 'transmission',
        dataLoad: 'dataLoad',
        commandReceived: 'commandReceived',
        agentActivate: 'agentActivate',
      };
      playSound(soundMap[type] || 'transmission', 0.3);
    },
    [playSound]
  );

  // Configuración
  const toggleSounds = useCallback(() => {
    setIsEnabled((prev) => !prev);
  }, []);

  const setVolumeLevel = useCallback((newVolume) => {
    const clampedVolume = Math.max(0, Math.min(1, newVolume));
    setVolume(clampedVolume);

    // Actualizar volumen de audios cargados
    Object.values(audioRefs.current).forEach((audio) => {
      if (audio) audio.volume = clampedVolume;
    });
  }, []);

  return {
    // Funciones principales
    initializeSounds,
    playSound,

    // Funciones específicas
    playSystemSound,
    playUISound,
    playTacticalSound,

    // Configuración
    isEnabled,
    toggleSounds,
    volume,
    setVolumeLevel,

    // Estado
    soundsLoaded: Object.keys(audioRefs.current).length > 0,
  };
};
