"use client";

import React from "react";
import { CreditCard } from "@/data/cards";
import { useCompareStore } from "@/store/useCompareStore";
import { CompareBar } from "@/components/compare/CompareBar";
import { CompareModal } from "@/components/compare/CompareModal";
import { calculateBreakEven } from "@/lib/compare/calculateBreakEven";
import { calculateAnnualBenefit } from "@/lib/compare/calculateAnnualBenefit";
import { getActiveCalloutNotices } from "@/lib/compare/getActiveCalloutNotices";

interface CompareBottomSheetProps {
  cards: CreditCard[];
}

export const CompareBottomSheet: React.FC<CompareBottomSheetProps> = ({
  cards,
}) => {
  // ★ isOpen, setIsOpen をストアから取得
  const {
    selectedIds,
    isOpen,
    setIsOpen,
    clearAll,
    toggleCard,
    removeAndClose,
  } = useCompareStore();

  // ★ selectedIds と cards.id を型を揃えて照合
  const selectedCards = cards.filter((c) => selectedIds.includes(String(c.id)));

  // ★ 1. 月間利用額の状態を追加（初期値: 10万円 = 100,000）
  const [monthlySpend, setMonthlySpend] = React.useState<number>(100000);

  const cardA = selectedCards[0];
  const cardB = selectedCards[1];

  // 損益分岐点・実質0円ラインの統合算出
  const breakEvenInfo = React.useMemo(
    () => calculateBreakEven(cardA, cardB),
    [cardA, cardB],
  );

  // 1枚も選択されていなければ何も表示しない（バーもモーダルも非表示）
  if (selectedCards.length === 0) return null;

  // ★ 2. 動的な年間実質お得額の計算関数（monthlySpend に依存）
  const benefitA = cardA ? calculateAnnualBenefit(cardA, monthlySpend) : null;
  const benefitB = cardB ? calculateAnnualBenefit(cardB, monthlySpend) : null;

  // 画面上に登場する※マークに対応する calloutNotices だけを抽出する関数
  const activeNoticesA = cardA ? getActiveCalloutNotices(cardA) : [];
  const activeNoticesB = cardB ? getActiveCalloutNotices(cardB) : [];
  const hasNotices = activeNoticesA.length > 0 || activeNoticesB.length > 0;

  return (
    <div>
      {/* ① フローティング比較バー */}
      <CompareBar
        selectedCards={selectedCards}
        onOpen={() => setIsOpen(true)}
        onClear={clearAll}
        onRemove={toggleCard}
      />
      {/* ② 比較モーダル */}
      {isOpen && cardA && cardB && benefitA && benefitB && (
        <CompareModal
          cardA={cardA}
          cardB={cardB}
          benefitA={benefitA}
          benefitB={benefitB}
          monthlySpend={monthlySpend}
          setMonthlySpend={setMonthlySpend}
          breakEvenInfo={breakEvenInfo}
          activeNoticesA={activeNoticesA}
          activeNoticesB={activeNoticesB}
          hasNotices={hasNotices}
        />
      )}
    </div>
  );
};
