import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ClerkProvider } from '@clerk/clerk-expo';
import * as SecureStore from "expo-secure-store";

import Navigation from './navigation';

const tokenCache = {
  getToken(key: string) {
    return SecureStore.getItemAsync(key);
  },
  saveToken(key: string, value: string) {
    return SecureStore.setItemAsync(key, value);
  }
};

export default function App() {
  return (
    <ClerkProvider publishableKey='pk_test_Y3VyaW91cy13cmVuLTg2LmNsZXJrLmFjY291bnRzLmRldiQ' tokenCache={tokenCache}>
      <SafeAreaProvider>
        <Navigation />
        <StatusBar />
      </SafeAreaProvider>
    </ClerkProvider>
  );
}

