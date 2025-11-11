import { describe, expect, it } from 'vitest';

import {
  applyFilters,
  getAutocompleteSuggestions,
  multiFieldSearch,
  sortData,
} from '../utils/searchUtils';

describe('searchUtils - Extended', () => {
  describe('multiFieldSearch', () => {
    const items = [
      { id: 1, name: 'John Doe', email: 'john@example.com', city: 'New York' },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com', city: 'Los Angeles' },
      { id: 3, name: 'Bob Johnson', email: 'bob@example.com', city: 'Chicago' },
    ];

    it('should search across multiple fields', () => {
      const results = items.filter(item => multiFieldSearch(item, 'john', ['name', 'email']));
      expect(results).toHaveLength(2); // John Doe and Bob Johnson
    });

    it('should return all items for empty query', () => {
      const results = items.filter(item => multiFieldSearch(item, '', ['name']));
      expect(results).toHaveLength(3);
    });

    it('should handle case insensitive search', () => {
      const results = items.filter(item => multiFieldSearch(item, 'JANE', ['name']));
      expect(results).toHaveLength(1);
      expect(results[0].name).toBe('Jane Smith');
    });

    it('should return empty array if no matches', () => {
      const results = items.filter(item => multiFieldSearch(item, 'xyz123', ['name', 'email']));
      expect(results).toHaveLength(0);
    });

    it('should handle nested fields', () => {
      const nestedItems = [
        { id: 1, user: { name: 'John' } },
        { id: 2, user: { name: 'Jane' } },
      ];
      const results = nestedItems.filter(item => multiFieldSearch(item, 'john', ['user.name']));
      expect(results).toHaveLength(1);
    });
  });

  describe('getAutocompleteSuggestions', () => {
    const items = [
      { name: 'Apple', category: 'Fruit' },
      { name: 'Banana', category: 'Fruit' },
      { name: 'Apricot', category: 'Fruit' },
      { name: 'Carrot', category: 'Vegetable' },
    ];

    it('should return matching suggestions', () => {
      const suggestions = getAutocompleteSuggestions(items, 'app', ['name']);
      expect(suggestions).toContain('Apple');
      // 'Apricot' doesn't match 'app' with fuzzy search (a-p-r vs a-p-p)
      expect(suggestions.length).toBeGreaterThanOrEqual(1);
    });

    it('should limit suggestions to maxSuggestions', () => {
      const suggestions = getAutocompleteSuggestions(items, 'a', ['name', 'category'], 2);
      expect(suggestions.length).toBeLessThanOrEqual(2);
    });

    it('should return empty array for queries less than 2 chars', () => {
      const suggestions = getAutocompleteSuggestions(items, 'a', ['name']);
      expect(suggestions).toHaveLength(0);
    });

    it('should return empty array for empty query', () => {
      const suggestions = getAutocompleteSuggestions(items, '', ['name']);
      expect(suggestions).toHaveLength(0);
    });

    it('should return unique suggestions', () => {
      const duplicateItems = [{ name: 'Apple' }, { name: 'Apple' }, { name: 'Apricot' }];
      const suggestions = getAutocompleteSuggestions(duplicateItems, 'ap', ['name']);
      expect(suggestions.length).toBeLessThanOrEqual(2); // No duplicates
    });
  });

  describe('applyFilters', () => {
    const data = [
      { id: 1, estado: 'activo', fecha: new Date('2025-10-01') },
      { id: 2, estado: 'inactivo', fecha: new Date('2025-09-01') },
      { id: 3, estado: 'activo', fecha: new Date('2025-10-15') },
    ];

    it('should filter by status', () => {
      const filtered = applyFilters(data, { status: 'activo' });
      expect(filtered).toHaveLength(2);
      expect(filtered.every((item) => item.estado === 'activo')).toBe(true);
    });

    it('should return all items when status is "todos"', () => {
      const filtered = applyFilters(data, { status: 'todos' });
      expect(filtered).toHaveLength(3);
    });

    it('should handle date range filters', () => {
      const filtered = applyFilters(data, { dateRange: 'mes' });
      expect(filtered.length).toBeGreaterThan(0);
    });

    it('should return original data for no filters', () => {
      const filtered = applyFilters(data, {});
      expect(filtered).toHaveLength(3);
    });

    it('should handle combined filters', () => {
      const filtered = applyFilters(data, {
        status: 'activo',
        dateRange: 'mes',
      });
      expect(filtered.every((item) => item.estado === 'activo')).toBe(true);
    });
  });

  describe('sortData', () => {
    const data = [
      { nombre: 'Charlie', age: 30, fecha: new Date('2025-01-15'), total: 150 },
      { nombre: 'Alice', age: 25, fecha: new Date('2025-03-20'), total: 100 },
      { nombre: 'Bob', age: 35, fecha: new Date('2025-02-10'), total: 200 },
    ];

    it('should sort by name ascending', () => {
      const sorted = sortData(data, 'alfabetico');
      expect(sorted[0].nombre).toBe('Alice');
      expect(sorted[2].nombre).toBe('Charlie');
    });

    it('should sort by recent date', () => {
      const sorted = sortData(data, 'reciente');
      expect(sorted[0].fecha.getMonth()).toBe(2); // March (most recent)
      expect(sorted[2].fecha.getMonth()).toBe(0); // January (oldest)
    });

    it('should sort by oldest date', () => {
      const sorted = sortData(data, 'antiguo');
      expect(sorted[0].fecha.getMonth()).toBe(0); // January
      expect(sorted[2].fecha.getMonth()).toBe(2); // March
    });

    it('should sort by amount descending', () => {
      const sorted = sortData(data, 'mayor');
      expect(sorted[0].total).toBe(200);
      expect(sorted[2].total).toBe(100);
    });

    it('should return copy of array', () => {
      const sorted = sortData(data, 'alfabetico');
      expect(sorted).not.toBe(data);
    });
  });
});
