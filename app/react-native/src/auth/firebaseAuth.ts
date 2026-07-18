import { setAuthToken } from '@/api/omiApi';

/**
 * Firebase auth wrapper (Android-first). Mirrors lib/services/auth_service.dart:
 * the Firebase ID token is used as the Omi API bearer token.
 *
 * Firebase is loaded lazily so the app still builds/runs in environments without
 * the native @react-native-firebase modules installed (e.g. a test APK built
 * before google-services.json is provided). When absent, auth stays signed-out.
 */
type FirebaseAuthModule = typeof import('@react-native-firebase/auth').default;

let authMod: FirebaseAuthModule | null = null;
let loadPromise: Promise<FirebaseAuthModule | null> | null = null;

async function loadAuth(): Promise<FirebaseAuthModule | null> {
  if (authMod) return authMod;
  if (loadPromise) return loadPromise;
  loadPromise = import('@react-native-firebase/auth')
    .then((m) => {
      authMod = m.default;
      return authMod;
    })
    .catch(() => null);
  return loadPromise;
}

export async function signInWithGoogle(): Promise<void> {
  throw new Error('signInWithGoogle: wire @react-native-google-signin for Android');
}

export async function observeAuth(onChange: (uid: string | null, token: string | null) => void) {
  const auth = await loadAuth();
  if (!auth) {
    onChange(null, null);
    return () => {};
  }
  return auth().onAuthStateChanged(async (user) => {
    if (user) {
      const token = await user.getIdToken();
      setAuthToken(token);
      onChange(user.uid, token);
    } else {
      setAuthToken(null);
      onChange(null, null);
    }
  });
}

export async function signOut() {
  const auth = await loadAuth();
  if (auth) await auth().signOut();
}

export async function currentUid(): Promise<string | null> {
  const auth = await loadAuth();
  return auth?.().currentUser?.uid ?? null;
}
