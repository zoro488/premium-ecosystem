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
      const results = multiFieldSearch(items, 'john', ['name', 'email']);
      expect(results).toHaveLength(2); // John Doe and Bob Johnson
    });

    it('should return all items for empty query', () => {
      const results = multiFieldSearch(items, '', ['name']);
      expect(results).toHaveLength(3);
    });

    it('should handle case insensitive search', () => {
      const results = multiFieldSearch(items, 'JANE', ['name']);
      expect(results).toHaveLength(1);
      expect(results[0].name).toBe('Jane Smith');
    });

    it('should return empty array if no matches', () => {
      const results = multiFieldSearch(items, 'xyz123', ['name', 'email']);
      expect(results).toHaveLength(0);
    });

    it('should handle nested fields', () => {
      const nestedItems = [
        { id: 1, user: { name: 'John' } },
        { id: 2, user: { name: 'Jane' } },
      ];
      const results = multiFieldSearch(nestedItems, 'john', ['user.name']);
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
      expect(suggestions).toContain('Apricot');
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
      { name: 'Charlie', age: 30, date: new Date('2025-01-15') },
      { name: 'Alice', age: 25, date: new Date('2025-03-20') },
      { name: 'Bob', age: 35, date: new Date('2025-02-10') },
    ];

    it('should sort by name ascending', () => {
      const sorted = sortData(data, 'name');
      expect(sorted[0].name).toBe('Alice');
      expect(sorted[2].name).toBe('Charlie');
    });

    it('should sort by name descending', () => {
      const sorted = sortData(data, '-name');
      expect(sorted[0].name).toBe('Charlie');
      expect(sorted[2].name).toBe('Alice');
    });

    it('should sort by numeric field', () => {
      const sorted = sortData(data, 'age');
      expect(sorted[0].age).toBe(25);
      expect(sorted[2].age).toBe(35);
    });

    it('should sort by date field', () => {
      const sorted = sortData(data, 'date');
      expect(sorted[0].date.getMonth()).toBe(0); // January
    });

    it('should return copy of array', () => {
      const sorted = sortData(data, 'name');
      expect(sorted).not.toBe(data);
    });
  });
});
