import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { ArrowRight } from 'lucide-react-native';

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
        <TextInput
          value={email}
          onChangeText={onEmailChange}
          placeholder="john@sample.com"
          placeholderTextColor="#9ca3af"
          autoCapitalize="none"
          keyboardType="email-address"
          className="px-4 py-3 text-sm text-slate-800"
        />
      </View>

      <View className="flex-row justify-between items-center mb-2">
        <Text className="text-sm font-medium text-gray-700">Password</Text>
        <TouchableOpacity>
          <Text className="text-sm text-sky-600 font-semibold">Forgot Password?</Text>
        </TouchableOpacity>
      </View>
      <View className="bg-blue-50 rounded-xl overflow-hidden mb-5">
        <TextInput
          value={password}
          onChangeText={onPasswordChange}
          placeholder="• • • • • • • •"
          placeholderTextColor="#9ca3af"
          secureTextEntry
          className="px-4 py-3 text-sm text-slate-800"
        />
      </View>

      <TouchableOpacity
        className="bg-blue-800 rounded-xl py-3.5 items-center justify-center mb-6"
        onPress={onLogin}
        activeOpacity={0.85}
      >
        <View className="flex-row items-center gap-2">
          <Text className="text-white text-xl font-medium">Login</Text>
          <ArrowRight size={16} color="#fff" />
        </View>
      </TouchableOpacity>
    </>
  );
}
