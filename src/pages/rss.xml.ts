import { getCollection } from "astro:content";
import { basePath, sitePath } from "../lib/paths";
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
  const feedUrl = new URL(sitePath("rss.xml"), siteUrl).toString();
  const homeUrl = new URL(basePath, siteUrl).toString();
  const lastBuild = posts[0]?.data.publishDate.toUTCString() ?? new Date().toUTCString();

  const items = posts
    .map((post) => {
      const link = new URL(sitePath(`posts/${post.id}/`), siteUrl).toString();
      const categories = post.data.tags
        .map((tag) => `\n          <category>${escapeXml(tag)}</category>`)
        .join("");

      return `
        <item>
          <title>${escapeXml(post.data.title)}</title>
          <description>${escapeXml(post.data.description)}</description>
          <link>${link}</link>
          <guid isPermaLink="true">${link}</guid>
          <dc:creator>${escapeXml(SITE.author)}</dc:creator>
          <pubDate>${post.data.publishDate.toUTCString()}</pubDate>${categories}
        </item>`;
    })
    .join("");

  return new Response(
    `<?xml version="1.0" encoding="UTF-8" ?>
      <rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">
        <channel>
          <title>${escapeXml(SITE.title)}</title>
          <description>${escapeXml(SITE.description)}</description>
          <link>${homeUrl}</link>
          <atom:link href="${feedUrl}" rel="self" type="application/rss+xml" />
          <language>en-us</language>
          <managingEditor>noreply@rdleonhard.github.io (${escapeXml(SITE.author)})</managingEditor>
          <lastBuildDate>${lastBuild}</lastBuildDate>
          <generator>Astro</generator>
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
