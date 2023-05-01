import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, Button } from "react-native";

import type { RootStackScreenProps } from "../../types/react-navigation";

import { trpc } from "../../utils/trpc";
import GroupPreview from "./components/GroupPreview";

export default function Home({ navigation }: RootStackScreenProps<"Home">) {
    const { data, isLoading, isError } = trpc.onStartup.getAllGroups.useQuery()

    if (isLoading) {
        return (
            <View className="flex-1 justify-center items-center bg-white">
                <Text>Loading...</Text>
                <Button title="Profile" onPress={() => navigation.navigate("Profile")} />
            </View>
        )
    }

    if (isError) {
        return (
            <View className="flex-1 justify-center items-center bg-red-700">
                <Text className="text-white mx-5">
                    Hubo un problema al cargar tus grupos, reinicia la aplicación
                </Text>
            </View>
        )
    }
    const allGroups = data.ownedGroups.concat(data.partakenGroups).sort();
    console.log(allGroups)

    return (
        <SafeAreaView>
            <View>
                {
                    allGroups.map(group => (<GroupPreview data={group} />))
                }
                <Text>Hola!</Text>
            </View>
        </SafeAreaView>
    )
}
