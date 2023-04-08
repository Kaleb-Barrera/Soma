import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ClerkProvider } from '@clerk/clerk-expo';
import Constants from 'expo-constants';

import { tokenCache } from './utils/token_cache';
import Layout from './layout';

export default function App() {
  return (
    <ClerkProvider publishableKey={Constants.expoConfig.extra?.CLERK_PUBLISHABLE_KEY} tokenCache={tokenCache}>
      <SafeAreaProvider>
        <Layout />
        <StatusBar />
      </SafeAreaProvider>
    </ClerkProvider>
  );
}

