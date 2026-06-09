export type Mood = 'happy' | 'grateful' | 'neutral' | 'reflective' | 'anxious' | 'sad' | 'excited';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt: string;
}

export interface JournalEntry {
  id: string;
  userId: string;
  title: string;
  content: string;
  preview: string;
  mood: Mood;
  tags: string[];
  hasImage: boolean;
  imageColor?: string;
  createdAt: string;
  updatedAt: string;
}
