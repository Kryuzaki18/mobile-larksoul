import { useState, useEffect } from 'react';
import NetInfo from '@react-native-community/netinfo';

export function useNetworkStatus() {
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected === true && state.isInternetReachable !== false);
    });
    NetInfo.fetch().then(state => {
      setIsConnected(state.isConnected === true && state.isInternetReachable !== false);
    });
    return () => unsubscribe();
  }, []);

  return { isConnected };
}
