/**
 * CategoryFilter Premium - Chronos OS Design System
 *
 * Filtro multi-select con chips animados
 * - Búsqueda de categorías
 * - Chips con animaciones de add/remove
 * - Select all / Clear all
 * - Color-coded categories
 * - Spring physics animations
 */

import { AnimatePresence, motion } from 'framer-motion';
import { Check, ChevronDown, Filter, Search, X } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

export interface Category {
  id: string;
  label: string;
  color?: string;
  count?: number;
}

interface CategoryFilterProps {
  categories: Category[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
  searchable?: boolean;
  showCount?: boolean;
  maxDisplay?: number;
  className?: string;
}

const DEFAULT_COLORS = [
  '#00d9ff', // cyan
  '#8b5cf6', // purple
  '#6366f1', // blue
  '#10b981', // green
  '#f59e0b', // amber
  '#ef4444', // red
];

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selected,
  onChange,
  placeholder = 'Filtrar categorías',
  searchable = true,
  showCount = true,
  maxDisplay = 3,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  // Cerrar al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const filteredCategories = categories.filter((cat) =>
    cat.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleCategory = (id: string) => {
    if (selected.includes(id)) {
      onChange(selected.filter((s) => s !== id));
    } else {
      onChange([...selected, id]);
    }
  };

  const selectAll = () => {
    onChange(categories.map((cat) => cat.id));
  };

  const clearAll = () => {
    onChange([]);
  };

  const getSelectedCategories = () => {
    return categories.filter((cat) => selected.includes(cat.id));
  };

  const getDisplayText = () => {
    const selectedCats = getSelectedCategories();
    if (selectedCats.length === 0) return placeholder;
    if (selectedCats.length <= maxDisplay) {
      return selectedCats.map((cat) => cat.label).join(', ');
    }
    return `${selectedCats.slice(0, maxDisplay).map((cat) => cat.label).join(', ')} +${selectedCats.length - maxDisplay}`;
  };

  const getCategoryColor = (category: Category, index: number) => {
    return category.color || DEFAULT_COLORS[index % DEFAULT_COLORS.length];
  };

  const removeChip = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    toggleCategory(id);
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Trigger Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl
                   text-silver-100 text-left flex items-center justify-between gap-3
                   hover:bg-white/10 hover:border-neon-purple/30 transition-all duration-300
                   shadow-lg hover:shadow-neon-purple/20"
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <Filter className="w-5 h-5 text-neon-purple flex-shrink-0" />
          <span className="text-sm truncate">{getDisplayText()}</span>
          {selected.length > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="px-2 py-0.5 bg-gradient-to-r from-neon-purple to-neon-blue rounded-full
                       text-xs font-bold text-white shadow-lg flex-shrink-0"
            >
              {selected.length}
            </motion.span>
          )}
        </div>
        <ChevronDown
          className={`w-4 h-4 text-silver-400 transition-transform duration-300 flex-shrink-0
                     ${isOpen ? 'rotate-180' : ''}`}
        />
      </motion.button>

      {/* Selected Chips */}
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          <AnimatePresence>
            {getSelectedCategories().map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, scale: 0.8, x: -20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.8, x: 20 }}
                transition={{
                  type: 'spring',
                  stiffness: 500,
                  damping: 30,
                }}
                className="px-3 py-1.5 rounded-lg flex items-center gap-2
                         backdrop-blur-xl border shadow-lg text-sm"
                style={{
                  backgroundColor: `${getCategoryColor(category, index)}15`,
                  borderColor: `${getCategoryColor(category, index)}40`,
                  color: getCategoryColor(category, index),
                }}
              >
                <span className="font-medium">{category.label}</span>
                {showCount && category.count !== undefined && (
                  <span className="opacity-60">({category.count})</span>
                )}
                <motion.button
                  whileHover={{ scale: 1.2, rotate: 90 }}
                  whileTap={{ scale: 0.8 }}
                  onClick={(e) => removeChip(category.id, e)}
                  className="p-0.5 hover:bg-white/20 rounded transition-colors"
                >
                  <X className="w-3 h-3" />
                </motion.button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-2 z-50"
          >
            <div className="bg-charcoal-800/95 backdrop-blur-2xl border border-white/10 rounded-2xl
                          shadow-2xl shadow-black/50 overflow-hidden">

              {/* Search Bar */}
              {searchable && (
                <div className="p-4 border-b border-white/10">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-silver-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Buscar..."
                      className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg
                               text-silver-100 placeholder-silver-500 text-sm
                               focus:outline-none focus:border-neon-purple/50 focus:ring-2 focus:ring-neon-purple/20
                               transition-all duration-200"
                    />
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
                <span className="text-xs text-silver-400">
                  {selected.length} de {categories.length} seleccionados
                </span>
                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={selectAll}
                    disabled={selected.length === categories.length}
                    className="px-3 py-1 text-xs font-medium text-neon-cyan
                             hover:bg-neon-cyan/10 rounded-lg transition-colors
                             disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Seleccionar todo
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={clearAll}
                    disabled={selected.length === 0}
                    className="px-3 py-1 text-xs font-medium text-silver-400
                             hover:bg-white/10 rounded-lg transition-colors
                             disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Limpiar
                  </motion.button>
                </div>
              </div>

              {/* Categories List */}
              <div className="max-h-80 overflow-y-auto p-2">
                {filteredCategories.length === 0 ? (
                  <div className="py-8 text-center text-silver-500 text-sm">
                    No se encontraron categorías
                  </div>
                ) : (
                  <div className="space-y-1">
                    {filteredCategories.map((category, index) => {
                      const isSelected = selected.includes(category.id);
                      const color = getCategoryColor(category, index);

                      return (
                        <motion.button
                          key={category.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.03 }}
                          whileHover={{ x: 4 }}
                          onClick={() => toggleCategory(category.id)}
                          className="w-full px-3 py-2.5 rounded-lg flex items-center justify-between
                                   hover:bg-white/5 transition-all duration-200 group"
                        >
                          <div className="flex items-center gap-3">
                            {/* Color indicator */}
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: color }}
                            />

                            {/* Label */}
                            <span className="text-sm text-silver-200 group-hover:text-white transition-colors">
                              {category.label}
                            </span>

                            {/* Count */}
                            {showCount && category.count !== undefined && (
                              <span className="text-xs text-silver-500">
                                ({category.count})
                              </span>
                            )}
                          </div>

                          {/* Checkbox */}
                          <motion.div
                            animate={{
                              backgroundColor: isSelected ? color : 'transparent',
                              borderColor: isSelected ? color : '#4b5563',
                            }}
                            className="w-5 h-5 rounded border-2 flex items-center justify-center"
                          >
                            <AnimatePresence>
                              {isSelected && (
                                <motion.div
                                  initial={{ scale: 0, rotate: -180 }}
                                  animate={{ scale: 1, rotate: 0 }}
                                  exit={{ scale: 0, rotate: 180 }}
                                  transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                                >
                                  <Check className="w-3 h-3 text-white" />
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </motion.div>
                        </motion.button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
