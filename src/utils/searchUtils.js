/**
 * 🔍 UTILIDADES DE BÚSQUEDA Y FILTRADO AVANZADAS
 * Fuzzy search, multi-campo, destacado, autocompletado
 */

/**
 * Fuzzy search - Búsqueda tolerante a errores
 */
export const fuzzySearch = (text, query) => {
  if (!query) return true;
  
  const cleanText = text.toLowerCase().trim();
  const cleanQuery = query.toLowerCase().trim();
  
  // Búsqueda exacta
  if (cleanText.includes(cleanQuery)) return true;
  
  // Fuzzy matching
  let queryIndex = 0;
  for (let i = 0; i < cleanText.length && queryIndex < cleanQuery.length; i++) {
    if (cleanText[i] === cleanQuery[queryIndex]) {
      queryIndex++;
    }
  }
  
  return queryIndex === cleanQuery.length;
};

/**
 * Buscar en múltiples campos de un objeto
 */
export const multiFieldSearch = (item, query, fields) => {
  if (!query || !item) return true;
  
  return fields.some(field => {
    const value = getNestedValue(item, field);
    if (value == null) return false;
    return fuzzySearch(String(value), query);
  });
};

/**
 * Obtener valor anidado de un objeto (ej: 'producto.nombre')
 */
const getNestedValue = (obj, path) => {
  return path.split('.').reduce((current, prop) => current?.[prop], obj);
};

/**
 * Destacar términos de búsqueda en texto
 */
export const highlightMatch = (text, query) => {
  if (!query || !text) return text;
  
  const regex = new RegExp(`(${query})`, 'gi');
  return text.replace(regex, '<mark class="bg-yellow-400/30 text-yellow-200">$1</mark>');
};

/**
 * Generar sugerencias de autocompletado
 */
export const getAutocompleteSuggestions = (items, query, fields, maxSuggestions = 5) => {
  if (!query || query.length < 2) return [];
  
  const suggestions = new Set();
  
  items.forEach(item => {
    fields.forEach(field => {
      const value = getNestedValue(item, field);
      if (value && fuzzySearch(String(value), query)) {
        suggestions.add(String(value));
      }
    });
  });
  
  return Array.from(suggestions).slice(0, maxSuggestions);
};

/**
 * Aplicar filtros a un array de datos
 */
export const applyFilters = (data, filters) => {
  let filtered = [...data];
  
  // Filtro de estado
  if (filters.status && filters.status !== 'todos') {
    filtered = filtered.filter(item => {
      const status = item.estado || item.status || 'activo';
      return status.toLowerCase() === filters.status.toLowerCase();
    });
  }
  
  // Filtro de rango de fechas
  if (filters.dateRange && filters.dateRange !== 'todos') {
    const now = new Date();
    const ranges = {
      'hoy': 1,
      'semana': 7,
      'mes': 30,
      'trimestre': 90,
      'año': 365
    };
    
    const days = ranges[filters.dateRange];
    if (days) {
      const limitDate = new Date(now - days * 24 * 60 * 60 * 1000);
      filtered = filtered.filter(item => {
        const itemDate = new Date(item.fecha || item.createdAt || now);
        return itemDate >= limitDate;
      });
    }
  }
  
  // Ordenamiento
  if (filters.sortBy) {
    filtered = sortData(filtered, filters.sortBy);
  }
  
  return filtered;
};

/**
 * Ordenar datos
 */
export const sortData = (data, sortBy) => {
  const sorted = [...data];
  
  switch (sortBy) {
    case 'reciente':
      return sorted.sort((a, b) => {
        const dateA = new Date(a.fecha || a.createdAt || 0);
        const dateB = new Date(b.fecha || b.createdAt || 0);
        return dateB - dateA;
      });
      
    case 'antiguo':
      return sorted.sort((a, b) => {
        const dateA = new Date(a.fecha || a.createdAt || 0);
        const dateB = new Date(b.fecha || b.createdAt || 0);
        return dateA - dateB;
      });
      
    case 'mayor':
      return sorted.sort((a, b) => {
        const amountA = a.total || a.totalVenta || a.monto || a.adeudo || 0;
        const amountB = b.total || b.totalVenta || b.monto || b.adeudo || 0;
        return amountB - amountA;
      });
      
    case 'menor':
      return sorted.sort((a, b) => {
        const amountA = a.total || a.totalVenta || a.monto || a.adeudo || 0;
        const amountB = b.total || b.totalVenta || b.monto || b.adeudo || 0;
        return amountA - amountB;
      });
      
    case 'alfabetico':
      return sorted.sort((a, b) => {
        const nameA = (a.nombre || a.name || '').toLowerCase();
        const nameB = (b.nombre || b.name || '').toLowerCase();
        return nameA.localeCompare(nameB);
      });
      
    default:
      return sorted;
  }
};

/**
 * Buscar y filtrar combinados
 */
export const searchAndFilter = (data, query, fields, filters) => {
  let result = data;
  
  // Aplicar búsqueda
  if (query) {
    result = result.filter(item => multiFieldSearch(item, query, fields));
  }
  
  // Aplicar filtros
  if (filters) {
    result = applyFilters(result, filters);
  }
  
  return result;
};

/**
 * Normalizar texto para búsqueda
 */
export const normalizeText = (text) => {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Quitar acentos
    .trim();
};

/**
 * Búsqueda con score (relevancia)
 */
export const searchWithScore = (items, query, fields) => {
  if (!query) return items.map((item, index) => ({ item, score: 0, index }));
  
  const results = items.map((item, index) => {
    let score = 0;
    const normalizedQuery = normalizeText(query);
    
    fields.forEach((field, fieldIndex) => {
      const value = getNestedValue(item, field);
      if (!value) return;
      
      const normalizedValue = normalizeText(String(value));
      
      // Coincidencia exacta: +100 puntos
      if (normalizedValue === normalizedQuery) {
        score += 100;
      }
      // Comienza con query: +50 puntos
      else if (normalizedValue.startsWith(normalizedQuery)) {
        score += 50;
      }
      // Contiene query: +25 puntos
      else if (normalizedValue.includes(normalizedQuery)) {
        score += 25;
      }
      // Fuzzy match: +10 puntos
      else if (fuzzySearch(normalizedValue, normalizedQuery)) {
        score += 10;
      }
      
      // Penalizar campos menos importantes (reducir score según índice del campo)
      score -= fieldIndex * 2;
    });
    
    return { item, score, index };
  });
  
  // Ordenar por relevancia
  return results
    .filter(r => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .map(r => r.item);
};

export default {
  fuzzySearch,
  multiFieldSearch,
  highlightMatch,
  getAutocompleteSuggestions,
  applyFilters,
  sortData,
  searchAndFilter,
  normalizeText,
  searchWithScore
};
