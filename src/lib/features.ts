import fs from "fs";
import path from "path";
import matter from "gray-matter";

export interface Feature {
  id: string;
  title?: string;
  description?: string;
  date?: string; // date または updatedAt を吸収
  icon?: string;
  cardIds?: string[];
}

/**
 * src/content/features 配下のすべてのMarkdownを取得して返します
 */
export function getAllFeatures(): Feature[] {
  const featuresDirectory = path.join(process.cwd(), "src/content/features");

  // ディレクトリが存在しない場合は空配列を返す
  if (!fs.existsSync(featuresDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(featuresDirectory);

  const allFeatures = fileNames
    .filter((fileName) => fileName.endsWith(".md"))
    .map((fileName) => {
      // ファイル名から id を抽出 (例: "fee-free.md" -> "fee-free")
      const id = fileName.replace(/\.md$/, "");

      // ファイルの中身を読み込み
      const fullPath = path.join(featuresDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, "utf8");

      // matter で Frontmatter と本文をパース
      const { data } = matter(fileContents);

      return {
        id,
        title: data.title,
        description: data.description,
        // updatedAt または date のどちらが入っていても対応
        date: data.updatedAt || data.date || null,
        icon: data.icon,
        cardIds: data.cardIds || [],
      };
    });

  return allFeatures;
}
