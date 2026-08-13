import { sitePath } from "../lib/paths";
import { SITE } from "../lib/site";
import { getSortedPosts } from "../lib/posts";

/** JSON Feed 1.1 with full rendered content. */
export async function GET({ site }: { site: URL }) {
  const posts = await getSortedPosts();
  const siteUrl = site ?? new URL(SITE.url);
  const abs = (path: string) => new URL(sitePath(path), siteUrl).toString();
  const postsBase = abs("posts/");
  const siteBase = abs("");

  const feed = {
    version: "https://jsonfeed.org/version/1.1",
    title: SITE.title,
    home_page_url: siteBase,
    feed_url: abs("feed.json"),
    description: SITE.description,
    language: "en-US",
    authors: [{ name: SITE.author }],
    items: posts.map((post) => {
      // Post-relative links (../slug/, ../../page/) only resolve inside the
      // site; rewrite them to absolute URLs for feed readers.
      const html = (post.rendered?.html ?? "")
        .replaceAll('href="../../', `href="${siteBase}`)
        .replaceAll('href="../', `href="${postsBase}`);

      return {
        id: abs(`posts/${post.id}/`),
        url: abs(`posts/${post.id}/`),
        title: post.data.title,
        summary: post.data.description,
        content_html: html,
        date_published: post.data.publishDate.toISOString(),
        ...(post.data.updatedDate && { date_modified: post.data.updatedDate.toISOString() }),
        tags: post.data.tags,
      };
    }),
  };

  return new Response(JSON.stringify(feed, null, 2), {
    headers: { "Content-Type": "application/feed+json; charset=utf-8" },
  });
}
