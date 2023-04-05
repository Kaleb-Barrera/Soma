import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as React from "react";

import LoginScreen from "../screens/LoginScreen";
import MyProfileScreen from "../screens/MyProfileScreen";
import { RootStackParamList } from "./types";
import { ClerkLoaded, SignedIn, SignedOut } from "@clerk/clerk-expo";

export default function Navigation() {
    return (
        <NavigationContainer>
            <RootNavigator />
        </NavigationContainer>
    );
}

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator = () => {

    return (
        <ClerkLoaded>
            <Stack.Navigator>
                <SignedIn>
                    <Stack.Screen
                        name="MyProfile"
                        component={MyProfileScreen}
                        options={{ title: "Mi perfil " }}
                    />
                </SignedIn>
                <SignedOut>
                    <Stack.Screen
                        name="SignIn"
                        component={LoginScreen}
                        options={{ title: " Inicia sesión " }}
                    />
                </SignedOut>
            </Stack.Navigator>
        </ClerkLoaded>
    );
};
