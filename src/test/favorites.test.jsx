import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useFavorites } from '../utils/favorites';

describe('useFavorites', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('initialization', () => {
    it('should initialize with empty favorites object', () => {
      const { result } = renderHook(() => useFavorites('test_favorites'));

      expect(result.current.favorites).toBeDefined();
      expect(result.current.favorites.clients).toEqual([]);
      expect(result.current.favorites.products).toEqual([]);
    });

    it('should initialize favorites object with all types', () => {
      const { result } = renderHook(() => useFavorites('test_types'));

      expect(result.current.favorites).toHaveProperty('clients');
      expect(result.current.favorites).toHaveProperty('products');
      expect(result.current.favorites).toHaveProperty('distributors');
      expect(result.current.favorites).toHaveProperty('sales');
      expect(result.current.favorites).toHaveProperty('orders');
    });
  });

  describe('toggleFavorite', () => {
    it('should add item when not favorite', () => {
      const { result } = renderHook(() => useFavorites('test_favorites'));

      act(() => {
        result.current.toggleFavorite('products', 1);
      });

      expect(result.current.isFavorite('products', 1)).toBe(true);
    });

    it('should remove item when already favorite', () => {
      const { result } = renderHook(() => useFavorites('test_favorites'));

      act(() => {
        result.current.toggleFavorite('products', 1);
      });
      expect(result.current.isFavorite('products', 1)).toBe(true);

      act(() => {
        result.current.toggleFavorite('products', 1);
      });
      expect(result.current.isFavorite('products', 1)).toBe(false);
    });
  });

  describe('isFavorite', () => {
    it('should return true for favorite items', () => {
      const { result } = renderHook(() => useFavorites('test_favorites'));

      act(() => {
        result.current.addFavorite('clients', 5);
      });

      expect(result.current.isFavorite('clients', 5)).toBe(true);
    });

    it('should return false for non-favorite items', () => {
      const { result } = renderHook(() => useFavorites('test_favorites'));

      expect(result.current.isFavorite('clients', 999)).toBe(false);
    });
  });
});
