import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';

import { useFavorites } from '../utils/favorites';

describe('useFavorites - Extended Coverage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('custom storage key', () => {
    it('should use custom storage key', () => {
      const { result } = renderHook(() => useFavorites('custom_key'));

      act(() => {
        result.current.addFavorite('clients', { id: 1, name: 'Test' });
      });

      const stored = localStorage.getItem('custom_key');
      expect(stored).toBeTruthy();
    });

    it('should load from custom storage key', () => {
      const savedData = {
        clients: [{ id: 1, name: 'Saved Client' }],
        products: [],
        distributors: [],
        sales: [],
        orders: [],
      };
      localStorage.setItem('custom_favorites', JSON.stringify(savedData));

      const { result } = renderHook(() => useFavorites('custom_favorites'));

      expect(result.current.favorites.clients).toHaveLength(1);
      expect(result.current.favorites.clients[0].name).toBe('Saved Client');
    });
  });

  describe('addFavorite', () => {
    it('should add item to favorites', () => {
      const { result } = renderHook(() => useFavorites());

      const item = { id: 1, name: 'New Item' };

      act(() => {
        result.current.addFavorite('clients', item);
      });

      expect(result.current.favorites.clients).toContainEqual(item);
    });

    it('should not add duplicate items', () => {
      const { result } = renderHook(() => useFavorites());

      const item = { id: 1, name: 'Item' };

      act(() => {
        result.current.addFavorite('clients', item);
        result.current.addFavorite('clients', item);
      });

      expect(result.current.favorites.clients).toHaveLength(1);
    });

    it('should add to different types independently', () => {
      const { result } = renderHook(() => useFavorites());

      act(() => {
        result.current.addFavorite('products', { id: 1, name: 'Product' });
        result.current.addFavorite('distributors', { id: 2, name: 'Distributor' });
        result.current.addFavorite('sales', { id: 3, name: 'Sale' });
      });

      expect(result.current.favorites.products).toHaveLength(1);
      expect(result.current.favorites.distributors).toHaveLength(1);
      expect(result.current.favorites.sales).toHaveLength(1);
    });
  });

  describe('removeFavorite', () => {
    it('should remove item from favorites', () => {
      const { result } = renderHook(() => useFavorites());

      const item = { id: 1, name: 'Item' };

      act(() => {
        result.current.addFavorite('clients', item);
      });

      expect(result.current.favorites.clients).toHaveLength(1);

      act(() => {
        result.current.removeFavorite('clients', 1);
      });

      expect(result.current.favorites.clients).toHaveLength(0);
    });

    it('should not fail when removing non-existent item', () => {
      const { result } = renderHook(() => useFavorites());

      act(() => {
        result.current.removeFavorite('clients', 999);
      });

      expect(result.current.favorites.clients).toHaveLength(0);
    });

    it('should only remove from specified type', () => {
      const { result } = renderHook(() => useFavorites());

      act(() => {
        result.current.addFavorite('clients', { id: 1 });
        result.current.addFavorite('products', { id: 1 });
      });

      act(() => {
        result.current.removeFavorite('clients', 1);
      });

      expect(result.current.favorites.clients).toHaveLength(0);
      expect(result.current.favorites.products).toHaveLength(1);
    });

    it('should remove correct item by id', () => {
      const { result } = renderHook(() => useFavorites());

      act(() => {
        result.current.addFavorite('clients', { id: 1, name: 'First' });
        result.current.addFavorite('clients', { id: 2, name: 'Second' });
        result.current.addFavorite('clients', { id: 3, name: 'Third' });
      });

      act(() => {
        result.current.removeFavorite('clients', 2);
      });

      expect(result.current.favorites.clients).toHaveLength(2);
      expect(result.current.favorites.clients.find((c) => c.id === 2)).toBeUndefined();
      expect(result.current.favorites.clients.find((c) => c.id === 1)).toBeTruthy();
      expect(result.current.favorites.clients.find((c) => c.id === 3)).toBeTruthy();
    });
  });

  describe('localStorage persistence', () => {
    it('should save favorites to localStorage on add', () => {
      const { result } = renderHook(() => useFavorites());

      act(() => {
        result.current.addFavorite('clients', { id: 1, name: 'Test' });
      });

      const stored = localStorage.getItem('flowdistributor_favorites');
      expect(stored).toBeTruthy();

      const parsed = JSON.parse(stored);
      expect(parsed.clients).toHaveLength(1);
    });

    it('should save favorites to localStorage on remove', () => {
      const { result } = renderHook(() => useFavorites());

      act(() => {
        result.current.addFavorite('clients', { id: 1 });
        result.current.addFavorite('clients', { id: 2 });
      });

      act(() => {
        result.current.removeFavorite('clients', 1);
      });

      const stored = localStorage.getItem('flowdistributor_favorites');
      const parsed = JSON.parse(stored);
      expect(parsed.clients).toHaveLength(1);
      expect(parsed.clients[0].id).toBe(2);
    });

    it('should persist complex objects', () => {
      const { result } = renderHook(() => useFavorites());

      const complexItem = {
        id: 1,
        name: 'Test',
        metadata: {
          created: '2025-01-01',
          tags: ['important', 'urgent'],
        },
      };

      act(() => {
        result.current.addFavorite('clients', complexItem);
      });

      const stored = localStorage.getItem('flowdistributor_favorites');
      const parsed = JSON.parse(stored);

      expect(parsed.clients[0]).toEqual(complexItem);
    });
  });

  describe('error handling', () => {
    it('should handle invalid localStorage data', () => {
      localStorage.setItem('flowdistributor_favorites', 'invalid json');

      const { result } = renderHook(() => useFavorites());

      expect(result.current.favorites).toBeTruthy();
      expect(result.current.favorites.clients).toEqual([]);
    });

    it('should handle missing type in favorites', () => {
      const { result } = renderHook(() => useFavorites());

      act(() => {
        result.current.addFavorite('newType', { id: 1 });
      });

      expect(result.current.favorites).toHaveProperty('newType');
    });

    it('should handle null localStorage', () => {
      localStorage.removeItem('flowdistributor_favorites');

      const { result } = renderHook(() => useFavorites());

      expect(result.current.favorites.clients).toEqual([]);
    });
  });

  describe('multiple items management', () => {
    it('should handle adding multiple items', () => {
      const { result } = renderHook(() => useFavorites());

      const items = [
        { id: 1, name: 'Item 1' },
        { id: 2, name: 'Item 2' },
        { id: 3, name: 'Item 3' },
      ];

      act(() => {
        items.forEach((item) => {
          result.current.addFavorite('clients', item);
        });
      });

      expect(result.current.favorites.clients).toHaveLength(3);
    });

    it('should maintain order of favorites', () => {
      const { result } = renderHook(() => useFavorites());

      act(() => {
        result.current.addFavorite('clients', { id: 1, name: 'First' });
        result.current.addFavorite('clients', { id: 2, name: 'Second' });
        result.current.addFavorite('clients', { id: 3, name: 'Third' });
      });

      expect(result.current.favorites.clients[0].name).toBe('First');
      expect(result.current.favorites.clients[1].name).toBe('Second');
      expect(result.current.favorites.clients[2].name).toBe('Third');
    });
  });

  describe('type safety', () => {
    it('should handle all supported types', () => {
      const { result } = renderHook(() => useFavorites());

      const types = ['clients', 'products', 'distributors', 'sales', 'orders'];

      act(() => {
        types.forEach((type, index) => {
          result.current.addFavorite(type, { id: index + 1 });
        });
      });

      types.forEach((type) => {
        expect(result.current.favorites[type]).toHaveLength(1);
      });
    });
  });
});
