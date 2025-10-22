/**
 * 🚀 OPTIMISTIC UPDATES HOOK
 * Nivel: PREMIUM ENTERPRISE
 * Pattern: Optimistic UI Updates
 */
import { useCallback, useState } from 'react';

export function useOptimisticUpdate(mutationFn, options = {}) {
  const [isOptimistic, setIsOptimistic] = useState(false);
  const [error, setError] = useState(null);

  const mutate = useCallback(
    async (optimisticData, actualData) => {
      setIsOptimistic(true);
      setError(null);

      // 1. Aplicar cambio optimista inmediatamente
      if (options.onOptimistic) {
        options.onOptimistic(optimisticData);
      }

      try {
        // 2. Ejecutar mutación real
        const result = await mutationFn(actualData || optimisticData);

        // 3. Confirmar cambio
        if (options.onSuccess) {
          options.onSuccess(result);
        }

        setIsOptimistic(false);
        return result;
      } catch (err) {
        // 4. Revertir en caso de error
        if (options.onError) {
          options.onError(err);
        }

        if (options.onRollback) {
          options.onRollback();
        }

        setError(err);
        setIsOptimistic(false);
        throw err;
      }
    },
    [mutationFn, options]
  );

  return { mutate, isOptimistic, error };
}
