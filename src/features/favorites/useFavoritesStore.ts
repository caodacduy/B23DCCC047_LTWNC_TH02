import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface FavoritesState {
  ids: string[];
  toggle: (id: string) => void;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set) => ({
      ids: [],
      toggle: (id: string) => {
        set((state) => {
          const exists = state.ids.includes(id);
          const nextIds = exists
            ? state.ids.filter((item) => item !== id)
            : [...state.ids, id];
          return { ids: nextIds };
        });
      },
    }),
    {
      name: 'music-favorites',
    }
  )
);
