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
  const staticPages = [basePath, `${basePath}posts/`];
  const postPages = posts.map((post) => `${basePath}posts/${post.id}/`);

  const urls = [...staticPages, ...postPages]
    .map((path) => {
      const loc = new URL(path, siteUrl).toString();

      return `
        <url>
          <loc>${escapeXml(loc)}</loc>
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
