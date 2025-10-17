// Supabase Authentication Configuration
// Apple Sign-In only implementation

import { supabase } from '@/lib/database/supabase';
import * as AppleAuthentication from 'expo-apple-authentication';

// Apple Sign-In
export const signInWithApple = async () => {
  try {
    const credential = await AppleAuthentication.signInAsync({
      requestedScopes: [
        AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
        AppleAuthentication.AppleAuthenticationScope.EMAIL,
      ],
    });

    const { data, error } = await supabase.auth.signInWithIdToken({
      provider: 'apple',
      token: credential.identityToken!,
      // Don't pass nonce - let Supabase handle it
    });

    if (error) {
      throw error;
    }

    // Update user profile with Apple data if available
    // Apple only provides fullName on first sign-in, so capture it immediately
    if (data.user) {
      const profileData: any = {
        user_id: data.user.id,
        email: data.user.email!,
      };

      // Capture Apple name data if available (only on first sign-in)
      if (credential.fullName) {
        const firstName = credential.fullName.givenName;
        const lastName = credential.fullName.familyName;
        const displayName = [firstName, lastName].filter(Boolean).join(' ');

        if (firstName) profileData.first_name = firstName;
        if (lastName) profileData.last_name = lastName;
        if (displayName) profileData.display_name = displayName;

      } else {
        // Fallback to email-based display name if no name provided
        profileData.display_name = data.user.email?.split('@')[0] || 'User';
      }

      // Upsert profile with Apple data
      const { error: profileError } = await supabase
        .from('user_profiles')
        .upsert(profileData, {
          onConflict: 'user_id',
        });

      if (profileError) {
        console.error('Error updating profile with Apple data:', profileError);
      }
    }

    return { data, error: null };
  } catch (error) {
    console.error('Apple Sign-In Error:', error);
    return { data: null, error };
  }
};

// Sign Out
export const signOut = async () => {
  try {
    // Sign out from Supabase
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      throw error;
    }

    return { error: null };
  } catch (error) {
    console.error('Sign Out Error:', error);
    return { error };
  }
};

// Get current user
export const getCurrentUser = async () => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error) {
      throw error;
    }

    return { user, error: null };
  } catch (error) {
    console.error('Get Current User Error:', error);
    return { user: null, error };
  }
};

// Check if Apple Sign-In is available
export const isAppleSignInAvailable = async () => {
  return await AppleAuthentication.isAvailableAsync();
};
