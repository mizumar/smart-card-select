"use client";

import React from "react";
import { Heart } from "lucide-react";
import { useFavoritesStore } from "@/store/useFavoritesStore";

interface FavoriteButtonProps {
  cardId: string;
}

export const FavoriteButton: React.FC<FavoriteButtonProps> = ({ cardId }) => {
  const favoriteIds = useFavoritesStore((state) => state.favoriteIds);
  const toggleFavorite = useFavoritesStore((state) => state.toggleFavorite);
  const isFavorite = favoriteIds.includes(cardId);
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        toggleFavorite(cardId);
      }}
      aria-label={isFavorite ? "お気に入りから解除" : "お気に入りに追加"}
      className={`p-1.5 rounded-full border transition-colors flex items-center justify-center shrink-0 ${
        isFavorite
          ? "border-red-200 bg-red-50 text-red-500 hover:bg-red-100"
          : "border-slate-200 bg-white text-slate-400 hover:text-slate-600 hover:bg-slate-50"
      }`}
    >
      <Heart
        className={`w-2.5 h-2.5 ${
          isFavorite ? "fill-red-500 text-red-500" : "stroke-2"
        }`}
      />
    </button>
  );
};
