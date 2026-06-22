export type Mood = 'happy' | 'grateful' | 'neutral' | 'reflective' | 'anxious' | 'sad' | 'excited';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  password?: string;
  social: string[];
  isVerified: boolean;
  verifiedAt?: string;
  pin?: string;
  createdAt: string;
}

export interface JournalEntry {
  id: string;
  userId: string;
  title: string;
  content: string;
  moods: Mood[];
  tags: string[];
  imagePaths: string[];
  createdAt: string;
  updatedAt: string;
}
