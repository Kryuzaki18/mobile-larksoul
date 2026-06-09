import './global.css';
import { useState } from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Login from './src/features/Login';
import Home from './src/features/home/Home';

type Screen = 'login' | 'home';

function App() {
  const isDarkMode = useColorScheme() === 'dark';
  const [screen, setScreen] = useState<Screen>('login');

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      {screen === 'login' ? (
        <Login onGuestLogin={() => setScreen('home')} />
      ) : (
        <Home />
      )}
    </SafeAreaProvider>
  );
}

export default App;
