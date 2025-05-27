import Toast from '@/components/Toast';
import { useAuthStore } from '@/store/authStore';
import { useFonts } from 'expo-font';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect, useState } from 'react';
import { View } from 'react-native';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync().catch(() => {
  /* ignore error */
});

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    // You can add custom fonts here if needed
  });
  const [isReady, setIsReady] = useState(false);
    const segments = useSegments();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const router = useRouter();

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    async function prepare() {
      try {
        // Pre-load fonts, make any API calls you need to do here
        await Promise.all([
          // Add any async operations here
        ]);
        
        // Add a minimum delay to show splash screen
        await new Promise(resolve => {
          timeoutId = setTimeout(resolve, 2000);
        });
      } catch (e) {
        console.warn(e);
      } finally {
        // Tell the application to render
        await SplashScreen.hideAsync();
        setIsReady(true);
      }
    }

    prepare();

    // Cleanup timeout on unmount
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, []);

  // Handle initial navigation based on auth state
  useEffect(() => {
    const inAuthGroup = segments[0] === '(tabs)';
    if (isReady) {
       if (!isAuthenticated && inAuthGroup) {
      // Redirect to the splash screen if not authenticated and trying to access protected routes
      router.replace('/');
    } else if (isAuthenticated && !inAuthGroup) {
      // Redirect to the main app if authenticated and on auth screens
      router.replace('/(tabs)');
    }
  }}, [isAuthenticated, segments]);

  // Keep showing the native splash screen until everything is ready
  if (!fontsLoaded || !isReady) {
    return null;
  }

  return (
    <View style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="login" />
        <Stack.Screen 
          name="expense/[id]" 
          options={{ 
            headerShown: true,
            title: 'Expense Details',
            animation: 'slide_from_right',
          }} 
        />
        <Stack.Screen 
          name="budget/create" 
          options={{ 
            headerShown: true,
            title: 'Create Budget',
            animation: 'slide_from_bottom',
          }} 
        />
      </Stack>
      <Toast />
    </View>
  );
}