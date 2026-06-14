import React from 'react';
import { View } from 'react-native';
import JournalCard from './JournalCard';
import type { JournalEntry } from '../../../models/interfaces/users.model';

interface ListViewProps {
  entries: JournalEntry[];
}

export default function ListView({ entries }: ListViewProps) {
  return (
    <View className="pt-2">
      {entries.map(entry => (
        <JournalCard key={entry.id} entry={entry} />
      ))}
    </View>
  );
}
