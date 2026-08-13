import { getCollection, type CollectionEntry } from "astro:content";

export type Post = CollectionEntry<"posts">;

/**
 * Deterministic tie-break for posts sharing a publish date, in narrative order.
 * (The June 20, 2026 trio references one another in this sequence.)
 */
const TIE_ORDER = ["soft_boi_supremacy", "the_girl_who_styles_his_hair", "edgar_i_nothing_am"];

/** Chronological comparator: oldest first, stable across builds. */
export function comparePostsChrono(a: Post, b: Post): number {
  const delta = a.data.publishDate.valueOf() - b.data.publishDate.valueOf();
  if (delta !== 0) return delta;
  const ai = TIE_ORDER.indexOf(a.id);
  const bi = TIE_ORDER.indexOf(b.id);
  if (ai !== -1 || bi !== -1) {
    return (ai === -1 ? TIE_ORDER.length : ai) - (bi === -1 ? TIE_ORDER.length : bi);
  }
  return a.id.localeCompare(b.id);
}

/** Non-draft posts, newest first. */
export async function getSortedPosts(): Promise<Post[]> {
  const posts = await getCollection("posts", ({ data }) => !data.draft);
  return posts.sort((a, b) => comparePostsChrono(b, a));
}

/** Folio (transmission) numbers: 1 = the oldest post, in chronological order. */
export function folioNumbers(posts: Post[]): Map<string, number> {
  const ascending = [...posts].sort(comparePostsChrono);
  return new Map(ascending.map((post, index) => [post.id, index + 1]));
}

/** Roman numerals for folio display (1–3999). */
export function toRoman(n: number): string {
  const table: Array<[number, string]> = [
    [1000, "M"], [900, "CM"], [500, "D"], [400, "CD"],
    [100, "C"], [90, "XC"], [50, "L"], [40, "XL"],
    [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"],
  ];
  let out = "";
  for (const [value, glyph] of table) {
    while (n >= value) {
      out += glyph;
      n -= value;
    }
  }
  return out;
}

/** Rough reading time in minutes, from the raw markdown body. */
export function readingTime(body: string | undefined): number {
  const words = (body ?? "").trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

export function formatDateShort(date: Date): string {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

/** Normalize a tag into a URL slug. */
export function tagSlug(tag: string): string {
  return tag
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export interface TagCount {
  tag: string;
  slug: string;
  count: number;
}

/** All tags across the given posts, sorted by frequency then name. */
export function collectTags(posts: Post[]): TagCount[] {
  const map = new Map<string, TagCount>();
  for (const post of posts) {
    for (const tag of post.data.tags) {
      const slug = tagSlug(tag);
      const existing = map.get(slug);
      if (existing) {
        existing.count += 1;
      } else {
        map.set(slug, { tag, slug, count: 1 });
      }
    }
  }
  return [...map.values()].sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}

/** Posts sharing the most tags with the given post, newest first as tiebreak. */
export function relatedPosts(post: Post, all: Post[], limit = 3): Post[] {
  const tags = new Set(post.data.tags.map(tagSlug));
  return all
    .filter((candidate) => candidate.id !== post.id)
    .map((candidate) => ({
      post: candidate,
      shared: candidate.data.tags.filter((t) => tags.has(tagSlug(t))).length,
    }))
    .filter((entry) => entry.shared > 0)
    .sort(
      (a, b) =>
        b.shared - a.shared ||
        b.post.data.publishDate.valueOf() - a.post.data.publishDate.valueOf(),
    )
    .slice(0, limit)
    .map((entry) => entry.post);
}
