import { ExpoConfig, ConfigContext } from "@expo/config";

import { config } from "dotenv";
config()

const defineConfig = (_ctx: ConfigContext): ExpoConfig => ({
  name: "Soma",
  slug: "soma",
  scheme: "soma",
  version: "0.0.2",
  orientation: "portrait",
  icon: "./assets/icon.png",
  userInterfaceStyle: "light",
  splash: {
    image: "./assets/splash.png",
    resizeMode: "contain",
    backgroundColor: "#ffffff"
  },
  assetBundlePatterns: [
    "**/*"
  ],
  ios: {
    supportsTablet: true
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/adaptive-icon.png",
      backgroundColor: "#ffffff"
    }
  },
  web: {
    favicon: "./assets/favicon.png"
  },
  extra: {
    eas: {
      projectId: "68d174ce-4253-4e55-8bd9-8c7865fdf30d"
    },
    CLERK_PUBLISHABLE_KEY: process.env.CLERK_PUBLISHABLE_KEY,
    NEXT_URL: process.env.NEXT_URL,
  },
  owner: "an26k",
})

export default defineConfig
