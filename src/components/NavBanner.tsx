import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

type NavBannerProps = {
  href?: string;
  onClick?: () => void;
  subTitle: string;
  title: string;
  icon: React.ReactNode;
  theme: "orange" | "indigo";
};

// テーマごとのスタイル定義
const themeStyles = {
  orange: {
    bg: "from-amber-500/10 via-orange-500/10 to-rose-500/10 hover:from-amber-500/20 hover:to-rose-500/20",
    border: "border-orange-500/20",
    glow: "bg-orange-400/20",
    iconBg: "from-amber-500 to-orange-500 shadow-orange-500/30",
    subText: "text-orange-600/90",
    arrow: "text-orange-400/80 group-hover:text-orange-600",
  },
  indigo: {
    bg: "from-slate-500/10 via-indigo-500/10 to-blue-500/10 hover:from-slate-500/20 hover:to-blue-500/20",
    border: "border-indigo-500/20",
    glow: "bg-indigo-400/20",
    iconBg: "from-slate-800 via-indigo-900 to-slate-900 shadow-indigo-950/30",
    subText: "text-indigo-600/90",
    arrow: "text-indigo-400/80 group-hover:text-indigo-600",
  },
};

export const NavBanner = ({
  href,
  onClick,
  subTitle,
  title,
  icon,
  theme,
}: NavBannerProps) => {
  const t = themeStyles[theme];

  const content = (
    <>
      <div
        className={`absolute -right-4 -top-4 w-12 h-12 rounded-full blur-xl group-hover:scale-150 transition-transform duration-500 ${t.glow}`}
      />
      <div className="flex items-center gap-2.5 min-w-0 relative z-10">
        <div
          className={`flex items-center justify-center w-9 h-9 rounded-xl bg-linear-to-br text-white shrink-0 shadow-sm border border-white/20 ${t.iconBg}`}
        >
          {icon}
        </div>
        <div className="min-w-0">
          <p className={`text-[10px] font-bold leading-none mb-1 ${t.subText}`}>
            {subTitle}
          </p>
          <p className="text-xs font-black text-slate-800 leading-none truncate">
            {title}
          </p>
        </div>
      </div>
      <ChevronRight
        className={`w-4 h-4 group-hover:translate-x-0.5 transition-all shrink-0 relative z-10 ${t.arrow}`}
      />
    </>
  );

  const className = `group relative flex items-center justify-between p-3 bg-linear-to-br ${t.bg} border ${t.border} rounded-2xl transition-all duration-200 active:scale-[0.97] text-left overflow-hidden shadow-xs w-full`;

  if (href) {
    return (
      <Link href={href} className={className}>
        {content}
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={className}>
      {content}
    </button>
  );
};
