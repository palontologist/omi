import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useAuthStore } from '@/state/authStore';

export default function RootLayout() {
  const init = useAuthStore((s) => s.init);
  const uid = useAuthStore((s) => s.uid);
  useEffect(() => init(), [init]);

  return (
    <SafeAreaProvider>
      <Stack screenOptions={{ headerShown: false }}>
        {uid ? (
          <>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="conversation/[id]" />
          </>
        ) : (
          <Stack.Screen name="onboarding" />
        )}
      </Stack>
    </SafeAreaProvider>
  );
}
