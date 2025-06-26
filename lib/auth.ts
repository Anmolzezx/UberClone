// // tokenCache.ts
import * as SecureStore from "expo-secure-store";
import * as Linking from "expo-linking";
import { fetchAPI } from "@/lib/fetch";
// import { SecureSessionTokenCache } from "@clerk/clerk-expo";
//
// export const tokenCache = new SecureSessionTokenCache({
//   async getToken(key) {
//     return SecureStore.getItemAsync(key);
//   },
//   async saveToken(key, value) {
//     return SecureStore.setItemAsync(key, value);
//   },
// });

export const googleOAuth = async (startOAuthFlow: any) => {
  try {
    const { createdSessionId, signUp, setActive } = await startOAuthFlow({
      redirectUrl: Linking.createURL("/(root)/(tabs)/home", {
        scheme: "uberclone",
      }),
    });
    if (createdSessionId) {
      if (setActive) {
        await setActive!({ session: createdSessionId });

        if (signUp.createdUserId) {
          await fetchAPI("/(api)/user", {
            method: "POST",
            body: JSON.stringify({
              name: `${signUp.firstName} ${signUp.lastName}`,
              email: signUp.emailAddress,
              clerkId: signUp.createdUserId,
            }),
          });
        }
        return {
          success: true,
          code: "success",
          message: "You have successfully signed in.",
        };
      }
    }
    return {
      success: false,
      code: "success",
      message: "You have not signed in.",
    };
  } catch (error: any) {
    console.error(error);
    return {
      success: false,
      code: error.code,
      message: error?.errors[0]?.longMessage,
    };
  }
};
