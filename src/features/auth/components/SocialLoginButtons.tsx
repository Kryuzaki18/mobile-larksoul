import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import GmailIcon from '../../../assets/gmail.svg';
import XIcon from '../../../assets/x.svg';
import FbIcon from '../../../assets/fb.svg';
import InstagramIcon from '../../../assets/instagram.svg';

const SOCIAL_PROVIDERS = [
  { SvgIcon: GmailIcon, key: 'gmail' },
  { SvgIcon: XIcon, key: 'x' },
  { SvgIcon: FbIcon, key: 'fb' },
  { SvgIcon: InstagramIcon, key: 'instagram' },
] as const;

export default function SocialLoginButtons() {
  return (
    <View className="flex-row justify-center gap-4">
      {SOCIAL_PROVIDERS.map(({ SvgIcon, key }) => (
        <TouchableOpacity
          key={key}
          className="w-14 h-14 rounded-full border border-gray-100 bg-white items-center justify-center shadow-sm"
          onPress={() => {}}
        >
          <SvgIcon width={28} height={28} />
        </TouchableOpacity>
      ))}
    </View>
  );
}
