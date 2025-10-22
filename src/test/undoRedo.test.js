import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { useUndoRedo } from '../utils/undoRedo';

describe('useUndoRedo', () => {
  describe('initialization', () => {
    it('should initialize with provided initial state', () => {
      const { result } = renderHook(() => useUndoRedo(0));

      expect(result.current.state).toBe(0);
      expect(result.current.canUndo).toBe(false);
      expect(result.current.canRedo).toBe(false);
    });

    it('should work with object state', () => {
      const { result } = renderHook(() => useUndoRedo({ count: 5 }));

      expect(result.current.state).toEqual({ count: 5 });
    });
  });

  describe('setState', () => {
    it('should update state', () => {
      const { result } = renderHook(() => useUndoRedo(0));

      act(() => {
        result.current.setState(5);
      });

      expect(result.current.state).toBe(5);
    });

    it('should enable undo after state change', () => {
      const { result } = renderHook(() => useUndoRedo(0));

      act(() => {
        result.current.setState(5);
      });

      expect(result.current.canUndo).toBe(true);
    });
  });

  describe('undo', () => {
    it('should undo to previous state', () => {
      const { result, rerender } = renderHook(() => useUndoRedo(0));

      act(() => {
        result.current.setState(5);
      });
      act(() => {
        result.current.setState(10);
      });

      act(() => {
        result.current.undo();
      });
      rerender();

      expect(result.current.state).toBe(5);
    });

    it('should enable redo after undo', () => {
      const { result, rerender } = renderHook(() => useUndoRedo(0));

      act(() => {
        result.current.setState(5);
      });
      rerender();

      act(() => {
        result.current.undo();
      });
      rerender();

      expect(result.current.canRedo).toBe(true);
    });
  });

  describe('redo', () => {
    it('should redo to next state', () => {
      const { result, rerender } = renderHook(() => useUndoRedo(0));

      act(() => {
        result.current.setState(5);
      });
      rerender();

      act(() => {
        result.current.undo();
      });
      rerender();

      act(() => {
        result.current.redo();
      });
      rerender();

      expect(result.current.state).toBe(5);
    });
  });

  describe('clearHistory', () => {
    it('should clear undo/redo history', () => {
      const { result } = renderHook(() => useUndoRedo(0));

      act(() => {
        result.current.setState(5);
        result.current.setState(10);
        result.current.clearHistory();
      });

      expect(result.current.canUndo).toBe(false);
      expect(result.current.historyLength).toBe(1);
    });
  });
});
