const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const outputFile = path.join(process.cwd(), "changes.txt");

// Gitの変更状態を取得
const status = execSync("git status --porcelain", {
  encoding: "utf8",
});

// 既存ファイルの変更差分
const diff = execSync("git diff --no-color", {
  encoding: "utf8",
});

let output = "";

output += "========================================\n";
output += "Git Changes Review\n";
output += "========================================\n\n";

output += "このファイルはコミット前の変更内容をまとめたものです。\n";
output += "M = 既存ファイルの変更\n";
output += "?? = 新規ファイル\n\n";

// ----------------------------------------
// 変更ファイル一覧
// ----------------------------------------

output += "========================================\n";
output += "変更ファイル一覧\n";
output += "========================================\n\n";

if (status.trim()) {
  output += status;
  output += "\n\n";
} else {
  output += "変更はありません。\n\n";
}

// ----------------------------------------
// 既存ファイルの差分
// ----------------------------------------

output += "========================================\n";
output += "既存ファイルの変更差分\n";
output += "========================================\n\n";

if (diff.trim()) {
  output += diff;
  output += "\n\n";
} else {
  output += "既存ファイルの変更差分はありません。\n\n";
}

// ----------------------------------------
// 新規ファイル
// ----------------------------------------

const lines = status.split(/\r?\n/);

const untrackedFiles = lines
  .filter((line) => line.startsWith("?? "))
  .map((line) => line.substring(3).trim());

output += "========================================\n";
output += "新規ファイル\n";
output += "========================================\n\n";

if (untrackedFiles.length === 0) {
  output += "新規ファイルはありません。\n";
} else {
  for (const file of untrackedFiles) {
    const filePath = path.join(process.cwd(), file);

    output += `\n----------------------------------------\n`;
    output += `NEW FILE: ${file}\n`;
    output += `----------------------------------------\n\n`;

    try {
      const content = fs.readFileSync(filePath, "utf8");
      output += content;
      output += "\n";
    } catch (error) {
      output += `[ファイルを読み込めませんでした]\n`;
      output += `${error.message}\n`;
    }
  }
}

// ----------------------------------------
// ファイル出力
// ----------------------------------------

fs.writeFileSync(outputFile, output, "utf8");

console.log(`changes.txt を生成しました。`);
console.log(`対象ファイル数: ${lines.filter(Boolean).length}`);
