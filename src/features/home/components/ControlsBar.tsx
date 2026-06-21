import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Menu, LayoutGrid, BookOpen } from 'lucide-react-native';
import type { JournalLayout } from '../../../store/journalViewStore';

interface ChipProps {
  active: boolean;
  onPress: () => void;
  icon: (color: string) => React.ReactNode;
  label: string;
  isDark: boolean;
}

function ToggleChip({ active, onPress, icon, label, isDark }: ChipProps) {
  const bg = active ? '#1e40af' : (isDark ? '#1e293b' : '#f1f5f9');
  const color = active ? '#fff' : (isDark ? '#94a3b8' : '#6b7280');
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
      <Text style={{ fontSize: 11, fontWeight: '700', color }}>{label}</Text>
    </TouchableOpacity>
  );
}

interface ControlsBarProps {
  dateLabel: string;
  showAll: boolean;
  onToggleAll: () => void;
  layout: JournalLayout;
  onLayoutChange: (layout: JournalLayout) => void;
  isDark: boolean;
}

export default function ControlsBar({
  dateLabel,
  showAll,
  onToggleAll,
  layout,
  onLayoutChange,
  isDark,
}: ControlsBarProps) {
  const bgColor = isDark ? '#020617' : '#f8fafc';
  const dividerColor = isDark ? '#1e293b' : '#e9edf2';

  return (
    <View
      style={{ backgroundColor: bgColor, paddingTop: 16, paddingBottom: 4 }}
      className="flex-row items-center px-4"
    >
      <View style={{ flexDirection: 'row', gap: 5 }}>
        <ToggleChip
          active={showAll}
          onPress={onToggleAll}
          icon={(color) => <BookOpen size={13} color={color} />}
          label="All"
          isDark={isDark}
        />
        <ToggleChip
          active={layout === 'list'}
          onPress={() => onLayoutChange('list')}
          icon={(color) => <Menu size={13} color={color} />}
          label="List"
          isDark={isDark}
        />
        <ToggleChip
          active={layout === 'grid'}
          onPress={() => onLayoutChange('grid')}
          icon={(color) => <LayoutGrid size={13} color={color} />}
          label="Grid"
          isDark={isDark}
        />
      </View>

      <View
        className="flex-1 h-px ml-2 mr-3"
        style={{ backgroundColor: dividerColor }}
      />

      <Text className="text-xs font-bold text-gray-400 tracking-widest uppercase">
        {dateLabel}
      </Text>
    </View>
  );
}
