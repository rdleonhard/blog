import { getCollection } from "astro:content";
import { SITE } from "../lib/site";

const escapeXml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");

export async function GET({ site }: { site: URL }) {
  const posts = (await getCollection("posts", ({ data }) => !data.draft)).sort(
    (a, b) => b.data.publishDate.valueOf() - a.data.publishDate.valueOf(),
  );

  const siteUrl = site ?? new URL(SITE.url);
  const basePath = import.meta.env.BASE_URL;

  const items = posts
    .map((post) => {
      const link = new URL(`${basePath}posts/${post.id}/`, siteUrl).toString();

      return `
        <item>
          <title>${escapeXml(post.data.title)}</title>
          <description>${escapeXml(post.data.description)}</description>
          <link>${link}</link>
          <guid>${link}</guid>
          <pubDate>${post.data.publishDate.toUTCString()}</pubDate>
        </item>`;
    })
    .join("");

  return new Response(
    `<?xml version="1.0" encoding="UTF-8" ?>
      <rss version="2.0">
        <channel>
          <title>${escapeXml(SITE.title)}</title>
          <description>${escapeXml(SITE.description)}</description>
          <link>${new URL(basePath, siteUrl).toString()}</link>
          <language>en-us</language>
          ${items}
        </channel>
      </rss>`,
    {
      headers: {
        "Content-Type": "application/rss+xml; charset=utf-8",
      },
    },
  );
}
