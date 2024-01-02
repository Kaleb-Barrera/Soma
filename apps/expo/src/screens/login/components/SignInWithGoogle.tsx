/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import React from 'react';
import * as WebBrowser from 'expo-web-browser';
import { useWarmUpBrowser } from '../../../hooks/useWarmUpBrowser';
import { useOAuth } from '@clerk/clerk-expo';

import { Text, TouchableOpacity, Image } from 'react-native';

WebBrowser.maybeCompleteAuthSession();

export default function SignInWithGoogle() {
    useWarmUpBrowser();
    const [didError, setDidError] = React.useState(false);

    const { startOAuthFlow } = useOAuth({ strategy: 'oauth_google' });

    const onPress = React.useCallback(async () => {
        try {
            setDidError(false);
            const { createdSessionId, setActive } = await startOAuthFlow();

            if (createdSessionId) {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-call
                setActive({ session: createdSessionId });
            } else {
                // Use signIn or signUp for next steps such as MFA
            }
        } catch (err) {
            console.error('OAuth error', err);
            setDidError(true);
        }
    }, [startOAuthFlow]);

    return (
        <>
            <TouchableOpacity
                className="flex flex-row px-4 py-2 border border-slate-950 rounded-lg hover:border-slate-700 hover:shadow transition duration-150 items-center justify-center bg-white dark:bg-gray-900 dark:border-slate-200"
                onPress={onPress}>
                <Image
                    source={require('../../../../assets/google-logo.png')}
                    className="w-6 h-6"
                    alt="Google"
                />

                <Text className="text-2xl text-slate-700 dark:text-slate-200">
                    {' '}
                    Ingresa con Google
                </Text>
            </TouchableOpacity>
            {didError ? (
                <Text className="font-semibold text-red-700 dark:text-red-300 text-lg text-center mx-10 mt-2">
                    Hubo un problema al iniciar sesión, por favor intenta de
                    nuevo
                </Text>
            ) : (
                <></>
            )}
        </>
    );
}
