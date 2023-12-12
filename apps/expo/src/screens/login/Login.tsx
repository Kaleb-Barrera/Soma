import React from "react";
import { View, Image, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useColorScheme } from "nativewind";
import Ionicons from "@expo/vector-icons/Ionicons";
// import { type RootStackScreenProps } from "../types/react-navigation"

import SignInWithGoogle from "./components/SignInWithGoogle";

//{ navigation, }: RootStackScreenProps<"Login">
export default function LoginScreen() {
    const { toggleColorScheme, colorScheme } = useColorScheme();

    return (
        <SafeAreaView className="flex-1 bg-blue-700">
            <View className="flex-1 justify-end mt-40 bg-white dark:bg-slate-800">
                <Image source={require("../../../assets/soma-login.png")} resizeMode={"contain"} className="w-full h-auto" />
            </View>
            <View className="flex-1 items-center bg-white dark:bg-slate-800">
                <SignInWithGoogle />
            </View>
            <View className="items-center pb-6 bg-white dark:bg-slate-800">
                <TouchableOpacity onPress={toggleColorScheme}>
                    {
                        colorScheme === 'light'
                            ? (<Ionicons name="sunny-sharp" size={48} />)
                            : (<Ionicons name="moon-sharp" color={"white"} size={48} />)
                    }
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}
