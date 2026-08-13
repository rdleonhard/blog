import { sitePath } from "../lib/paths";
import { SITE } from "../lib/site";
import { CODEX } from "../data/codex";
import {
  comparePostsChrono,
  folioNumbers,
  getSortedPosts,
  readingTime,
} from "../lib/posts";

/** Machine-readable manifest of the whole archive. */
export async function GET({ site }: { site: URL }) {
  const posts = await getSortedPosts();
  const ascending = [...posts].sort(comparePostsChrono);
  const folio = folioNumbers(posts);
  const siteUrl = site ?? new URL(SITE.url);
  const abs = (path: string) => new URL(sitePath(path), siteUrl).toString();
  const newest = ascending[ascending.length - 1]?.data.publishDate ?? null;

  const manifest = {
    title: SITE.title,
    description: SITE.description,
    author: SITE.author,
    home: abs(""),
    source: SITE.repo,
    formats: {
      html: abs(""),
      text: abs("codex.txt"),
      rss: abs("rss.xml"),
      jsonFeed: abs("feed.json"),
      sitemap: abs("sitemap.xml"),
      llms: abs("llms.txt"),
    },
    asOf: newest ? newest.toISOString() : null,
    count: ascending.length,
    codex: CODEX.map((book) => ({
      book: book.numeral,
      title: book.title,
      argument: book.intro,
      posts: book.posts,
    })),
    posts: ascending.map((post) => ({
      folio: folio.get(post.id) ?? 0,
      id: post.id,
      title: post.data.title,
      description: post.data.description,
      publishDate: post.data.publishDate.toISOString(),
      ...(post.data.updatedDate && { updatedDate: post.data.updatedDate.toISOString() }),
      tags: post.data.tags,
      words: (post.body ?? "").trim().split(/\s+/).filter(Boolean).length,
      minutes: readingTime(post.body),
      url: abs(`posts/${post.id}/`),
      text: abs(`posts/${post.id}.txt`),
    })),
  };

  return new Response(JSON.stringify(manifest, null, 2), {
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
}
