import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { getActionItems, createActionItem, ActionItem } from '@/api/omiApi';

function group(items: ActionItem[]): { label: string; items: ActionItem[] }[] {
  const later: ActionItem[] = [];
  const none: ActionItem[] = [];
  const soon: ActionItem[] = [];
  for (const it of items) {
    if (it.due_date) soon.push(it);
    else if (it.priority && it.priority.toLowerCase() === 'later') later.push(it);
    else none.push(it);
  }
  return [
    { label: 'LATER', items: later },
    { label: 'NO DEADLINE', items: none },
    { label: 'UPCOMING', items: soon },
  ].filter((g) => g.items.length > 0);
}

export default function GoalsScreen() {
  const [items, setItems] = useState<ActionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [draft, setDraft] = useState('');
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(() => {
    let active = true;
    getActionItems()
      .then((list) => { if (active) setItems(list); })
      .catch(() => { if (active) setItems([]); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  useEffect(() => load(), [load]);

  const addTask = async (): Promise<void> => {
    const description = draft.trim();
    if (!description || adding) return;
    setAdding(true);
    setError(null);
    try {
      const created = await createActionItem(description);
      setItems((prev) => [created, ...prev]);
      setDraft('');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not add task');
    } finally {
      setAdding(false);
    }
  };

  const groups = group(items);

  return (
    <View style={styles.container}>
      <View style={styles.composer}>
        <TextInput
          style={styles.input}
          placeholder="Add a task…"
          placeholderTextColor="#7A7A80"
          value={draft}
          onChangeText={setDraft}
          onSubmitEditing={() => void addTask()}
          returnKeyType="done"
        />
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => void addTask()}
          disabled={adding || !draft.trim()}
        >
          <Text style={styles.addBtnText}>{adding ? '…' : 'Add'}</Text>
        </TouchableOpacity>
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}

      {loading ? (
        <ActivityIndicator color="#0A84FF" style={{ marginTop: 12 }} />
      ) : items.length === 0 ? (
        <Text style={styles.empty}>No goals or tasks yet.</Text>
      ) : (
        <FlatList
          data={groups}
          keyExtractor={(g) => g.label}
          renderItem={({ item }) => (
            <View style={styles.group}>
              <Text style={styles.groupTitle}>{item.label}</Text>
              {item.items.map((t) => (
                <View key={t.id} style={styles.task}>
                  <Text style={styles.taskText}>{t.description}</Text>
                </View>
              ))}
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#0B0B0F' },
  composer: { flexDirection: 'row', gap: 8, marginBottom: 8 },
  input: {
    flex: 1, backgroundColor: '#1C1C1E', borderRadius: 10, paddingHorizontal: 12,
    paddingVertical: 10, color: '#FFF', fontSize: 14,
  },
  addBtn: {
    backgroundColor: '#0A84FF', borderRadius: 10, paddingHorizontal: 16, justifyContent: 'center',
  },
  addBtnText: { color: '#FFF', fontWeight: '700' },
  error: { color: '#FF453A', fontSize: 12, marginBottom: 8 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#0B0B0F' },
  empty: { color: '#6A6A70', fontSize: 14, marginTop: 12 },
  group: { marginBottom: 18 },
  groupTitle: { color: '#8E8E93', fontSize: 12, fontWeight: '700', marginBottom: 8, letterSpacing: 1 },
  task: {
    backgroundColor: '#1C1C1E', borderRadius: 10, padding: 12, marginBottom: 8,
  },
  taskText: { color: '#FFF', fontSize: 14 },
});
