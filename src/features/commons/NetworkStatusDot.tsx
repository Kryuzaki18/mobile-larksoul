import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { Colors } from '../../utils/colors';

interface NetworkStatusDotProps {
  size?: number;
  style?: StyleProp<ViewStyle>;
}

export default function NetworkStatusDot({ size = 10, style }: NetworkStatusDotProps) {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsActive(state.isConnected === true && state.isInternetReachable === true);
    });
    NetInfo.fetch().then(state => {
      setIsActive(state.isConnected === true && state.isInternetReachable === true);
    });
    return () => unsubscribe();
  }, []);

  return (
    <View
      style={[
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: isActive ? Colors.green500 : Colors.red500,
          borderWidth: 1.5,
          borderColor: Colors.white,
        },
        style,
      ]}
    />
  );
}
