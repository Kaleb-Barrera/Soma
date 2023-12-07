import { View, Text } from "react-native";
import { type Group } from ".prisma/client";

import { trpc } from "../../../utils/trpc";

export default function GroupPreview({ groupName, groupImage, groupId, createdAt }: Group) {
    const { isLoading, isError, data } = trpc.onStartup.getLastMessage.useQuery(groupId);

    if (isLoading) {
        return (
            <View>
                <Text>Loading placeholder...</Text>
            </View>
        )
    }

    if (isError) return null;

    return (
        <View className="h-10 bg-gray-200">
            <Text>{groupName}</Text>
            <Text>{data.content}</Text>
        </View>
    )
}
