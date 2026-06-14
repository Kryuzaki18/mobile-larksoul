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
      <Text className="text-xs font-semibold text-gray-400 tracking-widest mb-3">EMAIL</Text>
      <View className="bg-slate-50 rounded-xl px-4 mb-4 border border-gray-100">
        <TextInput
          value={email}
          onChangeText={onEmailChange}
          placeholder="john@example.com"
          placeholderTextColor="#9ca3af"
          autoCapitalize="none"
          keyboardType="email-address"
          className="py-3.5 text-sm text-slate-800"
        />
      </View>

      <View className="flex-row justify-between items-center mb-3">
        <Text className="text-xs font-semibold text-gray-400 tracking-widest">PASSWORD</Text>
        <TouchableOpacity activeOpacity={0.7}>
          <Text className="text-xs font-semibold text-blue-700">Forgot?</Text>
        </TouchableOpacity>
      </View>
      <View className="bg-slate-50 rounded-xl px-4 mb-5 border border-gray-100">
        <TextInput
          value={password}
          onChangeText={onPasswordChange}
          placeholder="• • • • • • • •"
          placeholderTextColor="#9ca3af"
          secureTextEntry
          className="py-3.5 text-sm text-slate-800"
        />
      </View>

      <TouchableOpacity
        className="bg-blue-800 rounded-xl py-3.5 items-center"
        onPress={onLogin}
        activeOpacity={0.85}
      >
        <View className="flex-row items-center gap-2">
          <Text className="text-white text-sm font-semibold">Login</Text>
          <ArrowRight size={15} color="#fff" />
        </View>
      </TouchableOpacity>
    </>
  );
}
