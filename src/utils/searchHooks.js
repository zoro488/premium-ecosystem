/**
 * 🎣 CUSTOM HOOKS PARA BÚSQUEDA Y FILTRADO
 */

import { useState, useMemo, useCallback, useEffect } from 'react';
import { searchAndFilter, getAutocompleteSuggestions, searchWithScore, applyFilters } from './searchUtils';

/**
 * Hook principal de búsqueda con todas las features
 */
export const useAdvancedSearch = (data, searchFields, options = {}) => {
  const {
    initialQuery = '',
    initialFilters = { status: 'todos', dateRange: 'todos', sortBy: 'reciente' },
    debounceMs = 300,
    useScoring = false
  } = options;
  
  const [query, setQuery] = useState(initialQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);
  const [filters, setFilters] = useState(initialFilters);
  const [searchHistory, setSearchHistory] = useState([]);
  
  // Debounce para búsqueda
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
      
      // Guardar en historial si no está vacío
      if (query.trim() && !searchHistory.includes(query.trim())) {
        setSearchHistory(prev => [query.trim(), ...prev].slice(0, 10));
      }
    }, debounceMs);
    
    return () => clearTimeout(timer);
  }, [query, debounceMs]);
  
  // Datos filtrados
  const filteredData = useMemo(() => {
    if (!data || data.length === 0) return [];
    
    if (useScoring && debouncedQuery) {
      // Búsqueda con scoring (relevancia)
      const scored = searchWithScore(data, debouncedQuery, searchFields);
      return applyFilters(scored, filters);
    }
    
    // Búsqueda estándar
    return searchAndFilter(data, debouncedQuery, searchFields, filters);
  }, [data, debouncedQuery, searchFields, filters, useScoring]);
  
  // Sugerencias de autocompletado
  const suggestions = useMemo(() => {
    if (!query || query.length < 2) return [];
    return getAutocompleteSuggestions(data, query, searchFields, 8);
  }, [data, query, searchFields]);
  
  // Helpers
  const clearSearch = useCallback(() => {
    setQuery('');
    setDebouncedQuery('');
  }, []);
  
  const clearFilters = useCallback(() => {
    setFilters(initialFilters);
  }, [initialFilters]);
  
  const clearAll = useCallback(() => {
    clearSearch();
    clearFilters();
  }, [clearSearch, clearFilters]);
  
  const updateFilter = useCallback((key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);
  
  return {
    // Estado
    query,
    setQuery,
    filters,
    setFilters,
    updateFilter,
    
    // Resultados
    filteredData,
    suggestions,
    searchHistory,
    
    // Stats
    totalResults: filteredData.length,
    hasResults: filteredData.length > 0,
    isSearching: query.length > 0,
    isFiltering: Object.values(filters).some(v => v !== 'todos' && v !== 'reciente'),
    
    // Helpers
    clearSearch,
    clearFilters,
    clearAll
  };
};

/**
 * Hook simple para búsqueda rápida
 */
export const useQuickSearch = (data, searchFields) => {
  const [query, setQuery] = useState('');
  
  const results = useMemo(() => {
    if (!query) return data;
    return data.filter(item => 
      searchFields.some(field => {
        const value = String(item[field] || '').toLowerCase();
        return value.includes(query.toLowerCase());
      })
    );
  }, [data, query, searchFields]);
  
  return { query, setQuery, results };
};

/**
 * Hook para historial de búsquedas persistente
 */
export const useSearchHistory = (storageKey = 'searchHistory', maxItems = 20) => {
  const [history, setHistory] = useState(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  
  const addToHistory = useCallback((query) => {
    if (!query || !query.trim()) return;
    
    setHistory(prev => {
      const updated = [query.trim(), ...prev.filter(q => q !== query.trim())].slice(0, maxItems);
      localStorage.setItem(storageKey, JSON.stringify(updated));
      return updated;
    });
  }, [storageKey, maxItems]);
  
  const removeFromHistory = useCallback((query) => {
    setHistory(prev => {
      const updated = prev.filter(q => q !== query);
      localStorage.setItem(storageKey, JSON.stringify(updated));
      return updated;
    });
  }, [storageKey]);
  
  const clearHistory = useCallback(() => {
    setHistory([]);
    localStorage.removeItem(storageKey);
  }, [storageKey]);
  
  return { history, addToHistory, removeFromHistory, clearHistory };
};

export default { useAdvancedSearch, useQuickSearch, useSearchHistory };
