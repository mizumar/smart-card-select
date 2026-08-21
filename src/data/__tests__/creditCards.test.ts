import basicData from "../cards-basic.json";
import affiliateData from "../cards-affiliate.json";
import specData from "../cards-spec.json";
import { cards } from "../cards";

describe("creditCards data integrity", () => {
  // 1. 件数がすべて揃っているか確認
  test("全JSONファイルのデータ件数が一致していること", () => {
    expect(affiliateData.length).toBe(basicData.length);
    expect(specData.length).toBe(basicData.length);
  });

  // 2. IDの紐付け漏れ（タイポ）がないか確認
  test("すべてのカードで ID が欠けておらず、正しく結合されていること", () => {
    const basicIds = basicData.map((c) => c.id).sort();
    const affiliateIds = affiliateData.map((c) => c.id).sort();
    const specIds = specData.map((c) => c.id).sort();

    // basicのIDと他ファイルのIDが完全に一致するか
    expect(affiliateIds).toEqual(basicIds);
    expect(specIds).toEqual(basicIds);
  });

  // 3. 結合後のデータに必須プロパティが存在するか確認
  test("マージ後の cards に必要な基本データが含まれていること", () => {
    expect(cards.length).toBe(basicData.length);

    cards.forEach((card) => {
      expect(card.id).toBeDefined();
      expect(card.name).toBeDefined();
      // 分割先から正しくマージできているか
      expect(card.affiliateUrl).toBeDefined();
      expect(card.annualFee).toBeDefined();
    });
  });
});
