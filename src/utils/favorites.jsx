/**
 * ⭐ SISTEMA DE FAVORITOS / BOOKMARKS
 * Marcar y acceder rápidamente a items importantes
 */
import { useCallback, useEffect, useState } from 'react';

import { Star } from 'lucide-react';

/**
 * Hook para gestionar favoritos
 */
export const useFavorites = (storageKey = 'flowdistributor_favorites') => {
  const [favorites, setFavorites] = useState(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      return stored
        ? JSON.parse(stored)
        : {
            clients: [],
            products: [],
            distributors: [],
            sales: [],
            orders: [],
          };
    } catch {
      return {
        clients: [],
        products: [],
        distributors: [],
        sales: [],
        orders: [],
      };
    }
  });

  // Guardar en localStorage cuando cambien
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(favorites));
    } catch (error) {
      // console.error('Error saving favorites:', error);
    }
  }, [favorites, storageKey]);

  const isFavorite = useCallback(
    (type, id) => {
      return favorites[type]?.includes(id) || false;
    },
    [favorites]
  );

  const toggleFavorite = useCallback((type, id) => {
    setFavorites((prev) => {
      const current = prev[type] || [];
      const isFav = current.includes(id);

      return {
        ...prev,
        [type]: isFav ? current.filter((fId) => fId !== id) : [...current, id],
      };
    });
  }, []);

  const addFavorite = useCallback((type, id) => {
    setFavorites((prev) => ({
      ...prev,
      [type]: [...new Set([...(prev[type] || []), id])],
    }));
  }, []);

  const removeFavorite = useCallback((type, id) => {
    setFavorites((prev) => ({
      ...prev,
      [type]: (prev[type] || []).filter((fId) => fId !== id),
    }));
  }, []);

  const clearFavorites = useCallback((type) => {
    if (type) {
      setFavorites((prev) => ({ ...prev, [type]: [] }));
    } else {
      setFavorites({
        clients: [],
        products: [],
        distributors: [],
        sales: [],
        orders: [],
      });
    }
  }, []);

  const getFavoriteCount = useCallback(
    (type) => {
      return type
        ? favorites[type]?.length || 0
        : Object.values(favorites).reduce((sum, arr) => sum + arr.length, 0);
    },
    [favorites]
  );

  return {
    favorites,
    isFavorite,
    toggleFavorite,
    addFavorite,
    removeFavorite,
    clearFavorites,
    getFavoriteCount,
  };
};

/**
 * Componente de botón de favorito
 */
export const FavoriteButton = ({ type, id, isFavorite, onToggle, className = '' }) => {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = (e) => {
    e.stopPropagation();
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 600);
    onToggle(type, id);
  };

  return (
    <button
      onClick={handleClick}
      className={`p-2 hover:bg-white/10 rounded-lg transition-all ${className} ${
        isAnimating ? 'scale-125' : ''
      }`}
      title={isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
    >
      <Star
        className={`w-5 h-5 transition-all ${
          isFavorite ? 'fill-yellow-400 text-yellow-400' : 'text-slate-400 hover:text-yellow-400'
        } ${isAnimating ? 'animate-pulse' : ''}`}
      />
    </button>
  );
};

export default { useFavorites, FavoriteButton };
