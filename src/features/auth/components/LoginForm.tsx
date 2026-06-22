import React from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { ArrowRight } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import { Colors } from '../../../utils/themes';
import { useActiveTheme } from '../../../hooks/useActiveTheme';

interface LoginFormProps {
  email: string;
  password: string;
  onEmailChange: (v: string) => void;
  onPasswordChange: (v: string) => void;
  onLogin: () => void;
  loading?: boolean;
  disabled?: boolean;
  errors?: { email?: string; password?: string };
}

export default function LoginForm({
  email,
  password,
  onEmailChange,
  onPasswordChange,
  onLogin,
  loading,
  disabled,
  errors,
}: LoginFormProps) {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const theme = useActiveTheme();
  return (
    <>
      <Text className="text-xs font-semibold text-gray-400 tracking-widest mb-3">EMAIL</Text>
      <View
        className={`bg-white dark:bg-slate-800 rounded-xl px-4 mb-1 border ${
          errors?.email
            ? 'border-red-400 dark:border-red-500'
            : 'border-gray-100 dark:border-slate-700'
        }`}
      >
        <TextInput
          value={email}
          onChangeText={onEmailChange}
          placeholder="john@example.com"
          placeholderTextColor={Colors.gray400}
          autoCapitalize="none"
          keyboardType="email-address"
          editable={!disabled && !loading}
          className="py-3.5 text-sm text-slate-800 dark:text-slate-100"
        />
      </View>
      {errors?.email && (
        <Text className="text-xs text-red-500 mb-3 ml-1">{errors.email}</Text>
      )}
      {!errors?.email && <View className="mb-4" />}

      <View className="flex-row justify-between items-center mb-3">
        <Text className="text-xs font-semibold text-gray-400 tracking-widest">PASSWORD</Text>
        <TouchableOpacity activeOpacity={0.7}>
          <Text className="text-xs font-semibold" style={{ color: isDark ? theme[400] : theme[700] }}>Forgot?</Text>
        </TouchableOpacity>
      </View>
      <View
        className={`bg-white dark:bg-slate-800 rounded-xl px-4 mb-1 border ${
          errors?.password
            ? 'border-red-400 dark:border-red-500'
            : 'border-gray-100 dark:border-slate-700'
        }`}
      >
        <TextInput
          value={password}
          onChangeText={onPasswordChange}
          placeholder="• • • • • • • •"
          placeholderTextColor={Colors.gray400}
          secureTextEntry
          editable={!disabled && !loading}
          className="py-3.5 text-sm text-slate-800 dark:text-slate-100"
        />
      </View>
      {errors?.password && (
        <Text className="text-xs text-red-500 mb-3 ml-1">{errors.password}</Text>
      )}
      {!errors?.password && <View className="mb-5" />}

      <TouchableOpacity
        className="rounded-xl py-3.5 items-center"
        style={{ backgroundColor: disabled || loading ? (isDark ? theme[900] : theme[400]) : theme[800] }}
        onPress={onLogin}
        activeOpacity={0.85}
        disabled={disabled || loading}
      >
        {loading ? (
          <ActivityIndicator size="small" color={Colors.white} />
        ) : (
          <View className="flex-row items-center gap-2">
            <Text className="text-white text-sm font-semibold">Login</Text>
            <ArrowRight size={15} color={Colors.white} />
          </View>
        )}
      </TouchableOpacity>
    </>
  );
}
