import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Button, Icon, Input } from '@ant-design/react-native';

interface LoginFormProps {
  email: string;
  password: string;
  onEmailChange: (v: string) => void;
  onPasswordChange: (v: string) => void;
  onLogin: () => void;
}

export default function LoginForm({
  email,
  password,
  onEmailChange,
  onPasswordChange,
  onLogin,
}: LoginFormProps) {
  return (
    <>
      <View className="flex-row items-center mb-5">
        <View className="flex-1 h-px bg-gray-300" />
        <Text className="mx-4 text-gray-500 text-sm">OR</Text>
        <View className="flex-1 h-px bg-gray-300" />
      </View>

      <Text className="text-sm font-medium text-gray-700 mb-2">Email</Text>
      <View className="bg-blue-50 rounded-xl overflow-hidden mb-4">
        <Input
          value={email}
          onChangeText={onEmailChange}
          placeholder="john@sample.com"
          placeholderTextColor="#9ca3af"
          autoCapitalize="none"
          keyboardType="email-address"
        />
      </View>

      <View className="flex-row justify-between items-center mb-2">
        <Text className="text-sm font-medium text-gray-700">Password</Text>
        <TouchableOpacity>
          <Text className="text-sm text-sky-600 font-semibold">Forgot Password?</Text>
        </TouchableOpacity>
      </View>
      <View className="bg-blue-50 rounded-xl mb-5">
        <Input
          value={password}
          onChangeText={onPasswordChange}
          placeholder="• • • • • • • •"
          placeholderTextColor="#9ca3af"
          type="password"
        />
      </View>

      <View className="mb-6">
        <Button type="primary" size="large" onPress={onLogin}>
          <View className="flex-row items-center">
            <Text className="text-white text-xl font-medium">Login</Text>
            <View className="ml-2">
              <Icon name="arrow-right" size={16} color="#fff" />
            </View>
          </View>
        </Button>
      </View>
    </>
  );
}
