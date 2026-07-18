import { create } from 'zustand';
import { observeAuth, signOut } from '@/auth/firebaseAuth';
import { setDevApiKey } from '@/api/omiApi';

interface AuthState {
  uid: string | null;
  token: string | null;
  loading: boolean;
  devApiKey: string | null;
  init: () => () => void;
  logout: () => Promise<void>;
  setDevKey: (key: string | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  uid: null,
  token: null,
  loading: true,
  devApiKey: null,
  init: () => {
    let unsub: (() => void) | null = null;
    observeAuth((uid, token) => {
      set({ uid, token, loading: false });
    }).then((fn) => {
      unsub = fn;
    });
    return () => {
      unsub?.();
    };
  },
  logout: async () => {
    await signOut();
    set({ uid: null, token: null });
  },
  setDevKey: (key) => {
    setDevApiKey(key);
    set({ devApiKey: key });
  },
}));
