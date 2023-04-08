import React from "react";
import { View } from "react-native";
// import { type RootStackScreenProps } from "../types/react-navigation"

import SignInWithGoogle from "../components/SignInWithGoogle";

//{ navigation, }: RootStackScreenProps<"Login">
export default function LoginScreen() {
    return (
        <View className="flex-1 items-center justify-center bg-white">
            <View className="w-96 border-b-2 border-black mb-2">
                <SignInWithGoogle />
            </View>
        </View>
    );
}
