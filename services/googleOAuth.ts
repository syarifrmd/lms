/* Google Identity Services OAuth helper for React Native
   Currently stubbed as full implementation requires expo-auth-session setup
*/

export type TokenResponse = { access_token: string; expires_in?: number; token_type?: string; scope?: string };

export async function getAccessToken(scopes: string[]): Promise<TokenResponse> {
  console.warn("Google OAuth not implemented for React Native yet.");
  throw new Error("Google OAuth not implemented for React Native yet.");
}

export async function revokeToken(accessToken: string): Promise<void> {
   console.warn("Google OAuth revoke not implemented for React Native yet.");
}

