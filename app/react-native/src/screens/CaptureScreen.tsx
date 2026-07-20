import React from 'react';
import { View, Text, Button, StyleSheet, ScrollView } from 'react-native';
import { useCaptureStore } from '@/state/captureStore';

export default function CaptureScreen() {
  const { recording, segments, start, stop } = useCaptureStore();

  return (
    <View style={styles.container}>
      <Button title={recording ? 'Stop' : 'Start'} onPress={() => (recording ? stop() : start())} />
      <ScrollView style={styles.transcript}>
        {segments.map((s, i) => (
          <Text key={i} style={styles.seg}>
            {s.speaker}: {s.text}
          </Text>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, gap: 12 },
  transcript: { flex: 1, marginTop: 8 },
  seg: { fontSize: 14, paddingVertical: 4 },
});
