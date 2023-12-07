import { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, Button, TextInput } from "react-native";

import type { RootStackScreenProps } from "../../types/react-navigation";

import { trpc } from "../../utils/trpc";
import GroupPreview from "./components/GroupPreview";

export default function Home({ navigation }: RootStackScreenProps<"Home">) {
    const { isLoading, isError, error, data } = trpc.onStartup.getAllGroups.useQuery();

    if (isLoading) {
        return (
            <View className="flex-1 justify-center items-center">
                <Text className="text-4xl">
                    ...
                </Text>
            </View>
        )
    }

    if (isError) {
        return (
            <View className="flex-1 justify-center items-center bg-red-700">
                <Text className="text-white mx-5">
                    Hubo un problema al cargar tus grupos, reinicia la aplicación
                </Text>
                <Text>
                    {error.data}
                </Text>
                <Text>
                    {error.shape}
                </Text>
                <Text>
                    {error.message}
                </Text>
            </View>
        )
    }

    const allGroups = data.ownedGroups.concat(data.partakenGroups).sort();
    console.log(allGroups)
    return (
        <SafeAreaView className="flex-1 bg-light dark:bg-dark">
            <View>
                {
                    allGroups.map(group => (<GroupPreview groupName={group.groupName} groupImage={group.groupImage} groupId={group.groupId} createdAt={group.createdAt} />))
                }
            </View>
        </SafeAreaView>
    )
}
