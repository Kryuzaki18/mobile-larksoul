import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ChevronLeft, WifiOff } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import type { RootStackParamList } from '../../models/types/navigation.type';
import type { User } from '../../models/interfaces/users.model';
import {
  signUp,
  signInWithProvider,
  migrateGuestAccount,
  getGoogleSignInError,
} from '../../services/authService';
import { saveSession } from '../../services/sessionService';
import { useAuthStore } from '../../store/authStore';
import { useNetworkStatus } from '../../hooks/useNetworkStatus';
import SignUpForm from './components/SignUpForm';
import SocialLoginButtons from './components/SocialLoginButtons';
import type { SocialProvider } from './components/SocialLoginButtons';

type Nav = NativeStackNavigationProp<RootStackParamList, 'SignUp'>;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function SignUpScreen() {
  const navigation = useNavigation<Nav>();
  const { currentUser, isGuest, setUser } = useAuthStore();
  const { isConnected } = useNetworkStatus();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingProvider, setLoadingProvider] = useState<SocialProvider | null>(null);
  const [formErrors, setFormErrors] = useState<{ name?: string; email?: string; password?: string }>({});

  const isAnyLoading = loading || loadingProvider != null;

  function validateFields(): boolean {
    const errors: { name?: string; email?: string; password?: string } = {};
    if (!name.trim()) {
      errors.name = 'Name is required.';
    }
    if (!email.trim()) {
      errors.email = 'Email is required.';
    } else if (!EMAIL_REGEX.test(email.trim())) {
      errors.email = 'Enter a valid email address.';
    }
    if (!password) {
      errors.password = 'Password is required.';
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters.';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function completeSignIn(user: User) {
    if (isGuest && currentUser && currentUser.id !== user.id) {
      await migrateGuestAccount(currentUser.id, user.id);
    }
    setUser(user, false);
    await saveSession(user.id, false);
    navigation.replace('Home');
  }

  async function handleCreateAccount() {
    if (!validateFields()) return;
    setLoading(true);
    try {
      const user = await signUp(name.trim(), email.trim(), password);
      await completeSignIn(user);
    } catch (e) {
      if (e instanceof Error && e.message.includes('already exists')) {
        setFormErrors(prev => ({ ...prev, email: 'An account with this email already exists.' }));
      } else {
        Alert.alert('Sign Up Failed', e instanceof Error ? e.message : 'Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleProviderSignUp(provider: SocialProvider) {
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
      await completeSignIn(user);
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
          <WifiOff size={13} color="#d97706" />
          <Text className="text-xs font-medium text-amber-700 dark:text-amber-400 flex-1">
            No internet — social sign-in unavailable
          </Text>
        </View>
      )}

      <View className="flex-row items-center px-4 pt-3 pb-3">
        <TouchableOpacity
          className="w-9 h-9 rounded-full bg-white dark:bg-slate-900 items-center justify-center mr-3"
          style={{
            shadowColor: '#000',
            shadowOpacity: 0.06,
            shadowRadius: 4,
            shadowOffset: { width: 0, height: 1 },
            elevation: 2,
          }}
          onPress={() => navigation.goBack()}
          disabled={isAnyLoading}
        >
          <ChevronLeft size={18} color={isDark ? '#e2e8f0' : '#1e293b'} />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-slate-800 dark:text-slate-100">
          Create Account
        </Text>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 8, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View className="items-center justify-center">
          <Image
            source={require('../../assets/logo.png')}
            style={{ width: 120, height: 120, marginBottom: 5 }}
            resizeMode="contain"
          />
        </View>

        <Text className="text-sm text-gray-400 mb-6 text-center">
          Start your personal journal in seconds
        </Text>

        <View className="bg-slate-50 dark:bg-slate-900 rounded-2xl px-5 py-5 mb-5">
          <SignUpForm
            name={name}
            email={email}
            password={password}
            onNameChange={v => { setName(v); setFormErrors(e => ({ ...e, name: undefined })); }}
            onEmailChange={v => { setEmail(v); setFormErrors(e => ({ ...e, email: undefined })); }}
            onPasswordChange={v => { setPassword(v); setFormErrors(e => ({ ...e, password: undefined })); }}
            onSubmit={handleCreateAccount}
            loading={loading}
            disabled={isAnyLoading && !loading}
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
          onSelect={handleProviderSignUp}
        />
        
      </ScrollView>
    </View>
  );
}
