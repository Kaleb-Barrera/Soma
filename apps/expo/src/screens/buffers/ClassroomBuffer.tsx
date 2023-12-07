import { View } from "react-native"
import { trpc } from "../../utils/trpc"

export default function ClassroomBuffer() {
    const { mutate } = trpc.classroom.userLoggedInGroupCheck.useMutation()
    return (
        <View></View>
    )
}
