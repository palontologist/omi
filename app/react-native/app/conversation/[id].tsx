import { useLocalSearchParams } from 'expo-router';
import ConversationDetailScreen from '@/screens/ConversationDetailScreen';

export default function ConversationDetailRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <ConversationDetailScreen id={id ?? ''} />;
}
