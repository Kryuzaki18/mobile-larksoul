import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { List, Switch, Icon } from '@ant-design/react-native';

const { Item } = List;

export default function Settings() {
  const [notifications, setNotifications] = useState(true);

  return (
    <SafeAreaView className="flex-1 bg-slate-100">

      {/* Header */}
      <View className="flex-row items-center justify-between px-5 py-3 bg-white border-b border-gray-100">
        <TouchableOpacity className="p-1.5">
          <Icon name="left" size={20} color="#1e293b" />
        </TouchableOpacity>
        <Text className="text-base font-bold text-slate-800">Settings</Text>
        <TouchableOpacity className="p-1.5">
          <Icon name="setting" size={20} color="#1e3a5f" />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 px-4 pt-5">

        {/* PROFILE */}
        <Text className="text-xs font-semibold text-gray-400 tracking-widest mb-2 ml-1">
          PROFILE
        </Text>
        <View className="rounded-2xl overflow-hidden mb-5">
          <List>
            <Item
              thumb={
                <View className="w-14 h-14 rounded-full bg-sky-200 items-center justify-center overflow-hidden">
                  <Text className="text-3xl">🧑</Text>
                </View>
              }
              extra={
                <TouchableOpacity>
                  <Text className="text-sky-600 font-semibold text-base">Edit</Text>
                </TouchableOpacity>
              }
              multipleLine
            >
              <Text className="text-base font-semibold text-slate-800">
                Krystian John Dumapit
              </Text>
              <Item.Brief>kjedumapit@gmail.com</Item.Brief>
            </Item>
          </List>
        </View>

        {/* APP SETTINGS */}
        <Text className="text-xs font-semibold text-gray-400 tracking-widest mb-2 ml-1">
          APP SETTINGS
        </Text>
        <View className="rounded-2xl overflow-hidden mb-5">
          <List>
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
          </List>
        </View>

        {/* DATA */}
        <Text className="text-xs font-semibold text-gray-400 tracking-widest mb-2 ml-1">
          DATA
        </Text>
        <View className="rounded-2xl overflow-hidden mb-5">
          <List>
            <Item
              thumb={<Icon name="download" size={22} color="#374151" />}
              extra={
                <Text className="text-sm font-semibold text-gray-600">PDF, JSON</Text>
              }
              onPress={() => {}}
            >
              Export Journal
            </Item>
            <Item
              thumb={<Icon name="cloud-upload" size={22} color="#374151" />}
              extra={
                <Text className="text-sm text-gray-500">Last sync: 2h ago</Text>
              }
              onPress={() => {}}
            >
              Cloud Backup
            </Item>
          </List>
        </View>

        {/* Sign Out */}
        <TouchableOpacity className="items-center py-4 mb-6" onPress={() => {}}>
          <Text className="text-red-500 text-base font-semibold">Sign Out</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}
