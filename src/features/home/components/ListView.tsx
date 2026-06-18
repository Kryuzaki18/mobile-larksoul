import React from 'react';
import { Alert, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import JournalCard from './JournalCard';
import type { JournalEntry } from '../../../models/interfaces/users.model';
import type { RootStackParamList } from '../../../models/types/navigation.type';
import { deleteEntry } from '../../../database/functions/journal';

type Nav = NativeStackNavigationProp<RootStackParamList, 'Home'>;

interface ListViewProps {
  entries: JournalEntry[];
  refetch: () => void;
}

export default function ListView({ entries, refetch }: ListViewProps) {
  const navigation = useNavigation<Nav>();

  return (
    <View className="pt-2">
      {entries.map((entry, index) => (
        <JournalCard
          key={entry.id}
          entry={entry}
          index={index}
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
