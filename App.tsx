import './global.css';
import { useEffect } from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { DefaultTheme, DarkTheme, NavigationContainer } from '@react-navigation/native';
import BootSplash from 'react-native-bootsplash';
import RootStack from './src/navigation/RootStack';
import { configureGoogleSignIn } from './src/services/authService';

// Configure Google Sign-In once at module load time (before any navigation renders)
configureGoogleSignIn();

const NAV_LIGHT = { ...DefaultTheme, colors: { ...DefaultTheme.colors, background: '#f1f5f9' } };
const NAV_DARK  = { ...DarkTheme,   colors: { ...DarkTheme.colors,   background: '#020617' } };

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  useEffect(() => {
    BootSplash.hide({ fade: true });
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <NavigationContainer theme={isDarkMode ? NAV_DARK : NAV_LIGHT}>
        <RootStack />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default App;
