import { View, Text } from "react-native";
import { type Group } from "@soma/db";

import { trpc } from "../../../utils/trpc";

export default function GroupPreview(group: Group) {
    const { groupName, groupImage, groupDescription } = group
    return (
        <View className="h-10 bg-gray-200">
            <Text>{groupName}</Text>
            <Text>{groupDescription}</Text>
        </View>
    )
}
