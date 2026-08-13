import { getCollection } from "astro:content";
import { basePath, sitePath } from "../lib/paths";
import { SITE } from "../lib/site";
import { collectTags, tagSlug } from "../lib/posts";

const escapeXml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");

interface Entry {
  path: string;
  lastmod?: Date;
}

export async function GET({ site }: { site: URL }) {
  const posts = (await getCollection("posts", ({ data }) => !data.draft)).sort(
    (a, b) => b.data.publishDate.valueOf() - a.data.publishDate.valueOf(),
  );

  const siteUrl = site ?? new URL(SITE.url);
  const newest = posts[0]?.data.publishDate;

  const entries: Entry[] = [
    { path: basePath, lastmod: newest },
    { path: `${basePath}posts/`, lastmod: newest },
    { path: `${basePath}codex/`, lastmod: newest },
    { path: `${basePath}glossary/`, lastmod: newest },
    { path: `${basePath}tags/`, lastmod: newest },
    { path: `${basePath}about/` },
    ...posts.map((post) => ({
      path: sitePath(`posts/${post.id}/`),
      lastmod: post.data.updatedDate ?? post.data.publishDate,
    })),
    ...collectTags(posts).map((tag) => ({
      path: sitePath(`tags/${tagSlug(tag.tag)}/`),
      lastmod: newest,
    })),
  ];

  const urls = entries
    .map(({ path, lastmod }) => {
      const loc = new URL(path, siteUrl).toString();
      const lastmodTag = lastmod
        ? `\n          <lastmod>${lastmod.toISOString().slice(0, 10)}</lastmod>`
        : "";

      return `
        <url>
          <loc>${escapeXml(loc)}</loc>${lastmodTag}
        </url>`;
    })
    .join("");

  return new Response(
    `<?xml version="1.0" encoding="UTF-8" ?>
      <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        ${urls}
      </urlset>`,
    {
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
      },
    },
  );
}
