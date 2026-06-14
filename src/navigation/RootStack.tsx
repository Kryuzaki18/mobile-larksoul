import React, { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../models/types/navigation.type';
import { SafeAreaView } from 'react-native-safe-area-context';

import LoginScreen from '../features/auth/LoginScreen';
import HomeScreen from '../features/home/HomeScreen';
import SettingsScreen from '../features/settings/SettingsScreen';
import AddEntryScreen from '../features/journal/AddEntryScreen';
import { useAuthStore } from '../store/authStore';
import { loadSession, clearSession } from '../services/sessionService';
import { getUserById } from '../database/functions/users';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootStack() {
  const { currentUser, setUser } = useAuthStore();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    async function restoreSession() {
      try {
        const session = await loadSession();
        if (session) {
          const user = await getUserById(session.userId);
          if (user) {
            setUser(user, session.isGuest);
          } else {
            await clearSession();
          }
        }
      } catch {
        // ignore — start fresh
      } finally {
        setIsReady(true);
      }
    }
    restoreSession();
  }, [setUser]);

  if (!isReady) return null;

  return (
    <SafeAreaView className="flex-1">
      <Stack.Navigator
        initialRouteName={currentUser ? 'Home' : 'Login'}
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="AddEntry" component={AddEntryScreen} />
      </Stack.Navigator>
    </SafeAreaView>
  );
}
