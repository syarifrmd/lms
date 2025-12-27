import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';

export const TOOLS_SCOPES = [
   'https://www.googleapis.com/auth/youtube.upload',
   'https://www.googleapis.com/auth/drive.file',
];

GoogleSignin.configure({
   scopes: TOOLS_SCOPES,
   webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
   offlineAccess: true,
   forceCodeForRefreshToken: true,
});

export type TokenResponse = { access_token: string; };

export async function getAccessToken(): Promise<string> {
   try {
      const hasPlayServices = await GoogleSignin.hasPlayServices();
      if (!hasPlayServices) {
         throw new Error("Google Play Services not available");
      }

      const userInfo = await GoogleSignin.signIn();
      const tokens = await GoogleSignin.getTokens();
      return tokens.accessToken;
   } catch (error: any) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
         throw new Error("User cancelled the login flow");
      } else if (error.code === statusCodes.IN_PROGRESS) {
         throw new Error("Sign in is in progress already");
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
         throw new Error("Play services not available or outdated");
      } else {
         throw new Error("Google Sign-In Error: " + error.message);
      }
   }
}

export async function getCurrentUser(): Promise<any | null> {
   try {
      return await GoogleSignin.getCurrentUser();
   } catch {
      return null;
   }
}

export async function signOut(): Promise<void> {
   try {
      await GoogleSignin.signOut();
   } catch (error) {
      console.error(error);
   }
}

