import { TouchableOpacity, Text } from "react-native";
import { useAuth } from "@clerk/clerk-expo";

export default function SignOutButton() {
    const { signOut } = useAuth()
    const onSignOutPress = async () => {
        try {
            await signOut();
        } catch (err: any) {
            console.log("Error:> " + err?.status || '');
            console.log("Error:> " + err?.errors ? JSON.stringify(err.errors) : err);
        }
    };

    return (
        <TouchableOpacity onPress={onSignOutPress} className="mt-4 p-2 w-28 bg-blue-500 items-center rounded">
            <Text className="text-base text-white">Sign out</Text>
        </TouchableOpacity>
    )
}

