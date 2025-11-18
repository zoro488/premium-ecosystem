/**
 * ⌨️ TACTICAL KEYBOARDS HOOK
 * Sistema de atajos de teclado tácticos para CHRONOS
 */
import { useCallback, useEffect, useRef, useState } from 'react';

export const useTacticalKeyboards = () => {
  const [isEnabled, setIsEnabled] = useState(true);
  const [activeShortcuts, setActiveShortcuts] = useState(new Set());
  const [commandMode, setCommandMode] = useState(false);
  const [currentSequence, setCurrentSequence] = useState('');
  const keySequenceRef = useRef([]);
  const commandTimeoutRef = useRef();

  // Configuración de atajos de teclado
  const keyboardMappings = {
    // Navegación de paneles
    panels: {
      'Ctrl+1': { action: 'switchPanel', target: 'dashboard', description: 'Dashboard Principal' },
      'Ctrl+2': {
        action: 'switchPanel',
        target: 'distribuidores',
        description: 'Panel Distribuidores',
      },
      'Ctrl+3': { action: 'switchPanel', target: 'clientes', description: 'Panel Clientes' },
      'Ctrl+4': { action: 'switchPanel', target: 'analytics', description: 'Análisis y Reportes' },
      'Ctrl+5': { action: 'switchPanel', target: 'sicar', description: 'SICAR IA 1500' },
      Tab: { action: 'nextPanel', description: 'Siguiente Panel' },
      'Shift+Tab': { action: 'prevPanel', description: 'Panel Anterior' },
    },

    // Comandos tácticos
    tactical: {
      F1: { action: 'help', description: 'Mostrar Ayuda Táctica' },
      F2: { action: 'commandMode', description: 'Activar Modo Comando' },
      F3: { action: 'scanMode', description: 'Modo Escaneo' },
      F4: { action: 'tacticalView', description: 'Vista Táctica' },
      F11: { action: 'fullscreen', description: 'Pantalla Completa' },
      Escape: { action: 'cancel', description: 'Cancelar/Salir' },
    },

    // Acciones rápidas
    actions: {
      'Ctrl+S': { action: 'save', description: 'Guardar Datos' },
      'Ctrl+R': { action: 'refresh', description: 'Actualizar Panel' },
      'Ctrl+F': { action: 'search', description: 'Búsqueda Rápida' },
      'Ctrl+E': { action: 'export', description: 'Exportar Datos' },
      'Ctrl+N': { action: 'new', description: 'Nuevo Elemento' },
      Delete: { action: 'delete', description: 'Eliminar Seleccionado' },
    },

    // Secuencias de comando especiales
    sequences: {
      tc: { action: 'tacticalCommand', description: 'Comando Táctico' },
      ai: { action: 'activateAI', description: 'Activar IA SICAR' },
      scan: { action: 'initiateScan', description: 'Iniciar Escaneo' },
      help: { action: 'showHelp', description: 'Mostrar Ayuda' },
      reset: { action: 'systemReset', description: 'Reiniciar Sistema' },
    },
  };

  // Registrar atajo de teclado
  const registerShortcut = useCallback((keys, callback, description = '') => {
    const shortcutId = `${keys}_${Date.now()}`;

    setActiveShortcuts((prev) => {
      const newShortcuts = new Set(prev);
      newShortcuts.add({
        id: shortcutId,
        keys,
        callback,
        description,
      });
      return newShortcuts;
    });

    // Función de limpieza
    return () => {
      setActiveShortcuts((prev) => {
        const newShortcuts = new Set(prev);
        const shortcut = Array.from(newShortcuts).find((s) => s.id === shortcutId);
        if (shortcut) newShortcuts.delete(shortcut);
        return newShortcuts;
      });
    };
  }, []);

  // Ejecutar acción de teclado
  const executeKeyboardAction = useCallback((action, target = null, extra = {}) => {
    const event = new CustomEvent('tacticalKeyboard', {
      detail: { action, target, extra, timestamp: Date.now() },
    });

    window.dispatchEvent(event);

    // Log para debugging
    console.log(`⌨️ Acción táctica ejecutada: ${action}`, { target, extra });
  }, []);

  // Manejar teclas presionadas
  const handleKeyDown = useCallback(
    (event) => {
      if (!isEnabled) return;

      const key = event.key;
      const ctrl = event.ctrlKey;
      const shift = event.shiftKey;
      const alt = event.altKey;

      // Construir combinación de teclas
      let keyCombo = '';
      if (ctrl) keyCombo += 'Ctrl+';
      if (shift) keyCombo += 'Shift+';
      if (alt) keyCombo += 'Alt+';
      keyCombo += key;

      // Verificar atajos directos
      const allMappings = {
        ...keyboardMappings.panels,
        ...keyboardMappings.tactical,
        ...keyboardMappings.actions,
      };

      if (allMappings[keyCombo]) {
        event.preventDefault();
        const mapping = allMappings[keyCombo];
        executeKeyboardAction(mapping.action, mapping.target, mapping);
        return;
      }

      // Modo comando (secuencias)
      if (commandMode) {
        if (key === 'Escape') {
          setCommandMode(false);
          setCurrentSequence('');
          keySequenceRef.current = [];
          return;
        }

        if (key === 'Enter') {
          const sequence = currentSequence.toLowerCase();
          if (keyboardMappings.sequences[sequence]) {
            const mapping = keyboardMappings.sequences[sequence];
            executeKeyboardAction(mapping.action, null, mapping);
          }
          setCommandMode(false);
          setCurrentSequence('');
          keySequenceRef.current = [];
          return;
        }

        if (key === 'Backspace') {
          setCurrentSequence((prev) => prev.slice(0, -1));
          keySequenceRef.current = keySequenceRef.current.slice(0, -1);
          return;
        }

        if (key.length === 1) {
          setCurrentSequence((prev) => prev + key);
          keySequenceRef.current.push(key);
        }
        return;
      }

      // Activar modo comando con F2
      if (key === 'F2') {
        event.preventDefault();
        setCommandMode(true);
        setCurrentSequence('');
        keySequenceRef.current = [];
      }
    },
    [isEnabled, commandMode, currentSequence, executeKeyboardAction]
  );

  // Manejar atajos personalizados
  const handleCustomShortcuts = useCallback(
    (event) => {
      if (!isEnabled) return;

      activeShortcuts.forEach((shortcut) => {
        if (matchesShortcut(event, shortcut.keys)) {
          event.preventDefault();
          shortcut.callback(event);
        }
      });
    },
    [isEnabled, activeShortcuts]
  );

  // Verificar si el evento coincide con un atajo
  const matchesShortcut = useCallback((event, keys) => {
    const parts = keys.toLowerCase().split('+');
    const key = parts[parts.length - 1];
    const modifiers = parts.slice(0, -1);

    if (event.key.toLowerCase() !== key) return false;

    const hasCtrl = modifiers.includes('ctrl') ? event.ctrlKey : !event.ctrlKey;
    const hasShift = modifiers.includes('shift') ? event.shiftKey : !event.shiftKey;
    const hasAlt = modifiers.includes('alt') ? event.altKey : !event.altKey;

    return hasCtrl && hasShift && hasAlt;
  }, []);

  // Configurar listeners
  useEffect(() => {
    if (!isEnabled) return;

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keydown', handleCustomShortcuts);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keydown', handleCustomShortcuts);
    };
  }, [isEnabled, handleKeyDown, handleCustomShortcuts]);

  // Limpiar timeout de comando
  useEffect(() => {
    if (commandMode) {
      // Auto-cancelar modo comando después de 10 segundos
      commandTimeoutRef.current = setTimeout(() => {
        setCommandMode(false);
        setCurrentSequence('');
        keySequenceRef.current = [];
      }, 10000);
    } else {
      if (commandTimeoutRef.current) {
        clearTimeout(commandTimeoutRef.current);
      }
    }

    return () => {
      if (commandTimeoutRef.current) {
        clearTimeout(commandTimeoutRef.current);
      }
    };
  }, [commandMode]);

  // Funciones de utilidad
  const getAvailableShortcuts = useCallback(() => {
    const shortcuts = [];

    Object.entries(keyboardMappings).forEach(([category, mappings]) => {
      Object.entries(mappings).forEach(([keys, mapping]) => {
        shortcuts.push({
          category,
          keys,
          description: mapping.description,
          action: mapping.action,
        });
      });
    });

    return shortcuts;
  }, []);

  const toggleKeyboardShortcuts = useCallback(() => {
    setIsEnabled((prev) => !prev);
  }, []);

  const activateCommandMode = useCallback(() => {
    setCommandMode(true);
    setCurrentSequence('');
    keySequenceRef.current = [];
  }, []);

  const cancelCommandMode = useCallback(() => {
    setCommandMode(false);
    setCurrentSequence('');
    keySequenceRef.current = [];
  }, []);

  // Simulador de comando
  const simulateCommand = useCallback(
    (command) => {
      if (keyboardMappings.sequences[command.toLowerCase()]) {
        const mapping = keyboardMappings.sequences[command.toLowerCase()];
        executeKeyboardAction(mapping.action, null, mapping);
      }
    },
    [executeKeyboardAction]
  );

  return {
    // Estado
    isEnabled,
    commandMode,
    currentSequence,
    activeShortcuts: Array.from(activeShortcuts),

    // Funciones principales
    registerShortcut,
    executeKeyboardAction,

    // Modo comando
    activateCommandMode,
    cancelCommandMode,
    simulateCommand,

    // Utilidades
    getAvailableShortcuts,
    toggleKeyboardShortcuts,

    // Configuración
    keyboardMappings,
  };
};
