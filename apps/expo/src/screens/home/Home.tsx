import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, Button, FlatList } from "react-native";

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
                <Button title="Actualizar grupos" onPress={() => groups.refetch()}></Button>
                {
                    !groups.data 
                    ? (<Text>Cargando grupos locales...</Text>) 
                    : groups.data.length === 0
                        ? groupsAndRolesUpdated 
                            ? (
                                <>
                                    <Text>No se encontro ningun grupo</Text>
                                </>
                              )
                            : (<Text>Consultando la base de datos...</Text>) 
                        : (<FlatList 
                            data={groups.data} 
                            renderItem={(({item}) => (<GroupPreview {...item}></GroupPreview>))}
                            keyExtractor={group => group.groupId}
                        />)
                }
            </View>
        </SafeAreaView>
    )
}
