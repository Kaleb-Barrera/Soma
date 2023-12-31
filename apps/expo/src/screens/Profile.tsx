import { Text, View, Image, Button } from 'react-native';

import { useAppContext } from '../utils/AppContext';
import SignOutButton from '../components/SignOutButton';

import type { RootStackScreenProps } from '../types/reactNavigationParams';

//{ navigation }: RootStackScreenProps<"Profile">
export default function Profile({
    navigation,
}: RootStackScreenProps<'Profile'>) {
    const { user } = useAppContext();

    return (
        <View className="flex-1 justify-center items-center bg-white">
            <Text className="text-3xl font-bold">Hola {user.firstName}!</Text>
            <Image
                source={{ uri: user.profileImg }}
                className="w-40 h-40 rounded-full"
            />
            <Text>{user.email}</Text>
            <SignOutButton />
            <Button
                title="Regresar"
                onPress={() => {
                    navigation.pop();
                }}
            />
        </View>
    );
}
