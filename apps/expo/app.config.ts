import type { ExpoConfig, ConfigContext } from '@expo/config';

import { config } from 'dotenv';
config();

const defineConfig = (_ctx: ConfigContext): ExpoConfig => ({
    name: 'Soma',
    slug: 'soma',
    scheme: 'soma',
    version: '0.0.2',
    orientation: 'portrait',
    icon: './assets/icon.png',
    userInterfaceStyle: 'light',
    splash: {
        image: './assets/splash.png',
        resizeMode: 'contain',
        backgroundColor: '#ffffff',
    },
    assetBundlePatterns: ['**/*'],
    ios: {
        supportsTablet: true,
    },
    android: {
        adaptiveIcon: {
            foregroundImage: './assets/adaptive-icon.png',
            backgroundColor: '#ffffff',
        },
    },
    web: {
        favicon: './assets/favicon.png',
    },
    extra: {
        CLERK_PUBLISHABLE_KEY: process.env.CLERK_PUBLISHABLE_KEY,
        SERVER_URL: process.env.SERVER_URL,
    },
});

export default defineConfig;
