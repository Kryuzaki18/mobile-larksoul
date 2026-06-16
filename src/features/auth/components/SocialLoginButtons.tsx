import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import GmailIcon from '../../../assets/gmail.svg';
import AppleIcon from '../../../assets/apple.svg';

export type SocialProvider = 'google' | 'apple';

interface SocialLoginButtonsProps {
  providers?: SocialProvider[];
  onSelect?: (provider: SocialProvider) => void;
}

export default function SocialLoginButtons({
  providers = ['google'],
  onSelect,
}: SocialLoginButtonsProps) {
  return (
    <View className="flex-row justify-center gap-4">
      {providers.map(provider => (
        <TouchableOpacity
          key={provider}
          className="w-14 h-14 rounded-full border border-gray-100 dark:border-slate-700 bg-white dark:bg-slate-800 items-center justify-center shadow-sm"
          onPress={() => onSelect?.(provider)}
          activeOpacity={0.7}
        >
          {provider === 'google' ? (
            <GmailIcon width={28} height={28} />
          ) : (
            <AppleIcon width={28} height={28} />
          )}
        </TouchableOpacity>
      ))}
    </View>
  );
}
