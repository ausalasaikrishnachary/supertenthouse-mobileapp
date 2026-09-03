import { useEffect } from 'react';
import { Stack, SplashScreen } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { useFonts } from 'expo-font';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from '@expo-google-fonts/inter';
import { AuthProvider } from '@/store/auth';
import { CartProvider } from '@/store/cart';
import { WishlistProvider } from '@/store/wishlist';
import { ToastProvider } from '@/store/toast';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { COLORS } from '@/constants/theme';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useFrameworkReady();

  const [fontsLoaded, fontError] = useFonts({
    'Inter-Regular': Inter_400Regular,
    'Inter-Medium': Inter_500Medium,
    'Inter-SemiBold': Inter_600SemiBold,
    'Inter-Bold': Inter_700Bold,
    'Inter-Light': Inter_400Regular,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: COLORS.offWhite }}>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <ToastProvider>
              <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="(auth)" options={{ headerShown: false }} />
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="product/[id]" options={{ headerShown: false, animation: 'slide_from_right' }} />
                <Stack.Screen name="category/[id]" options={{ headerShown: false, animation: 'slide_from_right' }} />
                <Stack.Screen name="checkout" options={{ headerShown: false, animation: 'slide_from_right' }} />
                <Stack.Screen name="order-success" options={{ headerShown: false, animation: 'fade' }} />
                <Stack.Screen name="package/[id]" options={{ headerShown: false, animation: 'slide_from_right' }} />
                <Stack.Screen name="package-list" options={{ headerShown: false, animation: 'slide_from_right' }} />
                <Stack.Screen name="search" options={{ headerShown: false, animation: 'slide_from_right' }} />
                <Stack.Screen name="wishlist" options={{ headerShown: false, animation: 'slide_from_right' }} />
                <Stack.Screen name="notifications" options={{ headerShown: false, animation: 'slide_from_right' }} />
                <Stack.Screen name="addresses" options={{ headerShown: false, animation: 'slide_from_right' }} />
                <Stack.Screen name="order-details/[id]" options={{ headerShown: false, animation: 'slide_from_right' }} />
                <Stack.Screen name="support" options={{ headerShown: false, animation: 'slide_from_right' }} />
                <Stack.Screen name="admin" options={{ headerShown: false, animation: 'slide_from_right' }} />
                <Stack.Screen name="+not-found" />
              </Stack>
              <StatusBar style="dark" />
            </ToastProvider>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}
