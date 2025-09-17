// Supabase Authentication Configuration
// Based on PRD requirements for Apple and Google sign-in

import { supabase } from '@/lib/database/supabase';
import * as AppleAuthentication from 'expo-apple-authentication';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import * as Crypto from 'expo-crypto';

// Configure Google Sign-In
export const configureGoogleSignIn = () => {
  GoogleSignin.configure({
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
    iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
  });
};

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

// Google Sign-In
export const signInWithGoogle = async () => {
  try {
    await GoogleSignin.hasPlayServices();
    const userInfo = await GoogleSignin.signIn();

    if (!userInfo.data?.idToken) {
      throw new Error('No ID token received from Google');
    }

    const { data, error } = await supabase.auth.signInWithIdToken({
      provider: 'google',
      token: userInfo.data.idToken,
    });

    if (error) {
      throw error;
    }

    // Update user profile with Google data
    if (data.user && userInfo.data.user) {
      await supabase
        .from('user_profiles')
        .upsert({
          id: data.user.id,
          display_name: userInfo.data.user.name || '',
          email: data.user.email!,
          avatar_url: userInfo.data.user.photo || null,
        });
    }

    return { data, error: null };
  } catch (error) {
    console.error('Google Sign-In Error:', error);
    return { data: null, error };
  }
};

// Sign Out
export const signOut = async () => {
  try {
    // Sign out from Google if signed in
    const isGoogleSignedIn = await GoogleSignin.isSignedIn();
    if (isGoogleSignedIn) {
      await GoogleSignin.signOut();
    }

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
