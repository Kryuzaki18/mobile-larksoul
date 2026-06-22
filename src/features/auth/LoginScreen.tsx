import React, { useState, useEffect } from 'react';
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
import { ArrowRight, WifiOff } from 'lucide-react-native';
import type { RootStackParamList } from '../../models/types/navigation.type';
import {
  signInAsGuest,
  signIn,
  signInWithProvider,
  getGoogleSignInError,
} from '../../services/authService';
import { saveSession } from '../../services/sessionService';
import { useAuthStore } from '../../store/authStore';
import { hasRegisteredUser } from '../../database/functions/users';
import { useNetworkStatus } from '../../hooks/useNetworkStatus';
import LoginForm from './components/LoginForm';
import SocialLoginButtons from './components/SocialLoginButtons';
import type { SocialProvider } from './components/SocialLoginButtons';
import { Colors } from '../../utils/colors';

type LoginNav = NativeStackNavigationProp<RootStackParamList, 'Login'>;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginScreen() {
  const navigation = useNavigation<LoginNav>();
  const { setUser } = useAuthStore();
  const { isConnected } = useNetworkStatus();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [guestLoading, setGuestLoading] = useState(false);
  const [loadingProvider, setLoadingProvider] = useState<SocialProvider | null>(null);
  const [showGuestButton, setShowGuestButton] = useState(true);
  const [formErrors, setFormErrors] = useState<{ email?: string; password?: string }>({});

  const isAnyLoading = guestLoading || loginLoading || loadingProvider != null;

  useEffect(() => {
    hasRegisteredUser().then(has => {
      if (has) setShowGuestButton(false);
    });
  }, []);

  function validateLoginFields(): boolean {
    const errors: { email?: string; password?: string } = {};
    if (!email.trim()) {
      errors.email = 'Email is required.';
    } else if (!EMAIL_REGEX.test(email.trim())) {
      errors.email = 'Enter a valid email address.';
    }
    if (!password) {
      errors.password = 'Password is required.';
    } else if (password.length < 7) {
      errors.password = 'Password must be at least 7 characters.';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleLogin() {
    if (!validateLoginFields()) return;
    setLoginLoading(true);
    try {
      const user = await signIn(email.trim(), password);
      setUser(user, false);
      await saveSession(user.id, false);
      navigation.replace('Home');
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Please try again.';
      if (message.includes('No account found')) {
        setFormErrors({ email: message });
      } else if (message.includes('Incorrect password')) {
        setFormErrors({ password: message });
      } else {
        Alert.alert('Login Failed', message);
      }
    } finally {
      setLoginLoading(false);
    }
  }

  async function handleGuestLogin() {
    setGuestLoading(true);
    try {
      const user = await signInAsGuest();
      setUser(user, true);
      await saveSession(user.id, true);
      navigation.replace('Home');
    } finally {
      setGuestLoading(false);
    }
  }

  async function handleProviderLogin(provider: SocialProvider) {
    if (!isConnected) {
      Alert.alert(
        'No Internet Connection',
        `${provider === 'google' ? 'Google' : 'Apple'} Sign-In requires an internet connection.`,
      );
      return;
    }
    setLoadingProvider(provider);
    try {
      const user = await signInWithProvider(provider);
      if (!user) return;
      setUser(user, false);
      await saveSession(user.id, false);
      navigation.replace('Home');
    } catch (error) {
      const message =
        provider === 'google'
          ? getGoogleSignInError(error)
          : error instanceof Error
            ? error.message
            : 'Apple Sign-In failed. Please try again.';
      Alert.alert('Sign-In Failed', message);
    } finally {
      setLoadingProvider(null);
    }
  }

  return (
    <View className="flex-1 bg-white dark:bg-slate-950">
      {!isConnected && (
        <View className="flex-row items-center gap-2 px-4 py-2.5 bg-amber-50 dark:bg-amber-500/10 border-b border-amber-100 dark:border-amber-500/20">
          <WifiOff size={13} color={Colors.amber600} />
          <Text className="text-xs font-medium text-amber-700 dark:text-amber-400 flex-1">
            No internet — social sign-in unavailable
          </Text>
        </View>
      )}

      <View className="items-center pt-14 pb-8 px-6">
        <Image
          source={require('../../assets/logo.png')}
          style={{ width: 120, height: 120, marginBottom: 5 }}
          resizeMode="contain"
        />
        <Text className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-1">
          Welcome back!
        </Text>
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
        {showGuestButton && (
          <>
            <TouchableOpacity
              className="bg-blue-800 rounded-2xl py-4 items-center mb-6"
              onPress={handleGuestLogin}
              disabled={isAnyLoading}
              activeOpacity={0.85}
            >
              {guestLoading ? (
                <ActivityIndicator size="small" color={Colors.white} />
              ) : (
                <View className="flex-row items-center gap-2">
                  <Text className="text-white text-base font-semibold">Continue as Guest</Text>
                  <ArrowRight size={16} color={Colors.white} />
                </View>
              )}
            </TouchableOpacity>

            <View className="flex-row items-center mb-5">
              <View className="flex-1 h-px bg-gray-200 dark:bg-slate-800" />
              <Text className="mx-4 text-xs font-medium text-gray-400 tracking-wider">OR</Text>
              <View className="flex-1 h-px bg-gray-200 dark:bg-slate-800" />
            </View>
          </>
        )}

        <View className="bg-slate-50 dark:bg-slate-900 rounded-2xl px-5 py-5 mb-5">
          <LoginForm
            email={email}
            password={password}
            onEmailChange={v => { setEmail(v); setFormErrors(e => ({ ...e, email: undefined })); }}
            onPasswordChange={v => { setPassword(v); setFormErrors(e => ({ ...e, password: undefined })); }}
            onLogin={handleLogin}
            loading={loginLoading}
            disabled={isAnyLoading && !loginLoading}
            errors={formErrors}
          />
        </View>

        <View className="flex-row items-center mb-4">
          <View className="flex-1 h-px bg-gray-200 dark:bg-slate-800" />
          <Text className="mx-4 text-xs font-medium text-gray-400">or continue with</Text>
          <View className="flex-1 h-px bg-gray-200 dark:bg-slate-800" />
        </View>

        <SocialLoginButtons
          providers={['google', 'apple']}
          loadingProvider={loadingProvider}
          disabled={isAnyLoading || !isConnected}
          onSelect={handleProviderLogin}
        />

        <View className="flex-row items-center justify-center mt-6">
          <Text className="text-sm text-gray-400">Don't have an account? </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('SignUp')}
            disabled={isAnyLoading}
            activeOpacity={0.7}
          >
            <Text className="text-sm font-semibold text-blue-700 dark:text-blue-400">Sign Up</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
