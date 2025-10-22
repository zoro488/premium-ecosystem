/**
 * 📜 VIRTUAL SCROLL HOOK
 * Nivel: PERFORMANCE ENTERPRISE
 * Pattern: Windowing / Virtualization
 */
import { useRef } from 'react';

import { useVirtualizer } from '@tanstack/react-virtual';

export function useVirtualScroll(items, options = {}) {
  const parentRef = useRef(null);

  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => options.estimateSize || 50,
    overscan: options.overscan || 5,
  });

  const virtualItems = virtualizer.getVirtualItems();

  return {
    parentRef,
    virtualItems,
    totalSize: virtualizer.getTotalSize(),
    scrollToIndex: virtualizer.scrollToIndex,
    scrollToOffset: virtualizer.scrollToOffset,
  };
}
