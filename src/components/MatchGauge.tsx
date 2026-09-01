"use client";

import React from "react";

interface MatchGaugeProps {
  score: number;
}

export const MatchGauge: React.FC<MatchGaugeProps> = ({ score }) => {
  const clampedScore = Math.min(Math.max(score, 0), 100);

  return (
    <div className="flex flex-col items-center justify-center py-3 px-2 select-none">
      {/* 1. ラベル（控えめなサイズと適切な下マージン） */}
      <span className="text-[11px] font-bold text-slate-400 tracking-tight mb-1">
        あなたとの適合度
      </span>

      {/* 2. メインの大きな数値（余白をしっかり確保） */}
      <div className="flex items-baseline leading-none my-1.5">
        <span className="text-4xl font-black text-slate-900 tracking-tight">
          {clampedScore}
        </span>
        <span className="text-base font-bold text-orange-500 ml-0.5">%</span>
      </div>

      {/* 3. 短めのバー（幅を100pxに絞り中央配置・角丸を最大化） */}
      <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden mt-1 border border-slate-200/40">
        <div
          className="h-full bg-linear-to-r from-amber-500 to-orange-500 rounded-full"
          style={{ width: `${clampedScore}%` }}
        />
      </div>
    </div>
  );
};
