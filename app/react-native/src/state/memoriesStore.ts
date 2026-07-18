import { create } from 'zustand';
import { getMemories, createMemory, Memory } from '@/api/omiApi';

interface MemoriesState {
  items: Memory[];
  loading: boolean;
  load: (refresh?: boolean) => Promise<void>;
  add: (content: string, tags?: string[]) => Promise<void>;
}

export const useMemoriesStore = create<MemoriesState>((set, get) => ({
  items: [],
  loading: false,
  load: async (refresh = false) => {
    if (get().loading) return;
    set({ loading: true });
    try {
      const all: Memory[] = [];
      let offset = 0;
      const limit = 200;
      for (;;) {
        const res = await getMemories(limit, offset);
        all.push(...res.data.results);
        if (res.data.results.length < limit) break;
        offset += limit;
      }
      set({ items: all });
    } finally {
      set({ loading: false });
    }
  },
  add: async (content, tags = []) => {
    const res = await createMemory(content, tags);
    set({ items: [res.data, ...get().items] });
  },
}));
