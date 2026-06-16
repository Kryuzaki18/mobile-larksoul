import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  ChevronLeft,
  Pencil,
  Lock,
  Download,
  CloudUpload,
  Calendar,
  Menu,
  LayoutGrid,
  LogOut,
  Sun,
  UserPlus,
} from 'lucide-react-native';
import type { ViewMode } from '../../models/types/ui.type';
import { useSettingsStore } from '../../store/settingsStore';
import { useSecurityStore } from '../../store/securityStore';
import { clearSession } from '../../services/sessionService';
import { RootStackParamList } from '../../models/types/navigation.type';
import { useAuthStore } from '../../store/authStore';
import SettingsSection from './components/SettingsSection';
import SettingsItem from './components/SettingsItem';
import NetworkStatusDot from '../commons/NetworkStatusDot';

type HomeNav = NativeStackNavigationProp<RootStackParamList, 'Home'>;

const LAYOUT_OPTIONS: { mode: ViewMode; label: string; Icon: React.FC<{ size: number; color: string }> }[] = [
  { mode: 'calendar', label: 'Calendar', Icon: Calendar },
  { mode: 'list', label: 'List', Icon: Menu },
  { mode: 'grid', label: 'Grid', Icon: LayoutGrid },
];

export default function SettingsScreen() {
  const navigation = useNavigation<HomeNav>();
  const { currentUser, isGuest, clearUser } = useAuthStore();
  const { defaultLayout, setDefaultLayout } = useSettingsStore();
  const { isPinEnabled } = useSecurityStore();

  async function handleSignOut() {
    await clearSession();
    clearUser();
    navigation.replace('Login');
  }

  const initial = currentUser?.name?.[0]?.toUpperCase() ?? 'G';

  return (
    <View className="flex-1 bg-slate-50">
      <View className="flex-row items-center px-4 pt-3 pb-3 bg-slate-50">
        <TouchableOpacity
          className="w-9 h-9 rounded-full bg-white items-center justify-center mr-3"
          style={{ shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 4, shadowOffset: { width: 0, height: 1 }, elevation: 2 }}
          onPress={() => navigation.replace('Home')}
        >
          <ChevronLeft size={18} color="#1e293b" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-slate-800">Settings</Text>
      </View>

      <ScrollView className="flex-1 px-4 pt-1" showsVerticalScrollIndicator={false}>

        <View className="bg-white rounded-2xl p-4 mb-4">
          <View className="flex-row items-center">
            <View className="relative mr-4">
              <View className="w-14 h-14 rounded-full bg-blue-800 items-center justify-center">
                <Text className="text-2xl font-bold text-white">{initial}</Text>
              </View>
              <NetworkStatusDot size={12} style={{ position: 'absolute', bottom: -1, right: -1 }} />
            </View>
            <View className="flex-1">
              <Text className="text-base font-bold text-slate-800">
                {currentUser?.name ?? 'Guest'}
              </Text>
              <Text className="text-sm text-gray-400 mt-0.5">
                {isGuest ? 'Browsing as guest' : (currentUser?.email ?? '')}
              </Text>
            </View>
            {!isGuest && (
              <TouchableOpacity className="w-8 h-8 rounded-full bg-slate-100 items-center justify-center">
                <Pencil size={14} color="#64748b" />
              </TouchableOpacity>
            )}
          </View>
          {isGuest && (
            <TouchableOpacity
              className="mt-3 bg-blue-50 rounded-xl py-2.5 items-center"
              activeOpacity={0.7}
              onPress={() => navigation.navigate('SignUp')}
            >
              <View className="flex-row items-center gap-2">
                <UserPlus size={14} color="#1d4ed8" />
                <Text className="text-sm font-semibold text-blue-700">Create an Account</Text>
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
                        backgroundColor: isActive ? '#1e40af' : '#f1f5f9',
                      }}
                      onPress={() => setDefaultLayout(mode)}
                    >
                      <Icon size={11} color={isActive ? '#fff' : '#6b7280'} />
                      <Text style={{ fontSize: 11, fontWeight: '600', color: isActive ? '#fff' : '#6b7280' }}>
                        {label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            }
          >
            Layout
          </SettingsItem>
          <SettingsItem
            icon={<Sun size={17} color="#fff" />}
            iconBg="#f59e0b"
            extra={<Text className="text-xs font-medium text-gray-400">Light</Text>}
            arrow
            onPress={() => {}}
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
