import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Button, Input } from '@ant-design/react-native';
import type { RootStackParamList } from '../models/types/navigation.type';
import GmailIcon from '../assets/gmail.svg';
import XIcon from '../assets/x.svg';
import FbIcon from '../assets/fb.svg';
import InstagramIcon from '../assets/instagram.svg';

type LoginNav = NativeStackNavigationProp<RootStackParamList, 'Login'>;

export default function Login() {
  const navigation = useNavigation<LoginNav>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <>
      <ScrollView
        className="flex-1 bg-white"
        contentContainerClassName="items-center px-6 pt-10 pb-8"
      >
        <Image
          source={require('../assets/logo.png')}
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
              Continue as Guest  →
            </Button>
          </View>

          <View className="mb-6">
            <Button size="large" onPress={() => {}}>
              🔢  Login with PIN
            </Button>
          </View>

          <View className="flex-row items-center mb-5">
            <View className="flex-1 h-px bg-gray-300" />
            <Text className="mx-4 text-gray-500 text-sm">OR</Text>
            <View className="flex-1 h-px bg-gray-300" />
          </View>

          <Text className="text-sm font-medium text-gray-700 mb-2">Email</Text>
          <View className="bg-blue-50 rounded-xl overflow-hidden mb-4">
            <Input
              value={email}
              onChangeText={setEmail}
              placeholder="john@sample.com"
              placeholderTextColor="#9ca3af"
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-sm font-medium text-gray-700">Password</Text>
            <TouchableOpacity>
              <Text className="text-sm text-sky-600 font-semibold">
                Forgot Password?
              </Text>
            </TouchableOpacity>
          </View>
          <View className="bg-blue-50 rounded-xl mb-5">
            <Input
              value={password}
              onChangeText={setPassword}
              placeholder="• • • • • • • •"
              placeholderTextColor="#9ca3af"
              type="password"
            />
          </View>

          <View className="mb-6">
            <Button type="primary" size="large" onPress={() => {}}>
              Login  →
            </Button>
          </View>

          <Text className="text-center text-gray-500 text-sm mb-4">
            Continue with social
          </Text>
          <View className="flex-row justify-center gap-4">
            <TouchableOpacity className="w-14 h-14 rounded-full border border-gray-100 bg-white items-center justify-center shadow-sm">
              <GmailIcon width={28} height={28} />
            </TouchableOpacity>

            <TouchableOpacity className="w-14 h-14 rounded-full border border-gray-100 bg-white items-center justify-center shadow-sm">
              <XIcon width={28} height={28} />
            </TouchableOpacity>

            <TouchableOpacity className="w-14 h-14 rounded-full border border-gray-100 bg-white items-center justify-center shadow-sm">
              <FbIcon width={28} height={28} />
            </TouchableOpacity>

            <TouchableOpacity className="w-14 h-14 rounded-full border border-gray-100 bg-white items-center justify-center shadow-sm">
              <InstagramIcon width={28} height={28} />
            </TouchableOpacity>
          </View>

        </View>
      </ScrollView>
    </>
  );
}
