import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as React from "react";

import Login from "./screens/login";
import Home from "./screens/home";
import Profile from "./screens/Profile";

import { type RootStackParamList } from "./types/react-navigation";
import { TRPCProvider } from "./utils/trpc";
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
                <TRPCProvider>
                    <Stack.Navigator>
                        <Stack.Screen
                            name="Profile"
                            component={Profile}
                            options={{ headerShown: false }}
                        />
                    </Stack.Navigator>
                </TRPCProvider>
            </SignedIn>
            <SignedOut>
                <Stack.Navigator>
                    <Stack.Screen
                        name="Login"
                        component={Login}
                        options={{ headerShown: false }}
                    />
                </Stack.Navigator>
            </SignedOut>
        </ClerkLoaded>
    );
};
