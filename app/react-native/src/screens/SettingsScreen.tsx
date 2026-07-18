import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useAuthStore } from '@/state/authStore';

export default function SettingsScreen() {
  const { uid, logout, devApiKey } = useAuthStore();
  return (
    <View style={styles.container}>
      <Text style={styles.row}>Account: {uid ?? 'signed out'}</Text>
      <Text style={styles.row}>Dev API key: {devApiKey ?? 'off'}</Text>
      <Button title="Sign out" onPress={() => logout()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, gap: 12 },
  row: { fontSize: 15 },
});
