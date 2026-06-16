import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ArrowRight } from 'lucide-react-native';
import type { RootStackParamList } from '../../models/types/navigation.type';
import { signInAsGuest, signInWithProvider } from '../../services/AuthService';
import { saveSession } from '../../services/sessionService';
import { useAuthStore } from '../../store/authStore';
import LoginForm from './components/LoginForm';
import SocialLoginButtons from './components/SocialLoginButtons';
import type { SocialProvider } from './components/SocialLoginButtons';

type LoginNav = NativeStackNavigationProp<RootStackParamList, 'Login'>;

export default function LoginScreen() {
  const navigation = useNavigation<LoginNav>();
  const { setUser } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleGuestLogin() {
    setLoading(true);
    try {
      const user = await signInAsGuest();
      setUser(user, true);
      await saveSession(user.id, true);
      navigation.replace('Home');
    } finally {
      setLoading(false);
    }
  }

  async function handleProviderLogin(provider: SocialProvider) {
    setLoading(true);
    try {
      const user = await signInWithProvider(provider);
      setUser(user, false);
      await saveSession(user.id, false);
      navigation.replace('Home');
    } finally {
      setLoading(false);
    }
  }

  return (
    <View className="flex-1 bg-white dark:bg-slate-950">
      <View className="items-center pt-14 pb-8 px-6">
        <Image
          source={require('../../assets/logo.png')}
          style={{ width: 120, height: 120, marginBottom: 5 }}
          resizeMode="contain"
        />
        <Text className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-1">Welcome back!</Text>
        <Text className="text-sm text-gray-400 text-center">
          Your personal space for reflection
        </Text>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <TouchableOpacity
          className="bg-blue-800 rounded-2xl py-4 items-center mb-6"
          onPress={handleGuestLogin}
          disabled={loading}
          activeOpacity={0.85}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#ffffff" />
          ) : (
            <View className="flex-row items-center gap-2">
              <Text className="text-white text-base font-semibold">Continue as Guest</Text>
              <ArrowRight size={16} color="#fff" />
            </View>
          )}
        </TouchableOpacity>

        <View className="flex-row items-center mb-5">
          <View className="flex-1 h-px bg-gray-200 dark:bg-slate-800" />
          <Text className="mx-4 text-xs font-medium text-gray-400 tracking-wider">OR</Text>
          <View className="flex-1 h-px bg-gray-200 dark:bg-slate-800" />
        </View>

        <View className="bg-slate-50 dark:bg-slate-900 rounded-2xl px-5 py-5 mb-5">
          <LoginForm
            email={email}
            password={password}
            onEmailChange={setEmail}
            onPasswordChange={setPassword}
            onLogin={() => {}}
          />
        </View>

        <View className="flex-row items-center mb-4">
          <View className="flex-1 h-px bg-gray-200 dark:bg-slate-800" />
          <Text className="mx-4 text-xs font-medium text-gray-400">or continue with</Text>
          <View className="flex-1 h-px bg-gray-200 dark:bg-slate-800" />
        </View>
        <SocialLoginButtons providers={['google', 'apple']} onSelect={handleProviderLogin} />

        <View className="flex-row items-center justify-center mt-6">
          <Text className="text-sm text-gray-400">Don't have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('SignUp')} activeOpacity={0.7}>
            <Text className="text-sm font-semibold text-blue-700 dark:text-blue-400">Sign Up</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
