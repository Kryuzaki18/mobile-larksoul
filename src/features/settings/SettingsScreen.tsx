import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useColorScheme } from 'nativewind';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  ChevronLeft,
  Lock,
  Download,
  CloudUpload,
  Calendar,
  Menu,
  LayoutGrid,
  LogOut,
  Sun,
  Moon,
  MonitorSmartphone,
  UserPlus,
} from 'lucide-react-native';

import GmailIcon from '../../assets/gmail.svg';
import AppleLightIcon from '../../assets/apple-white.svg';
import AppleDarkIcon from '../../assets/apple-black.svg';

import type { ViewMode, ThemePreference } from '../../models/types/ui.type';
import { RootStackParamList } from '../../models/types/navigation.type';

import { useSettingsStore } from '../../store/settingsStore';
import { useSecurityStore } from '../../store/securityStore';
import { useThemeStore } from '../../store/themeStore';
import { useAuthStore } from '../../store/authStore';

import { clearSession } from '../../services/sessionService';

import SettingsSection from './components/SettingsSection';
import SettingsItem from './components/SettingsItem';
import NetworkStatusDot from '../commons/NetworkStatusDot';

type HomeNav = NativeStackNavigationProp<RootStackParamList, 'Home'>;

const LAYOUT_OPTIONS: { mode: ViewMode; label: string; Icon: React.FC<{ size: number; color: string }> }[] = [
  { mode: 'calendar', label: 'Calendar', Icon: Calendar },
  { mode: 'list', label: 'List', Icon: Menu },
  { mode: 'grid', label: 'Grid', Icon: LayoutGrid },
];

const THEME_OPTIONS: { mode: ThemePreference; label: string; Icon: React.FC<{ size: number; color: string }> }[] = [
  { mode: 'light', label: 'Light', Icon: Sun },
  { mode: 'dark', label: 'Dark', Icon: Moon },
  { mode: 'system', label: 'Auto', Icon: MonitorSmartphone },
];

export default function SettingsScreen() {
  const navigation = useNavigation<HomeNav>();
  const { currentUser, isGuest, clearUser } = useAuthStore();
  const { defaultLayout, setDefaultLayout } = useSettingsStore();
  const { isPinEnabled } = useSecurityStore();
  const { theme, setTheme } = useThemeStore();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const chipInactiveBg = isDark ? '#1e293b' : '#f1f5f9';
  const chipInactiveColor = isDark ? '#94a3b8' : '#6b7280';

  async function handleSignOut() {
    await clearSession();
    clearUser();
    navigation.replace('Login');
  }

  const initial = currentUser?.name?.[0]?.toUpperCase() ?? 'G';

  const socialProviders = (currentUser?.social ?? []).map(s => s.split(':')[0]) as ('google' | 'apple')[];
  const hasGoogle = socialProviders.includes('google');
  const hasApple = socialProviders.includes('apple');
  const AppleIcon = isDark ? AppleLightIcon : AppleDarkIcon;

  return (
    <View className="flex-1 bg-slate-50 dark:bg-slate-950">
      <View className="flex-row items-center px-4 pt-3 pb-3 bg-slate-50 dark:bg-slate-950">
        <TouchableOpacity
          className="w-9 h-9 rounded-full bg-white dark:bg-slate-900 items-center justify-center mr-3"
          style={{ shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 4, shadowOffset: { width: 0, height: 1 }, elevation: 2 }}
          onPress={() => navigation.replace('Home')}
        >
          <ChevronLeft size={18} color={isDark ? '#e2e8f0' : '#1e293b'} />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-slate-800 dark:text-slate-100">Settings</Text>
      </View>

      <ScrollView className="flex-1 px-4 pt-1" showsVerticalScrollIndicator={false}>

        <View className="bg-white dark:bg-slate-900 rounded-2xl p-4 mb-4">
          <View className="flex-row items-center">
            <View className="relative mr-4">
              <View className="w-14 h-14 rounded-full bg-blue-800 items-center justify-center">
                <Text className="text-2xl font-bold text-white">{initial}</Text>
              </View>
              <NetworkStatusDot size={12} style={{ position: 'absolute', bottom: -1, right: -1 }} />
            </View>
            <View className="flex-1 flex-row items-center justify-between">
              <View style={{ flex: 1, marginRight: 8 }}>
                <Text className="text-base font-bold text-slate-800 dark:text-slate-100">
                  {currentUser?.name ?? 'Guest'}
                </Text>
                <Text className="text-sm text-gray-400 mt-0.5" numberOfLines={1}>
                  {isGuest ? 'Browsing as guest' : (currentUser?.email ?? '')}
                </Text>
              </View>

              {(hasGoogle || hasApple) && (
                <View style={{ alignItems: 'flex-end', gap: 4 }}>
                  <Text style={{ fontSize: 10, fontWeight: '500', color: '#94a3b8', letterSpacing: 0.4 }}>
                    Signed in with
                  </Text>
                  <View style={{ flexDirection: 'row', gap: 5 }}>
                    {hasGoogle && (
                      <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 5,
                        paddingHorizontal: 9,
                        paddingVertical: 4,
                        borderRadius: 20,
                        backgroundColor: isDark ? 'rgba(239,68,68,0.1)' : '#fff5f5',
                        borderWidth: 1,
                        borderColor: isDark ? 'rgba(239,68,68,0.2)' : '#fecaca',
                      }}>
                        <GmailIcon width={13} height={13} />
                        <Text style={{ fontSize: 11, fontWeight: '600', color: '#dc2626', letterSpacing: 0.1 }}>
                          Google
                        </Text>
                      </View>
                    )}
                    {hasApple && (
                      <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 5,
                        paddingHorizontal: 9,
                        paddingVertical: 4,
                        borderRadius: 20,
                        backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : '#1e293b',
                        borderWidth: 1,
                        borderColor: isDark ? 'rgba(255,255,255,0.1)' : '#1e293b',
                      }}>
                        <AppleIcon width={12} height={12} />
                        <Text style={{ fontSize: 11, fontWeight: '600', color: '#ffffff', letterSpacing: 0.1 }}>
                          Apple
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
              )}
            </View>
          </View>

          {isGuest && (
            <TouchableOpacity
              className="mt-3 bg-blue-50 dark:bg-blue-500/10 rounded-xl py-2.5 items-center"
              activeOpacity={0.7}
              onPress={() => navigation.navigate('SignUp')}
            >
              <View className="flex-row items-center gap-2">
                <UserPlus size={14} color={isDark ? '#60a5fa' : '#1d4ed8'} />
                <Text className="text-sm font-semibold text-blue-700 dark:text-blue-400">Create an Account</Text>
              </View>
            </TouchableOpacity>
          )}
        </View>

        <SettingsSection title="App Settings">
          <SettingsItem
            icon={<LayoutGrid size={17} color="#fff" />}
            iconBg="#6366f1"
            extra={
              <View className="flex-row gap-1.5">
                {LAYOUT_OPTIONS.map(({ mode, label, Icon }) => {
                  const isActive = defaultLayout === mode;
                  return (
                    <TouchableOpacity
                      key={mode}
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 4,
                        paddingHorizontal: 8,
                        paddingVertical: 5,
                        borderRadius: 8,
                        backgroundColor: isActive ? '#1e40af' : chipInactiveBg,
                      }}
                      onPress={() => setDefaultLayout(mode)}
                    >
                      <Icon size={11} color={isActive ? '#fff' : chipInactiveColor} />
                      <Text style={{ fontSize: 11, fontWeight: '600', color: isActive ? '#fff' : chipInactiveColor }}>
                        {label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            }
          >
            Home Layout
          </SettingsItem>

          <SettingsItem
            icon={<Sun size={17} color="#fff" />}
            iconBg="#f59e0b"
            extra={
              <View className="flex-row gap-1.5">
                {THEME_OPTIONS.map(({ mode, label, Icon }) => {
                  const isActive = theme === mode;
                  return (
                    <TouchableOpacity
                      key={mode}
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 4,
                        paddingHorizontal: 8,
                        paddingVertical: 5,
                        borderRadius: 8,
                        backgroundColor: isActive ? '#1e40af' : chipInactiveBg,
                      }}
                      onPress={() => setTheme(mode)}
                    >
                      <Icon size={11} color={isActive ? '#fff' : chipInactiveColor} />
                      <Text style={{ fontSize: 11, fontWeight: '600', color: isActive ? '#fff' : chipInactiveColor }}>
                        {label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            }
          >
            Theme
          </SettingsItem>
          
          <SettingsItem
            icon={<Lock size={17} color="#fff" />}
            iconBg="#10b981"
            extra={
              <Text className="text-xs font-medium text-gray-400">
                {isPinEnabled ? 'Enabled' : 'Disabled'}
              </Text>
            }
            arrow
            onPress={() => navigation.navigate('Security')}
          >
            Security & PIN Lock
          </SettingsItem>
        </SettingsSection>

        <SettingsSection title="Data">
          <SettingsItem
            icon={<Download size={17} color="#fff" />}
            iconBg="#8b5cf6"
            extra={<Text className="text-xs font-medium text-gray-400">PDF, JSON</Text>}
            arrow
            onPress={() => {}}
          >
            Export Journal
          </SettingsItem>
          <SettingsItem
            icon={<CloudUpload size={17} color="#fff" />}
            iconBg="#0ea5e9"
            extra={<Text className="text-xs font-medium text-gray-400">2h ago</Text>}
            arrow
            onPress={() => {}}
          >
            Cloud Backup
          </SettingsItem>
        </SettingsSection>

        {!isGuest && (
          <SettingsSection>
            <SettingsItem
              icon={<LogOut size={17} color="#ef4444" />}
              iconBg="#fef2f2"
              onPress={handleSignOut}
            >
              <Text className="text-sm font-medium text-red-500">Sign Out</Text>
            </SettingsItem>
          </SettingsSection>
        )}

        <View className="h-10" />
      </ScrollView>
    </View>
  );
}
