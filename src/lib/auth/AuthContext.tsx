// Authentication Context for Connect App
// Based on PRD requirements

import { supabase } from '@/lib/database/supabase';
import { UserProfile } from '@/types/user';
import { User } from '@supabase/supabase-js';
import React, { createContext, useContext, useEffect, useState } from 'react';

// Development bypass flag - set to true to skip Supabase initialization
const DEV_BYPASS_AUTH = process.env.EXPO_PUBLIC_BYPASS_AUTH === 'true';

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch user profile from database
  const fetchProfile = async (userId: string): Promise<UserProfile | null> => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
  };

  // Refresh profile data
  const refreshProfile = async () => {
    if (user) {
      const profileData = await fetchProfile(user.id);
      setProfile(profileData);
    }
  };

  // Sign out function
  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Sign out error:', error);
      }
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  useEffect(() => {
    // Development bypass: skip Supabase initialization
    if (DEV_BYPASS_AUTH) {
      console.log('AuthContext: DEV BYPASS - Skipping Supabase initialization');
      
      // Set mock user and profile data for development
      const mockUser = {
        id: 'dev-user-123',
        email: 'dev@example.com',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        aud: 'authenticated',
        role: 'authenticated',
        app_metadata: {},
        user_metadata: {},
        identities: [],
        factors: [],
      } as User;
      
      const mockProfile = {
        id: 'dev-user-123',
        email: 'dev@example.com',
        first_name: 'John',
        last_name: 'Doe',
        avatar_url: undefined,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      } as UserProfile;
      
      setUser(mockUser);
      setProfile(mockProfile);
      setLoading(false);
      return;
    }

    // Check if Supabase is configured
    if (!supabase) {
      console.warn('⚠️ AuthContext: Supabase not configured. Please set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY');
      setLoading(false);
      return;
    }

    // Get initial session
    const getInitialSession = async () => {
      try {
        console.log('🔍 AuthContext: Getting initial session...');
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('❌ AuthContext: Error getting session:', error);
        } else if (session?.user) {
          console.log('✅ AuthContext: Found existing session for user:', session.user.id);
          setUser(session.user);
          const profileData = await fetchProfile(session.user.id);
          setProfile(profileData);
        } else {
          console.log('ℹ️ AuthContext: No existing session found');
        }
      } catch (error) {
        console.error('❌ AuthContext: Error getting initial session:', error);
      } finally {
        console.log('🏁 AuthContext: Initial session check complete, setting loading to false');
        setLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔄 AuthContext: Auth state changed:', event, session?.user?.id);
        
        if (session?.user) {
          console.log('✅ AuthContext: Setting user and fetching profile for:', session.user.id);
          setUser(session.user);
          const profileData = await fetchProfile(session.user.id);
          setProfile(profileData);
        } else {
          console.log('🚪 AuthContext: Clearing user and profile');
          setUser(null);
          setProfile(null);
        }
        
        // Only set loading to false if we're not in the initial loading state
        if (event !== 'INITIAL_SESSION') {
          console.log('🏁 AuthContext: Setting loading to false after auth state change');
          setLoading(false);
        } else {
          console.log('⏳ AuthContext: Skipping loading state change for INITIAL_SESSION');
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const value: AuthContextType = {
    user,
    profile,
    loading,
    signOut,
    refreshProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
