import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useMemoriesStore } from '@/state/memoriesStore';
import { useConversationsStore } from '@/state/conversationsStore';

export default function HomeScreen() {
  const memories = useMemoriesStore((s) => s.items);
  const conversations = useConversationsStore((s) => s.items);
  const loadMemories = useMemoriesStore((s) => s.load);
  const loadConversations = useConversationsStore((s) => s.load);

  useEffect(() => {
    loadMemories();
    loadConversations();
  }, [loadMemories, loadConversations]);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>Recent conversations</Text>
      {conversations.slice(0, 5).map((c) => (
        <Text key={c.id} style={styles.row}>{c.title ?? c.id}</Text>
      ))}
      <Text style={styles.heading}>Latest memories</Text>
      {memories.slice(0, 8).map((m) => (
        <Text key={m.id} style={styles.row}>{m.content.slice(0, 80)}</Text>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  heading: { fontSize: 18, fontWeight: '700', marginVertical: 8 },
  row: { fontSize: 14, paddingVertical: 6, borderBottomWidth: 1, borderColor: '#2A2A2E' },
});
