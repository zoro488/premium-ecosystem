/**
 * FilterPanel Premium - Chronos OS Design System
 *
 * Panel deslizante con todos los filtros
 * - Slide-in animation desde la derecha
 * - Glassmorphism design
 * - Múltiples tipos de filtros
 * - Apply / Reset buttons
 * - Filter count badge
 * - Backdrop blur
 */

import { AnimatePresence, motion } from 'framer-motion';
import { Check, Filter, RotateCcw, X } from 'lucide-react';
import React, { useEffect } from 'react';
import { CategoryFilter, type Category } from './CategoryFilter';
import { DateRangePicker } from './DateRangePicker';

interface DateRange {
  start: Date | null;
  end: Date | null;
}

export interface FilterState {
  dateRange: DateRange;
  categories: string[];
  [key: string]: DateRange | string[] | unknown;
}

interface FilterPanelProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  categories?: Category[];
  onApply?: () => void;
  onReset?: () => void;
  showApplyButton?: boolean;
  className?: string;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  isOpen,
  onClose,
  filters,
  onFiltersChange,
  categories = [],
  onApply,
  onReset,
  showApplyButton = true,
  className = ''
}) => {
  // Bloquear scroll del body cuando el panel está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = 'unset';
      };
    }
  }, [isOpen]);

  // Cerrar con tecla ESC
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  const handleDateRangeChange = (dateRange: DateRange) => {
    onFiltersChange({ ...filters, dateRange });
  };

  const handleCategoriesChange = (selectedCategories: string[]) => {
    onFiltersChange({ ...filters, categories: selectedCategories });
  };

  const handleReset = () => {
    const resetFilters: FilterState = {
      dateRange: { start: null, end: null },
      categories: [],
    };
    onFiltersChange(resetFilters);
    onReset?.();
  };

  const handleApply = () => {
    onApply?.();
    if (!showApplyButton) {
      onClose();
    }
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.dateRange.start || filters.dateRange.end) count++;
    if (filters.categories.length > 0) count++;
    return count;
  };

  const activeFilterCount = getActiveFilterCount();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />

          {/* Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 30,
            }}
            className={`fixed top-0 right-0 h-full w-full max-w-md bg-charcoal-900/95 backdrop-blur-2xl
                       border-l border-white/10 shadow-2xl z-50 flex flex-col ${className}`}
          >
            {/* Header */}
            <div className="px-6 py-5 border-b border-white/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-neon-purple/20 to-neon-blue/20 rounded-xl">
                    <Filter className="w-5 h-5 text-neon-purple" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white">Filtros</h2>
                    {activeFilterCount > 0 && (
                      <motion.p
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-xs text-silver-400"
                      >
                        {activeFilterCount} filtro{activeFilterCount !== 1 ? 's' : ''} activo{activeFilterCount !== 1 ? 's' : ''}
                      </motion.p>
                    )}
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="p-2 hover:bg-white/10 rounded-xl transition-colors"
                >
                  <X className="w-5 h-5 text-silver-300" />
                </motion.button>
              </div>

              {/* Active Filter Count Badge */}
              {activeFilterCount > 0 && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2, type: 'spring', stiffness: 500, damping: 25 }}
                  className="mt-3 px-3 py-1.5 bg-gradient-to-r from-neon-purple/10 to-neon-blue/10
                           border border-neon-purple/30 rounded-lg flex items-center gap-2"
                >
                  <div className="w-2 h-2 rounded-full bg-neon-purple animate-pulse" />
                  <span className="text-xs text-silver-300">
                    Mostrando resultados filtrados
                  </span>
                </motion.div>
              )}
            </div>

            {/* Filters Content */}
            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
              {/* Date Range Filter */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <label className="block text-sm font-semibold text-silver-200 mb-3">
                  Rango de Fechas
                </label>
                <DateRangePicker
                  value={filters.dateRange}
                  onChange={handleDateRangeChange}
                />
              </motion.div>

              {/* Categories Filter */}
              {categories.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <label className="block text-sm font-semibold text-silver-200 mb-3">
                    Categorías
                  </label>
                  <CategoryFilter
                    categories={categories}
                    selected={filters.categories}
                    onChange={handleCategoriesChange}
                    searchable
                    showCount
                  />
                </motion.div>
              )}

              {/* Divider */}
              <div className="border-t border-white/10" />

              {/* Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="p-4 bg-gradient-to-br from-neon-cyan/5 to-neon-purple/5
                         border border-neon-cyan/20 rounded-xl"
              >
                <p className="text-xs text-silver-400 leading-relaxed">
                  💡 Los filtros se aplican en tiempo real. Usa el botón "Aplicar" para confirmar
                  tus selecciones o "Resetear" para volver al estado inicial.
                </p>
              </motion.div>
            </div>

            {/* Footer Actions */}
            <div className="px-6 py-5 border-t border-white/10 space-y-3">
              {showApplyButton && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleApply}
                  disabled={activeFilterCount === 0}
                  className="w-full px-6 py-3 bg-gradient-to-r from-neon-purple via-neon-blue to-neon-cyan
                           text-white font-bold rounded-xl shadow-lg shadow-neon-purple/30
                           hover:shadow-neon-purple/50 transition-all duration-300
                           disabled:opacity-50 disabled:cursor-not-allowed
                           flex items-center justify-center gap-2 relative overflow-hidden group"
                >
                  {/* Button glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0
                               translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />

                  <Check className="w-5 h-5" />
                  <span>Aplicar Filtros</span>
                </motion.button>
              )}

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleReset}
                disabled={activeFilterCount === 0}
                className="w-full px-6 py-3 bg-white/5 border border-white/10 text-silver-300
                         font-semibold rounded-xl hover:bg-white/10 hover:border-white/20
                         transition-all duration-200 flex items-center justify-center gap-2
                         disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Resetear Filtros</span>
              </motion.button>
            </div>

            {/* Decorative Elements */}
            <div className="absolute top-32 right-0 w-64 h-64 bg-neon-purple/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-32 left-0 w-64 h-64 bg-neon-cyan/10 rounded-full blur-3xl pointer-events-none" />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
