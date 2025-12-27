import { supabase } from '@/lib/supabase';
import { Database, Profile } from '@/types/database';
import { makeRedirectUri } from 'expo-auth-session';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';

WebBrowser.maybeCompleteAuthSession();

export interface AuthResponse {
  success: boolean;
  profile?: Profile;
  error?: string;
}

type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];
type ProfileInsert = Database['public']['Tables']['profiles']['Insert'];

/**
 * Sign in with email and password
 */
export async function signInWithEmail(
  email: string,
  password: string
): Promise<AuthResponse> {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    if (!data.user) {
      return { success: false, error: 'No user data returned' };
    }

    // Fetch user profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', data.user.id)
      .single();

    if (profileError) {
      return { success: false, error: profileError.message };
    }

    return { success: true, profile };
  } catch (error: any) {
    return { success: false, error: error.message || 'Login failed' };
  }
}

/**
 * Sign up with email and password
 */
export async function signUpWithEmail(
  email: string,
  password: string,
  fullName?: string,
  employeeId?: string
): Promise<AuthResponse> {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          employee_id: employeeId,
        },
      },
    });

    if (error) {
      return { success: false, error: error.message };
    }

    if (!data.user) {
      return { success: false, error: 'No user data returned' };
    }

    // Profile should be created automatically by trigger
    // Wait a bit for trigger to complete
    await new Promise(resolve => setTimeout(resolve, 1000));

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', data.user.id)
      .single();

    if (profileError) {
      return { success: false, error: profileError.message };
    }

    return { success: true, profile };
  } catch (error: any) {
    return { success: false, error: error.message || 'Sign up failed' };
  }
}

/**
 * Sign out current user
 */
export async function signOut(): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || 'Sign out failed' };
  }
}

/**
 * Get current session
 */
export async function getCurrentSession() {
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return data.session;
  } catch (error) {
    console.error('Get session error:', error);
    return null;
  }
}

/**
 * Get current user profile
 */
export async function getCurrentProfile(): Promise<Profile | null> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return null;

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error) {
      console.error('Get profile error:', error);
      return null;
    }

    return profile;
  } catch (error) {
    console.error('Get current profile error:', error);
    return null;
  }
}

/**
 * Update user profile
 */
export async function updateProfile(
  userId: string,
  updates: ProfileUpdate
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await (supabase
      .from('profiles') as any)
      .update(updates)
      .eq('user_id', userId);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || 'Update failed' };
  }
}

/**
 * Setup Google OAuth hook
 */
export function useGoogleAuth() {
  const [request, response, promptAsync] = Google.useAuthRequest({
    iosClientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID,
    androidClientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID,
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID,
    // Request id_token in response
    responseType: 'id_token',
    scopes: ['openid', 'profile', 'email'],
    // Add state parameter for CSRF protection
    usePKCE: false, // Disable PKCE since we're using id_token flow
    redirectUri: makeRedirectUri({
      scheme: 'com.indosat.lms',
      path: 'auth/callback'
    }),
  });

  return { request, response, promptAsync };
}

/**
 * Sign in with Google OAuth
 */
export async function signInWithGoogle(
  idToken: string
): Promise<AuthResponse> {
  try {
    console.log('🔐 Starting Google Sign-In...');
    console.log('Token length:', idToken?.length);
    
    const { data, error } = await supabase.auth.signInWithIdToken({
      provider: 'google',
      token: idToken,
    });

    if (error) {
      console.error('❌ signInWithIdToken error:', error);
      return { success: false, error: error.message };
    }

    if (!data.user) {
      console.error('❌ No user data returned');
      return { success: false, error: 'No user data returned' };
    }

    console.log('✅ User authenticated:', data.user.id);
    console.log('📧 Email:', data.user.email);

    // Use database function to create/get profile (bypasses RLS timing issues)
    console.log('📝 Creating/retrieving profile via database function...');
    
    const fullName = data.user.user_metadata?.full_name || 
                    data.user.user_metadata?.name || 
                    data.user.email?.split('@')[0] || 
                    'User';

    const { data: profileData, error: profileError } = await (supabase.rpc as any)(
      'create_profile_for_user',
      {
        p_user_id: data.user.id,
        p_email: data.user.email || '',
        p_full_name: fullName,
        p_role: 'user'
      }
    );

    if (profileError) {
      console.error('❌ Database function error:', profileError);
      return { 
        success: false, 
        error: `Failed to create profile: ${profileError.message}` 
      };
    }

    if (!profileData) {
      console.error('❌ No profile data returned from function');
      return { 
        success: false, 
        error: 'Failed to retrieve profile data' 
      };
    }

    console.log('✅ Profile created/retrieved successfully');
    console.log('Profile:', profileData);

    return {
      success: true,
      profile: profileData as Profile
    };

  } catch (error: any) {
    console.error('❌ Unexpected error:', error);
    return {
      success: false,
      error: error.message || 'An unexpected error occurred'
    };
  }
}

/**
 * Reset password
 */
export async function resetPassword(
  email: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'com.indosat.lms://reset-password',
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || 'Password reset failed' };
  }
}
