import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../models/types/navigation.type';
import { SafeAreaView } from 'react-native-safe-area-context';

import Login from '../features/Login';
import Home from '../features/home/Home';
import Settings from '../features/settings/Settings';

const Stack = createNativeStackNavigator<RootStackParamList>();

function SSafeAreaProvider({ children }: { children: React.ReactNode }) {
  const SafeAreaProvider = require('react-native-safe-area-context').SafeAreaProvider;
  return <SafeAreaProvider>{children}</SafeAreaProvider>;
}

export default function RootStack() {
  return (
    <SSafeAreaProvider>
      <SafeAreaView style={{ flex: 1}}>
        <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="Settings" component={Settings} />
        </Stack.Navigator>
      </SafeAreaView>
    </SSafeAreaProvider>
  );
}


