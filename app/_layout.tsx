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
