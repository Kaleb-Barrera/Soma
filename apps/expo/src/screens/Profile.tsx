import * as React from "react";
import { Text, View, Image } from "react-native";
import { useUser } from "@clerk/clerk-expo";
// import { type RootStackScreenProps } from "../types/react-navigation";

import SignOutButton from "../components/SignOutButton";

//{ navigation }: RootStackScreenProps<"Profile">
export default function Profile() {
  // const { getToken } = useAuth();
  const { user } = useUser();

  // const [sessionToken, setSessionToken] = React.useState("");


  //   React.useEffect(() => {
  //     const scheduler = setInterval(async () => {
  //       const token = await getToken();
  //       setSessionToken(token as string);
  //     }, 1000);
  //
  //     return () => clearInterval(scheduler);
  //   }, []);
  //
  return (
    <View className="flex-1 justify-center items-center bg-white">
      <Text className="text-lg font-bold">Hello {user?.firstName}</Text>
      <Image source={{ uri: user?.profileImageUrl }} className="w-40 h-40" />
      <SignOutButton />
    </View>
  );
}

