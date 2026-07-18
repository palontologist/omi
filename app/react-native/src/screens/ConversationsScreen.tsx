import React, { useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useConversationsStore } from '@/state/conversationsStore';

export default function ConversationsScreen() {
  const items = useConversationsStore((s) => s.items);
  const load = useConversationsStore((s) => s.load);
  const router = useRouter();
  useEffect(() => { load(); }, [load]);

  return (
    <FlatList
      style={styles.container}
      data={items}
      keyExtractor={(c) => c.id}
      renderItem={({ item }) => (
        <TouchableOpacity onPress={() => router.push({ pathname: '/conversation/[id]', params: { id: item.id } })}>
          <Text style={styles.row}>{item.title ?? item.id}</Text>
        </TouchableOpacity>
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  row: { fontSize: 15, paddingVertical: 12, borderBottomWidth: 1, borderColor: '#2A2A2E' },
});
