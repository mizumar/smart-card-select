import React from "react";

interface CalloutNoticeProps {
  children?: React.ReactNode;
  title?: string;
  items?: string[]; // 配列を直接渡せるプロパティを追加
}

export function CalloutNotice({ children, title, items }: CalloutNoticeProps) {
  // children または items のいずれもない場合は何もレンダリングしない
  if (!children && (!items || items.length === 0)) return null;

  return (
    <div className="mt-2 text-[11px] text-slate-500 leading-relaxed">
      {title && <p className="font-bold text-slate-600 mb-0.5">{title}</p>}

      {/* items プロパティが渡された場合 */}
      {items && items.length > 0 ? (
        <ul className="list-none pl-4 space-y-0.5">
          {items.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      ) : (
        /* JSX（children）が渡された場合 */
        <div className="space-y-0.5 [&>ul]:list-disc [&>ul]:pl-4 [&>ol]:list-decimal [&>ol]:pl-4">
          {children}
        </div>
      )}
    </div>
  );
}
