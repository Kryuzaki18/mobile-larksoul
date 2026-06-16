import React from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { ArrowRight } from 'lucide-react-native';

interface SignUpFormProps {
  name: string;
  email: string;
  password: string;
  onNameChange: (v: string) => void;
  onEmailChange: (v: string) => void;
  onPasswordChange: (v: string) => void;
  onSubmit: () => void;
  loading?: boolean;
}

export default function SignUpForm({
  name,
  email,
  password,
  onNameChange,
  onEmailChange,
  onPasswordChange,
  onSubmit,
  loading,
}: SignUpFormProps) {
  return (
    <>
      <Text className="text-xs font-semibold text-gray-400 tracking-widest mb-3">NAME</Text>
      <View className="bg-white dark:bg-slate-800 rounded-xl px-4 mb-4 border border-gray-100 dark:border-slate-700">
        <TextInput
          value={name}
          onChangeText={onNameChange}
          placeholder="Jane Doe"
          placeholderTextColor="#9ca3af"
          className="py-3.5 text-sm text-slate-800 dark:text-slate-100"
        />
      </View>

      <Text className="text-xs font-semibold text-gray-400 tracking-widest mb-3">EMAIL</Text>
      <View className="bg-white dark:bg-slate-800 rounded-xl px-4 mb-4 border border-gray-100 dark:border-slate-700">
        <TextInput
          value={email}
          onChangeText={onEmailChange}
          placeholder="john@example.com"
          placeholderTextColor="#9ca3af"
          autoCapitalize="none"
          keyboardType="email-address"
          className="py-3.5 text-sm text-slate-800 dark:text-slate-100"
        />
      </View>

      <Text className="text-xs font-semibold text-gray-400 tracking-widest mb-3">PASSWORD</Text>
      <View className="bg-white dark:bg-slate-800 rounded-xl px-4 mb-5 border border-gray-100 dark:border-slate-700">
        <TextInput
          value={password}
          onChangeText={onPasswordChange}
          placeholder="• • • • • • • •"
          placeholderTextColor="#9ca3af"
          secureTextEntry
          className="py-3.5 text-sm text-slate-800 dark:text-slate-100"
        />
      </View>

      <TouchableOpacity
        className="bg-blue-800 rounded-xl py-3.5 items-center"
        onPress={onSubmit}
        activeOpacity={0.85}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#ffffff" />
        ) : (
          <View className="flex-row items-center gap-2">
            <Text className="text-white text-sm font-semibold">Create Account</Text>
            <ArrowRight size={15} color="#fff" />
          </View>
        )}
      </TouchableOpacity>
    </>
  );
}
