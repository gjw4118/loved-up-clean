// Profile Store
// Manages user profile data and settings with Zustand

import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { Profile } from '@/types/profile';

// AsyncStorage for Expo Go compatibility
const asyncStorage = {
  setItem: async (name: string, value: string) => {
    return AsyncStorage.setItem(name, value);
  },
  getItem: async (name: string) => {
    return AsyncStorage.getItem(name);
  },
  removeItem: async (name: string) => {
    return AsyncStorage.removeItem(name);
  },
};

interface ProfileState {
  // State
  profile: Profile | null;
  loading: boolean;
  error: string | null;
  
  // Actions
  setProfile: (profile: Profile | null) => void;
  updateProfile: (updates: Partial<Profile>) => Promise<void>;
  clearProfile: () => void;
  fetchProfile: () => Promise<void>;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  
  // Realtime subscriptions
  startRealtimeSubscription: () => void;
  stopRealtimeSubscription: () => void;
}

export const useProfileStore = create<ProfileState>()(
  persist(
    (set, get) => ({
      // Initial state - with mock data for development
      profile: {
        id: 'dev-user-123',
        email: 'dev@example.com',
        first_name: 'John',
        last_name: 'Doe',
        avatar_url: undefined,
        is_paid: false,
        is_premium: false,
        expo_push_token: undefined,
        push_notifications_enabled: true,
        email_notifications_enabled: true,
        marketing_notifications_enabled: false,
        onboarding_completed: true,
        lang: 'en',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        stripe_customer_id: undefined,
      },
      loading: false,
      error: null,

      // Basic actions
      setProfile: (profile) => set({ profile, error: null }),
      
      setLoading: (loading) => set({ loading }),
      
      setError: (error) => set({ error }),
      
      clearProfile: () => set({ profile: null, error: null }),

      // Profile fetching
      fetchProfile: async () => {
        set({ loading: true, error: null });
        
        try {
          // TODO: Implement actual profile fetch API call
          // For now, simulate loading
          await new Promise(resolve => setTimeout(resolve, 1000));
          set({ loading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to fetch profile', 
            loading: false 
          });
        }
      },

      // Profile updating
      updateProfile: async (updates) => {
        const { profile } = get();
        if (!profile) {
          set({ error: 'No profile to update' });
          return;
        }
        
        set({ loading: true, error: null });
        
        try {
          // TODO: Implement actual profile update API call
          // For now, update local state optimistically
          const updatedProfile = { 
            ...profile, 
            ...updates,
            updated_at: new Date().toISOString()
          };
          set({ profile: updatedProfile, loading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to update profile', 
            loading: false 
          });
        }
      },

      // Realtime subscriptions
      startRealtimeSubscription: () => {
        // TODO: Implement realtime subscription for profile updates
        console.log('Starting profile realtime subscription');
      },
      
      stopRealtimeSubscription: () => {
        // TODO: Implement realtime subscription cleanup
        console.log('Stopping profile realtime subscription');
      },
    }),
    {
      name: 'profile-store',
      storage: createJSONStorage(() => asyncStorage),
      // Only persist the profile data, not loading/error states
      partialize: (state) => ({ profile: state.profile }),
    }
  )
);