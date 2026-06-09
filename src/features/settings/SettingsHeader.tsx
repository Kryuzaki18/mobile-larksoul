import { Icon } from '@ant-design/react-native';
import { View, Text, TouchableOpacity } from 'react-native';

export default function SettingsHeader() {

  return (
    <View className="flex-row items-center justify-between px-5 py-3 bg-white border-b border-gray-100">
      <TouchableOpacity className="p-1.5">
        <Icon name="left" size={20} color="#1e293b" />
      </TouchableOpacity>
      <Text className="text-base font-bold text-slate-800">Settings</Text>
      <TouchableOpacity className="p-1.5">
        <Icon name="setting" size={20} color="#1e3a5f" />
      </TouchableOpacity>
    </View>
  );  
}