import React, { useState } from 'react';
import { Alert, Pressable, View, Text, TouchableOpacity } from 'react-native';
import { Clock, Calendar, ImageIcon, Pencil, Trash2, MoreVertical } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { JournalEntry } from '../../../models/interfaces/users.model';
import type { RootStackParamList } from '../../../models/types/navigation.type';
import { formatEntryTime, getEntryIcon } from '../../../utils/dateTime';
import { deleteEntry } from '../../../database/functions/journal';

type Nav = NativeStackNavigationProp<RootStackParamList, 'Home'>;

const MOOD_COLORS: Record<string, string> = {
  happy: '#fef9c3',
  grateful: '#dcfce7',
  excited: '#fce7f3',
  neutral: '#f1f5f9',
  reflective: '#ede9fe',
  anxious: '#fff7ed',
  sad: '#e0f2fe',
};

interface GridCardProps {
  entry: JournalEntry;
  isMenuOpen: boolean;
  onToggleMenu: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

function GridCard({ entry, isMenuOpen, onToggleMenu, onEdit, onDelete }: GridCardProps) {
  const timeLabel = formatEntryTime(entry.createdAt);
  const iconName = getEntryIcon(entry.createdAt);
  const TimeIcon = iconName === 'clock-circle' ? Clock : Calendar;
  const accentColor = MOOD_COLORS[entry.moods[0] ?? 'neutral'] ?? '#f1f5f9';

  return (
    <View style={{ width: '50%', padding: 6, zIndex: isMenuOpen ? 20 : 1 }}>
      <View className="relative">
        <View
          className="bg-white rounded-2xl overflow-hidden"
          style={{ elevation: 1, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, shadowOffset: { width: 0, height: 1 } }}
        >
          <View style={{ height: 4, backgroundColor: accentColor }} />

          <View className="px-3 pb-3">
            <View className="flex-row items-center gap-1 mb-2 pr-6">
              <View className="flex-row items-center gap-1">
                <TimeIcon size={12} color="#9ca3af" />
                <Text className="text-xs text-gray-400 flex-1" numberOfLines={1}>
                  {timeLabel}
                </Text>
              </View>

              <TouchableOpacity
                className="w-7 h-7 rounded-full bg-white items-center justify-center"
                onPress={onToggleMenu}
              >
                <MoreVertical size={14} color="#475569" />
              </TouchableOpacity>
            </View>

            {entry.hasImage && (
              <View
                className="h-16 rounded-xl mb-2 items-center justify-center"
                style={{ backgroundColor: entry.imageColor ?? '#334155' }}
              >
                <ImageIcon size={18} color="#94a3b8" />
              </View>
            )}

            <Text className="text-sm font-bold text-slate-800 mb-1.5" numberOfLines={2}>
              {entry.title}
            </Text>

            <Text className="text-xs text-gray-500 leading-relaxed mb-2" numberOfLines={3}>
              {entry.preview}
            </Text>

            {entry.tags.length > 0 && (
              <View className="flex-row flex-wrap gap-1">
                {entry.tags.slice(0, 2).map(tag => (
                  <View key={tag} className="bg-blue-50 rounded-full px-2 py-0.5">
                    <Text className="text-xs text-blue-500 font-medium">{tag}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        </View>

        {isMenuOpen && (
          <View
            className="absolute bg-white rounded-xl overflow-hidden"
            style={{
              right: 6,
              marginTop: 25,
              elevation: 6,
              shadowColor: '#000',
              shadowOpacity: 0.15,
              shadowRadius: 8,
              shadowOffset: { width: 0, height: 4 },
            }}
          >
            <TouchableOpacity
              className="flex-row items-center gap-2 px-3 py-2"
              onPress={() => { onToggleMenu(); onEdit(); }}
            >
              <Pencil size={13} color="#475569" />
              <Text className="text-xs font-medium text-slate-700">Edit</Text>
            </TouchableOpacity>
            <View className="h-px bg-slate-100" />
            <TouchableOpacity
              className="flex-row items-center gap-2 px-3 py-2"
              onPress={() => { onToggleMenu(); onDelete(); }}
            >
              <Trash2 size={13} color="#ef4444" />
              <Text className="text-xs font-medium text-red-500">Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}

interface GridViewProps {
  entries: JournalEntry[];
  refetch: () => void;
}

export default function GridView({ entries, refetch }: GridViewProps) {
  const navigation = useNavigation<Nav>();
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  return (
    <View className="flex-row flex-wrap px-3 pt-3">
      {activeMenuId !== null && (
        <Pressable
          style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 10 }}
          onPress={() => setActiveMenuId(null)}
        />
      )}

      {entries.map(entry => (
        <GridCard
          key={entry.id}
          entry={entry}
          isMenuOpen={activeMenuId === entry.id}
          onToggleMenu={() =>
            setActiveMenuId(current => (current === entry.id ? null : entry.id))
          }
          onEdit={() => navigation.navigate('AddEntry', { entryId: entry.id })}
          onDelete={() =>
            Alert.alert(
              'Delete Entry',
              'Are you sure you want to delete this entry?',
              [
                { text: 'Cancel', style: 'cancel' },
                {
                  text: 'Delete',
                  style: 'destructive',
                  onPress: () => deleteEntry(entry.id).then(refetch).catch(console.error),
                },
              ],
            )
          }
        />
      ))}
    </View>
  );
}
