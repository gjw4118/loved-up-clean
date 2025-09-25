// Supabase Authentication Configuration
// Apple Sign-In only implementation

import { supabase } from '@/lib/database/supabase';
import * as AppleAuthentication from 'expo-apple-authentication';
import * as Crypto from 'expo-crypto';

// Apple Sign-In
export const signInWithApple = async () => {
  try {
    const credential = await AppleAuthentication.signInAsync({
      requestedScopes: [
        AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
        AppleAuthentication.AppleAuthenticationScope.EMAIL,
      ],
    });

    // Create a secure nonce for Apple authentication
    const nonce = Math.random().toString(36).substring(2, 15);
    const hashedNonce = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      nonce,
      { encoding: Crypto.CryptoEncoding.BASE64URL }
    );

    const { data, error } = await supabase.auth.signInWithIdToken({
      provider: 'apple',
      token: credential.identityToken!,
      nonce: hashedNonce,
    });

    if (error) {
      throw error;
    }

    // Update user profile with Apple data if available
    if (credential.fullName && data.user) {
      const displayName = [
        credential.fullName.givenName,
        credential.fullName.familyName,
      ]
        .filter(Boolean)
        .join(' ');

      if (displayName) {
        await supabase
          .from('user_profiles')
          .upsert({
            id: data.user.id,
            display_name: displayName,
            email: data.user.email!,
          });
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
