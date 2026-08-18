"use client";

import React from "react";
import { Lightbulb } from "lucide-react";

interface CompareTooltipProps {
  isVisible: boolean;
}

export const CompareTooltip: React.FC<CompareTooltipProps> = ({
  isVisible,
}) => {
  if (!isVisible) return null;

  return (
    <div className="absolute right-full mr-1.5 top-1/2 -translate-y-1/2 z-20 pointer-events-none whitespace-nowrap">
      <div className="bg-slate-900 text-white text-[10px] font-medium px-2 py-0.5 rounded-md shadow-xs flex items-center gap-1 border border-slate-700/80 relative">
        <Lightbulb className="w-3 h-3 text-amber-400 shrink-0" />
        <span>ここを押して 2枚 比較！</span>
        {/* 右側の矢印 */}
        <div
          className="absolute left-full top-1/2 -translate-y-1/2 w-0 h-0 border-t-transparent border-b-transparent border-l-slate-900"
          style={{
            borderTopWidth: 3.5,
            borderBottomWidth: 3.5,
            borderLeftWidth: 4,
            borderRightWidth: 0,
          }}
        />
      </div>
    </div>
  );
};
