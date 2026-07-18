import { setAuthToken } from '@/api/omiApi';

/**
 * Auth wrapper (Firebase pending).
 *
 * Firebase native modules are intentionally NOT imported here so the app builds
 * and runs without a google-services.json. When Firebase is wired up later
 * (add @react-native-firebase/app + /auth, the config plugins in app.json, and
 * google-services.json), replace the stubs below with the real implementation
 * (Firebase ID token forwarded as the Omi bearer token).
 */
export async function signInWithGoogle(): Promise<void> {
  throw new Error('signInWithGoogle: Firebase not configured in this build');
}

export async function observeAuth(onChange: (uid: string | null, token: string | null) => void) {
  onChange(null, null);
  return () => {};
}

export async function signOut() {
  /* no-op */
}

export async function currentUid(): Promise<string | null> {
  return null;
}

void setAuthToken;
