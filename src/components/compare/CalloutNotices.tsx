"use client";

interface CalloutNoticesProps {
  activeNoticesA: string[];
  activeNoticesB: string[];
}

/**
 * calloutNotices の表示
 * @param {string[]} activeNoticesA
 * @param {string[]} activeNoticesB
 * @returns
 */
export function CalloutNotices({
  activeNoticesA,
  activeNoticesB,
}: CalloutNoticesProps) {
  return (
    <>
      <div className="h-px bg-slate-100" />
      <div>
        <p className="text-[10px] font-bold text-slate-400 tracking-wider uppercase mb-1.5">
          注記事項
        </p>
        <div className="grid grid-cols-2 gap-3 text-[9px] text-slate-400 leading-relaxed font-sans">
          <div className="space-y-1">
            {activeNoticesA.map((notice, idx) => (
              <p key={idx} className="wrap-break-word">
                {notice}
              </p>
            ))}
          </div>
          <div className="space-y-1">
            {activeNoticesB.map((notice, idx) => (
              <p key={idx} className="wrap-break-word">
                {notice}
              </p>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
