interface Benefit {
  baseRate: number;
  annualFee: number;
  netBenefit: number;
  formattedBenefit: string;
  isProfit: boolean;
}

interface AnnualBenefitProps {
  benefitA: Benefit;
  benefitB: Benefit;
  monthlySpend: number;
}

export function AnnualBenefit({
  benefitA,
  benefitB,
  monthlySpend,
}: AnnualBenefitProps) {
  return (
    <>
      {/* ① 年間お得額表示エリア */}
      <div>
        <div className="text-center mb-2">
          <p className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">
            年間実質お得額（シミュレーション）
          </p>
          <p className="text-[9px] text-slate-400 leading-tight mt-0.5">
            ※基本還元率での試算。特定店舗や特典によりさらに上振れる場合があります
          </p>
        </div>

        {/* 同額（無料×無料など還元率が同じ）の場合は1つに統合 */}
        {benefitA.netBenefit === benefitB.netBenefit ? (
          <div className="text-center py-2 bg-slate-50 rounded-xl border border-slate-100">
            <p className="text-[10px] font-bold text-slate-500 mb-0.5">
              2枚とも同じお得額です
            </p>
            <div>
              <span
                className={`text-2xl font-black tracking-tight ${
                  !benefitA.isProfit ? "text-red-500" : "text-emerald-600"
                }`}
              >
                {benefitA.netBenefit > 0 && "約"}
                {benefitA.formattedBenefit}
              </span>
              <span className="text-xs font-bold text-slate-400 ml-0.5">
                {benefitA.netBenefit > 0 ? "円相当/年" : "円/年"}
              </span>
            </div>
            <div className="mt-1 text-[9px] text-slate-400 font-mono">
              基本 {benefitA.baseRate}% × 年間
              {(monthlySpend * 12) / 10000}万 - 年会費
            </div>
          </div>
        ) : (
          /* 差額がある場合：チップなしでシンプルに2列並べる */
          <div className="grid grid-cols-2 divide-x divide-slate-100 text-center items-center">
            {[
              { benefit: benefitA, other: benefitB },
              { benefit: benefitB, other: benefitA },
            ].map(({ benefit, other }, idx) => {
              const isWinner = benefit.netBenefit > other.netBenefit;
              return (
                <div key={idx} className="px-1.5 flex flex-col items-center">
                  <div>
                    <span
                      className={`text-xl font-black tracking-tight ${
                        !benefit.isProfit
                          ? "text-red-500"
                          : isWinner
                            ? "text-emerald-600"
                            : "text-slate-700"
                      }`}
                    >
                      {benefit.netBenefit > 0 && "約"}
                      {benefit.formattedBenefit}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 ml-0.5">
                      {benefit.netBenefit > 0 ? "円相当/年" : "円/年"}
                    </span>
                  </div>
                  <div className="mt-1.5 text-[9px] text-slate-400 font-mono bg-slate-50 px-2 py-0.5 rounded border border-slate-100/80 whitespace-nowrap">
                    基本 {benefit.baseRate}% × 年間
                    {(monthlySpend * 12) / 10000}万 - 年会費
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
