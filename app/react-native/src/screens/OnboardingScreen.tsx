import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useAuthStore } from '@/state/authStore';

export default function OnboardingScreen() {
  const { devApiKey, setDevKey } = useAuthStore();
  return (
    <View style={styles.center}>
      <Text style={styles.title}>Welcome to Omi</Text>
      <Text style={styles.sub}>Sign in with Firebase to sync your memories.</Text>
      {/* Android: Google sign-in wired via @react-native-google-signin.
          Dev API key path mirrors DevApiKeyProvider. */}
      <Button title="Continue with Google" onPress={() => setDevKey(devApiKey)} />
      <Button title="Use dev API key" onPress={() => setDevKey('demo')} />
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24, gap: 12 },
  title: { fontSize: 24, fontWeight: '700' },
  sub: { fontSize: 15, color: '#8E8E93', textAlign: 'center' },
});
