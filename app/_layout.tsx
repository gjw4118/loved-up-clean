import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';

import { AuthProvider } from '@/lib/auth/AuthContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HeroUINativeProvider } from 'heroui-native';
import Purchases from 'react-native-purchases';
import '../global.css';

import { useTheme } from '@/hooks/useTheme';

export {
    // Catch any errors thrown by the Layout component.
    ErrorBoundary
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  // Configure RevenueCat
  useEffect(() => {
    const configureRevenueCat = async () => {
      try {
        // Only configure if API key is available
        const apiKey = process.env.EXPO_PUBLIC_RC_API_KEY;
        if (apiKey) {
          await Purchases.configure({ apiKey });
          console.log('✅ RevenueCat configured successfully');
        } else {
          console.log('⚠️ RevenueCat API key not found, skipping configuration');
        }
      } catch (error) {
        console.log('⚠️ RevenueCat configuration failed:', error);
      }
    };

    configureRevenueCat();
  }, []);

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

// Create QueryClient instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes
    },
  },
});

function RootLayoutNav() {
  const { theme, isDark } = useTheme();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider value={isDark ? DarkTheme : DefaultTheme}>
          <HeroUINativeProvider
            config={{
              colorScheme: isDark ? 'dark' : 'light',
              theme: {
                colors: {
                  primary: {
                    50: '#fff7ed',
                    100: '#ffedd5',
                    200: '#fed7aa',
                    300: '#fdba74',
                    400: '#fb923c',
                    500: '#f97316', // Main orange
                    600: '#ea580c',
                    700: '#c2410c',
                    800: '#9a3412',
                    900: '#7c2d12',
                    DEFAULT: '#f97316',
                    foreground: '#ffffff',
                  },
                  content1: isDark ? '#1a1a1a' : '#ffffff',
                  content2: isDark ? '#2a2a2a' : '#f4f4f5',
                  content3: isDark ? '#3a3a3a' : '#e4e4e7',
                  content4: isDark ? '#4a4a4a' : '#d4d4d8',
                  background: isDark ? '#000000' : '#ffffff',
                  foreground: isDark ? '#ffffff' : '#000000',
                  default: {
                    50: '#fafafa',
                    100: '#f4f4f5',
                    200: '#e4e4e7',
                    300: '#d4d4d8',
                    400: '#a1a1aa',
                    500: '#71717a',
                    600: '#52525b',
                    700: '#3f3f46',
                    800: '#27272a',
                    900: '#18181b',
                    DEFAULT: '#71717a',
                    foreground: isDark ? '#ffffff' : '#000000',
                  },
                },
              },
            }}
          >
            <AuthProvider>
              <Stack
                screenOptions={{
                  headerShown: false,
                  // iOS 26 native navigation patterns
                  presentation: 'card',
                  animation: 'slide_from_right',
                  animationDuration: 300,
                  gestureEnabled: true,
                  gestureDirection: 'horizontal',
                }}
              >
                <Stack.Screen 
                  name="index" 
                  options={{ 
                    headerShown: false,
                    presentation: 'card' 
                  }} 
                />
                <Stack.Screen 
                  name="auth" 
                  options={{ 
                    headerShown: false,
                    presentation: 'fullScreenModal',
                    animation: 'slide_from_bottom',
                    gestureEnabled: false 
                  }} 
                />
                {/* Onboarding route removed - not needed for MVP */}
                <Stack.Screen 
                  name="(tabs)" 
                  options={{ 
                    headerShown: false,
                    presentation: 'card' 
                  }} 
                />
                <Stack.Screen 
                  name="questions/[deckId]" 
                  options={{ 
                    headerShown: false,
                    presentation: 'card' 
                  }} 
                />
              </Stack>
            </AuthProvider>
          </HeroUINativeProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
