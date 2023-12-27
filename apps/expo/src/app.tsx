import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ClerkProvider } from '@clerk/clerk-expo';
import Constants from 'expo-constants';

import { useEffect, useState, createContext } from 'react';

import * as Font from 'expo-font'
import * as SplashScreen from 'expo-splash-screen'
import { Ionicons } from '@expo/vector-icons';

import { AppContext } from './utils/AppContext';
import { tokenCache } from './utils/token_cache';
import Layout from './layout';

import { useDatabase } from './hooks/useDatabase';

import { User } from '@soma/db';

export default function App() {
	const [appReady, setAppReady] = useState(false)
	const [user, setUser] = useState<User>(null)
    const {database, isAvailable} = useDatabase()
  
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
  
	if (!appReady && !isAvailable) {
	  return null
	}

	return (
	  <ClerkProvider publishableKey={Constants.expoConfig.extra?.CLERK_PUBLISHABLE_KEY} tokenCache={tokenCache}>
		<AppContext.Provider value={{database: database, user: user, setUser: setUser}}>
		  <SafeAreaProvider>
			<Layout/>
			<StatusBar />
		  </SafeAreaProvider>
		</AppContext.Provider>
	  </ClerkProvider>
	);
}

