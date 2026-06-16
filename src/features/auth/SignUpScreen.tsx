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
import { ChevronLeft } from 'lucide-react-native';
import type { RootStackParamList } from '../../models/types/navigation.type';
import type { User } from '../../models/interfaces/users.model';
import { signUp, signInWithProvider } from '../../services/AuthService';
import { saveSession } from '../../services/sessionService';
import { useAuthStore } from '../../store/authStore';
import SignUpForm from './components/SignUpForm';
import SocialLoginButtons from './components/SocialLoginButtons';
import type { SocialProvider } from './components/SocialLoginButtons';

type Nav = NativeStackNavigationProp<RootStackParamList, 'SignUp'>;

export default function SignUpScreen() {
  const navigation = useNavigation<Nav>();
  const { setUser } = useAuthStore();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function completeSignIn(user: User) {
    setUser(user, false);
    await saveSession(user.id, false);
    navigation.replace('Home');
  }

  async function handleCreateAccount() {
    if (!name.trim() || !email.trim() || !password.trim()) {
      Alert.alert(
        'Missing info',
        'Please fill in your name, email, and password.',
      );
      return;
    }
    setLoading(true);
    try {
      const user = await signUp(name.trim(), email.trim(), password);
      await completeSignIn(user);
    } catch (e) {
      Alert.alert(
        'Sign Up Failed',
        e instanceof Error ? e.message : 'Please try again.',
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleProviderSignUp(provider: SocialProvider) {
    setLoading(true);
    try {
      const user = await signInWithProvider(provider);
      await completeSignIn(user);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View className="flex-1 bg-white">
      <View className="flex-row items-center px-4 pt-3 pb-3">
        <TouchableOpacity
          className="w-9 h-9 rounded-full bg-white items-center justify-center mr-3"
          style={{
            shadowColor: '#000',
            shadowOpacity: 0.06,
            shadowRadius: 4,
            shadowOffset: { width: 0, height: 1 },
            elevation: 2,
          }}
          onPress={() => navigation.goBack()}
        >
          <ChevronLeft size={18} color="#1e293b" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-slate-800">Create Account</Text>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingTop: 8,
          paddingBottom: 40,
        }}
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

        <View className="bg-white rounded-2xl px-5 py-5 mb-5">
          <SignUpForm
            name={name}
            email={email}
            password={password}
            onNameChange={setName}
            onEmailChange={setEmail}
            onPasswordChange={setPassword}
            onSubmit={handleCreateAccount}
            loading={loading}
          />
        </View>

        <View className="flex-row items-center mb-4">
          <View className="flex-1 h-px bg-gray-200" />
          <Text className="mx-4 text-xs font-medium text-gray-400">
            or continue with
          </Text>
          <View className="flex-1 h-px bg-gray-200" />
        </View>
        <SocialLoginButtons
          providers={['google', 'apple']}
          onSelect={handleProviderSignUp}
        />
      </ScrollView>
    </View>
  );
}
