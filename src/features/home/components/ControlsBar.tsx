import React, { useState, useEffect, useRef } from 'react';
import { View, TouchableOpacity, TextInput } from 'react-native';
import { Menu, LayoutGrid, BookOpen, Search, X } from 'lucide-react-native';
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
        paddingHorizontal: 8,
        height: 30,
        borderRadius: 6,
        backgroundColor: bg,
      }}
      onPress={onPress}
      className='items-center justify-center'
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
    }, 600);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [inputValue, onSearch]);

  const handleClear = () => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    setInputValue('');
    onSearch('');
  };

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }} className="p-4">
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
          height: 32,
          borderRadius: 10,
          backgroundColor: isDark ? '#1e293b' : '#f1f5f9',
          paddingHorizontal: 10,
          gap: 6,
          borderWidth: 1,
          borderColor: isDark ? '#0f172a' : '#e2e8f0',
        }}
      >
        <Search size={12} color={isDark ? '#94a3b8' : '#6b7280'} />
        <TextInput
          value={inputValue}
          onChangeText={setInputValue}
          maxLength={30}
          placeholder="Search..."
          placeholderTextColor={isDark ? '#64748b' : '#9ca3af'}
          style={{
            flex: 1,
            fontSize: 12,
            color: isDark ? '#f1f5f9' : '#1e293b',
            padding: 0,
          }}
        />
        {inputValue.length > 0 && (
          <TouchableOpacity
            onPress={handleClear}
            hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
          >
            <View
              style={{
                width: 14,
                height: 14,
                borderRadius: 7,
                backgroundColor: isDark ? '#475569' : '#cbd5e1',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <X size={8} color={isDark ? '#94a3b8' : '#6b7280'} />
            </View>
          </TouchableOpacity>
        )}
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
