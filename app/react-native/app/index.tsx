import { Redirect } from 'expo-router';
import { useAuthStore } from '@/state/authStore';

export default function Index() {
  const uid = useAuthStore((s) => s.uid);
  return <Redirect href={uid ? '/(tabs)' : '/onboarding'} />;
}
