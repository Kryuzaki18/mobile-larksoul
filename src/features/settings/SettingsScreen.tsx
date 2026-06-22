import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useColorScheme } from 'nativewind';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import BackButton from '../commons/Button';
import {
  Lock,
  Download,
  // CloudUpload,
  LogOut,
  Sun,
  Moon,
  MonitorSmartphone,
  UserPlus,
} from 'lucide-react-native';

import GmailIcon from '../../assets/gmail.svg';
import AppleLightIcon from '../../assets/apple-white.svg';
import AppleDarkIcon from '../../assets/apple-black.svg';

import type { JournalEntry } from '../../models/interfaces/users.interface';
import type { ThemePreference } from '../../models/types/ui.type';
import { RootStackParamList } from '../../models/types/navigation.type';

import { useSecurityStore } from '../../store/securityStore';
import { useThemeStore } from '../../store/themeStore';
import { useAuthStore } from '../../store/authStore';

import { clearSession } from '../../services/sessionService';
import { getEntriesByUser } from '../../database/functions/journal';

import SettingsSection from './components/SettingsSection';
import SettingsItem from './components/SettingsItem';
import ExportModal from './components/ExportModal';
import NetworkStatusDot from '../commons/NetworkStatusDot';
import { Colors } from '../../utils/colors';

type HomeNav = NativeStackNavigationProp<RootStackParamList>;

const THEME_OPTIONS: { mode: ThemePreference; label: string; Icon: React.FC<{ size: number; color: string }> }[] = [
  { mode: 'light', label: 'Light', Icon: Sun },
  { mode: 'dark', label: 'Dark', Icon: Moon },
  { mode: 'system', label: 'Auto', Icon: MonitorSmartphone },
];

export default function SettingsScreen() {
  const navigation = useNavigation<HomeNav>();
  const { currentUser, isGuest, clearUser } = useAuthStore();

  const { isPinEnabled } = useSecurityStore();
  const { theme, setTheme } = useThemeStore();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const chipInactiveBg = isDark ? Colors.slate800 : Colors.slate100;
  const chipInactiveColor = isDark ? Colors.slate400 : Colors.gray500;

  const [exportVisible, setExportVisible] = useState(false);
  const [exportEntries, setExportEntries] = useState<JournalEntry[]>([]);

  async function handleSignOut() {
    await clearSession();
    clearUser();
    navigation.replace('Login');
  }

  async function handleOpenExport() {
    const userId = currentUser?.id;
    if (!userId) return;
    try {
      const entries = await getEntriesByUser(userId);
      setExportEntries(entries);
      setExportVisible(true);
    } catch {
      Alert.alert('Error', 'Could not load journal entries. Please try again.');
    }
  }

  const initial = currentUser?.name?.[0]?.toUpperCase() ?? 'G';
  const userName = currentUser?.name ?? 'User';

  const socialProviders = (currentUser?.social ?? []).map(s => s.split(':')[0]) as ('google' | 'apple')[];
  const hasGoogle = socialProviders.includes('google');
  const hasApple = socialProviders.includes('apple');
  const AppleIcon = isDark ? AppleLightIcon : AppleDarkIcon;

  return (
    <View className="flex-1 bg-slate-50 dark:bg-slate-950">
      <View className="flex-row items-center px-4 pt-3 pb-3 bg-slate-50 dark:bg-slate-950">
        <BackButton />
        <Text className="text-xl font-bold text-slate-800 dark:text-slate-100 ml-3">Settings</Text>
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
                  <Text style={{ fontSize: 10, fontWeight: '500', color: Colors.slate400, letterSpacing: 0.4 }}>
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
                        backgroundColor: isDark ? Colors.red500_10 : Colors.red50,
                        borderWidth: 1,
                        borderColor: isDark ? Colors.red500_20 : Colors.red200,
                      }}>
                        <GmailIcon width={13} height={13} />
                        <Text style={{ fontSize: 11, fontWeight: '600', color: Colors.red600, letterSpacing: 0.1 }}>
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
                        backgroundColor: isDark ? Colors.white_06 : Colors.slate800,
                        borderWidth: 1,
                        borderColor: isDark ? Colors.white_10 : Colors.slate800,
                      }}>
                        <AppleIcon width={12} height={12} />
                        <Text style={{ fontSize: 11, fontWeight: '600', color: Colors.white, letterSpacing: 0.1 }}>
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
                <UserPlus size={14} color={isDark ? Colors.blue400 : Colors.blue700} />
                <Text className="text-sm font-semibold text-blue-700 dark:text-blue-400">Create an Account</Text>
              </View>
            </TouchableOpacity>
          )}
        </View>

        <SettingsSection title="App Settings">
          <SettingsItem
            icon={<Sun size={17} color={Colors.white} />}
            iconBg={Colors.amber500}
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
                        backgroundColor: isActive ? Colors.blue800 : chipInactiveBg,
                      }}
                      onPress={() => setTheme(mode)}
                    >
                      <Icon size={11} color={isActive ? Colors.white : chipInactiveColor} />
                      <Text style={{ fontSize: 11, fontWeight: '600', color: isActive ? Colors.white : chipInactiveColor }}>
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
            icon={<Lock size={17} color={Colors.white} />}
            iconBg={Colors.emerald500}
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
            icon={<Download size={17} color={Colors.white} />}
            iconBg={Colors.violet500}
            extra={<Text className="text-xs font-medium text-gray-400">PDF, JSON</Text>}
            arrow
            onPress={handleOpenExport}
          >
            Export Journal
          </SettingsItem>
          {/* <SettingsItem
            icon={<CloudUpload size={17} color={Colors.white} />}
            iconBg={Colors.sky500}
            extra={<Text className="text-xs font-medium text-gray-400">2h ago</Text>}
            arrow
            onPress={() => {}}
          >
            Cloud Backup
          </SettingsItem> */}
        </SettingsSection>

        {!isGuest && (
          <SettingsSection>
            <SettingsItem
              icon={<LogOut size={17} color={Colors.red500} />}
              iconBg={Colors.red50}
              onPress={handleSignOut}
            >
              <Text className="text-sm font-medium text-red-500">Sign Out</Text>
            </SettingsItem>
          </SettingsSection>
        )}

        <View className="h-10" />
      </ScrollView>

      <ExportModal
        visible={exportVisible}
        entries={exportEntries}
        userName={userName}
        onClose={() => setExportVisible(false)}
      />
    </View>
  );
}
