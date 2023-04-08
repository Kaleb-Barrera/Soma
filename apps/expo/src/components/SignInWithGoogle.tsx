import React from "react";
import { useSignIn, useSignUp } from "@clerk/clerk-expo";
import * as AuthSession from "expo-auth-session";
import { Text, TouchableOpacity } from "react-native";
import { styles } from "../utils/Styles";

export default function SignInWithGoogle() {
    const { signIn, setSession, isLoaded } = useSignIn();
    const { signUp } = useSignUp();

    const onPress = React.useCallback(async () => {
        if (!isLoaded) {
            return;
        }

        try {
            const redirectUrl = AuthSession.makeRedirectUri({
                path: "/oauth-native-callback",
            });

            // Choose your OAuth provider, based upon your instance.
            await signIn.create({
                strategy: "oauth_google",
                redirectUrl,
            });

            const {
                firstFactorVerification: { externalVerificationRedirectURL },
            } = signIn;

            if (!externalVerificationRedirectURL)
                throw "Something went wrong during the OAuth flow. Try again.";

            const authResult = await AuthSession.startAsync({
                authUrl: externalVerificationRedirectURL.toString(),
                returnUrl: redirectUrl,
            });

            if (authResult.type !== "success") {
                throw "Something went wrong during the OAuth flow. Try again.";
            }

            // Get the rotatingTokenNonce from the redirect URL parameters
            const { rotating_token_nonce: rotatingTokenNonce } = authResult.params;

            await signIn.reload({ rotatingTokenNonce });

            const { createdSessionId } = signIn;

            if (createdSessionId) {
                // If we have a createdSessionId, then auth was successful
                await setSession(createdSessionId);
            } else {
                // If we have no createdSessionId, then this is a first time sign-in, so
                // we should process this as a signUp instead
                // Throw if we're not in the right state for creating a new user
                if (
                    !signUp ||
                    signIn.firstFactorVerification.status !== "transferable"
                ) {
                    throw "Something went wrong during the Sign up OAuth flow. Please ensure that all sign up requirements are met.";
                }

                console.log(
                    "Didn't have an account transferring, following through with new account sign up"
                );

                // Create user
                await signUp.create({ transfer: true });
                await signUp.reload({
                    rotatingTokenNonce: authResult.params.rotating_token_nonce,
                });
                await setSession(signUp.createdSessionId);
            }
        } catch (err: any) {
            console.log("Error:> " + err?.status || '');
            console.log("Error:> " + err?.errors ? JSON.stringify(err.errors) : err);
        }
    }, []);

    return (
        <TouchableOpacity
            className="my-4 rounded p-3 items-center justify-center bg-white border-2 border-black"
            onPress={onPress}
        >
            <Text className="text-black font-bold mb-5 dark:text-white"> Ingresa con Google</Text>
        </TouchableOpacity>
    );
}
