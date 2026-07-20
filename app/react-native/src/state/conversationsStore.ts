import { create } from 'zustand';
import { listConversations, getConversation, Conversation } from '@/api/omiApi';

interface ConversationsState {
  items: Conversation[];
  loading: boolean;
  selected: Conversation | null;
  load: () => Promise<void>;
  open: (id: string) => Promise<void>;
}

export const useConversationsStore = create<ConversationsState>((set, get) => ({
  items: [],
  loading: false,
  selected: null,
  load: async () => {
    if (get().loading) return;
    set({ loading: true });
    try {
      const res = await listConversations(50, 0);
      set({ items: res.data.results });
    } finally {
      set({ loading: false });
    }
  },
  open: async (id) => {
    const res = await getConversation(id);
    set({ selected: res.data });
  },
}));
