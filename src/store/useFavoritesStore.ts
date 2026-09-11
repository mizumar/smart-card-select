import { create } from "zustand";
import { persist } from "zustand/middleware";

interface FavoritesState {
  favoriteIds: string[];
  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favoriteIds: [],

      toggleFavorite: (id: string) => {
        const { favoriteIds } = get();
        const next = favoriteIds.includes(id)
          ? favoriteIds.filter((favId) => favId !== id)
          : [...favoriteIds, id];

        set({ favoriteIds: next });
      },

      isFavorite: (id: string) => {
        return get().favoriteIds.includes(id);
      },
    }),
    {
      name: "smart_card_favorites", // localStorageのキー名
    },
  ),
);
