import React, { useState, useEffect, useRef } from 'react';
import { View, TouchableOpacity, TextInput } from 'react-native';
import { Menu, LayoutGrid, BookOpen, Search } from 'lucide-react-native';
import type { JournalLayout } from '../../../store/journalViewStore';

interface ChipProps {
  active: boolean;
  onPress: () => void;
  icon: (color: string) => React.ReactNode;
  isDark: boolean;
}

function ToggleChip({ active, onPress, icon, isDark }: ChipProps) {
  const bg = active ? '#1e40af' : isDark ? '#1e293b' : '#f1f5f9';
  const color = active ? '#fff' : isDark ? '#94a3b8' : '#6b7280';
  return (
    <TouchableOpacity
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingHorizontal: 8,
        height: 28,
        borderRadius: 7,
        backgroundColor: bg,
      }}
      onPress={onPress}
    >
      {icon(color)}
    </TouchableOpacity>
  );
}

interface ControlsBarProps {
  showAll: boolean;
  onToggleAll: () => void;
  layout: JournalLayout;
  onLayoutChange: (layout: JournalLayout) => void;
  isDark: boolean;
  onSearch: (query: string) => void;
}

export default function ControlsBar({
  showAll,
  onToggleAll,
  layout,
  onLayoutChange,
  isDark,
  onSearch,
}: ControlsBarProps) {
  const [inputValue, setInputValue] = useState('');
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      onSearch(inputValue.trim());
    }, 1000);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [inputValue, onSearch]);

  return (
    <View className="flex-row items-center gap-2 p-4 bg-slate-50 dark:bg-slate-950">
      <ToggleChip
        active={showAll}
        onPress={onToggleAll}
        icon={color => <BookOpen size={13} color={color} />}
        isDark={isDark}
      />

      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          alignItems: 'center',
          height: 28,
          borderRadius: 7,
          backgroundColor: isDark ? '#1e293b' : '#f1f5f9',
          paddingHorizontal: 8,
          gap: 4,
        }}
      >
        <Search size={12} color={isDark ? '#94a3b8' : '#6b7280'} />
        <TextInput
          value={inputValue}
          onChangeText={setInputValue}
          maxLength={15}
          placeholder="Search..."
          placeholderTextColor={isDark ? '#64748b' : '#9ca3af'}
          style={{
            flex: 1,
            fontSize: 12,
            color: isDark ? '#f1f5f9' : '#1e293b',
            padding: 0,
          }}
        />
      </View>

      <ToggleChip
        active={layout === 'list'}
        onPress={() => onLayoutChange('list')}
        icon={color => <Menu size={13} color={color} />}
        isDark={isDark}
      />

      <ToggleChip
        active={layout === 'grid'}
        onPress={() => onLayoutChange('grid')}
        icon={color => <LayoutGrid size={13} color={color} />}
        isDark={isDark}
      />
    </View>
  );
}
