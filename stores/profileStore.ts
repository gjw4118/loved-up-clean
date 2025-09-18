// Profile Store
// Manages user profile data and settings with Zustand

import { MMKV } from 'react-native-mmkv';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { Profile } from '@/types/profile';

// Initialize MMKV storage for persistence
const storage = new MMKV();

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
      // Initial state
      profile: null,
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
      storage: createJSONStorage(() => ({
        getItem: (name) => {
          const value = storage.getString(name);
          return value ?? null;
        },
        setItem: (name, value) => {
          storage.set(name, value);
        },
        removeItem: (name) => {
          storage.delete(name);
        },
      })),
      // Only persist the profile data, not loading/error states
      partialize: (state) => ({ profile: state.profile }),
    }
  )
);