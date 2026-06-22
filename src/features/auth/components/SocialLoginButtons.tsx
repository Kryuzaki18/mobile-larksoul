import React from 'react';
import { View, TouchableOpacity, ActivityIndicator, Platform } from 'react-native';
import { useColorScheme } from 'nativewind';
import { Colors } from '../../../utils/colors';

import GmailIcon from '../../../assets/gmail.svg';
import AppleLightIcon from '../../../assets/apple-white.svg';
import AppleDarkIcon from '../../../assets/apple-black.svg';

export type SocialProvider = 'google' | 'apple';

// Apple Sign-In is a native iOS capability; not shown on Android.
const SUPPORTED_PROVIDERS: SocialProvider[] =
  Platform.OS === 'ios' ? ['google', 'apple'] : ['google'];

interface SocialLoginButtonsProps {
  providers?: SocialProvider[];
  loadingProvider?: SocialProvider | null;
  disabled?: boolean;
  onSelect?: (provider: SocialProvider) => void;
}

export default function SocialLoginButtons({
  providers = SUPPORTED_PROVIDERS,
  loadingProvider,
  disabled,
  onSelect,
}: SocialLoginButtonsProps) {
  const { colorScheme } = useColorScheme();
  const AppleIcon = colorScheme === 'dark' ? AppleLightIcon : AppleDarkIcon;

  // Filter out Apple on Android regardless of what the parent passes
  const visibleProviders = providers.filter(
    p => p !== 'apple' || Platform.OS === 'ios',
  );

  return (
    <View className="flex-row justify-center gap-4">
      {visibleProviders.map(provider => {
        const isLoading = loadingProvider === provider;
        const isDisabled = disabled || loadingProvider != null;

        return (
          <TouchableOpacity
            key={provider}
            className="w-14 h-14 rounded-full border border-gray-100 dark:border-slate-700 bg-white dark:bg-slate-800 items-center justify-center shadow-sm"
            onPress={() => onSelect?.(provider)}
            disabled={isDisabled}
            activeOpacity={0.7}
          >
            {isLoading ? (
              <ActivityIndicator
                size="small"
                color={colorScheme === 'dark' ? Colors.slate400 : Colors.slate600}
              />
            ) : provider === 'google' ? (
              <GmailIcon width={28} height={28} />
            ) : (
              <AppleIcon width={28} height={28} />
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
