import React from 'react';
import { View } from 'react-native';

import JournalCard from './JournalCard';
import { useEntryActions } from '../../../hooks/useEntryActions';
import type { EntryViewProps } from '../../../types/home';

export default function ListView({ entries, refetch }: EntryViewProps) {
  const { editEntry, confirmDelete } = useEntryActions(refetch);

  return (
    <View className="pt-4 pb-8">
      {entries.map((entry, index) => (
        <JournalCard
          key={entry.id}
          entry={entry}
          index={index}
          onEdit={() => editEntry(entry.id)}
          onDelete={() => confirmDelete(entry.id)}
        />
      ))}
    </View>
  );
}
