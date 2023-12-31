import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ClerkProvider } from '@clerk/clerk-expo';
import Constants from 'expo-constants';

import { useEffect, useState } from 'react';

import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { Ionicons } from '@expo/vector-icons';

import { AppContext } from './utils/AppContext';
import { tokenCache } from './utils/token_cache';
import Layout from './layout';

import { useDatabase } from './hooks/useDatabase';

import { type User } from '@soma/db';

export default function App() {
    const [appReady, setAppReady] = useState(false);
    const [user, setUser] = useState<User>(null);
    const { database, isAvailable } = useDatabase();

    useEffect(() => {
        async function loadResources() {
            try {
                void SplashScreen.preventAutoHideAsync();

                const fontAssets = Font.loadAsync(Ionicons.font);

                await Promise.all([fontAssets]);
            } catch (e) {
                console.warn(e);
            } finally {
                void SplashScreen.hideAsync();
                setAppReady(true);
            }
        }

        void loadResources();
    }, []);

    if (!appReady && !isAvailable) {
        return null;
    }

    if (typeof Constants.expoConfig.extra.CLERK_PUBLISHABLE_KEY !== 'string')
        return;

    return (
        <ClerkProvider
            publishableKey={Constants.expoConfig.extra.CLERK_PUBLISHABLE_KEY}
            tokenCache={tokenCache}>
            <AppContext.Provider
                value={{ database: database, user: user, setUser: setUser }}>
                <SafeAreaProvider>
                    <Layout />
                    <StatusBar />
                </SafeAreaProvider>
            </AppContext.Provider>
        </ClerkProvider>
    );
}
