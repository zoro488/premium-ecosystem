/**
 * ↩️ SISTEMA DE UNDO/REDO
 * Historial de acciones reversibles
 */
import { useCallback, useRef, useState } from 'react';

/**
 * Hook para gestionar historial de estados (Undo/Redo)
 */
export const useUndoRedo = (initialState, maxHistory = 50) => {
  const [state, setState] = useState(initialState);
  const history = useRef([initialState]);
  const currentIndex = useRef(0);

  const canUndo = currentIndex.current > 0;
  const canRedo = currentIndex.current < history.current.length - 1;

  const updateState = useCallback(
    (newState, skipHistory = false) => {
      if (skipHistory) {
        setState(newState);
        return;
      }

      // Eliminar estados futuros si estamos en medio del historial
      if (currentIndex.current < history.current.length - 1) {
        history.current = history.current.slice(0, currentIndex.current + 1);
      }

      // Agregar nuevo estado
      history.current.push(newState);

      // Limitar tamaño del historial
      if (history.current.length > maxHistory) {
        history.current.shift();
      } else {
        currentIndex.current++;
      }

      setState(newState);
    },
    [maxHistory]
  );

  const undo = useCallback(() => {
    if (!canUndo) return;

    currentIndex.current--;
    setState(history.current[currentIndex.current]);
  }, [canUndo]);

  const redo = useCallback(() => {
    if (!canRedo) return;

    currentIndex.current++;
    setState(history.current[currentIndex.current]);
  }, [canRedo]);

  const clearHistory = useCallback(() => {
    history.current = [state];
    currentIndex.current = 0;
  }, [state]);

  return {
    state,
    setState: updateState,
    undo,
    redo,
    canUndo,
    canRedo,
    clearHistory,
    historyLength: history.current.length,
    currentIndex: currentIndex.current,
  };
};

/**
 * Hook para acciones reversibles con descripción
 */
export const useActionHistory = (maxHistory = 30) => {
  const [state, setState] = useState({
    history: [],
    currentIndex: -1,
  });

  const { history, currentIndex } = state;
  const canUndo = currentIndex >= 0;
  const canRedo = currentIndex < history.length - 1;

  // Método simple para agregar una acción al historial
  const addAction = useCallback(
    (description, data = {}) => {
      setState((prevState) => {
        const action = {
          description,
          data,
          timestamp: new Date().toISOString(),
        };

        // Eliminar acciones futuras si estamos en medio del historial
        const newHistory =
          prevState.currentIndex < prevState.history.length - 1
            ? prevState.history.slice(0, prevState.currentIndex + 1)
            : [...prevState.history];

        // Agregar nueva acción
        newHistory.push(action);

        // Limitar tamaño
        if (newHistory.length > maxHistory) {
          newHistory.shift();
          return { history: newHistory, currentIndex: maxHistory - 1 };
        }
        return { history: newHistory, currentIndex: newHistory.length - 1 };
      });
    },
    [maxHistory]
  );

  const executeAction = useCallback(
    (action) => {
      const { execute, undo: undoFn, description } = action;

      // Ejecutar acción
      const result = execute();

      setState((prevState) => {
        const actionEntry = {
          description,
          undo: undoFn,
          result,
          timestamp: new Date().toISOString(),
        };

        // Eliminar acciones futuras si estamos en medio del historial
        const newHistory =
          prevState.currentIndex < prevState.history.length - 1
            ? prevState.history.slice(0, prevState.currentIndex + 1)
            : [...prevState.history];

        // Agregar nueva acción
        newHistory.push(actionEntry);

        // Limitar tamaño
        if (newHistory.length > maxHistory) {
          newHistory.shift();
          return { history: newHistory, currentIndex: maxHistory - 1 };
        }
        return { history: newHistory, currentIndex: newHistory.length - 1 };
      });

      return result;
    },
    [maxHistory]
  );

  const undo = useCallback(() => {
    setState((prevState) => {
      if (prevState.currentIndex < 0) return prevState;

      const action = prevState.history[prevState.currentIndex];
      if (action && action.undo) {
        action.undo(action.result);
      }
      return { ...prevState, currentIndex: prevState.currentIndex - 1 };
    });
  }, []);

  const redo = useCallback(() => {
    setState((prevState) => {
      if (prevState.currentIndex >= prevState.history.length - 1) return prevState;

      const nextIndex = prevState.currentIndex + 1;
      const action = prevState.history[nextIndex];
      if (action && action.execute) {
        action.execute();
      }
      return { ...prevState, currentIndex: nextIndex };
    });
  }, []);

  const clearHistory = useCallback(() => {
    setState({ history: [], currentIndex: -1 });
  }, []);

  const getLastAction = useCallback(() => {
    return currentIndex >= 0 ? history[currentIndex] : null;
  }, [history, currentIndex]);

  return {
    addAction,
    executeAction,
    undo,
    redo,
    canUndo,
    canRedo,
    clearHistory,
    getLastAction,
    history: history.slice(0, currentIndex + 1),
    historyLength: history.length,
    currentIndex,
  };
};

export default { useUndoRedo, useActionHistory };
