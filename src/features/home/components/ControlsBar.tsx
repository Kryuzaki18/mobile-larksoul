import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Menu, LayoutGrid, BookOpen } from 'lucide-react-native';

interface ControlsBarProps {
  dateLabel: string;
  showAll: boolean;
  onToggleAll: () => void;
  layout: 'list' | 'grid';
  onLayoutChange: (layout: 'list' | 'grid') => void;
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
  const chipInactiveBg = isDark ? '#1e293b' : '#f1f5f9';
  const chipInactiveColor = isDark ? '#94a3b8' : '#6b7280';
  const bgColor = isDark ? '#020617' : '#f8fafc';

  return (
    <View
      style={{ backgroundColor: bgColor, paddingTop: 16, paddingBottom: 4 }}
      className="flex-row items-center px-4"
    >
      <View style={{ flexDirection: 'row', gap: 5 }}>
        <TouchableOpacity
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 4,
            paddingHorizontal: 8,
            height: 28,
            borderRadius: 7,
            backgroundColor: showAll ? '#1e40af' : chipInactiveBg,
          }}
          onPress={onToggleAll}
        >
          <BookOpen size={13} color={showAll ? '#fff' : chipInactiveColor} />
          <Text
            style={{
              fontSize: 11,
              fontWeight: '700',
              color: showAll ? '#fff' : chipInactiveColor,
            }}
          >
            All
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 4,
            paddingHorizontal: 8,
            height: 28,
            borderRadius: 7,
            backgroundColor: layout === 'list' ? '#1e40af' : chipInactiveBg,
          }}
          onPress={() => onLayoutChange('list')}
        >
          <Menu
            size={13}
            color={layout === 'list' ? '#fff' : chipInactiveColor}
          />
          <Text
            style={{
              fontSize: 11,
              fontWeight: '700',
              color: layout === 'list' ? '#fff' : chipInactiveColor,
            }}
          >
            List
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 4,
            paddingHorizontal: 8,
            height: 28,
            borderRadius: 7,
            backgroundColor: layout === 'grid' ? '#1e40af' : chipInactiveBg,
          }}
          onPress={() => onLayoutChange('grid')}
        >
          <LayoutGrid
            size={13}
            color={layout === 'grid' ? '#fff' : chipInactiveColor}
          />
          <Text
            style={{
              fontSize: 11,
              fontWeight: '700',
              color: layout === 'grid' ? '#fff' : chipInactiveColor,
            }}
          >
            Grid
          </Text>
        </TouchableOpacity>
      </View>

      <View
        className="flex-1 h-px mr-2"
        style={{ backgroundColor: isDark ? '#1e293b' : '#e9edf2' }}
      />

      <Text className="text-xs font-bold text-gray-400 tracking-widest uppercase mr-3">
        {dateLabel}
      </Text>
    </View>
  );
}
