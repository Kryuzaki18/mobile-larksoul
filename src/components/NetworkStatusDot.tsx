import React from 'react';
import { View } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import { useNetworkStatus } from '../hooks/useNetworkStatus';
import { Colors } from '../utils/themes';

interface NetworkStatusDotProps {
  size?: number;
  style?: StyleProp<ViewStyle>;
}

export default function NetworkStatusDot({ size = 10, style }: NetworkStatusDotProps) {
  const { isConnected } = useNetworkStatus();

  return (
    <View
      style={[
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: isConnected ? Colors.green500 : Colors.red500,
          borderWidth: 1.5,
          borderColor: Colors.white,
        },
        style,
      ]}
    />
  );
}
