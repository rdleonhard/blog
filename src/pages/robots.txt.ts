import { sitePath } from "../lib/paths";
import { SITE } from "../lib/site";

export function GET({ site }: { site: URL }) {
  const siteUrl = site ?? new URL(SITE.url);
  const sitemapUrl = new URL(sitePath("sitemap.xml"), siteUrl).toString();

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
