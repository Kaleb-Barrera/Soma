import { type NativeStackScreenProps } from "@react-navigation/native-stack";

export type RootStackParamList = {
    Root: undefined;
    Login: undefined;
    Profile: undefined;
};

export type RootStackScreenProps<Screen extends keyof RootStackParamList> =
    NativeStackScreenProps<RootStackParamList, Screen>;
