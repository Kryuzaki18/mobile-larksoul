import React, { useEffect, useRef, useState } from 'react';
import { AppState } from 'react-native';
import type { AppStateStatus } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types/navigation';
import { SafeAreaView } from 'react-native-safe-area-context';

import LoginScreen from '../features/auth/LoginScreen';
import SignUpScreen from '../features/auth/SignUpScreen';
import PinLockScreen from '../features/auth/PinLockScreen';
import HomeScreen from '../features/home/HomeScreen';
import InsightsScreen from '../features/insights/InsightsScreen';
import SettingsScreen from '../features/settings/SettingsScreen';
import SecurityScreen from '../features/settings/SecurityScreen';
import AddEntryScreen from '../features/journal/AddEntryScreen';

import { useAuthStore } from '../store/authStore';
import { useSecurityStore } from '../store/securityStore';
import { useThemeStore } from '../store/themeStore';
import { useJournalViewStore } from '../store/journalViewStore';

import { loadSession, clearSession } from '../services/sessionService';
import { hasPinLock } from '../services/securityService';

import { getUserById } from '../database/functions/users';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootStack() {
  const { currentUser, setUser } = useAuthStore();
  const { isPinEnabled, isLocked, setPinEnabled, lock, unlock } = useSecurityStore();
  const hydrateTheme = useThemeStore(state => state.hydrate);
  const hydrateJournalView = useJournalViewStore(state => state.hydrate);
  const [isReady, setIsReady] = useState(false);
  const appState = useRef<AppStateStatus>(AppState.currentState);

  useEffect(() => {
    async function restoreSession() {
      try {
        await Promise.all([hydrateTheme(), hydrateJournalView()]);

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
  }, [setUser, setPinEnabled, lock, hydrateTheme, hydrateJournalView]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextState => {
      const wasBackgrounded = appState.current.match(/inactive|background/);
      if (wasBackgrounded && nextState === 'active' && isPinEnabled && currentUser) {
        const { suppressNextLock, clearSuppressLock, isPickingMedia } = useSecurityStore.getState();
        if (isPickingMedia) {
          // stay silent — the media picker owns this foreground event
        } else if (suppressNextLock) {
          clearSuppressLock();
        } else {
          lock();
        }
      }
      appState.current = nextState;
    });
    return () => subscription.remove();
  }, [isPinEnabled, currentUser, lock]);

  if (!isReady) return null;

  if (currentUser && isPinEnabled && isLocked) {
    return (
      <SafeAreaView className="flex-1 bg-slate-100 dark:bg-[#020617]">
        <PinLockScreen
          title="Welcome back!"
          subtitle="Enter your PIN to continue"
          onSuccess={unlock}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-slate-100 dark:bg-[#020617]">
      <Stack.Navigator
        initialRouteName={currentUser ? 'Home' : 'Login'}
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
          contentStyle: { backgroundColor: 'transparent' },
        }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Insights" component={InsightsScreen} />
        <Stack.Screen name="AddEntry" component={AddEntryScreen} options={{ animation: 'slide_from_bottom' }} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="Security" component={SecurityScreen} />
      </Stack.Navigator>
    </SafeAreaView>
  );
}
