import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useActionHistory } from '../utils/undoRedo';

describe('useActionHistory', () => {
  beforeEach(() => {
    // Reset any state if needed
  });

  describe('initialization', () => {
    it('should initialize with empty history', () => {
      const { result } = renderHook(() => useActionHistory());
      
      expect(result.current.history).toHaveLength(0);
      expect(result.current.currentIndex).toBe(-1);
      expect(result.current.canUndo).toBe(false);
      expect(result.current.canRedo).toBe(false);
    });

    it('should accept custom maxHistory', () => {
      const { result } = renderHook(() => useActionHistory(10));
      
      expect(result.current.historyLength).toBe(0);
    });
  });

  describe('executeAction', () => {
    it('should execute action and add to history', () => {
      const { result } = renderHook(() => useActionHistory());
      
      let value = 0;
      const action = {
        execute: () => { value = 10; return value; },
        undo: () => { value = 0; },
        description: 'Set value to 10'
      };

      act(() => {
        result.current.executeAction(action);
      });

      expect(value).toBe(10);
      expect(result.current.history).toHaveLength(1);
      expect(result.current.currentIndex).toBe(0);
      expect(result.current.canUndo).toBe(true);
    });

    it('should store action description', () => {
      const { result } = renderHook(() => useActionHistory());
      
      const action = {
        execute: () => 'result',
        undo: () => {},
        description: 'Test action'
      };

      act(() => {
        result.current.executeAction(action);
      });

      const lastAction = result.current.getLastAction();
      expect(lastAction.description).toBe('Test action');
    });

    it('should clear future actions when executing in middle of history', () => {
      const { result } = renderHook(() => useActionHistory());
      
      // Execute 3 actions
      act(() => {
        result.current.executeAction({
          execute: () => 1,
          undo: () => {},
          description: 'Action 1'
        });
        result.current.executeAction({
          execute: () => 2,
          undo: () => {},
          description: 'Action 2'
        });
        result.current.executeAction({
          execute: () => 3,
          undo: () => {},
          description: 'Action 3'
        });
      });

      // Undo twice
      act(() => {
        result.current.undo();
        result.current.undo();
      });

      expect(result.current.currentIndex).toBe(0);

      // Execute new action - should clear actions 2 and 3
      act(() => {
        result.current.executeAction({
          execute: () => 4,
          undo: () => {},
          description: 'Action 4'
        });
      });

      expect(result.current.history).toHaveLength(2);
    });

    it('should limit history to maxHistory', () => {
      const { result } = renderHook(() => useActionHistory(3));
      
      // Execute 5 actions
      act(() => {
        for (let i = 0; i < 5; i++) {
          result.current.executeAction({
            execute: () => i,
            undo: () => {},
            description: `Action ${i}`
          });
        }
      });

      expect(result.current.historyLength).toBeLessThanOrEqual(3);
    });
  });

  describe('undo', () => {
    it('should undo last action', () => {
      const { result } = renderHook(() => useActionHistory());
      
      let value = 0;
      const action = {
        execute: () => { value = 10; return value; },
        undo: (prevValue) => { value = 0; },
        description: 'Increment'
      };

      act(() => {
        result.current.executeAction(action);
      });

      expect(value).toBe(10);

      act(() => {
        result.current.undo();
      });

      expect(value).toBe(0);
      expect(result.current.currentIndex).toBe(-1);
    });

    it('should not undo when canUndo is false', () => {
      const { result } = renderHook(() => useActionHistory());
      
      const initialIndex = result.current.currentIndex;

      act(() => {
        result.current.undo();
      });

      expect(result.current.currentIndex).toBe(initialIndex);
    });

    it('should allow multiple undos', () => {
      const { result } = renderHook(() => useActionHistory());
      
      let value = 0;

      // Execute 3 actions
      act(() => {
        result.current.executeAction({
          execute: () => { value += 1; return value; },
          undo: () => { value -= 1; },
          description: 'Add 1'
        });
        result.current.executeAction({
          execute: () => { value += 1; return value; },
          undo: () => { value -= 1; },
          description: 'Add 1'
        });
        result.current.executeAction({
          execute: () => { value += 1; return value; },
          undo: () => { value -= 1; },
          description: 'Add 1'
        });
      });

      expect(value).toBe(3);

      // Undo all
      act(() => {
        result.current.undo();
        result.current.undo();
        result.current.undo();
      });

      expect(value).toBe(0);
      expect(result.current.canUndo).toBe(false);
    });
  });

  describe('redo', () => {
    it('should redo undone action', () => {
      const { result } = renderHook(() => useActionHistory());
      
      let value = 0;
      const action = {
        execute: () => { value = 10; return value; },
        undo: () => { value = 0; },
        description: 'Set to 10'
      };

      act(() => {
        result.current.executeAction(action);
        result.current.undo();
      });

      expect(value).toBe(0);
      expect(result.current.canRedo).toBe(true);

      act(() => {
        result.current.redo();
      });

      expect(result.current.currentIndex).toBe(0);
    });

    it('should not redo when canRedo is false', () => {
      const { result } = renderHook(() => useActionHistory());
      
      const initialIndex = result.current.currentIndex;

      act(() => {
        result.current.redo();
      });

      expect(result.current.currentIndex).toBe(initialIndex);
    });
  });

  describe('clearHistory', () => {
    it('should clear all history', () => {
      const { result } = renderHook(() => useActionHistory());
      
      // Execute some actions
      act(() => {
        result.current.executeAction({
          execute: () => 1,
          undo: () => {},
          description: 'Action 1'
        });
        result.current.executeAction({
          execute: () => 2,
          undo: () => {},
          description: 'Action 2'
        });
      });

      expect(result.current.history).toHaveLength(2);

      act(() => {
        result.current.clearHistory();
      });

      expect(result.current.history).toHaveLength(0);
      expect(result.current.currentIndex).toBe(-1);
      expect(result.current.canUndo).toBe(false);
      expect(result.current.canRedo).toBe(false);
    });
  });

  describe('getLastAction', () => {
    it('should return null when no actions', () => {
      const { result } = renderHook(() => useActionHistory());
      
      expect(result.current.getLastAction()).toBeNull();
    });

    it('should return last executed action', () => {
      const { result } = renderHook(() => useActionHistory());
      
      act(() => {
        result.current.executeAction({
          execute: () => 1,
          undo: () => {},
          description: 'First action'
        });
        result.current.executeAction({
          execute: () => 2,
          undo: () => {},
          description: 'Second action'
        });
      });

      const lastAction = result.current.getLastAction();
      expect(lastAction.description).toBe('Second action');
    });

    it('should return correct action after undo', () => {
      const { result } = renderHook(() => useActionHistory());
      
      act(() => {
        result.current.executeAction({
          execute: () => 1,
          undo: () => {},
          description: 'First action'
        });
        result.current.executeAction({
          execute: () => 2,
          undo: () => {},
          description: 'Second action'
        });
        result.current.undo();
      });

      const lastAction = result.current.getLastAction();
      expect(lastAction.description).toBe('First action');
    });
  });

  describe('action timestamps', () => {
    it('should store timestamp for each action', () => {
      const { result } = renderHook(() => useActionHistory());
      
      const before = new Date();

      act(() => {
        result.current.executeAction({
          execute: () => 'test',
          undo: () => {},
          description: 'Test action'
        });
      });

      const after = new Date();
      const lastAction = result.current.getLastAction();
      
      expect(lastAction.timestamp).toBeInstanceOf(Date);
      expect(lastAction.timestamp.getTime()).toBeGreaterThanOrEqual(before.getTime());
      expect(lastAction.timestamp.getTime()).toBeLessThanOrEqual(after.getTime());
    });
  });
});
