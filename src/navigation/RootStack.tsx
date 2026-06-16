import React, { useEffect, useRef, useState } from 'react';
import { AppState } from 'react-native';
import type { AppStateStatus } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../models/types/navigation.type';
import { SafeAreaView } from 'react-native-safe-area-context';

import LoginScreen from '../features/auth/LoginScreen';
import SignUpScreen from '../features/auth/SignUpScreen';
import PinLockScreen from '../features/auth/PinLockScreen';
import HomeScreen from '../features/home/HomeScreen';
import SettingsScreen from '../features/settings/SettingsScreen';
import SecurityScreen from '../features/settings/SecurityScreen';
import AddEntryScreen from '../features/journal/AddEntryScreen';
import { useAuthStore } from '../store/authStore';
import { useSecurityStore } from '../store/securityStore';
import { loadSession, clearSession } from '../services/sessionService';
import { hasPinLock } from '../services/securityService';
import { getUserById } from '../database/functions/users';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootStack() {
  const { currentUser, setUser } = useAuthStore();
  const { isPinEnabled, isLocked, setPinEnabled, lock, unlock } = useSecurityStore();
  const [isReady, setIsReady] = useState(false);
  const appState = useRef<AppStateStatus>(AppState.currentState);

  useEffect(() => {
    async function restoreSession() {
      try {
        const pinEnabled = await hasPinLock();
        setPinEnabled(pinEnabled);

        const session = await loadSession();
        if (session) {
          const user = await getUserById(session.userId);
          if (user) {
            setUser(user, session.isGuest);
            if (pinEnabled) lock();
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
  }, [setUser, setPinEnabled, lock]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextState => {
      const wasBackgrounded = appState.current.match(/inactive|background/);
      if (wasBackgrounded && nextState === 'active' && isPinEnabled && currentUser) {
        lock();
      }
      appState.current = nextState;
    });
    return () => subscription.remove();
  }, [isPinEnabled, currentUser, lock]);

  if (!isReady) return null;

  if (currentUser && isPinEnabled && isLocked) {
    return (
      <SafeAreaView className="flex-1">
        <PinLockScreen
          title="Welcome back!"
          subtitle="Enter your PIN to continue"
          onSuccess={unlock}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1">
      <Stack.Navigator
        initialRouteName={currentUser ? 'Home' : 'Login'}
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="AddEntry" component={AddEntryScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="Security" component={SecurityScreen} />
      </Stack.Navigator>
    </SafeAreaView>
  );
}
