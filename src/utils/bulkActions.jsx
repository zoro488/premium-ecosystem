import { useCallback, useState } from 'react';

// 🎯 BULK ACTIONS SYSTEM - Sistema de Acciones en Masa

/**
 * Custom hook para gestionar selección múltiple y acciones en masa
 * @param {Array} items - Array de items a gestionar
 * @param {String} idField - Campo que identifica únicamente cada item (default: 'id')
 */
export const useBulkSelection = (items = [], idField = 'id') => {
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [isSelectAllMode, setIsSelectAllMode] = useState(false);

  // Alternar selección de un item individual
  const toggleItem = useCallback((itemId) => {
    setSelectedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  }, []);

  // Seleccionar/Deseleccionar todos
  const toggleSelectAll = useCallback(() => {
    if (isSelectAllMode) {
      setSelectedItems(new Set());
      setIsSelectAllMode(false);
    } else {
      const allIds = new Set(items.map((item) => item[idField]));
      setSelectedItems(allIds);
      setIsSelectAllMode(true);
    }
  }, [items, idField, isSelectAllMode]);

  // Seleccionar múltiples items (por array de IDs)
  const selectMultiple = useCallback((itemIds) => {
    setSelectedItems(new Set(itemIds));
  }, []);

  // Deseleccionar todos
  const clearSelection = useCallback(() => {
    setSelectedItems(new Set());
    setIsSelectAllMode(false);
  }, []);

  // Verificar si un item está seleccionado
  const isSelected = useCallback(
    (itemId) => {
      return selectedItems.has(itemId);
    },
    [selectedItems]
  );

  // Obtener items seleccionados completos
  const getSelectedItems = useCallback(() => {
    return items.filter((item) => selectedItems.has(item[idField]));
  }, [items, selectedItems, idField]);

  // Seleccionar rango (shift+click)
  const selectRange = useCallback(
    (fromId, toId) => {
      const fromIndex = items.findIndex((item) => item[idField] === fromId);
      const toIndex = items.findIndex((item) => item[idField] === toId);

      if (fromIndex === -1 || toIndex === -1) return;

      const start = Math.min(fromIndex, toIndex);
      const end = Math.max(fromIndex, toIndex);

      const rangeIds = items.slice(start, end + 1).map((item) => item[idField]);
      setSelectedItems((prev) => {
        const newSet = new Set(prev);
        rangeIds.forEach((id) => newSet.add(id));
        return newSet;
      });
    },
    [items, idField]
  );

  // Invertir selección
  const invertSelection = useCallback(() => {
    const allIds = new Set(items.map((item) => item[idField]));
    const newSelection = new Set();

    allIds.forEach((id) => {
      if (!selectedItems.has(id)) {
        newSelection.add(id);
      }
    });

    setSelectedItems(newSelection);
    setIsSelectAllMode(newSelection.size === items.length);
  }, [items, selectedItems, idField]);

  return {
    selectedItems: Array.from(selectedItems),
    selectedCount: selectedItems.size,
    isSelected,
    toggleItem,
    toggleSelectAll,
    selectMultiple,
    clearSelection,
    getSelectedItems,
    selectRange,
    invertSelection,
    isSelectAllMode,
    hasSelection: selectedItems.size > 0,
  };
};

/**
 * Hook para acciones en masa sobre items seleccionados
 * @param {Function} onSuccess - Callback al completar la acción
 * @param {Function} onError - Callback en caso de error
 */
export const useBulkActions = (onSuccess, onError) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });

  // Ejecutar acción en masa
  const executeBulkAction = useCallback(
    async (items, action, options = {}) => {
      setIsProcessing(true);
      setProgress({ current: 0, total: items.length });

      try {
        const results = [];

        for (let i = 0; i < items.length; i++) {
          const item = items[i];

          try {
            const result = await action(item, i);
            results.push({ success: true, item, result });
          } catch (error) {
            results.push({ success: false, item, error });

            if (options.stopOnError) {
              throw new Error(`Error en item ${i + 1}: ${error.message}`);
            }
          }

          setProgress({ current: i + 1, total: items.length });

          // Delay opcional entre operaciones
          if (options.delay && i < items.length - 1) {
            await new Promise((resolve) => setTimeout(resolve, options.delay));
          }
        }

        const successCount = results.filter((r) => r.success).length;
        const errorCount = results.filter((r) => !r.success).length;

        setIsProcessing(false);

        if (onSuccess) {
          onSuccess({ results, successCount, errorCount });
        }

        return { results, successCount, errorCount };
      } catch (error) {
        setIsProcessing(false);

        if (onError) {
          onError(error);
        }

        throw error;
      }
    },
    [onSuccess, onError]
  );

  // Eliminar múltiples items
  const bulkDelete = useCallback(
    async (items, deleteFunction) => {
      return executeBulkAction(items, deleteFunction, { stopOnError: false });
    },
    [executeBulkAction]
  );

  // Actualizar múltiples items
  const bulkUpdate = useCallback(
    async (items, updateFunction, updates) => {
      return executeBulkAction(items, (item) => updateFunction(item, updates), {
        stopOnError: false,
      });
    },
    [executeBulkAction]
  );

  // Exportar múltiples items
  const bulkExport = useCallback(
    async (items, exportFunction) => {
      return executeBulkAction(items, exportFunction, { stopOnError: true });
    },
    [executeBulkAction]
  );

  return {
    isProcessing,
    progress,
    executeBulkAction,
    bulkDelete,
    bulkUpdate,
    bulkExport,
  };
};

/**
 * Componente: Checkbox para selección individual
 */
export const SelectionCheckbox = ({ checked, onChange, disabled = false, label = '' }) => {
  return (
    <label className="flex items-center gap-2 cursor-pointer group">
      <div className="relative">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className="sr-only"
        />
        <div
          className={`
          w-5 h-5 rounded border-2 transition-all duration-200
          ${
            checked
              ? 'bg-purple-500 border-purple-500'
              : 'border-slate-400 group-hover:border-purple-400'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
        >
          {checked && (
            <svg
              className="w-full h-full text-white"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="3"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M5 13l4 4L19 7" />
            </svg>
          )}
        </div>
      </div>
      {label && (
        <span className="text-sm text-slate-300 group-hover:text-white transition-colors">
          {label}
        </span>
      )}
    </label>
  );
};

/**
 * Componente: Barra de acciones en masa
 */
export const BulkActionsBar = ({
  selectedCount,
  totalCount,
  onDelete,
  onEdit,
  onExport,
  onClearSelection,
  isProcessing = false,
  customActions = [],
}) => {
  if (selectedCount === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 animate-slide-up">
      <div className="glass rounded-2xl px-6 py-4 border border-purple-500/30 shadow-2xl shadow-purple-500/20 backdrop-blur-xl">
        <div className="flex items-center gap-6">
          {/* Counter */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center font-bold text-sm">
              {selectedCount}
            </div>
            <span className="text-sm font-semibold">
              {selectedCount === totalCount ? 'Todos' : selectedCount} seleccionado
              {selectedCount !== 1 ? 's' : ''}
            </span>
          </div>

          <div className="h-6 w-px bg-white/20" />

          {/* Actions */}
          <div className="flex items-center gap-2">
            {onEdit && (
              <button
                onClick={onEdit}
                disabled={isProcessing}
                className="px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
                Editar
              </button>
            )}

            {onExport && (
              <button
                onClick={onExport}
                disabled={isProcessing}
                className="px-4 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
                Exportar
              </button>
            )}

            {customActions.map((action, _idx) => (
              <button
                key={_idx}
                onClick={action.onClick}
                disabled={isProcessing}
                className={`px-4 py-2 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 ${action.className || 'bg-slate-500/20 hover:bg-slate-500/30 text-slate-300'}`}
              >
                {action.icon}
                {action.label}
              </button>
            ))}

            {onDelete && (
              <button
                onClick={onDelete}
                disabled={isProcessing}
                className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
                Eliminar
              </button>
            )}

            <div className="h-6 w-px bg-white/20" />

            <button
              onClick={onClearSelection}
              disabled={isProcessing}
              className="px-3 py-2 hover:bg-white/5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Cancelar selección"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {isProcessing && (
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-purple-500 border-t-transparent" />
              <span className="text-sm text-slate-400">Procesando...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/**
 * Componente: Modal de confirmación para acciones en masa
 */
export const BulkConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = '¿Confirmar acción?',
  message,
  confirmText = 'Confirmar',
  confirmColor = 'red',
  itemCount,
  isDangerous = false,
}) => {
  if (!isOpen) return null;

  const colorClasses = {
    red: 'from-red-500 to-pink-500',
    blue: 'from-blue-500 to-cyan-500',
    green: 'from-green-500 to-emerald-500',
    purple: 'from-purple-500 to-pink-500',
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
      <div className="glass rounded-2xl p-8 max-w-md w-full border border-white/10 animate-scale-in">
        <div className="text-center">
          <div
            className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${colorClasses[confirmColor]} flex items-center justify-center`}
          >
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isDangerous ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              )}
            </svg>
          </div>

          <h3 className="text-2xl font-bold mb-3">{title}</h3>

          <p className="text-slate-300 mb-2">{message}</p>

          {itemCount && (
            <p className="text-sm text-slate-400 mb-6">
              Se procesarán <span className="font-bold text-purple-400">{itemCount}</span> elemento
              {itemCount !== 1 ? 's' : ''}
            </p>
          )}

          <div className="flex gap-3 mt-6">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-white/10 rounded-xl hover:bg-white/5 transition-colors font-semibold"
            >
              Cancelar
            </button>
            <button
              onClick={onConfirm}
              className={`flex-1 px-4 py-3 bg-gradient-to-r ${colorClasses[confirmColor]} rounded-xl font-semibold hover:shadow-lg transition-all`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default {
  useBulkSelection,
  useBulkActions,
  SelectionCheckbox,
  BulkActionsBar,
  BulkConfirmModal,
};
