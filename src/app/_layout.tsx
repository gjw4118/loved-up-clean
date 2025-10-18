import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';

import { AuthProvider, useAuth } from '@/lib/auth/AuthContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HeroUINativeProvider } from 'heroui-native';
import { configureReanimatedLogger, ReanimatedLogLevel } from 'react-native-reanimated';
import '../../global.css';

import { ThemeProvider as CustomThemeProvider, useTheme } from '@/lib/contexts/ThemeContext';
import { setupDeepLinkListeners, handleDeepLink } from '@/lib/linking/deepLinkHandler';
import { initializeRevenueCat, identifyUser } from '@/lib/purchases/revenuecat';




export {
    // Catch any errors thrown by the Layout component.
    ErrorBoundary
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: 'index',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  // Configure Reanimated to disable strict mode warnings - must be before any conditionals
  useEffect(() => {
    configureReanimatedLogger({
      level: ReanimatedLogLevel.Warn, // Only show warnings, not strict mode errors
      strict: false, // Disable strict mode completely
    });
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
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <CustomThemeProvider>
          <NavigationThemeProvider>
            <HeroUINativeProvider>
              <AuthProvider>
              <DeepLinkHandler />
              <RevenueCatInitializer />
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
                  name="welcome" 
                  options={{ 
                    headerShown: false,
                    presentation: 'card',
                    gestureEnabled: false 
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
                <Stack.Screen 
                  name="(tabs)" 
                  options={{ 
                    headerShown: false,
                    presentation: 'card',
                    gestureEnabled: false
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
          </NavigationThemeProvider>
        </CustomThemeProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}

function NavigationThemeProvider({ children }: { children: React.ReactNode }) {
  const { isDark } = useTheme();
  
  return (
    <ThemeProvider value={isDark ? DarkTheme : DefaultTheme}>
      {children}
    </ThemeProvider>
  );
}

function DeepLinkHandler() {
  const { user } = useAuth();

  useEffect(() => {
    const cleanup = setupDeepLinkListeners(async (url) => {
      await handleDeepLink(url, !!user);
    });

    return cleanup;
  }, [user]);

  return null;
}

// Initialize RevenueCat and identify user
function RevenueCatInitializer() {
  const { user } = useAuth();

  useEffect(() => {
    // Initialize RevenueCat when app starts
    const init = async () => {
      try {
        await initializeRevenueCat();
        console.log('✅ RevenueCat initialized');
      } catch (error) {
        console.error('❌ RevenueCat initialization failed:', error);
      }
    };

    init();
  }, []);

  useEffect(() => {
    // Identify user when authenticated
    if (user?.id) {
      const identify = async () => {
        try {
          await identifyUser(user.id);
          console.log('✅ User identified in RevenueCat:', user.id);
        } catch (error) {
          console.error('❌ User identification failed:', error);
        }
      };

      identify();
    }
  }, [user?.id]);

  return null;
}
