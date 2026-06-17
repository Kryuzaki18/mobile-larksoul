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
  disabled?: boolean;
  errors?: { name?: string; email?: string; password?: string };
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
  disabled,
  errors,
}: SignUpFormProps) {
  return (
    <>
      <Text className="text-xs font-semibold text-gray-400 tracking-widest mb-3">NAME</Text>
      <View
        className={`bg-white dark:bg-slate-800 rounded-xl px-4 mb-1 border ${
          errors?.name
            ? 'border-red-400 dark:border-red-500'
            : 'border-gray-100 dark:border-slate-700'
        }`}
      >
        <TextInput
          value={name}
          onChangeText={onNameChange}
          placeholder="Jane Doe"
          placeholderTextColor="#9ca3af"
          editable={!disabled && !loading}
          className="py-3.5 text-sm text-slate-800 dark:text-slate-100"
        />
      </View>
      {errors?.name && (
        <Text className="text-xs text-red-500 mb-3 ml-1">{errors.name}</Text>
      )}
      {!errors?.name && <View className="mb-4" />}

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
          placeholderTextColor="#9ca3af"
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

      <Text className="text-xs font-semibold text-gray-400 tracking-widest mb-3">PASSWORD</Text>
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
          placeholderTextColor="#9ca3af"
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
        className={`rounded-xl py-3.5 items-center ${
          disabled || loading ? 'bg-blue-400 dark:bg-blue-900' : 'bg-blue-800'
        }`}
        onPress={onSubmit}
        activeOpacity={0.85}
        disabled={disabled || loading}
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
