import { create } from "zustand";

interface CompareState {
  selectedIds: string[];
  toggleCard: (id: string) => void;
  clearAll: () => void;
}

export const useCompareStore = create<CompareState>((set) => ({
  selectedIds: [],
  toggleCard: (id) =>
    set((state) => {
      const exists = state.selectedIds.includes(id);
      
      // すでに選択中の場合は解除する（2個選ばれていても解除は可能）
      if (exists) {
        return { selectedIds: state.selectedIds.filter((item) => item !== id) };
      }
      
      // まだ選択していないカードで、すでに2個選ばれている場合は何も追加しない（無視する）
      if (state.selectedIds.length >= 2) {
        return state;
      }
      
      // 2個未満なら追加する
      return { selectedIds: [...state.selectedIds, id] };
    }),
  clearAll: () => set({ selectedIds: [] }),
}));