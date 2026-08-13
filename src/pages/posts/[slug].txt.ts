import { sitePath } from "../../lib/paths";
import { SITE } from "../../lib/site";
import {
  folioNumbers,
  formatDate,
  getSortedPosts,
  type Post,
} from "../../lib/posts";

export async function getStaticPaths() {
  const posts = await getSortedPosts();
  const folio = folioNumbers(posts);

  return posts.map((post) => ({
    params: { slug: post.id },
    props: { post, folio: folio.get(post.id) ?? 0 },
  }));
}

export function GET({
  props,
  site,
}: {
  props: { post: Post; folio: number };
  site: URL;
}) {
  const { post, folio } = props;
  const siteUrl = site ?? new URL(SITE.url);
  const canonical = new URL(sitePath(`posts/${post.id}/`), siteUrl).toString();

  const header = [
    `${SITE.title.toUpperCase()} — plain-text mirror`,
    `Transmission No. ${folio}: ${post.data.title}`,
    `Author: ${SITE.author}`,
    `Date: ${formatDate(post.data.publishDate)}`,
    ...(post.data.updatedDate ? [`Updated: ${formatDate(post.data.updatedDate)}`] : []),
    `Tags: ${post.data.tags.join(", ")}`,
    `Canonical: ${canonical}`,
    "",
    post.data.description,
    "",
    "-".repeat(72),
    "",
  ].join("\n");

  return new Response(`${header}${(post.body ?? "").trim()}\n`, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
