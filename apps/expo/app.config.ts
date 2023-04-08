import { ExpoConfig, ConfigContext } from "@expo/config";

const CLERK_PUBLISHABLE_KEY = "pk_test_Y3VyaW91cy13cmVuLTg2LmNsZXJrLmFjY291bnRzLmRldiQ";

const defineConfig = (_ctx: ConfigContext): ExpoConfig => ({
  name: "Soma",
  slug: "soma",
  scheme: "soma",
  version: "1.0.0",
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
    CLERK_PUBLISHABLE_KEY,
  },
  owner: "an26k",
})

export default defineConfig
