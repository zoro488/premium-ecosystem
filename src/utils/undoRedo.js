/**
 * ↩️ SISTEMA DE UNDO/REDO
 * Historial de acciones reversibles
 */

import { useState, useCallback, useRef } from 'react';

/**
 * Hook para gestionar historial de estados (Undo/Redo)
 */
export const useUndoRedo = (initialState, maxHistory = 50) => {
  const [state, setState] = useState(initialState);
  const history = useRef([initialState]);
  const currentIndex = useRef(0);
  
  const canUndo = currentIndex.current > 0;
  const canRedo = currentIndex.current < history.current.length - 1;
  
  const updateState = useCallback((newState, skipHistory = false) => {
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
  }, [maxHistory]);
  
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
    currentIndex: currentIndex.current
  };
};

/**
 * Hook para acciones reversibles con descripción
 */
export const useActionHistory = (maxHistory = 30) => {
  const [history, setHistory] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  
  const canUndo = currentIndex >= 0;
  const canRedo = currentIndex < history.length - 1;
  
  const executeAction = useCallback((action) => {
    const { execute, undo: undoFn, description } = action;
    
    // Ejecutar acción
    const result = execute();
    
    // Eliminar acciones futuras si estamos en medio del historial
    const newHistory = currentIndex < history.length - 1
      ? history.slice(0, currentIndex + 1)
      : [...history];
    
    // Agregar nueva acción
    newHistory.push({
      description,
      undo: undoFn,
      result,
      timestamp: new Date()
    });
    
    // Limitar tamaño
    if (newHistory.length > maxHistory) {
      newHistory.shift();
      setCurrentIndex(currentIndex);
    } else {
      setCurrentIndex(currentIndex + 1);
    }
    
    setHistory(newHistory);
    return result;
  }, [history, currentIndex, maxHistory]);
  
  const undo = useCallback(() => {
    if (!canUndo) return;
    
    const action = history[currentIndex];
    if (action.undo) {
      action.undo(action.result);
    }
    setCurrentIndex(currentIndex - 1);
  }, [canUndo, history, currentIndex]);
  
  const redo = useCallback(() => {
    if (!canRedo) return;
    
    const nextIndex = currentIndex + 1;
    const action = history[nextIndex];
    if (action.execute) {
      action.execute();
    }
    setCurrentIndex(nextIndex);
  }, [canRedo, history, currentIndex]);
  
  const clearHistory = useCallback(() => {
    setHistory([]);
    setCurrentIndex(-1);
  }, []);
  
  const getLastAction = useCallback(() => {
    return currentIndex >= 0 ? history[currentIndex] : null;
  }, [history, currentIndex]);
  
  return {
    executeAction,
    undo,
    redo,
    canUndo,
    canRedo,
    clearHistory,
    getLastAction,
    history: history.slice(0, currentIndex + 1),
    historyLength: history.length,
    currentIndex
  };
};

export default { useUndoRedo, useActionHistory };
