import fs from "fs";
import matter from "gray-matter";
import { getAllFeatures } from "../features";

// fs モジュールと gray-matter のモックを作成
jest.mock("fs");
jest.mock("gray-matter");

describe("getAllFeatures", () => {
  const mockedFs = fs as jest.Mocked<typeof fs>;
  const mockedMatter = matter as unknown as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("ディレクトリが存在しない場合は空配列を返すこと", () => {
    mockedFs.existsSync.mockReturnValue(false);

    const result = getAllFeatures();

    expect(result).toEqual([]);
    expect(mockedFs.existsSync).toHaveBeenCalled();
  });

  test("src/content/features 配下の Markdown ファイルをパースして一覧を返すこと", () => {
    // ディレクトリが存在し、ファイルが2つある状態をモック
    mockedFs.existsSync.mockReturnValue(true);
    mockedFs.readdirSync.mockReturnValue([
      "fee-free.md",
      "gold-card.md",
      "ignore-me.txt", // .md 以外のファイルは無視されることの検証用
    ] as any);

    mockedFs.readFileSync
      .mockReturnValueOnce("--- title: 年会費無料特集 ---")
      .mockReturnValueOnce("--- title: ゴールドカード特集 ---");

    // gray-matter の戻り値をモック
    mockedMatter
      .mockReturnValueOnce({
        data: {
          title: "年会費無料特集",
          description: "お得なカード紹介",
          updatedAt: "2026.03.01",
          icon: "gift",
          cardIds: ["smbc-nl", "jcb-w"],
        },
        content: "本文",
      })
      .mockReturnValueOnce({
        data: {
          title: "ゴールドカード特集",
          description: "ステータスカード紹介",
          date: "2026/02/15", // updatedAt がなく date のみ存在するパターン
          icon: "crown",
        },
        content: "本文2",
      });

    const results = getAllFeatures();

    expect(results).toHaveLength(2);

    // 1件目の検証（updatedAt を最優先で取得）
    expect(results[0]).toEqual({
      id: "fee-free",
      title: "年会費無料特集",
      description: "お得なカード紹介",
      date: "2026.03.01",
      icon: "gift",
      cardIds: ["smbc-nl", "jcb-w"],
    });

    // 2件目の検証（date を取得・cardIds がない場合は空配列）
    expect(results[1]).toEqual({
      id: "gold-card",
      title: "ゴールドカード特集",
      description: "ステータスカード紹介",
      date: "2026/02/15",
      icon: "crown",
      cardIds: [],
    });
  });
});
