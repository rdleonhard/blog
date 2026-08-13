/**
 * Archive integrity gate, run before every build:
 *  - every relative post link (../slug/) must point to a real post
 *  - no post may link to a post published after itself (chronology violation)
 *  - every page link (../../page/) must point to a known page
 *  - every non-draft post needs title, description, publishDate
 */
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const POSTS_DIR = join(process.cwd(), "src", "content", "posts");
const KNOWN_PAGES = new Set(["codex", "glossary", "about", "posts", "tags"]);

const files = readdirSync(POSTS_DIR).filter((f) => f.endsWith(".md") || f.endsWith(".mdx"));
const posts = new Map();
const errors = [];

for (const file of files) {
  const slug = file.replace(/\.(md|mdx)$/, "").toLowerCase();
  const raw = readFileSync(join(POSTS_DIR, file), "utf8");
  const fm = raw.match(/^---\n([\s\S]*?)\n---/);
  if (!fm) {
    errors.push(`${file}: missing frontmatter`);
    continue;
  }
  const head = fm[1];
  const get = (key) => head.match(new RegExp(`^${key}:\\s*"?([^"\\n]+)"?\\s*$`, "m"))?.[1];
  const dateRaw = get("publishDate");
  const date = dateRaw ? new Date(dateRaw) : null;
  if (!get("title")) errors.push(`${file}: missing title`);
  if (!get("description")) errors.push(`${file}: missing description`);
  if (!date || Number.isNaN(date.valueOf())) errors.push(`${file}: missing or invalid publishDate`);
  const draft = /^draft:\s*true\s*$/m.test(head);
  posts.set(slug, { file, date, draft, body: raw.slice(fm[0].length) });
}

for (const post of posts.values()) {
  if (post.draft) continue;
  for (const match of post.body.matchAll(/\]\((\.\.\/[^)\s]+)\)/g)) {
    const href = match[1];
    const pageMatch = href.match(/^\.\.\/\.\.\/([a-z0-9_-]+)(?:\/|\.txt)?$/);
    const postMatch = href.match(/^\.\.\/([a-z0-9_-]+)\/$/);
    if (pageMatch) {
      if (!KNOWN_PAGES.has(pageMatch[1])) {
        errors.push(`${post.file}: unknown page link ${href}`);
      }
      continue;
    }
    if (!postMatch) {
      errors.push(`${post.file}: malformed relative link ${href} (expected ../slug/ or ../../page/)`);
      continue;
    }
    const target = posts.get(postMatch[1]);
    if (!target) {
      errors.push(`${post.file}: link to unknown post ${href}`);
      continue;
    }
    if (target.draft) {
      errors.push(`${post.file}: links to draft post ${postMatch[1]}`);
      continue;
    }
    if (post.date && target.date && target.date.valueOf() > post.date.valueOf()) {
      errors.push(
        `${post.file} (${post.date.toISOString().slice(0, 10)}): links FORWARD in time to ` +
          `${postMatch[1]} (${target.date.toISOString().slice(0, 10)})`,
      );
    }
  }
}

if (errors.length > 0) {
  console.error(`check-links: ${errors.length} problem(s)\n`);
  for (const error of errors) console.error(`  ✗ ${error}`);
  process.exit(1);
}

console.log(`check-links: ${posts.size} posts, all links resolve, chronology holds.`);
