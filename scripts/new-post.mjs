import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const title = process.argv.slice(2).join(" ").trim();

if (!title) {
  console.error('Usage: npm run new:post -- "Post Title"');
  process.exit(1);
}

const slug = title
  .toLowerCase()
  .replace(/['"]/g, "")
  .replace(/[^a-z0-9]+/g, "-")
  .replace(/^-|-$/g, "");

const postsDir = join(process.cwd(), "src", "content", "posts");
const postPath = join(postsDir, `${slug}.md`);
const publishDate = new Date().toISOString().slice(0, 10);

if (existsSync(postPath)) {
  console.error(`Post already exists: ${postPath}`);
  process.exit(1);
}

mkdirSync(postsDir, { recursive: true });
writeFileSync(
  postPath,
  `---
title: "${title.replaceAll('"', '\\"')}"
description: "Add a clear one-sentence signal summary."
publishDate: ${publishDate}
tags:
  - transmission
draft: true
---

Start transmitting here.
`,
);

console.log(`Created ${postPath}`);
