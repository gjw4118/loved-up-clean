import AsyncStorage from '@react-native-async-storage/async-storage';

// Using AsyncStorage instead of MMKV for Expo Go compatibility
// MMKV requires custom native modules not available in Expo Go
export const storage = {
  app: AsyncStorage,
  cache: AsyncStorage,
  auth: AsyncStorage,
  state: AsyncStorage,
  prefs: AsyncStorage,
};

// Simple cache using AsyncStorage
export const cache = {
  set: async <T>(key: string, data: T) => {
    try {
      await AsyncStorage.setItem(`cache:${key}`, JSON.stringify(data));
    } catch (error) {
      console.warn('Cache set failed:', error);
    }
  },

  get: async <T>(key: string): Promise<T | null> => {
    try {
      const value = await AsyncStorage.getItem(`cache:${key}`);
      return value ? JSON.parse(value) : null;
    } catch {
      return null;
    }
  },

  remove: async (key: string) => {
    try {
      await AsyncStorage.removeItem(`cache:${key}`);
    } catch (error) {
      console.warn('Cache remove failed:', error);
    }
  },

  clear: async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const cacheKeys = keys.filter(k => k.startsWith('cache:'));
      await AsyncStorage.multiRemove(cacheKeys);
    } catch (error) {
      console.warn('Cache clear failed:', error);
    }
  },
};

// Simple preferences using AsyncStorage
export const prefs = {
  set: async <T>(key: string, value: T) => {
    try {
      await AsyncStorage.setItem(`prefs:${key}`, JSON.stringify(value));
    } catch (error) {
      console.warn('Prefs set failed:', error);
    }
  },

  get: async <T>(key: string, defaultValue?: T): Promise<T | null> => {
    try {
      const value = await AsyncStorage.getItem(`prefs:${key}`);
      if (value === null) return defaultValue ?? null;
      
      try {
        return JSON.parse(value);
      } catch {
        return value as T;
      }
    } catch {
      return defaultValue ?? null;
    }
  },

  getBoolean: async (key: string, defaultValue: boolean = false): Promise<boolean> => {
    try {
      const value = await AsyncStorage.getItem(`prefs:${key}`);
      return value ? JSON.parse(value) : defaultValue;
    } catch {
      return defaultValue;
    }
  },

  getNumber: async (key: string, defaultValue: number = 0): Promise<number> => {
    try {
      const value = await AsyncStorage.getItem(`prefs:${key}`);
      return value ? JSON.parse(value) : defaultValue;
    } catch {
      return defaultValue;
    }
  },

  getString: async (key: string, defaultValue: string = ''): Promise<string> => {
    try {
      const value = await AsyncStorage.getItem(`prefs:${key}`);
      return value ?? defaultValue;
    } catch {
      return defaultValue;
    }
  },

  remove: async (key: string) => {
    try {
      await AsyncStorage.removeItem(`prefs:${key}`);
    } catch (error) {
      console.warn('Prefs remove failed:', error);
    }
  },

  clear: async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const prefKeys = keys.filter(k => k.startsWith('prefs:'));
      await AsyncStorage.multiRemove(prefKeys);
    } catch (error) {
      console.warn('Prefs clear failed:', error);
    }
  },
};

// Auth helpers using AsyncStorage
export const auth = {
  // Check if there's a session in cache
  hasSession: async (): Promise<boolean> => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      return keys.some(key => key.includes('auth-token') || key.includes('session'));
    } catch {
      return false;
    }
  },

  // Get the complete session if it exists
  getSession: async (): Promise<any | null> => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      for (const key of keys) {
        if (key.includes('auth-token') || key.includes('session')) {
          const sessionData = await AsyncStorage.getItem(key);
          if (sessionData) {
            return JSON.parse(sessionData);
          }
        }
      }
      return null;
    } catch {
      return null;
    }
  },

  // Check if the session is valid (not expired)
  isSessionValid: async (): Promise<boolean> => {
    try {
      const session = await auth.getSession();
      if (!session) return false;
      
      // Check expiration
      if (session.expires_at) {
        const expiresAt = new Date(session.expires_at * 1000);
        return expiresAt > new Date();
      }
      
      return true;
    } catch {
      return false;
    }
  },
};

// Simple debug using AsyncStorage
export const debug = {
  getAllKeys: async () => {
    const keys = await AsyncStorage.getAllKeys();
    return {
      app: keys.filter(k => k.startsWith('app:')),
      cache: keys.filter(k => k.startsWith('cache:')),
      auth: keys.filter(k => k.includes('auth') || k.includes('session')),
      state: keys.filter(k => k.startsWith('state:')),
      prefs: keys.filter(k => k.startsWith('prefs:')),
    };
  },

  getSize: async () => {
    const keys = await debug.getAllKeys();
    return {
      app: keys.app.length,
      cache: keys.cache.length,
      auth: keys.auth.length,
      state: keys.state.length,
      prefs: keys.prefs.length,
    };
  },

  clearAll: async () => {
    await AsyncStorage.clear();
  },
}; 