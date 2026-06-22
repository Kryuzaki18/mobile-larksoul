import React, { useState, useEffect, useRef } from 'react';
import { View, TouchableOpacity, TextInput } from 'react-native';
import { Menu, LayoutGrid, BookOpen, Search, X } from 'lucide-react-native';
import type { JournalLayout } from '../../../store/journalViewStore';
import { Colors } from '../../../utils/colors';

interface ChipProps {
  active: boolean;
  onPress: () => void;
  icon: (color: string) => React.ReactNode;
  isDark: boolean;
}

function ToggleChip({ active, onPress, icon, isDark }: ChipProps) {
  const bg = active ? Colors.blue800 : isDark ? Colors.slate800 : Colors.slate100;
  const color = active ? Colors.white : isDark ? Colors.slate400 : Colors.gray500;
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
          backgroundColor: isDark ? Colors.slate800 : Colors.slate100,
          paddingHorizontal: 10,
          gap: 6,
          borderWidth: 1,
          borderColor: isDark ? Colors.slate900 : Colors.slate200,
        }}
      >
        <Search size={12} color={isDark ? Colors.slate400 : Colors.gray500} />
        <TextInput
          value={inputValue}
          onChangeText={setInputValue}
          maxLength={30}
          placeholder="Search..."
          placeholderTextColor={isDark ? Colors.slate500 : Colors.gray400}
          style={{
            flex: 1,
            fontSize: 12,
            color: isDark ? Colors.slate100 : Colors.slate800,
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
                backgroundColor: isDark ? Colors.slate600 : Colors.slate300,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <X size={8} color={isDark ? Colors.slate400 : Colors.gray500} />
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
