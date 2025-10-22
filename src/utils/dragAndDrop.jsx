import { useCallback, useEffect, useRef, useState } from 'react';

// 🎨 DRAG & DROP SYSTEM - Sistema de Arrastrar y Soltar

/**
 * Custom hook para drag & drop con reordenamiento
 * @param {Array} items - Array de items a reordenar
 * @param {Function} onReorder - Callback cuando se reordena (recibe nuevo array)
 */
export const useDragAndDrop = (items = [], onReorder) => {
  const [draggedItem, setDraggedItem] = useState(null);
  const [dragOverItem, setDragOverItem] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragCounter = useRef(0);

  // Iniciar arrastre
  const handleDragStart = useCallback((e, item, index) => {
    setDraggedItem({ item, index });
    setIsDragging(true);

    // Configurar datos de arrastre
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', e.target);

    // Añadir clase visual al elemento arrastrado
    setTimeout(() => {
      e.target.style.opacity = '0.4';
    }, 0);
  }, []);

  // Finalizar arrastre
  const handleDragEnd = useCallback((e) => {
    e.target.style.opacity = '1';
    setDraggedItem(null);
    setDragOverItem(null);
    setIsDragging(false);
    dragCounter.current = 0;
  }, []);

  // Entrar en zona de drop
  const handleDragEnter = useCallback((e, item, index) => {
    e.preventDefault();
    dragCounter.current++;
    setDragOverItem({ item, index });
  }, []);

  // Salir de zona de drop
  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    dragCounter.current--;

    if (dragCounter.current === 0) {
      setDragOverItem(null);
    }
  }, []);

  // Sobre zona de drop
  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }, []);

  // Soltar elemento
  const handleDrop = useCallback(
    (e, targetItem, targetIndex) => {
      e.preventDefault();
      e.stopPropagation();

      if (!draggedItem || draggedItem.index === targetIndex) {
        setDraggedItem(null);
        setDragOverItem(null);
        setIsDragging(false);
        return;
      }

      // Reordenar array
      const newItems = [...items];
      const [removed] = newItems.splice(draggedItem.index, 1);
      newItems.splice(targetIndex, 0, removed);

      // Notificar cambio
      if (onReorder) {
        onReorder(newItems);
      }

      setDraggedItem(null);
      setDragOverItem(null);
      setIsDragging(false);
      dragCounter.current = 0;
    },
    [items, draggedItem, onReorder]
  );

  return {
    draggedItem,
    dragOverItem,
    isDragging,
    handleDragStart,
    handleDragEnd,
    handleDragEnter,
    handleDragLeave,
    handleDragOver,
    handleDrop,
  };
};

/**
 * Custom hook para drag & drop entre categorías/listas
 * @param {Object} _lists - Objeto con listas categorizadas {categoria1: [...], categoria2: [...]}
 * @param {Function} onMove - Callback cuando se mueve item entre listas
 */
export const useDragBetweenLists = (_lists = {}, onMove) => {
  const [draggedItem, setDraggedItem] = useState(null);
  const [dragOverList, setDragOverList] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragStart = useCallback((e, item, sourceList) => {
    setDraggedItem({ item, sourceList });
    setIsDragging(true);
    e.dataTransfer.effectAllowed = 'move';

    setTimeout(() => {
      e.target.style.opacity = '0.4';
    }, 0);
  }, []);

  const handleDragEnd = useCallback((e) => {
    e.target.style.opacity = '1';
    setDraggedItem(null);
    setDragOverList(null);
    setIsDragging(false);
  }, []);

  const handleDragEnterList = useCallback((e, listKey) => {
    e.preventDefault();
    setDragOverList(listKey);
  }, []);

  const handleDragLeaveList = useCallback((e) => {
    e.preventDefault();
    setDragOverList(null);
  }, []);

  const handleDragOverList = useCallback((e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }, []);

  const handleDropOnList = useCallback(
    (e, targetList) => {
      e.preventDefault();
      e.stopPropagation();

      if (!draggedItem || draggedItem.sourceList === targetList) {
        setDraggedItem(null);
        setDragOverList(null);
        setIsDragging(false);
        return;
      }

      // Notificar movimiento entre listas
      if (onMove) {
        onMove({
          item: draggedItem.item,
          from: draggedItem.sourceList,
          to: targetList,
        });
      }

      setDraggedItem(null);
      setDragOverList(null);
      setIsDragging(false);
    },
    [draggedItem, onMove]
  );

  return {
    draggedItem,
    dragOverList,
    isDragging,
    handleDragStart,
    handleDragEnd,
    handleDragEnterList,
    handleDragLeaveList,
    handleDragOverList,
    handleDropOnList,
  };
};

/**
 * Componente: Contenedor draggable para items
 */
export const DraggableItem = ({
  item,
  index,
  children,
  onDragStart,
  onDragEnd,
  onDragEnter,
  onDragLeave,
  onDragOver,
  onDrop,
  isDraggedOver = false,
  isDragging = false,
  className = '',
}) => {
  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, item, index)}
      onDragEnd={onDragEnd}
      onDragEnter={(e) => onDragEnter(e, item, index)}
      onDragLeave={onDragLeave}
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, item, index)}
      className={`
        ${className}
        ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}
        ${isDraggedOver ? 'border-t-4 border-purple-500' : ''}
        transition-all duration-200
      `}
    >
      <div className="flex items-center gap-2">
        {/* Drag Handle */}
        <div className="drag-handle cursor-grab hover:text-purple-400 transition-colors">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M7 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 2zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 14zm6-8a2 2 0 1 0-.001-4.001A2 2 0 0 0 13 6zm0 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 14z" />
          </svg>
        </div>

        {/* Content */}
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
};

/**
 * Componente: Zona de drop para listas
 */
export const DropZone = ({
  listKey,
  title,
  items = [],
  children,
  onDragEnter,
  onDragLeave,
  onDragOver,
  onDrop,
  isDraggedOver = false,
  isEmpty = false,
  className = '',
}) => {
  return (
    <div
      onDragEnter={(e) => onDragEnter(e, listKey)}
      onDragLeave={onDragLeave}
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, listKey)}
      className={`
        ${className}
        ${isDraggedOver ? 'ring-4 ring-purple-500 ring-opacity-50 bg-purple-500/10' : ''}
        ${isEmpty ? 'min-h-[200px] flex items-center justify-center' : ''}
        transition-all duration-200 rounded-xl
      `}
    >
      {title && (
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-bold">{title}</h3>
          <span className="text-sm text-slate-400">{items.length} items</span>
        </div>
      )}

      {isEmpty && (
        <div className="text-center text-slate-400">
          <svg
            className="w-12 h-12 mx-auto mb-2 opacity-50"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
          <p className="text-sm">Arrastra items aquí</p>
        </div>
      )}

      {!isEmpty && children}
    </div>
  );
};

/**
 * Componente: Indicador visual de drag en progreso
 */
export const DragOverlay = ({ isDragging, itemName }) => {
  if (!isDragging) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[9998]">
      <div className="fixed top-4 left-1/2 transform -translate-x-1/2 glass px-6 py-3 rounded-full border border-purple-500/30 shadow-xl animate-bounce">
        <div className="flex items-center gap-2">
          <svg
            className="w-5 h-5 text-purple-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
            />
          </svg>
          <span className="text-sm font-semibold">Arrastrando: {itemName || 'Item'}</span>
        </div>
      </div>
    </div>
  );
};

/**
 * Componente: Botón para habilitar/deshabilitar modo drag & drop
 */
export const DragModeToggle = ({ enabled, onToggle }) => {
  return (
    <button
      onClick={onToggle}
      className={`
        px-4 py-2 rounded-lg font-semibold transition-all flex items-center gap-2
        ${
          enabled
            ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
            : 'bg-slate-500/20 text-slate-400 border border-slate-500/30 hover:bg-slate-500/30'
        }
      `}
      title={enabled ? 'Deshabilitar reordenamiento' : 'Habilitar reordenamiento'}
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
        />
      </svg>
      {enabled ? 'Modo Reordenar ON' : 'Reordenar'}
    </button>
  );
};

/**
 * Utilidad: Mover item en array
 */
export const moveItem = (array, fromIndex, toIndex) => {
  const newArray = [...array];
  const [item] = newArray.splice(fromIndex, 1);
  newArray.splice(toIndex, 0, item);
  return newArray;
};

/**
 * Utilidad: Mover item entre arrays
 */
export const moveItemBetweenArrays = (sourceArray, targetArray, sourceIndex) => {
  const newSourceArray = [...sourceArray];
  const newTargetArray = [...targetArray];
  const [item] = newSourceArray.splice(sourceIndex, 1);
  newTargetArray.push(item);

  return {
    source: newSourceArray,
    target: newTargetArray,
    movedItem: item,
  };
};

/**
 * Hook para persistir orden en localStorage
 */
export const usePersistentOrder = (key, initialItems = []) => {
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem(`flowdistributor-order-${key}`);
      if (saved) {
        const order = JSON.parse(saved);
        // Reordenar items según orden guardado
        const orderedItems = order
          .map((id) => initialItems.find((item) => item.id === id))
          .filter(Boolean);

        // Añadir items nuevos que no estén en el orden guardado
        const newItems = initialItems.filter((item) => !order.includes(item.id));

        return [...orderedItems, ...newItems];
      }
    } catch (error) {
      // console.error('Error loading order from localStorage:', error);
    }
    return initialItems;
  });

  const updateOrder = useCallback(
    (newItems) => {
      setItems(newItems);
      try {
        const order = newItems.map((item) => item.id);
        localStorage.setItem(`flowdistributor-order-${key}`, JSON.stringify(order));
      } catch (error) {
        // console.error('Error saving order to localStorage:', error);
      }
    },
    [key]
  );

  useEffect(() => {
    setItems(initialItems);
  }, [initialItems.length]);

  return [items, updateOrder];
};

export default {
  useDragAndDrop,
  useDragBetweenLists,
  DraggableItem,
  DropZone,
  DragOverlay,
  DragModeToggle,
  moveItem,
  moveItemBetweenArrays,
  usePersistentOrder,
};
