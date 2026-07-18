import React, { useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useMemoriesStore } from '@/state/memoriesStore';

export default function MemoriesScreen() {
  const items = useMemoriesStore((s) => s.items);
  const load = useMemoriesStore((s) => s.load);
  useEffect(() => { load(); }, [load]);

  return (
    <FlatList
      style={styles.container}
      data={items}
      keyExtractor={(m) => m.id}
      renderItem={({ item }) => (
        <View style={styles.card}>
          <Text style={styles.content}>{item.content}</Text>
          <Text style={styles.tags}>{(item.tags ?? []).join(', ')}</Text>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  card: { padding: 12, marginBottom: 10, backgroundColor: '#1C1C1E', borderRadius: 12 },
  content: { fontSize: 15 },
  tags: { fontSize: 12, color: '#8E8E93', marginTop: 4 },
});
