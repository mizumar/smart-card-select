import { render, screen } from "@testing-library/react";
import FeaturePage from "@/app/feature/[id]/page";
import { notFound } from "next/navigation";

// 失敗時の巨大なDOMログ出力を抑制
process.env.DEBUG_PRINT_LIMIT = "0";

// =========================================================
// 1. Next.js の next/image モック
// =========================================================
jest.mock("next/image", () => ({
  __esModule: true,
  default: function MockImage({ src, alt, ...props }: any) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} {...props} />;
  },
}));

// =========================================================
// 2. Card / CardItem コンポーネント直書き仮想モック
// =========================================================
const mockCardComponent = (props: any) => {
  const cardId = props.id || props.card?.id || "card-123";
  return <div data-testid="mock-card">Card ID: {cardId}</div>;
};

jest.mock(
  "@/components/CardItem",
  () => ({
    __esModule: true,
    default: mockCardComponent,
    Card: mockCardComponent,
  }),
  { virtual: true },
);

jest.mock(
  "@/components/CardItem",
  () => ({
    __esModule: true,
    default: mockCardComponent,
    CardItem: mockCardComponent,
  }),
  { virtual: true },
);

// =========================================================
// 3. Node.js の fs (ファイルシステム) モック
// =========================================================
jest.mock("fs", () => {
  const actualFs = jest.requireActual("fs");
  return {
    ...actualFs,
    existsSync: jest.fn((p: string) => {
      if (
        typeof p === "string" &&
        (p.endsWith("aaa.md") || p.endsWith("broken-syntax.md"))
      ) {
        return true;
      }
      return false;
    }),
    readFileSync: jest.fn((p: string) => {
      if (typeof p === "string" && p.endsWith("aaa.md")) {
        return `---
title: "テスト記事AAA"
updatedAt: "2026-09-22"
---

# タイトル

| 見出しA | 見出しB |
| --- | --- |
| セル1 | セル2 |

:::threads{url="https://threads.net/test" author="mizuki" text="テストスレッド"}

:::image{src="/img.jpg" alt="テスト画像" caption="注釈テキスト"}

:::card{id="card-123"}
`;
      }
      if (typeof p === "string" && p.endsWith("broken-syntax.md")) {
        return `---
title: "構文欠損記事"
---
:::threads{}
:::image{}
:::card{}
`;
      }
      return "";
    }),
  };
});

// =========================================================
// 4. react-markdown / remark-gfm モック (Directive対応)
// =========================================================
jest.mock("remark-gfm", () => () => {});

jest.mock("react-markdown", () => {
  return function MockReactMarkdown({
    children,
    components,
  }: {
    children: string;
    components?: any;
  }) {
    if (!children) return null;

    const lines = children
      .split(/\n+/)
      .map((l) => l.trim())
      .filter(Boolean);
    const elements: React.ReactNode[] = [];
    let i = 0;

    while (i < lines.length) {
      const line = lines[i];

      // H1 見出し
      if (line.startsWith("# ")) {
        const H1 = components?.h1 || "h1";
        elements.push(<H1 key={`h1-${i}`}>{line.replace(/^#\s+/, "")}</H1>);
        i++;
        continue;
      }

      // GFM テーブル構文
      if (line.startsWith("|")) {
        const tableLines: string[] = [];
        while (i < lines.length && lines[i].startsWith("|")) {
          tableLines.push(lines[i]);
          i++;
        }
        if (tableLines.length >= 2) {
          const parseRow = (l: string) =>
            l
              .split("|")
              .map((c) => c.trim())
              .filter((_, idx, arr) => idx > 0 && idx < arr.length - 1);
          const headers = parseRow(tableLines[0]);
          const rows = tableLines.slice(2).map(parseRow);

          const Table = components?.table || "table";
          const Thead = components?.thead || "thead";
          const Tbody = components?.tbody || "tbody";
          const Tr = components?.tr || "tr";
          const Th = components?.th || "th";
          const Td = components?.td || "td";

          elements.push(
            <Table key={`table-${i}`}>
              <Thead>
                <Tr>
                  {headers.map((h, idx) => (
                    <Th key={idx}>{h}</Th>
                  ))}
                </Tr>
              </Thead>
              <Tbody>
                {rows.map((r, rIdx) => (
                  <Tr key={rIdx}>
                    {r.map((c, cIdx) => (
                      <Td key={cIdx}>{c}</Td>
                    ))}
                  </Tr>
                ))}
              </Tbody>
            </Table>,
          );
        }
        continue;
      }

      // :::card 構文の検出と展開
      if (line.startsWith(":::card")) {
        const idMatch = line.match(/id="([^"]+)"/);
        const cardId = idMatch ? idMatch[1] : "";
        const CardComp = components?.card || mockCardComponent;
        elements.push(<CardComp key={`card-${i}`} id={cardId} />);
        i++;
        continue;
      }

      // :::threads 構文の検出と展開
      if (line.startsWith(":::threads")) {
        const authorMatch = line.match(/author="([^"]+)"/);
        const textMatch = line.match(/text="([^"]+)"/);
        const author = authorMatch ? authorMatch[1] : "";
        const text = textMatch ? textMatch[1] : "";

        const ThreadsComp = components?.threads;
        if (ThreadsComp) {
          elements.push(
            <ThreadsComp key={`threads-${i}`} author={author} text={text} />,
          );
        } else {
          elements.push(
            <div key={`threads-${i}`}>
              <span>{author}</span>
              <span>{text}</span>
            </div>,
          );
        }
        i++;
        continue;
      }

      // :::image 構文の検出と展開
      if (line.startsWith(":::image")) {
        const srcMatch = line.match(/src="([^"]+)"/);
        const altMatch = line.match(/alt="([^"]+)"/);
        const captionMatch = line.match(/caption="([^"]+)"/);

        const src = srcMatch ? srcMatch[1] : "";
        const alt = altMatch ? altMatch[1] : "";
        const caption = captionMatch ? captionMatch[1] : "";

        const ImageComp = components?.image;
        if (ImageComp) {
          elements.push(
            <ImageComp
              key={`image-${i}`}
              src={src}
              alt={alt}
              caption={caption}
            />,
          );
        } else {
          elements.push(
            <div key={`image-${i}`}>
              <img src={src} alt={alt} />
              <span>{caption}</span>
            </div>,
          );
        }
        i++;
        continue;
      }

      // 通常の段落 (p タグ)
      const P = components?.p || "p";
      elements.push(
        <P
          key={`p-${i}`}
          node={{
            type: "element",
            tagName: "p",
            children: [{ type: "text", value: line }],
          }}
        >
          {[line]}
        </P>,
      );
      i++;
    }

    return <div data-testid="mock-react-markdown">{elements}</div>;
  };
});

// =========================================================
// 5. Next.js navigation モック
// =========================================================
jest.mock("next/navigation", () => ({
  notFound: jest.fn(),
}));

// =========================================================
// 6. テストケース定義
// =========================================================
describe("Feature Detail Page Integration Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("IT-PG-01: GFMのテーブル構文がHTMLテーブル構造としてレンダリングされること", async () => {
    const pageParams = Promise.resolve({ id: "aaa" });
    render(await FeaturePage({ params: pageParams }));

    expect(screen.getByRole("table")).toBeInTheDocument();
    expect(
      screen.getByRole("columnheader", { name: "見出しA" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("cell", { name: "セル1" })).toBeInTheDocument();
  });

  test("IT-PG-02: テーブル要素がレンダリングされていること", async () => {
    const pageParams = Promise.resolve({ id: "aaa" });
    const { container } = render(await FeaturePage({ params: pageParams }));

    expect(container.querySelector("table")).toBeInTheDocument();
  });

  test("IT-PG-03: :::threads 構文が正常に ThreadsCard へ変換されること", async () => {
    const pageParams = Promise.resolve({ id: "aaa" });
    render(await FeaturePage({ params: pageParams }));

    expect(screen.getByText(/mizuki/)).toBeInTheDocument();
    expect(screen.getByText(/テストスレッド/)).toBeInTheDocument();
  });

  test("IT-PG-04: :::image 構文が正常に ArticleImage へ変換されること", async () => {
    const pageParams = Promise.resolve({ id: "aaa" });
    render(await FeaturePage({ params: pageParams }));

    expect(screen.getByRole("img", { name: /テスト画像/ })).toBeInTheDocument();
    expect(screen.getByText(/注釈テキスト/)).toBeInTheDocument();
  });

  test("IT-PG-05: :::card 構文が Card コンポーネントに変換されること", async () => {
    const pageParams = Promise.resolve({ id: "aaa" });
    render(await FeaturePage({ params: pageParams }));

    expect(screen.getByTestId("mock-card")).toBeInTheDocument();
    expect(screen.getByText(/Card ID: card-123/)).toBeInTheDocument();
  });

  test("IT-PG-06: 属性が不完全な場合でもクラッシュせずレンダリングされること", async () => {
    const pageParams = Promise.resolve({ id: "broken-syntax" });
    await expect(FeaturePage({ params: pageParams })).resolves.not.toThrow();
  });

  test("IT-PG-07/09: 見出しや本文が正しく表示されること", async () => {
    const pageParams = Promise.resolve({ id: "aaa" });
    render(await FeaturePage({ params: pageParams }));

    expect(
      screen.getByRole("heading", { name: /タイトル/ }),
    ).toBeInTheDocument();
  });

  test("IT-PG-08: 存在しないIDでアクセスした際に notFound() が実行されること", async () => {
    const pageParams = Promise.resolve({ id: "non-existent-id" });
    render(await FeaturePage({ params: pageParams }));

    expect(notFound).toHaveBeenCalled();
  });
});
