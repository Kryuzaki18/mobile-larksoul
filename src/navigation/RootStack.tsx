import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../models/types/navigation.type';
import { SafeAreaView } from 'react-native-safe-area-context';

import LoginScreen from '../features/auth/LoginScreen';
import HomeScreen from '../features/home/HomeScreen';
import SettingsScreen from '../features/settings/SettingsScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

function SafeAreaProvider({ children }: { children: React.ReactNode }) {
  const Provider = require('react-native-safe-area-context').SafeAreaProvider;
  return <Provider>{children}</Provider>;
}

export default function RootStack() {
  return (
    <SafeAreaProvider>
      <SafeAreaView className="flex-1">
        <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Settings" component={SettingsScreen} />
        </Stack.Navigator>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}


