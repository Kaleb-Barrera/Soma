import { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, Button, TextInput } from "react-native";

import { useSetupResources } from "../../hooks/useSetupResources";
import { useGetAllGroups } from "../../hooks/databaseHooks";

import type { RootStackScreenProps } from "../../types/reactNavigationParams";

import GroupPreview from "./components/GroupPreview";

export default function Home({ navigation }: RootStackScreenProps<"Home">) {
    const {userObjectAvailable, groupsAndRolesUpdated, newUsersSaved} = useSetupResources() 
    const groups = useGetAllGroups()

    return (
        <SafeAreaView className="flex-1 bg-light dark:bg-dark">
            <View className="flex-1 justify-center items-center bg-white">
                {
                    !newUsersSaved  ? (<Text>Actualizando datos...</Text>) : (<></>)
                }
                {
                    userObjectAvailable ? (
                        <Button title="Ir a perfil" onPress={() => {navigation.push("Profile")}}/>
                    ) : <></>
                }
                {
                    !groups.data 
                    ? (<Text>Cargando grupos locales...</Text>) 
                    : groups.data.length === 0
                        ? groupsAndRolesUpdated 
                            ? (
                                <>
                                    <Text>No se encontro ningun grupo</Text>
                                    <Button title="Actualizar grupos" onPress={() => groups.refetch()}></Button>
                                </>
                              )
                            : (<Text>Consultando la base de datos...</Text>) 
                        : groups.data.map(group => (<GroupPreview {...group}></GroupPreview>))
                }
            </View>
        </SafeAreaView>
    )
}
