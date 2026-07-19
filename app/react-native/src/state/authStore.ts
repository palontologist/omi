import { create } from 'zustand';
import { observeAuth, signOut, signInWithGoogle, signInWithApple } from '@/auth/firebaseAuth';

interface AuthState {
  uid: string | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  init: () => () => void;
  loginWithGoogle: () => Promise<void>;
  loginWithApple: () => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  uid: null,
  token: null,
  loading: true,
  error: null,
  init: () => {
    const unsub = observeAuth((uid, token) => {
      set({ uid, token, loading: false });
    });
    return () => {
      unsub();
    };
  },
  loginWithGoogle: async () => {
    set({ loading: true, error: null });
    try {
      await signInWithGoogle();
    } catch (e: any) {
      console.error('[auth] Google sign-in error:', e);
      set({ error: e?.message ?? 'Google sign-in failed' });
    } finally {
      set({ loading: false });
    }
  },
  loginWithApple: async () => {
    set({ loading: true, error: null });
    try {
      await signInWithApple();
    } catch (e: any) {
      console.error('[auth] Apple sign-in error:', e);
      set({ error: e?.message ?? 'Apple sign-in failed' });
    } finally {
      set({ loading: false });
    }
  },
  logout: async () => {
    await signOut();
    set({ uid: null, token: null });
  },
}));
