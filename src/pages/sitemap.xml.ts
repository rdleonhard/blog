import { basePath, sitePath } from "../lib/paths";
import { getPublishedPosts } from "../lib/posts";
import { SITE } from "../lib/site";
import { escapeXml } from "../lib/xml";

export async function GET({ site }: { site: URL }) {
  const posts = await getPublishedPosts();
  const siteUrl = site ?? new URL(SITE.url);
  const staticPages = [basePath, `${basePath}posts/`];
  const postPages = posts.map((post) => ({
    path: sitePath(`posts/${post.id}/`),
    lastmod: (post.data.updatedDate ?? post.data.publishDate).toISOString().slice(0, 10),
  }));

  const staticUrls = staticPages
    .map(
      (path) => `
        <url>
          <loc>${escapeXml(new URL(path, siteUrl).toString())}</loc>
        </url>`,
    )
    .join("");

  const postUrls = postPages
    .map(
      ({ path, lastmod }) => `
        <url>
          <loc>${escapeXml(new URL(path, siteUrl).toString())}</loc>
          <lastmod>${lastmod}</lastmod>
        </url>`,
    )
    .join("");

  return new Response(
    `<?xml version="1.0" encoding="UTF-8" ?>
      <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        ${staticUrls}
        ${postUrls}
      </urlset>`,
    {
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
      },
    },
  );
}
