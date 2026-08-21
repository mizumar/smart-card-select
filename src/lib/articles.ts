import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { Article } from "@/data/articles";

const articlesDirectory = path.join(process.cwd(), "src/content/articles");

// 全記事の取得（日付降順）
export function getAllArticles(): Article[] {
  if (!fs.existsSync(articlesDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(articlesDirectory);
  const allArticles = fileNames
    .filter((fileName) => fileName.endsWith(".md"))
    .map((fileName) => {
      const id = fileName.replace(/\.md$/, "");
      const fullPath = path.join(articlesDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, "utf8");

      const { data, content } = matter(fileContents);

      return {
        id,
        title: data.title,
        excerpt: data.excerpt,
        date: data.date,
        category: data.category,
        readTime: data.readTime,
        content: content, // 本文（Markdown文字列）
      } as Article;
    });

  // 日付降順（"YYYY.MM.DD" または "YYYY-MM-DD"）でソート
  return allArticles.sort((a, b) => {
    const dateA = new Date(a.date.replace(/\./g, "-")).getTime();
    const dateB = new Date(b.date.replace(/\./g, "-")).getTime();
    return dateB - dateA;
  });
}

// ID指定による単一記事の取得
export function getArticleById(id: string): Article | null {
  try {
    const fullPath = path.join(articlesDirectory, `${id}.md`);
    if (!fs.existsSync(fullPath)) return null;

    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data, content } = matter(fileContents);

    return {
      id,
      title: data.title,
      excerpt: data.excerpt,
      date: data.date,
      category: data.category,
      readTime: data.readTime,
      content: content,
    } as Article;
  } catch (error) {
    return null;
  }
}
