import { SITE } from "../lib/site";

export function GET({ site }: { site: URL }) {
  const siteUrl = site ?? new URL(SITE.url);
  const basePath = import.meta.env.BASE_URL;
  const sitemapUrl = new URL(`${basePath}sitemap.xml`, siteUrl).toString();

  return new Response(
    `User-agent: *
Allow: /

Sitemap: ${sitemapUrl}
`,
    {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      },
    },
  );
}
