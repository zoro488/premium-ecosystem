/**
 * 🎮 COMPONENTES INTERACTIVOS PREMIUM
 * Drag & Drop, Swipe, Command Palette y más
 */
import { useEffect, useRef, useState } from 'react';

import { AnimatePresence, motion, useDragControls } from 'framer-motion';
import { Command, Search, X } from 'lucide-react';

/**
 * 🖱️ DRAGGABLE CARD - Card arrastrable con preview
 */
export const DraggableCard = ({
  children,
  onDragEnd,
  dragConstraints,
  className = '',
  showGhost = true,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const controls = useDragControls();

  return (
    <motion.div
      drag
      dragControls={controls}
      dragConstraints={dragConstraints}
      dragElastic={0.1}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={(event, info) => {
        setIsDragging(false);
        onDragEnd?.(event, info);
      }}
      className={`
        cursor-grab active:cursor-grabbing
        ${isDragging ? 'opacity-50 scale-95' : ''}
        ${className}
      `}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      {children}

      {showGhost && isDragging && (
        <motion.div
          className="absolute inset-0 bg-blue-500/20 rounded-xl border-2 border-blue-500 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        />
      )}
    </motion.div>
  );
};

/**
 * 📱 SWIPEABLE CARD - Card deslizable tipo Tinder
 */
export const SwipeableCard = ({
  children,
  onSwipeLeft,
  onSwipeRight,
  threshold = 100,
  className = '',
}) => {
  const [exitX, setExitX] = useState(0);

  const handleDragEnd = (_event, info) => {
    if (info.offset.x > threshold) {
      setExitX(1000);
      onSwipeRight?.();
    } else if (info.offset.x < -threshold) {
      setExitX(-1000);
      onSwipeLeft?.();
    }
  };

  return (
    <motion.div
      className={`relative ${className}`}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      animate={{ x: exitX }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      whileDrag={{ scale: 1.05, rotate: exitX > 0 ? 5 : exitX < 0 ? -5 : 0 }}
    >
      {children}

      {/* Overlay indicators */}
      <motion.div
        className="absolute inset-0 bg-green-500/20 rounded-xl border-4 border-green-500 flex items-center justify-center pointer-events-none"
        animate={{ opacity: exitX > threshold ? 1 : 0 }}
      >
        <span className="text-4xl font-bold text-green-500">✓</span>
      </motion.div>

      <motion.div
        className="absolute inset-0 bg-red-500/20 rounded-xl border-4 border-red-500 flex items-center justify-center pointer-events-none"
        animate={{ opacity: exitX < -threshold ? 1 : 0 }}
      >
        <span className="text-4xl font-bold text-red-500">✕</span>
      </motion.div>
    </motion.div>
  );
};

/**
 * ⌘ COMMAND PALETTE - Paleta de comandos (CMD+K)
 */
export const CommandPalette = ({
  isOpen,
  onClose,
  commands = [],
  placeholder = 'Buscar comandos...',
}) => {
  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);

  const filteredCommands = commands.filter((cmd) =>
    cmd.label.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev < filteredCommands.length - 1 ? prev + 1 : 0));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : filteredCommands.length - 1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        filteredCommands[selectedIndex]?.action?.();
        onClose();
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedIndex, filteredCommands, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Command Palette */}
          <motion.div
            className="fixed top-[20%] left-1/2 -translate-x-1/2 w-full max-w-2xl z-50"
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.9 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            <div className="mx-4 bg-gray-900/95 backdrop-blur-xl rounded-2xl border border-gray-700/50 shadow-2xl overflow-hidden">
              {/* Search Input */}
              <div className="flex items-center gap-3 p-4 border-b border-gray-700/50">
                <Search className="text-gray-400" size={20} />
                <input
                  ref={inputRef}
                  type="text"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setSelectedIndex(0);
                  }}
                  placeholder={placeholder}
                  className="flex-1 bg-transparent text-white placeholder-gray-400 outline-none"
                />
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Commands List */}
              <div className="max-h-96 overflow-y-auto">
                {filteredCommands.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">No se encontraron comandos</div>
                ) : (
                  <div className="p-2">
                    {filteredCommands.map((cmd, index) => (
                      <motion.button
                        key={index}
                        onClick={() => {
                          cmd.action?.();
                          onClose();
                        }}
                        className={`
                          w-full flex items-center gap-3 px-4 py-3 rounded-xl
                          transition-all text-left
                          ${
                            index === selectedIndex
                              ? 'bg-blue-500/20 text-blue-400'
                              : 'text-gray-300 hover:bg-gray-800/50'
                          }
                        `}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.03 }}
                        whileHover={{ x: 5 }}
                      >
                        {cmd.icon && <span className="text-gray-400">{cmd.icon}</span>}
                        <div className="flex-1">
                          <p className="font-medium">{cmd.label}</p>
                          {cmd.description && (
                            <p className="text-xs text-gray-500">{cmd.description}</p>
                          )}
                        </div>
                        {cmd.shortcut && (
                          <kbd className="px-2 py-1 text-xs bg-gray-800/50 rounded border border-gray-700">
                            {cmd.shortcut}
                          </kbd>
                        )}
                      </motion.button>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between p-3 border-t border-gray-700/50 bg-gray-800/30 text-xs text-gray-500">
                <div className="flex gap-4">
                  <span>↑↓ Navegar</span>
                  <span>↵ Seleccionar</span>
                  <span>ESC Cerrar</span>
                </div>
                <div className="flex items-center gap-1">
                  <Command size={12} />
                  <span>K para abrir</span>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

/**
 * 🎯 DROP ZONE - Zona de drop para drag & drop
 */
export const DropZone = ({
  onDrop,
  children,
  activeText = 'Suelta aquí',
  className = '',
  accept = '*',
}) => {
  const [isOver, setIsOver] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsOver(true);
  };

  const handleDragLeave = () => {
    setIsOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsOver(false);
    onDrop?.(e.dataTransfer);
  };

  return (
    <motion.div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`
        relative rounded-2xl border-2 border-dashed transition-all
        ${isOver ? 'border-blue-500 bg-blue-500/10 scale-105' : 'border-gray-600 bg-gray-800/20'}
        ${className}
      `}
      animate={{
        borderColor: isOver ? '#3b82f6' : '#4b5563',
      }}
    >
      {children}

      <AnimatePresence>
        {isOver && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center bg-blue-500/20 backdrop-blur-sm rounded-2xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.p
              className="text-2xl font-bold text-blue-400"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
            >
              {activeText}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

/**
 * 📍 SORTABLE LIST - Lista ordenable con drag & drop
 */
export const SortableList = ({ items, onReorder, renderItem, className = '' }) => {
  const [localItems, setLocalItems] = useState(items);

  useEffect(() => {
    setLocalItems(items);
  }, [items]);

  const handleDragEnd = (index, _event, info) => {
    const newItems = [...localItems];
    const draggedItem = newItems[index];

    // Simple reordering logic
    const targetIndex = Math.round(index + info.offset.y / 60); // Assuming 60px per item

    if (targetIndex >= 0 && targetIndex < newItems.length) {
      newItems.splice(index, 1);
      newItems.splice(targetIndex, 0, draggedItem);
      setLocalItems(newItems);
      onReorder?.(newItems);
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {localItems.map((item, index) => (
        <motion.div
          key={item.id || index}
          drag="y"
          dragConstraints={{ top: 0, bottom: 0 }}
          dragElastic={0.1}
          onDragEnd={(e, info) => handleDragEnd(index, e, info)}
          whileDrag={{
            scale: 1.05,
            boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
            zIndex: 50,
          }}
          className="cursor-grab active:cursor-grabbing"
          layout
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          {renderItem(item, index)}
        </motion.div>
      ))}
    </div>
  );
};

/**
 * 🎨 COLOR PICKER - Selector de color animado
 */
export const ColorPicker = ({
  colors = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#ec4899'],
  selectedColor,
  onChange,
  size = 40,
}) => {
  return (
    <div className="flex gap-2 flex-wrap">
      {colors.map((color) => (
        <motion.button
          key={color}
          onClick={() => onChange(color)}
          className="relative rounded-full border-2 transition-all"
          style={{
            width: size,
            height: size,
            backgroundColor: color,
            borderColor: selectedColor === color ? color : 'transparent',
          }}
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
          animate={{
            boxShadow: selectedColor === color ? `0 0 20px ${color}` : '0 0 0px transparent',
          }}
        >
          {selectedColor === color && (
            <motion.div
              className="absolute inset-0 rounded-full border-4 border-white"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 500 }}
            />
          )}
        </motion.button>
      ))}
    </div>
  );
};

/**
 * 🔍 SPOTLIGHT SEARCH - Búsqueda con spotlight
 */
export const SpotlightSearch = ({
  items = [],
  onSelect,
  placeholder = 'Buscar...',
  renderResult,
}) => {
  const [search, setSearch] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const filteredItems = items.filter((item) =>
    item.label?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="relative">
      <motion.div
        className={`
          relative flex items-center gap-3 px-4 py-3 rounded-xl
          backdrop-blur-xl border transition-all
          ${
            isFocused
              ? 'border-blue-500/50 bg-blue-500/5 shadow-lg shadow-blue-500/20'
              : 'border-gray-700/50 bg-gray-800/40'
          }
        `}
        animate={{ scale: isFocused ? 1.02 : 1 }}
      >
        <Search className="text-gray-400" size={20} />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          placeholder={placeholder}
          className="flex-1 bg-transparent text-white placeholder-gray-400 outline-none"
        />
      </motion.div>

      <AnimatePresence>
        {isFocused && search && filteredItems.length > 0 && (
          <motion.div
            className="absolute top-full mt-2 w-full bg-gray-900/95 backdrop-blur-xl rounded-xl border border-gray-700/50 shadow-2xl overflow-hidden z-50"
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
          >
            <div className="max-h-64 overflow-y-auto p-2">
              {filteredItems.map((item, index) => (
                <motion.button
                  key={item.id || index}
                  onClick={() => {
                    onSelect?.(item);
                    setSearch('');
                  }}
                  className="w-full px-4 py-3 rounded-lg text-left hover:bg-gray-800/50 transition-all"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ x: 5 }}
                >
                  {renderResult ? renderResult(item) : item.label}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default {
  DraggableCard,
  SwipeableCard,
  CommandPalette,
  DropZone,
  SortableList,
  ColorPicker,
  SpotlightSearch,
};
