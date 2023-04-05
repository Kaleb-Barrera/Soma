import React from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { RootStackScreenProps } from "../navigation/types";
import { SignInWithOauth } from "../components/SignInWithOauth";
import { SignUpWithOauth } from "../components/SignUpWithOauth";
import { styles } from "../components/Styles";

export default function LoginScreen({
    navigation,
}: RootStackScreenProps<"SignIn">) {
    return (
        <View style={styles.container}>
            <View style={styles.oauthView}>
                <Text style={styles.titleText}> ¿Ya tienes una cuenta?</Text>
                <SignInWithOauth />
            </View>
            <View style={styles.oauthView}>
                <Text style={styles.titleText}> ¿Primera vez aquí? </Text>
                <SignUpWithOauth />
            </View>
        </View>
    );
}
