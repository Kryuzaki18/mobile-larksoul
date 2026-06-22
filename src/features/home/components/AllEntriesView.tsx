import React from 'react';
import { View } from 'react-native';

import DateSeparator from './DateSeparator';
import ListView from './ListView';
import GridView from './GridView';
import EmptyEntry from './EmptyEntry';
import type { EntryGroup } from '../../../hooks/useHomeState';
import { formatDateStrLabel } from '../../../utils/dateTime';

interface AllEntriesViewProps {
  groups: EntryGroup[];
  layout: 'list' | 'grid';
  refetch: () => void;
  onGroupLayout: (date: string, y: number) => void;
}

export default function AllEntriesView({
  groups,
  layout,
  refetch,
  onGroupLayout,
}: AllEntriesViewProps) {
  if (groups.length === 0) {
    return <EmptyEntry />;
  }

  return (
    <View>
      {groups.map(({ date, items }, index) => (
        <View
          key={date}
          onLayout={(e) => onGroupLayout(date, e.nativeEvent.layout.y)}
        >
          <DateSeparator label={formatDateStrLabel(date)} />
          
          {layout === 'list' ? (
            <ListView entries={items} refetch={refetch} />
          ) : (
            <GridView entries={items} refetch={refetch} />
          )}
        </View>
      ))}
    </View>
  );
}
