"use client";

import { Search, X } from "lucide-react";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  isOpen: boolean;
  onToggle: (open: boolean) => void;
}

export function SearchInput({
  value,
  onChange,
  isOpen,
  onToggle,
}: SearchInputProps) {
  const handleClose = () => {
    onChange("");
    onToggle(false);
  };

  if (isOpen) {
    return (
      <div className="flex-1 flex items-center relative min-w-0 h-full transition-all duration-200">
        <Search className="absolute left-2.5 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="カード名・タグ..."
          className="w-full h-full pl-8 pr-7 text-xs bg-white text-slate-800 placeholder:text-slate-400 border border-slate-200 rounded-full shadow-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="button"
          onClick={handleClose}
          aria-label="検索を閉じる"
          className="absolute right-1.5 p-0.5 rounded-md hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => onToggle(true)}
      aria-label="検索を開く"
      className="h-full aspect-square rounded-full bg-white/60 hover:bg-white text-slate-600 hover:text-slate-800 transition-all duration-200 flex items-center justify-center shadow-xs shrink-0"
    >
      <Search className="h-4 w-4" />
    </button>
  );
}
