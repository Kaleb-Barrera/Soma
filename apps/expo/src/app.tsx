import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ClerkProvider } from '@clerk/clerk-expo';
import Constants from 'expo-constants';
/*
import { useEffect, useState } from 'react';

import * as Font from 'expo-font'
import * as SplashScreen from 'expo-splash-screen'
import { Ionicons } from '@expo/vector-icons';
*/
import { tokenCache } from './utils/token_cache';
import Layout from './layout';

export default function App() {
  /*  
    const [appReady, setAppReady] = useState(false)
  
    useEffect(() => {
      async function loadResources() {
        try {
          SplashScreen.preventAutoHideAsync()
  
          const fontAssets = Font.loadAsync(Ionicons.font)
  
          await Promise.all([fontAssets])
        }
        catch (e) {
          console.warn(e)
        }
        finally {
          SplashScreen.hideAsync()
          setAppReady(true)
        }
      }
  
      loadResources()
    }, [])
  
    if (!appReady) {
      return null
    }
  */
  return (
    <ClerkProvider publishableKey={Constants.expoConfig.extra?.CLERK_PUBLISHABLE_KEY} tokenCache={tokenCache}>
      <SafeAreaProvider>
        <Layout />
        <StatusBar />
      </SafeAreaProvider>
    </ClerkProvider>
  );
}

