import Link from "next/link";

interface DiagnosticBannerProps {
  text?: string;
  buttonText?: string;
}

export function DiagnosticBanner({
  text = "あなたにぴったりの1枚を10秒で診断してみませんか？",
  buttonText = "10秒診断ツールを使ってみる",
}: DiagnosticBannerProps) {
  return (
    <div className="mt-8 pt-4 border-t border-slate-100 text-center">
      <p className="text-[11px] text-slate-500 font-medium mb-3">{text}</p>
      <Link
        href="/"
        className="inline-block w-full bg-slate-900 text-white text-xs font-bold py-3 rounded-xl shadow-sm hover:bg-slate-800 transition-colors"
      >
        {buttonText}
      </Link>
    </div>
  );
}
