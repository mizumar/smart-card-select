import { create } from "zustand";

interface CompareState {
  selectedIds: string[];
  isOpen: boolean; // ★ 追加
  toggleCard: (id: string) => void;
  clearAll: () => void;
  setSelectedIds: (ids: string[]) => void;
  setIsOpen: (isOpen: boolean) => void; // ★ 追加
}

export const useCompareStore = create<CompareState>((set) => ({
  selectedIds: [],
  isOpen: false, // ★ 追加

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

  clearAll: () => set({ selectedIds: [], isOpen: false }),

  // 診断結果から一括でセットする時、同時に isOpen も true にする
  setSelectedIds: (ids) =>
    set({
      selectedIds: ids.slice(0, 2).map(String),
      isOpen: true, // ★ 2枚セットされたら自動でモーダルを開く
    }),

  setIsOpen: (isOpen) => set({ isOpen }), // ★ 追加
}));
