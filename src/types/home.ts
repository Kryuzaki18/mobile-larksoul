import type { JournalEntry } from './user';

export interface EntryViewProps {
  entries: JournalEntry[];
  refetch: () => void;
}

export interface GridCardProps {
  entry: JournalEntry;
  index: number;
  isMenuOpen: boolean;
  onToggleMenu: (id: string) => void;
  onDismiss: () => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}
