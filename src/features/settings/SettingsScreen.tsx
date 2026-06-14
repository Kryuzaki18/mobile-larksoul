import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  ChevronLeft,
  Settings,
  Pencil,
  Palette,
  Bell,
  Lock,
  Download,
  CloudUpload,
  Calendar,
  Menu,
  LayoutGrid,
} from 'lucide-react-native';
import type { ViewMode } from '../home/components/ViewTabs';
import { useSettingsStore } from '../../store/settingsStore';
import { RootStackParamList } from '../../models/types/navigation.type';
import { useAuthStore } from '../../store/authStore';
import SettingsSection from './components/SettingsSection';
import SettingsItem from './components/SettingsItem';

type HomeNav = NativeStackNavigationProp<RootStackParamList, 'Home'>;

export default function SettingsScreen() {
  const navigation = useNavigation<HomeNav>();
  const { currentUser, isGuest, clearUser } = useAuthStore();
  const [notifications, setNotifications] = useState(true);
  const { defaultLayout, setDefaultLayout } = useSettingsStore();

  const LAYOUT_OPTIONS: { mode: ViewMode; label: string; Icon: React.FC<{ size: number; color: string }> }[] = [
    { mode: 'calendar', label: 'Calendar', Icon: Calendar },
    { mode: 'list', label: 'List', Icon: Menu },
    { mode: 'grid', label: 'Grid', Icon: LayoutGrid },
  ];

  function handleSignOut() {
    clearUser();
    navigation.replace('Login');
  }

  return (
    <>
      <View className="flex-row items-center justify-between px-5 py-3 bg-white border-b border-gray-100">
        <TouchableOpacity
          className="p-1.5"
          onPress={() => navigation.replace('Home')}
        >
          <ChevronLeft size={20} color="#1e293b" />
        </TouchableOpacity>
        <Text className="text-base font-bold text-slate-800">Settings</Text>
        <Settings size={20} color="#1e3a5f" />
      </View>

      <ScrollView className="flex-1 px-4 pt-5">
        <SettingsSection title="PROFILE">
          <SettingsItem
            icon={
              <View className="w-14 h-14 rounded-full bg-sky-200 items-center justify-center overflow-hidden">
                <Text className="text-3xl">{isGuest ? '👤' : '🧑'}</Text>
              </View>
            }
            extra={
              !isGuest ? (
                <TouchableOpacity>
                  <Pencil size={22} color="#94a3b8" />
                </TouchableOpacity>
              ) : undefined
            }
          >
            <View>
              <Text className="text-base font-semibold text-slate-800">
                {currentUser?.name ?? 'Guest'}
              </Text>
              <Text className="text-sm text-gray-500">
                {isGuest ? 'Browsing as guest' : currentUser?.email ?? ''}
              </Text>
            </View>
          </SettingsItem>
        </SettingsSection>

        <SettingsSection title="APP SETTINGS">
          <SettingsItem
            icon={<LayoutGrid size={22} color="#374151" />}
            extra={
              <View className="flex-row gap-2">
                {LAYOUT_OPTIONS.map(({ mode, label, Icon }) => {
                  const isActive = defaultLayout === mode;
                  return (
                    <TouchableOpacity
                      key={mode}
                      className={`flex-row items-center gap-1 px-2 py-1 rounded-lg ${isActive ? 'bg-blue-800' : 'bg-slate-100'}`}
                      onPress={() => setDefaultLayout(mode)}
                    >
                      <Icon size={12} color={isActive ? '#ffffff' : '#6b7280'} />
                      <Text className={`text-xs font-medium ${isActive ? 'text-white' : 'text-gray-500'}`}>
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
            icon={<Palette size={22} color="#374151" />}
            extra={<Text className="text-sm text-gray-500">Light</Text>}
            arrow
            onPress={() => {}}
          >
            Theme
          </SettingsItem>
          <SettingsItem
            icon={<Bell size={22} color="#374151" />}
            extra={
              <Switch
                value={notifications}
                onValueChange={setNotifications}
                trackColor={{ false: '#d1d5db', true: '#2563eb' }}
                thumbColor="#ffffff"
              />
            }
          >
            Notifications
          </SettingsItem>
          <SettingsItem
            icon={<Lock size={22} color="#374151" />}
            extra={<Text className="text-sm text-gray-500">Enabled</Text>}
            arrow
            onPress={() => {}}
          >
            Security & PIN Lock
          </SettingsItem>
        </SettingsSection>

        <SettingsSection title="DATA">
          <SettingsItem
            icon={<Download size={22} color="#374151" />}
            extra={
              <Text className="text-sm font-semibold text-gray-600">
                PDF, JSON
              </Text>
            }
            onPress={() => {}}
          >
            Export Journal
          </SettingsItem>
          <SettingsItem
            icon={<CloudUpload size={22} color="#374151" />}
            extra={
              <Text className="text-sm text-gray-500">Last sync: 2h ago</Text>
            }
            onPress={() => {}}
          >
            Cloud Backup
          </SettingsItem>
        </SettingsSection>

        {!isGuest && (
          <TouchableOpacity
            className="items-center py-4 mb-6"
            onPress={handleSignOut}
          >
            <Text className="text-red-500 text-base font-semibold">
              Sign Out
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </>
  );
}
