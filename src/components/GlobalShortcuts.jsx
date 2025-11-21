import { useEffect } from 'react';

/**
 * Hook para shortcuts globales del sistema
 *
 * @param {Object} handlers - Objeto con funciones para cada shortcut
 * @example
 * useGlobalShortcuts({
 *   onSave: () => console.log('Guardando...'),
 *   onCancel: () => console.log('Cancelando...'),
 *   onNewRecord: () => console.log('Nuevo registro...')
 * })
 */
export const useGlobalShortcuts = (handlers) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ctrl + S: Guardar
      if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        handlers.onSave?.();
      }

      // Ctrl + N: Nuevo registro
      if (e.ctrlKey && e.key === 'n') {
        e.preventDefault();
        handlers.onNewRecord?.();
      }

      // Ctrl + D: Dashboard
      if (e.ctrlKey && e.key === 'd') {
        e.preventDefault();
        handlers.onDashboard?.();
      }

      // Ctrl + V: Panel Ventas
      if (e.ctrlKey && e.key === 'v') {
        e.preventDefault();
        handlers.onVentas?.();
      }

      // Ctrl + A: Panel Abonos
      if (e.ctrlKey && e.key === 'a') {
        e.preventDefault();
        handlers.onAbonos?.();
      }

      // Ctrl + C: Panel Clientes
      if (e.ctrlKey && e.key === 'c') {
        e.preventDefault();
        handlers.onClientes?.();
      }

      // Ctrl + F: Buscar
      if (e.ctrlKey && e.key === 'f') {
        e.preventDefault();
        handlers.onSearch?.();
      }

      // Escape: Cancelar
      if (e.key === 'Escape') {
        handlers.onCancel?.();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlers]);
};

/**
 * Componente visual para mostrar shortcuts disponibles
 */
export const ShortcutsHelper = ({ show, onClose }) => {
  if (!show) return null;

  const shortcuts = [
    { keys: 'Ctrl + S', description: 'Guardar formulario actual', icon: '💾' },
    { keys: 'Ctrl + N', description: 'Nuevo registro', icon: '➕' },
    { keys: 'Ctrl + D', description: 'Abrir Dashboard', icon: '📊' },
    { keys: 'Ctrl + V', description: 'Panel de Ventas', icon: '🛒' },
    { keys: 'Ctrl + A', description: 'Panel de Abonos', icon: '💰' },
    { keys: 'Ctrl + C', description: 'Panel de Clientes', icon: '👥' },
    { keys: 'Ctrl + F', description: 'Buscar', icon: '🔍' },
    { keys: 'Esc', description: 'Cancelar/Cerrar', icon: '❌' },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full mx-4 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-zinc-800 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">⌨️</span>
            <h2 className="text-xl font-bold text-white">Atajos de Teclado</h2>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 rounded-lg p-2 transition"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          <div className="grid gap-3">
            {shortcuts.map((shortcut, index) => (
              <div
                key={index}
                className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition"
              >
                <span className="text-2xl">{shortcut.icon}</span>
                <div className="flex-1">
                  <p className="font-medium text-gray-800">{shortcut.description}</p>
                </div>
                <kbd className="px-3 py-1.5 text-sm font-semibold bg-gray-800 text-white rounded-lg shadow">
                  {shortcut.keys}
                </kbd>
              </div>
            ))}
          </div>

          {/* Tip */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex gap-3">
              <span className="text-xl">💡</span>
              <div>
                <h3 className="font-semibold text-blue-900 mb-1">Tip</h3>
                <p className="text-sm text-blue-700">
                  Presiona <kbd className="px-2 py-1 bg-blue-200 rounded">?</kbd> en cualquier
                  momento para ver esta ayuda de atajos.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default useGlobalShortcuts;
