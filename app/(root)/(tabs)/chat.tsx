import { Image, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { icons, images } from "@/constants";
import edit from "@/assets/icons/edit.png";
import profileD from "@/assets/images/profile.png";
const Chat = () => {
  // return (
  //   <SafeAreaView className="flex-1 bg-white p-5">
  //     <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
  //       <Text className="text-2xl font-JakartaBold">Chat</Text>
  //       <View className="flex-1 h-fit flex justify-center items-center">
  //         <Image
  //           source={images.message}
  //           alt="message"
  //           className="w-full h-40"
  //           resizeMode="contain"
  //         />
  //         <Text className="text-3xl font-JakartaBold mt-3">
  //           No Messages Yet
  //         </Text>
  //         <Text className="text-base mt-2 text-center px-7">
  //           Start a conversation with your friends
  //         </Text>
  //       </View>
  //     </ScrollView>
  //   </SafeAreaView>
  // );
  return (
    <SafeAreaView className="flex-1 bg-white p-5">
      <View>
        <View className="flex flex-row items-center w-full justify-between mb-5">
          <Image
            source={icons.backArrow}
            alt="back"
            className="h-6 w-6"
            resizeMode="contain"
          />
          <Text className="flex-1 font-JakartaBold text-3xl ml-1">Trip 1</Text>
          <Image
            source={edit}
            alt="back"
            className="h-6 w-6"
            resizeMode="contain"
          />
        </View>
        <View className="flex flex-row items-center w-full justify-between">
          <Image
            source={profileD}
            alt="profile"
            className="h-12 w-12  rounded-full"
            resizeMode="contain"
          />
          <View className="flex flex-col w-full justify-center items-start ml-3">
            <View className=" flex flex-row w-full mb-5">
              <Text className=" text-2xl ml-1">From</Text>
              <Text className="text-2xl ml-2 font-JakartaBold">
                IGI Airport, T3
              </Text>
            </View>
            <View className="flex flex-row w-full">
              <Text className="txt-2xl ml-1"> To</Text>
              <Text className="text-2xl ml-2 font-JakartaBold">Sector 28</Text>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Chat;
