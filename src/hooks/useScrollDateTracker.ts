import { useState, useEffect, useRef, useCallback } from 'react';
import type { NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import type { EntryGroup } from './useHomeState';

interface ScrollDateTracker {
  visibleDate: string;
  onAllEntriesLayout: (y: number) => void;
  onControlsLayout: (height: number) => void;
  onGroupLayout: (date: string, relativeY: number) => void;
  onScroll: (e: NativeSyntheticEvent<NativeScrollEvent>) => void;
}

export function useScrollDateTracker(
  enabled: boolean,
  groups: EntryGroup[],
): ScrollDateTracker {
  const allEntriesOffsetY = useRef(0);
  const groupYOffsetsRef = useRef<{ date: string; y: number }[]>([]);
  const controlsBarHeightRef = useRef(0);
  const [visibleDate, setVisibleDate] = useState('');

  useEffect(() => {
    groupYOffsetsRef.current = [];
  }, [groups]);

  useEffect(() => {
    if (enabled && groups.length > 0) {
      setVisibleDate(groups[0].date);
    }
  }, [enabled, groups]);

  const onGroupLayout = useCallback((date: string, relativeY: number) => {
    const absoluteY = allEntriesOffsetY.current + relativeY;
    const filtered = groupYOffsetsRef.current.filter(g => g.date !== date);
    groupYOffsetsRef.current = [...filtered, { date, y: absoluteY }].sort(
      (a, b) => a.y - b.y,
    );
  }, []);

  const onScroll = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      if (!enabled) return;
      const y = e.nativeEvent.contentOffset.y;
      const offsets = groupYOffsetsRef.current;
      if (offsets.length === 0) return;

      let current = offsets[0].date;
      for (const offset of offsets) {
        if (offset.y <= y + controlsBarHeightRef.current) {
          current = offset.date;
        } else {
          break;
        }
      }
      setVisibleDate(prev => (prev !== current ? current : prev));
    },
    [enabled],
  );

  const onAllEntriesLayout = useCallback((y: number) => {
    allEntriesOffsetY.current = y;
  }, []);

  const onControlsLayout = useCallback((height: number) => {
    controlsBarHeightRef.current = height;
  }, []);

  return { visibleDate, onAllEntriesLayout, onControlsLayout, onGroupLayout, onScroll };
}
