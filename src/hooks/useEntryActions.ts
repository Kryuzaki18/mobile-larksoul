import { useCallback } from 'react';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { deleteEntry } from '../database/functions/journal';
import type { RootStackParamList } from '../types/navigation';

type Nav = NativeStackNavigationProp<RootStackParamList, 'Home'>;

interface EntryActions {
  editEntry: (entryId: string) => void;
  confirmDelete: (entryId: string) => void;
}

export function useEntryActions(refetch: () => void): EntryActions {
  const navigation = useNavigation<Nav>();

  const editEntry = useCallback(
    (entryId: string) => navigation.navigate('AddEntry', { entryId }),
    [navigation],
  );

  const confirmDelete = useCallback(
    (entryId: string) => {
      Alert.alert(
        'Delete Entry',
        'Are you sure you want to delete this entry?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: () => deleteEntry(entryId).then(refetch).catch(console.error),
          },
        ],
      );
    },
    [refetch],
  );

  return { editEntry, confirmDelete };
}
