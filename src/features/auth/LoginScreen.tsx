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
import { signInAsGuest } from '../../services/AuthService';
import { saveSession } from '../../services/sessionService';
import { useAuthStore } from '../../store/authStore';
import LoginForm from './components/LoginForm';
import SocialLoginButtons from './components/SocialLoginButtons';

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

  return (
    <ScrollView
      className="flex-1 bg-white"
      contentContainerClassName="items-center px-6 pt-10 pb-8"
    >
      <Image
        source={require('../../assets/logo.png')}
        className="w-24 h-24 mb-5"
        resizeMode="contain"
      />

      <Text className="text-4xl font-bold text-slate-800 mb-2 w-full text-center">
        Welcome Back
      </Text>
      <Text className="text-gray-400 text-base mb-3 w-full text-center">
        Continue your reflective journey.
      </Text>

      <View className="w-full border border-gray-200 rounded-2xl p-5">
        <TouchableOpacity
          className="bg-blue-800 rounded-xl py-3.5 items-center justify-center mb-3"
          onPress={handleGuestLogin}
          disabled={loading}
          activeOpacity={0.85}
        >
          <View className="flex-row items-center gap-2">
            {loading ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : (
              <>
                <Text className="text-white text-xl font-medium">Continue as Guest</Text>
                <ArrowRight size={16} color="#fff" />
              </>
            )}
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          className="border border-gray-300 rounded-xl py-3.5 items-center justify-center mb-6"
          onPress={() => {}}
          activeOpacity={0.85}
        >
          <Text className="text-base text-gray-700">🔢  Login with PIN</Text>
        </TouchableOpacity>

        <LoginForm
          email={email}
          password={password}
          onEmailChange={setEmail}
          onPasswordChange={setPassword}
          onLogin={() => {}}
        />

        <Text className="text-center text-gray-500 text-sm mb-4">
          Continue with social
        </Text>
        <SocialLoginButtons />
      </View>
    </ScrollView>
  );
}
