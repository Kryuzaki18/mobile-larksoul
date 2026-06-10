import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { List, Switch, Icon } from '@ant-design/react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../models/types/navigation.type';
import SettingsSection from './components/SettingsSection';

type HomeNav = NativeStackNavigationProp<RootStackParamList, 'Home'>;

const { Item } = List;

export default function SettingsScreen() {
  const navigation = useNavigation<HomeNav>();
  const [notifications, setNotifications] = useState(true);

  return (
    <>
      <View className="flex-row items-center justify-between px-5 py-3 bg-white border-b border-gray-100">
        <TouchableOpacity className="p-1.5" onPress={() => navigation.replace('Home')}>
          <Icon name="left" size={20} color="#1e293b" />
        </TouchableOpacity>
        <Text className="text-base font-bold text-slate-800">Settings</Text>
        <Icon name="setting" size={20} color="#1e3a5f" />
      </View>

      <ScrollView className="flex-1 px-4 pt-5">
        <SettingsSection title="PROFILE">
          <Item
            thumb={
              <View className="w-14 h-14 rounded-full bg-sky-200 items-center justify-center overflow-hidden mr-3">
                <Text className="text-3xl">🧑</Text>
              </View>
            }
            extra={
              <TouchableOpacity>
                <Icon name="edit" size={30} color="#94a3b8" />
              </TouchableOpacity>
            }
          >
            <Text className="text-base font-semibold text-slate-800">
              Krystian John Dumapit
            </Text>
            <Item.Brief>kjedumapit@gmail.com</Item.Brief>
          </Item>
        </SettingsSection>

        <SettingsSection title="APP SETTINGS">
          <Item
            thumb={<Icon name="skin" size={22} color="#374151" />}
            extra={<Text className="text-sm text-gray-500">Light</Text>}
            arrow="horizontal"
            onPress={() => {}}
          >
            Theme
          </Item>
          <Item
            thumb={<Icon name="bell" size={22} color="#374151" />}
            extra={
              <Switch
                checked={notifications}
                onChange={setNotifications}
                color="#2563eb"
              />
            }
          >
            Notifications
          </Item>
          <Item
            thumb={<Icon name="lock" size={22} color="#374151" />}
            extra={<Text className="text-sm text-gray-500">Enabled</Text>}
            arrow="horizontal"
            onPress={() => {}}
          >
            Security & PIN Lock
          </Item>
        </SettingsSection>

        <SettingsSection title="DATA">
          <Item
            thumb={<Icon name="download" size={22} color="#374151" />}
            extra={<Text className="text-sm font-semibold text-gray-600">PDF, JSON</Text>}
            onPress={() => {}}
          >
            Export Journal
          </Item>
          <Item
            thumb={<Icon name="cloud-upload" size={22} color="#374151" />}
            extra={<Text className="text-sm text-gray-500">Last sync: 2h ago</Text>}
            onPress={() => {}}
          >
            Cloud Backup
          </Item>
        </SettingsSection>

        <TouchableOpacity
          className="items-center py-4 mb-6"
          onPress={() => navigation.replace('Login')}
        >
          <Text className="text-red-500 text-base font-semibold">Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </>
  );
}
