import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as React from "react";

import Login from "./screens/Login";
import Profile from "./screens/Profile";
import { type RootStackParamList } from "./types/react-navigation";
import { ClerkLoaded, SignedIn, SignedOut } from "@clerk/clerk-expo";

export default function Layout() {
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
            <SignedIn>
                <Stack.Navigator>
                    <Stack.Screen
                        name="Profile"
                        component={Profile}
                        options={{ title: "Mi perfil " }}
                    />
                </Stack.Navigator>
            </SignedIn>
            <SignedOut>
                <Stack.Navigator>
                    <Stack.Screen
                        name="Login"
                        component={Login}
                        options={{ title: " Inicia sesión " }}
                    />
                </Stack.Navigator>
            </SignedOut>
        </ClerkLoaded>
    );
};
