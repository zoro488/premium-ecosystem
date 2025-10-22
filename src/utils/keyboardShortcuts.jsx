/**
 * ⌨️ SISTEMA DE ATAJOS DE TECLADO GLOBAL
 * Keyboard shortcuts para navegación rápida
 */
import { useCallback, useEffect } from 'react';

/**
 * Atajos de teclado disponibles
 */
export const KEYBOARD_SHORTCUTS = {
  // Búsqueda
  SEARCH: { keys: ['ctrl+k', 'cmd+k'], description: 'Abrir búsqueda' },

  // Navegación
  DASHBOARD: { keys: ['ctrl+1'], description: 'Ir a Dashboard' },
  ORDERS: { keys: ['ctrl+2'], description: 'Ir a Órdenes' },
  DISTRIBUTORS: { keys: ['ctrl+3'], description: 'Ir a Distribuidores' },
  WAREHOUSE: { keys: ['ctrl+4'], description: 'Ir a Almacén' },
  SALES: { keys: ['ctrl+5'], description: 'Ir a Ventas' },
  CLIENTS: { keys: ['ctrl+6'], description: 'Ir a Clientes' },
  BANKS: { keys: ['ctrl+7'], description: 'Ir a Bancos' },
  REPORTS: { keys: ['ctrl+8'], description: 'Ir a Reportes' },

  // Acciones
  NEW: { keys: ['ctrl+n'], description: 'Nuevo registro' },
  SAVE: { keys: ['ctrl+s'], description: 'Guardar' },
  CANCEL: { keys: ['escape'], description: 'Cancelar/Cerrar' },

  // UI
  TOGGLE_SIDEBAR: { keys: ['ctrl+b'], description: 'Toggle sidebar' },
  TOGGLE_AI: { keys: ['ctrl+.'], description: 'Toggle AI Assistant' },
  NOTIFICATIONS: { keys: ['ctrl+shift+n'], description: 'Abrir notificaciones' },

  // Utilidades
  HELP: { keys: ['?', 'shift+/'], description: 'Mostrar ayuda' },
  REFRESH: { keys: ['ctrl+r'], description: 'Recargar datos' },
};

/**
 * Hook para gestionar atajos de teclado
 */
export const useKeyboardShortcuts = (shortcuts) => {
  const handleKeyDown = useCallback(
    (event) => {
      const key = event.key.toLowerCase();
      const ctrl = event.ctrlKey || event.metaKey;
      const shift = event.shiftKey;
      const alt = event.altKey;

      // Construir combinación de teclas
      let combo = '';
      if (ctrl) combo += 'ctrl+';
      if (shift) combo += 'shift+';
      if (alt) combo += 'alt+';
      combo += key;

      // Buscar shortcut coincidente
      Object.entries(shortcuts).forEach(([action, handler]) => {
        const shortcutDef = KEYBOARD_SHORTCUTS[action];
        if (shortcutDef && shortcutDef.keys.includes(combo)) {
          // Prevenir comportamiento por defecto para shortcuts específicos
          if (action !== 'REFRESH') {
            event.preventDefault();
          }
          handler();
        }
      });
    },
    [shortcuts]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
};

/**
 * Componente de ayuda de shortcuts
 */
export const KeyboardShortcutsHelp = ({ isOpen, onClose }) => {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      window.addEventListener('keydown', handleEscape);
    }

    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const categories = {
    'Búsqueda y Navegación': [
      'SEARCH',
      'DASHBOARD',
      'ORDERS',
      'DISTRIBUTORS',
      'WAREHOUSE',
      'SALES',
      'CLIENTS',
      'BANKS',
      'REPORTS',
    ],
    Acciones: ['NEW', 'SAVE', 'CANCEL'],
    Interfaz: ['TOGGLE_SIDEBAR', 'TOGGLE_AI', 'NOTIFICATIONS'],
    Utilidades: ['HELP', 'REFRESH'],
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-slate-900 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto border border-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-slate-900 border-b border-white/10 p-6">
          <h2 className="text-2xl font-bold text-white mb-2">⌨️ Atajos de Teclado</h2>
          <p className="text-slate-400 text-sm">Mejora tu productividad con estos shortcuts</p>
        </div>

        <div className="p-6 space-y-6">
          {Object.entries(categories).map(([category, shortcuts]) => (
            <div key={category}>
              <h3 className="text-lg font-semibold text-white mb-3">{category}</h3>
              <div className="space-y-2">
                {shortcuts.map((shortcut) => {
                  const def = KEYBOARD_SHORTCUTS[shortcut];
                  return (
                    <div
                      key={shortcut}
                      className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                    >
                      <span className="text-slate-300">{def.description}</span>
                      <div className="flex gap-2">
                        {def.keys.map((key, _idx) => (
                          <kbd
                            key={_idx}
                            className="px-3 py-1 bg-slate-800 border border-slate-700 rounded-md text-sm font-mono text-blue-400"
                          >
                            {key
                              .split('+')
                              .map((k) => k.charAt(0).toUpperCase() + k.slice(1))
                              .join(' + ')}
                          </kbd>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="sticky bottom-0 bg-slate-900 border-t border-white/10 p-6">
          <button
            onClick={onClose}
            className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl font-medium hover:shadow-lg hover:shadow-blue-500/25 transition-all"
          >
            Cerrar (Esc)
          </button>
        </div>
      </div>
    </div>
  );
};

export default { useKeyboardShortcuts, KeyboardShortcutsHelp, KEYBOARD_SHORTCUTS };
