import { sitePath } from "../lib/paths";
import { SITE } from "../lib/site";
import { CODEX } from "../data/codex";
import {
  comparePostsChrono,
  folioNumbers,
  formatDate,
  getSortedPosts,
} from "../lib/posts";

/**
 * The entire archive as one plain-text file: a header, the codex table of
 * contents, then every transmission in chronological order. Deliberately
 * ASCII-framed and dependency-free — the copy you keep.
 */
export async function GET({ site }: { site: URL }) {
  const posts = await getSortedPosts();
  const ascending = [...posts].sort(comparePostsChrono);
  const folio = folioNumbers(posts);
  const siteUrl = site ?? new URL(SITE.url);
  const homeUrl = new URL(sitePath(""), siteUrl).toString();
  const newest = ascending[ascending.length - 1]?.data.publishDate;

  const rule = "=".repeat(72);
  const thinRule = "-".repeat(72);

  const header = [
    rule,
    SITE.title.toUpperCase(),
    rule,
    "",
    SITE.description,
    "",
    `Author: ${SITE.author}`,
    `Home: ${homeUrl}`,
    `Transmissions: ${ascending.length}`,
    `Last transmission: ${newest ? formatDate(newest) : "n/a"}`,
    "",
    "This file is the complete archive in one document. Plain text, no",
    "dependencies, safe to copy to anything that stores bytes. If you are",
    "reading this long after the site is gone: it worked.",
    "",
    rule,
    "THE CODEX — reading order by argument",
    rule,
    "",
    ...CODEX.flatMap((book) => [
      `BOOK ${book.numeral} — ${book.title.toUpperCase()}`,
      ...book.posts.map((id) => {
        const post = ascending.find((p) => p.id === id);
        return post
          ? `  No. ${String(folio.get(id) ?? 0).padStart(2, " ")}  ${post.data.title}`
          : `  ??  ${id}`;
      }),
      "",
    ]),
    rule,
    "THE TRANSMISSIONS — chronological",
    rule,
  ].join("\n");

  const body = ascending
    .map((post) => {
      const head = [
        "",
        "",
        thinRule,
        `No. ${folio.get(post.id)} — ${post.data.title.toUpperCase()}`,
        `${formatDate(post.data.publishDate)} · ${post.data.tags.join(", ")}`,
        thinRule,
        "",
        post.data.description,
        "",
      ].join("\n");
      return `${head}${(post.body ?? "").trim()}`;
    })
    .join("\n");

  const footer = [
    "",
    "",
    rule,
    "END OF CODEX",
    "This happened. This much. This is what it felt like.",
    rule,
    "",
  ].join("\n");

  return new Response(`${header}${body}${footer}`, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
