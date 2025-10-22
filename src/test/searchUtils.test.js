import { describe, expect, it } from 'vitest';

import { fuzzySearch, highlightMatch } from '../utils/searchUtils';

describe('searchUtils', () => {
  describe('fuzzySearch', () => {
    it('should return true for exact match', () => {
      expect(fuzzySearch('testing', 'test')).toBe(true);
    });

    it('should be case insensitive', () => {
      expect(fuzzySearch('TESTING', 'test')).toBe(true);
      expect(fuzzySearch('testing', 'TEST')).toBe(true);
    });

    it('should return false for no match', () => {
      expect(fuzzySearch('abc', 'xyz')).toBe(false);
    });

    it('should handle empty query', () => {
      expect(fuzzySearch('testing', '')).toBe(true);
    });

    it('should match characters in fuzzy order', () => {
      expect(fuzzySearch('testing', 'tst')).toBe(true);
      expect(fuzzySearch('testing', 'tin')).toBe(true);
    });
  });

  describe('highlightMatch', () => {
    it('should wrap matching text in <mark> tags', () => {
      const result = highlightMatch('testing here', 'test');
      expect(result).toContain('<mark');
      expect(result).toContain('</mark>');
    });

    it('should be case insensitive', () => {
      const result = highlightMatch('testing', 'TEST');
      expect(result).toContain('<mark');
    });

    it('should return original text if no match', () => {
      expect(highlightMatch('testing', 'xyz')).toBe('testing');
    });

    it('should handle empty query', () => {
      expect(highlightMatch('test', '')).toBe('test');
    });
  });
});
