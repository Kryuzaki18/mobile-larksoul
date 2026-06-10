import React, { useState } from 'react';
import { View, Text, Image, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Button, Icon } from '@ant-design/react-native';
import type { RootStackParamList } from '../../models/types/navigation.type';
import LoginForm from './components/LoginForm';
import SocialLoginButtons from './components/SocialLoginButtons';

type LoginNav = NativeStackNavigationProp<RootStackParamList, 'Login'>;

export default function LoginScreen() {
  const navigation = useNavigation<LoginNav>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

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
        <View className="mb-3">
          <Button type="primary" size="large" onPress={() => navigation.replace('Home')}>
            <View className="flex-row items-center">
              <Text className="text-white text-xl font-medium">Continue as Guest</Text>
              <View className="ml-2">
                <Icon name="arrow-right" size={16} color="#fff" />
              </View>
            </View>
          </Button>
        </View>

        <View className="mb-6">
          <Button size="large" onPress={() => {}}>
            🔢  Login with PIN
          </Button>
        </View>

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
