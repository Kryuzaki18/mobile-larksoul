import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../models/types/navigation.type';

import Login from '../features/Login';
import Home from '../features/home/Home';
import Settings from '../features/Settings';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootStack() {
  return (
    <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Settings" component={Settings} />
    </Stack.Navigator>
  );
}
