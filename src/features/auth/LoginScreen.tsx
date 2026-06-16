import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ArrowRight } from 'lucide-react-native';
import type { RootStackParamList } from '../../models/types/navigation.type';
import { signInAsGuest } from '../../services/AuthService';
import { saveSession } from '../../services/sessionService';
import { hasPinLock } from '../../services/securityService';
import { useAuthStore } from '../../store/authStore';
import { useSecurityStore } from '../../store/securityStore';
import LoginForm from './components/LoginForm';
import SocialLoginButtons from './components/SocialLoginButtons';
import PinLockScreen from './PinLockScreen';

type LoginNav = NativeStackNavigationProp<RootStackParamList, 'Login'>;

export default function LoginScreen() {
  const navigation = useNavigation<LoginNav>();
  const { setUser } = useAuthStore();
  const { setPinEnabled } = useSecurityStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPinLogin, setShowPinLogin] = useState(false);

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

  async function handlePinLoginPress() {
    const pinEnabled = await hasPinLock();
    if (!pinEnabled) {
      Alert.alert(
        'No PIN Set Up',
        'Sign in first, then enable PIN lock from Settings to use this.',
      );
      return;
    }
    setShowPinLogin(true);
  }

  async function handlePinLoginSuccess() {
    setPinEnabled(true);
    const user = await signInAsGuest();
    setUser(user, true);
    await saveSession(user.id, true);
    setShowPinLogin(false);
    navigation.replace('Home');
  }

  if (showPinLogin) {
    return (
      <PinLockScreen
        title="Enter your PIN"
        subtitle="Quick access to your journal"
        onSuccess={handlePinLoginSuccess}
        onCancel={() => setShowPinLogin(false)}
      />
    );
  }

  return (
    <View className="flex-1 bg-slate-50">
      <View className="items-center pt-14 pb-8 px-6">
        <Image
          source={require('../../assets/logo.png')}
          style={{ width: 72, height: 72, marginBottom: 16 }}
          resizeMode="contain"
        />
        <Text className="text-3xl font-bold text-slate-800 mb-1.5">Welcome back</Text>
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
          className="bg-blue-800 rounded-2xl py-4 items-center mb-3"
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

        <TouchableOpacity
          className="bg-white border border-gray-100 rounded-2xl py-4 items-center mb-6"
          onPress={handlePinLoginPress}
          activeOpacity={0.7}
        >
          <Text className="text-sm font-medium text-slate-700">🔢  Login with PIN</Text>
        </TouchableOpacity>

        <View className="flex-row items-center mb-5">
          <View className="flex-1 h-px bg-gray-200" />
          <Text className="mx-4 text-xs font-medium text-gray-400 tracking-wider">OR</Text>
          <View className="flex-1 h-px bg-gray-200" />
        </View>

        <View className="bg-white rounded-2xl px-5 py-5 mb-5">
          <LoginForm
            email={email}
            password={password}
            onEmailChange={setEmail}
            onPasswordChange={setPassword}
            onLogin={() => {}}
          />
        </View>

        <View className="flex-row items-center mb-4">
          <View className="flex-1 h-px bg-gray-200" />
          <Text className="mx-4 text-xs font-medium text-gray-400">or continue with</Text>
          <View className="flex-1 h-px bg-gray-200" />
        </View>
        <SocialLoginButtons />
      </ScrollView>
    </View>
  );
}
