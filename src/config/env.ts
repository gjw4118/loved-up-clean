// Environment Configuration
// Centralized environment variable management

export const ENV = {
  // Development flags
  BYPASS_PREMIUM: process.env.EXPO_PUBLIC_BYPASS_PREMIUM === 'true',
  BYPASS_AUTH: process.env.EXPO_PUBLIC_BYPASS_AUTH === 'true',
  
  // API Configuration
  SUPABASE_URL: process.env.EXPO_PUBLIC_SUPABASE_URL || '',
  SUPABASE_ANON_KEY: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '',
  
  // App Configuration
  APP_NAME: 'Loved Up',
  APP_VERSION: '1.0.0',
  
  // Feature Flags
  ENABLE_ANALYTICS: process.env.EXPO_PUBLIC_ENABLE_ANALYTICS === 'true',
  ENABLE_CRASHLYTICS: process.env.EXPO_PUBLIC_ENABLE_CRASHLYTICS === 'true',
  
  // Development
  IS_DEV: __DEV__,
} as const;

// Validate required environment variables
export const validateEnv = () => {
  const required = [
    'EXPO_PUBLIC_SUPABASE_URL',
    'EXPO_PUBLIC_SUPABASE_ANON_KEY',
  ];
  
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
};

export default ENV;

