import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, Modal, Pressable, Dimensions } from 'react-native';
import { Clock, Calendar, MoreHorizontal, Image, Pencil, Trash2 } from 'lucide-react-native';
import type { JournalEntry } from '../../../utils/dateTime';
import { formatEntryTime, getEntryIcon } from '../../../utils/dateTime';

interface JournalCardProps {
  entry: JournalEntry;
  onEdit?: () => void;
  onDelete?: () => void;
  onPress?: () => void;
}

export default function JournalCard({ entry, onEdit, onDelete, onPress }: JournalCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuPos, setMenuPos] = useState({ top: 0, right: 0 });
  const buttonRef = useRef<View>(null);
  const timeLabel = formatEntryTime(entry.createdAt);
  const iconName = getEntryIcon(entry.createdAt);
  const TimeIcon = iconName === 'clock-circle' ? Clock : Calendar;

  function handleMenuPress() {
    buttonRef.current?.measureInWindow((x, y, width, height) => {
      const screenWidth = Dimensions.get('window').width;
      setMenuPos({ top: y + height + 4, right: screenWidth - x - width });
      setMenuOpen(true);
    });
  }

  return (
    <>
      <TouchableOpacity
        className="bg-white rounded-2xl mx-4 mb-3 p-4"
        onPress={onPress}
        activeOpacity={0.85}
      >
        <View className="flex-row items-center justify-between mb-2">
          <View className="flex-row items-center gap-1.5">
            <TimeIcon size={13} color="#9ca3af" />
            <Text className="text-xs text-gray-400 font-medium tracking-wider">{timeLabel}</Text>
          </View>
          <View ref={buttonRef} collapsable={false}>
            <TouchableOpacity className="p-1" onPress={handleMenuPress}>
              <MoreHorizontal size={18} color={menuOpen ? '#3b82f6' : '#9ca3af'} />
            </TouchableOpacity>
          </View>
        </View>

        <Text className="text-xl font-bold text-slate-800 mb-1.5" numberOfLines={2}>
          {entry.title}
        </Text>

        <Text className="text-sm text-gray-500 leading-relaxed mb-3" numberOfLines={3}>
          {entry.preview}
        </Text>

        {entry.hasImage && (
          <View
            className="h-36 rounded-xl mb-3 items-center justify-center overflow-hidden"
            style={{ backgroundColor: entry.imageColor ?? '#334155' }}
          >
            <Image size={36} color="#94a3b8" />
          </View>
        )}

        <View className="flex-row flex-wrap gap-2">
          {entry.tags.map(tag => (
            <View key={tag} className="bg-blue-50 rounded-full px-3 py-1">
              <Text className="text-xs text-blue-500 font-medium">{tag}</Text>
            </View>
          ))}
        </View>
      </TouchableOpacity>

      <Modal
        visible={menuOpen}
        transparent
        animationType="none"
        onRequestClose={() => setMenuOpen(false)}
      >
        <Pressable style={{ flex: 1 }} onPress={() => setMenuOpen(false)}>
          <View
            style={{
              position: 'absolute',
              top: menuPos.top,
              right: menuPos.right,
              backgroundColor: 'white',
              borderRadius: 12,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.12,
              shadowRadius: 12,
              elevation: 8,
              width: 110,
              borderWidth: 1,
              borderColor: '#f1f5f9',
            }}
          >
            <TouchableOpacity
              style={{ flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 16, paddingVertical: 13 }}
              onPress={() => { setMenuOpen(false); onEdit?.(); }}
            >
              <Pencil size={14} color="#475569" />
              <Text style={{ fontSize: 14, color: '#475569', fontWeight: '500' }}>Edit</Text>
            </TouchableOpacity>
            <View style={{ height: 1, backgroundColor: '#f1f5f9' }} />
            <TouchableOpacity
              style={{ flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 16, paddingVertical: 13 }}
              onPress={() => { setMenuOpen(false); onDelete?.(); }}
            >
              <Trash2 size={14} color="#ef4444" />
              <Text style={{ fontSize: 14, color: '#ef4444', fontWeight: '500' }}>Delete</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
    </>
  );
}
