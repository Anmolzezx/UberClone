import { Alert, Image, Text, View } from "react-native";
import CustomButton from "@/components/CustomButton";
import { icons } from "@/constants";
import { useOAuth } from "@clerk/clerk-expo";
import { useCallback } from "react";
import { googleOAuth } from "@/lib/auth";
import { router } from "expo-router";

const OAuth = () => {
  const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });

  const handleGoogleSignIn = useCallback(async () => {
    try {
      const result = await googleOAuth(startOAuthFlow);
      if (result.code === "session_exists" || result.code === "success") {
        router.push("/(root)/(tabs)/home");
      }
    } catch (err) {
      console.error("❌ Google OAuth Error:", err);
    }
  }, []);
  return (
    <View>
      <View className="flex flex-row justify-center items-center mt-4 gap-x-3">
        <View className="flex-1 h-[1px] bg-general-100" />
        <Text className="text-lg">Or</Text>
        <View className="flex-1 h-[1px] bg-general-100" />
      </View>
      <CustomButton
        title="Log in with Google"
        className="mt-5 w-full shadow-none"
        IconLeft={() => (
          <Image
            source={icons.google}
            resizeMode="contain"
            className="w-5 h-5 mx-2"
          />
        )}
        bgVariant="outline"
        textVariant="primary"
        onPress={handleGoogleSignIn}
      />
    </View>
  );
};
export default OAuth;

// components/OAuth.tsx
// import { Image, Text, View, Alert } from "react-native";
// import * as WebBrowser from "expo-web-browser";
// import { useWarmUpBrowser } from "@/hooks/useWarmUpBrowser";
// import { useOAuth } from "@clerk/clerk-expo";
// import CustomButton from "@/components/CustomButton";
// import { icons } from "@/constants";
//
// WebBrowser.maybeCompleteAuthSession();
//
// const OAuth = () => {
//   useWarmUpBrowser(); // optional but recommended for smoother login
//
//   const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });
//
//   const handleGoogleSignIn = async () => {
//     try {
//       const { createdSessionId, signIn, signUp } = await startOAuthFlow();
//       if (createdSessionId) {
//         console.log("Logged in with session:", createdSessionId);
//       } else {
//         console.warn("No session created.");
//       }
//     } catch (err: any) {
//       console.error("OAuth error:", err);
//       Alert.alert("OAuth Error", err?.message || "Something went wrong");
//     }
//   };
//
//   return (
//     <View>
//       <View className="flex flex-row justify-center items-center mt-4 gap-x-3">
//         <View className="flex-1 h-[1px] bg-general-100" />
//         <Text className="text-lg">Or</Text>
//         <View className="flex-1 h-[1px] bg-general-100" />
//       </View>
//
//       <CustomButton
//         title="Log in with Google"
//         className="mt-5 w-full shadow-none"
//         IconLeft={() => (
//           <Image
//             source={icons.google}
//             resizeMode="contain"
//             className="w-5 h-5 mx-2"
//           />
//         )}
//         bgVariant="outline"
//         textVariant="primary"
//         onPress={handleGoogleSignIn}
//       />
//     </View>
//   );
// };
//
// export default OAuth;
