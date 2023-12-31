import { TouchableOpacity, Text } from "react-native";
import { useAuth } from "@clerk/clerk-expo";

export default function SignOutButton() {
    const { signOut } = useAuth()
    const onSignOutPress = async () => {
        try {
            await signOut();
        } catch (err: unknown) {
            console.log("Error:> ", err);
        }
    };

    return (
        <TouchableOpacity onPress={void onSignOutPress} className="mt-4 p-4 bg-blue-500 items-center rounded">
            <Text className="text-base text-white"> Cerrar sesión</Text>
        </TouchableOpacity>
    )
}

