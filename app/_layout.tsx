import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';

import '../global.css';
import { HeroUINativeProvider } from 'heroui-native';
import { AuthProvider } from '@/lib/auth/AuthContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { useColorScheme } from '@/components/useColorScheme';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
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
  const colorScheme = useColorScheme();

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <HeroUINativeProvider>
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
              <Stack.Screen 
                name="onboarding" 
                options={{ 
                  headerShown: false,
                  presentation: 'fullScreenModal',
                  animation: 'slide_from_bottom',
                  gestureEnabled: false 
                }} 
              />
              <Stack.Screen 
                name="(protected)" 
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
  );
}
