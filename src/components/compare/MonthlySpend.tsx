import { ArrowRight, ArrowLeft, Zap } from "lucide-react";

interface BreakEvenInfo {
  zeroSpendA: number | null;
  zeroSpendB: number | null;
  crossSpend: number | null;
}

interface MonthlySpendProps {
  monthlySpend: number;
  setMonthlySpend: React.Dispatch<React.SetStateAction<number>>;
  breakEvenInfo: BreakEvenInfo | null;
}

export function MonthlySpend({
  monthlySpend,
  setMonthlySpend,
  breakEvenInfo,
}: MonthlySpendProps) {
  return (
    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 space-y-3">
      {/* メイン金額表示 */}
      <div className="flex justify-between items-baseline">
        <span className="text-xs font-bold text-slate-700">
          想定の月間カード利用額
        </span>
        <span className="text-base font-black text-slate-900 tracking-tight">
          {monthlySpend >= 10000 ? (
            <>
              {(monthlySpend / 10000).toLocaleString(undefined, {
                maximumFractionDigits: 2,
              })}
              <span className="text-xs font-medium text-slate-500 ml-0.5">
                万円/月
              </span>
            </>
          ) : (
            <>
              {monthlySpend.toLocaleString()}
              <span className="text-xs font-medium text-slate-500 ml-0.5">
                円/月
              </span>
            </>
          )}
        </span>
      </div>

      {/* レンジスライダー */}
      <div>
        <input
          type="range"
          min="0"
          max="1000000"
          step="10000"
          value={monthlySpend}
          onChange={(e) => setMonthlySpend(Number(e.target.value))}
          className="w-full accent-emerald-500 cursor-pointer h-1.5 bg-slate-200 rounded-lg appearance-none block"
        />
        <div className="relative mx-1 mt-1.5 h-3 text-[9px] text-slate-400 font-medium">
          <span className="absolute left-0">0円</span>
          <span className="absolute left-1/4 -translate-x-1/2">25万円</span>
          <span className="absolute left-1/2 -translate-x-1/2">50万円</span>
          <span className="absolute left-3/4 -translate-x-1/2">75万円</span>
          <span className="absolute right-0">100万円</span>
        </div>
      </div>

      {/* ▼▼▼ 全パターン対応・洗練された分岐点チップ群 ▼▼▼ */}
      {breakEvenInfo && (
        <div className="pt-2 border-t border-slate-200/60 flex items-center gap-1.5 flex-wrap">
          <span className="text-[10px] font-medium text-slate-400 mr-0.5 shrink-0 select-none">
            自動セット
          </span>

          {/* 損益分岐点（有料vs有料、有料vs無料のどちらでも計算可能であれば表示） */}
          {breakEvenInfo.crossSpend && (
            <button
              type="button"
              onClick={() => setMonthlySpend(breakEvenInfo.crossSpend!)}
              className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2.5 py-1 rounded-full border transition-all active:scale-95 cursor-pointer ${
                monthlySpend === breakEvenInfo.crossSpend
                  ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
                  : "bg-emerald-50/80 hover:bg-emerald-100 text-emerald-700 border-emerald-200/80"
              }`}
            >
              <Zap className="w-2.5 h-2.5 shrink-0" />
              <span>損益分岐点</span>
            </button>
          )}

          {/* 左カード：単体での実質0円ライン */}
          {breakEvenInfo.zeroSpendA && (
            <button
              type="button"
              onClick={() => setMonthlySpend(breakEvenInfo.zeroSpendA!)}
              className={`inline-flex items-center gap-1 text-[10px] font-medium px-2.5 py-1 rounded-full border transition-all active:scale-95 cursor-pointer ${
                monthlySpend === breakEvenInfo.zeroSpendA
                  ? "bg-slate-800 text-white border-slate-800 shadow-xs"
                  : "bg-white hover:bg-slate-100 text-slate-600 border-slate-200"
              }`}
            >
              <ArrowLeft className="w-2.5 h-2.5 shrink-0" />
              <span>実質0円</span>
            </button>
          )}

          {/* 右カード：単体での実質0円ライン */}
          {breakEvenInfo.zeroSpendB && (
            <button
              type="button"
              onClick={() => setMonthlySpend(breakEvenInfo.zeroSpendB!)}
              className={`inline-flex items-center gap-1 text-[10px] font-medium px-2.5 py-1 rounded-full border transition-all active:scale-95 cursor-pointer ${
                monthlySpend === breakEvenInfo.zeroSpendB
                  ? "bg-slate-800 text-white border-slate-800 shadow-xs"
                  : "bg-white hover:bg-slate-100 text-slate-600 border-slate-200"
              }`}
            >
              <span>実質0円</span>
              <ArrowRight className="w-2.5 h-2.5 shrink-0" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
